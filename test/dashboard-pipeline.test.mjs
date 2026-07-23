import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { FORGE_DIR } from "./helpers.mjs";

function read(path) {
  return readFileSync(path, "utf8");
}

describe("dashboard v3 queue pipeline", () => {
  test("reactive source defines the three primary queue stages", () => {
    const src = read(`${FORGE_DIR}/dashboard/frontend/src/main.ts`);

    assert.match(src, /const\s+PIPELINE_STAGES/);
    for (const label of ["Available", "Active", "Awaiting You"]) {
      assert.match(src, new RegExp(`label:\\s*["']${label}["']`));
    }
  });

  test("pipeline stage helper maps Forge states into v3 stages", () => {
    const src = read(`${FORGE_DIR}/dashboard/frontend/src/main.ts`);

    assert.match(src, /function\s+classifyIssueToPipelineStage/);
    assert.match(src, /PENDING[\s\S]*available/);
    assert.match(src, /PLANNING[\s\S]*active/);
    assert.match(src, /WORKING[\s\S]*active/);
    assert.match(src, /WATCHING_PR[\s\S]*active/);
    assert.match(src, /AWAITING_CODE_REVIEW[\s\S]*awaiting/);
    assert.match(src, /FAILED[\s\S]*awaiting/);
  });

  test("queue view renders toolbar and pipeline columns in the reactive app", () => {
    const src = read(`${FORGE_DIR}/dashboard/frontend/src/main.ts`);

    assert.match(src, /function\s+QueuePipelineView/);
    assert.match(src, /queue-toolbar/);
    assert.match(src, /pipeline-wrapper/);
    assert.match(src, /forge-v3-pipeline-column/);
  });

  test("queue view implements search, quick filters, and sorting helpers", () => {
    const src = read(`${FORGE_DIR}/dashboard/frontend/src/main.ts`);

    assert.match(src, /type QueueFilter/);
    assert.match(src, /type QueueSort/);
    assert.match(src, /function\s+issueMatchesQueueSearch/);
    assert.match(src, /function\s+issueMatchesQueueFilter/);
    assert.match(src, /function\s+sortQueueIssues/);
    assert.match(src, /queueSearch/);
    assert.match(src, /queueFilter/);
    assert.match(src, /queueSort/);
    for (const label of ["All", "Needs me", "Running", "Failed", "Watching PR", "Paused"]) {
      assert.match(src, new RegExp(label));
    }
  });

  test("queue review-next selects earliest workflow pending decision context", () => {
    const src = read(`${FORGE_DIR}/dashboard/frontend/src/main.ts`);

    assert.match(src, /function\s+selectReviewNextDecision/);
    assert.match(src, /sortDecisionsByWorkflow/);
    assert.match(src, /openReviewIssue\(nextDecision\.issue_id, nextDecision\.id\)/);
  });

  test("queue toolbar exposes add issue and refresh Linear affordances", () => {
    const src = read(`${FORGE_DIR}/dashboard/frontend/src/main.ts`);

    assert.match(src, /Add issue/);
    assert.match(src, /Refresh Linear/);
    assert.match(src, /onAddIssue/);
    assert.match(src, /onRefreshLinear/);
    assert.match(src, /forge-v3-add-issue-modal/);
    assert.match(src, /createManualIssue/);
    assert.match(src, /enqueueLinearIssueApi/);
    assert.match(src, /planningGuidance/);
    assert.match(src, /POST/);
  });

  test("pipeline stylesheet provides horizontal three-column board treatments", () => {
    const css = read(`${FORGE_DIR}/dashboard/frontend/src/style.css`);

    assert.match(css, /\.forge-v3-pipeline/);
    assert.match(css, /\.forge-v3-pipeline-column\{flex:1 1 0/);
    assert.match(css, /\.forge-v3-issue-card/);
    assert.match(css, /\.forge-v3-add-issue-backdrop/);
    assert.match(css, /\.forge-v3-add-issue-modal/);
  });
});
