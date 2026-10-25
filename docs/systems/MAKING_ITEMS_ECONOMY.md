# Making, items and economy: the systems map

Written 2026-10-25 (lane C1) against the working tree on `640bc884b`. Several cited
files carry uncommitted edits from other sessions (for example `craft_content_frontier.js`,
`craft_depth_domain.js`, `components/trader_component.js`), so file:line refs can drift.
Read-only survey of `src/` (imports grepped recursively, including `components/`, `data/`, `absorb_*/`). Paths are relative
to `src/` unless they start with `docs/` or `tests/`. Tags: **VERIFIED** (read in
code), **INFERRED** (follows from code but not run), **PROPOSAL** (docs only).
"Used in play" below means wired into a domain or UI path (read from code); it was
not exercised in a browser this pass. Gap codes use the prefix `MIE-` (a bare MIE-G1 already
means other things in the code), and the substitution ladder is `SUB0` to `SUB4`.

Purpose: a future agent adding a potion, recipe, material from a new world, shop or
substitution rule opens this file, picks the system, learns how flexible it is and how
to plug in. Design rules live elsewhere: [making rules](../MAKING_RULES.md) MR1-MR36,
[architecture rules](../ARCHITECTURE_RULES.md) AR1-AR16, and the PZ and TSW rounds at
the end of [CRAFTING_ENGINE.md](../CRAFTING_ENGINE.md) (rounds 8 to 12). Findings
here are not accepted decisions.

## 0. One-page orientation

There is no single "item system". There are **eight layers**, and most work touches two or three.

| # | Layer | One-line job | Files |
|---|---|---|---|
| L1 | Item templates and inventory keys | What an item is; the JSON string that identifies a stack | `items.js` |
| L2 | Tags | Presence labels with is-a parents and observer visibility | `tag_store.js` |
| L3 | Craft engine (catalogue, law, resolver, recipes) | Trait-based making with conserved mass | `craft_*.js` |
| L4 | Village crafting runtime | The only live consumer of L3 (Frontier herbs) | `crafting_frontier_runtime.js` and friends |
| L5 | Legacy item recipes | 108 `ItemRecipe` rows plus component/equipment recipes with skill and station | `crafting_recipes.js` |
| L6 | Material lineage and treatment | Provenance and history carried inside the inventory key | `material_lineage.js`, `material_treatment.js` |
| L7 | World-pack potion slices | HP Polyjuice (own engine) and LOTM doses (command DSL) | `hp_brewing_state.js`, `book_world_lotm_*.js` |
| L8 | Economy | Money, shops, trade quotes, saturation, standing, custody, escrow | `money.js`, `trade.js`, `economy_*.js`, `simulation_effects.js` |

Three rules to remember before reading further:

- **An inventory key is a canonical JSON string** (`{"id":"Oneberry"}`), and it is the identity. Anything that must travel with a stack (quality, lineage, gear work, crafted product reference) rides inside it (`items.js:255`, `material_lineage.js:18`).
- **Truth and knowledge are separate** (MR1, MR31). `craft_state.js` projections and `hp_brewing_state.js` `view()` never show unobserved truth.
- **Preview consumes nothing** (MR4). Every live path is `quote` then `stage/execute`, and a changed quote refuses (`crafting_frontier_runtime.js:119,141`; `native_trade_transaction.js:10`; `gear_workshop_domain.js:46`).

---

## 1. Item templates and inventory keys (L1)

**Use it for.** Defining a carried thing (material, consumable, equipment, book) and giving a stack its identity.

**Key API.**
- `item_templates` registry, `Item`:184, `Material`:344, `UsableItem`:512, `Equippable`:524 (`items.js`). Exports at `items.js:4697`.
- `getItem(item_data)`:1222 builds by `item_type`; `getItemFromKey(key)`:1274 decorates (heirloom, lineage, gearwork, named identity, affixes); `nativeGetItemFromKey(key)`:1308 resolves crafted products, graded keys, mixtures, plain templates.
- `Item.createInventoryKey`:255 and `getInventoryKey`:249. `getBaseValue`/`getValue`:273-290 price an item; `getItemRarity`:163.

**Data shape.** `new Material({name, description, value, tags:{...booleans}, material_type, quality, market_saturation_group, saturates_market})` (`items.js:187-199`). `tags` is a boolean map; the constructor adds `item:true`; Material adds `material:true`; UsableItem adds `usable:true` and forces `saturates_market=false` (`items.js:518`). `UsableItem.effects` holds legacy effect ids. A pack item can be as small as `{id,name,description,value,tags}` (`book_world_lotm_content.js:46`).

**Degrees of flexibility.**
- *Plain key* `{"id":X}`: any template. Stacks merge by exact key.
- *Quality key* `{"id":X,"quality":N}`: price scales `value * quality/100 * rarity multiplier` (`items.js:273`). Rarity bands: trash under 50, common to 100, uncommon under 130, rare under 160, epic under 200, legendary under 246, else mythical (`items.js:163`). For ids outside `GRADED_IDS` the loader treats a quality key as equipment, not a material (INFERRED from `main.js:7313-7330`).
- *Carrier keys*: extra fields (`lineage`, `gearwork`, `affixes`, `e2_instance`, `components`, `productFamily`) make the key a record. See L3, L6 and gear.

**Consumers today.** `item_templates` is read across most of `src` (not counted). Domain-owned keys bypass the legacy loader (`main.js:7314`, `domain_registry.js:36`).

**Maturity.** Used in play. This is the base layer.

**How to plug in a new item.**
1. Write a `{id,name,description,value,tags}` spec and register it from your pack's `registerXItems({itemTemplates, OtherItem})`, throwing on duplicates (pattern: `book_world_lotm_content.js:46-47`).
2. Give it `material_type` if legacy recipes should find it by category (L5).
3. If it should be swappable by trait, add a catalogue material row (L3, section 9).
4. If it is sold, set `value`; `saturates_market` defaults true for non-usables (L8).
5. If it needs its own key fields, add a domain with `ownsItemKey` (gotcha below).

**Gotchas.**
- A key with fields the loader does not know will not load. A domain claims such keys with `ownsItemKey` (`crafting_domain.js:46`, `material_lineage_domain.js:37`, `gear_workshop_domain.js:170`); `main.js:7314` then calls `getItemFromKey` to validate.
- Item names may not start with the group key prefix (`items.js:205`).
- `validateItemKey` requires `id` or `components`, and a valid `quality` (`gameplay_transactions.js:27`).

**Owner docs.** `docs/ARCHITECTURE_RULES.md`; `docs/RULES_INDEX.md` router.

---

## 2. Tags (L2)

**Use it for.** Labels with is-a parents ("herb" implies "plant"), kinds, and per-observer visibility.

**Key API.** `TagRegistry`:33 (`get`, `has`, `definitions`, `expand`), `tagFacts(entity, observer, options)`:100, `TagStore`:136 (`tag_store.js`). `matchesQuery(query, tagSet)` in `craft_materials.js:32` is the query evaluator.

**Data shape.** Tag definition `{id, kind, parents:[ids], revision, visible:'open'|'hidden'}` (`tag_store.js:42-48`). Item tags are a boolean map that `tagIds` accepts (`tag_store.js:19`).

**Degrees of flexibility.** Query forms: a tag id, `{all:[...]}`, `{any:[...]}`, `{not:q}`, `null` for all (`craft_materials.js:32-41`). Parents give is-a matching for free. `hidden` tags exist but only an omniscient or explicitly listing observer sees them (`tag_store.js:80-96`), for example `moonlit` (`craft_content_frontier.js:25`).

**Consumers today.** `craft_materials.js`, `mixture_rules.js`, `rule_modules.js` import it; tests in `tests/tag_store.test.js` and three others. Item boolean tags are read all over the legacy game by direct property access (not through the registry).

**Maturity.** Registry used in play by the craft engine and village rules. Item-level boolean tags are legacy and unregistered, so a trait query over `item_templates` does not work without a catalogue (see section 9).

**How to plug in.** Declare tags per catalogue (`defineCatalogue({tags:[...]})`), not globally; there is no world-wide tag registry (INFERRED: each catalogue builds its own `TagRegistry`, `craft_materials.js:59`). Reuse tag ids across catalogues so queries port.

**Gotchas.** Unknown tag in a material, family or query throws at definition time (`craft_materials.js:79,114,216`). Registries are immutable; a new tag means a new catalogue revision.

**Owner docs.** `docs/CRAFTING_ENGINE.md` (TQ section and TSW1); `docs/GENERATION_FOUNDATION_RULES_2026-10-14.md`.

---

## 3. Craft engine: catalogue, law, resolver (L3)

**Use it for.** Trait-based making where the outcome is computed from material properties and conserved mass, not looked up.

**Key API.**
- Catalogue: `defineCatalogue`:53, `validateMaterial`:146, `materialTags`:157, `generateMaterial`:164, `materialPool`:199, `pickMaterial`:223 (`craft_materials.js`).
- Law and resolver: `defineCraftLaw`:28, `resolveBatch`:113, `validateBatchProduct`:213 (`craft_resolver.js`).
- Product registry: `PRODUCT_FAMILIES`:12, `classifyProductKey`:36, `keyForProduct`:48, `resolveProductKey`:52 (`craft_product_registry.js`).
- Owner: `createCraftState`:17, `freezeMaterials`:25, `freezeRecipe`:36, `recordProduct`:42, `observe`:53, `knowsAxis`:63, `projectProduct`:68, `projectMaterial`:80, `validateCraftState`:92 (`craft_state.js`).

**Data shape.**
- Catalogue `{id, revision, basis=1000, axes, tags, families, materials}`. Axes are `fraction` (integer per basis, summed with a derived `matrix` remainder so mass always totals basis) or `scalar` (bounded integer, mass-weighted mean); axis fields `id, kind, min, max, label, hidden` (`craft_materials.js:62`). Family adds `ranges`, `correlations`, `names`, `weight`, `phase` for seeded generation. Material `{id, revision, name, family, tags, phase, properties, weight, origin}` (`:109`).
- Law `{id, revision, catalogue, carrier, ops, reactions, outputs, tagLaws, directions?, thermal?}` (`craft_resolver.js:29`). `op` = `{id, station?, levels, converts, availability}`; `reaction` = mass-conserving `reactants -> products` with optional `catalyst` tag query, `station`, `after` op, `limit` permille; `output` = `{route, effect, axis, per, mode:'dose'|'total'|'scalar'}`; `tagLaw` derives a product tag from a threshold.
- Product (frozen): `id 'cb1:'+hash`, `law`, `catalogue`, `recipe`, `inputs [role,id,revision,qty]`, `process`, `stations`, `composition`, `mass`, `scalars`, `outputs {route:{effect:n}}`, `tags`, `carrier` (`craft_resolver.js:199-205`).

**Degrees of flexibility.**
- *Exact authored material* (`materials: [...]`) versus *seeded family* (`generateMaterial`, same root/scope/index gives same material, frozen on first sight, GR3).
- *Reactions*: unconditional, catalyst-gated, station-gated, post-op, partial (`limit`).
- *Directional order* (`directions`, layered law): the order materials are added changes conversion (`craft_resolver.js:133-142`).
- *Thermal* (`thermal`): heat over a safe budget turns a fraction into impurity (`:178-185`).
- *Outputs are routes*: one product can act orally, as a coat, as a carry light, or as permanent conditioning, each with its own effect numbers.
- Free experimentation: any 1 to 999-unit mix of valid materials resolves to some product; there is no "invalid recipe" (MR6). Product with no oral output at the floor is a labelled rough batch and the lots are spent (`crafting_frontier_runtime.js:107-108`).

**Consumers today (VERIFIED by import grep).** Engine files are imported by: `craft_content_frontier.js`, `crafting_frontier_runtime.js`, `craft_state.js`, `slake_bench_start_content.js` (a second content pack, resolves one batch at definition time, `slake_bench_start_content.js:25`), `craft_experiment_log.js`, `craft_sources.js`. Tests: `tests/craft_engine.test.js` and 5 others.

**Maturity.** Used in play for one world: Frontier herbs in Village (via L4). Second pack (slake bench) is opt-in start content. No other world has a catalogue.

**How to plug in a new world's materials and laws.**
1. Write a content file like `craft_content_frontier.js`: tags, axes, families or authored materials, one `defineCraftLaw` (ops, reactions, outputs, tagLaws). Data only; the engine never names an ingredient (`craft_content_frontier.js:1-3`).
2. Bump `revision` instead of editing a shipped law; old products keep their law revision (MR30, `validateBatchProduct`).
3. Put the catalogue and every law revision in the `validateCraftState({catalogues, laws})` call. Today that call is hard-wired to the frontier set in `crafting_frontier_runtime.js:43`, so a new world needs that function generalised (MIE-G3).
4. Add a carrier id (`law.carrier`) and register the carrier template in `registerCraftingCarriers` (`crafting_native_items.js:21`).
5. Add a runtime like `crafting_frontier_runtime.js` (`quote`, `stage`, `project`) or reuse it once generalised, and register a domain (see section 4).
6. Prove determinism and save/reload/import per MR34 and MR36.

**Gotchas.**
- Integer math only; any arithmetic leaving the safe range throws (`craft_resolver.js:20`). A batch that does not conserve mass throws (`:187`).
- Two revisions of one material in one batch throw (`:104`). One batch has at most 12 process steps and 999 of any input.
- `freezeMaterials` rejects a later different value for the same id (`craft_state.js:31`); authored materials are never stored in the save (`:29`).
- Lot **quality is ignored by the resolver**: `batchRequest` passes only `{material, qty}` (`crafting_frontier_runtime.js:111`), although gathered keys carry `quality` 0-100 (`:19,27`). See MIE-G4.
- Laws read hidden axes (`glow`) even when the player cannot see them (MR1).

**Owner docs.** [CRAFTING_ENGINE.md](../CRAFTING_ENGINE.md); [PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md](../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md); [GENERATION_FOUNDATION_RULES_2026-10-14.md](../GENERATION_FOUNDATION_RULES_2026-10-14.md); MR1-MR36.

---

## 4. Village crafting runtime (L4), the live L3 consumer

**Use it for.** The one playable path from gathering to drinking: harvest, free-form batch, treatment, use, dose tolerance, failure ledger.

**Key API.** `quoteCrafting`:119, `stageCrafting`:141, `projectCrafting`:95, `validateOwner`:40, `validateCraftingEnvelope`:83, `materialKey`:19, `materialFromKey`:24, `craftedExposure`:48, `overdoseExposure`:58, `bindingExposure`:65, `shortenPoison`:72, `roughBatch`:108 (`crafting_frontier_runtime.js`). Domain wiring: `commitCraftingQuote` and `registerDomain({id:'crafting'})` in `crafting_domain.js:21,45`. Carriers: `crafting_native_items.js:5,21`.

**Data shape.** Save slices: `crafting` (craft owner, schema 1, scope `{world, life}`), `craftDepth` (`family 'craft.depth@1'`: dose ledger, experiment log, optional body treatment), `craftLedger` (`craft.failures@1`) (`craft_depth_domain.js:9,21`, `craft_ledger_domain.js:22`). Request types: `harvest`, `craft` (with `layered`, `tablet`), `treatment`, `use` (`crafting_frontier_runtime.js:123-136`). Inputs are `{key, qty}` of carried gathered-herb keys.

**Degrees of flexibility.** Free-form inputs (up to 12 lots), choice of process list, three laws (`frontierBrewLaw`, `frontierLayeredLaw`, `frontierTabletLaw`, `craft_content_frontier.js:47,140,150`). Dose rules add opposite-effect cancel pairs, tolerance with daily decay and overdose as a cost, never a refusal (`craft_dose_rules.js:20-90`, `craft_content_frontier.js:128`). Experiment log lets the player deduce hidden axes (`craft_experiment_log.js:27`).

**Consumers.** `crafting_domain.js`, `craft_depth_domain.js`, `craft_ledger_domain.js`, `home_medicine.js`, `active_effects.js`, `crafting_native_items.js`.

**Maturity.** Used in play (Village only). Tests: `tests/crafting_runtime.test.js`, `tests/crafting_native_reload.test.js`, `tests/craft_depth_rules.test.js`.

**How to plug in a second pack.** You cannot yet without edits (MIE-G3). The seams to generalise: `validateOwner` (scope check `world==='base.frontier'`, `:42`), `eligibility` (Village location only, `:110`), `materialFromKey` (one carrier id and one catalogue, `:24-29`), and the single `ownsItemKey` test (`crafting_domain.js:46`).

**Gotchas.**
- Any malformed crafting key or exposure in a save fails `validateCraftingEnvelope` and refuses the whole save (`:83-93`). Crafted `active_effects` carry a `craftExposure` mark that must re-derive byte-identically (`validateCraftedExposure`:75).
- The crafting owner is absent on old saves and created on first use (MR33, `craft_state.js:4-5`).
- Commit uses `beginNativeCraftTransaction` rollback over item owners, effects, ledger, depth and standing (`crafting_domain.js:24`).
- `craft_dose_rules.js:5-6` says "not wired into live gameplay yet" but `crafting_frontier_runtime.js:10` and `craft_depth_domain.js:6` do import it; the comment is stale (VERIFIED).

**Owner docs.** [CRAFTING_ENGINE.md](../CRAFTING_ENGINE.md), `docs/PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md`.

---

## 5. Recipes, slots and substitution (the swappable-ingredient layer)

Three separate recipe systems exist. Pick by how flexible the swap must be.

### 5a. Craft-engine recipe grammar (`craft_recipes.js`)

**Use it for.** A named, learnable recipe whose slots accept any material that fits a trait query.

**Key API.** `defineRecipe`:36, `selectorMatches`:64, `matchRecipe`:79, `generateRecipe`:125 (`craft_recipes.js`).

**Data shape.** `{id, revision, name, law, station, slots:[{id, role, select, qty:[min,max]}], process:[{op, levels}], origin}`; 1 to 8 slots; roles `base, active, solvent, binder, catalyst, additive` (`:13,37-48`). A selector has exactly one of `material`, `tags`, `property:{axis,min,max}`, `all:[selectors]` (`:22-34`).

**Degrees of flexibility (substitution ladder).**

| Degree | Selector | Meaning in play | Verified |
|---|---|---|---|
| SUB0 exact | `{material:id}` | Only that item | `craft_recipes.js:65` |
| SUB1 tag | `{tags:'herb'}` or `{tags:{all/any/not}}` | Any material whose expanded tags match; is-a parents count | `:66` |
| SUB2 property | `{property:{axis, min, max}}` | Any material with enough (or little enough) of a trait. Fraction axes compare permille, scalars compare raw. If the maker has not observed the axis the answer is `unknown`, not no | `:67-72` |
| SUB3 compound | `{all:[SUB1, SUB2...]}` | Tag AND threshold. Any `no` fails, any `unknown` makes the match unconfirmed | `:73-74` |
| SUB4 catalyst | `role:'catalyst'` | Present but not consumed; a lot's role must equal the slot's catalyst-ness | `:82`; retained, not debited: `craft_resolver.js:207-208` |

`matchRecipe` returns `{ok, assignment, unknown, problems}` with named reasons ("no input fits", "extra inputs", "step n differs") shared by UI and NPCs (`:79-118`). This matcher remains yes/no/unknown. The later `craft_material_fit.js` grades authored property targets behind a tag query; its native rendering consumer changes actual source quantities (TSW12–14). It does not yet grade a whole formula or its potency/risk.

**Consumers today.** `defineRecipe` is called once in content (`craft_reference_content.js:11`, `SALT_STEEP`) and in `craft_state.js` validation. `matchRecipe` and `generateRecipe` have **no live caller** (grep over `src` finds none outside their own file). The live Village path does not use recipes at all; it takes free-form inputs (section 4).

**Maturity.** Tested only: `tests/craft_engine.test.js`, `tests/craft_reference.test.js`.

**How to plug in.**
1. `defineRecipe(catalogue, spec)` with `law: law.ref`.
2. Freeze it into the owner with `freezeRecipe(state, recipe, witness)`; later changes throw (`craft_state.js:36-41`).
3. For a world's secret recipe, define a grammar like `tonicGrammar` (`craft_content_frontier.js:90`) and call `generateRecipe(law, grammar, {root, scope, index})`; it re-rolls up to 12 times until a witness batch gives positive output on the route, else uses the authored fallback (`craft_recipes.js:161-168`).
4. Resolve the matched assignment by calling `resolveBatch` yourself with `{recipe:{ref}}`.

**Gotchas.** Recipes name a `law` ref; `validateCraftState` requires that law in the supplied map (`craft_state.js:98-101`). Max 8 slots.

### 5b. References: how a recipe is known (`craft_reference.js`)

**Use it for.** Books, slates and teachers that grant a recipe, a skill, or a one-time lesson.

**Key API.** `defineReference`:25, `registerReference`:37, `recipeAccess`:49, `canUseRecipe`:61, `learnFromReference`:63, `readTraining`:75, `examineQuote`:90, `examine`:94.

**Data shape.** `{id, kind, mode:'access'|'learn'|'training', recipe?, grant?}`. `access` supplies the recipe while the item is held; `learn` teaches and consumes it; `training` grants skill or attribute points once per actor (`craft_reference.js:15-35`). Losing a reference removes access only; learned recipes stay (`:8`).

**Consumers today.** None in `src` except content (`craft_reference_content.js:20` defines three Village references; `crafting_native_items.js:5-10` turns their keys into carried items). The `access`, `learn` and `training` functions are called only by `tests/craft_reference.test.js` (VERIFIED by grep). A carried Village method book currently grants nothing in play.

**Maturity.** Tested only; items exist in the game but their effect is not wired (MIE-G2).

**How to plug in.** (1) Define the recipe (5a) and freeze it; (2) `registerReference(state, spec)`; (3) add its carried item through the carrier pattern (`crafting_native_items.js:21-24`); (4) call `recipeAccess(state, actor, held)` from the quote step with `held` read from the inventory; (5) for `learn`, apply the returned `consumed` through the native transaction.

**Owner docs.** `docs/CRAFTING_ENGINE.md` (MIE-G1 reference round); MR3, MR10, MR22.

### 5c. Legacy item recipes (`crafting_recipes.js`)

**Use it for.** Ordinary game crafting with skill level, station tier, success chance and quality; also gear components.

**Key API.** `ItemRecipe`, `ComponentRecipe`, `recipes`, `find_recipe_material`:318, `get_crafting_quality_caps` (`crafting_recipes.js:2133`); `treatedRecipeQuality` (re-exported, `processed_materials.js:4`).

**Data shape.** `new ItemRecipe({name, id, materials:[{material_id|material_type|heat, count}], result:{name,count}, recipe_level:[min,max], recipe_skill, success_chance:[lo,hi], is_unlocked})`. 108 `ItemRecipe` rows (VERIFIED count).

**Degrees of flexibility.**
- `material_id`: exact template id. Ungraded: one stack. Graded ids: several quality stacks, cheapest first (`:330-344`).
- `material_type`: any held item whose `material_type` string equals it ("metal", "coal"), cheapest first (`:345-350`, example rows `:1160-1199`).
- `heat`: a fuel slot satisfied by any fuel meeting a heat grade; `quoteHeat` picks the item and explains a refusal (`:323-329`, `heat_grades.js:46`).
- Quality and success: skill and station change success chance and the quality range (`Recipe.get_success_chance`:84, `get_quality_range`:90, `crafting_recipes.js`); treatment shifts quality through `treatedRecipeQuality` (`material_treatment.js:47`).
- "Stop on material change" option (`game_options.stop_crafting_on_material_change`, `:352`).

**Consumers.** `crafting_recipes.js` is imported by `display.js`, `main.js`, `verifier.js`, `data/skills.js` (VERIFIED recursive import grep).

**Maturity.** Used in play. This is the original idle-RPG system and the widest.

**How to plug in.** Add an `ItemRecipe` in the right category table; give the material a `material_type` so existing recipes accept it; for outputs that should keep lineage, add the id to `FAMILIES` (`processed_materials.js:5`) and `GRADED_IDS` (`harvest.js:8`).

**Gotchas.** Recipe slots are strings, not tags: a new world's item only substitutes if its `material_type` string matches. Selection is "cheapest first", never best-fit.

### 5d. Exact-ingredient collections (`artifact_collection.js`)

**Use it for.** Assembly and disassembly where exact ingredients matter, compiled into the paid command system.

`compileArtifactCollection(collection)` (`artifact_collection.js:49`). Pieces and recipes name **exact item keys**; unknown references and cycles fail at load; there is no second inventory (`:1-2`). Imported by `artifact_workshop_content.js`, `artifact_workshop_host.js` and care or completion hosts (`status_care_host.js`, `book_care_host.js`, `field_care_host.js`, `world_completion_*_host.js`, `book_world_paradise_campaign_host.js`). SUB0 only, no substitution by design.

### 5e. Native-item bridge (IN REVIEW, NOT ON MASTER)

Lives in `.claude/worktrees/agent-aae6ede3f52b50209/src/native_material_catalogue.js` (untracked, with `tests/native_material_bridge.test.js`, 4 tests). It is lane A's TSW-L1 build and is not wired into gameplay (file header says so).

- `nativeCatalogue` (id `base.native`, 35 rows): `NATIVE_ITEM_IDS` maps native item ids to catalogue materials with three tag layers: physical (e.g. pelt, wood, resin, with is-a parents), functional (binder, fuel, solvent, preservative...) and symbolic proposals (vital, warding, cleansing, fiery, deathly; labelled proposals, not accepted design).
- Axes: oil, fiber, protein, resin, ash fractions plus hardness scalar.
- API: `nativeMaterialFor(itemId)`, `nativeItemsMatching(query, {min,max})` (reverse lookup by tag query and property bounds), `SYMBOLIC_PROPOSALS`, `NATIVE_TAGS`.
- Effect once merged: a craft-engine slot (5a) can select native items by trait; legacy recipes (5c) are untouched.

---

## 6. Crafted product keys, mixtures and the product registry

**Use it for.** Giving a generated product (a vial, a mixture) an inventory key that resolves to a saved record.

**Key API.** `PRODUCT_FAMILIES` (`craft_product_registry.js:12`): `village.mixtures@1` (legacy Village mixture) and `craft.batch@1` (engine batch). `classifyProductKey`:36 returns `{family, ref}` or null; a key with reserved fields (`productFamily`, `productRef`, `mixture`) and no family throws (`:45`).

**Data shape.** Batch key `{"id":carrier,"productFamily":"craft.batch@1","productRef":"cb1:..."}`; the product record lives in `owners.crafting.products` and must re-encode to the same key (`:20-31`).

**Degrees.** Two families only. The older Village mixture system (`mixture_state.js`, 4 fixed ingredients, `MIXTURE_ID`) still exists beside the engine (`mixture_state.js:7-13`).

**Consumers.** `crafting_frontier_runtime.js` imports the registry; `mixture_native.js`, `mixture_destinations.js`, `mixture_ui.js` and others use mixtures (VERIFIED grep).

**Plug in a new family.** (1) add an entry `{id, owner, accepts, ref, encode, resolve}` to `PRODUCT_FAMILIES`; (2) make the owner slice hold the records; (3) add its keys to a domain's `ownsItemKey`; (4) add a validator over the envelope.

**Owner docs.** `docs/CRAFTING_ENGINE.md` (AB1, CR6 registry); MR29-MR33.

**Maturity.** Used in play. **Gotcha:** a new product family must be added to `PRODUCT_FAMILIES` and have an owner; "a new family never adds a second key/use/save path" (`craft_product_registry.js:1-5`).

---

## 7. Material lineage, treatment and heirlooms (L6)

**Use it for.** Provenance: where a stack came from, what was done to it, when it was born, who held it. Also quality that survives splitting and merging.

**Key API (`material_lineage.js`).** `readMaterialLineage(key)`:53, `planProcessedMaterial({stock, inputs, output, process, sourceFacts, yieldRatio})`:204, `planMaterialSplit`:174, `planMaterialMerge`:183, `planHeirloomLine`:105, `passHeirloomKey`:120, `heirloomValue`:94, `heirloomText`:128. Treatment: `quoteHideTreatment`:20, `treatmentOf`:16, `treatedRecipeQuality`:47, `samePreparationQuote`:55 (`material_treatment.js`). Adapters: `harvestedMaterialOutput`, `recipeMaterialOutput`, `allocatedRecipeInputs`, `lineagePresentation` (`processed_materials.js:8,18,26,39`).

**Data shape.** Key `{"id","quality?","completeness?","lineage":{schema:'oops.processed-material', revision:1, family, facts:{born, origin_world, quality, completeness, evidence, treatment}, history:[{process_id, revision, at, world_id, parameters, inputs:[{item_key,count,facts}]}], deeds?:[{at, kind:'passed'|'deed', holder, text}]}}` (`material_lineage.js:29-68,70-86,153-168`). The key must be canonical JSON (`:25`). History at most 64 events, deeds at most 14 (`:64,74`). `treatment` is a lowercase slug (`:31`).

**Degrees of flexibility.**
- Split keeps identity; merge only merges **equal** keys, unlike cohorts stay separate (`:174-202`).
- Processing never rejuvenates: output `born` is the minimum input `born` (`:232`), output count cannot exceed input count unless a `yieldRatio` allows it (`:209`).
- `origin_world` survives only if all inputs share one (`:234`).
- Treatment is an explicit process result, never inherited (`:237`). Only two hide treatments exist: `smoked`, `oiled`, each shifting quality of named rat products (`material_treatment.js:6-13`).
- Heirlooms: passing or a recorded deed changes the key, so it plans a whole-stack swap; value grows 1 per year and 2 per recorded line, as a dial (`:94-100,105-116`).

**Consumers today (VERIFIED import grep).** `harvest.js`, `heirloom_items.js`, `heir_inheritance.js` (heir gets a `passed` line, `heir_inheritance.js:169`), `items.js`, `mistglass_path_work.js`, `material_apprentice.js`, `material_treatment.js`, `processed_materials.js`, `story_requests.js`, `material_lineage_domain.js`. Tests: `tests/material_lineage.test.js`, `tests/processed_materials.test.js` and 3 others.

**Maturity.** Used in play, but only for the rat-material chain, the portable leatherworking kit and named heirlooms.

**How to plug in a new world's item with provenance.**
1. Build the output with `planProcessedMaterial` (inputs are exact allocations; it returns the new key, the exact debit and a transaction-ready plan).
2. The carrier id must pass **both** gates: `isLineageMaterial` (the `FAMILIES` map, `processed_materials.js:5-7`) and the `GRADED_IDS` check in `getItemFromKey` (`items.js:1283-1286`, tool kit excepted). Neither accepts a new id today (MIE-G5).
3. Spend inputs and grant the output in one native transaction; the key is the record, the stack count is the quantity (`material_lineage_domain.js:11-13`).
4. For a unique named object, use the heirloom key route (`heirloom_items.js`, `story_requests.js:5`).

**Gotchas.** Lineage depth over 12 and "process ahead of the clock" throw in `validateMaterialLineageEnvelope` (`material_lineage_domain.js:15-30`), which refuses the whole save. A key may not carry both lineage and arbitrary extra fields; `readMaterialLineage` requires `quality`/`completeness` to match `facts` exactly (`:63`). `heirloomValue` defaults to 525600 minutes per year (`material_lineage.js:94`) but `heirloomText` defaults to 518400 (`:128`), and `items.js:1292` calls the text version; pass the world's year length explicitly. Do not confuse `material_treatment.js` (hide processing) with `craft_body_treatment.js` (player body conditioning from tablets).

**Owner docs.** `docs/CRAFTING_ENGINE.md` (Corc rounds and IM12); `docs/RULES_INDEX.md`.

---

## 8. Gear and workshop

**Use it for.** Worked equipment: attached material roles, heat and quench, hone, repair, affixes, salvage.

**Key API.** `quoteGearWork`:116, `validateWork`:27, `freshWork`:47, `materialProperties`:50, `workedWearProfile`:55, `coldSoakNeed`:93 (`gear_work.js`); `quoteWorkshop`:33, `executeWorkshop`:46, `quoteHide`:95, `quoteRepairer`:118, `validateWorkshopEnvelope`:148 (`gear_workshop_domain.js`); affixes `rollAffixes`:85, `createAffixes`:111, `rerollSelectedAffix`:195 (`gear_affixes.js`); loot `affixedStockEntries`:5 (`gear_acquisition.js`).

**Data shape.** Work record `{revision:1, roles:{grip|lining|coating|setting:{key,name,properties,grade}}, honedAt, finish, fit, treatment:{stage,hardness,toughness,at}, history[]}` stored as `gearwork` inside the equipment key (`gear_work.js:27-47`, `items.js:274`). World laws in `GEAR_WORK_LAWS` keyed by world id (`gear_work.js:14`). Affix count by rarity: 0 to common, up to 5 for mythical (`gear_affixes.js:29`).

**Degrees of flexibility.** Components need `material_strength` and `material_toughness` on the template, else "no modeled material properties yet" (`gear_work.js:50,126`). Over-budget builds cost handling, they are not forbidden (AD38, `:11-12`). Maker can be the player or one local craftsman for a Charcoal fee (`gear_workshop_domain.js:35-44`). Per-world affix dial `WORLD_AFFIX_DIALS` (`gear_affixes.js:32`).

**Consumers.** `gear_workshop_domain.js` registers as a domain claiming `gearwork` keys (`:170`). `gear_work.js` is imported by `gear_workshop_panel.js`, `gear_workshop_domain.js`, `items.js`, `player_attribute_definitions.js`; `gear_affixes.js` by 10 files incl. `items.js`, `main.js`, `relic_generator.js`. Tests: not enumerated.

**Maturity.** Used in play for `base.frontier` only; other worlds return "no authored workshop process yet" (`gear_work.js:119`).

**How to plug in a world.** (1) Add a `GEAR_WORK_LAWS[worldId]` row; (2) give component templates `material_strength`, `material_toughness` (and optional weight and warmth); (3) add a `WORLD_AFFIX_DIALS` entry; (4) route `configureGearWorkshop` ports (`world`, `stationTier`, `skillLevel`) for that world.

**Owner docs.** `docs/WEAPONCRAFTING_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md`; gear rules GDP1-GDP38 are cited in `gear_work.js:1` (the doc was not located this pass).

**Gotchas.** Worked gear must be equipment with components, not structured equipment (`gear_work.js:122-124`). Quote must match at execute or it throws (`gear_workshop_domain.js:48`).

---

## 9. Consumables and effects

**Use it for.** What happens when an item is used.

**Layers (pick one).**

| Layer | Where | Fits | Maturity |
|---|---|---|---|
| E1 legacy `ActiveEffect` | `active_effects.js:7`, `effect_templates` (46 `effect_templates[` lines, `:4`), `UsableItem.effects` (`items.js:515`) | Timed stat modifiers, tags, potency | Used in play |
| E2 craft exposure | `craftedExposure`:48, `overdoseExposure`:58, `bindingExposure`:65 (`crafting_frontier_runtime.js`) | Effects derived from a crafted product's outputs; revalidated from the product on load | Used in play (Village) |
| E3 structured command effects | `applySimulationEffects`:234 (`simulation_effects.js`); builders in `book_world_lotm_kit.js:8-16` | Pack commands: `item`, `resource`, `transfer`, `custody`, `fact`, `knowledge`, `energy`, `source`, `world`, `container`, `xp`, `reputation`, `relationship` (types seen at `simulation_effects.js:303-345` and the kit) | Used in play (LOTM, slake bench, many packs) |
| E4 SRD effect records | `validateEffectRecord`:129, `validateEffectPack`:163 (`effect_dsl.js`) | D&D SRD 5.2.1 spells, conditions, monsters, with licence and attribution | Tested only: `tests/effect_dsl.test.js`, no `src` importer |

**Degrees of flexibility.** E2 carries tolerance and cancel pairs (`craft_dose_rules.js`); E3 effects are paid transactions with `requires`/`costs`/`effects` and a once-claim receipt (`book_world_lotm_kit.js:19-22`); E1 is the cheapest to author.

**How to plug in a consumable.** Potion with fixed effect: `UsableItem` plus an `effect_templates` entry (E1). Potion whose effect follows its ingredients: a craft law output route (E2, section 3). Potion that changes a world's state (a dose, a flag, a resource): a command with `costs:[item(...,-1)]` and `effects:[...]` (E3), as every LOTM dose does (`book_world_lotm_causes.js:35-41`).

**Owner docs.** `docs/PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md`; `docs/CRAFTING_ENGINE.md` (PD and IX rows); `docs/ARCHITECTURE_RULES.md`.

**Gotchas.** "Holding a dose grants nothing; drinking is a separate irreversible step" is the LOTM pattern (PZ1, `book_world_lotm_content.js:25-28`). Equipped or borrowed items cannot be consumed or transferred (`simulation_effects.js:316,318,327-328`).

---

## 10. World-pack potion slices (L7): HP, LOTM, and why they differ

### 10a. HP Polyjuice (`hp_brewing_state.js`, 305 lines)

**Use it for.** Reference model of a canon formula with graded ingredients, provenance, stewing, loans, theft notice, assay.

**Key API.** `begin`:26, `settle`:49 (lazy from played clock), `resolveBrew`:93, `act`:112, `quote`:254, `commit`:258, `view`:265, `validate`:286. Slice id `hp_brewing` (`:15`). Pack data via `packNative('book.hp')` (`:8`).

**Data shape.** State `{schema, root, purse, store, lots, samples, donors, debts, notices, master, cauldron, batches, effect, condition, ledger}`. A lot `{ingredient, form, variant, route, custody, claim, truth:{provenance, stewedMinutes}, known:{...}}` (`:84-90`). Truth and known are separate on every lot.

**Degrees of flexibility.** Slot grade is `ok`, `near` or `bad`: exact ingredient and form required; stew minutes grade the lacewing slot; a provenance slot needs exact provenance; a variant with gradePermille under 1000 is `near` (`:85-91`). Whole brew grade is canon, degraded or original (`:93-100`, MR7). Cauldron wear adds a degrade step. **Substitution here is exact-id only**; there is no tag or property route.

**Consumers.** `hp_brewing_domain.js`, `hp_brewing_panel.js`. Tests: `tests/hp_brewing.test.js`.

**Maturity.** Used in play (HP slice). Does **not** import `craft_resolver.js` or the product registry (CRAFTING_ENGINE round 8, PZ-L4 queued to convert).

**Plug in.** (1) Add the ingredient to the pack's `ingredients`; (2) add or edit `formula.slots`; (3) add `variants` and `routes` (with `custody`) for how it is obtained; (4) add `outcomes`; (5) a new slot kind needs a `slotGrade` change. Pack file: `world_pack_registry.js` bundles `hpPack`.

**Owner docs.** `docs/CRAFTING_ENGINE.md` (PD rows, round 8 PZ4, PZ-L4); MR7, MR35.

### 10b. LOTM doses (`book_world_lotm_*.js`)

**Use it for.** Institutional access to prepared doses, digestion by acting, loss-of-control causes, broker trade.

**Shape.** A **pathway row** (`book_world_lotm_rows.js`) names sources, two dose keys, acts, assessor and market; `book_world_lotm_pathways.js` turns it into commands, facts and validators. "Adding a pathway is adding a row here and its two dose keys in the ids file" (`book_world_lotm_rows.js:3-4`). Causes are rows with pressure (`book_world_lotm_causes.js:11`).

**Degrees.** No brewing verb at all: doses are issued from institution stock or bought from the broker (CRAFTING_ENGINE round 8; `book_world_lotm_content.js:25-44`). Formula materials (frog, hairs, ink) are orphaned, they are sold and consumed by nothing (round 8; PZ9, PZ-L1).

**Consumers.** `book_world_lotm_actions.js`, `book_world_lotm_state.js`. Tests: `tests/lotm_broker.test.js`.

**Maturity.** Used in play (Tingen slice); brewing is proposal only (PZ-L1).

**Plug in a pathway.** (1) Add a row to `book_world_lotm_rows.js`; (2) add its two dose keys in `book_world_lotm_ids.js`; (3) register the dose items in `LOTM_ITEM_SPECIFICATIONS` (`book_world_lotm_content.js:~46`); (4) add the market lots (they follow from `row.market`, `book_world_lotm_broker.js:15`); (5) causes follow from `causeCommands(row)`. **Owner docs.** `docs/gm/LOTM_INITIATION_IMPLEMENTATION_PLAN_2026-10-15.md`; `docs/worlds/progression-gates-2026-10-23/LORD_OF_THE_MYSTERIES.md`.

### 10c. Three potion engines compared

| | Craft engine (L3/L4) | HP Polyjuice | LOTM doses |
|---|---|---|---|
| Outcome | Computed from traits | Graded vs a canon formula | Looked up (issued dose) |
| Substitution | Tag, property (recipe slots, not used live) | Exact id/form only | None |
| Free mixing | Yes (MR6) | Yes, yields "original" grade | No |
| Conservation | Mass, asserted | Lot counts | Stock and escrow asserted |
| Provenance | Frozen generated materials | Lot `truth.provenance` | Dose keys, no lineage |
| Save owner | `crafting`, `craftDepth`, `craftLedger` | `hp_brewing` | `lotm` |

---

## 11. Economy (L8): money, shops, trade, standing, custody, escrow

### 11a. Money

**Key API.** `addPurse`:34, `setPurse`:31, `moneyLedger`:56 (`economy_domain.js`); leaf `setSavedPurse`/`addSavedPurse` for save envelopes (`money.js:9-10`). Every change needs a **named source** (`money.js:5-8`).

**Data shape.** Single purse `character.money` (integer coins). Packs may rename the unit in text (LOTM reads pence, `book_world_lotm_ids.js:11-12`); the native resource key is `money` (`simulation_effects.js:308-309`, only for `actor==='player'`).

**Plug in.** Route every purse change through `addPurse(holder, amount, 'named source')`; in a pack command use `money(amount)` (`book_world_lotm_kit.js:14`). **Owner docs.** `docs/ABUSE_AND_LIMITS.md`; ECX1 and ECR16 are cited in `money.js:1`.

**Maturity.** Used in play; `economy_domain.js` is imported by `trade.js`, `main.js`, `lineage_domain.js`, `aging_contact_domain.js`, `life_events_domain.js`, `dojo_tower_domain.js`; 7 files call `addPurse(` (VERIFIED). **Gotcha:** one purse, no currencies. A second currency has no owner (MIE-G7).

### 11b. Shops and trade

**Key API.** `TraderComponent` (`components/trader_component.js:25`); `stageNativeTrade`:9 (`native_trade_transaction.js`); `tradeQuoteFingerprint`:7; `recoverTradeRequests` (`shop_restock.js:2`); keep-lists `changeShopLock`:8, `retainShopStock`:9 (`shop_locks.js`); `trade.js` `start_trade`:68, `readTradeQuote`:95, `accept_trade`:108.

**Data shape.** `new TraderComponent({name, trade_text, refresh_time=4, refresh_shift, inventory_template, profit_margin=3, is_unlocked, played_minute_refresh})` (`trader_component.js:27-37`). Stock templates in `data/inventory_templates.js` (`TradeItem`, `TradeItemGroup`, conditions). 6 files construct traders (VERIFIED). Pack worlds make finite shops by setting `refresh=()=>false` so stock only moves by trades (`book_world_native_base.js:89-93`).

**Degrees of flexibility.**
- *Price*: `value * quality/100 * rarity multiplier`, then trader margin, then **market saturation** by region and group tier; selling lowers price, recovery trickles back, caps at 500 sold for items and 200 for equipment (`market_saturation.js:13-20`, `items.js:273-290`). `market_saturation_group` clusters items; `saturates_market:false` opts out (UsableItem opts out, `items.js:518`).
- *Standing terms*: faction, tier and reputation change a vendor's terms (`economy_standing.js:97 standingTerms`, wired at `trade.js:20`). Credit, loans, insurance, route danger and rumours live in the same domain (`economy_standing.js:137-238`; `economy_standing_domain.js:30-45`).
- *Shop locks*: up to 16 kept keys per merchant, 64 merchants (`shop_locks.js:5,8`).

**Consumers.** Saturation: `trade.js`, `main.js`, `verifier.js`, `items.js`, `models/location.js`, `data/locations.js`. `native_trade_transaction`: `trade.js`, `main.js`. `shop_locks`: `display.js`, `shop_locks_domain.js`, `components/trader_component.js`, `absorb_p23/host_joins/world_adaptation.js`. Tests: `tests/p23-market-life.test.js`, `tests/shop_locks.test.js`, `tests/acquisition.test.js`.

**Maturity.** Used in play.

**How to plug in a shop.** Create a `TraderComponent`, register in `inventories.trader` and `availabilities.trader` (pattern `book_world_native_base.js:89-93`), pick an `inventory_template` or fixed stock, set `profit_margin`, and make any new item key readable by `getItemFromKey`.

**Gotchas.** The quote fingerprint includes price inputs and both owners' counts; any change before accept throws "Trade quote changed" (`native_trade_transaction.js:10`). Debits are validated against initial ownership, so selling cannot fund a buy in the same command (`acquisition.js:35-37`). A trade needs `money + sellValue - buyDebit >= 0` and all numbers safe integers (`:12-15`). Keys must pass `validateItemKey` (`acquisition.js:11`).

### 11c. Custody and loans

**Key API.** The `custody` effect in `applySimulationEffects` (`simulation_effects.js:325-337`).

**Data shape.** `{type:'custody', from, to, key, count, loanId}` records `s.custody[loanId] = {owner, holder, key, count, at, cause}`. A `returning:true` effect must match owner, holder, key and count exactly (`:331`).

**Degrees.** While borrowed, the holder cannot consume or transfer the item unless an effect sets `breakCustody` (`:316,328`). Both parties must be in the same world (`:326`). Equipped items must be unequipped first (`:327`).

**Consumers.** 10 files by grep, including `exchange_content.js`, `world_completion_lens_content.js`, `feature_expansion_objects.js`. HP has its own loan and theft logic (`hp_brewing_state.js`: `debts`, `notices`, lot `custody`).

**Plug in.** (1) Write `{type:'custody', from, to, key, count, loanId}` as an effect; (2) a later `returning:true` effect with the same fields closes it; (3) set `breakCustody` only where the world's law lets the holder dispose of it. **Owner docs.** none found beyond the PZ4 loans note in `docs/CRAFTING_ENGINE.md`.

**Maturity.** Used in play.

### 11d. Escrow

**There is no engine escrow primitive.** The LOTM broker builds it from three generic parts: a `transfer` into the broker's inventory, a `resource` `book.lotm.escrow` on the broker holding the money, and flag-gated pay, verify, settle, reject commands (`book_world_lotm_broker.js:24-40`). An assertion keeps broker escrow equal to the price of open lots (`:47-52`). Barter swaps equal values by transfer. The cut is 10 percent with a one-soli floor (`:10,23`).

**Reuse:** copy the lot row shape (`{id, label, item, genuine, payment:{pence|barter}}`, `:18-22`); add rows and the commands and flags follow. Maturity: used in play, one world. Other worlds restate it (MIE-G6).

**Owner docs.** `docs/gm/LOTM_INITIATION_IMPLEMENTATION_PLAN_2026-10-15.md`; `docs/worlds/progression-gates-2026-10-23/LORD_OF_THE_MYSTERIES.md` (LMG rows); the broker header names implementation map C5/E3.

---

## 12. Quality, spoilage, gates, lineage of beings

**Quality.** Integer `quality` on the key (graded ids: 10 to 150 in steps of 5, `harvest.js:38`); legacy recipes compute ranges from skill, station tier and component quality; rarity bands and affix counts derive from quality (`items.js:163`, `gear_affixes.js:29`). The craft engine has no quality axis in resolved products (MIE-G4). HP uses grade `canon/degraded/original`.

**Spoilage and freshness.** Three unrelated mechanisms: (1) carcass freshness from specimen age over 240 minutes feeds harvest quality (`harvest.js:28`); (2) larder shelf life in place minutes for three cooked foods (`owned_place_clock.js:12`, `larderRows`:46); (3) lineage `born` ages a cohort but nothing yet reads it as rot. There is no general "decays over time" trait (MIE-G8, TSW10).

**Gates.** `defineGate`/`evaluateGate` (`progression_gates.js:34,58`): typed requirement with dial, in-world reason, at least one costed route, and a vague hint when the player lacks knowledge. Importers: `pledges.js`, `pledges_content.js`, `chain_inspector.js`, `reveal_chain.js`, `book_world_primordial_credit.js`. PZ2 proposes brew requirements as gate rows; no brew uses them yet.

**Lineage of beings (not items).** `lineage_traits.js` (loci, `breed`, `heirLine`) models genes and household heirs; `heir_inheritance.js` also passes items. Different from material lineage despite the name.

---

## 13. Common tasks: which system, which degree

| # | Task | System | Degree and entry point |
|---|---|---|---|
| 1 | Add a plain material or item | L1 | `{id,name,description,value,tags}` via pack `registerXItems` (`book_world_lotm_content.js:46`) |
| 2 | Let an item substitute for another by traits | L3 recipe slot (5a) | SUB1 tag or SUB2 property. Needs the item in a catalogue first (5e bridge, in review). Legacy only: `material_type` string (5c) |
| 3 | Let an item substitute by symbol (LOTM) | L3 + L2 | Add symbolic tag layer (TSW1, PZ33); no fit scoring exists yet (MIE-G1) |
| 4 | Add a world's potion formula, fixed outcome | L7 HP model or L3 law | HP-style data row (10a) for canon grading; craft law (section 3) for computed |
| 5 | Add a world's potion that follows its ingredients | L3 law + L4 runtime | New content file, `defineCraftLaw`, output routes. Generalise `validateOwner` first (MIE-G3) |
| 6 | Make a procedural herb or ore for a world | L3 family | `families` with `ranges`, `generateMaterial`; harvested through a `defineSourceTable` (`craft_sources.js:46`) |
| 7 | Add a gather node with regrowth | L3 sources | `defineSourceTable`, `harvest`, `gatherIdle`; node state in `craft_state.sources` |
| 8 | Give an item a provenance, or record deeds on a keepsake | L6 | `planProcessedMaterial` (carrier must be in `FAMILIES` and `GRADED_IDS`, MIE-G5); deeds via `planHeirloomLine` (whole-stack key swap), unique object via `heirloomKey` |
| 9 | Make an ingredient spoil | none general | Place larder `SHELF_LIFE` (`owned_place_clock.js:12`) or add a decay trait (MIE-G8) |
| 10 | Treat or prepare a material so later recipes read it | L6 treatment | `facts.treatment` slug; reader like `treatmentQualityShift` (`material_treatment.js:38`) |
| 11 | Quality that affects price | L1 key + L8 | `quality` on key; `getBaseValue` scales it (`items.js:273`) |
| 12 | Sell a formula or recipe | L5b reference + L8 | Reference item (`defineReference`, mode `learn`) in a `TraderComponent` stock. Reference effect is not wired live (MIE-G2); price is just `value` |
| 13 | Learn a recipe from a book, lose it with the book | L5b | `mode:'access'`; call `recipeAccess` from the quote |
| 14 | Add a shop | L8 | `TraderComponent` plus registries (`book_world_native_base.js:89`) |
| 15 | Make a shop's stock finite or fixed | L8 | `shop.refresh=()=>false`, stock set by enrollment (`book_world_native_base.js:93`) |
| 16 | Change prices by reputation or faction | L8 standing | `economy_standing.js` `FACTION_BY_REGION`, `DIALS`, `standingTerms` |
| 17 | Stop a market flooding | L8 saturation | `market_saturation_group` and `saturates_market` on the item |
| 18 | Lend an item and make the borrower unable to dump it | L8 custody | `type:'custody'` effect with `loanId` (`simulation_effects.js:325`) |
| 19 | Hold goods and money until verified | L8 escrow pattern | Broker lot rows (`book_world_lotm_broker.js:18-40`) |
| 20 | Cross-world item arrives and is inert or weakened | L2/L3 + MR14 | Directional law is PROPOSAL only (WR10, TSW5); today an imported item is just an item and is read by whatever recipe names it (MIE-G9) |
| 21 | Dose tolerance, overdose, cancel opposites | L4 dose rules | `defineDoseRules` (`craft_dose_rules.js:20`) bound to a law's effects |
| 22 | Show only what the player has learned | L3 knowledge | `observe`, `projectProduct`, `knowsAxis` (`craft_state.js:53,63,68`) |
| 23 | A brew that needs a licence, formula, bench | gates | `defineGate` rows (`progression_gates.js:34`); PZ2 proposal, no brew uses it yet |
| 24 | Equipment with attached materials and wear | gear | `GEAR_WORK_LAWS[world]`, component `material_*` properties (section 8) |
| 25 | A one-time chemical chain without a full pack | L3 law, resolved at definition | `slake_bench_start_content.js:20-25` pattern |

---

## 14. Gaps and duplicates

### Duplicates

| Code | Overlap | Evidence | Direction (proposal) |
|---|---|---|---|
| MIE-D1 | Three potion engines: craft engine, HP slice, LOTM doses | Section 10c; HP does not import the resolver (round 8, PZ-L4) | Convert HP onto the shared envelope later; do not add a fourth |
| MIE-D2 | Two Village product families: `village.mixtures@1` and `craft.batch@1` | `craft_product_registry.js:12-32` | Registry already supports both; new work uses the batch family |
| MIE-D3 | Two "recipe" notions: engine `defineRecipe` and legacy `ItemRecipe` | Sections 5a, 5c | Keep legacy for gear and skill crafting; bridge via trait catalogue, not by rewriting |
| MIE-D4 | Three "treatment" meanings: hide treatment, body treatment (tablets), gear heat treatment | `material_treatment.js`, `craft_body_treatment.js`, `gear_work.js:47` | Name clashes only; use the full file name in docs and tasks |
| MIE-D5 | Three "lineage" meanings: material provenance, gene lines, heirloom deeds | `material_lineage.js`, `lineage_traits.js`, `material_lineage.js:74` | Same caution |
| MIE-D6 | Escrow rebuilt per world (LOTM broker, HP loans and theft, custody effect) | Section 11 | Factor the lot row and escrow assertion into a kit (MIE-G6) |
| MIE-D7 | Four effect layers (section 9) | `active_effects.js`, craft exposure, structured effects, `effect_dsl.js` | Choose per consumable by the table in section 9 |

### Missing degrees and dead ends

| Code | Gap | Evidence | Related codes |
|---|---|---|---|
| MIE-G1 | Partially implemented 2026-10-25: authored trait fit changes actual native rendering input costs through `craft_material_fit.js` and `native_rendering_recipes.js`. Whole-formula matching remains yes/no/unknown; symbolic, potency, risk and residue grading remain open | [Execution and exact proof](../gm/dispatch/reference-mechanics-2026-10-25/CHECKPOINT.md); `craft_recipes.js`, `hp_brewing_state.js` | TSW3, TSW8, PZ34, TSW12–14 |
| MIE-G2 | Reference items exist but grant nothing in play: `recipeAccess`, `learnFromReference`, `readTraining` have no live caller, and `matchRecipe`/`generateRecipe` are never called live | grep over `src`; `tests/craft_reference.test.js` only | PZ4, MR3, MR10 |
| MIE-G3 | The live crafting runtime is single-world: scope must be `base.frontier`, location must be Village, one carrier, one catalogue in `validateOwner` | `crafting_frontier_runtime.js:42-43,110,24-29` | MR11, AR11, TSW11 |
| MIE-G4 | Lot quality is dropped before resolution; products have no quality axis; yield is mass-derived only | `crafting_frontier_runtime.js:19,111` | MR21 |
| MIE-G5 | Lineage carriers are a closed list: `FAMILIES` (7 ids) plus `GRADED_IDS` (6 ids); a new world's item cannot carry provenance without engine edits | `processed_materials.js:5-7`, `harvest.js:8`, `items.js:1283-1286` | TSW4, TSW10 |
| MIE-G6 | No shared escrow or lot primitive; LOTM's is world-specific and its shop, price and cut are authored proposals | `book_world_lotm_broker.js:1-6` | PZ4, PZ9 |
| MIE-G7 | One purse, one currency, native key `money` for player only | `simulation_effects.js:308-309`, `money.js:9` | Cross-world trade, WR rows |
| MIE-G8 | No general decay, freshness or container trait. Carcass freshness, three larder foods and lineage `born` do not connect | `harvest.js:28`, `owned_place_clock.js:12` | TSW10, PD5, PD6 |
| MIE-G9 | No directional cross-world compatibility law. An item from another world is read only by recipes that name it or share a `material_type` string; MR14 and WR10 are proposals | CRAFTING_ENGINE round 12 TSW5 | MR14, WR10, TSW-L4 |
| MIE-G10 | The native catalogue is on master; native rendering now reads it through real Cooking recipes. This does not yet join it to the separate Village composition runtime or establish foreign-world compatibility | `native_material_catalogue.js`, `native_rendering_recipes.js`; [bounded proof](../gm/dispatch/reference-mechanics-2026-10-25/CHECKPOINT.md) | TSW-L1, TSW6, TSW12–14 |
| MIE-G11 | No units trait: quantities are integers of "units" with no drops-versus-ml conversion | `craft_resolver.js:12`, `craft_materials.js:53` | TSW9 |
| MIE-G12 | Formula materials sold with no consumer (frog, hairs, ink) | `book_world_lotm_broker.js:19-22`; round 8 | PZ9, PZ-L3 |
| MIE-G13 | Gate engine not yet used by any brew; brew requirements are bespoke checks | `progression_gates.js` importers (section 12) | PZ2, PZ8 |
| MIE-G14 | Item tags are legacy booleans, not catalogue tags; a trait query over `item_templates` is impossible without a catalogue | `items.js:221-224`, `tag_store.js:19` | TSW1 |

### Stale comment

- `craft_dose_rules.js:5-6` says not wired live; it is imported by `crafting_frontier_runtime.js:10` and `craft_depth_domain.js:6`.
