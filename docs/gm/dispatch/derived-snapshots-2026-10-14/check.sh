#!/bin/bash
# Done check. READ-ONLY for workers. Exit 0 pass, 1 fail.
WT=/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg
D=/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/derived-snapshots-2026-10-14
TMPD=$(mktemp -d); fail=0
(cd "$D" && shasum -a 256 -c GATE.sha256 --quiet) && echo "PASS gate_integrity" || { echo "FAIL gate_integrity"; fail=1; }
cd "$WT" || exit 3
npm test > $TMPD/npm.log 2>&1; NF=$(grep -E '^# fail' $TMPD/npm.log | awk '{print $3}')
[ "${NF:-x}" = "0" ] && echo "PASS npm_test $(grep -E '^# (pass|fail)' $TMPD/npm.log | tr '\n' ' ')" || { echo "FAIL npm_test"; grep -E '^not ok' $TMPD/npm.log | head -5; fail=1; }
[ -f tests/anchor_snapshots.test.js ] && echo "PASS unit_file" || { echo "FAIL unit_file"; fail=1; }
node "$D/checks/gate.mjs" || fail=1
grep -qE "from ['\"]\./(main|ui|display)" src/anchor_snapshots.js && { echo "FAIL not_pure imports"; fail=1; } || echo "PASS pure_imports"
exit $fail
