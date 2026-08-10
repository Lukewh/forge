import assert from "node:assert/strict";
import test from "node:test";
import { buildRuntimeEnvironmentContext, sanitizeHistoricalRuntimeNoise, describeWorkspaceRunConfig } from "../lib/runtime-context.js";

test("describeWorkspaceRunConfig defaults to local mode", () => {
  assert.deepEqual(describeWorkspaceRunConfig({ forgeDir: "/tmp/missing-forge", worktreePath: "/repo/wt", existsSync: () => false }), {
    mode: "local",
    worktreePath: "/repo/wt",
    effectiveCwd: "/repo/wt",
    sshTarget: null,
    configPath: "/tmp/missing-forge/workspace-run.config.json",
  });
});

test("describeWorkspaceRunConfig reports ssh mode without executing ssh", () => {
  const config = JSON.stringify({ mode: "ssh", ssh: { target: "orb", pathMappings: [{ localPrefix: "/Users/me", remotePrefix: "/home/me" }] } });
  const result = describeWorkspaceRunConfig({
    forgeDir: "/forge",
    worktreePath: "/Users/me/repo",
    existsSync: () => true,
    readFileSync: () => config,
  });
  assert.equal(result.mode, "ssh");
  assert.equal(result.sshTarget, "orb");
  assert.equal(result.effectiveCwd, "/home/me/repo");
});

test("buildRuntimeEnvironmentContext warns not to ssh orb from an Orb/Linux backend", () => {
  const text = buildRuntimeEnvironmentContext({
    forgeDir: "/home/user/forge",
    worktreePath: "/home/user/worktree",
    platform: "linux",
    hostname: "orb",
    isOrbBackend: true,
    workspace: { mode: "local", effectiveCwd: "/home/user/worktree", sshTarget: null },
  });
  assert.match(text, /Forge Runtime Environment — HIGH PRIORITY/);
  assert.match(text, /workspace-run mode: local/);
  assert.match(text, /Do not run `ssh orb`/);
  assert.match(text, /Do not inspect Docker, devcontainers, or alternate VM setups/);
});

test("buildRuntimeEnvironmentContext preserves ssh-mode support", () => {
  const text = buildRuntimeEnvironmentContext({
    forgeDir: "/Users/me/forge",
    worktreePath: "/Users/me/wt",
    platform: "darwin",
    hostname: "mac",
    isOrbBackend: false,
    workspace: { mode: "ssh", effectiveCwd: "/home/me/wt", sshTarget: "orb" },
  });
  assert.match(text, /workspace-run mode: ssh/);
  assert.match(text, /workspace-run is already configured for SSH target `orb`/);
  assert.doesNotMatch(text, /Do not run `ssh orb` from inside this backend/);
});

test("sanitizeHistoricalRuntimeNoise collapses stale environment chatter", () => {
  const input = [
    "# Log",
    "- Implemented feature",
    "- VM unavailable so CI will verify",
    "- devcontainer not running",
    "- missing node_modules in worktree",
    "- Real product requirement: add Docker status column",
  ].join("\n");
  const output = sanitizeHistoricalRuntimeNoise(input);
  assert.match(output, /Implemented feature/);
  assert.match(output, /Real product requirement: add Docker status column/);
  assert.match(output, /Forge omitted 3 stale historical environment note/);
  assert.doesNotMatch(output, /devcontainer not running/);
});
