import type { AgentRun, ArchiveIssue, Decision, DecisionArtifact, DecisionVerdict, FixApprovalComment, Issue, IssueDetail, LinearBacklogIssue, Overview, PipelineStageKey, PrStackItem, QueueFilter, QueueSort, ReviewFile, Settings, ShellStatus, DashboardRoute, NavKey, DetailTab } from "./types";
import { PIPELINE_STAGES, STATE_TO_PIPELINE_STAGE, STATE_PROCESS_ORDER, NEXT_STATE_BY_STATE, NAV_ITEMS, AGENT_STUCK_THRESHOLDS } from "./constants";

/* ── Timestamp helpers ── */

/**
 * Parse a timestamp string from SQLite (which omits the timezone indicator)
 * as UTC, preventing the browser from mis-interpreting it as local time.
 */
export function parseTimestamp(ts: string): number {
  if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(ts) && !ts.endsWith("Z") && !ts.includes("+")) {
    return new Date(ts.replace(" ", "T") + "Z").getTime();
  }
  return new Date(ts).getTime();
}

export function timeValue(value?: string | null): number {
  const time = value ? parseTimestamp(value) : 0;
  return Number.isFinite(time) ? time : 0;
}

export function timeAgoShort(timestamp?: string | null): string {
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

export function formatDateTime(timestamp?: string | null): string {
  if (!timestamp) return "date unknown";
  const parsed = parseTimestamp(timestamp);
  if (!Number.isFinite(parsed)) return timestamp;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(parsed));
}

/* ── Priority helpers ── */

export function priorityGlyph(priority?: number | null): string {
  if (priority === 1) return "▰▰▰";
  if (priority === 2) return "▰▰░";
  if (priority === 3) return "▰░░";
  if (priority === 4) return "░░░";
  return "□□□";
}

export function priorityLabel(priority?: number | null): string {
  if (priority === 1) return "urgent";
  if (priority === 2) return "high";
  if (priority === 3) return "medium";
  if (priority === 4) return "low";
  return "none";
}

export function priorityClass(priority?: number | null): string {
  if (priority === 1) return "priority-urgent";
  if (priority === 2) return "priority-high";
  return "priority-normal";
}

/* ── Issue state helpers ── */

export function classifyIssueToPipelineStage(issue: Issue): PipelineStageKey {
  return STATE_TO_PIPELINE_STAGE[issue.state ?? ""] ?? "active";
}

export function issueStateLabel(issue: Issue): string {
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
    AWAITING_FIX_REVIEW: "awaiting fix review",
    PUSHING: "pushing",
    REBASING: "rebasing",
    FAILED: "failed",
    PAUSED: "paused",
    IGNORED: "ignored",
    DONE: "done",
  } as Record<string, string>)[state] ?? state.toLowerCase().replaceAll("_", " ");
}

export function issueStatePillClass(issue: Issue): string {
  const state = issue.state ?? "";
  if (state === "AWAITING_CODE_REVIEW") return "forge-v3-state-pill pill-code";
  if (state === "WATCHING_PR") return "forge-v3-state-pill pill-watching";
  if (state === "IN_MERGE_QUEUE") return "forge-v3-state-pill pill-merge";
  if (state === "FAILED") return "forge-v3-state-pill pill-failed";
  const stage = classifyIssueToPipelineStage(issue);
  return `forge-v3-state-pill pill-${stage}`;
}

export function isRunningIssue(issue: Issue): boolean {
  return ["SETTING_UP", "PLANNING", "AI_PLAN_REVIEWING", "SPLIT_PLANNING", "SPLITTING", "WORKING", "AI_REVIEWING", "FIXING", "PUSHING", "REBASING", "CREATING_PR"].includes(issue.state ?? "");
}

export function canListenLive(issue: Issue): boolean {
  return isRunningIssue(issue);
}

export function isPrApproved(issue: Issue): boolean {
  return Boolean(issue.pr_approved_at || (issue.prStack ?? []).some((pr) => String(pr.reviewDecision ?? "").toUpperCase() === "APPROVED"));
}

export function isPrMerged(pr: PrStackItem): boolean {
  return String(pr.status ?? "").toLowerCase() === "merged" || String(pr.liveState ?? "").toUpperCase() === "MERGED";
}

export function isIssueMergedPendingArchive(issue: Issue): boolean {
  const prs = (issue.prStack ?? []).filter((pr) => pr.pr_number);
  return issue.state !== "DONE" && prs.length > 0 && prs.every(isPrMerged);
}

export function isQueueIssue(issue: Issue): boolean {
  return issue.state !== "DONE";
}

export function isIssueStuck(issue: Issue): boolean {
  if (!issue.updated_at) return false;
  const updatedAt = parseTimestamp(issue.updated_at);
  return Number.isFinite(updatedAt) && Date.now() - updatedAt > 24 * 60 * 60 * 1000;
}

/** Check if a running issue exceeds its per-agent-type stuck threshold */
export function isAgentStuck(issue: Issue): boolean {
  if (!isRunningIssue(issue) || !issue.updated_at) return false;
  const state = issue.state ?? "";
  const agentType = stateToAgentType(state);
  const thresholdMinutes = AGENT_STUCK_THRESHOLDS[agentType] ?? 30;
  const updatedAt = parseTimestamp(issue.updated_at);
  return Number.isFinite(updatedAt) && Date.now() - updatedAt > thresholdMinutes * 60 * 1000;
}

export function stateToAgentType(state: string): string {
  const map: Record<string, string> = {
    SETTING_UP: "setup", PLANNING: "planner", AI_PLAN_REVIEWING: "plan-reviewer",
    WORKING: "coder", AI_REVIEWING: "reviewer", CREATING_PR: "git-agent",
    FIXING: "fixer", PUSHING: "git-agent", REBASING: "rebaser",
    SPLIT_PLANNING: "split-planner", SPLITTING: "splitter",
  };
  return map[state] ?? "agent";
}

export function agentStuckLabel(issue: Issue): string | null {
  if (!isRunningIssue(issue) || !issue.updated_at) return null;
  const agentType = stateToAgentType(issue.state ?? "");
  const thresholdMinutes = AGENT_STUCK_THRESHOLDS[agentType] ?? 30;
  const updatedAt = parseTimestamp(issue.updated_at);
  if (!Number.isFinite(updatedAt)) return null;
  const elapsedMinutes = (Date.now() - updatedAt) / 60_000;
  if (elapsedMinutes > thresholdMinutes) return `⚠ ${agentType} > ${thresholdMinutes}m`;
  if (elapsedMinutes > thresholdMinutes * 0.75) return `${agentType} taking longer than usual`;
  return null;
}

export function issueProgress(issue: Issue): number {
  const state = issue.state ?? "";
  if (state === "PENDING") return 2;
  if (["SETTING_UP", "PLANNING", "AI_PLAN_REVIEWING", "SPLIT_PLANNING"].includes(state)) return 10;
  if (["AWAITING_PLAN_APPROVAL", "AWAITING_SPLIT_APPROVAL"].includes(state)) return 20;
  if (["WORKING", "SPLITTING"].includes(state)) return 42;
  if (state === "AI_REVIEWING") return 55;
  if (state === "AWAITING_CODE_REVIEW") return 62;
  if (state === "AWAITING_FIX_APPROVAL") return 73;
  if (state === "AWAITING_FIX_REVIEW") return 78;
  if (["WATCHING_PR", "FIXING", "PUSHING", "REBASING"].includes(state)) return 84;
  if (state === "IN_MERGE_QUEUE") return 95;
  if (state === "DONE") return 100;
  if (state === "FAILED") return 38;
  if (state === "PAUSED") return 30;
  const stage = classifyIssueToPipelineStage(issue);
  return ({ available: 2, active: 55, awaiting: 70 } satisfies Record<PipelineStageKey, number>)[stage];
}

export function nextStateForIssue(state?: string | null): string {
  return NEXT_STATE_BY_STATE[state ?? ""] ?? "WORKING";
}

export function issueMetaText(issue: Issue): string {
  const elapsed = timeAgoShort(issue.updated_at ?? issue.created_at);
  if (isRunningIssue(issue)) return issue.state === "AI_REVIEWING" ? `In review ${elapsed}` : `Started ${elapsed} ago`;
  if (issue.state?.startsWith("AWAITING")) return `Waiting ${elapsed}`;
  if (issue.state === "FAILED") return `Failed ${elapsed} ago`;
  if (issue.state === "PAUSED") return `Paused ${elapsed} ago`;
  if (classifyIssueToPipelineStage(issue) === "available") return `Added ${elapsed} ago`;
  return `Updated ${elapsed} ago`;
}

export function issueRuntimeBadges(issue: Issue): Array<{ className: string; label: string }> {
  const badges: Array<{ className: string; label: string }> = [];
  if (isRunningIssue(issue)) badges.push({ className: "forge-v3-live-badge", label: "Live" });
  if (issue.updated_at) badges.push({ className: `forge-v3-elapsed-badge${isIssueStuck(issue) ? " long" : ""}`, label: isIssueStuck(issue) ? "24h+" : timeAgoShort(issue.updated_at) });
  const stuckLabel = agentStuckLabel(issue);
  if (stuckLabel) badges.push({ className: "forge-v3-stuck-indicator", label: stuckLabel });
  else if (isIssueStuck(issue)) badges.push({ className: "forge-v3-stuck-indicator", label: "⚠ long" });
  return badges;
}

export function issueSearchText(issue: Issue): string {
  const prText = (issue.prStack ?? []).map((pr) => [pr.branch, pr.pr_number ? `#${pr.pr_number}` : "", pr.status].filter(Boolean).join(" ")).join(" ");
  return [issue.title, issue.linear_id, issue.branch, prText, issue.state].filter(Boolean).join(" ").toLowerCase();
}

export function issueMatchesQueueSearch(issue: Issue, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  return !normalizedQuery || issueSearchText(issue).includes(normalizedQuery);
}

export function issueMatchesQueueFilter(issue: Issue, filter: QueueFilter): boolean {
  const state = issue.state ?? "";
  if (filter === "needs-me") return ["AWAITING_PLAN_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW", "AWAITING_SPLIT_APPROVAL", "STEERING"].includes(state);
  if (filter === "running") return isRunningIssue(issue);
  if (filter === "failed") return state === "FAILED";
  if (filter === "watching-pr") return ["WATCHING_PR", "CREATING_PR", "IN_MERGE_QUEUE"].includes(state);
  if (filter === "paused") return ["PAUSED", "IGNORED"].includes(state);
  return true;
}

/* ── Sorting helpers ── */

export function sortQueueIssues(issues: Issue[], sort: QueueSort): Issue[] {
  const next = [...issues];
  if (sort === "newest") return next.sort((a, b) => timeValue(b.created_at ?? b.updated_at) - timeValue(a.created_at ?? a.updated_at));
  if (sort === "oldest") return next.sort((a, b) => timeValue(a.created_at ?? a.updated_at) - timeValue(b.created_at ?? b.updated_at));
  if (sort === "recently-updated") return next.sort((a, b) => timeValue(b.updated_at) - timeValue(a.updated_at));
  return next.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99) || timeValue(b.updated_at) - timeValue(a.updated_at));
}

export function sortIssuesByProcessStage(issues: Issue[], stageKey?: PipelineStageKey): Issue[] {
  if (stageKey === "awaiting") {
    return [...issues].sort((a, b) => timeValue(b.updated_at ?? b.created_at) - timeValue(a.updated_at ?? a.created_at));
  }
  const stageStates = PIPELINE_STAGES.find((stage) => stage.key === stageKey)?.states ?? [];
  const rank = (issue: Issue) => {
    const state = issue.state ?? "";
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

export function decisionWorkflowRank(decision: Decision, issues: Issue[]): number {
  const issue = issues.find((candidate) => candidate.id === decision.issue_id);
  if (issue?.state) return STATE_PROCESS_ORDER[issue.state] ?? 999;
  if (decision.type === "PLAN_REVIEW") return STATE_PROCESS_ORDER.AWAITING_PLAN_APPROVAL;
  if (decision.type === "SPLIT_APPROVAL") return STATE_PROCESS_ORDER.AWAITING_SPLIT_APPROVAL;
  if (decision.type === "CODE_REVIEW") return STATE_PROCESS_ORDER.AWAITING_CODE_REVIEW;
  if (decision.type === "FIX_APPROVAL") return STATE_PROCESS_ORDER.AWAITING_FIX_APPROVAL;
  if (decision.type === "FIX_REVIEW") return STATE_PROCESS_ORDER.AWAITING_FIX_REVIEW;
  return 999;
}

export function sortDecisionsByWorkflow(decisions: Decision[], issues: Issue[]): Decision[] {
  return [...decisions].sort((a, b) => {
    const issueA = issues.find((issue) => issue.id === a.issue_id);
    const issueB = issues.find((issue) => issue.id === b.issue_id);
    return decisionWorkflowRank(a, issues) - decisionWorkflowRank(b, issues)
      || (issueA?.priority ?? 99) - (issueB?.priority ?? 99)
      || a.id - b.id;
  });
}

export function selectReviewNextDecision(decisions: Decision[], issues: Issue[]): Decision | null {
  return sortDecisionsByWorkflow(decisions, issues)[0] ?? null;
}

/* ── Decision helpers ── */

export function decisionTypeClass(decision: Decision): string {
  const type = (decision.type ?? "decision").toLowerCase().replaceAll("_", "-");
  if (type.includes("code")) return "decision-code";
  if (type.includes("plan")) return "decision-plan";
  if (type.includes("fix")) return "decision-fix";
  if (type.includes("split")) return "decision-split";
  return "decision-generic";
}

export function decisionTypeLabel(decision: Decision): string {
  return (decision.type ?? "Decision").toLowerCase().replaceAll("_", " ");
}

export function decisionIcon(decision: Decision): string {
  const type = (decision.type ?? "").toLowerCase();
  if (type.includes("code")) return "○";
  if (type.includes("plan")) return "▣";
  if (type.includes("fix")) return "💬";
  if (type.includes("split")) return "✂";
  return "⬡";
}

export function decisionPrimaryActionLabel(decision: Decision): string {
  const type = (decision.type ?? "").toLowerCase();
  if (type.includes("fix")) return "Fix selected";
  if (type.includes("plan")) return "View plan";
  if (type.includes("split")) return "View split";
  return "View diff";
}

export function issueDecisionKind(decisions: Decision[]): "plan" | "code" | "fix" | "fix-review" | "split" | "generic" | null {
  const type = decisions[0]?.type ?? "";
  if (!type) return null;
  if (type.includes("PLAN")) return "plan";
  if (type.includes("CODE")) return "code";
  if (type === "FIX_REVIEW") return "fix-review";
  if (type.includes("FIX")) return "fix";
  if (type.includes("SPLIT")) return "split";
  return "generic";
}

export function parseDecisionArtifact(decision?: Decision): DecisionArtifact {
  if (!decision?.artifact_ref) return {};
  try {
    const parsed = JSON.parse(decision.artifact_ref) as DecisionArtifact;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return { summary: decision.artifact_ref };
  }
}

export function fixCommentId(comment: FixApprovalComment, index: number): string {
  return String(comment.id ?? `${comment.path ?? "comment"}-${comment.line ?? index}-${index}`);
}

export function expectedDecisionTypeForState(state?: string | null): string | null {
  if (state === "AWAITING_PLAN_APPROVAL") return "PLAN_REVIEW";
  if (state === "AWAITING_CODE_REVIEW") return "CODE_REVIEW";
  if (state === "AWAITING_FIX_APPROVAL") return "FIX_APPROVAL";
  if (state === "AWAITING_FIX_REVIEW") return "FIX_REVIEW";
  if (state === "AWAITING_SPLIT_APPROVAL") return "SPLIT_APPROVAL";
  return null;
}

/* ── PR helpers ── */

export function primaryPrUrl(issue: Issue): string | null {
  return (issue.prStack ?? []).find((pr) => pr.url)?.url ?? null;
}

export function prMetadataBadges(issue: Issue): Array<{ className: string; label: string }> {
  const prs = issue.prStack ?? [];
  const state = issue.state ?? "";
  if (state === "AWAITING_PLAN_APPROVAL") return [{ className: "forge-v3-plan-badge", label: "plan ready" }];
  if (!prs.length) return [];
  return prs.slice(0, 2).flatMap((pr) => [
    { className: "forge-v3-pr-badge", label: pr.pr_number ? `#${pr.pr_number}` : pr.branch ?? "PR" },
    { className: pr.isInMergeQueue ? "forge-v3-ci-badge merge-queue" : pr.status === "merged" ? "forge-v3-ci-badge" : pr.status === "closed" ? "forge-v3-ci-badge fail" : "forge-v3-ci-badge", label: pr.isInMergeQueue ? "merge queue" : pr.liveState ?? pr.status ?? "✓ CI" },
  ]);
}

/* ── Phase helpers ── */

export function phaseIndexForState(state?: string | null): number {
  if (["PENDING", "SETTING_UP"].includes(state ?? "")) return 0;
  if (["PLANNING", "AI_PLAN_REVIEWING", "AWAITING_PLAN_APPROVAL", "SPLIT_PLANNING", "AWAITING_SPLIT_APPROVAL"].includes(state ?? "")) return 1;
  if (["WORKING", "SPLITTING"].includes(state ?? "")) return 2;
  if (["AI_REVIEWING", "AWAITING_CODE_REVIEW"].includes(state ?? "")) return 3;
  if (["CREATING_PR"].includes(state ?? "")) return 4;
  if (["WATCHING_PR", "AWAITING_FIX_APPROVAL", "FIXING", "AWAITING_FIX_REVIEW", "PUSHING", "REBASING", "IN_MERGE_QUEUE"].includes(state ?? "")) return 5;
  if (state === "DONE") return 6;
  return 0;
}

export function isWaitingState(state?: string | null): boolean {
  return ["AWAITING_PLAN_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW", "AWAITING_SPLIT_APPROVAL"].includes(state ?? "");
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function countRuns(runs: AgentRun[] | undefined, agentType: string): number {
  return (runs ?? []).filter((run) => run.agent_type === agentType).length;
}

export function countFixApprovalComments(decisions: Decision[] | undefined): number {
  return (decisions ?? [])
    .filter((decision) => decision.type === "FIX_APPROVAL")
    .reduce((total, decision) => total + (parseDecisionArtifact(decision).comments?.length ?? 0), 0);
}

export function countDecisions(decisions: Decision[] | undefined, type: string): number {
  return (decisions ?? []).filter((decision) => decision.type === type).length;
}

/* ── Plan/diff helpers ── */

export function detailPlan(detail: IssueDetail | null): string {
  return detail?.planContent ?? detail?.plan ?? "No plan available.";
}

export function hasPlan(detail: IssueDetail | null): boolean {
  const plan = detail?.planContent ?? detail?.plan;
  return Boolean(plan?.trim());
}

export function detailHandoff(detail: IssueDetail | null): string {
  return detail?.handoffContent ?? "";
}

export function hasHandoff(detail: IssueDetail | null): boolean {
  return Boolean(detailHandoff(detail).trim());
}

export function hasWrittenCode(state?: string | null): boolean {
  return ["AI_REVIEWING", "AWAITING_CODE_REVIEW", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "AWAITING_FIX_REVIEW", "PUSHING", "REBASING", "FAILED", "PAUSED"].includes(state ?? "");
}

export function canRequestSplitPrStack(state?: string | null): boolean {
  return ["AI_REVIEWING", "AWAITING_CODE_REVIEW", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "AWAITING_FIX_REVIEW", "PUSHING", "REBASING"].includes(state ?? "");
}

export function canRebaseIssue(issue?: Issue | null): boolean {
  if (!issue) return false;
  return ["AWAITING_CODE_REVIEW", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW"].includes(issue.state ?? "") && !isRunningIssue(issue) && !issue.locked_at && !issue.agent_pid;
}

export function diffLineClass(line: string): string {
  if (line.startsWith("+")) return "add";
  if (line.startsWith("-")) return "del";
  if (line.startsWith("@@")) return "hunk";
  if (line.startsWith("diff --git") || line.startsWith("index ") || line.startsWith("---") || line.startsWith("+++")) return "meta";
  return "ctx";
}

export function diffLineSign(line: string): string {
  if (line.startsWith("+")) return "+";
  if (line.startsWith("-")) return "−";
  return "";
}

export function fileNameFromPath(path: string): string {
  return path.split(/[\\/]/).filter(Boolean).pop() || path;
}

export function parseUnifiedDiff(diff: string): ReviewFile[] {
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

/* ── Activity helpers ── */

export function activityActor(agentType?: string | null): string {
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

export function activityText(run: AgentRun, issue: Issue): string {
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

export function activityTone(type?: string | null, actor?: string | null): string {
  const value = `${type ?? ""} ${actor ?? ""}`.toLowerCase();
  if (value.includes("fail") || value.includes("error")) return "err";
  if (value.includes("approved") || value.includes("completed") || value.includes("done")) return "ok";
  if (value.includes("user") || value.includes("steer") || value.includes("paused") || value.includes("ignored")) return "me";
  if (value.includes("started") || value.includes("live")) return "live";
  return "ag";
}

export function activityLogText(entry: { message?: string | null; type?: string | null }): string {
  return entry.message ?? entry.type?.replaceAll("_", " ") ?? "Activity recorded";
}

export function runLogUrl(runId?: number): string | null {
  return runId ? `/api/runs/${runId}/log` : null;
}

/* ── Markdown rendering ── */

export function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function renderInlineMarkdown(value: string): string {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

export function renderMarkdown(markdown: string): string {
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

export function formatReviewSectionLabel(raw: string): string {
  return raw.toLowerCase().split(/[_\s-]+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

export function normalizeFixCommentBody(body?: string | null): string {
  return (body ?? "No comment body")
    .replace(/<!--\s*BUGBOT_BUG_ID:\s*[^>]*?-->/gi, "")
    .replace(/<!--\s*([A-Z0-9_ -]+?)\s+START\s*([\s\S]*?)\s+\1\s+END\s*-->/gi, (_match, label, content) => `<!-- ${label} START -->\n${content.trim()}\n<!-- ${label} END -->`)
    .replace(/<details\b[\s\S]*?<\/details>/gi, "")
    .replace(/<sup\b[\s\S]*?<\/sup>/gi, "")
    .replace(/<div\b[\s\S]*?<\/div>/gi, "")
    .trim() || "No comment body";
}

/* ── Backlog helpers ── */

export function backlogIssueSearchText(issue: LinearBacklogIssue): string {
  return [issue.title, issue.identifier, issue.state].filter(Boolean).join(" ").toLowerCase();
}

export function backlogMatchesQueueSearch(issue: LinearBacklogIssue, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  return !normalizedQuery || backlogIssueSearchText(issue).includes(normalizedQuery);
}

/* ── Archive helpers ── */

export function archiveIssueSearchText(issue: ArchiveIssue): string {
  const prText = (issue.prStack ?? []).map((pr) => [pr.pr_number ? `#${pr.pr_number}` : "", pr.gt_branch, pr.branch, pr.status].filter(Boolean).join(" ")).join(" ");
  return [issue.linear_id, issue.title, issue.state, issue.updated_at, prText].filter(Boolean).join(" ").toLowerCase();
}

export function isWithinLastWeek(value?: string | null): boolean {
  if (!value) return false;
  const time = parseTimestamp(value);
  return Number.isFinite(time) && Date.now() - time <= 7 * 24 * 60 * 60 * 1000;
}

/* ── Banner/snippet helpers ── */

export function stageIcon(stage: PipelineStageKey): string {
  return ({ available: "○", active: "▣", awaiting: "⚡" } satisfies Record<PipelineStageKey, string>)[stage];
}

/* ── Notification helpers ── */

export function browserNotificationsAvailable(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function browserNotificationPermission(): NotificationPermission | "unsupported" {
  return browserNotificationsAvailable() ? window.Notification.permission : "unsupported";
}

/* ── Shell status ── */

export function shellStatusFromData(overview: Overview, settings: Settings): ShellStatus {
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

/* ── Routing ── */

function numericRoutePart(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export function parseDashboardRoute(hash = window.location.hash): DashboardRoute {
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

export function updateDashboardQuery(updates: Record<string, string | number | boolean | null | undefined>, replace = true): void {
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

export function syncDashboardRoute(key: NavKey, ids: { issueId?: number | null; decisionId?: number | null } = {}): void {
  updateDashboardQuery({ view: key, issue: key === "queue" ? ids.issueId : null, decision: ids.decisionId, panel: ids.decisionId ? "review" : null }, false);
}

/* ── Settings helpers ── */

import { KNOWN_SETTING_KEYS, BOOLEAN_SETTING_KEYS, NUMBER_SETTING_KEYS, inputTypeForSetting, SETTING_LABELS } from "./constants";

export function settingLabel(key: string): string {
  return SETTING_LABELS[key]?.label ?? key;
}

export function settingDescription(key: string): string {
  const hint = SETTING_LABELS[key]?.hint;
  return hint ? `${hint} · DB key: ${key}` : `Unrecognized setting · DB key: ${key}`;
}

export function normalizeSettingValue(key: string, value: string): string {
  if (BOOLEAN_SETTING_KEYS.has(key)) return value === "true" ? "true" : "false";
  return value;
}

export function changedSettingsPayload(savedSettings: Settings, draftSettings: Settings, allowUnknownSettings: boolean): Settings {
  return Object.fromEntries(Object.entries(draftSettings)
    .filter(([key]) => allowUnknownSettings || KNOWN_SETTING_KEYS.has(key))
    .map(([key, value]) => [key, normalizeSettingValue(key, value ?? "")])
    .filter(([key, value]) => normalizeSettingValue(String(key), savedSettings[String(key)] ?? "") !== value)) as Settings;
}

export function validateSettingsDraft(draftSettings: Settings, allowUnknownSettings: boolean): string[] {
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

/* ── Clipboard helper ── */

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  return Promise.reject(new Error("Clipboard API not available"));
}

/* ── LocalStorage preferences ── */

import { QUEUE_PREFS_STORAGE_KEY } from "./constants";
import type { QueueFilter as QF, QueueSort as QS } from "./types";

export function loadQueuePrefs(): { filter: QF; sort: QS } {
  try {
    const raw = window.localStorage.getItem(QUEUE_PREFS_STORAGE_KEY);
    if (!raw) return { filter: "all", sort: "priority" };
    const parsed = JSON.parse(raw);
    return {
      filter: ["all", "needs-me", "running", "failed", "watching-pr", "paused"].includes(parsed.filter) ? parsed.filter : "all",
      sort: ["priority", "newest", "oldest", "recently-updated"].includes(parsed.sort) ? parsed.sort : "priority",
    };
  } catch {
    return { filter: "all", sort: "priority" };
  }
}

export function saveQueuePrefs(filter: QF, sort: QS): void {
  try {
    window.localStorage.setItem(QUEUE_PREFS_STORAGE_KEY, JSON.stringify({ filter, sort }));
  } catch {}
}

/* ── Debounce helper ── */

export function debounce<T extends (...args: any[]) => any>(fn: T, ms: number): T & { cancel(): void } {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
  debounced.cancel = () => { if (timer) clearTimeout(timer); };
  return debounced as T & { cancel(): void };
}
