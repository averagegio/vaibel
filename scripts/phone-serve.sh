#!/usr/bin/env bash
# Start production-like server for phone testing (port 3002):
#   bash scripts/phone-serve.sh

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

exec npm run preview:phone2
