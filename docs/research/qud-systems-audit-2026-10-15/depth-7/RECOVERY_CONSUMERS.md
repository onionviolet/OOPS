# Contextless recovery: holders, selectors and placement

All source links below use the pinned build. This follows actual consumers after depth6's conditional body preservation. It does not assume preserving an object token makes the object visible, active or recoverable through a player-facing command.

## Q7-R1: metadata narrows the attribution-reference consumer inventory

[FIELD_XREFS](../private/depth-7/FIELD_XREFS.json) and [scan receipt](../private/depth-7/FIELD_XREF_RECEIPT.json) retain the direct FieldDef-token uses of Physics.LastDamagedBy, LastWeaponDamagedBy, LastProjectileDamagedBy and InflamedBy. The analyst's [scanner source](../private/depth-7/xref/Program.cs) uses PEReader/MetadataReader and an IL operand decoder. It reads target bytes only. Built with existing .NET SDK10.0.402, it scanned62,661 method bodies and1,986,585 instructions with zero decode errors, retaining61 field operations.

This accounts for direct InlineField operations using those four field-definition tokens in the pinned main assembly. It does not detect reflection, alternate names/IDs, other assemblies, arbitrary downstream event callbacks, or dynamically generated code. It does not prove semantic completion of62,661 methods. Captured/printed source coverage remains a separate ledger.

The direct operations group into Physics serialization/reset/validation, damage assignment and HP/temperature consumers; Brain.SetPartyLeader clearing; Burning/Frozen event attribution; and Stomach clearing. Exact method tokens, RVAs, instruction offsets, opcode and field tokens are retained. The main purpose is to avoid searching duplicate captures or mistaking a generic save reference for a dedicated rescue routine.

## Q7-R2: retained attribution can keep functioning without moving its source

[Physics.CheckHP L4125-4196](../private/depth-7/source/XRL.World.Parts.Physics.cs) validates LastDamagedBy when its parent reaches zero HP. It uses the source to construct death causes and selected achievement conditions, then passes source/weapon/projectile into ParentObject.Die. The death pipeline's further actor-specific callbacks remain separate; these direct reads do not place the attributed source in a cell.

[Burning L113-129](../private/depth-7/source/XRL.World.Effects.Burning.cs) attributes periodic fire damage to Physics.InflamedBy. The holder's continued turns can therefore use a source that is itself inactive elsewhere. [Frozen L52-90](../private/depth-7/source/XRL.World.Effects.Frozen.cs) passes InflamedBy to FrozeEvent.Check and ThawedEvent.Send. [Physics.CheckThresholds L4052-4068](../private/depth-7/source/XRL.World.Parts.Physics.cs) can use the retained thermal Actor in the vaporization check. These events can have custom responders, which are not certified empty by the scan. The proven direct behavior is attribution/event propagation, not automatic recontextualization.

[Stomach L408-422](../private/depth-7/source/XRL.World.Parts.Stomach.cs) clears LastDamagedBy when setting a thirst-related death cause. That is an example of later holder loss, not an attempt to find or relocate the actor. Depth6 also records damage overwrite, suspension, amnesty and invalidity cleanup. Full damage/thermal callbacks and all derived actor-specific behavior remain unread beyond the selected windows.

## Q7-R3: the generic movement route tolerates a null origin

[GameObject.SystemMoveTo/TeleportTo L2807-2825](../private/depth-7/source/XRL.World.GameObject.cs) require Physics and delegate to ProcessTargetedMove with different System flags. [Physics.ProcessTargetedMove L3783-3860](../private/depth-7/source/XRL.World.Parts.Physics.cs) takes current cell as a nullable origin, applies destination NoTeleport and begin-move gates, then leaving/entering/zone/leave gates. On the admitted branch it conditionally removes from the old cell, invokes TargetCell.AddObject, spends movement energy and emits the post event. Null origin is not an unconditional rejection in this top-level body.

[ProcessBeginMove L16349-16376](../private/depth-7/source/XRL.World.GameObject.cs) rejects a null destination. [Null-origin leaving helpers L16379-16408,16501-16530](../private/depth-7/source/XRL.World.GameObject.cs) return true for a null origin. [EnteringCell/ObjectEnteringCell/EnteringZone L16410-16499](../private/depth-7/source/XRL.World.GameObject.cs) still dispatch gates; System does not erase every entering-zone veto. A caller that has only a saved ID or cannot select the victim has not reached this route.

[Physics.EnterCell L2121-2174](../private/depth-7/source/XRL.World.Parts.Physics.cs) rejects an already matching cell or invalid/graveyard object. Otherwise it assigns CurrentCell, clears inventory/equipment and sends environmental updates. [Cell.AddObject L3390-3424](../private/depth-7/source/XRL.World.Cell.cs) then appends to Objects, invokes enter/entered/object-entered events and can make an object live in an active built zone. EnteredCell can allow the normal Brain activation route documented by the independent audit. That is a conditional placement-and-reactivation chain when a real caller supplies the actor, valid destination and successful admission.

This is a possible explicit recontextualization primitive, not evidence a stock saved-victim recovery command calls it. No code was invoked and no native recovery was observed. Supplying a destination or bypassing a selector would be a distinct implementation/debug action, which was not performed.

### Return values are weaker than placement invariants

Cell.AddObject returns the same Object even when Physics.EnterCell returned false, before appending or emitting entry events. Thus comparing its return pointer with the input is not a general postcondition that a placement happened. Already-in-cell rejection may simply preserve existing placement; an invalid/graveyard object can remain unplaced. A normally valid queued actor with a different nonnull target does not fail those particular entry tests, but event/callback behavior still matters.

ProcessTargetedMove ignores AddObject's return and later returns true on its admitted branch. That alone is insufficient to establish all post-event context/activity invariants if callbacks change them. The report does not generalize this into a reproduced failure.

[Physics.RestoreContextRelation L4199-4234](../private/depth-7/source/XRL.World.Parts.Physics.cs) requires supplied relation and context: body slot for equip, owner for inventory or a specific cell for relation1. It does not infer a lost vortex origin. The cell branch's `AddObject(...) == Object` check inherits the weak same-pointer acknowledgement. The method name is not an automatic search/recovery policy.

## Q7-R4: party references can reach effects without selecting a rescue target

The [independent audit](independent-audit/FINDINGS.md) follows PartyMember, GameObjectReference, party ordering, Beguiling and the join command. Brain.PartyLeader returns the wrapper's Object pointer, without its own integer-ID fallback. Other consumers can explicitly use a retained Object or FindByID(member key). The wrapper and PartyMember struct alone do not perform recovery.

Beguiling's selected target enumeration can access a preserved member body and synchronize its Beguiled effect when mutation level changes. Duration, opinion or HP-related effect state can therefore change without placing the actor. A preserved body is not equivalent to a completely inert byte record, but effect access is not physical rescue. This does not establish every combination with vortex admission: depth5 shows nontrifling player-led actors take explicit tracking rather than the ordinary deferred queue. Exact actor/party composition and admission still have to match before using this effect path as a queued-victim example.

Brain.GoToPartyLeader can tolerate a null origin when directly called with an appropriate leader/destination. However the stock JoinPartyLeaderCommand enumerates objects from cached zone cells; it does not enumerate saved-token bodies or PartyMember wrappers. The preserved contextless actor is absent from that selector. Separately, the ordinary Brain action path checks IsNowhere and spends its turn/returns before later party-follow logic, in addition to depth6's scheduler rejection.

The direct follow helper ignores its long-distance move result, spends energy, emits JoinedPartyLeader and returns true. It therefore records an attempted follow, not a checked final placement guarantee. This is source-level behavior; no UI command, NPC action or game experiment was executed.

## Q7-R5: remaining recovery questions

| Code | Still unresolved |
|---|---|
| U1 | Actor-specific ObjectLoaded/FinalizeRead, event responders, mod/extension hooks and alternate saved holders beyond selected normal classes. |
| U2 | A concrete stock consumer that both selects the preserved contextless actor and supplies successful context restoration, rather than effects/credit only. |
| U3 | Further death/thermal event callbacks and delayed reference cleanup, including whether a later event keeps or removes the holder. |
| U4 | Actual native save/reload and explicit recovery behavior, if separately authorized using disposable state. |
| U5 | Broader prior skill/mutation/cybernetic unread families and exact line complements remain retained. |

The current result narrows recovery to the missing selector/caller while preserving positive reference access and generic placement capability. It does not claim the actor is universally recoverable, permanently lost, or automatically repaired.
