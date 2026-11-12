# Foundation P checkpoint, 2026-11-12: grammar contract, effect grammar, layers and coverage tooling (phase 3)

*Chat P in the [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md#one-more-chat). Branch `claude/fdn-p-grammar-4ffe18`, started from 9bbc51363 (fast-forwarded from c25fd396d, no own commits before). Phase: publish the grammar contract v0 and the canon test harness, prove it on one corpus slice. Rules applied: PFP16-PFP20, P2, P5, GR1-GR17 (GR2, GR3, GR6, GR9, GR10, GR11, GR16 tested), AD5, AD38, AD56, NMR2, NMR3, NMR5, AU13 (plan only), MC2, MC12, MC14. Status: implemented, below floor (AD43): agent-verified at the focused test slice, not human-reviewed, no runtime caller yet, so no playable change and no browser pass. GR12 (no generator without a reader) stays open until the first consumer lands in the next phase.*

```receipt
build: n/a
route: n/a
state: rules-reconciled
viewport: n/a (no player-facing change)
persistence: unchanged
tests: node --test tests/procedural_grammar.test.js tests/effect_grammar.test.js tests/coverage_report.test.js (23/23); check:rules; check:arch; check:coverage
review: none
```

## Phase 3 (2026-11-12, coverage milestones, master 2fff2285e merged)

Read the plan section "Making all achievable" (CV1-CV4, GL1-GL7, PR1-PR9, MS1-MS7, PFP25, PFP26). Status: implemented, below floor (AD43), agent-verified, not human-reviewed; no runtime caller yet, so GR12 stays open.

| Item | Result | Commit |
| --- | --- | --- |
| MS1 tooling | `scripts/coverage_report.mjs`, `npm run check:coverage` (fails only on malformed rows), generated `docs/coverage/README.md` with every CV3 ledger listed as not started. Sent to the coordinator first | 5cd05f309 |
| GL5 joint conditioning (PGC19) | `given` arrays with backoff; `proof.gu-kind@3` chains path on rank and role on path and rank | this commit |
| GL1 identity | Pair support 96.5% (path and role), 94.0% (rank and path), 98.5% (rank and role) on the full index; slice 94.0%, 92.5%, 93.5%. Target 80%: **met**. Path read from name parts 39.5% (baseline 13.2%) | this commit |
| Inference scoring (PGC20) | Naive Bayes with add-one smoothing, prior as a dial (off). v1 and v2 path inference moved from 39.8% to 37.8%, role from 48.4% to 44.4%; effect verb inference rose to 77.2% (Gu) and 46.8% (Hogwarts). The phase 1 and 2 tables below keep their original numbers as history | this commit |
| GL2 effect (MS2) | Predicted from identity: Gu whole sentence 43.9% (majority 0%), verb 54.4%; Hogwarts 11.0% (0.9%), verb 31.2%. **Below the 70% target**, misses grouped as missing rules in the contract doc and the effects report. Re-assembly rebuild stays 96.5% and 78.0% | this commit |
| GL6 nested parts (PGC21) | `parts` slot type with child grammars: assemble, fit, generate, path-prefixed violations. All 23 canon moves assemble as nested roles; 28 roles unnamed in the source, 6 single-role moves, every named kind catalogued | this commit |
| PR2 frozen ref (PGC22) | `freezeValue`, `thawValue`; a newer revision never re-derives a seen value | this commit |
| PR3 budgets (PGC23) | `exploreEffects` budget `{trials, stop}` with a truncation receipt | this commit |
| PR4 niche archive (PGC24) | `createNicheArchive`, `archiveOffer`; explore fills it from the kept spread | this commit |
| PR1-PR9 mapping | Contract doc table: each PR rule to its PGC line | this commit |

Rescope (PFP6): MS2's 70% applies to the effect predicted from identity, which P's harness can measure but cannot raise alone. Gu "support" and "offensive" types and Hogwarts family headings span many verbs. Closing the gap needs identity the domains own (G's resolver kind per Gu, S's operation per spell, SG2) as inputs independent of the sentence labels. The test and the target stay; the requests below carry it.

### Requests (phase 3, coordinator relays)

- **G:** a resolver or ability kind per catalogued Gu, independent of `function`, as GL2 identity. Write `docs/coverage/gu_kinds.jsonl` and `gu_moves.jsonl` with the MS1 tool. Name the 28 unnamed move roles where a chapter names them; otherwise keep them as counted roles.
- **S:** an operation per spellbook record (SG2) as GL2 identity, and `docs/coverage/hp_spells.jsonl`.
- **B:** `hp_potions`, `hp_ingredients`, `lotm_potions` ledgers. The nested `parts` slot (PGC21) is ready for BRG3 steps.
- **L:** `creatures` ledger.
- **K:** the composed working for GL3 and MS4. Each role in P's move shape (`roles: [{role, kind}]`) is one step.
- **E:** GL4 needs a seeded world run with place causes (PGB5).

## Phase 2 (2026-11-12, after K and W v0 merged)

Merged master (ea6a170dd) into this branch first. Read the plan sections on sectioning (SC1-SC10, PFP21), separate but connected (SB1-SB6, NV1-NV5, EF1-EF8, PFP22-PFP24) and broad systems (OS9-OS11, PG1-PG9), W's [substrate contract](../../../WORLD_SUBSTRATE_CONTRACT.md) and every phase-1 checkpoint (G's GG1-GG13, L's grammar, F's FBG and FBC, B's BRG1-BRG8, S's SG1-SG9). Status: implemented, below floor (AD43), agent-verified, not human-reviewed; no runtime caller yet.

| Path | What |
| --- | --- |
| `src/effect_grammar.js` | The effect grammar (PGC13-PGC16): 12 verbs, 18 objects by kind, shared targets and times, world carriers and costs, verb-object and carrier-cost rules, scope, lowering onto W ops, derived counters |
| `src/effect_checks.js` | The five checks and the novelty dial (PGC17, PGC18): `proposeEffects`, `checkEffect`, `keepSpread`, `fitCostCurve`, `worldLaws`, `exploreEffects` |
| `tests/effect_grammar.test.js` | 6 tests: rules, lowering and W requests, two-world canon test, dial and cause, each check's failure reason, curve and spread |
| `tests/fixtures/procedural_grammar/effect_worlds.mjs` | Gu and Hogwarts mappings, labellers, independent comparisons, world words and one world law. Fixtures for G and S to adopt |
| `scripts/grammar_canon_effects.mjs`, [canon_test_effects_report.txt](canon_test_effects_report.txt) | Runner and output |
| `scripts/grammar_label_mc14.mjs`, [mc14_labels_summary.json](mc14_labels_summary.json) | MC14 step 1, deterministic, repo data only; private Gu labels written to the gitignored private path |
| Contract doc, rules index, area guide | PGC13-PGC18, PGB8-PGB12, results; register range PGC1-PGC18 |

### Results

- **EF1, two worlds:** Gu effects rebuild 55/57 (96.5%), Hogwarts spells 85/109 (78.0%). Missing rules: Gu time effects (PGB9); Hogwarts 5 verb-object rejects and 19 family mismatches, each listed in the report. Reading the verb back from object, target and time beats the majority guess in both worlds (64.9% against 28.1%; 40.4% against 7.3%). Across worlds, 64.2% of Hogwarts sentences and 84.2% of Gu sentences use a verb on an object kind the other world's canon also uses. The Gu rate is partly by construction (labels map G's function families); G's 14 independently authored ability kinds all agree.
- **Five checks and novelty dial:** 40 proposals per world and level keep six across six niches each; pass rates 40% to 60%. Failures name the missing law (runs) or the missing world word (explains). The Gu cost curve finds no scope slope over 26 canon amounts (PGB8). Composition is refused and routed to K (SC6).
- **MC14 step 1:** 170 Gu paths from name words (91% agreement with categories where both exist, kept as a separate layer), 6 from chapter rows; 109 of 117 spell leads as sentences; 11 of 101 potion subjects recipe-shaped for B. Roles (822 missing) have no repo source. No agents were used.

### Plan done check, where it stands

| Done check (plan table, P row) | Status |
| --- | --- |
| Two domains pass the canon test on held-out items | Met in P's harness for Gu kinds, Gu effects and Hogwarts spell effects, on P's fixture grammars. Domain-owned grammars (G, S) adopting the fixtures would make it the domains' |
| Generated items from both run through their laws with no special case | Open. Generated effects pass P's checks and lower onto W ops, but no domain working settles them yet (needs G or S on K, then a W pack answering `effect.*` kinds) |
| One place-driven and one actor-driven generation in a seeded world run (with E) | Open. Causes and the novelty dial are in place (`place`, `pressure`, `inventor`); needs E's harness and PGB5 |

No rescope: the open rows depend on consumers in other chats, which is what the plan's order expects.

## Requests (coordinator relays)

- **W:** (1) agree the boundary in PGC15 (P composes and lowers; W declares quantities and lands effects). (2) Two-world quantity candidates for WSC2: `vitality` (Gu 13 sentences, Hogwarts 6) and `light` (Gu 1, Hogwarts 4); `force`, `essence`, `heat` and `sound` have one world each so far. (3) For W-B8, a first effect kind list: the 11 `effect.<verb>.<object>` kinds both worlds publish (`effect.remove.vitality`, `effect.sense.information`, `effect.conceal.information`, `effect.move.position`, `effect.add.thing`, `effect.transform.mind`, `effect.move.relation`, `effect.add.light`, `effect.block.working`, `effect.block.form`, `effect.transform.form`). (4) Confirm or replace the one mapping P proposes: an effect on moisture adds to place `humidity`.
- **G:** adopt or replace `gu_kind_grammar.mjs` and the Gu half of `effect_worlds.mjs` in your files (GKG1-GKG3, the function-to-sentence table); decide PGB9 (Year Gu and Spring Autumn Cicada: years as a held quantity, or a verb on time).
- **S:** adopt or replace the Hogwarts labeller; review the 19 family mismatches and 5 rejects in the effects report (labeller errors or records whose family spans verbs); supply world words for parts canon does not yet use, so level-2 transfers can explain themselves.
- **B:** the 11 recipe-shaped potion rows in `mc14_labels_summary.json` are your BRG1 and BRG3 starting set; B's grammar on PGC slots needs nested steps (PGB2).
- **K:** composition (NV2, PGB11) as a composed working; P supplies one sentence per step.
- **Naming owner:** the `gu` sheet still lacks a kind-name register (PGC12, PGB7).
- **Coordinator:** MC14 roles need wiki page text that is outside the repo, or bounded haiku readers on it; not started without approval.

## What landed (phase 1)

| Path | What |
| --- | --- |
| [docs/PROCEDURAL_GRAMMAR_CONTRACT.md](../../../PROCEDURAL_GRAMMAR_CONTRACT.md) | Contract v0: PGC1-PGC12, how a domain uses it, existing grammars, proof run, backlog PGB1-PGB7 |
| `src/procedural_grammar.js` | `defineGrammar`, `fitGrammar`, `overlayGrammar`, `assemble`, `generate`, `inferSlot`, `canonTest`. Pure, domain-free, imports only `gen_kit.js` |
| `tests/procedural_grammar.test.js` | 9 tests: declaration, assembly and dials, fit, overlay, addressed and caused generation with budget and fallback, freeze and reload, golden and sweep, inference, canon test on the Gu slice |
| `tests/fixtures/procedural_grammar/gu_kind_grammar.mjs` | Proof Gu kind grammar, revisions 1 and 2, labeller and compare. A fixture for chat G to adopt; not a Gu world pack |
| `tests/fixtures/procedural_grammar/gu_kind_slice.json` | 140 labels-only rows from the held review index (name, ranks, wiki path and type categories, revision id) |
| `scripts/grammar_canon_gu.mjs` | Runner: full held index when present, committed slice always; `--write-slice` regenerates the slice deterministically |
| [canon_test_gu_report.txt](canon_test_gu_report.txt) | Full and slice output for both revisions |
| `docs/RULES_INDEX.md`, `docs/AREA_GUIDE.md` | One register row, one router mention, one Generation line (hunk edits) |

No domain file was edited. Compatibility line (MC4): no save shape touched, unchanged.

## PFP2 counts

| Count | Value | Note |
| --- | --- | --- |
| Canon cases that run as data through the grammar | 304 Gu kinds rebuild under `proof.gu-kind@2` (120 in the committed slice) | Expressed and assembled, not yet run by a Gu working: that needs G on K |
| Bespoke scene modules in P's area | 0 | P owns no scene modules |
| Corpus records the grammar cannot yet read | 1,159 of 1,463 | Missing labels, not missing rules (MC14 below) |

## Canon test result

| Grammar | Corpus | Rebuild | Inference from name parts | Pair support (path+role, rank+path) |
| --- | --- | --- | --- | --- |
| `proof.gu-kind@1` | full, 304 labelled | 236/304 = 77.6% | path 39.8% (baseline 13.2%), role 48.4% (baseline 33.6%) | 54.5%, 80.0% |
| `proof.gu-kind@2` | full, 304 labelled | 304/304 | same | 56.0%, 76.0% |
| `proof.gu-kind@1` | slice, 120 labelled | 87/120 = 72.5% | path 24.2% (11.7%), role 40.0% (24.2%) | 36.0%, 51.0% |
| `proof.gu-kind@2` | slice, 120 labelled | 120/120 | same | 38.0%, 52.0% |

Revision 1's failures, listed as missing rules (full index):

1. 26 Immortal-band kinds whose canon name carries no "Immortal" (for example Edge Gu, Wailing Whale Strength Gu). The title is a naming habit, not derived from rank (GKG2).
2. 25 kinds with no "Gu" suffix (the Liquor Worm and Lotus lines, Fixed Immortal Travel). The suffix is a naming part (GKG3).
3. 11 kinds whose ranks cross the Immortal threshold (Year Gu, Liquor Worm, Beast Enslavement). A kind is a line; the threshold rule became a dial (GKG1).
4. 6 rare path or role values unseen in the training folds (Rule, Emotion, Phantom, Heaven, Snow paths; Steed type). Declared world lists replace learned ones (PGC2).

Revision 2's rebuild is close to by construction for the naming parts, which are read off the name, and the per-slot range check (200/200 inside every run) is guaranteed at smoothing 0. The non-circular evidence is the inference lift over the majority guess and the pair support: generated kinds use a canon path and role pair only 56% of the time, because the slots are drawn separately. Head and mark word shares are over the 0.25 tolerance (0.37, 0.39). Stated in the contract doc.

## Checks run

| Command | Input | Result | Gaps |
| --- | --- | --- | --- |
| `node --test tests/procedural_grammar.test.js` | this branch, after the pair-support follow-up | 9/9 pass | Focused only; full `npm test` left to the integrator (MC7) |
| `node scripts/grammar_canon_gu.mjs --index <held gu-identities.json>` | private index, 1,463 records | numbers above | Private index is not in git; the slice reproduces without it |
| `npm run check:rules` | this branch | pass; rules index 0 warnings | One pre-existing TMR1 lint warning in `src/book_world_hp_exams.js`, not this change |
| `npm run check:arch` | this branch | pass | |
| `npm run build` | not run | n/a | No bundled file imports the module; the integrator's build covers it |

## Decision to name

The committed slice (`gu_kind_slice.json`) and the report are derived from the gitignored private review index. They hold catalogue names, ranks, wiki path and type category labels and revision ids, no book or wiki prose, which matches what the tracked `gu-identity-evidence.json` already carries. The coordinator or integrator can veto that and the test would then need a different tracked slice.

## What the rules could not express

PGB1-PGB7 in the [contract backlog](../../../PROCEDURAL_GRAMMAR_CONTRACT.md#what-v0-cannot-express-yet-backlog-by-request): two givens per slot, nested step parts (B), numeric quantities on parts (B, F, R), joint grammars over held things (killer moves, G), place-driven weights from W quantities (P3, E), bounded actor search (P4, A, G), names from the naming sheet register (NMR).

Also not covered: a second domain's canon test (plan done check needs two). The next candidate is B's BG1-BG8 on the Hogwarts potion evidence (`docs/research/hogwarts-potion-evidence-2026-11-11/`), which needs PGB2 for steps.

## MC14 corpus labelling plan (finite, AU13; not started)

Target: path, role and rank labels for the 1,159 unlabelled Gu records (missing role 822, path 719, rank 686), each with a locator. Readers are not dispatched in this phase.

1. **Deterministic first, no agents.** Parse the saved Fandom dump (`docs/research/power-systems/wiki-digests/full-dumps/reverend-insanity_SOURCES.json`) for infobox path, type and rank fields on the 851 unlabelled records that have a Fandom page but no usable categories, and the Saga card fields for the rest. Script output goes to the private index directory; a label carries its field and revision as locator. Done check: count of labels recovered per field.
2. **Inference as a proposal, not a label.** `inferSlot` ranks candidate paths and roles from name parts for whatever remains. Stored as `proposed`, never used as a fit label (PGC11).
3. **Bounded readers on card and page text** (haiku, AU3 and AU13). The remaining records' card or page text, about 300 words each by estimate, is at most about 350,000 words: N = ceil(350,000 / 12,000) = 30 shards, plus min(3, ceil(0.1 x 30)) = 3 repair shards, concurrency two. A one-shard pilot measures real words per row and resizes N in this plan before the rest. Output: one JSON line per record `{id, field, label, locator, paraphrase<=25 words}`.
4. **Chapter readers only for the residue** that has a Saga first-chapter locator (819 of the 1,159 records name a first chapter; 473 distinct chapters between 1 and 2331). Size by the AU13 word formula from measured chapter words after step 3, as a separate declared plan, since a full pass would be on the order of 80 or more shards.
5. **Deterministic checks on all output.** Schema, label in the declared lists (`GU_PATHS`, `GU_ROLES`, ranks 1-9), locator present, no raw prose beyond the paraphrase cap. Spot-check a 10% sample against its locator (sonnet or the coordinator). Done check: labelled rows with locators and a spot-check pass rate of 90% or more; then rerun `scripts/grammar_canon_gu.mjs` and record the new labelled count and rates.

Level haiku, effort high (volume); preserve the Codex reserve (local or Claude readers only).

## Next phase (after phase 3)

1. GL2: rerun the identity prediction once G and S supply independent identity parts; target 70%.
2. GL3: rebuild the 23 moves through K's composed working when it lands (MS4).
3. GL4 with E: a place-driven and an actor-driven generation in a seeded world.

## Next phase (after phase 2)

1. When G or S has a working on K: settle one generated effect through it and a W pack that answers its `effect.*` kind (generated means runnable, PFP16; closes GR12).
2. PGB1 (two givens) and PGB8 (rank term in the cost curve), then rerun both canon tests.
3. PGB2 nested parts with B's potion rows as the second grammar of things.
4. With E: one place-driven (PGB5) and one actor-driven generation in a seeded world run.

## Next phase (phase 1 text, kept)

1. Wait for K and W v0 on master; then wire one consumer: a generated Gu kind (cause `place`) handed to G's working through K, so "generated means runnable" is shown on a real working (PFP16).
2. Second domain canon test with B (needs PGB2), so the plan's "two domains pass" done check can close.
3. PGB1 (two givens, and role given path), then rerun the Gu inference and pair support.
4. MC14 step 1 (deterministic, no agents) when the coordinator approves the labelling plan.

Requests to other chats: the naming owner adds a Gu kind-name register to the `gu` sheet and repairs its sample person names (log labels such as "Chores" are listed as names); G adopts or replaces `tests/fixtures/procedural_grammar/gu_kind_grammar.mjs` in its own files and owns GKG1-GKG3; B and L declare their drafts on PGC slots and send PGB requests to P.
