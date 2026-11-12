# Foundation P checkpoint, 2026-11-12: procedural grammar contract v0

*Chat P in the [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md#one-more-chat). Branch `claude/fdn-p-grammar-4ffe18`, started from 9bbc51363 (fast-forwarded from c25fd396d, no own commits before). Phase: publish the grammar contract v0 and the canon test harness, prove it on one corpus slice. Rules applied: PFP16-PFP20, P2, P5, GR1-GR17 (GR2, GR3, GR6, GR9, GR10, GR11, GR16 tested), AD5, AD38, AD56, NMR2, NMR3, NMR5, AU13 (plan only), MC2, MC12, MC14. Status: implemented, below floor (AD43): agent-verified at the focused test slice, not human-reviewed, no runtime caller yet, so no playable change and no browser pass. GR12 (no generator without a reader) stays open until the first consumer lands in the next phase.*

```receipt
build: n/a
route: n/a
state: rules-reconciled
viewport: n/a (no player-facing change)
persistence: unchanged
tests: node --test tests/procedural_grammar.test.js (9/9); check:rules; check:arch
review: none
```

## What landed

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

## Next phase

1. Wait for K and W v0 on master; then wire one consumer: a generated Gu kind (cause `place`) handed to G's working through K, so "generated means runnable" is shown on a real working (PFP16).
2. Second domain canon test with B (needs PGB2), so the plan's "two domains pass" done check can close.
3. PGB1 (two givens, and role given path), then rerun the Gu inference and pair support.
4. MC14 step 1 (deterministic, no agents) when the coordinator approves the labelling plan.

Requests to other chats: the naming owner adds a Gu kind-name register to the `gu` sheet and repairs its sample person names (log labels such as "Chores" are listed as names); G adopts or replaces `tests/fixtures/procedural_grammar/gu_kind_grammar.mjs` in its own files and owns GKG1-GKG3; B and L declare their drafts on PGC slots and send PGB requests to P.
