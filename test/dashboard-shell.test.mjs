import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { FORGE_DIR } from "./helpers.mjs";

function read(path) {
  return readFileSync(path, "utf8");
}

describe("dashboard v3 app shell", () => {
  test("reactive source defines the persistent shell and all primary nav destinations", () => {
    const src = read(`${FORGE_DIR}/dashboard/frontend/src/main.ts`);

    assert.match(src, /function\s+DashboardShell/);
    assert.match(src, /forge-v3-shell/);

    for (const label of ["Queue", "Archive", "Settings", "Agent Prompts", "Learnings"]) {
      assert.match(src, new RegExp(`label:\\s*[\"']${label}[\"']`));
    }
    assert.doesNotMatch(src, /label:\s*["']Review["']/);
  });

  test("shell exposes status fields required by the migration plan", () => {
    const src = read(`${FORGE_DIR}/dashboard/frontend/src/main.ts`);

    for (const field of [
      "scheduler",
      "activeCount",
      "awaitingDecisionsCount",
      "failedCount",
      "doneThisWeekCount",
      "model",
      "backend",
    ]) {
      assert.match(src, new RegExp(field));
    }

    assert.match(src, /\/api\/overview/);
    assert.match(src, /\/api\/settings/);
  });

  test("shell stylesheet creates the final v3 sidebar layout", () => {
    const css = read(`${FORGE_DIR}/dashboard/frontend/src/style.css`);

    assert.match(css, /\.forge-v3-sidebar/);
    assert.match(css, /\.forge-v3-main/);
    assert.match(css, /--forge-v3-sidebar-width/);
    assert.doesNotMatch(css, /body > main/);
  });

  test("final dashboard document mounts only the v3 runtime", () => {
    const html = read(`${FORGE_DIR}/dashboard/public/index.html`);

    assert.match(html, /data-dashboard-runtime="v3"/);
    assert.match(html, /id="forge-react-root"/);
    assert.match(html, /type="module" src="v3\/forge-dashboard\.js"/);
    assert.doesNotMatch(html, /<script src="app\.js"><\/script>/);
    assert.doesNotMatch(html, /id="view-queue"/);
    assert.doesNotMatch(html, /id="pipeline-wrapper"/);
  });

  test("v3 route syncing supports direct issue links and redirects review deep links to issue scope", () => {
    const src = read(`${FORGE_DIR}/dashboard/frontend/src/main.ts`);

    assert.match(src, /function\s+parseDashboardRoute/);
    assert.match(src, /viewOrEntity\s*===\s*"issue"/);
    assert.match(src, /viewOrEntity\s*===\s*"review"/);
    assert.match(src, /view:\s*"queue"/);
    assert.match(src, /`issue\/\$\{ids\.issueId\}`/);
    assert.doesNotMatch(src, /`review\/\$\{ids\.issueId\}/);
    assert.match(src, /window\.addEventListener\("hashchange"/);
  });

  test("v3 shell subscribes to live dashboard events with notification de-dup", () => {
    const src = read(`${FORGE_DIR}/dashboard/frontend/src/main.ts`);
    const css = read(`${FORGE_DIR}/dashboard/frontend/src/style.css`);

    assert.match(src, /new EventSource\("\/api\/events"\)/);
    for (const eventName of ["tick", "issue_added", "issue_removed", "decision_resolved"]) {
      assert.match(src, new RegExp(eventName));
    }
    assert.match(src, /setDetailReloadKey/);
    assert.match(src, /notifiedDecisionIds/);
    assert.match(src, /notifyPendingDecisionOnce/);
    assert.match(src, /loadDesktopCapabilities/);
    assert.match(src, /sendDesktopNotification/);
    assert.match(src, /\/api\/desktop-capabilities/);
    assert.match(src, /\/api\/desktop-notify/);
    assert.match(src, /Desktop companion/);
    assert.match(src, /Browser notification fallback/);
    assert.match(src, /Notification\.requestPermission/);
    assert.match(src, /eventStreamStatus/);
    assert.match(css, /\.forge-v3-notification-toggle/);
    assert.match(css, /\.forge-v3-notification-toggle\.desktop/);
    assert.match(css, /\.forge-v3-session-chip\.event-live/);
  });

  test("v3 route syncing no longer depends on legacy DOM view containers", () => {
    const src = read(`${FORGE_DIR}/dashboard/frontend/src/main.ts`);

    assert.match(src, /function\s+syncDashboardRoute/);
    assert.doesNotMatch(src, /showLegacyView/);
    assert.doesNotMatch(src, /routeToLegacyView/);
    assert.doesNotMatch(src, /querySelectorAll\("\.view"\)/);
  });
});
