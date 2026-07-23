import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../dashboard/frontend/src/main.ts", import.meta.url), "utf8");
const styles = readFileSync(new URL("../dashboard/frontend/src/style.css", import.meta.url), "utf8");
const docs = readFileSync(new URL("../docs/DASHBOARD_FRONTEND.md", import.meta.url), "utf8");
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

describe("dashboard v3 hardening", () => {
  it("registers hardening tests in frontend/default test scripts", () => {
    assert.match(pkg.scripts.test, /test\/dashboard-hardening\.test\.mjs/);
    assert.match(pkg.scripts["test:fe"], /test\/dashboard-hardening\.test\.mjs/);
    assert.match(pkg.scripts["test:all"], /test\/dashboard-hardening\.test\.mjs/);
  });

  it("interactive cards and command palette expose keyboard/focus accessibility", () => {
    assert.match(source, /tabIndex:\s*0/);
    assert.match(source, /onKeyDown/);
    assert.match(source, /aria-label/);
    assert.match(source, /role:\s*"dialog"/);
    assert.match(source, /aria-modal/);
  });

  it("stylesheet hardens responsive layouts for narrow screens", () => {
    assert.match(styles, /@media\(max-width:\s*1024px\)/);
    assert.match(styles, /@media\(max-width:\s*640px\)/);
    assert.match(styles, /\.forge-v3-detail-panel\s*\{[^}]*width:\s*100vw/s);
    assert.match(styles, /\.forge-v3-pipeline-column\s*\{[^}]*flex-basis:\s*260px/s);
  });

  it("stylesheet includes visible focus treatments and no-hover critical action fallback", () => {
    assert.match(styles, /:focus-visible/);
    assert.match(styles, /@media\(hover:\s*none\)/);
    assert.match(styles, /\.forge-v3-issue-actions\s*\{[^}]*display:\s*flex/s);
  });

  it("frontend docs mark legacy assets as isolated from runtime", () => {
    assert.match(docs, /legacy/i);
    assert.match(docs, /isolated/i);
    assert.match(docs, /not loaded by the runtime dashboard/i);
  });

  it("documents embedded terminal parity as intentionally deprecated for v3", () => {
    assert.match(docs, /Embedded per-issue terminals are intentionally not required for dashboard v3/);
    assert.match(docs, /\/api\/issues\/:id\/terminal/);
    assert.match(docs, /external terminal/);
    assert.doesNotMatch(source, /\/api\/issues\/\$\{issueId\}\/terminal/);
    assert.doesNotMatch(source, /new WebSocket\([^)]*terminal/);
  });

  it("documents async standup UI as intentionally deprecated for v3", () => {
    assert.match(docs, /Async standup UI is also intentionally deprecated for dashboard v3/);
    assert.match(docs, /\/api\/standup\/today/);
    assert.match(docs, /copy-to-Slack affordance/);
    assert.doesNotMatch(source, /\/api\/standup\/today/);
    assert.doesNotMatch(source, /standup/i);
    assert.doesNotMatch(source, /copy for slack/i);
  });

  it("documents active queue drag reorder as intentionally deprecated for v3", () => {
    assert.match(docs, /Active queue drag reorder is intentionally deprecated for dashboard v3/);
    assert.match(docs, /\/api\/active-order/);
    assert.match(docs, /deterministic filters/);
    assert.match(source, /sortIssuesByProcessStage/);
    assert.doesNotMatch(source, /\/api\/active-order/);
    assert.doesNotMatch(source, /draggable/);
    assert.doesNotMatch(source, /dragstart|dragend|dragover/);
  });

  it("documents manual per-issue reflection as intentionally deprecated for v3", () => {
    assert.match(docs, /Manual per-issue reflection triggers are intentionally deprecated for dashboard v3/);
    assert.match(docs, /POST \/api\/issues\/:id\/reflect/);
    assert.match(docs, /global Learnings view/);
    assert.match(source, /title: "Learnings"/);
    assert.match(source, /Reflection history/);
    assert.doesNotMatch(source, /\/api\/issues\/\$\{issueId\}\/reflect/);
    assert.doesNotMatch(source, /Reflect now/);
  });

  it("uses styled v3 dialogs instead of built-in browser prompts or confirms", () => {
    assert.match(source, /showForgePrompt/);
    assert.match(source, /showForgeConfirm/);
    assert.match(source, /forge-v3-dialog-backdrop/);
    assert.match(styles, /\.forge-v3-dialog-backdrop/);
    assert.match(styles, /\.forge-v3-dialog/);
    assert.doesNotMatch(source, /window\.(alert|confirm|prompt)/);
    assert.doesNotMatch(source, /\b(alert|confirm|prompt)\s*\(/);
  });
});
