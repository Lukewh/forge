/**
 * Forge — Dashboard API tests
 *
 * Starts the server against an isolated temp DB, exercises every endpoint.
 */

import { test, describe, before, after } from "node:test";
import assert   from "node:assert/strict";
import { spawn } from "node:child_process";
import { makeTempDB, FORGE_DIR } from "./helpers.mjs";
import { join }  from "node:path";
import { writeFileSync, mkdirSync, rmSync } from "node:fs";

const TEST_PORT = 13142;
const baseUrl   = `http://localhost:${TEST_PORT}`;

// ── HTTP helper ───────────────────────────────────────────────────────

async function req(method, path, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const res  = await fetch(`${baseUrl}${path}`, opts);
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }
  return { status: res.status, body: json };
}

const GET   = (path)       => req("GET",   path);
const POST  = (path, body) => req("POST",  path, body);
const PATCH = (path, body) => req("PATCH", path, body);
const PUT   = (path, body) => req("PUT",   path, body);

// ── Lifecycle ─────────────────────────────────────────────────────────

let serverProc, db, testDB;

before(async () => {
  testDB = makeTempDB();
  db     = testDB.db;

  serverProc = spawn(process.execPath, [join(FORGE_DIR, "dashboard", "server.js")], {
    env:   { ...process.env, PORT: String(TEST_PORT), FORGE_DB_PATH: testDB.dbPath },
    stdio: ["ignore", "pipe", "pipe"],
  });

  await new Promise((resolve) => {
    serverProc.stdout.on("data", (d) => {
      if (d.toString().includes("Schema ready") || d.toString().includes("URL")) resolve();
    });
    setTimeout(resolve, 2000);
  });
});

after(() => {
  serverProc?.kill();
  testDB?.cleanup();
});

// ── Desktop companion ─────────────────────────────────────────────────

describe("desktop companion notification endpoints", () => {
  test("reports direct-browser desktop notification capabilities", async () => {
    const { status, body } = await GET("/api/desktop-capabilities");
    assert.equal(status, 200);
    assert.equal(body.notifications, false);
  });

  test("desktop notify falls back gracefully when native wrapper is absent", async () => {
    const { status, body } = await POST("/api/desktop-notify", { title: "Forge", body: "Test" });
    assert.equal(status, 501);
    assert.equal(body.ok, false);
  });
});

// ── GET /api/overview ─────────────────────────────────────────────────

describe("GET /api/overview", () => {
  test("returns valid structure on empty DB", async () => {
    const { status, body } = await GET("/api/overview");
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.issues));
    assert.ok(Array.isArray(body.decisions));
    assert.ok(Array.isArray(body.runningAgents));
    assert.ok(body.scheduler);
    assert.ok(body.settings);
  });

  test("reflects enqueued issues", async () => {
    db.createIssue({ source: "manual", title: "Overview issue" });
    const { body } = await GET("/api/overview");
    assert.ok(body.issues.some(i => i.title === "Overview issue"));
  });

  test("excludes completed issues that belong in the archive", async () => {
    const issue = db.createIssue({ source: "manual", title: "Archived overview issue" });
    db.transitionState(issue.id, "DONE");
    const { body } = await GET("/api/overview");
    assert.ok(!body.issues.some(i => i.id === issue.id));
  });

  test("returns shell counters for done, archive, and failed issues", async () => {
    const doneIssue = db.createIssue({ source: "manual", title: "Done counter issue" });
    const failedIssue = db.createIssue({ source: "manual", title: "Failed counter issue" });
    db.transitionState(doneIssue.id, "DONE");
    db.transitionState(failedIssue.id, "FAILED");

    const { body } = await GET("/api/overview");

    assert.ok(body.doneThisWeekCount >= 1);
    assert.equal(body.doneThisWeek, body.doneThisWeekCount);
    assert.ok(body.archiveCount >= 1);
    assert.ok(body.failedCount >= 1);
    assert.ok(body.issues.some(i => i.id === failedIssue.id));
    assert.ok(!body.issues.some(i => i.id === doneIssue.id));
  });
});

// ── GET /api/issues ───────────────────────────────────────────────────

describe("GET /api/issues", () => {
  test("returns array", async () => {
    const { status, body } = await GET("/api/issues");
    assert.equal(status, 200);
    assert.ok(Array.isArray(body));
  });
});

// ── POST /api/issues ──────────────────────────────────────────────────

describe("POST /api/issues", () => {
  test("creates a manual issue", async () => {
    const { status, body } = await POST("/api/issues", { title: "New manual issue" });
    assert.equal(status, 200);
    assert.ok(body.ok);
    assert.ok(body.issueId > 0);
  });

  test("rejects missing title", async () => {
    const { status } = await POST("/api/issues", {});
    assert.equal(status, 400);
  });

  test("creates project file when description provided", async () => {
    const { body } = await POST("/api/issues", {
      title:       "Issue with desc",
      description: "Some description",
    });
    assert.ok(body.ok);
    const issue = db.getIssue(body.issueId);
    assert.ok(issue.project_file_path);
  });
});

// ── POST /api/linear/enqueue ───────────────────────────────────────────

describe("POST /api/linear/enqueue", () => {
  test("enqueues Linear issue with planning guidance", async () => {
    const { status, body } = await POST("/api/linear/enqueue", { linearId: "BAND-9999", planningGuidance: "Start with the pricing app" });
    assert.equal(status, 200);
    assert.ok(body.issueId);
    const issue = db["db"].prepare("SELECT * FROM issues WHERE id = ?").get(body.issueId);
    assert.equal(issue.linear_id, "BAND-9999");
    assert.match(issue.steering_context, /Start with the pricing app/);
  });
});

// ── GET /api/issues/:id ───────────────────────────────────────────────

describe("GET /api/issues/:id", () => {
  test("returns issue detail", async () => {
    const created = db.createIssue({ source: "manual", title: "Detail test" });
    const { status, body } = await GET(`/api/issues/${created.id}`);
    assert.equal(status, 200);
    assert.equal(body.issue.title, "Detail test");
    assert.ok(Array.isArray(body.prStack));
    assert.ok(Array.isArray(body.decisions));
    assert.ok(Array.isArray(body.agentRuns));
  });

  test("returns 404 for missing issue", async () => {
    const { status } = await GET("/api/issues/99999");
    assert.equal(status, 404);
  });

  test("includes planContent when project file exists", async () => {
    const issue    = db.createIssue({ source: "manual", title: "Plan content" });
    const planPath = join(FORGE_DIR, "test", "fixtures", `plan-${issue.id}.md`);
    mkdirSync(join(FORGE_DIR, "test", "fixtures"), { recursive: true });
    writeFileSync(planPath, "# Test plan\nHello world", "utf-8");
    db.updateIssue(issue.id, { project_file_path: planPath });
    const { body } = await GET(`/api/issues/${issue.id}`);
    assert.equal(body.planContent, "# Test plan\nHello world");
  });
});

// ── PATCH /api/issues/:id ─────────────────────────────────────────────

describe("PATCH /api/issues/:id", () => {
  test("pause transitions to PAUSED", async () => {
    const issue = db.createIssue({ source: "manual", title: "Pause via API" });
    db.transitionState(issue.id, "WORKING");
    const { status } = await PATCH(`/api/issues/${issue.id}`, { action: "pause" });
    assert.equal(status, 200);
    assert.equal(db.getIssue(issue.id).state, "PAUSED");
  });

  test("unpause restores previous state", async () => {
    const issue = db.createIssue({ source: "manual", title: "Unpause via API" });
    db.transitionState(issue.id, "PLANNING");
    db.pauseIssue(issue.id);
    await PATCH(`/api/issues/${issue.id}`, { action: "unpause" });
    assert.equal(db.getIssue(issue.id).state, "PLANNING");
  });

  test("steer sets steering_context without changing state", async () => {
    const issue = db.createIssue({ source: "manual", title: "Steer via API" });
    db.transitionState(issue.id, "WORKING");
    await PATCH(`/api/issues/${issue.id}`, { action: "steer", instructions: "Do X first" });
    const row = db.getIssue(issue.id);
    assert.equal(row.state,            "WORKING");   // state unchanged
    assert.equal(row.steering_context, "Do X first");
  });

  test("steer requires instructions field", async () => {
    const issue    = db.createIssue({ source: "manual", title: "Steer no instructions" });
    const { status } = await PATCH(`/api/issues/${issue.id}`, { action: "steer" });
    assert.equal(status, 400);
  });

  test("unknown action returns 400", async () => {
    const issue    = db.createIssue({ source: "manual", title: "Bad action" });
    const { status } = await PATCH(`/api/issues/${issue.id}`, { action: "explode" });
    assert.equal(status, 400);
  });

  test("returns 404 for missing issue", async () => {
    const { status } = await PATCH("/api/issues/99999", { action: "pause" });
    assert.equal(status, 404);
  });
});

// ── GET /api/decisions ────────────────────────────────────────────────

describe("GET /api/decisions", () => {
  test("returns pending decisions enriched with issue title", async () => {
    const issue = db.createIssue({ source: "manual", title: "Decisions test" });
    db.createDecision({ issueId: issue.id, type: "PLAN_REVIEW", artifactRef: "/" });
    const { status, body } = await GET("/api/decisions");
    assert.equal(status, 200);
    const d = body.find(d => d.issue_id === issue.id);
    assert.ok(d);
    assert.equal(d.issueTitle, "Decisions test");
  });

  test("excludes resolved decisions", async () => {
    const issue = db.createIssue({ source: "manual", title: "Resolved" });
    const d     = db.createDecision({ issueId: issue.id, type: "CODE_REVIEW", artifactRef: "/" });
    db.resolveDecision(d.id, "approved");
    const { body } = await GET("/api/decisions");
    assert.ok(!body.some(dec => dec.id === d.id));
  });
});

// ── POST /api/decisions/:id/resolve ──────────────────────────────────

describe("POST /api/decisions/:id/resolve", () => {
  test("approve advances issue state", async () => {
    const issue = db.createIssue({ source: "manual", title: "Approve decision" });
    db.transitionState(issue.id, "AWAITING_PLAN_APPROVAL");
    const d = db.createDecision({ issueId: issue.id, type: "PLAN_REVIEW", artifactRef: "/" });
    const { status, body } = await POST(`/api/decisions/${d.id}/resolve`, { verdict: "approved" });
    assert.equal(status, 200);
    assert.equal(body.nextState, "WORKING");
    assert.equal(db.getIssue(issue.id).state, "WORKING");
  });

  test("reject reverts issue state", async () => {
    const issue = db.createIssue({ source: "manual", title: "Reject decision" });
    db.transitionState(issue.id, "AWAITING_CODE_REVIEW");
    const d = db.createDecision({ issueId: issue.id, type: "CODE_REVIEW", artifactRef: "/" });
    await POST(`/api/decisions/${d.id}/resolve`, { verdict: "rejected", feedback: "Fix the types" });
    assert.equal(db.getIssue(issue.id).state, "WORKING");
    assert.equal(db.getDecision(d.id).verdict, "rejected");
  });

  test("rejects invalid verdict", async () => {
    const issue = db.createIssue({ source: "manual", title: "Bad verdict" });
    const d     = db.createDecision({ issueId: issue.id, type: "PLAN_REVIEW", artifactRef: "/" });
    const { status } = await POST(`/api/decisions/${d.id}/resolve`, { verdict: "maybe" });
    assert.equal(status, 400);
  });

  test("returns 409 when already resolved", async () => {
    const issue = db.createIssue({ source: "manual", title: "Double resolve" });
    const d     = db.createDecision({ issueId: issue.id, type: "PLAN_REVIEW", artifactRef: "/" });
    await POST(`/api/decisions/${d.id}/resolve`, { verdict: "approved" });
    const { status } = await POST(`/api/decisions/${d.id}/resolve`, { verdict: "approved" });
    assert.equal(status, 409);
  });

  test("returns 404 for missing decision", async () => {
    const { status } = await POST("/api/decisions/99999/resolve", { verdict: "approved" });
    assert.equal(status, 404);
  });
});

// ── GET /api/archive ──────────────────────────────────────────────────

describe("GET /api/archive", () => {
  test("returns summaries and clickable PR URLs for completed issues", async () => {
    const issue = db.createIssue({ source: "linear", linearId: "BAND-3131", title: "Archived summary issue" });
    db.transitionState(issue.id, "DONE");
    db["db"].prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('github_repo', 'Lukewh/forge')").run();
    db["db"].prepare("INSERT INTO pr_stack (issue_id, gt_branch, position, pr_number, status) VALUES (?, 'lwh/BAND-3131', 1, 3131, 'merged')").run(issue.id);
    const projectDir = join(FORGE_DIR, "projects", String(issue.id));
    mkdirSync(projectDir, { recursive: true });
    writeFileSync(join(projectDir, "summary.md"), "# Done\n\nMerged archive work.", "utf-8");

    try {
      const { status, body } = await GET("/api/archive");
      assert.equal(status, 200);
      const archived = body.find((item) => item.id === issue.id);
      assert.ok(archived);
      assert.equal(archived.hasSummary, true);
      assert.match(archived.summaryContent, /Merged archive work/);
      assert.equal(archived.prStack[0].url, "https://github.com/Lukewh/forge/pull/3131");
    } finally {
      rmSync(projectDir, { recursive: true, force: true });
    }
  });
});

// ── GET /api/settings ─────────────────────────────────────────────────

describe("GET /api/settings", () => {
  test("returns settings object", async () => {
    const { status, body } = await GET("/api/settings");
    assert.equal(status, 200);
    assert.ok("concurrency_limit" in body);
    assert.ok("model"             in body);
    assert.ok("linear_team"       in body);
  });
});

// ── PATCH /api/settings ───────────────────────────────────────────────

describe("PATCH /api/settings", () => {
  test("updates allowed settings", async () => {
    await PATCH("/api/settings", { concurrency_limit: "5", linear_team: "ENG" });
    const { body } = await GET("/api/settings");
    assert.equal(body.concurrency_limit, "5");
    assert.equal(body.linear_team,       "ENG");
  });

  test("updates repository settings", async () => {
    await PATCH("/api/settings", { wt_root: "/tmp/forge-test-wt" });
    const after = (await GET("/api/settings")).body.wt_root;
    assert.equal(after, "/tmp/forge-test-wt");
  });

  test("rejects invalid typed settings", async () => {
    const invalidNumber = await PATCH("/api/settings", { concurrency_limit: "many" });
    assert.equal(invalidNumber.status, 400);
    assert.match(invalidNumber.body.error, /non-negative number/);

    const invalidBoolean = await PATCH("/api/settings", { linear_enabled: "yes" });
    assert.equal(invalidBoolean.status, 400);
    assert.match(invalidBoolean.body.error, /true or false/);
  });
});

// ── GET /api/agents/:type/prompt ──────────────────────────────────────

describe("GET /api/agents/:type/prompt", () => {
  test("returns planner prompt", async () => {
    const { status, body } = await GET("/api/agents/planner/prompt");
    assert.equal(status, 200);
    assert.ok(typeof body === "string");
    assert.ok(body.includes("Planner"));
  });

  test("returns 404 for unknown agent type", async () => {
    const { status } = await GET("/api/agents/unknown/prompt");
    assert.equal(status, 404);
  });
});

// ── PUT /api/agents/:type/prompt ──────────────────────────────────────

describe("PUT /api/agents/:type/prompt", () => {
  test("rejects unknown agent type", async () => {
    const { status } = await PUT("/api/agents/hacker/prompt", { content: "evil" });
    assert.equal(status, 400);
  });

  test("rejects missing content", async () => {
    const { status } = await PUT("/api/agents/coder/prompt", {});
    assert.equal(status, 400);
  });
});

// ── PR-stage issue actions ─────────────────────────────────────────────

describe("PR-stage issue actions", () => {
  test("set-auto-fix toggles issue auto_fix_enabled", async () => {
    const issue = db.createIssue({ source: "manual", title: "Auto fix toggle" });
    const { status } = await PATCH(`/api/issues/${issue.id}`, { action: "set-auto-fix", enabled: true });
    assert.equal(status, 200);
    const row = db["db"].prepare("SELECT auto_fix_enabled FROM issues WHERE id = ?").get(issue.id);
    assert.equal(row.auto_fix_enabled, 1);
  });

  test("manual feedback is accepted while awaiting fix approval", async () => {
    const issue = db.createIssue({ source: "manual", title: "Feedback while awaiting fixes" });
    db["db"].prepare("UPDATE issues SET state = 'AWAITING_FIX_APPROVAL' WHERE id = ?").run(issue.id);
    const { status, body } = await POST(`/api/issues/${issue.id}/feedback`, { prNumber: 123, body: "Please fix the failing test" });
    assert.equal(status, 200);
    assert.equal(body.ok, true);
    const decision = db["db"].prepare("SELECT * FROM decision_queue WHERE issue_id = ? AND type = 'FIX_APPROVAL'").get(issue.id);
    assert.ok(decision);
  });
});

// ── GET /api/runs/:id/log ─────────────────────────────────────────────

describe("GET /api/runs/:id/log", () => {
  test("returns 404 for run without log", async () => {
    const issue = db.createIssue({ source: "manual", title: "Run log test" });
    const run   = db.startAgentRun(issue.id, "planner");
    const { status } = await GET(`/api/runs/${run.id}/log`);
    assert.equal(status, 404);
  });

  test("returns log contents when log file exists", async () => {
    const issue   = db.createIssue({ source: "manual", title: "Run log content" });
    const run     = db.startAgentRun(issue.id, "planner");
    const logPath = join(FORGE_DIR, "test", "fixtures", `run-${run.id}.log`);
    mkdirSync(join(FORGE_DIR, "test", "fixtures"), { recursive: true });
    writeFileSync(logPath, "Agent started\nAgent finished\n", "utf-8");
    db["db"].prepare("UPDATE agent_runs SET log_path = ? WHERE id = ?").run(logPath, run.id);
    const { status, body } = await GET(`/api/runs/${run.id}/log`);
    assert.equal(status, 200);
    assert.ok(body.includes("Agent started"));
  });
});
