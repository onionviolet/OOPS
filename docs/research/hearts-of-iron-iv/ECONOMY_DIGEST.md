# Economy and production digest

Evidence root and limits: [REPORT](REPORT.md). Numeric values below are installed constants, not universal HoI4 balance or copied YAIRPG rules.

## H-E1: Capacity and production continuity

SHOWN, `common/buildings/00_buildings.txt:56`: military factories cost construction work and supply military capacity; civilian complexes supply general capacity; buildings have caps and can share state slots. `common/state_category/city.txt:1` provides six local slots. State category, shared slots, building level, province cap and ownership/control are different axes.

SHOWN, `common/defines/00_defines.lua:611`: construction/general lines cap civilian assignment at 15; military production lines cap at 150; ship categories have distinct dockyard caps. Base factory speeds are 4 civilian, 3.5 military and 2 naval. Start/max efficiency values are 10%/50%, with gain and balancing constants. Change factors distinguish variant (90), parent/child (30), family (70) and archetype (20), described as percentages in comments. These are retention-related parameters, not a demonstrated complete output equation. The growth/retention evaluator is native and uninspected.

SHOWN, `common/technologies/industry.txt:3`: machine-tool technology increases maximum efficiency and equipment conversion speed. Other industry choices also expose different consequences. INFERRED: stable output specialization rewards keeping a line, while conversion can preserve more capability than building a wholly unrelated output. A factory count alone is insufficient to quote future output.

PROPOSAL for Village: retain method/family familiarity on one existing work site, preview the selected switch consequence and explain which condition reduces productivity. Respect its current finite slots, actual input reservations and saved job timing. No cosmetic allocation slider or replacement queue engine.

## H-E2: Resources, trade, fuel and energy

SHOWN, `common/resources/00_resources.txt:1`: this installed build defines **seven** resources, including coal. Each has civilian-capacity and convoy coefficients. The common “six strategic resources” summary is incomplete for these installed bytes. `cic = 0.125` suggests eight resource units per civilian capacity unit, but exact rounding/allocation is an engine limit, not verified by this pass.

SHOWN, `common/defines/00_defines.lua:24`, 624: coal is the energy resource. Energy constants include production per coal, base national production, per-factory consumption and scaling, and powered-factory speeds above base speeds. This matters for a source-pinned adaptation even if older guidance never mentions energy. No DLC gate for the entire energy engine is established here.

SHOWN, `common/ideas/_economic.txt`: laws trade civilian availability, industrial build speed, fuel and external-action gates. `NMarket` at `00_defines.lua:683` exposes contract delivery periods, civilian assignment cap, prices and convoy warning parameters. The 30-day market delivery setting is not an instantaneous generic transfer rule. Equipment stock, fuel, raw resource flows, energy and banked civilian capacity need distinct records.

PROPOSAL: use finite ingredient and output ledgers in existing Village production. Physical cargo transport remains optional until a real local route/receiver needs it. Do not adopt HoI4's national abstractions as a claim that every consumed material has a modeled shipment.

## H-E3: Construction queue and repair

SHOWN: building definitions include cost, conversion cost, caps, infrastructure effects and repair options (`common/buildings/00_buildings.txt:1`). Defines expose civilian allocation caps, base repair rate and factory repair factor (`00_defines.lua:613`, 751). AI construction priorities include rail and repairs (`:3204`).

INFERRED: work competes for constrained capacity, and a completed building changes production or access. Script data does not expose the complete queue scheduler, refunds, cancellation ordering or player UI. These remain engine/runtime gaps. Province War's existing site/job semantics take precedence over a copied national queue abstraction.

## H-E4: Supply is a network plus local reach

STATED formula in `common/defines/00_defines.lua:4266`: capital supply uses a base plus contributions from civilian/military/naval factories. Constants specify rail flow and damage reduction, naval-node flow, distance/terrain falloff, local infrastructure/VP supply, truck motorization, train need and captured-rail conversion cooldown.

SHOWN examples: maximum rail level 5; motorization bonus 2.2 and truck cost 60; railway base/per-level flow 10/5 with damage penalty 5; capture cooldown 10 days, core 5, civil war 0. Source comment distinguishes node bottleneck and provincial reach. `SUPPLY_NODE_MIN_SUPPLY_THRESHOLD` is commented as possibly unused, so do not present it as active behavior. `SUPPLY_GRACE = 72` at line 1000 is described as three days of carried supply. No native experiment confirmed it.

INFERRED: connected does not mean enough capacity; sufficient hub throughput does not mean enough reach; a captured rail does not instantly become ready; transport equipment can itself be depleted. This extends Province War SG02 as source evidence, while LOG01 retains deferred status.

PROPOSAL acceptance if selected: two actual consumers compete for one declared capacity, a cut causes a visible finite shortage, restoration returns capacity without free healing, and midpoint save/import preserves stock, reservation and route state. The current research performs none of those gameplay checks.
