# Aspect pass: grouped RetroMUD and 3 Kingdoms

2026-10-14. All twelve rows are PARTIAL because the permitted source is public documentation, not a server build or live game. Separate per-game evidence boundaries are kept in each row. Full captured text and code examples stay private; committed prose is paraphrased. A source description is STATED; a visible example is SHOWN; YAIRPG takeaways are INFERRED PROPOSALS.

## A01: Dialogue and conversation

**Status: PARTIAL.** RetroMUD states guide topics and walkthrough help; complete NPC line conditions are unread. 3K shows idle/combat text pools and describes complex-monster reactions, but publishes no reaction graph here. The player ask command is not an NPC graph.

**How it is represented / evidence:** Published guide topic list, load_chat/load_a_chat example and distinct complex-monster class description. Complete line IDs/conditions and relationship-gated dialogue were not exposed.

**Sources:** [retro-areas](https://www.retromud.org/proxy/helpxml?=Basics/world_guide), [3k-monster](https://3k.org/resources/primer/examples/monster.html), [3k-ask](https://3k.org/support/help/fetch-help.php?topic=ask).

**YAIRPG PROPOSAL:** K6/K11/K20/K31; P19/P21: keep helpful topic guidance and contextual speech distinct from a causal choice.

## A02: Narrative delivery

**Status: PARTIAL.** RetroMUD level quests reward advancement preparation and exploration. 3K publishes realm quest examples and a skillquest lookup command. Neither read set reveals a full branching journal or global timeline.

**How it is represented / evidence:** Public quest descriptions and help command interface only. No event tables, quest scripts, canon clock or full endings corpus.

**Sources:** [3k-realms](https://3k.org/realms/index.php), [3k-skillquests](https://3k.org/support/help/fetch-help.php?topic=skillquests), [retro-progression](https://newbie.retromud.org/gameplay/progression).

**YAIRPG PROPOSAL:** K11/K12/K16; P10/P12: bind actual eligibility, intervention and aftermath instead of equating a list with an event engine.

## A03: Implementation architecture

**Status: PARTIAL.** 3K publishes LPC library examples and scheduling guidance; the site identifies LDMud. RetroMUD help names a mudlib and its site JS routes public help. RetroMUD server architecture and both deployed runtimes remain unread.

**How it is represented / evidence:** Room/monster inheritance, create/reset, heartbeat/call_out examples are shown tutorial code. Website routing is shown JS; neither is a server checkout.

**Sources:** [3k-room](https://3k.org/resources/primer/examples/room.html), [3k-monster](https://3k.org/resources/primer/examples/monster.html), [3k-put](https://3k.org/resources/primer/examples/put_it_together.html), [3k-advanced](https://3k.org/resources/primer/coding/advanced.html), [retro-client-js](https://www.retromud.org/scripts/retromud.js), [retro-wizzing](https://www.retromud.org/proxy/helpxml?=Pantheon/wizzing).

**YAIRPG PROPOSAL:** K18/K33/K34; P16/P22: reuse common primitives and explicit local configuration without assuming all world rules are global.

## A04: Save and persistence

**Status: PARTIAL.** RetroMUD distinguishes carried/threaded gear and storage, plus reincarnation loss. 3K distinguishes player saves from conditional equipment retention and special autoload events. Exact formats and safe restore internals are unread for both.

**How it is represented / evidence:** Help contracts only: no serializers, migrations, atomic writes or corruption paths. Character persistence cannot stand in for complete object-instance retention.

**Sources:** [3k-save](https://3k.org/support/help/fetch-help.php?topic=save), [3k-milestones](https://3k.org/support/help/fetch-help.php?topic=milestones), [3k-autoload](https://3k.org/support/help/fetch-help.php?topic=autoload), [retro-threading](https://www.retromud.org/proxy/helpxml?=Equipment/threading), [retro-equipment](https://newbie.retromud.org/gameplay/equipment), [retro-progression](https://newbie.retromud.org/gameplay/progression).

**YAIRPG PROPOSAL:** K9/K15/K18/K33; P05/P16/P24: preview per carrier and preserve identity, custody and exact retained instance state.

## A05: AI and NPC behavior

**Status: PARTIAL.** 3K describes aggression, fleeing, reactions and weighted specials; examples show local text/special configuration. RetroMUD offers a guide and practical environmental threats, with no AI scripts. No autonomous society planner was recovered.

**How it is represented / evidence:** Standard monster sample; complex-monster behavior is stated only. No schedules, beliefs or player/NPC universal parity proof.

**Sources:** [3k-monster](https://3k.org/resources/primer/examples/monster.html), [3k-advanced](https://3k.org/resources/primer/coding/advanced.html), [retro-areas](https://www.retromud.org/proxy/helpxml?=Basics/world_guide).

**YAIRPG PROPOSAL:** K6/K10/K26; P21/P25: one useful lawful NPC behavior before a full planner.

## A06: UI and information design

**Status: PARTIAL.** Public web UI exposes categorized help, keyboard modal focus, loading/error states and command references. RetroMUD serves history-based help navigation; clients are recommended, not inspected. Native desktop game screens were not captured.

**How it is represented / evidence:** Shown public website DOM/JS only. No claim about live client panel density, screen-reader behavior or keyboard acceptance.

**Sources:** [3k-help](https://3k.org/support/help/index.php), [3k-main-js](https://3k.org/design/script/script_main.js), [retro-client-js](https://www.retromud.org/scripts/retromud.js), [retro-newtransport](https://newbie.retromud.org/gameplay/world-transport).

**YAIRPG PROPOSAL:** K11/K14/K30; P04: target a 1366x768 known-readiness view with independent panels; mobile deferred.

## A07: Content authoring and modding

**Status: PARTIAL.** 3K describes common bases, sponsor and staff reviews, player-board testing and live catalogue entry. RetroMUD states sponsor/writing/coding requirements. These are controlled server authoring paths, not a public end-user mod API.

**How it is represented / evidence:** Published LPC examples/style guide and staff workflow. Full review tools and RetroMUD area templates remain unread.

**Sources:** [3k-wizzing](https://3k.org/resources/primer/coding/wizzing.html), [3k-style](https://3k.org/resources/primer/coding/codestyle.html), [3k-room](https://3k.org/resources/primer/examples/room.html), [3k-arealist](https://3k.org/support/help/fetch-help.php?topic=arealist), [retro-wizzing](https://www.retromud.org/proxy/helpxml?=Pantheon/wizzing).

**YAIRPG PROPOSAL:** K1/K33/K34; P16/P22: small functional area cards and repair/approval status, using existing structured packs.

## A08: Balance and numbers

**Status: PARTIAL.** RetroMUD documents homeworld bonuses, guild-tier limits, aptitude and equipment constraints. 3K describes level-derived defaults and weighted specials plus profession categories. Published example values are not live global balance.

**How it is represented / evidence:** No actual level curve, stat derivation, RNG seeding, pity or numerical precision implementation read. Formula consumers and full area challenge ranges unread.

**Sources:** [retro-worldbonuses](https://www.retromud.org/proxy/helpxml?=Worlds/homeworld_bonuses), [retro-paths](https://www.retromud.org/proxy/helpxml?=Guilds/paths_of_power), [retro-equipment](https://newbie.retromud.org/gameplay/equipment), [3k-monster](https://3k.org/resources/primer/examples/monster.html), [3k-professions](https://3k.org/support/help/fetch-help.php?topic=professions).

**YAIRPG PROPOSAL:** K2/K3/K9/K10; P14/P17: source-specific costs and supports, not forced balance between all traditions.

## A09: Time and scheduling

**Status: PARTIAL.** RetroMUD has local daylight transport and reboot retention rules. 3K distinguishes heartbeats, delayed callbacks, reset and save cadence. Browser-closed idle simulation and per-world time ratios are not established.

**How it is represented / evidence:** 3K examples document normally two-second rounds and callback limits. No full scheduler or persisted timer audit.

**Sources:** [retro-newtransport](https://newbie.retromud.org/gameplay/world-transport), [retro-equipment](https://newbie.retromud.org/gameplay/equipment), [3k-advanced](https://3k.org/resources/primer/coding/advanced.html), [3k-put](https://3k.org/resources/primer/examples/put_it_together.html), [3k-save](https://3k.org/support/help/fetch-help.php?topic=save).

**YAIRPG PROPOSAL:** K5/K18/K26/K28; P08/P13: explicit clocks, actual actor and finite jobs; unsupported offline absence stays frozen.

## A10: Onboarding and reveal

**Status: PARTIAL.** RetroMUD has race/guild fit guidance, guide topics and temporary travel support. 3K gates guilds/realm access and introduces professions/housing later. No native tutorial sequence was exercised.

**How it is represented / evidence:** Guides/help only, with old/new transport threshold conflicts retained. Newbie survival aids are not evidence every start has equal difficulty.

**Sources:** [retro-creation](https://newbie.retromud.org/gameplay/character-creation), [retro-newtransport](https://newbie.retromud.org/gameplay/world-transport), [retro-areas](https://www.retromud.org/proxy/helpxml?=Basics/world_guide), [3k-guilds](https://3k.org/guilds/index.php), [3k-milestones](https://3k.org/support/help/fetch-help.php?topic=milestones).

**YAIRPG PROPOSAL:** K4/K11/K14; P04: show useful next means and warn before support changes without imposing permanent once-only locks.

## A11: Little touches

**Status: PARTIAL.** RetroMUD has keep markers, ownership examination and practical equipment summaries. 3K shows noun aliases, different look/search answers, audience text and focused help. 32 touches are inventoried, not implemented.

**How it is represented / evidence:** Source hooks linked in SMALL_TOUCHES; no measured accessibility or feel acceptance.

**Sources:** [retro-threading](https://www.retromud.org/proxy/helpxml?=Equipment/threading), [retro-equipment](https://newbie.retromud.org/gameplay/equipment), [3k-room](https://3k.org/resources/primer/examples/room.html), [3k-monster](https://3k.org/resources/primer/examples/monster.html), [3k-main-js](https://3k.org/design/script/script_main.js).

**YAIRPG PROPOSAL:** K9/K14/K19/K30; P04/P21: small legibility improvements tied to real actions and actor knowledge.

## A12: Other systems

**Status: PARTIAL.** Guild conduct credit, layered professions, faction reputation, advanced embodiment and listed minigames broaden play. Crafting, housing, markets and minigame rules were not deeply audited in this lane.

**How it is represented / evidence:** Reputation/profession/Ascended help read; remaining help-index entries are identification only. No inferred inventory of server modules.

**Sources:** [retro-progression](https://newbie.retromud.org/gameplay/progression), [3k-professions](https://3k.org/support/help/fetch-help.php?topic=professions), [3k-reputation](https://3k.org/support/help/fetch-help.php?topic=reputation), [3k-ascended](https://3k.org/support/help/fetch-help.php?topic=ascended), [3k-help](https://3k.org/support/help/index.php).

**YAIRPG PROPOSAL:** K7/K8/K15/K24/K25/K29; P07: concrete local rights and alternative solo services, not a universal MMO institution model.
