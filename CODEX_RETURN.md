# W12 process crafts return

## Result and ownership

Implemented proposal with partial engine-world coverage under AD32, PFP3, PFP22, PC70 and KW1-KW14, agent-verified, not human-reviewed. Runtime seam is `defineWorkingLaw` in `kernel_working.js`, following [AR3/AR4/AR5/AR10/AR11/AR13/AR14](docs/ARCHITECTURE_RULES.md). The named fixture is `tests/process_law.test.js`.

Work remains uncommitted on `codex/w12-process`, following the user's direct instruction that the owning Claude chat reviews and commits. That instruction supersedes the embedded brief's commit paragraph. Starting and final HEAD is `0876c3906d2c94d0180793bb5311fbe73459a169`.

## Files changed

| File | Change |
| --- | --- |
| `docs/gm/dispatch/foundation-run-2026-11-12/FAMILY_PROCESS_CRAFTS.md` | Created the census section, its 71-row table, five-line summary and two outside-pattern inventories. |
| `src/process_law.js` | New `f.process@1` kernel law with `hold` and `work`, exponential thermal crossings, competing share transfers, scalar drift, graded means, causal paths, balance, projection, method snapshots and recoverable interrupted pieces. |
| `src/load_law.js` | Independent property-capacity reader, exporting `applyLoad(thing, load, thresholds)`. |
| `tests/fixtures/process_craft_packs.js` | Original steel and kitchen data, apparatus, tool substitutes, load thresholds, and neutral mechanism probes. Numbers have calibration comments. |
| `tests/process_law.test.js` | Six requested worked tests, interruption rescue, and three mechanism/integrity tests. |
| `CODEX_RETURN.md` | This return. |

`CODEX_LANE.md` was already untracked at startup and remains unchanged. Existing source, UI, package configuration, dist, and the node_modules symlink retain their starting state.

## Verification

Commands ran in this worktree against the source/fixture hashes below. Final results follow.

| Command | Exit | Pass / fail | Scope and gaps |
| --- | --- | --- | --- |
| `node --test tests/process_law.test.js` | 0 | 10 / 0 tests | Six worked cases, interrupted rescue, analytic band time, competition, needs in all three scopes, absent drive, cold/isolated exposure, coarsening, immutable method rows, actual holder addressing and malformed-data checks. |
| `node --test tests/brew_law.test.js tests/kernel_working.test.js` | 0 | 40 / 0 tests | Unchanged brewing and kernel neighbours. |
| `npm run check:arch` | 0 | Architecture gate passed, 0 failures | Main growth -1, display/save growth 0. Existing 6 main imports and 205 cyclic edges retained. |
| `npm run check:rules` | 0 | Composite rule gate passed, 0 failures | 58 register rows, 56 AD codes, 1540 relative links, 54 receipts checked. Existing warning lines below. |
| `node scripts/reachable.mjs --is src/<file>` in a shell loop over every census file | Mixed by file | 69 reachable / 2 unreachable | Reachability is an import-graph result. It establishes which files the game loads. |

The initial seven-test run had 6 passes and 1 failure. The reversed-order fixture lost too much structure while crossing the softening band to meet its harder-result assertion. Its low oven's exchange dial was changed from 2 to 12, with a strongly circulated contact reason. The second run passed all seven. The final suite adds three mechanism tests and passes all ten.

Existing rule-check warnings, reproduced with final inputs, are outside this lane's paths.

```text
WARN  TMR1  src/book_world_hp_exams.js:14  Math.floor((Math.max(0, state.clock - o.at) + 480) / 1440)
WARN  .claude/rules/research-and-agents.md: glob "private_packs/**" matches no file
```

Source input SHA-256 values follow.

```text
bec7255b0c765a02e871ba142b4f387a57942c1ce56298bb71c6b16e1c3ae33f  src/process_law.js
902646507229e98ced108dc727c51ad7763dc502d3872682f1f35609062af3e2  src/load_law.js
7a3b936ee1f3e5ae578a7e5127a4f0ba70d51fbf9ab91bdb86a9170b928d645d  tests/process_law.test.js
0d071e2c23077c52d974add2d4d652a69c80505efc485a7dc434c96ef3f9c7e7  tests/fixtures/process_craft_packs.js
```

## Census five lines

Total files 71. The scope matches top-level `src/craft_*`, `crafting_*`, `material_*`, `gear_*`, `vessel_*`, `mixture_*`, `forge*`, `assembly*`, `lineage*`. No top-level `forge*` or `assembly*` files exist.

Process files 12, using state moved through operations as the classification.

Game loads 69, with `craft_process_cues.js` and `material_corrosion.js` unreachable.

Kernel use is `craft_assembly.js` importing `kernel_working.js`. No matching file imports `craft_working.js`.

Steps present are heat, quench, cool, work, grind, stir, separate and dry. Fold, cure and age are absent as causal craft steps. Hide preparation retains a smoke/oil treatment and quality shift without curing kinetics. Material lineage tracks birth times and age-based heirloom value without an aging craft step. Temper is present as a discrete treatment stage in `gear_work.js`.

The family census also inventories the other kernel users and process leaves. Census classifications are an inventory judgment from headers, exports and bounded targeted confirmation, rather than a runtime exercise of every listed module.

## Six worked proofs

| Code | Test name | What it shows and key numbers |
| --- | --- | --- |
| W1 | `1. Forge, quench, temper trades hardness for toughness under the same load` | Tempered hardness 76.8203603, toughness 76.7890803. Untempered hardness 97.7221912, toughness 14.0835875. At force 40 and shock 50, tempered holds and untempered fractures. Final-step property effects address the piece holder. |
| W2 | `2. Order matters with a cause when tempering precedes quenching` | Reversed hardness 95.4042311, toughness 15.5429484. Early temper has 39.8378411 minutes in band but moves 0 and reports `nothing of hard present`. The last quench leaves 932.9187345 of 1000 structure units hard. Its lower-temperature residence and remaining hardening both stay in the path. |
| W3 | `3. A way around uses slower media and longer weak-tool work` | Water/oil/air middle-band residence is 0.0661627 / 0.9924398 / 9.9243985 minutes, producing hardness 97.7221912 / 72.6179411 / 30.4898265. All methods complete. Reference hammer work for 8 minutes gives grain 2.21801755. Quarter-impact stone for 8 minutes gives 6.45877594, and for 32 minutes gives 2.21801755. |
| W4 | `4. A cooking pack uses the same law and excessive heat worsens its result` | Regular bake nourishment 117.6976560, moisture projection 30.9411794. Added excessive heat produces 974.3653862 charred units, nourishment 2.8871658, moisture 13.9027681. The cause records excessive heat charring the cooked portion. |
| W5 | `5. An independent property load law reads processed and unprocessed things` | The same call reads all four projected samples and a plain unprocessed thing. Tempered holds, untempered and oil-cooled samples fracture, air-cooled sample bends. Plain hardness 65 / toughness 70 holds the same force 40 / shock 50. No process/load imports cross the pair. |
| W6 | `6. One settlement or several and save/restore keep identical workings and engine properties` | A 56-minute method settled once or at every minute has deep-equal records and effect envelopes. JSON serialization/restoration after quench reproduces the entire final record. A separate long-temper endpoint in `createEngineWorld` applies real property effects through `applyEngineOps` and restores exact hardness 75 / toughness 89 after world JSON save/restore. |

`An interrupted quench keeps its piece and a fresh method rescues it by tempering` also proves that the recovered piece's structure and path survive interruption, and that the rescue piece state is deep-equal to the uninterrupted result.

## Existing consumer lookup and possible absorption

C5 lookup found no matching property force/shock consumer. `absorb_e2/durability.js` owns condition wear and reads an item wear-scale method. `contest_bodies.js` owns vitality/stamina and lifecycle consequences. `notch_contest.js` compares log-scale notches and exposes hit estimates. `craft_assembly.js` compares measured capacities on assembly load paths. This is the reason for the brief-permitted `load_law.js`.

| Existing surface | Possible later expression through this law | Retained responsibility |
| --- | --- | --- |
| Brew `heat` | A medium exposure and temperature-band transfer/drift rows can express a single body's temperature-driven changes. | Brew keeps extensive lot accounting, fuel, steam publication and custody. |
| Brew `cool` | Change the medium and settle the same monotone thermal curve. | Brew keeps burner state and the shared world's actual thermal owner. |
| Brew `stir` moves | Tool-property-driven exposure rows can move structure or scalars while stirring. | Stroke direction, reversal/cadence memory and amounts among ledger buckets need their current owners or an explicit future adapter. |
| Brew `prepare` changes | Preparation can become work-driven rows on a piece, with the resulting shares handed to admission. | Measured lots, exact extensive amounts, preparation identity and admission remain brew responsibilities. |
| `craft_process_thermal.js` | Extraction residence window becomes one band row. The degradation-above threshold becomes a second band row with a pack-supplied upper bound. | Apparatus quoting, paid fuel, world thermal state and extensive yield accounting remain separate. |
| `gear_work.js` | Heat, hot work, quench and temper can become pack methods on `hold`/`work`. | Native stock costs, equipment identity, stat landing and host control stay with the workshop owner. |

## Choices and remaining gaps

D1. Bands use a lower-inclusive, upper-exclusive interval. Needs read the state at each temperature segment's start. Share rows that compete for one source divide one exponential depletion. Overlapping scalar drifts combine rates toward their rate-weighted target. These are mechanism proposal defaults.

D2. `options.minutes` is a snapshot copied by `processMethod` from the step duration because the kernel settlement callback supplies a deadline and step index, without the step's duration. The law stamps its state clock at that deadline. `unfinishedPiece` preserves the settled state and earlier path for a new method.

R1. The existing world substrate's `level` property type requires whole values. Normal weighted projections in this fixture are fractional. A direct `applyEngineOps` probe with hardness `76.82036028279533` reports `World substrate: holder sample: hardness has a bad value.` The engine test deliberately uses a 1000-minute tempering endpoint with exact whole-valued projections, while the law preserves exact weighted sums throughout. Arbitrary fractional projected results landing in the world remain unimplemented. The permitted files cannot change the substrate's property schema.

R2. This is a fixture-proven foundation with a partial W6 engine gate. The ordinary 56-minute method's fractional projections have no successful world-property round-trip. The whole-valued equilibrium fixture proves a narrower case. Live host/UI adoption and the broader AD43 gameplay floor remain open. Build, full-suite, browser, installed and human-play evidence were outside this lane's authorized checks. Commit and integration remain with the owning chat.

Continuation audit confirmed the same property validation in the current substrate and the same partial engine fixture at HEAD `0876c3906d2c94d0180793bb5311fbe73459a169`. Full completion remains unproven while R1 is unresolved and the owner-held commit is pending.

Change request for the lead or substrate owner under R1: support bounded finite numeric properties in `src/world_substrate.js`, or choose an explicit host-side integer scaling/quantization contract before landing general fractional projections. The current law's exact weighted projection semantics stay intact. No forbidden file was edited for this request.


## Lead review changes (after this return)

- `src/process_law.js`: segments are cut into slices so a row fed by another row in the same segment moves (PCR1 in the family doc); reasons are kept for rows that stood still; landed property values are rounded to whole levels, which resolves R1 for the fixture.
- `tests/process_law.test.js`: test 2 now tempers cold stock first, and adds the forge-to-oven path; test 6 lands the ordinary 56-minute blade in the engine world, settled at each deadline on the world clock. The whole-valued 1000-minute endpoint fixture was removed.
- Numbers in the table above predate these changes; current numbers are in `docs/gm/dispatch/foundation-run-2026-11-12/FAMILY_PROCESS_CRAFTS.md`.
