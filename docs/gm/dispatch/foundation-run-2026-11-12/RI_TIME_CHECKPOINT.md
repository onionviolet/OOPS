# Reverend Insanity gets time: RWT24, RWT25, RWT27 (2026-11-14)

Spec: `docs/audits/REFINEMENT_WILL_AND_CANON_TIME_2026-11-14.md` (RWT10-RWT13, RWT24-RWT28). Rules applied: TMR1, TMR2, TMR8, TMR13; OD7/OD8
(`docs/TIMELINES_AND_DIVERGENCE.md`); AREA_GUIDE "Time and calendar"; OR1, PC95, AD38, AD56. Target viewport 1920x1080; mobile deferred.
All dials below are proposals under AD56 (default, dial, reason), none removes an option.

## What changed

| Item | Where | Result |
|---|---|---|
| RWT24 calendar | `src/world_calendar_content.js` (profile `book.ri.lead.world`, `RI_CALENDAR_DIALS`), `src/ri_calendar.js` (binding), `src/world_calendar.js` (`seasonFor`, `calendarDayIndex`, `named` format, binding call) | His life reads "12 March, year 1, Spring" at the start; the date and season follow the one game clock. Seasons are rows in the profile (`seasons: [{id, from: {month, day}, signs}]`); `seasons: true` keeps the old quarter rule for the frontier. |
| RWT25 recurrence | `src/world_events.js` | `placement: 'recurring'` with `recur: {every: {days, years}, fromDay, untilDay, durationDays, phaseDays}`; `windowOn`, `standingOn`; recurring rows work with `happenedOn` and `restrictionsOn`. LOTM's dated rows are untouched (`tests/world_events*.test.js` pass). |
| RWT27 tide phases | `src/ri_wolf_tide.js` | `RI_TIDE_BOOK` (one annual row), `riWolfTidePhase(state)`, `riWolfTidePhaseLine`, `RI_TIDE_PHASES`; `riEncounterWeights` and `riWolfFoe` read the phase. |
| Tests | `tests/ri_calendar_tide.test.js` (6 tests) | date and season, no date before the life begins, fixture knob, recurrence incl. errors, phase by date for two years, weights and big-wolf draws by phase. |

## Canon anchors and dials (ids and locators only; no prose)

Beat ids are in `lead-run/1.3` (private). Basis: S = stated in the beat, authored = a dial the source does not state.

| Value | Default | Basis and reason |
|---|---|---|
| Life start | 12 March, year 1, 06:00 | Awakening Ceremony in spring (00401, 00405; March is spring at 210704); the day is authored. |
| Months | Named months, 365-day year | The source counts "March", "July", "October 24"; lengths authored. |
| Seasons | Winter from 1 Dec, Spring from 1 Feb, Summer from 1 May, Autumn from 1 Sep | Signs: spring rain 03603, scorching sun 07204, cool autumn wind 211907, snow 08003/212202, first tide in summer 213101/213701, end of summer 216103. Boundaries authored. One beat calls July "the start of autumn" (211607); set aside (dial: autumn from August). |
| Tide window | From year 2, 15 July, 45 days; early/peak/ebb 15 days each | First tide mid-to-late July in the second year (213101); the first year shows only a small beast tide in winter (09501) (dial: from year 1). The second tide of the year, his first night at the wall (214901), falls in the peak (authored). |
| Phase effects | early: crowd 700, big 500, big-wolf share .1; peak: 1300, 1500, .3; ebb: 600, 400, .1; off: neutral | Authored. `off` is neutral so a dateless life or a date outside the window keeps today's patrol weights. |

## Differences from the brief, to settle

- **D1: anchor.** The brief says to anchor on "the second wolf tide this year". The life starts at the Awakening (spring, year 1), so the calendar starts there and the tide falls about 16 months of play later. The ch149 night is recorded as inside the peak. For a stage that starts at the tide, a fixture sets world fact `book.ri.lead.calendar.startedAt` (may be negative). Moving the start to the tide is a one-line dial in `RI_CALENDAR_DIALS.start`, at the cost of a start with no spring.
- **D2: `npc_schedule.js` untouched**, as instructed. It still competes with the event book for who stands where (AREA_GUIDE note added).
- **D3: who learns a recurring event** (`learnedDay`) skips recurring rows; they are read by day.
- **D4: RWT28 not done** (seasons with consequences: spoilage, gather yields). The season data and signs are in the profile for it.
- **D5: day strip** reads the new calendar and shows in the stages below; it shows hours, not the date. The date and season appear in the Reports line the calendar log already writes ("[ Gu Yue · 5 August, year 2, Summer ]"). A date in the strip is the UI owners' call.

## Hand-offs

- daily-loops (`local_4ce8289f-19bf-4d52-8257-3471ad07236c`) was messaged to read `riWolfTidePhase` for patrol prices, eye and herb prices, and a Reports line on phase change. I did not edit `ri_lead_day_facts.js` or `book_gu_lead_day.js`.

## Receipt (AD43 floor, one line per check)

| Check | Result |
|---|---|
| `node --test tests/ri_calendar_tide.test.js tests/world_events.test.js tests/world_calendar.test.js tests/ri_wolf_tide.test.js tests/world_day_events.test.js` | 35 pass, 0 fail |
| `npm run build` | done |
| Headless Chrome 1920x1080, fixture `ri-fang-yuan-wild-gu`, `docs/gm/dispatch/foundation-run-2026-11-12/ri_time/*.png` | fresh: "12 March, year 1 06:00, Spring", phase off, weights unchanged. Staged by the fixture knob, one fresh origin each: 1 Jun y2 off; 20 Jul y2 early (small_pack 20, quiet 26, large 6); 5 Aug y2 peak (36, 14, 18); 20 Aug y2 ebb (17, 28, 5); 20 Jul y3 early. Peak survives save, reload on the same origin. No page errors. Day strip visible in the staged stages. |
| `npm run check:arch` | pass, 0 growth |
| `npm run check:rules` | pass (one stale glob warning, `research-and-agents.md`, not mine) |
| `npm run test:changed` | run by the coordinating chat after this lane hit its usage limit: 4,529 tests, 4,527 pass, 0 fail (2 not run: skipped or todo). Same tree, plus the compression fix ec41e3d7f. |

Not exercised: the phase changing across a real clock advance in the browser (the test hook `workTicks` did not move the paused clock), so the change between phases is shown by date staging plus the unit test over two years, not by waiting. Not human-reviewed.
