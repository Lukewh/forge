#!/usr/bin/env node
/**
 * Forge — Reflection / Continuous Learning
 *
 * Builds a retrospective from issue history, PR comments, steering, decisions,
 * and agent runs. Stores structured learning events and pending suggestions.
 */

"use strict";

const { execFileSync, spawnSync } = require("child_process");
const path = require("path");
const os = require("os");
const fs = require("fs");

const args = process.argv.slice(2);
function getArg(flag, fallback = null) {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : fallback;
}
function hasFlag(flag) { return args.includes(flag); }

const issueId = parseInt(getArg("--issue-id"), 10);
const trigger = getArg("--trigger", "manual");
const force = hasFlag("--force");
if (!issueId) { console.error("Missing --issue-id"); process.exit(1); }

const FORGE_DIR = process.env.FORGE_DIR || path.join(os.homedir(), ".pi", "agent", "extensions", "forge");
const DB_FILE = process.env.FORGE_DB_PATH || path.join(FORGE_DIR, "forge.db");
const PROJECT_DIR = path.join(FORGE_DIR, "projects", String(issueId));
const REFLECTOR_PROMPT = path.join(FORGE_DIR, "agents", "reflector.md");
const Database = require(path.join(FORGE_DIR, "node_modules", "better-sqlite3"));
const db = new Database(DB_FILE);
db.pragma("busy_timeout = 5000");

function ensureSchema() {
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
  `);
}
ensureSchema();

const issue = db.prepare("SELECT * FROM issues WHERE id = ?").get(issueId);
if (!issue) { console.error(`Issue #${issueId} not found`); process.exit(1); }

if (!force) {
  const recent = db.prepare(`
    SELECT id FROM learning_events
    WHERE issue_id = ? AND trigger = ? AND created_at > datetime('now', '-6 hours')
    LIMIT 1
  `).get(issueId, trigger);
  if (recent) {
    console.log(`[forge:reflect] Reflection for trigger '${trigger}' was run recently; skipping.`);
    db.close();
    process.exit(0);
  }
}

const prStack = db.prepare("SELECT * FROM pr_stack WHERE issue_id = ? ORDER BY position ASC").all(issueId);
const decisions = db.prepare("SELECT * FROM decision_queue WHERE issue_id = ? ORDER BY created_at ASC").all(issueId);
const runs = db.prepare("SELECT * FROM agent_runs WHERE issue_id = ? ORDER BY started_at ASC, id ASC").all(issueId);
const activity = db.prepare("SELECT * FROM activity_log WHERE issue_id = ? ORDER BY created_at ASC, id ASC").all(issueId);
const settings = Object.fromEntries(db.prepare("SELECT key, value FROM settings").all().map(s => [s.key, s.value]));

function safeRead(file, max = 20000) {
  try {
    if (!file || !fs.existsSync(file)) return "";
    const text = fs.readFileSync(file, "utf-8");
    return text.length > max ? `${text.slice(0, max)}\n...[truncated]` : text;
  } catch { return ""; }
}

function logTail(run, max = 3000) {
  const text = safeRead(run.log_path, max * 2);
  return text.length > max ? text.slice(-max) : text;
}

function collectPrComments() {
  const comments = [];
  for (const pr of prStack.filter(p => p.pr_number)) {
    try {
      const raw = execFileSync("gh", ["pr", "view", String(pr.pr_number), "--json", "reviews,comments"], {
        encoding: "utf-8",
        timeout: 15000,
        cwd: issue.wt_path || undefined,
      });
      const data = JSON.parse(raw);
      for (const r of data.reviews ?? []) if (r.body?.trim()) comments.push({ pr: pr.pr_number, type: "review", body: r.body.trim() });
      for (const c of data.comments ?? []) if (c.body?.trim()) comments.push({ pr: pr.pr_number, type: "comment", body: c.body.trim() });
    } catch (e) {
      comments.push({ pr: pr.pr_number, type: "fetch_error", body: e.message });
    }
  }
  return comments;
}

const fixerRuns = runs.filter(r => r.agent_type === "fixer").length;
const rejectedFixes = decisions.filter(d => d.type === "FIX_APPROVAL" && d.verdict === "rejected").length;
const failedRuns = runs.filter(r => r.exit_code && r.exit_code !== 0).length;
const steeringEvents = activity.filter(a => a.type === "steered" || /steer/i.test(a.message ?? ""));
const prComments = collectPrComments();
const latestFailedLogs = runs.filter(r => r.exit_code && r.exit_code !== 0).slice(-3).map(r => ({ agent_type: r.agent_type, tail: logTail(r) }));
const plan = safeRead(issue.project_file_path, 30000);
const summary = safeRead(path.join(PROJECT_DIR, "summary.md"), 15000);

const context = {
  trigger,
  issue: {
    id: issue.id,
    linear_id: issue.linear_id,
    title: issue.title,
    state: issue.state,
    previous_state: issue.previous_state,
    wt_path: issue.wt_path,
  },
  metrics: {
    pr_count: prStack.length,
    fixer_runs: fixerRuns,
    rejected_fix_decisions: rejectedFixes,
    failed_runs: failedRuns,
    total_runs: runs.length,
    decision_count: decisions.length,
    steering_count: steeringEvents.length,
  },
  pr_stack: prStack,
  decisions,
  runs: runs.map(r => ({ id: r.id, agent_type: r.agent_type, started_at: r.started_at, exited_at: r.exited_at, exit_code: r.exit_code })),
  activity,
  steering_events: steeringEvents,
  pr_comments: prComments,
  latest_failed_logs: latestFailedLogs,
  project_plan_md: plan,
  existing_summary_md: summary,
};

const systemPrompt = safeRead(REFLECTOR_PROMPT, 12000) || "You are Forge's reflection agent. Output valid JSON only.";
const userPrompt = `Analyze this Forge issue and produce the JSON reflection.\n\nContext:\n${JSON.stringify(context, null, 2)}`;

function getModel() {
  return settings.model || "anthropic-vertex/sonnet-4-6";
}

function extractRunnerText(stdout) {
  let text = "";
  for (const line of String(stdout || "").split("\n")) {
    if (!line.trim()) continue;
    try {
      const event = JSON.parse(line);
      if (event.type === "text_delta" && typeof event.delta === "string") text += event.delta;
      else if (event.type === "assistant" && event.message?.content) {
        for (const block of event.message.content) if (block.type === "text") text += block.text;
      }
    } catch {
      text += line;
    }
  }
  return text.trim();
}

let raw = "";
try {
  fs.mkdirSync(PROJECT_DIR, { recursive: true });
  const promptFile = path.join(PROJECT_DIR, `reflection-${Date.now()}-prompt.txt`);
  const systemPromptFile = path.join(PROJECT_DIR, `reflection-${Date.now()}-system.txt`);
  fs.writeFileSync(promptFile, userPrompt, "utf-8");
  fs.writeFileSync(systemPromptFile, systemPrompt, "utf-8");

  const result = spawnSync(process.execPath, [
    path.join(FORGE_DIR, "pi-sdk-runner.mjs"),
    "--cwd", PROJECT_DIR,
    "--system-prompt", systemPromptFile,
    "--model", getModel(),
    "--prompt-file", promptFile,
  ], {
    encoding: "utf-8",
    timeout: 90000,
    maxBuffer: 1024 * 1024 * 8,
    env: { ...process.env, FORGE_DIR, FORGE_DB_PATH: DB_FILE },
  });
  try { fs.unlinkSync(promptFile); } catch {}
  try { fs.unlinkSync(systemPromptFile); } catch {}

  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error((result.stderr || `pi SDK runner exited ${result.status}`).trim());
  raw = extractRunnerText(result.stdout);
} catch (e) {
  console.warn(`[forge:reflect] Could not run pi SDK runner: ${e.message}`);
  db.close();
  process.exit(0);
}

function parseJson(text) {
  try { return JSON.parse(text); } catch {}
  const match = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
  if (match) return JSON.parse(match[1]);
  throw new Error("No JSON object found in reflector output");
}

let reflection;
try {
  reflection = parseJson(raw);
} catch (e) {
  console.warn(`[forge:reflect] Invalid reflection JSON: ${e.message}`);
  fs.mkdirSync(PROJECT_DIR, { recursive: true });
  fs.writeFileSync(path.join(PROJECT_DIR, `reflection-${Date.now()}-raw.txt`), raw, "utf-8");
  db.close();
  process.exit(0);
}

fs.mkdirSync(PROJECT_DIR, { recursive: true });
const outPath = path.join(PROJECT_DIR, `reflection-${new Date().toISOString().replace(/[:.]/g, "-")}.md`);
const md = [
  `# Reflection — issue #${issueId}`,
  "",
  `Trigger: ${trigger}`,
  "",
  `## Summary\n${reflection.summary ?? ""}`,
  "",
  `## Diagnosis\n${reflection.diagnosis ?? ""}`,
  "",
  "## Root causes",
  ...(reflection.root_causes ?? []).map(x => `- ${x}`),
  "",
  "## What worked",
  ...(reflection.what_worked ?? []).map(x => `- ${x}`),
  "",
  "## What failed",
  ...(reflection.what_failed ?? []).map(x => `- ${x}`),
  "",
  "## Suggestions",
  ...(reflection.suggestions ?? []).map(s => `- **${s.target ?? "unknown"}** (${s.confidence ?? "medium"}): ${s.suggestion ?? ""}\n  - ${s.rationale ?? ""}`),
  reflection.should_pause ? `\n## Pause recommended\n${reflection.pause_reason ?? ""}` : "",
].join("\n");
fs.writeFileSync(outPath, md, "utf-8");

const insertEvent = db.prepare(`
  INSERT INTO learning_events (issue_id, source, agent_type, trigger, summary, raw_context_json)
  VALUES (?, ?, ?, ?, ?, ?)
`);
const insertSuggestion = db.prepare(`
  INSERT INTO learning_suggestions (issue_id, target, suggestion, rationale, evidence_json, confidence)
  VALUES (?, ?, ?, ?, ?, ?)
`);
const logActivity = db.prepare(`
  INSERT INTO activity_log (issue_id, type, actor, message, metadata)
  VALUES (?, 'learning_reflection', 'reflector', ?, ?)
`);

const txn = db.transaction(() => {
  insertEvent.run(issueId, "reflection", null, trigger, reflection.summary ?? reflection.diagnosis ?? "Reflection completed", JSON.stringify({ reflection, metrics: context.metrics, output_path: outPath }));
  for (const s of reflection.suggestions ?? []) {
    if (!s?.suggestion || !s?.target) continue;
    insertSuggestion.run(issueId, s.target, s.suggestion, s.rationale ?? null, JSON.stringify(s.evidence ?? []), s.confidence ?? "medium");
  }
  logActivity.run(issueId, `Reflection completed (${trigger}); ${(reflection.suggestions ?? []).length} suggestion(s) queued`, JSON.stringify({ output_path: outPath, should_pause: !!reflection.should_pause }));
});
txn();

if (reflection.should_pause && trigger === "fix-loop") {
  db.prepare(`
    UPDATE issues
    SET previous_state = state, state = 'PAUSED', locked_at = NULL, agent_pid = NULL, updated_at = datetime('now')
    WHERE id = ? AND state NOT IN ('DONE','PAUSED','IGNORED')
  `).run(issueId);
  db.prepare(`
    INSERT INTO activity_log (issue_id, type, actor, message, metadata)
    VALUES (?, 'paused', 'reflector', ?, ?)
  `).run(issueId, `Paused after reflection: ${reflection.pause_reason ?? "fix loop needs human attention"}`, JSON.stringify({ trigger }));
}

db.close();
console.log(`[forge:reflect] Wrote ${outPath}; queued ${(reflection.suggestions ?? []).length} suggestion(s).`);
