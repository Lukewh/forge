#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import {
  AuthStorage,
  createAgentSession,
  DefaultResourceLoader,
  getAgentDir,
  ModelRegistry,
  resolveCliModel,
  SessionManager,
} from "@earendil-works/pi-coding-agent";

function applyVertexEnv() {
  const configPath = path.join(os.homedir(), ".pi", "agent", "settings", "pi-vertex.json");
  if (!fs.existsSync(configPath)) return;
  try {
    const cfg = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    if (cfg.googleCloudProject && !process.env.GOOGLE_CLOUD_PROJECT && !process.env.GCLOUD_PROJECT) {
      process.env.GOOGLE_CLOUD_PROJECT = cfg.googleCloudProject;
    }
    if (cfg.googleCloudLocation) {
      process.env.GOOGLE_CLOUD_LOCATION = cfg.googleCloudLocation;
    }
    const creds = cfg.googleApplicationCredentials || cfg.credentialsFile;
    if (creds && !process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(creds)) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = creds;
    }
  } catch {}
}

applyVertexEnv();

function getArg(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : null;
}

const cwd = getArg("--cwd") || process.cwd();
const rawModelName = getArg("--model") || undefined;
const MODEL_ALIASES = new Map([
  ["anthropic-vertex/sonnet-4-6", "vertex-anthropic/claude-sonnet-4-5@20250929"],
  ["anthropic-vertex/sonnet-4.6", "vertex-anthropic/claude-sonnet-4-5@20250929"],
  ["anthropic-vertex/opus-4-6", "vertex-anthropic/claude-opus-4-6"],
]);
const modelName = rawModelName ? MODEL_ALIASES.get(rawModelName) || rawModelName : undefined;
const systemPromptPath = getArg("--system-prompt") || null;
const promptFile = getArg("--prompt-file") || null;
const promptArg = getArg("--prompt") || null;
const prompt = promptFile ? fs.readFileSync(promptFile, "utf-8") : promptArg;

if (!prompt) {
  console.error("Missing --prompt-file or --prompt");
  process.exit(2);
}

const appendSystemPrompt = systemPromptPath && fs.existsSync(systemPromptPath)
  ? fs.readFileSync(systemPromptPath, "utf-8")
  : "";

const authStorage = AuthStorage.create();
const modelRegistry = ModelRegistry.create(authStorage);
const loader = new DefaultResourceLoader({
  cwd,
  agentDir: getAgentDir(),
  appendSystemPromptOverride: (base) => appendSystemPrompt ? [...base, appendSystemPrompt] : base,
});
await loader.reload();

const { session, modelFallbackMessage } = await createAgentSession({
  cwd,
  authStorage,
  modelRegistry,
  resourceLoader: loader,
  sessionManager: SessionManager.inMemory(cwd),
});

if (modelFallbackMessage) console.error(`[forge:pi-sdk] ${modelFallbackMessage}`);

if (modelName) {
  // Extension-registered providers are added while createAgentSession() binds
  // extensions. Resolve after session creation so models from global/project
  // extensions (for example vertex-anthropic/*) are visible.
  if (rawModelName && rawModelName !== modelName) console.error(`[forge:pi-sdk] WARN: model alias ${rawModelName} resolved to ${modelName}`);
  const availableExactMatches = !modelName.includes("/")
    ? modelRegistry.getAvailable().filter((model) => model.id === modelName)
    : [];
  const result = availableExactMatches.length === 1
    ? { model: availableExactMatches[0], thinkingLevel: undefined, warning: undefined, error: undefined }
    : resolveCliModel({ cliModel: modelName, modelRegistry });
  if (result.model) {
    try {
      await session.setModel(result.model);
      if (result.thinkingLevel) session.setThinkingLevel(result.thinkingLevel);
    } catch (error) {
      const fallback = modelRegistry.getAvailable().find((model) => model.id === modelName && model.provider !== result.model.provider);
      if (!fallback) throw error;
      console.error(`[forge:pi-sdk] WARN: ${error?.message || error}; retrying with ${fallback.provider}/${fallback.id}`);
      await session.setModel(fallback);
    }
  } else if (result.error) {
    console.error(`[forge:pi-sdk] WARN: ${result.error}; using pi default`);
  }
  if (result.warning) console.error(`[forge:pi-sdk] WARN: ${result.warning}`);
}

let assistantActivitySeen = false;

function writeEvent(event) {
  process.stdout.write(JSON.stringify(event) + "\n");
}

function markAssistantActivity() {
  assistantActivitySeen = true;
}

const unsubscribe = session.subscribe((event) => {
  if (event.type === "message_update") {
    const update = event.assistantMessageEvent;
    if (update?.type === "text_delta") {
      markAssistantActivity();
      writeEvent({ type: "text_delta", delta: update.delta });
      return;
    }
    if (update?.type === "thinking_delta") {
      markAssistantActivity();
      writeEvent({ type: "thinking_delta", delta: update.delta });
      return;
    }
  }

  if (event.type === "tool_execution_start") {
    markAssistantActivity();
    writeEvent({
      type: "tool_start",
      toolName: event.toolName,
      input: event.input ?? event.arguments ?? event.params ?? null,
    });
    return;
  }

  if (event.type === "tool_execution_update") {
    markAssistantActivity();
    writeEvent({
      type: "tool_update",
      toolName: event.toolName,
      text: event.text ?? event.output ?? event.delta ?? "",
    });
    return;
  }

  if (event.type === "tool_execution_end") {
    markAssistantActivity();
    writeEvent({
      type: "tool_end",
      toolName: event.toolName,
      isError: Boolean(event.isError),
    });
  }
});

try {
  writeEvent({ type: "prompt", text: prompt });
  await session.prompt(prompt);
  if (!assistantActivitySeen) {
    console.error("[forge:pi-sdk] ERROR: model returned no assistant output or tool activity");
    process.exitCode = 1;
  }
} finally {
  unsubscribe();
  session.dispose();
}
