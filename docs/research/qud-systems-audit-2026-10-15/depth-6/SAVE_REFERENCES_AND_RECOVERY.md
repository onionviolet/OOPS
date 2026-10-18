# Save references, token enrollment and recovery limits

All source links below are full private captures of the pinned build. Independent audit details are linked where that writer owns the source. Static examples specify their prerequisites; no game/save experiment was run.

## Q6-R1: full-game save roots are an explicit graph

[XRLGame L2249-2335](../private/depth-6/source/XRL.XRLGame.cs) can skip saving for Transient, replay, an outstanding task, a nonrunning game or unavailable shared writer. After acquiring it, Writer.Start uses file version409 and SerializePlayer=true. The save order is:

| Order | Actual operation | Reference implications |
|---|---|---|
| 1 | WriteFields(game), Player.Save | Game Objects list is NonSerialized; player body is handled by writer player token, not a generic all-objects sweep. |
| 2 | SaveSystems | Each installed system receives BeforeSave, serialization and AfterSave. Custom hooks and fields can matter. |
| 3 | ZoneManager.Save, ActionManager.Save | Cached zones/cells and explicit scheduler entries, with separate cache roots below. |
| 4 | Quests/finished quests, reputation and several named globals | Quest managers/properties and custom types need their own consumers; labels are not blanket exclusion. |
| 5 | WorldMazes, factions, history, genders/pronouns, primitive game state dictionaries | Each invokes its corresponding serialization path. |
| 6 | SaveObjectGameState, journal, seen blueprints | ObjectGameState values call WriteObject, allowing typed objects and GameObject full-body routing. |
| 7 | FinalizeWrite | Serializes enrolled bodies and later reference tables as independently traced. |

[XRLGame L118-184](../private/depth-6/source/XRL.XRLGame.cs) marks Player, ActionManager, ZoneManager, Objects, quests, systems and game-state dictionaries NonSerialized. Many are then manually written by the above owner. Therefore a NonSerialized annotation alone cannot establish omission when a custom owner writes that field explicitly. Objects has no explicit all-object traversal in the reviewed SaveGame body. TransientGameState likewise is not written there. Neither statement excludes a nested reference from a separate serialized holder.

[SaveSystems L1580-1603](../private/depth-6/source/XRL.XRLGame.cs) removes flagged systems, then invokes each system's BeforeSave, Writer.Write(system), AfterSave. [IGameSystem L29-40,2913-2940,3062-3070](../private/depth-6/source/XRL.IGameSystem.cs) permits field reflection and has empty base save hooks/obsolete save bodies. Derived fields, overrides and custom hooks are not proven empty by the base class. This pass does not enumerate every installed/mod-added system.

[SaveObjectGameState L1605-1628](../private/depth-6/source/XRL.XRLGame.cs) writes optimized string keys and WriteObject values; loading uses ReadObject and drops null values. The actual writer GameObject case routes to full WriteGameObject, as independently checked. An existing value holding the same queued victim can preserve its body. The vortex itself does not add a value to this dictionary, and no automatic global rescue through this route is claimed.

## Q6-R2: caches can deliberately own contextless bodies

[ZoneManager.Save L468-535](../private/depth-6/source/XRL.World.ZoneManager.cs) manually writes cached zones, zone properties via WriteObject, active zone ID and CachedObjects via full WriteGameObject. For each cached object with Physics it first nulls CurrentCell, Equipped and InInventory. [Load L620-705](../private/depth-6/source/XRL.World.ZoneManager.cs) reconstructs the same dictionaries and again clears those three context pointers after reading the cached body. These contextless cache records are intentional storage, not proof the object is an orphan or belongs in the action queue.

[CacheObject L318-335](../private/depth-6/source/XRL.World.ZoneManager.cs) inserts by GO.ID. Existing keys can be replaced explicitly, tolerated or warned about; there is no automatic membership simply because GO lacks context. [PullCachedObject L288-295](../private/depth-6/source/XRL.World.ZoneManager.cs) returns the same object or a DeepCopy without effects, removes the cache entry and returns; it does not itself place the result. [GetCachedObjects L304-315](../private/depth-6/source/XRL.World.ZoneManager.cs) returns a copy with the same ID and schedules cache removal after zone build; a missing ID creates an invalid-cache placeholder object.

A queued victim already owned by this cache or a zone property can be a conditional alternate serialized root. This is not evidence that ApplyVortex populates the cache, and copied-object identity must not be silently equated with the same live instance. Exact placement/build consumers remain unread.

ZoneManager.Graveyard is NonSerialized at L60-61 and is not manually written in the reviewed Save method. Combined with depth5's full Graveyard class, no generic graveyard save rescue is established. A normally queued victim has not been explicitly graveyarded by queue admission anyway.

## Q6-R3: Brain targets, memory and party links differ

[Brain generated Write/Read L588-617](../private/depth-6/source/XRL.World.Parts.Brain.cs) writes flags/ranges, StartingCell, Allegiance, PartyMembers and Opinions, then custom PostWrite. Goals are NonSerialized at L234-235 and absent from this generated method; a Kill goal's runtime target is not automatically saved through that goal stack.

[PostWrite L1289-1323](../private/depth-6/source/XRL.World.Parts.Brain.cs) explicitly saves FriendlyFire keys with full WriteGameObject, despite FriendlyFire's NonSerialized field. However [ShouldRemember L1263-1287](../private/depth-6/source/XRL.World.Parts.Brain.cs) requires a valid object and, except for the player, a nonnull active CurrentZone equal to the owner's CurrentZone. A normally detached queued nonplayer fails this filter. Thus runtime reference retention by FriendlyFire is insufficient for this particular persistence path.

[PostRead L1325-1352](../private/depth-6/source/XRL.World.Parts.Brain.cs) rebuilds the filtered dictionary, reads LeaderReference and faction feelings, then expires opinions. It does not reconstruct a saved goal stack or vortex membership.

[PartyCollection L27-70](../private/depth-6/source/XRL.World.AI.PartyCollection.cs) stores integer BaseID keys, PartyMember reference wrappers and flags. [GameObjectReference L1-56](../private/depth-6/source/XRL.World.GameObjectReference.cs) stores ID plus an Object pointer at runtime; Write emits the ID and WriteGameObject(Object,Reference:true). It disables automatic field reflection. The writer queues wrappers until after the body pass. An already enrolled full-body token can be reused; an unenrolled wrapper writes an ID-only marker rather than adding the body. Reader reference tokens and subsequent lookup can preserve less than a body. The independent audit retains exact token order and reader behavior.

[AllegianceSet L122-151](../private/depth-6/source/XRL.World.AI.AllegianceSet.cs) writes source ID, reason, flags, amount, faction entries and the Previous chain. Source ID alone is not a full body root. Concrete reason subclasses may have their own fields/serialization and remain unclosed. Opinion subject IDs likewise must not be promoted to proof of actor preservation.

## Q6-R4: a real alternate holder exists in Physics damage memory

The [independent trace](independent-audit/FINDINGS.md) follows Physics.ProcessTakeDamage, generated Write/Read, ValidateGameObjects, QudGameObjectExtensions.IsValid, reader finalization and ActionManager validation. ProcessTakeDamage assigns LastWeaponDamagedBy, LastProjectileDamagedBy and LastDamagedBy from event weapon/projectile/owner-or-attacker after the selected phase checks. Temperature paths can set InflamedBy.

Physics.Write invokes full WriteGameObject for these four references. Validation requires a nonnull object, Physics and not-in-graveyard; it does not require current context or same-zone presence. Therefore a concrete conditional source chain is: actor A damages actor B; B retains LastDamagedBy=A; A is later queued by the vortex and becomes contextless/inactive; B remains in a saved root; B's Physics serializer enrolls A's full body. General amnesty, suspension or later overwrite can clear the holder, so this is not universal preservation. Event admission and active source composition still matter.

A body's persistence says nothing by itself about cell placement. The reader preallocates object tokens, loads bodies and runs part finalization; Physics restores the saved context fields. With no cell/inventory/equipment recorded, there is no automatic placement from these damage references. SpaceTimeVortex.Queue/Locations remain skipped. Nonplayer ActionManager validation rejects CurrentCell==null and removes an invalid active-queue entry; only the player has the specific spawn-cell repair route. The earlier depth5 MakeActive request after an unsuccessful teleport therefore does not establish ongoing contextless NPC turns.

## Q6-R5: quest and load hooks retain bounded uncertainty

[Quest L266-346](../private/depth-6/source/XRL.World.Quest.cs) writes quest-giver names/zone/location strings, not a direct quest-giver body in those named fields. It also writes dynamic reward, steps, IPart-based manager, system type and object-valued Properties. Those nested custom types can carry references. The correct result is that named metadata strings do not preserve a victim's body, while custom manager/property/reward consumers remain potential roots. The nonserialized cached IQuestSystem field does not erase the explicitly written SystemType route.

[XRLGame load L1758-1844](../private/depth-6/source/XRL.XRLGame.cs) reads game fields/player/systems/zones/action queue/quests/globals/state, then calls Reader.FinalizeRead, ActionManager.FinalizeRead and each system.AfterLoad. Zone-manager load has an exception path that increments Reader.Errors and unspools to a marker. Arbitrary AfterLoad hooks can change state. This owner order does not establish that every derived hook rescues or deletes contextless actors.

[GamePlayer L1-30,63-75](../private/depth-6/source/XRL.World.GamePlayer.cs) makes _Body NonSerialized and assigns it from Reader.GetPlayer on load. The writer's player-token mechanism is independent of ordinary nonplayer queue ownership; the vortex explicitly tracks players, so ordinary queued-victim examples do not use player repair as a general fallback.

Remaining questions: every derived custom game system, quest manager, reward and object-valued property; other part/effect direct references; later access to a preserved contextless victim; cache placement/copy consumers; errors/overrides and native observations. The positive damage-holder route is established without pretending those broader inventories are complete.
