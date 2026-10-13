# Discworld MUD ranked packets (PROPOSALS, not accepted, not implemented)

Each packet needs its own rebuild, a fresh-origin desktop browser check, and Save/reload/Import proof before anyone calls it done. Use original names; Discworld is inspiration only. Codes refer to [REPORT.md](REPORT.md).

## P1: Lives and a world psychopomp (F2)

- **Smallest result:** an opt-in world dial sets spare lives (for example 3 to 7). Each death costs one and opens a short scene with that world's death figure, where you wait and cannot raise yourself. A raiser (NPC healer or temple) returns you for coin or a favour. At zero lives the existing heir path runs, or a costly final return is offered with itemized costs: a skill cut growing per use, savings lost, a rented home lost, only a few items reclaimable.
- **Seams:** `src/heir_inheritance.js`, `src/life_record.js`, `src/chronicle.js`, `src/everyday_life.js`, reset dials in [death and reset considerations](../DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md).
- **Acceptance:** the life count persists through save, reload and import; reload never re-rolls the death; final-return costs are listed before confirming; heir-only worlds are unchanged. Needs a save compatibility decision (new field, default off).

## P2: Tree-gated skills with a level/bonus split (F3)

- **Smallest result:** one category gets two levels of dotted children; a child unlocks when its parent reaches depth x 5. Each skill shows a level and a bonus (diminishing returns times a stat weighting). Children stay hidden until reached.
- **Seams:** `src/models/skill.js` (keep `parent_multiplier`, add a gate), `src/data/skills.js`, `src/display.js:4764`, `src/gameplay_publication.js:7`.
- **Acceptance:** existing saves keep all levels and the gate never locks an owned skill; the bonus formula is in the tooltip; the desktop skills panel stays readable.

## P3: Teaching margin and teaching XP (F4)

- **Smallest result:** an NPC teaches only while their teaching bonus exceeds yours, then the UI says "outgrown". Price falls as the gap widens, up to a cap. Later the player teaches an apprentice NPC: a teaching check sets the reward, and one specialised tree raises the player's ceiling there.
- **Seams:** `src/audited_workshop_lesson.js`, `src/skill_expansion_content.js`, `src/causal_story_actors.js`, CoffeeMUD absorption packets.
- **Acceptance:** the outgrown state is visible with its reason; teaching XP is granted once per completed lesson and survives reload; teaching takes clock time.

## P4: Per-world calendar and fixed holidays (F8)

- **Smallest result:** one world data file declares month names, week length, day length and two holidays. On a holiday a recurring window opens one seasonal action. Temperature against clothing adds a mild warning with a small temporary penalty.
- **Seams:** `src/game_time.js`, `src/world_rhythm.js`, `src/weather.js`, `src/conditions.js`.
- **Acceptance:** a holiday fires once per occurrence and reload does not re-fire it; worlds without a calendar file are unchanged.

## P5: Origin bundle and language comprehension (F6, F7)

- **Smallest result:** a start choice bundles start place, currency and native language, with a difficulty flag. In one world, lines in an unknown language show as garbled text plus a gist that sharpens with a language skill. An optional one-way tutorial ends with the origin choice; a free early rescue lasts until a set level.
- **Seams:** `src/character_creation.js`, `src/data/dialogues.js`, `docs/worlds/BOOK_WORLD_ENTRY_MATRIX.md`, DDC4 in `docs/worlds/world-depth-2026-10-13/02_MOL_HP_JJK_DND.md`. Do not reuse `src/translation.js` (UI only).
- **Acceptance:** comprehension persists; garbling is deterministic per line; a gist line is always readable.
