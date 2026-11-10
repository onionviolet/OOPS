# Livelihood rules

Working defaults 2026-11-10 under AD56 (ideas that open possibilities are welcome), adjustable; the lines listed in the [limiting lines review](audits/LIMITING_LINES_REVIEW_2026-11-10.md) stay proposals until Weibao answers. Drafted as proposals the same day (AD32). Requested by Weibao ("Draft both", [log](gm/USER_VISION_LOG_2026-11.md#relationship-and-livelihood-rulebooks-2026-11-10)). Rows marked **(restates)** repeat a rule that already binds through its own code and add no authority.

Covers making a living from land, living things and labour: farming and gardens, herds and animal care, fishing, foraging, hunting and trapping, mining and woodcutting as work, and jobs for wages. A world may set any line differently with an in-world reason and cost (AD5, AD38); each row gives the default, the dial and the reason.

Scope, from his direction: livelihoods should coexist as choices ("like choosing to farm, or choosing to start a society, or mining?", 2026-11-06); "create enviorments to farm things, both like creaturs to kill or like actually farm to create some sort of economy" (2026-11-08); "Some stuff can just remain simple" (2026-11-08) and "consider areas to just keep simple" (2026-11-09); what is proposed "shouldnt limit any future prospects" (2026-11-08). Minecraft-fit garden care, exposed drying and residence-aware workers are already authorized ([2026-10-21](USER_VISION.md#minecraft-mechanisms-in-existing-systems-2026-10-21)).

Owners and neighbours (linked, not restated): AD16 (away routines), AD27 and AD31 (local economies, owned things), AD33 (pacing, the Minecraft-fit helper exception), AD49 (lore numbers), AD51 (one seam), AD52 with [ACR1–ACR14](ACTIVITY_ABSTRACTION_RULES.md) (compressed repeated work); [CX1–CX8](GROUND_RULES.md#complexity-guardrails-cx1-cx8); MR18, MR28, MR29 and proposed MR41–MR42 in [making rules](MAKING_RULES.md); SR3, SR15, SR19, SR23 in [site rules](SITE_AND_EXPLORATION_RULES.md); ECR2–ECR8, ECR15–ECR16, ECR20, ECR24–ECR26, ECR30–ECR31 and BHR16 in [domain rules](DOMAIN_RULES.md#economy-rules). Proposal sources: [subsystem scope ladders](SUBSYSTEM_SCOPE_LADDERS_2026-10-16.md) (SSD10–SSD14 vocabulary, SSD20–SSD65 per activity, SSD95, SSD100), [livelihoods lane](audits/cross-world-foundations-2026-11-06/LANE_E_LIVELIHOODS.md) (E-R, E-S seams), [long-term atlas](audits/PROGRESS_ATLAS_2026-11-07_LONG_TERM.md) (LAYX97–LAYX104, LAYX191–LAYX196), [modular production chains](MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md#minecraft-fit-round-mf-2026-10-21) (MF16, MF21). Code map: [area guide](AREA_GUIDE.md), "Work and duties", "Care and upkeep of living things", "Making", "Money, holdings and debts".

## Terms

One word, one meaning in code, docs and player text (NMR, E-R12).

| Term | Means | Not |
| --- | --- | --- |
| Source | A place or thing that gives and refills: herb patch, plot, pond, seam, hunting ground, herd | A shop or a quest giver |
| Take | One act of getting from a source (pick, dig, catch, shear, reap) | The product |
| Yield | What a take gives, with amount and quality | A price |
| Plot | A source someone planted and tends | Land owned outright (see rights) |
| Holding | The plots, pens and buildings one keeper works | A world region |
| Work period | The unit a job pays by (shift, day, week) | Real time |
| Growing | Raising plants or animals | "Cultivation", which means power training in several worlds (AD33, SSD64) |
| Carcass work | Butchering, skinning, rendering (`harvest.js`) | Taking from a source |

## One shape

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| LVR1 | **Every source uses one shape.** A plot, herb bed, pond, seam, hunting ground and herd are sources in `craft_sources.js`, with depletion, regrowth, tool, skill, hour and season gates. The extension to make: an owner or rights fact on the source (today the module has node state, not rights). | Default: extend `craft_sources.js` before writing a farming, fishing or ranching module. Dial: a world adds source kinds. Reason: four material routes exist today (`activities.js`, `craft_sources.js`, `harvest.js`, MG06 in `management/shipping_farming.js`); a fifth would split every later fix. | LAYX97, LAYX191, AD51 |
| LVR2 | **`livelihoods.js` is the read side.** Stage records, who is working what and what is owed are read there; it stores nothing. | Default: obligations show only where a known authority exists (`authorityOver`). Dial: none needed. Reason: one place to ask "what does this keeper's work look like" without a second store. | E-S1, ECR20 |
| LVR3 | **Growth follows needs and stages.** A plant or animal has needs (water, light, soil, season, feed, company) and a stage clock; yield and quality come from how well the needs were met. | Default: a named plot with a stage clock and two or three bed values; no per-plant state (SSD30 first rung). Dial: a world climbs the SSD ladder one dial at a time for a named choice (SSD11). Reason: farming works by its mechanisms, the same as potions (AD38, LAYX192). | SSD30, LAYX192 |
| LVR4 | **Neglect slows and thins; it does not wipe out.** A neglected bed grows later and gives less, and still gives something. | Default: delay plus reduced yield, with a notice. Dial: a world's blight, frost, flood or pest can ruin a crop through a cause the world has, with forewarning where someone could know. Reason: settles SSD30, MR42 and E-S6 to one default; loss comes from events with a cause (AD25), not from the player being away. | SSD30, MR42, AD25 |
| LVR5 | **No mandatory daily care.** Repeat work runs as a routine or standing order; the player decides plans, not chores. | Default: tending is a chosen routine (ACR1, AD16). Dial: a world may make a care step matter more (a temperamental crop) with a visible reason. Reason: SSD95; daily chores turn an idle game into a job. | SSD95, ACR1, AD16 |
| LVR6 | **Time away is projected lazily.** A source's state is worked out from the last settled time when read, not ticked; reloading never grants stock. | Default: the `habitat_care.js` projection method applied to every source timer; inactive worlds pause (AD16); a routine stops at an exhausted supply or a choice (ACR8). Dial: none proposed. Reason: one stated rule for all timers (LAYX196, LAYX206) prevents each module inventing its own catch-up. | AD16, ACR8, LAYX196 |
| LVR7 | **Weather and seasons are read, not simulated twice.** Farming reads `weather.js`, `weather_calendar.js` and `world_calendar.js`; a condition is a tag that every source can read. | Default: one drought tag reaches crops, fish and pasture (SSD72); seasons apply only where a world defines them; crop seasons wait until two crops differ by planting time (SSD100). Dial: per world. Reason: farming is weather's first strong reader, and two weather models would disagree. | SSD72, SSD100, LAYX195 |
| LVR8 | **Rolls are keyed** (restates MR28). Take and yield rolls key on world, place, source and game time. | Default: the generator contract GR1–GR17. Dial: none. Reason: a reload or a second look does not reroll a harvest. | MR28, GR3 |

## Products and making

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| LVR9 | **Products are conserved and kept somewhere** (restates SR15). A yield is a batch with custody; storage and spoilage act on it. | Default: spoilage pauses or reduces with a notice; drying, salting and cellars slow it by how they work. Dial: per good and world. Reason: food that vanishes without a cause feels like a bug; exposed drying is already authorized (MF21). | SR15, E-S6, MF21 |
| LVR10 | **Soil, feed and compost are materials.** Mixing them is making, under the same envelope as any recipe; yield quality carries into later making. | Default: MR29's shared envelope with a growing product logic. Dial: a world's soil or feed law. Reason: properties drive results across crafts (LAYX184), so learning what a soil does is progress everywhere. | MR29, LAYX192 |
| LVR11 | **Many routes trade labour for yield** (MR42, proposed). Careful work gives more and better; quick work gives less; either works. | Default: at least a careful and a quick route per activity, chosen by depth setting (MR18). Dial: per activity. Reason: "different ways to make the same thing" applies to growing (USER_VISION, Making and crafting, 2026-11-09). | MR18, MR42 |

## Living things

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| LVR12 | **Named few, counted many.** Herds and flocks are counted pools; an animal the player names or relies on becomes an individual and stays one. | Default: around a dozen named per holding (SSD40); a bred or raised animal keeps its identity (MR41, SSD14). Dial: per world. Reason: pools keep save size small, and an animal the player cares about should not merge back into a number (ACR13). | SSD40, SSD14, MR41, ACR13 |
| LVR13 | **Diets go through `living_upkeep.js`.** Feeding needs, starvation forecasts and daily cost are read there. | Default: no new hunger clock; do not copy `habitat_care.js` for a new animal system (area guide). Dial: a world's diet table. Reason: hunger already exists in three places with no shared seam; a fourth makes it worse. | AREA_GUIDE, LAYX194 |
| LVR14 | **Slaughter, hunting and their tone are per world.** Killing animals for food or hide is an option where the world has it, never the only way to profit from a herd. | Default: optional, with tone set by the world (SSD40). Dial: per world; hunting at Hogwarts stays undecided ("maybe but also idk", 2026-11-08). Reason: some worlds treat it as ordinary work and others as a moral act. | SSD40, SSD52 |

## Food and hunger

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| LVR15 | **No hunger death by default** (restates BHR16). Food is a boost. | Default: going without food costs something other than death: slower recovery, worse work, a mood (XC19, proposed). Dial: a famine world may make hunger lethal only with Weibao's direction, an in-world reason and forewarning (BHR16). Reason: "Player also cant physically die from hunger, which has to count for something right?" (2026-11-08). | BHR16, XC19 |

## Land, work and money

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| LVR16 | **Access, rights and ownership are separate** (restates SR19, ECR24). Working a plot, holding a right to it and owning it are three facts. | Default: a right has a grantor, a term and dues where the world has an authority; with no known authority there are no dues (ECR20). The current one-time plot right is the first rung. Dial: tenancy, shares and quotas per world (E-O scenarios). Reason: a tenant's life and an owner's are different livelihoods. | SR19, ECR20, ECR24, E-R8 |
| LVR17 | **Holdings have upkeep and income and stay in their world** (restates ECR24, ECR25, AD31). | Default: upkeep in the world's money and goods; passive bonuses from owned things (AD31). Dial: per world. Reason: property with no cost becomes free money. | ECR24, ECR25, AD31 |
| LVR18 | **Every moneyed world has an honest baseline job** (restates ECR26). | Default: pay per work period (SSD60), set against the world's basket of a meal, lodging, a day's wage and a basic tool (ECR6); a canon wage is a fixed point (AD49). Dial: what the job is. Reason: a player with no means still has a way to eat and save. | ECR6, ECR26, SSD60, AD49 |
| LVR19 | **Work done, output, delivery and pay are four facts** (restates ACR6). | Default: a shift can be worked and not yet paid; a crop can be grown and not yet sold. Dial: none. Reason: payment that silently follows work hides debts, theft and late wages. | ACR6 |
| LVR20 | **Delegated work names who does it** (restates ACR10). Hired hands and stewards use one delegation shape. | Default: `hired_hands.js` is the shape to extend; hiring stays coarse while NPC-heavy work is paced (AD33, ECC8). Dial: a world's labour market. Reason: income that automates should go through the same means as everything else (OB7). | ACR10, AD33, OB7 |
| LVR21 | **Selling meets the local market** (restates ECR2, ECR8). | Default: the local merchant is the default buyer; repeated selling saturates through `market_saturation.js`; a spot that is worked hard pays less over time rather than hitting a hard cap. Dial: per world and good. Reason: grow sinks and let prices answer, rather than throttle income (ECR30). | ECR2, ECR8, ECR30 |

## Scope

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| LVR22 | **Simple is a valid end state.** A farming or fighting area can be a pool with a clear reward and no clock. | Default: the simple area (LAYX103); richer models such as a responding population are options a world picks (LAYX104). Dial: per world and activity. Reason: "Some stuff can just remain simple" and YAIR and Proto23 "just has areas" (2026-11-08, 2026-11-09). | CX1, MR18, LAYX103 |
| LVR23 | **Depth climbs one dial at a time and holds.** A world adds a rung for a named choice, keeps a rung the player relied on, and a change of view never rerolls stock or resets timers. | Default: SSD11–SSD13. Dial: which dial climbs. Reason: CX4 (promote, do not pre-simulate) and the player's trust in what they saw. | SSD11–SSD13, CX4 |
| LVR24 | **Farmability is the world's call.** A world decides which sources can be planted, penned or stocked. | Default: a world where an ingredient is scarce and priced keeps it unfarmable unless a means exists (LAYX100); canon callers are cited from a reading row, not from memory (LAYX224). Dial: per world and good. Reason: farming a rare ingredient would erase the economy the book describes (AD49). | LAYX100, LAYX224, AD49 |
| LVR25 | **Powers can do the work** (restates ACR12, AD38). A growth spell, a contract spirit or a Gu that tills the soil removes the chore by how it works. | Default: the power's real cost and limits apply. Dial: per world. Reason: things work by how they work; a livelihood should feel the difference a power makes. | ACR12, AD38 |

## Wild populations (first slice, 2026-11-10; proposal, no new codes)

The richer rung of LVR22 (FRC19, FRC41). Shape taken from table-driven populations (Caves of Qud's `PopulationManager`: chance, weight and number per entry; numbers not copied). `src/creature_populations.js` is pure: a table lists, per place, who lives there with a `weight` (which kind the next sighting is), a `chance` (permille that it is about on a given day, a keyed draw), a `number` per sighting, a `cap` and a `refillPerDay`. The count left is a `craft_sources.js` node, so refill is the one lazy projection on played minutes (LVR1, LVR6): reload grants nothing and a kill never resets the return of animals already coming back. Counted creatures stay pools; a creature that is named or relied on is a person record (the pet slice). Default: a place is a simple area (LVR22) until a world gives it a table. Dial: per place and species (cap, refill, chance, number). Reason: a cleared ground should be felt for a while and then recover, without a clock per creature (LVR23).

First consumer: the Frontier meadow-edge boar hunt (`src/frontier_bow.js`). A won hunt takes a boar inside the fight's own commit (the count is one actor fact, `frontier.meadow.pop`; no fact means full, so old saves need nothing); the hunt quote says why it cannot run and roughly when boars return. Frontier is a test bed, so this adds no new depth there; the Village `CombatZone` keeps its simple counts (LAYX103) until a slice wires the same table into the upstream battler, which needs a `main.js` line.

## Building a livelihood slice

1. Name the ordinary-day caller (SPR1) and the world. Production is Frontier-only today; the proposed second worlds come from the livelihoods lane.
2. Add the source to `craft_sources.js` (LVR1); read it through `livelihoods.js` (LVR2).
3. Settle time away with lazy projection (LVR6) and one weather tag (LVR7).
4. Show one visible result per press (FBK) and at least one consumer of the yield (FLR4): a sale, a recipe or a diet.
5. Tests: extend `tests/craft_engine.test.js` (which covers `craft_sources`) or add a focused source test, plus browser proof at the desktop viewport (AD43).

## Open details

- Four material routes still compete (LVR1); consolidation happens as slices touch them.
- Seasons and climate have no farming reader yet (LVR7).
- Hunger lives in `living_upkeep.js` (used by the Gu keeper alone), `habitat_care.js` (one sheep pen) and the household animal model, with no shared seam (LVR13).
- The Village patrol is the one wage job shape so far; there is no labour market (LVR18, LVR20).
- Plot rights carry no term or dues yet (LVR16).
- Breeding over generations waits on the aging and family deferral (LVR12).
