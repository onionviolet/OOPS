#!/bin/bash
# PROPOSED replacement runner pattern for FINAL_GATE.sh (engine-perf harness lane, 2026-10-14).
# The coordinator owns FINAL_GATE.sh; this file changes only how servers start and stop.
# Fixes audit T5 (docs/research/BROWSER_TESTING_AND_ENGINE_PERF_AUDIT_2026-10-14.md):
# - PIDS+=() ran inside `( ... ) &` group subshells, so the EXIT trap never saw them and
#   servers outlived the gate (reparented to launchd). Every server PID now goes to
#   $OUT/server.pids, which the trap reads; INT/TERM also stop running groups.
# - `lsof -ti:$port | xargs kill` killed other runs' servers on the same fixed port.
#   Servers now bind port 0 and report the port the OS gave them, so concurrent gates
#   never share or kill a port. Fresh storage comes from each check's newContext (T11).
# Checks, groups, order, retry and result lines are unchanged.
# Usage: FINAL_GATE.sh <candidate worktree> [old-client commit, default codex/gameplay-foundations]
# Exit 0 all pass, 1 any fail, 3 broken tooling. Writes logs and SUMMARY.txt to $OUT.
set -u
ROOT=${1:?candidate worktree}; OLD=${2:-codex/gameplay-foundations}
MAIN=/Users/weiwei/code/yet-another-idle-rpg
D=docs/gm/dispatch/absorb-all-2026-10-14
OUT=${OUT:-$(mktemp -d /tmp/absorb-final-gate.XXXX)}; mkdir -p "$OUT"
OLDWT="$OUT/oldclient"; fail=0; PIDFILE="$OUT/server.pids"; : > "$PIDFILE"
log(){ echo "$*" | tee -a "$OUT/SUMMARY.txt"; }
stop_servers(){ while read -r p; do [ -n "$p" ] && kill "$p" 2>/dev/null; done < "$PIDFILE"; }
cleanup(){ trap - EXIT INT TERM; jobs -pr | xargs kill 2>/dev/null; stop_servers; rm -f "$ROOT/.proof-old"
  [ -L "$ROOT/private_packs" ] && rm "$ROOT/private_packs"
  git -C "$MAIN" worktree remove --force "$OLDWT" 2>/dev/null; git -C "$ROOT" checkout -q -- docs dist index.html 2>/dev/null; }
trap cleanup EXIT; trap 'exit 130' INT TERM
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

# 3. Browser checks. One server per group on an OS-assigned port; sets PORT and SERVER_PID.
serve(){ local slog="$OUT/server-$1.log"; python3 -u -m http.server 0 --bind 127.0.0.1 > "$slog" 2>&1 &
  SERVER_PID=$!; echo "$SERVER_PID" >> "$PIDFILE"; PORT=
  for i in $(seq 50); do PORT=$(sed -n 's/.* port \([0-9][0-9]*\) .*/\1/p' "$slog" | head -1)
    [ -n "$PORT" ] && curl -sf "http://127.0.0.1:$PORT/index.html" >/dev/null && return 0; sleep .2; done
  kill "$SERVER_PID" 2>/dev/null; return 1; }
# Check specs no longer carry a port. {PORT} in a command is replaced with the group's port.
check(){ name=$1; shift; local cmd=("${@//\{PORT\}/$PORT}")
  URL=http://127.0.0.1:$PORT/ YAIRPG_PROOF_URL=http://127.0.0.1:$PORT/ YAIRPG_PROOF_DIR="$OUT/proof-${name%%-*}" timeout 1200 "${cmd[@]}" > "$OUT/$name.log" 2>&1; s=$?
  if [ $s = 0 ] && ! grep -q '^FAIL' "$OUT/$name.log"; then log "PASS $name"; else log "FAIL $name (exit $s, $OUT/$name.log)"; fail=1; fi; }
run_group(){ g=$1; shift; fail=0
  if serve "$g"; then for c in "$@"; do eval "check $c"; done; kill "$SERVER_PID" 2>/dev/null
  else log "BROKEN serve $g"; fail=1; fi; echo $fail > "$OUT/group-$g.rc"; }
# Independent groups run in parallel; checks inside a group share a server and run in order.
# A group's result lines go to its own file so parallel output does not interleave.
MAXPAR=${MAXPAR:-8}
group(){ while [ "$(jobs -rp | wc -l)" -ge "$MAXPAR" ]; do sleep 1; done; g=$1; shift; printf '%s\n' "$@" > "$OUT/group-$g.cmds"; ( run_group "$g" "$@" ) > "$OUT/group-$g.out" 2>&1 & }
# A group that fails under parallel load reruns once alone; results say "(retry)" so flakiness stays visible.
retry(){ g=$1; local cmds=(); while IFS= read -r c; do cmds+=("$c"); done < "$OUT/group-$g.cmds"
  ( run_group "$g" "${cmds[@]}" ) > "$OUT/group-$g.retry" 2>&1
  sed 's/^PASS \(.*\)/PASS \1 (retry)/' "$OUT/group-$g.retry" >> "$OUT/group-$g.out"; }
H='?test_hooks=1'
group workshop "workshop env YAIRPG_PROOF_URL=http://127.0.0.1:{PORT}/$H node scripts/systems_workshop_browser.cjs" "workshop-bounds env YAIRPG_PROOF_URL=http://127.0.0.1:{PORT}/$H node scripts/systems_workshop_boundaries.cjs" "workshop-persist env YAIRPG_PROOF_URL=http://127.0.0.1:{PORT}/$H node scripts/systems_workshop_persistence.cjs" "workshop-legacy node scripts/systems_workshop_legacy.cjs"
group upstream "upstream-dev node scripts/upstream_dev_browser.cjs"
group resurvey "fork-resurvey node $D/checks/fork-resurvey/browser.cjs"
group fort "fork-fort env YAIRPG_PROOF_URL=http://127.0.0.1:{PORT}/$H node $D/checks/fork-fort/browser.cjs" "fork-fort-restore node $D/checks/fork-fort/restore.cjs"
group reveal "reveal-chain node $D/checks/reveal-browser.cjs"
group life "life-loops node $D/checks/p23-life-browser.cjs" "life-loops-extra node $D/checks/p23-life-extra.cjs"
group polish "ui-polish node docs/gm/dispatch/p23-ui-polish-2026-10-14/browser.cjs"
group wider "air-wider-p1 node docs/gm/air-wider/p1-browser.cjs" "air-wider-p2 node docs/gm/air-wider/p2-browser.cjs" "air-wider-p3 node docs/gm/air-wider/p3-browser.cjs" "air-wider-p4 node docs/gm/air-wider/p4-browser.cjs"
group stepper "sim-stepper-equivalence node scripts/simulation_stepper_browser.cjs"
group reach "reach-fixes node $D/checks/reach-fixes/browser.cjs"
for f in $D/checks/p23-host-joins/*.cjs; do [ -e "$f" ] || continue; n=$(basename "$f" .cjs); group "p00-$n" "p00-$n node $f"; done
wait
for r in "$OUT"/group-*.rc; do g=$(basename "$r" .rc); g=${g#group-}; [ "$(cat "$r")" = 0 ] || { log "RETRY group $g alone"; retry "$g"; }; done
for r in "$OUT"/group-*.rc; do [ "$(cat "$r")" = 0 ] || fail=1; done
cat "$OUT"/group-*.out | grep -E '^(PASS|FAIL|BROKEN)' | sort | uniq > "$OUT/CHECKS.txt"

log "RESULT $([ $fail = 0 ] && echo PASS || echo FAIL) (logs: $OUT)"; exit $fail
