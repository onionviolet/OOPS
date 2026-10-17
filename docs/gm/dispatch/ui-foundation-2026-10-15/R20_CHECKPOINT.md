# R20 checkpoint: opponent board sized by count, 2026-10-16

Saved before editing. Session: Claude, worktree `claude/ui-r20-opponent-board-be97bc`
(repointed onto `codex/gameplay-foundations` at ea9dbd8d2; the worktree had been cut from
`master`). Parallel wave PP1–PP8: engine lane (combat projection), core-ui (R18 inventory), this
session (R20).

## Task record (UR18, AGENTS.md consistency gates)

- **Surface type:** routine (combat Focus region of the parity shell).
- **Target viewport:** 1366×768 at 14px and 21px (primary), 1920×1080 at 21px. Mobile deferred.
- **Visible outcome:** in a fight, the opponent board is only as big as the opponent count needs.
  One opponent gets a full card; 2–4 get one row each; 5–8 compact rows in two columns; 9+ compact
  rows in three columns, scrolling inside the board. Facts that every row would repeat are read
  once, for the inspected opponent. Defeated opponents stay in their slot, labelled. The top row
  shrinks to You's height when the board is smaller, giving the inventory and actions the rows.
- **Deferred:** knowledge ladder and persistence (R29), log letters and dealt/taken tokens
  (Part 2 log, R21/R22), Reports tabs, fight descriptor (L2), aggregate groups (UX17 LATER),
  hit splats, enemy effects, mobile.

## Authority read

AGENTS.md, RULES_INDEX, UI_RULES UR1–UR58, ARCHITECTURE_RULES AR1–AR16, round-15 plan (R20 row,
NX22, WX4–WX7, CTL, PP1–PP8, GU1–GU8), R16 and R17 reports, NEXT_PARTS Part 2 (B1, UX17, R2, W4).

## Weibao's complaint, in his terms (UR15)

Evidence `evidence/r16/compare-combat-1366x768-21.png`: three "Starving wolf rat" cards fill the
top centre, each repeating the same six facts (Atk, Spd, Hit you, Evade, Defense, Your hit), while
the Reports column is empty. Cause in source: `village_workspace.js` sets
`--enemy-cards-height` to at least 304px or 20 text lines whatever the count, every card carries
its own 3×2 fact grid, and the combat top row takes `max(You, Focus)`. Reproduction at the three
targets on the frozen before build: `evidence/r20/before/`.

## Plan

1. **Projection shape (W4, NX22).** `src/opponent_board.js` (new, leaf): `projectOpponents(rows,
   encounter)` turns the existing `read()` rows into a public shape
   `{opponents:[{id, letter, name, health:{text, progress}, defeated, cycle, facts:[{label, value,
   knowledge}]}], encounter:{groupsLeft, clears}}`. A fact with no `knowledge` field renders as
   unknown; the native adapter marks its facts `native` (inherited legacy disclosure, reported as
   such, not AD8). All-known is a labelled fixture only. No new truth reads: same DOM the cards read
   today, `#enemies_left_div`/`#clear_count_div` as before.
2. **Layout by count (data in `layout_spec.js`, GU1).** `opponentBoard` bands: 1 → `card`,
   2–4 → `rows`, 5–8 → `grid2`, 9+ → `grid3` (scroll inside). Each band declares row lines so
   the board's height is declared, not guessed. A small `boardLayout(count, widthEm)` picks the band;
   narrow widths fall back a band (R2: rows, never smaller text).
3. **Board render** in `village_workspace.js`: replaces the per-card fact grids and the 304px floor.
   Rows keep identity (letter + name), health bar and text, attack cycle, selection
   (`aria-pressed`, `data-inspect-enemy`). The inspected opponent's facts show once below the board.
   Nodes keyed by opponent id; order fixed by native slot; nothing reorders on ticks (UR52, WX4).
   Defeated rows stay with a "Defeated" label and struck health (not color alone, UR37).
4. **Composition hunk.** `shell_composition.js` already measures Focus in combat; drop the
   `--enemy-cards-height` floor and let the measured board drive the top row. Keep it a separate
   small hunk.
5. **CSS** in `styles/opponents.css` (new), one link in `index.html` after `shell_layout.css`, one
   version line in `build.js` if needed. No additions to `ui_tokens.css`.
6. **Preview:** combat fixtures (unknown / partial / all-known labelled) in `src/ui/preview/fixtures.js`.

## Files this session writes

`src/village_workspace.js` (combat card/board code), `src/opponent_board.js` (new),
`src/layout_spec.js` (opponent board data), `src/shell_composition.js` (small hunk),
`styles/opponents.css` (new), `index.html` (one link), `src/ui/preview/fixtures.js`,
`tests/opponent_board.test.js` (new), dispatch R20 files and evidence. Not touched: `main.js`,
`display.js`, `save_files.js`, `proto23_shell.js` inventory, `styles/inventory.css`, `ui_tokens.css`.

## Gates

Build; capture before/after at the three targets for 1/3/5/8/9; slack map; check-r11 … check-r17;
`npm test`; `npm run check:arch`; WX4 tick-stability under a hovered row; no RNG/state change from
inspection. Visual acceptance stays Weibao's (UR16).

## Status

- [x] Checkpoint saved, branch repointed, before build frozen (scratchpad, port 19481).
- [x] Implementation (plan step 1–6 done; grouping for 5+ same-name fights added after the
  8-opponent capture showed the facts cut off; the old Panels/Compact toggle became Compare)
- [x] Verification (see R20_REPORT.md)
- [x] Report and commit
