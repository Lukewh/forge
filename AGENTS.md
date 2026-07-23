# Forge — Developer Guide for LLMs

Forge is a pi extension that manages the full lifecycle of Linear issues through automated AI agents. It lives at `~/.pi/agent/extensions/forge/` and is loaded by pi via `index.ts`.

---

## Architecture Overview

```
Linear issue
    │
    ▼
forge.db (SQLite)  ←─── all state lives here
    │
    ▼
scheduler.ts  ──── ticks every N seconds ───► spawns agent processes
    │
    ├── setup.js         (deterministic, no LLM)
    ├── agent-runner.js  (LLM agents: planner, coder, reviewer, etc.)
    └── watcher.js       (deterministic, no LLM)
```

The **dashboard** (`dashboard/server.js` + `dashboard/public/`) is an Express app that reads/writes `forge.db` and exposes a REST API + SSE for the browser UI.

The **pi extension** (`index.ts`) registers `/forge` slash commands and runs the scheduler in-process. A standalone scheduler can also be launched via `start-scheduler.mjs`.

---

## Key Files

| File | Purpose |
|------|---------|
| `db.ts` | Single source of truth: all SQLite schema, types, and query methods |
| `index.ts` | pi extension entry — registers `/forge` commands, starts scheduler |
| `scheduler.ts` | `ForgeScheduler` class — ticks, picks schedulable issues, spawns agents |
| `setup.js` | Creates git worktree + project file, transitions PENDING → PLANNING |
| `agent-runner.js` | Runs LLM agents (planner, coder, reviewer, git-agent, fixer); handles state transitions |
| `watcher.js` | Polls GitHub PR status; detects merges + review comments |
| `generate-summary.js` | Writes `projects/{id}/summary.md` on completion |
| `self-improve.js` | Extracts patterns from PR review comments and appends to `agents/coder.md` |
| `dashboard/server.js` | Express REST API for the web dashboard |
| `dashboard/public/app.js` | Browser SPA (vanilla JS) |
| `dashboard/public/style.css` | Dashboard styles |
| `agents/*.md` | System prompts for each LLM agent type |
| `projects/{id}/plan.md` | Per-issue project file (the agent's working document) |
| `projects/{id}/run-{N}-{type}.log` | JSONL log for each agent run |
| `projects/{id}/summary.md` | Executive summary written at DONE |

---

## Issue Lifecycle & States

States are stored in `issues.state`. Valid values (defined in `db.ts` `IssueState`):

```
PENDING
  └─► SETTING_UP      (setup.js creates worktree + plan file)
        └─► PLANNING          (planner agent writes the plan)
              └─► AI_PLAN_REVIEWING   (plan-reviewer agent checks it)
                    ├─► AWAITING_PLAN_APPROVAL  (user must approve/reject)
                    └─► WORKING        (coder agent implements)
                          └─► AI_REVIEWING       (reviewer agent checks code)
                                ├─► AWAITING_CODE_REVIEW  (user must approve/reject)
                                └─► CREATING_PR    (git-agent creates PRs via git/gh)
                                      └─► WATCHING_PR    (watcher polls GitHub)
                                            ├─► AWAITING_FIX_APPROVAL  (user reviews comments)
                                            │     └─► FIXING  (fixer agent addresses comments)
                                            │           └─► PUSHING  (git-agent pushes)
                                            │                 └─► WATCHING_PR (loop)
                                            └─► DONE
PAUSED    — user-suspended; resumes to previous_state
IGNORED   — user-dismissed; not scheduled; Linear not synced
FAILED    — agent crashed or errored; retryable
STEERING  — (flag-like) instructions queued; not a blocking state
```

The `previous_state` column is set on every transition so PAUSED/FAILED/IGNORED can resume.

### State Machine Constants

- **`scheduler.ts` `STATE_AGENT_MAP`** — maps state → which script/agent to spawn
- **`agent-runner.js` `NEXT_STATE_MAP`** — maps current state → next state after agent completes
- **`agent-runner.js` `determineDecisionType()`** — maps next state → decision type (if user input needed)

---

## Database Schema

All tables are in `forge.db` (SQLite WAL mode). Schema is defined and migrated in `db.ts` `migrate()`.

### `issues`
The core table. One row per tracked issue.

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER PK | Forge internal ID |
| `source` | TEXT | `'linear'` or `'manual'` |
| `linear_id` | TEXT | e.g. `TEAM-1234`; unique |
| `title` | TEXT | |
| `priority` | INTEGER | 0=none, 1=urgent, 2=high, 3=medium, 4=low |
| `state` | TEXT | Current `IssueState` |
| `previous_state` | TEXT | Set on every transition; used by resume/retry |
| `locked_at` | TEXT | ISO timestamp; set when an agent is running |
| `agent_pid` | INTEGER | PID of the currently running agent process |
| `steering_context` | TEXT | Free-form instructions; agent reads and clears this |
| `project_file_path` | TEXT | Absolute path to `plan.md` |
| `wt_path` | TEXT | Absolute path to the git worktree |
| `ai_review_rounds` | INTEGER | Counter for AI review loop depth |
| `linear_state` | TEXT | Last Linear state we synced to (de-dup guard) |
| `created_at` / `updated_at` | TEXT | ISO datetimes |

### `pr_stack`
One row per PR in the issue's git branch stack.

| Column | Notes |
|--------|-------|
| `issue_id` | FK → issues |
| `pr_number` | GitHub PR number; NULL until created |
| `branch` | Git branch name |
| `position` | 1-based order (1 = bottom/oldest) |
| `status` | `open`, `merged`, `closed`, `draft` |
| `base_pr_id` | FK → pr_stack (parent in stack) |

### `decision_queue`
Pending human decisions (plan approvals, code reviews, fix approvals).

| Column | Notes |
|--------|-------|
| `issue_id` | FK → issues |
| `type` | `PLAN_REVIEW`, `CODE_REVIEW`, `FIX_APPROVAL`, `AI_CODE_REVIEW`, `AI_PLAN_REVIEW` |
| `artifact_ref` | Path to the plan file, or JSON blob of review comments |
| `feedback_json` | User's feedback after resolving |
| `verdict` | `approved`, `rejected`, or NULL (pending) |
| `resolved_at` | Set when verdict recorded |

When an issue moves to **DONE**, all pending decisions for it are cleared (verdict = `rejected`, feedback = `"Cleared — issue moved to DONE"`).

### `agent_runs`
One row per agent invocation.

| Column | Notes |
|--------|-------|
| `issue_id` | FK → issues |
| `agent_type` | `setup`, `planner`, `plan-reviewer`, `coder`, `reviewer`, `git-agent`, `fixer`, `watcher` |
| `started_at` / `exited_at` | Timestamps |
| `exit_code` | NULL while running |
| `log_path` | Absolute path to the JSONL run log |

### `activity_log`
Append-only audit trail. Types include: `agent_started`, `agent_completed`, `agent_failed`, `decision_approved`, `decision_rejected`, `steered`, `paused`, `resumed`, `ignored`, `unignored`, `retried`, `completed`, `reset`, `advanced`.

### `settings`
Key/value config. Defaults in `db.ts` `DEFAULT_SETTINGS`. Editable via dashboard.

Important keys: `concurrency_limit`, `scheduler_interval_seconds`, `model`, `linear_team`, `wt_root`, `branch_prefix`, `default_branch`, `github_repo`, `ai_review_max_rounds`.

### `scheduler_state`
Single row (id=1). Tracks whether the scheduler is running and its PID.

---

## Agent System

### How Agents Are Spawned

1. `scheduler.ts` `tick()` calls `listSchedulableIssues()` — returns unlocked issues in actionable states
2. For each issue, `spawnAgent()` looks up `STATE_AGENT_MAP[state]` → agent type
3. Issue is locked (`locked_at`, `agent_pid`) before spawning
4. A detached Node.js child process is spawned (`agent-runner.js`, `setup.js`, or `watcher.js`)
5. Agent runs, writes to its log file, updates DB, and unlocks the issue on exit

Concurrency is controlled by `concurrency_limit` (default 2). Stale locks older than 10 minutes are reaped as FAILED.

### Agent Types & Responsibilities

| Agent | Script | State it handles |
|-------|--------|-----------------|
| `setup` | `setup.js` | SETTING_UP → PLANNING |
| `planner` | `agent-runner.js` | PLANNING → AI_PLAN_REVIEWING |
| `plan-reviewer` | `agent-runner.js` | AI_PLAN_REVIEWING → AWAITING_PLAN_APPROVAL or PLANNING |
| `coder` | `agent-runner.js` | WORKING → AI_REVIEWING |
| `reviewer` | `agent-runner.js` | AI_REVIEWING → AWAITING_CODE_REVIEW or WORKING |
| `git-agent` | `agent-runner.js` | CREATING_PR → WATCHING_PR; PUSHING → WATCHING_PR |
| `fixer` | `agent-runner.js` | FIXING → PUSHING |
| `watcher` | `watcher.js` | WATCHING_PR → DONE or AWAITING_FIX_APPROVAL |

### System Prompts

Each LLM agent's system prompt is in `agents/{type}.md`. These can be edited live via the dashboard (Settings → Agent Prompts). The `self-improve.js` script automatically appends patterns learned from PR review comments to `agents/coder.md` after each completed issue.

### Context Bundle

`agent-runner.js` `buildContextBundle()` assembles the user message sent to the LLM:
- Linear issue title, description, comments
- Project file contents (`plan.md`)
- Worktree path
- Steering context (if set)
- Pending decision feedback (if retrying after rejection)

### Verdict Files

Some agents write verdict JSON files to `projects/{id}/` that `agent-runner.js` reads after the LLM exits:
- `plan-review-verdict.json` — `{ verdict: "approved"|"needs_changes", summary, feedback[] }`
- `review-verdict.json` — same shape

---

## Project File (`plan.md`)

Each issue has a project file at `projects/{id}/plan.md` (path stored in `issues.project_file_path`). It's the agent's primary working document.

```markdown
---
linear-id: TEAM-1234
pr-url:
base-branch: main
app: pricing
layer: frontend
started: 2026-01-01T00:00:00.000Z
merged:
branch-name: user/TEAM-1234-some-feature
project:
milestone:
---
Brief summary of the work.

# PR Stack
- PR 1: ...
- PR 2: ...

# TODO
- [ ] Task 1
- [x] Task 2 (done)

# Decisions Made
- Used approach X because Y

# Log
## Planning complete
*2026-01-01T...*
Notes from planner.
```

---

## Linear Integration

Forge syncs issue state to Linear as it progresses:

| Forge states | Linear state |
|---|---|
| SETTING_UP, PLANNING, AWAITING_PLAN_APPROVAL, WORKING, AI_REVIEWING | `In Progress` |
| AWAITING_CODE_REVIEW, CREATING_PR, WATCHING_PR, AWAITING_FIX_APPROVAL, FIXING, PUSHING | `In Review` |
| DONE | `Done` |
| PAUSED, IGNORED, FAILED | *(no sync)* |

Syncing is de-duplicated via `issues.linear_state` — it only calls the `linear` CLI if the target state differs from the last-synced value.

**IGNORED** specifically does not sync to Linear, making it safe to use when you want to remove an issue from Forge's queue without affecting its Linear state.

---

## Dashboard API

The Express dashboard (`dashboard/server.js`) runs on port 3142 (configurable). Key endpoints:

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/overview` | Issues, decisions, running agents, scheduler state |
| GET | `/api/issues` | All issues |
| GET | `/api/issues/:id` | Issue detail + PRs, decisions, runs, plan, activity |
| PATCH | `/api/issues/:id` | Actions: `pause`, `unpause`, `ignore`, `unignore`, `steer`, `clear-steer`, `advance`, `retry`, `reset` |
| DELETE | `/api/issues/:id` | Remove issue + worktree |
| GET | `/api/issues/:id/diff` | Git diff vs base branch |
| GET | `/api/issues/:id/listen` | SSE stream of live agent output |
| POST | `/api/issues/:id/sync-prs` | Sync PR stack from GitHub |
| GET | `/api/decisions` | Pending decisions |
| POST | `/api/decisions/:id/resolve` | Approve or reject a decision |
| GET | `/api/archive` | DONE issues |
| GET | `/api/linear/issues` | Fetch assignee's open Linear issues |
| POST | `/api/linear/enqueue` | Add a Linear issue to Forge |
| GET/PUT | `/api/agents/:type/prompt` | Read/write agent system prompts |
| GET/PATCH | `/api/settings` | Read/update settings |

SSE is available at `/api/events` for live dashboard updates (broadcasts `tick`, `issue_added`, `issue_removed`, `decision_resolved`).

---

## `/forge` Slash Commands

Registered in `index.ts`. All run synchronously against `forge.db`.

```
/forge                       — status overview
/forge start                 — start the scheduler
/forge stop                  — stop the scheduler
/forge list                  — list all issues
/forge add <LINEAR-ID>       — enqueue a Linear issue (fetches title from Linear)
/forge add "title"           — add a manual issue
/forge queue                 — show pending decisions
/forge approve <decision-id> — approve a decision
/forge reject <id> [msg]     — reject a decision
/forge pause <issue-id>      — pause (resumes to previous state)
/forge resume <issue-id>     — resume a paused issue
/forge ignore <issue-id>     — ignore (no Linear sync; won't be scheduled)
/forge unignore <issue-id>   — resume an ignored issue
/forge steer <id> <text>     — inject steering instructions for next agent run
/forge dashboard             — start dashboard server
/forge reset                 — wipe entire database (destructive)
```

---

## Common Patterns When Modifying Forge

### Adding a new issue state

1. Add it to `IssueState` union in `db.ts`
2. Decide if it's schedulable — if so, add to `STATE_AGENT_MAP` in `scheduler.ts`
3. Exclude it from `listActiveIssues` / `listSchedulableIssues` SQL if it's terminal/suspended
4. Exclude it from `reapStaleIssues` if agents shouldn't be reaped in it
5. Add it to `FORGE_LINEAR_STATE_MAP` in `dashboard/server.js` and `LINEAR_STATE_MAP` in `agent-runner.js` if it should sync to Linear
6. Add it to `STATE_LABELS` and add a `state-{STATE}` CSS class in the dashboard frontend

### Adding a new dashboard action (PATCH /api/issues/:id)

Add a `case` to the `switch (action)` block in `dashboard/server.js`. Mirror it in:
- `db.ts` (method on `ForgeDB` if it needs a reusable query)
- `index.ts` (if it should be available as a `/forge` command)

### Adding a new agent type

1. Create the system prompt in `agents/{type}.md`
2. Add the agent type to `AgentType` in `db.ts`
3. Map the relevant state → agent type in `scheduler.ts` `STATE_AGENT_MAP`
4. Handle it in `agent-runner.js` `main()` (or write a standalone deterministic script like `setup.js`)

### Changing state transition logic

The canonical state machine is split across two files:
- `scheduler.ts` `STATE_AGENT_MAP` — what runs for each state
- `agent-runner.js` `NEXT_STATE_MAP` — where each agent transitions on success

Keep them in sync.

### Running tests

```bash
cd ~/.pi/agent/extensions/forge
node --test test/db.test.mjs                    # DB layer
node --test test/scheduler.test.mjs             # Scheduler
node --test test/frontend.test.mjs              # Frontend parsing
node --test test/summary.test.mjs               # Summary generation
node --test test/dashboard.test.mjs             # Dashboard API
# or all at once:
npm test
```

### Database migrations

Add incremental migrations to `db.ts` `runMigrations()`. Use the `addColumn` helper for safe `ALTER TABLE ADD COLUMN` calls that no-op if the column already exists. For constraint changes (e.g. expanding a CHECK), use the rename-recreate-copy pattern already demonstrated for `decision_queue`.

The `dashboard/server.js` also runs its own inline migration block — keep both in sync when adding columns to shared tables.

---

## External Tools Forge Relies On

| Tool | Used for |
|------|---------|
| `linear` CLI | Fetching issue details, updating issue state |
| `wt` (worktrunk) | Creating/removing git worktrees |

> **Note — `core.bare` fix:** `worktrees` is a bare clone. If `core.bare = true` is set in its config, git refuses commands like `git status` in any linked worktree (it resolves the worktree's `commondir` back to the bare root and sees the flag). `setup.js` runs `git config core.bare false` in `WT_ROOT` as step 3 of every new-issue setup, which fixes all sibling worktrees without affecting how the repo functions.
| `gh` (GitHub CLI) | Fetching PR status, review comments, CI checks |
| `git` | Diffs, commits, rebases, pushes, fetching branches |
| `@earendil-works/pi-coding-agent` SDK | Running LLM agent sessions via `pi-sdk-runner.mjs` |

---

## Concurrency & Locking

Issues are locked via `issues.locked_at` + `issues.agent_pid` before any agent is spawned. The lock is acquired with a conditional UPDATE (`WHERE locked_at IS NULL`) to prevent double-spawning. Locks older than 10 minutes are reaped as FAILED by the scheduler's `reapStaleIssues()`.

SQLite WAL mode with `busy_timeout = 5000` handles concurrent readers/writers between the scheduler, agent processes, and dashboard server.
