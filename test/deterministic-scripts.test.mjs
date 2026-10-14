import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { makeGitAgentPlan, makeRebasePlan, parsePlanFrontmatter, restackGithubStack } from "../lib/deterministic-agents.js";

test("parsePlanFrontmatter extracts base branch, branch name, and title", () => {
  const plan = `---\nlinear-id: BAND-123\nbase-branch: release/2026\nbranch-name: user/band-123\n---\nImplement the thing.\n\n# PR Stack\n`;
  assert.deepEqual(parsePlanFrontmatter(plan), {
    frontmatter: {
      "linear-id": "BAND-123",
      "base-branch": "release/2026",
      "branch-name": "user/band-123",
    },
    body: "Implement the thing.\n\n# PR Stack\n",
  });
});

test("makeRebasePlan rebases stack branches onto base then parent branches", () => {
  const plan = makeRebasePlan({
    baseBranch: "main",
    prStack: [
      { id: 10, gt_branch: "user/issue-part-1", position: 1, base_pr_id: null, status: "open" },
      { id: 11, gt_branch: "user/issue-part-2", position: 2, base_pr_id: 10, status: "open" },
      { id: 12, gt_branch: "user/issue-old", position: 3, base_pr_id: 11, status: "closed" },
    ],
  });

  assert.deepEqual(plan.branches, [
    { branch: "user/issue-part-1", base: "refs/remotes/origin/main", forcePush: true },
    { branch: "user/issue-part-2", base: "user/issue-part-1", forcePush: true },
  ]);
});

test("makeGitAgentPlan upserts PR metadata through REST during PR creation", () => {
  const plan = makeGitAgentPlan({
    state: "CREATING_PR",
    issue: { title: "Add audit filters", linear_id: "BAND-123", project_file_path: "/tmp/plan.md" },
    baseBranch: "main",
    prStack: [
      { id: 10, gt_branch: "user/issue-part-1", position: 1, base_pr_id: null, pr_number: null, status: "open" },
      { id: 11, gt_branch: "user/issue-part-2", position: 2, base_pr_id: 10, pr_number: null, status: "open" },
    ],
  });

  assert.deepEqual(plan.steps.map(step => step.kind), [
    "fetch-base",
    "stack-restack",
    "upsert-pr",
    "upsert-pr",
    "write-prs-json",
  ]);
  assert.equal(plan.steps.find(step => step.kind === "upsert-pr").base, "main");
  assert.equal(plan.steps.filter(step => step.kind === "upsert-pr")[1].base, "user/issue-part-1");
  assert.equal(plan.steps.find(step => step.kind === "upsert-pr").title, "feat: add audit filters (1/2)");
  for (const step of plan.steps.filter(step => step.kind === "upsert-pr")) {
    assert.doesNotMatch(step.body, /Forge|deterministic git agent/);
    assert.match(step.body, /- Not run\./);
  }
  assert.match(plan.steps.filter(step => step.kind === "upsert-pr")[0].body, /base PR for this stack/);
  assert.match(plan.steps.filter(step => step.kind === "upsert-pr")[1].body, /stacked on the previous PR/);
});

test("makeGitAgentPlan uses MP conventional PR titles from plan stack", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "forge-pr-title-"));
  try {
    const planPath = join(tempDir, "plan.md");
    writeFileSync(planPath, `---
app: pricing
target-paths:
  - functions/src/modules/marketPricing/pricing/services/example.ts
---
Fix the customer-facing Market Pricing bug.

# PR Stack

## PR 1 — Backend: Diff-based band-pay-type data rule updates + chunking
**Scope:** Optimize data rule saves.
`);
    const plan = makeGitAgentPlan({
      state: "CREATING_PR",
      issue: { title: "[Anduril] Data rule save and regenerate hangs", linear_id: "BAND-5863", project_file_path: planPath },
      baseBranch: "main",
      prStack: [{ id: 10, gt_branch: "user/issue", position: 1, base_pr_id: null, pr_number: null, status: "open" }],
    });
    assert.equal(plan.steps.find(step => step.kind === "upsert-pr").title, "[MP] fix: diff-based band-pay-type data rule updates + chunking");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("makeGitAgentPlan push mode force-pushes rebased existing PR branches", () => {
  const plan = makeGitAgentPlan({
    state: "PUSHING",
    issue: { title: "Add audit filters", linear_id: "BAND-123", project_file_path: "/tmp/plan.md" },
    baseBranch: "main",
    prStack: [
      { id: 10, gt_branch: "user/issue", position: 1, base_pr_id: null, pr_number: 42, status: "open" },
    ],
  });

  assert.deepEqual(plan.steps.map(step => step.kind), ["fetch-base", "checkout", "pull-branch", "rebase", "push", "upsert-pr", "write-prs-json"]);
  assert.equal(plan.steps.find(step => step.kind === "push").forceWithLease, true);
  assert.equal(plan.steps.find(step => step.kind === "upsert-pr").title, "feat: add audit filters");
});

test("multi-PR push plans restack the whole stack before updating PR metadata", () => {
  const plan = makeGitAgentPlan({
    state: "PUSHING", baseBranch: "main", issue: {},
    prStack: [
      { id: 1, gt_branch: "backend", position: 1, pr_number: 42, status: "open" },
      { id: 2, gt_branch: "frontend", position: 2, base_pr_id: 1, pr_number: 43, status: "open" },
    ],
  });
  assert.deepEqual(plan.steps.map(step => step.kind), ["fetch-base", "stack-restack", "upsert-pr", "upsert-pr", "write-prs-json"]);
  assert.deepEqual(plan.steps[1], { kind: "stack-restack", branches: ["backend", "frontend"], prNumber: 42 });
});

test("existing stacks import full remote metadata then cascade rebase and push", () => {
  const calls = [];
  restackGithubStack({ cwd: "/tmp", baseBranch: "main", branches: ["backend", "frontend"], prNumber: 42, repo: "owner/repo", run: (cmd, args) => calls.push([cmd, ...args]) });
  assert.deepEqual(calls, [
    ["gh", "stack", "checkout", "https://github.com/owner/repo/pull/42"],
    ["gh", "stack", "rebase", "--remote", "origin"],
    ["gh", "stack", "push", "--remote", "origin"],
  ]);
});

test("new stacks adopt branches in order before rebase and push", () => {
  const calls = [];
  restackGithubStack({ cwd: "/tmp", baseBranch: "release", branches: ["a", "b"], run: (cmd, args) => calls.push(args) });
  assert.deepEqual(calls[0], ["stack", "init", "--base", "release", "a", "b"]);
  assert.equal(calls.length, 3);
});

test("stack rebase failure prevents push and propagates the error", () => {
  const calls = [];
  assert.throws(() => restackGithubStack({ cwd: "/tmp", baseBranch: "main", branches: ["a", "b"], run: (cmd, args) => {
    calls.push(args);
    if (args[1] === "rebase") throw new Error("conflict");
  } }), /conflict/);
  assert.equal(calls.length, 2);
});

test("paused stack rebases continue without checking out or reinitializing branches", () => {
  const calls = [];
  restackGithubStack({ cwd: "/tmp", continuing: true, run: (cmd, args) => calls.push(args) });
  assert.deepEqual(calls, [["stack", "rebase", "--continue"], ["stack", "push", "--remote", "origin"]]);
});

test("sync-worktree-to-base can continue when PR branch divergence is patch-equivalent", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "forge-sync-base-"));
  try {
    const origin = join(tempDir, "origin.git");
    const work = join(tempDir, "work");
    const git = (args, cwd = work) => execFileSync("git", args, { cwd, encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] });

    execFileSync("git", ["init", "--bare", origin], { stdio: "ignore" });
    execFileSync("git", ["clone", origin, work], { stdio: "ignore" });
    git(["config", "user.email", "forge@example.com"]);
    git(["config", "user.name", "Forge Test"]);

    writeFileSync(join(work, "file.txt"), "base\n");
    git(["add", "file.txt"]);
    git(["commit", "-m", "base"]);
    git(["branch", "-M", "main"]);
    git(["push", "-u", "origin", "main"]);

    git(["checkout", "-b", "user/issue"]);
    writeFileSync(join(work, "feature.txt"), "feature\n");
    git(["add", "feature.txt"]);
    git(["commit", "-m", "feature"]);
    git(["push", "-u", "origin", "user/issue"]);

    git(["checkout", "main"]);
    writeFileSync(join(work, "main.txt"), "main update\n");
    git(["add", "main.txt"]);
    git(["commit", "-m", "main update"]);
    git(["push", "origin", "main"]);

    git(["checkout", "user/issue"]);
    git(["rebase", "origin/main"]);
    assert.match(git(["cherry", "HEAD", "refs/remotes/origin/user/issue"]), /^- /);

    execFileSync(process.execPath, [join(process.cwd(), "scripts/sync-worktree-to-base"), work, "main", "--allow-diverged-current"], { encoding: "utf-8" });
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});
