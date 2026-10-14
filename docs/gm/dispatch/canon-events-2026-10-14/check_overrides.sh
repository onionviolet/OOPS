#!/bin/bash
# READ-ONLY for workers.
D=/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/canon-events-2026-10-14
(cd "$D" && shasum -a 256 -c GATE.sha256 --quiet) && echo "PASS gate_integrity" || { echo "FAIL gate_integrity"; exit 1; }
bash /Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/derived-snapshots-2026-10-14/check.sh || exit 1
node "$D/checks/overrides_gate.mjs"
