# Three further systems by payoff

These started outside the five named questions. This is a bounded source read, not a new required feature list. Sources relative to installed Java root.

## D1: Practical object research

`media/lua/shared/TimedActions/ISResearchRecipe.lua` validates light and item possession, reports too dark, and builds duration from the highest researchable recipe skill/time plus day-length conversion. Fast/Slow Learner change study time; reading glasses and a held magnifier can shorten it. Completion calls the item's `researchRecipes` and syncs recipe fields, while the server constructs learned-recipe feedback. Stopping resets item progress. The Lua does not consume the studied object here. The Java researchability evaluator was not decompiled, so uncertain hypotheses, failed experiments and revision are not demonstrated.

Proposal for P03/P04 owners: one naturally acquired specimen can teach the existing useful method under explicit light/tool/skill conditions. Reuse current knowledge storage and prove application. Do not label it RT evidence revision merely because its action is called research.

## D2: Fluid transfer is a paid partial action

`media/lua/shared/Fluids/ISFluidTransferAction.lua` validates both container wrappers and Java `CanTransfer`. It stores initial source volume. Outside client simulation, update computes the target remainder from progress and transfers only the amount still owed, then syncs both sides. Complete transfers the residual amount to the requested target, rather than blindly applying the whole amount again. Time depends on liters; metabolism depends on volume. Stop stops sound and delegates queue reset. The Java mixture/contamination rules and concurrent-source mutation were not traced.

Proposal for chain owners: if a transfer earns partial progress, retain moved volume or reserve the paid lot with the current owner. A completion callback must not pay the whole transfer again. Keep abort/refund semantics specific to the action, because this donor already transfers during progress.

## D3: Seasonal foraging definitions

`media/lua/shared/Foraging/forageSystem.lua` exposes item/category/zone/occupation/trait definitions and imports them into loot tables. `generateLootTable`, month tracking, `getMonthMulti`, `getWeatherBonus` and `getWeatherMulti` are separate readers for seasonal and local environment context. The header explains how authors register items and categories. This pass read the registry, monthly build and named weather readers, not every loot definition, icon spawn or discovery UI.

Proposal for WANDERING_ZONES_AND_INSIGHT and ENGINE_AUTHORING: use one existing local resource's actual season/site conditions as disclosed evidence. Do not import the donor's loot catalogue or infer a universal ecology simulation. This is a useful authoring comparison after the current practical slice, not a new blocker for P01.
