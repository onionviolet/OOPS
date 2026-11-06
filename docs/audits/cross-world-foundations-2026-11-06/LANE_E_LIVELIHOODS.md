# Lane E: livelihoods and production across worlds, 2026-11-06

Round 3 of the [larger foundations audit](../LARGER_FOUNDATIONS_2026-11-06.md) (FD14-FD18, rounds 1-2). Weibao, 2026-11-06: "Can we address all of these? Deeper dive in in terms of little stuff long term? from little details to extend possibility in all worlds? like choosing to farm, or choosing to start a society, or mining? Or building? Or researching? or group or other functional abilities that should be shared across all the worlds?" This lane covers farming and herding, gathering, mining and quarrying, fishing and hunting, building, crafting chains, upkeep, storage and selling. Researching, groups and societies belong to the other lanes.

Everything here is a proposal (AD32). No code, no commits. Codes are lane-local: E-R reconcile rows, E-O outcomes, E-S seams, E-M more-to-consider, E-G gaps. Labels: **shown** (file:line read this pass), **stated** (an owner doc says it, not re-read in source), **inferred** (this lane's reasoning or an original proposal, MR13 ORIGINAL).

**Counting method.** Importers are files in `src/` plus `scripts/` whose import path ends in the module name, excluding the module itself; `tests` is the count of test files. Round 2 counted `world_rhythm.js` at 27 importers; this method gives 39 (it includes `scripts/` and every path-suffix match). The two numbers are not a disagreement. Which world uses a module comes from reading the module (a world id constant), not from importer file names. The doc-owner reads were partial (headings, tables, rule rows).

## Headline

1. **Shown:** nearly every livelihood module is Frontier/Village only, and most have one or two importers. The shared pieces are time and money (`world_rhythm.js` 39 importers, `world_calendar.js` 9), not production. This is the same pattern as rounds 1-2: more seams than consumers.
2. **Shown:** the farming-and-making design is not missing. SSD10 and SSD70-SSD82 already hold the dial vocabulary, pools, promotion and lazy catch-up. What is missing is a second world exercising any of it, rights and dues, and a build-project path that home building uses.
3. **Shown:** book worlds have near-zero runtime livelihood code. A grep of `src/book_world_*` and `src/world_packs/` for farm, crop, garden, harvest, orchard and granary words finds one file (`book_world_paradise_ecology.js`, which imports the carcass `harvest.js`), so even that hit is probably animal harvest (inferred; the file was not read).

## Step 1: reconcile

### Existing owners (docs)

| Owner | What it holds | Role in this lane |
|---|---|---|
| `docs/SUBSYSTEM_SCOPE_LADDERS_2026-10-16.md` SSD10, SSD20-SSD50, SSD70-SSD82 | Six dials (Space, Stock, Time, Actors, Knowledge, Consumers) with rungs R0-R4; farming SSD30, ranching SSD40, fishing SSD20; shared ideas SSD71-SSD82 (shown: headings and SSD30, SSD70 tables read) | The main prior art. This lane extends it; it is not a new frame |
| `docs/MAKING_RULES.md` MR1-MR36 | Truth, chance, recipes, mastery, materials and sources (MR25-MR28), persistence (shown: read in full) | Binds yield, harvest rolls and conservation. MR28 harvest rolls key on game time |
| `docs/CRAFTING_ENGINE.md` | `craft_materials`, `craft_resolver`, `craft_recipes`, `craft_sources`, `craft_state` modules; Frontier herbal example pack (shown: module table read) | The crafting side. `craft_sources.js` is the gather-to-material route |
| `docs/GATHERING_AND_RESOURCE_USES.md` | Five resource families, site renewal and access, characters give finds a purpose (shown: read to line 70) | Content-breadth palette for gathering |
| `docs/MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md` | Chains as graphs, X1-X19 corrections, MF1-MF19 Minecraft fit (shown: sections read) | Chain shape and the deferred MF13 settlement idea |
| `docs/ACTIVITY_ABSTRACTION_RULES.md` ACR1-ACR14 | Compress repeated work, interruption settles, parallel work names performers (shown) | How repeated production is presented |
| `docs/DOMAIN_RULES.md` ECR1-ECR33 | Selling, quotes, wealth, institutions, property upkeep (shown: rule rows read) | Selling, dues, theft and property constraints |
| `docs/worlds/WORLD_CORE_KIT_2026-10-14.md` K8, K9, K25, K28 | Daily life and economy, items and craft (K9.3 tech ceiling, K9.4 wear and repair), personal space, seasons and weather (shown: rows 70-71, 200-222, 496-499) | Per-world checklist; nothing reads it at runtime |
| `docs/PROTO23_VILLAGE_LIFE_LOOPS_2026-10-14.md` | Village watch, weekly market, courier, relay (shown) | Paid loops, not a livelihood system |
| `docs/SHARED_FOUNDATIONS_AUDIT_2026-10-12.md` U09 | Owner versus holder versus access; land rights as local variation (shown: row 60) | Origin of the rights question |
| `docs/worlds/NONHUMAN_MAKING_AND_BUILDING_2026-10-14.md`, `MAKER_ARTS_BY_WORLD_2026-10-14.md` | Making without hands; per-world maker arts (stated: headers read) | Nonhuman and per-world makers |
| `docs/worlds/*_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_*.md` | Per-world institutions; keyword counts only (farm, mine, build, tax words), not read for content | Where outcomes E-O3 and E-O8 get their world detail |

### Existing owners (source), with importers and world

| Module | Does (shown) | Importers / tests | World |
|---|---|---|---|
| `src/activities.js:156,174,211` | Upstream gathering activities: mining, woodcutting, fishing as loot-table activities | broad (upstream) | Frontier only; shown |
| `src/tool_profiles.js:3`, `src/tools_domain.js` | `VERB_BY_SLOT` pickaxe=mine, axe=chop, sickle=cut, shovel=dig, fishing_pole=fish; hardness and precision "do not change gathering today" (header comment); per-instance durability and repair | 2 / 1; 3 / 3 | Frontier tools; shown |
| `src/management/shipping_farming.js:22-24,39-42` | MG06: pay Mira 4 coins for `actor.mg.plotRight`, plant greens or grain, tend, harvest once; plot right is a fact | 1 (`management/content.js`) / 0 | Village; shown |
| `src/mistglass_seedbed.js:12` | Seedbed crop `readyAt = sownAt + 120` on the retained room clock; harvest pays energy | 1 / 1 | Mistglass realm only; shown |
| `src/world_completion_crop_clock.js:10` | Frost-warning crop plot holds its checks when the body clock is unsupported; gated to `base.frontier` | 3 / 0 | Frontier; shown |
| `src/habitat_care.js:5` | One meadow pen, one fleece sheep, build 18, feed 2, yield 5 wool, played-care policy; world `base.frontier` | 2 / 1 | Village; shown |
| `src/systems_irrigation_model.js` header | "Original bounded proposal... a model, never native stock"; 3 beds, 6 ticks | 2 / 1 | none (model); shown |
| `src/harvest.js:6-8` | Carcass harvest for wolf rats (HV1): pelt, tail, fang | 22 / 11 | Frontier combat loot; shown |
| `src/craft_sources.js`, `craft_state.js`, `craft_materials.js` | Seeded, frozen materials; location sources; harvest nodes keyed by world, place, source, minute | 6, 6, 14 / 2, 6, 10 | Frontier herbal example pack plus one paradise import; shown by importer filenames |
| `src/home_building_model.js:6`, `home_content.js:3,63,76`, `home_work_content.js:10` | Build, repair and weatherproof projects for tent, nest, burrow, shelter; materials held as project custody; rain wears integrity; one progress key `home.work.<home>.<kind>`; `HOME_WORLD='base.frontier'` | 6 / 1 | Frontier; shown |
| `src/site_projects.js:1-2`, `field_workshop.js:3,87`, `home_furnishing_content.js:4,61` | Phased projects compiled to world facts, claims, owned inputs and jobs; one progress owner | 3 / 1 | Frontier (`field_workshop.js:7` worldId); shown |
| `src/home_household.js:4-8`, `home_staff.js`, `home_workers.js`, `home_warehouse.js` | Manor staff (steward, cook, keeper, tutor), wages, energy, leave, pantry orders from a supplier | 4, 4, 5, 5 / 3, 0, 1, 1 | Frontier manor; shown |
| `src/home_cultivation.js` | Qi cradle appointments with a cultivation keeper. **Not crops.** | 2 / 0 | Frontier manor; shown |
| `src/systems_workshop_runtime.js:1` | Finite perishability on the played clock; sealed goods keep revision-1 preservation | 3 / 1 | Frontier; shown |
| `src/market_saturation.js:4` | Upstream per-region `loot_sold_count` with recovery | 6 / 1 | Frontier trade; shown |
| `src/gathering_model.js:1-5`, `gathering_panel.js` | Pure read of gather sites into a table, optional season band, no season names (AD46) | 5 / 1 | world-neutral by design; shown |
| `src/world_calendar.js:7,31`, `world_climate.js:111` | Four seasons only when the profile has them; rain computed from a modifier | 9 / 7; 2 / 1 | importer filenames hint at paradise, village and HP (not verified) |
| `src/world_rhythm.js` | Recurring windows, calendar minutes | 39 / 8 | broad; importer filenames include HP, LOTM, primordial (hint only) |
| `src/own_holdings.js`, `economy_standing_domain.js`, `owned_place_clock.js` | Purse and holdings; standing; a home with its own clock ratio (Hearthside) | 7, 3, 2 | HP, LOTM, Frontier |
| `src/recurring_duties.js`, `ready_stock.js` | FD8 duties (2 importers, LOTM), FD3 carried rounds (1 importer, LOTM B8 firearm) | 2 / 2; 1 / 1 | LOTM only |

### Reconciliation rows

| ID | Overlap | Class | Verdict and consequence |
|---|---|---|---|
| E-R1 | My intended seam set versus SSD10 and SSD70-SSD82 (pools, conditions as tags, promotion, lazy catch-up, one activity envelope, cross-links) | **Duplicate if restated** | Treat SSD as the owner. This lane only adds what SSD does not state: rights and dues (S7), a build-project path (S8), a cross-world site record (S1) and a second-world proof. Everything else cites SSD codes |
| E-R2 | Four crop and herd lifecycles: MG06 plot stages, seedbed 120-minute clock, frost plot phases, habitat batch | **Compatible variants** (same shape: owner, stage, clock, harvest) on one world | This is the AD51 evidence for one stage-clock reader. Different clocks (played room clock, body clock, played care) are legitimate per ACR8, so share the stage record and not the clock |
| E-R3 | `site_projects` phases versus `home_building_model` single progress key | **Incomplete integration** | Shown: `home_building_model.js` does not import `site_projects.js`; only `field_workshop` and `home_furnishing_content` do. Two project paths on one world. Home building keeps material custody in a form SSD and MR15 would accept, so the fix is a reader, not a rewrite |
| E-R4 | Wear: home `integrity` and `wetness` (`home_building_model.js`), tool durability (`absorb_e2/durability` through `tools_domain`), K9.4 | **Compatible variants** | Three wear owners, each with its own repair. `tool_profiles` hardness is not yet read by gathering (header comment), so tool tier does not change yield today. Share a condition projection, not a store |
| E-R5 | Mining, woodcutting, fishing (`activities.js`) versus SSD pools versus `craft_sources` harvest nodes versus HV1 carcass `harvest.js` | **Incomplete integration** | Four routes from "world" to "material". MDF3 and X2 in the modular doc already say divergence is representation, not seven save engines. Gather-to-craft is still unwired (X3, stated) |
| E-R6 | "Share only after two real consumers" (modular doc round 3 verdict, SR23) versus AD51 ("design one shared seam from the whole known sources", accepted 2026-11-03) | **Genuine disagreement, resolved by date** | AD51 is later and accepted. Default: design the seam from all known sources now, build only the slice (SR23 still limits the build), and let a second world validate it (FND5). The older "two consumers" line is stale as a gate and still right as a build-size limit |
| E-R7 | `GATHERING_AND_RESOURCE_USES.md` says generic cultivation, persistent patches and negotiated NPC relationships "are not established" (source at `97c28ef`, 2026-10-02) | **Stale in part** | Since then: MG06 plot, habitat sheep, seedbed, craft harvest nodes, home staff. Not general, but no longer absent |
| E-R8 | Plot rights: MG06 `plotRight` fact, ECR24 (ownership, custody, use separate), SR19 (access does not establish ownership), U09 | **Incomplete integration** | The right is a one-time 4-coin fact with no term, grantor record or dues. Compatible with ECR24 and SR19, but nothing models a landlord, tithe or lapse |
| E-R9 | Selling: ECR2 (merchant is the default sink), ECR3-ECR4 (per-good curve, one quote formula), `market_saturation.js` pools, SSD Consumers dial | **Compatible variant** | Upstream `loot_sold_count` is a pool in SSD71's sense (stated by SSD71). It serves Frontier trade only. No player shop, no standing orders, no household need as a buyer |
| E-R10 | Dues: ECR20 (institutions are world data, absence valid), ECR21 (forgiving credit), FD8 `recurring_duties` (LOTM only), MG06 rent (one payment) | **Incomplete integration** | No recurring due exists in any livelihood. FD8 is the natural carrier once a second world uses it |
| E-R11 | K8 and K9 checklists versus runtime | **Compatible variant** | Same finding as FD14 in round 2: a checklist nothing reads |
| E-R12 | Naming collisions | **Trap** | "Harvest" means three things (carcass `harvest.js`, craft harvest nodes, crop harvest in MG06). "Stock" means FD3 `ready_stock` (carried rounds, LOTM), SSD71 pools (population) and HV1 stock overflow. "Cultivation" in `home_cultivation.js` is qi. Seams below use different names on purpose |
| E-R13 | MF13 (settlement housing, worker networks) deferred versus `home_staff`, `home_workers`, MF25 residence-aware workers | **Compatible variant** | Manor staff exist for one manor. MF13 stays later; this lane proposes labour as a record (S3) and does not start a settlement simulation (AD33 defers NPC-heavy work) |
| E-R14 | Proto23 watch loop (12 coins, window 07:00-10:00 accept, until 20:00) | **Compatible variant** | A fixed-window paid job. It is the Village's only wage job shaped like an FD15 position (inferred). Keep the `absorb_c2/local_life.js` reward owner |
| E-R15 | Climate and season: `world_calendar` seasons optional (`:31`), `world_climate` rain (`:111`), FD9 weather (atlas line 71 names "Village farming" as a consumer), crop clocks on their own checks | **Incomplete integration** | FD9 has no farming consumer. Crops read none of season, rain or temperature (inferred from the four crop modules above, which show no calendar import) |

## Step 2: deepen backwards

Target viewport for any UI later: desktop, 1920x1080 primary (standing UI priority). Mobile deferred.

### Target outcomes

E-O2, E-O5 and E-O6 build on Frontier code; the rest sit in other worlds. All eight are **inferred / ORIGINAL** proposals (MR13), not canon. For example, the LOTM institutions doc has no landlady garden and the HP institutions doc names Hagrid only as a guardian role (shown by grep, `HARRY_POTTER_INSTITUTIONS...:70`), so no outcome below is canon.

| ID | Outcome (what the player sees and does) | State it needs | Existing owner | Gap |
|---|---|---|---|---|
| E-O1 | **Klein's landlady keeps a kitchen garden.** A row in the lodging place: "Mrs. X's back garden, 3 beds." He can help weed on a free evening, gets a share of greens, and the rent line shows a small offset. No tending is ever required | A named plot with holder (landlady), a stage clock, a favour record, a duty slot only if he accepts | MG06 plot shape; FD8 duties (LOTM); `world_events`; FD6 purse | Plots exist only in Frontier. No favour-for-share record. No second world. This is the AD51 validation world |
| E-O2 | **A Village farmer has a dry season.** Planted greens slow in a dry spell with the cause shown beforehand; neglect delays, never kills (SSD30 C12). A well run to the plot costs minutes and tools | Season and rain as stage inputs; plot condition values (moisture, fertility) | MG06, `world_climate.js:111` rain, `world_calendar.js:31` seasons, FD9 weather (no farming consumer) | E-R15. Crop stages read no weather. Small: one input to the stage clock |
| E-O3 | **A cultivator mines a spirit vein under sect rules.** The vein shows a pool ("rich, thinning"), a quota due weekly, a tool wear line, and a choice to dig past the quota for private gain at a risk of being noticed | Deposit pool, holder (sect), quota duty, tool wear, private-take channel | `tool_profiles` mine verb, `institution_store.js` (missions; 2 importers), `faction_rank.js` (7), FD8 duties, ECR17-ECR19 for theft | No deposit pool, no site rights, no quota. Primordial doc has sect labour and farming of recruits (stated, `PRIMORDIAL...:187-190`) |
| E-O4 | **Harry helps Hagrid with pumpkins.** A short favour: pick, carry, learn a gardening fact, get a small gift. No lasting chore | One-off helper chore with a return | FD11 lessons (`lesson.js`), `hp_animal_features.js`, FD6 | Needs a "help a person with their plot" action. Plot ownership stays Hagrid's (SR19) |
| E-O5 | **A player builds a workshop, then a shop.** Workshop stages (frame, roof, bench) with materials and labour-minutes; once built it unlocks recipes; a later project adds a counter that makes the output sellable to walk-ins, with a price board | Build project with phases; building as a station; a buyer channel | `site_projects` phases, `field_workshop`, `home_furnishing_content`, `trade.js` and `market_saturation` | Workshop path exists in Frontier. No shop channel (E-R9). Home building is on a separate path (E-R3) |
| E-O6 | **A frontier settler claims land and builds a cabin.** Pick a site, state the claim (who recognises it, what it costs), build in stages, rain wears the roof until weatherproofed | Claim record with grantor and dues; project; condition | `home_building_model.js` (tent, shelter, repair, weatherproof), `home_content.js:63` site, permit facts in `home_work_content.js` | The claim is a "permit" fact, not a right with a grantor. No dues |
| E-O7 | **A tenant farmer pays a share at harvest.** The harvest receipt splits: crop to household, share to the holder, with the date and what a miss means (a talk, a warning, a lost season) | Right with dues; harvest receipt; duty | FD8, FD6, ECR20, ECR21; TTKS doc has heavy tax vocabulary (stated by keyword count only) | S7 does not exist |
| E-O8 | **A Hunger Games district miner works shifts and poaches.** Shift duty in a coal seam, a wage, a legal hunting rule with a risk if caught outside it | Shift duty, deposit, law of the small | FD8, FD15 (proposal), `law_case.js` (0 importers per round 2), ECR17-19 | Hunger Games doc has mine and hunt vocabulary (stated by keyword count). No law consumer |

### Proposed shared livelihood seam set

Each seam is a **default / dial / reason** proposal. "AD51 split test" asks: do two or more worlds plausibly use this mechanism, and what stays world-specific?

| ID | Seam | What is shared | What stays local | AD51 split test | Composes (existing seam) |
|---|---|---|---|---|---|
| E-S1 | **Site record** (plot, bed, pen, claim, seam, pond) | id, kind, holder, grantor, access scope, condition values, clock ref | what it can yield, canon places, spirit land | Pass: garden (E-O1), vein (E-O3), claim (E-O6), pen (habitat) | SSD30 Space R1-R2; `own_holdings` for holdings; `people_knowledge` (FD10) for who knows of it; SR19 |
| E-S2 | **Stage-clock stock** (crop, herd, stand, seam, run) | stage list, remaining time, yield on completion, lazy catch-up | species, stage names, magic accelerators | Pass: MG06, seedbed, frost plot, habitat (E-R2) plus the garden and vein | SSD71 pools, SSD74 catch-up; `world_calendar` and `world_climate` as inputs (FD9); ACR8 clocks |
| E-S3 | **Labour assignment** (self, favour, hired, institution) | who works, hours, wage or share, willingness, leave | whether labour is free, bonded, spirit, nonhuman, or a pool | Pass for hired and favour; dial for coerced labour (the Primordial sect treats recruits as materials, stated) | `home_staff` and `home_household` (wages); FD15 positions (proposal) term types; FD8 duties; ACR10 |
| E-S4 | **Tools and wear** | verb, tier, condition value, repair job, who holds it | what a tool is (pick, wand, ritual knife), repair materials | Pass: tool verbs, house integrity, wands | `tool_profiles`, `tools_domain`, home condition (E-R4); `ready_stock` is separate (ammunition) |
| E-S5 | **Yield and quality** | formula inputs (tool, skill, condition, season, site) and a quality label | numbers, qualities, species | Pass with MR21: skill narrows variance and does not change truth | MR28, `craft_sources` harvest nodes, MR1/MR2 |
| E-S6 | **Storage and spoilage** | a batch with freshness clock, container, location | what spoils, preservation methods, magical stasis | Pass: food, herbs, potions, meat | `systems_workshop_runtime` perishability, `home_warehouse`, `native_storage_transaction`; X18 |
| E-S7 | **Rights and dues** | right record: holder, grantor, scope, term, recurring due, miss consequence | who the grantor is (landlady, sect, crown, no one), what a due is (coin, share, labour, quota) | Pass: E-O1 (favour), E-O3 (quota), E-O6 (claim), E-O7 (share) | FD8 `recurring_duties` for the due; FD6 `purseEffect`; ECR20, ECR21, SR19; FD15 for hired, tenant, sworn |
| E-S8 | **Build project** | phases, materials, labour-minutes, resulting station or place, wear | what is built, tech ceiling (K9.3), appearance | Pass: cabin, workshop, shop counter, sect hall | `site_projects` phases; `home_work_content` progress key; K9.3; a reader joins E-R3 |
| E-S9 | **Outlet** | channel list (merchant, household, order, consignment), saturation, price reason | prices, currency, who buys | Pass: ECR2, ECR7; shop is a channel | `market_saturation`, `trade.js`, ECR3-ECR6, SSD Consumers dial |

Defaults and dials in one pass:

| Seam | Default | Dial | Reason |
|---|---|---|---|
| E-S2 neglect | Delay, never destroy a crop or herd, with the cause shown first (SSD30 C12, X18) | Harsh worlds or an optional setting can wilt it | An idle player should not owe a chore tax (AD22, MR15) |
| E-S3 labour | Hired and favour labour use willingness, wage and leave | A world with bonded or coerced labour says so with its in-world cost | AD13 and ECR21; no world is the template (AD46) |
| E-S6 spoilage | Pause or reduce optional production with a notice (X18) | Spoil outright where preservation is a world theme | Accepted food direction: no mandatory survival chores |
| E-S7 dues | A world declares dues in data; absence is valid (ECR20) | Collection strictness, grace length, who enforces | ECR21: missing a payment has an in-world consequence, never a hidden game over |
| Theft | Needs an agent with motive, means and opportunity; a safe world has none (ECR17-ECR19) | Whether the world has fences, watchers, thieves | Losses move goods to a recorded destination and show in the recap |
| E-S1 rights | Access and repair do not establish ownership (SR19); ownership, custody and use stay separate (ECR24) | Whether use ripens into a claim in this world | Avoids a hidden "squatter's rights" rule |

### What this lane does not propose

Not a universal crafting engine (modular doc shared verdict). Not a settlement or NPC simulation (AD33). Not a new clock (SR4). Not new cash flows: wages, shares and sales move through the existing purse (FD6, ECR16). No fixed "once" limits (MR15).

## More to consider, round 1 (this lane)

### ACT NOW (done in this file)

| ID | Item | Check |
|---|---|---|
| E-M1 | Reconcile against about 13 doc owners and about 30 modules; classify 15 overlaps (E-R1 to E-R15) | Rows above; every module has a file:line or a stated tag |
| E-M2 | Resolve the "two consumers" versus AD51 tension by date (E-R6) | Single sentence in E-R6 |
| E-M3 | Flag naming traps (harvest, stock, cultivation) so later lanes do not compose onto the wrong seam (E-R12) | Row E-R12 |
| E-M4 | Put the accepted constraints in one table before any proposal (theft, dues, spoilage, rights) | Defaults table above |

### ACCOUNT FOR NOW (hold these when any slice is designed)

| ID | Consideration |
|---|---|
| E-M5 | **Which clock per stage.** Crops use played room time (seedbed), body-clock checks (frost plot) or played care (habitat). Each stage names its clock (ACR8). Do not unify clocks to unify records |
| E-M6 | **Save sprawl.** S1-S9 each want an optional state key. Default: one `livelihood@1` projection first, which reads existing keys and writes none, then at most one new key when a second world needs to save a site (R3-1 in the modular doc warns about the count) |
| E-M7 | **Absence.** A return should show "greens are ready; rent due Friday" in the recap (ECR19, SR21), never a silent loss. The `return_digest.js` seam is unmapped in round 2 and here |
| E-M8 | **Nonhuman producers.** A slime, a bear or a spider produces without hands (SSD78, `NONHUMAN_MAKING_AND_BUILDING`). Labour (S3) and tools (S4) must allow "no tool, body means" |
| E-M9 | **Helpers are pools or a few named people.** AD33 defers NPC-heavy simulation. A farm of twelve hands is a pool with one named foreman (SSD73 promotion) |
| E-M10 | **Canon scarcity is a hard constraint.** A canon herb patch stays at its anchor (MR25, MR26); generated stock fills only canon-consistent places |
| E-M11 | **Mechanisms over permission lists.** A spirit herb grown in a mundane plot does what its mechanism does (AD38). Cross-world material stays owned and inert until a compatibility law exists (MR14) |

### LATER / DELEGATE

Effort is small (under one session), medium (one lane), large (several lanes). Each has a done check. Levels: haiku for reading and extraction, sonnet for design and code, per the working agreement.

| ID | Item | Level, effort | Done check |
|---|---|---|---|
| E-L1 | Read-only **livelihood inspector**: one table listing every stage-clock record (MG06 plot, seedbed, frost plot, habitat) with holder, stage, remaining time and clock | sonnet, small | One panel or script prints all four; no new save key; focused test on three fixtures |
| E-L2 | Feed **season and rain into one crop stage** (E-O2): add one condition input to MG06 | sonnet, small | A plot's growth text names the cause; neglect still delays only; save, reload, export, import keep it; browser walk at 1920x1080 |
| E-L3 | **Home building reads `compileSiteProject`** phases (E-R3) | sonnet, medium | Tent and shelter builds give the same ledger lines and materials as before; no save change; the two project paths collapse to one reader |
| E-L4 | **Rights and dues** through FD8: a plot-right record with grantor and one recurring due, in the Village first | sonnet, medium, after FD15 projection | MG06 rent becomes a recurring due with a notice and a forgiving miss; the recap shows it |
| E-L5 | **Second-world proof (AD51)**: a landlady's garden in Tingen (E-O1) or a spirit herb plot at the sect | sonnet, medium | Same site record and stage reader as the Village plot; no world id in the shared file; native walk in the second world |
| E-L6 | **Deposit pool** for a vein or seam, plus a quota duty (E-O3) | sonnet, medium | A mine shows a thinning pool; the quota miss follows the world's consequence; theft route follows ECR17 |
| E-L7 | **Shop as build project plus outlet** (E-O5) | sonnet, large | A built counter adds a buyer channel; price reasons shown (ECR5); restock does not delete sold goods (ECR10) |
| E-L8 | **Tool tier reads gathering**: make `tool_profiles` hardness change a yield or access gate | sonnet, small | A tier-2 pick opens a vein tier-1 cannot; wear lowers the tier-1 pick's condition |
| E-L9 | **Gather-to-craft join** (X3): one real call from a gathered herb to a mix | sonnet, medium | A gathered Frontier herb appears as a quoted ingredient in the Village mix with the same material identity |

### Fresh angles (small details, classed)

| ID | Detail | Class | Why |
|---|---|---|---|
| E-D1 | **Tool loan.** Lend a pick to a neighbour; custody and return settle the favour (GATHERING doc already sketches this) | LATER | Needs E-S3 and a favour record |
| E-D2 | **Seed keeping** as an heirloom that passes down (SSD30 Knowledge R3, `home_inheritance.js`) | LATER | Inheritance exists; seeds are not items with lineage |
| E-D3 | **Peak-labour windows**: harvest week makes a duty slot (FD8) that lapses with notice | ACCOUNT FOR NOW | Gives a farming life a calendar without a chore tax |
| E-D4 | **Pests and blight as events** from the picker (FD16) with a weighted draw by season | LATER | Needs E-L2 and FD16 layers |
| E-D5 | **Harvest and market festivals** as dated world events (`world_events`) | LATER | Dated events already exist for LOTM; Proto23 weekly market is the Village version |
| E-D6 | **Common land and grazing rights** as a site with several holders (E-S1) | LATER | Tests the record's holder list |
| E-D7 | **Repair as a livelihood**: sell mending to neighbours (`material_apprentice.js` mender actions exist) | ACCOUNT FOR NOW | Wear (S4) feeds a service channel (S9) |
| E-D8 | **Woodlot supplies building**: SSD81 forests feed building; the cabin draws logs from a stand pool | LATER | Needs E-S2 for stands and E-S8 |
| E-D9 | **Shared well or mill** as a site others depend on, with a dues entry | LATER | Tests E-S7 with a non-person grantor |
| E-D10 | **Failure keeps a trace**: a lost crop leaves a "bad year" fact other people mention (FD10) | ACCOUNT FOR NOW | Uses `people_knowledge`; no new store |

## E-G: top gaps

| ID | Gap | Why it ranks |
|---|---|---|
| E-G1 | **No second world uses any livelihood module** (shown, E-R2, E-R15). Every module is Frontier or mixed with Frontier | AD51 asks a second world to validate; none has |
| E-G2 | **No rights and dues anywhere** (E-R8, E-R10). `plotRight` is a one-time fact; FD8 serves LOTM only | Owns the small details Weibao named: land, tithes, taxes, hired hands |
| E-G3 | **Two build-project paths and no shop** (E-R3, E-R9). Home building and field workshop do not share phases; selling has one channel | Blocks "build a workshop then a shop" and "claim land and build" |

## Evidence and limits

Shown: file headers and named lines listed above, importer counts by the stated method, docs headings and rule rows. Not read: the per-world institutions docs for content (keyword counts only, so E-O3, E-O7 and E-O8 are inferred), `book_world_paradise_ecology.js`, `return_digest.js`, `absorb_e2/durability.js`, `absorb_c2/local_life.js`, tests, and any browser behaviour. No build, test or play run. Nothing here is accepted direction; a later instruction from Weibao is needed to pick any E-L item.
