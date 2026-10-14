#!/bin/bash
# Done check for GOAL.md. READ-ONLY for workers. Exit 0 pass, 1 fail, 2 blocked, 3 broken tooling.
set -u
REPO=/Users/weiwei/code/yet-another-idle-rpg; D=$REPO/docs/gm/dispatch/crafting-screen-2026-10-13; C=$D/checks
V=$REPO/docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks
PORT=18291; export URL=http://127.0.0.1:$PORT/
TMPD=$(mktemp -d); cd "$REPO" || exit 3
fail=0
if (cd "$D" && shasum -a 256 -c GATE.sha256 --quiet) && (cd "$REPO/docs/gm/dispatch/vivid-proto23-flow-2026-10-13" && shasum -a 256 -c GATE.sha256 --quiet); then echo "PASS gate_integrity"; else echo "FAIL gate_integrity"; fail=1; fi
if node build.js > $TMPD/cs_build.log 2>&1; then echo "PASS build"; else echo "FAIL build"; tail -5 $TMPD/cs_build.log; fail=1; fi
python3 -m http.server $PORT --bind 127.0.0.1 >/dev/null 2>&1 & SRV=$!
trap 'kill $SRV 2>/dev/null' EXIT
for i in $(seq 1 30); do curl -sf "${URL}index.html" >/dev/null && break; sleep 0.2; done
curl -sf "${URL}index.html" >/dev/null || { echo "BROKEN server"; exit 3; }
if [ "$(curl -s ${URL}dist/bundle.js | shasum -a 256 | cut -c1-64)" = "$(shasum -a 256 dist/bundle.js | cut -c1-64)" ]; then echo "PASS served_parity"; else echo "FAIL served_parity"; fail=1; fi
node "$C/gate.cjs"; s=$?; [ $s -eq 3 ] && exit 3; [ $s -ne 0 ] && fail=1
# Regression: the finished Vivid/Proto23 goal must still pass.
node "$V/browser.cjs" > $TMPD/cs_vivid.log 2>&1; s=$?; [ $s -eq 3 ] && { cat $TMPD/cs_vivid.log; exit 3; }
if [ $s -eq 0 ]; then echo "PASS vivid_regression $(grep -c '^PASS' $TMPD/cs_vivid.log) items"; else echo "FAIL vivid_regression"; grep '^FAIL' $TMPD/cs_vivid.log | cut -c1-200; fail=1; fi
node "$V/unit.mjs" >/dev/null || { echo "FAIL rarity_unit_regression"; fail=1; }
npm test > $TMPD/cs_npm.log 2>&1
NEW=$(grep -E '^not ok' $TMPD/cs_npm.log | sed -E 's/^not ok [0-9]+ - //' | grep -vxF -f "$V/BASELINE_FAILURES.txt" || true)
if [ -z "$NEW" ]; then echo "PASS npm_test $(grep -E '^# (pass|fail)' $TMPD/cs_npm.log | tr '\n' ' ')"; else echo "FAIL npm_test new failures:"; echo "$NEW" | head -5; fail=1; fi
exit $fail
