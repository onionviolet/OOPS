# CDDA: learned recipe to cooked meat to digestion

2026-10-15. Research only. Existing local official-source checkout reused at commit `ef31b1fc84c640f97a5547a5b76a6ba5e9e97847`, commit time 2026-10-14T19:31:16+02:00. Checkout status was clean; no fetch, checkout change, compilation or game execution. [Pinned upstream source](https://github.com/CleverRaven/Cataclysm-DDA/tree/ef31b1fc84c640f97a5547a5b76a6ba5e9e97847). This is a particular source revision, not proof of an installed release.

Full selected C++ files and complete selected JSON tables live in [private/qud-cdda/cdda](private/qud-cdda/cdda/). [SOURCE_LOCATORS.json](private/qud-cdda/SOURCE_LOCATORS.json) gives exact symbols and lines. A complete direct-component scan retained 195 recipe definitions referencing meat, cooked meat, salt, seasoned salt or salt water, with original paths/array indices and no JSON parse failures. It does not recursively expand every requirement or prove every recipe reachable.

## CF1: Discovery is acquiring knowledge of authored recipes

`Character::get_learned_recipes` adds autolearn recipes when relevant skill requirements are met. `recipe::finalize` derives default autolearn requirements from required skills and recipe difficulty. `get_available_recipes` combines learned recipes with accessible paper books, operational ebook sources and eligible helpers. A helper's knowledge has a comprehension gate. Having a recipe available through a reference is distinct from knowing it from memory.

The `meat_cooked` recipe in `data/json/recipes/food/carnivore.json` is autolearned. No novel experiment or random recipe invention is needed for this simple preparation. For comparison, the seasoned-salt recipe declares autolearn plus a Mexican cookbook learning entry. These fields do not mean every character must find that book first.

`Character::complete_craft` distinguishes completion from memory and completion using a reference. Reference-based completion can teach the recipe, with a chance affected by difficulty, crafting time, skill and intelligence. Disassembly-learning support is another authored route when a recipe explicitly supplies it. This source does not establish an open-ended generator that creates an unlisted recipe from arbitrary mixtures.

## CF2: Concrete ingredient and means

| Record | Selected declaration | Practical distinction |
|---|---|---|
| Raw ingredient `meat` | One raw chunk, food; authored calories 402, raw flag, cooking-equivalence and smoking-result fields | Direct eating, normal cooking and smoking are distinct possible routes. Only normal cooking and eating are traced fully here. |
| Recipe `meat_cooked` | One meat; 15-minute base time; cooking skill; food-preparation proficiency; COOK quality 1; `surface_heat` requirement ×20 | Material is consumed; the quality-bearing utensil is required; the chosen heat tool can spend charge. Base time is not a promise about the actor's actual duration. |
| A qualifying utensil | `pan` inherits base cookpot COOK 3 with a relative −1 change | Resolved COOK 2 qualifies for COOK 1. The pan can remain after cooking; it is not another meat component. |
| Heat alternatives | The requirement includes induction, microwave, hotplate, several fuel tools, fire and a solar-cooker stand-in | Different tools have different charge counts. A negative-count presence requirement is not an instruction to consume a negative amount. |
| Output `meat_cooked` | Authored cooked-food record, parasites 0, 402 calories, one-day spoilage, hot-food and nutrient-override flags | Output identity affects later eating and nutrient calculation. The nutrient override means this example does not demonstrate arbitrary averaging of all input nutrients. |

The complete requirement retains all alternatives. For example the nominal induction multiplier is 25 × recipe heat 20, before runtime accounting; it must not be confused with 20 universal fuel units or a real-world energy measurement. No exact observed fuel debit is claimed.

## CF3: Selection, debit, work and completion

`Character::can_make` checks recipe access, character/proficiency requirements and deduplicated material/tool requirements against crafting inventory. `craft_command::execute` resolves alternatives and chooses component/tool sources, with specific handling for rotten or favorited components and cancellation. Nearby eligible map stock can participate; this is not only a backpack check.

`create_in_progress_craft` rechecks cached components and liquid-unloading consent. It constructs per-step tool allocations, performs the start tool debit, then consumes chosen components into a concrete in-progress craft. Actual component objects and selected counts are retained with the craft. The raw meat is no longer freely available stock merely because the finished food does not yet exist. The start probe guards against a charge shortfall before material consumption; this does not prove every later failure is lossless.

`craft_activity_actor::do_turn` converts actor work into progress, applies speed/effort conditions, advances steps where present, tracks practice and resource/tool accounting, and handles failure points. It removes the in-progress item at successful completion and calls `complete_craft` on a retained copy. That function creates results from the used components, spawns them with relevant rot/heat handling, handles learning and creates declared byproducts.

Continuing an interrupted craft checks missing materials/tools and can ask to spend replacements. Failure may lose progress or components, and a destructive failure removes the craft. Cancellation is not a general undo that restores all inputs. Complete source for continuation, failure and tool accounting is retained; no native cancellation or recovery was executed.

## CF4: The result is used by the body

The static `eat` function first verifies that the object is food and passes `can_eat`/`will_eat`. It then calls `Character::consume_effects`. That function computes the actor's effective nutrients and food/water volume, creates an ingested food summary and calls `stomach.ingest`. Food-charge handling and consumption history follow the eating path; caller-level removal of every non-charge item variant was not independently exercised.

`Character::update_stomach` completes the consequence chain: stomach digestion moves nutrients toward the guts, gut digestion distributes nutrients to the body, and `mod_stored_kcal` plus vitamin updates change body state. Food calories are not simply an immediate healing stat. Traits, spoilage, dietary restrictions, parasites/contamination and digestion matter. The authored 402 calories are not an unconditional instantaneous +402 stored-kcal outcome for every actor and condition.

`compute_effective_nutrients` can derive nutrients from preserved component history for suitable foods. For the selected cooked meat, `NUTRIENT_OVERRIDE` selects the authored/default nutrient route instead. This is a meaningful counterexample to a universal component-average rule.

## CF5: Salt demonstrates both substitution and a rejected use

Salt-water evaporation is an authored alternate recipe: the inspected declaration accepts one salt-water unit or five saline units and produces ten salt charges. It defines a 40-minute unattended boiling step with BOIL quality and a heat requirement. Distillation is a different recipe with clean-water byproducts. These are data-defined alternatives, not arbitrary chemical experimentation. Their full step/tool runtime has been preserved, but was not executed.

Seasoned salt uses fifty salt charges, one option from its sweet-input group and one from its herb/spice group, with COOK 2, heat and a thirty-second base time. The complete JSON retains every alternative. Salt also appears as a curing input alternative. These separate routes share stock and do not authorize spending the same portion twice.

An important failed chain is saved rather than silently counted as success. Cooked meat inherits seasoning groups that expand to salt and seasoned salt. The eating route searches these groups but also requires the seasoning to pass `will_eat`. In this revision, salt adds INEDIBLE and seasoned salt inherits it; `can_eat` rejects that flag for the ordinary actor examined. Therefore group membership alone does **not** close an automatic-seasoning use chain. This is a source-level rejection under stated actor assumptions, not a live bug reproduction or a claim about every mod/release.

The general seasoning consumer is real: an eligible chosen seasoning is processed through consume effects and spent, and the meal message identifies it. But the salt candidate cannot be credited with reaching it merely because its ID appears in the group. The complete cooked-meat nutrition chain above remains independent of seasoning success.

## UI and remaining gap

[UI evidence](QUD_CDDA_UI_EVIDENCE.md) visually inspects the crafting-menu author's PR screenshot and matches major structure against this pinned checkout: categories, recipe list, source/requirements, expandable time/skill/proficiency detail, alternatives and output inspection. Its screenshot selects bread, not this meat trace; its build and large viewport are separate evidence. The source also retains filtering, batch selection, related recipes, component prioritization and keyboard information navigation.

Private storage holds full selected source files, ten complete JSON tables, all 195 directly matching recipe records, UI text literals, exact locators, the author's full PR receipt, screenshot and hashes. Open-source license text is retained. The actual-use chain closes through body nutrient updates in source. Native recipe acquisition, crafting, eating, save/reload, keyboard usability and laptop-size layout remain untested. No implementation or accepted design change.
