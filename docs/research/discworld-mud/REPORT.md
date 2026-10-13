# Discworld MUD: source audit (2026-10-13)

**Answer first.** Discworld MUD has run as a living book world since 1991 by treating canon as fixed places, institutions, holidays and rituals, not as a plot that moves. Players live beside canon as residents with professions: guilds, cities, temples, families and elected councils. No player becomes a canon person and no canon event is replayed on a clock. Divergence goes into player-run layers on top of canon (elected magistrates with Nomic-style law, clubs, families, player-written room descriptions) that never rewrite it.

New for YAIRPG:

- **Death as a social cost (F2).** A canon Death appears, players carry a stock of lives they can restock, someone else has to raise you, and returning from a final death costs escalating, itemized losses.
- **A tree that reveals itself (F3).** Child skills are gated by the parent's level, and the trained level is separate from the bonus checks actually use.
- **A teaching margin (F4).** Who can teach whom depends on an "effective teaching bonus".
- **Origin bundle (F6).** Start city, currency and language come together, and the tutorial is one-way.

Teaching and practice gains in general are covered by the CoffeeMUD lane, and YAIR's canon-divergence guards already match the MUD's stance.

Findings and packets are proposals, not accepted decisions.

**Route.** The player wiki (dwwiki.mooo.com) failed TLS and served 403 bot challenges; no bypass was attempted. TV Tropes returned 403. Findings come from the official in-game help files mirrored on the web, Wikipedia, L-Space and the official blog. The wiki's numbers (life prices, the taskmaster chance formula, house rents, canon NPC behaviour) stay unverified.

Labels: verified (help) = official help file; verified (secondary) = Wikipedia or L-Space; verified (blog) = official development blog; inferred = this lane's assessment. Help URL pattern: `https://discworld.starturtle.net/lpc/playing/documentation.c?path=/concepts/<topic>` or `?path=/helpdir/<command>`.

| Code | Label | Finding |
|---|---|---|
| F1 | verified (secondary + help); behaviour partly inferred | **Canon handling.** No formal licence is documented; Wikipedia reports a 1990s cease and desist settled once the developers showed a non-commercial fan effort. Canon appears as cities, guilds, temples, holidays and rites. Rules are bent for play (MUD wizards cast without the books' once-per-memorization limit). Player-elected administration replaces canon control in places. Inferred: canon is a static setting snapshot with institutions you join. Canon NPC behaviour is unverified. |
| F2 | verified (help + secondary) | **Death.** Dying costs one life; characters start with 7 and buy more at a temple garden. Death greets each dead player but attends only one at a time, so you queue. You cannot cast while dead, so another player or NPC must raise you, perhaps for money or favours. Ghosts can `haunt` their killer. At zero lives the only return is a rare eight-wizard rite whose price is a skill cut that grows with each use, liquidated bank deposits, reclaimed houses and shops, and only a few reclaimable items. Before 2012 a character out of lives could not return. |
| F3 | verified (help + secondary) | **Skill tree.** Seven roots (adventuring, covert, crafts, faith, fighting, magic, people) with dotted paths like `magic.spells.offensive`. Advancing a skill needs depth x 5 levels in its parent. You first see only the top level and the tree unfolds as you advance. Each skill shows a level (training) and a bonus (what checks use), with diminishing returns weighted by related stats. Guild level averages about 14 primaries; primaries cap at 300 per guild. `skillcap` lets you cap yourself voluntarily. |
| F4 | verified (help + blog) | **Three ways to advance.** (1) Taskmaster: using a skill can award a level, between a lower threshold where success starts and an upper threshold where it always succeeds; success and failure can both teach. (2) Guild advance: money plus XP, cheap for guild skills. (3) Teaching: the teacher's effective teaching bonus, avg(skill bonus, min(teaching bonus, 2 x skill bonus)), must exceed the learner's bonus; learner cost falls as the gap widens, up to a cap; the teacher is rewarded only on a successful teaching check; teachers specialise in one root tree. A 2026-06-04 change made teaching take time. |
| F5 | verified (help) | **XP is a currency** earned from being online, exploring, guild commands, kills, burying corpses, quests and achievements, and spent on skill levels. Automation is strictly limited; idling online is fine. |
| F6 | verified (help) | **Origin and newbie flow.** A separate newbie area teaches guilds, quests, etiquette, combat and shops, and you cannot return once you leave. Before leaving you pick one of 13 nationalities, which sets start city, currency and native language, in principle unchangeably, with some starts flagged difficult. Safety nets: a newbie channel for 18 played hours and a free rescue teleport under level 50. |
| F7 | verified (help) | **Languages.** You know your nationality's language plus "grunt", which everyone speaks and no one understands. The old shared language was removed, so cross-region talk needs learning. Some languages are unspoken or unwritten; accents exist. |
| F8 | verified (help + blog) | **Calendar and weather.** A Disc day is a little over 7 real hours; a year is 400 days, 13 months, 8-day weeks, with fixed holidays and a real-time Hogswatch event. Temperature is deliberately mild: wrong clothing brings sweating or shivering, then temporary stat loss, then slowly worse. Getting wet cools you. |
| F9 | verified (help) | **Quests vs achievements.** Quests are secret puzzles with an in-game hint ladder (general, location, item, NPC, then full solution). Achievements are public, worth XP, announced at thresholds and hideable. Old quests can be redone. |
| F10 | verified (help) | **Families and clubs.** A family is a registered surname and nothing else; you can switch but never drop it. A relationship command records ties. Personal clubs cap at 30; elected clubs need 10 members, vote with quorum and can rent rooms. |
| F11 | verified (help + secondary) | **Citizenship and law.** Free, multiple citizenship is needed to own a house. Elected magistrates serve 20-week terms and write Nomic-style player law, with punishments up to banishment and appeals. |
| F12 | verified (help) | **Faith as a shared pool.** Each god's points refill only from worshippers' prayers; a high priest can excommunicate. |
| F13 | verified (help) | **Special abilities.** One passive at a time, learned by meditating at a hero statue; another statue swaps it. |
| F14 | verified (help + secondary) | **Housing.** Rented houses need citizenship; placed furniture rewrites the room description and a grandfather clock chimes the hours. Commercial property is won by bidding. Inactivity forfeits a rented house and elected posts. |
| F15 | verified (help) | **Presentation and contribution.** An immersive mode turns the score into prose and blocks out-of-character channels; a descriptive-numbers option shows words instead of figures. Players can become Architects who write room and NPC descriptions without coding. |

## How YAIRPG compares

- **Skill tree (F3): new.** YAIR skills are a flat 64-entry list (`src/data/skills.js`). In `src/models/skill.js`, `parent_skill` and `parent_multiplier` only boost child XP below the parent's level, the inverse of the MUD's gate. No level/bonus split, no revealing tree. Display at `src/display.js:4764`.
- **Teaching (F4): partly covered** by the CoffeeMUD lane (`docs/gm/world-implementation/second-pass/repository-bank-absorption/REPORT.md`), `src/audited_workshop_lesson.js` and the craftsman teacher in `src/skill_expansion_content.js`. New: the teaching margin, the player earning XP by teaching, one specialised teaching tree, taskmaster thresholds.
- **Death (F2): new mechanic.** Reset dials exist in [death and reset considerations](../DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md); `src/heir_inheritance.js` handles heirs. No lives, ghosts, psychopomp scene or raise-by-others in `src/`.
- **Canon divergence (F1): covered.** `src/feature_expansion_book_situated.js` blocks canonical role replacement without an authored branch; `src/book_world_mol_host.js:69` records authored divergences. The MUD adds canon institutions as joinable professions.
- **Calendar and weather (F8): partly covered** by `src/game_time.js`, `src/weather.js` and `src/world_rhythm.js`. Missing: named per-world calendars, fixed holidays, clothing-versus-temperature consequences.
- **Languages (F7): new** in code. `src/translation.js` is UI localisation only; the DDC4 row in `docs/worlds/world-depth-2026-10-13/02_MOL_HP_JJK_DND.md` covers languages as trained proficiencies.
- **Origin (F6): partly covered** by `src/character_creation.js` and `docs/worlds/BOOK_WORLD_ENTRY_MATRIX.md`. Missing: a one-way tutorial, difficulty-flagged starts, a free early rescue.
- **Families, clubs, citizenship, faith pool (F10-F12): mostly new** as systems.
- **Quests (F9): partly covered** by `src/quests.js` and `src/titles.js`; tiered hint ladders are new.
- **Housing (F14): covered** by `src/home_furnishing_*.js`.

**IP note (inferred).** The Discworld estate's guidelines (https://discworld.com/?p=14349) say names may be protected as unregistered trade marks. YAIR's fork is public, so keep Discworld use to mechanic inspiration unless Weibao asks for a direct adaptation under PROJECT.md's attribution rules. Discworld is not on the canon-first priority list.

Packets: [IMPLEMENTATION_PACKETS.md](IMPLEMENTATION_PACKETS.md). Touches: [SMALL_TOUCHES.md](SMALL_TOUCHES.md). Coverage: [CHECKPOINT.md](CHECKPOINT.md).

## Sources

- Official site: https://discworld.starturtle.net/lpc/ (features, history, getting started, more than playing, Wizards guild page, recent developments blog)
- Concept help pages: skills, taskmaster, advancing, level, death, ashkente, corpse, guilds, crafting, nationality, achievement_points, experience, family, clubs, calendar, quests, citizenship, faith, deitypoints, activity, automation, special_abilities, temperature, roleplaying, architect
- Command help pages: teach, learn, cost, advance, skillcap, languages, speak, haunt, relationship, quests, unquest, achievements, time
- https://en.wikipedia.org/wiki/Discworld_MUD ; https://wiki.lspace.org/Discworld_MUD ; https://www.gamebanshee.com/93ywa ; https://discworld.com/?p=14349
