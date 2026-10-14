# System inventory

SHOWN: 1506 C# files in the retained assembly extract. This inventories the recovered managed surface, not every installed asset or external assembly. [SYSTEM_INDEX.json](SYSTEM_INDEX.json) lists every recovered file and byte size so uncategorized helpers remain reachable. Names/counts establish presence, not semantic coverage. No free-text-world sub-sources are assigned in this lane.

| System | Where | Size signal | Coverage |
|---|---|---|---|
| Legacy event scheduler / conditions / actions | Vagrus.Data/GameEvent; EventStep; EventScriptParser | 1178 events / 17223 steps / 34323 choices | Prior EVENT_ENGINE; this A01 UI bridge extends |
| Conversation presentation / portraits / localization / tooltips | EventUI; Vagrus.UI/EventChoiceButton; TextTemplate | stable choice map and locale review hooks | NEW deeper system |
| Persistence / migrations / save queue | Vagrus/SaveGame; SaveData; Crypto; Vagrus.IO/VFile | version 37/minimum 14 | NEW deeper system |
| Combat AI / tactical simulation | HeroCombat; AiTweak; CombatCharacter; Sim* | bounded iteration policy and outcome scoring | NEW deeper system; full combat unread |
| Trade / markets / travel / supplies / crew | Caravan; Node; Goods; Market* | prior quantity/stock/cost consumers | Prior ECONOMY_TRAVEL |
| Companions / loyalty / roles / quests | Character; GameCharacter; Journal; CustomScripts | 12 crew rows; 517 Character rows are not all companions | Prior COMPANIONS_CREW; full personal quests unread |
| Journals / codex / rumors / news / notes / map markers | Journal; CodexEntry; Rumor; News; SaveData | separate saved collections | Prior partial; A02 extends schema; full content unread |
| Typed graph exploration / objectives / challenges / treasures | Vagrus.Exploration*; EventGraphAotHelper; build.json | 46 base graphs / 569 subevents | NEW adapter surface; full controller UNDOCUMENTED |
| Tutorial / UI unlock and repair | Tutorial*; SaveGame.ApplyTutorial | 195 tutorial rows | NEW bounded A10 |
| Properties / dependencies / effects / statuses / perks / skill progression | Prop*; Effect*; Skill*; PropertyDependencyGraph | see full table census below | Prior partial; whole effect algebra UNDOCUMENTED |
| Tasks / passengers / mercenary / expedition / trade contracts | Task*; Passenger*; Caravan | see table census below | Prior economy/event; full generation UNDOCUMENTED |
| Gear / equipment / mounts / containers / inventory custody | Gear*; Equipment*; Container*; Cargo* | see table census below | Prior partial; full inventory lifecycle UNDOCUMENTED |
| Crew combat / hero combat / deployment / formations | CrewCombat*; HeroCombat; CombatTemplate* | 968 hero and 492 crew combat template rows | Prior bridge only; whole tactics UNDOCUMENTED |
| Outposts / factions / regional effects / camps / unrest | Outpost*; Faction*; Region*; Camp*; Node* | 378 nodes; 148 regions; 88 faction rows | Prior partial; whole settlement/faction closure UNDOCUMENTED |
| DLC / products / ambitions / achievements / collections | DLC*; Store*; Achievement*; leader and Goods | 18 product rows; 114 achievement rows | Prior DLC_CONTENT; actual access unqueried |
| Input / controller / audio / assets / rendering / tests / middleware | namespace census and SYSTEM_INDEX | all remaining file names and byte sizes retained | Mostly UNDOCUMENTED; testing types are not executed checks |

## Every recovered AirTable table

Counts are a structural census, not full semantic reads. Table names map to the systems above; full payload remains private in vagrus-2/extract/AirTable.json. Missing Journal/codex narrative tables are not silently treated as absent from the game.

| Table | Rows |
|---|---:|
| Nodes | 378 |
| Regions | 148 |
| CodexTags | 15 |
| Passengers | 462 |
| Rumors | 85 |
| FactionsLocation | 88 |
| TradeTasks | 592 |
| MercenaryTasks | 319 |
| MercenaryTasksFlavorTexts | 237 |
| ExplorationTasks | 3 |
| SourceLevels | 11 |
| Factions | 88 |
| Methods | 89 |
| Properties | 590 |
| Dependencies | 166 |
| Impacts | 34 |
| Effects | 1143 |
| CrewCombatActions | 29 |
| Status | 102 |
| Crew | 12 |
| Perks | 125 |
| EffectProps | 357 |
| Characters | 517 |
| Skills | 737 |
| Items | 118 |
| Equipment | 93 |
| Goods | 58 |
| Gears | 86 |
| CombatTemplates | 968 |
| CrewCombatTemp | 492 |
| CrewCombatAttributes | 69 |
| Containers | 133 |
| Initial | 44 |
| CodexEntries | 51 |
| Achievements | 114 |
| Tooltips | 756 |
| TextTemplates | 812 |
| Tutorial | 195 |
| GeneratedNames | 366 |
| Game | 28 |
| PopUpNews | 45 |
| StoreProducts | 18 |

## Managed namespace-directory inventory

Each directory is an extraction grouping, not necessarily an independent gameplay system. Top-level files appear as `.`. Every individual filename and size is in SYSTEM_INDEX.

| Directory | C# files |
|---|---:|
| `.` | 923 |
| `Properties` | 1 |
| `Rewired` | 13 |
| `Rewired.Data` | 3 |
| `Rewired.Demos` | 19 |
| `Rewired.Demos.CustomPlatform` | 12 |
| `Rewired.Demos.GamepadTemplateUI` | 3 |
| `Rewired.Integration.UnityUI` | 5 |
| `Rewired.Internal` | 1 |
| `Rewired.Localization` | 2 |
| `Rewired.Platforms.Switch` | 1 |
| `Rewired.Utils` | 1 |
| `TriangleNet` | 16 |
| `TriangleNet.Geometry` | 13 |
| `TriangleNet.IO` | 9 |
| `TriangleNet.Logging` | 4 |
| `TriangleNet.Meshing` | 10 |
| `TriangleNet.Meshing.Algorithm` | 3 |
| `TriangleNet.Meshing.Data` | 3 |
| `TriangleNet.Meshing.Iterators` | 3 |
| `TriangleNet.Smoothing` | 3 |
| `TriangleNet.Tools` | 9 |
| `TriangleNet.Topology` | 4 |
| `TriangleNet.Topology.DCEL` | 4 |
| `TriangleNet.Voronoi` | 5 |
| `TriangleNet.Voronoi.Legacy` | 4 |
| `UnityEngine.UI` | 1 |
| `Vagrus` | 142 |
| `Vagrus.Data` | 47 |
| `Vagrus.Data.Sync` | 64 |
| `Vagrus.Effects` | 1 |
| `Vagrus.Exploration` | 11 |
| `Vagrus.Exploration.Data` | 43 |
| `Vagrus.Exploration.UI` | 8 |
| `Vagrus.FoW` | 11 |
| `Vagrus.IO` | 10 |
| `Vagrus.Testing` | 31 |
| `Vagrus.Testing.Suites` | 26 |
| `Vagrus.UI` | 33 |
| `Vagrus.UI.Chart` | 1 |
| `Vagrus.UI.Components` | 3 |
