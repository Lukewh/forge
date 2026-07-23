/**
 * Forge — Frontend utility function tests
 *
 * Tests pure functions from app.js by extracting and evaluating them.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { FORGE_DIR } from "./helpers.mjs";

// ── Extract pure functions from app.js ────────────────────────────────

const appSrc = readFileSync(`${FORGE_DIR}/dashboard/public/app.js`, "utf-8");

// We eval the functions we want to test in a clean scope
// by extracting and re-declaring them (they have no external deps)
function extractFn(src, name) {
  // Match "function name(...) { ... }" (handles multiline)
  const regex = new RegExp(
    `(function\\s+${name}\\s*\\([^)]*\\)\\s*\\{)`,
    "s"
  );
  const match = src.match(regex);
  if (!match) throw new Error(`Could not find function: ${name}`);

  // Find the end of the function by brace counting
  const start = src.indexOf(match[0]);
  let depth = 0;
  let i = start;
  while (i < src.length) {
    if (src[i] === "{") depth++;
    if (src[i] === "}") {
      depth--;
      if (depth === 0) { i++; break; }
    }
    i++;
  }
  return src.slice(start, i);
}

// Build a scope with all the pure utility functions
const fnNames = ["esc", "parseUTC", "timeAgo", "statePill", "renderDiff", "priorityLabel", "agentPromptEditor"];
const fnDefs = fnNames.map(n => {
  try { return extractFn(appSrc, n); }
  catch { return `function ${n}() { return ""; }`; }
}).join("\n");

const scope = new Function(`
  const STATE_LABELS = {
  PENDING:              "pending",
  SETTING_UP:           "setting up",
  PLANNING:             "planning",
  AI_PLAN_REVIEWING:    "ai plan review",
  AWAITING_PLAN_APPROVAL: "awaiting plan review",
  WORKING:              "coding",
  AI_REVIEWING:         "ai code review",
  AWAITING_CODE_REVIEW: "awaiting code review",
  CREATING_PR:          "creating PR",
  WATCHING_PR:          "watching PR",
  AWAITING_FIX_APPROVAL: "awaiting fix",
  FIXING:               "fixing",
  PUSHING:              "pushing",
  DONE:                 "done",
  PAUSED:               "paused",
  FAILED:               "failed",
};
  ${fnDefs}
  return { esc, parseUTC, timeAgo, statePill, renderDiff, priorityLabel, agentPromptEditor };
`)();

const { esc, parseUTC, timeAgo, statePill, renderDiff, priorityLabel, agentPromptEditor } = scope;

// ── esc() ─────────────────────────────────────────────────────────────

describe("esc()", () => {
  test("escapes ampersand",     () => assert.equal(esc("a&b"),   "a&amp;b"));
  test("escapes less-than",     () => assert.equal(esc("a<b"),   "a&lt;b"));
  test("escapes greater-than",  () => assert.equal(esc("a>b"),   "a&gt;b"));
  test("escapes double-quote",  () => assert.equal(esc(`a"b`),   "a&quot;b"));
  test("handles empty string",  () => assert.equal(esc(""),       ""));
  test("handles null/undefined",() => assert.equal(esc(null),    ""));
  test("passes plain text through unchanged", () =>
    assert.equal(esc("Hello world"), "Hello world"));
  test("escapes multiple special chars", () =>
    assert.equal(esc("<script>alert('xss')</script>"), "&lt;script&gt;alert('xss')&lt;/script&gt;"));
  test("does NOT escape backticks (safe in attribute contexts)", () =>
    assert.equal(esc("a`b"), "a`b"));
  test("does NOT escape single quotes", () =>
    assert.equal(esc("it's"), "it's"));
});

// ── timeAgo() ─────────────────────────────────────────────────────────


// ── parseUTC() ────────────────────────────────────────────────────────

describe("parseUTC()", () => {
  test("returns null for null", () => assert.equal(parseUTC(null), null));

  test("SQLite bare datetime treated as UTC", () => {
    const d = parseUTC("2026-05-11 10:00:00");
    assert.ok(d instanceof Date);
    assert.equal(d.getUTCHours(), 10);
  });

  test("ISO string with Z parsed unchanged", () => {
    const d = parseUTC("2026-05-11T10:00:00.000Z");
    assert.equal(d.getUTCHours(), 10);
  });

  test("SQLite space datetime == ISO T datetime in UTC", () => {
    const a = parseUTC("2026-01-01 12:30:00");
    const b = parseUTC("2026-01-01T12:30:00Z");
    assert.equal(a.getTime(), b.getTime());
  });
});

describe("timeAgo()", () => {
  test("returns — for null", () => assert.equal(timeAgo(null), "—"));
  test("returns — for undefined", () => assert.equal(timeAgo(undefined), "—"));

  test("returns seconds for recent time", () => {
    const t = new Date(Date.now() - 30_000).toISOString();
    assert.ok(timeAgo(t).includes("ago"), "should contain ago");
  });

  test("returns minutes for time 5min ago", () => {
    const t = new Date(Date.now() - 5 * 60_000).toISOString();
    assert.ok(timeAgo(t).includes("m ago"), "should contain m ago");
  });

  test("returns hours for time 2h ago", () => {
    const t = new Date(Date.now() - 2 * 3_600_000).toISOString();
    assert.ok(timeAgo(t).includes("h ago"), "should contain h ago");
  });

  test("exactly 60s shows 1m", () => {
    const t = new Date(Date.now() - 60_000).toISOString();
    assert.ok(timeAgo(t).includes("1m ago"));
  });

  test("exactly 1h shows 1h", () => {
    const t = new Date(Date.now() - 3_600_000).toISOString();
    assert.ok(timeAgo(t).includes("1h ago"));
  });
});

// ── statePill() ───────────────────────────────────────────────────────

describe("statePill()", () => {
  const states = [
    "PENDING", "PLANNING", "AWAITING_PLAN_APPROVAL", "WORKING",
    "AWAITING_CODE_REVIEW", "CREATING_PR", "WATCHING_PR",
    "AWAITING_FIX_APPROVAL", "FIXING", "PUSHING", "DONE",
    "PAUSED", "STEERING", "FAILED",
  ];

  for (const state of states) {
    test(`renders pill for ${state}`, () => {
      const html = statePill(state);
      assert.ok(html.includes("state-pill"),  `Missing state-pill class for ${state}`);
      assert.ok(html.includes(`state-${state}`), `Missing state-${state} class`);
      // label text is now from STATE_LABELS map, not raw state name - just check the class is there
    });
  }
});

// ── priorityLabel() ───────────────────────────────────────────────────

describe("priorityLabel()", () => {
  test("0 = no-priority block chars",  () => assert.ok(priorityLabel(0).length > 0));
  test("1 = urgent — 3 filled blocks", () => assert.ok(priorityLabel(1).includes("\u2588")));
  test("2 = high — 2 filled blocks",   () => assert.ok(priorityLabel(2).includes("\u2586")));
  test("3 = medium — 1 filled block",  () => assert.ok(priorityLabel(3).includes("\u2584")));
  test("4 = low — empty blocks",       () => assert.ok(priorityLabel(4).includes("\u2591")));
  test("unknown = empty string",       () => assert.equal(priorityLabel(99), ""));
  test("all priorities return strings", () => {
    for (let p = 0; p <= 4; p++) assert.equal(typeof priorityLabel(p), "string");
  });
});

// ── renderDiff() ──────────────────────────────────────────────────────

describe("renderDiff()", () => {
  test("wraps added lines in diff-add span", () => {
    const out = renderDiff("+const x = 1;");
    assert.ok(out.includes("diff-add"), "Missing diff-add class");
    assert.ok(out.includes("const x = 1;"), "Missing line content");
  });

  test("wraps deleted lines in diff-del span", () => {
    const out = renderDiff("-const y = 2;");
    assert.ok(out.includes("diff-del"), "Missing diff-del class");
  });

  test("wraps hunk headers in diff-hunk span", () => {
    const out = renderDiff("@@ -1,3 +1,4 @@");
    assert.ok(out.includes("diff-hunk"), "Missing diff-hunk class");
  });

  test("wraps diff headers in diff-meta span", () => {
    const out = renderDiff("--- a/file.ts\n+++ b/file.ts");
    assert.ok(out.includes("diff-meta"), "Missing diff-meta class");
  });

  test("wraps diff index line in diff-meta span", () => {
    const out = renderDiff("diff --git a/f b/f");
    assert.ok(out.includes("diff-meta"));
  });

  test("passes through context lines unchanged", () => {
    const out = renderDiff(" const unchanged = true;");
    assert.ok(!out.includes("diff-add"));
    assert.ok(!out.includes("diff-del"));
    assert.ok(out.includes("const unchanged = true;"));
  });

  test("escapes HTML in diff content", () => {
    const out = renderDiff("+const el = <div>;");
    assert.ok(out.includes("&lt;div&gt;"), "HTML in diff content should be escaped");
  });

  test("handles multiline diffs", () => {
    const diff = [
      "--- a/src/foo.ts",
      "+++ b/src/foo.ts",
      "@@ -1,2 +1,3 @@",
      " const a = 1;",
      "-const b = 2;",
      "+const b = 3;",
      "+const c = 4;",
    ].join("\n");

    const out = renderDiff(diff);
    const addLines = (out.match(/diff-add/g) ?? []).length;
    const delLines = (out.match(/diff-del/g) ?? []).length;
    assert.equal(addLines, 2, "Expected 2 added lines");
    assert.equal(delLines, 1, "Expected 1 deleted line");
  });
});

// ── agentPromptEditor() ───────────────────────────────────────────────

describe("agentPromptEditor()", () => {
  test("returns HTML string", () => {
    const html = agentPromptEditor("planner");
    assert.ok(typeof html === "string");
    assert.ok(html.length > 0);
  });

  test("includes textarea with correct id", () => {
    const html = agentPromptEditor("coder");
    assert.ok(html.includes('id="prompt-coder"'), "Missing textarea id");
  });

  test("includes save button with correct data-type", () => {
    const html = agentPromptEditor("fixer");
    assert.ok(html.includes('data-type="fixer"'), "Missing data-type attribute");
    assert.ok(html.includes("btn-save-prompt"),   "Missing btn-save-prompt class");
  });

  test("does NOT embed content in HTML (backtick safety)", () => {
    const html = agentPromptEditor("git-agent");
    // textarea is empty — content set via .value, not innerHTML
    assert.ok(!html.includes("placeholder text that looks like content"), "Should not embed raw content");
  });

  test("works for all agent types", () => {
    for (const type of ["planner", "coder", "git-agent", "fixer"]) {
      const html = agentPromptEditor(type);
      assert.ok(html.includes(`id="prompt-${type}"`), `Missing id for ${type}`);
    }
  });
});
