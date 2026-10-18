# S3 Mutations, cybernetics, item grants and borrowed bodies

These mechanisms can expose similar ability buttons while having different owners and loss rules. [Complete supplied mutation tables](private/MUTATIONS.json) and [cybernetic blueprint index](private/CYBERNETIC_BLUEPRINTS.json) are retained. The 132 mutation rows include hidden entries and morphotypes; the 91 indexed cybernetic blueprints include inherited/abstract candidates, not 91 verified usable implants.

## S3a Inherent mutation acquisition, rank and use

MutationsAPI.BuyRandomMutation defaults to four MP, checks TreatAsMutant/current points and optional confirmation, then debits only after its selected acquisition helper reports success. Ordinary selection uses the actor-seeded RandomMutationBuy stream, a configurable default of three options, existing mutation/defect exclusions and a preference for cost-two-or-more options when enough exist. Irritable Genome uses a different random route. A selection loop and variants are not arbitrary player-authored powers. No probability distribution was calculated.

`Mutations.AddMutation` distinguishes inherent entries from a temporary part already supplied by another source. It can replace the temporary component, add an inherent list entry, invoke Mutate/AfterMutate and synchronize levels. Ranked duplicates have a separate rank increment path. The mutate pool checks category/morphotype conflicts and defaults to excluding defects; the low-level add function is not itself an exhaustive recheck of every purchase condition.

Effective rank is calculated from base rank, the mutation/category statistic, explicit modifiers, rapid advancement and tracked equipment/cooking/tonic/external contributions, with caps and subclass exceptions. The base character-level cap helper is integer level/2 + 1 and CapOverride can raise it; this is not every mutation's maximum. Rank-up UI requires an inherent base rank, a levelable power, available MP and cap room. It pays one MP and changes base rank. A borrowed zero-base mutation does not become inherently trainable merely because its effective rank is positive.

The prior [cold/AI trace](../caves-of-qud/repass-2026-10-14/REPORT.md) closes a concrete inherent active mutation through eligibility, selected command, energy/cooldown, field creation and field damage/temperature consumers. It also preserves friendly-collateral veto, failed candidate/fallback and unread dispatch limits. The [body trace](../idle-social-engine-scout-2026-10-06/traces/QUD_BODY.md) separately owns extra anatomy, equipment fit and support loss. No new physical play is asserted here.

Mutation persistence explicitly writes inherent mutation names and modifier trackers, then resolves inherited components in FinalizeRead. Trackers retain source type/name, GUID and bonus. BaseMutation fields and actual ability entries are separate owners. ActivatedAbilityEntry explicitly serializes flags, identity and tokenized cooldown state. Save/load source exists; no native round trip was performed.

## S3b A fitted item grants a concrete communication action

The supplied TauHeadpiece blueprint has MutationOnEquip configured with Telepathy. Its other Quicken Mind behavior is outside this selected chain.

| Stage | Actual path |
|---|---|
| Acquire/support | A real equipped item reaches EquippedEvent. MutationOnEquip is an IActivePart with readiness checks; this class's default charge draw is zero and boot/EMP sensitivity defaults differ from other items. Configurations may override them. |
| Grant/store | ApplyBonus calls actor.Mutations.AddMutationMod with source Equipment and a retained tracker GUID; a missing compatible mutation component is instantiated at base rank zero. |
| Action | Telepathy.Mutate adds CommandTelepathy. Its command picks an explored eligible destination with LOS constraints and invokes ConversationScript.AttemptConversation on matching objects. Actual dialogue can still refuse. |
| Cost | This Telepathy handler contains no direct UseEnergy/cooldown call. Conversation/companion-order costs belong to their own consumers, which were not fully followed here. |
| Change/failure | Readiness is checked on equip/end-turn and relevant changes. Unequip/unready paths remove that exact tracker. Further holders of the same mutation or an inherent entry can keep it available. |
| Removal | Mutations.RemoveMutationMod removes the part only when neither an inherent entry nor another tracker remains. Telepathy.Unmutate removes its activated ability. |
| Persistence/UI | Item fields, actor modifier record, attached mutation and ability each have state; the shared ability UI displays the granted action. Reconciliation after interrupted save/copy is untested. |

MutationOnEquip's recheck/removal code also contains identity and copy bookkeeping. Full multi-owner migration, all disabled-power events and every possible readiness override are not proven by this chain.

## S3c Cybernetic implant to actual skill and loss

The base SingleSkillsoft2 declaration selects a power in a 51-to-150 SP pool, occupies a head-compatible cybernetic slot and costs two license points. InitChip chooses/stores a class and can derive its display name. It is an authored random-selection template, not a new class written by the player. The larger tiers and tree skillsoft use different pools/costs.

Terminal admission is normally True Kin, with a source-defined hack exception; the code also supports selecting adjacent allied eligible subjects. Availability includes current understood inventory/nearby implants, remaining licenses, duplicate-one-only tags, physical condition and real receiving body parts. Read-only inspection did not use the hack or change any system setting.

Selecting an implant leads to a body-slot screen. `CyberneticsInstallResult.TextComplete` performs the operation once: it handles incompatible equipped gear, removes/reclaims or destroys the replaced implant as tagged, removes the new item from its old context, makes it understood and calls BodyPart.Implant. BodyPart stores the actual object and sends ImplantedEvent. `CyberneticsSingleSkillsoft` then adds a missing skill, marks its dependency and increments the actor's support count. Spry, if selected by this pool, reaches the Spry consumer in [S1](SKILLS_AND_PROFICIENCIES.md); the pool's actual draw was not executed.

Unimplant sends UnimplantedEvent, changes the support count and removes a dependent skill only when no tracked skillsoft remains. An actor who already had the skill does not acquire the dependency flag merely from this chip. Tree skillsoft iterates the tree's powers and uses the same dependency keys. Later independently learning an already borrowed skill and every mixed-support lifecycle are not covered by a full test here.

Removal screens distinguish forbidden removal, destruction-on-removal and return-to-inventory. BodyPart.Write/Read serialize the tree and actual cybernetics/equipment objects. CyberneticsBaseItem also restores context relations. The displayed success paragraph is constructed before TextComplete; source-defined text is therefore not evidence that installation completed. The result code sets its one-shot flag before a possible unequip refusal. No lossless retry/rollback guarantee follows.

The item's short-description text says True Kin compatibility, while CyberneticsBaseItem has mutant rejection-syndrome logic and the terminal has a hack exception. These are different layers, so the short sentence must not be treated as the entire legality model. In this exact export, GetCyberneticRejectionSyndromeChance computes a mutant-dependent candidate but returns zero at its final return. The inspected caller therefore does not apply rejection syndrome through that helper as written. This is version-specific source evidence, not a general promise about mods or other builds. All implant support graphs, license upgrades and security behavior remain partially read.

## S3d Borrowed body is control transfer

Domination is neither skill learning nor item ownership transfer. A valid mind/influence target goes through a mental attack; successful application installs Dominated and changes The.Game.Player.Body to the defender. The defender's existing components remain its means. Selected failed resistance still occurs after the command reaches its attack stage and consumes energy/cooldown. Early target/transit refusals can occur before that cost.

Dominated adds an End Domination action, counts duration on BeginTakeAction and reacts to death/interruption. BreakDomination removes effects and restores the source body on its normal route. Source-body destruction has exceptional metempsychosis branches. Those branches and cross-body save/load are retained but not fully audited or tested. No universal copy of the dominated body's powers into the original body is established.

## S3e Exact remaining limits

Every mutation entry, implant family and relevant class name is cataloged; concrete semantic coverage is the named chains. Sifrah options materially change several paths. The exact unread lists include most mutations, implant effects, temporary providers, all mods, per-actor NPC tactics, serializer reflection, broken-body transitions and UI-prefab events. [UI implementation](UI_IMPLEMENTATION.md) and [machine ledger](private/REVIEW_LEDGER.json) identify the inspected surface and source windows.

## Core source locators

The complete methods remain private. Line starts refer to this packet’s exports; the ledger limits each claim’s semantic scope.

| Complete source | Method line |
|---|---|
| [Qud.API.MutationsAPI.cs](private/source/Qud.API.MutationsAPI.cs) | 95 |
| [XRL.World.Parts.Mutations.cs](private/source/XRL.World.Parts.Mutations.cs) | 379 |
| [XRL.World.Parts.Mutations.cs](private/source/XRL.World.Parts.Mutations.cs) | 425 |
| [XRL.UI.CyberneticsInstallResult.cs](private/source/XRL.UI.CyberneticsInstallResult.cs) | 40 |
| [XRL.World.Parts.CyberneticsSingleSkillsoft.cs](private/source/XRL.World.Parts.CyberneticsSingleSkillsoft.cs) | 50 |
| [XRL.World.Parts.Mutation.Telepathy.cs](private/source/XRL.World.Parts.Mutation.Telepathy.cs) | 33 |
| [XRL.World.Parts.Mutation.Domination.cs](private/source/XRL.World.Parts.Mutation.Domination.cs) | 158 |
| [XRL.World.Anatomy.BodyPart.cs](private/source/XRL.World.Anatomy.BodyPart.cs) | 1649 |
