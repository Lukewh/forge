import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { FORGE_DIR } from "./helpers.mjs";

function read(path) {
  return readFileSync(path, "utf8");
}

describe("dashboard v3 detail panel", () => {
  test("reactive source defines issue detail panel state and renderer", () => {
    const src = read(`${FORGE_DIR}/dashboard/frontend/src/main.ts`);

    assert.match(src, /selectedIssueId/);
    assert.match(src, /function\s+IssueDetailPanel/);
    assert.match(src, /detail-panel/);
    assert.match(src, /\/api\/issues\/\$\{issueId\}/);
  });

  test("issue cards open the right-side detail panel instead of full-page navigation", () => {
    const src = read(`${FORGE_DIR}/dashboard/frontend/src/main.ts`);

    assert.match(src, /onOpenIssue/);
    assert.match(src, /setSelectedIssueId/);
    assert.match(src, /IssueCard[\s\S]*onOpenIssue/);
  });

  test("detail panel exposes issue-scoped tabs and fix approval affordance", () => {
    const src = read(`${FORGE_DIR}/dashboard/frontend/src/main.ts`);

    for (const label of ["Overview", "Activity"]) {
      assert.match(src, new RegExp(`label:\\s*[\"']${label}[\"']`));
    }
    assert.doesNotMatch(src, /label:\s*["']Learning["']/);

    assert.match(src, /fix approval/i);
    assert.match(src, /PR stack/i);
    assert.match(src, /Admin & runtime/i);
  });

  test("detail panel renders decision-specific workflows", () => {
    const src = read(`${FORGE_DIR}/dashboard/frontend/src/main.ts`);

    assert.match(src, /parseDecisionArtifact/);
    assert.match(src, /selectedFixCommentIds/);
    assert.match(src, /approvedIds, skippedIds/);
    assert.match(src, /approvePlanWithSteering/);
    assert.match(src, /requestDecisionChanges/);
    assert.match(src, /forge-v3-fix-approval/);
    assert.match(src, /forge-v3-split-approval/);
    assert.match(src, /forge-v3-stale-decisions/);
  });

  test("detail panel restores admin and runtime controls", () => {
    const src = read(`${FORGE_DIR}/dashboard/frontend/src/main.ts`);
    const css = read(`${FORGE_DIR}/dashboard/frontend/src/style.css`);

    assert.match(src, /Admin & runtime/);
    assert.match(src, /fullResetIssue/);
    assert.match(src, /Type RESET/);
    assert.match(src, /removeSelectedIssue/);
    assert.match(src, /Type DELETE/);
    assert.match(src, /clearSteering/);
    assert.match(src, /clear-steer/);
    assert.match(src, /advanceIssue/);
    assert.match(src, /nextState/);
    assert.match(src, /JUMP_STATE_OPTIONS/);
    assert.match(src, /jumpToState/);
    assert.match(src, /Jump to state/);
    assert.match(src, /forge-v3-jump-state-modal/);
    assert.match(src, /onIssueAction\(issue\.id, "advance", \{ nextState: option\.state \}\)/);
    assert.match(src, /launchIssueRuntime/);
    assert.match(src, /\/api\/issues\/\$\{issueId\}\/vm-launch/);
    assert.match(src, /stopVmRuntime/);
    assert.match(src, /\/api\/vm\/stop/);
    assert.match(src, /Stop VM runtime/);
    assert.match(src, /deleteJson/);
    assert.match(src, /onRemoveIssue/);
    assert.match(css, /\.forge-v3-admin-zone/);
    assert.match(css, /\.forge-v3-admin-status/);
    assert.match(css, /\.forge-v3-jump-state-option/);
  });

  test("detail panel wires PR sync, feedback, and auto-fix controls", () => {
    const src = read(`${FORGE_DIR}/dashboard/frontend/src/main.ts`);
    const css = read(`${FORGE_DIR}/dashboard/frontend/src/style.css`);

    assert.match(src, /onSyncPrs/);
    assert.match(src, /syncIssuePrs/);
    assert.match(src, /Sync from GitHub/);
    assert.match(src, /onSubmitFeedback/);
    assert.match(src, /submitIssueFeedback/);
    assert.match(src, /Add PR feedback/);
    assert.match(src, /auto_fix_enabled/);
    assert.match(src, /toggleAutoFix/);
    assert.match(src, /set-auto-fix/);
    assert.match(src, /reviewDecision/);
    assert.match(src, /checksFailed/);
    assert.match(css, /\.forge-v3-pr-meta-badge/);
  });

  test("activity tab uses real activity log and run logs", () => {
    const src = read(`${FORGE_DIR}/dashboard/frontend/src/main.ts`);
    const css = read(`${FORGE_DIR}/dashboard/frontend/src/style.css`);

    assert.match(src, /type ActivityLogEntry/);
    assert.match(src, /activityLog\?: ActivityLogEntry\[\]/);
    assert.match(src, /failureContext\?: FailureContext/);
    assert.match(src, /detail\?\.activityLog/);
    assert.match(src, /\/api\/runs\/\$\{runId\}\/log/);
    assert.match(src, /Failure context/);
    assert.match(src, /activity\.length \?/);
    assert.match(css, /\.forge-v3-run-log-link/);
    assert.match(css, /\.forge-v3-failure-context/);
  });

  test("detail panel stylesheet provides slide-over layout", () => {
    const css = read(`${FORGE_DIR}/dashboard/frontend/src/style.css`);

    assert.match(css, /\.forge-v3-detail-panel/);
    assert.match(css, /position:\s*fixed/);
    assert.match(css, /right:\s*0/);
    assert.match(css, /\.forge-v3-detail-tabs/);
    assert.match(css, /\.forge-v3-fix-comment-card/);
    assert.match(css, /\.forge-v3-split-row/);
  });
});
