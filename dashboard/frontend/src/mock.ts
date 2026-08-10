import type { Issue, Decision, IssueDetail, Overview } from "./types";
import { issueStateLabel, isRunningIssue } from "./helpers";

const MOCK_STATE_NAMES = [
  "PENDING", "SETTING_UP", "PLANNING", "AI_PLAN_REVIEWING", "AWAITING_PLAN_APPROVAL",
  "SPLIT_PLANNING", "AWAITING_SPLIT_APPROVAL", "SPLITTING", "WORKING", "AI_REVIEWING",
  "AWAITING_CODE_REVIEW", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE",
  "AWAITING_FIX_APPROVAL", "FIXING", "AWAITING_FIX_REVIEW", "PUSHING", "REBASING",
  "STEERING", "DONE", "FAILED", "PAUSED", "IGNORED",
] as const;

export function mockStatesEnabled(): boolean {
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

export function enableMockStatesForSession(): void {
  window.localStorage.setItem("forge-v3-mock-states", "1");
  window.location.reload();
}

export function disableMockStatesForSession(): void {
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
  if (issue.state === "AWAITING_FIX_REVIEW") return { id: 9104, issue_id: issue.id, type: "FIX_REVIEW", issueTitle: issue.title, artifact_ref: "fix-review" };
  if (issue.state === "AWAITING_SPLIT_APPROVAL") return { id: 9104, issue_id: issue.id, type: "SPLIT_APPROVAL", issueTitle: issue.title, artifact_ref: JSON.stringify({ summary: "Split generated code review prep from dashboard polish.", proposedStack: [{ branch: "mock/review-foundation", title: "Review foundation" }, { branch: "mock/review-polish", title: "Review polish" }] }) };
  return null;
}

function mockPlan(issue: Issue): string {
  return `# ${issue.linear_id} ${issue.title}\n\n## Goal\nExercise the v3 detail panel while this issue is in **${issueStateLabel(issue)}**.\n\n## Tasks\n- [x] Gather context\n- [x] Draft plan\n- [ ] Implement state-specific UI polish\n- [ ] Validate actions and banners\n\n## Review notes\nUse this mock fixture to tidy copy, action availability, colors, and spacing before testing real Forge issues.`;
}

export function mockIssues(): Issue[] {
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
    prStack: ["CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "AWAITING_FIX_REVIEW", "PUSHING", "REBASING"].includes(state)
      ? [{ pr_number: state === "CREATING_PR" ? null : 4521 + index, branch: `user/mock-${index + 1}`, status: state === "IN_MERGE_QUEUE" ? "merged" : "open" }]
      : [],
  }));
}

export function mockIssueDetail(issueId: number): IssueDetail {
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

export function mockOverview(): Overview {
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
