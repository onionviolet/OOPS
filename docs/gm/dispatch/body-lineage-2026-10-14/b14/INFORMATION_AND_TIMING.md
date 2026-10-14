# B14 information and timing: G66-G67

2026-10-14. Original proposals, docs only. SI1-SI6 and ST1-ST5 retain their
palette meanings. SI8-SI9 and ST8-ST9 are proposed additions; intervening codes
are left available for root integration. [EVENT_SHAPES](EVENT_SHAPES.md)
specifies deterministic binding and transaction rules; [REPORT](REPORT.md)
records source evidence and open gates.

## Ownership and records

[B2 observations](../b2/SPEC.md#g24-b23-knowledge-and-size) are field-scoped
claims, not a second body. [B7 §C5](../b7/CONSISTENCY.md#g48-b7c5-observer-claims-remain-outside-generation-truth)
requires body/epoch/observer/method/origin refs, with truth and perception
separate. [B13 investigations](../b13/PAIRS.md) and [breadcrumbs](../b13/BREADCRUMBS.md)
own tests/tells and inference limits; [B12 HOOKS](../b12/HOOKS.md) and [NO_CONSUMER](../b12/NO_CONSUMER.md)
now specify micro-state consumers and gaps. Join actual implemented receipts
when available, not assumptions about proposed small modifiers.

[P24 information §O2.2/O3](../../procgen-2026-10-13/p24/INFORMATION.md#o22-claims-and-corrections-remain-attributed)
joins P14 claims/belief episodes and P11 transit. [P19 gossip](../../procgen-2026-10-13/p19/GOSSIP.md#g52-truth-claim-transmission-and-belief)
joins contact/source independence. [P23 inner life](../../procgen-2026-10-13/p23/INNER_LIFE.md#m3a-dramatic-irony-without-thought-policing)
reads self-suspicions without forcing player ignorance. No B14 confidence store
replaces these proposed owners. Shown/stated/inferred is an evidence basis;
seen/interpreted/understood is an existing learning stage. Neither is a numeric
confidence probability.

Minimum proposed body-test attachment to a P14 claim:

```text
claimRef, observerPersonRef, subjectBodyRef, sampleOrEpochRef,
observedAt, reportedAt, receivedAt?, clockBindingRef,
protocolRefWithRevision, operatorRef, calibrationRef?,
testedPathsAndScope, conditionsRef, resultRef, unitsOrRange,
limitsRef, sourceRootRefs, disclosurePolicyRef,
supersedesClaimRefs[], knownApplicability: current | dated | disputed | unknown
```

An internal applicability check may know the body changed; public wording may
change only from elapsed known time, a received update, or a supported sense.
A diagnosis can remain confidently wrong. “Dated report” is not “false report.”
No unobserved revision difference, hidden deadline or sample ID can act as a
public clue. Keep technical references private; public labels identify only
known records and routes.

## Information rows

World examples are original adaptation dials, not authenticated canon protocols.
Tests require an actual resolver. A bribed printed result changes an account,
not physiology or the assay's underlying truth.

| Code / row | State needed and owner | Player delivery and consumer | Default + per-world dial, reason and cost |
|---|---|---|---|
| SI1 Measurement error | B2/B7 tested subset and sample/epoch; B13 protocol/operator/reference scope; P24/P14 separate raw finding, reported claim, calibration and noise draw | E20 dated result card gives a qualified range/category and inconclusive option. Compare, commission independent test or act cautiously. A forged certificate remains separate from the real result | Default authored categorical uncertainty, no fake decimals. Dial `resolution/noise`: Frontier craft measure, D&D supported divination, HP local examination, TTKS faculty test. Paid operator/time/sample or exact free faculty where sourced. Repeating the same saved sample is not a new draw |
| SI2 Stale knowledge | B7 body epoch and observation date; P24 validity scope, received change account and supersession. Current truth remains with actual body/faculty owner | E21 bio/report wording: “Recorded before your last known change; not rechecked.” Only after a known change or disclosed age rule. Offer retest or keep dated report. Existing skill knowledge is untouched | Default show known date and limits. Dial `reviewCadence`: MoL changing device/body context, ASL roster examination, HP records; medical shelf-life rules only if authored. Time/service is the retest cost; stale report grants no automatic debuff or hidden-change warning |
| SI3 False precision | P24 units, protocol resolution, estimated vs exact mode, quantization/rounding and author calibration; B7 observer projection of the claim | E22 instrument card says “Display estimate” and known resolution, or exact reading if justified. Dialogue can challenge the display. Action quotes continue using their actual owner, not a diagnostic estimate | Default categorical/range output. Dial `displayAuthority`: TTKS/Shadow Slave status-style skin only if the selected means supports it; D&D ritual reading; Frontier ruler. Cost is access/calibration or none. A true exact reader is allowed; interface style alone does not make it exact |
| SI4 Confidentiality | P14 record custodian/access policy and copy/account identities; P19 disclosure/contact; actual sample custody owner separate; B7 observation recipient scope | E23 records-access offer shows scope/custodian. Authorize a scoped copy, refuse, redact, bargain or use supported illicit access. A later leak appears only after real delivery. Removing a file does not erase minds | Default named recipients, preserved provenance. Dial `recordControl`: ASL issuer, HP registry, LOTM/COI private organization, original open clinic; law/enforcement qualified locally. Costs are service, privacy exposure or actual leverage, not automatic universal confidentiality |
| SI5 Self-knowledge lags | B7 NPC and self observation times plus actual sensory/care contact; B2 current function; P24 delivered notice, P23 optional suspicion | E24 companion notices a supported changed grip before you identify it. Ask, test, observe later or ignore. Bio does not auto-name latent function. NPC knowledge stays private until this conversation | Default one ordinary report, not immediate naming. Dial `selfSense`: D&D supported internal sense, TTKS appraisal, MoL instrumentation; exact self-reader may remove lag. Cost is attention/test time; active function can work unnamed |
| SI6 Partial truth | B13 protocol coverage and alternative hypotheses; B7 tested paths; P24 claim scope, untested residual and actual functional consumer | E25: “The test checked circulation under this load.” Use that evidence for the supported task, seek another test or keep an unresolved cause. No empty genome or blanket fitness certificate from a narrow negative result | Default one scoped finding. Dial `coverage`: Frontier hand/tool fit; HP particular examination; TTKS energy circulation; D&D soul/body tests distinct. Time/material for wider means; powerful broad tests allowed if actually supported |
| SI8 Withdrawal of access is not forgetting, NEW | P14 custodian permission edition, existing received copies/beliefs; P19 revocation contact; B7 observer already-known facts; sample/copy owner holds actual possession | E26 permission change card separates future record access from what was already received. Return a physical sample/copy through custody, negotiate or retain learned knowledge under local law. Observer bio keeps dated known facts | Gap: revocation, possession and memory get conflated. Default revoke future access only. Dial `revocationMeans`: HP registry permission, LOTM/COI sourced exceptional memory operation, D&D pact clause. Actual recovery/enforcement costs; magical forgetting needs its own mechanism and affected scope |
| SI9 Correlated evidence and unit mismatch, NEW | P14 source-root lineage and units/protocol editions; P19 delivered copy/contact; P24 independence/comparability check; B13 same-scope comparison | E27 conflicting certificates disclose shared origin or different units only when those facts are known. Authenticate source, convert qualified units, repeat independently or remain uncertain. Belief confidence changes only with a real basis | Gap: two stamped copies can look like two tests, and different scales can fake a change. Default source/date/unit attribution. Dial `standards`: ASL forms, MoL laboratory measures, D&D local units, TTKS rank test editions. Archive/test time; true independent readings can corroborate |

## Clock and delayed-state contract

[P24 time §Q0-Q4](../../procgen-2026-10-13/p24/TIME_STRUCTURES.md#q0-use-the-actual-clock-domain)
owns explicit world/instance/branch/calendar binding. B2 holds native physical
state; B7 proposes qualified NPC development and event-time anchors. Existing
condition/source/job owners continue to own their actual effects. Proposed
delayed body transitions belong to the selected modification/development owner,
not the feed or a JavaScript timeout. B14 supplies content references only.

Minimum future pending transition:

```text
transitionRef, bodyRef, sourceOrExposureReceiptRefs,
ruleRefWithRevision, admittedCauseRef, expectedOwnerRevision,
clockBindingRef, elapsedBasis: localPlayed | biologicalExposure | sourcedOther,
dueAtOrPredicateRef, nextBoundary, frozenInputsRef,
state: pending | ready | applied | canceled | unresolved,
settlementCauseRef?, cancelOrMigrationPolicyRef, disclosurePolicyRef
```

Root must choose the actual owner/schema. Pending jobs are used only if their
real consumer performs this transition; they are not repurposed as empty
countdown rewards. A simple timer costs one compact pending row per distinct
effect but also needs validation, boundary resolution, cancellation, exact
body binding, save/import, suppression policy and observer-safe publication.

Default uses supported played/local time and no closed-browser bodily history.
Calendar, biological exposure and message transit can differ. Native calendar
is not automatically expansion time. Chunked advancement resolves due changes
in canonical order; source settlement precedes derived report/contact. Leaving
a realm follows its selected clock policy. Body replacement transfers only
what the faculty/exposure carrier permits. Loops/branches require a P16/timeline
manifest; file load is not a fictional reset. No device-clock aging is added.

## Timing rows

| Code / row | State needed and owner | Player delivery and consumer | Default + per-world dial, reason and cost |
|---|---|---|---|
| ST1 Delayed effects | Actual modification/exposure receipt, target body, rule/epoch, saved due boundary or biological trigger; B2/B7 current physiology; P24 time mapping and observer claim | E28 follow-up offer or actual expression sensation appears at the supported boundary. Test, prepare, reverse if possible or wait. A known appointment can show a countdown; hidden expression cannot be announced early | Default one authored reversible local transition if selected. Dial `delayBasis`: Frontier treatment minutes; TTKS development stage; HP sourced potion; other long-latency worlds qualified. Time, input/care costs are actual terms; clean immediate effects remain possible |
| ST2 Critical windows | B7 biological stage/exposure + actual method prerequisite; technique/teaching owner alternatives; P24 window binding; P23 chosen ambition | E29 training invitation shows known opportunity and alternate route. Start supported practice, seek another method, commission help or postpone. Missed path becomes different, not all learning impossible | Default opportunity window rather than lifelong aptitude cap. Dial `windowHardness`: D&D species stage, TTKS source-qualified opening, MoL appointment rather than assumed biology, HP class access. Time/tuition vs later method effort; original mundane model avoids unsupported medical precision |
| ST3 Latency | Real exposure/curse receipt and carrier, progression rule and symptoms under condition/modification owner; B7 knowledge lag; P24 elapsed basis | E30 actual symptom or delivered risk report allows monitor/care/countermeasure/ignore. Unknown incubation date is not a visible timer. A negative early test records its detection window | Default no disease simulator enabled by prose. Dial `incubationPolicy`: D&D sourced curse, ASL qualified exposure, LOTM/COI distinct supernatural dependency. Costs are supported countermeasure/time; no random hidden terminal harm during ordinary default idle play |
| ST4 Thresholds | Owning accumulation meter/rule, saved sampled inputs, previous side of threshold, hysteresis/reset rule if needed, effect receipt; B2/B7 consumers; P24 boundary | E31 crossing line or safe trend report. Adjust regimen, seek a purifier, continue or exploit a supported threshold. Effective function changes exactly when its owner's predicate qualifies | Default one selected existing accumulation/condition adapter, no new global toxicity. Dial `thresholdRule`: TTKS elixir residue, Frontier supported wear, D&D field exposure. Cost is actual reversal/change route; no universal compensating flaw. Crossing/reset/re-crossing may recur under the local rule |
| ST5 Seasons of a body | Local calendar/region or sourced phase, B7 physiological stage, conditional faculty owner; P24 season/exposure binding | E32 known favorable interval offers fitting task/alternative schedule. Active bio shows only known supported state. Conditional faculty actually alters a registered action if enabled | Default calendar texture or existing chronotype effect when integrated. Dial `phaseSource`: Frontier native season; D&D local moon rule only if sourced; TTKS conditional faculty; MoL daily work schedule. Planning/travel costs; no Earth-calendar or universal full-moon multiplier |
| ST8 Known appointments versus actual changes, NEW | P24 scheduled check/care ContactEpisode, due window and missed status; body transition independent; P19 terms and later report | E33 missed follow-up notes what was actually missed, not “you rejected care.” Rebook, receive delayed report or continue. A missed visit need not halt an already-supported healing process | Gap: offer expiry is confused with bodily settlement and intention. Default nonblocking follow-up. Dial `appointmentPolicy`: ASL examiner shift, HP office hours, MoL lab access. Cost is real delay/availability; no invented deterioration or guilt from a timeout |
| ST9 Result arrives after the body changes, NEW | P24 sample time, body epoch, deliveredAt, claim edition and known update; B7 old sample immutable; P19/P11 transit | E34 arriving certificate is dated to the tested body state. Compare with known changes, order a fresh test or use its valid historical facet. An unknown later change does not make the UI warn cryptically | Gap: sample, assay and delivery clocks race. Default explicit known dates. Dial `transitDelay`: D&D correspondence, HP office queue, ASL processing, MoL shared lab; instant supported channels remove delay. Queue/service/retest costs, no reroll of the frozen assay |

## Per-world information/time profiles

Each row names a knob. Its selected world's profile pins these common inputs;
values remain configurable palette choices and stronger readers require source
qualification. No world below is newly implemented by this packet.

| World | Knowledge default / dial | Timing default / dial |
|---|---|---|
| Frontier | Dated practical observation; calibrated tool for exact dimensions | Explicit native/expansion mapping; minute treatment or native season |
| HP | Attributed registry/examination scope; selected magical reader can be broader | Selected office/potion calendar; no exact fictional day from chapter order |
| D&D | Local test/divination scope; chosen setting/edition permits exact powers | Species/calendar/pact clock declared separately; no universal moon cycle |
| ASL | Local issuer/operator and records; stronger institutional access is scoped | Unit duty/examination interval; source-qualified long exposure if needed |
| TTKS | Particular faculty test, not universal purity certainty | Actual body stage, method and local calendar; critical windows sourced |
| MoL | Continuous visitor observations and device protocols | Existing continuous branch; memory/body reset belongs to a future explicit loop |
| LOTM | Received account and selected sense/protocol | Specific mechanism/dependency, not generic psychological decay |
| COI | Separate source/era protocol and boon scope | Distinct local layer/boon/ritual policy, never inherited from LOTM by name |
| Shadow Slave | Known observation; source-qualified status capability if present | Selected faculty/body timeline; no assumed flaw or forced latency |
| Anime/manga/other | Quiet categorical account until this setting has a reader | Local calendar/played policy until its developmental law is qualified |

## Live consumers and proposed disposition

**F11 SHOWN/SOURCE:** `src/people_knowledge.js:31-34,61-65,97-103` projects
received knowledge values/time and attributed reports. It has no generic test
range/epoch/conflict UI. Add an observer-safe domain projection; do not render
raw attachment objects or infer clinical truth from these text fields.

**F12 SHOWN/SOURCE:** `src/character_bio.js:15,28-31` hides expired conditions
and displays remaining game minutes for visible active ones. It is not a future
mutation scheduler and does not show every past resolved condition. A dated
body observation and a pending hidden effect need separate projections.

**F13 SHOWN/SOURCE:** `src/event_feed.js:37-55,87-102` excludes the global
simulation log, shows discovered current-world occurrences, selects certain
knowledge prefixes, waits for player completion receipts, and caps news at eight.
A new `body.*` key is not automatically feed-visible. Add a recipient-safe
provider rather than expose the global log. Preserve test/transition state
outside this ephemeral outlet.

**F14 SHOWN/SOURCE:** `src/simulation.js:401-414,425-445,459-468` freezes event
responses/expiry, applies response effects on detached plans and uses a common
boundary scheduler. Terminal display events prune over 100. Use that scheduler
through a declared body-transition adapter; an expired offer alone cannot enact
a physiological change. `src/simulation.js:85,110` shows blocking discovered
player decisions without `nonBlocking`; integrated storylet decisions are
exempt. Subtle cards default to `offer` or `ambient`.

**F15 SHOWN/SOURCE:** `src/npc_lives.js:24-42` validates schema1, bounds and
birth/marriage/death event kinds; advances news by year and shows joined people.
There is no diagnostic event kind, biological exposure or developmental delay
there. Keep its legacy outcomes exact. A new age/body adapter uses B7's separate
qualified body state, not extra unchecked schema1 keys.

**F16 SHOWN/SOURCE:** `src/game_time.js:18-41,63-81` provides native minute/date
advancement, a 360-day calendar and season/time slots. Native and expansion
clock mapping must be declared, not inferred from a year field. P24's clock
claims are proposal joins until checked against the selected host.

Unrun acceptance must compare one large advance with equivalent chunks, save
before/after due time, cancel/rebind a body, reject unsupported schemas and
failed storage, restore literal imports, and prove no undisclosed countdown or
hidden applicability leak. View-open/reload must not generate evidence.
