# T10 code hooks

2026-10-14. **SHOWN** means current source inspected, not executed gameplay. **INFERRED** means a proposed attachment. No runtime edits, builds or saves. Line locators were refreshed after concurrent main.js, items.js, inventory and location edits and may drift during other lanes' work. Named functions identify the same seams if lines move.

Authority: [COMMON](../COMMON.md), [round 7](../../../../TECHNOLOGY_AND_PROGRESSION.md#subtle-micro-details-round-7-2026-10-14), MI/WS in the [micro report](../../../../research/CRAFTING_TECH_MICRO_MACRO_2026-10-11.md), and [nonhuman viewpoint owner](../../../../worlds/NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14.md). U adds vocabulary and evidence boundaries; it does not select new craft mechanics or replace these owners.

## U1. What exists

SHOWN: seven recipe families are registered at `src/crafting_recipes.js:2096`: crafting, cooking, smelting, forging, alchemy, butchering, woodworking. Skill IDs and recipe categories differ: `Crafting` displays as **Tinkering** (`src/data/skills.js:2155`). Crafting mastery is a parent skill (`:2101`), not an eighth recipe family.

| Catalogue | Native attachment and source evidence | Boundary |
|---|---|---|
| [Smithing U10](crafts/smithing.md) | Forging skill `src/data/skills.js:2180`; metal components `src/crafting_recipes.js:451`; chainmail `:1129` | Native numerical workmanship exists; no persistent hammer marks or heat-stage simulation established here |
| [Woodworking U11](crafts/woodworking.md) | Woodworking skill `src/data/skills.js:2243`; wooden components `src/crafting_recipes.js:555`, processed woods `:1248`, poles `:1469` | Exact grain, tear-out and moisture are proposed cues, not existing specimen fields |
| [Leatherwork U12](crafts/leatherwork.md) | Butchering `src/data/skills.js:2216`; hides/leather `src/crafting_recipes.js:946`; armor exteriors use Crafting `:640`, cape `:929` | Leather preparation and assembly exist; no distinct Leatherwork skill or tanning process in these definitions |
| [Tailoring/weaving U13](crafts/tailoring-and-weaving.md) | Crafting clothes `src/crafting_recipes.js:834`; wool/linen/silk cloth `:1076` | Cloth and clothing exist; no separate tailoring/weaving skill or loom operation in inspected definitions |
| [Pottery U14](crafts/pottery.md) | No dedicated recipe family/skill in the inspected registries | Future world content; not a reason to add a skill now |
| [Glassblowing U15](crafts/glassblowing.md) | Raw Glass under Smelting `src/crafting_recipes.js:1223`; phial/bottle under Crafting `:1106`; glassmaking book `src/items.js:1453` | Glass output exists; blowpipe stages and a Glassblowing skill do not follow |
| [Soapmaking U16](crafts/soapmaking.md) | No soap recipe in the inspected native recipe catalogue | Potential new content; native fat/alkali-like items do not prove soap crafting |
| [Cooking/baking U17](crafts/cooking-and-baking.md) | Cooking skill `src/data/skills.js:2200`; meat `src/crafting_recipes.js:1634`; bread/pie `:1692` | Native instant results, not a persisted dough/process state |
| [Brewing/fermentation U18](crafts/brewing-and-fermentation.md) | Bread kwas/cider use Cooking `src/crafting_recipes.js:1712` | Outputs exist; no Brewing skill, culture health, fermentation timer or aged batch established |
| [Dyeing U19](crafts/dyeing.md) | No dedicated skill or recipe family in inspected registries | Colored apparel alone would not establish a dye process |
| [Herbalism U20](crafts/herbalism.md) | Gathering skill `src/data/skills.js:1985`; activity `src/activities.js:183` | Plant gathering exists; safe medicinal identification is not implied by a skill label |
| [Papermaking/bookbinding U21](crafts/papermaking-and-bookbinding.md) | Books are item templates, e.g. `src/items.js:1424` | Existing book reading is not native paper or book manufacturing |
| [Scribing/printing U22](crafts/scribing-and-printing.md) | No dedicated recipe family/skill in inspected registries | Notes/manuals exist elsewhere; no native printing profession claimed |
| [Instrument making U23](crafts/instrument-making.md) | No dedicated skill/recipe family in inspected registries | Woodworking is a possible future substrate, not proof of instrument manufacture |
| [Mining/smelting U24](crafts/mining-and-smelting.md) | Mining `src/data/skills.js:1965`, Smelting `:2167`; ore processing `src/crafting_recipes.js:1176` | Extraction and metal output exist; no inferred purity assay or furnace-stage truth |
| [Fishing U25](crafts/fishing.md) | Fishing skill `src/data/skills.js:2005`; gathering `src/activities.js:210`; pole recipes `src/crafting_recipes.js:1469` | Native catches, not a simulated underwater scene |
| [Farming U26](crafts/farming.md) | Farming skill `src/data/skills.js:1183`; fieldwork `src/activities.js:84`, harvesting `:202` | Paid fieldwork and item harvest are distinct consumers of the same skill |
| [Fictional alchemy U27](crafts/fictional-alchemy.md) / [potion brewing U28](crafts/fictional-potion-brewing.md) | Alchemy `src/data/skills.js:2208`; powders `src/crafting_recipes.js:1892`, potion `:1934`, balm `:1947` | Existing fantasy items; new fictional sensory rules need authored world support |

SHOWN gathering inventory: Gathering mastery, Woodcutting, Mining, Digging, Herbalism, Animal handling, Fishing (`src/data/skills.js:1943-2005`), plus Farming in Activity category (`:1183`). The seven gathering activities are mining, digging, woodcutting, herbalism, animal care, harvesting and fishing (`src/activities.js:155-217`). Location-specific resources, times and quality projections live in `src/models/location.js:410`, `:491-528`, with content in `src/data/locations.js`. Tools depend on the activity and location, not merely the catalogue entry.

SHOWN professions: native Job definitions are fieldwork and patrolling (`src/activities.js:83-98`). The Village career extension has Apprentice, Dependable worker and Mentor ranks (`src/village_career.js:2`, `:12-25`). Craft skill possession is not employment or guild membership. Job controls display location starting text and pay/time/season at `src/display.js:2455-2477`; the Activity description is stored but is not printed by this inspected job-tooltip path. This is a bounded inventory of native registries, not an absence claim about every optional pack or simulation command.

## U2. MU1: description attachment without save changes

| Surface | Current producer, SHOWN | Small attachment, INFERRED |
|---|---|---|
| Item definition | `src/items.js:170-190`, `:310`: constructor description and `getDescription()` | Keep authored generic description; do not mutate shared templates with one viewer's expertise |
| Observer-aware item text | `src/display.js:505-519`: `nativeItemView` composes fieldcraft and assay projections, tooltip prints projected name/description | Compose a pure craft cue projection using already-known item identity, relevant skill and permitted senses; retain incumbent identification masks |
| Generated item description | `src/items.js:1220-1226` calls `mixturePresentation`; `src/mixture_state.js:73-79` resolves product identity and observed knowledge | Preserve this newly present special-case projection too. Formula identity/observed effects are not per-batch maker/date provenance; no hidden truth is copied here |
| Existing identification examples | `src/nethack_fieldcraft_item_view.js:44`, `src/game_absorption_assay_item_view.js:11` | Follow read-only projection shape; these are narrow retained-evidence consumers, not general appraisal |
| Craft preview | `src/display.js:3063-3096`; Result details in `src/crafting_detail.js:61-75` | Recipe context supplies `recipe_skill` without guessing an item's historical maker. Describe a known method generally, not an unmade object's realized defect |
| Actual result receipt | `src/display.js:3124-3149`; measured text `src/crafting_detail.js:127` | Add one cue after measured output/used/XP feedback. Snapshot expertise at the event if wording concerns the maker; current expertise is appropriate for later inspection |
| Gathering | `src/activities.js:20-37` description/action text; `src/display.js:3795-3823` gathering tooltip | Add a qualified observation below actual resource/time information. Efficiency is projected by `src/models/location.js:491`; item outcome settles at `src/main.js:7551-7598` |
| Skill help | `src/data/skills.js:1955`, `:2180` and adjacent definitions | Craft-general ladder can explain noticing; it must not certify a particular item's flaw. Skill description is printed at `src/display.js:4860` |

No save field is needed when rendering derives words solely from existing skill, known item/quality, current permitted environment and actual observations already held. Native XP is saved at `src/main.js:5031-5047`. Choose ladder bands later; novice/practiced/master here are authoring voices, not three mandatory ranks or selected numeric thresholds. Current total skill and enduring practice are different inputs; temporary buffs should not invent personal craft history.

**U6. Truth before vocabulary.** The tables describe possible cues. Native quality can support “even work” when an authored mapping says so. It cannot certify an internal crack, a spoiled batch, fine grain, exact moisture or readiness if no underlying observation/property exists. A safe text-only line is “You notice how evenly the rim is finished.” An unsupported diagnostic must remain conditional/general, or wait for an authored fact. Mastery narrows interpretation; it never adds an unseen truth. All other tooltip fields, component names (`src/display.js:555-570`), preview names (`:3093`) and accessible output need the same knowledge guard.

## U3. MU2: provenance is three different things

SHOWN general native key (specialized stamped/generated keys are exceptions): ID or component IDs plus quality, `src/items.js:231-253`. `src/components/inventory_component.js:41-54` merges counts sharing a key. Saves retain inventory key/count pairs (`src/main.js:5148-5153`); generic loading reconstructs from key (`src/items.js:1217-1276`, `src/main.js:5967-6070`). An arbitrary description property added to a runtime item is not automatically retained.

| Provenance kind | Existing producer, SHOWN | Save impact, INFERRED |
|---|---|---|
| Known acquisition route for an item kind | `src/main.js:4310` calls `observeFortAcquisition`; `src/absorb_d/fort.js:27-38` stores item/source/kind/time/certainty; `src/absorb_d/ui.js:33-34` prints learned sources | Can display an existing qualified source row without changing saves, labeled “Known source”, not “this copy was made there” |
| Particular stamped specimen | `src/world_completion_strip.js:5-16` has sample/measurement/production causes and maker ID in one validated native key | Could render its existing stamp with no new save field, subject to legitimate observer knowledge and public-safe names. It has no season/attempt ordinal. This specialized stamp is not a universal provenance system |
| Generated mixture method identity | `src/mixture_state.js:61-79` and `src/items.js:1220-1226` keep a product-reference key and knowledge-dependent description | Existing formula/observation text can be rendered without new fields. Same-method outputs share identity; this is not per-lot maker/season/attempt history. Concurrent candidate, source-only evidence |
| Current craft receipt | `src/main.js:4282-4283`, `:4308-4325`; global attempts/successes and actual output; session receipt `src/display.js:3145` | May say “Made by you just now” for this event. It cannot label every member of an old merged stack; receipt does not establish persistent per-copy lineage |
| General per-batch/per-copy maker, attempt, season, place, named tool and repair history | No general field in the inspected Item constructor/key | Needs an additive durable record or validated key metadata, stack/lot identity and explicit merge/split/transfer/consume policy. Extend constructors, serializers/loaders, validation and transactional publishers, not just tooltips |

Counterexample: two identical bottles, one bought and one crafted, share the native key. “Yours, third try, late winter” on the stack would be false. A global craft count is not a per-recipe ordinal and current season is not manufacture season. Existing E2 equipment IDs (`src/absorb_e2/durability.js:63-77`) arise at activated equip, not at craft; their condition records do not establish a maker or manufacturing date. Old items should remain provenance unknown rather than acquire retrospective stories.

## U4. MU3: feed attachment and publication

SHOWN log producer: `src/display.js:863-1040`. Background and crafting groups are separate (`:989-996`) and each trims past 28 displayed entries (`:1019-1029`); this is bounded display, not a priority queue or general whisper folding. `src/main.js:7632-7641` already emits random location/activity background text. Native crafts buffer messages at `:4156-4158` and flush only after durable transaction status at `:4187-4194` for items/components; other crafting paths need their own publication audit.

INFERRED: attach one action-grounded whisper to the settled craft result, or one gathering-period summary. Group repeated cosmetic lines in memory without extra outcome rolls or changing craft RNG. Background noise must never claim a real failed catch, injury, material loss or bonus when none settled. Keep success/failure, costs and blockers visible even with texture off. No persistent log is established here; dated biography, first-ever success, repeatable remembered accidents or apprentice reactions need existing qualified history consumers or a new durable field.

**U5. State boundary:** lasting body marks/injury, tool quirks learned by this actor, material defect, batch age, personal tool name, drying stage, first-success flags and mechanical happy accidents require durable truth if gameplay remembers or consumes them. Cataloguing them authorizes none of those fields. MU4 can be a browser-only display preference using `src/display_settings.js:6-24`, `:64-88`; cross-device texture preference would need a save/config policy. It changes text frequency, never obligations or rewards.
