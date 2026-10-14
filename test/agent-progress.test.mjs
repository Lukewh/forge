import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { branchHeads, hasWorktreeProgress, validateAlreadyFixedReport } from "../lib/agent-progress.js";

test("unchanged HEAD cannot hide a changed child stack branch", () => {
  const before = { head: "a", status: "", branches: { parent: "a", child: "b" } };
  assert.equal(hasWorktreeProgress(before, before), false);
  assert.equal(hasWorktreeProgress(before, { ...before, branches: { parent: "a", child: "c" } }), true);
  assert.equal(hasWorktreeProgress(null, before), false);
  assert.equal(hasWorktreeProgress(before, null), false);
});

test("already-fixed evidence requires approved IDs, current run and unpushed target commits", () => {
  const dir = mkdtempSync(join(tmpdir(), "forge-progress-"));
  const cwd = join(dir, "work");
  const origin = join(dir, "origin.git");
  const git = args => execFileSync("git", args, { cwd, encoding: "utf-8", stdio: "pipe" }).trim();
  try {
    execFileSync("git", ["init", "--bare", origin], { stdio: "pipe" });
    execFileSync("git", ["clone", origin, cwd], { stdio: "pipe" });
    git(["config", "user.name", "Forge Test"]);
    git(["config", "user.email", "forge@example.com"]);
    git(["checkout", "-b", "target"]);
    writeFileSync(join(cwd, "fix.txt"), "base\n");
    git(["add", "."]);
    git(["commit", "-m", "base"]);
    git(["push", "origin", "target"]);
    writeFileSync(join(cwd, "fix.txt"), "fix\n");
    git(["commit", "-am", "fix approved feedback"]);
    const commit = git(["rev-parse", "HEAD"]);
    assert.deepEqual(branchHeads(cwd, ["target"]), { target: commit });
    const report = { runId: 10, decisionId: 20, branch: "target", commentIds: ["123"], commitIds: [commit], summary: "Verified fix and regression tests" };
    const options = { cwd, report, runId: 10, decisionId: 20, commentIds: ["123"], branch: "target" };
    assert.equal(validateAlreadyFixedReport(options), true);
    assert.equal(validateAlreadyFixedReport({ ...options, runId: 11 }), false);
    assert.equal(validateAlreadyFixedReport({ ...options, decisionId: 21 }), false);
    assert.equal(validateAlreadyFixedReport({ ...options, commentIds: ["123", "456"] }), false);
    assert.equal(validateAlreadyFixedReport({ ...options, report: { ...report, commitIds: [] } }), false);
    git(["push", "origin", "target"]);
    assert.equal(validateAlreadyFixedReport(options), false, "already-pushed commits must not bypass the guard");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
