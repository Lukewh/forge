"use strict";

const { execFileSync } = require("child_process");

function git(cwd, args) {
  return execFileSync("git", args, { cwd, encoding: "utf-8", timeout: 15000, stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function branchHeads(cwd, branches) {
  return Object.fromEntries([...new Set(branches)].sort().map(branch => [
    branch, git(cwd, ["rev-parse", "--verify", `refs/heads/${branch}`]),
  ]));
}

function hasWorktreeProgress(before, after) {
  if (!before || !after) return false;
  return before.head !== after.head || before.status !== after.status ||
    JSON.stringify(before.branches) !== JSON.stringify(after.branches);
}

// An already-fixed report is not itself progress. It must account for every
// approved target comment and identify existing commits that still need pushing.
function validateAlreadyFixedReport({ cwd, report, runId, decisionId, commentIds, branch }) {
  if (!report || report.runId !== runId || report.decisionId !== decisionId ||
      report.branch !== branch || typeof report.summary !== "string" || !report.summary.trim()) return false;
  const expected = [...new Set(commentIds.map(String))].sort();
  const reported = Array.isArray(report.commentIds) ? [...new Set(report.commentIds.map(String))].sort() : [];
  if (!expected.length || JSON.stringify(expected) !== JSON.stringify(reported)) return false;
  if (!Array.isArray(report.commitIds) || !report.commitIds.length) return false;
  try {
    // Refresh the actual remote head: stale origin refs cannot authorize a no-op.
    git(cwd, ["fetch", "origin", `+refs/heads/${branch}:refs/remotes/origin/${branch}`]);
    for (const commit of report.commitIds) {
      if (typeof commit !== "string" || !/^[a-f0-9]{40}$/i.test(commit)) return false;
      git(cwd, ["merge-base", "--is-ancestor", commit, `refs/heads/${branch}`]);
      const unpushed = git(cwd, ["rev-list", `refs/remotes/origin/${branch}..refs/heads/${branch}`]).split("\n");
      if (!unpushed.includes(commit)) return false;
    }
    return true;
  } catch {
    return false;
  }
}

module.exports = { branchHeads, hasWorktreeProgress, validateAlreadyFixedReport };
