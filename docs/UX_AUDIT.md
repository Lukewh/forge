# Forge Web UI UX Audit

Date: 2026-07-03
Scope: `extensions/forge/dashboard/public/index.html`, `app.js`, `style.css`, and dashboard API surfaces that shape the UI.

## Executive summary

Forge already has a strong foundation: a focused three-column queue, useful issue detail pages, visible agent activity, desktop notifications, and a surprisingly capable code-review diff view. The main UX gap is not visual polish; it is confidence. Users need to know what Forge is doing, what needs their attention, what will happen if they click a button, and how to recover when something goes sideways.

To make Forge a joy to use, prioritize:

1. A calmer, clearer command center.
2. Stronger “what is happening now?” feedback.
3. Safer, clearer high-impact actions.
4. Better review/approval ergonomics.
5. Faster paths for repeated daily workflows.

---

## Top recommendations

### 1. Add a global “Today / Needs attention / Running / Blocked” summary strip

**Problem**
The header shows scheduler status and agent count, but not the user’s actual mental model: “Do I need to do anything? Is anything stuck? What is Forge accomplishing?”

**Current signals**
- `scheduler-badge`
- `agent-count`
- `decision-badge`
- “autonomous / need you” text inside the Active column

**Recommendation**
Add a compact dashboard summary under the header or at the top of the queue:

- `Needs you: 3`
- `Running: 2`
- `Blocked/failed: 1`
- `PRs watching: 4`
- `Done today: 2`

Each metric should be clickable/filtering.

**Why it matters**
Joy comes from immediate orientation. The first screen should answer “what is my role right now?” in under 2 seconds.

**Priority**: P0

---

### 2. Make the three columns filterable and searchable

**Problem**
As issues grow, the current lists become visually similar stacks of cards. There is no search, no filtering by Linear ID, title, app/layer, status, failed, PR, or assignee/source.

**Recommendation**
Add a small filter row:

- Global search: `Search issues, IDs, branches…`
- Quick chips: `Needs me`, `Running`, `Failed`, `Watching PR`, `Paused`
- Sort: `Priority`, `Recently updated`, `Oldest waiting`

**Implementation hint**
Filtering can be client-side from `state.issues` and `state.decisions` initially.

**Priority**: P0

---

### 3. Rework issue detail actions into primary/secondary/danger zones

**Problem**
The issue detail header can accumulate many actions with similar visual weight:

- Remove
- Full Reset
- Retry
- Resume
- Ignore
- Listen
- Pause
- Steer
- Advance
- Jump to
- View Diff
- Add Feedback
- Approve / Reject

This makes high-impact actions feel casual and daily actions feel cluttered.

**Recommendation**
Group actions:

- Primary action: current next best action (`Review plan`, `View diff`, `Listen`, `Approve`, etc.)
- Secondary: `Steer`, `Pause`, `View Diff`, `Add Feedback`
- Overflow menu: `Jump to…`, `Sync PRs`, `Copy paths`
- Danger zone lower on page: `Full Reset`, `Remove`, `Ignore`

**Priority**: P0

---

### 4. Replace ambiguous “Advance” / “Jump to” with safer intent language

**Problem**
Buttons like “Advance to Coding” and “Jump to…” are powerful state-machine controls, but the UI does not consistently explain consequences.

**Recommendation**
For state-changing controls, show:

- Current state
- Target state
- What agent will run next
- Whether decisions/history will be preserved
- Whether Linear will sync

Example confirmation:

> Move BAND-5423 from “Awaiting code review” to “Create PR”?  
> This skips human approval for the code-review decision. Forge will run the Git Agent next. Linear will stay In Review.

**Priority**: P0

---

### 5. Improve the “Listen” panel into a true live agent console

**Problem**
The listen panel is valuable, but it appears as a side drawer with raw stream chunks. It needs more structure to become delightful.

**Recommendation**
Add:

- Agent name + issue title in header
- Current phase label: `Reading files`, `Editing`, `Running tests`, `Waiting`, etc.
- Tool-call grouping with collapsible details
- Sticky latest action
- “Copy last error” and “Open full log”
- Auto-scroll toggle
- Clear terminal-style affordances for stdout/stderr/tool errors

**Priority**: P0

---

### 6. Make decision cards actionable without opening detail pages

**Problem**
The Awaiting You column is the user’s inbox, but most cards only say “Review →” and route to issue detail. That adds friction.

**Recommendation**
Decision cards should show:

- Type-specific preview:
  - Plan review: plan summary + changed scope count
  - Code review: files changed + diff stats
  - Fix approval: comment count + PR numbers
- Inline actions:
  - `Review`
  - `Approve`
  - `Request changes`
  - `Open diff`

Use progressive disclosure for safety: inline `Approve` can still confirm.

**Priority**: P0

---

### 7. Add an “agent stuck” state before failure

**Problem**
Long-running agents get an elapsed badge after 30 minutes, but the user still has to infer whether that is okay.

**Recommendation**
Define thresholds per agent type:

- Planner > 8m: “taking longer than usual”
- Coder > 20m: “long-running”
- Reviewer > 10m: “long-running”
- Git agent > 5m: “possibly stuck”

Cards should expose:

- Last activity timestamp
- Last tool/action
- `Listen`
- `Stop / mark failed` if safe

**Priority**: P1

---

### 8. Turn PR Stack into an actionable release panel

**Problem**
PR Stack currently lists branch, PR number, and status dots. It does not explain what needs to happen next.

**Recommendation**
For each PR row show:

- PR title
- CI state
- review state
- merge state
- base branch
- “Open PR” button
- “Refresh” per row

At stack level show:

- `All checks passing`
- `2 review comments unresolved`
- `Ready to merge`

**Priority**: P1

---

### 9. Make path/copy affordances more explicit

**Problem**
The issue detail “Branch” row displays the worktree basename, and a tiny “📋 cd” button copies a command. This is useful but easy to miss.

**Recommendation**
Change to:

- Label: `Worktree`
- Display: full path in truncated monospace with copy button
- Buttons:
  - `Copy cd`
  - `Open in terminal` if supported later
  - `Open in editor` if supported later

Also show branch separately from worktree path.

**Priority**: P1

---

### 10. Reduce visual noise from emoji-heavy actions

**Problem**
Emoji makes the app friendly, but action rows with many emoji buttons become noisy and harder to scan.

**Recommendation**
Use icons sparingly:

- Keep state/agent emojis where they convey identity.
- Remove emoji from most buttons or use consistent small SVG/icon system.
- Primary action should be text-first.

Examples:

- `🎧 Listen` → `Listen`
- `🎯 Steer` → `Steer`
- `🗑 Full Reset` → `Full reset` in danger area

**Priority**: P1

---

## Detailed findings

### Queue view

#### What works
- Three-column model maps well to Forge’s lifecycle.
- Mobile tabs are a good simplification.
- Awaiting You column has useful urgency styling.
- Cards are compact and scannable.

#### Issues
1. Available vs In Forge queued are stacked in one column, which makes “what can I start?” and “what is already queued?” compete.
2. There is no “recently changed” cue on cards.
3. Failed issues are mixed into Active without a strong recovery path.
4. Manual issues and Linear issues share card shapes, but Linear metadata is sparse.
5. Empty states are functional but not motivational.

#### Recommendations
- Add a search/filter toolbar.
- Add “last updated” to cards.
- Add card-level secondary actions on hover: `Open`, `Steer`, `Pause`, `Listen`.
- Make failed cards appear in a dedicated “Blocked” group or summary chip.
- Improve empty states with next best action buttons.

---

### Issue detail view

#### What works
- Timeline is helpful.
- Activity log is valuable.
- Plan rendering is useful and collapsible.
- Failure context box is excellent.

#### Issues
1. Header action overload.
2. Info grid mixes branch, path, plan, and source without hierarchy.
3. Timeline labels are high-level, but substate is tiny and easy to miss.
4. Activity log is chronological but not grouped by phase/agent run.
5. Plan section can dominate the page during review.

#### Recommendations
- Make state/substate more prominent: “Watching PR — waiting on CI”.
- Add “Next expected event” near progress: “Forge will check PR comments every 10m”.
- Group activity by agent run with collapsible run sections.
- Add mini table of current artifacts: Plan, Diff, PRs, Logs.
- Move destructive actions to a bottom danger zone.

---

### Review / diff view

#### What works
- File sidebar is useful.
- Inline comments exist.
- Overall tour summary is a strong differentiator.
- Sticky header works well.

#### Issues
1. Review view likely becomes hard to use on large diffs.
2. There is no explicit reviewed/unreviewed file state.
3. Inline comment affordance only appears on hover; discoverability is low.
4. There is no “submit review” mental model. Buttons are actions but not staged as a review flow.
5. Mobile diff review is likely painful despite horizontal scroll.

#### Recommendations
- Add file status: `unread`, `viewed`, `commented`.
- Add “Reviewed” checkbox per file.
- Add sticky review summary panel: comments count, verdict, submit buttons.
- Add keyboard shortcuts: `j/k` file navigation, `a` add comment, `r` mark reviewed.
- Add collapse unchanged hunks.

---

### Modals and confirmations

#### What works
- Confirmation modal exists.
- Plan approval modal supports steering comment.

#### Issues
1. Modals do not consistently focus the first actionable control.
2. Escape-to-close behavior is not obvious from code.
3. Destructive modals use similar shape to normal approvals.
4. Long text areas lack examples/placeholders.

#### Recommendations
- Add keyboard handling: Escape closes, Cmd/Ctrl+Enter submits textareas.
- Autofocus primary input/control.
- For destructive actions, require typed confirmation for Full Reset.
- Add helper examples for steering and manual feedback.

---

### Notifications

#### What works
- Desktop notification permission flow is present.
- New decision notifications avoid initial spam.
- Page title badge is helpful.

#### Issues
1. Notification settings are binary; no per-event control.
2. Browser denied state explains how to re-enable, good, but only on click.
3. Notifications route to queue, not the relevant issue/decision.

#### Recommendations
- Notification click should open `#issue/{id}` or `#review/{id}` when possible.
- Add settings: `Notify on decisions`, `Notify on failures`, `Notify on long-running agents`, `Notify on PR ready`.
- Add in-app toast center for users who disable OS notifications.

---

### Mobile

#### What works
- Mobile tabs are a good pattern.
- Touch target sizing has been considered.
- Diff area uses horizontal scroll.

#### Issues
1. Header controls wrap and can feel cramped.
2. Auto-switching to Awaiting You on mobile may surprise users.
3. Issue detail action buttons can become a large block.
4. Review/diff view is still desktop-first.

#### Recommendations
- Make mobile header a two-row layout: title + compact status/actions.
- Replace auto-switch with a persistent attention badge + optional “View now”.
- Use a bottom action bar for issue primary actions.
- Provide a mobile “summary review” mode before showing raw diff.

---

### Accessibility

#### Issues observed from code
1. Many clickable `div.issue-card` and `div.decision-card` elements are not keyboard-focusable.
2. Icon-only buttons rely mostly on `title`, which is not sufficient for screen readers/touch.
3. Focus styles are not consistently defined for buttons/cards.
4. Modal focus trapping is absent.
5. Color is a primary status signal in PR dots/state pills.

#### Recommendations
- Use `<button>` or `<a>` for clickable cards, or add `role="button"`, `tabindex="0"`, Enter/Space handlers.
- Add visible `:focus-visible` styles globally.
- Add `aria-label` to icon buttons.
- Trap focus inside modals.
- Pair status colors with text labels/tooltips visible on focus.

**Priority**: P0 for keyboard/focus basics.

---

## “Joy” opportunities

These are not just fixes; they make Forge feel alive and trustworthy.

### A. Make Forge narrate progress

Add a compact “Currently” line on active cards:

- “Reading Linear context…”
- “Editing 3 files…”
- “Running tests…”
- “Waiting for your plan approval…”
- “Watching PR #123 — checks pending”

This could come from activity log events or agent run metadata.

### B. Celebrate completions

When an issue reaches DONE:

- Show a small completion card.
- Include time saved, agents run, PR links.
- Offer `Archive`, `Open PR`, `Start next`.

### C. Create a command palette

Keyboard shortcut: `⌘K` / `Ctrl+K`.

Commands:

- Enqueue Linear issue
- Search issue
- Open active agent
- Review next decision
- Pause all
- Open settings
- Copy worktree cd

### D. Make “Review next” the core loop

If there is anything awaiting the user, the app should make the next action obvious:

- Header button: `Review next (3)`
- Opens highest-priority decision.
- After resolving, advances to next decision.

### E. Add saved user preferences

- Default view
- Sort order
- Compact/comfortable density
- Notification types
- Auto-open listen panel for running agents

---

## Suggested implementation plan

### Phase 1 — Orientation and safety (1–2 days)

- Add summary strip.
- Add global search/filter chips.
- Reorganize issue detail action buttons.
- Add keyboard/focus support for cards and modals.
- Make notification clicks deep-link to issue/review.

### Phase 2 — Review ergonomics (2–4 days)

- Add reviewed/unreviewed file state.
- Add sticky review summary / submit bar.
- Add collapse unchanged hunks.
- Add keyboard shortcuts in review view.
- Improve fix approval comment selection UX.

### Phase 3 — Agent observability (2–4 days)

- Upgrade Listen panel with grouped tool calls and phase labels.
- Add long-running/stuck heuristics.
- Add in-app toast center.
- Group activity by agent run.

### Phase 4 — Delight polish (ongoing)

- Command palette.
- Completion celebrations.
- User preferences.
- Cleaner icon system.
- Better empty states and microcopy.

---

## Quick wins checklist

- [ ] Add visible focus styles for `.issue-card`, `.decision-card`, buttons, links.
- [ ] Add `aria-label` to icon-only header buttons.
- [ ] Make cards keyboard-accessible.
- [ ] Change mobile auto-switch to a prompt/badge.
- [ ] Move Full Reset out of the top action row.
- [ ] Add `Review next` header button when decisions exist.
- [ ] Add `last updated` to issue cards.
- [ ] Make `Listen` primary for actively running agents.
- [ ] Add “Open PR” text to PR stack rows instead of relying on PR number only.
- [ ] Add typed confirmation for Full Reset.

---

## North star

Forge should feel like a calm control room for autonomous development:

- It clearly says what is happening.
- It makes the next human action obvious.
- It makes dangerous actions feel safe and intentional.
- It turns agent work from a black box into an understandable story.
- It rewards the user with visible progress and completion.
