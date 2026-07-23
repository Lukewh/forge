# workspace-run

Forge agents use `scripts/workspace-run` for project runtime commands (package-manager scripts, tests, lint, typecheck, app scripts, project fixers). By default these commands run locally in the configured worktree. SSH mode is optional for environments that still need it.

## Usage

```bash
scripts/workspace-run <worktree-path> -- <command...>
scripts/workspace-run <worktree-path> "<command>"
```

If `workspace-run.config.json` is missing, the runner defaults to local mode.

## Worktree-only execution

Runtime commands always run from the issue worktree path passed to `workspace-run`.

For your-repo issues this should be the main issue folder under Projects, for example:

```bash
$HOME/Projects/worktrees.lwh-TEAM-5300-slug
```

In SSH mode, Forge translates the configured local path prefix to the remote path prefix and then runs `cd <translated worktree> && <command>`. No separate checkout is used.

Keep these limits in mind:

- Commands in the same worktree can still interfere with each other.
- Shared services such as databases, Redis, ports, or global test schemas can still contend.
- Host CPU/RAM/disk IO are the practical ceiling.
- Git operations should remain scoped to each worktree/issue.

## Config

Create `workspace-run.config.json` in the Forge extension directory. It is intentionally ignored by git.

### Local

```json
{
  "mode": "local"
}
```

### SSH (optional)

```json
{
  "mode": "ssh",
  "ssh": {
    "target": "my-vm",
    "pathMappings": [
      {
        "localPrefix": "/path/to/local/Projects",
        "remotePrefix": "/path/to/remote/Projects"
      }
    ]
  }
}
```
