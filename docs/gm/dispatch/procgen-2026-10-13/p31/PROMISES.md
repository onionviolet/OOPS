# AJ1 and AJ3: reciprocal promises and social credit

2026-10-14. **PROPOSAL ONLY.** Extends [root AJ1-AJ3](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#aj-promises-and-obligations). A general ledger is proposed, not implemented. [REPORT](REPORT.md#live-source-audit) distinguishes actual seams. Reuse [P19 directed relationships](../p19/CONTRACT.md), [P11 negotiated terms M6](../p11/MORE.md), [P6 created rituals/contracts M7](../p6/MORE.md) and [E8D](../../../../emergent/E8D_VOW_SYSTEM.md); do not create another person, inventory, clock or universal favorability store.

## AJ1.a: an accepted promise differs from a claim about one

A spoken offer, someone else's recollection, a wish, an invitation and an actual accepted undertaking have separate records. Silence alone does not accept an ordinary promise. A world where utterance itself binds needs an explicit law and supported speech event. Helping now need not adopt a disputed past promise. An NPC can believe a promise was made while the objective receipt says otherwise. Preserve their belief, the evidence and the player's response separately.

Support player → NPC, NPC → player and NPC → NPC with the same terms/evaluation machinery. A counterpromise is its own obligation with a dependency, not an assumption that both parties owe identical service. One person can promise an outcome, another can supply the means and a third can certify delivery. A promisor's confidence is not proof of capacity. Generated offers should have a reachable witness: actual means or disclosed assistance routes, a viable due condition and a backed reward if one is offered. Intentional impossible/deceptive promises remain possible under explicit fiction; advertise known uncertainty rather than manufacturing a feasible witness after acceptance.

## AJ1.b: proposed state shape

Semantic fields, not reserved save keys or an API. Select only fields read by a chosen slice.

```text
PromiseDefinition: id, revision, worldLawRef, generatorRevision?, sourceRefs
  promisorRef, beneficiaryRefs, boundCarrierRef, contextRefs
  termsRevision, objectivePredicate, permittedMeans, responsibilityPolicy
  due: clockRef + activationEventRef? + boundary/predicate + tieOrder + gracePolicy
  acceptancePolicy, cancellationPolicy, renegotiationPolicy, transferPolicy
  enforcementRefs?, considerationRefs?, visibilityPolicy
PromiseInstance: id, definitionRef, admittedCause, acceptedAt, acceptedBy
  currentTermsRef, status, heldMeansRefs?, linkedJobRefs, currentDueBoundary?
  progressReceiptRefs, terminalReceiptRef?, settlementReceiptRefs
  amendmentRefs, disputeRefs, noticeDeliveryRefs, generationDrawReceipt?
PromiseAccount: observerRef, promiseRef?, attributedSpeakerRef, claimRef
  basisRefs, stance, confidence, occurredAt, learnedAt, contradictsRefs
```

`boundCarrierRef` names person/body/soul/office/household under local law. An heir does not inherit a friend's private gratitude by default; an office duty may transfer without memories. Promise truth lives in the instance and receipts; an account is what an observer believes about it. Literal objective predicates are typed and versioned. Free text can name or explain terms but cannot execute arbitrary parser-generated magic.

Proposed statuses: `offered`, `active`, `kept`, `broken`, `released`, `superseded`, `void`. `dueSoon`, `overdue`, `disputed`, `pausedWork` and `partiallyFulfilled` are dimensions or projections, not ambiguous replacements for terminal truth. An `active` promise can have disputed performance. `renegotiated` is a recorded amendment event: the old revision becomes superseded and the new revision becomes active atomically. Do not erase an earlier breach if parties later forgive it. Forgiveness, restitution and release have their own receipts.

## AJ1.c: due conditions and evaluation

| Extension | Concrete terms | Evaluation and boundary |
|---|---|---|
| AJ1.c1 Calendar | Return before the local winter festival | Convert the named calendar boundary through the owning world clock when terms are accepted. Clarify strict-before versus at-or-before; show known date and travel estimate. |
| AJ1.c2 Relative | Deliver a brace within twelve local minutes after arrival | The actual arrival receipt starts the timer, not clicking Accept. A delayed departure cannot silently advance a destination-local clock. |
| AJ1.c3 Event | Teach the pupil before their actual examination opens | Refer to that event/edition, not a label that can be regenerated. If the exam is postponed, follow the frozen terms' declared dependency policy. |
| AJ1.c4 Capability | Help when the beneficiary next requests a supported repair | Pending until an actual delivered request; absence of a request is not breach. Record whether reasonable assistance or completed repair was promised. |
| AJ1.c5 Recurring | Cover the shrine desk on agreed market mornings | Each eligible occurrence gets a new due and settlement cause. Holidays, leave and exception rules are local adjectives/terms; no global once rule. |
| AJ1.c6 Conditional | Share the notebook if the experiment yields a usable method | Test actual result evidence first. No successful result means unmet antecedent, not broken promise; uncertainty must stay unresolved until checked. |

Settle using authoritative objective receipts, quantities, receiver acceptance and timing, never log text or a relationship score. Completion before a strict deadline counts; an exact-boundary completion follows an explicit tie order. Partial work can earn disclosed partial credit without claiming the whole objective. Delegate, buy, craft, barter or use a fitting power when `permittedMeans` allows them. A requirement for personal teaching reads actual participant work; merely hiring a teacher does not meet that particular predicate.

On due: resolve actual fulfillment → apply force-majeure/coercion/exception terms if supported → record kept/broken/void or unresolved dispute → settle backed consideration → publish observer notices through real channels. Missing data cannot become automatic guilt. A human court may make an adverse verdict about a fulfilled promise; the verdict and objective performance remain distinct. Late completion and subsequent amends remain reachable unless a fitting world law rules out a specific route.

## AJ1.d: memory and idle fit

The beneficiary records an experience only after witnessing completion, receiving delivery or obtaining a report. Remote NPCs do not instantly know a promise was broken. A promisor can know their own failure before others learn it. Memory records retain cause, terms revision, observer, basis, specific issue and known remedy. Compaction can shorten prose but retains open obligations, amendments, unsettled consideration and causal evidence. Current last-32 memory limits are display/history bounds, not permission to forget a payable obligation.

Queue supported work and reminders; let the player choose protected stock, permissible spending, qualified delegates and pause-on-known-breach. A standing order may finish a routine already authorized by the player. It cannot accept new obligations, spend favors, disclose secrets or swear an oath because those acts would keep a different promise. Notifications are optional. Missing an unsigned invitation incurs its event consequence, not breach.

First implementation proposal uses eligible played world time. Pausing the game does not advance it; travel, sleep, world absence and closed-browser catch-up each need a declared clock applicability policy. Large elapsed chunks traverse due boundaries in order and yield the same receipts as small steps. When a task is impossible with current means, stop admissions and offer known alternatives, a waiver request or renegotiation. A deadline need not pause merely because the worker does, if the accepted local terms say it continues.

Visible target: at 1366x768, independent panels for **I promised**, **Promised to me** and selected terms/evidence, with due/action/renegotiate reachable. At 1600x1000 add recent amendments and delivered notices. Unknown actor commitments stay absent. Mobile optimization deferred. No promise housekeeping required for comfortable ordinary idle play.

## AJ3.a: favors and gratitude as different forms of credit

| Form | Proposed behavior | Actual seam or owning join |
|---|---|---|
| Gratitude | Issue-scoped remembered help affects willingness to offer an introduction, lend equipment or volunteer work | CR4 SO2.3 and P19 reactions. A thank-you does not automatically create a collectible claim. |
| Acknowledged favor | Parties recognize one supported class of future help with scope, transfer and expiry terms | Village career already has a narrow favor counter; extend via an adapter, not a second counter for Iona. |
| Callable service debt | Actual agreed obligation with claimant, obligor, permitted services and settlement | AJ1 instance; labor/site/stock still require availability. Refusal follows the terms/local law, not universal obedience. |
| Coin debt | Principal, creditor, denomination and repayment terms | Existing kit debt remains with `village_career`; do not express coins as clamped trust. |
| Reputation for reciprocity | Other people form opinions from delivered accounts of actual kept/refused favors | P19 gossip/P14 accounts. This is neither owed principal nor a claim transferable to a stranger. |

AJ3.b: Proposed favor record references grantor/claimant, obligated actor or office, origin-help receipt, acknowledgement receipt, eligible request classes, outstanding extent, assignability, due policy and settled/waived receipts. A request binds an actual task and means. A favor for a modest local introduction cannot compel unlimited crafting, divine intervention or murder. Generous, enduring, transferable, sacred, opportunistic and freely given are local profiles; repeated real help can earn new recognition without arbitrary daily caps.

AJ3.c: Calling in a favor is a negotiation when no enforceable terms were agreed. NPC can offer lesser aid, postpone, refuse, pay instead or redirect to qualified help. Reciprocity can be asymmetric; the beneficiary may resent an unsolicited rescue and owe nothing. Player can protect, forgive, gift, trade or exploit social credit through world-supported acts. Blackmail adds a coercive demand [AK1](SECRETS_AS_CURRENCY.md), not a retroactive gratitude receipt.

AJ3.d: Favor transfer needs the obligated party's terms or a local assignment law. Chain favors need distinct actors and causes, no circular creation of payable credit. Group contributions retain shares/beneficiaries without treating every member as the sole creditor. Calling a service reserves the actual worker/tool time; it cannot overlap a paid commission. Partial aid settles its agreed extent only. Save pending requests, obligation ownership, basis and exact settlements.

Original proposed first journey: complete actual repair help; the recipient explicitly acknowledges a later local fitting lesson. Call it in when both actors and station are available, or take a waiver/alternative appointment. Their lesson uses their real skill and the player's actual material. A control gift earns appreciation only. Repeat genuine help can create another favor under the same local law.

## Future acceptance cases

All specified, NOT RUN: both promise directions; NPC-NPC fulfillment without hero copresence; unsigned offer and silence; typed result versus means; exact due tie; NPC notice delay; partial/late service; amended terms race; refusal and forgiveness; recurring new causes versus replay; favor acknowledgment versus gratitude; shared capacity; stale preview and failed write. Save/reload/Export/literal-file Import must preserve active, superseded and terminal terms plus unsettled consideration, evidence, notices and next draw. Legacy archive-duty, Iona favor and kit-debt routes load unchanged unless an explicit migration is selected. [REPORT gates](REPORT.md#future-acceptance-gates) apply.
