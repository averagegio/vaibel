#!/usr/bin/env bash
# One-liner from repo root (Termius / WSL):
#   bash scripts/phone-push.sh
#   bash scripts/phone-push.sh "fix landing intro on phone"
#
# Commits all changes, pushes current branch, prints phone LAN URL for port 3002.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PORT="${PHONE_PORT:-3002}"
MSG="${1:-phone: update}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "error: not a git repository ($ROOT)" >&2
  exit 1
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"

echo "==> vaibel @ $ROOT (branch: $BRANCH)"
git status -sb

git add -A
if git diff --staged --quiet; then
  echo "==> nothing to commit"
else
  git commit -m "$MSG"
fi

echo "==> pushing to origin/$BRANCH"
git push origin "$BRANCH"

node scripts/print-lan-url.mjs "$PORT"

echo ""
echo "Live site: Vercel redeploys after this push (if branch is connected)."
echo "Local phone preview on this PC:  npm run preview:phone2"
echo "Fast dev while editing:          npm run dev:phone2"
