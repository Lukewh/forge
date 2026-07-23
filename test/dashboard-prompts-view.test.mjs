import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../dashboard/frontend/src/main.ts", import.meta.url), "utf8");
const styles = readFileSync(new URL("../dashboard/frontend/src/style.css", import.meta.url), "utf8");
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

describe("dashboard v3 agent prompts view", () => {
  it("registers prompt tests in frontend/default test scripts", () => {
    assert.match(pkg.scripts.test, /test\/dashboard-prompts-view\.test\.mjs/);
    assert.match(pkg.scripts["test:fe"], /test\/dashboard-prompts-view\.test\.mjs/);
    assert.match(pkg.scripts["test:all"], /test\/dashboard-prompts-view\.test\.mjs/);
  });

  it("reactive source defines a prompts view and all expected agent prompt types", () => {
    assert.match(source, /function AgentPromptsView\(/);
    assert.match(source, /AGENT_PROMPT_TYPES/);
    for (const type of ["planner", "plan-reviewer", "coder", "reviewer", "git-agent", "fixer", "split-planner", "splitter"]) {
      assert.match(source, new RegExp(type));
    }
    assert.match(source, /activeView === "prompts"/);
  });

  it("prompts view uses prompt endpoints and settings API for model overrides", () => {
    assert.match(source, /\/api\/agents\/\$\{type\}\/prompt/);
    assert.match(source, /method:\s*"PUT"/);
    assert.match(source, /\/api\/agents\/\$\{type\}\/prompt\/default/);
    assert.match(source, /getJson<Settings>\("\/api\/settings"\)/);
    assert.match(source, /method:\s*"PATCH"/);
    assert.match(source, /PROMPT_MODEL_SETTINGS/);
    assert.match(source, /Reset to default/);
    assert.match(source, /Save prompt/);
  });

  it("prompts view renders prompt editor cards with metadata affordances", () => {
    assert.match(source, /forge-v3-prompts-grid/);
    assert.match(source, /forge-v3-prompt-card/);
    assert.match(source, /charCount/);
    assert.match(source, /learned-rules/);
    assert.match(source, /Default model/);
    assert.match(source, /Model override/);
  });

  it("prompts stylesheet provides prompt card and editor treatments", () => {
    assert.match(styles, /\.forge-v3-prompts-grid\s*\{[^}]*grid-template-columns/s);
    assert.match(styles, /\.forge-v3-prompt-card/);
    assert.match(styles, /\.forge-v3-prompt-editor/);
    assert.match(styles, /\.forge-v3-prompt-meta/);
    assert.match(styles, /\.forge-v3-model-default-card/);
    assert.match(styles, /\.forge-v3-prompt-model-input/);
  });
});
