/**
 * Forge — Scheduler
 *
 * Runs inside the pi extension. Polls SQLite every N seconds, spawns
 * detached agent-runner processes for actionable issues, and reaps stale locks.
 */

import { spawn } from "node:child_process";
import * as path from "node:path";
import * as os from "node:os";
import * as fs from "node:fs";
import { ForgeDB, type IssueRow, type AgentType } from "./db.js";

const FORGE_DIR = process.env.FORGE_DIR || path.join(os.homedir(), ".pi", "agent", "extensions", "forge");
const RUNNER_PATH  = path.join(FORGE_DIR, "agent-runner.js");
const WATCHER_PATH = path.join(FORGE_DIR, "watcher.js");
const SETUP_PATH   = path.join(FORGE_DIR, "setup.js");

// Map from issue state → agent type to spawn
// Maps each schedulable state to the agent type that handles it
const STATE_AGENT_MAP: Partial<Record<string, AgentType>> = {
  PENDING:      "planner",  // promoted to SETTING_UP immediately via START_STATE_MAP
  SETTING_UP:        "setup",         // handled by setup.js — deterministic, no LLM
  PLANNING:          "planner",
  AI_PLAN_REVIEWING: "plan-reviewer",  // handled by agent-runner — reviews the plan
  WORKING:      "coder",
  AI_REVIEWING: "reviewer",
  CREATING_PR:  "git-agent",
  FIXING:       "fixer",
  PUSHING:      "git-agent",
  REBASING:     "rebaser",
  WATCHING_PR:    "watcher",
  IN_MERGE_QUEUE:  "watcher",
  SPLIT_PLANNING:  "split-planner",
  SPLITTING:       "splitter",
};

// Immediately transition to the active state before spawning so the dashboard
// reflects work-in-progress without waiting for agent-runner to start
const START_STATE_MAP: Partial<Record<string, string>> = {
  PENDING: "SETTING_UP", // PENDING → SETTING_UP immediately (setup script runs first)
};

export class ForgeScheduler {
  private db: ForgeDB;
  private timer: ReturnType<typeof setInterval> | null = null;
  private running = false;
  private log: (msg: string) => void;

  constructor(db: ForgeDB, log: (msg: string) => void = console.log) {
    this.db = db;
    this.log = log;
  }

  start(intervalSeconds?: number): void {
    if (this.running) return;
    if (this.db.getSetting("setup_completed") === "false") {
      this.log("[forge:scheduler] Setup is not complete. Run /forge setup first.");
      return;
    }
    this.running = true;

    const interval = (intervalSeconds ?? parseInt(this.db.getSetting("scheduler_interval_seconds") ?? "60", 10)) * 1000;

    this.log(`[forge:scheduler] Starting — interval: ${interval / 1000}s`);
    this.db.setSchedulerRunning(true, process.pid);

    // Run immediately, then on interval
    this.tick();
    this.timer = setInterval(() => this.tick(), interval);
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.db.setSchedulerRunning(false);
    this.log("[forge:scheduler] Stopped");
  }

  private async tick(): Promise<void> {
    if (!this.running) return;

    try {
      // Reap stale locks first
      const stale = this.db.reapStaleIssues();
      if (stale.length > 0) {
        this.log(`[forge:scheduler] Reaped ${stale.length} stale issue(s): ${stale.map(i => i.id).join(", ")}`);
      }

      // Check concurrency limit
      const limit = parseInt(this.db.getSetting("concurrency_limit") ?? "2", 10);
      const locked = this.db.listActiveIssues().filter(i => i.locked_at !== null);
      const available = limit - locked.length;

      if (available <= 0) {
        this.log(`[forge:scheduler] At concurrency limit (${limit}). Skipping.`);
        return;
      }

      // Get schedulable issues
      const schedulable = this.db.listSchedulableIssues();
      if (schedulable.length === 0) return;

      this.log(`[forge:scheduler] ${schedulable.length} schedulable issue(s). Spawning up to ${available}.`);

      let spawned = 0;
      for (const issue of schedulable) {
        if (spawned >= available) break;
        if (this.spawnAgent(issue)) spawned++;
      }
    } catch (e: any) {
      this.log(`[forge:scheduler] Error during tick: ${e?.message ?? e}`);
    }
  }

  private spawnAgent(issue: IssueRow): boolean {
    const agentType = STATE_AGENT_MAP[issue.state];
    if (!agentType) {
      this.log(`[forge:scheduler] No agent mapped for state ${issue.state} (issue #${issue.id})`);
      return false;
    }

    // Set up log file for watcher runs so output is inspectable
    let logPath: string | undefined;
    if (agentType === "watcher") {
      const logDir = path.join(FORGE_DIR, "projects", String(issue.id));
      fs.mkdirSync(logDir, { recursive: true });
      logPath = path.join(logDir, `watcher-${Date.now()}.log`);
    }

    // Record agent run
    const run = this.db.startAgentRun(issue.id, agentType, logPath);

    // Promote queued state → active state synchronously before spawning
    const startState = START_STATE_MAP[issue.state];
    if (startState) {
      this.db.transitionState(issue.id, startState as any);
      this.log(`[forge:scheduler] #${issue.id} ${issue.state} → ${startState}`);
    }

    // Lock the issue (atomic — fails if already locked)
    const locked = this.db.lockIssue(issue.id, 0);
    if (!locked) {
      // Undo state promotion if lock fails
      if (startState) this.db.transitionState(issue.id, issue.state);
      this.log(`[forge:scheduler] Could not lock issue #${issue.id} — skipping`);
      return false;
    }

    this.log(`[forge:scheduler] Spawning ${agentType} for issue #${issue.id} "${issue.title}" (run #${run.id})`);

    // Use the promoted state (if any) to determine which script to run
    const effectiveState = startState ?? issue.state;
    const scriptPath = agentType === "watcher"             ? WATCHER_PATH
                     : effectiveState === "SETTING_UP"     ? SETUP_PATH
                     : RUNNER_PATH;

    let stdioFds: number[] = [];
    const stdio: any = logPath
      ? (() => {
          const fd1 = fs.openSync(logPath, "a");
          const fd2 = fs.openSync(logPath, "a");
          stdioFds = [fd1, fd2];
          return ["ignore", fd1, fd2];
        })()
      : "ignore";

    const proc = spawn(
      process.execPath,
      [scriptPath, "--issue-id", String(issue.id), "--agent-type", agentType, "--run-id", String(run.id)],
      {
        detached: true,
        stdio,
      }
    );

    // Close parent's copies of the inherited fds immediately after spawn.
    // The child has its own copies — not closing these leaks fds and causes
    // the child to inherit a massive fd table on the next spawn.
    for (const fd of stdioFds) {
      try { fs.closeSync(fd); } catch {}
    }

    proc.unref();

    // Update PID now that we have it
    this.db.updateAgentPid(issue.id, proc.pid ?? 0);

    return true;
  }
}
