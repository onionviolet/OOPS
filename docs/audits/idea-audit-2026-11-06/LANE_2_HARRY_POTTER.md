# Idea audit 2026-11-06, lane 2: Harry Potter developer route and holdings

Read-only audit lane (sonnet), HEAD `3beb0857d`, dirty shared checkout. Part of [IDEA_AUDIT_2026-11-06](../IDEA_AUDIT_2026-11-06.md). Classification vocabulary and evidence rows are defined there. Proposals only (AD32); nothing here changes priority.

## Inputs read

- `docs/gm/dispatch/refinement-audits-2026-10-31/HP_WHOLE_WORLD_PLAN_2026-11-03.md`: lines 1-133, in full.
- `HP_LEAD_RUN_START_2026-11-03.md`: lines 1-86, in full.
- `HP_UI_ENGINE_PLAN.md`: lines 1-130. Structure and tables, B1-B5, I1-I3, the FN uptake and the B183 reconciliation. The long F1-F4 and LR2/LR3 prose was skimmed.
- Receipts in the same folder: G1, G1B, G2, G3 note, the hp1c011 repair, review fixes A and B, O1/O2, and P1-P3 in full; window receipts W1-W4 for status, gaps and open lines.
- `OWN_HOLDINGS_PLAN_2026-11-03.md`: lines 1-53 (tail partly truncated).
- `docs/worlds/harry-potter/WORLD_BRIEF.md`: headings plus lines 78-135; `SOURCE_LEDGER.md` by size only.
- `docs/gm/dispatch/cross-world-run-2026-11-06/CHECKPOINT.md`: lines 1-147, in full.
- `docs/audits/LARGER_FOUNDATIONS_2026-11-06.md`: the HG1-HG6 and HP rows only.
- Code, read in full unless noted: `src/book_world_hp_{lead_domain,lead_ui,lead_pack,facts,lessons,positions,school_calendar,duties}.js`, `src/lesson.js`, `src/world_packs/book_hp_lead_life_data.js` lines 36-95, `src/book_world_beginning_registration.js` (grep), `src/simulation.js` line 141.
- Private data on disk: `private_packs/hp-cast/cast.json` (act list, locations, relocations); shard headers `hp{1..7}c*_header.json` (counts; grade, lint and spotChecked for hp1c007/009/013/015/017).

## Ledger

### HP_WHOLE_WORLD_PLAN: book 1 windows

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| W1 | Zoo Saturday, hp1c001 ch2 | plan L35, `HP_WINDOW1_RECEIPT` | `private_packs/hp-cast/cast.json` + `book_world_hp_lead_pack.js` → `hp` panel (`book_world_hp_lead_ui.js`) | Done, agent-verified; 8/8 acts, reload and Import match | Loader and panel in `src/`; cast has 56 acts for W1-W4; start offered at `book_world_beginning_registration.js:22`; `hp_lead_life` focused run passes. Receipt: isolated build, native 8/8, persistence. Content is private (gitignored), not re-walked at HEAD | done-floor | Receipt gaps stand: not human-reviewed, tracked dist not rebuilt then. Replay at HEAD not run |
| W2 | Letters, hp1c003 ch3 (23 scenes, 15 acts) | plan L36 | same | Done, agent-verified | Receipt: native 15/15 acts, reload and Import match. Clock labels unproven, no delivery owner | done-floor | Open: multi-week gap clock (receipt O2) |
| W3 | Keeper of keys, ch4 (12 acts) | plan L37 | same | Done, agent-verified | Receipt: native 12/12, 3 locked rows | done-floor | none beyond receipt gaps |
| W4 | Diagon Alley, vault, wand (21 acts) | plan L38 | same + `coin_ladder.js` + holdings readers | Done, agent-verified | `coin_ladder.js` tracked; cast's last act relocates the player to `book.hp.lead.homebound` and carries wand, owl and purse forward. Receipt native, persistence match | done-floor | See conflict C1: what follows W4 |
| W5 | Platform and train, hp1c005 ch6 | plan L39 | `arrive_school` stub (`book_hp_lead_life_data.js:54`) + `book_world_hp_school_calendar.js` → `hpSchoolRoute` in HP panel | Proposed | Code exists since 33ffbf7e0 / f040b2b97: a single "Take the train to Hogwarts · 8 h" command, enabled on day 32 (1 Sept), plus the G5 calendar. It is an authored stub. No ch6 scene content, and no `hp-lead-w5` pack exists. The stub is not reachable from the cast chain end (C1) | stale-doc | Plan row should say G5 calendar and stub arrival built (below floor), ch6 window not built |
| W6 | Sorting, first days, potions master (hp1c007) | plan L40 | `sorting` command + `hpLeadSchoolLocked` → HP panel "road to Hogwarts" section | Proposed | Code exists: one-shot Sorting that sets `hp.lead.house`=gryffindor, with 3 locked "Not how it happened" rows (`book_hp_lead_life_data.js:59-67`); `lesson_potions` exists. None of it is from hp1c007 scenes. Panel renders locked rows | stale-doc | Plan says Proposed while a stub Sorting and Potions exist. Real hp1c007 window still unbuilt |
| W7 | Flying, duel, Halloween, house points, troll (hp1c009) | plan L41 | none | Proposed | No flying, duel, Halloween or troll code. `book_world_hp_positions.js` says house points are not derived (no owner holds a count) | ready | Shard hp1c009 is on disk (B, lint pass, spotChecked 0). Uses the Merit shape for points |
| W8 | Quidditch, mirror, library (hp1c011) | plan L42 | none | Proposed; blocker cleared | No code. Repair receipt: lint pass, grade B; hp1c011 header was not re-read | ready | Semantic read of the source is the remaining question, per plan |
| W9 | Stone, egg, forest detention (hp1c013) | plan L43 | none | Proposed; may split | No code; shard header B/pass | ready | Split decided on opening |
| W10 | Trapdoor to term end (hp1c015-017) | plan L44 | none | Proposed | No code; headers B/pass | ready | none |

### HP_WHOLE_WORLD_PLAN: gaps, books 2-7, reconciliation

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| G3 (placed) | Prologue and ten-year skip: narration grain | plan L52, `HP_G3_NARRATION_NOTE` | knowledge `basis`, act `participants` → leak regex in W1-W4 runners | "Settle before W3"; note is a proposal | Applied in W1-W4 receipts (leak check each window); pack loader enforces the participants rule (`validateHpLeadCast` 'knowledge-holder') | done-floor | Note still headed "proposal"; the default is in use |
| G3 dial | Spectator-seat narration card for chapter 1 | G3 note | none | Dial, "Not built" | No code found | parked | Trigger: a later lane under LSD199 |
| G1b/O5 | Only 4 places and 4 people mapped in crosswalk | plan L53 | `build_crosswalk.mjs` | Default: builder maps ids it touches | Receipt: 26 touched ids, 0 mapped, 26 proposed `new:`; later W1-W4 pack mappings cover touched ids only | in-progress | Per window as touched. Not a standalone job |
| G1b/O3 | Thin cast | plan L53 | cast pack | Residue | Not checked beyond receipts | unverified | Cast depth was out of scope for this lane |
| G1b/O4 | Canon names in tracked HP files (CLR3 residue) | plan L53; `HP_REVIEW_FIX_B` | `book_hp_lead_life_data.js` | Cleanup before a commit; fix B neutralised display strings | Regression: `grep -ci "hogwarts\|gryffindor\|sorting hat\|harry"` gives 13 in `book_hp_lead_life_data.js`, plus 2 in `book_world_hp_lessons.js`, 4 in `book_world_hp_positions.js`, 2 in `book_world_hp_lead_ui.js`. `book_world_beginning_registration.js:22` carries "Harry Potter" | contradicted | By CLR3 (`LEAD_LIFE_RULES.md:95`): see C2 |
| P4 | Own vitals readout (plan "Own vitals") | plan L54; `OWN_HOLDINGS_PLAN` P4 | `book_world_hp_lead_domain.js:63` | After P2/P3, own slice | Body text is static ("not the Village hero's sheet"); no vitals reader | ready | P2 and P3 are built, so the stated ordering trigger has passed |
| Bk2 | Repeating year, hidden threat | plan L61 | none | Pressure to be checked against shards | 17 scene shards and 17 headers on disk (plan says ~18) | parked | Trigger: sizing pass once W5 is through the school gates |
| Bk3 | Outside agent hunting a person | plan L62 | none | same | 19 shards (matches) | parked | same |
| Bk4 | Tournament, public scoring | plan L63 | none | same | 32 shards (plan ~34) | parked | same |
| Bk5 | Institution turning on him, exams | plan L64 | none | same | 38 (matches) | parked | same |
| Bk6 | Second teacher, private hunt | plan L65 | none | same | 30 (matches) | parked | same |
| Bk7 | Leaving school, long hunt | plan L66 | none | same | 34 (matches) | parked | same |
| Recon | W1-W4 and "Proposed" lines | plan L71-80 | n/a | W5-W10 plans | W5-W6 now partly built (see rows above) | stale-doc | Plan not updated after 33ffbf7e0 / 61b3d9238. Plan was last committed on 2026-11-04 |
| MTC | "More to consider" ACT NOW / ACCOUNT items | plan L82-94 | n/a | Park P2/P3, split by scene order, G3 before W3 | Done as recorded (P2 and P3 built; W2/W3 split by locator; G3 note exists) | done-below-floor | LATER items: spot-check one scene per shard (unmet), books 2-7 sizing (unmet) |
| B100-B102 | Reconciliation paragraphs | plan L97-133 | n/a | Qualifications | Read; they qualify W1-W4 proof scope. They do not add planned items | duplicate | Restatement of receipts; no new row |

### HP_LEAD_RUN_START gaps G1-G12

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| G1 | Pipeline portability (gen-runner, native-continuation, cast compiler) | start L40; `HP_G1_PORTABILITY_RECEIPT` | `scripts/lotm_slice/gen-runner.mjs`, `scripts/playtest/native-continuation.mjs`, `scripts/lead_run/build_cast_pack.mjs` → W1-W4 runners | ACT NOW; done per receipt | Scripts exist; the HP windows ran through them natively (W1-W4 receipts). Receipt notes the `lastOk` hand edit is not generator output | done-floor | none |
| G1b | HP crosswalk builder | start L26; receipt | `build_crosswalk.mjs` | Missing; fixed | Receipt a-d; later windows use it | done-below-floor | Real CLI write of `crosswalk.json` for HP not run (receipt open) |
| G2 | Harry as a new lead profile | start L41; `HP_G2_PROFILE_RECEIPT` | `book_hp_lead_life.js` → beginnings list | ACT NOW; below floor at G2 time | Pack registered via the second list; start offered; `hp_lead_life` passes (28/28 across 5 files); W1 receipt later closed panel and start wiring | done-floor | The G2 receipt itself says below floor; superseded by W1 |
| G4 | Accidental magic as a free act | start L43; W1 receipt | W1 act, source with no method | ACT NOW | W1 receipt: free act with no method or cost | done-floor | none |
| G5 | School-year calendar | start L44; plan W5 | `book_world_hp_school_calendar.js` → `hpDutyActive`, Reports Now note, lessons | ACCOUNT FOR NOW; first needed at the train | Built: 1 Sept = day 32; other dates "authored proposals". `hp_school_calendar` focused tests pass. Countdown seen natively (checkpoint wave 2) | done-floor | Holiday and term-end dates are proposals, not source |
| G6 | Individually distinct wand | start L45; W4 receipt | W4 cast items | LATER, "window 3" | Moved to W4 and done there (B102 notes the outdated "window 3") | done-floor | none |
| G7 | Separate purses | start L46; W4 receipt | `coin_ladder.js`, `hpLeadHoldingsReaders` | ACCOUNT FOR NOW | Built W4; own-holdings P1/P2/P3 | done-floor | Vault and prices beyond the wand are fill |
| G8 | Fame as knowledge asymmetry | start L47; G3 note | NPC-side knowledge store | ACCOUNT FOR NOW | W4: NPC holder store with load-time guard and back-test | done-floor | NPC-to-NPC rumor not built (receipt) |
| G9 | Sorting with locked alternative | start L48; plan W6 | `sorting` + `hpLeadSchoolLocked` → HP panel | LATER | Built as a stub (commit 33ffbf7e0); not walked | done-below-floor | Not natively walked (checkpoint "Not walked": Harry's school route) |
| G10 | Owl post as delivery | start L49; W2/W3 receipts | none | LATER; receiving side only | No delivery owner; LARGER_FOUNDATIONS names it HG6 | blocked | Blocker: a delivery owner (LSD446 lane) not yet built |
| G11 | Cast depth tiers | start L50 | cast tiers | ACCOUNT FOR NOW | Dursleys full; others thin or labels only (G2 receipt) | done-below-floor | none |
| G12 | Speaking with animals | start L51; W1 receipt | W1 act | ACCOUNT FOR NOW | "You could have sworn", no skill assumed | done-floor | none |
| Open1 | Grade check of other eight book-1 shards | start L63 | headers | Cheap and local | hp1c007/009/013/015/017 headers: B, pass, spotChecked 0 | done-floor | none |
| Open2 | Who writes | start L64 | process | Sonnet implementer + content builder | Process note, no artifact | duplicate | Superseded by the actual W1-W4 execution |

### HP_G1B / G2 / review-fix receipts

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| G1b/Open | Persona alias for Harry (no lead id for `hp`) | `HP_G1B_CROSSWALK_RECEIPT` Open | `build_crosswalk.mjs` | Unresolved | Not checked in code | unverified | `pov: lead` works per receipt |
| G2/hook | `registerHpLeadDomain` wired | `HP_G2` Decisions | `book_world_beginning_registration.js:20` | Not wired at G2 | Now wired, guarded against double registration | done-floor | stale only in G2 text; fixed by W1 |
| RF-A.F1-F6 | Review fixes A (id parsing, idempotence, warn, empty-district refusal) | `HP_REVIEW_FIXES_A_RECEIPT` | `hp_life_holdings.js`, `world_look.js`, `book_world_hp_lead_pack.js`, `build_cast_pack.mjs` | Focused 39/39 | Files present, committed in dc5f00240; no rebuild or browser | done-below-floor | Gap: second registration after a portless first keeps first ports |
| RF-B | Canon names out of lead stub | `HP_REVIEW_FIX_B_RECEIPT` | `book_hp_lead_life_data.js` | Display names neutralised | Undone by later commits (C2) | contradicted | Id slugs `vernon`, `petunia`, `dudley`, `cupboard` still need a migration decision |
| HC011 | hp1c011 structural repair | `HP_HP1C011_REPAIR_RECEIPT` | gitignored shard files | Lint pass, grade B | Lint not re-run. Receipt records `.bak-20261103` copies and an unchanged source hash | done-below-floor | Plain-variant zh rows and a human read remain |

### OWN_HOLDINGS_PLAN and holdings receipts

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| O1 | Shell showed the native hero's purse, items and stats in other lives | `HP_O1_O2_RECEIPT` | `src/own_holdings.js`, `world_look.js`, `display.js` | Fixed | Files present, tracked, `display.js:1390` and `world_look.js:43` call the view | done-floor | Layout not human-reviewed |
| O2 | Lead life calendar label, weekday | O1/O2 receipt | `hpCalendarBinding` in `book_world_hp_facts.js` | Fixed | Binding adds the lead life with a `showWeekday` flag; countdown seen natively in the checkpoint | done-floor | none |
| P1 | Live reader for the registry | `OWN_HOLDINGS_PLAN` P1; `HP_HOLDINGS_P1_RECEIPT` | `own_holdings.js` | Built | Present; checks 1-8 in receipt incl. native and persistence | done-floor | Installed app not run |
| P2 | School and trade readers | plan P2; P2 receipt | `src/hp_life_holdings.js` → `book_world_beginning_registration.js` | Built | Present; receipt shows native walk, reload and Import, trade sale | done-floor | Installed app and human review not run |
| P3 | Gu and Shadow Slave readers | plan P3; P3 receipt | `src/book_life_holdings.js` | Built for five lives | Present. Academy and keeper literal Import timed out in the harness; a no-op control timed out too (not diagnosed) | done-below-floor | Open: Import path of academy-at-start+1 and keeper-after-buy saves needs its own look |
| P4 | Own vitals readout | plan P4 | see P4 above | LATER | see P4 | ready | |

### HP_UI_ENGINE_PLAN (ordinary school and trade lives)

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| F1-F4 | Evidence and boundary statements | UI plan L9-15 | n/a | Reference | Not planned items | duplicate | No row beyond the others |
| Traj | Four horizons (early, middle, late, beyond) | UI plan L19-24 | n/a | Pressures, not coverage | Not checkable items | parked | Trigger: each LR row's consumer |
| LR2-H1 | Possession, affinity and usable means are distinct | UI plan L34 | W4 wand | Qualified evidence | Consumed by W4 (three timed states) | done-floor | none |
| LR2-H2 | Detected act does not imply identified caster or sanction | UI plan L35 | none | Reopen trigger | No code | parked | Trigger: a window with underage-magic detection (book 5/6) |
| LR2-H3 | Different binding mechanisms do not share one consent law | UI plan L36 | none | Reopen trigger | No code | parked | Trigger: book 4 / book 6 window |
| LR3-H1 | Food appearance vs summoning vs increase | UI plan L46 | none | Reopen trigger | No code | parked | Trigger: book 7 window |
| LR3-H2 | Dissemination authority after bearer lifecycle event | UI plan L47 | none | Reopen trigger | No code | parked | Trigger: book 7 window |
| UI-School | Choose and attend a lesson (Today/Work/Belongings/Reference) | UI plan L63-65 | `book_hp_life_data.js` commands; lead lessons in `book_world_hp_lessons.js` | Proposal | Lead panel is a single "household day" panel with Lessons section, not the four-section composition. Original school life lessons not re-checked | unverified | Composition vs panel not compared in this lane |
| UI-Learn | Learn, practise and use levitation or glass repair | UI plan L71-73 | `hpSpellRows`, `spell_seam` | Proposal | Both lives have the casting path in code. Not re-walked | unverified | none |
| UI-Brew | Choose ingredients and brew; acquire; dose | UI plan L79-81 | `hp_brewing_*.js` | Proposal | Files and `tests/hp_preparation.test.js` exist; not run | unverified | none |
| UI-People | Ask a tutor; noticed action creates obligation | UI plan L87-88 | brewing notices; broader enforcement | Proposal | Brewing notices exist; school detection not built | parked | Trigger: LR2-H2 |
| B1-B5 | Assessed repair UI and acceptance | UI plan L92-100; `hp-school-progression-2026-10-25/RECEIPT.md` | `src/world_packs/book_hp_school_extension.js` → Beginning panel | Dependency-ready brief | Extension source present. Receipt says "implemented-unverified in rebuilt native play" | done-below-floor | Journey: admission, pending, cancel, settle, Import not natively run |
| I1 | Reconcile N/T/K contracts with LOTM | UI plan L104 | coordinator | Integration request | Not checked | parked | Trigger: a shared-seam claim |
| I2 | Bind later mechanisms to exact source paragraph | UI plan L106 | process rule | Integration request | Process | duplicate | Same as the LR rows |
| I3 | Second term, school-to-brewing link, full trajectory | UI plan L108 | none | Open gates | No second term in the lead calendar; term ends day 329 | parked | Trigger: books 2+ |
| FN1/2/4 | Heard, understood, practised and instrument are separate (learning) | UI plan L118 | `hp_lessons`: heard (instruction), practised (power mastery) | Cross-world pressure | Lead lessons keep "learn" as an instruction fact and practice as a power refine | done-below-floor | Not walked (checkpoint) |
| FN3/4 | Brewing procedure vs input vs execution | UI plan L119 | `hp_brewing_*` | Pressure | Not checked | parked | |
| FN5 | Reputation vs capability vs permission | UI plan L120 | observer knowledge | Pressure | W4 NPC-side stores partly cover it | parked | |
| FN6 | Payer, supporter, worker, recipient | UI plan L121 | none | Pressure | No code | parked | |

### WORLD_BRIEF (ordinary lives, one row each)

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| D7 | First playable school and trade lives | `WORLD_BRIEF.md:107` | `book_hp_pack.js`, `book_hp_life_data.js` | Implemented; checkpoint | Tracked and used by P2 | done-below-floor | D7 checkpoint not re-read |
| E3 | Natural life selection | `WORLD_BRIEF.md:146` | `book_world_hp_content.js` `registerHpBeginnings` | Implemented | `registerHpBeginnings` still called (`book_world_beginning_registration.js:17`) | done-below-floor | none |
| X4 | Assessed repair continuation | `WORLD_BRIEF.md:188` | school extension | Source candidate | = B1-B5 | duplicate | B1-B5 |

### Cross-world checkpoint: HP slice (waves 2, 9, 10)

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| HG1 | School-year calendar for the lead life | CHECKPOINT L37, L73; LARGER_FOUNDATIONS L145 | `book_world_hp_school_calendar.js` → Reports Now note via `registerLocalClockSource` | Done, countdown walked | `schoolYearText` wired in `book_world_hp_lead_domain.js:57`; focused 28/28 | done-floor | none |
| HG2 | Houses and points | LARGER_FOUNDATIONS L132, L145 | `book_world_hp_positions.js` | House row built, points not | House row (pupil + house) exists. Points: none ("no owner holds a count") | in-progress | Points half is W7's row; classed with W7 |
| HG3 | Spell rows | LARGER_FOUNDATIONS L132 | `HP_SPELL_ROWS` in `book_world_hp_lessons.js` | Built | One row (levitation); a status line shows in the HP panel | done-below-floor | Not walked |
| Duty | HP class slot as FD8's second world | CHECKPOINT L73 | `book_world_hp_duties.js` `registerDutySet('hp')` | "Fixture-only until W5 sets atSchool" | `arrive_school` now sets `hp.lead.atSchool`; duty active in term via `hpDutyActive` | stale-doc | Checkpoint wave 2 line is outdated; the 33ffbf7e0 commit changed it |
| Road | Take the train on 1 Sept, be Sorted, become pupil with house | `33ffbf7e0`; CHECKPOINT L117 | `hpSchoolRoute` → HP panel section | below floor | Tests pass (`hp_arrival` 5 tests). In the cast chain the command is ineligible after W4 (C1) | done-below-floor | Unwalked; see C1 |
| Pos | Pupil and house position rows | `33ffbf7e0`; `hp_positions` tests | `hpPositions` → Reports Now note, HP panel line | below floor | The position line appears in Reports Now (`book_world_hp_lead_domain.js:57`) | done-below-floor | none |
| Soc | Hogwarts society sheet | `33ffbf7e0` | `src/world_society_sheet.js` row, `scripts/world_society_sheet_report.mjs` | Authored positions, law as palette (coverage 3/3/1 of 7) | Row present in `world_society_sheet.js:24-27`; consumer is a report script only. No player surface | done-below-floor | Player-reachable: none |
| Les | First lessons through the lesson seam (Charms, levitation, Potions) | `61b3d9238`; CHECKPOINT L141 | `lesson.js` `lessonAvailability`, `book_world_hp_lessons.js` → HP panel "Lessons" | below floor, not walked | `hp_lessons` tests pass. Reachable only after arrival, Sorting and a Monday 09:00-11:00 term window; cannot be reached on the cast chain (C1) | done-below-floor | Walk after C1 resolves |
| 31d | The 31-day wait in play | `33ffbf7e0` message | shell time-skip | "not exercised" | Not run. Wait mechanism for the lead panel not found | unverified | none |

## Conflicts noticed

- **C1 (code vs plan: the playable chain does not reach school).** The real cast ends W4 at `book.hp.lead.homebound`; the only relocations to the cupboard are in W1 and W2 acts. `arrive_school` is bound to `location: cupboard` (`book_hp_lead_life_data.js:54`), and `simulation.js:141` then adds "Return to <cupboard id>". A scratch script loading the real cast at day 32 found the command eligible at the cupboard and ineligible at `homebound` ("Return to book.hp.lead.cupboard."). Tests use the stub life or a cast whose act is at the cupboard. No route back and no travel command were found, so the school route, Sorting, pupil and house rows, class slot and lessons look unreachable for a player who completes W1-W4. Inferred from the engine and the script, not from a native walk.
- **C2 (CLR3 and fix B vs later commits).** `LEAD_LIFE_RULES.md:95` (CLR3) says canon people, names and beats never land in tracked `src/` or `tests/`. Fix B neutralised the lead data file on 2026-11-04. Commits 33ffbf7e0 and 61b3d9238 put "Hogwarts", "Gryffindor", "Sorting Hat" and "Harry" back in four tracked `src/` files.
- **C3 (stale source comments after the school route landed).** `src/book_world_hp_positions.js` lines 1-4 ("no route reaches this row today"), `src/book_world_hp_duties.js` header ("nothing sets it yet") and `src/lesson.js` header (the lead life now uses the seam). LARGER_FOUNDATIONS RC10 flags the same header from the other side.
- **C4 (docs vs docs).** The cross-world checkpoint wave-2 table says the class duty is "fixture-only until W5 sets `hp.lead.atSchool`" and that gap weeks count as misses; commit 33ffbf7e0 set the fact in a stub and W5-B added `skipInactive`. The HP_LEAD_RUN_START "Window 1 content waits for G1b, G2..." paragraph and the G2 "not wired" line are also superseded (B102 says so).
- **C5 (plan counts vs shards on disk).** Book 2 about 18 and book 4 about 34 in the plan; headers on disk give 17 and 32. Books 3, 5, 6, 7 match. The plan marks the counts as approximate.

## Residue

- F1-F4 and LR2/LR3 prose in `HP_UI_ENGINE_PLAN.md` read by table only; the LR evidence windows were not traced into shards.
- W1-W4 scene-level correctness (act text against paragraphs) not audited; content is private and the receipts are the evidence.
- `OWN_HOLDINGS_PLAN` tail and `SOURCE_LEDGER.md` not read in full. `HP_POLYJUICE_AND_PERCEIVED_IDENTITY_CONSIDERATIONS_2026-11-03.md`, `HARRY_POTTER_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md` and `HP_LOTM_NEXT_PLAYABLE_FEATURE_2026-10-15.md` not opened; the Polyjuice doc may hold plan rows for this family.
- HG4 (Head of House, house points, troll, duel) and HG6 (owl post) are LARGER_FOUNDATIONS codes in lane 3; mapped here to W7 and G10 only.
- Window tests (`hp_lead_window1`-`3`) not run; the private cast was not re-validated against a rebuilt bundle.
- The Import timeouts in P3 A1 (academy, keeper) remain undiagnosed.

## Checks run

1. `node --test tests/hp_school_calendar.test.js tests/hp_lessons.test.js tests/hp_arrival.test.js tests/hp_positions.test.js tests/hp_lead_life.test.js`: 28 tests, 28 pass, 0 fail. Covers the calendar, lessons, route, positions and lead-life slices, not the native walk.
2. Scratch script `reach.mjs` (scratchpad, not in the repo) with `withHpLeadCast(packNative('book.hp.lead'), the real cast.json)`: at cupboard, day 32, `arrive_school` eligible; at homebound, day 32, ineligible with "Return to book.hp.lead.cupboard." Non-act commands present: `arrive_school`, `sorting`, `lesson_charms`, `charms_practice`, `lesson_potions`. The 56-act cast totals about 3,445 act-minutes (about 2.4 days), so about 29 more days of waiting precede day 32.
3. Greps that decided rows: `git log -- src/book_world_hp*` (hashes 33ffbf7e0 and 61b3d9238); `grep homebound src tests` no hit; canon-name counts per file as above; shard headers for hp1c007/009/013/015/017 show B, pass, spotChecked 0; shard counts per book 9, 17, 19, 32, 38, 30, 34; `git status` shows no HP `src/` file in the dirty tree.
