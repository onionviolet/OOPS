# Gameplay loops, world research and ideas for OOPS

2026-10-26. Requested by Weibao: inventory world research and audits, make an
idea list and consider more; then ground it in Proto23's gameplay loop, other
games' loops and what OOPS needs to account for itself.

Scope clarified by Weibao later in this chat: retain the original inventory
goal alongside gameplay loops. The catalogue includes book worlds, original
worlds and shared systems, concrete gameplay possibilities, further connections
and the strongest next slices. Loop analysis is one lens within that scope.

Status: saved-reference synthesis and proposals. This is a reading guide and
idea palette, not another specification, build dispatch or acceptance ledger.
Source observations below refer to the dated saved audits, not a fresh playtest
of those games. Current OOPS runtime was not exercised. Existing owner codes
and exact delivery receipts win over this guide's summaries.

Rules: AD5–8/15–19/22/28/32–38/41–43; WPR2/4/5/20–25/27–28/31.
[Current direction](../USER_VISION.md#book-worlds-and-menus-first-frontier-and-mistglass-as-test-beds-2026-10-26)
puts depth into book worlds and menus, with Frontier and Mistglass as test beds.
The retired one-realm/one-prestige milestone is not restored. The older Proto23
design report still mentions it; that sentence is historical, not current scope.

## What the research already gives us

| Code | Saved material | What we can use it for | Limit |
|---|---|---|---|
| F1 | 30 Markdown world cards on disk, excluding README, in the [card directory](../worlds/world-core-kit-2026-10-14/cards/README.md); [root kit](../worlds/WORLD_CORE_KIT_2026-10-14.md) and [successor](../worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md) | Starts, daily life, learning, power, money, institutions, clocks, making, failure and continuity | Old card grids are dated snapshots; card count is not playable-world count |
| F2 | Thirteen institution/facility source families, linked below: twelve institution/role files plus the Paradise facilities file; [implementation map](../worlds/IMPLEMENTATION_MAP_ABILITIES_PROCEDURES_SUBTLE_INTEGRATIONS_2026-10-23.md) C1–C19 and I1–I24 | Specific people, services, rights, duties, prices, information channels and mechanisms that can support a life | Bounded source passes, mixed review states; documented mechanisms are not automatically implemented |
| F3 | [Full ideas inventory](../audits/IDEAS_LEFT_INVENTORY_2026-10-25.md), [ranked triage](../audits/IDEAS_TRIAGE_2026-10-26.md), [nested triage](../audits/IDEAS_NESTED_TRIAGE_2026-10-26.md) | Retain the large palette, deduplicate it and find existing owners/receipts | A ranked action may be evidence gathering rather than a ready feature |
| F4 | [Source queue](SOURCE_DEEP_DIVE_QUEUE_2026-10-24.md) and [harvest receipt](SOURCE_HARVEST_2026-10-25.md) | Further world and life candidates, including crafting, investigation, spatial progression and alternate loop structures | Acquired, extracted, read, source-checked and playable remain separate |
| F5 | Game source/media studies in the next table; domain audits linked under OOPS considerations | Understand why repeated actions remain interesting and where systems connect | Static inspection, configuration data, saved media and played evidence have different strength |

## Start from the loop, then choose the features

These loop summaries are our synthesis of the cited research. The final column
contains OOPS proposals, not claims that the reference implements that adaptation.

| Code / reference | Repeated play described by saved research | What makes another cycle matter | Useful OOPS adaptation and its cost |
|---|---|---|---|
| G1 · [Proto23 source](proto23/PROTO23_VS_YAIRPG_2026-10-10.md), [R4](proto23/readers-2026-10-10/R4_crafting_vendors_actions_combat.md), [design lessons CRL1–CRL26](proto23/DESIGN_LESSONS_FOR_OOPS_2026-10-20.md) | Notice a local possibility → choose an activity and means → work/fight/collect → recover or process the result → gain useful skill, gear or access → attempt something newly practical | Recipes and skills reveal through use; tools, energy, preparation and local facts change the plan. Later saved media adds physical work and output distinctions; it is not one proven combined revision | Give a small activity an understandable place in a larger pursuit. A different tool should change a useful result, time or recovery cost. Keep routine handling convenient unless transport or condition creates a real decision |
| G2 · [YAIR base comparison](proto23/PROTO23_VS_YAIRPG_2026-10-10.md), [baseline dossier](open-idle-games-2026-10-09/YAIR_BASELINE.md) | Fight/gather/work → obtain money and materials → improve gear and practical skills → enter harder or more rewarding situations | Preparation, crafting quality and success, combat readiness and new places feed one another | Retain a comprehensible local route beneath the multiverse. A peaceful career can supply its own useful next steps; each world need not require the same combat chain. This baseline is historical, not a current gap audit |
| G3 · [Idle Loops](open-idle-games-2026-10-09/IDLE_LOOPS.md) | Draft an action sequence → run within mana/resources → inspect where it ended → improve knowledge, skills and sequence → run farther | Planning and diagnosis become the active play; a repeated sequence has visible improvement | Chosen routines with quantity/reserve limits and an exact stop explanation. Its reset and banked-speed policies are reference-specific; OOPS need not reset a life to reuse a plan |
| G4 · [Progress Knight](open-idle-games-2026-10-09/PROGRESS_KNIGHT.md) | Choose work and training → afford a better life and career → age → carry learning benefits into another life | Practicing a particular subject affects later learning of that subject | Let retained expertise change the next life concretely. Original one-job/one-skill choice and Quest's all-task training are different models. Avoid importing mandatory death, simultaneous training or offline aging as defaults |
| G5 · [Evolve](open-idle-games-2026-10-09/EVOLVE.md) | Allocate workers → improve production → unlock technology and capabilities → resolve bottlenecks → choose a run transition | Traits alter actual costs/jobs/actions, and progression gradually changes the scale of decisions | Make race, body and world law alter available methods. Production can unlock a new way of living. Civilization resets and repeated purchasing are not a ready solution for one continuing person's life |
| G6 · [Path of the Idle Cultivator](cultivation-idlers/path-of-the-idle-cultivator/CORE_LOOP_DIGEST.md) | Gather/refine resources → prepare vessel, methods and equipment → reach a bottleneck → attempt a graded breakthrough → use the gained capability | Preparation quality affects outcomes; cultivation inputs have different consumers; the rate breakdown explains improvement | A breakthrough should change a useful capability, not just its rank name. Preparation and recoverable attempt quality can create choices. Its standard trial uses separate HP and does not establish every specialty trial's failure behavior |
| G7 · [Taiwu comparison](scroll-of-taiwu/pass-2026-10-14-deep/COMPARISON.md) | Seek people, texts and support → obtain access → learn/practice a particular method → use it in the world → build means and continuity | Learning depends on actual texts, readiness, institutions and people with their own means | Teachers and books become routes to things the player can do. Keep knowledge, practical ability and institutional recognition distinct. Broad NPC planning remains deferred outside selected bounded uses |
| G8 · [Academagia systems](academagia/pass-2026-10-14-systems/REPORT.md) | Allocate opportunities to study, relationships and projects → gain real skills/resources/help → meet adventure or institutional requirements → take new opportunities | Backgrounds grant real means; materials become tools; familiar expertise can contribute to an outcome | HP-like learning needs practice and an application, while a companion can supply specific expertise. This selected static systems pass does not establish the entire school's playable calendar or every adventure |
| G9 · [Warsim kingdom loops](warsim/KINGDOM_LOOPS_DIGEST.md) | Choose policy, hiring and local activity → commit workers/resources → settle income, wages and conflict → read consequences → revise policy | A person used for fighting may also have produced the harvest; scale changes the available decisions | When a selected household/institution loop uses helpers, show displaced work, payment and returns together. The dossier mostly establishes embedded menus and reports; full formulas and order remain open |
| G10 · [Qud selected paths](caves-of-qud/REPORT.md) | The selected-path study supports local sequences of means → eligible action → world effect → changed possibilities | Object parts, effects and action eligibility allow interactions to matter beyond an item name | Check what an ability physically changes and who can use the result. This is a mechanism lesson from five inspected paths, not a complete reconstructed Qud campaign loop |

## Proposed OOPS loop at three scales

O1, moment to moment: **Notice something worthwhile → understand enough to act
→ choose means → act → see a consequence → use it or change approach.** Gathering,
combat, a lesson, a negotiation and a ritual can all fit this without sharing
identical mechanics. When an action cannot run, its real cause should point to
a discoverable next step.

O2, one session: **Choose a pursuit → prepare → make progress through connected
actions → gain a capability, relationship, possession or place → establish the
next useful pursuit.** Idle work carries out a chosen part of that plan. Active
play includes exploration, experiments, changing arrangements and responding to
new facts. A comfortable established routine can remain valuable in its own right.

O3, across lives and worlds: **Develop a particular life → choose continuation,
travel or succession when appropriate → retain what its actual carriers and
world rules support → use it in a different situation.** This need not force
death or prestige. World differences should change decisions and consequences,
while skills, relationships and possessions preserve meaningful history.

These are proposed synthesis lenses over the [life-sim owner](../LIFE_SIM_NORTH_STAR.md)
and [master playability plan](../MASTER_PLAYABILITY_PLAN_2026-10-25.md), not accepted
new mechanics. One connected pursuit is a useful implementation slice, not the
ceiling on the full world's horizon.

## What OOPS needs to account for itself

| Code | Consideration | Concrete question or example | Existing owner / implication |
|---|---|---|---|
| C1 | A reason to repeat | After making the first potion, is there a patient, commission, expedition, experiment or personal preparation that benefits from another? | [Making](../MAKING_RULES.md), implementation map C7/C19. Name the output's consumer before adding a recipe |
| C2 | Useful growth | Does better control preserve a material, let you work safely, open a method or reduce a chore? A stronger character can outgrow the old obstacle | AD28/38; Proto23 CRL2. Do not silently raise tree resistance to cancel earned power |
| C3 | Active choices and chosen automation | Can I set a supply reserve and leave a routine running, then see exactly why it stopped? Can I still experiment manually? | [Activity/idle palette](../AROUND_YOU_SUBJECT_ACTIONS_CONSIDERATIONS_2026-10-18.md), G3. An exposed queue alone is not an understandable plan |
| C4 | Costs that create decisions | Which limits actually change preparation: time, energy, access, tools, ingredients, obligation? Which just add repeated clicks? | AD5/19/22; G1/G3. Limits have a world-dependent dial and reason; maintenance is not a universal requirement |
| C5 | Several good lives | Can an ordinary maker, student, explorer or specialist sustain a useful pursuit without every route funneling into combat or reset? | [Book-life palette BF28–BF94](../worlds/BOOK_WORLD_FEATURE_GAPS_2026-10-15.md). Different worlds and circumstances support different combinations |
| C6 | World identity in play | How does a school term, church jurisdiction, Gu's upkeep or a loop's retention change my next action? | [World dials audit](../audits/WORLD_DIALS_AND_INTERPRETER_CORE_AUDIT.md), WA/AD38. Names and art alone do not establish a distinct world |
| C7 | Observable progress and ignorance | Can I see what an earned ability changes without learning hidden truths my character cannot know? | AD6–8, UR70–75. Show supported effects, observed evidence and useful uncertainty |
| C8 | Coherent time | What advances during work, travel, absence or a restart? Do terms, contracts, bodies and stock read the correct clock? | AD15–17; implementation map C17/I1/I9. Do not import another game's offline policy accidentally |
| C9 | Recoverable interruption | If supplies run out, a lesson stops or a save fails, what remains, what was spent and how do I resume? | AD19, AR7, [body/health audit](../audits/BODY_HEALTH_CORE_AUDIT.md). Trace cancellation, output ownership and costs together |
| C10 | Social means with bounded scope | Does a teacher, broker or companion provide a specific service, resource or expertise instead of a decorative relationship score? | [Companion audit](../audits/COMPANIONS_CORE_AUDIT.md), C19. Start with a selected role; a full population simulation is not a prerequisite |
| C11 | Economic and material connections | Can something gathered become a useful tool, supply or sale, and does the payout pay for a meaningful next step? | [Economy audit](../audits/ECONOMY_CORE_AUDIT.md), [production audit](../audits/MODULAR_CHAINS_CORE_AUDIT.md). Check custody, processing and actual consumers |
| C12 | Session and desktop usability | On returning, can I identify my pursuit, current situation, available actions and last stop without navigating several disconnected reports? | [UI audit](../audits/UI_DESIGN_CORE_AUDIT.md), master MC9. Diagnose actual return-session friction before adding another dashboard; later UI proof targets 1920×1080, mobile deferred |

## Concrete world idea palette

All W rows are design possibilities drawn from the linked owners. They do not
claim that the entire loop exists. HP and LOTM have later bounded implementation
receipts routed by [PROJECT](../../PROJECT.md) and [same-day triage P11/P12](../audits/IDEAS_TRIAGE_2026-10-26.md);
older source-only labels cannot erase those deliveries. Their next slice extends
the actual delivered route after checking its incumbent owner.

| Code / world and research owner | A connected pursuit we could draw from it | What gives it a different loop |
|---|---|---|
| W1 · [Harry Potter](../worlds/HARRY_POTTER_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md) | Learn/practice a useful spell → complete a school project or adult commission → gain means for a harder project; connect terms, home and letters where supported | Student and adult lives have different access, time and obligations; school is more than a generic XP vendor |
| W2 · [LOTM](../worlds/LORD_OF_THE_MYSTERIES_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md) | Obtain a supported assignment/contact → prepare → use an earned pathway ability → report what was actually established → earn access, supply or a next case | Jurisdiction, clearance, knowledge reliability and acting/digestion affect preparation and aftermath; do not invent unsupported ability grants |
| W3 · [Reverend Insanity](../worlds/REVEREND_INSANITY_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md) | Acquire knowledge/materials → refine and maintain a useful Gu → take a clan/service opportunity or trade → reinvest in a different method | Gu upkeep, refining outcomes, auctions, information and local institutional interests connect power to money and risk |
| W4 · [Mother of Learning](../worlds/MOTHER_OF_LEARNING_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md) | Learn a technique/contact route → test it during a bounded span → retain the supported knowledge → use the next span differently | Knowledge retention and locally reset resources differ from ordinary death/prestige. The existing ward-loop design is not proof of the source's full restart loop |
| W5 · [Shadow Slave](../worlds/SHADOW_SLAVE_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md) | Train with limited preparation time → equip and arrange support → undertake an expedition → recover and choose a next commitment | Academy timing, cohort support, patronage and institutional duties change the costs of independence |
| W6 · [Reincarnation Paradise](../worlds/REINCARNATION_PARADISE_FACILITIES_AND_SUBTLE_DETAILS_2026-10-23.md) | Prepare through hub facilities → enter a derived-world task → return and settle → choose an upgrade or next preparation | Facilities, role/status benefits and perishable mission information connect the hub and destination; missing services stay unconfirmed |
| W7 · [Omniscient Reader](../worlds/OMNISCIENT_READERS_VIEWPOINT_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md) | Learn scenario conditions → obtain support/supplies through actual channels → meet or alter a scenario situation → deal with promise and territory consequences | Shop availability depends on its operator/channel; membership can buy rights and audiences rather than merely stronger stock |
| W8 · [Circle of Inevitability](../worlds/CIRCLE_OF_INEVITABILITY_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md) | Establish local contacts and ordinary means → contribute to a bounded investigation → navigate the relevant institution → follow its consequences | Sequel-specific institutions and regional authority; do not reuse Tingen's arrangements unchanged |
| W9 · [Fanren Simulator](../worlds/FANREN_SIMULATOR_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md) | Fund a simulation → learn from it and choose a retained benefit → use it under real local conditions → improve the next attempt | Simulated wealth, real resources, lifespan cost and reward context differ; a displayed reward is not automatically useful outside its run |
| W10 · [Primordial Saint Sect](../worlds/PRIMORDIAL_SAINT_SECT_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md) | Obtain a viable position and training means → understand the institution's incentives → choose investment, obligations and an exit/restart approach | Talent, debt and institutional valuation matter beyond raw cultivation speed; separate the source's distinct meanings of talent |
| W11 · [Regressor's Tale](../worlds/REGRESSORS_TALE_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md) | Use a supported intake route → learn through service or competition → earn teaching time/resources → apply retained experience differently | Access can come through recommendations, interviews or contests; an elder's time is a useful reward in itself |
| W12 · [TTKS books](../worlds/TTKS_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md) | In a selected book, join a supported profession/venue → gain and use its means → handle its actual obligations and trade | Five separate world identities. A ritual exchange, office, challenge and church cannot be merged into one universal ladder |
| W13 · [A Soldier's Life](../worlds/A_SOLDIERS_LIFE_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md) | Enter an institution → train and take duties → manage pay, kit and obligations → pursue a specialized role | Military entry, training, wages, discretion and service terms interact. Source research and historical finite delivery do not resume a paused campaign; follow the current campaign owner in PROJECT |

Further candidates already in the [source queue](SOURCE_DEEP_DIVE_QUEUE_2026-10-24.md),
with design questions rather than read-completion claims: **Soulhome**, spatial
and material progression; **Bookworm**, making that opens learning and social
access; **Arcane Ascension**, enchanting and devices; **Chaotic Craftsman**,
crafting as a sustained life; **Perfect Run / Re:Zero**, different checkpoint
ownership and reset shapes; **The Game at Carousel**, role and observer rules.
Use their exact source coverage before adopting a concrete rule.

## Original worlds and retained reference branches

This part preserves useful original-world ideas while respecting the current
book-world priority. The candidate uses below are proposals, not new independent
Frontier or Mistglass depth. Historical delivery labels are not fresh proof of
the current dirty checkout.

| Code / owner | What we have to draw from | Concrete gameplay possibility | Present boundary |
|---|---|---|---|
| OW1 · [Original Frontier](../worlds/original-frontier/WORLD_BRIEF.md) | Connected Village/forest/Town setting with adventuring, making, investigation and organizing; later finite delivery routes are linked from the brief | A gathered material becomes a useful repair or supply delivery; the result changes access or someone's situation. Transfer the applicable mechanism to a selected book-world need | Remains a playable shared-mechanism test bed. Brief includes dated implemented-unverified evidence, not whole-world current acceptance |
| OW2 · Mistglass, [system register](../SYSTEMS_REGISTER.md) and [cultivation checkpoint](../gm/dispatch/cultivation-absorption-2026-10-24/CHECKPOINT.md) | Method/vessel/law/mantra/attention work connected to shared energy and body/making owners | Test how preparation changes a particular method's useful result, then apply that supported mechanism to a book-world technique | No independent new Mistglass depth selected. Exact source and browser/persistence boundaries live in the linked receipts |
| OW3 · [Proving Ground](../worlds/proving-ground/WORLD_BRIEF.md) | Proposed training/test space with developer and fictional faces, adaptation dummies and explicit carrier rules | Reproduce an ability interaction, compare the ordinary and exceptional case, then distinguish training knowledge from a real encounter's outcome | A fixture is a diagnostic route. It does not prove natural entry, ordinary-world usefulness or full gameplay delivery |
| OW4 · [Proto23 visitor branch](../worlds/proto23/WORLD_BRIEF.md) | Source-qualified village/dojo/cottage branch and retained handling/stave route, distinct from the broader reference research | Connect a lesson, tool, preparation and finished object so each small action contributes to the local pursuit | Reference adaptation, not an original source world or a claim of full Proto23 parity. Historical implemented-unverified labels require later owner reconciliation |

## Shared-system idea list from the audits

These S rows connect audit topics to player outcomes. They are ideas to fit
against the [systems register](../SYSTEMS_REGISTER.md), which distinguishes
existing implementations, supported degrees and gaps. A mechanism can exist
without every proposed world application; a documented gap can also have a
later bounded delivery. Check that exact consumer before reopening work.

| Code / research or audit owner | Concrete idea | Worlds or pursuits it can connect | Source / delivery limit |
|---|---|---|---|
| S1 · [Making and production](../audits/MODULAR_CHAINS_CORE_AUDIT.md), [making/items register](../systems/MAKING_ITEMS_ECONOMY.md) | Use available ingredients with different functional contributions; process imperfect outputs into something useful instead of a binary waste result | Potion preparation, cooking, repair, crafting commissions, mundane and magical production | SUB0–SUB4 descriptors and finite material-fit consumers are different levels. A general arbitrary-substitution engine is not established |
| S2 · [Economy](../audits/ECONOMY_CORE_AUDIT.md), implementation map C5/C6/C11/C16 | Earn access through trade, service, information or favors; let a broker, bid or credit agreement change the terms | HP commissions, RI markets, Paradise preparation, local ordinary careers | Auction, escrow, debt and favors are distinct mechanisms. Source prices remain edition-qualified; do not infer every market mechanism is playable |
| S3 · [Progression and gates](../audits/PROGRESSION_GATE_INVENTORY_2026-10-23.md), [progression/state register](../systems/PROGRESSION_WORLD_STATE.md) | Earn a rank that grants a useful action, supply right, teacher or service, with its associated obligations | School examinations, church clearance, sect entry, licenses and institutional careers | A validated descriptor or rank label is not proof of a working grant, evaluator or consumer |
| S4 · [Body and health](../audits/BODY_HEALTH_CORE_AUDIT.md) | Choose preparation or treatment that restores a particular activity, changes exposure or makes a method practical | Expeditions, strenuous work, medicine, unusual bodies and cultivation | Preserve forgiving recovery and local body rules. Avoid making maintenance or hunger a universal loop requirement |
| S5 · [Combat and conflict](../audits/COMBAT_CORE_AUDIT.md) | Let preparation, retreat, nonviolent resolution and aftermath feed later choices, rather than treating victory as the sole useful output | Investigation, hazardous travel, duels, protection work and contested resources | Separate source-supported powers from authored examples; exercise actual encounter consumers when selected |
| S6 · [Companions](../audits/COMPANIONS_CORE_AUDIT.md) | A particular companion supplies expertise, transport, protection or help with a project, using real means | School projects, healing, gathering, expeditions and limited household work | A scoped role is sufficient for a useful interaction; broad autonomous NPC simulation is not a prerequisite |
| S7 · [World depth and sites](../audits/WORLD_CORE_KIT_CORE_AUDIT.md), [site rules](../SITE_AND_EXPLORATION_RULES.md) | A visit reveals a method, resource or practical use; restoration or exploration changes what that place lets you do | Libraries, workshops, caves, schools, shrines and transport routes | Discovery, access, knowledge and physical change are separate. A mapped location is not a completed exploration loop |
| S8 · [World dials](../audits/WORLD_DIALS_AND_INTERPRETER_CORE_AUDIT.md), [subtle world gaps WG1–WG26](../audits/WORLD_SUBTLE_GAPS_2026-10-20.md) | The same action changes meaning under a different clock, material law, observer or institution | Delayed letters, evidence left by powers, seasonal access, training versus real-world knowledge | Older absence findings are dated leads, not present defects. Use the destination's actual mechanism and supported exceptions |
| S9 · [Cheats and carriers](../audits/CHEAT_CORE_AUDIT.md), [continuation register](../systems/PROGRESSION_WORLD_STATE.md) | A retained ability, learned technique or exact carried item enables a different approach in the next setting | Long lives, succession, simulators, travel and repeated-run worlds | Identify what carries the effect and what supports its use. Finite implemented cheat consumers do not establish every cosmology or inheritance proposal |
| S10 · [UI design](../audits/UI_DESIGN_CORE_AUDIT.md), [reference detail connections](proto23/ENGINE_AND_UI_DETAIL_CONNECTIONS_2026-10-20.md) | Put the useful effect, current means, actual cost and next actionable step where the player makes the choice | Every pursuit, especially return sessions, reports, item inspection and blocked actions | Preserve the incumbent tooltip/UI lane. Diagnose current populated desktop behavior before selecting a new layout change |

## Strongest next slices from the combined catalogue

This is a proposed comparison of concrete outcomes, expanding N1–N5 below.
Existing selected work and incumbent ownership take precedence; none of these
rows launches work. Runtime delivery still uses AD43 with a rebuilt desktop
journey and affected persistence. Source checks and diagnostics stay labelled
as such rather than being called implemented gameplay.

| Rank / code | Proposed slice and why it is strong | Existing route | First evidence needed / done check |
|---|---|---|---|
| 1 · P1 | Continue one HP pursuit: supported lesson/practice → useful project or commission → proceeds/access → a next project. It connects learning, ordinary life, making and economy in a priority world | W1/S1/S2/S3, master M3 HP, triage P12; N1/N2 | Reconcile delivered school/adult routes and the current writer; choose the earliest missing useful join. Done at the selected outcome with real cost, result use, failure recovery and continuation after saving |
| 2 · P2 | Continue one LOTM pursuit: supported assignment → prepare/use an earned ability → report evidence → obtain a useful next assignment or resource. It connects power to a lived role | W2/S3/S5/S8, master M3 LOTM, triage P11; N1/N2 | Locate the ability's supported use and existing consumer; reconcile current entrance/acting work. Done when the ability changes a real outcome and the report reflects what the character established |
| 3 · P3 | Make one repeated part of P1 or P2 dependable: chosen quantity/reserve → work → clear stop → useful output and a way to resume | G3/S10/C3, master M2 where friction is reproduced; N3 | Inspect current controls and reproduce a specific missing intention or stop explanation. Done when completion, shortage and interruption produce understandable, recoverable results |
| 4 · P4 | Give an existing world-specific method a second useful application, such as a learned method helping work as well as an encounter | S1/S4/S5/S7, master M4 serving M3; N2/N4 | Verify both consumers and source support before proposing shared changes. Done when the same real effect changes two meaningful situations without duplicated rules; do not invent an application canon contradicts |
| 5 · P5 | Scope a next-world signature pursuit with a different structure: e.g. retained learning across a span, context-sensitive simulator rewards, or hub preparation for a derived world | W4/W6/W9, source queue and master M5; N5 | This first action is source/design mapping, not a world build: one located signature rule, complete repeatable pursuit, existing seams and exact missing mechanisms. Preserve pauses and prior world selection |

P1 and P2 are alternative dependency-ready starting points under the current
book-world priority; their rank here is a recommendation, not a change to
Weibao's selected order. A source or integration dependency may make the other
the practical next slice.

## More-to-consider round 1: connect the small loop to the whole life

The following are additional combinations for this request, not claims that no
earlier palette discussed them. They reuse the original owners rather than
creating six competing implementation queues.

### ACT NOW, completed for this documentation task

A1: Save the loop comparison, world palette and OOPS considerations together and
link them from IDEA_INDEX. Source observations, proposals and delivery evidence
remain distinct. Apply the latest book-world priority and retired milestone
correction when interpreting older reports. No runtime correction is diagnosed.

### ACCOUNT FOR NOW

| Code | Connection and consequence | Disposition / existing owner |
|---|---|---|
| MC1 | Every interesting loop has an output-to-next-action connection. A material, skill or title with no use can make progress feel hollow despite many systems | In a selected slice, name producer → result → consumer → next decision. Reuse implementation map C1/C7/C19 and AD43's used-result floor |
| MC2 | Power should sometimes retire a chore and shift attention upward. A spatial carrier may change hauling; mastery may turn basic production into a dependable routine | Preserve the changed local means and cost. AD28/38 and Proto23 CRL2/3; do not impose an identical inconvenience on every body/world |
| MC3 | A reward can be access, time with someone, reliability, independence or a new verb rather than another percentage | Trace one actual right or service to a useful action. C2/C7/C19; W11 offers a concrete source lead |
| MC4 | Loops interact through the same time and resources. Work funding lessons, lessons improving work and travel consuming supplies can create useful choices or an endless preparation treadmill | Judge a complete session, including recovery and returns. G3/G4/G6; allow a viable ordinary route and flexible world-specific alternatives |
| MC5 | A world can remain deep after the opening because the same method encounters new circumstances, not because every session adds a new subsystem | Extend the chosen world's continuing pursuit, material situation or consequence first. Master M3/M4 and the full connected-world horizon remain visible |
| MC6 | A routine can preserve intention but cannot silently become omniscient. A stop that protects the character need not reveal the hidden cause | Follow Proto23 CRL1/4 and accepted protective stops; public feedback reports supported facts while retaining uncertainty and sealed truths |

### LATER / DELEGATE, proposals only

| Code | Suggested next bounded work | Capability / effort | Done check |
|---|---|---|---|
| N1 | Walk one delivered HP or LOTM life from ordinary entry through an earned result and the next useful pursuit; pick the first uncovered dependency-ready route with the incumbent | Sol medium; small diagnostic before implementation | A route record names actual entry, motive, preparation, action, consumer, recovery and next step. State natural/fixture, input identity and what was not played; reuse unchanged passing evidence |
| N2 | Extend one source-supported application of an already earned skill/power into useful work or exploration | Sol medium; medium, after N1 exposes the exact missing join | One real application changes an outcome and feeds another action; visible costs/refusal and relevant persistence pass at AD43's scope |
| N3 | Take one existing repeated activity and test whether reserve/quantity/stop controls express the player's intention | Sol medium; small-to-medium, after checking current routine owner | Normal completion, insufficient supply, interruption and return are understandable; no duplicated activity framework or hidden-truth leak |
| N4 | Compare an early and stronger character doing the same meaningful task | Sol medium; small diagnostic, then only a reproduced gap | Record what growth makes faster, safer or newly possible and what pursuit follows. A no-change result is evidence for a missing consumer, not automatic authority for new power |
| N5 | Author one differently structured next-world pursuit from already qualified sources | Sol medium for design; medium | A located source supports the signature difference, its practical means, repeated use and aftermath; existing shared mechanisms and missing parts are named. Source order is not automatic build order |

Suggested first emphasis: finish an HP or LOTM pursuit that makes the small
loop enjoyable and gives its result somewhere to go. Continue wider worlds and
multiple progression paths through their selected owners. No new Frontier or
Mistglass depth is selected by this recommendation.

## More-to-consider round 2: the full inventory alongside the loops

ACT NOW, A2 completed: retain the original catalogue goal explicitly; add the
original/reference-world routes OW1–OW4, shared audit ideas S1–S10 and concrete
next-slice comparison P1–P5. Correct F2 from twelve to thirteen families and add
the previously omitted Soldier's Life source owner without resuming its campaign.

ACCOUNT FOR NOW:

| Code | Further connection | Consequence / existing owner |
|---|---|---|
| MC7 | A local failure can feed a different pursuit: a damaged ingredient may suit a lower-precision product; an unsuccessful application may reveal a teacher or preparation route | S1/S3/S4 and WPR16. Use a supported salvage/recovery path, rather than adding compensating rewards for every failure. Its value and cost follow the actual remaining material or information |
| MC8 | Institutional progress and practical competence can diverge: a capable outsider may solve a problem without holding office; a credential can grant access without proving skill | S3/C5 and implementation map C2/C18/C19. Provide reasonable routes where local means support them; distinguish recognition, ability and permission in the known action explanation |
| MC9 | A scarce service can be addressed through several mechanisms: earn money, exchange a favor, acquire the skill yourself, or use an effective substitute | S2/S3/S6 and AD5/38. These are world-dependent possibilities, not four mandatory branches on every interaction. First prove the ordinary route, then add a useful supported exception |
| MC10 | Continuity can transform what an old object or skill is useful for even when raw power does not transfer unchanged | S8/S9 and O3. For a selected crossing, name retained carrier, destination mechanism, observable effect and cost. Prior knowledge can guide a new experiment without automatically guaranteeing its result |

LATER / DELEGATE: incorporate one relevant connection into the selected P1–P5
slice, rather than dispatching four new systems. Suggested capability Sol medium;
small design check within that slice. Done when the selected route states which
connection matters, its source or authored status, existing owner and observable
result; no change needed where it adds no useful decision.

## Verification boundary

Documentation synthesis only. Reviewed selected saved research and owner
sections; counted card files directly. Did not reread whole books, rerun source
games, audit all current runtime consumers or verify historical receipts anew.
Local relative-link and formatting checks cover this guide and its new index
link. Gameplay, packaging, normal-app adoption, commits and publication are not
part of this task's completion claim.

## Long-term playstyles and compressed life, 2026-11-04

Weibao asked to turn the activity findings into rules and reconcile them, then “consider long term ideas like gameplay, types of palystyles, and much more?” The rule conversion is [ACR1–ACR14 / AD52](../ACTIVITY_ABSTRACTION_RULES.md). **This later round is a proposal under AD32**, outside that bounded adoption. It extends O1–O3, C1–C12 and the existing [life-sim north star](../LIFE_SIM_NORTH_STAR.md), [book-life palette](../worlds/BOOK_WORLD_FEATURE_GAPS_2026-10-15.md) and [cross-world activity forms](../SUBSYSTEM_SCOPE_LADDERS_2026-10-16.md#cross-world-activity-patterns-and-changing-detail-2026-11-04). No new research, source-canon claims, class system or world rollout is selected.

### Playstyles as pursuits a life can combine

Default proposal: choose what matters to the character and how involved to be in each pursuit, then combine real activities and relationships around that. Labels below describe recognizable ways to play, not exclusive classes, universal viable starts or equal-power guarantees. A world can support a subset or a different version for its actual reasons. A modest settled life can remain satisfying alongside exceptional power; no compulsory escalation or combat career is implied.

| ID | Pursuit and satisfying loop | What abstraction frees the player to decide / distinctive stakes |
|---|---|---|
| LPS1 | **Adventurer / expedition leader:** discover a possibility, prepare, venture, bring something useful home | Compress familiar provisioning/travel; choose objectives, route, who comes, what to risk, when to retreat and who benefits from the result. Exploration can include negotiation and avoidance. |
| LPS2 | **Scholar / experimentalist:** ask, test, learn, apply, teach or publish | Compress routine reading/trials; choose discriminating experiments, scarce samples, attribution, secrecy and whether uncertain evidence justifies acting. A negative result can narrow a useful question. |
| LPS3 | **Maker / artisan:** learn a material, develop a method, produce work someone values | Batch known work; spend attention on invention, difficult commissions, quality, substitutions, signature pieces and customers. Production scale and craftsmanship need not be the same goal. |
| LPS4 | **Merchant / logistician:** find an unmet need, arrange supply, transport, sell and reinvest | Compress repeated orders; choose reliability versus margin, counterparties, reserves, appraisal and obligations. Information, access and relationships can matter more than a single sale-price meter. |
| LPS5 | **Practitioner / devoted specialist:** develop one method deeply and learn what it makes possible | Schedule supported practice; choose research direction, teacher, body/source needs and real breakthroughs. Preserve the advantage of patient effort rather than scaling every obstacle to cancel it. |
| LPS6 | **Steward / builder / operator:** establish a home, workshop, farm or institution and make it function | Standing plans handle familiar upkeep; choose capabilities, staff, priorities, supply security and delegation. Ownership, control and obligations persist even when routine management is summarized. |
| LPS7 | **Healer / mentor / patron:** help particular people gain health, competence or opportunity | Summarize supported care and instruction; choose recipients, methods, resources, disclosure and relationships. Beneficiaries keep agency; successful teaching can make the student less dependent. |
| LPS8 | **Diplomat / organizer / political actor:** build agreements and turn coordinated effort into outcomes | Summarize ordinary contact; choose promises, coalition terms, leverage, compromise and what information to reveal. Power follows actual people, offices and means rather than a universal reputation threshold. |
| LPS9 | **Investigator / information broker:** discover something actionable and decide what to do with it | Bounded inquiries handle routine search; choose source, verification, client, disclosure, bargaining and exposure. Secrets can be traded, withheld or used without being reduced to a generic clue count. This remains a long-term idea; investigation's current priority is unchanged. |
| LPS10 | **Wanderer / courier / ordinary worker:** maintain a useful livelihood while meeting a changing world | Summarize familiar shifts and roads; choose where to stay, whom to help, which work to accept and what commitments to keep. Small outcomes and recurring people can carry a life without an epic destiny. |
| LPS11 | **Collector / curator / naturalist:** find, identify, preserve, study and connect meaningful things | Compress cataloguing and ordinary care; choose a collection's purpose, expedition, provenance, authenticity, custody and whether to display, lend, breed or consume a rare specimen. Objects should have uses/history beyond checklist completion. |
| LPS12 | **Outlaw / infiltrator / manipulator:** pursue goals through concealment, bargaining, coercion or deception where supported | Compress repeated cover maintenance and logistics; choose targets, approach, allies, exposure and what a burned identity costs. Agents react through evidence and motives; no automatic moral-policing meter or universal omniscient heat is proposed. |
| LPS13 | **Nonhuman / embodied place / distributed life:** act through a tree, creature, artifact, unusual body or several supported agents | Summarize compatible passive processes; choose where influence reaches, communication, tending, representation and dependence on others. These are authored possibilities requiring their own world/body means, not a promise that every start can use them. |
| LPS14 | **Dilettante / quiet resident / episodic participant:** combine hobbies, relationships, useful work and occasional adventures | Compress repetition selectively; choose attachment, curiosity, comfort and when to become involved. Returning home, maintaining an achieved life or changing interests can be a goal rather than a failed optimization run. |

### Gameplay over longer horizons

These add design opportunities to C1–C12 rather than replace their owners. The unusual LPI4/LPI7 alternatives are deliberate options alongside conventional power/wealth expansion.

| ID / existing basis | Long-term idea | Consequence to account for and observable example |
|---|---|---|
| LPI1 / O1–O3, C1/5 | **Nested goals with useful intermediate results.** A session serves a pursuit; several pursuits shape a life; travel or a new life supplies a different context. | A tool, contact or method should be useful before a giant project finishes. The player can complete a modest aim and stop or change direction without abandoning all value. Do not turn every life into an endless task tree. |
| LPI2 / C2/3/4 | **Growing capability changes what the player attends to.** Familiar operations become convenient; attention moves to a new question or remains on a loved specialty. | A powerful traveler may stop planning mundane roads. A skilled artisan may choose unusual work while ordinary commissions run. Automation is convenience and actual competence, not a prestige tax or mandatory ladder. |
| LPI3 / C3/8/12, ACR3/8 | **Several involvement rhythms.** Short active sessions, long supported plans and occasional close scenes coexist per pursuit. | A researcher may manage a workshop between expeditions; a resident may check a modest routine. Online summaries, banked time, physical absence and real offline progression remain different policies; this does not enable unattended play where unsupported. |
| LPI4 / C5/10, O3 | **Intentional reduction or handoff.** Sell, retire, teach a successor, delegate, keep a favorite home or close an operation. | A growing empire is one option; becoming a traveling teacher while a willing successor runs the workshop is another. Funding, consent, ownership, retained access and obligations determine what a handoff actually changes. No forced retirement or lifespan limit is implied. |
| LPI5 / C6/11, O3 | **Cross-world transfer as a new use, not a universal power multiplier.** Knowledge, tools, relationships and methods can find different applications. | Understanding may travel while fuel, source, bodily expression or legality differ. An unfamiliar market may value a common old-world material. Directional compatibility and actual carriers decide results; entering a world does not flatten its laws. |
| LPI6 / C9/10, SI5 | **Consequences become new circumstances.** A failure, debt, damaged project or broken agreement can leave an altered route forward when its causes support one. | Repair, renegotiate, change a method, accept a lesser outcome or leave. Avoid guaranteeing a dramatic branch for every failed attempt; a failed test can simply consume a sample and teach what it actually reveals. |
| LPI7 / C6/10, XD6 | **Leave traces rather than own everything.** A taught method, repaired place, written work, former student or local custom can outlive direct participation. | Preserve a small number of meaningful causes and identities. Later recognition needs an actual record, witness or transmission. A lasting trace does not require simulating every descendant or guaranteeing universal fame. |
| LPI8 / C7/12, ACR4/5 | **Readable return and personal history.** Explain what the chosen plan achieved, what changed and what the character can do next. | A return summary links spent resources, useful outcomes, specific people and unresolved choices. Optional chronicle detail can retain voice and texture; the summary does not fabricate complete biographies or reveal sealed truths. |

### Combinations and changes of life

Illustrative trajectories, not assigned campaigns: an apprentice becomes an independent artisan, then a patron who funds other makers; a courier becomes a route expert and expedition organizer; an injured fighter turns to instruction or treatment while retaining their learned expertise; a quiet resident discovers a research interest and later returns home; an unusual embodied life uses willing intermediaries to take part in trade or politics. Each change depends on actual means and circumstances, not a class-change token. Keeping the original pursuit, combining it with another and abandoning it are all reasonable variants.

**ACCOUNT FOR NOW:** distinguish world/era, body/source, role/relationships, chosen pursuit, involvement and run-mode policy. Two people in the same profession can play differently on these axes; a label should not select an entire life or UI. A coherent world makes particular choices matter without requiring that every world offer every pursuit. Canon developer routes continue to build mechanisms for supported lives rather than define every player's goals.

**ACT NOW, completed:** saved this later idea round in its existing gameplay owner and linked it from IDEA_INDEX, the activity palette and the lead-life guide. The first rule-conversion work is separately reconciled under AD52. No later playstyle proposal has been promoted into a standing design rule.

**LATER / DELEGATE, no dispatch:** when a selected campaign consumer reaches a relevant pursuit, choose one goal, an actual route and one change-of-circumstance case through current AD36/AD43. Suggested capability: one agent with substantive domain/UI judgment; effort is unestimated until that gap is named. No new implementation queue, ordinary-start rollout, engine foundation wave or research acquisition follows. LOTM-first, the selected HP route and current investigation priority retain their owners.

Evidence: original design synthesis over the named existing project owners and the preceding AC/SI/XC/XD findings. No external facts or franchise-source claims are added. Current runtime, all-world viability, retention rules, pacing and human play feel remain unverified. This is saved design work, not implemented gameplay.

## Long play, interacting worlds and quest ecology, 2026-11-04

Request: “More to consider for long term gameplay and different playstyles, especially how they interact across worlds? Expand on the ideas and subtle interactions, then save and reconcile accordingly. The play length doesnt have to be short, proto23 and yair is so long after all, consider other stuff and more? Quests? other stuff?” Weibao also asked to reconcile because these topics had been considered before. [Direction and length clarification](../USER_VISION.md#long-play-cross-world-pursuits-and-quests-2026-11-04). Specific new designs below are **proposals under AD32**, subsequent to AD52's bounded rule adoption.

### Reuse and the length distinction

This extends LPS1–LPS14 and LPI1–LPI8 rather than replacing them. Earlier coverage already includes O1–O3 moment/session/life loops and C1–C12; [procedural-story A6, E1/E5, N1/N2 and Q1–Q4](../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md); [P12 S1/S3–S7](../gm/dispatch/procgen-2026-10-13/p12/STRUCTURES.md), [M1–M18](../gm/dispatch/procgen-2026-10-13/p12/MORE.md) and the [P12 contract](../gm/dispatch/procgen-2026-10-13/p12/CONTRACT.md); [N1 real-need requests](../gm/dispatch/procgen-2026-10-13/p11/REQUESTS_AND_MARKETS.md#n1-generated-requests-and-quests-from-actual-needs); and [multiverse composition](../worlds/MULTIVERSE_STRUCTURES.md#three-independent-decisions). These are existing design owners with mixed historical implementation evidence, not new verified APIs. [YAIR-format D1/D2](../YAIR_FORMAT_AND_STORY_DELIVERY_2026-10-14.md) already recommends a continuing situated life. The Nov 3 [cross-world detail audit](../audits/CROSS_WORLD_DETAIL_PASS_2026-11-03.md) and [round-2 matrix](../audits/CROSS_WORLD_DETAIL_ROUND2_MATRIX_2026-11-03.md) record document coverage and source gaps, not runtime portability.

The user's length clarification is direction. Compression reduces repeated handling; it does not require fast mastery, brief visits, short campaigns or abandonment of sustained growth. Distinguish real play time, in-world time, routine granularity, opportunity windows and implementation slice size. A bounded delivery slice can join a very long campaign. A player can enjoy staying in one setting for a long time, taking a long journey, gradually mastering a pursuit, returning to old places or maintaining a comfortable routine. No measured Proto23/YAIR duration or target number of hours is asserted here; their long play is the user's motivating comparison, not a new benchmark.

### More gameplay possibilities and interactions

These are extensions of existing families, not twenty new subsystems. A world/life need not support every possibility. The final column names the owner/consumer and a distinguishing case for future selected work, not an extra universal gate.

| ID / earlier family | New long-term angle | Interaction, owner and distinguishing case |
|---|---|---|
| LPI9 / O2/O3, LPI1/3 | **Long residence with several horizons.** Personal work, seasonal opportunities, long study and campaign arcs can coexist at different scales. | Existing local clocks, growth and calendar → present activities and return summary. Compress repeated work while retaining meaningful windows; neither a short session nor an early arc's completion implies the world is finished. |
| LPI10 / LPS1/2/3/4, LPI5 | **An expedition has several uses.** Explore a route, collect a scholar's sample, fill a client's order and acquire a new craft method on one journey. | Actual cargo, agreements, knowledge and time → each pursuit's result consumer. One object can have several uses, but incompatible delivery promises remain a real conflict. One trip need not become four independent fetch loops. |
| LPI11 / LPS3/5/7, LPI2/5 | **Expert in one place, learner in another.** Transferable understanding can be powerful while an unfamiliar substrate, bodily faculty or institution demands specific learning. | Method/source/body/world law → learning and useful action. Test genuine reuse and a specific incompatibility. Do not reset all expertise on entry or force a new-school grind where the old means already work. |
| LPI12 / LPS4/6, LPI5 | **Cross-world supply and a reason to maintain local alternatives.** Portals, carriers, trusted specialists and local materials can sustain operations. | Directional compatibility, production, custody, transport and demand → receiving operation. A blocked route affects tasks that actually depend on it; it need not destroy independent local stock or invent export taxes. Easy travel can make trade easy when its means support that. |
| LPI13 / LPS6/8, LPI3/4 | **Several homes or operations with different roles.** One setting is a home, another a research base, another a commercial relationship. | Property, staff, obligations and actual absence clocks → continuing services/current eligibility. A dormant world, active world and differently flowing pocket realm need distinct policies. No invisible universal deterioration charges merely because the player left. |
| LPI14 / LPS7/8/12, LPI5/7 | **Recognition travels through channels.** A deed, title, technique or reputation can arrive abroad through witnesses, documents, students or trade. | Actual identity, credentials, messages and local interpreters → trust, access and offers. A foreign title can be useful evidence without granting the same office. Neither universal fame nor universal amnesia is the default. |
| LPI15 / LPS1/7/10/13, LPI3/5 | **Companions have reasons to travel or stay.** Shared expeditions, remote help, visits and separate careers can coexist. | Willingness, source/body compatibility, communication, means and obligations → party contribution and reunion. A friend may welcome the player home while declining migration; communication can work without remote custody or full control. |
| LPI16 / LPS1/2/8/12, LPI6 | **Cross-world stakes can genuinely conflict.** A resource useful at home is sacred, privately owned or dangerous to export elsewhere, where the world establishes those facts. | Local claims, actor motives, known evidence and supported effects → negotiation, exchange, theft, conflict or abstention. Different values can produce several reasonable plans. Social consequences need their actual observers and agents, not a universal morality score. |
| LPI17 / LPS2/3/7/13, LPI5/7 | **Translation, diffusion and reinvention.** A transported book or trained student can support a new local practice. | Language, instructional fidelity, materials, teaching and local support → an actual learner or production method. Copying a name is not copying a function. Under suitable means, a simpler adaptation can outperform an elaborate imported procedure. |
| LPI18 / LPS5/6/14, LPI2 | **Enjoy earned abundance.** Wealth, mastery, agelessness or automation can make an established life easy and reliable. | Actual power/economy/care owners → remaining choices. Let the player rest, collect, explore, create, help or dominate where supported. No automatic enemy scaling, disaster targeting or new upkeep restores an agent-desired challenge. Harder goals can be optional invitations. |
| LPI19 / LPS2/9/11, LPI5/8 | **Parallel worlds are comparisons with distinct histories.** Similar people, sites or artifacts can differ through their actual branch and local state. | World/instance/person/provenance bindings → claims, knowledge and quest evidence. One branch's promise, victim or object does not silently satisfy another's. Correspondence may inform a hypothesis without proving identity or granting omniscient comparison. |
| LPI20 / LPS1/2/6, LPI3/5 | **Temporal opportunities without accidental time tricks.** A long retreat, visit, return or loop can change what is available. | Named world/body/source clocks and explicit retention rules → schedules, growth, memories and pending work. Do not infer a reset or years of free output from a frozen visit or genre label. Genuine temporal means can be powerful when actually established. |
| LPI21 / LPS3/6/7/8, LPI4/7 | **Institutions outlive their founding quest.** Schools, guilds, workshops and refuges gain stories through people using them. | Actual leadership, staff, funding, facilities and independent goals → services, disputes, apprenticeships and succession. A founder can delegate, stay or withdraw. The institution's interests need not remain identical to the founder's forever. |
| LPI22 / LPS8/12/14, LPI6 | **Several identities, memberships and loyalties.** A character can have public roles, private methods and incompatible obligations across settings. | Person/body/alias, observers, actual terms and enforcement → access and response. A disguise can help with recognition without transferring legal ownership, memories or a promised service; an office can change without deleting learned competence. |
| LPI23 / LPS2/3/11/14, LPI1/7 | **Discovery need not mean conquest.** Mapping, restoring, collecting, composing, celebrating, preserving or teaching can supply long pursuits. | Actual objects, places, creative works, knowledge and interested people → useful outcome or chosen personal satisfaction. World-changing utility is one reason to care; beauty, curiosity and attachment can also justify sustained play. A collection need not secretly unlock combat progression. |
| LPI24 / LPS1–LPS14, LPI1/6 | **Quest webs instead of one global ladder.** Personal undertakings, client work, local arcs and world-specific duties can intersect. | P12 coordination and N1 terms over real mechanisms → actual outcomes and journal. Finishing, declining, abandoning, renegotiating and leaving an offer unaccepted mean different things. AD24 supplies no compulsory global main quest. |
| LPI25 / LPS1/3/7/8/12, LPI1/6 | **Several approaches and mixed outcomes.** One objective may be served by a craft, bargain, diagnosis, passage, ally or decisive force. | Goal and terms plus actual means → result recognition and recipient response. Working mechanisms decide possibility; a payer's narrow demand can differ from a broader humanitarian or personal goal. Avoid writing a separate complete campaign tree per profession. |
| LPI26 / LPS6/7/10/14, LPI7/8 | **Recurring cast, festivals and quiet continuity.** Familiar people, shared rituals, completed places and remembered contributions make time feel lived. | Relevant calendar, relationship history, knowledge and local events → fitting encounters and reports. A reunion can be pleasant without a catastrophe. Frequency and memory detail are dials; a fully simulated social population is not required. |
| LPI27 / LPS1–LPS14, C1/C12 | **Mechanical variety across a long campaign.** New conditions can alter goals, methods, dependencies, participants, resources or stakes. | P12 M16 and world-qualified content → meaningful action/outcome differences. Rewording the same delivery is presentation variety, not another mechanic. Repetition can still be comfortable and productive; novelty need not invalidate an old routine or become a quota. |
| LPI28 / LPS1–LPS14, LPI4/6/8 | **Local closure and a continuing life.** Complete an arc, settle with someone, return to a home, retire a goal or depart for a new pursuit. | P12 M14/S5 plus persistent state → aftermath and next supported choices. A finite quest can close honestly within an open life. A future unimplemented region remains an explicit development boundary, not a forced death, wiped history or fictional permanent prohibition. |

### Quest depth lives in the existing P12 owner

The [M19–M30 extension](../gm/dispatch/procgen-2026-10-13/p12/MORE.md#m19m30-long-play-and-quests-across-worlds-2026-11-04) adds personal undertakings, cross-world settlement, shared contributions, recurring services, institutional change, alternative approaches, aging opportunities, aftermath, player-issued work, proof/custody distinctions, local quest authority and powerful/refusing/opposing participants. It extends existing S1/S3 forms and M1–M18 rather than introduce another quest registry.

A useful quest can be a promise, job, personal ambition, discovered problem, investigation, relationship development, communal undertaking, expedition or a genuinely supernatural assignment. Many actions need no quest wrapper at all. Ordinary rewards need a payer or actual result; a System can supply extraordinary rewards through that world's real mechanism. Secret objectives, uncertain client accounts and mistaken reports remain possible. A known quest log describes the character's received information and commitments rather than certifying all world truth.

### Worked combinations: different playstyles in the same cross-world events

All six cases are authored illustrations, not source-franchise claims or implementation packets.

| Combination | What makes it worth playing for a long time | Subtle interaction to keep |
|---|---|---|
| Artisan + explorer + merchant | Learn a foreign process, locate a suitable material, make a local adaptation, establish a dependable supply and later attempt a signature work. | Distinguish a sample, repeatable source, permission, recipe understanding, production capacity and demand. A working local substitute can remove the need for further expeditions. |
| Healer + researcher + patron | Help a particular person, seek a foreign treatment, fund controlled work, train a local practitioner and keep a clinic useful. | Treatment evidence, patient willingness, compatibility, instructions, supply and delivery are separate. Improvement need not mean a complete cure; successful teaching can let the player leave without continued dependence. |
| Adventurer + diplomat + outlaw | Gain passage, broker a tense exchange, maintain a cover or steal a needed resource, then decide whom to trust with the result. | Perceived identity is observer-scoped; custody and obligations do not follow a changed name automatically. Different groups can hold incompatible but understandable accounts of the same deed. |
| Scholar + specialist + wanderer | Stay in a setting for sustained study, compare methods elsewhere, revisit old teachers and eventually publish or conceal a useful synthesis. | New theory, remembered procedure, trained control, active source and credentials differ. Prior mastery should make genuine contributions rather than vanish on world entry; established friendship need not decay to create fresh content. |
| Steward + organizer + quiet resident | Build a dependable home or operation, support other people's ambitions, keep a familiar social world and take occasional journeys by choice. | The home can remain an enjoyable achievement. Actual staff/terms handle supported work during absence; an unimplemented absence model does not charge losses or fabricate years of growth. |
| Collector + unusual body + several intermediaries | Preserve and study meaningful objects or organisms, negotiate care, commission distant work and develop ways of participating in the wider world. | A rooted or unusual body can have deep play without routine physical travel. Sensing, communication, delegated knowledge, ownership, reach and agency retain their actual carriers. A willing intermediary is not a remotely controlled duplicate. |

### Reconciliation delta and dispositions

This round maps named prior material rather than declaring earlier ideas newly invented or implemented. Later authority is limited to the user's long-play clarification; new mechanics/examples remain proposals.

| Selected prior ID / owner | Classification and current evidence | Disposition / actual consumer or remaining supplier |
|---|---|---|
| O1–O3, LPI1–LPI8 and LPS1–LPS14 / this owner | Compatible expansion, design text read; short active sessions are one rhythm, not a total-play limit | Extend with LPI9–LPI28 and the worked combinations. No old career examples, loop options or ordinary-life scope are deleted. |
| ACR1 / activity rules and AD52 / RULES_INDEX | Clarification from latest user wording, not a newly discovered code defect | Record that convenience/bounded slices impose no short campaign target; sync USER_VISION, digest and one PROJECT standing line. No target hours, universal waits or new milestone. |
| P12 S1/S3–S7, CONTRACT, M1–M18 / quest owners | Reuse, historical design and source inspection remain dated | Add M19–M30 applications in MORE. Existing runtime capability is not re-audited; N1, domain, clock, identity and result owners remain the actual suppliers. |
| Procedural-story A6/E1/E5/N1/N2/Q1–Q4 | Compatible earlier variants, proposals not a present world-wide story API | Preserve shared thread/history intent, ambition, standing policy, seasonal/life rhythm and long-time summary where supported. No world skips or complete future prophecy are inferred from a seed or a proposed schema. |
| Multiverse composition's three independent decisions | Existing scope distinction, not a reason to make the entire campaign short | Cosmology, delivered scope and persistence stay separate. Quest length, total play, world scale and local clocks are additional independent choices. |
| Cross-world-detail audit / round-2 matrix | Evidence boundary: document/source coverage, not tested gameplay portability | Reuse its lenses for bodily needs, credentials, time, testimony and succession without changing its scores or claiming all-world runtime coverage. |
| YAIR-format D1/D2 and earlier session-size examples | Compatible presentation/situated-life proposals | Keep their continuing-life and causal-situation ideas; concise screens and individual slices impose no campaign-length ceiling. No new timing comparison of Proto23/YAIR was performed. |

**ACT NOW, completed:** extended the gameplay owner and existing quest owner; recorded the user's length direction and propagated it to ACR1/AD52, digest and the existing PROJECT priority; linked both rounds from IDEA_INDEX; preserved the previous PROJECT line and ACR1/AD52 statements in the project log. All existing IDs and historical evidence retain their scope. No broad adoption of LPS/LPI/M proposals.

**ACCOUNT FOR NOW:** LPI9–LPI28, the six worked combinations and M19–M30 are design options and interacting consequences. Choose applicable pieces per world/life. Long play can arise from depth, sustained growth, projects, relationships, repeated enjoyable work, revisits and genuinely new choices; there is no universal requirement to shorten it or pad it. Cross-world power and trade can be easy or hard according to their real means and laws.

**LATER / DELEGATE, no dispatch:** when a selected world consumer needs quest or cross-world follow-through, choose its actual objective, relevant terms, supported means and one changed-condition case through the existing AD36/AD43 floor. Suggested capability: one domain-capable implementation agent; effort unestimated until the named gap is known. Source reading triggers on a named source question. No new world sequence, quest-engine rewrite, runtime generation project, all-world campaign or ordinary-start rollout is selected here.

Residue: per-world source qualification, actual current producer/state/result wiring, pacing and total-length targets, generic generated quests, offline/absence policy implementation, source-game timing benchmarks and human play feel. This round read saved project owners; it read no new book chapters, acquired nothing, launched no agents and ran no gameplay/build/browser/save checks. Design text and rule clarification are not playable delivery. Documentation checks and preservation results are recorded in the project log at close.
