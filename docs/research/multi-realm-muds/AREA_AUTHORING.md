# Area authoring and implementation evidence

## B1: Public examples show a reusable shell with authored local rules

SHOWN in 3K's room tutorial: inheritance from a common room base, realm/light setters, inspectable noun aliases, search targets and exits. Hidden exits are not blocked exits; the text describes separate movement predicates. The prose names both `set_search_mess` and `set_search_message`, so even this tutorial should not be treated as a compile-tested API reference. [3k-room](https://3k.org/resources/primer/examples/room.html).

SHOWN in the monster example: a common base, level/type/alignment settings, idle/combat text pools and weighted special attacks. STATED: setting level derives armor, weapon power, HP and XP; complex monsters add reactions, theft and hunting. Internal formulas and reaction dispatch were not published in the read set. [3k-monster](https://3k.org/resources/primer/examples/monster.html).

SHOWN in the assembly example: a guarded clone call in reset fills a missing spawn. STATED: create is followed by reset on initial load. A reset does nothing unless the author supplies behavior. This is a regeneration policy and must not be mistaken for remembered unique deaths or persistent quest outcomes. [3k-put](https://3k.org/resources/primer/examples/put_it_together.html).

## B2: Consistency is a production process

STATED: 3K recommends a tiny first area, sponsor critique, higher-staff review and player-board testing before live linking and catalogue entry. Style guidance aims at maintenance by future authors. `arealist` exposes author/realm/fixer and closure, repair and approval filters. Review state is richer than a binary finished flag. [3k-wizzing](https://3k.org/resources/primer/coding/wizzing.html), [3k-style](https://3k.org/resources/primer/coding/codestyle.html), [3k-arealist](https://3k.org/support/help/fetch-help.php?topic=arealist).

STATED: RetroMUD requires a sponsor, prior player experience, competent writing/coding and progress on an area. The public wizzing policy contains restrictive staff rules, but no comparable complete area authoring manual or level-band specification was recovered. These community controls are not proposed YAIRPG solo restrictions. [retro-wizzing](https://www.retromud.org/proxy/helpxml?=Pantheon/wizzing).

## B3: Local scheduling has an execution context

STATED in 3K's advanced primer: heartbeats normally run every two seconds and should stop when not needed. Delayed calls split expensive work, but per-second overload can drop callbacks. The examples warn that heartbeat code cannot assume the current player and describe staggered blessing work. SHOWN: a queue example turns itself off when empty and a delayed version prevents duplicate scheduled processing. These are educational examples, not a trace of deployed AI or measured performance. [3k-advanced](https://3k.org/resources/primer/coding/advanced.html).

## B4: Proposed small-area card

INFERRED, MW-P3 / P16/P22, K1/K10/K33/K34. A YAIRPG card can record place IDs, source/era, author, pack revision, meaningful level or capability band, readable nouns, inspect/search outcomes, exits with independent discovery/admission, NPC type and means, unique versus renewable stock, reset policy, and repair/review/play state. This is proposed authoring metadata over existing structured packs, not a new runtime engine.

A capability band is a YAIRPG proposal: the MUD pages show broad all-level support and monster-level defaults, but do not reveal a full area-by-area level-range table. Do not invent one. Validator fixtures should distinguish an unknown exit from an impassable exit and repaired content from approved content; neither status grants native gameplay acceptance.
