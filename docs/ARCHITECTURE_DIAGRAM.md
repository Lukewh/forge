# Forge Service Architecture

```mermaid
flowchart LR
  %% External systems
  Linear[Linear]
  GitHub[GitHub]
  Pi[pi SDK / LLM Providers]

  %% macOS host / user machine
  subgraph Mac[macOS host / user machine]
    direction TB
    User[User]
    Browser[Browser / Dashboard UI]
    Desktop[Forge Desktop App]
    LocalCLI[Local CLIs<br/>linear / gh]
    PiExt[optional pi /forge extension]

    User --> Browser
    User --> Desktop
    User --> PiExt
    Desktop --> LocalCLI
  end

  %% VM backend
  subgraph VM[Orb VM / backend runtime]
    Dashboard[Forge Dashboard Server\nExpress REST + SSE\n:3142]
    Scheduler[Scheduler]
    DB[(forge.db SQLite)]
    Setup[setup.js]
    AgentRunner[agent-runner.js]
    Watcher[watcher.js]
    GitCLI[VM git / gh]
    Projects["projects/&lt;issue&gt;/<br/>plan, logs, verdicts"]
    Worktrees[Tarmac / target repo worktrees]
  end

  %% Dashboard access
  Browser <-->|REST + SSE| Dashboard
  Desktop <-->|REST| Dashboard
  PiExt <-->|REST| Dashboard

  %% State storage
  Dashboard <-->|read/write issues, decisions, settings| DB
  Scheduler <-->|poll schedulable issues\nlock/unlock runs| DB
  Setup <-->|issue setup state| DB
  AgentRunner <-->|state transitions\nactivity, decisions, runs| DB
  Watcher <-->|PR status/state updates| DB

  %% Runtime files
  Setup --> Projects
  AgentRunner --> Projects
  Watcher --> Projects
  Setup --> Worktrees
  AgentRunner --> Worktrees
  Watcher --> Worktrees

  %% Process orchestration
  Dashboard -->|start/stop scheduler| Scheduler
  Scheduler -->|spawn SETTING_UP| Setup
  Scheduler -->|spawn planner/coder/reviewer/etc.| AgentRunner
  Scheduler -->|spawn PR watcher| Watcher

  %% LLM execution
  AgentRunner <-->|prompts, tool sessions| Pi

  %% GitHub integration paths
  Watcher -->|PR/check/review polling| GitCLI
  AgentRunner -->|commit/push/create PR| GitCLI
  GitCLI <-->|gh / git network calls| GitHub

  Desktop -->|claim desktop jobs| Dashboard
  Dashboard -->|linear.fetchIssue / syncState<br/>gh jobs if desktop mode| Desktop
  LocalCLI <-->|linear CLI| Linear
  LocalCLI <-->|gh CLI| GitHub

  %% Server-side Linear mode
  Dashboard -. optional server-side linear CLI .-> Linear
  AgentRunner -. optional sync Linear state .-> Linear
```

## Main interactions

```mermaid
sequenceDiagram
  participant U as User / Browser
  participant D as Dashboard Server
  participant DB as forge.db
  participant S as Scheduler
  participant A as Agent Runner
  participant P as pi SDK / LLM
  participant WT as Worktree
  participant GH as GitHub
  participant Desk as Desktop App
  participant L as Linear

  U->>D: enqueue issue / approve decision / retry
  D->>DB: write issue state + decision
  S->>DB: poll schedulable issues
  S->>A: spawn agent for current state
  A->>DB: lock issue + create run
  A->>WT: inspect/edit/test/commit code
  A->>P: run planner/coder/reviewer/git-agent prompt
  P-->>A: agent output/tool activity
  A->>DB: transition state, write logs/verdicts
  D-->>U: SSE update

  alt PR creation / watching
    A->>GH: git push / gh pr create
    S->>A: spawn watcher or git-agent
    A->>GH: poll PR/reviews/checks
    A->>DB: update PR stack + issue state
  end

  alt Linear via desktop bridge
    D->>Desk: desktop job queued
    Desk->>L: linear CLI fetch/sync
    Desk-->>D: job result
    D->>DB: cache/update Linear data
  else server-side Linear enabled
    D->>L: linear CLI fetch/sync
    D->>DB: update Linear data
  end
```

## Responsibilities

| Component | Runs where | Responsibility |
|---|---|---|
| Dashboard UI | Browser on macOS | Human control plane: queue, approve, retry, inspect logs/diffs. |
| Desktop app | macOS | Native wrapper and bridge for local `linear`/`gh` auth when VM should not own those credentials. |
| Dashboard server | VM | REST/SSE API, DB owner, settings, decisions, issue actions, desktop job API. |
| SQLite DB | VM | Source of truth for issue state, decisions, settings, runs, PR stack. |
| Scheduler | VM | Polls DB and spawns deterministic scripts/agents for schedulable states. |
| setup.js | VM | Creates project files and worktrees, then moves issue to planning. |
| agent-runner.js | VM | Runs planner/coder/reviewer/git/fixer agents via pi SDK; performs state transitions. |
| watcher.js | VM | Polls GitHub PR status, checks, reviews, merge queue, and marks issues done or needing fixes. |
| Worktrees | VM-mounted/macOS paths | Target repository checkout where agents edit, test, commit, and push code. |
| GitHub | External | PRs, branches, reviews, checks, merge state. |
| Linear | External | Issue source and state sync. |
