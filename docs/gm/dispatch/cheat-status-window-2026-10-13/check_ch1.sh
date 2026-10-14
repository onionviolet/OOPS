#!/bin/bash
# CH1 done check. READ-ONLY for workers. Builds and serves the ui/cheats-ch1 worktree.
set -u
MAIN=/Users/weiwei/code/yet-another-idle-rpg; DS=$MAIN/docs/gm/dispatch; D=$DS/cheat-status-window-2026-10-13
export REPO=$MAIN/.claude/worktrees/ui-cheats-ch1; PORT=18322; export URL=http://127.0.0.1:$PORT/
TMPD=$(mktemp -d); cd "$REPO" || exit 3
fail=0
ok=1; (cd "$D" && shasum -a 256 -c GATE_CH1.sha256 --quiet) || ok=0
for g in panel-kit settings-pass crafting-screen vivid-proto23-flow; do (cd "$DS/$g-2026-10-13" && shasum -a 256 -c GATE.sha256 --quiet) || ok=0; done
[ $ok -eq 1 ] && echo "PASS gate_integrity" || { echo "FAIL gate_integrity"; fail=1; }
if node build.js > $TMPD/build.log 2>&1; then echo "PASS build"; else echo "FAIL build"; tail -5 $TMPD/build.log; fail=1; fi
python3 -m http.server $PORT --bind 127.0.0.1 >/dev/null 2>&1 & SRV=$!
trap 'kill $SRV 2>/dev/null; git -C "$REPO" checkout -q -- dist index.html 2>/dev/null' EXIT
for i in $(seq 1 30); do curl -sf "${URL}index.html" >/dev/null && break; sleep 0.2; done
curl -sf "${URL}index.html" >/dev/null || { echo "BROKEN server"; exit 3; }
node "$D/checks/ch1_gate.cjs"; s=$?; [ $s -eq 3 ] && exit 3; [ $s -ne 0 ] && fail=1
node "$D/checks/c0_gate.cjs" > $TMPD/c0.log 2>&1; s=$?; [ $s -eq 3 ] && { cat $TMPD/c0.log; exit 3; }
[ $s -eq 0 ] && echo "PASS c0_regression" || { echo "FAIL c0_regression"; grep '^FAIL' $TMPD/c0.log | cut -c1-200; fail=1; }
for pair in "panelkit:$DS/panel-kit-2026-10-13/checks/gate.cjs" "settings:$DS/settings-pass-2026-10-13/checks/gate.cjs" "crafting:$DS/crafting-screen-2026-10-13/checks/gate.cjs" "vivid:$DS/vivid-proto23-flow-2026-10-13/checks/browser.cjs"; do n=${pair%%:*}; f=${pair#*:}
  node "$f" > $TMPD/$n.log 2>&1; s=$?; [ $s -eq 3 ] && { cat $TMPD/$n.log; exit 3; }
  [ $s -eq 0 ] && echo "PASS ${n}_regression $(grep -c '^PASS' $TMPD/$n.log) items" || { echo "FAIL ${n}_regression"; grep '^FAIL' $TMPD/$n.log | cut -c1-200; fail=1; }
done
exit $fail
