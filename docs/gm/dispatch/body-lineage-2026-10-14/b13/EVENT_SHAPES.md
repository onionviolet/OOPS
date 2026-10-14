# B13 investigation card shapes and seeded draws

2026-10-14. **Original proposals, docs only.** Uses [E2](../../../../emergent/E2_STORYLETS.md), [E7](../../../../emergent/E7_OBSERVATION_AND_MYSTERY.md), [P24 information](../../procgen-2026-10-13/p24/INFORMATION.md) and [diagnostician means](DIAGNOSTICIANS.md). These shapes do not register new runtime content. Public examples are ordinary original questions; no live sealed truth or secret ID is authored here.

## Current carrier, refreshed after concurrent integration

SHOWN/SOURCE at final read: main now [imports storylet definitions](../../../../../src/simulation_content.js:1) and [appends their families](../../../../../src/simulation_content.js:133). The initial read lacked these files; that absence is superseded. [P3 report](../../../../../.claude/worktrees/proc-p3-storylets/docs/gm/dispatch/procgen-2026-10-13/p3/REPORT.md) states source/build/native/persistence proof for its own Village slice. B13 has not rerun or certified it, nor established current served bytes.

Main [card constructor](../../../../../src/storylet_content.js:16) uses ordinary event fields plus nested `storylet:{deck,urgency,weight,cooldown,once,family,fallback}`. E2's top-level `cast`, `choices`, `needs`, scoped `blocks`, autonomy scorer and traveling actors are broader draft proposals, not this constructor's implemented API. P3 binds one fixed contact; a general multi-role diagnostician cast remains a join. A person's title does not provision diagnostic means.

Default: reuse the four Village decks and ordinary `ambient`/`offer` paths; use soft offers for optional investigations. Dial: other-world decks or an authored crisis after their actual clock/cast/interruption owners exist. Reason/cost: played scheduling and known urgency, not mandatory clicking. Main [waiting choice](../../../../../src/simulation.js:85) excludes flagged nonblocking decisions; [occurrence creation](../../../../../src/simulation.js:407) flags drawn storylet decisions. Unrelated decisions retain their own pause policy. Do not assume E2 scoped activity pauses exist.

## Card families

Each family describes eligible cause, actual choice and changed consumer. Weights and time windows are illustrative pace choices. New BC observations need actual means/occurrence support; condition tests and long studies need real commands/jobs. A card drawing is not itself a test, cure or body change.

| ID / shape | Deck, mode and eligibility | Choices and real output | Default + Dial; reason and cost |
|---|---|---|---|
| ES1 Notice a tell | `village.daily`, ambient; present observer detects an actual BC occurrence or an account arrives | No response required; write a scoped observation, possibly a known enquiry lead. No explanation from hidden tags | Default base weight 2, cooldown 120 played min; Dial passive notices or active inspection. Attention/exposure is the reason; no reward or test fee needed |
| ES2 Compare a condition | `village.people`, offer; known observation and an available fitting medic/means | Compare dated observations, commission a scoped test, ask for care, or defer. Result includes negative/inconclusive; care can proceed without mechanism proof | Default weight 3, lifetime 90; Dial recurring care or exact scanner. Chosen service/time/sample cost; no timeout diagnosis or autospending |
| ES3 Functional comparison | `village.chances`, offer; known performance and supported task/control | Try another grip/method, inspect a routine, ask a teacher or decline. Completion changes instruction/tool preparation if the real comparison supports it | Default weight 3, cooldown 240; Dial queued multi-session study. Actual work time/materials or free demonstration; no arbitrary lifelong test limit |
| ES4 Accounts disagree | `village.people`, offer; two actually received claims on the same scoped question | Compare coverage/source chain, ask a witness, annotate uncertainty or defer. Retain both claims and any new correction | Default weight 2; Dial legal/archive or multi-branch memory enquiry. Access/copy/contact cost or none; disagreement does not create a culprit |
| ES5 Act before certainty | `village.people`, offer; known need and a supported intervention | Care, use an aid, change instruction/task, retain a regimen or defer. Record what was done and observed outcome separately from whether the theory was correct | Default weight 3; Dial high-stakes treatment with explicit commitment. Actual quoted costs/risks; no secret correctness in price or button labels |
| ES6 Disclose or conceal | `village.people`, offer; actor holds an account and a real reachable recipient/channel | Tell a known person, send a scoped report, keep it private, challenge a certificate or withdraw a public claim. Recipient learns on receipt; response reads their own belief | Default weight 2; Dial court, clan, criminal accusation or scent counterplay. Messenger/access/reputation consequences follow actual disclosure, not a town-wide knowledge flag |
| ES7 Qualify a discovery | `village.chances`, offer; admitted route result or an independently supported expert enquiry | Review permitted findings, pursue another known route, use supported knowledge or defer. Advance only the secret/diagnosis scope actually established | Default existing known enquiry; Dial world-specific awakening/ancestry route. Means/service or exact free reading. No rare draw guarantees a hidden answer |
| ES8 Remember and verify | `village.people`, offer; BC8/BC9 experience recalled or reported | Record a fragment, compare an independent record, speak to a qualified seer, visit a known site or decline | Default optional journal; Dial supported dream/soul reading. Memory/travel/access cost; no invented past life or teleported clue |

`onExpire` closes this invitation, retains already learned evidence and records the missed contact only when witnessed/received. A later actual contact can reoffer. A real worsening condition belongs to its condition/clock owner, independent of whether the player answered a card. Default no escalation solely from timeout; Dial world-qualified urgency with declared cause and free available alternatives. B13 adds no `once:true` anti-abuse rule. A specific occurrence is settled once; later real occurrences remain reachable.

## Coverage bindings

| Public code | Primary shapes | Evidence dependency / useful consumer |
|---|---|---|
| LA1 | ES3, ES5 | Angle comparison → fitting handle or work plan |
| LA2 | ES2, ES5 | Condition/recovery observation → supported care or shift change |
| LA3 | ES3, ES4 | Prior practice/learning records → revised instruction |
| LA4 | ES3, ES4, ES7 | Taught gesture versus independently tested faculty → teaching/access claim |
| LA5 | ES2, ES3, ES5 | Routine/exposure history → preparation retained or changed |
| LA6 | ES2, ES3, ES4, ES5, ES6 | Exposure/sample comparison → care, source removal or qualified accusation |
| LA7 | ES2, ES3, ES5 | Gait/rest/baseline → work adaptation or aid |
| LA8 | ES4, ES5 | Willing account/scoped reading → chosen task/support |
| LA9 | ES3, ES4, ES7 | Full trial record and independent route → useful preparation, mechanism still scoped |
| LA10 | ES3, ES4, ES5 | Method/practice/preference → fitting lesson/career choice |
| LA11 | ES3, ES4, ES6 | Visual/nonvisual interaction → chosen communication/counter |
| LA12 | ES4, ES6, ES7 | Scoped kin/record proof → claim, recognition or privacy choice |
| BC1 | ES1, ES2, ES7 | Warmth/coverage → LA5 or qualified body enquiry |
| BC2 | ES1, ES3, ES6 | Animal response → handling/presence enquiry |
| BC3 | ES1, ES3, ES7 | Actual plant response → supported exposure/affinity enquiry |
| BC4 | ES1, ES4, ES6 | Work marks → conversation/skill/history enquiry |
| BC5 | ES1, ES4, ES6 | Ring mark → private vow/record enquiry |
| BC6 | ES1, ES3, ES6 | Odor plus reference/custody → tracking/exposure enquiry |
| BC7 | ES2, ES4, ES7 | Dated recovery → care/carrier enquiry |
| BC8 | ES4, ES7, ES8 | Frozen recollection → independent verification |
| BC9 | ES4, ES7, ES8 | Local familiarity → site/record/scoped link enquiry |

## Logical assembly shape

This is compiler input, **not valid drop-in event data**. New fields belong to the selected question/protocol/account adapter and P14, not to invented simulation effects. The compiler emits ordinary validated effects only after the actual evidence/means resolver exists.

```text
questionRef: original.local.meal-enquiry.<occurrence>
subjectRef, observerRef, contextRef, actualCauseOwnerRef
knownObservationRefs, arrivedClaimRefs, independentSourceRefs
candidateProtocolRefs, knownContactRefs, intendedConsumerRef
cardShape: ES2
compiledEvent: stable definitionId, actorId, targetId, mode, label,
               requires, responses[{id,label,requires,costs,effects}], onExpire
storylet: deck, urgency, weight{base,plus}, cooldown, once:false, family, fallback
```

For a first bounded bridge, bind one already introduced subject/contact per event. A doctor can deliver an attributed report about that subject without pretending `$doctor` is an existing effect selector. Broader distinct subject/doctor/witness casting requires explicit identities, roles and shared adapter work. Do not silently reuse Sela as every doctor, patient and witness. [Current selectors](../../../../../src/simulation_contracts.js:39) are `$actor`, `$target`, `$party`, `$spawn.*` or stable IDs.

Admission facts name known evidence and held means with explicit defaults for the selected slice. Main [rules](../../../../../src/rules.js:15) require a known child for negation; `not(missing == true)` is not an eligible blank default. [P3 defaults](../../../../../src/storylet_deck.js:24) cover only its existing flags/items, not proposed `body.enquiry.*` facts. A test resolver can use private truth internally; choice visibility, label, preview, price and recommendation order must follow admitted knowledge, not hidden correctness.

## Seeded commitment

| ID | Seed/draw owner | Proposed B13 use and limit |
|---|---|---|
| SD1 | Existing `deriveSimulationSeed(simulation.seed, 'deck:'+id)` in [deck initialization](../../../../../src/storylet_deck.js:10) | Reuse four independent saved deck RNG records. Card selection chooses a delivery opportunity; it does not decide body truth |
| SD2 | [Sorted candidates and weights](../../../../../src/storylet_deck.js:29) | Hard means/context/known-evidence admission; duplicate-open and cooldown filters; conditional plus, seen decay, family damping and pity. B13 does not add truth-specific premium weights or force “correct” readings |
| SD3 | [One xorshift32 selection](../../../../../src/storylet_deck.js:43), [quiet and receipt](../../../../../src/storylet_deck.js:61) | `r * (quiet + sum(weights))`, walk stable card order; remainder is quiet. Save consumed RNG, selected card and receipt. Preview/feed/People rendering consumes no draw |
| SD4 | World/body owner, K1 fixed truth; K2 supported distribution; K3 explicit world binding | A lazy body mechanism that already affected events must resolve consistently with those events. Testing never redraws a K1 answer. Only explicitly authored K3 can bind at first observation |
| SD5 | Proposed protocol commitment, only if its resolver genuinely needs noisy sampling | Key by context/subject/protocol/sample occurrence and revision. Derive an isolated seed from the agreed stream authority, commit the noisy observation transactionally and save result/next state. Reopening one receipt repeats it; a later real sample can differ. No random failure for an exact deterministic means |
| SD6 | Proposed wording/cast commitment | Freeze permitted wording and actual identities before display, from safe observation/account inputs. Do not draw in UI rendering or choose a hidden culprit because the player guessed. Reuse existing cast/text authority; no extra timer |

SD5/SD6 are proposed joins, not fields supported by P3's deck validator. Use the integrated seeded-stream owner when implementation is selected; do not add another global RNG. Main [due processing](../../../../../src/storylet_deck.js:48) advances schedules outside eligible Village without drawing and defers when three cards are open. That is current pacing, not a biological/testing lifetime limit. Played clock remains authoritative; this packet introduces no offline simulation.

Author-only receipts can contain candidate weights. Player receipts show only admitted explanation such as “you received a dated report.” Top candidate IDs, hidden-family counts or seed values must not be exposed by a normal “why now” hover. A genuine See power can reveal only its actual scope and still obey sealed discovery. Event IDs and save/export metadata also need the selected builder's disclosure review.

## Three example journeys

**J1 / LA1 + BC4:** observe a familiar tool grip → ask a master or inspect the tool → compare another supported angle → record an inconclusive or technique-specific result → adapt the handle or training. A second witness repeating the master is not independent evidence. A wrong recruitment label can lead to a poorly fitting job; correcting it preserves demonstrated mastery.

**J2 / LA6 + BC6:** receive two illness accounts and one odor report → preserve the real retained sample/custody → ask a medic or commission a scoped assay → retain both the preliminary diagnosis and result → choose care/source control or withhold accusation → share only through a real recipient/channel. A failed/expired sample spends only declared supported costs and leaves an inconclusive reading. No toxin, attacker or cure is generated by story text.

**J3 / BC8 + BC9:** record a remembered fragment → reach an already known site or obtain an independent record → compare before a seer receives suggestion from the player → record a qualified route result → use only the established knowledge. Agent reports use the world-qualified secret ID, route and status; this public packet has no answer fixture. Ordinary familiarity is a valid outcome, and a route can remain unresolved.

Each journey is specified, not played. Proposed consequences need real work/care/access/communication consumers. P3's existing fever notice or XP reward is not proof of a toxin assay, body diagnosis or generic investigation handler.

## Player delivery and durable records

| Surface | Current evidence | B13 proposal / needed join |
|---|---|---|
| Storylet responses | [P3 event shape](../../../../../src/storylet_content.js:16); [event response transaction](../../../../../src/simulation.js:430) | Show known question, current observation, available protocols, costs and free defer. Busy checks and stale validation remain; pending test completion requires actual job/resolver support |
| Feed lead | [player-discovered events](../../../../../src/event_feed.js:37), [storylet destination](../../../../../src/event_feed.js:43) | “A report is ready” opens `storylet_panel`, with actual contact/place gating. `public:true` is appropriate only for this admitted player-facing occurrence; hidden NPC readings use private records |
| Recent news | [eight-entry cap](../../../../../src/event_feed.js:102); [UI render](../../../../../src/event_feed_ui.js:41) | Occurrence labels give noticed/received facts; a separate delivered result event or explicit known-result projection supplies actual findings. Current resolved news repeats the original label, so it cannot serve as the sole assay result archive |
| People/Notebook | [knownPeopleView](../../../../../src/people_knowledge.js:12), [provider merge](../../../../../src/people_knowledge.js:81) | Introduced subject, attributed dated reading, coverage and correction trail. Add an explicit provider. Current feed and People code do not generically render every new knowledge prefix |
| Action hints/errors | [predicate vocabulary](../../../../../src/simulation_contracts.js:28) | Known missing means only; no named undiscovered alternative or private result in tooltip/error/accessibility text. “Not established by these means” for absent coverage |

Target: desktop/laptop 1366x768. Visible outcome: a lead opens responses while People keeps dated evidence/correction available; news can scroll without losing the authoritative record. No new separate window. This is unrendered design; mobile optimization deferred.

Default persistence: old saves absent from the selected enquiry stay absent; no retrospective symptoms, body truth, dream or diagnosis fabricated. Dial: an explicit player-selected new enquiry or a compatible imported record, labelled by origin. Any new claims/protocol/sample/commitment records require migration or explicit additive compatibility and validation. Pin minimal active evidence outside terminal-event/feed pruning; later compaction must preserve scope, contradicted/corrected status and source lineage needed by a consumer.

## Specified future acceptance cases, all OPEN

| Gate | Observable done check |
|---|---|
| G1 Cause/means | LA1 two-angle comparison and LA6 exposure/assay with alternative and inconclusive controls. Truth predates tests, absent means reveal no cause, stronger exact means give their full supported answer |
| G2 Consequence | A wrong read changes a supported assignment/care/claim action and incurs its actual quoted cost; a correction enables a useful change while retaining the old account. Unrelated control stays unchanged |
| G3 Determinism | Same saved seed/context yields identical next draws and pending results; previews/feed/People are pure; changed seed can vary deliveries without rewriting canon/body law; a new sample differs only where the resolver allows it |
| G4 Disclosure/communication | Hidden NPC diagnosis does not become news; actual delivered account appears with attribution and date. Before/after route checks inspect DOM, accessibility, errors, labels, prices, sort order and receipt metadata. Reports print secret IDs/routes/status only |
| G5 Native/persistence | Selected builder tests/builds its owned candidate, proves served bytes and natural desktop 1366x768 acquisition → test → result → changed action, plus Save/reload/Export/literal-file Import at pending and corrected states. Old-save absence and malformed-import rollback pass. Director fiction/pacing/balance remains separate |
