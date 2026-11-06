# Lane A: society sheet (FD14) and positions (FD15), reconcile and deepen (2026-11-06)

Root: [LARGER_FOUNDATIONS_2026-11-06](../LARGER_FOUNDATIONS_2026-11-06.md). Weibao, 2026-11-06: "Balancing different things like classroom based playthroughs to mercanary to soldier to other stuff and more, and all can happen in the same world? Maybe we need a normal society seam to apply to all the worlds?" He asked for each idea in depth, working backwards from the playable outcome.

Everything below is a proposal (AD32). No code, no other doc, no commit changed. Labels: **shown** = I read the source line (file:line); **stated** = a doc says it; **inferred** = my reading. Snapshot: master working tree on 2026-11-06. Sealed secrets are not touched; nothing here names one.

## 1. Reconcile: who already owns what

Classes: DUP duplicate, VAR compatible variant, INC incomplete integration, STALE, DIS genuine disagreement.

| # | Idea in FD14/FD15 | Existing owner (evidence) | Class | What to do |
|---|---|---|---|---|
| R1 | A world's normal society needs cast, institutions, daily life, language, belief, law of the small, information flow | Core kit K6 (cast, minor-character pool with jobs K6.5), K7, K8, K20-K24, K26 (stated, WORLD_CORE_KIT lines 174-212, 357-361, 497). K34 asks only for "lints and a coverage printout" (stated, line 901) | VAR | FD14 is the machine-readable form of a checklist K already holds. Cite K7/K8/K20-K26 as its field source; do not restate them. K34 is its tool owner. |
| R2 | The same checklist per world, written as prose with locators | Institution passes: 13 `*_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS` docs, each with places, person-to-person roles, money, time, "engine facts (default, dial, reason)" (shown by heading read, e.g. A_SOLDIERS_LIFE sections 2-4, 7, 10). WPR9-WPR15 make this a required pass shape (stated, RULES_INDEX row for WPR) | DUP in content, INC in form | The content for most sheets already exists as tables nobody can load. The new work is a loader and a coverage line, not more reading. Each sheet row cites its pass finding. |
| R3 | "Templates" fall back when a world lacks a line | AD46: "no world is the template"; each system is chosen per world; "A view that names one world's ids in shared UI code is a defect" (stated, RULES_INDEX line 260). AD51 allows shared seams with local numbers (stated, line 265) | **DIS risk** | Not a contradiction if the word changes. A template that fills a missing line silently is a world-as-template. Proposal: a **palette** of starter rows the author picks from, and a coverage printout that shows each line as `authored`, `palette: <name>` or `missing`. A palette row never reaches the player unlabelled as canon. Needs Weibao's yes on wording (it touches AD46). |
| R4 | A position carries organization rank | AD51 already lists "organization ranks" as a shared seam example (stated, line 265). `faction_rank.js` ranks by signed per-region reputation only: `rankOf(region, reputation, ...)` (shown, faction_rank.js:31). `institution_store.js` says standing "is not here" (shown, institution_store.js:3-5) | INC | **No owner holds rank inside one institution.** Region reputation is not "Corporal of the Legion" or "second-year of Gryffindor". This is the biggest hole under FD15 (see section 4). |
| R5 | Access and kit from a position | `institution_access.js`: one issuer, one subject, scoped, expiring, suspendable grant; "a lapse never touches" the subject's own skill (shown, institution_access.js:1-4, 10-28). One importer: MoL guest pass (shown, book_world_mol_access.js:4, 29) | VAR | A position's access facet **is** a grant. Reuse it; the position must not grow a second access shape. |
| R6 | Contract, mission, pay on completion | `institution_store.js` `defineMission`: pay, minutes, issuer, risk, deadline, text (shown, :19-25). But `reward` is forced to `'contribution'` (shown, :23) even though `REWARD_KINDS` lists `money` (shown, :16). Nighthawk missions use it (shown, book_world_lotm_merit.js:15-19) | INC | The mercenary contract shape mostly exists. Gap: a mission cannot pay money, and it has no term, no commitment state and no failure branch. Extend, do not fork. |
| R7 | Duties on the clock, misses | FD8 `recurring_duties.js`: slice `duties@1`, `attendDuty`, `settleMisses`, rows on the shared ledger, absent slice loads fresh (shown, :6-14, 21-39). Two importers (LOTM duties, duties_domain) (shown by grep) | VAR | Position duties are FD8 defs. The `duties@1` migration pattern is the model for a `positions@1` slice. |
| R8 | Lessons from a position | FD11 `lesson.js`: availability window plus blockers, one knowledge fact attributed to the teacher, optional xp (shown, lesson.js:9-20). Importers: LOTM divination, `teacher_window` (shown by grep). Its own header names HP classes as the next consumer, "not built" (shown, :5) | VAR | A class is a lesson def whose window comes from the timetable. |
| R9 | Pay | FD6 `purseEffect`, `NATIVE_PURSE` (shown, own_holdings.js:51-57). Klein's civil pay uses `money(C.weeklyPence)` plus a `weeks_paid` resource (shown, book_world_lotm_lives.js:77-82) | VAR | Position pay is a purse effect, as the root doc says. |
| R10 | Discipline: detention, desertion, expulsion | `law_case.js` (detection, nested jurisdiction, response ladder) has **zero importers**, and so does its base `jurisdiction_rules.js` apart from it (shown by grep). HP pass: no standing detention scale in the window (stated, HARRY_POTTER pass F17); soldier pass: desertion executed, mages track escapees (stated, A_SOLDIERS_LIFE section 10) | INC | The root doc lists "discipline through `law_case`" as if wired. It is unwired. First position consumer is also law_case's first consumer. |
| R11 | Several positions at once | BF29: "Compose real memberships, inventory and commitments" for student-and-smuggler; a class and a delivery can conflict (stated, BOOK_WORLD_FEATURE_GAPS BF29). CHARACTERS_AND_WORLD_EVENTS: "faction memberships", "one persistent actor across changing roles", and the guard that "a membership badge ... supplies neither a valid attack nor actual consent/knowledge" (stated, lines 169, 622). ACR10: no universal one-job rule (stated) | DUP in intent | FD15's "more than one at once" is already accepted design language. Adopt the badge guard verbatim: holding a position grants no skill, knowledge or consent. |
| R12 | Position terms in Klein's lives | Civil contract data has `termYears: 5` and `secrecy`, but the only readers are display strings (shown, book_world_lotm_lives.js:30; grep `termYears` in LOTM finds only text lines). Pay due is derived from a note timestamp and a resource counter (shown, :66-70) | INC | Klein's term, expiry and exit do not exist as state. Migration target (O2). |
| R13 | Village apprenticeship | `village_career.js`: bespoke record `{schema:4, rank, shifts, completed, returned, loan, debt, ...}` with ranks Apprentice, Dependable worker, Mentor, kit loan and debt (shown, :3, 11-13, 72-80). `feature_expansion_society.js` (11 importers) holds agreed-work itineraries: funded lesson, apprentice consent, own tools, rights handoff (shown, :221-242) | VAR | **Correction to the root doc (STALE):** it says `feature_expansion_society` gives "one-time resident meetings". It holds multi-step consented lesson, apprenticeship and handoff itineraries. It is still not a society declaration. Note the name clash: "society" in that file means Village agreed work, not FD14. Use "society sheet" only for FD14 in code and docs. |
| R14 | Background population with jobs | `npc_lives.js` Village people have birth, death, spouse, parents, no job or role field (shown, :10-13; grep for job finds none). `cast_schedule.js` gives whereabouts rows by actor and time band (shown, :129, 152) | INC | NPC position use needs AT17 (persistent people, not built) and AD33 (NPC-heavy work deprioritized, stated). See section 3, NPC use. |
| R15 | Standing across a change of identity | `persona_standing.js`: standing per persona per region, with a 0.5 leak between faces (shown, :7, 14) | VAR | Klein's "new identity civil clerk" start can hold its position under a persona. Keep that join. |
| R16 | FD15 in the lead-life queue | LOTM-first and Harry-alongside are the current focus (stated, PROJECT.md lines 19-20). AD51: queue and field lists are "not set here" (stated). Village stays a test bed with "no new depth" (stated, PROJECT item 3) | VAR | Build positions through Klein and Harry, not through the Village. Village is a parity fixture only (O5). |

**Net:** no existing owner is a duplicate that blocks FD14 or FD15. Most pieces exist apart (R5-R9). Four gaps are real: rank inside an institution (R4), term and exit state (R6, R12), an unwired discipline seam (R10), and the AD46 wording for templates (R3).

**Root doc corrections (A1, proposal):** (a) fix the `feature_expansion_society` line as in R13; (b) say `law_case` is unwired where FD15 lists it; (c) FD14 "templates" becomes "palettes" pending Weibao's yes (R3); (d) "Klein is a clerk, a Nighthawk and a club member at once" is unverified here (the club is not in anything I read); the clerk plus Nighthawk-team pair is shown by the LOTM lives file.

## 2. The position record, backwards

### 2.1 Target outcomes and the walk back

Each outcome is playable at the desktop viewport (UI priority). The walk goes: player sees and does, state needed, owner seam, what is missing.

**O1. Harry attends one week of classes and gets one detention.**
- Sees: a week strip with Monday to Friday periods, the day's class on a row, a "Go to class" action open only in its window, a teacher who is in the room, a point change or a detention note, an overdue "detention tonight" row on the owed panel.
- State: enrolment (house, year), class defs with windows, attendance per cycle, detention as a duty with a debtor and creditor, house points.
- Seams: timetable windows `recurringWindow` and the G5 calendar (shown, world_rhythm.js:20, 35; G5 unbuilt, stated, atlas AT16); class = FD11 lesson (R8); detention = FD8 duty with `carries` and misses (R7); presence = `cast_schedule` whereabouts (shown, :129).
- Missing: the school calendar; a position carrying year and house; a discipline rule that says what a rule break costs (R10); a house-points owner (K7.1 names house points, stated, no code found by me, so **unverified**).

**O2. A Tingen civil clerk's week, with a team assignment on top.**
- Sees: weekly pay row, an expense claim duty, the contract term left ("3 years 40 weeks"), a Nighthawk mission offer that fits or clashes with the shift.
- State: contract start, term, pay cadence, weeks paid, duty attendance, merit ledger, mission in progress.
- Seams: pay and weeks paid already exist (R9, R12); the duty already exists (shown, book_world_lotm_duties.js, weekly `lotm.expense_claim`); missions already exist (R6). Contract start is a knowledge note timestamp (shown, lives.js:66-70).
- Missing: term expiry, renewal, resignation; a clash rule between a mission window and a shift window. This is the **migration fixture**: the record must wrap what exists with saves unchanged.

**O3. A soldier enlists, drills, is posted, then deserts or is discharged.**
- Sees: a recruiter offering labor, army or Legion (stated, A_SOLDIERS_LIFE section 7); a weekly pay line after training; a quartermaster charging gear to debt (stated, section 2); a cut cycle that sends the bottom of a barrack to the army (stated); a posting to a company; an exit menu with costs.
- State: entry route (sentence, volunteer, bonded), unit, rank (data-poor: the pass found no sergeant rank, stated section 3), training weeks, debt balance, posting, exit status.
- Seams: debt = obligations ledger (shown, recurring_duties.js:5, `writeObligation`); pay = purse; cut cycle = a recurring test (duty plus check); desertion = law_case row with response ladder (R10); healing and expenses = access grant (R5).
- Missing: everything position-shaped; there is no soldier code in `src/` (grep finds none). The world's data pass is complete enough to author rows from.

**O4. A legionnaire takes a Guild bounty in the same world.**
- Sees: a guild hall board with a bounty, deadline and pay on completion; the legion's duty window that may forbid it; a registration fee (25 silver, stated, A_SOLDIERS_LIFE section 2).
- State: second position (member, contracted), contract with deadline, delivered goods, payment stage.
- Seams: mission (R6) with a money reward; ACR6 keeps work done, delivery and payment as separate stages (stated); slot clash through FD8.
- Missing: money-paying missions, a commitment state, the clash check, a conflict rule between two institutions (the pass says the Guild is a parallel institution, stated section 10, so default is no conflict, dial per case).
- This is the mercenary shape: **term fixed by the job, pay at the end, risk named by the issuer, no rank.**

**O5. The Village apprentice, as a parity fixture.**
- Sees: nothing new; the player's Village career panel behaves identically.
- State: village_career's own slot (schema 4). The fixture passes if a position view over it reproduces rank, shifts and kit debt without the slot changing.
- Missing: the adapter. Value: proves the record can wrap a bespoke life without a migration, which is the strongest evidence for saves safety.

**O6. A pupil and a soldier both exist as NPC lives in one world.**
- Sees: a classmate with a schedule that fits the timetable; a legionnaire in the hall at the right hour; both can be asked about their day and answer from their position.
- Seams: `cast_schedule` and `people_knowledge`; positions give the schedule its reason.
- Missing: AT17 persistent people, and a derived (not stored) position for background people. AD33 keeps this thin and later.

### 2.2 Record shape (proposal)

Two layers, following the pattern the repo already uses (definition is static data, state is a small slice, display is derived).

**Position definition (data, per world, in a pack):**
- `id`, `world`, `institution` (id into `institution_store` where one exists), `label`, `kind` (term type, see 2.3)
- `entry`: routes, each with gate (an `evaluateRule` shape, as store rows use, shown institution_store.js:31), cost, who offers (recruiter, headmaster, issuer)
- `rankLadder`: optional list of `{id, label, requires}`; may be empty (soldier pass found no ladder, stated)
- `term`: `{type: fixed|open|until_done|until_age|until_cut, length, renews}`, in world minutes
- `duties`: FD8 defs it adds while held (schedule, debtor, creditor, why, source)
- `lessons`: FD11 defs it opens
- `pay`: `{amount, cadence, form}` where form is money, institution currency, board, or debt-offset
- `gives`: access grants (R5), kit, lodging, protection
- `asks`: costs while held (fees, kit debt, secrecy, restrictions)
- `law`: refs to law rows that apply to holders (`appliesTo` tags exist, shown law_case.js:11-13)
- `exits`: list of `{id, kind, cost, record, reentry}` (see 2.4)
- `evidence`: source locator or "authored proposal", as institution rows carry (shown institution_store.js:24)

**Position state (slice `positions@1`, additive):**
- `held: {positionId: {since, rank, status, termEnd, paidThrough, counters{}, exitHistory[]}}`, per actor (`player` first)
- `status`: `applied | held | suspended | exited`
- `history: [{positionId, from, to, exit, record}]`, the thing a later position can read (reputation carryover, references; see section 5)
- No copy of anything another owner holds: pay due derives from `paidThrough` and the def; duty attendance stays in `duties@1`; rank text derives. One authority per fact (stated, institution_store.js:4-5).

Absent slice loads as empty, as `migrateDuties` does (shown, recurring_duties.js:10-14). Klein's existing facts and resources stay where they are; a **projection** reads them (contract note timestamp, `weeks_paid`) so the record can show a term without a save change (inferred).

### 2.3 Term types

| Type | Meaning | Shown/stated source of the shape |
|---|---|---|
| enrolled | Fixed academic term, attendance, year ladder | HP pass F6, F9 (stated) |
| enlisted | Open or fixed service, drill, posting, discipline | Legion five-year term (stated, soldier section 2) |
| hired | Open employment, pay cadence, resign or dismiss | Klein civil pay (shown) |
| contracted | Fixed end by date or deliverable, pay at the end | Guild bounty, Klein 5-year term (shown/stated) |
| apprenticed | Teacher-bound, rights handoff at the end | Village (shown, society.js:221-242) |
| sworn | Oath-bound, exit has a binding cost | Sect and church positions (stated, primordial/LOTM passes); dial |
| member | No term, standing only, dues optional | Guild registration (stated) |
| sentenced | Term imposed by a ruling, with a choice of service | Court choice labor/army/Legion (stated, soldier section 2) |
| bonded | Term owed to a person for a debt | A medic owes a baron ten years (stated, soldier section 7) |

These are labels for defaults. A world with another shape adds a type with a reason; none is closed (AD5, AD46).

### 2.4 Exits and their cost

Default: every position lists at least one way out, and each way has a cost the world gives it. Dial per world; the cost is the reason, not a global penalty.

| Exit | Typical cost | Record left | Example |
|---|---|---|---|
| complete | none, maybe credential or discharge pay | credential fact, reference | graduate; five-year term ends |
| resign | notice period, lost pay, lost access grant | history line | civil clerk quits |
| dismiss | back pay lost, record, sometimes debt | history line, notoriety | expelled |
| desert | law response ladder; may be fatal | wanted fact, law case | Legion: executed (stated) |
| buy out | money or debt | history line | pay a bond |
| transfer | new position starts, old record carried | history line | regular army to Legion on a failed cut (stated) |
| discharged by cut | automatic, by test | history line | barrack cut (stated) |
| contract ends | pay settles, no ongoing ties | history line, reference | bounty delivered |

Rule for the sheet: leaving never deletes a skill (grant rule, shown institution_access.js:20), and leaving never deletes a debt (obligations ledger).

### 2.5 Several positions at once

- **Time:** two duties whose windows overlap, or a mission window inside a shift, are a clash. The existing owner is FD8 windows; the record only asks "does any held window overlap this offer" and shows the answer on the offer (so the player sees "clashes with Thursday class").
- **Body:** one body can be in one place. `cast_schedule` whereabouts is the check for NPCs; the player's travel time is already native.
- **Loyalty:** a def may list `rivals: [institutionIds]`. Default empty (Guild and Legion coexist, stated). When set, taking an offer makes a standing change with the rival (R4 owner needed) or a law case if the world says so.
- **Kit and custody:** a kit loan from one position (Village lantern kit, shown village_career.js:72-80) is not usable for another unless the world lets it.
- **Identity:** a position held under a persona stays with that persona (R15); the leak of standing between faces already exists.
- **Law:** conflicting duties produce a miss, not a special rule (FD8 `settleMisses`, shown).
- **Not a conflict:** being a pupil and a prefect, or a soldier and a Guild member, are default compatible; a world marks incompatible pairs with an in-world reason.

### 2.6 How balance emerges per world, without a global table

No global tuning table (AD5, AD38). Each position's value is five numbers the world already sets, read from the owners:

| Axis | Source | Example (soldier pass, stated) |
|---|---|---|
| Pay | `pay` and price anchors (K8.1) | Regular 108 copper a week, Legion 540; a one-day tannery haul pays 55 silver |
| Risk | named by the issuer or the world, as missions already do (shown, institution_store.js:24) | "Escape means execution"; fodder at the front |
| Learning | lessons and training rows (FD11, FD5 xp) | Tablet-ranked training, ten times the regular army's cost |
| Standing | rank and persona standing | none for soldier ladder; house points for HP |
| Time | duty windows and term length | seven months training; a week of wall shifts |

The printout (K34 style, a coverage line, not a tuner) lists each position of a world as one row with these five. Inference from the soldier numbers: weekly Legion pay (540 copper, about 5 silver 40) is far below one tannery haul (55 silver), so the Legion's worth lies in expenses, free healing, training and loot shares, which the pass lists. Balance therefore comes from the non-pay lines, and the world's own dial settles it. A designer or Weibao reads the row, and the game never auto-scales one position against another. That keeps ACR12 (no automatic opposition scaling) and AD22 (single player, no abuse hardening beyond save integrity).

### 2.7 NPC use of the same record

- Same def, same state shape, with `actor` other than `player`. For most background people the record is **derived** from their role in the cast row and never stored (like `faction_rank` derives on read, shown faction_rank.js:1-4), so no save growth.
- Promotion to a detailed life writes a held entry that matches the derived one (ACR13: identity and committed causes survive a change of scale, stated).
- The schedule of a pupil, soldier or clerk comes from the position's duties and windows through `cast_schedule` (shown, :152), not from a hand-written row per person.
- Gated by AT17 and AD33. First slice: no NPC holds a stored position; the record is only the explanation for schedules already authored (inferred).

### 2.8 Save and migration impact

- New slice `positions@1`, additive, fresh when absent (pattern shown, recurring_duties.js:10-14). No old save changes.
- Klein's lives, Village career and MoL pass stay where they are; each gets a **projection** first. A stored entry exists only for positions the old code could not hold (HP enrolment, a Guild contract).
- Content revision: a def change must preserve committed terms (ACR11, stated; K33 pack revision pinned, stated).
- Proof route when built: AD36 floor. Focused test for the slice's invariants (held entry needs a def, `termEnd >= since`, exit appends history, absent slice migrates fresh); parity test that the Klein and Village projections equal their old derived values; browser proof at desktop for O1 and O2; save, reload and import for any stored entry. All of that is a plan, not run.

## 3. The society sheet (FD14), backwards

**Outcome the player sees:** a new world opens with working daily life even before its lead's book content exists: prices that make sense, people with jobs in the street, a calendar, somewhere to enrol or sign on, and a law of the small. The designer sees one coverage printout: which lines are authored, which come from a palette, which are missing.

**Walk back:** the printout needs a sheet; the sheet's lines each point at an existing owner or at nothing yet; the owners are K6-K8, K20-K26 content (R1), world_rhythm, own_holdings, institution_store and access, law_case (unwired), people_knowledge, cast_schedule, world_events.

### 3.1 Sheet fields (proposal)

| Field | Content | Owner it points at | Status of owner |
|---|---|---|---|
| `calendar` | day length, week, term and festival rhythm, working week | `world_rhythm` (27 importers, root doc, stated) | wired |
| `money` | currency units, four price anchors (bread, room, lesson, weapon), pay bands by position | `own_holdings` purse, K8.1 | wired |
| `institutions` | list with name, offers, currency, who runs it | `institution_store`, `institution_access` | wired in 3 worlds |
| `positions` | list of position defs (section 2.2) | new `positions` | not built |
| `law` | statutes of the small: fines, debt, petty crime, who enforces, detection | `law_case` | **unwired** |
| `information` | how news travels, speed, carriers | `people_knowledge`, `world_events` | wired in parts |
| `address` | forms of address, naming pool, idioms | K20 text; UI strings | content only |
| `population` | job mix of background people, minor-character pool | `cast_schedule`, `npc_lives` | thin (R14) |
| `daily` | food, lodging, household, health in local form | K8.4-5, K22, `life_events` | partial |
| `belief` | daily ritual, taboo | K21 | content only |
| `unmet` | auto: lines with no authored row | K34 printout | not built |

Each row carries `evidence` (source locator or "authored proposal") and a `palette` marker. The sheet is a declaration plus printout, not a simulation (stated, root doc FD14 default).

### 3.2 Palettes (not templates; R3)

Four starter palettes. All numbers are placeholders for an author to replace; none is canon for any world.

| Palette | Positions it offers | Price anchors | Law of the small | Rhythm |
|---|---|---|---|---|
| Boarding school | enrolled (year, house), prefect, staff | fees and pocket money; a lesson is free but attendance owed | points lost, detention, expulsion; out-of-bounds | term and week timetable, curfew |
| Garrison or legion | enlisted, bonded, sentenced, discharged | pay in coin plus expenses; gear on debt | desertion ladder, tribunal, capture policy | drill week, cut cycles, postings |
| Industrial city | hired (clerk, worker), apprenticed, contracted | wage in weeks; rent as the pressure | fines, debt, petty theft, police beat | work week, pay day, church day |
| Sect or clan | sworn (outer, inner), member | contribution points, store prices | sect rules, elder judgment, exile | monthly duties, seclusion, tournaments |

An author picks a palette, overwrites lines with source rows, and the printout shows what stayed palette. Canon worlds fill their sheets from their institution passes (R2): Soldier's Life from its sections 2-4 and 10, HP from its places, roles and engine facts, LOTM from its pass plus merit store.

### 3.3 Where the sheet pays off

- Soldier's Life: nearly all of its sheet exists as pass tables; building it gives the soldier outcome (O3) data without more reading (stated, sections 2-4).
- HP: places and roles are rich, the calendar is the blocker (stated, AT16).
- LOTM: positions for probationer and civil staff already exist as hand code; the sheet would list them and expose the term gaps (R12).
- Test beds (Frontier, Mistglass): palette only, no new depth (stated, PROJECT item 3).

## 4. Gaps (ranked)

| Rank | Gap | Evidence | Why it matters |
|---|---|---|---|
| G1 | No position record: term, expiry, exit, history | `termYears` is display-only (shown); Village career is its own slot (shown) | Every FD15 outcome needs it |
| G2 | No owner of rank inside an institution | faction_rank is per region (shown); institution_store excludes standing (shown) | Corporal, year, prefect, inner disciple have nowhere to live |
| G3 | Discipline seam unwired and no money-paying, committable missions | law_case zero importers (shown); mission reward forced `contribution` (shown) | Detention, desertion, bounties |
| G4 | HP calendar (G5) and a house-points owner | atlas AT16 (stated); no house-points code found (unverified) | O1 |
| G5 | AD46 wording for palettes; AT17 persistent people; AD33 NPC depth | R3, R14 | Gates NPC use and the "template" word |

## 5. More to consider (round 1, 2026-11-06)

Angles are new relative to FD14/FD15. Codes continue from this lane: M1 onward. Levels: ACT NOW = done by being saved here; ACCOUNT FOR NOW = leave room in the record or sheet at no extra build cost; LATER = named work with effort and a done check.

| Code | Angle | Class | Effort | Done check |
|---|---|---|---|---|
| M1 | **History line and references.** An exited position leaves a history line (who, when, how it ended). A later position's entry gate can read it: a reference letter, a discharge paper, a dismissal that follows you. Soldier pass shows entry gates and reputations; HP shows career needs credentials (stated, HP F10: Auror needs five NEWTs). | ACCOUNT FOR NOW (`history` field in 2.2) | field only | Record shape has `history` and an entry gate can read it |
| M2 | **Reputation carries between positions, per institution, not globally.** Region reputation (shown) answers "town", not "the Guild". The G2 owner should be a standing per institution that can leak across rivals or allies by a stated factor, as personas leak (shown persona_standing.js:7). | LATER, level: design then small seam, effort 1 session | Two positions of different institutions show separate standing; a rival's standing moves by the stated factor |
| M3 | **Unemployment and the gap.** Between positions the character has rent, food and no pay. Default: a world with a rent anchor shows the burn rate on the sheet. Dial: worlds with no rent (sect board) show nothing. | ACCOUNT FOR NOW (`pay` form includes `board`; sheet has `daily`) | none | Sheet printout shows an "if no position" weekly cost line where the world has one |
| M4 | **Illegal and secret positions.** Smuggler, spy, deserter-turned-mercenary, secret society member. The record needs `visibleTo` (who knows you hold it), reading the knowledge owner; law rows use `appliesTo` tags (shown law_case.js:11-13). BF29 already asks for concealment dialed by actual means (stated). | LATER, effort 1 session after G1 | A held secret position is invisible to an NPC without the fact and visible after a witness event |
| M5 | **Inheritance and succession.** Hereditary posts, a master handing rights to the apprentice (shown: Village handoff itinerary, society.js:221-242), a sect seat passing on death. Same exit kind `transfer` with a different holder. | ACCOUNT FOR NOW (exit kind `transfer`, holder can differ) | field only | An exit of kind transfer can name another actor |
| M6 | **Position inherited with a body.** A probationer life wakes as a clerk and keeps the clerk's purse (shown, lives.js:5-6, WER9 stated). The same crossing can hand over the clerk's position, duties and rank, with the old identity's ties still known to others. | ACCOUNT FOR NOW (start profile can list held positions) | none | Start profile row lists a held entry, and the LOTM probationer projection matches it |
| M7 | **Family pressure and household.** A household member's expectation (take the family trade, marry, stay home) acts on a position choice. Existing owner: `life_events` (one importer, Village household, shown by root table). Cheap form: an offer line shows who in the household has a stance. | LATER, effort small, depends on `life_events` wiring | A household stance appears on a position offer and changes a reaction line only |
| M8 | **Canon-locked runs.** In a forced canon run the lead's choices are the book's and untaken options show locked (stated, LEAD_LIFE_RULES section A). Position offers must be able to show "Not how it happened". The record needs `canon: held|locked|open`. | ACCOUNT FOR NOW | field only | A lead-life offer can render locked with that text |
| M9 | **Credentials as facts, not ranks.** HP: Auror needs five NEWTs not below Exceeds Expectations, then tests, then training; Healing needs particular NEWTs (stated, HP F10). Entry gates read credential facts that a completed position writes (complete exit gives `credential`). | ACCOUNT FOR NOW (exit `record`) | none | Completing a class writes a credential a later gate reads |
| M10 | **Recruiter and issuer incentives.** The soldier pass says the recruiter is paid per recruit and steers toward the larger bonus (stated). The `entry` row can name `offeredBy` with a bias note; the player reads honesty from a person, not a menu. | LATER, content only | An entry route shows who offers it and what they gain |
| M11 | **Black markets and parallel economies inside a position.** Soldiers selling loot, quartermaster margin on debt-charged gear (stated), Guild exclusive sale rights (stated). Position `asks` and `gives` plus a market row with a gate on the position. | LATER, effort 1 session with the economy owner | A position gates one price list that differs from the open market |
| M12 | **Aging and life stage.** Positions end by age (enrolled until 17, retired at sixty). `term.type until_age` reads the actor's age (npc_lives has birth year for Village people, shown). | ACCOUNT FOR NOW (`until_age`) | A term can end by age on a Village NPC fixture |
| M13 | **Contract failure branches.** A mission has risk and deadline but no failure branch (shown, institution_store.js:19-25). A contract def needs outcomes: delivered, late, abandoned, failed, each with its pay and record (ACR6, ACR7: settle what happened once, stated). | LATER, effort 1 session on G3 | Each failure outcome settles pay once and survives reload |
| M14 | **Coverage printout first.** The cheapest FD14 piece: a script that reads each world's declared rows and prints authored, palette, missing per sheet line (K34 floor, stated). It exposes gaps with no runtime change. | LATER, effort small, anywhere in the order | `npm run` style check lists the lines per world and fails on an unlabelled palette row |
| M15 | **Name hygiene.** "Society" is taken by `feature_expansion_society` (Village agreed work). Use "society sheet" for FD14 and avoid a `society_*` filename. | ACT NOW (this file) | grep shows no new `society_` module for FD14 |

ACT NOW already done here: reconciliation R1-R16, root doc correction list A1, name hygiene M15, the rank-gap finding G2.

## 6. Suggested order (proposal, lane view)

1. Add the missing pieces in the smallest form that serves Klein: the position def and `positions@1` slice with a **projection** over Klein's civil contract and probationer track (O2). Term and exit become visible with no save change.
2. Money-paying, committable missions (G3) so Nighthawk missions and the Guild bounty (O4) share one shape. Wire `law_case` through one real consumer (desertion or detention).
3. Harry's enrolment and week (O1) once G5 exists; class as lesson, detention as duty.
4. Soldier's Life rows (O3) authored from the pass, as the first world whose sheet is mostly data.
5. Institution rank owner (G2/M2) as soon as O3 or O1 needs a rank that region reputation cannot carry.
6. Sheet, palettes and printout (FD14) written last as the declaration that collects 1-5 (as the root doc orders), with M14 allowed earlier because it is only a printout.

Open build-order question for Weibao (effort and order, not design): is the Klein projection (step 1) allowed to precede the AT15 fight on the LOTM queue, or does it ride alongside as a small lane? Default if unanswered: alongside, since it changes no save and is not a gate.

## 7. Verification state

- Source read for this lane: institution_store.js, institution_access.js, recurring_duties.js, lesson.js (whole); head sections of law_case.js, faction_rank.js, village_career.js, book_world_lotm_lives.js, book_world_lotm_duties.js, feature_expansion_society.js (societyFacts and work plans), npc_lives.js (createVillageLives), cast_schedule.js (exports); importer lists by grep.
- Docs read: root doc (whole), WORLD_CORE_KIT K6-K8 and K20-K26 rows, ACTIVITY_ABSTRACTION_RULES, LEAD_LIFE_RULES section A, RULES_INDEX AD5, AD22, AD32, AD33, AD38, AD46, AD51, AD52, A_SOLDIERS_LIFE sections 2, 3, 7, 10, HP passes (places, roles, law findings), BF29, CHARACTERS_AND_WORLD_EVENTS (identity table and guards).
- Not read: other worlds' institution docs beyond headings, LIFE_SIM_NORTH_STAR (7909 lines; mercenary appears at lines 1681 and 1912 only as passing mentions, not opened), IDEA_INDEX in full, `jurisdiction_rules.js` body, `world_events.js`, `life_events.js`, `own_holdings.js` beyond the purse lines, HP world pack data for any house-points mechanism.
- Nothing run. No test, build or browser check. Classifications of R4, R10, R12 rest on grep importer and field checks, which can miss dynamic imports (inferred low risk).
