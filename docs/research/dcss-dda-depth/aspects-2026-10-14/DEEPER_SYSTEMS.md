# Dungeon Crawl Stone Soup and Cataclysm: Dark Days Ahead: deeper systems, 2026-10-14

The top three newly covered systems per game are ranked by practical payoff to existing YAIR owners. These are new depth beyond the supplied selected-mechanic dossiers, not new product requirements. Each source route is static evidence.

## Dungeon Crawl Stone Soup

### D1: Speech is an observation-filtered projection

maybe_mons_speaks first filters actor state, then chooses probability by unique/allied/band/fleeing/confused context. mons_speaks builds contextual keys; mons_speaks_msg substitutes actor references and interprets channels, checking cell and actor visibility. A visual cue can survive silence while an unseen visual actor cue is suppressed. The old developer probability text drifts from code. The reviewed rendering route does not offer player responses or grant a quest reward.

Sources: [crawl-ref/source/mon-speak.cc:337-445](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/mon-speak.cc#L337-L445), [crawl-ref/source/mon-speak.cc:827-878](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/mon-speak.cc#L827-L878), [crawl-ref/docs/develop/monster_speech.txt:1-45](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/docs/develop/monster_speech.txt#L1-L45).

PROPOSAL and later gate: src/simulation_ui.js should generate barks only from facts the player can observe, and reduce repetition for permanent companions. Gate: unseen/heard-only/visible states reveal appropriate evidence without leaking hidden actor facts or changing gameplay RNG.

### D2: Save compatibility has several layers

save_game commits a package at checkpoints; _restore_game checks summary/version compatibility before accepting. Incompatible data can be declined with abort rather than header rewriting; invalid saves offer default-no deletion. Notes, hints and RNG each serialize separately. Hint event-count mismatch discards its cache; note version mismatch declines that record list. tags.cc contains many version branches, not one generic migration. Package crash atomicity and every old-version route remain unread.

Sources: [crawl-ref/source/files.cc:2651-2712](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/files.cc#L2651-L2712), [crawl-ref/source/files.cc:3214-3275](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/files.cc#L3214-L3275), [crawl-ref/source/files.cc:3370-3400](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/files.cc#L3370-L3400), [crawl-ref/source/tag-version.h:15-65](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/tag-version.h#L15-L65), [crawl-ref/source/tags.cc:748-775](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/tags.cc#L748-L775), [crawl-ref/source/tags.cc:1301-1340](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/tags.cc#L1301-L1340), [crawl-ref/source/random.cc:20-60](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/random.cc#L20-L60), [crawl-ref/source/notes.cc:550-585](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/notes.cc#L550-L585).

PROPOSAL and later gate: src/save_compatibility.js should separate optional presentation cache loss from invalid simulation state. Gate: an unknown hint-cache version may rebuild explanations, while an unknown economic schema rejects safely and preserves the input.

### D3: Separate random streams protect reproducible rules

random.cc stores persistent generator vectors, can select branch streams, and uses RAII generator/subgenerator scopes to restore prior state. User-script RNG is isolated from seeded gameplay. Serialization load checks vector size, with an explicit warning that removing stream slots affects compatibility. Persistent state and debugging draw counts are not the same data.

Sources: [crawl-ref/source/random.cc:20-130](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/random.cc#L20-L130), [crawl-ref/source/skills.cc:1270-1320](https://github.com/crawl/crawl/blob/c4298273a49c6601be4e1c9b79d4aba43f9aa603/crawl-ref/source/skills.cc#L1270-L1320).

PROPOSAL and later gate: src/simulation_contracts.js should make random ownership explicit. Gate: opening a tooltip, filtering a chronicle or selecting a flavor bark must not alter the next material/combat result. Compare save/reload from the same generated state before making a deterministic replay claim.

## Cataclysm: Dark Days Ahead

### D1: Dialogue conditions, failures and side effects

A topic can select dynamic text, portrait and speaker effects; responses have conditions, trials, success/failure and a next-topic target. Missing trial failure is a parse error. Failed conditions may synthesize a visible explanation response. Ordered switch/default responses and inventory repeats generate choices. apply executes effects and opinion changes and may force a hostile ending. Some dynamic-line evaluation consumes reason state. This is why blindly evaluating dialogue to preview it can be unsafe.

Sources: [src/npctalk.cpp:8497-8528](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/npctalk.cpp#L8497-L8528), [src/npctalk.cpp:8988-9134](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/npctalk.cpp#L8988-L9134), [src/npctalk.cpp:9168-9374](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/npctalk.cpp#L9168-L9374), [src/npctalk.cpp:9375-9472](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/npctalk.cpp#L9375-L9472), [data/json/npcs/Backgrounds/evacuee_2.json:1-44](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/data/json/npcs/Backgrounds/evacuee_2.json#L1-L44).

PROPOSAL and later gate: src/components/dialogue_component.js and src/models/dialogue_action.js should distinguish preview predicates from committed effects. Gate: repeated preview gives no reward or opinion change, commit rechecks costs and actor access, failure is legible, and revisiting after reload retains the exact consequence.

### D2: Recurring effects keep context and an inactive state

queue_effect_on_condition stores absolute calendar time and context in global or actor queues. process_eocs pops due work, builds a nested dialogue, calls activate and either defers requeueing, deactivates or erases it. Requeueing from current turn differs from replaying every missed interval. Global processing occurs on avatar handling only. Serialized context makes delayed work attributable after reload. Full EOC effect vocabulary and queue migration checks are not audited.

Sources: [src/do_turn.cpp:533-627](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/do_turn.cpp#L533-L627), [src/effect_on_condition.cpp:235-335](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/effect_on_condition.cpp#L235-L335), [src/savegame.cpp:142-164](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/savegame.cpp#L142-L164), [src/savegame.cpp:309-322](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/savegame.cpp#L309-L322).

PROPOSAL and later gate: src/simulation.js should explicitly select coalesce, skip or replay policy for each recurring event. Gate: split versus large elapsed steps produce the declared result, global events do not duplicate per NPC, and missing/invalid subjects create a visible pause rather than free output.

### D3: Composite saves expose partial-failure joins

game::save writes player, achievements, factions/missions/NPCs, dimensions, maps and settings in sequence. A false return can follow earlier writes. The compressed player branch uses temporary archive compaction and rename, but that does not make every world file transactional. unserialize_impl mutates as it reads; JsonError is caught by a void wrapper. quicksave resets counters after calling save regardless of success. These are source-observed control flows, not reproduced corruption incidents.

Sources: [src/savegame.cpp:84-164](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/savegame.cpp#L84-L164), [src/savegame.cpp:199-328](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/savegame.cpp#L199-L328), [src/game_io.cpp:601-640](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/game_io.cpp#L601-L640), [src/game_io.cpp:734-780](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/game_io.cpp#L734-L780), [src/game_io.cpp:885-949](https://github.com/CleverRaven/Cataclysm-DDA/blob/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847/src/game_io.cpp#L885-L949).

PROPOSAL and later gate: src/native_storage_transaction.js should keep dirty state and last-good artifacts until all declared owners publish successfully. Gate: injected storage rejection preserves the old usable state and reports failure; importing malformed data cannot leave a half-new clock/player/world combination.

