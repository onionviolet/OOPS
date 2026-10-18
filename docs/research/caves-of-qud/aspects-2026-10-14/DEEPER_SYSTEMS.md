# Three high-payoff gaps beyond the prior catalogue

These were thin or undocumented in the original five-path dossier. The newer audit partly covered ritual gates and UI but not these complete boundaries. All results are static, no native save, action or visual proof.

## D1: Conversation admission differs from effects

**SHOWN chain:** ConversationLoader.ReadConversation/LoadConversations reads and merges XML, bakes inheritance, then distributes child graphs. Conversation.GetStart wakes candidates, stable-sorts descending priority, selects a visible start. IConversationElement.LoadAttributes separates recognized predicate/action delegates; Prepare runs text and subject/object events. ConversationUI.Prepare filters visible choices and sorts them.

On Select, the inspected order is choice.Enter → current node.Leave → resolve/awake target → target.Enter → choice.Entered → current node.Left → target.Entered → chat-node sound. Failure before Entered stops the transition in these branches. But the entry hooks themselves are executable events, so this ordering is not a general guarantee of side-effect-free preview. Entered executes action delegates with per-action exception logging, then sends EnteredElementEvent. There is no demonstrated rollback across actions/handlers.

**Important exceptions:** RequireReputation calculates its gate in PrepareTextEvent and later returns the stored Fulfilled value. CheckPredicate's default is true for unresolved/failed delegate paths. QuestHandler changes quest state after entry. WaterRitualLearnSkill calls UseReputation before AddSkill, and a separate SP check precedes Unlock; it does not return a typed transactional success from Unlock. Never summarize this as all conditions freshly checked and all costs charged only after proven success.

**Size/receipts:** 212 raw conversation declarations, 3,482 choices, 1,503 nodes, 119 starts across the two Base XMLs. Includes inherited/reused/dynamic graph material, not unique displayed lines. `notes/table-counts.json`, `extract/trees/Conversations.json`, `extract/trees/HiddenConversations.json` retain complete structure and prose privately. Source: ConversationLoader entire class; Conversation.GetStart; IConversationElement Prepare, Enter/Entered, CheckPredicate, IsVisible and LoadAttributes; ConversationUI 491–630; RequireReputation and QuestHandler entire types.

**PROPOSAL:** use the existing social/narrative command owner to separate offer generation, permission and actual committed service result. Keep a source-attributed teaching receipt in actor knowledge. Later acceptance: stale affordability refusal, failed grant, repeated selection, changed quest state and save/reload, with costs and result checked separately. This research selects no implementation.

## D2: Main save is a coordinated envelope, not one JSON file

**SHOWN chain:** XRLGame.SaveGame snapshots fields and explicit subsystem owners through SerializationWriter version 409, then publishes summary JSON, copies previous compressed payload to .bak, compresses the in-memory stream and writes .sav.gz. CheckSave verifies size and gzip signature. It does not parse the payload or prove references/cache consistency. A failure can call SaveGameError to copy .bak back; metadata was written earlier and is not shown restored in that handler.

LoadGame tries a missing compressed payload's backup, reads custom stream/header, checks save range 395–409 and section sentinels, and invokes subsystem loaders. Some primary upgrades attempt backups of payload plus Cache.db. SerializationReader.ReadTypeFields honors FieldSaveVersion. ActionManager saves queued objects and delayed command entries; history writes events through entities and reconstructs indexes. ZoneManager freezes zone payloads into a cache transaction and supplies elapsed simulation ticks during thaw. All are separate restoration responsibilities.

**Limits:** the main SaveGame signature returning Task does not demonstrate asynchronous publication; inspected successful path returns null. Reader error recovery is not proof of corruption immunity. The decompiled gzip branch is suspiciously collapsed, so uncompressed legacy loading stays unread until an IL comparison. Compatibility range is not proof every old save works. No private saves or platform I/O implementations were exercised.

Source: XRLGame 1677–1805, 1917–1938, 2249–2478; SerializationReader 374–413; ActionManager 85–146; ZoneManager FreezeZone/TryThawZone; History 57–86; AutoSaveCommand entire type. Full source retained; only named windows/methods support these findings.

**PROPOSAL:** route to the existing durable native save publisher, keeping a manifest/version and mutually compatible metadata, world cache and committed command state. Later acceptance: interruption between metadata/payload/cache steps; last-known-good selection; unsupported version rejection; exact save/reload/import of a changed pending command. Do not replace YAIR's current publisher with Qud's format.

## D3: Tutorial is a saved executable context

**SHOWN chain:** TutorialManager.TutorialManagerGameSystem.BeforeSave records current step type and integer substep. AfterLoad resolves that class via ModManager, restores the integer and starts it; exceptions are logged. The outer manager delegates context questions to the current TutorialStep, including tooltip availability, inventory interaction and examination-roll adjustment, and owns popup/highlight fields. Twelve JoppaTutorial classes and multiple tutorial maps are indexed.

This is a distinct lesson state machine attached to the same game lifecycle, not merely a saved checkbox. It also means content renames and missing types need deliberate compatibility behavior. The exception path does not prove every old highlight or current step is cleaned up. Runtime Unity references and all lesson progression are unread.

Source: TutorialManager 1–180 and named hook declarations through AllowInventoryInteract. `Base/EmbarkModules.xml`, `Base/Manual.xml` and tutorial RPM filenames are indexed; RPM geometry is unread.

**PROPOSAL:** existing onboarding/knowledge owner can save stable lesson and step IDs, derive transient highlight targets after load and gracefully dismiss unavailable guidance. Target desktop 1366×768; optional contextual help must preserve log and useful panels. Later acceptance: reload mid-lesson, change location before resuming, close/reopen help, remove stale target and complete useful action. No implementation or UI acceptance claimed.
