#!/bin/bash
# Done check for GOAL.md. READ-ONLY for workers. Exit 0 pass, 1 fail, 3 broken tooling.
set -u
WT=/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg
D=/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/start-records-2026-10-13
PORT=18341; export URL=http://127.0.0.1:$PORT/
TMPD=$(mktemp -d); fail=0
(cd "$D" && shasum -a 256 -c GATE.sha256 --quiet) && echo "PASS gate_integrity" || { echo "FAIL gate_integrity"; fail=1; }
cd "$WT" || exit 3
if node build.js > $TMPD/build.log 2>&1; then echo "PASS build"; else echo "FAIL build"; tail -5 $TMPD/build.log; fail=1; fi
npm test > $TMPD/npm.log 2>&1
NF=$(grep -E '^# fail' $TMPD/npm.log | awk '{print $3}')
[ "${NF:-x}" = "0" ] && echo "PASS npm_test $(grep -E '^# (pass|fail)' $TMPD/npm.log | tr '\n' ' ')" || { echo "FAIL npm_test"; grep -E '^not ok' $TMPD/npm.log | head -5; fail=1; }
[ -f tests/start_records.test.js ] && echo "PASS unit_file" || { echo "FAIL unit_file missing"; fail=1; }
python3 -m http.server $PORT --bind 127.0.0.1 >/dev/null 2>&1 & SRV=$!
trap 'kill $SRV 2>/dev/null' EXIT
for i in $(seq 1 30); do curl -sf "${URL}index.html" >/dev/null && break; sleep 0.2; done
curl -sf "${URL}index.html" >/dev/null || { echo "BROKEN server"; exit 3; }
node "$D/checks/gate.cjs"; s=$?; [ $s -eq 3 ] && exit 3; [ $s -ne 0 ] && fail=1
exit $fail
