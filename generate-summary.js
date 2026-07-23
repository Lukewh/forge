#!/usr/bin/env node
/**
 * Forge — Executive Summary Generator
 *
 * Runs at DONE. Reads SQLite + markdown files, writes summary.md
 * to projects/{issueId}/summary.md
 */

"use strict";

const path = require("path");
const os   = require("os");
const fs   = require("fs");

const args = process.argv.slice(2);
function getArg(flag) { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; }

const issueId = parseInt(getArg("--issue-id"), 10);
if (!issueId) { console.error("Missing --issue-id"); process.exit(1); }

const FORGE_DIR = path.join(os.homedir(), ".pi", "agent", "extensions", "forge");
const Database  = require(path.join(FORGE_DIR, "node_modules", "better-sqlite3"));
const DB_FILE   = process.env.FORGE_DB_PATH || path.join(FORGE_DIR, "forge.db");
const db        = new Database(DB_FILE, { readonly: true });

function q(sql, ...params) { return db.prepare(sql).all(...params); }
function qOne(sql, ...params) { return db.prepare(sql).get(...params); }

const issue     = qOne("SELECT * FROM issues WHERE id = ?", issueId);
if (!issue) { console.error(`Issue #${issueId} not found`); process.exit(1); }

const prStack   = q("SELECT * FROM pr_stack WHERE issue_id = ? ORDER BY position ASC", issueId);
const decisions = q("SELECT * FROM decision_queue WHERE issue_id = ? ORDER BY created_at ASC", issueId);
const agentRuns = q("SELECT * FROM agent_runs WHERE issue_id = ? ORDER BY started_at ASC", issueId);

// ── Parse project file ────────────────────────────────────────────────

let planSummary = "";
let decisionsSection = "";

if (issue.project_file_path && fs.existsSync(issue.project_file_path)) {
  const content = fs.readFileSync(issue.project_file_path, "utf-8");

  // Extract summary (text between frontmatter and first #)
  const summaryMatch = content.match(/---\n[\s\S]*?---\n([\s\S]*?)(?=\n#|\s*$)/);
  planSummary = summaryMatch?.[1]?.trim() ?? "";

  // Extract Decisions Made section
  const decisionsMatch = content.match(/# Decisions Made\n([\s\S]*?)(?=\n# |\s*$)/);
  decisionsSection = decisionsMatch?.[1]?.trim() ?? "";
}

// ── Calculate timing ──────────────────────────────────────────────────

const started = new Date(issue.created_at);
const done    = new Date();
const diffMs  = done - started;
const hours   = Math.floor(diffMs / 3600000);
const minutes = Math.floor((diffMs % 3600000) / 60000);
const duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

// ── Count plan review rounds ──────────────────────────────────────────

const planReviews  = decisions.filter(d => d.type === "PLAN_REVIEW");
const codeReviews  = decisions.filter(d => d.type === "CODE_REVIEW");
const fixApprovals = decisions.filter(d => d.type === "FIX_APPROVAL");

// ── PR links ──────────────────────────────────────────────────────────

const prLines = prStack.length > 0
  ? prStack.map(pr => {
      const repo = db.prepare("SELECT value FROM settings WHERE key = 'github_repo'").get()?.value ?? "";
      const num = pr.pr_number ? repo.trim() ? ` — [#${pr.pr_number}](https://github.com/${repo}/pull/${pr.pr_number})` : ` — #${pr.pr_number}` : " — (no PR created)";
      return `- PR ${pr.position}: \`${pr.gt_branch}\` [${pr.status}]${num}`;
    }).join("\n")
  : "No PRs created.";

// ── Agent run summary ─────────────────────────────────────────────────

const agentSummary = Object.entries(
  agentRuns.reduce((acc, r) => {
    acc[r.agent_type] = (acc[r.agent_type] ?? 0) + 1;
    return acc;
  }, {})
).map(([type, count]) => `- ${type}: ${count} run${count !== 1 ? "s" : ""}`).join("\n");

// ── Assemble summary ──────────────────────────────────────────────────

const now = new Date().toISOString();
const linearUrl = issue.linear_id
  ? `https://linear.app/issue/${issue.linear_id}`
  : null;

const summary = [
  `# Executive Summary — ${issue.title}`,
  "",
  `**Completed:** ${now}`,
  `**Total time:** ${duration}`,
  issue.linear_id ? `**Linear:** [${issue.linear_id}](${linearUrl})` : "",
  "",
  "## Summary",
  planSummary || "_No plan summary available._",
  "",
  "## PR Stack",
  prLines,
  "",
  "## Decisions Made",
  decisionsSection || "_No decisions recorded._",
  "",
  "## Review Rounds",
  `- Plan reviews: ${planReviews.length}`,
  `- Code reviews: ${codeReviews.length}`,
  `- Fix approval rounds: ${fixApprovals.length}`,
  "",
  "## Agent Runs",
  agentSummary || "_No agent runs recorded._",
  "",
  "## Timeline",
  `- Created: ${issue.created_at}`,
  `- Completed: ${now}`,
  `- Duration: ${duration}`,
].filter(l => l !== null).join("\n");

// ── Write ─────────────────────────────────────────────────────────────

const outputDir  = path.join(FORGE_DIR, "projects", String(issueId));
const outputPath = path.join(outputDir, "summary.md");
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, summary, "utf-8");

db.close();
console.log(`[forge:summary] Written to ${outputPath}`);
