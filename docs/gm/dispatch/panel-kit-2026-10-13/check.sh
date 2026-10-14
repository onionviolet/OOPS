#!/bin/bash
# Done check for GOAL.md. READ-ONLY for workers. Exit 0 pass, 1 fail, 2 blocked, 3 broken tooling.
set -u
REPO=/Users/weiwei/code/yet-another-idle-rpg; DS=$REPO/docs/gm/dispatch
D=$DS/panel-kit-2026-10-13; S=$DS/settings-pass-2026-10-13/checks; V=$DS/vivid-proto23-flow-2026-10-13/checks; CR=$DS/crafting-screen-2026-10-13/checks
PORT=18311; export URL=http://127.0.0.1:$PORT/
cd "$REPO" || exit 3
fail=0
ok=1; for g in panel-kit-2026-10-13 settings-pass-2026-10-13 crafting-screen-2026-10-13 vivid-proto23-flow-2026-10-13; do (cd "$DS/$g" && shasum -a 256 -c GATE.sha256 --quiet) || ok=0; done
[ $ok -eq 1 ] && echo "PASS gate_integrity" || { echo "FAIL gate_integrity"; fail=1; }
if node build.js > /tmp/pk_build.log 2>&1; then echo "PASS build"; else echo "FAIL build"; tail -5 /tmp/pk_build.log; fail=1; fi
python3 -m http.server $PORT --bind 127.0.0.1 >/dev/null 2>&1 & SRV=$!
trap 'kill $SRV 2>/dev/null' EXIT
for i in $(seq 1 30); do curl -sf "${URL}index.html" >/dev/null && break; sleep 0.2; done
curl -sf "${URL}index.html" >/dev/null || { echo "BROKEN server"; exit 3; }
[ "$(curl -s ${URL}dist/bundle.js | shasum -a 256 | cut -c1-64)" = "$(shasum -a 256 dist/bundle.js | cut -c1-64)" ] && echo "PASS served_parity" || { echo "FAIL served_parity"; fail=1; }
node "$D/checks/gate.cjs"; s=$?; [ $s -eq 3 ] && exit 3; [ $s -ne 0 ] && fail=1
for pair in "settings:$S/gate.cjs" "crafting:$CR/gate.cjs" "vivid:$V/browser.cjs"; do n=${pair%%:*}; f=${pair#*:}
  node "$f" > /tmp/pk_$n.log 2>&1; s=$?; [ $s -eq 3 ] && { cat /tmp/pk_$n.log; exit 3; }
  [ $s -eq 0 ] && echo "PASS ${n}_regression $(grep -c '^PASS' /tmp/pk_$n.log) items" || { echo "FAIL ${n}_regression"; grep '^FAIL' /tmp/pk_$n.log | cut -c1-200; fail=1; }
done
node "$V/unit.mjs" >/dev/null || { echo "FAIL rarity_unit_regression"; fail=1; }
npm test > /tmp/pk_npm.log 2>&1
NEW=$(grep -E '^not ok' /tmp/pk_npm.log | sed -E 's/^not ok [0-9]+ - //' | grep -vxF -f "$V/BASELINE_FAILURES.txt" || true)
[ -z "$NEW" ] && echo "PASS npm_test $(grep -E '^# (pass|fail)' /tmp/pk_npm.log | tr '\n' ' ')" || { echo "FAIL npm_test new failures:"; echo "$NEW" | head -5; fail=1; }
exit $fail
