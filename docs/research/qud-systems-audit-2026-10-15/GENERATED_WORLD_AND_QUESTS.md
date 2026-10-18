# S5 Generated histories, villages, quests, factions and items

The 2020 developer paper retained by the parent is historical architecture. This pass uses the supplied current-to-this-artifact code to close one generated quest through real item identity, player discovery, turn-in, reward and explicit persistence owners. It makes no newest-release claim.

## S5a Context precedes presentation

QudHistoryFactory creates histories and village-era content through concrete historic events. InitializeVillage chooses a name with a bounded duplicate-avoidance loop, stores region/palette/tier/tech tier, selects a base faction/member and derives sacred/profane context from text-fragment and spice rules. These are stored entity properties, not only a paragraph generated for the UI.

HistoricEntity.ApplyEvent attaches history/entity, sets a year, calls Generate and stores the event in entity/history. GetSnapshotAtYear applies ordered events up to the requested year to a snapshot. History/Entity/Event serializers retain years, IDs, events and property changes. HistoricStringExpander resolves entity/spice references, variables, random branches and formatting with a bounded expansion loop. Full HistorySpice.json and exact generated quest dialogue rules remain private. This is an authored grammar plus selected structured state, not a demonstrated simulation of every narrated action.

VillageDynamicQuestContext stores a VillageEntityID and retrieves a current snapshot. It uses actual world-generation location information, destination restrictions, quest number/tier, used locations and village context for rewards. Source includes special village-zero reward branches as well as ordinary village reputation plus a choice of population-table rewards. Village realization reads the historic snapshot and its sacred/profane content; every building/population/decor/history-event rule was not reviewed.

## S5b One closed fetch-item chain

| Code / stage | Connected producer, state and consumer |
|---|---|
| G1 Generate | FindASpecificItemDynamicQuestTemplate selects one of its story types, creates a context delivery item, adds DynamicQuestTarget, applies a generated name, caches it by ID, chooses a delivery target and queues giver/item zone builders at priority 6000. |
| G2 Place identity | FabricateQuestItem retrieves a CopyID-preserving cached copy, marks no-restock and places another ID-preserving copy on a lair owner or named villager, otherwise a relic container/chest with reachability fallback. This deliberately retains a logical identity across materialization; it is not proof that only one object with that ID can ever exist. |
| G3 Present/accept | FabricateQuestGiver selects a matching resident, builds quest steps and dynamic reward, registers it in DynamicQuestsGameState and adds grammar-based conversation. Accept reveals the delivery map-note secret; reject is a separate choice. Failing to find a giver returns without fabricating one in this inspected builder. |
| G4 Recognize acquisition | Manager registers inventory/take/equip/action events and compares IDMatch to its itemID. It finishes the locate step, records an accomplishment and removes its tracking entry. AfterQuestAdded also scans current inventory/equipment, supporting arrival-before-acceptance. |
| G5 Turn in | Generated dialogue checks possession of the ID. Required TakeItem moves the actual matching object to the speaker and clears quest flags; QuestHandler then requests locate and return steps. Their source priorities/events are distinct, not a global atomic transaction. |
| G6 Actual reward | XRLGame.FinishQuestStep marks finished/awarded state, awards XP once per step and asks whether all steps finish the quest. FinishQuest guards already-finished quests, invokes Quest.Finish and FinishPost; dynamic reward elements call real reputation mutation and object/choice reward routes. |
| G7 Persist | DynamicQuestsGameState writes NextID and serialized quests; manager entry writes item/quest/step IDs; Quest writes state/reward; ZoneManager saves cached objects, zones and builder collections; History saves entities/events; JournalAPI serializes notes separately. |
| G8 UI | Generated conversation and accept/refusal conditions, map-note reveal, quest-step popups, journal accomplishments and map highlighting are separate source paths. Actual screen rendering was not observed. |

The private sources preserve all selected dialogue fragments, substitutions, conditions and class bodies, with exact method locators. Public descriptions paraphrase them.

## S5c Sequence breaks and failure limits

Finding the item before accepting is specifically handled by the after-add inventory scan. Item creation at a destination can precede giver realization because builders are scheduled separately and use a cache ID. ZoneManager.GetCachedObjects creates a same-ID copy and appends the ID to CachedObjectsToRemoveAfterZoneBuild. The inspected zone-build tail clears that list; it does not itself remove CachedObjects entries in that window. Cache eviction cannot be inferred from the list name. Those facts support the intended arrival-order mechanism. They do not prove every cross-zone ordering, repeated builder, cache eviction, stolen/destroyed item or cloned-ID scenario.

AddZoneBuilderInternal adds a builder to the collection; the inspected code does not itself immediately run it against an already-built zone. The exact admission timing when a destination was generated before the quest template was installed remains open. Reaching a builder method does not prove the world generator always scheduled it early enough.

The item builder has placement fallbacks and EnsureCellReachable. It can return true even if a final chosen cell is null. The giver builder likewise returns true after no eligible giver. Source success flags therefore do not establish usable quest placement. Reward exceptions and asynchronous UI are not a rollback guarantee. The fetch manager removes its locate tracker after recognition; losing the item afterward can still block turn-in. No recovery/punishment route for that case was established.

## S5d Factions, items and records

InitializeVillage's base faction is a generation input. Supplied authored factions and dynamic village faction/privilege realization are different layers. Full Factions/ChiliadFactions tables are retained; every generated faction registration, diplomacy relation and inhabitant consumer remains partially read. Do not call the authored table the complete runtime faction set.

RelicGenerator composes a base item type/tier with selected history, element and faction-related properties. It applies concrete basic/elemental bestowals and puts historical references into descriptions. ItemNaming can later change the same object and optionally bestow more properties. The applied parts/fields carry effects; a generated adjective and its displayed text are not themselves executable mechanics. Full relic type mappings and element tables are retained. The selected armor/stat-shift/name paths are audited; every elemental power is not.

Generated narrative also has separate factual/accomplishment, mural and gospel representations. For example, a procedural acquisition can create alternate embellished accounts. These are authored representations, not independent evidence of a clan teaching event physically occurring. Journal reveal is the player-facing knowledge gate; the entire stored history is engine state.

## S5e Time and persistence boundaries

Historic years order generated events; they are not the current action scheduler. ZoneManager stores visited times and freezes/thaws zones. A thaw computes elapsed frozen ticks and sends them through Zone.Thawed to ZoneThawedEvent; activation has its own event. That establishes an elapsed-time hook, not a promise that all remote NPCs, resources and combat were simulated turn by turn. All thaw listeners and catch-up policies remain outside this checkpoint. Prior AI reports establish active response paths only.

Explicit serializers establish intended representation, not native save fidelity. Cache cleanup, duplicate IDs, interrupted saves, builder deserialization, generated dialogue restoration and repeat reward prevention across save/reload remain unexecuted. The full serialized Unity prefab/asset binding is also separate from gameplay serialization.

## S5f Remaining catalog coverage

[System catalog](SYSTEM_CATALOG.md) enumerates reviewed, captured and unread neighbors. Full generation rules, village historical events, sultan-event probabilities, placement algorithms for all quest types, ruins/maps/dungeons, all faction history consumers and offscreen simulation need separate bounded questions. This pass closes the one fetch-item chain statically and preserves the rest without a whole-game claim.

## Core source locators

The complete methods remain private. Line starts refer to this packet’s exports; the ledger limits each claim’s semantic scope.

| Complete source | Method line |
|---|---|
| [XRL.World.FindASpecificItemDynamicQuestTemplate.cs](private/source/XRL.World.FindASpecificItemDynamicQuestTemplate.cs) | 10 |
| [XRL.World.ZoneBuilders.FindASpecificItemDynamicQuestTemplate_FabricateQuestItem.cs](private/source/XRL.World.ZoneBuilders.FindASpecificItemDynamicQuestTemplate_FabricateQuestItem.cs) | 20 |
| [XRL.World.ZoneBuilders.FindASpecificItemDynamicQuestTemplate_FabricateQuestGiver.cs](private/source/XRL.World.ZoneBuilders.FindASpecificItemDynamicQuestTemplate_FabricateQuestGiver.cs) | 28 |
| [XRL.World.ZoneBuilders.FindASpecificItemDynamicQuestManager.cs](private/source/XRL.World.ZoneBuilders.FindASpecificItemDynamicQuestManager.cs) | 48 |
| [XRL.World.Conversations.Parts.TakeItem.cs](private/source/XRL.World.Conversations.Parts.TakeItem.cs) | 103 |
| [XRL.XRLGame.cs](private/source/XRL.XRLGame.cs) | 767 |
| [HistoryKit.HistoricEntity.cs](private/source/HistoryKit.HistoricEntity.cs) | 274 |
| [XRL.World.ZoneManager.cs](private/source/XRL.World.ZoneManager.cs) | 555 |
