/**
 * Forge — Database layer
 *
 * SQLite via better-sqlite3. Source of truth for all lifecycle state.
 * Markdown project files are the human-readable artifact; this is the machine state.
 */

import Database from "better-sqlite3";
import * as path from "node:path";
import * as os from "node:os";
import * as fs from "node:fs";

// ── Constants ────────────────────────────────────────────────────────

export const FORGE_DIR = process.env.FORGE_DIR || path.join(os.homedir(), ".pi", "agent", "extensions", "forge");
export const PROJECTS_DIR = path.join(FORGE_DIR, "projects");
export const DB_PATH = path.join(FORGE_DIR, "forge.db");

// ── Enums ────────────────────────────────────────────────────────────

export type IssueSource = "linear" | "manual";

export type IssueState =
  | "PENDING"
  | "SETTING_UP"
  | "PLANNING"
  | "AI_PLAN_REVIEWING"
  | "AWAITING_PLAN_APPROVAL"
  | "WORKING"
  | "AI_REVIEWING"
  | "AWAITING_CODE_REVIEW"
  | "CREATING_PR"
  | "WATCHING_PR"
  | "IN_MERGE_QUEUE"
  | "SPLIT_PLANNING"
  | "AWAITING_SPLIT_APPROVAL"
  | "SPLITTING"
  | "AWAITING_FIX_APPROVAL"
  | "FIXING"
  | "PUSHING"
  | "REBASING"
  | "DONE"
  | "PAUSED"
  | "IGNORED"
  | "STEERING"
  | "FAILED";

export type AgentType = "setup" | "planner" | "plan-reviewer" | "coder" | "reviewer" | "git-agent" | "fixer" | "watcher" | "split-planner" | "splitter" | "rebaser";

export type DecisionType = "PLAN_REVIEW" | "CODE_REVIEW" | "FIX_APPROVAL" | "SPLIT_APPROVAL" | "AI_CODE_REVIEW" | "AI_PLAN_REVIEW";

export type PrStatus = "open" | "merged" | "closed" | "draft";

// ── Row types ────────────────────────────────────────────────────────

export interface IssueRow {
  id: number;
  source: IssueSource;
  linear_id: string | null;
  title: string;
  priority: number; // 0 = no priority, 1 = urgent, 2 = high, 3 = medium, 4 = low
  state: IssueState;
  previous_state: IssueState | null;
  locked_at: string | null;       // ISO timestamp; set when agent starts, cleared on exit
  agent_pid: number | null;       // PID of running agent-runner process
  steering_context: string | null; // free-form instructions, cleared after agent reads
  pi_sessions_json: string | null;  // JSON map of agent type → Pi session id/path
  project_file_path: string | null;
  wt_path: string | null;
  pr_approved_at: string | null;
  auto_fix_enabled: number;
  focus_rank: number | null;
  created_at: string;
  updated_at: string;
}

export interface PrStackRow {
  id: number;
  issue_id: number;
  pr_number: number | null;       // null until PR is created
  gt_branch: string;
  position: number;               // 1-based order in the stack
  status: PrStatus;
  base_pr_id: number | null;      // references pr_stack.id of parent PR (null = base branch)
}

export interface DecisionRow {
  id: number;
  issue_id: number;
  type: DecisionType;
  artifact_ref: string;           // file path or URL of the artifact to review
  feedback_json: string | null;   // JSON array of {section, comment} or free text
  verdict: "approved" | "rejected" | null;
  created_at: string;
  resolved_at: string | null;
}

export interface AgentRunRow {
  id: number;
  issue_id: number;
  agent_type: AgentType;
  started_at: string;
  exited_at: string | null;
  exit_code: number | null;
  log_path: string | null;
}

export interface AssetRow {
  id: number;
  issue_id: number;
  original_url: string;
  local_path: string;
  fetched_at: string;
}

export interface SettingRow {
  key: string;
  value: string;
}

// ── Default settings ─────────────────────────────────────────────────

export const DEFAULT_SETTINGS: Record<string, string> = {
  concurrency_limit: "4",
  scheduler_interval_seconds: "60",
  dashboard_port: "3142",
  linear_enabled: "false",
  linear_team: "",
  linear_poll_interval_seconds: "300",
  worktree_provider: "git",
  wt_root: "",
  repo_root: "",
  worktree_root: path.join(os.homedir(), "Projects", "worktrees"),
  branch_prefix: os.userInfo().username || "forge",
  default_branch: "main",
  model: "anthropic-vertex/sonnet-4-6",
  model_planner: "",
  model_plan_reviewer: "",
  model_coder: "",
  model_reviewer: "",
  model_git_agent: "",
  model_fixer: "",
  model_split_planner: "",
  model_splitter: "",
  model_rebaser: "",
  forge_reuse_pi_sessions: "false",
  ai_review_max_rounds: "5",
  github_repo: "",
  auto_retry_max: "3",
  vm_ssh_target: "",
  host_path_prefix: "",
  vm_path_prefix: "",
  project_prompt_overlay: "",
  vm_frontend_staging_backend_command: "",
  vm_frontend_local_backend_command: "",
  vm_backend_staging_command: "",
  vm_backend_local_command: "",
  vm_database_command: "",
};

// ── Database ─────────────────────────────────────────────────────────

export class ForgeDB {
  private db: Database.Database;
  readonly dbPath: string;

  constructor(dbPath?: string) {
    this.dbPath = dbPath ?? DB_PATH;
    fs.mkdirSync(path.dirname(this.dbPath), { recursive: true });
    this.db = new Database(this.dbPath);
    this.db.pragma("journal_mode = WAL");
    this.db.pragma("busy_timeout = 5000");
    this.db.pragma("foreign_keys = ON");
    this.migrate();
  }

  // ── Schema ───────────────────────────────────────────────────────

  private migrate() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS issues (
        id                 INTEGER PRIMARY KEY AUTOINCREMENT,
        source             TEXT    NOT NULL DEFAULT 'linear' CHECK(source IN ('linear','manual')),
        linear_id          TEXT,
        title              TEXT    NOT NULL,
        priority           INTEGER NOT NULL DEFAULT 0,
        state              TEXT    NOT NULL DEFAULT 'PENDING',
        previous_state     TEXT,
        locked_at          TEXT,
        agent_pid          INTEGER,
        steering_context   TEXT,
        pi_sessions_json   TEXT,
        project_file_path  TEXT,
        wt_path            TEXT,
        ai_review_rounds         INTEGER NOT NULL DEFAULT 0,
        total_ai_review_rounds   INTEGER NOT NULL DEFAULT 0,
        retry_count              INTEGER NOT NULL DEFAULT 0,
        pr_approved_at           TEXT,
        auto_fix_enabled         INTEGER NOT NULL DEFAULT 0,
        focus_rank               INTEGER,
        created_at               TEXT    NOT NULL DEFAULT (datetime('now')),
        updated_at         TEXT    NOT NULL DEFAULT (datetime('now'))
      );

      CREATE UNIQUE INDEX IF NOT EXISTS idx_issues_linear_id
        ON issues(linear_id) WHERE linear_id IS NOT NULL;

      CREATE INDEX IF NOT EXISTS idx_issues_state
        ON issues(state);

      CREATE TABLE IF NOT EXISTS pr_stack (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        issue_id    INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
        pr_number   INTEGER,
        gt_branch   TEXT    NOT NULL,
        position    INTEGER NOT NULL,
        status      TEXT    NOT NULL DEFAULT 'draft' CHECK(status IN ('open','merged','closed','draft')),
        base_pr_id  INTEGER REFERENCES pr_stack(id)
      );

      CREATE INDEX IF NOT EXISTS idx_pr_stack_issue
        ON pr_stack(issue_id);

      CREATE TABLE IF NOT EXISTS decision_queue (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        issue_id      INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
        type          TEXT    NOT NULL CHECK(type IN ('PLAN_REVIEW','CODE_REVIEW','FIX_APPROVAL','SPLIT_APPROVAL','AI_CODE_REVIEW','AI_PLAN_REVIEW')),
        artifact_ref  TEXT    NOT NULL,
        feedback_json TEXT,
        verdict       TEXT    CHECK(verdict IN ('approved','rejected')),
        created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
        resolved_at   TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_decisions_issue
        ON decision_queue(issue_id);
      CREATE INDEX IF NOT EXISTS idx_decisions_unresolved
        ON decision_queue(verdict) WHERE verdict IS NULL;

      CREATE TABLE IF NOT EXISTS agent_runs (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        issue_id    INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
        agent_type  TEXT    NOT NULL,
        started_at  TEXT    NOT NULL DEFAULT (datetime('now')),
        exited_at   TEXT,
        exit_code   INTEGER,
        log_path    TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_agent_runs_issue
        ON agent_runs(issue_id);

      CREATE TABLE IF NOT EXISTS assets (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        issue_id     INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
        original_url TEXT    NOT NULL,
        local_path   TEXT    NOT NULL,
        fetched_at   TEXT    NOT NULL DEFAULT (datetime('now')),
        UNIQUE(issue_id, original_url)
      );

      CREATE TABLE IF NOT EXISTS settings (
        key   TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS activity_log (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        issue_id    INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
        type        TEXT    NOT NULL,
        actor       TEXT    NOT NULL DEFAULT 'system',
        message     TEXT    NOT NULL,
        metadata    TEXT,
        created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS desktop_jobs (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        type           TEXT    NOT NULL,
        payload_json   TEXT    NOT NULL,
        status         TEXT    NOT NULL DEFAULT 'pending',
        result_json    TEXT,
        error          TEXT,
        created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
        claimed_at     TEXT,
        completed_at   TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_desktop_jobs_status
        ON desktop_jobs(status, created_at);

      CREATE TABLE IF NOT EXISTS desktop_cache (
        key        TEXT PRIMARY KEY,
        value_json TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_activity_issue
        ON activity_log(issue_id, created_at DESC);

      CREATE TABLE IF NOT EXISTS review_tours (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        issue_id   INTEGER NOT NULL UNIQUE REFERENCES issues(id) ON DELETE CASCADE,
        tour_json  TEXT    NOT NULL,
        created_at TEXT    NOT NULL DEFAULT (datetime('now'))
      );

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

      CREATE INDEX IF NOT EXISTS idx_learning_events_issue
        ON learning_events(issue_id, created_at DESC);

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

      CREATE INDEX IF NOT EXISTS idx_learning_suggestions_status
        ON learning_suggestions(status, created_at DESC);

      CREATE TABLE IF NOT EXISTS learning_change_log (
        id                INTEGER PRIMARY KEY AUTOINCREMENT,
        issue_id          INTEGER REFERENCES issues(id) ON DELETE SET NULL,
        suggestion_id     INTEGER REFERENCES learning_suggestions(id) ON DELETE SET NULL,
        target            TEXT    NOT NULL,
        change_type       TEXT    NOT NULL,
        change_summary    TEXT    NOT NULL,
        reason            TEXT,
        actor             TEXT    NOT NULL DEFAULT 'system',
        metadata_json     TEXT,
        created_at        TEXT    NOT NULL DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_learning_change_log_created
        ON learning_change_log(created_at DESC);

      CREATE TABLE IF NOT EXISTS scheduler_state (
        id         INTEGER PRIMARY KEY CHECK(id = 1),
        running    INTEGER NOT NULL DEFAULT 0,
        pid        INTEGER,
        started_at TEXT
      );

      INSERT OR IGNORE INTO scheduler_state (id, running) VALUES (1, 0);
    `);

    this.runMigrations();
    this.seedSettings();
  }

  /** Safe incremental migrations for existing databases */
  private runMigrations() {
    const addColumn = (table: string, col: string, def: string) => {
      try { this.db.prepare(`ALTER TABLE ${table} ADD COLUMN ${col} ${def}`).run(); } catch { /* exists */ }
    };
    addColumn("issues", "ai_review_rounds", "INTEGER NOT NULL DEFAULT 0");
    addColumn("issues", "total_ai_review_rounds", "INTEGER NOT NULL DEFAULT 0");
    addColumn("issues", "retry_count", "INTEGER NOT NULL DEFAULT 0");
    addColumn("issues", "pr_approved_at", "TEXT");
    addColumn("issues", "auto_fix_enabled", "INTEGER NOT NULL DEFAULT 0");
    addColumn("issues", "focus_rank", "INTEGER");
    addColumn("issues", "pi_sessions_json", "TEXT");

    this.db.prepare("UPDATE settings SET value = replace(value, 'IS_' || 'DEV' || 'CONTAINER=1 ', '') WHERE key LIKE 'vm_%_command'").run();
    this.db.prepare("DELETE FROM settings WHERE key LIKE 'vm_%compose_command'").run();
    const legacyVmTarget = (this.db.prepare("SELECT value FROM settings WHERE key = 'vm_ssh_target'").get() as SettingRow | undefined)?.value;
    const insertSetting = this.db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
    insertSetting.run("host_path_prefix", legacyVmTarget ? "/Users" : DEFAULT_SETTINGS.host_path_prefix);
    insertSetting.run("vm_path_prefix", legacyVmTarget ? "/mnt/mac/Users" : DEFAULT_SETTINGS.vm_path_prefix);
    insertSetting.run("project_prompt_overlay", DEFAULT_SETTINGS.project_prompt_overlay);

    this.db.exec(`
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
      CREATE TABLE IF NOT EXISTS learning_change_log (
        id                INTEGER PRIMARY KEY AUTOINCREMENT,
        issue_id          INTEGER REFERENCES issues(id) ON DELETE SET NULL,
        suggestion_id     INTEGER REFERENCES learning_suggestions(id) ON DELETE SET NULL,
        target            TEXT    NOT NULL,
        change_type       TEXT    NOT NULL,
        change_summary    TEXT    NOT NULL,
        reason            TEXT,
        actor             TEXT    NOT NULL DEFAULT 'system',
        metadata_json     TEXT,
        created_at        TEXT    NOT NULL DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_learning_change_log_created ON learning_change_log(created_at DESC);
    `);

    // Expand decision_queue CHECK constraint to include newer decision types
    const dqSql = (this.db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='decision_queue'").get() as any)?.sql ?? '';
    if (!dqSql.includes('AI_PLAN_REVIEW') || !dqSql.includes('SPLIT_APPROVAL')) {
      this.db.exec(`
        BEGIN;
        ALTER TABLE decision_queue RENAME TO _dq_old;
        CREATE TABLE decision_queue (
          id            INTEGER PRIMARY KEY AUTOINCREMENT,
          issue_id      INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
          type          TEXT    NOT NULL CHECK(type IN ('PLAN_REVIEW','CODE_REVIEW','FIX_APPROVAL','SPLIT_APPROVAL','AI_CODE_REVIEW','AI_PLAN_REVIEW')),
          artifact_ref  TEXT    NOT NULL,
          feedback_json TEXT,
          verdict       TEXT    CHECK(verdict IN ('approved','rejected')),
          created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
          resolved_at   TEXT
        );
        INSERT INTO decision_queue SELECT * FROM _dq_old;
        DROP TABLE _dq_old;
        CREATE INDEX IF NOT EXISTS idx_decisions_issue ON decision_queue(issue_id);
        CREATE INDEX IF NOT EXISTS idx_decisions_unresolved ON decision_queue(verdict) WHERE verdict IS NULL;
        COMMIT;
      `);
    }
  }

  private seedSettings() {
    const insert = this.db.prepare(
      `INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`
    );
    const txn = this.db.transaction(() => {
      for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
        insert.run(key, value);
      }
    });
    txn();
  }

  // ── Settings ────────────────────────────────────────────────────

  getSetting(key: string): string | undefined {
    const row = this.db.prepare(`SELECT value FROM settings WHERE key = ?`).get(key) as SettingRow | undefined;
    return row?.value ?? DEFAULT_SETTINGS[key];
  }

  setSetting(key: string, value: string): void {
    this.db.prepare(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`).run(key, value);
  }

  getAllSettings(): Record<string, string> {
    const rows = this.db.prepare(`SELECT key, value FROM settings`).all() as SettingRow[];
    const result: Record<string, string> = { ...DEFAULT_SETTINGS };
    for (const row of rows) {
      result[row.key] = row.value;
    }
    return result;
  }

  // ── Issues ───────────────────────────────────────────────────────

  createIssue(params: {
    source: IssueSource;
    linearId?: string;
    title: string;
    priority?: number;
  }): IssueRow {
    return this.db.prepare(`
      INSERT INTO issues (source, linear_id, title, priority)
      VALUES (?, ?, ?, ?)
      RETURNING *
    `).get(
      params.source,
      params.linearId ?? null,
      params.title,
      params.priority ?? 0,
    ) as IssueRow;
  }

  getIssue(id: number): IssueRow | undefined {
    return this.db.prepare(`SELECT * FROM issues WHERE id = ?`).get(id) as IssueRow | undefined;
  }

  getIssueByLinearId(linearId: string): IssueRow | undefined {
    return this.db.prepare(`SELECT * FROM issues WHERE linear_id = ?`).get(linearId) as IssueRow | undefined;
  }

  listIssues(state?: IssueState): IssueRow[] {
    if (state) {
      return this.db.prepare(`SELECT * FROM issues WHERE state = ? ORDER BY priority ASC, created_at ASC`).all(state) as IssueRow[];
    }
    return this.db.prepare(`SELECT * FROM issues ORDER BY priority ASC, created_at ASC`).all() as IssueRow[];
  }

  listActiveIssues(): IssueRow[] {
    return this.db.prepare(`
      SELECT * FROM issues
      WHERE state NOT IN ('DONE', 'PAUSED', 'IGNORED', 'FAILED')
      ORDER BY priority ASC, created_at ASC
    `).all() as IssueRow[];
  }

  /** Issues the scheduler should consider for agent spawning */
  listSchedulableIssues(): IssueRow[] {
    return this.db.prepare(`
      SELECT * FROM issues
      WHERE state IN ('PENDING','SETTING_UP','PLANNING','AI_PLAN_REVIEWING','WORKING','AI_REVIEWING','CREATING_PR','FIXING','PUSHING','REBASING','WATCHING_PR','IN_MERGE_QUEUE','SPLIT_PLANNING','SPLITTING')
        AND locked_at IS NULL
      ORDER BY
        CASE state
          WHEN 'FIXING'       THEN 1
          WHEN 'PUSHING'      THEN 2
          WHEN 'REBASING'     THEN 2
          WHEN 'WORKING'      THEN 3
          WHEN 'CREATING_PR'  THEN 4
          WHEN 'PLANNING'     THEN 5
          WHEN 'WATCHING_PR'    THEN 6
          WHEN 'IN_MERGE_QUEUE'  THEN 6
          WHEN 'SPLITTING'       THEN 2
          WHEN 'SPLIT_PLANNING'  THEN 4
          WHEN 'AI_REVIEWING' THEN 3
          WHEN 'AI_PLAN_REVIEWING' THEN 4
          WHEN 'SETTING_UP'        THEN 6
          WHEN 'PENDING'      THEN 7
          ELSE                     8
        END,
        priority ASC,
        created_at ASC
    `).all() as IssueRow[];
  }

  transitionState(id: number, newState: IssueState): boolean {
    const info = this.db.prepare(`
      UPDATE issues
      SET previous_state = state,
          state          = ?,
          updated_at     = datetime('now')
      WHERE id = ?
    `).run(newState, id);
    return info.changes > 0;
  }

  lockIssue(id: number, pid: number): boolean {
    const info = this.db.prepare(`
      UPDATE issues
      SET locked_at  = datetime('now'),
          agent_pid  = ?,
          updated_at = datetime('now')
      WHERE id = ? AND locked_at IS NULL
    `).run(pid, id);
    return info.changes > 0;
  }

  incrementAiReviewRounds(id: number): number {
    this.db.prepare(`
      UPDATE issues
      SET ai_review_rounds = ai_review_rounds + 1,
          total_ai_review_rounds = total_ai_review_rounds + 1,
          updated_at = datetime('now')
      WHERE id = ?
    `).run(id);
    return (this.db.prepare(`SELECT ai_review_rounds FROM issues WHERE id = ?`).get(id) as any).ai_review_rounds;
  }

  resetAiReviewRounds(id: number): void {
    // Reset per-cycle counter only; total_ai_review_rounds is cumulative and never reset
    this.db.prepare(`UPDATE issues SET ai_review_rounds = 0, updated_at = datetime('now') WHERE id = ?`).run(id);
  }

  /** Increment retry_count and return the new value. */
  incrementRetryCount(id: number): number {
    this.db.prepare(`
      UPDATE issues SET retry_count = retry_count + 1, updated_at = datetime('now') WHERE id = ?
    `).run(id);
    return (this.db.prepare(`SELECT retry_count FROM issues WHERE id = ?`).get(id) as any).retry_count;
  }

  /** Reset retry_count to 0 (call on successful agent completion). */
  resetRetryCount(id: number): void {
    this.db.prepare(`UPDATE issues SET retry_count = 0, updated_at = datetime('now') WHERE id = ?`).run(id);
  }

  updateAgentPid(id: number, pid: number): void {
    this.db.prepare(`UPDATE issues SET agent_pid = ?, updated_at = datetime('now') WHERE id = ?`).run(pid, id);
  }

  unlockIssue(id: number): void {
    this.db.prepare(`
      UPDATE issues
      SET locked_at  = NULL,
          agent_pid  = NULL,
          updated_at = datetime('now')
      WHERE id = ?
    `).run(id);
  }

  /**
   * Mark issues whose lock is older than the per-state threshold as FAILED.
   *
   * LLM agents (coder / fixer / planner / reviewer) can legitimately run for
   * up to MAX_RUNTIME_MS (45 min).  Using a 10-minute global threshold was
   * prematurely killing those agents mid-work.  We now use:
   *   - 50 min for heavy LLM states  (WORKING, FIXING, PLANNING, AI_* …)
   *   - 12 min for quick-turnaround states (CREATING_PR, PUSHING, SETTING_UP …)
   */
  reapStaleIssues(_unusedLegacyMinutes?: number): IssueRow[] {
    // States driven by long-running LLM agents — give them the full budget.
    const LONG_STATES = `'WORKING','FIXING','PLANNING','AI_REVIEWING','AI_PLAN_REVIEWING','SPLIT_PLANNING','SPLITTING'`;
    const LONG_MINUTES = 50;
    // States driven by deterministic / git / network agents — short turnaround.
    const SHORT_MINUTES = 12;

    const longStale = this.db.prepare(`
      SELECT * FROM issues
      WHERE locked_at IS NOT NULL
        AND locked_at < datetime('now', '-${LONG_MINUTES} minutes')
        AND state IN (${LONG_STATES})
    `).all() as IssueRow[];

    const shortStale = this.db.prepare(`
      SELECT * FROM issues
      WHERE locked_at IS NOT NULL
        AND locked_at < datetime('now', '-${SHORT_MINUTES} minutes')
        AND state NOT IN (${LONG_STATES},'DONE','PAUSED','IGNORED',
                          'AWAITING_PLAN_APPROVAL','AWAITING_CODE_REVIEW',
                          'AWAITING_FIX_APPROVAL','AWAITING_SPLIT_APPROVAL')
    `).all() as IssueRow[];

    const stale = [...longStale, ...shortStale];

    if (stale.length > 0) {
      const update = this.db.prepare(`
        UPDATE issues
        SET state      = 'FAILED',
            locked_at  = NULL,
            agent_pid  = NULL,
            updated_at = datetime('now')
        WHERE id = ?
      `);
      const txn = this.db.transaction(() => {
        for (const row of stale) update.run(row.id);
      });
      txn();
    }

    return stale;
  }

  updateIssue(id: number, fields: Partial<Pick<IssueRow,
    "title" | "priority" | "project_file_path" | "wt_path" | "steering_context"
  >>): void {
    const sets: string[] = [];
    const values: any[] = [];

    for (const [key, val] of Object.entries(fields)) {
      if (val !== undefined) {
        sets.push(`${key} = ?`);
        values.push(val);
      }
    }
    if (sets.length === 0) return;
    sets.push(`updated_at = datetime('now')`);
    values.push(id);

    this.db.prepare(`UPDATE issues SET ${sets.join(", ")} WHERE id = ?`).run(...values);
  }

  pauseIssue(id: number): void {
    this.db.prepare(`
      UPDATE issues
      SET previous_state = state,
          state          = 'PAUSED',
          locked_at      = NULL,
          agent_pid      = NULL,
          updated_at     = datetime('now')
      WHERE id = ? AND state NOT IN ('DONE','PAUSED','IGNORED')
    `).run(id);
  }

  ignoreIssue(id: number): void {
    this.db.prepare(`
      UPDATE issues
      SET previous_state = state,
          state          = 'IGNORED',
          locked_at      = NULL,
          agent_pid      = NULL,
          updated_at     = datetime('now')
      WHERE id = ? AND state NOT IN ('DONE','IGNORED')
    `).run(id);
  }

  unignoreIssue(id: number): void {
    this.db.prepare(`
      UPDATE issues
      SET state      = COALESCE(previous_state, 'PENDING'),
          updated_at = datetime('now')
      WHERE id = ? AND state = 'IGNORED'
    `).run(id);
  }

  unpauseIssue(id: number): void {
    this.db.prepare(`
      UPDATE issues
      SET state      = COALESCE(previous_state, 'PENDING'),
          updated_at = datetime('now')
      WHERE id = ? AND state = 'PAUSED'
    `).run(id);
  }

  steerIssue(id: number, instructions: string): void {
    // Steering is a flag, not a state — issue stays in its current state,
    // next agent picks up instructions and clears them without disruption.
    this.db.prepare(`
      UPDATE issues
      SET steering_context = ?,
          updated_at       = datetime('now')
      WHERE id = ? AND state NOT IN ('DONE','IGNORED','FAILED')
    `).run(instructions, id);
  }

  clearSteeringContext(id: number): void {
    this.db.prepare(`
      UPDATE issues SET steering_context = NULL, updated_at = datetime('now') WHERE id = ?
    `).run(id);
  }

  // ── PR Stack ─────────────────────────────────────────────────────

  addPr(params: {
    issueId: number;
    gtBranch: string;
    position: number;
    basePrId?: number;
  }): PrStackRow {
    return this.db.prepare(`
      INSERT INTO pr_stack (issue_id, gt_branch, position, base_pr_id)
      VALUES (?, ?, ?, ?)
      RETURNING *
    `).get(
      params.issueId,
      params.gtBranch,
      params.position,
      params.basePrId ?? null,
    ) as PrStackRow;
  }

  updatePr(id: number, fields: Partial<Pick<PrStackRow, "pr_number" | "status">>): void {
    const sets: string[] = [];
    const values: any[] = [];
    for (const [key, val] of Object.entries(fields)) {
      if (val !== undefined) { sets.push(`${key} = ?`); values.push(val); }
    }
    if (sets.length === 0) return;
    values.push(id);
    this.db.prepare(`UPDATE pr_stack SET ${sets.join(", ")} WHERE id = ?`).run(...values);
  }

  getPrStack(issueId: number): PrStackRow[] {
    return this.db.prepare(`
      SELECT * FROM pr_stack WHERE issue_id = ? ORDER BY position ASC
    `).all(issueId) as PrStackRow[];
  }

  allPrsMerged(issueId: number): boolean {
    const rows = this.getPrStack(issueId);
    if (rows.length === 0) return false;
    return rows.every(r => r.status === "merged");
  }

  // ── Decision Queue ───────────────────────────────────────────────

  createDecision(params: {
    issueId: number;
    type: DecisionType;
    artifactRef: string;
  }): DecisionRow {
    // Return existing unresolved decision of the same type rather than inserting a duplicate
    const existing = this.db.prepare(`
      SELECT * FROM decision_queue
      WHERE issue_id = ? AND type = ? AND verdict IS NULL
      LIMIT 1
    `).get(params.issueId, params.type) as DecisionRow | undefined;
    if (existing) return existing;

    return this.db.prepare(`
      INSERT INTO decision_queue (issue_id, type, artifact_ref)
      VALUES (?, ?, ?)
      RETURNING *
    `).get(params.issueId, params.type, params.artifactRef) as DecisionRow;
  }

  resolveDecision(id: number, verdict: "approved" | "rejected", feedbackJson?: string): void {
    this.db.prepare(`
      UPDATE decision_queue
      SET verdict      = ?,
          feedback_json = ?,
          resolved_at  = datetime('now')
      WHERE id = ?
    `).run(verdict, feedbackJson ?? null, id);
  }

  getDecision(id: number): DecisionRow | undefined {
    return this.db.prepare(`SELECT * FROM decision_queue WHERE id = ?`).get(id) as DecisionRow | undefined;
  }

  getPendingDecision(issueId: number): DecisionRow | undefined {
    return this.db.prepare(`
      SELECT * FROM decision_queue
      WHERE issue_id = ? AND verdict IS NULL
      ORDER BY created_at ASC
      LIMIT 1
    `).get(issueId) as DecisionRow | undefined;
  }

  getAllPendingDecisions(): DecisionRow[] {
    return this.db.prepare(`
      SELECT * FROM decision_queue WHERE verdict IS NULL ORDER BY created_at ASC
    `).all() as DecisionRow[];
  }

  getDecisionsForIssue(issueId: number): DecisionRow[] {
    return this.db.prepare(`
      SELECT * FROM decision_queue WHERE issue_id = ? ORDER BY created_at DESC
    `).all(issueId) as DecisionRow[];
  }

  // ── Agent Runs ───────────────────────────────────────────────────

  startAgentRun(issueId: number, agentType: AgentType, logPath?: string): AgentRunRow {
    return this.db.prepare(`
      INSERT INTO agent_runs (issue_id, agent_type, log_path)
      VALUES (?, ?, ?)
      RETURNING *
    `).get(issueId, agentType, logPath ?? null) as AgentRunRow;
  }

  finishAgentRun(id: number, exitCode: number): void {
    this.db.prepare(`
      UPDATE agent_runs
      SET exited_at = datetime('now'), exit_code = ?
      WHERE id = ?
    `).run(exitCode, id);
  }

  getAgentRuns(issueId: number): AgentRunRow[] {
    return this.db.prepare(`
      SELECT * FROM agent_runs WHERE issue_id = ? ORDER BY started_at DESC, id DESC
    `).all(issueId) as AgentRunRow[];
  }

  // ── Assets ───────────────────────────────────────────────────────

  upsertAsset(issueId: number, originalUrl: string, localPath: string): AssetRow {
    return this.db.prepare(`
      INSERT INTO assets (issue_id, original_url, local_path)
      VALUES (?, ?, ?)
      ON CONFLICT(issue_id, original_url) DO UPDATE SET
        local_path = excluded.local_path,
        fetched_at = datetime('now')
      RETURNING *
    `).get(issueId, originalUrl, localPath) as AssetRow;
  }

  getAssets(issueId: number): AssetRow[] {
    return this.db.prepare(`SELECT * FROM assets WHERE issue_id = ?`).all(issueId) as AssetRow[];
  }

  deleteAssets(issueId: number): void {
    this.db.prepare(`DELETE FROM assets WHERE issue_id = ?`).run(issueId);
  }

  // ── Scheduler state ──────────────────────────────────────────────

  setSchedulerRunning(running: boolean, pid?: number): void {
    this.db.prepare(`
      UPDATE scheduler_state
      SET running = ?, pid = ?, started_at = CASE WHEN ? = 1 THEN datetime('now') ELSE NULL END
      WHERE id = 1
    `).run(running ? 1 : 0, pid ?? null, running ? 1 : 0);
  }

  getSchedulerState(): { running: boolean; pid: number | null; started_at: string | null } {
    const row = this.db.prepare(`SELECT * FROM scheduler_state WHERE id = 1`).get() as any;
    return { running: !!row?.running, pid: row?.pid ?? null, started_at: row?.started_at ?? null };
  }

  // ── Overview ─────────────────────────────────────────────────────

  getOverview(): {
    available: IssueRow[];
    active: IssueRow[];
    awaitingDecisions: DecisionRow[];
    runningAgents: AgentRunRow[];
    schedulerState: ReturnType<ForgeDB["getSchedulerState"]>;
  } {
    const active = this.listActiveIssues();
    const available = this.listIssues("PENDING");
    const awaitingDecisions = this.getAllPendingDecisions();
    const runningAgents = this.db.prepare(`
      SELECT * FROM agent_runs WHERE exited_at IS NULL ORDER BY started_at DESC
    `).all() as AgentRunRow[];
    const schedulerState = this.getSchedulerState();

    return { available, active, awaitingDecisions, runningAgents, schedulerState };
  }

  // ── Activity Log ─────────────────────────────────────────────────

  logActivity(issueId: number, type: string, message: string, actor = "system", metadata?: object): void {
    this.db.prepare(`
      INSERT INTO activity_log (issue_id, type, actor, message, metadata)
      VALUES (?, ?, ?, ?, ?)
    `).run(issueId, type, actor, message, metadata ? JSON.stringify(metadata) : null);
  }

  getActivityLog(issueId: number, limit = 200): Array<{
    id: number; issue_id: number; type: string; actor: string;
    message: string; metadata: string | null; created_at: string;
  }> {
    return this.db.prepare(`
      SELECT * FROM activity_log
      WHERE issue_id = ?
      ORDER BY created_at ASC, id ASC
      LIMIT ?
    `).all(issueId, limit) as any[];
  }

  close(): void {
    this.db.close();
  }
}
