export type NavKey = "queue" | "archive" | "settings" | "prompts" | "learnings";
export type PipelineStageKey = "available" | "active" | "awaiting";
export type QueueFilter = "all" | "needs-me" | "running" | "failed" | "watching-pr" | "paused";
export type QueueSort = "priority" | "newest" | "oldest" | "recently-updated";

export type NavItem = {
  label: "Queue" | "Archive" | "Settings" | "Agent Prompts" | "Learnings";
  key: NavKey;
  hint: string;
  icon: string;
};

export type DesktopCapabilities = {
  notifications?: boolean;
};

export type ShellStatus = {
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

export type PrStackItem = {
  pr_number?: number | null;
  branch?: string | null;
  gt_branch?: string | null;
  status?: string | null;
  reviewDecision?: string | null;
  mergeable?: string | null;
  isInMergeQueue?: boolean | null;
  mergeQueuePosition?: number | null;
  mergeQueueEnqueuedAt?: string | null;
  checksTotal?: number | null;
  checksFailed?: number | null;
  checksPending?: number | null;
  liveState?: string | null;
  url?: string | null;
};

export type Issue = {
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

export type LinearBacklogIssue = {
  identifier: string;
  title?: string | null;
  priority?: number | null;
  state?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
};

export type ActivityLogEntry = {
  id?: number;
  type?: string | null;
  actor?: string | null;
  message?: string | null;
  metadata?: string | null;
  created_at?: string | null;
};

export type AgentRun = {
  id?: number;
  agent_type?: string;
  started_at?: string;
  exited_at?: string | null;
  exit_code?: number | null;
  log_path?: string | null;
};

export type FailureContext = {
  run?: AgentRun | null;
  logTail?: string | null;
};

export type IssueDetail = {
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

export type ArchiveIssue = Issue & {
  run_count?: number | null;
  pr_count?: number | null;
  merged?: string | null;
  created_at?: string | null;
  hasSummary?: boolean;
  summaryContent?: string | null;
  prStack?: PrStackItem[];
};

export type Decision = {
  id: number;
  issue_id: number;
  type?: string | null;
  issueTitle?: string | null;
  artifact_ref?: string | null;
  verdict?: DecisionVerdict | string | null;
  resolved_at?: string | null;
};

export type FixApprovalComment = {
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

export type DecisionArtifact = {
  comments?: FixApprovalComment[];
  summary?: string;
  plan?: string;
  proposedStack?: Array<{ branch?: string; title?: string; summary?: string }>;
  stack?: Array<{ branch?: string; title?: string; summary?: string }>;
};

export type Overview = {
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

export type Settings = Record<string, string | undefined>;

export type DesktopBackend = {
  backendOrigin?: string;
  configFile?: string;
};

export type PipelineStage = {
  key: PipelineStageKey;
  label: string;
  states: string[];
};

export type DetailTab = {
  key: "overview" | "activity" | "ask";
  label: "Overview" | "Activity" | "Ask";
};

export type ReviewFile = {
  path: string;
  additions: number;
  deletions: number;
  hunks: string[];
};

export type DiffPayload = {
  diff?: string;
  baseBranch?: string;
  baseRef?: string;
  error?: string;
};

export type ReviewTourPayload = {
  tour?: {
    summary?: string;
    highlights?: Array<string | { title?: string; text?: string; file?: string; line?: number }>;
    files?: Array<{ path?: string; summary?: string; risk?: string }>;
  } | null;
  generating?: boolean;
  created_at?: string;
};

export type ReviewComment = {
  id: string;
  file: string;
  line: number | null;
  body: string;
};

export type SettingGroup = {
  label: "Automation" | "External Services" | "Code Workspace" | "Command Runtime" | "Agent Context" | "Dashboard Backend" | "Other";
  keys: string[];
};

export type SettingEntry = {
  key: string;
  value: string;
};

export type AgentPromptType = "planner" | "plan-reviewer" | "coder" | "reviewer" | "git-agent" | "fixer" | "split-planner" | "splitter" | "rebaser" | "reflector";

export type AgentPromptState = {
  type: AgentPromptType;
  content: string;
  status: string;
};

export type JumpStateOption = {
  state: string;
  label: string;
  hint: string;
  risky?: boolean;
};

export type LearningTabKey = "suggestions" | "changes" | "reflections";

export type LearningSuggestion = {
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

export type LearningEvent = {
  id: number;
  issue_title?: string | null;
  linear_id?: string | null;
  event_type?: string | null;
  summary?: string | null;
  created_at?: string | null;
};

export type LearningChange = {
  id: number;
  issue_title?: string | null;
  linear_id?: string | null;
  target?: string | null;
  change_type?: string | null;
  change_summary?: string | null;
  reason?: string | null;
  created_at?: string | null;
};

export type LearningsPayload = {
  suggestions: LearningSuggestion[];
  events: LearningEvent[];
  changes: LearningChange[];
};

export type IssueAction = "pause" | "unpause" | "retry" | "ignore" | "unignore" | "split-pr-stack" | "rebase" | "steer" | "clear-steer" | "advance" | "reset" | "set-auto-fix";
export type DecisionVerdict = "approved" | "rejected";
export type CommandItem = { label: string; action: () => void; disabled?: boolean };

export type DashboardRoute = {
  view: NavKey;
  issueId: number | null;
  decisionId: number | null;
  detailTab: DetailTab["key"];
  panel: "plan" | "diff" | "review" | "listen" | "jump" | null;
  diffPath: string;
  addIssue: boolean;
};

export type ForgePromptOptions = {
  title: string;
  message?: string;
  label?: string;
  initialValue?: string;
  placeholder?: string;
  confirmText?: string;
  danger?: boolean;
  requiredText?: string;
};
