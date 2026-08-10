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
  return [
    "## Summary",
    issue?.title || "Forge changes.",
    "",
    "## Changes",
    `- Updates for ${issue?.linear_id || "this Forge issue"}.`,
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
  // `gh pr create --base`. Do not integrate with Graphite/gt here.
  const prs = openPrs(prStack);
  const steps = [{ kind: "fetch-base", branch: baseBranch, ref: `refs/remotes/origin/${baseBranch}` }];

  for (const pr of prs) {
    const base = branchBase(pr, prs, pr.base_pr_id ? null : baseBranch);
    steps.push({ kind: "checkout", branch: pr.gt_branch });
    steps.push({ kind: "pull-branch", branch: pr.gt_branch });
    steps.push({ kind: "rebase", base: pr.base_pr_id ? base : `refs/remotes/origin/${baseBranch}` });
    steps.push({ kind: "push", branch: pr.gt_branch, forceWithLease: state === "PUSHING" || Boolean(pr.pr_number) });
    if (state === "CREATING_PR" && !pr.pr_number) {
      const prBase = pr.base_pr_id ? base : baseBranch;
      steps.push({
        kind: "create-pr",
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

function writePrBody(body) {
  const file = path.join(require("os").tmpdir(), `forge-pr-${process.pid}-${Date.now()}.md`);
  fs.writeFileSync(file, body, "utf-8");
  return file;
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
    } else if (step.kind === "create-pr") {
      const bodyFile = writePrBody(step.body);
      try {
        execFileSync("gh", ["pr", "create", "--base", step.base, "--head", step.branch, "--title", step.title, "--body-file", bodyFile], { cwd, encoding: "utf-8", timeout: 120000, stdio: "pipe" });
        const out = execFileSync("gh", ["pr", "view", step.branch, "--json", "number"], { cwd, encoding: "utf-8", timeout: 120000 });
        const number = JSON.parse(out).number;
        prNumbersByBranch.set(step.branch, number);
        log(`Created PR #${number} for ${step.branch}`);
      } finally {
        try { fs.unlinkSync(bodyFile); } catch {}
      }
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
