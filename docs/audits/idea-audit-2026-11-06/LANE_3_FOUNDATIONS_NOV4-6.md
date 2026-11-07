# Idea audit 2026-11-06, lane 3: foundation work of Nov 4-6

Read-only audit lane (sonnet). HEAD moved from `3beb0857d` to `b68e4c88d` during the lane. Part of [IDEA_AUDIT_2026-11-06](../IDEA_AUDIT_2026-11-06.md), which defines the classification words. Proposals only (AD32).

Abbreviations in "Checked": code = file at HEAD; test = focused test file present; walk = checkpoint plus bundle prefix; persist = save/reload/Export/Import round trip recorded.

## Inputs read

- `docs/audits/PROGRESS_ATLAS_2026-11-04.md`: all 138 lines (AT1-AT20 defined there; AT21-AT26 in the cross-world checkpoint).
- `docs/audits/LARGER_FOUNDATIONS_2026-11-06.md`: lines 1-444 (FD14-FD18, round 2 ledger, round 3 slices, U01-U15 table, round 4/4b OB1-OB12, RC1-RC13, M1-M6/G/O residue, delivery reconciliation at 399-444).
- Lane files by grep of headings and ID rows: `larger-foundations-2026-11-06/LANE_A..D.md`, `cross-world-foundations-2026-11-06/LANE_E..H.md`.
- `cross-world-run-2026-11-06/CHECKPOINT.md` (all 147 lines); `foundation-run-residue-2026-11-06/CHECKPOINT.md` (all); `foundation-consumers-2026-11-06/CHECKPOINT.md` (lines 1-110, resume and checks); `at15-fight-2026-11-06/CHECKPOINT.md` (all).
- `docs/reviews/FOUNDATION_WORLD_ENABLEMENT_PLAN_2026-11-04.md`: headings, P1-P12, C1-C7, M1-M8, M19-M26, L1-L4, lines 100-215.
- `docs/SEAM_REGISTER.md`, `docs/SYSTEMS_REGISTER.md` (top gaps).
- Code: `src/` greps and file existence for every module named below; commits `b68e4c88d` and `3beb0857d`.

## Ledger

**Atlas AT1-AT26**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| AT1 | B2-B5 "not merged" backlog wording | atlas :27 | MECHANISM_BACKLOG → agents | Fixed 11-05 | Backlog rows B2-B5 now say "merged to master, checked 2026-11-05" | done-floor (doc fix) | none |
| AT2 | B8 to floor plus combat | atlas :28 | B8 firearm → Tingen climax | B8 below floor, no native fight | AT15 closure (fixture route) supersedes; row never updated | stale-doc | Update row to point at AT15 |
| AT3 | Klein arcs 2-5 runway | atlas :29 | Klein plan | Probe rows, no packets | Lane 1 | unverified | Lane 1 |
| AT4 | Harry W5-W10 stalled | atlas :30 | HP plan | 3 HP commits vs 40 Klein | `33ffbf7e0`, `61b3d9238`: train, Sorting, pupil, house, Charms, Potions exist at HEAD | stale-doc | Refresh row |
| AT5 | Ordinary starts wait on Klein ending | atlas :32 | WER → B5-B7 | Deferred by direction | `62db5b4ae` adds a sellsword/night-watch life beside clerk and Beyonder (partial) | parked | Trigger: Weibao moves it |
| AT6 | Campaign content in private packs | atlas :33 | RP section | Delivery gap | Recorded state only | parked | Trigger: release state change |
| AT7 | Installed app not adopted since Luminous Gothic | atlas :34 | Tauri host | No recheck recorded | Tauri host landed (`4b4465412`, `b1845a61e`); installed app not inspected | in-progress | Lane 7 |
| AT8 | No human review | atlas :35 | AD42 | Optional play session | No recorded acceptance | needs-yes | Weibao's call |
| AT9 / AT9b | Native walk of FD6/9/10/8 consumers | atlas :95 | consumers CP → LOTM panel | Pass after panel fix `58699d84a` | code; test duties/ui; walk consumers CP bundles `7e9e19...`, `14de60...`; persist yes. `duties_domain.js` changed again in `b68e4c88d` after that walk | done-floor | Re-walk after OB1 changes |
| AT10 | Owed ledger lacks duty rows | atlas :96, :122 | `owed_ledger_sources.js` | Atlas :122 says "unchanged, still no duty rows" | Code lines 14-15 read duties projection; W3-B walk saw owed lines in Reports (bundle `0539216b`) | stale-doc | Fix atlas :122 |
| AT11 | 19 stale worktrees | atlas :97 | reconcile | 19 under `.claude/worktrees` | `git worktree list` shows 12 now | stale-doc | Owners decide the rest |
| AT12 | Shell comparison scripts untracked | atlas :100 | scripts/perf | Untracked | Still `??` at HEAD | in-progress | Owner commits or records |
| AT13 | FD6 and FD9 had no caller | atlas :98 | kit, host | Closed `df412bddb` | `book_world_lotm_kit.money` → `purseEffect`; `skyLine` in host; walk AT9 `7e9e19...` +720 pence, fog at night; persist yes | done-floor | none |
| AT14 | Civil-staff buttons missing | atlas :99 | lives | Not a defect | AT9 walk reproduced buttons after report act | done-floor | none |
| AT15 | Fight on shared substrate | atlas :116, :138 | `tempo_fight*`, `ready_stock` → LOTM slot | Closed at floor, fixture route | code `tempo_fight_domain.js`, `ready_stock.js`, `book_world_lotm_fight.js`; test `tempo_stock`, `tempo_host`; walk cross-world CP bundle `53a2a0ab`, repeated on `0539216b`, `7d3952bd`, `01eab058`; persist yes (6 to 4 kept) | done-floor (fixture route kj3z, not canon gunfight ch103) | Canon fight remains a content window |
| AT16 | Second-world consumers are HP's | atlas :117 | FD8/FD11 → HP | Waiting on G5 | `book_world_hp_duties.js`, `book_world_hp_lessons.js`, `book_world_hp_positions.js` exist; tests present; walk only the countdown | done-below-floor | Walk school route |
| AT17 | Persistent recurring people (FD4/B11) | atlas :118 | cast host | Not built | No wake-on-demand code; `castEnrollmentPeople` still eager/limit-based | ready | Scope before a window needs it |
| AT18 | Constraint packs LOTM-only | atlas :119 | constraint_store | Hypothetical | Importers: `lotm_cast_host`, `lotm_state`, `constraint_pack` only | parked | Trigger: second world adopts |
| AT19 | Cover/disguise owner (FD12) | atlas :120 | none | Missing | No module found; `persona_standing.js` exists | parked | Trigger: Clown face window or G9 |
| AT20 | Carried weight (FD13) | atlas :121 | none | Missing | No module found | parked | Trigger: a window needs weight |
| AT21 | Tempo melee stalemate | CW CP findings | `tempo_fight.js` | Closed wave 4, `stallActions` | code; test `tempo_stalemate`; walk none (no natural route); persist `lull` not in contract validator | done-below-floor | Calibrate when a weak-fighter route exists |
| AT22 | Post-fight view showed Notebook | CW CP | `tempo_fight_domain.js` | Closed wave 4 | walk bundle `0539216b`, place view returned | done-floor | none |
| AT23 | Away bank writes in any world | CW CP | `away_bank_domain` | Verified (tests) | test only; walk none | done-below-floor | Check banked time in LOTM life |
| AT24 | Positions rows in civil-staff life | CW CP | `book_world_lotm_host/merit` | Fixed, not walked in civil life | test `at24_positions_rows` | done-below-floor | Walk civil life |
| AT25 | Reports Now line stale after long step | CW CP | `reports_dock.js` | Data path fixed; timer unchecked | test; no browser timer check | done-below-floor | Browser check |
| AT26 | Frontier weather line in Klein digest | CW CP | `event_feed.js` | Closed wave 5 | test `digest_world_filter`; walk `7d3952bd`, digest clean | done-floor | none |

**Atlas FD1-FD13**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| FD1 | Time-refusal `freeMinutes` | atlas FD table | `constraint_store` → LOTM cast host | Done below floor | test `constraint_store`; AT9 walk: "FD1 not reached" | done-below-floor | Settlement move parked (AT18) |
| FD2 | Notch contest core | atlas | `notch_contest.js` (3 importers) → bands | Done below floor | test `notch_contest`; fight walks resolve shots by keyed draw vs chance, not shown to use the core | done-below-floor | Second world (HP W7) |
| FD3 | Ready stock | atlas, consumers CP | `ready_stock.js` (1 importer: firearm) → AT15 | Fixture-only | test `ready_stock`, `tempo_stock`; walk AT15 bundles; persist yes. Arrow shape and Frontier bow test-level only | done-floor (fixture route, one world) | Bow item and opener |
| FD4 | Persistent recurring people | atlas | = AT17 | Open | no code | duplicate (AT17) | see AT17 |
| FD5 | Practice to step | atlas | `countToStep` in `ready_stock.js` | Answered read-only | code present; only aim uses it | done-below-floor | none |
| FD6 | Purse and pay | atlas | `own_holdings.js` (8 importers; lotm 3, hp 2) | Corrected by AT13 | walk AT9 `7e9e19...`; persist yes | done-floor | none |
| FD7 | Walking inside a place | atlas | `travel_legs.js` (2 importers) | Done, Hogwarts not moved | walk consumers D (HEAD `958740e`, bundle `66a369...`); durations pass; "zero fare" rests on absent fare line; persist yes | done-floor (Tingen only) | Hogwarts walks |
| FD8 | Recurring duties | atlas, consumers CP | `recurring_duties.js` (2 importers), `duties_domain.js` (5) | AT9b pass | tests 6 files; walk AT9b `14de60...`; persist yes; HP set below floor | done-floor | HP second consumer walk |
| FD9 | World light | atlas | `world_light.js` (2 importers) | Corrected by AT13 | walk AT9 fog at night, none at noon; tempo reads fog via `fogMishap` (test only) | done-floor (status line) | Fight fog walk |
| FD10 | People sources | atlas | `people_sources.js` (4 importers) | HP source added | test; walk AT9 (HP pub from W4 export); observer-safety test | done-floor | none |
| FD11 | Lessons | atlas | `lesson.js` (4 importers) | Klein Neil act absent | test `lesson`; HP lessons exist; no walk | done-below-floor | Walk HP class |
| FD12 | Cover/disguise | atlas AT19 | none | Proposal | no module | duplicate (AT19) | see AT19 |
| FD13 | Carried weight | atlas AT20 | none | Proposal | no module | duplicate (AT20) | see AT20 |

**LARGER_FOUNDATIONS: ideas, defects, round 2 order**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| FD14 | Society sheet | LF :27, slice 8 | `world_society_sheet.js` → report script | Sheets for Tingen and Harry | code present; test 5/5; 0 `src/` importers, consumers are `scripts/world_society_sheet_report.mjs` and `tests/hp_positions` only; no walk; no state | done-below-floor (declaration plus printout by design) | Other worlds have no sheet |
| FD15 | Positions | LF :33, slice 3 | `positions.js` (7 importers) → LOTM, HP | term, resign, projections | see slice 3 row | done-below-floor | NPC use, discipline unwired |
| FD16 | Event director (one picker) | LF :49, slice 8 | none | Three layers | No unified picker; layers appear as separate modules (`world_events` 10 importers, `consequences` 2, `storylet_deck2` 1) | ready | Build merge or record as not wanted |
| FD3+ | Stock properties | LF :55 | `stock_kinds.js` (2 importers) | Silver and poison done | test `stock_properties`, `frontier_ammo`; loaded kind wording seen natively (`01eab058`); M1 not built | done-below-floor | Bow item and recipe |
| FD17 | Encounter frame extension | LF :59 | `tempo_fight*`, `tempo_starters` | Stalemate end, foe stock, robber, collector, guard | tests `tempo_*`, `collector_fight`; armed robber opener seen natively; collector/guard not walked; persist for robber fight only | done-below-floor | Walk collector fight |
| FD18 | Ability channels | LF :71, slice 7 | `channels.js` (4), `channel_map.js` (1) | Vocabulary plus log text | test `channels`, `tempo_channels`; walk could not open a Tingen skill tooltip; no executable ability effects | done-below-floor | LOTM ability lines |
| PW1 | LOTM potions beyond Seq 9 | LF :89 | `lotm_formula_rows.js` | 18 pathways missing | Sun 9-8 and Klein Seq 7 in `1ec64ae02` (tests); LG2 needs source reading | blocked (source reading for LG2) | Read sources |
| PW2 | LOTM abilities abstract | LF :90 | FD18 | Hand-built | 12 commands unchanged; channel tags exist | in-progress (W11-D own-power notes uncommitted, 3/3) | Commit by owner |
| PW3 | HP spells, classes, houses, timetable | LF :92 | HP lead | Gaps | HG1 calendar, houses, two lessons built; spells-as-data and house points not | done-below-floor | See HG rows |
| PW4 | MoL, paradise, primordial, Gu | LF :93, delivery :440 | none | Light pass only | No slice landed | ready | Inspect then slice |
| RD1 | `DEATH_CAUSES` lacks `loss_of_control` | LF :136 | `defeat_domain.js` | Defect | `defeat_domain.js:13` includes it; test 4/4 per CP; no producer | done-below-floor | Producer when needed |
| RD2 | Tempo reads only `dark` | LF :137 | tempo | Defect | `fogMishap` in `tempo_fight.js`; test `tempo_stock` 5-6 | done-below-floor | Fight fog walk |
| R2-1..6 | Round 2 revised order steps 1-6 | LF :141-148 | see slices | proposal order | 1 done (AT15), 2 done (positions), 3 done (HP calendar, houses), 4 partial (deck schema 2, consequences), 5 partial (channels), 6 partial (sheets) | done-below-floor | none |

**Round 3 implementation order, slices 1-8**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| S1 | AR17 hosts plus shared-panel slot | LF :201, delivery :405 | `native_tool_domains.js` (`neutralWritable`), `tempo_fight_domain.js` (`ENCOUNTER_SLOT`), `book_world_lotm_ui.js` | Tempo, away bank, digest, journal neutral; pledges not | test `tempo_host`; walk CW CP bundle `53a2a0ab` and later; persist yes. Pledges still raw; lane H G7-G10 unswitched | done-floor | AR17 text still a proposal (needs Weibao's yes) |
| S2 | Seam register | LF :202 | `scripts/seam_register.mjs`, `SEAM_REGISTER.md` | "`--check` current" | test `seam_register`; `--check` reports stale at HEAD; not wired into `check:rules` | stale-doc (delivery claim false now) | Regenerate with `--write` |
| S3 | Positions then groups | LF :203 | `positions.js`+`positions_domain.js`, `organizations.js`+`organizations_domain.js` (7 importers each) → LOTM clerk, probationer, guard; HP pupil, house; Market courtyard | term, resign, founding, dues, treasury, feast, lookout | tests `positions*`, `organizations*`, `lotm_guard_contract`; walk: civil clerk line only (CW CP wave 2), persist yes; probationer no persist; resign, founding, dues, guard not walked; saves `positions@1`, `organizations@1`, `lotm_guard@1` in SAVES 6g-6j | done-below-floor | Walk founding and guard |
| S4 | HP calendar and houses | LF :204 | `book_world_hp_school_calendar/duties/positions/lessons` | Countdown, train, Sorting, lessons | tests present; walk countdown bundle `b213f540` (predates `33ffbf7e0`, `61b3d9238`); persist yes for countdown; school route and 31-day wait not walked | done-below-floor | Walk school route; house points not built (`hp_positions.js:5`) |
| S5 | Inquiry | LF :205 | `inquiry.js` (2 importers), `inquiry_study.js`, `research_home.js` | Frontier lever write-up | test `inquiry` 14/14 per CP; no walk (MCP cannot reach craftsman); `inquiry@1` in SAVES 6f; Klein library and Harry study consumers not built | done-below-floor | Build named consumers |
| S6 | Livelihood stage records, rights, dues | LF :206 | `livelihoods.js` (3 importers), `hired_hands*.js`, `authority.js` (4) | Read-side stage records, hired hands, authority | tests; walk none; no Tingen garden or greenhouse; stage records are derived read views, not stage-clock stock | done-below-floor | Second-world producer |
| S7 | Skill and ability channels | LF :207 | `channels.js`, `social_contest.js` (1 importer: `trade.js`) | 16 channels, talk-price-down | tests `channels`, `social_contest`; walk could not open tooltip; shop button not walked | done-below-floor | Walk shop and tooltip |
| S8 | Event layers and society sheet | LF :208 | `consequences.js`, `heat.js`, `storylet_deck2.js`→`book_world_lotm_deck.js`, `world_society_sheet.js` | Owed lines, deck cards walked | tests `consequences`, `heat`, `tingen_deck`; walk owed lines `0539216b`, deck cards `01eab058` (digest); persist not recorded for deck | done-below-floor | Deck cards have flavour text without effects |

**U01-U15 coverage table**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| U01-U03 | Body/controller, anatomy, beginnings | LF :221-223 | other lanes | unrechecked / out of scope | Not rechecked | unverified | Other owner |
| U04 | Randomness dependency | LF :224, :367 | `seeded_streams` (26 importers) | Mostly met; ~28 cosmetic `Math.random` | Ratchet test `core_ratchets` exists; not rerun | done-below-floor | none |
| U05 | Away-time rule for duties/term | LF :225 | `away_ledger` | Gap; add to FD15/16 | OB4 behaviour in tests only (`b68e4c88d` waits for presence) | done-below-floor | Walk away run |
| U06 | Belief fence | LF :226, :371 | `known_target_facts.js` (2) | Gap | code in `simulation_effects.js`, `tempo_fight_domain.js`; test 4/4; rival wiring `1568691d5`; study writer wave 2; walk W6 "not reached" | done-below-floor | Recipe reaching Mara |
| U07-U12 | Learning, standing, economy, agency, consequences, travel | LF :227-233 | various | Covered or dependency | Not rechecked beyond slices | unverified | Other owner |
| U08 | Name standing store a position reads | LF :229 | FD15 | Add to FD15 | Not named in `positions.js` header (only `pay?`, `duties?`, `exit?`) | ready | Name store |
| U13 | Exit by death in FD15 | LF :234 | `positions.js` | Gap | `POSITION_EXIT_KINDS` = resign, dismissed, buy_out, transfer, desert; no death/killed | ready | Add exit kind |
| U14-U15 | Durable state, presentation | LF :235-236 | SAVES, panels | Covered by slices | Save rows 6e-6j present | done-below-floor | none |
| F1-F4 | Proposed edits to FD15/16/18 (U rows) | LF :238 | proposals | Draft | Not applied as accepted text | needs-yes | AD32 |

**Round 4 / 4b obligations**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| OB1 | Standing orders | LF :253, delivery :418 | `recurring_duties.js` POLICIES, `duties_domain.js`, `book_world_lotm_ui.js` select | Delivery: on time, late, skip, "walk"; part/dispute/bribe left | code now has `pay_part`, `dispute`, `bribe` (`b68e4c88d`); test `rent_duty`, `obligations_more` 22/22; walk W3 `f4a0ec5b`: select shown, two misses, persist yes; pay-on-time and pay-late are fixture-only (Klein has 1 penny); `hide_income`, `evade` marked GAP in code | stale-doc (delivery says part/dispute/bribe left; code has them, below floor) | Re-walk on a funded purse |
| OB2 | Escalation chain | :254, :419 | `recurring_duties.js` `planSeizure`, `book_world_lotm_collector.js`, `heat.js` | Notice, landlady (walk), collector at 3, fine at 4 (tests); seizure left | seizure at 6 missed weeks added in `b68e4c88d` but host seam `heldGoods/seizeGoods` absent (domain.js:48 comment), so nothing is taken; bounty and warrant not built | stale-doc plus done-below-floor | Host seam |
| OB3 | Heat per jurisdiction | :255, :420 | `heat.js` (3 importers), `heat@1` | Tests; few producers | tests `heat`, `heat_grades`; no walk; persist: SAVES 6g | done-below-floor | Audit discovery |
| OB4 | Idle never springs loss | :256, :421 | duties, positions | Tests, none left | tests; no away-time walk | done-below-floor | Walk |
| OB5 | Ownership compounds | :257, :422 | hired hands | Hired-hand income only | test `hired_hands`; appreciation/decay not built | done-below-floor | none yet |
| OB6 | Weekly money line | :258, :423 | `return_digest.js` `moneyLines` | Tests; not seen natively | test `digest_money_line`; no walk | done-below-floor | Walk Reports |
| OB7 | Delegation | :259, :424 | `hired_hands.js` (L1) | Hired hand | test; not walked | done-below-floor | Stewards later |
| OB8 | Authority with claim, knowledge, reach | :290, :425 | `authority.js`, `livelihoods.js`, `duties_domain.js` | Duties and rent do not consult it | `duties_domain.js:6,29` now call `authorityOver` (`b68e4c88d`); tests `authority`, `native_authority`, `obligations_more`; no walk | stale-doc (delivery line behind code) | Walk wilds vs town |
| OB9 | Knownness | :291, :426 | `authority.js` `registerKnownness` | Plot right, market sales; no LOTM readers | test; LOTM registers knownness in tests only | done-below-floor | LOTM readers |
| OB10 | Fight the authority | :292, :427 | `book_world_lotm_collector.js` | Turn collector away; heat after win | test `collector_fight`; not walked | done-below-floor | Walk collector fight |
| OB11 | Become the authority | :293, :428 | `organizations_domain.js` dues | Dues collected from members | test `organizations_dues`; not walked | done-below-floor | Outsider dues |
| OB12 | Automated income | :294, :429 | positions, hired hands | Wages, hired hands | tests; standing sale orders, rent you collect, loans not built | done-below-floor | none yet |
| OB-S1 | Round 4 "first slice" (Tingen rent, three policies, heat, weekly line, away run) | LF :284 | duties + heat + digest | Proposal | Rent walked (`f4a0ec5b`), heat tests, weekly line tests, away run not walked | done-below-floor | Walk away run |

**Reconciliation, remaining sources**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| RC1-RC2 | USER_VISION record, open question 7 | LF :308-309 | USER_VISION | Added | Not re-read | unverified | none |
| RC3 | AR17 as proposed rule | :310 | ARCHITECTURE_RULES, RULES_INDEX | Proposed, not standing | `ARCHITECTURE_RULES.md:60` and RULES_INDEX:51 still "proposed" | needs-yes | Weibao accepts or not |
| RC10 | `lesson.js` header says HP classes not built | :317 | `lesson.js:4-5` | Stale comment, carry forward | Header still says HP `lesson_charms` "does not use this seam yet"; `book_world_hp_lessons.js` imports `lesson.js` | stale-doc (source comment) | Edit comment on next touch |
| RC8-RC9 | Stale counts (`ability_ladders` 0, 4 pathways) | :315-316 | LF | Corrected | `ability_ladders` has 2 importers (UI) | done-floor (doc fix) | none |
| M1 | Batch/label identity | :336, :392 | `batch_identity.js` (1 importer) | Built; consumer unreached | `allocatedDoseRef` has no caller outside its test; test 5/5 per CP; no walk | done-below-floor (no play reader) | Wire consumer or regenerate golden |
| M2 | Care access record | :337 | `care_access.js` (1: `storylet_content.js`) | Fever healer | test; walk residue walk 1 (bundle `b213f540`): fever choice pass, persist yes | done-floor (one choice; rank and favor gates no consumer) | Provider side |
| M3 | Interrupted operation | :338 | `interrupted_operation.js` (1: `everyday_life.js`) | Craftsman interruption | walk 2 (bundle `f7f7555f`): pass, persist yes | done-floor | none |
| M4 | Copies, portraits, remote agents | :339 | none | No consumer | no code | blocked (no reachable consumer) | Consumer first |
| M5 | Checkpoint store | :340 | `continuation_state.js` | Exists; rewind Frontier-only | exists; `anchor_snapshots.js` 0 importers | parked | Trigger: another world's consumer |
| M6 | Loop `cause` and attempt identity | :341 | `harm_loops.js`, `continuation_state.js` | Built | tests; walk 2: Frontier cycle counted once, persist yes; MoL row not reached; `loop_table.js` readout not updated | done-floor (Frontier route only) | Zorian loop recipe |
| G1-G3, O-rows | Canon pull seam, rival record, hit location | :345-350 | `canon_pull*`, `rival_memory`, `tempo_location` | Built one-world; stale gap rows | `canon_pull_panel` 1 importer, `rival_memory` 2, in-play rival writer present (wave 2 lane G) | done-below-floor | Record-shape decision |
| O1-O13 | Unowned foundation-shaped rows | :391-396 | none | No first consumer, not verified | no code | ready | Weibao selects |
| MC5/U10 | NPC schedule fact | residue CP | `npc_schedule.js` (2) | Dormant | test 5; craftsman row reads `untimed` until `calendarMinute` reaches non-player contexts | done-below-floor | Wire `main.js` context |
| HZ | Cold/wet Poison-resistance facet | residue CP wave 2 | `hazard_resistance.js` | Reverted `3beb0857d` | file and test absent at HEAD; original Cold resistance skill owns exposure | contradicted (by the Cold resistance skill, per its own walk) | none |
| TH | Wave-2 findings F1 (enroll button), F3 (loop freeze) | residue CP | `simulation_ui.js`, `runner.mjs` | F1 fixed with test; F3 incomplete | W5 enroll button "not reached" in walk; F3 "partial" | done-below-floor | Recipe |

**Lane A (society, positions)**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| A-G1 | Position record with term/exit/history | A :220 | `positions.js` | Gap | exists (see S3) | done-below-floor | none |
| A-G2 | Rank inside an institution | A :221 | `faction_rank.js` | Gap | still region-based; no per-institution owner | ready | Design |
| A-G3 | Discipline and money-paying contracts | A :222 | `law_case.js`, `institution_store.js` | Gap | `law_case` 0 importers, `jurisdiction_rules` only imported by it; `institution_store.js:23` still forces `reward: 'contribution'`; guard contract bypasses it | ready | Wire first consumer |
| A-G4 | HP calendar plus house points | A :223 | HP | Gap | calendar built; house points explicitly not (`hp_positions.js:5`) | ready (points) | Build points |
| A-G5 | Palette wording, AT17, NPC depth | A :224 | AD46 | Gates | AT17 unbuilt | blocked (AT17) | see AT17 |
| A-M1..M13 | History line, credentials, secret positions, aging, succession, contract failure branches, etc. | A :232-244 | positions | Palette items | Exit records (history) exist; the rest absent | ready | Weibao picks |
| A-M14 | Coverage printout first | A :245 | `world_society_sheet_report.mjs` | LATER small | Built | done-below-floor | none |
| A-M15 | Name hygiene | A :246 | file names | ACT NOW | `world_society_sheet*` used | done-floor (naming) | none |

**Lane B (events)**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| B-F2 | Deck schema 2, off the Village | B :46 | `storylet_deck2.js` | Locked to Village | Tingen deck built on schema 2 (`book_world_lotm_deck.js`); `storylet_deck` Village gates unchanged | done-below-floor | Replay sweep |
| B-F3 | Replay stability across clock chunks | B :57 | `seeded_streams` | Unverified | Not shown | unverified | Sweep |
| B-F4 | Consequence writer plus Tingen deck | B :73 | `consequences.js` | Absent | built (owed rule, heat) | done-below-floor | none |
| B-O1..O6 | Six outcomes (evening, debt visit, late canon news, fame stare, festival, rumour) | B :77-118 | director | proposals | O2 debt visit built via duties; O4 fame via FD10; O1 partial via deck; O3, O5, O6 absent | done-below-floor (O2, O4); ready (O3, O5, O6) | Weibao picks |
| B-3.x | Spec items 3.1-3.11, new angles, questions | B :119-258 | proposals | Draft | No unified spec in code | ready | none |

**Lane C (combat, stock, abilities)**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| C-N1 | Open tempo move list | C :202 | `tempo_fight_contract.js` | S | `TEMPO_STOCK_MOVE_IDS` present | done-floor (via AT15) | none |
| C-N2 | Keyed draw for shots | C :203 | `tempo_fight.js` | S | `draw(b,'shot',...)` | done-floor | none |
| C-N3 | Concealed abilities neutral in log | C :204 | `tempo_fight.js:87-93` | S | present; tests | done-below-floor | Walk |
| C-N4 | Stock spend staged in plan | C :205 | `finishFight` | M | write-back once; walk 6 to 4 | done-floor | none |
| C-N5 | `DEATH_CAUSES` align | C :206 | `defeat_domain.js` | S | present | done-below-floor | none |
| C-N6 | Fog as visibility | C :207 | tempo | S | `fogMishap` | done-below-floor | none |
| C-N7 | NPC stock holders | C :208 | contract line 29-30 (`holder`) | M | present, foe stock in fight record | done-below-floor | none |
| C-N8, N9 | Law off the critical path; quote equals settle | C :209-210 | tempo | S | N8 true (collector path uses heat); N9 not shown | unverified | Check |
| C-L1..L9 | Notch bridge, range bands, carry/protect objectives, terms and breach, ammo decay, armory ledger, HP troll, event channel, grain selector | C :216-224 | various | LATER | no code seen | ready | Triggers stated in lane |

**Lane D (world gaps)**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| LG1 | Sun 9-8 | D :101 | generated factory | content only | `1ec64ae02`, tests, not walked | done-below-floor | Walk |
| LG2 | Formulas for 4 pathways | D :102 | `lotm_formula_rows.js` | source reading | not done | blocked (source reading) | Read |
| LG3 | Per-person pathway for cast | D :103 | cast rows | cast data | not done | ready | none |
| LG4 | Acting adherence and role laws | D :104 | `lotm_act_engine.js` | needed now | no code seen | ready | none |
| LG5 | Opponent sheets, fight window | D :105 | bands | needed at climax | not seen | ready | none |
| LG6 | Formula as trade good | D :106 | `lotm_price_map.js` 0 src importers | price-map wiring | still 0 | ready | One caller |
| LG7 | Characteristics and heredity | D :107 | none | later | none | parked | Trigger Seq 6+ |
| LG8 | Rituals as gates Seq 5+ | D :108 | `lotm_rite_rows.js` | later | none | parked | Trigger Seq 5+ |
| LG9 | Sequence 7 for Klein | D :109 | `lotm_advancement.js` | needed after G2 | `1ec64ae02`, tests | done-below-floor | Walk |
| HG1 | Lead-life calendar | D :138 | `book_world_hp_school_calendar.js` | W5 | built; countdown walked `b213f540` | done-floor (countdown); route below floor | none |
| HG2 | Houses, points, Sorting | D :139 | `hp_positions.js` | W6-W7 | house and Sorting built; points not | done-below-floor | Points |
| HG3 | Spell rows as content | D :140 | spell seam | content | Charms and Potions lessons only | done-below-floor | none |
| HG4 | Troll and duel on the frame | D :141 | FD17 | W7 | not built | ready | none |
| HG5 | Hogwarts rules and corridors | D :142 | sheet | W6 | sheet only | ready | none |
| HG6 | Owl post | D :143 | news owner | any | not built | ready | none |
| HG7 | Brewing class | D :144 | `hp_brewing_*` | W6 | Potions lesson built | done-below-floor | none |
| D-M1..M12 | Formula as item, supplier table, pathway sheet, price anchors, mid-start chains, corridor rule, paradise as FD15 consumer | D :193-204 | proposals | Palette | no code seen | ready | none |
| D-5 | MoL/paradise/primordial/Gu cards | D :155-185 | none | Light pass | no slice | ready | none |

**Lane E (livelihoods)**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| E-S1/S2 | Site record, stage-clock stock | E :104-105 | none | Seam proposal | `livelihoods.js` is a derived read view only | done-below-floor (read side) | Writer |
| E-S3 | Labour assignment | E :106 | `hired_hands.js` | L1 | built; not walked | done-below-floor | none |
| E-S4..S9 | Tools, yield, storage, rights and dues, build project, outlet | E :107-112 | existing owners | proposals | rights and dues partial via duties and authority; others no | ready | none |
| E-O1..O8 | Eight outcomes (landlady garden, dry season, spirit vein, pumpkins, workshop-shop, cabin claim, tenant share, miner shifts) | E :89-96 | proposals | Palette | E-O6 partially echoed by wilds homestead (authority test); none walked | done-below-floor (E-O6); ready (rest) | none |
| E-L1 | Livelihood inspector | E :158 | none | LATER | `livelihoods` read rows feed digest only | ready | none |
| E-L2..L9 | Season to crop, home build reads site projects, rights via FD8, second-world proof, deposit pool, shop, tool tier, gather-to-craft | E :159-166 | none | LATER | none seen | ready | none |

**Lane F (groups)**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| F-G1 | Group record and founding verb | F :264 | `organizations.js`+`_domain.js` | Gap | built; `organizations@1`; not walked | done-below-floor | Walk founding |
| F-G2 | Treasury, premises, keys | F :265 | `organizations_domain.js` | Gap | treasury built; premises and keys no | done-below-floor | Premises |
| F-G3 | Delegation ladder | F :266 | `hired_hands.js` | Gap | rung L1 only | done-below-floor | Rungs 2-3 |
| F-G4 | Law status | F :267 | `law_case.js` | Gap | 0 importers | ready | Wire |
| F-G5 | Rank/office in group | F :268 | none | Gap | none | ready | none |
| F-G6 | Second consumer of gatherings | F :269 | `gatherings` | Gap | LOTM groups line (hidden gathering by seat id) | done-below-floor | none |
| F-G7 | Split/dissolve/succession | F :270 | `organizations_domain.js` | Gap | `dissolved` field exists; split/succession not seen | ready | none |
| F-F1..F15 | Charter dials, quorum, canon-locked founding, meetings as time unit, kind change, keys as grants, informer model, standing fact, split conserves stock, traces, loans, NPC founding, name hygiene, owed ledger rows, group credit | F :244-258 | proposals | Palette | F13 naming kept (`organizations`); F14 via `owed_ledger_sources` duty rows; rest absent. NPC founding = AT17 | ready (F1-F12, F15); done-floor (F13) | Weibao picks |
| F-O1..O8 | Eight group outcomes | F :68-118 | proposals | Palette | Founding, invite, dues, feast, lookout built | done-below-floor | none |

**Lane G (research, skills)**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| G-N13 | `inquiry@1` | G :231 | `inquiry.js` | Opus design, M-L | built, Frontier consumer only | done-below-floor | LOTM consumer |
| G-N11 | Study rows for LOTM | G :229 | `inquiry_study.js` | S | not built | ready | none |
| G-N12 | MoL library desk | G :230 | `institution_access` | M | not built | ready | none |
| G-N14 | Shared trial log | G :232 | `craft_failure_ledger.js` | M | not wired (unchecked) | ready | none |
| G-N15 | Teacher withholds | G :233 | `lesson.js` | S-M | not seen | ready | none |
| G-N16 | MoL notebook item | G :234 | none | M | no | ready | none |
| G-N17 | `channel` tag plus coverage printout | G :235 | `channels.js`, `channel_map.js` | M | tag and map built; printout not seen | done-below-floor | Printout |
| G-N18 | Conceal vs Perceive trace | G :236 | `tempo_fight.js` contest | M | fight-log version built; stealth trace outside fights no | done-below-floor | none |
| G-N19 | Treatise | G :237 | none | L | no | ready | none |
| G-N20 | Technique variant derivation | G :238 | none | L | no | ready | none |
| G-K1..K9 | Nine skill channels | G :187-195 | `channel_map.js` | Proposal | 16-channel vocabulary built instead | contradicted (shipped as 16 by the W4-B lane, not by an accepted decision) | Record or reconcile count |

**Lane H (hosts, register)**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| H-G2..G5 | Tempo, away bank, digest, journal ports | H :32-35 | `native_tool_domains.js` | one-line swaps | all four use `neutralWritable` | done-floor (tempo walk); done-below-floor (others) | none |
| H-G6 | Pledges | H :36 | `pledges_domain.js` | swap | not switched | ready | blocked-split |
| H-G7..G11 | Cultivation intents, gear workshop, field layer, lamplight, tools | H :37-41 | open questions | undecided | unchanged | needs-yes | decide scope |
| H-G12..G16, G18, G19 | Frontier-bound by design | H :42-48 | n/a | by design | unchanged | parked | none |
| H-G17 | `workLedgerContext` reports `away` for non-Frontier | H :47 | `main.js:3382` | gap | still keyed on `base.frontier` | ready | Host fix |
| H-B | Seam register (37 rows) | H :80-123 | `seam_register.mjs` | printed | stale at HEAD (`--check`) | stale-doc | Regenerate |
| H-C | AR17 draft | H :149 | rules | proposed | see RC3 | needs-yes | none |

**Cross-world run checkpoint, findings and resume**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| W1-A..W5-B | Wave 1-5 lanes | CW CP receipts | see slices | per receipt | code present for all named files | done-below-floor (walked parts above) | none |
| W6-W10 | Full-blast commits | CW CP :88-100 | see slices/OB | "Not walked": Harry school route, founding and dues, collector fight, guard contract, hired hands, shop talk-down, positions resign, Sun and Seq 7 | no later walk recorded; residue wave 2 walk (HEAD `498a7b10b`, bundle `01eab058`) did not touch them | done-below-floor | One walk per consumer after MCP restart |
| NU | Next useful action: walk per unwalked consumer; Frontier bow item, NPC founding (AT17), LOTM ability lines, light passes for other worlds | CW CP resume | palette | open | all four palette items unbuilt | ready | none |
| MCP | `game_freeze` fails on removed `desktop/` | CW CP | game MCP server | Needs restart | later residue walk used `game_freeze` successfully on a scratch worktree | stale-doc (residue CP wave 2 walk shows freeze working) | Confirm |
| W11 | Obligations round 11 (OB1/OB2/OB8) | not in CW CP | `b68e4c88d` | commit message only | no checkpoint receipt; dirty tree also holds W11-D panel code (`lotm_panel_gaps.test.js` untracked) | in-progress (W11-D) / unrecorded | Add receipt |

**Enablement plan (state only)**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| P1-P12 | Horizon work rows | Plan :69-80 | various | proposals with triggers | P2, P4, P5 have later checkpoints; not verified | needs-yes (P3, P6-P12); unverified (P2, P4, P5) | Weibao selects |
| M1-M8 | Round 13 notes | Plan :104-120 | n/a | notes, M1-M2 done | not code | unverified | none |
| M19-M26 | Round 16 pressures | Plan :192-199 | n/a | proposals | M21/M22/M25 acted on by Anna fixture (Plan :216) | done-below-floor (M21, M22, M25); ready (M19, M20, M23, M24, M26) | triggers stated |
| L1-L4 | LATER rows | Plan :126-129 | n/a | triggers named | none started | parked | triggers stated |
| C1-C7 | Complexity checklist | Plan :90-96 | n/a | checklist | n/a | unverified | n/a |

**Registers**

| ID | Item | Locator | Owner → consumer | Doc says | Checked | Class | Next action or trigger |
|---|---|---|---|---|---|---|---|
| SEAM | Seam adoption register | `SEAM_REGISTER.md` | script | current | `--check` says stale; claims `ready_stock` receipt "fight use blocked" and `tempo_fight` "not reached natively for LOTM", both older than AT15 closure | stale-doc | Regenerate; fix proof cells |
| SYS-1 | Live crafting single-world | `SYSTEMS_REGISTER` gap 1 | crafting | open | still Frontier catalogue only | ready | none |
| SYS-2 | `matchRecipe` has no live caller | Register degrees line | `craft_recipes.js` | "no live caller (2025-10-25)" | `crafting_frontier_runtime.js:138` calls it | stale-doc | Update line |
| SYS-3 | Gate overflow policies mostly unread | gap 3 | `progression_gates.js` | open | readers: `chain_inspector*`, `craft_process_cues` | ready | none |
| SYS-4 | World-pack state has one writer, no gameplay trigger | gap 4 | `world_pack_save.js` (1 importer: registry) | open | `revealWorldPackPerson` no gameplay caller | ready | Trigger |
| SYS-5 | No legacy-command mechanism | gap 5 | simulation | open | not checked | unverified | none |

## Conflicts noticed

1. **Delivery reconciliation vs code (OB1, OB2, OB8).** LF :418-419 and :425 say part/dispute/bribe/seizure are left and duties do not consult OB8. `b68e4c88d` (after that doc) adds them to `recurring_duties.js`, `duties_domain.js:6,29` and `book_world_lotm_duties.js`. Seizure is inert (host seam absent, `book_world_lotm_domain.js:48`).
2. **OB1 "walk" is partly overstated.** The rent walk (CW CP W3 walk, bundle `f4a0ec5b`) shows the select and missed weeks; the same CP says paying from the purse is fixture-only. That walk predates `b68e4c88d`, which changed the same duty chain. The same bundle-age gap applies to the HP countdown walk (`b213f540`, before `33ffbf7e0` and `61b3d9238`). No item the delivery table labels "walk" is on the checkpoint's "Not walked" list.
3. **Seam register.** LF slice 2 says "`--check` current"; `node scripts/seam_register.mjs --check` reports stale at HEAD. The register's proof column still says ready_stock "fight use blocked", contradicting AT15's closure at floor. It is not wired into `check:rules`.
4. **Receipt headers vs bodies.** The cross-world CP header says build `b213f540` and 5256 tests, while the body's final gate is `01eab058` with 5470/5471 (one failure fixed, then focused only). `at15-fight` CP still says state "built", T1/T2 open, while the atlas and cross-world CP say closed at floor. No full-suite receipt exists for HEAD `b68e4c88d` (its commit message says focused tests and `check:arch`).
5. **Atlas rows behind code.** AT10 (:122 "unchanged"), AT11 (19 vs 12 worktrees), AT16 (HP consumers now exist), AT2 and AT4. Also `lesson.js` header (RC10) still says HP does not use it, but `book_world_hp_lessons.js` does.

## Residue

- LANE_A..H `RC`/`R`/`G-F`/`E-R` reconciliation rows and B's sections 3.x spec items: reading notes, not planned items, grouped or skipped. Lane B outcomes O1-O6 and spec 3.x are coarse-graded.
- AT3 (Klein arcs) and plan rows P2-P5, C1-C7: other lane or not code.
- Dirty-tree perf work (`facts_frame.js`, `simulation*.js`, `perspective_controls.js`): lane 7.
- Library and catalogue edits in the dirty tree: lane 6.
- Per-row persistence for B-lane deck draws: not found in any receipt.

## Checks run

- Importer counts (`grep -rlE "/X.js['\"]" src`, excluding self): law_case 0 (tests 1), ability_ladders 2 (ui only), canon_pull_panel 1, lotm_price_map 0, invention_receipts 0, anchor_snapshots 0, world_pack_save 1, organizations 7, positions 7, authority 4, consequences 2, channels 4, channel_map 1, inquiry 2, recurring_duties 2, ready_stock 1, world_society_sheet 0, storylet_deck 4 (storylet_deck2: 1), world_events 10 (the doc counts 7 and 13), hazard_resistance deleted at HEAD, npc_schedule 2, rival_memory 2, known_target_facts 2, batch_identity 1, care_access 1, interrupted_operation 1, heat 3, jurisdiction_rules 1 (law_case only), notch_contest 3, lesson 4, people_sources 4, world_light 2, own_holdings 8, livelihoods 3, hired_hands 4.
- `node --test tests/obligations_more.test.js tests/rent_duty.test.js`: 22/22 pass.
- `node --test tests/world_society_sheet.test.js`: 5/5 pass.
- `node --test tests/lotm_panel_gaps.test.js` (untracked, dirty tree): 3/3 pass.
- `node scripts/seam_register.mjs --check`: reports stale.
- `git show --stat 3beb0857d`: deletes `src/hazard_resistance.js`, its test, and the active-effects hooks.
- `git worktree list`: 12 entries.
- The tree changed during the audit: the obligations files were uncommitted, then landed as `b68e4c88d`.
