import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../dashboard/frontend/src/main.ts", import.meta.url), "utf8");
const styles = readFileSync(new URL("../dashboard/frontend/src/style.css", import.meta.url), "utf8");
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

describe("dashboard v3 archive view", () => {
  it("registers archive tests in frontend/default test scripts", () => {
    assert.match(pkg.scripts.test, /test\/dashboard-archive-view\.test\.mjs/);
    assert.match(pkg.scripts["test:fe"], /test\/dashboard-archive-view\.test\.mjs/);
    assert.match(pkg.scripts["test:all"], /test\/dashboard-archive-view\.test\.mjs/);
  });

  it("reactive source defines an archive view backed by the archive API", () => {
    assert.match(source, /function ArchiveView\(/);
    assert.match(source, /ArchiveIssue/);
    assert.match(source, /summaryContent/);
    assert.match(source, /getJson<ArchiveIssue\[]>\("\/api\/archive"\)/);
    assert.match(source, /activeView === "archive"/);
  });

  it("archive view renders v3 stats strip and completed issue cards", () => {
    assert.match(source, /forge-v3-archive-stats/);
    assert.match(source, /Total completed/);
    assert.match(source, /Completed this week/);
    assert.match(source, /Average time to merge/);
    assert.match(source, /Average PRs per issue/);
    assert.match(source, /forge-v3-archive-card/);
    assert.match(source, /PR links/);
    assert.match(source, /Agent runs/);
  });

  it("archive view filters and opens completed issue summaries", () => {
    assert.match(source, /archiveIssueSearchText/);
    assert.match(source, /archiveSearch/);
    assert.match(source, /visibleIssues/);
    assert.match(source, /selectedArchiveId/);
    assert.match(source, /ArchiveIssueSidecar/);
    assert.match(source, /renderMarkdown\(issue\.summaryContent\)/);
  });

  it("archive view renders clickable PR links when URLs are available", () => {
    assert.match(source, /pr\.url/);
    assert.match(source, /target: "_blank"/);
    assert.match(source, /rel: "noreferrer"/);
  });

  it("archive view has graceful loading and empty states", () => {
    assert.match(source, /Loading archive…/);
    assert.match(source, /No completed issues yet/);
    assert.match(source, /Unable to load archive/);
  });

  it("archive stylesheet provides card list and stats strip treatments", () => {
    assert.match(styles, /\.forge-v3-stats-strip\s*\{[^}]*grid-template-columns/s);
    assert.match(styles, /\.forge-v3-archive-grid\s*\{[^}]*display:\s*flex/s);
    assert.match(styles, /\.forge-v3-archive-card/);
    assert.match(styles, /\.forge-v3-archive-meta/);
    assert.match(styles, /\.forge-v3-archive-sidecar/);
    assert.match(styles, /\.forge-v3-archive-pr-row/);
  });
});
