#!/bin/bash
# READ-ONLY for workers.
D=/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/away-ledger-2026-10-14; WT=/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg
(cd "$D" && shasum -a 256 -c GATE.sha256 --quiet) && echo "PASS gate_integrity" || { echo "FAIL gate_integrity"; exit 1; }
cd "$WT" || exit 3; TMPD=$(mktemp -d); fail=0
npm test > $TMPD/npm.log 2>&1; NF=$(grep -E '^# fail' $TMPD/npm.log | awk '{print $3}')
[ "${NF:-x}" = "0" ] && echo "PASS npm_test $(grep -E '^# (pass|fail)' $TMPD/npm.log | tr '\n' ' ')" || { echo "FAIL npm_test"; fail=1; }
[ -f tests/away_ledger.test.js ] && echo "PASS unit_file" || { echo "FAIL unit_file"; fail=1; }
node "$D/checks/gate.mjs" || fail=1
exit $fail
