"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

function parsePlanFrontmatter(content) {
  const text = String(content || "");
  if (!text.startsWith("---\n")) return { frontmatter: {}, body: text };
  const end = text.indexOf("\n---", 4);
  if (end === -1) return { frontmatter: {}, body: text };
  const raw = text.slice(4, end).trimEnd();
  const body = text.slice(end + 5).replace(/^\n/, "");
  const frontmatter = {};
  for (const line of raw.split("\n")) {
    const match = line.match(/^([^:#]+):\s*(.*)$/);
    if (match) frontmatter[match[1].trim()] = match[2].trim();
  }
  return { frontmatter, body };
}

function openPrs(prStack) {
  return [...(prStack || [])]
    .filter(pr => pr?.gt_branch && pr.status !== "merged" && pr.status !== "closed")
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

function branchBase(pr, allPrs, defaultBase) {
  const parent = pr.base_pr_id ? allPrs.find(candidate => candidate.id === pr.base_pr_id) : null;
  return parent?.gt_branch || defaultBase;
}

function makeRebasePlan({ baseBranch = "main", prStack = [] }) {
  const prs = openPrs(prStack);
  const defaultBase = `refs/remotes/origin/${baseBranch}`;
  return {
    baseBranch,
    branches: prs.map(pr => ({
      branch: pr.gt_branch,
      base: branchBase(pr, prs, defaultBase),
      forcePush: true,
    })),
  };
}

function defaultPrTitle(issue, pr, total) {
  const prefix = issue?.linear_id ? `${issue.linear_id}: ` : "";
  const suffix = total > 1 ? ` (${pr.position}/${total})` : "";
  return `${prefix}${issue?.title || "Forge changes"}${suffix}`;
}

function defaultPrBody(issue, pr, base) {
  let planSummary = "";
  try {
    const content = issue?.project_file_path ? fs.readFileSync(issue.project_file_path, "utf-8") : "";
    const parsed = parsePlanFrontmatter(content);
    planSummary = parsed.body.split("\n").find(line => line.trim() && !line.startsWith("#"))?.trim() || "";
  } catch {}
  return [
    "## Summary",
    planSummary || issue?.title || "Forge changes.",
    "",
    "## Changes",
    `- Updates for ${issue?.linear_id || "this Forge issue"}.`,
    "- See the Forge plan and commit diff for implementation details.",
    "",
    "## Stack context",
    `This PR targets ${base}.`,
    "",
    "## Testing",
    "Not run by deterministic git agent.",
    "",
  ].join("\n");
}

function makeGitAgentPlan({ state, issue = {}, baseBranch = "main", prStack = [] }) {
  // GitHub-native stacked PRs only: each child PR uses its parent branch as
  // the REST-created PR base. Do not integrate with Graphite/gt here.
  const prs = openPrs(prStack);
  const steps = [{ kind: "fetch-base", branch: baseBranch, ref: `refs/remotes/origin/${baseBranch}` }];

  for (const pr of prs) {
    const base = branchBase(pr, prs, pr.base_pr_id ? null : baseBranch);
    steps.push({ kind: "checkout", branch: pr.gt_branch });
    steps.push({ kind: "pull-branch", branch: pr.gt_branch });
    steps.push({ kind: "rebase", base: pr.base_pr_id ? base : `refs/remotes/origin/${baseBranch}` });
    steps.push({ kind: "push", branch: pr.gt_branch, forceWithLease: state === "PUSHING" || Boolean(pr.pr_number) });
    if (state === "CREATING_PR") {
      const prBase = pr.base_pr_id ? base : baseBranch;
      steps.push({
        kind: "upsert-pr",
        branch: pr.gt_branch,
        base: prBase,
        title: defaultPrTitle(issue, pr, prs.length),
        body: defaultPrBody(issue, pr, prBase),
      });
    }
  }

  steps.push({ kind: "write-prs-json", projectFilePath: issue.project_file_path });
  return { state, baseBranch, steps };
}

function git(cwd, args, opts = {}) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf-8",
    timeout: opts.timeout ?? 120000,
    stdio: opts.stdio ?? ["ignore", "pipe", "pipe"],
    maxBuffer: opts.maxBuffer ?? 20 * 1024 * 1024,
  });
}

function runRebasePlan({ cwd, plan, log = console.log }) {
  if (!cwd) throw new Error("cwd is required");
  if (!plan?.branches?.length) throw new Error("No branches to rebase");
  const status = git(cwd, ["status", "--porcelain"]);
  if (status.trim()) throw new Error("Worktree has uncommitted changes; refusing to rebase");
  git(cwd, ["fetch", "--prune", "origin", `+refs/heads/${plan.baseBranch}:refs/remotes/origin/${plan.baseBranch}`], { stdio: "inherit" });
  const original = git(cwd, ["rev-parse", "--abbrev-ref", "HEAD"]).trim();
  try {
    for (const branch of plan.branches) {
      log(`Rebasing ${branch.branch} onto ${branch.base}`);
      git(cwd, ["checkout", branch.branch], { stdio: "inherit" });
      git(cwd, ["rebase", branch.base], { stdio: "inherit" });
      git(cwd, ["push", "--force-with-lease", "origin", branch.branch], { stdio: "inherit" });
    }
  } finally {
    if (original && original !== "HEAD") {
      try { git(cwd, ["checkout", original], { stdio: "inherit" }); } catch {}
    }
  }
}

function writeTempJson(data) {
  const file = path.join(require("os").tmpdir(), `forge-pr-${process.pid}-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify(data), "utf-8");
  return file;
}

function repoFromOrigin(cwd) {
  const remote = git(cwd, ["remote", "get-url", "origin"]).trim();
  const match = remote.match(/github\.com[:/]([^/]+\/[^/.]+)(?:\.git)?$/);
  if (!match) throw new Error(`Cannot parse GitHub repo from origin URL: ${remote}`);
  return match[1];
}

function githubRest(cwd, args, opts = {}) {
  const out = execFileSync("gh", ["api", ...args], {
    cwd,
    encoding: "utf-8",
    timeout: opts.timeout ?? 120000,
    stdio: opts.stdio ?? ["ignore", "pipe", "pipe"],
    maxBuffer: opts.maxBuffer ?? 20 * 1024 * 1024,
  });
  return out.trim() ? JSON.parse(out) : null;
}

function upsertPullRequestRest(cwd, { base, branch, title, body }) {
  const repo = repoFromOrigin(cwd);
  const owner = repo.split("/")[0];
  const head = `${owner}:${branch}`;
  const query = new URLSearchParams({ head, base, state: "open", per_page: "1" });
  const existing = githubRest(cwd, [`repos/${repo}/pulls?${query.toString()}`]) || [];
  const payload = { title, body };
  let input = writeTempJson(payload);
  try {
    if (existing[0]?.number) {
      return githubRest(cwd, ["-X", "PATCH", `repos/${repo}/pulls/${existing[0].number}`, "--input", input]);
    }
  } finally {
    try { fs.unlinkSync(input); } catch {}
  }

  input = writeTempJson({ ...payload, base, head });
  try {
    return githubRest(cwd, ["-X", "POST", `repos/${repo}/pulls`, "--input", input]);
  } finally {
    try { fs.unlinkSync(input); } catch {}
  }
}

function runGitAgentPlan({ cwd, plan, prStack = [], log = console.log }) {
  const prNumbersByBranch = new Map(prStack.map(pr => [pr.gt_branch, pr.pr_number]).filter(([, n]) => n));
  for (const step of plan.steps) {
    if (step.kind === "fetch-base") {
      git(cwd, ["fetch", "--prune", "origin", `+refs/heads/${step.branch}:${step.ref}`], { stdio: "inherit" });
    } else if (step.kind === "checkout") {
      git(cwd, ["checkout", step.branch], { stdio: "inherit" });
    } else if (step.kind === "pull-branch") {
      try { git(cwd, ["fetch", "--prune", "origin", `+refs/heads/${step.branch}:refs/remotes/origin/${step.branch}`], { stdio: "inherit" }); } catch {}
      try { git(cwd, ["merge", "--ff-only", `refs/remotes/origin/${step.branch}`], { stdio: "inherit" }); } catch {}
    } else if (step.kind === "rebase") {
      git(cwd, ["rebase", step.base], { stdio: "inherit" });
    } else if (step.kind === "push") {
      if (step.forceWithLease) {
        let lease = `--force-with-lease=refs/heads/${step.branch}`;
        try {
          const expected = git(cwd, ["rev-parse", "--verify", `refs/remotes/origin/${step.branch}`]).trim();
          if (expected) lease = `--force-with-lease=refs/heads/${step.branch}:${expected}`;
        } catch {}
        git(cwd, ["push", lease, "-u", "origin", step.branch], { stdio: "inherit" });
      } else {
        git(cwd, ["push", "-u", "origin", step.branch], { stdio: "inherit" });
      }
    } else if (step.kind === "upsert-pr") {
      const pr = upsertPullRequestRest(cwd, { base: step.base, branch: step.branch, title: step.title, body: step.body });
      const number = pr?.number;
      if (!number) throw new Error(`GitHub REST PR upsert did not return a PR number for ${step.branch}`);
      prNumbersByBranch.set(step.branch, number);
      log(`${pr.html_url ? "Upserted" : "Created/updated"} PR #${number} for ${step.branch} via GitHub REST`);
    }
  }
  const prs = [...new Set(prStack.map(pr => pr.gt_branch))].map((branch, index) => ({
    position: prStack.find(pr => pr.gt_branch === branch)?.position ?? index + 1,
    branch,
    pr_number: prNumbersByBranch.get(branch) ?? null,
  })).sort((a, b) => a.position - b.position);

  const prNumbers = prs.map(pr => pr.pr_number).filter(Boolean);
  if (prNumbers.length > 1) {
    log(`Linking ${prNumbers.length} PRs into a GitHub-native stack`);
    execFileSync("gh", ["stack", "link", "--base", plan.baseBranch || "main", "--open", ...prNumbers.map(String)], { cwd, encoding: "utf-8", timeout: 120000, stdio: "inherit" });
  }

  return prs;
}

exports.parsePlanFrontmatter = parsePlanFrontmatter;
exports.makeRebasePlan = makeRebasePlan;
exports.makeGitAgentPlan = makeGitAgentPlan;
exports.runRebasePlan = runRebasePlan;
exports.runGitAgentPlan = runGitAgentPlan;
exports.upsertPullRequestRest = upsertPullRequestRest;
