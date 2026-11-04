# Own-holdings P1: live reader for the registry, 2026-11-03

P1 of [OWN_HOLDINGS_PLAN](OWN_HOLDINGS_PLAN_2026-11-03.md), after [HP_O1_O2_RECEIPT](HP_O1_O2_RECEIPT.md). Rules: AD36, AD43, AD44, AD46, AD51, AR1-AR16, display only. **Agent-verified, not human-reviewed.** Nothing committed or pushed; tracked `dist/` not rebuilt (isolated snapshot only).

## What was wrong
The registry took fixed strings only, so a life with real resources or items could not show them; a P2/P3 registration would have shown stale text after any spend. The shell also asked "is this world registered" without the simulation state, so no reader could run.

## What changed (source-edited)
- `src/own_holdings.js`: `registerOwnHoldings(worldId, text, readers?)` takes optional `{purse(state), items(state)}`. `ownHoldingsView(worldId, state)` returns the shown entry: a reader's text when it returns a non-empty string (items: non-empty string, or a list joined with commas), else the static text. A throwing reader, an empty list or a non-string result falls back. `lifeHoldings(state, actorId)` is the read helper for P2/P3 readers: resources from `state.actors[id].resources`, items from `state.simulation.owners[id]` only when that person's inventory is `simulation` (the existing owners; no new state path).
- `src/world_look.js` and `src/display.js`: the two existing call sites switch from `ownHoldings(world)` to `ownHoldingsView(world, readPort('expansion'))`. Same line count (display.js 6757, main.js 10110, both under baseline). The world key is still the actor's current world.
- `src/book_world_hp_lead_domain.js`: untouched. The HP lead registration has no readers, so it renders exactly as before.
- No stored state, save change or migration. School, trade, Gu and Shadow Slave not registered (P2/P3).
- New `tests/own_holdings.test.js` (throwaway world `test.own_holdings.world`): reader shows 3 then 2 after a spend; items list from the simulation owners; empty list, throwing reader, unusable result and no reader fall back to the static entry; `applyWorldLook` sets the veil and notices only for the registered world; `base.frontier` gets nothing new.

## Checks (one line each)
| # | State | Command / route | Input identity | Result | Gap |
|---|---|---|---|---|---|
| 1 | focused-tested | `node --test` own_holdings, hp_lead_life, hp_lead_window1, world_look | this tree | 19 pass, 0 fail | Full `npm test` not run, by instruction |
| 2 | source gate | `npm run check:arch` | | exit 0; main.js 10110 (baseline 10115), display.js 6757 (baseline 6767) | |
| 3 | source gate | `npm run check:rules` | | PASS (1 warning, untracked file linked from the index, not mine) | |
| 4 | rebuilt | `BUILD_OUT=… node build.js` in a selective isolated copy of src, scripts, styles and the ink and contracts docs the build imports | bundle sha256 `22d4a4a51e8075e6…` | built, 0 errors | Copy omits png assets (borrowed from the kj3e proof bundle); tracked `dist/` and the installed app not rebuilt |
| 5 | natural journey (view) | `hpo1o2-2026-11-03/shot.mjs`, 1920x1080, Settings font 14 and 21, window-1 `origin.json` | new bundle | HP lead screenshots **byte-identical** (`cmp`) to the O1/O2 after-shots at 1920, 14 px and 21 px | Layout not human-reviewed |
| 6 | natural journey (view) | same route, native Village start and `life:book.hp.school`, 1920, 14 px, 21 px | new bundle | Village shows 60/60 hp, STR, Stale bread, Cheap leather pants; school shows 102 coins, bread, pants and 60/60 hp (native display, as before; P2 changes it) | No pre-change bundle was built this pass, so "unchanged" rests on the unregistered path returning null (test 1) and on the dumps showing the native figures, not on a byte compare. Screenshots: scratchpad `shots/{village,school}` |
| 7 | natural journey | generated window-1 `play-episode.mjs` (output redirected to scratch), panel `hp` | new bundle | 8 of 8 acts, `{"steps":8,"checks":1,"pageErrors":0}` | Act minutes are fill, as in the window receipt |
| 8 | persistence | `verify-ui.mjs` (scratch copy) | the new run's completed checkpoint and export | reload digest and literal Import digest both equal the completed save; panel at 14 and 21 px, no overflow | First two attempts timed out in `Session.open` (60 s hard wait, machine load 40+); third passed. Installed-app persistence not run |

## Separate states
Source-edited: yes. Focused-tested: yes (19 pass). Rebuilt: isolated copy only. Natural journey: 8 of 8 acts. Persistence: reload and Import match. Human-reviewed: no. Full `npm test`: not run. Implemented below floor: Gu and Shadow Slave views not shot (not touched, P3).

## Open
- **A1.** No live reader is exercised by a real life yet; P2 (school, trade) is the first consumer. The item-notice text refreshes on `applyWorldLook` (each workspace refresh) and the purse on `update_displayed_money`; P2 should confirm the notice changes on the first spend in a real life, headless.
- **A2.** `lifeHoldings` returns raw item keys; labels come from the world's own reader (P2).
- **A3.** The HP lead life keeps `items:[]` and no resources, so it still shows static text; that is deliberate.
