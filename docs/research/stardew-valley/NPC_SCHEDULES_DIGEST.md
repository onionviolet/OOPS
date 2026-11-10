# NPC schedules digest: Stardew Valley and Rune Factory 5 (FRC49, 2026-11-10)

Digest of how each game plans where an NPC is through the day and what happens at the day boundary, for RCL7 (schedule midnight rule). Paraphrased; no dialogue or schedule text copied. Labels: SHOWN = read in the decompiled code or captured table, with locator; STATED = a committed note says so; INFERRED = mine.

Locators below are in private, gitignored captures: `stardew-valley/private/fs-stardew/code/` (decompiled C#) and `rune-factory-5/private/fs-rune-factory-5/tables/` (extracted Unity tables). No game was launched.

## Stardew Valley

### Clock and day boundary (SHOWN)
- The clock is an integer HHMM. One game minute is 700 ms real; the clock advances in ten-minute steps (`Game1.cs` ~2139, `performTenMinuteClockUpdate` ~5865). Minutes roll over at 60 to the next hour.
- The clock is capped at 2600 (2 a.m.), not at midnight (`Game1.cs` ~5880). Times 2400 and 2500 only show a warning and a player emote; there is no reset at 2400 (`Game1.cs` ~5944-5953).
- At 2600, or stamina at -15 or below, the player is forced to pass out when free to act (`Game1.cs` ~6436); `PassOutNewDay` then runs the same `NewDay` as sleeping (`Game1.cs` ~10323). Sleeping earlier also ends the day. The day counter and season advance only inside `NewDay`, which sets the clock back to 600 (~7801).
- So the "day" is a play session ending at bed or 2600, not a calendar midnight. NPCs never see a midnight event; they see the next `NewDay`.

### What NPCs do overnight (SHOWN)
`NPC.dayUpdate` (`NPC.cs` ~6120) clears the queued routes, resets the last-attempted-time marker to -1, stops any path, warps the NPC to its home map and tile (`defaultMap`, `defaultPosition`), clears sleeping and kiss flags, and clears the "ignore schedule today" flag. NPC positions are therefore reset, not simulated through the night. A failed warp is only logged.

### Picking today's schedule (SHOWN, `NPC.cs` `TryLoadSchedule` ~5788)
Called when the day starts (~1183). First match wins, in this order:
1. Green-rain special (year 1 only), then an island schedule if one is set.
2. Active passive festivals (day-of-festival key, then plain festival key); a spouse tries a marriage-prefixed key first.
3. Spouse: season-and-date marriage key, then a job key for a few named spouses on some weekdays, then a weekday marriage key if it is not raining.
4. Non-spouse, most specific to least: season_date; date with a heart tier (friendship points / 250 sets the tier, tried downward); plain date; a bus key for one NPC after a mail flag; rain keys (a coin flip between two) if it is raining where they stand; season_weekday_tier; season_weekday; weekday_tier; weekday; season; spring_weekday; spring. If nothing matches the schedule is cleared and the NPC just stays at home position.

### Schedule row format (SHOWN, `parseMasterScheduleImpl` ~5492)
A schedule is a line of comma-separated entries. Each entry: a time (an `a` prefix is read as an arrival-time flag), a location, tile x and y, a facing, and optionally an end animation and a quoted end message. Directives at the start of a schedule: GOTO another key (or "season", or "no_schedule" which turns following off), NOT friendship with a named NPC and a heart threshold, MAIL with a mail flag. A `bed` entry resolves to the spouse's door spot for married NPCs, otherwise to the last entry of the `default` or `spring` schedule, otherwise the home tile, and adds a sleep animation if one exists for that NPC. If a destination location is inaccessible a `_Replacement` entry is used, falling back to the default or spring schedule. Default start is 610 when a route is first built. The raw Data/Schedules assets themselves are not in the capture (only the code), so no per-NPC times are recorded here.

### Running the schedule (SHOWN, `NPC.checkSchedule` ~4126)
At each ten-minute tick every NPC compares the clock to its table (`Game1.cs` ~13488). Each hour boundary additionally replays checks for the previous five ten-minute marks, so an entry missed during a pause or skip still fires (`addHour` ~13430-13448). A queued entry fires once the clock reaches its time and the NPC is not mid-route. Entries are not applied if "ignore schedule today" is set (events and similar) or the schedule is null. Time keys are keyed by exact integer, and the day's last `bed` entry is how an NPC goes to sleep (`isSleeping` set ~4584).

### Related clock hooks (SHOWN, unexplored)
One talk-handler condition tests the clock against 2200 (`NPC.cs` ~2582) and outdoor idle banter tests it against 1800 (~3407); what each gates in play is not traced.

## Rune Factory 5

### What is captured (SHOWN)
Only two lifecycle tables are extracted: `Date_001.json` (NpcId 2) and `Def_000_h1.json` (NpcId 2). Hundreds more lifecycle assets and 30 lottery assets exist in the catalog but are not read (STATED, `aspects-2026-10-14/DEEPER_SYSTEMS.md` D3).

Table fields: `NpcId`, `TimeList` (rows of Time as HHMM, a Margine of 0 or 10, ExtractTime), `WeatherList` (weather id 0, 3, 4, 5 each with a TimeOffset that is the starting row of that weather's block), and `TimeData` (rows of TargetPlace, TargetPlaceName, TargetState, ActionName, LoopActionName, EndActionName, EndActionClearName). TimeData holds one row per time per weather: Date_001 has 4 times x 4 weathers = 16 rows; Def_000_h1 has 7 times x 4 weathers = 28 rows (SHOWN).

Sample times:
- `Date_001`: 600, 700, 800, 2300 (Margine 10 except the first).
- `Def_000_h1`: 600, 700, 1100, 1300, 1700, 1900, 2300.
- Both tables start at 600 and end at 2300 in every weather block. No row exceeds 2400 (SHOWN).

Place and state ids are numeric. Most rows use place 100 with states 2, 4 or 7; others name place 6, 22, 28 or 101. Meaning of these ids, the Margine and what state 7 at 2300 does are not in the captured text (INFERRED: place 100 is the NPC's default spot, and state 7 at 2300 is the bedtime state; unconfirmed). Action names in these samples are empty.

Other tables: `NpcStatusDataTable` has 30 NPCs with a Home id, a Job id (6 have no job, -1) and a bed patrol point name for all 30, so every NPC has a bed place (SHOWN). `TimeConst.MultiplicationTimeSpeed` is 0.5 (SHOWN, scalar meaning unconfirmed). `TimeScaleDataTableArray` has five curve tables (ids 1-5) with 3-4 keys each (SHOWN; INFERRED: they shape how fast time runs through the day).

### Day boundary
The captured data does not show an explicit midnight rule: the latest schedule time is 2300, and what moves NPCs at the end of the day, whether the day ends at 2400, and how the clock treats 2400 and later are not in these tables (not established). The persistent NPC record keeps place, lifecycle state and event context (STATED, D3), so NPCs probably carry position over save, but no code was read.

## Findings most useful for RCL7 (the schedule midnight rule)

1. The day ends at bed or a hard cap, not at 0:00. Stardew caps the clock at 2600 and forces a pass-out; the date flips only in the new-day routine, with the clock back to 600. Treat "midnight" as a soft limit before the next wake. (SHOWN)
2. Overnight NPCs are reset, not simulated: they are warped to their home point, queues cleared, sleep and ignore flags cleared, then a new schedule is chosen for the new date. (SHOWN)
3. Schedule choice is a priority list keyed by festival, season/date, friendship tier, weather, weekday, season, then a spring default, with a fallback of standing at home. A player-facing schedule needs the same "what applies today" resolution at wake-up, not a fixed table. (SHOWN)
4. Missed times are caught up: each hour replays the previous few ten-minute checks, so a skipped or paused stretch does not lose a scheduled move. (SHOWN)
5. Rune Factory 5 authors a schedule as a time list times a weather list, with the last time at 2300 and a bed place per NPC; no row past 2400 in the two samples. A schedule can end at a fixed bedtime with the rest of the night left to the reset. (SHOWN for samples; the rest INFERRED)

## Gaps

Stardew's Data/Schedules assets and NPC-by-NPC times; RF5's other lifecycle tables, the meaning of the place/state ids, and its clock cap and day-end routine. A follow-up read of the RF5 clock code (not in the capture) would settle the midnight rule there.
