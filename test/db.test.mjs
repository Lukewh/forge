/**
 * Forge — ForgeDB comprehensive tests
 */

import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { makeTempDB, makeStale } from "./helpers.mjs";

// ── Shared DB per test ────────────────────────────────────────────────

let ctx;
beforeEach(() => { ctx = makeTempDB(); });
afterEach(()  => { ctx.cleanup(); });

// ── Issues ────────────────────────────────────────────────────────────

describe("Issues — create", () => {
  test("creates a linear issue with all fields", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-1", title: "Test", priority: 2 });
    assert.equal(issue.source,    "linear");
    assert.equal(issue.linear_id, "BAND-1");
    assert.equal(issue.title,     "Test");
    assert.equal(issue.priority,  2);
    assert.equal(issue.state,     "PENDING");
    assert.ok(issue.id > 0);
    assert.ok(issue.created_at);
  });

  test("creates a manual issue with defaults", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Manual task" });
    assert.equal(issue.source,    "manual");
    assert.equal(issue.linear_id, null);
    assert.equal(issue.priority,  0);
    assert.equal(issue.state,     "PENDING");
  });

  test("rejects duplicate linear_id", () => {
    const { db } = ctx;
    db.createIssue({ source: "linear", linearId: "BAND-1", title: "First" });
    assert.throws(() => db.createIssue({ source: "linear", linearId: "BAND-1", title: "Dupe" }));
  });
});

describe("Issues — read", () => {
  test("getIssue returns correct issue", () => {
    const { db } = ctx;
    const created = db.createIssue({ source: "linear", linearId: "BAND-2", title: "Get me" });
    const fetched  = db.getIssue(created.id);
    assert.equal(fetched.title, "Get me");
  });

  test("getIssue returns undefined for missing id", () => {
    const { db } = ctx;
    assert.equal(db.getIssue(99999), undefined);
  });

  test("getIssueByLinearId finds correct issue", () => {
    const { db } = ctx;
    db.createIssue({ source: "linear", linearId: "BAND-3", title: "Linear lookup" });
    const found = db.getIssueByLinearId("BAND-3");
    assert.equal(found.title, "Linear lookup");
  });

  test("getIssueByLinearId returns undefined for unknown id", () => {
    const { db } = ctx;
    assert.equal(db.getIssueByLinearId("BAND-NOPE"), undefined);
  });

  test("listIssues returns all issues ordered by priority", () => {
    const { db } = ctx;
    db.createIssue({ source: "linear", linearId: "BAND-10", title: "Low",    priority: 4 });
    db.createIssue({ source: "linear", linearId: "BAND-11", title: "Urgent", priority: 1 });
    db.createIssue({ source: "linear", linearId: "BAND-12", title: "Medium", priority: 3 });
    const all = db.listIssues();
    assert.equal(all[0].title, "Urgent");
    assert.equal(all[2].title, "Low");
  });

  test("listIssues filters by state", () => {
    const { db } = ctx;
    const i1 = db.createIssue({ source: "linear", linearId: "BAND-20", title: "A" });
    const i2 = db.createIssue({ source: "linear", linearId: "BAND-21", title: "B" });
    db.transitionState(i2.id, "PLANNING");
    const pending = db.listIssues("PENDING");
    assert.equal(pending.length, 1);
    assert.equal(pending[0].id, i1.id);
  });
});

describe("Issues — update", () => {
  test("updateIssue sets project_file_path", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Update me" });
    db.updateIssue(issue.id, { project_file_path: "/tmp/plan.md", wt_path: "/tmp/wt" });
    const updated = db.getIssue(issue.id);
    assert.equal(updated.project_file_path, "/tmp/plan.md");
    assert.equal(updated.wt_path, "/tmp/wt");
  });

  test("updateIssue with empty fields is a no-op", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Noop" });
    db.updateIssue(issue.id, {});
    assert.equal(db.getIssue(issue.id).title, "Noop");
  });
});

// ── State machine ─────────────────────────────────────────────────────

describe("State transitions", () => {
  test("transitionState updates state and preserves previous_state", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-30", title: "Transitions" });
    db.transitionState(issue.id, "PLANNING");
    let row = db.getIssue(issue.id);
    assert.equal(row.state,          "PLANNING");
    assert.equal(row.previous_state, "PENDING");

    db.transitionState(issue.id, "AWAITING_PLAN_APPROVAL");
    row = db.getIssue(issue.id);
    assert.equal(row.state,          "AWAITING_PLAN_APPROVAL");
    assert.equal(row.previous_state, "PLANNING");
  });

  test("full happy-path lifecycle", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-31", title: "Lifecycle" });
    const states = [
      "PLANNING", "AWAITING_PLAN_APPROVAL", "WORKING",
      "AWAITING_CODE_REVIEW", "CREATING_PR", "WATCHING_PR",
      "AWAITING_FIX_APPROVAL", "FIXING", "PUSHING", "DONE",
    ];
    for (const s of states) {
      db.transitionState(issue.id, s);
      assert.equal(db.getIssue(issue.id).state, s, `Expected state ${s}`);
    }
  });

  test("transitionState returns false for unknown id", () => {
    const { db } = ctx;
    const result = db.transitionState(99999, "PLANNING");
    assert.equal(result, false);
  });
});

// ── Locking ───────────────────────────────────────────────────────────

describe("Locking", () => {
  test("lockIssue sets locked_at and agent_pid", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-40", title: "Lock me" });
    const locked = db.lockIssue(issue.id, 1234);
    assert.ok(locked);
    const row = db.getIssue(issue.id);
    assert.ok(row.locked_at);
    assert.equal(row.agent_pid, 1234);
  });

  test("lockIssue fails if already locked (atomic guarantee)", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-41", title: "Double lock" });
    db.lockIssue(issue.id, 1111);
    const secondLock = db.lockIssue(issue.id, 2222);
    assert.equal(secondLock, false);
    assert.equal(db.getIssue(issue.id).agent_pid, 1111);
  });

  test("unlockIssue clears locked_at and agent_pid", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-42", title: "Unlock me" });
    db.lockIssue(issue.id, 5555);
    db.unlockIssue(issue.id);
    const row = db.getIssue(issue.id);
    assert.equal(row.locked_at,  null);
    assert.equal(row.agent_pid,  null);
  });

  test("updateAgentPid updates PID on locked issue", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-43", title: "PID update" });
    db.lockIssue(issue.id, 0);
    db.updateAgentPid(issue.id, 9876);
    assert.equal(db.getIssue(issue.id).agent_pid, 9876);
  });
});

// ── Stale reaping ─────────────────────────────────────────────────────

describe("Stale reaping", () => {
  test("reapStaleIssues marks stale locks as FAILED", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-50", title: "Go stale" });
    db.transitionState(issue.id, "WORKING");
    db.lockIssue(issue.id, 999);
    makeStale(db, issue.id);
    const stale = db.reapStaleIssues(10);
    assert.equal(stale.length, 1);
    assert.equal(db.getIssue(issue.id).state, "FAILED");
    assert.equal(db.getIssue(issue.id).locked_at, null);
  });

  test("reapStaleIssues ignores AWAITING_* states", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-51", title: "Awaiting" });
    db.transitionState(issue.id, "AWAITING_PLAN_APPROVAL");
    db.lockIssue(issue.id, 888);
    makeStale(db, issue.id);
    const stale = db.reapStaleIssues(10);
    assert.equal(stale.length, 0);
    assert.equal(db.getIssue(issue.id).state, "AWAITING_PLAN_APPROVAL");
  });

  test("reapStaleIssues on WORKING issue with stale lock", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-52", title: "Stale working" });
    db.transitionState(issue.id, "WORKING");
    db.lockIssue(issue.id, 777);
    makeStale(db, issue.id);
    const stale = db.reapStaleIssues(10);
    assert.equal(stale.length, 1);
    assert.equal(db.getIssue(issue.id).state, "FAILED");
  });

  test("reapStaleIssues ignores PAUSED state", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-53", title: "Paused" });
    db.pauseIssue(issue.id);
    db.lockIssue(issue.id, 666);
    makeStale(db, issue.id);
    const stale = db.reapStaleIssues(10);
    assert.equal(stale.length, 0);
  });

  test("reapStaleIssues ignores fresh locks", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-54", title: "Fresh" });
    db.transitionState(issue.id, "WORKING");
    db.lockIssue(issue.id, 555);
    // Do NOT make stale — locked_at is NOW
    const stale = db.reapStaleIssues(10);
    assert.equal(stale.length, 0);
  });
});

// ── Pause / Unpause ───────────────────────────────────────────────────

describe("Pause / Unpause", () => {
  test("pauseIssue transitions to PAUSED and saves previous state", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Pausable" });
    db.transitionState(issue.id, "WORKING");
    db.pauseIssue(issue.id);
    const row = db.getIssue(issue.id);
    assert.equal(row.state,          "PAUSED");
    assert.equal(row.previous_state, "WORKING");
  });

  test("unpauseIssue restores previous state", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Unpausable" });
    db.transitionState(issue.id, "PLANNING");
    db.pauseIssue(issue.id);
    db.unpauseIssue(issue.id);
    assert.equal(db.getIssue(issue.id).state, "PLANNING");
  });

  test("pauseIssue clears locked_at and agent_pid", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Pause clears lock" });
    db.transitionState(issue.id, "WORKING");
    db.lockIssue(issue.id, 1234);
    db.pauseIssue(issue.id);
    const row = db.getIssue(issue.id);
    assert.equal(row.locked_at, null);
    assert.equal(row.agent_pid, null);
  });

  test("cannot pause a DONE issue", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Pause DONE" });
    db.transitionState(issue.id, "DONE");
    db.pauseIssue(issue.id);
    assert.equal(db.getIssue(issue.id).state, "DONE");
  });
});

// ── Steering ──────────────────────────────────────────────────────────

describe("Steering", () => {
  test("steerIssue sets steering_context without changing state", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Steerable" });
    db.transitionState(issue.id, "WORKING");
    db.steerIssue(issue.id, "Focus on auth layer");
    const row = db.getIssue(issue.id);
    assert.equal(row.state,            "WORKING");      // state unchanged
    assert.equal(row.steering_context, "Focus on auth layer");
  });

  test("clearSteeringContext nulls the context", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Clear steer" });
    db.steerIssue(issue.id, "Some instructions");
    db.clearSteeringContext(issue.id);
    assert.equal(db.getIssue(issue.id).steering_context, null);
  });

  test("cannot steer a DONE issue", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Steer DONE" });
    db.transitionState(issue.id, "DONE");
    db.steerIssue(issue.id, "Try to steer");
    assert.equal(db.getIssue(issue.id).steering_context, null, "DONE issue should not accept steering");
  });

  test("cannot steer a FAILED issue", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Steer failed" });
    db.transitionState(issue.id, "FAILED");
    db.steerIssue(issue.id, "Try to steer");
    assert.equal(db.getIssue(issue.id).steering_context, null, "FAILED issue should not accept steering");
  });
});

// ── Schedulable issues ────────────────────────────────────────────────

describe("listSchedulableIssues", () => {
  test("returns PENDING issues", () => {
    const { db } = ctx;
    db.createIssue({ source: "linear", linearId: "BAND-60", title: "Pending" });
    assert.equal(db.listSchedulableIssues().length, 1);
  });

  test("excludes AWAITING_* states", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-61", title: "Awaiting" });
    db.transitionState(issue.id, "AWAITING_PLAN_APPROVAL");
    assert.equal(db.listSchedulableIssues().length, 0);
  });

  test("excludes PAUSED state", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-62", title: "Paused" });
    db.pauseIssue(issue.id);
    assert.equal(db.listSchedulableIssues().length, 0);
  });

  test("excludes DONE state", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-63", title: "Done" });
    db.transitionState(issue.id, "DONE");
    assert.equal(db.listSchedulableIssues().length, 0);
  });

  test("excludes locked issues", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-64", title: "Locked" });
    db.lockIssue(issue.id, 1234);
    assert.equal(db.listSchedulableIssues().length, 0);
  });

  test("orders FIXING before WORKING before PLANNING before PENDING", () => {
    const { db } = ctx;
    const pending  = db.createIssue({ source: "linear", linearId: "BAND-70", title: "Pending",  priority: 1 });
    const planning = db.createIssue({ source: "linear", linearId: "BAND-71", title: "Planning", priority: 1 });
    const working  = db.createIssue({ source: "linear", linearId: "BAND-72", title: "Working",  priority: 1 });
    const fixing   = db.createIssue({ source: "linear", linearId: "BAND-73", title: "Fixing",   priority: 1 });

    db.transitionState(planning.id, "PLANNING");
    db.transitionState(working.id,  "WORKING");
    db.transitionState(fixing.id,   "FIXING");

    const order = db.listSchedulableIssues().map(i => i.title);
    assert.equal(order[0], "Fixing");
    assert.equal(order[1], "Working");
    assert.equal(order[2], "Planning");
    assert.equal(order[3], "Pending");
  });

  test("within same state, higher priority (lower number) comes first", () => {
    const { db } = ctx;
    db.createIssue({ source: "linear", linearId: "BAND-80", title: "Low prio",  priority: 4 });
    db.createIssue({ source: "linear", linearId: "BAND-81", title: "High prio", priority: 1 });
    const schedulable = db.listSchedulableIssues();
    assert.equal(schedulable[0].title, "High prio");
  });
});

// ── PR Stack ──────────────────────────────────────────────────────────

describe("PR Stack", () => {
  test("addPr creates PR entry", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-90", title: "PR test" });
    const pr    = db.addPr({ issueId: issue.id, gtBranch: "lwh/BAND-90-feat", position: 1 });
    assert.equal(pr.issue_id,  issue.id);
    assert.equal(pr.gt_branch, "lwh/BAND-90-feat");
    assert.equal(pr.position,  1);
    assert.equal(pr.status,    "draft");
    assert.equal(pr.pr_number, null);
  });

  test("addPr with basePrId links to parent", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-91", title: "Stack" });
    const pr1   = db.addPr({ issueId: issue.id, gtBranch: "lwh/BAND-91-p1", position: 1 });
    const pr2   = db.addPr({ issueId: issue.id, gtBranch: "lwh/BAND-91-p2", position: 2, basePrId: pr1.id });
    assert.equal(pr2.base_pr_id, pr1.id);
  });

  test("getPrStack returns PRs ordered by position", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-92", title: "Order" });
    db.addPr({ issueId: issue.id, gtBranch: "branch-2", position: 2 });
    db.addPr({ issueId: issue.id, gtBranch: "branch-1", position: 1 });
    const stack = db.getPrStack(issue.id);
    assert.equal(stack[0].position, 1);
    assert.equal(stack[1].position, 2);
  });

  test("updatePr sets pr_number and status", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-93", title: "Update PR" });
    const pr    = db.addPr({ issueId: issue.id, gtBranch: "branch", position: 1 });
    db.updatePr(pr.id, { pr_number: 42, status: "open" });
    const stack = db.getPrStack(issue.id);
    assert.equal(stack[0].pr_number, 42);
    assert.equal(stack[0].status,    "open");
  });

  test("allPrsMerged returns false when stack is empty", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-94", title: "No PRs" });
    assert.equal(db.allPrsMerged(issue.id), false);
  });

  test("allPrsMerged returns false when some PRs are open", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-95", title: "Mixed" });
    const pr1   = db.addPr({ issueId: issue.id, gtBranch: "b1", position: 1 });
    const pr2   = db.addPr({ issueId: issue.id, gtBranch: "b2", position: 2 });
    db.updatePr(pr1.id, { status: "merged" });
    db.updatePr(pr2.id, { status: "open" });
    assert.equal(db.allPrsMerged(issue.id), false);
  });

  test("allPrsMerged returns true when all PRs merged", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "linear", linearId: "BAND-96", title: "All merged" });
    const pr1   = db.addPr({ issueId: issue.id, gtBranch: "b1", position: 1 });
    const pr2   = db.addPr({ issueId: issue.id, gtBranch: "b2", position: 2 });
    db.updatePr(pr1.id, { status: "merged" });
    db.updatePr(pr2.id, { status: "merged" });
    assert.equal(db.allPrsMerged(issue.id), true);
  });
});

// ── Decision Queue ────────────────────────────────────────────────────

describe("Decision Queue", () => {
  test("createDecision creates unresolved decision", () => {
    const { db } = ctx;
    const issue    = db.createIssue({ source: "manual", title: "Decide" });
    const decision = db.createDecision({ issueId: issue.id, type: "PLAN_REVIEW", artifactRef: "/plan.md" });
    assert.equal(decision.type,         "PLAN_REVIEW");
    assert.equal(decision.artifact_ref, "/plan.md");
    assert.equal(decision.verdict,      null);
    assert.equal(decision.resolved_at,  null);
  });

  test("getDecision fetches by id", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Get decision" });
    const d     = db.createDecision({ issueId: issue.id, type: "CODE_REVIEW", artifactRef: "/diff" });
    const fetched = db.getDecision(d.id);
    assert.equal(fetched.id,   d.id);
    assert.equal(fetched.type, "CODE_REVIEW");
  });

  test("getDecision returns undefined for missing id", () => {
    const { db } = ctx;
    assert.equal(db.getDecision(99999), undefined);
  });

  test("resolveDecision approved advances verdict", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Resolve" });
    const d     = db.createDecision({ issueId: issue.id, type: "PLAN_REVIEW", artifactRef: "/" });
    db.resolveDecision(d.id, "approved");
    const resolved = db.getDecision(d.id);
    assert.equal(resolved.verdict,     "approved");
    assert.ok(resolved.resolved_at);
  });

  test("resolveDecision rejected stores feedback", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Reject" });
    const d     = db.createDecision({ issueId: issue.id, type: "PLAN_REVIEW", artifactRef: "/" });
    db.resolveDecision(d.id, "rejected", JSON.stringify([{ section: "PR Stack", comment: "Too large" }]));
    const resolved = db.getDecision(d.id);
    assert.equal(resolved.verdict, "rejected");
    const feedback = JSON.parse(resolved.feedback_json);
    assert.equal(feedback[0].section, "PR Stack");
  });

  test("getPendingDecision returns oldest unresolved decision for issue", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Pending decision" });
    const d1    = db.createDecision({ issueId: issue.id, type: "PLAN_REVIEW", artifactRef: "/1" });
    db.createDecision({ issueId: issue.id, type: "CODE_REVIEW", artifactRef: "/2" });
    const pending = db.getPendingDecision(issue.id);
    assert.equal(pending.id, d1.id);
  });

  test("getAllPendingDecisions returns only unresolved", () => {
    const { db } = ctx;
    const i1 = db.createIssue({ source: "manual", title: "Issue 1" });
    const i2 = db.createIssue({ source: "manual", title: "Issue 2" });
    const d1 = db.createDecision({ issueId: i1.id, type: "PLAN_REVIEW", artifactRef: "/" });
    db.createDecision({ issueId: i2.id, type: "CODE_REVIEW", artifactRef: "/" });
    db.resolveDecision(d1.id, "approved");
    const pending = db.getAllPendingDecisions();
    assert.equal(pending.length, 1);
    assert.equal(pending[0].issue_id, i2.id);
  });

  test("createDecision deduplicates — returns existing unresolved instead of inserting", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Dedupe test" });
    const d1 = db.createDecision({ issueId: issue.id, type: "PLAN_REVIEW", artifactRef: "/v1" });
    const d2 = db.createDecision({ issueId: issue.id, type: "PLAN_REVIEW", artifactRef: "/v2" });
    assert.equal(d1.id, d2.id, "Should return same row, not insert a duplicate");
    assert.equal(db.getDecisionsForIssue(issue.id).length, 1, "Only one decision should exist");
  });

  test("createDecision allows new decision after previous is resolved", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "After resolve" });
    const d1 = db.createDecision({ issueId: issue.id, type: "PLAN_REVIEW", artifactRef: "/v1" });
    db.resolveDecision(d1.id, "rejected", JSON.stringify("Too vague"));
    const d2 = db.createDecision({ issueId: issue.id, type: "PLAN_REVIEW", artifactRef: "/v2" });
    assert.notEqual(d1.id, d2.id, "New decision should be created after previous resolved");
    assert.equal(db.getDecisionsForIssue(issue.id).length, 2);
  });

  test("createDecision allows different types for same issue", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Different types" });
    const d1 = db.createDecision({ issueId: issue.id, type: "PLAN_REVIEW",  artifactRef: "/plan" });
    const d2 = db.createDecision({ issueId: issue.id, type: "CODE_REVIEW",  artifactRef: "/diff" });
    assert.notEqual(d1.id, d2.id, "Different types should create separate decisions");
    assert.equal(db.getDecisionsForIssue(issue.id).length, 2);
  });

  test("getDecisionsForIssue returns all decisions for an issue", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "All decisions" });
    db.createDecision({ issueId: issue.id, type: "PLAN_REVIEW", artifactRef: "/1" });
    db.createDecision({ issueId: issue.id, type: "CODE_REVIEW", artifactRef: "/2" });
    const decisions = db.getDecisionsForIssue(issue.id);
    assert.equal(decisions.length, 2);
  });
});

// ── Agent Runs ────────────────────────────────────────────────────────

describe("Agent Runs", () => {
  test("startAgentRun creates a run entry", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Run test" });
    const run   = db.startAgentRun(issue.id, "planner");
    assert.equal(run.issue_id,   issue.id);
    assert.equal(run.agent_type, "planner");
    assert.equal(run.exited_at,  null);
    assert.equal(run.exit_code,  null);
  });

  test("finishAgentRun sets exited_at and exit_code", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Finish run" });
    const run   = db.startAgentRun(issue.id, "coder");
    db.finishAgentRun(run.id, 0);
    const runs = db.getAgentRuns(issue.id);
    assert.equal(runs[0].exit_code, 0);
    assert.ok(runs[0].exited_at);
  });

  test("getAgentRuns returns runs ordered by started_at DESC", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Multiple runs" });
    db.startAgentRun(issue.id, "planner");
    db.startAgentRun(issue.id, "coder");
    const runs = db.getAgentRuns(issue.id);
    assert.equal(runs.length, 2);
    assert.equal(runs[0].agent_type, "coder");
  });
});

// ── Assets ────────────────────────────────────────────────────────────

describe("Assets", () => {
  test("upsertAsset creates asset entry", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Assets" });
    db.upsertAsset(issue.id, "https://example.com/img.png", "/tmp/img.png");
    const assets = db.getAssets(issue.id);
    assert.equal(assets.length, 1);
    assert.equal(assets[0].original_url, "https://example.com/img.png");
    assert.equal(assets[0].local_path,   "/tmp/img.png");
  });

  test("upsertAsset updates existing asset on conflict", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Asset upsert" });
    db.upsertAsset(issue.id, "https://example.com/img.png", "/tmp/old.png");
    db.upsertAsset(issue.id, "https://example.com/img.png", "/tmp/new.png");
    const assets = db.getAssets(issue.id);
    assert.equal(assets.length, 1);
    assert.equal(assets[0].local_path, "/tmp/new.png");
  });

  test("deleteAssets removes all assets for issue", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Delete assets" });
    db.upsertAsset(issue.id, "https://example.com/a.png", "/tmp/a.png");
    db.upsertAsset(issue.id, "https://example.com/b.png", "/tmp/b.png");
    db.deleteAssets(issue.id);
    assert.equal(db.getAssets(issue.id).length, 0);
  });
});

// ── Settings ──────────────────────────────────────────────────────────

describe("Settings", () => {
  test("getSetting returns seeded default", () => {
    const { db } = ctx;
    assert.equal(db.getSetting("concurrency_limit"), "4");
  });

  test("setSetting persists a value", () => {
    const { db } = ctx;
    db.setSetting("concurrency_limit", "5");
    assert.equal(db.getSetting("concurrency_limit"), "5");
  });

  test("setSetting overwrites existing value", () => {
    const { db } = ctx;
    db.setSetting("concurrency_limit", "3");
    db.setSetting("concurrency_limit", "7");
    assert.equal(db.getSetting("concurrency_limit"), "7");
  });

  test("getAllSettings returns all keys", () => {
    const { db } = ctx;
    const all = db.getAllSettings();
    assert.ok("concurrency_limit"         in all);
    assert.ok("scheduler_interval_seconds" in all);
    assert.ok("model"                     in all);
    assert.ok("linear_team"               in all);
  });
});

// ── Scheduler state ───────────────────────────────────────────────────

describe("Scheduler state", () => {
  test("initial state is not running", () => {
    const { db } = ctx;
    const state = db.getSchedulerState();
    assert.equal(state.running, false);
    assert.equal(state.pid,     null);
  });

  test("setSchedulerRunning true sets running and pid", () => {
    const { db } = ctx;
    db.setSchedulerRunning(true, 12345);
    const state = db.getSchedulerState();
    assert.equal(state.running, true);
    assert.equal(state.pid,     12345);
    assert.ok(state.started_at);
  });

  test("setSchedulerRunning false clears pid", () => {
    const { db } = ctx;
    db.setSchedulerRunning(true, 12345);
    db.setSchedulerRunning(false);
    const state = db.getSchedulerState();
    assert.equal(state.running, false);
    assert.equal(state.pid,     null);
  });
});

// ── Overview ──────────────────────────────────────────────────────────

describe("Overview", () => {
  test("returns empty state for a fresh DB", () => {
    const { db } = ctx;
    const overview = db.getOverview();
    assert.equal(overview.active.length,           0);
    assert.equal(overview.available.length,        0);
    assert.equal(overview.awaitingDecisions.length, 0);
    assert.equal(overview.runningAgents.length,    0);
    assert.equal(overview.schedulerState.running,  false);
  });

  test("active excludes DONE, PAUSED, FAILED — but includes PENDING and actionable states", () => {
    const { db } = ctx;
    const i1 = db.createIssue({ source: "manual", title: "Pending"  });
    const i2 = db.createIssue({ source: "manual", title: "Working"  });
    const i3 = db.createIssue({ source: "manual", title: "Done"     });
    db.transitionState(i2.id, "WORKING");
    db.transitionState(i3.id, "DONE");
    const { active, available } = db.getOverview();
    // listActiveIssues excludes DONE/PAUSED/FAILED; PENDING is included (scheduler needs it)
    assert.equal(active.length,    2); // PENDING + WORKING
    assert.equal(available.length, 1); // only PENDING in listIssues("PENDING")
    assert.equal(available[0].id,  i1.id);
    assert.ok(active.some(i => i.id === i2.id), "WORKING issue should be active");
    assert.ok(active.some(i => i.id === i1.id), "PENDING issue is included in active");
  });

  test("awaitingDecisions shows only pending decisions", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Decision overview" });
    const d = db.createDecision({ issueId: issue.id, type: "PLAN_REVIEW", artifactRef: "/" });
    assert.equal(db.getOverview().awaitingDecisions.length, 1);
    db.resolveDecision(d.id, "approved");
    assert.equal(db.getOverview().awaitingDecisions.length, 0);
  });

  test("runningAgents shows unfinished runs", () => {
    const { db } = ctx;
    const issue = db.createIssue({ source: "manual", title: "Running agent" });
    const run   = db.startAgentRun(issue.id, "planner");
    assert.equal(db.getOverview().runningAgents.length, 1);
    db.finishAgentRun(run.id, 0);
    assert.equal(db.getOverview().runningAgents.length, 0);
  });
});
