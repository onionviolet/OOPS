# Idea audit 2026-11-06, lane 1: Klein campaign and mechanism backlog

Read-only audit lane (sonnet), HEAD `3beb0857d`, dirty shared checkout. Part of [IDEA_AUDIT_2026-11-06](../IDEA_AUDIT_2026-11-06.md), which defines the classification words and evidence rows. Proposals only (AD32).

## Inputs read

- `LOTM_KLEIN_FULL_JOURNEY_PLAN.md`: lines 1-19 (KJ1-KJ8), 92-141 (SG1-SG7, VG1-VG6, LATER table), 142-215 (B0-B7, KJ3 mechanisms, layers, cross-cutting, verification), 216-412 (PF1-PF13, adoption path, trial logs, rounds 1-3, reset-seam pointer, B552 F1-F6). Lines 20-91 skimmed for IDs.
- `MECHANISM_BACKLOG.md`: all 172 lines (B1-B12, R1-R9, C1, U rows, G1-G17, arc 2-5 amendments, lanes L1-L6, rank list, B554). Long cells truncated at about 700-2800 characters.
- `KJ3AE_IMPLEMENTATION_RECEIPT.md`: all 79 lines. `IMPLEMENTATION_TRACKER.md`: all 90 lines.
- `LOTM_COMBAT_DEEP_DIVE_2026-11-03.md`: headings, section 10 (LCB1-LCB10), `LCB1_3_IMPLEMENTATION_RECEIPT.md`.
- `B2_B3_MORE_TO_CONSIDER_2026-11-03.md`: all. `DEPTH_DIAL_PROPOSAL.md`: headings, IB1-IB16 tables, Q-W1..Q-W34 first mentions, rounds 8, 10, 19, B566.
- `LOTM_KNOWLEDGE_PROTECTION_DESIGN.md`, `OWN_HOLDINGS_PLAN_2026-11-03.md`: all.
- `at15-fight-2026-11-06/CHECKPOINT.md`; AT15 and AT2 lines in `PROGRESS_ATLAS_2026-11-04.md` and `cross-world-run-2026-11-06/CHECKPOINT.md`. `PROJECT.md` lines 10-40.
- Code via grep and git log: `src/book_world_lotm_*.js`, `src/lotm_*_rows.js`, `src/inquiry.js`, `src/book_world_lotm_inquiry.js`, `scripts/playtest/native-continuation.mjs`, `scripts/lotm_slice/*`, the dirty tree.
- Not read: KJ3A-KJ3AD and B1-B9 receipts (only through the owners' summaries), private packs, `BOOK_ABSORPTION_WORKFLOW.md`.

## Ledger

**Plan: campaign table KJ1-KJ8 and B0-B7**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| KJ1 | Opening household, ch1-3 | Plan row KJ1 | FIRST_ARC receipt → lotm host, place acts | Agent-verified, 16 stages, desktop and persistence proof | Receipt claim only; pack is private and gitignored | done-floor | none |
| KJ2 | First excursion and gathering | Plan row KJ2 | KJ2 receipt → remote presence | 18 stages, earned-checkpoint proof | Same limit | done-floor | none |
| KJ3A-K | ch9 to ch24 P033, 78 stages | Plan row KJ3 | KJ3A-K receipts | Agent-verified, 14/21 px, persistence | Receipts not reread | done-floor | none |
| KJ3L-Z | ch24 to ch54 P079, 279 intents, 28 slices | Plan row KJ3 | KJ3L-Z receipts | Agent-verified | Not reread; no per-slice floor lines seen | unverified | A later audit reads the 15 receipts |
| KJ3AA-AD | ch55 to ch66 P047, 4 slices | Plan row KJ3 | Receipts → B4/B5/R1, B6/R9, C1 | Agent-verified | Receipts not reread; B4-B6 native use claimed in KJ3AA | unverified | none |
| KJ3AE | ch67 P001 to ch69 P082, 19 acts | KJ3AE receipt | Receipt → PROJECT focus | Native pass, money 807 to 684, import done | Pack and receipt only. Not run: full `npm test`, dist build, 14/21 px captures. No reload after import. Pool recorded, not asserted | done-below-floor | Newest KJ receipt; PROJECT line 19 matches it |
| KJ3 rest | ch70 onward to Tingen climax and departure (kjw22+) | KJ3AE "Next" | Plan row KJ3 | Start state specified: clock 19926, money 684, pool 3/0 | No kjw22 directory or receipt | ready | kjw22 from ch69 P082. Climax fights also need G17 |
| KJ3 open 1 | Redirected luck ritual not bound as a rite | KJ3AE open 1 | R5 → altar | Facts only | R5 binds only the proof `spirit-call` rite | blocked | R5 binding rows (G5 kit) |
| KJ3 open 2 | 600-minute Wednesday fill and 467-minute night unsourced | KJ3AE open 2 | Pack fill | Cost driver, no text covers it | Not checked | parked | Revisit if a source window covers them |
| KJ3 open 3 | Shared-pack B8 proof acts remain | KJ3AE open 3 | Pack | Proof acts stripped in proof copy | Pack is private | unverified | Strip or promote proof acts |
| KJ3 open 4 | Protection amulet craft needs a bound craft row and item | KJ3AE open 4 | R8 | Facts only | `charm` only in `lotm_craft_rows.js` and rite/summons rows; no `src/` consumer | blocked | R8 |
| KJ3 next | Make the B3 Spirit Vision glances native | KJ3AE "Next" | B3 | Allowed to dial 3 | B3 exists but no native route | ready | kjw22 |
| KJ4-KJ8 | Backlund, sea, later Backlund, forsaken lands, Utopia | Plan rows | Plan | Source-qualified, nothing started | No receipts, no packs | blocked | KJ3 departure state (B4) |
| B0 | Evidence lookup, not a repair project | B0 row | Repair receipt | Complete, 4,914 passing | Planning step | done-floor | none |
| B1 (plan) | Qualify the next contiguous KJ3 window | B1 row | KJ3 | Source-labelled chain | Done as KJ3A onward | done-floor | none |
| B2 (plan) | Implement that situation natively | B2 row | KJ3B | Done | Same | done-floor | none |
| B3 (plan) | Repeated packets through KJ3 | B3 row | KJ3C-AE | Each reaches floor before the next | 31 slices exist; first fight and employment not closed | ready | Remainder per KJ3 rest |
| B4 (plan) | KJ4-KJ8 in order | B4 row | KJ4-KJ8 | Connected first-novel route | None built | blocked | KJ3 departure |
| B5 (plan) | First ordinary-life pilot (local applicant, paid work, expense) | B5 row | WER, ST | Reopens after Klein-first, or on Weibao's instruction | Guard contract, positions, rent duty, collector and hired hands landed 11-06 (conflict C3) | stale-doc | Reconcile the row with the cross-world run |
| B6 (plan) | Procedural variation on that life | B6 row | Plan | Waits for the B5 consumer | Not built | parked | Trigger: a measured B5 consumer |
| B7 (plan) | Second distinct supported life | B7 row | Plan | After B5 and B6 | Not built | parked | After B5 and B6 |

**Plan: KJ3 mechanism table, SG, VG, BF**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| KJ3-M1 | Physical supply and gun custody (TD9) | KJ3 mechanisms row 1 | Item and custody → firearm fight | Gun and ammo custody must join native use first | `aac8d1188` puts the ready-stock seam under the B8 revolver. Tempo stock tests pass (47/47 in this run) | done-below-floor | Other resources migrate at first consumer |
| KJ3-M2 | Employment, terms, paid duty | row 2 | Pay and duties → payer | Needs counterparty, terms, payer, settlement | `book_world_lotm_pay.js`, `book_world_lotm_guard.js`, the saved duties domain and the rent duty exist. Guard contract not walked | done-below-floor | Native walk of the guard contract |
| KJ3-M3 | Inquiry, observation, report | row 3 | Inquiry → report | Source, finding, next action | `src/inquiry.js` exists. A LOTM consumer `src/book_world_lotm_inquiry.js` is uncommitted (dirty tree, 20:35 today) | in-progress | Another session finishing it |
| KJ3-M4 | Teaching, practice, advancement | row 4 | Advancement → Seq 8 and 7 | Teacher, material, capability result | `book_world_lotm_seq7.js` (Tingen seat, Klein Seq 7) and Sun rows (`1ec64ae02`) exist. No BE-seat Seq 8 | done-below-floor | See G2 and G9 |
| KJ3-M5 | First danger or fight | row 5 | Tempo fight → Tingen climax | Close the combat seam's gap | AT15 closed on a fixture route (see B8) | done-floor | none |
| SG1-SG7 | Saga horizon, connected situation, one player contract, budget | Plan SG block | Plan | Proposals under AD32 | Practice follows SG2, SG4, SG5. Not individually checked | unverified | none |
| VG1-VG6 | Volume entry, entry uses, checkpoint history | Plan VG block | Plan | Proposals | No volume preset or loader built | parked | Trigger: first later-volume start |
| VG-L1 | Edition-qualified volume map | VG LATER table | Plan | Luna low extraction | No such map | parked | When a selected situation needs source boundaries |
| VG-L2 | One later-volume native start preset | VG LATER table | Plan | Sol medium | Not built | parked | Qualified actors and first consumer |
| VG-L3 | Content loading and retention by volume | VG LATER table | Plan | Sol medium | Not built | parked | Measured startup or memory pressure |
| BF120-127 | Cross-cutting abstraction rounds | Plan "Cross-cutting uptake" | BOOK_WORLD_FEATURE_GAPS | ACCOUNT FOR NOW | Owner doc not in this lane | unverified | Lane 6 |

**Plan: PF1-PF13 flow proposals**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| PF1 | Qualify 3-5 situation episodes | PF table | Plan → KJ3C onward | Proposal | KJ3L-Z took 13-21 acts per window, so used in practice | stale-doc | Record as practice or leave as proposal |
| PF2 | Extract the continuation runner | PF table | Playtest tooling | Proposal, not dispatched | `scripts/playtest/native-continuation.mjs` exists and KJ3C used it | stale-doc | Doc is behind the code |
| PF3 | Fast loop, then one final gate | PF table | Process | Proposal | No code to check | unverified | none |
| PF4 | Cross-system impact table per episode | PF table | Process | Proposal | None | unverified | none |
| PF5 | "Continue to next decision" and fold controls | PF table | CA2-CA5 automation | Proposal needing runtime authorization | `grep fold` in `src/` hits only unrelated files; no fold command | needs-yes | Needs a go-ahead and a fold command |
| PF6 | Source and causal preflight | PF6 row | Process | ACCOUNT FOR NOW | Practice only | unverified | none |
| PF7 | Read-only fixture preflight | PF7 row | Tooling | Highest-value tooling candidate | `presence-preflight.py` is private. `scripts/lotm_slice/prescan.mjs` is in the repo | done-below-floor | Move the private script into `scripts/` if wanted |
| PF8 | Shared orchestration and capture seam | PF8 row | Tooling | Proposal | `native-continuation.mjs`, `gen-runner.mjs`, `receipt-fields.mjs` exist | done-below-floor | none |
| PF9 | Plan proof once | PF9 row | Process | Proposal | None | unverified | none |
| PF10 | One authoring owner, one receipt | PF10 row | Process | Proposal | None | unverified | none |
| PF11 | Source order versus civil time | PF11 row | Calendar | Later, at the first calendar consumer | Weekly rent and expense duties are now calendar consumers; no civil-time resolver found | parked | Trigger: first Sunday reply or payroll deadline |
| PF12 | Compact routines, keep distinctions | PF12 row | Activity rules | Promote at a second consumer | Not applicable yet | parked | Second consumer |
| PF13 | Spine-and-fill sweep as standard method | PF13 row | Sweep rows → KJ3E+ | Trial until the fold test passes | `kj-sweep-pilot` has ALIAS_TABLE.json, FOLD_TEST_RESULT.md and presence-preflight | blocked | Native fold test |
| PF13-fold | Native step versus fold test (AD47, queued) | Adoption path (2) | Fold test | Needs a fold command | No fold command; the proxy lost two facts and one time field out of five | blocked | Needs the fold command (PF5) |
| PF13-F1/F2 | Ingredient pack and cumulative alias table | Ledger rows | Reader inputs | Open before ch31 | `ALIAS_TABLE.json` exists; ch31 and ch32 windows have since run | stale-doc | Mark closed |
| PF13-F4/F5 | Flat IDs, offer-thread owner check | Ledger row | KJ3E | Unmapped residue | Not rechecked | unverified | none |
| PF13-D1 | AD47 decision rule (accepted "Yes, queue it") | Adoption path | AD47 | Accepted | Rule line only | done-floor | none |
| PF13-ledger | Presence column schema addition | Ledger row | Sweep schema | "Still to record" | Script private | unverified | none |
| R2a | Parallel the front, serial the back; lane contracts | Round 2 | Lanes | Proposal, three-lane trial | `kj-lanes-2026-11-02` exists; trial outcome not found | unverified | none |
| R3a | Arc, sub-arc, window levels; seam pass v1 ch32-54 | Round 3 | Seam pass | 183 of 184 locators valid | Private output exists. Pass for ch55-213 not recorded here | unverified | BOOK_ABSORPTION_WORKFLOW owns it |
| MTC-R1 | Fold by consequence, plants stay deep | Round 1 | Fold rule | ACCOUNT FOR NOW | No fold exists | blocked | PF5 |
| MTC-recap | Recap card and grounding line per fold | Round 1 LATER | UI | LATER | Not built | parked | After the fold test passes |
| Reset | Shared reset and retention seam (MoL side) | Plan "Shared reset" | `harm_loops.js` rows | Proposal; LOTM decides when it reads it | Not read in this lane | parked | Trigger: first source-qualified rollback |
| B552 | Campaign reconciliation F1-F6 | Plan end | Plan | 33 slices, 515 stages through KJ3AE | KJ3A-AE = 31 letters plus KJ1 and KJ2 = 33 slices | done-floor | Audit note, not an item |

**MECHANISM_BACKLOG: Tingen-era B rows**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| B1 | BE Seer chain: drink, stabilize, pool | Backlog B1 | `book_world_lotm_be_seer.js` → KJ3P+ | Merged, below floor, no native run, four suite failures need an owner | Code present. KJ3P passed 17 acts natively and later windows used it. Cross-world final gate `npm test` 5470/5471, the one failure a Math.random ratchet, fixed. `lotm_be_seat` passes in this run | stale-doc | Doc understates |
| B2 | Darkened eyes seen by Beyonder observers | Backlog B2 | `beSeerConditions` → observers | Merged, no receipt read | Code in `book_world_lotm_be_seer.js` | done-below-floor | none |
| B3 | Spirit Vision switch and exhaustion | Backlog B3 | `book_world_lotm_be_seer.js` → KJ3 | Below floor, 37 tests, no native run | Calibration comment, dial 3. KJ3AE confirms the glances are facts | done-below-floor | Make the glances native |
| B4 | Energy as a divination step cost | Backlog B4 | Divination method → KJ3AA | Below floor; first native use KJ3AA | Code present; native use per KJ3AA | done-below-floor | none |
| B5 | Method gate for divination means | Backlog B5 | Same | Same | Same | done-below-floor | none |
| B6 | Paid client session | Backlog B6 | `book_world_lotm_be_clients.js` → KJ3AA | "Not merged"; check:rules failed | `3026ee0bc` and `64a7e4824` are on master; KJ3AA used it | stale-doc | Update the row |
| B7 | Brewing for the BE seat | Backlog B7 | Content | Watch-only | No `src/` change needed | parked | Trigger: Weibao wants the player to brew |
| B8 | BE firearm rounds, aim, hit chance | Backlog B8 | `book_world_lotm_be_firearm.js` → tempo `shoot` | Below floor, no content act | AT15 closed at floor on a fixture route: proof opener vs an original hostile, won in 2 shots, rounds 6 to 4 kept across reload and Import. First canon gunfight (ch103 P054) not built. `lotm_firearms` passes | done-floor | G17 for canon fights |
| B9 | Overnight time refusal | Backlog B9 | `book_world_lotm_cast_host.js` `metByActs` | Fixed in `6717c38e7` | Code present; windows KJ3T-Y passed long acts. No named regression test found | done-below-floor | none |
| B10 | Cast rows cannot carry an energy effect | Backlog B10 | `installCast` | Fixed | `tests/lotm_cast_energy_act.test.js` (`5481d07a1`) exists, so "no dedicated regression" is stale | stale-doc | Update the row |
| B11 | Enroll Glacis and Hanass as persistent cast | Backlog B11 | `requiredPeople` | Route B (text roles); not built | No change | parked | Trigger: a window needs them on stage |
| B12 | Expense claim and funding | Backlog B12 | `book_world_lotm_duties.js` → Reports | Facts only; weekly claim exists since 11-06 | Duty and Reports line present (`aac8d1188`); payout and approval objects not built | done-below-floor | Payout scene |

**MECHANISM_BACKLOG: arc 2 rows (R, C, U)**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| R1 | Method gate and acting | Backlog R1 | Divination rows | Rows below floor; acting not built | Seq7 header says no Clown acting principle in the notes | done-below-floor | Acting half is G2 |
| C1 | Anna 12 pence, club eighth, Glacis, Joyce | Backlog C1 | `book_world_lotm_be_clients.js` | Below floor | `BE_GRAIN`, registry present; KJ3AC used Glacis and Joyce | done-below-floor | none |
| R2 | Halfpence and exact change | Backlog R2 | `currency_subunits.js` → be_clients | Implemented, real-Chrome run open | Code present | done-below-floor | Real-Chrome run |
| R3, U1 | Spirit Vision aura line | Backlog R3 | B3 | Queued after B1 | No aura reading line found | ready | After B3 is native |
| R4, U2 | Gathering display | Backlog R4 | Remote-meeting render | Queued | Not found | ready | none |
| R5, U3 | Wire rites and altar | Backlog R5 | `lotm_act_engine.js` | Below floor, one rite | `c62e0698a` merged. KJ3AE: only the proof `spirit-call` rite is bound | done-below-floor | Bind ch57 P022, ch60 P067 |
| R6 | Document clearance | Backlog R6 | `book_world_lotm_clearance.js` | Queued | Landed in `bb15d10db` (registered, displayed, fixture browser proof, below floor) | stale-doc | Update the row |
| R7 | Sealed Artifact area effect | Backlog R7 | none | Queued | No consumer found; old `lotm_artifact_use.test.js` covers Tingen use | ready | none |
| R8 | Amulet protection and decay | Backlog R8 | R5 | Queued | Craft rows exist, unwired | blocked | R5 bindings |
| R9 | Services sold and referral standing | Backlog R9 | `beClientView` | Implemented with B6 | Same as B6 | done-below-floor | Standalone referral view |

**MECHANISM_BACKLOG: G rows (arcs 3-5)**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| G1 | Skip or swap a fixed weekly slot | Backlog G1 | `constraint_store.js` | Queued | No owner | ready | none |
| G2 | BE-seat Seq 8 advancement | Backlog G2 | `lotm_advancement.js` | Queued | Tingen-seat Seq 7 exists; BE seat unverified | ready | Needs B1 merged and R1 |
| G3 | Pay line | Backlog G3 | `book_world_lotm_pay.js` | Below floor; no pack row yet | Code present; duty-line use not confirmed | done-below-floor | Pack row |
| G4 | Staged commissions | Backlog G4 | Same | Below floor; no Reports wiring | Same | done-below-floor | Reports wiring |
| G5 | Ritual kit and shopping | Backlog G5 | Rite kit | Queued | `book_world_lotm_kit.js` exists; BE-seat shopping gap per KJ3AE | ready | none |
| G6 | Investigation case state | Backlog G6 | New file | Design check only | Not built | needs-yes | Design check first |
| G7 | Messenger and whistle courier | Backlog G7 | `lotm_summons_rows.js` | Queued | Rows exist since 10-30; not wired to play | ready | After R5 |
| G8 | Divined notes that can be lost | Backlog G8 | Knowledge design | Queued | No note decay | ready | Design check first |
| G9 | Seq 8 Clown abilities | Backlog G9 | Abilities | Queued | Only id-level stages in the abilities module | ready | After G2 |
| G10 | Anonymous account and savings | Backlog G10 | New | Queued | No such owner | ready | After G3 and G4 |
| G11 | Household hire | Backlog G11 | `home_staff.js` | Unverified | `home_staff.js` exists. Hired hands (`4a6375369`) is the courtyard plot, not the BE seat | unverified | Grep reach first |
| G12 | Deferred priced terms at gathering | Backlog G12 | `gatherings.js` | Queued | Not found | blocked | R4 and U4 |
| G13 | Area sweep | Backlog G13 | `travel_legs.js` | Queued | Not found | blocked | G6 |
| G14 | Spirit form | Backlog G14 | Rite rows | Queued | Mentioned only in rows | blocked | R5 |
| G15 | Mediumship session | Backlog G15 | Rite rows | Queued | Rows exist, no session | blocked | R5, B5 |
| G16 | Vault requisition | Backlog G16 | Clearance | Queued | Clearance exists for records only | blocked | R6/R7 and B12 |
| G17 | Set-piece combat kit | Backlog G17 | Tempo | Queued, large | Not built; B8 and tempo stock now give the base | blocked | R8 and G9 |
| L1-L6 | Parallel lanes and 10-step rank | Build order | Planning | Proposal | Order overtaken by the cross-world run | stale-doc | Reconcile |
| M-U4 | Coins and fees on screen | Backlog U column | Exchange UI | Referenced | Not found as a row | unverified | none |

**IMPLEMENTATION_TRACKER**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| T-L1 | Lead-life opening | Tracker L1 | L1 receipt | Agent-verified | Receipt only | done-floor | UIA-R1 later-source gaps move to L7 |
| T-R1 | Rule-owner follow-through | Tracker R1 | R1 receipt | Complete | Receipt only | done-floor | none |
| T-L2a | Combat interaction | Tracker L2 | L2A receipt | Agent-verified, seeded | Receipt only | done-below-floor | Recheck on the integrated build |
| T-L2b | Combat health | Tracker L2 | L2B receipt | Done at floor 11-04, DEV SEEDED route | Receipt only | done-floor | none |
| T-L2c | Combat aftermath | Tracker L2 | Tracker | Not started | Nothing found | ready | none |
| T-L3 | Knowledge and return | Tracker L3 | Tracker | Queued | Conversation-knowledge foundation landed (`72a33f151`); lane not closed | ready | Define the remaining gap |
| T-L4 | School and general UI | Tracker L4 | Tracker | Queued | No lane commit found | ready | none |
| T-L5 | World access and saves | Tracker L5 | Tracker | Queued | None | ready | none |
| T-L6 | Progression, making, balance | Tracker L6 | Tracker | Queued | None | ready | none |
| T-L7 | Remaining interaction follow-through | Tracker L7 | Tracker | Queued | W11-D panel notes are uncommitted in the dirty tree (`tests/lotm_panel_gaps.test.js`) | in-progress | Another session |
| T-UF1-7 | UI feedback follow-through | Tracker UF table | Lanes L2-L7 | Routed | Not checked individually | unverified | none |

**LOTM_COMBAT_DEEP_DIVE**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| LCB1 | Calibration test file | section 10 | `tests/lotm_calibration.test.js` | Done | Present (LCB1-3 receipt, 14 focused pass) | done-below-floor | none |
| LCB2 | Re-base L1 to notches | section 10 | `book_world_lotm_bands.js` | Done | `referenceAdult:0`, `BAND_DIALS` present | done-below-floor | none |
| LCB3 | Pathway leans for 22 pathways, dated cast subjects | section 10 | Bands | Done | `PATHWAY_LEANS`, `LOTM_CAST_SUBJECTS` present | done-below-floor | none |
| LCB4 | Gate module (grade, category defence, bypass) | section 10 | none | Proposed | No gate module | ready | none |
| LCB5 | Ability and item notches | section 10 | Abilities | Proposed | Not found | ready | none |
| LCB6 | Window record with five refusals | section 10 | `fightWindow` | Proposed | Simple `fightWindow` exists; full record does not | ready | none |
| LCB7 | Shown versus believed wiring | section 10 | Cast reveal | Proposed | Not found | ready | none |
| LCB8 | Tempo adapter | section 10 | `tempo_fight.js` | Proposed, large | Notch contest (FD2) and stock shots (FD3) exist; whether they absorb LCB8 is unchecked | unverified | none |
| LCB9 | Late-source anchors | section 10 | Bands | Proposed | Not done | ready | none |
| LCB10 | Grade 3+ bands | section 10 | Bands | Add per scene | By design | parked | Trigger: first scene that needs it |

**B2_B3_MORE_TO_CONSIDER**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| X1 | Pathway-keyed ids for a second pathway | ACCOUNT FOR NOW | `be_seer` | Name the shape | `STAGE` map covers the hostiles, not the lead seat | ready | none |
| X2 | Residue as one shape | Doc | Abilities | Exhaustion as an instance | B3 exhaustion exists | done-below-floor | none |
| D1 | Bands by tier or on demand | Doc | Bands | Proposed | Partly done through LCB3 | done-below-floor | none |
| D2 | Exhaustion length | Doc | B3 | 240 min | Calibration receipt changed it to a dial of 3 | stale-doc | Doc predates the calibration |
| O1 | Potion making | Doc and B470 | Pathway factory | Digestion consumer exists | Source existence corrected by B470 | stale-doc | Fidelity questions remain |
| O2 | Use-based development | Doc | Faculty development | Reuse existing seams | Not built | ready | none |
| R1d | Cast fights need stat bases | Doc | Bands | Highest consequence | LCB1-3 provide it for hostiles and 3 named people | done-below-floor | none |
| R2d | Drink failure card | Doc | Content | Proposed | Not built | ready | none |
| L1-L3 | LATER items (band table, digestion, failure card) | Doc | Planning | Not dispatched | L1 done as LCB3; L2 and L3 open | ready | none |

**DEPTH_DIAL_PROPOSAL**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| IB1 | Depth by arc | IB1 | Planning | Proposal | Practice only | unverified | none |
| IB2, IB3 | Case bar and slot primitive | Bank rows | `progress` effect, `keyed_generation.js`, `canon_pull.js` | Proposal | `canon_pull_host.js` exists; slot slice not built | ready | none |
| IB4, IB5 | Variance only in unstated quantities; skill-gated menus | Bank rows | AD49, USER_VISION | Proposal | USER_VISION records the variance direction (B566) | ready | none |
| IB6, IB7 | Anchor band column; skill intake | Bank rows | SLC120, SLR | Proposal | SLC120 row incorporates the column (B566) | ready | Two-skill walk-through |
| IB8 | AD33 in tiers | Bank row | AD33 | Proposal | Owner not edited | needs-yes | Owner restates |
| IB9, IB10 | Investigation bar; life activity palette | Bank rows | Slot slice | Proposal | Not built | parked | Write only when a world needs it |
| IB11, IB12 | Clown as the next Sequence; Nighthawk wage line | Bank rows | R1; ECC25 | Proposal | R2 exists; wage line is G3 | stale-doc | IB12 partly done |
| IB13-IB16 | Reader-gated clues, partial reads, counter-reads, perception family | Round 18 | Observation seam | Proposals | Not built | ready | none |
| Q-W1-6 | A5 depth, A2 start order, first-battle depth, cuts, budget | Round 7 | Planning | Open | Superseded by what was built | stale-doc | Do not reopen |
| Q-W7-9 | Variance scope, order after R1, slot palette doc | Round 9 | Planning | Open | USER_VISION records the variance line | stale-doc | Do not reopen |
| Q-W10-15 | USER_VISION record, canon key, slot check, first consumer | Rounds 10-11 | Planning | Open | Q-W10 recorded (B566); Q-W11 superseded by F20 | stale-doc | none |
| Q-W16-20 | Dive order, carry-with-decay, anchor failure, intake path | Rounds 12-13 | Planning | Open | Carry-with-decay retired (B566) | contradicted | B566 retirement |
| Q-W21-24 | Skill stores, SLC columns, inspector row | Rounds 14-15 | SLC37/42/120 | Open | Stores decided; columns incorporated | stale-doc | none |
| Q-W25-28 | Spirit Vision faculty, NPC tables | Rounds 16-17 | B3 | Open | B3 built without a faculty | needs-yes | Faculty extension |
| Q-W29-32 | Spirit Vision shape and perception bank | Round 18 | B3 | Open | Not decided | needs-yes | none |
| Q-W33, 34 | Merge B2 and B3 as built; use as built | Round 19 | B2, B3 | Default yes | Merged; KJ3AC used B3 at the dial | stale-doc | Answered by events |
| DD-L2 | Extension: faculty, drain, costed deep reads, KJ3Z replay | Round 19 LATER 2 | B3 | Not dispatched | Not built | ready | Needs a decision |

**LOTM_KNOWLEDGE_PROTECTION_DESIGN**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| KP1 | Protected ordinary reading plus supported deeper exposure (recommended default) | Recommendation | Hazardous-reading consumer | Proposal | No knowledge-protection code in `src/` | needs-yes | Needs a hazard consumer and a go-ahead |
| KP2, KP3 | No protection; universal immunity (alternatives) | Option table | Same | Alternatives | None | parked | Only if selected as a branch |
| KP4-KP5 | Isolate, mediate, contain; real costs | Doc | Same | Proposal | None | parked | Same trigger as KP1 |
| KP6 | Interface inspection versus diegetic exposure | Doc | Same | Proposal | None | parked | Same |
| KP7 | Future implementation contract | Doc | Same | ACCOUNT FOR NOW | None | parked | Same |

**OWN_HOLDINGS_PLAN** (LOTM side; lane 2 holds the HP receipts)

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| P1 | Registry reads live values | Parts table | `own_holdings.js` | Built 11-03 | Receipt only | done-below-floor | none |
| P2 | School and trade registers | Parts table | HP packs | Built, headless | Receipt only | done-below-floor | none |
| P3 | Gu and Shadow Slave lives | Parts table | Life packs | Built 11-04; academy and keeper Import timed out | Receipt only | done-below-floor | Diagnose the Import timeouts |
| P4 | Own vitals readout | Parts table | Life body state | LATER | Not built | parked | Own slice |

## Conflicts noticed

- **C1 (backlog vs code).** `MECHANISM_BACKLOG.md` B6 says "not merged", B10 says "no dedicated regression yet", R6 says "queued" and B1 says "no native run, four failures need an owner". Code and git say otherwise: B6 landed in `3026ee0bc`/`64a7e4824`; the B10 regression `tests/lotm_cast_energy_act.test.js` (`5481d07a1`) exists; R6 landed in `bb15d10db`; B1 had native runs from KJ3P on and the cross-world final gate was 5470/5471.
- **C2 (B8 and AT15 status).** `at15-fight-2026-11-06/CHECKPOINT.md` says below floor (T1, T2 not reached). The atlas and the cross-world checkpoint say AT15 was closed at floor on a fixture route (bundle `53a2a0ab`). Atlas line 102 still says "AT2 unchanged". The backlog B8 row still reads "below floor". The closure used a proof hostile, not the canon gunfight (ch103 P054).
- **C3 (B5 ordering).** The plan says the ordinary-life pilot reopens only after Klein-first (B4) or on an explicit instruction. Commits `62db5b4ae` (hired guard), `ef527872d` (positions) and `ddf67971e` (collector) put an ordinary sellsword life and civil positions into the build. USER_VISION's cross-world section (2026-11-06) records "lets work on these to completion" for the round 3 order; whether that covers B5 is a reading, not his words.
- **C4 (Klein's advancement).** Backlog G2 and G9 say BE-seat Seq 8 and Clown are queued. `book_world_lotm_seq7.js` (`1ec64ae02`, LG9) builds Klein's Seq 7 Magician on the Tingen advancement pack and notes the source has no Clown acting principle. Two different seats described as the same advancement.
- **C5 (KJ3AE vs B3 and PROJECT).** KJ3AE says B3 repeat use is allowed and the glances should be made native; the backlog B3 row says no native run. PROJECT's endpoint (ch69 P082) matches KJ3AE, and no newer KJ receipt exists.

## Residue

- TD1-TD10 and the D2 dispatch block (plan lines 20-91) skimmed, not mapped (owned by the top-down contract docs).
- DEPTH_DIAL arcs A1-A6, S1-S8, F1-F28 and rounds 2-7 numeric picks: estimates, not planned items.
- Individual KJ3A-KJ3AD receipts not reread; their open questions are unmapped.
- BF120-BF127 and `BOOK_ABSORPTION_WORKFLOW.md` T1-T8 belong to other owners.
- U-rows U1-U4 beyond what R3, R4 and R5 name.
- `src/book_world_lotm_inquiry.js` and dirty-tree changes in `book_world_lotm_{domain,duties,host,ui}.js` are another session's uncommitted work; diffs not read beyond headers.

## Checks run

- `node --test tests/lotm_firearms.test.js tests/lotm_guard_contract.test.js tests/lotm_sun_pathway.test.js tests/lotm_be_seat.test.js tests/tempo_stock.test.js`: 47 pass, 0 fail (B8 odds including fog, guard contract, Sun pathway, BE seat, tempo stock on the current tree).
- `git log` for `src/book_world_lotm*` plus per-file last-commit checks (decided B6, B10, R6, G3/G4 and the Sun/Seq 7 rows).
- `ls` on the dispatch folder: no receipt newer than KJ3AE. No `kjw22*` directory in the private LOTM folder.
- `grep` of `src/` for fold, knowledge protection, deposit, requisition, spirit form, case state and note decay (decided PF5, KP1, G6, G8, G10, G14, G16).
- `git status`: the dirty tree includes uncommitted LOTM files and `tests/lotm_panel_gaps.test.js` (W11-D).
