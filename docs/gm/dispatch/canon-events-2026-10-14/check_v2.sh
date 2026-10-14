#!/bin/bash
# READ-ONLY for workers. v2 gate plus all earlier gates as regression.
D=/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/canon-events-2026-10-14
(cd "$D" && shasum -a 256 -c GATE.sha256 --quiet) && echo "PASS gate_integrity_v2" || { echo "FAIL gate_integrity_v2"; exit 1; }
bash "$D/check_overrides.sh" || exit 1
node "$D/checks/v2_gate.mjs"
