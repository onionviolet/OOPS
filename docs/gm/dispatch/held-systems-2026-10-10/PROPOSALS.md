# Held systems and enemy cheats: options

All O, K, P, E and T entries below are **INFERRED original design proposals**, not canon, accepted decisions or implemented features. Read [FINDINGS](FINDINGS.md) for source labels and contrary evidence. This offers **eight options and twenty small touches** for later folding into the north star/library. The tables are a design inventory, not a requirement to implement every family. No code or existing owner document changes accompany them.

**Design scope:** one home-world slice at a time; ordinary play remains opt-in and intact. Existing sealed identities/truths are not imported. Scenario roles below are openly described, unassigned placeholders, not newly fixed hidden controllers. A later mysterious version needs a sealed authoring owner outside these public reports.

## O1: Give a held relation several meanings

Instead of one “held system” type, let a world choose relations independently of the cheat family:

| Relation option | What it adds to play | What it does not imply | Source connection |
|---|---|---|---|
| Retained ownership | Borrower executes while another party retains specified control | Owner supplies every unit of fuel or senses every use | F11’s Gu loan |
| Suppression | A person/place blocks selected functions within its reach | Suppressor owns the source or can recall it elsewhere | F9’s localized arena restrictions |
| Operated interface | An operator sets certain offers, tests or readouts | Maker, donor and operator are identical | F5’s divided designer/patron roles |
| Sponsor relationship | The bearer negotiates support and obligations | Every acquired skill is recallable | F7/F13’s distinct grants/terms |
| Shared fragment | A part has local functions and links to other parts | Recovering any part increases charges or authorizes takeover | F1/F10’s incomplete artifacts |
| Institutional tenancy | Services depend on membership and local jurisdiction | Bigger scope confers universal override permissions | F8’s competing institutional authorities |
| Independent source | No external controller exists, or control has genuinely ended | No incentives, personhood or world constraints exist | F4’s lost creator control; F6’s owner gap |

**North-star wording option:** “A system may be held, operated, restrained or supported by another party. Record the particular relation and channel; some systems have none. Discovering an origin does not itself prove present control.” Benefit: a mentor, jailer, borrower and patron can play differently. Cost: several relationships must be represented instead of one label.

## O2: Separate the library definition, actual instance and what anyone knows

The existing card already has grants, backing, terms, stages, observers and UI. The missing part is **who can do what to this actual copy**, and what survives a change. A static `holder` string cannot describe player possession plus NPC ownership plus a place’s suppression simultaneously.

| Proposed field | Meaning / shape | Why it matters |
|---|---|---|
| `definitionId`, `revision`, `variants` | Stable family/card and local variant identity | Two copies can have different histories without silently changing their shared mechanics |
| `instanceId`, `worldId`, `carrierRefs` | Unique copy, current jurisdiction, actual item/body/soul/record/place carriers | No item loot is fabricated by killing a bearer whose power lives elsewhere |
| `bearerRefs` | Actors permitted to execute this instance | One bearer is a possible configuration, not a universal slot cap |
| `relations[]` | `{subjectRef, role, targetRef, permissions, scope, conditions}`; roles can include maker, owner, operator, sealer, donor, custodian, parent | Ownership, storage and execution are distinct; parenthood grants no implicit permissions |
| `influenceChannels[]` | `{relationRef, operation, targetFunction, route, reach, cost, cadence, prerequisites, failure}` | An owner can edit offers without being able to drain fuel or watch thoughts |
| `functionSupport[]` | Per verb/service: carrier, grant, fuel, body, location, authority, persistence requirements | Interface deletion can remove a shop while leaving learned technique/storage |
| `terms[]` | Accepted offer version, obligations, duration, recall rights, debt, termination and contest routes | Shown terms can differ from an observer’s interpretation; no global patron contract |
| `lifecycle` | Explicit local transitions, gates and affected functions | Sealed, active, recalled, severed, matured and destroyed need not be one ordered ladder |
| `retentionRules[]` | Per event and asset: returned, retained, damaged, dormant, transferred or unknown | Ring return should not erase already taught skill; death is not blanket inheritance |
| `transferRules[]` | Eligibility, required consent/refinement/carrier, costs, dependencies and competing claims | Defeat, possession, attunement and competent execution are separate milestones |
| `policyRef` plus `policyState` | NPC aims, facts it knows, chosen tactics, observations, memory carriers and available resources | Same mechanics do not mean omniscient NPC behavior |
| `observationRules` and per-observer `claims` | Subject, assertion, observer, method, evidence, confidence, timestamp, contradicts | A false system reading remains a reading, not a replacement of world truth |
| `eventReceipts`, `rngStateRef`, `pendingOperations` | Durable identity for committed events, deterministic decisions, unfinished transactions | Reload/import must not create extra rewards or erase an in-progress recall |
| `evidence[]`, `premise`, `visibility` | Source locator + shown/stated/inferred; original/canon/divergent; public/discoverable/sealed owner reference | Never send the author’s hidden relation graph directly to notebook/UI |

**Storage option:** a new versioned, validated cheat-instance ledger can own payload and relation state; existing `actor.sources` records grant the capability contribution. Link receipts to instances. Alternatively extend source-instance validation explicitly, but do not append unvalidated `charges`/`holder` and call it supported. `src/expansion_engine.js:193–201,497–500` currently owns receipt fields, not this model.

**Validation options:** resolve referenced actors/carriers; reject impossible duplicate custody and unsupported permissions; require a defined handler for each live operation; detect parent/influence cycles; either reject cycles or explicitly model them, rather than recursively applying them forever. Unknown revocation is not unrestricted revocation. Missing old-save cheat data means no new cheat, controller, debt or prior discovery. Removed content can stay dormant by an explicit compatibility decision.

**Source discipline:** the world’s facts can include conflicting in-world explanations. STATED claims keep their speaker. A future author may select an original truth, but it belongs in a sealed owner if undiscovered; public card previews expose only the discoverable contract.

## O3: Influence is an attempted operation through a route

Use a small local relation graph, rather than an all-purpose “admin power” stat.

| Channel option | Possible decision | Gate / consequence to author |
|---|---|---|
| Offer or quest editing | Take the lucrative biased task, an ordinary alternative, or investigate | Operator can change only its own offers; accepting one cannot retroactively rewrite completed work |
| Readout filtering | Compare a system reading with an independent test | Access to its interface is not access to all senses, notebook records or the objective state |
| Reward weighting | Trade efficiency for autonomy | Authorized reward budget and target action must exist; no arbitrary confiscation of earned inventory |
| Function lock | Negotiate, qualify, repair, or go without one service | Named dependency, timing and affected verb; unrelated learned skill can remain |
| Observation | Use quietly, mask, or test what leaks | Actual mark/contact/range, transmission cadence, detectable traces and observer attention |
| Recall or drain | Return willingly, resist, contest terms, or secure an independent source | Defined owner right, carrier path, fuel pool, range and cost; recall may fail without rewriting ownership |
| Advice, dream or urge | Trust, compare, bargain or refuse | Advising is not forcing; compelled action needs its own explicit local mechanism |
| Parent-service delegation | Ask parent for more service or replace one dependency | A parent can revoke the grant it actually controls, not all child functions by scope rank |

**Resolution option:** at the committed action or clock boundary, check actor authority, actual route, jurisdiction, target support and cost, then apply only the affected function and record witnesses. Show known commitment costs before a player confirms an action, without revealing a sealed motive. A holder death, distant travel or cut link needs its own local rule; none automatically grants full freedom.

**Alternatives:** some worlds permit instantaneous and irresistible recall; others require line of sight, an oath, a messenger or artifact proximity. Neither is the default for all worlds. A protective hold can become unnecessary as body capacity grows, but the mentor need not have been lying or hostile.

## O4: Complete the enemy-family table, conditionally

All **45 rows E1–E45 are original gameplay options**, grounded in the library’s vocabulary (`docs/CHEAT_LIBRARY.md`, “Gameplay by cheat family” and “More cheat types”). The source references in FINDINGS motivate distinctions, not these exact enemy behaviors. Every counter below requires its stated local condition; it is neither a canon tactic nor a guaranteed win. “Read” means clues accessible through an actual observer/record, not free access to hidden card data. Counters can include departure, bargaining, ordinary superiority or rescue where the local situation permits.

| ID / exact library family | Enemy loop and what you can meet/read | Counter option and required condition | After defeat / inheritance option |
|---|---|---|---|
| E1 Death-menu regression | Reattempts a contested objective; carries a recorded lesson into its next supported run | Capture only if it cannot trigger restart while captive; deny a known carried tool; change facts its memories depend on | Claim a physical carrier only if transferable; its old memories do not become yours automatically |
| E2 Time loop | Rehearses the same interval; premature preparation can leave witnesses or repeated traces | Cooperate, act beyond its known information, or leave only if the loop boundary permits; unpredictability fails against live observation | Gain anchor access if locally granted; cannot loot the entire time mechanism by killing one participant |
| E3 System with quests | Pursues a rewarded target; offer receipts reveal which act actually pays | Offer another eligible completion, negotiate with issuer, or remove one service if its support can be severed | Host substitution requires the system’s actual eligibility/consent rule |
| E4 Sign-in and daily rewards | Secures reward locations and returns on its calendar | Contest reachable access or exchange schedules; portable/remote sign-in may defeat blockade | Take the eligible token/site, not its previously claimed days; record who already claimed |
| E5 Multiplier return | Cultivates recipients to grow its return pool | Refuse an eligible gift, compete for willing recipients or interrupt its documented return supply | Ledger and recipient relations transfer only by their own terms; no automatic retroactive returns |
| E6 Harvest and absorb | Hunts eligible essences and gains new methods; selected victims and residue are tells | Deny actual eligible intake, protect carriers, interrupt settlement or negotiate alternate nourishment; concealment needs a matching faculty | Recover unsettled essence if it remains; digested gains require a different extraction/body rule |
| E7 Copy | Samples your methods then selects a copy for the next exchange | Withhold acquisition conditions, use a decoy within the reader’s limits or exploit a known fuel/body requirement; not every copier can be fooled | Learn copied notes or take transferable source; seeing a list does not confer execution |
| E8 Analysis | Samples materials/routes, runs models and chooses an efficient attack | Change an unobserved variable, conceal compatible data or use terrain its model lacks; strong analysis can update | Recover a compatible tool or model records; private data and learned interpretation need separate carriers |
| E9 Storage and space | Smuggles reserves and hides supplies, then retrieves at tactical moments | Contest its actual access point, deny fresh supplies or force retrieval under a reachable constraint | Stored goods remain only if the space survives and the new bearer has access; no universal bag spill |
| E10 Time dilation | Trains or repairs within a faster enclosure, then emerges prepared | Act on the supported outside objective or contest entry/exit; cannot infer exhaustion solely from elapsed outside time | Claim the room/key if property rules permit; occupant’s acquired training remains theirs |
| E11 Fortune and fate | Selects vulnerable targets, plunders eligible fortune, benefits from favored outcomes | Protect or sever a proven link, contest the specific transfer or force a noncovered hazard; neither randomness nor luck zero guarantees death | Transfer only through the actual carrier/mechanism; the victim’s remaining fate is not loot by default |
| E12 Companion or resident spirit | Shares its source’s advice/resources and may outsource choices | Separate advice from execution, bargain with each party, or interrupt a demonstrated feeding/contact dependency | Resident spirit can refuse a new bearer; acquired lessons can survive a separation |
| E13 Summon and army | Builds a roster and combines units; command/resupply traces reveal routes | Contest a supported command path, terrain, supply or summoning window; some summons act independently | Recruit, release or negotiate eligible persons; destroying commander need not dissolve army |
| E14 Clones and many selves | Scouts and works through several bodies; conflicting reports reveal coordination | Contest its measured attention/merge channel or a demonstrated central dependency; no invented universal core body | Each body/source follows its own identity and carrier rules; knowledge does not merge for free |
| E15 Follower power | Rewards followers whose output feeds it; public contributions reveal beneficiaries | Offer a credible voluntary exit, interrupt one supplying institution or counter the leader directly; loyalty is not a switch | Followers decide; taking a seat can convey offices without automatic devotion |
| E16 Wish or edit | Saves quota for decisive changes; aftermath/receipts may reveal scope | Force choices across distinct eligible demands, negotiate terms or contest a documented edit condition; quotas are world-specific | Transfer a contract/quota only if its grant permits, without refilling already spent wishes |
| E17 Knowledge of the future | Arrives before crises/opportunities based on a remembered history | Make an observed divergence or create information absent from that history; live intelligence can repair the forecast | Acquire a written forecast if it exists; treat it as expectation for this branch |
| E18 Meta or fourth wall | Reads or blocks a supported story/information layer | Act where that faculty lacks contact or use its explicit exception; ordinary concealment may be irrelevant | Underlying authority may not be item-backed; study records without promising ownership |
| E19 Body growth | Eats/trains/evolves toward an observed threat; physical changes supply tells | Contest a known adaptation input or move faster than its actual response; no compulsory universal weakness | Materials or biology may be recoverable, but integration needs suitable body and local method |
| E20 Revival | Risks a lethal exchange knowing it can return; remnants/previous witnesses reveal recurrence | Restrain only if allowed, contest a known revival support, or secure objective between returns | Charges may remain actor-bound; defeated body is not proof the revival source is yours |
| E21 Building or territory | Expands production and fortifies an area that grants output | Work around reach, interrupt a supported input, evacuate or capture eligible control sites | Buildings, population and operating knowledge have distinct custody and consent |
| E22 Appraisal eye | Identifies targets and sells their weaknesses; trace what it knew before acting | Mask only compatible readouts, feed testable misinformation or reveal less; superior appraisal may defeat masks | Take an eligible tool or learn a method; anatomical faculty requires a body route |
| E23 Absolute knack | Repeats one unusually reliable act; comparisons expose its exact semantic promise | Pursue an objective outside that promise or bargain; an absolute hit need not ensure survival or total victory | Grant may be inseparable; leave it intact if there is no carrier-transfer route |
| E24 Language and speech | Makes deals through beings/objects others cannot address | Create informed interlocutors, provide evidence or contest a demonstrated channel; speech does not necessarily compel | Learn records/grammar or acquire a compatible speech faculty, not all former relationships |
| E25 Instant teaching | Rapidly equips a faction with knowledge; trace teacher and newly demonstrated methods | Contest materials, execution support or recruitment; perfect teaching can still leave body/fuel requirements | Preserve students as people; teaching source and pupils’ retained skills are different assets |
| E26 Perfect crafting | Produces flawless eligible items, finances allies and repairs losses | Compete for actual ingredients, facility access or a recipe scope; do not introduce random defects to negate perfection | Take tools/recipes through custody; perfect execution still depends on the surviving source |
| E27 Duplication | Turns scarce input into repeat copies; repeated provenance/consumed fuel may reveal it | Deny documented copying fuel or contest distribution; do not impose a universal ban on copying cheats | Copying device/recipe transfers by its terms; existing copies are not automatically erased |
| E28 Body swap and possession | Acquires a useful body and its position while concealing identity | Use a locally valid identity/soul test, a permitted ward or a remembered private fact; habits are clues, not proof | Free/restore the host if possible; do not award an innocent body as routine loot |
| E29 Shapeshift | Changes form for infiltration or matchups; witness transitions or incompatible needs | Test a known physiological constraint, follow consistent history, or avoid a form’s tactical advantage | Form knowledge is distinct from source/fuel; skin or copied appearance may carry neither |
| E30 Contract and bargain | Builds obligations, presses for acceptance and exploits wording | Negotiate, decline before binding, fulfill another clause or appeal to an authority the contract recognizes | Taking documents does not change parties; assignment/termination must be locally permitted |
| E31 Debt to the future | Spikes present output while moving cost to a later supported self/state | Survive its known window or make refinancing unattractive; debt may not weaken it on your timetable | Transfer debt only if the obligation permits, with disclosed terms; no reward for a phantom liability |
| E32 Karma bank | Selects actions that earn its currency, then spends on protection or effect | Contest the actual valuation or cash-out condition; hypocrisy has no guaranteed mechanical penalty | Balance persists only through its real ledger/carrier, not a moral judgment about the killer |
| E33 Dream walking | Contacts dreams for information or attack; sleepers’ reports reveal a pattern | Use valid wards, change access conditions or negotiate within dreams; sleep deprivation has a real bodily cost | Dream keys/anchors can transfer; a dream persona is not automatically a captured soul |
| E34 Divination | Purchases answers and positions for expected outcomes | Hide a variable outside its reach, overload a real query budget or accept an observed cost of changing plan; randomness may be visible too | Obtain a supported oracle/tool or interpreted records; never guarantee all forecasts false |
| E35 Outcome selection | Tests/selects branches and retains one outcome | Create linked demands no supported branch can satisfy, or contest a specified selection condition; its horizon must be known | Branch selection is not an ordinary file reload; transfer the actual source and its remaining budget |
| E36 Checkpoint save | Returns to an authored snapshot after a loss; acts on information that actually persists | Contest a demonstrated checkpoint, confine only if reset can be prevented, or win an objective beyond its restored scope | Separate in-world snapshots from private browser saves; no edit of real user exports |
| E37 Talent lottery | Collects draws and rebuilds tactics as talents change | Meet before its known next draw or adapt to displayed talent; do not assume reroll costs/discard rules | Transfer unused draw rights only if local rules support it; no reroll on import |
| E38 Inheritance system | Competes for legacies, passes tests, installs predecessors’ methods | Complete a reachable trial, negotiate custody or contest a known compatibility condition | Inherit what was left, including obligations; killing claimant is not proof of passing its test |
| E39 Title collector | Hunts eligible deeds and equips useful title effects; public deeds expose choices | Deny an actual criterion, contest its authority or fight outside a title’s supported scope | Office and achievement are distinct; a successor need not earn the predecessor’s personal feat |
| E40 Achievement system | Repeats rewarding deeds and optimizes record thresholds | Contest unique eligibility or deny an objective; do not retract legitimate past deeds for dramatic balance | Reward item may transfer, while claimant’s record remains theirs unless explicitly carried |
| E41 Notice-me-not | Acts around low attention and unexamined routines; affected stock/footprints can be evidence | Measure effects, use automated checks or an explicit exception only if the knack does not cover them | Defeat does not reveal every unseen act; transfer requires an actual carrier |
| E42 Charisma or aura | Recruits allies or compels within an authorized influence range | Build informed loyalty, contest a specified aura route, bargain or separate subjects if reach allows | Persons regain choice only by the local compulsion rule; no mass automatic loyalty to victor |
| E43 Reading growth | Acquires texts and grows while others patrol; new book custody and methods are tells | Compete for inaccessible texts or interrupt a defined reading opportunity; learned gains may remain | Recover real books/notes, not unwritten understanding; cheat-powered absorption is separate from literacy |
| E44 Heroic spirit summoning | Calls named dead heroes and seeks affinity/resources for them | Bargain with autonomous spirits or contest ritual/site support; recorded heroic limitations may matter | Spirits have personhood/terms; defeated summoner’s roster is not guaranteed ownership |
| E45 Pocket world | Develops an internal refuge/economy and uses supported home-ground powers | Avoid eligible entry, negotiate passage or contest a documented anchor; not every pocket world exposes a breakable core | World transfer can affect inhabitants/support; capturing carrier differs from safely governing it |

**Corrections to the existing 16-family table:** anchors and core bodies exist only for variants that have them; capture need not stop regression; a quest cannot be corrupted without issuer/contract support; a random choice need not defeat a foresight faculty; a summoner’s death need not free autonomous subjects; severing a loan need not erase trained gains. Guaranteed tell/cost/counter is an optional encounter-design goal, not a source law or an exception to rule 12.

**NPC policy option:** instantiate the same eligibility/cost/effect rules for player and NPC, then choose different decisions. Give the NPC a goal, known evidence, usable actions, budget, update cadence, retreat criteria and actual memory carrier. A regressor cannot remember events its variant does not carry; a copier cannot know an unobserved build. Rumors describe witnessed deeds after they occur, not automatic stage increments or fabricated knowledge. A coarse boundary policy must account for work, travel, resource use and the world’s off-screen/absent-world rules. Determinism means a committed decision stays committed across reload, not that an NPC is predictable to the player.

**Encounter-to-inheritance loop option:** meet a deed or rumor; gather a counter-relevant observation; choose interference, bargain or departure; resolve against local means; then separately inspect remains/rights, secure custody, qualify for use and record the outcome. Destruction, rescue and no transferable reward are valid outcomes. Learning about a source can be a meaningful gain even when no loot exists.

## O5: Introduce only hooks that a selected card needs

The library’s nine hook names are useful goals, but are not present as a general subscriber API. A held-system slice first needs changes of support and custody more than a universal combat-hook expansion.

| Proposed event / hook | Current seam, inspected only | Missing contract / failure to avoid |
|---|---|---|
| Action commit and completion | `commitAction`, `src/expansion_engine.js:530`; simulation commit `src/simulation.js:231` | Accept, complete, cancel and reject are different events; payment/reward needs one durable receipt |
| Clock or day boundary | `advanceSimulationBoundary`, `src/simulation.js:449` | Day must use the selected world calendar; replay skipped boundaries in order without double fees/recalls |
| Support/terms change | source receipt removal/expiry and capability recomputation | Add event for recall, seal, carrier loss or grant revision; affect named functions and retained outputs |
| Custody transfer / gift | Village custody provides a pattern, `src/village_career.js:12–55` | No generic on-gift exists merely because a loan function exists; accepted gift, returned loan and stolen item need distinct receipts |
| Observation acquired | existing facts/notebook and faculty conditions | Reading an effect and detecting a controller are different observations; no UI render event should grant hidden knowledge |
| Travel commit / arrival | existing journey transitions | Departure, successful arrival and unsupported foreign channel are different states; declare reachable jurisdictions |
| Native defeat / actual death / restart | current defeat and successor owners, including `src/life_experience_host.js:8–24` | Do not feed unconsciousness into on-death; no regression without an explicit retention snapshot and compatibility decision |
| Kill/harvest settlement | selected encounter/native combat integration later | Need causal actor, target, corpse/essence eligibility, ownership and consumed amount; aggregate stat damage is not a kill receipt |
| Level or stage change | actor progression and authored conditions | Specify which progression system changed; a global “level up” would fire unrelated cards |

**Payload option:** immutable event ID, schema/revision, world/time, causal actor/target, instance and transaction IDs, event phase, eligible public observations. Subscribers propose effects under validated rules; one transaction commits cost, effect, RNG advance and receipt. Order conflicting operations explicitly. Bound recursive triggers, and revalidate support before completion if recall happened during a job.

**Reload/import option:** preserve pending operations and the last committed receipt; repeating a button request does not claim twice. Rejected attempts cannot spend a hidden reward draw. Browser-closed behavior follows the world’s chosen clock/risk policy; adding a cheat is not authorization to age people or resolve unseen lethal fights while closed.

## O6: Three first home-world slices

These are candidates for a later authorized implementation wave, not built results. Selection is based on existing source seams and bounded proof cost, **not a ranking of source novels**. Each uses an openly known relationship so this public packet need not reveal a sealed secret. Only one would be implemented before starting another.

### K1: An openly operated quest token

**Fantasy:** borrow a powerful convenience while deciding how much of its issuer’s agenda to accept. A local issuer openly owns an optional token that offers one paid supply job. The ordinary route remains available. The issuer can suspend only the token’s future job offers under stated terms; goods already earned and work already learned stay distinct.

**Player loop:** review terms, accept/refuse the token, take the offered job or ordinary alternative, compare the issuer’s requested destination with a public work record, bargain over the next offer, then keep or return the token. The objective/cost is shown; no forced hostile-target quest or hidden villain identity is authored. A later variant could hide motives, with its truth stored elsewhere.

**Reuse:** current action requirements/costs, simulation job reservation/completion, source capability receipt, existing center actions, notebook and life records. Village loan/return/debt handling is a pattern only; do not retrofit Tessa’s existing lantern into a cheat or overwrite its career ledger. **Missing:** one instance/owner relation, offer revision and support-change handler. If suspension can occur mid-job, terms must decide whether the accepted work completes under its old contract or receives a declared refund.

**Proposed minimal budget:** one issuer, one token, one offered job, one ordinary alternative and one explicit return/bargain decision. Numbers stay implementation proposals. **Proof gate:** fresh rebuilt browser shows refusal preserves vanilla play, issuer support affects only this service, a completed reward remains after return, and accepting/finishing/returning across save/reload/import grants no duplicate pay or debt. Removed-card loading keeps the run usable under a declared compatibility policy.

**Why first:** demonstrates a held channel, leverage, exit and retained output without requiring true death or a general combat bus. It can include a known NPC bearer competing for that job later, but that is outside this first proof.

### K2: Rival with one analysis card

**Fantasy:** discover why a rival seems prepared, then win by changing what their evidence actually supports. A disclosed rival holds a small appraisal/analysis tool and samples one local route or material before a scheduled claim. Their initial analysis is correct for those samples. The player can observe the sample collection, contest the claim through an existing encounter, prepare a genuine alternate route/material, bargain, or leave.

**Player loop:** witness a sample, investigate its scope, choose an independently supportable change, meet the rival’s committed response, then secure the contested objective or negotiate. Repeated fake UI inspections do not change the rival’s knowledge. A direct contest remains possible if the player’s means support it; the puzzle is not mandatory.

**Reuse:** simulation people/jobs, capability conditions, encounter/pursuit state, seeded action resolution, material/crafting facts, notebook and current center menu. **Missing:** one evidence-bounded NPC policy with sample data and a committed decision receipt; a conditional transfer of the physical tool if its publicly stated custody rule permits. Native combat AI integration is deliberately outside this narrow encounter. That is a scope choice, not a claim that encounter UI already implements cheat policy.

**Proposed minimal budget:** one rival, one sample, two encounter approaches and one bargain/transfer route. **Proof gate:** NPC cannot react to an unseen change, can react after actual new sampling, spends the same documented tool resource as a player holder, and cannot reroll or refill through reload/import. Securing the tool must require custody plus eligibility; victory alone does not create it. Play the refusal/leave route too.

**Why a first enemy candidate:** tests meet/read/counter/acquire using known information and ordinary preparation. It avoids a rival regressor until genuine in-world timeline/retention behavior exists.

### K3: A loaned advisory spirit with a retained lesson

**Fantasy:** negotiate with a source that advises you and a lender who owns its housing, while keeping what you truly learn. A publicly named lender loans a housing item containing a willing advisory spirit for one study/practice task. The spirit agrees to advise, needs a stated consumable, and may decline requests outside that agreement. The lender’s recall right concerns the housing/service, not erasing a practiced lesson.

**Player loop:** ask both parties about terms, feed the agreed consumable, study an offered method, practice, return the housing or negotiate an extension, then test the method with ordinary required equipment. An extension can cost time, goods, favor or nothing when that particular lender offers it. Do not infer all options must exist for every person.

**Reuse:** current known/practiced/executable distinctions, native reading/meditation patterns, inventory costs, source grants, log/center menu, NPC identity and life-record patterns. **Missing:** consent/advice state for the spirit, one owner relation and retention partition between housing, active advice and acquired lesson. Do not reassign an existing NPC’s accepted personality or fold spiritual consent into source ownership.

**Proposed minimal budget:** one lender, one resident, one lesson, one feeding input and return/extension choices. **Proof gate:** recall pauses supported advice, independently practiced method still works with its actual supports, unused supplies/escrow settle under known terms, and save/reload/import retains each party’s custody/consent without double lessons or biographies. A lesson that still requires the spirit must be shown as unsupported after recall instead of silently pretending it became independent.

**Why a first relationship candidate:** distinguishes controller, bearer and autonomous source in everyday play, contrasting K1’s institutional channel and K2’s adversarial information loop.

## O7: Sequence around visible proof, rather than mandatory invisible phases

C0–C6 in the existing library is a proposed sequence. C0 can be a prerequisite inside a visible first slice; it need not be delivered as a separate “gameplay done” wave. The three cards need not all be coded together.

| Phase option | Work boundary | Observable completion / dependencies |
|---|---|---|
| P1, K1 foundation | Versioned instance model and only the action/support/transfer seams needed for the token | Player accepts, declines, uses and returns it; old saves gain nothing invented; fresh browser and save/reload/import pass |
| P2, K2 opponent | Add one scoped NPC policy, observation record and a conditional transfer | Same tool eligibility/cost on both sides, evidence-based response and custody qualification visibly work |
| P3, K3 resident | Add consent/advice and function-level retention | Lender recall, spirit refusal and retained practiced lesson visibly differ |
| P4, selected new family | Choose one harvester, multiplier or sign-in variant and add only its required settlement/day/gift event | One economic loop remains correct through cancellation, depletion and reload; no mandatory coverage of all three |
| P5, known-card notebook | Present only met/held/rumored facts and their reliability in existing notebook | Player can locate their evidence, unknown functions stay unknown, hidden author fields never appear |
| P6, regression if selected | Reconcile accepted heir inheritance first; design in-world snapshot, costs, carriers, world scope and rival memory | Die/restart only by an explicit new route; save/reload/import and branch causality pass; native unconsciousness remains distinct |

These are replaceable options, not a newly accepted roadmap. Death-menu regression can be chosen earlier if that fantasy matters more, but then snapshot/inheritance work becomes part of the first slice rather than being hand-waved as an existing hook. Declared true death and retention need author decisions that the current “send it” research authorization does not make.

**Acceptance states:** research-ready now; implementation not started here; rebuild/browser/persistence gates belong to any later code wave; fiction/numbers still need Weibao’s playable acceptance. One fresh-origin proof cannot establish every family or off-screen policy.

## O8: Keep rival, owner and source interests independent

A bearer can oppose the player while its patron wants reconciliation. A spirit can oppose its housing owner while refusing to join the player. An owner can die while an institution keeps the service running. The library can offer these as independent relationship configurations, not an obligatory betrayal arc.

**North-star wording option:** “A storyteller may schedule eligible opportunities or portray an in-world force. It may not silently grant that force a new channel, change a settled cost, or rewrite who owns a source. When it acts in-world, its acts use that world’s actual rules.” This is a proposed refinement, motivated by F5/F7/F8/F11/F12, not a rule those books share.

**Retention wording option:** “Losing a cheat changes only the functions and assets that still depend on it. Acquired learning, transformations, goods, debts and relationships each have their own carry and termination rules.” F5, F11 and F12 supply examples contrary to blanket deletion.

**No-controller variant:** ordinary research can conclude a feared manipulator has no present route at all, or that an apparent reward bias is a bounded mechanism rather than a person. Another world can truly have a supreme controller. The investigation should test evidence rather than always confirming the held-system premise.

**Live questions for future selection:** the unresolved Royal Road scene; how a chosen home-world card gets its actual carrier; which functions depend on a live link; what happens to accepted work during recall; and the selected world’s off-screen/absence policy. These are local choices for the selected slice, not blockers that require answering every world’s cosmology first.

## Twenty small touches

All T entries are optional original proposals. None reveals an existing sealed truth or claims a canon scene. They can be selected independently of the eight options.

| ID | Small touch | Decision or information it adds |
|---|---|---|
| T1 | A loan receipt names the item, lender and return condition | Distinguishes whose tool it is from who can use it |
| T2 | A completed lesson shows the actual teacher and medium | Makes “I learned this” separate from “I still have the source” |
| T3 | A disabled service retains its last earned receipt | Lets the player verify what recall did and did not remove |
| T4 | The same issuer offers a low-pay ordinary task beside its token job | Makes dependence a choice with an immediate alternative |
| T5 | A rival’s notebook contains a dated material sample | Makes obsolete analysis visible without disclosing the whole policy |
| T6 | A tool readout says when its sample was collected | Encourages testing a stale reading rather than treating it as truth |
| T7 | A failed owner recall leaves a detectable attempt only if the local channel does | Turns reach into evidence while preserving genuine stealth variants |
| T8 | A spirit asks the bearer before answering a personal question | Gives the resident a view independent of the housing’s owner |
| T9 | An extension can be offered for a covered shift rather than money | Makes patron terms participate in ordinary work |
| T10 | Borrowed supplies and produced goods occupy separate receipt lines | Prevents “return everything” from silently undoing earned output |
| T11 | An unfamiliar system offer carries a version/date label if its interface exposes one | Lets changed terms be compared with the accepted offer |
| T12 | A witness describes the effect they saw, without correctly naming its cheat | Provides a useful tell that can still be misinterpreted |
| T13 | A trained rival stops using a counter the player publicly defeated | Connects learning to a witnessed event rather than hidden omniscience |
| T14 | A repaired housing has the craftsperson’s mark | Links magical custody to ordinary repair and provenance |
| T15 | A quest target can offer a credible alternate completion where the terms allow it | Opens bargaining without universal quest corruption |
| T16 | A fragment has a wear pattern matching a public catalog illustration | Makes identification a concrete research route, not automatic full ownership |
| T17 | An inherited tool comes with an unfinished maintenance note | Carries what was actually left behind, including work still needed |
| T18 | A silent source remains in the known-card notebook with only confirmed past facts | Preserves discovery without promising current execution |
| T19 | Two observers disagree about a rival’s power and cite their own tests | Makes readings fallible while giving the player a way to investigate |
| T20 | Returning a source records the last supported action, without claiming every gain was lost | Gives a concise, checkable end to a borrowed loop |
