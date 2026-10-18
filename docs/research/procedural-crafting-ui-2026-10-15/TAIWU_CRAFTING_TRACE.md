# Taiwu crafting: bounded fresh decompilation and selected consumer trace

2026-10-15, round2. Research only. The installed Windows payload was read as bytes; no game executable/assembly code was executed. Existing ILSpy11.1.0.9782 ran with the existing .NET root. Full recovered C#, normalized tables, command/exit/hash receipts and selected prior extracts are in [private/round2/taiwu](private/round2/taiwu/).

## T1: Source and exact coverage

Current `Backend/GameData.dll` SHA256`0f56b7b7bb324e95389e587b864cb9a06dc69d5859ef7f55c71aa0a05f29e1e4`; `GameData.Shared.dll` SHA256`4fa0a319209ef61af2e0b82d1d447431f5d20cad42a369388b5cf0c4fd962080`. These match the prior build25845203 dossier's pins. Matching bytes is not a launch or current Steam-version claim.

Freshly decompiled seven named classes: `Config.Material`, `Config.Medicine`, `Config.CraftTool`, `Config.CraftToolItem`, `GameData.Domains.Building.SharedMethods`, `GameData.Domains.Item.Material`, `GameData.Domains.Item.Medicine`. Each command returned0 with output and input hashes preserved. Existing BuildingDomain, item/template/eating helpers and subtype schemas were copied read-only, not overwritten. Selected bodies were read; full extraction is not semantic coverage of every method.

| Complete retained table | Rows | Constructor columns | Validation scope |
|---|---:|---:|---|
| Material | 350 | 86 | Unique IDs and argument/schema arity |
| Medicine | 441 | 83 | Same |
| CraftTool | 55 | 33 | Same |
| MakeItemSubType, reused extract | 314 | 16 | Same |

Normalized JSON preserves original C# expressions and localization references. It does not execute helpers or turn every symbol into a runtime value. `normalize_tables.py` reproduces the extraction and checks named-argument positions. Do not call1160 row records1160 verified mechanics.

## T2: A consequential negative finding

`MaterialItem` has primary/secondary medicinal-effect fields. **All350 constructor rows in the inspected default Material table set both effect types to Invalid.** Schema presence therefore does not prove an active raw-material primary/secondary medicine system. Other material stat fields and runtime modification routes are separate; this is not a claim that all materials are inert or unusable. Existing encyclopedia tables also do not replace this missing consumer proof.

Materials do carry `CraftableItemTypes`, skill/resource requirements and other properties. For example IDs140/144 have explicit crafting-type lists and skill requirements. Those references must be joined through the correct crafting-type owner; they are not automatically IDs in MakeItemSubType. No guessed cross-table join is admitted here. This is a useful contrast with the original proposal for functional substitution: Taiwu's data references alone do not establish arbitrary profile-based chemistry.

## T3: Selected end-to-end manufacturing route

Exact body locators use the private copied `BuildingDomain.cs` and freshly recovered `GameData.Domains.Building.SharedMethods.cs`.

| Stage | Read locator | Established source behavior | Boundary |
|---|---|---|---|
| Admission | BuildingDomain8219–8267, `CheckMakeCondition` | Tests scaled resources, tool cost/eligibility and skill requirement; material and selected output type contribute | Caller/preconditions and every rejection route not fully traced |
| Skill/tool composition | BuildingDomain9401–9467 | Base attainment combines with a matching tool's actual bonus, or a specific unlocked profession's empty-tool rule | A contextual combination, not universal multiplication of any skill/power |
| Domain calculation | SharedMethods20–175 | Material grade/requirement feeds result requirements. Medicine and food have distinct branches; books, selected/manual flags, perfect mode and building effects enter specific calculations | “Manual” is a code flag, not evidence of a hands-on minigame or universal active-play reward |
| Start | BuildingDomain8156–8216, `StartMakeItem` | Debits tool durability/resources/material and records selected output IDs, retained material-resource allocation, tool/material keys and remaining time | Not a reservation-only route; no cancellation/refund policy verified |
| Progress | BuildingDomain8434–8449 | Month update decrements stored work only while the building and dependencies are usable | Does not prove closed-app catch-up or literal wall-clock duration |
| Collect/useful ownership | BuildingDomain8279–8425, `GetMakeItems` | Creates selected native items, assigns equipment resource/effect data where applicable, chooses destination stock and updates relevant progression | No fresh inventory/save/runtime test; full equipment combat use not retraced here |

`GetMakeResult`/`GetMakeResultStageArray` at8451–8548 enumerate eligible result stages and resolve template IDs. The selected code asks whether the resulting template stays in a valid group. This supports a catalogue plus contextual output derivation, not unrestricted invention of arbitrary new item effects.

## T4: Medicine conversion and downstream distinctions

`ProfessionDoctorMakeMedicine` at9267–9320 constructs an input amount of `makeCount ×3`, removes the selected stock allocation, applies grade-based tool wear where a tool is supplied, creates the supported upgraded medicine and places the output into the selected inventory/warehouse route. It updates the relevant profession progression. Its initial assertion checks a different amount expression; caller validation and all malformed-request cases were not traced, so this pass makes no exploit or complete safety claim.

`ItemTemplateHelper.CanMedicineUpgrade` at1592 onward resolves configured group/grade/subtype relationships. This is a **specific conversion route**, not proof that mixing any three medicines yields a new effect. Same-purpose ingredients and finished medicines must not be conflated.

The copied `EatingItemsHelper.GetCharacterPropertyBonus` at95–145 dispatches food, medicine, tea/wine and material through different property readers. Fresh `Material.GetCharacterPropertyBonus` at713–722 reads the configured material bonus. This establishes a selected stat-reader path, not the admission, duration or every possible primary/secondary effect. Full medicine administration and therapeutic execution remain partial. Keep menu admission, template data, stat readers and observed body response separate.

## T5: Useful proposals and the next actual gaps

**Adapt:** show effective technique as base competence plus the relevant tool/building/means contribution. Explain the changed requirement or output, not merely “crafting power +20.” Keep the ordinary viable route available when a special means is absent.

**Adapt:** preserve selected inputs/process/output references through work and collection. A future notebook can distinguish “I can request this” from “I have produced and tested this.” Do not copy Taiwu's exact tuning, grade ceilings, time or input loss rules into YAIR.

**Next bounded source question:** trace one material's correct crafting-type reference through frontend candidate/filter/detail and its selected result into use. Independently trace one finished medicine's admission→effect→expiry. These are better decompilation assignments than “decompile all crafting.” Current payload and tool exist; no reinstall is needed. A native trial is still necessary for actual geometry, tooltips, cancel/return, scaled text and retention.

All gameplay/visual acceptance gates remain open. No shared source, install, library, personal save, build or prior audit was modified.
