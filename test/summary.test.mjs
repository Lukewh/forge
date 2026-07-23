/**
 * Forge — generate-summary.js tests
 */

import { test, describe, beforeEach, afterEach } from "node:test";
import assert  from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join }  from "node:path";
import { tmpdir } from "node:os";
import { makeTempDB, FORGE_DIR } from "./helpers.mjs";

const SUMMARY_SCRIPT = join(FORGE_DIR, "generate-summary.js");

let ctx, tmpProjectDir;

beforeEach(() => {
  ctx = makeTempDB();
  tmpProjectDir = join(tmpdir(), `forge-summary-${Date.now()}`);
  mkdirSync(tmpProjectDir, { recursive: true });
});

afterEach(() => {
  ctx.cleanup();
  try { rmSync(tmpProjectDir, { recursive: true, force: true }); } catch {}
});

function runSummary(issueId, dbPath) {
  return execFileSync(process.execPath, [SUMMARY_SCRIPT, "--issue-id", String(issueId)], {
    encoding: "utf-8",
    timeout: 15000,
    env: { ...process.env, FORGE_DB_PATH: dbPath },
  });
}

function createFullIssue(db) {
  const issue = db.createIssue({
    source:   "linear",
    linearId: "BAND-999",
    title:    "Test summary issue",
    priority: 2,
  });

  // Create project file
  const planPath = join(tmpProjectDir, "plan.md");
  writeFileSync(planPath, [
    "---",
    "linear-id: BAND-999",
    "pr-url:",
    "base-branch: main",
    "---",
    "This is a test issue summary.",
    "",
    "# PR Stack",
    "## PR 1 — Schema changes",
    "**Scope:** Add new column",
    "- [x] Add migration",
    "",
    "# TODO",
    "- [x] Add migration",
    "",
    "# Decisions Made",
    "Used a separate migration file for clarity.",
    "",
    "# Log",
    "## Plan created",
    `*${new Date().toISOString()}*`,
    "Plan was created.",
  ].join("\n"), "utf-8");

  db.updateIssue(issue.id, { project_file_path: planPath });

  // Add PR stack
  const pr1 = db.addPr({ issueId: issue.id, gtBranch: "lwh/BAND-999-schema", position: 1 });
  db.updatePr(pr1.id, { pr_number: 101, status: "merged" });

  // Add decisions
  const d1 = db.createDecision({ issueId: issue.id, type: "PLAN_REVIEW",  artifactRef: planPath });
  const d2 = db.createDecision({ issueId: issue.id, type: "CODE_REVIEW",  artifactRef: planPath });
  const d3 = db.createDecision({ issueId: issue.id, type: "FIX_APPROVAL", artifactRef: planPath });
  db.resolveDecision(d1.id, "approved");
  db.resolveDecision(d2.id, "approved");
  db.resolveDecision(d3.id, "rejected", JSON.stringify("Needs more tests"));

  // Add agent runs
  const r1 = db.startAgentRun(issue.id, "planner");
  const r2 = db.startAgentRun(issue.id, "coder");
  db.finishAgentRun(r1.id, 0);
  db.finishAgentRun(r2.id, 0);

  db.transitionState(issue.id, "DONE");

  return issue;
}

// ── Tests ─────────────────────────────────────────────────────────────

describe("generate-summary.js", () => {
  test("exits with error when --issue-id is missing", () => {
    assert.throws(() => {
      execFileSync(process.execPath, [SUMMARY_SCRIPT], {
        encoding: "utf-8",
        timeout: 5000,
        env: { ...process.env, FORGE_DB_PATH: ctx.dbPath },
      });
    });
  });

  test("exits with error when issue not found", () => {
    assert.throws(() => runSummary(99999, ctx.dbPath));
  });

  test("generates summary.md for a complete issue", () => {
    const { db, dbPath } = ctx;
    const issue = createFullIssue(db);

    runSummary(issue.id, dbPath);

    const summaryPath = join(FORGE_DIR, "projects", String(issue.id), "summary.md");
    assert.ok(existsSync(summaryPath), "summary.md should exist");

    const content = readFileSync(summaryPath, "utf-8");
    assert.ok(content.includes("Test summary issue"), "Should include issue title");

    // Cleanup
    try { rmSync(join(FORGE_DIR, "projects", String(issue.id)), { recursive: true, force: true }); } catch {}
  });

  test("summary includes PR stack section", () => {
    const { db, dbPath } = ctx;
    const issue = createFullIssue(db);
    runSummary(issue.id, dbPath);

    const summaryPath = join(FORGE_DIR, "projects", String(issue.id), "summary.md");
    const content = readFileSync(summaryPath, "utf-8");
    assert.ok(content.includes("PR Stack"), "Should have PR Stack section");
    assert.ok(content.includes("lwh/BAND-999-schema"), "Should include branch name");

    try { rmSync(join(FORGE_DIR, "projects", String(issue.id)), { recursive: true, force: true }); } catch {}
  });

  test("summary includes review round counts", () => {
    const { db, dbPath } = ctx;
    const issue = createFullIssue(db);
    runSummary(issue.id, dbPath);

    const summaryPath = join(FORGE_DIR, "projects", String(issue.id), "summary.md");
    const content = readFileSync(summaryPath, "utf-8");
    assert.ok(content.includes("Plan reviews: 1"),  "Should count plan reviews");
    assert.ok(content.includes("Code reviews: 1"),  "Should count code reviews");
    assert.ok(content.includes("Fix approval"), "Should include fix approvals");

    try { rmSync(join(FORGE_DIR, "projects", String(issue.id)), { recursive: true, force: true }); } catch {}
  });

  test("summary includes agent run summary", () => {
    const { db, dbPath } = ctx;
    const issue = createFullIssue(db);
    runSummary(issue.id, dbPath);

    const summaryPath = join(FORGE_DIR, "projects", String(issue.id), "summary.md");
    const content = readFileSync(summaryPath, "utf-8");
    assert.ok(content.includes("planner"), "Should include planner runs");
    assert.ok(content.includes("coder"),   "Should include coder runs");

    try { rmSync(join(FORGE_DIR, "projects", String(issue.id)), { recursive: true, force: true }); } catch {}
  });

  test("summary includes decisions section from plan file", () => {
    const { db, dbPath } = ctx;
    const issue = createFullIssue(db);
    runSummary(issue.id, dbPath);

    const summaryPath = join(FORGE_DIR, "projects", String(issue.id), "summary.md");
    const content = readFileSync(summaryPath, "utf-8");
    assert.ok(content.includes("Used a separate migration"), "Should include Decisions Made content");

    try { rmSync(join(FORGE_DIR, "projects", String(issue.id)), { recursive: true, force: true }); } catch {}
  });

  test("summary includes linear URL when linear_id is set", () => {
    const { db, dbPath } = ctx;
    const issue = createFullIssue(db);
    runSummary(issue.id, dbPath);

    const summaryPath = join(FORGE_DIR, "projects", String(issue.id), "summary.md");
    const content = readFileSync(summaryPath, "utf-8");
    assert.ok(content.includes("BAND-999"), "Should include linear ID");

    try { rmSync(join(FORGE_DIR, "projects", String(issue.id)), { recursive: true, force: true }); } catch {}
  });

  test("summary works when no project file exists", () => {
    const { db, dbPath } = ctx;
    const issue = db.createIssue({ source: "manual", title: "No plan file" });
    db.transitionState(issue.id, "DONE");

    runSummary(issue.id, dbPath);

    const summaryPath = join(FORGE_DIR, "projects", String(issue.id), "summary.md");
    const content = readFileSync(summaryPath, "utf-8");
    assert.ok(content.includes("No plan file"), "Should still include title");

    try { rmSync(join(FORGE_DIR, "projects", String(issue.id)), { recursive: true, force: true }); } catch {}
  });
});
