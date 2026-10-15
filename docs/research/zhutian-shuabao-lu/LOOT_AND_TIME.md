# Loot, farming and time

## L1: data and the actual drop reader

SHOWN S06: `wp.json` is 1793x40x1, including 1,626 rows whose category cell 5 is equipment. Other category counts include 39 special and 36 material rows, plus generic manual, destiny-stone, career-change and recipe categories. These are allocated definitions, not independently verified obtainable items. `dl.json` is 31x463x1. Its orientation matters: the drop consumer loops the first axis, then indexes the enemy axis. Do not report 31 monsters merely from its first dimension.

`project/6/5/1/53` receives enemy ID, formation slot, quality, difficulty coefficient and plane ID. It joins drop definitions to items, creates weighted probability tables, selects results, derives equipment/material quality and calls the shared acquire-item function. This is executable consumer evidence beyond a list of loot names.

Common equipment/item branches compute a boosted chance weight clamped to 0..10000 and a complementary no-drop weight. One normal branch reads item column 32, scales by `(100 + saved bonus)/100`, and clamps. A dungeon-adjusted branch first calls a dungeon-rate function. Material branches use different source inputs and a 0..100 clamp, including a halving term. These are distinct pools, not one universal chance formula. Generated expression IDs 10419-10423 and 10446-10453 preserve the actual bindings. Special guaranteed branches put zero weight on no-drop; a large weight there is not a rare percentage.

No expected loot-per-hour is claimed. It needs spawn frequency, kill throughput, difficulty, modifier order, retries and the selected player's build. No pity counter was established. AdvancedRandom includes seeded facilities, but the presence of that plugin does not prove all drops are deterministically seeded or persisted.

## L2: tiers and resource decisions

STATED S04: better equipment quality affects base stats, affix count and coefficient range; affixes can be rerolled (`bz[7,45]`, `[2,45]`). Equipment can come from battles, crafting and secret realms (`[4,16]`). Higher-quality manuals trade greater effect for slower practice (`[2,46]`). Same-quality/tier destiny stones can be combined four-to-one without changing their kind (`[2,30]`). Full quality-name mapping and all crafting rates remain unread.

STATED: dungeons yield refinement stones, rebirth materials, special sets and vault keys (`bz[4,55]`); harder dungeons supply higher rebirth materials (`[3,43]`). This links combat, equipment and progression services rather than treating every reward as cash.

## L3: automation and clocks

SHOWN S14: separate event groups handle auto progression, skills, loops, secret realms, tower, ladder, beast king/waves, alternate worlds, guardians and dungeons. Settlement/retry is separate from drop generation. This is active-process automation evidence. It does not establish browser-closed production.

STATED: auto battle selects up to three configured skills in priority order when conditions are met (`bz[8,17]`). Battle speed changes animation rate without changing city-management time (`[2,34]`). Skill practice follows a queue (`[6,32]`); faction tasks initially refresh every ten minutes (`[3,38]`). These numbers describe the source help, not accepted YAIRPG tuning.

SHOWN S08: time subsystem uses periodic conditions, saved elapsed-time coordinates, day/hour/year variables, month cutoffs, pause checks and autosave calls. It has an interval expression based on time scale, consistent with the authored clock distinction. Full scheduling, catch-up and offline timestamp reconciliation are not decoded. Literal searches for offline terminology in event labels and generated expressions found none; that negative search is not proof of absence.

YAIRPG mapping: K8/K9/K13/K18/K26/K32/K34; P01/P02/P08/P13/P15/P17/P24. Current OD4 already supplies away progress and choice/exhaustion stops. Borrow the clear routine/receipt distinction, not an unsupported source offline formula.

SHOWN S16: a separate compact idle-display mode adjusts window/canvas dimensions, selected backgrounds, sound state and activity/status, with a return handler restoring the main canvas. It supplies a reduced online presentation, not evidence of closed-app catch-up or measured energy savings. The selected flow is retained as `notes/spirit-wandering.decoded.json`.
