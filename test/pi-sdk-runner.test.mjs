import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { FORGE_DIR } from "./helpers.mjs";

describe("pi-sdk-runner", () => {
  const src = readFileSync(`${FORGE_DIR}/pi-sdk-runner.mjs`, "utf-8");

  test("uses SDK model resolution after extensions are loaded", () => {
    assert.match(src, /resolveCliModel\(\{ cliModel: modelName, modelRegistry \}\)/);
    assert.match(src, /await session\.setModel\(result\.model\)/);
  });

  test("emits normalized streaming events for the listener", () => {
    assert.match(src, /type: "text_delta"/);
    assert.match(src, /type: "thinking_delta"/);
    assert.match(src, /type: "tool_start"/);
    assert.match(src, /type: "tool_end"/);
  });

  test("Forge functionality does not shell out to the pi CLI", () => {
    const files = [];
    function walk(dir) {
      for (const name of readdirSync(dir)) {
        if (["node_modules", ".git", "dist"].includes(name) || name.startsWith("forge.db")) continue;
        const full = join(dir, name);
        const st = statSync(full);
        if (st.isDirectory()) walk(full);
        else if (/\.(js|mjs|ts)$/.test(name) && !relative(FORGE_DIR, full).startsWith("test/")) files.push(full);
      }
    }
    walk(FORGE_DIR);

    const shellOutToPi = /\b(?:execFileSync|execFile|spawn|spawnSync)\s*\(\s*["']pi["']/;
    const offenders = files
      .map(file => ({ file: relative(FORGE_DIR, file), text: readFileSync(file, "utf-8") }))
      .filter(({ file, text }) => file !== "pi-sdk-runner.mjs" && shellOutToPi.test(text))
      .map(({ file }) => file);

    assert.deepEqual(offenders, []);
  });
});
