# T13 proposed research save contract

2026-10-14. **Proposal, not a schema allocation or migration already installed.**
R5-R7 refine IM2/IM3/IM4/IM5/IM6 and OM3/OM8. [OWNERS](OWNERS.md) owns module
boundaries; [T9 Z5](../t9/SAVE_STABILITY.md) and [T8 B26-B30](../t8/SAVE_CONTRACT.md)
provide retained-meaning and world-generation requirements.

## R5. One optional envelope

Proposed location: top-level `save.research`. Absent means empty/inert in memory;
loading or inspecting an old save does not persist enrollment, fabricate past
notes or activate world simulation. New serializers omit the field until the
first admitted research operation. A present empty owner is valid. Present `null`,
wrong type or future schema rejects before mutation. Schema1 below is independently
versioned; it does not change current `fork_schema` or expansion schema merely to
host a top-level optional field (`src/save_files.js:109`, `src/main.js:5236`).

```json
{
  "schema": 1,
  "revision": 0,
  "nextId": 1,
  "endpoints": {},
  "actors": {},
  "receipts": {},
  "summaries": {},
  "producerCursors": {},
  "manifests": {},
  "bundles": {},
  "projects": {},
  "worldTech": {},
  "provenance": {}
}
```

IDs are safe namespaced strings; generated record IDs use an explicit saved
ordinal (`research.receipt:1`, etc.), never Date.now or preview counters. All
objects are plain JSON. Ordinals are positive safe integers, revisions are
nonnegative safe integers, times are nonnegative safe integers with explicit clock
binding, and prose has a bounded length. Validate exact versioned field shapes,
unique IDs, references, acyclic cause ancestry and JSON compatibility. Reject
prototype keys, NaN, unsafe integers, duplicate operations and arbitrary scripts.
Future subrecords use a new explicit owner schema or reviewed migration.

| Field / record | Required retained shape and meaning |
|---|---|
| `revision`, `nextId` | Owner revision for stale-plan checks; next ordinal allocated only in a successful candidate. Never truncate/recycle IDs during compaction |
| `endpoints[id]` | `{worldId,instanceId,continuityId,branchId,eraId,lawRef,clockRef,enrolledAt,coverage}`. Use actual native/structured bindings; missing historical identity is explicitly `legacyUnspecified` in coverage, not a fabricated lifetime. No implied clock synchronization |
| `actors[id]` | `{actorRef,lifeRef,endpointRefs,questions,claims}`. `lifeRef:null` means unsupported identity, not all lives. `questions[q]` holds subject/known goal, opened receipt, status open/resolved/abandoned and basis refs. `claims[c]` holds subject/method ref, believed value/label, fidelity 0-5, confidence label, epistemic status, basis refs, revision. Knowledge is actor-specific; wrong claims may remain supported by bad evidence |
| `receipts[id]` | `{ordinal,operation,producer,producerRevision,endpointRef,actorRef,subjectRef,kind,at,calendarAt,audience,basis,observed,settlementRef,manifestRef,drawRefs}`. Kinds observation/reading/lesson/trial/correction/transmission/reveal. `at` uses endpoint clock; calendarAt may be null. Observed payload is a bounded typed local reading, not all world properties. Basis names held instrument/text/teacher/sample/body and its revision. Economic result belongs to settlementRef; paid trial additionally pins exact sample and conditions |
| `summaries[id]` | `{scope,kind,firstAt,lastAt,count,outcomes,basisClasses,receiptRanges}` for redundant terminal evidence. Typed counts preserve measured contexts and contradiction categories, never upgrade fidelity by count alone. Summary cannot satisfy a predicate requiring an exact individual receipt |
| `producerCursors[id]` | `{endpointRef,producerRevision,lastSettledOrdinal,pending,retainedOperations}`. Ordered producer processing checkpoint plus currently pending operations. Preserves idempotence after display receipts compact. Same/lower committed ordinal cannot be rewarded again. Out-of-order external producers retain exact operation IDs until a proven closed boundary; no lossy dedup |
| `manifests[id]` | `{packId,packRevision,packDigest,plannerRevision,graphSchema,compilerRevision,lawRef,lawRevision,sourcePins,policyRevision,consumerRefs,semanticDigest,presentationDigest}`. Hashes identify validated canonical content, not executable support or source truth. Source pins carry shown/stated/inferred qualification without raw source prose |
| `bundles[id]` | `{manifestRef,targets,graph,worldSnapshot,methodDefinitions,consumerContracts,choices,dangerReceipt}`. Intern immutable retained topology, pruning, captured capabilities and method meaning. Availability snapshot explains a past decision, never creates stock. Include required pack definitions/terms and safe labels; do not export private source prose. Graphs are private world truth until a permitted projection |
| `projects[id]` | `{actorRef,endpointRef,bundleRef,targetIntent,selectedMethods,status,jobRef,terms,receiptRefs}`. Intent distinguishes literal from functional equivalent. Status pinned/active/blocked/complete/cancelled. A pinned roadmap is not paid work. `jobRef:null`, `terms:null` for pins. Active terms freeze supported costs/duration/consumer revisions, reference actual reservation/job owner; no duplicate stock ledger |
| `worldTech[id]` | Deferred `{endpointRef,generatorRevision,rootReceipt,lawRef,policyRefs,regions,ruins,inventors,historyRefs,schedule,drawReceipts}`. Store resolved truth and admitted next schedule, not just seed. Regional use/production and actor knowledge remain separate. Existing world facts only receive scalar adapter flags, not this nested record |
| `provenance[id]` | Deferred `{specimenRef,bundleRef,productionReceipt,makerRef,placeRef,calendarAt,attemptRef,custodyRefs}`. Only validated unique specimen or explicit batch identity. Old native stack keys alone cannot be specimenRef; unknown old maker/date stays unknown |

Each nullable field is explicit; no undefined or function-valued metadata.
The schema may keep the deferred maps empty in the first slice. Build only their
validators once a concrete record type is selected; schema 1 must reject nonempty
unsupported deferred records rather than claim their implementation.

State stores no extra Science XP, purse, inventory, personal skill level, body,
world clock or carrier. Claim fidelity never implies native recipe unlock. An
actual consumer adapter makes that change through its own authorized transaction.
Life record is a lossy display owner (`src/life_record.js:1`); append selected
`memory`/`legacy` entries only after settlement. A first-success predicate belongs
in authoritative producer/research state, not in compacted biography.

## R6. Receipts, revisions and compaction

A research event may cite a retained P34 story outcome after that owner is
integrated and admits the producer type. P34 currently limits actions/sites
(`.claude/worktrees/proc-p34-spine/src/lore_history_state.js:25`), so its ID is not
an automatic generic receipt API. For research-bearing events, retain the minimum
observation basis locally and pin the external outcome, or use its approved
retention bridge. Do not maintain another purse/reward receipt for the same deed.

Pack revision policy: each new pin/project selects an explicit immutable manifest.
Existing pins, active jobs and products read retained bundles and supported
resolver/handler revisions. Reordering identical definitions is semantic-neutral;
changed requirements, meanings, costs, labels or world laws cannot silently replace
old records. Labels can change only under a recorded presentation migration that
preserves known-view/disclosure queries. No bare target ID, content hash, seed or
remote URL suffices to restore an old roadmap. Save the definition closure and
retain compatible code handlers. Missing executable handler or future schema
rejects full import under the initial proposal. Dormant feature restoration is a
later host capability, not something the current loader guarantees.

For IM5, derive once from `expansion.streams.root` and an exact positional key
`["research-world",endpointId,generatorRevision]`, pin derivation/algorithm revision
and resolved values at enrollment. Current root exists at `src/seeded_streams.js:25`;
mutable expansion rng/simulation seed are not substituted on revisit. Named draws
use an admitted `world.events:*` scoped stream through the current API, staged
alongside the world operation. Persist necessary draw receipts in worldTech;
bounded stream logs (`src/seeded_streams.js:59`) are insufficient for old truth.
Previews use already retained values or pure `unitDecision` on detached input,
never ensureStreams/keyedUnit on live state. Branch copies retain pending choices;
only a new authorized operation gets a branch-qualified identity. No offline or
cross-life progression is enabled by storing clockRef.

Compaction is a pure, deterministic, idempotent operation with query parity:

1. R6a: Compute transitive pins from active/pinned projects, claims/questions,
   exact consumer prerequisites, unpaid/pending jobs, products/provenance,
   external receipt refs, world history and retained causes/manifests/bundles.
2. R6b: Group only unpinned terminal redundant observations by actor, endpoint,
   subject, conditions/basis and producer revision. Preserve typed disagreement,
   counts/date coverage; do not collapse different worlds, samples or source lineages.
3. R6c: Advance only proven ordered producer closure; retain pending/out-of-order
   identities. Consumers that need an old exact record keep it pinned. Never
   reconstruct eligibility from a prose summary or a truncated stream log.
4. R6d: Drop only unreferenced detail/bundles after checking reachability and
   equality of known claims, chosen terms, exact prerequisites, settled operation
   identity and next draws. Texture preference changes neither retention nor play.
5. R6e: Measure proposed research UTF-8 cap 1 MiB and bounded collections before
   admission, plus full-origin UTF-16 budget in `src/save_files.js:206`. Initial
   receipt window target256/project target128 are engineering proposals, not
   player lifetime limits. All-pinned pressure refuses new optional admission
   before spending and preserves earned records; export alone does not make
   further browser storage possible. Never silently evict needed evidence.

Final bounds need measured representative envelopes. Root reserves schema names
with P38/host owners before any build; T13 does not allocate them.

## R7. Required test and native acceptance matrix

All cases below are **specified, not run**. Use synthetic disposable fixtures,
never personal saves. Existing source suites cannot establish native import.

| ID | Required case | Observable assertion |
|---|---|---|
| R7a | Legacy pre-v0.6 and current v0.6 saves missing research, expansion absent/present | Native biography/stock/retired content preserved, research empty/inert, no retroactive evidence/enrollment; explicit new operation then serializes schema 1 |
| R7b | Present empty, null, wrong type, future schema, malicious keys, bad time/IDs/fidelity/ref/cycle, oversized nested payload | Empty accepted; others rejected detached before live/storage/draw mutation. Original bytes and last valid life remain recoverable |
| R7c | Observation -> anomaly -> paid comparison -> useful consumer | Exact producer/sample/actor/endpoint/cost and knowledge change coexist with actual native outcome. No XP-only backfill or wrong-belief autocorrection |
| R7d | Native Save/reload and Export/literal-file Import of open question, corrected claim, pinned roadmap, active/completed job and stamped product where selected | Canonical research queries, terms, stock, clock, RNG next result and product use equal. Unicode/CJK labels survive UTF-8 codec (`src/save_files.js:186`) |
| R7e | Import unsupported/missing pack/handler, altered semantic digest, reused ID, changed law/cost, renamed method | Self-contained valid read-only bundle works only with supported schema; unsupported execution rejects before preflight publication. No newest-pack replacement or guessed refund |
| R7f | Pack v2 adds/removes/reorders methods or changes presentation | Existing v1 topology/knowledge/terms remain exact; new project explicitly selects v2. Approved presentation migration preserves mechanical and disclosure queries |
| R7g | Repeat quote/view/known projection, failed admission and failed quota/storage write | Zero live counter, draw, stock or evidence change. Native rollback restores research binding and output/XP; expansion write failure publishes nothing. Post-write render failure never rolls back durable work |
| R7h | Compaction at many years, redundant trials, disagreement, same operation retry after eviction, all-pinned overflow | Queries and dedup survive, no phantom reward; actual new operations remain possible. Idempotent compaction and zero query-induced save growth; report both byte measures |
| R7i | Unknown/strong means, false/pruned belief, secret canaries, another actor/branch/body/sample | Known view omits hidden labels/counts/availability/pruning; permitted revealer scope only; sample/world context does not leak or certify a new specimen. UI errors/ARIA and feed obey the same filter |
| R7j | Provenance lot/key merge, split, storage, trade, equip, consume and reload | Explicit identity preserved; two equivalent native stacks cannot acquire false per-copy lineage. Missing provenance remains unknown |
| R7k | IM5 future enrollment, next scheduled diffusion, undisturbed baseline, failed generation and branch copy | Saved truth/draws persist; natural course/recipient output causal; no preview resampling or invented offline time. Run only if IM5 selected |

Headless tests cover validators, reducers, revisions, compaction, pure T6/T9
contracts and injected failures. Each selected persistence slice additionally
requires rebuilt fresh-origin 1366x768 acquisition-to-use, old-save load,
Save/reload and actual Export/literal Import under AGENTS. Human fiction/pacing
acceptance stays separate. Unexercised behaviors stay implemented-unverified.
