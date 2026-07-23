import { h, render } from "preact";
import { memo } from "preact/compat";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import "./style.css";

type NavKey = "queue" | "archive" | "settings" | "prompts" | "learnings";
type PipelineStageKey = "available" | "active" | "awaiting";
type QueueFilter = "all" | "needs-me" | "running" | "failed" | "watching-pr" | "paused";
type QueueSort = "priority" | "newest" | "oldest" | "recently-updated";

type NavItem = {
  label: "Queue" | "Archive" | "Settings" | "Agent Prompts" | "Learnings";
  key: NavKey;
  hint: string;
  icon: string;
};

type DesktopCapabilities = {
  notifications?: boolean;
};

type ShellStatus = {
  scheduler: string;
  activeCount: number;
  awaitingDecisionsCount: number;
  failedCount: number;
  doneThisWeekCount: number;
  learningSuggestionsCount: number;
  archiveCount: number;
  model: string;
  backend: string;
  runningAgentsCount: number;
  concurrencyLimit: number;
};

type PrStackItem = { pr_number?: number | null; branch?: string | null; gt_branch?: string | null; status?: string | null; reviewDecision?: string | null; mergeable?: string | null; isInMergeQueue?: boolean | null; mergeQueuePosition?: number | null; mergeQueueEnqueuedAt?: string | null; checksTotal?: number | null; checksFailed?: number | null; checksPending?: number | null; liveState?: string | null; url?: string | null };

type Issue = {
  id: number;
  linear_id?: string | null;
  title?: string | null;
  state?: string | null;
  priority?: number | null;
  updated_at?: string | null;
  created_at?: string | null;
  branch?: string | null;
  wt_path?: string | null;
  project_file_path?: string | null;
  prStack?: PrStackItem[];
  steering_context?: string | null;
  pr_approved_at?: string | null;
  auto_fix_enabled?: number | boolean | null;
  locked_at?: string | null;
  agent_pid?: number | null;
};

type LinearBacklogIssue = {
  identifier: string;
  title?: string | null;
  priority?: number | null;
  state?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
};

type ActivityLogEntry = {
  id?: number;
  type?: string | null;
  actor?: string | null;
  message?: string | null;
  metadata?: string | null;
  created_at?: string | null;
};

type AgentRun = {
  id?: number;
  agent_type?: string;
  started_at?: string;
  exited_at?: string | null;
  exit_code?: number | null;
  log_path?: string | null;
};

type FailureContext = {
  run?: AgentRun | null;
  logTail?: string | null;
};

type IssueDetail = {
  issue?: Issue;
  plan?: string | null;
  planContent?: string | null;
  handoffContent?: string | null;
  summaryContent?: string | null;
  vmConnectCommand?: string | null;
  decisions?: Decision[];
  agentRuns?: AgentRun[];
  activityLog?: ActivityLogEntry[];
  failureContext?: FailureContext | null;
  prStack?: PrStackItem[];
};

type ArchiveIssue = Issue & {
  run_count?: number | null;
  pr_count?: number | null;
  merged?: string | null;
  created_at?: string | null;
  hasSummary?: boolean;
  summaryContent?: string | null;
  prStack?: PrStackItem[];
};

type Decision = {
  id: number;
  issue_id: number;
  type?: string | null;
  issueTitle?: string | null;
  artifact_ref?: string | null;
  verdict?: DecisionVerdict | string | null;
  resolved_at?: string | null;
};

type FixApprovalComment = {
  id?: string | number | null;
  author?: string | null;
  body?: string | null;
  path?: string | null;
  line?: number | string | null;
  pr_number?: number | string | null;
  prNumber?: number | string | null;
  reviewState?: string | null;
  state?: string | null;
  source?: string | null;
};

type DecisionArtifact = {
  comments?: FixApprovalComment[];
  summary?: string;
  plan?: string;
  proposedStack?: Array<{ branch?: string; title?: string; summary?: string }>;
  stack?: Array<{ branch?: string; title?: string; summary?: string }>;
};

type Overview = {
  issues: Issue[];
  decisions: Decision[];
  runningAgents: unknown[];
  scheduler?: { running?: boolean };
  doneThisWeek?: unknown[] | number;
  doneThisWeekCount?: number;
  learningSuggestionsCount?: number;
  failedCount?: number;
  archiveCount?: number;
};

type Settings = Record<string, string | undefined>;

type DesktopBackend = {
  backendOrigin?: string;
  configFile?: string;
};

type PipelineStage = {
  key: PipelineStageKey;
  label: string;
  states: string[];
};

type DetailTab = {
  key: "overview" | "activity" | "ask";
  label: "Overview" | "Activity" | "Ask";
};

type ReviewFile = {
  path: string;
  additions: number;
  deletions: number;
  hunks: string[];
};

type DiffPayload = {
  diff?: string;
  baseBranch?: string;
  baseRef?: string;
  error?: string;
};

type ReviewTourPayload = {
  tour?: {
    summary?: string;
    highlights?: Array<string | { title?: string; text?: string; file?: string; line?: number }>;
    files?: Array<{ path?: string; summary?: string; risk?: string }>;
  } | null;
  generating?: boolean;
  created_at?: string;
};

type ReviewComment = {
  id: string;
  file: string;
  line: number | null;
  body: string;
};

type SettingGroup = {
  label: "Automation" | "External Services" | "Code Workspace" | "Command Runtime" | "Agent Context" | "Dashboard Backend" | "Other";
  keys: string[];
};

type SettingEntry = {
  key: string;
  value: string;
};

type AgentPromptType = "planner" | "plan-reviewer" | "coder" | "reviewer" | "git-agent" | "fixer" | "split-planner" | "splitter" | "rebaser";

type AgentPromptState = {
  type: AgentPromptType;
  content: string;
  status: string;
};

type JumpStateOption = {
  state: string;
  label: string;
  hint: string;
  risky?: boolean;
};

type LearningTabKey = "suggestions" | "changes" | "reflections";

type LearningSuggestion = {
  id: number;
  issue_id?: number | null;
  issue_title?: string | null;
  linear_id?: string | null;
  target?: string | null;
  suggestion?: string | null;
  rationale?: string | null;
  status?: string | null;
  created_at?: string | null;
};

type LearningEvent = {
  id: number;
  issue_title?: string | null;
  linear_id?: string | null;
  event_type?: string | null;
  summary?: string | null;
  created_at?: string | null;
};

type LearningChange = {
  id: number;
  issue_title?: string | null;
  linear_id?: string | null;
  target?: string | null;
  change_type?: string | null;
  change_summary?: string | null;
  reason?: string | null;
  created_at?: string | null;
};

type LearningsPayload = {
  suggestions: LearningSuggestion[];
  events: LearningEvent[];
  changes: LearningChange[];
};

type IssueAction = "pause" | "unpause" | "retry" | "ignore" | "unignore" | "split-pr-stack" | "rebase" | "steer" | "clear-steer" | "advance" | "reset" | "set-auto-fix";
type DecisionVerdict = "approved" | "rejected";
type CommandItem = { label: string; action: () => void; disabled?: boolean };

const NAV_ITEMS: NavItem[] = [
  { label: "Queue", key: "queue", hint: "Pipeline", icon: "⚡" },
  { label: "Archive", key: "archive", hint: "Completed", icon: "🗃️" },
  { label: "Settings", key: "settings", hint: "Runtime", icon: "⚙️" },
  { label: "Agent Prompts", key: "prompts", hint: "System prompts", icon: "📖" },
  { label: "Learnings", key: "learnings", hint: "Reflections", icon: "🧠" },
];

const PIPELINE_STAGES: PipelineStage[] = [
  { key: "available", label: "Available", states: ["PENDING"] },
  { key: "active", label: "Active", states: ["SETTING_UP", "PLANNING", "AI_PLAN_REVIEWING", "WORKING", "AI_REVIEWING", "SPLIT_PLANNING", "SPLITTING", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "FIXING", "PUSHING", "REBASING"] },
  { key: "awaiting", label: "Awaiting You", states: ["AWAITING_PLAN_APPROVAL", "AWAITING_SPLIT_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "STEERING", "FAILED", "PAUSED", "IGNORED"] },
];

const DETAIL_TABS: DetailTab[] = [
  { key: "overview", label: "Overview" },
  { key: "activity", label: "Activity" },
  { key: "ask", label: "Ask" },
];

const SETTING_GROUPS: SettingGroup[] = [
  { label: "Automation", keys: ["concurrency_limit", "scheduler_interval_seconds", "ai_review_max_rounds", "auto_retry_max", "forge_reuse_pi_sessions"] },
  { label: "External Services", keys: ["linear_enabled", "linear_team", "github_repo", "linear_poll_interval_seconds"] },
  { label: "Code Workspace", keys: ["worktree_provider", "repo_root", "wt_root", "worktree_root", "branch_prefix", "default_branch"] },
  { label: "Command Runtime", keys: ["runtime_mode", "vm_ssh_target", "host_path_prefix", "vm_path_prefix", "vm_frontend_staging_backend_command", "vm_frontend_local_backend_command", "vm_backend_staging_command", "vm_backend_local_command", "vm_database_command", "vm_command", "terminal_command"] },
  { label: "Agent Context", keys: ["project_prompt_overlay"] },
  { label: "Dashboard Backend", keys: ["dashboard_port", "backend", "backend_mode", "api_base_url"] },
];

const SETTING_GROUP_DESCRIPTIONS: Record<SettingGroup["label"], string> = {
  Automation: "How many issues Forge can run, how often it wakes up, and how hard it should retry or loop before asking you.",
  "External Services": "Linear and GitHub identifiers used for issue lookup, PR links, review comments, and merge status.",
  "Code Workspace": "Where Forge finds your repository and where it creates issue worktrees and branches.",
  "Command Runtime": "How project commands are launched. Leave SSH fields blank for local-only command execution.",
  "Agent Context": "Repo-specific instructions appended to every agent prompt without editing the base prompt files.",
  "Dashboard Backend": "Connection details for this dashboard process and the desktop companion.",
  Other: "Settings in the database that this dashboard does not yet recognize.",
};

const SETTING_LABELS: Record<string, { label: string; hint: string }> = {
  concurrency_limit: { label: "Max parallel issues", hint: "Maximum number of issues allowed to run agents at the same time. Lower this if your machine gets overloaded." },
  scheduler_interval_seconds: { label: "Scheduler check interval", hint: "How many seconds Forge waits between queue checks." },
  ai_review_max_rounds: { label: "AI review loop limit", hint: "Maximum coder ↔ AI reviewer loops before Forge escalates to you." },
  auto_retry_max: { label: "Automatic retry limit", hint: "Maximum automatic retries for transient git-agent and fixer failures." },
  forge_reuse_pi_sessions: { label: "Reuse Pi conversations", hint: "Reuse one Pi session for the same issue and agent type to preserve agent context." },
  model: { label: "Default agent model", hint: "Model used by every agent unless that agent has an override below." },
  default_model: { label: "Legacy default model", hint: "Older setting name kept for compatibility. Prefer Default agent model." },
  model_planner: { label: "Planner model override", hint: "Model for writing implementation plans. Blank means use the default agent model." },
  model_plan_reviewer: { label: "Plan reviewer model override", hint: "Model for reviewing plans before they reach you. Blank means use the default agent model." },
  model_coder: { label: "Coder model override", hint: "Model for implementing approved plans. Blank means use the default agent model." },
  model_reviewer: { label: "Code reviewer model override", hint: "Model for AI code review. Blank means use the default agent model." },
  model_git_agent: { label: "Git/PR agent model override", hint: "Model for branch stack, commit, push, and PR creation tasks. Blank means use the default agent model." },
  model_fixer: { label: "Fixer model override", hint: "Model for addressing approved PR comments. Blank means use the default agent model." },
  model_split_planner: { label: "Split planner model override", hint: "Model for proposing stacked-PR splits. Blank means use the default agent model." },
  model_splitter: { label: "Splitter model override", hint: "Model for applying approved stacked-PR splits. Blank means use the default agent model." },
  model_rebaser: { label: "Rebaser model override", hint: "Model for carefully resolving rebase conflicts. Blank means use the default agent model." },
  linear_enabled: { label: "Run Linear CLI on backend", hint: "Enable only if the backend machine has an authenticated Linear CLI. Otherwise the desktop companion can handle Linear jobs." },
  linear_team: { label: "Linear team key", hint: "Team prefix for issues to list and enqueue, such as TEAM in TEAM-1234." },
  github_repo: { label: "GitHub repository", hint: "Repository slug in owner/name format, used for PR links, gh commands, comments, and merge status." },
  linear_poll_interval_seconds: { label: "Linear polling interval", hint: "How many seconds to wait between Linear sync/list checks when Linear integration is enabled." },
  worktree_provider: { label: "Worktree tool", hint: "Use git for plain git worktrees, or wt if you use Worktrunk." },
  repo_root: { label: "Main repository path", hint: "Path to the primary local clone. Required when Worktree tool is git." },
  wt_root: { label: "Worktrunk root path", hint: "Path to the Worktrunk repo root. Only used when Worktree tool is wt." },
  worktree_root: { label: "New worktrees folder", hint: "Directory where Forge creates new git worktrees for each issue." },
  branch_prefix: { label: "Branch owner prefix", hint: "Prefix added before generated branch names, for example user/TEAM-1234-fix." },
  default_branch: { label: "Default base branch", hint: "Branch Forge fetches and uses as the base for new work." },
  runtime_mode: { label: "Runtime mode", hint: "Optional high-level runtime selector used by desktop/runtime helpers." },
  vm_ssh_target: { label: "Remote command SSH host", hint: "SSH host used for remote workspace commands. Leave blank to run commands locally." },
  host_path_prefix: { label: "Local path prefix", hint: "Local path prefix to translate before SSH execution, such as /Users." },
  vm_path_prefix: { label: "Remote path prefix", hint: "Remote equivalent of the local path prefix, such as /mnt/mac/Users." },
  vm_frontend_staging_backend_command: { label: "Frontend dev command (staging API)", hint: "Command to start the frontend against a staging backend from an issue worktree." },
  vm_frontend_local_backend_command: { label: "Frontend dev command (local API)", hint: "Command to start the frontend against a local backend from an issue worktree." },
  vm_backend_staging_command: { label: "Backend dev command (staging data)", hint: "Command to start backend services configured for staging data." },
  vm_backend_local_command: { label: "Backend dev command (local data)", hint: "Command to start backend services configured for local data." },
  vm_database_command: { label: "Database/dev services command", hint: "Optional command for starting local database or support services." },
  vm_command: { label: "Custom runtime command", hint: "Optional fallback command used by runtime launch helpers." },
  terminal_command: { label: "Terminal command", hint: "Optional shell command used when opening an issue terminal." },
  project_prompt_overlay: { label: "Project-specific agent instructions", hint: "Extra repo rules appended to all agents, such as validation commands, package manager, or team conventions." },
  dashboard_port: { label: "Dashboard port", hint: "Port for the Forge dashboard HTTP server." },
  backend: { label: "Backend name", hint: "Optional label for the selected backend environment." },
  backend_mode: { label: "Backend mode", hint: "Optional mode label shown in the dashboard shell." },
  api_base_url: { label: "API base URL", hint: "Optional API origin override for the dashboard frontend." },
};

const SETTING_PLACEHOLDERS: Record<string, string> = {
  model: "anthropic-vertex/sonnet-4-6",
  linear_team: "TEAM",
  github_repo: "owner/repo",
  worktree_provider: "git",
  repo_root: "/path/to/repo",
  wt_root: "/path/to/worktrunk-root",
  worktree_root: "~/Projects/worktrees",
  branch_prefix: "user",
  default_branch: "main",
  vm_ssh_target: "my-vm",
  host_path_prefix: "/Users",
  vm_path_prefix: "/mnt/mac/Users",
  dashboard_port: "3142",
};

const AGENT_PROMPT_TYPES: AgentPromptType[] = ["planner", "plan-reviewer", "coder", "reviewer", "git-agent", "fixer", "split-planner", "splitter", "rebaser"];

const PROMPT_MODEL_SETTINGS: Record<AgentPromptType, string> = {
  planner: "model_planner",
  "plan-reviewer": "model_plan_reviewer",
  coder: "model_coder",
  reviewer: "model_reviewer",
  "git-agent": "model_git_agent",
  fixer: "model_fixer",
  "split-planner": "model_split_planner",
  splitter: "model_splitter",
  rebaser: "model_rebaser",
};

const MODEL_SETTING_KEYS = ["model", "default_model", ...Object.values(PROMPT_MODEL_SETTINGS)];
const KNOWN_SETTING_KEYS = new Set([...SETTING_GROUPS.flatMap((group) => group.keys), ...MODEL_SETTING_KEYS]);
const NUMBER_SETTING_KEYS = new Set(SETTING_GROUPS.flatMap((group) => group.keys).filter((key) => inputTypeForSetting(key) === "number"));
const BOOLEAN_SETTING_KEYS = new Set(SETTING_GROUPS.flatMap((group) => group.keys).filter((key) => inputTypeForSetting(key) === "checkbox"));
const RUNTIME_SETTING_KEYS = new Set(["runtime_mode", "vm_ssh_target", "host_path_prefix", "vm_path_prefix", "vm_frontend_staging_backend_command", "vm_backend_staging_command", "vm_command", "terminal_command", "backend", "backend_mode", "api_base_url", "dashboard_port"]);

const LEARNING_TABS: Array<{ key: LearningTabKey; label: "Suggestions" | "Change log" | "Reflection history" }> = [
  { key: "suggestions", label: "Suggestions" },
  { key: "changes", label: "Change log" },
  { key: "reflections", label: "Reflection history" },
];

const QUEUE_FILTERS: Array<{ key: QueueFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "needs-me", label: "Needs me" },
  { key: "running", label: "Running" },
  { key: "failed", label: "Failed" },
  { key: "watching-pr", label: "Watching PR" },
  { key: "paused", label: "Paused" },
];

const QUEUE_SORTS: Array<{ key: QueueSort; label: string }> = [
  { key: "priority", label: "Priority" },
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "recently-updated", label: "Recently updated" },
];

const NEXT_STATE_BY_STATE: Record<string, string> = {
  PENDING: "SETTING_UP",
  SETTING_UP: "PLANNING",
  PLANNING: "AI_PLAN_REVIEWING",
  AI_PLAN_REVIEWING: "AWAITING_PLAN_APPROVAL",
  AWAITING_PLAN_APPROVAL: "WORKING",
  WORKING: "AI_REVIEWING",
  AI_REVIEWING: "AWAITING_CODE_REVIEW",
  AWAITING_CODE_REVIEW: "CREATING_PR",
  SPLIT_PLANNING: "AWAITING_SPLIT_APPROVAL",
  AWAITING_SPLIT_APPROVAL: "SPLITTING",
  SPLITTING: "CREATING_PR",
  CREATING_PR: "WATCHING_PR",
  WATCHING_PR: "IN_MERGE_QUEUE",
  IN_MERGE_QUEUE: "DONE",
  AWAITING_FIX_APPROVAL: "FIXING",
  FIXING: "PUSHING",
  PUSHING: "WATCHING_PR",
  REBASING: "WATCHING_PR",
  FAILED: "WORKING",
  PAUSED: "WORKING",
  IGNORED: "WORKING",
};

function nextStateForIssue(state?: string | null): string {
  return NEXT_STATE_BY_STATE[state ?? ""] ?? "WORKING";
}

const JUMP_STATE_OPTIONS: JumpStateOption[] = [
  { state: "PLANNING", label: "↩ Re-plan", hint: "Run the planner agent again" },
  { state: "WORKING", label: "⚡ Code", hint: "Jump straight to the coder agent" },
  { state: "AI_REVIEWING", label: "🤖 AI Review", hint: "Run the AI reviewer on current code" },
  { state: "CREATING_PR", label: "📤 Create PR", hint: "Skip to PR creation" },
  { state: "FIXING", label: "🔧 Fix", hint: "Jump to the fixer agent" },
  { state: "WATCHING_PR", label: "👁 Watch PR", hint: "Monitor open PRs for CI / reviews" },
  { state: "REBASING", label: "↥ Rebase", hint: "Resolve rebase conflicts and push carefully" },
  { state: "SPLIT_PLANNING", label: "✂️ Plan Split", hint: "Ask an agent to propose a stacked PR split" },
  { state: "SPLITTING", label: "✂️ Split Stack", hint: "Execute the approved stacked PR split", risky: true },
  { state: "IN_MERGE_QUEUE", label: "🔀 Merge Queue", hint: "Mark PRs as entered into merge queue", risky: true },
  { state: "DONE", label: "✅ Mark Done", hint: "Archive this issue as complete", risky: true },
];

const STATE_PROCESS_ORDER: Record<string, number> = {
  PENDING: 10,
  SETTING_UP: 20,
  PLANNING: 30,
  AI_PLAN_REVIEWING: 40,
  AWAITING_PLAN_APPROVAL: 50,
  WORKING: 60,
  AI_REVIEWING: 70,
  AWAITING_CODE_REVIEW: 80,
  SPLIT_PLANNING: 90,
  AWAITING_SPLIT_APPROVAL: 100,
  SPLITTING: 110,
  CREATING_PR: 120,
  WATCHING_PR: 130,
  IN_MERGE_QUEUE: 140,
  AWAITING_FIX_APPROVAL: 150,
  FIXING: 160,
  PUSHING: 170,
  REBASING: 175,
  DONE: 180,
  STEERING: 190,
  FAILED: 200,
  PAUSED: 210,
  IGNORED: 220,
};

const STATE_TO_PIPELINE_STAGE: Record<string, PipelineStageKey> = {
  PENDING: "available",
  SETTING_UP: "active",
  PLANNING: "active",
  AI_PLAN_REVIEWING: "active",
  SPLIT_PLANNING: "active",
  SPLITTING: "active",
  WORKING: "active",
  AI_REVIEWING: "active",
  FIXING: "active",
  PUSHING: "active",
  REBASING: "active",
  CREATING_PR: "active",
  WATCHING_PR: "active",
  IN_MERGE_QUEUE: "active",
  DONE: "active",
  AWAITING_PLAN_APPROVAL: "awaiting",
  AWAITING_SPLIT_APPROVAL: "awaiting",
  AWAITING_CODE_REVIEW: "awaiting",
  AWAITING_FIX_APPROVAL: "awaiting",
  STEERING: "awaiting",
  PAUSED: "awaiting",
  FAILED: "awaiting",
  IGNORED: "awaiting",
};

const DEFAULT_STATUS: ShellStatus = {
  scheduler: "unknown",
  activeCount: 0,
  awaitingDecisionsCount: 0,
  failedCount: 0,
  doneThisWeekCount: 0,
  learningSuggestionsCount: 0,
  archiveCount: 0,
  model: "—",
  backend: "local",
  runningAgentsCount: 0,
  concurrencyLimit: 2,
};

function asCount(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}

function isQueueIssue(issue: Issue): boolean {
  return issue.state !== "DONE";
}

const MOCK_STATE_NAMES = [
  "PENDING",
  "SETTING_UP",
  "PLANNING",
  "AI_PLAN_REVIEWING",
  "AWAITING_PLAN_APPROVAL",
  "SPLIT_PLANNING",
  "AWAITING_SPLIT_APPROVAL",
  "SPLITTING",
  "WORKING",
  "AI_REVIEWING",
  "AWAITING_CODE_REVIEW",
  "CREATING_PR",
  "WATCHING_PR",
  "IN_MERGE_QUEUE",
  "AWAITING_FIX_APPROVAL",
  "FIXING",
  "PUSHING",
  "REBASING",
  "STEERING",
  "DONE",
  "FAILED",
  "PAUSED",
  "IGNORED",
] as const;

function mockStatesEnabled(): boolean {
  const search = window.location.search.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const enabledByUrl = search.includes("mockstates=1")
    || search.includes("mock=states")
    || hash.includes("mockstates=1")
    || hash.includes("mock=states")
    || hash.includes("mock-states");
  if (enabledByUrl) window.localStorage.setItem("forge-v3-mock-states", "1");
  return enabledByUrl || window.localStorage.getItem("forge-v3-mock-states") === "1";
}

function enableMockStatesForSession(): void {
  window.localStorage.setItem("forge-v3-mock-states", "1");
  window.location.reload();
}

function disableMockStatesForSession(): void {
  window.localStorage.removeItem("forge-v3-mock-states");
  const url = new URL(window.location.href);
  url.searchParams.delete("mockStates");
  if (url.searchParams.get("mock") === "states") url.searchParams.delete("mock");
  window.location.href = url.toString();
}

function mockTimestamp(minutesAgo: number): string {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

function mockDecisionForIssue(issue: Issue): Decision | null {
  if (issue.state === "AWAITING_PLAN_APPROVAL") return { id: 9101, issue_id: issue.id, type: "PLAN_REVIEW", issueTitle: issue.title };
  if (issue.state === "AWAITING_CODE_REVIEW") return { id: 9102, issue_id: issue.id, type: "CODE_REVIEW", issueTitle: issue.title };
  if (issue.state === "AWAITING_FIX_APPROVAL") return { id: 9103, issue_id: issue.id, type: "FIX_APPROVAL", issueTitle: issue.title, artifact_ref: JSON.stringify({ comments: [{ id: "c1", author: "Reviewer", body: "Please cover the empty-state path before merging.", path: "src/mock.ts", line: 3, pr_number: 4521, reviewState: "CHANGES_REQUESTED" }, { id: "ci-1", author: "CI", body: "Typecheck failure in mock review fixture.", path: "src/mock.ts", line: null, pr_number: 4521, source: "ci" }] }) };
  if (issue.state === "AWAITING_SPLIT_APPROVAL") return { id: 9104, issue_id: issue.id, type: "SPLIT_APPROVAL", issueTitle: issue.title, artifact_ref: JSON.stringify({ summary: "Split generated code review prep from dashboard polish.", proposedStack: [{ branch: "mock/review-foundation", title: "Review foundation" }, { branch: "mock/review-polish", title: "Review polish" }] }) };
  return null;
}

function mockIssues(): Issue[] {
  return MOCK_STATE_NAMES.map((state, index) => ({
    id: 9000 + index,
    linear_id: `MOCK-${index + 1}`,
    title: `${issueStateLabel({ id: 0, state })} dashboard fixture`,
    state,
    priority: (index % 4) + 1,
    created_at: mockTimestamp(240 + index * 11),
    updated_at: mockTimestamp(3 + index * 7),
    branch: `user/mock-${state.toLowerCase().replaceAll("_", "-")}`,
    wt_path: `/tmp/forge/mock/${state.toLowerCase()}`,
    project_file_path: `/tmp/forge/mock/${state.toLowerCase()}/plan.md`,
    prStack: ["CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "PUSHING", "REBASING"].includes(state)
      ? [{ pr_number: state === "CREATING_PR" ? null : 4521 + index, branch: `user/mock-${index + 1}`, status: state === "IN_MERGE_QUEUE" ? "merged" : "open" }]
      : [],
  }));
}

function mockPlan(issue: Issue): string {
  return `# ${issue.linear_id} ${issue.title}\n\n## Goal\nExercise the v3 detail panel while this issue is in **${issueStateLabel(issue)}**.\n\n## Tasks\n- [x] Gather context\n- [x] Draft plan\n- [ ] Implement state-specific UI polish\n- [ ] Validate actions and banners\n\n## Review notes\nUse this mock fixture to tidy copy, action availability, colors, and spacing before testing real Forge issues.`;
}

function mockIssueDetail(issueId: number): IssueDetail {
  const issue = mockIssues().find((candidate) => candidate.id === issueId) ?? mockIssues()[0]!;
  const decision = mockDecisionForIssue(issue);
  return {
    issue,
    plan: mockPlan(issue),
    planContent: mockPlan(issue),
    decisions: decision ? [decision] : [],
    agentRuns: [
      { id: issue.id * 10 + 1, agent_type: "planner", started_at: mockTimestamp(38), exit_code: 0 },
      { id: issue.id * 10 + 2, agent_type: issue.state?.toLowerCase().includes("review") ? "reviewer" : "coder", started_at: mockTimestamp(9), exit_code: isRunningIssue(issue) ? null : 0 },
    ],
    activityLog: [
      { id: issue.id * 100 + 1, type: "agent_completed", actor: "planner", message: "Planner wrote the implementation plan", created_at: mockTimestamp(38) },
      { id: issue.id * 100 + 2, type: issue.state === "FAILED" ? "agent_failed" : "steered", actor: issue.state === "FAILED" ? "coder" : "user", message: issue.state === "FAILED" ? "Coder failed while applying changes" : "Steering instructions added from dashboard", created_at: mockTimestamp(8) },
    ],
    failureContext: issue.state === "FAILED" ? { run: { id: issue.id * 10 + 2, agent_type: "coder", started_at: mockTimestamp(9), exit_code: 1 }, logTail: "[FATAL] Mock failure context\nTypeError: Cannot read properties of undefined" } : null,
    prStack: issue.prStack?.map((pr) => ({ pr_number: pr.pr_number, branch: pr.branch ?? undefined, status: pr.status ?? undefined, reviewDecision: pr.pr_number ? "APPROVED" : null, mergeable: "MERGEABLE", checksTotal: pr.pr_number ? 8 : 0, checksFailed: 0, checksPending: issue.state === "WATCHING_PR" ? 1 : 0, liveState: pr.status?.toUpperCase() ?? "OPEN", url: pr.pr_number ? `https://github.com/example/repo/pull/${pr.pr_number}` : null })),
    vmConnectCommand: `ssh my-vm # ${issue.linear_id}`,
  };
}

function mockOverview(): Overview {
  const issues = mockIssues();
  const decisions = issues.flatMap((issue) => {
    const decision = mockDecisionForIssue(issue);
    return decision ? [decision] : [];
  });
  return {
    issues,
    decisions,
    runningAgents: issues.filter(isRunningIssue).map((issue) => ({ issueId: issue.id, state: issue.state })),
    scheduler: { running: true },
    doneThisWeek: [{ id: 9999 }],
    learningSuggestionsCount: 0,
  };
}

function classifyIssueToPipelineStage(issue: Issue): PipelineStageKey {
  return STATE_TO_PIPELINE_STAGE[issue.state ?? ""] ?? "building";
}

function issueProgress(issue: Issue): number {
  const state = issue.state ?? "";
  if (state === "PENDING") return 2;
  if (["SETTING_UP", "PLANNING", "AI_PLAN_REVIEWING", "SPLIT_PLANNING"].includes(state)) return 10;
  if (["AWAITING_PLAN_APPROVAL", "AWAITING_SPLIT_APPROVAL"].includes(state)) return 20;
  if (["WORKING", "SPLITTING"].includes(state)) return 42;
  if (state === "AI_REVIEWING") return 55;
  if (state === "AWAITING_CODE_REVIEW") return 62;
  if (state === "AWAITING_FIX_APPROVAL") return 73;
  if (["WATCHING_PR", "FIXING", "PUSHING", "REBASING"].includes(state)) return 84;
  if (state === "IN_MERGE_QUEUE") return 95;
  if (state === "DONE") return 100;
  if (state === "FAILED") return 38;
  if (state === "PAUSED") return 30;
  const stage = classifyIssueToPipelineStage(issue);
  return ({ available: 2, active: 55, awaiting: 70 } satisfies Record<PipelineStageKey, number>)[stage];
}

function isIssueStuck(issue: Issue): boolean {
  if (!issue.updated_at) return false;
  const updatedAt = parseTimestamp(issue.updated_at);
  return Number.isFinite(updatedAt) && Date.now() - updatedAt > 24 * 60 * 60 * 1000;
}

/**
 * Parse a timestamp string from SQLite (which omits the timezone indicator)
 * as UTC, preventing the browser from mis-interpreting it as local time.
 */
function parseTimestamp(ts: string): number {
  // SQLite datetime('now') → "2024-01-15 12:00:00" (no Z, no +offset)
  // ISO without tz        → "2024-01-15T12:00:00"
  // Both must be treated as UTC, not local time.
  if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(ts) && !ts.endsWith("Z") && !ts.includes("+")) {
    return new Date(ts.replace(" ", "T") + "Z").getTime();
  }
  return new Date(ts).getTime();
}

function timeAgoShort(timestamp?: string | null): string {
  if (!timestamp) return "recent";
  const then = parseTimestamp(timestamp);
  if (!Number.isFinite(then)) return "recent";
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return `${Math.max(1, seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function formatDateTime(timestamp?: string | null): string {
  if (!timestamp) return "date unknown";
  const parsed = parseTimestamp(timestamp);
  if (!Number.isFinite(parsed)) return timestamp;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(parsed));
}

function priorityGlyph(priority?: number | null): string {
  if (priority === 1) return "▰▰▰";
  if (priority === 2) return "▰▰░";
  if (priority === 3) return "▰░░";
  if (priority === 4) return "░░░";
  return "□□□";
}

function priorityLabel(priority?: number | null): string {
  if (priority === 1) return "urgent";
  if (priority === 2) return "high";
  if (priority === 3) return "medium";
  if (priority === 4) return "low";
  return "none";
}

function priorityClass(priority?: number | null): string {
  if (priority === 1) return "priority-urgent";
  if (priority === 2) return "priority-high";
  return "priority-normal";
}

function issueStateLabel(issue: Issue): string {
  const state = issue.state ?? "UNKNOWN";
  return ({
    PENDING: "pending",
    SETTING_UP: "setting up",
    PLANNING: "planning",
    AI_PLAN_REVIEWING: "AI plan review",
    AWAITING_PLAN_APPROVAL: "awaiting your plan review",
    WORKING: "coding",
    AI_REVIEWING: "ai code review",
    AWAITING_CODE_REVIEW: "awaiting code review",
    CREATING_PR: "creating pr",
    WATCHING_PR: "watching pr",
    IN_MERGE_QUEUE: "in merge queue",
    SPLIT_PLANNING: "split planning",
    AWAITING_SPLIT_APPROVAL: "awaiting split approval",
    SPLITTING: "splitting",
    AWAITING_FIX_APPROVAL: "awaiting fix approval",
    FIXING: "fixing",
    PUSHING: "pushing",
    REBASING: "rebasing",
    FAILED: "failed",
    PAUSED: "paused",
    IGNORED: "ignored",
    DONE: "done",
  } as Record<string, string>)[state] ?? state.toLowerCase().replaceAll("_", " ");
}

function issueStatePillClass(issue: Issue): string {
  const state = issue.state ?? "";
  if (state === "AWAITING_CODE_REVIEW") return "forge-v3-state-pill pill-code";
  if (state === "WATCHING_PR") return "forge-v3-state-pill pill-watching";
  if (state === "IN_MERGE_QUEUE") return "forge-v3-state-pill pill-merge";
  if (state === "FAILED") return "forge-v3-state-pill pill-failed";
  const stage = classifyIssueToPipelineStage(issue);
  return `forge-v3-state-pill pill-${stage}`;
}

function decisionTypeClass(decision: Decision): string {
  const type = (decision.type ?? "decision").toLowerCase().replaceAll("_", "-");
  if (type.includes("code")) return "decision-code";
  if (type.includes("plan")) return "decision-plan";
  if (type.includes("fix")) return "decision-fix";
  if (type.includes("split")) return "decision-split";
  return "decision-generic";
}

function decisionTypeLabel(decision: Decision): string {
  return (decision.type ?? "Decision").toLowerCase().replaceAll("_", " ");
}

function isRunningIssue(issue: Issue): boolean {
  return ["SETTING_UP", "PLANNING", "AI_PLAN_REVIEWING", "SPLIT_PLANNING", "SPLITTING", "WORKING", "AI_REVIEWING", "FIXING", "PUSHING", "REBASING", "CREATING_PR"].includes(issue.state ?? "");
}

function canListenLive(issue: Issue): boolean {
  return isRunningIssue(issue);
}

function isPrApproved(issue: Issue): boolean {
  return Boolean(issue.pr_approved_at || (issue.prStack ?? []).some((pr) => String(pr.reviewDecision ?? "").toUpperCase() === "APPROVED"));
}

function isPrMerged(pr: PrStackItem): boolean {
  return String(pr.status ?? "").toLowerCase() === "merged" || String(pr.liveState ?? "").toUpperCase() === "MERGED";
}

function isIssueMergedPendingArchive(issue: Issue): boolean {
  const prs = (issue.prStack ?? []).filter((pr) => pr.pr_number);
  return issue.state !== "DONE" && prs.length > 0 && prs.every(isPrMerged);
}

function issueRuntimeBadges(issue: Issue): Array<{ className: string; label: string }> {
  const badges: Array<{ className: string; label: string }> = [];
  if (isRunningIssue(issue)) badges.push({ className: "forge-v3-live-badge", label: "Live" });
  if (issue.updated_at) badges.push({ className: `forge-v3-elapsed-badge${isIssueStuck(issue) ? " long" : ""}`, label: isIssueStuck(issue) ? "24h+" : timeAgoShort(issue.updated_at) });
  if (isIssueStuck(issue)) badges.push({ className: "forge-v3-stuck-indicator", label: "⚠ long" });
  return badges;
}

function issueActivitySnippet(issue: Issue): any {
  const state = issue.state ?? "";
  if (["PLANNING", "SETTING_UP"].includes(state)) {
    return [h("strong", null, "Planner"), " reading ", h("code", null, "project context"), " — exploring component structure and requirements…"];
  }
  if (state === "AI_PLAN_REVIEWING") return [h("strong", null, "AI plan reviewer"), " checking scope, risks, and task sequencing…"];
  if (state === "AWAITING_PLAN_APPROVAL") return ["Plan ready for you — ", h("strong", null, "review tasks"), " and AI reviewer notes before approving."];
  if (state === "WORKING") return [h("strong", null, "Coder"), " writing changes — implementing planned code updates…"];
  if (state === "AI_REVIEWING") return [h("strong", null, "Reviewer"), " checking security, test coverage, and conventions…"];
  if (state === "AWAITING_CODE_REVIEW") return ["AI review ", h("strong", { style: { color: "var(--emerald)" } }, "approved"), ". Review changed files and tests."];
  if (state === "REBASING") return [h("strong", null, "Rebaser"), " updating branch history against the base branch — resolving conflicts cautiously if needed…"];
  if (isPrApproved(issue)) return ["GitHub review ", h("strong", { style: { color: "var(--emerald)" } }, "approved"), " — ready for merge queue or final checks."];
  if (state === "FAILED") return [h("strong", { style: { color: "var(--red)" } }, "Agent crashed"), " — inspect logs and retry."];
  if (state === "PAUSED") return ["Paused by user. Was in ", h("strong", null, "active"), " state."];
  return issue.updated_at ? "Updated recently" : "Queued in Forge";
}

function issueMetaText(issue: Issue): string {
  const elapsed = timeAgoShort(issue.updated_at ?? issue.created_at);
  if (isRunningIssue(issue)) return issue.state === "AI_REVIEWING" ? `In review ${elapsed}` : `Started ${elapsed} ago`;
  if (issue.state?.startsWith("AWAITING")) return `Waiting ${elapsed}`;
  if (issue.state === "FAILED") return `Failed ${elapsed} ago`;
  if (issue.state === "PAUSED") return `Paused ${elapsed} ago`;
  if (classifyIssueToPipelineStage(issue) === "available") return `Added ${elapsed} ago`;
  return `Updated ${elapsed} ago`;
}

function issueDecisionKind(decisions: Decision[]): "plan" | "code" | "fix" | "split" | "generic" | null {
  const type = decisions[0]?.type ?? "";
  if (!type) return null;
  if (type.includes("PLAN")) return "plan";
  if (type.includes("CODE")) return "code";
  if (type.includes("FIX")) return "fix";
  if (type.includes("SPLIT")) return "split";
  return "generic";
}

function parseDecisionArtifact(decision?: Decision): DecisionArtifact {
  if (!decision?.artifact_ref) return {};
  try {
    const parsed = JSON.parse(decision.artifact_ref) as DecisionArtifact;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return { summary: decision.artifact_ref };
  }
}

function fixCommentId(comment: FixApprovalComment, index: number): string {
  return String(comment.id ?? `${comment.path ?? "comment"}-${comment.line ?? index}-${index}`);
}

function formatReviewSectionLabel(raw: string): string {
  return raw.toLowerCase().split(/[_\s-]+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function normalizeFixCommentBody(body?: string | null): string {
  return (body ?? "No comment body")
    .replace(/<!--\s*BUGBOT_BUG_ID:\s*[^>]*?-->/gi, "")
    .replace(/<!--\s*([A-Z0-9_ -]+?)\s+START\s*([\s\S]*?)\s+\1\s+END\s*-->/gi, (_match, label, content) => `<!-- ${label} START -->\n${content.trim()}\n<!-- ${label} END -->`)
    .replace(/<details\b[\s\S]*?<\/details>/gi, "")
    .replace(/<sup\b[\s\S]*?<\/sup>/gi, "")
    .replace(/<div\b[\s\S]*?<\/div>/gi, "")
    .trim() || "No comment body";
}

function renderFixCommentBody(body?: string | null): any {
  const text = normalizeFixCommentBody(body);
  const markerPattern = /<!--\s*([A-Z0-9_ -]+?)\s+(START|END)\s*-->/gi;
  const markers = [...text.matchAll(markerPattern)];
  if (!markers.length) return h("div", { class: "forge-v3-fix-comment-body forge-v3-fix-comment-md", dangerouslySetInnerHTML: { __html: renderMarkdown(text) } });

  const sections: Array<{ label: string | null; text: string }> = [];
  let currentLabel: string | null = null;
  let cursor = 0;
  const push = (end: number) => {
    const chunk = text.slice(cursor, end).trim();
    if (chunk) sections.push({ label: currentLabel, text: chunk });
  };

  for (const marker of markers) {
    push(marker.index ?? cursor);
    cursor = (marker.index ?? cursor) + marker[0].length;
    currentLabel = marker[2].toUpperCase() === "START" ? formatReviewSectionLabel(marker[1]) : null;
  }
  push(text.length);

  return h("div", { class: "forge-v3-fix-comment-body" },
    sections.length
      ? sections.map((section, index) => h("section", { class: "forge-v3-fix-comment-section", key: `${section.label ?? "intro"}-${index}` },
          section.label ? h("div", { class: "forge-v3-fix-comment-section-label" }, section.label) : null,
          h("div", { class: "forge-v3-fix-comment-md", dangerouslySetInnerHTML: { __html: renderMarkdown(section.text) } })
        ))
      : h("div", { class: "forge-v3-fix-comment-md", dangerouslySetInnerHTML: { __html: renderMarkdown(text.replace(markerPattern, "").trim() || "No comment body") } })
  );
}

function expectedDecisionTypeForState(state?: string | null): string | null {
  if (state === "AWAITING_PLAN_APPROVAL") return "PLAN_REVIEW";
  if (state === "AWAITING_CODE_REVIEW") return "CODE_REVIEW";
  if (state === "AWAITING_FIX_APPROVAL") return "FIX_APPROVAL";
  if (state === "AWAITING_SPLIT_APPROVAL") return "SPLIT_APPROVAL";
  return null;
}

function issueBanner(issue: Issue, decisions: Decision[]) {
  const state = issue.state ?? "";
  const decisionKind = issueDecisionKind(decisions);
  if (decisionKind === "plan" || state === "AWAITING_PLAN_APPROVAL") return { icon: "📋", tone: "awaiting", title: "Plan ready for review", text: "Planner generated a plan. AI plan reviewer approved with notes for your review.", live: false };
  if (decisionKind === "code" || state === "AWAITING_CODE_REVIEW") return { icon: "⬡", tone: "awaiting", title: "Code review ready", text: "AI reviewer finished. Review the diff, then approve or request changes.", live: false };
  if (decisionKind === "fix" || state === "AWAITING_FIX_APPROVAL") return { icon: "💬", tone: "awaiting", title: "PR comments ready for review", text: "Select which comments and failures should be sent to the fixer agent.", live: false };
  if (state === "AWAITING_SPLIT_APPROVAL") return { icon: "⑂", tone: "awaiting", title: "Split plan ready", text: "Review the proposed PR stack split before Forge creates branch work.", live: false };
  if (state === "REBASING") return { icon: "↥", tone: "running", title: "Rebasing branch", text: "Forge is rebasing onto the base branch. If conflicts appear, the rebaser agent will resolve them carefully and stop rather than guess.", live: true };
  if (isPrApproved(issue) && ["WATCHING_PR", "IN_MERGE_QUEUE"].includes(state)) return { icon: "✓", tone: "running", title: "PR approved", text: issue.pr_approved_at ? `GitHub review approved ${timeAgoShort(issue.pr_approved_at)} ago. Forge is watching for merge queue and merge status.` : "GitHub review is approved. Forge is watching for merge queue and merge status.", live: false };
  if (isRunningIssue(issue)) return { icon: "spinner", tone: "running", title: `${issueStateLabel(issue)} agent running`, text: `Active for ${timeAgoShort(issue.updated_at)} — Forge is working on this issue.`, live: true };
  if (state === "FAILED") return { icon: "!", tone: "failed", title: "Issue needs attention", text: "The last agent run failed. Review activity and retry when ready.", live: false };
  return { icon: stageIcon(classifyIssueToPipelineStage(issue)), tone: classifyIssueToPipelineStage(issue), title: issueStateLabel(issue), text: issue.updated_at ? `Updated ${timeAgoShort(issue.updated_at)} ago` : "Waiting for activity", live: false };
}

const PHASES = ["Setup", "Plan", "Code", "Review", "PR", "Watch", "Done"];

type PhaseTooltip = {
  title: string;
  summary: string;
  stats: string[];
};

function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function countRuns(runs: AgentRun[] | undefined, agentType: string): number {
  return (runs ?? []).filter((run) => run.agent_type === agentType).length;
}

function countFixApprovalComments(decisions: Decision[] | undefined): number {
  return (decisions ?? [])
    .filter((decision) => decision.type === "FIX_APPROVAL")
    .reduce((total, decision) => total + (parseDecisionArtifact(decision).comments?.length ?? 0), 0);
}

function countDecisions(decisions: Decision[] | undefined, type: string): number {
  return (decisions ?? []).filter((decision) => decision.type === type).length;
}

function phaseTooltip(label: string, detail: IssueDetail | null): PhaseTooltip {
  const runs = detail?.agentRuns ?? [];
  const decisions = detail?.decisions ?? [];
  const prStack = detail?.prStack ?? detail?.issue?.prStack ?? [];
  const plannerRuns = countRuns(runs, "planner");
  const planReviewRuns = countRuns(runs, "plan-reviewer");
  const coderRuns = countRuns(runs, "coder");
  const codeReviewRuns = countRuns(runs, "reviewer");
  const fixerRuns = countRuns(runs, "fixer");
  const watcherRuns = countRuns(runs, "watcher");
  const fixComments = countFixApprovalComments(decisions);

  if (label === "Setup") return { title: "Setup", summary: "Creates the worktree, branch, and project file before agent work starts.", stats: [pluralize(countRuns(runs, "setup"), "setup run"), detail?.issue?.wt_path ? "Worktree ready" : "Worktree not recorded yet"] };
  if (label === "Plan") return { title: "Plan", summary: "Planner drafts the project plan, then the AI plan reviewer checks scope and sequencing.", stats: [pluralize(plannerRuns, "planner pass", "planner passes"), pluralize(planReviewRuns, "AI plan review"), pluralize(Math.max(0, Math.min(plannerRuns, planReviewRuns) - 1), "planner/reviewer loop")] };
  if (label === "Code") return { title: "Code", summary: "Coder implements the approved plan and applies requested changes from review loops.", stats: [pluralize(coderRuns, "coder pass", "coder passes"), pluralize(Math.max(0, coderRuns - 1), "rework loop")] };
  if (label === "Review") return { title: "Review", summary: "AI reviewer inspects the implementation before handing it to you for code review.", stats: [pluralize(codeReviewRuns, "AI code review"), pluralize(countDecisions(decisions, "CODE_REVIEW"), "human review gate"), pluralize(Math.max(0, Math.min(coderRuns, codeReviewRuns) - 1), "code/review loop")] };
  if (label === "PR") return { title: "PR", summary: "Git agent prepares the branch stack and opens or updates GitHub PRs.", stats: [pluralize(countRuns(runs, "git-agent"), "git-agent run"), pluralize(prStack.length, "PR"), pluralize(fixComments, "PR comment/issue")] };
  if (label === "Watch") return { title: "Watch", summary: "Watcher polls reviews, checks, and merge state. Fixer loops run when PR feedback needs changes.", stats: [pluralize(watcherRuns, "watch poll"), pluralize(fixerRuns, "fix loop"), pluralize(fixComments, "comment/issue routed to fixer")] };
  return { title: "Done", summary: "Issue is complete once Forge observes the PR stack merged and writes the summary.", stats: [detail?.issue?.state === "DONE" ? "Completed" : "Not completed yet"] };
}

function phaseIndexForState(state?: string | null): number {
  if (["PENDING", "SETTING_UP"].includes(state ?? "")) return 0;
  if (["PLANNING", "AI_PLAN_REVIEWING", "AWAITING_PLAN_APPROVAL", "SPLIT_PLANNING", "AWAITING_SPLIT_APPROVAL"].includes(state ?? "")) return 1;
  if (["WORKING", "SPLITTING"].includes(state ?? "")) return 2;
  if (["AI_REVIEWING", "AWAITING_CODE_REVIEW"].includes(state ?? "")) return 3;
  if (["CREATING_PR"].includes(state ?? "")) return 4;
  if (["WATCHING_PR", "AWAITING_FIX_APPROVAL", "FIXING", "PUSHING", "REBASING", "IN_MERGE_QUEUE"].includes(state ?? "")) return 5;
  if (state === "DONE") return 6;
  return 0;
}

function isWaitingState(state?: string | null): boolean {
  return ["AWAITING_PLAN_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "AWAITING_SPLIT_APPROVAL"].includes(state ?? "");
}

function detailPlan(detail: IssueDetail | null): string {
  return detail?.planContent ?? detail?.plan ?? "No plan available.";
}

function hasPlan(detail: IssueDetail | null): boolean {
  const plan = detail?.planContent ?? detail?.plan;
  return Boolean(plan?.trim());
}

function detailHandoff(detail: IssueDetail | null): string {
  return detail?.handoffContent ?? "";
}

function hasHandoff(detail: IssueDetail | null): boolean {
  return Boolean(detailHandoff(detail).trim());
}

function hasWrittenCode(state?: string | null): boolean {
  return ["AI_REVIEWING", "AWAITING_CODE_REVIEW", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "PUSHING", "REBASING", "FAILED", "PAUSED"].includes(state ?? "");
}

function canRequestSplitPrStack(state?: string | null): boolean {
  return ["AI_REVIEWING", "AWAITING_CODE_REVIEW", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "PUSHING", "REBASING"].includes(state ?? "");
}

function canRebaseIssue(issue?: Issue | null): boolean {
  if (!issue) return false;
  return ["AWAITING_CODE_REVIEW", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL"].includes(issue.state ?? "") && !isRunningIssue(issue) && !issue.locked_at && !issue.agent_pid;
}

function diffLineClass(line: string): string {
  if (line.startsWith("+")) return "add";
  if (line.startsWith("-")) return "del";
  if (line.startsWith("@@")) return "hunk";
  if (line.startsWith("diff --git") || line.startsWith("index ") || line.startsWith("---") || line.startsWith("+++")) return "meta";
  return "ctx";
}

function diffLineSign(line: string): string {
  if (line.startsWith("+")) return "+";
  if (line.startsWith("-")) return "−";
  return "";
}

function fileNameFromPath(path: string): string {
  return path.split(/[\\/]/).filter(Boolean).pop() || path;
}

function activityActor(agentType?: string | null): string {
  const type = agentType ?? "agent";
  return ({
    planner: "Planner",
    "plan-reviewer": "Plan reviewer",
    coder: "Coder",
    reviewer: "AI reviewer",
    "git-agent": "Git agent",
    fixer: "Fixer",
    watcher: "Watcher",
    setup: "Setup",
  } as Record<string, string>)[type] ?? type.replaceAll("-", " ");
}

function activityText(run: AgentRun, issue: Issue): string {
  if (run.exit_code === null) return `${activityActor(run.agent_type)} is active — streaming progress.`;
  if (run.exit_code && run.exit_code !== 0) return `${activityActor(run.agent_type)} failed — inspect logs before retrying.`;
  if (run.agent_type === "planner") return "Plan created — tasks, risks, and PR stack estimated.";
  if (run.agent_type === "plan-reviewer") return "Plan approved — scope and sequencing look ready.";
  if (run.agent_type === "coder") return "Completed implementation pass and updated project notes.";
  if (run.agent_type === "reviewer") return "Review completed — security, tests, and conventions checked.";
  if (run.agent_type === "git-agent") return "Prepared branch stack and synchronized git state.";
  if (run.agent_type === "fixer") return "Applied requested PR comment fixes.";
  if (run.agent_type === "watcher") return "Checked PR status, reviews, and merge readiness.";
  return `${activityActor(run.agent_type)} completed.`;
}

function activityTone(type?: string | null, actor?: string | null): string {
  const value = `${type ?? ""} ${actor ?? ""}`.toLowerCase();
  if (value.includes("fail") || value.includes("error")) return "err";
  if (value.includes("approved") || value.includes("completed") || value.includes("done")) return "ok";
  if (value.includes("user") || value.includes("steer") || value.includes("paused") || value.includes("ignored")) return "me";
  if (value.includes("started") || value.includes("live")) return "live";
  return "ag";
}

function activityLogText(entry: ActivityLogEntry): string {
  return entry.message ?? entry.type?.replaceAll("_", " ") ?? "Activity recorded";
}

function runLogUrl(runId?: number): string | null {
  return runId ? `/api/runs/${runId}/log` : null;
}

function renderActivityFeed(detail: IssueDetail | null, issue: Issue) {
  const runs = [...(detail?.agentRuns ?? [])].sort((a, b) => timeValue(b.started_at) - timeValue(a.started_at));
  const activity = [...(detail?.activityLog ?? [])].sort((a, b) => timeValue(b.created_at) - timeValue(a.created_at));
  const live = isRunningIssue(issue);
  const runByAgent = new Map(runs.map((run) => [run.agent_type, run]));
  const items = activity.length
    ? activity.map((entry) => {
        const run = runByAgent.get(entry.actor ?? "") ?? (entry.type?.includes("agent") ? runs.find((candidate) => candidate.agent_type === entry.actor) : undefined);
        return { id: String(entry.id ?? `${entry.type}-${entry.created_at}`), actor: entry.actor ?? "Forge", time: entry.created_at ? `${timeAgoShort(entry.created_at)} ago` : "recent", tone: activityTone(entry.type, entry.actor), text: activityLogText(entry), snippet: entry.metadata ?? null, logUrl: runLogUrl(run?.id) };
      })
    : [
        ...(live ? [{ id: "live", actor: activityActor(runs[0]?.agent_type ?? "agent"), time: "now", tone: "live", text: issueActivitySnippet(issue), snippet: "// live agent output\nReading files, updating the project plan, and streaming progress…", logUrl: runLogUrl(runs[0]?.id) }] : []),
        ...runs.map((run) => ({ id: String(run.id ?? `${run.agent_type}-${run.started_at}`), actor: activityActor(run.agent_type), time: run.started_at ? `${timeAgoShort(run.started_at)} ago` : "recent", tone: run.exit_code === null ? "live" : run.exit_code && run.exit_code !== 0 ? "err" : run.agent_type?.includes("review") ? "ok" : "ag", text: activityText(run, issue), snippet: null as string | null, logUrl: runLogUrl(run.id) })),
      ];

  return h("div", { class: "forge-v3-ds" },
    h("div", { class: "forge-v3-activity-head" },
      h("div", { class: "forge-v3-ds-label" }, activity.length ? "Activity log" : "Activity"),
      live ? h("span", { class: "forge-v3-live-badge forge-v3-af-live" }, "Live") : null
    ),
    detail?.failureContext ? h("section", { class: "forge-v3-failure-context" },
      h("div", null, h("strong", null, "Failure context"), detail.failureContext.run ? h("a", { href: runLogUrl(detail.failureContext.run.id) ?? "#", target: "_blank", rel: "noreferrer" }, "Open run log ↗") : null),
      h("pre", null, detail.failureContext.logTail ?? "No failure details available.")
    ) : null,
    h("div", { class: "forge-v3-af-feed" },
      items.length ? items.map((item, index) => h("div", { key: item.id, class: "forge-v3-af-item" },
        h("div", { class: "forge-v3-af-dc" }, h("div", { class: `forge-v3-af-dot ${item.tone}` }), index < items.length - 1 ? h("div", { class: "forge-v3-af-line" }) : null),
        h("div", { class: "forge-v3-af-content" },
          h("div", { class: "forge-v3-af-row" }, h("span", { class: `forge-v3-af-actor ${item.tone === "me" ? "me" : "ag"}` }, item.actor), item.logUrl ? h("a", { class: "forge-v3-run-log-link", href: item.logUrl, target: "_blank", rel: "noreferrer" }, "log ↗") : null, h("span", { class: "forge-v3-af-time" }, item.time)),
          h("div", { class: `forge-v3-af-text ${item.tone}` }, item.text),
          item.snippet ? h("pre", { class: "forge-v3-af-snippet" }, item.snippet) : null
        )
      )) : h("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No activity recorded yet.")
    )
  );
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function renderInlineMarkdown(value: string): string {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function renderMarkdown(markdown: string): string {
  const lines = markdown.replace(/^---[\s\S]*?---\s*/, "").split("\n");
  const html: string[] = [];
  let inList = false;
  let inCode = false;
  let paragraph: string[] = [];
  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${renderInlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const closeList = () => {
    if (!inList) return;
    html.push("</ul>");
    inList = false;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (line.startsWith("```")) {
      flushParagraph();
      closeList();
      html.push(inCode ? "</code></pre>" : "<pre><code>");
      inCode = !inCode;
      continue;
    }
    if (inCode) {
      html.push(escapeHtml(rawLine));
      continue;
    }
    if (!line.trim()) {
      flushParagraph();
      closeList();
      continue;
    }
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = Math.min(heading[1].length + 1, 4);
      html.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }
    const item = line.match(/^[-*]\s+(\[[ xX]\]\s+)?(.+)$/);
    if (item) {
      flushParagraph();
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      const checkbox = item[1] ? `<input type="checkbox" disabled ${item[1].toLowerCase().includes("x") ? "checked" : ""}> ` : "";
      html.push(`<li>${checkbox}${renderInlineMarkdown(item[2])}</li>`);
      continue;
    }
    paragraph.push(line.trim());
  }
  flushParagraph();
  closeList();
  if (inCode) html.push("</code></pre>");
  return html.join("\n");
}

function backlogIssueSearchText(issue: LinearBacklogIssue): string {
  return [issue.title, issue.identifier, issue.state].filter(Boolean).join(" ").toLowerCase();
}

function backlogMatchesQueueSearch(issue: LinearBacklogIssue, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  return !normalizedQuery || backlogIssueSearchText(issue).includes(normalizedQuery);
}

function decisionIcon(decision: Decision): string {
  const type = (decision.type ?? "").toLowerCase();
  if (type.includes("code")) return "○";
  if (type.includes("plan")) return "▣";
  if (type.includes("fix")) return "💬";
  if (type.includes("split")) return "✂";
  return "⬡";
}

function decisionPrimaryActionLabel(decision: Decision): string {
  const type = (decision.type ?? "").toLowerCase();
  if (type.includes("fix")) return "✓ Fix selected";
  if (type.includes("plan")) return "View plan";
  if (type.includes("split")) return "View split";
  return "View diff";
}

function prMetadataBadges(issue: Issue): Array<{ className: string; label: string }> {
  const prs = issue.prStack ?? [];
  const state = issue.state ?? "";
  if (state === "AWAITING_PLAN_APPROVAL") return [{ className: "forge-v3-plan-badge", label: "plan ready" }];
  if (!prs.length) return [];
  return prs.slice(0, 2).flatMap((pr) => [
    { className: "forge-v3-pr-badge", label: pr.pr_number ? `#${pr.pr_number}` : pr.branch ?? "PR" },
    { className: pr.isInMergeQueue ? "forge-v3-ci-badge merge-queue" : pr.status === "merged" ? "forge-v3-ci-badge" : pr.status === "closed" ? "forge-v3-ci-badge fail" : "forge-v3-ci-badge", label: pr.isInMergeQueue ? "merge queue" : pr.liveState ?? pr.status ?? "✓ CI" },
  ]);
}

function issueSearchText(issue: Issue): string {
  const prText = (issue.prStack ?? []).map((pr) => [pr.branch, pr.pr_number ? `#${pr.pr_number}` : "", pr.status].filter(Boolean).join(" ")).join(" ");
  return [issue.title, issue.linear_id, issue.branch, prText, issue.state].filter(Boolean).join(" ").toLowerCase();
}

function issueMatchesQueueSearch(issue: Issue, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  return !normalizedQuery || issueSearchText(issue).includes(normalizedQuery);
}

function issueMatchesQueueFilter(issue: Issue, filter: QueueFilter): boolean {
  const state = issue.state ?? "";
  if (filter === "needs-me") return ["AWAITING_PLAN_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "AWAITING_SPLIT_APPROVAL", "STEERING"].includes(state);
  if (filter === "running") return isRunningIssue(issue);
  if (filter === "failed") return state === "FAILED";
  if (filter === "watching-pr") return ["WATCHING_PR", "CREATING_PR", "IN_MERGE_QUEUE"].includes(state);
  if (filter === "paused") return ["PAUSED", "IGNORED"].includes(state);
  return true;
}

function timeValue(value?: string | null): number {
  const time = value ? parseTimestamp(value) : 0;
  return Number.isFinite(time) ? time : 0;
}

function sortQueueIssues(issues: Issue[], sort: QueueSort): Issue[] {
  const next = [...issues];
  if (sort === "newest") return next.sort((a, b) => timeValue(b.created_at ?? b.updated_at) - timeValue(a.created_at ?? a.updated_at));
  if (sort === "oldest") return next.sort((a, b) => timeValue(a.created_at ?? a.updated_at) - timeValue(b.created_at ?? b.updated_at));
  if (sort === "recently-updated") return next.sort((a, b) => timeValue(b.updated_at) - timeValue(a.updated_at));
  return next.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99) || timeValue(b.updated_at) - timeValue(a.updated_at));
}

function sortIssuesByProcessStage(issues: Issue[], stageKey?: PipelineStageKey): Issue[] {
  if (stageKey === "awaiting") {
    return [...issues].sort((a, b) => timeValue(b.updated_at ?? b.created_at) - timeValue(a.updated_at ?? a.created_at));
  }
  const stageStates = PIPELINE_STAGES.find((stage) => stage.key === stageKey)?.states ?? [];
  const rank = (issue: Issue) => {
    const state = issue.state ?? "";
    // Failed issues always surface at the top of whatever column they're in.
    if (state === "FAILED") return -1;
    const stageIndex = stageStates.indexOf(state);
    return stageIndex >= 0 ? stageIndex : STATE_PROCESS_ORDER[state] ?? 999;
  };
  return [...issues].sort((a, b) =>
    rank(a) - rank(b)
    || (a.priority ?? 99) - (b.priority ?? 99)
    || timeValue(b.updated_at) - timeValue(a.updated_at)
  );
}

function decisionWorkflowRank(decision: Decision, issues: Issue[]): number {
  const issue = issues.find((candidate) => candidate.id === decision.issue_id);
  if (issue?.state) return STATE_PROCESS_ORDER[issue.state] ?? 999;
  if (decision.type === "PLAN_REVIEW") return STATE_PROCESS_ORDER.AWAITING_PLAN_APPROVAL;
  if (decision.type === "SPLIT_APPROVAL") return STATE_PROCESS_ORDER.AWAITING_SPLIT_APPROVAL;
  if (decision.type === "CODE_REVIEW") return STATE_PROCESS_ORDER.AWAITING_CODE_REVIEW;
  if (decision.type === "FIX_APPROVAL") return STATE_PROCESS_ORDER.AWAITING_FIX_APPROVAL;
  return 999;
}

function sortDecisionsByWorkflow(decisions: Decision[], issues: Issue[]): Decision[] {
  return [...decisions].sort((a, b) => {
    const issueA = issues.find((issue) => issue.id === a.issue_id);
    const issueB = issues.find((issue) => issue.id === b.issue_id);
    return decisionWorkflowRank(a, issues) - decisionWorkflowRank(b, issues)
      || (issueA?.priority ?? 99) - (issueB?.priority ?? 99)
      || a.id - b.id;
  });
}

function selectReviewNextDecision(decisions: Decision[], issues: Issue[]): Decision | null {
  return sortDecisionsByWorkflow(decisions, issues)[0] ?? null;
}

function normalizeOverview(value: unknown): Overview {
  const data = (value ?? {}) as Partial<Overview> & { active?: Issue[]; awaitingDecisions?: Decision[] };
  return {
    issues: data.issues ?? data.active ?? [],
    decisions: data.decisions ?? data.awaitingDecisions ?? [],
    runningAgents: data.runningAgents ?? [],
    scheduler: data.scheduler,
    doneThisWeek: data.doneThisWeek,
    doneThisWeekCount: data.doneThisWeekCount,
    learningSuggestionsCount: data.learningSuggestionsCount,
    failedCount: data.failedCount,
    archiveCount: data.archiveCount,
  };
}

async function getJson<T>(url: string): Promise<T> {
  if (mockStatesEnabled()) {
    if (url === "/api/overview") return mockOverview() as T;
    if (url === "/api/settings") return { model: "mock-state-fixtures", concurrency_limit: "4", runtime_mode: "mock" } as T;
    if (url === "/api/desktop-capabilities") return { notifications: true } as T;
    if (url === "/api/archive") return [] as T;
    if (url === "/api/linear/issues") return [] as T;
    const diffMatch = url.match(/^\/api\/issues\/(\d+)\/diff$/);
    if (diffMatch?.[1]) return { baseBranch: "main", diff: `diff --git a/src/mock.ts b/src/mock.ts\n--- a/src/mock.ts\n+++ b/src/mock.ts\n@@ -1,3 +1,4 @@\n export function mockFeature() {\n-  return false;\n+  return true;\n }` } as T;
    const tourMatch = url.match(/^\/api\/issues\/(\d+)\/tour$/);
    if (tourMatch?.[1]) return { generating: false, created_at: mockTimestamp(1), tour: { summary: "AI tour: review behavior, error states, and API payload shape.", highlights: ["Diff sidecar stays issue-scoped", { title: "Decision payload", text: "Structured review feedback is sent to the agent", file: "src/mock.ts", line: 3 }], files: [{ path: "src/mock.ts", summary: "Mock review fixture", risk: "low" }] } } as T;
    const issueMatch = url.match(/^\/api\/issues\/(\d+)$/);
    if (issueMatch?.[1]) return mockIssueDetail(Number(issueMatch[1])) as T;
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  return (await response.json()) as T;
}

async function postJson<T>(url: string, body: unknown, method = "POST"): Promise<T> {
  if (mockStatesEnabled()) return { ok: true, mock: true, url, body, method } as T;
  const payload = JSON.stringify(body);
  let lastResponse: Response | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: payload,
    });
    if (response.ok) return (await response.json()) as T;
    lastResponse = response;
    if (![502, 503, 504].includes(response.status) || attempt === 2) break;
    await new Promise((resolve) => window.setTimeout(resolve, 300 * (attempt + 1)));
  }
  const errorText = await lastResponse?.text().catch(() => "");
  throw new Error(`Failed to mutate ${url}: ${lastResponse?.status ?? "unknown"}${errorText ? ` — ${errorText.slice(0, 200)}` : ""}`);
}

async function deleteJson<T>(url: string): Promise<T> {
  if (mockStatesEnabled()) return { ok: true, mock: true, url, method: "DELETE" } as T;
  const response = await fetch(url, { method: "DELETE" });
  if (!response.ok) throw new Error(`Failed to delete ${url}: ${response.status}`);
  return (await response.json()) as T;
}

function parseUnifiedDiff(diff: string): ReviewFile[] {
  if (!diff.trim()) return [];
  const files: ReviewFile[] = [];
  let current: ReviewFile | null = null;

  for (const line of diff.split("\n")) {
    const match = line.match(/^diff --git a\/(.+?) b\/(.+)$/);
    if (match) {
      current = { path: match[2] ?? match[1] ?? "unknown", additions: 0, deletions: 0, hunks: [] };
      files.push(current);
      continue;
    }
    if (!current) continue;
    if (line.startsWith("+") && !line.startsWith("+++")) current.additions += 1;
    if (line.startsWith("-") && !line.startsWith("---")) current.deletions += 1;
    current.hunks.push(line);
  }

  return files.length ? files : [{ path: "diff", additions: 0, deletions: 0, hunks: diff.split("\n") }];
}

function resolveDecisionAction(decisionId: number, verdict: DecisionVerdict, feedback?: unknown) {
  return postJson<{ ok: boolean; nextState?: string }>(`/api/decisions/${decisionId}/resolve`, { verdict, feedback });
}

function runIssueAction(issueId: number, action: IssueAction, payload: Record<string, unknown> = {}) {
  return postJson<{ ok: boolean }>(`/api/issues/${issueId}`, { action, ...payload }, "PATCH");
}

function removeIssue(issueId: number) {
  return deleteJson<{ ok: boolean }>(`/api/issues/${issueId}`);
}

function launchIssueRuntime(issueId: number) {
  return postJson<{ ok: boolean; output?: string; error?: string; launchRef?: string }>(`/api/issues/${issueId}/vm-launch`, {});
}

function stopVmRuntime() {
  return postJson<{ ok: boolean; output?: string; error?: string }>("/api/vm/stop", {});
}

function syncIssuePrs(issueId: number) {
  return postJson<{ ok: boolean; synced?: unknown[] }>(`/api/issues/${issueId}/sync-prs`, {});
}

function submitIssueFeedback(issueId: number, body: string, prNumber?: number | null) {
  return postJson<{ ok: boolean }>(`/api/issues/${issueId}/feedback`, { body, prNumber: prNumber ?? null });
}

function createManualIssue(title: string, description = "") {
  return postJson<{ ok: boolean; issueId?: number }>("/api/issues", { title, description });
}

function enqueueLinearIssueApi(linearId: string, planningGuidance = "") {
  return postJson<{ ok: boolean; issueId?: number }>("/api/linear/enqueue", { linearId, planningGuidance });
}

function loadDesktopCapabilities() {
  return getJson<DesktopCapabilities>("/api/desktop-capabilities");
}

function sendDesktopNotification(title: string, body: string, tag?: string) {
  return postJson<{ ok: boolean }>("/api/desktop-notify", { title, body, tag });
}

function browserNotificationsAvailable(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

function browserNotificationPermission(): NotificationPermission | "unsupported" {
  return browserNotificationsAvailable() ? window.Notification.permission : "unsupported";
}

async function notifyPendingDecisionOnce(decision: Decision, issue?: Issue, desktopNotificationsAvailable = false) {
  const title = decisionTypeLabel(decision) || "Forge decision needed";
  const body = issue?.title ? `${issue.title} needs your review` : "A Forge issue needs your review";
  const tag = `forge-decision-${decision.id}`;
  if (desktopNotificationsAvailable) {
    try {
      await sendDesktopNotification(title, body, tag);
      return;
    } catch {}
  }
  if (!browserNotificationsAvailable() || window.Notification.permission !== "granted") return;
  new window.Notification(title, { body, tag });
}

function shellStatusFromData(overview: Overview, settings: Settings): ShellStatus {
  const doneThisWeek = overview.doneThisWeek ?? [];
  const doneThisWeekCount = overview.doneThisWeekCount ?? (Array.isArray(doneThisWeek) ? doneThisWeek.length : Number(doneThisWeek || 0));

  return {
    scheduler: overview.scheduler?.running ? "running" : "stopped",
    activeCount: overview.issues.filter((issue) => !["DONE", "PAUSED", "IGNORED", "FAILED"].includes(issue.state ?? "")).length,
    awaitingDecisionsCount: overview.decisions.length,
    failedCount: overview.failedCount ?? overview.issues.filter((issue) => issue.state === "FAILED").length,
    doneThisWeekCount,
    learningSuggestionsCount: overview.learningSuggestionsCount ?? 0,
    archiveCount: overview.archiveCount ?? doneThisWeekCount,
    model: settings.model ?? settings.default_model ?? "—",
    backend: settings.backend_mode ?? settings.backend ?? "local",
    runningAgentsCount: overview.runningAgents.length,
    concurrencyLimit: Number(settings.concurrency_limit ?? 2) || 2,
  };
}

type DashboardRoute = {
  view: NavKey;
  issueId: number | null;
  decisionId: number | null;
  detailTab: DetailTab["key"];
  panel: "plan" | "diff" | "review" | "listen" | "jump" | null;
  diffPath: string;
  addIssue: boolean;
};

function numericRoutePart(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseDashboardRoute(hash = window.location.hash): DashboardRoute {
  const params = new URLSearchParams(window.location.search);
  const queryView = params.get("view") || undefined;
  const queryIssueId = numericRoutePart(params.get("issue") || undefined);
  const queryDecisionId = numericRoutePart(params.get("decision") || undefined);
  const tabParam = params.get("tab");
  const queryTab = tabParam === "activity" || tabParam === "ask" ? tabParam : "overview";
  const queryPanel = params.get("panel");
  const panel = queryPanel === "plan" || queryPanel === "diff" || queryPanel === "review" || queryPanel === "listen" || queryPanel === "jump" ? queryPanel : null;
  const queryViewKey = NAV_ITEMS.some((item) => item.key === queryView) ? queryView as NavKey : null;
  if (queryViewKey || queryIssueId || panel || params.has("add")) {
    return {
      view: queryViewKey ?? "queue",
      issueId: queryIssueId,
      decisionId: queryDecisionId,
      detailTab: queryTab,
      panel,
      diffPath: params.get("diffPath") ?? "",
      addIssue: params.get("add") === "issue",
    };
  }

  const route = hash.replace(/^#/, "").split("/").filter(Boolean);
  const [viewOrEntity, maybeIssueId, maybeDecisionMarker, maybeDecisionId] = route;

  if (viewOrEntity === "issue") {
    return { view: "queue", issueId: numericRoutePart(maybeIssueId), decisionId: null, detailTab: "overview", panel: null, diffPath: "", addIssue: false };
  }

  if (viewOrEntity === "review") {
    return {
      view: "queue",
      issueId: numericRoutePart(maybeIssueId),
      decisionId: maybeDecisionMarker === "decision" ? numericRoutePart(maybeDecisionId) : null,
      detailTab: "overview",
      panel: "review",
      diffPath: "",
      addIssue: false,
    };
  }

  const navKey = NAV_ITEMS.some((item) => item.key === viewOrEntity) ? viewOrEntity as NavKey : "queue";
  return { view: navKey, issueId: null, decisionId: null, detailTab: "overview", panel: null, diffPath: "", addIssue: false };
}

function updateDashboardQuery(updates: Record<string, string | number | boolean | null | undefined>, replace = true): void {
  const url = new URL(window.location.href);
  url.hash = "";
  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === undefined || value === false || value === "") url.searchParams.delete(key);
    else url.searchParams.set(key, String(value));
  }
  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next === current) return;
  window.history[replace ? "replaceState" : "pushState"]({}, "", next);
}

// Legacy hash deep links used `issue/${ids.issueId}`; query params are now canonical.
function syncDashboardRoute(key: NavItem["key"], ids: { issueId?: number | null; decisionId?: number | null } = {}): void {
  updateDashboardQuery({ view: key, issue: key === "queue" ? ids.issueId : null, decision: ids.decisionId, panel: ids.decisionId ? "review" : null }, false);
}

function PageHeader({ icon, title, subtitle, actions }: { icon: string; title: string; subtitle: string; actions?: unknown }) {
  return h("header", { class: "forge-v3-page-header" },
    h("div", null,
      h("div", { class: "forge-v3-page-title" }, icon, " ", title),
      h("div", { class: "forge-v3-page-sub" }, subtitle)
    ),
    actions ? h("div", { class: "forge-v3-page-actions" }, actions as any) : null
  );
}

function PageFrame({ view, className = "", children }: { view: NavKey; className?: string; children?: unknown }) {
  return h("main", { class: `forge-v3-main forge-v3-view-scroll ${className}`, "data-active-view": view },
    h("div", { class: "forge-v3-page-wrap" }, children as any)
  );
}

type ForgePromptOptions = { title: string; message?: string; label?: string; initialValue?: string; placeholder?: string; confirmText?: string; danger?: boolean; requiredText?: string };

function showForgePrompt(options: ForgePromptOptions): Promise<string | null> {
  if (typeof document === "undefined") return Promise.resolve(null);
  return new Promise((resolve) => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    let value = options.initialValue ?? "";
    const close = (result: string | null) => {
      render(null, host);
      host.remove();
      resolve(result);
    };
    const submit = () => {
      if (options.requiredText && value !== options.requiredText) return close(null);
      close(value);
    };
    render(h("div", { class: "forge-v3-dialog-backdrop", role: "presentation", onMouseDown: (event: MouseEvent) => { if (event.target === event.currentTarget) close(null); } },
      h("section", { class: `forge-v3-dialog ${options.danger ? "danger" : ""}`, role: "dialog", "aria-modal": "true", "aria-label": options.title },
        h("header", { class: "forge-v3-dialog-head" }, h("h2", null, options.title), h("button", { type: "button", onClick: () => close(null), "aria-label": "Close dialog" }, "×")),
        options.message ? h("p", { class: "forge-v3-dialog-message" }, options.message) : null,
        h("label", { class: "forge-v3-dialog-field" },
          h("span", null, options.label ?? "Response"),
          h("textarea", { autoFocus: true, value, placeholder: options.placeholder, onInput: (event: InputEvent) => { value = (event.currentTarget as HTMLTextAreaElement).value; }, onKeyDown: (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") submit(); } })
        ),
        options.requiredText ? h("p", { class: "forge-v3-dialog-hint" }, "Required confirmation text: ", h("code", null, options.requiredText)) : null,
        h("footer", { class: "forge-v3-dialog-actions" },
          h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => close(null) }, "Cancel"),
          h("button", { type: "button", class: `forge-v3-da ${options.danger ? "forge-v3-da-danger" : "forge-v3-da-primary"}`, onClick: submit }, options.confirmText ?? "Submit")
        )
      )
    ), host);
  });
}

function showForgeConfirm({ title, message, confirmText = "Confirm", danger = false }: { title: string; message?: string; confirmText?: string; danger?: boolean }): Promise<boolean> {
  if (typeof document === "undefined") return Promise.resolve(false);
  return new Promise((resolve) => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const close = (result: boolean) => {
      render(null, host);
      host.remove();
      resolve(result);
    };
    render(h("div", { class: "forge-v3-dialog-backdrop", role: "presentation", onMouseDown: (event: MouseEvent) => { if (event.target === event.currentTarget) close(false); } },
      h("section", { class: `forge-v3-dialog ${danger ? "danger" : ""}`, role: "dialog", "aria-modal": "true", "aria-label": title },
        h("header", { class: "forge-v3-dialog-head" }, h("h2", null, title), h("button", { type: "button", onClick: () => close(false), "aria-label": "Close dialog" }, "×")),
        message ? h("p", { class: "forge-v3-dialog-message" }, message) : null,
        h("footer", { class: "forge-v3-dialog-actions" },
          h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => close(false) }, "Cancel"),
          h("button", { type: "button", class: `forge-v3-da ${danger ? "forge-v3-da-danger" : "forge-v3-da-primary"}`, onClick: () => close(true) }, confirmText)
        )
      )
    ), host);
  });
}

function showForgeError({ title, message }: { title: string; message: string }): void {
  if (typeof document === "undefined") return;
  const host = document.createElement("div");
  document.body.appendChild(host);
  const close = () => { render(null, host); host.remove(); };
  render(h("div", { class: "forge-v3-dialog-backdrop", role: "presentation", onMouseDown: (event: MouseEvent) => { if (event.target === event.currentTarget) close(); } },
    h("section", { class: "forge-v3-dialog danger", role: "alertdialog", "aria-modal": "true", "aria-label": title },
      h("header", { class: "forge-v3-dialog-head" }, h("h2", null, title), h("button", { type: "button", onClick: close, "aria-label": "Close dialog" }, "×")),
      h("p", { class: "forge-v3-dialog-message" }, message),
      h("footer", { class: "forge-v3-dialog-actions" },
        h("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", onClick: close }, "Dismiss")
      )
    )
  ), host);
}

function stageIcon(stage: PipelineStageKey): string {
  return ({ available: "○", active: "▣", awaiting: "⚡" } satisfies Record<PipelineStageKey, string>)[stage];
}

function BacklogCard({ issue, onEnqueue }: { issue: LinearBacklogIssue; onEnqueue: (linearId: string, planningGuidance?: string) => void }) {
  const requestEnqueue = async () => {
    const planningGuidance = (await showForgePrompt({ title: `Enqueue ${issue.identifier}`, message: "Add optional planning guidance before Forge creates the plan.", label: "Planning guidance", confirmText: "Enqueue" }))?.trim() ?? "";
    onEnqueue(issue.identifier, planningGuidance);
  };
  return h("article", { class: "forge-v3-backlog-card", "data-linear-id": issue.identifier },
    h("div", { class: "forge-v3-backlog-body" },
      h("div", { class: "forge-v3-backlog-title" }, issue.title ?? "Untitled Linear issue"),
      h("div", { class: "forge-v3-backlog-meta" },
        h("span", null, issue.identifier),
        h("span", null, "·"),
        h("span", { class: `forge-v3-priority-meta ${priorityClass(issue.priority)}` }, priorityGlyph(issue.priority), " ", priorityLabel(issue.priority))
      )
    ),
    h("button", { type: "button", onClick: requestEnqueue }, "Enqueue →")
  );
}

function IssueCardInner({ issue, selected, onOpenIssue, onIssueAction, onReviewIssue }: { issue: Issue; selected: boolean; onOpenIssue: (issueId: number) => void; onIssueAction: (issueId: number, action: IssueAction) => void; onReviewIssue: (issueId: number) => void }) {
  const progress = issueProgress(issue);
  const stage = classifyIssueToPipelineStage(issue);
  const isAvailable = stage === "available";
  const isRunning = isRunningIssue(issue);
  const issueAction = issue.state === "PAUSED" ? "unpause" : issue.state === "FAILED" ? "retry" : "pause";
  const issueActionLabel = issueAction === "unpause" ? "Resume" : issueAction === "retry" ? "Retry" : "Pause";
  const runtimeBadges = issueRuntimeBadges(issue);
  const prBadges = prMetadataBadges(issue);
  return h(
    "article",
    { class: `forge-v3-issue-card ${selected ? "selected" : ""} ${isPrApproved(issue) ? "pr-approved" : ""} ${(issue.prStack ?? []).some((pr) => pr.isInMergeQueue) ? "in-merge-queue" : ""} state-${issue.state ?? "unknown"} stage-${stage}`, "data-issue-id": String(issue.id), tabIndex: 0, "aria-label": `Open issue ${issue.linear_id ?? issue.id}`, onPointerDown: (event: PointerEvent) => { if ((event.target as HTMLElement).closest("button,a,input,select,textarea")) return; onOpenIssue(issue.id); }, onKeyDown: (event: KeyboardEvent) => { if (event.key === "Enter" || event.key === " ") onOpenIssue(issue.id); } },
    h("div", { class: "forge-v3-ic-hover", "aria-hidden": "true" },
      isAvailable
        ? h("button", { class: "forge-v3-hact", type: "button", onClick: (event: Event) => { event.stopPropagation(); onIssueAction(issue.id, "ignore"); } }, "Ignore")
        : issue.state === "AWAITING_PLAN_APPROVAL"
          ? [
              h("button", { class: "forge-v3-hact", type: "button", onClick: (event: Event) => { event.stopPropagation(); onOpenIssue(issue.id); } }, "View plan"),
              h("button", { class: "forge-v3-hact", type: "button", onClick: (event: Event) => { event.stopPropagation(); onOpenIssue(issue.id); } }, "Approve")
            ]
          : issue.state === "AWAITING_CODE_REVIEW"
            ? [
                h("button", { class: "forge-v3-hact", type: "button", onClick: (event: Event) => { event.stopPropagation(); onReviewIssue(issue.id); } }, "View diff"),
                h("button", { class: "forge-v3-hact", type: "button", onClick: (event: Event) => { event.stopPropagation(); onOpenIssue(issue.id); } }, "Approve")
              ]
            : issue.state === "FAILED"
              ? [
                  h("button", { class: "forge-v3-hact", type: "button", onClick: (event: Event) => { event.stopPropagation(); onIssueAction(issue.id, "retry"); } }, "↺ Retry"),
                  h("button", { class: "forge-v3-hact", type: "button", onClick: (event: Event) => { event.stopPropagation(); onOpenIssue(issue.id); } }, "Log")
                ]
              : issue.state === "PAUSED"
                ? h("button", { class: "forge-v3-hact", type: "button", onClick: (event: Event) => { event.stopPropagation(); onIssueAction(issue.id, "unpause"); } }, "▶ Resume")
                : isRunning
                  ? [
                      issue.state === "WORKING" ? h("button", { class: "forge-v3-hact", type: "button", onClick: (event: Event) => { event.stopPropagation(); onOpenIssue(issue.id); } }, "Listen live") : null,
                      h("button", { class: "forge-v3-hact", type: "button", onClick: (event: Event) => { event.stopPropagation(); onOpenIssue(issue.id); } }, "Steer"),
                      h("button", { class: "forge-v3-hact", type: "button", onClick: (event: Event) => { event.stopPropagation(); onIssueAction(issue.id, "pause"); } }, "Pause")
                    ]
                  : [
                      h("button", { class: "forge-v3-hact", type: "button", onClick: (event: Event) => { event.stopPropagation(); onOpenIssue(issue.id); } }, issue.state === "WATCHING_PR" ? "View PR" : "Open"),
                      h("button", { class: "forge-v3-hact", type: "button", onClick: (event: Event) => { event.stopPropagation(); onReviewIssue(issue.id); } }, issue.state === "WATCHING_PR" ? "Add feedback" : "Diff")
                    ]
    ),
    h("div", { class: "forge-v3-ic-body" },
    h("div", { class: "forge-v3-issue-topline" },
      h("span", { class: "forge-v3-issue-keyline" },
        h("span", { class: "forge-v3-issue-id" }, issue.linear_id ?? `#${issue.id}`),
        h("span", { class: `forge-v3-priority-glyph ${priorityClass(issue.priority)}`, "aria-label": `Priority ${priorityLabel(issue.priority)}` }, priorityGlyph(issue.priority))
      )
    ),
    h("h3", null, issue.title ?? "Untitled issue"),
    isIssueMergedPendingArchive(issue) ? h("div", { class: "forge-v3-approved-banner" }, h("span", null, "✓"), h("strong", null, "Merged"), h("small", null, "finalizing")) : (issue.prStack ?? []).some((pr) => pr.isInMergeQueue) ? h("div", { class: "forge-v3-merge-queue-banner" }, h("span", null, "⇄"), h("strong", null, "Merge queue"), h("small", null, "waiting to merge")) : isPrApproved(issue) && ["WATCHING_PR", "IN_MERGE_QUEUE"].includes(issue.state ?? "") ? h("div", { class: "forge-v3-approved-banner" }, h("span", null, "✓"), h("strong", null, "Approved"), h("small", null, issue.pr_approved_at ? `${timeAgoShort(issue.pr_approved_at)} ago` : "watching merge")) : null,
    h("div", { class: "forge-v3-issue-state-row" },
      isRunning ? h("span", { class: "forge-v3-spinner", "aria-hidden": "true" }) : null,
      h("span", { class: issueStatePillClass(issue) }, issueStateLabel(issue)),
      runtimeBadges.map((badge) => h("span", { class: badge.className }, badge.label))
    ),
    isAvailable
      ? h("div", { class: "forge-v3-ic-meta" }, issueMetaText(issue))
      : [
          h("p", { class: "forge-v3-activity-snippet" }, issueActivitySnippet(issue)),
          h("div", { class: "forge-v3-ic-meta" }, issueMetaText(issue), isIssueStuck(issue) ? h("span", { class: "forge-v3-long-meta" }, "⚠ long") : null)
        ],
    !isAvailable && prBadges.length ? h("div", { class: "forge-v3-pr-metadata" }, prBadges.map((badge) => h("span", { class: badge.className }, badge.label))) : null,
    ),
    h("div", { class: "forge-v3-ic-progress forge-v3-issue-progress", "aria-hidden": "true" }, h("span", { class: "forge-v3-ic-fill", style: { width: `${progress}%` } })),
    h("div", { class: "forge-v3-issue-actions" },
      h("button", { type: "button", onClick: (event: Event) => { event.stopPropagation(); onOpenIssue(issue.id); } }, "Open"),
      h("button", { type: "button", onClick: (event: Event) => { event.stopPropagation(); onOpenIssue(issue.id); } }, "Open plan"),
      h("button", { type: "button", onClick: (event: Event) => { event.stopPropagation(); onReviewIssue(issue.id); } }, "Review diff"),
      h("button", { type: "button", onClick: (event: Event) => { event.stopPropagation(); onIssueAction(issue.id, issueAction); } }, issueActionLabel)
    )
  );
}

const IssueCard = memo(IssueCardInner, (prev, next) => prev.issue === next.issue && prev.selected === next.selected);

function DecisionInbox({ decisions, issues, onResolveDecision, onReviewDecision }: { decisions: Decision[]; issues: Issue[]; onResolveDecision: (decisionId: number, verdict: DecisionVerdict, feedback?: unknown) => void; onReviewDecision: (issueId: number, decisionId: number) => void }) {
  const orderedDecisions = sortDecisionsByWorkflow(decisions, issues);
  return h(
    "section",
    { id: "decisions-inbox", class: `forge-v3-decision-inbox ${decisions.length === 0 ? "is-empty" : ""}`, "aria-label": "Decision inbox" },
    h("div", { class: "forge-v3-section-heading" },
      h("span", { class: "forge-v3-inbox-flash", "aria-hidden": "true" }),
      h("h2", null, decisions.length, " decisions need your attention"),
      h("span", { class: "forge-v3-inbox-title" }, decisions.length ? "— Forge is paused on these issues until reviewed" : "review queue")
    ),
    h("div", { class: "forge-v3-decision-row" },
      orderedDecisions.length === 0
        ? h("article", { class: "forge-v3-decision-card forge-v3-decision-empty" }, h("strong", null, "No decisions need your attention"), h("span", { class: "forge-v3-decision-title" }, "Forge will pause here when plan, code, fix, or split approvals are ready."))
        : orderedDecisions.map((decision) =>
            h("article", { key: decision.id, class: `forge-v3-decision-card ${decisionTypeClass(decision)}`, "data-decision-id": String(decision.id) },
              h("strong", null, h("span", { class: "forge-v3-cmd-item-icon", "aria-hidden": "true" }, decisionIcon(decision)), decisionTypeLabel(decision)),
              h("span", { class: "forge-v3-decision-title" }, decision.issueTitle ?? `Issue #${decision.issue_id}`),
              h("div", { class: "forge-v3-decision-actions" },
                h("button", { type: "button", onClick: () => onReviewDecision(decision.issue_id, decision.id) }, decisionPrimaryActionLabel(decision)),
                h("button", { type: "button", class: "ok", onClick: () => onResolveDecision(decision.id, "approved") }, "✓ Approve"),
                h("button", { type: "button", class: "bad", onClick: () => onResolveDecision(decision.id, "rejected", { reason: "Requested from dashboard v3" }) }, "✕ Reject")
              )
            )
          )
    )
  );
}

function RuntimeDock({ status, onStopVm }: { status: ShellStatus; onStopVm: () => void }) {
  return h("aside", { class: "forge-v3-runtime-dock", "aria-label": "Runtime dock" },
    h("strong", null, "Runtime"),
    h("span", { class: "forge-v3-runtime-badge" }, "Backend", ": ", status.backend),
    h("span", { class: `forge-v3-runtime-badge scheduler-${status.scheduler}` }, "Scheduler", ": ", status.scheduler),
    h("span", { class: "forge-v3-runtime-badge" }, status.runningAgentsCount, " / ", status.concurrencyLimit, " agent slots"),
    h("button", { type: "button", class: "forge-v3-runtime-stop", onClick: onStopVm }, "Stop VM")
  );
}

function CommandPalette({ open, decisions, onClose, onNavigate, onRefresh, onOpenIssue, onReviewNext, onAddIssue, onStopVm }: { open: boolean; decisions: Decision[]; onClose: () => void; onNavigate: (view: NavKey) => void; onRefresh: () => void; onOpenIssue: (issueId: number) => void; onReviewNext: () => void; onAddIssue: () => void; onStopVm: () => void }) {
  if (!open) return null;
  const decisionCommands: CommandItem[] = decisions.map((decision) => ({ label: `Decision: ${decision.type ?? "Review"} #${decision.id}`, action: () => { onNavigate("queue"); onOpenIssue(decision.issue_id); } }));
  const commands: CommandItem[] = [
    ...decisionCommands,
    { label: "Review next", action: onReviewNext, disabled: decisions.length === 0 },
    { label: "Open queue", action: () => onNavigate("queue") },
    { label: "Open archive", action: () => onNavigate("archive") },
    { label: "Open settings", action: () => onNavigate("settings") },
    { label: "Open prompts", action: () => onNavigate("prompts") },
    { label: "Open learnings", action: () => onNavigate("learnings") },
    { label: "Refresh dashboard", action: onRefresh },
    { label: "Stop VM runtime", action: onStopVm },
    { label: "Sync Linear backlog", action: () => onNavigate("queue") },
    { label: "Add issue", action: onAddIssue },
    { label: "Pause scheduler (use /forge stop)", action: () => onNavigate("settings"), disabled: true },
  ];

  return h("div", { class: "forge-v3-command-palette", role: "dialog", "aria-modal": "true", "aria-label": "Command palette" },
    h("div", { class: "forge-v3-command-panel" },
      h("header", null, h("strong", null, "Command palette"), h("button", { type: "button", onClick: onClose }, "Close")),
      h("div", { class: "forge-v3-command-list" },
        commands.map((command) => h("button", { type: "button", disabled: command.disabled, onClick: () => { if (command.disabled) return; command.action(); onClose(); } }, command.label))
      )
    )
  );
}

function QueuePipelineView({ issues, decisions, linearBacklog, selectedIssueId, addIssueOpen, onOpenIssue, onIssueAction, onResolveDecision, onReviewNext, onReviewIssue, onAddIssue, onCloseAddIssue, onRefreshLinear, onCreateManualIssue, onEnqueueLinear }: { issues: Issue[]; decisions: Decision[]; linearBacklog: LinearBacklogIssue[]; selectedIssueId: number | null; addIssueOpen: boolean; onOpenIssue: (issueId: number) => void; onIssueAction: (issueId: number, action: IssueAction) => void; onResolveDecision: (decisionId: number, verdict: DecisionVerdict, feedback?: unknown) => void; onReviewNext: () => void; onReviewIssue: (issueId: number, decisionId?: number) => void; onAddIssue: () => void; onCloseAddIssue: () => void; onRefreshLinear: () => void; onCreateManualIssue: (title: string, description?: string) => void; onEnqueueLinear: (linearId: string, planningGuidance?: string) => void }) {
  const [queueSearch, setQueueSearch] = useState("");
  const [queueFilter, setQueueFilter] = useState<QueueFilter>("all");
  const [queueSort, setQueueSort] = useState<QueueSort>("priority");
  const [addMode, setAddMode] = useState<"manual" | "linear">("linear");
  const [manualTitle, setManualTitle] = useState("");
  const [manualDescription, setManualDescription] = useState("");
  const [linearId, setLinearId] = useState("");
  const [planningGuidance, setPlanningGuidance] = useState("");
  const visibleIssues = useMemo(() => sortQueueIssues(
    issues.filter((issue) => isQueueIssue(issue) && issueMatchesQueueSearch(issue, queueSearch) && issueMatchesQueueFilter(issue, queueFilter)),
    queueSort
  ), [issues, queueSearch, queueFilter, queueSort]);
  const grouped = useMemo(() => {
    const next = new Map<PipelineStageKey, Issue[]>();
    PIPELINE_STAGES.forEach((stage) => next.set(stage.key, []));
    visibleIssues.forEach((issue) => next.get(classifyIssueToPipelineStage(issue))?.push(issue));
    next.forEach((stageIssues, stage) => next.set(stage, sortIssuesByProcessStage(stageIssues, stage)));
    return next;
  }, [visibleIssues]);
  const visibleBacklog = useMemo(() => linearBacklog.filter((issue) => backlogMatchesQueueSearch(issue, queueSearch)).slice(0, 12), [linearBacklog, queueSearch]);
  const mockMode = mockStatesEnabled();
  const submitManualIssue = () => {
    const title = manualTitle.trim();
    if (!title) return;
    onCreateManualIssue(title, manualDescription.trim());
    setManualTitle("");
    setManualDescription("");
    onCloseAddIssue();
  };
  const submitLinearIssue = () => {
    const id = linearId.trim();
    if (!id) return;
    onEnqueueLinear(id, planningGuidance.trim());
    setLinearId("");
    setPlanningGuidance("");
    onCloseAddIssue();
  };

  return h(PageFrame, { view: "queue", className: `forge-v3-queue-shell ${selectedIssueId ? "forge-v3-has-detail" : ""}` }, [
    mockMode ? h("div", { class: "forge-v3-mock-state-banner" }, h("strong", null, "Mock state fixtures enabled"), h("span", null, "Review every Forge state without touching real issues."), h("button", { type: "button", onClick: disableMockStatesForSession }, "Exit mock data")) : null,
    h("section", { id: "queue-toolbar", class: "forge-v3-command-center", "aria-label": "Queue toolbar" },
      h("div", { class: "forge-v3-toolbar-actions forge-v3-left-tools" },
        h("input", { type: "search", placeholder: "Search issues, IDs, branch", "aria-label": "Search issues", value: queueSearch, onInput: (event: Event) => setQueueSearch((event.target as HTMLInputElement).value) }),
        h("div", { class: "forge-v3-filter-chips", "aria-label": "Queue filters" },
          QUEUE_FILTERS.map((filter) => h("button", { key: filter.key, type: "button", class: queueFilter === filter.key ? "active" : "", onClick: () => setQueueFilter(filter.key) }, filter.label))
        )
      ),
      h("div", { class: "forge-v3-toolbar-actions" },
        h("select", { "aria-label": "Sort issues", value: queueSort, onChange: (event: Event) => setQueueSort((event.target as HTMLSelectElement).value as QueueSort) }, QUEUE_SORTS.map((sort) => h("option", { key: sort.key, value: sort.key }, sort.label))),
        h("button", { type: "button", disabled: decisions.length === 0, onClick: onReviewNext }, "⚡ Review next", decisions.length ? ` (${decisions.length})` : ""),
        h("button", { type: "button", title: "Refresh Linear", onClick: onRefreshLinear }, "↻ Sync"),
        h("button", { type: "button", disabled: true }, "⌘ Command"),
        mockMode ? null : h("button", { type: "button", onClick: enableMockStatesForSession }, "Mock states"),
        h("button", { type: "button", onClick: onAddIssue }, "+ Add issue")
      )
    ),
    addIssueOpen ? h("div", { class: "forge-v3-add-issue-backdrop", role: "dialog", "aria-modal": "true", "aria-label": "Add issue" },
      h("section", { class: "forge-v3-add-issue-modal" },
        h("header", null,
          h("div", null, h("div", { class: "forge-v3-issue-meta" }, "Queue"), h("h2", null, "Add issue")),
          h("button", { type: "button", onClick: onCloseAddIssue, "aria-label": "Close add issue" }, "×")
        ),
        h("nav", { class: "forge-v3-detail-tabs" },
          h("button", { type: "button", class: addMode === "linear" ? "active" : "", onClick: () => setAddMode("linear") }, "Linear issue"),
          h("button", { type: "button", class: addMode === "manual" ? "active" : "", onClick: () => setAddMode("manual") }, "Manual issue")
        ),
        h("div", { class: "forge-v3-add-issue-body" },
          addMode === "linear" ? [
            h("label", null, "Linear ID", h("input", { type: "text", placeholder: "TEAM-1234", value: linearId, onInput: (event: Event) => setLinearId((event.target as HTMLInputElement).value) })),
            h("label", null, "Planning guidance", h("textarea", { rows: 5, placeholder: "Optional notes for the planner…", value: planningGuidance, onInput: (event: Event) => setPlanningGuidance((event.target as HTMLTextAreaElement).value) }))
          ] : [
            h("label", null, "Title", h("input", { type: "text", placeholder: "Manual issue title", value: manualTitle, onInput: (event: Event) => setManualTitle((event.target as HTMLInputElement).value) })),
            h("label", null, "Description", h("textarea", { rows: 6, placeholder: "Optional issue description or project notes…", value: manualDescription, onInput: (event: Event) => setManualDescription((event.target as HTMLTextAreaElement).value) }))
          ]
        ),
        h("footer", null,
          h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: onCloseAddIssue }, "Cancel"),
          addMode === "linear"
            ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !linearId.trim(), onClick: submitLinearIssue }, "Enqueue Linear issue")
            : h("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !manualTitle.trim(), onClick: submitManualIssue }, "Create manual issue")
        )
      )
    ) : null,
    h("div", { class: "forge-v3-pipeline-wrap" },
      h("section", { id: "pipeline-wrapper", class: "forge-v3-pipeline", "aria-label": "Issue pipeline" },
        PIPELINE_STAGES.map((stage) => {
          const stageIssues = grouped.get(stage.key) ?? [];
          const stageCount = stage.key === "available" ? stageIssues.length + visibleBacklog.length : stageIssues.length;
          return h("section", { key: stage.key, class: "forge-v3-pipeline-column", "data-stage": stage.key },
            h("header", { class: `forge-v3-col-head ${stage.key === "awaiting" ? "needs-head" : ""}` },
              h("span", { class: `forge-v3-col-label ${stage.key === "awaiting" ? "needs" : ""}` }, stage.key === "available" ? stage.label : `${stageIcon(stage.key)} ${stage.label}`),
              stage.key === "available" ? h("button", { type: "button", class: "forge-v3-col-head-btn", onClick: onRefreshLinear }, "↻ Sync") : null,
              h("span", { class: `forge-v3-col-count ${stageCount && stage.key === "awaiting" ? "bad" : ""}` }, String(stageCount))
            ),
            h("div", { class: `forge-v3-col-cards forge-v3-pipeline-list ${stage.key === "available" ? "forge-v3-available-split" : ""}` },
              stage.key === "available"
                ? [
                    h("div", { class: "forge-v3-available-backlog" },
                      visibleBacklog.length
                        ? visibleBacklog.map((issue) => h(BacklogCard, { key: issue.identifier, issue, onEnqueue: onEnqueueLinear }))
                        : h("p", { class: "forge-v3-empty" }, queueSearch ? "No Linear issues match" : "No available Linear issues")
                    ),
                    h("div", { class: "forge-v3-col-sub forge-v3-available-divider" }, "Queued in Forge"),
                    h("div", { class: "forge-v3-available-queued" },
                      stageIssues.length
                        ? stageIssues.map((issue) => h(IssueCard, { key: issue.id, issue, selected: selectedIssueId === issue.id, onOpenIssue, onIssueAction, onReviewIssue }))
                        : h("p", { class: "forge-v3-empty" }, queueSearch || queueFilter !== "all" ? "No queued issues match" : "No queued issues")
                    )
                  ]
                : stageIssues.length === 0
                  ? h("p", { class: "forge-v3-empty" }, queueSearch || queueFilter !== "all" ? "No issues match the active filters" : "No issues")
                  : stageIssues.map((issue) => h(IssueCard, { key: issue.id, issue, selected: selectedIssueId === issue.id, onOpenIssue, onIssueAction, onReviewIssue }))
            )
          );
        })
      )
    )
  ]);
}

function inputTypeForSetting(key: string): "number" | "checkbox" | "text" {
  if (key.includes("limit") || key.includes("seconds") || key.includes("rounds") || key.endsWith("_max") || key === "dashboard_port") return "number";
  if (key.startsWith("enable_") || key.startsWith("use_") || key.endsWith("_enabled") || key.includes("reuse")) return "checkbox";
  return "text";
}

function settingLabel(key: string): string {
  return SETTING_LABELS[key]?.label ?? key;
}

function settingDescription(key: string): string {
  const hint = SETTING_LABELS[key]?.hint;
  return hint ? `${hint} · DB key: ${key}` : `Unrecognized setting · DB key: ${key}`;
}

function settingEntriesForGroup(settings: Settings, group: SettingGroup): SettingEntry[] {
  return group.keys
    .filter((key) => Object.prototype.hasOwnProperty.call(settings, key))
    .map((key) => ({ key, value: settings[key] ?? "" }));
}

function normalizeSettingValue(key: string, value: string): string {
  if (BOOLEAN_SETTING_KEYS.has(key)) return value === "true" ? "true" : "false";
  return value;
}

function changedSettingsPayload(savedSettings: Settings, draftSettings: Settings, allowUnknownSettings: boolean): Settings {
  return Object.fromEntries(Object.entries(draftSettings)
    .filter(([key]) => allowUnknownSettings || KNOWN_SETTING_KEYS.has(key))
    .map(([key, value]) => [key, normalizeSettingValue(key, value ?? "")])
    .filter(([key, value]) => normalizeSettingValue(String(key), savedSettings[String(key)] ?? "") !== value)) as Settings;
}

function validateSettingsDraft(draftSettings: Settings, allowUnknownSettings: boolean): string[] {
  const errors: string[] = [];
  Object.entries(draftSettings).forEach(([key, value]) => {
    if (!allowUnknownSettings && !KNOWN_SETTING_KEYS.has(key)) return;
    if (!NUMBER_SETTING_KEYS.has(key)) return;
    const trimmed = String(value ?? "").trim();
    if (!trimmed || !Number.isFinite(Number(trimmed)) || Number(trimmed) < 0) {
      errors.push(`${settingLabel(key)} must be a non-negative number.`);
    }
  });
  return errors;
}

function SettingsView() {
  const [savedSettings, setSavedSettings] = useState<Settings>({});
  const [draftSettings, setDraftSettings] = useState<Settings>({});
  const [desktopBackend, setDesktopBackend] = useState<DesktopBackend | null>(null);
  const [desktopBackendDraft, setDesktopBackendDraft] = useState("");
  const [desktopBackendStatus, setDesktopBackendStatus] = useState("");
  const [statusMessage, setStatusMessage] = useState("Loading settings…");
  const [settingsErrors, setSettingsErrors] = useState<string[]>([]);
  const [allowUnknownSettings, setAllowUnknownSettings] = useState(false);

  const loadDesktopBackend = () => {
    getJson<DesktopBackend>("/api/desktop-backend")
      .then((backend) => {
        setDesktopBackend(backend);
        setDesktopBackendDraft(backend.backendOrigin ?? "");
        setDesktopBackendStatus("");
      })
      .catch(() => {
        setDesktopBackend(null);
        setDesktopBackendStatus("Desktop backend switching is available in the Forge desktop app.");
      });
  };

  useEffect(() => {
    let cancelled = false;
    getJson<Settings>("/api/settings")
      .then((settings) => {
        if (cancelled) return;
        setSavedSettings(settings);
        setDraftSettings(settings);
        setSettingsErrors([]);
        setStatusMessage("");
      })
      .catch(() => { if (!cancelled) setStatusMessage("Unable to load settings"); });
    loadDesktopBackend();
    return () => { cancelled = true; };
  }, []);

  const updateSetting = (key: string, value: string) => {
    setDraftSettings((previous) => ({ ...previous, [key]: normalizeSettingValue(key, value) }));
    setSettingsErrors((errors) => errors.filter((error) => !error.includes(settingLabel(key))));
  };
  const saveDesktopBackend = () => {
    setDesktopBackendStatus("Saving backend…");
    fetch("/api/desktop-backend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ backendOrigin: desktopBackendDraft }),
    })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("backend failed")))
      .then((payload: DesktopBackend) => {
        setDesktopBackend(payload);
        setDesktopBackendDraft(payload.backendOrigin ?? desktopBackendDraft);
        setDesktopBackendStatus("Backend saved. Refresh if the dashboard did not reconnect automatically.");
      })
      .catch(() => setDesktopBackendStatus("Unable to save desktop backend"));
  };
  const saveSettings = () => {
    const validationErrors = validateSettingsDraft(draftSettings, allowUnknownSettings);
    if (validationErrors.length) {
      setSettingsErrors(validationErrors);
      setStatusMessage("Fix validation errors before saving");
      return;
    }
    const updates = changedSettingsPayload(savedSettings, draftSettings, allowUnknownSettings);
    if (Object.keys(updates).length === 0) {
      setStatusMessage("No settings changed");
      return;
    }
    setStatusMessage(`Saving ${Object.keys(updates).length} changed setting${Object.keys(updates).length === 1 ? "" : "s"}…`);
    fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
      .then((response) => response.json().then((payload) => response.ok ? payload : Promise.reject(new Error(payload?.error ?? "Unable to save settings"))))
      .then((payload: { settings?: Settings }) => {
        const nextSettings = payload.settings ?? { ...savedSettings, ...updates };
        setSavedSettings(nextSettings);
        setDraftSettings(nextSettings);
        setSettingsErrors([]);
        setStatusMessage("Settings saved");
      })
      .catch((error: Error) => setStatusMessage(error.message || "Unable to save settings"));
  };
  const resetSettings = () => {
    setDraftSettings(savedSettings);
    setSettingsErrors([]);
    setStatusMessage("Reset changes");
  };
  const unknownSettings = Object.entries(draftSettings)
    .filter(([key]) => !KNOWN_SETTING_KEYS.has(key))
    .map(([key, value]) => ({ key, value: value ?? "" }));
  const changedSettings = changedSettingsPayload(savedSettings, draftSettings, allowUnknownSettings);
  const changedSettingsCount = Object.keys(changedSettings).length;
  const groupsWithOther = [...SETTING_GROUPS, { label: "Other" as const, keys: [] }];

  const renderSettingControl = (setting: SettingEntry, disabled = false) => {
    if (setting.key.includes("context") || setting.key.includes("prompt") || setting.key.includes("command")) {
      return h("textarea", { class: "forge-v3-setting-control", value: setting.value, rows: setting.key === "project_prompt_overlay" ? 8 : 3, placeholder: SETTING_PLACEHOLDERS[setting.key], disabled, readOnly: disabled, onInput: (event: Event) => updateSetting(setting.key, (event.target as HTMLTextAreaElement).value) });
    }
    const inputType = inputTypeForSetting(setting.key);
    return h("input", { class: "forge-v3-setting-control", type: inputTypeForSetting(setting.key), checked: inputType === "checkbox" ? setting.value === "true" : undefined, value: inputType === "checkbox" ? undefined : setting.value, placeholder: SETTING_PLACEHOLDERS[setting.key], disabled, readOnly: disabled, min: inputType === "number" ? "0" : undefined, onInput: (event: Event) => {
      const input = event.target as HTMLInputElement;
      updateSetting(setting.key, inputType === "checkbox" ? String(input.checked) : input.value);
    } });
  };

  const renderDesktopBackendRow = () => h("div", { key: "desktop-backend-origin", class: "forge-v3-setting-row forge-v3-desktop-backend-row" },
    h("span", null, "Desktop backend origin"),
    h("small", null, desktopBackendStatus || (desktopBackend?.configFile ? `Stored in ${desktopBackend.configFile}` : "All v3 dashboard reads and writes go through this backend.")),
    h("div", { class: "forge-v3-toolbar-actions" },
      h("input", { class: "forge-v3-setting-control", type: "url", value: desktopBackendDraft, placeholder: "http://127.0.0.1:3142", disabled: !desktopBackend, onInput: (event: Event) => setDesktopBackendDraft((event.target as HTMLInputElement).value) }),
      h("button", { type: "button", disabled: !desktopBackend, onClick: saveDesktopBackend }, "Use backend"),
      h("a", { class: "forge-v3-btn-primary", href: "/desktop/backend" }, "Switch page")
    )
  );

  return h(PageFrame, { view: "settings", className: "forge-v3-settings-wrap" }, [
    h(PageHeader, { icon: "⚙️", title: "Settings", subtitle: "Configure Forge scheduler, models, integrations, and repository", actions: h("div", { class: "forge-v3-toolbar-actions" },
      h("a", { class: "forge-v3-btn-primary", href: "/classic.html" }, "Open classic v2"),
      h("button", { type: "button", onClick: resetSettings }, "↺ Reset changes")
    ) }),
    statusMessage ? h("p", { class: `forge-v3-empty ${settingsErrors.length ? "forge-v3-settings-error" : ""}` }, statusMessage) : null,
    settingsErrors.length ? h("ul", { class: "forge-v3-settings-errors" }, settingsErrors.map((error) => h("li", { key: error }, error))) : null,
    h("p", { class: "forge-v3-settings-helper" }, changedSettingsCount ? `${changedSettingsCount} changed setting${changedSettingsCount === 1 ? "" : "s"} will be saved.` : "Only settings you change will be sent on save."),
    h("section", { class: "forge-v3-settings-grid", "aria-label": "Settings groups" },
      groupsWithOther.map((group) => {
        const settings = group.label === "Other" ? unknownSettings : settingEntriesForGroup(draftSettings, group);
        const rows = [
          ...(group.label === "Dashboard Backend" ? [renderDesktopBackendRow()] : []),
          ...settings.map((setting) => {
            const isUnknown = group.label === "Other";
            const isRuntime = RUNTIME_SETTING_KEYS.has(setting.key);
            return h("label", { key: setting.key, class: `forge-v3-setting-row ${isUnknown ? "forge-v3-setting-unknown" : ""} ${isRuntime ? "forge-v3-setting-runtime" : ""}` },
              h("span", null, settingLabel(setting.key), isUnknown && !allowUnknownSettings ? h("em", null, " read-only") : null),
              h("small", null, isRuntime ? `${settingDescription(setting.key)} · Runtime/backend changes may require reconnecting the dashboard or restarting agents.` : settingDescription(setting.key)),
              renderSettingControl(setting, isUnknown && !allowUnknownSettings)
            );
          }),
        ];
        return h("section", { key: group.label, class: "forge-v3-settings-card forge-v3-settings-group" },
          h("header", null,
            h("div", null, h("h2", null, group.label), h("p", null, SETTING_GROUP_DESCRIPTIONS[group.label])),
            group.label === "Other" ? h("label", { class: "forge-v3-other-unlock" }, h("input", { type: "checkbox", checked: allowUnknownSettings, onInput: (event: Event) => setAllowUnknownSettings((event.target as HTMLInputElement).checked) }), " Edit unknown") : h("span", null, String(rows.length))
          ),
          rows.length === 0
            ? h("p", { class: "forge-v3-empty" }, "No settings in this group.")
            : rows
        );
      })
    ),
    h("div", { class: "forge-v3-settings-save-bar" },
      h("button", { type: "button", class: "forge-v3-btn-primary", disabled: changedSettingsCount === 0, onClick: saveSettings }, changedSettingsCount ? `Save ${changedSettingsCount} change${changedSettingsCount === 1 ? "" : "s"}` : "Save settings"),
      statusMessage === "Settings saved" ? h("span", { class: "forge-v3-saved-indicator" }, "✓ Saved") : null
    )
  ]);
}

function LearningsView() {
  const [activeLearningTab, setActiveLearningTab] = useState<LearningTabKey>("suggestions");
  const [learnings, setLearnings] = useState<LearningsPayload>({ suggestions: [], events: [], changes: [] });
  const [statusMessage, setStatusMessage] = useState("Loading learnings…");

  const refreshLearnings = () => {
    getJson<LearningsPayload>("/api/learnings")
      .then((payload) => {
        setLearnings({ suggestions: payload.suggestions ?? [], events: payload.events ?? [], changes: payload.changes ?? [] });
        setStatusMessage("");
      })
      .catch(() => setStatusMessage("Unable to load learnings"));
  };

  useEffect(() => {
    refreshLearnings();
    const interval = window.setInterval(refreshLearnings, 30000);
    const events = typeof EventSource !== "undefined" ? new EventSource("/api/events") : null;
    events?.addEventListener("message", (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (String(payload.type ?? "").startsWith("learning_")) refreshLearnings();
      } catch {}
    });
    return () => {
      window.clearInterval(interval);
      events?.close();
    };
  }, []);

  const resolveLearningSuggestion = (suggestionId: number, action: "applied" | "rejected") => {
    setLearnings((current) => ({ ...current, suggestions: current.suggestions.filter((suggestion) => suggestion.id !== suggestionId) }));
    fetch(`/api/learnings/${suggestionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    })
      .then((response) => response.ok ? refreshLearnings() : Promise.reject(new Error("resolve failed")))
      .catch(() => {
        setStatusMessage("Unable to resolve learning suggestion");
        refreshLearnings();
      });
  };

  return h(PageFrame, { view: "learnings", className: "forge-v3-learnings-wrap" }, [
    h(PageHeader, { icon: "🧠", title: "Learnings", subtitle: "Suggestions, reflection history, and prompt change log" }),
    h("nav", { class: "forge-v3-learning-tabs", "aria-label": "Learning tabs" },
      LEARNING_TABS.map((tab) => h("button", { key: tab.key, type: "button", class: activeLearningTab === tab.key ? "active" : "", onClick: () => setActiveLearningTab(tab.key) }, tab.label))
    ),
    statusMessage ? h("p", { class: "forge-v3-empty" }, statusMessage) : null,
    activeLearningTab === "suggestions" && h("section", { class: "forge-v3-learning-timeline", "aria-label": "Learning suggestions" },
      learnings.suggestions.length === 0
        ? h("p", { class: "forge-v3-empty" }, "No learning suggestions.")
        : learnings.suggestions.map((suggestion) => h("article", { key: suggestion.id, class: "forge-v3-learning-card" },
            h("div", { class: "forge-v3-learning-meta" }, suggestion.linear_id ?? `Issue #${suggestion.issue_id ?? "—"}`, " · ", suggestion.target ?? "target", " · Added ", suggestion.created_at ? `${timeAgoShort(suggestion.created_at)} ago (${formatDateTime(suggestion.created_at)})` : "date unknown"),
            h("h2", null, suggestion.suggestion ?? "Untitled suggestion"),
            h("p", null, suggestion.rationale ?? "No rationale provided."),
            h("div", { class: "forge-v3-toolbar-actions" },
              h("button", { type: "button", onClick: () => resolveLearningSuggestion(suggestion.id, "applied") }, "Apply suggestion"),
              h("button", { type: "button", onClick: () => resolveLearningSuggestion(suggestion.id, "rejected") }, "Reject suggestion")
            )
          ))
    ),
    activeLearningTab === "changes" && h("section", { class: "forge-v3-learning-timeline", "aria-label": "Learning change log" },
      learnings.changes.length === 0
        ? h("p", { class: "forge-v3-empty" }, "No learning changes yet.")
        : learnings.changes.map((change) => h("article", { key: change.id, class: "forge-v3-learning-card" },
            h("div", { class: "forge-v3-learning-meta" }, change.linear_id ?? "Global", " · ", change.target ?? "target", " · ", change.change_type ?? "change", " · ", change.created_at ? formatDateTime(change.created_at) : "date unknown"),
            h("h2", null, change.change_summary ?? "Learning change"),
            h("p", null, change.reason ?? "No reason recorded.")
          ))
    ),
    activeLearningTab === "reflections" && h("section", { class: "forge-v3-learning-timeline", "aria-label": "Reflection history" },
      learnings.events.length === 0
        ? h("p", { class: "forge-v3-empty" }, "No reflection history yet.")
        : learnings.events.map((event) => h("article", { key: event.id, class: "forge-v3-learning-card" },
            h("div", { class: "forge-v3-learning-meta" }, event.linear_id ?? "Global", " · ", event.event_type ?? "reflection", " · ", event.created_at ? formatDateTime(event.created_at) : "date unknown"),
            h("h2", null, event.summary ?? "Reflection event")
          ))
    )
  ]);
}

function AgentPromptsView() {
  const [prompts, setPrompts] = useState<Record<AgentPromptType, AgentPromptState>>(() => Object.fromEntries(
    AGENT_PROMPT_TYPES.map((type) => [type, { type, content: "", status: "Loading…" }])
  ) as Record<AgentPromptType, AgentPromptState>);
  const [modelSettings, setModelSettings] = useState<Settings>({});
  const [modelStatus, setModelStatus] = useState("Loading models…");

  const loadPrompt = (type: AgentPromptType) => {
    fetch(`/api/agents/${type}/prompt`)
      .then((response) => response.ok ? response.text() : Promise.reject(new Error("prompt failed")))
      .then((content) => setPrompts((previous) => ({ ...previous, [type]: { type, content, status: "Loaded" } })))
      .catch(() => setPrompts((previous) => ({ ...previous, [type]: { ...previous[type], status: "Unable to load prompt" } })));
  };

  const loadModelSettings = () => {
    getJson<Settings>("/api/settings")
      .then((settings) => {
        setModelSettings(settings);
        setModelStatus("Models loaded");
      })
      .catch(() => setModelStatus("Unable to load model settings"));
  };

  useEffect(() => {
    AGENT_PROMPT_TYPES.forEach(loadPrompt);
    loadModelSettings();
  }, []);

  const updatePrompt = (type: AgentPromptType, content: string) => setPrompts((previous) => ({ ...previous, [type]: { ...previous[type], content, status: "Unsaved" } }));
  const updateModelSetting = (key: string, value: string) => {
    setModelSettings((previous) => ({ ...previous, [key]: value }));
    setModelStatus("Unsaved model change");
  };
  const saveModelSetting = (key: string) => {
    setModelStatus("Saving model…");
    fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: modelSettings[key] ?? "" }),
    })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("save failed")))
      .then((payload: { settings?: Settings }) => {
        if (payload.settings) setModelSettings(payload.settings);
        setModelStatus("Model saved");
      })
      .catch(() => setModelStatus("Unable to save model"));
  };
  const savePrompt = (type: AgentPromptType) => {
    fetch(`/api/agents/${type}/prompt`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: prompts[type].content }),
    })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("save failed")))
      .then(() => setPrompts((previous) => ({ ...previous, [type]: { ...previous[type], status: "Saved" } })))
      .catch(() => setPrompts((previous) => ({ ...previous, [type]: { ...previous[type], status: "Unable to save prompt" } })));
  };
  const resetPrompt = (type: AgentPromptType) => {
    fetch(`/api/agents/${type}/prompt/default`)
      .then((response) => response.ok ? response.text() : Promise.reject(new Error("default failed")))
      .then((content) => setPrompts((previous) => ({ ...previous, [type]: { type, content, status: "Reset to default" } })))
      .catch(() => setPrompts((previous) => ({ ...previous, [type]: { ...previous[type], status: "Unable to reset prompt" } })));
  };

  const defaultModel = modelSettings.model ?? modelSettings.default_model ?? "";

  return h(PageFrame, { view: "prompts", className: "forge-v3-prompts-wrap" }, [
    h(PageHeader, { icon: "✎", title: "Agent Prompts", subtitle: "Edit each agent's prompt and model in one place" }),
    h("section", { class: "forge-v3-model-default-card", "aria-label": "Default model" },
      h("div", null,
        h("h2", null, "Default model"),
        h("p", { class: "forge-v3-prompt-meta" }, "Used by every agent unless an override is set on that agent. ", modelStatus)
      ),
      h("div", { class: "forge-v3-prompt-model-row" },
        h("input", { class: "forge-v3-prompt-model-input", value: defaultModel, placeholder: "anthropic-vertex/sonnet-4-6", onInput: (event: Event) => updateModelSetting("model", (event.target as HTMLInputElement).value) }),
        h("button", { type: "button", onClick: () => saveModelSetting("model") }, "Save default")
      )
    ),
    h("section", { class: "forge-v3-prompts-grid", "aria-label": "Agent prompt editors" },
      AGENT_PROMPT_TYPES.map((type) => {
        const prompt = prompts[type];
        const charCount = prompt.content.length;
        const modelKey = PROMPT_MODEL_SETTINGS[type];
        const modelValue = modelSettings[modelKey] ?? "";
        return h("article", { key: type, class: "forge-v3-prompt-card" },
          h("header", null,
            h("div", null,
              h("h2", null, type),
              h("p", { class: "forge-v3-prompt-meta" }, "Prompt: ", prompt.status, " · Model: ", modelValue.trim() ? "override" : "default")
            ),
            type === "coder" ? h("span", { class: "forge-v3-prompt-meta" }, "learned-rules") : null
          ),
          h("div", { class: "forge-v3-prompt-model-row" },
            h("label", { class: "forge-v3-prompt-meta" }, "Model override"),
            h("input", { class: "forge-v3-prompt-model-input", value: modelValue, placeholder: defaultModel || "Use default model", onInput: (event: Event) => updateModelSetting(modelKey, (event.target as HTMLInputElement).value) }),
            h("button", { type: "button", onClick: () => saveModelSetting(modelKey) }, "Save model")
          ),
          h("textarea", { class: "forge-v3-prompt-editor", value: prompt.content, rows: 12, onInput: (event: Event) => updatePrompt(type, (event.target as HTMLTextAreaElement).value) }),
          h("footer", { class: "forge-v3-prompt-meta" },
            h("span", null, String(charCount), " chars"),
            h("div", { class: "forge-v3-toolbar-actions" },
              h("button", { type: "button", onClick: () => resetPrompt(type) }, "Reset to default"),
              h("button", { type: "button", onClick: () => savePrompt(type) }, "Save prompt")
            )
          )
        );
      })
    )
  ]);
}

function isWithinLastWeek(value?: string | null): boolean {
  if (!value) return false;
  const time = parseTimestamp(value);
  return Number.isFinite(time) && Date.now() - time <= 7 * 24 * 60 * 60 * 1000;
}

function archiveIssueSearchText(issue: ArchiveIssue): string {
  const prText = (issue.prStack ?? []).map((pr) => [pr.pr_number ? `#${pr.pr_number}` : "", pr.gt_branch, pr.branch, pr.status].filter(Boolean).join(" ")).join(" ");
  return [issue.linear_id, issue.title, issue.state, issue.updated_at, prText].filter(Boolean).join(" ").toLowerCase();
}

function ArchiveIssueSidecar({ issue, onClose }: { issue: ArchiveIssue; onClose: () => void }) {
  const prStack = issue.prStack ?? [];
  return h("aside", { class: "forge-v3-archive-sidecar", "aria-label": "Archived issue summary" },
    h("header", null,
      h("div", null,
        h("div", { class: "forge-v3-issue-meta" }, issue.linear_id ?? `Issue #${issue.id}`),
        h("h2", null, issue.title ?? "Untitled issue")
      ),
      h("button", { type: "button", onClick: onClose, "aria-label": "Close archive summary" }, "×")
    ),
    h("div", { class: "forge-v3-archive-sidecar-body" },
      h("section", null,
        h("h3", null, "Summary"),
        issue.summaryContent
          ? h("div", { class: "forge-v3-md-viewer", dangerouslySetInnerHTML: { __html: renderMarkdown(issue.summaryContent) } })
          : h("p", { class: "forge-v3-empty" }, issue.hasSummary ? "Summary could not be loaded." : "No summary was generated for this issue.")
      ),
      h("section", null,
        h("h3", null, "PR stack"),
        prStack.length
          ? h("div", { class: "forge-v3-archive-pr-list" }, prStack.map((pr, index) => {
              const label = pr.pr_number ? `#${pr.pr_number}` : pr.gt_branch ?? pr.branch ?? `PR ${index + 1}`;
              const branch = pr.gt_branch ?? pr.branch;
              return h("div", { class: "forge-v3-archive-pr-row", key: `${label}-${index}` },
                pr.url ? h("a", { href: pr.url, target: "_blank", rel: "noreferrer" }, label) : h("span", null, label),
                branch ? h("code", null, branch) : null,
                pr.status ? h("span", { class: "forge-v3-pr-meta-badge" }, pr.status) : null
              );
            }))
          : h("p", { class: "forge-v3-empty" }, "No PRs were tracked for this issue.")
      ),
      h("section", null,
        h("h3", null, "Run metadata"),
        h("div", { class: "forge-v3-archive-meta" }, "Agent runs: ", String(issue.run_count ?? 0)),
        h("div", { class: "forge-v3-archive-meta" }, "Completed: ", issue.merged ?? issue.updated_at ?? "—")
      )
    )
  );
}

function ArchiveView() {
  const [archiveIssues, setArchiveIssues] = useState<ArchiveIssue[] | null>(null);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const [archiveSearch, setArchiveSearch] = useState("");
  const [selectedArchiveId, setSelectedArchiveId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getJson<ArchiveIssue[]>("/api/archive")
      .then((issues) => { if (!cancelled) setArchiveIssues(issues); })
      .catch(() => { if (!cancelled) setArchiveError("Unable to load archive"); });
    return () => { cancelled = true; };
  }, []);

  const issues = archiveIssues ?? [];
  const normalizedSearch = archiveSearch.trim().toLowerCase();
  const visibleIssues = normalizedSearch ? issues.filter((issue) => archiveIssueSearchText(issue).includes(normalizedSearch)) : issues;
  const selectedArchiveIssue = selectedArchiveId ? issues.find((issue) => issue.id === selectedArchiveId) ?? null : null;
  const totalCompleted = visibleIssues.length;
  const completedThisWeek = visibleIssues.filter((issue) => isWithinLastWeek(issue.merged ?? issue.updated_at)).length;
  const averagePrs = totalCompleted ? (visibleIssues.reduce((sum, issue) => sum + Number(issue.pr_count ?? issue.prStack?.length ?? 0), 0) / totalCompleted).toFixed(1) : "0.0";

  return h(PageFrame, { view: "archive", className: `forge-v3-archive-wrap ${selectedArchiveIssue ? "forge-v3-has-archive-detail" : ""}` }, [
    h(PageHeader, { icon: "🗃️", title: "Archive", subtitle: `${totalCompleted} completed issues${normalizedSearch ? ` matching “${archiveSearch.trim()}”` : ""} — all PRs merged`, actions: h("input", { class: "forge-v3-toolbar-search", type: "search", placeholder: "Search archive…", "aria-label": "Search archive", value: archiveSearch, onInput: (event: Event) => setArchiveSearch((event.target as HTMLInputElement).value) }) }),
    h("section", { class: "forge-v3-archive-stats forge-v3-stats-strip", "aria-label": "Archive stats" },
      h("article", null, h("span", null, "Total completed"), h("strong", null, String(totalCompleted))),
      h("article", null, h("span", null, "Completed this week"), h("strong", null, String(completedThisWeek))),
      h("article", null, h("span", null, "Average time to merge"), h("strong", null, "—")),
      h("article", null, h("span", null, "Average PRs per issue"), h("strong", null, averagePrs))
    ),
    archiveError
      ? h("p", { class: "forge-v3-empty" }, "Unable to load archive")
      : archiveIssues === null
        ? h("p", { class: "forge-v3-empty" }, "Loading archive…")
        : issues.length === 0
          ? h("p", { class: "forge-v3-empty" }, "No completed issues yet")
          : visibleIssues.length === 0
            ? h("p", { class: "forge-v3-empty" }, "No archived issues match your search")
            : h("section", { class: "forge-v3-archive-grid forge-v3-archive-list", "aria-label": "Completed issues" },
                visibleIssues.map((issue) => h("article", { key: issue.id, class: `forge-v3-archive-card ${selectedArchiveId === issue.id ? "is-selected" : ""}`, tabIndex: 0, role: "button", onClick: () => setSelectedArchiveId(issue.id), onKeyDown: (event: KeyboardEvent) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedArchiveId(issue.id); } } },
                  h("div", { class: "forge-v3-archive-meta" }, issue.linear_id ?? `Issue #${issue.id}`, " · ", issue.updated_at ?? "merged"),
                  h("h2", null, issue.title ?? "Untitled issue"),
                  h("div", { class: "forge-v3-archive-meta" }, "PR links", ": ", issue.prStack?.length ? issue.prStack.map((pr, index) => {
                    const label = pr.pr_number ? `#${pr.pr_number}` : pr.gt_branch ?? pr.branch ?? "pending";
                    return pr.url ? h("a", { key: `${label}-${index}`, href: pr.url, target: "_blank", rel: "noreferrer", onClick: (event: MouseEvent) => event.stopPropagation() }, label) : h("span", { key: `${label}-${index}` }, label);
                  }) : "None"),
                  h("div", { class: "forge-v3-archive-meta" }, "Agent runs", ": ", String(issue.run_count ?? 0)),
                  h("div", { class: "forge-v3-archive-meta" }, "Summary", ": ", issue.summaryContent || issue.hasSummary ? "available" : "not generated")
                ))
              ),
    selectedArchiveIssue ? h(ArchiveIssueSidecar, { issue: selectedArchiveIssue, onClose: () => setSelectedArchiveId(null) }) : null
  ]);
}

function IssueDetailPanel({ issueId, issuePreview, reloadKey, autoOpenDiffKey, onClose, onPanelResizeStart, onIssueAction, onRemoveIssue, onLaunchRuntime, onStopVm, onSyncPrs, onSubmitFeedback, onResolveDecision }: { issueId: number | null; issuePreview?: Issue | null; reloadKey: number; autoOpenDiffKey: number; onClose: () => void; onPanelResizeStart: (event: PointerEvent) => void; onIssueAction: (issueId: number, action: IssueAction, payload?: Record<string, unknown>) => void; onRemoveIssue: (issueId: number) => void; onLaunchRuntime: (issueId: number) => Promise<unknown>; onStopVm: () => void; onSyncPrs: (issueId: number) => void; onSubmitFeedback: (issueId: number, body: string, prNumber?: number | null) => void; onResolveDecision: (decisionId: number, verdict: DecisionVerdict, feedback?: unknown) => void }) {
  const [activeTab, setActiveTab] = useState<DetailTab["key"]>(() => parseDashboardRoute().detailTab);
  const [detail, setDetail] = useState<IssueDetail | null>(null);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [diffModalOpen, setDiffModalOpen] = useState(false);
  const [diffText, setDiffText] = useState("");
  const [diffStatus, setDiffStatus] = useState("");
  const diffLoadRequestId = useRef(0);
  const [activeDiffPath, setActiveDiffPath] = useState("");
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewTour, setReviewTour] = useState<ReviewTourPayload | null>(null);
  const [reviewTourStatus, setReviewTourStatus] = useState("");
  const [reviewedFiles, setReviewedFiles] = useState<string[]>([]);
  const [reviewComments, setReviewComments] = useState<ReviewComment[]>([]);
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [selectedFixCommentIds, setSelectedFixCommentIds] = useState<string[]>([]);
  const [optimisticallyResolvedDecisionIds, setOptimisticallyResolvedDecisionIds] = useState<number[]>([]);
  const [jumpModalOpen, setJumpModalOpen] = useState(false);
  const [listenOpen, setListenOpen] = useState(false);
  const [listenStatus, setListenStatus] = useState("idle");
  const [listenMessages, setListenMessages] = useState<Array<{ kind: string; text: string }>>([]);
  const [planFeedback, setPlanFeedback] = useState("");
  const [adminStatus, setAdminStatus] = useState("");
  const [autoFixEnabled, setAutoFixEnabled] = useState(false);
  const [askInput, setAskInput] = useState("");
  const [askMessages, setAskMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);
  const [askStatus, setAskStatus] = useState("");
  const [askCurrentStatus, setAskCurrentStatus] = useState("");
  const askAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!issueId) {
      setDetail(null);
      setPlanModalOpen(false);
      setDiffModalOpen(false);
      setListenOpen(false);
      setJumpModalOpen(false);
      return;
    }
    setDetail(issuePreview ? { issue: issuePreview } : null);
    const route = parseDashboardRoute();
    setActiveTab(route.detailTab);
    setPlanModalOpen(route.panel === "plan");
    setDiffModalOpen(route.panel === "diff" || route.panel === "review");
    setListenOpen(route.panel === "listen");
    setJumpModalOpen(route.panel === "jump");
    setListenMessages([]);
    setListenStatus("idle");
    setDiffText("");
    setDiffStatus(route.panel === "diff" || route.panel === "review" ? "Loading diff…" : "");
    setActiveDiffPath(route.diffPath);
    setReviewMode(route.panel === "review");
    setReviewTour(null);
    setReviewTourStatus("");
    setReviewedFiles([]);
    setReviewComments([]);
    setReviewFeedback("");
    setSelectedFixCommentIds([]);
    setOptimisticallyResolvedDecisionIds([]);
    setPlanFeedback("");
    setAdminStatus("");
    setAutoFixEnabled(false);
    setAskInput("");
    setAskMessages([]);
    setAskStatus("");
    setAskCurrentStatus("");
    askAbortRef.current?.abort();
    askAbortRef.current = null;
  }, [issueId]);

  useEffect(() => {
    if (!issueId) return;

    let cancelled = false;
    getJson<IssueDetail>(`/api/issues/${issueId}?fast=1`)
      .then((nextDetail) => { if (!cancelled) setDetail(nextDetail); })
      .catch(() => { if (!cancelled) setDetail({ issue: { id: issueId, title: "Unable to load issue" } }); });

    return () => { cancelled = true; };
  }, [issueId, reloadKey]);

  useEffect(() => {
    if (!issueId) return;
    const panel = diffModalOpen ? (reviewMode ? "review" : "diff") : planModalOpen ? "plan" : listenOpen ? "listen" : jumpModalOpen ? "jump" : null;
    updateDashboardQuery({ view: "queue", issue: issueId, tab: activeTab === "overview" ? null : activeTab, panel, diffPath: diffModalOpen ? activeDiffPath : null });
  }, [issueId, activeTab, planModalOpen, diffModalOpen, listenOpen, jumpModalOpen, reviewMode, activeDiffPath]);

  useEffect(() => {
    const fixDecision = detail?.decisions?.find((decision) => decision.type === "FIX_APPROVAL");
    const comments = parseDecisionArtifact(fixDecision).comments ?? [];
    setSelectedFixCommentIds(comments.map((comment, index) => fixCommentId(comment, index)));
  }, [detail?.decisions]);

  useEffect(() => {
    setAutoFixEnabled(Boolean(detail?.issue?.auto_fix_enabled));
  }, [detail?.issue?.auto_fix_enabled]);

  useEffect(() => {
    if (!listenOpen || !issueId) return;
    if (mockStatesEnabled()) {
      setListenStatus("mock live");
      setListenMessages([{ kind: "text", text: "Mock live agent stream — real issues connect to /api/issues/:id/listen." }]);
      return;
    }
    setListenStatus("connecting…");
    setListenMessages([]);
    const events = new EventSource(`/api/issues/${issueId}/listen`);
    events.addEventListener("meta", (event) => {
      const meta = JSON.parse((event as MessageEvent).data) as { agentType?: string };
      setListenStatus(meta.agentType ? `live · ${meta.agentType}` : "live");
    });
    events.addEventListener("message", (event) => {
      const payload = JSON.parse((event as MessageEvent).data) as { kind?: string; text?: string };
      const kind = payload.kind ?? "text";
      // Strip ANSI escape codes
      const text = (payload.text ?? "").replace(/\x1b\[[\d;]*[A-Za-z]|\x1b[^\[]/g, "");
      if (!text) return;
      // Delta kinds: accumulate into last message of same kind rather than creating new entries
      const isDelta = kind === "text_delta" || kind === "thinking_delta";
      setListenMessages((messages) => {
        const last = messages[messages.length - 1];
        if (isDelta && last && last.kind === kind) {
          return [...messages.slice(0, -1), { kind, text: last.text + text }];
        }
        return [...messages.slice(-200), { kind, text }];
      });
    });
    events.addEventListener("done", (event) => {
      const payload = JSON.parse((event as MessageEvent).data) as { exitCode?: number };
      setListenStatus(payload.exitCode === 0 ? "done" : `failed (${payload.exitCode ?? "unknown"})`);
      events.close();
    });
    events.addEventListener("error", () => setListenStatus("no active agent"));
    events.onerror = () => setListenStatus("disconnected");
    return () => events.close();
  }, [listenOpen, issueId]);

  useEffect(() => {
    if (!issueId || autoOpenDiffKey <= 0) return;
    setReviewMode(true);
    setDiffModalOpen(true);
    setDiffStatus("Loading diff…");
  }, [autoOpenDiffKey, issueId]);

  useEffect(() => {
    if (!issueId || !diffModalOpen || diffStatus !== "Loading diff…") return;
    const requestId = ++diffLoadRequestId.current;
    if (reviewMode) {
      setReviewTourStatus("Loading AI tour…");
      getJson<ReviewTourPayload>(`/api/issues/${issueId}/tour`)
        .then((payload) => {
          if (requestId !== diffLoadRequestId.current) return;
          setReviewTour(payload);
          setReviewTourStatus(payload.generating ? "AI tour is generating…" : payload.tour ? "" : "No AI tour yet");
        })
        .catch(() => {
          if (requestId === diffLoadRequestId.current) setReviewTourStatus("Unable to load AI tour");
        });
    }
    getJson<DiffPayload>(`/api/issues/${issueId}/diff`)
      .then((payload) => {
        if (requestId !== diffLoadRequestId.current) return;
        const diff = payload.diff ?? "";
        const files = parseUnifiedDiff(diff);
        setDiffText(diff);
        setActiveDiffPath((current) => current || files[0]?.path || "");
        setDiffStatus(payload.error ?? "");
      })
      .catch(() => {
        if (requestId === diffLoadRequestId.current) setDiffStatus("Unable to load diff");
      });
  }, [diffModalOpen, diffStatus, issueId, reviewMode]);

  if (!issueId) return null;

  const issue = detail?.issue;
  const decisions = (detail?.decisions ?? []).filter((decision) => !decision.verdict && !decision.resolved_at && !optimisticallyResolvedDecisionIds.includes(decision.id));
  const prStack = detail?.prStack ?? [];
  const safeIssue = issue ?? { id: issueId };
  const openLiveListen = () => setListenOpen(true);
  const banner = issueBanner(safeIssue, decisions);
  const decisionKind = issueDecisionKind(decisions);
  const activePhase = phaseIndexForState(issue?.state);
  const priorityText = `${priorityGlyph(issue?.priority)} ${priorityLabel(issue?.priority)}`;
  const planText = detailPlan(detail);
  const handoffText = detailHandoff(detail);
  const handoffAvailable = hasHandoff(detail);
  const planAvailable = hasPlan(detail) && !["PENDING", "SETTING_UP", "PLANNING"].includes(issue?.state ?? "");
  const docsAvailable = planAvailable || handoffAvailable;
  const diffAvailable = hasWrittenCode(issue?.state);
  const splitAvailable = canRequestSplitPrStack(issue?.state);
  const rebaseAvailable = canRebaseIssue(issue);
  const steerAvailable = !["PENDING", "SETTING_UP", "DONE", "IGNORED", "FAILED"].includes(issue?.state ?? "");
  const planSidecar = { label: "Plan" };
  const requestSteering = async () => {
    if (!issue?.id) return;
    const instructions = await showForgePrompt({ title: "Steer issue", message: "Instructions will be read by the next agent run.", label: "Steering instructions", confirmText: "Queue steering" });
    if (!instructions?.trim()) return;
    onIssueAction(issue.id, "steer", { instructions: instructions.trim() });
  };
  const clearSteering = async () => {
    if (!issue?.id) return;
    const confirmed = await showForgeConfirm({ title: "Clear steering?", message: "Remove queued steering context for this issue.", confirmText: "Clear steering" });
    if (!confirmed) return;
    onIssueAction(issue.id, "clear-steer");
  };
  const jumpStateOptions = JUMP_STATE_OPTIONS.filter((option) => option.state !== issue?.state);
  const jumpToState = async (option: JumpStateOption) => {
    if (!issue?.id) return;
    const label = issue.linear_id ?? `issue #${issue.id}`;
    const warning = option.risky ? " This is a risky recovery action and may clear or bypass pending workflow gates." : "";
    const confirmed = await showForgeConfirm({ title: "Jump workflow state?", message: `Move ${label} to ${option.state}?${warning}`, confirmText: "Jump state", danger: option.risky });
    if (!confirmed) return;
    setJumpModalOpen(false);
    onIssueAction(issue.id, "advance", { nextState: option.state });
  };
  const advanceIssue = async () => {
    if (!issue?.id) return;
    const nextState = nextStateForIssue(issue.state);
    const confirmed = await showForgeConfirm({ title: "Advance workflow state?", message: `Manually advance ${issue.linear_id ?? `issue #${issue.id}`} to ${nextState}?`, confirmText: "Advance" });
    if (!confirmed) return;
    onIssueAction(issue.id, "advance", { nextState });
  };
  const fullResetIssue = async () => {
    if (!issue?.id) return;
    const typed = await showForgePrompt({ title: "Full reset issue", message: `This fully resets ${issue.linear_id ?? `issue #${issue.id}`}, removes worktree/project artifacts, and restarts from PENDING.`, label: "Type RESET to confirm", confirmText: "Reset issue", danger: true, requiredText: "RESET" });
    if (typed !== "RESET") return;
    onIssueAction(issue.id, "reset");
  };
  const removeSelectedIssue = async () => {
    if (!issue?.id) return;
    const typed = await showForgePrompt({ title: "Remove issue", message: `Remove ${issue.linear_id ?? `issue #${issue.id}`} from Forge.`, label: "Type DELETE to confirm", confirmText: "Remove issue", danger: true, requiredText: "DELETE" });
    if (typed !== "DELETE") return;
    onRemoveIssue(issue.id);
  };
  const launchRuntime = () => {
    if (!issue?.id) return;
    setAdminStatus("Launching runtime…");
    onLaunchRuntime(issue.id)
      .then((result) => setAdminStatus(`Runtime launch complete${typeof result === "object" && result && "launchRef" in result ? ` · ${(result as { launchRef?: string }).launchRef ?? "started"}` : ""}`))
      .catch((error: Error) => setAdminStatus(`Runtime launch failed: ${error.message}`));
  };
  const toggleAutoFix = (enabled: boolean) => {
    if (!issue?.id) return;
    const previous = autoFixEnabled;
    setAutoFixEnabled(enabled);
    onIssueAction(issue.id, "set-auto-fix", { enabled });
    window.setTimeout(() => {
      if (!mockStatesEnabled() && detail?.issue?.auto_fix_enabled === previous) setAutoFixEnabled(previous);
    }, 2000);
  };
  const addPrFeedback = async () => {
    if (!issue?.id) return;
    const prChoices = prStack.filter((pr) => pr.pr_number).map((pr) => String(pr.pr_number));
    const rawPr = prChoices.length ? await showForgePrompt({ title: "Target PR", message: `Choose a PR number (${prChoices.join(", ")}).`, label: "PR number", initialValue: prChoices[0], confirmText: "Continue" }) : null;
    const prNumber = rawPr?.trim() ? Number(rawPr.trim().replace(/^#/, "")) : null;
    const body = (await showForgePrompt({ title: "Add PR feedback", message: "Feedback will be sent to the fixer agent.", label: "Feedback", confirmText: "Add feedback" }))?.trim();
    if (!body) return;
    onSubmitFeedback(issue.id, body, Number.isFinite(prNumber) ? prNumber : null);
  };
  const loadReviewTour = (id: number) => {
    setReviewTourStatus("Loading AI tour…");
    getJson<ReviewTourPayload>(`/api/issues/${id}/tour`)
      .then((payload) => {
        setReviewTour(payload);
        setReviewTourStatus(payload.generating ? "AI tour is generating…" : payload.tour ? "" : "No AI tour yet");
      })
      .catch(() => setReviewTourStatus("Unable to load AI tour"));
  };
  const generateReviewTour = (regenerate = false) => {
    if (!issue?.id) return;
    setReviewTourStatus(regenerate ? "Regenerating AI tour…" : "Generating AI tour…");
    const start = () => postJson<ReviewTourPayload>(`/api/issues/${issue.id}/generate-tour`, {});
    (regenerate ? postJson<{ ok: boolean }>(`/api/issues/${issue.id}/tour`, {}, "DELETE").then(start) : start())
      .then((payload) => {
        setReviewTour(payload);
        setReviewTourStatus(payload.tour ? "" : "AI tour is generating…");
      })
      .catch(() => setReviewTourStatus("Unable to start AI tour generation"));
  };
  const openDiffSidecar = (mode: "diff" | "review" = "diff") => {
    if (!issue?.id) return;
    diffLoadRequestId.current += 1;
    setReviewMode(mode === "review");
    setReviewTour(null);
    setReviewTourStatus(mode === "review" ? "Loading AI tour…" : "");
    setDiffText("");
    setActiveDiffPath("");
    setDiffModalOpen(true);
    setDiffStatus("Loading diff…");
  };
  const diffFiles = parseUnifiedDiff(diffText);
  const activeDiffFile = diffFiles.find((file) => file.path === activeDiffPath) ?? diffFiles[0];
  const planDecision = decisions.find((decision) => decision.type === "PLAN_REVIEW") ?? (decisionKind === "plan" ? decisions[0] : undefined);
  const codeDecision = decisions.find((decision) => decision.type === "CODE_REVIEW") ?? (decisionKind === "code" ? decisions[0] : undefined);
  const fixDecision = decisions.find((decision) => decision.type === "FIX_APPROVAL") ?? (decisionKind === "fix" ? decisions[0] : undefined);
  const splitDecision = decisions.find((decision) => decision.type === "SPLIT_APPROVAL") ?? (decisionKind === "split" ? decisions[0] : undefined);
  const fixArtifact = parseDecisionArtifact(fixDecision);
  const fixComments = fixArtifact.comments ?? [];
  const splitArtifact = parseDecisionArtifact(splitDecision);
  const splitStack = splitArtifact.proposedStack ?? splitArtifact.stack ?? [];
  const expectedDecisionType = expectedDecisionTypeForState(issue?.state);
  const staleDecisions = expectedDecisionType ? decisions.filter((decision) => decision.type && decision.type !== expectedDecisionType) : decisions.filter((decision) => decision.type);
  const addReviewComment = async (file: string, line: number | null) => {
    const body = (await showForgePrompt({ title: "Add review comment", message: line === null ? `Comment on ${file}` : `Comment on ${file}:${line}`, label: "Comment", confirmText: "Add comment" }))?.trim();
    if (!body) return;
    setReviewComments((comments) => [...comments, { id: `${Date.now()}-${comments.length}`, file, line, body }]);
  };
  const toggleReviewedFile = (file: string) => setReviewedFiles((files) => files.includes(file) ? files.filter((path) => path !== file) : [...files, file]);
  const resolveDecisionOptimistically = (decisionId: number, verdict: DecisionVerdict, feedback?: unknown) => {
    setOptimisticallyResolvedDecisionIds((ids) => ids.includes(decisionId) ? ids : [...ids, decisionId]);
    onResolveDecision(decisionId, verdict, feedback);
  };
  const approvePlanWithSteering = async () => {
    if (!planDecision) return;
    const steeringComment = (await showForgePrompt({ title: "Approve plan", message: "Optional steering/commentary for the coder agent.", label: "Steering commentary", confirmText: "Approve plan" }))?.trim();
    resolveDecisionOptimistically(planDecision.id, "approved", steeringComment ? { steeringComment } : undefined);
  };
  const requestDecisionChanges = async (decision: Decision, label: string) => {
    const reason = await showForgePrompt({ title: `Request ${label} changes`, message: "Feedback will be sent to the agent.", label: "Feedback", confirmText: "Request changes", danger: true });
    if (!reason?.trim()) return;
    resolveDecisionOptimistically(decision.id, "rejected", { reason: reason.trim() });
  };
  const toggleFixComment = (id: string) => setSelectedFixCommentIds((ids) => ids.includes(id) ? ids.filter((nextId) => nextId !== id) : [...ids, id]);
  const skipAllFixes = () => {
    if (!fixDecision) return;
    const allIds = fixComments.map((comment, index) => fixCommentId(comment, index));
    setSelectedFixCommentIds([]);
    resolveDecisionOptimistically(fixDecision.id, "rejected", { skippedIds: allIds, reason: "Skipped all PR comments" });
  };
  const approveSelectedFixes = () => {
    if (!fixDecision) return;
    const allIds = fixComments.map((comment, index) => fixCommentId(comment, index));
    const approvedIds = selectedFixCommentIds;
    if (!approvedIds.length) {
      skipAllFixes();
      return;
    }
    const skippedIds = allIds.filter((id) => !approvedIds.includes(id));
    resolveDecisionOptimistically(fixDecision.id, "approved", { approvedIds, skippedIds });
  };
  const resolveCodeReview = (verdict: DecisionVerdict) => {
    if (!codeDecision) return;
    resolveDecisionOptimistically(codeDecision.id, verdict, {
      kind: "code-review",
      summary: reviewFeedback.trim(),
      reviewedFiles,
      comments: reviewComments.map(({ file, line, body }) => ({ file, line, body })),
    });
    setReviewFeedback("");
  };
  const askIssue = () => {
    if (!issue?.id || !askInput.trim() || askStatus === "thinking") return;
    const question = askInput.trim();
    setAskInput("");
    setAskStatus("thinking");
    setAskCurrentStatus("Gathering issue context…");
    setAskMessages((messages) => [...messages, { role: "user", text: question }, { role: "assistant", text: "" }]);
    const controller = new AbortController();
    askAbortRef.current = controller;
    fetch(`/api/issues/${issue.id}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
      signal: controller.signal,
    }).then(async (response) => {
      if (!response.ok || !response.body) throw new Error(`Ask failed (${response.status})`);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      const appendAssistant = (text: string) => setAskMessages((messages) => {
        const assistantIndex = [...messages].map((message) => message.role).lastIndexOf("assistant");
        if (assistantIndex < 0) return [...messages, { role: "assistant", text }];
        return messages.map((message, index) => index === assistantIndex ? { ...message, text: message.text + text } : message);
      });
      const appendStatus = (text: string) => setAskCurrentStatus(text);
      const processEvent = (raw: string) => {
        const eventLine = raw.split("\n").find((line) => line.startsWith("event:"));
        const dataLine = raw.split("\n").find((line) => line.startsWith("data:"));
        if (!dataLine) return;
        const eventName = eventLine?.replace(/^event:\s*/, "") ?? "message";
        const payload = JSON.parse(dataLine.replace(/^data:\s*/, "")) as { kind?: string; text?: string; exitCode?: number };
        if (eventName === "done") {
          setAskStatus("");
          setAskCurrentStatus("");
          return;
        }
        if (eventName === "meta") {
          appendStatus("Gathered issue context. Starting assistant…");
          return;
        }
        if (eventName !== "message") return;
        if (payload.kind === "text_delta" || payload.kind === "text") appendAssistant(payload.text ?? "");
        if (payload.kind === "thinking_delta") appendStatus("Thinking…");
        if (payload.kind === "tool") appendStatus((payload.text ?? "").trim());
        if (payload.kind === "error") appendStatus(`Error: ${(payload.text ?? "").trim()}`);
      };
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";
        parts.forEach(processEvent);
      }
      setAskStatus("");
      setAskCurrentStatus("");
    }).catch((error: Error) => {
      if (controller.signal.aborted) return;
      setAskStatus("");
      setAskCurrentStatus(error.message);
    });
  };

  return h("aside", { id: "detail-panel", class: "forge-v3-detail-panel", "aria-label": "Issue detail panel" },
    h("div", { class: "forge-v3-detail-resize-handle", role: "separator", "aria-orientation": "vertical", title: "Resize sidebar", onPointerDown: onPanelResizeStart }),
    h("header", { class: "forge-v3-detail-header" },
      h("div", null,
        h("div", { class: "forge-v3-issue-meta" }, issue?.linear_id ?? `Issue #${issueId}`),
        h("h2", null, issue?.title ?? "Loading issue…")
      ),
      h("button", { type: "button", onClick: onClose, "aria-label": "Close issue detail panel" }, "×")
    ),
    h("nav", { class: "forge-v3-detail-tabs", "aria-label": "Issue detail tabs" },
      DETAIL_TABS.map((tab) => h("button", { key: tab.key, type: "button", class: activeTab === tab.key ? "active" : "", onClick: () => setActiveTab(tab.key) }, tab.label))
    ),
    h("section", { class: "forge-v3-detail-body", "data-tab": activeTab },
      activeTab === "overview" && h("div", { class: "forge-v3-detail-overview" },
        h("section", { class: "forge-v3-ds" },
          h("div", { class: `forge-v3-state-banner ${banner.tone}` },
            banner.icon === "spinner" ? h("span", { class: "forge-v3-spinner forge-v3-state-spinner", "aria-hidden": "true" }) : h("span", { class: "forge-v3-state-icon", "aria-hidden": "true" }, banner.icon),
            h("div", { class: "forge-v3-sb-text" }, h("strong", null, banner.title), h("br", null), banner.text),
            banner.live ? h("span", { class: "forge-v3-live-badge" }, "Live") : null
          ),
          h("div", { class: "forge-v3-phase-track", "aria-label": "Workflow phase track" },
            PHASES.map((label, index) => {
              const tooltip = phaseTooltip(label, detail);
              return [
                h("div", { key: label, class: "forge-v3-phase-node", tabIndex: 0, "aria-label": `${tooltip.title}: ${tooltip.summary} ${tooltip.stats.join(". ")}` },
                  h("div", { class: `forge-v3-phase-dot ${index < activePhase || issue?.state === "DONE" ? "done" : index === activePhase ? isWaitingState(issue?.state) ? "wait" : "active" : ""}` }),
                  h("div", { class: "forge-v3-phase-label" }, label),
                  h("div", { class: "forge-v3-phase-tooltip", role: "tooltip" },
                    h("strong", null, tooltip.title),
                    h("p", null, tooltip.summary),
                    h("ul", null, tooltip.stats.map((stat) => h("li", { key: stat }, stat)))
                  )
                ),
                index < PHASES.length - 1 ? h("div", { key: `${label}-line`, class: `forge-v3-phase-line ${index < activePhase ? "done" : ""}` }) : null
              ];
            })
          )
        ),
        issue?.state === "FAILED" && detail?.failureContext ? h("section", { class: "forge-v3-ds forge-v3-failure-box" },
          h("div", { class: "forge-v3-failure-header" },
            h("span", { class: "forge-v3-failure-icon", "aria-hidden": "true" }, "✕"),
            h("div", null,
              h("strong", null, `${detail.failureContext.run?.agent_type ?? "Agent"} crashed`),
              h("span", { class: "forge-v3-failure-meta" },
                ` · exit ${detail.failureContext.run?.exit_code ?? "?"} · `,
                detail.failureContext.run?.started_at ? `${timeAgoShort(detail.failureContext.run.started_at)} ago` : "recently"
              )
            ),
            detail.failureContext.run?.id
              ? h("a", { class: "forge-v3-failure-log-link", href: runLogUrl(detail.failureContext.run.id) ?? "#", target: "_blank", rel: "noreferrer" }, "Full log ↗")
              : null
          ),
          detail.failureContext.logTail
            ? h("pre", { class: "forge-v3-failure-log" }, detail.failureContext.logTail)
            : h("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No log output captured."),
          h("div", { class: "forge-v3-dp-actions" },
            h("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !issue?.id, onClick: () => issue?.id ? onIssueAction(issue.id, "retry") : undefined }, "↺ Retry"),
            h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !issue?.id, onClick: requestSteering }, "💬 Steer before retry")
          )
        ) : null,
        h("section", { class: "forge-v3-ds" },
          h("div", { class: "forge-v3-ds-label" }, decisionKind ? "Actions · Decision needed" : "Actions"),
          h("div", { class: "forge-v3-dp-actions" },
            isRunningIssue(safeIssue) ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", onClick: openLiveListen }, "👁 Listen live") : null,
            decisionKind === "plan" && planDecision ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: approvePlanWithSteering }, "✓ Approve plan") : null,
            decisionKind === "plan" && planDecision ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => setPlanModalOpen(true) }, "✗ Request changes") : null,
            decisionKind === "code" && codeDecision ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", onClick: () => openDiffSidecar("review") }, "⬡ Review code") : null,
            decisionKind === "fix" && fixDecision ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: approveSelectedFixes }, `✓ Fix selected (${selectedFixCommentIds.length})`) : null,
            decisionKind === "fix" && fixDecision ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: skipAllFixes }, "Skip all") : null,
            decisionKind === "split" && splitDecision ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => resolveDecisionOptimistically(splitDecision.id, "approved") }, "✓ Approve split plan") : null,
            decisionKind === "split" && splitDecision ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => requestDecisionChanges(splitDecision, "Split plan") }, "✗ Revise split") : null,
            decisionKind === "generic" && decisions[0] ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => resolveDecisionOptimistically(decisions[0].id, "approved") }, "✓ Approve") : null,
            decisionKind === "generic" && decisions[0] ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => requestDecisionChanges(decisions[0], "Decision") }, "✗ Request changes") : null,
            docsAvailable ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => setPlanModalOpen(true) }, handoffAvailable ? "📋 View plan / handoff" : "📋 View plan") : null,
            diffAvailable ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => openDiffSidecar("diff") }, "📊 View diff") : null,
            steerAvailable ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !issue?.id, onClick: requestSteering }, "💬 Steer") : null,
            h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !issue?.id, onClick: advanceIssue }, "⤴ Advance state"),
            h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !issue?.id || issue?.state === "DONE", onClick: () => setJumpModalOpen(true) }, "↕ Jump to state"),
            splitAvailable ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !issue?.id, onClick: async () => {
              if (!issue?.id) return;
              const instructions = (await showForgePrompt({ title: "Split PR stack", message: "Optional instructions for the split planner.", label: "Split instructions", confirmText: "Request split" }))?.trim();
              onIssueAction(issue.id, "split-pr-stack", instructions ? { instructions } : {});
            } }, "⑂ Split PR") : null,
            rebaseAvailable ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !issue?.id, onClick: async () => {
              if (!issue?.id) return;
              const confirmed = await showForgeConfirm({ title: "Rebase and push?", message: "Rebase this issue's open branch(es) onto their base branch, then push with --force-with-lease.", confirmText: "Rebase", danger: true });
              if (confirmed) onIssueAction(issue.id, "rebase");
            } }, "↥ Rebase") : null,
            issue?.state === "FAILED" ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !issue?.id, onClick: () => issue?.id ? onIssueAction(issue.id, "retry") : undefined }, "↺ Retry") : null,
            issue?.state === "PAUSED" ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !issue?.id, onClick: () => issue?.id ? onIssueAction(issue.id, "unpause") : undefined }, "▶ Resume") : null,
            issue?.state === "IGNORED" ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !issue?.id, onClick: () => issue?.id ? onIssueAction(issue.id, "unignore") : undefined }, "▶ Unignore") : null,
            ["WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL"].includes(issue?.state ?? "") ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !issue?.id, onClick: addPrFeedback }, "💬 Add PR feedback") : null,
            isRunningIssue(safeIssue) ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !issue?.id, onClick: () => issue?.id ? onIssueAction(issue.id, "pause") : undefined }, "⏸ Pause") : null
          )
        ),
        staleDecisions.length ? h("section", { class: "forge-v3-ds forge-v3-stale-decisions" },
          h("div", { class: "forge-v3-ds-label" }, "Stale pending decision"),
          h("p", null, "This issue has pending decision records that do not match the current workflow state. Review safely before approving."),
          staleDecisions.map((decision) => h("div", { class: "forge-v3-stale-decision-row", key: decision.id }, h("span", null, decision.type ?? "Decision"), h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => requestDecisionChanges(decision, "Stale decision") }, "Reject with feedback")))
        ) : null,
        fixDecision ? h("section", { class: "forge-v3-ds forge-v3-fix-approval" },
          h("div", { class: "forge-v3-pr-head" }, h("div", { class: "forge-v3-ds-label" }, "Fix approval"), h("div", { class: "forge-v3-dp-actions" }, h("button", { type: "button", class: "forge-v3-col-head-btn", onClick: () => setSelectedFixCommentIds(fixComments.map((comment, index) => fixCommentId(comment, index))) }, "Select all"), h("button", { type: "button", class: "forge-v3-col-head-btn", onClick: () => setSelectedFixCommentIds([]) }, "None"))),
          fixComments.length ? h("div", { class: "forge-v3-fix-comment-list" }, fixComments.map((comment, index) => {
            const id = fixCommentId(comment, index);
            const location = comment.path ? `${comment.path}${comment.line ? `:${comment.line}` : ""}` : "general";
            return h("label", { class: `forge-v3-fix-comment-card ${selectedFixCommentIds.includes(id) ? "selected" : ""}`, key: id },
              h("input", { type: "checkbox", checked: selectedFixCommentIds.includes(id), onChange: () => toggleFixComment(id) }),
              h("div", null,
                h("div", { class: "forge-v3-fix-comment-meta" }, h("strong", null, comment.author ?? "Reviewer"), " · ", location, comment.pr_number ?? comment.prNumber ? ` · PR #${comment.pr_number ?? comment.prNumber}` : ""),
                renderFixCommentBody(comment.body),
                h("div", { class: "forge-v3-fix-comment-badges" }, [comment.reviewState ?? comment.state, comment.source].filter(Boolean).map((badge) => h("span", null, badge)))
              )
            );
          })) : h("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No review comments were attached to this fix approval."),
          h("div", { class: "forge-v3-dp-actions" }, h("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: approveSelectedFixes }, selectedFixCommentIds.length ? `Approve ${selectedFixCommentIds.length} selected` : "Skip all comments"), selectedFixCommentIds.length ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: skipAllFixes }, "Skip all") : null, h("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => requestDecisionChanges(fixDecision, "Fix approval") }, "Request different fixes"))
        ) : null,
        splitDecision ? h("section", { class: "forge-v3-ds forge-v3-split-approval" },
          h("div", { class: "forge-v3-ds-label" }, "Split approval"),
          h("p", null, splitArtifact.summary ?? splitArtifact.plan ?? "Review the proposed PR stack split."),
          splitStack.length ? h("div", { class: "forge-v3-split-stack" }, splitStack.map((entry, index) => h("div", { class: "forge-v3-split-row", key: `${entry.branch}-${index}` }, h("span", null, String(index + 1)), h("strong", null, entry.title ?? entry.branch ?? `PR ${index + 1}`), h("small", null, entry.summary ?? entry.branch ?? "pending branch")))) : null,
          h("div", { class: "forge-v3-dp-actions" }, h("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => resolveDecisionOptimistically(splitDecision.id, "approved") }, "Approve split plan"), h("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => requestDecisionChanges(splitDecision, "Split plan") }, "Request split changes"))
        ) : null,
        h("section", { class: "forge-v3-ds" },
          h("div", { class: "forge-v3-ds-label" }, "Info"),
          h("div", { class: "forge-v3-info-grid" },
            h("div", { class: "forge-v3-ig-label" }, "Source"), h("div", { class: "forge-v3-ig-value" }, issue?.linear_id ? h("a", { href: `https://linear.app/issue/${issue.linear_id}`, target: "_blank", rel: "noreferrer" }, issue.linear_id, " ↗") : `Issue #${issueId}`),
            h("div", { class: "forge-v3-ig-label" }, "Priority"), h("div", { class: `forge-v3-ig-value ${priorityClass(issue?.priority)}` }, priorityText),
            h("div", { class: "forge-v3-ig-label" }, "Branch"), h("div", { class: "forge-v3-ig-value" }, issue?.branch ?? "—"),
            h("div", { class: "forge-v3-ig-label" }, "Worktree"), h("div", { class: "forge-v3-ig-value" }, issue?.wt_path ?? "—"),
            h("div", { class: "forge-v3-ig-label" }, "Added"), h("div", { class: "forge-v3-ig-value" }, issue?.created_at ? `${timeAgoShort(issue.created_at)} ago` : "—"),
            h("div", { class: "forge-v3-ig-label" }, "Model"), h("div", { class: "forge-v3-ig-value" }, "configured in settings")
          )
        ),
        h("section", { class: "forge-v3-ds" },
          h("div", { class: "forge-v3-pr-head" }, h("div", { class: "forge-v3-ds-label" }, "PR Stack"), h("button", { type: "button", class: "forge-v3-col-head-btn", disabled: !issue?.id, onClick: () => issue?.id ? onSyncPrs(issue.id) : undefined }, "↻ Sync from GitHub")),
          h("div", { class: "forge-v3-pr-stack-list" },
            prStack.length ? prStack.map((pr, index) => {
              const prNumber = pr.pr_number;
              const prUrl = pr.url ?? null;
              const branch = pr.branch ?? pr.gt_branch ?? "pending";
              const checksTone = Number(pr.checksFailed ?? 0) > 0 ? "bad" : Number(pr.checksPending ?? 0) > 0 ? "pending" : "ok";
              return h("div", { class: "forge-v3-pr-row", key: `${branch}-${prNumber ?? index}` },
                h("span", { class: "forge-v3-pr-pos" }, String(index + 1)),
                h("span", { class: "forge-v3-pr-branch" }, branch),
                prUrl ? h("a", { class: "forge-v3-pr-badge", href: prUrl, target: "_blank", rel: "noreferrer" }, `#${prNumber} ↗`) : h("span", { class: "forge-v3-pr-badge" }, "no PR"),
                h("span", { class: `forge-v3-ci-badge ${pr.isInMergeQueue ? "merge-queue" : ""}` }, pr.isInMergeQueue ? "MERGE QUEUE" : pr.liveState ?? pr.status ?? "unknown"),
                pr.isInMergeQueue ? h("span", { class: "forge-v3-pr-meta-badge merge-queue" }, pr.mergeQueuePosition ? `Queue #${pr.mergeQueuePosition}` : "Queued") : null,
                pr.reviewDecision ? h("span", { class: "forge-v3-pr-meta-badge" }, pr.reviewDecision) : null,
                pr.mergeable ? h("span", { class: "forge-v3-pr-meta-badge" }, pr.mergeable) : null,
                pr.checksTotal != null ? h("span", { class: `forge-v3-pr-meta-badge checks-${checksTone}` }, `${pr.checksFailed ?? 0} failed · ${pr.checksPending ?? 0} pending · ${pr.checksTotal ?? 0} checks`) : null
              );
            }) : h("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No PRs yet — will be created after code review")
          )
        ),
        h("section", { class: "forge-v3-ds" }, h("div", { class: "forge-v3-auto-fix-row" }, h("div", null, h("h4", null, "Auto-fix"), h("p", null, "Automatically send new PR comments and CI failures to the fixer agent.")), h("label", { class: "forge-v3-switch" }, h("input", { type: "checkbox", checked: autoFixEnabled, disabled: !issue?.id, onChange: (event: Event) => toggleAutoFix((event.target as HTMLInputElement).checked) }), h("span", null))))
      ),
      activeTab === "activity" && renderActivityFeed(detail, safeIssue),
      activeTab === "ask" && h("div", { class: "forge-v3-ask-panel" },
        h("section", { class: "forge-v3-ds forge-v3-ask-intro" },
          h("div", { class: "forge-v3-ds-label" }, "Ask Forge"),
          h("p", null, "Ask about this issue's branch, changed files, plan, handoff, PR stack, and recent agent history. Forge can inspect the worktree if it needs code details."),
          h("div", { class: "forge-v3-ask-prompts" }, ["Summarize changes vs plan", "What should I review first?", "What risks or tests matter?"].map((prompt) => h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => setAskInput(prompt) }, prompt)))
        ),
        h("section", { class: "forge-v3-ask-thread", ref: (el: HTMLElement | null) => { if (el) el.scrollTop = el.scrollHeight; } },
          askMessages.length || askStatus === "thinking" || askCurrentStatus ? [
            ...askMessages.filter((message) => message.role === "user" || message.text.trim()).map((message, index) => h("div", { key: `${index}-${message.role}`, class: `forge-v3-ask-msg ${message.role}` },
              h("span", null, message.role === "user" ? "You" : "Forge"),
              h("pre", null, message.text)
            )),
            askStatus === "thinking" ? h("div", { class: "forge-v3-ask-thinking", role: "status" }, h("span", { class: "forge-v3-spinner", "aria-hidden": "true" }), h("span", null, "Thinking"), h("i", null, "."), h("i", null, "."), h("i", null, ".")) : null,
            askCurrentStatus ? h("div", { class: "forge-v3-ask-current-status" }, askCurrentStatus) : null,
          ] : h("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No questions yet.")
        ),
        h("section", { class: "forge-v3-ask-compose" },
          h("textarea", { rows: 3, placeholder: "Ask about this issue…", value: askInput, onInput: (event: Event) => setAskInput((event.target as HTMLTextAreaElement).value), onKeyDown: (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") askIssue(); } }),
          h("div", { class: "forge-v3-dp-actions" },
            h("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !askInput.trim() || askStatus === "thinking", onClick: askIssue }, askStatus === "thinking" ? "Asking…" : "Ask"),
            askStatus === "thinking" ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => { askAbortRef.current?.abort(); setAskStatus(""); setAskCurrentStatus(""); } }, "Stop") : null,
            h("span", { class: "forge-v3-ask-hint" }, "⌘/Ctrl + Enter")
          )
        )
      )
    ),
    planModalOpen ? h("div", { class: "forge-v3-plan-sidecar-wrap", role: "dialog", "aria-modal": "false", "aria-label": "Plan review" },
      h("section", { class: "forge-v3-plan-modal forge-v3-plan-sidecar" },
        h("header", null,
          h("div", null, h("div", { class: "forge-v3-issue-meta" }, handoffAvailable ? "Plan + handoff · " : "Plan review · ", issue?.linear_id ?? `Issue #${issueId}`), h("h2", null, issue?.title ?? planSidecar.label)),
          h("button", { type: "button", onClick: () => setPlanModalOpen(false), "aria-label": "Close plan modal" }, "×")
        ),
        h("div", { class: "forge-v3-plan-modal-body forge-v3-md-viewer forge-v3-doc-stack" },
          h("section", { class: "forge-v3-doc-section" },
            h("h2", null, "Plan"),
            h("div", { dangerouslySetInnerHTML: { __html: renderMarkdown(planText) } })
          ),
          handoffAvailable ? h("section", { class: "forge-v3-doc-section" },
            h("h2", null, "Handoff"),
            h("div", { dangerouslySetInnerHTML: { __html: renderMarkdown(handoffText) } })
          ) : null
        ),
        h("footer", null,
          h("textarea", { placeholder: "Feedback for requested changes…", rows: 3, value: planFeedback, onInput: (event: Event) => setPlanFeedback((event.target as HTMLTextAreaElement).value) }),
          h("div", { class: "forge-v3-dp-actions" },
            planDecision ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: approvePlanWithSteering }, "✓ Approve plan") : null,
            planDecision ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => planFeedback.trim() ? resolveDecisionOptimistically(planDecision.id, "rejected", { reason: planFeedback.trim() }) : requestDecisionChanges(planDecision, "Plan review") }, "✗ Request changes") : null,
            h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => setPlanModalOpen(false) }, "Close")
          )
        )
      )
    ) : null,
    listenOpen ? h("div", { class: "forge-v3-plan-sidecar-wrap", role: "dialog", "aria-modal": "false", "aria-label": "Live agent output" },
      h("section", { class: "forge-v3-plan-modal forge-v3-plan-sidecar forge-v3-live-sidecar" },
        h("header", null,
          h("div", null, h("div", { class: "forge-v3-issue-meta" }, "Live · ", issue?.linear_id ?? `Issue #${issueId}`), h("h2", null, issue?.title ?? "Live agent output")),
          h("button", { type: "button", onClick: () => setListenOpen(false), "aria-label": "Close live output" }, "×")
        ),
        h("div", { class: "forge-v3-plan-modal-body forge-v3-live-output", ref: (el: HTMLElement | null) => { if (el) el.scrollTop = el.scrollHeight; } },
          h("div", { class: "forge-v3-live-output-status" }, h("span", { class: "forge-v3-live-dot", "aria-hidden": "true" }), listenStatus),
          h("div", { class: "forge-v3-live-feed forge-v3-af-feed" },
            listenMessages.length
              ? listenMessages.map((message, index) => {
                  const isThinking = message.kind === "thinking_delta" || message.kind === "thinking";
                  const tone = message.kind === "error" ? "err" : message.kind === "tool" ? "ok" : isThinking ? "me" : "live";
                  const label = message.kind === "tool" ? "tool" : isThinking ? "thinking" : message.kind === "prompt" ? "prompt" : message.kind === "error" ? "error" : "assistant";
                  return h("div", { key: `${index}-${message.kind}`, class: `forge-v3-live-line forge-v3-af-item kind-${message.kind}` },
                    h("div", { class: "forge-v3-af-dc" }, h("div", { class: `forge-v3-af-dot ${tone}` }), index < listenMessages.length - 1 ? h("div", { class: "forge-v3-af-line" }) : null),
                    h("div", { class: "forge-v3-af-content" },
                      h("div", { class: "forge-v3-af-row" }, h("span", { class: `forge-v3-af-actor ${tone === "me" ? "me" : "ag"}` }, label), h("span", { class: "forge-v3-af-time" }, `#${index + 1}`)),
                      h("pre", { class: "forge-v3-af-snippet forge-v3-live-snippet" }, message.text)
                    )
                  );
                })
              : h("p", { class: "forge-v3-empty" }, "Waiting for agent output…")
          )
        )
      )
    ) : null,
    diffModalOpen ? h("div", { class: "forge-v3-plan-sidecar-wrap", role: "dialog", "aria-modal": "false", "aria-label": reviewMode ? "Code review sidecar" : "Diff viewer" },
      h("section", { class: `forge-v3-plan-modal forge-v3-plan-sidecar forge-v3-diff-sidecar ${reviewMode ? "forge-v3-code-review-sidecar" : ""}` },
        h("header", null,
          h("div", null, h("div", { class: "forge-v3-issue-meta" }, reviewMode ? "Code review · " : "Diff · ", issue?.linear_id ?? `Issue #${issueId}`), h("h2", null, issue?.title ?? "Diff")),
          h("button", { type: "button", onClick: () => setDiffModalOpen(false), "aria-label": "Close diff" }, "×")
        ),
        reviewMode ? h("section", { class: "forge-v3-review-tour" },
          h("div", null,
            h("strong", null, "AI tour"),
            h("p", null, reviewTour?.tour?.summary ?? reviewTourStatus ?? "Tour summary unavailable")
          ),
          h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => generateReviewTour(Boolean(reviewTour?.tour)) }, reviewTour?.tour ? "Regenerate tour" : "Generate tour"),
          reviewTour?.tour?.highlights?.length ? h("ul", null, reviewTour.tour.highlights.map((highlight) => h("li", null, typeof highlight === "string" ? highlight : [highlight.title ? h("b", null, highlight.title, ": ") : null, highlight.text ?? highlight.file ?? "Highlight", highlight.file ? ` (${highlight.file}${highlight.line ? `:${highlight.line}` : ""})` : ""]))) : null
        ) : null,
        h("div", { class: "forge-v3-plan-modal-body forge-v3-diff-review" },
          diffStatus === "Loading diff…" ? h("div", { class: "forge-v3-diff-loading", role: "status" }, h("span", { class: "forge-v3-spinner", "aria-hidden": "true" }), h("span", null, "Loading diff…")) : diffStatus ? h("p", { class: "forge-v3-empty forge-v3-diff-error" }, diffStatus) : diffFiles.length === 0 ? h("p", { class: "forge-v3-empty" }, "No diff available.") : [
            h("aside", { class: "forge-v3-diff-file-list", "aria-label": "Changed files" },
              h("div", { class: "forge-v3-diff-side-label" }, "Files"),
              diffFiles.map((file) => h("button", { key: file.path, type: "button", class: activeDiffFile?.path === file.path ? "active" : "", title: file.path, onClick: () => setActiveDiffPath(file.path) },
                h("span", null, reviewMode ? h("span", { class: "forge-v3-reviewed-file" }, h("input", { type: "checkbox", checked: reviewedFiles.includes(file.path), onClick: (event: MouseEvent) => event.stopPropagation(), onChange: () => toggleReviewedFile(file.path) }), fileNameFromPath(file.path)) : fileNameFromPath(file.path)),
                h("small", { class: "forge-v3-diff-file-counts" }, h("span", { class: "add" }, `+${file.additions}`), " ", h("span", { class: "del" }, `−${file.deletions}`), reviewComments.some((comment) => comment.file === file.path) ? " · comments" : "")
              ))
            ),
            h("section", { class: "forge-v3-diff-main" },
              activeDiffFile ? h("article", { class: "forge-v3-diff-file" },
                h("header", null, h("strong", { title: activeDiffFile.path }, activeDiffFile.path), h("span", null, `+${activeDiffFile.additions} −${activeDiffFile.deletions}`), reviewMode ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => toggleReviewedFile(activeDiffFile.path) }, reviewedFiles.includes(activeDiffFile.path) ? "Reviewed ✓" : "Mark reviewed") : null),
                h("div", { class: "forge-v3-diff-table-wrap" },
                  h("table", { class: "forge-v3-diff-table" },
                    h("tbody", null, activeDiffFile.hunks.map((line, index) => h("tr", { key: `${index}-${line.slice(0, 12)}`, class: `forge-v3-diff-line ${diffLineClass(line)}` },
                      h("td", { class: "forge-v3-diff-ln" }, reviewMode ? h("button", { type: "button", title: "Add line comment", onClick: () => addReviewComment(activeDiffFile.path, index + 1) }, String(index + 1)) : String(index + 1)),
                      h("td", { class: "forge-v3-diff-sign" }, diffLineSign(line)),
                      h("td", { class: "forge-v3-diff-content" }, h("code", null, line.replace(/^[+-]/, "")))
                    )))
                  )
                ),
                reviewMode ? h("button", { type: "button", class: "forge-v3-inline-comment-button", onClick: () => addReviewComment(activeDiffFile.path, null) }, "+ Add file comment") : null
              ) : null
            )
          ]
        ),
        h("footer", null,
          reviewMode ? h("div", { class: "forge-v3-review-feedback" },
            h("label", null, "General feedback for the agent"),
            h("textarea", { rows: 3, placeholder: "Summarize concerns, test asks, or approval notes…", value: reviewFeedback, onInput: (event: Event) => setReviewFeedback((event.target as HTMLTextAreaElement).value) }),
            reviewComments.length ? h("div", { class: "forge-v3-review-comments" }, reviewComments.map((comment) => h("span", { key: comment.id }, `${comment.file}${comment.line ? `:${comment.line}` : ""} — ${comment.body}`))) : null
          ) : null,
          h("div", { class: "forge-v3-dp-actions" },
            reviewMode && codeDecision ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => resolveCodeReview("approved") }, "✓ Approve code") : null,
            reviewMode && codeDecision ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => resolveCodeReview("rejected") }, "✗ Request changes") : null,
            h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => setDiffModalOpen(false) }, "Close")
          )
        )
      )
    ) : null,
    jumpModalOpen ? h("div", { class: "forge-v3-plan-sidecar-wrap", role: "dialog", "aria-modal": "false", "aria-label": "Jump to workflow state" },
      h("section", { class: "forge-v3-plan-modal forge-v3-plan-sidecar forge-v3-jump-state-modal" },
        h("header", null,
          h("div", null, h("div", { class: "forge-v3-issue-meta" }, "Admin recovery · ", issue?.linear_id ?? `Issue #${issueId}`), h("h2", null, "Jump to state")),
          h("button", { type: "button", onClick: () => setJumpModalOpen(false), "aria-label": "Close jump to state" }, "×")
        ),
        h("div", { class: "forge-v3-plan-modal-body" },
          h("p", { class: "forge-v3-jump-state-copy" }, "Move this issue to a selected workflow phase. History is preserved; Forge continues from that phase on the next scheduler tick."),
          h("div", { class: "forge-v3-jump-state-list" },
            jumpStateOptions.map((option) => h("button", { key: option.state, type: "button", class: `forge-v3-jump-state-option ${option.risky ? "risky" : ""}`, onClick: () => jumpToState(option) },
              h("strong", null, option.label),
              h("code", null, option.state),
              h("span", null, option.hint),
              option.risky ? h("em", null, "Requires confirmation") : null
            ))
          )
        ),
        h("footer", null, h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => setJumpModalOpen(false) }, "Cancel"))
      )
    ) : null,
    h("div", { class: "forge-v3-detail-bottom" },
      h("section", { class: "forge-v3-ds forge-v3-admin-zone forge-v3-danger-zone" },
        h("details", { class: "forge-v3-danger-accordion" },
          h("summary", null, h("span", null, "Admin & runtime"), h("span", { class: "forge-v3-danger-chevron" }, "›")),
          h("p", null, "Operational recovery controls. Destructive actions require typed confirmation."),
          adminStatus ? h("div", { class: `forge-v3-admin-status ${adminStatus.includes("failed") ? "failed" : ""}` }, adminStatus) : null,
          h("div", { class: "forge-v3-dp-actions" },
            h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !issue?.id, onClick: launchRuntime }, "🚀 Launch runtime"),
            h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: onStopVm }, "■ Stop VM runtime"),
            issue?.steering_context ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: clearSteering }, "⌫ Clear steering") : null,
            issue?.state === "IGNORED" ? h("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !issue?.id, onClick: () => issue?.id ? onIssueAction(issue.id, "unignore") : undefined }, "▶ Unignore") : h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !issue?.id || issue?.state === "DONE", onClick: () => issue?.id ? onIssueAction(issue.id, "ignore") : undefined }, "🚫 Ignore"),
            h("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", disabled: !issue?.id || issue?.state === "DONE", onClick: fullResetIssue }, "↺ Full reset"),
            h("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", disabled: !issue?.id || isRunningIssue(safeIssue), onClick: removeSelectedIssue }, "🗑 Remove issue")
          )
        )
      )
    )
  );
}

const DETAIL_PANEL_WIDTH_STORAGE_KEY = "forge.v3.detailPanelWidth";
const DEFAULT_DETAIL_PANEL_WIDTH = 500;
const MIN_DETAIL_PANEL_WIDTH = 440;
const MAX_DETAIL_PANEL_WIDTH = 760;

function clampDetailPanelWidth(width: number): number {
  return Math.min(MAX_DETAIL_PANEL_WIDTH, Math.max(MIN_DETAIL_PANEL_WIDTH, Math.round(width)));
}

function storedDetailPanelWidth(): number {
  const raw = window.localStorage.getItem(DETAIL_PANEL_WIDTH_STORAGE_KEY);
  const parsed = raw ? Number(raw) : DEFAULT_DETAIL_PANEL_WIDTH;
  return Number.isFinite(parsed) ? clampDetailPanelWidth(parsed) : DEFAULT_DETAIL_PANEL_WIDTH;
}

function DashboardShell() {
  const initialRoute = parseDashboardRoute();
  const [status, setStatus] = useState<ShellStatus>(DEFAULT_STATUS);
  const [overview, setOverview] = useState<Overview>({ issues: [], decisions: [], runningAgents: [] });
  const [linearBacklog, setLinearBacklog] = useState<LinearBacklogIssue[]>([]);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(initialRoute.view === "queue" ? initialRoute.issueId : null);
  const [detailAutoOpenDiffKey, setDetailAutoOpenDiffKey] = useState(0);
  const [activeView, setActiveView] = useState<NavKey>(initialRoute.view);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState("");
  const [detailReloadKey, setDetailReloadKey] = useState(0);
  const [addIssueOpen, setAddIssueOpen] = useState(initialRoute.addIssue);
  const [detailPanelWidth, setDetailPanelWidth] = useState(storedDetailPanelWidth);
  const [eventStreamStatus, setEventStreamStatus] = useState<"connecting" | "live" | "offline">("connecting");
  const [desktopNotificationsAvailable, setDesktopNotificationsAvailable] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | "unsupported">(() => browserNotificationPermission());
  const desktopNotificationsAvailableRef = useRef(false);
  const notifiedDecisionIds = useRef<Set<number>>(new Set());
  const selectedIssueIdRef = useRef<number | null>(selectedIssueId);
  const overviewRef = useRef<Overview>({ issues: [], decisions: [], runningAgents: [] });

  const issueDetailSignature = (data: Overview, issueId: number | null) => {
    if (!issueId) return "";
    const issue = data.issues.find((entry) => entry.id === issueId);
    const decisions = data.decisions.filter((decision) => decision.issue_id === issueId).map((decision) => `${decision.id}:${decision.type}`).sort().join(",");
    return `${issue?.state ?? ""}|${issue?.updated_at ?? ""}|${decisions}`;
  };

  const refreshDashboard = () => Promise.all([getJson<unknown>("/api/overview"), getJson<Settings>("/api/settings"), getJson<ArchiveIssue[]>("/api/archive").catch(() => [] as ArchiveIssue[])])
    .then(([overviewValue, settings, archiveIssues]) => {
      const nextOverview = normalizeOverview(overviewValue);
      overviewRef.current = nextOverview;
      setOverview(nextOverview);
      setStatus({ ...shellStatusFromData(nextOverview, settings), archiveCount: archiveIssues.length });
      nextOverview.decisions.forEach((decision) => {
        if (notifiedDecisionIds.current.has(decision.id)) return;
        notifiedDecisionIds.current.add(decision.id);
        notifyPendingDecisionOnce(decision, nextOverview.issues.find((issue) => issue.id === decision.issue_id), desktopNotificationsAvailableRef.current).catch(() => undefined);
      });
      return nextOverview;
    });

  const runAction = (label: string, action: () => Promise<unknown>) => {
    setActionStatus(`${label}…`);
    action()
      .then(() => refreshDashboard())
      .then(() => { setDetailReloadKey((key) => key + 1); setActionStatus(`${label} complete`); })
      .catch((err: unknown) => {
        setActionStatus(`${label} failed`);
        const message = err instanceof Error ? err.message : String(err);
        showForgeError({ title: `${label} failed`, message });
      });
  };

  const handleResolveDecision = (decisionId: number, verdict: DecisionVerdict, feedback?: unknown) => {
    // Optimistically remove the decision from the sidebar and advance the issue state
    // so the fix-approval section disappears before the server round-trip completes.
    const DECISION_NEXT_STATE: Record<string, Record<string, string>> = {
      approved: { PLAN_REVIEW: "WORKING", CODE_REVIEW: "CREATING_PR", FIX_APPROVAL: "FIXING", SPLIT_APPROVAL: "SPLITTING" },
      rejected: { PLAN_REVIEW: "PLANNING", CODE_REVIEW: "WORKING", FIX_APPROVAL: "WATCHING_PR", SPLIT_APPROVAL: "WATCHING_PR" },
    };
    setOverview((prev) => {
      const decision = prev.decisions.find((d) => d.id === decisionId);
      const nextState = decision?.type ? DECISION_NEXT_STATE[verdict]?.[decision.type] : undefined;
      return {
        ...prev,
        decisions: prev.decisions.filter((d) => d.id !== decisionId),
        issues: nextState && decision
          ? prev.issues.map((i) => i.id === decision.issue_id ? { ...i, state: nextState as Issue["state"] } : i)
          : prev.issues,
      };
    });
    runAction(
      verdict === "approved" ? "Decision approved" : "Decision changes requested",
      () => resolveDecisionAction(decisionId, verdict, feedback).catch((err: unknown) => {
        // 409 = already resolved — treat as success, no need to restore the decision.
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("409") || msg.toLowerCase().includes("already resolved")) return;
        // Real error — restore the decision so the user can try again.
        setOverview((prev) => ({
          ...prev,
          decisions: prev.decisions.some((d) => d.id === decisionId)
            ? prev.decisions
            : [...prev.decisions, { id: decisionId } as Decision],
        }));
        throw err;
      })
    );
  };
  const handleIssueAction = (issueId: number, action: IssueAction, payload?: Record<string, unknown>) => runAction(`Issue ${action}`, () => runIssueAction(issueId, action, payload));
  const handleRemoveIssue = (issueId: number) => runAction("Issue removed", () => removeIssue(issueId).then(() => closeIssue()));
  const handleLaunchRuntime = (issueId: number) => launchIssueRuntime(issueId);
  const handleStopVm = async () => {
    const confirmed = await showForgeConfirm({ title: "Stop VM runtime?", message: "Stop the VM/runtime used by Forge. Running app processes may be terminated.", confirmText: "Stop VM", danger: true });
    if (!confirmed) return;
    runAction("VM runtime stopped", () => stopVmRuntime());
  };
  const handleSyncPrs = (issueId: number) => runAction("PR stack synced", () => syncIssuePrs(issueId));
  const handleSubmitFeedback = (issueId: number, body: string, prNumber?: number | null) => runAction("PR feedback added", () => submitIssueFeedback(issueId, body, prNumber));
  const openIssue = (issueId: number) => {
    setSelectedIssueId(issueId);
    setActiveView("queue");
    window.requestAnimationFrame(() => syncDashboardRoute("queue", { issueId }));
  };

  const closeIssue = () => {
    setSelectedIssueId(null);
    syncDashboardRoute("queue");
  };

  const openReviewIssue = (issueId: number, _decisionId?: number) => {
    setSelectedIssueId(issueId);
    setActiveView("queue");
    setDetailAutoOpenDiffKey((key) => key + 1);
    syncDashboardRoute("queue", { issueId });
  };

  const openReviewNext = () => {
    const nextDecision = selectReviewNextDecision(overview.decisions, overview.issues);
    if (!nextDecision) return;
    openReviewIssue(nextDecision.issue_id, nextDecision.id);
  };

  const openAddIssue = () => {
    setActiveView("queue");
    setAddIssueOpen(true);
    updateDashboardQuery({ view: "queue", add: "issue" }, false);
  };

  const closeAddIssue = () => {
    setAddIssueOpen(false);
    updateDashboardQuery({ add: null });
  };

  const refreshLinearBacklog = () => runAction("Linear backlog refreshed", () => getJson<LinearBacklogIssue[]>("/api/linear/issues").then((issues) => setLinearBacklog(Array.isArray(issues) ? issues : [])));
  const createManualIssueFromQueue = (title: string, description = "") => runAction("Manual issue created", () => createManualIssue(title, description).then((result) => { if (result.issueId) openIssue(result.issueId); }));
  const enqueueLinearIssue = (linearId: string, planningGuidance = "") => runAction(`Enqueued ${linearId}`, () => enqueueLinearIssueApi(linearId, planningGuidance).then((result) => { if (result.issueId) openIssue(result.issueId); }).then(() => getJson<LinearBacklogIssue[]>("/api/linear/issues")).then((issues) => setLinearBacklog(Array.isArray(issues) ? issues : [])));

  const requestNotificationPermission = () => {
    if (desktopNotificationsAvailable) {
      setActionStatus("Sending desktop companion notification…");
      sendDesktopNotification("Forge notifications enabled", "Desktop companion notifications are available", "forge-desktop-test")
        .then(() => setActionStatus("Desktop companion notification sent"))
        .catch(() => setActionStatus("Desktop companion notification failed"));
      return;
    }
    if (!browserNotificationsAvailable()) {
      setNotificationPermission("unsupported");
      return;
    }
    window.Notification.requestPermission().then((permission) => setNotificationPermission(permission));
  };

  const navigateToView = (view: NavKey) => {
    setActiveView(view);
    setSelectedIssueId(null);
    syncDashboardRoute(view);
  };

  const startDetailPanelResize = (event: PointerEvent) => {
    event.preventDefault();
    document.body.classList.add("forge-v3-resizing-detail");
    const resize = (nextEvent: PointerEvent) => setDetailPanelWidth(clampDetailPanelWidth(window.innerWidth - nextEvent.clientX));
    const stop = () => {
      document.body.classList.remove("forge-v3-resizing-detail");
      window.removeEventListener("pointermove", resize);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
    window.addEventListener("pointermove", resize);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--panel-w", `${detailPanelWidth}px`);
    window.localStorage.setItem(DETAIL_PANEL_WIDTH_STORAGE_KEY, String(detailPanelWidth));
  }, [detailPanelWidth]);

  useEffect(() => {
    selectedIssueIdRef.current = selectedIssueId;
  }, [selectedIssueId]);

  useEffect(() => {
    if (!actionStatus || actionStatus.endsWith("…")) return;
    const timeout = window.setTimeout(() => setActionStatus(""), 3500);
    return () => window.clearTimeout(timeout);
  }, [actionStatus]);

  useEffect(() => {
    let cancelled = false;
    loadDesktopCapabilities()
      .then((capabilities) => {
        if (cancelled) return;
        const available = !!capabilities.notifications;
        desktopNotificationsAvailableRef.current = available;
        setDesktopNotificationsAvailable(available);
      })
      .catch(() => {
        if (cancelled) return;
        desktopNotificationsAvailableRef.current = false;
        setDesktopNotificationsAvailable(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandPaletteOpen((open) => !open);
      }
      if (event.key === "Escape") setCommandPaletteOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const onRouteChange = () => {
      const route = parseDashboardRoute();
      setActiveView(route.view);
      setSelectedIssueId(route.issueId);
      setAddIssueOpen(route.addIssue);
      if (route.decisionId || route.panel === "review") setDetailAutoOpenDiffKey((key) => key + 1);
    };
    window.addEventListener("hashchange", onRouteChange);
    window.addEventListener("popstate", onRouteChange);
    return () => {
      window.removeEventListener("hashchange", onRouteChange);
      window.removeEventListener("popstate", onRouteChange);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const refreshStatus = () => {
      refreshDashboard()
        .catch(() => {
          if (!cancelled) setStatus(DEFAULT_STATUS);
        });
    };

    refreshStatus();
    getJson<LinearBacklogIssue[]>("/api/linear/issues").then((issues) => { if (!cancelled) setLinearBacklog(Array.isArray(issues) ? issues : []); }).catch(() => undefined);
    const interval = window.setInterval(refreshStatus, eventStreamStatus === "offline" ? 10_000 : 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [eventStreamStatus]);

  useEffect(() => {
    if (mockStatesEnabled()) return;
    let closed = false;
    const events = new EventSource("/api/events");
    const refreshFromEvent = (event: Event) => {
      const selectedBefore = selectedIssueIdRef.current;
      const beforeSignature = issueDetailSignature(overviewRef.current, selectedBefore);
      refreshDashboard()
        .then((nextOverview) => {
          if (!selectedBefore) return;
          if (event.type !== "tick" || issueDetailSignature(nextOverview, selectedBefore) !== beforeSignature) {
            setDetailReloadKey((key) => key + 1);
          }
        })
        .catch(() => undefined);
    };
    events.onopen = () => { if (!closed) setEventStreamStatus("live"); };
    events.onerror = () => { if (!closed) setEventStreamStatus("offline"); };
    ["tick", "issue_added", "issue_removed", "decision_resolved"].forEach((eventName) => {
      events.addEventListener(eventName, refreshFromEvent);
    });
    return () => {
      closed = true;
      events.close();
    };
  }, []);

  const selectedIssuePreview = selectedIssueId ? overview.issues.find((issue) => issue.id === selectedIssueId) ?? null : null;

  return h(
    "div",
    { class: "forge-v3-shell forge-v3-app-frame", "data-forge-v3-shell": "true" },
    h(
      "aside",
      { class: "forge-v3-sidebar", "aria-label": "Forge navigation" },
      h("div", { class: "forge-v3-brand" },
        h("span", { class: "forge-v3-brand-mark", "aria-hidden": "true" }, "⚒️"),
        h("span", { class: "forge-v3-brand-text" }, "Forge"),
        h("span", { class: "forge-v3-brand-version" }, "v3.0")
      ),
      h("nav", { class: "forge-v3-nav", "aria-label": "Primary dashboard views" },
        NAV_ITEMS.slice(0, 2).map((item) =>
          h("button", { key: item.key, type: "button", class: `forge-v3-nav-item ${activeView === item.key ? "active" : ""}`, "data-view": item.key, onClick: () => { setActiveView(item.key); setSelectedIssueId(null); syncDashboardRoute(item.key); } },
            h("span", { class: "forge-v3-nav-icon", "aria-hidden": "true" }, item.icon),
            h("span", { class: "forge-v3-nav-label" }, item.label),
            item.key === "queue" && status.awaitingDecisionsCount > 0 ? h("span", { class: "forge-v3-nav-badge", "aria-label": `${status.awaitingDecisionsCount} pending decisions` }, String(status.awaitingDecisionsCount)) : item.key === "archive" ? h("span", { class: "forge-v3-nav-count" }, String(status.archiveCount)) : null
          )
        ),
        h("div", { class: "forge-v3-nav-section" }, "TOOLS"),
        h("button", { type: "button", class: "forge-v3-nav-item", onClick: () => setCommandPaletteOpen(true) }, h("span", { class: "forge-v3-nav-icon" }, "⌘"), h("span", { class: "forge-v3-nav-label" }, "Command palette"), h("kbd", null, "⌘K")),
        NAV_ITEMS.slice(2).map((item) =>
          h("button", { key: item.key, type: "button", class: `forge-v3-nav-item ${activeView === item.key ? "active" : ""}`, "data-view": item.key, onClick: () => { setActiveView(item.key); setSelectedIssueId(null); syncDashboardRoute(item.key); } },
            h("span", { class: "forge-v3-nav-icon", "aria-hidden": "true" }, item.icon),
            h("span", { class: "forge-v3-nav-label" }, item.label),
            item.key === "learnings" && status.learningSuggestionsCount > 0 ? h("span", { class: "forge-v3-nav-count" }, String(status.learningSuggestionsCount)) : null
          )
        )
      ),
      h("footer", { class: "forge-v3-status", "aria-label": "Forge status" },
        h("div", { class: "forge-v3-runtime-line" }, h("span", null, h("i", { class: `forge-v3-status-dot scheduler-${status.scheduler}`, "aria-hidden": "true" }), " Scheduler ", status.scheduler)),
        h("div", { class: "forge-v3-concurrency-wrap" },
          h("div", { class: "forge-v3-concurrency-pips", "aria-label": `${status.runningAgentsCount} of ${status.concurrencyLimit} agent slots active` },
            Array.from({ length: Math.max(status.concurrencyLimit, status.runningAgentsCount) }).slice(0, 8).map((_, index) => h("span", { class: index < status.runningAgentsCount ? "active" : "" }))
          ),
          h("span", null, status.runningAgentsCount, " / ", status.concurrencyLimit, " agent slots")
        ),
        h("div", { class: "forge-v3-sidebar-stats" },
          h("div", null, h("strong", null, String(status.activeCount)), h("span", null, "ACTIVE")),
          h("div", null, h("strong", null, String(status.awaitingDecisionsCount)), h("span", null, "NEEDS YOU")),
          h("div", null, h("strong", null, String(status.doneThisWeekCount)), h("span", null, "DONE WK")),
          h("div", null, h("strong", null, String(status.failedCount)), h("span", null, "FAILED"))
        ),
        h("div", { class: `forge-v3-session-chip event-${eventStreamStatus}` }, eventStreamStatus === "live" ? "● Live events" : eventStreamStatus === "offline" ? "○ Events offline · polling" : "◌ Connecting events"),
        h("button", { type: "button", class: `forge-v3-notification-toggle ${desktopNotificationsAvailable ? "desktop" : "browser"}`, disabled: !desktopNotificationsAvailable && (notificationPermission === "unsupported" || notificationPermission === "denied" || notificationPermission === "granted"), onClick: requestNotificationPermission }, desktopNotificationsAvailable ? "🔔 Desktop companion" : notificationPermission === "granted" ? "🔔 Browser notifications on" : notificationPermission === "denied" ? "🔕 Notifications blocked" : notificationPermission === "unsupported" ? "🔕 Notifications unavailable" : "🔔 Enable browser notifications"),
        h("div", { class: "forge-v3-session-chip" }, desktopNotificationsAvailable ? "● Native notifications available" : "○ Browser notification fallback"),
        h("div", { class: "forge-v3-session-chip" }, "● Workspace · ", status.model),
        h("div", { class: "forge-v3-model-row" }, "🤖 ", status.backend)
      )
    ),
    actionStatus ? h("div", { class: "forge-v3-action-status", role: "status" }, actionStatus) : null,
    activeView === "queue"
      ? h(QueuePipelineView, { issues: overview.issues, decisions: overview.decisions, linearBacklog, selectedIssueId, addIssueOpen, onOpenIssue: openIssue, onIssueAction: handleIssueAction, onResolveDecision: handleResolveDecision, onReviewNext: openReviewNext, onReviewIssue: openReviewIssue, onAddIssue: openAddIssue, onCloseAddIssue: closeAddIssue, onRefreshLinear: refreshLinearBacklog, onCreateManualIssue: createManualIssueFromQueue, onEnqueueLinear: enqueueLinearIssue })
      : activeView === "archive"
        ? h(ArchiveView, null)
        : activeView === "settings"
          ? h(SettingsView, null)
          : activeView === "prompts"
            ? h(AgentPromptsView, null)
            : activeView === "learnings"
              ? h(LearningsView, null)
              : h("main", { class: "forge-v3-main", "data-active-view": activeView }, h("h1", null, NAV_ITEMS.find((item) => item.key === activeView)?.label ?? "Dashboard"), h("p", { class: "forge-v3-empty" }, "This v3 view will migrate in a later phase.")),
    h(IssueDetailPanel, { issueId: activeView === "queue" ? selectedIssueId : null, issuePreview: selectedIssuePreview, reloadKey: detailReloadKey, autoOpenDiffKey: detailAutoOpenDiffKey, onClose: closeIssue, onPanelResizeStart: startDetailPanelResize, onIssueAction: handleIssueAction, onRemoveIssue: handleRemoveIssue, onLaunchRuntime: handleLaunchRuntime, onStopVm: handleStopVm, onSyncPrs: handleSyncPrs, onSubmitFeedback: handleSubmitFeedback, onResolveDecision: handleResolveDecision }),
    h(CommandPalette, { open: commandPaletteOpen, decisions: overview.decisions, onClose: () => setCommandPaletteOpen(false), onNavigate: navigateToView, onRefresh: () => refreshDashboard(), onOpenIssue: openIssue, onReviewNext: openReviewNext, onAddIssue: openAddIssue, onStopVm: handleStopVm }),
    h(RuntimeDock, { status, onStopVm: handleStopVm })
  );
}

const root = document.getElementById("forge-react-root");

if (root) {
  render(h(DashboardShell, null), root);
  root.dataset.reactiveDashboardMounted = "true";
}
