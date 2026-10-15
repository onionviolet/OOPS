# Processing and assembly digest

Evidence IDs resolve through [SOURCE_MAP.md](SOURCE_MAP.md). “Shown” means source-read at those pins, never observed gameplay.

## Barrel lot and amount matching

B1 holds one item slot and one liquid slot. B3 resolves litres into integer portion quantities using the liquid's `ItemsPerLitre`. B2 first pairs every occupied slot with an ingredient. An extra or missing occupied slot fails. For ingredients without partial consumption, stack quantities must be exact multiples and share the same batch multiplier. For those with a declared consumption quantity, the stack must meet the required amount for that multiplier; surplus may remain. Output quantity scales by that multiplier. This explains why a correct liquid type can still give no recipe, and why excess liquid is not always invalid.

The matching scan handles zero-duration recipes immediately on the server. A positive-duration match is retained as current recipe and output count. Sealing records calendar total hours. A periodic server check attempts completion using elapsed calendar hours, while ordinary sealed interaction returns early. On completion, the output goes to the liquid or item slot according to containable properties; the declared reagent remainder goes to the other slot. Output perish freshness is carried from inputs where applicable. The seal clears after completion. Inventory and seal timestamp persist; the matching recipe is found again from contents on load, rather than frozen as a paid recipe revision.

**Early opening:** there is no normal early-open control in the inspected interaction/dialog. The wiki states a processing barrel cannot be broken or moved. The C# broken-block hook itself can dispatch behaviors and removes the block; the missing asset configuration/engine interaction must supply any normal break prevention. Do not report a tested forced-break refund, pause, reset or retained progress. No such test ran. A recipe disappearance clears sealing on the periodic path.

**Stated values, not extracted game assets:** the [barrel wiki](https://wiki.vintagestory.at/Barrel) gives 50 L capacity, instant solution mixing, 50 lime or 25 salt per 50 L water and 24 game hours for weak tannin. The [leather wiki](https://wiki.vintagestory.at/Leather_working), marked verified for 1.20.7, gives raw-hide soak 20 hours, weak-tannin preparation 3 days, strong-tannin finish 4.5 days, and solution use by hide size of 2/4/6/10 L. Exact flags for these recipes were not read. Brine and limewater API titles redirect; their bodies were not treated as separate numeric evidence.

## Stack transitions and ambient context

T2 declares the transition type, fresh grace period distribution, transition work distribution, destination and quantity ratio. T1 initializes each stack's arrays once, records creation/last update, samples durations and accumulates effective hours from elapsed calendar time times the inventory's current transition multiplier. Freezing skips the update. Behaviors can replace the calculation. At completion the server converts the stack, with randomized rounding of yield, marks it dirty and performs only one transformation that update.

T3 multiplies default rates by registered callbacks. T4 gives an in-world container a room lookup and climate/light-aware perish rate. It caches temperature once per tick and avoids a full scan if no transitionable stack exists. The generic in-world callback slows dry and melt to a quarter of their base rate; curing follows its base rate unless another callback changes it. These are implementation constants, not verified asset balance values. A valid sealed barrel's callback returns zero and therefore suppresses transition progress, not merely an independently modeled spoilage system.

T1 can track multiple transition types on one stack. A perish transition encountered as active suppresses later non-perish completion processing on that pass; property ordering matters. Elapsed work is added before that check. It is inaccurate to describe every secondary clock as fully stopped. Hot stacks have a separate perish suppression path. The code itself notes that one transformation per update does not fully handle fast-forward. The sampled rate is applied over the elapsed interval; this is not historical integration of every room/weather change. YAIRPG should settle the old interval at condition changes and define chained catch-up explicitly if it adopts this idea. Offline app-closed simulation is not established.

## Portable anvil work versus placed clay

W1 stores a bounded material voxel array. Before recipe selection it can return the cancellation stack/base material and keep temperature. After selection it writes the voxel bytes, selected recipe ID and rotation to the work item before handing it to the player or dropping it. W2 restores shape and recipe on placement; W1 also restores rotation. Workability compares temperature to material rules. W3 accepts a work item and heats that stack, retaining its attributes. Completion produces the recipe result and carries its temperature, then clears the workspace. The runtime ID used for recipe selection is not proof of a stable cross-content revision pin.

The [smithing wiki](https://wiki.vintagestory.at/Smithing) states that a chisel can convert a work item to bits for remelting and that cooling, removal and reheating preserve shaping progress. Source confirms retention/reheat but paid salvage recipes are missing. No recovery percentage is asserted.

W4 persists clay voxels, work stack, base material, available voxel budget and selected recipe in block-entity tree fields. The output is granted when shape matches. W5 returns no block drops and has support-loss break handling. No portable unfinished clay restore mechanism was found in these paths. The [clay manual](https://wiki.vintagestory.at/Clay_forming) describes carrying completed unfired items; that does not prove carrying unfinished forms.

## Handbook and honest limits

H1 reverse-searches grid recipe ingredient candidates, checks matches and generates variant-correct outputs; it also reads smithing, clay, knapping, barrel, smelting and cooking routes. Linked item slideshows open further detail pages. Creation help searches outputs and station/material routes. It is a content graph, not a current-inventory feasibility service. Some recipes can opt out of creation display.

W1's placed-block info exposes current temperature and too-cold status, and placement names required anvil tier. H2 explains kiln or crucible requirements for a firepit input. B5 displays contents, quantities and a matched output/time quote, but its failed match has no exact ratio diagnostic. P01 needs a stronger current-admission explanation than this barrel UI provides. P02 can borrow the inverse index, while current YAIRPG knowledge projection must still filter spoilers.

## What a component carries

The [crafting manual](https://wiki.vintagestory.at/Crafting) states head plus stick grid assembly. The [armor manual](https://wiki.vintagestory.at/Armor) states forged or cast components feed grid recipes, with wearable head, body and legs as distinct equipped pieces. These are consumed intermediates, not evidence of an arbitrary nested assembly engine.

K1 clones a resolved output, optionally copies one selected input attribute tree, optionally merges named input trees, then invokes output crafting behavior. Existing output attributes win during those merges. T1 can average input durability fractions and carry spoilage freshness. Inputs with no durability contribute a small weight; nonconsumed durable tools are skipped in the relevant branch. This is a general recipe contract, not proof every vanilla head or stick enables property transfer.

K3 loads protection/stat definitions, tracks stack condition and durability, resets new crafted clothing condition and handles repair-specific durability/material calculations. It treats recipe names containing repair specially. No retained handle species, head provenance, independent handle wear or universal part-quality sum is established. Future YAIRPG kits should explicitly declare property propagation and consumption, with precedence and durable publication tested.
