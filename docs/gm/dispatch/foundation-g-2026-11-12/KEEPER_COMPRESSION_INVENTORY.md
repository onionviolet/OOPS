# Gu Keeper compression inventory, 2026-11-12

Chat G, phase 1 ([plan](../../../PROCEDURAL_FOUNDATION_PLAN.md), review [A3](../../../audits/CODEX_FOUNDATIONS_REVIEW_2026-11-11.md#proposed-actions-ranked) and [G4](../../../audits/CODEX_FOUNDATIONS_REVIEW_2026-11-11.md#the-derive-and-implement-world-rules-chat-gu-goal)). Read-only on runtime: no Keeper scene was re-expressed or deleted. That waits for K v0. Everything below the counts is a proposal under AD56.

Regenerate the mechanical columns with `node scripts/gu_keeper_inventory.mjs --markdown` (JSON without the flag). The script reads imports, operation ids (pack commands and `operation === '...'` dispatch), facts keys, numeric literals on lines that touch the clock, and counter arithmetic. It is a heuristic: it misses literals that sit away from a clock word, and it lists operation ids for src modules only where they dispatch by string. The [appendix](#appendix-mechanical-extract) is its output at commit time.

## Counts

| Set | Files | Lines |
| --- | ---: | ---: |
| `src/gu_keeper_*.js` | 31 | 5,324 |
| `src/world_packs/book_gu_keeper_*.js` (scene packs; base `book_gu_keeper.js` excluded) | 36 | 3,104 |
| Review's "67 Keeper and keeper-pack modules" | 67 | |
| Non-keeper `gu_*` modules that keep their own saved scene row (`gu_hosted_wolf`, `gu_wolf_ridge`, `gu_moonlight_stock`, `gu_smoke_passage`, `gu_coordination_trial`) | 5 | 717 |
| All scene modules found by the extractor | 72 | |

Of the 72: 26 write a facts row, 33 export a validator, and **1** (`gu_keeper_procedure`) imports `gu_procedures` or `gu_workshop`.

## The one shape every scene hand-writes

A typical src scene (`gu_keeper_seven`, 107 lines) has five parts. Its pack (`book_gu_keeper_seven`, 65 lines) is already declarative: commands with label, needs, costs and effects.

1. **A JSON row in facts.** `state.worlds['book.ri.keeper.world'].facts['<scene>.work']`, parsed and range-checked by a private `read`.
2. **A counter ledger.** `done(state, op)` reads `state.actors.player.completed['<scene>.<op>']`; the validator replays every counter against the row (attempts, cancels, feeds, casts).
3. **An availability predicate.** `<scene>Actions(state)` returns one boolean per operation from the row, the clock and the counters.
4. **A dispatcher.** `apply<Scene>(state, record, operation)` branches on the operation and calls a shared leaf (refinement begin/step/cancel, activation, claims).
5. **Stock from counters.** `done(op_in) * yield - done(op_out) * spend` stands in for an essence or item quantity.

Parts 1 to 4 are the kernel's working shape (quote, settle, receipt, replay), not a Gu leaf: tagged **K** below and passed to chat K in the shared notes. Part 5 is a W quantity (essence by kind and stage). What is genuinely Gu is the call into the leaf and the catalogue row it reads.

## Scenes grouped by the shared leaf that could run them as data

Leaf codes: **R** refinement and conversion (`gu_refinement`, catalogue `recipe` and `conversion`), **A** activation (`gu_activation`, catalogue `ability`, `gu_fuel`, `gu_sustain`), **M** move search and roles (`gu_move_search`, `gu_move_roles`, `gu_goal_search`, `gu_effect_chains`), **P** ordered procedures (`gu_procedures`, `gu_workshop`), **C** claims and custody (`gu_world_claims`), **J** projection (`gu_projection`), **L** living things (propagation, colony, traits, growth: chat L's lifecycle). K and W mark what moves to the kernel and substrate.

| Scene (pack) | Src module(s) | Leaf | Bespoke today | As data it needs | A3 pick |
| --- | --- | --- | --- | --- | --- |
| seven | gu_keeper_seven | R, A, C | 20 min settle, 1440 feed window, stock `concentrate*2 - cast*2` | recipe and conversion rows (exist), stage duration and diet on the row, essence stock from W | yes |
| nine | gu_keeper_nine | R, A, C | 15 min settle, 30 min hold, 1440 feed, stock `concentrate*yield - cross*crashCost` | same as seven; Charging Crash ability row (exists) | yes |
| red_steel | gu_keeper_red_steel | R, A | 1440 feed, stock `conversions*yield - casts*spend` | conversion row (exists); Moonglow ability (exists) | yes |
| four_flavors, wild_worm, worm_essence | gu_keeper_wild | R, A, L | 1440 meal, 60 min return, 20 min stage, roam and lure | recipe (exists), trait table (exists), diet and roam on L | yes (four_flavors) |
| stealth | gu_keeper_stealth | R, A, C | 15 min cloak, 20 min armor, fish count | two recipes (exist), concealment abilities (exist) | yes |
| fusion, past (time branch) | gu_keeper_fusion | R, J, C | 10 min seal, borrow/return vital counters | Moon Scar recipe row (open: rank), fusion branch comparison as data | later |
| immortal_refinement, _advancement, _reclamation | gu_keeper_refinement | R, C | 20 min stage, 90 min rival, 30 min settle | Fortune Thread recipe row (not chapter-checked in the evidence yet) | later |
| fixed_forge | gu_keeper_fixed_forge, gu_keeper_fixed_claim | R, C, A | 30 min forge, 20 min marks, 20 min care, red date | rank-raise recipe; claim leaf already generic | later |
| moonblade | (pack calls `resolveGuActivation`) | A | none in src | already data | counts as data |
| rank_trial | gu_keeper_red_steel (shared) | A | stage fuel | Moonglow ability (exists) | yes |
| moonlight_trial, moonlight_prospect | gu_keeper_moonlight_trial | A, J, L | 30 and 20 min windows, loan stock | trait table (exists), focus refinement row | later |
| moonlight_stock | gu_moonlight_stock | A, L | borrow/return counters | trait table (exists) | yes |
| rainbow | gu_keeper_rainbow | A | 16 min sustained flight | Rainbow Light ability row (new parts row; ability still authored in module) | yes |
| attitude | gu_keeper_attitude | A, C | 30 min, mental stock | ability (exists), loan grant from C/K | later |
| smoke | gu_smoke_passage | A | reserve `2*(start+replenish) - listens` | sensing abilities (exist), reserve from W | later |
| hosted_wolf | gu_hosted_wolf, gu_wolf_ridge | A, L, C | wolves, plunder, 20 min, population | Thunderclap, Thunderwings, Plunder rows; ecology on L | later |
| stargate, stargate_sky | gu_stargate (41 lines) | A, W | starlight per crossing | starlight as a W quantity read by the ability | later |
| fire_trial | gu_keeper_fire_trial | M, A | 12 literal, borrow/return | Red Fire set rows (exist, already searched in tests) | yes |
| move_trial (and tray move) | gu_keeper_move_trial | M, A | notes, research flags | move row (Little Light, exists), move records from the evidence | yes |
| goal | gu_keeper_goal | M | screen store | goal as an effect query over abilities | later |
| (no pack) defense | gu_keeper_defense | M, A | layered shield order | three guard abilities (exist) | later |
| (no pack) chain | gu_keeper_chain | M | passage notes | effect chain rows | later |
| beam_procedure | gu_keeper_procedure | P, R, A | 10 and 15 min link and condensation | already on `gu_procedures` | counts as data once K exists |
| spirit | gu_keeper_spirit | P, C | supports batch, failure order | Soaring Fighting Spirit as a procedure row; Fight parts row (new) | later |
| (no pack) giant_hand | gu_keeper_giant_hand | P, R, C | 20 min refine, phantom counters | Myriad Self, Group Strength parts rows (new) | later |
| (book_gu_coordination) | gu_coordination_trial | P | 10 min formed window | coordination as a procedure | later |
| (no pack) transit_house | gu_keeper_transit_house | P, C | 15 min frame, 6 | house assembly row | later |
| fixed_immortal_travel | gu_keeper_immortal_travel | A, C, J | impressions per site | ability (exists), impression from knowledge owner (GKM245) | later |
| insight_moth | gu_keeper_cooperation | J, L | 30, 20, 10 min, 1440, 15 | agency belongs to chat A; projection leaf generic | later |
| (no pack) signal | gu_keeper_signal | A, J | notes | signal leaf generic | later |
| propagation | gu_keeper_propagation, gu_keeper_potato_market, gu_keeper_drain | L, A | 5, 45, 2; market stock | producer and product parts rows (new); propagation on L | later |
| firefly_farm, firefly_care | gu_keeper_colony | L | 60, 30 | Starlight Firefly parts row (new); colony on L | later |
| ant_nest | gu_keeper_ant_nest | L, C | 40 min brood | Ant Nest parts row (new); colony on L | later |
| vitality | gu_keeper_vitality | L, R | 15 min leaf growth, 1440 rest | growth and treatment rows (exist) | yes |

**First compression set (A3, ten scenes, for after K v0):** seven, nine, red_steel, four_flavors, stealth, rank_trial, moonlight_stock, rainbow, fire_trial, vitality. All their kinds already have chapter-checked catalogue bindings, and their leaves (R, A, M) need no new Gu law. Move_trial is the reserve pick. Each one deletes a src module and leaves its pack as the command surface over one generic Gu working.

## Timing constants found (authored, scene-local today)

Settle and stage minutes: seven 20, nine 15 (hold 30), cloak 15, armor 20, fusion seal 10, Giant Hand refine 20, refinement stage 20, rival 90, advancement settle 30, fixed forge 30, marks 20, restoration care 20, beam link 10, condensation 15, transit house 15, leaf growth 15, ant brood 40, attitude 30, moth light 30, lesson 20, seal 10, prospect work 30, window 20, echo 30, rainbow flight 16, coordination 10.

Feeding and rest: 1440 minutes in seven, nine, red_steel, wild (meal), cooperation and vitality (leaf rest; the chapter says one hour, the module also uses a day for the feed window). Worm return 60.

Default proposal: stage minutes move onto the recipe row (`stages[].minutes`), feeding intervals onto the kind's diet (chat L), and windows onto the working's quote (chat K). Each keeps a dial in the world pack with its reason.

## Stock arithmetic found

`seven`, `nine`, `red_steel` and `smoke` compute an essence or dose stock from counters. `drain`, `potato_market`, `vitality`, `stealth`, `transit_house` and `fire_trial` compute item or custody counts the same way. `cooperation`, `fixed_forge`, `fusion`, `giant_hand`, `moonlight_trial`, `moonlight_stock` and `spirit` replay borrow minus return counters to check custody. All three patterns become reads of one owner: essence and items as W quantities, custody as C plus K's grant.

## Appendix: mechanical extract

See `node scripts/gu_keeper_inventory.mjs --markdown`. Counts at commit: `{"keeperSrc":31,"keeperPacks":36,"sceneSrc":5,"total":72,"sharedProcedureImporters":1,"factsWriters":26,"validators":33}`.
