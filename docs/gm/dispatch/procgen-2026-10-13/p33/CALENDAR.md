# AR1: competing plans in a social calendar

2026-10-14. **PROPOSAL ONLY.** Extend root [AR1](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#ar-calendar-and-appointments). [P24 time structures](../p24/TIME_STRUCTURES.md) owns world clocks, recurrence, seasons and countdowns; [P11 M1/M4/M11](../p11/MORE.md) providers/lessons/correspondence; [P31 checkpoint](../p31/CHECKPOINT.md) promises and accepted obligations. P33 proposes booking/conflict presentation and safe missed-invitation semantics over those owners. P31 files were still being authored during this inspection; its final contract must be refreshed before integration.

## AR1.1: Persona inspiration, qualified

STATED-primary: ATLUS [Persona 5 Royal official site](https://persona.atlus.com/p5r/sp/?lang=en), school/day/night activities and Confidants sections, supports classes, friends, after-school/seasonal activities and relationship development. P33's calendar booking algorithm, resumable lessons and miss policy are INFERRED/ORIGINAL adaptations. The public page does not certify a complete slot algorithm or arbitrary missed-date penalty. Credit ATLUS; no dialogue or source graphics copied.

## AR1.2: live calendar audit

SHOWN/SOURCE: `src/game_time.js:18-41` advances native minutes through 30-day months/12-month years; 63-73 derives seasons; 77-87 and 188-190 contain distinct time-of-day/night signals. Use the named applicable signal, not a guessed shared night threshold.

`src/chronicle.js:43-47,73-89` retains dated scheduled/open/resolved/missed invitations; 103-114 exposes next boundaries and expiry; `src/event_feed.js:10-20,101` projects invitations and later missed reports. `src/chronicle.js:93-100` validates its calendar anchor against the enrolled expansion clock. `src/main.js:7214-7215` pauses joined advancement for certain waiting choices/manual encounters. `src/audit_remainder_livelihood_facts.js:63-65` binds a local work window to native calendar/expansion anchors. `src/feature_expansion_destination_native.js:8-20` retains a separate absence-frozen instance calendar.

INFERRED: clocks and dated invitation paths exist, but the inspected paths lack a general multi-person reservation/conflict calendar for lessons, dates and deadlines. Native calendar may advance before expansion enrollment, as P2's report explicitly notes. AR1 must map clock domains, preserve already-admitted times and hook the existing scheduler; a new `setInterval` or wall-clock deadline cannot safely substitute.

## AR1.3: invite is not promise

| State | Proposed meaning and consumer |
|---|---|
| Offered/known | Invitation received, host and window known; no automatic player obligation or resource debit |
| Tentative | Personal reminder, no capacity claimed unless host explicitly holds it under shown terms |
| Accepted | P31 creates actual commitment; calendar references its reservation/terms and participants |
| In progress | Existing action/job owner consumes eligible time and means; calendar only projects it |
| Completed | Actual lesson/date/service result from its owner; no reward from checking a box |
| Declined/expired | Unaccepted opportunity ends quietly; optional later report, renewed occasion or alternate provider |
| Missed accepted appointment | Frozen terms decide cost/refund/social response; explain and reschedule where supported |

Absence from an unaccepted date must not count as betrayal. Accepted obligations can carry fitting consequences, but are never invented from browsing. A future romance/date requires willing actors and actual interaction; a generated invitation is not instant affection.

Logical calendar entry: appointment ref, host/participant actor refs, place/service ref, local clock/anchor revision, known earliest/latest times, duration/travel estimate, recurrence key, invitation delivery ref, commitment ref, reservation refs, visibility and settlement status. Money/stock/jobs/promises live in their current owners. Store a minimal appointment record there or join it into their agreed shape; calendar is a view and conflict query, not another booking database.

## AR1.4: competition that keeps options reachable

Two plans conflict only if the same real participant, station, tool, route or interval is exclusively required. A passive brewing vessel can operate while the hero meets someone only where the P2/CR3 selected unattended policy permits it. Date overlap does not imply the entire questline is mutually exclusive.

Expose supported combinations: attend a shorter segment, reschedule, negotiate duration, request recorded/self-study material, delegate eligible work, attend a later recurrence, travel by another route, finish one early, accept both nonoverlapping parts or decline. Some exact historical occasions can end; preserve alternative paths to the broader method/relationship where fitting, without fabricating another identical unique canon event. Immutable past and reachable future alternatives coexist.

Original evening fixture: a maker offers an assay lesson 18:00-18:20, a friend suggests a walk 18:10-18:40, and an accepted delivery has a real latest handover 18:30. Show travel plus duration. Known options include deliver before 18:00, move the walk to 18:35, arrange an actual helper, or choose a later lesson. Do not auto-reserve all three; stale acceptance rechecks provider and shared capacity atomically.

World adjectives specify flexible, punctual, seasonal, recurring, remote-capable, recorded, exclusive or urgent. A serene sect can have renewable lessons; an exam has its selected source conditions. No global daily action cap or fixed once invitation law. Rest, training, creative work and optional meals are legitimate plans without hunger death or required eating. Cross-world calendars use separate lanes until a real clock/travel conversion exists.

## AR1.5: idle-safe time policy

Unaccepted invitations expire at their declared eligible game-time boundary, produce an optional safe report and leave ordinary work progressing. Acceptance displays the existing absence/time policy before committing. This packet does not enable closed-browser progress. Continued game-time idle can run lawful jobs and expire opportunities; real-world absence alone creates no missed appointment, debt or death unless a separately accepted clock law authorizes it.

Only actions already requiring a manual response should pause under their existing contract. Adding a calendar cannot freeze the game for each new invitation. If a scheduled date becomes impossible because the provider leaves or a supported rescue changes attendance, retain cancellation and return actual escrow under terms. Handle month/year boundaries, loops, travel and changed body/availability using P24/P16 adapters; a refresh does not create a new recurrence.

## AR1.6: visible outcome and gates

At 1366x768 propose today's known commitments and near opportunities beside ordinary actions, with an expandable conflict pane showing time, travel, participant and actual consequence. 1600x1000 adds the week/context view. Filters separate tentative/accepted/expired; inaccessible or unknown dates are not exact countdowns. Mobile deferred.

Future first journey: receive two original invitations, accept a real paid lesson after conflict check, keep it or cancel/reschedule, let the other pass, read its later report and obtain a useful alternate lesson path. All gates OPEN: same resources/provider cannot double-book; failed payment/save leaves reservation and money unchanged; missed unaccepted invitation causes no penalty/pause; accepted terms create only supported consequences; large and subdivided eligible advances settle identically. Save/reload/literal-file Import preserve pending terms, recurrence/anchors and exact stock. Old saves retain their existing clock/invitation behavior; no synthetic booking history. Browser/build and human calendar feel remain unverified.
