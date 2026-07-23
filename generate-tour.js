#!/usr/bin/env node
/**
 * Forge — Review Tour Generator
 *
 * Spawned by the dashboard when a code review is opened.
 * Reads the diff + plan, asks the LLM to explain the changes file-by-file,
 * stores the result in review_tours table.
 *
 * Usage: node generate-tour.js --issue-id <id>
 */

"use strict";

const { execFileSync, spawnSync } = require("child_process");
const path  = require("path");
const os    = require("os");
const fs    = require("fs");

const args = process.argv.slice(2);
function getArg(f) { const i = args.indexOf(f); return i !== -1 ? args[i + 1] : null; }

const issueId = parseInt(getArg("--issue-id"), 10);
if (!issueId) { console.error("Missing --issue-id"); process.exit(1); }

const FORGE_DIR = process.env.FORGE_DIR || __dirname || path.join(os.homedir(), ".pi", "agent", "extensions", "forge");
const DB_FILE   = process.env.FORGE_DB_PATH || path.join(FORGE_DIR, "forge.db");
const Database  = require(path.join(FORGE_DIR, "node_modules", "better-sqlite3"));
const db        = new Database(DB_FILE);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ── Check if tour already exists ──────────────────────────────────────

const existing = db.prepare("SELECT tour_json FROM review_tours WHERE issue_id = ?").get(issueId);
if (existing) {
  console.log("[forge:tour] Tour already exists for issue", issueId);
  db.close();
  process.exit(0);
}

// ── Fetch issue + diff ────────────────────────────────────────────────

const issue = db.prepare("SELECT * FROM issues WHERE id = ?").get(issueId);
if (!issue) { console.error("Issue not found"); db.close(); process.exit(1); }

const getSetting = (k) => db.prepare("SELECT value FROM settings WHERE key = ?").get(k)?.value;
const model = getSetting("model") || "anthropic-vertex/sonnet-4-6";
const wtPath = issue.wt_path;

function normalizeBaseBranch(baseBranch) {
  return String(baseBranch || "main")
    .trim()
    .replace(/^refs\/remotes\/origin\//, "")
    .replace(/^origin\//, "")
    .replace(/^refs\/heads\//, "") || "main";
}

// Get the diff. In Forge, `main` means the freshly-fetched remote main ref;
// local main may be stale or checked out elsewhere.
let diff = "";
if (wtPath && fs.existsSync(wtPath)) {
  let baseBranch = "main";
  if (issue.project_file_path && fs.existsSync(issue.project_file_path)) {
    const m = fs.readFileSync(issue.project_file_path, "utf-8").match(/^base-branch:\s*(.+)$/m);
    if (m) baseBranch = normalizeBaseBranch(m[1]);
  }
  const baseRef = `refs/remotes/origin/${normalizeBaseBranch(baseBranch)}`;
  try {
    execFileSync("git", ["fetch", "--prune", "origin", `+refs/heads/${normalizeBaseBranch(baseBranch)}:${baseRef}`], {
      cwd: wtPath, encoding: "utf-8", timeout: 30000,
    });
    diff = execFileSync("git", ["diff", `${baseRef}...HEAD`, "--"], {
      cwd: wtPath, encoding: "utf-8", maxBuffer: 5 * 1024 * 1024,
    });
  } catch (e) {
    console.warn("[forge:tour] Could not get diff:", e.message);
  }
}

if (!diff.trim()) {
  db.prepare("INSERT OR REPLACE INTO review_tours (issue_id, tour_json) VALUES (?, ?)").run(
    issueId, JSON.stringify({ overall: "No changes detected.", files: [] })
  );
  db.close();
  process.exit(0);
}

// ── Read plan ─────────────────────────────────────────────────────────

let planContent = "";
if (issue.project_file_path && fs.existsSync(issue.project_file_path)) {
  planContent = fs.readFileSync(issue.project_file_path, "utf-8").slice(0, 4000);
}

// Truncate diff if too large
const MAX_DIFF = 12000;
const diffTruncated = diff.length > MAX_DIFF;
const diffForPrompt = diffTruncated ? diff.slice(0, MAX_DIFF) + "\n\n[diff truncated]" : diff;

// ── Build prompt ──────────────────────────────────────────────────────

const prompt = `You are a senior engineer reviewing a pull request. Analyse the following code diff and produce a structured tour that helps a reviewer understand the changes quickly.

${planContent ? `## Implementation plan\n${planContent}\n\n` : ""}## Diff\n${diffForPrompt}

Respond with ONLY valid JSON matching this exact schema — no explanation, no markdown fences:
{
  "overall": "<1-2 sentence summary of the entire change>",
  "files": [
    {
      "path": "<file path>",
      "summary": "<2-3 sentences: what changed in this file and why, referencing the plan>",
      "highlights": [
        { "line": <approximate line number in the diff>, "note": "<specific insight about this change>" }
      ]
    }
  ]
}

Guidelines:
- Be specific — reference function names, variable names, patterns used
- Relate changes back to the plan where possible
- Highlights should point to the most important or non-obvious lines
- Keep summaries concise but informative
- Omit files with trivial changes (whitespace, imports only) unless they're important`;

// ── Call pi ───────────────────────────────────────────────────────────

let tourJson = { overall: "Could not generate tour.", files: [] };

try {
  const promptFile = path.join(os.tmpdir(), `forge-tour-${issueId}-${Date.now()}.txt`);
  fs.writeFileSync(promptFile, prompt, "utf-8");

  const runnerPath = path.join(FORGE_DIR, "pi-sdk-runner.mjs");
  const result = spawnSync(process.execPath, [
    runnerPath,
    "--cwd", wtPath || FORGE_DIR,
    "--model", model,
    "--prompt-file", promptFile,
  ], {
    encoding: "utf-8",
    timeout: 120000,
    maxBuffer: 4 * 1024 * 1024,
    env: { ...process.env, FORGE_DIR },
  });
  try { fs.unlinkSync(promptFile); } catch {}

  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error((result.stderr || `pi SDK runner exited ${result.status}`).trim());

  let raw = "";
  for (const line of (result.stdout || "").split("\n")) {
    if (!line.trim()) continue;
    try {
      const event = JSON.parse(line);
      if (event.type === "text_delta" && typeof event.delta === "string") raw += event.delta;
      else if (event.type === "assistant" && event.message?.content) {
        for (const block of event.message.content) if (block.type === "text") raw += block.text;
      }
    } catch {
      raw += line;
    }
  }

  // Extract JSON from response (might have surrounding text)
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("LLM response did not contain JSON");
  tourJson = JSON.parse(jsonMatch[0]);
} catch (e) {
  console.warn("[forge:tour] LLM call failed:", e.message);
  tourJson = { overall: `Could not generate tour: ${e.message}`, files: [] };
}

// ── Store ─────────────────────────────────────────────────────────────

db.prepare("INSERT OR REPLACE INTO review_tours (issue_id, tour_json) VALUES (?, ?)").run(
  issueId, JSON.stringify(tourJson)
);

console.log("[forge:tour] Tour generated for issue", issueId, "—", tourJson.files?.length ?? 0, "file(s)");
db.close();
