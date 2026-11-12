# Foundation chat G (Gu), phase 1 checkpoint, 2026-11-12

Owner: chat G in the [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md). Branch `claude/fdn-g-gu-312887`. Phase 1 is inventory and catalogue only; nothing embeds before K and W v0 are on master. Status: **phase 1 done (agent-verified, not human-reviewed)**. Proposals throughout are AD56 working defaults.

Start note: the worktree was cut at `c25fd396d`, 37 commits behind the stated start `9bbc51363`. The branch was a clean ancestor, so it was fast-forwarded to `9bbc51363` (no reset, no merge commit) before any work.

## What changed

- [`src/gu_catalogue.js`](../../../../src/gu_catalogue.js): every one of the 78 chapter-checked identities in [the evidence index](../../../research/gu-identity-evidence.json) now has a `parts` row: chapter-backed rank and path, roles, function, chapter-stated fuel and dao-mark pointers, a separate `wiki` layer (rank, path, type labels from the private review index), and open questions. Exports `guFunctions` and `guRoles`. Existing ability, recipe, conversion, growth, treatment, trait and move bindings are unchanged.
- [`tests/gu_catalogue.test.js`](../../../../tests/gu_catalogue.test.js): one new test. Every evidence identity has a parts row; rank equals the evidence ranks; every evidence open field stays open; an empty rank, a null path or a null function each name an open field; roles and functions come from the exported vocabularies; the wiki layer is present.
- [`scripts/gu_keeper_inventory.mjs`](../../../../scripts/gu_keeper_inventory.mjs): read-only extractor behind the inventory.
- Docs in this folder: [inventory](KEEPER_COMPRESSION_INVENTORY.md), [grammar proposal for P](GU_GRAMMAR_PROPOSAL.md) (GG1-GG13), [quantities draft for W](GU_QUANTITIES_FOR_W.md) (GQ1-GQ13).

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

- K: the five-part scene shape (facts row, counter ledger, availability predicate, dispatcher, counter stock) maps onto `defineWorkingLaw` / method / `settleWorking` from K v0. C's G1 request (killer moves as K workings with beats as steps) is accepted as G's phase 2 target.
- W: GQ1-GQ13.
- P: GG1-GG13 and the corpus weights.
- L: Gu-as-creature rows (producer, hosted, wild, emergent) come from the parts `roles`; L runs the body.
- R: Gu worm rank stays a G row; the Gu Master path row is R's rule over G's Reverend Insanity data.

## Next phase (after K v0 and W v0 are on master)

Re-express the ten-scene set (seven, nine, red_steel, four_flavors, stealth, rank_trial, moonlight_stock, rainbow, fire_trial, vitality; reserve move_trial) as catalogue rows plus one generic Gu working on K, with essence stock read from W, and delete their src modules. Move stage minutes and feed windows onto rows. Drive move search from the 23 evidence move records. Done check from the plan: 60 or more kinds as data (met), 10 scenes re-expressed with old modules deleted, move records drive move search, this backlog kept.
