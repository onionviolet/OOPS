# P12 contract: one causal arc instance over P3, P4 and N1

2026-10-14. **PROPOSAL ONLY.** Logical data/API contract, not a selected runtime schema, module or migration. Root must bind it to inspected integrated APIs. P12 owns arc coordination and recognition. [P11 context](../p11/CONTEXT.md) owns context assembly; [N1](../p11/REQUESTS_AND_MARKETS.md#n1-generated-requests-and-quests-from-actual-needs) owns request terms/settlement; [D8](../p5/D8_LORE_GRAMMAR.md) owns history; P3 owns occurrences/decks; P4 owns people/names. No new purse, item registry, clock or writer is introduced by this proposal.

## C1: live seams and limits, SOURCE inspection 2026-10-14

Line locators refer to the main checkout at inspection. **Shown/SOURCE** means code was read, not run. Branch evidence is explicitly **stated** from each branch report. [CHECKS.json](CHECKS.json) retains content hashes for the audited modules so future readers can detect drift.

| ID | Locator | Shown behavior / bounded gap |
|---|---|---|
| F1 | `src/causal_story_ids.js:2–14`; `src/causal_story_content.js:231–248` | Three fixed original causal cases, authored participants/sites and a 36-minute window. Situation bindings exist. This is causal authored content, not an arbitrary quest/arc grammar. |
| F2 | `src/causal_story_actors.js:71–145`; `src/causal_story_content.js:236–239` | Current body/source/free/knowledge facts support fixed actors; controller target bindings follow authored commands. Private admission facts do not grant knowledge. No generated-person bridge is shown here. |
| F3 | `src/causal_story_core.js:162–189,282–312,391–433` | Validated causal owner and retained receipts; reserved capacity for closure/recovery; closure distinguishes goal, body, life and participation. A particular proof begins once. Open proof alone does not occupy its lead actor. Reuse invariants, not fixed cast/proof slots or once policy. |
| F4 | `src/causal_story_host.js:32–74,293–354,359–452` | Detached staging, current context recomputation, stale quote checks, actual job/receipt reconciliation, support-loss/cancel behavior, deadlines and closure. Host does not publish storage itself. Strike draws at 221–224 mutate saved simulation seed; a P12 stream adapter cannot assume P1 already replaced this. |
| F5 | `src/causal_story_native.js:120–127,159–203`; `src/causal_story_ui.js:60–89` | Native quest projection tracks started/received closure, validates authored envelope bindings and exposes optional Village controls. A private closed case is not automatically known finished in the quest UI. No general generated quest registration API established by this inspection. |
| F6 | `src/causal_story_scenes.js:42–104` | Read-only scene projects admitted actions/received accounts. Heard deadline alone does not reveal arrival; latest account retains attribution. Text follows evidence rather than becoming story authority. |
| F7 | `src/simulation.js:36–68,75–82,395–438` | Saved per-check random state; authored people/controllers enrollment; global seen-player-decision wait; frozen event responses/expiry effects; real staged settlement cause. Terminal occurrences prune after 100. Causes/claims survive, but cause IDs alone do not retain complete sifting payloads. |
| F8 | `src/simulation.js:452–510,515–539`; `src/simulation_contracts.js:217–230,249–255,298–308` | Common boundary scheduling, job completion before expiry/checks/controllers; authored controllers choose first eligible supported action; validation covers current owners/events. Existing seen decisions evade ordinary expiry. No general goal search or arc owner is shown in these seams. |
| F9 | `src/simulation_resolution.js:4–29`; `src/simulation_effects.js:58–60,85–166,174–178,281–292,376–378`; `src/simulation_content.js:103–110` | Stable seed derivation, frozen spawn aliases, one actor/target context, knowledge basis and per-cause relationship receipts, caused event checks. Baseline shower is one authored offer with occurrence limit. Arbitrary `$role` selectors/multi-person facts are not automatically supported. |
| F10 | `src/simulation_ui.js:39,95`; `src/event_feed.js:3–5,87–103`; `src/event_feed_ui.js:4` | Views project existing known opportunities/receipts, with small log/news windows. Rendering never supplies a durable story database or authoritative quest outcome. |
| F11 | `src/world_visit_history.js:7–63` | Compaction reconciles/validates clocks, retains referenced visits and actual early/recent return rows. Arc refs must pin the real visit/instance where needed; a label or parent ID is not a playable branch archive. |
| F12 | `src/life_record.js:1,13–15,30–48,68–79` | Explicitly lossy biography with recent/year bounds and no fabricated past migration. Do not infer unpaid obligations, witness coverage or completed arcs from its prose. |
| F13 | `src/people_knowledge.js:6–35,48–55` | Introductions/received knowledge control visible people; private axes/stock/jobs excluded. Independent helper work is not automatically a player report. Cast presence in a registry is insufficient knowledge. |
| F14 | [P3 branch report](../../../../../.claude/worktrees/proc-p3-storylets/docs/gm/dispatch/procgen-2026-10-13/p3/REPORT.md), F1/F2 and D1–D3 | **Stated**, 14-card Village deck, frozen draw receipts, nonblocking flagged decisions, safe expiry, played-time-only behavior, fixed Sela bridge. Not a claim of integration or arbitrary cast/quests. |
| F15 | [P4 branch report](../../../../../.claude/worktrees/proc-p4-people/docs/gm/dispatch/procgen-2026-10-13/p4/REPORT.md), D1/D2 and Changes | **Stated**, saved generated names/traits/requests/purse and real funded supply settlement; separate generated_people store, no simulation actor integration. Native hourly transition remains open in that report. |

## C2: logical state shape

One optional domain contains instances keyed by stable ID. Its placement is a root integration decision, for example `expansion.generatedArcs`; this name is illustrative and does not reserve an engine schema version. Definitions are immutable registered data. The instance carries only joins and durable progress, while domain owners retain means and truth.

```text
generatedArcs@1 = {
  revision, nextOrdinal,
  instances: { [arcId]: {
    id, revision, definitionRef: {id, revision, grammarRevision, operatorRevision},
    originMode: need | actorGoal | incidentChain | sifted,
    controlMode: prospective | recognized,
    scope: {worldId, instanceId, continuityId, eraRef, visitRef?, sourceSnapshotRef?,
            lawRevision, overlayRefs[]},
    createdAt: {clockRef, minute, sequence},
    causes: [{ownerRef, recordId, revision, eventMinute, relation}],
    actors: { [role]: {personRef, identityRevision, actorBindingRef?,
                       willingnessRef?, knownIntroductionRef?} },
    goalRefs[], requestRefs[], stakeRefs[],
    beats: { [beatId]: {
      id, definitionRef, status: dormant | eligible | offered | working |
                              fulfilled | failed | skipped | cancelled,
      predecessorIds[], prerequisiteRefs[], completionPredicateRef,
      actorRole, targetRoles[], intentRef?, planRevision,
      routeRefs[], selectedRouteRef?, eventRef?, jobRefs[], reservationRefs[],
      openedAt?, dueAt?, expiryPolicyRef, admissionReceiptRef?, outcomeRefs[],
      blockedReasonRef?, nextEvaluationAt?
    } },
    frontierIds[], pendingEvaluationCursor?,
    plan: {goalOwnerRef?, motivationRefs[], beliefRefs[], revision,
           currentStepRefs[], replans[], nextDue?},
    draws: [{scopeRef, ordinal, candidateRevision, inputReceiptRef,
             preStateRef, postStateRef, resultRef, purpose}],
    status: active | dormant | fulfilled | failed | expired | withdrawn | superseded,
    timing: {clockRef, calendarAnchorRef, absencePolicyRef, nextBoundary?,
             expiresAt?, idlePolicyRef},
    knowledgeRefs: { [observerId]: [accountOrEvidenceRef] },
    recognizedPatternRef?, recognitionCoverageRef?,
    settlementRefs[], aftermathRefs[], compactPins[], closureRef?
  } }
}
```

Refs are typed owner+ID+revision, scoped to the same world instance unless an explicit travel/carry operation says otherwise. IDs must not encode hidden truth. `stakeRefs` point to actual damage, custody, position, relationship or obligation at issue; prose like “the village depends on you” cannot stand in for a real consequence. `draws` refer to P1's owner-held stream snapshots/counters and retain resolved results; do not persist a second independent mutable copy of P1 RNG. A local immutable draw receipt must remain resolvable after stream-history compaction.

`requestRefs` point to N1 requests, including need revision, acceptable means, reward reservation and settlement. `goalRefs` point to actual actor/domain goal predicates. A recognized story can use the same shape with empty prospective beats/plan and a recognition closure; it schedules nothing, reserves nothing and grants no reward. It may bind participant refs that are not simulation actors because it merely recognizes their actual prior receipts.

## C3: P3/P4/N1 identity and settlement binding

A first quest may use P4 reference-only people as issuer/recipient through their existing store and funded interaction adapter. It cannot use `simulation_effects.person()` on a P4 ID that has not been enrolled. P3's fixed Sela is not interchangeable with a generated traveler. Multi-actor or autonomous steps require a deliberate bridge: canonical person remains P4-owned, optional simulation actor binding points back to that same identity, purse/inventory/knowledge each have exactly one selected writer, and adapters update those owners in one detached transaction. No name-based join or duplicate spawn to obtain an actor ID.

Root must inspect actual main/save publisher interfaces before implementing the bridge. Map native time to P4 calendar and expansion scheduler through P11's explicit clock anchor. A single tick cannot decrement the purse in both stores or advance a traveler twice. The goal planner consumes existing actor availability/skills/body/knowledge adapters; missing required support blocks that route, while reference-only request delivery can still work.

The arc does not pay out itself. A domain outcome settles N1 exactly once and returns a typed receipt; that receipt advances the beat, adds D8 history and unlocks any supported next beat in the same transaction. If the N1 need is already fulfilled by somebody else, follow the accepted reduction/cancellation clauses, release held rewards and record `superseded` or a reduced completion. Outstanding requests must not overfill the need. Relationship effects follow actual received acts and local response, not a global arc-success bonus.

## C4: admission, RNG and dynamic replanning

A pure preview resolves supported candidates and KnownContext without enrolling people, creating beats, reserving means or drawing. At admission, recheck sequence and all participating owner revisions. Bind cause and eligible cast, then select grammar/route variants with root-registered named P1 scopes qualified by world instance, generator domain and occurrence ordinal. P3 event selection still belongs to P3; a P12 callback must not reroll a deck card in another stream. If direct callback delivery is needed, define a P3 supported occurrence-admission seam rather than adding a second scheduler.

Freeze chosen structure, cast, revisions, admitted route/quote, first pending event and draws together. A stale/unsupported plan consumes no draw; failed durable publication restores both stock and stream state. Later display/reload/import never regenerates the graph from a seed. Future uncertainty is drawn at the declared action boundary, not preselected as an inevitable ending. Store a selected result before showing it; a definition/text update cannot reroll it.

On a real change, revalidate affected unsatisfied predicates only. Fulfilled beats remain fulfilled records even when their lasting product is later destroyed. If a helper leaves, use the same frozen cancellation/defer terms; do not recast a stranger into an accepted appointment. A genuinely new supported route creates a plan revision under the same goal, with a reason receipt. A genuinely new need creates a new request/cause/occurrence, preserving earlier outcomes. Closed duplicate payout claims are transaction integrity, never a lifetime once rule.

## C5: idle, expiry, NPC scheduling and event ordering

P12 default for a first Village slice is played-time-only, browser-closed freeze, nonblocking offers or P3 flagged decisions with an explicit free expiry policy. There is no silent paid player answer, forced relationship consent, health damage or hunger death at timeout. If a player has accepted a timed job, its actual cancellation/liability clauses apply; ignoring a public offer creates no accepted debt. Automatic spending needs an explicitly chosen standing policy, exact action scope, budget/reservation and stop conditions, never inferred assent from silence.

A future hard decision can pause its affected work only after a supported scoped-wait adapter exists. Do not reuse main's global waiting-decision path for every generated plot. Genuine crisis/global pause remains a reachable world-specific option through a declared opt-in policy and fallback; it is not a prerequisite for multi-step arcs. Every dormant beat has either a relevant-change subscription or a future evaluation boundary, not a tight polling loop. Work shortages pause only that job; unrelated Village idle actions continue.

Proposed deterministic integration order at a common boundary: owner jobs complete through existing order → resulting receipt/need revisions update → expire unmet offers using current post-completion state → reconcile arc dependencies/goals → existing actor controllers consider one admissible step → deliver due P3 offers under its own pace. A completion exactly at its contractual deadline counts according to the stored inclusive/exclusive predicate; the first slice proposes inclusive completion, consistent with job-first reconciliation. Root must bind this to actual owner timing, not assume every legacy offer shares that policy. Same-time competing claims serialize by existing sequence and stable IDs.

NPC plans run when supported local time advances, whether or not the player watches. They spend their own saved means, use their own beliefs, and stop at unsupported actions. No complete forced plan runs atomically just because the player declined. Budget work using the common scheduler and persist continuation cursor so long advances match stepped advances. Catch-up exhaustion means resumable remaining work, not silent skipped outcomes. Present/absent-world advancement and parked branches follow the timeline owner, with freeze as this first slice's proposal. New offline policy is separately selectable work.

## C6: persistence, compatibility and bounded history

Persist active graph/frontier, pending occurrence responses, participants, admitted terms/reservations, partial contributions, plan/beliefs, next boundaries, selected outcomes, draws, knowledge and all indispensable pins in the native envelope. Save/reload resumes the same pending beat; export/literal-file import must preserve the next draw and exact accounting at pending, partly done, settled and dormant boundaries. One seed alone is insufficient. No load-induced deadline extension, spawn, retroactive quest, payment or relationship acknowledgement.

Old envelopes lacking the owner remain absent until explicit local enrollment/new qualifying cause under a selected compatibility policy. Do not reconstruct historical promises from life_record text. Root owns envelope version/migration. Unsupported active operator/world/pack revisions reject before import writes; a separate explicit archival mode could retain inert recognized history without claiming playable resume. Content updates retain old definition resolution for active commitments, or migrate explicitly with a comparison. Silently replacing active terms is forbidden.

Use [P14 contract K2–K4](../p14/CONTRACT.md) for the shared D8 history adapter, qualified query coverage and retention promise; do not append P12 fields to an exact validated causal-case receipt. Pin typed receipts referenced by active beats, claims, actor goals, evidence and partial sifter matches. Cause ID alone is insufficient; retain minimal actor/operation/actual deltas/ordering/visibility/source basis. Completed unrelated histories can fold into summaries, but those summaries cannot later support exact restitution or a new factual accusation. Visit compaction receives the same pins. Detect dangling/foreign/future refs and cycles before import/publication, including corruption that would otherwise disappear in pruning.

Proposed prototype budgets: 8 active local arcs, 24 beat nodes per arc, 4 cast roles in the first grammar, 32 partial sifter matches and 128 unpinned outcome summaries. These are adjustable storage/work admission budgets, not once rules, global population limits or a claim of measured performance. When all capacity is pinned, finish/cancel/recover existing work first and delay admitting optional new texture with a safe notice. Never evict an active obligation or reserve all recovery capacity for ordinary new jobs. More complex worlds may choose different adjectives and measured budgets.

## C7: truth, evidence and safe presentation

Maintain actual outcome, actor intent/belief, witness account and player-known view separately. Planner internal data can include real supported hidden facts to validate execution, but candidate counts, missing-field notices, debug reasons, titles, objective text, sorting and errors must not reveal them. KnownContext drives public offers. NPC deliberation uses only that NPC's permitted beliefs; an invisible revision change can invalidate an action without teaching them the answer.

An ordinary mystery must commit incident causes, traces and false accounts before investigation. Sampling the culprit after the player's first accusation contradicts causal mystery. E7's observation-dependent or belief-shaped worlds remain reachable through explicit laws, with an actual observation act/cause and stored transition; panel rendering never becomes that act. Any sealed route uses its owning ID and authorized discovery API; this contract defines no sealed truth or candidate. Unknown source law is a qualification gap, not an invented world prohibition.

Public arc view: known purpose, involved known people, actual next actions/means, admitted commitments, last received result and unresolved known question. Show alternative approaches without squeezing independent panels into one block. P3 event feed remains a small lead/news projection; long chronicle text belongs to P14/P15. Rebuilt desktop acceptance must use 1366x768 and 1600x1000; mobile deferred. A hidden goal may run privately, with the player discovering only evidence through fitting routes.

## C8: mandatory future contract checks, all NOT RUN

| Gate | Evidence needed |
|---|---|
| G1 Causal / planning | Same cause supports different routes; changed actual need/means changes next admissible beat; no-cause refuses generation. NPC fails plausibly on mistaken belief and only replans from acquired evidence. Direct overwhelming success can close without extra obstacles. |
| G2 Transaction / race | Failed save, stale quote, competing participant/stock claim, partial delivery and duplicate command conserve goods/funds/consent and RNG. One receipt pays once; a new real funded need can pay again. Closure/cancellation capacity always available. |
| G3 Time / idle | Unanswered generated choice leaves ordinary activity running; expiry doesn't spend player money or consent; NPC step uses its own means; travel/closed-browser/parked instance policies explicit. Long versus stepped advance equivalent, including exact due-time ties and continuation budgets. |
| G4 Restoration / migration | Pending/partial/dormant/complete exact Save/reload, Export and literal-file Import at a second fresh origin; same graph/cast/claims/next draw. Old absent owner unchanged. Corrupt/future/unsupported imports rejected before storage/native mutation. Definition update preserves accepted terms. |
| G5 Sifting / knowledge | Match real receipts after feed/terminal pruning; incomplete log cannot prove absence. Corrected belief adds account revision without changing deed. Every public/debug/error projection excludes sealed truth, hidden goals and unauthorized identities. |

A selected implementation also needs appropriate source tests/build and a fresh rebuilt native journey plus desktop and human fiction/balance gates. This docs-only inspection runs none of them.
