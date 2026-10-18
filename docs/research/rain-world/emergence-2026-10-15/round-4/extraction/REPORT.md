# Rain World round4: pending companion transfer reaches its real consumer

Research-only static analysis. The same installed main assembly hash is `b6be1d4e18ce219d21091b51564cb6a11c1e4106b41de903eb8e58849cb16fdb`. No game/ILSpy worker was active at the initial check, and no game, shipped code, save, profile, settings, cloud service or native executable was executed or modified. This bounded pass writes only its round4 extraction area. Prior evidence is read-only.

Full new Player source and four exact-hash reused complete source files are archived under `/Users/weiwei/.codex/research/rain-world-emergence-2026-10-15/round-4/extraction/source/`. All locators below are exact filenames and one-based source windows there. [SOURCE_INDEX](SOURCE_INDEX.json) records commands/hashes and the current windows. [CUMULATIVE_COVERAGE](CUMULATIVE_COVERAGE.json) retains reviewed/unread interval complements across four extraction rounds. Capturing the14917-line Player class does not mean it was fully read.

## RW4-F1: Selection and persistence precede a separate one-shot startup gate

`RegionState.cs:1132-1178` selects transfer candidates while building a snapshot. This branch requires MMF and the player's shelter or the forced save room. SlugNPC descendants additionally require MSC. A lizard descendant must be alive and have maximum persistent like over current players greater than0.5. It does not simply select every tamed NPC everywhere. The selected creature's full string is appended to pendingFriendCreatures, its attachment links are dropped and saveCreature becomesfalse, avoiding the normal population serializer path. The later population scan at1215-1242 skips saveCreature=false entries. There is no uniqueness check around the pendingFriendCreatures.Add in this branch.

`SaveState.cs:887-955` places FRIENDS encoding within the MMF block and also requires cleanSpawns=false. It serializes pendingFriendCreatures, not spawnedPendingFriendCreatures. The LoadGame FRIENDS case at1375-1387 splits and appends nonempty payloads; there is no MMF check inside that particular switch case. Reading the load case alone does not establish the original admission conditions or whether later startup will consume them.

The actual downstream call is **Player.UpdateMSC**, not PlaceInRoom or NewRoom. `Player.cs:5640-5655` shows Update(bool) calling UpdateMSC without a local MSC guard around that call. `UpdateMSC:7077-7145` increments timeSinceSpawned, then requires exactly5 reached calls, a story session and AI==null for its transfer block. This is not 'five wall-clock frames after save load': reaching the method and the larger player-update scheduling remain prerequisites.

Inside that block, `!game.spawnedPendingObjects` and `!MSC || !safariMode` gate the transfer. The game-wide spawnedPendingObjects latch is settrue **before** either pending object or companion processing. It computes a coordinate one tile above the current abstract player, spawns pending objects first, then evaluates GrabSavedCreatures and sends its returned strings to SpawnCritters. MSC-only pup generation follows afterward. The method's explicit `if (!MSC) return` lies after this transfer block, so the UpdateMSC name is not evidence that all of this method requires MSC. Capture and FRIENDS encoding still have their own MMF gates.

The one shared latch means the path is not a per-player replay. The static main-assembly reference pass found one assignment setting this latchtrue in this consumer and no explicit source assignment resetting it. A new game object's default state is distinct from an in-session retry. Static references do not cover reflection or other assemblies/mods.

## RW4-F2: The pending list is consumed before successful creation is known

`SaveState.GrabSavedCreatures:2284-2317` clears spawnedPendingFriendCreatures at entry, constructs a new returned list and processes every pending payload. It keeps original type/ID and state strings while rewriting the room/node portion for the supplied start coordinate. Room names come from the live world, then a room-name map, then the numeric room fallback. The original unrewritten string is appended to spawnedPendingFriendCreatures before the actual instantiation consumer is called. When the loop finishes, pendingFriendCreatures.Clear runs and the rewritten list is returned.

Consequently the 'spawned' list is an attempted-transfer ledger, not evidence of an instantiated/realized creature. A full static symbol scan of the pinned main assembly's IL found only its declaration, constructor initialization, Clear and Add consumers. No main-assembly serializer, retry loop or successful-creation acknowledgement reads that field. Raw exact matches and whole-IL hash are retained in private STATIC_REFERENCES.json. Reflection, injected mods and other assemblies are outside that negative claim.

`RainWorldGame.SpawnCritters:2814-2827` enumerates returned strings and calls SaveState.AbstractCreatureFromString(world, payload, onlyInCurrentRegion:false). It then unconditionally accesses abstractCreature.state.CycleTick, overwrites its coordinate with player.pos, adds it to the player's abstract room and calls RealizeInRoom. There is no per-item null guard, acceptance result, catch, requeue or rollback in this method. The coordinate constructed one tile above the player is therefore not the final abstract placement: SpawnCritters overwrites it with the player's exact current coordinate before realization.

The factory's previously inspected rejection behavior remains relevant: unknown type/unresolved room can returnnull; malformed fields can throw; world-bound construction restores CreatureState and custom flags. A null return here leads to an unchecked dereference before admission. Successfully admitted creatures receive one CreatureState.CycleTick before placement, so this transfer itself can decay/prune saved social memory through SocialMemory.CycleTick. It is separate from region catch-up and ordinary runtime temporary-state settling.

`AbstractCreature.cs:426-445,715-750` supplies subsequent realization gates. A missing abstract room or an already realized creature causes Realize to return; a supported species creates its concrete runtime class. RealizeInRoom can move the coordinate to a shelter-door spawn point, fill a missing abstract node, ask abstractAI.PlaceInRealizedRoom for placement help, and delegate to the physical-object route. Later accessibility mapping is conditional on actual AI/pathfinder existence. The absence of a thrown exception is not a general acknowledgement that the companion appeared in an interactively usable state.

## RW4-F3: Failure order explains what can be lost, retained or retried

These are conditional static paths, not observed failures.

| Stage | In-memory state already changed | Local recovery evidenced |
| --- | --- | --- |
| Pending object spawn fails before GrabSavedCreatures | Global startup latchtrue; pending-object state may already be consumed | No retry/reset inside the inspected player startup branch |
| Rewriting a malformed friend record throws | Global latchtrue; spawned ledger may contain an attempted prefix; pending Clear at method end not reached | Original pending list can remain, but no automatic same-session replay is evidenced |
| Factory returnsnull or throws in SpawnCritters | Full friend pending list already cleared; original strings already marked attempted | No per-record catch/requeue; later records are not reached by this foreach invocation |
| Failure after AddEntity or during realization | Some earlier/current abstract creatures may already exist; list consumed | No rollback/removal in SpawnCritters; downstream cleanup is separate |
| All calls return normally | Pending empty; attempted ledger contains originals; each factory result had state tick/admission/realize calls | No explicit success acknowledgement or retry contract in this method |

The exact fifth-call condition and latch make a later frame an insufficient retry trigger. If the gate fails at exactly5, or an earlier stage throws after setting the latch, the inspected path does not retry at6. This does not prove all conceivable outside recovery is absent. A fresh game/session, reloading an earlier stored payload, unrelated recovery code or mods may change state; no such recovery was exercised.

The serialized FRIENDS list and in-memory attempted ledger are different layers. No request to save the cleared pending list is issued inside GrabSavedCreatures or SpawnCritters themselves, so in-memory consumption does not prove the last on-disk FRIENDS payload was immediately deleted. Conversely a previously stored record does not establish the current process can replay it without reloading. Round3's storage acceptance/durability limits continue to apply.

## Crosscheck and remaining reading

The companion auditor independently owns shelter-friend snapshot order. This report does not promote the later friendInDen like boost to a captured same-cycle payload; that question remains attached to its actual SaveState/WinState/StoryGameSession consumers and the auditor's receipts. The transfer trace above uses saved strings before any later implicit behavior is inferred.

The new raw Player class is mostly unread. Exact window complements, including the untraced portions of the parent Player.Update scheduling and complete species constructors, remain in cumulative coverage. Other named gaps are activated optional modules, external-mod field access, explicit fresh-session latch initialization, physical success/failure of each transferred species, and any general engine exception catcher outside the local transfer call. These are deliberately narrower than reopening already traced queue/encoding/consumer boundaries.

Reusable lesson from this pass: follow a returned queue all the way to the actual consumer, then separate request-latch, extraction/clear, factory acceptance, entity admission, realization and durable save acknowledgement. Names such as UpdateMSC and spawnedPendingFriendCreatures are navigation hints, not proof of gates or success. This is research only and authorizes no YAIRPG implementation.
