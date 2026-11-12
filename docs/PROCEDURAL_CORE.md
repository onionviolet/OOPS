# Procedural core

*Proposal for Weibao, 2026-11-12. Nothing here is accepted. It is a compact core for the procedural side of the [procedural foundation plan](PROCEDURAL_FOUNDATION_PLAN.md): how canon things and new things are represented, generated, checked and counted. It reuses the plan's codes (PFP, GL, PR, CV, MS), the grammar contract's (PGC, PGB) and the kernel's (KW). New items are `PC`. Every threshold is a dial with a reason. Measured values were read from the working tree at commit 6425dd1f0 plus the uncommitted files in the tree that day.*

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
| Code: `procedural_grammar`, `effect_grammar`, `effect_checks`, `world_effects`, `world_substrate`, `kernel_working`, `kernel_compose`, `gen_kit`, world packs, coverage tooling | Code: `grammar_search` (PGC25-PGC28), `kernel_search`, `kernel_oath`, `kernel_descent`, `kernel_identity`, `agency`, `contest` until a core goal needs them |

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

## Open questions

- **Q1 · May the headline numbers fall?** Item 1 moves Gu kinds from 26.2% running to about 3% or less, and spells from 71.4% to whatever executes. The work is unchanged; the count becomes true. Default if unanswered: report old and new side by side for one run.
- **Q2 · Is the core and palette split (PC20) approved?** It defers the palette column. Until answered, nothing is deferred and the queue above only sets order.
- **Q3 · How far should wiki-only Gu go?** 1,388 of 1,466 kinds have no chapter check. Default: they stay `catalogued` until a chapter pass or a read of the wiki page body gives an effect with a locator. Reading page bodies is a bulk reading job with its own usage cost.
- **Q4 · Where does the effect host live?** In P's file it adds a P to K edge; in a new neutral host file it adds a module. This is a build detail for K, W and P to settle in item 2. It changes file ownership, not behavior.
