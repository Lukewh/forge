import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../dashboard/frontend/src/main.ts", import.meta.url), "utf8");
const server = readFileSync(new URL("../dashboard/server.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../dashboard/frontend/src/style.css", import.meta.url), "utf8");
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

describe("dashboard v3 learnings view", () => {
  it("registers learnings tests in frontend/default test scripts", () => {
    assert.match(pkg.scripts.test, /test\/dashboard-learnings-view\.test\.mjs/);
    assert.match(pkg.scripts["test:fe"], /test\/dashboard-learnings-view\.test\.mjs/);
    assert.match(pkg.scripts["test:all"], /test\/dashboard-learnings-view\.test\.mjs/);
  });

  it("reactive source defines a learnings view backed by existing learnings API", () => {
    assert.match(source, /function LearningsView\(/);
    assert.match(source, /getJson<LearningsPayload>\("\/api\/learnings"\)/);
    assert.match(source, /fetch\(`\/api\/learnings\/\$\{suggestionId\}`/);
    assert.match(source, /method:\s*"PATCH"/);
    assert.match(source, /setInterval\(refreshLearnings, 30000\)/);
    assert.match(source, /EventSource\("\/api\/events"\)/);
    assert.match(source, /activeView === "learnings"/);
  });

  it("learnings view exposes suggestions, change log, and reflection history tabs", () => {
    assert.match(source, /LEARNING_TABS/);
    assert.match(source, /Suggestions/);
    assert.match(source, /Change log/);
    assert.match(source, /Reflection history/);
    assert.match(source, /activeLearningTab/);
  });

  it("learnings API returns only unresolved suggestions", () => {
    assert.match(server, /app\.get\("\/api\/learnings"/);
    assert.match(server, /WHERE ls\.status = 'pending'/);
  });

  it("learnings view renders suggestion actions and context metadata", () => {
    assert.match(source, /Apply suggestion/);
    assert.match(source, /Reject suggestion/);
    assert.match(source, /target/);
    assert.match(source, /rationale/);
    assert.match(source, /linear_id/);
    assert.match(source, /formatDateTime\(suggestion\.created_at\)/);
    assert.match(source, /Added/);
    assert.match(source, /forge-v3-learning-card/);
  });

  it("learnings stylesheet provides tabs, cards, and timeline treatments", () => {
    assert.match(styles, /\.forge-v3-learning-tabs\s*\{[^}]*display:\s*flex/s);
    assert.match(styles, /\.forge-v3-learning-card/);
    assert.match(styles, /\.forge-v3-learning-timeline/);
    assert.match(styles, /\.forge-v3-learning-meta/);
  });
});
