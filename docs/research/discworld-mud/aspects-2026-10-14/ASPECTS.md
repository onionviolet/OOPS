# Discworld MUD aspect pass, 2026-10-14

Historical distribution v20.0 mirror, pinned 8c8619c; not the complete modern server. LPC source and prior official help/archive dossiers. Full modern dialogue catalogue, save-driver encoding and omitted domains remain unavailable.

All recommendations are PROPOSALS. No runtime implementation or accepted decision. No game was launched, downloaded code run, personal save opened, account used, install changed, git staged, committed or pushed. Only assigned aspect folders and asp-text scratch were written. Desktop first; one realm/one prestige remains the milestone; no fixed solo once restriction is adopted.

SHOWN means statically inspected artifact behavior. STATED means documented by source/help/store. INFERRED identifies our interpretation. Covered is a bounded aspect answer, not exhaustive content or runtime verification.

## A01 Dialogue and conversation

Status: covered

SHOWN: response_mon stores ordered trigger/response pairs. Inputs use word subsequences with alternatives or regex; the first matched response wins. Say, directed speech, whisper and social verbs have separate event paths. Ordinary speech requires NPC skill >=90 and speaker >=60 unless an override applies; directed speech does not use that override in the inspected branch. Visibility and recipient filters gate responses. Strings, random response arrays and callbacks can issue commands and change state. monster.c separately supplies weighted idle/combat barks and multi-step stories. No portrait schema or general relationship graph was found in these seams; modern authored conversations are unread.

- SHOWN: [check_sub_sequence, do_response, event_person_say, event_person_sayto, event_whisper](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/std/living/response_mon.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.
- SHOWN: [expand_string, expand_mon_string, heart_beat, load_chat](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/obj/monster.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.

PROPOSAL: Use typed topic, audience, language and knowledge checks before a reply; attach an explicit action receipt when speech changes state. Owner: `docs/worlds/DIALOGUE_AND_INTERACTIONS.md`.

## A02 Narrative delivery

Status: covered

SHOWN: quest_handler stores parallel name, level, title, story, active-status and completion arrays, restores its registry and derives total active quest points. Story text is a completion biography payload, separate from quest identity. monster.c sequences ambient stories across heartbeats. STATED prior official help provides progressive quest hints. This does not establish a global novel timeline or exhaustive quest corpus.

- SHOWN: [create, add_quest, query_quest_story](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/obj/handlers/quest_handler.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.
- SHOWN: [doing_story](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/obj/monster.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.

PROPOSAL: Store event IDs and consequences separately from journal wording; give opaque actions an earned hint route. Owner: `docs/PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md`.

## A03 Implementation architecture

Status: covered

SHOWN: LPC inherits composable room, object and living behavior; driver callbacks include create, init, heart_beat and call_out. Shared handlers own quests, tasks, money and weather. NPC setup scripts register behavior and attacks. An NPC at full HP/GP can stop its heartbeat when nobody is nearby, subject to an overridable guard. Driver internals and current-server performance are unread.

- SHOWN: [heart_beat, query_ok_turn_off_heart_beat](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/obj/monster.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.
- SHOWN: [setup, add_combat_action](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/d/learning/newbie/introduction/examples/advanced_npc.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.
- SHOWN: [global/events.c](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/global/events.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.

PROPOSAL: Separate authored definitions, retained actor state and scheduled work; measure dormant-actor scheduling before making performance claims. Owner: `docs/ENGINE_EXPANSION.md`.

## A04 Save and persistence

Status: covered

SHOWN: global/player.c save_me refuses saving while autoloading, save-inhibited or a guest; guild/race hooks run, effects freeze, inventory autoload records are built, then driver save_object is called. Autoload records identify clone/file and static/dynamic arguments. Exceptions can yield missing-item receipts. Loading reconstructs objects and invokes a completion callback. These are historical seams, not a proven transactional whole-world snapshot, portable JSON, migration policy or offline catch-up. No player file was opened.

- SHOWN: [save_me, save_with_auto_load, load_auto_load_alt](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/global/player.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.
- SHOWN: [auto_str_ob, create_auto_load, AUTO_LOAD_TYPE/NAME/DATA](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/global/auto_load.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.

PROPOSAL: Keep reconstruction failures recoverable and visible; save pending effects and owned inventory under one validated publication contract. Owner: `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md`.

## A05 AI and NPC behavior

Status: covered

SHOWN: advanced NPC example has separate weighted idle/combat text, chance-gated combat actions and queued casting/giving. Response code gates actual perception and language. monster heartbeat manages regeneration and conversations, with empty-room dormancy. This is reactive authored behavior, not evidence of a general planner or autonomous lifetime society.

- SHOWN: [charm_women, do_bunny, do_maintain](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/d/learning/newbie/introduction/examples/advanced_npc.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.
- SHOWN: [heart_beat](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/obj/monster.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.

PROPOSAL: NPCs should use owned means and eligible actions; keep a small causal routine before adding a planner. Owner: `docs/CHARACTERS_AND_WORLD_EVENTS.md`.

## A06 UI and information design

Status: partial

SHOWN: text commands, options, brief/verbose modes and score output are distinct modules. Speech templates resolve names, pronouns, guild titles and visible nearby actors. STATED prior help offers immersive score prose and descriptive-number modes. No rebuilt desktop or accessibility exercise is authorized here.

- SHOWN: [expand_string](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/obj/monster.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.
- SHOWN: [cmds/player/score.c](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/cmds/player/score.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.
- SHOWN: [cmds/player/options.c](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/cmds/player/options.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.
- STATED: [public help](https://discworld.starturtle.net/lpc/playing/documentation.c?path=/concepts/immersion). 2026-10-14 read; dated posts retain their own date.

PROPOSAL: Offer readable numeric/prose detail modes; keep current action, location and result visible at desktop size. Owner: `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`.

## A07 Content authoring and modding

Status: covered

SHOWN: NPC setup uses inheritable objects plus methods for descriptions, weighted chat, spells, attacks and callbacks. Learning-domain examples demonstrate authoring. Rules are executable LPC, not a declarative validated dialogue format. The distribution terms bar commercial code use; this pass copies no code or assets.

- SHOWN: [setup](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/d/learning/newbie/introduction/examples/advanced_npc.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.
- SHOWN: [README](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/README). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.
- SHOWN: [obj/examples/response_mon.c](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/obj/examples/response_mon.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.

PROPOSAL: Preserve author convenience through validated typed dialogue/action records rather than arbitrary code in content. Owner: `docs/ENGINE_AUTHORING.md`.

## A08 Balance and numbers

Status: partial

SHOWN in prior source pass: bonus curves are piecewise in level with log stat influence; task difficulty/category/stat/decay gates practice awards. Old failure branches return before gain checks, unlike current help. Current teaching and taskmaster balance must not be derived from old release numbers. Seeded reproducibility, pity and modern exact rates remain unread.

- SHOWN: [obj/handlers/taskmaster.c](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/obj/handlers/taskmaster.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.
- SHOWN: [std/living/skills.c](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/std/living/skills.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.

PROPOSAL: Expose a useful practice band with useful output and solo alternatives; version formulas and distinguish training from effective ability. Owner: `docs/worlds/SKILL_MECHANISMS_AND_MEANS_2026-10-13.md`.

## A09 Time and scheduling

Status: partial

SHOWN: driver heartbeats and call_out schedule NPC stories and delayed response matching; response delay is two seconds, then actions can be queued with zero-delay call_out. STATED current calendar/weather from prior help remains separate from old code. No player offline catch-up was established.

- SHOWN: [do_response, exec_response](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/std/living/response_mon.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.
- SHOWN: [heart_beat](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/obj/monster.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.
- SHOWN: [obj/handlers/weather.c](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/obj/handlers/weather.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.

PROPOSAL: Specify simulation units and interruption rules for each job; ambient response delay is not a durable world calendar. Owner: `docs/TIMELINES_AND_DIVERGENCE.md`.

## A10 Onboarding and reveal

Status: partial

SHOWN: d/learning contains tutorial examples and rooms; STATED prior official help describes nationality/start-language bundles and newbie protections. Modern live tutorial was not played. Its one-way tutorial exit is a source rule, not a YAIRPG requirement.

- SHOWN: [d/learning/newbie/introduction/examples/simple_npc.c](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/d/learning/newbie/introduction/examples/simple_npc.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.
- STATED: [public help](https://discworld.starturtle.net/lpc/playing/documentation.c?path=/concepts/nationality). 2026-10-14 read; dated posts retain their own date.

PROPOSAL: Teach one useful interaction and let starts seed language/place access without making reasonable later options unreachable. Owner: `docs/worlds/DIALOGUE_AND_INTERACTIONS.md`.

## A11 Little touches

Status: covered

SHOWN: separate idle/combat speech, pronoun/name expansion, restricted whisper content, response debug tracing, zero-delay deferred response actions and failed-item receipts. A suspicious loop detector assigns last_mess rather than comparing it; its comment admits complex loops escape detection. These are source observations, not bug reproduction.

- SHOWN: [check_loop, event_whisper, set_response_mon_debug_mode](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/std/living/response_mon.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.
- SHOWN: [auto_str_ob](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/global/auto_load.c). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.

PROPOSAL: Trace why a line matched and preserve observer-specific information; do not copy the loop guard literally. Owner: `docs/ENGINE_AUTHORING.md`.

## A12 Other systems

Status: partial

SHOWN/STATED prior dossier covers housing permissions/registry, local currency/banks, language skills, guild services, lives/ghosts, religion pools, clubs and law. The distribution also contains shops, effects, reactions, transport and player-shop modules. These are inventoried here; omitted modern domains and full current coverage remain unread.

- SHOWN: [std/shops](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/std/shops). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.
- SHOWN: [obj/handlers](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/obj/handlers). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.
- SHOWN: [std/effects](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/std/effects). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.
- SHOWN: [std/shops/player_shop](https://github.com/Yuffster/discworld_distribution_mudlib/blob/8c8619c64c0a41f09e406a97ee1e0a084ff92a60/std/shops/player_shop). 8c8619c64c0a41f09e406a97ee1e0a084ff92a60.

PROPOSAL: Property title, room access and civic permission should remain separate; Province War may cite holdings/permissions as comparison only. Owner: `docs/CHARACTERS_AND_WORLD_EVENTS.md`.
