Stopped at **B1**: Player Appearance rejects `status-window` because it is missing from `src/customization_profiles.js:11`. That file is outside the allowed scope. The supplemental browser check exposed this despite the frozen gate passing.

**Commit hash: none.** No push. Work is preserved in the worktree. Dist and version stamps are restored; port 18322 is free. [CH1 report](/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/ui-cheats-ch1/docs/gm/dispatch/cheat-status-window-2026-10-13/CH1_REPORT.md).

Full final `check_ch1.sh` output, exit **0**:

```text
PASS gate_integrity
PASS build
PASS H1_no_cheat_default opt-in control, default none, nothing leaks
PASS H2_dormant_start held dormant, route optional-start, nothing shown yet
PASS H3_awakening awoke after 44s, message logged, revealed once
PASS H4_panel_contents {"level":"0","vitalsLevel":"0","strength":"12.0","strengthStats":"12.0","titles":true,"points":true,"quests":true,"rowH":26.59375}
PASS H5_persistence survives reload and literal import without replaying the reveal
PASS H6_template fits, readable, F6-reachable at 3 desktop sizes
PASS c0_regression
PASS panelkit_regression 7 items
PASS settings_regression 7 items
PASS crafting_regression 9 items
PASS vivid_regression 10 items
/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/cheat-status-window-2026-10-13/check_ch1.sh: line 23: 47649 Terminated: 15          python3 -m http.server $PORT --bind 127.0.0.1 > /dev/null 2>&1
```

Main.js hunks:

| Code | Lines | Change |
|---|---|---|
| M1 | 284, 342 | Imports |
| M2 | 303–315 | Awakening, message and normal-save helper |
| M3 | 2282 | Appearance node mapping |
| M4 | 3641–3642 | Combat victory hook |
| M5 | 7258–7259 | Day-boundary hook |
| M6 | 8167–8178 | Optional-start confirmation and life record |
| M7 | 8315–8324 | Panel wiring and discovered Appearance option |

First-won-fight browser proof remains open; its helper has source coverage.