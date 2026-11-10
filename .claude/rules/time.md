---
paths:
  - "src/world_calendar*.js"
  - "src/world_day_index.js"
  - "src/world_rhythm.js"
  - "src/game_time.js"
  - "src/clock_owner.js"
  - "src/simulation_clock.js"
  - "src/away_*.js"
  - "src/owned_place_clock*.js"
  - "src/weather*.js"
  - "src/world_climate.js"
  - "src/chronicle.js"
  - "src/world_instances.js"
  - "src/cast_schedule.js"
  - "src/npc_schedule.js"
  - "src/expansion_engine.js"
  - "docs/TIME_RULES.md"
---

Code here follows [time rules](docs/TIME_RULES.md) TMR1–TMR18 (clocks, calendars, time away, skips, recaps, aging): working defaults under AD56, adjustable; lines in the [limiting lines review](docs/audits/LIMITING_LINES_REVIEW_2026-11-10.md) stay proposals. Add no clock counter: read the day through `dayIndex` or `resolveWorldCalendar`; each timer declares catch up, pause or spoil; long runs stop at the one stop list; catch-up gives the same draws in one step or many. Cite the codes you apply in the task record or commit message; `node scripts/rule_routes.mjs --for <path>` lists them.
