#!/usr/bin/env node
/**
 * Forge — Agent Runner
 *
 * Standalone script spawned (and detached) by the scheduler for each agent phase.
 * Responsibilities:
 *   1. Lock the issue in SQLite
 *   2. Run the pre-flight (fetch Linear, download assets)
 *   3. Build the context bundle + system prompt
 *   4. Spawn pi-sdk-runner and wait for it to exit
 *   5. Parse agent output, determine next state, update SQLite
 *   6. Unlock the issue
 *
 * Usage:
 *   node agent-runner.js --issue-id <id> --agent-type <type> --run-id <id>
 */

"use strict";

const { execFileSync, execFile, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

// ── Parse args ──────────────────────────────────────────────────────

const args = process.argv.slice(2);
function getArg(flag) {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
}

const issueId    = parseInt(getArg("--issue-id"), 10);
const agentType  = getArg("--agent-type");
const runId      = parseInt(getArg("--run-id"), 10);
const cleanupMode = args.includes("--cleanup-mode");

if (!issueId || !agentType || !runId) {
  console.error("[forge:runner] Missing required args: --issue-id --agent-type --run-id");
  process.exit(1);
}

// ── Setup ────────────────────────────────────────────────────────────

const FORGE_DIR = process.env.FORGE_DIR || path.join(os.homedir(), ".pi", "agent", "extensions", "forge");
const Database = require(path.join(FORGE_DIR, "node_modules", "better-sqlite3"));

const db = new Database(path.join(FORGE_DIR, "forge.db"));
db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 5000");
db.pragma("foreign_keys = ON");

function getSetting(key) {
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key);
  return row?.value;
}

function getAgentModel(type) {
  const key = `model_${String(type).replace(/-/g, "_")}`;
  return getSetting(key) || getSetting("model") || "anthropic-vertex/sonnet-4-6";
}

function settingEnabled(key) {
  return ["1", "true", "yes", "on"].includes(String(getSetting(key) ?? "").toLowerCase());
}

const MODEL = getAgentModel(agentType);
const WT_ROOT = getSetting("wt_root") || path.join(os.homedir(), "Projects", "worktrees");
const BRANCH_PREFIX = getSetting("branch_prefix") || os.userInfo().username || "forge";
const DEFAULT_BRANCH = getSetting("default_branch") || "main";

// ── Logging ──────────────────────────────────────────────────────────

const logDir = path.join(FORGE_DIR, "projects", String(issueId));
fs.mkdirSync(logDir, { recursive: true });
const logPath = path.join(logDir, `run-${runId}-${agentType}.log`);
const logStream = fs.createWriteStream(logPath, { flags: "a" });

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  logStream.write(line + "\n");
}

// ── DB helpers ───────────────────────────────────────────────────────

function getIssue() {
  return db.prepare("SELECT * FROM issues WHERE id = ?").get(issueId);
}

// Linear state names to sync at each forge state
const LINEAR_STATE_MAP = {
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

function enqueueDesktopJob(type, payload) {
  try {
    return db.prepare("INSERT INTO desktop_jobs (type, payload_json) VALUES (?, ?)").run(type, JSON.stringify(payload ?? {})).lastInsertRowid;
  } catch (e) {
    log(`WARN: Could not enqueue desktop job ${type}: ${e.message}`);
    return null;
  }
}

function enqueueDesktopJobOnce(type, payload) {
  const payloadJson = JSON.stringify(payload ?? {});
  const existing = db.prepare(
    "SELECT id FROM desktop_jobs WHERE type = ? AND payload_json = ? AND status IN ('pending', 'running') LIMIT 1"
  ).get(type, payloadJson);
  if (existing) return existing.id;
  return enqueueDesktopJob(type, payload);
}

function enqueueLinearSyncJob(row, linearState, reason = "desktop bridge") {
  if (!row?.linear_id || row.linear_state === linearState) return;
  const jobId = enqueueDesktopJobOnce("linear.syncState", { issueId, linearId: row.linear_id, state: linearState });
  log(`Linear ${row.linear_id} → "${linearState}" queued via ${reason}${jobId ? ` (desktop job #${jobId})` : ""}`);
}

function syncLinearState(forgeState) {
  const linearState = LINEAR_STATE_MAP[forgeState];
  if (!linearState) return;
  const row = db.prepare("SELECT linear_id, linear_state FROM issues WHERE id = ?").get(issueId);
  const linearId = row?.linear_id;
  if (!linearId) return;
  if (row.linear_state === linearState) return; // already in sync

  if (getSetting("linear_enabled") !== "true") {
    enqueueLinearSyncJob(row, linearState);
    return;
  }

  try {
    execFileSync("linear", ["issue", "update", linearId, "--state", linearState], { timeout: 15000 });
    db.prepare("UPDATE issues SET linear_state = ?, updated_at = datetime('now') WHERE id = ?")
      .run(linearState, issueId);
    log(`Linear ${linearId} → "${linearState}"`);
  } catch (e) {
    log(`WARN: Could not update Linear state: ${e.message?.split('\n')[0]}`);
    enqueueLinearSyncJob(row, linearState, "Linear CLI fallback");
  }
}

function transition(newState) {
  db.prepare(`
    UPDATE issues
    SET previous_state = state, state = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(newState, issueId);
  log(`State → ${newState}`);
  syncLinearState(newState);
}

function unlock() {
  db.prepare(`
    UPDATE issues SET locked_at = NULL, agent_pid = NULL, updated_at = datetime('now')
    WHERE id = ?
  `).run(issueId);
}

function finishRun(exitCode) {
  db.prepare(`
    UPDATE agent_runs SET exited_at = datetime('now'), exit_code = ? WHERE id = ?
  `).run(exitCode, runId);
}

function logActivity(type, message, metadata) {
  db.prepare(`
    INSERT INTO activity_log (issue_id, type, actor, message, metadata)
    VALUES (?, ?, ?, ?, ?)
  `).run(issueId, type, agentType, message, metadata ? JSON.stringify(metadata) : null);
}

function updateLogPath() {
  db.prepare(`UPDATE agent_runs SET log_path = ? WHERE id = ?`).run(logPath, runId);
}

function createDecision(type, artifactRef) {
  const existing = db.prepare(`
    SELECT id FROM decision_queue
    WHERE issue_id = ? AND type = ? AND verdict IS NULL
    LIMIT 1
  `).get(issueId, type);
  if (existing) return;
  db.prepare(`
    INSERT INTO decision_queue (issue_id, type, artifact_ref)
    VALUES (?, ?, ?)
  `).run(issueId, type, artifactRef);
}

function clearSteeringContext() {
  db.prepare(`UPDATE issues SET steering_context = NULL, updated_at = datetime('now') WHERE id = ?`).run(issueId);
}

function getProjectDir(issueRow) {
  if (issueRow.project_file_path) return path.dirname(issueRow.project_file_path);
  return path.join(FORGE_DIR, "projects", String(issueRow.id));
}

function getHandoffPath(issueRow) {
  return path.join(getProjectDir(issueRow), "handoff.md");
}

function ensureHandoffFile(issueRow) {
  const handoffPath = getHandoffPath(issueRow);
  fs.mkdirSync(path.dirname(handoffPath), { recursive: true });
  if (!fs.existsSync(handoffPath)) {
    fs.writeFileSync(handoffPath, `# Handoff\n\n## Current State\nNo handoff recorded yet.\n\n## Implementation Summary\n\n## Files Changed\n\n## Decisions / Constraints\n\n## Known Risks / Follow-ups\n\n## Next Agent Notes\n\n## Agent Run Log\n`, "utf-8");
  }
  return handoffPath;
}

function getAgentSessionId(issueRow, type) {
  const sessionId = `forge-${issueRow.id}-${String(type).replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  let sessions = {};
  try { sessions = issueRow.pi_sessions_json ? JSON.parse(issueRow.pi_sessions_json) : {}; } catch {}
  if (sessions[type] !== sessionId) {
    sessions[type] = sessionId;
    db.prepare("UPDATE issues SET pi_sessions_json = ?, updated_at = datetime('now') WHERE id = ?")
      .run(JSON.stringify(sessions), issueRow.id);
    issueRow.pi_sessions_json = JSON.stringify(sessions);
  }
  return sessionId;
}

// ── Linear fetch ─────────────────────────────────────────────────────

function getDesktopCache(key) {
  try {
    const row = db.prepare("SELECT value_json FROM desktop_cache WHERE key = ?").get(key);
    return row?.value_json ? JSON.parse(row.value_json) : null;
  } catch {
    return null;
  }
}

function fetchLinearIssue(linearId) {
  if (!linearId) return null;
  if (getSetting("linear_enabled") !== "true") return getDesktopCache(`linear.issue.${linearId}`);

  try {
    const json = execFileSync("linear", ["issue", "view", linearId, "--json"], {
      encoding: "utf-8",
      timeout: 15000,
    });
    return JSON.parse(json);
  } catch (e) {
    log(`WARN: Could not fetch Linear issue ${linearId}: ${e.message}`);
    return null;
  }
}

// ── Asset pre-flight ─────────────────────────────────────────────────

function downloadAssets(linearData, issueRow) {
  const assetDir = path.join(FORGE_DIR, "projects", String(issueId), "assets");
  fs.mkdirSync(assetDir, { recursive: true });

  const imageUrlRegex = /https?:\/\/[^\s"')]+\.(?:png|jpg|jpeg|gif|webp|svg)/gi;
  const text = JSON.stringify(linearData ?? "");
  const urls = [...new Set(text.match(imageUrlRegex) ?? [])];

  const assetMap = {}; // original_url → local_path

  for (const url of urls) {
    // Check cache
    const cached = db.prepare("SELECT * FROM assets WHERE issue_id = ? AND original_url = ?").get(issueId, url);
    if (cached && fs.existsSync(cached.local_path)) {
      assetMap[url] = cached.local_path;
      continue;
    }

    // Download
    const ext = path.extname(new URL(url).pathname) || ".png";
    const filename = `asset-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const localPath = path.join(assetDir, filename);

    try {
      execFileSync("curl", ["-sL", "--max-time", "10", "-o", localPath, url]);
      db.prepare(`
        INSERT INTO assets (issue_id, original_url, local_path)
        VALUES (?, ?, ?)
        ON CONFLICT(issue_id, original_url) DO UPDATE SET local_path = excluded.local_path, fetched_at = datetime('now')
      `).run(issueId, url, localPath);
      assetMap[url] = localPath;
      log(`Downloaded asset: ${url} → ${localPath}`);
    } catch (e) {
      log(`WARN: Could not download asset ${url}: ${e.message}`);
      assetMap[url] = null;
    }
  }

  return assetMap;
}

// ── Context builder ──────────────────────────────────────────────────

function buildContextBundle(issueRow, linearData, assetMap) {
  const lines = [];

  lines.push(`# Issue: ${issueRow.title}`);
  if (issueRow.linear_id) {
    lines.push(`Linear ID: ${issueRow.linear_id}`);
  }
  lines.push(`Current state: ${issueRow.state}`);
  if (issueRow.wt_path) {
    lines.push(`Worktree path: ${issueRow.wt_path}`);
  }
  if (issueRow.project_file_path) {
    lines.push(`Project file: ${issueRow.project_file_path}`);
  }
  const handoffPath = ensureHandoffFile(issueRow);
  lines.push(`Handoff file: ${handoffPath}`);
  lines.push("");

  if (linearData) {
    lines.push("## Linear Issue Details");
    lines.push(`**Title:** ${linearData.title ?? issueRow.title}`);
    if (linearData.description) {
      let desc = linearData.description;
      // Replace remote image URLs with local paths
      for (const [url, localPath] of Object.entries(assetMap)) {
        if (localPath) desc = desc.split(url).join(localPath);
        else desc = desc.split(url).join(`[image unavailable: ${url}]`);
      }
      lines.push(`**Description:**\n${desc}`);
    }
    // comments is a flat array from `linear issue view --json`
    const comments = Array.isArray(linearData.comments)
      ? linearData.comments
      : (linearData.comments?.nodes ?? []);
    if (comments.length) {
      lines.push("**Comments (read carefully — these may contain critical decisions or constraints):**");
      for (const c of comments) {
        const author = c.user?.displayName ?? c.user?.name ?? c.externalUser?.name ?? "Unknown";
        const ts = c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "";
        lines.push(`- **${author}** (${ts}): ${c.body}`);
      }
    }
    lines.push("");
  }

  if (issueRow.project_file_path && fs.existsSync(issueRow.project_file_path)) {
    lines.push("## Project Plan");
    lines.push(fs.readFileSync(issueRow.project_file_path, "utf-8"));
    lines.push("");
  }

  if (fs.existsSync(handoffPath)) {
    lines.push("## Shared Handoff");
    lines.push(fs.readFileSync(handoffPath, "utf-8"));
    lines.push("");
  }

  lines.push("## Handoff Instructions");
  lines.push(`Before you finish, update ${handoffPath}. Keep it concise and current. Include current state, implementation summary, files changed, decisions/constraints, known risks/follow-ups, next-agent notes, and an entry under Agent Run Log for this ${agentType} run.`);
  lines.push("Treat handoff.md as shared operational memory across Forge agents; plan.md remains the project plan.");
  lines.push("");

  const prStack = db.prepare("SELECT * FROM pr_stack WHERE issue_id = ? ORDER BY position ASC").all(issueRow.id);
  if (prStack.length) {
    lines.push("## Current PR Stack");
    for (const pr of prStack) {
      lines.push(`- PR ${pr.position}: #${pr.pr_number ?? "unknown"} branch=${pr.gt_branch} status=${pr.status} base_pr_id=${pr.base_pr_id ?? "none"}`);
    }
    lines.push("");
  }

  if (issueRow.steering_context) {
    lines.push("## ⚠️ Steering Instructions (HIGH PRIORITY — follow these first)");
    lines.push(issueRow.steering_context);
    lines.push("");
  }

  // Plan-reviewer-specific context
  if (agentType === "plan-reviewer") {
    const verdictPath = path.join(FORGE_DIR, "projects", String(issueRow.id), "plan-review-verdict.json");
    const baseBranch = (() => {
      try { return fs.readFileSync(issueRow.project_file_path, "utf-8").match(/^base-branch:\s*(.+)$/m)?.[1]?.trim() ?? DEFAULT_BRANCH; }
      catch { return DEFAULT_BRANCH; }
    })();
    lines.push("## Plan reviewer instructions");
    lines.push(`verdict_path: ${verdictPath}`);
    lines.push(`base_branch: ${baseBranch}`);
    lines.push(`max_rounds: ${getSetting("ai_review_max_rounds") || 5}`);
    lines.push(`current_round: ${(issueRow.ai_review_rounds ?? 0) + 1}`);
    lines.push("");
  }

  // Code Reviewer-specific context
  if (agentType === "reviewer") {
    const verdictPath = path.join(FORGE_DIR, "projects", String(issueRow.id), "review-verdict.json");
    const baseBranch = (() => {
      try {
        const content = fs.readFileSync(issueRow.project_file_path, "utf-8");
        return content.match(/^base-branch:\s*(.+)$/m)?.[1]?.trim() ?? DEFAULT_BRANCH;
      } catch { return DEFAULT_BRANCH; }
    })();
    lines.push(`## Reviewer instructions`);
    lines.push(`verdict_path: ${verdictPath}`);
    lines.push(`base_branch: ${baseBranch}`);
    lines.push(`max_rounds: ${getSetting("ai_review_max_rounds") || 3}`);
    lines.push(`current_round: ${issueRow.ai_review_rounds + 1}`);
    lines.push("");
  }

  // Pending decision feedback (e.g. after rejection)
  const lastDecision = db.prepare(`
    SELECT * FROM decision_queue
    WHERE issue_id = ? AND verdict = 'rejected'
    ORDER BY resolved_at DESC LIMIT 1
  `).get(issueId);

  if (lastDecision?.feedback_json) {
    lines.push("## Review Feedback to Address");
    try {
      const feedback = JSON.parse(lastDecision.feedback_json);
      if (Array.isArray(feedback)) {
        for (const item of feedback) {
          lines.push(`- **${item.section}:** ${item.comment}`);
        }
      } else {
        lines.push(String(lastDecision.feedback_json));
      }
    } catch {
      lines.push(lastDecision.feedback_json);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ── System prompt loader ─────────────────────────────────────────────

function loadSystemPrompt(type) {
  const promptPath = path.join(FORGE_DIR, "agents", `${type}.md`);
  const basePrompt = fs.existsSync(promptPath)
    ? fs.readFileSync(promptPath, "utf-8")
    : `You are a ${type} agent in the Forge AI development system. Do your work carefully and thoroughly.`;
  const overlay = (getSetting("project_prompt_overlay") || "").trim();
  return overlay ? `${basePrompt}\n\n---\n\n# Project-specific instructions\n\n${overlay}\n` : basePrompt;
}

// Max runtime: 45 minutes — prevents runaway agents eating RAM
const MAX_RUNTIME_MS = 45 * 60 * 1000;

// ── Pi spawner ───────────────────────────────────────────────────────

// Global ref so SIGTERM can forward to the pi SDK runner child
let activePiProc = null;

process.on("SIGTERM", () => {
  log("SIGTERM received — terminating pi child");
  if (activePiProc) { try { activePiProc.kill("SIGTERM"); } catch {} }
  process.exit(1);
});
process.on("SIGINT", () => {
  if (activePiProc) { try { activePiProc.kill("SIGTERM"); } catch {} }
  process.exit(1);
});

function spawnPi(systemPromptPath, userPrompt, cwd, issueRow) {
  return new Promise((resolve) => {
    const promptFile = path.join(logDir, `run-${runId}-${agentType}-prompt.txt`);
    fs.writeFileSync(promptFile, userPrompt, "utf-8");

    if (settingEnabled("forge_reuse_pi_sessions")) {
      const sessionId = getAgentSessionId(issueRow, agentType);
      log(`Pi SDK runner currently uses in-memory sessions; requested reusable session: ${sessionId}`);
    }

    const runnerPath = path.join(FORGE_DIR, "pi-sdk-runner.mjs");
    const piArgs = [
      runnerPath,
      "--cwd", cwd || FORGE_DIR,
      "--system-prompt", systemPromptPath,
      "--model", MODEL,
      "--prompt-file", promptFile,
    ];

    log(`Spawning pi SDK runner in ${cwd}`);
    const proc = spawn(process.execPath, piArgs, {
      cwd: cwd || FORGE_DIR,
      env: { ...process.env, FORGE_DIR },
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });

    activePiProc = proc;

    // Hard kill if agent runs too long
    const killTimer = setTimeout(() => {
      log(`ERROR: Max runtime exceeded (${MAX_RUNTIME_MS / 60000}min) — killing pi SDK runner`);
      try { proc.kill("SIGKILL"); } catch {}
    }, MAX_RUNTIME_MS);

    let lastAssistantText = "";
    let lineBuffer = "";

    proc.stdout.on("data", (data) => {
      lineBuffer += data.toString();
      const lines = lineBuffer.split("\n");
      lineBuffer = lines.pop() ?? "";

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;
        try {
          const event = JSON.parse(line);
          if (event.type === "assistant" && event.message?.content) {
            for (const block of event.message.content) {
              if (block.type === "text") lastAssistantText = block.text;
            }
          } else if (event.type === "text_delta" && typeof event.delta === "string") {
            lastAssistantText += event.delta;
          } else if (event.type === "message_update" && event.assistantMessageEvent?.type === "text_delta") {
            lastAssistantText += event.assistantMessageEvent.delta ?? "";
          }
          logStream.write(line + "\n");
        } catch {
          // Not JSON, ignore
        }
      }
    });

    proc.stderr.on("data", (data) => {
      logStream.write("[stderr] " + data.toString());
    });

    proc.on("close", (code) => {
      clearTimeout(killTimer);
      activePiProc = null;
      resolve({ exitCode: code ?? 1, lastAssistantText });
    });
  });
}

// ── Worktree setup (pre-flight) ─────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

function parseWtListOutput(output) {
  const text = String(output || '').trim();
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1 || end < start) return [];
  return JSON.parse(text.slice(start, end + 1));
}

function ensureWorktree(issueRow) {
  if (issueRow.wt_path && fs.existsSync(issueRow.wt_path)) {
    log(`Worktree already exists: ${issueRow.wt_path}`);
    return issueRow.wt_path;
  }

  // Build branch name: {prefix}/{linear-id or 'issue-N'}-{slug}
  const identifier = issueRow.linear_id ?? `issue-${issueRow.id}`;
  const slug = slugify(issueRow.title);
  const branchName = `${BRANCH_PREFIX}/${identifier}-${slug}`;

  const baseRef = `refs/remotes/origin/${DEFAULT_BRANCH}`;
  log(`Creating worktree: ${branchName} from ${baseRef}`);

  try {
    // Ensure the remote base ref is up to date. Do not rely on local main.
    execFileSync('git', ['-C', WT_ROOT, 'fetch', '--prune', 'origin', `+refs/heads/${DEFAULT_BRANCH}:refs/remotes/origin/${DEFAULT_BRANCH}`], { timeout: 30000 });

    // Create the worktree via wt
    execFileSync('wt', ['switch', '--no-hooks', '--create', branchName, '--base', baseRef], {
      cwd: WT_ROOT,
      encoding: 'utf-8',
      timeout: 60000,
    });

    log(`Worktree created: ${branchName}`);
  } catch (e) {
    // Branch may already exist — try switching to existing worktree
    log(`WARN: wt switch --create failed (${e.message}), trying wt switch...`);
    try {
      execFileSync('wt', ['switch', '--no-hooks', branchName], {
        cwd: WT_ROOT,
        encoding: 'utf-8',
        timeout: 30000,
      });
    } catch (e2) {
      log(`ERROR: Could not create or switch to worktree: ${e2.message}`);
      throw new Error(`Worktree setup failed for ${branchName}: ${e2.message}`);
    }
  }

  // Detect the actual worktree path
  let wtPath = null;
  try {
    const wtListJson = execFileSync('wt', ['list', '--format', 'json'], {
      encoding: 'utf-8',
      cwd: WT_ROOT,
      timeout: 10000,
    });
    const worktrees = parseWtListOutput(wtListJson);
    const match = worktrees.find(wt => wt.branch === branchName || wt.branch?.endsWith(branchName));
    if (match?.path) wtPath = match.path;
  } catch (e) {
    log(`WARN: wt list failed: ${e.message}`);
  }

  if (!wtPath) {
    // Fallback: derive path using Worktrunk's naming convention.
    const safeName = branchName.replace(/\//g, '-');
    const wtPrefix = path.basename(WT_ROOT);
    const legacyWtPrefix = wtPrefix.replace(/-/g, '.');
    const candidates = [
      path.join(path.dirname(WT_ROOT), `${wtPrefix}.${safeName}`),
      path.join(path.dirname(WT_ROOT), `${legacyWtPrefix}.${safeName}`),
    ];
    wtPath = candidates.find(p => fs.existsSync(p)) ?? candidates[0];
    log(`WARN: Using fallback wt_path: ${wtPath}`);
  }

  // Persist to DB
  db.prepare(`UPDATE issues SET wt_path = ?, updated_at = datetime('now') WHERE id = ?`).run(wtPath, issueRow.id);
  log(`wt_path set: ${wtPath}`);

  // Create project file if it doesn't exist
  if (!issueRow.project_file_path) {
    const projectDir = path.join(FORGE_DIR, 'projects', String(issueRow.id));
    fs.mkdirSync(projectDir, { recursive: true });
    const projectFilePath = path.join(projectDir, 'plan.md');
    const now = new Date().toISOString();
    fs.writeFileSync(projectFilePath, [
      '---',
      `linear-id: ${issueRow.linear_id ?? ''}`,
      'pr-url:',
      `base-branch: ${DEFAULT_BRANCH}`,
      'app:',
      'layer:',
      `started: ${now}`,
      'merged:',
      `branch-name: ${branchName}`,
      'project:',
      'milestone:',
      '---',
      '{summary of work to be done}',
      '',
      '# PR Stack',
      '',
      '# TODO',
      '',
      '# Decisions Made',
      '',
      '# Log',
    ].join('\n'), 'utf-8');
    db.prepare(`UPDATE issues SET project_file_path = ?, updated_at = datetime('now') WHERE id = ?`).run(projectFilePath, issueRow.id);
    log(`Project file created: ${projectFilePath}`);
  }

  return wtPath;
}

// ── Post-processing ─────────────────────────────────────────────────

/**
 * After the Planner agent exits, detect the worktree path and project file
 * and write them back to SQLite so subsequent agents have the context.
 */
function runPlannerPostProcess(issueRow) {
  const projectDir = path.join(FORGE_DIR, "projects", String(issueRow.id));
  fs.mkdirSync(projectDir, { recursive: true });

  // Expected project file path
  const projectFilePath = path.join(projectDir, "plan.md");

  const updates = {};

  // Set project_file_path if not already set and file exists
  if (!issueRow.project_file_path && fs.existsSync(projectFilePath)) {
    updates.project_file_path = projectFilePath;
    log(`Set project_file_path: ${projectFilePath}`);
  }

  // Detect wt_path via `wt list` if not already set
  if (!issueRow.wt_path) {
    try {
      const wtListJson = execFileSync("wt", ["list", "--format", "json"], {
        encoding: "utf-8",
        timeout: 10000,
        cwd: WT_ROOT,
      });
      const worktrees = parseWtListOutput(wtListJson);
      // Find worktree whose branch contains the linear_id or issue id
      const searchKey = (issueRow.linear_id ?? String(issueRow.id)).toLowerCase();
      const match = worktrees.find(wt =>
        wt.branch?.toLowerCase().includes(searchKey) ||
        wt.path?.toLowerCase().includes(searchKey)
      );
      if (match?.path) {
        updates.wt_path = match.path;
        log(`Detected wt_path: ${match.path}`);
      } else {
        log(`WARN: Could not detect worktree for issue #${issueRow.id}`);
      }
    } catch (e) {
      log(`WARN: wt list failed: ${e.message}`);
      // Fallback: scan the Projects directory for a worktree containing the branch name.
      try {
        const searchKey = (issueRow.linear_id ?? String(issueRow.id)).toLowerCase();
        const wtPrefix = path.basename(WT_ROOT);
        const legacyWtPrefix = wtPrefix.replace(/-/g, ".");
        const dirs = fs.readdirSync(path.dirname(WT_ROOT), { withFileTypes: true })
          .filter(d => d.isDirectory()
            && (d.name.startsWith(`${wtPrefix}.`) || d.name.startsWith(`${legacyWtPrefix}.`))
            && d.name.toLowerCase().includes(searchKey))
          .map(d => path.join(path.dirname(WT_ROOT), d.name));
        if (dirs.length > 0) {
          updates.wt_path = dirs[0];
          log(`Fallback wt_path: ${dirs[0]}`);
        }
      } catch {}
    }
  }

  if (Object.keys(updates).length > 0) {
    const sets = Object.keys(updates).map(k => `${k} = ?`).join(", ");
    const values = [...Object.values(updates), issueRow.id];
    db.prepare(`UPDATE issues SET ${sets}, updated_at = datetime('now') WHERE id = ?`).run(...values);
  }
}

// ── Plan-reviewer post-processing ────────────────────────────────────────

function runPlanReviewerPostProcess(issueRow) {
  const projectDir  = path.join(FORGE_DIR, "projects", String(issueRow.id));
  const verdictPath = path.join(projectDir, "plan-review-verdict.json");

  const maxRounds = parseInt(
    db.prepare("SELECT value FROM settings WHERE key = 'ai_review_max_rounds'").get()?.value ?? "5", 10
  );

  let verdict = { verdict: "approved", summary: "Plan reviewer did not produce a verdict.", feedback: [] };

  if (fs.existsSync(verdictPath)) {
    try {
      verdict = JSON.parse(fs.readFileSync(verdictPath, "utf-8"));
      // Archive before deleting so there's a post-hoc audit trail
      const roundNum = (issueRow.ai_review_rounds ?? 0) + 1;
      const verdictsDir = path.join(projectDir, "verdicts");
      fs.mkdirSync(verdictsDir, { recursive: true });
      const archivePath = path.join(verdictsDir, `plan-review-round-${roundNum}.json`);
      fs.renameSync(verdictPath, archivePath);
      log(`Plan review verdict archived → verdicts/plan-review-round-${roundNum}.json`);
    } catch (e) {
      log(`WARN: Could not parse plan review verdict: ${e.message}`);
    }
  } else {
    log("WARN: Plan reviewer did not write verdict file — treating as approved");
    db.prepare(`INSERT INTO activity_log (issue_id, type, actor, message) VALUES (?, 'missing_verdict', 'plan-reviewer', 'Plan reviewer exited without writing a verdict file — defaulted to approved. Agent may have crashed mid-run.')`).run(issueRow.id);
  }

  const rounds = db.prepare(
    "UPDATE issues SET ai_review_rounds = ai_review_rounds + 1, total_ai_review_rounds = total_ai_review_rounds + 1, updated_at = datetime('now') WHERE id = ? RETURNING ai_review_rounds"
  ).get(issueRow.id)?.ai_review_rounds ?? 1;

  log(`AI plan review round ${rounds}/${maxRounds} — verdict: ${verdict.verdict}`);

  if (verdict.verdict === "needs_changes" && rounds < maxRounds) {
    // Store feedback so planner picks it up
    const existing = db.prepare(
      "SELECT id FROM decision_queue WHERE issue_id = ? AND type = 'AI_PLAN_REVIEW' AND verdict IS NULL LIMIT 1"
    ).get(issueRow.id);
    if (!existing) {
      db.prepare(`
        INSERT INTO decision_queue (issue_id, type, artifact_ref, feedback_json, verdict, resolved_at)
        VALUES (?, 'AI_PLAN_REVIEW', ?, ?, 'rejected', datetime('now'))
      `).run(issueRow.id, issueRow.project_file_path ?? String(issueRow.id), JSON.stringify(verdict.feedback ?? []));
    }
    db.prepare(`
      INSERT INTO activity_log (issue_id, type, actor, message, metadata)
      VALUES (?, 'ai_plan_review_rejected', 'plan-reviewer', ?, ?)
    `).run(issueRow.id, `AI plan review: needs changes — ${verdict.summary ?? ""}`,
      JSON.stringify({ round: rounds, feedback: verdict.feedback }));
    transition("PLANNING");
    return { nextState: "PLANNING" };
  }

  if (rounds >= maxRounds && verdict.verdict === "needs_changes") {
    log(`Max plan review rounds (${maxRounds}) reached — escalating to human`);
    db.prepare(`INSERT INTO activity_log (issue_id, type, actor, message) VALUES (?, 'ai_plan_review_escalated', 'plan-reviewer', ?)`)
      .run(issueRow.id, `Max AI plan review rounds reached — escalating to human`);
  } else {
    db.prepare(`INSERT INTO activity_log (issue_id, type, actor, message) VALUES (?, 'ai_plan_review_approved', 'plan-reviewer', ?)`)
      .run(issueRow.id, `AI plan review approved: ${verdict.summary ?? "Plan looks good"}`);
  }

  // Reset per-cycle counter only; total_ai_review_rounds is cumulative and never reset
  db.prepare("UPDATE issues SET ai_review_rounds = 0, updated_at = datetime('now') WHERE id = ?").run(issueRow.id);
  transition("AWAITING_PLAN_APPROVAL");
  return { nextState: "AWAITING_PLAN_APPROVAL" };
}

// ── Reviewer post-processing ─────────────────────────────────────────────

/**
 * After the Reviewer agent exits, read the verdict file and decide next state.
 * If approved (or max rounds hit) → AWAITING_CODE_REVIEW.
 * If needs_changes → store feedback + WORKING for another coder pass.
 */
function runReviewerPostProcess(issueRow) {
  const projectDir  = path.join(FORGE_DIR, "projects", String(issueRow.id));
  const verdictPath = path.join(projectDir, "review-verdict.json");

  const maxRounds = parseInt(
    db.prepare("SELECT value FROM settings WHERE key = 'ai_review_max_rounds'").get()?.value ?? "3",
    10
  );

  let verdict = { verdict: "approved", summary: "Reviewer did not produce a verdict.", feedback: [] };

  if (fs.existsSync(verdictPath)) {
    try {
      verdict = JSON.parse(fs.readFileSync(verdictPath, "utf-8"));
      // Archive before deleting so there's a post-hoc audit trail
      const roundNum = (issueRow.ai_review_rounds ?? 0) + 1;
      const verdictsDir = path.join(projectDir, "verdicts");
      fs.mkdirSync(verdictsDir, { recursive: true });
      const archivePath = path.join(verdictsDir, `code-review-round-${roundNum}.json`);
      fs.renameSync(verdictPath, archivePath);
      log(`Code review verdict archived → verdicts/code-review-round-${roundNum}.json`);
    } catch (e) {
      log(`WARN: Could not parse review verdict: ${e.message}`);
    }
  } else {
    log("WARN: Reviewer did not write verdict file — treating as approved");
    db.prepare(`INSERT INTO activity_log (issue_id, type, actor, message) VALUES (?, 'missing_verdict', 'reviewer', 'Reviewer exited without writing a verdict file — defaulted to approved. Agent may have crashed mid-run.')`).run(issueRow.id);
  }

  // Increment round counter
  const rounds = db.prepare(
    "UPDATE issues SET ai_review_rounds = ai_review_rounds + 1, total_ai_review_rounds = total_ai_review_rounds + 1, updated_at = datetime('now') WHERE id = ? RETURNING ai_review_rounds"
  ).get(issueRow.id)?.ai_review_rounds ?? 1;

  log(`AI review round ${rounds}/${maxRounds} — verdict: ${verdict.verdict}`);

  if (verdict.verdict === "needs_changes" && rounds < maxRounds) {
    // Store feedback as a pre-resolved AI_CODE_REVIEW decision (coder picks it up)
    const existing = db.prepare(
      "SELECT id FROM decision_queue WHERE issue_id = ? AND type = 'AI_CODE_REVIEW' AND verdict IS NULL LIMIT 1"
    ).get(issueRow.id);

    if (!existing) {
      db.prepare(`
        INSERT INTO decision_queue (issue_id, type, artifact_ref, feedback_json, verdict, resolved_at)
        VALUES (?, 'AI_CODE_REVIEW', ?, ?, 'rejected', datetime('now'))
      `).run(
        issueRow.id,
        issueRow.project_file_path ?? String(issueRow.id),
        JSON.stringify(verdict.feedback ?? [])
      );
    }

    // Log it
    db.prepare(`
      INSERT INTO activity_log (issue_id, type, actor, message, metadata)
      VALUES (?, 'ai_review_rejected', 'reviewer', ?, ?)
    `).run(
      issueRow.id,
      `AI review: needs changes — ${verdict.summary ?? ""}`,
      JSON.stringify({ round: rounds, feedback: verdict.feedback })
    );

    // Send back to coder
    transition("WORKING");
    return { nextState: "WORKING" };
  }

  // Approved (or max rounds hit)
  if (rounds >= maxRounds && verdict.verdict === "needs_changes") {
    log(`Max AI review rounds (${maxRounds}) reached — escalating to human review`);
    db.prepare(`
      INSERT INTO activity_log (issue_id, type, actor, message)
      VALUES (?, 'ai_review_escalated', 'reviewer', ?)
    `).run(issueRow.id, `Max AI review rounds reached (${maxRounds}) — escalating to human`);
  } else {
    db.prepare(`
      INSERT INTO activity_log (issue_id, type, actor, message)
      VALUES (?, 'ai_review_approved', 'reviewer', ?)
    `).run(issueRow.id, `AI review approved: ${verdict.summary ?? "Code looks good"}`);
  }

  // Reset per-cycle counter only; total_ai_review_rounds is cumulative and never reset
  db.prepare("UPDATE issues SET ai_review_rounds = 0, updated_at = datetime('now') WHERE id = ?").run(issueRow.id);

  transition("AWAITING_CODE_REVIEW");
  return { nextState: "AWAITING_CODE_REVIEW" };
}

// ── Done post-processing ─────────────────────────────────────────────

function maybeRunReflection(issueRow, trigger = "completion", timeout = 90000) {
  const reflectScript = path.join(FORGE_DIR, "reflect.js");
  if (!fs.existsSync(reflectScript)) return;
  try {
    execFileSync(process.execPath, [reflectScript, "--issue-id", String(issueRow.id), "--trigger", trigger], {
      encoding: "utf-8", timeout,
    });
    log(`Reflection complete (${trigger})`);
  } catch (e) {
    log(`WARN: reflection failed (${trigger}): ${e.message}`);
  }
}

function maybeReflectFixLoop(issueRow) {
  const fixerRuns = db.prepare("SELECT COUNT(*) AS count FROM agent_runs WHERE issue_id = ? AND agent_type = 'fixer'").get(issueRow.id)?.count ?? 0;
  const rejectedFixes = db.prepare("SELECT COUNT(*) AS count FROM decision_queue WHERE issue_id = ? AND type = 'FIX_APPROVAL' AND verdict = 'rejected'").get(issueRow.id)?.count ?? 0;
  if (fixerRuns >= 5 || rejectedFixes >= 5) {
    log(`Fix loop threshold reached (fixer runs: ${fixerRuns}, rejected fixes: ${rejectedFixes}) — running reflection.`);
    maybeRunReflection(issueRow, "fix-loop", 120000);
  }
}

function runDonePostProcess(issueRow) {
  const summaryScript = path.join(FORGE_DIR, "generate-summary.js");
  const improveScript = path.join(FORGE_DIR, "self-improve.js");

  // Generate executive summary
  if (fs.existsSync(summaryScript)) {
    try {
      execFileSync(process.execPath, [summaryScript, "--issue-id", String(issueRow.id)], {
        encoding: "utf-8", timeout: 30000,
      });
      log("Executive summary generated");
    } catch (e) {
      log(`WARN: summary generation failed: ${e.message}`);
    }
  }

  // Run self-improvement
  if (fs.existsSync(improveScript)) {
    try {
      execFileSync(process.execPath, [improveScript, "--issue-id", String(issueRow.id)], {
        encoding: "utf-8", timeout: 30000,
      });
      log("Self-improvement complete");
    } catch (e) {
      log(`WARN: self-improvement failed: ${e.message}`);
    }
  }

  maybeRunReflection(issueRow, "completion", 120000);

  // Delete assets (keep plan.md and summary.md)
  const assetDir = path.join(FORGE_DIR, "projects", String(issueRow.id), "assets");
  if (fs.existsSync(assetDir)) {
    try {
      fs.rmSync(assetDir, { recursive: true, force: true });
      log("Assets cleaned up");
    } catch {}
  }

  syncLinearState("DONE");

  // Cleanup worktree via git agent (we just trigger a DONE cleanup run)
  // The git-agent prompt handles `wt remove` — we schedule a final git-agent run
  log("Scheduling final Git Agent run for worktree cleanup");
  const cleanupRun = db.prepare(`
    INSERT INTO agent_runs (issue_id, agent_type) VALUES (?, 'git-agent') RETURNING id
  `).get(issueRow.id);

  const { spawn } = require("child_process");
  const runnerPath = path.join(FORGE_DIR, "agent-runner.js");
  const proc = spawn(process.execPath, [
    runnerPath,
    "--issue-id", String(issueRow.id),
    "--agent-type", "git-agent",
    "--run-id", String(cleanupRun.id),
    "--cleanup-mode",
  ], { detached: true, stdio: "ignore" });
  proc.unref();
}

// ── State transition logic ──────────────────────────────────────────────

// Start-state promotion is handled by the scheduler synchronously before spawn.
// Agent-runner only handles end-state transitions (on successful completion).
// AI_REVIEWING is handled separately (reads verdict file).
const NEXT_STATE_MAP = {
  PLANNING:    "AI_PLAN_REVIEWING",     // planner → AI plan reviewer
  WORKING:     "AI_REVIEWING",          // coder → AI reviewer
  CREATING_PR:    "WATCHING_PR",
  SPLIT_PLANNING: "AWAITING_SPLIT_APPROVAL",
  SPLITTING:      "WATCHING_PR",
  FIXING:         "PUSHING",
  PUSHING:     "WATCHING_PR",
};

function determineNextState(currentState) {
  return NEXT_STATE_MAP[currentState] ?? null;
}

function determineDecisionType(nextState) {
  const map = {
    AWAITING_PLAN_APPROVAL: "PLAN_REVIEW",
    AWAITING_CODE_REVIEW:   "CODE_REVIEW",
    AWAITING_FIX_APPROVAL:  "FIX_APPROVAL",
    AWAITING_SPLIT_APPROVAL:"SPLIT_APPROVAL",
  };
  return map[nextState] ?? null;
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  updateLogPath();
  log(`Starting ${agentType} agent for issue #${issueId} (run #${runId})`);
  log(`Model: ${MODEL}`);
  logActivity("agent_started", `${agentType} started`);

  const issueRow = getIssue();
  if (!issueRow) {
    log("ERROR: Issue not found");
    finishRun(1);
    process.exit(1);
  }

  log(`Issue: "${issueRow.title}" | State: ${issueRow.state}`);

  // Fetch Linear data
  const linearData = fetchLinearIssue(issueRow.linear_id);

  // Download assets
  const assetMap = downloadAssets(linearData, issueRow);

  // Build context
  const contextBundle = buildContextBundle(issueRow, linearData, assetMap);

  // Load system prompt
  const systemPrompt = loadSystemPrompt(agentType);

  // Write system prompt to temp file
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `forge-${agentType}-`));
  const systemPromptPath = path.join(tmpDir, "system-prompt.md");
  const userPromptPath = path.join(tmpDir, "user-prompt.txt");

  fs.writeFileSync(systemPromptPath, systemPrompt, "utf-8");

  // Ensure project file path is set before planner runs
  if ((agentType === "planner") && !issueRow.project_file_path) {
    const projectDir  = path.join(FORGE_DIR, "projects", String(issueRow.id));
    fs.mkdirSync(projectDir, { recursive: true });
    const projectFilePath = path.join(projectDir, "plan.md");
    db.prepare(
      "UPDATE issues SET project_file_path = ?, updated_at = datetime('now') WHERE id = ?"
    ).run(projectFilePath, issueRow.id);
    // Re-read so context bundle picks up the path
    Object.assign(issueRow, db.prepare("SELECT * FROM issues WHERE id = ?").get(issueRow.id));
  }

  // Build user prompt
  const userPrompt = [contextBundle, ""].join("\n");
  fs.writeFileSync(userPromptPath, userPrompt, "utf-8");

  // Determine working directory
  const cwd = issueRow.wt_path && fs.existsSync(issueRow.wt_path)
    ? issueRow.wt_path
    : WT_ROOT;

  if (["planner", "plan-reviewer", "coder"].includes(agentType) && cwd && fs.existsSync(cwd)) {
    const baseBranch = getSetting("default_branch") || "main";
    log(`Syncing worktree with origin/${baseBranch} before ${agentType}…`);
    try {
      execFileSync(path.join(FORGE_DIR, "scripts", "sync-worktree-to-base"), [cwd, baseBranch], { cwd, timeout: 180000, stdio: "pipe" });
      log(`Worktree synced with origin/${baseBranch}`);
    } catch (e) {
      log(`ERROR: Could not sync worktree with origin/${baseBranch}: ${e.message}`);
      finishRun(1);
      logActivity("agent_failed", `Failed to sync worktree with origin/${baseBranch} before ${agentType}`, { error: e.message });
      transition("FAILED");
      unlock();
      db.close();
      logStream.end();
      process.exit(1);
    }
  }

  // Clear stale verdict files before a new review run
  if (agentType === "reviewer") {
    const vp = path.join(FORGE_DIR, "projects", String(issueId), "review-verdict.json");
    try { if (fs.existsSync(vp)) fs.unlinkSync(vp); } catch {}

    // Do not run global auto-formatters here. Tools like global project fixers can rewrite/commit
    // unrelated files in large monorepos, which pollutes the PR and review diff.
    // The coder/fixer prompts require formatting to be scoped to PR-touched files.
    log("Skipping global project fixers before AI review; formatting must stay scoped to PR files.");
  }
  if (agentType === "plan-reviewer") {
    const vp = path.join(FORGE_DIR, "projects", String(issueId), "plan-review-verdict.json");
    try { if (fs.existsSync(vp)) fs.unlinkSync(vp); } catch {}
  }
  if (agentType === "splitter" && issueRow.project_file_path) {
    const prsPath = path.join(path.dirname(issueRow.project_file_path), "prs.json");
    try { if (fs.existsSync(prsPath)) fs.unlinkSync(prsPath); } catch {}
    const merged = db.prepare("SELECT pr_number, gt_branch FROM pr_stack WHERE issue_id = ? AND status = 'merged'").all(issueId);
    if (merged.length) {
      log(`ERROR: Refusing to split; ${merged.length} tracked PR(s) are already merged.`);
      finishRun(1);
      logActivity("agent_failed", "splitter refused to run because tracked PRs are merged", { merged });
      transition("FAILED");
      unlock();
      db.close();
      logStream.end();
      process.exit(1);
    }
  }

  // Clear steering context (agent is about to read it)
  if (issueRow.steering_context) {
    clearSteeringContext();
  }

  // Spawn pi SDK runner
  let exitCode = 1;
  try {
    const result = await spawnPi(systemPromptPath, userPrompt, cwd, issueRow);
    exitCode = result.exitCode;
    log(`pi SDK runner exited with code ${exitCode}`);
  } catch (e) {
    log(`ERROR spawning pi SDK runner: ${e.message}`);
  } finally {
    // Cleanup temp files
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
  }

  finishRun(exitCode);

  if (exitCode !== 0) {
    // Auto-retry for deterministic agents that fail due to transient errors
    // (network blips, gh auth hiccups, git push conflicts, etc.).
    const RETRIABLE_AGENTS = new Set(["git-agent", "fixer"]);
    const maxRetries = parseInt(
      db.prepare("SELECT value FROM settings WHERE key = 'auto_retry_max'").get()?.value ?? "3",
      10
    );

    if (RETRIABLE_AGENTS.has(agentType)) {
      const retryCount = db.prepare(
        "UPDATE issues SET retry_count = retry_count + 1, updated_at = datetime('now') WHERE id = ? RETURNING retry_count"
      ).get(issueId)?.retry_count ?? 1;

      if (retryCount <= maxRetries) {
        log(`${agentType} failed (exit ${exitCode}). Auto-retry ${retryCount}/${maxRetries} — unlocking for scheduler to retry.`);
        logActivity("agent_failed", `${agentType} failed (exit ${exitCode}), auto-retry ${retryCount}/${maxRetries}`);
        // Don't transition to FAILED — leave issue in current state so scheduler retries
        unlock();
        db.close();
        logStream.end();
        process.exit(exitCode);
      }

      // Max retries exhausted — give up and go FAILED, reset counter
      log(`${agentType} failed (exit ${exitCode}). Max retries (${maxRetries}) exhausted. Transitioning to FAILED.`);
      logActivity("agent_failed", `${agentType} failed after ${maxRetries} retries — giving up`);
      db.prepare("UPDATE issues SET retry_count = 0, updated_at = datetime('now') WHERE id = ?").run(issueId);
    } else {
      log(`Agent exited with non-zero code ${exitCode}. Transitioning to FAILED.`);
      logActivity("agent_failed", `${agentType} failed (exit ${exitCode})`);
    }

    transition("FAILED");
    unlock();
    db.close();
    logStream.end();
    process.exit(exitCode);
  }

  // Successful exit — reset retry counter
  db.prepare("UPDATE issues SET retry_count = 0, updated_at = datetime('now') WHERE id = ?").run(issueId);
  logActivity("agent_completed", `${agentType} completed`);

  // Re-fetch issue after agent run (agent may have updated project_file_path etc.)
  let updatedIssue = getIssue();

  // Git Agent / Splitter post-processing: read prs.json and populate pr_stack.
  // The splitter replaces the old stack after it has successfully created the replacement PRs.
  if (["git-agent", "splitter"].includes(agentType) && updatedIssue.project_file_path) {
    const prsPath = path.join(path.dirname(updatedIssue.project_file_path), "prs.json");
    if (fs.existsSync(prsPath)) {
      try {
        const prs = JSON.parse(fs.readFileSync(prsPath, "utf-8"));
        if (!Array.isArray(prs) || prs.length === 0) {
          throw new Error("prs.json must contain a non-empty array");
        }
        if (agentType === "splitter") {
          db.prepare("DELETE FROM pr_stack WHERE issue_id = ?").run(issueId);
        }
        for (const pr of prs) {
          const existing = db.prepare(
            "SELECT id FROM pr_stack WHERE issue_id = ? AND gt_branch = ? LIMIT 1"
          ).get(issueId, pr.branch);
          if (existing) {
            if (pr.pr_number) db.prepare("UPDATE pr_stack SET pr_number = ?, status = 'open' WHERE id = ?").run(pr.pr_number, existing.id);
          } else {
            const prev = db.prepare("SELECT id FROM pr_stack WHERE issue_id = ? AND position = ? - 1"
            ).get(issueId, pr.position);
            db.prepare("INSERT INTO pr_stack (issue_id, gt_branch, position, pr_number, status, base_pr_id) VALUES (?, ?, ?, ?, 'open', ?)"
            ).run(issueId, pr.branch, pr.position, pr.pr_number ?? null, prev?.id ?? null);
          }
        }
        log(`Populated ${prs.length} PR(s) from prs.json`);
        fs.unlinkSync(prsPath);
      } catch (e) {
        if (agentType === "splitter") throw e;
        log(`WARN: Could not read prs.json: ${e.message}`);
      }
    } else if (agentType === "splitter") {
      throw new Error("Splitter completed without writing prs.json for the replacement stack");
    }
  }

  // Planner post-processing: detect wt_path + project_file_path
  if ((issueRow.state === "PENDING" || issueRow.state === "PLANNING") && agentType === "planner") {
    runPlannerPostProcess(updatedIssue);
    updatedIssue = getIssue();
  }

  // Plan-reviewer post-processing
  if (issueRow.state === "AI_PLAN_REVIEWING" && agentType === "plan-reviewer") {
    let result;
    try {
      result = runPlanReviewerPostProcess(updatedIssue);
    } catch (e) {
      log(`ERROR in plan-reviewer post-processing: ${e?.message ?? e}`);
      if (e?.stack) log(e.stack);
      throw e;
    }
    if (result.nextState === "AWAITING_PLAN_APPROVAL") {
      createDecision("PLAN_REVIEW", updatedIssue.project_file_path ?? String(issueId));
    }
    unlock();
    log(`Plan reviewer done. Issue #${issueId} → ${result.nextState}`);
    db.close();
    logStream.end();
    return;
  }

  // Reviewer post-processing: read verdict file, determine next state
  if (issueRow.state === "AI_REVIEWING" && agentType === "reviewer") {
    let result;
    try {
      result = runReviewerPostProcess(updatedIssue);
    } catch (e) {
      log(`ERROR in reviewer post-processing: ${e?.message ?? e}`);
      if (e?.stack) log(e.stack);
      throw e; // re-throw → main catch block logs to activity_log
    }
    // Create decision queue item if escalating to human
    if (result.nextState === "AWAITING_CODE_REVIEW") {
      const artifactRef = updatedIssue.project_file_path ?? String(issueId);
      createDecision("CODE_REVIEW", artifactRef);
    }
    unlock();
    log(`Reviewer done. Issue #${issueId} → ${result.nextState}`);
    db.close();
    logStream.end();
    return;
  }

  // Rebaser post-processing: restore the state that requested the rebase.
  if (issueRow.state === "REBASING" && agentType === "rebaser") {
    const restoreState = ["AWAITING_CODE_REVIEW", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL"].includes(updatedIssue.previous_state)
      ? updatedIssue.previous_state
      : "WATCHING_PR";
    transition(restoreState);
    unlock();
    log(`Rebaser done. Issue #${issueId} → ${restoreState}`);
    db.close();
    logStream.end();
    return;
  }

  // Cleanup mode: Git Agent cleans up worktree after DONE, then exits
  if (cleanupMode) {
    log("Cleanup mode: Git Agent will remove worktree.");
    unlock();
    db.close();
    logStream.end();
    return;
  }

  // Determine next state
  const nextState = determineNextState(issueRow.state);
  if (!nextState) {
    log(`No automatic next state for ${issueRow.state}. Leaving state unchanged.`);
    unlock();
    db.close();
    logStream.end();
    return;
  }

  transition(nextState);

  // DONE: run executive summary + self-improvement + cleanup
  if (nextState === "DONE") {
    log("Issue complete — running done post-processing.");
    // Clear any pending decisions — no longer relevant now that the issue is done
    const cleared = db.prepare(`
      UPDATE decision_queue SET verdict = 'rejected', feedback_json = '"Cleared — issue moved to DONE"', resolved_at = datetime('now')
      WHERE issue_id = ? AND verdict IS NULL
    `).run(issueId).changes;
    if (cleared > 0) log(`Cleared ${cleared} pending decision(s) — issue is DONE`);
    unlock();
    runDonePostProcess(updatedIssue);
    db.close();
    logStream.end();
    return;
  }

  // Create decision queue item if needed
  const decisionType = determineDecisionType(nextState);
  if (decisionType) {
    const artifactRef = updatedIssue.project_file_path ?? String(issueId);
    createDecision(decisionType, artifactRef);
    log(`Created ${decisionType} decision for issue #${issueId}`);
  }

  unlock();
  if (issueRow.state === "FIXING") maybeReflectFixLoop(updatedIssue);
  log(`Done. Issue #${issueId} is now ${nextState}`);

  db.close();
  logStream.end();
}

main().catch((e) => {
  const errMsg = e?.message ?? String(e);
  const errStack = e?.stack ?? errMsg;
  console.error("[forge:runner] Fatal:", errStack);

  // Write error to log file so it's visible
  try { logStream.write(`[FATAL] ${errStack}\n`); } catch {}

  try {
    db.prepare(`
      UPDATE issues SET state = 'FAILED', locked_at = NULL, agent_pid = NULL, updated_at = datetime('now')
      WHERE id = ?
    `).run(issueId);
    db.prepare(`UPDATE agent_runs SET exited_at = datetime('now'), exit_code = 1 WHERE id = ?`).run(runId);

    // Write to activity_log so the UI can surface it
    db.prepare(`
      INSERT INTO activity_log (issue_id, type, actor, message, metadata)
      VALUES (?, 'agent_error', ?, ?, ?)
    `).run(
      issueId,
      agentType ?? 'unknown',
      `${agentType ?? 'agent'} crashed: ${errMsg.slice(0, 300)}`,
      JSON.stringify({ error: errMsg, stack: errStack.slice(0, 1000) })
    );
  } catch {}

  process.exit(1);
});
