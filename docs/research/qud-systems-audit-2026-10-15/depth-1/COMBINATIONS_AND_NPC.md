# Combination matrix, NPC evidence and further questions

2026-10-15. These are static source findings and research implications. They are not selected YAIR designs. Effects should be traced through actor, event, resource, target and cleanup owners rather than guessed from descriptions.

## K: connected combinations

| Code | Combination | Source-supported result | Boundary |
|---|---|---|---|
| K1 | Jab + Flurry | Jab explicitly excludes Flurrying; Flurry finalizes its own intrinsic/consecutive attack selection | No naive extra-attempt multiplication. |
| K2 | Qualifying negative effects + Shank | +2 penetration and cap modifier per matching effect instance | Specific mask; downstream armor/penetration still applies. |
| K3 | Berserk + Dismember + Decapitate | Berserk selects stronger dismember route; heads need decapitation option | Still needs penetration, a severable part and no veto; regeneration can veto decapitation. |
| K4 | Critical hit + Opportune Attacks + Berserk | Up to two matching skill/shield cooldowns can refresh | Berserk vetoes refresh while active; unrelated cooldown tags are excluded. |
| K5 | Single-weapon toggle + offhand anatomy | Very-early suppression of intrinsic nonprimary attacks | Extra limbs do not automatically override mode policy. Full event-order permutations remain unplayed. |
| K6 | Conk + existing Stun | Bludgeon can apply sleep instead of its ordinary daze route | Requires weapon, head, actual attack path and effect acceptance. |
| K7 | Carapace posture + mental ability | Tightening can survive energy use tagged Mental | Physical action tags and ordinary movement loosen it; no claim for every ability with mental flavor. |
| K8 | Electrical Generation + powered gear + discharge | Gear spending and burst release share charge accounting | Biological/live/query flags and per-turn debt gate supply. |
| K9 | Light Manipulation + Willpower + Mass Mind | Config-enabled recharge interval changes; AfterMassMind clears penalty | Flag-dependent, with integer floor/clamp; beam still faces armor/reflection/blackout. |
| K10 | Adrenal Control + physical mutations | Temporary rank modifier triggers shared mutation-level synchronization | Exact refreshed capacities and overlap cleanup require consumers; no universal stacking promise. |
| K11 | Fasting Way + Mind Over Body | ×12 cooking increment and divisor in selected stomach paths | Not a universal immunity to starvation/thirst. |
| K12 | Palladium + radar/stasis/micromanipulators | +20 compute changes explicitly querying consumers | Integer rounding, discount cap and cooldown floor; no global implant buff. |
| K13 | Micromanipulators + turret deployment | Deployment's energy type passes the selected string filter | Readiness, event ordering and actual host use remain static-only. |
| K14 | Medassist + phase-changing tonic + incoming damage | Before-damage hook can cancel damage on changed phase compatibility | Needs loaded tonic, positive utility, capacity, charge, dosage and successful application. |
| K15 | Temporal Fugue + cloning multiplier + equipment | Intended copy count scales; actual clones deep-copy and get hierarchical temporary support | Placement can undershoot; recursion and replication gates; final loot/expiry consumers unresolved. |
| K16 | NPC Precognition + lethal damage | Can restore recorded HP/temperature and veto eligible death | No NPC world rewind; expiry, identity and reality gates remain. |

[S: skill evidence](SKILLS.md), [M: mutation evidence](MUTATIONS.md) and [C: cybernetic evidence](CYBERNETICS.md) provide source locators for each row. These are interaction traces, not measured balance rankings.

## N: NPC use has four evidence layers

| Layer | What is retained | What it proves |
|---|---|---|
| N1: authored possession | Complete original creature nodes, direct mutation/skill/implant matches and inheritance identifiers | Some definitions are authored with these faculties. An abstract parent is not a guaranteed spawned actor. |
| N2: AI admission | Exact event handlers, distance, challenge, readiness, movement, target and stochastic conditions | The behavior can be offered to the AI when those conditions hold. It does not prove the planner selects it. |
| N3: generic execution | Commands/effects operate on actor/subject, with explicit player-only branches identified | The common mechanism has an NPC path unless excluded. It does not establish autonomous initiation. |
| N4: observed outcome | None in this pass | No spawn-frequency, tactical competence, native combat, save or round-trip claim. |

[The private fixture corpus](../private/depth-1/NPC_FIXTURES.json) retains21 direct matching creature records, including inherited base creatures. Electrical Generation appears at authored levels2,3,7 and10; the level10 example sets BaseChargePerTurnPercent300. Temporal Fugue appears at levels7 and14. Carapace has examples from base creatures through levels10,15 and20. Specific actor records possess Berserk, Conk and Shank. Random implantation has a full creation consumer as well as authored configuration. These are original data values, not a claim the player's acquisition caps equal NPC authored ranks.

AI contrasts worth keeping: Shank prefers targets already bearing counted effects; Draw a Bead wants a ready ranged weapon and distance; Fugue excludes copies and tests target challenge; stasis has a separate retreat target policy; Electrical Generation wants stored burst charge; Carapace has defensive admission. Radar/night vision's read effect is player rendering. Turret deployment has no AI offer in its class. Do not collapse all of these into “NPCs have the same abilities.”

## P: more to consider, ranked by consequence

| Priority / code | Research question | Why it changes understanding | Smallest next evidence |
|---|---|---|---|
| ACT NOW / P6 | Keep chance, attempts, penetration, damage and effect application separate in the reference archive | Summing percentages across stages creates false combos | Done for the named chains in this supplement; no implementation. |
| ACT NOW / P7 | Preserve failure order and ownership in every decoded chain | Charge can be spent before a later veto; support loss can remove fabricated items | Done for medassist, lathe, stasis and the named body/skill paths. |
| ACCOUNT FOR NOW / P8 | NPC fairness depends on possession, information and policy separately | A player-rendering sensor is not AI knowledge; generic execution is not an AI decision | Retain the N1..N4 evidence ladder and fixture corpus. |
| ACCOUNT FOR NOW / P9 | Effective rank and authored NPC rank have different ceilings | Rank scaling can make a high-level authored creature unlike an obtainable player build | Trace mutation-level caps, grant sources, adrenal synchronization and NPC construction together before balance conclusions. |
| ACCOUNT FOR NOW / P10 | Support expiry is also an economy rule | Temporary copies, force items and added slots can duplicate, strand or return equipment | Follow Temporary/replication/ExistenceSupport/body cleanup, including nested items and severed parts. |
| LATER / P11 | Effect masks and action-tag vocabulary are hidden compatibility contracts | “Negative,” “mental,” “Agility” and “tinkering” labels can miss exact code predicates | Decode shared enums/tag producers, phase and damage consumers before generalizing. |
| LATER / P12 | Failure recovery and serialization can change the mechanism | Source intent does not prove cooldowns, source keys, debt or clone IDs survive restore | A separately authorized isolated native experiment with disposable state, not personal saves. |
| LATER / P13 | Tactical quality and counterplay need observation | Admission code does not prove friendly-fire avoidance, target quality or useful retreat | Bounded NPC encounter fixtures after source closure, only if requested. |

The biggest new research signal is ownership plus event order: who supplies a faculty, what exact event admits it, when resources are paid, who receives effects, and which owner restores or removes them. This is a comparison lens for the existing YAIR direction, not an approved replacement architecture.
