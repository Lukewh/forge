#!/usr/bin/env node
/**
 * Forge — Web Dashboard Server
 */

"use strict";

// ── Crash logging ────────────────────────────────────────────────────────────
const _crashLog = require("path").join(
  require("os").homedir(), ".pi", "agent", "extensions", "forge", "dashboard", "server-crash.log"
);
function _logCrash(type, err) {
  const line = `[${new Date().toISOString()}] ${type}: ${err?.stack ?? err}\n`;
  try { require("fs").appendFileSync(_crashLog, line); } catch {}
  console.error(line);
}
// Swallow EPIPE — happens when the launching terminal closes; not a real error.
process.stdout.on("error", (err) => { if (err.code !== "EPIPE") _logCrash("stdout", err); });
process.stderr.on("error", (err) => { if (err.code !== "EPIPE") _logCrash("stderr", err); });
process.on("uncaughtException",  (err) => { if (err.code === "EPIPE") return; _logCrash("uncaughtException",  err); process.exit(1); });
process.on("unhandledRejection", (err) => { if (err?.code === "EPIPE") return; _logCrash("unhandledRejection", err); process.exit(1); });

const express = require(require.resolve("express", { paths: [require("path").join(__dirname, "..")] }));
const path = require("path");
const os = require("os");
const fs = require("fs");
const http = require("http");
const { execFileSync, execFile, spawn } = require("child_process");
const pty = require("node-pty");
const { WebSocket, WebSocketServer } = require("ws");

// Promisified execFile — non-blocking, won't freeze the event loop
const execAsync = (cmd, args, opts = {}) => new Promise((resolve, reject) => {
  execFile(cmd, args, { timeout: 15000, ...opts }, (err, stdout, stderr) => {
    if (err) reject(Object.assign(err, { stderr }));
    else resolve(stdout);
  });
});

async function fetchMergeQueueStatus(prNumber, repo, cwd) {
  const [owner, name] = String(repo || "").split("/");
  if (!owner || !name) return null;
  const query = `query($owner:String!,$name:String!,$number:Int!){ repository(owner:$owner,name:$name){ pullRequest(number:$number){ isInMergeQueue mergeQueueEntry { position enqueuedAt } } } }`;
  try {
    const raw = await execAsync("gh", ["api", "graphql", "-f", `owner=${owner}`, "-f", `name=${name}`, "-F", `number=${prNumber}`, "-f", `query=${query}`], { ...(cwd && fs.existsSync(cwd) ? { cwd } : {}), timeout: 10000 });
    return JSON.parse(raw || "{}")?.data?.repository?.pullRequest ?? null;
  } catch {
    return null;
  }
}

async function enrichPrStackStatus(prStack, cwd) {
  const repo = db.prepare("SELECT value FROM settings WHERE key = 'github_repo'").get()?.value ?? "";
  return Promise.all(prStack.map(async (pr) => {
    if (!pr.pr_number) return pr;
    try {
      const raw = await execAsync("gh", ["pr", "view", String(pr.pr_number), "--repo", repo, "--json", "reviewDecision,statusCheckRollup,mergeable,state,mergedAt"], { ...(cwd && fs.existsSync(cwd) ? { cwd } : {}), timeout: 10000 });
      const data = JSON.parse(raw || "{}");
      const mergeQueue = await fetchMergeQueueStatus(pr.pr_number, repo, cwd);
      const checks = data.statusCheckRollup ?? [];
      const failedChecks = checks.filter(c => ["FAILURE", "TIMED_OUT", "CANCELLED"].includes(c.conclusion));
      const pendingChecks = checks.filter(c => !c.conclusion || ["ACTION_REQUIRED", "STARTUP_FAILURE", "STALE", "SKIPPED", "NEUTRAL"].includes(c.conclusion) === false && c.status !== "COMPLETED");
      const isMerged = Boolean(data.mergedAt || data.state === "MERGED");
      const isInMergeQueue = !isMerged && Boolean(mergeQueue?.isInMergeQueue || mergeQueue?.mergeQueueEntry);
      return {
        ...pr,
        status: isMerged ? "merged" : pr.status,
        reviewDecision: data.reviewDecision ?? null,
        mergeable: data.mergeable ?? null,
        isInMergeQueue,
        mergeQueuePosition: isInMergeQueue ? mergeQueue?.mergeQueueEntry?.position ?? null : null,
        mergeQueueEnqueuedAt: isInMergeQueue ? mergeQueue?.mergeQueueEntry?.enqueuedAt ?? null : null,
        checksTotal: checks.length,
        checksFailed: failedChecks.length,
        checksPending: pendingChecks.length,
        liveState: isMerged ? "MERGED" : isInMergeQueue ? "MERGE_QUEUE" : data.state,
      };
    } catch {
      return pr;
    }
  }));
}

// ── Linear state sync ──────────────────────────────────────────────────────
const FORGE_LINEAR_STATE_MAP = {
  SETTING_UP:             "In Progress",
  PLANNING:               "In Progress",
  AWAITING_PLAN_APPROVAL: "In Progress",
  WORKING:                "In Progress",
  AI_REVIEWING:           "In Progress",
  AWAITING_CODE_REVIEW:   "In Review",
  CREATING_PR:            "In Review",
  WATCHING_PR:            "In Review",
  IN_MERGE_QUEUE:         "In Review",
  SPLIT_PLANNING:         "In Review",
  AWAITING_SPLIT_APPROVAL:"In Review",
  SPLITTING:              "In Review",
  AWAITING_FIX_APPROVAL:  "In Review",
  FIXING:                 "In Review",
  PUSHING:                "In Review",
  REBASING:               "In Review",
  DONE:                   "Done",
};

function linearIntegrationEnabled() {
  return qOne("SELECT value FROM settings WHERE key = 'linear_enabled'")?.value === "true";
}

function enqueueDesktopJob(type, payload) {
  return run(
    "INSERT INTO desktop_jobs (type, payload_json) VALUES (?, ?)",
    type,
    JSON.stringify(payload ?? {})
  ).lastInsertRowid;
}

function enqueueDesktopJobOnce(type, payload) {
  const payloadJson = JSON.stringify(payload ?? {});
  const existing = qOne(
    `SELECT id FROM desktop_jobs
     WHERE type = ?
       AND payload_json = ?
       AND status IN ('pending', 'running')
       AND COALESCE(claimed_at, created_at) >= datetime('now', '-2 minutes')
     LIMIT 1`,
    type,
    payloadJson
  );
  if (existing) return existing.id;
  return enqueueDesktopJob(type, payload);
}

function enqueueLinearSyncJob(issueId, issue, linearState, reason = "desktop bridge") {
  if (!issue?.linear_id || issue.linear_state === linearState) return;
  const jobId = enqueueDesktopJobOnce("linear.syncState", { issueId, linearId: issue.linear_id, state: linearState });
  console.log(`[linear] queued ${issue.linear_id} → "${linearState}" via ${reason} (desktop job #${jobId})`);
}

function setDesktopCache(key, value) {
  run(
    `INSERT INTO desktop_cache (key, value_json, updated_at)
     VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = datetime('now')`,
    key,
    JSON.stringify(value ?? null)
  );
}

function getDesktopCache(key) {
  const row = qOne("SELECT value_json FROM desktop_cache WHERE key = ?", key);
  if (!row) return null;
  try { return JSON.parse(row.value_json); } catch { return null; }
}

async function syncLinearState(issueId, forgeState) {
  const linearState = FORGE_LINEAR_STATE_MAP[forgeState];
  if (!linearState) return;
  const issue = db.prepare("SELECT linear_id, linear_state FROM issues WHERE id = ?").get(issueId);
  if (!issue?.linear_id) return;
  if (issue.linear_state === linearState) return; // already in sync

  if (!linearIntegrationEnabled()) {
    enqueueLinearSyncJob(issueId, issue, linearState);
    return;
  }

  try {
    await execAsync("linear", ["issue", "update", issue.linear_id, "--state", linearState], { timeout: 15000 });
    db.prepare("UPDATE issues SET linear_state = ? WHERE id = ?").run(linearState, issueId);
    console.log(`[linear] ${issue.linear_id} → "${linearState}"`);
  } catch (e) {
    console.warn(`[linear] Could not update ${issue.linear_id}: ${e.message?.split('\n')[0]}`);
    enqueueLinearSyncJob(issueId, issue, linearState, "Linear CLI fallback");
  }
}

const FORGE_DIR = process.env.FORGE_DIR || path.join(os.homedir(), ".pi", "agent", "extensions", "forge");
const Database = require(path.join(FORGE_DIR, "node_modules", "better-sqlite3"));

const PORT = parseInt(process.env.PORT || "3142", 10);

// ── DB ────────────────────────────────────────────────────────────────

const DB_FILE = process.env.FORGE_DB_PATH || path.join(FORGE_DIR, "forge.db");
const DASHBOARD_FIRST_RUN = !fs.existsSync(DB_FILE);
const db = new Database(DB_FILE);
db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 5000");
db.pragma("foreign_keys = ON");

// Ensure schema is initialized (idempotent)
db.exec(`
  CREATE TABLE IF NOT EXISTS issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL DEFAULT 'linear' CHECK(source IN ('linear','manual')),
    linear_id TEXT,
    title TEXT NOT NULL,
    priority INTEGER NOT NULL DEFAULT 0,
    state TEXT NOT NULL DEFAULT 'PENDING',
    previous_state TEXT,
    locked_at TEXT,
    agent_pid INTEGER,
    steering_context TEXT,
    pi_sessions_json TEXT,
    project_file_path TEXT,
    wt_path TEXT,
    pr_approved_at TEXT,
    auto_fix_enabled INTEGER NOT NULL DEFAULT 0,
    focus_rank INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_issues_linear_id ON issues(linear_id) WHERE linear_id IS NOT NULL;
  CREATE INDEX IF NOT EXISTS idx_issues_state ON issues(state);
  CREATE TABLE IF NOT EXISTS pr_stack (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    pr_number INTEGER,
    gt_branch TEXT NOT NULL,
    position INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    base_pr_id INTEGER REFERENCES pr_stack(id)
  );
  CREATE INDEX IF NOT EXISTS idx_pr_stack_issue ON pr_stack(issue_id);
  CREATE TABLE IF NOT EXISTS decision_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK(type IN ('PLAN_REVIEW','CODE_REVIEW','FIX_APPROVAL','SPLIT_APPROVAL','AI_CODE_REVIEW','AI_PLAN_REVIEW')),
    artifact_ref TEXT NOT NULL,
    feedback_json TEXT,
    verdict TEXT CHECK(verdict IN ('approved','rejected')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    resolved_at TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_decisions_issue ON decision_queue(issue_id);
  CREATE INDEX IF NOT EXISTS idx_decisions_unresolved ON decision_queue(verdict) WHERE verdict IS NULL;
  CREATE TABLE IF NOT EXISTS agent_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    agent_type TEXT NOT NULL,
    started_at TEXT NOT NULL DEFAULT (datetime('now')),
    exited_at TEXT,
    exit_code INTEGER,
    log_path TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_agent_runs_issue ON agent_runs(issue_id);
  CREATE TABLE IF NOT EXISTS assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    original_url TEXT NOT NULL,
    local_path TEXT NOT NULL,
    fetched_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(issue_id, original_url)
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS scheduler_state (
    id INTEGER PRIMARY KEY CHECK(id = 1),
    running INTEGER NOT NULL DEFAULT 0,
    pid INTEGER,
    started_at TEXT
  );
  INSERT OR IGNORE INTO scheduler_state (id, running) VALUES (1, 0);
  CREATE TABLE IF NOT EXISTS activity_log (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id   INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    type       TEXT    NOT NULL,
    actor      TEXT    NOT NULL DEFAULT 'system',
    message    TEXT    NOT NULL,
    metadata   TEXT,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_activity_issue ON activity_log(issue_id, created_at DESC);
  CREATE TABLE IF NOT EXISTS review_tours (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id   INTEGER NOT NULL UNIQUE REFERENCES issues(id) ON DELETE CASCADE,
    tour_json  TEXT    NOT NULL,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS learning_events (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id         INTEGER REFERENCES issues(id) ON DELETE CASCADE,
    source           TEXT    NOT NULL,
    agent_type       TEXT,
    trigger          TEXT,
    summary          TEXT    NOT NULL,
    raw_context_json TEXT,
    created_at       TEXT    NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_learning_events_issue ON learning_events(issue_id, created_at DESC);
  CREATE TABLE IF NOT EXISTS learning_suggestions (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id      INTEGER REFERENCES issues(id) ON DELETE CASCADE,
    target        TEXT    NOT NULL,
    suggestion    TEXT    NOT NULL,
    rationale     TEXT,
    evidence_json TEXT,
    confidence    TEXT    NOT NULL DEFAULT 'medium',
    status        TEXT    NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','applied','rejected')),
    created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
    resolved_at   TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_learning_suggestions_status ON learning_suggestions(status, created_at DESC);
  CREATE TABLE IF NOT EXISTS learning_change_log (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id          INTEGER REFERENCES issues(id) ON DELETE SET NULL,
    suggestion_id     INTEGER REFERENCES learning_suggestions(id) ON DELETE SET NULL,
    target            TEXT    NOT NULL,
    change_type       TEXT    NOT NULL,
    change_summary    TEXT    NOT NULL,
    reason            TEXT,
    actor             TEXT    NOT NULL DEFAULT 'system',
    metadata_json     TEXT,
    created_at        TEXT    NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_learning_change_log_created ON learning_change_log(created_at DESC);
  CREATE TABLE IF NOT EXISTS desktop_jobs (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    type           TEXT    NOT NULL,
    payload_json   TEXT    NOT NULL,
    status         TEXT    NOT NULL DEFAULT 'pending',
    result_json    TEXT,
    error          TEXT,
    created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
    claimed_at     TEXT,
    completed_at   TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_desktop_jobs_status ON desktop_jobs(status, created_at);
  CREATE TABLE IF NOT EXISTS desktop_cache (
    key        TEXT PRIMARY KEY,
    value_json TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  INSERT OR IGNORE INTO settings (key, value) VALUES
    ('concurrency_limit','4'),
    ('scheduler_interval_seconds','60'),
    ('dashboard_port','3142'),
    ('linear_enabled','false'),
    ('linear_team',''),
    ('model','anthropic-vertex/sonnet-4-6'),
    ('model_planner',''),
    ('model_plan_reviewer',''),
    ('model_coder',''),
    ('model_reviewer',''),
    ('model_git_agent',''),
    ('model_fixer',''),
    ('model_split_planner',''),
    ('model_splitter',''),
    ('model_rebaser',''),
    ('forge_reuse_pi_sessions','false'),
    ('ai_review_max_rounds','5'),
    ('github_repo',''),
    ('worktree_provider','git'),
    ('wt_root',''),
    ('repo_root',''),
    ('worktree_root','${path.join(os.homedir(), 'Projects', 'worktrees')}'),
    ('branch_prefix','${os.userInfo().username || 'forge'}'),
    ('default_branch','main'),
    ('vm_ssh_target',''),
    ('host_path_prefix',''),
    ('vm_path_prefix',''),
    ('project_prompt_overlay',''),
    ('vm_frontend_staging_backend_command',''),
    ('vm_frontend_local_backend_command',''),
    ('vm_backend_staging_command',''),
    ('vm_backend_local_command',''),
    ('vm_database_command','');
`);
// Safe incremental migrations for existing DBs
const addCol = (t, c, d) => { try { db.prepare(`ALTER TABLE ${t} ADD COLUMN ${c} ${d}`).run(); } catch {} };
addCol('issues', 'ai_review_rounds', 'INTEGER NOT NULL DEFAULT 0');
addCol('issues', 'total_ai_review_rounds', 'INTEGER NOT NULL DEFAULT 0');
addCol('issues', 'retry_count', 'INTEGER NOT NULL DEFAULT 0');
addCol('issues', 'linear_state', 'TEXT');  // last-known Linear state we pushed
addCol('issues', 'pr_approved_at', 'TEXT');
addCol('issues', 'auto_fix_enabled', 'INTEGER NOT NULL DEFAULT 0');
addCol('issues', 'focus_rank', 'INTEGER');
addCol('issues', 'pi_sessions_json', 'TEXT');

if (DASHBOARD_FIRST_RUN) db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('setup_completed', 'false')").run();
db.prepare("UPDATE settings SET value = replace(value, 'IS_' || 'DEV' || 'CONTAINER=1 ', '') WHERE key LIKE 'vm_%_command'").run();
db.prepare("DELETE FROM settings WHERE key LIKE 'vm_%compose_command'").run();
const legacyVmTarget = db.prepare("SELECT value FROM settings WHERE key = 'vm_ssh_target'").get()?.value;
const insertSetting = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
insertSetting.run("host_path_prefix", legacyVmTarget ? "/Users" : "");
insertSetting.run("vm_path_prefix", legacyVmTarget ? "/mnt/mac/Users" : "");
insertSetting.run("project_prompt_overlay", "");

db.exec(`
  CREATE TABLE IF NOT EXISTS learning_events (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id         INTEGER REFERENCES issues(id) ON DELETE CASCADE,
    source           TEXT    NOT NULL,
    agent_type       TEXT,
    trigger          TEXT,
    summary          TEXT    NOT NULL,
    raw_context_json TEXT,
    created_at       TEXT    NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_learning_events_issue ON learning_events(issue_id, created_at DESC);
  CREATE TABLE IF NOT EXISTS learning_suggestions (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id      INTEGER REFERENCES issues(id) ON DELETE CASCADE,
    target        TEXT    NOT NULL,
    suggestion    TEXT    NOT NULL,
    rationale     TEXT,
    evidence_json TEXT,
    confidence    TEXT    NOT NULL DEFAULT 'medium',
    status        TEXT    NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','applied','rejected')),
    created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
    resolved_at   TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_learning_suggestions_status ON learning_suggestions(status, created_at DESC);
  CREATE TABLE IF NOT EXISTS learning_change_log (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id          INTEGER REFERENCES issues(id) ON DELETE SET NULL,
    suggestion_id     INTEGER REFERENCES learning_suggestions(id) ON DELETE SET NULL,
    target            TEXT    NOT NULL,
    change_type       TEXT    NOT NULL,
    change_summary    TEXT    NOT NULL,
    reason            TEXT,
    actor             TEXT    NOT NULL DEFAULT 'system',
    metadata_json     TEXT,
    created_at        TEXT    NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_learning_change_log_created ON learning_change_log(created_at DESC);
`);

// Migrate decision_queue CHECK constraint if it's missing new types
const dqSchema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='decision_queue'").get()?.sql ?? '';
if (!dqSchema.includes('AI_PLAN_REVIEW') || !dqSchema.includes('SPLIT_APPROVAL')) {
  console.log('  Migrating decision_queue constraint...');
  db.exec(`
    BEGIN;
    ALTER TABLE decision_queue RENAME TO _dq_old;
    CREATE TABLE decision_queue (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      issue_id      INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
      type          TEXT    NOT NULL CHECK(type IN ('PLAN_REVIEW','CODE_REVIEW','FIX_APPROVAL','SPLIT_APPROVAL','AI_CODE_REVIEW','AI_PLAN_REVIEW')),
      artifact_ref  TEXT    NOT NULL,
      feedback_json TEXT,
      verdict       TEXT    CHECK(verdict IN ('approved','rejected')),
      created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
      resolved_at   TEXT
    );
    INSERT INTO decision_queue SELECT * FROM _dq_old;
    DROP TABLE _dq_old;
    CREATE INDEX IF NOT EXISTS idx_decisions_issue ON decision_queue(issue_id);
    CREATE INDEX IF NOT EXISTS idx_decisions_unresolved ON decision_queue(verdict) WHERE verdict IS NULL;
    COMMIT;
  `);
  console.log('  decision_queue migrated.');
}

console.log('  Schema ready.');

// ── Startup cleanup: mark orphaned agent_runs as exited ──────────────
// Any run with exited_at IS NULL at startup is a zombie (process died without
// calling finishRun). Use `started_at + 10 minutes` as exited_at rather than
// `datetime('now')` — 10 min is the stale-lock reaper threshold, so it's the
// tightest upper bound on how long the process could have actually been alive.
// Using 'now' would make duration stats wildly wrong (e.g. days if the
// dashboard was offline for an extended period).
{
  const result = db.prepare(`
    UPDATE agent_runs
    SET exited_at = datetime(started_at, '+10 minutes'),
        exit_code = -1
    WHERE exited_at IS NULL
  `).run();
  const cleaned = result.changes;
  if (cleaned > 0) console.log(`  Cleaned up ${cleaned} zombie agent_run(s).`);
}

function q(sql, ...params) {
  return db.prepare(sql).all(...params);
}
function qOne(sql, ...params) {
  return db.prepare(sql).get(...params);
}
function run(sql, ...params) {
  return db.prepare(sql).run(...params);
}

function slugify(str) {
  return String(str ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

function branchCandidatesForIssue(issue, prStack = []) {
  const branches = new Set(prStack.map(pr => pr.gt_branch).filter(Boolean));

  if (issue?.project_file_path && fs.existsSync(issue.project_file_path)) {
    try {
      const content = fs.readFileSync(issue.project_file_path, "utf-8");
      const match = content.match(/^branch-name:\s*(.+)$/m);
      if (match?.[1]?.trim()) branches.add(match[1].trim());
    } catch {}
  }

  if (issue) {
    const branchPrefix = qOne("SELECT value FROM settings WHERE key = 'branch_prefix'")?.value || "lwh";
    const identifier = issue.linear_id ?? `issue-${issue.id}`;
    branches.add(`${branchPrefix}/${identifier}-${slugify(issue.title)}`);
  }

  return [...branches];
}

async function deleteLocalBranches(branches, cwd, errors) {
  for (const branch of branches) {
    try {
      await execAsync("git", ["branch", "-D", branch], { cwd, timeout: 15000 });
    } catch (e) {
      const message = e.message ?? "";
      const stderr = e.stderr ?? "";
      if (!message.includes("not found") && !stderr.includes("not found")) {
        errors.push(`git branch -D ${branch}: ${message.split("\n")[0]}`);
      }
    }
  }
}

// ── SSE ───────────────────────────────────────────────────────────────

const sseClients = new Set();

function broadcast(event, data) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) {
    try { res.write(msg); } catch { sseClients.delete(res); }
  }
}

// Poll DB and broadcast changes. Agents/watchers write directly to SQLite, so
// dashboard SSE needs a lightweight DB heartbeat for external state changes
// such as GitHub PR approvals detected by watcher.js.
let lastDbChangeSignature = null;
function dashboardDbChangeSignature() {
  const issueSig = qOne("SELECT COUNT(*) AS count, MAX(updated_at) AS updated_at FROM issues") ?? {};
  const decisionSig = qOne("SELECT COUNT(*) AS count, MAX(created_at) AS created_at, MAX(resolved_at) AS resolved_at FROM decision_queue") ?? {};
  return `${issueSig.count ?? 0}:${issueSig.updated_at ?? ""}|${decisionSig.count ?? 0}:${decisionSig.created_at ?? ""}:${decisionSig.resolved_at ?? ""}`;
}
try { lastDbChangeSignature = dashboardDbChangeSignature(); } catch {}
setInterval(() => {
  try {
    const nextSignature = dashboardDbChangeSignature();
    if (lastDbChangeSignature && nextSignature !== lastDbChangeSignature) {
      broadcast("issue_updated", { reason: "db-change", ts: Date.now() });
    }
    lastDbChangeSignature = nextSignature;
  } catch {}
}, 5000);
setInterval(() => {
  broadcast("tick", { ts: Date.now() });
}, 30000);

// ── Scheduler watchdog ────────────────────────────────────────────
// Check every 30s that the scheduler process is alive. If not, restart it.
const SCHEDULER_PATH = path.join(FORGE_DIR, "start-scheduler.mjs");
const WORKSPACE_RUN_CONFIG_PATH = path.join(FORGE_DIR, "workspace-run.config.json");
let _schedulerProc = null;

function shellQuote(value) {
  const s = String(value);
  if (s.length === 0) return "''";
  return `'${s.replace(/'/g, `'"'"'`)}'`;
}

function normalizeLocalPrefix(prefix) {
  return path.resolve(prefix).replace(/\/$/, "");
}

function translateWorkspacePath(localPath, mappings = []) {
  if (!localPath) return null;
  const resolved = path.resolve(localPath);
  const matches = mappings
    .filter((mapping) => mapping?.localPrefix && mapping?.remotePrefix)
    .map((mapping) => ({
      localPrefix: normalizeLocalPrefix(mapping.localPrefix),
      remotePrefix: String(mapping.remotePrefix).replace(/\/$/, ""),
    }))
    .filter((mapping) => resolved === mapping.localPrefix || resolved.startsWith(`${mapping.localPrefix}${path.sep}`))
    .sort((a, b) => b.localPrefix.length - a.localPrefix.length);
  if (!matches.length) return null;
  const match = matches[0];
  const suffix = resolved.slice(match.localPrefix.length).split(path.sep).join("/");
  return `${match.remotePrefix}${suffix}`;
}

function getWorkspaceRunConfig() {
  if (!fs.existsSync(WORKSPACE_RUN_CONFIG_PATH)) return { mode: "local" };
  try {
    const config = JSON.parse(fs.readFileSync(WORKSPACE_RUN_CONFIG_PATH, "utf-8"));
    if (!config || typeof config !== "object") return { mode: "local" };
    return { mode: config.mode || "local", ssh: config.ssh || null };
  } catch {
    return { mode: "local" };
  }
}

function getWorkspaceRunSshConfig() {
  const config = getWorkspaceRunConfig();
  if (config?.mode !== "ssh" || !config.ssh?.target) return null;
  return config.ssh;
}

function getWorkspaceTargetPath(worktreePath) {
  if (!worktreePath) return null;
  const config = getWorkspaceRunConfig();
  if (config.mode === "ssh") {
    const ssh = getWorkspaceRunSshConfig();
    if (!ssh?.target) return null;
    return translateWorkspacePath(worktreePath, ssh.pathMappings || []);
  }
  return worktreePath;
}

function getWorktreeProvider() {
  return qOne("SELECT value FROM settings WHERE key = 'worktree_provider'")?.value || "wt";
}

function getRepoCommandCwd() {
  const provider = getWorktreeProvider();
  if (provider === "git") {
    return qOne("SELECT value FROM settings WHERE key = 'repo_root'")?.value
      || process.cwd();
  }
  const wtRoot = qOne("SELECT value FROM settings WHERE key = 'wt_root'")?.value
    || path.join(os.homedir(), "Projects", "worktrees");
  const mainWt = wtRoot + ".main";
  return fs.existsSync(mainWt) ? mainWt : wtRoot;
}

async function removeIssueWorktree(worktreePath, errors) {
  if (!worktreePath || !fs.existsSync(worktreePath)) return;
  const provider = getWorktreeProvider();
  const cwd = getRepoCommandCwd();
  if (provider === "git") {
    await execAsync("git", ["worktree", "remove", "--force", worktreePath], { cwd, timeout: 30000 })
      .catch(e => errors.push(`git worktree remove: ${e.message}`));
    await execAsync("git", ["worktree", "prune"], { cwd, timeout: 30000 })
      .catch(e => errors.push(`git worktree prune: ${e.message}`));
    return;
  }
  await execAsync("wt", ["remove", "--force", "-D", worktreePath], { cwd, timeout: 30000 })
    .catch(e => errors.push(`wt remove: ${e.message}`));
}

function getVmConnectCommand(worktreePath) {
  if (!worktreePath) return null;
  const config = getWorkspaceRunConfig();
  if (config.mode !== "ssh") return `cd ${shellQuote(worktreePath)} && exec \${SHELL:-/bin/bash} -l`;
  const ssh = getWorkspaceRunSshConfig();
  if (!ssh?.target) return null;
  const remotePath = translateWorkspacePath(worktreePath, ssh.pathMappings || []);
  if (!remotePath) return null;
  const sshArgs = Array.isArray(ssh.args) && ssh.args.length
    ? `${ssh.args.map(shellQuote).join(" ")} `
    : "";
  return `ssh ${sshArgs}-t ${shellQuote(ssh.target)} ${shellQuote(`cd ${shellQuote(remotePath)} && exec \${SHELL:-/bin/bash} -l`)}`;
}

function classifyChangedFiles(files) {
  const backendRe = /^(functions|apps\/external_api|websockets-service|scheduler|shared\/backend|prisma)\//;
  const databaseRe = /(^|\/)(migrations?|prisma|schema\.prisma|seed|mysql|database|db)(\/|\.|$)|\.sql$/i;
  const frontendRe = /^(frontend|apps\/frontend|locales|storybook)\//;
  const database = files.some(f => databaseRe.test(f));
  const backend = database || files.some(f => backendRe.test(f));
  const frontend = files.some(f => frontendRe.test(f)) || (!backend && files.length > 0);
  return { frontend, backend, database };
}

function getIssueLaunchRef(issue) {
  const topPr = qOne("SELECT gt_branch FROM pr_stack WHERE issue_id = ? ORDER BY position DESC LIMIT 1", issue.id);
  let branch = topPr?.gt_branch || "HEAD";
  if (!topPr?.gt_branch && issue.wt_path) {
    try {
      branch = gitInWorktree(issue.wt_path, ["branch", "--show-current"], { timeout: 5000 }).trim() || "HEAD";
    } catch {}
  }
  let sha = branch;
  if (issue.wt_path) {
    try {
      sha = gitInWorktree(issue.wt_path, ["rev-parse", branch], { timeout: 5000 }).trim() || branch;
    } catch {}
  }
  return { branch, sha };
}

function normalizeBaseBranch(baseBranch) {
  return String(baseBranch || "main")
    .trim()
    .replace(/^refs\/remotes\/origin\//, "")
    .replace(/^origin\//, "")
    .replace(/^refs\/heads\//, "") || "main";
}

function getSettingValue(key, fallback = "") {
  return qOne("SELECT value FROM settings WHERE key = ?", key)?.value ?? fallback;
}

function getRemoteWorktreePath(wtPath) {
  if (!wtPath || process.platform === "linux") return null;
  const target = getSettingValue("vm_ssh_target").trim();
  const hostPrefix = getSettingValue("host_path_prefix").trim().replace(/\/$/, "");
  const vmPrefix = getSettingValue("vm_path_prefix").trim().replace(/\/$/, "");
  if (!target || !hostPrefix || !vmPrefix) return null;

  try {
    const gitFile = path.join(wtPath, ".git");
    if (!fs.existsSync(gitFile)) return null;
    const content = fs.readFileSync(gitFile, "utf-8").trim();
    if (!content.startsWith(`gitdir: ${vmPrefix}/`) && content !== `gitdir: ${vmPrefix}`) return null;
    const resolved = path.resolve(wtPath);
    const resolvedHostPrefix = path.resolve(hostPrefix).replace(/\/$/, "");
    if (resolved !== resolvedHostPrefix && !resolved.startsWith(`${resolvedHostPrefix}${path.sep}`)) return null;
    const suffix = resolved.slice(resolvedHostPrefix.length).split(path.sep).join("/");
    return `${vmPrefix}${suffix}`;
  } catch {
    return null;
  }
}

/**
 * Run a git command in the given worktree. If an SSH target and path mapping
 * are configured, worktrees whose .git file points at the remote path are run
 * through that SSH target.
 */
function resolveWorktreePath(wtPath, issue = null) {
  if (!wtPath) return null;
  if (fs.existsSync(wtPath)) return wtPath;

  const dir = path.dirname(wtPath);
  const candidates = [];
  const searchKey = String(issue?.linear_id || issue?.id || "").toLowerCase();
  if (searchKey) {
    try {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory() && entry.name.toLowerCase().includes(searchKey)) {
          candidates.push(path.join(dir, entry.name));
        }
      }
    } catch {}
  }

  return candidates.find(p => fs.existsSync(p)) || wtPath;
}

function gitInWorktree(wtPath, args, opts = {}) {
  const remotePath = getRemoteWorktreePath(wtPath);
  if (remotePath) {
    const target = getSettingValue("vm_ssh_target").trim();
    const quotedArgs = ["git", "-C", remotePath, ...args].map(a =>
      `'${String(a).replace(/'/g, "'\"'\"'")}'`
    ).join(" ");
    return execFileSync("ssh", [target, quotedArgs], {
      encoding: "utf-8",
      timeout: opts.timeout ?? 30000,
      maxBuffer: opts.maxBuffer ?? 10 * 1024 * 1024,
    });
  }
  return execFileSync("git", args, {
    cwd: wtPath,
    encoding: "utf-8",
    timeout: opts.timeout ?? 30000,
    maxBuffer: opts.maxBuffer ?? 10 * 1024 * 1024,
    ...opts,
  });
}

function fetchRemoteBaseRef(cwd, baseBranch) {
  const branch = normalizeBaseBranch(baseBranch);
  const remoteRef = `refs/remotes/origin/${branch}`;
  gitInWorktree(cwd, ["fetch", "--prune", "origin", `+refs/heads/${branch}:${remoteRef}`], { timeout: 30000 });
  return { branch, ref: remoteRef, display: `origin/${branch}` };
}

function getIssueBaseBranch(issue) {
  try {
    const content = fs.readFileSync(issue.project_file_path, "utf-8");
    const match = content.match(/^base-branch:\s*(.+)$/m);
    return normalizeBaseBranch(match?.[1]);
  } catch {
    return normalizeBaseBranch(qOne("SELECT value FROM settings WHERE key = 'default_branch'")?.value || "main");
  }
}

function rebaseIssueBranches(issue) {
  const wtPath = resolveWorktreePath(issue.wt_path, issue);
  if (!wtPath || !fs.existsSync(wtPath)) throw new Error(`Worktree not found: ${issue.wt_path || "(none)"}`);

  const status = gitInWorktree(wtPath, ["status", "--porcelain"], { timeout: 10000 });
  if (status.trim()) throw new Error("Worktree has uncommitted changes; commit or discard them before rebasing.");

  const allPrStack = q("SELECT * FROM pr_stack WHERE issue_id = ? ORDER BY position ASC", issue.id);
  const prStack = allPrStack.filter(pr => pr.gt_branch && pr.status !== "merged" && pr.status !== "closed");
  const baseBranch = getIssueBaseBranch(issue);
  const defaultBase = fetchRemoteBaseRef(wtPath, baseBranch).display;
  const branches = prStack.length
    ? prStack.map(pr => {
        const parent = pr.base_pr_id ? allPrStack.find(candidate => candidate.id === pr.base_pr_id) : null;
        return { branch: pr.gt_branch, base: parent?.gt_branch || defaultBase };
      })
    : branchCandidatesForIssue(issue, []).slice(0, 1).map(branch => ({ branch, base: defaultBase }));

  if (!branches.length) throw new Error("No branch found to rebase for this issue.");

  const originalBranch = gitInWorktree(wtPath, ["rev-parse", "--abbrev-ref", "HEAD"], { timeout: 10000 }).trim();
  const logLines = [];
  let conflict = null;
  try {
    for (const { branch, base } of branches) {
      gitInWorktree(wtPath, ["checkout", branch], { timeout: 30000 });
      try {
        gitInWorktree(wtPath, ["rebase", base], { timeout: 120000, maxBuffer: 20 * 1024 * 1024 });
      } catch (e) {
        conflict = {
          branch,
          base,
          message: String(e.message ?? e),
          stderr: e.stderr ? String(e.stderr) : "",
          stdout: e.stdout ? String(e.stdout) : "",
        };
        const err = new Error(`Rebase conflict while rebasing ${branch} onto ${base}`);
        err.rebaseConflict = conflict;
        throw err;
      }
      gitInWorktree(wtPath, ["push", "--force-with-lease", "origin", branch], { timeout: 120000, maxBuffer: 20 * 1024 * 1024 });
      logLines.push(`${branch} rebased onto ${base} and pushed`);
    }
  } finally {
    if (!conflict && originalBranch && originalBranch !== "HEAD") {
      try { gitInWorktree(wtPath, ["checkout", originalBranch], { timeout: 30000 }); } catch {}
    }
  }

  return logLines;
}

function getIssueChangedFiles(issue, launchRef = { branch: "HEAD", sha: "HEAD" }) {
  const wtPath = resolveWorktreePath(issue.wt_path, issue);
  if (!wtPath) return [];
  const base = getIssueBaseBranch(issue);
  const ref = launchRef.sha || launchRef.branch || "HEAD";
  const files = new Set();
  try {
    const baseRef = fetchRemoteBaseRef(wtPath, base).ref;
    const raw = gitInWorktree(wtPath, ["diff", "--name-only", `${baseRef}...${ref}`], { timeout: 10000 });
    raw.split("\n").map(s => s.trim()).filter(Boolean).forEach(f => files.add(f));
  } catch {}
  try {
    const raw = gitInWorktree(wtPath, ["diff", "--name-only", ref], { timeout: 10000 });
    raw.split("\n").map(s => s.trim()).filter(Boolean).forEach(f => files.add(f));
  } catch {}
  return [...files].sort();
}

const VM_RUNTIME_META_PATH = "/tmp/forge-runtime.json";
const VM_RUNTIME_SESSIONS = ["forge-db", "forge-backend", "forge-frontend"];

function buildVmLaunchScript({ remoteWorktreePath, changedFiles, classification, metadata }) {
  const settings = Object.fromEntries(q("SELECT key, value FROM settings").map(s => [s.key, s.value]));
  const targetDir = remoteWorktreePath;
  const frontendCommand = (classification.backend || classification.database)
    ? settings.vm_frontend_local_backend_command
    : settings.vm_frontend_staging_backend_command;
  const backendCommand = classification.database
    ? settings.vm_backend_local_command
    : settings.vm_backend_staging_command;
  const databaseCommand = String(settings.vm_database_command || "").trim();
  const tmuxStart = (name, command) => {
    const logPath = `/tmp/${name}.log`;
    const wrapped = [
      `echo "[forge] starting ${name} at $(date -Iseconds)"`,
      `cd ${shellQuote(targetDir)}`,
      `export PATH=\"$HOME/.nvm/versions/node/v22.15.0/bin:$PATH\"`,
      `set -o pipefail`,
      `(${command}) 2>&1 | tee ${shellQuote(logPath)}`,
      `code=\${PIPESTATUS[0]}`,
      `echo "[forge] ${name} exited with code $code at $(date -Iseconds)" | tee -a ${shellQuote(logPath)}`,
      `while true; do sleep 3600; done`,
    ].join("; ");
    return `rm -f ${shellQuote(logPath)}; tmux new-session -d -s ${shellQuote(name)} ${shellQuote(`bash -lc ${shellQuote(wrapped)}`)}`;
  };
  const starts = [];
  if (classification.database && databaseCommand) {
    starts.push(tmuxStart("forge-db", databaseCommand));
    starts.push(`sleep 8`);
  }
  if (classification.backend || classification.database) {
    starts.push(tmuxStart("forge-backend", backendCommand));
  }
  starts.push(tmuxStart("forge-frontend", frontendCommand));

  return `set -euo pipefail
TARGET_DIR=${shellQuote(targetDir)}
echo "Stopping existing Forge runtime sessions..."
for s in forge-frontend forge-backend forge-db; do tmux kill-session -t "$s" 2>/dev/null || true; done
# tmux can leave pnpm/concurrently/nodemon child processes orphaned under pid 1.
# Kill only runtime-like processes tied to the previously/currently launched worktree.
PREV_TARGET=""
if [ -f ${shellQuote(VM_RUNTIME_META_PATH)} ]; then
  PREV_TARGET=$(node -e 'try{const m=require(process.argv[1]); console.log(m.remoteWorktreePath||m.worktreePath||"")}catch{}' ${shellQuote(VM_RUNTIME_META_PATH)} 2>/dev/null || true)
fi
for dir in "$PREV_TARGET" "$TARGET_DIR"; do
  [ -n "$dir" ] || continue
  pids=$(ps -eo pid=,args= | awk -v d="$dir" '$0 ~ d && $0 ~ /(pnpm|vite|nodemon|concurrently|tsc --noEmit|node -r @swc-node)/ { print $1 }' || true)
  [ -z "$pids" ] || kill $pids 2>/dev/null || true
  sleep 1
  [ -z "$pids" ] || kill -9 $pids 2>/dev/null || true
 done
cat > ${shellQuote(VM_RUNTIME_META_PATH)} <<'FORGE_VM_META'
${JSON.stringify(metadata, null, 2)}
FORGE_VM_META

cd "$TARGET_DIR"
echo "Using issue worktree: $TARGET_DIR"
echo "Branch: $(git branch --show-current 2>/dev/null || echo unknown)"
echo "Commit: $(git rev-parse --short HEAD 2>/dev/null || echo unknown)"

echo "Changed files: ${changedFiles.length}"
${changedFiles.slice(0, 40).map(f => `echo " - ${f.replace(/"/g, '\\"')}"`).join("\n") || "echo \" - none detected\""}
${changedFiles.length > 40 ? `echo " - ... ${changedFiles.length - 40} more"` : ""}
echo "Classification: frontend=${classification.frontend} backend=${classification.backend} database=${classification.database}"
${starts.length ? starts.join("\n") : "echo \"No frontend/backend/database changes detected; worktree selected only.\""}
echo "Done. Sessions:"
tmux ls 2>/dev/null | grep forge- || true
for s in forge-db forge-backend forge-frontend; do
  echo "--- $s status ---"
  if tmux has-session -t "$s" 2>/dev/null; then
    echo "running"
    tmux capture-pane -pt "$s" -S -40 2>/dev/null || true
  else
    echo "not running"
    if [ -f "/tmp/$s.log" ]; then tail -40 "/tmp/$s.log"; fi
  fi
done
`;
}

function runWorkspaceScript(script, timeout = 15000, maxBuffer = 1024 * 1024) {
  const config = getWorkspaceRunConfig();
  if (config.mode === "ssh") {
    const ssh = getWorkspaceRunSshConfig();
    if (!ssh?.target) return null;
    const sshArgs = Array.isArray(ssh.args) ? ssh.args : [];
    return execFileSync("ssh", [...sshArgs, ssh.target, script], {
      encoding: "utf-8",
      timeout,
      maxBuffer,
    });
  }
  return execFileSync("bash", ["-lc", script], {
    encoding: "utf-8",
    timeout,
    maxBuffer,
  });
}

function getVmRuntimeStatus() {
  const config = getWorkspaceRunConfig();
  const target = config.mode === "ssh" ? getWorkspaceRunSshConfig()?.target : "local";
  try {
    const output = runWorkspaceScript(`set +e
meta='{}'
[ -f ${shellQuote(VM_RUNTIME_META_PATH)} ] && meta=$(cat ${shellQuote(VM_RUNTIME_META_PATH)})
printf '%s\n' "$meta"
echo __FORGE_SESSIONS__
for s in ${VM_RUNTIME_SESSIONS.map(shellQuote).join(" ")}; do
  if tmux has-session -t "$s" 2>/dev/null; then echo "$s:running"; else echo "$s:stopped"; fi
done
`, 3000);
    const [metaRaw = "{}", sessionsRaw = ""] = String(output).split("\n__FORGE_SESSIONS__\n");
    let metadata = {};
    try { metadata = JSON.parse(metaRaw.trim() || "{}"); } catch {}
    const sessions = sessionsRaw.split("\n").map(line => line.trim()).filter(Boolean).map(line => {
      const [name, status] = line.split(":");
      return { name, running: status === "running" };
    });
    return { configured: true, mode: config.mode || "local", target, metadata, sessions, running: sessions.some(s => s.running) };
  } catch (e) {
    return { configured: true, mode: config.mode || "local", target, running: false, sessions: [], error: e.message };
  }
}

function stopVmRuntime() {
  const script = `set +e
META=${shellQuote(VM_RUNTIME_META_PATH)}
TARGET_DIR=""
[ -f "$META" ] && TARGET_DIR=$(node -e 'try{const m=require(process.argv[1]); console.log(m.remoteWorktreePath||m.worktreePath||"")}catch{}' "$META" 2>/dev/null || true)
for s in ${VM_RUNTIME_SESSIONS.map(shellQuote).join(" ")}; do tmux kill-session -t "$s" 2>/dev/null || true; done
for dir in "$TARGET_DIR"; do
  [ -n "$dir" ] || continue
  pids=$(ps -eo pid=,args= | awk -v d="$dir" '$0 ~ d && $0 ~ /(pnpm|vite|nodemon|concurrently|tsc --noEmit|node -r @swc-node)/ { print $1 }' || true)
  [ -z "$pids" ] || kill $pids 2>/dev/null || true
  sleep 1
  [ -z "$pids" ] || kill -9 $pids 2>/dev/null || true
done
rm -f "$META"
echo stopped
`;
  return runWorkspaceScript(script, 10000);
}

function openFrontendInBrowser() {
  try {
    require("child_process").spawn("open", ["http://localhost:3000"], { detached: true, stdio: "ignore" }).unref();
  } catch {}
}

function isSchedulerAlive() {
  // First check our own handle
  if (_schedulerProc && _schedulerProc.exitCode === null && !_schedulerProc.killed) return true;
  // Fall back to the PID recorded in the DB
  const row = qOne("SELECT pid FROM scheduler_state WHERE id = 1");
  if (!row?.pid) return false;
  try { process.kill(row.pid, 0); return true; } catch { return false; }
}

function startScheduler() {
  console.log("[watchdog] Starting scheduler...");
  const { spawn } = require("child_process");
  _schedulerProc = spawn(process.execPath, [SCHEDULER_PATH], {
    stdio: "inherit",
    detached: false,
  });
  _schedulerProc.on("exit", (code) => {
    console.log(`[watchdog] Scheduler exited (code ${code}) — will restart on next heartbeat`);
  });
}

setInterval(() => {
  if (!isSchedulerAlive()) {
    console.log("[watchdog] Scheduler is not running — restarting...");
    startScheduler();
    broadcast("tick", { ts: Date.now() }); // refresh UI immediately
  }
}, 30000);

// ── Express app ───────────────────────────────────────────────────────

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  if (req.path === "/" || req.path === "/index.html" || req.path.startsWith("/v3/")) {
    res.setHeader("Cache-Control", "no-store, max-age=0");
  }
  next();
});
app.use(express.static(path.join(__dirname, "public")));

// ── SSE endpoint ──────────────────────────────────────────────────────

app.get("/api/desktop-capabilities", (_req, res) => {
  // The native desktop wrapper intercepts this route before proxying to the
  // dashboard and returns `{ notifications: true }` on supported platforms.
  // When the dashboard is opened directly in a browser, keep the route present
  // so the shared frontend does not log a 404.
  res.json({ notifications: false });
});

app.post("/api/desktop-notify", (_req, res) => {
  // The native desktop wrapper intercepts this route and displays the native
  // notification. Direct browser access receives a graceful unsupported
  // response so v3 can fall back to browser notifications without a 404.
  res.status(501).json({ ok: false, error: "Desktop notifications unavailable" });
});

app.get("/desktop/backend", (_req, res) => {
  res.type("html").send(`<!doctype html>
<html><head><title>Forge Backend</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:48px;color:#111827}code{background:#f3f4f6;padding:2px 4px;border-radius:4px}</style></head>
<body>
  <h1>Backend picker unavailable</h1>
  <p>The backend picker is provided by the Forge desktop app. Open this dashboard through the desktop app to switch backends from the UI.</p>
  <p>From a terminal you can also launch the desktop app with:</p>
  <p><code>FORGE_BACKEND_ORIGIN=http://&lt;host&gt;:3142 deno task desktop</code></p>
</body></html>`);
});

app.get("/api/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  sseClients.add(res);
  req.on("close", () => sseClients.delete(res));
});

// ── Overview ──────────────────────────────────────────────────────────

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/desktop/status", (_req, res) => {
  const pending = qOne("SELECT COUNT(*) AS count FROM desktop_jobs WHERE status = 'pending'")?.count ?? 0;
  const running = qOne("SELECT COUNT(*) AS count FROM desktop_jobs WHERE status = 'running'")?.count ?? 0;
  const heartbeat = getDesktopCache("desktop.heartbeat");
  res.json({ pending, running, heartbeat });
});

app.post("/api/desktop/heartbeat", (req, res) => {
  setDesktopCache("desktop.heartbeat", { ...(req.body || {}), at: new Date().toISOString() });
  res.json({ ok: true });
});

app.get("/api/desktop/jobs", (req, res) => {
  const limit = Math.max(1, Math.min(20, parseInt(String(req.query.limit || "5"), 10) || 5));
  run("UPDATE desktop_jobs SET status = 'pending', claimed_at = NULL WHERE status = 'running' AND claimed_at < datetime('now', '-2 minutes')");
  const jobs = db.transaction(() => {
    const rows = q(
      "SELECT * FROM desktop_jobs WHERE status = 'pending' ORDER BY created_at ASC, id ASC LIMIT ?",
      limit
    );
    for (const row of rows) {
      run("UPDATE desktop_jobs SET status = 'running', claimed_at = datetime('now') WHERE id = ?", row.id);
    }
    return rows.map(row => ({ ...row, payload: JSON.parse(row.payload_json || "{}") }));
  })();
  res.json(jobs);
});

app.post("/api/desktop/jobs/:id/complete", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const job = qOne("SELECT * FROM desktop_jobs WHERE id = ?", id);
  if (!job) return res.status(404).json({ error: "Job not found" });
  const ok = req.body?.ok !== false;
  const result = req.body?.result ?? null;
  const error = req.body?.error ? String(req.body.error) : null;
  run(
    "UPDATE desktop_jobs SET status = ?, result_json = ?, error = ?, completed_at = datetime('now') WHERE id = ?",
    ok ? "done" : "failed",
    JSON.stringify(result),
    error,
    id
  );

  let payload = {};
  try { payload = JSON.parse(job.payload_json || "{}"); } catch {}
  if (ok && job.type === "linear.fetchIssue" && result?.linearId) {
    run(
      "UPDATE issues SET title = COALESCE(?, title), priority = COALESCE(?, priority), updated_at = datetime('now') WHERE linear_id = ?",
      result.title ?? null,
      normalizeLinearPriority(result.priority, result),
      result.linearId
    );
    setDesktopCache(`linear.issue.${result.linearId}`, result);
  }
  if (ok && job.type === "linear.syncState" && payload.issueId && payload.state) {
    run("UPDATE issues SET linear_state = ?, updated_at = datetime('now') WHERE id = ?", payload.state, payload.issueId);
  }
  if (job.type === "linear.listAssigned") {
    setDesktopCache("linear.assigned", ok && Array.isArray(result) ? filterLinearBacklogIssues(result) : []);
  }
  broadcast("desktop_job_completed", { id, type: job.type });
  broadcast("tick", { ts: Date.now() });
  res.json({ ok: true });
});

app.get("/api/overview", async (_req, res) => {
  const issues = q(`
    SELECT issues.*,
      (
        SELECT pr_number FROM pr_stack
        WHERE pr_stack.issue_id = issues.id AND pr_number IS NOT NULL
        ORDER BY position ASC
        LIMIT 1
      ) AS primary_pr_number
    FROM issues
    WHERE issues.state != 'DONE'
    ORDER BY priority ASC, created_at ASC
  `);
  const decisions = q("SELECT * FROM decision_queue WHERE verdict IS NULL ORDER BY created_at ASC");
  const runningAgents = q("SELECT * FROM agent_runs WHERE exited_at IS NULL ORDER BY started_at DESC");
  const scheduler = qOne("SELECT * FROM scheduler_state WHERE id = 1");
  const settings = q("SELECT * FROM settings");
  const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]));
  const todayStart = startOfLocalDaySql();
  const weekAgo = toSqlUtc(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const workedTodayCount = qOne(
    "SELECT COUNT(DISTINCT issue_id) as count FROM activity_log WHERE created_at >= ?",
    todayStart
  )?.count ?? 0;
  const failedCount = qOne("SELECT COUNT(*) as count FROM issues WHERE state = 'FAILED'")?.count ?? 0;
  const archiveCount = qOne("SELECT COUNT(*) as count FROM issues WHERE state = 'DONE'")?.count ?? 0;
  const doneThisWeekCount = qOne(
    `SELECT COUNT(DISTINCT i.id) as count
       FROM issues i
       LEFT JOIN activity_log a
         ON a.issue_id = i.id
        AND a.type = 'completed'
        AND a.created_at >= ?
      WHERE i.state = 'DONE'
        AND (i.updated_at >= ? OR a.id IS NOT NULL)`,
    weekAgo,
    weekAgo
  )?.count ?? 0;
  const learningSuggestionsCount = qOne("SELECT COUNT(*) as count FROM learning_suggestions WHERE status = 'pending'")?.count ?? 0;
  const repo = settingsMap.github_repo ?? "";

  const enrichedIssues = await Promise.all(issues.map(async (issue) => {
    let prStack = q("SELECT * FROM pr_stack WHERE issue_id = ? ORDER BY position ASC", issue.id)
      .map(pr => ({ ...pr, url: repo && pr.pr_number ? `https://github.com/${repo}/pull/${pr.pr_number}` : null }));
    if (["WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "PUSHING", "REBASING"].includes(issue.state)) {
      prStack = await enrichPrStackStatus(prStack, issue.wt_path);
      if (!issue.pr_approved_at && prStack.some(pr => pr.reviewDecision === "APPROVED")) {
        issue.pr_approved_at = new Date().toISOString();
        run("UPDATE issues SET pr_approved_at = datetime('now'), updated_at = datetime('now') WHERE id = ?", issue.id);
      }
    }
    return { ...issue, prStack };
  }));

  // Enrich decisions with issue titles
  const enrichedDecisions = decisions.map(d => ({
    ...d,
    issueTitle: qOne("SELECT title FROM issues WHERE id = ?", d.issue_id)?.title ?? "Unknown",
  }));

  res.json({
    issues: enrichedIssues,
    decisions: enrichedDecisions,
    runningAgents,
    scheduler,
    settings: settingsMap,
    workedTodayCount,
    failedCount,
    archiveCount,
    doneThisWeek: doneThisWeekCount,
    doneThisWeekCount,
    learningSuggestionsCount,
    vmRuntime: getVmRuntimeStatus(),
  });
});

function toSqlUtc(date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

function startOfLocalDaySql(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return toSqlUtc(start);
}

function slackLinearLink(linearId) {
  return linearId ? `<https://linear.app/issue/${linearId}|${linearId}>` : "Manual issue";
}

function slackPrLinks(prStack) {
  const repo = qOne("SELECT value FROM settings WHERE key = 'github_repo'")?.value ?? "";
  return prStack
    .filter(pr => pr.pr_number)
    .map(pr => repo ? `<https://github.com/${repo}/pull/${pr.pr_number}|PR #${pr.pr_number}>` : `PR #${pr.pr_number}`)
    .join(", ");
}

function issueBrief(issue) {
  const summaryPath = path.join(FORGE_DIR, "projects", String(issue.id), "summary.md");
  if (fs.existsSync(summaryPath)) {
    const text = fs.readFileSync(summaryPath, "utf-8")
      .split("\n")
      .map(line => line.replace(/^[-*#\s]+/, "").trim())
      .find(line => line && !/^linear|^pr stack|^agent runs|^decisions/i.test(line));
    if (text) return text.replace(/\s+/g, " ").slice(0, 180);
  }
  return issue.title;
}

function stateAttentionText(state) {
  return {
    AWAITING_PLAN_APPROVAL: "Needs plan review",
    AWAITING_CODE_REVIEW: "Needs code review",
    AWAITING_FIX_APPROVAL: "Needs fix approval",
    FAILED: "Blocked: failed",
    PAUSED: "Paused",
  }[state] ?? null;
}

function todayActivitySummary(issue, activity, prStack) {
  const types = new Set(activity.map(a => a.type));
  const prLinks = slackPrLinks(prStack);
  const prefix = `${slackLinearLink(issue.linear_id)} — ${issueBrief(issue)}`;
  const suffix = prLinks ? ` ${prLinks}` : "";

  if (issue.state === "DONE" || types.has("completed")) {
    return `${prefix}. Completed${prLinks ? ` / merged ${prLinks}` : ""}.`;
  }

  const attention = stateAttentionText(issue.state);
  if (attention) return `${prefix}. ${attention}.${suffix}`;

  if (types.has("pr_approved")) return `${prefix}. PR approved.${suffix}`;
  if (types.has("decision_approved")) return `${prefix}. Review/approval completed; agent work continued.${suffix}`;
  if (types.has("ai_review_rejected")) return `${prefix}. AI review found issues; fixes are in progress.${suffix}`;
  if (types.has("ai_review_approved")) return `${prefix}. AI review passed.${suffix}`;
  if (types.has("agent_completed")) return `${prefix}. Agent work completed for the current phase.${suffix}`;
  if (types.has("agent_started")) return `${prefix}. Work started.${suffix}`;
  return `${prefix}. Updated.${suffix}`;
}

function buildStandupToday() {
  const since = startOfLocalDaySql();
  const issueIds = q(
    "SELECT DISTINCT issue_id FROM activity_log WHERE created_at >= ? ORDER BY issue_id ASC",
    since
  ).map(r => r.issue_id);

  const sections = { completed: [], moved: [], attention: [] };
  const items = [];

  for (const issueId of issueIds) {
    const issue = qOne("SELECT * FROM issues WHERE id = ?", issueId);
    if (!issue) continue;
    const activity = q("SELECT * FROM activity_log WHERE issue_id = ? AND created_at >= ? ORDER BY created_at ASC", issueId, since);
    const prStack = q("SELECT * FROM pr_stack WHERE issue_id = ? ORDER BY position ASC", issueId);
    const line = todayActivitySummary(issue, activity, prStack);
    const attention = stateAttentionText(issue.state);
    const bucket = issue.state === "DONE" || activity.some(a => a.type === "completed")
      ? "completed"
      : attention ? "attention" : "moved";
    sections[bucket].push(line);
    items.push({ issue, bucket, activity, prStack, line });
  }

  const today = new Date().toISOString().slice(0, 10);
  const renderSection = (title, lines) => [`*${title}:*`, ...(lines.length ? lines.map(l => `• ${l}`) : ["• None"])].join("\n");
  const slackText = [
    `*Async standup — ${today}*`,
    "",
    renderSection("Completed", sections.completed),
    "",
    renderSection("Moved forward", sections.moved),
    "",
    renderSection("Needs attention", sections.attention),
  ].join("\n");

  return { date: today, slackText, sections, items: items.map(({ issue, bucket, line }) => ({ issueId: issue.id, linearId: issue.linear_id, bucket, line })) };
}

app.get("/api/standup/today", (_req, res) => {
  try {
    res.json(buildStandupToday());
  } catch (e) {
    res.status(500).json({ error: e.message ?? String(e) });
  }
});

// ── Issues ────────────────────────────────────────────────────────────

app.get("/api/issues", (_req, res) => {
  res.json(q("SELECT * FROM issues ORDER BY priority ASC, created_at ASC"));
});

app.post("/api/active-order", (req, res) => {
  const ids = Array.isArray(req.body?.issueIds) ? req.body.issueIds.map(Number).filter(Number.isFinite) : [];
  if (!ids.length) return res.status(400).json({ error: "issueIds required" });

  const txn = db.transaction(() => {
    ids.forEach((id, index) => {
      run(
        `UPDATE issues
         SET focus_rank = ?, updated_at = datetime('now')
         WHERE id = ? AND state NOT IN ('PENDING','DONE','IGNORED')`,
        index + 1,
        id
      );
    });
  });
  txn();
  broadcast("issue_updated", { issueIds: ids, reason: "active-order" });
  res.json({ ok: true });
});

app.get("/api/issues/:id", async (req, res) => {
  const issue = qOne("SELECT * FROM issues WHERE id = ?", req.params.id);
  if (!issue) return res.status(404).json({ error: "Not found" });

  const repo = qOne("SELECT value FROM settings WHERE key = 'github_repo'")?.value ?? "";
  let prStack = q("SELECT * FROM pr_stack WHERE issue_id = ? ORDER BY position ASC", issue.id)
    .map(pr => ({ ...pr, url: repo && pr.pr_number ? `https://github.com/${repo}/pull/${pr.pr_number}` : null }));
  const fast = req.query.fast === "1" || req.query.fast === "true";
  if (!fast && ["WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "PUSHING", "REBASING", "DONE"].includes(issue.state)) {
    prStack = await enrichPrStackStatus(prStack, issue.wt_path);
  }
  const decisions = q("SELECT * FROM decision_queue WHERE issue_id = ? ORDER BY created_at DESC", issue.id);
  const agentRuns    = q("SELECT * FROM agent_runs WHERE issue_id = ? ORDER BY started_at DESC", issue.id);
  const activityLog  = q("SELECT * FROM activity_log WHERE issue_id = ? ORDER BY created_at ASC, id ASC", issue.id);
  const learningEvents = q("SELECT * FROM learning_events WHERE issue_id = ? ORDER BY created_at DESC LIMIT 20", issue.id);
  const learningSuggestions = q("SELECT * FROM learning_suggestions WHERE issue_id = ? ORDER BY created_at DESC", issue.id);
  const learningChangeLog = q("SELECT * FROM learning_change_log WHERE issue_id = ? ORDER BY created_at DESC LIMIT 30", issue.id);

  // Failure context — last failed run + human-readable summary
  let failureContext = null;
  if (issue.state === "FAILED") {
    const failedRun = qOne(
      "SELECT * FROM agent_runs WHERE issue_id = ? AND (exit_code != 0 OR exit_code IS NULL) ORDER BY started_at DESC LIMIT 1",
      issue.id
    );
    if (failedRun) {
      failureContext = { run: failedRun, logTail: null };
      if (failedRun.log_path && fs.existsSync(failedRun.log_path)) {
        const raw = fs.readFileSync(failedRun.log_path, "utf-8");
        const lines = raw.split("\n");

        // Collect agent-runner's own log messages (non-JSON lines starting with timestamp)
        const runnerLines = lines
          .filter(l => l.match(/^\[\d{4}-\d{2}-\d{2}T/) && !l.startsWith('{'))
          .slice(-20);

        // Extract the last text message from the assistant (from turn_end events)
        let lastAgentText = null;
        for (const line of lines) {
          try {
            const e = JSON.parse(line);
            if (e.type === "turn_end" && e.message?.role === "assistant") {
              const textBlock = e.message.content?.find(b => b.type === "text" && b.text?.trim());
              if (textBlock) lastAgentText = textBlock.text.trim();
            }
          } catch {}
        }

        // Also grab any FATAL lines from the runner
        const fatalLines = lines.filter(l => l.includes("[FATAL]") || l.includes("ERROR"));

        const summary = [
          ...runnerLines,
          ...(fatalLines.length ? ["\n--- Errors ---", ...fatalLines.slice(-5)] : []),
          ...(lastAgentText ? ["\n--- Last agent message ---", lastAgentText.slice(0, 500)] : []),
        ].join("\n").trim();

        failureContext.logTail = summary || "No details available.";
      }
    }
  }
  const assets = q("SELECT * FROM assets WHERE issue_id = ?", issue.id);

  let planContent = null;
  if (issue.project_file_path && fs.existsSync(issue.project_file_path)) {
    planContent = fs.readFileSync(issue.project_file_path, "utf-8");
  }

  let handoffContent = null;
  const handoffPath = path.join(FORGE_DIR, "projects", String(issue.id), "handoff.md");
  if (fs.existsSync(handoffPath)) {
    handoffContent = fs.readFileSync(handoffPath, "utf-8");
  }

  let summaryContent = null;
  const summaryPath = path.join(FORGE_DIR, "projects", String(issue.id), "summary.md");
  if (fs.existsSync(summaryPath)) {
    summaryContent = fs.readFileSync(summaryPath, "utf-8");
  }

  const vmConnectCommand = getVmConnectCommand(issue.wt_path);

  res.json({ issue, prStack, decisions, agentRuns, activityLog, assets, planContent, handoffContent, summaryContent, failureContext, vmConnectCommand, learningEvents, learningSuggestions, learningChangeLog });
});

function autoApprovePendingFixDecision(issueId, actor = "system") {
  const decision = qOne(`
    SELECT * FROM decision_queue
    WHERE issue_id = ? AND type = 'FIX_APPROVAL' AND verdict IS NULL
    ORDER BY created_at ASC LIMIT 1
  `, issueId);
  if (!decision) return false;

  let comments = [];
  try { comments = JSON.parse(decision.artifact_ref).comments ?? []; } catch {}
  const approvedIds = comments.map(c => String(c.id)).filter(Boolean);
  const feedback = { approvedIds, skippedIds: [], autoFix: true };

  run(`UPDATE decision_queue SET verdict = 'approved', feedback_json = ?, resolved_at = datetime('now') WHERE id = ?`,
    JSON.stringify(feedback), decision.id);

  if (comments.length) {
    const lines = ["Auto-fix enabled. Address all surfaced PR review comments:", ""];
    for (const c of comments) {
      const loc = c.path ? `${c.path}${c.line ? `:${c.line}` : ""}` : "(general)";
      lines.push(`### Comment by ${c.author ?? "unknown"} on ${loc}`);
      if (c.prNumber) lines.push(`PR #${c.prNumber}`);
      lines.push(c.body ?? "");
      lines.push("");
    }
    run(`UPDATE issues SET previous_state = state, state = 'FIXING', steering_context = ?, locked_at = NULL, agent_pid = NULL, updated_at = datetime('now') WHERE id = ?`,
      lines.join("\n"), issueId);
  } else {
    run(`UPDATE issues SET previous_state = state, state = 'FIXING', locked_at = NULL, agent_pid = NULL, updated_at = datetime('now') WHERE id = ?`, issueId);
  }

  run(`INSERT INTO activity_log (issue_id, type, actor, message, metadata) VALUES (?, 'auto_fix_triggered', ?, ?, ?)`,
    issueId, actor, `Auto-fix approved ${approvedIds.length || comments.length} review comment(s)`, JSON.stringify({ decisionId: decision.id, approvedIds }));
  syncLinearState(issueId, "FIXING").catch(() => {});
  return true;
}

app.patch("/api/issues/:id", async (req, res) => {
  const { action, instructions, feedback } = req.body;
  const id = parseInt(req.params.id, 10);
  const issue = qOne("SELECT * FROM issues WHERE id = ?", id);
  if (!issue) return res.status(404).json({ error: "Not found" });

  switch (action) {
    case "pause":
      run(`UPDATE issues SET previous_state = state, state = 'PAUSED', locked_at = NULL, agent_pid = NULL, updated_at = datetime('now') WHERE id = ? AND state NOT IN ('DONE','PAUSED')`, id);
      run(`INSERT INTO activity_log (issue_id, type, actor, message) VALUES (?, 'paused', 'user', 'Issue paused')`, id);
      break;
    case "unpause":
      run(`UPDATE issues SET state = COALESCE(previous_state, 'PENDING'), updated_at = datetime('now') WHERE id = ? AND state = 'PAUSED'`, id);
      run(`INSERT INTO activity_log (issue_id, type, actor, message) VALUES (?, 'resumed', 'user', 'Issue resumed')`, id);
      break;
    case "ignore":
      run(`UPDATE issues SET previous_state = state, state = 'IGNORED', locked_at = NULL, agent_pid = NULL, updated_at = datetime('now') WHERE id = ? AND state NOT IN ('DONE','IGNORED')`, id);
      run(`INSERT INTO activity_log (issue_id, type, actor, message) VALUES (?, 'ignored', 'user', 'Issue ignored — removed from Forge queue without affecting Linear')`, id);
      break;
    case "unignore":
      run(`UPDATE issues SET state = COALESCE(previous_state, 'PENDING'), updated_at = datetime('now') WHERE id = ? AND state = 'IGNORED'`, id);
      run(`INSERT INTO activity_log (issue_id, type, actor, message) VALUES (?, 'unignored', 'user', 'Issue unignored — resumed from previous state')`, id);
      break;
    case "steer":
      if (!instructions) return res.status(400).json({ error: "instructions required" });
      // Steering is a flag — no state change, just queue instructions for the next agent
      run(`UPDATE issues SET steering_context = ?, updated_at = datetime('now') WHERE id = ? AND state NOT IN ('DONE','IGNORED','FAILED')`, instructions, id);
      run(`INSERT INTO activity_log (issue_id, type, actor, message, metadata) VALUES (?, 'steered', 'user', ?, ?)`,
        id, `Steering queued: ${instructions.slice(0,120)}`, JSON.stringify({ instructions }));
      break;
    case "clear-steer":
      run(`UPDATE issues SET steering_context = NULL, updated_at = datetime('now') WHERE id = ?`, id);
      break;
    case "set-auto-fix": {
      const enabled = req.body.enabled ? 1 : 0;
      run(`UPDATE issues SET auto_fix_enabled = ?, updated_at = datetime('now') WHERE id = ?`, enabled, id);
      run(`INSERT INTO activity_log (issue_id, type, actor, message, metadata) VALUES (?, 'auto_fix_toggled', 'user', ?, ?)`,
        id, enabled ? "Auto-fix enabled" : "Auto-fix disabled", JSON.stringify({ enabled: Boolean(enabled) }));
      if (enabled) autoApprovePendingFixDecision(id, "user");
      break;
    }
    case "rebase": {
      const rebaseAllowedStates = ["AWAITING_CODE_REVIEW", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL"];
      if (!rebaseAllowedStates.includes(issue.state)) {
        return res.status(409).json({ error: `Issue must have written code and no active agent work before rebasing (currently ${issue.state})` });
      }
      if (issue.locked_at || issue.agent_pid) {
        return res.status(409).json({ error: "Cannot rebase while an agent is currently running for this issue" });
      }
      const wtPath = resolveWorktreePath(issue.wt_path, issue);
      if (!wtPath || !fs.existsSync(wtPath)) return res.status(409).json({ error: `Worktree not found: ${issue.wt_path || "(none)"}` });
      const status = gitInWorktree(wtPath, ["status", "--porcelain"], { timeout: 10000 });
      if (status.trim()) return res.status(409).json({ error: "Worktree has uncommitted changes; commit or discard them before rebasing." });

      const allPrStack = q("SELECT * FROM pr_stack WHERE issue_id = ? ORDER BY position ASC", id);
      const openStack = allPrStack.filter(pr => pr.gt_branch && pr.status !== "merged" && pr.status !== "closed");
      const baseBranch = getIssueBaseBranch(issue);
      const branchPlan = openStack.length
        ? openStack.map(pr => {
            const parent = pr.base_pr_id ? allPrStack.find(candidate => candidate.id === pr.base_pr_id) : null;
            return { branch: pr.gt_branch, base: parent?.gt_branch || `origin/${baseBranch}` };
          })
        : branchCandidatesForIssue(issue, []).slice(0, 1).map(branch => ({ branch, base: `origin/${baseBranch}` }));
      if (!branchPlan.length) return res.status(409).json({ error: "No branch found to rebase for this issue." });

      const context = [
        "User requested a careful rebase.",
        "Rebase the issue's open branch(es) onto their base branch, resolve any conflicts carefully, validate, then push with --force-with-lease.",
        "Do not guess. If intent is unclear, preserve existing behavior or stop with a clear note rather than inventing behavior.",
        "",
        `Worktree: ${wtPath}`,
        `Base branch: ${baseBranch}`,
        "Branch rebase plan:",
        ...branchPlan.map(item => `- ${item.branch} onto ${item.base}`),
      ].join("\n");
      run(`UPDATE issues SET previous_state = state, state = 'REBASING', steering_context = ?, locked_at = NULL, agent_pid = NULL, updated_at = datetime('now') WHERE id = ?`, context, id);
      run(`INSERT INTO activity_log (issue_id, type, actor, message, metadata) VALUES (?, 'rebase_requested', 'user', ?, ?)`,
        id, `Rebaser agent queued for ${branchPlan.length} branch(es)`, JSON.stringify({ branchPlan }));
      syncLinearState(id, "REBASING").catch(() => {});
      broadcast("tick", { ts: Date.now() });
      return res.json({ ok: true, state: "REBASING" });
    }
    case "split-pr-stack": {
      const splitAllowedStates = ["AI_REVIEWING", "AWAITING_CODE_REVIEW", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "PUSHING", "REBASING"];
      if (!splitAllowedStates.includes(issue.state)) {
        return res.status(409).json({ error: `Issue must have written code before splitting (currently ${issue.state})` });
      }
      if (issue.locked_at || issue.agent_pid) {
        return res.status(409).json({ error: "Cannot split while an agent is currently running for this issue" });
      }
      const prStack = q("SELECT * FROM pr_stack WHERE issue_id = ? ORDER BY position ASC", id);
      const merged = prStack.filter(pr => pr.status === "merged");
      if (merged.length) {
        return res.status(409).json({ error: "Cannot split a stack with merged PRs" });
      }
      const splitInstructions = String(instructions ?? "").trim();
      run(`UPDATE issues SET previous_state = state, state = 'SPLIT_PLANNING', steering_context = ?, updated_at = datetime('now') WHERE id = ?`,
        splitInstructions || null, id);
      run(`INSERT INTO activity_log (issue_id, type, actor, message, metadata) VALUES (?, 'split_requested', 'user', ?, ?)`,
        id,
        splitInstructions ? `PR stack split requested: ${splitInstructions.slice(0,120)}` : "PR stack split requested — planner will inspect plan.md",
        JSON.stringify({ instructions: splitInstructions || null }));
      break;
    }
    case "advance": {
      const { nextState } = req.body;
      const allowed = ["WORKING", "CREATING_PR", "FIXING", "PLANNING", "AI_REVIEWING", "WATCHING_PR", "IN_MERGE_QUEUE", "SPLIT_PLANNING", "SPLITTING", "REBASING", "DONE"];
      if (!allowed.includes(nextState)) return res.status(400).json({ error: `Invalid nextState: ${nextState}` });
      run(`UPDATE issues SET previous_state = state, state = ?, locked_at = NULL, updated_at = datetime('now') WHERE id = ?`, nextState, id);
      run(`INSERT INTO activity_log (issue_id, type, actor, message) VALUES (?, 'advanced', 'user', ?)`,
        id, `Manually advanced to ${nextState} (was stuck in ${qOne("SELECT previous_state FROM issues WHERE id = ?", id)?.previous_state})`);
      // Clear pending decisions when moving to DONE
      if (nextState === "DONE") {
        run(`UPDATE decision_queue SET verdict = 'rejected', feedback_json = '"Cleared — issue moved to DONE"', resolved_at = datetime('now') WHERE issue_id = ? AND verdict IS NULL`, id);
      }
      syncLinearState(id, nextState).catch(() => {});
      break;
    }
    case "retry": {
      const failedIssue = qOne("SELECT state, previous_state FROM issues WHERE id = ?", id);
      if (!failedIssue || failedIssue.state !== "FAILED") break;

      // Determine safe retry state — never retry into FAILED or null
      const TERMINAL = new Set(["FAILED", "DONE", "PAUSED", null, undefined]);
      let retryState = TERMINAL.has(failedIssue.previous_state)
        ? "WORKING"
        : failedIssue.previous_state;

      // Map states that should never be retried into directly.
      // For AWAITING_PLAN_APPROVAL we inspect the last decision verdict rather
      // than assuming approval — a rejected or missing verdict means re-plan.
      const AWAITING_TO_NEXT = {
        AI_REVIEWING:           "WORKING",
        AI_PLAN_REVIEWING:      "PLANNING",
        AWAITING_CODE_REVIEW:   "CREATING_PR",
        AWAITING_FIX_APPROVAL:  "FIXING",
        AWAITING_SPLIT_APPROVAL:"SPLITTING",
      };

      if (retryState === "AWAITING_PLAN_APPROVAL") {
        const lastPlanDecision = qOne(
          `SELECT verdict FROM decision_queue
           WHERE issue_id = ? AND type = 'PLAN_REVIEW'
           ORDER BY created_at DESC LIMIT 1`, id
        );
        retryState = lastPlanDecision?.verdict === "approved" ? "WORKING" : "PLANNING";
      }

      const awaitingDecisionTypes = {
        AWAITING_CODE_REVIEW: "CODE_REVIEW",
        AWAITING_FIX_APPROVAL: "FIX_APPROVAL",
        AWAITING_SPLIT_APPROVAL: "SPLIT_APPROVAL",
      };
      const keepPendingDecisionType = awaitingDecisionTypes[retryState] ?? null;

      if (AWAITING_TO_NEXT[retryState]) {
        const matchingPendingDecision = keepPendingDecisionType
          ? qOne(
            "SELECT id FROM decision_queue WHERE issue_id = ? AND type = ? AND verdict IS NULL LIMIT 1",
            id,
            keepPendingDecisionType,
          )
          : null;
        if (!matchingPendingDecision) retryState = AWAITING_TO_NEXT[retryState];
      }

      run(`UPDATE issues SET
        state = ?,
        locked_at = NULL,
        agent_pid = NULL,
        ai_review_rounds = 0,
        retry_count = 0,
        updated_at = datetime('now')
        WHERE id = ? AND state = 'FAILED'`, retryState, id);

      // Cancel lingering pending decisions, but keep the decision that belongs
      // to the restored AWAITING_* state. Otherwise the issue can be left in
      // AWAITING_CODE_REVIEW/AWAITING_FIX_APPROVAL with no approve/reject UI.
      const retryDecisionType = awaitingDecisionTypes[retryState] ?? null;
      if (retryDecisionType) {
        run(`UPDATE decision_queue SET verdict = 'rejected', feedback_json = '"Cancelled on retry"', resolved_at = datetime('now')
          WHERE issue_id = ? AND verdict IS NULL AND type != ?`, id, retryDecisionType);
      } else {
        run(`UPDATE decision_queue SET verdict = 'rejected', feedback_json = '"Cancelled on retry"', resolved_at = datetime('now')
          WHERE issue_id = ? AND verdict IS NULL`, id);
      }

      run(`INSERT INTO activity_log (issue_id, type, actor, message, metadata)
        VALUES (?, 'retried', 'user', ?, ?)`,
        id,
        `Retried — reset to ${retryState} (rounds reset to 0)`,
        JSON.stringify({ retryState })
      );
      break;
    }
    case "reset": {
      // Kill any running agent
      if (issue.agent_pid) {
        try { process.kill(issue.agent_pid, "SIGTERM"); } catch {}
      }

      const errors = [];
      const prStack = q("SELECT * FROM pr_stack WHERE issue_id = ? ORDER BY position ASC", id);
      const branchesToDelete = branchCandidatesForIssue(issue, prStack);
      const cwd = getRepoCommandCwd();

      // Remove the git worktree first. Reset must also handle missing worktrees
      // and stacked PR branches, so we explicitly delete known local branches below.
      try {
        await removeIssueWorktree(issue.wt_path, errors);
      } catch (e) {
        errors.push(`Worktree removal: ${e.message}`);
      }
      await deleteLocalBranches(branchesToDelete, cwd, errors);

      // Remove all per-run/project artifacts so the issue behaves like a fresh
      // enqueue. Keep the issue row itself (and activity log) so its id/history
      // remain stable.
      const projectDir = path.join(FORGE_DIR, "projects", String(id));
      if (fs.existsSync(projectDir)) {
        try { fs.rmSync(projectDir, { recursive: true, force: true }); }
        catch (e) { errors.push(`Project files: ${e.message}`); }
      }

      run("DELETE FROM pr_stack WHERE issue_id = ?", id);
      run("DELETE FROM decision_queue WHERE issue_id = ?", id);
      run("DELETE FROM agent_runs WHERE issue_id = ?", id);
      run("DELETE FROM assets WHERE issue_id = ?", id);
      run("DELETE FROM review_tours WHERE issue_id = ?", id);

      // Reset issue to PENDING so the scheduler restarts setup/planning from scratch,
      // matching the legacy dashboard behavior.
      run(`UPDATE issues SET
             state = 'PENDING',
             wt_path = NULL,
             project_file_path = NULL,
             locked_at = NULL,
             agent_pid = NULL,
             previous_state = NULL,
             steering_context = NULL,
             pi_sessions_json = NULL,
             ai_review_rounds = 0,
             total_ai_review_rounds = 0,
             retry_count = 0,
             pr_approved_at = NULL,
             focus_rank = NULL,
             linear_state = NULL,
             updated_at = datetime('now')
           WHERE id = ?`, id);

      run(`INSERT INTO activity_log (issue_id, type, actor, message, metadata)
           VALUES (?, 'reset', 'user', 'Full reset — worktree, branches, project files, PR stack, decisions, runs, assets, and review tour cleared; restarted at PENDING', ?)`,
        id,
        JSON.stringify({ branchesDeleted: branchesToDelete, errors })
      );

      broadcast("issue_added", { issueId: id });
      return res.json({ ok: true, errors: errors.length ? errors : undefined });
    }
    default:
      return res.status(400).json({ error: `Unknown action: ${action}` });
  }

  res.json({ ok: true });
});

// ── Decisions ─────────────────────────────────────────────────────────

app.get("/api/decisions", (_req, res) => {
  const decisions = q("SELECT * FROM decision_queue WHERE verdict IS NULL ORDER BY created_at ASC");
  const enriched = decisions.map(d => ({
    ...d,
    issueTitle: qOne("SELECT title FROM issues WHERE id = ?", d.issue_id)?.title ?? "Unknown",
  }));
  res.json(enriched);
});

app.post("/api/decisions/:id/resolve", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { verdict, feedback } = req.body;

  if (!["approved", "rejected"].includes(verdict)) {
    return res.status(400).json({ error: "verdict must be 'approved' or 'rejected'" });
  }

  const decision = qOne("SELECT * FROM decision_queue WHERE id = ?", id);
  if (!decision) return res.status(404).json({ error: "Not found" });
  if (decision.verdict) return res.status(409).json({ error: "Already resolved" });

  const feedbackJson = feedback ? JSON.stringify(feedback) : null;
  run(`UPDATE decision_queue SET verdict = ?, feedback_json = ?, resolved_at = datetime('now') WHERE id = ?`,
    verdict, feedbackJson, id);

  // Advance or revert issue state
  const stateMap = {
    approved: { PLAN_REVIEW: "WORKING", CODE_REVIEW: "CREATING_PR", FIX_APPROVAL: "FIXING", SPLIT_APPROVAL: "SPLITTING" },
    rejected: { PLAN_REVIEW: "PLANNING", CODE_REVIEW: "WORKING", FIX_APPROVAL: "WATCHING_PR", SPLIT_APPROVAL: "WATCHING_PR" },
    // FIX_APPROVAL approval from IN_MERGE_QUEUE reverts to WATCHING_PR too
    // (handled below by overriding nextState if current state is IN_MERGE_QUEUE)
  };
  const nextState = stateMap[verdict]?.[decision.type];
  if (nextState) {
    run(`UPDATE issues SET previous_state = state, state = ?, updated_at = datetime('now') WHERE id = ?`,
      nextState, decision.issue_id);
  }

  // For PLAN_REVIEW approvals: store optional steering comment so the coder agent sees it.
  if (decision.type === "PLAN_REVIEW" && verdict === "approved" && feedback?.steeringComment) {
    run(`UPDATE issues SET steering_context = ?, updated_at = datetime('now') WHERE id = ?`,
      feedback.steeringComment, decision.issue_id);
  }

  // For FIX_APPROVAL approvals: write approved comment details into steering_context
  // so the fixer agent knows exactly which comments to address.
  if (decision.type === "FIX_APPROVAL" && verdict === "approved" && feedback?.approvedIds?.length) {
    try {
      const artRef = JSON.parse(decision.artifact_ref);
      const allComments = artRef.comments ?? [];
      const approvedComments = allComments.filter(c => feedback.approvedIds.includes(String(c.id)));
      if (approvedComments.length > 0) {
        const lines = [
          "## PR Review Comments to Fix",
          `The user selected ${approvedComments.length} comment(s) to address. Only fix these — ignore all others.`,
          "",
        ];
        for (const c of approvedComments) {
          const loc = c.path ? `${c.path}${c.line ? `:${c.line}` : ""}` : "(general)";
          lines.push(`### Comment by ${c.author} on ${loc}`);
          lines.push(c.body);
          lines.push("");
        }
        run(`UPDATE issues SET steering_context = ?, updated_at = datetime('now') WHERE id = ?`,
          lines.join("\n"), decision.issue_id);
      }
    } catch { /* non-JSON artifact_ref — fixer will handle on its own */ }
  }

  // On rejection, append reason to the plan file log so the agent sees it
  if (verdict === "rejected" && feedback) {
    const issue = qOne("SELECT * FROM issues WHERE id = ?", decision.issue_id);
    const planPath = issue?.project_file_path;
    if (planPath && fs.existsSync(planPath)) {
      const typeLabel = { PLAN_REVIEW: "Plan", CODE_REVIEW: "Code review", FIX_APPROVAL: "Fix" }[decision.type] ?? decision.type;
      const now = new Date().toISOString();
      const entry = `\n## ${typeLabel} rejected\n*${now}*\n${typeof feedback === "string" ? feedback : JSON.stringify(feedback, null, 2)}\n`;
      try {
        fs.appendFileSync(planPath, entry, "utf-8");
      } catch (e) {
        console.warn("Could not append rejection to plan file:", e.message);
      }
    }
  }

  // Log user action
  const typeLabel = { PLAN_REVIEW: "Plan", CODE_REVIEW: "Code review", FIX_APPROVAL: "Fix approval" }[decision.type] ?? decision.type;
  const logMsg = verdict === "approved"
    ? `${typeLabel} approved`
    : `${typeLabel} rejected${feedback ? ` — ${typeof feedback === "string" ? feedback : JSON.stringify(feedback)}` : ""}`;
  run(`INSERT INTO activity_log (issue_id, type, actor, message, metadata) VALUES (?, ?, 'user', ?, ?)`,
    decision.issue_id,
    verdict === "approved" ? "decision_approved" : "decision_rejected",
    logMsg,
    feedback ? JSON.stringify({ feedback }) : null
  );

  // Sync Linear state on transitions that matter
  if (nextState) syncLinearState(decision.issue_id, nextState).catch(() => {});

  broadcast("decision_resolved", { decisionId: id, verdict, issueId: decision.issue_id, nextState });
  res.json({ ok: true, nextState });
});

// ── Archive ────────────────────────────────────────────────────────────

app.get("/api/archive", (_req, res) => {
  const done = q(`
    SELECT i.*,
      (SELECT COUNT(*) FROM agent_runs WHERE issue_id = i.id) as run_count,
      (SELECT COUNT(*) FROM pr_stack WHERE issue_id = i.id) as pr_count
    FROM issues i
    WHERE i.state = 'DONE'
    ORDER BY i.updated_at DESC
  `);

  const repo = qOne("SELECT value FROM settings WHERE key = 'github_repo'")?.value;
  const enriched = done.map(issue => {
    const summaryPath = path.join(FORGE_DIR, "projects", String(issue.id), "summary.md");
    const hasSummary  = fs.existsSync(summaryPath);
    const summaryContent = hasSummary ? fs.readFileSync(summaryPath, "utf-8") : null;
    const prStack     = q("SELECT * FROM pr_stack WHERE issue_id = ? ORDER BY position ASC", issue.id)
      .map(pr => ({ ...pr, url: repo && pr.pr_number ? `https://github.com/${repo}/pull/${pr.pr_number}` : null }));
    return { ...issue, hasSummary, summaryContent, prStack };
  });

  res.json(enriched);
});

// ── Runtime launcher ─────────────────────────────────────────────────────

app.get("/api/vm/status", (_req, res) => {
  res.json(getVmRuntimeStatus());
});

app.post("/api/vm/stop", (_req, res) => {
  try {
    const output = stopVmRuntime();
    broadcast("vm_runtime_updated", {});
    res.json({ ok: true, output, vmRuntime: getVmRuntimeStatus() });
  } catch (e) {
    res.status(500).json({ error: e.message, output: `${e.stdout?.toString?.() ?? ""}${e.stderr?.toString?.() ?? ""}` });
  }
});

// ── PR stack sync ────────────────────────────────────────────────────────

app.post("/api/issues/:id/vm-launch", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const issue = qOne("SELECT * FROM issues WHERE id = ?", id);
  if (!issue) return res.status(404).json({ error: "Not found" });
  if (!issue.wt_path) return res.status(400).json({ error: "Issue has no worktree" });

  const config = getWorkspaceRunConfig();
  const targetWorktreePath = getWorkspaceTargetPath(issue.wt_path);
  if (!targetWorktreePath) return res.status(400).json({ error: `No workspace path mapping for worktree ${issue.wt_path}` });

  const launchRef = getIssueLaunchRef(issue);
  const changedFiles = getIssueChangedFiles(issue, launchRef);
  const classification = classifyChangedFiles(changedFiles);
  const metadata = {
    issueId: issue.id,
    linearId: issue.linear_id,
    title: issue.title,
    branch: launchRef.branch,
    worktreePath: targetWorktreePath,
    remoteWorktreePath: targetWorktreePath,
    mode: config.mode || "local",
    target: config.mode === "ssh" ? getWorkspaceRunSshConfig()?.target : "local",
    classification,
    ports: { frontend: 3000, backend: 8080 },
    frontendUrl: "http://localhost:3000",
    backendUrl: "http://localhost:8080",
    launchedAt: new Date().toISOString(),
  };
  const script = buildVmLaunchScript({ remoteWorktreePath: targetWorktreePath, changedFiles, classification, metadata });

  try {
    const output = runWorkspaceScript(script, 120000, 1024 * 1024 * 4);
    run(`INSERT INTO activity_log (issue_id, type, actor, message, metadata) VALUES (?, 'runtime_launch', 'user', ?, ?)`,
      id,
      `Launched runtime in issue worktree (${classification.database ? "database" : classification.backend ? "backend" : classification.frontend ? "frontend" : "worktree-only"})`,
      JSON.stringify({ launchRef, changedFiles, classification, worktreePath: targetWorktreePath, mode: config.mode || "local" })
    );
    if (classification.frontend) openFrontendInBrowser();
    broadcast("issue_updated", { issueId: id });
    broadcast("vm_runtime_updated", { issueId: id });
    res.json({ ok: true, output, launchRef, changedFiles, classification, worktreePath: targetWorktreePath, remoteWorktreePath: targetWorktreePath, vmRuntime: getVmRuntimeStatus() });
  } catch (e) {
    res.status(500).json({ error: e.message, output: `${e.stdout?.toString?.() ?? ""}${e.stderr?.toString?.() ?? ""}`, launchRef, changedFiles, classification });
  }
});

app.post("/api/issues/:id/sync-prs", async (req, res) => {
  const issue = qOne("SELECT * FROM issues WHERE id = ?", req.params.id);
  if (!issue?.wt_path || !fs.existsSync(issue.wt_path)) {
    return res.status(400).json({ error: "No worktree found for this issue" });
  }

  try {
    const currentBranch = gitInWorktree(issue.wt_path, ["rev-parse", "--abbrev-ref", "HEAD"]).trim();
    const repo = qOne("SELECT value FROM settings WHERE key = 'github_repo'")?.value ?? "";
    if (!repo.trim()) return res.status(400).json({ error: "Set github_repo before syncing PRs" });
    // Query GitHub directly by head branch. Do not use Graphite/gt here:
    // manually-created or untracked branches should still be syncable.
    const ghJson = await execAsync("gh", ["pr", "list", "--repo", repo, "--head", currentBranch, "--state", "all", "--json", "number,headRefName,state"], { cwd: FORGE_DIR });
    const prs = JSON.parse(ghJson || "[]");
    const relevant = prs.map(pr => ({
      branch: pr.headRefName || currentBranch,
      prNumber: pr.number ?? null,
      status: String(pr.state || "open").toLowerCase(),
    }));

    const synced = [];
    for (let i = 0; i < relevant.length; i++) {
      const { branch, prNumber, status } = relevant[i];
      const position = i + 1;
      const existing = qOne("SELECT id FROM pr_stack WHERE issue_id = ? AND gt_branch = ?", issue.id, branch);
      if (existing) {
        run("UPDATE pr_stack SET pr_number = ?, status = ?, position = ? WHERE id = ?", prNumber, status, position, existing.id);
      } else {
        const prevPr = qOne("SELECT id FROM pr_stack WHERE issue_id = ? AND position = ?", issue.id, position - 1);
        run("INSERT INTO pr_stack (issue_id, gt_branch, position, pr_number, status, base_pr_id) VALUES (?, ?, ?, ?, ?, ?)",
          issue.id, branch, position, prNumber ?? null, status, prevPr?.id ?? null);
      }
      synced.push({ branch, prNumber, status });
    }

    res.json({ ok: true, synced });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Manual PR feedback (from issue page, creates FIX_APPROVAL decision) ──

app.post("/api/issues/:id/reflect", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const trigger = String(req.body?.trigger || "manual").replace(/[^a-z0-9_-]/gi, "").slice(0, 40) || "manual";
  const issue = qOne("SELECT * FROM issues WHERE id = ?", id);
  if (!issue) return res.status(404).json({ error: "Not found" });
  try {
    const reflectScript = path.join(FORGE_DIR, "reflect.js");
    const output = execFileSync(process.execPath, [reflectScript, "--issue-id", String(id), "--trigger", trigger, "--force"], {
      encoding: "utf-8",
      timeout: 120000,
      maxBuffer: 1024 * 1024 * 8,
    });
    broadcast({ type: "learning_reflection", issueId: id });
    res.json({ ok: true, output });
  } catch (e) {
    res.status(500).json({ error: e.message, output: e.stdout?.toString?.() || "" });
  }
});

function logLearningChange({ issueId = null, suggestionId = null, target, changeType, changeSummary, reason = null, actor = "system", metadata = null }) {
  run(`
    INSERT INTO learning_change_log (issue_id, suggestion_id, target, change_type, change_summary, reason, actor, metadata_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, issueId, suggestionId, target, changeType, changeSummary, reason, actor, metadata ? JSON.stringify(metadata) : null);
}

function promptPathForLearningTarget(target) {
  const match = String(target ?? "").match(/^agents\/([a-z-]+)\.md$/);
  if (!match) return null;
  const allowed = ["planner", "plan-reviewer", "coder", "reviewer", "git-agent", "fixer", "split-planner", "splitter", "rebaser", "reflector"];
  if (!allowed.includes(match[1])) return null;
  return path.join(FORGE_DIR, "agents", `${match[1]}.md`);
}

app.get("/api/learnings", (_req, res) => {
  const suggestions = q(`
    SELECT ls.*, i.title AS issue_title, i.linear_id
    FROM learning_suggestions ls
    LEFT JOIN issues i ON i.id = ls.issue_id
    WHERE ls.status = 'pending'
    ORDER BY ls.created_at DESC
    LIMIT 200
  `);
  const events = q(`
    SELECT le.*, i.title AS issue_title, i.linear_id
    FROM learning_events le
    LEFT JOIN issues i ON i.id = le.issue_id
    ORDER BY le.created_at DESC
    LIMIT 100
  `);
  const changes = q(`
    SELECT lcl.*, i.title AS issue_title, i.linear_id
    FROM learning_change_log lcl
    LEFT JOIN issues i ON i.id = lcl.issue_id
    ORDER BY lcl.created_at DESC
    LIMIT 200
  `);
  res.json({ suggestions, events, changes });
});

app.patch("/api/learnings/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const action = req.body?.action;
  const note = typeof req.body?.note === "string" ? req.body.note.trim() : "";
  const suggestion = qOne("SELECT * FROM learning_suggestions WHERE id = ?", id);
  if (!suggestion) return res.status(404).json({ error: "Not found" });
  if (!["applied", "rejected"].includes(action)) return res.status(400).json({ error: "Invalid action" });

  let changeSummary = `Marked learning suggestion #${id} ${action}`;
  const metadata = { target: suggestion.target, suggestion: suggestion.suggestion };

  if (action === "applied") {
    const promptPath = promptPathForLearningTarget(suggestion.target);
    if (promptPath) {
      const before = fs.existsSync(promptPath) ? fs.readFileSync(promptPath, "utf-8") : "";
      const appendix = [
        "",
        `## Learned change (suggestion #${id}, ${new Date().toISOString().split("T")[0]})`,
        "",
        `- ${suggestion.suggestion}`,
        suggestion.rationale ? `  - Why: ${suggestion.rationale}` : "",
      ].filter(Boolean).join("\n");
      fs.writeFileSync(promptPath, `${before.replace(/\s*$/, "")}\n${appendix}\n`, "utf-8");
      changeSummary = `Appended learning suggestion #${id} to ${suggestion.target}`;
      metadata.beforeLength = before.length;
      metadata.afterLength = fs.readFileSync(promptPath, "utf-8").length;
    } else {
      changeSummary = `Marked suggestion #${id} applied; target '${suggestion.target}' requires manual/tooling follow-up`;
    }
  } else {
    changeSummary = `Rejected learning suggestion #${id}`;
  }

  run("UPDATE learning_suggestions SET status = ?, resolved_at = datetime('now') WHERE id = ?", action, id);
  logLearningChange({
    issueId: suggestion.issue_id,
    suggestionId: id,
    target: suggestion.target,
    changeType: action === "applied" ? "learning_applied" : "learning_rejected",
    changeSummary,
    reason: note || suggestion.rationale || "Resolved from learning suggestion",
    actor: "user",
    metadata,
  });
  if (suggestion.issue_id) {
    run(`INSERT INTO activity_log (issue_id, type, actor, message, metadata) VALUES (?, 'learning_suggestion_resolved', 'user', ?, ?)`,
      suggestion.issue_id,
      changeSummary,
      JSON.stringify(metadata)
    );
  }
  broadcast({ type: "learning_suggestion_resolved", id, status: action });
  res.json({ ok: true });
});

app.post("/api/issues/:id/feedback", (req, res) => {
  const issue = qOne("SELECT * FROM issues WHERE id = ?", req.params.id);
  if (!issue) return res.status(404).json({ error: "Not found" });
  if (!["WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL"].includes(issue.state)) return res.status(409).json({ error: `Issue must be in WATCHING_PR, IN_MERGE_QUEUE, or AWAITING_FIX_APPROVAL state (currently ${issue.state})` });

  const { body, prNumber } = req.body;
  if (!body?.trim()) return res.status(400).json({ error: "body is required" });

  // Check for existing unresolved FIX_APPROVAL — if one exists, append to it
  const existing = qOne(`SELECT * FROM decision_queue WHERE issue_id = ? AND type = 'FIX_APPROVAL' AND verdict IS NULL`, issue.id);

  const now = new Date().toISOString();
  const newComment = {
    id:          `manual-${Date.now()}`,
    author:      "you",
    path:        "",
    line:        null,
    body:        body.trim(),
    reviewState: "CHANGES_REQUESTED",
    prNumber:    prNumber ?? null,
    createdAt:   now,
  };

  if (existing) {
    // Append to the existing decision's artifact_ref
    let artRef = { comments: [] };
    try { artRef = JSON.parse(existing.artifact_ref); } catch {}
    artRef.comments = [...(artRef.comments ?? []), newComment];
    run(`UPDATE decision_queue SET artifact_ref = ? WHERE id = ?`, JSON.stringify(artRef), existing.id);
  } else {
    const artifactRef = JSON.stringify({ comments: [newComment] });
    run(`INSERT INTO decision_queue (issue_id, type, artifact_ref) VALUES (?, 'FIX_APPROVAL', ?)`, issue.id, artifactRef);
    run(`UPDATE issues SET previous_state = state, state = 'AWAITING_FIX_APPROVAL', updated_at = datetime('now') WHERE id = ?`, issue.id);
    syncLinearState(issue.id, "AWAITING_FIX_APPROVAL").catch(() => {});
  }

  const prLabel = prNumber ? ` on PR #${prNumber}` : "";
  run(`INSERT INTO activity_log (issue_id, type, actor, message) VALUES (?, 'decision_added', 'user', ?)`,
    issue.id, `Manual feedback added${prLabel}`);

  broadcast("issue_updated", { issueId: issue.id });
  res.json({ ok: true });
});

app.post("/api/issues/:id/prs", (req, res) => {
  const { branch, position, prNumber } = req.body;
  if (!branch || !position) return res.status(400).json({ error: "branch and position required" });
  const issue = qOne("SELECT id FROM issues WHERE id = ?", req.params.id);
  if (!issue) return res.status(404).json({ error: "Not found" });
  const prevPr = qOne("SELECT id FROM pr_stack WHERE issue_id = ? AND position = ?", issue.id, position - 1);
  run("INSERT INTO pr_stack (issue_id, gt_branch, position, pr_number, status, base_pr_id) VALUES (?, ?, ?, ?, 'open', ?)",
    issue.id, branch, position, prNumber ?? null, prevPr?.id ?? null);
  res.json({ ok: true });
});

// ── Remove issue ───────────────────────────────────────────────────
// Removes Forge data + git worktree. Does NOT touch the Linear issue.

app.delete("/api/issues/:id", async (req, res) => {
  const issue = qOne("SELECT * FROM issues WHERE id = ?", req.params.id);
  if (!issue) return res.status(404).json({ error: "Not found" });

  const errors = [];

  // Kill running agent if any
  if (issue.agent_pid) {
    try { process.kill(issue.agent_pid, "SIGTERM"); } catch {}
  }

  // Remove worktree + branch
  try {
    await removeIssueWorktree(issue.wt_path, errors);
  } catch (e) {
    errors.push(`Worktree removal: ${e.message}`);
  }

  // Remove project files
  const projectDir = path.join(FORGE_DIR, "projects", String(issue.id));
  if (fs.existsSync(projectDir)) {
    try { fs.rmSync(projectDir, { recursive: true, force: true }); } catch (e) { errors.push(`Project files: ${e.message}`); }
  }

  // Delete from DB (cascades all related records)
  db.prepare("DELETE FROM issues WHERE id = ?").run(issue.id);

  broadcast("issue_removed", { issueId: issue.id });
  res.json({ ok: true, errors: errors.length ? errors : undefined });
});

// ── Diff viewer ───────────────────────────────────────────────────────

app.get("/api/issues/:id/diff", (req, res) => {
  const issue = qOne("SELECT * FROM issues WHERE id = ?", req.params.id);
  if (!issue?.wt_path) return res.status(404).json({ error: "No worktree" });
  const wtPath = resolveWorktreePath(issue.wt_path, issue);
  if (!wtPath || !fs.existsSync(wtPath)) return res.status(404).json({ error: `Worktree path not found on disk: ${issue.wt_path}` });

  try {
    const baseBranch = getIssueBaseBranch(issue);
    const base = fetchRemoteBaseRef(wtPath, baseBranch);

    const committedDiff = gitInWorktree(wtPath, ["diff", `${base.ref}...HEAD`, "--"], { maxBuffer: 10 * 1024 * 1024 });
    const stagedDiff = gitInWorktree(wtPath, ["diff", "--cached", "--"], { maxBuffer: 10 * 1024 * 1024 });
    const unstagedDiff = gitInWorktree(wtPath, ["diff", "--"], { maxBuffer: 10 * 1024 * 1024 });
    const diff = [committedDiff, stagedDiff, unstagedDiff].filter(part => part.trim()).join("\n");
    res.json({ diff, baseBranch: base.display, baseRef: base.ref, wtPath });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Review tour ──────────────────────────────────────────────────────

const activeTourGenerations = new Map();

app.get("/api/issues/:id/tour", (req, res) => {
  const row = qOne("SELECT tour_json, created_at FROM review_tours WHERE issue_id = ?", req.params.id);
  const generating = activeTourGenerations.has(String(req.params.id));
  if (!row) return res.json({ tour: null, generating });
  res.json({ tour: JSON.parse(row.tour_json), generating: false, created_at: row.created_at });
});

app.post("/api/issues/:id/generate-tour", async (req, res) => {
  const id = req.params.id;
  const issue = qOne("SELECT * FROM issues WHERE id = ?", id);
  if (!issue) return res.status(404).json({ error: "Not found" });

  // If tour already exists, return it
  const existing = qOne("SELECT tour_json FROM review_tours WHERE issue_id = ?", id);
  if (existing) return res.json({ ok: true, cached: true, tour: JSON.parse(existing.tour_json) });

  const active = activeTourGenerations.get(String(id));
  if (active && !active.killed) return res.json({ ok: true, cached: false, generating: true });

  // Spawn generation in background and keep a per-issue log for diagnosis.
  const { spawn } = require("child_process");
  const logDir = path.join(FORGE_DIR, "projects", String(id));
  fs.mkdirSync(logDir, { recursive: true });
  const logStream = fs.createWriteStream(path.join(logDir, "tour.log"), { flags: "a" });
  logStream.write(`\n[${new Date().toISOString()}] starting tour generation\n`);

  const proc = spawn(process.execPath, [path.join(FORGE_DIR, "generate-tour.js"), "--issue-id", id], {
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, FORGE_DIR, FORGE_DB_PATH: DB_FILE },
  });
  activeTourGenerations.set(String(id), proc);
  proc.stdout.pipe(logStream, { end: false });
  proc.stderr.pipe(logStream, { end: false });
  proc.on("close", (code) => {
    activeTourGenerations.delete(String(id));
    logStream.write(`[${new Date().toISOString()}] finished with code ${code}\n`);
    logStream.end();
  });
  proc.unref();

  res.json({ ok: true, cached: false, generating: true });
});

app.delete("/api/issues/:id/tour", (req, res) => {
  db.prepare("DELETE FROM review_tours WHERE issue_id = ?").run(req.params.id);
  res.json({ ok: true });
});

function truncateForPrompt(value, max = 8000) {
  const text = String(value ?? "").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n\n[truncated ${text.length - max} chars]`;
}

function issueDocExcerpt(issue) {
  const projectDir = path.join(FORGE_DIR, "projects", String(issue.id));
  const handoffPath = path.join(projectDir, "handoff.md");
  const summaryPath = path.join(projectDir, "summary.md");
  const docs = [];
  if (fs.existsSync(handoffPath)) docs.push({ label: "Handoff", content: fs.readFileSync(handoffPath, "utf-8") });
  if (fs.existsSync(summaryPath)) docs.push({ label: "Summary", content: fs.readFileSync(summaryPath, "utf-8") });
  if (issue.project_file_path && fs.existsSync(issue.project_file_path)) docs.push({ label: "Plan", content: fs.readFileSync(issue.project_file_path, "utf-8") });
  return docs.map(doc => `## ${doc.label}\n${truncateForPrompt(doc.content, doc.label === "Plan" ? 6000 : 10000)}`).join("\n\n");
}

function changedFileStats(issue) {
  const wtPath = resolveWorktreePath(issue.wt_path, issue);
  if (!wtPath) return { wtPath: null, files: [], stats: "" };
  const files = getIssueChangedFiles(issue);
  let stats = "";
  try {
    const baseRef = fetchRemoteBaseRef(wtPath, getIssueBaseBranch(issue)).ref;
    stats = gitInWorktree(wtPath, ["diff", "--numstat", `${baseRef}...HEAD`, "--"], { timeout: 10000 });
  } catch {}
  return { wtPath, files, stats };
}

function buildIssueAskPrompt(issue, question) {
  const prStack = q("SELECT * FROM pr_stack WHERE issue_id = ? ORDER BY position ASC", issue.id);
  const activity = q("SELECT type, actor, message, created_at FROM activity_log WHERE issue_id = ? ORDER BY created_at DESC LIMIT 30", issue.id);
  const runs = q("SELECT agent_type, started_at, exited_at, exit_code FROM agent_runs WHERE issue_id = ? ORDER BY started_at DESC LIMIT 12", issue.id);
  const changed = changedFileStats(issue);
  const branch = changed.wtPath ? (() => { try { return gitInWorktree(changed.wtPath, ["branch", "--show-current"], { timeout: 5000 }).trim(); } catch { return issue.branch ?? ""; } })() : issue.branch ?? "";
  const context = [
    `# Issue`,
    `ID: ${issue.id}`,
    `Linear ID: ${issue.linear_id ?? "n/a"}`,
    `Title: ${issue.title ?? "Untitled"}`,
    `State: ${issue.state ?? "unknown"}`,
    `Branch: ${branch || "unknown"}`,
    `Worktree: ${changed.wtPath ?? issue.wt_path ?? "unknown"}`,
    `Base branch: ${getIssueBaseBranch(issue)}`,
    "",
    `# Changed files (${changed.files.length})`,
    changed.files.length ? changed.files.map(file => `- ${file}`).join("\n") : "No changed files detected.",
    changed.stats.trim() ? `\n# Change stats\n${truncateForPrompt(changed.stats, 4000)}` : "",
    prStack.length ? `\n# PR stack\n${prStack.map((pr, index) => `${index + 1}. ${pr.gt_branch ?? pr.branch ?? "unknown"}${pr.pr_number ? ` (#${pr.pr_number})` : ""} — ${pr.status ?? "unknown"}`).join("\n")}` : "",
    `\n# Plan / handoff context\n${issueDocExcerpt(issue) || "No handoff, summary, or plan file available."}`,
    activity.length ? `\n# Recent activity\n${activity.map(a => `- ${a.created_at ?? ""} ${a.actor ?? "forge"}/${a.type}: ${a.message ?? ""}`).join("\n")}` : "",
    runs.length ? `\n# Recent agent runs\n${runs.map(r => `- ${r.agent_type}: exit=${r.exit_code ?? "running"} started=${r.started_at ?? ""} ended=${r.exited_at ?? ""}`).join("\n")}` : "",
  ].filter(Boolean).join("\n");

  return `${context}\n\n# User question\n${question}\n\nAnswer the user's question. If code inspection is needed, inspect the worktree read-only, starting with the changed files above.`;
}

app.post("/api/issues/:id/ask", (req, res) => {
  const issue = qOne("SELECT * FROM issues WHERE id = ?", req.params.id);
  if (!issue) return res.status(404).json({ error: "Not found" });
  const question = String(req.body?.question ?? "").trim();
  if (!question) return res.status(400).json({ error: "question required" });

  const changed = changedFileStats(issue);
  const cwd = changed.wtPath && fs.existsSync(changed.wtPath) ? changed.wtPath : FORGE_DIR;
  const prompt = buildIssueAskPrompt(issue, question);
  const model = qOne("SELECT value FROM settings WHERE key = 'model'")?.value || undefined;
  const promptDir = path.join(FORGE_DIR, "projects", String(issue.id));
  fs.mkdirSync(promptDir, { recursive: true });
  const promptPath = path.join(promptDir, `ask-${Date.now()}.md`);
  fs.writeFileSync(promptPath, prompt, "utf-8");

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  const emit = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  emit("meta", { issueId: issue.id, cwd, changedFiles: changed.files });
  emit("message", { kind: "tool", text: `Context ready: ${changed.files.length} changed file(s). Starting assistant…` });

  const args = [path.join(FORGE_DIR, "pi-sdk-runner.mjs"), "--cwd", cwd, "--prompt-file", promptPath, "--system-prompt", path.join(FORGE_DIR, "agents", "issue-asker.md")];
  if (model) args.push("--model", model);
  const proc = spawn(process.execPath, args, { cwd, env: { ...process.env, FORGE_DIR, FORGE_DB_PATH: DB_FILE }, stdio: ["ignore", "pipe", "pipe"] });
  let lineBuffer = "";
  let closed = false;
  const sendMessage = (kind, text) => { if (!closed && text) emit("message", { kind, text }); };

  proc.stdout.on("data", (chunk) => {
    lineBuffer += chunk.toString();
    const lines = lineBuffer.split("\n");
    lineBuffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const event = JSON.parse(line);
        if (event.type === "text_delta") sendMessage("text_delta", event.delta ?? "");
        else if (event.type === "thinking_delta") sendMessage("thinking_delta", event.delta ?? "");
        else if (event.type === "tool_start") sendMessage("tool", `→ ${formatTool(event.toolName, event.input)}\n`);
        else if (event.type === "tool_end") sendMessage(event.isError ? "error" : "tool", `✓ ${event.toolName}\n`);
      } catch {
        sendMessage("text", `${line}\n`);
      }
    }
  });
  proc.stderr.on("data", (chunk) => sendMessage("error", chunk.toString()));
  proc.on("close", (code) => {
    if (closed) return;
    emit("done", { exitCode: code });
    res.end();
  });
  res.on("close", () => {
    closed = true;
    if (!proc.killed) proc.kill("SIGTERM");
  });
});

// ── Live listen ────────────────────────────────────────────────────────────

function formatTool(name, input) {
  if (!input) return name;
  switch (name) {
    case "read":    return `read ${input.path ?? ""}`;
    case "write":   return `write ${input.path ?? ""}`;
    case "edit":    return `edit ${input.path ?? ""}`;
    case "bash":    return `bash: ${(input.command ?? "").slice(0, 120)}`;
    case "schedule_prompt": return `schedule_prompt`;
    default: {
      // Show name + first meaningful string arg only
      const firstVal = Object.values(input ?? {}).find(v => typeof v === "string");
      return firstVal ? `${name}: ${firstVal.slice(0, 80)}` : name;
    }
  }
}

app.get("/api/issues/:id/listen", (req, res) => {
  // Prefer the currently-running agent; fall back to the most recent log so the
  // listener remains useful while Forge is between state transitions.
  const run = qOne(`
    SELECT * FROM agent_runs
    WHERE issue_id = ? AND log_path IS NOT NULL AND exited_at IS NULL
    ORDER BY started_at DESC LIMIT 1
  `, req.params.id) ?? qOne(`
    SELECT * FROM agent_runs
    WHERE issue_id = ? AND log_path IS NOT NULL
    ORDER BY started_at DESC LIMIT 1
  `, req.params.id);

  if (!run?.log_path) {
    res.setHeader("Content-Type", "text/event-stream");
    res.write(`event: error\ndata: ${JSON.stringify({ message: "No active agent run" })}\n\n`);
    return res.end();
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Send run metadata
  res.write(`event: meta\ndata: ${JSON.stringify({ agentType: run.agent_type, runId: run.id, logPath: run.log_path })}\n\n`);

  let position = 0;
  let lineBuffer = "";
  let done = false;
  let lastAssistantText = "";

  function emitMessage(kind, text) {
    if (!text) return;
    res.write(`event: message\ndata: ${JSON.stringify({ kind, text })}\n\n`);
  }

  function parseLine(line) {
    if (line.startsWith("[stderr]")) {
      emitMessage("error", line.replace(/^\[stderr\]\s*/, ""));
      return;
    }

    try {
      const event = JSON.parse(line);

      // Normalized pi-sdk-runner.mjs listen events.
      if (event.type === "prompt") emitMessage("prompt", event.text?.trim());
      if (event.type === "text_delta") emitMessage("text_delta", event.delta);
      if (event.type === "thinking_delta") emitMessage("thinking_delta", event.delta);
      if (event.type === "tool_start") emitMessage("tool", formatTool(event.toolName, event.input));
      if (event.type === "tool_end" && event.isError) emitMessage("error", `${event.toolName ?? "tool"} failed`);

      // Raw SDK events (older logs, or direct SDK event passthrough).
      if (event.type === "message_update") {
        const update = event.assistantMessageEvent;
        if (update?.type === "text_delta") emitMessage("text_delta", update.delta);
        if (update?.type === "thinking_delta") emitMessage("thinking_delta", update.delta);
      }
      if (event.type === "tool_execution_start") emitMessage("tool", formatTool(event.toolName, event.input ?? event.arguments ?? event.params));
      if (event.type === "tool_execution_end" && event.isError) emitMessage("error", `${event.toolName ?? "tool"} failed`);

      // Initial user prompt (context bundle sent to the agent) from legacy pi logs.
      if (event.type === "message_start" && event.message?.role === "user") {
        const text = event.message.content?.find(b => b.type === "text")?.text?.trim();
        emitMessage("prompt", text);
      }

      // Early SDK bridge format: assistant messages were emitted as cumulative
      // text snapshots. Convert them back to deltas.
      if (event.type === "assistant") {
        const text = (event.message?.content ?? [])
          .filter(b => b.type === "text" && b.text)
          .map(b => b.text)
          .join("");
        if (text) {
          const delta = text.startsWith(lastAssistantText)
            ? text.slice(lastAssistantText.length)
            : text;
          lastAssistantText = text;
          emitMessage("text_delta", delta);
        }
      }

      // Legacy pi streaming format: turn_end contains the complete assistant message.
      if (event.type === "turn_end" && event.message?.role === "assistant") {
        for (const block of (event.message.content ?? [])) {
          if (block.type === "text" && block.text?.trim()) emitMessage("text", block.text.trim());
          if (block.type === "thinking" && block.thinking?.trim()) emitMessage("thinking", block.thinking.trim());
          if (block.type === "toolCall") emitMessage("tool", formatTool(block.name, block.arguments));
        }
      }
    } catch { /* non-JSON line, skip */ }
  }

  function readChunk() {
    if (!fs.existsSync(run.log_path)) return;
    const stat = fs.statSync(run.log_path);
    if (stat.size <= position) return;

    const fd = fs.openSync(run.log_path, "r");
    const buf = Buffer.alloc(stat.size - position);
    fs.readSync(fd, buf, 0, buf.length, position);
    fs.closeSync(fd);
    position = stat.size;

    lineBuffer += buf.toString("utf-8");
    const lines = lineBuffer.split("\n");
    lineBuffer = lines.pop() ?? "";
    for (const l of lines) { if (l.trim()) parseLine(l.trim()); }
  }

  // Read existing content immediately
  readChunk();

  // Poll for new content every 500ms
  const poll = setInterval(() => {
    if (done) return;
    readChunk();

    // Check if the run has finished
    const latest = qOne("SELECT exited_at FROM agent_runs WHERE id = ?", run.id);
    if (latest?.exited_at) {
      readChunk(); // flush any remaining
      res.write(`event: done\ndata: ${JSON.stringify({ exitCode: latest.exit_code })}\n\n`);
      clearInterval(poll);
      done = true;
      res.end();
    }
  }, 500);

  req.on("close", () => { done = true; clearInterval(poll); });
});

// ── Agent run logs ────────────────────────────────────────────────────

app.get("/api/runs/:id/log", (req, res) => {
  const run = qOne("SELECT * FROM agent_runs WHERE id = ?", req.params.id);
  if (!run?.log_path || !fs.existsSync(run.log_path)) {
    return res.status(404).json({ error: "Log not found" });
  }
  res.type("text/plain").send(fs.readFileSync(run.log_path, "utf-8"));
});

// ── Settings ──────────────────────────────────────────────────────────

app.get("/api/settings", (_req, res) => {
  res.json(Object.fromEntries(q("SELECT key, value FROM settings").map(s => [s.key, s.value])));
});

function settingValueType(key) {
  if (key.includes("limit") || key.includes("seconds") || key.includes("rounds") || key.endsWith("_max") || key === "dashboard_port") return "number";
  if (key.startsWith("enable_") || key.startsWith("use_") || key.endsWith("_enabled") || key.includes("reuse")) return "boolean";
  return "string";
}

app.patch("/api/settings", (req, res) => {
  const updates = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
  const existingKeys = new Set(q("SELECT key FROM settings").map(s => s.key));
  for (const [key, value] of Object.entries(updates)) {
    if (!existingKeys.has(key)) continue;
    const type = settingValueType(key);
    if (type === "number") {
      const numberValue = Number(String(value).trim());
      if (!Number.isFinite(numberValue) || numberValue < 0) return res.status(400).json({ error: `${key} must be a non-negative number` });
    }
    if (type === "boolean" && !["true", "false"].includes(String(value))) {
      return res.status(400).json({ error: `${key} must be true or false` });
    }
  }
  for (const [key, value] of Object.entries(updates)) {
    if (!existingKeys.has(key)) continue;
    run("UPDATE settings SET value = ? WHERE key = ?", String(value), key);
  }
  res.json({ ok: true, settings: Object.fromEntries(q("SELECT key, value FROM settings").map(s => [s.key, s.value])) });
});

// ── Agent prompts (for settings editor) ──────────────────────────────

app.get("/api/agents/:type/prompt", (req, res) => {
  const type = req.params.type;
  const promptPath = path.join(FORGE_DIR, "agents", `${type}.md`);
  if (!fs.existsSync(promptPath)) return res.status(404).json({ error: "Not found" });
  res.type("text/plain").send(fs.readFileSync(promptPath, "utf-8"));
});

app.get("/api/agents/:type/prompt/default", (req, res) => {
  // Return the git-tracked original by reading directly from the agents/ dir
  // (same file, but user can reset if they've saved changes)
  const type = req.params.type;
  const allowed = ["planner", "plan-reviewer", "coder", "reviewer", "git-agent", "fixer", "split-planner", "splitter", "rebaser"];
  if (!allowed.includes(type)) return res.status(400).json({ error: "Unknown agent type" });
  const promptPath = path.join(FORGE_DIR, "agents", `${type}.md`);
  if (!fs.existsSync(promptPath)) return res.status(404).json({ error: "Not found" });
  res.type("text/plain").send(fs.readFileSync(promptPath, "utf-8"));
});

app.put("/api/agents/:type/prompt", (req, res) => {
  const type = req.params.type;
  const allowed = ["planner", "plan-reviewer", "coder", "reviewer", "git-agent", "fixer", "split-planner", "splitter", "rebaser"];
  if (!allowed.includes(type)) return res.status(400).json({ error: "Unknown agent type" });

  const { content } = req.body;
  if (typeof content !== "string") return res.status(400).json({ error: "content required" });

  const promptPath = path.join(FORGE_DIR, "agents", `${type}.md`);
  const before = fs.existsSync(promptPath) ? fs.readFileSync(promptPath, "utf-8") : "";
  fs.writeFileSync(promptPath, content, "utf-8");
  logLearningChange({
    target: `agents/${type}.md`,
    changeType: "prompt_manual_edit",
    changeSummary: `Saved manual edit to agents/${type}.md`,
    reason: typeof req.body.reason === "string" && req.body.reason.trim() ? req.body.reason.trim() : "Manual prompt edit from Settings",
    actor: "user",
    metadata: { beforeLength: before.length, afterLength: content.length, delta: content.length - before.length },
  });
  res.json({ ok: true });
});

// ── Linear pull ───────────────────────────────────────────────────────

function normalizeLinearPriority(value, issue = {}) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const label = value.trim().toLowerCase();
    if (/^p?0$|none|no priority/.test(label)) return 0;
    if (/^p?1$|urgent|critical/.test(label)) return 1;
    if (/^p?2$|high/.test(label)) return 2;
    if (/^p?3$|medium|normal/.test(label)) return 3;
    if (/^p?4$|low/.test(label)) return 4;
  }
  if (value && typeof value === "object") {
    for (const key of ["value", "priority", "number", "rank"]) {
      const normalized = normalizeLinearPriority(value[key]);
      if (normalized !== 0 || value[key] === 0) return normalized;
    }
    for (const key of ["name", "label", "title"]) {
      const normalized = normalizeLinearPriority(value[key]);
      if (normalized !== 0) return normalized;
    }
  }
  for (const key of ["priorityLabel", "priorityName"]) {
    const normalized = normalizeLinearPriority(issue[key]);
    if (normalized !== 0) return normalized;
  }
  return 0;
}

function normalizeLinearIssue(issue) {
  const stateObj = issue.state && typeof issue.state === "object" ? issue.state : null;
  return {
    ...issue,
    identifier: issue.identifier,
    title: issue.title,
    priority: normalizeLinearPriority(issue.priority, issue),
    state: stateObj?.name ?? issue.state ?? "Unknown",
    stateType: stateObj?.type ?? issue.stateType ?? null,
    createdAt: issue.createdAt ?? null,
    updatedAt: issue.updatedAt ?? null,
    assignedAt: issue.assignedAt ?? null,
    completedAt: issue.completedAt ?? null,
    canceledAt: issue.canceledAt ?? issue.cancelledAt ?? null,
    archivedAt: issue.archivedAt ?? null,
  };
}

function isOpenLinearIssue(issue) {
  if (issue?.completedAt || issue?.canceledAt || issue?.archivedAt) return false;
  const state = String(issue?.state ?? "").trim().toLowerCase();
  const stateType = String(issue?.stateType ?? "").trim().toLowerCase();
  return ![state, stateType].some(value => ["done", "completed", "complete", "canceled", "cancelled", "closed", "duplicate"].includes(value));
}

function forgeTrackedLinearIds() {
  return new Set(q("SELECT linear_id FROM issues WHERE linear_id IS NOT NULL").map(r => r.linear_id));
}

function sortLinearIssuesByPriority(issues) {
  return issues.sort((a, b) => {
    const pa = a.priority === 0 ? 99 : a.priority;
    const pb = b.priority === 0 ? 99 : b.priority;
    return pa - pb;
  });
}

function filterLinearBacklogIssues(issues) {
  const existing = forgeTrackedLinearIds();
  return sortLinearIssuesByPriority(normalizeLinearIssues(issues)
    .filter(issue => isOpenLinearIssue(issue))
    .filter(issue => !existing.has(issue.identifier)));
}

function normalizeLinearIssues(issues) {
  return (Array.isArray(issues) ? issues : []).map(normalizeLinearIssue).filter(issue => issue.identifier);
}

function normalizeLinearQueryResult(raw) {
  const data = JSON.parse(raw || "{}");
  const nodes = Array.isArray(data) ? data : Array.isArray(data.nodes) ? data.nodes : [];
  return normalizeLinearIssues(nodes);
}

async function listAssignedLinearIssues(team) {
  const raw = await execAsync("linear", [
    "issue", "query", "--team", team,
    "--assignee", "@me",
    "-s", "triage", "-s", "backlog", "-s", "unstarted", "-s", "started",
    "--sort", "priority", "--no-pager", "--json",
  ]);
  return normalizeLinearQueryResult(raw);
}

app.get("/api/linear/issues", async (_req, res) => {
  try {
    const team = qOne("SELECT value FROM settings WHERE key = 'linear_team'")?.value ?? "";
    if (!team.trim()) return res.json([]);
    if (!linearIntegrationEnabled()) {
      enqueueDesktopJobOnce("linear.listAssigned", { team });
      return res.json(filterLinearBacklogIssues(getDesktopCache("linear.assigned")));
    }

    try {
      res.json(filterLinearBacklogIssues(await listAssignedLinearIssues(team)));
    } catch (error) {
      // Remote/Linux backends often do not have the macOS-authenticated Linear CLI.
      // Fall back to the desktop bridge instead of surfacing a 500 in the app.
      enqueueDesktopJobOnce("linear.listAssigned", { team });
      res.json(filterLinearBacklogIssues(getDesktopCache("linear.assigned")));
    }
  } catch (e) {
    res.status(500).json({ error: e.message ?? String(e) });
  }
});

app.post("/api/linear/enqueue", async (req, res) => {
  const { linearId, planningGuidance } = req.body;
  if (!linearId) return res.status(400).json({ error: "linearId required" });

  const existing = qOne("SELECT id FROM issues WHERE linear_id = ?", linearId);
  if (existing) return res.status(409).json({ error: "Already in Forge", issueId: existing.id });

  try {
    const data = { title: linearId, priority: 0 };
    let fetchViaDesktop = !linearIntegrationEnabled();
    if (linearIntegrationEnabled()) {
      try {
        const raw = await execAsync("linear", ["issue", "view", linearId, "--json"]);
        Object.assign(data, normalizeLinearIssue(JSON.parse(raw)));
      } catch (error) {
        // Remote/Linux backends often cannot run the macOS-authenticated Linear CLI.
        // Still enqueue the issue immediately and let the desktop bridge hydrate it.
        fetchViaDesktop = true;
      }
    }
    const trimmedGuidance = typeof planningGuidance === "string" ? planningGuidance.trim() : "";
    const steeringContext = trimmedGuidance
      ? `Planning guidance supplied at enqueue:\n\n${trimmedGuidance}`
      : null;

    const result = run(
      "INSERT INTO issues (source, linear_id, title, priority, steering_context) VALUES ('linear', ?, ?, ?, ?)",
      linearId, data.title ?? linearId, data.priority ?? 0, steeringContext
    );
    const newIssueId = result.lastInsertRowid;
    if (steeringContext) {
      run(
        `INSERT INTO activity_log (issue_id, type, actor, message)
         VALUES (?, 'steered', 'user', 'Planning guidance supplied at enqueue')`,
        newIssueId
      );
    }
    if (fetchViaDesktop) enqueueDesktopJob("linear.fetchIssue", { issueId: newIssueId, linearId });
    broadcast("issue_added", { issueId: newIssueId, linearId });
    // Move Linear issue to In Progress immediately on enqueue
    syncLinearState(newIssueId, "SETTING_UP").catch(() => {});
    res.json({ ok: true, issueId: newIssueId });
  } catch (e) {
    res.status(500).json({ error: e.message ?? String(e) });
  }
});

app.post("/api/issues", (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: "title required" });

  // Create project file for manual issues
  const result = run(
    "INSERT INTO issues (source, title) VALUES ('manual', ?)", title
  );
  const issueId = result.lastInsertRowid;

  if (description) {
    const projectDir = path.join(FORGE_DIR, "projects", String(issueId));
    fs.mkdirSync(projectDir, { recursive: true });
    const projectFilePath = path.join(projectDir, "plan.md");
    const now = new Date().toISOString();
    fs.writeFileSync(projectFilePath, [
      "---",
      "linear-id:",
      "pr-url:",
      "base-branch: main",
      "app:",
      "layer:",
      `started: ${now}`,
      "merged:",
      "branch-name:",
      "project:",
      "milestone:",
      "---",
      description,
      "",
      "# PR Stack",
      "",
      "# TODO",
      "",
      "# Decisions Made",
      "",
      "# Log",
      `## Issue created`,
      `*${now}*`,
      "Manual issue created via Forge dashboard.",
    ].join("\n"), "utf-8");

    run("UPDATE issues SET project_file_path = ?, updated_at = datetime('now') WHERE id = ?",
      projectFilePath, issueId);
  }

  broadcast("issue_added", { issueId, source: "manual" });
  res.json({ ok: true, issueId });
});

// ── Embedded terminals ───────────────────────────────────────────────

function isLocalSocket(socket) {
  const addr = socket.remoteAddress;
  return addr === "127.0.0.1" || addr === "::1" || addr === "::ffff:127.0.0.1";
}

function terminalShell() {
  if (process.env.SHELL && fs.existsSync(process.env.SHELL)) return process.env.SHELL;
  if (process.platform === "win32") return "powershell.exe";
  if (fs.existsSync("/bin/zsh")) return "/bin/zsh";
  return "/bin/bash";
}

function ensureNodePtyHelperExecutable() {
  if (process.platform !== "darwin") return;
  try {
    const ptyEntry = require.resolve("node-pty");
    const root = path.dirname(path.dirname(ptyEntry));
    const helper = path.join(root, "prebuilds", process.arch === "arm64" ? "darwin-arm64" : "darwin-x64", "spawn-helper");
    if (fs.existsSync(helper)) fs.chmodSync(helper, 0o755);
  } catch (e) {
    console.warn(`[terminal] Could not chmod node-pty spawn-helper: ${e.message}`);
  }
}

function handleTerminalConnection(ws, req, issueId) {
  if (!isLocalSocket(req.socket)) {
    ws.close(1008, "Terminals are local-only");
    return;
  }

  const issue = qOne("SELECT id, title, wt_path FROM issues WHERE id = ?", issueId);
  if (!issue?.wt_path || !fs.existsSync(issue.wt_path)) {
    ws.close(1008, "No worktree for issue");
    return;
  }

  const shell = terminalShell();
  ensureNodePtyHelperExecutable();

  let term;
  try {
    term = pty.spawn(shell, [], {
      name: "xterm-256color",
      cols: 100,
      rows: 30,
      cwd: issue.wt_path,
      env: { ...process.env, TERM: "xterm-256color", FORGE_ISSUE_ID: String(issue.id) },
    });
  } catch (e) {
    console.warn(`[terminal] Could not spawn shell for issue #${issueId}: ${e.message}`);
    ws.send(`\r\n\x1b[31mCould not start terminal:\x1b[0m ${e.message}\r\n`);
    ws.close(1011, "Could not start terminal");
    return;
  }

  ws.send(`\r\n\x1b[32mForge terminal connected\x1b[0m — ${issue.wt_path}\r\n`);

  term.onData((data) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(data);
  });

  term.onExit(({ exitCode }) => {
    if (ws.readyState === WebSocket.OPEN) ws.close(1000, `Shell exited (${exitCode})`);
  });

  ws.on("message", (raw) => {
    const text = raw.toString();
    try {
      const msg = JSON.parse(text);
      if (msg.type === "resize") {
        term.resize(Math.max(20, Number(msg.cols) || 100), Math.max(5, Number(msg.rows) || 30));
        return;
      }
      if (msg.type === "input") {
        term.write(String(msg.data ?? ""));
        return;
      }
    } catch {}
    term.write(text);
  });

  ws.on("close", () => {
    try { term.kill(); } catch {}
  });
}

// ── Start ─────────────────────────────────────────────────────────────

const server = http.createServer(app);
const terminalWss = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const match = url.pathname.match(/^\/api\/issues\/(\d+)\/terminal$/);
  if (!match) {
    socket.destroy();
    return;
  }

  terminalWss.handleUpgrade(req, socket, head, (ws) => {
    handleTerminalConnection(ws, req, Number(match[1]));
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  Forge Dashboard`);
  console.log(`  ───────────────`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`  DB:  ${path.join(FORGE_DIR, "forge.db")}\n`);
});
