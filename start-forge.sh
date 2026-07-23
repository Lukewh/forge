#!/usr/bin/env bash
# Forge — self-restarting launcher for the dashboard server
# Restarts automatically on crash with a short backoff.
# Usage: ./start-forge.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER="$SCRIPT_DIR/dashboard/server.js"
LOG="$SCRIPT_DIR/dashboard/server-crash.log"
PIDFILE="$SCRIPT_DIR/dashboard/server.pid"

# Enforce single instance — kill any previous start-forge.sh + server
if [ -f "$PIDFILE" ]; then
  OLD_PID=$(cat "$PIDFILE" 2>/dev/null)
  if [ -n "$OLD_PID" ] && kill -0 "$OLD_PID" 2>/dev/null; then
    echo "[forge] Stopping previous instance (PID $OLD_PID)..."
    kill "$OLD_PID" 2>/dev/null
    sleep 1
  fi
fi

# Also kill any stale server processes holding the port
lsof -ti :3142 | xargs kill -9 2>/dev/null
sleep 1

echo $$ > "$PIDFILE"
echo "[forge] Starting dashboard server (PID $$, auto-restart enabled)"

while true; do
  node --max-old-space-size=512 "$SERVER"
  EXIT=$?
  # EADDRINUSE means another instance grabbed the port — just exit cleanly
  if grep -q "EADDRINUSE" "$LOG" 2>/dev/null; then
    echo "[forge] Port 3142 already in use — exiting"
    rm -f "$PIDFILE"
    exit 1
  fi
  echo "[$(date -u +%FT%TZ)] [forge] Server exited (code $EXIT) — restarting in 3s..." | tee -a "$LOG"
  sleep 3
done
