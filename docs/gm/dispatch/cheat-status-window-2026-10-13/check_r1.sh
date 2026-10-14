#!/bin/bash
# R1 gate and unchanged frozen regression gates, with evidence isolated to runs/r1.
set -u
MAIN=/Users/weiwei/code/yet-another-idle-rpg; DS=$MAIN/docs/gm/dispatch; D=$DS/cheat-status-window-2026-10-13
export REPO=$MAIN/.claude/worktrees/ui-cheats-r1; PORT=18451; export URL=http://127.0.0.1:$PORT/
RUN=$D/runs/r1; mkdir -p "$RUN"; cd "$REPO" || exit 3
if lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; then echo 'BROKEN port 18451 occupied'; exit 3; fi
# Preserve even preexisting generated-file edits, rather than checkout on exit.
TMPD=$(mktemp -d); cp -R dist "$TMPD/dist"; cp index.html "$TMPD/index.html"
SRV=''
trap 'if [ -n "$SRV" ]; then kill "$SRV" 2>/dev/null; wait "$SRV" 2>/dev/null; fi; cp -R "$TMPD/dist/." "$REPO/dist/"; cp "$TMPD/index.html" "$REPO/index.html"' EXIT
ok=1
for g in GATE_R1.sha256 GATE_CH1.sha256 GATE_C0.sha256; do (cd "$D" && shasum -a 256 -c "$g" --quiet) || ok=0; done
for g in panel-kit settings-pass crafting-screen vivid-proto23-flow; do (cd "$DS/$g-2026-10-13" && shasum -a 256 -c GATE.sha256 --quiet) || ok=0; done
[ $ok -eq 1 ] && echo 'PASS gate_integrity' || { echo 'BROKEN gate_integrity'; exit 3; }
if node build.js > "$RUN/build.log" 2>&1; then echo 'PASS build'; else echo 'BROKEN build'; tail -5 "$RUN/build.log"; exit 3; fi
python3 -m http.server $PORT --bind 127.0.0.1 > "$RUN/server.log" 2>&1 & SRV=$!
for i in $(seq 1 30); do curl -sf "${URL}index.html" >/dev/null && break; sleep 0.2; done
curl -sf "${URL}index.html" >/dev/null || { echo 'BROKEN server'; exit 3; }
fail=0
node "$D/checks/r1_gate.cjs"; s=$?; [ $s -eq 3 ] && exit 3; [ $s -ne 0 ] && fail=1
node "$D/checks/ch1_gate.cjs" > "$RUN/ch1.log" 2>&1; s=$?; cat "$RUN/ch1.log"; [ $s -eq 3 ] && exit 3; [ $s -ne 0 ] && fail=1
node "$D/checks/c0_gate.cjs" > "$RUN/c0.log" 2>&1; s=$?; [ $s -eq 3 ] && { cat "$RUN/c0.log"; exit 3; }
[ $s -eq 0 ] && echo 'PASS c0_regression' || { echo 'FAIL c0_regression'; grep '^FAIL' "$RUN/c0.log" | cut -c1-200; fail=1; }
# These frozen scripts write evidence relative to __dirname. Run byte-identical
# copies under the authorized scratch tree so other workers' evidence is untouched.
for g in panel-kit settings-pass crafting-screen vivid-proto23-flow; do mkdir -p "$RUN/regressions/$g-2026-10-13"; cp -R "$DS/$g-2026-10-13/checks" "$RUN/regressions/$g-2026-10-13/"; done
for pair in 'panelkit:panel-kit:gate.cjs' 'settings:settings-pass:gate.cjs' 'crafting:crafting-screen:gate.cjs' 'vivid:vivid-proto23-flow:browser.cjs'; do n=${pair%%:*}; rest=${pair#*:}; g=${rest%%:*}; f=${rest#*:}
  node "$RUN/regressions/$g-2026-10-13/checks/$f" > "$RUN/$n.log" 2>&1; s=$?; [ $s -eq 3 ] && { cat "$RUN/$n.log"; exit 3; }
  [ $s -eq 0 ] && echo "PASS ${n}_regression $(grep -c '^PASS' "$RUN/$n.log") items" || { echo "FAIL ${n}_regression"; grep '^FAIL' "$RUN/$n.log" | cut -c1-200; fail=1; }
done
exit $fail
