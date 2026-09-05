"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { installWorktreeSafety, removeTrackedRootNodeModulesSymlinkCommit, removeUntrackedRootNodeModulesSymlink } = require("./worktree-safety.js");

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


function cleanIssueTitle(title) {
  return String(title || "Forge changes")
    .replace(/^\s*\[[^\]]+\]\s*-\s*/, "")
    .replace(/^\s*#+\s*/, "")
    .replace(/\s+/g, " ")
    .trim() || "Forge changes";
}

function cleanPrTitleSubject(title) {
  return cleanIssueTitle(title)
    .replace(/^\s*(?:backend|frontend|fullstack|api|db|database)\s*:\s*/i, "")
    .replace(/^\s*(?:fix|feat|chore|refactor|test|docs|perf)(?:\([^)]*\))?!?:\s*/i, "")
    .replace(/[.\s]+$/g, "")
    .trim() || "forge changes";
}

function issuePlanFrontmatter(issue) {
  try {
    const content = issue?.project_file_path ? fs.readFileSync(issue.project_file_path, "utf-8") : "";
    return parsePlanFrontmatter(content).frontmatter;
  } catch {
    return {};
  }
}

function targetText(issue) {
  const fm = issuePlanFrontmatter(issue);
  return [
    issue?.target_kind,
    issue?.target_paths_json,
    issue?.scope_notes,
    issue?.title,
    fm.app,
    fm["target-kind"],
    fm["target-paths"],
    planBody(issue).slice(0, 2000),
  ].filter(Boolean).join("\n").toLowerCase();
}

function productPrefixForIssue(issue) {
  const text = targetText(issue);
  if (/\b(pricing|market pricing|marketpricing|bands|band set|band-set)\b/.test(text) || /frontend\/apps\/pricing|modules\/marketpricing\/pricing/i.test(text)) return "[MP] ";
  return "";
}

function conventionalTypeForIssue(issue, title) {
  const explicit = String(title || "").match(/^\s*(fix|feat|chore|refactor|test|docs|perf)(?:\([^)]*\))?!?:/i)?.[1];
  if (explicit) return explicit.toLowerCase();
  const text = `${issue?.title || ""} ${title || ""}`.toLowerCase();
  if (/\b(test|coverage|spec)\b/.test(text)) return "test";
  if (/\b(refactor|cleanup|simplif)/.test(text)) return "refactor";
  if (/\b(add|create|support|enable)\b/.test(text) && !/\b(bug|fix|fail|hang|error|broken|regress|stale|wrong|missing)\b/.test(text)) return "feat";
  return "fix";
}

function sentenceCaseSubject(subject) {
  const cleaned = String(subject || "").trim();
  return cleaned ? cleaned[0].toLowerCase() + cleaned.slice(1) : "forge changes";
}

function planBody(issue) {
  try {
    const content = issue?.project_file_path ? fs.readFileSync(issue.project_file_path, "utf-8") : "";
    return parsePlanFrontmatter(content).body;
  } catch {
    return "";
  }
}

function extractPrSections(body) {
  const sections = [];
  const regex = /^##\s+PR\s+(\d+)\s+[—-]\s+(.+)$/gm;
  let match;
  const matches = [];
  while ((match = regex.exec(body))) matches.push(match);
  for (let i = 0; i < matches.length; i += 1) {
    const current = matches[i];
    const next = matches[i + 1];
    sections.push({
      position: Number(current[1]),
      title: current[2].trim(),
      text: body.slice(current.index + current[0].length, next?.index ?? body.length).trim(),
    });
  }
  return sections;
}

function prSectionFor(issue, pr) {
  return extractPrSections(planBody(issue)).find(section => section.position === pr.position) || null;
}

function firstPlanParagraph(body) {
  const beforeStack = body.split(/^#\s+PR Stack\s*$/m)[0] || body;
  return beforeStack
    .split(/\n{2,}/)
    .map(part => part.replace(/^#+\s+/gm, "").trim())
    .find(Boolean) || "";
}

function bulletsFromSection(section) {
  if (!section?.text) return [];
  return section.text
    .split("\n")
    .map(line => line.trim())
    .filter(line => /^[-*]\s+\[[ xX]\]\s+/.test(line) || /^[-*]\s+/.test(line))
    .map(line => line.replace(/^[-*]\s+(?:\[[ xX]\]\s+)?/, "- "))
    .slice(0, 8);
}

function scopeFromSection(section) {
  return section?.text.match(/^\*\*Scope:\*\*\s*(.+)$/m)?.[1]?.trim() || "";
}

function testingFromPlan(body) {
  const tests = [];
  const testBlock = body.match(/\*\*Tests added:\*\*([\s\S]*?)(?:\n\n##|\n#|$)/i)?.[1] || "";
  for (const line of testBlock.split("\n")) {
    const trimmed = line.trim();
    if (/^[-*]\s+/.test(trimmed)) tests.push(trimmed.replace(/^[-*]\s+/, "- "));
  }
  if (tests.length) return tests.slice(0, 6);
  const validation = body.match(/\b(validate-[\w:-]+|pnpm[^\n]+|npm[^\n]+|node --test[^\n]+|jest[^\n]+)\b[^\n]*/gi) || [];
  return [...new Set(validation.map(line => `- ${line.trim()}`))].slice(0, 6);
}

function defaultPrTitle(issue, pr, total) {
  const section = prSectionFor(issue, pr);
  const rawTitle = section?.title || cleanIssueTitle(issue?.title);
  const prefix = productPrefixForIssue(issue);
  const type = conventionalTypeForIssue(issue, rawTitle);
  const subject = sentenceCaseSubject(cleanPrTitleSubject(rawTitle));
  const suffix = total > 1 ? ` (${pr.position}/${total})` : "";
  return `${prefix}${type}: ${subject}${suffix}`;
}

function defaultPrBody(issue, pr, base) {
  const body = planBody(issue);
  const section = prSectionFor(issue, pr);
  const summary = scopeFromSection(section) || firstPlanParagraph(body) || cleanIssueTitle(issue?.title);
  const changes = bulletsFromSection(section);
  const testing = testingFromPlan(body);
  const stackContext = totalStackContext(pr, base);
  return [
    "## Summary",
    summary,
    "",
    "## Changes",
    ...(changes.length ? changes : [`- Updates for ${issue?.linear_id || "this Forge issue"}.`]),
    "",
    "## Stack context",
    stackContext,
    "",
    "## Testing",
    ...(testing.length ? testing : ["- Not run by deterministic git agent."]),
    "",
  ].join("\n");
}

function totalStackContext(pr, base) {
  const position = pr?.position ? `PR ${pr.position}` : "This PR";
  return `${position} targets ${base}. ${pr?.base_pr_id ? "It is stacked on the previous Forge PR." : "It is the base PR for this Forge stack."}`;
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
    if (state === "CREATING_PR" || (state === "PUSHING" && pr.pr_number)) {
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
  installWorktreeSafety(cwd);
  removeUntrackedRootNodeModulesSymlink(cwd);
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
      if (removeTrackedRootNodeModulesSymlinkCommit(cwd)) log("Removed committed root node_modules symlink before push");
      removeUntrackedRootNodeModulesSymlink(cwd);
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
