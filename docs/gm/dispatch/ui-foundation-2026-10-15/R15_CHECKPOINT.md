# R15 checkpoint, 2026-10-16

Owner: Claude session "UI extension and modulization" (desktop app), working in the shared
checkout. Weibao: "do it yourself, use lesser agents accordingly and more?" Cheaper subagents do
read-only location and check runs; this session owns every edit.

## Scope (from the [Round 15 plan](next-parts/round-15-whole-plan.md), R15 row)

**One gap:** the combat place descriptor is restored. R14 hides the native location module in the
shell (`styles/ui_tokens.css`, `[data-module="location"]`), so during combat the place type tags
(for example `open`) and their description/effect tooltip are gone (NEXT_PARTS L1/L2, NX4, NX18).

- **Target:** 1366×768 at 14/21px and 1920×1080 at 21px (17.5px when a width threshold matters).
- **Visible outcome:** in a fight, the combat header shows the place's native type tags. Each tag
  is focusable; hover, focus and Enter all show the same native description and effect; Esc
  closes it and returns focus to the tag.
- **Rules:** UR11, UR36, UR47, UR52, UR53; AR1, AR9 (no structural move mixed in); AD34.
- **Deferred:** the rest of the Part 2 descriptor (effects on you, related skill, date/weather
  grouping), opponent board (R18), log work (R19), preview conversion (NX43: `combat_display.js`
  imports `main.js`), mobile.
- **Save:** none. No `main.js`, `save_files.js`, simulation or combat-rule edits.

## Reservation

Shared checkout HEAD at start: see report. Other sessions' dirty files (`index.html`, `main.js`,
`save_files.js`, `simulation*.js`, continuation files) are not touched, except the build's
version-string rewrite of `index.html`, which R14 also accepted. Source files this round edits
are listed in the report once located; nothing else.

## Checks chosen before editing (AD36)

- Failure scenario: Infested field fight from the synthetic fixture
  `evidence/parity-r9/populated-three.save.txt` (three opponents) shows no type tag in the shell.
- `npm run build`, focused UI tests, then `npm test` (unrelated dirty-tree failures recorded, not
  claimed fixed).
- Browser on a fresh loopback origin at the three targets: tags visible in combat, focus/Enter/Esc
  parity, no page overflow, no page errors; NX19 parse check (every shell rule present in
  `document.styleSheets`); NX4 check (each module the shell hides in combat has a route).
- Human visual/play acceptance stays open.

## Technical close

[R15 report](R15_REPORT.md). Files changed: `src/place_types_projection.js` (new),
`src/main.js` (one read field and imports), `src/village_workspace.js`, `src/proto23_shell.js`,
`styles/ui_tokens.css`, `tests/place_types_projection.test.js` (new), build outputs. Reservation
released. Human acceptance open; no commit.
