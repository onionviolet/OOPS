# Mutations: ranks, resources, exceptions and NPC paths

2026-10-15. `L` is the effective level supplied to the named method. These integer formulas come from the pinned assembly, not a claim about current retail balance. [Full original rows](../private/MUTATIONS.json) preserve cost, exclusions, categories and hidden entries; [source coverage](COVERAGE.md) distinguishes capture from review. Source descriptions are retained privately; the effects below follow actual handlers where identified.

## M1: attributes and temporary rank changes

| Mutation | Actual selected effect | Limit or combination |
|---|---|---|
| Heightened Strength | Strength bonus 2 + floor((L-1)/2); after dealing damage, chance 13+2L to apply Dazed for 2..3 | Permanent rank-derived and temporary-rank portions use different stat-shift ownership; effect acceptance can veto daze. |
| Heightened Agility | Same attribute bonus formula for Agility | Cooldown shortcut checks tag string exactly equal to Agility, then chance 7+3L to set turns to zero. It does not refund the action's energy or reset arbitrary abilities. |
| Two-Hearted | Same Toughness formula; sprint duration PercentageIncrease +=20+10L | Run ability is resynchronized on level/initialization. Final sprint timing still belongs to its consumer. |
| Heightened Quickness | Speed base-value bonus 13+2L | ChangeLevel removes the previous owned contribution before adding the new one; Unmutate removes it. This is not a movement-distance formula. |
| Adrenal Control | Twenty action-start ticks; Quickness 9+L; other physical mutation rank modifier floor(L/3)+1; cooldown 200 | Sets AdrenalLevelModifier, sends SyncMutationLevelsEvent, updates effect metadata; expires and removes owned bonuses. No energy payment appears in the command handler read. |

[HeightenedStrength](../private/depth-1/source/XRL.World.Parts.Mutation.HeightenedStrength.cs) [HeightenedAgility](../private/depth-1/source/XRL.World.Parts.Mutation.HeightenedAgility.cs) [TwoHearted](../private/depth-1/source/XRL.World.Parts.Mutation.TwoHearted.cs) [HeightenedSpeed](../private/depth-1/source/XRL.World.Parts.Mutation.HeightenedSpeed.cs) [AdrenalControl2 L41-193](../private/depth-1/source/XRL.World.Parts.Mutation.AdrenalControl2.cs)

A rank buff therefore can change several consumers at once, including armor, resource capacity, healing and damage. That is a source-based dependency, not a verified claim that every cached value resynchronizes correctly under every transfer. Attribute mutations deliberately split permanent and temporary contributions; persistence and body-copy behavior need their own proof.

## M2: Carapace is equipment with an action contract

Carapace generates a real default body-armor object and forces the body slot clear. Base AV is 3+floor(L/2), DV is -2, and Heat/Cold resistance is 5+5L. Tightening pays 1000 energy, stores the current ACModifier as an extra AV contribution and adds another two-point DV penalty. It remains tightened through energy types containing Pass, Mental or Carapace; other energy use loosens it. Normal movement loosens it, with explicit exceptions for forced movement and Teleporting. Thus mental abilities can coexist with the defensive posture where their energy tags match, while ordinary physical attacks break it.

ChangeLevel loosens before updating stats. Unmutate removes mutation equipment, resistances and ability. The AI has a defensive low-health stochastic admission route; that does not establish it chooses the best power while tightened. Equipment replacement, limb support and action tags are part of the mechanic. [Carapace](../private/depth-1/source/XRL.World.Parts.Mutation.Carapace.cs)

## M3: healing, status resistance and heads

Regeneration increases a regeneration-event healing amount by ceil(amount×(0.1+0.1L)). This is a modification to a supplied healing event, not that percentage of maximum HP each round. Action start rolls 1+floor(L/3) for Regenera processing and 10L for a limb-regeneration event. Those events' final eligibility rules remain downstream. At L10+, its BeforeDecapitate handler returns false. The visible explanation suggests instant regrowth, but this path mechanically vetoes decapitation. It does not confer general death immunity. [Regeneration](../private/depth-1/source/XRL.World.Parts.Mutation.Regeneration.cs)

Two-Headed reduces mental energy cost through PercentageReduction +=15+5L. A separate selected effect-mask route gives 50% resistance/removal opportunities, with explicit mask exclusions and a requirement that its managed extra head still exists and total head count is at least two. The mental energy handler does not itself recheck that extra-head condition. Head loss can therefore affect status protection differently from the cost event; full anatomy/cleanup behavior remains outside the selected windows. [TwoHeaded L1-175](../private/depth-1/source/XRL.World.Parts.Mutation.TwoHeaded.cs)

The Meditate and Regeneration combination has distinct owners: one modifies the healing event, the other advertises faster regeneration and changes certain status countdowns. The exact final healing multiplication and order are not closed here, so no combined healing multiplier is asserted.

## M4: Electrical Generation supplies two competing uses

Base generation is L×100×BaseChargePerTurnPercent/100. Willpower adjusts that relative to 16 at five percent per point, clamped between one fifth and five times the base. Storage cap is 2000+2000L. Discharge requires at least 1000 stored charge and sends floor(storedCharge/1000) d4 into the downstream electrical discharge mechanism, then clears stored charge. Its final target, propagation, voltage, resistance and damage processing remain in that downstream call.

Device QueryCharge/TestCharge/UseCharge handlers expose a biological source only when the relevant inclusion/live/toggle gates permit. Available charge incorporates stored charge plus this turn's allowance minus AdvancedCharge. Spending can borrow from that allowance before stored charge; action and TurnTick paths prevent charging twice. Incoming electrical damage adds 100×damage amount to storage in the read hook, which is not immunity to that damage. A regular discharge command spends 1000 energy before the helper rejects insufficient charge. AI admission requires at least 1000 stored charge, adjacency and usable ability. Equipment use and offensive release therefore compete for a shared resource with a time-accounting policy. [ElectricalGeneration L47-110,172-280,311-366,433-496,540-597](../private/depth-1/source/XRL.World.Parts.Mutation.ElectricalGeneration.cs)

## M5: Light Manipulation spends illumination capacity

Maximum light radius is 4+floor(L/2); one laser adds one RadiusPenalty, decreasing available light and future shots. Each shot pays 1000 mental energy, traces a line and stops at the first combat target. Blackout can truncate the path; refract/reflect handlers can redirect it. Penetration is 4+floor((L-1)/2), rolled against target AV; each penetration rolls a damage increment. Damage increments at L1..9 are 1d3, 1d4, 1d5, 1d4+1, 1d5+1, 1d4+2, 1d5+2, 1d4+3, 1d5+3; L>9 uses 1d5+(L-6). Damage attributes are Light Laser. A visual beam is not guaranteed damage.

One unit regrows every 15 EndTurn ticks by default. A named configuration flag enables the Willpower adjustment; then the integer interval is 15×(100-5×(WP-16))/100 clamped to 3..75. AfterMassMind resets the penalty to zero. Reflection chance is 10+3L in the RefractLight hook, which changes direction and vetoes the original event. Ambient light has a separate toggle and checks the Lase cooldown when turning on. NPC admission demands LOS, a valid nonstasis target, available capacity, ability readiness and distance within 999. That very large range is an admission maximum, not a claim of cross-zone targeting. [LightManipulation](../private/depth-1/source/XRL.World.Parts.Mutation.LightManipulation.cs)

## M6: phase, stability and fields

Phasing advertises 6+L duration; activation creates an effect with 6+L+1 and starts cooldown 103-3L. The handler has world-map and reality-transit vetoes and permits toggling back in. No energy payment appears in the selected activation handler. AI defensive use wants damage and readiness; offensive admission uses a bounded nonadjacent distance. The Phased effect can inherit to derived objects, ends on world-map entry unless duration9999, and can be removed by reality stabilization. If forced back to phase1 by that stabilization route, the actor takes 2d6 Normality Phase Unavoidable damage. Physical interaction actually depends on shared phase/collision consumers, not the effect description alone. [Phasing L27-164](../private/depth-1/source/XRL.World.Parts.Mutation.Phasing.cs) [Phased L74-170](../private/depth-1/source/XRL.World.Effects.Phased.cs)

The Phase Harmonic implant applies Omniphase with its own source key. It is not safe to equate that with the temporary Phased effect or assume every phase-specific attack works identically. Its exact cross-phase collision consumer remains open. A stasis projector carries the actor's phase onto each created field, another source-level reason to preserve phase identity through secondary objects.

## M7: Temporal Fugue has copy, placement and recursion gates

Copy count is floor((L-1)/2)+1 and advertised duration 20+2×floor(L/2); the mutation route supplies duration+1 to temporary objects. Cooldown is200, energy1000 after successful helper return. A positive MentalCloneMultiplier multiplies intended copies. The helper refuses an existing FugueCopy, missing cell, world map, failed CanBeReplicated, or reality-distortion veto. It searches nearby spawnable cells in navigation-weight tiers, then connected spawn locations. A true return is not proof the full requested number was placed, because it returns true after the loops without enforcing num==requested.

Each copy begins with DeepCopy, XPValue reset to zero, CloneOf/FugueCopy identity properties and original-player-body removal. The normal route installs an AIReplica, clears old goals, sets forced alliance and follows the original. The optional hostile-copy route clears party leadership and targets the original. Temporary.AddHierarchically applies a lifetime to the copy hierarchy; creation and replication events then run. Exact duplicate item disposal and the anti-export/loot economy are not closed without the Temporary and replication consumers. The AI explicitly excludes FugueCopy actors, so recursive casts are blocked at both offer and creation gates. [TemporalFugue L40-60,77-104,120-360](../private/depth-1/source/XRL.World.Parts.Mutation.TemporalFugue.cs)

## M8: player and NPC Precognition are different mechanisms

Duration is4L+12, activation stores duration+1, cooldown500. Player activation calls SaveGame under a named Precognition slot and queues a visual glimpse; reversion queues a LoadCurrentGame action with restore-state hooks. Expiry asks whether to return. Player death interception offers the same choice and guards re-entry during the queued restoration interval.

NPC activation does not call that player save routine. It records HP and temperature. During an eligible impending-death path it spends the vision, restores those two values, sets a short ActivatedSegment guard and prevents death. It checks reality usability and excludes the original player body in that branch. It does not restore the entire world, position, inventory or every status there. Defensive AI admission includes readiness, no current vision, distance/damage/challenge conditions, reality advisability and a70% roll. Taking control of a body does not grant access to someone else's player vision. These are consequential actor-identity rules, not just different UI text. [Precognition L104-120,288-329,331-477](../private/depth-1/source/XRL.World.Parts.Mutation.Precognition.cs)

## M9: gas generation is a blueprint-backed shared family

The base family resolves the actual gas blueprint, GasType, optional seeping and command identity. It grants immunity through CheckGasCanAffect only when incoming GasType matches its own. That is not broad gas immunity. Default duration1+floor(L/2), cooldown40, density budget800 unless overridden. PumpGas divides density by the number of chosen adjacent cells; it can fall back to the actor's cell. It sets creator, level and phase on each generated gas object and fires CreatorModifyGas.

Activation costs1000 physical energy, toggles emission and pumps immediately. EndTurn decrements its timer and pumps while the timer is nonnegative; stop timing therefore should not be inferred only from the advertised duration. World-map entry forces shutdown. Offensive AI offers the command at distance<=1. The damage/sleep/confusion/normality effects belong to the generated gas part and its level/immunity consumers. Full family classes and gas definitions are captured; those downstream effect schedules remain unreviewed here. [GasGeneration](../private/depth-1/source/XRL.World.Parts.Mutation.GasGeneration.cs)
