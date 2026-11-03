# Trace A: research packets vs src/ (read-only, 2026-11-03)

Method: grep over src/ and tests/ (names listed in tests/ only checked by filename), then read of the cited lines. "read" = I read the consumer lines; "grep" = hit/no-hit only. Direction check: AD33 (NPC-heavy work deprioritized, RULES_INDEX.md L106/L132); PROJECT.md focus = LOTM Klein journey, book worlds, no Proto23 push. No packet is registered in PROJECT.md or RULES_INDEX (grep for the three folder names found nothing), so all are unadopted proposals.
Paths: II = docs/research/immortality-idle, IL = docs/research/immortal-life, TI = docs/research/tale-of-immortal.

| ID | claim + locator | class | src evidence | note |
|---|---|---|---|---|
| II-P1 | Bench/rack runs one batch per matching work day (II/IMPLEMENTATION_PACKETS.md `## P1`) | missing | src/home_furnishing_content.js:77 rack batch is a manual command ("Complete ... rack batch · 1 stamina + 4 min"); src/home_furnishing_host.js:15-27 only commits player commands | read. No per-station input stack or day trigger. Manual precursor exists. |
| II-P2 | Aptitude from a life's real gain, shown on death summary (`## P2`) | partial | src/continuation_retention.js `aptitudeMultipliers` (L12-14) consumed at src/skill_records_domain.js:18; shown in src/continuation_ui.js:80-81 | read. Aptitude carrier exists but is bought (insight or 50*n coins, `purchaseAnchor`), not derived from life gain; no gain delta in lifeGrave (src/life_experience.js:45). |
| II-P3 | Named saved plans + one switch trigger + "start of life" plan (`## P3`) | partial | src/simulation_contracts.js:321 `programs` one per actor; src/feature_expansion_work_plan.js cursors; src/trial_routine.js (routine with maxRisk/maxUnits/reserve) | read of validators only. No names, no trigger list, no start-of-life plan. |
| II-P4 | Heir inherits most-practised trade; one apprenticeship per life (`## P4`) | missing | src/family_tree.js:20 / chronicle_ui.js:103 only record inheritance recipient "apprentice" vs kin | read. No per-trade day tally, no family-trade bonus, no open-apprenticeship lock (grep `familyTrade` empty). |
| II-P5 | Lifespan ledger, meal ceilings, opt-in pause (`## P5`) | partial | src/chronicle.js:105 `lifespanDeadline`, :119-121 last-year note; src/chronicle_ui.js:95-96 shows total only; src/simulation.js:522,653 `lifePolicy.lifespan`; src/home_medicine.js:43 "supported lifespan" text | read. Last-year note exists. No source map, no meal ceiling, no pause setting. home_medicine lifespan line not fully read. |
| II-Considered | F7, F11, F12, F13, F16 unranked options (`## Considered, not ranked`) | not traced | none | Declared multi-seam options; left untraced on purpose. |
| II-T01 | Lifespan tooltip lists sources (SMALL_TOUCHES.md T01) | missing | src/chronicle_ui.js:95-96 total only | read. Depends on II-P5 source map. |
| II-T02 | Distinct death text per cause (T02) | partial | src/defeat_domain.js:12,70-76 `publishDeathCause`/`deathCauseTally`; src/household_fortunes.js:47 `causeOfDeath` (NPC households); src/life_experience.js:17-24 `lifeEpitaph` ignores cause | read. Cause is recorded; the player grave text does not use it. |
| II-T03 | Pause one day before old age (T03) | missing | src/chronicle.js:119 last-year note only | read. No pause setting. |
| II-T04 | Summary shows aptitude gains / new start values (T04) | missing | lifeGrave returns name/age/epitaph/lesson/lived only | read. |
| II-T05 | "Show summary each life" checkbox (T05) | missing | grep `showSummary` no hit | grep. |
| II-T06 | Auto-rest names the short resource (T06) | partial | src/mixture_feedback.js:57 `stopReason` text for crafting repeat queues | grep+partial read. Only the mixture queue; general routine not checked. |
| II-T07 | Collapse costs days (T07) | partial | src/defeat_domain.js collapse guard comment (RC2/BHR17) | grep only. Fainting exists; day-loss cost not verified. |
| II-T08 | Routine names the blocking entry when idle (T08) | missing | grep no hit for blocking-entry text | grep. |
| II-T09 | Locked loop entries skipped, shown greyed (T09) | missing | no hit | grep. |
| II-T10 | Per-item reserve count for auto-sell/use (T10) | partial | src/trial_routine.js:21 `stock - r.reserve` for the trial routine only | read. Different feature (trial units), not favourites auto-sell. |
| II-T11 | Auto-balance use:sell ratio (T11) | missing | no hit | grep. Marked "later" in source. |
| II-T12 | Upkeep debt with visible consequence (T12) | missing | grep rent/tithe/upkeep: no mechanic | grep. |
| II-T13 | Re-placing furniture is free (T13) | not traced | src/home_model.js:136-148 has remove/move_cat for residences, not furnishing re-place | grep only. Unclear. |
| II-T14 | Furniture scoring by slot/colour/element (T14) | missing | no hit | grep. |
| II-T15 | Hidden concept shows known prereqs, ???? unknown (T15) | partial | src/workspace_disclosure.js:37 masks unseen controls with `???????`; src/models/skill.js:12 unknown name | grep. Different layer (UI disclosure, skill names). |
| II-T16 | "More study may reveal others" hint (T16) | missing | no hit | grep. |
| II-T17 | Block prefixes to steer generated techniques (T17) | missing | no generated-technique system found | grep. |
| II-T18 | One-line help on every panel (T18) | missing | no `helpText` hit | grep. May exist under other names. |
| II-T19 | Separate storage key for preview builds (T19) | partial | src/main.js:486-487 `save_key` and `dev_save_key` | read. Dev key exists; branch-keyed preview key not seen. src/main.js:466 fresh-probe origin logic is related. |
| II-T20 | Balanced-week yin/yang bonus (T20) | missing | no hit | grep. |
| IL-P1 | Skilled work earns a trial application for an optional realm trial (IL/IMPLEMENTATION_PACKETS.md `## P1`) | missing | src/techniques.js staged practice exists; no profession-receipt-to-trial-application link found (src/pledges_domain.js / trial_routine.js are the trial side) | grep+partial read. Packet itself says gap not located. |
| IL-P2 | Repair of a place unlocks a lesson/service (`## P2`) | partial | src/agreed_duty_host.js:37,132 repair/lesson/ordinary route; src/audit_remainder_home_content.js:55-64 guest-room frame/finish; src/home_building_panel.js:31 | read of lines. Repair-then-teacher access exists in agreed_duty; a general facility-condition gate not verified. |
| IL-P3 | Friend stays, then can leave (`## P3`) | partial | src/audit_remainder_home_content.js:47-50,79,146-177 room_terms, unoccupied/occupied, resident Neri, funded work | read of lines. Resident occupancy exists; voluntary leave/renegotiate and restay not seen. AD33 applies (NPC-heavy). |
| IL-P4 | Specialist errand for a supply bundle (`## P4-P7` table) | missing | no delegation consumer found | grep. |
| IL-P5 | Paid lesson raises a capped stat/application (table) | partial | src/storylet_content.js:57 "Pay for a lesson · 8 coins" (xp Perception); src/home_school*.js exist | grep. Lesson cap tied to advancement not verified. |
| IL-P6 | One blessing modifies one named process (table) | missing | grep bless/pray: only quest text (src/quests.js:520) and a craft row | grep. |
| IL-P7 | Appointment changes a known actor's whereabouts (table) | partial | src/cast_schedule.js `whereabouts`/`compileCastSchedule`, used in src/book_world_lotm_cast_host.js:256,309,549 | read. Schedules exist for the LOTM cast; appointment override and earned-location clue not verified. |
| IL-T1..T5 | Work remembers its use; separate readiness bars; occupation-shaped trial choices; ordinary reward without initiation; no menu XP (IL/SMALL_TOUCHES.md) | missing | all depend on IL-P1 | grep. T4 and T5 are rules the existing code already respects incidentally (no XP for viewing), unverified. |
| IL-T6..T10 | Teacher topic; capacity-after-growth; class hours; paid-attendance receipt; recovery-site identity | not traced (T6, T7, T8 missing; T9 partial) | T9: storylet paid lesson at storylet_content.js:57 records payment; others no hit | grep. |
| IL-T11..T14 | Repair unlock preview; development vs renown; contribution vs cash; seasonal support bundle | not traced | none | Tied to IL-P2 school/sect model; no sect development state found. |
| IL-T15..T16 | Specialist destination; attributed return | missing | tied to IL-P4 | grep. |
| IL-T17..T22 | Gift preferences, birthday, friendship opens story, roommate wording, quiet talks, departure keeps person | partial/missing | src/person_memory_effects.js has memory kinds (helped/harmed/told); no gift-preference or birthday state (grep `giftPref` empty) | grep. Roommate wording relates to IL-P3 resident content. |
| IL-T23 | Known whereabouts clue | partial | src/cast_schedule.js `awayReason` imported at book_world_lotm_cast_host.js:16 | grep. Reason text exists in LOTM host. |
| IL-T24 | Specific fortune receipt | missing | tied to IL-P6 | grep. |
| TI-P1 | Memory has a job: promise creates directed memory, later request reads causal receipt (TI/IMPLEMENTATION_PACKETS.md P1) | partial | src/person_memory_effects.js:12 `KIND_WEIGHTS`, topics; src/person_memory.js remember/readMemories; src/audit_remainder_consequences_facts.js:31 memory matched to receipt `cause`; src/causal_story_core.js:114 | read. Directed memory plus receipt linkage exists. Craftsman-promise flow, expiry vs compaction split not verified. |
| TI-P2 | Funded work circle with wages and arrears (P2) | missing (deferred by AD33) | src/proto23_world_content.js:75 single wage payment; src/audit_remainder_home_content.js:177 funded resident work; no monthly wage/arrears owner | grep. Single payments exist, no recurring obligation or arrears. NPC-heavy, AD33. |
| TI-P3 | Caravan with notice, arrival, expiry, rumour (P3) | missing | caravan appears only in book-cultivation design text (src/feature_expansion_book_cultivation.js:194,270,293); src/storylet_content.js has timed opportunity cards but no expiry-to-rumour chain | grep. |
| TI-P4 | Preparation creates mastery: skill+tool+materials milestone, failure recovery obligation (P4) | partial | src/crafting_recipes.js, src/alloy_equipment.js, src/lotm_craft_rows.js (staged craft rows) | grep only. Individual pieces exist; the single milestone gate with timed repair obligation not located. |
| TI-P5 | Named lives and a population, coarse calendar livelihood (P5) | partial (deferred by AD33) | src/npc_lives.js:1-15 yearly public household lives, village_family.js | read header. Yearly lives exist; no livelihood decision or aggregate-to-named promotion. AD33. |
| TI-P6 | Eligible, rare, well-spaced seasonal encounter (P6) | already-implemented (core) | src/storylet_content.js:16-21 weight/cooldown/family/once; src/storylet_ui.js:10,28 temper and draw; tests/storylet_deck.test.js | read lines. Eligibility, cooldown and weight exist. Monthly disruption cap, RNG persistence and reload no-reroll not verified. |
| TI-P7 | Conduct opens inheritance: elder lesson checks earlier obligation (P7) | partial | src/chronicle.js elder ties; src/event_feed.js:97 `dutyKept` promise note; src/life_experience.js:19-20 | read. Elder ties and promise exist; betrayal-refusal-plus-repair lesson path not seen. |
| TI-P8 | Sealed threat: inspect/reseal/release site state (P8) | missing | grep reseal: only cultivation condensate seals (src/home_cultivation.js:28) | grep. Unrelated mechanic. |

## 5 highest-value MISSING items (fit PROJECT.md focus and AD33)
1. II-P2 gain-derived aptitude: aptitude carrier and consumer already exist (continuation_retention.js, skill_records_domain.js:18), so only the life-gain source and summary line are new. Cheapest real gap.
2. II-P3 plan trigger: one named plan and a threshold switch on top of `simulation.programs`; the schema bump is small and it serves idle play directly.
3. II-P5 / T01 / T03 lifespan ledger: deadline, last-year note and tooltip exist; a source map plus tooltip list is a small, visible step.
4. II-T02 / T04 grave text by cause: cause tally already published (defeat_domain.js), only the epitaph consumer is missing.
5. IL-P1 trial application from earned work: the packet's own gap statement holds; needs a new consumer, medium cost. (II-P1 passive bench is next; both are non-NPC, so AD33 does not defer them.)

## Could not trace / weak evidence
- II-Considered (F7, F11, F12, F13, F16) not traced by design.
- IL-T6..T14 and TI-P4 only grepped by keyword; the sect development/renown model and the single-milestone craft gate may exist under other names.
- TI-P6 persistence (saved RNG, no reroll) and TI-P1 compaction behaviour were not read in the code.
- II-T13, II-T18, II-T06 (non-mixture routines) uncertain: keyword misses are weak evidence.
- Tests were matched by filename only; no test was run and none was read for assertions.
