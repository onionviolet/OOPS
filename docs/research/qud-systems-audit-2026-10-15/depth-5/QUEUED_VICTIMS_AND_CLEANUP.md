# Queued victims: exact consumers and unresolved ownership

All links below point to private local captures of the pinned build. These are decoded static branches, not observed gameplay. Field visibility, actual serialization and object reachability are separate questions.

## F1: classification and context removal

[SpaceTimeVortex L373-438](../private/depth-5/source/XRL.World.Parts.SpaceTimeVortex.cs) first rejects itself and invalid targets. Another vortex is obliterated and the owner explodes with power 3000 and `1d200` neutron damage. Otherwise, only `DestinationZoneID == null` plus an actor not requiring explicit tracking enters the deferred branch. This null test differs from the null-or-empty test in destination initialization.

The deferred branch takes the actor's current cell location. With a location it creates Queue/Locations as needed, adds the actor, stores the location, calls `RemoveFromContext` and `MakeInactive`. Without one it obliterates the actor. It does not fire `SpaceTimeVortexContact` in this branch. [Explicit tracking L549-569](../private/depth-5/source/XRL.World.Parts.SpaceTimeVortex.cs) includes player, nontrifling player-led actor, important or interesting object. Ordinary NPCs/items can therefore take a different lifecycle from companions and special actors.

[Physics L2334-2378](../private/depth-5/source/XRL.World.Parts.Physics.cs) handles removal from inventory, equipment and cell. Several exceptions are swallowed. This method does not call the graveyard. [GameObject L3521-3532](../private/depth-5/source/XRL.World.GameObject.cs) forwards MakeInactive to RemoveActiveObject; MakeActive adds only when Force is true or Brain exists. See the independent audit for the exact ActionManager collections and serializer.

## F2: queue resolution is conditional and has no retry ledger

[RequireDestinationZone L88-140](../private/depth-5/source/XRL.World.Parts.SpaceTimeVortex.cs) immediately returns if the destination is already nonempty. Otherwise it selects a destination using the current zone's world. It then processes the queue only if both Queue and Locations exist.

For a nonempty destination each valid, contextless victim gets its stored location and a landing search. A landing calls Teleport and then MakeActive without testing Teleport's Boolean result. No landing obliterates it. Per-victim exceptions are logged and iteration continues. With no destination, valid contextless victims are obliterated. Both collections are set to null afterward. Already-contextual or invalid victims are skipped and also discarded from this queue. There is no retry collection in the method. A thrown exception inside the per-victim block can leave that victim contextless before the queue is discarded; native reachability/placement is untested.

The explicit branch calls RequireDestinationZone before finding its own landing and before firing its own contact event. Thus an explicit entrant whose event vetoes teleport can still trigger processing of earlier queued actors. The entrant's final Teleport return is also ignored by ApplyVortex, which returns true afterward. These return values need their own caller semantics; they are not a global success guarantee.

## F3: actual save boundaries

[GameObject.Save L1903-1964](../private/depth-5/source/XRL.World.GameObject.cs) serializes properties, statistics, effects and each part through IPart.Save. [IPart L330-399](../private/depth-5/source/XRL.World.IPart.cs) writes type and StatShifter, then SaveData delegates to inherited Write; LoadData delegates to Read. Failed part serialization resets its block and logs a skip. On load a part instance is created and its LoadData is called, with block recovery on errors. The independent audit follows the inherited Write/Read implementations and confirms that NotSerialized excludes Queue, Locations and InitialTurn. This is stronger than inferring behavior from attributes alone.

[Zone L2943-3080](../private/depth-5/source/XRL.World.Zone.cs) writes type fields, then each cell, maps and zone parts; loading reconstructs cells and broadcasts ZoneLoaded. [Cell L1324-1415](../private/depth-5/source/XRL.World.Cell.cs) loads explicit GameObject records into Objects and registers their locations. Save visits its current Objects list, removes entries with missing/mismatched Physics.CurrentCell, writes surviving game objects and then paint/tags. A queued victim already removed from cell Objects is not included by this cell traversal. This does not exclude another reference causing it to be serialized elsewhere.

No universal whole-game orphan collection or persistence rule is claimed. Zone.WriteTypeFields, other game/global roots, serialized references held by unrelated actors and mod-added components are separate remaining consumers. An object being serialized through an external reference would not itself restore the skipped vortex association.

## F4: expiry, destruction and graveyards are different routes

[Temporary L137-184](../private/depth-5/source/XRL.World.Parts.Temporary.cs) subtracts elapsed turns on activation/thaw and Amount on turn ticks, expiring only when a positive Duration crosses zero. LastTurn is then updated. [Expire L220-256](../private/depth-5/source/XRL.World.Parts.Temporary.cs) recursively expires Temporary components in GetContentsEvent results, removes contents, obliterates the parent and removes context. A TurnInto successor is placed at the earlier cell or containing object's inventory. The vortex blueprint supplies Duration 20; mutation-created vortices can override that duration as documented in depth 4.

[GameObject.RemoveContents L9584-9643](../private/depth-5/source/XRL.World.GameObject.cs) returns immediately when neither object nor cell context exists. Otherwise it gets event-defined contents and moves non-natural contents to the outer context. This is not a scan over every reference field in every part. The vortex's event list and class contain no GetContentsEvent response or queue-expiry override; all other responders remain a bounded audit question.

[Physics.TeardownForDestroy L3862-3928](../private/depth-5/source/XRL.World.Parts.Physics.cs) is the route that unequips, removes inventory/cell/action membership and adds the destroyed parent to a zone or global graveyard. It does not iterate SpaceTimeVortex.Queue. [Graveyard L1-80](../private/depth-5/source/XRL.World.Graveyard.cs) stores a bounded deque, marks flag bit 4, pools oldest objects at MaxCount, and pools all objects on release. Default capacity is 256. No save/load or vortex resolution method exists in this full class. [Zone.Release L2282-2302](../private/depth-5/source/XRL.World.Zone.cs) returns the graveyard and pools cell objects. Pooling the destroyed vortex is not evidence that its earlier victims were explicitly destroyed, relocated or refunded.

The [five-definition blueprint chain](../private/depth-5/BLUEPRINT_CHAIN.json) is Space-Time Vortex → Space-Time Anomaly → InertObject → PhysicalObject → Object. It includes Temporary and the vortex part, inherited Physics/render/description/no-damage/sound/spawn-blocking and basic physical parts. No declarative queue owner is present. Full inherited part lifecycle implementations were not all audited here, so this is a composition receipt, not proof against every indirect hook.

## Q1: next bounded questions

| Priority | Remaining consumer | Evidence needed |
|---|---|---|
| 1 | Other serialized references or global roots | Writer object table registration and full game save traversal, including contextless referenced actors |
| 2 | Generic contents and final pooling | GetContentsEvent dispatch/responders and GameObject.Pool clearing, checked against inherited parts |
| 3 | Failed queue teleport | Teleport false/exception effects, action reactivation and caller return handling |
| 4 | Dynamic parts/mods | Separate composition and override audit; stock captures do not establish behavior for added parts |
| 5 | Other Qud systems | Retain depth 4 unread families and exact cumulative line complements; this queue pass does not close them |

No fixes, product decisions or native reproduction follow automatically from these research questions.
