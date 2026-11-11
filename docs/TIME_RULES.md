# Time rules

Working defaults 2026-11-10 under AD56 (ideas that open possibilities are welcome), adjustable; the lines listed in the [limiting lines review](audits/LIMITING_LINES_REVIEW_2026-11-10.md) stay proposals until Weibao answers. Drafted as proposals the same day (AD32). Requested by Weibao ("Draft all four", [log](gm/USER_VISION_LOG_2026-11.md#four-more-rulebooks-and-cheats-brought-forward-2026-11-10)). Rows marked **(restates)** repeat a rule that already binds through its own code and add no authority.

Covers game time: world clocks and calendars, days, seasons and eras, time while the player is away, routines while away, worlds that are not being played, skips and compressed periods, return recaps, schedules and deadlines, and aging. A world may set any line differently with an in-world reason and cost (AD5, AD38); each row gives the default, the dial and the reason.

Scope, from his direction: "routines should keep progressing while away, but pause for important choices. Offline aging can be optional and depend on the world" (OD4, 2026-10-15); "Time should pass during ordinary play, but we should also be able to compress settled routines" (OD23, 2026-10-15); "Schedule rather than deadline should be the case, unless it is a deadline like the protagonist of the original book" (2026-10-27); "Different clocks run but only those that matter to specific life matters?" (2026-10-27, words recorded, model not accepted); "Consider Idle mode where time doesnt move?" (2026-10-18, a proposal); travel time is real but does not decide the quality of play (2026-10-30); long play is welcome (2026-11-01, 2026-11-04).

Owners and neighbours (linked, not restated): Rulebook 7 in [RULES_FROM_SCRATCH](RULES_FROM_SCRATCH.md#the-rulebook-accepted-2026-10-10); AD15–AD18 in the [rules index](RULES_INDEX.md#time-and-being-away); ACR2, ACR7–ACR9, ACR11 in [activity rules](ACTIVITY_ABSTRACTION_RULES.md); MR28; SR20–SR21 in [site rules](SITE_AND_EXPLORATION_RULES.md); GR17 in [generation rules](GENERATION_FOUNDATION_RULES_2026-10-14.md); PIR20, BHR18, BHR28 in [domain rules](DOMAIN_RULES.md); WA37; LVR6–LVR7 in [livelihood rules](LIVELIHOOD_RULES.md). Detail: BT1–BT10 in [direction synthesis](DIRECTION_SYNTHESIS.md#banking-unused-offline-time-consideration-2026-10-15), [offline and branch clock audit](research/OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md), atlas LAYX110, LAYX196, LAYX206. Code map: [area guide](AREA_GUIDE.md), "Time and calendar" and "Schedules and presence"; its claim that no shared day-index reader exists is stale (`world_day_index.js` is one).

## Terms

"Away" means four different things, and each has its own answer.

| Term | Means |
| --- | --- |
| Closed | The game is not running; wall time passes |
| Elsewhere | The game runs and the player is in the same world but not at this place |
| Off-world | The player is in another world; this world is not being played |
| Skipped | The player chose to pass time (spend banked time, compress a routine, wait) |
| Played minutes | Game minutes that actually ran in a world, by play or by a skip |
| Body clock | A person's own time (age, healing, hunger); it can differ from the world's |

## Clocks

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| TMR1 | **One root clock; worlds read it.** Played minutes advance `state.clock` in `expansion_engine.js`; each world projects its own calendar from it. | Default: `resolveWorldCalendar` and `dayIndex` (`world_day_index.js`) are the readers; a new feature adds no clock counter. Dial: a world's calendar profile. Reason: the area guide's "do not add another clock counter"; LOTM's own `lotmDay` (twice) and the 12×30 constant in `world_rhythm.js` are the cases to fold in when touched. | AR3, AREA_GUIDE |
| TMR2 | **Each world has its own calendar.** Month lengths, weekdays, festivals, seasons and eras are world data. | Default: a calendar profile in `world_calendar_content.js`; seasons only where the world defines them. Dial: per world; a world with no calendar uses plain day numbers. Reason: AD46; a sect's lunar months and Hogwarts' terms are not the same year. | AD46, LVR7 |
| TMR3 | **Clocks are scoped to what they touch.** A world clock, a body clock and a place clock (a stilled room, a sealed vault) can run at different rates. | Default: one world clock and one body clock per person; a place clock only through a mechanism (`owned_place_clock.js`). Dial: a world with time-dilated places or a 3:1 realm. Reason: his "many clocks" question; a clock that touches nothing is not saved. | GR17, BHR28 |
| TMR4 | **Draws key on the owning clock** (restates GR17, MR28). | Default: catching up in one step or many gives the same results. Dial: none. Reason: a skip that rerolls the world breaks trust. `tests/headless/away_bank_equivalence.test.js` plays N minutes live and spends N banked minutes from one save and seed (hearth, woodcutting, sleeping, a blocking choice mid-run) and allows only the bank debit to differ; it runs on request, not in `npm test`. | GR17, MR28, WA37 |

## Away

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| TMR5 | **Closed time is banked, then spent forward.** Wall time while closed becomes banked minutes the player spends through the one clock. Nothing runs on its own at load. | Default: `away_bank_domain.js` (cap 7 days); spending runs chosen routines and stops at boundaries (TMR8). Dial: an auto-spend option for chosen routines, the cap, and capacity, speed and efficiency improvements (BT6–BT8). Reason: this is how AD16's "routines keep progressing" is delivered without settling a life the player did not watch; SR21 forbids wall-clock punishment. | AD16, AD18, SR21 |
| TMR6 | **One continuing bank with a growing cap** (restates AD18). Unused away time belongs to the journey across lives and worlds. | Default: the cap starts at 7 days and grows through play, cheats, research or items (capacity, speed and efficiency improve, BT6–BT8); Weibao picked the growing cap, 2026-11-10; time past the cap is lost and the recap says how much. Dial: uncapped, per world or setting. Other banks (the Mistglass `away.js`, a cheat's own furnace bank) become capacity or efficiency dials on it when touched. Dial: per cheat or means. Reason: three banks today with three caps. | AD18, BT4 |
| TMR7 | **Elsewhere is lazy; off-world is frozen.** In the played world, a place's state is projected from its last settled minute when read. A world not being played does not advance. | Default: `habitat_care.js`'s projection for every timer in the played world (LVR6); `world_instances.js` freeze for others. Dial: a world that "moves on" without you (a summary tick, a fixed ratio) with an in-world reason. Reason: Rulebook 7 and AD16; reloading never grants stock. | AD16, LVR6, SR20 |
| TMR8 | **One list of stop points.** Any run of time (a skip, a bank spend, a compressed routine) stops at: a choice that needs the player, a known event (PIR20), a lethal edge (BHR18), an exhausted supply. | Default: `advanceSimulation`'s stop at a waiting choice plus these four; each routine names its policy. Dial: per event, the player may let it pass. Reason: AD16's "pause for important choices"; four modules each stopping for different reasons would surprise. | AD16, PIR20, BHR18, ACR8 |
| TMR9 | **Each timer says how it catches up.** A timer is one of: catches up (stock grows to a cap), pauses (waits for the player), or spoils (a perishable loses value). | Default: the kind is declared with the timer; caps are adjectives per kind. Dial: per world and good. Reason: catch-up caps disagree today (bank 7 days, household 60 days, contact decay 7 days, meetings 12, Mistglass 120 minutes); naming the kind makes each cap a choice (LAYX110). | LAYX110, SR20 |
| TMR10 | **The return recap says what happened and why it stopped** (restates AD17). | Default: minutes processed, the stop reason, pending choices, and only what the character could know. Dial: detail level. Reason: AD17 has no implemented owner; `away_bank_domain.lastReturn` holds the minutes, which is the start. | AD17, FBK |

## Skips and pace

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| TMR11 | **A skip is real time.** Every skip advances the real clocks and settles causes; nothing is skipped for free. | Default: ACR8; `fastForward` and bank spend share one path. Dial: a time power (stopping, slowing, rewinding) works by how it works, with its cost (BT3, AD38). Reason: a skip that grants results without time breaks every other system. | ACR8, AD38, BT3 |
| TMR12 | **Ordinary play advances time; settled routines compress** (restates AD15). | Default: compressed spans keep choices and consequences (AD52). Dial: pace per world and lifespan. Reason: OD23. | AD15, AD52 |
| TMR13 | **Schedules, not deadlines.** Things happen on calendars; a deadline exists only where the source fixes one, and it is forewarned. | Default: canon dates are anchors (AD49); a canon deadline shows ahead and pauses the bank spend before it. Dial: a loop world (a month that restarts) ends its calendar by its own rule. Reason: his 2026-10-27 words. | AD49, WA24 |
| TMR14 | **Travel takes time and rarely decides play.** Journeys advance the clock; their length is a dial. | Default: per world (2026-10-30). Dial: fast travel by means. Reason: his direction. | SR rules, travel legs |

## Aging and lives

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| TMR15 | **Lifespan fits what the character is; agelessness can come from a cheat or a body.** Bodies age by played minutes; closed time does not age anyone until it is spent. | Default for now: the protagonist has no lifespan limit (`chronicle.js` life mode "open"; "mortal" is the dial), and aging depth stays deferred (TMR16). Where a lifespan exists, it comes from what the character is: species, bloodline, constitution, cultivation realm, body and its history (the household medicine that supports extra years, `home_medicine.js`, is the pattern). A lifespan can be shown: the base cheat can be what shows it (a lifespan readout, CTC93), and a physician, divination or a lifespan reading can show it too; a world may keep it unknown until learned by means (KNW1). A cheat (a base cheat included), a bloodline, a realm or a species can stop aging, slow it, or show it differently (a body that stays young while its lifespan runs, a soul that ages instead). Harm to lifespan is worrisome: a technique, curse, wound, overdraft or bargain that costs years names the cost before it is paid where the character could know it, shows the loss and its cause after, and points to recourse (medicine, a realm, a treasure, a bargain); a lifespan near its end is forewarned (AD50, BHR18). Calibrate lifespans from the lead worlds' lore when aging reopens (a lore-run pass, suggested 2026-11-10, not started). Dial: lifespan on or off per start and world; shown, shown by a cheat, or learned by means; a "lived time" setting ages on wall time. Reason: OD4 made offline aging optional and per world; Weibao, 2026-11-10: "Maybe no lifespan for us right now, but make base cheat in charge of showing lifespan, or maybe we should have lifespan fitting what character we are, what bloodline or consitution and more, lifespan doesnt have to be hidden, but then if something hurts our lifespand should be worrisome". | AD16, AD50, Rulebook 7, BHR18 |
| TMR16 | **Aging depth is deferred.** No new aging, heir or family systems until Weibao raises them (2026-11-09). | Default: existing aging code stays. Dial: his word. Reason: his deferral. | TIE20, LAYX198 |
| TMR17 | **A paused life keeps its time.** When a fresh life starts, the old one pauses and resumes from where it stopped (restates AD12). | Default: frozen world rules apply. Dial: a world that moves on during a pause, by an in-world reason. Reason: AD12. | AD12, TMR7 |
| TMR18 | **Routines can improve, not only keep.** A refinement or self-improvement routine is a chosen routine like any other. | Default: a routine may refine (sharpen, temper, enchant or upgrade a held item, refine a pill or a technique) or improve the self (training, cultivation, study, meditation, practice); it spends its inputs (materials, kits, coin, energy), gains by the same rules as doing it by hand (ITM12, MR rules, the ability seam), runs through the stop list (TMR8, an exhausted supply included) and says what it gained in the return recap (TMR10). Existing routines are the pattern (`dojo_tower_routine.js`, `trial_routine.js`, `cultivation_intents.js`, `home_cultivation.js`). Dial: how much a routine gains compared with doing it by hand, per world and method. Reason: Weibao, 2026-11-10: "For routine, maybe a refinement/self improvement routine"; settled routines compress (AD15). | AD15, TMR8, TMR12, ITM12 |

## Building a timed slice

1. Name the clock it reads (TMR1, TMR3) and its catch-up kind (TMR9).
2. Read the day through `dayIndex` or `resolveWorldCalendar`; add no counter.
3. Project lazily in the played world (TMR7); test that one step and many steps give the same result (TMR4).
4. Say where a long run stops (TMR8) and what the recap shows (TMR10).
5. Tests: `tests/world_calendar.test.js`, `tests/away_bank_domain.test.js`, `tests/habitat_care.test.js`; browser proof at the desktop viewport (AD43); save, reload and import when persistence changes.

## Open details

- AD16 says routines progress while away; the code banks and spends. TMR5 states that as the default; an auto-spend option is open.
- Resolved 2026-11-10 (RCL6): one bank. The Mistglass practice draws from it at an efficiency dial, the Furnace rebases on it, and the cap grows through registered sources (play first) shown in the projection (TMR6).
- LOTM keeps its own day formula in two places (TMR1).
- Resolved 2026-11-10 (FRC40): the catch-up equivalence harness exists for four routines. Found and fixed: a spend counted ticks, so a sleeping spend of 120 minutes moved the clock 720; it now stops on the root clock (`untilClock`). Remaining: a spend can overshoot by one tick's span when a tick straddles the end; LOTM and Mistglass routines are covered at unit level only.
- AD17's recap has no owner (TMR10).
- Two schedule owners, `cast_schedule.js` and `npc_schedule.js`; one wraps midnight and one does not.
- The census of every catch-up answer (LAYX206, N10) has not run; about ten answers are known.
