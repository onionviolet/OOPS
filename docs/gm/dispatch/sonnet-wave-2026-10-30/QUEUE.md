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

## Round 2: wiring, floor and improvement pass (2026-10-30 02:30)

Weibao: "Send out next sonnet waves accordingly, or have each chat do so, do the iterative improvement pass".

**State:** the L-A checkpoint says every engine slice is "landed, read model only". Divination has the one host consumer, and nothing supplies its facts. No scripted Chrome floor runner exists. Load is down to about 5 with the slot limiter. Claude weekly is at 53% and Codex at 29%, so Codex is underused.

**Ownership changes (no duplicate writers):**
- **New lane `sw-wire`** takes ownership of the LOTM host files (`src/book_world_lotm_{host,state,cast_host}.js`, `src/simulation.js` wiring, `src/domain_registry.js` registrations). It wires each landed read model to a playable host consumer in the lead's run.
- **`sw-absorb`** keeps the lead's-run data line (place mapping, timing, routine bands) and becomes the gate owner: full suite, build and browser floor through the limiter. Host edits go to `sw-wire` as patches.
- **`sw-slots`** builds the scripted Chrome floor runner, which `sw-absorb` and `sw-wire` use.
- **`sw-gaps`** sweeps the `ideas/` intake into the owners (WA lines, GM rows, QR6, a short choices list for Weibao) and repeats the sweep each round.

**Every lane's improvement pass, before its next volume:**
1. Re-read your own committed slices with fresh eyes against your design note and the rules you cite. Look for defects, dead fields nobody reads (WA41), blanket claims written as absolutes instead of default, dial and reason, tests that pin incidental shapes, and duplicates of another lane's model.
2. Fix them in one commit, and log what you found in your intake file.
3. Then continue your volume walk. Codex is the bulk route: up to 3 Codex lanes per Sonnet lane, about 10 across the wave, and stop launching at Codex 85%. Lanes may run their own Codex waves but do not start new Claude sessions; ask the coordinator.

## Round 2 results and overnight (2026-10-30 02:50)

Landed after round 2's improvement passes:

| Lane | Commits | What landed |
| --- | --- | --- |
| L10 | `a5c5a3a09`, `31ab6c6df` | Sequence 5 |
| L11 | `dc6f42cca`, `1e6ae2429` | Slice 6 |
| L14 | `bdc9de9b6`, `9c7fb2ece` | Second-hand spread and `whoKnows` |
| L9 | `b41eec320` | Backlash walk; audit lane still running |
| L4 | `9e4bf365d` | Volume 2 rites |
| Idea sweep | `cee7415e1` | All 141 intake lines folded |

Every slice is still unwired. `sw-wire` owns wiring from `WIRING_HANDOFF_FROM_L-A.md`, and `sw-slots` is building the Chrome floor runner. Most lanes still skip Codex, so Sonnet does work Codex could.

Overnight: Weibao is asleep. The overnight supervisor (`local_9346d8a9`, [rules](OVERNIGHT_2026-10-30.md)) nudges idle lanes on a ~40-minute tick, because this coordinator's cross-session sends cap at 10 per user turn. Next items went to `sw-road` (next cities), `sw-adv` (typed abilities volumes 2-8, more spells), `sw-calendar` (GM38 curfews, volume 1 dated scenes), `sw-bridge` (new read models) and `sw-absorb` (timing gap, place rebuild, gates). Each lane leaves a morning block at its last commit.
