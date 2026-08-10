import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const agentDir = path.resolve("agents");
const promptFiles = readdirSync(agentDir).filter(name => name.endsWith(".md"));

test("agent prompts do not tell agents to use devcontainers or raw ssh orb", () => {
  for (const file of promptFiles) {
    const content = readFileSync(path.join(agentDir, file), "utf-8");
    assert.doesNotMatch(content, /ssh orb/i, `${file} should not mention raw ssh orb`);
    assert.doesNotMatch(content, /devcontainer/i, `${file} should not mention devcontainers`);
  }
});

test("runtime-heavy prompts defer environment decisions to Forge Runtime Environment", () => {
  for (const file of ["planner.md", "coder.md", "fixer.md", "reviewer.md"]) {
    const content = readFileSync(path.join(agentDir, file), "utf-8");
    assert.match(content, /Forge Runtime Environment/, `${file} should reference runtime context`);
    assert.match(content, /workspace-run/, `${file} should keep workspace-run guidance`);
  }
});
