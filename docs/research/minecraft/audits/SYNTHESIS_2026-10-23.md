# Minecraft corpus audit: cross-audit synthesis, second wave (2026-10-23)

Research and proposals only. Nothing here is an accepted decision; every item is a palette entry that needs a fitting world, actor and moment (AGENTS.md: default, dial, reason). Continues [SYNTHESIS](SYNTHESIS.md) (2026-10-14, X1-X12): new patterns start at **X13**, and each says which older X it reinforces. Nothing was built or run; all source evidence is static reading by the lane authors.

Inputs read: [GT_GREGTECH_DEEP_DIVE](GT_GREGTECH_DEEP_DIVE.md) (GT1-GT20), [TB_MEKANISM_AE2_IE_THERMAL](TB_MEKANISM_AE2_IE_THERMAL.md) (TB1-TB40, Q1-Q15, SP-B1-B7), [WV2_ECONOMY_TIERS](WV2_ECONOMY_TIERS.md) (ET), [WV2_RITUAL_MAGIC](WV2_RITUAL_MAGIC.md) (RM), [WV2_SURVIVAL_COUPLING](WV2_SURVIVAL_COUPLING.md) (SV), [WV2_WORLD_FACTION](WV2_WORLD_FACTION.md) (WF), [WV2_QUESTS_LOGISTICS](WV2_QUESTS_LOGISTICS.md) (QL), plus [MOD_SEARCH](../MOD_SEARCH_2026-10-23.md) for context. Read in full: the GT file, the TB donor questions and patterns, ET Part D and the open list. Read at top-finding and headline level only: RM, SV, WF, QL. Their mechanism numbers are cited from the lane files, not re-checked here.

**Code collisions.** Cite audit codes with the file prefix. `GT1-GT6` also means something else in [PROCEDURAL_CRAFTING](../../../PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md) (the making-mode table, where GT6 is "conserved identity"), and `MS` and `TE` exist in both MODULAR and TECHNOLOGY_AND_PROGRESSION. Below, a bare `GT13` means the audit, not the making table.

**Evidence labels for "game has / lacks".** *read* = I opened the owner and it says this. *word* = a grep hit I did not read, so no claim. *absent* = searched `src/` and non-research `docs/` and found nothing. Most "has" cells below are *read*; weaker ones say so.

## Ranked cross-cutting mechanisms

Ranked by how many unrelated sources converge, then by how big the gap is in this repo. Convergence is a signal about shape, not a verdict on any one mod.

| Code | Mechanism | Sources (convergence) | Reinforces | Game has (owner) | Game lacks |
|---|---|---|---|---|---|
| X13 | **One authored row derives a whole family.** Properties, not recipes or price lists, are the source; items, fluids, recipes, prices and tooltips come out. | GT1/GT15 (material row to product family; coil heat row), ET1 (EMC is the min over recipes from ~280 pinned seeds), QL15/QL17 (conduit and capacitor tier are data records), WF2 (building cost computed from its block list), SV5 (drink quality is two tag numbers), TB38/Q13 (auto-price unlisted items) | X2, MR8 | *read:* recipe slots take an exact material, tag or **property threshold** (`src/craft_recipes.js`, [CRAFTING_ENGINE](../../../CRAFTING_ENGINE.md) line 23); MR8 "composition beats catalogs", MR9 open slots; PI1 targets as functions (TECH) | *absent:* a single material row that fans out into items, wires, tools and prices; a solver that derives a value from the recipe graph (the equivalence ledger is [emc-cheat-spike](#c1-hand-set-prices-versus-derived-prices)'s) |
| X14 | **A tier ladder is a gate with a named step, and each rung gates something different.** The step is fixed (x4) but what it gates differs: power, recipe eligibility, slot counts, tool use, growth. | GT2/GT11 (voltage x4, 16 tiers, amps shrink to 1 at the top), GT3/GT15 (coil heat), GT17 (elevator motor tier opens 6/12/15/18/24 slots), ET6 (essence x4 per rung, plus a durable crystal), TB tier tables (SP-B3), QL15 (conduit rates), RM12 (purity tiers, -8% per miss), WF1 (village growth by tier weight) | X4, X12 | *read:* TT1-TT11 scale ladder and CT1 "capability apart from workmanship" ([TECHNOLOGY_AND_PROGRESSION](../../../TECHNOLOGY_AND_PROGRESSION.md) lines 306, 384); the ET audit itself notes ET11 could be one rung family | *absent:* a numeric rule that a rung is a hard recipe gate with asymmetric failure (too high a rung destroys, too low only slows); an authored chapter spine with per-tier density (GT11) |
| X15 | **Conserved budgets name their cause.** Every limit prints which input is short and what it costs. | GT14 (six faults, -10% each, stops only at six), RM11 (living-armor budget 100, negative-cost downgrades fund more), RM27 (regenerating personal pool), SV7 (thresholds block sprint, regen, damage), TB SP-B2/Q15 (each station declares pause, reset, destroy or degrade), TB14/QL22 (named states) | X3, X4, X8 | *read:* `src/action_legibility.js` exists (X3); MR5 conserve what is conserved, SR13/SR15 legible cost and custody; MF2a "free load names the bottleneck" shipped ([MODULAR](../../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md) MF section) | *absent:* a station-level failure-policy field shown in the status line (Q15); graded fault sets (GT14) |
| X16 | **Persistent-cost magic: power is an account, a rate or an upkeep, not a one-shot spend.** | RM1/RM3 (soul-network account; shortfall paid in HP, 1 per 100 LP), RM6/RM7 (rituals are fixed-rate upkeep; at low LP they nauseate and skip a pulse, not stop), RM9/RM10 (typed per-chunk will), RM21/RM22 (four essences paid up front, destructive failure if pedestals change), RM26 (enhancers lower the gate, not the spend), GT20 (a chore bought off with vis) | X8, X11 | *read:* MR20 "magic input is a step with requirements and cost, not a free multiplier"; MF5 twelve-unit reservoir with incoming-room reservation (MODULAR MF section) | *word:* HP and LOTM docs mention paying in blood and health; not read. *absent:* a ritual as a standing upkeep with graded failure |
| X17 | **Calendar and body read the same clock, and each reads the other.** | SV11-SV18 (one integer clock, sub-seasons, sleep moves seasons, body temperature +1 summer/-1 winter), SV1-SV10 (lagging temperature state, water provenance, thirst), SV13 (fertility binary per season, off-season 1 in 6), RM12/RM15 (moon phase, night, attunement), GT13/GT20 (smog harm, hazmat) | X6, X8 | *read:* `src/world_calendar.js`, `src/weather_calendar.js`; MF27 rain reset on exposed drying and MF32 day_count weather vs service calendar (MODULAR); [HUNGER_AND_BODILY_NEEDS](../../../HUNGER_AND_BODILY_NEEDS_CONSIDERATIONS_2026-10-13.md) C4 says thirst, temperature and wear "deserve separate decisions" | *absent:* thirst, a lagged temperature state, water provenance. Deferred by C4, so not a defect; BHR1-BHR30 (RULES_INDEX, **not opened**) may already own part of it |
| X18 | **Authored-arc graphs: three separate questions (visible, startable, complete), tristate defaults, exclusive branches.** | QL1-QL4 (default / chapter / file inheritance; four dependency rules; max_completable_dependents), QL3 (linear vs flexible), WF1 (next building by slot priority x tier weight), RM15 (once-per-life choice), WF8 (level-ups are different acts per faction) | X7, X9 | *read:* exclusive branch for power progression ("settles costs, an exclusive branch and an enduring advancement receipt atomically", [ENGINE_AUTHORING](../../../ENGINE_AUTHORING.md) line 148); `src/quests.js` and `src/expansion_quest_ui.js` exist | *word:* whether `quests.js` separates visible from startable from complete; not read. *absent:* chapter-level default inheritance for quest policy |
| X19 | **Logistics accounting: plan, reserve, run, with promises counted as stock.** | TB24/TB25 and QL21 (plan tree, missing list, craft-less), SP-B4, TA14 (in-flight promises), QL16 (per-side connection config is the whole UI), TB21/Q7 (channel bandwidth), Q14 (kit batching) | X5, X9 | *read:* MF19/MF26 handcart depot, promised deliveries, reserved cargo and receiving space, delivered in runtime ([MODULAR](../../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md) MF19, MF26, MF33; [REPORT](../../../gm/dispatch/minecraft-fit-2026-10-21/REPORT.md)); `src/work_ledger_system.js`; TA F6 | *absent:* a plan-tree preview with a missing-inputs list, bandwidth tiers with nearest-first allocation, kit quotas as a release rule |
| X20 | **A local residue ledger with smooth decay, a spread floor and stacked thresholds.** | GT13 (pollution: x0.9945 per 1200 ticks, spreads only above 400,000, four stacked harms; confirmed in the verification pass), RM9/RM10 (will drained by crystals), TB5/Q10 (radiation sources fall off with distance), GT19 (finite fields) | X11 | *read:* only palette rows (TECH EC4 "pollution as something to research away", MODULAR MS12). SR20 requires a declared cause and clock for renewal | *absent:* any runtime or owner rule for a per-place residue with harm thresholds (`src/` has no pollution code) |
| X21 | **Faction and attunement rewrite the rules, not only the numbers.** | WF7 (vampirism replaces hunger with a blood meter), WF8/WF9 (level-ups are different acts; stations gated by skill), RM15 (once-per-life attunement), WF3 (two-layer reputation, culture gets 1/10 of every gain) | X6 | *read:* [IDENTITY_LAWS_BY_WORLD](../../../worlds/IDENTITY_LAWS_BY_WORLD_2026-10-14.md) exists; reputation is per region only (`src/reputation_state.js`, `src/reputation.js` add to `character.reputation[region]`) | *absent:* a second reputation layer above region (WF3); station use gated by a learned skill rather than a recipe (WF9) |
| X22 | **Stakes, keystones and sinks instead of throttles.** | ET10/Q-stake/Q-keystone (plant needs a stake of the real thing; top rung needs a placed object two below), ET9 (accelerator cannot sustain itself), GT17 (hub grows by physical modules) | X7, X10 | *read:* ECR30 "grow the sinks, don't throttle income" ([DOMAIN_RULES](../../../DOMAIN_RULES.md) line 307) | *word:* `src/systems_workshop_content.js` matched "stake" or "keystone"; not read |

X-codes are this document's; a lane's own code keeps its prefix (GT13, RM3, ET7, SP-B2).

## Conflicts between audits

### C1 Hand-set prices versus derived prices
The economy audit found the Mystical Agriculture essence table (hand-set, 4:1 ladder) disagrees with ProjectE's EMC for the same goods by 3x to 48x (ET7, ET21). Iron is 12x, copper 6x, gold 16x, diamond 3.6x, coal 48x, redstone 6x, lapis 20x, ender pearl 8x, ghast tear 16x, cobblestone 3x, netherite 28x (ET21, "inferred").

**Dependency on emc-cheat-spike.** Most compared goods (iron, copper, gold, diamond, emerald, coal, redstone, lapis, ender pearl, ghast tear, cobblestone) are pinned seeds, so the 3x-48x range stands without the solver. Only the crafted entries (netherite 28x, and any other recipe-derived good) wait on derived EMC values, which the [emc-cheat-spike](../../../audits/EQUIVALENCE_LEDGER_SPIKE_2026-10-23.md) session owns. This synthesis computes nothing there. ET24 already says ProjectE's buy = sell 1.0 is the opposite of ECR8, so the lesson is the same as ET21's: a world picks one pricing logic and states what produces it; arbitrage between two tables is allowed (ECR15) but should be a stated market feature.

### C2 How a tier fails
Sources disagree on what the first overload does, and each is internally legible (SP-B2):
- GT5U: over-voltage explodes the machine (GT12). GT CEu: it destroys the cable, not the machine (GT4).
- IE: wire is destroyed on first overload. Thermal: reset on brownout. Mekanism: meltdown with warning time.
- Blood Magic: no failure, the shortfall is paid in HP (RM3). Rituals skip a pulse and nauseate (RM6/RM7).
- Forbidden Arcanus: destructive failure if the setup changes mid-ritual (RM21/RM22).

Not a contradiction to settle: a station's failure policy is a per-station, per-world field (Q15). Cost to note: lethal overload makes every tier a hazard to people nearby, which the body rules would have to own.

### C3 Maintenance: switch versus tax
CEu maintenance blocks the recipe at any fault; GT5U costs 10% efficiency per missing tool and stops only at six (GT14, confirmed in source). Both audits recommend the graded tax for a slow-living game. Dial: percent per fault, whether a total-failure state exists.

### C4 Depletion shape
CEu bedrock fluid keeps a trickle floor (GT6); GT5U ends truly (GT19); IE counts buckets (TB15); AE2 budding blocks decay per growth (TB31). All valid; per-world dial (SR20 asks for a declared cause and clock).

### C5 Fixed numbers versus "limits are adjectives"
Several sources use hard integers where this repo says per-world adjectives (MR15, AD22): GT G3 amps, RM11 budget 100 or 300, ET8 `0.5 x tier + 0.5`, WF3 one tenth, WF6 5 diplomacy points. Treat each number as one illustrative setting, not a spec. This is the same caution as ET22's adjective table.

### C6 What a quest engine gates
QL5/QL6 and EP1 agree that neither FTB Quests nor pack engines gate crafting; they gate display and payout, and real gating is a stage reward calling another system. WF9 (Vampirism) gates stations by learned skill instead. SR17 ("learning and function are separate results") and MR19 favor the second shape when the skill is an actual means; use the quest shape when the gate is knowledge of the world.

### C7 Commitment recoverability
X7 (2026-10-14) says commitments are recoverable at a price; RM15 attunement is once per life unless a consumable undoes a perk; QL4 exclusive branches end siblings. Reconcile by dial: each commitment declares who can undo it, at what cost.

### C8 Recurring tier ratio
x4 recurs: GT voltage steps (GT2), Mystical essence ladder (ET6), AE2 and Mekanism tier tables (SP-B3). Convergence on one integer is weak evidence of anything (small integers are common); GT's own Open item asks whether this repo wants x4 or a per-world step. Per-world.

## Which are the weakest evidence

- **Single-read:** GT18 bauxite, purification and nanite chains, GT17 module parallels (see the verification pass in the GT file).
- **Reader-only numbers:** TB AE2 drains, IE vein weights, Thermal timers, Mekanism fission constants (TB "Corrections and caveats").
- **Not computed:** derived EMC values (ET "Not read"), left to emc-cheat-spike.
- **Headline-level only in this synthesis:** RM, SV, WF, QL.

## What I checked and corrected this session

- GT5U verification: 8 claims re-read in source (see the "GT5U verification pass" section of the GT file). Wrong: the throttle formula (V3). Unverifiable: the tier-skip penalty (V5), elevator module parallels beyond the miner (V6).
- TB owner check: see the "Owner check" section of the TB file. Q6 has no owner; Q8 and Q10 are partial.
- ECR owner is [DOMAIN_RULES](../../../DOMAIN_RULES.md#economy-rules), not ECONOMY_RULES.

## Suggested router and AD changes (proposals; none made)

No AD line needs to change: AD38 (things work by how they work) and AD22 (limits are adjectives) already cover every item above, and the equivalence-ledger direction belongs to the emc-cheat-spike session. If Weibao later selects X20 (residue ledger) or X14 (hard tier gate with asymmetric failure), the router in RULES_INDEX would need a row pointing those tasks at SR20, MR5, MR15 and this file. Until then the router is correct as it stands.
