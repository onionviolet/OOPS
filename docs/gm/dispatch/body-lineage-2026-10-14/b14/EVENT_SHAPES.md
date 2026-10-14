# B14 seeded event shapes

2026-10-14. Forty-one original **specified, not run** card shapes. They cover
all 30 existing SS/SP/SI/ST/SC rows, ten proposed new rows and one additional
SS4 leak-delivery stage. These are content recipes, not a registered deck or
claims of playable events. Public fixture seeds and names below are original;
no live sealed secret, real save or reserved canon person is used.

## EV1 Admission contract

Read qualified body/person/world/instance/branch refs and known context through
[B2](../b2/SPEC.md), [B7](../b7/CONSISTENCY.md), [P19](../../procgen-2026-10-13/p19/CONTRACT.md),
[P23](../../procgen-2026-10-13/p23/INNER_LIFE.md), [P24 information](../../procgen-2026-10-13/p24/INFORMATION.md)
and [P24 time](../../procgen-2026-10-13/p24/TIME_STRUCTURES.md). Owner shorthand
is defined in the four topic documents. B12 [HOOKS/NO_CONSUMER](../b12/NO_CONSUMER.md) and B13
[protocol/cast](../b13/DIAGNOSTICIANS.md) / [seeded shapes](../b13/EVENT_SHAPES.md)
are now delivered proposals. They provide input refs when subsequently implemented. A proposal mention is
not a runtime prerequisite that magically becomes available.

A recipe is admitted only if its target function, actual cast, scope, contact,
required input availability and player-safe wording are valid. Canon people,
lineages, unique powers, locations and outcomes are source-reserved. Select
original local actors, a specifically qualified adaptation, or an explicit AU.
No generated body truth is derived from a rumor or from choosing a card.
Missing required means yields ineligible/unresolved, not a fabricated doctor,
certificate, condition, plot casualty, lab or employer. A useful physical
function can operate before anyone knows its name.

Logical binding, exact future schema/placement for root integration:

```text
BodyMomentBinding
  id, recipeId, recipeRevision, causeRef, ordinal,
  worldProfileRefWithRevision, scopeRefs, bodyRefs, participantRefs,
  requiredActualInputRefs, observerEvidenceRefs, knownContextSnapshotRef,
  eligibilityOwnerRevisions, orderedCandidateRefs,
  seedAnchorRef, drawReceipts, frozenVariantParams,
  occurredAt, admittedAt, clockBindingRef,
  mode: ambient | offer, responseRefs, expiryPolicyRef,
  actualConsequenceRefs, retentionRefs, publicationPolicyRef,
  status: admitted | open | settled | expired | canceled | unresolved
```

Bind to existing domain receipts wherever possible. P19 episode, P23 stance,
P14 claim, body transition and actual work state remain their own authorities.
The card stores references and the minimum frozen parameters needed to replay
its presentation and result. It does not duplicate a whole body, genome,
relationship, biography or time ledger. New necessary metadata uses a versioned
extension and real-envelope migration chosen by root.

## EV2 Exact seed proposal and fixture convention

For this packet define a **proposed** pure content draw, not an existing export:
`FNV1a32(UTF8(JSON.stringify(tuple)))`, unsigned 32-bit, initial 2166136261,
for each byte `h = imul(h XOR byte, 16777619) >>> 0`. Tuple is the fixed-order
array `[seedAnchor, worldInstanceRef, branchRef, recipeId, recipeRevision,
causeRef, ordinal, drawSlot]`; all strings/integers are validated. There are no
unordered objects or concatenated ambiguous IDs in the tuple. Pin this algorithm
revision; any integrated P1 replacement needs an explicit compatibility adapter,
not a silent re-roll. It is not cryptographic and exposes no secret state.

Stable ID-sort **eligible public candidates** before selecting
`hash % candidateCount`. Modulo selection is acceptable for this proposed small
content palette, not a calibrated genetic or diagnostic probability model.
Distinct slots are `cast`, `object`, `wording`, `protocol`; do not reuse a
personality/name/genetics stream. Empty required lists fail admission. A draw
selects an existing compatible candidate/wording; it does not summon means.
An optional single-candidate or authored variant uses index zero without a
random draw. Noise belongs to a qualified test owner with its own calibrated
saved sample/assay draw, never the wording slot.

Use public fixture `worldInstanceRef='original.b14.lab'`, `branchRef='a'`,
`recipeRevision=1`, `causeRef='fixture:E##:cause1'`, `ordinal=0`. Each E row
supplies seedAnchor 14001-14041 and eligible variation categories. These are
concrete inputs for a future determinism fixture, not computed example rolls.
Names Mara, Vale and Tovin are original eligible cast labels, never joins by
name. Cast candidates must already have qualified person IDs and contact.
Two seeds may produce the same wording; variety is not guaranteed or evidence
of correctness. The same admitted inputs must reproduce the same binding.

Seed inputs and draw receipts stay internal. Public projections contain only
observer-safe names/text/actions. Do not leak latent body IDs, a sealed path,
secret slot counts, truth-dependent disabled reasons, candidate order or early
timer through DOM/accessibility/search/tooltips. Unknown facts cannot be
reverse-engineered from a meaningful price, variant or unavailable option.
A legitimate authorized discovery route can supply a new known input later.

## EV3 Choice, clock, expiry and publication

Seed chooses the presentation/binding. Player interpretation and action remain
explicit. The consequence resolver reads actual means and this participant's
beliefs, not a generated paragraph. Validate detached plans, expected revisions,
stock/time/rights and frozen job terms. Commit through the owning durable host,
then publish the event/account. Failure restores the prior live/stored state;
retry of the same cause uses its frozen result and no new reward/draw. Current
native ticks do not become per-tick atomic storage merely because B14 describes
this contract. Qualify actual persistence boundaries for the selected adapter.

Each shape has at least two named response routes, or an ambient line with two
optional follow-up routes. Display only actions whose known prerequisites can
be explained without leaking truth. An eligible action still may return a real
negative or inconclusive result. Fees/minutes/stock come from a pinned actual
quote. Preview exact known cost and any uncertainty; no unpublished random
charge, free estate copy or repeated payment for the same outcome.

Expiry codes used by every card:

| Code | Policy, owner and why |
|---|---|
| X0 | Ambient, no expiry or forced response. Optional follow-up is a normal action; no timeout means a chosen attitude |
| X1 | Optional reflection/disclosure/request offer remains available while its stated practical prerequisites hold. Close on superseding evidence, departure or explicit dismissal; no automatic cost/endorsement. No modal pause |
| X2 | Real appointment/rule window with bound local opens/closes. Expiry means appointment unavailable; later report/rebooking requires means. Accepted terms, if any, have their own disclosed settlement policy |
| X3 | Card is a report of an actual timed state change. Transition settles in its owner regardless of card reading; report remains dated. A hidden timer is not publicly counted down |

Default no device-clock/offline consequences. Each recipe binds the supported
local/played clock and selected realm absence policy. Psychological waiting is
not biological exposure; letter delivery is not sample time. Real body changes
and due jobs settle before dependent reports. Equivalent chunked advances must
agree. A superseded pending target follows its declared rebind/cancel policy;
never apply a native body's effect to a new possessed host by display-name match.

Every recipe retains `causeRef + recipeRevision + ordinal + recipientRef` for
publication dedup, plus actual consequence identities. New distinct meaningful
causes can recur under local cadence. No universal once/day/three-hop limit.
Critical obligations/samples/pending transitions/source roots survive feed or
memory compaction. Biography may summarize them but cannot restore authority
by parsing prose. Changed rule revisions retain grant lineage and do not pay
again for one cause.

## EV4 Social shapes

World knobs and costs come from the cited row in [SOCIAL](SOCIAL.md).
Quoted text is original public fixture wording, not source prose. `quote` means
real pinned price/time/terms, not a made-up currency reward.

| ID / seed / row | Eligibility, required binding and seeded variation | Player-safe card and choices with real consequence | Clock/expiry and retained result |
|---|---|---|---|
| E01 / 14001 / SS1 | Real co-present requester, observed capacity claim, existing carry/work method and free job slot. Cast slot picks compatible requester; object slot picks a compatible real crate/tool task | “Mara asks about moving the long crate.” Accept quoted task reserves actual inputs; propose a fitting method/help uses its real operator; decline records the response only. Directed reaction is issuer-specific, not guaranteed offense | X2 appointment or X1 request. Retain accepted terms/job receipt, observer basis and P19 response; no task completed from accepting text |
| E02 / 14002 / SS2 | Present observer can see supported sleeve/grip/voice cue. Wording selects pause/glance/polite adjustment supported by that scene; no hidden intent slot | “The clerk pauses over the sleeve measurement.” Ambient. Ask records an attributed explanation if given; continue leaves the cause uncertain. No fee or reputation change from looking alone | X0. Retain only a consequential observation/episode; otherwise pure saved-context texture. Rendering draws nothing |
| E03 / 14003 / SS3 | Real culture norm and contact; observer knows gesture/address instruction or can ask. Object chooses a local qualified greeting | “Vale offers the local greeting.” Follow known custom records witnessed courtesy; ask obtains instruction/time quote; use alternate communication or decline follows actual local response, without inferring body sex | X1, or X2 only for an actual ceremony. P19 episode and known etiquette remain; expiry is not deliberate disrespect |
| E04 / 14004 / SS4 | Subject already knows the scoped finding, recipient exists/contact reaches them, disclosure terms supported. Protocol slot picks a compatible limited scope, never a hidden answer | “Share this finding with Tovin?” Share creates recipient-specific account and terms; narrow scope shares only its known part; keep private grants no recipient knowledge. Preview known privacy consequence | X1. Retain account/recipients/terms/cause. New trust does not automatically disclose another field |
| E05 / 14005 / SS5 | Actual comparison episode and delivered remark, not a guessed envy score. Cast chooses a present relevant peer; wording selects an ambiguous supported remark | “You make that look easy.” Ask clarifies that person's stated meaning; discuss actual practice reveals chosen known history; leave preserves ambiguity. Subsequent help uses supported directed state if it changed | X1. Retain attributed account and actual response; a smile is not a permanent condescension diagnosis |
| E06 / 14006 / SS6 | Real issuer/office, display site, audience, disclosed trait scope and funded terms. Cast/object selects a compatible actual invitation | “The institute requests a demonstration.” Accept limited terms books real time/pays only funded amounts; negotiate a narrower demonstration changes terms if agreed; decline leaves no owed service. Harsh authority needs a separate qualified premise | X2. Keep terms, booking, public disclosure and withdrawal receipt; timeout does not enroll the actor |
| E07 / 14007 / SS7 | Delivered hearsay with retained source roots and known claim. Wording operator selects omission or range exaggeration allowed by sender belief; never changes true body | “The market account has grown in the telling.” Ask source records an actual reply; send scoped correction through supported channel; ignore/exploit changes only real acts. Useful later hiring reads recipient belief | X1. P14 editions/beliefs + P19 contact + P11 delivery; same-origin repeats remain one origin |
| E08 / 14008 / SS8 | Known practical need, actual tailor/tool/communication provider and compatible operator. Object selects wider grip, sleeve fit or written explanation only if available | “What adjustment would help?” Request quoted fit reserves real stock/work; use an available alternate method; decline or request privacy reveals no diagnosis. A useful job must demonstrate the changed fit | X1 request/X2 booked service. Store accommodation agreement/work/result, not a genetic conclusion |
| E09 / 14009 / SS9 | Known body/presentation change, same qualified person, old local recognition account and real gatekeeper. Protocol selects compatible witness/credential route | “Your old record needs a current introduction.” Give known evidence updates this observer after validation; request witness starts real contact; keep separate identity or leave uses actual access rules. No universal credential revocation | X1. Preserve prior dated claim, new scope, recognition decision and unchanged person identity |
| E12 / 14012 / SS4 | Actual breach/disclosure and completed report route; recipient can know only the leaked subset. Cast selects an existing reachable messenger, not a magically aware rival | “A report says your private finding was passed on.” Check chain tests custody/account; negotiate containment changes future delivery; challenge or ignore produces actual response. No accusation of intent without evidence | X1. Keep leak origin, recipients, terms and delivered correction. Revocation cannot undo already learned knowledge |

## EV5 Psychology shapes

Controls and dials come from [PSYCHOLOGY](PSYCHOLOGY.md). All feelings below
are offered wording requiring a selected interpretation, never compulsory
facts inferred from anatomy, loss or a deadline.

| ID / seed / row | Eligibility, inputs and seeded variation | Card and response consequences | Clock/expiry and retained result |
|---|---|---|---|
| E10 / 14010 / SP1 | Known gifted function + actual first-use/control receipt. Wording picks unfamiliarity, curiosity or readiness suggestion from profile-allowed families | “How do you read that first success?” Endorse unfamiliarity records P23 stance; choose readiness/another meaning records that choice; request supported practice reserves its quote. Dismiss alters no faculty | X1. Keep chosen/suggested status and cause separately; no hidden stat loss or power from endorsing words |
| E11 / 14011 / SP2 | Received specific role expectation and actual issuer/terms. Object slot picks an available named duty, not an invented blood debt | “What place do you want in this role?” Accept chosen terms creates a real commitment; renegotiate uses issuer willingness; decline/reform/leave needs the local route. Private resentment is never inserted by seed | X2 role deadline or X1 discussion. Preserve demanded vs accepted terms and endorsed aim separately |
| E13 / 14013 / SP3 | Actual known survival/loss event and permitted affected cast; wording chooses memorial, gratitude or practical aid invitation, no death roll | “There is room to mark what happened.” Arrange supported memorial/aid spends quoted means; reflect chooses interpretation; continue grants no guilt, power or punishment. Safe joyful meaning is allowed | X1. Keep actual event and optional endorsed meaning; timeout is neither shame nor a refusal to mourn |
| E14 / 14014 / SP4 | Actual known lost/suppressed capacity and remembered supported task. Object selects a still-possible teaching/substitute/recovery route | “The method remains familiar; its old means are missing.” Use quoted aid/substitute performs a real job; teach retained knowledge through real instruction; seek recovery or move on changes selected aim only until an operation completes | X1. Body/source loss, retained mastery and chosen meaning stay separate. Capacity return need not erase grief |
| E15 / 14015 / SP5 | Known body change or encountered reflection, person-selected presentation and profile-approved meaning suggestions. Wording chooses comfort/curiosity/uncertainty, with neutral available | “How would you like to meet this reflection?” Keep current presentation costs nothing; choose real tailoring/style uses quote; calibrate movement uses practice operator; dismiss creates no identity drift | X1. Persist chosen presentation/meaning through their owners, not inferred SG1/SG3 |
| E16 / 14016 / SP6 | Delivered scoped correction to a self-label's factual basis. Cast selects a real witness/teacher only for a contact route | “The record changes one claim about the line.” Preserve cultural belonging retains label with qualified wording; revise chosen label updates P23; investigate starts real protocol. No earned skill/office removed by narration | X1. Retain old and new account plus self-label revision; legal/faculty changes need their own owner |
| E17 / 14017 / SP7 | Actual visible condition resolution or fulfilled obligation. Wording selects supported sleeve, breath, ease-of-work or quiet-thanks detail | “The sleeve no longer catches the tender spot.” Ambient only if physically supported. Continue ordinary work; share thanks through real contact; optional reflect records relief only when chosen. No extra reward | X0. Use resolution receipt, optional life moment and P23 endorsement, never reactivate injury on reload |
| E18 / 14018 / SP8 | Real known successful supported attempt, current physical capability and existing concern/neutral assessment. Object selects an executable supervised/checked method | “That attempt worked; what would help next time?” Revise confidence updates chosen association; retain caution leaves it; book actual practice spends time. A method grant requires completed instruction and a useful next action | X1. Preserve physical result, mastery and confidence independently; a single success is not universal healing |
| E19 / 14019 / SP9 | Actual new comfortable affordance/first/hobby experience; enjoyment is selected or asked, not read from performance. Object chooses a supported craft, sound, food or style | “Would you like to do more with this?” Enjoy quietly changes no obligation; pin hobby sets ambition ref; share result uses contact. Queuing work requires explicit actual budget/stop terms | X1 or X0 moment. Keep real first separately from meaning; no daily happiness maintenance or gift because text is positive |

## EV6 Information shapes

Scope, method and world knobs come from [INFORMATION_AND_TIMING](INFORMATION_AND_TIMING.md).
Real assay outcomes remain with the body/test owner; seed here binds a valid
protocol or presentation, not the answer.

| ID / seed / row | Eligibility, inputs and seeded variation | Card and response consequences | Clock/expiry and retained result |
|---|---|---|---|
| E20 / 14020 / SI1 | Actual assay result, frozen sample/epoch, operator and calibrated uncertainty. Protocol slot selects only a supported alternate available test | “The result lies near the test's boundary.” Read qualified finding; commission independent retest pays its own quote/sample/draw; act cautiously uses actual means. Inconclusive is a complete valid result | X1 report, X2 test appointment. Retain assay/claim/calibration and independent samples. Reprint/open/reload does not reroll |
| E21 / 14021 / SI2 | Old known finding plus received/known relevant change or disclosed review rule. Wording chooses dated/pre-change phrasing, not hidden-revision warning | “This report predates your last known change.” Keep dated report for its historical scope; book current test; ask clinician. New finding does not overwrite unrelated mastered knowledge | X1. Pin dated claim and supersession; truthful appearance remains unchanged if only an unknown body change occurred |
| E22 / 14022 / SI3 | Known display/protocol and actual resolution metadata. Wording slot picks approximate/range/exact only from that protocol's supported mode | “What does this display measure?” Ask/calibrate obtains genuine scope; use existing exact means pays quoted service if any; proceed with estimate. No “exact” word selected from tone alone | X1. Retain protocol revision, units and result limits; actual costs/actions use their own resolver |
| E23 / 14023 / SI4 | Real custodian, held record/copy/sample, actual access policy and contact. Protocol slot picks a compatible redaction/scope | “Who may receive this record?” Authorize named scope creates delivered account/copy only through means; redact or refuse; request supported illicit route uses actual law/enforcement. No global audience | X1/X2 custodian appointment. Keep permissions, physical custody and received knowledge independently |
| E24 / 14024 / SI5 | Observer holds a real noticing receipt preceding subject's self-observation; real contact completes. Cast selects eligible noticing person | “Vale noticed your changed grip.” Ask receives their scoped account; perform real comparison; leave it unnamed. Actual body effect may already work; subject does not receive diagnosis without means | X1. Freeze observation/arrival times and evidence; absence of contact keeps subject knowledge unchanged |
| E25 / 14025 / SI6 | Scoped known test with explicit untested facets and actual practical consumer. Object chooses the validated job facet | “This test covered circulation under one load.” Use supported job within that scope; request another actual protocol; preserve uncertainty. No “all clear” certificate from narrow finding | X1. Keep coverage/negative result and method context, not a fabricated zero for every untested trait |
| E26 / 14026 / SI8 | Actual access-policy revision and received revocation; existing accounts/copies. Cast selects the real custodian | “Future access has changed.” Return a real copy/sample via custody; negotiate access; retain already learned facts subject to local law. Supported memory operation needs a separate explicit route | X1. New permission edition, old receipt and actual possession survive; no erasure from policy wording |
| E27 / 14027 / SI9 | Two received claims; known or investigable root/unit metadata and actual comparison means. Protocol selects root-authentication or scale-conversion route | “These certificates may not be independent.” Verify origin/convert qualified units using real records; commission a genuinely independent assay; leave disputed. Discovering common root is itself evidenced | X1. Retain editions/root lineage/conversion basis; no confidence boost from two copies of one result |

## EV7 Timing shapes

These recipes require the selected actual transition or appointment owner.
Body report text never performs a mutation, disease advance or time reset.

| ID / seed / row | Eligibility, inputs and seeded variation | Card and response consequences | Clock/expiry and retained result |
|---|---|---|---|
| E28 / 14028 / ST1 | Real saved delayed operation due under bound body/clock/rule, with supported self-sensation or delivered follow-up. Wording selects only a supported observation | “You notice a change while using the familiar tool.” Observe/test obtains scoped finding; choose actual reversal if supported; continue uses changed actual capacity. Known follow-up can be offered before hidden expression, without answer | X3 transition, X2 appointment. Retain pending/applied cause/body/epoch and observer report. Save before due does not advance it |
| E29 / 14029 / ST2 | Known body/method or real teaching window and at least one supported later route if promised. Object selects available practice/teacher | “This method fits the current opening.” Book real training reserves time/stock; choose fitting alternate; postpone leaves later route. Source-qualified absolute windows may close this specific method only | X2. Keep eligibility/booking/actual learning. Deadline expiry is not “lost all ability” |
| E30 / 14030 / ST3 | Real saved exposure rule with actual symptom or received risk report; protocol selects supported care/monitoring | “A follow-up may help explain the change.” Monitor records actual observations; seek countermeasure uses real operation; continue follows selected exposure policy. No visible timer to an undisclosed curse or terminal result | X3 symptom + X1 enquiry. Keep exposure/sample/detection-window/settlement, no hidden illness generated from card |
| E31 / 14031 / ST4 | Actual accumulation owner crossed a qualified boundary; known sensation/test supports disclosure. Object chooses available regimen or purifier | “The recent work feels different.” Inspect obtains supported trend; change regimen/seek real reversal; continue/exploit under its rule. No threshold named before its route is known | X3. Retain prior/next boundary state, crossing cause and reset policy; genuine reset/re-crossing can produce new episode |
| E32 / 14032 / ST5 | Bound local phase/stage and known conditional function, with actual task/operator. Object selects a currently compatible work route | “This is a fitting interval for the familiar method.” Queue quoted task under explicit policy; choose another time/route; enjoy texture if no mechanical adapter. Existing open card does not reroll at season boundary | X2 fitting window or X0 texture. Retain phase basis, sampled policy and actual job receipt; no device date |
| E33 / 14033 / ST8 | Real expired follow-up appointment, known schedule and supported rebooking/report channel. Cast chooses actual available service provider | “The follow-up appointment has passed.” Rebook pays actual terms; ask for arrived report; continue. Physiology changes only under its independent existing cause | X2 then dated report. Store missed appointment and later contact; no forced refusal/guilt or invented deterioration |
| E34 / 14034 / ST9 | Real delivered assay from earlier sample/epoch, plus any actually known later change. Wording chooses plain dated result or known-pre-change explanation | “Your report has arrived for the earlier sample.” Read its historical finding; compare known changes; order fresh test. A stopped messenger produces no early result | X1 report. Keep sampledAt/assayedAt/receivedAt/body epoch and immutable assay; delivery never re-tests current body |

## EV8 Consequence shapes

Affected means, costs and world knobs come from [CONSEQUENCES](CONSEQUENCES.md).
Positive, neutral and cleanly resolved outcomes remain available alongside
friction. A card cannot invent authority, stock or a punitive law.

| ID / seed / row | Eligibility, inputs and seeded variation | Card and response consequences | Clock/expiry and retained result |
|---|---|---|---|
| E35 / 14035 / SC1 | Known actual specialization/function and supported tasks with comparable quote. Object chooses a real task/tool pair | “This handle fits one method better.” Use specialist task applies its real function; adapt tool or choose broad alternative spends actual quote; keep current profile. No universal unrelated debuff | X1/X2 job. Retain function revision/method/work receipt; admitted paid terms do not silently change mid-job |
| E36 / 14036 / SC2 | Actual footprint changed a supported local input/organism, affected actor observed it or a report arrived. Cast/object selects real affected neighbor/site | “The neighbor reports a change near the worksite.” Compare actual exposures; mitigate/redirect using supported means; continue or share benefit follows local rules. Report does not prove intent or universal ecology | X3 actual effect, X1 response. Preserve exposure/resource/cause/audience; no-contact neighbor stays unchanged socially |
| E37 / 14037 / SC3 | Real affected person/guardian/controller seat, authority/age/content prerequisites, proposed operation and stated wishes. Object selects safe care/education fixture, not generated marriage | “Who should decide this adjustment?” Subject accepts/defers/refuses; guardian seeks supported advice or renegotiates. Actual procedure requires its own informed terms/costs. Coercive world route remains separately sourced | X1/X2 procedure. Retain proposed vs accepted terms, subject view and completed physical receipt; later refusal changes future choices |
| E38 / 14038 / SC4 | Witnessed demonstration delivered to actual organizer with rule authority, funded event and norm edition. Object selects real rule proposal | “The organizers want to review the event rules.” Provide scoped testimony; propose division/test/unchanged rules; enter another real event. Ratification and notice, not the card, change future eligibility | X2 hearing. Retain demonstration/rule revision/decision/delivery; already earned reward not silently confiscated |
| E39 / 14039 / SC5 | Known fit/need and real maker/site/input quote. Object selects existing sleeve/chair/handle solution | “The old fit no longer suits this work.” Commission/borrow/adapt real equipment; use another method/site; solve with supported power. No automatic starvation or maintenance damage | X1/X2 service. Save measurements, quote, stock, receipt and useful fit result, not a negative hidden modifier from prose |
| E40 / 14040 / SC8 | Existing living-provider service, real departure/change plan, actual dependents and substitute options. Object chooses a supported backup/installation | “How should this service continue?” Book backup/teach/build through real means; withdraw under terms; keep providing. Self-sustaining result genuinely ends dependence if its mechanism supports it | X2 service boundary. Keep contract/availability/reservations/substitution/cancellation and actual continuity result |
| E41 / 14041 / SC9 | Actual resolved need/completed duty releases known time, stock or slot; no pending claim on that capacity. Object selects compatible optional use or quiet | “The adjustment has freed this appointment.” Use it for supported work/help/recreation with fresh explicit quote; leave it free. No automatic spend, new crisis or second reward | X1 or X0. Release receipt remains job authority; P23 optional aim and P19 help response reference it |

## EV9 Existing event adapter and additional work required

**SHOWN/SOURCE:** `src/simulation_content.js:105-111` registers static labels,
responses and expiry effects. `src/simulation.js:401-414` stores copied label,
responses, roll and discovery on occurrence, prunes terminal display instances,
and `425-445` settles response effects. This can host a selected authored
variant with current supported effects. It does not provide a generic B14
seeded casting/grammar/claim/timer assembler. Qualify the current stream/deck
contract for the selected new metadata or add a versioned detached binding
adapter before calling this entire palette registered.

Final source refresh detected concurrently integrated P3 files. Main now imports
and appends storylet definitions at `src/simulation_content.js:1,132-133`.
`src/storylet_content.js:16-21,75-80` uses nested storylet metadata and one fixed
contact. `src/storylet_deck.js:29-40,43-73` performs sorted weighted selection
with saved xorshift32 deck state/receipts; it already separates selection from
rendering. Reuse that selection path for an eligible fixed local B14 card;
EV2 proposes only a separate deterministic cast/wording binding when needed,
not replacement of the saved P3 deck stream. Broad casting/test/transition
adapters and any new saved metadata still need explicit validated extensions.
B13's final report independently records this source arrival; B14 reran no P3
runtime/build/persistence proof. The initial absence was superseded, not left
as a required integration gate.

`src/event_feed.js:38-47` reads discovered occurrences. Storylets route to
`storylet_panel` in Village, field cards to their panel, and ordinary cards to
the workshop in Village/Shack.
`src/event_feed_ui.js:32-36` disables unknown-person controls and can prompt
meeting the craftsman. `src/simulation_ui.js:30-35` hides that panel outside
Village/Shack or without the known craftsman. A per-world skin is insufficient:
non-Frontier cards need a real local response host, location/participant route,
known cost preview and focus proof. `src/storylet_ui.js:13-27` also limits its
host to Frontier/Village and
replaces open response nodes when its signature, including clock, changes.
The feed's keyed lead buttons are not proof of response-button focus retention.
Do not rename either local host to make another world appear supported.

Default mode is `offer` for choices and `ambient` for moments.
`src/simulation.js:85,110,407` blocks ordinary commands for discovered player
`decision` events unless `nonBlocking` is true; drawn P3 decisions set that
flag. A selected genuinely urgent decision would need separate
explicit control/pause terms; none is introduced by these subtle shapes.

## EV10 Future acceptance matrix, all OPEN

| Gate | Concrete later check |
|---|---|
| SEED | Same committed seed/cause/cast/revision produces same variant, outcome refs and next independent draw across render order, reload and equivalent advance chunks. New causes may recur; no variant changes on hover or dismissal |
| KNOW | Direct observation, attributed report, inference and actual body truth remain distinct. No-contact observer and unknown-body-change control gain nothing. Shared origin/unit mismatch and partial/negative/inconclusive tests retain their limits |
| ACTION | Each selected mechanical card changes one real task/relationship/permission/function through its declared owner. Ambient/reflective cards explicitly remain texture; successful strong alternative may resolve the issue without penalty |
| DURABLE | Generated old-save fixture and new fixture: pending and completed Save/reload plus Export/literal-file Import preserve binding, sample/epoch, terms, actual effect, body refs and next draw. Unsupported versions/stale plan/failed write preserve previous bytes and no partial result |
| UI | Rebuilt fresh origin at 1366x768, controls and ordinary idle job usable while optional card waits; local route and keyboard focus work; long known text readable with independent panels retained. Inspect DOM/accessibility/tooltips/sort/errors for hidden truth. Mobile deferred; human voice/pacing remains separate |
