# Source inventory and receipts

Research artifact: supplied Qud 2.0.211.56. Main and installed assembly SHA256 `2cc28fba5a86221e27bfdcaa5f5a91a2e249fd474814dce7cff25a9a649b8589`. No native execution.

The new archive retains 128 nonempty complete class exports: 35 read in full, 60 read in declared windows, and 33 retained for navigation or future reading. Full-class reading is not whole-dispatch/runtime proof.

[SOURCE_LOCATORS](private/SOURCE_LOCATORS.json) gives declaration lines for every captured class. [REVIEW_LEDGER](private/REVIEW_LEDGER.json) gives exact claimed semantic windows and file hashes. [PROVENANCE](private/PROVENANCE.json), [INPUTS](private/INPUTS.json), [TOOL](private/TOOL.json), [CAPTURE_HISTORY](private/CAPTURE_HISTORY.json) and retained EXPORTS epoch receipts separate fresh exports, reused bytes, incorrect-name requests and reconstructed early metadata. First incremental per-type receipt lists were overwritten before epoch preservation was added; that limitation is explicit. Full output bytes and current hashes remain available.

The original 5437-file export path recorded on October 5 is absent now. Its historical counts are not fresh availability evidence. Live repass input and earlier targeted exports were reused. [BASE_INVENTORY](private/BASE_INVENTORY.json) fingerprints every file under that live Base directory; [TYPE_INVENTORY](private/TYPE_INVENTORY.json) inventories all non-nested classes from the retained assembly type listing, while [RELEVANT_TYPE_INVENTORY](private/RELEVANT_TYPE_INVENTORY.json) provides overlapping family indexes. These are discovery indexes, not proof that every method was read.

## Tables and text

| Archive | Scope / qualification |
|---|---|
| [Skills](private/SKILLS.json), [powers](private/POWERS.json), CSV companions | All 21 supplied skill rows and 123 child rows, with full descriptions/attributes/prerequisites/costs and XML order. Repeated class IDs stay repeated rows. |
| [Mutations](private/MUTATIONS.json) | All 132 rows from supplied Mutations.xml/HiddenMutations.xml, category attributes included; descriptions implemented by classes are not all decoded. |
| [Blueprints](private/BLUEPRINTS.json) | All 5205 object records from 14 XMLs, full child structure; no executed inheritance/mixin baking. |
| [Cybernetic index](private/CYBERNETIC_BLUEPRINTS.json) | 91 records with direct/ancestor CyberneticsBaseItem, including abstract candidates. |
| [Tinker index](private/TINKER_BLUEPRINTS.json) | 964 direct/ancestor TinkerItem records, broader than runtime buildable recipes. |
| [Achievements](private/ACHIEVEMENTS.json) | All captured static declaration initializers, including hidden flags and progress arguments; no personal achievement file read. |
| [Table coverage](private/TABLE_COVERAGE.json), data/*.tree.json | Complete selected XML trees and original bytes, with recorded derived-parse normalization. Original JSON history grammar also retained. |
| [Exact literals](private/INTERFACE_AND_CODE_LITERALS.json) | File/line/string tokens including code keys and fragments. No claim all were displayed. |
| [Unread/unknown](private/UNREAD_AND_UNKNOWN.json) | Exact skill/mutation row lists, unread types and named behavioral gaps. |

## Class index

Exact method starts are in SOURCE_LOCATORS; evidence windows are inclusive and bounded by file length. Selected-window coverage applies to the named findings, not every branch within those windows. A class below may support more than one family.

| Type / complete source | Semantic status | Declared read windows |
|---|---|---|
| [AchievementInfo](private/source/AchievementInfo.cs) | full-class-read | 1-102 |
| [AchievementManager](private/source/AchievementManager.cs) | selected-windows-read | 60-163 |
| [AchievementState](private/source/AchievementState.cs) | captured-navigation-or-unread | none |
| [HistoryKit.HistoricEntity](private/source/HistoryKit.HistoricEntity.cs) | selected-windows-read | 81-104, 274-324 |
| [HistoryKit.HistoricEvent](private/source/HistoryKit.HistoricEvent.cs) | captured-navigation-or-unread | none |
| [HistoryKit.HistoricStringExpander](private/source/HistoryKit.HistoricStringExpander.cs) | selected-windows-read | 376-420 |
| [HistoryKit.History](private/source/HistoryKit.History.cs) | selected-windows-read | 57-86 |
| [Qud.API.JournalAPI](private/source/Qud.API.JournalAPI.cs) | selected-windows-read | 105-135 |
| [Qud.API.JournalAccomplishment](private/source/Qud.API.JournalAccomplishment.cs) | captured-navigation-or-unread | none |
| [Qud.API.MutationsAPI](private/source/Qud.API.MutationsAPI.cs) | selected-windows-read | 95-127 |
| [Qud.UI.AbilityBar](private/source/Qud.UI.AbilityBar.cs) | selected-windows-read | 445-474, 550-607 |
| [Qud.UI.AbilityBarButton](private/source/Qud.UI.AbilityBarButton.cs) | selected-windows-read | 87-94 |
| [Qud.UI.AbilityManagerScreen](private/source/Qud.UI.AbilityManagerScreen.cs) | selected-windows-read | 201-238, 290-350, 425-484 |
| [Qud.UI.AchievementView](private/source/Qud.UI.AchievementView.cs) | captured-navigation-or-unread | none |
| [Qud.UI.BaseStatusScreen generic](private/source/Qud.UI.BaseStatusScreen%601.cs) | selected-windows-read | 36-42 |
| [Qud.UI.CharacterMutationLine](private/source/Qud.UI.CharacterMutationLine.cs) | captured-navigation-or-unread | none |
| [Qud.UI.CharacterStatusScreen](private/source/Qud.UI.CharacterStatusScreen.cs) | selected-windows-read | 265-325, 356-367, 421-430 |
| [Qud.UI.CyberneticsTerminalRow](private/source/Qud.UI.CyberneticsTerminalRow.cs) | selected-windows-read | 73-128 |
| [Qud.UI.CyberneticsTerminalScreen](private/source/Qud.UI.CyberneticsTerminalScreen.cs) | selected-windows-read | 121-127, 150-162, 206-252, 279-315 |
| [Qud.UI.FactionsLine](private/source/Qud.UI.FactionsLine.cs) | selected-windows-read | 105-160 |
| [Qud.UI.FactionsLineData](private/source/Qud.UI.FactionsLineData.cs) | selected-windows-read | 1-75 |
| [Qud.UI.FactionsStatusScreen](private/source/Qud.UI.FactionsStatusScreen.cs) | selected-windows-read | 152-203 |
| [Qud.UI.SkillsAndPowersLine](private/source/Qud.UI.SkillsAndPowersLine.cs) | selected-windows-read | 1-85, 100-230 |
| [Qud.UI.SkillsAndPowersStatusScreen](private/source/Qud.UI.SkillsAndPowersStatusScreen.cs) | selected-windows-read | 246-335 |
| [Qud.UI.StatusScreensScreen](private/source/Qud.UI.StatusScreensScreen.cs) | selected-windows-read | 225-247, 363-390 |
| [Qud.UI.TinkeringLine](private/source/Qud.UI.TinkeringLine.cs) | captured-navigation-or-unread | none |
| [Qud.UI.TinkeringStatusScreen](private/source/Qud.UI.TinkeringStatusScreen.cs) | selected-windows-read | 139-155, 454-500, 597-602 |
| [StatInfo](private/source/StatInfo.cs) | selected-windows-read | 1-128 |
| [XRL.Achievement](private/source/XRL.Achievement.cs) | captured-navigation-or-unread | none |
| [XRL.Annals.InitializeVillage](private/source/XRL.Annals.InitializeVillage.cs) | full-class-read | 1-140 |
| [XRL.Annals.QudHistoryFactory](private/source/XRL.Annals.QudHistoryFactory.cs) | selected-windows-read | 107-142 |
| [XRL.IBaseSkillEntry](private/source/XRL.IBaseSkillEntry.cs) | captured-navigation-or-unread | none |
| [XRL.MutationFactory](private/source/XRL.MutationFactory.cs) | captured-navigation-or-unread | none |
| [XRL.Names.NameMaker](private/source/XRL.Names.NameMaker.cs) | captured-navigation-or-unread | none |
| [XRL.Rules.RuleSettings](private/source/XRL.Rules.RuleSettings.cs) | captured-navigation-or-unread | none |
| [XRL.UI.CyberneticsInstallResult](private/source/XRL.UI.CyberneticsInstallResult.cs) | full-class-read | 1-112 |
| [XRL.UI.CyberneticsRemoveResult](private/source/XRL.UI.CyberneticsRemoveResult.cs) | captured-navigation-or-unread | none |
| [XRL.UI.CyberneticsScreenInstall](private/source/XRL.UI.CyberneticsScreenInstall.cs) | full-class-read | 1-73 |
| [XRL.UI.CyberneticsScreenInstallLocation](private/source/XRL.UI.CyberneticsScreenInstallLocation.cs) | full-class-read | 1-73 |
| [XRL.UI.CyberneticsScreenMainMenu](private/source/XRL.UI.CyberneticsScreenMainMenu.cs) | captured-navigation-or-unread | none |
| [XRL.UI.CyberneticsScreenRemove](private/source/XRL.UI.CyberneticsScreenRemove.cs) | full-class-read | 1-81 |
| [XRL.UI.CyberneticsScreenSelectSubject](private/source/XRL.UI.CyberneticsScreenSelectSubject.cs) | full-class-read | 1-36 |
| [XRL.UI.CyberneticsTerminal](private/source/XRL.UI.CyberneticsTerminal.cs) | selected-windows-read | 42-109, 481-489, 543-622 |
| [XRL.UI.SPNode](private/source/XRL.UI.SPNode.cs) | captured-navigation-or-unread | none |
| [XRL.UI.SkillsAndPowersScreen](private/source/XRL.UI.SkillsAndPowersScreen.cs) | selected-windows-read | 141-228 |
| [XRL.UI.StatusScreen](private/source/XRL.UI.StatusScreen.cs) | selected-windows-read | 583-747 |
| [XRL.UI.TinkeringScreen](private/source/XRL.UI.TinkeringScreen.cs) | selected-windows-read | 12-62, 760-880 |
| [XRL.World.Anatomy.BodyPart](private/source/XRL.World.Anatomy.BodyPart.cs) | selected-windows-read | 1613-1707, 2333-2370 |
| [XRL.World.BeforeAddSkillEvent](private/source/XRL.World.BeforeAddSkillEvent.cs) | selected-windows-read | 1-125 |
| [XRL.World.Capabilities.Cybernetics](private/source/XRL.World.Capabilities.Cybernetics.cs) | captured-navigation-or-unread | none |
| [XRL.World.Capabilities.ItemNaming](private/source/XRL.World.Capabilities.ItemNaming.cs) | selected-windows-read | 540-727 |
| [XRL.World.Conversations.ConversationDelegates](private/source/XRL.World.Conversations.ConversationDelegates.cs) | selected-windows-read | 832-836, 1221-1227 |
| [XRL.World.Conversations.Parts.IWaterRitualPart](private/source/XRL.World.Conversations.Parts.IWaterRitualPart.cs) | full-class-read | 1-120 |
| [XRL.World.Conversations.Parts.QuestHandler](private/source/XRL.World.Conversations.Parts.QuestHandler.cs) | selected-windows-read | 1-127 |
| [XRL.World.Conversations.Parts.RequireReputation](private/source/XRL.World.Conversations.Parts.RequireReputation.cs) | full-class-read | 1-81 |
| [XRL.World.Conversations.Parts.TakeItem](private/source/XRL.World.Conversations.Parts.TakeItem.cs) | selected-windows-read | 1-164 |
| [XRL.World.Conversations.Parts.WaterRitual](private/source/XRL.World.Conversations.Parts.WaterRitual.cs) | selected-windows-read | 99-160 |
| [XRL.World.Conversations.Parts.WaterRitualBegin](private/source/XRL.World.Conversations.Parts.WaterRitualBegin.cs) | full-class-read | 1-89 |
| [XRL.World.Conversations.Parts.WaterRitualJoinParty](private/source/XRL.World.Conversations.Parts.WaterRitualJoinParty.cs) | full-class-read | 1-49 |
| [XRL.World.Conversations.Parts.WaterRitualLearnSkill](private/source/XRL.World.Conversations.Parts.WaterRitualLearnSkill.cs) | full-class-read | 1-182 |
| [XRL.World.Conversations.Parts.WaterRitualTinkeringRecipe](private/source/XRL.World.Conversations.Parts.WaterRitualTinkeringRecipe.cs) | captured-navigation-or-unread | none |
| [XRL.World.DescriptionBuilder](private/source/XRL.World.DescriptionBuilder.cs) | selected-windows-read | 220-242, 356-380 |
| [XRL.World.DynamicQuestConversationHelper](private/source/XRL.World.DynamicQuestConversationHelper.cs) | captured-navigation-or-unread | none |
| [XRL.World.DynamicQuestFactory](private/source/XRL.World.DynamicQuestFactory.cs) | full-class-read | 1-24 |
| [XRL.World.DynamicQuestReward](private/source/XRL.World.DynamicQuestReward.cs) | full-class-read | 1-82 |
| [XRL.World.DynamicQuestRewardElement_Reputation](private/source/XRL.World.DynamicQuestRewardElement_Reputation.cs) | full-class-read | 1-37 |
| [XRL.World.DynamicQuestsGameState](private/source/XRL.World.DynamicQuestsGameState.cs) | selected-windows-read | 1-80 |
| [XRL.World.Effects.Dominated](private/source/XRL.World.Effects.Dominated.cs) | selected-windows-read | 62-118, 165-218 |
| [XRL.World.Faction](private/source/XRL.World.Faction.cs) | selected-windows-read | 477-523 |
| [XRL.World.FindASpecificItemDynamicQuestTemplate](private/source/XRL.World.FindASpecificItemDynamicQuestTemplate.cs) | full-class-read | 1-23 |
| [XRL.World.GameObject](private/source/XRL.World.GameObject.cs) | selected-windows-read | 429-450, 1903-1995, 2047-2172, 3048-3057, 4935-4954, 9638-9670, 18953-19036 |
| [XRL.World.Parts.ActivatedAbilities](private/source/XRL.World.Parts.ActivatedAbilities.cs) | captured-navigation-or-unread | none |
| [XRL.World.Parts.ActivatedAbilityEntry](private/source/XRL.World.Parts.ActivatedAbilityEntry.cs) | selected-windows-read | 259-286, 339-369, 539-574 |
| [XRL.World.Parts.BitLocker](private/source/XRL.World.Parts.BitLocker.cs) | captured-navigation-or-unread | none |
| [XRL.World.Parts.Body](private/source/XRL.World.Parts.Body.cs) | captured-navigation-or-unread | none |
| [XRL.World.Parts.Book](private/source/XRL.World.Parts.Book.cs) | captured-navigation-or-unread | none |
| [XRL.World.Parts.CyberneticsBaseItem](private/source/XRL.World.Parts.CyberneticsBaseItem.cs) | selected-windows-read | 53-92, 135-159, 198-250 |
| [XRL.World.Parts.CyberneticsSchemasoft](private/source/XRL.World.Parts.CyberneticsSchemasoft.cs) | captured-navigation-or-unread | none |
| [XRL.World.Parts.CyberneticsSingleSkillsoft](private/source/XRL.World.Parts.CyberneticsSingleSkillsoft.cs) | full-class-read | 1-117 |
| [XRL.World.Parts.CyberneticsStatModifier](private/source/XRL.World.Parts.CyberneticsStatModifier.cs) | full-class-read | 1-151 |
| [XRL.World.Parts.CyberneticsTreeSkillsoft](private/source/XRL.World.Parts.CyberneticsTreeSkillsoft.cs) | full-class-read | 1-173 |
| [XRL.World.Parts.DataDisk](private/source/XRL.World.Parts.DataDisk.cs) | selected-windows-read | 1-339, 437-452 |
| [XRL.World.Parts.DynamicQuestTarget](private/source/XRL.World.Parts.DynamicQuestTarget.cs) | captured-navigation-or-unread | none |
| [XRL.World.Parts.EquipStatBoost](private/source/XRL.World.Parts.EquipStatBoost.cs) | selected-windows-read | 183-204 |
| [XRL.World.Parts.EquippedAchievement](private/source/XRL.World.Parts.EquippedAchievement.cs) | full-class-read | 1-51 |
| [XRL.World.Parts.Examiner](private/source/XRL.World.Parts.Examiner.cs) | selected-windows-read | 169-257, 399-491 |
| [XRL.World.Parts.FactionRank](private/source/XRL.World.Parts.FactionRank.cs) | full-class-read | 1-98 |
| [XRL.World.Parts.MarkovBook](private/source/XRL.World.Parts.MarkovBook.cs) | selected-windows-read | 70-118 |
| [XRL.World.Parts.Mutation.BaseMutation](private/source/XRL.World.Parts.Mutation.BaseMutation.cs) | selected-windows-read | 214-449, 520-544, 576-590, 694-730 |
| [XRL.World.Parts.Mutation.Cryokinesis](private/source/XRL.World.Parts.Mutation.Cryokinesis.cs) | captured-navigation-or-unread | none |
| [XRL.World.Parts.Mutation.Domination](private/source/XRL.World.Parts.Mutation.Domination.cs) | selected-windows-read | 146-155, 178-207, 258-388 |
| [XRL.World.Parts.Mutation.Psychometry](private/source/XRL.World.Parts.Mutation.Psychometry.cs) | selected-windows-read | 148-221, 323-355 |
| [XRL.World.Parts.Mutation.Telepathy](private/source/XRL.World.Parts.Mutation.Telepathy.cs) | full-class-read | 1-103 |
| [XRL.World.Parts.MutationOnEquip](private/source/XRL.World.Parts.MutationOnEquip.cs) | full-class-read | 1-211 |
| [XRL.World.Parts.Mutations](private/source/XRL.World.Parts.Mutations.cs) | selected-windows-read | 217-272, 354-541, 663-688, 863-923 |
| [XRL.World.Parts.Skill.Acrobatics](private/source/XRL.World.Parts.Skill.Acrobatics.cs) | full-class-read | 1-9 |
| [XRL.World.Parts.Skill.Acrobatics_Dodge](private/source/XRL.World.Parts.Skill.Acrobatics_Dodge.cs) | full-class-read | 1-21 |
| [XRL.World.Parts.Skill.Acrobatics_Jump](private/source/XRL.World.Parts.Skill.Acrobatics_Jump.cs) | full-class-read | 1-561 |
| [XRL.World.Parts.Skill.Axe_Expertise](private/source/XRL.World.Parts.Skill.Axe_Expertise.cs) | full-class-read | 1-32 |
| [XRL.World.Parts.Skill.BaseSkill](private/source/XRL.World.Parts.Skill.BaseSkill.cs) | full-class-read | 1-153 |
| [XRL.World.Parts.Skill.Customs_Tactful](private/source/XRL.World.Parts.Skill.Customs_Tactful.cs) | captured-navigation-or-unread | none |
| [XRL.World.Parts.Skill.Tinkering](private/source/XRL.World.Parts.Skill.Tinkering.cs) | captured-navigation-or-unread | none |
| [XRL.World.Parts.Skill.Tinkering_Disassemble](private/source/XRL.World.Parts.Skill.Tinkering_Disassemble.cs) | captured-navigation-or-unread | none |
| [XRL.World.Parts.Skill.Tinkering_ReverseEngineer](private/source/XRL.World.Parts.Skill.Tinkering_ReverseEngineer.cs) | captured-navigation-or-unread | none |
| [XRL.World.Parts.Skill.Tinkering_Tinker1](private/source/XRL.World.Parts.Skill.Tinkering_Tinker1.cs) | captured-navigation-or-unread | none |
| [XRL.World.Parts.SkillOnEquip](private/source/XRL.World.Parts.SkillOnEquip.cs) | captured-navigation-or-unread | none |
| [XRL.World.Parts.Skills](private/source/XRL.World.Parts.Skills.cs) | full-class-read | 1-235 |
| [XRL.World.Parts.TinkerItem](private/source/XRL.World.Parts.TinkerItem.cs) | selected-windows-read | 201-258 |
| [XRL.World.Parts.TrainingBook](private/source/XRL.World.Parts.TrainingBook.cs) | selected-windows-read | 1-198 |
| [XRL.World.Parts.WaterRitualRecord](private/source/XRL.World.Parts.WaterRitualRecord.cs) | selected-windows-read | 1-95 |
| [XRL.World.Quest](private/source/XRL.World.Quest.cs) | selected-windows-read | 185-207, 244-261 |
| [XRL.World.RelicGenerator](private/source/XRL.World.RelicGenerator.cs) | selected-windows-read | 474-551, 834-865, 941-981, 1036-1090, 1520-1584 |
| [XRL.World.Reputation](private/source/XRL.World.Reputation.cs) | selected-windows-read | 17-126, 131-180, 439-510, 583-609 |
| [XRL.World.Skills.PowerEntry](private/source/XRL.World.Skills.PowerEntry.cs) | full-class-read | 1-230 |
| [XRL.World.Skills.PowerEntryRequirement](private/source/XRL.World.Skills.PowerEntryRequirement.cs) | full-class-read | 1-58 |
| [XRL.World.Skills.SkillEntry](private/source/XRL.World.Skills.SkillEntry.cs) | full-class-read | 1-57 |
| [XRL.World.Skills.SkillFactory](private/source/XRL.World.Skills.SkillFactory.cs) | selected-windows-read | 1-165 |
| [XRL.World.Tinkering.TinkerData](private/source/XRL.World.Tinkering.TinkerData.cs) | selected-windows-read | 194-255, 293-309, 350-380 |
| [XRL.World.VillageDynamicQuestContext](private/source/XRL.World.VillageDynamicQuestContext.cs) | selected-windows-read | 83-184, 272-292 |
| [XRL.World.Zone](private/source/XRL.World.Zone.cs) | selected-windows-read | 7814-7840 |
| [XRL.World.ZoneBuilderCollection](private/source/XRL.World.ZoneBuilderCollection.cs) | captured-navigation-or-unread | none |
| [XRL.World.ZoneBuilders.FindASpecificItemDynamicQuestManager](private/source/XRL.World.ZoneBuilders.FindASpecificItemDynamicQuestManager.cs) | full-class-read | 1-173 |
| [XRL.World.ZoneBuilders.FindASpecificItemDynamicQuestTemplate_FabricateQuestGiver](private/source/XRL.World.ZoneBuilders.FindASpecificItemDynamicQuestTemplate_FabricateQuestGiver.cs) | full-class-read | 1-173 |
| [XRL.World.ZoneBuilders.FindASpecificItemDynamicQuestTemplate_FabricateQuestItem](private/source/XRL.World.ZoneBuilders.FindASpecificItemDynamicQuestTemplate_FabricateQuestItem.cs) | full-class-read | 1-71 |
| [XRL.World.ZoneBuilders.Village](private/source/XRL.World.ZoneBuilders.Village.cs) | captured-navigation-or-unread | none |
| [XRL.World.ZoneBuilders.VillageBase](private/source/XRL.World.ZoneBuilders.VillageBase.cs) | captured-navigation-or-unread | none |
| [XRL.World.ZoneManager](private/source/XRL.World.ZoneManager.cs) | selected-windows-read | 296-342, 468-570, 595-614, 839-878, 3297-3345, 3438-3468, 1119-1167 |
| [XRL.XRLGame](private/source/XRL.XRLGame.cs) | selected-windows-read | 661-735, 780-860, 1795-1812, 2312-2320 |

## Reused owners

[Ingredient/cooking trace](../procedural-crafting-ui-2026-10-15/QUD_INGREDIENT_RECIPE_USE.md), [UI implementation](../procedural-crafting-ui-2026-10-15/QUD_UI_IMPLEMENTATION_NOTES.md), [other procedural systems](../procedural-crafting-ui-2026-10-15/OTHER_PROCEDURAL_ASPECTS.md), [installation](../procedural-crafting-ui-2026-10-15/INSTALLATION_AND_EXTENDED_RESEARCH.md), [original Qud report](../caves-of-qud/REPORT.md), [AI re-pass](../caves-of-qud/repass-2026-10-14/REPORT.md), [body trace](../idle-social-engine-scout-2026-10-06/traces/QUD_BODY.md) and [liquid trace](../idle-social-engine-scout-2026-10-06/traces/QUD_LIQUIDS.md) retain their source/version/native limits. The parent private archive holds complete cooking domain implementations and original UI/paper evidence; this pass does not repeat that semantic audit.
