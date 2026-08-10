/**
 * Forge test helpers — shared setup across all test files
 */

import { createJiti }  from "jiti";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { mkdtempSync, rmSync, existsSync, readFileSync, readdirSync } from "fs";
import { tmpdir }      from "os";
import { join }        from "path";

export const FORGE_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Read all dashboard v3 frontend source files concatenated into a single string.
 * Tests that regex-match against source should use this instead of reading main.ts alone,
 * since the codebase is now split across multiple modules.
 */
export function readAllDashboardSource() {
  const srcDir = join(FORGE_DIR, "dashboard/frontend/src");
  const files = [];
  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(join(dir, entry.name));
      else if (/\.(ts|tsx)$/.test(entry.name)) files.push(join(dir, entry.name));
    }
  }
  walk(srcDir);
  return files.map(f => readFileSync(f, "utf8")).join("\n");
}

// jiti instance for loading TypeScript files
const jiti = createJiti(fileURLToPath(import.meta.url), { interopDefault: true });

// Lazy-loaded modules
let _ForgeDB, _ForgeScheduler;

export function loadForgeDB() {
  if (!_ForgeDB) ({ ForgeDB: _ForgeDB } = jiti(`${FORGE_DIR}/db.ts`));
  return _ForgeDB;
}

export function loadForgeScheduler() {
  if (!_ForgeScheduler) ({ ForgeScheduler: _ForgeScheduler } = jiti(`${FORGE_DIR}/scheduler.ts`));
  return _ForgeScheduler;
}

/**
 * Create an isolated temp DB for a test. Returns { db, cleanup }.
 * Pass to afterEach to ensure cleanup even on failure.
 */
export function makeTempDB() {
  const ForgeDB = loadForgeDB();
  const dir  = mkdtempSync(join(tmpdir(), "forge-test-"));
  const path = join(dir, "forge.db");
  const db   = new ForgeDB(path);
  const cleanup = () => {
    try { db.close(); } catch {}
    try { rmSync(dir, { recursive: true, force: true }); } catch {}
  };
  return { db, dbPath: path, cleanup };
}

/** Seed a DB with a standard set of issues for testing */
export function seedIssues(db) {
  const i1 = db.createIssue({ source: "linear", linearId: "BAND-1001", title: "Feature A", priority: 2 });
  const i2 = db.createIssue({ source: "linear", linearId: "BAND-1002", title: "Feature B", priority: 1 });
  const i3 = db.createIssue({ source: "manual",                        title: "Manual fix", priority: 3 });
  return { i1, i2, i3 };
}

/** Advance an issue's locked_at into the past to simulate a stale lock */
export function makeStale(db, issueId, minutesAgo = 15) {
  db["db"].prepare(
    `UPDATE issues SET locked_at = datetime('now', ? || ' minutes') WHERE id = ?`
  ).run(`-${minutesAgo}`, issueId);
}
