#!/usr/bin/env node
/**
 * Forge — Watcher Script
 *
 * Deterministic (no LLM). Spawned by the scheduler for issues in WATCHING_PR state.
 * Polls all PRs in the stack for:
 *   - New review comments requesting changes
 *   - Merge status
 *
 * On all PRs merged → transitions issue to DONE.
 * On actionable review comments → transitions issue to AWAITING_FIX_APPROVAL.
 */

"use strict";

const { execFileSync } = require("child_process");
const path = require("path");
const os = require("os");
const fs = require("fs");

// ── Args ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
function getArg(flag) {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
}

const issueId = parseInt(getArg("--issue-id"), 10);
const runId = parseInt(getArg("--run-id"), 10);

if (!issueId || !runId) {
  console.error("[forge:watcher] Missing required args: --issue-id --run-id");
  process.exit(1);
}

// ── DB ────────────────────────────────────────────────────────────────

const FORGE_DIR = process.env.FORGE_DIR || path.join(os.homedir(), ".pi", "agent", "extensions", "forge");
const Database = require(path.join(FORGE_DIR, "node_modules", "better-sqlite3"));
const db = new Database(path.join(FORGE_DIR, "forge.db"));
db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 5000");
db.pragma("foreign_keys = ON");
try { db.prepare("ALTER TABLE issues ADD COLUMN auto_fix_enabled INTEGER NOT NULL DEFAULT 0").run(); } catch {}

process.on("SIGTERM", () => { try { db.close(); } catch {} process.exit(0); });
process.on("SIGINT",  () => { try { db.close(); } catch {} process.exit(0); });


function log(msg) {
  console.log(`[${new Date().toISOString()}] [forge:watcher] ${msg}`);
}

function getSetting(key) {
  return db.prepare("SELECT value FROM settings WHERE key = ?").get(key)?.value;
}

// Linear state names to sync at each forge state
const LINEAR_STATE_MAP = {
  WATCHING_PR:            "In Review",
  IN_MERGE_QUEUE:         "In Review",
  AWAITING_FIX_APPROVAL:  "In Review",
  FIXING:                 "In Review",
  PUSHING:                "In Review",
  DONE:                   "Done",
};

function enqueueDesktopJob(type, payload) {
  try {
    return db.prepare("INSERT INTO desktop_jobs (type, payload_json) VALUES (?, ?)").run(type, JSON.stringify(payload ?? {})).lastInsertRowid;
  } catch (e) {
    log(`WARN: Could not enqueue desktop job ${type}: ${e.message}`);
    return null;
  }
}

function enqueueDesktopJobOnce(type, payload) {
  const payloadJson = JSON.stringify(payload ?? {});
  const existing = db.prepare(
    "SELECT id FROM desktop_jobs WHERE type = ? AND payload_json = ? AND status IN ('pending', 'running') LIMIT 1"
  ).get(type, payloadJson);
  if (existing) return existing.id;
  return enqueueDesktopJob(type, payload);
}

function enqueueLinearSyncJob(row, linearState, reason = "desktop bridge") {
  if (!row?.linear_id || row.linear_state === linearState) return;
  const jobId = enqueueDesktopJobOnce("linear.syncState", { issueId, linearId: row.linear_id, state: linearState });
  log(`Linear ${row.linear_id} → "${linearState}" queued via ${reason}${jobId ? ` (desktop job #${jobId})` : ""}`);
}

function syncLinearState(forgeState) {
  const linearState = LINEAR_STATE_MAP[forgeState];
  if (!linearState) return;
  const row = db.prepare("SELECT linear_id, linear_state FROM issues WHERE id = ?").get(issueId);
  const linearId = row?.linear_id;
  if (!linearId) return;
  if (row.linear_state === linearState) return; // already in sync

  if (getSetting("linear_enabled") !== "true") {
    enqueueLinearSyncJob(row, linearState);
    return;
  }

  try {
    execFileSync("linear", ["issue", "update", linearId, "--state", linearState], { timeout: 15000 });
    db.prepare("UPDATE issues SET linear_state = ?, updated_at = datetime('now') WHERE id = ?")
      .run(linearState, issueId);
    log(`Linear ${linearId} → "${linearState}"`);
  } catch (e) {
    log(`WARN: Could not update Linear state: ${e.message?.split('\n')[0]}`);
    enqueueLinearSyncJob(row, linearState, "Linear CLI fallback");
  }
}

function transition(newState) {
  db.prepare(`
    UPDATE issues
    SET previous_state = state, state = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(newState, issueId);
  log(`State → ${newState}`);
  syncLinearState(newState);
}

function unlock() {
  db.prepare(`
    UPDATE issues SET locked_at = NULL, agent_pid = NULL, updated_at = datetime('now')
    WHERE id = ?
  `).run(issueId);
}

function finishRun(exitCode) {
  db.prepare(`
    UPDATE agent_runs SET exited_at = datetime('now'), exit_code = ? WHERE id = ?
  `).run(exitCode, runId);
}

function createDecision(type, artifactRef) {
  // Only create if no pending decision of this type already exists
  const existing = db.prepare(`
    SELECT id FROM decision_queue
    WHERE issue_id = ? AND type = ? AND verdict IS NULL
    LIMIT 1
  `).get(issueId, type);
  if (existing) return null;

  const info = db.prepare(`
    INSERT INTO decision_queue (issue_id, type, artifact_ref) VALUES (?, ?, ?)
  `).run(issueId, type, artifactRef);
  return info.lastInsertRowid;
}

function buildFixSteering(comments) {
  const lines = ["Auto-fix enabled. Address all surfaced PR review comments:", ""];
  for (const c of comments) {
    const loc = c.path ? `${c.path}${c.line ? `:${c.line}` : ""}` : "(general)";
    lines.push(`### Comment by ${c.author ?? "unknown"} on ${loc}`);
    if (c.prNumber) lines.push(`PR #${c.prNumber}`);
    lines.push(c.body ?? "");
    lines.push("");
  }
  return lines.join("\n");
}

function autoFixComments(comments, artifactRef) {
  const decisionId = createDecision("FIX_APPROVAL", artifactRef);
  if (!decisionId) {
    log("Auto-fix enabled but a pending FIX_APPROVAL decision already exists — leaving it for user review");
    transition("AWAITING_FIX_APPROVAL");
    return;
  }

  const approvedIds = comments.map(c => String(c.id)).filter(Boolean);
  db.prepare(`
    UPDATE decision_queue
    SET verdict = 'approved', feedback_json = ?, resolved_at = datetime('now')
    WHERE id = ?
  `).run(JSON.stringify({ approvedIds, skippedIds: [], autoFix: true }), decisionId);

  db.prepare(`
    UPDATE issues
    SET previous_state = state, state = 'FIXING', steering_context = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(buildFixSteering(comments), issueId);
  db.prepare(`INSERT INTO activity_log (issue_id, type, actor, message, metadata) VALUES (?, 'auto_fix_triggered', 'watcher', ?, ?)`) 
    .run(issueId, `Auto-fix triggered for ${comments.length} review comment(s)`, JSON.stringify({ decisionId, approvedIds }));
  syncLinearState("FIXING");
  log(`Auto-fix enabled — transitioning directly to FIXING for ${comments.length} comment(s)`);
}

// ── GitHub / GT helpers ──────────────────────────────────────────────

function ghJson(args, cwd) {
  try {
    const out = execFileSync("gh", args, { encoding: "utf-8", timeout: 30000, cwd });
    return JSON.parse(out);
  } catch (e) {
    log(`WARN: gh ${args.slice(0,3).join(" ")} failed: ${e.message?.split("\n")[0]}`);
    return null;
  }
}

function getPrStatus(prNumber, cwd) {
  const repo = getGithubRepo();
  if (!repo.trim()) {
    log("WARN: github_repo is not configured; cannot fetch PR status");
    return null;
  }
  const data = ghJson(["pr", "view", String(prNumber), "--repo", repo, "--json",
    "state,reviews,reviewDecision,mergedAt,comments,statusCheckRollup,mergeable"], cwd);
  return data;
}

/** Fetch inline (file-level) review comments for a PR via the GitHub API.
 *  Uses --paginate so we never silently drop comments beyond the first 30. */
function getGithubRepo() {
  return db.prepare("SELECT value FROM settings WHERE key = 'github_repo'").get()?.value || "";
}

function getResolvedReviewThreadCommentIds(prNumber, cwd) {
  const repo = getGithubRepo();
  const [owner, name] = repo.split("/");
  if (!owner || !name) return new Set();

  const query = `
    query($owner:String!,$name:String!,$number:Int!,$cursor:String) {
      repository(owner:$owner,name:$name) {
        pullRequest(number:$number) {
          reviewThreads(first:100, after:$cursor) {
            pageInfo { hasNextPage endCursor }
            nodes {
              isResolved
              comments(first:50) { nodes { databaseId } }
            }
          }
        }
      }
    }
  `;

  const resolved = new Set();
  let cursor = null;
  for (;;) {
    const args = ["api", "graphql", "-f", `owner=${owner}`, "-f", `name=${name}`, "-F", `number=${prNumber}`, "-f", `query=${query}`];
    if (cursor) args.push("-f", `cursor=${cursor}`);
    const data = ghJson(args, cwd);
    const threads = data?.data?.repository?.pullRequest?.reviewThreads;
    if (!threads) break;
    for (const thread of threads.nodes ?? []) {
      if (!thread.isResolved) continue;
      for (const comment of thread.comments?.nodes ?? []) {
        if (comment.databaseId) resolved.add(String(comment.databaseId));
      }
    }
    if (!threads.pageInfo?.hasNextPage) break;
    cursor = threads.pageInfo.endCursor;
  }
  log(`PR #${prNumber}: fetched ${resolved.size} resolved review-thread comment id(s)`);
  return resolved;
}

/** Fetch inline (file-level) review comments for a PR via the GitHub API.
 *  Uses --paginate so we never silently drop comments beyond the first 30. */
function getInlineComments(prNumber, cwd) {
  const repo = getGithubRepo();
  if (!repo.trim()) return [];
  const resolvedThreadCommentIds = getResolvedReviewThreadCommentIds(prNumber, cwd);
  // --paginate makes gh concatenate all pages into a single JSON array
  const data = ghJson(["api", "--paginate", `repos/${repo}/pulls/${prNumber}/comments`], cwd);
  if (!Array.isArray(data)) {
    log(`WARN: getInlineComments PR #${prNumber} returned non-array (${typeof data})`);
    return [];
  }
  const openComments = data.filter(c => !resolvedThreadCommentIds.has(String(c.id)));
  log(`PR #${prNumber}: fetched ${data.length} inline comment(s), ${openComments.length} unresolved`);
  return openComments.map(c => ({
    id:          String(c.id),
    author:      c.user?.login ?? "unknown",
    path:        c.path ?? "",
    line:        c.line ?? c.original_line ?? null,
    body:        c.body ?? "",
    reviewState: "COMMENTED",
    createdAt:   c.created_at ?? null,
  }));
}

/**
 * Build the set of comment IDs that have already been surfaced to the user
 * (either approved-and-fixed or skipped) from past resolved FIX_APPROVAL decisions.
 */
function getSeenCommentIds() {
  const resolved = db.prepare(`
    SELECT artifact_ref, feedback_json, verdict
    FROM decision_queue
    WHERE issue_id = ? AND type = 'FIX_APPROVAL' AND verdict IS NOT NULL
  `).all(issueId);

  const seen = new Set();
  for (const d of resolved) {
    try {
      const artRef = JSON.parse(d.artifact_ref);
      if (!Array.isArray(artRef.comments)) continue;
      if (d.verdict === "rejected") {
        // User skipped everything in this decision
        for (const c of artRef.comments) seen.add(String(c.id));
      } else {
        // approved — mark approved IDs and explicitly skipped IDs as seen
        const fb = d.feedback_json ? JSON.parse(d.feedback_json) : {};
        for (const id of (fb.approvedIds  ?? [])) seen.add(String(id));
        for (const id of (fb.skippedIds   ?? [])) seen.add(String(id));
        // Fallback: if no granular IDs, mark everything as seen
        if (!fb.approvedIds && !fb.skippedIds) {
          for (const c of artRef.comments) seen.add(String(c.id));
        }
      }
    } catch { /* non-JSON artifact_ref (old-style) — skip */ }
  }
  return seen;
}

function isActionableReviewComment(review) {
  // CHANGES_REQUESTED is actionable. APPROVED, COMMENTED are not blocking.
  return review?.state === "CHANGES_REQUESTED";
}

/**
 * Returns a Set of PR numbers currently in the merge queue for the repo.
 * Uses GraphQL so we can batch all PRs in one request.
 */
function getMergeQueueEntries(prNumbers, cwd) {
  if (!prNumbers.length) return new Set();
  const repo = db.prepare("SELECT value FROM settings WHERE key = 'github_repo'").get()?.value || "";
  if (!repo.trim()) return new Set();
  const [owner, repoName] = repo.split("/");
  const aliases = prNumbers.map(n => `pr${n}: pullRequest(number: ${n}) { mergeQueueEntry { state } }`).join(" ");
  const query = `query { repository(owner: "${owner}", name: "${repoName}") { ${aliases} } }`;
  try {
    const result = ghJson(["api", "graphql", "-f", `query=${query}`], cwd);
    const repoData = result?.data?.repository ?? {};
    const inQueue = new Set();
    for (const n of prNumbers) {
      if (repoData[`pr${n}`]?.mergeQueueEntry != null) inQueue.add(n);
    }
    return inQueue;
  } catch (e) {
    log(`WARN: merge queue check failed: ${e.message}`);
    return new Set();
  }
}

// ── Main ─────────────────────────────────────────────────────────────

function main() {
  log(`Watching PRs for issue #${issueId}`);

  const issue   = db.prepare("SELECT wt_path, state, pr_approved_at, auto_fix_enabled FROM issues WHERE id = ?").get(issueId);
  const wtPath     = issue?.wt_path;
  const currentState = issue?.state;

  // Determine the cwd to use for gh commands.
  // gh api / gh api graphql do NOT require a git repo directory. gh pr view is
  // always invoked with --repo for the same reason. So when the worktree is
  // missing or git metadata is broken, we fall back to FORGE_DIR and keep
  // running rather than bailing.
  let effectiveCwd = wtPath;

  if (!wtPath) {
    // wt_path is NULL — this is a genuine setup failure with no fallback.
    log(`ERROR: wt_path is NULL for issue #${issueId}. Transitioning to FAILED.`);
    db.prepare(`
      UPDATE issues
      SET state = 'FAILED', previous_state = state, locked_at = NULL, agent_pid = NULL, updated_at = datetime('now')
      WHERE id = ?
    `).run(issueId);
    db.prepare(`INSERT INTO activity_log (issue_id, type, actor, message) VALUES (?, 'agent_failed', 'watcher', 'wt_path is NULL — cannot watch PRs. Issue moved to FAILED.')`).run(issueId);
    finishRun(1);
    db.close();
    process.exit(1);
  }

  if (!fs.existsSync(wtPath)) {
    // wt_path is set but the directory no longer exists on disk.
    // gh commands work fine from any valid cwd, so fall back to FORGE_DIR.
    // Log a warning to activity_log once per session (deduplicated by checking
    // for a recent unresolved warning within the last hour).
    log(`WARN: Worktree path does not exist on disk: ${wtPath}. Falling back to FORGE_DIR for gh commands.`);
    effectiveCwd = FORGE_DIR;

    const recentWarn = db.prepare(`
      SELECT id FROM activity_log
      WHERE issue_id = ? AND type = 'wt_missing_warning'
        AND created_at > datetime('now', '-1 hour')
      LIMIT 1
    `).get(issueId);

    if (!recentWarn) {
      db.prepare(`
        INSERT INTO activity_log (issue_id, type, actor, message)
        VALUES (?, 'wt_missing_warning', 'watcher', ?)
      `).run(issueId, `Worktree path missing on disk: ${wtPath}. PR checks continuing via GitHub API. Correct wt_path in the DB to restore full functionality.`);
    }
  }

  const prStack = db.prepare(`
    SELECT * FROM pr_stack WHERE issue_id = ? ORDER BY position ASC
  `).all(issueId);

  if (prStack.length === 0) {
    log("No PRs in stack yet. Unlocking and waiting.");
    unlock();
    finishRun(0);
    db.close();
    return;
  }

  let allMerged = true;
  let anyApproved = false;
  let fetchedPrStatuses = 0;
  let newActionableComments = [];  // comments not yet seen by the user

  const seenIds = getSeenCommentIds();

  for (const pr of prStack) {
    if (!pr.pr_number) {
      log(`PR at position ${pr.position} (${pr.gt_branch}) has no PR number yet.`);
      allMerged = false;
      continue;
    }

    const status = getPrStatus(pr.pr_number, effectiveCwd);
    if (!status) {
      log(`WARN: Could not fetch status for PR #${pr.pr_number} — skipping this PR this cycle`);
      allMerged = false;
      continue;
    }

    fetchedPrStatuses += 1;

    if (status.reviewDecision === "APPROVED") {
      anyApproved = true;
    }

    // Update DB with latest status
    const newStatus = status.mergedAt ? "merged"
      : status.state === "CLOSED" ? "closed"
      : "open";

    db.prepare(`UPDATE pr_stack SET status = ? WHERE id = ?`).run(newStatus, pr.id);

    if (newStatus !== "merged") {
      allMerged = false;
    }

    const reviewComments = (status.reviews ?? [])
      .filter(isActionableReviewComment)
      .filter(r => r.body?.trim())
      .map(r => ({
        id:          String(r.id ?? `review-${pr.pr_number}-${r.submittedAt}`),
        author:      r.author?.login ?? "unknown",
        path:        "",
        line:        null,
        body:        r.body,
        reviewState: "CHANGES_REQUESTED",
        createdAt:   r.submittedAt ?? null,
        prNumber:    pr.pr_number,
      }));

    const inlineComments = getInlineComments(pr.pr_number, effectiveCwd)
      .map(c => ({ ...c, prNumber: pr.pr_number }));

    // Collect CI check failures from statusCheckRollup
    const ciFailureComments = [];
    const checks = status.statusCheckRollup ?? [];
    const failedChecks = checks.filter(c => c.conclusion === "FAILURE" || c.conclusion === "TIMED_OUT");
    if (failedChecks.length > 0) {
      const checkSummary = failedChecks.map(c => `- ${c.name}: ${c.conclusion}`).join("\n");
      const ciId = `ci-failures-${pr.pr_number}-${failedChecks.map(c => c.name).join(",").replace(/\s+/g, "_")}`;
      ciFailureComments.push({
        id:          ciId,
        author:      "ci",
        path:        "",
        line:        null,
        body:        `CI checks failed on PR #${pr.pr_number}:\n${checkSummary}`,
        reviewState: "CI_FAILURE",
        prNumber:    pr.pr_number,
      });
    }

    // Detect merge conflicts
    const conflictComments = [];
    if (status.mergeable === "CONFLICTING") {
      const conflictId = `merge-conflict-${pr.pr_number}`;
      conflictComments.push({
        id:          conflictId,
        author:      "github",
        path:        "",
        line:        null,
        body:        `PR #${pr.pr_number} has merge conflicts with its base branch and cannot be merged until they are resolved. Rebase or merge the base branch into this branch to fix.`,
        reviewState: "MERGE_CONFLICT",
        prNumber:    pr.pr_number,
        createdAt:   new Date().toISOString(),
      });
    }

    const allPrComments = [...reviewComments, ...inlineComments, ...ciFailureComments, ...conflictComments];
    const newForThisPr = allPrComments.filter(c => !seenIds.has(String(c.id)));

    if (newForThisPr.length > 0) {
      log(`PR #${pr.pr_number}: ${newForThisPr.length} new actionable comment(s)`);
      newActionableComments.push(...newForThisPr);
    }
  }

  // ── Approval detection ─────────────────────────────────────────────
  if (anyApproved && !issue.pr_approved_at) {
    db.prepare("UPDATE issues SET pr_approved_at = datetime('now'), updated_at = datetime('now') WHERE id = ?").run(issueId);
    db.prepare(`INSERT INTO activity_log (issue_id, type, actor, message) VALUES (?, 'pr_approved', 'watcher', 'GitHub PR review decision is approved')`).run(issueId);
    log("PR review decision approved — notification flag set");
  } else if (fetchedPrStatuses > 0 && !anyApproved && issue.pr_approved_at) {
    db.prepare("UPDATE issues SET pr_approved_at = NULL, updated_at = datetime('now') WHERE id = ?").run(issueId);
    db.prepare(`INSERT INTO activity_log (issue_id, type, actor, message) VALUES (?, 'pr_approval_cleared', 'watcher', 'GitHub PR approval is no longer current')`).run(issueId);
    log("PR review decision no longer approved — notification flag cleared");
  } else if (fetchedPrStatuses === 0 && issue.pr_approved_at) {
    log("WARN: Could not fetch any PR statuses — preserving existing approval flag");
  }

  // ── Merge queue detection ──────────────────────────────────────────
  const openPrNumbers = prStack
    .filter(p => p.pr_number && p.status !== "merged" && p.status !== "closed")
    .map(p => p.pr_number);
  const mergeQueueSet  = (!allMerged && openPrNumbers.length > 0)
    ? getMergeQueueEntries(openPrNumbers, effectiveCwd)
    : new Set();
  const anyInMergeQueue = mergeQueueSet.size > 0;

  if (anyInMergeQueue) {
    log(`PR(s) in merge queue: ${[...mergeQueueSet].join(", ")}`);
  }

  // If PRs were in the merge queue but got kicked out, revert to WATCHING_PR
  if (currentState === "IN_MERGE_QUEUE" && !anyInMergeQueue && !allMerged) {
    log("PR(s) removed from merge queue — reverting to WATCHING_PR");
    db.prepare(`UPDATE issues SET previous_state = state, state = 'WATCHING_PR', updated_at = datetime('now') WHERE id = ?`).run(issueId);
    db.prepare(`INSERT INTO activity_log (issue_id, type, actor, message) VALUES (?, 'state_changed', 'watcher', 'Removed from merge queue — watching PR again')`).run(issueId);
  }

  if (allMerged) {
    log("All PRs merged. Transitioning to DONE.");
    transition("DONE");

    // Clear any pending decisions — no longer relevant now that the issue is done
    const cleared = db.prepare(`
      UPDATE decision_queue SET verdict = 'rejected', feedback_json = '"Cleared — issue moved to DONE"', resolved_at = datetime('now')
      WHERE issue_id = ? AND verdict IS NULL
    `).run(issueId).changes;
    if (cleared > 0) log(`Cleared ${cleared} pending decision(s) — issue is DONE`);

    // Log completion
    db.prepare(`INSERT INTO activity_log (issue_id, type, actor, message) VALUES (?, 'completed', 'watcher', 'All PRs merged — issue complete')`).run(issueId);

    // Run completion scripts (summary + self-improvement)
    const { execFileSync: execSync } = require("child_process");
    const summaryScript   = path.join(FORGE_DIR, "generate-summary.js");
    const improveScript   = path.join(FORGE_DIR, "self-improve.js");
    const reflectScript   = path.join(FORGE_DIR, "reflect.js");

    if (fs.existsSync(summaryScript)) {
      try {
        execSync(process.execPath, [summaryScript, "--issue-id", String(issueId)], { timeout: 30000 });
        log("Executive summary generated");
      } catch (e) { log(`WARN: summary failed: ${e.message}`); }
    }

    if (fs.existsSync(improveScript)) {
      try {
        execSync(process.execPath, [improveScript, "--issue-id", String(issueId)], { timeout: 60000 });
        log("Self-improvement complete");
      } catch (e) { log(`WARN: self-improve failed: ${e.message}`); }
    }

    if (fs.existsSync(reflectScript)) {
      try {
        execSync(process.execPath, [reflectScript, "--issue-id", String(issueId), "--trigger", "completion"], { timeout: 120000 });
        log("Reflection complete");
      } catch (e) { log(`WARN: reflection failed: ${e.message}`); }
    }

    // Clean up assets
    const assetDir = path.join(FORGE_DIR, "projects", String(issueId), "assets");
    if (fs.existsSync(assetDir)) {
      try { fs.rmSync(assetDir, { recursive: true, force: true }); } catch {}
    }

    unlock();
    finishRun(0);
    db.close();
    return;
  }

  if (newActionableComments.length > 0) {
    const artifactRef = JSON.stringify({ comments: newActionableComments });
    if (Number(issue.auto_fix_enabled) === 1) {
      log(`${newActionableComments.length} new actionable comment(s) — auto-fix enabled`);
      autoFixComments(newActionableComments, artifactRef);
    } else {
      log(`${newActionableComments.length} new actionable comment(s) — queuing FIX_APPROVAL decision`);
      createDecision("FIX_APPROVAL", artifactRef);
      transition("AWAITING_FIX_APPROVAL");
    }
    unlock();
    finishRun(0);
    db.close();
    return;
  }

  // Transition to IN_MERGE_QUEUE if PRs just entered the queue
  if (anyInMergeQueue && currentState !== "IN_MERGE_QUEUE") {
    log("PR(s) entered merge queue — transitioning to IN_MERGE_QUEUE");
    transition("IN_MERGE_QUEUE");
    db.prepare(`INSERT INTO activity_log (issue_id, type, actor, message) VALUES (?, 'state_changed', 'watcher', ?)`) 
      .run(issueId, `PR(s) added to merge queue: #${[...mergeQueueSet].join(", #")}`);
    unlock();
    finishRun(0);
    db.close();
    return;
  }

  log("No changes needed. Stack still open — will check again next scheduler tick.");
  unlock();
  finishRun(0);
  db.close();
}

main();
