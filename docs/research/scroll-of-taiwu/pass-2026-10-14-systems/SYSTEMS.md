# Fifteen deeper Taiwu systems

Static evidence from build 25845203. SHOWN means a managed body, schema or compiled row inspected here. STATED means a prior dossier's bounded finding, reused without claiming a new trace. INFERRED means interpretation or owner routing. None means runtime observed. All YAIRPG uses are PROPOSALS.

Source keys: `B` = `/Users/weiwei/.codex/research/taiwu/extract/`; `D` = `/Users/weiwei/.codex/research/taiwu-2/extract/`; `A` = `/Users/weiwei/.codex/research/taiwu-2-aspects/extract/`; `N` = `/Users/weiwei/.codex/research/ds-scroll-of-taiwu/extract/`. A source citation names an extract file and exact function, stable across display line changes. All new types retain complete decompiled bodies privately, not just these excerpts. [TOOLING](TOOLING.md) gives their hashes and rerun route.

Rank below reflects new research payoff, not an implementation queue. Common save boundary: previous A04 traced domain archives and binary containers. New serializable schemas show what a type can store; they do not prove a crash-safe transaction, every field's inclusion in a particular archive, or an actually resumed game. Where registration is not traced, that limit is explicit.

## S01: Heredity has separate genome and aptitude models

**SHOWN data.** `N:GameData.Domains.Character.Genome.cs` stores 256 two-bit loci in 64 bytes, arranged as two 32-byte halves. Serialize/Deserialize copy exactly 64 bytes. `B:Character.cs:OfflineCreateGenome` uses the father's pregnancy-time genome snapshot when present; `N:GenomeHelper.Inherit` makes a random missing parent, or a wholly random genome if neither exists. `PregnantState` is a separate record from the resulting child.

**SHOWN rules.** Genome.Inherit uses one random uint for sixteen segment choices. For each 16-bit segment it chooses one maternal half and one paternal half, placing them in opposite offspring halves. CreateRandom makes each bit zero when a random byte modulo128 equals0, otherwise one. This is not a uniform bit generator. No mutation occurs in this particular inheritance function.

Aptitudes are not simply decoded from those 64 bytes. `N:CharacterCreation.CalcGrowingSectGradeAndAssignWeights`, called by the newer `B:Character.cs` creation paths near23076/23212, builds parent weights for6 main,16 life and14 combat values. GetParentValues selects the higher parental value on successful coin flips while a count/2 budget remains, otherwise the lower. It does not guarantee exactly half high values. Grade derives from sums using bases168/448/392 and increments21/56/49; the combined growing grade is clamped0..8. New generation allocates totals `base + grade*increment` by adjusted weights, normal variation bounded to about20% of each allocation and a separate mutation routine. SumToGrade and distribution use integer arithmetic; authored lower bounds can later raise individual qualifications.

**Authoring/connections/save.** OrganizationMember adjustment arrays, growing sect, virtual parents, feature definitions and actor creation context connect ancestry to local institutions. Character stores genome, base attributes and qualification arrays; Genome has an explicit fixed serializer. CreateFeatures adds a separate feature-inheritance pass: non-mergeable parental traits use GeneticProb and mutex groups; mergeable traits need both parents in the same group, average their signed levels, and can improve the shared sign with chance `(3-abs(meanLevel))*40`. Potential mergeable features are kept separately and revealed in proportion to age/16 in ApplyFeatureIds. This is a third ledger, distinct from genome bits and aptitude allocation. Not every recessive-trait consumer or authored feature row was traced. Older OfflineInheritMainAttributes helpers are marked Obsolete and must not replace the newer route in a current explanation.

**INFERRED mapping.** K4/K6/K18; P15/P16; body palette BW1/BW2, B3 and generation rules. Owner: GENETICS_CONSTITUTIONS_AND_BROOD_PLAY, GENERATION_FOUNDATION_RULES. Useful adaptation: retain ancestry and aptitude provenance separately, then let real skill consumers read the generated values. Do not import genetic determinism or source-specific caps.

## S02: Pregnancy snapshots ancestry while social parenthood stays separate

**SHOWN data/rules.** `N:PregnantState.cs` serializes mother/father feature snapshots, FatherId, FatherGenome, relation flags, ExpectedBirthDate and IsHuman. CheckPregnant first requires valid reproductive roles, no blocking feature198 and no pregnancy lock. It uses base chance60, or20 in the coercive source branch, times both fertility values divided10000. It rejects a parent when `fertility/divisor < existing child relation count`, divisor20 if either actor is Taiwu, otherwise40. For NPC village actors, homeless count can further divide the chance. These are source facts, not proposed YAIR rules or caps.

`B:CharacterDomain.CreatePregnantState` rejects duplicate state; human due date is current world date plus random Next(6,10). World date here is the month index, not real days. A separate source-specific nonhuman branch uses42. `ParallelUpdatePregnantState` checks health fraction below0.3 and infection; before delivery loss probability is `0.3 - health/leftMaxHealth` where applicable. At a risky human delivery, Next(10) distinguishes both deaths, child survival, child death and maternal death. Prenatal event checks occur at due-date offsets1/3/5 with75% chance for the applicable player branch.

**Connections/authoring.** `ParallelCreateNewbornChildren` and complement handlers distinguish actual father, recognized father, household/organization and adoption. A spouse may become the social father without replacing stored biological input. Religion/institution rules affect recognized ties. Creation emits information and party events, connecting a body event to knowledge and authored narrative.

**Save.** PregnantState has an explicit serializer; CharacterDomain stores the mother-keyed state and lock dates. Parallel calculation stages a modification before application. Whole apply/newborn/death cleanup and recovery remain partial.

**INFERRED mapping.** K6/K8/K12/K18; P15/P10/P20; body BW6/SG3-SG10 and CHARACTERS_AND_WORLD_EVENTS. Proposal: separate biological origin, household ties, recognized roles and who knows each fact. Do not turn pregnancy risk into a mandatory YAIR survival chore.

## S03: Population pressure is a world rule with protected actors

**SHOWN model.** `B:CharacterDomain.CalcCharacterBelongStatDict` counts normal generated actors by settlement, excluding protected categories, in actual-age bands below16,16..39,40..69,70+. `PostAdvanceMonthCalcDarkAsh` compares adult+middle+old counts against `PopulationThreshold * random.Next(100,125) * world population factor /10000`. Children are not included in that threshold comparison. It gets a per-settlement, per-grade plan from Organization.GetSettlementDarkAshTriple.

**SHOWN selector.** MarkExceedPopulationsNew visits actors by descending physiological age, excludes non-normal creation, DarkAsh-protected actors and principal grade8 members, and only visits over-threshold target settlements with a plan for that grade. With tuple `(Expected, Primary, NonPrimary)`, it compares `random.Next(60)*Expected` against `ageWeight*(Primary-Expected)`, weights0/1/3/6 by physiological-age bands. A selected actor gets AddDarkAsh, and notifications differ for the player's people versus followed actors. The local Expected value is decremented in the shown tuple copy. No writeback to adultPlan appears in this method; do not silently assume it enforces an exact selection quota.

**Correction/limits.** The older CalcExceedPopulations/MarkExceedPopulations route survives under PostAdvanceMonthCalcDarkAshOldImpl. The enclosing dispatch that chooses between these entry points was not established in the inspected WorldDomain; the new method name alone is not runtime-selection proof. Neither selector proves a complete replacement or replenishment model. This is a source-specific pressure/status mechanism, not a generic head-count truncation routine.

**Authoring/connections/save.** Organization thresholds, WorldCreation factor and protection flags author the policy; selected actor state, counters and histories are mutated, while census and sort are derived. Full removal/replacement/save cleanup remains open.

**INFERRED mapping.** K2/K6/K8/K12; P14/P25/P13; LIFE_SIM_NORTH_STAR and CHARACTERS_AND_WORLD_EVENTS broadly cover population. No dedicated accepted owner for this precise pressure-selection mechanism was located. Park the punitive rule; adapt protected-identity and explicit population-policy distinctions only where a world calls for them.

## S04: Manufacture has quote, paid queue, countdown and collection stages

**SHOWN model.** `N:Config.MakeItemSubTypeItem.cs` defines Time, ResourceTotalCount, six material maxima, Result, life-skill/refining and wood/metal/jade/fabric effects. MaterialItem supplies grade, RequiredLifeSkillType and required resources. `N:MakeItemData.cs` serializes product type/list, LeftTime, material mix, ToolKey, MaterialKey and EquipmentEffectId, keyed by BuildingBlockKey in BuildingDomain.

**SHOWN rules.** `B:BuildingDomain.CheckMakeCondition` checks the whole resource basket, tool durability by material grade times count, and skill attainment with facility effects and manual/perfect variants. Needed resource[i] is selected allocation[i] times count times material-required amount. StartMakeItem independently consumes tool wear, resources and material count, then stores the supplied product ID list. Initial time is `subtype.Time * (floor(count/3)+1)`. Thus counts3 and6 cross time steps. These are authored countdown units decremented by UpdateMakingProgressOnMonthChange, not per-item real-time seconds.

Countdown advances only while the site CanUse and all prerequisite buildings are available. GetMakeItems removes the queue entry and creates products, applies retained material/equipment-effect information, routes custody, and grants relevant profession/legacy/achievement progress. It does not itself check LeftTime==0 in the inspected body. This method boundary needs a caller guard before any claim of robust early-collection rejection. StartMakeItem likewise does not call CheckMakeCondition internally.

**Authoring/save/connections.** Definition tables choose possible outcomes; the mutable job freezes selected IDs/material inputs. Product instances are created on collection, so not all random item attributes are frozen at job start. The seven indexed MakeItemData fields have extensible serialization; the domain dictionary is persisted domain data. No atomic debit/save/collection retry proof exists.

**INFERRED mapping.** K9/K8/K18; P01/P02/P18/P16; chain palette and TECHNOLOGY_AND_PROGRESSION. Proposal: a visible job receipt retaining inputs, product commitment, pause cause and destination, with caller guards tested at the actual command boundary.

## S05: Repair and salvage read the object's history

**SHOWN rules.** `N:ItemTemplateHelper.GetRepairNeedResources` computes each of six resources as retained material mix[i] times grade-base requirement times1.0 if durability==0, else0.5, truncated to int. Repair-required attainment similarly uses full grade requirement for broken items and half otherwise, rounded via Convert.ToInt16. Cost is not proportional to each missing durability point. GetRepairNeedResourceCount sums the basket and multiplies5. The optional targetDurability parameter on `D:ItemDomain.GetRepairItemNeedResourceCount` is not used by that body.

`B:BuildingDomain.CheckRepairConditionIsMeet` requires a repairable target, sufficient tool, whole resource basket and attainment adjusted for facility. RepairItemOptional then wears the tool except special template54, pays resources, grants selected artisan seniority and sets durability to max. That mutation method does not call the full validator itself. Batch operations invoke it repeatedly, so whole-batch atomicity is unproven.

**Salvage.** `D:ItemDomain.DisassembleItem` refuses locked player items, invokes the internal salvage routine and then deletes the original. The helper chooses recoverable material/grade through ItemTemplateHelper and context.Random. A null output can still be followed by deletion in this outer method. Exact all-item salvage probabilities and UI guards remain open.

**Authoring/save/connections.** CraftTool, Material, grade arrays and item-type helpers author policy. Equipment retains MaterialResources from manufacture, which later drives repair cost. Instance durability and custody survive through existing item domain fields; repair has no newly traced long-lived job record. Full interruption and cross-archive item migration not proved.

**INFERRED mapping.** K9/K8; P02/P18/P09; chain palette, PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14 and TECHNOLOGY_AND_PROGRESSION. Proposal: show the material-specific repair basket and useful salvage alternatives; validate a whole selected batch before committing any part.

## S06: Artisan commissions are named contracts tied to civic conditions

**SHOWN data.** `N:ArtisanOrder.cs` stores artisan/subscriber IDs, skill/subtype, progress/delta, production and debate fields, destination storage and site identity. `D:ExtraDomain.CreateArtisanOrder` makes the contract, records the order and transfers ProductionPool.GetCreateOrderPrice from subscriber to artisan if a pool exists. This body alone does not establish an affordability guard or rollback.

**SHOWN rules.** GetArtisanOrderDelta returns `(MonthlyOrderProgressBase + attainment*ArtisanAttainmentFactor1) * MonthlyOrderProgressFactor * civicFactor /100 * buildingBonus`, keeping the source's integer order. civicFactor uses culture/maxCulture for skill5, safety/maxSafety otherwise, times ArtisanAttainmentFactor2; zero denominator yields0. Constants retain their exact symbolic names here; their definitions were not separately traced. Monthly update recalculates delta, finishes at SharedMethods.MaxProductionProgress(challengeFlag), or retains new progress. Invalid orders include missing/dead participants, invalid settlement, complete infection or selected legendary-book states.

FinishArtisanOrder samples eligible ProductionPool rows by Weight, creates a product, and routes it to subscriber inventory or authored storage. For Taiwu away from a regular settlement, an inventory destination can redirect to warehouse, with different receipts. Some worker/production outcomes thus remain random at completion. TransferTaiwuArtisanOrder changes subscriber and reverse indices, already identified in the prior inheritance pass.

**Authoring/save/connections.** Production pools, skill subtype, challenge policy, city stats and facilities author the offer. Extra stores orders by artisan/site; Character keeps subscriber reverse indices. Explicit ArtisanOrder serialization preserves contract fields; regeneration of reverse indices is separate. All refunds and every completion branch remain unread.

**INFERRED mapping.** K6/K8/K9; P06/P01/P02/P18; chain/life palettes and PROTO23_VILLAGE_LIFE_LOOPS. Proposal: one commission whose speed changes for a visible local reason and whose paid receipt, recipient and output route persist.

## S07: Treatment separates injury, poison load, potency and identification

**SHOWN data/rules.** `B:Character.cs:ApplyMedicineInstantEffect` dispatches distinct outer/inner injury, health, qi-disorder, poison detox/application and parasite effects. Injuries use body-part arrays, not just HP. With no explicit target list, CalcMedicineEffect_RecoverInjury considers positive wounds no greater than the medicine's threshold, chooses highest severities first and random ties without repeats, bounded by recovery-times. The explicit-target overload applies the modified value to each supplied body part; do not assume it repeats that selector's threshold check.

CalcChangedPoisoned rejects immunity. Positive load applies mixed-poison marks, feature percentage and PoisonsAndLevels.CalcPoisonDelta(load,potency,current,resistance); negative load is rejected when treatment potency is below current poison level. The final load clamps0..25000. Full CalcPoisonDelta internals remain unread, so this is an exact call boundary rather than an invented closed formula.

`D:ItemDomain.SetAttachedPoisons` stores FullPoisonEffects in Extra by item ID. Applying poison to a pure stackable item creates a unique item; removing the final effect may change its key again. GetStackIdentifier includes poison identity only when identified. Objective contamination and an actor's knowledge of it are distinct.

**Authoring/connections/save.** MedicineItem authoring supplies effect type/value/threshold/target fields; equipment/eating routes consume contamination. Character retains wounds, poison and immunity state; Extra retains full item effects; item modification-state and identity must be kept coherent. The code's return `(item,keyChanged)` warns callers to replace references. Every mixed-poison effect and migration is not closed.

**INFERRED mapping.** K9/K10/K11; P04/P11/P17; body and consumables owners. Proposal: an inspected treatment names the wound class/potency it can address; contamination knowledge follows appraisal. Do not copy the source's entire toxicology roster.

## S08: Meals are timed item effects rather than one hunger scalar

**SHOWN model.** `N:EatingItems.cs` stores nine ItemKeys and nine short durations, exactly90 serialized bytes. CalcMaxEatingSlotsCount is integer `maxVitality/10` clamped3..9; storage capacity is not current available capacity. Valid consumed items include multiple kinds through IsValid, not nine ordinary food-only slots. `N:FoodItem.cs` and MedicineItem distinguish instant effects, duration and ongoing property changes.

**SHOWN rules.** `B:Character.ApplyFoodInstantEffect` adds configured MainAttributesRegen. OfflineUpdateEatingItems calls UpdateDurations monthly: each valid duration decreases1; at<=0 the key is cleared and queued for item removal, with separate parasite callbacks. `N:EatingItemsHelper.GetCharacterPropertyBonus` sums absolute and percentage components from food/medicine/tea/material consumers, with profession-specific exceptions. OfflineUpdateEatingItemEffect separately applies ongoing contamination. Instant restoration, a current buff, lifetime and physical item cleanup are different stages.

**Authoring/connections.** Food definitions configure regeneration/property effects; medicine and tea use their own handlers. OfflineUseFoodForMainAttributes and selection helpers tie NPC consumption to actual attribute deficits and allowed food. Full selection ranking, slot replacement, every dietary rule and buff stacking exception are not exhausted. No inference of mandatory hunger death follows from this subsystem.

**Save.** Character's EatingItems field retains item references/durations; expired instances are removed through a staged world-items list. The explicit90-byte codec is shown, while exact failed-save cleanup and world-import ordering remain open.

**INFERRED mapping.** K8/K9/K3; P13/P17/P04; HUNGER_AND_BODILY_NEEDS_CONSIDERATIONS and body/consumables palettes. Proposal: preserve useful meal benefits and timed effects without mandatory hunger chores. This follows YAIR's accepted comfortable-unfed direction; Famine's passive condition XP is separate and is not evidenced by Taiwu meal code.

## S09: Companions retain identities and personal equipment plans

**SHOWN model.** `B:TaiwuDomain` keeps ordinary group IDs, special/gear groups, combat slots, equipment records and manual-change flags. Base maximum10 exists but is not a YAIR cap. `JoinGroup` first applies the equipment plan, detaches any prior leader, unbinds adventure hiding and converts temporary/random enemy identities where needed. Fixed-template companions take a distinct special-group route and return early.

**SHOWN rules/connections.** Ordinary joining can recursively bring a leader's followers, sets leader/location, changes organization or resident status, establishes relations with members, and applies active music/locked technique plans. LeaveGroup clears combat slots, retains manual equipment records, records locked skill/force plans, clears leader, moves to a valid or adjacent map block, restores village resident status where fitting and may bring wards into a new group. A fixed-template departure follows its own shorter branch. Group membership is therefore not equivalent to a combat slot or resident list.

**Authoring/save.** Template/creation type, organization and authored external states choose the branch; actual actors carry relations/inventory and plans. Taiwu's group/record fields and Character leader/location fields are stored separately with modification setters. The complete recruitment dialogue, maximum-size enforcement and every event listener are not traced. Source bodies do not prove that every partial failure rolls back.

**INFERRED mapping.** K6/K7/K5/K16; P06/P15/P05; CHARACTERS_AND_WORLD_EVENTS and LIFE_SIM_NORTH_STAR; the COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS palette is an adjacent owner for nonhuman variants, not the human-party owner. Proposal: make joining/leaving a persistent identity transition with retained personal plans, housing and dependants handled explicitly. Start with one named companion and useful work.

## S10: Law connects disclosure, jurisdiction, sentences and escape

**SHOWN model.** `N:SettlementPrison.cs` serializes LastBreakInDate, Prisoners and Bounties; SettlementPrisoner extends detention with punishment severity/type and spouse context. `B:OrganizationDomain.OnSectMemberCrimeMadePublic` requires valid punishment, matching current settlement and eligible actor state, then resolves sect jurisdiction or the region's governing sect. Disclosure is an input, not universal omniscience. Behavior-dependent escape-punishment chance and special type41 affect referral.

**SHOWN timers/rules.** `B:Sect.UpdatePrisonOnAdvanceMonth` expires bounties at ExpireDate<=currentDate, clears invalid hunters, applies prisoner punishment and checks release at `KidnapBeginDate + Duration <= currentDate`. Types42/43 enqueue sentence-complete events rather than ordinary immediate removal. Other releases can expel membership, record history and emit information. Remaining prisoners can attempt escape.

CalcKidnappedCharacterResistance returns999 for guaranteed escape, otherwise `(behavior+1)*((severity+1)*5-grade) + MaxConsummateLevel + prisonerConsummate - guardConsummate + Duration -2*elapsed`. The guard term is the maximum of related guards, with a configured fallback when absent. The source log calls it an average, but the body uses Max. Final escape-rate mapping remains in inherited detention helpers and was not fully read.

**Authoring/save/connections.** PunishmentType/Severity and prison effects/records author durations, expulsion and social aftermath. Fugitives sharing origin/destination areas can form a group in Organization.UpdateFugitiveGroupsOnAdvanceMonth. Persisted prison lists differ from regenerated prison caches; monthly histories and knowledge are separate. Full rescue/appeal/death cleanup remains partial.

**INFERRED mapping.** K7/K6/K12; P07/P12/P10/P25; institution/life owners. Proposal: one disclosed act, local jurisdiction and a reversible sentence/repair route with attributable aftermath. Avoid universal punishment flags.

## S11: Treasury rights combine custody, preferences and recurring allowance

**SHOWN data.** `N:SettlementTreasury.cs` serializes guard IDs/templates, resource basket, inventory, liked/disliked subtypes, contributions and layer index. NeedCommit and `_memberUsedPresetContributions` are not serialized by the inspected codec. GetMemberContribution is actual contribution + monthly role allowance - used allowance. Spending consumes remaining preset allowance before actual contribution; positive deltas add actual contribution. Actual contribution addition clamps to int range.

**SHOWN valuation.** CalcAdjustedWorth multiplies liked subtype worth125/100, disliked50/100. `N:SettlementTreasuryHelper.CalcItemContribution` uses explicit template contribution if positive; otherwise adjusted item value times amount times ItemContributionPercent/100. This differs from personal affection and merchant price. CalcBonusInfluencePower returns100 plus min(actualContribution*10/Accessory8.BaseValue,100).

`B:Settlement.UpdateTreasuryOnAdvanceMonth` decreases alert time, clears used preset allowance, repairs guard assignments and clears entry-event flags. Separate UpdateTreasury clears actual Contributions, refreshes preferences, resupplies inventory/resources and updates guards. It is not simply the same monthly allowance reset. `B:OrganizationDomain.ConfirmSettlementTreasuryOperation` records event arguments and processes outgoing baskets; the whole gain/payment sequence extends into event callbacks and is not proven atomic here.

**Authoring/save/connections.** Regional likes, leader interests, organization membership allowance and item contribution fields define exchange rights. Treasury belongs to settlement/layer, not the hero. A notable persistence question: used monthly allowance is transient in this type, cleared monthly, and not restored by its codec. No claim of reload exploit or safety is justified without tracing enclosing lifecycle reconstruction.

**INFERRED mapping.** K7/K8/K9/K18; P07/P18/P16; chain/life/institution owners. Proposal: distinguish gifted standing, recurring withdrawal allowance, personal property and common stock, with exact save semantics for allowance use.

## S12: Trade stock, prices and caravan income have different state

**SHOWN model/price.** `N:MerchantData.cs` serializes merchant template/type, money, seven inventory bands and per-item PriceChangeData. GetItemSoldPrice computes `max(0, srcPrice*(20 +20*favorChangeRate/100 + preference)/100 * (50+durabilityRate/2)/100)`, preserving integer operation order. Preference by behavior0..4 is +10/+5/0/+5/+10 for liked subtype and -20/-10/0/-10/-20 for disliked. This is one sell-price helper, not a complete bid/ask model.

`A:MerchantDomain.RefreshMerchantGoods` spends configured refresh AP after CanRefreshMerchantGoods, deletes old stock at the chosen band and regenerates through OfflineRefreshGoods. Character, building and caravan routes write different owners. All selection probabilities and frontend valuations remain partial.

**SHOWN caravan timers.** UpdateCaravansMove decreases wait by30 per monthly call, advances nodes and handles Robbed/RobEnd separately. Visiting a settlement once per remaining settlement-list entry changes income/risk: culture>50 adds `culture*5-250` to IncomeBonus; culture<50 adds `200-4*culture` to critical rate. Safety adds `200-4*safety` to robbery rate. Rates clamp0..1000, bonus to short range. Non-city nodes draw Next(1000) against the adjusted robbery rate.

OnCaravanArrive uses money*IncomeBonus/1000 and a critical roll with multiplier/100; an invested player's return uses configured invested principal instead. Arrival deletes goods, caravan path and extra state. InvestCaravan spends configured money and sets a flag; ProtectCaravan spends authority proportional to current robbery rate and halves that rate. These bodies use assertions, not proven complete command preflight; duplicate investment/refund guards remain unread.

**Authoring/save.** Merchant tables, GlobalConfig, map routes and settlement safety/culture author outcomes. Merchant domain stores stock/path; Extra stores investment/risk state. Complete arrival crash/retry and imports remain open.

**INFERRED mapping.** K8/K5/K7; P18/P13/P12; chain/life palettes and MEANS_AND_APPRAISAL. Proposal: one spatial delivery/investment whose changed risk has a named local cause, clear commitment and retained settlement receipt.

## S13: Debate turns practical knowledge into public consequences

**SHOWN model.** `N:DebateGame.cs` serializes skill type, turn state, round, both players, grid, pawns, node effects, activated strategies, comments, spectators, operation history and game-over/AI flags. `B:TaiwuDomain.DebateGameInitialize` derives bases from each actor's life-skill attainment times a configured random percentage, filters unlocked strategy cards by chosen skill categories, creates the grid and relations with spectators, then initializes AI. This is a tactical game, not a dialogue sentiment roll.

**SHOWN rules.** DebateGameNextState cycles state `(state+1)%3`. On state0 it increments round, updates effects/cards, restores resources/removes dead pawns after round1, applies round-start effects, raises pressure after a threshold and checks ending at MaxRound. All exact card/board constants and AI policies remain unread.

DebateGameOver applies win/loss/surrender and attainment-ratio evaluations, spectator comments/favor and happiness. XP is `(base + ExpA)*ExpB/100*(100+ExpCMax+ExpCMin)/100`; authority has a separate analogous calculation. Legacy/achievement progress is distinct. Comments have mechanical aftermath rather than being purely decorative barks.

**Authoring/save/connections.** DebateStrategy, NodeEffect, Evaluation, Comment, Reference and Record tables author actions and rewards. The board type has a full serializer, but `TaiwuDomain.Debate` is an auto-property amid transient counters and AI references. A resumable mid-debate archive is not established by the board codec alone; full registration/reconstruction remains unread.

**INFERRED mapping.** K10/K11/K6/K14; P09/P19/P21/P24. SKILLS_AND_TALENTS and event/UI owners cover practical knowledge and social aftermath, but no dedicated tactical-debate owner was found. Proposal: adapt knowledge-dependent nonviolent contests and witnessed consequences first; park a new board minigame unless selected.

## S14: A powerful artifact creates a world process around its holder

**SHOWN data.** `N:LegendaryBookDomain.cs` stores14 owner slots, shocked-month counters, consumed/hidden actor sets, contestants, previous owners and loadout presets. `_charBookTypes` and item/adventure lookups are rebuilt/initialized caches. This family was previously only named or touched during succession.

**SHOWN rules.** Creation checks world function21, first-delay state, tracked item existence and progression-dependent maximum counts. When disabled it sets a random delay Next(3,9); enabled positive delay counts down. Eligible appearances use a configured chance and missing book types. Initial selection favors the player's highest relevant combat attainment for types above2 in their village area; later selection can choose another area. Adventure creation stores type, appearance route, prior owner and a reveal date: immediate first reveal, otherwise currentDate+Next(3,10). It caps called characters at4 per generated adventure.

NPC holder status explicitly excludes Taiwu and certain external states. Wrong age group loses books and creates adventures. State1 uses a configured cooldown*2 threshold to leave group/advance state, increments shocked months and can show a50% temporary behavior. State2 reaches cooldown*3, applies type effects, marks consumed and loses books into new adventures. The player exception and distinct state counters are material; do not generalize this to every holder. Exact growth, contest AI and all14 effect suites remain partial.

**Authoring/save/connections.** CombatSkillType effect links, progression arrays, adventure templates and actor states author the process. Persisted domain fields encode owners/history/counters, while archive-ready initialization rebuilds caches. Every transfer/removal listener and mid-event resume is not closed.

**INFERRED mapping.** K3/K9/K12/K16; P10/P12/P17/P25; ABILITY_AUTHORING, item and world-event owners broadly apply. No dedicated accepted artifact-holder lifecycle owner was found. Proposal: one original item creates local demand, opportunities and recoverable consequences around a persistent owner, without importing a fixed uniqueness or doom rule.

## S15: Navigation policy differs for player movement and trade routes

**SHOWN model/rules.** `N:MapDomain.CalcBlockTravelRoute` chooses full versus born-state route dictionaries according to merchant flag, world-function4 and area. It expands area routes and runs AStarMap using block MoveCost. Merchant paths deliberately visit settlements in regular areas, sorted from the current block with the destination deferred; they are not simply shortest player paths. Cross-area edge entry/exit is selected separately.

`Move(context,dest,notCostTime)` returns for same block, forced tutorial mismatch, impassable destination or insufficient AP. It calls a warning for non-adjacent movement without teleport but does not return in that branch. Thus adjacency is not a robust refusal in this body, whatever callers may enforce. The function moves the party and gear companions, records traveler progression using movement cost, reveals map range, applies selected terrain wounds/carrier wear, consumes AP unless bypassed and raises a move event. Those side effects are not evidence that bypassing time bypasses hazards.

**Authoring/connections.** MapArea/MapBlock definitions, terrain costs, route dictionaries, tutorial forced location and travel policy author eligibility. Reuse by caravans links geography to trade; joining/leaving companions uses valid/adjacent location helpers. Discovery and encounter routes consume resulting location/reveal state.

**Save.** Travel routes and area/block collections are domain fields; the move command mutates actor location plus map visibility. AStar maps and path lists are temporary and pooled. Full map generation, route migration, every path guard and in-transit save state remain unread. The inspected source supports differentiated travel, not a completed procedural geography audit.

**INFERRED mapping.** K5/K6/K8/K12; P13/P14/P25; life/world core and event owners. Proposal: a route's purpose determines stops and costs; retain local hazards and disclose known travel costs on a desktop view. Future UI target1440×900, mobile deferred, with rebuilt browser evidence before any UI claim.
