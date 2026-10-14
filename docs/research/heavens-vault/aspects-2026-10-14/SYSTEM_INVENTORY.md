# System inventory

SHOWN: 1299 C# files in the retained assembly extract. This inventories the recovered managed surface, not every installed asset or external assembly. [SYSTEM_INDEX.json](SYSTEM_INDEX.json) lists every recovered file and byte size so uncategorized helpers remain reachable. Names/counts establish presence, not semantic coverage. No free-text-world sub-sources are assigned in this lane.

| System | Where | Size signal | Coverage |
|---|---|---|---|
| Ink runtime / host / typed presentation | Ink.Runtime/; StoryScript; StoryMoment; ScriptParser | format 19; 655 list definitions; 3165 root named entries | Prior story digest; A01/A03 extends |
| Translation / morphology / inscription construction | Translation/; GameData | 867 words; 43 atoms; 58 inscription rows | Prior KNOWLEDGE; full generation unread |
| Evidence recombination / knowledge | Player; StoryScript; Translation/EntityLexDictionary | 20 Player save fields, including multiple knowledge stores | Prior knowledge and story; A04 extends |
| Timeline / history / recap | Timeline*.cs; History; StoryCatchup*.cs | 302 timeline rows; 8 age rows | Prior timeline; recap source surface extended |
| Clues / artefacts / locations | Clue*.cs; Autefact*.cs; StoryLocation*.cs | 101 clue rows; 17 story location rows | Prior census; individual narrative unread |
| River graph / pathfinding / travel skip | SpaceGame.Pathfinding*; ShipPather; SpaceSkipUI | directed edge families and estimates | Prior RIVERS_AND_PACING |
| Character staging / locomotion / ambient behavior | StoryCharacter; Walker; Turner; AmbientPoseChooser | role, speaking, pose and timer state | NEW A05; full navigation unread |
| Conversation UI / camera / animation / narrative audio | Dialogue*; StoryCamera*; StoryEvent*; Frame* | typed line/manner and many presentation helpers | NEW bounded A01/A06/A11 |
| Save / load / migration / serialization | SaveThread; Saver; Loader; CryptSaving; Game | version 2/minimum 1; explicit save lists | NEW deeper system |
| Tutorial / staged translation support | Translation/PlayerTutorialManager; PlayerTutorialItem | 17 translation practice entries | NEW deeper system |
| Settings / input / accessibility hooks | UserSettings; StoryDesktopInput; StoryGamepadInput; Input* | audio, text and input fields | NEW bounded field inspection; UI unrun |
| Map / planner / search / oxygen and ruin generation | Planner*; Map*; SpaceGame/ | configuration and consumers in managed index | Partly prior travel; full hazards/generation UNDOCUMENTED |
| Achievements / completion / repeat-run hook | Achievement*; Game; StoryScript | completion count passed to Ink | NEW hook only; full retention UNDOCUMENTED |
| Rendering / layout / utility / middleware / developer tools | namespace census below and SYSTEM_INDEX | all residual managed files retained in index | Mostly UNDOCUMENTED; not inferred gameplay |

## Managed namespace-directory inventory

Each directory is an extraction grouping, not necessarily an independent gameplay system. Top-level files appear as `.`. Every individual filename and size is in SYSTEM_INDEX.

| Directory | C# files |
|---|---:|
| `.` | 747 |
| `ActionIcon` | 8 |
| `CycleGrapher` | 3 |
| `DeepSky.Haze` | 10 |
| `DevCinematographer` | 12 |
| `Ink.Runtime` | 42 |
| `Planner` | 4 |
| `PlayModeSaver` | 2 |
| `Properties` | 1 |
| `Screenshotting` | 2 |
| `SoftMasking` | 9 |
| `SoftMasking.Extensions` | 1 |
| `SpaceGame` | 113 |
| `SpaceGame.Audio` | 6 |
| `SpaceGame.Pathfinding` | 33 |
| `SpaceGame.Pathfinding.Graph` | 11 |
| `SpaceGame.River` | 29 |
| `SpaceGame.River.Particles` | 12 |
| `SpaceGame.Rocks` | 9 |
| `SpaceGame.Ship` | 46 |
| `SplineSystem` | 5 |
| `Translation` | 111 |
| `UnityEngine.AI` | 5 |
| `UnityEngine.EventSystems` | 2 |
| `UnityEngine.PostProcessing` | 47 |
| `UnityEngine.UI` | 3 |
| `UnityEngine.UI.Extensions` | 6 |
| `UnityX.Editor.Icon` | 3 |
| `UnityX.Geometry` | 9 |
| `UnityX.StateMachine` | 5 |
| `UnityX.Versioning` | 2 |
| `Utils.Algorithms` | 1 |
