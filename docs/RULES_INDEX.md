# Rules index

One entry point for every standing rule in the project. Weibao, 2026-10-16:
"reconcile and organize all the rules for other aspects as well? maybe update
project.md to refer and accordingly make all work easier and more guided?"
([USER_VISION](USER_VISION.md#rules-index-and-reconciliation-2026-10-16)).

This file organizes; it adds no authority. The AD rules below restate accepted
decisions in one line each so agents can cite them. When an AD line and its
linked decision differ, the decision wins. Open details named in a decision stay
open here too.

## How to use it

0. Read [GROUND_RULES](GROUND_RULES.md) once per session; its accepted blocks bind and its proposed blocks are prompts.
1. Find your task in the [router](#router-what-applies-to-my-task) and read the
   codes it names in their rulebooks.
2. Check the [AD rules](#accepted-direction-rules-ad) for every aspect the task
   touches, including ones without a rulebook of their own.
3. Apply them, then choose the smallest coherent reversible behavior. Cite the
   codes in the task record or handoff ("SR7, MR4, AD16").
4. Escalate to Weibao only for a real conflict, a direction change or an
   irreversible choice. Ordinary details are resolved from existing direction
   (AD32).

## Authority order

| Level | What | Notes |
|---|---|---|
| 1 | Weibao's words in [USER_VISION](USER_VISION.md) and [PROJECT accepted decisions](../PROJECT.md#accepted-decisions) | Later direction supersedes earlier; superseded wording stays as dated history |
| 2 | Standing rulebooks in the register below | Bind how agents design and build. Each rule is a default with a reason; a world or feature may propose an exception and must say why |
| 3 | Source-qualified world law | Decides what is true inside one world (Rulebook 2–3). It narrows level 2 defaults for that world; it does not change project direction |
| 4 | Proposals: palettes, audits, considerations, checkpoints (GR and CX were accepted, see the register) | Never binding. Saving one does not authorize building it |

## Register of rule sets

| Set | Codes | Status | Covers | Owner |
|---|---|---|---|---|
| Ground rules | FLR1–FLR6, PRF1–PRF8, FND1–FND5 | FLR accepted 2026-10-26 (AD43); PRF and FND proposed 2026-10-26 | Digest read before any task: accepted authority, delivery floor and process; proposed design pre-flight and foundation defaults | [GROUND_RULES](GROUND_RULES.md) |
| Foundational rulebook | Rulebook 1–12 | Accepted 2026-10-10 | Multiverse-wide principles: worlds set their own rules, carriers, means, bodies, time, outliers | [RULES_FROM_SCRATCH](RULES_FROM_SCRATCH.md#the-rulebook-accepted-2026-10-10) |
| Accepted direction rules | AD1–AD46 | Restates accepted decisions | Aspects without a rulebook: knowledge, lives, time, recovery, entry, goals, economy, cheats, process and UI design attention | [Below](#accepted-direction-rules-ad) |
| UI rules | UR1–UR82 (UR1–UR75 standing; UR76–UR82 proposed, in use) | Standing 2026-10-15; Discord reference-guide fold 2026-10-21; small-detail tokens UR65–UR68 and region lending UR69 2026-10-22; effect-first descriptions UR70–UR74 2026-10-25; contextual terms UR75 2026-10-26; UR76–UR82 and UIV1–UIV4, UIV6, UIV7 proposed, in use (CHOICES 4, 2026-10-30), not part of the standing range | All player-facing UI, including source-qualified reference adaptation | [UI_RULES](UI_RULES.md) |
| Architecture rules | AR1–AR16 | Standing 2026-10-16; AR1 net-zero wording 2026-10-19 | All runtime code: composition root, domain registry, save slices, seams; 2026-10-18 application: transactions, interrupted stages, observer-safe boundaries and clock ownership | [ARCHITECTURE_RULES](ARCHITECTURE_RULES.md) |
| Mockup workflow | MW1–MW8 | Standing 2026-10-16; fidelity/freshness correction 2026-10-26 | Unsettled layouts and interaction comparisons; archived/sketch/native status, live input drift checks, isolated native startup and faithful populated shell evidence | [MOCKUP_SYSTEM](MOCKUP_SYSTEM.md) |
| Making rules | MR1–MR36 | Standing 2026-10-15 | Potions, cooking, smithing, runes, enchanting, formations, constructs, any making; 2026-10-18 application: intermediate work and actual mechanism compatibility | [MAKING_RULES](MAKING_RULES.md) |
| Site and exploration rules | SR1–SR24 | Standing 2026-10-16 | Sites, ruins, natural places, maps, discovery, restoration | [SITE_AND_EXPLORATION_RULES](SITE_AND_EXPLORATION_RULES.md) |
| Sealed secrets | none | Standing 2026-10-10 | Hiding world truths from Weibao outside play | [AGENTS](../AGENTS.md#sealed-secrets), [discovery doc](worlds/WORLD_SECRETS_AND_DISCOVERY.md#sealed-secrets-standard-rule-2026-10-10) |
| Means and appraisal | none (MN/AP/LS/IMP/ML/AA are proposal identifiers) | Accepted principle 2026-10-10; detailed palette remains proposed | What each side can know and do; actual costs/counters and observer-safe failure readings | [MEANS_AND_APPRAISAL](MEANS_AND_APPRAISAL.md) |
| Agent usage | AU1–AU15 | Standing 2026-10-16 | Whole-book plans, short-lived readers, bounded continuity, tree budgets and stop conditions | [Agent usage rules](AGENT_USAGE_RULES.md) |
| Agent workflow | AGENTS sections | Standing | Design framing, scope, research lens, verification, saves, sources, deep-detail storage, multi-agent ownership | [AGENTS](../AGENTS.md), [GM prompt](GAME_MASTER_PROMPT.md), [shared worktree practice](gm/SHARED_WORKTREE_PRACTICE.md) |
| Source research | none | Standing | Saved-source reuse, acquisition and bounded deep dives of books, games and wikis | [Tool registry](TOOL_REGISTRY.md), [acquisition tools](research/SOURCE_ACQUISITION_TOOLS.md), [deep dive playbook](research/SOURCE_DEEP_DIVE_PLAYBOOK.md) |
| Generation foundation rules | GR1–GR17 | Accepted 2026-10-18, confirmed conditional on core rules 2026-10-19 (proposed 2026-10-14) | Contract for every generator; selector versus mechanism, owning-clock draw identity and event-time public knowledge | [GENERATION_FOUNDATION_RULES](GENERATION_FOUNDATION_RULES_2026-10-14.md) |
| Complexity guardrails | CX1–CX8 | Accepted 2026-10-16 (P9Z40; Weibao: "I like these rules"), confirmed under core rules 2026-10-19 | Keeping depth while bounding implementation; CX4 retains hidden causal commitments | [GROUND_RULES](GROUND_RULES.md#complexity-guardrails-cx1-cx8) (moved 2026-10-29 from the Part 9 pass, which keeps a stub) |
| World absorption rules | WA1–WA53 | WA1–WA21 accepted 2026-10-18 (proposed 2026-10-17); WA22–WA24 (census rungs, dated whereabouts, forward anchors) accepted 2026-10-27; WA25–WA41 (actions, loops, progression, untaken options, time precision, shard gates, read-ahead freshness, conflicts by outcome, stats by calibration, allies as lives, faithful/approximate/open, environment, keyed events, layered fills, talks change facts, two-layer held state, extract what a consumer reads) accepted 2026-10-27 as adjustable working direction (Weibao's adoption, register 5b; later dated wording wins, earlier stays as history); WA42–WA47 (relationships from choices, people by tier, pilot hand-off, top-down calibrated systems, archetypes, one recipe shape) proposed 2026-10-27, awaiting Weibao's yes; WA48 (seams shaped on the whole source) accepted 2026-10-30; WA49–WA50 (whole-source gap register, dated character records by tier) accepted 2026-10-30; WA51–WA53 (a row's condition facts need a named supplier, how a thing reached you is data, row tests assert their source window) proposed 2026-10-30, awaiting Weibao's yes | Turning a read source into a world pack the shared engine plays: canon status, laws as rules, generated gaps, IDs, proof; 2026-10-18 application: source/observer/implementation coverage and bounded slice floors | [WORLD_ABSORPTION_RULES](WORLD_ABSORPTION_RULES.md) |
| Body and health rules | BHR1–BHR30 | Accepted 2026-10-18 (proposed 2026-10-17; BHR1, BHR6, BHR14, BHR16 restate accepted AD13, AD8, AD19 and no hunger death; BHR21, BHR30 accepted through AD38) | Bodies, carriers, injury, illness, poison, healing, medicine, recovery, body wear across worlds; 2026-10-18 application: body clocks, hidden care boundaries and policy reroute | [DOMAIN_RULES](DOMAIN_RULES.md#body-and-health-rules) (old path [stub](BODY_AND_HEALTH_RULES.md)) |
| Combat rules | CBR1–CBR30 | Accepted 2026-10-18 (CBR1, CBR7, CBR9, CBR10, CBR13, CBR18 restate accepted AD19, AD20, AD25, AD28, AD8, AD38) | Fights, encounters, enemies, weapons in use, defeat and victory outcomes, fleeing, pursuit, captives, idle combat, nonviolent conflict; 2026-10-18 application: queued outcomes, withdrawal settlement and actual faculties | [DOMAIN_RULES](DOMAIN_RULES.md#combat-rules) (old path [stub](COMBAT_RULES.md)) |
| Economy rules | ECR1–ECR33 | Accepted 2026-10-18 (ECR1, ECR24, ECR27 restate accepted AD27, AD31, AD11) | Money, prices, merchants, trade, currencies, credit, wealth, property, carryover of wealth; 2026-10-18 application: belief-based quotes, currency shape and transfer accounting | [DOMAIN_RULES](DOMAIN_RULES.md#economy-rules) (old path [stub](ECONOMY_RULES.md)) |
| Skill and learning rules | SLR1–SLR43 | Accepted 2026-10-18 (SLR2, SLR5, SLR17 restate standing MR21–MR23; SLR3, SLR15, SLR20, SLR24–SLR26, SLR32–SLR33, SLR38 restate accepted AD lines) | Skills, practice, teaching, texts, rust/loss and carryover; 2026-10-18 carrier/clock application; 2026-10-21 AD30/AD38 applications SLR40–SLR43 distinguish titles, competence, grants, activation and effect ownership | [DOMAIN_RULES](DOMAIN_RULES.md#skill-and-learning-rules) (old path [stub](SKILL_AND_LEARNING_RULES.md)) |
| Presence and interaction rules | PIR1–PIR25 | Accepted 2026-10-18 (PIR5, PIR6, PIR12, PIR20–PIR23, PIR25 restate accepted sealed secrets, UR35, UR52, AD16, D11, AD11–AD12, AR and AD34) | Who and what is present in a place, selecting people, stations, events and ways out, verbs on them, known contact availability and observer-safe refusals, new and heard dialogue, presence across idle time, rewinds and lives | [DOMAIN_RULES](DOMAIN_RULES.md#presence-and-interaction-rules) (old path [stub](PRESENCE_AND_INTERACTION_RULES.md)) |
| World pass rules | WPR1–WPR32 | Proposed 2026-10-23; workflow reconciliation 2026-10-25 | How any world audit, expansion, exploration or implementation pass runs: pass shape, coverage dimensions (facilities, person-to-person roles, institutions, money, time, power, starts, failure, surfaces), review gates, more-to-consider rounds, durable saving | [WORLD_PASS_RULES](WORLD_PASS_RULES.md) |
| Progression gate rules | GTR1–GTR35 | Proposed 2026-10-23; descriptor, inspector and herb lesson implemented 2026-10-23; book-world round GTR28–GTR35 | Any point where progress waits: bottlenecks, ranks, admission, knowledge, maturation, start and UI reveal gates; absorbing them from sources, one evaluator, admission versus continuing support, staged openings, overflow and legibility | [PROGRESSION_GATE_RULES](PROGRESSION_GATE_RULES.md) |
| Ability rules | ABR1–ABR22 | Proposed 2026-10-25 | Absorbing, modelling, using and showing any world's abilities: powers, spells, techniques, cheat powers, device functions; the shared power seam and structured descriptor; admission/support boundaries and AD36-scaled evidence | [ABILITY_RULES](ABILITY_RULES.md) |
| World entry rules | WER1–WER17 | Standing consideration rules 2026-10-26 (Weibao's request); named defaults are dials | How a player enters any world: separate worlds and carriers, crossing methods and their nine answers, canon mechanisms including late reveals, era, origin, host body, carry, age access, protagonists, outsider notice, one start list, credit/licence and save compatibility; hub and lobby worlds (WER17, 2026-10-26) | [WORLD_ENTRY_RULES](WORLD_ENTRY_RULES.md) |
| Cast-lives rules | CLR1–CLR13, SUI1–SUI19, RPT1–RPT12; LSD1–LSD441 | CLR, SUI and RPT accepted as binding defaults 2026-10-28 (Weibao's "Sure" to the batched list, CL281); LSD proposed 2026-10-28 | Lead-life lanes: briefs, publication class, fold-loss, coordinator review (CLR); scene UI (SUI); what the cast writes into Reports (RPT); top-down design of actions, relationships, fights, knowledge, law, work and determinism for a protagonist's life (LSD) | [Lead-life rules F](LEAD_LIFE_RULES.md#f-lane-rules-clr1-clr13) (CLR), [UI rules, scene and report](UI_RULES.md#scene-and-report-rules-sui-rpt) (SUI, RPT), [lead-life systems design](gm/dispatch/protagonist-life-2026-10-27/LEAD_LIFE_SYSTEMS_DESIGN.md) (LSD), [lead-life guide](LEAD_LIFE_GUIDE.md) (reading aid: matrix, order, contradictions; proposal) |
| Lead-life rules | none | Accepted lines only, created 2026-10-29; defaults, open to change with a better idea | The accepted direction for a protagonist's life: lead-first, forced canon run as a default, windows over hours, mechanisms first, per-world canon resistance, optional main goal; how a rule changes | [LEAD_LIFE_RULES](LEAD_LIFE_RULES.md) |
| World completion standard | none | Proposal 2026-10-11; connected-delivery guidance reconciled 2026-10-25 | Sections, finite world horizons, detail ledger and acceptance for a world | [WORLD_COMPLETION_STANDARD](WORLD_COMPLETION_STANDARD.md) |

## Core digest (read this first, 2026-10-18)

The rules that bind almost every task, one line each. Cite the code for detail;
this adds no authority. Proposal rulebooks bind only through the AD or standing
line they restate.

| Idea | Code |
|---|---|
| Weibao's words are authority; agent text is proposal | AD32 |
| Anything is possible, reasonably; things work by how they work | AD5, AD38 |
| Limits are defaults with a dial, reason and cost, not never/always | AD5, AD22 |
| Each world sets its own rules; special rules start hidden | AD1, AD3 |
| Means decide what anyone knows or does; truth, knowledge and display stay separate | AD6, AD7, AD8 |
| Recovery is forgiving; firm lines are save integrity only | AD19, AD22 |
| One authority per fact; `main.js` is a composition root | AR1–AR16 |
| UI: desktop first, shared tokens and controller, evidence at 1920×1080 (1366×768 retired 2026-10-19) | AD34, UR1–UR75; UR76–UR82 proposed, in use |
| Time is game time; away time runs chosen routines | AD15, AD16, AD17 |
| Build one playable slice; complexity welcome, sequenced | AD33 |
| A slice is done only at the six-line floor | AD43 |
| Verify only what changed, rebuild and exercise it in a browser before "done" | AD36 |
| Sealed secrets stay out of chat and reports | Sealed secrets |
| Agent runs share one finite budget | AD37, AU1–AU15 |

## Router: what applies to my task

| If the task touches | Apply | Then read |
|---|---|---|
| Any runtime code | AR1–AR16; AR14 for lane briefs, AR16 before calling it done; AD45 (open to refactor with a reason; name known limits) | [ARCHITECTURE_RULES](ARCHITECTURE_RULES.md); AR3/AR7/AR8 applications cover reaction, interruption and disclosure boundaries |
| Adding or absorbing any mechanic, or "send out and work on" a mechanic | MAW stages 0–7, AD36, AD38, AR11–AR16 | [Systems register](SYSTEMS_REGISTER.md) first (which system and degree fits), then the [mechanic absorption workflow](gm/MECHANIC_ABSORPTION_WORKFLOW.md); [all saved references implementation](gm/dispatch/reference-mechanics-2026-10-25/CHECKPOINT.md) |
| Desktop host, Electron shell, packaging, Steam | AD39, AR3, AR4, AR6 | [Electron host round](ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md#electron-host-2026-10-20-el); `desktop/` owns the host, `src/` stays host-free |
| A world's completion level or what it is missing | Completion standard S00-S14 and C0-C5 (proposal; C5 review optional under AD42), AD36, sealed-secrets rule | [World subtle gaps](audits/WORLD_SUBTLE_GAPS_2026-10-20.md) (WG1-WG26, proposal); [completion standard](WORLD_COMPLETION_STANDARD.md) |
| Any player-facing UI | UR1–UR75 (UR59–UR64 for reference-guided design), UR76–UR82 and UIV1–UIV7 (proposed, in use as the default, CHOICES 4, 2026-10-30; checklist at the top of UI_RULES), AD34, AD40; SUI1–SUI19 for scenes, choices and travel and RPT1–RPT12 for Reports lines in any world (binding defaults 2026-10-28, [UI rules, scene and report](UI_RULES.md#scene-and-report-rules-sui-rpt)); mockup workflow if layout is unsettled (native character study by default; archived recipe/launch studies retained) | [UI_RULES](UI_RULES.md), [UI design audit](audits/UI_DESIGN_CORE_AUDIT.md), [surface types](UI_SURFACE_TYPES_AND_DRAWING_BOARD_2026-10-15.md), [UI detail and message palette](THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#small-contextual-bars-and-everyday-interface-details-2026-10-20) |
| Descriptions for stats, traits, skills, items, conditions or actions | UR70–UR75; UR40/42/43/47; AD6–AD8 | [Description rules](UI_RULES.md#descriptions-explain-the-experience-and-effect-2026-10-25), [source comparison and examples](reviews/ui-descriptions-2026-10-25/REPORT.md) |
| Making or crafting of any kind | MR1–MR36, AD9, AD38 | [CRAFTING_ENGINE](CRAFTING_ENGINE.md); MR1/MR5/MR29 also govern interrupted stages |
| Minecraft-derived techniques, workshop production, garden energy, helper supply, site freight, exposed drying and worker residences | AD6–8/15–17/33/36/38, AR1–16, MR1–36, SR1/15/19/22, UR1–64 | [All-seven direction](USER_VISION.md#minecraft-mechanisms-in-existing-systems-2026-10-21), [MF adaptation owner](MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md#minecraft-fit-round-mf-2026-10-21); AD33's broad NPC deferral permits this explicitly selected bounded helper/supply application |
| Sites, ruins, caves, maps, exploration, restoration | SR1–SR24, AD3, AD33 | [Site palette](gm/dispatch/procgen-2026-10-13/p11/LIBRARIES_TEMPLES_MINES_CAVES_AND_MAPS_2026-10-16.md), [ruins](gm/dispatch/procgen-2026-10-13/p11/DUNGEON_CONTENT.md) |
| Gear stats, armor, affixes, sockets, gems | AD5, AD38, AD6–AD8, UR40, CBR; GR1–GR17 for rolls; MKR-IM2 (proposed) for sockets | [Equipment stat dimensions](EQUIPMENT_STAT_DIMENSIONS_CONSIDERATIONS_2026-10-20.md) (ESD1–ESD16, proposal) |
| Gear parts, materials to stats, repair, smithing, chemistry, fuel and energy, powers on the stat pipeline | MR1–MR36 (MR5, MR8, MR16, MR32), AD5, AD38, AR3, ESD1–ESD16 | [Gear depth considerations](GEAR_DEPTH_BLACKSMITHING_CHEMISTRY_ENERGY_POWERS_CONSIDERATIONS_2026-10-20.md) (GDP1–GDP39, proposal) |
| Generators, RNG, seeds | MR2–MR3, MR28, SR20, Rulebook 9; GR1–GR17 as the accepted contract under AD5/AD38 | [Procedural status](PROCEDURAL_GENERATION_STATUS_2026-10-13.md); GR7/GR17 clarify mechanism selection and owning-clock identity; GR15 preserves event-time public knowledge |
| Any world audit, expansion or exploration pass, source dive, facilities or roles pass, or review of a lane return | WPR1–WPR32; AU1–AU15 (AU5 model routing), WA3, WA8, WA11, WER14, sealed secrets | [WORLD_PASS_RULES](WORLD_PASS_RULES.md), [topic expansion playbook](audits/TOPIC_EXPANSION_AUDIT_PLAYBOOK.md), [world core kit playbook](worlds/WORLD_CORE_KIT_AUDIT_PLAYBOOK.md) |
| Progression gates: realm bottlenecks, ranks, exams, admission, unlocks, caps, start or UI reveal gates | GTR1–GTR35 (proposed; GTR11 distinguishes admission and continuing support); AD5, AD6, AD38, WPR14, WPR31, sealed secrets | [PROGRESSION_GATE_RULES](PROGRESSION_GATE_RULES.md) (proposal), `src/progression_gates.js`; [cheat unlock palette](CHEAT_LIBRARY.md#unlocking-the-optional-start-and-keeping-progression-intact-2026-10-13) |
| A new world or book adaptation | AD44 (lead-first playthrough is the main line), CLR1–CLR13, SUI1–SUI19 and RPT1–RPT12 (cast-lives defaults), LSD1–LSD441 (top-down lead-life systems, proposed; read via the [lead-life guide](LEAD_LIFE_GUIDE.md); accepted lines in [LEAD_LIFE_RULES](LEAD_LIFE_RULES.md)), Rulebook 2–3, AD1–AD5, MR11–MR15, SR1–SR3; WA1–WA24 for turning the source into a pack (WA22–WA24: every mention placed, dated whereabouts, forward anchors); WA25–WA41 (accepted, adjustable), WA48–WA50 (accepted: whole-source seams, gap register, dated character records) and proposed WA42–WA47 for lead runs (classed actions, loops, untaken options, shard gates, conflicts, stats, allies, codifying, environment, events, fills, talks, two-layer state, extraction scope, relationships, tiers, hand-off); WER1–WER17 for how players enter it | [Rulebook precedent](RULES_FROM_SCRATCH.md#cross-world-audit-precedent-special-rules-and-little-details-2026-10-12), [completion standard](WORLD_COMPLETION_STANDARD.md), source research; WA8/WA12 distinguish source, knowledge and built coverage; floors allow selected slices; run order from source to past canon: [deep world workflow](DEEP_WORLD_WORKFLOW_2026-10-19.md) (proposal) |
| Different lives within a book world: student, smuggler, craftsperson and overlapping careers | AD1–AD8, AD15–AD19, AD23, AD32–AD38; WA1–WA21; SLR/ECR/PIR, MR/SR where relevant | [BF28–BF70 life and implementation proposals](worlds/BOOK_WORLD_FEATURE_GAPS_2026-10-15.md#round-3-different-lives-in-each-book-world-2026-10-21); [W3 people/daily-life palette](worlds/world-core-kit-2026-10-14/W3_PEOPLE_INSTITUTIONS_LIFE.md); named world source owner remains authoritative |
| Hidden truths, secrets, identification | Sealed secrets, AD3, AD6–AD8, MR1, MR31, SR5, SR9 | [WORLD_SECRETS_AND_DISCOVERY](worlds/WORLD_SECRETS_AND_DISCOVERY.md), [MEANS_AND_APPRAISAL](MEANS_AND_APPRAISAL.md) |
| Shown numbers, appraisal, opponent stats | AD6–AD8, UR40; LS1 and AA14 (proposed applications for public failures and historical readings) | [MEANS_AND_APPRAISAL](MEANS_AND_APPRAISAL.md) |
| Lives, death, rebirth, return, carryover | Rulebook 4–5, AD10–AD14, AD19–AD20 | [Continuation owner](worlds/CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md), [identity owner](worlds/PLAYER_CHARACTER_IDENTITY_AND_CONTROL_2026-10-13.md) |
| Time, idle, offline, recap | Rulebook 7, AD15–AD18, MR28, SR21 | [DIRECTION_SUMMARY](DIRECTION_SUMMARY.md), [DIRECTION_SYNTHESIS](DIRECTION_SYNTHESIS.md) |
| Bodies, health, injury, illness, medicine, healing | AD13, AD19, AD8, AD38, MR1–MR36; BHR1–BHR30 (accepted 2026-10-18) | [Part 35 palette](worlds/world-depth-2026-10-13/35_HEALTH_INJURY_ILLNESS_DEATH.md), [body and health palette](BODY_AND_HEALTH_CONSIDERATIONS_2026-10-17.md); BHR18/BHR28 application names actual body clock and chosen reroute policy |
| Combat, enemies, weapons in use, defeat outcomes, fleeing, captives, conflict | AD8, AD19–AD21, AD25, AD28, AD38, BHR11, BHR13, BHR15; CBR1–CBR30 (accepted 2026-10-18) | [Combat palette](COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md), [W2 combat grammar](worlds/world-core-kit-2026-10-14/W2_LAWS_POWER_COMBAT.md), [encounters and pursuit](ENCOUNTERS_AND_PURSUIT.md); CBR2/CBR27 application separates outcome boundaries from shown stop reasons |
| Skills, techniques, faculties, titles and their benefits, practice, teaching, skill loss or carryover | MR21–MR23, AD3, AD6, AD8, AD11, AD17, AD38; SLR1–SLR43 (accepted 2026-10-18) | [Skills and learning palette](SKILLS_AND_LEARNING_CONSIDERATIONS_2026-10-18.md), [SKILLS_AND_TALENTS](SKILLS_AND_TALENTS.md), [skill mechanisms](worlds/SKILL_MECHANISMS_AND_MEANS_2026-10-13.md); SLR20 application follows the actual faculty carrier and clock |
| A world's abilities, powers, spells or techniques: absorbing, adding rows, costs, use, observers, crossing worlds | ABR1–ABR22 (proposed; ABR11 admission/support and ABR22 scaled proof), AD3, AD6, AD28, AD30, AD36, AD38, AD42; SLR, GTR, HTP as cited there | [ABILITY_RULES](ABILITY_RULES.md), [ability authoring](worlds/ABILITY_AUTHORING.md) |
| Who is here, talking, trading or using a station, selecting subjects, new and heard dialogue | UR35, UR42, UR52, AD6, AD11–AD12, AD16, AD33; PIR1–PIR25 (accepted 2026-10-18) | [Around you considerations](AROUND_YOU_SUBJECT_ACTIONS_CONSIDERATIONS_2026-10-18.md), [S1–S4 packet](gm/dispatch/around-you-2026-10-18/S1_S4_PACKET.md) |
| Danger, defeat, difficulty, settings | AD19–AD22, SR14 | [DIRECTION_SYNTHESIS](DIRECTION_SYNTHESIS.md#od12-forgiving-recovery-direction-2026-10-15) |
| Cheats | Rulebook 5, 11; AD26, AD28–AD30, AD11 | [CHEAT_COSMOLOGY](CHEAT_COSMOLOGY.md), [CHEAT_LIBRARY](CHEAT_LIBRARY.md) |
| Starts and entry, crossings between worlds, transmigration, era or host of a start | WER1–WER17, AD10–AD13, AD23, Rulebook 4–5, 8 | [Intro and starts index](INTRO_AND_STARTS_INDEX_2026-10-14.md) |
| Goals, story, rivals, threats | AD2, AD24–AD25, AD6 | [CHARACTERS_AND_WORLD_EVENTS](CHARACTERS_AND_WORLD_EVENTS.md), [RIVALS_IDENTITIES_AND_FATE](RIVALS_IDENTITIES_AND_FATE.md), [TIMELINES_AND_DIVERGENCE](TIMELINES_AND_DIVERGENCE.md) |
| Activity depth and scope (fishing, farming, ranching, gathering, jobs) | CX1–CX8, AD33, MR18, MR29; SSD10–SSD14 as proposed vocabulary | [Subsystem scope ladders](SUBSYSTEM_SCOPE_LADDERS_2026-10-16.md), [complexity review](gm/dispatch/ui-foundation-2026-10-15/next-parts/IMPLEMENTATION_COMPLEXITY_REVIEW_2026-10-16.md) |
| Homes, construction/weather, portable shelter, staffed residence starts, household duties/teaching/provisions and inheritance | AD23, AD11–18, AD38; AR3/AR6–8; UR1–17; ECR15–16; SLR20/23/40–43; SR15/SR19/SR22 | [Accepted implementation direction](USER_VISION.md#home-system-and-different-residence-starts-2026-10-21); [home owner](gm/dispatch/procgen-2026-10-13/p20/HOME.md); [implementation](gm/dispatch/home-system-2026-10-21/CHECKPOINT.md) |
| Economy, trade, property | AD27, AD31, AD38, MR5, SR15, SR19; ECR1–ECR33 (accepted 2026-10-18) | [Requests and markets](gm/dispatch/procgen-2026-10-13/p11/REQUESTS_AND_MARKETS.md), [selling and merchant sinks round](gm/dispatch/procgen-2026-10-13/p11/REQUESTS_AND_MARKETS.md#selling-merchant-sinks-and-money-fun-consideration-round-1-2026-10-18), [economy palette](ECONOMY_AND_TRADE_CONSIDERATIONS_2026-10-18.md); ECR7/ECR9/ECR15/ECR16 qualifications preserve extraordinary means and actual accounting |
| NPCs, companions, social systems | AD6, AD33 (NPC-heavy work deprioritized), MR23; for book casts [LEAD_LIFE_RULES](LEAD_LIFE_RULES.md) (accepted: others' lives are not all full), LSD126–LSD137 (depth by tier) and LSD138–LSD147 (engine, proposed) | [Companions audit](audits/COMPANIONS_CORE_AUDIT.md) |
| Saves and persistence | Rulebook 9, AR6, MR3, MR30, MR33, SR22, AGENTS safety, LSD142–LSD143 (book pack revisions and save deltas, proposed), qualified by the 2026-10-17 decision | [Old-save compatibility is currently deferred](USER_VISION.md#old-save-compatibility-deferred-2026-10-17); new state still needs Save/reload/Export/Import. Unknown retired IDs follow the [2026-10-18 decision](USER_VISION.md#content-id-retirement-and-frozen-world-idle-2026-10-18) |
| Research passes and sources | AD35, AD37, AU1–AU15 for readers; AGENTS scope and source acquisition | [Tool registry and launchers](TOOL_REGISTRY.md), [saved-source modes and playbook](research/SOURCE_DEEP_DIVE_PLAYBOOK.md#saved-sources-first), [source tools](research/SOURCE_ACQUISITION_TOOLS.md) |
| Checkout selection and worktree retirement | AD41, AD32; shared-worktree ownership | [Primary checkout default](gm/SHARED_WORKTREE_PRACTICE.md#primary-checkout-default-2026-10-21) |
| Current feature delivery, publication and cross-chat reconciliation | AD32, AD36, AD41; existing task ownership | [PROJECT current delivery](gm/PROJECT_LOG_2026-10-29.md#current-delivery-routing-reconciled-2026-10-23); [C7/C9/C10 incorporation and coordinated proof](research/additional-cultivation-2026-10-22/IMPLEMENTATION.md); [2026-10-22 reconciliation and evidence limits](reviews/SHARED_DOCS_RECONCILIATION_2026-10-22.md). Dated task reports retain their original input boundaries. |
| Shared engine gaps for different lives and niche specialties | AD1–AD8, AD15–AD19, AD22–AD23, AD32–AD38; AR1–AR16, WA1–WA21, relevant SLR/ECR/PIR/MR/SR | [BF71–BF94 round](worlds/BOOK_WORLD_FEATURE_GAPS_2026-10-15.md#round-4-shared-engine-gaps-and-specialties-across-lives-2026-10-21): 14 gap rows and specialty composition proposals; existing native owners and one playable slice at a time, no new runtime dispatch. |
| Selected W1–W4 signature-loop implementation | AD1–8/15–19/23/32–38/41; WA1–21; AR1–16; relevant MR/SR/UR | [Later user instruction](USER_VISION.md#w1w4-signature-loop-implementation-2026-10-22); [execution and shared-writer status](gm/dispatch/distinct-world-w1-w4-2026-10-22/CHECKPOINT.md). Research proposals are now selected for these four finite journeys; delivery still requires native proof. |
| Dispatching or coordinating agents | AU1–AU15, AD32, AD37; AGENTS multi-agent | [Agent usage rules](AGENT_USAGE_RULES.md), [GM prompt](GAME_MASTER_PROMPT.md) |
| Selecting checks, adding regressions, reporting or handing off evidence | AD36; touched domain rules | [Efficient rule verification](#efficient-rule-verification-ad36) |
| Bot or AI playthroughs, playtest detectors, balance sweeps, agent-facing game tools | AD32, AD36, AR7, AR8, AU1–AU15, sealed secrets; PT1–PT112 as proposed vocabulary | [AI playtest harness considerations](AI_PLAYTEST_HARNESS_CONSIDERATIONS_2026-10-20.md) (proposal), `scripts/playtest/`; EL16/EL40 in the [Electron host round](ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md#electron-host-2026-10-20-el) |
| Reconciling plans, audits or composed system boundaries | AD32–AD36, AD38; affected AR/MR/SR and accepted time/knowledge rules | [Core-rule audit method](audits/TOPIC_EXPANSION_AUDIT_PLAYBOOK.md#core-rule-reconciliation-pass-2026-10-18), [current coverage and owner corrections](reviews/PLAN_RULE_RECONCILIATION_2026-10-18.md); [domain rules conformance scan](audits/DOMAIN_RULES_CONFORMANCE_2026-10-19.md) (2026-10-19, findings DRC1–DRC16, proposals only) |

## Accepted direction rules (AD)

Each line restates an accepted decision. "Means" follows AD6: what a skill,
power, item, contact, access or prior knowledge actually supports. Sources are
the bold entry names in [accepted decisions in the project log](gm/PROJECT_LOG_2026-10-29.md#accepted-decisions)
unless another owner is linked.

### Worlds and canon

| Code | Rule | Source |
|---|---|---|
| AD1 | **Each world sets its own rules; book worlds start from their book.** Premises can change (canon, divergent, remix, swapped). Direct recreations stay in the private pack. | Rulebook 2–3; Book worlds; Worlds |
| AD2 | **Canon follows its natural course unless sufficiently disturbed.** Divergence is causal. Authored plot versus simulation varies by world and mode. | Natural course; OD7 |
| AD3 | **A world's special rules start hidden** and are found in play through fitting skills or other routes. | Hidden world specialness; sealed secrets |
| AD4 | **Worlds keep their own histories.** Crossing does not reset them; revisiting, fresh or parallel versions come through means. | OD5 |
| AD5 | **Anything is possible, reasonably.** Several reasonable answers become player choices with modest defaults. Outliers are recorded as outliers, not new general rules. Stated limits, canon ones included, describe the ordinary case; exceptions exist with an in-world reason, cost and record (2026-10-17, [tools round 5](TOOLS_AND_INSTRUMENTS_CONSIDERATIONS_2026-10-17.md#round-5-nothing-has-to-be-limited-exceptions-and-better-makers-2026-10-17)). | Anything is possible; Rulebook 1, 12 |

### Knowledge and means

| Code | Rule | Source |
|---|---|---|
| AD6 | **Means decide, on both sides.** Neither player nor NPC knows or does more than the means it holds; plain impressions are the default. NPC plans use the same gate. Hidden intent stays hidden without a fitting route. | Knowledge and means, both ways; Hidden intent; Rulebook 6 |
| AD7 | **One authoritative record per subject.** Truth, observer knowledge and representation stay distinct. | OD8 |
| AD8 | **Opponent numbers are learned; own stats are exact.** First sight shows impressions and `???`. | Learned opponent numbers (2026-10-16) |
| AD9 | **Forecasts reflect knowledge.** Experiment costs, risks and predictions follow what is known; failed experiments can teach; cheats can help discover. | Predictions and question triage; OD25 |

### Self, lives and carryover

| Code | Rule | Source |
|---|---|---|
| AD10 | **One life follows one person; the journey continues across lives.** One continuing self is the default; possession, shared minds and multiple bodies need means. | OD1; OD6 |
| AD11 | **Memories and the base cheat carry; the rest depends on world and means.** What carries can improve. Every crossing needs a carrier. | OD2; Rulebook 5; Starting continuation |
| AD12 | **A fresh life has its own history; the former life pauses.** Return is reciprocal by default but depends on means, including from an unconscious body. Intentional loops are a player option. | Voluntary fresh-life history; Reciprocal return; Unconscious-body return |
| AD13 | **Bodies are real.** Species, bloodline, constitution, sex, age and size carry stats, needs and lifespans. | Rulebook 4 |
| AD14 | **Bindings and duties carry by their own rules,** with known-consequence warnings. Research and cheats can detect or change them where supported. | Binding remedies; Goals and binding continuity |

### Time and being away

| Code | Rule | Source |
|---|---|---|
| AD15 | **Ordinary play advances time; settled routines can compress.** Worlds and lifespans pace differently. | OD23; Rulebook 7 |
| AD16 | **Away time runs chosen routines in the current world** and stops at important choices or exhausted supplies. Inactive worlds pause. Offline aging depends on world and settings. | OD4; Offline calendar clarification; Current-world choice pause |
| AD17 | **The return recap shows only what knowledge, means or cheats allow,** with adjustable detail and paused pending choices. | OD15 |
| AD18 | **Banked unused time follows the continuing journey;** capacity and efficiency can improve. | Continuing time bank |

### Danger, recovery and settings

| Code | Rule | Source |
|---|---|---|
| AD19 | **Recovery is forgiving by default.** Ordinary save/reload works; native defeat is unconsciousness and recovery. World danger and recovery strictness are separate; harsher play is optional or forewarned. | OD12; Defeat |
| AD20 | **A locally unwinnable situation may require going elsewhere or restarting,** including within the same life. | OD11 |
| AD21 | **Comfort settings change freely; difficulty changes are explained and affect future play.** In-world rules change only through cheats or means. | OD16 |
| AD22 | **Firm lines are save integrity and real-world guardrails.** Bugs and reload exploits get fixed; other limits are per-world adjectives, not fixed "once" rules. | Rulebook 9; MR15 |

### Entry, goals and story

| Code | Rule | Source |
|---|---|---|
| AD23 | **Entry is guided randomness by default;** full random and specific starts depend on means. Warn about known risks when relevant means are absent. Vanilla stays intact and optional. Home beginnings settle actual residence rights, stock and body through a separate in-game page; fitting wild shelter can be built from natural materials without unnecessary purchases. Selected staffed family starts distinguish personal access/allowance from estate ownership and staff custody. Book-world planning covers materially different lives within a setting, including student and smuggler lives. | OD10; Suspenseful random entry; Vanilla stays intact; [launch restoration and deferred menu, 2026-10-20](USER_VISION.md#restore-the-original-loading-screen-and-defer-the-start-menu-2026-10-20); [home implementation, 2026-10-21](USER_VISION.md#home-system-and-different-residence-starts-2026-10-21); [different book-world lives](USER_VISION.md#different-lives-and-implementable-book-world-features-2026-10-21) |
| AD24 | **Players choose their pursuits.** Guidance and optional campaigns, no compulsory global main quest. | OD24 |
| AD25 | **Threats develop from their actual causes,** not automatic matching to the player. | Cause-driven threats |
| AD26 | **Narration is direct by default; base-cheat powers are discovered in play.** A cheat's look follows what the cheat is, not its world. | OD13; [cheat looks](USER_VISION.md#cheat-looks-follow-the-cheats-own-type-2026-10-16) |

### Economy, power and cheats

| Code | Rule | Source |
|---|---|---|
| AD27 | **Economies are local; trade and arbitrage are intended.** Shared currencies come through means or cheats. | OD11 |
| AD28 | **Everything can become OP; power is relative.** Beaten obstacles stay beaten. | Rulebook 11 |
| AD29 | **The base cheat is a quiet personal faculty by default.** Systems or voices come through means or accompanying cheats. | Cheat-chat continuation (CA13) |
| AD30 | **Titles may grant real powers** through a world's rules or a cheat. Distinguish what the title recognizes from what it supplies; SLR40–SLR43 clarify capability and effect ownership. | Titles, achievements and rule-tags (standing priorities) |
| AD31 | **Owned things such as furniture may give passive bonuses.** | Bonuses from furniture and more |

### Process

| Code | Rule | Source |
|---|---|---|
| AD32 | **Accepted means Weibao said so.** Agent text is proposal until he accepts it. Resolve straightforward details from existing direction instead of asking again. Project identity: **OOPS · Optimistic Progression Simulator**, with an intentional extra O. | Rulebook 10; Predictions and question triage; [OOPS identity](USER_VISION.md#oops-project-identity-2026-10-16) |
| AD33 | **Complexity is welcome; slices sequence it.** NPC-heavy work is deprioritized and procedural layouts stay deferred, except the leftover itch.io items Weibao named on 2026-10-23 and fitting cultivation-reference adaptations selected on 2026-10-24, built as bounded per-world mechanisms (earlier wording kept as dated history). | [Complexity](USER_VISION.md#complexity-and-implementation-difficulty-2026-10-16); [procedural focus](USER_VISION.md#procedural-focus-ruins-and-world-first-2026-10-16); [leftover itch items](USER_VISION.md#leftover-itchio-items-built-as-small-per-world-dials-2026-10-23); [cultivation selection](USER_VISION.md#fitting-cultivation-reference-mechanics-selected-2026-10-24) |
| AD34 | **Desktop and laptop first; mobile deferred.** | [Standing UI priority](USER_VISION.md#standing-ui-priority-2026-10-13) |
| AD35 | **Research passes save deep details privately** in gitignored `docs/research/<source>/private/`. | [Standing rule](USER_VISION.md#save-deep-details-for-reference-2026-10-14) |
| AD36 | **Check relevant behavior, add meaningful regressions and reuse valid evidence.** Bound verification and context cost without dropping required gates. | [Request](USER_VISION.md#efficient-rule-checks-and-regressions-2026-10-16); [workflow](#efficient-rule-verification-ad36) |
| AD37 | **Agent generation has a shared finite usage budget.** Full books use fresh short-lived readers and bounded continuity across one to three coordinating chats; count repairs/successors and preserve unread coverage at a limit. | [Request](USER_VISION.md#agent-generation-and-book-usage-2026-10-16); [AU1–AU15](AGENT_USAGE_RULES.md) |

### Mechanisms

| Code | Rule | Source |
|---|---|---|
| AD38 | **Things work by how they work.** If a method, item or plan reasonably works by the mechanisms in play, it works, whatever its label, category or origin; nothing needs a permission list to happen. Costs, means and the world's actual mechanisms decide "reasonably". | [Things work by how they work](USER_VISION.md#things-work-by-how-they-work-2026-10-17) |
| AD39 | **Electron plus web.** The game moves to Electron plus web, like other shipped web games: one web codebase in the browser and in an Electron desktop host. Implementation defaults are proposals in the EL round. | [Request](USER_VISION.md#electron-plus-web-2026-10-20); [EL round](ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md#electron-host-2026-10-20-el) |

### Interface design attention

| Code | Rule | Source |
|---|---|---|
| AD40 | **Carry useful reference UI families and small details into future design**, especially progress/resource bars, message-condensing options, coloring and playful interaction details. Adapt them to OOPS's accepted shell and actual mechanisms. Later same-day direction selects typography/component-style/glow, then full retained palette implementation with Luna subagents, audit and root repairs. The next instruction authorizes a finite solo completion pass, self-audit and repairs. The 2026-10-21 instruction folds the Discord design guide into standing UR59–UR64; later direction selects internal Gothic by default, visible delivery and reuse of completed work before lesser-agent gap implementation. The later matched desktop comparison authorizes fitting UI repairs and creator/support/cat details, preserving deliberate OOPS differences under UR49. The following instruction requires coordinated local main Electron delivery of released combined work, visible adoption/restart proof, and an explicit inventory-overhaul coverage boundary. The next instruction selects the inventory overhaul and fitting gaps for implementation, latest combined Electron delivery, scoped merge and push. The 2026-10-25 description request selects effect-first narrative with supporting calculations under UR70–UR75; the subsequent request selects current tooltip/trait implementation and a bounded other-game comparison ([direction](USER_VISION.md#description-rules-selected-for-implementation-2026-10-26)). Concrete treatments retain required agent-side visual/play evidence; human taste/feel review is optional feedback under AD42. Unresolved reference claims do not become native facts. | [Inventory implementation/publication](USER_VISION.md#inventory-overhaul-and-combined-publication-2026-10-21); [Matched comparison direction](USER_VISION.md#matched-proto23-desktop-comparison-and-fitting-ui-fixes-2026-10-21); [Reference-guide fold](USER_VISION.md#discord-design-guide-and-missing-media-recovery-2026-10-21); [Initial request](USER_VISION.md#small-contextual-ui-details-for-future-work-2026-10-20); [full implementation request](USER_VISION.md#full-retained-ui-and-engine-palette-implementation-2026-10-20); [reusable palette](THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#small-contextual-bars-and-everyday-interface-details-2026-10-20) |

### Checkout workflow

| Code | Rule | Source |
|---|---|---|
| AD41 | **Use the primary checkout by default against the consolidated master baseline.** Temporary isolation needs a concrete reason and owner; reuse suitable checkouts and retire finished lanes after integration, active-use checks and artifact preservation. Later consolidation publishes to the personal fork only, leaving upstream untouched. | [Request](USER_VISION.md#primary-checkout-default-and-finished-worktree-cleanup-2026-10-21); [procedure](gm/SHARED_WORKTREE_PRACTICE.md#primary-checkout-default-2026-10-21) |
| AD42 | **Human gates are optional.** Director/human acceptance is feedback, not a gate: continue to the next dependency-ready slice on the required agent-side evidence (rebuilt desktop browser run, persistence checks, AD36 gates) and label it "agent-verified, not human-reviewed". Weibao's feedback, when given, still overrides. | [Request](USER_VISION.md#human-gates-can-be-skipped-2026-10-25) |

### Delivery floor

| Code | Rule | Source |
|---|---|---|
| AD43 | **Every slice meets the six-line floor before it is called done.** Build identity, natural route, shown description and cost, a consumer, persistence proof when persistence changes, and a named review state ([floor](#definition-of-done-the-floor-ad43)). A slice missing a line is "implemented, below floor". The rulebooks the lines draw on keep their own status. | [Request](USER_VISION.md#quality-floor-accepted-2026-10-26); [audit round](audits/IMPLEMENTATION_PRACTICE_CORE_AUDIT.md#round-2-2026-10-26-a-quality-floor-for-implementation-absorption-and-execution) |
| AD44 | **A book world is implemented by playing its protagonist's life.** From the readings, the protagonist's own playthrough ("be the lead", from the book's opening, in the local book pack) is the main line: every capability, panel and system that life and its world need is built through it, everyone it touches lives their own schedule and arc, and the replay of the lead's steps through the game's own screens is the progress measure. Other seats (beside, follow, bystander) and the parts of the world the lead never reaches follow from the same systems, chosen per seat later. | [Request](USER_VISION.md#cast-lives-be-the-lead-is-the-main-line-2026-10-28); [standing for future worlds](USER_VISION.md#lead-first-for-every-world-implemented-from-readings-2026-10-28); [method and card](gm/dispatch/protagonist-life-2026-10-27/CAST_LIVES_CARD.md) |
| AD45 | **What is built is the current best, modular and open to refactor, replacement and improvement.** Code, schemas, packs, pipelines, UI, rulebooks and design docs describe today's shape, not a final one; a later lane may refactor, replace or extend any of them when it has a reason (a second consumer, a measurement, a defect, new reading data, a clearer design or Weibao's direction). "It is built this way" is never by itself a reason to keep a shape: past code earns no weight over a better implementation, and replacing it outright is a normal outcome when the new shape is better and the same journey proves it (Weibao 2026-10-28, "dont prize past code if there are better implementations"). Build for that: small modules behind ports with one owner each, data shapes versioned, world-specific parts as inputs to world-neutral code, so a part can be swapped without touching its neighbours. Refactors follow AR9 (no gameplay change in a structural round, same scenario before and after) and keep saves loadable or name the compatibility decision (AR6); rule changes keep codes and dated history. Designs and lane checkpoints name their known limits and the refactor they expect, so the next lane can find them. | Weibao 2026-10-28 ("make sure rules know that things are up for refactor/improvement in the future", [record](USER_VISION.md#rules-what-is-built-is-open-to-refactor-and-improvement-2026-10-28)); [lead-life design 17](gm/dispatch/protagonist-life-2026-10-27/LEAD_LIFE_SYSTEMS_DESIGN.md) (LSD141, LSD151, LSD155) |
| AD46 | **Each world chooses its own version of each system and its UI, with nuance; no world is the template.** Progression, economy and institutions, combat, making, magic, social standing, law, time, travel and knowledge are each chosen per world: what the system is, which form shows it (ladder, report card, status window, ledger, dossier, notebook, none) and what its numbers mean, if it has any. A default, a dial and an in-world reason apply (AD5, AD38). World-neutral seams carry the plumbing and world inputs carry the character (AD45). Progression means any lasting improvement (skills, knowledge, stats, equipment, relationships, standing, wealth), not only ranks or paths, and a world without ranks still progresses. A view that names one world's ids in shared UI code is a defect. | [Request](USER_VISION.md#each-world-chooses-its-own-systems-and-their-ui-standing-rule-2026-10-30); [progression palette](gm/dispatch/book-ui-wave-2026-10-30/PLAN.md#round-7-parallel-browser-proofs-per-world-progression-2026-10-30-151x-weekly-69) |

## Efficient rule verification (AD36)

Standing workflow from Weibao's 2026-10-16 request, implemented in the existing
task record and checks. No separate checklist file or universal compliance score.

1. **Choose before editing.** Name touched rule codes, affected producers/consumers
   and the failure to prevent. Find existing tests first. Use the table below;
   groups cover specific scenarios, not the whole rule or domain. Read the relevant
   source and test before relying on a filename or a prior pass.
2. **Extend where behavior changes.** For a meaningful invariant or reproduced
   defect, add a regression in the existing suite with initial state, real action
   and observable expected/forbidden result. Demonstrate the reproduced failure
   before fixing when practical. Prefer the real boundary to a mock that bypasses
   it. No test per rule sentence, trivial edit or duplicate implementation detail.
   Include a new test in the focused runner only if its scenario fits that group;
   otherwise run it directly. Tests must be discovered by the intended suite.
3. **Run at the right time.** Use focused checks after a coherent edit. A lane or
   subagent runs only its focused test file and never the full suite (2026-10-22
   lean-test direction). The full `npm test` runs once, by whoever commits, as the
   single pre-commit gate. At completion,
   run gates required by the applicable rulebooks, build and changed browser journey
   for runtime claims, and persistence checks when affected. Docs-only work needs
   relevant document/link checks, not a gameplay build. Shared code, ordering,
   persistence or cross-domain changes can justify broader coverage; state why.
4. **Reuse with an input identity.** Record in the existing checkpoint one line per
   check: command, result and gaps. Add a revision or diff hash only when another
   agent will reuse the result as evidence (2026-10-22: no per-task input-identity
   paperwork otherwise). Another agent can reuse it after verifying those inputs,
   dependencies, fixtures, configuration and relevant environment still match. HEAD
   alone is insufficient in this shared dirty checkout. Invalidate affected evidence after
   changes or integration; run the affected checks again. A full suite covers its
   included groups, so do not run both on unchanged inputs. Do not duplicate an
   authoritative running CI job unless reproducing a named failure. Local unit
   evidence cannot substitute for required fresh rebuilt browser evidence.
5. **Bound time and tokens.** Search first, read relevant sections, batch independent
   reads and keep successful logs to a short result plus an evidence path when
   needed. Inspect the failing assertion and cause before rerunning; avoid unchanged
   retry loops. Reuse existing records and fixtures; do not spawn reviewers or run
   whole-project audits for routine changes. Authorized lane briefs include the
   relevant codes, chosen commands, regression scenario and reusable evidence links,
   rather than copies of all rulebooks. Stop equivalent checks once required gates
   pass. Save integrity, sealed truths and technical versus human acceptance still
   apply; retain useful diagnostics privately where needed.
6. **Keep the suite lean (2026-10-22).** Organize tests by system or invariant, not
   by delivery wave or slice (no new `*_b`/`*_c1`-style files). Extend the owning
   system's file. When a change reworks a feature, delete or merge the tests that
   only pinned the old shape. A test must protect save integrity, core math, a rule
   invariant or a reproduced defect; delete duplicates and implementation-detail
   assertions when found. Dated pruning passes record what went in the task record.
7. **Proof scales with the kind of change (2026-10-25).** From Weibao's 2026-10-25
   question whether tests should be removed or optimized
   ([request](USER_VISION.md#world-depth-shared-mechanisms-and-lean-proof-2026-10-25)).
   A new or changed mechanism keeps the full route above. A content row added on a
   mechanism that already has browser and persistence proof needs the mechanism's row
   lint or schema test plus one sampled journey per batch, not a new test per row.
   When a bespoke module ports onto a shared mechanism, its per-module tests fold into
   the mechanism suite and the row lint; keep only save, migration and compatibility
   cases. Assert state and behavior, not log prose or dispatch-doc text. Evidence:
   in the 2026-10-24/25 lanes the real product defects came from browser or MCP play,
   while full-suite failures were mostly harness noise
   ([DWF98](DEEP_WORLD_WORKFLOW_2026-10-19.md#round-4-why-runtime-worlds-stay-thin-2026-10-25)).

| Change or boundary | Focused route | Scope / additional evidence |
|---|---|---|
| Index, rule codes or index links | `npm run check:rules` | Document consistency only |
| People/world knowledge projections | `npm run check:rule-behavior -- knowledge` | Extend relevant projection tests for new observers or disclosure paths |
| Native crafting transactions and mixture quote admission | `npm run check:rule-behavior -- transactions` | Other command, cost, preview and product changes need their own relevant tests |
| Foundation save compatibility helper | `npm run check:rule-behavior -- saves` | Other save slices/migrations need their own tests; persistence also needs browser save/reload/Export/Import |
| Center-mode lifecycle | `npm run check:rule-behavior -- navigation` | Actual Back/Esc, focus and visibility need rebuilt desktop browser evidence |
| UI tokens and panel ownership | `node --test tests/ui_contract.test.js` | Structural baseline check; visual/discoverability evidence at 1920×1080 stays separate |
| Other runtime behavior | `node --test tests/<relevant>.test.js` | Find/extend the actual owner suite; no mapped group means uncovered by this runner, not exempt |
| Architecture boundaries | AR16's architecture command when available in the active checkout | Follow the modular-seams owner; do not duplicate its checker or silently skip a required gate |

`npm test` already includes `tests/*.test.js`, including the focused groups.
An inherited pass without enough input identity is a lead, not reusable proof.
Report an unavailable or unrun required check explicitly; do not label it passed.

## Definition of done: the floor (AD43)

Accepted 2026-10-26 ([request](USER_VISION.md#quality-floor-accepted-2026-10-26)).
Six lines, each restating an existing code; this section adds no new mechanism.
A runtime slice that misses any line is recorded as "implemented, below floor",
never "done". Content rows on a proven mechanism meet FLR2–FLR4 through the
mechanism's lint and one sampled journey (AD36 item 7). Docs-only work is exempt.

| Line | A slice is done only when | Restates |
|---|---|---|
| FLR1 Build | The receipt names the bundle hash it was proven on (`game_freeze` returns it). | IPC9, AD36 item 4 |
| FLR2 Route | The changed behavior was reached from a fresh life by earned steps, or the fixture is named. The MCP walk is the cheap check; the rebuilt desktop browser run is the UI proof. | IPC8, MC14, AR10, WPR32 |
| FLR3 Shown | What the player can do has a description in UR70–UR75 shape, a visible cost, and feedback when it cannot run. | UR70–UR75, PIR9 |
| FLR4 Used | The result has a consumer: an edge, a verb, a gate or a use that already exists. A renamed meter or longer timer does not count. | DWF175, master plan P3 |
| FLR5 Kept | When persistence changes: save, reload, Export and Import were exercised. | AR10, WPR32, AD36 item 3 |
| FLR6 Labelled | The receipt names the highest review state reached (drafted, source-spot-checked, rules-reconciled, built, browser-verified, director-accepted) and the route kind. | WPR21, IPC8, AD42 |

## Shared principles across rulebooks

The same ideas recur under different codes. Cite the most specific one.

| Principle | Expressed as |
|---|---|
| Truth and knowledge are separate | Rulebook 6, AD7, AR8, MR1, MR31, SR5, SR9, GR5, sealed secrets |
| A seen thing does not silently change | MR3, MR30, SR22, GR3, GR10 |
| Previews and inspection cost nothing | MR4, SR13 |
| Things are conserved and have a custody | MR5, SR15, Rulebook 5 |
| Each world sets its own law | Rulebook 2–3, AD1, MR11–MR15, SR1, SR3 |
| One authority per fact | AD7, AR3, MR29 |
| Same rules for player and NPCs | AD6, MR23, GR13 |
| Nothing ships without a reader | MR32, SR12, GR12 |
| Game time, never wall clock | MR28, SR20–SR21, GR17 |
| Build a slice, not every adjacent system | SR23, AD33, AGENTS scope |
| Prove the claimed layer | AR10, AR16, SR24, MR34–MR36, UR "Before you call it done", AGENTS verification |
| Persistence follows the selected compatibility policy; new state survives restoration | AR6, MR30/MR33 and SR22, qualified by the [old-save deferral](USER_VISION.md#old-save-compatibility-deferred-2026-10-17) and [content-ID decision](USER_VISION.md#content-id-retirement-and-frozen-world-idle-2026-10-18); no automatic migration gate |

## Tensions reconciled

Each tension is resolved from existing authority; none needs a new decision.

| Code | Tension | Resolution |
|---|---|---|
| T1 | Rulebook 2 says no global defaults; many OD answers say "by default". | Rule 2 itself reads any default as a placeholder until the world defines its own. The OD defaults are those placeholders for ordinary play, accepted later; worlds can still differ where the OD says world- or means-dependent. |
| T2 | Rulebook 8 says new features extend existing panels instead of separate windows. | Its vanilla-playable part stands. Its UI composition clause is superseded by the 2026-10-15 Proto23 foundation and surface types (UR1, UR5), as PROJECT already marks for "Original UI is the baseline". |
| T3 | MR2 makes outcomes deterministic given inputs and draw; the repeatability answer selects no universal deterministic policy. | Different layers. MR2 governs save reload and preview (save integrity). Repeatability governs in-world rewinds and repeats, decided per world and means. |
| T4 | GR1–GR17 were a proposal, yet MR and SR state the same freeze and draw ideas as standing. | Resolved 2026-10-18: Weibao accepted GR1–GR17 as the general generator contract. MR and SR remain the making and site applications. |
| T5 | Rulebook 9 allows only two firm lines; SR14 and AD19 allow harsh play. | Harshness is chosen or forewarned, not a firm line. Anti-abuse beyond save integrity is not a rule (AD22). |
| T6 | The rulebook's "more to consider" candidates (consequences persist, many routes, information when it comes up, sources first) read like rules. | Still candidates in general. They are standing only where a later rulebook adopts them: SR22 for site persistence, AD5 for routes, UR42 for disclosure, AGENTS scope for sources. |
| T7 | LOTM planning docs use "AR1–AR11" for audit rules; ARCHITECTURE_RULES uses AR1–AR16. | Unqualified AR means architecture rules. Cite the LOTM set as "LOTM AR" with its link. |

## Retired and archived

Finished or superseded records. They stay at their paths because other docs link
to them, and no rule code is removed or reused. History only, never a rule source.

| Record | Retired | Why |
|---|---|---|
| [Design defaults audit](DESIGN_DEFAULTS_AUDIT.md) | 2026-10-18 | All 24 rows applied 2026-10-10; outcome lives in Rulebook 1–12 and AD5 |
| [Superseded queue/plan text](reviews/QUEUE_PLAN_SUPERSEDED_2026-10-18.md) | 2026-10-18 | Dated history of replaced plan text; owners are in the refresh report |

## Aspects without a dedicated rulebook

Combat, health, economy, skills and presence already have the registered domain
rulebooks above. Cheats, characters/companions, lives/continuation and time use
their AD rules and linked owners where no dedicated book applies. Search those
owners before proposing another rulebook. A new rulebook requires Weibao’s
request, provenance in USER_VISION, a register/router row here and a PROJECT
summary; an audit or an isolated mistake does not require one.

## Overlap owners (proposal, 2026-10-30)

Proposed owners for overlaps found by the [done-chats audit](audits/DONE_CHATS_AUDIT_2026-10-30.md) F8. These are proposals until the coordinators confirm them; they change no accepted decision. The owner holds the model and the other side reads it; a second copy of the data is a defect (WA41, AR1).

| Overlap | Proposed owner | The other side |
|---|---|---|
| Debts | The economy Owed ledger | The relationship web reads debts from it and adds only how people feel about them |
| Known, guessed and open wording | Knows (the knowledge system) | The character sheet displays its states and wording and does not keep its own |
| Institution rank ladder (RPX18) | Organizations | Economy reads rank for pay and access |
| LOTM potion formulas and aid preparations | sw-rites (L4), on the rite and craft act engine from `30871ea4` (D1: ritual essence oil and ritual bath oil are one product in two stages; D2: potion rows run on that engine) | The village mixing counter stays the mixture model |
| LOTM volume 1 absorption | L-A only | The overnight coordinator hands off and stops writing it |
| Divination rows | The sw-absorb `divinations` key, through its seam; L4 supplies the rows in the `lotm_divination_rows.js` shape | Summons and potion promotion get their own row files, per `30871ea4` |

## Reserved prefixes (2026-10-19)

The prefixes of the [register](#register-of-rule-sets) are reserved: AD, UR, AR, MW,
MR, SR, AU, GR, CX, WA, BHR, CBR, ECR, SLR, PIR, GTR, ABR, WER, CLR, SUI, RPT, LSD, plus T for the tension rows and
"Rulebook". A bare code with one of these prefixes always means the register
owner's rule. A palette, audit or considerations doc that needs its own numbered
table picks a prefix that is not in this list and that a repo-wide grep shows
unused, or writes a doc-qualified form (`PS-AR1`, `WD23-AR1`). A code cited
outside the file that defines it is written `<file-stem>#<code>` (for example
`NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14#SU3`). Do not rename a registered
rulebook's own codes. Collisions found by the dedup audit (X6) and their
renames: [L5 report](reviews/DEDUP_AUDIT_2026-10-18/L5_REPORT.md).

## Changing this index

For implementation evidence, `npm run check:rule-behavior` maps a small set of
existing tests to rule codes and prints their limited scope. It also accepts a
group, for example `npm run check:rule-behavior -- knowledge`. These tests already
run in `npm test`; this is an optional focused route, not an extra completion
gate or whole-rule compliance verdict. See the [implementation check assessment](reviews/RULE_IMPLEMENTATION_CHECKS_2026-10-16.md)
for covered scenarios, gaps and cost recommendations.

- New rulebook: only on Weibao's request. Record the request in USER_VISION, add
  a register row and router rows here, and one line in PROJECT standing priorities.
  Link it from AGENTS only if it binds every agent.
- New accepted decision: add or revise its AD line here when it changes an aspect.
- Codes are never reused. A superseded rule keeps its code with a dated note.
- Run `npm run check:rules` after any change here or to a rulebook's codes. It checks register coverage, code ranges, AD contiguity, cited codes and links.
