import type { NavItem, PipelineStage, DetailTab, SettingGroup, AgentPromptType, JumpStateOption, PipelineStageKey, QueueFilter, QueueSort, LearningTabKey, ShellStatus } from "./types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Queue", key: "queue", hint: "Pipeline", icon: "⚡" },
  { label: "Archive", key: "archive", hint: "Completed", icon: "🗃️" },
  { label: "Settings", key: "settings", hint: "Runtime", icon: "⚙️" },
  { label: "Agent Prompts", key: "prompts", hint: "System prompts", icon: "📖" },
  { label: "Learnings", key: "learnings", hint: "Reflections", icon: "🧠" },
];

export const PIPELINE_STAGES: PipelineStage[] = [
  { key: "available", label: "Available", states: ["PENDING"] },
  { key: "active", label: "Active", states: ["SETTING_UP", "PLANNING", "AI_PLAN_REVIEWING", "WORKING", "AI_REVIEWING", "SPLIT_PLANNING", "SPLITTING", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "FIXING", "PUSHING", "REBASING"] },
  { key: "awaiting", label: "Awaiting You", states: ["AWAITING_PLAN_APPROVAL", "AWAITING_SPLIT_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW", "STEERING", "FAILED", "PAUSED", "IGNORED"] },
];

export const DETAIL_TABS: DetailTab[] = [
  { key: "overview", label: "Overview" },
  { key: "activity", label: "Activity" },
  { key: "ask", label: "Ask" },
];

export const SETTING_GROUPS: SettingGroup[] = [
  { label: "Automation", keys: ["concurrency_limit", "scheduler_interval_seconds", "ai_review_max_rounds", "auto_retry_max", "forge_reuse_pi_sessions"] },
  { label: "External Services", keys: ["linear_enabled", "linear_team", "github_repo", "github_use_desktop", "linear_poll_interval_seconds"] },
  { label: "Code Workspace", keys: ["worktree_provider", "repo_root", "wt_root", "worktree_root", "branch_prefix", "default_branch"] },
  { label: "Command Runtime", keys: ["runtime_mode", "vm_ssh_target", "host_path_prefix", "vm_path_prefix", "vm_frontend_staging_backend_command", "vm_frontend_local_backend_command", "vm_backend_staging_command", "vm_backend_local_command", "vm_database_command", "vm_command", "terminal_command"] },
  { label: "Agent Context", keys: ["project_prompt_overlay"] },
  { label: "Dashboard Backend", keys: ["dashboard_port", "backend", "backend_mode", "api_base_url"] },
];

export const SETTING_GROUP_DESCRIPTIONS: Record<SettingGroup["label"], string> = {
  Automation: "How many issues Forge can run, how often it wakes up, and how hard it should retry or loop before asking you.",
  "External Services": "Linear and GitHub identifiers used for issue lookup, PR links, review comments, and merge status.",
  "Code Workspace": "Git/worktree paths. For plain git worktrees, Repo root is the main clone and Worktree root is where issue worktrees are created. Worktrunk root is only used when Worktree tool is wt.",
  "Command Runtime": "How project commands are launched. Leave SSH fields blank for local-only command execution.",
  "Agent Context": "Repo-specific instructions appended to every agent prompt without editing the base prompt files.",
  "Dashboard Backend": "Connection details for this dashboard process and the desktop companion.",
  Other: "Settings in the database that this dashboard does not yet recognize.",
};

export const SETTING_LABELS: Record<string, { label: string; hint: string }> = {
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
  github_use_desktop: { label: "Run GitHub CLI on desktop", hint: "Use the desktop companion's local gh auth for GitHub PR polling. Leave off to run gh on the backend machine." },
  linear_poll_interval_seconds: { label: "Linear polling interval", hint: "How many seconds to wait between Linear sync/list checks when Linear integration is enabled." },
  worktree_provider: { label: "Worktree tool", hint: "Choose git for normal git worktree add. Choose wt only when Forge should call the Worktrunk CLI." },
  repo_root: { label: "Repo root / main clone", hint: "For Worktree tool = git: path to the real repository clone Forge fetches from and runs git worktree add against. Example: /home/user/repo. Do not use a Worktrunk metadata folder." },
  wt_root: { label: "Worktrunk root", hint: "Only for Worktree tool = wt. Path where the wt CLI should run. Leave blank when using normal git worktrees." },
  worktree_root: { label: "Issue worktrees folder", hint: "For Worktree tool = git: parent folder where Forge creates per-issue worktrees, e.g. /mnt/mac/Users/user/Projects." },
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

export const SETTING_PLACEHOLDERS: Record<string, string> = {
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

export const AGENT_PROMPT_TYPES: AgentPromptType[] = ["planner", "plan-reviewer", "coder", "reviewer", "git-agent", "fixer", "split-planner", "splitter", "rebaser", "reflector"];

export const PROMPT_MODEL_SETTINGS: Record<AgentPromptType, string> = {
  planner: "model_planner",
  "plan-reviewer": "model_plan_reviewer",
  coder: "model_coder",
  reviewer: "model_reviewer",
  "git-agent": "model_git_agent",
  fixer: "model_fixer",
  "split-planner": "model_split_planner",
  splitter: "model_splitter",
  rebaser: "model_rebaser",
  reflector: "model_reflector",
};

export const MODEL_SETTING_KEYS = ["model", "default_model", ...Object.values(PROMPT_MODEL_SETTINGS)];
export const KNOWN_SETTING_KEYS = new Set([...SETTING_GROUPS.flatMap((group) => group.keys), ...MODEL_SETTING_KEYS]);
export const NUMBER_SETTING_KEYS = new Set(SETTING_GROUPS.flatMap((group) => group.keys).filter((key) => inputTypeForSetting(key) === "number"));
export const BOOLEAN_SETTING_KEYS = new Set(SETTING_GROUPS.flatMap((group) => group.keys).filter((key) => inputTypeForSetting(key) === "checkbox"));
export const RUNTIME_SETTING_KEYS = new Set(["runtime_mode", "vm_ssh_target", "host_path_prefix", "vm_path_prefix", "vm_frontend_staging_backend_command", "vm_backend_staging_command", "vm_command", "terminal_command", "backend", "backend_mode", "api_base_url", "dashboard_port"]);

export function inputTypeForSetting(key: string): "number" | "checkbox" | "text" {
  if (key.includes("limit") || key.includes("seconds") || key.includes("rounds") || key.endsWith("_max") || key === "dashboard_port") return "number";
  if (key.startsWith("enable_") || key.startsWith("use_") || key.endsWith("_enabled") || key.includes("reuse") || key.includes("use_desktop")) return "checkbox";
  return "text";
}

export const LEARNING_TABS: Array<{ key: LearningTabKey; label: "Suggestions" | "Change log" | "Reflection history" }> = [
  { key: "suggestions", label: "Suggestions" },
  { key: "changes", label: "Change log" },
  { key: "reflections", label: "Reflection history" },
];

export const QUEUE_FILTERS: Array<{ key: QueueFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "needs-me", label: "Needs me" },
  { key: "running", label: "Running" },
  { key: "failed", label: "Failed" },
  { key: "watching-pr", label: "Watching PR" },
  { key: "paused", label: "Paused" },
];

export const QUEUE_SORTS: Array<{ key: QueueSort; label: string }> = [
  { key: "priority", label: "Priority" },
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "recently-updated", label: "Recently updated" },
];

export const NEXT_STATE_BY_STATE: Record<string, string> = {
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
  FIXING: "AWAITING_FIX_REVIEW",
  AWAITING_FIX_REVIEW: "PUSHING",
  PUSHING: "WATCHING_PR",
  REBASING: "WATCHING_PR",
  FAILED: "WORKING",
  PAUSED: "WORKING",
  IGNORED: "WORKING",
};

export const JUMP_STATE_OPTIONS: JumpStateOption[] = [
  { state: "PLANNING", label: "Re-plan", hint: "Run the planner agent again" },
  { state: "WORKING", label: "Code", hint: "Jump straight to the coder agent" },
  { state: "AI_REVIEWING", label: "AI Review", hint: "Run the AI reviewer on current code" },
  { state: "CREATING_PR", label: "Create PR", hint: "Skip to PR creation" },
  { state: "FIXING", label: "Fix", hint: "Jump to the fixer agent" },
  { state: "AWAITING_FIX_REVIEW", label: "Fix review", hint: "Review the fix before pushing" },
  { state: "WATCHING_PR", label: "Watch PR", hint: "Monitor open PRs for CI / reviews" },
  { state: "REBASING", label: "Rebase", hint: "Resolve rebase conflicts and push carefully" },
  { state: "SPLIT_PLANNING", label: "Plan Split", hint: "Ask an agent to propose a stacked PR split" },
  { state: "SPLITTING", label: "Split Stack", hint: "Execute the approved stacked PR split", risky: true },
  { state: "IN_MERGE_QUEUE", label: "Merge Queue", hint: "Mark PRs as entered into merge queue", risky: true },
  { state: "DONE", label: "Mark Done", hint: "Archive this issue as complete", risky: true },
];

export const STATE_PROCESS_ORDER: Record<string, number> = {
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
  AWAITING_FIX_REVIEW: 165,
  PUSHING: 170,
  REBASING: 175,
  DONE: 180,
  STEERING: 190,
  FAILED: 200,
  PAUSED: 210,
  IGNORED: 220,
};

export const STATE_TO_PIPELINE_STAGE: Record<string, PipelineStageKey> = {
  PENDING: "available",
  SETTING_UP: "active",
  PLANNING: "active",
  AI_PLAN_REVIEWING: "active",
  SPLIT_PLANNING: "active",
  SPLITTING: "active",
  WORKING: "active",
  AI_REVIEWING: "active",
  FIXING: "active",
  AWAITING_FIX_REVIEW: "awaiting",
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

export const DEFAULT_STATUS: ShellStatus = {
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

export const PHASES = ["Setup", "Plan", "Code", "Review", "PR", "Watch", "Done"];

/** Per-agent-type stuck thresholds in minutes */
export const AGENT_STUCK_THRESHOLDS: Record<string, number> = {
  planner: 8,
  "plan-reviewer": 6,
  coder: 20,
  reviewer: 10,
  "git-agent": 5,
  fixer: 15,
  watcher: 30,
  setup: 5,
  "split-planner": 8,
  splitter: 15,
  rebaser: 10,
};

export const DETAIL_PANEL_WIDTH_STORAGE_KEY = "forge.v3.detailPanelWidth";
export const DEFAULT_DETAIL_PANEL_WIDTH = 500;
export const MIN_DETAIL_PANEL_WIDTH = 440;
export const MAX_DETAIL_PANEL_WIDTH = 760;

export const QUEUE_PREFS_STORAGE_KEY = "forge.v3.queuePrefs";
