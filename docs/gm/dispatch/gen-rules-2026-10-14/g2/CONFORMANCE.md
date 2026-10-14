# G2 generator conformance

Proposal, 2026-10-14. Rule authority: [root GR/SB contract](../../../../GENERATION_FOUNDATION_RULES_2026-10-14.md). This is a source audit, not gameplay acceptance.

## Revision bindings

SHOWN: the requested 63-reference source was main HEAD `12179d0f87e446a7ba30f0f2c6ec0656bb85006c` when this lane began (alias **B**). While reading, wave 1 merged at `4e13f97f`. The primary matrix below is refreshed to main `9f5c7a982f2276cd9c231aed46eb91556650bb13` (**H**). Closing delta **L** is `f16bd67c99b2ab3b4aed329295f6823c9ab85cc4`, which added starts and anchor snapshots during document QA. Rows C36-C37 bind to L; C01-C34 retain H citations because the new main changes add imports/start setup and do not replace those generator bodies. All line citations bind to these commits, not the moving checkout. Use `git show <revision>:<file>` to recover them.

Read-only references: **P1** `7b787fdddc72c3d6a5f6fabba0bbe643e98ea576`, **P2** `f8fe699487c90ec06e83bfc020dfa8a6dc234705`, **P3** `4e444a5e19c0ba5815ef2a7bc03886305479081d`, **P4** `09403f5c948e072444d29dc41fde15caac23286a`, **P34** `6b0f1f328aa001664b72d46bea2f141871813a79`. H contains P1-P4; P34 remains a read-only branch reference. No branch was checked out or changed.

## How to read the scores

`pass` means the applicable property is shown in source. `fail` means the full proposed rule is not established, including absent contract fields or tests. It does not assert a reproduced play bug. `n.a.` means no relevant entity/table/time/projection exists in that group. A scalar draw is not required to invent an entity or knowledge store. C29 scores the primitive's pure `{value, receipt}` shape, not an entire content generator.

SHOWN scoring conventions: GR1 checks the full explicit-input/result-receipt shape, so cloning a planner alone does not earn a pass. GR6 requires named fallback and fallback accounting, not just throwing or pity. GR9 requires integer weights plus reasons where probabilities/tables apply. GR11 requires the declared entity/daily-draw/cost budget, so existing caps alone do not pass. GR14 requires both world and life scope. GR16 requires a distribution-banded sweep, three fixed golden seeds, and next-value persistence/import coverage; existing focused tests do not satisfy the whole package. No row has the complete GR16 bundle shown. C04 passes GR2 on its keyed native path. C03 has a good keyed native path, but its fallback without `rngKey` still uses a cursor, so the whole group fails. C06 retains ordinal callback subslots and cursor fallbacks, so it also fails the full rule. GR17 failures below distinguish cursor-based game-time scheduling from literal tick/wall keys in [SB review](SUBTLE_BUGS.md).

Inventory-bearing GR3 passes mean resolved item/count/quality values survive in native inventory keys/counts (B:src/main.js:5099-5106), not that every reward transaction is atomic. C02/C04 now retain encounter state (H:src/models/combat.js:65-80). C21/C22 preserve frozen jobs/events and separate knowledge (H:src/simulation_effects.js:281-284). C35 is a receipt owner included because it feeds future generator predicates; GR12 fails because source search finds no gameplay caller of `queryStoryOutcomes`, only its definition. Its response writer is wired, its callback reader is still absent.

## Matrix at H, plus P34 and the closing delta L


| Group | GR1 | GR2 | GR3 | GR4 | GR5 | GR6 | GR7 | GR8 | GR9 | GR10 | GR11 | GR12 | GR13 | GR14 | GR15 | GR16 | GR17 | SHOWN file:line evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C01: Trader stock | fail | fail | pass | fail | n.a. | fail | fail | fail | fail | fail | fail | pass | n.a. | fail | n.a. | fail | pass | H:src/components/trader_component.js:110-132; B:src/main.js:5099-5106 |
| C02: Native encounter composition/stats | fail | fail | pass | fail | n.a. | fail | fail | fail | n.a. | fail | fail | pass | n.a. | fail | n.a. | fail | n.a. | H:src/models/location.js:336-395; H:src/models/combat.js:65-80 |
| C03: Enemy loot | fail | fail | pass | fail | n.a. | fail | fail | fail | fail | fail | fail | pass | n.a. | fail | n.a. | fail | n.a. | H:src/enemies.js:163-179; B:src/main.js:5099-5106 |
| C04: Native combat targets, damage, block, evade, crit | fail | pass | pass | fail | n.a. | fail | fail | fail | n.a. | fail | fail | pass | pass | fail | n.a. | fail | n.a. | H:src/models/combat.js:61-80; H:src/models/combat.js:188; H:src/models/combat.js:353-432 |
| C05: Shared damage/strike functions, including defaults | fail | fail | n.a. | n.a. | n.a. | n.a. | n.a. | n.a. | n.a. | fail | fail | pass | pass | fail | n.a. | fail | n.a. | H:src/combat_math.js:28-58; H:src/native_battle.js:47-53 |
| C06: Enemy status and on-hit/on-damaged procs | fail | fail | pass | fail | n.a. | fail | fail | fail | n.a. | fail | fail | pass | n.a. | fail | n.a. | fail | n.a. | H:src/enemies.js:212-218; H:src/models/combat.js:430-432 |
| C07: Legacy action success | fail | fail | pass | n.a. | n.a. | fail | fail | fail | fail | fail | fail | pass | n.a. | fail | n.a. | fail | n.a. | H:src/main.js:2612; B:src/main.js:2593-2614 |
| C08: Legacy reward gates and mixed reward selection | fail | fail | pass | fail | n.a. | fail | fail | fail | fail | fail | fail | pass | n.a. | fail | n.a. | fail | n.a. | H:src/main.js:2950-2953; H:src/main.js:3310-3315 |
| C09: Native craft success/count/quality | fail | fail | pass | fail | n.a. | fail | fail | fail | fail | fail | fail | pass | fail | fail | n.a. | fail | n.a. | H:src/main.js:4214; H:src/main.js:4254-4303; H:src/main.js:4388-4396; H:src/main.js:4503-4513 |
| C10: Consumed-item recovery | fail | fail | pass | fail | n.a. | fail | fail | fail | fail | fail | fail | pass | n.a. | fail | n.a. | fail | n.a. | H:src/main.js:4738-4742 |
| C11: Native gathering presence/count/quality | fail | fail | pass | fail | n.a. | fail | fail | fail | fail | fail | fail | pass | fail | fail | n.a. | fail | fail | H:src/main.js:7563-7569; B:src/main.js:7485-7512 |
| C12: Local search and runner contact | fail | fail | pass | n.a. | n.a. | fail | fail | fail | fail | fail | fail | pass | n.a. | fail | fail | fail | fail | H:src/main.js:729; H:src/absorb_c2/local_life.js:42-83 |
| C13: Legacy random_range helper and quality callers | fail | fail | n.a. | n.a. | n.a. | n.a. | n.a. | n.a. | n.a. | fail | fail | pass | n.a. | fail | n.a. | fail | n.a. | H:src/misc.js:68-69; H:src/crafting_recipes.js:204-206; H:src/crafting_recipes.js:234-236; H:src/crafting_recipes.js:300-302 |
| C14: Failure narration selection | fail | fail | n.a. | n.a. | n.a. | n.a. | fail | fail | n.a. | fail | fail | pass | n.a. | n.a. | fail | fail | n.a. | H:src/main.js:2605-2629 |
| C15: Rat dialogue word mutation | fail | fail | n.a. | n.a. | n.a. | n.a. | fail | fail | n.a. | fail | fail | pass | n.a. | n.a. | fail | fail | n.a. | H:src/main.js:3521-3525 |
| C16: Ambient sound selection | fail | fail | n.a. | n.a. | n.a. | n.a. | fail | fail | n.a. | fail | fail | pass | n.a. | n.a. | fail | fail | fail | H:src/main.js:7634-7641 |
| C17: Click text and floating effect placement/path | fail | fail | n.a. | n.a. | n.a. | n.a. | fail | fail | n.a. | fail | fail | pass | n.a. | n.a. | n.a. | fail | n.a. | H:src/main.js:2530; H:src/display.js:359-379 |
| C18: Particle construction/jitter, including unused StarParticle | fail | fail | n.a. | n.a. | n.a. | n.a. | n.a. | n.a. | n.a. | fail | fail | pass | n.a. | n.a. | n.a. | fail | n.a. | H:src/particles.js:3-16; H:src/particles.js:43-49; H:src/particles.js:69-102 |
| C19: Expansion action outcome | fail | fail | pass | n.a. | n.a. | fail | fail | fail | fail | pass | fail | pass | pass | fail | fail | fail | n.a. | H:src/expansion_engine.js:517-585; H:src/rules.js:33-53 |
| C20: Expansion extra roll tables | fail | fail | pass | n.a. | n.a. | fail | fail | fail | fail | pass | fail | pass | pass | fail | fail | fail | n.a. | H:src/expansion_engine.js:371-388; H:src/expansion_engine.js:479-482; H:src/expansion_engine.js:569-579 |
| C21: Simulation command outcomes | fail | fail | pass | n.a. | pass | fail | fail | fail | fail | pass | fail | pass | pass | fail | fail | fail | n.a. | H:src/simulation.js:131-143; H:src/simulation.js:181-213; H:src/simulation_effects.js:281-284 |
| C22: Simulation automatic/caused event checks and occurrences | fail | fail | pass | pass | pass | fail | fail | fail | fail | pass | fail | pass | pass | fail | fail | fail | fail | H:src/simulation.js:70; H:src/simulation.js:504-517; H:src/simulation_effects.js:375-378; B:src/simulation.js:400-408 |
| C23: Spawn/template preparation and caused-event seed derivation | fail | fail | pass | pass | pass | fail | fail | fail | n.a. | pass | fail | pass | pass | fail | n.a. | fail | n.a. | H:src/simulation_resolution.js:4-32; H:src/simulation_effects.js:375-378 |
| C24: Village household death schedules/public news | fail | pass | pass | fail | pass | fail | fail | fail | n.a. | fail | fail | pass | n.a. | fail | fail | fail | pass | H:src/npc_lives.js:4-42 |
| C25: Remainder offer snapshot, not a sampled roster | fail | fail | pass | pass | pass | n.a. | fail | fail | n.a. | pass | fail | pass | n.a. | fail | fail | fail | n.a. | H:src/audit_remainder_offers_state.js:50-54; H:src/audit_remainder_offers_state.js:79-89; H:src/audit_remainder_offers_host.js:18-22 |
| C26: Chronicle elder cue | fail | fail | pass | n.a. | n.a. | fail | fail | fail | n.a. | fail | fail | pass | n.a. | fail | fail | fail | n.a. | H:src/chronicle.js:220-226 |
| C27: Saved native/party/feature battle cursors | fail | fail | pass | fail | n.a. | fail | fail | fail | n.a. | fail | fail | pass | pass | fail | fail | fail | n.a. | H:src/native_battle.js:13; H:src/native_battle.js:38-62; H:src/party_battle.js:37; H:src/party_battle.js:87-88; H:src/feature_expansion_battle.js:99; H:src/feature_expansion_battle.js:279 |
| C28: Causal-story strikes sharing simulation seed | fail | fail | pass | fail | pass | fail | fail | fail | n.a. | fail | fail | pass | pass | fail | fail | fail | n.a. | H:src/causal_story_host.js:221-240; H:src/causal_story_host.js:269-273 |
| C29: Pure unitDecision primitive | pass | pass | n.a. | n.a. | n.a. | n.a. | n.a. | n.a. | n.a. | fail | fail | pass | n.a. | fail | n.a. | fail | n.a. | H:src/seeded_streams.js:47-57; H:src/seeded_streams.js:97-100 |
| C30: Stream cursor wrappers and range/table helpers | fail | fail | n.a. | n.a. | n.a. | fail | fail | fail | fail | fail | fail | pass | n.a. | fail | n.a. | fail | n.a. | H:src/seeded_streams.js:64-101 |
| C31: Mixture family truth, products and dose resolution | fail | pass | pass | fail | pass | fail | fail | fail | n.a. | pass | fail | pass | fail | fail | fail | fail | n.a. | H:src/mixture_state.js:11-43; H:src/mixture_state.js:47-79; H:src/mixture_native.js:5-43 |
| C32: Storylet competing decks | fail | fail | pass | pass | pass | fail | fail | fail | fail | fail | fail | pass | pass | fail | fail | fail | fail | H:src/storylet_deck.js:16-17; H:src/storylet_deck.js:29-73; H:src/simulation.js:519-520 |
| C33: Generated traveler roster and hourly utility | fail | fail | pass | fail | pass | fail | fail | fail | n.a. | fail | fail | pass | n.a. | fail | n.a. | fail | pass | H:src/generated_people.js:12-27; H:src/generated_people.js:29-66; H:src/main.js:3; H:src/main.js:8423 |
| C34: Person-name grammar and collision scan | fail | pass | pass | n.a. | n.a. | fail | fail | fail | n.a. | fail | fail | pass | n.a. | fail | n.a. | fail | n.a. | H:src/name_grammar.js:3-21; H:src/generated_people.js:18-22 |
| C35: P34 retained story-outcome spine, no RNG of its own | n.a. | n.a. | pass | n.a. | fail | n.a. | n.a. | n.a. | n.a. | pass | fail | fail | n.a. | n.a. | fail | fail | n.a. | P34:src/lore_history_state.js:7-43; P34:src/lore_history_state.js:56-62; P34:src/simulation.js:447 |

| C36: Layered start generator, closing delta L | fail | fail | pass | n.a. | fail | fail | fail | fail | fail | pass | fail | pass | n.a. | fail | fail | fail | n.a. | L:src/start_records.js:3-6; L:src/start_records.js:41-78; L:src/start_probe_ui.js:23-54; L:src/main.js:8232-8241 |
| C37: Seeded anchor event windows and snapshot derivation, closing delta L | fail | pass | fail | pass | pass | fail | fail | fail | n.a. | pass | fail | fail | n.a. | fail | fail | fail | pass | L:src/anchor_snapshots.js:39-48; L:src/anchor_snapshots.js:74-83; L:src/anchor_snapshots.js:147-169 |

## Requested 63-reference baseline: complete coverage

SHOWN: `git grep -n Math.random B -- src` gives **63 literal references**: **60 call expressions and 3 function defaults**, not 63 direct calls. H gives **27 references**, 25 calls and 2 defaults. The remaining helper/default sites can still reach gameplay if callers omit injection. Cosmetic and narrative calls are intentionally identified separately; no proposal to seed particles into gameplay luck.

| B draw-site group | Exact B lines | References | Current matrix row |
|---|---|---:|---|
| Trader presence/count/quality | src/components/trader_component.js:117,119,123 | 3 | C01 |
| Enemy loot presence/count | src/enemies.js:170,174 | 2 | C03 |
| Enemy status/procs | src/enemies.js:216,443,454,501,518 | 5 | C06 |
| Encounter group/stat generation | src/models/location.js:344,355,357,367,373,374,375,376,377,378,379,380,381 | 13 | C02 |
| Native combat target/block/evade/crit | src/models/combat.js:160,323,351,377 | 4 | C04 |
| Shared damage/strike defaults | src/combat_math.js:34,44 | 2 | C05 |
| Legacy action success | src/main.js:2593 | 1 | C07 |
| Reward gate | src/main.js:2933 | 1 | C08 |
| Mixed reward inclusion | src/main.js:3292 | 1 | C08 |
| Craft successes/extra attempts/partial count | src/main.js:4224,4236,4273 | 3 | C09 |
| Used-item recovery | src/main.js:4694 | 1 | C10 |
| Gathering chance | src/main.js:7503 | 1 | C11 |
| Local-life RNG default | src/absorb_c2/local_life.js:42 | 1 | C12 |
| Integer range helper, indirect craft/gather/mixed calls | src/misc.js:69 | 1 | C13 |
| Failure narration | src/main.js:2586,2589,2610 | 3 | C14 |
| Rat-word text | src/main.js:3502,3504 | 2 | C15 |
| Ambient sounds | src/main.js:7574,7575,7578,7581 | 4 | C16 |
| Click/floating visuals | src/main.js:2511; src/display.js:361,376 | 3 | C17 |
| Particle constructors/jitter | src/particles.js:5,7,8,9,10,16,43,49,72,85,86,102 | 12 | C18 |
| Total | Every literal reference above, no duplicate site | 63 | C01-C18 |

SHOWN indirect consumers: B:src/crafting_recipes.js:172,225,257 call `roll_quality`, which reaches `random_range` at lines 206,236,302. B:src/main.js:3296,7504,7509 also call the helper. B native combat calls shared damage at B:src/models/combat.js:319. The literal-reference count cannot prove those paths are gone.

## Branch comparison and integration changes

| Reference | Covered groups and read evidence | Difference at H |
|---|---|---|
| P1 streams | C01-C12/C29-C30; P1:src/seeded_streams.js:38-95; P1:src/models/location.js:339-391; P1:src/models/combat.js:61-80; P1:src/main.js:721,4202,5330 | Core addressing code and native ports inspected unchanged. H adds `streamSeed` at H:src/seeded_streams.js:53-57, shifting later citations by six lines. Same-stream counters, craft's world exemption, positional market keys and legacy migration remain. |
| P2 mixing | C31; P2:src/mixture_state.js:11-79; P2:src/mixture_native.js:5-43 | These owners inspected byte-identical to H. New stable-root caller H:src/main.js:2 replaces dependence on a moving legacy RNG. |
| P3 storylets | C32; P3:src/storylet_deck.js:16-73; P3:tests/storylet_deck.test.js:22-39,51-59,84-90 | Deck owner inspected byte-identical to H. Locale/float weighting, deck-local memory and mutable deck cursor remain. |
| P4 people/names | C33-C34; P4:src/generated_people.js:12-79; P4:src/name_grammar.js:11-21; P4:src/generated_people_ui.js:15-27 | Owners inspected byte-identical to H. P4:src/main.js:8360 used `expansionState.rng`; H:src/main.js:3,8423 instead uses a root-keyed one-time seed. Sequential roster internals and name scan remain. |
| P34 spine | C35; P34:src/lore_history_state.js:7-43,56-62; P34:src/simulation.js:437-447 | Not in H. Current main has no `recordStoryletOutcome` hook. Receipt history is a branch proposal, not current gameplay authority. |

## Existing test evidence, not new execution claims

SHOWN: B:tests/expansion_engine.test.js:26-56 covers pure previews and frozen reload; B:tests/simulation.test.js:77-99 covers pure inspection and split/reload continuation. P1:tests/seeded_streams.test.js:15-53 covers same-order replay, isolation across stream families, legacy migration and pure unit evaluation. P2:tests/mixture_state.test.js:7-14 has 100 invariant seeds and one pinned hash, with no distribution band or three golden outputs. P3:tests/storylet_deck.test.js:22-39 compares two same-seed runs and preview purity, not a seed farm. P4:tests/generated_people.test.js:6-17 has two seeds and persistence; P4:tests/name_grammar.test.js:6-12 covers canon collision filtering and explicit exhaustion. P34:tests/lore_history.test.js:11-16 covers retention and full-history rejection. These were read, not run by G2.

INFERRED: [A5](../../core-foundations-2026-10-14/A5.md) should own replay extensions for preview/cancel, locale/order, split game-time advances and save/import continuation. G2 supplies cases in REPORT; it adds no replay harness or runtime tests.

## Closing source delta L

SHOWN: main moved again while documents were checked, adding `start_records`, `start_probe_ui`, `anchor_snapshots`, `away_ledger`, start content and a native start hook. The Math.random count remains 27. C36-C37 cover the two newly added random generators. `computeAway` at L:src/away_ledger.js:6-48 calculates explicit elapsed time/XP and contains no draw, so it is not an RNG draw group. It currently has no gameplay caller in src. L source differences from H were inspected; the main generator bodies previously cited are retained, with shifted main line numbers.

C36 has a pure seeded resolver and a localhost URL-gated consumer (L:src/start_probe_ui.js:4), not a shared receipt contract. Axis streams are independent, but each builds a mutable weighted permutation. Recursive search is finite yet lacks a declared attempt/cost cap and named fallback. C37 explicitly keys window time by seed/event ID and separates fact/knowledge ledgers; it has no src gameplay consumer outside its own helpers. Its incremental cache can rebuild already revealed history after author edits, so GR3 fails when treated as a runtime owner. Do not turn these helpers into accepted play merely because their tests exist.

SHOWN test-source additions: L:tests/start_records.test.js:38-61 covers deterministic seeds and 200 constraint seeds, without distribution bands/three goldens/import continuation. L:tests/anchor_snapshots.test.js:241-249 covers seeded windows and incremental cache invalidation. These files were inspected, not run. The source search for deriveSnapshot/deriveIncremental/computeAway found internal helper references only, supporting C37's GR12 failure.
