/**
 * Forge — pi Extension Entry Point
 *
 * Registers /forge slash commands and manages the scheduler lifecycle.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import * as path from "node:path";
import * as os from "node:os";
import * as fs from "node:fs";
import { execFileSync } from "node:child_process";
import { ForgeDB, DB_PATH } from "./db.js";
import { ForgeScheduler } from "./scheduler.js";

const FORGE_DIR = process.env.FORGE_DIR || path.join(os.homedir(), ".pi", "agent", "extensions", "forge");
const DASHBOARD_PATH = path.join(FORGE_DIR, "dashboard", "server.js");
const FIRST_RUN_SETUP_PATH = path.join(FORGE_DIR, "scripts", "first-run-setup");

export default function forge(pi: ExtensionAPI) {
  const isFirstRun = !fs.existsSync(DB_PATH);
  const db = new ForgeDB();
  if (isFirstRun) db.setSetting("setup_completed", "false");
  const scheduler = new ForgeScheduler(db, (msg) => pi.log?.(msg) ?? console.log(msg));

  // ── /forge ────────────────────────────────────────────────────────

  pi.registerCommand("forge", {
    description: "Forge — AI issue lifecycle manager",
    handler: async (args, ctx) => {
      const [sub, ...rest] = (args ?? "").trim().split(/\s+/);

      switch (sub) {

        // ── setup ───────────────────────────────────────────────────
        case "setup": {
          if (rest[0] === "done") {
            db.setSetting("setup_completed", "true");
            ctx.ui.notify("Forge setup marked complete.", "success");
            break;
          }
          ctx.ui.notify([
            "## Forge First-Time Setup",
            "",
            "Run the setup wizard in a terminal:",
            "",
            `\`${FIRST_RUN_SETUP_PATH}\``,
            "",
            "The wizard will:",
            "- choose raw git worktrees or Worktrunk (`wt`)",
            "- configure local-first runtime execution",
            "- save repo/worktree/Linear/GitHub settings",
            "- run environment checks",
            "",
            "Use `/forge setup done` after manually editing settings if needed.",
          ].join("\n"), "info");
          break;
        }

        // ── start ───────────────────────────────────────────────────
        case "start": {
          if (db.getSetting("setup_completed") === "false") {
            ctx.ui.notify("Forge setup is not complete. Run `/forge setup` first.", "warning");
            break;
          }
          scheduler.start();
          ctx.ui.notify("Forge scheduler started", "success");
          break;
        }

        // ── stop ────────────────────────────────────────────────────
        case "stop": {
          scheduler.stop();
          ctx.ui.notify("Forge scheduler stopped", "info");
          break;
        }

        // ── status ──────────────────────────────────────────────────
        case "status":
        case undefined:
        case "": {
          const overview = db.getOverview();
          const schedulerState = overview.schedulerState;
          const lines: string[] = [
            "## Forge Status",
            "",
            `**Scheduler:** ${schedulerState.running ? `🟢 running (PID ${schedulerState.pid})` : "🔴 stopped"}`,
            `**Active issues:** ${overview.active.length}`,
            `**Awaiting decisions:** ${overview.awaitingDecisions.length}`,
            `**Running agents:** ${overview.runningAgents.length}`,
            "",
          ];

          if (overview.awaitingDecisions.length > 0) {
            lines.push("### 🔔 Decision Queue");
            for (const d of overview.awaitingDecisions) {
              const issue = db.getIssue(d.issue_id);
              lines.push(`- [${d.type}] Issue #${d.issue_id} "${issue?.title ?? "?"}" — ${d.artifact_ref}`);
            }
            lines.push("");
          }

          if (overview.active.length > 0) {
            lines.push("### Active Issues");
            for (const issue of overview.active) {
              const lock = issue.locked_at ? ` 🔄 agent running` : "";
              lines.push(`- #${issue.id} **${issue.title}** — \`${issue.state}\`${lock}`);
            }
            lines.push("");
          }

          ctx.ui.notify(lines.join("\n"), "info");
          break;
        }

        // ── queue ───────────────────────────────────────────────────
        case "queue": {
          const pending = db.getAllPendingDecisions();
          if (pending.length === 0) {
            ctx.ui.notify("No pending decisions.", "info");
            break;
          }
          const lines = ["## 🔔 Decision Queue", ""];
          for (const d of pending) {
            const issue = db.getIssue(d.issue_id);
            lines.push(`**#${d.id}** [${d.type}] Issue #${d.issue_id} "${issue?.title ?? "?"}"`)
            lines.push(`  Artifact: ${d.artifact_ref}`);
            lines.push(`  Created: ${d.created_at}`);
            lines.push("");
          }
          ctx.ui.notify(lines.join("\n"), "info");
          break;
        }

        // ── add ─────────────────────────────────────────────────────
        case "add": {
          if (db.getSetting("setup_completed") === "false") {
            ctx.ui.notify("Forge setup is not complete. Run `/forge setup` first.", "warning");
            break;
          }
          // /forge add BAND-1234  OR  /forge add "Manual issue title"
          const input = rest.join(" ").trim();
          if (!input) {
            ctx.ui.notify("Usage: /forge add <LINEAR-ID> | /forge add \"manual issue title\"", "warning");
            break;
          }

          const isLinearId = /^[A-Z]+-\d+$/.test(input);

          if (isLinearId) {
            const existing = db.getIssueByLinearId(input);
            if (existing) {
              ctx.ui.notify(`Issue ${input} is already in Forge (state: ${existing.state})`, "warning");
              break;
            }

            // Fetch title from Linear only when CLI integration is enabled.
            let title = input;
            let priority = 0;
            if (db.getSetting("linear_enabled") === "true") {
              try {
                const raw = execFileSync("linear", ["issue", "view", input, "--json"], { encoding: "utf-8", timeout: 10000 });
                const data = JSON.parse(raw);
                title = data.title ?? input;
                priority = data.priority ?? 0;
              } catch {
                ctx.ui.notify(`Could not fetch ${input} from Linear — adding with ID as title`, "warning");
              }
            }

            const issue = db.createIssue({ source: "linear", linearId: input, title, priority });
            if (db.getSetting("linear_enabled") !== "true") {
              try {
                const Database = (await import("better-sqlite3")).default;
                const rawDb = new Database(path.join(FORGE_DIR, "forge.db"));
                rawDb.prepare("INSERT INTO desktop_jobs (type, payload_json) VALUES (?, ?)")
                  .run("linear.fetchIssue", JSON.stringify({ issueId: issue.id, linearId: input }));
                rawDb.close();
              } catch {}
            }
            ctx.ui.notify(`Added ${input}: "${title}" (issue #${issue.id})`, "success");
          } else {
            // Manual issue
            const issue = db.createIssue({ source: "manual", title: input });
            ctx.ui.notify(`Added manual issue #${issue.id}: "${input}"`, "success");
          }
          break;
        }

        // ── pause ───────────────────────────────────────────────────
        case "pause": {
          const id = parseInt(rest[0], 10);
          if (!id) { ctx.ui.notify("Usage: /forge pause <issue-id>", "warning"); break; }
          db.pauseIssue(id);
          ctx.ui.notify(`Issue #${id} paused`, "info");
          break;
        }

        // ── unpause ─────────────────────────────────────────────────
        case "unpause":
        case "resume": {
          const id = parseInt(rest[0], 10);
          if (!id) { ctx.ui.notify("Usage: /forge resume <issue-id>", "warning"); break; }
          db.unpauseIssue(id);
          ctx.ui.notify(`Issue #${id} resumed`, "success");
          break;
        }

        // ── ignore ──────────────────────────────────────────────────
        case "ignore": {
          const id = parseInt(rest[0], 10);
          if (!id) { ctx.ui.notify("Usage: /forge ignore <issue-id>", "warning"); break; }
          db.ignoreIssue(id);
          ctx.ui.notify(`Issue #${id} ignored — Forge will not work on it or sync its Linear state`, "info");
          break;
        }

        // ── unignore ─────────────────────────────────────────────────
        case "unignore": {
          const id = parseInt(rest[0], 10);
          if (!id) { ctx.ui.notify("Usage: /forge unignore <issue-id>", "warning"); break; }
          db.unignoreIssue(id);
          ctx.ui.notify(`Issue #${id} unignored — resumed from previous state`, "success");
          break;
        }

        // ── steer ───────────────────────────────────────────────────
        case "steer": {
          const id = parseInt(rest[0], 10);
          const instructions = rest.slice(1).join(" ").trim();
          if (!id || !instructions) {
            ctx.ui.notify("Usage: /forge steer <issue-id> <instructions>", "warning");
            break;
          }
          db.steerIssue(id, instructions);
          ctx.ui.notify(`Issue #${id}: steering instructions queued for next agent run`, "success");
          break;
        }

        // ── approve ─────────────────────────────────────────────────
        case "approve": {
          // /forge approve <decision-id>
          const id = parseInt(rest[0], 10);
          if (!id) { ctx.ui.notify("Usage: /forge approve <decision-id>", "warning"); break; }

          const approveDecision = db.getDecision(id);
          if (!approveDecision) { ctx.ui.notify(`Decision #${id} not found`, "error"); break; }
          if (approveDecision.verdict) { ctx.ui.notify(`Decision #${id} already resolved: ${approveDecision.verdict}`, "warning"); break; }

          db.resolveDecision(id, "approved");

          const approveStateMap: Record<string, string> = {
            PLAN_REVIEW:  "WORKING",
            CODE_REVIEW:  "CREATING_PR",
            FIX_APPROVAL: "FIXING",
            SPLIT_APPROVAL: "SPLITTING",
          };
          const nextState = approveStateMap[approveDecision.type];
          if (nextState) db.transitionState(approveDecision.issue_id, nextState as any);

          ctx.ui.notify(`Decision #${id} approved — issue #${approveDecision.issue_id} → ${nextState}`, "success");
          break;
        }

        // ── reject ──────────────────────────────────────────────────
        case "reject": {
          const id = parseInt(rest[0], 10);
          const feedback = rest.slice(1).join(" ").trim();
          if (!id) { ctx.ui.notify("Usage: /forge reject <decision-id> [feedback]", "warning"); break; }

          const rejectDecision = db.getDecision(id);
          if (!rejectDecision) { ctx.ui.notify(`Decision #${id} not found`, "error"); break; }
          if (rejectDecision.verdict) { ctx.ui.notify(`Decision #${id} already resolved`, "warning"); break; }

          db.resolveDecision(id, "rejected", JSON.stringify(feedback || "Rejected by user"));

          const rejectStateMap: Record<string, string> = {
            PLAN_REVIEW:  "PLANNING",
            CODE_REVIEW:  "WORKING",
            FIX_APPROVAL: "WATCHING_PR",
            SPLIT_APPROVAL: "WATCHING_PR",
          };
          const prevState = rejectStateMap[rejectDecision.type];
          if (prevState) db.transitionState(rejectDecision.issue_id, prevState as any);

          ctx.ui.notify(`Decision #${id} rejected — issue #${rejectDecision.issue_id} → ${prevState}`, "info");
          break;
        }

        // ── reflect ────────────────────────────────────────────────
        case "reflect": {
          const id = parseInt(rest[0], 10);
          if (!id) { ctx.ui.notify("Usage: /forge reflect <issue-id>", "warning"); break; }
          try {
            const output = execFileSync(process.execPath, [path.join(FORGE_DIR, "reflect.js"), "--issue-id", String(id), "--trigger", "manual", "--force"], {
              encoding: "utf-8",
              timeout: 120000,
            });
            ctx.ui.notify(output.trim() || `Reflection complete for issue #${id}`, "success");
          } catch (e: any) {
            ctx.ui.notify(`Reflection failed: ${e.message}`, "error");
          }
          break;
        }

        // ── learnings ───────────────────────────────────────────────
        case "learnings": {
          const Database = (await import("better-sqlite3")).default;
          const rawDb = new Database(path.join(FORGE_DIR, "forge.db"), { readonly: true });
          const rows = rawDb.prepare(`
            SELECT ls.*, i.title AS issue_title, i.linear_id
            FROM learning_suggestions ls
            LEFT JOIN issues i ON i.id = ls.issue_id
            WHERE ls.status = 'pending'
            ORDER BY ls.created_at DESC
            LIMIT 20
          `).all() as any[];
          rawDb.close();
          if (!rows.length) { ctx.ui.notify("No pending learning suggestions.", "info"); break; }
          ctx.ui.notify([
            "## Pending Forge Learnings",
            "",
            ...rows.map(r => `- #${r.id} **${r.target}** (${r.confidence}) from ${r.linear_id ?? `issue #${r.issue_id}`}: ${r.suggestion}`),
          ].join("\n"), "info");
          break;
        }

        // ── dashboard ───────────────────────────────────────────────
        case "dashboard": {
          const { spawn } = await import("node:child_process");
          const port = db.getSetting("dashboard_port") ?? "3142";
          const proc = spawn(process.execPath, [DASHBOARD_PATH], {
            env: { ...process.env, PORT: port },
            detached: true,
            stdio: "ignore",
          });
          proc.unref();
          ctx.ui.notify(`Forge dashboard starting at http://localhost:${port}`, "success");
          break;
        }

        // ── list ─────────────────────────────────────────────────────
        case "list": {
          const issues = db.listIssues();
          if (issues.length === 0) {
            ctx.ui.notify("No issues in Forge. Use `/forge add <LINEAR-ID>` to add one.", "info");
            break;
          }
          const lines = ["## Forge Issues", ""];
          for (const issue of issues) {
            const src = issue.linear_id ? `[${issue.linear_id}]` : "[manual]";
            lines.push(`#${issue.id} ${src} **${issue.title}** — \`${issue.state}\``);
          }
          ctx.ui.notify(lines.join("\n"), "info");
          break;
        }

        // ── reset ───────────────────────────────────────────────────
        case "reset": {
          const confirmed = await ctx.ui.confirm(
            "⚠️ Reset Forge?",
            "This will wipe the entire Forge database. This cannot be undone."
          );
          if (!confirmed) break;

          scheduler.stop();
          db.close();

          const { unlinkSync } = await import("node:fs");
          try {
            unlinkSync(path.join(FORGE_DIR, "forge.db"));
            unlinkSync(path.join(FORGE_DIR, "forge.db-shm"));
            unlinkSync(path.join(FORGE_DIR, "forge.db-wal"));
          } catch {}

          ctx.ui.notify("Forge database reset. Reload pi to reinitialize.", "info");
          break;
        }

        default: {
          ctx.ui.notify([
            "## Forge Commands",
            "",
            "`/forge` or `/forge status`   — show active issues and scheduler state",
            "`/forge setup`               — show first-time setup instructions",
            "`/forge start`               — start the scheduler",
            "`/forge stop`                — stop the scheduler",
            "`/forge list`                — list all issues",
            "`/forge add <LINEAR-ID>`     — enqueue a Linear issue",
            "`/forge add \"title\"`         — add a manual issue",
            "`/forge queue`               — show pending decisions",
            "`/forge approve <id>`        — approve a decision",
            "`/forge reject <id> [msg]`   — reject a decision with optional feedback",
            "`/forge pause <issue-id>`    — pause an issue",
            "`/forge resume <issue-id>`   — resume a paused issue",
            "`/forge ignore <issue-id>`   — ignore an issue (no Linear sync, won't restart)",
            "`/forge unignore <issue-id>` — resume an ignored issue",
            "`/forge steer <id> <text>`   — inject steering instructions",
            "`/forge reflect <issue-id>`  — run learning reflection for an issue",
            "`/forge learnings`           — show pending learning suggestions",
            "`/forge dashboard`           — open web dashboard",
            "`/forge reset`               — wipe database (destructive)",
          ].join("\n"), "info");
        }
      }
    },
  });

  // Auto-show status on session start if scheduler was running
  pi.on("session_start", async (_event, ctx) => {
    if (db.getSetting("setup_completed") === "false") {
      ctx.ui.notify([
        "Forge first-time setup is pending.",
        "Run `/forge setup` for instructions, or run:",
        `\`${FIRST_RUN_SETUP_PATH}\``,
      ].join("\n"), "warning");
      return;
    }
    const state = db.getSchedulerState();
    const pending = db.getAllPendingDecisions();
    if (pending.length > 0) {
      ctx.ui.notify(
        `🔔 Forge: ${pending.length} decision(s) awaiting your review. Run \`/forge queue\` or open \`/forge dashboard\`.`,
        "warning"
      );
    }
    if (state.running) {
      ctx.ui.notify("Forge scheduler is running. Use `/forge status` to check.", "info");
    }
  });
}
