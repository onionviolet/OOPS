# AA2 extensions: caravans and voyages that return with a story

2026-10-14. **PROPOSAL ONLY.** Extend [root AA2 and J3](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md), [P8 LOGISTICS](../p8/LOGISTICS.md) and [P21 ventures J3.1-J3.9](../p21/VENTURES.md). P21 owns enterprise finance, P8 cargo/supply/condition, P27 mission progression and crew incident joins. P21's capital/shipping and R15 evidence remain with its owner; its draft J3.9 already requires returned accounts about actual committed projects. AA2 below adds crew-stage, itinerary and stop/return consumers. Nothing here runs offline expeditions today.

## AA2.1: captain, participant and sponsor are different roles

The player can accompany a caravan, command a vessel, pay for a crew-led trip, join one leg, cooperate with another group, buy a report, provide supplies or simply continue ordinary local work. These roles may combine. A sponsored voyage should not occupy the hero's body; a personally led voyage does. Crew still own their identities, willingness, bodies, gear, wages and outside commitments. A roster name is insufficient to reserve a real participant.

Existing `src/expedition_content.js:79-150` has authored purchase/preparation/survey/departure commands with real item/money/capability effects and duration modifiers. Its `unsurveyed` predicate at line 33 and nonrepeatable departure at lines 135-137 are historical bounded content, not permission for universal once expeditions. `src/expedition_ui.js:74` describes game-minute advancement including travel and sleep. `src/main.js:2164` blocks ordinary travel when an expedition occupies the player. This establishes useful host seams, not a generated autonomous caravan, vessel or remote crew controller.

## AA2.2: staged mission and generation envelope

Proposed stages: recruiting/preparing, outbound leg, site operation, return leg, unloading/report, then settled or interrupted. Aborted, delayed, rescued, diverted and partially successful are distinct outcomes. Bind an authored itinerary and destination/site revision, departure window, objective, leader/crew refs, capacities and role assignments, actual reserved stock/funds, known authority, risk/stop rules, clock binding, current stage/boundary, cargo changes, incidents, crew observations, settlement refs and returned report edition. No numeric schema is reserved here.

| Extension | Generated content | Actual supported consequence |
|---|---|---|
| AA2.2a caravan | Repair, toll dispute, escort offer, cargo claim, buyer delay or shared shelter tied to the current load and road | A repaired vehicle, changed legal access, paid service, different arrival minute or documented ownership; no geometry creation. |
| AA2.2b voyage | Weather window, equipment failure, watch handover, navigation evidence, passenger need or port paperwork | A real delay, repair, authorized port service, better known forecast or cargo delivery; a new island is an authored-world decision, never a random map node. |
| AA2.2c survey/research | Missing measurement, conflicting testimony, broken sample container or qualified local informant | Acquired dated observations, preserved sample or an honest incomplete report; no magical knowledge of an unseen sealed truth. |
| AA2.2d rescue/relief | Known distress, actual transport capacity, willing helpers and reachable affected people | Distinct rescued/transferred people and delivered aid; no arbitrary casualties chosen to make a tragic returned log. |
| AA2.2e crew story | Shared task, competing expectations, actual error, apology, skill demonstration or compatible personal goal | Changed directed trust, a supported learned method, grievance, promotion or voluntary next-job decision. P19 owns the social state. |

The mission can choose supported next stages dynamically from conditions. More advanced itinerary replanning uses existing authored alternatives, with real additional duration/cost and approval policy. It does not narrate an invented destination as though a route exists. Successful veterans can remove routine obstacles through earned means; not every trip needs a disaster.

## AA2.3: the returned log is an account, not the world state

Retain a small factual stage ledger: committed time/place/object/people refs, actual applied deltas, incident/resolution IDs, relevant witness coverage, remaining commitments, pending claims, draws and content revisions. Bind a log edition to those facts through [P14 K1](../p14/CONTRACT.md), using [P15 T2/V3](../p15/RUNTIME_TEXT.md) and [dialogue voice](../p15/DIALOGUE.md). Captain, quartermaster and passenger can report differently. Their disagreements are claims over the same actual mission, not three alternate histories.

At return show cargo/result, unresolved matters and selected crew accounts with provenance. Offer a short summary and expandable stage ledger via P25's presentation lane. Reading never settles cargo or pays profit; unloading/settlement does so through actual owners. A remote letter can precede return if P11's actual channel permits it. Otherwise the sponsor knows departure terms and last received report, not each distant live incident.

Example, original proposal: a funded measuring trip reserves one container and a hired observer. Damaged packing forces return with an intact instrument but incomplete sample. The instrument's original owner receives it, the agreed wage pays under the contract, and an honest report opens a smaller follow-up commission using what was measured. A partial result can create useful content without automatically inventing profit or an angry crew.

## AA2.4: predictable idle work and reversible interrupts

Queue supported routine stages from played time with declared reserve and overflow policies. Safe autonomous responses can include using a preallocated spare, staying at an already paid berth, sheltering, or returning at a known shortfall. Unknown risk, changed toll, fresh sacrifice and unsupported lethal danger wait for a decision. A severe-risk expedition remains an available later profile under explicit world/life rules; P27 does not quietly enable player true death.

Closing the tab or changing branches cannot kill crew, erase cargo, advance a resting world, make a crew member defect or expire player agency. First proof uses the existing played clock. Offline catch-up, unequal port calendars and offscreen parallel missions require the selected T4/OT adapter. A historical expedition due date can be reported honestly, but wall-clock absence is not a punitive cause.

On cancel or interruption settle consumed work, remaining escrow, current cargo location, loan returns, earned wages and participant release. If a ship cannot teleport home, cancellation changes objective to supported return/rescue rather than instantly refunding spent cargo. If an import lacks its pinned mission pack, preserve/reject safely according to the compatibility decision; never rerun the whole voyage to reconstruct its log. Capacity bounds apply to storage/CPU, not a once-per-life venture limit.

## AA2.5: first proof and growing options

AA2-A: one sponsored trip over authored nodes with a real employer, two willing supported participants, one declared cargo lot and a nonlethal repair/delay. Hero remains free for ordinary work. At return compare actual cargo/wage/condition settlement with two observer-scoped accounts and a useful repeat commission. A single authored contact is enough if P4 is unintegrated; generated cast is an optional extension.

Future gates, all OPEN: overlapping crew reservations rejected; inadequate funds/stock rejected before draws; bulk/step timing parity; meaningful preparation changes a supported outcome; stop/cancel/return retain real custody; no double reward on repeated report reads; remote visibility follows communication; pending/outbound/return/settled Save/reload and literal-file Import preserve identities, ledger, next draws and exact accounts; old absent owner unchanged; rebuilt desktop crew/cargo/result readability. Larger reachable options: fleet cooperation, seasons-long journeys with source-qualified calendars, expeditions captained by a former student, insurance/service contracts through P21, repeat scientific surveys and source-qualified magical passage through P9/P10.
