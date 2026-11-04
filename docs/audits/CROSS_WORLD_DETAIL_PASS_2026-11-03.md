# Cross-world detail pass (2026-11-03, proposal)

Status: agent audit. Findings and rankings are proposals (AD32); nothing here is accepted, implemented or browser-verified. Method: a breadth pass on one lens (WI1 in [06_CROSS_WORLD](worlds/world-depth-2026-10-13/06_CROSS_WORLD.md)) using the 36 families in [CROSS_WORLD_DETAIL_REVIEW](gm/CROSS_WORLD_DETAIL_REVIEW.md). Evidence is a citation census (which docs name which CW code), not a content read of every world. A family that is never cited can still be covered under local wording; the census says only that no world has bound it by code.

## Pass 1: general (where the 36 families are bound)

| ID | Finding |
|---|---|
| F1 | No world ledger binds CW01-CW36 per world. The 31 world-core-kit cards cite "CW1-CW17", but that is the comic-worlds namespace (W16), not these families. |
| F2 | Real CW01-CW36 citations sit in a handful of docs: world-depth parts 02/03/04/06/14/16, NONHUMAN_MAJORITY (CW01-06), TECHNOLOGY_AND_PROGRESSION (CW10-18), GENERATION_FOUNDATION (CW10-16). |
| F3 | Citation density is lopsided. Craft and tools (CW09-18) and bodies (CW01-06) are cited; people, time and endings (CW19-34) are almost uncited. Only CW23, CW24, CW28, CW34, CW35 appear outside the craft cluster, one to three times each. |
| F4 | Superseded by the reader results below (citation count was a poor proxy). Never cited by code in the census: CW07, CW08, CW20, CW21, CW22, CW25, CW27, CW29, CW30, CW31, CW32, CW33. These are the families that decide who responds, when, and how a life ends, which the Klein campaign and the lead-life work already lean on. |
| F5 | The code collision is real: CW1-CW17 (comic) and CW01-CW36 (this review) differ only by zero padding. Readers and greps conflate them. |

## Pass 2: fine-tune (per-family disposition by world cluster)

Dispositions use the review's own set (investigated, source gap, authored proposal, selected work, deferred, not applicable). "Selected" below means the family is worth selecting first for that cluster; it accepts nothing.

| Cluster | Select first | Defer | Likely not applicable (reason) |
|---|---|---|---|
| Mystery/pathway worlds (LOTM, Shadow Slave, Reverend Insanity) | CW12 controlled effects, CW13 testing/appraisal, CW23 identity and recognition, CW24 testimony/evidence, CW32 prophecy and outliers, CW33 endings | CW26 copies and agents, CW35 crossing | CW03 hunger-style upkeep where pathways bypass it |
| Magic-school and craft worlds (HP, D&D, FMA, Mother of Learning) | CW09 provenance, CW11 instruction, CW14 failure/residue, CW16 labels/storage, CW29 lived time, CW31 loops | CW28 diffusion | CW05 development where starts are fixed adults |
| Cultivation and sect worlds (TTKS five titles, Primordial Saint Sect, Fanren) | CW19 teachers, CW21 credentials, CW34 succession, CW08 kinship, CW22 binding obligations | CW18 workshop scale | CW25 messaging until a world needs it |
| Soldier, hub and reincarnation worlds (A Soldier's Life, Circle of Inevitability, Reincarnation Paradise) | CW20 commissions, CW21 institutional access, CW10 custody, CW27 consent and control | CW31 branches | CW07 habitat where the hub is built |
| Comic and anime worlds | Keep W16 CW1-CW17 as their own namespace; map only on request | all | most (comic comparison only, outside the canon-first roster) |

## Pass 3: overarching and shared details (joins that cross worlds)

These are the details several worlds would otherwise author separately.

| ID | Shared detail | Families | Why shared |
|---|---|---|---|
| J1 | Claim, receipt and belief: what each observer learned and from what | CW13, CW23, CW24, CW25 | Every world needs "the clerk saw a face, not the order". One actor-knowledge shape serves disguise, divination, testimony and rumor. |
| J2 | Custody versus access versus method | CW10, CW11, CW17, CW19 | Owning, holding, being allowed and being able are four fields in every craft, sect and school world. |
| J3 | Absence policy: freeze, advance or partial, per world | CW29, CW31, CW35 | Already named in 06_CROSS_WORLD (MC2, SU10). One policy field plus a named reader, not a per-world rewrite. |
| J4 | Endings that do not end play (retire, graduate, die, revive) | CW33, CW34 | The lead-life work needs the same closure-versus-continuation vocabulary in every world. |
| J5 | Batch, portion and label identity | CW09, CW14, CW16 | One identity rule covers potions, pills, rations and ammunition. |
| J6 | Carrier-speed news and reputation | CW25, CW28, MC1 | Fame and stale letters work the same across worlds. |

## Ranked gaps

| Rank | Gap | Cost | Done check |
|---|---|---|---|
| G1 | Add a one-line CW binding row (family, disposition, local ID) to the depth ledger (WI6) of the current-focus world, LOTM, covering the uncited F4 families first | Low, docs only | Each of CW07, 08, 20-22, 25, 27, 29-33 has a disposition or a "not applicable, reason" |
| G2 | Rename the review's codes to remove the CW/CW padding collision, or cite them as `XWC-CW12` in new docs | Low | grep for `CW\d\d` and `CW\d\b` no longer overlaps; `check:rules` passes |
| G3 | Pick J1 (claim, receipt, belief) as the first shared join and check whether the KJ3 slices already hold a native consumer for it | Medium, inspection | One named owner module or an explicit "missing seam" |
| G4 | Write J3 absence policy as a single dial in the world core kit, citing 06_CROSS_WORLD MC2 | Low | Core kit row exists; no new engine claim |
| G5 | Repeat the census after G1 to confirm coverage moved | Low | Census script output saved next to this file |

## Reader results (2026-11-03, four haiku readers, read-only)

One reader per cluster searched the institution and subtle-detail docs for local coverage of all 36 families, with file:line locators in their returns. Reader returns were not independently re-checked against the sources; D&D and Fullmetal Alchemist rest on card hits only, and the Harry Potter Time-Turner pointer was unread. Counts: mystery 14 covered, 17 partial, 5 not found; the other three returned tables without totals.

**Correction to F4.** The census said twelve families were never cited. Readers found local wording for most of them (CW20, 21, 22, 25, 27, 29, 30, 31, 32, 33 are covered in at least one cluster). Citation count was a poor proxy for coverage, so G1 should bind existing locators rather than write new content for those.

**Real gaps (weak in three or more of four clusters).**

| ID | Family | Mystery | Magic/craft | Cultivation | Soldier/hub |
|---|---|---|---|---|---|
| R1 | CW15 repair and restoration | not found | covered | not found | partial |
| R2 | CW02 fit and furnishings | not found | partial | partial | partial |
| R3 | CW18 workshop scale and waste | not found | partial | partial | partial |
| R4 | CW16 labels and batch identity (J5) | partial | partial | partial | partial |
| R5 | CW36 presentation and durable state | partial | covered | partial | partial |
| R6 | CW34 legacy and succession | partial | partial | covered | partial |
| R7 | CW05 birth and caregiver start | partial | partial | covered | partial |

Also thin in one cluster each: CW04 care (cultivation, not found), CW07 habitat and harvest (soldier/hub), CW31 loops (mystery, not found; likely not applicable there), CW32 prophecy and CW33 endings (mystery and magic/craft, partial).

**Contradictions found (each inside or between docs, none resolved here).**
- TTKS wage and Harry Potter prices: checked 2026-11-03 and already reconciled inside their own docs (TTKS C11 keeps both readings; HP X10 treats the newspaper fare as edition-dependent). The reader overstated them. G5 added one cross-reference on TTKS F31 and replaced "general knowledge" with the shown-in-B1 locator on the HP28 row of world-depth 02.
- A Soldier's Life line 152 says essences from living beings are outlawed except executions; Regressor's Tale line 175 has pills made from sacrificed humans with no ban shown. Different worlds, so not a clash unless a shared rule is claimed.
- Lord of the Mysteries: authored dial X3 (LTS13) and X4 (six-act digestion vs source years) are kept as open tensions in their own doc.

## Ranked gaps, revised

| Rank | Gap | Done check |
|---|---|---|
| G1 | Bind existing locators (not new prose) for the "covered" families into the LOTM depth ledger rows | Each family has a disposition and a locator |
| G2 | Rename or prefix the review codes to remove the CW/CW0x collision | grep no longer overlaps; check:rules passes |
| G3 | Author R4 (batch, portion, label identity) once as a shared join; every cluster is only partial | One owner row, cited by the four clusters |
| G4 | Decide R1/R2/R3 (repair, fit, waste) per world: write or mark not applicable with a reason | Disposition per world |
| G5 | Done 2026-11-03: two cross-reference edits; the contradictions were already resolved in-doc | none left |
| G6 | Pick J1 (claim, receipt, belief) and check the Klein slices for a native consumer | Named owner module or explicit missing seam |
| G7 | J3 absence policy as one world-core-kit dial | Core kit row exists |

## Open

- Q1 closed by the reader pass above. Still unread: D&D and Fullmetal Alchemist in depth, the comic and anime worlds, and the book texts themselves.
- Not run: no tests, no build, no browser check. Docs only.

## More to consider, round 1 (2026-11-03, proposals)

- **ACT NOW (done):** F4 marked superseded. Correction to my earlier summary: the mystery reader's table lists CW02, 15, 18 and 31 as not found; CW32 is partial. Its stated total of 5 not found does not match its own table (4), so treat reader totals as unverified and use the rows.
- **ACCOUNT FOR NOW:** "Covered" here means documented in an institution or kit doc (proposal-level), not a native consumer or playable behavior. Do not report coverage as implementation.
- **ACCOUNT FOR NOW:** Reader precision is moderate (G5: two of three flagged contradictions were already reconciled). Spot-check the "not found" rows R1-R3 with a grep of the world docs before authoring anything for them.
- **ACCOUNT FOR NOW:** J3 absence policy (G7) may duplicate existing per-world wording (LOTM, Soldier's Life and Mother of Learning docs cover calendars and absence) and 06_CROSS_WORLD MC2/T4. Check the core kit for an existing dial before adding a row.
- **LATER / INSPECT:** R4 batch and portion identity has a live consumer: the Klein potion slice (KJ3O). Read how potion portions are modeled in code before writing a shared rule, so the rule matches the owner.
- **LATER:** Coverage is weakest where priority is highest. D&D has no institutions doc, and the canon-first order puts Harry Potter, D&D and book worlds first. Also unread: Skyrim, Fallout, Elden Ring and the comic and anime worlds.
- **LATER:** Save the census script beside plan_review_status.py in docs/audits/tools so G5-style recounts are cheap, and consider a rules check that flags `CW\d` against `CW\d\d` collisions (G2).
- **LATER:** Register this audit in docs/gm/WRITEUP_REGISTER.md.

## Hard features that serve many worlds (2026-11-03, proposal)

Synthesis from [GAP_AUDIT_2026-10-30](GAP_AUDIT_2026-10-30.md) (G1-G16, R1-R5), [NONHUMAN_ABSTRACTIONS_NEEDED](../worlds/NONHUMAN_ABSTRACTIONS_NEEDED_2026-10-14.md) (NA1-NA13) and this audit's R1-R7 and J1-J6. I read the gap audit and the abstraction headings; the per-world BF30-BF57 rows in BOOK_WORLD_FEATURE_GAPS were not read, so per-world attribution is by those docs' own naming. Difficulty is my estimate, not a measured cost.

| ID | Feature | Worlds that need it | Difficulty | Existing owner or seam |
|---|---|---|---|---|
| H1 | Canon pull and branching event resolver | HP, LOTM, MoL, COI, all canon starts | High | G1; keyed resolver has no pull input |
| H2 | Rewind checkpoint (one replaceable checkpoint plus fallback) | MoL, Regressor's Tale, Speedrunning the Multiverse, You Have Died Again | High | G15; `anchor_snapshots.js` captures world facts, not player state; bk-mol uses `loop_table.js` |
| H3 | Body template, seat and carrier records | nonhuman starts, transmigration, Paradise, FMA, Worm | High | NA1-NA4; two live models need a bridge |
| H4 | Perception filter plus recognition and evidence (J1) | LOTM divination, disguise worlds, ORV, HP Polyjuice | High | NA5, NA12 |
| H5 | Intake and upkeep seam | Reverend Insanity Gu keeping, cultivation, Paradise, Fanren | Medium | NA8; proposed as its own lane (R5) |
| H6 | Batch, portion and label identity (R4) | LOTM, HP, MoL, TTKS pills | Medium | KJ3O potion slice is the consumer to read first |
| H7 | Hidden strength, appraisal gates, persistent rival with memory | nearly all combat or social worlds | Medium | G3; builds on P3c memory and P4 fights |
| H8 | Cause-tagged prices and cross-world arbitrage | hub and trade worlds, Paradise | Medium | G11; nothing found in `src/` |
| H9 | Cheat presentation and non-circle UI forms | all | Medium | G10, G12, UI findings U1-U6 |
| H10 | Hit location and layered repair (physical vs soul) | combat worlds, FMA, craft worlds | Medium | G6 `harmPart`, G7, R1 |
| H11 | Quest, premise and trope generators | all | Medium | G2; audits and palettes only |
| H12 | Place-agnostic cast pack builder | every book after LOTM | Low | R3. Found already done in the working tree on 2026-11-03 (uncommitted, by another session): `buildCastPack` takes `placePrefix` and `districts` (LOTM defaults), CLI flags `--place-prefix` and `--districts`, a test in `tests/world_portable_tools.test.js`; focused run of that file and `tests/build_cast_pack.test.js` passed 21 of 21. Not yet exercised on a non-LOTM book pack end to end |

**Ranking proposal (leverage over cost).** H12 first: low cost, and it unblocks every other book. H6 next, with the potion consumer already live. H4 and H7 third, because they recur in the most worlds and have named seams. H1 and H2 are the largest; they should wait for a first slice that has one browser proof each, per G1 and G15. H3 stays behind the canon-first order.

**Lesson from G15.** `away_ledger.js` and `anchor_snapshots.js` were built and tested but nothing imported them. For each H row, the done check should name a reachable caller, not a passing unit test.

**State check before building H rows (2026-11-03).** The gap audit dates from 2026-10-30, so some H rows are stale. Found in `src/` with importers: H1 `canon_pull.js` (first slice, "implemented, below floor", 3 importers); H11 `quest_generator.js`, `premise_generator.js`, `trope_recognizer.js` (1-2 importers each); H6 `craft_batch_goal.js` and the HP brewing modules, which other sessions have uncommitted edits in today. No match found for H2 rewind, H3, H4 perception filter, H7 nemesis or hidden strength, H8 price causes or arbitrage, H10 hit location. The genuinely open rows are H2, H3, H4, H7, H8, H10; the rest need a "finish to floor" check, not a new build.

**Floor check, H1 and H11 (haiku reader, 2026-11-03, working tree at that time; not re-verified by me, game not run).** Canon pull meets FLR1, 2, 4, 5 and 6 per its CP9 and L1 receipts; FLR3 (shown: description, cost, refusal) is missing in `src/canon_pull_panel.js:18-32`, and its earned panel route failed in play per CANON_PULL_SLICE_2026-10-30. Generators: tests and importers exist for all four, but no receipt records a bundle hash, fresh-life route or review label (FLR1, 2, 6 missing); FLR3 is met only for `relic_generator` (`naming_act.js:58,62`) and missing for quest, premise and trope; save persistence is N/A for quest, premise and trope. Smallest fixes: one receipt under `docs/gm/dispatch/` with a `game_freeze` hash, the route and the label for all four generators, plus a visible cost label in `quest_board_ui.js`, `start_probe_ui.js` and `story_insight_domain.js:62`, and a description and refusal line in the canon pull panel.
