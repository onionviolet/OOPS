# Rain World round 4: friendship snapshot and session-end order

Research only, 2026-10-15. Status: PARTIAL overall; the named direct session-end order is resolved statically. This extends [round 3](../../round-3/audit/REPORT.md) without changing it. No game or shipped code was executed, personal save/configuration accessed, install/download performed or implementation changed.

The main assembly remains SHA-256 `b6be1d4e18ce219d21091b51564cb6a11c1e4106b41de903eb8e58849cb16fdb`. Two additional full classes, WinState and StoryGameSession, were exported privately with commands, input/output hashes and exit receipts. Only the specified windows are semantically read. [FINDINGS.json](FINDINGS.json), [cumulative reading ledger](READ_LEDGER.json), [remaining gaps](UNREAD.json) and [validation](VALIDATION.json) retain the distinctions among capture, reading, inferred consequences and unobserved native storage.

## RW4-F1: the direct survival save uses pre-boost NPC strings

The earlier gap was whether saving after SessionEnded's shelter-friend boost refreshes the region's NPC data. The answer in the direct built-in route is no: the world-to-region snapshot runs first and the later serializer uses cached strings. The saved RegionState object is shared, but its population entries are strings, not references to mutable SocialMemory objects.

The concrete sequence is:

| Step | Owner and consumer | State represented |
|---|---|---|
| 1 | SaveState.SessionEnded survived branch, BringUpToDate at399 | The current world is snapshotted before friend selection/boost. |
| 2 | BringUpToDate692 → world.regionState.AdaptRegionStateToWorld | Eligible NPCs become savedPopulation strings; optional MMF friend transfers become pendingFriendCreatures strings. |
| 3 | SessionEnded406-435 scans same-room realized creatures | A qualifying non-pup friend is selected per player record and its live persistent like moves halfway to1. |
| 4 | AppendKills, AppendTimeOnCycleEnd and WinState.CycleCompleted | Kills/time/progression update after the snapshot; the progression consumer can read the boosted live relationship. |
| 5 | SessionEnded473 → SaveWorldStateAndProgression → SaveToDisk | The current SaveState is encoded when the normal save path admits it. |
| 6 | SaveState.SaveToString → RegionState.SaveToString, and optional FRIENDS output | Existing NPC strings are concatenated, without refreshing the changed live relationship through these direct calls. |

`World.regionState` returns the same RegionState stored in the story SaveState's regionStates array. `AdaptRegionStateToWorld` clears/rebuilds savedPopulation and appends the string returned by CreatureToStringInDenPos. That helper reaches AbstractCreatureToStringStoryWorld, which serializes CreatureState at that moment. Later RegionState.SaveToString appends savedPopulation strings. Sharing the RegionState reference does not make already-created strings track later changes to an NPC object.

Under MMF, a living liked lizard with like above0.5 in the qualifying shelter/forced-room path is instead encoded into pendingFriendCreatures before the boost, has abstract links dropped, and gets saveCreature=false for ordinary population handling. Those FRIENDS entries are also strings. SaveState.SaveToString emits them only under its MMF and non-cleanSpawns gates. Player-held creature strings are captured before the region snapshot as well. None of these direct encoders repairs the temporal mismatch automatically.

Friend selection itself has real gates: a nonnull player session record, no special spinning-top end mode, an alive actor, social state, realized body, abstract and real AI, FriendTracker whose friend pointer equals this player's realized creature, and positive persistent like. SlugNPCs follow the separate pup branch. At most the first qualifying non-pup friend in that player's scan receives the boost. Co-op can involve additional player records and repeated actor participation; no blanket one-boost-per-NPC policy is inferred.

For a simple illustrative source trace, suppose a qualifying lizard has like0.6 at snapshot. Its cached NPC payload encodes0.6. The later boost changes the live value to0.8. With no later snapshot or extension intervention, that same session's normal current-world encoding still carries0.6 in the cached population or pending-friend string. This is arithmetic derived from the code, not an executed save/reload experiment.

The conclusion is explicitly scoped. WinState.CycleCompleted has a registered CustomPassage.OnWin hook with access to the game; callbacks or external modifications could recapture or change state. Its Expedition branch also has separate run-save, process-switch and possible campaign-wipe behavior. Activated modules and registered third-party callbacks were not inspected. The result applies to the reviewed built-in direct route when those extensions do not intervene. A later explicit BringUpToDate can produce newer strings, but no automatic post-boost call was established along the ordinary SessionEnded→SaveWorldStateAndProgression→SaveToDisk chain. It is not a universal claim that the boost can never persist.

## RW4-F2: progression can save the newer observation while the NPC payload stays older

The intermediate consumers were read to avoid treating every intervening call as a possible opaque refresh. AppendKills updates the SaveState kill collection. StoryGameSession.AppendTimeOnCycleEnd changes time accounting, locks the timer and can request CreateCopyOfSaves after its elapsed-time threshold. The backup function copies existing save files; it does not turn live NPCs into new region strings. No backup was executed.

WinState.CycleCompleted reads friendInDen.state.socialMemory.GetLike for each qualifying player record after the live boost. Subject to its earlier progression gate, Friend tracker progress increases by this value times0.34. FloatTracker.SetProgress clamps to its configured bounds. Its normal SaveToString later encodes current eligible tracker progress. SaveState.SaveToString encodes deathPersistentSaveData freshly, whose SaveToString includes WinState.SaveToString.

Consequently the same assembled save payload can contain NPC relationship data from before the boost and Friend progression calculated using the boosted live value. In the0.6→0.8 example, an admitted unclamped Friend increment uses0.8×0.34=0.272, while the earlier NPC string remains0.6. Existing tracker thresholds, goal state, absent friend records, module rules and callbacks can change whether that increment is made or stored; this is not a guaranteed reward for every shelter occupant.

That separation is the useful emergence lesson: persistent records owned by different systems can observe one event at different points in the same transition. A fresh top-level serialization does not imply all nested records are fresh. This is source analysis, not an adopted YAIRPG design rule or a native corruption finding.

## RW4-F3: survival, malnourishment, death and quitting save different layers

| Path | Actual source route | Relationship snapshot and persistence scope |
|---|---|---|
| Normal survived, not malnourished | SessionEnded snapshot→boost→progression→SaveWorldStateAndProgression(false)→SaveToDisk(currentState=true) | Current world envelope is encoded with cached NPC strings and fresh selected metadata. Storage completion remains separate. |
| Survived but new malnourished | The same survived snapshot/boost runs, then SaveWorldStateAndProgression(true) | Uses progression/death-persistent update rather than replacing current-world payload; stores currentSaveState in starvedSaveState and clears currentSaveState. In-memory retention differs from disk persistence. |
| Death or GoToStarveScreen | SessionEnded(survived=false), then progression/death-persistent route | Does not enter the survived snapshot/boost branch. GoToStarveScreen and survived-malnourished are distinct call paths. |
| Exit to menu/restart | ExitGame(asDeath=true,asQuit=true), with story/mode admission | Saves maps/misc plus death-persistent data; death flag requires clock>1200 and quit flag clock>200. It does not call the full live-world snapshot in the reviewed method. |
| Special custom end/warp/Expedition or extension callback | Separate methods/hooks | Must be evaluated independently; not covered by the ordinary-route conclusion. |

`SaveProgressionAndDeathPersistentDataOfCurrentState` first calls SaveProgression with saveCurrentState=false, preserving the previously stored current-world section while updating selected progression/maps. If that succeeds it calls SaveDeathPersistentDataOfCurrentState. That second method encodes the current death-persistent object and replaces only the matching DEATHPERSISTENTSAVEDATA subrecord in the stored campaign text. It does not refresh REGIONSTATE or FRIENDS through this replacement loop.

For malnourishment, BackupRegionStatePreservation can fill missing regionLoadStrings by serializing existing RegionState objects. That preserves a cached snapshot and does not itself reread live NPCs. The retained starvedSaveState can later be returned by GetOrInitiateSaveState before normal disk loading. This can preserve in-memory values that differ from the durable campaign representation. The audit does not claim what every menu/restart sequence ultimately reloads without its own callers and native proof.

Death/quit flags also change serialization, rather than simply stamping a label on the same payload. The death-persistent encoder can reduce encoded karma when not reinforced, encode a quit-count increment and pass the death flag into WinState.SaveToString. WinState's death serializer temporarily adjusts incomplete trackers, writes them and restores selected in-memory tracker fields afterward. It therefore can emit values different from the current in-memory tracker progress. Not every tracker type or custom OnDeath implementation was exhaustively audited. Platform file success, cloud reconciliation and a successful game reload remain unobserved.

## RW4-F4: independent check of the pending-friend consumer

The sibling's newly found consumer was independently read at the exact source windows. Player.Update calls UpdateMSC even before its local optional-feature branch. UpdateMSC increments timeSinceSpawned and admits the transfer at exactly5, for a story player with AI==null. The global spawnedPendingObjects latch and safari rule gate the block. It sets the latch before spawning objects and requesting saved friends; the later no-MSC early return occurs after this transfer block. The method name alone is not evidence that friend restoration requires MSC.

SaveState.GrabSavedCreatures creates rewritten strings for the player's target room/node, records original strings in spawnedPendingFriendCreatures, then clears the entire pending queue before returning. RainWorldGame.SpawnCritters parses each returned creature, immediately calls state.CycleTick, overwrites position with player.pos, adds the actor and realizes it. The call shown has neither a per-item null check nor a per-item recovery/requeue. Thus the queue-cleared marker is not an acknowledgement that every friend instantiated successfully. A null or exception can stop the local loop after the one-shot latch has already been set; broader exception handling or later rescue routes are not established here.

The restored creature's CycleTick can also decay/prune its loaded social state before realization and FriendTracker reacquisition. A pre-boost snapshot is not necessarily the exact relationship value used by the next live friend decision, even assuming successful storage and parsing. This joins the earlier snapshot timing finding to an actual consumer rather than stopping at a serializer. The exact live reunion and failure behavior remain unobserved.

## Scope, remaining work and evidence

The bounded same-cycle snapshot question is resolved for the direct built-in path, with extension and special-mode conditions stated above. No implementation change is proposed or authorized. [UNREAD.json](UNREAD.json) names remaining CustomPassage/Expedition callbacks, mode-specific save routes, pending-friend outer error/retry handling and native durability, alongside exact cumulative unread intervals. The original [research flow](../../audit/RESEARCH_FLOW.md) remains the workflow owner. Validation proves source identity, receipts, links and reading consistency only.
