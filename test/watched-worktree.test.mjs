import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync, existsSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { prepareWatchedWorktree } from "../lib/watched-worktree.js";

test("watch setup reuses existing checkout or prepares the PR branch without resetting local work", () => {
  const dir = mkdtempSync(join(tmpdir(), "forge-watch-"));
  const repo = join(dir, "repo");
  const origin = join(dir, "origin.git");
  const git = (args, cwd = repo) => execFileSync("git", args, { cwd, encoding: "utf-8", stdio: "pipe" }).trim();
  try {
    execFileSync("git", ["init", "--bare", origin], { stdio: "pipe" });
    execFileSync("git", ["clone", origin, repo], { stdio: "pipe" });
    git(["config", "user.name", "Forge Test"]);
    git(["config", "user.email", "forge@example.com"]);
    git(["checkout", "-b", "main"]);
    writeFileSync(join(repo, "base.txt"), "base\n");
    git(["add", "."]); git(["commit", "-m", "base"]);
    git(["checkout", "-b", "feature"]);
    writeFileSync(join(repo, "feature.txt"), "feature\n");
    git(["add", "."]); git(["commit", "-m", "feature"]);
    git(["push", "origin", "feature"]);
    assert.equal(prepareWatchedWorktree({ repoRoot: repo, branch: "feature", prNumber: 42 }), realpathSync(repo));
    git(["checkout", "main"]);
    const wt = prepareWatchedWorktree({ repoRoot: repo, worktreeRoot: join(dir, "worktrees"), branch: "feature", prNumber: 42 });
    assert.equal(git(["branch", "--show-current"], wt), "feature");
    writeFileSync(join(wt, "local.txt"), "uncommitted user work\n");
    assert.equal(prepareWatchedWorktree({ repoRoot: repo, branch: "feature", prNumber: 42 }), realpathSync(wt));
    assert.equal(existsSync(join(wt, "local.txt")), true);
    assert.throws(() => prepareWatchedWorktree({ repoRoot: repo, branch: "../bad", prNumber: 42 }));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
