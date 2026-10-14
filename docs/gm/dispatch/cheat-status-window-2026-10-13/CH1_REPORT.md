# CH1 optional start and status window, 2026-10-13

**Status: BLOCKED, uncommitted.** Supplemental rebuilt-browser evidence found an unsupported Appearance module ID outside the allowed write scope.

Worker scope: `ui/cheats-ch1`, based on e758c3af. Main checkout and frozen gates are read-only; no push. Desktop/laptop targets: 1366×768, 1440×900 and 1920×1080. Visible outcome: an optional dormant beginning wakes into an independent informational character panel. Mobile optimization, later cheat stages, shops, rewards and optional-start unlock gates remain deferred.

## Changes

- C1 `src/cheat_cards.js:38,82`: optional boolean awakening validation, dormant card factory, legacy-message discovery compatibility and pure awakening/message transition. Stage 0 starts with zero points and adds no power.
- C2 `index.html:9,124`, `styles/status_window.css:1`: labeled opt-in selector, none default, singleton surprise explanation and dormant milestone description; inherited colors/typography and compact row spacing.
- C3 `src/status_window.js:7`: `definePanel` character panel, persisted discovery predicate, native level/core stats and only held title names, points and stage-0 quest empty state. Browser-owned density setting; existing workspace owns reveal and F6 behavior.
- C4 `src/main.js`: import at 284/342; calendar and normal-save awakening helper at 303–315; Player Appearance node mapping at 2282; native combat victory hook at 3641–3642; day-boundary hook at 7258–7259; hero confirmation capture at 8167–8178; panel read/discovered Appearance option wiring at 8315–8324. No panel name is added to the Appearance selector before discovery.
- C5 `tests/cheat_status_window.test.js:1`, `tests/helpers/cheat_game.mjs:8`, `fixtures/build_fixture.mjs:25`: dormant/day-3/first-win/no-replay source checks and test-only real creation/clock access. `fixtures/dormant_day3.save.txt` names TEST FIXTURE CH1, is dormant at day 2 23:15 and reaches day 3 after about 45 real seconds. The C0 held fixture is preserved.

## Compatibility

Save cheat schema remains 1. Missing cheats still load empty. C0 card state `{}` remains valid, and a legacy status card's stored first message establishes known/awakened presentation without changing its serialized state. New optional starts explicitly carry `awakened:false`; only a live first won ordinary native fight or day-3 boundary changes that flag, stores the original first message, logs it and calls normal save. Density remains in `yairpg.display.v1`, outside game saves. Colors inherit the kit and Player Appearance; the proposed explicit per-panel Appearance option becomes selectable only after discovery, but applying it is blocked by the separate supported-module whitelist (see blocker).

## Evidence

| Item | Classification | Result |
| --- | --- | --- |
| H1 default/no cheat/no leak | natural | PASS, real fresh hero confirmation with none |
| H2 optional dormant acquisition | natural | PASS, real fresh hero confirmation with system-quests |
| H3 day-3 awakening/log/reveal | seeded-native | PASS, real-clock fixture, one first message and one reveal after 44 seconds on the final run |
| H4 contents/density | seeded-native | PASS, level 0 equals vitals, Strength 12.0 equals native stats, compact tightens rows |
| H5 save/reload/literal import | seeded-native | PASS, known panel survives without replay |
| H6 fit/contrast/F6 | seeded-native | PASS at all three desktop sizes, contrast ≥4.5:1, no horizontal overflow |

First-won-fight transition: **source**, pure helper test plus native winner callback inspection in `src/models/combat.js:234`; no fresh-hero victory was exercised. Human appearance/taste acceptance remains open. The frozen gate's day-3 path is the exercised native awakening route. No other gameplay behavior is claimed.

## Blocker

B1 **seeded-native**: the rebuilt browser loads the legacy C0 held-card prerequisite, discovers the panel, selects Status window in Appearance, changes Background/Text/Accent and clicks Apply and save. The profile validator rejects `status-window` because `src/customization_profiles.js:11` (`CUSTOMIZATION_MODULES`) does not include it; validation at line 71 refuses the override. Computed panel colors stay Vivid (`rgb(15, 52, 56)` / `rgb(245, 247, 255)`) and `data-custom-palette` remains false. This is outside CH1's allowed files. No whitelist change or bypass was made. A coordinator-authorized addition of the module ID, followed by the supplemental native check and full frozen gate, is needed before completion/commit.

Supplemental **natural** evidence passed on the final rebuilt bundle: Surprise me grants the singleton dormant card; the life record notes the surprise beginning; no Appearance option exists before awakening, including while dormant.

The first full frozen run exited 0. The final run after the discovery option fix also exited 0; its H1–H6 gate does not check whether the new Appearance option can be applied. A green frozen gate alone does not close B1. No commit or push; worker stopped at the domain boundary.

## Final frozen gate

Final run exit: 0. Full combined output follows. The final line is the normal server termination from the exit trap. Build outputs and index version stamps were restored; port 18322 is free. B1 remains OPEN, so there is no completion commit.

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

## Coordinator close, 2026-10-13

B1 closed. The coordinator authorized and added `'status-window'` to
`CUSTOMIZATION_MODULES` in `src/customization_profiles.js:11` (widens accepted
module IDs; existing saves stay valid). Supplemental seeded-native check on the
rebuilt worktree bundle: after awakening, Authoring → Appearance → module
"Status window" → Background #5a1010 → Apply and save → back to play: panel
`data-custom-palette="true"`, background rgb(90, 16, 16), override persisted in
the save, no page errors. Full `check_ch1.sh` rerun after this edit: exit 0
(H1-H6, C0 with npm test, panel-kit 7, settings 7, crafting 9, Vivid 10).
Open: first-won-fight awakening has source coverage only (a fresh hero cannot
win fights yet); day-3 awakening is seeded-native.
