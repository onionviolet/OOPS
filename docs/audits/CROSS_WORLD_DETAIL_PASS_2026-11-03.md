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

## Round 2 (2026-11-03, proposal)

Status: agent audit, proposals only (AD32). Reached state: drafted and source-spot-checked (WPR21) for the locators I opened; not rules-reconciled, built or browser-verified. Round 2 extends this file and keeps the codes: new findings continue F (F6-), gaps R (R8-), joins J (J7-), hard features H (H13-) and ranked gaps G (G8-); owner questions continue Q (Q2-); contradictions continue the X series of [BOOK_WORLD_GAPS](BOOK_WORLD_GAPS_2026-11-03.md) (X16-); small details are SD1-SD60. The 16-world by 36-family grid with a locator per cell is in [the round 2 matrix](CROSS_WORLD_DETAIL_ROUND2_MATRIX_2026-11-03.md), split out only because it is too large for this file (WPR3).

### Pass header (WPR1, WPR7)

| Field | Entry |
|---|---|
| Pass | Cross-world detail audit, round 2. Mode: reuse and check, my own greps of world docs and `src/`, and bounded haiku reads of the worlds round 1 skipped |
| Worlds | D&D, Fullmetal Alchemist, Skyrim, Fallout, Elden Ring, Bleach, Naruto, Jujutsu Kaisen, Hunter x Hunter, Fate, One Piece, My Hero Academia, Demon Slayer, Black Clover, Chainsaw Man, Frieren |
| Editions | The repo's own world docs and kit cards as of 2026-11-03. No book or game text read; franchise facts in them are the docs' own claims (stated), with the docs' source labels kept |
| Budget (AU3, AU5, AU10) | 8 of 8 haiku invocations, at most 2 running at once, no stronger or paid fallback. Payloads were built offline (AU11) as `path:line` text: D&D card 13.0k words (reader 1; about 1k over AU10's 12,000-word cap, and its cap cut off the D&D docs, so reader 3 re-read them; reader 1's card rows stay in the matrix), FMA 9.9k, Skyrim 10.5k, Fallout 10.3k, D&D docs 6.1k plus Elden Ring excerpts 5.5k, three anime payloads of 11.1-11.5k words each. About 90k words in all, none consecutive book text. No repair reserve was left. The anime worlds were planned as keyword-filtered excerpts from the start (their folders hold far more than a payload), not because of the D&D re-read. For those, "not found" means not in the excerpts (WPR23) |
| Owner file | This doc; matrix file linked above |
| Stop condition | Items 1-5 of the brief answered, one more-to-consider round |
| Codes cited | WPR1, 4, 5, 7, 18-23; AD5, AD32, AD38, AD43; AU3, AU5, AU10, AU11; [small detail to causal consequence](../RULES_FROM_SCRATCH.md#small-detail-to-causal-consequence) |

Labels (WPR4). *shown*: I ran the grep or opened the line today. *stated*: a repo doc says it and I did not re-check. *proposed*: authored by this project. *inferred*: my reading of shown facts. Reader rows carry the reader's label for the cited line; most are *proposed* because the payload is authored design text. Rows tagged [S] in the source institution docs (the sealed-check tag, WA11) are cited by ID with no text; no secret content appears.

### 1. Spot-check of the round-1 "not found" rows

Method: grep of the six mystery and cultivation institution docs (LOTM, Shadow Slave, Reverend Insanity, TTKS, Primordial Saint Sect, Fanren), then the kit cards, [MAKER_ARTS](../worlds/MAKER_ARTS_BY_WORLD_2026-10-14.md), world-depth parts 02-04 and 35, and `src/`. Greps are keyword searches (inferred coverage), not reads.

| Row | Verdict | Evidence |
|---|---|---|
| R1 repair (CW15) | **Narrowed.** Still absent from the six institution docs (shown: the only "repair" hits are budget lines for reader repair reserves). Not a cross-world gap: in the 16 newly read worlds CW15 is 10 covered, 6 partial, 0 not found. Seams exist outside the institution docs | MoL prices a repair in two chickens and a bag of flour ([MoL-I](../worlds/MOTHER_OF_LEARNING_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md):166, shown); TTKS B4 card:401, 443, 449 and B2 card:157, 747 (kit proposals); `src/gear_work.js:236-242` has `repair` and `fieldRepair` actions with a compatible-material check (shown); `src/hp_brewing_domain.js:62,101-104` refuses a structural-repair use with a reason (shown). D&D's first slice is a repair (card:710) and FMA's is a repair season |
| R2 fit and furnishings (CW02) | **Confirmed thin, low consequence.** 1 covered, 9 partial, 6 not found of 16 worlds; the weakest family in the grid | Mystery and cultivation have just TTKS B2 card:443 (a tailor, Chen Bo), MAKER_ARTS:92 (Shadow Slave's tailor, stated from ch1605) and world-depth 02:200 (JJK uniforms). `src/home_furnishing_content.js` is original fit-out content. Where it bites is nonhuman bodies ([NONHUMAN_SENSES](../worlds/NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14.md), 5 hits) and Fallout's measured body clearance (fallout/MODULE_CATALOGUE.md:51) |
| R3 workshop scale and waste (CW18) | **Reframed: a dial, not a hole.** 3 covered, 8 partial, 5 not found | `src/hp_preparation.js:25,40,66` sets `waste: 0` and labels it "(ORIGINAL)"; `src/craft_process_thermal.js:134` routes degraded output to residue; Fallout scrap-down is FO1 (world-depth 04:11); Elden Ring declares throughput and residue (elden-ring/MODULE_CATALOGUE.md:68, reader) |
| CW04 care (cultivation) | **Confirmed for the source docs, answered by authored content.** In the 16 new worlds CW04 is 12 covered, 4 partial, 0 not found | TTKS-I:203 says hospitals or healers were "not seen" and B5's clinic role is kit proposals alone (shown); a Shadow Slave healers row is tagged [S] (sealed-check, WA11) in SS-I and is cited by its ID (F10) with no text; LOTM-I:215 lists hospitals as missing from that pass. `src/status_care_content.js` is original Village care |

Proposed dispositions (defaults, with a dial and a reason, AD5): R1 for mystery worlds is "source gap, no scene read; borrow the generic repair action until a sourced scene exists", dial = a world's start that makes repair a livelihood. R2 is "not applicable until a start changes body size", dial = nonhuman starts. R3 is "waste 0 by default, labelled authored", dial = a world whose craft leaves a byproduct the player must dispose of.

### 2. Worlds round 1 skipped: dispositions

Full cells are in the [matrix](CROSS_WORLD_DETAIL_ROUND2_MATRIX_2026-11-03.md). Totals over 576 cells (16 worlds x 36 families): 280 covered, 258 partial, 38 not found. Locators: a script confirmed that all 538 cells with a locator point to a non-empty line (28 D&D cells were written as short `dnd.md:N` by the reader; I mapped them to the kit card first). A non-empty line is not proof it says what the cell claims; I opened about thirty cells in full (section 2, F12) and found no wrong locator.

**What "covered" means here (F8).** A cell is covered when the world's own docs or kit card carry authored or sourced wording for the family. Of the 280, nearly all are *proposed* text. It says nothing about code. D&D has 8 covered, Skyrim 28, Elden Ring 23, Fallout 19; the spread reflects how much each world's doc set says about its first slice, not how playable it is.

| ID | Finding | Label |
|---|---|---|
| F6 | Repair is broadly covered, so R1 is a mystery and cultivation source gap, not a cross-world one (section 1) | shown / inferred |
| F7 | **Five briefs share a template.** Bleach, Naruto, Elden Ring, Fallout and Skyrim have 25 identical long lines in `WORLD_BRIEF.md` (script over all 21 briefs: 25 lines shared by at least four worlds, which are 54-60% of each of those five briefs' long lines, four of them link-table rows). The Bleach and Naruto `INTERACTIONS.md` files both run 126 lines and share a section layout in the lines I compared (40-47: participants and place, an opening line, a known-state or evidence line, then a choice table); the scenarios differ (a roof leak over an address ledger, a cracked carrier). Template rows in the reader output: Bleach 5 of 17 covered cells, Naruto 3, Elden Ring 2, Fallout 2, Skyrim 1. Those cells show the family is in the template, not that the world has local detail | shown |
| F8 | Reader labels are mostly *proposed*; counts are of authored text | shown |
| F9 | Weakest families across the 16 worlds (not found / partial / covered): CW02 6/9/1, CW32 6/8/2, CW34 5/9/2, CW06 4/11/1, CW18 5/8/3, CW26 3/13/0, CW17 2/13/1, CW16 3/11/2. Strongest: CW10 and CW24 are covered in all 16; CW21, 22, 27, 30 in 15 | shown (reader rows) |
| F10 | CW26 copies, portraits and remote agents has no covered cell in any of the 16 worlds | shown (reader rows), inferred as a gap |
| F11 | Jujutsu's CW02 "not found" was wrong: jujutsu/CAMPAIGN.md:34 and :51 name "source-aware fitting" of tools (tool fit, not body fit or furnishings); I changed the cell to partial. CW34 "not found" for Fate, One Piece, MHA, Demon Slayer and Chainsaw Man held under a word-bounded grep (the "inherit" hits are template or MHA factor inheritance, a different thing). CW02 "not found" held for Fate, Black Clover, Chainsaw Man, Frieren by grep (0 hits in their folders) | shown |
| F12 | Reader locator precision was high this round: 17 of 17 opened Skyrim, FMA and D&D cells, and 10 random cells across worlds opened to text matching the cell. Reader *generosity* is the risk: "covered" is given for any matching authored sentence | shown |

New real gaps (weak in at least a third of the worlds read):

| ID | Family | Cells (C/P/N) | Note |
|---|---|---|---|
| R8 | CW26 copies, portraits, remote agents | 0/13/3 | No read world has a covered cell; there is copy-hook wording alone (FMA card:239) and record copies (Elden Ring CAMPAIGN:134) |
| R9 | CW32 luck, prophecy, outliers | 2/8/6 | Mostly "no prophecy" rows; the two covered cells (Skyrim CAMPAIGN.md:205 on rescues, JJK WORLD_BRIEF.md:68 on an outlier NPC) are about outcomes and one NPC, not forecasts |
| R10 | CW06 home routines and hospitality | 1/11/4 | Hospice and refuge wording alone (Elden Ring CAMPAIGN:155, Skyrim CAMPAIGN:40) |
| R2, R3, R6 | extended | see F9 | CW02, CW18, CW34 stay weak in the new worlds too |

### 3. Fine-grain details that change a choice

Each row is a small detail that feeds a second system (the small-detail chain), with the consumer named. Locator abbreviations: LOTM-I, SS-I, RI-I, TTKS-I, PSS-I, SoL-I, MoL-I, HP-I are the 2026-10-23 institutions docs in `docs/worlds/`; HP-I rows are that doc's own page-checked table. Ledger check: I searched `docs/` (not `research`, `gm` or `reviews`, and not the source doc or its own world folder) for the distinctive phrase; "0" means no hit, so the detail is absent from the kit cards, world-depth parts and rulebooks (inferred, a phrase search can miss a reworded copy). Each check is a phrase search per row, run on 2026-11-03; for clusters 5 and 6 (rows from the world docs themselves) it excludes that world's folder and its cards. A nonzero count is shown; those rows are partly recorded elsewhere and need a look before authoring. "Consumer in src" names a module I confirmed by grep only where stated; otherwise the consumer is a proposed seam and nothing was checked.

**Mystery (LOTM, Shadow Slave, Reverend Insanity)**

| ID | Detail (label, locator) | Second system (consumer) | Check |
|---|---|---|---|
| SD1 | Promotion needs three years on the previous potion plus a senior-deacon exam, even for strong merit (stated by Dunn, LOTM-I:99, 123) | Digestion clock and promotion gate; who is available to examine | 0 |
| SD2 | One buyer's quote: a Sequence 6 formula at 3,000 against "normal under 2,000"; equal-value barter accepted; markup above 50% (stated, LOTM-I:113) | Price spread; barter acceptance; whether a seller is the one holding stock | 0 |
| SD3 | A street kid's years of savings bought one investigator (stated, SS-I:163); a related healers row is tagged [S] in SS-I and is referenced by its ID (F10) with no text | Care price anchor against savings; recovery after injury | 0 |
| SD4 | A buyer's spree is known to every shop in three days (shown, RI-I:149) | Shop price memory and reputation diffusion (CW28) | 0 |
| SD5 | A tribal market zones by strength: Gu Masters centre, mortals carry (shown, RI-I:149) | Place access by rank; porter work as a mortal's route | 0 |
| SD6 | The Sanctuary of Noctis has about 200 residents and a park market that trades shards for Memories or credits (shown, SS-I:160) | Two-currency barter; Memory supply | 0 |
| SD7 | A new clerk is hired one week after the first meeting, pay matching government posts, with protection and close watching (shown/stated, LOTM-I:98) | Contact-to-job latency; surveillance state | 0 |
| SD8 | The outskirts hold 60-70 million people, about a fifth of the city, on government rations (stated, SS-I:159) | Ration supply by district; where cheap work and cheap risk sit | 0 |
| SD9 | Allies lend stones from a stone-store Gu informally; elders can pawn Gu (shown, RI-I:152) | Credit and collateral records; owned-tool custody (J2) | 0 |
| SD10 | Caravan admission runs on a vouching favour the sponsor sells later; hazing targets newcomers carrying goods (shown, RI-I:151) | Obligation ledger (CW22); newcomer risk on a route | 1 |

**Magic and craft (HP, D&D, Mother of Learning, FMA)**

| ID | Detail | Second system | Check |
|---|---|---|---|
| SD11 | A rural repair is paid in two chickens and a bag of flour (shown, MoL-I:166, c027 p42) | Barter price table; household stock | 0 |
| SD12 | The badge costs half of savings (shown, MoL-I:166, c027 p41); savings refill each month and a restart drops money (MoL-I:170) | Licence gate against the loop's money reset | 0 |
| SD13 | The Apparition course is 12 Galleons, 17 if booked after 31 August (HP-I:225, B6 p3280, matches) | Price by date; calendar | 0 |
| SD14 | Auror entry needs five NEWTs none under E; Snape takes O alone, McGonagall E (HP-I:220-221) | Admission by teacher-set grade (CW21) | 0 (1 on a looser phrase) |
| SD15 | Vault 713 is checked on roughly a ten-year interval (HP-I:208) | Custody check as a long clock | 0 |
| SD16 | A lost concentration stops the one-minute repair with no partial effect and no slot spent (proposed, dnd/RULINGS_LEDGER.md:32) | Interrupted-operation record; clock | 0 |
| SD17 | A held focus replaces Mending's material, so equipment state changes what a cast needs (proposed, dnd/RULINGS_LEDGER.md:31) | Equipped-item state; spell component | 0 |
| SD18 | The Stone's reserve depletes by use and the payer is recorded (proposed, fullmetal-alchemist/MODULE_CATALOGUE.md:17) | Custody and consent ledger | 1 |
| SD19 | A friend's team needs exactly four, so an invitation fills a slot and a refusal changes the loop (shown, MoL-I:173) | Party composition; refusal state | 1 |
| SD20 | Hagrid's wand was snapped but he was allowed to stay (HP-I:210, B1 p47, matches) | Expulsion consequence split into tool loss and residence | 0 |

**Cultivation (TTKS, Primordial Saint Sect, Fanren)**

| ID | Detail | Second system | Check |
|---|---|---|---|
| SD21 | Submitting a challenge result makes the virtual world real and locks it against further challenges (shown, TTKS-I:121) | Attempt, archived best and submission as separate records (BF40) | 0 |
| SD22 | Chargeable electricity gates search frequency (inferred by the protagonist, TTKS-I:149) | Resource gate on an information action | 0 |
| SD23 | The nearest sect tests with a black stone that reads grade alone, and is a vassal of a stronger sect (shown/stated, TTKS-I:110) | Test scope (CW13); patron chain for access | 0 |
| SD24 | Trait odds shift with realm: 79/14/5/1.9/0.1, then 69/20.8/8/2/0.2, then 50/28/17.6/4/0.4 (shown, TTKS-I:108) | Progression against a draw table | 0 |
| SD25 | A martial hall gives health training to students without root bone and refers promising ones to a sect; its partnership claim was a bluff (shown/stated, TTKS-I:109) | Referral route; claim versus fact (J1) | 0 |
| SD26 | A host sells Mind Quartz at 1,000 GBP, no bargaining; the Association's internal budget is about 800 but leaves a trace and draws Hunter review (TTKS-I:95-96) | Two-channel price; audit trail as a cost | 0 |
| SD27 | The skeleton bubble: 200 to a 7,000 peak, back to 200, then 50 after an official sect announcement (PSS-I:222) | Price shock from an institutional announcement | 0 |
| SD28 | Skeleton Mountain has a zombie tide every 30 years while disciples run the market under Tower Masters (PSS-I:234) | Long event clock against market supply | 0 |
| SD29 | Settlement lengthens the restart standby, and its output is one Gold talent (shown, PSS-I:225) | Retention schedule (S2) | 0 |
| SD30 | CP is stated to be worthless to True Persons and True Lords (stated, PSS-I:226) | Currency relevance by rank | 0 |

**Soldier and hub (A Soldier's Life; COI and Paradise had no parseable detail rows)**

| ID | Detail | Second system | Check |
|---|---|---|---|
| SD31 | A convicted foreigner picks labour, regular army or Legion at the cell; fines are 10 silver per crime (stated, SoL-I:184) | Start option; debt record | 0 |
| SD32 | Legion entry is a tablet test (40 potential in all physical stats, 60 in Strength and Power), seven months of training, about one in three finish (SoL-I:186) | Cohort attrition roster | 0 |
| SD33 | A legionnaire gets free magical healing in any large city; the regular army maybe an infirmary (stated, SoL-I:188) | Care access by rank | 0 |
| SD34 | The quartermaster adds new gear to a legionnaire's debt at about twice its worth, while old gear swaps free (SoL-I:189) | Equipment debt; upgrade timing | 0 |
| SD35 | Capture treats regulars, city guards and legion differently (SoL-I:191) | Consequence of defeat by status (CW33) | 0 |
| SD36 | Guild registration 25 silver, tablet reading 1 or 10 silver, a shop at half Imperial prices, bounties paid by voucher or coin (SoL-I:192) | Second institutional path; voucher as currency | 0 |
| SD37 | 540 copper a week is about 2.8 gold a year, against a lesser healing potion at 4 gold and a dungeon bounty of 1,705 gold (SoL-I:193) | Wage floor against windfall; care affordability | 0 |
| SD38 | Early retreat can cost a commander reserve accounts and ten years of reinforcements (SoL-I:190) | Strategic cost carried across years | 0 |
| SD39 | Soldier pay is 108 copper a week and legion pay 540, five times as much; the ladder is 100 copper to a silver, 100 silver to a gold (stated, SoL-I:185) | Rank-gated wage against the price table | 0 |
| SD40 | Cuts mix the tablet, weapon ranking and centurion discretion (SoL-I:187) | Selection rule with a human override | 0 |

**Tabletop and game worlds (Skyrim, Fallout, Elden Ring)**

| ID | Detail | Second system | Check |
|---|---|---|---|
| SD41 | Orven cannot teach and escort at once (skyrim/CAMPAIGN.md:152; CAMPAIGN.md:171 gives the escort as six Magicka units and six minutes) | NPC schedule; teaching availability | 0 |
| SD42 | A public supply offer has a 24-minute played-time window (skyrim/CAMPAIGN.md:168, INTERACTIONS.md:57) | Offer expiry against the played-time clock | 0 |
| SD43 | Repair restores condition but grants no new pattern and cannot recover a consumed ring (skyrim/CAMPAIGN.md:82) | Inventory absence; save state | 0 |
| SD44 | Cargo budget is ten units: rig kit six, safe sample two, recovered parts two; spare supply costs recovered cargo (fallout/MODULE_CATALOGUE.md:139) | Inventory cap against route payoff | 1 |
| SD45 | A carrier departure twenty played minutes later changes valve ownership, and later evidence is what reveals it (fallout/CAMPAIGN.md:172) | Hidden state and later evidence (J1) | 0 |
| SD46 | Operator fatigue or injury spoils control; repairing metal does not heal the body (fallout/MODULE_CATALOGUE.md:99) | Care and recovery (CW04) | 0 |
| SD47 | Completed allotments can be kept for expeditions, sold for supplies or donated with a particular memory (fallout/WORLD_BRIEF.md:28, CAMPAIGN.md:93) | Income against expedition stock; memory record | 2 |
| SD48 | An Ash refit needs an eligible arm, an owned Ash and a Whetstone Knife (elden-ring/MODULE_CATALOGUE.md:37) | Equipment state; skill access | 0 |
| SD49 | A four-minute mill shift spends two stamina for three proposed septims, repeatable while means and capacity permit (skyrim/CAMPAIGN.md:89) | Stamina against income | 1 |
| SD50 | Craft cancellation refunds untouched reservations alone (skyrim/CAMPAIGN.md:104) | Reservation ledger | 2 |

**Anime and Fullmetal Alchemist (excerpt reads only)**

| ID | Detail | Second system | Check |
|---|---|---|---|
| SD51 | A repaired scabbard is not a repaired Bankai; condition keeps housing wear, device supply, injury, source damage and blade state apart (bleach/MODULE_CATALOGUE.md:21) | Release state against the repair queue | 0 |
| SD52 | Explaining your technique is a vow; breaking one brings an uncertain penalty (jujutsu/WORLD_BRIEF.md:84) | Vow system (E8D); disclosure as an action | 2 outside |
| SD53 | A failed exam stage keeps its exact result and accepted terms; a phase-three pass may open next-year access, and the license page bars a retake (hunter-x-hunter/INTERACTIONS.md:11, 28) | Result record against access (J2) | 1 |
| SD54 | Government Quirk registration is separate from hero licensing (mha/CAMPAIGN.md:36) | Reputation; job access | 0 |
| SD55 | Copy or transfer keeps donor intent, contact procedure, retained or lost factor and residue (mha/MODULE_CATALOGUE.md:10) | Identity and memory state | 0 |
| SD56 | A technique that needs high initial magic permanently removes all magic (black-clover/MODULE_CATALOGUE.md:38, shown from the wiki) | Personal magic record; progression | 0 |
| SD57 | Serie's grimoire transfer makes the giver forget the spell (frieren/MODULE_CATALOGUE.md:14, shown from the wiki) | Known-spell record; grimoire inventory | 0 |
| SD58 | Accepting a convoy berth consumes a ration share and creates a watch obligation (one-piece/INTERACTIONS.md:46) | Food stock; crew roster | 0 |
| SD59 | Blue-Moon Weed magic needed an observed specimen before the spell formed (frieren/MODULE_CATALOGUE.md:15, shown from the wiki) | Habitat observation record; spell learning | 2 |
| SD60 | Imported outsider chakra compatibility is unknown until a test contract (naruto/MODULE_CATALOGUE.md:24) | Acquisition and compatibility test | 0 |

Limits: rows with a nonzero count (SD10, SD18, SD19, SD44, SD47, SD49, SD50, SD52, SD53, SD59) may be partly recorded; a phrase search can miss a reworded copy, and a zero is a phrase result, not proof of absence. I replaced rows whose check came back high (first versions of SD42, SD45, SD49-SD50, SD53, SD56-SD57 and SD59) with fresh ones. Clusters 3 and 4 draw on seven institution docs with parseable detail rows; Reincarnation Paradise and COI contribute none, so cluster 4 is one world. Consumers in `src/` that I confirmed by grep: repair actions in `src/gear_work.js`, portion accounting in `src/hp_preparation.js`, original care in `src/status_care_content.js`, authored crowns in `src/world_pack_mol.js`. Every other consumer here is a proposed seam.

### 4. Contradictions X1-X15: resolved, sharpened or owner questions

Resolved or sharpened where a source or owner decides it:

| X | Result | Evidence |
|---|---|---|
| X1 | **Sharpened.** The merges exist, but COI's merge covers 28 shards (`merge_report.json`: COI 28, MoL 106, HP 179, Shadow Slave 377, Reverend Insanity 143, Soldier's Life 175, Godclads 90, Perfect Run 83), so GAP_AUDIT R1's "28 of 294" still matches COI's report; the wording that the other books' shards were not merged is stale. The 294 total was not rechecked | shown (reports), stated (294) |
| X3 | **Resolved.** `anchor_snapshots.js` has a test and no `src/` importer; GAP_AUDIT G15 is right and GM11 should read "tested, not reachable" | shown |
| X4 | **Sharpened.** Two Gu modules plus `tests/gu_life.test.js` and `tests/gu_upkeep.test.js` exist; floor unchecked | shown |
| X5 | **Sharpened.** Partial modules exist for H3, H4 and H10; "no match" was too strong and "built" is not shown | shown |
| X2 | **Unchanged.** `build_cast_pack.mjs` is still modified and `tests/world_portable_tools.test.js` untracked in this tree, so the H12 work belongs to another session | shown |
| X11 | **Resolved, no conflict.** The Soldier's Life doc's "Book 4 not extracted" is about its close-read pass; `lead-run-2026-10-28/` holds `asl4c201`-`asl4c228` shard outputs, so batch-reader outputs exist for it: 568 shard files across chapters 182-243 (31 distinct chapter prefixes). Whether every chapter in that range is covered was not checked | shown |
| X12 | **Resolved, doc stale.** HP-I:36, 302, 329 say the Polyjuice slice is the sole runtime in code; `tests/` now has `hp_preparation`, `hp_school_progression`, `hp_charm_bridge`, `hp_lead_life`, `hp_arrival_compatibility` and others. Whether they meet the floor is unassessed | shown |
| X13 | **Resolved in part.** The COI kit card exists (`cards/circle-of-inevitability.md`); no COI pack in `src/world_packs/` and no COI test (shown by `ls`), so "no pack or test" stands and "no card" is stale | shown |
| X15 | **Resolved by the owner doc.** MoL-I:165 and 196 show the book names no currency, so crowns and prices are authored. The remaining mismatch is C2 (kit card bread 2 crowns, pack 1) | shown |
| X9, X10 | Not conflicts: a naming warning and a measurement artefact (the coverage tool cannot see local captures) | stated / shown |
| X7, X8, X6 | Source facts from the coverage tool, which is more specific than the index's shorter text; the fix is a LIBRARY_INDEX hygiene row (G13) | shown |

New contradictions from this round:

| X | Item | Result |
|---|---|---|
| X16 | FMA SYNTHESIS:113 names a supervised materials-bench operation as the first slice; the kit card (:318) names the Rush Valley repair season | Both are proposals. The card is later (git dates 2026-10-19 against 2026-10-14, inferred), and CAMPAIGN.md:9 and card:140 carry the repair season. Default: repair season first, materials bench second; dial: swap if the first play needs a pure transmutation proof; reason: it also gives CW15 a consumer. Mark SYNTHESIS:113 as the earlier proposal (WPR20) |
| X17 | HxH INTERACTIONS:11 against :28 (next-year access after phase three versus "cannot retake") | **Not a conflict.** Line 28 itself says the exam page's following-year access applies to an otherwise unsuccessful phase-three passer and is no universal retake path; the reader overstated it, as with two of three round-1 contradictions (shown) |
| X18 | Five briefs repeat "absent-instance freeze is a proposal needing runtime support" (Bleach and Naruto briefs :43-44, Elden Ring CAMPAIGN:143, Fallout CAMPAIGN:227, Skyrim MODULE_CATALOGUE:82) | Same proposal, not five decisions; J3 owns it (shown) |

Reader-flagged items I opened (WPR19, WPR20), recorded as X19-X23:

| X | Item | Result |
|---|---|---|
| X19 | mha/SYNTHESIS.md:27: the source page both calls mutant-type fighters impaired and immune | A real tension in the source page, already kept by the doc ("do not choose"); nothing to fold (shown) |
| X20 | demon-slayer/SYNTHESIS.md:26: red-state overview says a Mark is required; Nezuko's ignition is an exception | Already reconciled inside the line: friction/clash and pressure/grip need a Mark, ignition does not. The reader overstated it (shown) |
| X21 | chainsaw-man/MODULE_CATALOGUE.md:10 against SYNTHESIS.md:22 (Devil boost conditioned on living blood or flesh, plus an unconditioned bullet) | The two lines state one tension from one source page; both docs keep it (shown) |
| X22 | chainsaw-man SYNTHESIS.md:43 (1984 against 1983 for the first Gun attack) | Two-sided, with revisions, in REVIEW.md:29 and SOURCE_LEDGER C5. Default already recorded there: no fixed date-dependent starts until a primary audit (shown) |
| X23 | frieren/MODULE_CATALOGUE.md:16 against :25 (curse defence and Goddess dispel as a wiki generalization against scene examples) | Tension kept by the doc; FR-R8 says validate the exact curse instance (shown) |

Owner questions, each with a default (AD5):

| Q | Question | Default and dial |
|---|---|---|
| Q2 | Which table wins for MoL prices (X15 C2)? | Default: the pack's authored table, since the game reads it, with the kit card updated and both labelled authored. Dial: the card, if design intent outranks current data. Reason: one owner removes a standing mismatch at the cost of one edit |
| Q3 | Are Shadow Slave chapters 2888-2889 true source gaps (X6)? | Default: record them as an unverified two-chapter gap. Dial: re-pull if a rules claim depends on them. Reason: the volume has no NCX and the coverage tool flags only those two |
| Q4 | Get Fanren chapters 45-184 (X14)? | Default: stay on the 44-chapter slice. Dial: acquire later, which needs Weibao's yes for any download. Reason: the doc's own plan is about 28 shards |
| Q5 | Re-run the COI merge (X1)? | Default: run the free merge step when COI is next selected. Dial: earlier if a COI row is needed. Reason: it costs one script run |

### 5. Shared details beyond J1-J6 and H1-H12

| ID | Shared detail | Evidence | Consumer |
|---|---|---|---|
| J7 | Template coverage versus world-specific coverage: a coverage row should say whether its line is shared | F7 | The CW binding rows (G1) and the matrix |
| J8 | Care access as one record: who can provide, price or rank gate, duration, what it does not restore (J4's neighbour for CW04) | D&D rest has duration and eligibility (card:380); Fallout fatigue and treatment (fallout/MODULE_CATALOGUE.md:99); automail recovery of about three years, fastest six months (FMA CAMPAIGN.md:9); SD3, SD33, SD37, SD46, SD56 | `src/status_care_content.js` (original care, shown) |
| J9 | Interrupted-operation record: stop point, partial effect or none, what is kept, who is told | SD16; FMA INTERACTIONS.md:7 (stop and keep the sample); Elden Ring MODULE_CATALOGUE.md:93 (a failed batch keeps its record) and WORLD_BRIEF.md:44 (a forced interruption needs an explicit policy) | Operation clocks; `src/wait_until.js` and `src/simulation_contracts.js` mention interruption (shown), connection not checked |
| J10 | Price status per row: sourced, authored or edition-dependent | MoL-I:165-166, SoL-I:193, TTKS C11, HP X10; `src/hp_preparation.js:66` already tags "(ORIGINAL)"; `src/world_pack_mol.js` holds authored crowns | Pack price rows; shop display |
| J11 | Consent-gated carry and refusal. Default: a companion, cargo or witness needs real consent and a refusal leaves no debt. Dial: worlds with coercive institutions (SoL-I:184 forced choice at the cell, PSS-I:227 Human Material, the LOTM oath net) price a refusal or remove the option, with the in-world agent and cost named (CW27 includes admitted coercion) | Skyrim CAMPAIGN.md:222, Elden Ring INTERACTIONS.md:59 and :29, Bleach brief:41, SD49 | Companion and destination hosts (`src/feature_expansion_destination_host.js` mentions consent, shown) |

Extends J2 rather than adding a join: licence versus custody versus sale (SD53, MoL F4, LOTM ticket needing an identity certificate at LOTM-I:116).

New hard-feature rows (difficulty is my estimate):

| ID | Feature | Worlds | Difficulty | Seam |
|---|---|---|---|---|
| H13 | Coverage-row template check: flag a cell whose locator line is shared by four or more briefs | All 21 briefs | Low | `docs/audits/tools/` beside `plan_review_status.py`; the script I used is about 30 lines |
| H14 | Care and recovery access record (J8) | Soldier, Demon Slayer, Fallout, FMA, Shadow Slave | Medium | `status_care_content.js`; H5 neighbour |
| H15 | Interrupted-operation and failure record (J9) | D&D, FMA, Elden Ring, Bleach, craft worlds | Medium | Operation clocks; H6 neighbour |

State refresh for S9 (importer check from `src/`, `tests/` and `scripts/`): `canon_pull_panel.js` is now imported by `tests/book_world_lotm_opening.test.js` and still has no `src/` importer; `anchor_snapshots.js` and `harm_loops.js` have tests only; `lotm_price_map.js` has a test and `scripts/lead_run/coverage_ledger.mjs`; `invention_receipts.js` has a test and `scripts/invention_qa.mjs`. A test or script import is not a player-reachable caller (GAP_AUDIT G15). The panel file also shows as modified in the working tree, so another session is editing it.

### 6. Ranked gaps, round 2

| Rank | Gap | Cost | Done check |
|---|---|---|---|
| G8 | Mark the template lines in the five briefs and add world-specific rows where a family is covered by a template line alone (F7, J7) | Low, docs | Each of the 13 template-covered cells has a local locator or a "template line alone" note |
| G9 | Decide CW26 per world: write, or mark not applicable with a reason (R8) | Low | Disposition per world; check `claim_runtime.js` and the cast adapters first |
| G10 | CW02, CW06, CW18, CW32, CW34 per-world dispositions as in section 1 | Low | Matrix N cells carry a reason |
| G11 | Mark FMA SYNTHESIS:113 as the earlier proposal (X16) | Low | One line in that doc |
| G12 | Read the full docs for the 36 excerpt-based anime N cells (the other two N cells are D&D CW02 and FMA CW06) before authoring anything for them | Low-medium | N cells confirmed or turned partial |
| G13 | LIBRARY_INDEX hygiene rows for X6-X10 | Low | Held range, gaps and translation kind per book |
| G14 | Re-run the COI merge (Q5) | Low | `merge_report.json` shard count |

These do not replace G1-G7. G1 (binding existing locators into the LOTM ledger) gets easier because the matrix gives the form.

### 7. Not done and verification states

- Reached: drafted and source-spot-checked for the locators I opened (WPR21). Not rules-reconciled, built, browser-verified, and agent-verified is not human-reviewed (AD42).
- Read, not verified by me: the unopened cells in the matrix; reader labels (shown, stated, proposed, inferred) are the reader's reading of each tag.
- Unread: `docs/worlds/dnd/SRD521_START.md`, `SOURCE_CONTRACT.md` and `STORYTELLER_STYLES.md`, and the D&D dispatch folder (`docs/gm/dispatch/dnd-world-2026-10-11/`); the 36 anime N cells beyond the excerpts, the book and game texts, all ten anime worlds beyond their payload excerpts, Paradise and COI detail rows, BF58-BF70.
- Not run: tests, build, browser. Docs alone; no edits under `src/` or `tests/`.

### More to consider, round 2 (2026-11-03, proposals)

- **ACT NOW (done):** spot-checks of R1-R3 and CW04 (section 1); the 16-world matrix; X1-X18 resolved or sharpened; SD1-SD60; the five-brief template finding.
- **ACCOUNT FOR NOW:** The matrix measures authored text. Sorting worlds by covered count rewards long docs, so use it to find holes, not to rank worlds (sources are not ranked).
- **ACCOUNT FOR NOW:** The five-world batch (Bleach, Naruto, Elden Ring, Fallout, Skyrim) share a scenario layout and a parcel-and-custody theme (shown in two of the five, Bleach and Naruto). If that layout is the playable slice in all five, the first-slice evidence will look alike across worlds; check before reading it as five confirmations.
- **LATER (level: haiku, then sonnet to judge; effort: low; done: N cells confirmed or turned partial):** full-length read of the 36 excerpt-based N cells (G12), starting with CW18 and CW26.
- **LATER (sonnet; low; done: an owner row per H13-H15):** decide whether J8 and J9 belong to H5 and H6 or stand alone.
- **LATER / INSPECT (sonnet; low; done: a yes or no per J8 field with a locator in `status_care_content.js`):** whether it already carries the J8 fields before authoring them.
- **LATER (haiku; low; done: 6 more SD rows with ledger checks):** extend cluster 4 from the Paradise facilities doc and the COI institutions doc, which have gap tables but no F-rows.
- **Suggestions (not gates):** save the 30-line brief-overlap script beside `plan_review_status.py` once Weibao's current UI work lets that folder be touched.
