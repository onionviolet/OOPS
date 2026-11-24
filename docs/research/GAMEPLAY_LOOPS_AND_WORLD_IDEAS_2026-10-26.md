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

## Run shapes: short identities, death as a door and bounded careers, 2026-11-22

Weibao asked about playthrough styles beyond the standard Proto23/YAIR shape: "something where identities are more subject to change? death is death and then death leads to different identities and possibilities", or "being a normal soldier, working to become a space marine and then participating in a war and dying", and whether implementation difficulty scales out of reach. Follow-ups: "consider the different gameplay loop that would happen and the stuff required to make it work and actually fun with identities being less long term?" and "Or if we should consider making this idea make more sense?" **Everything below is a proposal under AD32.** Foundations first (2026-11-11) keeps its order; nothing here is queued.

### A second axis, not more pursuits

LPS1–LPS14 say what a life pursues. This round is about **run shape**: how long one identity lasts, what death does, and what carries the player's investment across identities. The two axes combine (a short-lived courier, a bounded soldier career, a chain of scholars). The rules already cover most pieces: links between starts (LK1–LK10, LG1–LG2 in [intro flow](../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md#lk-kinds-of-link-between-starts)), run mode as a property of the life (STY4, STY32), run-ending threats with a continuation (AD50), the lives list (UR87), [selves and echoes](../SELVES_AND_ECHOES.md), and heirs as a start option rather than main line (2026-10-30).

| ID | Shape | Long thread (what persists) | Existing basis |
|---|---|---|---|
| LRS1 | **Open life** (Proto23/YAIR today): one identity, open-ended, forgiving recovery | The character | Current default |
| LRS2 | **Mortal arc:** one life with a chosen ending condition (a war, an expedition, an age); ends with an epilogue | The told story and its traces | STY4 run mode, AD50 announced end, north star "death and remains" |
| LRS3 | **Chain of lives in one world:** death hands play to a new identity in the same continuing world | The world, plus whatever the link carries | LK1/LK2/LK6, LG1, `die:` + `fresh`/`branch:` commands |
| LRS4 | **Soul chain:** the carrier is a soul or memory, so knowledge (and perhaps the cheat) passes; body and standing do not | The soul's knowledge | LK5 echo, LK9 loop, MoL restart, SELVES_AND_ECHOES |
| LRS5 | **Unit as protagonist:** a regiment, crew, sect or household is the long-lived character; members die and the seat moves within it | The group, its record and reputation | LK1 successor in office, CBD144 per-seat war report |
| LRS6 | **Many faces, one life:** identity changes without death (aliases, personas, burned covers), each with its own reputation and ties | The person behind the masks | LPS12, Klein's personas in LOTM canon |
| LRS7 | **Anthology of a place or object** (unusual): play whoever holds the inn, or whoever finds the sword, across eras | The place or the object | LK7, LK8 |

### The loop when identities are short

With LRS1 the reward is the slow growth of one person. Shorten the identity and the reward has to move to the long thread, or each death just deletes progress. The loop becomes:

1. **Choose the next identity** from real people in the world (a draft of two or three locals, each with circumstances, ties and a reason to act). This choice is the new heart of the game.
2. **Live a dense, compressed life.** Routine early-life work is abstracted (ACR rules); the start lands where decisions begin (advanced and inherited starts, WER).
3. **Push a goal that outlives you:** win the war, raise the regiment's name, finish the research, keep the inn open.
4. **Die by a readable cause** that was announced and avoidable (AD50), never a hidden roll.
5. **See the consequences:** an epitaph from the log, who mourns, what the war report says about you, what your death changed.
6. **Meet your own traces in the next life:** the grave, the notes you left, the old squadmate now a sergeant, the debt someone still owes.

### What it needs to be fun

| ID | Requirement | Why | Failure if missing |
|---|---|---|---|
| F1 | **The long thread visibly grows** across lives (world changes, group record, soul knowledge) | Investment needs a home | Every death feels like a wipe |
| F2 | **The early game is short on repeat** | Idle pacing plus repeated starts equals repeated grind | Players stop dying on purpose and stop playing |
| F3 | **Death is legible and forewarned** (AD50, recovery strictness as a separate dial) | Loss is accepted when it was a gamble you saw | Feels arbitrary, save-scumming |
| F4 | **Each identity plays differently** (body, standing, ties, means) | Novelty pays for repetition | A reskin of the last life |
| F5 | **Traces are specific and few** (LPI7) | A named sergeant beats a generic +5% | Bookkeeping instead of story |
| F6 | **Carry rules resist exploits** (LG1 declares what passes, LG2 costs) | If dying is the strongest move, players cycle deaths | Suicide farming |
| F7 | **The UI does not reset per life** (UR87 lives list, one grammar) | Relearning screens every life is friction | Each new body feels like a new game install |

### What it costs

Verified in `src/continuation_state.js` `restore`: switching lives copies the target life's snapshot wholesale and carries over only `cheats`, preferences, `world_packs` (OD5) and compatible mastery. Household, `npc_lives`, `generated_people`, village and work records come from the snapshot. The commands `die:`, `restart:`, `fresh`, `branch:`, `resume:` and the deaths ledger exist.

| ID | Tier | What | Cost |
|---|---|---|---|
| R1 | Exists | Loop restart (MoL), fresh start, branch to another world after a final death | Wiring and UI only |
| R2 | Low (inferred) | LRS6 personas inside one life: reputation and ties keyed by identity | One owner for "who they think you are"; no save split |
| R3 | Medium | LRS2 mortal arc: an ending condition as a run-mode property, an epilogue report; a war told per seat (CBC40, CBD144, FK9 preset) | New report and end condition; no new engine |
| R4 | High | LRS3/LRS4/LRS5 in the *same continuing* world: the next identity meets the dead one's house, friends and grave | Split save state into world-owned and life-owned slices, extending what OD5 did for `world_packs`. This is the real cost, and it is a foundation question, not a content one |
| R5 | Highest | A war you fight through as a simulated campaign with a squad of allies | Ally choosers (sizing audit G7), battles beyond the 400-meeting contest budget (CFC16), province-scale war, which lives in the province-war repo |

So difficulty scales with **how much of the world must outlive the character**, not with how dramatic the premise is. The soldier-to-augmented-trooper-to-war arc is R3 if the war is told and the life ends with an epilogue, and R5 only if every battle is simulated.

### Making the idea make more sense

Recommended framing: **identities can be short; one thread must be long, and the run declares which one.** Pick the thread at start (world, soul, group, place, mask), and LG1 follows from it: a soul thread carries knowledge, a group thread carries record and standing, a world thread carries only what was left behind. This also answers the 2026-10-30 cheat rule cleanly: the cheat follows whoever is played unless the declared thread is the soul that holds it.

The soldier idea reads best as LRS5 (the regiment is the protagonist, troopers come and go) or LRS2 (one trooper's career with a known end). As LRS3 it inherits R4's cost for little extra fun. Build it in an original military-sci-fi world rather than a recreation of an existing franchise's marines.

**ACCOUNT FOR NOW:** any future save work on continuation should keep world-owned versus life-owned state in mind; R4 is cheaper if new slices declare their owner from the start (one line per slice in SAVES.md).

**LATER / DELEGATE, no dispatch:** cheapest proofs, in order: LRS2 as a bounded run in an existing world with an epilogue (R3), then LRS6 personas in the LOTM lead life (R2), which canon already supports. Suggested capability: one sonnet-level agent with design judgment; done check is a rebuilt browser run that ends a life and shows the epilogue and its traces.

**Open decision (Q1):** when a short identity dies, should the next one keep the cheat and knowledge (soul thread), or start with only what the world remembers (world thread)? This picks between LRS4 and LRS3 and sets what R4 must carry.

Same-person restarts (LK9, the MoL shape) are worked through in [same-person loops](DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md#same-person-same-scenario-the-loop-as-a-run-shape-2026-11-22-proposals-ad32).

Evidence: synthesis over the named owners plus one code read of `restore`. Fun, pacing and exploit resistance are unverified until played.

## When the world happens to you: external forces and attachment to identity, 2026-11-22

Weibao, answering Q2 (knowledge-only or knowledge-plus-skill loops): "Guess it depends on the situation and what makes sense? What gives most future possibility and more?" Then: "have a life be majorly effectable by external events? like conscripted to do x or why? how attached to the specific identity we are playing under we should be and more? more to consider?" Proposals under AD32 except where noted; AD56 lets ideas that widen play act as working defaults.

### Q1 and Q2 answered: the carrier decides

His answer is recorded as direction: no global choice. What carries across a death or a loop follows the actual carrier (AD6 means decide; SLR20 already says skill carry follows the faculty's carrier and clock). Knowledge carries whenever the mind or soul carries; trained skill carries only when it lives in that carrier (a soul technique, a memory of method) and not in the body; the cheat follows whoever holds its binding. This keeps every option open per world, which is the most future possibility, and it answers both Q1 (soul or world thread) and Q2 (knowledge or skill) without a new rule.

### A life the world can move

Today most lives are driven from inside: the player picks the pursuit. The idea is the reverse case, where a large outside event redirects the life. Existing basis: threats grow through their own causes (USER_VISION), non-lore seats meet big events where their causes hold (STY32), run-ending threats are announced and usable (AD50), war is settled by terms with the player often behind the line (CBC40), failures become new circumstances (LPI6). Conscription itself is only an entry kind so far (WC3 in [intro flow](../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md)).

| ID | Force | What it takes | What it can open |
|---|---|---|---|
| EXF1 | **Levy or conscription** | Time, place, choice of work | Training, a new cast, pay, rank, the soldier arc |
| EXF2 | **Plague, quarantine** | Movement, trade, people | Healing work, scarcity trades, a closed town as a dense loop |
| EXF3 | **Famine or price shock** | Savings, food, margins | Smuggling, new crops, patrons who owe you |
| EXF4 | **Eviction, enclosure, a landlord's sale** | Home, land | Migration, a new district, a claim to fight |
| EXF5 | **Regime change, purge, new law** | Standing, safety, papers | New offices, hidden identities (LRS6), exile |
| EXF6 | **Arrest or false accusation** | Freedom, reputation | Prison life, investigation, debts to whoever frees you |
| EXF7 | **Capture or bondage** | Almost everything | Escape, a new skill set, a long climb (Kenshi's enslaved start) |
| EXF8 | **Arranged marriage, adoption, apprenticeship by decision of others** | Choice of household | A family with its own goals |
| EXF9 | **Summons, recruitment test, a sect or church choosing you** | The old life | A power path (LOTM summons rows already exist) |
| EXF10 | **Windfall, inheritance, a patron's notice** (positive) | Obscurity, sometimes safety | Means, envy, obligations |
| EXF11 | **The protagonist's story passing through** | Whatever their plot breaks | Meeting the book from the side (STY32) |

### What makes it fun instead of punishing

| ID | Requirement | Reason |
|---|---|---|
| EXF12 | **Forewarned in steps:** rumour, notice, enforcement, each with lead time | A shock you saw coming is a decision; one you didn't is a punishment (AD50) |
| EXF13 | **Exits with prices, not a forced cutscene:** comply, qualify for an exemption, pay or send a substitute, hide, flee, change identity, fight it | Agency inside constraint is the game. History supplies real exits: the US 1863 draft allowed a substitute or a $300 commutation fee; British impressment drove sailors to hide or carry protection papers (general knowledge, not re-checked this session) |
| EXF14 | **Reach has a cause:** the levy takes men of an age in this district, the purge takes this faction | Being chosen should be explainable and sometimes avoidable by who you are or where you live |
| EXF15 | **The forced situation is itself playable:** barracks life, a quarantined street, a prison, each a dense small world | The loss of the old life pays for itself only if the new one has play |
| EXF16 | **It leaves marks, not just a gap:** scars, veteran ties, pensions, trauma, a grudge, skills | Marks make the identity feel lived (LPI7) |
| EXF17 | **Cadence through the storyteller:** a few large forces per life, not constant disruption | Too frequent is chaos; too rare and it never matters |
| EXF18 | **A world-pressure dial**, separate from danger and recovery strictness | USER_VISION already separates danger from recovery; how often the world overrides your plans is a third axis |

### Focused case: conscription

1. **Day -14:** tavern talk of a war; prices for boots rise. The rumour reads the real war state.
2. **Day -7:** a posted levy with criteria (age, district, exemptions for clergy, guild masters, sole earners).
3. **Choices:** comply; get an exemption through an institution (`institution_access.js`, the papers you hold); pay or find a substitute; marry, ordain or take a protected job; hide or flee into a new identity (LRS6); bribe the clerk.
4. **In service:** the regiment's routine runs as duties (`duties_domain.js` already holds cycle-based duties, Klein's weekly claim is the first); rank and standing through the institution store and faction rank; deployment and battle mostly told per seat (CBC40, CBD144), with chosen moments played.
5. **Exit:** discharge, desertion, injury, capture (EXF7), death (a mortal arc, LRS2), or promotion into a career the player now wants. The augmented-trooper path from the run-shapes round fits here: an offer made inside service, not a start menu choice.

Cost reading: no new engine for the levy itself. It needs a world-level event with eligibility over people (who the levy reaches, which reads `generated_people`/`npc_lives`), a forewarning chain, exits as ordinary actions and a regiment as an institution with duties. The expensive parts are the same as before: simulated battles (R5) and a world that remembers you after death (R4).

### How attached to the identity should we be

Recommended view: **attach to the person, never protect them.** Attachment comes from history and ties, not from permanence or control. A character who was conscripted, survived and came home changed is more the player's own than one who chose every step. So external forces increase attachment when they are survivable, forewarned and leave marks.

| ID | Attachment level | Fits |
|---|---|---|
| EXF19 | **Deep:** one identity is the game; forces change it but rarely end it (forgiving default) | LRS1, book protagonists |
| EXF20 | **Held loosely:** the person matters while alive; a thread outlives them | LRS3–LRS5, mortal arcs |
| EXF21 | **Many faces:** attachment to the self behind changing names | LRS6, Klein's personas |
| EXF22 | **None to the body, all to the knowledge** | Loops (SPL1) |

The run declares its level at start, like the long thread. The UI should keep what makes this person them visible (name, marks, ties, what they want), so a redirected life still reads as the same person.

### Prior art (general knowledge, not re-read this session)

Crusader Kings 3 and Pentiment (lives shaped over decades by events outside one person's control); This War of Mine and Papers, Please (agency inside a crushing situation); Kenshi (start enslaved or broke, climb out); King of Dragon Pass and The Banner Saga (a group pushed by events); BitLife (life events including a draft); RimWorld's storyteller (cadence, already reflected in STY). In fiction: All Quiet on the Western Front, Catch-22, and the Sharpe novels (a conscript's long rise).

**ACCOUNT FOR NOW:** a world event that reaches people by eligibility is the missing piece shared by EXF1–EXF9. It should reuse institutions, duties and the storyteller rather than add a "life event" table.

**LATER / DELEGATE, no dispatch:** when a selected world has a war or plague in its timeline, build one forewarned force with three priced exits and one playable forced situation. Suggested capability: one sonnet-level agent; done check is a rebuilt browser run where the levy notice arrives, one exit is taken and the save round-trips.

**Open decision (Q3):** should large forces be able to override a life by default at a moderate world-pressure level, or stay rare until a run opts in?

## New identities in the same world and timeline without endless authoring, 2026-11-22

Weibao: "how to generate new identities within the same world and same timeline without needing to code everything till infinity?" Proposals under AD32.

**Answer first.** Author the world, not the people. A playable identity is a *composition* of parts the world already has, and the expensive thing is each new **kind** of life (a role with new verbs), never each new **instance**. Grow the verbs and the identity space grows by multiplication.

### What already exists (verified by code read)

- `src/start_records.js` `resolveStart(world, choices, seed)` composes a start from per-axis layers. Each axis can be locked, rolled or hidden; rolls are seeded; a conflicting layer rerolls only its own axes; the result is validated and keeps provenance. This is a combinatorial identity generator, today used for starts.
- `src/seat_profiles.js` has five seats (`be`, `beside`, `follow`, `bystander`, `ordinary`) that scope what a life may do.
- `src/generated_people.js` names and seeds people, but has only three Village traveller templates.
- Rules: people carry detail by tier (WA43), recurring roles are archetypes built once (WA46), every entity sits on a presence rung (WA22), dated whereabouts (WA23), a start enters the random pool only when its content loads, its first action works and its save round-trips (WQ1), the lead's path is not the world (ST13).

### How it works

| ID | Piece | What it does | Authored once per |
|---|---|---|---|
| IDG1 | **Axes of a life** | Place, household, role, age and body, ties, want, pressure, one hook | World (the axis list) |
| IDG2 | **Archetypes, not people** | A clerk, a dockhand, a novice nun: services, schedule, verbs, wages, institution (WA46) | Role, reused by every person in that role |
| IDG3 | **Promote, don't invent** | The next identity is an existing crowd or role-tier person raised to principal tier; missing fields derive from their role, household and place on first look, then freeze (seeded) | Nothing; the person was already there |
| IDG4 | **The timeline supplies the plot** | A new identity meets the world's dated events where their causes reach that person: the levy, the price spike, the protagonist's plot passing through (STY32, EXF) | World events, once |
| IDG5 | **Want, pressure, tie** | Three small draws give the first hour direction: a need (rest, belonging, purpose already exist), an outside pressure from IDG4, a person who matters | Short tables per world |
| IDG6 | **One specific trace** | A debt, an object, a secret, a link to a named person, a scar from last year's fever (npc_lives hardship) | Short tables; history fills the rest |
| IDG7 | **Capability filter** | The draft only offers people whose role's verbs exist at their place (WQ1). Unplayable lives stay NPCs | Nothing; it reads what is built |
| IDG8 | **Canon fence** | Named canon people keep authored records; generated people live in the off-path ring (ST13) and pass the continuity check | Already in place (CTR) |

Arithmetic, as illustration: 30 archetypes × 12 districts × 8 household kinds × age bands × want/pressure/tie draws gives tens of thousands of distinct starts from a few hundred authored rows. The capability filter cuts that to the lives that play, which grows every time a new verb ships.

### Where "infinity" really creeps in

1. **New verbs per role.** A smuggler needs smuggling. Fix: order roles by how many lives one verb set unlocks (a clerk verb set opens every clerk in every district) and keep mechanisms first.
2. **Prose per person.** Fix: life records are lossy and never an authority (`life_record.js`); bios and voice lines can be drafted offline by a local model lane into packs and linted (DWF83 pattern), while mechanics stay deterministic.
3. **Remembering after death.** Continuing the same world after a death still needs the world-owned versus life-owned save split (R4). Generation does not remove that cost.
4. **Sameness.** Combinatorial lives blur when the parts are thin. Fix: few axes with strong differences (body, standing, ties, means) beat many cosmetic ones (F4).

### An unusual option: the world picks the next identity

Instead of a menu, the next identity is whoever your last life touched most: the apprentice you taught, the rival who ruined you, the child you pulled from the river, the clerk who stamped your levy papers (LK6 causal link). It needs no extra authoring (it reads relationships and the life record) and makes each new identity matter. Dial: menu, causal pick, or a draft of three where one is causal.

**ACCOUNT FOR NOW:** extend `resolveStart` toward "resolve a person": axes that read an existing person's fields first and roll only what is missing. That keeps one composition path for starts, successors and promoted NPCs.

**LATER / DELEGATE, no dispatch:** one world (Tingen is the likely first, with the most institutions and archetypes) gets an ordinary-life draft of three promoted locals through the capability filter. Suggested capability: one sonnet-level agent; done check is a rebuilt browser run that offers three locals, plays one through a first action and round-trips the save.
