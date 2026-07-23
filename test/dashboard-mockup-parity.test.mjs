import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../dashboard/frontend/src/main.ts", import.meta.url), "utf8");
const styles = readFileSync(new URL("../dashboard/frontend/src/style.css", import.meta.url), "utf8");
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

describe("dashboard v3 mockup parity", () => {
  it("registers mockup parity tests in default frontend scripts", () => {
    assert.match(pkg.scripts.test, /test\/dashboard-mockup-parity\.test\.mjs/);
    assert.match(pkg.scripts["test:fe"], /test\/dashboard-mockup-parity\.test\.mjs/);
    assert.match(pkg.scripts["test:all"], /test\/dashboard-mockup-parity\.test\.mjs/);
  });

  it("uses mockup shell/page layout primitives", () => {
    for (const token of ["forge-v3-app-frame", "forge-v3-view-scroll", "forge-v3-page-wrap", "forge-v3-page-header", "forge-v3-page-title", "forge-v3-page-actions", "forge-v3-command-center"]) {
      assert.match(source, new RegExp(token));
      assert.match(styles, new RegExp(`\\.${token}`));
    }
  });

  it("queue pipeline mirrors the mockup structure", () => {
    for (const token of ["forge-v3-queue-shell", "forge-v3-pipeline-wrap", "forge-v3-col-head", "forge-v3-col-label", "forge-v3-col-count", "forge-v3-col-cards", "forge-v3-ic-hover", "forge-v3-ic-progress", "forge-v3-ic-fill"]) {
      assert.match(source, new RegExp(token));
      assert.match(styles, new RegExp(`\\.${token}`));
    }
    assert.match(styles, /display:\s*flex[^}]*overflow-x:\s*auto/s);
  });

  it("detail panel includes mockup overview sections and danger zone", () => {
    for (const token of ["forge-v3-state-banner", "forge-v3-phase-track", "forge-v3-phase-dot", "forge-v3-info-grid", "forge-v3-pr-stack-list", "forge-v3-auto-fix-row", "forge-v3-danger-zone"]) {
      assert.match(source, new RegExp(token));
      assert.match(styles, new RegExp(`\\.${token}`));
    }
  });

  it("archive, settings, prompts, learnings, and issue-scoped review use mockup page treatments", () => {
    for (const token of ["forge-v3-diff-review", "forge-v3-diff-file-list", "forge-v3-diff-main", "forge-v3-stats-strip", "forge-v3-archive-list", "forge-v3-settings-wrap", "forge-v3-settings-group", "forge-v3-prompts-wrap", "forge-v3-learnings-wrap"]) {
      assert.match(source, new RegExp(token));
      assert.match(styles, new RegExp(`\\.${token}`));
    }
  });

  it("stylesheet defines the mockup color system and component tokens", () => {
    for (const token of ["--forge-v3-bg", "--forge-v3-bg-panel", "--forge-v3-border-subtle", "--forge-v3-text-4", "--forge-v3-r", "--forge-v3-accent-vivid", "--forge-v3-yellow", "--forge-v3-emerald"]) {
      assert.match(styles, new RegExp(token));
    }
  });
});
