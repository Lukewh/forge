#!/usr/bin/env node
/**
 * Forge — Self-Improvement Script
 *
 * Runs after each completed issue. Reads PR review comments from GitHub
 * and extracts recurring patterns into pending learning suggestions.
 *
 * Only suggests patterns that are actionable, specific, and not already present.
 */

"use strict";

const { execFileSync, spawnSync } = require("child_process");
const path  = require("path");
const os    = require("os");
const fs    = require("fs");

const args = process.argv.slice(2);
function getArg(flag) { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; }

const issueId = parseInt(getArg("--issue-id"), 10);
if (!issueId) { console.error("Missing --issue-id"); process.exit(1); }

const FORGE_DIR  = process.env.FORGE_DIR || path.join(os.homedir(), ".pi", "agent", "extensions", "forge");
const DB_FILE    = process.env.FORGE_DB_PATH || path.join(FORGE_DIR, "forge.db");
const CODER_PROMPT = path.join(FORGE_DIR, "agents", "coder.md");
const Database   = require(path.join(FORGE_DIR, "node_modules", "better-sqlite3"));
const db         = new Database(DB_FILE, { readonly: true });

const issue   = db.prepare("SELECT wt_path FROM issues WHERE id = ?").get(issueId);
const wtPath  = issue?.wt_path;
const prStack = db.prepare("SELECT * FROM pr_stack WHERE issue_id = ? AND pr_number IS NOT NULL").all(issueId);
db.close();

if (prStack.length === 0) {
  console.log("[forge:self-improve] No PRs to analyse.");
  process.exit(0);
}

// ── Collect all review comments ───────────────────────────────────────

const allComments = [];

for (const pr of prStack) {
  try {
    const raw = execFileSync("gh", [
      "pr", "view", String(pr.pr_number),
      "--json", "reviews,comments",
    ], { encoding: "utf-8", timeout: 15000, cwd: wtPath || undefined });

    const data = JSON.parse(raw);
    const reviews  = (data.reviews  ?? []).filter(r => r.body?.trim());
    const comments = (data.comments ?? []).filter(c => c.body?.trim());

    for (const r of reviews)  allComments.push(r.body);
    for (const c of comments) allComments.push(c.body);
  } catch (e) {
    console.warn(`[forge:self-improve] Could not fetch PR #${pr.pr_number}: ${e.message}`);
  }
}

if (allComments.length === 0) {
  console.log("[forge:self-improve] No review comments found.");
  process.exit(0);
}

// ── Extract patterns using pi SDK runner ──────────────────────────────

const coderPromptContent = fs.existsSync(CODER_PROMPT)
  ? fs.readFileSync(CODER_PROMPT, "utf-8")
  : "";

const prompt = `You are analysing code review comments from a completed pull request to extract reusable coding conventions.

Here are the review comments from this PR:

${allComments.map((c, i) => `--- Comment ${i + 1} ---\n${c}`).join("\n\n")}

Current Coder agent conventions (do NOT duplicate these):
${coderPromptContent}

Your task:
1. Identify patterns in the review comments that represent recurring, actionable coding conventions
2. Only extract patterns that are specific enough to be useful as a rule (e.g. "Always use X pattern for Y", "Never do Z because...")
3. Skip comments that are one-off, subjective, or already covered in the existing conventions
4. Format each pattern as a single bullet point starting with "- "
5. If there are no new useful patterns, output exactly: NO_NEW_PATTERNS

Output ONLY the bullet points (or NO_NEW_PATTERNS). No explanations, no headers.`;

let patterns = "";
try {
  const tmpPromptPath = path.join(os.tmpdir(), `forge-improve-${Date.now()}.txt`);
  fs.writeFileSync(tmpPromptPath, prompt, "utf-8");

  const model = (() => {
    try {
      const settingsDb = new (require(path.join(FORGE_DIR, "node_modules", "better-sqlite3")))(
        DB_FILE, { readonly: true }
      );
      const row = settingsDb.prepare("SELECT value FROM settings WHERE key = 'model'").get();
      settingsDb.close();
      return row?.value ?? "anthropic-vertex/sonnet-4-6";
    } catch { return "anthropic-vertex/sonnet-4-6"; }
  })();

  const result = spawnSync(process.execPath, [
    path.join(FORGE_DIR, "pi-sdk-runner.mjs"),
    "--cwd", wtPath || FORGE_DIR,
    "--model", model,
    "--prompt-file", tmpPromptPath,
  ], {
    encoding: "utf-8",
    timeout: 60000,
    maxBuffer: 2 * 1024 * 1024,
    env: { ...process.env, FORGE_DIR, FORGE_DB_PATH: DB_FILE },
  });

  fs.unlinkSync(tmpPromptPath);
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error((result.stderr || `pi SDK runner exited ${result.status}`).trim());

  for (const line of (result.stdout || "").split("\n")) {
    if (!line.trim()) continue;
    try {
      const event = JSON.parse(line);
      if (event.type === "text_delta" && typeof event.delta === "string") patterns += event.delta;
      else if (event.type === "assistant" && event.message?.content) {
        for (const block of event.message.content) if (block.type === "text") patterns += block.text;
      }
    } catch {
      patterns += line;
    }
  }
  patterns = patterns.trim();
} catch (e) {
  console.warn(`[forge:self-improve] Could not run pi SDK runner for pattern extraction: ${e.message}`);
  process.exit(0);
}

if (!patterns || patterns.trim() === "NO_NEW_PATTERNS") {
  console.log("[forge:self-improve] No new patterns to add.");
  process.exit(0);
}

// ── Queue suggestions for approval ───────────────────────────────────

const writeDb = new Database(DB_FILE);
writeDb.exec(`
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
const insert = writeDb.prepare(`
  INSERT INTO learning_suggestions (issue_id, target, suggestion, rationale, evidence_json, confidence)
  VALUES (?, 'agents/coder.md', ?, 'Extracted from PR review comments by self-improve.js', ?, 'medium')
`);
const lines = patterns.split("\n").map(l => l.trim()).filter(l => l.startsWith("- "));
const txn = writeDb.transaction(() => {
  for (const line of lines) insert.run(issueId, line.replace(/^-\s*/, ""), JSON.stringify(allComments.slice(0, 20)));
});
txn();
writeDb.close();
console.log(`[forge:self-improve] Queued ${lines.length} pending coder learning suggestion(s)`);
