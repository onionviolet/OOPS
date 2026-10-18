# UIL1 report: LAYOUT_SPEC v3 surface fields and the route table, 2026-10-18

Structural step from the [surface manifest proposal](surface-manifest-and-ui-flow-2026-10-18.md)
(UIM1, UIM2). No visual or behavior change was intended, and none was found. Rules applied: UR1,
UR17, UR21, UR22, UR28 (route IDs only), UR52, UR58; AR1–AR16 (structural move, AR3 one authority).
Proof is technical. Weibao's visual acceptance stays open. Nothing is committed.

## What changed

| File | Change |
| --- | --- |
| `src/layout_spec.js` | `version: 3`, `placementReads: [2]`. `surfaces`: one entry per registered panel (45) with type, home, frequency, status, gate, reads, contexts and representations. `views`: Crafting and Mixing, which are center views rather than panels. `routes`: the 18 nav routes with stable IDs. `routeTable()` and `routeById(id)` exported |
| `src/workspace_navigation.js` | Reads `routeTable()` instead of the hand-written array. The special cases (Here, Crafting, Mixing, R13 Inventory in place, Journal tabs, Stats selecting its tab) now key on the route's `open`, `tab` and `select` fields. Buttons gain `data-route-id`; labels, hotkeys, `data-panel-path` and `data-panel-tab` are unchanged |
| `src/shell_layout_edit.js` | The v2→v3 read path: a placement stored under a version in `placementReads` loads as fresh. Without it, bumping the version would have reset every stored R21 placement |
| `tests/layout_spec.test.js` | The table reproduces the R21 routes, labels, hotkeys, tabs and Center views order; v2 placements read unchanged; v1 still drops |
| `tests/ui_contract.test.js` | Every panel registered in `src/` and every panel the spec names has a surface entry with a valid type (ST1–ST9 or `unset`). Every spec surface is registered somewhere. Route IDs and hotkeys are unique, every route resolves to a surface that lists `route`, and the navigation has no hand-written array |
| `docs/gm/dispatch/ui-foundation-2026-10-15/check-uil1.cjs` | Before/after browser harness (below) |

`src/game_bar.js` needed no change: More N reads the nav buttons, which are unchanged.

## Surface fields: filled and unset

Unset values are written as `unset`, not guessed.

- **Typed (20 of 47: 45 panels and 2 views):** ST1 `local-actions`, `practice-actions`; ST2 Mixing view; ST3 `optional-worlds`,
  `beginning`; ST5 `patrol`, `ledger`; ST6 `records`, `known-people`, `known-routes`, `memories`,
  `notebook`, `reading-reference`, `village-neighbors`, `village-travelers`; ST7 `customization`,
  `customization-effects`; ST8 `projects`; ST9 `messages`, `shell-log-tools`. Sources: the ST
  table's examples and its TR2 rehoming.
- **Type unset (27), finding:** shell parts (You, Around you, Inventory, the place header, current
  work, combat, stance, Center views) have no matching ST type. Neither do Skills, Stats, Crafting,
  the authoring panels and a few others. The surface types need a decision on shell parts before
  these can be filled.
- **Status unset everywhere.** Shipped does not mean accepted, and no live owner records the
  status of each panel.
- **Gate** is `owner` everywhere: the registering module's `discovered()` stays the one authority.
- **Reads** are filled where the topic is obvious (Inventory→inventory, the place→place, time,
  body, work, combat). **Contexts** are filled only where a contextual home or eligibility fixes
  them (item detail, combat, stance). **Frequency** and **home** are unset except Village for the
  Village scene, neighbors, travelers and Mixing.

## Checks

| Check | Command | Result |
| --- | --- | --- |
| Focused | `node --test tests/ui_contract.test.js tests/layout_spec.test.js` | 10/10 pass |
| Full suite | `npm test` (after the last source edit) | 2128 pass, 0 fail, 3 todo |
| Architecture | `npm run check:arch` | Pass, exit 0 |
| Rule behavior | `npm run check:rule-behavior` | Pass, exit 0 |
| Rules index | `npm run check:rules` | **Fails, unrelated:** "AD codes not contiguous" across AD10–AD37. Another session has an uncommitted edit to `docs/RULES_INDEX.md` (AD5). This step does not touch that file |
| Rebuild | `node build.js` in the checkout, and in scratch copies before and after the change | Built. The before and after trees differed only in the three source files above |
| Browser, before/after | `R4_URL=… PHASE=before\|after node check-uil1.cjs`, then `node check-uil1.cjs compare` | See below |

### Browser harness

Headless Chrome, fresh origin per target, populated UI fixture
(`calm-vivid-2026-10-14/evidence/populated-ui-fixture.json`), parity shell. Targets: 1920×1080 and
1366×768, each at 14px and 21px text. It records each nav button (label, path, tab, title, hotkey,
hidden, disabled, folded), the Center views buttons, More N's label and items, and the More panels
list. It presses Alt+I/J/B/A/K/E/H/C/M/P/L/S and Esc after each, then walks a Back chain
(Journal → Skills → Esc → Esc). Last, it seeds a placement stored by R21 (spec 2, Inventory moved
to the top left), reloads, saves, exports and imports.

- **Run 1 caught a regression.** Deriving Center views from bar order changed it to
  Here, Crafting, Mixing, Skills. Fixed with an explicit `pane` position; the unit test now pins
  Here, Skills, Crafting, Mixing.
- **Run 2:** one difference. Alt+M at 1920/21px stayed on Local actions. The button was
  enabled in the recorded state.
- **Run 3** (same build as run 2): **no behavior differences** on any target. I read run 2's
  Alt+M miss as timing after the Crafting→Esc step. Neither the after build nor the before build
  was rerun to measure how often it happens.
- **Screenshots:** all 11 before/after pairs are pixel-identical (full page and bar at four
  targets, the open More 3 list at 1366/14 and 1366/21, and the imported placement at 1920). Files
  are in [`evidence/uil1/`](../evidence/uil1/).
- **Placement (GU6, UR17, UR58):** the spec-2 placement loads with Inventory in the top left,
  survives reload and survives save, export and import, both before and after. It is not reported
  as stale. The stored copy keeps `spec: 2` until the player next changes the layout, which
  rewrites it as 3 (unit-tested, not browser-tested).
- More N folds three routes (Worlds, Beginning, Settings) at 1366 and none at 1920, identical
  before and after. Back reads "← Journal", then "← Village", identical.

## Gaps

- **Implemented-unverified:** the rewrite of a stored placement to `spec: 3` after a layout change
  in the browser; Alt+D, N, T, R, W and G (they share code paths with the keys exercised); the
  Journal tab each tab route selects (the expanded mode was compared, not the active tab);
  combat-context navigation.
- Mobile, classic layout (GU5), quick jump, log links and Back history consumers were out of scope.
  The route lookup exists for them; nothing calls it yet.
- Observed, not investigated, identical before and after: at 1366/21px the bar starts at "Stats".
  "Here" is not folded into More, so it is probably clipped at the left edge.
- Visual acceptance by Weibao stays open.
