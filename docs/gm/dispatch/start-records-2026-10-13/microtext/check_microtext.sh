#!/bin/bash
# READ-ONLY for workers.
D=/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/start-records-2026-10-13
(cd "$D/microtext" && shasum -a 256 -c GATE.sha256 --quiet) && echo "PASS microtext_gate_integrity" || { echo "FAIL microtext_gate_integrity"; exit 1; }
bash "$D/pockets/check_pockets.sh" || exit 1
node "$D/microtext/text_gate.mjs"
