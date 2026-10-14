# BI4: retention with declared query guarantees

2026-10-14. **PROPOSAL ONLY.** Extends [P14 K4-K6](../p14/CONTRACT.md), [P18 hygiene](../p18/HYGIENE.md), [P18 M9](../p18/METRICS.md), [P32 LOD](../p32/LEVEL_OF_DETAIL.md) and [continuity guard](../p32/CONTINUITY_GUARD.md). Compaction is not a fictional once rule, branch deletion authorization or proof of infinite storage.

## BI4.1: storage tiers and capabilities

| Tier | Retained data | Guarantees / compaction |
|---|---|---|
| R0 active authority | Admitted terms, escrow, due predicates/cursors, live discovery, current identity/custody, unfinished closure | Exact executable resume. No deletion of required data; cache-only demotion allowed |
| R1 exact consequential history | Recent receipts plus every selected/pinned old deed; contributor identity, source/law revisions and necessary causal values | Exact registered historical queries. Compact encoding/dictionaries/indexes, retain minimal factual capsule |
| R2 typed routine summaries | Unpinned equivalent terminal outcomes partitioned by scope, actor/target, rule/terms revision, units and meaningful change boundary | Declared counts/totals/latest or ordered pattern statistics only; never exact omitted witnesses or copy identity |
| R3 cold identity / replay metadata | Entity tombstones, operation tombstones/checkpoints, source ancestry and coverage gaps | Stable references and retry rejection; payload availability explicit; no live command from a tombstone |
| R4 presentation / optional texture | Rebuildable views, provisional descriptions, diagnostics; separately frozen committed editions | Evict caches first. A committed edition stays frozen or explicitly archived; it is not rerendered into changed testimony |

The logical receipt log is append-only even when physical segments change. A compaction manifest records input segment/range, replacement summary/capsule refs, surviving receipt handles, operation protection, exact supported capabilities and lost-detail coverage. It does not change an outcome, reuse its ordinal or claim an aggregate is its original exact row. Immutable sealed archives can retain full segments where selected. A mere hash of a removed segment gives integrity evidence, not retrieval capability.

Oldest as aggregate applies only to unpinned routine records with compatible queries. A significant old consequence can stay R1 forever, and an open ancient promise remains R0. Age alone never justifies losing debt, discovery, title, source grant lineage or a family carrier. LOD and retention are independent: a foreground person can have routine summarized history, and a cold dead actor can have an exact pinned deed.

## BI4.2: explicit pins with a release condition

```text
Pin = {id, consumerId, queryContractRevision, targetRef,
       capability, requiredFields, reasonCode, admittedCauseRef,
       releasePredicateRef?, expiresOnClockRef?}
```

Examples: active promise pins acceptance, current amendments, actual progress and settlement lineage; anniversary pins date/calendar/participants and recurrence operation, not every unrelated diary entry; grudge pins the actual received harm/account and its interpretation; masterwork/Story grant pins contribution, assessment and grant lineage; an exposure pins the consumed product law/payload; a method pins its exact product/experiment; a user bookmark can pin the selected episode but is not a global archive lock.

Follow hard refs transitively to sufficient retained data, using declared capabilities rather than retaining entire universal snapshots. Release pins only when their owner proves the release predicate: settled promise, retired callback with no further rights, explicit user unpin, or supported conversion to an exact sufficient capsule. Closing a request does not automatically release unresolved restitution. P34's pin-every-`request.*` behavior is conservative but offers no lifecycle release; replace it only after the consuming callback/promise queries are registered.

Guard against pin cycles, accidental all-visit retention and all-pinned capacity. An occurred-before causal graph is acyclic; legitimate social/claim reference cycles need bounded traversal and separate relation semantics. Current `world_visit_history` scans exact strings/keys throughout state. Until that owner accepts typed hard/soft refs, don't pretend a cosmetic visit ref is free. Dates/endpoints can often suffice for narrative display without pinning a complete visit or playable branch.

## BI4.3: compaction protocol

1. **RT1 Validate** original records, operation uniqueness, scope/clock bindings and refs before pruning, including corrupt rows that would otherwise disappear. Reconcile actual visit/clock owners.
2. **RT2 Plan** registered query capabilities and transitive pins, reserve closure/recovery, select only eligible terminal segments. No draws and no wall-time policy change.
3. **RT3 Replace** repeated routine data with sufficient typed summaries, keep operation identity/capsules and mark any exact-query coverage loss. Dictionary sharing counts the payload once.
4. **RT4 Compare** before/after declared queries, callback selection, negative coverage, duplicate replay, exact active terms/custody and next draws. Validate detached complete envelope and size.
5. **RT5 Publish** through the existing durable writer. Failure leaves prior segments/native state untouched. Cache indexes rebuild from the published manifest; repeating compaction is idempotent.

Never silently merge distinct branches, source revisions, units, grant rules or evidence origins to shrink a row. Copied reports keep one source ancestry. A count of three jobs cannot prove a particular three-step ordered story unless its sufficient ordered state is retained. Aggregate counts are not exact playable rewind/resume inputs. Full branch archives require the temporal owner's mutable state, pending jobs, custody, clocks, RNG and locked content.

## BI4.4: reconcile budgets against the real save guard

**Shown/SOURCE:** `src/save_files.js:204-226` uses a 4 MiB shared-origin UTF-16 byte guard, counting other storage keys and preserving the prior save on quota error. UTF-8 JSON, encoded file bytes, ordinary/backup storage and other keys are different measurements. Main `src/main.js` save paths include backup writes; source locators are in SOURCE_AUDIT. P2 product IDs repeat embedded JSON and its catalogue retains consumed products.

**Stated proposals:** P14 K5 targets 640 KiB decoded history; P19 C4 estimates 776 KiB social; P32 AM1.5 adds 62 KiB to social for 838 KiB and warns ordinary+backup copies alone can approach 3.27 MiB. Shared history is overlapping, not another 640 KiB to blindly add. These estimates assume row sizes and are not measured capacities.

**BI4.4a proposed first benchmark**, unselected: 256 recent shared receipt capsules at an assumed 512 B each (128 KiB), 64 KiB claims/frozen text, 32 KiB identity/operation/pin/manifest data, 32 KiB closure/recovery reserve: **256 KiB incremental UTF-8 target**. Count all participating owner increments, not just `loreHistory`. This replaces overlapping pilot allocations for the benchmark; it neither declares those richer lane envelopes impossible nor changes any existing validator. Long refs, multibyte text, complete evidence graphs and operation metadata can exceed it. Measure before selecting a number.

At a proposed 80% target, clear regenerable caches and try proven-safe compaction. Required closure capacity is reserved before taking costs, sized to the selected operation's maximum supported closure, not one guessed universal constant. All-pinned overflow postpones optional new texture and history-dependent admission, keeps prior commitments/reserves intact and offers a supported larger-storage route. Ordinary actions without the new exact-history promise preserve existing behavior. Do not reject saving an existing life simply to enforce a new pilot target.

Proposed routine growth objective: after warm-up, **at most 64 KiB additional decoded data per game-year** for the declared repeated-work fixture, with no exact-pinned population growth. This is a measurement target, not a guarantee for arbitrary play. Separate slopes for unique deeds, claims/audiences, pinned obligations, retained lives/branches and P2 products. Unlimited distinct exact records and arbitrary pins have nonconstant growth; report that cost candidly.

## BI4.5: reachable storage and archive modes

| Option | What it enables | Gate / practical cost |
|---|---|---|
| Compact inline save | Small first slice and portable complete file | Exact active data plus explicitly qualified older aggregates, guard/backup fit |
| Larger exact inline history | More user-pinned detail without a new backend | Whole-origin quota measurement, encoding/parse cost and recovery reserve |
| IndexedDB immutable segments | Longer exact history and efficient range indexes | Transactional manifest/chunk publication, recovery after crash, garbage collection only after committed reachability, complete file portability |
| Bundled archive/export | Full older lives/segments with selectable restore | User-selected artifact, manifest plus all definitions/chunks, readable versus executable capabilities explicit |
| Local external archive support | Large histories beyond browser origin | Separate authorized host route, missing-archive behavior and portable import; no background access to personal folders |

These are composable profiles. A quiet compact world and an archival chronicle world can coexist; a per-world history adjective cannot override save integrity. Archive/delete is a distinct deliberate action and not automatic cleanup. Food remains optional and no retention/pacing pressure reads unfed state as a debt or lethal risk.

P18 owns the sole synthetic soak: 1/10/100/500-year intervals, same-seed stepped/jump/yield traces, ordinary repetition, all-pinned adversary, 1/10/100 lives/branches, media fan-out, many distinct products, missing packs and quota/crash failures. Record actual raw/encoded/origin bytes, parse/validate/compact/publish time, preservation-query parity and exact next draws. P32 supplies LOD/cursor cases; this paper starts no runner, build or browser proof.
