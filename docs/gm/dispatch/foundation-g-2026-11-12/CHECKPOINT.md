# Foundation chat G (Gu), phase 1 checkpoint, 2026-11-12

Owner: chat G in the [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md). Branch `claude/fdn-g-gu-312887`. Phase 1 is inventory and catalogue only; nothing embeds before K and W v0 are on master. Status: **phase 1 done (agent-verified, not human-reviewed)**. Proposals throughout are AD56 working defaults.

Start note: the worktree was cut at `c25fd396d`, 37 commits behind the stated start `9bbc51363`. The branch was a clean ancestor, so it was fast-forwarded to `9bbc51363` (no reset, no merge commit) before any work.

## What changed

- [`src/gu_catalogue.js`](../../../../src/gu_catalogue.js): every one of the 78 chapter-checked identities in [the evidence index](../../../research/gu-identity-evidence.json) now has a `parts` row: chapter-backed rank and path, roles, function, chapter-stated fuel and dao-mark pointers, a separate `wiki` layer (rank, path, type labels from the private review index), and open questions. Exports `guFunctions` and `guRoles`. Existing ability, recipe, conversion, growth, treatment, trait and move bindings are unchanged.
- [`tests/gu_catalogue.test.js`](../../../../tests/gu_catalogue.test.js): one new test. Every evidence identity has a parts row; rank equals the evidence ranks; every evidence open field stays open; an empty rank, a null path or a null function each name an open field; roles and functions come from the exported vocabularies; the wiki layer is present.
- [`scripts/gu_keeper_inventory.mjs`](../../../../scripts/gu_keeper_inventory.mjs): read-only extractor behind the inventory.
- Docs in this folder: [inventory](KEEPER_COMPRESSION_INVENTORY.md), [grammar proposal for P](GU_GRAMMAR_PROPOSAL.md) (GG1-GG13), [quantities draft for W](GU_QUANTITIES_FOR_W.md) (GQ1-GQ13).
- Follow-up commit: lineage `inputs` on Moon Scar and Landscape as Before (tested to be catalogued kinds), the inventory appendix table, a ten-module compression set where each pick owns its module, and default-dial-reason wording in GG5, GG9, GG13 and GQ11.

Save compatibility (MC4): unchanged. No save key, slice or scene row changed; `parts` is read by nothing at runtime.

## PFP2 counts

| Count | Before (9bbc51363) | After |
| --- | ---: | ---: |
| Kinds in the catalogue | 28 | **78** |
| Kinds with grammar parts as data | 0 | 78 |
| Kinds with a binding a shared leaf runs with no scene module (tests run them: Red Fire set of five through `searchGuMoves`; Scale Armor and Stealth Scales recipes through `gu_refinement`) | 7 | 7 |
| Kinds with playable bindings reached only through a scene module | 21 | 21 |
| Bespoke scene modules (31 keeper src + 36 keeper packs) | 67 | 67 |
| Further non-keeper scene modules with their own saved row | 5 | 5 |
| Move records as data (evidence) / move bindings in the catalogue | 23 / 1 | 23 / 1 |

The first row rose; the "runs as data" row did not, by design: parts rows are identity data. That row moves in phase 2, when the [ten-scene compression set](KEEPER_COMPRESSION_INVENTORY.md#scenes-grouped-by-the-shared-leaf-that-could-run-them-as-data) is re-expressed on K's working and its src modules are deleted.

Source facts, authored values and open questions stay separate: `observed` paraphrases the chapter-checked evidence note (the chapters were checked by the 2026-11-11 Gu lane; this phase did not re-read them), `authored` names the catalogue author's reading, `open` lists gaps, and wiki labels sit in their own layer (SKR3). A one-off script compared every `wiki` field with the private index; two mismatches (Heavenly Secret rank, Responsive Luck path) were fixed. That check needs the gitignored index, so it is not in the test suite.

## Checks run

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/gu_catalogue.test.js tests/gu_refinement.test.js tests/gu_workshop.test.js` | 57/57 pass | |
| `node --test tests/gu_*.test.js` (includes `gu_lead_life` and `gu_life`, MC5 lead lines) | 208/208 pass | full `npm test` left to the integrator (MC7) |
| `npm run check:rules` | PASS; 593 player-text strings vs 590 baseline, 0 new | one stale glob warning in `.claude/rules/research-and-agents.md`, pre-existing |
| `npm run check:arch` | pass, no growth | |
| wiki-layer comparison against the private index | 78 rows, 0 mismatches after two fixes | not repeatable without the private index |
| `npm run build`, browser | not run | no player-visible change; nothing reads `parts` |

## What the rules could not express (backlog)

- **GB1 · Conflicting chapter evidence on one field** (Year Gu's rank against its year count; green-grape activation for Years Flow Like Water). A rank list holds one answer.
- **GB2 · Provisional identities** (the yaksha octopus king's wild Immortal) are not kinds yet.
- **GB3 · Incarnations** under one name (mortal and Immortal Self Strength; Man as Before before and after ascension).
- **GB4 · Acknowledgement without refinement** (Love, Light): control has degrees, and no leaf reads them.
- **GB5 · Dao marks** have four chapter pointers and no amounts; GKM240 and GKM246 stay paper cases.
- **GB6 · Essence grades** above rank five: only green grape and red date are named in the evidence.
- **GB7 · Feeding, stage minutes and windows** are scene constants in code (inventory timing list), not row fields.
- **GB8 · 21 kinds have no standalone function** in the cited scenes; generated Gu cannot copy them until a resolver or a chapter supplies one.

## Requests sent (shared notes folder)

- K: the five-part scene shape (facts row, counter ledger, availability predicate, dispatcher, counter stock) maps onto `defineWorkingLaw` / method / `settleWorking` from K v0. C's G1 request (killer moves as K workings with beats as steps) is taken on as G's phase 2 target.
- W: GQ1-GQ13.
- P: GG1-GG13 and the corpus weights.
- L: Gu-as-creature rows (producer, hosted, wild, emergent) come from the parts `roles`; L runs the body.
- R: Gu worm rank stays a G row; the Gu Master path row is R's rule over G's Reverend Insanity data.

## Next phase (after K v0 and W v0 are on master)

Re-express the ten-module set (`gu_keeper_red_steel` with rank_trial, `gu_keeper_seven`, `gu_keeper_nine`, `gu_keeper_stealth`, `gu_moonlight_stock`, `gu_keeper_rainbow`, `gu_keeper_fire_trial`, `gu_keeper_move_trial`, `gu_keeper_defense`, `gu_keeper_vitality`; order red_steel, seven, nine first) as catalogue rows plus one generic Gu working on K, with essence stock read from W, and delete those ten src modules. Move stage minutes and feed windows onto rows. Drive move search from the 23 evidence move records. Done check from the plan: 60 or more kinds as data (78 now as identity data; runnable kinds still 7, so this line counts as met only for identity rows), 10 scenes re-expressed with old modules deleted, move records drive move search, this backlog kept.

```receipt
build: n/a
route: n/a
state: built
viewport: n/a
persistence: unchanged
tests: focused Gu tests (208 pass per chat G)
review: diff-scoped
surface: gu_catalogue.js grew 28 to 78 identity kinds; scripts/gu_keeper_inventory.mjs added
```

# Phase 2a, 2026-11-12: Gu on the kernel, runnable data

Started from master `ea6a170dd` (merged into this branch). Scope per the new plan sections: SC4 and PFP21 (a Gu is rows on each mechanism; G keeps writing `gu_*` files, SC5), SC6 (moves as composed workings), PFP22-PFP24.

## What changed

- [`src/gu_working_law.js`](../../../../src/gu_working_law.js): one K working law (`gu.working@1`) with five operations: `activate` (gu_activation), `convert` (catalogue conversion between essence stages), `refine` (gu_refinement begin and one step per recipe stage), `grow` and `treat` (Vitality Grass rows). `guMethods(kind)` builds every method a catalogue kind supplies from its rows; `guMoveMethod(record)` turns a move record into a composed working with one activate step per role. Bound Gu carry the role kind `gu` and their catalogue kind in `guKind` (KW3); the law hands leaves their own view.
- `derivedGuAbility(kind)`: a parts row with a chapter rank and a function, but no authored ability, runs on a labelled `derived` default (fuel family from rank by GG13 unless the chapters state it; cost and magnitude one unit, dials in `GU_WORKING_DIALS`). Rank-open kinds get no derived default, so the open-rank rule of the catalogue test holds.
- [`src/gu_activation.js`](../../../../src/gu_activation.js): optional `modifiers` input and output, so supports carry from one kernel step to the next. This closes K's backlog KB1 on G's side with no kernel change.
- [`tests/gu_working_law.test.js`](../../../../tests/gu_working_law.test.js), 7 tests: coverage and labelled gaps; every runnable ability quotes through K; one jump versus steps and reload; Little Light Moonblade as a composed working equals the whole-move activation; Red Fire with three supports equals the move search's best row; Four Flavors refines from its recipe row under any partition and interrupts when short of wine; conversion, growth and treatment numbers.

Save compatibility (MC4): unchanged. No scene uses the law yet; no save key changed.

## PFP2 counts

| Count | Phase 1 end | Phase 2a end |
| --- | ---: | ---: |
| Kinds in the catalogue | 78 | 78 |
| Kinds that run as data with no scene module (through `gu.working`) | 7 | **46** (28 authored bindings, 18 on labelled derived abilities) |
| Kinds that cannot run yet | 71 | 32: 18 lack a standalone function in the cited scenes, 14 lack a chapter rank |
| Move records running as composed workings (tests) | 0 | 2 (Little Light Moonblade, Red Fire set) |
| Bespoke scene modules (keeper src + packs) | 67 | 67 |

`guRunnableCoverage()` reports the list and each gap.

## Checks

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/gu_working_law.test.js tests/gu_*.test.js tests/kernel_working.test.js` | 232/232 pass | |
| `npm run check:arch` | pass, main.js growth -1 | |
| `npm run check:rules` | PASS; one TMR1 warning in `book_world_hp_exams.js`, pre-existing and not G's | |

## Rescope and next

Compression did not start in 2a: deleting a scene module needs a host that runs scene operations through `gu.working`, and the first candidates (seven, nine, red_steel) are dispatched together through `gu_keeper_wild` with cross-scene readiness. Phase 2b builds that host for one owned module and deletes it, using the `gu_upkeep` headless harness as the regression. Then the 23 evidence move records drive move search (phase 2c), and generation through P's grammar (phase 3).

Request to K: none. KB1 is handled on G's side.

# Phase 2b, 2026-11-12: first scene module deleted

- New generic host [`src/gu_essence_line.js`](../../../../src/gu_essence_line.js): a fed converter raises essence one stage and a cast spends the raised pool through a catalogue ability, settled on `gu.working` through the kernel. Conversion numbers, cast cost and strike come from catalogue rows.
- Scene row [`src/world_packs/book_gu_keeper_lines.js`](../../../../src/world_packs/book_gu_keeper_lines.js): the red-steel scene as data, keeping its saved facts keys and ids. The one authored value (a day between Four Flavors meals) is labelled.
- **Deleted** `src/gu_keeper_red_steel.js`. `gu_keeper_wild`, the red-steel pack and the seven pack now read the row and the host. AREA_GUIDE's Gu entry points new scenes at rows plus `gu_working_law` methods.

Save compatibility (MC4): unchanged. Same facts keys and counters; the host computes the same stock and strike.

| Count | 2a end | 2b end |
| --- | ---: | ---: |
| Kinds that run as data with no scene module | 46 | 46 |
| Bespoke keeper src modules | 31 | **30** |
| Keeper packs (command surfaces, kept) | 36 | 36 |
| Scenes run as rows on a generic host | 0 | 1 (red_steel; rank_trial's cast shares it) |

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/gu_*.test.js tests/kernel_working.test.js` | 232/232 pass (the `gu_upkeep` red-steel journey feeds, converts and casts through the host) | |
| `npm run build` | pass, bundle SHA-256 `7f888a6a4c46b1ff2dcbb7a0987487c16710de034503b9b7b7053accf1388562` | |
| `node scripts/playtest/gu-keeper.mjs <repo> <out> --four-flavors-red-steel-only` (headless Chrome, 1920x1080) | success: refusal at 3 stones, Save/reload/Export/literal Import equal while held and after spending, reserve funded Moonglow without aperture essence. Receipt [receipts/red-steel-phase-2b.json](receipts/red-steel-phase-2b.json) | agent-verified, not human-reviewed |
| `npm run check:arch`, `npm run check:rules` | pass; the TMR1 warning in `book_world_hp_exams.js` is pre-existing | |

Next: the seven and nine scenes join the same host for their conversion and cast halves, and their refinement halves move onto the `refine` method of `gu.working`. Both are dispatched through `gu_keeper_wild`, so they go together.
