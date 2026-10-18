# Additional unread abilities and combinations

2026-10-15. Static formulas and event consumers, not observed balance or AI success. Full code remains private with locators. These are research references, not selected YAIR implementations.

## M16: Time Dilation is a nonstacking, supplier-recomputed field

Activation checks local reality distortion, sets Duration16, applies the field, costs1000 energy and starts150 cooldown. EndTurn decrements then reapplies while positive. The default range is9. AI offers it at distance<=10 with valid nonstasis target, readiness and advisability. Actual affected combat objects come from a visibility query and per-target acceptance/accessibility; the loop excludes the source but does not filter hostility.

Its distance multiplier is (Range-distance)²×(0.0005L+0.0085). A dependent TimeDilated effect checks a valid source that still has TimeDilation with positive duration and a target within range. It removes/recomputes its owned Speed shift from max(int(target.BaseSpeed×multiplier),1) on EndTurn or EnteredCell. Thus it responds to distance and source rank rather than snapshotting the activation rank. ITimeDilated vetoes CanApplyTimeDilated and ApplyTimeDilated while present, preventing ordinary overlapping applications. It removes shifts on removal, supports copy-without-effects and can be removed by reality stabilization. The independent variant is a separate duration-based path. Loss of the supplier mutation is explicitly caught here, unlike psychic battle's supplier omission. [TimeDilation](../private/depth-3/source/XRL.World.Parts.Mutation.TimeDilation.cs) [TimeDilated](../private/depth-3/source/XRL.World.Effects.TimeDilated.cs) [ITimeDilated](../private/depth-3/source/XRL.World.Effects.ITimeDilated.cs)

## M17: Life Drain is a target-owned bond with a saved level

Activation requires an organic combat target with HP, refuses self, checks reality transit where enabled, applies a20-duration effect, then pays1000 and cooldown200 regardless of the effect's boolean result in that command body. AI offers it at adjacency with the same target and readiness/reality checks.

The effect stores Drainer, Level and a damage roll string, normally the rank as fixed damage. EndTurn validates drainer HP and target eligibility, plus reality usability/accessibility if required. It rolls1d8+max(current drainer Ego mod,storedLevel)>target combatMA+4. On success it sends Drain/Unavoidable damage by ref, and heals the drainer only when the target reports successful positive damage, using the resulting amount. This differs from Sunder's pre-resolution accrual. A drainer-only cancel item action removes the bond. The effect body does not require Drainer still have the mutation; its reality helper is passed the possibly absent mutation. Distance/zone limits are not explicit in that tick body, so those shared reality checks are the next consumer rather than a guessed tether radius. [LifeDrain L64-71,79-126,143-167](../private/depth-3/source/XRL.World.Parts.Mutation.LifeDrain.cs) [LifeDrain L88-211](../private/depth-3/source/XRL.World.Effects.LifeDrain.cs)

## M18: Interdiction is a passive target relationship

BeforeTakeAction checks an existing target and can retarget to ParentObject.Target. BeginInterdiction first stops the old one, then requires no EMP, target phase compatible with3 and LOS. It applies an owner-ID Interdicted with configured SpeedPenalty default10. That effect refuses another from the same interdictor, owns an additive MoveSpeed cost shift, and removes itself on EndTurn when no matching visible combat source or LOS. It does not check the source still has the Interdiction mutation. Unmutate itself delegates directly to the empty base path; removal while source remains visible is still a static cleanup concern. The source CheckInterdiction uses successive conditions after StopInterdiction clears its field, creating a null-dereference candidate that needs actual branch reproduction before calling it a live defect. [Interdiction](../private/depth-3/source/XRL.World.Parts.Mutation.Interdiction.cs) [Interdicted](../private/depth-3/source/XRL.World.Effects.Interdicted.cs)

## S10: Juke closes the Pointed Circle/Bloodletter combination

Juke checks frozen/posture/movement modes and cell solidity. It can swap with at most one matching phase/flight combat object, refusing high matter phase or rooted targets. It moves with EnergyCost0 and, after a successful hostile swap, Pointed Circle can perform a primary short-blade attack tagged Juking. That tag reaches Bloodletter's previously traced100% branch; damage/effect eligibility still applies. Cooldown40 becomes20 with Tumble, tagged Agility. NPC admission is adjacency, phase/flight/matter/root/solidity checks and a10% roll, raised to50% when Pointed Circle and a usable primary short blade exist. Frozen and movement details still belong to execution. [Tactics_Juke](../private/depth-1/source/XRL.World.Parts.Skill.Tactics_Juke.cs)

Kickback operates before missile firing, requires feet/two Foot parts, an adjacent combat target and reachable flight. It checks phase/matter, involuntary movement permission, Strength save15 and a Push force Strength×50 for distance4. Adding the skill sets Brain.PointBlankRange while recording an existing true value; removal only clears it if that saved property is absent. It has no explicit energy cost in this hook and can fail without canceling firing. This is an actual chain to Anchor Spikes' involuntary-movement veto. Repeated acquire/remove and the persistent prior-state marker remain unexercised. Iron Mind separately uses Willpower-10 for initial Confusion veto and EndTurn removal of a Confused instance; multiple confusion effects can remain, reflected in its message branch. [Tactics_Kickback](../private/depth-1/source/XRL.World.Parts.Skill.Tactics_Kickback.cs) [Discipline_IronMind](../private/depth-1/source/XRL.World.Parts.Skill.Discipline_IronMind.cs)

## C15: phase-adaptive projectiles mutate the projectile, not the world

The implant supplies a thrown-weapon provider at priority100 only while its active subject, ability/toggle/readiness and SafetyIncidentTurn checks pass. BeforeProjectileHit examines an obstruction before the apparent target; ProjectileMoving attempts synchronization before the path reaches the target cell. The helpers consume charge before reality-transit permission, then remove Omniphase/Phased or apply Phased(1), asking hit/phase to be rechecked. Certain subject phases are excluded. Failure records the current tick to suppress more phase changes in that interval.

Thrown start/end hooks are empty. Unimplant removes the ability, not every already altered projectile's effects. Temporary phase duration and shared projectile lifetime therefore own final restoration. This is not a guarantee of hitting every phase or passing every wall, and the actor-generic hook does not grant AI perfect aim. [CyberneticsPhaseAdaptiveScope L38-119,126-240,266-312](../private/depth-3/source/XRL.World.Parts.CyberneticsPhaseAdaptiveScope.cs)

## C16: Stasis Entangler creates many independent timed objects

It checks subject identity, local zone, ability/readiness and uses charge **before** target picking and reality transit. Successful transit then pays1000, starts cooldown and scans every cell. A cell qualifies if it contains a creature, contains neither actor nor chosen target, and passes accessibility. Creatures sharing either exempt actor's cell are therefore exempt too; this is not a per-creature exception only.

Each qualifying cell gets Stasisfield with creator, actor phase and Temporary(duration+1). Default duration15 and stabilization penetration30 ignore the compute argument in their methods. Cooldown defaults200 and computes max(base×(100-compute/2)/100,base/2), with integer division. Unimplant removes its ability without sweeping fields, so the independent Temporary owns expiry. No AI admission handler is registered in this class. A zero-field branch later references the last field object for a message, a concrete null candidate if no qualifying cell exists, not yet a native bug reproduction. [CyberneticsStasisEntangler L53-76,89-260](../private/depth-3/source/XRL.World.Parts.CyberneticsStasisEntangler.cs)

## M19: Force Wall is distinct from Force Bubble support

Force Wall has offensive and retreat AI. Offensive admission considers a ForceWallTarget or a target lacking a nearby forcefield; retreat finds the nearest visible hostile. After nonempty cell selection it pays1000, starts100 cooldown and independently checks each cell before creating a Forcefield with creator, owner passage, phase and Temporary(15+2L). The class does not keep a live support dictionary like Force Bubble. Losing the mutation does not inherently cancel these independent timed fields in its Unmutate body. Actual forcefield passage/stasis/collision remains an unread shared consumer. [ForceWall L25-74,144-166,179-186](../private/depth-3/source/XRL.World.Parts.Mutation.ForceWall.cs)

## K31-K38: consequential joins

| Code | Join | Source outcome / remaining boundary |
|---|---|---|
| K31 | Juke + Pointed Circle + Bloodletter | Hostile swap produces Juking attack, selecting Bloodletter's100% branch; target acceptance still applies. |
| K32 | Kickback + Anchor Spikes | Involuntary-movement permission can stop the push before save/force. |
| K33 | Suppressed + forced move/teleport | LeaveCell explicitly exempts those movement forms from its veto/energy penalty. |
| K34 | Rifle disorientation + mental attack | Disoriented owns MA as well as DV penalty; different-strength reapplication needs stat-refresh verification. |
| K35 | Multiple flight sources + one supplier failure | Last-source count controls full grounded/Prone transition; source-specific stop still runs. |
| K36 | Time Dilation + supplier loss/another field | Dependency sync catches missing source; existing effect veto prevents ordinary field stacking. |
| K37 | Life Drain vs Sunder + prevention | Life Drain heals post-resolution successful amount; Sunder accrues before target damage event. |
| K38 | Scope/entangler/recoiler + cancel or veto | Power may be used before a later target/transit failure; final energy/cooldown conditions differ. |
