"use strict";
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

function prepareWatchedWorktree({ repoRoot, worktreeRoot, branch, prNumber }) {
  if (!repoRoot || !fs.existsSync(repoRoot)) throw new Error("Configure repo_root or wt_root before watching a PR.");
  const git = args => execFileSync("git", ["-C", repoRoot, ...args], { encoding: "utf-8", timeout: 60000, stdio: ["ignore", "pipe", "pipe"] });
  git(["check-ref-format", "--branch", branch]);
  // Porcelain -z preserves whitespace and quoted/non-ASCII worktree paths.
  const records = git(["worktree", "list", "--porcelain", "-z"]).split("\0\0");
  for (const record of records) {
    const fields = record.split("\0");
    if (fields.includes(`branch refs/heads/${branch}`)) {
      const existing = fields.find(field => field.startsWith("worktree "))?.slice(9);
      if (!existing || !fs.existsSync(existing)) throw new Error(`Registered worktree for ${branch} is missing; repair its Git registration before retrying.`);
      return existing;
    }
  }
  try {
    git(["fetch", "origin", `+refs/heads/${branch}:refs/remotes/origin/${branch}`]);
  } catch {
    git(["fetch", "origin", `+refs/pull/${prNumber}/head:refs/remotes/origin/${branch}`]);
  }
  const destination = path.join(worktreeRoot || path.dirname(repoRoot), `watch-pr-${prNumber}`);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  let localExists = false;
  try { git(["show-ref", "--verify", `refs/heads/${branch}`]); localExists = true; } catch {}
  // Never reset an existing branch: it may contain unpushed fixes.
  git(localExists ? ["worktree", "add", destination, branch] : ["worktree", "add", "-b", branch, destination, `refs/remotes/origin/${branch}`]);
  return destination;
}

module.exports = { prepareWatchedWorktree };
