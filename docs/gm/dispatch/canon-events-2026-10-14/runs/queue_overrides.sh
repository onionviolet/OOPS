#!/bin/bash
# Launch the overrides lane once the derived-snapshots worker has ended and its check passes.
D=/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/canon-events-2026-10-14
until ! ps auxww | grep -v grep | grep -q "derived-snapshots-2026-10-14/runs/snap.last.md"; do sleep 30; done
if bash /Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/derived-snapshots-2026-10-14/check.sh > $D/runs/snap_check_before_overrides.log 2>&1; then
  echo "$(date '+%F %T') snapshots check passed; launching overrides"
  python3 $D/runs/launch_wt.py overrides $D/runs/overrides.prompt.md
else
  echo "$(date '+%F %T') snapshots check FAILED; overrides not launched"; tail -8 $D/runs/snap_check_before_overrides.log
fi
