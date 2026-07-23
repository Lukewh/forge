#!/usr/bin/env node
import fs from "node:fs";
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

function getArg(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : null;
}

const cwd = getArg("--cwd") || process.cwd();
const modelName = getArg("--model") || undefined;
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
  // extensions (for example anthropic-vertex/sonnet-4-6) are visible.
  const result = resolveCliModel({ cliModel: modelName, modelRegistry });
  if (result.model) {
    await session.setModel(result.model);
    if (result.thinkingLevel) session.setThinkingLevel(result.thinkingLevel);
  } else if (result.error) {
    console.error(`[forge:pi-sdk] WARN: ${result.error}; using pi default`);
  }
  if (result.warning) console.error(`[forge:pi-sdk] WARN: ${result.warning}`);
}

function writeEvent(event) {
  process.stdout.write(JSON.stringify(event) + "\n");
}

const unsubscribe = session.subscribe((event) => {
  if (event.type === "message_update") {
    const update = event.assistantMessageEvent;
    if (update?.type === "text_delta") {
      writeEvent({ type: "text_delta", delta: update.delta });
      return;
    }
    if (update?.type === "thinking_delta") {
      writeEvent({ type: "thinking_delta", delta: update.delta });
      return;
    }
  }

  if (event.type === "tool_execution_start") {
    writeEvent({
      type: "tool_start",
      toolName: event.toolName,
      input: event.input ?? event.arguments ?? event.params ?? null,
    });
    return;
  }

  if (event.type === "tool_execution_update") {
    writeEvent({
      type: "tool_update",
      toolName: event.toolName,
      text: event.text ?? event.output ?? event.delta ?? "",
    });
    return;
  }

  if (event.type === "tool_execution_end") {
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
} finally {
  unsubscribe();
  session.dispose();
}
