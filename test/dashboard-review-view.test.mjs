import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../dashboard/frontend/src/main.ts", import.meta.url), "utf8");
const styles = readFileSync(new URL("../dashboard/frontend/src/style.css", import.meta.url), "utf8");
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

describe("dashboard v3 issue-scoped review", () => {
  it("registers dashboard review tests in frontend/default test scripts", () => {
    assert.match(pkg.scripts.test, /test\/dashboard-review-view\.test\.mjs/);
    assert.match(pkg.scripts["test:fe"], /test\/dashboard-review-view\.test\.mjs/);
    assert.match(pkg.scripts["test:all"], /test\/dashboard-review-view\.test\.mjs/);
  });

  it("removes the global review destination from primary navigation", () => {
    assert.doesNotMatch(source, /label:\s*["']Review["']/);
    assert.doesNotMatch(source, /key:\s*["']review["']/);
    assert.doesNotMatch(source, /activeView === "review"/);
    assert.doesNotMatch(source, /function ReviewDiffView\(/);
  });

  it("keeps legacy review deep links issue-scoped", () => {
    assert.match(source, /viewOrEntity\s*===\s*"review"/);
    assert.match(source, /view:\s*"queue"/);
    assert.match(source, /decisionId:\s*maybeDecisionMarker === "decision"/);
    assert.doesNotMatch(source, /`review\/\$\{ids\.issueId\}/);
  });

  it("routes queue review actions to the issue detail diff sidecar", () => {
    assert.match(source, /const openReviewIssue = \(issueId: number/);
    assert.match(source, /setSelectedIssueId\(issueId\)/);
    assert.match(source, /setActiveView\("queue"\)/);
    assert.match(source, /setDetailAutoOpenDiffKey\(\(key\) => key \+ 1\)/);
    assert.match(source, /autoOpenDiffKey/);
  });

  it("issue detail auto-opens the connected diff sidecar from real diff data", () => {
    assert.match(source, /useEffect\(\(\) => \{\n\s*if \(!issueId \|\| autoOpenDiffKey <= 0\) return;/);
    assert.match(source, /setDiffModalOpen\(true\)/);
    assert.match(source, /getJson<DiffPayload>\(`\/api\/issues\/\$\{issueId\}\/diff`\)/);
    assert.match(source, /parseUnifiedDiff/);
    assert.match(source, /forge-v3-diff-sidecar/);
  });

  it("code review sidecar collects structured review feedback", () => {
    assert.match(source, /type ReviewComment/);
    assert.match(source, /reviewedFiles/);
    assert.match(source, /reviewComments/);
    assert.match(source, /addReviewComment/);
    assert.match(source, /toggleReviewedFile/);
    assert.match(source, /kind: "code-review"/);
    assert.match(source, /reviewedFiles,/);
    assert.match(source, /comments: reviewComments\.map/);
    assert.match(source, /resolveCodeReview\("approved"\)/);
    assert.match(source, /resolveCodeReview\("rejected"\)/);
  });

  it("code review sidecar uses review tour APIs", () => {
    assert.match(source, /getJson<ReviewTourPayload>\(`\/api\/issues\/\$\{id\}\/tour`\)/);
    assert.match(source, /postJson<ReviewTourPayload>\(`\/api\/issues\/\$\{issue\.id\}\/generate-tour`/);
    assert.match(source, /AI tour/);
    assert.match(source, /Regenerate tour/);
    assert.match(source, /Generate tour/);
  });

  it("review styling remains available for issue-scoped diff sidecars", () => {
    assert.match(styles, /\.forge-v3-diff-review/);
    assert.match(styles, /\.forge-v3-diff-file-list/);
    assert.match(styles, /\.forge-v3-diff-table/);
    assert.match(styles, /\.forge-v3-code-review-sidecar/);
    assert.match(styles, /\.forge-v3-review-tour/);
    assert.match(styles, /\.forge-v3-review-comments/);
  });
});
