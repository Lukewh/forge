#!/usr/bin/env node
/**
 * Forge — Setup Script
 *
 * Deterministic (no LLM). Spawned by the scheduler for issues in SETTING_UP state.
 * Creates the git worktree and project file template, then transitions to PLANNING.
 *
 * Usage: node setup.js --issue-id <id> --run-id <id>
 */

"use strict";

const { execFileSync } = require("child_process");
const path  = require("path");
const os    = require("os");
const fs    = require("fs");

// ── Args ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
function getArg(flag) { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; }

const issueId = parseInt(getArg("--issue-id"), 10);
const runId   = parseInt(getArg("--run-id"), 10);

if (!issueId || !runId) { console.error("[forge:setup] Missing --issue-id / --run-id"); process.exit(1); }

// ── DB ────────────────────────────────────────────────────────────────

const FORGE_DIR = process.env.FORGE_DIR || path.join(os.homedir(), ".pi", "agent", "extensions", "forge");
const Database  = require(path.join(FORGE_DIR, "node_modules", "better-sqlite3"));
const db        = new Database(path.join(FORGE_DIR, "forge.db"));
db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 5000");
db.pragma("foreign_keys = ON");

process.on("SIGTERM", () => { try { db.close(); } catch {} process.exit(0); });
process.on("SIGINT",  () => { try { db.close(); } catch {} process.exit(0); });


function getSetting(k) { return db.prepare("SELECT value FROM settings WHERE key = ?").get(k)?.value; }

const WORKTREE_PROVIDER = getSetting("worktree_provider") || "wt";
const WT_ROOT        = getSetting("wt_root")        || "";
const REPO_ROOT      = getSetting("repo_root")      || WT_ROOT;
const WORKTREE_ROOT  = getSetting("worktree_root")  || path.join(os.homedir(), "Projects", "worktrees");
const BRANCH_PREFIX  = getSetting("branch_prefix")  || os.userInfo().username || "forge";
const DEFAULT_BRANCH = getSetting("default_branch") || "main";

function log(msg) { console.log(`[${new Date().toISOString()}] [forge:setup] ${msg}`); }

function transition(newState) {
  db.prepare(`UPDATE issues SET previous_state = state, state = ?, updated_at = datetime('now') WHERE id = ?`).run(newState, issueId);
  log(`State → ${newState}`);
}

function unlock() {
  db.prepare(`UPDATE issues SET locked_at = NULL, agent_pid = NULL, updated_at = datetime('now') WHERE id = ?`).run(issueId);
}

function finishRun(exitCode) {
  db.prepare(`UPDATE agent_runs SET exited_at = datetime('now'), exit_code = ? WHERE id = ?`).run(exitCode, runId);
}

function logActivity(type, message) {
  db.prepare(`INSERT INTO activity_log (issue_id, type, actor, message) VALUES (?, ?, 'setup', ?)`).run(issueId, type, message);
}

// ── Helpers ───────────────────────────────────────────────────────────

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

function deriveGitWorktreePath(branchName) {
  const safeName = branchName.replace(/\//g, "-");
  const repoName = path.basename(REPO_ROOT).replace(/\.git$/, "") || "worktree";
  return path.join(WORKTREE_ROOT, `${repoName}.${safeName}`);
}

function setupGitWorktree(branchName) {
  const wtPath = deriveGitWorktreePath(branchName);
  fs.mkdirSync(path.dirname(wtPath), { recursive: true });

  try {
    log(`Fetching origin/${DEFAULT_BRANCH}…`);
    execFileSync("git", ["-C", REPO_ROOT, "fetch", "--prune", "origin", `+refs/heads/${DEFAULT_BRANCH}:refs/remotes/origin/${DEFAULT_BRANCH}`], { timeout: 30000 });
  } catch (e) {
    log(`WARN: git fetch failed: ${e.message} — continuing anyway`);
  }

  if (fs.existsSync(wtPath)) {
    log(`Git worktree path already exists: ${wtPath}`);
    return wtPath;
  }

  const baseRef = `refs/remotes/origin/${DEFAULT_BRANCH}`;
  try {
    log(`Creating git worktree ${wtPath} from ${baseRef}…`);
    execFileSync("git", ["-C", REPO_ROOT, "worktree", "add", "-b", branchName, wtPath, baseRef], {
      encoding: "utf-8", timeout: 60000,
    });
    return wtPath;
  } catch (e) {
    log(`git worktree add -b failed (${e.message}) — trying existing branch…`);
    try {
      execFileSync("git", ["-C", REPO_ROOT, "worktree", "add", wtPath, branchName], {
        encoding: "utf-8", timeout: 60000,
      });
      return wtPath;
    } catch (e2) {
      log(`ERROR: Could not create git worktree: ${e2.message}`);
      throw e2;
    }
  }
}

function parseWtListOutput(output) {
  const text = String(output || "").trim();
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) return [];
  return JSON.parse(text.slice(start, end + 1));
}

function setupWtWorktree(branchName) {
  // Ensure core.bare = false so git allows worktree operations.
  try {
    execFileSync("git", ["-C", WT_ROOT, "config", "core.bare", "false"], { timeout: 5000 });
    log("core.bare set to false in bare repo config");
  } catch (e) {
    log(`WARN: Could not set core.bare: ${e.message} — continuing anyway`);
  }

  try {
    log(`Fetching origin/${DEFAULT_BRANCH}…`);
    execFileSync("git", ["-C", WT_ROOT, "fetch", "--prune", "origin", `+refs/heads/${DEFAULT_BRANCH}:refs/remotes/origin/${DEFAULT_BRANCH}`], { timeout: 30000 });
  } catch (e) {
    log(`WARN: git fetch failed: ${e.message} — continuing anyway`);
  }

  try {
    const baseRef = `refs/remotes/origin/${DEFAULT_BRANCH}`;
    log(`Creating worktree from ${baseRef}…`);
    execFileSync("wt", ["switch", "--no-hooks", "--create", branchName, "--base", baseRef], {
      cwd: WT_ROOT, encoding: "utf-8", timeout: 60000,
    });
    log("Worktree created");
  } catch (e) {
    log(`wt switch --create failed (${e.message}) — trying switch to existing…`);
    execFileSync("wt", ["switch", "--no-hooks", branchName], {
      cwd: WT_ROOT, encoding: "utf-8", timeout: 30000,
    });
    log("Switched to existing worktree");
  }

  try {
    const { spawnSync } = require("child_process");
    const result = spawnSync("wt", ["list", "--format", "json"], {
      cwd: WT_ROOT, encoding: "utf-8", timeout: 10000,
    });
    if (result.status === 0 && result.stdout) {
      const worktrees = parseWtListOutput(result.stdout);
      const match = worktrees.find(w =>
        w.branch === branchName ||
        w.branch?.endsWith(`/${branchName.split("/").pop()}`)
      );
      if (match?.path) return match.path;
    } else {
      log(`WARN: wt list exited ${result.status}: ${result.stderr?.trim()}`);
    }
  } catch (e) {
    log(`WARN: wt list failed: ${e.message}`);
  }

  const safeName = branchName.replace(/\//g, "-");
  const wtPrefix = path.basename(WT_ROOT);
  const legacyWtPrefix = wtPrefix.replace(/-/g, ".");
  const candidates = [
    path.join(path.dirname(WT_ROOT), `${wtPrefix}.${safeName}`),
    path.join(path.dirname(WT_ROOT), `${legacyWtPrefix}.${safeName}`),
  ];
  const candidate = candidates.find(p => fs.existsSync(p)) ?? candidates[0];
  log(`Fallback wt_path (derived): ${candidate}`);
  return candidate;
}

// ── Main ──────────────────────────────────────────────────────────────

function main() {
  const issue = db.prepare("SELECT * FROM issues WHERE id = ?").get(issueId);
  if (!issue) { log("ERROR: Issue not found"); finishRun(1); process.exit(1); }

  log(`Setting up issue #${issueId}: "${issue.title}"`);

  if (!REPO_ROOT) {
    const message = "Missing repository configuration. Set repo_root for git worktrees or wt_root for worktrunk.";
    log(`ERROR: ${message}`);
    logActivity("agent_error", message);
    transition("FAILED");
    unlock();
    finishRun(1);
    db.close();
    process.exit(1);
  }

  // ── 1. Check if worktree already exists ───────────────────────────

  if (issue.wt_path && fs.existsSync(issue.wt_path)) {
    log(`Worktree already exists: ${issue.wt_path}`);
    transition("PLANNING");
    unlock();
    finishRun(0);
    db.close();
    return;
  }

  // ── 2. Resolve title from Linear if not yet fetched ──────────────
  // When added from the VM (linear_enabled = false), the title is seeded as the
  // linear_id and a desktop job is enqueued to fetch the real title later.
  // Try to fetch it here directly so the branch name and plan file are correct.

  if (issue.linear_id && issue.title === issue.linear_id) {
    try {
      const raw = execFileSync("linear", ["issue", "view", issue.linear_id, "--json"], {
        encoding: "utf-8", timeout: 15000,
      });
      const data = JSON.parse(raw);
      if (data.title) {
        db.prepare("UPDATE issues SET title = ?, priority = COALESCE(?, priority), updated_at = datetime('now') WHERE id = ?")
          .run(data.title, data.priority ?? null, issueId);
        issue.title    = data.title;
        issue.priority = data.priority ?? issue.priority;
        log(`Resolved title from Linear: "${issue.title}"`);
      }
    } catch (e) {
      log(`WARN: Could not fetch title from Linear: ${e.message?.split("\n")[0]} — using linear_id as title`);
    }
  }

  // ── 3. Build branch name ──────────────────────────────────────────

  const identifier = issue.linear_id ?? `issue-${issue.id}`;
  const slug       = slugify(issue.title);
  const branchName = `${BRANCH_PREFIX}/${identifier}-${slug}`;
  log(`Branch: ${branchName}`);

  // ── 3. Create worktree ────────────────────────────────────────────

  let wtPath = null;
  try {
    log(`Worktree provider: ${WORKTREE_PROVIDER}`);
    wtPath = WORKTREE_PROVIDER === "git"
      ? setupGitWorktree(branchName)
      : setupWtWorktree(branchName);
  } catch (e) {
    log(`ERROR: Could not create or switch worktree: ${e.message}`);
    logActivity("agent_error", `Worktree setup failed: ${e.message}`);
    transition("FAILED");
    unlock();
    finishRun(1);
    db.close();
    process.exit(1);
  }

  log(`wt_path: ${wtPath}`);
  db.prepare(`UPDATE issues SET wt_path = ?, updated_at = datetime('now') WHERE id = ?`).run(wtPath, issueId);

  // ── 7. Create project file from template ─────────────────────────

  if (!issue.project_file_path) {
    const projectDir      = path.join(FORGE_DIR, "projects", String(issueId));
    const projectFilePath = path.join(projectDir, "plan.md");
    fs.mkdirSync(projectDir, { recursive: true });

    const now = new Date().toISOString();
    fs.writeFileSync(projectFilePath, [
      "---",
      `linear-id: ${issue.linear_id ?? ""}`,
      "pr-url:",
      `base-branch: ${DEFAULT_BRANCH}`,
      "app:",
      "layer:",
      `started: ${now}`,
      "merged:",
      `branch-name: ${branchName}`,
      "project:",
      "milestone:",
      "---",
      "{summary of work to be done}",
      "",
      "# PR Stack",
      "<!-- Break the work into a stack of small, atomic PRs. -->",
      "",
      "# TODO",
      "",
      "# Decisions Made",
      "",
      "# Log",
    ].join("\n"), "utf-8");

    db.prepare(`UPDATE issues SET project_file_path = ?, updated_at = datetime('now') WHERE id = ?`).run(projectFilePath, issueId);
    log(`Project file created: ${projectFilePath}`);
  }

  // ── 8. Transition to PLANNING ─────────────────────────────────────

  logActivity("setup_complete", `Worktree created: ${branchName}`);
  transition("PLANNING");
  unlock();
  finishRun(0);
  log("Setup complete — ready for planner");
  db.close();
}

main();
