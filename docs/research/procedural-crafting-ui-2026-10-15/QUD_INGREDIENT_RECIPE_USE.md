# Qud: starapple to invented recipe to healing

2026-10-15. Research only. This is a static, connected trace of supplied Qud **2.0.211.56**, not a claim about an executed meal or the newest release. Main assembly SHA-256: `2cc28fba5a86221e27bfdcaa5f5a91a2e249fd474814dce7cff25a9a649b8589`, freshly verified against the prior intake. Existing read-only extracted payload was reused; no installer or game ran. [Prior Qud dossier](../caves-of-qud/REPORT.md) and [October 14 re-pass](../caves-of-qud/repass-2026-10-14/REPORT.md) remain separate owners.

All source names below resolve under [private/qud-cdda/qud](private/qud-cdda/qud/). Exact method lines are indexed in [SOURCE_LOCATORS.json](private/qud-cdda/SOURCE_LOCATORS.json). Full selected classes, original XML and normalized complete tables are retained, including 157 food definitions and all 66 cooking-domain mappings. Counts describe retained definitions, not semantic review of all 66 domains.

## QF1: One ingredient has two real routes

`ObjectBlueprints/Foods.xml`, Starapple, lines 435–442, defines a snack with thirst contribution and a preservation result of five Starapple Preserves. The preserved item is displayed as starapple jam, has one preparation charge and maps to `regenLowtier` (681–690).

| Stage | Exact native route | State consequence |
|---|---|---|
| Direct raw use | `Food.HandleEvent(InventoryActionEvent)`, command Eat | Checks movement, stomach and before-consume/eating handlers; adds water, changes the cooking counter for a snack, pays eating energy and destroys the consumed object. The raw fruit does not acquire the jam's procedural healing just because it is its source. |
| Preserve | `Campfire.PerformPreserve` | Reads `PreservableItem.Number`, multiplies by selected object count, obliterates those inputs and gives the declared result objects to the actor. One selected raw fruit nominally gives five jam objects. |
| Choose jam | `Campfire.IsValidCookingIngredient` and `GetValidCookingIngredients` | Prepared ingredients qualify; temporary ingredients need a separate allowance. Manual ingredient enumeration can include inventory, equipment and adjacent cells. Known/liquid-container checks apply to liquid candidates. |
| Attribute to a domain | `PreparedCookingIngredient.GetTypeInstance…`; `Data.xml` mapping | Jam supplies `regenLowtier`; jerky inherits `HP` from its parent definition. Domain mappings supply different lists of standalone units, triggers and actions. |

The preservation branch is a transformation into stock. Cooking the meal below immediately applies a status to the eater. It does not create a portable finished meal item awaiting a later Eat action.

## QF2: Discovery composes a trigger with an action

For a conditional example, select starapple jam plus bear jerky. Preconditions include Cooking and Gathering access, a hungry/cook-eligible player and a working campfire route. The selector allows two ingredients, or three with Spicer. It does not require Carbide Chef merely to cook an experimental combination.

`Campfire.GenerateEffectFromTypeList` permutes selected domains and includes a standalone-unit alternative. A compatible ordered pair can take its trigger from one domain and action from the other. Therefore jam plus jerky does **not** always produce the same result, and selection order is not a simple instruction that each ingredient contributes every property.

The selected supported branch is:

| Input contribution | Mapping and executable consumer |
|---|---|
| Jerky's `HP` trigger | `ProceduralCookingIngredient_HP` offers `CookingDomainHP_OnLowHealth` among its triggers. |
| Jam's `regenLowtier` action | `ProceduralCookingIngredient_regenLowtier` offers `CookingDomainLowtierRegen_HealToFull_ProceduralCookingTriggeredAction`. Despite its class name, this action subtracts a roll of 15–20 from HP penalty; it is not a full heal. |
| Combined result | A procedural cooking effect attaches the trigger and its action to the eater. `ProceduralCookingEffectWithTrigger.Trigger` calls each action's actual Apply method. |

This is a permitted branch established by mappings and code, not an observed random draw. There are alternative triggers, actions and standalone effects. No probability of obtaining this exact branch was computed.

Jam alone also has an independently traced natural-healing route. `CookingDomainRegenLowtier_RegenerationUnit` initializes a 10–15% tier, registers for `Regenerating2`, and increases that event's healing amount. `Stomach.ProcessNaturalHealing` fires the event, accumulates the adjusted amount and reduces HP penalty when its threshold and water conditions permit. The same ingredient can consequently contribute a passive rate modifier or an action paired with another domain's trigger.

## QF3: Record the discovered structure, then recook it

Carbide Chef's source grants inspiration after gaining a level and on a 5% new-zone roll. Its skill text describes a two-day window; the code supplies Inspired duration 2400. No independent time-unit equivalence was executed in this pass.

When an inspired player cooks selected ingredients, `GenerateEffectsFromTypeList(list, 3)` generates choices and the UI asks the player to pick one. `CookingRecipe.FromIngredients` retains component declarations and the selected effect object. It stores concrete ingredient blueprint requirements on this route, with special handling for random stand-in ingredients. Do not replace those requirements with unrestricted same-domain substitutes. The retained blueprint component supports explicitly listed alternatives, not every item with a related effect.

The learning bridge is fully followed: `CookingGameState.LearnRecipe` → `JournalAPI.AddRecipeNote` → `JournalRecipeNote.Reveal` → append recipe to `CookingGameState.instance.knownRecipies`. The note contains its recipe, identity, text and chef attribution. This closes the earlier risk of assuming that adding journal prose necessarily teaches a usable recipe. Reading a previously unread cookbook page is another native route to LearnRecipe.

`CookFromRecipe` resets its inventory snapshot, filters known recipes, shows the selected recipe, rechecks ingredients and calls `UseIngredients` before applying effects. Its recipe inventory snapshot covers carried/equipped items, while experimental ingredient enumeration also includes adjacent cells. That difference must not be flattened into one availability rule.

For this recipe, each jam and jerky serving spends its preparation charge. Zero-charge objects are destroyed; other charged ingredients can remain. A recipe result deep-copies the stored effect and initializes it for the eater. It retains the effect's structure, not a guarantee that every numerical roll is permanently fixed. The selected healing action rolls 15–20 when triggered, and standalone units can reroll their tier during initialization.

## QF4: Actual use is event-driven, with exact boundaries

`CookingDomainHP_OnLowHealth` listens for HP-stat changes. On the first qualifying change it sets a latch and triggers the action. `GameObject.isDamaged(0.2, inclusive: true)` compares current HP with **base HP × 0.2**, including equality. The latch resets after HP rises above that threshold. This is not unconditional healing each turn spent under the threshold. No lethal-hit ordering, immortality or guaranteed rescue claim follows.

The final action changes HP penalty directly, and its notification enters the player message route. That is an actual gameplay consumer in native code, beyond a preview label. It was not exercised in a running game.

The cooking message describes a day-long benefit, but the effect registers removal events for becoming hungry/famished, receiving Well Fed, clearing food effects and explicit removal. A new selected meal clears prior food effects. Do not interpret `Duration = 1` as one ordinary turn or infer a fixed wall-clock timer from the display text. NPC expiration has additional time logic.

## QF5: UI and failure details retained

The inspected assembly uses campfire actions, popup ingredient selection, effect-choice/result popups, a known-recipe selector and a recipe submenu. The ingredient popup includes checkboxes, item icons, available counts, a selected count and remaining slots; it permits backing out before final selection. It does not pass a full inline ingredient-effect description into that popup. Prepared ingredient inspection adds a broad domain description separately.

Known recipes initially hide missing-ingredient entries but expose a control to reveal them. The recipe submenu offers cooking, favorite changes, forgetting and Back, with a confirmation before forgetting. It checks ingredient availability again on Cook. Missing quantities receive an explicit message. Effects are described in a metabolism popup, with later trigger notifications in the message route.

[UI evidence](QUD_CDDA_UI_EVIDENCE.md) separately inspects a historical cooking screenshot showing selected ingredients, counts and effect-domain descriptions. That older screenshot is not a rendering of this assembly's popup path and must not establish current-release parity.

Failure/payment order differs by route. Ingredient cooking applies effects before its final ingredient-debit loop; known-recipe cooking spends ingredients before clearing/applying effects. These are not proven atomic transactions. `UseIngredients` delegates to component methods and returns true; no whole-system rollback guarantee is inferred. Hostiles, frozen state, campfire operational status, movement mode, hunger, dietary filters and insufficient stock can refuse earlier steps.

## Preserved detail and remaining gap

Private storage includes the complete selected source classes and tables, failed type lookup receipts with successful corrected exports, blueprint/domain catalogs, source-locator index, UI captures and validation hashes. Qud remains proprietary supplied material, retained privately; public reports paraphrase it. Serialization methods for recipes, notes and effects were read, but no save/reload/import or native cooking occurred. The source chain is closed through HP mutation; source-game interaction and current-release visual equivalence remain unverified. No YAIR implementation or accepted rule change.
