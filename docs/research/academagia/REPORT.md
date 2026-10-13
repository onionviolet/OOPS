# Academagia: The Making of Mages research lane

2026-10-13. Web-only research (Steam pages and APIs, the community wiki read through the MediaWiki API, a developer interview, two reviews). Findings and packets are proposals, not accepted decisions. Nothing was purchased, installed or launched.

**Labels.** "Verified" means a named public source states it. "Inferred" is this lane's reading. Wiki formulas are fan-derived.

**Bottom line.** This is the closest existing game to "a Hogwarts school year as a life sim". YAIRPG should take its year structure, exam math, college merit and classmate cohort, and automate the repetitive daily planning, which is what reviewers complain about most.

Academagia (Black Chicken Studios, 2010; Steam re-release 20 Apr 2017; last patch 3.0.22 in Jan 2018) has a simple core. Its breadth comes from content volume (80+ students, about 800 events, 100+ adventures, 409 spells), not from a large number of systems.

## Findings

| Code | Label | Finding |
|---|---|---|
| F1 | verified | **Day slots.** A day has 3 slots (morning, afternoon, evening). Each slot holds one Action, Spell, Item or Ability, and you pick a venue that adds a passive bonus and a chance of being discovered. Weekday class slots are pre-filled, and skipping is tolerated in small amounts. |
| F2 | verified | **Calendar.** 12 months × 4 weeks. Classes start in month 9, midterms are in month 12, finals and year end are in month 6, and months 7–8 are summer break. Exam months have no teaching. Holiday events fire on fixed dates. |
| F3 | verified | **Courses and exams.** You take 6 of 17 courses, and your college fixes 2–3 of them. Score is about parent skill × study level, plus extra credit. The final is 80–95% of the grade. Grading is absolute bands (75+ is First Class), a strict curve, a hybrid of the two, or pass/fail. Poor scores bring detention, and exams cannot be missed. |
| F4 | verified | **Learning tracks.** Attending class rolls random subskill steps, and the result is fixed for that date (a reload repeats it). The Study action gives +1 study level. The Train action gives +1 skill step. Study level unlocks lore and abilities. |
| F5 | verified | **Skill shape.** About 54 parent skills, each with 3–7 subskills. A parent's level is the lowest of its three highest subskills. Levels run 0–10, and the cap can be raised. The cost of a step depends on the linked attribute, the current level and the subskill's complexity. Inform means unlock, Expand means a permanent gain, Increase means a temporary one. Choosing an unknown skill in an adventure Informs you of it even if the roll fails. |
| F6 | verified | **Adventure structure.** Adventures run in stages and phases. Each choice is Attribute + Subskill vs a number: success gives a skill step and advances, failure gives stress, a retry or a pause. Info choices unlock options or raise your odds. Adventures have date windows, prerequisites and exclusions. The main plot can be played from exactly 1 of 5 viewpoints. The wiki has 258 adventure pages. |
| F7 | verified | **Students.** 80+ students, each with a college, classes, attributes, goals, likes and dislikes about what you train, a personal adventure and a clique ability. Students you have been "Informed" about show up in a daily report. Relationship runs −10 to +10, with a cap of 12 in some cases. |
| F8 | verified | **Cliques and vendettas.** Befriending is a contested Charm/Befriend roll, and a clique can span colleges. Members' relationships with each other must stay balanced or the clique splits. Clique abilities give weekly or passive bonuses. A Vendetta requires a low relationship and leads to a duel. |
| F9 | verified | **Colleges and instructors.** 7 colleges, each with a rival college, a regent, a motto, required classes and common rooms. The Collegiate Merit prize ladder runs from 20 points to 450+. Building instructor relationship lets you spend a Favor, which resets the relationship to 0. A Reprimand adds a weekly detention slot, and detention also teaches. |
| F10 | verified | **Stress and vitality.** Stress maximum is Fitness × 2. Ending a day over the maximum loses the whole next day. Rest resets stress and vitality. You can deliberately spend stress as a bonus on planned actions. Emotions trigger from your state. |
| F11 | verified (fan formula) | **Rolls.** Roll = Skill + rand(0–2) × Attribute vs the difficulty. Rolls can be contested, and success and failure chances, best/worst rerolls and a hidden Glory stat all modify them. Choices are colour-coded by odds, from green (automatic) to purple (luck only). |
| F12 | verified | **Locations.** About 577 locations. Each has a venue bonus and a 0–15% chance of discovery. Being caught somewhere without visitation rights earns a reprimand. Locations are found through skills, research, exploring and adventures. |
| F13 | verified | **Money.** A biweekly allowance comes from Parental Approval, which starts from your background station and rises when you write home. Jobs and shops exist. An illegal item is confiscated unless its concealability is at or below your Finesse. |
| F14 | verified | **Spells.** A spell needs all its components ("phemes"), which come from different skills. Extra components add effects and difficulty. Duels use a palette of components. |
| F15 | verified | **Character creation.** 10 points for attributes, then 7 background pages: origin, family and station, activities, education, familiar, luggage and journey. Familiar bonds cap the familiar's bonus at half the bond level. |
| F16 | verified | **Random events.** About 800 random events roll at the end of each day. They never cost a slot but can send you to the infirmary. |
| F17 | verified; status inferred | **Series plan.** Planned as a five-year series with characters carrying over, a theme per year, and summer vacation as almost a mini-game. Only Year 1 shipped, and the series looks dormant. |
| F18 | verified | **Engine signals.** Windows x64, .NET 4.0, DirectX 9, 400 MB. Official mod tools were released in 2010, and fans used them to read adventure prerequisites. |
| F19 | verified + inferred | **Reception.** Steam 206/290 positive. RPG Codex calls the grind "downright preposterous", and Bit-tech says the depth is intimidating. Both praise the writing and depth. Inferred: the repetitive planning is what idle play should absorb. |
| F20 | verified / inferred | **Developer's other work.** Black Chicken also made 1931: Scheherazade at the Library of Pergamum (2015, verified). Inferred: Academagia belongs to the same lineage as Long Live the Queen. |

## Against YAIRPG

Already covered:

- Skills: `src/data/skills.js` (64 skills).
- Discovery: `skill_discovery.js`, `skill_expansion_content.js`.
- Scenes: `ink_narrative.js`.
- Rolls: `rules.js:chooseOutcome` and `simulation_resolution.js:deriveSimulationSeed`.
- Dated events: `chronicle.js:advanceChronicle` (scheduled, open, missed).
- Time: `world_rhythm.js:recurringWindow` and the `day_count` weekday in `game_time.js`.
- Energy and moods: `energy_resources.js`, `everyday_life.js`.
- NPC lives: `npc_lives.js`.
- Life log: `life_record.js`.

New to YAIRPG: day-slot plans with class defaults, parent level as the minimum of the top three subskills, study level as a separate track, exams scored against a cohort, a shared house score with a prize ladder (HP1 in `docs/worlds/world-depth-2026-10-13/02_MOL_HP_JJK_DND.md`), a teacher ledger, cliques that need balance, stress spent as a resource with overflow losing a day, venue discovery risk, and mutually exclusive main-plot viewpoints. Nothing in `src/` has a timetable, study level, exams, house points, a teacher ledger or cliques. Harry Potter exists only as a roster entry plus docs.

Harry Potter mapping: colleges become houses, courses become OWL subjects, merit becomes house points, visitation rights become Hogsmeade permission (HP10). All content would be original or HP canon, never Academagia's.

Packets: [IMPLEMENTATION_PACKETS.md](IMPLEMENTATION_PACKETS.md). Small touches: [SMALL_TOUCHES.md](SMALL_TOUCHES.md). Limits and decompile route: [CHECKPOINT.md](CHECKPOINT.md).

## Sources

- [Steam store page](https://store.steampowered.com/app/533480), plus the Steam news and reviews APIs.
- [Academagia community wiki](https://academagia.fandom.com/wiki/), read through the MediaWiki API: Months, Exams: A Guide, Terminology, Rolls (Guide), Stress, Clique, Collegiate Merit, Favor, List Of Colleges, Character Creation, Chance of Discovery, Concealment, Parental Approval, Familiars (Guide), Mikka's Adventure Guide, A Meeting at the Tavern, Durand de Thiomines, DLCs and their additions.
- [Developer interview (Gamezebo)](https://www.gamezebo.com/news/making-mages-an-interview-with-the-developers-of-academagia/)
- [Mod tools announcement, 4 Nov 2010 (Gamezebo)](https://www.gamezebo.com/news/college-vernin-the-legacy-of-the-towers-released-as-second-free-content-pack-for-academagia-the-making-of-mages/)
- [RPG Codex review](https://rpgcodex.net/content.php?id=230), [Bit-tech review](https://bit-tech.net/reviews/gaming/pc/academagia-the-making-of-mages-review/1)
- [1931: Scheherazade at the Library of Pergamum](https://store.steampowered.com/app/334850)
