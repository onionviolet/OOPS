# Layout lane (E5 / ER1-F5): idle layout and style churn

Branch `claude/engine-perf-layout-*`, 2026-10-14. Files changed: `src/workspace_layout.js`,
`src/workspace_views.js`. Rebuilt bundle served from a private port (19417), fresh
browser context per run, 1366x768, headless Chrome. Developed fixture:
`natural-final-save.json` from the systems workshop proof dir.

## Causes found (CDP trace with invalidation tracking)

1. **Start screen animation.** `#loading_screen_author` runs an infinite `font-size`
   keyframe animation. `visibility:hidden` does not stop it, so it invalidated
   layout every frame (~60 layouts/s) for the whole session.
2. **`updateWorkspace` per 250 ms tick** (called from `workspace_views.js` render and
   from main.js's panel batch). It rewrote `left`/`top`, `--workspace-*` variables,
   `textContent`, `aria-*`, `disabled` and select values on every module, and called
   `floatAvailable`/`floatBounds` (`getBoundingClientRect`) for every shell, docked
   ones included. Writes interleaved with reads forced a style recalc per module.

## Fixes

- Every workspace write goes through a compare-then-set helper; an unchanged tick
  writes nothing. Float bounds are read only for floating shells.
- The title animation pauses (`animation-play-state`) while the start screen is closed
  and resumes if it reopens.
- `workspace_views.js` render guards its world/theme dataset and prose toggle writes.
- Separate commit: `floatAvailable` used the toolbar bottom as the float top limit.
  The toolbar now lives in the footer bar (bottom 762 px), so every float clamped to
  the viewport floor with a 48 px max height (pre-existing; base build identical).
  The toolbar now caps floats only while it is in the top half of the window.

## Measurements (two 15 s idle windows each)

| Idle | Layouts/s before | after | Style recalcs/s before | after |
| --- | --- | --- | --- | --- |
| Fresh game | 65.7 / 64.7 | 3.0 / 3.0 | 183 / 178 | 18.0 / 17.8 |
| Developed save | 49.2 / 54.7 | 7.3 / 6.7 | 193 / 197 | 51.5 / 50.0 |

Layout time per 15 s: fresh 183-218 ms -> 9 ms; developed 151-158 ms -> 9-10 ms.
Script time is unchanged within noise (owned by other lanes).

## Checks run (tools/verify.cjs, fresh game and developed fixture, both pass)

Focus on a docked button and on a panel title survives ticks; dock scroll position
survives ticks; dock widths reflow on 1366 -> 1200 -> 1366 resize and return exactly;
Edit layout header drag moves a panel to another dock and saves it; Shift+drag floats
it on screen; east-grip resize grows the float and it stays put across ticks; divider
drag changes columns; Standard colors persist across reload with the floating layout,
then Vivid restores. No page errors. `node --test tests/*.test.js`: 1699 pass, 0 fail.

Not covered: mobile/narrow layout (deferred), authoring context layout.

## Remaining idle churn (outside this lane)

- Developed save: `#save_to_file_button.export_button_with_reward` runs a style
  animation each frame (~40 style recalcs/s); owned by main.js/save UI.
- Developed save: inventory rendering in `src/display.js` rewrites item counts and
  re-inserts tooltip/coin nodes each tick (most of the remaining forced layouts).
- No main.js patch is needed for this lane: its `updateWorkspace()` call is now a
  no-write pass when nothing changed.
