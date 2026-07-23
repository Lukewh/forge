#!/usr/bin/env node
"use strict";

const path = require("path");

const FORGE_DIR = process.env.FORGE_DIR || path.resolve(__dirname, "..");
const args = process.argv.slice(2);

function usage() {
  console.log(`Forge Dashboard

Usage:
  forge-dashboard [--port 3142] [--db /path/to/forge.db]

Environment:
  FORGE_DIR      Forge installation directory (defaults to package root)
  FORGE_DB_PATH  SQLite database path
  PORT           Dashboard port
`);
}

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "--help" || arg === "-h") {
    usage();
    process.exit(0);
  }
  if (arg === "--port" || arg === "-p") {
    const value = args[++i];
    if (!value) {
      console.error("Missing value for --port");
      process.exit(2);
    }
    process.env.PORT = value;
    continue;
  }
  if (arg === "--db") {
    const value = args[++i];
    if (!value) {
      console.error("Missing value for --db");
      process.exit(2);
    }
    process.env.FORGE_DB_PATH = path.resolve(value);
    continue;
  }
  console.error(`Unknown argument: ${arg}`);
  usage();
  process.exit(2);
}

process.env.FORGE_DIR = FORGE_DIR;
require(path.join(FORGE_DIR, "dashboard", "server.js"));
