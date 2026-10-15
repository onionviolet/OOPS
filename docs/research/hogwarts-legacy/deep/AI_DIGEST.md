# AI digest

2026-10-14. Steam build 20773316. Static evidence only. SHOWN means installed rows or decoded assets; STATED means shipped text; INFERRED means interpretation. No game or save was opened. Full records are in [private tables](../private/tables/ship/SCHEMA.json), [decoded assets](../private/decoded/deep/receipts.json) and [readable graph exports](../private/flows/deep/INDEX.json). These contain deeper details than this public digest, including sealed records.

Asset paths below begin at `Phoenix/Content/`. `/Game/` references in an export resolve to that content root. A parsed package is not proof that its path is selected during a particular encounter.

## D9: archetypes and shared execution

SHOWN: `Pawn/NPC/Enemy/BehaviorTree/BT_EnemyAI.uasset` has 157 exports. Its root, repeaters, blackboard decorators and injected subtrees dispatch state rather than encode each species as a wholly separate AI. `BB_EnemyAI.uasset` carries target/location, perception enablement, reaction, investigation, awareness, alert, spell-effect, scheduled-entity, attack and mobility state. Important separate keys include `TargetActor`, `LastTargetLocation`, `ChosenAttackValid`, `RankedToAttack`, `ClaimedAttackTicket`, `AttackCooldownTime`, `AttackState` and `ProtegoActive`.

SHOWN: `Character/DarkWizard/Data/DT_DW_BehaviorTree`, `Character/Goblin/Data/DT_Goblin_BehaviorTree`, `Character/Spider/Data/DT_Spider_BehaviorTree` and `Data/Trolls/DT_Troll_BehaviorTree` all override `NPC.BT.Wander` with `BT_EnemyAIWander_Idle`. `Character/Inferi/Data/DT_Inferi_Behavior` instead references `BT_Inferi_Wander`. These are override tables, not complete descriptions of combat. The broader role differences also use `EnemyDefinition` presets, attack records and ability assets.

SHOWN: `Trees/ChooseAttack/BT_Enemy_ChooseAttack` orders `BTT_ChooseAttack` before `BTT_PublishAttackState`. The Wand variant is separately exported. `EnemyAttackSelectionData` describes desirable attack properties; `EnemyAttackSelectionWeights.State` weights those properties for a state. Distance, shield breaking, fire, crowd control, juggles and large-target interruption are separate inputs. No complete final attack-score equation is claimed.

Private: [root graph](../private/flows/deep/BT_EnemyAI.md), [blackboard](../private/flows/deep/BB_EnemyAI.md), [attack choice](../private/flows/deep/BT_Enemy_ChooseAttack.md), [enemy definitions](../private/tables/ship/EnemyDefinition.json).

## D10: perception, targeting and noise

SHOWN: `EnemyPerceptionScores.Type` has `Companion`, `Enemy` and `Leader`. Its columns weight distance, maintained targets, recent damage, number already attacking, health, threat, shields, reactions and other states. This is evidence for target scoring. It is not the stealth detection bar or a sight-cone definition.

SHOWN: `Pawn/NPC/Enemy/Perception/DA_IndoorStealth_TargetSense.uasset` explicitly overrides LOS/FOV, memory and TAS. Its standard Aware and Alert profiles store FOV 60, distance 1500, hearing radius 600, instant distance 500 and instant hearing radius 200. Its Disillusionment Aware/Alert profile stores FOV 55, distance 800 and hearing radius 20. Attack profiles differ again. Values are raw engine-space settings, not verified metres or measured detection times. Other exported profiles include sniper and combat-specific variants.

SHOWN: `SpellDefinition.CastNoise` and `ImpactNoise` are separate references to `Noise.Noise`. The latter stores radius and intensity:

| Noise ID | Radius | Intensity |
|---|---:|---|
| NoNoise | 0 | None |
| SmallNoise | 1000 | White |
| MediumNoise | 2000 | Yellow |
| LargeNoise | 4000 | Yellow |
| HugeNoise | 5000 | Yellow |
| DistractionShot | 2000 | Yellow |

Accio, Levioso and Stupefy use SmallNoise on cast and MediumNoise on impact. Incendio uses MediumNoise for both. Lumos and Disillusionment use NoNoise for both. These rows do not prove every hit emits an event or that an observer hears through every wall. Event dispatch, attenuation and the complete perception update remain untraced.

Private: [noise table](../private/tables/ship/Noise.json), [spell rows](../private/tables/ship/SpellDefinition.json), [target score inputs](../private/tables/ship/EnemyPerceptionScores.json), [profiles](../private/decoded/deep/receipts.json).

## D11: awareness fill, decay and memory

SHOWN: the indoor profile's `Remember` stores `MinTime=2` and `RememberMaxDistance=40000`. Its TAS stores `EventMaintainTime=10`, `EventAwareAlertValue=0.1`, and four curve references. Their exported keys are:

| Curve | Stored input/value keys |
|---|---|
| FC_EnterAwareRate | 0/0.28, 1/0.45, 2/1.5, 3/4 |
| FC_EnterAlertRate | 0/0.667, 1/1.1, 2/3, 3/3.75 |
| FC_ExitAwareRate | 0/0.5 |
| FC_ExitAlertRate | 0/0.65 |

These are curve coordinates. The curve's serialized `Time` key is not proof that its input is elapsed seconds. The owning references are named distance curves. Exact distance normalization, delta-time multiplication, saturation thresholds, difficulty adjustments and transitions require the native TAS/perception update, which this pass has not reconstructed.

SHOWN: `BT_EnemyAIAlert` branches on `AlertState`, including start, facing, idle, move, storing a weapon and losing target. `BT_EnemyAILoseAlert` performs `LoseAlert`, sets its blackboard key and waits with a small deviation. There are separate BecomeAware/LoseAware and BecomeAlert/LoseAlert routes. INFERRED: detection, remembered information and current combat readiness should not be one Boolean.

Private: [alert flow](../private/flows/deep/BT_EnemyAIAlert.md), [lose-alert flow](../private/flows/deep/BT_EnemyAILoseAlert.md), [complete profile and curve exports](../private/decoded/deep/receipts.json).

## D12: group attack coordination

SHOWN: all five `EnemySubtypeData` rows store normal attack budgets of 1/2/3 for Easy/Medium/Hard, plus attacked-ticket additions of 1/1/2. The subtype rows are DarkWizard, EnemyPlant, Goblin, Spider and Troll. Story handling is not a fourth column in this table.

SHOWN: `EnemyAttackData.AttackTicket,AttackTicket2,AttackTicket3` references a ticket family. `EnemyAttackParams` supplies a condition tag, desynchronization time, ticket cooldown ranges/deviation, group/type cooldowns and tickets-per-attacker curves. `EnemyAggressivenessParams` separately weights time since attack, on-camera status, targeting and randomness. `EnemyDifficultyScaling.TicketScale` and the other ticket scaling tables supply further inputs.

INFERRED: choosing a suitable attack and permission to execute it are separate decisions. The blackboard and choose/publish task sequence support that interpretation. The exact native claimant, tie-breaking order, release timing, offscreen policy and maximum simultaneous attackers in a live mixed group remain OPEN. The stored 1/2/3 budgets are not a universal observed attacker count.

Private: [ticket parameters](../private/tables/ship/EnemyAttackParams.json), [subtype budgets](../private/tables/ship/EnemySubtypeData.json), [aggression weights](../private/tables/ship/EnemyAggressivenessParams.json).

## D13 and D14: companions and schedules

SHOWN: `BT_CompanionAI_FollowPlayer` sequences its follow task and a 0.1 wait. The task package contains execute/tick, repath and timeout routes. Full exports preserve those routes; this is not evidence that every navigation failure was handled in play. Target scoring has a Companion profile and attack selection has separate attack suitability fields. Assistance is not equivalent to universal free summoning.

The first pass's decoded `BP_ForceCompanionWait` resolves the primary companion/scheduled entity and sets or stops a forced wait location, with restore/checkpoint callbacks. `BP_CompanionSettingsVolume` changes settings at a volume boundary. `CharacterDefinition.CompanionLock`, mission follow/off state and allowed-area tasks are further controls. See [first-pass Blueprint evidence](../BLUEPRINT_PASS.md), B8/B9, and [private original flows](../private/flows/first-pass/receipts.json).

SHOWN: `Schedule_Overland` has 618 rows. Activity and schedule priority, key, time, season and world selection are separate from conversation registration. `MissionSteps` contains 274 AddScheduleOverride, 570 ReplaceScheduleOverride and 218 RemoveScheduleOverride rows, plus 252 SetSchedule rows. These counts include development and child records. `MissionTaskTypes` declares the override arguments: activity, character, named group, world, instant placement, parent naming, apparation and orientation. Removal has its own narrower signature. No universal stack restoration rule follows from the names alone.

INFERRED: a quest can temporarily relocate or reserve a person while routine availability remains separately authored. Full timetable arbitration, complete assist behavior and save durability were not exercised.

Private: [follow flow](../private/flows/deep/BT_CompanionAI_FollowPlayer.md), [schedule table](../private/tables/ship/Schedule_Overland.json), [task signatures](../private/tables/ship/MissionTaskTypes.json), [all mission steps](../private/tables/ship/MissionSteps.json).

## D15: vivarium creatures

SHOWN: selected creature trees cover feeding, feeding stations, nurture interaction/petting, toys, forage/graze, explore, observe, follow parent, relax, conflict/standoff/flee, cages, birth/growth transitions and flying/perching. These are full parsed tree exports, not just filenames. The flying toy tree checks a `PlayPriority` tag on its target and includes a cone condition. The Fwooper and Jobberknoll override tables select the flying toy behavior. The Graphorn table has separate combat and exit-combat overrides. These tables do not prove all species use every shared tree.

The shipped `NurturingCreatureDynamic` schema separately stores fed, interaction, happiness, production, pregnancy and simulation state. A feeding animation/tree is not the product timer consumer. Exact care-flag consumption and unloaded/offline simulation remain OPEN, as in the first pass.

Private: [flying toy flow](../private/flows/deep/BT_Creature_PlayWithToy_Flying.md), [all tree exports](../private/flows/deep/INDEX.json), [care schema](../private/tables/ship/SCHEMA.json). Additional species override exports are indexed in the private README.

## YAIRPG implications

PROPOSALS: D9/D12 sharpen a small attack-budget proposal; D10/D11 sharpen a bounded detection-and-memory proposal; D13 refines LP6, D14 refines LP5 and D15 refines LP4. Keep actual target knowledge, availability, chosen action and permission to execute distinct. This does not select an action-combat port or a whole-school simulator.
