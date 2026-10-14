# Crafting screen that explains itself: until-done goal (2026-10-13)

Authority: Weibao, 2026-10-13: "go with the crafting screen one, same until done
setup", then "also do the settings pass after crafting" (separate goal, next).
Design palette: [CP/D/RV/M/AJ considerations](../../../research/proto23/CRAFTING_SCREEN_AND_ADJUSTABILITY_CONSIDERATIONS_2026-10-13.md).
Current code map with file:line refs: [research/CRAFTING_MAP.md](research/CRAFTING_MAP.md).
UI owner: [Thematic UI](../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md). Desktop first.

## Objective

In the crafting window, clicking a recipe selects it and a detail region beside
the list shows what you will use (have/need), what you get, success chance,
station and XP, with one Craft button driven by the same result as the row,
the filter and the craft itself. Blocked recipes say why; unknown ingredients
stay unnamed; the receipt tells the truth; keyboard works; nothing is clipped.

## Done check

`check.sh` here exits 0: rebuild, served parity, `checks/gate.cjs` (C1-C9 on the
`craft_ready` fixture at 1366×768 plus 1440×900 and 1920×1080), the finished
Vivid goal's browser and unit checks as regression, and `npm test` against the
Vivid baseline. One item: `URL=http://127.0.0.1:18291/ node checks/gate.cjs C4`
with a server on 18291.

## Items

| ID | What | Palette |
| --- | --- | --- |
| C1 | Click selects (never crafts); `[data-craft-detail]` beside the list with `[data-craft-title]`, `[data-craft-req]` rows "<item> have/need", `[data-craft-output]`, `[data-craft-chance]` (%), `[data-craft-station]`, `[data-craft-xp]`; row `aria-selected=true` | CP1, D1, CP8 |
| C2 | One owner: every row's `.recipe_unavailable` equals the Craft button's state; "Makeable now" shows exactly the enabled rows; blocked Craft has `aria-disabled=true` (not `disabled`), a visible `[data-craft-blocked-reason]`, missing rows `data-missing` in `--sem-blocked` with a word; clicking it focuses the first missing row and changes nothing | CP3, D3, rejected Proto23 bug |
| C3 | Undiscovered ingredients: `[data-unknown]` placeholder row, no name or type ("raw wood") anywhere in the window, tooltips, titles or labels | CP2 |
| C4 | Truthful receipt: `[data-craft-receipt]` in the detail states what was made (count and name) and used, or that it failed; the overlay never says "no output" when output arrived (map F3: main.js ~4175/4217 + work_ledger_system.js 136-139) | D2 |
| C5 | After crafting: same row selected, same detail, focus inside the window, list scroll unchanged | CP1 |
| C6 | Keyboard: rows have tabindex; Enter selects; ArrowUp/Down move selection and focus together; Enter on Craft crafts | M4 spirit |
| C7 | At 1366×768, 1440×900, 1920×1080: detail, Craft and Exit fully visible (not clipped, not covered, also while hovering a row); no page scroll | fit |
| C8 | Layout menu `select[data-workspace-action=craft-detail]` beside/below, stored per browser, Craft still visible below | AJ8 |
| C9 | Every text in the detail ≥4.5:1 on its own background | V9 |

## Constraints

- Allowed: crafting parts of `src/display.js`, `src/crafting_visibility.js`,
  `src/crafting_recipes.js` (read-only helpers only, no recipe data/balance
  changes), new `src/crafting_detail.js`, `src/workspace_layout.js` (the C8
  select only), `styles/workspace.css` or a new `styles/crafting_detail.css`
  (linked in index.html), `index.html` crafting markup (keep every existing ID),
  `dist/` via `node build.js`.
- `src/main.js` and `src/work_ledger_system.js`: only the C2 availability join
  and the C4 receipt lines, surgical, each line recorded in notes. Foundation
  (Codex R11) owns runtime/save/story/tests: no save schema, no transaction
  semantics, no tests/ edits.
- Same craft results and odds as today (UI and truthful reporting only).
- Hover may preview; it never changes selection or crafts.
- Standard and Vivid both; Appearance palettes win. No commit/push/publish.
- `checks/`, `check.sh`, `GATE.sha256` and the Vivid goal's checks are read-only.

## Stop and ask

A check wrong about the game; a needed change to craft mechanics, save or
transactions; a new npm failure in an untouched area. Two rounds without a new
pass: stop with a diagnosis.

## Budget

About 25 rounds, 6 hours.

## Next round

All nine items pass gate.cjs (worker run 2026-10-13). Remaining: full check.sh
(vivid regression, npm test baseline). Then hand off to the settings-pass goal.
Deferred: component/equipment recipes still use their in-row pickers (detail hidden there).

## Dead ends

(append only)
- 2026-10-13 worker: setting the C8 choice as `html[data-craft-detail]` made the gate's `[data-craft-detail]` match <html>; renamed to `data-craft-detail-place`.
- 2026-10-13 worker: "need N more" leaks under C3 because "more" contains "ore"; requirement word is "missing N".
- 2026-10-13 worker: gate/fixtures fetch of index.html from python http.server intermittently crashes Node 22 undici (`assert(!this.paused)`), about 1 in 8 runs, also with the HEAD index.html; rerun. Not caused by this change.
