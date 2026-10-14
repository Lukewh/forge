import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { mkdirSync, writeFileSync, symlinkSync } from "node:fs";
import { makeTempDB, FORGE_DIR } from "./helpers.mjs";

test("watcher can poll linked PRs without a worktree", () => {
  const fixture = makeTempDB();
  const dir = dirname(fixture.dbPath);
  const db = fixture.db.db;
  try {
    symlinkSync(join(FORGE_DIR, "node_modules"), join(dir, "node_modules"), "dir");
    mkdirSync(join(dir, "bin"));
    // No network or real GitHub access in this regression test.
    writeFileSync(join(dir, "bin", "gh"), '#!/bin/sh\ncase "$*" in\n*"pr view"*) echo \'{"state":"OPEN","mergeable":"MERGEABLE","reviews":[],"statusCheckRollup":[]}\';;\n*) echo \'{}\';;\nesac\n', { mode: 0o755 });
    const issue = fixture.db.createIssue({ source: "manual", title: "Watch an existing PR" });
    db.prepare("UPDATE issues SET state = 'WATCHING_PR', wt_path = NULL WHERE id = ?").run(issue.id);
    db.prepare("INSERT OR REPLACE INTO settings (key,value) VALUES ('github_repo','owner/repo')").run();
    db.prepare("INSERT INTO pr_stack (issue_id,gt_branch,position,pr_number,status) VALUES (?,'feature',1,42,'open')").run(issue.id);
    const run = db.prepare("INSERT INTO agent_runs (issue_id,agent_type) VALUES (?,'watcher') RETURNING id").get(issue.id);
    const output = execFileSync(process.execPath, [join(FORGE_DIR, "watcher.js"), "--issue-id", String(issue.id), "--run-id", String(run.id)], {
      env: { ...process.env, FORGE_DIR: dir, PATH: `${join(dir, "bin")}:${process.env.PATH}` }, encoding: "utf-8", timeout: 15000,
    });
    assert.match(output, /No worktree configured/);
    assert.equal(db.prepare("SELECT state FROM issues WHERE id = ?").get(issue.id).state, "WATCHING_PR");
    assert.equal(db.prepare("SELECT exit_code FROM agent_runs WHERE id = ?").get(run.id).exit_code, 0);
  } finally { fixture.cleanup(); }
});
