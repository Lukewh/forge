import type { Decision, DecisionVerdict, DesktopCapabilities, IssueAction, Overview, Settings } from "./types";
import { mockStatesEnabled, mockOverview, mockIssueDetail } from "./mock";

export async function getJson<T>(url: string): Promise<T> {
  if (mockStatesEnabled()) {
    if (url === "/api/overview") return mockOverview() as T;
    if (url === "/api/settings") return { model: "mock-state-fixtures", concurrency_limit: "4", runtime_mode: "mock" } as T;
    if (url === "/api/desktop-capabilities") return { notifications: true } as T;
    if (url === "/api/archive") return [] as T;
    if (url === "/api/linear/issues") return [] as T;
    const diffMatch = url.match(/^\/api\/issues\/(\d+)\/diff$/);
    if (diffMatch?.[1]) return { baseBranch: "main", diff: `diff --git a/src/mock.ts b/src/mock.ts\n--- a/src/mock.ts\n+++ b/src/mock.ts\n@@ -1,3 +1,4 @@\n export function mockFeature() {\n-  return false;\n+  return true;\n }` } as T;
    const tourMatch = url.match(/^\/api\/issues\/(\d+)\/tour$/);
    if (tourMatch?.[1]) return { generating: false, created_at: new Date(Date.now() - 60_000).toISOString(), tour: { summary: "AI tour: review behavior, error states, and API payload shape.", highlights: ["Diff sidecar stays issue-scoped", { title: "Decision payload", text: "Structured review feedback is sent to the agent", file: "src/mock.ts", line: 3 }], files: [{ path: "src/mock.ts", summary: "Mock review fixture", risk: "low" }] } } as T;
    const issueMatch = url.match(/^\/api\/issues\/(\d+)$/);
    if (issueMatch?.[1]) return mockIssueDetail(Number(issueMatch[1])) as T;
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  return (await response.json()) as T;
}

export async function postJson<T>(url: string, body: unknown, method = "POST"): Promise<T> {
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

export async function deleteJson<T>(url: string): Promise<T> {
  if (mockStatesEnabled()) return { ok: true, mock: true, url, method: "DELETE" } as T;
  const response = await fetch(url, { method: "DELETE" });
  if (!response.ok) throw new Error(`Failed to delete ${url}: ${response.status}`);
  return (await response.json()) as T;
}

export function resolveDecisionAction(decisionId: number, verdict: DecisionVerdict, feedback?: unknown) {
  return postJson<{ ok: boolean; nextState?: string }>(`/api/decisions/${decisionId}/resolve`, { verdict, feedback });
}

export function runIssueAction(issueId: number, action: IssueAction, payload: Record<string, unknown> = {}) {
  return postJson<{ ok: boolean }>(`/api/issues/${issueId}`, { action, ...payload }, "PATCH");
}

export function removeIssue(issueId: number) {
  return deleteJson<{ ok: boolean }>(`/api/issues/${issueId}`);
}

export function launchIssueRuntime(issueId: number) {
  return postJson<{ ok: boolean; output?: string; error?: string; launchRef?: string }>(`/api/issues/${issueId}/vm-launch`, {});
}

export function stopVmRuntime() {
  return postJson<{ ok: boolean; output?: string; error?: string }>("/api/vm/stop", {});
}

export function syncIssuePrs(issueId: number) {
  return postJson<{ ok: boolean; synced?: unknown[] }>(`/api/issues/${issueId}/sync-prs`, {});
}

export function submitIssueFeedback(issueId: number, body: string, prNumber?: number | null) {
  return postJson<{ ok: boolean }>(`/api/issues/${issueId}/feedback`, { body, prNumber: prNumber ?? null });
}

export function createManualIssue(title: string, description = "") {
  return postJson<{ ok: boolean; issueId?: number }>("/api/issues", { title, description });
}

export function enqueueLinearIssueApi(linearId: string, planningGuidance = "") {
  return postJson<{ ok: boolean; issueId?: number }>("/api/linear/enqueue", { linearId, planningGuidance });
}

export function loadDesktopCapabilities() {
  return getJson<DesktopCapabilities>("/api/desktop-capabilities");
}

export function sendDesktopNotification(title: string, body: string, tag?: string) {
  return postJson<{ ok: boolean }>("/api/desktop-notify", { title, body, tag });
}

export function normalizeOverview(value: unknown): Overview {
  const data = (value ?? {}) as Partial<Overview> & { active?: Decision[]; awaitingDecisions?: Decision[] };
  return {
    issues: data.issues ?? (data as any).active ?? [],
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
