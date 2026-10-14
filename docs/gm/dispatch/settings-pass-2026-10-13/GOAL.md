# Settings pass: until-done goal (2026-10-13, runs after the crafting goal)

Authority: Weibao, 2026-10-13: "also do the settings pass after crafting,
consider improvable aspects too", on top of "Making everything little thing
adjustable". Palette: AJ1-AJ7, AJ12 in [considerations](../../../research/proto23/CRAFTING_SCREEN_AND_ADJUSTABILITY_CONSIDERATIONS_2026-10-13.md#making-every-little-thing-adjustable).
Settings map (from code): customization lives in the save under a strict schema
(`src/customization_profiles.js:13-20`, `validateSaveEnvelope` in
`src/save_files.js:41`); new keys there would invalidate older saves.

## Decision (coordinator proposal, reversible)

New display settings are **per browser** in localStorage `yairpg.display.v1`,
shown as a "This browser" section inside the Effects & sound panel
(`src/customization_ui.js`). They never enter the game save, so no save schema
change. The save-level Effects setting (`off/reduced/full`) stays the global
cap: `off` stops every motion feature, exposed as `<html data-effects>`.

## Objective

Every presentation feature shipped today has a described setting with a
sensible default and a reset; one export carries layout, colors and display
settings; and the gaps left by the Vivid goal are closed.

## Done check

`check.sh` exits 0: rebuild, parity, `checks/gate.cjs` S1-S7, the crafting and
Vivid gates as regression, rarity unit, `npm test` vs baseline. One item:
`URL=http://127.0.0.1:18301/ node checks/gate.cjs S2` with a server on 18301.

## Items

| ID | What |
| --- | --- |
| S1 | Controls `[data-display-setting=<key>]` in `#customization_effects_host` for reveal (full/quiet/off), coinFloat (on/off), coinFloatAutomatic (off/on), newDot (on/off), logFollow (hold/always), vitalsValue (inside/beside), vitalsLevel (show/hide), plus color inputs semGain/semLoss/semMoney/semBlocked (empty = scheme); each with an `aria-describedby` one-line description; stored in `yairpg.display.v1`; restored on reload; `[data-display-reset]`; never written into the save |
| S2 | Each setting changes behavior (see gate); coin float shows for user spends only unless coinFloatAutomatic is on (improves V12's upkeep caveat) |
| S3 | Save-level Effects off: no coin float, no reveal animation, `<html data-effects="off">` (today 'reduced' is per surface only) |
| S4 | Layout configuration export includes `display` and `colors` with the layout; import restores all three; old layout-only JSON still imports |
| S5 | Keyboard: inventory rows focusable; focus clears the new-item dot |
| S6 | Regression guard (passes today): talking to the elder reveals Notes and People you know in play |
| S7 | Settings section text ≥4.5:1 |

Known gap not gated: vitals level after a real level-up (no practical route;
fresh hero cannot win fights). Record it, don't fake it.

## Constraints

- Allowed: `src/customization_ui.js` (new section only), new `src/display_settings.js`,
  `src/settled_text_effects.js` (coin feedback), `src/display.js` (dot, log, vitals
  only), `src/workspace_layout.js` (reveal mode, export/import), `styles/*.css`,
  `index.html` (vitals markup keeps IDs), `dist/` via build. `src/main.js`: at most
  a few wiring lines, recorded. No save schema, no `customization_profiles.js`
  schema change, no tests/ edits. Crafting goal files belong to that goal.
- Defaults reproduce today's behavior except coinFloatAutomatic (off).
- No commit/push/publish. Gate files of all three goals are read-only.

## Stop and ask

A check wrong about the game; any need for a save field; new npm failure in an
untouched area; two rounds without progress.

## Next round

Blocked on Weibao/coordinator (2026-10-13). S1, S4-S7 pass. S2 and S3 fail only on the combat on-hit shake (src/ui/combat_display.js WAAPI, 200 ms) still running at the gate's snapshot. Proposed fix: let src/ui/combat_display.js skip do_onhit/do_onstart animations when <html data-effects="off"> (fixes S3); S2 "reveal off" then still sees the shake under Effects full, so the gate needs to scope its count to reveal animations or the coordinator accepts reveal off also stopping combat shakes. Node fetch flake note still applies.

## Dead ends

(append only)

- 2026-10-13: S2 quiet initially got no marker: revealArmed() needed 1.2 s after the start screen closed, and the gate travels sooner. Fixed by arming on the first trusted pointerdown/keydown after close (not in hero creation); vivid I4 still passes (no reveal on reload/import).
- 2026-10-13: CSS `animation: none` cannot stop the combat on-hit shake; it is a JS Element.animate in src/ui/combat_display.js, outside this goal's allowed files.
- 2026-10-13 coordinator: S2 counted fighter hit-shake (subtree) as reveal animation; gate narrowed to the shell's own animations. S3 kept strict; combat_display.js guard approved and added (Effects off stops hit/start shakes).
