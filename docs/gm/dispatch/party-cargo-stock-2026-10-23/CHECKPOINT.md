# O4 party and cargo stock view, 2026-10-23

Queue row: [O4](../features-o1-o5-2026-10-23/QUEUE.md). Rules: AD5, AD36, AD38, AR1-AR16, UR (surface type, own node, tokens). Predecessor: [inventory overhaul](../inventory-overhaul-2026-10-21/REPORT.md); its local-chest slice did not claim party/cargo redesign or whole-game parity.

## Plan (written before code)

Target viewport: desktop 1920x1080 primary, 1366x768 checked. Mobile deferred.

Visible outcome: one "Stock" reading of who holds what: the player's carried bag (cargo), the open place chest, and each companion who has a simulation inventory (Lio). Each holder lists exact stacks with count, favorite, equipped, "lent to X" and "borrowed from X". A reviewed transfer moves a stack between carried and a companion (entrust / take back) or carried and the chest.

Seam: a pure `stageStockTransfer` beside `stageNativeStorageTransfer` (`src/native_storage_transaction.js`), writing the existing owners only: player native inventory, `state.simulation.owners[companion]`, `state.simulation.custody` (loan owner = player, holder = companion), chest owner. No second store, no new save slice. Reading is a pure projection over those owners.

Protections kept: sequence and expectedCount staleness; atomic batch; favorites stay carried; equipped stock must be unequipped; items the source holds on loan from someone else cannot move on; entrusting records a loan so the return path is lawful; busy player or pending work blocks.

Deferred: companion-to-chest direct moves (go via carried), companions other than simulation-inventory people, gifting without a loan record (a plain gift is a later dial), mobile layout, realm cargo passage consent.

Done check: focused tests, rebuild, headless browser from fresh origin showing the transfer, then save/reload/import. Each check is recorded below as command / result / gap.

## Checks
| Check | Result | Gap |
|---|---|---|
| `node --test tests/stock_view.test.js tests/native_storage_transaction.test.js tests/storage_comparison.test.js tests/ui_extras.test.js` | 25/25 pass | Focused slice only; full `npm test` is the committer's gate, not run |
| `npm run check:arch` | pass, main.js 10113 lines vs baseline 10115 | |
| `npm run check:rules` | PASS, 0 warnings | `check:rule-behavior` not run (no rule text changed) |
| `npm run build` | done | |
| `node scripts/stock_browser.cjs` (headless Chrome, fresh context, generated fixture, rebuilt bundle) | pass: hand 1 log to Lio, loan recorded, native bag 5 to 4; reload keeps it; export + literal-file import keeps it; take back restores 5 and clears loan; no page errors; screenshots at 1920x1080 and 1366x768 in /tmp/yairpg-stock-proof | Not human-judged for taste: Hand/Take back buttons sit tight against item text (no spacing token applied yet). Stale/favorite/equipped/borrowed protections proven in unit tests only, not in the browser |

## Reference parity (one flow: hand an item to a companion and take it back)

Implemented-unverified against references: I did not open the pinned Proto23 inventory renderer or base YAIR `create_inventory_item_control` this round, so no reference row is claimed. Known from the overhaul REPORT: base YAIR and Proto23 have no companion packs, so there is nothing to match for the companion half; the carried-stock half reuses the native inventory owner. Parity claim stays open until a reference screenshot pass.

## Delivered (uncommitted, own paths only)
`src/native_storage_transaction.js` (`stageCompanionStockTransfer`), `src/stock_view.js`, `src/stock_view_ui.js`, `src/ui_extras.js` (1 import), `src/main.js` (commitNativeStorage branch, `stock` and `transferStock` ports; net -2 lines), `tests/stock_view.test.js`, `scripts/stock_browser.cjs`. Rebuilt `dist/` and `index.html` are build output, not for commit by this lane.
