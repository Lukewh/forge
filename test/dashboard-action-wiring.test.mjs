import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../dashboard/frontend/src/main.ts", import.meta.url), "utf8");
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

describe("dashboard v3 action wiring", () => {
  it("registers action wiring tests in frontend/default test scripts", () => {
    assert.match(pkg.scripts.test, /test\/dashboard-action-wiring\.test\.mjs/);
    assert.match(pkg.scripts["test:fe"], /test\/dashboard-action-wiring\.test\.mjs/);
    assert.match(pkg.scripts["test:all"], /test\/dashboard-action-wiring\.test\.mjs/);
  });

  it("defines reusable API mutations for decision and issue actions", () => {
    assert.match(source, /function postJson/);
    assert.match(source, /resolveDecisionAction/);
    assert.match(source, /`\/api\/decisions\/\$\{decisionId\}\/resolve`/);
    assert.match(source, /runIssueAction/);
    assert.match(source, /removeIssue/);
    assert.match(source, /launchIssueRuntime/);
    assert.match(source, /stopVmRuntime/);
    assert.match(source, /syncIssuePrs/);
    assert.match(source, /submitIssueFeedback/);
    assert.match(source, /createManualIssue/);
    assert.match(source, /enqueueLinearIssueApi/);
    assert.match(source, /loadDesktopCapabilities/);
    assert.match(source, /sendDesktopNotification/);
    assert.match(source, /deleteJson/);
    assert.match(source, /`\/api\/issues\/\$\{issueId\}`/);
    assert.match(source, /`\/api\/issues\/\$\{issueId\}\/vm-launch`/);
    assert.match(source, /"\/api\/vm\/stop"/);
    assert.match(source, /`\/api\/issues\/\$\{issueId\}\/sync-prs`/);
    assert.match(source, /`\/api\/issues\/\$\{issueId\}\/feedback`/);
    assert.match(source, /"\/api\/issues"/);
    assert.match(source, /"\/api\/linear\/enqueue"/);
    assert.match(source, /"\/api\/desktop-capabilities"/);
    assert.match(source, /"\/api\/desktop-notify"/);
  });

  it("wires sidebar decision buttons to approve and request-change callbacks", () => {
    assert.match(source, /approvePlanWithSteering/);
    assert.match(source, /requestDecisionChanges/);
    assert.match(source, /onResolveDecision\(splitDecision\.id, "approved"\)/);
    assert.match(source, /approveSelectedFixes/);
    assert.match(source, /Approve plan/);
    assert.match(source, /Request changes/);
  });

  it("wires issue card and detail panel controls to issue-level mutations", () => {
    assert.match(source, /onIssueAction/);
    assert.match(source, /pause/);
    assert.match(source, /unpause/);
    assert.match(source, /retry/);
    assert.match(source, /steer/);
    assert.match(source, /split-pr-stack/);
    assert.match(source, /clear-steer/);
    assert.match(source, /advance/);
    assert.match(source, /reset/);
    assert.match(source, /set-auto-fix/);
    assert.match(source, /onSyncPrs/);
    assert.match(source, /onSubmitFeedback/);
    assert.match(source, /onStopVm/);
    assert.match(source, /Stop VM runtime/);
    assert.match(source, /detailReloadKey/);
    assert.match(source, /setDetailReloadKey/);
  });

  it("marks unavailable command palette commands disabled instead of no-op", () => {
    assert.match(source, /disabled\?: boolean/);
    assert.match(source, /Pause scheduler \(use \/forge stop\)/);
    assert.match(source, /disabled: true/);
    assert.match(source, /command\.disabled/);
  });
});
