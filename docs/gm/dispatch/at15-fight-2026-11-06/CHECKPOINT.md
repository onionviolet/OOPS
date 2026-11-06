# AT15 step 1: a fight on the shared parts (2026-11-06)

```receipt
build: n/a
route: fixture(kj3z ckpt-range with B8 proof acts)
state: built
viewport: 1920x1080
persistence: checked
tests: tempo_stock 6/6, existing tempo* 35/35 unchanged, defeat_domain 4/4, check:arch pass, build pass; npm test 5210/5211 (failure outside this slice)
review: none
```

Receipt notes: build hash not recorded. State is "built", which this project reads as implemented below floor (AD43): FLR2 and FLR3 fail (T1, T2), so the fight was not reached natively. Persistence "checked" means the fixture save and reload of an open fight with stock in `tests/tempo_stock.test.js`; a native save/Export/Import of a finished fight was not reached.

Weibao, 2026-11-06: "Yes, do step 1" (step 1 of the [round 2 revised order](../../../audits/LARGER_FOUNDATIONS_2026-11-06.md#revised-order-proposal): fight through the existing frame, open the move list, stock holder, fog into fights, plus RD1). Applies AR1-AR16 (seam: `tempo_fight.js` and `tempo_fight_contract.js`, world-neutral; LOTM side in its own module), AD36, AD43, AD46, WPR5 dials. Owner: this chat (Claude, primary checkout). Owned paths: the files listed below.

## What changed

| Piece | Change | Evidence |
|---|---|---|
| Move list (lane C N1) | `TEMPO_STOCK_MOVE_IDS` (`shoot`, `reload`) and `TEMPO_ALLOWED_MOVE_IDS` in `tempo_fight_contract.js`; validator reads the allowed set; `TEMPO_MOVE_IDS` and the default `KEEP` list unchanged, so a fighter without stock never gets the new moves | tempo_stock test 1; the 35 existing tempo tests pass unchanged |
| Stock in the fight (N4, FD3) | Optional `fighter.stock` (`kind, loaded, carried, capacity, batch, vs:{foeId:{chance, downIn}}`, player-only `keys` and `start`). Shots spend inside the fight record; `finishFight` writes the loaded and carried deltas back once as `resource` effects in the result commit | tempo_stock tests 2-4 |
| Shot resolution (FD2) | One keyed draw (`draw(b,'shot',...)`) against the world's precomputed chance; a hit takes `maxHp / downIn` (named dial `shotDamage`) | tempo_stock tests 2, 3 |
| Fog (RD2, N6) | Optional `conditions.visibility === 'fog'` adds `fogMishap` 0.03; absent key leaves every chance unchanged. LOTM shot odds take one notch off in fog (`LOTM_FIGHT_DIALS.fogNotches`), from `lotmLight` | tempo_stock tests 5, 6 |
| Openers | `src/tempo_starters.js` (leaf registry); `tempo_fight_domain.js` lists visible openers, adds a `begin` command, titles the panel per fight, and passes the player's own `worldId` to the harm ladder instead of `'default'` | not reached in play (T1) |
| LOTM proof opener | `src/book_world_lotm_fight.js`: "Face the corpse-handler (proof fight)", an original hostile, labelled as mechanism proof (first canon gunfight is ch103 P054, past the built windows); reads B8 stock and `shotOdds`; registered from `book_world_lotm_actions.js` | quote renders natively: "6 loaded, 14 carried." |
| RD1 | `defeat_domain.js` `DEATH_CAUSES` gains `loss_of_control`; allowed, no producer yet | defeat_domain 4/4 |
| Runner | `scripts/lotm_slice/at15-fight-proof.mjs` | see run below |

NPC stock (N7) is not done: foes carry no rounds in this slice. Ability moves and fight-log concealment (FD18, N3) are out of scope.

## Native run (headless, rebuilt bundle, origin kj3z `ckpt-range`)

Hire then load: carried/loaded 20/0, then 14/6. The tempo panel then rendered the opener with its quote, hidden and disabled. Stopped there, per the advisor's rule: a failed integration check is the finding, not something to build around in this slice.

## Findings

| ID | Finding | Evidence | Consequence | Next |
|---|---|---|---|---|
| T1 | The tempo host is Frontier-only. Its `writable` port is `harvestWritable` (`main.js`), which refuses unless `worldId === 'base.frontier'` ("Return to the frontier world first.") | main.js `harvestWriteReason`; opener disabled with a correct quote | No world but Frontier can open a tempo fight from the UI, whatever the engine supports | Give the tempo domain a world-neutral write check (the LOTM ports already have one) |
| T2 | The panel is filed under the hidden notebook module (`notebook_view_people` > `workspace-module`), not the LOTM view | probe of the live page | A Tingen player cannot see a fight even when one is open | Surface the open fight and the opener in the LOTM panel; UI work under DESIGN and UR rules with a 1920x1080 capture |
| T3 | The B8 runner (`b8-range-proof.mjs`) is stale: at the checkpoint the arc shows the act as a direct button, not a task link | probe: "Hire a revolver · 10 min" button, 0 task links | Old B8 proof cannot be rerun as written | Use the direct-control click, as the AT15 runner does |

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/tempo*.test.js` before edits | 35/35 | baseline |
| same after edits, plus `tests/tempo_stock.test.js` | 41/41 | |
| `node --test tests/defeat_domain.test.js` | 4/4 | |
| `npm run check:arch` | pass, no new cycle | |
| `npm run build` | pass | hash not recorded |
| `at15-fight-proof.mjs` | stops at T1/T2 after hire and load | fight not played natively |
| `npm test` (limiter, working tree with other sessions' edits) | 5210/5211 pass; the one failure is `tests/ui_contract.test.js` UR65 spacing in `styles/ui_extras.css`, another session's uncommitted edit, not an input of this slice | |
