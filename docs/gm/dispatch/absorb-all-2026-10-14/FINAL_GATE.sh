#!/bin/bash
# Absorb-all final gate: one run over a candidate worktree.
# Usage: FINAL_GATE.sh <candidate worktree> [old-client commit, default codex/gameplay-foundations]
# Exit 0 all pass, 1 any fail, 3 broken tooling. Writes logs and SUMMARY.txt to $OUT.
set -u
ROOT=${1:?candidate worktree}; OLD=${2:-codex/gameplay-foundations}
MAIN=/Users/weiwei/code/yet-another-idle-rpg
D=docs/gm/dispatch/absorb-all-2026-10-14
OUT=${OUT:-$(mktemp -d /tmp/absorb-final-gate.XXXX)}; mkdir -p "$OUT"
OLDWT="$OUT/oldclient"; fail=0; PIDS=()
log(){ echo "$*" | tee -a "$OUT/SUMMARY.txt"; }
cleanup(){ for p in "${PIDS[@]:-}"; do kill "$p" 2>/dev/null; done; rm -f "$ROOT/.proof-old"
  [ -L "$ROOT/private_packs" ] && rm "$ROOT/private_packs"
  git -C "$MAIN" worktree remove --force "$OLDWT" 2>/dev/null; git -C "$ROOT" checkout -q -- docs dist index.html 2>/dev/null; }
trap cleanup EXIT
cd "$ROOT" || exit 3
[ -e node_modules ] || ln -s $MAIN/node_modules node_modules

# 1. Build and full suite.
node build.js > "$OUT/build.log" 2>&1 && log "PASS build" || { log "FAIL build"; exit 1; }
npm test -- --test-concurrency=2 > "$OUT/test.log" 2>&1; t=$?
log "$([ $t = 0 ] && echo PASS || echo FAIL) npm test $(grep -E '^# (pass|fail) ' "$OUT/test.log" | tr '\n' ' ')"; [ $t = 0 ] || fail=1

# 2. Old client (pre-candidate main) for legacy-save checks, served at .proof-old/.
git -C $MAIN worktree add -q --detach "$OLDWT" "$OLD" && ln -s $MAIN/node_modules "$OLDWT/node_modules" \
  && (cd "$OLDWT" && node build.js >/dev/null 2>&1) && ln -sfn "$OLDWT" .proof-old && log "INFO old client $(git -C "$OLDWT" rev-parse --short HEAD)" \
  || { log "BROKEN old client"; exit 3; }
# Private packs: real manifest and installed candidate, read-only link for the run.
if [ ! -L private_packs ] && [ -z "$(ls -A private_packs 2>/dev/null)" ]; then rmdir private_packs 2>/dev/null; ln -s $MAIN/private_packs private_packs; fi
# Same packs for the old client, so legacy comparisons see identical content.
rmdir "$OLDWT/private_packs" 2>/dev/null; [ -e "$OLDWT/private_packs" ] || ln -s $MAIN/private_packs "$OLDWT/private_packs"

# 3. Browser checks. Each gets a port no earlier run used, so origin storage is fresh.
serve(){ lsof -tiTCP:$1 -sTCP:LISTEN | xargs kill 2>/dev/null; python3 -m http.server $1 --bind 127.0.0.1 >/dev/null 2>&1 & PIDS+=($!)
  for i in $(seq 30); do curl -sf "http://127.0.0.1:$1/index.html" >/dev/null && return 0; sleep .2; done; return 1; }
check(){ name=$1 port=$2; shift 2; serve $port || { log "BROKEN serve $name"; fail=1; return; }
  URL=http://127.0.0.1:$port/ YAIRPG_PROOF_URL=http://127.0.0.1:$port/ YAIRPG_PROOF_DIR="$OUT/proof-${name%%-*}" timeout 1200 "$@" > "$OUT/$name.log" 2>&1; s=$?
  if [ $s = 0 ] && ! grep -q '^FAIL' "$OUT/$name.log"; then log "PASS $name"; else log "FAIL $name (exit $s, $OUT/$name.log)"; fail=1; fi; }
# Independent groups run in parallel; checks inside a group share a save and run in order.
# A group's result lines go to its own file so parallel output does not interleave.
MAXPAR=${MAXPAR:-8}
group(){ while [ "$(jobs -rp | wc -l)" -ge "$MAXPAR" ]; do sleep 1; done; g=$1; shift; printf '%s\n' "$@" > "$OUT/group-$g.cmds"; ( fail=0; for c in "$@"; do eval "check $c"; done; echo $fail > "$OUT/group-$g.rc" ) > "$OUT/group-$g.out" 2>&1 & }
# A group that fails under parallel load reruns once alone; results say "(retry)" so flakiness stays visible.
retry(){ g=$1; ( fail=0; while IFS= read -r c; do eval "check $c"; done < "$OUT/group-$g.cmds"; echo $fail > "$OUT/group-$g.rc" ) > "$OUT/group-$g.retry" 2>&1
  sed 's/^PASS \(.*\)/PASS \1 (retry)/' "$OUT/group-$g.retry" >> "$OUT/group-$g.out"; }
group workshop "workshop 18701 env YAIRPG_PROOF_URL=http://127.0.0.1:18701/?test_hooks=1 node scripts/systems_workshop_browser.cjs" "workshop-bounds 18701 env YAIRPG_PROOF_URL=http://127.0.0.1:18701/?test_hooks=1 node scripts/systems_workshop_boundaries.cjs" "workshop-persist 18701 env YAIRPG_PROOF_URL=http://127.0.0.1:18701/?test_hooks=1 node scripts/systems_workshop_persistence.cjs" "workshop-legacy 18701 node scripts/systems_workshop_legacy.cjs"
group upstream "upstream-dev 18702 node scripts/upstream_dev_browser.cjs"
group resurvey "fork-resurvey 18703 node $D/checks/fork-resurvey/browser.cjs"
group fort "fork-fort 18704 env YAIRPG_PROOF_URL=http://127.0.0.1:18704/?test_hooks=1 node $D/checks/fork-fort/browser.cjs" "fork-fort-restore 18704 node $D/checks/fork-fort/restore.cjs"
group reveal "reveal-chain 18705 node $D/checks/reveal-browser.cjs"
group life "life-loops 18706 node $D/checks/p23-life-browser.cjs" "life-loops-extra 18706 node $D/checks/p23-life-extra.cjs"
group polish "ui-polish 18901 node docs/gm/dispatch/p23-ui-polish-2026-10-14/browser.cjs"
group wider "air-wider-p1 18840 node docs/gm/air-wider/p1-browser.cjs" "air-wider-p2 18840 node docs/gm/air-wider/p2-browser.cjs" "air-wider-p3 18840 node docs/gm/air-wider/p3-browser.cjs" "air-wider-p4 18840 node docs/gm/air-wider/p4-browser.cjs"
group stepper "sim-stepper-equivalence 18950 node scripts/simulation_stepper_browser.cjs"
group reach "reach-fixes 18971 node $D/checks/reach-fixes/browser.cjs"
p=18910; for f in $D/checks/p23-host-joins/*.cjs; do [ -e "$f" ] || continue; p=$((p+1)); group "p00-$p" "p00-$(basename "$f" .cjs) $p node $f"; done
wait
for r in "$OUT"/group-*.rc; do g=$(basename "$r" .rc); g=${g#group-}; [ "$(cat "$r")" = 0 ] || { log "RETRY group $g alone"; retry "$g"; }; done
for r in "$OUT"/group-*.rc; do [ "$(cat "$r")" = 0 ] || fail=1; done
cat "$OUT"/group-*.out | grep -E '^(PASS|FAIL|BROKEN)' | sort | uniq > "$OUT/CHECKS.txt"

log "RESULT $([ $fail = 0 ] && echo PASS || echo FAIL) (logs: $OUT)"; exit $fail
