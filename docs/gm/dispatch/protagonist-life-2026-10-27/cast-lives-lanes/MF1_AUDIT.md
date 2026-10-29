# MF1: mechanism fit, 2026-10-29

Status: source-inspected audit and proposed dispatch. No gameplay implemented,
no pack adopted, no replay improvement measured. One owned output, this file.
No commit. Public surface contains generic mechanisms, counts and source paths;
source wording and identities remain private.

## F1: authority, scope and count basis

Authority: [brief](MF1_MECHANISM_FIT_AUDIT_BRIEF.md), [PROJECT](../../../../../PROJECT.md),
[direction](../../../../USER_VISION.md), [life direction](../../../../LIFE_SIM_NORTH_STAR.md),
and [design](../LEAD_LIFE_SYSTEMS_DESIGN.md), especially sections 6–8, 14–15 and 18.
The lead's life remains the main line; broader worlds remain in scope. The canon
run preserves source choices and outcomes through mechanisms. Open-run choices
and outside interference remain later scope. Approximate timing does not permit
dropping events or inventing exact source hours. These proposals change no direction.

Applies: AD1–AD9, AD13–AD17, AD22, AD32–AD38, AD41–AD45; AR1–AR16;
MR1–MR36; CLR1–CLR13; WPR1–WPR8, WPR18–WPR23, WPR27–WPR32;
SR1–SR24 for route/place recommendations. MD1–MD3 are proposed modularity
guidance in the coordinator handoff, not additional accepted rules. UI work, if
dispatched, uses the existing scene surfaces at 1920×1080 desktop; mobile deferred.
This audit changes no UI and makes no browser claim.

[X4](X4_CHECKPOINT.md) resume 2 counts 11,159 steps, 1,111 candidate controls,
10,048 gaps. Resume 3 has 1,113 controls and 10,046 gaps after one observation
and one wait; it also reclassifies the formerly unclustered population. Every
step actor in that census remains unknown. Family counts describe candidate
demand, not confirmed lead actions, unique encounters or runtime defects.
Counts below use resume 3 where it supplies an update. The brief's 832 planning,
366 making, 175 message, 165 trade, 311 agreement and 284 state steps are total
family sizes, not remaining gaps: their remaining counts are 830, 296, 174,
164, 306 and 282. A prior 831 planning-gap figure predates the extra control.

All unlock ranges below are **proposed planning estimates**, conditional on
paragraph support, actual actor, identities and adoption. The defensible lower
bound on new playable coverage today is **0** for every family. Upper ranges
are small first-slice targets chosen from census ceilings, not a measured
conversion rate or a promise. Counts across mechanisms overlap and must not be
added to predict replay coverage.

## F2: reviewed evidence changes the work classification

Read the private `reviewed-rows-2026-10-29/*.jsonl` verdicts, including
`gapReason`, `paraphrase` and available details; no new book acquisition or
chapter reread. [RV2](RV2_CHECKPOINT.md), [RV4](RV4_CHECKPOINT.md),
[RV6](RV6_CHECKPOINT.md) and [H2](H2_CHECKPOINT.md) explain their boundaries.

| Review | Verdicts | Candidate rows | Gaps | No mechanism | Other actor | Unresolved identity | Not an action |
|---|---:|---:|---:|---:|---:|---:|---:|
| RV2 | 54 | 0 | 54 | 34 | 9 | 1 | 10 |
| RV4 | 18 | 12 | 6 | 4 | 1 | 0 | 1 |
| RV6 | 52 | 14 | 38 | 25 | 7 | 4 | 2 |
| RV7, additionally present at inspection | 54 | 25 | 29 | 20 | 7 | 1 | 1 |
| RV8, arrived during audit | 18 | 8 | 10 | 9 | 1 | 0 | 0 |
| RV9, arrived during audit | 29 | 11 | 18 | 13 | 5 | 0 | 0 |
| File-record total | 225 | 70 | 155 | 105 | 30 | 6 | 14 |

These are file-record totals, **not deduplicated steps**. RV2 and RV7 overlap
their review range; repeated paraphrases can represent extracted fragments.
RV6's 25 no-mechanism verdicts include 10 citation/volume mismatches. Those
10 need evidence repair, not 10 new mechanics. Existing candidate rows need
ingestion and execution before they count as coverage. H2 supersedes several
older adapter-absence diagnoses but does not validate their source bindings.

| Added generic gap class | Mechanism implication | Count boundary |
|---|---|---|
| Remembered activity, fragmented memory, intention and postponement | Attribute recollection to its observer; a plan needs a later gate or choice consumer | RV4 has 2 mental-recall gaps; whole-book planning ceiling 830 |
| Involuntary waking, symptoms, dream interaction and altered perception | Body/condition and situation ownership; dream relocation must not move the physical body | Present in RV4/RV7; not a separately measured census family |
| Shared meals and unspecified allocation | Preserve household stock and participant consumption without inventing per-person portions | RV4 has 1 shared-consumption gap; overlaps care/making |
| Clothing, carried objects, household stash and guarded movement | Equipment, transfer and custody support, including concurrent movement | RV6 identifies 2 dressing, 1 stash and 1 protected-movement subcauses |
| Aggregate purchases and tender/change | Atomic grouped exchange; total price can be known when line prices are unknown | RV6 identifies 4 purchase subcauses |
| Translation and vocabulary limits | A transformed text artifact plus competence gate, distinct from reading | RV6 identifies 1 language-transformation gap |
| Multi-person and moving conversations | Participant set and movement support, distinct from static pairwise topics | RV6 identifies 3 addressed-person/group gaps; moving cases present in RV7 |
| Other actor acts or reports | Run that actor's supported command; deliver the lead's perception separately | 30 overlapping file verdicts, not 30 missing lead commands |
| Advances, repayment, requisition and housing agreements | Terms, disbursement, custody, signature and occupancy consumers; a conversation receipt does not settle debt or tenancy | Added by RV8/RV9; no distinct whole-book count; route to L2/L6 and later institutional work |
| Loading ammunition, drawing practice and aimed fire | Real chamber/ammunition state, consumed rounds, practice and conflict support | Added by RV8/RV9; route to L8, with custody supplied by L2; no independent unlock estimate |

## F3: source-tested carriers and depth limits

Paths and function names below cite inspected implementation, not a capability
inferred from a filename. Existing local successes do not imply whole-book fit.

| Code | Existing source / function | Actual mechanism and boundary |
|---|---|---|
| C1 | `src/simulation.js`: `previewSimulationCommand`, `commitSimulationCommand`, `completeJob`, `cancelSimulationJob` | Admission, participants, reservation, completion support and cancellation. Existing command owner, not another clock or transaction layer. |
| C2 | `src/simulation_effects.js`: `applySimulationEffects` / `applyEffects` | Real money/resources, inventory transfer, equipment/custody, body/vitals, conditions, knowledge, relationships, claims, events and situations. Native resource effects currently bind player money; they do not constitute a general multi-purse transfer. Relocation has native-body checks and rejects actors with reserved work. |
| C3 | `src/place_acts.js`: `definePlaceActs`, `seedPlaceObjects`; `src/place_act_operations.js`: `compilePlaceActOperation` | Location-bound timed commands with effects and observation receipts. Several operation labels compile no extra semantics. `prepare` requires seeded spent resources and output/fact; `secure` checks ownership facts then writes concealment/container facts; `wake` changes a pack fact; `sit`/`settle` write a rest fact. These do not provide native recovery, general inventory custody or sleep control. Clock checking samples an authored display fact; a producer still must update it. |
| C4 | `src/cast_topic_talk.js`: `defineTopicTalks`, `quoteTopicTalks` | Timed pairwise, co-located choices, costs and authored knowledge/relationship/reputation/event effects. Other effect types are rejected. It records a conversation, not contract settlement, remote delivery or group negotiation. |
| C5 | `src/components/dialogue_component.js`: `DialogueComponent`, `Textline`; `src/models/dialogue_action.js`: `DialogueAction` | Availability, branching text, rewards/unlocks and actions. Useful dialogue machinery; no general message lifecycle or obligation model follows from the classes. |
| C6 | `src/native_trade_transaction.js`: `stageNativeTrade`; `src/trade.js`: `readTradeQuote`, `accept_trade` | Revalidated quote, actual vendor/player inventory transfer, player balance, market saturation, XP/acquisition staging. Real exchange depth, but native trader/item/price bindings must exist. A pay-labelled place act has none of this automatically. |
| C7 | `src/craft_recipes.js`: `defineRecipe`, `matchRecipe`, `recognizeRecipe`; `src/craft_resolver.js`: `defineCraftLaw`, `resolveBatch` | Material selectors, allocation, recognition, conserved consumed quantities, catalysts, process transforms, ordered processing and product results. A real composition resolver, not a universal writing/parts/pattern resolver. |
| C8 | `src/craft_state.js`: `freezeMaterials`, `freezeRecipe`, `recordProduct`, `observe`, `projectProduct`; `src/craft_product_registry.js`: `resolveProductKey` | Frozen products/materials/recipes and observer projection with product-family lookup. Reuse identity and knowledge boundaries rather than mint a second inventory. |
| C9 | `src/crafting_frontier_runtime.js`: `quoteCrafting`, `stageCrafting`, `eligibility`; `src/crafting_domain.js`: `commitCraftingQuote`; `src/native_craft_transaction.js`: `beginNativeCraftTransaction` | Native costs, product/use effects, held firing and rollback/save publication exist. The runtime eligibility is location/world-bound, so cross-world making needs an explicit law/host binding. Copying the current location check is not generalization. |
| C10 | `src/dose_process.js`: `defineProcess`, `processGaps`, `processReady`; `src/book_world_lotm_brew.js`: `lotmBrewCommands`, `brewFacts` | Shared process shape and exact item-key holdings. Host generator reads the first slot, buys instruction, spends material/attention, waits on a knowledge timestamp, bottles into the existing allocation. It does not execute arbitrary multi-slot trait matching or compositional brewing. |
| C11 | `src/book_world_lotm_pathways.js`: `pathwayCommands`, `pathwayFacts`, `pathwayDoses` | Allocation, ingestion, acting/progression, assessment and promotion with held-source/item invariants. Reuse the consumption/progression consumer after making; brewing itself does not confer a capability. |
| C12 | `src/ritual_conditions.js`: `defineRitual`, `fitScore`, `gradeRitual`; `src/book_world_lotm_ritual.js`: `gradeRiteAtTransition`, `selfRiteFacts`, `selfRiteCommands` | Condition predicates and physical/functional/symbolic substitute grades; proposed risk dials. Host also has taught, prepared, paid, timed self-directed rite stages. Grade previews and that bounded response are not a query/answer divination mechanism. |
| C13 | `src/structured_ability_runtime.js`: `compileStructuredAbilities`; `src/book_world_lotm_abilities.js`: `abilityCommands`, `abilityRows` | Held sources, control/target/counter/carrier predicates, disclosed costs, completion support and concrete effect categories. Some host rows produce knowledge or conditions; a condition name alone does not prove a combat/body consumer reads it. `src/book_world_lotm_actions.js` material-perception power is explicitly bounded perception, not general foresight. |
| C14 | `src/conflict_frame.js`: `runConflictFrame`, `conflictResult`, `legacyConflictRandom` | Ordered moves and stop/results over existing saved battle sessions. Definitions retain costs, effects and validation; legacy draws retain ordering. No generic canon-fight data runner, range/morale model or keyed new-fight draws is supplied merely by this structural frame. [F1](F1_CHECKPOINT.md) retains its browser/floor gap. |
| C15 | `src/simulation_effects.js`: knowledge branch in `applyEffects`; `src/people_knowledge.js`: `knownPeopleView`; `src/relationship_view.js`: `relationshipView`, `relationshipFacts` | Observer records have stage/value/time/cause/basis; relationships have directional axes, memories and durable-cause handling. Good storage/read mechanisms, not a deduction engine or objective truth implied by an inference. |
| C16 | `src/cast_schedule.js`: `compileCastSchedule`, `whereabouts`; `src/book_world_lotm_cast_host.js`: `syncLotmCast`, `castWaitOptions` | Indexed dated whereabouts, boundary queries and host synchronization. Place presence is not accepted work, task completion or arbitrary actor control. |
| C17 | `src/wait_until.js`: `waitUntilOptions`, `runWaitUntil`; `src/cast_journeys.js`: `defineJourneys` | Waits quote known future bands/appointments and advance through supplied event boundaries; journeys reserve known fare, run supported jobs, relocate and record arrival. Unknown fare is explicit, not a measured zero fare. Fixed-location jobs cannot model travel plus concurrent speech without a support policy. |
| C18 | `src/main.js`: `do_resting`, `do_sleeping`, `start_sleeping`, `end_sleeping`, `start_reading`, `do_reading` | Actual recovery, native sleep state and reading progression already exist. Bind via injected ports; H2 fact waking/rest is not this owner. `src/body_progression.js`: `bodyFacts`, `bodyCommands` provides bodily conditions/care; this does not establish general hunger/fatigue clocks. |
| C19 | `src/work_ledger_system.js`: `transitionWorkLedger`, `observeWorkLedgerCraft`; `src/agreed_duty_host.js`: `joinAgreedDutyDefinitions`, `agreedDutyPresentation`; `src/agreed_duty_facts.js`: `agreedDutyReservationValid` | Concrete accepted commissions consume new craft evidence; a bounded multi-person agreement selects existing worker activity and validates reservations/receipts. Reusable examples, not a source-wide payroll or general delegation service. |
| C20 | `src/institution_store.js`: `defineInstitution`, `auditLedger`, `offerFor`; `src/book_world_lotm_districts.js`: `respondersFor` | Contribution/store ledger and district/affiliation response routing exist. They do not implement witness-evidence case files, warrants, investigations or arrest procedure. Design section 6's broad legal-record gap remains materially valid despite these narrower institutional mechanisms. |

## F4: per-family first slices, upgrades and new mechanisms

Each row names a viable carrier, missing semantics, and **default / dial / reason**.
Ranges are additional candidate steps after review; 0 remains possible. Lane
codes refer to the proposed disjoint grants below. Cited carriers are the current
owner files; new leaves adapt them rather than replace ownership.

| Family: total / remaining | Carrier and missing mechanism | Proposed default / dial / reason; first slice and target | Lane / model / usage points |
|---|---|---|---|
| Divination or ritual: 232 / 232 | C12/C13/C15; new query/result and interpretation semantics, deeper ordered rite execution | Paid prepared query with observer-bounded signal / precision, interference, means and recovery vary by world / instruments and targets constrain what can be learned. One query plus one ordered rite with an existing knowledge/gate consumer: 5–15, not all 232. | L4 Sol source 1; reviewed rows Luna +0.25 |
| Use ability: 160 / 160 | C13/C2; effect must reach actual perception, body, target or conflict consumer | Bind one held-source ability to a real target effect / range, cost and counters / carrier and target mechanisms. First 5–15 rows; knowledge-only rows qualify where perception itself is the result. | L8 Sol 1 shared with combat; rows +0.25 shared |
| Fight or evade: 161 / 161 | C14/C13/C2; source sides, ordered moves, outcome preconditions and aftermath | Existing conflict frame / moves, stop rules and information / actors' actual means and aims. One short fight or escape to a consumed wound, pursuit or release result: 3–10. | L8, same cost; conflicts F1 step-2 work |
| Make or write: 366 / 296 | C7–C11/C3; making bridge and durable written artifact are different product logics | Composition for physical batches, text artifact for writing / law, apparatus, skill and output kind / substances transform; texts preserve content and attribution. One preparation-to-consumption chain: 8–20; one text-copy/translation chain: 1–3 separately within that target. | L3 Sol 1; rows +0.25 |
| Trade or pay: 165 / 164 | C6/C2; pack counterparties, supported stock, grouped price, stash transfer, optional tender detail | Atomic exchange of existing holdings / currency units, grouped quote and denomination detail / money and goods change owners together. One reviewed market exchange and stash transfer: 4–12. Do not invent line prices from a total. | L2 Sol 1; rows +0.25 |
| Exchange message: 175 / 174 | C4/C15/C1; new addressed delivery lifecycle | Same-place message first / messenger, delay, interception and recipient availability / a sender's utterance is not recipient knowledge. One sent/received/replied chain with absent-recipient failure: 3–8. | L6 Sol 1 shared social lane; rows +0.25 shared |
| Reason or plan: 832 / 830 | C15/C1; inference/recollection and intention consumer | Derive from held evidence, save a current intention / uncertainty, revision and cancellation / a belief is not world truth or foreknowledge. One recollection-to-decision-to-action gate: 10–25. Narrative reflection remains narrative when no stateful action is supported. | L5 Sol 0.75; rows +0.25 |
| Direct actor: 127 / 127 | C16/C19/C1; request, response, accepted task and worker-owned result | Request through supported authority/cooperation / urgency, incentives, competence and refusal / another actor owns its effort and supplies. One request accepted or refused, then real work result: 2–6. | L6, same cost; depends on L5 intention contract |
| Obtain information: 104 / 104 | C15/C3/C4; evidence/source/observer and a downstream use | Observation or testimony / reliability, access and interpretation / information arrives by means. One testimony/observation unlocks a later question or route: 5–15. | L5, same cost |
| Agree or refuse: 311 / 306 | C4/C19/C2; obligation/claim/phase consumer beyond social receipt | Offer, explicit assent or refusal, scoped obligation / terms, revocation and institutional consequence / a promise changes duties when supported. One acceptance and one refusal with consumed result: 5–15. | L6, same cost; C19 is example, not global contract authority |
| Change or maintain state: 284 / 282 | C2/C3/C18; resolve affected owner instead of generic fact substitution | Route equipment to equipment, body to body, place to place / operation/support per owner / state change must affect its reader. First dressing and guarded-custody case: 3–10; supernatural environment change remains L4. | L2 primary; L4/L7 overlap, no additive estimate |
| Rest and personal care: 348 / 284 | C18/C3; real waking/recovery, meal allocation and interruption | Native sleep/recovery and real food consumption / body, household shares, conditions / physiology and stock matter. One sleep-to-wake and shared-meal chain: 5–15. Hunger/fatigue clocks are a later deeper extension, not implied by care receipts. | L7 Sol 0.75; rows +0.25 |
| Speak or ask: 1,203 / 1,144 | C4/C5/C15; attribution, group/remote/moving participants, refusal/no reply | Pairwise supported topic where sufficient / audience, channels and response / people hear and answer under actual circumstances. First 10–25 attribution-safe static rows, then 5–15 group or unanswered exchanges. | L1 Luna 0.25 for existing rows; L6 for deeper behavior |
| Handle item: 898 / 807 | C2/C3/C6; custody/equipment rather than observation receipt | Transfer actual held items / concealment, containers, loan terms / possession constrains use. First ordinary carried/worn/stored object chain: 5–15 overlapping state/trade. | L2; do not add this estimate to those rows |
| Travel/move: 1,110 / 658; paid transport: 161 / 66 | C17/C16; source endpoints, service/counterparty and concurrent support | Known route and means / fare, service window, protection and companions / travel consumes time and access. First 5–15 reviewed route rows; unsupported endpoints stay gaps. | L1 rows; moving conversation L6; custody L2 |
| Inspect: 530 / 438; observe/listen: 555 / 427 | C3/C15; changing evidence/perception and witnessed third-party action | Observer knowledge / concealment, attention and conditions / seeing a sign is not learning hidden truth. First 5–15 reviewed observations consumed later. | L5; simple rows L1 |
| Read text: 128 / 82 | C3/C18/C15; supported contents/competence/progression and learned consumer | Read held accessible text / language, light, comprehension and memory / access does not confer understanding. First 3–10 rows unlocking a real question or instruction. | L5; produced/translated artifact L3 |
| Wait: 162 / 161 | C17/C1; known event/window and interruptions | Existing clock to next supported window / precision and concurrent activity / order and opportunities, not fabricated hours. First 1–5 reviewed waits; unknown duration can use a supported event boundary when one exists. | L1 rows, coordinator G1 binding; no new wait engine |

Resume 3's additional review buckets are **disjoint classifier buckets**, not
new validated families: ritual 438; socialize 435 (4 controls); fight 374;
travel 227; study 140; work 120; appraise 118; research 118; trade 115;
rest 110; practice 95; craft 80; care 68; other 678; unknown 31.
Proposed routing is respectively L4, L6, L8, L1/L2, L5, L6/L3,
L5, L5, L2, L7, L8/L3, L3, L7, L1 review, L1 review. Their first-slice
unlock estimate is **unquantified, 0 verified**; add no percentage of those
counts to family targets before paragraph classification. Source-driven legal
incidents, sensory changes and language gaps may be found there; none has a
measured whole-book ceiling of its own yet.

### D1: deeper brewing and genuinely new divination

Brewing should reuse recipe selection, frozen inputs, the process envelope,
native transaction and the pathway ingestion consumer. The missing bridge is
multi-slot allocation and actual product resolution under a world law, including
held intermediate work, interruption and consumption. Default: exact formula
as a known shortcut; dial: substitution, process depth, apparatus and quality;
reason: material properties and execution act even when unknown. A world can
use conserved identity or pattern assembly instead of composition. Do not
force translated texts or constructed devices through mixture arithmetic.

Divination needs a mechanism beyond ritual grading: declared question/target,
held method/instrument, preparation and cost, effective range/contact, answer
resolution, interference/countermeans, recipients and interpretation. Default:
commit one result at the real attempt, keep hidden answer separate from the
observer's signal and interpretation; dial: precision, opacity, false readings,
exhaustion and danger; reason: the method sees or contacts something through
limited means. A source-pinned result still executes costs and effects through
owners. It does not reveal later facts early. A misreading is a belief record,
not a mutation of truth. An unanswered query still has paid effort and feedback.
Other worlds can supply omen, instrument, remote contact or probabilistic
forecast palettes without sharing one universal accuracy scale.

## D2: proposed ranked build order, at most eight lanes

These are briefs for coordinator expansion, **not dispatched work or accepted
scope**. All grants below are disjoint. Proposed new paths must be checked for
existence and active reservations at dispatch time. Existing carrier paths in
F3 remain read-only to these workers unless the coordinator explicitly transfers
ownership. Each source lane returns a small adapter using current command and
effect contracts, its focused tests and an integration note in its own receipt.
The coordinator alone applies shared host/registry/replay/save/UI joins, one
finished playable slice before the next. No shared-file patch is silently required
to make a leaf count as integrated.

**L1, reviewed evidence and available controls, Luna low, 0.25 points.** Grant
`private/.../reviewed-rows-2026-10-29/MF_ROWS_L1.jsonl` and
`cast-lives-lanes/MF_ROWS_L1_CHECKPOINT.md`; expand `private/...` to the existing
private review directory at dispatch. Review a bounded first replay segment,
repair citation-volume and actor classifications in this overlay, retain
non-lead observations, and produce existing-topic/journey/wait/place-act rows
where contracts preserve the full mechanism. Target 20–50 candidate steps from
the large dialogue/travel/observation families; overlap with F4 estimates.
Do not edit X4, old verdicts, builders or the pack. Validate adapters, provenance
and stable step IDs; coordinator ingests. This lane can unblock data before
source work and prevents citation errors from becoming engine requirements.

**L2, custody and atomic exchange, Sol medium, 1 point.** Grant proposed
`src/cast_exchange_adapter.js`, `tests/cast_exchange_adapter.test.js`, and
`cast-lives-lanes/MF_EXCHANGE_CHECKPOINT.md`. Use C2/C6 admission and transaction
owners for one reviewed purchase and one stash/carried or worn-object operation.
Return commands with real inventory/resource/equipment effects and supported
group price; model denomination detail where evidenced. Default atomic quote,
dial currency/tender precision, reason conserved ownership. Target 8–20 unique
candidate steps across overlapping item/trade/state families. Focus stale stock,
insufficient money, no duplicated change and pending interruption tests.
Coordinate H2 object bindings, native trade/economy writers and L3 inputs;
shared `simulation_effects.js`, `place_act_operations.js`, money and host files
stay coordinator-owned. A native household stash port, if missing, is an explicit
integration gap rather than a second purse hidden in facts.

**L3, making and brewing bridge, Sol medium, 1 point.** Grant proposed
`src/cast_making_adapter.js`, `tests/cast_making_adapter.test.js`, and
`cast-lives-lanes/MF_MAKING_CHECKPOINT.md`. Compose C7–C11 for one sourced
preparation-to-product-to-use chain, then a second generic product case if it
fits the same bounded slice. Keep source instructions in private rows. Default
known recipe, dial real substitutions/stages, reason actual material and maker
conditions. Target 8–20 candidate steps from the 296 making gaps; brewing's
share is unknown until classified. Text-copy/translation may use a separate
product logic behind this adapter; if that exceeds the first slice it stays
an explicit gap. Test conservation, real product use and interrupted work.
Conflicts: active crafting/UI/material writers and L2 custody. Coordinator owns
any `crafting_domain.js`, brewing host, item registry or save-validator change.

**L4, ordered rite and divination query, Sol medium, 1 point.** Grant proposed
`src/cast_divination_adapter.js`, `tests/cast_divination_adapter.test.js`, and
`cast-lives-lanes/MF_DIVINATION_CHECKPOINT.md`. Reuse C12 condition grading,
C13 support and C15 observer knowledge for one prepared paid query with one
consumed result. Include a failed/obscured result and a bounded ordered rite
if the same supported operation chain carries it. Default prepared means,
dial interference/precision, reason contact and interpretation. Target 5–15
candidate steps, ceiling 232 plus unreviewed ritual bucket 438. Test preview
purity, paid attempt identity, recipient isolation and misreading. Coordinate
ritual/ability writers and L5 evidence schema; supernatural transitions and
environment formation require explicit body/place consumers, not a walk receipt.

**L5, knowledge, reading and intentions, Sol medium, 0.75 points.** Grant
proposed `src/cast_inference_adapter.js`, `tests/cast_inference_adapter.test.js`,
and `cast-lives-lanes/MF_INFERENCE_CHECKPOINT.md`. Build one recollection or
testimony to inference to intention to later-action gate chain over C1/C15;
use reading where the known contents support it. Default observer-owned belief,
dial uncertainty and revision, reason limited evidence. Target 15–35 unique
candidate steps across planning/information/reading/observation, not their sum.
Test no truth disclosure, no early knowledge, cancelled/postponed plan and actual
downstream gate. Coordinate B1/D1 constraint/history writers and L4/L6 contracts;
no blanket new goal engine or inference from all 830 planning gaps.

**L6, consequential social exchange, Sol medium, 1 point.** Grant proposed
`src/cast_social_adapter.js`, `tests/cast_social_adapter.test.js`, and
`cast-lives-lanes/MF_SOCIAL_CHECKPOINT.md`. Begin with one request, addressed
reply, explicit acceptance/refusal, worker-owned task and consumed completion
over C1/C4/C19. That provides a small message lifecycle and obligation consumer;
group and moving talk remain named follow-ons where not carried. Default actual
participants and assent, dial delivery/availability/terms, reason independent
people own their effort. Target 10–25 unique candidate steps across social,
message, agreement and direction families. Test unanswered delivery, refusal,
recipient knowledge, absent worker, lost supplies and result attribution.
Coordinate D2 topics, cast schedule and agreed-duty writers; do not mutate
`cast_topic_talk.js` or pretend its effect whitelist includes general duties.

**L7, body, sleep and meal bridge, Sol medium, 0.75 points.** Grant proposed
`src/cast_care_adapter.js`, `tests/cast_care_adapter.test.js`, and
`cast-lives-lanes/MF_CARE_CHECKPOINT.md`. Bind native sleep/recovery ports and
supported food stock to one wake/care/shared-meal chain. Default real body and
household consumption, dial need/recovery rates and allocation detail, reason
physiology and supplies. Target 5–15 candidate steps. Test fact-wake versus
native wake, interruption, absent food and no invented split quantities. Dream
perception has its own situation and observer; do not move the waking body to
simulate a dream. General dream agency and slow hunger/fatigue remain deeper
work if not in this slice. Coordinate H2 and body/routine writers; the coordinator
owns `main.js`, native occupation and save joins.

**L8, ability and conflict consumer, Sol medium, 1 point.** Grant proposed
`src/cast_conflict_adapter.js`, `tests/cast_conflict_adapter.test.js`, and
`cast-lives-lanes/MF_CONFLICT_CHECKPOINT.md`. Bind one reviewed encounter to
C14 with a C13 ability whose effects change the actual move or aftermath.
Default supported ordered moves and source outcome, dial range/stop conditions
and means, reason participants' aims and capacities. Target 8–20 unique candidate
steps across ability/fight families. Test absent source, countered effect,
withdrawal/aftermath, repeated settlement and reload continuation. F1 is a
structural port, not completion of this feature; do not overlap its step-2
writer. Coordinator reserves existing battle/frame/ability/effect files and
preserves legacy draw behavior. New fight draws need stable owned addresses.

Each Sol lane needs one bounded Luna row pass after its contract stabilizes:
0.25 points each, seven distinct private overlays named for L2–L8, granted by
the coordinator after L1. Do not have source and row workers share those files.
Rows alone remain insufficient where the real effect consumer is missing.

### D3: budget and completion boundary

Using the brief's supplied scale, not a live allowance query: L1 0.25 plus
seven Sol lanes 6.5 totals **6.75 weekly-window percentage points**. Seven
follow-up row lanes add **1.75**, giving **8.5** before combined integration;
reserve **0.5–1** for coordinator wiring/checks, total **9–9.5**. These are
capacity estimates, not billed token counts or confirmed remaining allowance.
The scale has high uncertainty: source-lane overrun or failed integration can
roughly double it. L4/L6 in particular may exceed one bounded source lane;
shrink to their stated first chains, then re-estimate before extension.

For each adopted runtime slice: focused system tests in the lane; coordinator
build, full `npm test` once, architecture/rule checks at AD36 stages; fresh-life
or named fixture headless route; rebuilt desktop scene at 1920×1080; meaningful
downstream result; save/reload/Export/literal Import where state changes. Record
bundle/input identity, consumed costs, source fidelity losses and replay step
delta with unique step IDs. A leaf with adapter tests is engine-ready or below
floor until those joins and routes are exercised. Human review is optional.

## O1: separate future suggestions, not required lanes

| Code | Suggestion / trigger | Level / effort | Done check |
|---|---|---|---|
| O1a | Keep a per-step loss vector: means, choice, participant, cost, output, knowledge, timing; trigger when a mapping is proposed | Coordinator data contract / small | Mapping can point to the actual command and consumer; a receipt does not conceal a lost outcome |
| O1b | Reuse stable method/product revisions and attempt identity for queries and making; trigger on first saved attempt | Source / medium | Same pending attempt resumes after Import without re-rolling or changing known products |
| O1c | Add institutional case evidence and witness access when the replay first needs a legal consequence | Sol / medium to large, estimate after that case | Institution acts on received evidence; uninformed officials do not read truth; result changes a real route or duty |
| O1d | Extend language/text products, shared meals and dream agency when a second concrete consumer requires them | Sol plus Luna / medium | Second supported world or activity needs fewer core joins and preserves observer/body ownership |
| O1e | Rank later work by first replay blocker and measured step loss, with cross-world examples kept as palettes | Coordinator / small recurring | New census reports verified step delta and unresolved evidence separately; no inflation from overlapping review buckets |

## A1: checks and handoff

Commands were read-only except creation of this file. Greps/reads establish
implementation evidence, not runtime success. Large combined reads were
truncated by the tool and followed by bounded function/section reads; no claim
of reading the entire 7,761-line life palette or every source file.

| Command / read | Result | Gaps |
|---|---|---|
| `pwd`, `cat AGENTS.md`, `cat docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MF1_MECHANISM_FIT_AUDIT_BRIEF.md` | PASS: checkout and one-output grant established | No code execution |
| `rg -n 'cast-lives\|mechanism.fit\|MF1' /Users/weiwei/.codex/memories/MEMORY.md`; `sed -n '59,75p'` on that registry | PASS: live-owner recovery pointer | Memory supplied no current counts or source claims |
| `cat docs/GROUND_RULES.md docs/RULES_INDEX.md .claude/rules/runtime-code.md docs/MAKING_RULES.md docs/LIFE_SIM_NORTH_STAR.md` | Initial combined output truncated; bounded rulebook and selected life-direction reads followed | Life palette not read end to end |
| `cat docs/WORLD_PASS_RULES.md docs/SITE_AND_EXPLORATION_RULES.md`; `cat .claude/rules/research-and-agents.md` | Applicable audit/source constraints inspected | No source acquisition or reader delegation |
| `git status --short`; later `git status --porcelain -uno` | Extensive unrelated dirty/untracked work observed; preserved | Shared tree is not an isolated verification candidate |
| `cat` / bounded `sed` on X4, RV2, RV4, RV6, H2 checkpoints and lead-life design | PASS: census versions, review/floor limits and direction reconciled | Reports are evidence, not new product authority |
| `rg --files src` filtered for named mechanisms; `rg -n` function declarations and law/sleep/ability consumers | PASS: source carriers located, including narrower institutional and agreement examples | Bounded search does not prove no other implementation exists |
| Bounded `cat` / `sed` on F3's carrier functions and F1 checkpoint | PASS: implementation depth and consumer limits inspected | Static reading; host condition tags not exhaustively traced through every consumer |
| Python JSONL loop over private reviewed verdicts; bounded reread of newly arrived RV8/RV9 | PASS: 225 file records, 70 candidate rows, 155 gaps at closing snapshot; gap reasons/paraphrases/details read | Overlapping records, no unique-step or source reread claim; later arrivals excluded |
| Python Markdown-link, whitespace, lane-count and selected source-symbol check | PASS: links resolve, no trailing whitespace/em dash, 8 lane paragraphs, 5 selected symbols found | Static audit checks, not runtime verification |
| `node scripts/lane_review.mjs --grant docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MF1_AUDIT.md docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MF1_AUDIT.md` | PASS: 0 outside grant | Scanner checks publication names in source/test paths, so does not validate this Markdown's wording |
| Python private-pack name scan and blanket-language sweep of this file | PASS after manual review: 9 matches are ordinary generic mechanism words; no source identities/text in prose | Source module paths are retained as required; scan is not a secrecy proof by itself |
| `git diff --check -- docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MF1_AUDIT.md` | PASS | New-file whitespace also checked directly by Python |
| Build, runtime tests, browser, persistence, commit | Not run | Docs-only audit; no runtime or rule changes |

Closing bounded input identity: SHA-256
`e9a7c36eec4f94513977c42f9c3bd37cf8146b18225d20f1543f1a21b3a95952`.
Computed over sorted paths, each path then NUL then bytes then NUL: X4 checkpoint;
`src/` files `book_world_lotm_brew.js`, `book_world_lotm_pathways.js`,
`book_world_lotm_ritual.js`, `place_act_operations.js`, `cast_topic_talk.js`,
`cast_journeys.js`, `craft_resolver.js`, `structured_ability_runtime.js`,
`conflict_frame.js`, `simulation_effects.js`; and six reviewed JSONL files RV2,
RV4, RV6, RV7, RV8, RV9. Other F3 sources were inspected but are outside this
17-file digest. Shared inputs can change after this snapshot.

Owned file released to coordinator: `cast-lives-lanes/MF1_AUDIT.md`. No other
file was edited by MF1. Findings are source-inspected, agent-reviewed, not
human-reviewed; proposed lanes remain undispatched. The next gate is coordinator
selection and grant reconciliation, followed by each selected playable slice's
AD43 evidence, not approval of this report as new design authority.
