# Procedural system audit, 2026-11-17

Register status: Proposal (AD32). Codes PSA1 onward. Agent-verified on master `3f72035c3`, not human-reviewed. Read-mostly: no runtime code was changed.

Weibao, 2026-11-17: "consider auditing the procedural system we have 'built' thus far and see if its true or useful, and then plan revamps and more?" Method: the claims in [PROCEDURAL_CORE](../PROCEDURAL_CORE.md) (PC), the [generator rules](../GENERATION_FOUNDATION_RULES_2026-10-14.md) (GR), the [grammar contract](../PROCEDURAL_GRAMMAR_CONTRACT.md) (PGC) and the [power palette](../research/power-catalogues-2026-11-16/README.md) (PWC, rounds 1-12) were each checked against the tree. "True" means the code does what the doc says. "Useful" means a player of a fresh life can see or use the effect.

## Checks run

| # | Command | Result | Gap |
| --- | --- | --- | --- |
| 1 | `node scripts/reachable.mjs` | 1,650 of 1,893 `src` files reachable from `src/main.js`; 1 computed import (`translation.js`, harmless). 243 unreachable | Reachable is not called: it means some importer chain exists, not that a played life runs it |
| 2 | `node scripts/reachable.mjs --json`, filtered to laws, packs and substrate packs | Unreachable: `gu_working_law`'s siblings `spell_law`, `process_law`, `load_law`, `effect_checks`, `grammar_search`, `spell_grammar`, `lotm_derived_formulas`, `procedural_places`, `procedural_societies`, `world_packs/{brew,gu,hp}_effect_pack`, `world_packs/lotm_derived_cases`, 7 `world_substrate_packs/*` (20 files) | `src/` imports solely; tests may load them |
| 3 | `node scripts/coverage_report.mjs` (then restored the generated README) and `--check` | 211 ledgers, 0 unclassified, `--check` PASS. Computed across all ledgers: **expressed 725, runs 0, typed `runs-*` rows with no case 1,765** | The report counts a typed `runs` row with no case as a hand-typed state. PC10 (a) says the check should fail; it passes |
| 4 | `node scripts/compression_report.mjs` | C1 41 (baseline 41), C2 68, C3 5, C4 4, C5 4, C6 **3 of 7** (rose from 0). "Baseline holds" | A ratchet that solely holds is not progress. C1, C2, C3 and C5 sit above their proposed floors |
| 5 | `node scripts/check_generators.mjs` | Detector sees 8 generators (all `gen_kit` primitives): reader 5, seed sweep 4, save/reload 3, golden 0, budget 0 | Self-described as a static census; it does not see the 60-plus generators outside `gen_kit` |
| 6 | `node --test` over `procedural_grammar`, `effect_grammar`, `world_effects`, `gen_kit`, `emergence_harness`, `grammar_search`, three `*_heldout` files | 95 of 95 pass | Tests import modules directly, so a pass does not prove the game loads them |
| 7 | `node --test` over `spell_grammar`, `gu_coverage`, `lotm_derived_formulas`, `book_power_ledgers`, `worm_power_ledger`, `process_law` | 66 of 66 pass | Same gap; also several assert a label, not a world change (PC F3) |
| 8 | `grep` for callers of `applySentence`, `fitGrammar`, `canonTest`, `generate(` in `src/` | `applySentence`: `effect_grammar`, `effect_host` solely. `fitGrammar` and `canonTest`: defined in `procedural_grammar.js`, called by no reachable module. No runtime `generate(` caller outside the grammar file | Importer lists above show who loads; none of these has a play-time caller I could find |
| 9 | `yairpg-game` MCP: fresh life, seed 11, 7 days stepped (about 220 s wall) | Procedural-looking content that appeared: a courier offering a route pamphlet, a supply runner asking five coins for a meal, ambient village lines, three skills unlocking, an insight unlock. No sentence-grammar effect, Gu, potion, spell or derived-rule content appeared | A village start is one slice. Gu, Hogwarts and Tingen lives were not played; their packs are the unreachable ones in row 2 |
| 10 | `ls docs/coverage/derivation_rules.json`; `grep` for a pin store | Neither exists. GA5 is a spec line; no pin store module is in `src/` | PWC80 and PWC92 are written against files that are not built |

## Scores per piece

True = code does what the doc says (true / partly / not). Useful = a fresh-life player can see or use it (useful / latent / not).

| Code | Piece | Doc claim | Code | True | Useful | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| PSA1 | **gen_kit addresses** (GR1, GR2, GR3) | Pure addressed draws, integer weights, retries | `src/gen_kit.js`, about 65 importers, all reachable | true | useful | Check 1 and 6; the director, crowd, scene, crafting and societies draw through it, and the village week showed visible events |
| PSA2 | **Generator contract GR11, GR12, GR16** (budget, reader, three tests) | Every generator ships them | Census sees 8 generators | partly | latent | Check 5: golden 0, budget 0 among those 8; no census for the rest |
| PSA3 | **Pin store and address space** (GA5, G6) | One store for canon and cheat pins | No module | not | not | Check 10. PWC92's "pinned exceptions" lean on it |
| PSA4 | **Procedural grammar** (P, PGC1-PGC12) | One assemble gate, fit, generate, canon test | `src/procedural_grammar.js` (reachable, 434 lines) | partly | latent | Tests pass; `fitGrammar`, `canonTest` and `generate` have no runtime caller (check 8). Reachable solely because `agency` and `procedural_societies`-adjacent files import its helpers |
| PSA5 | **Generation fit** (PC11: pair support, rediscovery, share shift, executes) | Four numbers per grammar on held-out folds | `*_heldout` modules per world; no one report | partly | latent | Pair support 96.5% and the sentence tests exist; rediscovery was "not measured" in PC3 and is solely per world. Known traps stay open: labels read from the predicted field, and an effect "runs" check that looks up a name (`effect_checks.js:89-94`) |
| PSA6 | **Effect grammar and lowering** (PGC13-PGC18, `effect_grammar.js`) | Seven-part sentence lowers to W acts | `lowerEffect`, `applySentence`; reachable | true | latent | Check 6 passes. Two reachable callers (`effect_host`, `effect_grammar`) and six sentence objects still map to `null` and publish for no answering owner (PC7) |
| PSA7 | **Effect host** (PC8: one K-to-W joint) | A settled working lands as a sentence | `src/effect_host.js` `landEffect`, imported by 8 files | partly | latent | It exists and is reachable, but Gu and spell laws still emit their own labels (PC F2); `landEffect` is used by a handful of packs, not by the laws |
| PSA8 | **World effects and substrate** (W) | One world state that effects change | `world_effects.js`, `world_substrate.js` (1,130 lines), `world_quantities.js` | true | partly | 59 test files and about 30 packs import the substrate. Seven substrate packs are unreachable (check 2), so their quantities not move in play |
| PSA9 | **Engine laws** (`gu_working_law`, `spell_law`, `brew_law`, `process_law`, `load_law`, item-bound) | One K law per domain | Gu law reachable, `spell_law`, `process_law`, `load_law` not; item-bound moved 108 of 2,897 rows | partly | latent | `load_law` has no importer at all. The item-bound law (PWC60) shows the pattern: a law whose fields rows lack takes 3.7% |
| PSA10 | **Coverage ledgers and the `runs` state** (PC9, PC10) | A `runs-*` row proves a case executes | `coverage_report.mjs` | partly | latent | 211 ledgers, 61,756 rows. Computed: 725 expressed, **0 runs**. The 1,765 "runs" in the palette's round-10 table are typed states with no case. This is the PC F3 trap left in the headline number (PSA19) |
| PSA11 | **Compression ledger** (PC12) | One script, a baseline that solely shrinks | `compression_report.mjs` | true | not for a player | Check 4; it measures the work, and its three smallest rows barely moved since 2026-11-12 |
| PSA12 | **Emergence harness** (PC13 lint, PC4 chains) | Three multi-domain chains run on loaded packs | `emergence_harness`, `emergence_known_chains.json` | partly | latent | Harness test passes. The brew pack it composes is in check 2's unreachable list, so a chain counts toward PC4 solely as a test |
| PSA13 | **Derivation scores** (PWC80-PWC83) | Backtested rules carry `confidence` per row | `lotm_derived_formulas.js` (unreachable), `derive-*` lanes in progress | not | not | `derivation_rules.json` does not exist (check 10); the LOTM rules exist as code and a test solely |
| PSA14 | **Field-fill laws** (PWC60) | Fill fields before the law, dry-run the count | Item-bound law plus lane `slug-fieldfill` | partly | latent | The 3.7% result is the dry run; the batch lane is open on another branch |
| PSA15 | **Rule search** (PWC90-PWC99) | Sonnet proposes rules as code, local scorer picks, frozen fold once | `grammar_search.js` (159 lines, unreachable, one importer) | not | not | Proposal. The nearest code is an unrelated grammar-weights search |
| PSA16 | **Power ledgers** (PWC1-PWC7; Worm, Re:Zero, Perfect Run, Gu, potions, tabletop) | One power sheet per world | 211 JSONL ledgers; 6 with computed expressed rows | partly | latent | 47% catalogued, 47% blocked, 725 expressed. Catalogue breadth is real; effect on play is 0 so far |
| PSA17 | **Duplicate parallel shapes** (C3, C4) | Collapse to K and sentences | `craft_working`, `spell_working`, `creature_methods`, `gu_procedures`, `method_program`; four effect vocabularies (`guFamilyEffects` 23, `spellLabels` 4, `wOps` 106, `pSentences` 32) | not | not | Check 4: C3 stays 5, C4 stays 4 |

## What the audit found

- **PSA18 · The core is real and reachable, the content on top of it is not.** `effect_grammar`, `procedural_grammar`, `world_effects` and the substrate load from `main` (C6 3 of 7, up from 0). The packs and laws that give them something to do (`brew_effects_pack`, `gu_effect_pack`, `hp_effect_pack`, seven substrate packs, `spell_law`, `process_law`) do not. A played life not runs a sentence.
- **PSA19 · The "3% runs" headline is mostly typed, not run.** Computed `runs` is 0 over 61,756 rows; 1,765 typed `runs-*` rows have no case and 725 are expressed (library-solely). PC10(a) and PC9 say a hand-typed `runs` fails the check, but `--check` passes, so the circular metric PC F3 named is still the number the palette reports. Fix the report before a new wave leans on it.
- **PSA20 · Labelling outran engine capability.** PWC14 already said labels move rows between blocked states; this audit agrees. 28,772 blocked rows use 182 slugs, and six slugs hold half. More label passes change the denominator, not the player.
- **PSA21 · Parallel pipelines are forming around one missing joint.** Four efforts (field-fill laws, derivation scores, rule search, the pass runner PWC18) each define their own row shape, score file and fold split. None shares `case`, `expect` or the runner of PC5 and PC10. Without that one runner, each makes its own idea of "done".
- **PSA22 · Three things the docs describe are unbuilt.** The pin store (GA5), `derivation_rules.json` (PWC80) and the rule-search loop (PWC94) appear in settled-looking text as if present. They are proposals.
- **PSA23 · What works for a player is older and plainer.** The visible procedural content in a fresh village life came from addressed draws, the director and ambient lines (PSA1), not from the grammar, the laws or the ledgers.

## Revamp plan

Ranked by player-visible gain per effort. Level is the model that should do it (AU5). Every item is a working default under AD56 unless it is in the Weibao list below.

The shape, from the end goal: a player meets a canon or generated thing, and it works by the mechanism the world says (AD38). One path does that for every row:

row (ledger) → `case` plus `expect` → one runner → `landEffect` in a reachable pack → world change the player sees. Field-fill, derivation scores and rule search all feed rows into that path; none gets its own runner.

| Rank | Code | Item | Level | Effort | Done check |
| --- | --- | --- | --- | --- | --- |
| 1 | PSA24 | **Wire the unreachable packs.** Import `brew_effects_pack`, `gu_effect_pack`, `hp_effect_pack`, `lotm_derived_cases` and the seven substrate packs through the world-pack manifest, then prove one thing from each in a fresh life (a brew vapor, a Gu aperture, a ward) | Sonnet | 2-3 days | `reachable.mjs` lists none of them as unreachable; C6 reads 7 of 7; one MCP walk per pack shows its effect in Reports |
| 2 | PSA25 | **Make `check:coverage` compute `runs`, and report the computed share per world as the headline** (PWC57). Typed `runs-*` without a case drops to `catalogued`; the README leads with expressed and runs per world | Sonnet | 1 day | `--check` fails on a typed `runs` row with no case; README headline is computed; the 1,765 become `catalogued` with a note in the log |
| 3 | PSA26 | **One runner for ledgers.** Finish PC5 and PC10: `case` plus `expect` per row, one `runCase` for canon, authored, derived and generated rows. Field-fill (PWC60), derivation (PWC80) and rule search (PWC94) write rows in that shape and nothing else | Sonnet | 3-4 days | The two existing ledgers with `case` run from it; PWC18's pass runner reads the same config; a derived row and a canon row go through the same function |
| 4 | PSA27 | **Route the Gu and spell laws through `landEffect`** (PC8) so a settled working ends in a sentence the world applies, then retire `guFamilyEffects` and `spellLabels` as parallel vocabularies | Opus (K-to-W joint; Sonnet implements, advisor reviews) | 4-5 days | C4 reads 2; one Gu and one spell change a W quantity in a fresh life; C1 drops below 30 |
| 5 | PSA28 | **Dry-run before building each law** (PWC60) and add the derive-score file (`derivation_rules.json`, PWC80) as a column on the runner's output, not a new file shape | Sonnet | 2 days per law | Each law lists its dry-run take; any under 25% of its slug goes back to field design; the score file has a row per live rule |
| 6 | PSA29 | **Build the pin store once** (GA5, G6) and use it for canon pins, cheat pins and PWC92's named exceptions | Sonnet | 2-3 days | A pinned address returns its value after save, reload and import; one derived rule has a pinned exception with its in-world reason |
| 7 | PSA30 | **Report generation fit as one command** (PC11): pair support, rediscovery, share shift, executes, for Gu, spells and brews, with the circular traps flagged beside each number | Sonnet | 2 days | One script prints four numbers per world; the held-out fold is scored once |
| 8 | PSA31 | **Run rule search on one dense family** (PWC99: Gu ranks and refinement) through the PSA26 runner | Sonnet proposes, local scorer picks, Opus solely when proposals stall | 3 days | Frozen fold scored once; rules explain at least ten held-out facts each (PWC91); two-rule agreement counted (PWC82) |
| 9 | PSA32 | **Delete or merge dead modules** after PSA24: `load_law` (no importer), the grammar-weights search if the rule search replaces it, and parallel shapes C3 at 30-line adapters | Haiku finds, Sonnet merges | 2 days | C3 reads 0 beside K; no `src` file is unreachable without a named reason |
| 10 | PSA33 | **Extend the generator census** (GR16) from 8 to every exported `generate`-shaped function, with golden and budget columns | Haiku | 1 day | Census count at least 60; golden and budget columns filled or listed as gaps |

### Order and what plugs where

1. PSA25 first: it is small and stops the next wave leaning on a typed number.
2. PSA24 and PSA26 together: wiring packs needs the runner's `case` to prove them.
3. PSA27 once PSA24 shows one law landing.
4. PSA28, PSA29, PSA30 then feed the same runner. PSA31 comes last because rule search needs a runner, a pin store and a fit report to judge its output.

### For Weibao before adopting (AD56)

These remove an option or narrow a dial, so they wait for his answer. None blocks PSA24 to PSA33.

| Code | Line | What it limits | Alternative |
| --- | --- | --- | --- |
| PSA34 | PSA25 demotes the 1,765 typed `runs-*` rows to `catalogued` | The palette's "3% run" figure drops to the computed share (0.0% runs, 1.2% expressed) | Keep the typed label but show it as `typed` beside the computed number |
| PSA35 | PSA32 deletes `load_law` and merges parallel shapes | Removes modules a lane may plan to use | Keep them listed as latent with a reopen trigger (CX8) |
| PSA36 | PSA27 retires `guFamilyEffects` and `spellLabels` as vocabularies | One effect vocabulary (sentences plus W ops) | Keep them as adapters of 30 lines or fewer |

## Gaps in this audit

- A village life alone was played (check 9). Gu, Hogwarts and Tingen starts were not, so their packs' absence from play is established by the import graph (check 2), not by a played run.
- Reachability is an import walk. A file can be reachable and not called; the claims about "no runtime caller" (check 8) rest on `grep` for names and were not confirmed with a call trace.
- The tests run (161 passes) prove module behavior in isolation. They were not run as the full suite.
- Round 12's rule-search and derivation items are proposals, so scoring them "not built" says they are unbuilt, not that the design is wrong.
