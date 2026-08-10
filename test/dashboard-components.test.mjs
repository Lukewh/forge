import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readAllDashboardSource } from "./helpers.mjs";

const source = readAllDashboardSource();

describe("dashboard v3 component architecture", () => {
  it("exports types from a dedicated types module", () => {
    assert.match(source, /export type Issue\b/);
    assert.match(source, /export type Decision\b/);
    assert.match(source, /export type Overview\b/);
    assert.match(source, /export type Settings\b/);
    assert.match(source, /export type PrStackItem\b/);
    assert.match(source, /export type IssueDetail\b/);
    assert.match(source, /export type DecisionVerdict\b/);
    assert.match(source, /export type IssueAction\b/);
  });

  it("exports constants from a dedicated constants module", () => {
    assert.match(source, /export const NAV_ITEMS/);
    assert.match(source, /export const PIPELINE_STAGES/);
    assert.match(source, /export const SETTING_GROUPS/);
    assert.match(source, /export const JUMP_STATE_OPTIONS/);
    assert.match(source, /export const AGENT_STUCK_THRESHOLDS/);
    assert.match(source, /export const PHASES/);
  });

  it("exports API functions from a dedicated api module", () => {
    assert.match(source, /export async function getJson/);
    assert.match(source, /export async function postJson/);
    assert.match(source, /export async function deleteJson/);
    assert.match(source, /export function resolveDecisionAction/);
    assert.match(source, /export function runIssueAction/);
    assert.match(source, /export function removeIssue/);
    assert.match(source, /export function normalizeOverview/);
  });

  it("exports helper functions from a dedicated helpers module", () => {
    assert.match(source, /export function parseTimestamp/);
    assert.match(source, /export function timeAgoShort/);
    assert.match(source, /export function issueStateLabel/);
    assert.match(source, /export function isRunningIssue/);
    assert.match(source, /export function renderMarkdown/);
    assert.match(source, /export function parseUnifiedDiff/);
    assert.match(source, /export function parseDashboardRoute/);
    assert.match(source, /export function shellStatusFromData/);
    assert.match(source, /export function debounce/);
    assert.match(source, /export function copyToClipboard/);
  });

  it("exports per-agent stuck thresholds", () => {
    assert.match(source, /AGENT_STUCK_THRESHOLDS/);
    assert.match(source, /planner:\s*8/);
    assert.match(source, /coder:\s*20/);
    assert.match(source, /reviewer:\s*10/);
    assert.match(source, /git-agent.*:\s*5/);
  });

  it("exports mock helpers from a dedicated mock module", () => {
    assert.match(source, /export function mockStatesEnabled/);
    assert.match(source, /export function mockOverview/);
    assert.match(source, /export function mockIssueDetail/);
    assert.match(source, /export function mockIssues/);
  });

  it("provides dialog functions with focus trapping", () => {
    assert.match(source, /export function showForgePrompt/);
    assert.match(source, /export function showForgeConfirm/);
    assert.match(source, /export function showForgeError/);
    assert.match(source, /trapFocus/);
  });

  it("provides an ErrorBoundary component", () => {
    assert.match(source, /class ErrorBoundary extends Component/);
    assert.match(source, /getDerivedStateFromError/);
    assert.match(source, /componentDidCatch/);
    assert.match(source, /forge-v3-error-boundary/);
  });

  it("persists queue filter and sort preferences", () => {
    assert.match(source, /forge\.v3\.queuePrefs/);
    assert.match(source, /localStorage/);
  });

  it("supports keyboard shortcuts in review view", () => {
    assert.match(source, /event\.key === "j"/);
    assert.match(source, /event\.key === "k"/);
    assert.match(source, /event\.key === "r"/);
    assert.match(source, /event\.key === "a"/);
  });

  it("adds copy affordances for branch and worktree path", () => {
    assert.match(source, /forge-v3-copy-btn/);
    assert.match(source, /Copy branch name/);
    assert.match(source, /Copy worktree path/);
    assert.match(source, /Copy cd command/);
  });

  it("debounces SSE tick events", () => {
    assert.match(source, /debouncedRefresh/);
    assert.match(source, /event\.type === "tick"/);
  });

  it("shows completion celebration when issue reaches DONE", () => {
    assert.match(source, /celebrationIssue/);
    assert.match(source, /forge-v3-celebration/);
    assert.match(source, /completed!/);
  });

  it("provides advance state consequence explanations", () => {
    assert.match(source, /agentHint/);
    assert.match(source, /skipHint/);
    assert.match(source, /skips the pending human approval/);
  });

  it("calculates average time to merge in archive", () => {
    assert.match(source, /avgMergeTime/);
    assert.match(source, /Average time to merge/);
  });

  it("deep-links notification clicks to issue review", () => {
    assert.match(source, /notification\.onclick/);
    assert.match(source, /window\.focus/);
  });
});
