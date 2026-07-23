# Forge — Developer Guide for LLM Agents

Forge is a standalone AI issue-lifecycle system for Linear-backed engineering work. It uses the pi SDK to run agents that plan work, implement code in isolated worktrees, review it, create/push PRs, watch GitHub, loop on feedback, and mark issues done.

Forge can run as:

- a **standalone backend**: scheduler, agents, SQLite DB, REST/SSE dashboard
- a **desktop app**: native macOS window plus local CLI bridge for Linear tooling
- an optional **pi extension shim**: `/forge` commands inside pi

This file is for agents modifying Forge itself. For user-facing setup and screenshots, keep [`README.md`](README.md) in sync.

---

## Non-negotiable rules

- Do **not** commit runtime/private data:
  - `forge.db*`
  - `projects/`
  - `.env*`
  - `workspace-run.config.json`
  - `node_modules/`
  - `dist/`
  - logs or PID files
- Do **not** use `git commit --amend`, interactive rebase, squash, or any history rewrite.
- If pushing to GitHub snapshots, use `./scripts/push-github-snapshot`; do not normal-push local history to the `github` remote.
- When changing dashboard frontend source, run `npm run dashboard:build` and include built `dashboard/public/v3/*` assets.
- Keep state-machine changes synchronized across DB, scheduler, agent runner, dashboard API, and dashboard UI.
- Prefer small, targeted edits. Avoid unrelated cleanup.

---

## Repository locations and remotes

Common local source path:

```text
~/.pi/agent/extensions/forge
```

Common VM deployed copy:

```text
~/forge
```

Remotes:

- `origin` — canonical private git remote.
- `github` — public snapshot remote. Use `scripts/push-github-snapshot` so snapshots are sanitized and history-free.

---

## Architecture overview

```text
Linear/manual issue
  │
  ▼
forge.db (SQLite, WAL)  ←── dashboard + scheduler + agents all read/write here
  │
  ├── dashboard/server.js       Express REST API + SSE + desktop job API
  ├── dashboard/frontend/src/   Preact dashboard source
  ├── desktop/main.ts           Deno Desktop wrapper + macOS Linear CLI bridge
  │
  ▼
scheduler.ts
  │
  ├── setup.js         deterministic worktree/project setup
  ├── agent-runner.js  pi SDK LLM agents
  └── watcher.js       deterministic GitHub PR watcher
```

### Runtime ownership

- The backend owns `forge.db`.
- The scheduler spawns detached Node processes for setup/agents/watchers.
- The dashboard exposes APIs and live SSE events.
- The desktop bridge can run local macOS Linear CLI jobs while a VM backend remains DB owner.

---

## Key files

| File | Purpose |
|---|---|
| `db.ts` | SQLite schema, migrations, row types, settings, issue/decision/run helpers |
| `scheduler.ts` | `ForgeScheduler`, schedulable-state selection, state → agent spawning |
| `setup.js` | Deterministic worktree and `plan.md` setup |
| `agent-runner.js` | LLM agent execution via pi SDK, context assembly, transitions, decisions, retries |
| `watcher.js` | PR state/review/check/merge polling through GitHub CLI |
| `dashboard/server.js` | Express REST API, SSE, desktop jobs, diffs, VM/workspace endpoints |
| `dashboard/frontend/src/main.ts` | Preact dashboard app source |
| `dashboard/frontend/src/style.css` | Preact dashboard styles source |
| `dashboard/public/v3/*` | Built dashboard assets; commit after frontend builds |
| `desktop/main.ts` | Deno Desktop app and local Linear CLI bridge |
| `bin/forge.js` | Standalone CLI entrypoint |
| `bin/forge-dashboard.js` | Dashboard server executable |
| `index.ts` | Optional pi extension shim for `/forge` commands |
| `pi-sdk-runner.mjs` | pi SDK session runner used by LLM agents |
| `agents/*.md` | Agent prompts editable from dashboard |
| `projects/{id}/plan.md` | Per-issue working document; runtime, do not commit |
| `generate-summary.js` | Writes completion summaries |
| `reflect.js` / `self-improve.js` | Review-learning/reflection support |
| `scripts/first-run-setup` | First-run setup wizard |
| `scripts/push-github-snapshot` | Sanitized GitHub snapshot push script |
| `scripts/workspace-run` | Workspace command runner |

---

## State machine

Issue states are defined in `db.ts` `IssueState`.

Primary flow:

```text
PENDING
  └─ scheduler promotes to SETTING_UP
       └─ setup → PLANNING
            └─ planner → AI_PLAN_REVIEWING
                 ├─ plan-reviewer needs changes → PLANNING
                 └─ plan-reviewer approved → AWAITING_PLAN_APPROVAL
                      └─ human approves → WORKING
                           └─ coder → AI_REVIEWING
                                ├─ reviewer needs changes → WORKING
                                └─ reviewer approved → AWAITING_CODE_REVIEW
                                     └─ human approves → CREATING_PR
                                          └─ git-agent → WATCHING_PR
                                               ├─ watcher sees merge queue → IN_MERGE_QUEUE
                                               ├─ watcher sees review comments → AWAITING_FIX_APPROVAL
                                               │    └─ human approves → FIXING
                                               │         └─ fixer → PUSHING
                                               │              └─ git-agent → WATCHING_PR
                                               └─ watcher sees merged stack → DONE
```

Split/rebase flow:

```text
SPLIT_PLANNING → AWAITING_SPLIT_APPROVAL → SPLITTING → WATCHING_PR
REBASING → WATCHING_PR
```

Suspended/terminal/special:

- `PAUSED` — user suspended; resumes to `previous_state`.
- `IGNORED` — removed from queue without Linear sync.
- `FAILED` — agent/runtime failure; inspect and retry.
- `STEERING` — legacy/special flag-like state; normal steering lives in `steering_context`.
- `DONE` — terminal; pending decisions are cleared.

### Canonical state-machine locations

Keep these in sync:

| Concern | File/location |
|---|---|
| State type union | `db.ts` `IssueState` |
| Agent type union | `db.ts` `AgentType` |
| Schedulable issue SQL | `db.ts` `listSchedulableIssues()` |
| State → spawned agent | `scheduler.ts` `STATE_AGENT_MAP` |
| Start-state promotion | `scheduler.ts` `START_STATE_MAP` |
| Successful agent transitions | `agent-runner.js` `NEXT_STATE_MAP` plus special AI review handling |
| Decision type for next state | `agent-runner.js` `determineDecisionType()` |
| Linear state sync | `agent-runner.js` `LINEAR_STATE_MAP`, `dashboard/server.js` `FORGE_LINEAR_STATE_MAP` |
| Dashboard labels/actions/phases | `dashboard/frontend/src/main.ts` |
| Dashboard state styles | `dashboard/frontend/src/style.css` |

---

## Agents

| Agent | Script | Handles |
|---|---|---|
| `setup` | `setup.js` | `SETTING_UP → PLANNING` |
| `planner` | `agent-runner.js` | `PLANNING → AI_PLAN_REVIEWING` |
| `plan-reviewer` | `agent-runner.js` | `AI_PLAN_REVIEWING → AWAITING_PLAN_APPROVAL` or back to `PLANNING` |
| `coder` | `agent-runner.js` | `WORKING → AI_REVIEWING` |
| `reviewer` | `agent-runner.js` | `AI_REVIEWING → AWAITING_CODE_REVIEW` or back to `WORKING` |
| `git-agent` | `agent-runner.js` | `CREATING_PR → WATCHING_PR`, `PUSHING → WATCHING_PR` |
| `fixer` | `agent-runner.js` | `FIXING → PUSHING` |
| `watcher` | `watcher.js` | `WATCHING_PR` / `IN_MERGE_QUEUE` → `DONE` or `AWAITING_FIX_APPROVAL` |
| `split-planner` | `agent-runner.js` | `SPLIT_PLANNING → AWAITING_SPLIT_APPROVAL` |
| `splitter` | `agent-runner.js` | `SPLITTING → WATCHING_PR` |
| `rebaser` | `agent-runner.js` | `REBASING → WATCHING_PR` |

### Agent prompts

- Prompts live in `agents/{type}.md`.
- Dashboard exposes prompt editing through `/api/agents/:type/prompt`.
- The prompt list must match valid agent types where applicable.

### Agent context

`agent-runner.js` builds a context bundle containing:

- issue row and Linear/manual context
- cached desktop Linear issue data when server-side Linear is disabled
- `plan.md`
- worktree path
- steering instructions
- decision feedback
- PR/review/fix context as applicable

### Verdict files

AI reviewers write verdict JSON under `projects/{id}/verdicts/` and/or current verdict paths that `agent-runner.js` reads. Expected verdict shape is broadly:

```json
{ "verdict": "approved", "summary": "...", "feedback": [] }
```

or:

```json
{ "verdict": "needs_changes", "summary": "...", "feedback": ["..."] }
```

---

## Database model

`db.ts` is the source of truth. The dashboard also contains inline migrations for shared tables; keep them aligned.

Core tables:

| Table | Purpose |
|---|---|
| `issues` | One row per tracked Linear/manual issue |
| `pr_stack` | PR stack entries for an issue |
| `decision_queue` | Pending and historical human/AI decisions |
| `agent_runs` | One row per spawned setup/agent/watcher run |
| `activity_log` | Audit log for issue lifecycle events |
| `assets` | Locally fetched issue assets |
| `settings` | Runtime configuration |
| `scheduler_state` | Scheduler running flag/PID |
| `desktop_jobs` | Jobs claimed/completed by desktop bridge |
| `desktop_cache` | Cached desktop bridge results |
| `learnings` | Review/reflection learnings |

Important `issues` columns:

- `state`, `previous_state`
- `locked_at`, `agent_pid`
- `steering_context`
- `pi_sessions_json`
- `project_file_path`, `wt_path`
- `ai_review_rounds`, `total_ai_review_rounds`
- `retry_count`
- `pr_approved_at`
- `auto_fix_enabled`
- `focus_rank`
- `linear_state`

Important settings include:

- `setup_completed`
- `concurrency_limit`
- `scheduler_interval_seconds`
- `dashboard_port`
- `linear_enabled`, `linear_team`, `linear_poll_interval_seconds`
- `github_repo`
- `worktree_provider`, `repo_root`, `worktree_root`, `wt_root`
- `branch_prefix`, `default_branch`
- `model` and per-agent model overrides
- `forge_reuse_pi_sessions`
- `ai_review_max_rounds`, `auto_retry_max`
- VM/workspace settings: `vm_ssh_target`, path prefixes, command settings

---

## Dashboard/API

`dashboard/server.js` is the backend. It serves the dashboard, REST API, SSE, desktop bridge endpoints, diffs, logs, workspace commands, and prompt/settings APIs.

Important endpoint groups:

| Endpoint group | Purpose |
|---|---|
| `/api/health` | Backend health |
| `/api/events` | SSE dashboard updates |
| `/api/overview` | Issues, decisions, running agents, scheduler state |
| `/api/issues` | List/create issues |
| `/api/issues/:id` | Issue detail and issue actions |
| `/api/issues/:id/diff` | Git diff/review data |
| `/api/issues/:id/listen` | Live agent log stream |
| `/api/issues/:id/ask` | Ask/sidecar issue assistant |
| `/api/issues/:id/sync-prs` | Sync PR stack from GitHub |
| `/api/issues/:id/prs` | Add/update PR stack entries |
| `/api/issues/:id/vm-launch` | Launch configured workspace commands |
| `/api/issues/:id/reflect` | Run reflection/learning flow |
| `/api/issues/:id/generate-tour` | Generate dashboard tour artifact |
| `/api/decisions` | Pending decisions |
| `/api/decisions/:id/resolve` | Approve/reject decisions |
| `/api/archive` | Completed issues |
| `/api/settings` | Read/update settings |
| `/api/agents/:type/prompt` | Read/update agent prompts |
| `/api/learnings` | Read/update learnings |
| `/api/linear/issues` | Linear issue listing through server or desktop bridge |
| `/api/linear/enqueue` | Add Linear issues to Forge |
| `/api/desktop/*` | Desktop bridge status/jobs/heartbeat |
| `/api/vm/*` | VM/workspace process status |
| `/api/runs/:id/log` | Agent run log content |

### Issue PATCH actions

`PATCH /api/issues/:id` supports lifecycle actions such as:

- `pause`, `unpause`
- `ignore`, `unignore`
- `steer`, `clear-steer`
- `advance`, `jump`
- `retry`, `reset`
- `enable-auto-fix`, `disable-auto-fix`
- split/rebase related actions

When adding an action, update dashboard UI wiring and tests.

---

## Dashboard frontend rules

Source of truth:

- `dashboard/frontend/src/main.ts`
- `dashboard/frontend/src/style.css`

Build output:

- `dashboard/public/v3/forge-dashboard.js`
- `dashboard/public/v3/forge-dashboard.css`

Rules:

- Always run `npm run dashboard:check` after TypeScript/UI changes.
- Always run `npm run dashboard:build` after source/style changes.
- Commit built `dashboard/public/v3/*` assets with source changes.
- Do not rely on legacy `dashboard/public/app.js` unless specifically modifying classic v2 UI.
- Avoid global rerenders that reset UI state.
- Preserve panel/modal/tab/query-param state across SSE ticks and detail refreshes.
- Use overlays/toasts for status messages; avoid layout-shifting banners.
- Filter unresolved decisions for active decision UI.

---

## Desktop bridge

The desktop app (`desktop/main.ts`) is a Deno Desktop wrapper. It can point at a local or VM backend.

Key behavior:

- starts/reuses dashboard when local
- stores backend selection in `~/.config/forge/forge-desktop.json`
- polls `/api/desktop/jobs`
- runs Linear CLI commands locally on macOS
- posts results to `/api/desktop/jobs/:id/complete`
- maintains desktop heartbeat/status

Desktop job types currently include:

- `linear.fetchIssue`
- `linear.syncState`
- `linear.listAssigned`

For VM deployments, keep backend `linear_enabled=false` and run the desktop bridge on macOS.

---

## Linear and GitHub integration

### Linear

Forge supports two Linear modes:

1. server-side `linear` CLI when `linear_enabled=true`
2. desktop bridge jobs when `linear_enabled=false`

Use [`schpet/linear-cli`](https://github.com/schpet/linear-cli). Do not assume a Linear API token is present.

Linear sync map:

| Forge states | Linear state |
|---|---|
| `SETTING_UP`, `PLANNING`, `AWAITING_PLAN_APPROVAL`, `WORKING`, `AI_REVIEWING` | `In Progress` |
| `AWAITING_CODE_REVIEW`, `CREATING_PR`, `WATCHING_PR`, `IN_MERGE_QUEUE`, `SPLIT_*`, `AWAITING_FIX_APPROVAL`, `FIXING`, `PUSHING`, `REBASING` | `In Review` |
| `DONE` | `Done` |
| `PAUSED`, `IGNORED`, `FAILED` | no sync |

`issues.linear_state` is the de-dup guard.

### GitHub

Forge uses `gh` from the backend environment for PR state. If running in a VM, install/authenticate `gh` in the VM.

Typical commands used by Forge include:

- `gh pr view`
- `gh pr list`
- `gh api`
- `gh api graphql`

---

## Worktrees and workspace commands

Forge supports:

- raw `git worktree` (`worktree_provider=git`)
- Worktrunk (`worktree_provider=wt`)

Important settings:

- `repo_root`
- `worktree_root`
- `wt_root`
- `branch_prefix`
- `default_branch`

Workspace command support lives in:

- `scripts/workspace-run`
- `docs/workspace-run.md`
- dashboard VM/workspace endpoints
- VM command settings in `settings`

Be tolerant of VM/macOS path differences and legacy worktree prefixes.

---

## Project files

Each issue gets `projects/{id}/` at runtime. Do not commit these files.

Typical files:

| File | Purpose |
|---|---|
| `plan.md` | Human-readable plan/TODO/log; primary agent artifact |
| `run-{N}-{type}.log` | JSONL/stdout agent logs |
| `summary.md` | Completion summary |
| `verdicts/*.json` | AI review verdict archive |
| tour/review artifacts | Generated dashboard support files |

`plan.md` frontmatter commonly includes:

```markdown
---
linear-id: TEAM-1234
pr-url:
base-branch: main
app:
layer:
started: 2026-01-01T00:00:00.000Z
merged:
branch-name: user/team-1234-title
project:
milestone:
---
```

---

## Common modification playbooks

### Add a new issue state

1. Add to `IssueState` in `db.ts`.
2. Add/migrate DB constraints if needed.
3. Decide if schedulable; update `db.ts` `listSchedulableIssues()` and `scheduler.ts` `STATE_AGENT_MAP`.
4. Add transitions in `agent-runner.js` or relevant deterministic script.
5. Add decision mapping if it creates a human gate.
6. Add Linear sync mapping if applicable.
7. Add dashboard labels, phase mapping, actions, and styles.
8. Add/update tests.

### Add a new agent type

1. Add to `AgentType` in `db.ts`.
2. Create `agents/{type}.md`.
3. Map state → agent in `scheduler.ts`.
4. Handle in `agent-runner.js` or create a deterministic script.
5. Add model override setting if needed.
6. Expose prompt editing if user-visible.
7. Add tests.

### Add a dashboard action

1. Add backend case in `dashboard/server.js` `PATCH /api/issues/:id`.
2. Add DB helper if logic is reused.
3. Add frontend action wiring in `dashboard/frontend/src/main.ts`.
4. Add/adjust CSS if needed.
5. Add tests in dashboard action/frontend suites.
6. Mirror in `index.ts` if slash command support is needed.

### Add/change a setting

1. Add default in `db.ts` `DEFAULT_SETTINGS`.
2. Add migration/default seeding if needed.
3. Add dashboard inline migration/default if server depends on it before `ForgeDB` initialization.
4. Add UI control in dashboard settings.
5. Add setup wizard prompt if first-run relevant.
6. Document in README.

### Add/change DB schema

1. Update `db.ts` migrations.
2. Use safe `ALTER TABLE ADD COLUMN` helper patterns when possible.
3. For CHECK constraint changes, use rename/recreate/copy pattern.
4. Keep dashboard inline migrations in sync.
5. Add DB tests.

---

## Commands

From the Forge root:

```bash
# Syntax checks
node --check dashboard/server.js
node --check setup.js
node --check agent-runner.js
node --check watcher.js
node --check generate-summary.js

# Dashboard frontend
npm run dashboard:check
npm run dashboard:build

# Tests
npm test
npm run test:db
npm run test:sched
npm run test:fe
npm run test:api
npm run test:pi-sdk
```

Run targeted tests when possible; report exact failures if known flaky tests fail.

---

## Deployment / VM workflow

After changes are merged/pushed to `origin`, update the VM copy and restart dashboard:

```bash
ssh orb 'cd ~/forge && git pull --ff-only'
ssh orb 'pkill -f "node ./bin/forge-dashboard.js --port 3142" || true'
ssh orb 'cd ~/forge && nohup node ./bin/forge-dashboard.js --port 3142 > /tmp/forge-dashboard.log 2>&1 &'
ssh orb 'cd ~/forge && git rev-parse --short HEAD; ps -ef | grep "bin/forge-dashboard" | grep -v grep; tail -8 /tmp/forge-dashboard.log'
```

If `pkill` makes the SSH command exit early, run restart as separate commands.

---

## Snapshot publishing

Public GitHub snapshots are intentionally not normal git pushes of local history.

Use:

```bash
./scripts/push-github-snapshot
```

The script:

- scans tracked files for blocked runtime/build paths
- scans tracked files for obvious private data and credentials
- creates a fresh snapshot commit from the current tree
- pushes that commit to `github/main`

Daily cron may run this automatically. Keep the script conservative.

---

## Debugging helpers

```bash
# API
curl -sS http://localhost:3142/api/health
curl -sS http://localhost:3142/api/overview | python3 -m json.tool
curl -sS http://localhost:3142/api/issues/<id> | python3 -m json.tool
curl -sS http://localhost:3142/api/issues/<id>/diff
curl -sS http://localhost:3142/api/decisions | python3 -m json.tool

# Logs
ssh orb 'tail -100 /tmp/forge-dashboard.log'

# GitHub auth in backend env
gh auth status
gh repo view OWNER/REPO

# Linear desktop bridge status
curl -sS http://localhost:3142/api/desktop/status | python3 -m json.tool
```

---

## External tools

| Tool | Required where | Purpose |
|---|---|---|
| `node` / `npm` | backend + local dev | services, scripts, tests |
| `git` | backend | branches, worktrees, diffs, commits, pushes |
| `gh` | backend; recommended locally | PR status, checks, comments, GitHub API |
| `linear` | macOS desktop bridge or backend if enabled | Linear issue fetch/state sync/listing |
| `deno` | macOS desktop app | Deno Desktop wrapper |
| `wt` | optional backend | Worktrunk worktree provider |
| pi SDK/auth | backend agent user | LLM agent sessions |

---

## Docs to keep aligned

- [`README.md`](README.md) — user-facing overview/install/capabilities/screenshots
- [`docs/workspace-run.md`](docs/workspace-run.md) — workspace command behavior
- [`docs/DASHBOARD_FRONTEND.md`](docs/DASHBOARD_FRONTEND.md) — frontend architecture notes
- [`docs/UX_AUDIT.md`](docs/UX_AUDIT.md) — dashboard UX notes
- [`docs/AUDIT-2026-07-03.md`](docs/AUDIT-2026-07-03.md) — correctness audit
