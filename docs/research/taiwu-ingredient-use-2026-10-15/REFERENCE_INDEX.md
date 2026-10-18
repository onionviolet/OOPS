# Exact code, table and URL locator index

2026-10-15. Private material was verified ignored before placement by `.gitignore:41`, `/docs/research/*/private/`. Raw C#, full tables and localization prose are retained for local research, not proposed public assets. [Report](REPORT.md), [flow](INGREDIENT_TO_USE.md), [UI captions](UI_EVIDENCE.md).

## Receipts and complete retained sources

| File | Scope |
|---|---|
| [input-pins.json](private/input-pins.json) | Fresh input paths, byte sizes and SHA256 for backend/shared/frontend and local Steam appmanifest; appmanifest build25845203 read as metadata, no successful-launch claim |
| [fresh-extraction-receipts.json](private/fresh-extraction-receipts.json), [tool-version.json](private/tool-version.json) | Exact finite commands, exit codes, stderr and output hashes; wrong type-name attempts preserved; corrected extractions succeed; current BuildingDomain/Character/CharacterDomain/MakeSubPageMake/MakeItemType match reused bodies |
| [copied-source-receipts.json](private/copied-source-receipts.json), [reused-source-receipts.json](private/reused/reused-source-receipts.json) | Read-only prior extraction origins and copy hashes; parent receipts distinguish reused extraction from fresh jobs |
| [selected-data.json](private/selected-data.json), [MakeItemType-rows.json](private/MakeItemType-rows.json), [prepare_evidence.py](private/prepare_evidence.py) | Complete selected rows plus all183 MakeItemType rows and reproducible correct join; expressions are preserved, not evaluated game values |
| [parent table validation](private/reused/table-validation.json), [Material](private/reused/Material-rows.json), [Medicine](private/reused/Medicine-rows.json), [CraftTool](private/reused/CraftTool-rows.json), [MakeItemSubType](private/reused/MakeItemSubType-rows.json) | Complete350/441/55/314 inherited row sets and original full schemas/C#; unique IDs and constructor arity checked by parent, selected joins checked here |
| [selected-method-bodies.md](private/selected-method-bodies.md), [method-locators.json](private/method-locators.json) | Full selected methods, original source spans and body SHA256; selection is not whole-class semantic reading |
| [GlobalConfig](private/GlobalConfig.cs), [medicine effect subtype](private/Config.EMedicineEffectSubTypeExtension.cs), [CN tables](private/language/) | Full config and localization inputs. GlobalConfig231/2448 medicine attainments;2046/3393 stage factors. Localization: Material Name_140 line281; Medicine Name_275551 and Name_61123; CraftTool Name_4591; LifeSkillType Name_817; ResourceType Name_511 |
| [ui-observation-receipts.json](private/ui-observation-receipts.json), [official news body](private/taiwu-ui-news.json), [inherited image receipts](private/taiwu-image-receipts.json) | All six inspected original images, exact URLs, hashes, dimensions and source captions. The original receipts still point to the parent's paths; this lane's observation receipts point to its own copies |
| [initial-status.txt](private/initial-status.txt), [READING_RECEIPT.json](private/READING_RECEIPT.json), [HASHES.json](private/HASHES.json) | Initial dirty state, honest source/image reading coverage and final integrity manifest. No claim that unrelated working-tree changes belong to this lane |

Selected constructor locators: Material140 `reused/Config.Material.cs:1583`; MakeItemType158 `frontend/Config.MakeItemType.cs:192`, type2 line28; MakeItemSubType240 `reused/Config.MakeItemSubType.cs:284`,216 line256,2 line30; Medicine275 `reused/Config.Medicine.cs:1099`,61 line873; CraftTool45 is identified by exact row ID in selected-data.json. Complete rows retain every field, including gates and condition symbols.

Official announcement: [ConchShip #260722](https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1839041357023957). Original news API locator retained by parent: `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=838350&count=100&maxlength=0&enddate=1784937600`. No new fetch or remote availability check was needed; retained body and six local hashes were inspected directly. Image URLs use `https://clan.akamai.steamstatic.com/images/32975615/<asset>.jpg`; full individual URLs are in the observation receipts and original image links in UI_EVIDENCE.md.

## Selected exact method spans

Line numbers below refer to the retained source copies, whose hashes are in the private manifest. Full method bodies remain private. Semantic claims are limited to the selected flow and failure boundaries described in the report, not every nested branch.

| Method | Source / 1-based span |
|---|---|
| `GetMakeItemSubType` | [private/reused/ItemTemplateHelper.cs](private/reused/ItemTemplateHelper.cs) 817–846 |
| `OnSelectTarget` | [private/frontend/Game.Views.Make.MakeSubPageMake.cs](private/frontend/Game.Views.Make.MakeSubPageMake.cs) 556–572 |
| `SelectTarget` | [private/frontend/Game.Views.Make.MakeSubPageMake.cs](private/frontend/Game.Views.Make.MakeSubPageMake.cs) 593–648 |
| `GetMakeNeedAttainment` | [private/frontend/Game.Views.Make.MakeSubPageMake.cs](private/frontend/Game.Views.Make.MakeSubPageMake.cs) 667–739 |
| `SelectMaterial` | [private/frontend/Game.Views.Make.MakeSubPageMake.cs](private/frontend/Game.Views.Make.MakeSubPageMake.cs) 741–758 |
| `OnCancelTarget` | [private/frontend/Game.Views.Make.MakeSubPageMake.cs](private/frontend/Game.Views.Make.MakeSubPageMake.cs) 650–658 |
| `OnCancelMaterial` | [private/frontend/Game.Views.Make.MakeSubPageMake.cs](private/frontend/Game.Views.Make.MakeSubPageMake.cs) 760–770 |
| `OnCancelTool` | [private/frontend/Game.Views.Make.MakeSubPageMake.cs](private/frontend/Game.Views.Make.MakeSubPageMake.cs) 798–802 |
| `RefreshMaterialList` | [private/frontend/Game.Views.Make.MakeSubPageMake.cs](private/frontend/Game.Views.Make.MakeSubPageMake.cs) 1155–1254 |
| `ResetResourceCount` | [private/frontend/Game.Views.Make.MakeSubPageMake.cs](private/frontend/Game.Views.Make.MakeSubPageMake.cs) 1458–1498 |
| `RefreshResourcePanel` | [private/frontend/Game.Views.Make.MakeSubPageMake.cs](private/frontend/Game.Views.Make.MakeSubPageMake.cs) 1519–1555 |
| `InitMakeCount` | [private/frontend/Game.Views.Make.MakeSubPageMake.cs](private/frontend/Game.Views.Make.MakeSubPageMake.cs) 1557–1565 |
| `OnMakeCountChanged` | [private/frontend/Game.Views.Make.MakeSubPageMake.cs](private/frontend/Game.Views.Make.MakeSubPageMake.cs) 1597–1601 |
| `CheckCondition` | [private/frontend/Game.Views.Make.MakeSubPageMake.cs](private/frontend/Game.Views.Make.MakeSubPageMake.cs) 1656–1672 |
| `CheckTool` | [private/frontend/Game.Views.Make.MakeSubPageMake.cs](private/frontend/Game.Views.Make.MakeSubPageMake.cs) 1768–1848 |
| `RefreshButtonConfirm` | [private/frontend/Game.Views.Make.MakeSubPageMake.cs](private/frontend/Game.Views.Make.MakeSubPageMake.cs) 1850–1885 |
| `OnClickButtonConfirm` | [private/frontend/Game.Views.Make.MakeSubPageMake.cs](private/frontend/Game.Views.Make.MakeSubPageMake.cs) 1887–1972 |
| `StartMakeItem` | [private/reused/BuildingDomain.cs](private/reused/BuildingDomain.cs) 8156–8216 |
| `CheckMakeCondition` | [private/reused/BuildingDomain.cs](private/reused/BuildingDomain.cs) 8219–8266 |
| `GetMakeItems` | [private/reused/BuildingDomain.cs](private/reused/BuildingDomain.cs) 8279–8425 |
| `UpdateMakingProgressOnMonthChange` | [private/reused/BuildingDomain.cs](private/reused/BuildingDomain.cs) 8434–8448 |
| `GetMakeResult` | [private/reused/BuildingDomain.cs](private/reused/BuildingDomain.cs) 8451–8473 |
| `GetMakeResultStageArray` | [private/reused/BuildingDomain.cs](private/reused/BuildingDomain.cs) 8475–8548 |
| `GetLifeSkillTotalAttainment` | [private/reused/BuildingDomain.cs](private/reused/BuildingDomain.cs) 9401–9431 |
| `GetLifeSkillTotalAttainment` | [private/reused/BuildingDomain.cs](private/reused/BuildingDomain.cs) 9470–9486 |
| `CheckTool` | [private/reused/BuildingDomain.cs](private/reused/BuildingDomain.cs) 9433–9450 |
| `GetMaterialGradeAndAttainment` | [private/reused/GameData.Domains.Building.SharedMethods.cs](private/reused/GameData.Domains.Building.SharedMethods.cs) 20–70 |
| `GetHerbMaterialTempGrade` | [private/reused/GameData.Domains.Building.SharedMethods.cs](private/reused/GameData.Domains.Building.SharedMethods.cs) 123–131 |
| `GetHerbMaterialTempGrade` | [private/reused/GameData.Domains.Building.SharedMethods.cs](private/reused/GameData.Domains.Building.SharedMethods.cs) 133–147 |
| `GetMakeRequiredLifeSkillAttainment` | [private/reused/GameData.Domains.Building.SharedMethods.cs](private/reused/GameData.Domains.Building.SharedMethods.cs) 149–158 |
| `GetStageRequirementAndGrade` | [private/reused/GameData.Domains.Building.SharedMethods.cs](private/reused/GameData.Domains.Building.SharedMethods.cs) 72–90 |
| `GetFinalGradeAndId` | [private/reused/GameData.Domains.Building.SharedMethods.cs](private/reused/GameData.Domains.Building.SharedMethods.cs) 110–121 |
| `OnClickEatItem` | [private/Game.Views.ViewUsingMedicine.cs](private/Game.Views.ViewUsingMedicine.cs) 409–483 |
| `EnterSelectInjuryPart` | [private/Game.Views.ViewUsingMedicine.cs](private/Game.Views.ViewUsingMedicine.cs) 485–498 |
| `QuickHide` | [private/Game.Views.ViewUsingMedicine.cs](private/Game.Views.ViewUsingMedicine.cs) 199–209 |
| `TryRequestAddEatingItems` | [private/EatingUtils.cs](private/EatingUtils.cs) 14–55 |
| `DoRequestAddEatingItems` | [private/EatingUtils.cs](private/EatingUtils.cs) 57–70 |
| `CheckMedicineItemIsLocked` | [private/Game.Components.Character.Injury.cs](private/Game.Components.Character.Injury.cs) 588–710 |
| `IsRecoverInnerOuterMedicineCanUse` | [private/Game.Components.Character.Injury.cs](private/Game.Components.Character.Injury.cs) 524–586 |
| `CheckEatItemIsLocked` | [private/Game.Components.Character.Injury.cs](private/Game.Components.Character.Injury.cs) 712–731 |
| `CheckEatSlot` | [private/Game.Components.Character.Injury.cs](private/Game.Components.Character.Injury.cs) 733–801 |
| `AddEatingItem` | [private/reused/CharacterDomain.cs](private/reused/CharacterDomain.cs) 16058–16063 |
| `AddEatingItem` | [private/reused/Character.cs](private/reused/Character.cs) 6810–6878 |
| `AddEatingItemWithoutInstantEffects` | [private/reused/Character.cs](private/reused/Character.cs) 6974–7030 |
| `ApplyEatingItemInstantEffects` | [private/reused/Character.cs](private/reused/Character.cs) 6880–6972 |
| `CalcPropertyModify` | [private/reused/Character.cs](private/reused/Character.cs) 5908–5937 |
| `CalcHitValues` | [private/reused/Character.cs](private/reused/Character.cs) 1134–1205 |
| `ApplyMedicineInstantEffect` | [private/reused/Character.cs](private/reused/Character.cs) 7359–7419 |
| `CalcMedicineEffect_RecoverInjury` | [private/reused/Character.cs](private/reused/Character.cs) 7536–7575 |
| `CalcMedicineEffect_RecoverInjury` | [private/reused/Character.cs](private/reused/Character.cs) 7577–7584 |
| `OfflineUpdateEatingItems` | [private/reused/Character.cs](private/reused/Character.cs) 13321–13328 |
| `GetCharacterPropertyBonus` | [private/reused/EatingItemsHelper.cs](private/reused/EatingItemsHelper.cs) 96–164 |
| `ChangeDuration` | [private/reused/EatingItemsHelper.cs](private/reused/EatingItemsHelper.cs) 57–79 |
| `ChangeDuration` | [private/reused/EatingItemsHelper.cs](private/reused/EatingItemsHelper.cs) 81–94 |
| `GetCharacterPropertyBonusValue` | [private/reused/GameData.Domains.Item.Medicine.cs](private/reused/GameData.Domains.Item.Medicine.cs) 699–702 |
| `GetCharacterPropertyBonusPercentage` | [private/reused/GameData.Domains.Item.Medicine.cs](private/reused/GameData.Domains.Item.Medicine.cs) 704–707 |
| `GetCharacterPropertyBonusValue` | [private/reused/Config.MedicineItem.cs](private/reused/Config.MedicineItem.cs) 549–556 |
| `GetCharacterPropertyBonusInt` | [private/reused/Config.MedicineItem.cs](private/reused/Config.MedicineItem.cs) 508–542 |
| `GetCharacterPropertyBonusPercentage` | [private/reused/Config.MedicineItem.cs](private/reused/Config.MedicineItem.cs) 558–571 |
| `UpdateDurations` | [private/GameData.Domains.Character.EatingItems.cs](private/GameData.Domains.Character.EatingItems.cs) 213–253 |
| `OperateType` | [private/Config.EMedicineEffectSubTypeExtension.cs](private/Config.EMedicineEffectSubTypeExtension.cs) 15–45 |
| `IsValue` | [private/Config.EMedicineEffectSubTypeExtension.cs](private/Config.EMedicineEffectSubTypeExtension.cs) 54–57 |
| `IsPercentage` | [private/Config.EMedicineEffectSubTypeExtension.cs](private/Config.EMedicineEffectSubTypeExtension.cs) 48–51 |

## Prior owners reused

[Prior Taiwu trace](../procedural-crafting-ui-2026-10-15/TAIWU_CRAFTING_TRACE.md), [source index](../procedural-crafting-ui-2026-10-15/REFERENCE_INDEX.md), [original Taiwu tooling](../scroll-of-taiwu/TOOLING.md), [aspects tooling](../scroll-of-taiwu/aspects-2026-10-14/TOOLING.md). Existing `/Users/weiwei/.codex/research/taiwu/ui-deep-2026-10-15/` frontend extracts were read/copy-hashed; this lane did not operate its old test payload/bottle, processes or logs. No inherited launch evidence is promoted to a native test by this task.
