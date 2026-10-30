# Whole-book queue and idea intake (2026-10-30)

Weibao: "dont forget to consider every little idea and more, and still work through implementing through the rest of the book".

This file turns the wave from hand-dispatched slices into a standing walk through all 8 LOTM volumes. Each lane owns a family across the whole book and works it volume by volume, in the order the lead's run meets it. The coordinator (this wave's planning session) owns this file; lanes report progress by message and in their own ledger rows, not by editing here. Gap codes are in the [reading gap map](../../../research/READING_GAP_MAP_2026-10-28.md); rules are WA48-WA50.

## How a lane walks the book

1. **Take the next volume for your family.** The order is the volume 1 remainder, then volumes 2-8.
2. **Shape check (WA48).** Your schema should already hold later volumes, since you sampled them. If a volume shows a new shape, extend the schema in place (AD45) and say so in your ledger row.
3. **Extract and draft on Codex.** Luna medium extracts the volume's rows of your family with locators (`cite_paragraphs.mjs`) and Sol medium drafts data and code. Sonnet reviews. Source-derived data goes in the private pack.
4. **Test and hand off.** Run your focused test, commit your own paths, and hand off to `sw-absorb` (wiring) and `sw-bridge` (UI read models).
5. **Every little idea** goes in your intake file (below) before you take the next volume. Run a short more-to-consider pass on the slice, then write ACT NOW (done in the slice), ACCOUNT FOR NOW (a constraint you applied) and LATER (with level, effort and done check).
6. **Stop lines.** Stop at Claude weekly 75% or Codex 85%; checkpoint at 80%. The hard end is Monday 2026-11-02 11:00, with the next exact volume and step recorded.

Gates run through `node scripts/slot_run.mjs` (suite, build, browser).

## Family owners across the book

| Lane | Family (gap codes) | Volume walk | Also owns |
| --- | --- | --- | --- |
| `sw-absorb` | Integration, the lead's run, cast and routines (GM1, GM5 hours, GM15 absence) | Volume 1 ledger items 1, 2, 4, 20, then per-volume cast and routine bands | Host wiring, gates, the browser floor, the card State |
| `sw-rites` | Rites, divination, summons, potions, crafts (GM17, GM27, GM28, GM8 craft) | Volume 1 slice 4, then rites and potions per volume | GM33 sealed and dangerous artifacts after volume 2 |
| `sw-adv` | Ladder and typed abilities (GM25, GM26, GM9, GM16), spells (GM40, GM8) | Rungs per volume as the lead reaches them; abilities per volume | Spells across MoL and HP (the GM40 shared seam) |
| `sw-road` | Cities, travel, personas, jurisdiction, gatherings (GM22, GM31, GM24, GM23, GM30, GM19, GM4, GM6) | One region pack per new city, in path order | GM37 languages and ciphers; GM39 creatures as route hazards |
| `sw-death` | Harm, backlash, death, restart (GM32, GM11, GM34 faith only where it affects death) | Backlash and harm rows per volume | Part-level injury `actionModifiers` |
| `sw-calendar` | Calendar, news, world events (GM18, GM36, GM38) | News and dated events per volume | GM35 who-knows-what by date (news spread is knowledge), with the GM3 owners |
| `sw-chars` | Dated character sheets (WA50) | Principals and recurring people per volume as they enter | Joins to every lane's ids |
| `sw-bridge` | Engine-to-view mappers | A new bridge whenever a lane's read model lands | The L13 gap doc |

**Not owned by this wave:**
- GM29 mind and spirit effects belong to the memory lanes (`person_memory*`). `sw-death` and `sw-chars` send them hooks, not code.
- GM20 and GM21 (populating other books' worlds, ordinary day-one lives) wait for an other-book wave.

## Idea intake

Each lane appends to its own file, `docs/gm/dispatch/sonnet-wave-2026-10-30/ideas/<lane>.md`, so no two writers share a file. Each entry gives: date, volume, the idea in one line, its class (ACT NOW / ACCOUNT FOR NOW / LATER), and for LATER the level, effort and done check. Spoiler rule: name mechanisms, not plot.

The coordinator sweeps the intake files and folds lasting items into their owners:
- rules into WA lines or their rulebook;
- gaps into GM rows;
- queue items into IDEA_INDEX QR6;
- Weibao-facing choices into a short list for him.

Nothing in an intake file is accepted direction until it is folded and, where needed, approved.
