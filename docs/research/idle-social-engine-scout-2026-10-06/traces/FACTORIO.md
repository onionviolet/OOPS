# Factorio and Space Age: living lots and useful quality

**Disposition: trial an original lot-identity contract in YAIRPG; adapt patterns, add no dependency.** The two selected stable paths are living egg supply -> research or hostile expiry, and sacrifice of usable armor -> lossy parts -> quality-qualified equipment space. Public Lua establishes definitions and recipe generation. C++ consumers remain documented and untested, so these are qualified declarative traces, not full engine-source or runtime proofs.

Stable source: `2.0.77`, commit `ce6741a54c3199caad4ed147e9987fd8d5653fdf`. Experimental exception source: `2.1.21`, commit `374934f81f82b09ec9fc459f92a316bd642ddd82`, added 2026-10-06. Both API JSON documents match their exact version. [Official download page](https://factorio.com/download) lists stable 2.0.77 and the 2.1.21 experimental changelog. Cached `/latest/` HTML sometimes returned 2.1.20, so the downloaded versioned API JSON is authoritative for this report. [Machine evidence](FACTORIO.json) records exact ranges, versions, hashes and API member selectors.

Raw selected source, API JSON, store snapshots, manifests and authoring/self-review logs stay outside Git at `/Users/weiwei/.codex/research/idle-social-engine-scout-2026-10-06/factorio/`. No Lua was evaluated and no game binary was downloaded, installed or run. The official [factorio-data repository](https://github.com/wube/factorio-data) describes a generated prototype-data reference for mod authors; it does not publish the complete engine. Most downloaded content remains unread.

## FACT-T1: a living input can renew supply or be spent

| Stage | Stable 2.0.77 observed definition or documented consumer | Evidence |
| --- | --- | --- |
| Acquisition and prerequisite | When an appropriate stomper shell already exists, its two-second base mining definition can yield zero or one egg already 50% spoiled. Initial combat/shell creation is outside this trace. Biochamber and science recipe permissions require separate prior technologies and craft triggers; biological recipes require pressure 2000. | F06, F08, F10 |
| Decision and real means | Keep a seed alive through reproduction, consume it with bioflux for science, burn it as chemical fuel, or hold it and risk expiry. Reproduction consumes one egg, 30 nutrients and 60 water over 15 base recipe seconds; science consumes one egg and one bioflux over four base recipe seconds. Biochamber separately burns nutrient fuel at 500kW and has speed 2, productivity and module effects, so ingredients alone are not total operating cost. | F07–F10, F23 |
| Mutation | Successful non-spoiled reproduction defines two fresh eggs. One seed-return output is ignored by productivity; not every returned item gets multiplied. Stable recipe-level `reset_freshness_on_craft` is conditional, according to the matching API. Actual crafting/fuel/quality/random execution is closed C++. | F08–F09, A01 |
| Useful consumer | Space Age inserts agricultural science into base lab inputs. Tree-seeding consumes it alongside four other science types for 50 research units and unlocks wood-processing. The pack itself is a tool with one-hour spoil time and becomes spoilage. Source data binds the consumer; engine research and freshness value are documentation-only here. | F07, F10–F11, A04 |
| Failure and aftermath | Egg base lifetime is 15 minutes; the half-spoiled acquisition has only 7.5 base minutes remaining. Each expired egg defines a hostile premature big wriggler trigger. Non-colliding placement, fallback and abort-over-space qualify that result. Wrong pressure, absent seed or unfunded fuel means permission cannot supply output. Engine mid-craft loss/refund, stack merging and exact tick order were not read or executed. | F06–F09, A02–A03 |

The transferable decision is **renew a scarce living source or spend it on a terminal function before it changes**. It includes real acquisition age, a separate fuel owner and a physical aftermath. It is richer than another recipe or an actor-wide “fresh” buff. Historical [FFF-414](https://factorio.com/blog/post/fff-414) explains inherited freshness, but it is a 2024 design document; exact 2.0.77 engine aggregation and lab value remain inaccessible in public Lua.

## FACT-T2: useful armor is the price of lossy salvage

| Stage | Stable 2.0.77 observed definition or documented consumer | Evidence |
| --- | --- | --- |
| Prerequisite and choice | Own actual MK2 armor, unlocked recycling and supplied power. Quality research separately admits uncommon/rare. Choose to wear/keep the useful object or sacrifice it. With planetary Space Age enabled, recycler acquisition requires Fulgora vault mining and manufacture is gated by magnetic field 99; a known recipe is not sufficient everywhere. | F11, F15, F18, F20, F22 |
| Real expenditure | Armor costs 25 efficiency-module-2, 25 speed-module-2, 60 processing units, 40 electric engines and 30 low-density structures over 25 base recipe seconds. Reverse generation consumes one armor, derives quarter solid-ingredient quantities with fractional extra returns, and discards fluids. Recycler adds 180kW electricity at speed 0.5. Quality modules cost circuits/time and trade speed for quality; productivity is excluded from recycler effects. | F13–F14, F16, F18–F19, A07 |
| Mutation | Public `data-updates.lua` actually invokes the generator and creates hidden reverse recipes, with separate self-recycling fallbacks. C++ consumes the sacrificed item and samples returned ingredients/quality. Integer parsing, sampled yields and quality preservation are not source-demonstrated here; one attempt is not a guaranteed quarter refund. | F16–F17, A07 |
| Functional consumer | MK2 armor binds a 10×10 equipment grid. Rare quality has level 2; matching API width/height bonuses default to level, giving a documented 12×12 target. That changes which owned equipment can fit together. The engine insertion API returns equipment or `nil` when it cannot be added. Actual layouts, power supply and body/inventory effects remain untested. | F12, F20–F21, A05–A06 |
| Failure and exception | Fluid loss, multiple products, excluded recipe categories and `auto_recycle=false` differ from ordinary reversal. A self-recycling fallback survives only 25% of attempts and can destroy the item. No universal dismantle refund, always-profitable loop or guaranteed Legendary result follows. Equipped-armor removal protection and inventory shrinking are unread. | F16, F18, A06–A07 |

The useful quality join is **capacity for a different combination of real means**, beyond another damage/defense multiplier. Historical [FFF-375](https://factorio.com/blog/post/fff-375) explains the lossy loop and larger armor grids. Current public data/API qualify the selected fields; they do not show full engine execution or justify a new YAIRPG spatial inventory.

## Broader dependency and exception map

- **acquisition -> existing age -> delivery urgency:** An obtained egg can be half-aged. Two same-ID lots have independent deadlines; one actor condition/item counter cannot represent both. Original implication: A request can require the actual timely sample without retroactively aging ordinary old stock. (F06, A02)
- **seed -> feed/water/fuel -> retain supply or terminal consumer:** The living input can be kept renewable or spent on science. Ingredient nutrients and separate burner fuel are distinct costs. Original implication: Maintenance of a local culture competes with useful terminal work and needs actual holder/site/means. (F08, F09, F10)
- **expiry -> actual aftermath entity -> placement exceptions:** Expired goods can cause a new world entity rather than vanish. Collision/space exceptions qualify delivery. Original implication: A bounded original spill/specimen aftermath belongs at actual holder/site, not a global debuff or automatic forced combat. (F07, A03)
- **knowledge -> local environment -> transported physical means:** Pressure/magnetic-field gates separate permission, production and physical compatibility. Original implication: Methods can travel as memory while materials, apparatus and site decide execution; no extra world needed for initial proof. (F08, F10, F11)
- **lossy salvage -> quality investment -> combinable equipment:** A useful object is sacrificed; documented quality grid capacity changes what can fit together. Original implication: Larger housing could support a new tool combination with body/power/custody costs, beyond existing gear stats/fixed optical assembly. This larger design is unselected. (F16, F19, F20, F21, A05, A06)
- **noninvertible processing -> scarce recoverable components:** Fluid loss, recipe exclusions and 25 percent self-return are distinct from reversible optical disassembly. Original implication: Disclose exact salvage classes; no universal recovery/upcycling economy. (F16, F17, F18)
- **stable2.0 -> experimental2.1 -> expansion modules:** 2.0 requiresQuality;2.1 splitsRecycler/recommendsQuality, revises generation and quality/spoil qualifiers, and disables asteroid quality reprocessing. Original implication: Keep optional content/version contracts explicit; experimental lifetime effects do not prove stable 2.0 or native behavior. (F03, F04, X02, X03, X04, X05, X06, X07, A08, A09, D03)

The implementation packet stays small; this map retains wider consequences rather than treating one packet as all that was learned. Unselected questions are exact stack splitting/merging/freshness and mid-job expiry, actual equipment layout/power/body consumers, lot custody through absent-world clocks, and version-qualified 2.1 material/science exceptions. None requires restarting the whole game audit or making gameplay implementation wait.

Additional retained exceptions: experimental biter eggs declare 25 items per expiry trigger, unlike the selected pentapod one-item trigger; exact grouping/rounding is engine-owned. Experimental reproduction moves the reset-freshness flag onto a product, while stable uses the recipe-level field. Keep species and version field scope explicit. These exploratory windows X08–X09 are not a third selected trace.

## Stable base, paid expansion and experimental differences

| Edition/module | Actual inspected reach | Limit |
| --- | --- | --- |
| Base 2.0.77 | Selected armor, recipe, grid and technology definitions | Full base factory/combat/logistics unread. Numeric quality engine support does not mean base users can enable expansion quality tiers. |
| Space Age 2.0.77 | Selected biology, environment, expiry/science and recycler acquisition joins | Other planets, platforms, ecology and late game unread. Quality and Elevated Rails are hard dependencies in this stable metadata. |
| Quality 2.0.77 | Selected tiers/modules, generator/fallback, recycler and grid docs | Can be selected without planetary Space Age content by an expansion-entitled user. Engine higher qualities remain expansion-gated; ownership is unknown. |
| Elevated Rails and soundtrack DLC | Metadata/store inventory only | Content, cosmetics/audio and runtime unread; no gameplay reading claim. |
| Experimental 2.1.21 | Selected module and exception windows only | Recycler is split into its own module and Quality becomes recommended/disableable for Space Age. No installed or stable-runtime claim. |

The [official 2.1 explanation](https://factorio.com/blog/post/fff-442) matches the experimental metadata: recommended Quality, separate Recycler and removal of asteroid quality reprocessing. Current experimental generator timing scales by recipe result count and has a minimum; quality effect values/probabilities and material lifetime qualifiers changed. These are separate from the primary stable trace. In particular, 2.1 API lifetime effects do not establish that quality extends stable 2.0 shelf life or changes YAIRPG item age.

US store snapshots checked 2026-10-06 are **$35 for Factorio and $35 for Space Age**, or $70 before tax if neither is owned. Space Age requires the base game. These are current public storefront facts, not entitlement/install findings: [base primary store endpoint](https://store.steampowered.com/api/appdetails?appids=427520&cc=us&l=english), [Space Age primary store endpoint](https://store.steampowered.com/api/appdetails?appids=645390&cc=us&l=english), [official expansion purchase page](https://factorio.com/space-age/buy). Public Lua/API inspection required no payment or install. The dispatcher found no matching installed payload; no private ownership/account state was read.

No `LICENSE`/`COPYING` file appeared in the repository file inventory. Its README supports references, calculators and mod-author inspection/linking; that is not a selected general code-library license. Commercial engine/assets and API documentation are separate. The trial copies no code, prose, art or audio, uses original wording and preserves YAIRPG attribution/LICENSE.

## Original proof FACT-P1: two independently aging assay cultures

Live YAIRPG already has actor-owned inventory/custody, numeric item quality, energy reserve/strain, paid supported jobs, expiring body conditions, paid measurement research, a built jig, resin/kit consumers and useful loose/assembled optical instruments. Current delivery remains implemented-unverified. The new gap is exact **material-lot identity and age through ownership, reservation and useful consumption**, not another condition, inventory, job scheduler or quality bar.

The proposed player behavior stays at Eda’s existing permitted Village bench in the same body/realm. After existing terms and understood research, prepare at most two original Live staining vial lots at different played-clock times. Each preparation spends one owned Tree sap, one newly authored Empty assay vial and one stamina over two minutes; each actual output has its own six-minute live window. New vial definitions/bindings are future selected content, not an assumption that these items already exist. Old ordinary Tree sap stays stable.

Spend one live lot on a three-minute bench assay with Eda's actual present consent, usable body and existing supported Grain matching method. Pay her one native coin and spend one stamina from each participant. The assay reveals a current defect on one held repair piece and records firsthand understanding that qualifies one corrective fitting action. The assay changes the used live vial to one spent vial for later cleaning, conserving its glass. No tool, repair stock or numeric quality is granted. The corrective fitting target needs one explicitly bound repair-object identity; a shared fact on two fungible same-key pieces is insufficient. A separate two-minute stabilization spends one sap and one player stamina, irrevocably changing the live vial into an inert calibration film plus the returned empty glass vial. The film supplies one ordinary jig-calibration use on a known repair layout, but can no longer perform the living assay. Or retain the live sample for another piece and accept its own deadline.

At its own deadline, live lot becomes one Spent staining vial at actual holder/site, once only. Glass remains; observed failed-sample/spill record, no forced NPC damage/combat. A 1 minute/1 stamina cleanup returns one Empty assay vial without knowledge/material reward.

This preserves a useful distinction: live assay discovers a piece-bound fault, stabilization produces an inert calibration function and expiration leaves recoverable glass without the live function. Fiction, prices, balance and those consumers are original proposals requiring authoring. The quality-capacity housing idea remains a larger unselected design, so the small proof does not quietly import Factorio armor grids or gambling loops.

| Existing owner to reuse | Exact new consumer/contract needed |
| --- | --- |
| `src/items.js:231,1209` | Lot identity/deadline absent from current key/reconstruction; arbitrary extra JSON fields can be ignored. Select validated binding/migration, not second inventory. Bind one supported repair-object identity for the assay result before content authoring. |
| `src/simulation.js:176,390` | Frozen costs/effects and boundaries lack material-lot expiry/reservations; retain original deadline and qualify terminal result at common-clock boundary. |
| `src/simulation_effects.js:170 / src/gameplay_transactions.js:27` | Full-key/count spends/returns and numeric quality checks need explicit conserved lot binding through custody/transfer/refund. |
| `src/expansion_persistence.js:7 / src/main.js:528` | Validators and native reconstruction must roundtrip lot/reservation/age in existing envelope; failure cannot publish partial or refreshed goods. |

Integrator must select optional additive lot schema/default absence and exact native binding before code work. No legacy aging/enrollment/reward, no copied timers/offline policy, no global gear-quality rewrite. Reservation/cancellation/refund retains original lot age rather than recreating fresh input.

At clock==expiry the live assay is invalid even if job due also equals expiry. Check expiry before result or require expiresAt>clock at completion. Current jobs settle before actor conditions, so a generic expiring actor condition is insufficient. Once-per-lot causes prevent duplicate conversion; proof stays local until absent-world policy is chosen.

This is moderate shared native/save/job contract work, larger than a leaf recipe. The source-ready packet is conditional on a selected lot binding and compatible validation/reconstruction policy. Keep one clock and one publisher; an expiry timer or unvalidated side inventory would duplicate owners and weaken actual custody.

### Later observable acceptance, all unrun

1. Prepare two actual lots at different clock instants in generated state; verify physical vial/sap/stamina costs, distinct ID/deadline and no unknown/legacy/knowledge-only grant. Existing sap/gear quality unchanged.
2. Use the older live lot in the paid assay while the younger remains owned. Observe one coin entering Eda's purse, each participant's one stamina payment and piece-bound defect knowledge, with no free stock/gear. A used live lot cannot be reused.
3. Reach exact expiry while owned/transferred/reserved, including completion tie; once-only spent-vial conversion and failed assay at true holder/site, no refreshed refund or actor-global aging. Younger lot remains valid.
4. Compare live assay, stabilized calibration and expired cleanup consumers. Stabilization forfeits live assay; cleanup returns one glass vial only. Contact/body/site failure respects disclosed job policy while original age persists.
5. After selected implementation/rebuild, generated reload/export/import preserve lot ID/deadline/custody/reservation; failed save publishes no partial inventory/age/clock mutation. All these checks currently not run.

No runtime source was changed, rebuilt or tested. Unit/browser/gameplay/reload/import/save-failure/director gates remain deferred. A code definition, retrieved API field or source report does not certify installed-game behavior or the proposed YAIRPG proof.

## Exact source and API locators

The JSON/external manifest retains full-file SHA-256, exact ranges and live dirty-source fingerprints. Source classification is inspection of Lua definitions/generation; APIs are official documented C++ contracts. Only the listed windows and API members qualify the reported claims; exploratory views and searches do not establish complete family or whole-game reading.

| ID | Version and pinned source window |
| --- | --- |
| F01 | 2.0.77-stable · [README.md](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/README.md#L1-L23) · 1–23 |
| F02 | 2.0.77-stable · [base/info.json](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/base/info.json#L1-L9) · 1–9 |
| F03 | 2.0.77-stable · [quality/info.json](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/quality/info.json#L1-L11) · 1–11 |
| F04 | 2.0.77-stable · [space-age/info.json](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/space-age/info.json#L1-L16) · 1–16 |
| F05 | 2.0.77-stable · [elevated-rails/info.json](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/elevated-rails/info.json#L1-L11) · 1–11 |
| F06 | 2.0.77-stable · [space-age/prototypes/entity/enemies.lua](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/space-age/prototypes/entity/enemies.lua#L3971-L3975) · 3971–3975, 4010–4020 |
| F07 | 2.0.77-stable · [space-age/prototypes/item.lua](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/space-age/prototypes/item.lua#L1148-L1213) · 1148–1213, 68–88 |
| F08 | 2.0.77-stable · [space-age/prototypes/recipe.lua](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/space-age/prototypes/recipe.lua#L379-L408) · 379–408, 784–805 |
| F09 | 2.0.77-stable · [space-age/prototypes/entity/entities.lua](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/space-age/prototypes/entity/entities.lua#L90-L95) · 90–95, 108–121 |
| F10 | 2.0.77-stable · [space-age/prototypes/technology.lua](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/space-age/prototypes/technology.lua#L928-L958) · 928–958, 1091–1139 |
| F11 | 2.0.77-stable · [space-age/base-data-updates.lua](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/space-age/base-data-updates.lua#L275-L278) · 275–278, 911–931 |
| F12 | 2.0.77-stable · [quality/prototypes/quality.lua](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/quality/prototypes/quality.lua#L1-L58) · 1–58 |
| F13 | 2.0.77-stable · [quality/prototypes/item.lua](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/quality/prototypes/item.lua#L5-L20) · 5–20 |
| F14 | 2.0.77-stable · [quality/prototypes/recipe.lua](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/quality/prototypes/recipe.lua#L4-L13) · 4–13 |
| F15 | 2.0.77-stable · [quality/prototypes/technology.lua](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/quality/prototypes/technology.lua#L3-L34) · 3–34, 146–169 |
| F16 | 2.0.77-stable · [quality/prototypes/recycling.lua](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/quality/prototypes/recycling.lua#L75-L120) · 75–120, 122–155, 158–184, 187–218, 221–240 |
| F17 | 2.0.77-stable · [quality/data-updates.lua](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/quality/data-updates.lua#L1-L27) · 1–27 |
| F18 | 2.0.77-stable · [quality/prototypes/entity/entity.lua](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/quality/prototypes/entity/entity.lua#L47-L65) · 47–65 |
| F19 | 2.0.77-stable · [base/prototypes/recipe.lua](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/base/prototypes/recipe.lua#L1870-L1883) · 1870–1883 |
| F20 | 2.0.77-stable · [base/prototypes/item.lua](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/base/prototypes/item.lua#L3705-L3709) · 3705–3709, 3731–3743 |
| F21 | 2.0.77-stable · [base/prototypes/equipment-grid.lua](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/base/prototypes/equipment-grid.lua#L17-L23) · 17–23 |
| F22 | 2.0.77-stable · [base/prototypes/technology.lua](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/base/prototypes/technology.lua#L3439-L3465) · 3439–3465 |
| F23 | 2.0.77-stable · [core/lualib/util.lua](https://github.com/wube/factorio-data/blob/ce6741a54c3199caad4ed147e9987fd8d5653fdf/core/lualib/util.lua#L883-L885) · 883–885 |
| X01 | 2.1.21-experimental · [base/info.json](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/base/info.json#L1-L9) · 1–9 |
| X02 | 2.1.21-experimental · [space-age/info.json](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/space-age/info.json#L1-L16) · 1–16 |
| X03 | 2.1.21-experimental · [quality/info.json](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/quality/info.json#L1-L12) · 1–12 |
| X04 | 2.1.21-experimental · [recycler/info.json](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/recycler/info.json#L1-L11) · 1–11 |
| X05 | 2.1.21-experimental · [recycler/recycling.lua](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/recycler/recycling.lua#L98-L123) · 98–123, 245–265 |
| X06 | 2.1.21-experimental · [space-age/prototypes/recipe.lua](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/space-age/prototypes/recipe.lua#L1041-L1048) · 1041–1048, 1062–1069, 1083–1090 |
| X07 | 2.1.21-experimental · [quality/prototypes/item.lua](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/quality/prototypes/item.lua#L5-L20) · 5–20 |
| X08 | 2.1.21-experimental · [space-age/prototypes/item.lua](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/space-age/prototypes/item.lua#L1090-L1156) · 1090–1156 |
| X09 | 2.1.21-experimental · [space-age/prototypes/recipe.lua](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/space-age/prototypes/recipe.lua#L382-L410) · 382–410, 798–819 |

| ID | Versioned API member selector |
| --- | --- |
| A01 | 2.0.77 · [RecipePrototype.reset_freshness_on_craft,result_is_always_fresh,energy_required,surface_conditions](https://lua-api.factorio.com/2.0.77/prototype-api.json) |
| A02 | 2.0.77 · [LuaItemStack.spoil_tick,spoil_percent,quality](https://lua-api.factorio.com/2.0.77/runtime-api.json) |
| A03 | 2.0.77 · [ItemPrototype.spoil_ticks,spoil_to_trigger_result,spoil_result](https://lua-api.factorio.com/2.0.77/prototype-api.json) |
| A04 | 2.0.77 · [LabPrototype.inputs](https://lua-api.factorio.com/2.0.77/prototype-api.json) |
| A05 | 2.0.77 · [QualityPrototype.default_multiplier,equipment_grid_width_bonus,equipment_grid_height_bonus,level](https://lua-api.factorio.com/2.0.77/prototype-api.json) |
| A06 | 2.0.77 · [LuaEquipmentGrid.put,width,height](https://lua-api.factorio.com/2.0.77/runtime-api.json) |
| A07 | 2.0.77 · [ItemProductPrototype.extra_count_fraction](https://lua-api.factorio.com/2.0.77/prototype-api.json) |
| A08 | 2.1.21 · [ItemPrototype.quality_affects_spoil_ticks,spoil_quality_change,lab_ignores_spoil_percent](https://lua-api.factorio.com/2.1.21/prototype-api.json) |
| A09 | 2.1.21 · [QualityPrototype.spoil_ticks_multiplier,next_probability,chain_probability](https://lua-api.factorio.com/2.1.21/prototype-api.json) |

Documentation self-review checks pin, source hashes/ranges, versioned API selectors, JSON cross-references and local links. Remote HTML caching and engine behavior are not inferred from that check. Raw sources, stable/experimental metadata and current price snapshots remain outside project Git.
