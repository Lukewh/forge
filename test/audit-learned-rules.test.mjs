import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const script = path.resolve("scripts/audit-learned-rules");

test("audit-learned-rules reports stale environment-specific learned rules", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "forge-prompts-"));
  const agents = path.join(dir, "agents");
  mkdirSync(agents);
  writeFileSync(path.join(agents, "coder.md"), "# Coder\n\n## Learned rules\n- Run checks with ssh orb when node_modules are missing.\n- Prefer tests.\n");
  const out = execFileSync(process.execPath, [script, "--agents-dir", agents], { encoding: "utf-8" });
  const json = JSON.parse(out);
  assert.equal(json.matches.length, 1);
  assert.equal(json.matches[0].file, "coder.md");
  assert.match(json.matches[0].line, /ssh orb/);
});
