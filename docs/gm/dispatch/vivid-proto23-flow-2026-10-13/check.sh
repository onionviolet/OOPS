#!/bin/bash
# Done check for GOAL.md. READ-ONLY for workers. Exit 0 pass, 1 fail, 2 blocked, 3 broken tooling.
set -u
REPO=/Users/weiwei/code/yet-another-idle-rpg; D=$REPO/docs/gm/dispatch/vivid-proto23-flow-2026-10-13; C=$D/checks
PORT=18251; export URL=http://127.0.0.1:$PORT/
cd "$REPO" || exit 3
command -v node >/dev/null || { echo "BROKEN node missing"; exit 3; }
fail=0

# 0. Gate integrity: checks and this script must match the frozen manifest.
if ! (cd "$D" && shasum -a 256 -c "$D/GATE.sha256" --quiet); then echo "FAIL gate_integrity check files changed (see GATE.sha256)"; fail=1; else echo "PASS gate_integrity"; fi

# 1. Rebuild from current source.
if node build.js > /tmp/vp_build.log 2>&1; then echo "PASS build"; else echo "FAIL build (tail below)"; tail -5 /tmp/vp_build.log; fail=1; fi

# 2. Serve the repo on a private port, prove served bundle == built bundle.
python3 -m http.server $PORT --bind 127.0.0.1 >/dev/null 2>&1 & SRV=$!
trap 'kill $SRV 2>/dev/null' EXIT
for i in $(seq 1 30); do curl -sf "${URL}index.html" >/dev/null && break; sleep 0.2; done
curl -sf "${URL}index.html" >/dev/null || { echo "BROKEN server did not start on $PORT"; exit 3; }
if [ "$(curl -s ${URL}dist/bundle.js | shasum -a 256 | cut -c1-64)" = "$(shasum -a 256 dist/bundle.js | cut -c1-64)" ]; then echo "PASS served_parity"; else echo "FAIL served_parity"; fail=1; fi

# 3. Unit and ledger checks.
node "$C/unit.mjs" || fail=1
node "$C/ledger.mjs" || fail=1

# 4. Browser checks (fresh origins).
node "$C/browser.cjs"; s=$?; [ $s -eq 3 ] && exit 3; [ $s -ne 0 ] && fail=1

# 5. Shared suite: no new failures beyond the recorded baseline.
npm test > /tmp/vp_npm.log 2>&1
NEW=$(grep -E '^not ok' /tmp/vp_npm.log | sed -E 's/^not ok [0-9]+ - //' | grep -vxF -f "$C/BASELINE_FAILURES.txt" || true)
if [ -z "$NEW" ]; then echo "PASS npm_test $(grep -E '^# (pass|fail)' /tmp/vp_npm.log | tr '\n' ' ')"; else echo "FAIL npm_test new failures:"; echo "$NEW" | head -5; fail=1; fi

exit $fail
