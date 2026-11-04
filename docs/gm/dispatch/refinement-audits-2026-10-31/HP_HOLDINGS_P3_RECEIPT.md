# Own-holdings P3: Gu and Shadow Slave live readers, 2026-11-04

P3 of [OWN_HOLDINGS_PLAN](OWN_HOLDINGS_PLAN_2026-11-03.md), after [HP_HOLDINGS_P2_RECEIPT](HP_HOLDINGS_P2_RECEIPT.md). Rules: AD44, AD46, AD51, AR1-AR16, display only. **Agent-verified, not human-reviewed.** Nothing committed.

## What was wrong
The five Gu and Shadow Slave lives showed the native Village hero's purse and items over their own stock (essence, stones, stipend badges, trial supplies).

## Holdings table (what each life holds, and what is shown)
| Life (world id) | Purse line | Items line | Source |
| --- | --- | --- | --- |
| Shadow Slave apprentice (`book.ss.apprentice.world`) | "12/12 essence, no coin" | keepsake, coat, gloves, soul shard xN | energy `book.ss.apprentice.essence` reserve/capacity; native-stock items |
| Shadow Slave trial (`book.ss.trial.world`) | "no coin; trial supplies only" (declared; no currency exists) | trial supplies xN, healing salve, fragment | native-stock items |
| Shadow Slave company (`book.ss.company.world`) | "N stipend badges, no coin" (Sera holds all six at start, so 0) | gems, rope, brace, bandage, ration (badge excluded) | native-stock items |
| Gu academy (`book.ri.academy.world`) | "6/6 primeval essence, no coin" | petals xN, Moonlight Gu once refined, bamboo, cut bamboo | energy `book.ri.academy.primeval`; native-stock items |
| Gu keeper (`book.ri.keeper.world`) | "3 primeval stones, 8/12 primeval essence" (stones are the money) | petals, dried petals, lees, jade, Gu carriers | stone item count; energy `book.ri.keeper.primeval` |

## What changed (source-edited)
- New `src/book_life_holdings.js`: `registerBookLifeHoldings()` registers the five worlds with P1 readers and static fallbacks. Items come from the native inventory through the `character` port, filtered to the life's own ids; essence from `state.simulation.energies.player`. No port or no energy falls back to the static text.
- `src/book_world_beginning_registration.js`: one hunk, the call beside `registerHpLifeHoldings()` inside the existing `hpPorts` guard. No pack, hash, save or migration touched. HP lead files untouched.
- `tests/own_holdings.test.js`: one test covering all five lives (live values, follow a spend, stone count, badge excluded, other-world items excluded, fallbacks, Village null).

## Price/spend paths and the native purse
No code was changed in any price or spend path. These lives price in their own items (keeper stones via `transfer` of the `book.ri.keeper.stone` key) and energies; none reads `character.money`. Grep of the five packs for `money`/native coin was not exhaustive beyond the pack files named above.

## Checks
| # | Command / route | Result | Gap |
| --- | --- | --- | --- |
| 1 | `node --test` own_holdings, hp_lead_life, world_look, gu_life, gu_upkeep, shadow_company_life, shadow_slave_life, shadow_slave_trial, structured_beginning_choice, world_pack_hp, hp_school_progression | all pass (own_holdings 5/5, 69 in the life slice) | no full `npm test`, by instruction |
| 2 | `BUILD_OUT=$SC/out npm run build` (isolated; tracked dist/ not rebuilt) | built | |
| 3 | `npm run check:arch` | main.js 10110, display.js 6757, under baseline | |
| 4 | `npm run check:rules` | PASS (1 warning, untracked file not mine) | |
| 5 | Headless Playwright 1920x1080, `p2persist.mjs`, starts | apprentice "12/12 essence, no coin" and own items; trial "trial supplies x4, healing salve"; company "0 stipend badges", own items; academy "6/6 primeval essence", "petals x12"; keeper "3 primeval stones, 8/12 primeval essence", "petals x8". `data-own-holdings=on` each. No Village bread or purse | |
| 6 | Apprentice: Study (-2 essence, keepsake leaves then returns), Fit coat (-3 essence, shard x2 to x1); reload and literal Import | Purse "7/12 essence", items identical after reload and Import; digests equal; 0 page errors | |
| 7 | Trial: Prepare (supplies x4 to x2); company: Commit one gem (gem x2 to x1); reload and Import | text and digests equal after each; 0 page errors | |
| 8 | Keeper: chores + 60 min twice (stones 3 to 4, essence 8 to 10), then Buy (stones 4 to 3, petals x8 to x16) | Live values follow every step. Reload digest equal. **Import not completed**, see A1. Chores-only run (stones, essence): reload and Import digests and text equal, 0 page errors | A1 |
| 9 | Academy: Refine (essence 6 to 5, Gu appears), Learn, take bamboo, Cut (essence 4/6, "cut bamboo") | Live values follow every step. Reload digest equal. **Import not completed**, see A1 | A1 |

## Open
- **A1.** Literal Import in this harness times out (60 s wait for the load screen) for the academy at start +1 minute and for the keeper after Buy. Control: the same runs on a copy of the isolated bundle with `registerBookLifeHoldings` made a no-op time out identically, so it is not caused by this display change. Not diagnosed here; the Import path of those two saves needs its own look.
- **A2.** Before screenshots were not captured per life; the control above is the registration-off bundle. The Village hero's own display was not re-run in the browser (unit test asserts `ownHoldingsView('base.frontier')` is null; P2 covered the Village at both font sizes).
- **A3.** Not run at 14 and 21 px; 1920x1080 only (the task's viewport). Layout not human-reviewed. Installed app not run.
- **A4.** `src/book_world_beginning_registration.js` also carries window 4's uncommitted HP lead edits; the committer must take only the P3 hunk.
