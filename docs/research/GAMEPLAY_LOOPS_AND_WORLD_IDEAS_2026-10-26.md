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
