# Zorian S2-S6: stage record (proposal, 2026-11-03)

Proposal under AD32; nothing accepted, nothing built, nothing run in the game. Same shape as the [S0/S1 record](ZORIAN_S0_S1_STAGE_RECORD_2026-11-03.md): what is on
disk, a seam probe, then gap codes with ACT NOW / ACCOUNT FOR NOW / LATER, an on-path or off-path tag (ST13), and the task, level and done check per gap.
Rules applied: [plan](ZORIAN_PLAYTHROUGH_PLAN_2026-11-03.md) (stage rows S2-S6, mechanisms M1-M8, lessons table), WPR1-WPR32, AU2/AU3, WER ST13-ST17,
[seam note](RETENTION_RESET_SEAM_2026-11-03.md), [census](COVERAGE_CENSUS_2026-11-03.md), and the companion [S2-S6 scene table](ZORIAN_S2_S6_SCENE_TABLE_2026-11-03.md)
(341 scenes, c14-c55; every count below comes from it unless a line says otherwise). Evidence words: *read* (file opened), *counted* (script over files), *rule* (keyword pattern), *grep* (presence only).

**Codes.** This record uses the **H prefix** (H1-H18). G1-G16 are in the S0/S1 record, G17-G28 in the S0/S1 scene table, and a parallel session (`zorian-s1-slice`) may be adding G29 and up; H avoids a clash.
**Sealed scenes** (29 in c14-c55) are named by beat id and counts only; this record restates no truth from them.
**Probe base:** HEAD `32d713c47` (merge of zorian-s0-content). Seam statements are *read* or *grep* of `src/`; no test or game was run for this record.

**Which done each stage gives (ST17).** All five stages give neither done yet. "Lead replay done" means c14-c55 events in order inside their windows; "world ready for an ordinary life" means a non-lead start can use the same systems. Each gap says which it blocks.

## What is on disk, across S2-S6

| Item | State | Evidence |
|---|---|---|
| Lead scenes for c14-c55 | 341 scenes (S2 36, S3 64, S4 89, S5 141, S6 11); 29 sealed (S2 2, S3 5, S4 19, S5 2, S6 1); 1,194 steps, 1,176 by the lead; 248 scenes have options, 178 untaken options. c13 (11 scenes) is in the S0/S1 table | counted, `private/wb8-merged-2026-10-30/scenes.jsonl` |
| Chapter coverage | Every chapter c14-c55 has merged scenes, so none is "not read" in this range. Mean shard resolve rate 0.90-0.97 per stage; shards under 0.90: c15, c16, c27, c31, c32, c34, c37, c39, c45 | counted, `merge_report.json` |
| Date quality | 76 scenes `I` (inferred), 257 `U` (unknown, 75%), 8 stated `S` (01804, 04402, 04404-04408, 05305); all 341 `dateRef` relative, none absolute | counted |
| Rules and families | Census rows 1-24 with S2-S6 draws on 6, 7, 9, 10, 11, 12, 13, 14, 15, 17, 20, 21; no new census was run | read, [census](COVERAGE_CENSUS_2026-11-03.md) |
| People | 94 person ids touched in non-sealed scenes, 49 in three or more. At least 28 of the 49 have no first-name match in the pack's `content.people` or native people (rough match, so a lower bound on the gap) | counted, rough |
| Places | S2-S6 move from Cyoria and the Kazinski house (Cirin) to Knyazov Dveri, the Great Northern forest, the gem-collector and river-navigator settlements, Alanic's temple, Korsa, Eldemar, Noveda and Iasku mansions, and a research facility under Cyoria. None is a pack place row; S0 added 20 catalog places only for c1-c4 | counted places in scenes; read pack catalog count (22) |

## What the built branch gives S2-S6 (seam probe, HEAD `32d713c47`)

| Mechanism | On the branch | What is missing for S2-S6 |
|---|---|---|
| Seat and start (M1) | `book.mol.zorian@1` start, seat supplier, `book.mol.zorian.morning_home`, 6 `book.mol.zorian.s0.*` commands, reserve `book.mol.zorian.reserve` capacity 8 (*read*; focused-tested by the S0 sessions) | Nothing for c14+ is seat-reachable: of 1,176 lead verbs, 82 have even a `near` pack command (counted) |
| Reset row v2 (M2) | `book.mol.cyoria#zorian` in `harm_loops.js`: triggers date/death/switch, `carry` classes with carriers, `budget {iterations, remaining 52}`, `witnesses`, `staleness {reliableDays 3}`, `exit` (*read*; `tests/harm_loops_v2.test.js`) | Only `loop_table.js` copies the fields (*grep*). No restart applies the row, no budget spend or readout, no witness state |
| Calendar events (M3) | `WORLD_DAY_EVENTS` for `book.mol.cyoria`: 3 events with `dateBasis: 'fixture'` and a placeholder; `worldDayNews`, `validateDayEvents` (*read*; `tests/world_day_events.test.js`) | No event from c14-c55 is loaded. 75% of scenes have unknown dates, so the events come from stated times in the census, not scene dates |
| Carried knowledge (M4) | `carriedKnowledgeView` in `people_knowledge.js` reads `basis.carried` (*read*) | No writer except the start; no prediction item; no UI readout |
| Carriers | Row `carry` entries name a notebook, a code phrase and a memory packet. `carry_ledger.js` boundaries are death, rebirth and world crossing (*read*); no MoL rule registered (*grep*) | No loop-restart boundary in the ledger and no item for the notebook, phrase or packet |
| Witnesses | Row field only (above) | No per-person "remembers since run N" state; no consumer |
| Teacher windows | `teacher_window.js` is the village craftsman's window (`village.*` facts, one consumer `village_ui.js`; *read*). No MoL file references it (*grep*) | A generic recurring-lesson seam; Ilsa, Xvim, Taiven, Alanic, the River Navigators and Kael each need a window |
| Travel | `travel_legs.js` (`defineRoute`, `quoteRoute`, `settleRoute`) is generic; consumers are LOTM files only (*grep*); MoL has `book.mol.move.*` among 5 native places | No MoL routes: train Cirin-Cyoria, Knyazov Dveri, forest, Korsa, Eldemar |
| Time rooms (M8) | Nothing in `src/` (*grep*) | A room that spends from the loop budget |
| Soul perception (ZS13) | Nothing (*grep*) | A typed ability with its lesson series and a potion |
| Mind work, divination (GM29, GM27) | Nothing in the MoL host (*grep*; one unrelated hit in `book_world_mol_ids.js`) | Mind shield, mind sense, memory probe, scrying and tracking |
| Teleport (ZS11) | Nothing | Visited-place rule with a safe-after interval |
| Combat | `taiven_combat`, `hatch_encounter` read Taiven's trained row (below floor per PROJECT.md) | Outcomes stay asserted facts (WA32) |
| Budget readout | The row's `budget`; the source rule `mol.law.power-budget` (c55 p91; 52 more iterations, power spent per iteration not per hour) and `mol.reset.iteration-cap` (c55 p35, the month or a contingency) are the same quantity the row stores (*read*, `molc055_rules.jsonl`) | A populated readout at 1920x1080 and a spend on each restart |

## S2 Using the month (c13-c24; scenes c14-c20 in the table, c21-c24 shared with S3)

**On disk.** 36 scenes (2 sealed: 01503, 02001), 125 lead verbs, 17 with a `near` pack command. People by scene count: Kirielle 12, Kael 10, Taiven 6, the aranea matriarch 6, Imaya 5, Kana 3. Places: Imaya's house, the sewers, the Kazinski house, Kael's workshop in Imaya's basement, the train, the library. Stated date: 01804 (two days before the Summer Festival). Anchors in the scenes: a one-month loop (01605), one month needed for the soul-magic study (01606), a week of Kael's absence (01704).
**Needs** (counted, rule): witnesses and loop disclosure 18 scenes, carriers 15, teacher windows 9, travel 11, mind work 12, divination 6, wards and gates 4, soul perception 4, golems and crafts 4, trade 5, time rooms 0, budget readout 0.
**Seam probe.** Exists: reserve (8; the 10-cast value is a later revision), study chain, library people, meal, `ilsa_meet` and `kael_meet` as `near`. Missing: witnesses, a lesson series, mind shield (ZS8, scenes c13 p116-123 and c17-c21), library divination (ZS7), housing and rent verbs, a memory packet (01704 and 01801 hold accept/refuse options).
**Gaps:** H1 (witnesses), H2 (carriers), H3 (teacher windows), H5 (mind and divination), H8 (people rows), H10 (reserve growth), H12 (locked options).
**Gives:** neither done.

## S3 The month's dated pressure (c21-c27)

**On disk.** 64 scenes (5 sealed: 02209, 02301, 02303, 02305, 02501), 213 lead verbs, 11 with a `near` command. People: Taiven 15, Kirielle 11, the matriarch 8, Zach 6, Kael 6, Tinami 5. Places: Imaya's place, the Kazinski house in Cirin, Noveda Mansion (dance hall, grounds), the aranean settlement, Ilsa's office, a mage guild office. Anchors: restart length one month (02401), summer festival one month off (02304), a relay disc lasting 2.5 months (02402), Taiven grants a month of instruction (02204). The census adds the first-day storm of every restart (`mol.other.cyoria-restart-storm`, c27 p39) and the invasion; the scene file carries no calendar date for these.
**Needs:** mind work 26, wards and gates 17, travel 18, witnesses 19, carriers 12, teacher windows 15, divination 7, golems and crafts 7, soul 5.
**Seam probe.** Exists: fixture events for the dance (d15) and month end (d30), the sewer/combat rows through Taiven. Missing: the dated month (H7), teleport (ZS11, learned c23 p138-159, used c26 as an escape), summoning block (c22 p126), two invader mages as outcome facts, a spell-rod or relay item, the aranean settlement as a place.
**Gaps:** H1, H3, H4 (travel and teleport), H7 (calendar), H9 (combat as outcome facts), H12.
**Gives:** neither done.

## S4 Skills abroad (c28-c36)

**On disk.** 89 scenes, **19 sealed** (03102, 03103, 03104, 03106, 03107, 03201, 03203, 03205, 03206, 03301, 03302, 03303, 03305, 03306, 03307, 03510, 03511, 03513, 03612), the largest sealed block; 315 lead verbs, 10 with a `near` command. People: Gurey 6, Alanic 5, Kirielle 4, Silverlake 3, Vani 2, Lukav 2. Places: Knyazov Dveri, Alanic's temple, the gem collectors' tunnels and colony, Silverlake's cottage, the Great Northern forest, the River Navigators' settlement and lesson room, Eldemar. Anchors: a gathering trip of three days (02805), Silverlake's task taking several months against the one-month restart (02905).
**Needs:** travel 28, witnesses 20, teacher windows 18, soul perception 15, carriers 18, mind 17, wards 16, golems and crafts 12, trade 17, divination 8.
**Seam probe.** Exists: `travel_legs.js` (generic, no MoL route), economy crowns purse. Missing: every route out of Cyoria, a contract-job and crystal-trade chain with a purse table, ward bypass (ZS12), soul perception lessons with a weekly potion (ZS13), route planning (ZS14). The soul-perception route is mostly inside the sealed block; its build keeps a discovery route and is referred to by ID and status only.
**Gaps:** H2, H3, H4, H6 (soul perception), H9, H11 (money), H13 (sealed block).
**Gives:** neither done.

## S5 Mind work and allies (c37-c53)

**On disk.** 141 scenes (2 sealed: 04408, 04707), 472 lead verbs, 41 with a `near` command (the most mapped, mostly Taiven and library rows). People: Kirielle 30, Kael 14, Xvim 11, Imaya 10, Zach 9, Taiven 8, Raynie 8, Nochka 5. Places: Cyoria, Imaya's place, Iasku Mansion, the academy library, the training ground, two aranean webs. Stated dates: 04402 and 04404-04408 (a Saturday chain), 05305. Anchors: negotiation periods of three weeks and a week (03702, 03703), a month of sensory practice (03705), ten and a half days of guardian timing (03708).
**Needs:** witnesses 60, travel 54, mind 51, carriers 49, wards 41, teacher windows 36, golems and crafts 31, soul 24, trade 17, divination 15, time rooms 1.
**Seam probe.** Exists: reserve, `study_formula`, `assemble_lamp`. Missing: weekly mind lessons (ZS9), trust gates by prediction list and code phrase (c49-c53, ZS15), Taiven briefing, the golem and workshop (21 golem-craft verbs), the timed training room (c50), recall (ZS12 c41), dimensional boundary (ZS16, b1 at c50). The scene file reaches c50 for the time-room beat but ZS16's second appearance is c56, outside this range: the claim that time work follows is *not read* here.
**Gaps:** H1, H2, H3, H6, H8, H9, H10, H14 (time rooms), H15 (crafts).
**Gives:** neither done.

## S6 Threshold, the milestone (c54-c55)

**On disk.** 11 scenes (one sealed: 05501), 51 lead verbs, 3 with a `near` command. People: Zach 8, Kirielle 5, Xvim 2, Cikan and Fortov Kazinski, a facility researcher, the guardian of the threshold. Places: the aranean webs, the family home, the facility under Cyoria, the road to Cirin station, the train, Xvim's office. The non-sealed scenes carry the theory and the facility visit (c54) and the aftermath (c55: Xvim accepts the loop story with its evidence). The scene that most plausibly holds the keeper's statement of the cap and budget is the sealed 05501 (scene order only; unverified). The census rows are readable: `mol.reset.iteration-cap` (c55 p35, the month or a contingency ends an iteration; everything inside is destroyed) and `mol.law.power-budget` (c55 p91, 52 more iterations, spent per iteration regardless of elapsed time; a death spends extra).
**Needs:** witnesses and disclosure 7, mind 7, travel 6, carriers 4, teacher windows 4, budget readout 1 non-sealed scene, soul 1.
**Seam probe.** Exists: the Zorian row with `budget`, `exit`, `witnesses` (read), a fixture month. Missing: any consumer of those fields, a populated readout (FLR3) at desktop 1920x1080 (mobile deferred), the discovery route as a fixed-text route (MoL's public rules are not sealed, but 05501 is: by ID and route only), a controller-left condition (c54 p233).
**Gaps:** H1, H2, H16 (budget readout), H17 (route to the milestone), H7.
**Gives:** lead replay done only when S2-S5 chain to it; neither today.

## Gaps and abstractions

Disposition: ACT NOW (the next build session needs it), ACCOUNT FOR NOW (constraint, no build), LATER. Tag: on-path (build now) or off-path (recorded, built when a start needs it), per ST13.
Every task below can be dispatched alone. Level and effort: sonnet unless stated; haiku only for bounded reading of a prepared shard (AU3).

[H3 appointment](ZORIAN_S2_TEACHER_PREP_2026-11-08.md#playable-h3-appointment-2026-11-08) follows the earned drill into Xvim’s first Friday sensing session and critique. [Monday with Haslush](ZORIAN_S2_TEACHER_PREP_2026-11-08.md#playable-monday-object-lesson-2026-11-08) continues from the earned Friday save through the first supervised object-analysis result. H3 remains open for recurring instruction and a demonstrated durable learner outcome.

| Code | Gap | Disposition | Tag and blocks | Task, level and effort | Done check |
|---|---|---|---|---|---|
| H1 | **Witness state.** Who remembers, since which run, until when (the row field has no state or reader). First ally told: c16 and c25; Taiven, Xvim, Kael, Zach later | ACT NOW | on-path; blocks lead replay | M2 consumer: a per-actor witness record written when told and cleared or kept by the restart row; sonnet, medium | A told ally's record shows "knows since run N"; a restart keeps or clears it per the row; LOTM death row and Perfect Run unchanged |
| H2 | **Carriers as items:** memory packet (c17, c54), notebook, code phrase, prediction list (c49-c53). `carry_ledger.js` has no loop boundary | ACT NOW | on-path; blocks lead replay | Add a `loop restart` boundary or an adapter reading the row's `carry`; items for packet, notebook, phrase; sonnet, medium-high | After a restart the packet, notebook and phrase persist and the money does not; a lost notebook drops "what allies know"; focused test plus export/import |
| H3 | **Teacher windows.** `teacher_window.js` is the village craftsman; MoL needs Ilsa, Xvim, Taiven, Alanic, River Navigators, Kael as recurring windows | ACT NOW (S2) | on-path | Generalise the window or add a MoL window row type over `world_rhythm.recurringWindow`; sonnet, medium | One lesson series (the c15 series) opens and closes by the clock for the seat; the village test unchanged |
| H4 | **Travel and teleport.** `travel_legs.js` has LOTM consumers only; MoL routes (train Cirin-Cyoria, Knyazov Dveri, forest, Korsa, Eldemar) and the teleport row (visited place, safe-after interval, ZS11; 24 teleport verbs in the table) | ACT NOW (route rows), ACCOUNT FOR NOW (teleport shape) | on-path; blocks S3 and S4 | MoL route rows over the generic seam; teleport as a typed ability proposal; sonnet, medium | A leg from the family home to Cyoria quotes fare, time and hazard; teleport refuses an unvisited place |
| H5 | **Mind and divination as typed abilities** (GM29, GM27; mind scenes 12, 26, 17, 51, 7 per stage; divination 38) | ACT NOW (shield, S2), LATER (the rest) | on-path | The mind shield (ZS8) first as one typed ability; sonnet, medium | The shield is a seat command with a stated effect; others recorded |
| H6 | **Soul perception** (ZS13: daily attendance, a weekly potion, later a ring). 19 sealed S4 scenes sit around it | LATER (design ACCOUNT FOR NOW) | on-path for lead replay; off-path for ordinary lives | Typed ability with a lesson series (H3) and a potion item; sonnet, high; must keep the sealed route by ID | Sealed route stays hidden in chat and UI outside its discovery route |
| H7 | **Dated month from stated times.** Only 3 fixture events; 75% of scenes undated | ACT NOW | on-path; blocks lead replay | Haiku reads prepared shards of the census calendar/clock rows for c14-c27 (festival, storm c27 p39, month end, dance, the invasion), then `check_reader_rows.mjs`; sonnet loads them with locators and `dateBasis: stated`; effort medium | Strip shows an event on its day; each event has a locator; the fixture rows are replaced |
| H8 | **People rows for S2-S6.** 49 recurring ids; at least 28 have no pack row. ST16: depth by contact, central here: Taiven, Xvim, Kael, Zach, Ilsa, Kirielle, Alanic, Silverlake, Gurey | ACT NOW (S2-S3 cast), LATER (rest) | on-path | Extend the `content.people` roster by stage with scene-level locators (S0 method; native actors need an AD45 migration, see the S0 note) ; sonnet, medium | Each row cites a scene; entity budget 30 raised and counted; visitor surface fixture unchanged |
| H9 | **Combat, wards, golems as outcomes.** 45 needs-build options and 51 combat/ward verbs; below floor | ACCOUNT FOR NOW | on-path | Keep outcomes as asserted facts (WA32); name the fact keys | Each combat scene names its outcome fact; none builds an engine |
| H10 | **Reserve growth** 8 (S0) to 10 (c8), about 20 (c38) and about 35 (c46) from efficiency, not size (ZS2) | ACCOUNT FOR NOW | on-path | Policy revisions of `book.mol.zorian.reserve` per stage; WER9 line in the row's `carry` | A stage seed reads the right capacity; no new skill system |
| H11 | **Money.** A Cyoria purse exists; the Gurey job, a crystal trade (c34-c35, "draws attention"), travel fares have no purse table. Do not repeat the S0 note: no crown figure was found in c1-c4 | ACT NOW (S4) | on-path | Purse table per currency with locators (AD49), via `money_anchors.mjs`; haiku shard then sonnet, medium | Every figure read in the paragraph; `check_reader_rows.mjs` clean |
| H12 | **Locked options.** 178 untaken: 118 resolve by mechanism (upper bound), 45 needs-build, 0 out-of-world in the rule. 38-53% of verbs are unruled, so the "resolves" count is an upper bound and the out-of-world class is unmeasured | ACCOUNT FOR NOW | on-path (ST15) | Haiku judgment shards over the unruled options, sonnet merge; medium | Every untaken option has a class with a basis (rule or judgment); unruled share under 15% |
| H13 | **Sealed S4 block:** 19 of 89 scenes. Build must keep the discovery routes | ACCOUNT FOR NOW | on-path | Name routes by ID and status; no truth in chat, commits or UI outside the route | Sealed check on any S4 change passes |
| H14 | **Time rooms** (M8): the timed training room (c50), the Black Room (c50 p74 and later); 2 non-sealed scenes | LATER | on-path for S5; the room itself belongs to S7 | A room that reads the budget (H16); opus not needed; sonnet, medium after H16 | A visit spends from the iteration budget and shows the remainder |
| H15 | **Crafts and the workshop:** golem (21 verbs), relay disc (02402), lamp chain exists | LATER | off-path until S5 | Craft rows over the general engine (GM25); sonnet, medium | One golem from recipe to use as an item |
| H16 | **Budget readout and spend** (the milestone). The row stores 52 remaining; nothing reads or spends it | ACT NOW | on-path; blocks S6 and lead replay | Spend one iteration per restart, show the remainder in the loop table; desktop 1920x1080, mobile deferred; sonnet, medium; AD43 floor | Readout shows "52 left", 51 after a restart; save, reload and import keep it; fixed-text route, no sealed truth |
| H17 | **Route to the Threshold.** S6 lands from S5's checkpoint; the keeper statement is most plausibly in sealed 05501 | ACCOUNT FOR NOW | on-path | Brief names the route by ID; chain lineage S0 to S6 replayed in order on one bundle | Batch gate replays S0-S6 |
| H18 | **Coverage honesty.** Low shards c15, c16, c27, c31, c32, c34, c37, c39, c45; ZS16 beyond c50 and everything c56+ is not read (G16) | LATER | off-path | Priced full-text reader pass over the nine shards, then c56-c82 and c90-c106 separately (AU budget decision first); haiku shards, sonnet merge | Resolve rate above 0.90 on each; the c56+ pass has its own price line |

**Pipeline note.** G10 stays open (the world parameter for `gen-runner` was uncommitted in the primary checkout when last checked). Not re-checked here.

**Off-canon check (ST14).** Not run. One beat with a different purse, timing or choice is H12's companion once H1-H3 exist: LATER, sonnet, low, done when the result follows by mechanism.

## Order

1. H16 and H7 design lines, H1 and H2 together as one M2 packet (they share the row and the ledger), H3 in parallel (disjoint files).
2. S2 content (H8, H5 shield, H10) after H1-H3; S3 after H4 and H7; S4 after H4, H11; S5 after H6; S6 last.
3. Each stage seeds from the earlier checkpoint; the batch gate replays S0 to S6.
4. Dispatch rule: one writer per file area (shared pack, `harm_loops.js`, `people_knowledge.js`).

## More to consider

- ACT NOW (done): this record and the scene table; `--range` added to the generator with the S0/S1 output unchanged; sibling check; the budget and cap rules read (`power-budget` and `iteration-cap` are one quantity the row already stores); H prefix chosen to avoid G29.
- ACCOUNT FOR NOW: the unruled share (38-53%) means the scene table's reachability is a lower bound on gaps, not a measure; teacher windows and carriers are the two mechanisms every stage consumes, so they gate S2 content; the sealed S4 block means soul perception cannot be designed or tested from chat, only by ID and status.
- LATER / DELEGATE: (a) haiku shards, one per stage, to read the census calendar rows for stated times (H7), done when each event has a locator and `check_reader_rows.mjs` passes; (b) haiku judgment shards on unruled options (H12), done at under 15% unruled; (c) sonnet, medium, a gallery or inspector view of witnesses and carriers per restart so the seat's state is legible (inspection, not mutation); (d) a priced full-text pass for the nine low shards and c56+ (H18).

## Receipt

| Item | Value |
|---|---|
| Delegated invocations | 0 of 4 used (AU3 allows at most four haiku invocations; the work was deterministic scripts over prepared files) |
| New full-text reads of the novel | 0 |
| Scripts | `scripts/lead_run/zorian_scene_table.mjs` (extended, `--range 14-55`), `scripts/lead_run/check_zorian_s2_s6_scene_table.mjs` (new) |
| Checks | `node scripts/lead_run/check_zorian_s2_s6_scene_table.mjs` (341/341 rows, 29 sealed, 0 fails); `node scripts/lead_run/check_zorian_scene_table.mjs` (S0/S1, unchanged, 0 fails); `node scripts/check_direction_sync.mjs`; link check below |
| Not done | Nothing run in the game; no `src/` change; no tests added; sealed scenes not read for content beyond counts and ids |
