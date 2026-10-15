# Wave G: panel render cost (ER1-F4, ER1-F8)

Branch `claude/wave-g-render-887951`, base `7504a1e4` (engine-perf wave merge),
2026-10-14 night. Audit rows: [ER1-F4 and ER1-F8](../../../../research/RUNTIME_HOTSPOT_AUDIT_2026-10-14.md).
Target viewport 1366x768 (desktop first); mobile not checked.

## What was wrong

Measured by CPU profile, mapped to source, inclusive time per owned module
(tools below). Crowded fixture, base, per game tick:

- **Inventory, 65-90 ms.** `update_displayed_character_inventory` read each row's
  count through `innerText` right after replacing the previous row's tooltip, so
  every row forced a layout (1236 of 1406 ms self time sat in that loop). It also
  replaced every tooltip and price on every publication: 1154 DOM nodes
  added or removed per tick.
- **Structured pack ("Your beginning"), 80-160 ms.** Its own 250 ms poll calls
  `readStructuredCampaign` four times a second outside any simulation frame, and
  each call rebuilds `simulationNativeContexts` (2729 of 2734 ms). The panel's own
  DOM work is negligible; the cost is the read, which lives in `main.js`.
- **Expedition and village, 1-3 ms each.** `JSON.stringify` of the whole expansion
  state as a render signature, which changes every tick anyway, plus
  `replaceChildren` of history lists and unconditional text writes (38 and 44
  nodes churned per tick).
- **Work ledger, chronicle, item log, under 1 ms each.** Whole-body rebuild on
  any signature change (work ledger), whole-table HTML rebuild per publication
  (item log, 4 nodes per tick), unconditional hidden/disabled toggles (chronicle).

## What changed

- `src/display.js`: inventory rows read counts with `textContent` and write a
  count, name, tooltip (`isEqualNode`) or price only when it differs; condition
  labels likewise. The item log keeps its table when the generated markup is
  unchanged. New `inventoryDisplayRevision()` for host change tokens.
- `src/dom_sync.js` (new): `syncChildren` keeps unchanged live nodes and writes
  only differing text, attributes, handler properties and select values;
  `setText` skips equal text.
- `src/expedition_ui.js`, `src/village_ui.js`: the state is keyed by identity,
  `sequence` and `clock` (the D1 framed-facts rule) instead of JSON; a new state
  always renders, and the context JSON is built only to skip a repeat render of
  the same state. Text writes guarded; history lists synced.
- `src/chronicle_ui.js`: same signature as before, but the chronicle is
  serialized only when a new chronicle object arrives (its age text depends on
  re-render timing, so the old skip semantics are kept exactly). Controls are
  decided first and written once; lists synced.
- `src/work_ledger_ui.js`: body builds detached and syncs, so focused controls
  keep their node (base rebuilt it and refocused a new node by key).
- `src/structured_pack_ui.js`: prose, plans and renewal sections are replaced only
  when their own rows change; text writes guarded. Optional `changed()` token gates
  the 250 ms poll; without it behavior is unchanged.

## Results

Dev-stepped (`?test_hooks=1`, engine paused, `advanceTicks(1)` then 1 s real wait,
so native 250 ms polls run between ticks), 20 ticks, panels opened, CPU sampling
200 µs, interleaved per rep. `head` = this branch. `head+A` = this branch plus the
[lane A patch](LANE_A_PATCH.md), built in a scratch tree only. Host load (1-min)
was 100-640 throughout: shared 18-core host with other lanes, not quiet.
Primary evidence is load-independent: DOM churn and the read/layout causes found
in the profiles. Time ratios below are provisional until rerun on a quiet host
through the shared test queue (wave-f-checks `scripts/test_queue.mjs`).

Per-tick ms in owned modules (inclusive), final code (`results/ab3.json`):

| Fixture | Rep | Load | Base | Head | Head+A | Head excl. structured / base excl. |
| --- | --- | --- | --- | --- | --- | --- |
| developed | 0 | 469-551 | 20.31 | 10.80 (0.53x) | 3.96 (0.19x) | 5.80 / 5.57 |
| developed | 1 | 309-321 | 11.30 | 12.75 (1.13x) | 2.67 (0.24x) | 3.50 / 4.70 |
| crowded | 0 | 343-496 | 187.48 | 108.72 (0.58x) | 7.40 (0.04x) | 7.10 / 72.69 (0.10x) |
| crowded | 1 | 132-263 | 122.41 | 89.63 (0.73x) | 5.88 (0.05x) | 6.64 / 40.77 (0.16x) |

Earlier interleaved run on the same head minus the lazy signature
(`results/ab2.json`): head+A developed 0.19x and 0.30x, crowded 0.04x and 0.03x.

- **Target (at most 0.3x) is met only with the lane A patch.** Without it the
  structured pack poll stays at 80-130 ms per tick on crowded, all inside
  `main.js`'s read. On developed, the other owned panels total about 5 ms per tick
  and the head/base ratio for them is within this host's noise (0.36x-1.2x across
  reps); their remaining cost is the engine's own `evaluateAction` previews.
- **DOM churn per tick (nodes added + removed), base → head:** inventory
  1154 → 0 (crowded) and 66 → 0 (developed), item log 4 → 0, expedition 38 → 0,
  village 44 → 2, work ledger and structured 0 → 0 at idle.

## Checks

- **Text identity, idle.** innerText, textContent and outerHTML of all seven
  containers byte-identical base vs head at ticks 0, 5, 10 and 20, developed and
  crowded, both reps (`tools/cmp.cjs`).
- **Text identity, interactions** (`tools/interact.mjs`). Same click sequence in
  each build with dev-stepped ticks after each step, dumps compared: 0 diffs head
  vs base on developed, fresh and mid; 0 diffs head+A vs base on developed and
  fresh. Exercised: structured Begin, buy, repeat-3 (plan runs through settlement),
  return; expedition inspect; village investigate / pack meal; work ledger
  connect, accept commission, cancel effect. Chronicle buttons were disabled on
  these fixtures (not exercised by clicks; idle text identical).
- **Focus at 1366x768.** Focused expedition action, village action, work ledger
  control and inventory row kept focus (same node) across 5 dev-stepped ticks in
  base and head. Work ledger re-render while focused: head keeps the same node;
  base restored focus to a rebuilt node. Structured focus is covered by
  `tests/structured_pack_ui.test.js` (its module was inside a hidden workspace
  container on these fixtures).
- **Unit suite.** `node --test --test-concurrency=2`: 1721 tests, 1718 pass,
  0 fail, 3 todo (`results/node-test.txt`).
- **Systems workshop browser check** on the head build (served from the build
  tree, run from it so the bundle version check matches): 10 cases, 0 errors,
  dev-stepped (`results/workshop-head.txt`). Same check on the head+A scratch
  build: 10 cases, 0 errors (`results/workshop-headA.txt`).

## Not done / open

- Lane A: [LANE_A_PATCH.md](LANE_A_PATCH.md) (structured poll, publication render).
- Inventory still scans every row and rebuilds each tooltip to compare it
  (about 2-3 ms per tick on crowded). Skipping rows needs per-row dependency
  tracking for tooltip inputs (prices, knowledge, skills); not attempted.
- Closed `<details>` panels (expedition, village, work ledger default closed)
  still compute while closed. `panel_reveal.shownOrDeferred` could skip them, but
  browser checks that click hidden buttons through JS would then see stale
  disabled states; needs those checks rerun before adopting.
- Natural-pace calls outside a publication frame rebuild contexts in `read()`
  (main.js); dirty flags there are lane A's.

## Tools

`tools/ab.mjs` (interleaved A/B, per-module attribution, churn, dumps; `WG_SCRATCH`
holds trees and `developed.json`, a copy of a systems workshop
`natural-final-save.json`, clock 67), `tools/interact.mjs`, `tools/cmp.cjs`,
`tools/under.cjs` (callee breakdown under one module). Raw per-run rows in
`results/`.
