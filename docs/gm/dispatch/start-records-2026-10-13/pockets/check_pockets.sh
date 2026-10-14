#!/bin/bash
# READ-ONLY for workers. Pockets gate plus the full start-records check as regression.
D=/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/start-records-2026-10-13
(cd "$D/pockets" && shasum -a 256 -c GATE.sha256 --quiet) && echo "PASS pockets_gate_integrity" || { echo "FAIL pockets_gate_integrity"; exit 1; }
bash "$D/check.sh" || exit 1
cd /Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg && node build.js >/dev/null 2>&1 || { echo "FAIL build"; exit 1; }
python3 -m http.server 18341 --bind 127.0.0.1 >/dev/null 2>&1 & SRV=$!; trap 'kill $SRV 2>/dev/null' EXIT
for i in $(seq 1 30); do curl -sf http://127.0.0.1:18341/index.html >/dev/null && break; sleep 0.2; done
URL=http://127.0.0.1:18341/ node "$D/pockets/pockets_gate.mjs"
