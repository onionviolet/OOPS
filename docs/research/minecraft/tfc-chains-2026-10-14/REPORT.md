# Feature answers

| Question | Answer | Evidence | Label | Packet | YAIRPG takeaway |
|---|---|---|---|---|---|
| CH barrels | Hide stages use 300/400/500 mB per small/medium/large hide and 8000 ticks each; tannin uses 1 tagged log per 1000 mB water, 8000 ticks. Brining uses 125 mB per food, 4000 ticks. Brine is instant 9 saltwater:1 vinegar; limewater is instant 1 flux or lime:500 mB water. Lye is a pot job (5 ash:1000 mB water, 600 C, 2000 ticks), then barrel bleaching uses 25 mB/item for 1000 ticks. Early unseal resets hide/brining elapsed time with inputs unchanged before completion. | E1,E2 | shown | CH/P01 | Quote chemical supply separately from timed treatment. |
| CH leather | Raw hide -> limewater barrel -> soaked hide -> knife on log-supported 4x4 scraping surface -> scraped hide -> water barrel -> prepared hide -> tannin barrel -> 1/2/3 leather by size. Each barrel stage is 8000 ticks; scraping completes all 16 cells, with no elapsed timer. | E1,E3 | shown; guide stated | CH | Keep intermediate goods and manual work distinct. |
| CH drying and firing | No core drying-mat or separate kiln class found in this payload. Mud bricks dry after >24000 ticks and a random tick, reset in rain or when wet bricks are added. Ceramic bricks/pottery fire via heating recipes, commonly 1399 C; pit kiln burns 8000 ticks, ramps to 1400 C and converts at the threshold before burnout. Invalid enclosure/fire cancels firing, consumes loaded fuel, retains current contents. | E4,E5 | shown; absence scoped to search | CH/P01 | Use different reset, pause and cancel policies by stage. |
| Kit-making | Knapping matches material type plus removed-cell pattern; clay uses five balls and consumption-after-complete policy. Unfired molds are fired, filled with matching molten metal, cooled, then opened. Copper pick head needs 100 mB and its mold always breaks. Head + wooden rod crafts the metal-specific tool and explicitly copies forging bonus from the head. | E6,E7 | shown | CH/P04 | A functional part carries selected properties into assembly. |
| P02/P04 guide/viewer | Guide chain entries are read_by_default and the book hides progress. TFC registers recipe categories, catalysts and station-specific transfers, not a learned-recipe ledger here. Sealed barrels refuse modification. FluidIgnoringRecipeTransferHandler excludes fluid slots, so transfer success is not full craftability. Exact JEI missing-item visuals belong to the unread JEI dependency. | E8 | shown; separation conclusion inferred | P02/P04 | Separate guide visibility, station access, inventory and fluid readiness; show competing uses in YAIRPG as a proposal. |
| G5 climate/calendar | Monthly/daily temperature changes supply availability and precipitation, but inspected hide recipes have no temperature or season predicate. Brick drying directly checks rain. Pit heating uses its own ramp, not ambient temperature. Processing getTicks uses playerTime; sleep/time jumps also advance playerTime. Default month length is eight days and empty-server time stops by default. | E4,E5,E9 | shown; indirect supply link stated/inferred | CH/P04 | Only attach climate to stages whose predicates consume it; name the processing clock. |

TerraFirmaCraft 3.2.27, Forge 1.20.1, local data/code read only, 2026-10-14. No game, saves or dialogs touched. Timed chemistry, rain-reset drying, thermal firing and manual scraping are distinct mechanisms. “Known” in the guide is not a saved learning capability, and recipe transfer is not proof of full readiness.

## Ranked PROPOSALS

These extend existing owners. They do not assign implementation or change the accepted P01-first, then narrowed dry-to-kit order in chains round 5. Desktop/laptop remains primary; any proposed UI proof targets 1366x768, mobile deferred. No solo-player once-only limit is proposed.

| Code | Disposition | Proposal | Owner | Scope and cost |
|---|---|---|---|---|
| P1 | Adapt | Stage-specific interruption receipt | MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md; P01 | Extend the incumbent mixture receipt with one drying reset or stop rule. State elapsed work lost, recoverable inputs and next useful action. Do not make a universal engine. |
| P2 | Adapt | Selected part properties survive kit assembly | TECHNOLOGY_AND_PROGRESSION.md; alloy_equipment/crafting owners | Freeze selected material and workmanship fields from a real head into one finished tool, then exercise its useful consumer. Do not copy arbitrary metadata. |
| P3 | Adapt | Readiness beside the recipe | TECHNOLOGY_AND_PROGRESSION.md; ENGINE_AUTHORING.md; P04 | Show known route, actual station, fluid and held means separately at desktop 1366x768. Use the current preview/admission seam rather than a second eligibility engine. |
| P4 | Trial later | One good, two destinations | Modular chains owner; P02 | Quote the same leather stock toward two useful destinations side by side. Guide links suggest routes but do not themselves prove owned-stock competition. |
| P5 | Trial later | A chemical supply subchain | Modular chains owner; mixture_rules.js | Treat supply preparation and treatment as separate jobs with named ratios, storage and costs. Adds intermediate stock, so needs explicit save policy. |
| P6 | Park until a real stage consumes it | Weather-sensitive local law | Modular chains owner; rule_modules.js | After the narrowed dry-to-kit proof, trial one local drying predicate. Keep indoor shelter a useful option. Do not apply seasonal speed multipliers to every chain. |
| P7 | Adapt later | Clock and loaded-state contract | ENGINE_EXPANSION.md; scheduler/persistence owners | Name active, elapsed and jump/catch-up clocks per stage. Catch-up must honor fuel and completion order, not award a full job from duration alone. |

## Prior lane reconciliation

| Prior claim | Result | Evidence |
|---|---|---|
| WC4 lowest forged quality is poor | Correct: enum is NONE plus MODESTLY_FORGED, WELL_FORGED, EXPERTLY_FORGED, PERFECTLY_FORGED; bonus ordinal is saved and copied during assembly | E7 |
| WC4 workmanship carries into tools | Confirmed with explicit copy modifier and actual speed/damage/durability consumers; not a universal part-quality system | E7 |
| WC7 material-specific knapping | Confirmed matcher architecture; prior pattern counts not re-audited | E6 |
| WC G5 seasonal/husbandry gap | Extended only where chains change: rain resets drying, calendar drives environment and elapsed processing; broad husbandry remains unread | E4,E9 |
| WC nutrition/alloy data | Reused as prior context; deliberately not repeated or independently reverified | WC audit |

## Evidence map

Paths beginning `data/` or `assets/` resolve under `docs/research/minecraft/private/extract/terrafirmacraft/`. Java paths resolve under `docs/research/minecraft/private/decomp/terrafirmacraft/src/net/dries007/tfc/`. “Shown” means read in this payload, not native gameplay observed. “Stated” means field-guide/config text. Proposals are inferred adaptations.

- **E1:** `data/tfc/recipes/barrel/*.json; common/recipes/BarrelRecipe.java, SealedBarrelRecipe.java; common/blockentities/BarrelBlockEntity.java:108-126,249-282,380-408`
- **E2:** `data/tfc/recipes/pot/lye.json; common/blockentities/PotBlockEntity.java:108-178`
- **E3:** `data/tfc/recipes/scraping/*_soaked_hide.json; tags/blocks/scraping_surface.json; common/blocks/devices/ScrapingBlock.java:44-78; common/blockentities/ScrapingBlockEntity.java:40-68`
- **E4:** `common/blocks/devices/DryingBricksBlock.java:61-72,151-174; common/blockentities/TickCounterBlockEntity.java; config/ServerConfig.java:317-327`
- **E5:** `common/blockentities/PitKilnBlockEntity.java:32-99,163-208,232-253; data/tfc/recipes/heating/{brick,fired_fire_brick,pickaxe_head_mold,ceramic_jug}.json; common/recipes/HeatingRecipe.java:149`
- **E6:** `common/recipes/KnappingRecipe.java; common/container/KnappingContainer.java; data/tfc/tfc/knapping_types/clay.json; common/items/MoldItem.java:106-173; data/tfc/recipes/casting/copper_pickaxe_head.json`
- **E7:** `data/tfc/recipes/crafting/metal/pickaxe/copper.json; common/recipes/outputs/CopyForgingBonusModifier.java; common/capabilities/forge/ForgingBonus.java; ForgeEventHandler.java:463,787; mixin/ItemStackMixin.java:17`
- **E8:** `data/tfc/patchouli_books/field_guide/book.json; assets/tfc/patchouli_books/field_guide/en_us/entries/{mechanics/leather_making,getting_started/pit_kiln,the_world/climate}.json; compat/patchouli/component/SealedBarrelComponent.java; compat/jei/JEIIntegration.java:208-355; compat/jei/transfer/{BarrelTransferInfo,FluidIgnoringRecipeTransferHandler}.java`
- **E9:** `util/calendar/{Calendar,ServerCalendar,CalendarEventHandler}.java; util/climate/OverworldClimateModel.java:87-99; config/CommonConfig.java:26-29; config/ServerConfig.java:220-225`

## Saved depth and limits

Private reference: `docs/research/minecraft/private/fs-tfc-chains/` holds full relevant recipe tables, selected full guide pages, decoded flows and hashes. Existing decompile/extract stays read-only. Public digests paraphrase. SHA-256 of the actual jar was recalculated and matches its acquisition receipt: `8e493c970c6fb18809e84ff443ba11fd2a65dc0980f77a8b85e638f4d47bb1cd`.

Feature questions are source-answered. Aspect pass is PARTIAL: external JEI/Patchouli internals, native visual states, full migration/rejection and animal AI/husbandry are unread. No installed, played or human-accepted claim. See CHECKPOINT.md for restart gaps.
