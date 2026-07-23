# Forge Dashboard v3 Migration Plan

Date: 2026-07-15
Design reference: `dashboard/public/mockup.html`
Tracking issues: Forge repo issues #1–#11

## Goal

Migrate the live Forge dashboard from the current UI to the approved v3 mockup while keeping the work incremental, shippable, and low-risk.

The target experience covers:

- Queue / pipeline command center
- Right-side issue detail panel
- Archive
- Settings
- Agent Prompts
- Learnings / Reflections
- Review / Diff
- Command palette
- Responsive + accessibility hardening

## Principles

- Do all migration implementation work on a dedicated feature branch, separate from `main` and unrelated Forge work.
- Keep `dashboard/public/mockup.html` as the visual reference until rollout completes.
- Use a proper reactive frontend foundation for new v3 UI work rather than expanding the legacy vanilla `dashboard/public/app.js` architecture.
- Prefer TypeScript + Preact + Vite for the migration unless Phase 0.5 documents a better alternative.
- Avoid a big-bang rewrite of `dashboard/public/app.js`; keep it as legacy/fallback until view parity is reached.
- Preserve existing routes and APIs first; add backend fields only where graceful fallback is insufficient.
- Ship each phase independently.
- Use test-driven development for implementation phases: write/update failing tests first, then implement code to pass them.
- Update the Issue map status whenever a phase starts or completes so progress is visible at a glance.
- Keep the dashboard usable throughout migration.
- Prefer render-signature / minimal DOM update patterns already introduced to avoid flicker regressions.

## Issue map

| Issue | Phase | Status | Purpose |
|---|---:|---|---|
| — | 0 | Complete | Baseline / guardrails |
| #11 | 0.5 | Complete | Reactive frontend foundation and build/runtime integration |
| #1 | 1 | Complete | App shell, sidebar, and multi-view navigation foundation |
| #2 | 2 | Complete | Queue pipeline rendering and decision inbox |
| #3 | 3 | Complete | Right-side issue detail panel and navigation model |
| #10 | 4 | Complete | Review / Diff page redesign |
| #6 | 5 | Complete | Archive page redesign |
| #7 | 6 | Complete | Settings page redesign |
| #8 | 7 | Complete | Agent Prompts page redesign |
| #9 | 8 | Complete | Learnings / Reflections page redesign |
| #4 | 9 | Complete | Command palette, card activity, runtime/terminal, interaction polish |
| #5 | 10 | Complete | Responsive, accessibility, tests, cleanup, rollout hardening |

## Phase 0 — Baseline / guardrails

Status: complete.

- Dedicated migration branch created: `forge/dashboard-v3-migration`.
- Current carried-forward changes are migration-plan-only and intentionally belong to the migration branch.
- Flicker reductions landed in `dashboard/public/app.js`.
- Mockup v3 landed in `dashboard/public/mockup.html`.
- Keep mockup as design documentation while implementing runtime UI.

Validation baseline:

- `node --check dashboard/public/app.js` — passed 2026-07-16
- `node --test test/frontend.test.mjs` — passed 2026-07-16
- `npm test` — passed 2026-07-16

## Phase 0.5 — Reactive frontend foundation (#11)

Status: complete.

Completed 2026-07-16:

- Added TypeScript + Preact + Vite dashboard frontend foundation.
- Added contained mount point in the legacy dashboard shell.
- Added stable built assets under `dashboard/public/v3/`.
- Added TDD coverage in `test/dashboard-reactive-foundation.test.mjs` and included it in frontend/default test scripts.
- Documented the frontend migration boundary in `docs/DASHBOARD_FRONTEND.md`.

Validation:

- `npm run dashboard:check` (`tsc --noEmit`) — passed 2026-07-16
- `node --test test/dashboard-reactive-foundation.test.mjs` — passed 2026-07-16
- `npm run dashboard:build` — passed 2026-07-16
- `node --check dashboard/server.js` — passed 2026-07-16
- `npm test` — passed 2026-07-16

Purpose:

Add the frontend architecture needed for the v3 dashboard before visual migration begins. This phase should make later phases build new UI in a proper reactive app instead of continuing to grow the legacy vanilla JS file.

Scope:

- Choose and document the reactive UI stack. Default recommendation: TypeScript + Preact + Vite.
- Add frontend build/dev/typecheck scripts for the dashboard.
- Add a new dashboard frontend source root, e.g. `dashboard/frontend/` or `dashboard/src/`.
- Mount a minimal reactive app into the dashboard shell.
- Configure `dashboard/server.js` to serve built assets while preserving `/api/*`, SSE, and existing static routes.
- Define compatibility boundaries for API calls, SSE/event handling, route/view state, and shared issue/state normalization.
- Keep `dashboard/public/app.js` available as legacy/fallback until reactive view parity is reached.
- Do not convert all views in this phase.

Primary files:

- `package.json`
- `dashboard/server.js`
- `dashboard/public/index.html`
- new dashboard frontend source directory (`.ts`/`.tsx`)
- frontend build/typecheck/test config as needed

Validation:

- Frontend build and typecheck scripts for the new dashboard app
- `node --check dashboard/server.js`
- `npm test`
- Manual browser smoke test: dashboard loads, `/api/overview` works, SSE still connects, and legacy fallbacks behave as expected

## Phase 1 — App shell and navigation foundation (#1)

Status: complete.

Completed 2026-07-16:

- Added persistent TypeScript/Preact sidebar shell.
- Added first-class view containers for Queue, Archive, Settings, Agent Prompts, Learnings, and Review.
- Added Queue scaffold containers for decision inbox, toolbar, pipeline wrapper, and detail panel.
- Added sidebar footer status fields backed by existing overview/settings APIs with fallbacks.
- Added TDD coverage in `test/dashboard-shell.test.mjs`.

Validation:

- `npm run dashboard:check` — passed 2026-07-16
- `node --test test/dashboard-shell.test.mjs` — passed 2026-07-16
- `npm run dashboard:build` — passed 2026-07-16
- `npm test` — passed 2026-07-16

Scope:

- Build the v3 shell in the reactive app established by Phase 0.5.
- Replace header-centric layout with persistent sidebar.
- Add view containers for Queue, Archive, Settings, Agent Prompts, Learnings, Review.
- Sidebar nav should switch views while preserving current route behavior where needed.
- Sidebar footer should show scheduler status, active count, decisions awaiting count, failed count, done-this-week count, current/default model, and runtime/backend status if available.
- Keep existing modals, archive, settings, review, and issue routes functional during the transition.

Primary files:

- new dashboard frontend source directory (`.ts`/`.tsx`)
- `dashboard/public/index.html`
- `dashboard/public/style.css`
- `dashboard/public/app.js` only for legacy/fallback wiring during transition

## Phase 2 — Queue pipeline and decision inbox (#2)

Status: complete.

Completed 2026-07-16:

- Added six-stage reactive queue pipeline: Available, Planning, Building, Awaiting You, In Review, Paused / Failed.
- Added `classifyIssueToPipelineStage` state mapping for Forge issue states.
- Added reactive decision inbox and queue toolbar.
- Added pipeline issue cards with basic actions and empty states.
- Added TDD coverage in `test/dashboard-pipeline.test.mjs`.

Validation:

- `npm run dashboard:check` — passed 2026-07-16
- `node --test test/dashboard-shell.test.mjs test/dashboard-pipeline.test.mjs` — passed 2026-07-16
- `npm run dashboard:build` — passed 2026-07-16
- `npm test` — passed 2026-07-16

Scope:

- Convert old queue columns into six-stage horizontal pipeline:
  1. Available
  2. Planning
  3. Building
  4. Awaiting You
  5. In Review
  6. Paused / Failed
- Add collapsible decision inbox above the pipeline.
- Add queue toolbar with search, quick filters, sort, and Review next action.
- Add state/progress helpers for pipeline stage, progress percentage, accent class, and decision previews.
- Add inline quick actions for approve, request changes, open diff, view plan, and fix selected.

Primary files:

- `dashboard/public/app.js`
- `dashboard/public/style.css`
- `test/frontend.test.mjs`

## Phase 3 — Right-side detail panel (#3)

Status: complete.

Completed 2026-07-16:

- Added right-side issue detail slide-over panel opened from queue issue cards.
- Added detail panel data loading from existing `/api/issues/:id` endpoint.
- Added tabs: Overview, Plan, Activity, Learning.
- Added initial PR stack, fix approval, and danger zone sections with graceful empty states.
- Added TDD coverage in `test/dashboard-detail-panel.test.mjs`.

Validation:

- `npm run dashboard:check` — passed 2026-07-16
- `node --test test/dashboard-detail-panel.test.mjs` — passed 2026-07-16
- `npm run dashboard:build` — passed 2026-07-16
- `npm test` — passed 2026-07-16

Scope:

- Open queue issue clicks in a right-side slide-over panel.
- Preserve full-page issue routes for direct links, archive flows, and browser history.
- Add tabs: Overview, Plan, Activity, Learning.
- Reuse existing `/api/issues/:id` response first.
- Add pending decision controls inside the panel.
- Add fix approval checkbox UX.
- Add PR stack panel with CI/review/merge status.
- Add danger zone at bottom.
- Add auto-fix toggle UI if API exists; otherwise show disabled/fallback state.
- Refresh open panel on SSE without closing it or resetting queue scroll.

Primary files:

- `dashboard/public/app.js`
- `dashboard/public/style.css`
- `dashboard/server.js` only if new fields/actions are required

## Phase 4 — Review / Diff page redesign (#10)

Status: complete.

Completed 2026-07-16:

- Added a dedicated reactive Review / Diff workspace.
- Added active v3 sidebar navigation state with queue/review view switching and migrated-view placeholders.
- Added sticky review header, file sidebar, local reviewed-file state, AI tour summary, diff block, inline comment box, general feedback box, and approve/request-changes actions.
- Added TDD coverage in `test/dashboard-review-view.test.mjs` and included it in default/frontend/all test scripts.

Validation:

- `npm run dashboard:check` — passed 2026-07-16
- `node --test test/dashboard-review-view.test.mjs` — passed 2026-07-16
- `npm run dashboard:build` — passed 2026-07-16
- `npm test` — passed 2026-07-16

Scope:

- Implement dedicated review layout from mockup:
  - sticky header
  - file sidebar
  - reviewed/unreviewed state
  - AI tour summary
  - diff blocks
  - inline comments
  - general feedback box
  - approve/request changes submit flow
- Preserve existing diff/review decision APIs.
- Add keyboard affordances where practical: next/previous file, mark reviewed, submit review.
- Use client-side reviewed-file state initially unless persistence is clearly needed.

Primary files:

- `dashboard/public/app.js`
- `dashboard/public/style.css`
- `dashboard/server.js` only if reviewed state or tour data requires endpoint changes

## Phase 5 — Archive page (#6)

Status: complete.

Completed 2026-07-16:

- Added reactive Archive view backed by existing `/api/archive`.
- Added v3 stats strip: total completed, completed this week, average time to merge, average PRs per issue.
- Added completed issue card grid with Linear/manual ID, title, merged/update time, PR links, agent run count, and summary availability.
- Added graceful loading, empty, and error states.
- Added TDD coverage in `test/dashboard-archive-view.test.mjs` and included it in default/frontend/all test scripts.

Validation:

- `npm run dashboard:check` — passed 2026-07-16
- `node --test test/dashboard-archive-view.test.mjs` — passed 2026-07-16
- `npm run dashboard:build` — passed 2026-07-16
- `npm test` — passed 2026-07-16

Scope:

- Replace current archive rendering with card-based mockup layout.
- Add stats strip: total completed, completed this week, average time to merge, average PRs per issue.
- Add issue cards with Linear ID, title, merged time, PR links, agent run chain, and run count.
- Degrade gracefully when richer stats are missing.

Primary files:

- `dashboard/public/app.js`
- `dashboard/public/style.css`
- `dashboard/server.js` if richer archive stats are needed

## Phase 6 — Settings page (#7)

Status: complete.

Completed 2026-07-16:

- Added reactive Settings view backed by existing `/api/settings` GET/PATCH endpoints.
- Added grouped settings cards: Scheduler, Models, Integrations, Repository, Runtime, Backend, and Other.
- Added unknown setting preservation under Other.
- Added input type helper for number/checkbox/text plus textarea handling for longer command/context fields.
- Added save/reset UX and setting key descriptions.
- Added TDD coverage in `test/dashboard-settings-view.test.mjs` and included it in default/frontend/all test scripts.

Validation:

- `npm run dashboard:check` — passed 2026-07-16
- `node --test test/dashboard-settings-view.test.mjs` — passed 2026-07-16
- `npm run dashboard:build` — passed 2026-07-16
- `npm test` — passed 2026-07-16

Scope:

- Redesign settings into grouped cards/sections:
  - Scheduler
  - Models
  - Integrations
  - Repository
  - Runtime
  - Backend
  - Other
- Preserve existing `/api/settings` GET/PATCH behavior.
- Use correct input types: number, checkbox, textarea, text.
- Show setting key and description for each setting.
- Add save/reset UX.
- Unknown settings must render under Other rather than disappearing.

Primary files:

- `dashboard/public/app.js`
- `dashboard/public/style.css`

## Phase 7 — Agent Prompts page (#8)

Status: complete.

Completed 2026-07-16:

- Added reactive Agent Prompts view as a first-class sidebar destination.
- Added prompt editor cards for planner, plan-reviewer, coder, reviewer, git-agent, fixer, split-planner, and splitter.
- Used existing prompt endpoints for load/save/reset-to-default.
- Added char counts, status/last-changed affordance, and learned-rules badge placeholder for coder.
- Added TDD coverage in `test/dashboard-prompts-view.test.mjs` and included it in default/frontend/all test scripts.

Validation:

- `npm run dashboard:check` — passed 2026-07-16
- `node --test test/dashboard-prompts-view.test.mjs` — passed 2026-07-16
- `npm run dashboard:build` — passed 2026-07-16
- `npm test` — passed 2026-07-16

Scope:

- Split prompt editing out from Settings into a first-class Agent Prompts view.
- Show all agent prompts:
  - planner
  - plan-reviewer
  - coder
  - reviewer
  - git-agent
  - fixer
  - split-planner
  - splitter
- Add prompt editor cards with save, reset to default, char count, last-changed metadata if available, and learned-rules badge if available.
- Continue using existing prompt read/write endpoints first.

Primary files:

- `dashboard/public/app.js`
- `dashboard/public/style.css`
- `dashboard/server.js` only if reset/default/metadata endpoints are missing and required

## Phase 8 — Learnings / Reflections page (#9)

Status: complete.

Completed 2026-07-16:

- Added reactive Learnings view backed by existing `/api/learnings`.
- Added tabs for Suggestions, Change log, and Reflection history.
- Added learning suggestion cards with target, issue/Linear context, rationale, and apply/reject actions via existing PATCH endpoint.
- Added change-log and reflection timeline rendering with graceful empty/error states.
- Added TDD coverage in `test/dashboard-learnings-view.test.mjs` and included it in default/frontend/all test scripts.

Validation:

- `npm run dashboard:check` — passed 2026-07-16
- `node --test test/dashboard-learnings-view.test.mjs` — passed 2026-07-16
- `npm run dashboard:build` — passed 2026-07-16
- `npm test` — passed 2026-07-16

Scope:

- Build Learnings view around existing `/api/learnings`.
- Add tabs:
  - Suggestions
  - Change log
  - Reflection history
- Render pending, applied, and rejected suggestions.
- Render reflection events and change logs.
- Add actions for apply suggestion, reject suggestion, and run global reflection if supported. Do not add manual per-issue reflection triggers; v2 `POST /api/issues/:id/reflect` parity is explicitly deprecated for v3.
- Add strong empty states.

Primary files:

- `dashboard/public/app.js`
- `dashboard/public/style.css`
- `dashboard/server.js` only for endpoint gaps

## Phase 9 — Command palette, runtime, polish (#4)

Status: complete.

Completed 2026-07-16:

- Added command palette overlay opened by `⌘K` / `Ctrl+K` with pending decisions first.
- Added common commands for navigation, refresh, Linear sync placeholder, add issue placeholder, pause scheduler placeholder, and global Learnings navigation.
- Added issue card progress bars, state accents, latest activity snippets, and stuck indicators.
- Added runtime/backend status dock. Embedded terminal parity is intentionally deprecated for v3; users should launch runtimes or open external terminals instead of relying on an in-dashboard xterm dock.
- Added TDD coverage in `test/dashboard-polish.test.mjs` and included it in default/frontend/all test scripts.

Validation:

- `npm run dashboard:check` — passed 2026-07-16
- `node --test test/dashboard-polish.test.mjs test/dashboard-review-view.test.mjs` — passed 2026-07-16
- `npm run dashboard:build` — passed 2026-07-16
- `npm test` — passed 2026-07-16

Scope:

- Add command palette overlay with `⌘K` / `Ctrl+K`.
- Decisions appear first.
- Common commands: review next, open queue/archive/settings/prompts/learnings, refresh dashboard, sync Linear backlog, add issue, pause scheduler, and global Learnings navigation. Do not add async standup commands or modals; v2 `/api/standup/today` parity is explicitly deprecated for v3.
- Add issue card hover actions, progress bars, state accents, activity snippets, long-running/stuck indicators. Do not add active queue drag reorder; v2 `/api/active-order` parity is explicitly deprecated for v3 in favor of deterministic sorting.
- Add runtime/backend status. Do not add a terminal dock/launcher placeholder for v3; embedded terminal parity is explicitly deferred/deprecated unless reintroduced as a separately scoped typed v3 feature.

Primary files:

- `dashboard/public/app.js`
- `dashboard/public/style.css`
- `dashboard/server.js` for optional latest activity fields

## Phase 10 — Responsive, accessibility, tests, cleanup (#5)

Scope:

- Mobile/tablet responsive layout.
- Detail panel becomes overlay/full-screen on narrow screens.
- Keyboard/focus support for cards, command palette, modals, tabs, review file list.
- ARIA labels and no hover-only critical actions.
- Remove obsolete old CSS/JS after stable rollout.
- Add/update frontend tests for:
  - stage mapping
  - decision inbox
  - settings grouping
  - prompt card generation
  - learning tab rendering
  - archive stats
  - command palette item generation

Validation:

- `npm run dashboard:check`
- `node --test test/dashboard-hardening.test.mjs`
- `npm run dashboard:build`
- `npm test`
- Manual browser QA at 1440px, 1024px, 768px, 390px remains a rollout follow-up before legacy removal.

## Risk controls

- Keep mockup out of runtime code paths.
- Keep the reactive migration incremental: framework/build foundation first, then view-by-view implementation.
- Preserve existing APIs and route names where possible.
- Add backend fields only behind graceful fallbacks.
- Avoid removing old full-page issue rendering until panel rendering is stable.
- Keep all migration commits on the dedicated migration branch until ready to merge.
- Update the Issue map status as part of each phase start/completion commit.
- Commit each phase separately.
- For implementation commits, include tests that were written before production code for the behavior being changed.
- Do not amend or rewrite existing commits.

## Completion criteria

The migration is complete when:

- Queue uses the six-column pipeline and decision inbox.
- Sidebar navigation covers all major pages.
- Detail panel is the default queue issue interaction.
- Archive, Settings, Agent Prompts, Learnings, and Review match the v3 information architecture.
- Accessibility and responsive checks pass.
- Old layout CSS/JS is removed or explicitly marked transitional.
- `dashboard/public/mockup.html` remains only as historical/design reference, or is replaced by living documentation if preferred.
