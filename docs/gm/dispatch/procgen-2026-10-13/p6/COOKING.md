# Cooking and meals (X2)

Status: PROPOSAL ONLY. Accepted food direction governs every candidate: useful benefits, comfortable ordinary unfed play, no hunger death. Famine's passive underfed progression remains its separate owner; cooking must not force-feed that route. `src/crafting_recipes.js:1634-1704` declares fixed meals, `src/active_effects.js:114-132,222-268` fixed food buffs; `src/absorb_e1/pacing.js:20-35,54-65` has default-off optional fullness and duration-derived nutrition. [Audit F8](LIVE_AUDIT.md). Missing: generated food payload, serving accounting and food-specific process/discovery law.

## Product law and axes

| Axis | Proposed contract |
|---|---|
| Logic | L1 edible composition, preparation and dose; L2 layers/course structure only where consumed; L4 ritual/donor identity only in an applicable world. Food is not automatically an oral potion. |
| Inputs | Exact actual edible lots, water/fat/seasoning roles, vessel, fuel, selected serving count and supported body. Poisonous/inedible constituents never become edible because the UI calls the output a meal. |
| Process | Chop/mix/roast/stew are finite ordered laws. Cooking changes declared availability/texture/yield and waste. Preserve contaminants; do not add arbitrary ignorance danger rolls. Initial ordinary slice uses known edible inputs and no spoilage subsystem. |
| Skill | Cooking control changes consistency, yield or supported preparation range; hospitality/presentation can be separate later. Skill cannot replace ingredients or bypass body applicability. |
| Knowledge | Observed taste/texture, tested benefit and copied recipe are distinct. Learning a meal does not automatically assay all ingredient fractions. Preview uses known values and honest uncertainty. |

Generated: actual dish composition, servings and bounded food benefit/duration under an original law. Authored: edible families, finite process responses, food stacking, body response and preparation verbs. Real consumer: stamina recovery before optional work, or an actual hospitality delivery. Cooking is useful because different meals suit preparation, not because enemies/economy require continuous feeding. Preserve current meal options.

## Idle and persistence

Repeat a saved method with player-selected stock/reserve policy; stop on shortage or changed eligibility, return apparatus, and account each serving. Queued cooking advances eligible played time without repeated clicks. No auto-eat by default. If selected later, auto-eat must respect reserve/unknown-item policy and deliberate underfed training. Sleep/travel effect duration follows explicit native food policy; initial closed-browser production is deferred.

Save composition/servings, food payload and law revision, timed exposures, method constraints, exact job inputs and stock. Reuse P2 write-before-publish and knowledge principles but add a food consumer and full generated-effect restore. Initial compatibility decision: retain saved optional fullness unchanged and explicitly map generated food to nourishment, or exclude the new food from fullness pending a selected nutrition rule; do not silently infer nutrition from the new buff duration. Choose before implementation.

## Book laws

- K1, HP ch8: order/heat can change a prepared product. Applying that idea to meals is original cooking design, not proof of HP food chemistry.
- K11, Soldier Book5 storage passages: preservation can follow a local clock-suspending law. Ordinary meals do not gain that property merely from being stored.
- K12, cultivation member0158: consumption at a supported cultivation stage can matter. Ordinary meal bonuses must remain separate from exceptional advancement fruit.

[Locators and evidence limits](CANON_LOCATORS.md).

## First playable slice S2-A: two meals from a shared method

At Village, buy supported original edible grain/greens/fat, adjust one ratio and choose roast versus stew. Make two dishes from one method grammar; eat a selected owned serving and observe distinct bounded native stamina-recovery profiles. Play the same ordinary work unfed as a comfortable control. Queue three batches; observe exact inputs and shortage stop. No hunger settings/defaults or Famine rework.

Acceptance, all OPEN: SOURCE validates edible admission, serving/fraction accounting, replacement/expiry and no buff-duration nutrition accident. NATIVE proves paid supplies → preparation → actual food use → recovery, plus normal unfed work and no feeding gate/death. PERSISTENCE covers remaining servings, queued stock, partial effect duration and saved optional settings through Save/reload/Export/literal-file Import. Common gates apply. Comfortable feel remains Weibao's judgment, separately OPEN.
