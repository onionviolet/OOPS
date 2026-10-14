Implemented [src/away_ledger.js](/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg/src/away_ledger.js) and [tests/away_ledger.test.js](/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg/tests/away_ledger.test.js).

`check.sh` exited **0**:

```text
PASS gate_integrity
PASS npm_test # pass 667 # fail 0
PASS unit_file
PASS A1–A9
```

API: `computeAway(input)` returns `{appliedMinutes, overflowMinutes, bankedMinutes, gains:{xp}, stoppedBy, remainderMs, nextLastSeen}`. Supports caps, banking, barriers, ratios, diminishing XP and carried remainder without mutating input.

Pure module only; game integration remains deferred. No staging, commits or pushes.

