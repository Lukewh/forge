import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const script = path.resolve("scripts/workspace-run");

test("workspace-run --describe reports default local mode without running a command", () => {
  const forgeDir = mkdtempSync(path.join(tmpdir(), "forge-wr-"));
  const wt = mkdtempSync(path.join(tmpdir(), "forge-wt-"));
  const out = execFileSync(process.execPath, [script, "--describe", wt], {
    env: { ...process.env, FORGE_DIR: forgeDir },
    encoding: "utf-8",
  });
  const json = JSON.parse(out);
  assert.equal(json.mode, "local");
  assert.equal(json.worktreePath, path.resolve(wt));
  assert.equal(json.effectiveCwd, path.resolve(wt));
  assert.equal(json.sshTarget, null);
});

test("workspace-run --describe reports ssh mode and translated cwd", () => {
  const forgeDir = mkdtempSync(path.join(tmpdir(), "forge-wr-"));
  const localRoot = mkdtempSync(path.join(tmpdir(), "forge-local-"));
  const wt = path.join(localRoot, "repo");
  mkdirSync(wt);
  writeFileSync(path.join(forgeDir, "workspace-run.config.json"), JSON.stringify({
    mode: "ssh",
    ssh: { target: "orb", pathMappings: [{ localPrefix: localRoot, remotePrefix: "/remote/root" }] },
  }));
  const out = execFileSync(process.execPath, [script, "--describe", wt], {
    env: { ...process.env, FORGE_DIR: forgeDir },
    encoding: "utf-8",
  });
  const json = JSON.parse(out);
  assert.equal(json.mode, "ssh");
  assert.equal(json.sshTarget, "orb");
  assert.equal(json.effectiveCwd, "/remote/root/repo");
});
