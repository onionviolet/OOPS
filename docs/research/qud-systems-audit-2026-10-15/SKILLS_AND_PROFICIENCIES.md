# S1 Skills and proficiencies

Source review of supplied 2.0.211.56. These are authored entries and executable skill components. Qud's use of the word power under a skill tree is distinct from mutation rank, item grants and platform achievements. [Full exact catalogs](private/POWERS.json) preserve every description and gate from the supplied Skills.xml, alongside [skills](private/SKILLS.json), CSV copies and original XML. Catalog completeness means the supplied table, not every possible mod-loaded runtime entry.

## S1a Acquisition and gates

`SkillFactory.LoadSkills` loads XML streams, indexes skills and powers by class, and supports more than one entry for a class. The catalog has 21 skill rows and 123 power rows. For example, Charging Strike occurs in two trees with the same implementation class. Counting rows as distinct executable powers would overstate implementation breadth.

`PowerEntry.InitRequirements` reads vertical-bar alternatives, each containing comma-separated joint attribute requirements. `PowerEntryRequirement.MeetsRequirement` uses BaseStat, not the displayed buffed statistic. Prerequisite names resolve through skill or mutation entries. `SkillEntry.MeetsRequirements` also checks zero-cost children. An attribute named on a parent entry is not automatically a separately enforced numerical minimum; actual child requirements and the generic skill handler matter.

`SkillsAndPowersScreen.SelectNode` resolves the actual purchase. Selecting a power without its parent offers to buy the parent instead. It refuses an already present part, initiatory entry, insufficient SP, failed requirements or missing implementation; confirmation precedes creation and addition. It debits SP after `Skills.AddSkill`, without checking that method's boolean. This is not a demonstrated payment rollback contract.

`BeforeAddSkillEvent.FromSkill` gathers zero-cost child inclusions; `Skills.AddSkill` calls the skill's add hook, attaches the component, processes those inclusions and emits attribution-aware after-add events. That explains why buying a parent can grant its free proficiency. The generic add route is not the same as the purchase UI: it does not itself repeat all purchase gates.

Water-ritual teaching resolves an offer from the speaker or faction, calls the skill's contextual offer hook, checks already-known/initiation conditions, computes reputation cost, rechecks current affordability, then adds the skill with teacher and context. Default `BaseSkill` teaching costs reputation equal to entry cost and zero SP; special skills can override it. The teacher route does not simply call `PowerEntry.MeetsRequirements`. Do not transfer ordinary SP-purchase gates to every acquisition route. The learner here is `The.Player`; this particular conversation route is not evidence of arbitrary NPC-to-NPC teaching.

## S1b Two connected consumers

| Stage | Jump, active | Spry, passive |
|---|---|---|
| Catalog | Acrobatics_Jump: cost 100 SP, base Strength 17; parent Acrobatics 75 | Acrobatics_Dodge: cost 100 SP, base Agility 17 |
| State granted | Skill component, synced activated-ability ID/command and range | Skill component plus owned DV stat shift |
| Current support | Local zone, feet, changeable movement/body position, allowed range/path/landing | No target selection; its stat shift is present while the component's add/remove lifecycle is maintained |
| Selection | Player target picker, or NPC movement/offense/retreat candidates under separate predicates | No activated button required |
| Consumer | `Jump` attempts `DirectMoveTo`, emits JumpedEvent only on successful movement; outer command pays 1000 energy and requests base cooldown 100 when Jump returns true | `Acrobatics_Dodge.AddSkill` applies +2 DV; removal clears its owned stat shifts |
| Failure/removal | Cancel, world-map/flying/body/path refusals occur before normal payment; `RemoveSkill` removes its activated ability | `RemoveSkill` removes shifts, then the component can be detached |
| UI | Shared skill tree, description, target picker, ability manager/bar and failure messages | Tree description and actor DV through the underlying stat owner |

Important narrow result: Jump returns true after the `DirectMoveTo` attempt even if that inner move returned false. The outer payment therefore does not itself prove movement. No runtime failure frequency was measured. An NPC's ability-list admission is also not proof that its later command succeeded.

A second proficiency consumer is retained: `Axe_Expertise` adds its default +2 only to the actor-side melee to-hit event when the checked skill is Axe. The concrete event is stronger evidence than its XML description, but all combat dispatch and resulting hit odds were not rerun.

## S1c NPCs, removal and persistence

Skills.AddSkill/RemoveSkill operate on their owning actor, with no universal player-only gate. Jump has explicit NPC candidate handlers; TrainingBook has an NPC bored-reading route. These establish concrete NPC support, not a claim that all 123 powers are useful to every creature.

Removal invokes before/after events and the skill's removal hook. Removing a tree automatically removes its zero-cost children; the inspected method does not recursively remove every paid dependent skill. Each retained paid skill and its real execution constraints must be considered separately.

`Skills.SkillList` is NonSerialized. Its writer writes a count, and its reader discards that count; the list is not a standalone serialization of the skill objects. The attached components and generic object load lifecycle own the rest. Generic GameObject save/read source is retained but not fully reviewed here. Spry's hook and Jump's ability ID are source state, not proof that their shifts/links survive every load failure. [Persistence/coverage register](SYSTEM_CATALOG.md) marks round trips unrun.

## S1d Exact coverage and gaps

[Source index](SOURCE_INDEX.md) points to full classes and method locations. The deep new consumers are Jump, Spry and Axe proficiency. The earlier cooking trace supplies Meal Preparation/Carbide Chef. The remaining entries are table-cataloged, with exact names/classes in [UNREAD_AND_UNKNOWN.json](private/UNREAD_AND_UNKNOWN.json). Initiatory infrastructure is retained and its purchase exclusion/teaching distinction read; all initiation sequences and order-specific powers remain outside semantic coverage.

An unusual retained branch: PowerEntry's mutation-exclusion match returns true after producing a refusal message. This is an observed source branch, not proof of an exploitable base skill; the selected XML has to reference that branch and an actual acquisition route must reach it. It remains a bounded source concern, not a blanket reliable-exclusion claim.

## Core source locators

The complete methods remain private. Line starts refer to this packet’s exports; the ledger limits each claim’s semantic scope.

| Complete source | Method line |
|---|---|
| [XRL.World.Skills.PowerEntry.cs](private/source/XRL.World.Skills.PowerEntry.cs) | 36 |
| [XRL.World.Skills.PowerEntryRequirement.cs](private/source/XRL.World.Skills.PowerEntryRequirement.cs) | 22 |
| [XRL.UI.SkillsAndPowersScreen.cs](private/source/XRL.UI.SkillsAndPowersScreen.cs) | 141 |
| [XRL.World.BeforeAddSkillEvent.cs](private/source/XRL.World.BeforeAddSkillEvent.cs) | 81 |
| [XRL.World.Parts.Skills.cs](private/source/XRL.World.Parts.Skills.cs) | 138 |
| [XRL.World.Parts.Skill.Acrobatics_Jump.cs](private/source/XRL.World.Parts.Skill.Acrobatics_Jump.cs) | 368 |
| [XRL.World.Parts.Skill.Acrobatics_Dodge.cs](private/source/XRL.World.Parts.Skill.Acrobatics_Dodge.cs) | 10 |
| [XRL.World.Conversations.Parts.WaterRitualLearnSkill.cs](private/source/XRL.World.Conversations.Parts.WaterRitualLearnSkill.cs) | 101 |
