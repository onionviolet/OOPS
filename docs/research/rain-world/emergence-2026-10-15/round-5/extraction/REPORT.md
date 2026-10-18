# Rain World round5: outer exception scope and conditional replay

Research-only. Same Steam managed assembly SHA256 `b6be1d4e18ce219d21091b51564cb6a11c1e4106b41de903eb8e58849cb16fdb`. The initial process/input check found no competing Rain World or ILSpy worker. No game, shipped game code, personal save, profile, settings, service or Windows executable was run or changed. All earlier archives are read-only. This pass adds full ProcessManager, RainWorld and MainLoopProcess captures plus hash-matching reuses, including StoryGameSession first captured by the prior independent auditor.

Raw source and receipts: `/Users/weiwei/.codex/research/rain-world-emergence-2026-10-15/round-5/extraction/source/`. Exact current locators/commands/hashes: [SOURCE_INDEX](SOURCE_INDEX.json). Exact reviewed/unread interval union: [CUMULATIVE_COVERAGE](CUMULATIVE_COVERAGE.json). Full class capture and a structural keyword scan are not whole-class semantic reading.

## RW5-F1: There is no managed transfer-specific outer recovery in the inspected call chain

The round4 failure-order trace established that Player.UpdateMSC increments timeSinceSpawned before entering the exact==5 startup branch. That branch sets the shared game's spawnedPendingObjects=true before pending-object or friend processing. GrabSavedCreatures then clears the whole pending-friend list before SpawnCritters starts creating each returned record. SpawnCritters has neither a per-record catch nor a null-return gate.

This pass follows an exception outward instead of assuming an engine wrapper retries the operation. Exact callsites are:

| Layer | Code locator | Behavior relevant to propagation |
| --- | --- | --- |
| Player | Player.cs:5640-5645,7077-7098 | Update calls UpdateMSC; counter increment and startup latch precede transfer |
| Room | Room.cs:4606-4688, especially4636 | Calls each nondeleted, nondeferred object's Update when eligible; no per-object catch around that call |
| Game simulation | RainWorldGame.cs:2178-2207, especially2192 | Iterates active, nonunloading rooms and calls Room.Update |
| Fixed-step wrapper | MainLoopProcess.cs:29-48 | Calls virtual Update before reducing its time accumulator |
| Game wrapper | RainWorldGame.cs:1908-1930,2027-2056 | Reaches base.RawUpdate after game-specific timing/input work |
| Process manager | ProcessManager.cs:439-530, especially513 | Calls currentMainLoop.RawUpdate directly |
| Unity component hook | RainWorld.cs:1009-1143, especially1121 | Calls processManager.Update outside the unrelated world-version read try/catch |

A structural scan retained all try/catch/finally keyword lines across the relevant complete method ranges. Player.Update, Room.Update and both game Update/RawUpdate ranges contain no such handlers. MainLoopProcess was read fully. ProcessManager's inspected call prefix contains no handler; later mod-finalization catches do not enclose the already completed RawUpdate call. RainWorld's only try/catch in its Update method surrounds reading worldVersion, before the later manager update. Full structural windows and source hashes are retained privately in STRUCTURAL_CHECKS.json, separately from semantic coverage.

Thus an exception from this transfer is not caught and converted into a retry, list restoration or latch reset by the inspected managed chain. It unwinds the current invocation into Unity's component-dispatch boundary. This pass did not inspect native Unity exception dispatch, hook-based external mods or the next interactive frame, so it does not claim that the entire application exits or that Unity never calls Update again.

If the engine later invokes these objects again, the already incremented counter and pre-set latch remain. The next successful UpdateMSC increments beyond5, and no local replay branch is selected. The MainLoopProcess time accumulator is reduced *after* Update, so an exception before that reduction also leaves its accumulator unchanged. That detail does not undo the player counter or queue/latch changes. The evidenced claim is no automatic same-game retry through this startup route, not absence of every conceivable recovery in all external code.

## RW5-F2: A process replacement can reload a retained payload, but resume and starvation reuse differ

`ProcessManager.cs:930-975` shuts down or pauses an outgoing main process, marks it inactive and clears the current pointer. `RainWorldGame.ShutDownProcess:2479-2509` unloads active rooms and clears visual/audio resources; it does not restore pending-friend strings or reset the old game's startup latch in these windows.

`PostSwitchMainProcess:979-1018` has two distinct paths. If pendingProcess exists, it restores that object and calls ResumeProcess; it skips the new-process branch entirely. That is a resumed game object, so a fresh false latch and fresh saved-friend queue cannot be inferred.

Otherwise, the method calls progression.Revert for most destinations, including ProcessID.Game, with listed screen exceptions. It then constructs a new RainWorldGame for Game. `PlayerProgression.Revert:2851-2861` clears currentSaveState and map caches, not the backend file's retained save value. It also does not clear starvedSaveState. Separately ClearOutSaveStateFromMemory at2214-2219 clears both current and starved states; these are different methods and must not be substituted for each other.

A newly allocated RainWorldGame has a default false bool latch; the previously saved static IL field-reference ledger found no explicit false assignment that resets it on the old object. The constructor's session choice at680-714 creates the appropriate StoryGameSession for ordinary story, safari and special dream routes. `StoryGameSession:135-162` calls progression.GetOrInitiateSaveState.

`GetOrInitiateSaveState/LoadGameState:2945-3015` can still revive starvedSaveState before constructing a new state. It can also return an existing matching currentSaveState on routes that did not clear it. Only the actual new-state/load branch selects a campaign record from GetProgLinesFromMemory and calls SaveState.LoadGame. MenuSetup.LoadInitCondition (`ProcessManager:107-163`) is true for Load or FastTravel, not every possible game-start mode. Missing/loading save data, a missing key, nonload setup or an unmatched campaign can start clear instead.

`SaveState.LoadGame:1375-1388` repopulates pendingFriendCreatures from a retained FRIENDS tag. A fresh game/player can then reach the same fifth-update transfer path again. The code therefore supports **conditional replay on a fresh load path**, not an unconditional permanent loss after every failed attempt and not a guaranteed successful retry. The same malformed record can fail again; a resumed process or revived consumed starved state can retain the already consumed queue instead.

| Route | Source-supported result |
| --- | --- |
| Later update on the same game/player | Startup counter/latch block this route's automatic replay |
| Resume pendingProcess | Same game object resumes; no new queue reload or latch implied |
| New Game branch after Revert, valid Load/FastTravel campaign record | Can parse FRIENDS from retained backend payload and attempt again |
| New Game while eligible starvedSaveState exists | May revive that in-memory state, bypassing retained-payload parse |
| New/nonload setup or missing/loading/ineligible saved campaign | Can start clear; no FRIENDS replay established |

## RW5-F3: In-memory consumption is distinct from the retained payload and disk persistence

`SaveState.GrabSavedCreatures:2284-2316` mutates current runtime lists; it contains no storage Set or save request. Its spawnedPendingFriendCreatures list is only an attempted-prefix/all-originals ledger, as established by the prior whole-main-assembly static reference scan. This pass found no new recovery consumer that reads it.

`PlayerProgression.GetProgLinesFromMemory:2371-2396` reads the retained backend file object's save key. A newly requested game normally reparses that in-memory key, not the currently mutated SaveState lists and not necessarily a new physical disk read. A process switch clearing currentSaveState does not prove cloud/disk refresh. Round3's write acceptance, deferred mode and default I/O error limits remain in force.

`SaveDeathPersistentDataOfCurrentState:3020-3084` can encode changed death-persistent metadata into the retained existing campaign string while keeping its other tagged sections. In the direct merge loop, only DEATHPERSISTENTSAVEDATA is substituted; other fields, including a preexisting FRIENDS tag, are copied. Therefore a death/quit metadata write is not proof that the consumed runtime friend queue replaced the last retained transfer payload.

One actual side consumer required checking: on death/quit this method calls Watcher.WarpPoint.ScrubNonDeathPersistentData before assembling the merge. The sibling auditor captured the full class and inspected its method at3207-3253. It restores/manipulates sealed-room and warp-timing data and has no explicit FRIENDS/pendingFriendCreatures mutation, region recapture or save request. Nested warp parser internals and arbitrary external hooks are not silently covered. That bounded check supports the direct tagged-merge conclusion without claiming all possible callbacks are inert.

A later full world save is different: it invokes SaveState.SaveToString with the then-current selected state, so an empty runtime pending list can produce no FRIENDS section, while a new region snapshot can select still-present companions again. No such success-path save was executed here. Actual storage durability of any last retained FRIENDS payload remains unverified, so wording such as 'the companion is definitely still on disk' is not supported.

## Evidence and remaining limits

The bounded questions are now source-resolved: no transfer retry handler in the inspected managed call stack; explicit same-game one-shot limits; a conditional fresh-load replay route; and separation among consumed queues, attempted markers, retained payload and physical storage. These are research findings, not proposals to alter YAIRPG or the reference game.

Remaining named edges are native Unity dispatch after an uncaught hook exception, external mods/reflection, actual enabled module/start-mode combinations, retained backend versus durable disk/cloud freshness, and gameplay success of the repeated creature factory/placement. The complete broader RainWorld/ProcessManager/Room classes remain only partly read, with exact unread intervals retained. No additional platform survey or unrelated class export was selected.
