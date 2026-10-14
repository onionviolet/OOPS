# AA1 extensions: journeys between authored nodes

2026-10-14. **PROPOSAL ONLY.** Extend [root AA1](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#aa-journeys). Reuse [P9 profile rules](../p9/PROFILE_RULES.md): generate encounters and conditions, never geometry, roads, inns as new map nodes, or canon landmarks. An inn scene attaches to an authored stop or an explicitly authored service on an edge. [REPORT](REPORT.md) records the bounded live audit and future gates.

## AA1.1: make the journey a saved commitment

The proposed player loop is choose a known destination and travel policy, start with actual means, encounter a fitting situation, respond or let an agreed safe policy act, arrive with a changed person/object/relationship, and recognize that consequence later. Quiet uneventful journeys stay possible. More content means generating the particular cast, need, conditions and consequences of a supported situation, not merely choosing a decorative sentence.

Proposed journey join, not an existing API: ID/cause, traveler and actual body, world/instance/branch, from/to, authored itinerary revision, current edge/segment ordinal, elapsed/remaining played minutes, declared travel mode, companions and occupancy reservations, cargo refs, known quote, clock/absence policy, incident refs, selected response receipts and arrival/cancel receipt. Funds, life, inventory, people and weather remain in their owning systems. P1 owns draws; the journey retains draw receipts and resolved incidents rather than a second mutable RNG owner.

Live groundwork is narrower. `src/main.js:1508-1529` saves Frontier from/to/remaining/startedAt and advances actual consumed clock time. `src/main.js:2177-2180` selects that seam after freight introduction. The legacy path at `src/main.js:2233-2234` advances travel time after changing location. Neither is automatically a universal edge itinerary. `src/pathfinding.js:91-115,124-150` builds authored connections and returns rounded shortest distances, without predecessor/path output. First slice can bind one directly authored edge; a later itinerary adapter must retain actual intermediate edges before admitting an edge-specific inn or encounter. Do not infer the traveled road from the destination name.

## AA1.2: five incident families with actual consumers

| Extension | Generate from actual context | Reachable responses and consequence |
|---|---|---|
| AA1.2a encounters | Eligible travelers, local needs, arrival windows, current cargo/transport and introduced or witnessed identities | Help, bargain, escort, investigate, pass, return with means, or fight through a supported encounter. A successful repair changes that same cart's usable state and pays an actual fee; passing creates no fabricated universal grudge. |
| AA1.2b weather | Existing weather exposure and authored route susceptibility, never a fresh contradictory storm roll for every traveler | Shelter, use held waterproofing, hire a covered carrier, slow down or continue. Change declared duration/cargo exposure only. Ordinary unfed play remains comfortable; no hunger death. |
| AA1.2c breakdowns | Actual vehicle/tool condition and load under a selected opt-in condition law | Repair with compatible parts, commission help, split cargo, cache in actual custody, walk or turn back. A missing spare cannot delete unrelated inventory. No random wagon damage if no wagon exists. |
| AA1.2d fellow travelers | Same person ID, itinerary overlap, contact/perception/language and independent intention | Shared leg, conversation, paid guidance, temporary company, disagreement or parting. Familiarity is earned through actual shared time/events, never a new friend reward for every mile. |
| AA1.2e inns and stops | Authored venue/service, opening hours, actual rooms or service capacity and known terms | Rest, listen, read, trade, seek a teacher, send mail, camp where permitted, or skip. A room booking does not transfer the inn's stock; an overnight account grants only what the speaker knew. |

One situation may combine these families: rain exposes a loose cart cover; a traveler knows a qualified repairer at the next authored inn; a performed repair later earns a referral. The supported causal chain creates new content. The storyteller can weight new admission but cannot create the rain, failure or referral retrospectively to fit a desired dramatic arc. [P12](../p12/CONTRACT.md) organizes beats; [P20](../p20/CHECKPOINT.md) owns place memory; [P11 N1](../p11/REQUESTS_AND_MARKETS.md#n1-generated-requests-and-quests-from-actual-needs) owns funded work.

## AA1.3: meaningful preparation, direction and recurrence

Per-edge adjectives can be sheltered, busy, tidal, reliable, hazardous, patrolled, seasonal, enchanted, instantaneous or inexhaustibly serviced. They declare eligibility and supported effects, not a global threat rate or fixed once rule. A completed repair occurrence settles once; a later actual breakdown or new client can renew work. A known repeatedly safe shortcut can become ordinary useful infrastructure rather than scaling its danger to keep the player weak.

Preparation opens combinations: expertise plus tools, a guide plus compatible body, paid transport plus cargo rights, or sourced movement magic plus its actual passage law. Do not assume teleportation experiences every foot-road card, nor that flight encounters a ground toll. An exceptional route remains reachable when its means exist. Walking remains useful without mandatory ration micromanagement. P8 [LOGISTICS](../p8/LOGISTICS.md) owns load/condition; P10 owns body/contact/passage compatibility.

Each incident binds direction, segment, visibility and cause. Outbound help can be remembered on return; it is not redrawn by opening a route panel. Independently moving caravans on the same road can witness the same weather but have different breakdowns. Reversing direction consumes the real traversed return duration; it does not restore spent parts or erase a loan.

## AA1.4: idle without absence punishment

Admission chooses a readable policy: continue through harmless texture, perform preauthorized bounded repairs/services from a reserve, stop before a new consequential choice, or turn back when declared means are exhausted. These can combine by incident class. No new financial commitment, contract sacrifice, lethal outcome or defection is chosen merely because the player stopped clicking. A waiting choice stops only its supported journey scope when the selected host supports that; first implementation must honestly expose broader pauses if it reuses a global waiting host.

Closed-browser catch-up is a separate clock-owner gate. [Timeline T4](../../../../TIMELINES_AND_DIVERGENCE.md#t4-give-parallel-worlds-independent-state-and-selected-clocks), [intro OT1-OT10](../../../../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md#round-12-derived-snapshots-and-offline-branch-time-2026-10-14) and [P16 idle](../p16/IDLE_AND_EVENT_STORIES.md) own that question. The proposal here is pause before unsupported danger and preserve the offered choice and remaining route. Absence never becomes mourning debt, abandonment, hunger death or a worse encounter seed. Optional meals improve a journey only through actual benefits.

## AA1.5: P15 extension, not another prose engine

Extend [P15 T2/T4](../p15/RUNTIME_TEXT.md) with frame fields for witnessed segment, current mode, observed weather, actual affected object, known repair terms, witness and remaining commitment. Extend [P15 V2/V4](../p15/DIALOGUE.md) with traveler/host topics and one existing Ink scene for a consequential inn meeting. A generated person needs the single-identity bridge noted in P15 F3 before becoming an Ink speaker.

Extend [P15 A3/QA3/QA5](../p15/AUTHORING_PIPELINE.md) with incident entries that declare allowed edges/modes, exposure cause, real consumer, alternate means, pause/cancel, and witness policy. Review a mini-batch containing one traveler need, one weather response, one breakdown, one meeting and one authored inn service. Missing engine support yields UNKNOWN, not an invented opcode. P14 owns account/chronicle retention; the arrival text consumes receipts.

First proof AA1-A: one authored direct road, one introduced repair customer with funded fee and one useful preparation alternative. Naturally obtain means, start travel, preserve a pending interruption, repair or pass, arrive, then meet the same person with the correct consequence. Repeat a later genuinely funded occurrence. Gates: source-qualified eligibility; no generated geometry; segmented versus bulk advancement agree; pure preview; exact pending/completed Save/reload/Export/literal-file Import; safe cancellation/refund and stale quote rejection; rebuilt 1366x768 plus 1600x1000 route/choice/result; human fiction acceptance separately. All OPEN.
