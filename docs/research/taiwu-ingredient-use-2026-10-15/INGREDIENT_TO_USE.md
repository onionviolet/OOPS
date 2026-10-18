# Ingredient-to-use flow

2026-10-15. Static source trace and explicitly conditional arithmetic. Exact line/method references are in [the index](REFERENCE_INDEX.md); complete data is in [selected-data.json](private/selected-data.json).

## I1: identity, correct joins and two selected endpoints

```text
Material140 接骨草 (itemType5, grade1, group140, stackable)
  CraftableItemTypes [158,2]
    MakeItemType158 → MakeItemSubTypes [240,216]
      subtype240: odd, result Medicine274 / group274
        grade1 selected endpoint: Medicine275 壮骨膏
          inventory → eating slot → strength-hit stat contribution → expiry
      subtype216: main, result Medicine60 / group60
        grade4 selected endpoint: Medicine61 续骨膏
          inventory → instant use → eligible outer-injury mutation
    MakeItemType2 药霜 → subtype2 → configured Weapon3 reference
      table branch retained; downstream use not traced in this lane
```

No direct Material→MakeItemSubType join is used. Medicine template275 has group274, which `ItemTemplateHelper.GetMakeItemSubType` resolves to subtype240. Selected target61 has group60 and resolves to subtype216. Frontend `SelectTarget` sets the specific-target/manual flag, finds the containing MakeItemType and refreshes candidates. “Manual” here means choosing a specific product/subtype; these bodies establish no dexterity minigame.

Actual selected keys flow from `materialSlot.ItemData.RealKey`/`toolSlot.ItemData.RealKey`. The key layout is `(ItemType, ModificationState, TemplateId, Id)`. A **conditional unmodified stack** for the selected herb canonicalizes to `(5,0,140,0)`; source custody is separately carried by `ItemSourceType`. ID0 is a stack identity, not a measured unique harvested lot. A modified item may preserve a real ID. No live Id or custody was sampled. Created output keys are returned by native `CreateItem`; their instance IDs remain unknown here.

## I2: a concrete conditional primary route

Choose specific target **Medicine275**, Material140, one output, ordinary mode (`IsPerfect=false`), no attainment-reducing building effect. Assume sufficient building/location eligibility, positive relevant stock and a valid tool45 instance whose actual bonus is its configured30. Base medical attainment15 then gives total45. This is a hand-derived admissible reference case, not an executed character or inventory.

| Step | Selected source rule | Conditional values |
|---|---|---|
| Candidate list | Required skill8, selected custody, CraftableItemTypes contains158, target grade fits derived range; upper grade needs building capability | Herb grade1, odd240 keeps effective grade1; grade1 target is the middle stage |
| Skill stages | Medicine attainments `[10,30,60,100,150,210,280,360,450]`; stage factors `[100,150,200]`; subtype240 ExtraLifeSkill0 | Requirements30/45/60; candidate output274/275/276; total45 selects middle grade1 without the upper-stage building upgrade |
| Tool | CraftTool45 陶土药钵 supports skills8/9; configured bonus30; durability table indexed by material grade | Full configured durability120; wear4 per grade1 herb/output; actual real bonus/condition can differ |
| Resources | subtype240 ResourceTotalCount6, only material-resource axis5 has max6; material140 RequiredResourceAmount5 | Auto allocation6 on axis5; resource5 药材 debit `6×1×5=30` |
| Quantity | Frontend limits amount and affordability, updates cost on quantity change | One material140 consumed per output; no arbitrary real stock amount claimed |
| Confirm | UI constructs MakeConditionArguments using exact selected RealKeys, type158/subtype240 and flags; invokes backend check | On true, start request includes selected output list `[275]`, material/tool display objects and required resource vector |
| Start | Tool wear, resource debit, then `Taiwu.RemoveItem(material.Key,count,material.ItemSourceType,deleteItem:true)`; records keys/results/resources | Tool remains with wear; herb count decreases1; resource5 decreases30; stored LeftTime0 because subtype Time0 |
| Completion | UI immediately calls GetMakeItems; backend removes work record, creates each selected native output, routes to default destination | Creates one type8/template275 item and returned display data; inventory/warehouse destination is contextual, not assumed |
| Feedback | Async collection opens GetItem with returned ItemList and obtains fresh manufacture display data | Result screen exists in code; no native pixels or successful call observed |

Tool admission permits a last operation when remaining durability is short of the full quoted debit under its `current+oneCost>totalCost` rule. The full-durability example avoids that boundary; do not replace the source rule with “must have at least4.” Ordinary empty-tool/profession cases exist but are not required for this selected tool route.

## I3: actual primary output use

The collected item must be available through the character's inventory for the traced `CharacterDomain.AddEatingItem` route. Warehouse transfer/navigation was not exercised. `ViewUsingMedicine` renders lock reasons via Injury helpers. For275, generic positive-duration slot capacity applies; a selected unrelated treatment context can lock it. `CanUseMultiple=true` permits the count chooser when stock exceeds1, but use remains constrained by available slots. This is no unlimited-use rule.

`ViewUsingMedicine.OnClickEatItem` → `EatingUtils.TryRequestAddEatingItems` → `DoRequestAddEatingItems` obtains operation keys/counts and updates displayed stock, then sends one backend AddEatingItem per selected unit. `CharacterDomain.AddEatingItem` removes one inventory unit without deletion and calls `Character.AddEatingItem`. Medicine275 has `InstantAffect=false`, `Duration=1`, `RequiredMainAttributeType=-1`. The character places it in an eating slot with its duration and changes its owner.

The actual consumer is:

```text
Character.CalcHitValues
  → CalcPropertyModify(HitRateStrength)
    → EatingItemsHelper.GetCharacterPropertyBonus
      → Item.Medicine.GetCharacterPropertyBonusValue(275,...)
        → Config.MedicineItem.GetCharacterPropertyBonusValue
          → HitRateStrength = 120, PropertyAddValue
```

The effect-subtype extension classifies PropertyAddValue as additive rather than percentage. The helper returns that contribution within `CValueModify`; the final hit value also incorporates other character modifiers, difficulty and clamps. **120 is the configured contribution, not a tested increase in hit probability or a guarantee of a particular final combat number.** This route reaches a native character calculation rather than stopping at metadata or a tooltip.

Month-related character update calls `EatingItems.UpdateDurations`, decrements the stored duration, clears an expired key and queues item removal. Once cleared it no longer contributes through the eating helper. This is in-game duration update logic, not wall-clock expiry or proof of closed-app catch-up. Poison attachment and special-effect modifiers can alter individual behavior; no claim of a clean personal item is made.

## I4: same herb, different output and use

Specific target **Medicine61 续骨膏**, group60, chooses subtype216. Because subtype216 is the main rather than odd medicine route, grade1 herb is mapped to temporary grade4. With no building reduction/perfect modifier: base medicine attainment150, manual addition `15×(4+1)=75`; stage thresholds225/300/375 and targets60/61/62. A total-attainment300 reference case selects target61 at grade4; the top stage still has the separate building condition. The same grade1 input still determines tool wear4 with tool45; subtype216 requires8 resource portions, hence resource5 cost `8×5=40` per output. Time is again0.

Medicine61 has `InstantAffect=true`, Duration0, outer-injury recovery, threshold4, effectValue4, recoveryTimes1, and requires/spends current main-attribute type3 value30. UI admission accounts for eligible injuries, treatment restrictions, context and that attribute. The use view can enter body-part selection and forwards chosen parts. The native path calls `ApplyEatingItemInstantEffects` → `ApplyMedicineInstantEffect` → `CalcMedicineEffect_RecoverInjury` → `SetInjuries`. Without chosen parts, the helper chooses eligible nonzero outer injuries at/below threshold, prioritizing greatest eligible severity and resolving ties through the context random source. With selected parts, it mutates those parts. The amount can be modified by item/special effects; it is not a blanket cure-all.

Backend order deserves care: effect application precedes its later attribute sufficiency check/spend. UI guards are part of the supported path, but complete malformed-request protection/atomicity is not proved. Stock is removed from inventory by the domain entry; duration0 creates no enduring eating slot, unlike275. Thus two useful consumer routes share one ingredient identity while their cost, skill and use conditions remain distinct. This is static consumer closure, not two performed crafts.

## I5: boundaries that remain open

Before confirmation, cancel callbacks clear selection and refresh costs; there is no spend call in those callbacks. A failed CheckMakeCondition callback does not start the action. Start→collection has no proven rollback/retry contract. Collection has no LeftTime check; the selected zero-time products cannot demonstrate delayed progress. Work dictionaries, getters and month update remain documented separately from this frontend's immediate collection. No post-start refund, interrupted recovery, save/reload or successful native use was tested. The finite remaining questions are [Q1–Q5](REPORT.md#remaining-finite-questions).
