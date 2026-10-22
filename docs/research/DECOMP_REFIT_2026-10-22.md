# Decomp re-fit onto the current engine, 2026-10-22

Weibao asked for a re-fit pass: map the open findings from past decompile and
extraction passes onto the current engine (gear, home, inventory, cultivation,
W1–W4), and asked which further decomps would help. This doc records findings and
proposals only. It selects nothing, changes no standing priority, and authorizes
no runtime work (AD32, AD36). Raw extractions stay in each source's gitignored
`private/` folder (AD35) and are still valid; this pass only re-points their fit
advice.

## Method and limits

- Scope: 29 source dossiers under `docs/research/`, in four reading shards
  (crafting/gear, home/everyday, cultivation/learning, institutions/travel).
  Additional-cultivation (incorporated today) is excluded. Proto23 and Minecraft
  rows list only what [title-rules COVERAGE](../gm/dispatch/title-rules-implementation-2026-10-21/COVERAGE.md)
  and the [MF checkpoint](../gm/dispatch/minecraft-fit-2026-10-21/CHECKPOINT.md) leave open.
- Each actionable finding was checked against `src/` by grep plus the delivered
  reports. Every seam path below was confirmed to exist. Status is grep-level, not
  play evidence: "Delivered" means the mechanism exists in source, not that it was
  rebuilt, browser-checked or accepted.
- Spot-checked by the coordinator: `mixture_feedback.js:49-50` still prints
  "Consumed inputs: unavailable"; `simulation_effects.js:340` ranks knowledge
  stages monotonically; `audited_workshop_lesson.js` and `techniques.js` have no
  manual or self-study route; `management/shipping_farming.js` grants no skill XP;
  the Disco Elysium source paths exist (one shard wrongly marked them stale).
- Input identity: HEAD `e59df9a28` plus the dirty primary working tree on
  2026-10-22. Several `src/` files carry other chats' uncommitted edits (for
  example the W1 `material_treatment.js` work), so some D and P statuses may rest
  on code that later changes or is reverted.
- Seam paths are relative to `src/`; a short path such as
  `world_adaptation/index.js` is a unique suffix (`src/absorb_p23/world_adaptation/index.js`).
  A script resolved all 239 backticked `.js` tokens and found every named `::symbol`
  in its file.
- The institutions shard checked top-level `src/` files for some "not found"
  calls. The coordinator re-grepped the Disco Elysium dialogue and skill files
  (no interjection code); other "not found" rows in that shard carry the same
  limit.
- Old line numbers in nearly every dossier have drifted. Use the seam column, not
  the dossier's line cite.
- W1–W4 seams are owned by the [W1–W4 checkpoint](../gm/dispatch/distinct-world-w1-w4-2026-10-22/CHECKPOINT.md)
  and its [seam map](../gm/dispatch/distinct-world-w1-w4-2026-10-22/SEAM_MAP.md).
  Rows routed there are inputs for that chat, not new gates on it.

Counts over the 194 table rows: D 33, P 79, O 54, N 22, S 2, X 4.

Status key: **D** delivered in source, **P** partly delivered, **O** open and fits
an existing seam, **N** open and needs a new owner, **S** superseded, **X** stale
pointer (dossier names the wrong owner).

## Cross-source clusters

Most open rows collapse into a few shared gaps. One build per cluster closes rows
across several dossiers.

| Code | Shared gap | Rows it closes | Current seam | Notes |
|---|---|---|---|---|
| K1 | Completion receipt with consumed inputs and last delta beside current work | RF-I4, S-I1, ZP1, RWP1, SD-I2, PO1, ARS-P7, PCU-P3, NGU-P6 | `src/mixture_feedback.js::projectMixtureFeedback`; `src/feature_expansion_work_plan.js::workPlanView` | Smallest build, widest reach. Projection-only; no new state if the receipt already exists in the transaction owner. |
| K2 | One owned stock, two quoted destinations, "available after reservations" | PO2, TFC-P4, SD-I1, RF-I1, RWP2, PCU-P2, TW-F1 | `src/mixture_native.js::quoteMixtureAction`; `src/crafting_domain.js::commitCraftingQuote` | `craft_batch_goal.js` is explicitly not a reservation, so free/held counts need a reservation reader. Stale-quote refusal exists for shop and mixture. |
| K3 | Manual or self-study route beside the teacher route | RWP3, SD-I3, ZP2, S-I5, TW-P3, QS-P2 | `src/audited_workshop_lesson.js::auditedLessonFacts`; `src/techniques.js::techniqueFacts`; `src/book_care_runtime.js` | Owned books already give Literacy XP (CRL49). A method-teaching manual is the missing consumer; page-level damaged manuals (TW-P3) need a new owner. |
| K4 | Knowledge that can be wrong, corrected and revised | HV-P1/P2/P4, DE-P4, OW-P1/P4, BB-P7, QUD-P5, QS-P4 | `src/simulation_effects.js` (knowledge stages, `basis`); `src/lore_history_state.js::appendStoryOutcome`; `src/adventure_notebook.js` | Stage rank is monotonic, so a correction cannot downgrade. Default home for revision: the knowledge effect plus the W3 history owner, because the W3 seam map rejects a parallel history array that would split causes. |
| K5 | Institutions: office authority, wages with arrears, notice and departure, follower reassessment of an heir, faction conditional service | TOI-P2, VG-P1/P5/P7/P8, BB-P1, TW-P1/P2, AC-P3 | `src/home_office.js::planHomeOffice`; `src/home_staff.js::planHomeStaff`; `src/heir_inheritance.js`; `src/home_inheritance.js`; `src/reputation.js` | Input for W2. Household staff are paid and dismissible; institutional office, arrears and a living successor are not. |
| K6 | Practice that leaves lasting quality, retry odds and failure injury | ACS-C03..C07, ACS-C09, TW-P5, NGU-P8 | `src/absorb_p23/world_adaptation/techniques.js::advanceCultivation`; `src/absorb_p23/world_adaptation/index.js::prepareTrial`; `src/energy_resources.js` | Input for W4 ("quality or control result beyond throughput"). Current practice changes rate and odds only. |
| K7 | Deterioration and part wear beyond one perishable slice | P23-deterioration, MC-TA2/X8, MC-TFC-P5, MC-hide chain | `src/material_lineage.js`; `src/absorb_e2/durability.js`; `src/material_treatment.js` | Treatment is under a concurrent W1 edit; coordinate. See further decomps O1 and O4. |
| K8 | Conditional salvage opportunity (CRL44) | P23-CRL44, KOL-P5 | `src/absorb_p23/salvage/salvage.js::quoteSalvage`; `src/gear_work.js` (salvage, reforge) | Needs an actual eligibility rule before any UI promise. See further decomp O2. |
| K9 | Dated graded assessment and school week | AC-P1/P2/P5/T15, HL-OWL | `src/teacher_window.js::teacherWindow`; `src/life_record.js::appendLifeMilestone`; `src/chronicle.js` | No exam or grade owner exists. Highest value in a world with schools or graded institutions; elsewhere the same owner could serve guild or sect examinations. |
| K10 | Farming skill, harvest delegation, fishing method | EP1, EP2, EP4 | `src/management/shipping_farming.js::commands`; `src/activities.js`; `src/home_workers.js` | Oldest uncovered everyday gap. |
| K11 | NPC task choice that aborts when a premise changes | RW-P4, HOI-H-I7, QUD-P4 | `src/simulation.js::inspectActorChoices`, `::acceptActorProposal`; `src/simulation_contracts.js` | Large; needs a planner owner. Not a near-term slice. |

### Ranked first actions (proposals)

1. **K1 receipts**: projection change, many dossiers, no save shape change if the transaction already holds consumed inputs.
2. **K2 two destinations with reservations**: makes the existing processed-material lineage visible as a real choice.
3. **K3 manual route**: closes four dossiers' duplicate packet with one consumer.
4. **K5 and K6**: hand to the W1–W4 chat as inputs for W2 and W4 rather than start a parallel lane.
5. **K4 correctable knowledge**: highest design value, needs a knowledge-revision rule first; pairs with W3.

## Stale pointers to fix in the dossiers

| Dossier | Names | Use instead |
|---|---|---|
| caves-of-qud aspects P4 | `src/npc_lives.js` as NPC action owner | `src/simulation.js::inspectActorChoices` / `::acceptActorProposal` |
| caves-of-qud aspects P6 | `src/simulation_clock.js` as scheduler | `src/simulation.js::nextSimulationBoundary` / `::advanceSimulationBoundary` |
| procedural-crafting-ui REPORT:15,17 | "no general generated pipeline, small mixture family" | `src/craft_resolver.js` and `crafting_*.js` now sit beside `mixture_native.js` |
| amazing-cultivation-simulator P01–P03 | "missing consumers"; `feature_expansion_society.js` | delivered in `cooling_refinement_*`, `contextual_balm_*`, `agreed_duty_*` |
| rimworld IMPL 1–3 | `field_workshop.js:15`, `simulation.js:302` etc. | `src/everyday_life.js::moodConditions`; `src/audited_kit_reserve_host.js` |
| groundhog-life P3 | mood balance score via `moodConditions` | it is an irritation/reassurance list; `life_experience.js::lifeLearningMultiplier` is youth-only |
| everyday-paths EG3 | riverbank XP timing on plain LocationActivity | fishing is now a Gathering activity in `src/activities.js`; recheck before acting |
| vagrus P1–P6 | `simulation_effects.js:229`, `village_career.js:135` | line cites drifted; seams in the tables below |
| `src/craft_content_frontier.js` header | says "not wired" | contradicts the Village trial in `crafting_frontier_runtime.js` |

Disco Elysium's `src/components/dialogue_component.js`, `src/models/skill.js`,
`src/data/dialogues.js` and `src/models/game_action.js` exist. Its pointers are valid.

## Per-source tables

### Crafting, materials and gear

| Source | Finding | St | Current seam | Remains |
|---|---|---|---|---|
| Qud | Cooling method with material consequences | D | `cooling_refinement_facts.js::coolingRefinementFacts` | Frozen-body eligibility exceptions |
| Qud | Feat catalogue counting distinct committed outcomes | D | `reference_gameplay_feats.js::advanceReferenceFeats` | Combination goals unconfirmed |
| Qud | Offer, permission, cost and result distinct, teacher provenance | P | `audited_workshop_lesson.js::auditedLessonFacts`; `people_knowledge.js` | Reputation requirement beside offer |
| Qud | Durable save envelope validation | D | `save_files.js::validateSaveEnvelope`, `::writeGuardedSave` | Unsupported-version message, prior-snapshot recovery unchecked |
| Qud | Resumable contextual guidance by lesson/substep ID | N | none | No onboarding owner |
| Qud | NPC observation, eligibility and result separate | X | `simulation.js::previewSimulationCommand`, `::inspectActorChoices` | Typed rejected/deferred/attempted results (K11) |
| Qud | Shared fact identity for journal, rumour, relic | O | `lore_history_state.js::queryStoryOutcomes`; `world_knowledge.js::worldIdentityView` | Per-actor discovery (K4, W3) |
| Qud | Declare each delayed effect's clock and inactive-zone rule | X | `simulation.js::advanceSimulationBoundary` | Inactive-region catch-up policy |
| Qud audit | Ability supplier vs inherent training | P | `material_apprentice.js::menderCapabilities`; `techniques.js` | Support-loss proof |
| Qud audit | Object identity, known method, reference access distinct | P | `craft_state.js::knows`; `recipe_connections.js::knownRecipeVariants` | Physical reference that builds without learning (K3) |
| Qud audit | Title/reputation effects through real consumers | D | COVERAGE SLR40–43, CRL42–48 | Social/reactive titles need a world mechanism |
| Qud audit | Generated task keeps real target identity | O | `lore_history_state.js`; `world_knowledge.js` | Arrival, loss, turn-in, reload gates |
| Qud audit | Description, initialized state, activation, outcome as stages | P | `simulation.js::previewSimulationCommand`; `action_legibility.js::projectActionLegibility` | No uniform four-stage contract |
| Proc-craft UI | Causal process distinction with useful output | D | `craft_resolver.js::resolveBatch`; `crafting_domain.js::commitCraftingQuote` | Dossier snapshot stale |
| Proc-craft UI | Ingredient detail with cross-use and free/held quantities | P | `crafting_detail.js`; `recipe_connections.js::knownUsesOf`; `material_choice_view.js` | Available after reservations (K2) |
| Proc-craft UI | Notebook comparing two attempts, saving a method revision | O | `craft_state.js::freezeRecipe`; `mixture_state.js` | Comparison view (K1) |
| Proc-craft UI | Repeat with declared substitutions, reserves, stop reason | P | `simulation.js::setSimulationProgram`; `field_works_projection.js` | Substitution and reserve policy |
| Proc-craft UI | Layout grid / map only where it expresses decisions | N | none | Parked |
| Proc-craft UI | One owned lot, each use debited once; exact vs functional slots | D | `material_lineage.js::planMaterialSplit`; `processed_materials.js::allocatedRecipeInputs` | |
| Taiwu ingredients | One herb, two medicinal products | P | `recipe_connections.js::knownUsesOf`; `material_treatment.js::quoteHideTreatment` | Herb with buff and treatment products (K2) |
| Taiwu ingredients | Spend, tool wear, output accounted apart | D | `gear_work.js::quoteGearWork`; `absorb_e2/durability.js`; `native_craft_transaction.js` | |
| Taiwu ingredients | Start and collect as separate calls | S | `native_craft_transaction.js`; `simulation.js::cancelSimulationJob` | YAIR's own hold/refund semantics |
| Taiwu ingredients | Same substance, different preparation, stock-role matrix | O | `material_lineage.js::readMaterialLineage`; `material_treatment.js` | Design work (W1) |
| Taiwu | Teacher goodwill, institutional support, study permission apart | O | `home_household.js::planHouseholdLife`; `audited_workshop_lesson.js` | Institutional support (K5, W2) |
| Taiwu | Distinct succession channels and legacy budget | P | `heir_inheritance.js::applyHeirLeftovers`; `home_inheritance.js::applyHomeEstate` | Per-channel policy, living officeholder (K5, W2) |
| Taiwu | Damaged manual with page-level knowledge | N | nearest `book_care_facts.js` | Page/reference-copy model (K3) |
| Taiwu | Worker skill, facility and inputs jointly set output | D | `home_workers.js::planWorkerRoom`; `home_staff.js` | |
| Taiwu | Internal-force reserve, allocation, compatibility | P | `energy_resources.js::energyView`; `techniques.js` | Two-method quality, compatibility (K6, W4) |
| Taiwu | Ordered life/study/work phases with change report | P | `simulation.js::advanceSimulationBoundary` | Combined vs split advance agreement |
| Taiwu | Definitions, instances, descriptions apart, cross-validated | D | `world_instances.js::validateWorldBindings` | |
| Potionomics | Forecast vs actual, remaining time, next shortage | P | `mixture_feedback.js::projectMixtureFeedback` | Consumed inputs receipt (K1) |
| Potionomics | Two destinations for one batch | O | `mixture_native.js::quoteMixtureAction` | K2 |
| Potionomics | Teacher grants technique; learned/practiced/usable shown | D | `audited_workshop_lesson.js`; `techniques.js::techniqueFacts` | |
| Potionomics | Paid dialogue choice with failure and later changed offer | O | `ink_narrative.js::commitInkNarrativeAction` | Retained outcome read later |
| Potionomics | Composition fit, potency band; refund vs discard | P | `mixture_native.js`; `craft_cues.js::craftCue` | PO5 parked |
| Ars Nouveau | One learned verb across direct use and queued repeat | D | `field_works_content.js`; `field_works_projection.js` | |
| Ars Nouveau | Ordered technique recipe | D | `field_works_content.js::fieldSequenceId` | Modifier-compatibility rejection |
| Ars Nouveau | Owned device, finite unattended work | D | `field_works_extension_facts.js`; `home_workers.js` | |
| Ars Nouveau | Authorize at execution and completion | D | `field_works_projection.js`; `field_workshop.js` | |
| Ars Nouveau | Energy capacity, reservation, per-job use | D | `energy_resources.js::energyCharge` | |
| Ars Nouveau | Maintained environment supplies conditions | D | `field_care_facts.js` | Per-world diversity tuning |
| Ars Nouveau | Binding reason and work receipt per blocker | P | `field_works_projection.js::fieldWorksMessage` | Receipt (K1) |
| Minecraft | Integrity budget on component items | P | `gear_work.js::workContributions` | Typed per-slot budgets (as cost, AD38) |
| Minecraft | Per-role material blocks, wear-keyed growth | D | `gear_work.js::workedWearProfile`; `gear_dimensions.js` | |
| Minecraft | Rarity rule list per world tier | P | `gear_affixes.js::WORLD_AFFIX_DIALS` | Achievement-unlocked rarity |
| Minecraft | Salvage and reforge, outcome fixed before roll | D | `gear_work.js`; `gear_acquisition.js::affixedStockEntries` | |
| Minecraft | Key bands for locks and access | N | none | No lock/key model |
| Minecraft | Trial with per-wave and completion pay | O | `rewards.js`; `audit_remainder_combat_objectives_host.js` | Settlement idempotence |
| Minecraft | Part-share companion sheet; bounties from need | O | `audit_remainder_offers_host.js`; `home_staff.js` | |
| Minecraft | Informative-failure alchemy with per-world code | O | `mixture_rules.js`; `mixture_state.js::localMixtureSeed` | Placed vs misplaced feedback |
| Minecraft | Name every limiting cap and stall reason | P | `action_legibility.js::projectActionCosts` | Per-station caps |
| Minecraft | Part wear with compounding break chance, spares | N | `absorb_e2/durability.js` (equipment only) | Per-station part lifetime (K7) |
| Minecraft | Selected part properties survive assembly | P | `gear_work.js::quoteGearWork`; `crafting_component_filling.js` | Forging-quality ordinal |
| Minecraft | Readiness with station, fluid, means apart | P | `crafting_visibility.js::itemRecipeStatus` | Fluid/means split |
| Minecraft | Chemical supply subchain (lye/tannin) | P | `field_works_extension_facts.js`; `world_climate.js` | Subchain open (K7) |
| Minecraft | Staged hide/leather chain | P | `material_treatment.js::quoteHideTreatment`; `gear_workshop_domain.js::quoteHide` | Barrel/scrape/tan stages (W1 concurrent) |

### Home, household, farming and everyday life

| Source | Finding | St | Current seam | Remains |
|---|---|---|---|---|
| RimWorld | Finite kit reserve with stock thresholds | D | `audited_kit_reserve_host.js::startAuditedKitReserve` | |
| RimWorld | Frost warning with cover/early harvest/neglect | D | `audit_remainder_consequences_content.js`; `world_completion_crop_clock.js` | |
| RimWorld | Recent friction expires, promise remains, concession | P | `everyday_life.js::moodConditions`, `::socialCommands` | Pair-specific concession |
| RimWorld | Blocker plus latest result beside work | P | `feature_expansion_work_plan.js::workPlanView` | K1 |
| RimWorld | Two uses of one good, quoted side by side | P | `mixture_native.js` | K2 |
| RimWorld | Manual route beside teacher | O | `audited_workshop_lesson.js` | K3 |
| RimWorld | Body condition changes action rate | P | `gear_work.js`; `status_care_facts.js` | Other jobs, treatment path |
| RimWorld | Learned companion contribution | N | none | Companions lane |
| Stardew | Alternative destination for one chain good | P | `mixture_native.js` | K2 |
| Stardew | Held inputs, remaining work, blocker on job | P | `workPlanView`; `action_legibility.js` | K1 |
| Stardew | Self-study route | O | `audited_workshop_lesson.js` | K3 |
| Stardew | Paid exchange with success, failure, refusal | P | `ink_narrative.js`; `ink_scene_content.js` | Failure that changes later action |
| Stardew | Maturation with intermediate-quality collection | N | nearest `earned_drying_tracker.js` | |
| Rune Factory 5 | One stock, two outcomes | P | `mixture_native.js` | K2 |
| Rune Factory 5 | Useful work grants technique evidence | O | `techniques.js::techniqueFacts` | Which jobs grant evidence |
| Rune Factory 5 | Attempt state survives the line | P | `ink_narrative.js` | |
| Rune Factory 5 | Helper assignment shows last delta, next blocker | P | `workPlanView` | K1 |
| Sapiens | Typed blocker projection | P | `action_legibility.js::projectKnownActionRequirements` | K1 |
| Sapiens | Learned, allowed, held, ready-now apart | P | `techniques.js`; `action_legibility.js` | Held-tool and role fields |
| Sapiens | Dry-to-kit lot with environment rate | P | `earned_drying_tracker.js` | Rate pause, lot-to-kit join |
| Sapiens | Experiment trial ledger | N | `skill_discovery.js` (projection only) | |
| Sapiens | Practice without mastery via teacher/study/practice | O | `techniques.js`; `audited_workshop_lesson.js` | K3 |
| Sapiens | Reusable container fill/empty | N | `inventory_composition.js`; `realm_cargo.js` | Parked unless custody supports it |
| Zomboid | Blocker, last result, next action | P | `workPlanView` | K1 |
| Zomboid | Learn by teacher or manual; prep changes cost | O | `audited_workshop_lesson.js` | K3 |
| Zomboid | Dry-to-kit with rate condition | P | `earned_drying_tracker.js` | |
| Zomboid | Body part explains action-rate change | P | `gear_work.js`; `status_care_facts.js` | |
| Zomboid | Reference aid for a skill gap | N | none | Deferred balance idea |
| Zomboid | Pinned job validation for recipe-change refusal | O | `simulation.js` | Function not located |
| Everyday paths | Courtyard crop gives Farming XP and care choice | O | `management/shipping_farming.js::commands` | K10 |
| Everyday paths | Fishing method choice | O | `activities.js` | Bait not modelled (K10) |
| Everyday paths | Riverbank XP timing | X | `models/location.js`; `activities.js` | Recheck |
| Everyday paths | Delegate a harvest to a helper | N | `management/foreman.js`; `home_workers.js` | K10 |
| Everyday paths | Reusable discovery combinations | O | `skill_discovery.js::projectTechniqueDiscovery` | |
| Groundhog Life | 24-hour budget with chore minutes | N | `world_rhythm.js::calendarMinutes`; `home_household.js` | Per-world routine mode |
| Groundhog Life | Dated opportunity checks ("needed X by age Y") | O | `chronicle.js::nextChronicleBoundary`; `life_record.js` | |
| Groundhog Life | Mood balance feeding learning | X | `everyday_life.js`; `life_experience.js` | Target unmet |
| Groundhog Life | Reading queue, faster rereads | O | `book_care_runtime.js` | |
| Groundhog Life | Soft loop end with restart preview | O | `chronicle.js::lifespanDeadline` | |
| Several | Household cook, tutor, heir routes | S | `home_household.js`; `home_staff.js`; `home_inheritance.js` | Delivered HL1–HL4 |

### Cultivation, powers, learning and school

| Source | Finding | St | Current seam | Remains |
|---|---|---|---|---|
| Tale of Immortal | Behaviour-changing memories retained longer | P | `people_knowledge.js`; `chronicle.js::relationshipChange` | General retention class |
| Tale of Immortal | Institution funds wages with arrears, backpay | P | `home_staff.js::planHomeStaff` | K5, W2 |
| Tale of Immortal | Expired opportunity leaves aftermath | O | `backlog_expansion_opportunities.js::stageOpportunityCommand` | |
| Tale of Immortal | Preparation changes result; failure recovery | P | `cooling_refinement_host.js` | Inferior-prep branch (W1) |
| Tale of Immortal | Named people vs aggregate population | P | `npc_lives.js`; `world_pack_population.js` | Count-to-named promotion |
| Tale of Immortal | Eligibility, chance, pacing as separate rules | D | `storylet_deck.js::storyletCandidates` | Shared disruption budget |
| Tale of Immortal | Past conduct gates an elder's offer | O | `chronicle.js::relationshipChange` | No reader of the receipt |
| Tale of Immortal | Sealed threat with reseal/release | N | nearest `world_instances.js` | Site-state owner |
| ACS | Prepared cooling refinement | D | `cooling_refinement_host.js` | |
| ACS | Balm treats scraped palms | D | `contextual_balm_host.js`; `body_progression.js` | |
| ACS | Negotiated next duty | D | `agreed_duty_host.js`; `agreed_duty_continuation.js` | |
| ACS | Breakthrough spend, paid roll, retry, injury | P | `world_adaptation/index.js::prepareTrial` | Retry odds, injury (K6) |
| ACS | Conversion leaves lasting quality | O | `world_adaptation/techniques.js::advanceCultivation` | K6, W4 |
| ACS | Timed tribulation | N | none | |
| ACS | Environment affects practice and hazard | P | `exposure/exposure.js::gustTerms` | Light/season on practice |
| ACS | Material to artifact to combat properties | P | `material_lineage.js`; `gear_work.js` | Combat link unverified |
| ACS | Medicine batches, failed pills | O | `processed_materials.js` | |
| ACS | Method access vs learning, archive capacity | O | `world_completion_learning_runtime.js`; `home_office.js` | |
| ACS | Travel phases | P | `expedition_content.js` | Unverified |
| ACS | Alert-driven pause/slowdown | O | `simulation.js::pauseSimulationProgram` | |
| ACS | Favour/mood memory drift | P | `chronicle.js`; `agreed_duty_host.js` | Baseline drift |
| NGU | Quantified transition preview | P | `structured_renewal.js::previewStructuredRenewal` | UI check |
| NGU | Unlock reasons | P | `action_legibility.js` | "Learned, needs tool" label |
| NGU | Desktop activity board | P | `simulation_ui.js::createSimulationPanel` | Board |
| NGU | Voluntary restriction | O | `structured_renewal.js` | |
| NGU | Retained practice lowers repeat cost | D | `power_models.js::fluencyDuration` | |
| NGU | Ready-result reminder | O | `simulation_ui.js` | K1 |
| NGU | Capacity-return projection | O | `feature_expansion_work_plan.js` | |
| NGU | Multi-means project | P | `world_adaptation/techniques.js::cultivationMethods` | K6, W4 |
| NGU | Durable personal best | O | `life_record.js::appendLifeMilestone` | |
| Academagia | Standing week plan | P | `teacher_window.js`; `world_rhythm.js::recurringWindow` | K9 |
| Academagia | Dated exams vs cohort | O | `chronicle.js`; `life_record.js` | K9 |
| Academagia | House points, favour, detention | N | `reputation.js` (region only) | K5/K9 |
| Academagia | Staged skill-check adventures with odds | P | `check_contract.js::prepareCheck`; `check_odds.js::checkOdds` | Staged structure |
| Academagia | Classmate cohort | P | `world_pack_population.js` | Exam feed |
| Academagia | Stress bonus, overflow preview | P | `energy_resources.js` | Preview |
| Academagia | Year-end report card | O | `life_record.js` | K9 |
| KoL | Life rule profiles | O | `chronicle.js::createHeirChronicle`; `heir_inheritance.js` | |
| KoL | Three capacity organs | P | `energy_resources.js::validateEnergyPolicy` | Meal/drink/tonic triad |
| KoL | Charges with shared pool | O | `content_packs.js` | |
| KoL | Two-tier refundable permanence | O | `heir_inheritance.js` | |
| KoL | Requirement-flag crafting, folds, smash gear | P | `crafting_detail.js`; `gear_work.js` | K8 |
| KoL | Retired "last available" items | O | `world_pack_manifest.js` | |
| KoL | Companion weight scalar | O | `party_partner_content.js` | |
| Hogwarts | Lesson gives method, task gains solution | D | `lever_lesson.js::leverFacts` | Taste acceptance open |
| Hogwarts | Task record separates evidence/return/practice | D | `lever_lesson.js::leverTaskRecord` | |
| Hogwarts | Finite bench batch supplies input | D | `lever_lesson.js`; `audited_kit_reserve_content.js` | |
| Hogwarts | Habitat care | D | `habitat_care.js` | |
| Hogwarts | Teacher window | D | `teacher_window.js` | No term gate |
| Hogwarts | Partner help, material choice, earned tracker | D | `audit_remainder_livelihood_content.js`; `audit_remainder_home_content.js` | Seams by grep only |
| Hogwarts | Graded assessment | O | `chronicle.js`; `life_record.js` | K9 |
| Hogwarts | Challenge groups and collections | O | `skill_discovery.js::projectDiscoveryCatalog` | |

### Institutions, travel, history and investigation

| Source | Finding | St | Current seam | Remains |
|---|---|---|---|---|
| Vagrus | Companion objects, negotiates, leaves with notice | P | `party_battle.js`; `party_partner_content.js`; `helper_content.js` | Notice, arrears, tool custody (K5) |
| Vagrus | Journey supply/time budget, pace, stop condition | O | `realm_cargo.js::buildNativeRealmCargoSnapshot`; `action_legibility.js` | No ration or pace model |
| Vagrus | Completion stops the job clock; pay collected later | P | `original_frontier_campaign_content.js` | Completion timestamp, payment receipt |
| Vagrus | Show who supplied a check | O | `simulation_contracts.js`; `action_legibility.js::projectSimulationActionLegibility` | Resolver attribution |
| Vagrus | Deputy/quartermaster as funded job | P | `home_staff.js`; `home_office.js::planHomeOffice` | Institutional office (W2) |
| Vagrus | Companion personal project unlocks a practice | P | `party_partner_content.js` | |
| Vagrus | Faction gift vs conditional service | N | `reputation.js` | W2 |
| Vagrus | Follower makes a fresh agreement with the heir | O | `heir_inheritance.js`; `home_inheritance.js` | K5 |
| Heaven's Vault | Evidence-backed interpretations with confidence | P | `simulation_effects.js` (stages, `basis`) | Rejected readings (K4) |
| Heaven's Vault | Wrong reading, attributed response, correction | N | `simulation_effects.js`; `causal_story_native.js` | Revision rule (K4) |
| Heaven's Vault | Notebook retrieves related evidence | O | `adventure_notebook.js::createAdventureNotebook` | |
| Heaven's Vault | Revisable history, event vs learned time | O | `lore_history_state.js::appendStoryOutcome`; `lore_history_view.js` | W3 |
| Heaven's Vault | Graded route discovery | P | `known_routes.js::projectKnownRoutes` | Rumour/area/exact stages |
| Heaven's Vault | Queue travel, pause at unknown branch | P | `backlog_expansion_transit.js`; `world_instances.js::planWorldClock` | Ordinary journeys |
| Battle Brothers | Continue a named helper agreement | P | `agreed_duty_continuation.js`; `helper_content.js` | K5 |
| Battle Brothers | Cause ledger for local standing | P | `simulation_effects.js`; `lore_history_view.js::storyRecap` | Link to regional standing |
| Battle Brothers | Specialist service after real work | O | `action_legibility.js`; `gear_workshop_domain.js` | |
| Battle Brothers | Work during companion recovery | P | `party_battle.js` | Recovery estimate, alternatives |
| Battle Brothers | Local crisis changes a route or institution | P | `storylet_deck.js`; `event_feed.js` | Route/institution crisis |
| Battle Brothers | Enemy power as observed method | O | `adventure_notebook.js`; `simulation_effects.js` | K4 |
| Battle Brothers | Individual ending for service and loss | P | `npc_lives.js`; `life_record.js` | Helper-to-milestone link |
| Disco Elysium | Work skill gives a private attributed observation | O | `components/dialogue_component.js`; `models/skill.js` | No interjection code found |
| Disco Elysium | Failed action becomes a new situation | O | `models/game_action.js`; `action_legibility.js::projectActionAftermath` | |
| Disco Elysium | Conversation plants a question to study | P | `adventure_notebook.js`; `village_career.js` | Study unlocks topic |
| Disco Elysium | Fallible claim, corrected by evidence | P | `observation_content.js`; `simulation_effects.js` | K4 |
| Disco Elysium | Retry reason; preparation reopens gate | P | `action_legibility.js::projectEssentialRecovery` | Attempt history |
| Disco Elysium | Modifier breakdown matches resolver chance | P | `action_legibility.js`; `simulation_resolution.js` | Parity unverified |
| Outer Wilds | Connected field notes | O | `adventure_notebook.js`; `known_routes.js` | K4 |
| Outer Wilds | Unfinished-lead hints without hidden counts | P | `native_discovery_policy.js::createDiscoveryCuePolicy` | Per-note lead status |
| Outer Wilds | Remembered visit window | P | `world_rhythm.js::recurringWindow`; `world_calendar.js` | Knowledge-gated planning |
| Outer Wilds | Incomplete record useful via two routes | O | `simulation_effects.js`; `causal_story_native.js` | K4 |
| Outer Wilds | Knowledge-only reset for one scenario | N | `anchor_snapshots.js` | Transition runtime |
| Rain World | Observed target state with expiry | P | `people_knowledge.js::knownPeopleView`; `away_ledger.js` | Stale-state expiry |
| Rain World | Target transfer and cleanup together | N | `simulation_contracts.js` | Design check on reservations |
| Rain World | Social recognition, affect, trust apart | P | `simulation_effects.js` | Transient affect |
| Rain World | Trace utility to world consumers | N | `simulation.js` | K11 |
| HoI4 | Decision chain without double payout | D | `storylet_deck.js`; `lore_history_state.js` | |
| HoI4 | Condition lifecycle changes a job quote | P | `simulation_effects.js`; `conditions.js` | World condition on quote |
| HoI4 | Method-family switch explains skill loss | P | `absorb_p23/field_familiarity/index.js` | Switch cost |
| HoI4 | Admission, visibility, ability apart | D | `action_legibility.js::playerActionDisclosure` | |
| HoI4 | Lint for chain references | P | `anchor_snapshots.js::lintWorld` | Chain coverage |
| HoI4 | Method mastery apart from active effects | P | `simulation_effects.js`; `techniques.js` | Declared-effect retraction |
| HoI4 | NPC task aborts when premise changes | N | `simulation.js` | K11 |
| Proto23 | CRL44 conditional salvage | O | `absorb_p23/salvage/salvage.js::quoteSalvage` | K8 |
| Proto23 | Spatial slip or landing situations | N | none | Landing consumer |
| Proto23 | General deterioration | O | `material_lineage.js` | K7 |

## Further decomps that would help (proposals)

Targeted at open clusters. Broad sweeps would mostly re-find saved material.

| Code | Target | Closes | Route | Gate |
|---|---|---|---|---|
| O1 | Dwarf Fortress economy, nobles/positions, legends, item wear | K5, K7, W3 | Installed. DFHack's public `df-structures` plus raws, before any Ghidra pass | Name the native question first (dossier CHECKPOINT rule) |
| O2 | Caves of Qud tinkering and disassembly | K8 | Already decompiled with ILSpy; read only | None |
| O3 | Scroll of Taiwu unread tables: sect office, inheritance, durability | K5, K7 | Installed; ILSpy route proven | Lane checkpoint names the tables |
| O4 | Project Zomboid item condition and rot | K7 | Installed; plain Lua and Java | None |
| O5 | Songs of Syx, Stoneshard | K5, K7 | Ownership unverified | Purchase needs Weibao's yes |

Skip 100 Space Cats (Cpp2IL output has empty bodies, navigation only) and Kingdom
Hearts (no open cluster).
