"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

function git(cwd, args, opts = {}) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf-8",
    timeout: opts.timeout ?? 30000,
    stdio: opts.stdio ?? ["ignore", "pipe", "pipe"],
    maxBuffer: opts.maxBuffer ?? 10 * 1024 * 1024,
  });
}

function gitPath(cwd, gitRelativePath) {
  const resolved = git(cwd, ["rev-parse", "--git-path", gitRelativePath]).trim();
  return path.isAbsolute(resolved) ? resolved : path.resolve(cwd, resolved);
}

function appendOnce(file, lines) {
  const existing = fs.existsSync(file) ? fs.readFileSync(file, "utf-8") : "";
  const missing = lines.filter(line => !existing.split("\n").includes(line));
  if (!missing.length) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, `${existing && !existing.endsWith("\n") ? "\n" : ""}${missing.join("\n")}\n`, "utf-8");
  return true;
}

function installWorktreeSafety(cwd) {
  if (!cwd || !fs.existsSync(cwd)) return;

  // A trailing-slash ignore pattern can miss a root node_modules symlink.
  // Ignore both the directory and symlink forms locally for Forge worktrees.
  appendOnce(gitPath(cwd, "info/exclude"), [
    "# Forge safety: agents must not create or commit dependency symlinks",
    "/node_modules",
    "node_modules",
    "# Forge safety: Husky may generate this private helper dir when hooks run",
    "/.husky/_/",
  ]);

  const hookPath = gitPath(cwd, "hooks/pre-commit");
  const marker = "# forge-block-node-modules-symlink";
  const hook = `#!/bin/sh
${marker}
if git diff --cached --name-only --diff-filter=ACMRT -- node_modules | grep -qx 'node_modules'; then
  echo "Forge safety: refusing to commit root node_modules. Use workspace-run/project tooling; do not symlink dependencies into worktrees." >&2
  exit 1
fi
`;
  const existingHook = fs.existsSync(hookPath) ? fs.readFileSync(hookPath, "utf-8") : "";
  if (!existingHook.includes(marker)) {
    fs.mkdirSync(path.dirname(hookPath), { recursive: true });
    fs.writeFileSync(hookPath, existingHook.trim() ? `${existingHook}\n${hook}` : hook, "utf-8");
    fs.chmodSync(hookPath, 0o755);
  }
}

function rootNodeModulesIsTrackedSymlink(cwd, ref = "HEAD") {
  try {
    const entry = git(cwd, ["ls-tree", ref, "node_modules"]).trim();
    return /^120000\s+blob\s+[0-9a-f]+\s+node_modules$/.test(entry);
  } catch {
    return false;
  }
}

function removeUntrackedRootNodeModulesSymlink(cwd) {
  const nodeModulesPath = path.join(cwd, "node_modules");
  let stat;
  try { stat = fs.lstatSync(nodeModulesPath); } catch { return false; }
  if (!stat.isSymbolicLink()) return false;
  try {
    const tracked = git(cwd, ["ls-files", "--error-unmatch", "node_modules"], { stdio: ["ignore", "pipe", "pipe"] }).trim();
    if (tracked) return false;
  } catch {}
  fs.unlinkSync(nodeModulesPath);
  return true;
}

function removeTrackedRootNodeModulesSymlinkCommit(cwd, message = "remove node_modules symlink") {
  if (!rootNodeModulesIsTrackedSymlink(cwd)) return false;
  git(cwd, ["rm", "-f", "node_modules"], { stdio: "inherit" });
  git(cwd, ["commit", "-m", message], { stdio: "inherit" });
  return true;
}

module.exports = {
  installWorktreeSafety,
  removeTrackedRootNodeModulesSymlinkCommit,
  removeUntrackedRootNodeModulesSymlink,
  rootNodeModulesIsTrackedSymlink,
};
