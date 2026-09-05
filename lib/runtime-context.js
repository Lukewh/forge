"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

function normalizePrefix(prefix) {
  return path.resolve(prefix).replace(/\/$/, "");
}

function translatePath(localPath, mappings = []) {
  const resolved = path.resolve(localPath);
  const matches = mappings
    .filter(mapping => mapping && mapping.localPrefix && mapping.remotePrefix)
    .map(mapping => ({
      localPrefix: normalizePrefix(mapping.localPrefix),
      remotePrefix: String(mapping.remotePrefix).replace(/\/$/, ""),
    }))
    .filter(mapping => resolved === mapping.localPrefix || resolved.startsWith(`${mapping.localPrefix}${path.sep}`))
    .sort((a, b) => b.localPrefix.length - a.localPrefix.length);
  if (!matches.length) return null;
  const match = matches[0];
  const suffix = resolved.slice(match.localPrefix.length).split(path.sep).join("/");
  return `${match.remotePrefix}${suffix}`;
}

function describeWorkspaceRunConfig(options = {}) {
  const forgeDir = options.forgeDir || process.env.FORGE_DIR || path.resolve(__dirname, "..");
  const worktreePath = options.worktreePath || process.cwd();
  const existsSync = options.existsSync || fs.existsSync;
  const readFileSync = options.readFileSync || fs.readFileSync;
  const configPath = path.join(forgeDir, "workspace-run.config.json");
  let config = { mode: "local" };
  if (existsSync(configPath)) {
    try {
      const parsed = JSON.parse(readFileSync(configPath, "utf8"));
      if (parsed && typeof parsed === "object") config = parsed;
    } catch (error) {
      config = { mode: "invalid", error: error.message };
    }
  }
  const mode = config.mode || "local";
  const ssh = config.ssh || {};
  const remotePath = mode === "ssh" ? translatePath(worktreePath, ssh.pathMappings || []) : null;
  return {
    mode,
    worktreePath,
    effectiveCwd: remotePath || worktreePath,
    sshTarget: mode === "ssh" ? ssh.target || null : null,
    configPath,
    ...(config.error ? { error: config.error } : {}),
  };
}

function detectRuntime(options = {}) {
  const platform = options.platform || process.platform;
  const hostname = options.hostname || os.hostname();
  const existsSync = options.existsSync || fs.existsSync;
  const env = options.env || process.env;
  const isOrbBackend = Boolean(
    options.isOrbBackend ?? (
      platform === "linux" && (
        existsSync("/opt/orbstack-guest") ||
        hostname.toLowerCase().includes("orb") ||
        Object.keys(env).some(key => key.startsWith("ORBSTACK"))
      )
    )
  );
  return { platform, hostname, isOrbBackend };
}

function buildRuntimeEnvironmentContext(options = {}) {
  const runtime = detectRuntime(options);
  const workspace = options.workspace || describeWorkspaceRunConfig({ forgeDir: options.forgeDir, worktreePath: options.worktreePath });
  const forgeDir = options.forgeDir || process.env.FORGE_DIR || path.resolve(__dirname, "..");
  const worktreePath = options.worktreePath || process.cwd();
  const lines = [
    "## Forge Runtime Environment — HIGH PRIORITY",
    "Forge has already determined the execution environment. Use these facts instead of probing Docker/devcontainers/VM setup.",
    "",
    `- Backend platform: ${runtime.platform}`,
    `- Backend host: ${runtime.hostname}`,
    `- Forge directory: ${forgeDir}`,
    `- Worktree path: ${worktreePath}`,
    `- workspace-run mode: ${workspace.mode}`,
    `- Effective command cwd: ${workspace.effectiveCwd || worktreePath}`,
    "- Run project commands through: `$FORGE_DIR/scripts/workspace-run \"$PWD\" -- <command>`",
    "- Never create, copy, symlink, stage, or commit `node_modules` inside a worktree. If dependencies are unavailable, skip local test execution and let CI verify.",
  ];

  if (workspace.mode === "local") {
    lines.push("- workspace-run is local. Do not inspect Docker, devcontainers, or alternate VM setups unless the issue itself explicitly requires it or a command output proves it is necessary.");
  } else if (workspace.mode === "ssh") {
    lines.push(`- workspace-run is already configured for SSH target \`${workspace.sshTarget || "unknown"}\`. Use workspace-run; do not run raw SSH commands yourself.`);
  } else if (workspace.mode === "invalid") {
    lines.push(`- workspace-run config is invalid: ${workspace.error || "unknown error"}. Report this instead of probing alternate environments.`);
  }

  if (runtime.isOrbBackend) {
    lines.push("- This backend is already running inside the VM/Orb environment. Do not run `ssh orb` from inside this backend.");
  }

  lines.push("- Historical plan/handoff notes may mention older VM/devcontainer failures. Prefer this runtime section for current execution decisions.");
  lines.push("");
  return lines.join("\n");
}

const staleRuntimePatterns = [
  /devcontainer (?:unavailable|not running|mounts|ooms|needs|failed)/i,
  /dev container (?:unavailable|not running|failed)/i,
  /\bVM (?:unavailable|was down|is down|timed out|unavailable for lint|unavailable for test)/i,
  /OrbStack (?:VM )?(?:unavailable|was down|still unavailable)/i,
  /SSH proxy connection refused/i,
  /missing node_modules|lacks node_modules|no node_modules/i,
  /node_modules (?:symlinked|symlink|linked|was committed|got staged|removed accidentally staged)/i,
  /symlink(?:ed|ing)? .*node_modules/i,
  /CI will verify/i,
  /run .*via `?ssh orb|via `?ssh orb|using `?ssh orb/i,
];

function sanitizeHistoricalRuntimeNoise(text) {
  const lines = String(text || "").split("\n");
  let omitted = 0;
  const kept = [];
  for (const line of lines) {
    if (staleRuntimePatterns.some(pattern => pattern.test(line))) {
      omitted += 1;
      continue;
    }
    kept.push(line);
  }
  if (!omitted) return String(text || "");
  kept.push("");
  kept.push(`[Forge omitted ${omitted} stale historical environment note${omitted === 1 ? "" : "s"}. Current runtime environment is listed above.]`);
  return kept.join("\n");
}

module.exports = {
  buildRuntimeEnvironmentContext,
  describeWorkspaceRunConfig,
  detectRuntime,
  sanitizeHistoricalRuntimeNoise,
  translatePath,
};
