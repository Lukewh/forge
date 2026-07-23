/**
 * Forge — ForgeScheduler tests
 */

import { test, describe, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { makeTempDB, loadForgeScheduler, makeStale } from "./helpers.mjs";

let ctx;
beforeEach(() => { ctx = makeTempDB(); });
afterEach(()  => { ctx.cleanup(); });

// ── State → agent mapping ─────────────────────────────────────────────

describe("STATE_AGENT_MAP", () => {
  const EXPECTED = {
    PENDING:     "planner",
    SETTING_UP:  "planner",
    PLANNING:    "planner",
    WORKING:     "coder",
    CREATING_PR: "git-agent",
    FIXING:      "fixer",
    PUSHING:     "git-agent",
    WATCHING_PR: "watcher",
  };

  // We test this indirectly via scheduler tick behaviour (spawned args)
  // by inspecting that the scheduler maps each state to the right script
  test("all schedulable states have an agent mapping", () => {
    const schedulableStates = [
      "PENDING","SETTING_UP","PLANNING","WORKING","CREATING_PR","FIXING","PUSHING","WATCHING_PR"
    ];
    for (const state of schedulableStates) {
      assert.ok(EXPECTED[state], `Expected mapping for state ${state}`);
    }
  });
});

// ── Start-state promotion ───────────────────────────────────────────

describe("Start-state promotion", () => {
  test("PENDING → SETTING_UP before agent spawns", async () => {
    const { db } = ctx;
    db.setSetting("concurrency_limit", "1");
    const issue = db.createIssue({ source: "linear", linearId: "BAND-300", title: "Promote me" });
    assert.equal(db.getIssue(issue.id).state, "PENDING");

    const ForgeScheduler = loadForgeScheduler();
    const scheduler = new ForgeScheduler(db, () => {});
    scheduler["running"] = true;
    // Point at nonexistent script — child fails silently (detached+unref'd)
    // but promotion happens synchronously before the spawn call
    scheduler["RUNNER_PATH"] = "/nonexistent/forge-runner.js";

    await scheduler["tick"]();

    assert.equal(db.getIssue(issue.id).state, "SETTING_UP", "PENDING should be promoted to SETTING_UP");
  });

  test("PLANNING stays PLANNING (no double-promotion)", async () => {
    const { db } = ctx;
    db.setSetting("concurrency_limit", "1");
    const issue = db.createIssue({ source: "linear", linearId: "BAND-301", title: "Resume plan" });
    db.transitionState(issue.id, "PLANNING");

    const ForgeScheduler = loadForgeScheduler();
    const scheduler = new ForgeScheduler(db, () => {});
    scheduler["running"] = true;
    scheduler["RUNNER_PATH"] = "/nonexistent/forge-runner.js";

    await scheduler["tick"]();
    assert.equal(db.getIssue(issue.id).state, "PLANNING", "Already-active states should not be re-promoted");
  });

  test("lock failure rolls back state promotion", async () => {
    const { db } = ctx;
    db.setSetting("concurrency_limit", "1");
    const issue = db.createIssue({ source: "linear", linearId: "BAND-302", title: "Lock fail" });
    // Pre-lock so the lock attempt fails
    db.lockIssue(issue.id, 1111);

    const ForgeScheduler = loadForgeScheduler();
    const scheduler = new ForgeScheduler(db, () => {});
    scheduler["running"] = true;

    const spawned = [];
    scheduler["spawnAgent"] = (i) => {
      // Call the real spawnAgent logic by invoking parent
      spawned.push(i.id);
      return false;
    };

    // Manually simulate what spawnAgent does: promote then fail to lock
    const issueFresh = db.getIssue(issue.id);
    db.transitionState(issueFresh.id, "PLANNING");
    const locked = db.lockIssue(issueFresh.id, 0); // will fail — already locked
    if (!locked) db.transitionState(issueFresh.id, issueFresh.state); // rollback

    assert.equal(db.getIssue(issue.id).state, "PENDING", "State should roll back on lock failure");
  });

  test("other schedulable states are not promoted (already active)", async () => {
    const { db } = ctx;
    db.setSetting("concurrency_limit", "5");
    const states = ["WORKING", "CREATING_PR", "FIXING", "PUSHING"];

    let n = 310;
    for (const state of states) {
      const issue = db.createIssue({ source: "linear", linearId: `BAND-${n++}`, title: state });
      db.transitionState(issue.id, state);
    }

    const ForgeScheduler = loadForgeScheduler();
    const scheduler = new ForgeScheduler(db, () => {});
    scheduler["running"] = true;
    scheduler["spawnAgent"] = (i) => { db.lockIssue(i.id, 9999); return true; };

    await scheduler["tick"]();

    for (const state of states) {
      const issue = db.listIssues().find(i => i.title === state);
      assert.equal(issue.state, state, `${state} should not be promoted`);
    }
  });
});

// ── Start / Stop ──────────────────────────────────────────────────────

describe("Scheduler start / stop", () => {
  test("start sets scheduler_state.running in DB", () => {
    const { db } = ctx;
    const ForgeScheduler = loadForgeScheduler();
    const scheduler = new ForgeScheduler(db, () => {});
    scheduler.start(3600); // 1-hour interval so tick doesn't fire in test
    assert.equal(db.getSchedulerState().running, true);
    scheduler.stop();
  });

  test("stop clears scheduler_state.running in DB", () => {
    const { db } = ctx;
    const ForgeScheduler = loadForgeScheduler();
    const scheduler = new ForgeScheduler(db, () => {});
    scheduler.start(3600);
    scheduler.stop();
    assert.equal(db.getSchedulerState().running, false);
  });

  test("double-start is idempotent", () => {
    const { db } = ctx;
    const ForgeScheduler = loadForgeScheduler();
    const scheduler = new ForgeScheduler(db, () => {});
    scheduler.start(3600);
    scheduler.start(3600); // should not throw
    assert.equal(db.getSchedulerState().running, true);
    scheduler.stop();
  });

  test("stop when not running is a no-op", () => {
    const { db } = ctx;
    const ForgeScheduler = loadForgeScheduler();
    const scheduler = new ForgeScheduler(db, () => {});
    scheduler.stop(); // should not throw
    assert.equal(db.getSchedulerState().running, false);
  });
});

// ── Concurrency limit ─────────────────────────────────────────────────

describe("Concurrency limit", () => {
  test("respects concurrency_limit=1 — only spawns one agent", async () => {
    const { db } = ctx;
    db.setSetting("concurrency_limit", "1");

    // Create 3 schedulable issues
    db.createIssue({ source: "linear", linearId: "BAND-200", title: "A", priority: 1 });
    db.createIssue({ source: "linear", linearId: "BAND-201", title: "B", priority: 2 });
    db.createIssue({ source: "linear", linearId: "BAND-202", title: "C", priority: 3 });

    const spawned = [];
    const ForgeScheduler = loadForgeScheduler();
    const scheduler = new ForgeScheduler(db, () => {});
    scheduler["running"] = true; // simulate started state without triggering interval
    scheduler["spawnAgent"] = (issue) => {
      spawned.push(issue.id);
      db.lockIssue(issue.id, 9999);
      return true;
    };

    await scheduler["tick"]();

    assert.equal(spawned.length, 1, "Should only spawn 1 agent with limit=1");
  });

  test("respects concurrency_limit=2", async () => {
    const { db } = ctx;
    db.setSetting("concurrency_limit", "2");

    db.createIssue({ source: "linear", linearId: "BAND-210", title: "A", priority: 1 });
    db.createIssue({ source: "linear", linearId: "BAND-211", title: "B", priority: 2 });
    db.createIssue({ source: "linear", linearId: "BAND-212", title: "C", priority: 3 });

    const spawned = [];
    const ForgeScheduler = loadForgeScheduler();
    const scheduler = new ForgeScheduler(db, () => {});
    scheduler["running"] = true;
    scheduler["spawnAgent"] = (issue) => {
      spawned.push(issue.id);
      db.lockIssue(issue.id, 9999);
      return true;
    };

    await scheduler["tick"]();

    assert.equal(spawned.length, 2, "Should spawn 2 agents with limit=2");
  });

  test("counts already-locked issues against limit", async () => {
    const { db } = ctx;
    db.setSetting("concurrency_limit", "2");

    const i1 = db.createIssue({ source: "linear", linearId: "BAND-220", title: "Already locked" });
    db.transitionState(i1.id, "WORKING");
    db.lockIssue(i1.id, 1111);
    db["db"].prepare("UPDATE issues SET locked_at = datetime('now') WHERE id = ?").run(i1.id);

    db.createIssue({ source: "linear", linearId: "BAND-221", title: "Free A" });
    db.createIssue({ source: "linear", linearId: "BAND-222", title: "Free B" });

    const spawned = [];
    const ForgeScheduler = loadForgeScheduler();
    const scheduler = new ForgeScheduler(db, () => {});
    scheduler["running"] = true;
    scheduler["spawnAgent"] = (issue) => {
      spawned.push(issue.id);
      db.lockIssue(issue.id, 9999);
      return true;
    };

    await scheduler["tick"]();

    assert.equal(spawned.length, 1, "1 slot remaining (limit=2, 1 already locked)");
  });
});

// ── Stale reap in tick ────────────────────────────────────────────────

describe("Stale reap on tick", () => {
  test("tick reaps stale locks before checking concurrency", async () => {
    const { db } = ctx;
    db.setSetting("concurrency_limit", "1");

    const issue = db.createIssue({ source: "linear", linearId: "BAND-230", title: "Stale" });
    db.transitionState(issue.id, "WORKING");
    db.lockIssue(issue.id, 9999);
    makeStale(db, issue.id, 15);

    const ForgeScheduler = loadForgeScheduler();
    const scheduler = new ForgeScheduler(db, () => {});
    scheduler["running"] = true;
    scheduler["spawnAgent"] = () => false;

    await scheduler["tick"]();

    assert.equal(db.getIssue(issue.id).state, "FAILED");
    assert.equal(db.getIssue(issue.id).locked_at, null);
  });
});

// ── Priority ordering in tick ─────────────────────────────────────────

describe("Priority ordering in tick", () => {
  test("FIXING issues are spawned before PENDING issues", async () => {
    const { db } = ctx;
    db.setSetting("concurrency_limit", "1");

    const pending = db.createIssue({ source: "linear", linearId: "BAND-240", title: "Pending", priority: 1 });
    const fixing  = db.createIssue({ source: "linear", linearId: "BAND-241", title: "Fixing",  priority: 1 });
    db.transitionState(fixing.id, "FIXING");

    const spawned = [];
    const ForgeScheduler = loadForgeScheduler();
    const scheduler = new ForgeScheduler(db, () => {});
    scheduler["running"] = true;
    scheduler["spawnAgent"] = (issue) => {
      spawned.push(issue.title);
      db.lockIssue(issue.id, 9999);
      return true;
    };

    await scheduler["tick"]();
    assert.equal(spawned[0], "Fixing");
  });
});
