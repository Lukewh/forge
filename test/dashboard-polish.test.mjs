import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../dashboard/frontend/src/main.ts", import.meta.url), "utf8");
const styles = readFileSync(new URL("../dashboard/frontend/src/style.css", import.meta.url), "utf8");
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

describe("dashboard v3 polish", () => {
  it("registers polish tests in frontend/default test scripts", () => {
    assert.match(pkg.scripts.test, /test\/dashboard-polish\.test\.mjs/);
    assert.match(pkg.scripts["test:fe"], /test\/dashboard-polish\.test\.mjs/);
    assert.match(pkg.scripts["test:all"], /test\/dashboard-polish\.test\.mjs/);
  });

  it("defines a command palette opened by keyboard shortcut", () => {
    assert.match(source, /function CommandPalette\(/);
    assert.match(source, /commandPaletteOpen/);
    assert.match(source, /event\.key\.toLowerCase\(\) === "k"/);
    assert.match(source, /event\.metaKey \|\| event\.ctrlKey/);
    assert.match(source, /forge-v3-command-palette/);
  });

  it("command palette includes decisions first and common commands", () => {
    assert.match(source, /decisionCommands/);
    for (const label of ["Review next", "Open queue", "Open archive", "Open settings", "Open prompts", "Open learnings", "Refresh dashboard", "Sync Linear backlog", "Add issue", "Pause scheduler"]) {
      assert.match(source, new RegExp(label));
    }
  });

  it("issue cards expose progress, activity, accents, hover actions, and stuck indicators", () => {
    assert.match(source, /issueProgress/);
    assert.match(source, /forge-v3-issue-progress/);
    assert.match(source, /forge-v3-activity-snippet/);
    assert.match(source, /forge-v3-stuck-indicator/);
    assert.match(source, /state-/);
  });

  it("visual parity helpers expose non-color state, priority, and decision labels", () => {
    for (const helper of ["priorityGlyph", "issueStateLabel", "issueStatePillClass", "decisionTypeClass", "decisionTypeLabel", "issueRuntimeBadges", "prMetadataBadges"]) {
      assert.match(source, new RegExp(`function ${helper}`));
    }
    assert.match(source, /forge-v3-priority-glyph/);
    assert.match(source, /forge-v3-state-pill/);
    assert.match(source, /forge-v3-elapsed-badge/);
    assert.match(source, /forge-v3-live-badge/);
  });

  it("sidebar includes mockup-style icons, status dot, badges, and concurrency pips", () => {
    assert.match(source, /icon:/);
    assert.match(source, /forge-v3-nav-icon/);
    assert.match(source, /forge-v3-nav-badge/);
    assert.match(source, /forge-v3-status-dot/);
    assert.match(source, /forge-v3-concurrency-pips/);
    assert.match(source, /agent slots/);
  });

  it("runtime dock placeholder is rendered from shell status", () => {
    assert.match(source, /RuntimeDock/);
    assert.match(source, /forge-v3-runtime-dock/);
    assert.doesNotMatch(source, /h\("button"[\s\S]{0,120}Terminal/);
    assert.match(source, /Backend/);
    assert.match(source, /Stop VM/);
    assert.match(source, /onStopVm/);
  });

  it("stylesheet provides command palette, card polish, progress, and runtime dock treatments", () => {
    assert.match(styles, /\.forge-v3-command-palette\s*\{[^}]*position:\s*fixed/s);
    assert.match(styles, /\.forge-v3-command-list/);
    assert.match(styles, /\.forge-v3-issue-progress/);
    assert.match(styles, /\.forge-v3-runtime-dock/);
    assert.match(styles, /\.forge-v3-runtime-stop/);
    assert.match(styles, /\.forge-v3-stuck-indicator/);
  });

  it("stylesheet includes visual parity treatments for compact cards, pips, badges, and decision types", () => {
    for (const selector of [".forge-v3-nav-icon", ".forge-v3-status-dot", ".forge-v3-concurrency-pips", ".forge-v3-priority-glyph", ".forge-v3-state-pill", ".forge-v3-pr-badge", ".forge-v3-ci-badge", ".decision-code", ".decision-plan", ".decision-fix", ".forge-v3-issue-card.selected"]) {
      assert.match(styles, new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
  });
});
