#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");
const Database = require("better-sqlite3");

const FORGE_DIR = process.env.FORGE_DIR || path.resolve(__dirname, "..");
const DB_PATH = process.env.FORGE_DB_PATH || path.join(FORGE_DIR, "forge.db");
const DASHBOARD_PATH = path.join(FORGE_DIR, "dashboard", "server.js");
const SCHEDULER_PATH = path.join(FORGE_DIR, "start-scheduler.mjs");
const SETUP_PATH = path.join(FORGE_DIR, "scripts", "first-run-setup");

function usage() {
  console.log(`Forge standalone

Usage:
  forge setup
  forge dashboard [--port 3142]
  forge start
  forge add <LINEAR-ID|title>
  forge list
  forge status
`);
}

function db() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const database = new Database(DB_PATH);
  database.pragma("journal_mode = WAL");
  database.pragma("busy_timeout = 5000");
  database.prepare("CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)").run();
  database.prepare(`CREATE TABLE IF NOT EXISTS issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL DEFAULT 'manual',
    linear_id TEXT,
    title TEXT NOT NULL,
    priority INTEGER NOT NULL DEFAULT 0,
    state TEXT NOT NULL DEFAULT 'PENDING',
    previous_state TEXT,
    locked_at TEXT,
    agent_pid INTEGER,
    steering_context TEXT,
    pi_sessions_json TEXT,
    project_file_path TEXT,
    wt_path TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`).run();
  database.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_issues_linear_id ON issues(linear_id) WHERE linear_id IS NOT NULL").run();
  return database;
}

function spawnDetached(command, args, env = {}) {
  const proc = spawn(command, args, {
    cwd: FORGE_DIR,
    env: { ...process.env, FORGE_DIR, FORGE_DB_PATH: DB_PATH, ...env },
    detached: true,
    stdio: "ignore",
  });
  proc.unref();
  return proc.pid;
}

const [cmd, ...args] = process.argv.slice(2);

(async () => {
  switch (cmd) {
    case "setup": {
      const proc = spawn(SETUP_PATH, args, { cwd: FORGE_DIR, env: { ...process.env, FORGE_DIR, FORGE_DB_PATH: DB_PATH }, stdio: "inherit" });
      proc.on("exit", code => process.exit(code ?? 1));
      break;
    }
    case "dashboard": {
      const portIndex = args.indexOf("--port");
      const port = portIndex >= 0 ? args[portIndex + 1] : process.env.PORT || "3142";
      const pid = spawnDetached(process.execPath, [DASHBOARD_PATH], { PORT: port });
      console.log(`Forge dashboard starting at http://localhost:${port} (pid ${pid})`);
      break;
    }
    case "start": {
      const pid = spawnDetached(process.execPath, [SCHEDULER_PATH]);
      console.log(`Forge scheduler starting (pid ${pid})`);
      break;
    }
    case "add": {
      const input = args.join(" ").trim();
      if (!input) return usage();
      const database = db();
      const isLinear = /^[A-Z]+-\d+$/.test(input);
      if (isLinear) {
        const existing = database.prepare("SELECT id FROM issues WHERE linear_id = ?").get(input);
        if (existing) { console.log(`${input} is already in Forge (#${existing.id})`); database.close(); return; }
        const result = database.prepare("INSERT INTO issues (source, linear_id, title) VALUES ('linear', ?, ?)").run(input, input);
        try { database.prepare("INSERT INTO desktop_jobs (type, payload_json) VALUES (?, ?)").run("linear.fetchIssue", JSON.stringify({ issueId: result.lastInsertRowid, linearId: input })); } catch {}
        console.log(`Added ${input} as issue #${result.lastInsertRowid}`);
      } else {
        const result = database.prepare("INSERT INTO issues (source, title) VALUES ('manual', ?)").run(input);
        console.log(`Added manual issue #${result.lastInsertRowid}`);
      }
      database.close();
      break;
    }
    case "list":
    case "status": {
      const database = db();
      const issues = database.prepare("SELECT * FROM issues ORDER BY id DESC LIMIT 50").all();
      if (!issues.length) console.log("No issues in Forge.");
      for (const issue of issues) console.log(`#${issue.id} ${issue.linear_id ? `[${issue.linear_id}] ` : ""}${issue.title} — ${issue.state}`);
      database.close();
      break;
    }
    case undefined:
    case "help":
    case "--help":
    case "-h":
      usage();
      break;
    default:
      console.error(`Unknown command: ${cmd}`);
      usage();
      process.exit(2);
  }
})();
