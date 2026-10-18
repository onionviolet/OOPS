# Stronger online examples for named crafting gaps

2026-10-15, round2. Official primary material only for the new mechanism claims. This extends the Taiwu/ACS/Tale/Potion Craft evidence rather than restarting their audits. Fetch receipts and original manual images are in [private/round2](private/round2/). Native interactions were not tested; manual screenshots are depicted examples. No purchases, installs or launches.

## O1: Atelier Ryza 2, ingredient selection exposes consequences

The official [synthesis basics](https://www.koeitecmoamerica.com/manual/ryza2/en/4100.html) distinguishes material categories, elements and connected loops. Filling loops unlocks adjacent options; special loops can morph a known recipe after the relevant skill unlock. The [flow manual](https://www.koeitecmoamerica.com/manual/ryza2/en/4200.html) describes candidate materials, their traits, and a finished-item prediction. Automatic material selection has a declared high/low-quality preference and excludes favorites; some special loops are excluded. Trait activation and copying have explicit constraints.

**Depicted UI:** [material selection image](private/round2/ryza2-selection.png), official `images/4000/4200_2.png`,1080×608. It places the material candidates, selected material information, resulting-item information and quantity in one context. Numbered callouts belong to the manual. [Loop detail](private/round2/ryza2-loops.png), `4100_1.png`,600×544, shows local category/element/effect slots. The [recipe-morph symbol](private/round2/ryza2-morph.png), `4100_18.png`,240×240, is an icon crop, **not a full UI screen**.

**Proposed adaptation:** give ingredient comparison and outcome preview adjacent homes. A small graph is justified when the world uses connected prerequisites. Do not infer physical tabletop placement, arbitrary chemical invention or a touch/keyboard experience from those images. The source has an authored recipe/effect structure; “new recipe” need not mean an effect nobody authored.

## O2: Ryza 2, distinguish enhancement, fusion and repetition

The official [Essences](https://www.koeitecmoamerica.com/manual/ryza2/en/4500.html) page documents a consumable that changes a loop's element or amplifies its effect, with skill access and per-loop restrictions. [Evolution Link](https://www.koeitecmoamerica.com/manual/ryza2/en/4600.html) combines two finished items for an EV effect or certain new items and spends Gems. [Duplication](https://www.koeitecmoamerica.com/manual/ryza2/en/4400.html) reproduces supported items' effects/traits through a separate unlocked process, with exclusions.

These are three distinct operations with different inputs and consumers. None proves that ordinary ingredient mixing automatically duplicates, fuses or grants all traits. For YAIR, keep a tool/power that changes an operation separate from the raw ingredient's identity. A duplication power may validly alter ordinary accounting where its selected law permits it; do not invent universal costs or copy Ryza's caps.

## O3: Minecraft blaze powder, one identity with several practical roles

The official [Taking Inventory article](https://www.minecraft.net/en-us/article/taking-inventory--blaze-powder) describes blaze powder as a crafting component for several products, an ingredient in brewing, and fuel for the brewing stand, as well as a component for an Eye of Ender. These are different uses of one stock. The article does not establish open-ended chemistry or a new recipe-discovery engine. Its exact tuning/version is not pinned here.

**Proposed adaptation:** show uses grouped by role: transformed ingredient, operational fuel, reusable catalyst if applicable, directly administered item, or structural/pattern component. A quantity committed as fuel cannot also be spent as an ingredient. A material with many uses can matter without dozens of continuous numeric properties.

The web reading route succeeded. A later attempt to preserve the raw page via HTTP timed out; no retry variants were used. The raw receipt records that gap. The public claim above uses the successfully retrieved official article, not an invented local capture.

## O4: Keep existing stronger references for their own questions

| Named gap | Best evidence in this packet | Why it stays |
|---|---|---|
| Experimental route + retaining one's method | Potion Craft official screen, first-pass U4 | Simultaneously exposes path, stock and saving; native replay remains open |
| Real order/worker/input/output separation | ACS first-pass U2 and inherited code trace | Useful production semantics; not free-form effect invention |
| Material/tool/output requirements near selection | Taiwu developer U1 and new [static trace](TAIWU_CRAFTING_TRACE.md) | Shows explicit gates and template-derived results, without proving native usability |
| Formula targets and refinement | Tale U3 | Historical sequence supplies a useful contrast; current runtime remains unknown |
| Ordered spell composition | Existing [Noita digest](../noita/COMPOSITION_DIGEST.md) | Corrects the simplistic “modifier always affects one next card” model; this round found the old private source root absent, so makes no fresh source-verification claim |

## O5: Ranked dispositions

| Rank | Disposition | What to borrow for a proposal | Cost/limit |
|---|---|---|---|
| 1 | Adapt | Ryza's adjacent candidate/detail/result view | Observer-safe preview and room in the existing center, not a replacement shell |
| 2 | Adapt | Minecraft's distinct roles over one item stock | Real allocations and consumers, not more decorative tags |
| 3 | Adapt | Potion Craft's visible route-to-saved-method continuity | A selected method model; map only where the domain supports it |
| 4 | Adapt selectively | ACS order/worker/stock/result separation | An available means and its actual access, not a compulsory colony |
| 5 | Park or trial by domain | Connected loops, pattern programs and finished-item fusion | Different local rules; no universal synthesis grid |

All propositions remain unselected. Sources are version-bound documentation, not proof of current runtime, full accessibility, native Mac compatibility or YAIR gameplay.
