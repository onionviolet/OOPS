# Procedural core

*Proposal for Weibao, 2026-11-12, and a proposal throughout (AD32). It is a compact core for the procedural side of the [procedural foundation plan](PROCEDURAL_FOUNDATION_PLAN.md): how canon things and new things are represented, generated, checked and counted. It reuses the plan's codes (PFP, GL, PR, CV, MS), the grammar contract's (PGC, PGB) and the kernel's (KW). New items are `PC`, with `TG` for technique gaps. Every threshold is a dial with a reason. Measured values were read from the working tree at commit 6425dd1f0 plus the uncommitted files in the tree that day.*

Lowercase `pc1` to `pc3` in the run record and `scripts/emergence_cases.mjs` are pending emergence chains, unrelated to the goals PC1 to PC3 here. "Absorb" here means moving a system onto shared rules; the `src/absorb_*` folders are earlier mechanic imports from other games.

| Section | Codes | Standing | Waiting on Weibao |
| --- | --- | --- | --- |
| Core goals, pipeline, metrics, generation, queue | PC1-PC21 | Proposal | Q1, Q2, Q3 |
| Absorbing whole systems, techniques | PC22-PC33, TG1-TG7 | Proposal; PC29's order has his "Yes, use that order" | Q5 |
| Emergent behavior | PC34-PC43 | Proposal | None |
| The build plan | PC44-PC50 | Proposal | Q7 |
| [Carry-out](PROCEDURAL_CARRY_OUT.md): packets, tracker, reconciliation | PC51-PC66 | Proposal | Whether the coordinator adopts it |
| Combinations beyond canon | PC67-PC76 | Proposal | None |
| Other avenues | PC77-PC80 | Proposal | None |
| Additions from the readings check | PC81-PC88 | Proposal; PC88 declined ("No, engine first") | None |

## Why a core

Verified facts carry a file locator. Lines that start "Proposal" or "Default" are proposals.

The plan grew to 748 lines in a day and its progress numbers drifted from what the code does. Three facts, checked today, set the shape of this doc.

- **F1 · The grammar stack is not in the game.** Of the 8 `src/` files that name `procedural_grammar.js`, none is reachable from `src/main.js`. `world_effects.js`, `effect_grammar.js`, `effect_checks.js`, `grammar_search.js`, `spell_law.js`, `spell_grammar.js` and `kernel_search.js` are also unreachable. `applyEffect` (src/world_effects.js:94) and `applySentence` have no importer in `src/` outside P's and W's own two files. Method: a static import walk from `src/main.js` (1,491 of 1,656 src files reachable). No committed tool does this yet (PC14).
- **F2 · A K working ends in a label, not a world change.** The Gu law emits `{kind: <function family>, magnitude}` (src/gu_working_law.js:35). The spell law emits `spell.<verb>.<object>` and carries the sentence beside it unused (src/spell_law.js:25). Nothing applies either through W. W's substrate reaches the game through one module (`meadow_shell_state.js`), and K's `settleWorking` through one (`world_packs/hp_brew_pack.js`).
- **F3 · A `runs-*` row proves only that a file exists.** The check accepts any `runs-*` row whose `test` path exists (scripts/coverage_report.mjs:44-48). Of 383 running `gu_kinds`, 337 are unchecked wiki identities pushed through Moonglow's method with a derived ability, asserted only by the emitted label (tests/gu_coverage.test.js:50-61). The 80 running spells are asserted by label only (tests/spell_grammar.test.js:161).

## Core goals (PC1-PC4)

Four goals. Each has a check a script can run and a number today. Everything else in the plan is palette (see Core and palette).

| Code | Goal | Done check (mechanical) | Today (locator) |
| --- | --- | --- | --- |
| PC1 | **One shape.** One working shape (K) and one effect record (a P sentence that W applies). Extends the plan's K done check and PFP23 | Compression ledger rows C1-C6 at their floors (PC12); every K law's effects are sentences applied by one host function (PC8) | C1 37 files, C2 24 + 41 modules, C3 5 shapes, C4 3 vocabularies (see PC12) |
| PC2 | **Canon is executed data.** A canon row is data that the shared path runs to a recorded world change, in a module the game loads. Sharpens PFP1, PFP25 | Ledger states by PC9; `expressed` and `runs` counted by the generic runner (PC10), never by a per-row test | `expressed` 0 by the new definition, since no row records an outcome yet. Upper bound from lowering alone: Gu 32 of 57, Hogwarts 68 of 109 (PC7) |
| PC3 | **Generation stays inside canon's distribution and executes.** Sharpens PFP16, PFP18 | Generation fit report (PC11): pair support, held-out rediscovery, share shift, executes | Identity pair support 96.5% (docs/PROCEDURAL_GRAMMAR_CONTRACT.md:166). Effect proposals pass 16 to 24 of 40 (same file, line 113), but "runs" there is a set lookup, not an execution (src/effect_checks.js:89-94). Rediscovery not measured |
| PC4 | **Emergence with no join code.** Sharpens PFP7, PFP13, MS6 | Lint PC13 passes; at least three known multi-domain chains run on packs the game loads | One chain family (cc1) passes a regex lint on the case file (tests/emergence_harness.test.js:29-30). Its brew pack is not reachable from `src/main.js`. Three chains pending (scripts/emergence_cases.mjs:96-104) |

Default for all four: a goal counts only what a module reachable from `src/main.js` does. Dial: the `expressed` rung (PC9) counts library-only work so it stays visible. Reason: F1. All four goals could otherwise be met in tests alone.

## The pipeline (PC5-PC8)

One path for canon and generated things. A step is done for a row when the named module does it with no code written for that row.

| Step | What happens | Owner module (verified) | Gap |
| --- | --- | --- | --- |
| 1 Corpus row | One row per canon thing with a source locator | `docs/coverage/<corpus>.jsonl`, `scripts/coverage_report.mjs` | The row does not point at its parts or sentence. Gu labels sit in a side file (`docs/coverage/gu_labels.json`) |
| 2 Labelled parts | `label(row)` returns parts or the missing fields (PGC11) | Spells: `src/spell_pack_hogwarts.js`. Gu identity: `src/gu_catalogue.js`. Effect labellers: `tests/fixtures/procedural_grammar/effect_worlds.mjs:44,106` | The Gu and Hogwarts effect labellers and both world effect grammars are test fixtures, so no runtime can load them (PC6) |
| 3 Assembly | `assemble` is the one gate; `fitGrammar` sets weights; `generate` draws by address and cause | `src/procedural_grammar.js:131,62,223` | Unreachable from the game (F1) |
| 4 Effect sentence | Seven parts: verb, object, target, time, carrier, cost, limits (PGC13) | `src/effect_grammar.js` (`defineEffectGrammar`, `assembleEffect`) | Gu abilities are function-family labels, not sentences (F2) |
| 5 Lowering | Sentence to W acts, or a publish for another owner | `lowerEffect` (src/effect_grammar.js:63), `W_OBJECT_OF` (src/world_effects.js:18) | Six objects map to `null` (force, lifespan, mind, information, memory, working). They publish `effect.<verb>.<object>`, and no module in `src/` answers that kind (PC7) |
| 6 World-state change | `applySentence` runs acts through `applyEffect`; K settles steps and returns `effects` | `src/world_effects.js:94`, `src/kernel_working.js:254` | K's `effects` are free-form per law. No host turns a settled effect into `applySentence` (PC8) |
| 7 Coverage state | The row's state is computed from what steps 2 to 6 did | `scripts/coverage_report.mjs` | State is typed by hand and checked only for a test file (F3, PC9, PC10) |

- **PC5 · A row links to its case.** Proposal: a ledger row gains one optional field, `case`, naming a pack module that exports `coverageCase(id)`. It returns `{world, working or sentence, details, expect}` as plain data. Default: one exporter per corpus pack. Reason: the runner needs data, and per-row tests are what let labels pass as runs.
- **PC6 · World effect grammars are world packs.** Proposal: move `guEffects`, `hpEffects` and their labellers from `tests/fixtures/procedural_grammar/effect_worlds.mjs` into `src/world_packs/`. Reason: PFP3 puts world vocabulary in world packs, and a fixture cannot be a runtime consumer.
- **PC7 · Unanswered publishes are the lowering backlog.** Measured with no world keys, by running `lowerEffect` over the labelled canon sentences. Gu: 32 of 57 lower to W acts alone, 20 publish for another owner (L 8, K 6, N 5, A 1; 4 of them also carry a W sense or conceal act), 5 need a world key. Hogwarts: 68 of 109 lower to W acts alone, 37 publish (N 16, K 14, A 7; 17 also carry a W act), 4 need a key. These are ceilings: a lowered act still has to produce the recorded outcome. Default: a publish counts toward `expressed` only when a registered pack answers it and the answer changes state. Dial: an owner may declare a quantity or property in W instead of answering. Reason: this turns "the grammar cannot express it" into a per-owner count.
- **PC8 · One effect host.** Proposal: one function takes a settled K effect that carries `sentence` and `details` and calls `applySentence`. Laws stop inventing effect labels. First consumer: the spell law, which already carries the sentence. Second: the Gu law. Default: laws keep extra fields for their own hosts during migration. Reason: F2. This is the missing joint between K and W, and it is small.

## Metrics (PC9-PC13)

### Ledger states (PC9, replaces CV2's two `runs` states)

| State | Mechanical meaning | Who sets it |
| --- | --- | --- |
| `unclassified`, `not-a-thing:<reason>`, `blocked:<rule>` | As CV2 | Owner |
| `catalogued` | Identity parts with a source. No executed effect. Wiki-inferred functions and label-only rows sit here | Owner |
| `expressed-canon`, `expressed-authored` | The row has a `case`. The generic runner executes it through `applySentence` or a K settle plus the effect host, with no code keyed on the row id, and the world differs from before in the way `expect` says | Runner |
| `runs-canon`, `runs-authored` | `expressed`, and the pack that exports the case is reachable from `src/main.js` | Runner |

- `canon` and `authored` keep their CV2 meaning (source-backed values against labelled original values).
- `expect` is written in world terms: a holder role, a W quantity, property, position or owner fact, and a direction. Default: direction only. Dial: an amount where the source gives one. It may not contain the sentence's verb or object words. Reason: the outcome is then a second reading of the source, and a label cannot satisfy it.
- Expected effect of the change, from today's rows: `gu_kinds` running drops from 383 to at most 46 chapter-checked rows before any pass the runner, and `hp_spells` from 80 to at most the share that lowers to W (PC7). The 337 wiki rows become `catalogued`.

### What `check:coverage` enforces (PC10)

Default: it keeps failing on malformed rows only. It gains three hard checks. (a) A row may not be typed `expressed-*` or `runs-*` by hand; the runner computes them and the check fails if the file disagrees with a fresh run. (b) A `case` module must exist and export `coverageCase`. (c) A case that throws is an error, not a `blocked`. Percentages stay a report (CV4). Dial: a per-ledger floor file that may only rise, like `scripts/architecture_baseline.json`. Reason: a ratchet stops silent regressions without making a percentage a gate.

### Expressibility (replaces GL2's 70% prediction target)

Expressibility of a corpus is `expressed` rows over labelled rows. It reports its misses grouped by missing rule and by unanswering owner (PC7). GL2's prediction score (whole effect from identity: Gu 25 of 57, Hogwarts 12 of 80, RUN.md:39-40,47) stays as a diagnostic with no target. Reason: how well a name predicts an effect is a property of the source, not of the grammar. A Gu's name does not fix what it does, and no rule will make it.

### Generation fit (PC11)

Four numbers per world grammar, each with a dial. All are computed on held-out folds, so the grammar never sees the rows it is scored on.

| Statistic | Definition | Default dial | Reason |
| --- | --- | --- | --- |
| Pair support | Share of generated items whose every conditioned slot pair occurs in some canon row (GL1, PGC19) | 80% or more | Plausible parts, implausible pairs is the usual failure (56% before joint conditioning) |
| Held-out rediscovery | Fit on four folds. Generate N items at novelty 0 and 1. Share of held-out canon sentences (verb, object, target, time) that appear, against uniform draws over the same slots | Twice the uniform baseline or better, N = 200 | The one test that asks whether recombination reaches real canon it has not seen |
| Share shift | Total variation between generated and corpus shares per closed slot (PGC10) | 0.25 or less | Already measured for identity (0.07 to 0.15) |
| Executes | Share of proposals that change a probe world through `applySentence`, by novelty level | Report only; kept items are 100% by construction | Replaces the lookup in `checkEffect` (PFP16) |

Known circular traps, each reported beside the number it flatters: a label read from the field being predicted; a range check at smoothing 0; a rebuild that re-assembles the same parts (the 96.5% and 78.0% figures); a "runs" check that looks up a law name.

### Compression ledger (PC12)

Counted by one script from the tree. Default: a baseline file that may only shrink. Dial: a row's floor, set by its owner with a reason.

| Row | Count | Today | Floor (proposal) |
| --- | --- | --- | --- |
| C1 | Files calling `resolveGuActivation(` in `src/` | 37 (33 reachable) against 6 on `runGuStep` | 1: the definition, then 0 |
| C2 | `src/gu_keeper*.js` plus `src/world_packs/book_gu_keeper*.js` | 24 + 41 | Owner sets it: modules that hold only host, save or screen wiring |
| C3 | Parallel working shapes with importers (`craft_working` 2, `spell_working` 1, `creature_methods` 3, `gu_procedures` 4, `method_program` 3) | 5 | 0 beside K, or adapters of 30 lines or fewer |
| C4 | Effect vocabularies (Gu function families, `spell.<verb>.<object>`, W ops, P sentences) | 4 | 1 authored (sentences) plus W ops as the lowered form |
| C5 | World effect grammars and labellers under `tests/fixtures/` | 2 | 0 |
| C6 | P, W-effects and K-search modules reachable from `src/main.js` (this one rises) | 0 of 7 | 7 |

### No-join-code lint (PC13)

An emergence case counts toward PC4 when all of these hold. (a) The case is plain data: pack ids, holders, scheduled outside ops. No function, law, reactor, rate or watch in the case file (today's regex, kept). (b) Every pack it composes lives in `src/` and is reachable from `src/main.js`. (c) No pack in the case imports another domain's law or pack. Packs meet only through `world_substrate.js`, `world_quantities.js` and published effect kinds. (d) The chain's signature is in `scripts/emergence_known_chains.json` and names two or more domains. Dial: (b) may be off for a harness-only regression case, which then does not count. Fact to weigh: the untracked `src/world_substrate_packs/gu_brew_regulator.js` imports `resolveGuActivation`, so as written it fails (c) and adds to C1.

- **PC14 · One reachability tool.** Proposal: `scripts/reachable.mjs` walks static imports from `src/main.js` and is the single source for PC9, PC12 C6 and PC13 (b).

## Generation beyond canon (PC15-PC19)

What exists, verified: `proposeEffects` recombines at novelty 0 and 1 and transfers at 2; level 3 throws and points at K (src/effect_checks.js:45-49). `exploreEffects` budgets trials and `createNicheArchive` keeps one best per verb, object and carrier (same file, lines 133-151). `searchEffectsForGoal` and `searchParts` run backward from a goal. `generateGuMoves` and `settleGeneratedGuMove` compose roles through K (src/gu_move_generation.js:67,112). None of it is reachable from the game.

| Mode | Meaning here | Build | Status |
| --- | --- | --- | --- |
| Recombine (NV1) | Change one or two parts of a canon sentence | First | Library done; needs PC16 |
| Compose (NV2) | Fill a K composition's slots with things no book paired (KW19) | First | Gu moves in library; 4 of 23 canon moves run |
| Discover | An actor meets a generated thing; it is frozen by value with its grammar ref (PGC22, PR2) | First | `freezeValue` exists; no consumer |
| Transfer (NV3) | Carry another world's sentence across with a local carrier and cost | Later | Library done |
| Invent (PM3) | An actor states a goal; backward search returns routes or gaps | Later | Library done; needs an actor with knowledge |

- **PC15 · Minimal set first: recombine, compose, discover, in one world (Gu).** Reason: these three make one loop a player can reach. A place or rival produces a move, it executes, the player meets it and it is stored. Transfer and invent reuse the same gate afterwards.
- **PC16 · The runs check executes.** `checkEffect`'s first check applies the candidate in a probe world built from the world pack and passes when state changes or a publish is answered. Default: one probe world per world pack. Reason: PFP16 says generated means runnable; a law-name lookup admits sentences nothing can land.
- **PC17 · Budgets are data on the caller.** Defaults already in code: 64 trials and 512 steps per actor search (src/kernel_search.js:11), 200 trials for backward search, `exploreEffects` under 400. Dial per actor and per settlement (PR3). Reason: idle settlement stays cheap.
- **PC18 · One archive per world, saved.** Niche key verb, object, carrier (PR4). Default: best per niche, ties keep the holder. Dial: add path or place to the key when a world's niches crowd. An archived entry stores its frozen value, cause and the trial count that found it.
- **PC19 · Novelty is a level with a cause** (PFP24, PGC18). Default spread for a seeded region: mostly 0, some 1, 2 only with a named contact between worlds. Dial per actor. Reason: tradition sits near canon; pressure moves an actor away from it.

Tested without circularity by PC11's held-out rediscovery and executes numbers, plus one replay test: the same root and address regenerate the same archive (PR1).

## Core and palette (PC20)

Proposal, and the one line here that defers work, so it waits for Weibao's answer (AD56). Core is built to a done check. Palette is kept, read for ideas and built only when a consumer asks.

| Core | Palette |
| --- | --- |
| Plan: PFP1-PFP3, PFP16-PFP20, PFP23, PFP25; CV1, CV3, CV4; GL1, GL3; PR1-PR9; MS1, MS3, MS4, MS5 | Plan: GL2 as a target, GL4 until PC4 has reachable packs, MS2's 70%, MS6 breadth, MS7 |
| Contracts: PGC1-PGC24, KW (working, compose), W effects, GR1-GR17 | Heredity GN, inheritance IH, descent DG, bloodlines BL, lineage LN, lore-first LR beyond locators, depth checklists DC, SPD, PTD, MD1-MD15, FN, OA, BX |
| Code: `procedural_grammar`, `effect_grammar`, `effect_checks`, `world_effects`, `world_substrate`, `kernel_working`, `kernel_compose`, `gen_kit`, world packs, coverage tooling | Code: `grammar_search` (PGC25-PGC28), `kernel_search`, `kernel_oath`, `kernel_descent` until a core goal needs them. `kernel_identity`, `kernel_meet`, `contest` and `agency` moved to core on 2026-11-12, since the custody and contest facets (PC23) and actor-driven emergence (PC34) need them |

## Work queue (PC21)

Critical path first. Sizes are rough.

| # | Item | Owner area | Files | Done check | Size |
| --- | --- | --- | --- | --- | --- |
| 1 | Reachability tool, new ledger states and generic runner | P tooling | `scripts/reachable.mjs`, `scripts/coverage_report.mjs`, `tests/coverage_report.test.js`, `docs/coverage/*.jsonl` | `check:coverage` recomputes `expressed` and `runs`; 337 wiki Gu rows read `catalogued`; README regenerated | Small |
| 2 | Effect host and executing runs check (PC8, PC16) | P with K and W | `src/effect_grammar.js`, `src/effect_checks.js`, `src/spell_law.js`, focused tests | A settled spell changes a W world through one host; Hogwarts expressibility reported against the 68 of 109 bound | Medium |
| 3 | Compression ledger with a shrinking baseline (PC12) | Integrator | new `scripts/compression_report.mjs`, baseline json | C1-C6 printed; a rise fails | Small |
| 4 | World effect grammars into world packs with `coverageCase` and `expect` (PC5, PC6) | S, then G | `src/world_packs/`, `src/spell_pack_hogwarts.js`, the fixture file | C5 at 0; every chapter-checked Gu and spellbook spell is `expressed`, `catalogued` or `blocked` by the runner | Medium |
| 5 | Gu abilities as sentences; migrate `resolveGuActivation` callers | G | `src/gu_working_law.js`, `src/gu_working_host.js`, callers | C1 falls by 10 or more per pass with focused tests green; C4 at 1 | Large |
| 6 | Generation fit report and one reachable generator (PC11, PC15) | P with G | `scripts/grammar_canon_effects.mjs`, `src/gu_move_generation.js`, one Gu host | Rediscovery, pair support and executes printed for Gu; one generated move reachable in play, frozen on reveal | Medium |
| 7 | Join lint and three chains on reachable packs (PC13) | E with B, L, G | `scripts/emergence_cases.mjs`, `tests/emergence_harness.test.js`, substrate packs | Lint passes; three signatures in the known-chains file | Medium |

## Absorbing whole systems (PC22-PC33, 2026-11-12)

Weibao (2026-11-12): "Improve and solidify the plans we have in store for OOP, like the procedural stuff, to absorb the entire systems, like Gu system under creatures, killer moves under either its own or a better one, other aspects to consider and more?"

The plan's sectioning answer (SC4, PFP21) says a world's thing is rows on every mechanism it uses. It has no way to say how far a system has moved, no order and no home for moves beyond "a K composition". This section adds those. Measured on the tree at a77fda00c plus that day's uncommitted files, by a static import walk from `src/main.js`.

- **F4 · Gu is the largest system and it is all bespoke-reachable.** 172 `src` files and about 20,100 lines name Gu (66 Keeper, 4 move, 102 other); 163 are reachable. The kernel is 7 files and 900 lines, with 2 reachable (`kernel_working.js`, `kernel_compose.js`).
- **F5 · Gu already sits half under living things.** `living_kinds.js` has a `gu` class, and 14 Gu files import `creature_*` or `living_*` modules. The creatures ledger blocks 78 of 96 rows on `gu-body-fields`: the Gu catalogue row has no diet, ration or stage minutes for L to run.
- **F6 · Moves have one consumer and one shape.** `kernel_compose.js` has one importer (`gu_move_roles.js`). 4 of 776 move rows run; 753 are blocked on `roles-unknown`. A running move is "one activate step per role, supports before cores". Optional roles and per-role operators exist, but in G's file (`gu_move_roles.js`), not in K.
- **F7 · The shared pieces absorption needs are not in the game.** `contest.js` (528 lines) is imported by two contest packs and is unreachable, beside 46 reachable files of older combat. `kernel_identity.js`, `kernel_meet.js` and `kernel_oath.js` have no importer in `src`; `kernel_descent.js` has one.

### Absorb by facet (PC22-PC24)

- **PC22 · A system is absorbed facet by facet.** Proposal: the unit of absorption is a pair (system, facet). A facet is one mechanism a thing uses: body, ability, custody, making, technique, contest, progression, substrate, generation, knowledge. A system is absorbed when each facet it uses runs on that mechanism's owner, and what is left is a world pack plus a thin law. Reason: "Gu under creatures" is right for the body facet and wrong for the other eight, and the same holds for any single parent.

- **PC23 · The Gu facets, each with an owner and a check.**

| Facet | Owner | What Gu supplies as data | Today | Done check |
| --- | --- | --- | --- | --- |
| Body: feeding, hunger, breeding, wild cohorts, death | L. **Yes, Gu go under creatures here** | Diet, ration, stages and lifespan fields on the catalogue row; the living-kind row is derived from it, not typed twice | 78 rows blocked on `gu-body-fields` | That blocking rule reaches 0, or each row names the field canon leaves unknown; no Gu file keeps its own hunger or feeding code |
| Ability | K working, effect as a P sentence applied by W | Activation with essence cost; the effect sentence | 37 files call `resolveGuActivation` (C1) | Queue item 5 |
| Custody: carry, lend, steal, lose, host in an aperture or a beast | Identity (KW22-KW26), M for claims | One id that is item and body at once | `kernel_identity.js` unreachable | A Gu changes holder and its body record follows, with one id and one save entry |
| Making: refinement, fusion, a move refined into a Gu | F grammar, B process steps | Recipe rows | `gu_refinement*` bespoke | Refinement rows run through F and B contracts; the move-to-Gu recipe takes a technique as an input (SC8) |
| Technique: killer moves | PC25 | Move rows: roles, order, timing | 4 of 776 run | PC25 checks |
| Contest: a move or ability in a fight | C | Nothing Gu-specific; it enters like any working (SC9) | `contest.js` unreachable | A Gu duel settles through C and lands on L's bodies |
| Progression: rank, aperture | R, with the aperture as an L organ | Rank thresholds and aperture grades as pack numbers | Under `cultivation_*` and Gu files | A rank step runs on R's rule with Gu numbers from the pack |
| Substrate: essence, dao marks | W | Quantities by kind and rank; dao marks as a law field (PFP14) | Partly on W | No Gu file holds its own essence ledger |
| Generation: new Gu, new moves | P | Path, role, rank, dao marks | In the library, not in the game | Queue item 6 |

What stays in the Gu law: primeval essence, aperture grades, the Immortal uniqueness rule and dao mark interference (unchanged from SC4).

- **PC24 · An absorption ladder, counted by script.** Each (system, facet) cell holds one rung. Default: a script computes the rung from the tree, and a typed rung fails the check. Reason: F3, typed states drift toward the flattering one.

| Rung | Meaning | Mechanical test |
| --- | --- | --- |
| A0 bespoke | Scene or system modules do the facet themselves | Files matching the system that neither import the owner's contract nor are pure data |
| A1 catalogued | Rows exist with source locators | Ledger rows above `unclassified` |
| A2 on contract | The facet runs through the owner's contract in tests; bespoke code remains beside it | A PC9 `expressed` row for this facet |
| A3 compressed | The bespoke code for the facet is deleted or is an adapter of 30 lines or fewer | The PC12 row for this facet at its floor |
| A4 in the game | The owner's contract path is reachable from `src/main.js` and an existing route proof still passes | PC14 reachability plus the route's save, reload and import receipt |
| A5 generates | P produces new things in this facet that execute | PC11 executes number above zero in a reachable generator |

The grid of systems by facets is the absorption matrix. It replaces SC10 (which was a later item) and goes into the queue below, because it is the progress picture for this whole section.

### Killer moves become techniques (PC25-PC27)

Options weighed. O1, moves as their own Gu-only system: one owner, but it rebuilds composition, timing and learning that spells, formations and rituals also need. O2, under combat: rejected in SC3, since moves also travel, scout and refine into Gu. O3, a bare K composition (today): the structure is shared, but nothing owns who knows a move, how well, or which parts belong together. O4, a cross-world technique.

- **PC25 · A technique is a named, learnable composition, and a killer move is the Gu world's technique.** Proposal: O4. It is not a new chat or a new domain by default. It is three existing owners meeting on one row:

| Part of a technique | Owner | Gu killer move | Second consumers |
| --- | --- | --- | --- |
| Structure: slots, order, timing, shared or own facts | K composition (KW18-KW21) | Roles filled by Gu | A combined spell, a formation, a ritual, a sword form, a recipe step running two processes |
| Which fillers belong together | P composition grammar (GL3) | Core and support roles by path and function | Charm combinations, ritual ingredients |
| Who knows it, how well, and how it drifts when taught | N | A sect's move, an inheritance, a stolen move | A taught spell, a family recipe |
| What it does | The parts' effect sentences through W (PC8) | See PC27 | Same |
| Rows and numbers | World pack | `gu_moves` ledger | Per world |

Dial: a world may give techniques their own law file when it has rules no other world shares (Gu: dao mark conflict between parts, Immortal killer move backlash). Reason: one technique mechanism gives every world "moves the book never paired" (NV2) for the price of one, and PFP5's second consumer is already named (S).

- **PC26 · What composition needs before canon moves fit.** Read against KW18-KW21 and `gu_move_roles.js`; each is a request to K, to land when its first consumer row exists.

| Code | Gap | Evidence | Default |
| --- | --- | --- | --- |
| TG1 | Parts that run together or are held while others run | A composition concatenates filler steps in slot order (`kernel_compose.js` `composeWorking`) | A slot gains `with: <slot>` and `hold: true`; settlement stays one fixed order (KW28) |
| TG2 | Optional and repeated slots | `role.optional` lives in `gu_move_roles.js` | Move it to K's slot definition; G's copy becomes data |
| TG3 | Several actors in one technique | `role.operator` lives in G | Composite roles carry an operator role; authority is read per operator at settlement (KW12) |
| TG4 | A part fails midway | KW8 keeps what happened; no rule says what the unfinished whole does | The settled parts stand and the law may publish a backlash sentence; no per-move code |
| TG5 | Practice | Nothing records familiarity with a move | N holds familiarity per actor and technique; it scales cost and failure chance as pack numbers |
| TG6 | A technique as an input to making (SC8) | F's grammar takes materials | F accepts a technique ref with a familiarity floor |
| TG7 | Countering | `kernel_meet.js` (KW27-KW30) has no importer | C reads meet rules; a counter is another technique |

- **PC27 · A move's effect comes from its parts.** Default: a technique's world change is its parts' sentences applied in order through one host (PC8), plus interaction terms that a named law computes from properties (PFP22), such as dao marks of one path reinforcing. Dial: a world pack may attach one whole-move sentence where canon states an effect the parts cannot produce, and that row counts as `authored` until a law explains it. Reason: a per-move effect table would be 776 bespoke rows and would make generated moves inert.

The 753 `roles-unknown` leads stay `blocked` until a chapter read names their parts. Dial: backward search (PM3) may propose fillers for a lead, labelled `authored`.

### The other systems (PC28-PC30)

- **PC28 · Every large system gets the same treatment.** Sizes are file counts by name pattern, so they overlap and are rough.

| System | `src` files (reachable) | Facets it should hand over | Thin law that stays | First facet |
| --- | --- | --- | --- | --- |
| Gu | 172 (163) | All nine in PC23 | PC23's last line | Ability, then body |
| Combat and contest | 51 (46) | Contest to C; injury to L; stances and forms to technique | None expected; world numbers in contest packs | One duel through `contest.js` in the game |
| Crafting and materials | 67 (63) | Making to F; process steps to B; item identity | Per-world material laws | Queue item 3's C3 row |
| Brewing and potions | 25 (21) | Making to B; delivery into a body to L; a Lord of the Mysteries potion's digestion to R | Per-world potion law | Delivery into the body (the run's stated next seam) |
| Spells | 22 (13) | Ability to K and W; combined spells to technique; learning to N | Per-world casting law | Queue item 2 |
| Cultivation, rank, sequences | 34 (32) | Progression to R; organs to L | Per-world thresholds | One Gu rank step and one sequence step on one rule (OS3) |
| Lord of the Mysteries | 78 (72) | Potion to B, digestion and acting to R and N, characteristics to identity, rituals to technique | Loss of control, the acting method's world rules | Follows B and R |

- **PC29 · Order: Gu first, by facet, in this sequence** (order accepted by Weibao, 2026-11-12: "Yes, use that order"; [log](gm/USER_VISION_LOG_2026-11.md#absorption-facet-order-2026-11-12)). Ability and effect (queue item 5), body, technique, custody, contest, progression. Reason: ability is the missing K to W joint that every other facet's effects pass through; body was expected to be mostly data that unblocks 78 rows (F14 later found that no diet data exists, see PC86); technique needs abilities that already land as sentences. Dial: a facet may jump the order when its owner's contract has a second consumer waiting.
- **PC30 · A facet's contract gets its second consumer from another world while Gu moves.** Default pairs: body with a Hogwarts creature, technique with a combined spell, custody with a wand or a Beyonder characteristic, progression with a sequence step. Reason: PFP5, and it stops each contract from taking Gu's shape.

### More to consider (PC31-PC33)

**ACT NOW** (done in this edit)

- **PC31 · The matrix and four absorption items join the queue** (below), and Q5 and Q6 join the open questions.

**ACCOUNT FOR NOW**

- **PC32a · Identity comes before bodies at scale.** With `kernel_identity.js` unused, putting every Gu under L makes a second record beside the item (AR3: one authority per fact). The body facet's first pass derives the living-kind row from the catalogue row; per-individual bodies wait for the custody facet.
- **PC32b · Canon rarely gives a Gu's diet or lifespan.** Default: a field canon leaves open is `unknown` on the row, and the world pack supplies a class default by path, labelled `authored`. The in-play consequence is a knowledge gap the keeper can close by observing (N), not a blank.
- **PC32c · "Carried by a body" is one relation.** A Gu in an aperture, a Gu on a frenzy wolf (ch. 150), a parasite, a familiar and a Beyonder characteristic in a person are the same shape. L owns it as a host slot; custody reads it.
- **PC32d · Absorbed and bespoke versions will disagree.** A scene module tuned by hand and the shared rule can give different results. Default: record the difference in the facet's receipt and keep the shared result (AD45, AD49's results and route variance). Dial: a pack number changes when the source supports the old value.
- **PC32e · Cost on the 8 GB target.** 1,466 kinds on a per-individual lifecycle is the expensive case. Default: kept Gu settle as individuals, wild and stored Gu as cohort rates with the same totals (PFP12).
- **PC32f · Saves move with each facet.** Old saves are disposable, so no migration is owed, but each facet that reaches A4 repeats the save, reload, export and import proof on its route.
- **PC32g · NPCs use techniques on the player's rules** (PFP11). A's actors bind, pay and fail techniques through the same quote. A rival's generated move is then a technique row with a cause (PC19).
- **PC32h · Two fight stacks.** The 46 reachable combat files are the upstream game's combat plus additions; `contest.js` is the shared rule and is not loaded. Default: book-world fights move to C first, and the variant world's combat becomes a contest pack through an adapter when a consumer asks.

**LATER / DELEGATE**

- **PC33a · A facets inspector.** One debug panel that lists a thing's facets, the owner running each and its rung. Read-only. Level sonnet, effort medium. Done check: a Gu, a spell and a potion each show their rows from the matrix data at the desktop viewport.
- **PC33b · Move role reading.** A chapter pass over the 753 leads to name parts. Bulk reading with its own usage cost. Level haiku with a sonnet check, effort high. Done check: `roles-unknown` falls and every changed row carries a chapter locator.
- **PC33c · Upstream systems census.** The original game's skills, items, enemies and locations were not measured here. Level haiku, effort low. Done check: a table of file counts by system with the facets each would hand over.

### Absorption queue

These sit beside PC21. Item 5 there is the ability facet and stays first.

| # | Item | Owner area | Files | Done check | Size |
| --- | --- | --- | --- | --- | --- |
| A1 | Absorption matrix script (PC24) | Integrator | new `scripts/absorption_matrix.mjs`, reuses `scripts/reachable.mjs` | Prints system by facet rungs for the PC28 systems; a typed rung fails | Small |
| A2 | Gu body fields and derived living kinds (PC23 body) | L with G | `src/gu_catalogue.js`, `src/living_kinds.js`, `docs/coverage/creatures.jsonl` | `gu-body-fields` at 0 or replaced by per-field unknowns; one Gu file's own feeding code deleted | Medium |
| A3 | Technique gaps TG1-TG3 in K, with a combined spell as second consumer (PC25, PC26) | K, then G and S | `src/kernel_compose.js`, `src/gu_move_roles.js`, one S pack | G's optional and operator handling is data on K slots; one canon move with a held support and one combined spell run through the same function | Medium |
| A4 | Identity in the game (PC23 custody) | K with G | `src/kernel_identity.js`, one Gu custody host | A Gu changes holder with one id across item and body; module reachable | Medium |
| A5 | One Gu duel through the contest (PC23 contest) | C with G and L | `src/contest.js`, `src/contest_packs/gu_world.js`, one host | `contest.js` reachable; damage lands on an L body; the existing duel route proof passes | Medium |

## Emergent behavior (PC34-PC43, 2026-11-12)

Weibao (2026-11-12): "Consider emergent behavior and more?" (after asking whether one procedural system can cover everything).

PC4 and PC13 say what counts as an emergent chain. They do not say where emergence comes from, how to find chains nobody arranged, or what the player does with one. Read from the tree that day:

- **F8 · The harness confirms arranged chains.** `scripts/emergence_cases.mjs` holds two cases of one family (cc1), three known signatures and two domains (B and L). Each case places the holders so the chain can happen. "New" means a signature missing from `scripts/emergence_known_chains.json`. The case file lists three plan chains as pending. The run record reports engine fixtures for all three since (residue to grazing, regulated humidity to brew, colony light to movement and a rival's choice; `tests/living_residue_chain.test.js`, `tests/gu_light_attraction.test.js`, `tests/gu_brew_regulator.test.js`), outside the harness case list and the known-chains file. Not rerun for this doc.
- **F9 · Gu abilities cannot start a chain yet.** A Gu working ends in a label (F2), so nothing it does reaches a W quantity another pack reads. The ability facet (PC29's first step) is therefore also the gate for Gu emergence.
- **F10 · The parts exist.** The harness already reports cause chains, cascade damping, repeats, runaways against rhythms and a chain fingerprint (`scripts/emergence_harness.mjs`), and `explainEffect` returns a cause chain root first (`src/world_substrate.js:463`).

### Where emergence comes from (PC34-PC36)

- **PC34 · Three sources, each with its own check.** Proposal:

| Source | What happens | Needs | Today | Check |
| --- | --- | --- | --- | --- |
| Coupling | One domain writes a quantity or effect another reads: steam raises humidity, a shell answers | Shared W quantities with writers and readers in different domains | cc1 | PC13 |
| Actors | Someone notices a change and picks a working in response: a rival sees the lit hill | A's actors reading what they know (N) | `agency.js` is not loaded by the game | A chain whose signature includes an actor's choice, with the same quote the player gets (PFP11) |
| Composition | Parts interact inside a technique or recipe and the whole does what no part does alone | PC27's interaction terms computed by a law | Not built | A generated technique whose world change differs from its parts run one after another, with the law that caused the difference named in the receipt |

Reason: counting the three together hides that two of them are at zero.

- **PC35 · The coupling map is the emergent surface.** Proposal: a script lists every W quantity and published effect kind with its writers and readers by domain and pack. A chain can exist wherever one domain writes what another reads. It prints three lists: couplings across domains, writes nothing reads, and reads nothing writes. Default: it is a report. Dial: a floor on cross-domain couplings among packs the game loads. Reason: this turns "will interesting things happen" into a count each absorbed facet should raise, and the dead-end lists are the cheapest backlog in the plan.
- **PC36 · Each absorbed facet declares what it reads and writes.** Default: a facet reaching rung A2 (PC24) adds its rows to the coupling map, and a facet that writes nothing another domain reads says so in its receipt. Reason: a facet can be fully absorbed and still be an island.

### Finding chains nobody arranged (PC37-PC38)

- **PC37 · Soak worlds.** Proposal: beside authored cases, the harness runs seeded worlds where P draws the place, the packs present and the actors (PG3, PG1), then runs them for a long stretch. A chain found there counts as discovered; a chain from an authored case counts as confirmed. Default report: new multi-domain signatures per 100 world days, by source (PC34). Dial: soak length and world count per checkpoint, sized to the 8 GB target. Reason: F8. An authored case can show that a chain works, and it cannot show that the world produces chains by itself.
- **PC38 · Surfacing: stakes separate a story from noise.** Default: a chain is surfaced when it crosses two or more domains, is not a steady rhythm, and ends in something an actor holds or wants: a body, a holding, a price, a tie, a working in progress. Surfaced chains become candidates for D's situations (PG5). Dial: the stakes list per world. Reason: a soak run will produce thousands of humidity ripples, and the useful ones are those somebody would care about.

### What the player gets (PC39-PC40)

- **PC39 · A chain is knowledge.** Default: the truth of a chain lives in W's cause records, and a character sees the links they observed or were told (KW9, N). A Reports line explains an outcome from the links that character knows and marks the rest as unknown. A worked-out chain can be taught, sold or kept secret like any fact. Reason: discovering why the batch weakens when the keeper leaves is play, and showing the full chain at once would spend it.
- **PC40 · Found interactions stay usable.** Default: a chain the rules produce keeps working when the player leans on it (AD38, AD22). A runaway is reported by the harness, and the answer is the in-world thing that would stop it: the fuel runs out, the field is exhausted, a neighbor objects. Dial: the cascade depth dial stays as a numerical guard, and each damped chain is listed so a guard that hides real behavior shows up. Reason: balance comes from costs and agents in the world, and a clamp added for one exploit would also remove the chain.

### More to consider (PC41-PC43)

**ACT NOW** (done in this edit)

- **PC41 · Three emergence items join the queue** (below).

**ACCOUNT FOR NOW**

- **PC42a · Chains must survive idle settlement.** A chain that needs minute detail (smoke startles a shell) can vanish when a far place or an offline stretch settles by rates (PFP12, KW5). Default: each known chain has a rate form giving the same totals, or carries a `near-only` mark. Check: the same case at both detail levels gives matching outcome totals, or the mark is present. This matters more here than in most simulations, because much of the game's time passes in jumps.
- **PC42b · Emergence meets canon beats.** A chain can remove something a canon beat needs. Default: the beat's result holds and its route varies (AD49's results and route variance); the chain changes how the result comes about and is recorded as the cause. Dial per world and per beat.
- **PC42c · Conservation is the cheapest sanity check.** Matter, essence and heat moving along a chain should total the same before and after, less named losses. B already has this as a done check; the harness can assert it for every quantity a pack marks as conserved.
- **PC42d · A surprising chain has to replay.** The harness fingerprint, the seed and the address should regenerate the same chain (PR1), so a chain seen in play can become a regression case or a bug report.
- **PC42e · Sealed truths can leak through chains.** A cause chain can pass through a sealed fact. The Reports reading in PC39 follows what the character knows, so the sealed link reads as unknown in play; debug views are development surfaces and may show it.
- **PC42f · Generated things enter the same couplings.** A generated Gu or move executes through W (PC16), so it reads and writes the same quantities and can start chains canon things do not. The executes probe is a natural place to record which couplings a new thing touches.

**LATER / DELEGATE**

- **PC43a · A chain viewer.** A read-only debug panel that draws one cause chain from `explainEffect`, with the links the current character knows marked. Level sonnet, effort medium. Done check: the cc1 chain renders at the desktop viewport with unknown links marked.
- **PC43b · Societies and markets as couplings.** Price, scarcity and rumor as W quantities M writes and A reads, so economic chains appear in the same map. Waits on M's v0. Level sonnet, effort high.

### Emergence queue

Item 7 in PC21 (join lint and three chains) stays as it is.

| # | Item | Owner area | Files | Done check | Size |
| --- | --- | --- | --- | --- | --- |
| E1 | Coupling map (PC35) | E with W | new `scripts/coupling_map.mjs`, reads `src/world_substrate_packs/` and pack declarations | Prints cross-domain couplings, unread writes and unwritten reads for packs the game loads | Small |
| E2 | Near and far parity for known chains (PC42a) | E with W | `tests/emergence_harness.test.js`, `scripts/emergence_cases.mjs` | Each known chain matches at both detail levels or carries `near-only` | Small |
| E3 | Soak worlds with stakes (PC37, PC38) | E with P, after queue item 6 | `scripts/emergence_harness.mjs`, one P place generator | A seeded soak reports discovered chains per 100 days by source, with surfaced ones listed | Medium |

## The build plan (PC44-PC50, 2026-11-12)

Weibao (2026-11-12): "make plan to achieve proceduralness and emergent behavior and basically cover everything from creatures, to stuff that fall inside like gu and pets and more,to potion crafting, to spellcrafting, breaking down the vocab and more? Deeper aspects too?"

This section orders what the doc already proposes into one recipe per domain, a vocabulary method and four phases. It adds no new mechanism. Proposal throughout.

### One recipe for every domain (PC44)

- **PC44 · A domain is procedural when it has climbed seven steps.** The steps are the pipeline (PC5-PC8) seen from one domain. Each has a check a script runs.

| Step | The domain has | Check |
| --- | --- | --- |
| D1 Corpus | A ledger row per canon thing with a source locator | No `unclassified` rows (PFP25) |
| D2 Vocabulary | Canon broken into parts on four layers (PC46) | Vocabulary report: `other` rate at its dial on chapter-checked rows |
| D3 Law | Its mechanisms as one K law whose operations read properties, not names (PFP22) | No operation branches on a kind id or a world id |
| D4 Effects land | What a working does is a sentence W applies (PC8) | A settled working changes a W world through the one host |
| D5 Canon runs | Rows the runner executes to the recorded outcome (PC9) | `expressed` and `runs` computed, with misses grouped by missing rule |
| D6 Generates | New things by recombining, composing and discovery (PC15) | Fit report (PC11); one generator the game loads |
| D7 Couples | Its reads and writes on the coupling map and one chain with another domain (PC35, PC13) | A cross-domain chain on packs the game loads, matching near and far (PC42a) |

### Where each domain stands (PC45)

Read from the ledgers and files named. "Vocabulary today" is what the code already splits canon into.

| Domain | Covers | Vocabulary today | Runs today | Biggest gap | Next step |
| --- | --- | --- | --- | --- | --- |
| Living things (L) | Wild creatures, pets, livestock, plants, people's bodies, Gu bodies | Kind rows: class, inheritance, reproduction, stages, lifespan, organs, diet, genome (`src/living_kinds.js`) | 18 of 96 | 78 Gu rows lack body fields (D2) | A2 |
| Gu (G) | Abilities, refinement, moves, rank | Path, fuel, cost, about twenty function families (`src/gu_catalogue.js`) | 383 by label; 46 chapter-checked at most | Abilities end in labels (D4) | Queue item 5 |
| Potions (B) | Brewing, ingredients, delivery into a body | Operations `admit`, `react`, `stir`, `heat`, `prepare` (`src/brew_law.js`); property axes as world data (BRG1) | 5 of 316 Hogwarts, 43 of 226 Lord of the Mysteries | 380 ingredients lack property rows (D2); 82 potions wait on a body door (D4 into L) | Ingredient property axes for the 79 rows with evidence, then delivery into an L body |
| Spellcraft (S) | Casting, components, combined spells | Root lexicon with glosses (`src/spell_pack_hogwarts.js`), four world packs, carrier and cost table | 80 of 117 by label | The sentence is carried and not applied (D4) | Queue item 2 |
| Making (F) | Objects, materials, joins, gear | Not read for this pass | Not read | Not read | A census like PC33c before it gets a brief |
| Techniques | Killer moves, combined spells, formations, rituals | Slots, roles, order (KW18-KW21) | 4 of 776 moves | TG1-TG3 and a second consumer | A3 |

### Breaking down the vocabulary (PC46-PC47)

- **PC46 · Four layers, shared from the top down.** Proposal:

| Layer | Holds | Scope | Today |
| --- | --- | --- | --- |
| V1 Effect | What any working does: verb, object, target, time, carrier, cost, limits (PGC13) | One closed list for every world | 12 verbs, 18 objects, 7 targets, 5 times (`src/effect_grammar.js`) |
| V2 Property | What a thing is made of or is like: ingredient axes, material properties, body properties, paths, elements | One shape; each world's axes are data | Brewing has axes (BRG1, MR37); Gu has paths; bodies and materials vary by file |
| V3 Domain parts | The slots that identify a thing in one domain | One closed slot list per domain | See PC45's vocabulary column |
| V4 World words | Names, roots, glosses and naming sheets that map words to parts | Open, per world | Hogwarts root lexicon; naming sheets (NMR) |

Reason: V1 lets a potion, a spell and a Gu do the same thing in one language, which is what lets them meet (PC34). V2 is where substitution and surprise come from: a law that reads "cooling 3" accepts any thing with that property, whichever world or book it came from. V3 keeps each domain's identity small enough to fit. V4 keeps flavor out of the rules.

- **PC47 · One breakdown procedure for every vocabulary.** Default, per domain and world:
  1. Take the chapter-checked rows first, since their values carry locators.
  2. Split each row into slot values. A value joins a slot's list when two or more canon rows share it. Dial: one row is enough where the source names the category itself (a Gu path, a spell family).
  3. A value that fits no entry is written `other:<source words>` and counted. It is kept as data, and it is the backlog.
  4. Hold out one fold in five and rebuild it from the parts of the rest (PFP17). Misses are grouped by the missing value or rule.
  5. Print the vocabulary report: slots, values per slot, singletons, `other` rate, rebuild rate.

  A vocabulary counts as broken down at an `other` rate of 10% or less on chapter-checked rows. Dial: per domain, with a reason. Reason for the threshold: below it the remaining values are mostly one-off canon oddities, which belong in the authored tail and do not justify new slots.

  Two cautions. A name predicts an effect weakly (PC's expressibility note), so V4 words suggest parts and do not decide them. And a property axis is added when a law reads it; an axis no law reads is flavor and stays in V4.

### Deeper aspects, by domain (PC48)

- **PC48 · Depth is built on a domain once its canon runs (D5).** The palettes already written name the depth; this table says which parts each domain reaches for first. Order, not deferral: nothing here is dropped, and Q2 on the core and palette split is still open.

| Domain | First depth | Then | Palette owners |
| --- | --- | --- | --- |
| Creatures and pets | Stages that swap body parts and keep the individual (G2); condition and afflictions as courses (G3); a bond as a tie plus what the keeper knows about this animal (N) | Heredity on genomes (GN), learned behavior, wild cohorts and predators reading habitat quantities, domestication over generations | L checkpoint G1-G5, GN, IH, DG, BL |
| Gu | Feeding and starvation on L; will and loyalty to a holder; refinement lineage | Uniqueness, dao mark interference, Gu on beasts and in apertures as one host relation (PC32c) | Gu palette, PC23 |
| Potions | Preparation form, order and timing, vessel history and residue (done or in progress in B) | Dose and response in a body, tolerance, two potions meeting in one body, spoilage, substitution by property | PTD, MR |
| Spellcraft | Components and intent as parts; mishap as a settled outcome; counters through meet rules | Wards and charm fields as law fields (PFP14), learning curves (N), inventing a spell by backward search (PM3) | SPD, PGC |
| Across all | Failure that lands in the world; what the maker observed against the truth (KW9); the same result near, far and idle (PC42a) | Teaching drift, legacy and history (FN) | DC checklist |

### Four phases (PC49)

- **PC49 · Each phase ends with something the game loads, and is useful if the work stops there.**

| Phase | Goal | Work | Exit check |
| --- | --- | --- | --- |
| 1 True numbers and the joint | Counts come from execution, and a working changes the world | Queue items 1 to 3, A1, E1 | A settled spell changes a W world through the one host in a module the game loads; ledgers show computed states; the matrix and coupling map print |
| 2 One of each, all the way down | One canon thing per domain climbs D1 to D7 | A Gu ability as a sentence and its body on L (item 5 first pass, A2); a potion delivered into an L body; a spell from queue item 4; a pet kind on the lifecycle; a vocabulary report for each | Four canon rows, one per domain, run in the game from data with no code keyed on the row, and one chain crosses two of them at both detail levels |
| 3 Widen by rows | Coverage grows by data and reading, and bespoke code is deleted | PC47 at scale; chapter reads; techniques, identity and contest (A3 to A5); the rest of item 5; Making's census and first vertical | Per-domain expressibility reported with misses by rule; compression rows C1 and C3 at their floors for Gu; `other` rates at their dials |
| 4 Generate and soak | New things and chains nobody arranged | Queue items 6 and 7, E2, E3, A's actors loaded, composition interactions (PC27) | A generated Gu, move, potion and spell are each reachable in play and frozen on discovery; a soak run reports discovered chains from all three sources (PC34) |

After phase 4 a domain opens for playable slices (PFP9), lead lives first. Dial: a domain that finishes phase 2 early may open one slice as a consumer test.

Reason for phase 2 before phase 3: one row per domain taken through every step finds the missing joints while they are cheap. Widening first is how 383 rows came to run by label.

- **PC50 · Signals that the plan needs changing.** Three, each checkable. (a) Phase 1's exit is not met after two merge waves: the K to W joint is harder than "small" and gets its own design pass. (b) A domain's `other` rate stops falling across two reading passes: its V3 slots are the wrong shape. (c) Phase 2's four rows need code keyed on the row: the law reads names, and D3 failed.

## Combinations the books never made (PC67-PC76, 2026-11-12)

Weibao (2026-11-12): "creating combinations and more that wasnt in the original text? MOre to consider?"

PC15-PC19 cover making one new thing by changing its parts. This round is about putting things together: two Gu, three ingredients, a spell on a brew, a potion fed to a Gu. Read from the tree that day:

- **F11 · Generation recombines the slots of one thing.** `proposeEffects` changes one or two slots of a single canon sentence (`src/effect_checks.js`). Putting things together exists in one place, Gu move generation, which the game does not load.
- **F12 · Brewing already combines by data; Gu fusion does not.** A brew's `react` step takes reactions as pack data, with reactants, products and coefficients (`src/brew_law.js`). Gu fusion is a table of seven named kinds that calls the old activation function (`src/gu_moon_fusions.js`).
- **F13 · Nothing records what canon says fails.** The ledgers hold things that exist. Combinations a book shows failing, conflicting or backfiring have no rows.

### How an untried combination gets its result (PC67-PC70)

- **PC67 · A combination's result is computed, and the same inputs give the same result.** Default: parts, amounts, order, process and conditions go in, and laws that read properties (PFP22) produce the outcome. Variance comes from named conditions such as the maker's skill, the vessel or the moon, each with a cause. Dial: a world may declare a law that is itself uncertain (a refinement with a canon failure rate), drawn by address so a replay matches. Reason: a discovery the player can repeat, teach and sell needs a world that answers the same way twice. A bare roll would make every recipe a rumor.

- **PC68 · Three kinds of combining, one resolver each.**

| Kind | Example | Resolver | Owner |
| --- | --- | --- | --- |
| Inside one working | Ingredients in a brew; charms in one cast | The domain law's own operations over properties (brewing's reactions) | The domain |
| Workings into a technique | Gu into a move; spells into a combined casting | Parts' sentences in order, plus interaction terms (PC27) | K composition, P |
| Across domains | A potion fed to a Gu; a spell cast on a batch; a Gu body as an ingredient | One thing's effect sentence lands on W quantities the other thing reads. No law for the pair | W, through the coupling map (PC35) |

Reason for the third row: cross-domain combinations need no combination system. If the potion writes "heat" into a body and the Gu's law reads its body's heat, the pair already has a result. Each coupling added to the map is a family of combinations nobody had to write.

- **PC69 · Interactions are a table over properties, fitted from canon.** Proposal: each domain keeps one interaction table keyed by pairs of V2 property values (two paths, two ingredient axes, two spell roots' meanings), saying reinforce, interfere, transform or neutral, with a strength and a source locator. Canon combinations fill the cells they show. Default for an unseen pair: neutral, so the parts act side by side. Dial per world: how far a fitted neighbor may fill an unseen cell (same path family, same axis), labelled `authored`. Reason: N things make N squared pairs of things but far fewer pairs of properties, and a pair of properties is what the books actually explain.

- **PC70 · Every thing shows properties to the other domains.** Proposal: a domain declares a projection from its V3 parts to V2 properties, as data: a fire path Gu's body has heat, a moon-fed plant carries the same axis a brew reads. Default: the projection covers what a thing is as a material and as a body. Dial: more facets per world. Reason: without it a Gu can be a part in a move and nothing else, and "use it as an ingredient" needs a row per Gu.

### Keeping new combinations honest (PC71-PC73)

- **PC71 · Canon failures are data too.** Proposal: a `canon_negatives` ledger per world holds combinations a book shows failing, conflicting or backfiring, with locators. The fit report gains one number: the share of canon negatives the rules also reject or punish. Reason: F13. A system tested on what works will happily approve what the book says explodes.
- **PC72 · Held-out canon combinations are the main test.** Default: remove a known recipe, fusion or move from the data, hand the rules its parts and process, and compare the computed result with the recorded one in world terms (PC9's `expect`). Reported per domain beside rebuild rate. Reason: rebuilding an identity shows the grammar; reproducing a result shows the laws.
- **PC73 · A result that beats everything is a report, not a clamp.** Default: the generation run flags a new combination that does more than every canon thing in its niche for less cost. The answer is to find the cost or limit the law is missing, with its in-world reason. Dial: a world may let it stand when the source supports cheap power. Reason: balance is not forced (AD5, AD38), and a dominant result usually means a law forgot something the book assumes, such as rarity, backlash or upkeep.

### What the player does with it (PC74)

- **PC74 · Untried means unknown to the character.** Default: a quote for an untried combination is a forecast from what the maker knows (KW17): the properties they have identified and the interactions they have seen or been taught. Trying it turns the forecast into an observation (KW9), and the result is frozen with its grammar on discovery (PGC22). The maker may name it (V4, NMR), and the name is a fact others can learn. Dial: how much a skilled maker can infer about unseen cells. Reason: the workshop becomes a place to reason and experiment, and a recipe book is knowledge the character earned.

### More to consider (PC75-PC76)

**ACCOUNT FOR NOW**

- **PC75a · Process is part of the combination.** The same parts in another order, amount or timing are another combination (brewing's stir tokens already work this way). A combination's identity includes its process, so the archive key (PC18) needs it for techniques and brews.
- **PC75b · The space is too large to walk.** Combinations grow faster than any budget. Default: search starts from a cause (a need, a place's materials, an actor's knowledge) and from property pairs with non-neutral cells, under the budgets in PC17. An exhaustive sweep stays a harness job for small sets.
- **PC75c · Most results should be dull.** Canon combinations are the survivors. Default: no tuning toward good outcomes; the share of neutral, harmful and useful results is reported so a world that makes every mix wonderful, or none, is visible.
- **PC75d · Combinations leave things behind.** Residue, backlash, a changed vessel, a hungrier Gu. These by-products are effect sentences too, and they are where cross-domain chains start (PC34).
- **PC75e · A saved combination names its law revisions.** When an interaction table changes, an old discovery either still computes the same or is marked as made under an earlier revision. Old saves are disposable, so the default is to recompute and say so in the receipt.
- **PC75f · NPCs combine on the same rules** (PFP11). A sect's signature move or a rival's potion is a combination with a cause, and what the player invents can be copied or countered once knowledge of it spreads.
- **PC75g · Gu fusion is a making recipe.** The seven moon fusions become rows on F's grammar with B's process steps (PC23 making facet), and the bespoke table is deleted with them.

**LATER / DELEGATE**

- **PC76a · Canon negatives reading.** A pass over chapter notes for failed refinements, conflicting Gu, botched potions and miscast spells. Level haiku with a sonnet check, effort medium. Done check: each row has a locator and the parts involved.
- **PC76b · A workshop forecast view.** Shows what the maker expects from an untried mix, with the unknown properties marked. Player-facing, so it waits for slices. Level sonnet, effort medium. Done check: at the desktop viewport, a forecast, the trial and the recorded result read differently and the unknowns are named.

### Combination queue

| # | Item | Owner area | Files | Done check | Size |
| --- | --- | --- | --- | --- | --- |
| X1 | Interaction table and property projection for one domain (PC69, PC70) | G with P | `src/gu_catalogue.js`, a Gu world pack, `src/gu_move_roles.js` | Two held-out canon moves or fusions reproduce their recorded result from parts; an unseen pair runs as neutral | Medium |
| X2 | `canon_negatives` ledger and its fit number (PC71) | P with G, B, S | `docs/coverage/`, `scripts/coverage_report.mjs`, `scripts/grammar_canon_effects.mjs` | Ten or more negatives with locators; the rejected share is printed | Small |
| X3 | One cross-domain combination with no pair code (PC68) | E with B and L or G | An emergence case, packs already loaded | A potion's effect changes a living thing's behavior through a W quantity, and the case file passes the join lint (PC13) | Small |

These land in phase 3 (X1, X2) and phase 4 (X3) of PC49.

## Other avenues that need the same treatment (PC77-PC80, 2026-11-12)

Weibao (2026-11-12): "goahead and /reconcile-project /more-to-consider other avenues that might need this and more". The reconciliation ledger is in the [carry-out](PROCEDURAL_CARRY_OUT.md#reconciliation-2026-11-12). Sizes below are `src` file counts by file-name prefix on the tree that day, so they are rough and overlap.

- **PC77 · The largest bespoke mass is the book scenes, and it is larger than Gu.** 225 files and about 42,000 lines are named `book_*` (Lord of the Mysteries 62, Gu lead 42, Gu Keeper 41, Hogwarts 20, Paradise 15, Mother of Learning 12, others 33). These are the lead lives: one module per scene, the same pattern the plan found in Gu. They are paused, and they are the first consumers when slices resume (PFP9).

- **PC78 · Avenues, each with its owner and a first step.** Proposal. Each takes the PC44 ladder when its owner's v0 has a consumer. Order follows consumers, by default. No new chat is implied.

| Code | Avenue | Evidence | The treatment there | Owner | First step |
| --- | --- | --- | --- | --- | --- |
| AV1 | Lead-life scenes | PC77 | A scene as a situation row: place, actors, pressure, the workings on offer, the canon result as a fixed point and the routes that reach it (AD49) | D with the domain laws | One Klein scene and one Fang Yuan scene re-expressed as rows when slices resume, with their modules deleted |
| AV2 | Home, household and field life | `home_*` 36, `field_*` 17, `household_*` 7 | Cooking, care, farming and medicine as B and F workings on L's bodies | B, F, L | A census by facet, like PC33c |
| AV3 | People | `person_*`, `life_*`, `cohort_*`, `causal_*`, about 34 | Wants, schedules and choices on A; people generated from parts (PG1) | A | A's actors on the game's path (phase 4) |
| AV4 | Items, gear and materials | `gear_*`, `item_*`, `material_*`, `vessel_*`, `mixture_*`, about 36 | One identity per thing; properties on V2; making on F | F, identity | Making's census (PC45), then a first vertical |
| AV5 | Places and sites | `place_*`, `realm_*`, `pocket_*`, `village_*` and the site files | Places carry W quantities; generated places with causes (PG3) | X | The place generator the soak needs (E3) |
| AV6 | Progression | `skill_*` 11, `cultivation_*`, `src/progression_packs/` | Rank steps, sequences and skill practice on one rule | R | The progression facet in PC23 |
| AV7 | Other worlds | Mother of Learning, Paradise, Shadow Slave, Primordial, the Village, Mistglass, Proto23, NetHack-derived files | Each world as packs on the shared laws; a ready source of second consumers (PC30) | Each world's pack | PC58b's second-world verticals |
| AV8 | Words for generated things | `check:rules` reports 593 engine-vocabulary strings in its baseline | A generated thing needs a name and a line of plain prose built from its parts (V4, NMR, PRS1-PRS8) | P with the prose and naming rules | One generated Gu and one generated potion named and described with no engine words |
| AV9 | Screens | Per-system UI files | One surface that shows any thing by its facets, in place of a screen per system | UI rules; deferred with slices | The facets inspector (PC33a) as the prototype |
| AV10 | Cheats and debug | `cheat_*` 7 | Spawn a generated thing, set a quantity, replay a chain: the fastest way to check D5 to D7 by hand | Each domain | A spawn-by-parts cheat on the first generator |
| AV11 | Travel between worlds and rebirth | XWR rules, prestige | What crosses is an identity with properties; what it does on arrival is transfer (NV3) | X, identity, P | After identity is loaded (A4) |

- **PC79 · Tools that should feed or check the plan.**

| Code | Tool | Use here |
| --- | --- | --- |
| TL1 | The game MCP (`yairpg-game`) | Proves "in the game" for rung A4 and step D7 by playing the loaded bundle headless; its limits ledger already records what it cannot reach |
| TL2 | Source deep dives and the reading pipeline | A dive ends in ledger rows, vocabulary values and canon negatives (PC71), so reading lands as data on the day it is done |
| TL3 | The local model census lane | Bounded labelling of rows into slot values for PC47, with a checked sample; within the limits already recorded for that lane |
| TL4 | Grammar-driven tests | Each fitted grammar can draw cases for its own law's tests, so new values get exercised without a hand-written test per row |

### More to consider (PC80)

**ACCOUNT FOR NOW**

- **PC80a · Slices will regrow the bespoke mass unless scenes arrive as rows.** When lead lives resume, a new scene written as a module adds to PC77's 225. Default: the compression ledger gains a report row for `book_*` scene modules, and a new scene names the situation row it would be. It is a report, so nothing is blocked.
- **PC80b · Story is the avenue the rules reach least.** A scene row can hold the place, pressure, actors and fixed result. The telling, what Klein thinks and says, stays authored prose attached to the row. The treatment covers the mechanism of a scene and leaves its voice alone.
- **PC80c · Avenues compete for the same owners.** AV1, AV3 and AV5 all need D, A and X at v0, and PC57d already pulls N, A and L forward. The carry-out tracker is the place to see a queue forming on one owner.
- **PC80d · Two meanings of "absorb" in one tree.** The `src/absorb_*` folders and the mechanic-absorption skill import mechanics from other games; PC22 moves existing systems onto shared rules. Briefs name which they mean.

**LATER / DELEGATE**

- **PC80e · One census for every avenue.** A script that prints, per avenue, the files, the reachable share and the facets each would hand over, replacing PC33c. Level haiku for the pattern file, sonnet for the script, effort low. Done check: the table above is regenerated from the tree.

## Additions from a check of the readings (PC81-PC88, 2026-11-12)

Weibao (2026-11-12): "anything we should add to this? Feel free to use lesser agent to check the readings".

Three haiku readers checked the existing Gu, Lord of the Mysteries and Hogwarts notes against PC46's vocabulary. Budget record (AU2): three read-only invocations, existing notes and ledgers, no raw chapters, about 252,000 subagent tokens and 45 tool calls in total. Lines marked "reader" are their reports; lines marked "checked" were confirmed against the file afterwards.

- **F14 · No Gu has a recorded diet (checked).** `src/gu_catalogue.js` has no diet field and names diet as an open question; 0 of 1,466 `gu_kinds` rows carry one. PC29 called the body facet "mostly data". That was wrong: the data does not exist yet.
- **F15 · 177 Lord of the Mysteries potions are blocked on formulas that are already written down (checked).** The rule is `formula-in-notes`. The formulas sit in `docs/gm/dispatch/potion-pathways-2026-10-24/PATHWAY_POTION_TABLE.md` and the census file. This is a data move with no reading cost.
- **F16 · The effect vocabulary has already split in code (checked).** `src/spell_effects.js` uses `access`, `alter_law` and the objects `answer`, `presence` and `magic`, none of which are in P's twelve verbs and eighteen objects.
- **F17 · The same few objects are missing in more than one world (reader).** Luck or fate (Gu, Lord of the Mysteries), soul (Gu, Hogwarts), will (Gu), space (Gu), belief (Lord of the Mysteries).
- **F18 · Most other "gaps" are shapes an existing owner already has rules for (reader).** Acting and digestion (PRG4, PRG14), loss of control (MND9), prayer and answer (AGT9, AGT10), divination (KNW12), vows and keeper secrets (ledger rules `vow-clauses`, `keeper-secret`). They need an owner to answer a publish (PC7), and no new verb.
- **F19 · Canon failures are already scattered through the notes (reader).** About seven chapter-anchored Gu cases, eight to ten Hogwarts cases, and no tally for Lord of the Mysteries.
- **F20 · The creatures ledger has no Hogwarts creature (checked: one Harry Potter row, a plant).** PC30's default second consumer for the body facet has no row to use.
- **F21 · Reading state (reader, from the status docs; not verified).** Reverend Insanity volumes 1 to 4 have passes and 608 shards of volumes 5 to 24 do not. Lord of the Mysteries volume 1 is read in full. Harry Potter is at pass level and flagged unverified in its own record.

### What to add (PC81-PC88)

- **PC81 · The effect vocabulary grows by a stated rule.** Proposal: an object or verb joins V1 when two worlds need it, with both rows named beside it (the practice `spell_effects.js` already follows). Default now: add `luck` and `soul`; fold `access`, `alter_law`, `answer`, `presence` and `magic` into the one list or map them onto it. `will`, `space` and `belief` stay world-pack objects until a second world asks. Reason: F16 and F17. A closed list that code quietly extends is two lists.
- **PC82 · Luck acts on draws, so it goes through the generator contract.** Default: a luck effect changes the weights or thresholds of named draws for a holder, for a time, with a cause (GR1-GR17), and the change is visible in the draw's receipt. Reason: it is the one common power that edits chance itself, and an unrecorded bias would break replay (PC67).
- **PC83 · Shape gaps map to owners, in one table.** Default mapping, each a publish the owner answers: a gated effect (principle match, language key, keeper's secret) is a limit read at settlement (KW12); staged escalation is a course on L (G3); a fixed total such as Beyonder characteristics is a conserved W quantity (PC42c); several parties assenting is an oath (KW35-KW39); an entity that answers is an actor on A; an unintended release is a working A starts without the holder's choice. Reason: F18. It keeps V1 small and tells each owner what phase 3 will ask of it.
- **PC84 · The authored tail gets its own state.** Proposal: a ledger state `authored:<reason>` for canon the rules reproduce by a written result and cannot derive, counted beside `expressed`. Default: it counts as covered and is reported separately. Reason: without it the tail hides in `blocked`, and "everything" has no honest number.
- **PC85 · Move data that is already read before any new reading.** Three moves, no model cost: the 177 formulas into potion rows (F15); the scattered canon failures into the `canon_negatives` ledger (F19, X2); the ledger rule names that already describe shapes (`vow-clauses`, `keeper-secret`, `accidental-magic`) into PC83's table.
- **PC86 · The Gu body facet starts with a feeding pass.** Default: a bounded chapter search for feeding lines on the 78 chapter-checked kinds, then class defaults by path labelled `authored` for the rest (PC32b). The order in PC29 stands. Its payoff arrives later than that line implied, and A2's first deliverable is the fields and the unknowns, with few rows unblocked.
- **PC87 · A domain is done enough when reading stops finding new rules.** Proposal: a domain leaves the widening loop when two consecutive reading passes add rows and no new missing rule or vocabulary value. Dial: the number of passes. After that, coverage grows by rows alone and needs no design attention.
- **PC88 · One early thing to play (declined by Weibao, 2026-11-12: "No, engine first").** Kept for the record. Proposal as it was: after phase 1, one existing lead-life scene is rebuilt as a situation row (AV1) on whatever the engine can then run, and kept playable. Dial: which scene. Reason: Weibao is the player and the plan otherwise shows him nothing new until phase 2. It is a consumer test, not a return to slices.

**Corrections and conflicts found by this pass**

- The S checkpoint reports 94 of 117 spells running; the ledger shows 80. Recorded as RC11 in the carry-out.
- A reader read the status table as "TTKS unread". The five books were deep-dived in full on 2026-10-10; the table counts scene-shard passes, which have not been sent. Two kinds of reading share one word.

Packets with files and steps, the phase 2 rows, and the steps that keep the plan carried out: [procedural carry-out](PROCEDURAL_CARRY_OUT.md) (PC51-PC66, proposal).

## Open questions

- **Q5 · May upstream systems wait?** PC28 leaves the original game's skills, items, enemies and locations unabsorbed until a facet has a consumer (PC33c counts them). That defers work, so it waits for Weibao (AD56). Until answered, nothing is deferred.
- **Q8 · Answered.** Weibao, 2026-11-12: "No, engine first" ([log](gm/USER_VISION_LOG_2026-11.md#engine-first-no-early-scene-2026-11-12)). PC88 is not scheduled.
- **Q7 · Is PC49's phase order the build order?** One row per domain through every step before widening. It moves ability-facet breadth (the rest of queue item 5) behind the first potion, spell and pet verticals. Default if unanswered: phase 1 proceeds, since both orders start there.
- **Q6 · Answered.** Weibao, 2026-11-12: "Yes, use that order" (PC29). The rest of this section stays a proposal.

- **Q1 · May the headline numbers fall?** Item 1 moves Gu kinds from 26.2% running to about 3% or less, and spells from 71.4% to whatever executes. The work is unchanged; the count becomes true. Default if unanswered: report old and new side by side for one run.
- **Q2 · Is the core and palette split (PC20) approved?** It defers the palette column. Until answered, nothing is deferred and the queue above only sets order.
- **Q3 · How far should wiki-only Gu go?** 1,388 of 1,466 kinds have no chapter check. Default: they stay `catalogued` until a chapter pass or a read of the wiki page body gives an effect with a locator. Reading page bodies is a bulk reading job with its own usage cost.
- **Q4 · Where does the effect host live?** In P's file it adds a P to K edge; in a new neutral host file it adds a module. This is a build detail for K, W and P to settle in item 2. It changes file ownership, not behavior.
