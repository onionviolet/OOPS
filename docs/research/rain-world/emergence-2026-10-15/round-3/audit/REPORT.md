# Rain World round 3: graph ownership, unload and save boundaries

Research only, 2026-10-15. Status: PARTIAL. This independently extends [round 2](../../round-2/audit/REPORT.md). No game or shipped code was executed, no personal save/configuration was read, and no implementation, install, download or commit occurred. Prior evidence remains unchanged. Full raw source stays in the sibling's private archive.

The game assembly remains pinned to SHA-256 `b6be1d4e18ce219d21091b51564cb6a11c1e4106b41de903eb8e58849cb16fdb`. The additional managed storage backend comes from `Assembly-CSharp-firstpass.dll`, SHA-256 `7180da54e10bcff9e068d04fc067f5a5225029d147120df24814dab909b442db`; it is a separate support input, not a native decompilation. [FINDINGS.json](FINDINGS.json) records method/line/hash evidence; [READ_LEDGER.json](READ_LEDGER.json) joins exact-hash prior reading and this round's windows. [UNREAD.json](UNREAD.json) retains every unread line complement and named lifecycle gaps. Source facts and inferred traces are distinguished below.

## RW3-F1: duplicate grip records do not imply unbounded growth

Round 2 established that successful `Creature.RecreateSticksFromAbstract` calls `Grab`, which can add a new abstract grip without explicitly deleting the old successful record. That observation remains valid, but the next consumer narrows its implications.

`PhysicalObject.Update` attempts reconstruction once per realized instance through `sticksRespawned`. Reconstruction iterates the owner's abstract stick list backwards. It admits only grip records with endpoint A equal to the creature, reads the saved grasp index and endpoint B's realized body, chooses a random body chunk, and requests a real grab. Failure deactivates the record. It does not preserve the original grasp's full sharing/dominance/physical contact state.

`Grab` has an early same-target branch. If its chosen grasp slot already holds that exact object, it releases the existing grasp first, then creates a new realized grasp and a new abstract stick. `Grasp.Release` nulls the realized slot before invoking abstract `DropCarriedObject`. That abstract method removes every owned grip record with the matching grasp index. Thus processing a second old record can clean the previous duplicate rather than add another indefinitely. `UpdateGraspIndexes` updates matching records after slot switches, but does not itself deduplicate them.

The following is a symbolic source trace, not execution of game code. Preconditions: base Grab implementation, valid endpoints and slot, no callback exception/override, no competing grabber and the indicated identical-target records.

| Initial state | Source transition | Result supported at that point |
|---|---|---|
| One old abstract record, empty realized slot | Successful reconstruction creates a new grasp/stick | Old and new abstract records can coexist. |
| Another old record for the same slot and object is then processed | Same-target Grab releases the live grasp; DropCarriedObject removes all matching-slot records; Grab creates one replacement | The earlier duplicates can collapse during the same reconstruction loop. |
| A normal release after reconstruction | The owner slot is nulled, target's grabbed-by entry removed and all matching abstract records deactivated | Ordinary release cleans both representation layers. |
| Different target/slot, mutated list, failed virtual Grab or malformed index | Additional control paths apply | No universal bounded-count invariant is proved. |

This corrects any inference of monotonic growth from the first successful call. No unbounded leak, reliable duplication exploit or successful native reconstruction was observed. Conversely, a strict one-abstract-stick-per-grasp invariant is still unsupported.

The save consumer does not erase this question. `RegionState.AdaptRegionStateToWorld` clears savedSticks then serializes each endpoint-A-owned stick for objects in a shelter or the forced end-room. There is no string/identity deduplication in that reviewed loop. `RegionState.SaveToString` emits every resulting entry. Duplicate eligible records can therefore reach the save representation if they still exist at snapshot time. Whether a real encounter reaches that state, how often, and what later transforms it remain open.

## RW3-F2: destruction, removal and room unload are different operations

`AbstractObjectStick.Deactivate` removes the link instance from both endpoint lists. It does not destroy either endpoint or release a physical grasp on its own. `AbstractPhysicalObject.Destroy` first removes all abstract links, then its `AbstractWorldEntity` base only sets slatedForDeletion. That flag is not immediate removal from every room registry. `AbstractRoom.RemoveEntity` removes the entity, den and creature-list entries and warns if a realized creature still remains in the room. It is a registry operation, not a full physical teardown.

Likewise, realized `UpdatableAndDeletable.Destroy` only sets its deletion flag; RemoveFromRoom only nulls its room pointer. `Room.Update` checks deletion and room mismatch before and after each update, then runs `CleanOutObjectNotInThisRoom`. That cleanup removes the object from update/draw/physics and relevant auxiliary lists. For a physical object, when slated for deletion or still owned by a nonnull room, it can destroy the matching abstract entity, remove its entity entry, and remove its creature entry. It then calls RemoveObject. This is a consequential join: cleaning an object that has moved to another nonnull room differs from cleaning an object whose room pointer was deliberately nulled. Exact callers still matter.

Normal generic abstraction calls `room.RemoveObject`, which nulls the realized object's room, before clearing the abstract realizedObject pointer. The later cleanup can therefore drop the old realized object without automatically destroying its abstract counterpart through that specific nonnull-room condition. Creature abstraction overrides this procedure and retains its previously documented early-return and pathfinder-specific branches. No blanket claim is made that these paths have identical cleanup.

`AbstractRoom.Abstractize` iterates entities backwards and abstracts them, deriving a node for nonquantified creatures. It updates quantified-creature representation, removes flagged abstract entries, calls realizedRoom.Unloaded, adds that room to the world's unloading queue, then clears its own realizedRoom pointer. `Room.Unloaded` unloads the rain-mask atlas and notifies update objects that implement the unload interface. It does not directly destroy every update object in the shown method. `RainWorldGame.Update` skips rooms already queued, removes queued rooms from activeRooms and clears the queue. Disposal is staged across owners.

Graph traversal adds another distinction. `AbstractPhysicalObject.GetAllConnectedObjects/AddConnected` uses visited membership to avoid repeatedly collecting endpoints. `AbstractCreature.RequiresAIMapToEnterRoom` checks every connected creature, so an attached creature can delay a body's room entry until an AI map is available. FollowedByCamera also consults the connected group. These are gameplay consequences of an attachment graph, not only save bookkeeping.

`AbstractCreature.Realize` returns if the room is absent or the creature already exists. Once it creates a realized body and AI, it recursively realizes still-unrealized linked endpoints. Creating the current body before visiting edges avoids ordinary self/two-node re-entry in that method. But a missing room, a failed species construction or a null/corrupt endpoint is not established as safe by this normal route. The visited collection guard cannot be generalized to every recursive realization/abstraction path. Normal lizard AI initiation constructs a new LizardAI; the missing-pathfinder and not-ready-room branches from earlier rounds remain explicitly unresolved.

**Inference:** carrying or tethering another creature can affect room-readiness, camera following and the lifetime of both realized bodies. Entity death, visual disappearance, room unload, abstract removal and save omission are separate events. The method joins are shown; a complete native lifecycle is not.

## RW3-F3: loading endpoints before links still permits partial restoration

The sibling's save-envelope route is independently checked at the region join. `RegionState.AdaptWorldToRegionState` first parses each saved population entry. Recognized creatures enter a shelter's normal entity list or are placed in a den otherwise; missing/unknown entries may be skipped and selected unknown population strings preserved. Only afterward does it iterate saved stick entries and call AbstractObjectStick.FromString against the named room.

FromString searches that room's entity list for both endpoint IDs. A missing endpoint logs and returns. It does not search all den lists, queue a later retry, or fabricate an endpoint in the reviewed body. The population loader can place creatures in den storage, and creature serialization may change their saved location to a chosen den. Therefore correct endpoint order is necessary but does not prove every original link survives. A skipped, relocated or den-only endpoint can leave no matching pair in the requested entity list. This is a source-level possibility, not an observed broken save.

The link parser has unguarded indexed fields and numeric parsing. Its switch recognizes specific stick kinds; an unknown kind has no demonstrated preservation branch. A grip requires endpoint A to be an AbstractCreature. Equal A/B IDs are not a validated self-link restoration route because the lookup uses an if/else-if, filling only A on the matching pass. These differ from the graceful missing-pair return, so the parser should not be described as generally malformed-input safe.

The population parser itself returns null for an unknown creature type or unresolved room, redirects some out-of-region creatures to their spawner den, constructs the abstract creature, then loads its state when a world exists. Indexed arrays and integer parsing are not wrapped by a local catch in that method. Calling it with world null constructs only the skeleton in this path and skips state.LoadFromString; code using it only to recognize an item is not proof of complete state restoration.

At realization, `Creature.RecreateSticksFromAbstract` directly dereferences B.realizedObject and its bodyChunks. No local null check protects that access. The base Grab's index check rejects graspUsed greater than the slot length, but not equal to it, before accessing the slot. A malformed index equal to length therefore passes that particular guard. The normal build may have upstream invariants; this audit neither assumes them nor reproduces a failure. Full load-envelope validation, callbacks, recovery and mod overrides remain open.

`CreatureToStringInDenPos` also intentionally changes the persistence target. It excludes Slugcats and a creature in the active gate, selects a suitable current shelter location or AI den/spawn den, rejects an out-of-region result, and omits dead creatures saved outside shelter. It returns empty on caught serialization failures. Thus persistence of a living social creature is conditional on content and location; a serializer alone does not prove every NPC survives every transition.

## RW3-F4: social memory survives selected saves, while realized friendship and habituation are rebuilt

The durable social record remains CreatureState/SocialMemory, not the realized FriendTracker pointer. The population writer calls CreatureState.ToString, and the population loader calls its LoadFromString in a real world. The previously traced state serializer saves social data only while alive. Temporary like/fear are omitted and reset to durable baselines on load. Unknown or omitted population can therefore change the availability of a relationship's subject even while a surviving actor retains the subject ID.

The normal lizard realization route constructs a new LizardAI, whose constructor creates a new FriendTracker. Its friend and friendRel fields begin null, and its update reselects an eligible realized creature by matching stored subject ID and the existing like/tempLike thresholds. Rebuilding the pointer requires a currently available counterpart, not merely an intact saved relationship string. The private integer usedToVultureMask belongs to this new AI instance and has no initializer or load assignment among its class uses; normal new construction starts it at zero. This is a source-based normal-path reset conclusion, not proof that every exceptional abstraction clears a retained AI or all mod branches behave identically.

A cycle consumer is now closed: RegionState.AdaptWorldToRegionState calls RainCycleTick with elapsed cycle count. If that count is positive, RainCycleTick calls state.CycleTick once per creature in normal and den lists. It uses the elapsed count directly for some food/resource counters, but does not loop state.CycleTick once per skipped cycle in this body. Since CreatureState forwards that call to SocialMemory decay, this is not a demonstrated replay of every offline relationship tick. Double membership, overrides and other cycle routes remain separate questions.

There is also a deliberately unresolved order issue. SaveState.SessionEnded calls BringUpToDate before scanning same-room realized friends and moving one qualifying non-pup friend's durable like halfway toward 1. BringUpToDate is a world-to-save snapshot method. The boost's durability in the same cycle depends on subsequent snapshot/save order; seeing the in-memory mutation does not establish that it appears in the already generated region strings. The sibling is tracing that higher-level envelope. This audit leaves the exact same-cycle boost order open.

**Inference:** an NPC can remember a player yet need to reacquire its realized friend, lose temporary affect on reload, or forget a mask on normal AI replacement. These are different memories with different owners. No native reunion or save roundtrip was run.

## RW3-F5: save request success is not a durability receipt

The backend finding was independently checked through direct consumers, not inferred from API naming. `PlayerProgression.SaveWorldStateAndProgression` has a malnourished branch that preserves a distinct in-memory state and uses another progression/death-data route; its ordinary branch calls SaveToDisk. At the reviewed SaveToDisk tail, a Set request is sent only when in-memory save storage exists and loading is inactive. canSave selects Immediate versus Deferred. The method then returns true even when that tail skipped Set. The return is not a file-flush or reload receipt.

`UserData.OperableFile.ExecuteWrite_Platform` calls Write_Default for this captured managed backend. Write_Default opens the target with FileMode.Create, writes bytes, flushes/closes, and catches exceptions inside its write block by logging. That catch does not itself call operation.Fail or rethrow. If its catch/finally and subsequent code return normally, ExecuteWrite can clear modified and mark the operation Complete. Some other exceptions do propagate to an outer failure handler, so the exact statement is that a swallowed write exception can reach apparent completion, not that every failed write is reported as success. No OS failure was induced and no personal storage was touched. Atomic replacement, platform cloud sync, power-loss durability and all backend policies remain unverified.

The load checksum is also narrower than an integrity gate: GetProgLinesFromMemory splits a 32-character prefix from a nonempty stored string, compares MD5 and sets gameTinkeredWith when different, but returns split payload lines in either case. No length guard covers nonempty strings shorter than 32 in this method. UserData.DataAccessible initializes a missing hashtable when appropriate and always returns true; its name does not prove a load-complete gate. These facts do not establish exploitability or native failure, and no repair was authorized.

## Remaining evidence gates

| Code | Still open |
|---|---|
| RW3-U1 | Repeated native stick rebuild, complex mixed graphs, malformed input/caller recovery and virtual overrides. Symbolic duplicate cleanup is not a reproduced encounter. |
| RW3-U2 | All RoomRealizer/shortcuts/load ordering, unusual missing-realized-body/AI branches and engine object disposal. Normal staged cleanup is traced only for named consumers. |
| RW3-U3 | Whole save envelope and same-cycle friendship snapshot order, all backend callbacks/platform/cloud durability and successful native reload. |
| RW3-U4 | Other species AI, faction propagation, sensory geometry, movement actuation, flood/bullets and all captured-unread classes. Prior gap families are narrowed, never silently closed. |

No findings select YAIRPG content or runtime policy. The saved [research flow](../../audit/RESEARCH_FLOW.md) remains the reusable procedure. [VALIDATION.json](VALIDATION.json) checks hashes, links and reading coverage, not native gameplay or save acceptance.
