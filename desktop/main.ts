const FORGE_DIR = Deno.env.get("FORGE_DIR") ??
  `${Deno.env.get("HOME")}/.pi/agent/extensions/forge`;
const DASHBOARD_PORT = Number(
  Deno.env.get("FORGE_DESKTOP_PORT") ?? Deno.env.get("PORT") ?? "3142",
);
const DEFAULT_BACKEND_ORIGIN = `http://127.0.0.1:${DASHBOARD_PORT}`;
const DESKTOP_CONFIG_FILE = Deno.env.get("FORGE_DESKTOP_CONFIG") ??
  `${Deno.env.get("HOME")}/.config/forge/forge-desktop.json`;
const LEGACY_DESKTOP_CONFIG_FILE = `${Deno.env.get("HOME")}/.forge-desktop.json`;
const LOG_FILE = `${FORGE_DIR}/dashboard/desktop-wrapper.log`;

function normalizeBackendOrigin(value: string): string {
  const url = new URL(value);
  url.pathname = "";
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

function readBackendOriginConfig(filePath: string): string | null {
  try {
    const config = JSON.parse(Deno.readTextFileSync(filePath));
    if (config?.backendOrigin) return normalizeBackendOrigin(String(config.backendOrigin));
  } catch {}
  return null;
}

function loadBackendOrigin(): string {
  const envOrigin = Deno.env.get("FORGE_BACKEND_ORIGIN");
  if (envOrigin) return normalizeBackendOrigin(envOrigin);
  return readBackendOriginConfig(DESKTOP_CONFIG_FILE)
    ?? readBackendOriginConfig(LEGACY_DESKTOP_CONFIG_FILE)
    ?? DEFAULT_BACKEND_ORIGIN;
}

let dashboardOrigin = loadBackendOrigin();
function backendIsLocal(): boolean {
  return dashboardOrigin === DEFAULT_BACKEND_ORIGIN;
}

async function saveBackendOrigin(value: string): Promise<string> {
  const origin = normalizeBackendOrigin(value);
  const configDir = DESKTOP_CONFIG_FILE.split("/").slice(0, -1).join("/") || ".";
  await Deno.mkdir(configDir, { recursive: true });
  await Deno.writeTextFile(DESKTOP_CONFIG_FILE, JSON.stringify({ backendOrigin: origin }, null, 2) + "\n");
  dashboardOrigin = origin;
  await appendLog(`Backend origin set to ${origin}`);
  return origin;
}

let dashboardProcess: Deno.ChildProcess | undefined;
let statusBarProcess: Deno.ChildProcess | undefined;
let startPromise: Promise<void> | undefined;
let localDashboardProcessRefreshDone = false;

async function appendLog(message: string) {
  await Deno.writeTextFile(
    LOG_FILE,
    `[${new Date().toISOString()}] ${message}\n`,
    { append: true },
  ).catch(() => {});
}

async function isDashboardReady(): Promise<boolean> {
  try {
    const res = await fetch(`${dashboardOrigin}/api/health`, {
      signal: AbortSignal.timeout(1000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function waitForDashboard(timeoutMs = 15000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isDashboardReady()) return true;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return false;
}

async function consumeLog(
  stream: ReadableStream<Uint8Array> | null,
  label: string,
) {
  if (!stream) return;
  const decoder = new TextDecoder();
  for await (const chunk of stream) {
    await appendLog(`${label}: ${decoder.decode(chunk).trimEnd()}`);
  }
}

async function executableExists(path: string): Promise<boolean> {
  try {
    const stat = await Deno.stat(path);
    return stat.isFile;
  } catch {
    return false;
  }
}

async function findExecutable(
  name: string,
  extraCandidates: string[] = [],
): Promise<string | undefined> {
  const pathEntries = (Deno.env.get("PATH") ?? "")
    .split(":")
    .filter(Boolean)
    .map((entry) => `${entry}/${name}`);
  for (const candidate of [...pathEntries, ...extraCandidates]) {
    if (await executableExists(candidate)) return candidate;
  }
  return undefined;
}

async function findNodeExecutable(): Promise<string> {
  const candidates = [
    "/opt/homebrew/bin/node",
    "/usr/local/bin/node",
    `${Deno.env.get("HOME")}/.nvm/current/bin/node`,
  ];

  const nvmRoot = `${Deno.env.get("HOME")}/.nvm/versions/node`;
  try {
    const versions: string[] = [];
    for await (const entry of Deno.readDir(nvmRoot)) {
      if (entry.isDirectory) versions.push(entry.name);
    }
    versions.sort().reverse();
    for (const version of versions) {
      candidates.push(`${nvmRoot}/${version}/bin/node`);
    }
  } catch {}

  for (const candidate of candidates) {
    if (await executableExists(candidate)) return candidate;
  }
  throw new Error(
    "Could not find a node executable. Set PATH or launch with FORGE_NODE=/path/to/node.",
  );
}

async function startStatusBar(): Promise<void> {
  if (Deno.build.os !== "darwin") return;
  if (statusBarProcess) return;

  const swift = await findExecutable("swift", ["/usr/bin/swift"]);
  if (!swift) {
    await appendLog("Status bar disabled: swift executable not found");
    return;
  }

  const script = `${FORGE_DIR}/desktop/status-bar.swift`;
  if (!(await executableExists(script))) {
    await appendLog(`Status bar disabled: ${script} not found`);
    return;
  }

  await appendLog(`Starting Forge status bar via ${swift}`);
  const command = new Deno.Command(swift, {
    args: [script],
    cwd: FORGE_DIR,
    env: { ...Deno.env.toObject(), PORT: String(DASHBOARD_PORT) },
    stdout: "piped",
    stderr: "piped",
  });
  statusBarProcess = command.spawn();
  consumeLog(statusBarProcess.stdout, "statusbar stdout");
  consumeLog(statusBarProcess.stderr, "statusbar stderr");
  statusBarProcess.status.then((status) => {
    appendLog(`Status bar process exited with code ${status.code}`);
    statusBarProcess = undefined;
  }).catch(() => {
    statusBarProcess = undefined;
  });
}

async function killStaleDashboardProcesses(): Promise<void> {
  const result = await new Deno.Command("ps", {
    args: ["-axo", "pid=,command="],
    stdout: "piped",
    stderr: "null",
  }).output().catch(() => null);
  if (!result?.success) return;

  const currentPid = Deno.pid;
  const lines = new TextDecoder().decode(result.stdout).split("\n");
  for (const line of lines) {
    const match = line.trim().match(/^(\d+)\s+(.+)$/);
    if (!match) continue;
    const pid = Number(match[1]);
    const command = match[2];
    if (pid === currentPid) continue;
    if (!command.includes(`${FORGE_DIR}/dashboard/server.js`)) continue;

    await appendLog(`Stopping stale dashboard process ${pid}: ${command}`);
    try { Deno.kill(pid, "SIGTERM"); } catch {}
  }
  await new Promise((resolve) => setTimeout(resolve, 750));
}

async function ensureDashboard(): Promise<void> {
  if (!backendIsLocal()) {
    if (!(await isDashboardReady())) throw new Error(`Forge backend is not reachable at ${dashboardOrigin}`);
    await startStatusBar();
    return;
  }

  if (!localDashboardProcessRefreshDone) {
    localDashboardProcessRefreshDone = true;
    await killStaleDashboardProcesses();
  }

  if (await isDashboardReady()) {
    await startStatusBar();
    return;
  }
  if (startPromise) return startPromise;

  startPromise = (async () => {
    await killStaleDashboardProcesses();
    if (await isDashboardReady()) {
      await startStatusBar();
      return;
    }

    await appendLog(
      `Starting Forge dashboard from ${FORGE_DIR} on port ${DASHBOARD_PORT}`,
    );

    const node = Deno.env.get("FORGE_NODE") || await findNodeExecutable();
    await appendLog(`Using node executable: ${node}`);

    const command = new Deno.Command(node, {
      args: ["dashboard/server.js"],
      cwd: FORGE_DIR,
      env: { ...Deno.env.toObject(), PORT: String(DASHBOARD_PORT) },
      stdout: "piped",
      stderr: "piped",
    });

    dashboardProcess = command.spawn();
    consumeLog(dashboardProcess.stdout, "stdout");
    consumeLog(dashboardProcess.stderr, "stderr");
    dashboardProcess.status.then((status) => {
      appendLog(`Dashboard process exited with code ${status.code}`);
      dashboardProcess = undefined;
    }).catch(() => {
      dashboardProcess = undefined;
    });

    const ready = await waitForDashboard();
    if (!ready) {
      throw new Error(
        `Forge dashboard did not become ready at ${dashboardOrigin}`,
      );
    }
    await startStatusBar();
  })();

  try {
    await startPromise;
  } finally {
    startPromise = undefined;
  }
}

function errorPage(error: unknown): Response {
  const message = error instanceof Error ? error.message : String(error);
  return new Response(
    `<!doctype html>
<html>
  <head>
    <title>Forge Desktop</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 48px; color: #111827; }
      code { background: #f3f4f6; padding: 2px 4px; border-radius: 4px; }
      pre { background: #111827; color: #f9fafb; padding: 16px; border-radius: 8px; overflow: auto; }
    </style>
  </head>
  <body>
    <h1>Forge dashboard failed to connect</h1>
    <p>${escapeHtml(message)}</p>
    <p>Backend origin: <code>${escapeHtml(dashboardOrigin)}</code></p>
    <form method="post" action="/desktop/backend" style="margin: 16px 0; display: flex; gap: 8px; align-items: center;">
      <input name="backendOrigin" value="${escapeHtml(dashboardOrigin)}" style="min-width: 360px; padding: 8px;" placeholder="http://127.0.0.1:3142" />
      <button type="submit" style="padding: 8px 12px;">Use backend</button>
    </form>
    <p><a href="/desktop/backend">Choose a different backend</a></p>
    <p>Expected Forge directory: <code>${escapeHtml(FORGE_DIR)}</code></p>
    <p>Log file: <code>${escapeHtml(LOG_FILE)}</code></p>
    <pre>FORGE_DIR=/path/to/forge deno task desktop</pre>
  </body>
</html>`,
    { status: 502, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function contentTypeForPath(path: string): string {
  if (path.endsWith(".html")) return "text/html; charset=utf-8";
  if (path.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (path.endsWith(".css")) return "text/css; charset=utf-8";
  if (path.endsWith(".svg")) return "image/svg+xml";
  if (path.endsWith(".png")) return "image/png";
  return "application/octet-stream";
}

async function serveLocalDashboardAsset(pathname: string): Promise<Response | null> {
  const localAssets = new Map<string, string>([
    ["/", "dashboard/public/index.html"],
    ["/index.html", "dashboard/public/index.html"],
    ["/classic.html", "dashboard/public/classic.html"],
    ["/app.js", "dashboard/public/app.js"],
    ["/style.css", "dashboard/public/style.css"],
    ["/v3/forge-dashboard.js", "dashboard/public/v3/forge-dashboard.js"],
    ["/v3/forge-dashboard.css", "dashboard/public/v3/forge-dashboard.css"],
  ]);
  const relativePath = localAssets.get(pathname);
  if (!relativePath) return null;
  try {
    const filePath = `${FORGE_DIR}/${relativePath}`;
    const body = await Deno.readFile(filePath);
    return new Response(body, {
      headers: {
        "content-type": contentTypeForPath(filePath),
        "cache-control": "no-store, max-age=0",
      },
    });
  } catch {
    return null;
  }
}

async function mtimeMs(path: string): Promise<number> {
  try {
    return (await Deno.stat(path)).mtime?.getTime() ?? 0;
  } catch {
    return 0;
  }
}

async function ensureNotificationHelper(): Promise<string> {
  const source = `${FORGE_DIR}/desktop/notify.swift`;
  const binary = `${FORGE_DIR}/desktop/forge-notify`;
  if (!(await executableExists(source))) {
    throw new Error(`notification helper source not found: ${source}`);
  }

  const needsBuild = !(await executableExists(binary)) ||
    (await mtimeMs(source)) > (await mtimeMs(binary));
  if (!needsBuild) return binary;

  const swiftc = await findExecutable("swiftc", ["/usr/bin/swiftc"]);
  if (!swiftc) throw new Error("swiftc not found; cannot build notification helper");

  await appendLog(`Building notification helper via ${swiftc}`);
  const result = await new Deno.Command(swiftc, {
    args: [source, "-o", binary],
    stdout: "piped",
    stderr: "piped",
  }).output();
  if (!result.success) {
    throw new Error(
      new TextDecoder().decode(result.stderr).trim() ||
        "notification helper build failed",
    );
  }
  return binary;
}

async function sendNativeNotification(
  payload: { title?: unknown; body?: unknown },
): Promise<void> {
  if (Deno.build.os !== "darwin") {
    throw new Error(
      "Native desktop notifications are currently supported on macOS only",
    );
  }

  const title = String(payload.title || "Forge").slice(0, 120);
  const body = String(payload.body || "").slice(0, 1000);
  const helper = await ensureNotificationHelper();
  const result = await new Deno.Command(helper, {
    args: ["--title", title, "--body", body],
    stdout: "null",
    stderr: "piped",
  }).output();
  if (!result.success) {
    throw new Error(
      new TextDecoder().decode(result.stderr).trim() ||
        `notification helper failed with code ${result.code}`,
    );
  }
}

let linearExecutablePromise: Promise<string | undefined> | undefined;
async function findLinearExecutable(): Promise<string | undefined> {
  linearExecutablePromise ??= (async () => {
    const candidates = [
      `${Deno.env.get("HOME")}/.deno/bin/linear`,
      "/opt/homebrew/bin/linear",
      "/usr/local/bin/linear",
      `${Deno.env.get("HOME")}/.local/bin/linear`,
      `${Deno.env.get("HOME")}/.npm-global/bin/linear`,
      `${Deno.env.get("HOME")}/.nvm/current/bin/linear`,
    ];
    const nvmRoot = `${Deno.env.get("HOME")}/.nvm/versions/node`;
    try {
      for await (const version of Deno.readDir(nvmRoot)) {
        if (version.isDirectory) candidates.push(`${nvmRoot}/${version.name}/bin/linear`);
      }
    } catch {}
    return await findExecutable("linear", candidates);
  })();
  return linearExecutablePromise;
}

function desktopCliEnv(): Record<string, string> {
  const home = Deno.env.get("HOME") ?? "";
  const pathEntries = [
    `${home}/.deno/bin`,
    "/opt/homebrew/bin",
    "/usr/local/bin",
    `${home}/.local/bin`,
    `${home}/.npm-global/bin`,
    `${home}/.nvm/current/bin`,
    Deno.env.get("PATH") ?? "",
  ].filter(Boolean);

  return {
    ...Deno.env.toObject(),
    DENO_INSTALL: Deno.env.get("DENO_INSTALL") ?? `${home}/.deno`,
    PATH: pathEntries.join(":"),
  };
}

async function runCli(cmd: string, args: string[]): Promise<string> {
  const executable = cmd === "linear" ? await findLinearExecutable() : cmd;
  if (!executable) {
    throw new Error(`Could not find ${cmd}. Set PATH before launching Forge Desktop or install it in /opt/homebrew/bin, /usr/local/bin, ~/.local/bin, or ~/.npm-global/bin.`);
  }
  const result = await new Deno.Command(executable, {
    args,
    env: desktopCliEnv(),
    stdout: "piped",
    stderr: "piped",
  }).output();
  if (!result.success) {
    const stderr = new TextDecoder().decode(result.stderr).trim();
    throw new Error(stderr || `${cmd} exited with code ${result.code}`);
  }
  return new TextDecoder().decode(result.stdout);
}

function normalizeLinearPriority(value: unknown, issue: Record<string, unknown> = {}): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const label = value.trim().toLowerCase();
    if (/^p?0$|none|no priority/.test(label)) return 0;
    if (/^p?1$|urgent|critical/.test(label)) return 1;
    if (/^p?2$|high/.test(label)) return 2;
    if (/^p?3$|medium|normal/.test(label)) return 3;
    if (/^p?4$|low/.test(label)) return 4;
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["value", "priority", "number", "rank"]) {
      const normalized = normalizeLinearPriority(record[key]);
      if (normalized !== 0 || record[key] === 0) return normalized;
    }
    for (const key of ["name", "label", "title"]) {
      const normalized = normalizeLinearPriority(record[key]);
      if (normalized !== 0) return normalized;
    }
  }
  for (const key of ["priorityLabel", "priorityName"]) {
    const normalized = normalizeLinearPriority(issue[key]);
    if (normalized !== 0) return normalized;
  }
  return 0;
}

function normalizeLinearQueryResult(raw: string): Array<Record<string, unknown>> {
  const data = JSON.parse(raw || "{}");
  const nodes = Array.isArray(data) ? data : Array.isArray(data.nodes) ? data.nodes : [];
  return nodes.map((issue: Record<string, any>) => ({
    identifier: issue.identifier,
    title: issue.title,
    priority: normalizeLinearPriority(issue.priority, issue),
    state: issue.state?.name ?? issue.state ?? "Unknown",
    stateType: issue.state?.type ?? issue.stateType ?? null,
    createdAt: issue.createdAt ?? null,
    updatedAt: issue.updatedAt ?? null,
    assignedAt: issue.assignedAt ?? null,
    completedAt: issue.completedAt ?? null,
    canceledAt: issue.canceledAt ?? issue.cancelledAt ?? null,
    archivedAt: issue.archivedAt ?? null,
  })).filter((issue: Record<string, unknown>) => issue.identifier);
}

async function handleDesktopJob(job: { id: number; type: string; payload?: Record<string, unknown> }) {
  const payload = job.payload ?? {};
  if (job.type === "linear.fetchIssue") {
    const linearId = String(payload.linearId || "");
    const raw = await runCli("linear", ["issue", "view", linearId, "--json"]);
    const issue = JSON.parse(raw);
    return { ...issue, linearId: issue.identifier ?? linearId, priority: normalizeLinearPriority(issue.priority, issue) };
  }
  if (job.type === "linear.syncState") {
    await runCli("linear", ["issue", "update", String(payload.linearId), "--state", String(payload.state)]);
    return { ok: true };
  }
  if (job.type === "linear.listAssigned") {
    const team = String(payload.team || "");
    const raw = await runCli("linear", [
      "issue", "query", "--team", team,
      "--assignee", "@me",
      "-s", "triage", "-s", "backlog", "-s", "unstarted", "-s", "started",
      "--sort", "priority", "--no-pager", "--json",
    ]);
    return normalizeLinearQueryResult(raw);
  }
  throw new Error(`Unsupported desktop job: ${job.type}`);
}

async function pollDesktopJobs() {
  try {
    await fetch(`${dashboardOrigin}/api/desktop/heartbeat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ platform: Deno.build.os, pid: Deno.pid }),
      signal: AbortSignal.timeout(5000),
    }).catch(() => {});

    const response = await fetch(`${dashboardOrigin}/api/desktop/jobs?limit=5`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return;
    const jobs = await response.json();
    if (!Array.isArray(jobs)) return;
    for (const job of jobs) {
      try {
        const result = await handleDesktopJob(job);
        await fetch(`${dashboardOrigin}/api/desktop/jobs/${job.id}/complete`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ok: true, result }),
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        await appendLog(`desktop job ${job.id} failed: ${message}`);
        await fetch(`${dashboardOrigin}/api/desktop/jobs/${job.id}/complete`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ok: false, error: message }),
        }).catch(() => {});
      }
    }
  } catch (error) {
    await appendLog(`desktop job poll failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function backendPickerPage(message = ""): Response {
  return new Response(
    `<!doctype html>
<html>
  <head>
    <title>Forge Backend</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 48px; color: #111827; }
      input { min-width: 420px; padding: 8px; }
      button { padding: 8px 12px; }
      code { background: #f3f4f6; padding: 2px 4px; border-radius: 4px; }
      .msg { margin: 12px 0; color: #047857; }
    </style>
  </head>
  <body>
    <h1>Forge backend</h1>
    <p>Choose which Forge dashboard backend this desktop app should use.</p>
    ${message ? `<p class="msg">${escapeHtml(message)}</p>` : ""}
    <form method="post" action="/desktop/backend" style="display: flex; gap: 8px; align-items: center; margin: 16px 0;">
      <input name="backendOrigin" value="${escapeHtml(dashboardOrigin)}" placeholder="http://127.0.0.1:3142" />
      <button type="submit">Use backend</button>
    </form>
    <p>Current backend: <code>${escapeHtml(dashboardOrigin)}</code></p>
    <p><a href="/">Open dashboard</a></p>
  </body>
</html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

async function proxyFetch(request: Request, targetUrl: URL): Promise<Response> {
  const headers = new Headers(request.headers);
  headers.set("host", targetUrl.host);

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD"
      ? undefined
      : request.body,
    redirect: "manual",
  });

  if (request.method !== "GET" || !["/api/overview", "/api/issues"].includes(targetUrl.pathname)) {
    return response;
  }

  try {
    const payload = await response.clone().json();
    if (targetUrl.pathname === "/api/overview" && payload && Array.isArray(payload.issues)) {
      payload.issues = payload.issues.filter((issue: { state?: unknown }) => issue.state !== "DONE");
    }
    if (targetUrl.pathname === "/api/issues" && Array.isArray(payload)) {
      const filtered = payload.filter((issue: { state?: unknown }) => issue.state !== "DONE");
      return json(filtered, response.status);
    }
    const nextHeaders = new Headers(response.headers);
    nextHeaders.set("content-type", "application/json; charset=utf-8");
    nextHeaders.set("cache-control", "no-store");
    return new Response(JSON.stringify(payload), { status: response.status, headers: nextHeaders });
  } catch {
    return response;
  }
}

function proxyWebSocket(request: Request, targetUrl: URL): Response {
  const { socket, response } = Deno.upgradeWebSocket(request);
  targetUrl.protocol = targetUrl.protocol === "https:" ? "wss:" : "ws:";
  const upstream = new WebSocket(targetUrl);
  const pending: Array<string | ArrayBufferLike | Blob | ArrayBufferView> = [];

  const sendUpstream = (
    data: string | ArrayBufferLike | Blob | ArrayBufferView,
  ) => {
    if (upstream.readyState === WebSocket.OPEN) upstream.send(data);
    else pending.push(data);
  };

  socket.onmessage = (event) => sendUpstream(event.data);
  socket.onclose = () => upstream.close();
  socket.onerror = () => upstream.close();

  upstream.onopen = () => {
    while (pending.length) upstream.send(pending.shift()!);
  };
  upstream.onmessage = (event) => {
    if (socket.readyState === WebSocket.OPEN) socket.send(event.data);
  };
  upstream.onclose = (event) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.close(event.code, event.reason);
    }
  };
  upstream.onerror = () => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.close(1011, "Upstream websocket error");
    }
  };

  return response;
}

type BrowserWindowConstructor = new (options: {
  title?: string;
  width?: number;
  height?: number;
}) => EventTarget;

const BrowserWindow = (Deno as unknown as {
  BrowserWindow?: BrowserWindowConstructor;
}).BrowserWindow;

if (BrowserWindow) {
  const win = new BrowserWindow({
    title: "Forge",
    width: 1440,
    height: 1000,
  });

  win.addEventListener("close", () => {
    statusBarProcess?.kill("SIGTERM");
    dashboardProcess?.kill("SIGTERM");
  });
}

Deno.addSignalListener?.("SIGINT", () => {
  statusBarProcess?.kill("SIGTERM");
  dashboardProcess?.kill("SIGTERM");
  Deno.exit(0);
});

// Start the backend as soon as the desktop app opens, rather than waiting for
// the first webview request. Requests still call ensureDashboard() as a safety
// net and to restart the backend if it exits.
ensureDashboard().catch((error) => {
  appendLog(
    `initial dashboard startup error: ${
      error instanceof Error ? error.stack : String(error)
    }`,
  );
});
setInterval(() => pollDesktopJobs(), 3000);
pollDesktopJobs();

Deno.serve(async (request) => {
  const sourceUrl = new URL(request.url);

  if (request.method === "GET") {
    const localAsset = await serveLocalDashboardAsset(sourceUrl.pathname);
    if (localAsset) return localAsset;
  }

  if (sourceUrl.pathname === "/api/desktop-capabilities") {
    const source = `${FORGE_DIR}/desktop/notify.swift`;
    const binary = `${FORGE_DIR}/desktop/forge-notify`;
    const notifications = Deno.build.os === "darwin" &&
      (await executableExists(source)) &&
      ((await executableExists(binary)) || !!(await findExecutable("swiftc", ["/usr/bin/swiftc"])));
    return json({ notifications });
  }

  if (sourceUrl.pathname === "/api/desktop-notify") {
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }
    try {
      await sendNativeNotification(await request.json().catch(() => ({})));
      return json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await appendLog(`native notification error: ${message}`);
      return json({ error: message }, 500);
    }
  }

  if (sourceUrl.pathname === "/api/desktop-backend") {
    if (request.method === "GET") return json({ backendOrigin: dashboardOrigin, configFile: DESKTOP_CONFIG_FILE });
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    try {
      const body = await request.json().catch(() => ({}));
      const origin = await saveBackendOrigin(String(body.backendOrigin || body.origin || ""));
      return json({ ok: true, backendOrigin: origin });
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : String(error) }, 400);
    }
  }

  if (sourceUrl.pathname === "/desktop/backend") {
    if (request.method === "GET") return backendPickerPage();
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    try {
      const form = await request.formData();
      const origin = await saveBackendOrigin(String(form.get("backendOrigin") || ""));
      return backendPickerPage(`Backend set to ${origin}`);
    } catch (error) {
      return backendPickerPage(error instanceof Error ? error.message : String(error));
    }
  }

  try {
    await ensureDashboard();
  } catch (error) {
    await appendLog(
      `startup error: ${error instanceof Error ? error.stack : String(error)}`,
    );
    return errorPage(error);
  }

  const targetUrl = new URL(
    sourceUrl.pathname + sourceUrl.search,
    dashboardOrigin,
  );

  if (request.headers.get("upgrade")?.toLowerCase() === "websocket") {
    return proxyWebSocket(request, targetUrl);
  }

  return proxyFetch(request, targetUrl);
});
