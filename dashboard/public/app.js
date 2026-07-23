/* ── Forge Dashboard — app.js ───────────────────────────────────────── */

"use strict";

// ── Helpers ───────────────────────────────────────────────────────────

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

async function api(method, url, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (method === "GET") opts.cache = "no-store";
  if (body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) { const err = await res.json().catch(() => ({ error: res.statusText })); throw new Error(err.error ?? res.statusText); }
  return res.json();
}

const get  = (url)        => api("GET", url);
const post = (url, body)  => api("POST", url, body);
const patch = (url, body) => api("PATCH", url, body);
const put  = (url, body)  => api("PUT", url, body);

const renderSignatures = new Map();
function shouldRender(key, signature) {
  const sig = typeof signature === "string" ? signature : JSON.stringify(signature);
  if (renderSignatures.get(key) === sig) return false;
  renderSignatures.set(key, sig);
  return true;
}

function setHTMLIfChanged(el, html) {
  if (!el || el.dataset.renderHtml === html) return false;
  el.innerHTML = html;
  el.dataset.renderHtml = html;
  return true;
}

function minuteBucket() {
  return Math.floor(Date.now() / 60000);
}

let activeTerminal = null;
let terminalPanelOpen = false;

function closeActiveTerminal() {
  if (!activeTerminal) return;
  if (activeTerminal.resizeListener) window.removeEventListener("resize", activeTerminal.resizeListener);
  try { activeTerminal.ws?.close(); } catch {}
  try { activeTerminal.term?.dispose(); } catch {}
  activeTerminal = null;
}

function terminalWsUrl(issueId) {
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${location.host}/api/issues/${issueId}/terminal`;
}

function initIssueTerminal(issueId) {
  const container = $("#issue-terminal");
  const statusEl = $("#issue-terminal-status");
  if (!container || typeof Terminal === "undefined") return;
  if (activeTerminal?.issueId === issueId) {
    activeTerminal.fitAddon?.fit();
    activeTerminal.term?.focus();
    return;
  }

  closeActiveTerminal();

  const term = new Terminal({
    cursorBlink: true,
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 12,
    theme: { background: "#08090a", foreground: "#d0d6e0", cursor: "#7170ff" },
    scrollback: 5000,
  });
  const FitAddonCtor = window.FitAddon?.FitAddon;
  const fitAddon = FitAddonCtor ? new FitAddonCtor() : null;
  if (fitAddon) term.loadAddon(fitAddon);
  term.open(container);
  fitAddon?.fit();

  const ws = new WebSocket(terminalWsUrl(issueId));
  activeTerminal = { issueId, term, ws, fitAddon };

  const setStatus = (text, cls = "") => {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.className = `terminal-status ${cls}`;
  };

  ws.addEventListener("open", () => {
    setStatus("connected", "connected");
    fitAddon?.fit();
    ws.send(JSON.stringify({ type: "resize", cols: term.cols, rows: term.rows }));
    term.focus();
  });
  ws.addEventListener("message", (event) => term.write(event.data));
  ws.addEventListener("close", () => setStatus("disconnected", "disconnected"));
  ws.addEventListener("error", () => setStatus("error", "disconnected"));
  term.onData((data) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "input", data }));
  });

  const resize = () => {
    if (activeTerminal?.issueId !== issueId) return;
    fitAddon?.fit();
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "resize", cols: term.cols, rows: term.rows }));
    }
  };
  window.addEventListener("resize", resize);
  activeTerminal.resizeListener = resize;
}

function parseUTC(iso) {
  if (!iso) return null;
  // SQLite datetime('now') returns bare UTC strings without timezone indicator.
  // Append 'Z' so the browser treats them as UTC, not local time.
  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/.test(iso) && !iso.endsWith('Z') && !iso.includes('+')) {
    return new Date(iso.replace(' ', 'T') + 'Z');
  }
  return new Date(iso);
}

function formatElapsed(iso) {
  if (!iso) return "";
  const ms = Date.now() - (parseUTC(iso)?.getTime() ?? 0);
  if (ms < 0) return "";
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3600000) return `${Math.round(ms / 60000)}m`;
  const h = Math.floor(ms / 3600000);
  const m = Math.round((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}

function timeAgo(iso) {
  if (!iso) return "—";
  const d = parseUTC(iso);
  const diff = Date.now() - (d?.getTime() ?? 0);
  const rel = diff < 60000   ? `${Math.round(diff/1000)}s ago`
            : diff < 3600000 ? `${Math.round(diff/60000)}m ago`
            : diff < 86400000 ? `${Math.round(diff/3600000)}h ago`
            : `${Math.round(diff/86400000)}d ago`;
  const abs = d ? d.toLocaleString() : "";
  return `<span title="${abs}">${rel}</span>`;
}

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
  IN_MERGE_QUEUE:       "in merge queue",
  SPLIT_PLANNING:       "split planning",
  AWAITING_SPLIT_APPROVAL: "awaiting split approval",
  SPLITTING:            "splitting PR stack",
  AWAITING_FIX_APPROVAL: "awaiting fix",
  FIXING:               "fixing",
  PUSHING:              "pushing",
  DONE:                 "done",
  PAUSED:               "paused",
  FAILED:               "failed",
};

function statePill(state) {
  const label = STATE_LABELS[state] ?? state.toLowerCase().replace(/_/g,' ');
  return `<span class="state-pill state-${state}">${label}</span>`;
}

function priorityLabel(p) {
  return ["\u2014\u2014\u2014","\u2584\u2586\u2588","\u2584\u2586\u2591","\u2584\u2591\u2591","\u2591\u2591\u2591"][p] ?? "";
}

// ── Desktop Notifications ───────────────────────────────────────────

const NOTIF_SESSION_KEY = "forge_seen_decision_ids";
const APPROVAL_NOTIF_SESSION_KEY = "forge_seen_pr_approved_issue_keys";
let _notifBootstrapped = false;
let _approvalNotifBootstrapped = false;
let _seenDecisionIds   = new Set();
let _seenApprovedIssueKeys = new Set();
let _nativeDesktopNotifications = false;

function _loadSeenIds() {
  try {
    const arr = JSON.parse(sessionStorage.getItem(NOTIF_SESSION_KEY) || "[]");
    _seenDecisionIds = new Set(arr);
  } catch { _seenDecisionIds = new Set(); }

  try {
    const arr = JSON.parse(sessionStorage.getItem(APPROVAL_NOTIF_SESSION_KEY) || "[]");
    _seenApprovedIssueKeys = new Set(arr);
  } catch { _seenApprovedIssueKeys = new Set(); }
}

function _saveSeenIds() {
  try {
    // keep bounded
    const arr = [..._seenDecisionIds].slice(-1000);
    sessionStorage.setItem(NOTIF_SESSION_KEY, JSON.stringify(arr));
  } catch {}

  try {
    const arr = [..._seenApprovedIssueKeys].slice(-1000);
    sessionStorage.setItem(APPROVAL_NOTIF_SESSION_KEY, JSON.stringify(arr));
  } catch {}
}

function notifPermission() {
  if (!("Notification" in window)) return "unavailable";
  return Notification.permission; // "default" | "granted" | "denied"
}

async function loadDesktopCapabilities() {
  try {
    const res = await fetch("/api/desktop-capabilities", { cache: "no-store" });
    if (!res.ok) return;
    const capabilities = await res.json();
    _nativeDesktopNotifications = !!capabilities.notifications;
  } catch {
    _nativeDesktopNotifications = false;
  }
}

async function nativeNotify(title, body) {
  if (!_nativeDesktopNotifications) return false;
  try {
    const res = await fetch("/api/desktop-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function canNotify() {
  return notifPermission() === "granted" || _nativeDesktopNotifications;
}

function sendForgeNotification({ title, body, tag, requireInteraction, icon, onClick }) {
  if (notifPermission() === "granted") {
    try {
      const n = new Notification(title, { body, tag, requireInteraction, icon });
      if (onClick) n.addEventListener("click", () => onClick(n));
      return n;
    } catch {}
  }

  nativeNotify(title, body);
  return null;
}

function updateNotifButton() {
  const btn = $("#btn-notifications");
  if (!btn) return;
  const perm = notifPermission();
  if (perm === "unavailable") {
    if (_nativeDesktopNotifications) {
      btn.style.display = "";
      btn.className = "btn-notif notif-granted";
      btn.title = "Using native desktop notifications";
      btn.innerHTML = `<span style="font-size:11px">🔔</span> Native`;
    } else {
      btn.style.display = "none";
    }
    return;
  }
  btn.className = `btn-notif notif-${perm === "granted" ? "granted" : perm === "denied" ? "denied" : "default"}`;
  if (perm === "granted") {
    btn.title = "Desktop notifications enabled — click to test";
    btn.innerHTML = `<span style="font-size:11px">🔔</span> On`;
  } else if (perm === "denied") {
    if (_nativeDesktopNotifications) {
      btn.title = "Browser notifications are blocked; using native desktop notifications";
      btn.innerHTML = `<span style="font-size:11px">🔔</span> Native`;
    } else {
      btn.title = "Notifications blocked — enable in browser settings (Site Settings → Notifications)";
      btn.innerHTML = `<span style="font-size:11px">🔕</span> Blocked`;
    }
  } else {
    btn.title = "Click to enable desktop notifications when action is needed";
    btn.innerHTML = `<span style="font-size:11px">🔔</span> Enable`;
  }
}

async function handleNotifButtonClick() {
  const perm = notifPermission();
  if (perm === "unavailable") {
    if (_nativeDesktopNotifications) {
      await nativeNotify("⚒️ Forge — Notifications Active", "You'll be notified when Forge needs your attention.");
    }
    return;
  }
  if (perm === "denied") {
    if (_nativeDesktopNotifications) {
      await nativeNotify("⚒️ Forge — Notifications Active", "You'll be notified when Forge needs your attention.");
    } else {
      alert("Notifications are blocked by your browser.\n\nTo enable:\n1. Click the lock icon in your address bar\n2. Set Notifications → Allow");
    }
    return;
  }
  if (perm === "granted") {
    const n = sendForgeNotification({
      title: "⚒️ Forge — Notifications Active",
      body: "You'll be notified when Forge needs your attention.",
      tag: "forge-test",
    });
    if (n) setTimeout(() => n.close(), 4000);
    return;
  }
  // Request permission
  const result = await Notification.requestPermission();
  updateNotifButton();
  if (result === "granted") {
    const n = sendForgeNotification({
      title: "⚒️ Forge — Notifications enabled",
      body: "You'll be notified when Forge needs your attention.",
      tag: "forge-welcome",
    });
    if (n) setTimeout(() => n.close(), 4000);
  } else if (_nativeDesktopNotifications) {
    await nativeNotify("⚒️ Forge — Notifications Active", "Browser notifications are blocked, so Forge will use native notifications.");
  }
}

const DECISION_TYPE_LABELS = {
  PLAN_REVIEW:     "Plan review ready",
  CODE_REVIEW:     "Code review ready",
  FIX_APPROVAL:    "Fix needs your approval",
  AI_PLAN_REVIEW:  "AI reviewed the plan",
  AI_CODE_REVIEW:  "AI reviewed the code",
};

function checkForNewApprovedIssues(issues) {
  const activeApproved = issues.filter(i => i.pr_approved_at && !["DONE", "PAUSED", "IGNORED", "FAILED"].includes(i.state));
  const approvalKey = (issue) => `${issue.id}:${issue.pr_approved_at}`;

  if (!_approvalNotifBootstrapped) {
    _approvalNotifBootstrapped = true;
    activeApproved.forEach(i => _seenApprovedIssueKeys.add(approvalKey(i)));
    _saveSeenIds();
    return;
  }

  const newlyApproved = activeApproved.filter(i => !_seenApprovedIssueKeys.has(approvalKey(i)));
  if (!newlyApproved.length) return;

  activeApproved.forEach(i => _seenApprovedIssueKeys.add(approvalKey(i)));
  _saveSeenIds();

  if (!canNotify()) return;

  for (const issue of newlyApproved) {
    sendForgeNotification({
      title: `⚒️ Forge — PR Approved`,
      body: `${issue.linear_id ?? `Issue #${issue.id}`}\n${issue.title}`,
      tag: `forge-pr-approved-${issue.id}-${issue.pr_approved_at}`,
      requireInteraction: true,
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✅</text></svg>",
      onClick: (n) => {
        window.focus();
        openIssue(issue.id);
        n.close();
      },
    });
  }
}

function checkForNewDecisions(decisions) {
  if (!_notifBootstrapped) {
    // First call — seed seen set so we don't spam on page load
    _notifBootstrapped = true;
    decisions.forEach(d => _seenDecisionIds.add(d.id));
    _saveSeenIds();
    return;
  }

  const genuinelyNew = decisions.filter(d => !_seenDecisionIds.has(d.id));
  if (!genuinelyNew.length) return;

  // Mark all current decisions as seen immediately
  decisions.forEach(d => _seenDecisionIds.add(d.id));
  _saveSeenIds();

  if (!canNotify()) return;

  for (const d of genuinelyNew) {
    const label = DECISION_TYPE_LABELS[d.type] ?? d.type.replace(/_/g, " ");
    const title = d.issueTitle ?? `Issue #${d.issue_id}`;
    sendForgeNotification({
      title: `⚒️ Forge — Action Required`,
      body: `${label}\n${title}`,
      tag: `forge-decision-${d.id}`,
      requireInteraction: true,
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚒️</text></svg>",
      onClick: (n) => {
        window.focus();
        if (d.type === "CODE_REVIEW") openReview(d.issue_id);
        else openIssue(d.issue_id);
        n.close();
      },
    });
  }
}

// ── Views & routing ───────────────────────────────────────────────────

// Track active view so the SSE tick knows what to refresh
let activeView    = "queue";
let activeIssueId = null;
let renderedIssueId = null;
let issueRenderSeq = 0;
let issueDetailSignature = "";

function showView(name, { pushState = true } = {}) {
  $$(".view").forEach(v => v.classList.remove("active"));
  const v = $(`#view-${name}`);
  if (v) v.classList.add("active");
  activeView = name;
  if (name !== "issue") closeActiveTerminal();
  if (name !== "issue" && name !== "review") activeIssueId = null;
  if (pushState) {
    const hash = name === "queue" ? "" : `#${name}`;
    if (location.hash !== hash) history.pushState(null, "", location.pathname + hash);
  }
}

function showIssueView(id, { pushState = true } = {}) {
  showView("issue", { pushState: false });
  activeIssueId = id;
  if (pushState) {
    const hash = `#issue/${id}`;
    if (location.hash !== hash) history.pushState(null, "", location.pathname + hash);
  }
}

async function openArchive({ pushState = true } = {}) {
  showView("archive", { pushState: false });
  if (pushState) history.pushState(null, "", "#archive");

  const panel = $("#archive-panel");
  panel.innerHTML = `<div style="padding:32px;color:var(--text-4)">Loading…</div>`;

  const issues = await get("/api/archive");

  if (!issues.length) {
    panel.innerHTML = `
      <div style="padding:48px 32px">
        <div style="font-size:13px;font-weight:510;color:var(--text);margin-bottom:6px">No completed issues yet</div>
        <div style="font-size:12px;color:var(--text-4)">Completed issues will appear here once all PRs are merged.</div>
      </div>`;
    return;
  }

  panel.innerHTML = `
    <div style="padding:24px 32px;max-width:960px;margin:0 auto">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
        <div>
          <div style="font-size:18px;font-weight:400;color:var(--text);letter-spacing:-0.288px">🗃️ Archive</div>
          <div style="font-size:12px;color:var(--text-4);margin-top:4px">${issues.length} completed issue${issues.length !== 1 ? "s" : ""}</div>
        </div>
        <button class="btn-back" id="btn-archive-back">← Queue</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${issues.map(issue => {
          const prs = issue.prStack ?? [];
          const mergedPrs = prs.filter(p => p.status === "merged");
          const prLinks = prs.map(p => p.pr_number
            ? `<a href="${prUrl(p.pr_number)}" target="_blank" style="color:var(--accent-vivid);font-family:'JetBrains Mono',monospace;font-size:11px">#${p.pr_number}</a>`
            : null).filter(Boolean).join(" ");

          return `
            <div class="issue-card archive-card" data-id="${issue.id}" style="cursor:pointer">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px">
                <div style="flex:1">
                  <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                    ${linearIssueLink(issue.linear_id)}
                    ${statePill("DONE")}
                  </div>
                  <div class="card-title">${esc(issue.title)}</div>
                </div>
                <div style="font-size:11px;color:var(--text-4);white-space:nowrap;text-align:right">
                  <div>${timeAgo(issue.updated_at)}</div>
                  <div style="margin-top:4px">${issue.run_count} run${issue.run_count !== 1 ? "s" : ""} · ${prs.length} PR${prs.length !== 1 ? "s" : ""}</div>
                  ${prLinks ? `<div style="margin-top:4px">${prLinks}</div>` : ""}
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;

  $("#btn-archive-back").addEventListener("click", () => history.back());
  $$("#archive-panel .archive-card").forEach(card => {
    card.addEventListener("click", () => openIssue(parseInt(card.dataset.id)));
  });
}

function routeFromHash() {
  const hash = location.hash;
  if (!hash || hash === "#" || hash === "#queue") {
    showView("queue", { pushState: false });
  } else if (hash === "#archive") {
    openArchive({ pushState: false });
  } else if (hash.startsWith("#issue/")) {
    const id = parseInt(hash.slice(7), 10);
    if (id) openIssue(id, { pushState: false });
  } else if (hash.startsWith("#review/")) {
    const id = parseInt(hash.slice(8), 10);
    if (id) openReview(id, { pushState: false });
  } else if (hash === "#settings") {
    openSettings({ pushState: false });
  }
}

// ── Modal ─────────────────────────────────────────────────────────────

function showModal(content, onClose) {
  const overlay = $("#modal-overlay");
  const modal = $("#modal");
  $("#modal-content").innerHTML = content;
  overlay.classList.remove("hidden");
  const previousFocus = document.activeElement;
  const cleanup = () => {
    overlay.classList.add("hidden");
    document.removeEventListener("keydown", onKeyDown, true);
    overlay.removeEventListener("click", onOverlayClick);
    previousFocus?.focus?.();
    if (onClose) onClose();
  };
  const focusables = () => $$("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])", modal)
    .filter(el => !el.disabled && el.offsetParent !== null);
  const onKeyDown = (e) => {
    if (e.key === "Escape") { e.preventDefault(); cleanup(); return; }
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      const primary = $(".modal-actions .btn-primary, .modal-actions .btn-success, .modal-actions .btn-danger", modal);
      if (primary) { e.preventDefault(); primary.click(); }
    }
    if (e.key === "Tab") {
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  const onOverlayClick = (e) => {
    if (e.target === overlay) cleanup();
  };
  document.addEventListener("keydown", onKeyDown, true);
  overlay.addEventListener("click", onOverlayClick);
  setTimeout(() => {
    const target = $("[autofocus]", modal) || $("textarea, input, select, button", modal);
    target?.focus?.();
  }, 0);
  return cleanup;
}

function closeModal() {
  $("#modal-overlay").classList.add("hidden");
}

function showConfirmModal(title, bodyHtml, confirmLabel, confirmClass, onConfirm) {
  const close = showModal(`
    <h3>${esc(title)}</h3>
    <p style="font-size:13px;color:var(--text-2);line-height:1.6;margin-bottom:16px">${bodyHtml}</p>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="btn-confirm-cancel">Cancel</button>
      <button class="btn ${confirmClass}" id="btn-confirm-ok">${esc(confirmLabel)}</button>
    </div>
  `);
  $("#btn-confirm-cancel").addEventListener("click", close);
  $("#btn-confirm-ok").addEventListener("click", async (event) => {
    const btn = event.currentTarget;
    btn.disabled = true;
    btn.textContent = "Working…";
    try {
      await onConfirm();
      close();
    } catch (error) {
      btn.disabled = false;
      btn.textContent = confirmLabel;
      alert(error?.message || String(error));
    }
  });
}

function showTypedConfirmModal(title, bodyHtml, phrase, confirmLabel, onConfirm) {
  const close = showModal(`
    <h3>${esc(title)}</h3>
    <div style="font-size:13px;color:var(--text-2);line-height:1.6;margin-bottom:14px">${bodyHtml}</div>
    <label class="modal-label">Type <code>${esc(phrase)}</code> to confirm</label>
    <input class="modal-input" id="typed-confirm-input" autocomplete="off" autofocus />
    <div class="modal-actions">
      <button class="btn btn-ghost" id="btn-typed-cancel">Cancel</button>
      <button class="btn btn-danger" id="btn-typed-ok" disabled>${esc(confirmLabel)}</button>
    </div>
  `);
  const input = $("#typed-confirm-input");
  const ok = $("#btn-typed-ok");
  input.addEventListener("input", () => ok.disabled = input.value !== phrase);
  $("#btn-typed-cancel").addEventListener("click", close);
  ok.addEventListener("click", async () => { if (ok.disabled) return; close(); await onConfirm(); });
}

function showPlanApprovalModal(decisionId, onApprove) {
  const close = showModal(`
    <h3>✅ Approve Plan</h3>
    <p style="font-size:13px;color:var(--text-2);line-height:1.6;margin-bottom:12px">The plan will be approved and the coder will begin implementation.</p>
    <label style="display:block;font-size:12px;font-weight:600;color:var(--text-3);margin-bottom:6px">Steering comment <span style="font-weight:400;color:var(--text-4)">(optional)</span></label>
    <textarea id="plan-approval-comment" placeholder="Any extra guidance for the implementation…" style="width:100%;min-height:90px;resize:vertical;box-sizing:border-box;background:var(--bg-2);color:var(--text-1);border:1px solid var(--border);border-radius:6px;padding:8px 10px;font-size:13px;font-family:inherit"></textarea>
    <div class="modal-actions" style="margin-top:14px">
      <button class="btn btn-ghost" id="btn-plan-approve-cancel">Cancel</button>
      <button class="btn btn-success" id="btn-plan-approve-ok">✅ Approve</button>
    </div>
  `);
  $("#plan-approval-comment").focus();
  $("#btn-plan-approve-cancel").addEventListener("click", close);
  $("#btn-plan-approve-ok").addEventListener("click", async () => {
    const comment = $("#plan-approval-comment").value.trim();
    close();
    await onApprove(comment || null);
  });
}

// ── Overview rendering ────────────────────────────────────────────────

let state = { issues: [], decisions: [], runningAgents: [], scheduler: {}, settings: {}, vmRuntime: {} };
let queueFilters = { query: "", filter: "all", sort: "priority" };
let listenAutoScroll = true;
let listenLastError = "";
let activeReorderInProgress = false;

const RUNNING_STATES = ["SETTING_UP","PLANNING","AI_PLAN_REVIEWING","WORKING","AI_REVIEWING","CREATING_PR","WATCHING_PR","IN_MERGE_QUEUE","SPLIT_PLANNING","SPLITTING","FIXING","PUSHING"];
const WATCHING_STATES = ["WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "PUSHING"];

function issueMatchesQuery(issue, query) {
  if (!query) return true;
  const haystack = [issue.title, issue.linear_id, issue.state, issue.source, issue.wt_path, issue.project_file_path]
    .filter(Boolean).join(" ").toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function issueMatchesFilter(issue, filter, runningAgents = state.runningAgents, decisions = state.decisions) {
  if (filter === "all") return true;
  if (filter === "needs") return issue.state?.startsWith("AWAITING") || decisions.some(d => d.issue_id === issue.id);
  if (filter === "running") return runningAgents.some(r => r.issue_id === issue.id) || RUNNING_STATES.includes(issue.state);
  if (filter === "failed") return issue.state === "FAILED";
  if (filter === "watching") return WATCHING_STATES.includes(issue.state);
  if (filter === "paused") return issue.state === "PAUSED";
  return true;
}

function sortIssues(issues, sort) {
  const arr = [...issues];
  const createdTime = (i) => parseUTC(i.created_at || i.createdAt || i.updated_at || i.updatedAt)?.getTime() ?? 0;
  const updatedTime = (i) => parseUTC(i.updated_at || i.updatedAt || i.created_at || i.createdAt)?.getTime() ?? 0;
  if (sort === "updated") {
    return arr.sort((a, b) => updatedTime(b) - updatedTime(a));
  }
  if (sort === "newest") {
    return arr.sort((a, b) => createdTime(b) - createdTime(a));
  }
  if (sort === "oldest") {
    return arr.sort((a, b) => createdTime(a) - createdTime(b));
  }
  return arr.sort((a, b) => (a.priority || 999) - (b.priority || 999));
}

function applyIssueFilters(issues) {
  return sortIssues(
    issues.filter(i => issueMatchesQuery(i, queueFilters.query) && issueMatchesFilter(i, queueFilters.filter)),
    queueFilters.sort
  );
}

function applyActiveIssueFilters(issues) {
  const filtered = issues.filter(i => issueMatchesQuery(i, queueFilters.query) && issueMatchesFilter(i, queueFilters.filter));
  const fallback = sortIssues(filtered, queueFilters.sort);
  const fallbackIndex = new Map(fallback.map((issue, index) => [issue.id, index]));
  return [...filtered].sort((a, b) => {
    const parsedAr = Number(a.focus_rank);
    const parsedBr = Number(b.focus_rank);
    const ar = Number.isFinite(parsedAr) && parsedAr > 0 ? parsedAr : null;
    const br = Number.isFinite(parsedBr) && parsedBr > 0 ? parsedBr : null;
    if (ar !== null && br !== null && ar !== br) return ar - br;
    if (ar !== null && br === null) return -1;
    if (ar === null && br !== null) return 1;
    return (fallbackIndex.get(a.id) ?? 0) - (fallbackIndex.get(b.id) ?? 0);
  });
}

function openNextDecision() {
  const first = state.decisions?.[0];
  if (!first) return;
  if (first.type === "CODE_REVIEW") openReview(first.issue_id);
  else openIssue(first.issue_id);
}

function prUrl(prNumber) {
  const repo = state.settings?.github_repo ?? "";
  return `https://github.com/${repo}/pull/${prNumber}`;
}

function renderVmRuntimeHeader(vmRuntime = state.vmRuntime) {
  const badge = $("#vm-runtime-badge");
  const stopBtn = $("#btn-vm-stop");
  if (!badge || !stopBtn) return;
  const meta = vmRuntime?.metadata ?? {};
  const running = Boolean(vmRuntime?.running);
  badge.className = `vm-runtime-badge ${running ? "vm-on" : "vm-off"}`;
  if (!vmRuntime?.configured) {
    badge.textContent = "Runtime not configured";
    badge.title = "workspace-run.config.json is invalid";
    stopBtn.classList.add("hidden");
    return;
  }
  const label = vmRuntime.mode === "ssh" ? `SSH ${vmRuntime.target || meta.target || ""}`.trim() : "Local";
  if (running) {
    const issue = meta.linearId || (meta.issueId ? `#${meta.issueId}` : "unknown issue");
    const branch = meta.branch || "unknown branch";
    badge.textContent = `${label} · ${issue} · ${branch}`;
    badge.title = `Running ${meta.title || issue}\n${branch}\nFrontend: ${meta.frontendUrl || "http://localhost:3000"}\nBackend: ${meta.backendUrl || "http://localhost:8080"}`;
    stopBtn.classList.remove("hidden");
  } else {
    badge.textContent = `${label} idle`.trim();
    badge.title = vmRuntime.error ? `Runtime status unavailable: ${vmRuntime.error}` : "No Forge-managed runtime jobs are running";
    stopBtn.classList.add("hidden");
  }
}

function linearIssueUrl(linearId) {
  return `https://linear.app/issue/${encodeURIComponent(linearId)}`;
}

function linearIssueLink(linearId, className = "tag-source-linear") {
  if (!linearId) return '<span class="tag-source-manual">MANUAL</span>';
  return `<a href="${linearIssueUrl(linearId)}" target="_blank" rel="noopener noreferrer" class="${className} linear-issue-link" title="Open ${esc(linearId)} in Linear">${esc(linearId)}</a>`;
}

let overviewPromise = null;
let overviewDataSignature = "";
async function loadOverview() {
  if (overviewPromise) return overviewPromise;
  overviewPromise = (async () => {
    const data = await get("/api/overview");
    const prevLinear = state._linearIssues; // preserve across refreshes
    const nextSignature = JSON.stringify(data);
    state = data;
    state._linearIssues = prevLinear;
    if (nextSignature !== overviewDataSignature) {
      overviewDataSignature = nextSignature;
      renderOverview();
    }
    return data;
  })();
  try {
    return await overviewPromise;
  } finally {
    overviewPromise = null;
  }
}

function renderOverview() {
  const { issues, decisions, runningAgents, scheduler, settings } = state;

  // Scheduler badge
  const badge = $("#scheduler-badge");
  badge.textContent = scheduler.running ? `⚡ running` : `◉ stopped`;
  badge.className = `badge ${scheduler.running ? "badge-on" : "badge-off"}`;

  // Agent count
  const agentBadge = $("#agent-count");
  agentBadge.textContent = `${runningAgents.length} agent${runningAgents.length !== 1 ? "s" : ""}`;

  renderVmRuntimeHeader(state.vmRuntime);

  // Leverage
  const activeCount = issues.filter(i => !["PENDING","DONE","PAUSED","IGNORED","FAILED"].includes(i.state)).length;
  const awaitingCount = issues.filter(i => i.state.startsWith("AWAITING") || i.state === "STEERING").length;
  $("#leverage").textContent = activeCount > 0
    ? `${activeCount - awaitingCount} autonomous / ${awaitingCount} need you`
    : "";

  // Decision badge (desktop + mobile tab)
  const decisionBadge = $("#decision-badge");
  const mobileBadge   = $("#mobile-decision-badge");
  const decisionAwaitingCount = decisions.length;
  if (decisionAwaitingCount > 0) {
    decisionBadge.textContent = decisionAwaitingCount;
    decisionBadge.classList.remove("hidden");
    if (mobileBadge) { mobileBadge.textContent = decisionAwaitingCount; mobileBadge.classList.remove("hidden"); }
  } else {
    decisionBadge.classList.add("hidden");
    if (mobileBadge) mobileBadge.classList.add("hidden");
  }

  renderQueueSummary(issues, decisions, runningAgents);

  // Segment issues
  const pending  = applyIssueFilters(issues.filter(i => i.state === "PENDING"));
  const active   = applyActiveIssueFilters(issues.filter(i => !["PENDING","DONE"].includes(i.state)));
  const linIssues = filterLinearIssues(state._linearIssues ?? null);

  renderLinearIssues(linIssues);
  renderIssueList("#pending-issues", pending, issues.length === 0 ? "Click ↻ Linear then Enqueue to start." : "No queued issues match your filters.");
  renderActiveIssues(active, runningAgents);
  renderDecisionQueue(filterDecisions(decisions));

  // —— Urgency / notification side-effects ——

  // Page title: show count when action needed
  const pendingCount = decisions.length;
  document.title = pendingCount > 0 ? `(${pendingCount}) Forge` : "Forge";

  // Awaiting You column urgency class
  const decCol = document.querySelector(".column-decisions");
  if (decCol) decCol.classList.toggle("has-decisions", pendingCount > 0);

  // Decision badge pulse
  const decBadge = $("#decision-badge");
  if (decBadge) decBadge.classList.toggle("pulse-badge", pendingCount > 0);

  // Last updated indicator
  const luEl = $("#last-updated");
  if (luEl) {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    luEl.textContent = `${hh}:${mm}:${ss}`;
    luEl.title = `Data refreshed at ${now.toLocaleTimeString()}`;
    luEl.classList.remove("stale");
    // Mark stale if no refresh in 60s
    clearTimeout(luEl._staleTimer);
    luEl._staleTimer = setTimeout(() => luEl.classList.add("stale"), 60000);
  }

  // Check for new decisions / approvals → fire desktop notifications
  checkForNewDecisions(decisions);
  checkForNewApprovedIssues(issues);
}

function renderQueueSummary(issues, decisions, runningAgents) {
  const el = $("#queue-summary");
  if (!el) return;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const running = issues.filter(i => runningAgents.some(r => r.issue_id === i.id) || RUNNING_STATES.includes(i.state)).length;
  const blocked = issues.filter(i => i.state === "FAILED").length;
  const watching = issues.filter(i => WATCHING_STATES.includes(i.state)).length;
  const workedToday = state.workedTodayCount ?? issues.filter(i => (parseUTC(i.updated_at || i.created_at)?.getTime() ?? 0) >= todayStart.getTime()).length;
  const metrics = [
    { label: "Needs you", value: decisions.length, filter: "needs", tone: decisions.length ? "attention" : "" },
    { label: "Running", value: running, filter: "running" },
    { label: "Blocked", value: blocked, filter: "failed", tone: blocked ? "danger" : "" },
    { label: "PRs watching", value: watching, filter: "watching" },
    { label: "Worked today", value: workedToday, filter: "all", action: "standup" },
  ];
  const signature = metrics.map(m => `${m.label}:${m.value}:${m.filter}:${m.tone ?? ""}`).join("|");
  if (!shouldRender("queue-summary", signature)) {
    const reviewNext = $("#btn-review-next");
    if (reviewNext) {
      reviewNext.textContent = decisions.length ? `Review next (${decisions.length})` : "Review next";
      reviewNext.classList.toggle("hidden", decisions.length === 0);
    }
    return;
  }

  el.innerHTML = metrics.map(m => `
    <button class="summary-card ${m.tone ?? ""}" type="button" data-filter="${m.filter}" data-action="${m.action ?? "filter"}">
      <span class="summary-value">${m.value}</span>
      <span class="summary-label">${m.label}</span>
    </button>
  `).join("");
  el.querySelectorAll(".summary-card").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.action === "standup") {
        showStandupModal();
        return;
      }
      queueFilters.filter = btn.dataset.filter;
      syncFilterControls();
      renderOverview();
    });
  });

  const reviewNext = $("#btn-review-next");
  if (reviewNext) {
    reviewNext.textContent = decisions.length ? `Review next (${decisions.length})` : "Review next";
    reviewNext.classList.toggle("hidden", decisions.length === 0);
  }
}

function filterLinearIssues(issues) {
  if (!issues) return issues;
  const trackedLinearIds = new Set((state.issues ?? []).map(i => i.linear_id).filter(Boolean));
  const unqueued = issues.filter(i => !trackedLinearIds.has(i.identifier));
  const query = queueFilters.query.toLowerCase();
  const filtered = query
    ? unqueued.filter(i => [i.title, i.identifier, i.state, i.assigneeName].filter(Boolean).join(" ").toLowerCase().includes(query))
    : unqueued;
  return sortIssues(filtered, queueFilters.sort);
}

function decisionPriority(type) {
  return {
    CODE_REVIEW: 0,
    FIX_APPROVAL: 1,
    PLAN_REVIEW: 2,
    AI_CODE_REVIEW: 3,
    AI_PLAN_REVIEW: 4,
  }[type] ?? 9;
}

function filterDecisions(decisions) {
  if (queueFilters.filter && !["all", "needs"].includes(queueFilters.filter)) return [];
  const query = queueFilters.query.toLowerCase();
  const filtered = query
    ? decisions.filter(d => [d.issueTitle, d.issue_id, d.type].filter(Boolean).join(" ").toLowerCase().includes(query))
    : decisions;
  return [...filtered].sort((a, b) => decisionPriority(a.type) - decisionPriority(b.type));
}

function syncFilterControls() {
  $$(".filter-chip").forEach(chip => chip.classList.toggle("active", chip.dataset.filter === queueFilters.filter));
  const search = $("#queue-search");
  if (search && search.value !== queueFilters.query) search.value = queueFilters.query;
  const sort = $("#queue-sort");
  if (sort && sort.value !== queueFilters.sort) sort.value = queueFilters.sort;
}

function linearStateName(state) {
  return typeof state === "string" ? state : state?.name ?? "";
}

function renderLinearIssues(issues) {
  const el = $("#linear-issues");
  if (!issues) {
    setHTMLIfChanged(el, `<div class="empty-state">Click ↻ Linear to load your backlog</div>`);
    return;
  }
  if (!shouldRender("linear-issues", { minute: minuteBucket(), issues: issues.map(i => [i.identifier, i.title, i.priority, linearStateName(i.state), i.createdAt, i.assignedAt]) })) return;
  if (!issues.length) {
    setHTMLIfChanged(el, `<div class="empty-state">No unqueued issues assigned to you</div>`);
    return;
  }
  el.innerHTML = issues.map(i => {
    const createdMeta = i.createdAt ? `<span class="linear-age" title="Created ${parseUTC(i.createdAt)?.toLocaleString() ?? ""}">Created ${timeAgo(i.createdAt)}</span>` : "";
    const assignedMeta = i.assignedAt ? `<span class="linear-age" title="Assigned ${parseUTC(i.assignedAt)?.toLocaleString() ?? ""}">Assigned ${timeAgo(i.assignedAt)}</span>` : "";
    return `
    <div class="issue-card" data-linear-id="${i.identifier}" role="button" tabindex="0" aria-label="Linear issue ${esc(i.identifier)}: ${esc(i.title)}">
      <div class="card-title">${esc(i.title)}</div>
      <div class="card-meta">
        ${linearIssueLink(i.identifier, "card-id tag-source-linear")}
        <span class="priority-blocks">${priorityLabel(i.priority)}</span>
        ${linearStateName(i.state) ? `<span class="linear-state-badge linear-state-${esc(linearStateName(i.state).replace(/ /g,'-'))}">${esc(linearStateName(i.state))}</span>` : ""}
      </div>
      ${(createdMeta || assignedMeta) ? `<div class="card-meta linear-date-meta">${createdMeta}${assignedMeta}</div>` : ""}
      <div class="card-actions">
        <button class="btn btn-primary btn-sm btn-enqueue" data-id="${i.identifier}">Enqueue →</button>
      </div>
    </div>
  `}).join("");

  el.querySelectorAll(".btn-enqueue").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const card = btn.closest(".issue-card");
      const title = card?.querySelector(".card-title")?.textContent ?? id;
      showLinearEnqueueModal(id, title, btn);
    });
  });
}

async function showStandupModal() {
  const origClose = showModal(`
    <h3>Async standup</h3>
    <p style="font-size:13px;color:var(--text-2);line-height:1.5;margin:0 0 12px">Slack-ready summary of Forge activity today.</p>
    <textarea id="standup-text" class="standup-textarea" readonly>Loading…</textarea>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="btn-standup-close">Close</button>
      <button class="btn btn-primary" id="btn-standup-copy">Copy for Slack</button>
    </div>
  `, () => $("#modal")?.classList.remove("modal-wide", "modal-standup"));
  const modal = $("#modal");
  modal.classList.add("modal-wide", "modal-standup");
  const close = () => {
    modal.classList.remove("modal-wide", "modal-standup");
    origClose();
  };

  const textarea = $("#standup-text");
  const copyBtn = $("#btn-standup-copy");
  $("#btn-standup-close").addEventListener("click", close);
  copyBtn.disabled = true;

  try {
    const data = await get("/api/standup/today");
    textarea.value = data.slackText ?? "No activity found today.";
    copyBtn.disabled = false;
  } catch (e) {
    textarea.value = `Could not generate standup update: ${e.message}`;
  }

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(textarea.value);
      copyBtn.textContent = "Copied";
      setTimeout(() => { copyBtn.textContent = "Copy for Slack"; }, 1500);
    } catch {
      textarea.focus();
      textarea.select();
      copyBtn.textContent = "Select + copy";
    }
  });
}

function showLinearEnqueueModal(linearId, title, triggerButton) {
  const close = showModal(`
    <h3>Enqueue ${esc(linearId)}</h3>
    <p style="font-size:13px;color:var(--text-2);line-height:1.5;margin:0 0 12px">${esc(title)}</p>
    <p class="modal-label">Planning guidance (optional)</p>
    <textarea id="enqueue-guidance" placeholder="e.g. Before planning, verify whether this is backend-only. Prefer a minimal fix and include tests around the edge case…" rows="5"></textarea>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="btn-enqueue-cancel">Cancel</button>
      <button class="btn btn-primary" id="btn-enqueue-submit">Enqueue</button>
    </div>
  `);

  $("#btn-enqueue-cancel").addEventListener("click", close);
  $("#btn-enqueue-submit").addEventListener("click", async () => {
    const guidance = $("#enqueue-guidance").value.trim();
    const submit = $("#btn-enqueue-submit");
    submit.disabled = true;
    submit.textContent = "Adding…";
    if (triggerButton) triggerButton.textContent = "Adding…";
    try {
      await post("/api/linear/enqueue", { linearId, planningGuidance: guidance });
      if (Array.isArray(state._linearIssues)) {
        state._linearIssues = state._linearIssues.filter(i => i.identifier !== linearId);
      }
      close();
      await loadOverview();
    } catch (err) {
      submit.disabled = false;
      submit.textContent = "Enqueue";
      if (triggerButton) {
        triggerButton.textContent = `✗ ${err.message}`;
        triggerButton.style.background = "rgba(229,72,77,0.12)";
        setTimeout(() => { triggerButton.textContent = "Enqueue →"; triggerButton.style.background = ""; }, 3000);
      }
    }
  });
}

function renderIssueList(sel, issues, emptyMsg) {
  const el = $(sel);
  const signature = {
    minute: minuteBucket(),
    filters: queueFilters,
    emptyMsg,
    issues: issues.map(i => [i.id, i.title, i.linear_id, i.source, i.state, i.priority, i.updated_at, i.created_at, i.locked_at, i.steering_context, i.primary_pr_number, i.pr_approved_at]),
  };
  if (!shouldRender(`issue-list:${sel}`, signature)) return;
  if (!issues.length) {
    setHTMLIfChanged(el, `<div class="empty-state">${emptyMsg}</div>`);
    return;
  }
  el.innerHTML = issues.map(i => issueCard(i, false)).join("");
  bindIssueCards(el);
}

function renderActiveIssues(issues, runningAgents) {
  const el = $("#active-issues");
  const agentsByIssue = new Map(runningAgents.map(r => [r.issue_id, r]));
  const signature = {
    minute: minuteBucket(),
    filters: queueFilters,
    issues: issues.map(i => [i.id, i.title, i.linear_id, i.source, i.state, i.priority, i.updated_at, i.created_at, i.locked_at, i.steering_context, i.primary_pr_number, i.pr_approved_at, i.focus_rank]),
    agents: runningAgents.map(r => [r.issue_id, r.agent_type, r.started_at]),
  };
  if (!shouldRender("active-issues", signature)) return;
  if (!issues.length) {
    setHTMLIfChanged(el, `<div class="empty-state">No active issues match your filters.</div>`);
    return;
  }

  el.innerHTML = issues.map(i => issueCard(i, true, agentsByIssue.get(i.id))).join("");

  bindIssueCards(el);
  bindActiveDragOrder(el);
}

function bindActiveDragOrder(root) {
  let dragged = null;
  let saveTimer = null;
  const saveOrder = async () => {
    const issueIds = [...root.querySelectorAll(".issue-card[data-draggable-active='true']")].map(el => Number(el.dataset.id));
    if (!issueIds.length) return;
    try {
      await post("/api/active-order", { issueIds });
      // Keep local state aligned so a later overview refresh preserves the order.
      const rankById = new Map(issueIds.map((id, index) => [id, index + 1]));
      state.issues = state.issues.map(issue => rankById.has(issue.id) ? { ...issue, focus_rank: rankById.get(issue.id) } : issue);
    } catch (err) {
      console.warn("Could not save active order", err);
      await loadOverview();
    }
  };

  root.querySelectorAll(".issue-card[data-draggable-active='true']").forEach(card => {
    card.addEventListener("dragstart", (e) => {
      dragged = card;
      activeReorderInProgress = true;
      card.classList.add("is-dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", card.dataset.id);
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("is-dragging");
      root.querySelectorAll(".drag-over").forEach(el => el.classList.remove("drag-over"));
      dragged = null;
      clearTimeout(saveTimer);
      saveTimer = setTimeout(async () => {
        await saveOrder();
        activeReorderInProgress = false;
      }, 0);
    });

    card.addEventListener("dragover", (e) => {
      if (!dragged || dragged === card) return;
      e.preventDefault();
      const rect = card.getBoundingClientRect();
      const after = e.clientY > rect.top + rect.height / 2;
      card.classList.add("drag-over");
      root.insertBefore(dragged, after ? card.nextSibling : card);
    });

    card.addEventListener("dragleave", () => card.classList.remove("drag-over"));

    card.addEventListener("drop", async (e) => {
      e.preventDefault();
      root.querySelectorAll(".drag-over").forEach(el => el.classList.remove("drag-over"));
      clearTimeout(saveTimer);
      saveTimer = setTimeout(async () => {
        await saveOrder();
        activeReorderInProgress = false;
      }, 0);
    });
  });
}

function bindIssueCards(root) {
  root.querySelectorAll(".issue-card").forEach(card => {
    card.addEventListener("click", (e) => {
      const listenBtn = e.target.closest("[data-listen-issue]");
      if (listenBtn) {
        e.stopPropagation();
        openListenPanel(parseInt(listenBtn.dataset.listenIssue), listenBtn.dataset.agent);
        return;
      }
      if (e.target.closest("a")) return;
      openIssue(parseInt(card.dataset.id));
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openIssue(parseInt(card.dataset.id)); }
    });
  });
}

function stuckThresholdMs(agentType) {
  const key = String(agentType ?? "").toLowerCase();
  if (key.includes("planner")) return 8 * 60 * 1000;
  if (key.includes("review")) return 10 * 60 * 1000;
  if (key.includes("git")) return 5 * 60 * 1000;
  return 20 * 60 * 1000;
}

function agentStatusText(agentType) {
  const key = String(agentType ?? "agent").toLowerCase();
  if (key.includes("planner")) return "Planning";
  if (key.includes("review")) return "Reviewing";
  if (key.includes("git")) return "Preparing PR";
  if (key.includes("fix")) return "Fixing";
  if (key.includes("coder")) return "Editing files";
  return esc(agentType ?? "agent");
}

function countAgentRuns(agentRuns, type) {
  return (agentRuns ?? []).filter(r => r.agent_type === type).length;
}

function countRejectedDecisions(decisions, type) {
  return (decisions ?? []).filter(d => d.type === type && d.verdict === "rejected").length;
}

function currentWorkflowNode(issue) {
  const state = issue.state === "FAILED" ? issue.previous_state : issue.state;
  if (["PENDING", "SETTING_UP"].includes(state)) return "setup";
  if (state === "PLANNING") return "plan";
  if (["AI_PLAN_REVIEWING", "AWAITING_PLAN_APPROVAL"].includes(state)) return "planReview";
  if (state === "WORKING") return "code";
  if (["AI_REVIEWING", "AWAITING_CODE_REVIEW"].includes(state)) return "codeReview";
  if (state === "CREATING_PR") return "create";
  if (["WATCHING_PR", "IN_MERGE_QUEUE"].includes(state)) return "watch";
  if (["AWAITING_FIX_APPROVAL", "FIXING", "PUSHING"].includes(state)) return "fixes";
  if (["SPLIT_PLANNING", "AWAITING_SPLIT_APPROVAL", "SPLITTING"].includes(state)) return "split";
  if (state === "DONE") return "done";
  return "setup";
}

function workflowStageIndex(node) {
  return ({ setup: 0, plan: 1, planReview: 1, code: 2, codeReview: 2, create: 3, watch: 4, fixes: 4, split: 4, done: 5 })[node] ?? 0;
}

function buildWorkflowDiagram(data) {
  const { issue, decisions, agentRuns } = data;
  const current = currentWorkflowNode(issue);
  const currentStage = workflowStageIndex(current);
  const planReviews = Math.max(countAgentRuns(agentRuns, "plan-reviewer"), countRejectedDecisions(decisions, "PLAN_REVIEW"));
  const codeReviews = Math.max(countAgentRuns(agentRuns, "reviewer"), countRejectedDecisions(decisions, "CODE_REVIEW"));
  const fixes = Math.max(countAgentRuns(agentRuns, "fixer"), countRejectedDecisions(decisions, "FIX_APPROVAL"));
  const splits = Math.max(countAgentRuns(agentRuns, "split-planner"), countRejectedDecisions(decisions, "SPLIT_APPROVAL"));
  const primaryNodes = ["setup", "plan", "code", "create", "watch", "done"];
  const currentIsLoop = ["planReview", "codeReview", "fixes", "split"].includes(current);
  const doneNodes = primaryNodes.filter(n => workflowStageIndex(n) < currentStage || (currentIsLoop && workflowStageIndex(n) <= currentStage) || issue.state === "DONE");
  const loopDoneNodes = [];
  if (planReviews > 0 && current !== "planReview") loopDoneNodes.push("planReview");
  if (codeReviews > 0 && current !== "codeReview") loopDoneNodes.push("codeReview");
  if (fixes > 0 && current !== "fixes") loopDoneNodes.push("fixes");
  if (splits > 0 && current !== "split") loopDoneNodes.push("split");

  const loopLines = [];
  const badgeCounts = [];
  const addBadgeCount = (node, count) => badgeCounts.push(`${node}=${count}`);
  if (planReviews > 0 || current === "planReview") {
    const count = Math.max(planReviews, current === "planReview" ? 1 : 0);
    addBadgeCount("planReview", count);
    loopLines.push(`  plan -.-> planReview[" Review Plan "]`);
  }
  if (codeReviews > 0 || current === "codeReview") {
    const count = Math.max(codeReviews, current === "codeReview" ? 1 : 0);
    addBadgeCount("codeReview", count);
    loopLines.push(`  code -.-> codeReview[" Review Code "]`);
  }
  if (fixes > 0 || current === "fixes") {
    const count = Math.max(fixes, current === "fixes" ? 1 : 0);
    addBadgeCount("fixes", count);
    loopLines.push(`  watch -.-> fixes[" Fixes "]`);
  }
  if (splits > 0 || current === "split") {
    const count = Math.max(splits, current === "split" ? 1 : 0);
    addBadgeCount("split", count);
    loopLines.push(`  watch -.-> split[" Split PRs "]`);
  }
  if (issue.state === "FAILED") loopLines.push(`  ${current} --> failed[" Failed "]`);

  const classLines = [];
  if (doneNodes.length) classLines.push(`  class ${doneNodes.join(",")} done`);
  if (loopDoneNodes.length) classLines.push(`  class ${loopDoneNodes.join(",")} loopDone`);
  if (issue.state !== "DONE") classLines.push(`  class ${current} current`);
  if (issue.state === "FAILED") classLines.push("  class failed failed");

  return `%%{init: {"theme": "base", "securityLevel": "loose", "flowchart": {"htmlLabels": true, "curve": "stepAfter", "nodeSpacing": 34, "rankSpacing": 44, "padding": 8}, "themeVariables": {"fontFamily": "Inter, sans-serif", "fontSize": "9px", "primaryTextColor": "#e7e7ef", "lineColor": "#6f7280"}} }%%
%% forge-badges:${badgeCounts.join(",")}
flowchart LR
  setup[" Setup "] --> plan[" Plan "] --> code[" Code "] --> create[" Create PR "] --> watch[" Watch PR "] --> done[" Merged "]
${loopLines.join("\n")}
  classDef pending fill:#11131a,stroke:#303442,color:#8a8f98,stroke-width:0.8px
  classDef done fill:#b8f7c5,stroke:#22a044,color:#13772d,stroke-width:1px
  classDef loopDone fill:#b8f7c5,stroke:#22a044,color:#13772d,stroke-width:1px
  classDef current fill:#9fd1fb,stroke:#1677d2,color:#0d58a5,stroke-width:1.2px
  classDef failed fill:#ffd6d9,stroke:#e5484d,color:#9c1d23,stroke-width:1.2px
  class setup,plan,code,create,watch,done pending
${classLines.join("\n")}`;
}

function tuneWorkflowArrowheads(nodes) {
  nodes.forEach(node => {
    const svg = node.querySelector("svg");
    if (!svg) return;
    svg.querySelectorAll("marker").forEach(marker => {
      marker.setAttribute("markerWidth", "4");
      marker.setAttribute("markerHeight", "4");
      marker.setAttribute("refX", "7");
      marker.setAttribute("refY", "5");
      marker.setAttribute("viewBox", "0 0 10 10");
      marker.querySelectorAll("path, polygon").forEach(shape => {
        shape.setAttribute("d", "M 0 0 L 7 5 L 0 10 z");
      });
    });
  });
}

function addWorkflowBadges(nodes) {
  nodes.forEach(node => {
    const spec = (node.dataset.workflowBadges ?? "").trim();
    if (!spec) return;
    const svg = node.querySelector("svg");
    if (!svg) return;
    spec.split(",").filter(Boolean).forEach(entry => {
      const [id, count] = entry.split("=");
      const group = svg.querySelector(`g.node[id*="${id}"]`);
      if (!group || group.querySelector(".wf-svg-badge")) return;
      const box = group.getBBox();
      const badge = document.createElementNS("http://www.w3.org/2000/svg", "g");
      badge.setAttribute("class", "wf-svg-badge");
      badge.setAttribute("transform", `translate(${box.x + box.width - 7}, ${box.y - 5})`);
      badge.innerHTML = `<circle r="7"></circle><text y="3" text-anchor="middle">${esc(count)}</text>`;
      group.appendChild(badge);
    });
  });
}

function renderWorkflowMermaid() {
  const nodes = $$(".forge-workflow-graph .mermaid");
  if (!nodes.length || typeof mermaid === "undefined") return;
  try {
    mermaid.initialize({ startOnLoad: false, theme: "base", securityLevel: "loose" });
    nodes.forEach(node => {
      node.dataset.workflowBadges = (node.textContent.match(/%% forge-badges:([^\n]*)/)?.[1] ?? "").trim();
    });
    Promise.resolve(mermaid.run({ nodes })).then(() => {
      tuneWorkflowArrowheads(nodes);
      addWorkflowBadges(nodes);
    }).catch((e) => {
      nodes.forEach(node => node.setAttribute("data-processed", "true"));
      console.warn("Could not render workflow graph", e);
    });
  } catch (e) {
    nodes.forEach(node => node.setAttribute("data-processed", "true"));
    console.warn("Could not render workflow graph", e);
  }
}

function issueCard(issue, showAgent = false, agent = null) {
  const src = issue.source === "linear"
    ? linearIssueLink(issue.linear_id ?? "LINEAR")
    : `<span class="tag-source-manual">MANUAL</span>`;

  const elapsedMs = agent?.started_at ? Date.now() - (parseUTC(agent.started_at)?.getTime() ?? 0) : 0;
  const elapsedStr = agent?.started_at ? formatElapsed(agent.started_at) : "";
  const isLong = elapsedMs > stuckThresholdMs(agent?.agent_type);

  const agentLine = showAgent && agent
    ? `<div class="card-agent" style="display:flex;align-items:center;gap:6px">
        <span class="agent-spinner"></span>
        <span>${agentStatusText(agent.agent_type)}</span>
        ${elapsedStr ? `<span class="elapsed-badge${isLong ? " long-running" : ""}" title="Running for ${elapsedStr}">${elapsedStr}</span>` : ""}
        ${isLong ? `<span class="stuck-badge">possibly stuck</span>` : ""}
      </div>`
    : issue.state === "FAILED" ? `<div class="card-agent" style="color:var(--red)">❌ Failed — <span style="cursor:pointer;text-decoration:underline" onclick="event.stopPropagation();patch('/api/issues/${issue.id}',{action:'retry'}).then(()=>loadOverview())">↺ retry</span></div>`
    : "";
  const steerPending = issue.steering_context
    ? `<span class="steer-indicator" title="Steering queued: ${esc((issue.steering_context ?? "").slice(0,80))}">&#x26A1;</span>`
    : "";
  const prApprovedAt = parseUTC(issue.pr_approved_at)?.toLocaleString() ?? issue.pr_approved_at;
  const prApproved = issue.pr_approved_at && !["DONE", "PAUSED", "IGNORED", "FAILED"].includes(issue.state)
    ? `<span class="pr-review-badge approved" title="${esc(`GitHub PR approved ${prApprovedAt}`)}">Approved</span>`
    : "";
  const prLink = issue.primary_pr_number
    ? `<a href="${prUrl(issue.primary_pr_number)}" target="_blank" rel="noopener noreferrer" class="card-pr-link" title="Open PR #${issue.primary_pr_number}">PR #${issue.primary_pr_number}</a>`
    : "";
  const focusHandle = showAgent ? `<span class="focus-drag-handle" title="Drag to reorder focus priority" aria-hidden="true">⋮⋮</span>` : "";
  const isRunning = showAgent && !!agent;
  const stateClass = prApproved ? " issue-pr-approved"
    : issue.state === "FAILED" ? " issue-failed"
    : issue.state === "PAUSED" ? " issue-paused"
    : issue.state === "AWAITING_PLAN_APPROVAL" ? " issue-awaiting-plan"
    : issue.state === "AWAITING_CODE_REVIEW" ? " issue-awaiting-code"
    : issue.state === "AWAITING_SPLIT_APPROVAL" ? " issue-awaiting-split"
    : issue.state === "AWAITING_FIX_APPROVAL" ? " issue-awaiting-fix"
    : issue.state?.startsWith("AWAITING") ? " issue-awaiting"
    : WATCHING_STATES.includes(issue.state) ? " issue-watching"
    : isRunning ? " issue-running"
    : "";

  return `
    <div class="issue-card${isRunning ? " is-running" : ""}${stateClass}" data-id="${issue.id}" ${showAgent ? 'data-draggable-active="true" draggable="true"' : ""} role="button" tabindex="0" aria-label="Open ${esc(issue.title)}">
      <div class="card-title-row">
        <div class="card-title">${focusHandle}${esc(issue.title)}</div>
        ${prLink}
      </div>
      <div class="card-meta">
        ${src}
        ${statePill(issue.state)}
        ${steerPending}
        ${prApproved}
        ${issue.locked_at ? '<span class="card-agent">🔄</span>' : ""}
      </div>
      ${agentLine}
      <div class="card-footer">
        <span>Updated ${timeAgo(issue.updated_at || issue.created_at)}</span>
        ${isRunning ? `<button class="card-link" type="button" data-listen-issue="${issue.id}" data-agent="${esc(agent?.agent_type ?? "agent")}">Listen</button>` : ""}
      </div>
    </div>
  `;
}

function decisionPresentation(type) {
  return {
    CODE_REVIEW:    { icon: "⌘", label: "Code ready for review", className: "decision-code", badge: "Code review" },
    FIX_APPROVAL:   { icon: "↺", label: "Fix ready to approve", className: "decision-fix", badge: "Fix approval" },
    PLAN_REVIEW:    { icon: "◇", label: "Plan ready for review", className: "decision-plan", badge: "Plan review" },
    SPLIT_APPROVAL: { icon: "✂", label: "Split plan ready for review", className: "decision-split", badge: "Split approval" },
    AI_CODE_REVIEW: { icon: "✓", label: "AI reviewed code", className: "decision-ai", badge: "AI review" },
    AI_PLAN_REVIEW: { icon: "✓", label: "AI reviewed plan", className: "decision-ai", badge: "AI review" },
  }[type] ?? { icon: "!", label: type.replace(/_/g," "), className: "decision-generic", badge: "Action" };
}

function decisionPreview(decision) {
  if (decision.type === "PLAN_REVIEW") return "Planner has produced a plan. Review scope, risks, and implementation path.";
  if (decision.type === "CODE_REVIEW") return "Review the diff, leave inline comments, then approve or request changes.";
  if (decision.type === "SPLIT_APPROVAL") return "Review the proposed stacked PR split before Forge rewrites branches and replaces PRs.";
  if (decision.type === "FIX_APPROVAL") {
    try {
      const parsed = JSON.parse(decision.artifact_ref || "{}");
      const count = parsed.comments?.length ?? 0;
      if (count) return `${count} PR comment${count === 1 ? "" : "s"} ready for selection.`;
    } catch {}
    return "Review which feedback the fixer should address.";
  }
  return "Action needed before Forge continues.";
}

function renderDecisionQueue(decisions) {
  const el = $("#decision-queue");
  if (!shouldRender("decision-queue", { filters: queueFilters, decisions: decisions.map(d => [d.id, d.issue_id, d.issueTitle, d.type, d.created_at, d.updated_at]) })) return;
  if (!decisions.length) {
    setHTMLIfChanged(el, `<div class="empty-state">Nothing awaiting your review.</div>`);
    return;
  }

  el.innerHTML = decisions.map(d => {
    const presentation = decisionPresentation(d.type);
    const preview = decisionPreview(d);
    return `
    <div class="decision-card ${presentation.className}" data-decision-id="${d.id}" data-issue-id="${d.issue_id}" role="button" tabindex="0" aria-label="Open decision for ${esc(d.issueTitle ?? `Issue #${d.issue_id}`)}">
      <div class="decision-card-top">
        <span class="decision-icon" aria-hidden="true">${presentation.icon}</span>
        <div class="decision-heading">
          <div class="decision-type">${presentation.label}</div>
          <div class="decision-issue">${esc(d.issueTitle ?? `Issue #${d.issue_id}`)}</div>
        </div>
        <span class="decision-kind-badge">${presentation.badge}</span>
      </div>
      ${preview ? `<div class="decision-preview">${preview}</div>` : ""}
      <div class="decision-actions">
        ${d.type === "CODE_REVIEW"
          ? `<button class="btn btn-primary btn-sm" data-action="review-code" data-id="${d.id}" data-issue="${d.issue_id}">Open diff</button>`
          : `<button class="btn btn-primary btn-sm" data-action="view" data-id="${d.id}" data-issue="${d.issue_id}">Review</button>`
        }
        <button class="btn btn-success btn-sm" data-action="approve" data-id="${d.id}" data-issue="${d.issue_id}">Approve</button>
        <button class="btn btn-ghost btn-sm" data-action="reject" data-id="${d.id}" data-issue="${d.issue_id}">Request changes</button>
      </div>
    </div>`;
  }).join("");

  el.querySelectorAll(".decision-card").forEach(card => {
    const open = () => openIssue(parseInt(card.dataset.issueId));
    card.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      open();
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });

  el.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const { action, id, issue } = btn.dataset;

      if (action === "view") {
        openIssue(parseInt(issue));
        return;
      }
      if (action === "review-code") {
        openReview(parseInt(issue));
        return;
      }

      if (action === "approve") {
        const decInfo = state.decisions?.find(d => String(d.id) === String(id));
        if (decInfo?.type === "PLAN_REVIEW") {
          showPlanApprovalModal(id, async (steeringComment) => {
            const feedback = steeringComment ? { steeringComment } : undefined;
            try {
              await post(`/api/decisions/${id}/resolve`, { verdict: "approved", feedback });
            } catch (err) {
              if (!err.message?.includes("409") && !err.message?.toLowerCase().includes("already resolved")) throw err;
            }
            await loadOverview();
          });
          return;
        }
        showConfirmModal(
          "Approve decision",
          `Approve <strong>${esc(decInfo?.issueTitle ?? "this decision")}</strong>? Forge will continue to the next step.`,
          "Approve",
          "btn-success",
          async () => {
            try {
              await post(`/api/decisions/${id}/resolve`, { verdict: "approved" });
            } catch (err) {
              if (!err.message?.includes("409") && !err.message?.toLowerCase().includes("already resolved")) throw err;
            }
            await loadOverview();
          }
        );
        return;
      }

      if (action === "reject") {
        showRejectModal(parseInt(id));
      }
    });
  });
}

// ── Issue detail ──────────────────────────────────────────────────────

async function openIssue(id, { pushState = true } = {}) {
  showIssueView(id, { pushState });
  const seq = ++issueRenderSeq;
  const detail = $("#issue-detail");
  const isSameRenderedIssue = renderedIssueId === id && detail?.children.length;
  if (!isSameRenderedIssue) {
    detail.innerHTML = `<div style="padding:40px 32px;color:var(--text-4);font-size:13px">Loading…</div>`;
  }
  try {
    const data = await get(`/api/issues/${id}`);
    if (seq !== issueRenderSeq || activeIssueId !== id) return;
    renderIssueDetail(data);
  } finally {
    detail?.classList.remove("is-refreshing");
  }
}

function prReviewBadge(pr) {
  const decision = pr.reviewDecision;
  if (decision === "APPROVED") return `<span class="pr-review-badge approved" title="GitHub review decision: approved">Approved</span>`;
  if (decision === "CHANGES_REQUESTED") return `<span class="pr-review-badge changes" title="GitHub review decision: changes requested">Changes requested</span>`;
  if (decision === "REVIEW_REQUIRED") return `<span class="pr-review-badge pending" title="GitHub review decision: review required">Review required</span>`;
  if (decision) return `<span class="pr-review-badge pending" title="GitHub review decision: ${esc(decision)}">${esc(decision.toLowerCase().replace(/_/g, " "))}</span>`;
  return "";
}

function prChecksBadge(pr) {
  if (pr.checksFailed > 0) return `<span class="pr-checks-badge failed" title="${pr.checksFailed} failing check(s)">${pr.checksFailed} failing</span>`;
  if (pr.checksPending > 0) return `<span class="pr-checks-badge pending" title="${pr.checksPending} pending check(s)">${pr.checksPending} pending</span>`;
  if (pr.checksTotal > 0) return `<span class="pr-checks-badge passed" title="All ${pr.checksTotal} check(s) passed">Checks passed</span>`;
  return "";
}

function renderIssueDetail(data) {
  const { issue, prStack, decisions, agentRuns, activityLog, planContent, handoffContent, summaryContent, failureContext, vmConnectCommand, learningEvents = [], learningSuggestions = [], learningChangeLog = [] } = data;
  const nextSignature = JSON.stringify(data);
  if (renderedIssueId === issue.id && issueDetailSignature === nextSignature) return;
  // Preserve which <details> panels are currently open so they survive the DOM replacement.
  const openDetailKeys = new Set();
  $$("#issue-detail details").forEach(d => {
    if (d.open) {
      const key = d.querySelector("summary")?.textContent?.trim() ?? "";
      if (key) openDetailKeys.add(key);
    }
  });

  renderedIssueId = issue.id;
  issueDetailSignature = nextSignature;
  closeActiveTerminal();

  // Simplified 6-stage timeline — each stage groups related states
  const STAGE_MAP = {
    PENDING: 0, SETTING_UP: 0,
    PLANNING: 1, AI_PLAN_REVIEWING: 1, AWAITING_PLAN_APPROVAL: 1,
    WORKING: 2, AI_REVIEWING: 2, AWAITING_CODE_REVIEW: 2, STEERING: 2,
    CREATING_PR: 3,
    WATCHING_PR: 4, IN_MERGE_QUEUE: 4, SPLIT_PLANNING: 4, AWAITING_SPLIT_APPROVAL: 4, SPLITTING: 4, AWAITING_FIX_APPROVAL: 4, FIXING: 4, PUSHING: 4,
    DONE: 5,
  };
  const STAGE_LABELS = ["Setup", "Plan", "Code", "Create PR", "Watch PR", "Done"];
  // For terminal/suspended states, use previous_state to show where the issue actually is
  const effectiveState = ["FAILED","PAUSED","IGNORED"].includes(issue.state)
    ? (issue.previous_state ?? issue.state)
    : issue.state;
  const curStage = STAGE_MAP[effectiveState] ?? STAGE_MAP[issue.state] ?? 0;
  const isAwaiting = issue.state.startsWith("AWAITING");

  const timeline = STAGE_LABELS.map((label, i) => {
    const cls = i < curStage ? "done" : i === curStage ? (isAwaiting ? "awaiting" : "active") : "";
    return `
      <div class="phase-step">
        <div class="phase-step-inner">
          <div class="phase-dot ${cls}"></div>
          <div class="phase-label">${label}</div>
        </div>
        ${i < STAGE_LABELS.length - 1 ? '<div class="phase-line"></div>' : ''}
      </div>
    `;
  }).join("");
  // Sub-label shows the real state
  const stateSubLabel = STATE_LABELS[issue.state] ?? issue.state.toLowerCase().replace(/_/g,' ');

  const workflowDiagram = buildWorkflowDiagram(data);

  const prList = prStack.length > 0
    ? `<div class="pr-stack-list">${prStack.map((pr, i) => `
        <div class="pr-item">
          <span class="pr-pos">${i + 1}</span>
          <span class="pr-branch" title="${esc(pr.gt_branch ?? pr.branch ?? "")}">${esc(pr.gt_branch ?? pr.branch ?? "unknown branch")}</span>
          <span class="pr-status-dot pr-status-${pr.status}" title="${esc(pr.status ?? "unknown")}"></span>
          <span class="pr-state-label">${esc(pr.status ?? "unknown")}</span>
          ${prReviewBadge(pr)}
          ${prChecksBadge(pr)}
          ${pr.pr_number ? `<a href="${prUrl(pr.pr_number)}" target="_blank" class="pr-num">Open PR #${pr.pr_number}</a>` : '<span class="pr-num">No PR yet</span>'}
        </div>
      `).join("")}</div>`
    : ["WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL"].includes(issue.state)
      ? `<div class="empty-state" style="text-align:left;padding:12px 0">
          No PRs tracked yet.<br>
          <button class="btn btn-ghost btn-sm" id="btn-sync-prs-prompt" style="margin-top:8px">↻ Sync from GitHub</button>
         </div>`
      : `<div class="empty-state">No PRs yet.</div>`;

  // Unified activity log: merge activity_log entries with agent run log links
  const runLogMap = Object.fromEntries((agentRuns ?? []).map(r => [r.id, r]));

  const activityItems = [...(activityLog ?? [])].reverse().map(entry => {
    const icons = {
      agent_started:     "🤖", agent_completed: "✅", agent_failed: "❌", agent_error: "🚨",
      decision_approved: "✓",  decision_rejected: "✗",
      steered:           "🎯", steer_resolved: "↩",
      split_requested:   "✂️",
      decision_added:    "💬",
      paused:            "⏸",  resumed: "▶",
      ignored:           "🚫", unignored: "▶",
      retried:           "↺",
      state_changed:     "→", pr_approved: "✅", pr_approval_cleared: "↩",
      ai_review_approved: "✅", ai_review_rejected: "🔄", ai_review_escalated: "☝",
    };
    const icon  = icons[entry.type] ?? "·";
    const actor = entry.actor === "user" ? "<span class=\"log-actor-user\">you</span>"
                : `<span class=\"log-actor-agent\">${entry.actor}</span>`;

    // For agent_started entries, find matching run for the log link
    let logLink = "";
    if (entry.type === "agent_started" || entry.type === "agent_completed" || entry.type === "agent_failed") {
      const matchingRun = (agentRuns ?? []).find(r =>
        r.agent_type === entry.actor &&
        Math.abs(new Date(r.started_at) - new Date(entry.created_at)) < 5000
      );
      if (matchingRun?.log_path) {
        logLink = `<span class="run-log-link" data-run-id="${matchingRun.id}">log</span>`;
      }
    }

    return `
      <div class="activity-entry activity-${entry.type}">
        <span class="activity-icon">${icon}</span>
        <span class="activity-time">${timeAgo(entry.created_at)}</span>
        <span class="activity-actor">${actor}</span>
        <span class="activity-message">${esc(entry.message)}</span>
        ${logLink}
      </div>
    `;
  }).join("");

  const runList = activityItems
    ? `<div class="activity-log">${activityItems}</div>`
    : `<div class="empty-state">No activity yet.</div>`;

  const stateDecisionType = {
    AWAITING_PLAN_APPROVAL: "PLAN_REVIEW",
    AWAITING_CODE_REVIEW: "CODE_REVIEW",
    AWAITING_FIX_APPROVAL: "FIX_APPROVAL",
    AWAITING_SPLIT_APPROVAL: "SPLIT_APPROVAL",
  }[issue.state];
  const pendingDecision = stateDecisionType
    ? decisions.find(d => !d.verdict && d.type === stateDecisionType)
    : null;
  const stalePendingDecisions = decisions.filter(d => !d.verdict && d !== pendingDecision);

  // Action buttons, grouped by intent
  const primaryActions = [];
  const secondaryActions = [];
  const dangerActions = [];
  const isActiveAgent = !["DONE","FAILED","PAUSED","IGNORED","STEERING","AWAITING_PLAN_APPROVAL","AWAITING_CODE_REVIEW","AWAITING_FIX_APPROVAL","AWAITING_SPLIT_APPROVAL","PENDING"].includes(issue.state);
  const activeRun = agentRuns?.find(r => !r.exited_at);

  if (["DONE","FAILED","PAUSED","IGNORED"].includes(issue.state)) {
    dangerActions.push(`<button class="btn btn-ghost" id="btn-remove">Remove</button>`);
  }

  // Full reset — available for any non-done, non-ignored issue
  if (!["DONE","IGNORED"].includes(issue.state)) {
    dangerActions.push(`<button class="btn btn-danger" id="btn-full-reset">Full reset</button>`);
  }

  if (issue.state === "FAILED") {
    primaryActions.push(`<button class="btn btn-primary" id="btn-retry">Retry</button>`);
  } else if (issue.state === "PAUSED") {
    primaryActions.push(`<button class="btn btn-primary" id="btn-unpause">Resume</button>`);
    dangerActions.push(`<button class="btn btn-ghost" id="btn-ignore">Ignore</button>`);
  } else if (issue.state === "IGNORED") {
    primaryActions.push(`<button class="btn btn-primary" id="btn-unignore">Resume</button>`);
  } else if (issue.state !== "DONE") {
    if (isActiveAgent) primaryActions.push(`<button class="btn btn-primary" id="btn-listen">Listen${activeRun ? ` — ${activeRun.agent_type}` : ""}</button>`);
    secondaryActions.push(`<button class="btn btn-ghost" id="btn-pause">Pause</button>`);
    dangerActions.push(`<button class="btn btn-ghost" id="btn-ignore">Ignore</button>`);
    secondaryActions.push(`<button class="btn btn-ghost" id="btn-steer">Steer</button>`);
  }

  const isAwaitingState = issue.state.startsWith("AWAITING_");
  const isStuck = isAwaitingState && !pendingDecision;

  if (isStuck) {
    const ADVANCE_LABELS = {
      AWAITING_PLAN_APPROVAL: "Advance to Coding",
      AWAITING_CODE_REVIEW:   "Advance to Create PR",
      AWAITING_FIX_APPROVAL:  "Advance to Fixing",
      AWAITING_SPLIT_APPROVAL:"Advance to Split",
    };
    secondaryActions.push(`<button class="btn btn-ghost" id="btn-advance" style="color:var(--yellow);border-color:rgba(245,166,35,0.2)">${ADVANCE_LABELS[issue.state] ?? "Advance"}</button>`);
  }

  // Jump to — always available for non-terminal, non-done issues
  if (!["DONE","PENDING","SETTING_UP"].includes(issue.state)) {
    secondaryActions.push(`<button class="btn btn-ghost" id="btn-jump-to">Move to phase…</button>`);
  }

  // View Diff available whenever there's a worktree — not gated on pending decision
  if (issue.wt_path && !["PENDING","SETTING_UP","PLANNING","AI_PLAN_REVIEWING","AWAITING_PLAN_APPROVAL","DONE"].includes(issue.state)) {
    secondaryActions.push(`<button class="btn btn-ghost" id="btn-view-diff">View diff</button>`);
    secondaryActions.push(`<button class="btn btn-ghost" id="btn-vm-launch">Launch runtime</button>`);
  }

  // Manual feedback — available when watching a PR
  if (["WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL"].includes(issue.state)) {
    secondaryActions.push(`<button class="btn btn-ghost" id="btn-add-feedback">Add feedback</button>`);
  }

  if (issue.state === "WATCHING_PR") {
    secondaryActions.push(`<button class="btn btn-ghost" id="btn-split-pr-stack">Split PR Stack</button>`);
  }

  if (pendingDecision) {
    // FIX_APPROVAL with comment JSON gets its own inline UI (rendered in the panel below)
    const isFix = pendingDecision.type === "FIX_APPROVAL" && (() => {
      try { const a = JSON.parse(pendingDecision.artifact_ref); return Array.isArray(a.comments); } catch { return false; }
    })();
    if (!isFix) {
      primaryActions.push(`<button class="btn btn-success" id="btn-approve-decision" data-id="${pendingDecision.id}">Approve</button>`);
      primaryActions.push(`<button class="btn btn-danger" id="btn-reject-decision" data-id="${pendingDecision.id}">Request changes</button>`);
    }
  }

  const renderMd = (md) => typeof marked !== "undefined"
    ? marked.parse(md)
    : `<pre>${esc(md)}</pre>`;

  const planNeedsReview = ["PLANNING", "AWAITING_PLAN_APPROVAL", "SPLIT_PLANNING", "AWAITING_SPLIT_APPROVAL"].includes(issue.state);
  const planSection = planContent
    ? `<details ${planNeedsReview ? "open" : ""}>
        <summary class="plan-summary">
          ${planNeedsReview ? "Plan" : "Plan (approved)"}
          <span class="plan-toggle-hint">${planNeedsReview ? "" : "click to expand"}</span>
        </summary>
        <div class="markdown-viewer rendered" style="margin-top:12px">${renderMd(planContent)}</div>
      </details>`
    : `<div class="empty-state">No plan file yet.</div>`;

  const handoffSection = handoffContent
    ? `<details>
        <summary class="plan-summary">
          Handoff
          <span class="plan-toggle-hint">shared agent memory</span>
        </summary>
        <div class="markdown-viewer rendered" style="margin-top:12px">${renderMd(handoffContent)}</div>
      </details>`
    : null;

  const summarySection = summaryContent
    ? `<div class="markdown-viewer rendered">${renderMd(summaryContent)}</div>`
    : null;

  const learningSection = (learningEvents.length || learningSuggestions.length || learningChangeLog.length)
    ? `<div class="detail-section learning-section">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border-subtle)">
          <h3 style="margin:0;padding:0;border:none">Continuous Learning</h3>
          <button class="btn btn-ghost btn-sm" id="btn-run-reflection">Reflect now</button>
        </div>
        ${learningSuggestions.length ? `<div class="learning-list">${learningSuggestions.map(s => `
          <div class="learning-card learning-${esc(s.status)}">
            <div class="learning-card-head"><span>${esc(s.target)}</span><span>${esc(s.confidence)} · ${esc(s.status)}</span></div>
            <div class="learning-suggestion">${esc(s.suggestion)}</div>
            ${s.rationale ? `<div class="learning-rationale">${esc(s.rationale)}</div>` : ""}
          </div>`).join("")}</div>` : `<div class="empty-state" style="text-align:left;padding:8px 0">No suggestions queued.</div>`}
        ${learningChangeLog.length ? `<details style="margin-top:12px" open><summary class="plan-summary">Change log <span class="plan-toggle-hint">what changed and why</span></summary>
          <div class="learning-changes">${learningChangeLog.map(c => `<div class="learning-change"><div><span>${timeAgo(c.created_at)}</span><strong>${esc(c.target)}</strong><em>${esc(c.change_type)}</em></div><div>${esc(c.change_summary)}</div>${c.reason ? `<p>${esc(c.reason)}</p>` : ""}</div>`).join("")}</div>
        </details>` : ""}
        ${learningEvents.length ? `<details style="margin-top:12px"><summary class="plan-summary">Reflection history <span class="plan-toggle-hint">${learningEvents.length} event(s)</span></summary>
          <div class="learning-events">${learningEvents.map(e => `<div class="learning-event"><span>${timeAgo(e.created_at)}</span><span>${esc(e.trigger ?? e.source)}</span><span>${esc(e.summary)}</span></div>`).join("")}</div>
        </details>` : ""}
      </div>`
    : `<div class="detail-section learning-section">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div><h3 style="margin:0 0 4px 0;padding:0;border:none">Continuous Learning</h3><div class="empty-state" style="text-align:left;padding:0">No reflections yet.</div></div>
          <button class="btn btn-ghost btn-sm" id="btn-run-reflection">Reflect now</button>
        </div>
      </div>`;

  const autoFixSection = ["WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "PUSHING"].includes(issue.state)
    ? `<div class="detail-section auto-fix-section">
        <div class="auto-fix-row">
          <div>
            <h3>Auto-fix</h3>
            <p>When new PR comments, CI failures, or merge conflicts are detected, automatically send them to the fixer agent instead of waiting for approval.</p>
          </div>
          <label class="switch" title="Toggle auto-fix for this issue">
            <input type="checkbox" id="auto-fix-toggle" ${Number(issue.auto_fix_enabled) === 1 ? "checked" : ""} />
            <span class="switch-slider"></span>
          </label>
        </div>
      </div>`
    : "";

  const terminalSection = issue.wt_path
    ? `<div class="terminal-dock ${terminalPanelOpen ? "expanded" : "collapsed"}">
        <button class="terminal-dock-bar" id="btn-terminal-toggle" type="button" aria-expanded="${terminalPanelOpen ? "true" : "false"}">
          <span>▣ Terminal</span>
          <span class="terminal-path">${esc(issue.wt_path)}</span>
          <span id="issue-terminal-status" class="terminal-status">${activeTerminal?.issueId === issue.id ? "connected" : "idle"}</span>
          <span class="terminal-chevron">${terminalPanelOpen ? "⌄" : "⌃"}</span>
        </button>
        <div class="terminal-dock-panel">
          <div id="issue-terminal" class="issue-terminal" data-issue-id="${issue.id}"></div>
          <button class="btn btn-ghost btn-sm terminal-reconnect" id="btn-terminal-connect">Reconnect</button>
        </div>
      </div>`
    : "";

  // Build per-comment approval UI for FIX_APPROVAL decisions
  let fixApprovalSection = null;
  if (pendingDecision?.type === "FIX_APPROVAL") {
    let comments = [];
    try { comments = JSON.parse(pendingDecision.artifact_ref).comments ?? []; } catch {}
    if (comments.length > 0) {
      const commentCards = comments.map((c, i) => {
        const loc = c.path ? `<span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--text-3)">${esc(c.path)}${c.line ? `:${c.line}` : ""}</span>` : "";
        const badge = c.reviewState === "CHANGES_REQUESTED"
          ? `<span style="background:#ff4d4f22;color:#ff4d4f;border:1px solid #ff4d4f44;border-radius:4px;padding:1px 6px;font-size:10px;font-weight:600">CHANGES REQUESTED</span>`
          : c.reviewState === "MERGE_CONFLICT"
          ? `<span style="background:#fa8c1622;color:#fa8c16;border:1px solid #fa8c1644;border-radius:4px;padding:1px 6px;font-size:10px;font-weight:600">⚠ MERGE CONFLICT</span>`
          : c.reviewState === "CI_FAILURE"
          ? `<span style="background:#ff4d4f22;color:#ff4d4f;border:1px solid #ff4d4f44;border-radius:4px;padding:1px 6px;font-size:10px;font-weight:600">CI FAILURE</span>`
          : `<span style="background:#1677ff22;color:#1677ff;border:1px solid #1677ff44;border-radius:4px;padding:1px 6px;font-size:10px;font-weight:600">COMMENTED</span>`;
        const matchedPr = c.prNumber ? prStack.find(p => p.pr_number === c.prNumber) : null;
        const prBadge = matchedPr
          ? `<a href="${prUrl(matchedPr.pr_number)}" target="_blank" style="background:var(--bg-4);color:var(--accent-vivid);border:1px solid var(--border-subtle);border-radius:4px;padding:1px 7px;font-size:10px;font-weight:600;font-family:'JetBrains Mono',monospace;text-decoration:none" title="${esc(matchedPr.gt_branch)}">PR #${matchedPr.pr_number} <span style="font-weight:400;opacity:0.7">(${matchedPr.position}/${prStack.length})</span></a>`
          : c.prNumber ? `<span style="background:var(--bg-4);color:var(--text-3);border:1px solid var(--border-subtle);border-radius:4px;padding:1px 7px;font-size:10px;font-family:'JetBrains Mono',monospace">#${c.prNumber}</span>` : "";
        return `
          <div class="fix-comment-card" data-comment-id="${esc(c.id)}" style="background:var(--bg-3);border:1px solid var(--border-subtle);border-radius:8px;padding:14px 16px;margin-bottom:10px">
            <div style="display:flex;align-items:flex-start;gap:10px">
              <input type="checkbox" class="fix-comment-cb" data-comment-id="${esc(c.id)}" checked
                style="margin-top:3px;width:16px;height:16px;flex-shrink:0;cursor:pointer" />
              <div style="flex:1;min-width:0">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px">
                  ${badge}
                  ${prBadge}
                  <span style="font-weight:600;font-size:12px">${esc(c.author)}</span>
                  ${c.createdAt ? `<span style="font-size:10px;color:var(--text-4)">${timeAgo(c.createdAt)}</span>` : ""}
                  ${loc}
                </div>
                <div style="font-size:13px;line-height:1.6;color:var(--text-1);white-space:pre-wrap;word-break:break-word">${esc(c.body)}</div>
              </div>
            </div>
          </div>`;
      }).join("");

      fixApprovalSection = `
        <div class="detail-section" id="fix-approval-section">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--border-subtle)">
            <h3 style="margin:0;padding:0;border:none">💬 Review Comments</h3>
            <div style="display:flex;gap:8px">
              <button class="btn btn-ghost btn-sm" id="btn-fix-select-all">Select all</button>
              <button class="btn btn-ghost btn-sm" id="btn-fix-select-none">Select none</button>
            </div>
          </div>
          <p style="font-size:13px;color:var(--text-3);margin-bottom:14px">Select the comments you want the agent to address, then click <strong>Fix selected</strong>. Unselected comments will not be re-surfaced.</p>
          ${commentCards}
          <div style="display:flex;gap:10px;margin-top:16px">
            <button class="btn btn-success" id="btn-fix-selected" data-decision-id="${pendingDecision.id}">✓ Fix selected (<span id="fix-selected-count">${comments.length}</span>)</button>
            <button class="btn btn-danger" id="btn-fix-skip-all" data-decision-id="${pendingDecision.id}">✕ Skip all</button>
          </div>
        </div>`;
    }
  }

  const staleDecisionSection = stalePendingDecisions.length ? `
    <div class="detail-section" style="border-color:rgba(245,166,35,0.35);background:rgba(245,166,35,0.06)">
      <h3>Pending action changed</h3>
      <p style="font-size:13px;color:var(--text-2);line-height:1.6;margin:0">
        There ${stalePendingDecisions.length === 1 ? "is" : "are"} ${stalePendingDecisions.length} older pending decision${stalePendingDecisions.length === 1 ? "" : "s"}, but this issue is currently <strong>${esc(issue.state)}</strong>.
        Refresh or wait for the current agent phase to finish before approving more fixes.
      </p>
    </div>` : "";

  $("#issue-detail").innerHTML = `
    <div class="detail-header">
      <div class="detail-header-top">
        <div class="card-meta detail-meta">
          ${linearIssueLink(issue.linear_id)}
          ${statePill(issue.state)}
        </div>
        <div class="detail-actions">
          ${primaryActions.length ? `<div class="action-group primary-actions">${primaryActions.join("")}</div>` : ""}
          ${secondaryActions.length ? `<div class="action-group secondary-actions">${secondaryActions.join("")}</div>` : ""}
        </div>
      </div>
      <div class="detail-title">${esc(issue.title)}</div>
    </div>

    <div class="detail-section">
      <h3>Progress</h3>
      <div class="phase-timeline">${timeline}</div>
      <div style="font-size:11px;color:var(--text-4);margin-top:6px;font-family:'JetBrains Mono',monospace">${stateSubLabel}</div>
    </div>

    ${staleDecisionSection}

    <div class="detail-section forge-workflow-graph">
      <div class="workflow-header">
        <h3>Workflow Map</h3>
        <span class="workflow-current">Current: ${esc(stateSubLabel)}</span>
      </div>
      <div class="workflow-mermaid-wrap">
        <pre class="mermaid">${workflowDiagram}</pre>
      </div>
    </div>

    <div class="detail-section">
      <h3>Info</h3>
      <div class="info-grid">
        <span class="info-label">Source</span><span class="info-value">${issue.source}</span>
        <span class="info-label">Priority</span><span class="info-value">${priorityLabel(issue.priority)}</span>
        <span class="info-label">Worktree</span>
        <span class="info-value path-row">
          <span class="path-value" title="${esc(issue.wt_path ?? '')}">${esc(issue.wt_path ?? '—')}</span>
          ${issue.wt_path ? `<button class="copy-cd-btn" data-path="${esc(issue.wt_path)}" title="Copy cd command">Copy cd</button>` : ""}
        </span>
        ${vmConnectCommand ? `
        <span class="info-label">Runtime shell</span>
        <span class="info-value path-row">
          <span class="path-value" title="${esc(vmConnectCommand)}">${esc(vmConnectCommand)}</span>
          <button class="copy-text-btn" data-copy="${esc(vmConnectCommand)}" title="Copy runtime connect command">Copy</button>
        </span>` : ""}
        <span class="info-label">Branch</span>
        <span class="info-value path-row"><span class="path-value" title="${esc(issue.wt_path ? issue.wt_path.split('/').pop() : '')}">${esc(issue.wt_path ? issue.wt_path.split('/').pop().replace(/^wt\.[^.]+\./, '').replace(/^wt-[^.]+\./, '') : '—')}</span></span>
        <span class="info-label">Added</span><span class="info-value">${timeAgo(issue.created_at)}</span>
        ${issue.project_file_path ? `
        <span class="info-label">Plan</span>
        <span class="info-value" style="display:flex;align-items:center;gap:8px">
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;max-width:360px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:inline-block;vertical-align:bottom" title="${esc(issue.project_file_path)}">${esc(issue.project_file_path)}</span>
          <button class="copy-cd-btn" data-path="${esc(issue.project_file_path.replace(/\/[^\/]+$/, ''))}" title="Copy cd command">Copy cd</button>
        </span>` : ''}
      </div>
    </div>

    <div class="detail-section">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border-subtle)">
        <h3 style="margin:0;padding:0;border:none">PR Stack</h3>
        ${issue.wt_path ? `<button class="btn-sm" id="btn-sync-prs">↻ Sync from GitHub</button>` : ""}
      </div>
      ${prList}
    </div>

    ${fixApprovalSection ?? ""}

    ${autoFixSection}

    ${failureContext ? `
    <div class="detail-section">
      <div class="failure-box">
        <div class="failure-box-title">❌ Agent failed</div>
        <div class="failure-box-meta">${esc(failureContext.run?.agent_type ?? "unknown")} — exit code ${failureContext.run?.exit_code ?? "?"} — ${timeAgo(failureContext.run?.started_at)}</div>
        ${failureContext.logTail ? `<div class="failure-log">${esc(failureContext.logTail)}</div>` : "<div class='failure-box-meta'>No log available</div>"}
      </div>
    </div>` : ""}

    <div class="detail-section">
      ${planSection}
    </div>

    ${handoffSection ? `<div class="detail-section">${handoffSection}</div>` : ""}

    ${summarySection ? `<div class="detail-section"><h3>Executive Summary</h3>${summarySection}</div>` : ""}

    ${learningSection}

    <div class="detail-section">
      <h3>Activity</h3>
      ${runList}
    </div>

    ${dangerActions.length ? `
    <div class="detail-section danger-zone">
      <h3>Danger zone</h3>
      <p class="danger-zone-copy">Destructive or terminal actions. Forge will ask for confirmation before continuing.</p>
      <div class="detail-actions danger-actions">${dangerActions.join("")}</div>
    </div>` : ""}

    ${terminalSection}
  `;

  // Restore previously-open <details> panels (preserves user-expanded plan, handoff, etc.)
  if (openDetailKeys.size) {
    $$("#issue-detail details").forEach(d => {
      const key = d.querySelector("summary")?.textContent?.trim() ?? "";
      if (key && openDetailKeys.has(key)) d.open = true;
    });
  }

  setTimeout(renderWorkflowMermaid, 0);

  $("#auto-fix-toggle")?.addEventListener("change", async (e) => {
    const enabled = e.currentTarget.checked;
    e.currentTarget.disabled = true;
    try {
      await patch(`/api/issues/${issue.id}`, { action: "set-auto-fix", enabled });
      await loadOverview();
      await openIssue(issue.id);
    } catch (err) {
      alert(`Could not update auto-fix: ${err.message}`);
      e.currentTarget.checked = !enabled;
      e.currentTarget.disabled = false;
    }
  });

  $("#btn-run-reflection")?.addEventListener("click", async () => {
    const btn = $("#btn-run-reflection");
    if (btn) { btn.disabled = true; btn.textContent = "Reflecting…"; }
    try {
      await post(`/api/issues/${issue.id}/reflect`, { trigger: "manual" });
      await openIssue(issue.id);
    } catch (e) {
      alert(`Reflection failed: ${e.message}`);
      if (btn) { btn.disabled = false; btn.textContent = "Reflect now"; }
    }
  });

  if (issue.wt_path) {
    const toggleTerminal = () => {
      terminalPanelOpen = !terminalPanelOpen;
      const dock = $(".terminal-dock");
      const toggle = $("#btn-terminal-toggle");
      if (dock) dock.className = `terminal-dock ${terminalPanelOpen ? "expanded" : "collapsed"}`;
      if (toggle) toggle.setAttribute("aria-expanded", terminalPanelOpen ? "true" : "false");
      const chevron = $(".terminal-chevron");
      if (chevron) chevron.textContent = terminalPanelOpen ? "⌄" : "⌃";
      if (terminalPanelOpen) setTimeout(() => initIssueTerminal(issue.id), 0);
    };
    $("#btn-terminal-toggle")?.addEventListener("click", toggleTerminal);
    $("#btn-terminal-connect")?.addEventListener("click", (e) => {
      e.stopPropagation();
      terminalPanelOpen = true;
      $(".terminal-dock")?.classList.remove("collapsed");
      $(".terminal-dock")?.classList.add("expanded");
      initIssueTerminal(issue.id);
    });
    if (terminalPanelOpen) setTimeout(() => initIssueTerminal(issue.id), 0);
  }

  // Wire up buttons
  $$("#issue-detail .copy-cd-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(`cd ${btn.dataset.path}`);
      const orig = btn.textContent;
      btn.textContent = "✓ copied";
      setTimeout(() => btn.textContent = orig, 1500);
    });
  });
  $$("#issue-detail .copy-text-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(btn.dataset.copy || "");
      const orig = btn.textContent;
      btn.textContent = "✓ copied";
      setTimeout(() => btn.textContent = orig, 1500);
    });
  });

  $("#btn-remove")?.addEventListener("click", async () => {
    showConfirmModal(
      "Remove from Forge",
      `Remove <strong>${esc(issue.title)}</strong>?<br><br>Deletes the worktree and all Forge data. The Linear issue will not be affected.`,
      "✕ Remove",
      "btn-danger",
      async () => {
        await fetch(`/api/issues/${issue.id}`, { method: "DELETE" });
        await loadOverview();
        history.back();
      }
    );
  });

  const doSyncPrs = async (btn) => {
    btn.textContent = "Syncing…";
    btn.disabled = true;
    try {
      const result = await post(`/api/issues/${issue.id}/sync-prs`, {});
      btn.textContent = `✓ ${result.synced?.length ?? 0} PR(s) synced`;
      setTimeout(() => openIssue(issue.id), 800);
    } catch (err) {
      btn.textContent = `❌ ${err.message}`;
      btn.disabled = false;
    }
  };
  $("#btn-sync-prs-prompt")?.addEventListener("click", (e) => doSyncPrs(e.currentTarget));
  $("#btn-sync-prs")?.addEventListener("click", (e) => doSyncPrs(e.currentTarget));

  $("#btn-advance")?.addEventListener("click", async () => {
    const NEXT = {
      AWAITING_PLAN_APPROVAL: "WORKING",
      AWAITING_CODE_REVIEW:   "CREATING_PR",
      AWAITING_FIX_APPROVAL:  "FIXING",
    };
    const nextState = NEXT[issue.state];
    if (!nextState) return;
    showConfirmModal(
      "Move issue to next phase",
      `Move <strong>${esc(issue.title.slice(0, 70))}</strong> from <strong>${stateSubLabel}</strong> to <strong>${nextState.toLowerCase().replace(/_/g,' ')}</strong>?<br><br>
       Forge will continue with the next matching agent run. Existing decisions and history are preserved.`,
      "Move issue",
      "btn-primary",
      async () => {
        await patch(`/api/issues/${issue.id}`, { action: "advance", nextState });
        await loadOverview();
        openIssue(issue.id);
      }
    );
  });

  $("#btn-jump-to")?.addEventListener("click", () => showJumpToModal(issue));

  $("#btn-retry")?.addEventListener("click", async () => {
    await patch(`/api/issues/${issue.id}`, { action: "retry" });
    await loadOverview();
    openIssue(issue.id);
  });

  $("#btn-full-reset")?.addEventListener("click", () => {
    showTypedConfirmModal(
      "Full reset",
      `This will:<br><br>
       <ul style="margin-left:16px;line-height:2">
         <li>Kill any running agent</li>
         <li>Delete the git worktree &amp; branch</li>
         <li>Delete the plan file</li>
         <li>Clear all decisions and agent history</li>
         <li>Restart the issue from scratch (PENDING)</li>
       </ul><br>
       <strong>${esc(issue.title.slice(0, 80))}</strong> will be re-planned from zero.`,
      "RESET",
      "Reset everything",
      async () => {
        await patch(`/api/issues/${issue.id}`, { action: "reset" });
        await loadOverview();
        history.back();
      }
    );
  });

  $("#btn-listen")?.addEventListener("click", () => openListenPanel(issue.id, activeRun?.agent_type ?? agentRuns[0]?.agent_type));

  $("#btn-pause")?.addEventListener("click", async () => {
    await patch(`/api/issues/${issue.id}`, { action: "pause" });
    openIssue(issue.id);
  });

  $("#btn-unpause")?.addEventListener("click", async () => {
    await patch(`/api/issues/${issue.id}`, { action: "unpause" });
    openIssue(issue.id);
  });

  $("#btn-ignore")?.addEventListener("click", async () => {
    await patch(`/api/issues/${issue.id}`, { action: "ignore" });
    openIssue(issue.id);
  });

  $("#btn-unignore")?.addEventListener("click", async () => {
    await patch(`/api/issues/${issue.id}`, { action: "unignore" });
    openIssue(issue.id);
  });

  $("#btn-steer")?.addEventListener("click", () => showSteerModal(issue.id, issue.steering_context));

  $("#btn-split-pr-stack")?.addEventListener("click", () => showSplitPrStackModal(issue));

  $("#btn-approve-decision")?.addEventListener("click", async function() {
    const decId = this.dataset.id;
    const dec = decisions?.find(d => String(d.id) === String(decId));
    if (dec?.type === "PLAN_REVIEW") {
      showPlanApprovalModal(decId, async (steeringComment) => {
        const feedback = steeringComment ? { steeringComment } : undefined;
        try {
          await post(`/api/decisions/${decId}/resolve`, { verdict: "approved", feedback });
        } catch (err) {
          if (!err.message?.includes("409") && !err.message?.toLowerCase().includes("already resolved")) throw err;
        }
        await loadOverview();
        openIssue(issue.id);
      });
    } else {
      showConfirmModal(
        "Approve",
        "Approve this decision?",
        "Approve", "btn-success",
        async () => {
          try {
            await post(`/api/decisions/${decId}/resolve`, { verdict: "approved" });
          } catch (err) {
            if (!err.message?.includes("409") && !err.message?.toLowerCase().includes("already resolved")) throw err;
          }
          await loadOverview();
          openIssue(issue.id);
        }
      );
    }
  });

  $("#btn-reject-decision")?.addEventListener("click", function() {
    showRejectModal(parseInt(this.dataset.id), () => openIssue(issue.id));
  });

  // ── Fix approval comment selection ────────────────────────────

  function updateFixCount() {
    const checked = $$("#fix-approval-section .fix-comment-cb:checked").length;
    const countEl = $("#fix-selected-count");
    if (countEl) countEl.textContent = checked;
    const btn = $("#btn-fix-selected");
    if (btn) btn.disabled = checked === 0;
  }

  $$("#fix-approval-section .fix-comment-cb").forEach(cb => {
    cb.addEventListener("change", updateFixCount);
  });

  $("#btn-fix-select-all")?.addEventListener("click", () => {
    $$("#fix-approval-section .fix-comment-cb").forEach(cb => cb.checked = true);
    updateFixCount();
  });

  $("#btn-fix-select-none")?.addEventListener("click", () => {
    $$("#fix-approval-section .fix-comment-cb").forEach(cb => cb.checked = false);
    updateFixCount();
  });

  $("#btn-fix-selected")?.addEventListener("click", async function() {
    const decisionId = this.dataset.decisionId;
    const approvedIds = [...$$("#fix-approval-section .fix-comment-cb:checked")].map(cb => cb.dataset.commentId);
    const skippedIds  = [...$$("#fix-approval-section .fix-comment-cb:not(:checked)")].map(cb => cb.dataset.commentId);
    if (approvedIds.length === 0) return;
    showConfirmModal(
      "Fix selected comments",
      `Apply fixes for <strong>${approvedIds.length}</strong> selected comment(s)?`,
      "Fix", "btn-success",
      async () => {
        try {
          await post(`/api/decisions/${decisionId}/resolve`, {
            verdict: "approved",
            feedback: { approvedIds, skippedIds },
          });
        } catch (err) {
          if (!err.message?.includes("409") && !err.message?.toLowerCase().includes("already resolved")) throw err;
        }
        await loadOverview();
        openIssue(issue.id);
      }
    );
  });

  $("#btn-fix-skip-all")?.addEventListener("click", async function() {
    const decisionId = this.dataset.decisionId;
    showConfirmModal(
      "Skip all comments",
      "Skip all comments? They won't be re-surfaced.",
      "Skip all", "btn-danger",
      async () => {
        try {
          await post(`/api/decisions/${decisionId}/resolve`, { verdict: "rejected" });
        } catch (err) {
          // 409 means the decision was already resolved (race with SSE refresh) — treat as success.
          if (!err.message?.includes("409") && !err.message?.toLowerCase().includes("already resolved")) throw err;
        }
        await loadOverview();
        openIssue(issue.id);
      }
    );
  });

  $("#btn-view-diff")?.addEventListener("click", () => openReview(issue.id));

  $("#btn-vm-launch")?.addEventListener("click", () => {
    showConfirmModal(
      "Launch runtime",
      "This will stop Forge-managed frontend/backend sessions, run from this issue worktree, and start the appropriate runtime task based on changed files. No separate checkout is used.",
      "Launch", "btn-primary",
      async () => {
        const btn = $("#btn-vm-launch");
        if (btn) { btn.disabled = true; btn.textContent = "Launching…"; }
        try {
          const result = await post(`/api/issues/${issue.id}/vm-launch`, {});
          alert(`Runtime launch complete\n\nClassification: ${JSON.stringify(result.classification)}\n\n${result.output ?? ""}`);
          await openIssue(issue.id);
        } catch (e) {
          alert(`Runtime launch failed: ${e.message}`);
          if (btn) { btn.disabled = false; btn.textContent = "Launch runtime"; }
        }
      }
    );
  });

  $("#btn-add-feedback")?.addEventListener("click", () => showAddFeedbackModal(issue.id, prStack));

  // Log links
  $$(".run-log-link").forEach(link => {
    link.addEventListener("click", () => showLogModal(link.dataset.runId));
  });
}

// ── Modals ────────────────────────────────────────────────────────────

function showJumpToModal(issue) {
  const JUMP_OPTIONS = [
    { state: "PLANNING",     label: "↩ Re-plan",       hint: "Run the planner agent again",          cls: "btn-ghost" },
    { state: "WORKING",      label: "⚡ Code",          hint: "Jump straight to the coder agent",     cls: "btn-ghost" },
    { state: "AI_REVIEWING", label: "🤖 AI Review",     hint: "Run the AI reviewer on current code",  cls: "btn-ghost" },
    { state: "CREATING_PR",  label: "📤 Create PR",     hint: "Skip to PR creation",                 cls: "btn-ghost" },
    { state: "FIXING",       label: "🔧 Fix",           hint: "Jump to the fixer agent",             cls: "btn-ghost" },
    { state: "WATCHING_PR",    label: "👁 Watch PR",       hint: "Monitor open PRs for CI / reviews",      cls: "btn-ghost" },
    { state: "SPLIT_PLANNING", label: "✂️ Plan Split",     hint: "Ask an agent to propose a stacked PR split", cls: "btn-ghost" },
    { state: "SPLITTING",      label: "✂️ Split Stack",    hint: "Execute the approved stacked PR split", cls: "btn-ghost" },
    { state: "IN_MERGE_QUEUE",  label: "🔀 Merge Queue",   hint: "Mark PRs as entered into merge queue",   cls: "btn-ghost" },
    { state: "DONE",          label: "✅ Mark Done",     hint: "Archive this issue as complete",       cls: "btn-ghost" },
  ];

  // Filter out the current effective state
  const opts = JUMP_OPTIONS.filter(o => o.state !== issue.state);

  const close = showModal(`
    <h3>Move to phase</h3>
    <p style="font-size:12px;color:var(--text-3);margin-bottom:16px;line-height:1.5">
      Manually move <strong>${esc(issue.title.slice(0, 60))}</strong> to any phase.
      The current agent run, if any, will be superseded on the next scheduler tick. History is preserved.
    </p>
    <div style="display:flex;flex-direction:column;gap:6px">
      ${opts.map(o => `
        <button class="btn btn-ghost btn-jump-option" data-state="${o.state}"
          style="justify-content:flex-start;gap:12px;padding:10px 14px">
          <span style="font-size:14px;min-width:20px">${o.label.split(' ')[0]}</span>
          <span>
            <span style="font-weight:510;color:var(--text)">${o.label.split(' ').slice(1).join(' ')}</span>
            <span style="display:block;font-size:11px;color:var(--text-4);margin-top:1px">${o.hint}</span>
          </span>
        </button>
      `).join('')}
    </div>
    <div class="modal-actions" style="margin-top:14px">
      <button class="btn btn-ghost" id="btn-jump-cancel">Cancel</button>
    </div>
  `);

  $("#btn-jump-cancel").addEventListener("click", close);

  $$("[data-state]", $("#modal-content")).forEach(btn => {
    btn.addEventListener("click", async () => {
      const nextState = btn.dataset.state;
      const opt = JUMP_OPTIONS.find(o => o.state === nextState);
      close();
      showConfirmModal(
        `Jump to ${opt?.label ?? nextState}`,
        `Move <strong>${esc(issue.title.slice(0,60))}</strong> to <strong>${nextState.toLowerCase().replace(/_/g,' ')}</strong>?<br><br>
         <span style="font-size:11px;color:var(--text-4)">${opt?.hint ?? ''}. Existing decisions/history are preserved; Forge will continue from that phase.</span>`,
        "Move",
        "btn-primary",
        async () => {
          await patch(`/api/issues/${issue.id}`, { action: "advance", nextState });
          await loadOverview();
          openIssue(issue.id);
        }
      );
    });
  });
}

function showSplitPrStackModal(issue) {
  const close = showModal(`
    <h3>✂️ Split PR Stack</h3>
    <p class="modal-label">Optional instructions for the split-planner agent. Leave blank to use split guidance from plan.md.</p>
    <textarea id="split-pr-input" placeholder="e.g. Put the database migration in part 1, backend changes in part 2, and UI changes in part 3…" rows="6"></textarea>
    <div style="font-size:11px;color:var(--text-4);line-height:1.5;margin-top:8px">
      Forge will create a split plan for approval before changing branches or PRs. This is only allowed while no tracked PRs are merged.
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="btn-split-pr-cancel">Cancel</button>
      <button class="btn btn-primary" id="btn-split-pr-submit">Plan Split</button>
    </div>
  `);

  $("#btn-split-pr-cancel").addEventListener("click", close);
  $("#btn-split-pr-submit").addEventListener("click", async () => {
    const instructions = $("#split-pr-input").value.trim();
    await patch(`/api/issues/${issue.id}`, { action: "split-pr-stack", instructions });
    close();
    await loadOverview();
    openIssue(issue.id);
  });

  setTimeout(() => $("#split-pr-input")?.focus(), 50);
}

function showSteerModal(issueId, currentContext) {
  const close = showModal(`
    <h3>🎯 Steer</h3>
    <p class="modal-label">Instructions injected into the next agent run${currentContext ? " (replaces current)" : ""}:</p>
    ${currentContext ? `<div style="font-size:11px;color:var(--yellow);margin-bottom:8px;padding:6px 10px;background:rgba(245,166,35,0.06);border:1px solid rgba(245,166,35,0.15);border-radius:var(--r)">&#x26A1; Pending: ${esc(currentContext.slice(0,120))}${currentContext.length > 120 ? '…' : ''}</div>` : ""}
    <textarea id="steer-input" placeholder="e.g. Focus on the error handling in the API layer first…" rows="4"></textarea>
    <div class="modal-actions">
      ${currentContext ? `<button class="btn btn-ghost" id="btn-steer-clear" style="margin-right:auto">Clear</button>` : ""}
      <button class="btn btn-ghost" id="btn-steer-cancel">Cancel</button>
      <button class="btn btn-primary" id="btn-steer-submit">Queue Instructions</button>
    </div>
  `);

  $("#btn-steer-cancel").addEventListener("click", close);
  $("#btn-steer-clear")?.addEventListener("click", async () => {
    await patch(`/api/issues/${issueId}`, { action: "clear-steer" });
    close();
    await loadOverview();
  });
  $("#btn-steer-submit").addEventListener("click", async () => {
    const instructions = $("#steer-input").value.trim();
    if (!instructions) return;
    await patch(`/api/issues/${issueId}`, { action: "steer", instructions });
    close();
    await loadOverview();
  });

  setTimeout(() => $("#steer-input")?.focus(), 50);
}

function showAddFeedbackModal(issueId, prStack) {
  const prOptions = (prStack ?? []).length > 0
    ? `<label style="display:block;font-size:12px;font-weight:600;color:var(--text-3);margin-bottom:6px;margin-top:12px">PR <span style="font-weight:400;color:var(--text-4)">(optional)</span></label>
       <select id="feedback-pr" style="width:100%;background:var(--bg-2);color:var(--text-1);border:1px solid var(--border);border-radius:6px;padding:7px 10px;font-size:13px;font-family:inherit">
         <option value="">— General (not PR-specific) —</option>
         ${(prStack ?? []).map(p => `<option value="${p.pr_number}">#${p.pr_number} (${esc(p.gt_branch)})</option>`).join("")}
       </select>`
    : "";

  const close = showModal(`
    <h3>💬 Add PR Feedback</h3>
    <p style="font-size:13px;color:var(--text-2);line-height:1.5;margin-bottom:12px">Describe the changes you want the fixer to make. This will create a fix approval request.</p>
    <label style="display:block;font-size:12px;font-weight:600;color:var(--text-3);margin-bottom:6px">Feedback</label>
    <textarea id="feedback-body" placeholder="e.g. The error message in createBand is misleading — it should say which field failed validation…" style="width:100%;min-height:120px;resize:vertical;box-sizing:border-box;background:var(--bg-2);color:var(--text-1);border:1px solid var(--border);border-radius:6px;padding:8px 10px;font-size:13px;font-family:inherit"></textarea>
    ${prOptions}
    <div class="modal-actions" style="margin-top:14px">
      <button class="btn btn-ghost" id="btn-feedback-cancel">Cancel</button>
      <button class="btn btn-primary" id="btn-feedback-submit">💬 Add Feedback</button>
    </div>
  `);
  $("#feedback-body").focus();
  $("#btn-feedback-cancel").addEventListener("click", close);
  $("#btn-feedback-submit").addEventListener("click", async () => {
    const body = $("#feedback-body").value.trim();
    if (!body) { $("#feedback-body").style.borderColor = "var(--red)"; return; }
    const prNumber = $("#feedback-pr")?.value ? parseInt($("#feedback-pr").value, 10) : null;
    close();
    await post(`/api/issues/${issueId}/feedback`, { body, prNumber });
    await loadOverview();
    openIssue(issueId);
  });
}

function showRejectModal(decisionId, onDone) {
  const close = showModal(`
    <h3>✗ Reject Decision</h3>
    <p class="modal-label">Provide feedback for the agent:</p>
    <textarea id="reject-input" placeholder="What needs to change?"></textarea>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="btn-reject-cancel">Cancel</button>
      <button class="btn btn-danger" id="btn-reject-submit">Reject</button>
    </div>
  `);

  $("#btn-reject-cancel").addEventListener("click", close);
  $("#btn-reject-submit").addEventListener("click", async () => {
    const feedback = $("#reject-input").value.trim();
    try {
      await post(`/api/decisions/${decisionId}/resolve`, { verdict: "rejected", feedback });
    } catch (err) {
      if (!err.message?.includes("409") && !err.message?.toLowerCase().includes("already resolved")) throw err;
    }
    close();
    await loadOverview();
    if (onDone) onDone();
  });

  setTimeout(() => $("#reject-input")?.focus(), 50);
}

async function showDiffModal(issueId) {
  $("#modal").classList.add("modal-wide");
  const close = showModal(`<h3>📋 Code Diff</h3><p style="color:var(--text-muted);font-size:12px">Loading diff…</p>`);
  const origClose = close;
  const closeWide = () => { $("#modal").classList.remove("modal-wide"); origClose(); };

  try {
    const { diff, baseBranch } = await get(`/api/issues/${issueId}/diff`);
    if (!diff.trim()) {
      $("#modal-content").innerHTML = `<h3>📋 Code Diff</h3><p style="color:var(--text-muted)">No changes found vs <code>${baseBranch}</code>.</p><div class="modal-actions"><button class="btn btn-ghost" id="btn-diff-close">Close</button></div>`;
      $("#btn-diff-close").addEventListener("click", closeWide);
      return;
    }
    const rendered = renderDiff(diff);
    $("#modal-content").innerHTML = `
      <h3>📋 Code Diff vs <code>${baseBranch}</code></h3>
      <div class="diff-viewer" style="max-height:70vh;overflow-y:auto"><pre>${rendered}</pre></div>
      <div class="modal-actions" style="margin-top:12px">
        <button class="btn btn-ghost" id="btn-diff-close">Close</button>
      </div>
    `;
    $("#btn-diff-close").addEventListener("click", closeWide);
  } catch (e) {
    $("#modal-content").innerHTML = `<h3>Error</h3><p>${esc(e.message)}</p><div class="modal-actions"><button class="btn btn-ghost" id="btn-diff-close">Close</button></div>`;
    $("#btn-diff-close").addEventListener("click", closeWide);
  }
}

async function showLogModal(runId) {
  const close = showModal(`<h3>Agent Log</h3><p style="color:var(--text-muted);font-size:12px">Loading…</p>`);
  try {
    const res = await fetch(`/api/runs/${runId}/log`);
    const text = await res.text();
    $("#modal-content").innerHTML = `
      <h3>Agent Log — Run #${runId}</h3>
      <div class="markdown-viewer" style="max-height:400px;overflow-y:auto;font-size:11px">${esc(text)}</div>
      <div class="modal-actions"><button class="btn btn-ghost" id="btn-log-close">Close</button></div>
    `;
    $("#btn-log-close").addEventListener("click", close);
  } catch (e) {
    $("#modal-content").innerHTML = `<h3>Error</h3><p>${esc(e.message)}</p>`;
  }
}

function showAddIssueModal() {
  const close = showModal(`
    <h3>Add Manual Issue</h3>
    <p class="modal-label">Title</p>
    <input type="text" id="add-title" class="modal-input" placeholder="Issue title…" />
    <p class="modal-label">Description (optional)</p>
    <textarea id="add-desc" placeholder="What needs to be done?"></textarea>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="btn-add-cancel">Cancel</button>
      <button class="btn btn-primary" id="btn-add-submit">Add Issue</button>
    </div>
  `);

  $("#btn-add-cancel").addEventListener("click", close);
  $("#btn-add-submit").addEventListener("click", async () => {
    const title = $("#add-title").value.trim();
    if (!title) return;
    const description = $("#add-desc").value.trim();
    await post("/api/issues", { title, description });
    close();
    await loadOverview();
  });

  setTimeout(() => $("#add-title")?.focus(), 50);
}

// ── Diff parser ──────────────────────────────────────────────────────

function parseDiff(raw) {
  const files = [];
  let cur = null;
  let curHunk = null;
  let beforeLine = 0, afterLine = 0;

  for (const line of raw.split("\n")) {
    if (line.startsWith("diff --git ")) {
      if (cur) files.push(cur);
      const m = line.match(/diff --git a\/(.+) b\/(.+)/);
      cur = { path: m?.[2] ?? line, before: m?.[1], after: m?.[2], hunks: [], isNew: false, isDeleted: false };
      curHunk = null;
    } else if (line.startsWith("new file"))     { if (cur) cur.isNew = true; }
    else if (line.startsWith("deleted file"))   { if (cur) cur.isDeleted = true; }
    else if (line.startsWith("--- "))           { /* skip */ }
    else if (line.startsWith("+++ "))           { /* skip */ }
    else if (line.startsWith("@@ ")) {
      const m = line.match(/@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@(.*)/);
      beforeLine = parseInt(m?.[1] ?? 1, 10);
      afterLine  = parseInt(m?.[2] ?? 1, 10);
      curHunk = { header: line, context: m?.[3]?.trim() ?? "", lines: [] };
      if (cur) cur.hunks.push(curHunk);
    } else if (curHunk) {
      if (line.startsWith("+")) {
        curHunk.lines.push({ type: "add", content: line.slice(1), beforeLine: null, afterLine: afterLine++ });
      } else if (line.startsWith("-")) {
        curHunk.lines.push({ type: "del", content: line.slice(1), beforeLine: beforeLine++, afterLine: null });
      } else if (line.startsWith("\\")) {
        // "No newline at end of file" — skip
      } else {
        curHunk.lines.push({ type: "ctx", content: line.slice(1), beforeLine: beforeLine++, afterLine: afterLine++ });
      }
    }
  }
  if (cur) files.push(cur);
  return files;
}

// ── Inline comment state ─────────────────────────────────────────────
// Stored as: [{ file, line, side (add/del/ctx), comment }]
let reviewComments = [];
let reviewGeneralComment = "";
let reviewedFiles = new Set();

// ── Review view ─────────────────────────────────────────────────────────────────

async function openReview(issueId, { pushState = true } = {}) {
  reviewComments = [];
  reviewGeneralComment = "";
  reviewedFiles = new Set();

  showView("review", { pushState: false });
  activeIssueId = issueId;
  if (pushState) history.pushState(null, "", `#review/${issueId}`);

  $("#review-panel").innerHTML = `
    <div class="review-loading">
      <div class="review-header-bar">
        <button class="btn-back" id="btn-review-back">← Back</button>
        <span style="color:var(--text-muted)">Loading diff…</span>
      </div>
    </div>`;
  $("#btn-review-back").addEventListener("click", () => history.back());

  // Fetch diff, issue, and tour in parallel
  const [diffData, issueData, tourData] = await Promise.all([
    get(`/api/issues/${issueId}/diff`).catch(e => ({ error: e.message })),
    get(`/api/issues/${issueId}`),
    get(`/api/issues/${issueId}/tour`).catch(() => ({ tour: null })),
  ]);

  if (diffData.error) {
    $("#review-panel").innerHTML = `<div class="review-loading"><p style="color:var(--red)">${esc(diffData.error)}</p></div>`;
    return;
  }

  const files  = parseDiff(diffData.diff);
  const tour   = tourData.tour;
  const issue  = issueData.issue;
  const decision = issueData.decisions?.find(d => d.type === "CODE_REVIEW" && !d.verdict);

  // Start tour generation in background if not yet available
  if (!tour) {
    post(`/api/issues/${issueId}/generate-tour`, {}).catch(() => {});
  }

  renderReviewView(issueId, issue, files, diffData.baseBranch, tour, decision);

  // Poll for tour if generating
  if (!tour) {
    let polls = 0;
    const tourPoll = setInterval(async () => {
      if (polls++ > 30) return clearInterval(tourPoll); // give up after 5min
      const t = await get(`/api/issues/${issueId}/tour`).catch(() => null);
      if (t?.tour) {
        clearInterval(tourPoll);
        renderReviewView(issueId, issue, files, diffData.baseBranch, t.tour, decision);
      }
    }, 10000);
  }
}

function renderReviewView(issueId, issue, files, baseBranch, tour, decision) {
  const tourByFile = {};
  for (const f of (tour?.files ?? [])) tourByFile[f.path] = f;

  const fileList = files.map((f, i) => {
    const isReviewed = reviewedFiles.has(f.path);
    return `
    <a class="review-file-link ${isReviewed ? "reviewed" : ""}" href="#file-${i}">
      <span class="review-file-status ${isReviewed ? 'file-reviewed' : f.isNew ? 'file-new' : f.isDeleted ? 'file-del' : 'file-mod'}"></span>
      <span class="review-file-name">${esc(f.path.split("/").pop())}</span>
      <span class="review-file-state">${isReviewed ? "reviewed" : "unread"}</span>
    </a>`;
  }).join("");

  const fileDiffs = files.map((f, fi) => {
    const fileTour = tourByFile[f.path];
    const tourBadge = fileTour
      ? `<div class="tour-summary">🤖 <strong>Tour:</strong> ${esc(fileTour.summary)}</div>`
      : (tour ? "" : `<div class="tour-generating">🤖 Generating tour…</div>`);

    // Build line → highlight map
    const highlights = {};
    for (const h of (fileTour?.highlights ?? [])) highlights[h.line] = h.note;

    const hunks = f.hunks.map((hunk, hi) => {
      const lines = hunk.lines.map((l, li) => {
        const lineNum = l.afterLine ?? l.beforeLine ?? 0;
        const key     = `${fi}-${hi}-${li}`;
        const highlight = highlights[lineNum];
        const existingComments = reviewComments
          .filter(c => c.file === f.path && c.line === lineNum)
          .map(c => `<div class="inline-comment">💬 ${esc(c.comment)} <button class="inline-del" data-key="${esc(c.file)}|${c.line}">×</button></div>`)
          .join("");

        return `
          <tr class="diff-line diff-line-${l.type}" data-file="${esc(f.path)}" data-line="${lineNum}" data-key="${key}">
            <td class="diff-ln">${l.type !== "add" ? (l.beforeLine ?? "") : ""}</td>
            <td class="diff-ln">${l.type !== "del" ? (l.afterLine ?? "")  : ""}</td>
            <td class="diff-sign">${l.type === "add" ? "+" : l.type === "del" ? "-" : " "}</td>
            <td class="diff-content"><span class="diff-add-comment" data-file="${esc(f.path)}" data-line="${lineNum}" title="Add comment">+</span><code>${esc(l.content)}</code>${highlight ? `<span class="diff-tour-note" title="${esc(highlight)}">🤖</span>` : ""}</td>
          </tr>
          ${existingComments ? `<tr class="inline-comment-row"><td colspan="4">${existingComments}</td></tr>` : ""}
          ${highlight ? `<tr class="tour-annotation-row" id="tour-${key}"><td colspan="4"><div class="tour-annotation">🤖 ${esc(highlight)}</div></td></tr>` : ""}
        `;
      }).join("");

      return `
        <tr class="hunk-header">
          <td colspan="4"><span class="hunk-range">${esc(hunk.header)}</span>${hunk.context ? ` <span class="hunk-ctx">${esc(hunk.context)}</span>` : ""}</td>
        </tr>
        ${lines}
      `;
    }).join("");

    const badge = f.isNew ? '<span class="file-badge new">new</span>'
                 : f.isDeleted ? '<span class="file-badge del">deleted</span>' : "";

    return `
      <div class="review-file" id="file-${fi}">
        <div class="review-file-header">
          <span class="review-file-path">${esc(f.path)}</span>
          ${badge}
          <label class="reviewed-toggle"><input type="checkbox" class="reviewed-file-cb" data-file="${esc(f.path)}" ${reviewedFiles.has(f.path) ? "checked" : ""}> Reviewed</label>
        </div>
        ${tourBadge}
        <div class="diff-table-wrap">
          <table class="diff-table">${hunks}</table>
        </div>
      </div>
    `;
  }).join("");

  const overallBanner = tour?.overall
    ? `<div class="tour-overall">🤖 <strong>Summary:</strong> ${esc(tour.overall)}</div>`
    : (!tour ? `<div class="tour-overall generating">🤖 Generating tour… this may take up to a minute.</div>` : "");

  $("#review-panel").innerHTML = `
    <div class="review-layout">

      <div class="review-header-bar">
        <button class="btn-back" id="btn-review-back">← ${esc(issue?.title?.slice(0,60) ?? "Back")}</button>
        <div class="review-actions">
          <span class="review-base">vs <code>${esc(baseBranch)}</code></span>
          <button class="btn btn-ghost" id="btn-regen-tour" title="Regenerate tour">🤖 Regen tour</button>
          ${decision ? `
            <button class="btn btn-danger"  id="btn-review-reject">✗ Request Changes</button>
            <button class="btn btn-success" id="btn-review-approve">✓ Approve</button>
          ` : "<span style='color:var(--text-muted);font-size:12px'>No pending decision</span>"}
        </div>
      </div>

      <div class="review-body">
        <aside class="review-sidebar">
          <div class="review-sidebar-title">${files.length} file${files.length !== 1 ? "s" : ""} changed</div>
          ${fileList}
        </aside>

        <div class="review-main">
          ${overallBanner}
          <div class="review-submit-bar">
            <span>${reviewedFiles.size}/${files.length} files reviewed · ${reviewComments.length} inline comment${reviewComments.length === 1 ? "" : "s"}</span>
            ${decision ? `<span>Finish with Approve or Request Changes in the header.</span>` : ""}
          </div>
          ${fileDiffs}

          <div class="review-general-comment">
            <label style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:6px">General comment (optional)</label>
            <textarea id="review-general" placeholder="Overall feedback…" rows="3"></textarea>
          </div>
        </div>
      </div>

    </div>
  `;

  // Reviewed file toggles
  $("#review-panel").querySelectorAll(".reviewed-file-cb").forEach(cb => {
    cb.addEventListener("change", () => {
      if (cb.checked) reviewedFiles.add(cb.dataset.file);
      else reviewedFiles.delete(cb.dataset.file);
      renderReviewView(issueId, issue, files, baseBranch, tour, decision);
    });
  });

  // Wire up inline comment buttons
  $("#review-panel").querySelectorAll(".diff-add-comment").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const file = btn.dataset.file;
      const line = parseInt(btn.dataset.line, 10);
      showInlineCommentForm(file, line, issueId, issue, files, baseBranch, tour, decision);
    });
  });

  // Delete inline comment
  $("#review-panel").querySelectorAll(".inline-del").forEach(btn => {
    btn.addEventListener("click", () => {
      const [file, line] = btn.dataset.key.split("|");
      reviewComments = reviewComments.filter(c => !(c.file === file && String(c.line) === line));
      renderReviewView(issueId, issue, files, baseBranch, tour, decision);
    });
  });

  // Back
  $("#btn-review-back")?.addEventListener("click", () => history.back());

  // Regenerate tour
  $("#btn-regen-tour")?.addEventListener("click", async () => {
    await fetch(`/api/issues/${issueId}/tour`, { method: "DELETE" });
    await post(`/api/issues/${issueId}/generate-tour`, {});
    $("#btn-regen-tour").textContent = "🤖 Generating…";
    $("#btn-regen-tour").disabled = true;
    const poll = setInterval(async () => {
      const t = await get(`/api/issues/${issueId}/tour`).catch(() => null);
      if (t?.tour) { clearInterval(poll); renderReviewView(issueId, issue, files, baseBranch, t.tour, decision); }
    }, 8000);
  });

  // Approve
  $("#btn-review-approve")?.addEventListener("click", async () => {
    if (!decision) return;
    const unreviewed = files.length - reviewedFiles.size;
    if (unreviewed > 0) {
      showConfirmModal(
        "Approve with unreviewed files",
        `${unreviewed} file${unreviewed === 1 ? "" : "s"} not marked reviewed. Approve anyway?`,
        "Approve",
        "btn-success",
        async () => {
          await post(`/api/decisions/${decision.id}/resolve`, { verdict: "approved" });
          await loadOverview();
          history.back();
        }
      );
      return;
    }
    await post(`/api/decisions/${decision.id}/resolve`, { verdict: "approved" });
    await loadOverview();
    history.back();
  });

  // Request changes
  $("#btn-review-reject")?.addEventListener("click", async () => {
    if (!decision) return;
    const general = $("#review-general")?.value?.trim();
    const feedback = [
      ...reviewComments,
      ...(general ? [{ file: null, line: null, comment: general }] : []),
    ];
    if (!feedback.length) {
      showConfirmModal(
        "Submit with no comments",
        "You haven't added any comments. Submit the review anyway?",
        "Submit", "btn-danger",
        async () => {
          await post(`/api/decisions/${decision.id}/resolve`, { verdict: "rejected", feedback });
          await loadOverview();
          history.back();
        }
      );
      return;
    }
    await post(`/api/decisions/${decision.id}/resolve`, { verdict: "rejected", feedback });
    await loadOverview();
    history.back();
  });
}

function showInlineCommentForm(file, line, issueId, issue, files, baseBranch, tour, decision) {
  const close = showModal(`
    <h3>💬 Comment on line ${line}</h3>
    <p class="modal-label" style="margin-bottom:6px;color:var(--text-muted);font-size:11px">${esc(file)}</p>
    <textarea id="inline-comment-input" placeholder="Your comment…" rows="4"></textarea>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="btn-ic-cancel">Cancel</button>
      <button class="btn btn-primary" id="btn-ic-save">Add Comment</button>
    </div>
  `);
  setTimeout(() => $("#inline-comment-input")?.focus(), 50);
  $("#btn-ic-cancel").addEventListener("click", close);
  $("#btn-ic-save").addEventListener("click", () => {
    const text = $("#inline-comment-input")?.value?.trim();
    if (!text) return;
    reviewComments.push({ file, line, comment: text });
    close();
    renderReviewView(issueId, issue, files, baseBranch, tour, decision);
  });
}

// ── Listen panel ────────────────────────────────────────────────────────────────

let listenES = null;

function inferListenPhase(kind, text) {
  const t = String(text ?? "").toLowerCase();
  if (kind === "tool") return "Using tools";
  if (t.includes("test") || t.includes("pnpm") || t.includes("pytest")) return "Running checks";
  if (t.includes("edit") || t.includes("write") || t.includes("patch")) return "Editing files";
  if (t.includes("error") || t.includes("failed") || t.includes("traceback")) return "Error";
  if (kind === "thinking" || kind === "thinking_delta") return "Thinking";
  return "Working";
}

function openListenPanel(issueId, agentType) {
  // Close existing connection
  if (listenES) { listenES.close(); listenES = null; }

  // Create panel
  let panel = $("#listen-panel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "listen-panel";
    document.body.appendChild(panel);
  }

  const issue = state.issues?.find(i => i.id === issueId);
  listenAutoScroll = true;
  listenLastError = "";
  panel.innerHTML = `
    <div class="listen-header">
      <div class="listen-heading">
        <span class="listen-title">Listening — <span id="listen-agent">${esc(agentType ?? "agent")}</span></span>
        <span class="listen-issue" title="${esc(issue?.title ?? `Issue #${issueId}`)}">${issue?.linear_id ? linearIssueLink(issue.linear_id, "listen-issue-link") : esc(`Issue #${issueId}`)} · ${esc((issue?.title ?? "").slice(0, 58))}</span>
      </div>
      <span class="listen-phase" id="listen-phase">Connecting</span>
      <span class="listen-status" id="listen-status">connecting…</span>
      <button class="listen-close" id="btn-listen-close" aria-label="Close live agent console">×</button>
    </div>
    <div class="listen-toolbar">
      <button class="btn-sm" id="btn-listen-autoscroll" type="button">Auto-scroll on</button>
      <button class="btn-sm" id="btn-listen-copy-error" type="button" disabled>Copy last error</button>
    </div>
    <div class="listen-latest" id="listen-latest">Waiting for agent output…</div>
    <div class="listen-messages" id="listen-messages"></div>
  `;
  panel.classList.add("listen-open");

  $("#btn-listen-close").addEventListener("click", () => closeListenPanel());
  $("#btn-listen-autoscroll").addEventListener("click", (e) => {
    listenAutoScroll = !listenAutoScroll;
    e.currentTarget.textContent = `Auto-scroll ${listenAutoScroll ? "on" : "off"}`;
  });
  $("#btn-listen-copy-error").addEventListener("click", async () => {
    if (!listenLastError) return;
    await navigator.clipboard.writeText(listenLastError);
    $("#btn-listen-copy-error").textContent = "Copied";
    setTimeout(() => { const b = $("#btn-listen-copy-error"); if (b) b.textContent = "Copy last error"; }, 1200);
  });

  const es = new EventSource(`/api/issues/${issueId}/listen`);
  listenES = es;

  es.addEventListener("meta", (e) => {
    const { agentType: type } = JSON.parse(e.data);
    const el = $("#listen-agent");
    if (el) el.textContent = type ?? "agent";
    const st = $("#listen-status");
    if (st) { st.textContent = "live"; st.className = "listen-status live"; }
  });

  es.addEventListener("message", (e) => {
    const { kind, text } = JSON.parse(e.data);
    appendListenMessage(text, kind);
  });

  es.addEventListener("done", (e) => {
    const { exitCode } = JSON.parse(e.data);
    const st = $("#listen-status");
    if (st) {
      st.textContent = exitCode === 0 ? "done" : `failed (${exitCode})`;
      st.className = `listen-status ${exitCode === 0 ? "done" : "error"}`;
    }
    es.close();
    listenES = null;
  });

  es.addEventListener("error", (e) => {
    const st = $("#listen-status");
    if (st) { st.textContent = "no active agent"; st.className = "listen-status error"; }
  });

  es.onerror = () => {
    if (listenES === es) {
      const st = $("#listen-status");
      if (st) { st.textContent = "disconnected"; st.className = "listen-status error"; }
    }
  };
}

function appendListenMessage(text, kind = "text") {
  const container = $("#listen-messages");
  if (!container) return;
  const phase = inferListenPhase(kind, text);
  const phaseEl = $("#listen-phase");
  if (phaseEl) phaseEl.textContent = phase;
  const latest = $("#listen-latest");
  if (latest) latest.textContent = String(text ?? "").slice(0, 240) || phase;
  if (phase === "Error") {
    listenLastError = String(text ?? "");
    const copy = $("#btn-listen-copy-error");
    if (copy) copy.disabled = false;
  }

  if (kind === "prompt") {
    const el = document.createElement("details");
    el.className = "listen-prompt";
    el.innerHTML = `
      <summary class="listen-prompt-summary">📤 Initial prompt</summary>
      <div class="listen-prompt-body">${esc(text)}</div>
    `;
    container.appendChild(el);
  } else if (kind === "tool") {
    const el = document.createElement("details");
    el.className = "listen-tool listen-tool-block";
    el.innerHTML = `<summary>Tool call</summary><pre>${esc(text)}</pre>`;
    container.appendChild(el);
  } else if (kind === "thinking") {
    const el = document.createElement("details");
    el.className = "listen-thinking";
    el.open = true;
    el.innerHTML = `
      <summary class="listen-thinking-summary">&#x1F9E0; thinking</summary>
      <div class="listen-thinking-body">${esc(text)}</div>
    `;
    container.appendChild(el);
  } else if (kind === "thinking_delta") {
    let el = container.querySelector(".listen-thinking.listen-streaming:last-child");
    if (!el) {
      el = document.createElement("details");
      el.className = "listen-thinking listen-streaming";
      el.open = true;
      el.innerHTML = `
        <summary class="listen-thinking-summary">&#x1F9E0; thinking</summary>
        <div class="listen-thinking-body"></div>
      `;
      container.appendChild(el);
    }
    const body = el.querySelector(".listen-thinking-body");
    if (body) body.textContent += text;
  } else if (kind === "text_delta") {
    let el = container.querySelector(".listen-msg.listen-streaming:last-child");
    if (!el) {
      el = document.createElement("div");
      el.className = "listen-msg listen-streaming";
      container.appendChild(el);
    }
    el.textContent += text;
  } else {
    const el = document.createElement("div");
    el.className = "listen-msg";
    el.textContent = text;
    container.appendChild(el);
  }

  if (listenAutoScroll) container.scrollTop = container.scrollHeight;
}

function closeListenPanel() {
  if (listenES) { listenES.close(); listenES = null; }
  const panel = $("#listen-panel");
  if (panel) panel.classList.remove("listen-open");
}

// ── Diff renderer (simple, for modal fallback) ─────────────────────────────

function renderDiff(diff) {
  return diff.split("\n").map(line => {
    if (line.startsWith("+++") || line.startsWith("---")) return `<span class="diff-meta">${esc(line)}</span>`;
    if (line.startsWith("+")) return `<span class="diff-add">${esc(line)}</span>`;
    if (line.startsWith("-")) return `<span class="diff-del">${esc(line)}</span>`;
    if (line.startsWith("@@")) return `<span class="diff-hunk">${esc(line)}</span>`;
    if (line.startsWith("diff ") || line.startsWith("index ")) return `<span class="diff-meta">${esc(line)}</span>`;
    return esc(line);
  }).join("\n");
}

// ── Settings ──────────────────────────────────────────────────────────

const SETTING_LABELS = {
  concurrency_limit: ["Scheduler", "Concurrency limit", "Max simultaneous agent runs"],
  scheduler_interval_seconds: ["Scheduler", "Scheduler interval (seconds)", "How often Forge checks for work"],
  linear_poll_interval_seconds: ["Scheduler", "Linear poll interval (seconds)", "How often Linear is polled, when enabled"],
  forge_reuse_pi_sessions: ["Scheduler", "Reuse Pi sessions", "Reuse sessions for the same issue + agent type"],
  ai_review_max_rounds: ["Scheduler", "AI review max rounds", "Rounds before escalating to human"],
  model: ["Models", "Default model", "Fallback for agents without an override"],
  model_planner: ["Models", "Planner model", "Leave blank to use the default model"],
  model_plan_reviewer: ["Models", "Plan reviewer model", "Leave blank to use the default model"],
  model_coder: ["Models", "Coder model", "Leave blank to use the default model"],
  model_reviewer: ["Models", "Reviewer model", "Leave blank to use the default model"],
  model_git_agent: ["Models", "Git agent model", "Leave blank to use the default model"],
  model_fixer: ["Models", "Fixer model", "Leave blank to use the default model"],
  model_split_planner: ["Models", "Split planner model", "Leave blank to use the default model"],
  model_splitter: ["Models", "Splitter model", "Leave blank to use the default model"],
  linear_enabled: ["Integrations", "Linear enabled", "Use Linear CLI jobs through the desktop app"],
  linear_team: ["Integrations", "Linear team", "Team key used when listing assigned issues"],
  github_repo: ["Integrations", "GitHub repo", "owner/repo used for PR links and gh commands"],
  dashboard_port: ["Backend", "Dashboard port", "Local backend port"],
  worktree_provider: ["Repository", "Worktree provider", "wt or git"],
  wt_root: ["Repository", "wt root", "Worktrunk root directory"],
  repo_root: ["Repository", "Repo root", "Non-worktrunk repository root"],
  worktree_root: ["Repository", "Worktree root", "Directory for git worktrees"],
  branch_prefix: ["Repository", "Branch prefix", "Prefix used when creating branches"],
  default_branch: ["Repository", "Default branch", "Base branch for new work"],
  vm_ssh_target: ["Runtime", "VM SSH target", "Optional SSH host for remote workspace commands"],
  vm_frontend_staging_backend_command: ["Runtime", "Frontend command (staging backend)", "Command run in the VM/runtime shell"],
  vm_frontend_local_backend_command: ["Runtime", "Frontend command (local backend)", "Command run in the VM/runtime shell"],
  vm_backend_staging_command: ["Runtime", "Backend command (staging)", "Command run in the VM/runtime shell"],
  vm_backend_local_command: ["Runtime", "Backend command (local)", "Command run in the VM/runtime shell"],
  vm_database_command: ["Runtime", "Database command", "Optional command for database changes"],
  setup_completed: ["Setup", "Setup completed", "First-run setup flag"],
};

const SETTING_GROUP_ORDER = ["Scheduler", "Models", "Integrations", "Repository", "Runtime", "Backend", "Setup", "Other"];

function settingMeta(key) {
  if (SETTING_LABELS[key]) return SETTING_LABELS[key];
  return ["Other", key.replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase()), key];
}

function settingInputType(key, value) {
  if (["true", "false"].includes(String(value).toLowerCase())) return "checkbox";
  if (/(_seconds|_limit|_rounds|_port)$/.test(key) && /^-?\d+$/.test(String(value))) return "number";
  return String(value ?? "").length > 90 || key.endsWith("_command") ? "textarea" : "text";
}

function renderSettingsForm(settings) {
  const groups = new Map();
  for (const key of Object.keys(settings).sort()) {
    const [group, label, hint] = settingMeta(key);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push({ key, label, hint, value: settings[key] ?? "", type: settingInputType(key, settings[key]) });
  }
  const orderedGroups = [...SETTING_GROUP_ORDER, ...[...groups.keys()].filter(g => !SETTING_GROUP_ORDER.includes(g)).sort()]
    .filter(g => groups.has(g));
  return orderedGroups.map(group => `
    <div class="settings-group">
      <h3>${esc(group)}</h3>
      ${groups.get(group).map(({ key, label, hint, value, type }) => {
        const checked = ["1", "true", "yes", "on"].includes(String(value).toLowerCase()) ? "checked" : "";
        const input = type === "checkbox"
          ? `<input type="checkbox" class="setting-input" data-setting-key="${esc(key)}" ${checked} />`
          : type === "textarea"
            ? `<textarea class="setting-input setting-textarea" data-setting-key="${esc(key)}" rows="2">${esc(value)}</textarea>`
            : `<input type="${type}" class="setting-input" data-setting-key="${esc(key)}" value="${esc(value)}" />`;
        return `<div class="setting-row">
          <div><div class="setting-label">${esc(label)}</div><div class="setting-hint"><code>${esc(key)}</code>${hint && hint !== key ? ` · ${esc(hint)}` : ""}</div></div>
          ${input}
        </div>`;
      }).join("")}
    </div>`).join("");
}

function collectSettingsForm() {
  const updates = {};
  $$('[data-setting-key]').forEach(input => {
    updates[input.dataset.settingKey] = input.type === "checkbox" ? (input.checked ? "true" : "false") : input.value;
  });
  return updates;
}

async function openSettings({ pushState = true } = {}) {
  showView("settings", { pushState });
  const [settings, desktopBackend, plannerPrompt, planReviewerPrompt, coderPrompt, reviewerPrompt, gitPrompt, fixerPrompt, splitPlannerPrompt, splitterPrompt] = await Promise.all([
    get("/api/settings"),
    fetch("/api/desktop-backend", { cache: "no-store" }).then(r => r.ok ? r.json() : null).catch(() => null),
    fetch("/api/agents/planner/prompt").then(r => r.text()).catch(() => ""),
    fetch("/api/agents/plan-reviewer/prompt").then(r => r.text()).catch(() => ""),
    fetch("/api/agents/coder/prompt").then(r => r.text()).catch(() => ""),
    fetch("/api/agents/reviewer/prompt").then(r => r.text()).catch(() => ""),
    fetch("/api/agents/git-agent/prompt").then(r => r.text()).catch(() => ""),
    fetch("/api/agents/fixer/prompt").then(r => r.text()).catch(() => ""),
    fetch("/api/agents/split-planner/prompt").then(r => r.text()).catch(() => ""),
    fetch("/api/agents/splitter/prompt").then(r => r.text()).catch(() => ""),
  ]);

  const backendHtml = desktopBackend?.backendOrigin ? `
    <div class="settings-group">
      <h3>Selected backend</h3>
      <div class="setting-row">
        <div><div class="setting-label">Desktop backend origin</div><div class="setting-hint">All dashboard reads and writes on this screen go through this backend.</div></div>
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; justify-content:flex-end;">
          <code>${esc(desktopBackend.backendOrigin)}</code>
          <a class="btn btn-small" href="/desktop/backend">Switch</a>
        </div>
      </div>
    </div>` : "";

  $("#settings-panel").innerHTML = `
    <h2>Settings</h2>
    ${backendHtml}
    <form id="settings-form">
      ${renderSettingsForm(settings)}
      <button type="submit" class="btn btn-primary settings-save" id="btn-save-settings">Save Settings</button>
    </form>

    <div class="settings-group">
      <h3>Agent Prompts</h3>
      <div class="agent-prompts-grid">
        ${agentPromptEditor("planner")}
        ${agentPromptEditor("plan-reviewer")}
        ${agentPromptEditor("coder")}
        ${agentPromptEditor("reviewer")}
        ${agentPromptEditor("git-agent")}
        ${agentPromptEditor("fixer")}
        ${agentPromptEditor("split-planner")}
        ${agentPromptEditor("splitter")}
      </div>
    </div>
  `;
  // Set textarea values via .value (safe for content containing backticks)
  $("#prompt-planner").value       = plannerPrompt;
  $("#prompt-plan-reviewer").value = planReviewerPrompt;
  $("#prompt-coder").value         = coderPrompt;
  $("#prompt-reviewer").value   = reviewerPrompt;
  $("#prompt-git-agent").value     = gitPrompt;
  $("#prompt-fixer").value         = fixerPrompt;
  $("#prompt-split-planner").value = splitPlannerPrompt;
  $("#prompt-splitter").value      = splitterPrompt;

  $("#settings-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    await patch("/api/settings", collectSettingsForm());
    const saveBtn = $("#btn-save-settings");
    const orig = saveBtn.textContent;
    saveBtn.textContent = "✓ Saved";
    saveBtn.style.color = "var(--green)";
    setTimeout(() => { saveBtn.textContent = orig; saveBtn.style.color = ""; }, 2000);
  });

  $$(".btn-save-prompt").forEach(btn => {
    btn.addEventListener("click", async () => {
      const type = btn.dataset.type;
      const content = $(`#prompt-${type}`).value;
      const reason = window.prompt("Why are you changing this prompt?", "Manual prompt improvement") || "Manual prompt improvement";
      await put(`/api/agents/${type}/prompt`, { content, reason });
      btn.textContent = "✓ Saved";
      btn.style.color = "var(--green)";
      setTimeout(() => { btn.textContent = "Save"; btn.style.color = ""; }, 2000);
    });
  });

  $$(".btn-reset-prompt").forEach(btn => {
    btn.addEventListener("click", async () => {
      const type = btn.dataset.type;
      showConfirmModal(
        "Reset prompt",
        `Reset the <strong>${esc(type)}</strong> prompt to default? This cannot be undone.`,
        "Reset", "btn-danger",
        async () => {
          const defaultContent = await fetch(`/api/agents/${type}/prompt/default`).then(r => r.text()).catch(() => "");
          if (defaultContent) {
            $(`#prompt-${type}`).value = defaultContent;
            btn.textContent = "✓ Reset";
            setTimeout(() => btn.textContent = "Reset to default", 2000);
          }
        }
      );
    });
  });
}

function agentPromptEditor(type) {
  return `
    <div style="margin-bottom:20px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <span style="font-size:11px;font-weight:510;color:var(--text-4);text-transform:uppercase;letter-spacing:0.5px">${type}</span>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm btn-reset-prompt" data-type="${type}">Reset to default</button>
          <button class="btn btn-ghost btn-save-prompt" data-type="${type}">Save</button>
        </div>
      </div>
      <textarea class="prompt-editor" id="prompt-${type}"></textarea>
    </div>
  `;
}

// ── Linear backlog ────────────────────────────────────────────────────

async function loadLinearIssues(showLoading = false) {
  const el = $("#linear-issues");
  if (showLoading && el) el.innerHTML = `<div class="empty-state">Loading from Linear…</div>`;
  try {
    const issues = await get("/api/linear/issues");
    state._linearIssues = issues;
    renderLinearIssues(filterLinearIssues(issues));
  } catch (e) {
    if (el) el.innerHTML = `<div class="empty-state" style="color:var(--red)">Could not reach Linear</div>`;
    console.warn("Could not load Linear issues:", e.message);
  }
}

// ── SSE real-time updates ─────────────────────────────────────────────

function connectSSE() {
  const es = new EventSource("/api/events");
  // Periodic tick: refresh what's relevant to the current view
  es.addEventListener("tick", () => {
    if (activeReorderInProgress) return;
    if (activeView === "issue" && activeIssueId) {
      // On issue detail: refresh just that issue silently. Avoid re-rendering
      // while a terminal is attached because replacing the DOM disposes xterm.
      if (activeTerminal?.issueId === activeIssueId) return;
      const detail = $("#issue-detail");
      get(`/api/issues/${activeIssueId}`).then(data => {
        // Briefly mark as refreshing so the transition hides any repaint flash.
        detail?.classList.add("is-refreshing");
        requestAnimationFrame(() => {
          renderIssueDetail(data);
          requestAnimationFrame(() => detail?.classList.remove("is-refreshing"));
        });
      }).catch(() => {});
    } else if (activeView === "review" && activeIssueId) {
      // On review: no-op — review data doesn't change frequently
    } else {
      // On queue view: refresh Forge data only. Linear backlog is expensive and
      // causes visible churn; refresh it explicitly or after enqueue jobs finish.
      loadOverview();
    }
  });
  // Instant refresh on explicit events — always update overview regardless of view
  es.addEventListener("issue_added",   () => { if (!activeReorderInProgress) loadOverview(); });
  es.addEventListener("issue_removed", () => { loadOverview(); if (activeView === "issue") { showView("queue"); } });
  es.addEventListener("desktop_job_completed", () => {
    if (state._linearIssues !== null) loadLinearIssues();
    if (!activeReorderInProgress) loadOverview();
  });
  es.addEventListener("vm_runtime_updated", () => { loadOverview(); });
  es.addEventListener("decision_resolved", () => {
    if (activeReorderInProgress) return;
    loadOverview();
    if (activeView === "issue" && activeIssueId && activeTerminal?.issueId !== activeIssueId) {
      get(`/api/issues/${activeIssueId}`).then(data => renderIssueDetail(data)).catch(() => {});
    }
  });
  es.onerror = () => setTimeout(connectSSE, 5000);
}

// ── Escape ────────────────────────────────────────────────────────────

function esc(str) {
  if (!str) return "";
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ── Init ──────────────────────────────────────────────────────────────

// ── Mobile column tabs ───────────────────────────────────────────────────

function initQueueControls() {
  const search = $("#queue-search");
  const sort = $("#queue-sort");
  search?.addEventListener("input", () => {
    queueFilters.query = search.value.trim();
    renderOverview();
  });
  sort?.addEventListener("change", () => {
    queueFilters.sort = sort.value;
    renderOverview();
  });
  $$(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      queueFilters.filter = chip.dataset.filter;
      syncFilterControls();
      renderOverview();
    });
  });
  $("#btn-review-next")?.addEventListener("click", openNextDecision);
  syncFilterControls();
}

function showCommandPalette() {
  const hasDecision = state.decisions?.length > 0;
  const close = showModal(`
    <h3>Command palette</h3>
    <div class="command-list">
      <button class="command-item" data-command="review-next" ${hasDecision ? "" : "disabled"}>
        <span>Review next decision</span><small>${hasDecision ? `${state.decisions.length} waiting` : "Nothing awaiting you"}</small>
      </button>
      <button class="command-item" data-command="refresh"><span>Refresh dashboard</span><small>Reload Forge data</small></button>
      <button class="command-item" data-command="linear"><span>Refresh Linear backlog</span><small>Load available issues</small></button>
      <button class="command-item" data-command="add"><span>Add manual issue</span><small>Create an ad-hoc task</small></button>
      <button class="command-item" data-command="settings"><span>Open settings</span><small>Prompts and scheduler controls</small></button>
      <button class="command-item" data-command="archive"><span>Open archive</span><small>Completed and removed issues</small></button>
    </div>
    <div class="modal-actions"><button class="btn btn-ghost" id="btn-command-close">Close</button></div>
  `);
  $("#btn-command-close")?.addEventListener("click", close);
  $$(".command-item", $("#modal-content")).forEach(btn => {
    btn.addEventListener("click", async () => {
      if (btn.disabled) return;
      const command = btn.dataset.command;
      close();
      if (command === "review-next") openNextDecision();
      if (command === "refresh") loadOverview();
      if (command === "linear") loadLinearIssues(true);
      if (command === "add") showAddIssueModal();
      if (command === "settings") openSettings();
      if (command === "archive") openArchive();
    });
  });
}

function initMobileTabs() {
  const tabs    = $$("#view-queue .mobile-tab");
  const columns = $$("#view-queue .column");
  if (!tabs.length || !columns.length) return;

  function activateTab(idx) {
    tabs.forEach((t, i) => t.classList.toggle("active", i === idx));
    columns.forEach((c, i) => c.classList.toggle("mobile-active", i === idx));
  }

  // Set initial state (col 0 active)
  activateTab(0);

  tabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => activateTab(idx));
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  // Notifications setup
  _loadSeenIds();
  await loadDesktopCapabilities();
  updateNotifButton();
  $("#btn-notifications")?.addEventListener("click", handleNotifButtonClick);

  connectSSE();
  initQueueControls();
  await loadOverview();
  initMobileTabs();

  // Navigation
  $("#btn-back")?.addEventListener("click",          () => history.back());
  $("#btn-back-settings")?.addEventListener("click", () => history.back());
  $("#btn-archive")?.addEventListener("click", () => openArchive());
  $("#btn-dashboard-settings")?.addEventListener("click", () => openSettings());
  $("#btn-vm-stop")?.addEventListener("click", () => {
    showConfirmModal(
      "Stop runtime",
      "Stop all Forge-managed frontend/backend/database jobs currently running?",
      "Stop runtime", "btn-danger",
      async () => {
        const btn = $("#btn-vm-stop");
        if (btn) { btn.disabled = true; btn.textContent = "Stopping…"; }
        try {
          const result = await post("/api/vm/stop", {});
          state.vmRuntime = result.vmRuntime;
          renderVmRuntimeHeader(result.vmRuntime);
          await loadOverview();
        } finally {
          if (btn) { btn.disabled = false; btn.textContent = "Stop runtime"; }
        }
      }
    );
  });
  $("#btn-add-issue")?.addEventListener("click",     () => showAddIssueModal());
  $("#btn-refresh-linear")?.addEventListener("click",() => loadLinearIssues(true));

  // Restore view from URL hash on load
  routeFromHash();

  // Handle browser back/forward
  window.addEventListener("popstate", () => routeFromHash());

  // Supplemental poll every 12s (server SSE tick is every 30s)
  // This ensures new decisions are picked up and notifications fire within ~12s
  setInterval(() => {
    if (activeView === "queue" || activeView === "issue") loadOverview();
  }, 12000);

  // —— Keyboard shortcuts ——
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      showCommandPalette();
      return;
    }
    if (e.target.matches("input, textarea, select, [contenteditable]")) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    // r — refresh overview
    if (e.key === "r" || e.key === "R") {
      e.preventDefault();
      loadOverview();
      if (state._linearIssues !== null) loadLinearIssues();
    }

    // Escape — close modal / listen panel
    if (e.key === "Escape") {
      closeModal();
      const panel = $("#listen-panel");
      if (panel?.classList.contains("listen-open")) closeListenPanel();
    }

    // a — jump to first pending decision
    if (e.key === "a" || e.key === "A") {
      openNextDecision();
    }
  });
});
