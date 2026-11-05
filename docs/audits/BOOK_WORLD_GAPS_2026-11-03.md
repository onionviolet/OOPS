# Book-world gaps: source, design, implementation and next slice (2026-11-03, proposal)

**Current evidence routing, 2026-11-04:** sections 10.1 and 11 correct the earlier X19/X21 and zero-import claims, including side-effect imports and pack-save wiring. Read those dispositions before using sections 7–9 as a work queue. The [reconciliation record](LOOSE_DOCUMENT_RECONCILIATION_2026-11-04.md) preserves source-wired versus gameplay-writer and journey-proof limits; this note does not refresh earlier test results.

Status: agent audit. Findings, rankings and slices are proposals (AD32); nothing here is accepted, implemented or browser-verified. Not run: tests, build, browser. Docs only.

## Pass header (WPR1, WPR7)

| Field | Entry |
|---|---|
| Pass | Cross-book gap audit, one lens per book: source, design, implementation, next slice. Mode: reuse and check, plus bounded reads of owner docs and read-only greps of `src/`. No book text read |
| Worlds | LOTM, Circle of Inevitability (COI), Mother of Learning (MoL), Shadow Slave, Reverend Insanity, Harry Potter, D&D, A Soldier's Life, Reincarnation Paradise, Regressor's Tale, the five TTKS titles, Primordial Saint Sect, Fanren simulator, BF43-BF57 books |
| Editions | As held in the library index and `scripts/library_coverage.py` (read 2026-11-03); edition notes are per book below |
| Budget | Two haiku readers (of a cap of 8 invocations, 2 concurrent, AU rules), each owning six institution docs. Source words read: 0. Chapters read: 0. No paid or stronger fallback |
| Owner file | This doc. It extends [CROSS_WORLD_DETAIL_PASS](CROSS_WORLD_DETAIL_PASS_2026-11-03.md), [GAP_AUDIT](GAP_AUDIT_2026-10-30.md) and [BOOK_WORLD_FEATURE_GAPS](../worlds/BOOK_WORLD_FEATURE_GAPS_2026-10-15.md); it does not replace them and keeps their codes (CW, H, BF, G, R) |
| Stop condition | One row per book world with a record, a cross-book section, and one more-to-consider round |

**Evidence labels (WPR4).** *shown* = I ran the command or read the line myself today (locator given). *stated* = a repo doc says so and I did not re-check. *inferred* = my reading of shown facts. Sources are not ranked. No sealed secret content appears; secrets are referred to by ID only (none needed here).

**Method limits.**
- Importer counts use a strict grep for `from './name'` / `require('./name')` in `src/` (top level only, self excluded). A module imported through a subfolder, an index or a dynamic path would show as 0. Importer count shows reachability, not that the player can reach it in a finished slice (AD43 floor).
- `src/` keyword counts by world name are crude: they count files that mention the keyword anywhere, so "worm" can match unrelated words. Treat them as presence hints (inferred), not coverage.
- Library coverage shows container facts only (kind, chapter range from part titles, gaps); it does not compare text (script header, shown).
- Reader returns from the two haiku readers are summarized in section 3 and were not independently re-checked against every source line.

## 1. Corrections to the input docs (read these first)

These are places where the inputs disagree with each other or with today's tree. Each cites locators. None is resolved here by editing the input; they need an owner decision.

| ID | Contradiction or stale claim | Evidence | Label |
|---|---|---|---|
| X1 | GAP_AUDIT R1/R2 say COI is merged for only 28 of 294 shards and that MoL, HP and Shadow Slave shards "were never merged". Each of COI, MoL, Shadow Slave, HP, A Soldier's Life and Reverend Insanity now has `docs/research/novels/<book>/private/wb8-merged-2026-10-30/` with `registry.jsonl`, `overlay_proposed.json` and `merge_report.json` | `ls` of those six folders, 2026-11-03 | shown (merge exists); whether it covers every shard is not checked |
| X2 | GAP_AUDIT R3 says the pack builder is hard-coded to LOTM. CROSS_WORLD H12 says it is done in the working tree. Today `scripts/lead_run/build_cast_pack.mjs:34` takes `placePrefix` and `districts`; `git status` shows the script modified and `tests/world_portable_tools.test.js` untracked, so it is uncommitted work from another session | grep and `git status --short` | shown |
| X3 | READING_GAP_MAP GM11 names `anchor_snapshots.js` as a generic loop owner. GAP_AUDIT G15 says it cannot hold a player checkpoint. Today it has 0 importers in `src/`; `loop_table.js` has 1 | importer grep | shown. G15 is the better-supported claim |
| X4 | GAP_AUDIT R5 and CROSS_WORLD H5 propose Reverend Insanity's Gu keeper seam as a future lane. `src/book_world_gu_domain.js` and `src/book_world_gu_keeper_domain.js` exist (1 importer each) | `ls src`, importer grep | shown that modules exist; whether they meet the floor is not checked |
| X5 | CROSS_WORLD "state check" finds no match for H3 (body/seat/carrier), H4 (perception/recognition) and H10 (hit location). `src/` holds `seat_profiles.js` (11 importers), `book_world_paradise_carriers.js` (2), `feature_expansion_nested_carriers.js` (3), `cast_body_adapter.js` (1), `feature_expansion_book_recognition.js` (2), `claim_runtime.js` (3), and `harmPart` appears in `harm_engine.js` and `tempo_fight_domain.js` | greps | shown that partial modules exist; they may not be the generalized feature H3/H4/H10 name. So "no match" is too strong and "built" is not shown either |
| X6 | LIBRARY_INDEX lists Shadow Slave as chapters 1-3000. `library_coverage.py` reports Volume 11 (2721-3000) with first gaps at 2888 and 2889. LIBRARY_INDEX itself notes volume 11 has no NCX | coverage output | shown. Two chapters inside the held range are missing or mis-titled; the index range is optimistic |
| X7 | LIBRARY_INDEX registers Regressor's Tale as 640 chapters (`rtoc`). The coverage tool shows a continuation record covering 641-874 (one gap at 808) and a supplement for chapter 211 | coverage output | shown. Held text runs further than the registered batch range |
| X8 | LIBRARY_INDEX lists Reincarnation Paradise (Calibre 13) without a range. The held record is titled "(gemini-2.5-flash) ENG", i.e. a machine translation, chapters 1-4143 with eight gaps (1396, 1698, 2191, 2221, 2429, 2568, 2796, 2894) | coverage output | shown. Machine-translation uncertainty applies to every claim from it (WPR4) |
| X9 | Two simulator-cultivation titles are easy to confuse: 我有一个修仙模拟器 (285 chapters) and 凡人：从极阴岛开始的修仙模拟器 (44 chapters). LIBRARY_INDEX warns about it; the "Fanren simulator" docs and the task name both say Fanren, so I use the 44-chapter capture for Fanren | LIBRARY_INDEX line "Two further ttks captures" | stated |
| X10 | The library coverage tool finds 0 records for Primordial Saint Sect and for Fanren, because their text is a local capture (`primordial-saint-sect-2026-10-10/sources/book.txt`, `fanrencongjiyindao-moniqi/sources/`), not a Source Library asset. Zero is not "unheld" | coverage output and `ls` | shown |

## 2. Hard-feature status today (H1-H12, native check)

This refreshes the H table's "state check" using importer counts. "Reachable" means imported somewhere in `src/`; it says nothing about the AD43 floor or a browser proof.

| H | Feature | Modules found (importers) | Status | Label |
|---|---|---|---|---|
| H1 | Canon pull | `canon_pull.js` (2), `canon_pull_host.js` (2), `canon_pull_panel.js` (0) | First slice present; panel not imported anywhere, so a player-facing view is not shown | shown |
| H2 | Rewind checkpoint | `anchor_snapshots.js` (0), `loop_table.js` (1); no checkpoint store matched | Open. Loop table serves MoL restart; no player-state checkpoint | shown |
| H3 | Body template, seat, carrier | `seat_profiles.js` (11), `book_world_paradise_carriers.js` (2), `feature_expansion_nested_carriers.js` (3), `cast_body_adapter.js` (1) | Partial and Paradise-shaped; no general template | shown / inferred |
| H4 | Perception filter, recognition, evidence | `feature_expansion_book_recognition.js` (2), `feature_expansion_recognition_host.js` (1), `claim_runtime.js` (3), `story_recognizer.js` (2) | Partial; whether a per-observer receipt exists is not checked | shown / inferred |
| H5 | Intake and upkeep | `book_world_gu_domain.js` (1), `book_world_gu_keeper_domain.js` (1), `home_cultivation.js`, `cultivation_intents_domain.js` | Reverend Insanity and home cultivation have owners; floor unchecked | shown |
| H6 | Batch, portion, label identity | `craft_batch_goal.js` (1), `storage_batch_ui.js` (1), `hp_brewing_domain.js` (2); `invention_receipts.js` (0) | Consumers exist per craft; no shared identity rule | shown / inferred |
| H7 | Hidden strength, rival with memory | no match for nemesis, hidden strength or persistent rival | Open | shown (0 files) |
| H8 | Cause-tagged prices, arbitrage | `lotm_price_map.js` (0); "arbitrage" appears only in `absorb_c1/accessories.js` | Open; the LOTM price map is built but unimported | shown |
| H9 | Cheat presentation, non-circle forms | not grepped | Not checked | n/a |
| H10 | Hit location, layered repair | `harmPart` in `harm_engine.js`, `tempo_fight_domain.js`; `harm_loops.js` (0), `harm_engine.js` (2) | Partial; layered repair not shown | shown / inferred |
| H11 | Generators | `quest_generator.js` (2), `premise_generator.js` (1), `trope_recognizer.js` (1) | Built, thinly reached | shown |
| H12 | Place-agnostic pack builder | `build_cast_pack.mjs:34` takes `placePrefix` | Uncommitted; not exercised on a non-LOTM book | shown (see X2) |

Newly noticed unreachable modules (G15 pattern): `canon_pull_panel.js`, `anchor_snapshots.js`, `lotm_price_map.js`, `harm_loops.js`, `invention_receipts.js` each show 0 importers under my grep. Each could still load through a path my grep misses, so confirm before calling them dead.

## 3. Per-book gap rows

Reading state: "outputs exist" means the lead-run folder holds shard outputs (file counts shown below are file counts of `*rules*`, `*people*`, `*census*`, `*scenes*`, `*texture*` JSON/JSONL names, not shard or chapter counts; completeness of each pass is stated by run files, not re-checked). CW codes are those in [CROSS_WORLD_DETAIL_REVIEW](../gm/CROSS_WORLD_DETAIL_REVIEW.md); weak families come from the CROSS_WORLD cluster tables (stated, reader-based, proposal-level coverage).

### 3.1 Lord of the Mysteries (BF32)

- **Source.** Chinese volumes 1-8 (Calibre 1); English official and old-TL EPUBs in `~/Downloads`; coverage shows two held records, chapters 1-1467, flagged compilations (shown). Volume 1 was read first; volumes 2-8 and COI shards were sent to batch (GM9 and the index, stated). No source gap at book level. Gap: three chapters missing from the Chinese shards, filled by the English edition (index, stated). Unread depth: fan material and wiki cross-check are older (2026-10-10).
- **Design.** Mystery/pathway cluster rows (stated): CW02, CW15, CW18 not found; CW31 not found (likely not applicable); CW13, CW23, CW24, CW32, CW33 partial. Dial tensions X3 and X4 stay open in the LOTM institutions doc (stated by CROSS_WORLD). Family-level: statutes by jurisdiction (GM23), second persona standing (GM24), ability costs (GM26) are mechanism gaps (stated, READING_GAP_MAP).
- **Implementation.** 39 `book_world_lotm_*` modules (shown). Needs H1 (2 importers, first slice), H4 (partial), H6 (potion consumer, uncommitted edits by other sessions), H8 (price map unimported), H7 (open). Sequence 7 stub at `book_world_lotm_path.js:21` per READING_GAP_MAP (stated, line number not rechecked).
- **Smallest next slice.** The BF32 done check: one qualified observation changes one later action without becoming a universal detector. Pair with wiring `lotm_price_map.js` into one shop price display (a reachable caller is the G15 lesson). Owner: current Klein-first plan.

### 3.2 Circle of Inevitability (BF33)

- **Source.** English: Calibre 34 (1-1179, skips 1026, no afterword) plus a complete `~/Downloads` edition 1-1179 with afterword, plus a Light Novel World scrape; coverage shows three records, 1-1190 or 1-1180 (shown). Chinese 宿命之环 not downloaded; about ten editions exist on Z-Library (index, stated; a download needs Weibao's go). Reader batch outputs exist (5,406 shard-like files, shown). Merge exists (X1).
- **Design.** Soldier/hub cluster applies loosely. BF33 asks for borrowed-support grants with issuer, terms and termination, separate from owned progress. 8 COI mechanisms uncovered in code and 9 with a neutral seam but no COI rows (GAP_AUDIT R1, stated, dated 10-30).
- **Implementation.** No `book_world_coi_*` module; `coi` appears in `book_world_player_agency_contracts.js` and `feature_expansion_book_roster.js` (shown) as roster/contract text only (inferred). Needs H1 (shared with LOTM), H4 (recognition), a grant record (see cross-book X-S4).
- **Smallest next slice.** One source-qualified grant with issuer, terms, faculty and withdrawal: supported use, withdrawn support, ordinary work continues (BF33 check). Check first whether the existing contract module in `book_world_player_agency_contracts.js` already carries issuer/termination.

### 3.3 Mother of Learning (BF34)

- **Source.** Calibre 21, chapters 1-106 plus epilogue (index, stated); coverage shows 110 parts, no gaps (shown). Fully fed to the batch plan; outputs and merge exist (X1). Source gap: none found at the book level. Unread: fan continuations.
- **Design.** Magic/craft cluster: CW15 covered, CW16 and CW18 partial, CW29 and CW31 are priority families (stated). The MoL institutions doc W1 gap (badge, housing key, mentor quota, electives) is the named academy-access gap (READING_GAP_MAP, stated). A loop participant's retention is distinct from the current visitor life (BF34, stated).
- **Implementation.** 11 `book_world_mol_*` modules, 12+ `mol_*`/`book_world_mol_*` tests (shown); `book_world_mol_host.js` has 4 importers, `book_world_mol_native.js` 2, `book_world_mol_access_domain.js` 1. Needs H2 (open; the MoL restart uses `loop_table.js`), H6 (alchemy batches), H1.
- **Smallest next slice.** BF34: one source-qualified optimization changes a later cost or output; compare a failed or interrupted attempt. If the badge/housing-key gap (GM6) is closer to the player's first week, take that instead.

### 3.4 Shadow Slave (BF35)

- **Source.** Calibre 16 (1-1840), vol 9 (1841-2260), vol 10 (2261-2720), vol 11 (2721-3000, first gaps 2888, 2889) (shown, X6). Chapters 3001+ not on disk; no volume 12 on Z-Library as of 2026-10-28 (index, stated); recheck monthly. Label question (G16) about an old-save wording is deferred.
- **Design.** Mystery/pathway cluster. Roughly 5,000 people rows against a 127-line life pack at 2026-10-28 (READING_GAP_MAP, stated, dated; current size not rechecked). BF35: award, exact restriction and recovery must be read by the same executing action (stated).
- **Implementation.** One module, `book_world_shadow_company_domain.js` (1 importer), plus a pack file (shown). The thinnest native footing among the fully read books. Needs H3 (a body/clock transition for later travel), H7, H10.
- **Smallest next slice.** BF35 check: the chosen ability solves a real task, its restriction changes another choice, recovery stays useful. Do not name the award here (sealed rule; refer by its ID in the card). First fix X6 by confirming whether 2888-2889 are true source gaps.

### 3.5 Reverend Insanity (BF44)

- **Source.** Calibre 15, one English EPUB 1-2334 (about 4.86M words; the 24 "volumes" are 100-chapter blocks of the copy) plus 13 partial 101-part records of unknown author (shown). No Chinese text mentioned. Pilot volume 1 and a larger run planned; outputs exist (3,168 shard-like files, shown). `sagaofgu-2026-10-24` and wiki cross-check exist (stated). Machine/community translation quality not assessed.
- **Design.** Mystery/pathway cluster. BF44 separates owned living tools, their support, refinement knowledge and operator means (stated). Rewind is "separately scoped" (BF44), so MoL-style retention may or may not apply (do not generalize).
- **Implementation.** Two Gu modules, 1 importer each (shown), so H5 has an owner; floor unchecked (X4). `home_cultivation.js` exists. Needs H5 finish, H6 (refinement batches), H2 only if rewind is selected.
- **Smallest next slice.** BF44: one acquired Gu with a useful noncombat or production consumer, plus a qualified unsupported-use case; transfer cannot duplicate it. Verify the existing Gu keeper tests cover this before building.

### 3.6 Harry Potter (BF30)

- **Source.** Rowling books 1-7 held as an omnibus PDF in `~/Downloads` and Calibre author folders; coverage lists "The Complete Harry Potter" PDF plus Cursed Child, HPMOR (fan, not canon), History of Magic and a film-making book (shown). PDF screening (pdf-screen) is required before reading the PDF. Outputs and merge exist (X1); hp07/08-style round-3 runs under `hpo1o2-2026-11-03` and `hpw1-ch2-2026-11-03` (shown names only). Unread: the Time-Turner pointer in the HP institutions doc (CROSS_WORLD, stated).
- **Design.** Magic/craft cluster. CW09, CW11, CW14, CW16, CW29 are priority (stated). Prices and fares: HP X10 treats the newspaper fare as edition-dependent (stated). About 3,800 people rows against a small pack (stated, dated).
- **Implementation.** 5 `book_world_hp_*` modules, `hp_brewing*`, `hp_preparation.js` (2 importers), `hp_ingredient_substitution.js` and about 12 `hp_*` tests (shown). The densest craft owner. Needs H6 (brewing batch identity, other sessions have uncommitted edits), H4 (Polyjuice and perceived identity was a 2026-11-03 round, WRITEUP_REGISTER), H1.
- **Smallest next slice.** BF30: one learned operation (a lesson) has a later useful consumer; assessment records demonstrated work. Compare sanctioned and unapproved supply without treating prohibition as inability.

### 3.7 D&D (BF31)

- **Source.** Tabletop rulebooks in the Source Library (about 1,890 assets, mostly rulebooks; index, stated). Edition and setting are chosen separately (BF31). No institutions doc exists (CROSS_WORLD: "D&D has no institutions doc", stated; I confirmed no file in the 12-file institutions list).
- **Design.** Magic/craft cluster; D&D rests on card hits only. Weak: everything not in the card. Do not invent a shared SRD5.1/5.2.1 rule set (BF31).
- **Implementation.** `src/` mentions dnd in 2 files (inferred, crude). No world module. Needs H6 (spell components), H10 (target effects).
- **Smallest next slice.** Docs first: an institutions-and-roles doc for one edition and setting, then BF31's check (one operation repairs a supported workpiece, refuses an unsupported target, gives one customer outcome). Sourcing gap: pick the edition from what is held before writing.

### 3.8 A Soldier's Life (BF37)

- **Source.** Books 1-6 held (Calibre 55-58, 112 plus a mobi for book 4), chapters 1-384 (index, stated). Book 7 exists only as a Patreon draft; Z-Library lists books 2-6 (stated). Outputs and merge exist (X1); rich rows (4,670 census, 23,780 lead-touched, stated).
- **Design.** Soldier/hub cluster: CW20, CW21, CW10, CW27 priority. Line 152 of its doc bans outlawed essences except executions (stated); that is world-local (CROSS_WORLD).
- **Implementation.** 1 `src/` file mentions soldier (inferred); runtime is paused by Weibao's own direction (GAP_AUDIT R4, stated). No change unless he says so.
- **Smallest next slice.** None in code. Docs only: BF37's done check (interfaces and private claim IDs have explicit dispositions).

### 3.9 Reincarnation Paradise (BF36)

- **Source.** Calibre 13, but it is a machine translation (gemini-2.5-flash), chapters 1-4143 with eight gaps (X8). Source gap: a human translation or the chapter gaps. Not batch-registered (index, stated); native work uses design docs (`NS01_REINCARNATION_PARADISE`, `paradise-hub/` docs).
- **Design.** Soldier/hub cluster. BF36: preparation and return settlement change the next work cycle. H8 (arbitrage) and H3 (carriers) are its heaviest needs.
- **Implementation.** The most developed non-LOTM world: 15 `book_world_paradise_*` modules, 51 `src/` files mention paradise (shown). `book_world_paradise_host.js` (3), `_native.js` (3), `_campaign_host.js` (2), `_carriers.js` (2).
- **Smallest next slice.** BF36: a paid service changes one mission approach and settled return keeps the right cargo, costs and receipts. Do not reproduce the protagonist's privileges.

### 3.10 Regressor's Tale of Cultivation (BF53)

- **Source.** Calibre 17, 640 registered chapters; held text continues to 874 (gap at 808) plus a chapter 211 supplement (X7). Source identity and translation need qualifying (BF53 title). Batch plan `2026-11-01-rtoc` planned with approval PENDING in the index (stated, dated); outputs exist (4,925 files, shown) but no merge folder found (`ls` shows only `lead-run-2026-10-29` and `source`).
- **Design.** Cultivation cluster, plus loop elements. A sacrificed-humans-pill line (line 175) contradicts nothing in other worlds (CROSS_WORLD, stated). Institutions doc exists.
- **Implementation.** 2 `src/` files mention it (inferred); no world module. Needs H2 (retention scope), H5.
- **Smallest next slice.** Source first: run the merge step (`merge_shards.mjs`, a free script step) so it matches the six merged books, then BF53's check: retained knowledge changes a current operation while stock and others' beliefs follow their retention rules.

### 3.11 The five TTKS titles (BF38-BF42)

- **Source.** Captures of 2026-10-10: B1 111 chapters (Qidian), B2 665 (Fanqie, 1-10 official free text), B3 429 (1-10 free), B4 206, B5 668 (index, stated). B2-B5 are snapshots of ongoing serials and may have grown (stated). Not in the Source Library (coverage not applicable). The ttks.tw mirror is the transport, not a title; name them by title.
- **Design.** Cultivation cluster. Each BF row separates clocks and rights: B1 native track vs upstream carrier, B2 annual selection vs simulated life vs real settlement, B3 attempt vs archived best vs submission, B4 knowledge vs possession vs command, B5 channel-specific knowledge vs consent vs substrate cost (stated). TTKS wage readings are already reconciled in-doc (C11, stated).
- **Implementation.** 0 `src/` files mention ttks (shown). No world module. Needs H2 (B1 loop-carried memory, B2/B3 attempts), H3, H4 (B5 inspect/copy).
- **Smallest next slice.** B1 is the best-grounded (111 chapters, complete): BF38 check, one supported action, one changed-support refusal, independent means retained. Docs-only until a world module exists.

### 3.12 Primordial Saint Sect

- **Source.** Local capture `book.txt` plus AUDIT_1-3 and SCOUT docs (shown names). Not in the Source Library (X10). No chapter range recorded in LIBRARY_INDEX; reading state unverified.
- **Design.** Cultivation cluster (CW19, CW21, CW34, CW08, CW22). Institutions doc exists.
- **Implementation.** 4 `book_world_primordial_*` modules; `_host.js` and `_domain.js` 1 importer each (shown). A native footing exists without a batch-read.
- **Smallest next slice.** First record chapter count and held range in the library index (a docs-only fix), then check what the existing modules claim against AUDIT_1-3.

### 3.13 Fanren simulator

- **Source.** 44-chapter capture (`fanrencongjiyindao-moniqi/`), DEEP_DIVE of 2026-10-10 and readers, not batch-registered (index, stated). Easy to confuse with the 285-chapter 我有一个修仙模拟器 (X9). Serial may have grown.
- **Design.** Cultivation cluster, simulation-mechanic worlds share B2's three clocks.
- **Implementation.** 0 `src/` files by name. Needs H2/H5.
- **Smallest next slice.** Docs: bind the simulator's clock rules to B2's (BF39) as a shared "simulated life vs real settlement" record, then register or discard the capture.

### 3.14 Catalogued books BF43-BF57

Library coverage records (shown): Worm 44 (Wildbow trio), Omniscient Reader 256 (series query is broad; count not meaningful), Wish Upon the Stars 17, You Are Summoned 11, Legendary Mechanic 1, Labyrinth of the Mad God 3, Solo Leveling 1, You Have Died Again 1, Speedrunning 4, Fated Villain 1, Warlock 1, Gluttony 3, Genetic Ascension 1, Kairos 3, A Will Eternal 1, Beyond the Timescape 1, A Novel Concept 1; I Shall Seal the Heavens and Renegade Immortal 0.

| BF | Book | Source status | `src/` mentions (crude) | Needs | Smallest check (from BF row) |
|---|---|---|---|---|---|
| 43 | A Novel Concept | 1 record, compilation; deep-dive docs only | 0 | H6 | camp-support action improves a next operation, no double award |
| 45 | Omniscient Reader's Viewpoint | held; ORV institutions doc exists | 15 | H4, H7 | support or negotiation changes an outcome; absent publicity invents no witnesses |
| 46 | Worm | 304 chapters, batch-registered, outputs exist (3,980 files) | 9 | H4, H7 | same capability helps civilian and conflict roles |
| 47 | The Legendary Mechanic | 1 record | 2 | H6 | prototype performs after a real build; supply loss keeps knowledge |
| 48 | Labyrinth of the Mad God | 3 records | 4 | H7 | camp action affects an expedition; one reward settles |
| 49 | Solo Leveling | 1 record | 0 | H7 | two participation roles change cost/risk |
| 50 | You Have Died Again | 1 record | 0 | H2 | one person's learning persists, another's stock restores |
| 51 | Speedrunning the Multiverse | 4 records | 0 | H2, H3 | one method differs for two body profiles |
| 52 | Fated Villain | 1 record | 1 | H8, H7 | ordinary household work works without the system |
| 54 | Warlock of the Magus World | 1 record | 0 | H6 | missing data limits an actual result |
| 55 | Second Coming of Gluttony | 3 records | 2 | H3, J3 | two-life schedule differs under clocks; no duplicate pay |
| 56 | Genetic Ascension | 1 record | 0 | H3, H10 | body change alters a real operation |
| 57 | Wish Upon the Stars | 17 records, 8 books batch-registered | 0 | H8 | feasible and unsupported requests give different outcomes |

Further catalogued (BF58-BF70 and later) are outside the requested range; coverage shows YAS (You Are Summoned) 11 records and Kairos 3 records, others as above.

### 3.15 Institution-doc gap extraction (haiku readers)

Two haiku readers extracted each institutions doc's own gap list, with the doc's line numbers (stated; the docs do not use "source/design/implementation" labels, so that split is the reader's, inferred). Percentages are the institutions passes' own close-read share of a book (a deep window pass), not the batch reader's whole-book rows. Both exist; do not mix them.

| World | Close-read share (doc's own) | Source gaps (reading windows) | Design gaps | Implementation note |
|---|---|---|---|---|
| A Soldier's Life | 46,174 of about 838,000 words (line 24) | Book 4 not extracted by that pass (235), Book 1 ch5-21 and 24-51, Book 2 city life, Book 3 campaign, Book 5 guild/caravan, Book 6 mostly (236-240) | no sergeant/promotion ladder (101), unsourced meal and inn prices C2 (218), rank ladder C7 (223), no term contract or cohort cycle (348) | runtime paused (3, 348) |
| COI | about 2.2% of about 2.03M words (59) | Hivemind ranks, Academy, Tarot Club operation, Feysac/Feynapotter markets, Purifier terms, Bureau 7/8 pay, Seq 4+ prices, dream-city institutions (190-197) | K7/K13 kit-card gaps (278) | no pack, card or test as of that doc (203, 220, 239) |
| Fanren simulator | 44 chapters held; chapters 45-184 not held, about 76% (233) | ch45+, plus ch30-31 and 42-44 (293, 300) | floor rows have no pack/card (274-278); realm after run C1, fee attachment C2, avenging rule C4 open | none in code; data contract only |
| Harry Potter | 43,431 words in four windows (48) | nine-row gap table (234-249): B4 index unbuilt, B5 ch12-17/31/34-35, B6 shops and Apparition, B7, companion volumes, Death Eater and Order roles; spell mechanics unread (301) | nursery profile choice C1 (260), K3/K6 floor slices | doc says only the Polyjuice slice is in code (36, 302, 329) |
| LOTM (first novel) | serials 370-1402 worker notes unread by hand (31, 220) | gap table windows (208-220); Seq 9 formula prices have no window (218); archbishop headcount C11 (219) | warden LTS13 authored not sourced (233); K8 anchors proposals (235); X3, X4 open (163-164) | proposed slices only (244-246) |
| Mother of Learning | 47,584 of about 804,945 words, 5.9% (209) | no currency or price list in the book (165-166); c001, c002, c016, c032, c017, c036-c042, c085, c095, c097-c107 windows; calendar and mana chapters (213-224) | authored crowns and prices (196, 299); C2 kit-card crown mismatch with the pack (195); C6 loop vs frozen clock (199); K13 loop choice (306-310) | six laws and nine people in the pack, not played (267-272) |
| ORV | 20 of 551 chapters (34) | G1-G7 (187-193); coin-farm economy and food prices (91); Constellations beyond the auction, Eden, Olympus (55); side stories after ch551 (194) | F1, F3, F5 proposals (211-215) | doc link fixes C1-C2 |
| Primordial Saint Sect | 28 of 1,437 chapters (28) | gap table (277-287): ch61-99 institutions, ch700-980 and 1000-1182; four missing chapters need a second translation (287, F12 at 229) | Merit Pool monthly vs yearly limit (398); second-half manual price and days per month authored (407) | follow-up links and SCOUT edits |
| Regressor's Tale | about 2% of 2.18M words (24, 215); passes read nothing after m456 (308) | unread windows (219-227, 231-239); text stops near ch640 (7); star durations C1 unresolved (200, 300) | no kit card yet (268, 294); zero auction result shapes design (247) | link/path fixes (290-293) |
| Reverend Insanity | about 4.86M of 4.90M words unread (182) | gap table (186-196, 199): second inner city and courtesan houses (260), ch419 unopened, lunar cycles, refineries, resource-cave leasing | C2/C7 vs DESIGN.md D2 check; one control-or-manufacture consumer (273) | dead links C6 |
| Shadow Slave | about 1.9% of 2.24M words (22); volumes 9-11 past ch1840 not searched (7, 205) | gap table (199-205): cohort roles, Telle, Roan, Tyris, Ravenheart bathhouse, Eye Candy Cafe, Gate Crisis penalties (47-48, 96) | Jet and Caster missing from the kit card (187); PROPOSED credit numbers (217); no-rate dial (184); civil rank scale (185) | stale Sync path, kit-card reconciliation (247-250) |
| TTKS (five books) | per-book windows | B1 0033-0036 and volume-2 Association; B3 0239-0272, 0279+; B5 0017-0023, 0100-0110, 0270 (and 0100-0668 per 83); B4 0206, 0022, 0026, 0048 p72-92; B2 0380-0384, 0020 p80+, 0644 (236-245) | B4 gallery weight left unset (259); weighted-vote and official-vs-grey price rows (267-268, 477); open C5, C8 (186, 189) | kit card updates (269, 283-285) |

**New contradictions from the readers.**

| ID | Contradiction | Label |
|---|---|---|
| X11 | The A Soldier's Life doc says Book 4 was never extracted (235); LIBRARY_INDEX says a converted copy of the book 4 mobi exists in the private folder. Different statements about the same file; one is out of date | stated vs stated |
| X12 | The HP doc (dated 2026-10-23) says only the Polyjuice slice is in code. Today `src/` holds five `book_world_hp_*` modules, `hp_brewing_*`, `hp_preparation.js` and about 12 `hp_*` tests | doc stated, code shown. Doc is stale |
| X13 | The COI doc says no pack, card or test (203, 220, 239). `src/` has a roster/contract mention and a card exists (`cards/circle-of-inevitability.md`) | stated vs shown. Doc partly stale; pack and test not found |
| X14 | The Fanren doc says 184 chapters exist and 44 are held; LIBRARY_INDEX and the capture folder say 44 chapters, which matches "held" but leaves 140 chapters as the biggest single source gap in the cultivation cluster | stated |
| X15 | The MoL doc flags a mismatch between kit-card crown prices and the pack (C2, 195) and says the book has no currency or price list (165-166); BF rows treat prices as derivable. Prices there are authored, not sourced | stated |

**Reading-state caution.** Close-read shares are 2-6% for the big books, but the batch readers covered whole books into rows (GAP_AUDIT, stated). A "source gap" in the sense of an unread book therefore mostly means "no human-verified window", not "no rows". The unread stretch that matters is the one with no rows at all: Shadow Slave 3001+, Soldier's Life book 7+, Fanren 45-184, TTKS serial growth, Paradise's eight chapter gaps and non-existent human translation, PSS chapters not captured.

## 4. Cross-book section

### 4.1 Shared gaps

| ID | Shared gap | Books | Seam today | Label |
|---|---|---|---|---|
| S1 | No world binds CW01-CW36 by code; CW and comic CW1-CW17 collide | all | none (F1, F5, G2) | stated |
| S2 | Retention contract: what resets, what carries, per person | MoL, Regressor's Tale, TTKS B1/B2/B3, You Have Died Again, Speedrunning, Gluttony clocks | `loop_table.js` (MoL only) | shown / stated |
| S3 | Body, seat and carrier beyond Paradise | Paradise, Speedrunning, Genetic Ascension, TTKS B4, Fated Villain | `seat_profiles.js`, `book_world_paradise_carriers.js` | shown |
| S4 | A grant or lease record: issuer, terms, faculty, termination, independent of owned progress | COI grants, TTKS B1 carrier, Wish grants, Fated Villain system, ORV sponsors, Paradise service | `book_world_player_agency_contracts.js` may cover contracts; not checked | inferred |
| S5 | Claim, receipt and belief (J1) | LOTM, HP Polyjuice, ORV, Worm, TTKS B5 | `claim_runtime.js` (3 importers) | shown / inferred |
| S6 | Batch, portion and label identity (J5) | HP, LOTM, MoL, Warlock, Reverend Insanity refinement | `craft_batch_goal.js` | shown |
| S7 | Hidden strength and persistent rival | Solo Leveling, Labyrinth, Worm, LOTM, Shadow Slave | none | shown (0 files) |
| S8 | Cause-tagged prices | Paradise, LOTM, Wish, Worm, HP | `lotm_price_map.js` unimported | shown |
| S9 | Unreachable but built modules | LOTM prices, canon-pull panel, anchors, harm loops | five modules, 0 importers | shown |
| S10 | Reading outpacing use: thousands of people and rule rows, small packs | Shadow Slave, HP, COI, Regressor's Tale | `world_pack_population.js` | stated (dated 10-28) |
| S11 | "Prohibition is not inability": a rule, ban or label must not become physical impossibility | BF30, BF53 and others | design rule repeated in many BF rows | stated |

### 4.2 Features useful to every book (proposals)

1. **A per-world CW binding row** (G1/G2): a single table in each world card with family, disposition, locator. Low cost, docs only; fixes S1.
2. **One retention contract record** (S2) with four fields (resets, carries, per person, who knows) so MoL, Regressor's Tale and TTKS stop authoring separately. Depends on H2's decision.
3. **One grant/lease record** (S4), checked against the player-agency contracts module before building.
4. **Reachability gate**: every H row's done check names an importer or UI entry (the G15 lesson). Applying it now flags five modules in S9.
5. **Library hygiene**: register held-range, gaps and translation kind per book in LIBRARY_INDEX (X6-X10), so a source gap is a chapter range, not a feeling.
6. **Place-agnostic pack builder** (H12): finish it by running it on one non-LOTM book end to end (MoL is the cheapest, since it is merged).

### 4.3 Ranking proposal (leverage over cost; proposal only)

1. Library hygiene rows (X6-X10, cheap, docs).
2. Run H12 on MoL, then Shadow Slave, to see whether the builder works beyond LOTM.
3. Reachability audit of the five S9 modules, wired or retired.
4. Retention contract (S2) once with Weibao's yes on the dial (S2 is design, not scope drift).
5. Merge Regressor's Tale and bring it level with the six merged books.
6. S7 hidden strength and rival, with the Klein-first work staying the focus.

## 5. Open

- Not read: any book text; Skyrim, Fallout, Elden Ring, comic and anime worlds; BF58-BF70.
- Not run: tests, build, browser.
- Haiku reader returns: see 3.15.

## 6. More to consider, round 1 (2026-11-03, proposals)

- **ACT NOW (done):** Fifteen contradictions or stale claims across the inputs are listed in section 1 (X1-X10) and 3.15 (X11-X15), with locators. The S9 list of unimported modules is separate.
- **ACCOUNT FOR NOW:** "Native status" in this doc is module presence and importer count. It is not the AD43 floor and not a browser proof. Do not report any world as implemented from section 2 or 3.
- **ACCOUNT FOR NOW:** Reincarnation Paradise's held text is machine translation with gaps. Any new rule claimed from it needs a MT-uncertainty flag; consider a better edition before further source claims.
- **ACCOUNT FOR NOW:** Regressor's Tale is the only fully held big book without a merge folder (verify with `merge_shards.mjs` before adding rules).
- **LATER / DELEGATE (level: sonnet; effort: low; done: a table):** re-grep importers using a proper import graph (include `../` and index imports) to replace my top-level-only counts.
- **LATER / DELEGATE (haiku; low; done: 8 rows):** record held range, gaps and translation kind in LIBRARY_INDEX for Paradise, Shadow Slave, Regressor's Tale, PSS and Fanren.
- **LATER:** D&D institutions doc (docs only), one edition and setting.
- **LATER:** Decide whether the Fanren capture stays as a B2 sibling or is retired.
- **LATER / INSPECT:** The `book_world_player_agency_contracts.js` module may already be the S4 grant record; read before authoring a new one.
- **Suggestions (not gates):** BF58-BF70 books get the same per-book row once the above settle.

## 7. Classics and ease of implementation, round 2 (2026-11-04, proposal)

Status: agent proposal (AD32), docs-only read by a sonnet reader (WPR1, WPR4 labels: ease and use scores are *inferred*; holdings are *shown* from LIBRARY_INDEX). No book text read; no floor (AD43) or browser check.

| Book / world | Held | Ease (5 easiest) and carrying seams | Use | Missing seam |
|---|---|---|---|---|
| Harry Potter, Lord of the Mysteries | yes | 5; existing `book_world_hp_*` and `book_world_lotm_*` modules | 4, 5 | none new |
| Mother of Learning | yes | 4; `book_world_mol_*`, `loop_table.js` | 4 | H2 rewind checkpoint |
| Hunger Games (1-3, Songbirds, Sunrise) | yes (PH3) | 4; site/survival rules SR1-SR24 plus AD50 exits for the arena | 4 | audience/sponsor seam, forced-participation start |
| Percy Jackson 1-5, Heroes of Olympus 1-5 | yes (PH1, PH2) | 4 and 3; HP school life as Camp Half-Blood, AD51 power-assignment seam | 3 | patron/quest seam, two-camp switch |
| Earthsea | yes (BC8) | 3; school life | 4 | true-name power seam |
| Worm, Pact, Twig, Ward | yes | 2; needs H4, H3 and the rest of H7 (slice 1, rival memory, landed in 112dea246 on 2026-11-04) | 5, 4 | H7 beyond slice 1, H3, H4 |
| Wheel of Time, His Dark Materials, Ender | yes (BC8) | 2 | 3, 3, 2 | none designed |
| Glorantha, Harn, Mystara | no (DL83, DL84, DL86; A/Z else buy) | 1 (hardest), 2, 3 | 5, 4, 2 (inferred from forum opinion on unheld worlds) | cult/myth magic, low-magic social detail |

Top useful to hold: Worm family (only test of H7/H4/H3), LOTM, MoL with Perfect Run (a second loop world validates H2 per AD51), Hunger Games (cleanest AD50 test), Reverend Insanity (H5). Easiest to get and build: HP, LOTM, Percy Jackson/Heroes of Olympus, Hunger Games, MoL.

**Gaps (inferred):** G1 Worm, Shadow Slave and the TTKS titles have no native module (H7, H3, H2). G2 mechanically distinct tabletop worlds are not held. G3 the new classics have no institutions doc, WER answers or gap row.

**Stale lines to fix in their owners (not edited here):** DOWNLOAD_WISHLIST "LATER, classics" says Trials of Apollo, Kane Chronicles, Earthsea, His Dark Materials and Ender have no catalogue hits, but LIBRARY_INDEX BC7/BC8 hold them. DOWNLOAD_WISHLIST says "Hunger Games 1-5"; LIBRARY_INDEX lists books 1-3 plus two prequels. LIBRARY_INDEX Shadow Slave "1-3000" omits missing 2888-2889 (X6).

**More to consider.** ACCOUNT FOR NOW: Wheel of Time omnibus book list was never checked (BC8); verify before any rule claim. LATER (haiku, low; done: one design-doc stub each): institutions docs for Hunger Games and Percy Jackson naming WER answers, so the cheapest high-use worlds get an owner before runtime. LATER: decide Frontier and Mistglass menu retirement (default: hide from menus, keep saves loadable and code as fixtures; needs Weibao's yes).

**Freshness correction (2026-11-04).** H7 and G3 above predate `112dea246` (rival memory, hidden-strength appraisal gate, `rival_memory.js`, read by `native_battle.js` and `tempo_fight_domain.js`): H7 is partial, not open. Still 0 importers on 2026-11-04 (top-level grep): `canon_pull_panel.js`, `lotm_price_map.js`, `anchor_snapshots.js`, `invention_receipts.js`, `world_pack_save.js`. `harm_loops.js` now has 3.

**Deferral (Weibao, 2026-11-04, sequencing not a standing rule).** The partly-held and not-held tabletop settings (Golarion, Forgotten Realms, Harn, Glorantha, Mystara) wait for the long term. Reasons: not held, no engine seam carries them, and he does not yet know them well enough to judge interest. They are not deferred for lack of depth: forum posters name Harn and Glorantha for depth. Wheel of Time (book list unchecked) and Steerswoman (books 3-4 missing) are partial for other reasons. Chart axes in the Nov 4 grid read as a ranking; Glorantha sat at ease 1 (hardest), use 5.

## 8. More to consider, round 3 (2026-11-04, proposals; map shown in chat from SYSTEMS front door and GAP_AUDIT)

- **Deferral.** ACCOUNT FOR NOW: tabletop settings wait (section 7). LATER: a one-line pitch per setting so Weibao can judge interest; Harn and Glorantha are the forum-named depth picks and would be the mechanically distinct ones.
- **Grid fix.** ACT NOW (done): axes read as ranks. Future charts use "harder to easier" words, not bare numbers; Glorantha was hardest, not easiest.
- **Our own cosmology.** ACCOUNT FOR NOW: OD5 needs per-world state that survives a crossing; `world_pack_save.js` has 0 importers (2026-11-04 grep), so confirm S8 save wiring before building any further world. LATER: pick a default cosmology for our world from the MULTIVERSE_STRUCTURES menu (Village as home, Wayfarer Exchange as the traveler hub is the existing candidate). Homes and bases has 34 modules but no maturity word: unknown, not zero.
- **Foundations.** ACCOUNT FOR NOW: tiles use the systems front door's own maturity words; about 15 systems have none and stay unmapped. Proposed default build order (a proposal, not a decision): 1) wire `canon_pull_panel` and `lotm_price_map` (built, 0 importers, serve LOTM); 2) per-observer recognition receipt (H4) for Klein windows; 3) lead first screen CG3/CG5/CG7; 4) S8 pack save wire (non-LOTM foundation, changes sequencing); 5) H2 rewind via `anchor_snapshots` (shared by Mother of Learning and Perfect Run, non-LOTM).

## 9. Reconcile ledger, gap-status and world-priority claims (2026-11-04)

Scope: claims made in this thread only; other rows stay unmapped. Evidence rows reached: "reachable" = top-level import grep (can miss subfolder imports); none reached "implemented" or "works end to end". Dispositions are proposals.

| ID | Claim and locator | Classification | Owner / consumer | Evidence reached | Disposition |
|---|---|---|---|---|---|
| X16 | AD50 row missing at committed HEAD `e6a600998`; `check:rules` FAILs (AD codes not contiguous, AD51 at position 50). Row exists only in dirty `docs/RULES_INDEX.md`; its links point at uncommitted `USER_VISION` section and `docs/research/END_RUN_THREATS_LORE_SWEEP_2026-11-03.md` | incomplete integration | session that wrote AD50 (live in this checkout) | check run on a clean worktree of HEAD, output read | open; owner commits row, USER_VISION section and research doc together; push waits |
| X17 | GAP_AUDIT G3 "none built" and H7 "open" | stale documentation | `rival_memory.js`, read by `native_battle.js` and `tempo_fight_domain.js` (112dea246) | grep + commit message | corrected in section 7; H7 partial |
| X18 | systems front door: "Weapon runes and inscription: no map word"; `rune_grammar.js` header says "Not wired yet" | stale documentation (header) and unrecorded maturity | `rune_grammar.js` imported by `pledges.js`, `pledges_content.js`, `pledges_domain.js`, which `native_tool_domains.js` imports | reachable | add a maturity word at the front door; fix the header comment; reachable is not proven in play |
| X19 | `canon_pull_panel`, `lotm_price_map`, `anchor_snapshots`, `invention_receipts`, `world_pack_save`: 0 importers | incomplete integration | respective owners (H1, H8/G11, H2, H6, S8) | reachable (0) | open; first two feed LOTM |
| X20 | DOWNLOAD_WISHLIST "classics have no hits" (C1) and "Hunger Games 1-5" (C2) vs LIBRARY_INDEX BC7/BC8, PH3 | stale documentation | DOWNLOAD_WISHLIST owner | doc comparison | open, not edited here |
| X21 | S8 pack save unwired (`world_pack_save.js` 0 importers; `main.js` uses `content_packs.js` pack state) | confirmed, still open | S8 | reachable (0) | shared cost for every crossing; not charged to one world |
| X22 | Witch Hat Atelier: 0 held records (`library_coverage.py --series`); only a manga-visual candidate (BOOK_CANDIDATES row 7759, last in the Suwayomi queue) and no design doc | missing source, not a gap claim | acquisition is a separate yes | coverage tool output read | treat as a mechanic to absorb for G7, rules unverified until a source digest exists |

**Difficulty axes (proposal, shown side by side, no composite):** feature complexity (distinct mechanisms in the packet and how many land on an existing S/H seam), source depth (held, read, merged, institutions doc), power headroom (demand on our scales, not a rank; CHEAT_COSMOLOGY and AD49), build burden (open seams, UI, persistence), source risk (medium, MT or OCR, unread share). Gap leverage is separate from difficulty. Existing rubric owners to reconcile before adopting: SUBSYSTEM_SCOPE_LADDERS, WORLD_COMPLETION_STANDARD, playability plan rounds 6 and 10, W15 power-core schema.

## 10. Reconcile ledger, long-term horizon (2026-11-04, continues X16-X22)

Owner of the roadmap itself: [playability plan round 12](../MASTER_PLAYABILITY_PLAN_2026-10-25.md#round-12-long-term-horizon-world-enablement-and-complexity-floor-2026-11-04-proposals). Evidence reached: document comparison only; no item was built or run.

| ID | Roadmap claim | Classification | Live owner | Disposition |
|---|---|---|---|---|
| X23 | "Now" keeps Klein/KJ3 first | compatible variant | PROJECT focus 1 | unchanged |
| X24 | W22.W per-world rows (2026-10-14) say most priority worlds have no proved chain | stale as status, valid as caution | W22, W1/W21 readiness | refresh before quoting as current; used only as a floor |
| X25 | Five difficulty components vs SSD10 six dials, WR1/WR2, W15 power core | partial duplicate | SUBSYSTEM_SCOPE_LADDERS, playability round 10 | adopt SSD10/WR for subsystems and loops; world-level five components are new and stay a proposal |
| X26 | S8 pack save wiring has no queued owner found | missing supplier | S8; IDEA_INDEX routing not searched | confirm owner before dispatch |
| X27 | "Later" worlds vs WR9 (a new world needs the prior world's three evenings) | compatible variant | playability round 10 | later items are mechanism slices, not new worlds |
| X28 | H2 rewind overlaps the Klein plan's "temporal recursion and anchors" row | possible duplicate | LOTM_KLEIN_FULL_JOURNEY_PLAN | read that row and the Mother of Learning loop lane before any H2 dispatch |
| X29 | Hunger Games and Percy Jackson difficulty | unknown, not low | no design or institutions doc | institutions doc first |

### 10.1 Disposition of the X19 modules (2026-11-04, re-grep including `../`, side-effect and index imports)

Evidence reached: importer grep over `src/`, `scripts/`, `tests/`; focused tests `lotm_price_map` and `invention_receipts` (26 pass). No browser run. `anchor_snapshots.js` (H2) untouched, pending the Klein "temporal recursion and anchors" row and the Mother of Learning loop lane (X28).

| Module | Importers found | Test | Journey step | Evidence row reached | Disposition |
|---|---|---|---|---|---|
| `canon_pull_panel.js` (H1) | `src/native_tool_domains.js:15` (side-effect `import './canon_pull_panel.js'`, which a `from` grep misses); `tests/book_world_lotm_opening.test.js`; `scripts/playtest/canon-pull-probe.mjs` | `book_world_lotm_opening` currently fails at the committed test: it imports `canonPullVisible`, which only the uncommitted `src/canon_pull_panel.js` edit in the primary checkout exports | existing probe `canon-pull-probe.mjs` opens the panel; not rerun | reachable (X19's "0 importers" was a grep miss) | Not dead. Another session's uncommitted edit owns the file, so I added nothing. Their commit must carry the `canonPullVisible` export with the test |
| `lotm_price_map.js` (G11/H8) | `scripts/lead_run/coverage_ledger.mjs:7` (coverage tooling only); no `src/` importer | `lotm_price_map.test.js` passes | none | tooling-reachable, not play-reachable | banked-cold (WR10) for play. The header says "no runtime state or host wiring"; a price consumer means designing cause-tagged arbitrage and a quote owner (AR3), which is a new feature, not a wire-up. H8 stays open. Revisit with the Klein market/broker slice |
| `invention_receipts.js` (H6) | `scripts/invention_qa.mjs:10` (QA tooling only); no `src/` importer | `invention_receipts.test.js` passes | none | tooling-reachable, not play-reachable | banked-cold (WR10). Header: "no execution/stock/save owner"; accepted bundles require `consumer.status==='demo'`. Wiring needs a save slice (AR6) and a stock owner first. H6 stays open |
| `anchor_snapshots.js` (H2) | none | `anchor_snapshots.test.js` | none | unreached | deferred per X28; not examined |

Correction to section 2: the H1 row's "(0)" for `canon_pull_panel.js` is wrong. Rows for H6 and H8 should read "tooling only". No other session's hunks were touched; this append is the only edit.

### 10.2 G8 character depth: producers, owners and consumers (2026-11-04, reconcile, read-only)

Evidence reached: file reads and importer greps over `src/`, `tests/`, `scripts/` (including `import './x.js'` forms, `read_models/` and registry paths); no test, build or browser run. "Shown" = read at the cited line this pass; "inferred" = concluded from absence of an importer or from a doc. Correction to `GAP_AUDIT_2026-10-30.md` G8 ("designed only"): that is **stale**. Five of the six G8 pieces have built, tested, saved generic modules; the real gap is **incomplete integration**, because neither the Klein nor the Harry Potter lead life imports any of them. Rust has a dial row only for `base.frontier` (`src/skill_records.js:12-15`), so no book world has rust at all.

| G8 piece | Current producer | State owner | Actual consumer / missing supplier | Evidence | Next consumer (round 12) |
|---|---|---|---|---|---|
| Heritage and genetics card | `src/lineage_traits.js` (loci `:11`, `breed` `:72`, `memberView` `:100`); `src/cultivation_root.js` | family slice read by `src/family_tree_panel.js`, `village_family.js`, `heir_inheritance.js`, `household_brood.js` | Frontier household only (`DEFAULT_PROFILE='household'`, `:25`). Klein and HP: no import, no profile. Missing supplier: a per-world lineage profile (AD1 says set per profile) and a card in the lead UI | shown (importers); inferred for "no HP/Klein heritage" (no `heritage`, `bloodline`, `half-blood` hit in `src/book_world_hp_*`, `hp_*`, `book_world_lotm_*`; HP and Klein plan docs mention none) | None selected. Round 12 row 9: promote only when a world consumes it (WR4). First plausible: HP (blood status) or a Klein heir, both unselected |
| Titles that evolve, combine, are stolen, or are held by items/places | `src/titles.js` (catalog `:8`, `grantEarnedTitles` `:89`); UI `src/titles_ui.js` | `character.titles` `{id:{at}}` (`titles.js:2`), bonuses derived on read | Hero counters only (`createTitlesPanel`, `main.js:565`; ladder perk `skill_ladder.js`). Evolve, combine, steal, held-by-item: no code. Klein carries office titles as authored data (`book_world_lotm_bands.js:99-101`, `title:'Nightmare'` etc.), display only; HP has no title or rank row (no `prefect`/house-point hit) | shown (`titles.js`, `main.js:565`, `bands.js:99-101`); inferred for evolve/steal | Klein: Nighthawks rank via `faction_rank.js`, which `book_world_lotm_merit.js:4` explicitly keeps separate. Later: HP house points and prefect. Neither needs steal or combine yet |
| Skill tiers and mastery beyond the creator | Generic XP ladder: `skill_ladder.js`, `skill_ladder_domain.js`; powers: `simulation_effects.js:426-449` (`mastery`, `executions`, `copyMastery` `:431`); faculty `development` `:420` | gameplay `levelable`; `state.simulation.powers[actor][id]` and `sources[...].development` | **HP uses powers**: `hp_charm_bridge.js:24-38` shows practice against `MASTERY_NEEDED=1`; `book_world_hp_facts.js:36-39` shows glass repair mastery/executions. **Klein uses a different owner**: `book_world_lotm_actions.js:55` (`power ... operation:'learn'`), digestion as resource `book.lotm.acting` (`:26`, `:130-131`, `book_world_lotm_path.js:17`). No tier above "creator", no mastery that outgrows a source. `src/ability_skill_rows.js` has tests only, no `src/` importer (`tests/ability_ui_neutral.test.js:11`, `ability_ladder_figure.test.js:180`) | shown | Klein digestion and acting (DEPTH_DIAL Q-W20: acting as faculty development) is the next real consumer. HP charm practice already consumes `mastery`. Open relation unresolved in DEPTH_DIAL R13 row (XP ladder vs faculty/power) |
| Stolen memory | None built. Nearest: `lead-life` opening memories `book_world_lotm_lives.js:44-56` (player knowledge with `kind:'recollection'`, `provenance:'canon'`); person memory (`person_memory.js`, `person_memory_effects.js`) is NPC memory of conduct | player knowledge store (S13) and person memory | Klein: opening recollections are the transmigrator's inherited memory, shown but not stealable or losable. HP: none. Missing supplier: a transfer/steal effect with a source and a cost | shown (lives.js); inferred for "no steal effect" (grep for `stolen|steal|copyMemory` in `src/` found only stealth and implant noise) | Klein, only if a Beyonder act that reads or takes memory is selected (Mind-related paths); not in the current arc |
| Rust and relearning | `src/skill_records.js` (`rustCeiling` `:28`, regain `:39`, `rustBonuses` `:54`); `skill_records_domain.js` | `skill_records` slice, saved (`tests/skill_records_persistence.test.js`) | Wired through `native_tool_domains.js:29` for the Frontier hero. `SKILL_DIALS` has one key, `base.frontier` (`:12`), so Klein and HP have no rust, by the module's own "no row, no control" rule. Powers (HP charms, Klein method) are not in the tracked skill list | shown | None demanded. A book-world dial row is a one-line data add, but only after a world wants decay; DEPTH_DIAL says rust must treat source-world capabilities by that world's rules |
| Habit depth D0-D4 | None. `cultivation_intents.js` and the `earned-habit` cheat (`cheat_mechanisms.js:119`) use "habit" in other senses | none | No producer, owner or consumer; this is the only G8 piece that is truly designed only | shown (grep, then reading the three hits) | Unselected. Klein daily routine (L2 acting note) is the likely first fit, via fewer richer decisions (Klein plan D1), not a new tier system |

**Classification summary.** Stale documentation: G8 "designed only" and the "grep found 0" reading of `lineage_traits`, `titles`, `skill_records`, `skill_ladder` (all have importers and tests). Incomplete integration: all five built pieces, because they serve the Frontier hero and no book life. Duplicate/disagreement risk: Klein digests via a resource counter, HP practises via power mastery, the Frontier hero levels via XP, three growth owners that DEPTH_DIAL R13 already flags as unresolved (Q-W21); unify the reading side before adding tiers. Missing proof: no browser run of titles, family tree or skills panel was done this pass, and the bridge between the Frontier `character` and a book life's `player` actor is inferred, not traced. Round 12 row 9 holds: nothing in G8 is a gate; each piece waits for a selected world to consume it (WR4). No files other than this append were changed.

### 10.2 Second consumers for the "Wired, thin" systems (2026-11-04, proposals; AD51)

Evidence reached: **read source** only (importer greps over `src/`, `scripts/`, `tests/` with `from` and side-effect forms, then the import lines read; `../` imports included). No focused test or journey was run for this subsection, so no row below is "verified". Test files are listed as existing consumers, not as passing. A grep hit shows an import, not that the path runs in play.

Principle (AD51): a second world validates or revises the shared seam; numbers and laws stay local to that world. Every pairing is labelled **shown** (a cited doc row states the mechanism) or **inferred** (I matched a seam to a world; no doc says so). All pairings are proposals; none is accepted, and none changes current sequencing (Klein first).

| System | Current consumers (source; test) | Evidence | Proposed next consumer | Pairing | Why | Open question |
|---|---|---|---|---|---|---|
| S2 gates (`defineGate`, `src/progression_gates.js:38`) | Four literal gates plus one built in a loop. `CAP_GATE`/`FIRST_GATE` in `book_world_primordial_credit.js:55,63`, evaluated at `:144`; `temperingGate` in `pledges_content.js:35`, evaluated at `pledges.js:111`; `HERB_LESSON_GATE` in `reveal_chain.js:7`, shown by `chain_inspector.js:83`; per-row `cheat.insight.*` gates in `cheat_mechanisms.js:26`. Tests: `progression_gates`, `primordial_credit`, `institution_store`, `chain_inspector`, `pledges` family | read source | Reincarnation Paradise tier-1-to-2 promotion, RPG1 to RPG3 in `docs/worlds/paradise-hub/PROGRESSION_GATES_2026-10-23.md` (also W22.W12, a partial live chain at `src/book_world_paradise_state.js`) | shown (catalog rows with kind, reads, routes and failure); runtime fit inferred | The catalog already writes gate kind, route cost and failure per row, which is what `defineGate` needs. It would be the first consumer that is a credential gate with a success test, not a capacity or knowledge gate, and no Paradise tier gate exists in `src/` today | Failure and overflow after a failed promotion are "not shown" in RPG1-RPG2 (MTL, not authenticated). Does the first gate need an invented failure rule, or only the success path? |
| S3 paths and abilities (`definePath`, `src/ascension_paths.js:32`) | Real worlds: LOTM (`book_world_lotm_path.js:12`, plus `book_world_lotm_pathways.js:8` and `lotm_advancement.js:6` as descriptor builders) and Shadow Slave (`ascension_paths_ss.js:12`, used by `world_packs/book_shadow_slave_trial.js:6`). Not worlds: `ascension_paths_mistglass.js:5` (only `tests/ascension_paths.test.js:4` imports it), `ui/preview/fixtures/*`, `ladder_holdings.js`, `structured_ladder_view.js`. Tests: `lotm_advancement`, `shadow_slave_trial`, `ascension_paths` | read source | Reincarnation Paradise tier ladder (INST section 9.3, the same RPG1-RPG3 rows). Fall-back if Paradise is held back: Reverend Insanity rank ladder from `docs/worlds/REVEREND_INSANITY_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md` (not read this pass) | Paradise: shown (ladder defined in the catalog); Reverend Insanity: inferred | Both existing worlds are strict forward ladders. The Paradise catalog says a level boundary can sit in either neighbouring tier until promotion succeeds, so it tests the stage-threshold model that `PROGRESSION_WORLD_STATE.md` G4 flags as thin | If one world takes both S2 and S3, AD51 gets one validation, not two. Should S3 go to Reverend Insanity so the two seams have different second worlds? (My lean: yes, but its doc is unread.) |
| S6 clearance (`defineClearance`, `src/clearance.js:9`) | One definition: `book_world_lotm_clearance.js:11`, imported by `book_world_lotm_actions.js:19`, `book_world_lotm_pathways.js:10`, `book_world_lotm_host.js:36`. Tests: `lotm_clearance` only | read source | Fullmetal Alchemist "State Alchemist office" row, `docs/worlds/fullmetal-alchemist/MODULE_CATALOGUE.md` row 12 (exam, appointment, institutional access, orders, obligations; "office is not a power rank; branch law differs"). Alternative: Harry Potter school roles and the Ministry (W22.W1) | shown (row exists); pairing inferred | The row's own warning, office is not a rank, is the test that clearance is separate from S3. FMA's `IMPLEMENTATION_PACKET.md` keeps the office out of its first slice ("State Military obligations" under later depth) | The packet defers the office. Does a clearance consumer wait for the FMA first slice, or does HP school roles go first? Branch pinning (manga vs 2003) must decide which office law loads |
| S16 tags (`TagRegistry`, `src/tag_store.js:33`) and gear/workshop | Tags: `craft_materials.js:8,89`, `mixture_rules.js:3,10`, `rule_modules.js:5,65`, reached by `craft_content_frontier.js:4`, `cast_making_adapter.js:3`, `slake_bench_start_content.js:8`. Workshop: `gear_workshop_domain.js` via `native_tool_domains.js:18,57`; `GEAR_WORK_LAWS` (`gear_work.js:14`) has one key, `base.frontier`. The MoL pack's `"tags"` (`world_packs/book_mol_pack.js:66`) are free-text scene labels, not S16. Tests: `tag_store`, `rule_modules`, `world_pack`, `gear_workshop` | read source | FMA "Equivalent exchange accounting" and "Automail engineering" rows (`MODULE_CATALOGUE.md`), W22.W17 (conserved physical stock, typed operation, actual changed object), with the FMA packet's bench slice | rows shown; pairing inferred | A second `GEAR_WORK_LAWS` key and a second tag registry would show whether the workshop is world-parametric or frontier-shaped. FMA's rule "a provenance card must not create matter" tests custody, not tag labels | Round 12 item 7 holds making-donor work for Weibao's yes. Is the FMA bench slice one of those items? Tags alone have no strength field, so graded properties need another owner |
| Cheat data cards (`src/cheat_cards.js`, `cheat_definitions.js`) | Eight faculty modules in `cheat_definitions.js:6-13` plus `quiet-faculty`, optional-start and ring-spirit cards (`cheat_cards.js:101-106`). Callers: `cheat_host.js:5,8` (from `main.js:379`), `life_experience_host.js:6` and `continuation_state.js:8` (`carryCheats`), `save_files.js:22`, `status_window.js:1`, `rehearsed_foe.js:3`. Tests: `cheat_mechanisms`, `cheat_growth`, `heirloom_compact`, `pattern_book`, `information_freshness` | read source | Mother of Learning retention row in `docs/worlds/mother-of-learning/RETENTION_RESET_SEAM_2026-11-03.md` (W22.W8 partial live chain; round 12 item 5, H2 rewind) | inferred | `carryCheats` already models what survives a reset. The seam doc is the only place that states retention rows, but it names no cheat card, so this pairing is mine | The seam doc does not mention cheat cards. MoL retention may belong in S10 facts and not cards. Check before dispatch; the other candidate is a Hunger Games or Percy Jackson card, which has no institutions doc yet (X29) |

Notes: (1) The front door says "4 gates"; source shows four literal `defineGate` calls plus one built per row in `cheat_mechanisms.js`, and `chain_inspector.js` projects only `HERB_LESSON_GATE`, so the other three are not author-visible there. (2) The S3 "2 worlds" count holds for play; mistglass is test-only. (3) The S16 workshop "one pack" is one world law key, not a pack file. (4) No other session's hunks were touched; this append is the only edit.

## 11. Reconcile ledger, merge, commit and prune pass (2026-11-04; continues X16-X29)

Scope: the claims made while merging the session lanes into local `master` and committing stopped sessions' leftover work. Evidence rows: "gate run" = a command run on a clean worktree of the stated tree, output read; "reported" = a child session's own report, not reproduced here. Nothing was pushed; nothing here is human-reviewed. Master after the pass: `e9b2ce341` (local).

| ID | Claim and locator | Classification | Owner / consumer | Evidence reached | Disposition |
|---|---|---|---|---|---|
| X16 | AD50 row missing at HEAD, `check:rules` FAIL | resolved, integration completed | RULES_INDEX register, `check_rules_index.mjs` | gate run: `check:rules` PASS (51 AD codes, 992 links) and receipts PASS on the tree committed as `e9b2ce341` | closed locally; AD50 text is still a transcription of Weibao's 2026-11-03 wording as recorded in USER_VISION, not re-verified against source chats |
| X19 | five modules with 0 importers | correction | `canon_pull_panel` (side-effect import in `native_tool_domains.js`), `lotm_price_map` and `invention_receipts` (tooling only), `world_pack_save` (now wired), `anchor_snapshots` (tests only) | importer grep plus the 10.1 table; `lotm_opening` and `place_act_sequence` now pass in a focused run | only `anchor_snapshots` still unreached; H8 and H6 stay open |
| X21 | S8 pack save unwired | closed for one slice | `world_pack_save.js`, SAVES decision row | reported: save, reload, Export, literal Import and a crossing keep state in a headless run; my integration full suite had the same 4 failures as the clean baseline, none new | per-world state is one writer (`reveal`); no gameplay calls it; browser run not reproduced here |
| X30 | Baseline: clean `e6a600998` had 4 failing tests; the 5-branch integration had the same 4 (5,113 tests, 5,092 pass, 17 skipped) | compatible variant | `book_world_lotm_opening`, `cast_worksheet`, `lead_run_crosswalk`, `place_act_sequence` | gate runs; after the stopped-session commit a focused run passes `lotm_opening` and `place_act_sequence`; the two CLI private-root tests still fail in a clean worktree because `docs/research/novels` is gitignored and absent (environment, not reproduced in the primary tree) | final full run on `e9b2ce341` was started; result not yet read |
| X31 | Stopped-session work committed on Weibao's instruction: 63 tracked edits, 128 small text files, `canonPullVisible`, tempo interaction code and tests, AD50 bundle | preservation, not acceptance | commits `8463cefdf`, `e9b2ce341`, authored under the repository identity | preservation establishes neither authorship, acceptance nor factual support; these commits record that the work was kept, nothing more | the rule docs and audits keep their own proposal labels |
| X32 | The committed `check_receipts` failure: the making-donor checkpoint had no receipt block | evidence correction | `docs/gm/dispatch/making-donor-2026-11-04/CHECKPOINT.md` | a receipt block added with `state: built` and `build: n/a`, because no build SHA-256 was recorded | stays `built`, not browser-verified; its own browser run is reported, not reproduced |
| X33 | `check_rules_index` link failures: a link to the gitignored novels folder; a rules doc linking an uncommitted evidence PNG | stale documentation / missing artifact | `SOURCE_DEEP_DIVE_PLAYBOOK.md`, `PROGRESSION_GATE_RULES.md` | link unlinked (private path stays as text); one 222 KB PNG committed | other evidence PNGs stay out of the repo |
| X34 | Round 12 approval: Weibao's raw wording was "Approved" to the question "Approve the five sequencing changes marked in the horizon view?" | user direction, scoped | USER_VISION entry (2026-11-04) | recorded verbatim with its limits; the horizon table is an agent proposal | only the five marked slices are sequenced |
| X35 | UI branch `claude/youthful-visvesvaraya-379d2a` | not merged | CG7, CG5 compare table, CG2 narrowing | reported: first full run had 32 failures from its own bug, fixed; second full run in progress; nothing committed | merge when its session commits with only baseline failures |

**Pruned.** Worktrees removed after confirming merged and clean apart from rebuilt `dist` output (restored first): craft parity, Hunger Games doc, FMA donor, maturity words, S8 save, H2 rewind (no code), wire-or-retire. The UI worktree stays (uncommitted work, live process). All branches stay; 110 `claude/*` branches are merged into master. The 19 `rep-*` branches and 3 other unmerged branches were not touched (X16 residue from the first ledger: needs a per-branch decision).

**Unmapped residue.** About 1,209 untracked files remain uncommitted on purpose: 1,270-image screenshot evidence and build outputs (about 899 MB), source maps, saved-game test files (kept private), a CPU profile, three 0.85-0.94 MB JSON evidence files, a stray `52-46` file, a `.bak`, and files touched in the last 90 minutes by the two live sessions (Klein builder, book collection refresh), including `LIBRARY_INDEX.md` and `SOURCE_ACQUISITION_TOOLS.md`. Not mapped: whether each excluded group is needed as evidence by a committed doc (check:rules found one).


## Complete book-gap audit reconciliation, 2026-11-04

Read sections 1–11 in chronology, including both 10.2 subsections and final integration/residue. Sections 10.1/11 supersede the original zero-import queue: canon_pull_panel has a side-effect import, price/invention modules serve tooling, and pack-save wiring has its bounded reveal-writer closure without a proven gameplay writer. X16’s original missing AD50 closes locally at its recorded input. X30 explicitly leaves its final full-run result unread; the earlier baseline-matched failures and later focused passes are not a clean final full-suite claim. X35’s in-progress UI run and pruning/branch counts are dated, not live leases or permission to remove anything (AD32, AD36).

Library holdings, container chapter ranges, emitted rows, merged outputs, edition identity and a qualified close-read window are different evidence. X11’s converted Book 4 versus unread-by-that-pass can be compatible scopes rather than necessarily the same stale-file claim. No-gap container coverage is not full-source correctness, and no catalogue record does not mean a local capture is unheld. Preserve the five distinct novel titles/profiles, both easily confused simulator captures, machine-translation/OCR limits and source growth as dated gaps. Register-or-discard wording does not authorize deletion. No acquisition, conversion or book text was undertaken here.

Module/keyword counts do not rank world maturity or show a callable producer. The G8 table itself has power-mastery consumers in HP and another LOTM owner, so its broad introductory no-book-life integration statement must be read per row. Generic XP, faculty development, actual executions, institutional title, body/heritage and rust policy answer different questions; no universal tier, decay or affinity meter follows. The later H7 partial receipt qualifies earlier open/no-match wording without proving all rival paths. Suggested pairings remain hypotheses; one contrasting world can validate several relevant seams without manufacturing a different world per test (AD51).

Keep table-top setting deferral and five marked sequencing approvals at their explicit scope. Old ranking scores, ‘none new’ seam shorthand, proposed institutions stubs and the anchor_snapshots suggestion do not override the actual continuation owner or current Klein/HP sequence. A retained per-world save, source-linked operation and useful ordinary-life journey each need their own consumer/evidence. The final preservation commits establish neither adoption nor all-source review; private excluded artifacts and unfinished evidence remain traceable. No runtime, current branch/remote verification, whole-source qualification or cleanup was performed.
