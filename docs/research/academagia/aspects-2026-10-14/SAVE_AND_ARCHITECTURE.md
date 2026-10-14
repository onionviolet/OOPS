# Save and implementation detail

Labels: **shown** is inspected source, **inferred** is an interpretation, **unverified** is runtime behavior. Sources refer to the prior private extract root listed in TOOLING. No user save or cache was opened and no game/assembly code was executed.

## S1. Save layers

`GameLogic.dll/Academagia.Storage/RepositorySerializer.cs` writes a temporary folder, then ZIP-packs it as an `.ams` file. Metadata uses CustomSerializer's BinaryFormatter helper; content and dynamic object bodies use custom readers. It is not one JSON document and it does not embed all static content resources.

| File / layer | Source-shown contents | Restore behavior |
|---|---|---|
| GameInfo.bin | Official-content identity, mod order/identity, content version, save name/description and live ID sequence | GameInfo drives compatible cache selection and live ID sequence |
| Mods.ini | Selected mod metadata | Missing compatible cache can be reconstructed using selected mods |
| Manifest.bin | Assembly-version manifest | Saved GameLogic version controls version-aware readers |
| header.bin + data.bin | The 24 ChangeableObjectTypes, including actors, skills, items, locations, effects and selected action types | Load cache content first, then DeserializeSavedObjects overlays saved mutable records |
| GameHeader.bin + GameData.bin | Surviving live game objects, each with Int16 type ID and GUID header followed by body | Allocate objects first, then deserialize bodies so GUID references share object identity |
| Systems.bin | RootObject.GetAllSystems in fixed order | Construct systems without initialization, then read each system stream in matching order |
| External cache | Full selected content, GUID-named media and string-cache files | Referenced on load rather than copied wholesale into each save |

Saved mutable categories are not merely “changed fields”: the serialization call writes records from the ChangeableObjectTypes list. A future sparse-diff claim would need evidence of an additional filtering layer. Static story writing and most static authoring tables remain content-cache dependencies.

The root initializes AllowanceSystem but does not include it in GetAllSystems. This is not proof of lost money: allowance effects operate on saved character statistics, and the AllowanceSystem class must be assessed for its own durable state before declaring a missing-save bug. Nested ControlSystem, StudySystem, IllegalSystem and other helpers can be serialized by their parent; root-array membership alone is not a complete persistence census.

## S2. Saved consequences versus derived views

| System | Explicit saved state inspected | Derived / transient evidence |
|---|---|---|
| StorySystem | Resolved actor bindings, successful investigations, pending continuances, remaining roots, current story/initiator, counter, played-event GUIDs and adventure ancestry | UI FlowDocument sections and last-section marker are not the story-state record |
| ResearchSystem | ActorSkill -> accumulated research points | Remaining points calculated from next threshold minus reserve |
| AISystem / AIStateBag | Student state bags, default effect objects, option states, five AI table references and adapted effect/goal values | Available option filtering and daily scheduling run from current state |
| ActionScheduler | Character/date schedules, versioned slot state and target autocomplete | Available action/ability/spell/item-ability dictionaries are cleared by Reset |
| ClazzSystem / ExamSystem | Prior lane traced saved term gain dates and assessments | UI timetable is a view of those persisted results |
| SpellSystem | Base execution contexts, delay-condition map and event-condition GUIDs | Load reattaches Destroyed callbacks from saved GUIDs |
| FeedbackSystem | General-time feedback dictionary serialized explicitly | Separate duel/Rimbal feedback dictionaries are not written in this SaveToStream method; retention through another object path is unverified |
| RimbalSystem | Current-game reference | Play list, skill lookup and captain-level dictionaries marked NonSerialized and initialized lazily |

The table is a bounded source audit, not every field of every system. It preserves a distinction that matters for YAIRPG: a persisted gameplay fact, a rebuildable menu cache and a UI document are different things.

## S3. Compatibility and recovery

Loading waits for background NPC scheduling, releases the current string cache and looks up a matching content/mod profile. With no matching cache it rejects a different official-content GUID or a missing selected mod, then otherwise recreates the content cache. It extracts the save to a fresh temporary folder, reads saved assembly metadata, loads static cache records, overlays saved mutable records, restores live objects/systems, updates statistics and reinitializes media.

Version gates are shown in ActionScheduler (phase slots and target autocomplete), CharacterSystem (statistics), CliqueSystem (added infighting fields), SystemObjects (older clique handling) and StorySystem (ancestry). This is version-aware deserialization and some older-state handling. It is not a proven complete migration matrix for all published versions. Cache content version and saved GameLogic version have separate roles.

SaveGame creates temporary contents **before** deleting the old destination, but then deletes that old file before packing the replacement ZIP. No atomic rename/replacement is shown in this route. If the result is under 1,000 bytes, it displays a damaged-save message and retains the temporary files for support. Larger files are not validated by checksum or a read-back in this method. Exceptions during LoadGame are logged to console and rethrown. Cache-list discovery separately catches malformed entries and skips them. These are shown recovery policies, not tested corruption outcomes.

GameController.EndGame triggers an autosave on the term ending, waits for NPC scheduling and chooses a new name using player display name, wall-clock date and an incrementing suffix. The reviewed ordinary NextDay path does not call that autosave method. Full save UI/settings frequency remains unread. Wall-clock autosave names are not offline simulation. No elapsed-real-time catch-up appears in the inspected load/day paths.

**PROPOSAL S4:** ENGINE_EXPANSION/persistence owner: save the earned facts, scheduled work and relevant AI memory under stable IDs; rebuild presentation caches. Make content-profile/version compatibility explicit. Write and validate a replacement before atomically publishing it, with a preserved recoverable previous save. This proposes architecture; it does not authorize changing YAIRPG's current saves.

## I1. Architecture and execution

The installed build is managed .NET with a Windows WPF application/UI, ContentModel records, Storage serializers/editor infrastructure, GameLogic systems, Common command contracts and Academagia.Core interfaces. Runtime content is a custom 112-type GUID registry; Firebird/NHibernate appear in authoring infrastructure, not as the shipped gameplay database. Designer selection trees are XML; conditions/effects bind typed records via numeric path IDs and selected GUIDs. ResolveStrategyEx imports System.Linq.Dynamic and filters selected lists with stored expressions. No general Lua/JavaScript dialogue VM was found in the reviewed path; this does not inventory every external dependency's scripting ability.

Repository.InitializeRootObject constructs the runtime system objects by reflection, optionally initializes them, and puts them on RootObject. The inventory separates initialized systems from the serialized root order. Effects execute through typed wrappers and EffectType-specific implementations, not copied narrative scripts.

GameController.ResolveNextDay gathers and resolves the player's three planned actions. NextDay resolves outstanding choices, processes three phases, advances to night, handles random/everyday/calendar effects, runs daily updates, refreshes statistics and default schedules, reduces memory, then schedules NPCs in a BackgroundWorker. ManualResetEvent coordinates saves/loads with that worker. It is turn/day advancement, not proof of passive wall-clock progression.

CommandDispatcher sends commands through the WPF dispatcher to the main window. Synchronous commands keep a flag set until the UI supplies a response. Story choices return selected Exit and sacrifice actor through CommandParam and clear the synchronous flag. This is a shared command bridge and blocking choice handshake, not a network bus.

Shown memory/performance choices: caches of available actions, weak GCHandle storage for live game objects, RootDB.ReduceMemory, garbage collection every eighth NextDay, string caches for content and background scheduling/media work. There is no benchmark or measured performance claim in this pass.

**PROPOSAL I2:** ENGINE_EXPANSION and world-authoring owners: keep an explicit content registry, typed effect contract and observable simulation step. Record generated schedules and consequential decisions; keep caches replaceable. Borrow the distinction, not the source's global singleton, forced garbage collection or UI wait-loop implementation.
