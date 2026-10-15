# Dungeon Crawl Stone Soup and Cataclysm: Dark Days Ahead: aspect backfill, 2026-10-14

## Corrections

C3: Fresh source extends the old selected-mechanics dossier; no contradiction to the prior conclusions was established; only the training-target route was freshly reread, while rune/run-record paths were inventoried. The old pin is not current HEAD and its line numbers must not be reused as new evidence.

C4: The repository monster_speech.txt is historical guidance, not current probability authority. Current maybe_mons_speaks returns early for neutral/patrolling actors, lowers the chance denominator for uniques, and multiplies it for allies. Copying the document's exact neutral/allied rates would be wrong at this pin.

C5: The new pin differs from a68ad093f6f89f3e7d29ad62cbb7fcde46acfd25. The old achievement/conduct/practice dossier remains a bounded historical review; its complete causal paths were not all repeated here.

C6: Save version metadata does not prove transactional rejection. Current game::unserialize catches JsonError and returns, while unserialize_impl mutates live fields incrementally. game::save writes several owners in sequence and can report failure after earlier writes. This extends the prior save scope and rules out describing this as one atomic whole-world JSON save.

## Evidence and scope

Shown means directly read source/control flow. Stated means repository documentation. Inferred means an interpretation, and every YAIRPG transfer is a PROPOSAL. Covered means a representative implementation route is traced for the aspect, not every record or branch. Partial rows name what remains unread. No games were installed, built or launched, no saves were opened, and no runtime behavior, feel, performance or installed-build parity is claimed.

- Dungeon Crawl Stone Soup: [c4298273a49c6601be4e1c9b79d4aba43f9aa603](https://github.com/crawl/crawl/tree/c4298273a49c6601be4e1c9b79d4aba43f9aa603), tree `dcc678a6d7f0378ef96ea4ee6f6549c738a7c5f8`, 11505 tracked paths.
- Cataclysm: Dark Days Ahead: [ef31b1fc84c640f97a5547a5b76a6ba5e9e97847](https://github.com/CleverRaven/Cataclysm-DDA/tree/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847), tree `0498596292d79e59d0b0a23e2ce86e148abdc1dd`, 10429 tracked paths.

[System inventory](SYSTEM_INVENTORY.md), [three deeper systems per game](DEEPER_SYSTEMS.md), [reproducible tooling](TOOLING.md), [source evidence](SOURCE_INDEX.json), and [implementation proposals](IMPLEMENTATION_PACKETS.md) preserve the different evidence layers. The shared lane checkpoint is [here](../../nethack/aspects-2026-10-14/CHECKPOINT.md).

<a id="A01"></a>

## A01: Dialogue and conversation

### Dungeon Crawl Stone Soup | covered

Shown: speech is selected by C++ monster context and text-database keys, then name/actor replacements and channel prefixes produce visible or audible lines. maybe_mons_speaks changes probability for uniques, bands, allies, confusion and fleeing, and suppresses several actor states. mons_speaks_msg requires a visible cell and respects visual/perception rules. The reviewed route is barks and generated contextual lines; no reply graph, speaker portrait graph or state-changing conversation choice was found in it. Deity menus and other interaction routes are separate.

Sources: [crawl-ref/source/mon-speak.cc:337-445](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/mon-speak.cc#L337-L445), [crawl-ref/source/mon-speak.cc:827-878](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/mon-speak.cc#L827-L878), [crawl-ref/docs/develop/monster_speech.txt:1-45](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/docs/develop/monster_speech.txt#L1-L45).

PROPOSAL: Actor barks in src/simulation_ui.js should use observation and current actor state, with low repetition for permanent companions; choices belong to the existing dialogue action owner.

### Cataclysm: Dark Days Ahead | covered

Shown: json_talk_topic loads dynamic_line, speaker_effect, optional portrait_override, ordered responses and repeated inventory-driven responses. Dynamic lines allow translated strings, concatenation, random arrays and conditional branches. Response conditions can hide choices or produce a failure explanation/topic; trials require a failure effect. talk_effect_t::apply runs effects, changes NPC opinion, checks hostility and returns the next topic. Thus speech can alter world state. Some dynamic-line evaluation also clears a reason value, so text generation is not universally pure. Optional speaker-effect sentinels build a topic-scoped variable on the first actor, combine it with the condition, and set it after the effect. A base-data example BGSS_EVACUEE_2_STORY1 gates a social trial on a temporary NPC effect, branches to a later topic on success and applies that effect on the failure topic.

Sources: [src/npctalk.cpp:8497-8528](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/npctalk.cpp#L8497-L8528), [src/npctalk.cpp:8988-9134](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/npctalk.cpp#L8988-L9134), [src/npctalk.cpp:9168-9374](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/npctalk.cpp#L9168-L9374), [src/npctalk.cpp:9375-9472](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/npctalk.cpp#L9375-L9472), [data/json/npcs/Backgrounds/evacuee_2.json:1-44](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/data/json/npcs/Backgrounds/evacuee_2.json#L1-L44).

PROPOSAL: In src/data/dialogues.js and src/models/dialogue_action.js, add one earned response with explicit refusal text, recheck eligibility at commit, and keep rendering free from reward/state mutations.

<a id="A02"></a>

## A02: Narrative delivery

### Dungeon Crawl Stone Soup | covered

Shown: take_note accepts only active/noteworthy or forced notes, appends a structured Note and checks milestones. Notes and hints have separate versioned save/load paths. The note catalogue includes growth, worship, mutations, items and encounters, so a run can be recalled through selected state transitions instead of every turn. This is a run chronicle, not evidence of a branching quest-journal engine.

Sources: [crawl-ref/source/notes.cc:89-108](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/notes.cc#L89-L108), [crawl-ref/source/notes.cc:550-585](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/notes.cc#L550-L585), [crawl-ref/source/hints.cc:65-100](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/hints.cc#L65-L100).

PROPOSAL: Project existing causal receipts into a concise chronicle in src/simulation_ui.js; preserve exact causes while filtering routine repetition.

### Cataclysm: Dark Days Ahead | partial

Shown: mission.cpp keeps world missions by UID; creating a mission gives it an assigned identity. Dialogue effects explicitly preserve a mission reference before applying effects that may remove it, then update opinion from mission value. Save code retains message history, global variables, missions/NPC state through separate owners, and a player diary is stored separately. Full quest scripting, all journals, environmental writing and closure branches remain unread.

Sources: [src/mission.cpp:46-108](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/mission.cpp#L46-L108), [src/npctalk.cpp:8497-8528](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/npctalk.cpp#L8497-L8528), [src/game_io.cpp:601-640](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/game_io.cpp#L601-L640), [src/game_io.cpp:734-780](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/game_io.cpp#L734-L780).

PROPOSAL: Existing mission and society owners should retain cause, author and observed result in receipts; dialogue completion and material settlement must not be conflated.

<a id="A03"></a>

## A03: Implementation architecture

### Dungeon Crawl Stone Soup | covered

Shown: C++ gameplay combines command/main-loop dispatch, actors, separate monster action handling, tagged serialization, data text, Lua map generation and player-side Lua support. Monster actions use an energy queue and recheck actor validity after callbacks. Random generators have scoped switching and branch streams. Save state lives in a chunk package rather than one JSON object. Source has terminal/local tile/web paths; no current binary equivalence is asserted.

Sources: [crawl-ref/source/mon-act.cc:2827-2870](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/mon-act.cc#L2827-L2870), [crawl-ref/source/random.cc:20-100](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/random.cc#L20-L100), [crawl-ref/source/files.cc:2651-2712](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/files.cc#L2651-L2712), [crawl-ref/source/files.cc:3214-3275](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/files.cc#L3214-L3275).

PROPOSAL: Keep simulation ownership and presentation projections separate in src/simulation.js and src/simulation_ui.js; revalidate an actor after an effect can remove or relocate it.

### Cataclysm: Dark Days Ahead | covered

Shown: C++ runs the simulation while typed JSON supplies large content families. DynamicDataLoader dispatches a JSON type to its loader, loads folders before finalization and performs separate finalization/consistency phases. do_turn advances the calendar, processes timed events, item wakeups, missions, weather, NPC sound and activities. event_bus synchronously notifies subscribers and rejects its null event type. Dialogue conditions/effects provide a reusable scripting vocabulary rather than unrestricted embedded game code. Full performance and thread behavior were not measured.

Sources: [src/init.cpp:151-185](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/init.cpp#L151-L185), [src/init.cpp:523-586](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/init.cpp#L523-L586), [src/init.cpp:798-820](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/init.cpp#L798-L820), [src/do_turn.cpp:533-627](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/do_turn.cpp#L533-L627), [src/event_bus.cpp:60-100](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/event_bus.cpp#L60-L100).

PROPOSAL: In src/simulation_contracts.js validate typed content before runtime, then dispatch actual committed events to history/UI consumers. Do not let polling manufacture effects.

<a id="A04"></a>

## A04: Save and persistence

### Dungeon Crawl Stone Soup | covered

Shown: save_game calls the base writer and commits the package at checkpoints unless disabled. Tagged readers use major/minor compatibility; TAG_MAJOR_VERSION is 34 at this pin. Older minor layouts have explicit conversion branches in tags.cc. _restore_game reads character info before accepting a loadable package and aborts an incompatible save without rewriting its header when deletion is declined. restore_game offers deletion of invalid data with a default no. Notes, hints and RNG have distinct serialization. Complete chunk transaction internals and every migration were not audited.

Sources: [crawl-ref/source/files.cc:2651-2712](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/files.cc#L2651-L2712), [crawl-ref/source/files.cc:3214-3275](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/files.cc#L3214-L3275), [crawl-ref/source/files.cc:3370-3400](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/files.cc#L3370-L3400), [crawl-ref/source/tag-version.h:15-65](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/tag-version.h#L15-L65), [crawl-ref/source/tags.cc:748-775](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/tags.cc#L748-L775), [crawl-ref/source/tags.cc:1301-1340](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/tags.cc#L1301-L1340), [crawl-ref/source/random.cc:20-60](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/random.cc#L20-L60), [crawl-ref/source/notes.cc:550-585](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/notes.cc#L550-L585).

PROPOSAL: src/save_compatibility.js should identify which subsystem version failed and preserve the input; projections such as journal/hint caches can have narrower compatibility than simulation truth.

### Cataclysm: Dark Days Ahead | covered

Shown: savegame.cpp declares version 40, reads legacy comment headers and an embedded loading version, and serializes turn/calendar, player, active monsters, trackers, unique NPCs, global variables, messages and queued global EOCs with time/context. game_io.cpp coordinates player, maps, NPC/faction/mission, achievements, zones/options and UI files. Compressed player save uses a temporary archive and rename. This is not whole-world atomicity. JsonError handling can return after incremental load mutation. Autosave checks both turn cadence and real minimum interval; quicksave resets counters after calling save without checking its result. No personal saves were read.

Sources: [src/savegame.cpp:84-164](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/savegame.cpp#L84-L164), [src/savegame.cpp:199-328](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/savegame.cpp#L199-L328), [src/game_io.cpp:601-640](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/game_io.cpp#L601-L640), [src/game_io.cpp:734-780](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/game_io.cpp#L734-L780), [src/game_io.cpp:885-949](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/game_io.cpp#L885-L949).

PROPOSAL: src/native_storage_transaction.js should publish one validated candidate or report failure without clearing dirty state. Cross-owner saves need an explicit compatibility and atomicity decision.

<a id="A05"></a>

## A05: AI and NPC behavior

### Dungeon Crawl Stone Soup | partial

Shown: handle_monsters queues valid living actors with action energy, rechecks them after removal, updates attitude, executes a move only if the queued energy still matches, and requeues actors that can still act. The loop includes an explicit iteration guard. Speech reads attitude and action state but is not the planner. Full tactical scoring, spell choice, noise propagation and player-rule parity remain unread.

Sources: [crawl-ref/source/mon-act.cc:2827-2870](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/mon-act.cc#L2827-L2870), [crawl-ref/source/mon-speak.cc:337-395](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/mon-speak.cc#L337-L395).

PROPOSAL: src/simulation_resolution.js should drop stale actor jobs when the actor or cost changed, while preserving an explainable refusal or pause reason.

### Cataclysm: Dark Days Ahead | partial

Shown: NPC move code includes danger assessment, needs goals, executor result states and activity routing. A needs executor can report idle, progressed, satisfied, holding, blocked, deferred or impossible, rather than treating every attempt as useful work. NPC sound is processed before movement to avoid actors hearing their own talk as a new cue. Full goal selection, resource reservation, faction AI and offscreen activity were not read end to end.

Sources: [src/npcmove.cpp:1910-1960](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/npcmove.cpp#L1910-L1960), [src/do_turn.cpp:620-627](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/do_turn.cpp#L620-L627).

PROPOSAL: Extend existing independent resident work in src/feature_expansion_society.js with a concrete blocked/deferred reason and a real resource/tool consumer; avoid adding a parallel generic agent engine.

<a id="A06"></a>

## A06: UI and information design

### Dungeon Crawl Stone Soup | partial

Shown: travel defines separate stop categories for items, runes, shops, stairs, portals and branches. Hints remember event flags. Descriptions have dedicated source and UI layouts, but actual terminal/tile/web screen arrangement was not exercised. Automatic travel is an interruptible convenience, not authority to execute every interesting action.

Sources: [crawl-ref/source/travel.cc:590-625](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/travel.cc#L590-L625), [crawl-ref/source/hints.cc:65-100](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/hints.cc#L65-L100), [crawl-ref/source/describe.cc:121-145](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/describe.cc#L121-L145).

PROPOSAL: Expose work-plan stop reasons and independent detail/history panels on desktop through src/feature_expansion_work_plan.js and src/display.js.

### Cataclysm: Dark Days Ahead | partial

Shown: panels.cpp has named panel layouts, window dimensions, widgets and draw functions; data/json/ui contains several sidebar variants. Conversation has its own option/portrait structures and failure explanations. The player can receive a failure explanation in place of an unavailable response. Actual layout selection, rendering quality and keyboard/accessibility usability were not exercised.

Sources: [src/panels.cpp:57-168](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/panels.cpp#L57-L168), [src/npctalk.cpp:8988-9134](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/npctalk.cpp#L8988-L9134), [src/npctalk.cpp:9375-9420](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/npctalk.cpp#L9375-L9420).

PROPOSAL: Use laptop space for separate status, job, actor and event surfaces in src/display.js. A contextual reason should remain readable beside the unavailable action.

<a id="A07"></a>

## A07: Content authoring and modding

### Dungeon Crawl Stone Soup | partial

Stated in developer guidance: speech entries use keyed blocks, weighted alternatives, substitutions and separate databases. Shown in current C++: current actor context selects the key and output channel. The tree contains Lua dungeon scripts and authored vaults, while player Lua is a separate seam. This pass does not certify a general mod manager, arbitrary mod load order, all Lua APIs or parser error handling.

Sources: [crawl-ref/docs/develop/monster_speech.txt:1-45](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/docs/develop/monster_speech.txt#L1-L45), [crawl-ref/docs/develop/monster_speech.txt:113-155](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/docs/develop/monster_speech.txt#L113-L155), [crawl-ref/source/mon-speak.cc:827-878](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/mon-speak.cc#L827-L878), [crawl-ref/source/random.cc:108-130](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/random.cc#L108-L130).

PROPOSAL: World authoring should document which fields select text and which need runtime support; reject missing references before exposing a world.

### Cataclysm: Dark Days Ahead | partial

Shown: typed JSON files are loaded from paths and mod interaction files use a separate route. Loading after finalization is forbidden. Topic parsing enforces nonempty responses and a trial failure branch; loader finalization/consistency phases are distinct. NPC author docs describe separate classes, instances and conversation data. Full mod dependency ordering, every inheritance rule and native validation tools were not executed.

Sources: [src/init.cpp:151-185](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/init.cpp#L151-L185), [src/init.cpp:523-586](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/init.cpp#L523-L586), [src/init.cpp:798-820](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/init.cpp#L798-L820), [src/init.cpp:954-975](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/init.cpp#L954-L975), [src/npctalk.cpp:8988-9035](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/npctalk.cpp#L8988-L9035), [src/npctalk.cpp:9375-9438](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/npctalk.cpp#L9375-L9438), [doc/JSON/NPCs.md:1-35](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/doc/JSON/NPCs.md#L1-L35).

PROPOSAL: Add content-time validation for reachable topics and declared effects in the existing world content owners; unresolved references should fail before a saved world is exposed.

<a id="A08"></a>

## A08: Balance and numbers

### Dungeon Crawl Stone Soup | partial

Shown: persistent PCG generator state has serialization helpers, separate gameplay and branch-generation selections, and scoped subgenerators that restore the prior selection. User Lua randomness is kept separate from seeded gameplay. Skill target checking supports base and modified targets and disables training when the relevant target is met. These are stable execution and allocation mechanisms, not a complete balance or anti-bad-luck audit.

Sources: [crawl-ref/source/random.cc:20-130](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/random.cc#L20-L130), [crawl-ref/source/skills.cc:1270-1320](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/skills.cc#L1270-L1320).

PROPOSAL: Stop funded training at a useful learned function in src/feature_expansion_work_plan.js, and ensure flavor/UI draws cannot perturb material outcomes.

### Cataclysm: Dark Days Ahead | partial

Shown: practice recipes distinguish difficulty range, skill ceiling, proficiency, work duration, tool qualities, charge costs and book source. The reviewed mechanics file defines three practice records. rng.cpp uses a persistent process engine initialized from a high-resolution-clock seed and an explicit reseed function; this is not proof that every world random outcome is reproduced from a save. Full recipe costs, combat balance, global RNG persistence and pity mechanics remain unread.

Sources: [data/json/recipes/practice/mechanics.json:1-53](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/data/json/recipes/practice/mechanics.json#L1-L53), [src/rng.cpp:200-220](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/rng.cpp#L200-L220).

PROPOSAL: src/feature_expansion_work_plan.js should distinguish practice work from item production and stop when the selected functional goal is met; funding remains required.

<a id="A09"></a>

## A09: Time and scheduling

### Dungeon Crawl Stone Soup | covered

Shown: timed-effects uses elapsed action time and time_taken. It checks boundary crossings for periodic events and repeatedly catches up overdue timer effects before assigning each next deadline. Monster speed and action energy determine actor scheduling. This is simulation-time catch-up inside play; it does not establish wall-clock offline farming.

Sources: [crawl-ref/source/timed-effects.cc:424-486](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/timed-effects.cc#L424-L486), [crawl-ref/source/mon-act.cc:2827-2870](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/mon-act.cc#L2827-L2870).

PROPOSAL: In src/simulation.js, count every crossed due event under a bounded policy, then compare split steps and a longer step. Preserve YAIR passive-condition support rather than importing turn-only design as a restriction.

### Cataclysm: Dark Days Ahead | covered

Shown: do_turn advances one simulation turn and processes multiple cadences. EOCs queue an absolute calendar time, ID and context; due entries create nested dialogue context and activate effects. Recurring entries reschedule from the current turn or become inactive when a deactivation condition holds; reactivation is a separate scan. Requeueing is deferred until after the due loop. Global EOCs run on avatar processing, not every NPC turn. Queue time/context is serialized. Closed-app wall-time progression is not established.

Sources: [src/do_turn.cpp:533-627](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/do_turn.cpp#L533-L627), [src/effect_on_condition.cpp:235-335](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/effect_on_condition.cpp#L235-L335), [src/savegame.cpp:142-164](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/savegame.cpp#L142-L164), [src/savegame.cpp:309-322](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/savegame.cpp#L309-L322).

PROPOSAL: In src/simulation.js use saved deadlines and actor context for a bounded recurring world event. Specify missed-period policy explicitly; do not silently turn delayed events into repeated rewards.

<a id="A10"></a>

## A10: Onboarding and reveal

### Dungeon Crawl Stone Soup | covered

Shown: hints serialize a type plus per-event flags and discard that hint payload when the event count changes. Loading a hints game queues a load hint and resets travel/exploration counters from the remaining hint flags. A separate tutorial route exists in tutorial.cc and Lua data but was inventoried only. The player learns selected context with persisted reveal state; not every action requires permanent gating.

Sources: [crawl-ref/source/hints.cc:65-100](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/hints.cc#L65-L100), [crawl-ref/source/hints.cc:276-285](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/hints.cc#L276-L285).

PROPOSAL: Store explanation/reveal state apart from earned capability in src/simulation_content.js; losing a hint cache should not erase skill or force the player through a tutorial again.

### Cataclysm: Dark Days Ahead | partial

Shown: gamemode_tutorial.cpp names explicit lessons for movement, perception, equipment, crafting, construction and other actions. The separate tutorial mode and JSON help owners give contextual explanations without proving that the entire ordinary UI is staged. This pass read the lesson enum and route, not every trigger or all tutorial content.

Sources: [src/gamemode_tutorial.cpp:70-130](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/gamemode_tutorial.cpp#L70-L130), [src/npctalk.cpp:9199-9245](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/npctalk.cpp#L9199-L9245).

PROPOSAL: Teach a real action in the ordinary YAIR slice with a dismissible context hint, while keeping later earned options reachable and passive progression intact.

<a id="A11"></a>

## A11: Little touches

### Dungeon Crawl Stone Soup | covered

Shown: quieter long-term allies, distinctive unique barks, sensory message channels, milestone-filtered notes, named exploration stops, default-no deletion prompts and base-versus-modified skill-target notices are concrete small touches. Their lived frequency and desktop feel remain unplayed. SMALL_TOUCHES.md translates twenty details per game without copying their text.

Sources: [crawl-ref/source/mon-speak.cc:337-395](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/mon-speak.cc#L337-L395), [crawl-ref/source/mon-speak.cc:827-878](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/mon-speak.cc#L827-L878), [crawl-ref/source/files.cc:3370-3400](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/files.cc#L3370-L3400), [crawl-ref/source/skills.cc:1280-1305](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/skills.cc#L1280-L1305).

PROPOSAL: Use fewer but better explained notifications in src/display.js, without hiding the persistent state the player needs on a laptop.

### Cataclysm: Dark Days Ahead | covered

Shown: explanatory unavailable replies, repeat responses per inventory category, preserved standard exits, optional portrait overrides, saved message history, separate diary, real-time autosave throttling and distinct blocked/deferred NPC states are small but consequential choices. Some are useful patterns and some expose failure edges, such as clearing autosave counters despite a failed save. Twenty source-linked ideas and cautions per game are in SMALL_TOUCHES.md.

Sources: [src/npctalk.cpp:8988-9134](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/npctalk.cpp#L8988-L9134), [src/npctalk.cpp:9375-9472](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/npctalk.cpp#L9375-L9472), [src/game_io.cpp:885-949](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/game_io.cpp#L885-L949), [src/npcmove.cpp:1910-1940](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/npcmove.cpp#L1910-L1940).

PROPOSAL: In src/simulation_ui.js favor clear costs, interruption reasons and readable aftermath; never announce saved success from a failed storage call.

<a id="A12"></a>

## A12: Other systems

### Dungeon Crawl Stone Soup | partial

The prior dossier already covers runes, escape scoring, entangling lifecycle and paid skill allocation at its old pin. This pass newly shows chronicle, hints, random streams and save compatibility. Inventory also finds religion, mutations, evocations, shops, branches, ghosts and spell families. Most of those complete catalogues and their economy/reward joins remain unread, not absent.

Sources: [crawl-ref/source/notes.cc:89-108](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/notes.cc#L89-L108), [crawl-ref/source/skills.cc:1270-1320](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/skills.cc#L1270-L1320), [crawl-ref/source/tag-version.h:15-65](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/tag-version.h#L15-L65).

PROPOSAL: Extend qualified run/feat receipts alongside existing endings in src/frontier_campaign.js; neither general achievements nor another prestige layer is selected.

### Cataclysm: Dark Days Ahead | partial

The source census finds items, recipes/practice, vehicles, mutations, bionics, overmap/mapgen, factions, camps, missions, achievements/conducts, weather, EOCs and UI widgets as separate families. Prior work already traces selected achievements, conducts, martial effects and practice. This pass adds dialogue, queued effects and save coordination. Complete vehicle/body/ecology/economy catalogues and all optional mods remain inventory-only.

Sources: [src/init.cpp:151-185](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/init.cpp#L151-L185), [src/game_io.cpp:734-780](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/game_io.cpp#L734-L780), [data/json/recipes/practice/mechanics.json:1-53](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/data/json/recipes/practice/mechanics.json#L1-L53).

PROPOSAL: Reuse the existing causal receipt and work owners before selecting another broad engine. Content inventory signals opportunities, not required YAIR scope.

