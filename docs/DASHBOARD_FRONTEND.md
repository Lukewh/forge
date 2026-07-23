# Forge Dashboard Frontend

Dashboard v3 is the runtime UI. It is a TypeScript + Preact + Vite app mounted directly by `dashboard/public/index.html`.

## Stack

- TypeScript for dashboard frontend source.
- Preact for reactive components.
- Vite for development and production bundling.
- `dashboard/public/app.js` is retained as isolated legacy/reference code for pure helper tests only. It is not loaded by the runtime dashboard.

## Source and output

- Source: `dashboard/frontend/src/`
- TypeScript config: `dashboard/frontend/tsconfig.json`
- Vite config: `dashboard/frontend/vite.config.mjs`
- Built assets: `dashboard/public/v3/`

The Vite build emits stable filenames:

- `dashboard/public/v3/forge-dashboard.js`
- `dashboard/public/v3/forge-dashboard.css`

`dashboard/public/index.html` loads only v3 assets and exposes the mount point:

```html
<body data-dashboard-runtime="v3">
  <div id="forge-react-root" data-reactive-dashboard-root></div>
  <script type="module" src="v3/forge-dashboard.js"></script>
</body>
```

## Commands

```bash
npm run dashboard:dev
npm run dashboard:build
npm run dashboard:check
```

## Runtime boundary

New dashboard UI code should live under `dashboard/frontend/src/` and use TypeScript (`.ts`/`.tsx`). The v3 app owns queue, review, archive, settings, prompts, learnings, command palette, and detail panel workflows.

The legacy `dashboard/public/app.js` must not be loaded by `index.html` or used as a runtime dependency. If legacy helpers are still useful, move them into typed v3 modules before new code consumes them.

## Deprecated v2 parity

Embedded per-issue terminals are intentionally not required for dashboard v3. The legacy v2 UI used `/api/issues/:id/terminal`, but v3 should not expose a broken terminal dock, button, xterm panel, or websocket affordance. Use the issue runtime launch controls, VM command settings, `vmConnectCommand`, or an external terminal in the worktree instead.

If terminal support is revisited later, implement it as a new typed v3 feature with explicit connection state and tests rather than reusing the legacy `dashboard/public/app.js` terminal code.

Async standup UI is also intentionally deprecated for dashboard v3. The legacy v2 modal called `/api/standup/today`, but v3 should not expose a standup card, command, modal, or copy-to-Slack affordance. Keep the backend endpoint only for v2/compatibility unless a new reporting workflow is explicitly scoped.

Active queue drag reorder is intentionally deprecated for dashboard v3. The legacy v2 UI posted reordered cards to `/api/active-order`, but v3 should not expose drag handles, draggable issue cards, or manual priority-by-position affordances. Keep the queue ordered by deterministic filters, workflow stage, priority, and update time instead.

Manual per-issue reflection triggers are intentionally deprecated for dashboard v3. The legacy v2 UI called `POST /api/issues/:id/reflect` from a per-issue “Reflect now” button, but v3 should not expose that action in issue detail. Keep reflection history, suggestions, and prompt learnings in the global Learnings view, with issue-specific reflections produced automatically after completion when supported.

## TDD requirement

For each implementation phase, write or update tests first, confirm they fail for the missing behavior, then implement the production code that makes them pass.
