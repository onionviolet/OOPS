# GO6-GO7: content budgets and long-absence summaries

2026-10-14. **PROPOSAL ONLY.** Extends GO6/GO7 without duplicating [P15 authoring](../p15/AUTHORING_PIPELINE.md), [P32 content math](../p32/CONTENT_MATH.md), [P39 budgets](../p39/BUDGETS.md), [away ledger](../../away-ledger-2026-10-14/GOAL.md), [offline audit](../../../../research/OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md) or [P16 idle stories](../p16/IDLE_AND_EVENT_STORIES.md). Runtime gates remain NOT RUN.

## GO6: authored laws, generated variation, measured coverage

Each world profile declares a content mix by **domain and semantic role**, not a global percentage of lines or a mandate to generate every named character. Authored constraints, original generated background variation and text realization are counted separately. A hand-authored table selection is labelled that way; a grammar recombination is not claimed as a new causal quest.

Proposed first-fixture budgets, unmeasured and adjustable by root:

| Domain | Authored floor / generation target | Lint / meaningful sample |
|---|---|---|
| Laws/reservations | All selected executable laws, unique identities, exact source predicates and admission constraints authored/source-qualified | No unsupported operator, missing consumer or conflicting reservation; no generated substitute for missing canon |
| Scene texture | Small original pack: 4 phase/season contexts × 3 clauses plus neutral fallback; context can be sparse rather than Cartesian | Every declared context has fitting fallback; all clauses typed cosmetic, with supported clock/region inputs; no contradictory weather/residue |
| People/micro speech | First slice keeps existing 3 P4 travelers; 2 supported topics × 3 registers is a planning target, not a demographic cap | Every admitted topic works with known participant/context. No unnamed duplicate, omniscient greeting or trait-count clue. P7 owns culture qualification |
| Storylets/arcs | Existing deck cards plus one supported receipt-backed callback; later arc templates count actual distinct paths, not noun substitutions | Reachable eligibility and supported costs/results; decline/quiet/alternate routes; absent means veto and no empty reward |
| Lots/creation | Selected functional family with 2 genuinely useful states, or explicitly cosmetic only | Canonical lot/holder references, coherent covariance, conservation/consumer/counter, known comparison and retained resolver |

These targets describe a cheap proof fixture. Fully authored worlds, table-driven worlds, deeply generated original worlds and prolific cosmetic packs remain reasonable options. A later world may use a different mix. Profile budgets report counts of authored constraints, templates, resolved entities, supported action paths and repeated semantic slots. They do not inflate content count by multiplying adjectives.

### L1-L5: lint additions to existing pipeline

| Code | Static lint / rejection condition | Deterministic/headless case |
|---|---|---|
| L1 binding/eligibility | Bad world/instance/ref/revision, duplicate ID, reserved-role collision, unknown operator/input/unit, no required reader, eligibility with no possible supported means | Selected contexts admit at least one useful candidate or declared quiet/fallback; missing optional context stays neutral; zero veto never rescued by weight |
| L2 semantic support | Cosmetic record used for reward/evidence/identity; unreferenced generated field; incompatible representations; unaccounted matter/charge/funds; future body/source from a nickname | Two physical lots have real supported differences and conserved totals; cosmetic variants have identical mechanics. Player/NPC consumers use same selected resolver |
| L3 knowledge/seal | Unfiltered truth field, hidden candidate/name/count, origin-sensitive sort/price leak, raw canon prose or unqualified canon label | Synthetic neutral secrets test every projection including summary/error/tooltip/quote. IDs only in public review. Authorized route checked by separate sealed reviewer where applicable |
| L4 determinism/version | Runtime `Math.random`/wall/DOM reads in consequential generator; live cursor calls in preview/render; unstable ordering; missing record/law revision or absent-owner policy | Fixed-seed snapshot and meaningful seed sweep over selected constraints; same context preview leaves state unchanged; old absent owners unchanged; failed write atomic |
| L5 density/continuity | Unbounded child-event cascade, missing recurrence/expiry/quiet, impossible era/region morphology, same fact described incompatibly, no presentation/simulation/storage budget declaration | Adversarial long-run repetition, yield/jump parity, total origin bytes, pinned record retention and resolved next draw after Save/reload/literal Import. Reuse P18 runner, not another framework |

Static lints cannot prove every player's option reachable. For declared alternatives, test a fixture with supported means and a route to each option, plus one missing-means case. Record contradictions as source/model/profile IDs; unknown canon waits for qualification or becomes clearly original proposal. Author batches under P15 and review semantic variety before adding runtime complexity. No raw novel prose or sealed truth in public fixtures/reports.

## D1-D5: five different limits

| Code / budget | Proposed control | What it must never do |
|---|---|---|
| D1 eligible time | Away/world owner decides capMinutes, ratio, freeze/continuous policy, barriers and drop/bank | UI density or simulation CPU cannot silently reduce earned time. No global absence cap or hunger damage law chosen by GX3 |
| D2 causal compute | P32/P39 shared due queue, candidate limit and resumable cursor; use existing returned remainder, with cooperative yielding | Do not skip required outcomes, advance visible clock beyond unfinished work or allocate separate budgets per micro lane |
| D3 resolved-entity storage | Existing 4 MiB origin guard and P38 reference-aware compaction; measure native + ordinary + backup + all keys | Do not delete pinned people/lots/methods/exposures/promises or call a fixed fictional population cap a storage fix |
| D4 presentation | One shared quiet/rich micro budget across greeting, scene, rumor, recap and return delivery; coalesce low-priority cues | Do not erase discoveries, choices or action terms; do not replay a year's animations on return |
| D5 generator admissions | Profile-specific number of new optional records per eligible local window; aggregate supported homogeneous routine counts | Do not retroactively cancel admitted work, suppress a meaningful alternative forever or replace unsupported exact events with plausible random stories |

Suggested presentation fixture: quiet shows one ambient clause per 60 **played local minutes**, rich up to three, with scene inspection always available. Return view has at most five ranked summary rows plus expandable totals. These figures are unaccepted settings, not once rules or canon time laws. Public urgent/pending terms outrank cosmetic cues. Important data remains available when ambient output is off. Screen target: 1366x768 and 1600x1000, existing useful panels, no mobile gate.

## GO7: coordinate with away-progress authority

Shown in another worktree: `/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg/src/away_ledger.js:6-48` provides pure `computeAway`. It calculates applied/overflow/banked minutes, XP estimate, barriers, remainder and next wall cursor. Its GOAL states checks passed and explicitly says **not wired**. GX3 inspected code, did not rerun checks, and does not treat estimates as settlement receipts.

Important distinctions: banked minutes are retained credit, not automatically spent; a barrier leaves later wall time pending; nonbarrier drop/bank advances the cursor through now. Backward wall time returns no gain. The code's first barrier test uses `< applied`, so equality at the interval end is not reported as a stop. Diminishing XP in this calculator resets from the start of each call; it has no cumulative activity-duration owner. A future host must resolve exact-end barrier semantics and split-interval diminishing semantics with the time owner before claiming elapsed equivalence. GX3 adds no second elapsed computation and proposes no patch to that worktree.

Future handoff, semantic interface rather than claimed exports:

```text
EligibleInterval from time owner:
  claimRef, activeLifeRef, instanceRef, localFrom, localTo,
  acceptedMinutes, bankedDelta, discardedMinutes, deferredMinutes,
  stopRef/reason, clockPolicyRev

SettlementSlice from joined publisher:
  claimRef, completedThrough, domainReceiptRefs, pendingDecisionRefs,
  continuationRef, worldRevision

ReturnSummary from existing lore/report owner:
  reportRef, claimRefs, coverage, knownEntryRefs, groupedTotals,
  stopReasons, pendingActionRefs, acknowledgmentRef, projectionRevision
```

Interval classification must be disjoint and reconcile to the time owner's offered interval. Deferred time at a choice is not cap overflow. Bank/drop follows selected world policy, not the summary's row limit. A settled interval may contain several domain operations; those operations are credited only by their real consumers. Neither the summary nor `computeAway.gains` directly awards a second XP payment.

### A1-A5: chronological processing and summary algorithm

| Code | Proposed execution |
|---|---|
| A1 authorize interval | Time owner selects one active life/branch and supported instance policy, closes wall cursor atomically with settlement or retained continuation. Preserve existing freeze/default absent behavior. First compatible enrollment establishes now without invented backpay. Resting branches receive no copied player progression |
| A2 settle supported work | Joined publisher traverses exact admitted boundaries with actual supplies, slots and means. Pause before selected important event/consent barrier; don't autoaccept bargains or invent contacts. Unsupported native combat/social consumers stay paused. P2's UI advance is not a catch-up adapter |
| A3 accumulate records | Consume actual domain receipts after successful publication, keyed by claim + receipt ID. Group homogeneous production into exact count/amount/time/stop-cause totals; preserve individual pins for different lots, named people, obligations, discoveries and callbacks. A summary cannot create these events |
| A4 known report | Filter through current observer knowledge and stored basis, then rank actionable pending change, completed useful work, changed known situation, new observation and quiet texture. One top line + grouped rows. Frozen letter has historical recipient knowledge; live report can reveal a later-known fact without rerolling event truth |
| A5 persistence/ack | Commit report coverage/cursor with consumed receipt refs and durable settlement. Reopening, reload, literal Import and acknowledgment never pay again. Acknowledgment clears attention marks only. If report construction fails, preserve completed gameplay and a reconstructible receipt/cursor boundary, not a second settlement |

Original worked absence: a previously admitted drying job has four batches worth of actual stock; after supported eligible time it completes those four and stops for shortage. Report lists actual output, used stock, covered local interval and the shortage. If the world clock froze, show unchanged work rather than inventing a season of NPC accomplishments. If a new selected moving-world policy generated messages, show only delivered/known messages, with unsolved player choices retained at their real boundary.

Retention: keep exact pending and causally pinned entries, compact routine repeated receipts through P38/P18 policy, and retain small report occurrence/ack IDs so an old Import cannot duplicate presentation or awards. When all data is pinned and capacity is reached, stop unsafe **new** optional generation before spending; preserve existing obligations and expose storage pressure neutrally. Archive/reclaim/extended storage remain future reachable options. No summary may erase a promised callback.

### G1-G5: future proof cases, all NOT RUN

| Gate | Evidence required by a selected builder |
|---|---|
| G1 time | Equal eligible interval under small steps, jump, background and closed return where supported; exact-end/zero barrier, fractional ratio/carry, diminishing split, backward/large clock, bank then explicit spend and cap overflow. Time owner's own law decides equality |
| G2 causality | Natural stocked task→leave→return→actual output/stop; shortage/full receiver/cancel, pending decision before effects, no duplicate XP/stock; N inactive branches/instances receive zero unintended gain |
| G3 persistence | Save/reload pending and completed report/work; Export and literal-file Import to second fresh origin; same claim/cursor/banked/deferred time, output graph, known observations, pending terms, report acknowledgment and next draw. Corrupt/future revision and write failure preserve prior save |
| G4 performance/storage | Many routine receipts and fully pinned worst case; bounded resumed work, measured largest atomic operation and whole-origin UTF-16 bytes including backup. No loss of required queries or consumed-source products after compaction |
| G5 desktop/human | Own rebuilt fresh origin, 1366x768 +1600x1000 readable top line/totals/stop/next action; ambient off still shows obligations, no animation flood, no secret leakage. Natural and seeded-native long-absence cases labelled separately; human tone/feel unaccepted until played |

Without integrated away settlement, a first report can summarize **played-time receipts only**, explicitly labelled with its coverage. It may not advertise closed-app gains. A read-only summary slice does not need branch selection, a moving-world policy or a new offline production engine.
