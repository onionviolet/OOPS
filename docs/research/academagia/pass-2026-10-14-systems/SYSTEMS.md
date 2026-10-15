# Fifteen deep systems

This is passive source research. **Shown** means an inspected decompiled method or shipped field. **Stated** means an earlier dossier or public description, not a refreshed external claim. **Inferred** means reconstruction or interpretation. **PROPOSAL** means an unaccepted YAIRPG option. No native behavior was played.

Source root **E**: `/Users/weiwei/.codex/research/academagia-decompile/extract/`. **G** abbreviates `E/GameLogic.dll/Academagia.GameSystems/`; **C** abbreviates `E/ContentModel.dll/ContentModel/`. Method names below are exact evidence locators. New private `extract/source-index.json` records file hashes, methods and line numbers. Prior full binary tables and the five text corpora remain read-only. New complete system-table snapshots and merit gate/reward closures are [private](/Users/weiwei/.codex/research/ds-academagia/extract).

Rank follows likely reuse for life simulation and connected worlds, rather than source class size. Table counts are base counts; FAMILY_MAP preserves each separate patch union. Deep means the named flow is traced through model, rule, consumer and persistence. It does not mean every content record or edge case is semantically exhausted.

## DS01 / Making an item: materials, process and finish

**Shown model and authoring.** `C/{Item,Recipe,Ingredient,ItemInstance,ItemAbility,Affinity}.cs`; 1,265 Item and Recipe rows, 1,464 Ingredient rows. Recipe links exact-item or item-type ingredient slots, ArtificingRoll, FinishingRoll, SuccessItem and FailureItem. Items author quality, worth, size, concealability, legality, durability, prerequisite, abilities with thresholds and enchantments. Instances retain their own quality, worth, abilities and affinities. A recipe row alone is not a usable recipe: `G/ArtificingSystem.GetItemsForArtifice` requires Full item information, ingredients and both rolls.

**Shown rules.** `ArtificeItem`: Q = making-roll Power + sum(selected ingredient Quality) − template Quality. Q ≤0 produces the configured failure item, if any. Q >0 creates the requested template; worth = max(0, integer(template Worth × finishing-roll Power /10)). Making power unlocks item abilities at power ≥ threshold; finishing power unlocks enchantment abilities at the same inclusive comparison. This route uses roll Power rather than a simple boolean pass. The affinity-copy loop stops when current count >Q, so its written boundary can admit Q+1 entries. It does not establish intended balance.

Selection distinguishes carried, equipped, wardrobe-at-home and current-location materials. Each ingredient slot takes a matching distinct instance. `GetItemEx` first tests home prerequisites, otherwise tests previously visited venues virtually and chooses the lowest discovery-risk venue. `CheckIngredients` rechecks real custody before work. Ingredients are destroyed only inside the non-null-output branch. A failed process with no failure item therefore returns null without that destruction branch. An output can be created without being inserted into the backpack when the wrapper's free-space flag is false; do not call this a safe transaction without native evidence.

**Connections.** Knowledge reveals recipes; location supplies facility/context; inventory supplies real material; two skills affect distinct product dimensions; produced equipment feeds abilities, commerce, gifts and enchantment. NPC selection ranks recipes by summed relevant skill, then attribute. Missing-material acquisition tries owned add-material actions, purchase actions, transfer, then money-making. The transfer helper returns false. Several acquisition loops stop at Count−1 and skip the last candidate. This is limited source AI, not a complete production economy.

**Save.** ArtificingSystem has scratch selection state and inherits empty BaseSystem stream methods. Durable output is ItemInstance and generated ItemAbility live objects, template instance lists, inventory and statistics. In-flight wrapper persistence is not demonstrated as a multi-day craft job. No timer-driven production chain is shown here.

**Inferred payoff / PROPOSAL.** Keep input properties, process success and finished utility separate, then connect one output to real use. K9/K13; P02/P18; `MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md`, `PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md`. Do not adopt the source's off-by-one or non-atomic branches.

## DS02 / Enchantment: fit, stored components and manufactured abilities

**Shown model and authoring.** `G/EnchantSystem.cs`, `C/{Affinity,Pheme,Spell,Item,ItemInstance,ItemAbility,Enchantment,EnchantmentAbility}.cs`. Four instance-keyed maps separate available energy, selected potential components, enchanted free components and components committed to abilities. Affinities target a specific pheme or spell type, with signed Value. Nine Enchantment records do not bound the whole system: generated item abilities derive from many Spell records.

**Shown rules.** `RecalculateEnergyRemainder`: start with instance Quality minus the total count of committed, enchanted and potential components. Each matching negative affinity adds its negative Value once. Each positive affinity removes up to Value matching entries from a working multiset and refunds one capacity per removal; earlier positive matches consume candidates before later matches. Negative matching occurs before these removals. The rule uses template affinities, which must not be conflated with the possibly shortened instance affinity list created by artificing.

`FilterPhemesByEnchanteChance` computes p = min(99, helper Power(initiator, Enchant skill, Insight) + level(template EnchantSkill) + bonus(template EnchantSkill)). Each desired component separately succeeds when integer draw 1..100 ≤p. A failed draw selects a random component sharing at least one authored spell type and keeps it only if Full-known. There is no lower clamp in this method. `EnchantPhemes` removes potential selections, then adds the successful/substituted entries under capacity checks.

`GetPotentiallySpells` checks that every required pheme is contained, but does not consume a multiset during that eligibility loop. Repeated requirements can therefore pass a membership test with insufficient multiplicity. This differs from the previously documented cast validator. `EnchantSpell` moves required phemes to the committed list, creates an Ability and attaches it to the instance. `CreateAbility` copies effects and parameters, sets Charge = instance Quality, gives an empty prerequisite, and freezes a caster helper-power roll for Type3→Type2 and Type4→Type1. Other roll types remain shared. This is stored manufacture power, not always rerolling the current wielder's skill.

**Connections and time.** Item material affinity affects capacity and AI preference. Knowledge gates component selection. Equipment carries the resulting ability; ChargeSystem tracks use. No automatic daily recharge or enchanting research timer is shown. AI can train Enchant or a school, or choose other activity when no valid spell exists.

**Save.** `SaveToStream/LoadFromStream` writes enchanted free/committed component maps and Enchant skill reference. Potential selections and energy remainder are omitted from that stream. Generated Ability/Roll/RollEffectRelation/ItemAbility objects and ItemInstance abilities save through live-object/mutable-content storage. This establishes the shown stream boundary, not every UI reconstruction path.

**Inferred payoff / PROPOSAL.** Let material fit and maker skill leave durable behavior on an object, with a visible distinction between preparation and committed manufacture. K3/K9/K11; P02/P04/P17; production palette, `WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md`, `worlds/ABILITY_AUTHORING.md`.

## DS03 / Familiars: an actual actor with a bond

**Shown model.** `C/{Familiar,FamiliarType,BreedType}.cs`; 111 familiars, 26 familiar types, 77 breed labels. Familiar has its own attributes, vitality, skills, abilities, phemes, gift preferences and Character reference. BreedType links a FamiliarType; it is not a demonstrated genetics or reproduction model.

**Shown rules and authoring.** `G/FamiliarSystem.AddFamiliar` detaches the familiar's prior owner, destroys the new owner's prior familiar object, sets the new association, informs owner about familiar/Bond/children, removes its Bond skill entries and initializes them anew. This replacement behavior should not be copied into a companion roster. `SkillSystem.InitializeFamiliar` creates Bond and children at level zero with starting maximum one. Training candidates include the owner's informed skills. In `SkillSystem.ExpandLevel`, a familiar's child-skill upper bound is min(10, Bond level+1). Other level/set/maximum paths remain distinct and are not collapsed into that formula.

`StorySystem.GetCharacterPlusFamiliarSkillLevelValue` adds owner skill and familiar skill directly. Adventure group checks take the highest such pair among clique members; ordinary events use just the initiating pair. The reviewed contribution method has no half-Bond clamp. The old wiki half-Bond statement is therefore not a supported description of this route. `GetAIOptions` exposes owned actions/abilities after excluding those already active. Daily `GameController.CheckStressStatus` clears familiar illness; source illness and recovery are not a lineage life cycle.

**Connections.** Separate familiar-only story checks exist, plus actor actions and owner expertise contribution. `ActionSystem` contains a special Defend table, but familiar actions return through ExecutionHelper near the top of Execute before that later branch. Its presence alone is not proof that the later defense branch is reachable. Full combat familiar behavior remains open.

**Save.** FamiliarSystem saves the Bond definition reference. Actor association, own attributes/skills and illness fields belong to mutable Familiar/live ActorSkill records and statistics. No separate companion roster or inherited offspring data is shown.

**Inferred payoff / PROPOSAL.** Give a companion skills, knowledge and a real task contribution, while keeping training relationship and ownership distinct. K6/K3; P06/P09; `CHARACTERS_AND_WORLD_EVENTS.md`, `LIFE_SIM_NORTH_STAR.md`. Body/lineage mapping is a boundary comparison to `GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md`, not evidence that Academagia simulates inheritance.

## DS04 / Creation: background choices execute real effects

**Shown model.** `G/CharacterCreationSystem.cs`; `C/{Background,BackgroundType,Player,Attribute}.cs`; 117 Background rows, nine background types. The code exposes seven named categories in a fixed order: Origin, Family, Childhood, Education, Familiar, Possessions, Travel Experience. Background extends an ability-like definition with cost, prerequisite, effects and rolls.

**Shown rules.** Initialize resets attributes to one, CommonPoints to ten and AttributesPoints to five. An attribute increase requires current <3, both budgets >0, then subtracts one from each. Decrease requires value >1 and attribute budget <5 and refunds both. Thus ten common points is not ten freely spendable attribute points. `ChangeAttribute` uses inclusive loops, so a requested delta can attempt one extra increment/decrement; the single-step guards still apply. UI usage of that helper is unverified.

Selecting a background requires cached availability and nonnegative remaining common points; a negative cost adds points. Per category, only one zero-cost and one negative-cost background can remain selectable through these flags. There is no same-category one-choice rule for all positive-cost backgrounds. Deselection checks and refunds directly invalidated dependent backgrounds, with a refusal if the resulting budget would be negative. No full recursive dependency fixed-point validation is demonstrated.

`StartGame` initializes the character, informs School Survival and its children with starting child level one, sorts backgrounds by category and executes each through AbilitySystem with a permanent condition. Effects can grant items, relationships, faculties and other real means. A special vitality adjustment handles effects on VitalityMaximum. If no familiar was granted, a named default is assigned. Portrait list filters by college and gender. These are authored starting consequences, not generated ancestor transmission.

**Save.** Player.Backgrounds, attributes, earned inventory and effects are durable actor/state data. The creation system has no custom stream body beyond empty BaseSystem, so wizard budgets/availability flags are not shown as retained game-save state. Completed starts and mid-wizard resume are different questions.

**Inferred payoff / PROPOSAL.** Execute starts through ordinary effect contracts, with explicit dependency and compatibility validation. K4/K6/K18; P15/P05/P16; life-sim, genetics and starts palettes. Preserve per-world starts, reasonable alternatives and current milestone scope. No imported universal point budget.

## DS05 / Gifts: preference, refusal and custody

**Shown model and authoring.** `G/GiftSystem.cs`; GiftPreference selects either ItemType or Item, attached to Student/Instructor/Monster. Base has 124 preferences. Preference tests match template/type exactly, not gift prose or market price.

**Shown character rules.** Ownership check requires the gift in InventoryItems. Let R be relationship and A the recipient's ParentalApproval. Preferred gift: if R <−5 refuse without transfer; otherwise relation +2. Nonpreferred gift: if R <−5 relation −1 then transfer; if −5 ≤R <0 refuse; if R ≥0, relation +1 only when template Worth ≥A, but transfer occurs even below that price. The threshold reads template Worth rather than the instance's possibly crafted Worth. Exact −5 differs from −6 for a preferred gift.

The recipient backpack receives the object before `RemoveGift` removes it from giver backpack or paperdoll. Instructor removes the item first and gains +1 only for a preferred gift, while a nonpreferred gift still returns success. Monster removes first, then preference decides success. A failure result can thus remove the item from the giver without returning it. The general Give dispatcher casts Character targets to Student, a source assumption rather than a robust universal actor API.

**Connections and time.** Gift action scheduling belongs to ordinary action/effect execution. No gift cooldown or diminishing-return ledger is stored in GiftSystem. Gift feedback, relation change and transfer success need separate interpretation. No consumed item should be described as a refused intact gift.

**Save.** GiftSystem inherits empty BaseSystem streams. Preferences live in content; actual transfer and relationship changes save in inventory/object/statistic state. It has no own gift-history dictionary in the reviewed class.

**Inferred payoff / PROPOSAL.** Author actual tastes and refusal reasons; use one atomic transfer receipt and separate social response from custody. K6/K8; P06/P18/P19; character and dialogue owners. Do not adopt the source's asymmetric consumption as a generic YAIRPG policy.

## DS06 / Emotions: separate entry, exit and effect lifetime

**Shown model and authoring.** `G/EmotionSystem.cs`, `G/DeusExMachinaSystem.ExecuteEmotion`, `GameLogic.dll/Academagia.Statistic/EmotionalStateCondition.cs`; Emotion has Prerequisite, Exit, Effects and descriptive fields. Forty-five base emotions, 55 in each separate union. Multiple emotion definitions can coexist per Character; duplicate additions of the same record fail.

**Shown rules.** Entry scans every Emotion whose entry prerequisite passes and which is absent. Add records membership, creates EmotionalStateCondition, executes its effects through a special action and updates statistics. Exit removes each current emotion whose Exit prerequisite passes and updates statistics. `ProcessEmotionalStates` and the daily controller run entry before exit, so a state can be entered and removed in one processing cycle. There is no universal mutually exclusive mood slot, duration or intensity formula in this class.

EmotionalStateCondition is always initialized, always requests checking, and remains true exactly while membership exists. Removing membership can therefore end condition-scoped effects on later system checks. Ordinary permanent effects executed on entry need not reverse merely because the mood exits. Inspect each effect's semantics rather than promising universal rollback. AI also processes emotional states before selecting activity in the prior traced route.

**Save.** Character→emotion-list dictionary is written/read. EmotionalStateCondition writes Character and Emotion references as live objects. Effect contexts, conditions and changed stats retain their own records. The saved emotion list is not the rendered mood description.

**Inferred payoff / PROPOSAL.** Give emotions distinct causes, exit routes and useful action effects; preserve a reasoned repair route. K6/K8; P25/P17/P12; life-sim and character palettes. No universal mood penalty or new compulsory needs loop is selected.

## DS07 / Astrology: persistent cycles plus saved daily noise

**Shown model and authoring.** `G/AstrologySystem.cs`, `GameLogic.dll/Academagia.Astrology/Curve.cs`, `C/{Constellation,ConstellationAbility}.cs`. Thirty-nine constellations and 269 threshold-linked abilities. Curve(x) = amplitude×cos(2πx/period+phase)+shift. Major and minor curves use amplitude one, shift zero, period 360 and a random integer-degree starting phase. Moon uses amplitude .375, shift .375, period 30; variance uses amplitude one, period 7.5.

**Shown rules.** For each constellation and day index d, score = its annual curve(d) + saved daily perturbation. Perturbation chooses a fresh variance phase, takes sign(varianceCurve(d)), then multiplies integer random draw 0..floor(10000×moonCurve(d)) by 1/10000. The value is cached by day and constellation. Dominance returns every equal maximum separately in major and minor groups. Calling AstrologyExecute grants each dominant constellation ability whose Threshold ≤effect magnitude under the caller's existence condition; automatic abilities also enter persistent execution.

Moon-phase display subtracts `_moonPhase`, takes C# remainder modulo 30, then uses bands: 0..1 first new, 2 second new, 3..6 rising quarter, 7..10 rising half, 11..14 rising second quarter, 15..17 full, 18..21 waning quarter, 22..25 waning half, 26..29 final quarter. Unexpected/negative values fall back to Full. Initialization calculates `_moonPhase` before assigning MoonCurve.Period=30. Curve's constructor period is one, so do not silently correct this to a 30-day phase offset when documenting the displayed phase.

**Connections.** An actual calendar changes access to condition-scoped abilities, while saved noise makes today's queried result persistent. It is not proven that every celestial combination or future prediction is stable without querying. No cross-world cosmology is supplied by this subsystem.

**Save.** Moon/variance Curve references, major/minor maps, moon offset and every cached day/constellation value are explicit. Curve fields save in live objects. This is saved sampling, not saved global RNG state.

**Inferred payoff / PROPOSAL.** World-local recurring conditions can open techniques without a global once-only unlock. K2/K3/K12; P13/P14/P17; world core kit and ability owners. **Specific owner gap:** no dedicated celestial-cycle rule owner identified among checked palettes. This is a candidate topic gap, not permission to create one.

## DS08 / Weather: daily memory and authored overrides

**Shown model.** `G/WeatherSystem.cs`; `C/{CalendarWeather,WeatherType,WeatherTypeChance}.cs`. Base has 360 calendar entries, ten weather types, 874 weighted chance rows. Calendar weather mode is Default, Manual or Random. The calendar references a weather type or list of percentage chances.

**Shown rules.** All lookups normalize the date to Morning. If already cached, return it. If yesterday is cached, use yesterday as provisional weather and draw u in [0,1). In Default/Random mode, u <.15 retains yesterday; otherwise Default requests the sole IsDefault type and Random subtracts authored chance/100 from a random fraction until ≤0. Manual mode always overrides. Without yesterday, u=1 so the first query chooses fresh weather. Null selection falls back to a uniform WeatherType. The .15 rule is a retain branch probability, not the total chance of seeing the same weather tomorrow.

Weights are traversed as authored; no normalization is shown. A chance sum below 100 can fall through to uniform fallback; no sole default also falls through. `SetWeatherType` writes a normalized date entry. No geography-specific weather grid, wet-material process or climate simulation is shown in this system. Those would be original extensions.

**Connections and time.** Date and saved world conditions can be selected by authored rules elsewhere. Reading today's weather creates a durable sampled fact. World effects and content need their own consumers; a weather record alone is not a crop/production bonus.

**Save.** Explicit count followed by GeneralTime and WeatherType references for every cached date. This preserves yesterday's actual record and already sampled future/manual entries, not a PRNG replay stream.

**Inferred payoff / PROPOSAL.** Persist actual environmental facts and use them in one real task with an explained alternative. K2/K5/K8; P13/P14; life-sim, core kit and production palettes. Separate environmental truth from the player's forecast/knowledge.

## DS09 / Shops and delayed delivery

**Shown model and authoring.** `G/PurchaseSystem.cs`, `C/{Catalog,ItemInstance}.cs`. Catalog chooses Merchant or Catalog, authored Items and Prerequisite. Base has 125 catalog definitions. Runtime maps track displayed stock and dated per-character deliveries. Authoring a merchant does not generate supply production.

**Shown rules.** Merchant purchase first tries paperdoll, then backpack, returning without payment if neither fits. Catalog purchase schedules delivery at current time plus integer 1..14 days. Both remove the instance from displayed and source catalog item lists and debit effective instance Worth. `CanBuyItem` tests Money−Worth >0, so exact funds fail its helper. `BuyItem` itself does not call that helper. This establishes separate UI/caller and mutation contracts, not a globally protected affordability transaction.

`Update` delivers every due item into wardrobe and informs the recipient, then removes the queue entry. At Night it tops up merchant lists toward 20; catalogs toward 15 on numbered days 1 and 15. `GetRandomItems` retains existing surviving stock and randomly removes excess candidates from the remaining authored pool. It does not create replacement item instances. Top-up targets are not proof of unlimited regenerated stock. Selling to a merchant appends the instance to both lists and credits full effective Worth; inventory removal is outside this method.

**Connections.** Production can change instance Worth; preference gifts compare template Worth instead. Access prerequisites filter catalogs. Physical storage and delivery time differ from knowledge that an item exists. No supply/demand price formation, transport encounter or seller budget is shown here.

**Save.** `_calendarItems` serializes date→Character→ItemInstance lists; `_catalogItems` serializes Catalog→stock. Money, wardrobe and instances save in actor/inventory/object records. IsShop is not written by these stream methods.

**Inferred payoff / PROPOSAL.** Separate paid ownership, delivery date and present usability; reserve one actual object through transport. K8/K9; P18/P04; production, means/appraisal and technology palettes. Native acceptance must include exact-funds and interrupted-delivery controls; source semantics are not proposed safeguards to copy blindly.

## DS10 / Charges: current amount, capacity and use history

**Shown model.** `G/ChargeSystem.cs`, `G/InUseExistenceConditionDictionarySystem.cs`, `G/ChargeCondition.cs`. Maps use owner+ActionEntityBase keys. Current and maximum values each have a basis plus condition-scoped additions; usages is a separate integer map.

**Shown rules.** Charge=0 on the definition means unlimited use in CanUseActionEntity. Otherwise lazy initialization sets basis current charge to authored Charge, basis maximum to 15, with a permanent condition. Eligibility requires summed current >0. Use requests a one-point decrement from the newest/current end of condition entries and increments usage count. The reverse loop removes an exactly exhausted nonbasis entry without breaking or zeroing the remaining requested amount, so that boundary can continue into an earlier entry. Exactly one total unit spent is not established for every stack. Current and capacity are not interchangeable, and no daily reset appears in this class.

ExpandCharge requires initialized current state, nonzero definition charge and positive maximum; it changes basis current, floors at zero, and clamps positive additions to the summed maximum. IncreaseCharge adds a temporary current entry; IncreaseChargeMaximum adds a temporary maximum entry. `ExpandChargeMaximum` initializes both maps and verifies the maximum map, but actually increments `_charges[key][0]`. **Shown discrepancy:** this method's name does not match its mutation. Generated item abilities use instance Quality as authored starting Charge, while lazy maximum remains 15; an item can therefore start above that nominal refill cap.

**Connections and timers.** Abilities, ordinary actions and spells call through FirstLevelSystem. Phase updates expire condition-scoped entries. Usage count can be selected independently of remaining charge. There is no universal “per day” cooldown here; content may supply its own conditions/effects.

**Save.** Usages, current-charge condition dictionary and maximum-charge condition dictionary all explicitly save/read. Owner/entity keys and condition objects retain identity in the live object stream.

**Inferred payoff / PROPOSAL.** Display current reserve, capacity, recovery rule and historical use as distinct facts. K3/K9; P17/P13; `worlds/ABILITY_AUTHORING.md`, engine and technology owners. Do not import the method-name discrepancy or impose a global finite-use policy on solo routes.

## DS11 / Ability and effect lifetime: waiting is a real state

**Shown model and authoring.** `G/{AbilitySystem,FirstLevelSystem,EffectSystem,ContextStoreSystem}.cs`; ActionEntityBase defines duration/type, charge, action types, prerequisite, effects and roll-effect relations. AbilityExecutionContext holds initiator, compiled wrapper and condition. ContextState separates Waiting, Started, ReadyToStart and other buckets.

**Shown rules.** Ability Execute rejects bad contexts, charge failure or the same initiator/ability already Started. Prevented ability or action type goes into Waiting and returns success without spending charge. Otherwise it marks Started, initializes its condition from the current timer, tests reprimand, spends charge, applies deflection and executes effects. Therefore success from this entry method need not mean effect execution happened immediately.

Automatic abilities create an AbilityExistenceCondition whose child is the grant condition, enqueue Waiting and update. Waiting contexts are checked, removed if their condition fails, or started once not already in use. Started contexts leave when a scheduled condition check fails. EffectSystem resolves a typed implementation, checks prevention, creates the effect's own condition and can shelve a combat-conditional effect before returning success. Destroyed or false conditions expire during updates. No single generic cooldown formula can describe all these lifetimes.

`FirstLevelSystem.DeflectContext` matches subject action and overlapping targets, decrements interception magnitude, then compares power. If incoming power is not greater, it retargets effects to the counter's object and recursively checks deflection. Even an insufficient matching deflection can spend its magnitude before the power comparison. Full stacked/cyclic combat behavior is not executed here.

**Save.** AbilitySystem inherits ContextStoreSystem's state→context-list serializer; EffectSystem writes that base and CombatConditionSystem. Live contexts/conditions/wrappers carry their own fields. ContextStoreSystem.RemoveContext also searches matching waiting abilities without filtering initiator in that cleanup branch, a multi-actor edge worth preserving as unresolved behavior. See DS15 for ActionSystem's different override.

**Inferred payoff / PROPOSAL.** Keep intent, pending condition, paid cost, started work and visible outcome distinct; save one delayed meaningful action. K3/K18; P08/P17/P24; engine, ability and save owners. No general-purpose effect framework rewrite is proposed.

## DS12 / Vendetta: entry selector, directed offenses and symmetric conflict

**Shown model and authoring.** `G/{VendettaSystem,Rival,RivalsObserver,DuelSystem}.cs`; `GameLogic.dll/Academagia.Effects/AddImpl.cs` Rivalry case; `Storage.dll/Storage.SelectionTree.Xml.{Relationship,Character}.tree.xml`; `Academagia.Resolving.Strategy/ResolveStrategyEx.cs`. Base Declare Vendetta Action ID `f7a2d9bda49a254a97588a8452a6fbb0` has no prerequisite items. Its Add Rivalry effect uses target path `[240001,240004,40136,240003,40093,40099,40100]`: self plus choice of a Low Relationship character. XML query 13 selects `__LOW_RELATIONSHIP__`; resolver delegates to RelationshipSystem, whose Low range is ≤−5. The source gate lives in target selection, not the empty action prerequisite.

`EnterToVendetta` itself only checks two non-null actors and absence of the symmetric pair; it records current time and initializes rival statuses. It does not repeat the −5 test. Authored and direct system calls thus have different validation scope. Declare Vendetta also has a Duel effect; DuelSystem requires the pair already be rivals when creating that route. Full duel scheduling and turn math remain separate gaps.

**Shown rules.** Conflict start time uses a symmetric actor-pair key; offense points use directed keys. Each resolved hostile effect targeting a Character can add one point, rather than one point per action or its numeric damage. Leaving clears the active pair, records winner/loser in the observer and does not clear the points map in that method. Rival statuses persist; filtering excludes a recorded defeated opponent and its clique through the Looser branch. That method assumes a non-null clique. Source restrictions are not an instruction to permanently close YAIRPG rematches.

**Save.** VendettaSystem writes award-table reference, directed points, symmetric start-time map and observer. Observer writes Rival references; each Rival writes opponent status map and its Character. A conflict's age is derived from the saved start date. No universal timed expiry is shown in this class.

**Inferred payoff / PROPOSAL.** Separate incident causes, current hostility, response rights and settlement memory. K6/K7/K10; P12/P25/P19; character, dialogue and institutional owners. This closes the old entry-rule question for this authored action, not every content-created rivalry or full combat.

## DS13 / Merit rewards: a shared race with tie handling

**Shown model and authoring.** `G/CompeteSystem.{EarnMerit,ApplyReward,ApplyMerit,SaveToStream}`, `C/{Merit,College,Prerequisite,PrerequisiteItem,CompeteSkill}.cs`. Base has 34 Merit definitions; each separate patch union has 36. Merit stores prerequisite, abilities and count metadata. [MERIT_MATRIX.md](MERIT_MATRIX.md) enumerates every shared record's ID, logic, thresholds and reward for all three profiles. Full gates/reward effects are private, including college selections, numeric comparators and nested referenced records.

**Shown rules.** EarnMerit changes college total by sign(magnitude)×power, not magnitude×power. ApplyReward sorts colleges by total and processes equal-score groups from highest down. For each college, ApplyMerit scans every unclaimed Merit and evaluates its prerequisite as DeusExMachina, not as that college. It adds eligible records to a group buffer, grants automatic abilities through CollegeAbilityCondition to students and nonautomatic abilities to college. Only after the entire tied group is processed are buffered records appended to `_appliedMerits`. Tied colleges can therefore receive the same newly eligible record; lower groups cannot claim it afterward.

The base gate thresholds are 20,40,70,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475,500,525,550,625,650,675,700,725,750,775,800,825,850,875,900. Some gates are OR over named college checks; some are AND. A simple personal ladder at every 25 points would erase both the missing 575/600 base rows and the shared race semantics. Patches must be read as their own matrix. The AbilityCount and PrerequsiteCount metadata do not control a random reward count in ApplyMerit.

**Connections.** Rewards alter college-wide ability access and member persistent effects; student membership is part of effect lifetime. Daily controller calls ApplyReward. Instructor Impress is a separate route using helper Power > chosen CompeteSkill.Value and ±1 relationship. The CompeteSkill table has zero shipped rows in these profiles, so helper code alone does not prove a populated teacher challenge system.

**Save.** `_appliedMerits` persists shared claims. College totals, acquired abilities and condition-scoped student effects save in mutable records/statistics/live objects. A future tie or award should not be inferred from UI prose.

**Inferred payoff / PROPOSAL.** Institution achievements can grant usable shared services with explicit recipient/tie policy. K7/K8; P07/P06/P16; character and school-world owners. This closes shared merit selection and gate census; manual descriptions of every reward effect and a native award remain unverified. Do not adopt global exhaustion as a fixed YAIRPG repeat limit.

## DS14 / Knowledge: revelation, temporary information and leverage

**Shown model.** `G/{InformationSystem,BlackmailSystem}.cs`. Permanent information is viewer+entity→InformationLevel, with a last-date map and temporary condition dictionary. Lore, Memory, Topic, known skill, owned spell and item are distinct records. Base Lore has 4,113 rows and Memory 1,640; this does not count unique conversations.

**Shown rules.** GetInformationLevel returns Full for null/special omniscient viewer or null entity, institutional class/college/university/player objects and the viewer's own familiar. For an item instance it queries its template. Permanent entries take precedence over temporary ones; with no permanent entry, the last temporary condition determines level; otherwise None. Property visibility at Full requires the reflected property exist. Below Full a limited names/descriptions whitelist applies; this class does not itself forbid that whitelist at None. Caller filtering therefore matters.

Inform normally sets Full. Inform on an already Full-known Character instead increments a directed blackmail count and reports `isBlackmail=true`. Informing a Skill adds it at zero; a Pheme/Spell adds an owned-stat entry; Location recursively informs its abilities/topics; ItemInstance recursively informs item abilities. Thus repeated knowledge acquisition is not always idempotent or purely cosmetic. SetInformationLevel also reveals relevant category/type records. Last date is written for the main key, not every derived category key.

Temporary information becomes permanent for PermanentDurationCondition or DurationCondition with zero ticks. Otherwise it is condition-scoped. Blackmail reset removes the count and changes relationship −1; its broader roll bonus was already documented in the prior relationship dossier. No general confidence/revision/source-provenance epistemology is implemented by these two dictionaries.

**Save.** Last dates, blackmail map, permanent levels, temporary entries and public-location list all save explicitly. Static writing is an external content dependency. Research's saved partial points and skill threshold perks remain owned by the prior DEEPER_SYSTEMS D2, not redone here.

**Inferred payoff / PROPOSAL.** Keep discovery, usable technique, permission, truth and socially actionable information distinct. K11/K3; P04/P11/P03; means/appraisal, technology and knowledge owners. For YAIRPG do not reveal private actor facts merely because its source has a permissive property whitelist.

## DS15 / Action execution and recurring world effects

**Shown model and authoring.** `G/{ActionSystem,DeusExMachinaSystem}.cs`, `C/{Action,ActionType,Effect,CalendarEffect}.cs`. Actions author shared effect lists and roll-effect relations, duration/type, charge and target selection. ActionSystem creates named special wrappers for rest, class, exams, detention, court, spell/item/ability use and duel verbs. Ordinary authored Action has 511 base rows; CalendarEffect has 360; Effect has 47,202.

**Shown rules.** Execute requires ActionEx and PersonalizedActor. Familiar goes directly to ExecutionHelper. Character actions can trigger conduct consequences for skipping detention/hall sessions. A specified nonhome venue is visited before execution and later left. Rest recovers illness/damage and removes Affliction-type abilities/automatic contexts. Spell/item/ability special actions pass stress and blackmail parameters to their own contexts and systems.

For ordinary actions, calculate rolls first; context Power receives the first roll's power. Then check charge, spend it, attempt deflection, store Started context and execute effects. After execution or venue failure, feedback is recorded and the first eligible nonself default target can receive +1 relationship for Beneficial types and −1 for Hostile types. This final social branch does not check the returned action success. An action with both types can execute both adjustments. Outcome and social impression are therefore separate in this source, but not a proof of intended design.

DeusExMachinaSystem caches Effect rows flagged Everyday. Calendar execution collects every CalendarEffect matching current Date; default Execute gives a one-tick DurationCondition and dispatches each through a special action. Emotion execution uses EmotionalStateCondition instead. GameController runs daily/calendar paths around ordinary scheduled phases; these are explicit simulation steps, not real-time offline catch-up. Content flags and exact condition duration determine behavior, not an assumed “always on” effect label.

**Save.** ActionSystem overrides SaveToStream with references to special actions/types and does not call the ContextStoreSystem serializer. Therefore its Started dictionary is not written by this method even though AbilitySystem inherits that base serializer. Another object path could retain context objects, but restoration of this action bucket is unproven. DeusExMachinaSystem explicitly writes its Everyday effect list. Shared effect definitions, mutable changes and live conditions have separate saved owners. The prior 47-system root array is an ordering contract, not proof that each override serializes every inherited field.

**Inferred payoff / PROPOSAL.** Make action receipts expose paid cost, attempted operation, effect result and observers' actual reaction; author recurring effects through the same meaningful verbs. K8/K12/K18; P10/P12/P24/P16; engine, dialogue/events and save owners. Preserve source discrepancies as checks to design around, not mechanics to copy.

## Reuse boundaries for the requested themes

**Shown/inferred boundary.** This build is rich in a single school year's institutions, authored actions and retained consequences. The reviewed creation/familiar schemas do not show inherited genes, body-part production, breeding or multi-generation succession. Recipe/craft/enchant flows provide a small material-to-tool chain, not a simulated industrial network. Information/research/spells provide usable knowledge, not a complete civilization technology tree. Regions and calendar laws are not a many-world transfer engine. YAIRPG's existing genetics, technology, production and crossing owners remain the places to extend those ideas as original proposals.

**Research gaps.** Full combat/duel/range and Rimbal, every actor binding/expression, all spell interactions, all dialogue attribution, UI creation sequence and real persistence behavior remain open. FAMILY_MAP inventories every old row without promoting table presence to gameplay coverage. CHECKPOINT gives exact resume routes.
