# Kernel spike, 2026-10-14

## CHECKPOINT

ER14 complete as a disposable headless spike. All implementation and measurements ran in `/tmp/yairpg-er14`; the finished source/evidence is copied into [ER14/spike](../gm/dispatch/engine-runtime-2026-10-14/ER14/spike/README.md). 15 checks pass. No repo runtime, tests, bundle, saves, private packs, dependency installation, commit or push changed. No native gameplay acceptance is claimed. Resume from the copied source and JSON, or the scratch directory; no active ER14 worker remains. [Lane report](../gm/dispatch/engine-runtime-2026-10-14/ER14/REPORT.md).

**Main result:** the kernel boundary is small; translating existing ownership and update granularity is the hard part. One idle crowded tick costs 0.341375 ms median, but 128 due settlements still cost 92.914875 ms because the adapter copies its 579 KB actor domain once per completion. This is a useful failed performance target, not a production engine endorsement.

Scope follows [COMMON](../gm/dispatch/engine-runtime-2026-10-14/COMMON.md), root OE1/OE2/OE3/OE5 and SB5/SB6/SB9. It extends [ER1](RUNTIME_HOTSPOT_AUDIT_2026-10-14.md), [ER2](CODEBASE_STRUCTURE_AND_BUNDLE_AUDIT_2026-10-14.md), [ER3](TECH_STACK_OPTIONS_2026-10-14.md), [E1-E10](../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md) and [offline/branch clocks](OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md). Existing PROJECT.md opt-in expansion, retained saves, one realm/one prestige and desktop-first direction remain authoritative. This request authorizes a scratch experiment, not a new stack, offline policy or whole-engine rewrite. No UI was changed, so no viewport behavior is claimed.

## What was awkward to adapt

| Code | Evidence | Finding and smallest proposal | Palette |
| --- | --- | --- | --- |
| ER14-F1 | READ + INFERRED | The full expansion scheduler is not a portable leaf: `src/expansion_engine.js:588-640` clones state/external/gameplay, reconciles native containers and many world contexts, stops at choices/death and returns remaining time. ER2-F3 identifies its 55-module cycle. Copying that entire closure would turn this spike into a second game. Start extraction with an injected existing boundary/settlement interface, preserving those contracts; do not replace it with this fixture executor. | OE10, RT1, CH2 |
| ER14-F2 | READ + MEASURED | `src/absorb_e1/pacing.js:30-50` takes a current home/season context for a whole interval. The adapter fixes Spring and home presence. Travel/season changes need scheduled context boundaries; a single current context cannot describe historical elapsed time. Also, lines 83-87 retain a singleton runtime state; copied pure calls must bypass those wrappers or create another owner. | OE1, SB5, RT1 |
| ER14-F3 | MEASURED + READ | Enabled hunger is not bit-exact across partitions: single 7 minutes gives 98.54166666666667 fullness, seven 1-minute advances give 98.5416666666667, difference -2.842170943040401e-14. The source subtraction is at pacing.js:35. This is tiny numeric drift, not measured gameplay harm. Default-off hunger is preserved; any future exact replay contract needs fixed-point/remainder arithmetic or a declared numerical tolerance, not an adapter silently changing game balance. | MC6, RT9, SB5 |
| ER14-F4 | READ + MEASURED | `src/world_rhythm.js:5-12,20-30` expects absolute native calendar minutes, while kernel time is elapsed played minutes. The adapter supplies an explicit saved-fixture origin and keeps last-claim state in its own slice. Missed windows grant nothing; a claim command rejects outside a window. Production must bind the existing calendar/claim owner, rather than invent a second calendar or backpay. The origin/schedule are fixture content, not saved native metadata here. | RT1, OE2, SB5 |
| ER14-F5 | MEASURED + INFERRED | Whole-domain write APIs transfer the copy bottleneck into the adapter. Crowded settlement remains 92.914875 ms median / 107.133459 ms p95 even with a heap. Each of 128 completions spreads and clones the whole actor/facts slice (`spike/adapter.mjs:15`, `spike/kernel.mjs:54`). Proposal: stage per-entity updates and freeze/publish changed actors once per boundary, retaining transaction validation. Do not treat a heap alone as the fix. | OE2, PF1, E5 |
| ER14-F6 | READ + MEASURED | Incremental validators need an explicit dependency closure. This prototype reruns reverse `validateDepends` edges, and its test proves a dependent validator runs after another slice changes. Actual game validation crosses custody, resources, world identity and native stock. A missing edge can validate each slice while missing a broken combined invariant. Declare those edges at the existing plan boundary before reducing validation. | OE5, DA2, MC21, E3/E8 |
| ER14-F7 | MEASURED + READ | The first benchmark failed when save hashes from a memory backend were reused on an empty filesystem backend, referencing nonexistent chunks. The kernel now resets saved hashes when backend identity changes; the added backend-switch check passes. A production adapter must own backend identity and generation, not cache durability as a property of live state alone. | OE5, DA2, E2 |
| ER14-F8 | READ + INFERRED | `core` combines heap, RNG streams, command receipts and replay log. A one-minute tick rewrites 36,167 bytes at crowded size even though actor/item chunks stay untouched. Log/receipt retention is unbounded, and each operation clones core. Save also reads all chunks to report total bytes. Split metadata/checkpoints/log segments and track reference byte lengths before claiming incremental work throughout. | OE5, DA2, OS7, E4 |

## Implemented boundary

READ: [kernel.mjs](../gm/dispatch/engine-runtime-2026-10-14/ER14/spike/kernel.mjs) is 101 physical lines (compact code), below the requested approximate 600-line ceiling. The adapter is 30 lines. Copied modules are unchanged, with SHA-256 provenance and LICENSE retained. No third-party package is needed.

| Code | Mechanism | Observable contract |
| --- | --- | --- |
| ER14-K1 | Private clock; due-time binary min-heap | Only host `advance` changes clock. Interval systems run before due commands at a boundary; ties resolve dependency rank, event ID, then sequence. Whole advance commits once. Safe whole minutes only. A 10,000-event guard throws and rolls back, rather than returning causal remaining time. |
| ER14-K2 | Command bus and named xorshift32 streams | Successful command IDs and payload fingerprints persist. Identical retry is a no-op; reused ID with another payload rejects. Initial seeds and per-stream cursors persist; another stream's draws do not perturb loot. Scheduled jobs do not have unique-slot enforcement. |
| ER14-K3 | Frozen domain views, staged replacements | Reads cannot mutate nested state or roll RNG. Changed domains are copied/frozen; a failed handler rolls back slices, clock, RNG, heap, receipts and log. Trusted handlers can write any domain; this is not a plugin security boundary. |
| ER14-K4 | Manifest dependency order | Deterministic dependency resolution, missing dependency/cycle/ID collision rejection, version pin. Systems declare IDs. No migration registry, panels, content compiler or event notification bus was built. |
| ER14-K5 | JSON chunks plus manifest | Six state chunks, schema pin, SHA-256 checks and module versions. Dirty domains plus reverse validation dependencies validate; core always validates. Load/import stages and validates all domains before publishing. Changed chunks write first, manifest last. Filesystem backend uses rename for manifest replacement, without fsync. |

Persistence is an explicit snapshot operation after a live command, not a durable command transaction. A failed save leaves newer unsaved live state while the prior persisted manifest remains loadable. This tests E2 recovery, but does **not** satisfy the full E3 native plan/write/publish gate. The heap comparator is a fixture contract; current expansion pending jobs use due/sequence ordering (`expansion_engine.js:614`), so adopting its ID tie break would be a behavior change requiring a compatibility choice.

## Equality and failure checks

MEASURED command:

```sh
node /tmp/yairpg-er14/check.mjs > /tmp/yairpg-er14/check-results.json
```

Exit 0; 15 named checks in [check-results.json](../gm/dispatch/engine-runtime-2026-10-14/ER14/spike/check-results.json). Exact gameplay equality holds for 2,880 minutes versus `[1,59,120,300,2400]`, with 128 due jobs, named loot draws and weather enabled/default-off hunger. Equality includes slices, clock, queue, sequence, RNG cursors and idempotency receipts; it excludes the intentionally different advance-partition log. This does not establish arbitrary partition/context equality.

Replay from original fixture + initial seeds + command/advance log is exactly equal to the original full snapshot, including log, after job completion, a recurring claim and weather toggle. This tests kernel-owned synthetic RNG only: the two copied modules do not themselves draw randomness. It is not replay of native combat or the whole expansion engine.

Other checks cover nested immutable views/pure projections, reversed manifest input order, missing/cyclic/version rejection, handler rollback, same-time ordering, invalid advance/event-budget rollback, cross-slice incremental validation, exact snapshot load/import and continued advance, duplicate ID after reload, no missed-window claim, corrupt chunk rejection without partial publication, manifest failure/retry and backend switching. Hunger drift is an asserted counterexample, reported separately rather than called a failed kernel check.

## Per-advance measurements

MEASURED command:

```sh
node /tmp/yairpg-er14/benchmark.mjs > /tmp/yairpg-er14/benchmark-output.jsonl
```

Final exit 0. Node v22.23.3, Apple M5 Pro, macOS; 2026-10-14 05:09:30 to 05:10:12 UTC. Four warmups then 31 samples, median / nearest-rank p95, fixture construction and load excluded, no forced GC. Shared host contention was uncontrolled. Kernel and live expansion measurements ran in one process; historical ER1 values are READ from its saved JSON, not re-labelled as today's measurement. [Raw result](../gm/dispatch/engine-runtime-2026-10-14/ER14/spike/benchmark-results.json).

Fresh: 1 actor, 1 job, 20 inventory entries, zero expired opportunities/facts. Crowded: 128 actors/jobs, 10,000 inventory entries, 2,000 expired opportunities, 100 facts/actor. Both schedule work due at minute 60. Live baseline fixture copies ER1's setup and calls the current repo's pure `advanceSimulation`; it does not edit or run the game bundle. The kernel has simpler actors/opportunities, omits the native envelope and most causal hooks, and adds weather plus random output instead of the baseline's fixed +1. These are cardinality comparisons, not equivalent gameplay implementations or a controlled engine replacement speedup.

| Code | Shape / advance | Kernel ms median / p95 | Live expansion rerun ms median / p95 | Historical ER1 ms median / p95 (READ) |
| --- | --- | ---: | ---: | ---: |
| ER14-M1 | fresh / 1 minute, future jobs | 0.014000 / 0.067125 | 0.621291 / 33.599500 | 0.5741 / 3.6210 |
| ER14-M2 | fresh / 60 minutes, settle all | 0.020083 / 0.069875 | 4.831042 / 41.469208 | 5.8882 / 263.1450 |
| ER14-M3 | crowded / 1 minute, future jobs | 0.341375 / 0.437791 | 20.650875 / 23.522292 | 132.4878 / 282.2824 |
| ER14-M4 | crowded / 60 minutes, settle all | 92.914875 / 107.133459 | 170.722167 / 195.263834 | 719.4789 / 2045.5210 |

The historical crowded future-job median was 132.4878 ms; this rerun is 20.650875 ms without a repo optimization. That change alone shows why headline ratios against the old run are unreliable. Settlement is a bulk 60-minute advance, not one rendered frame or sustained per-minute cost. No browser/render/worker measurement was made.

## Save bytes and chunk writes

MEASURED by the same benchmark command. Each per-chunk row measures only synchronous filesystem write of already serialized text, four warmups plus 31 samples. Manifest timing includes temporary-file write and rename. OS cache is included; fsync, browser localStorage/IndexedDB, quota, crash durability and disk flush are **not** measured. Content hashing/serialization/validation are excluded from these individual write timings.

| Code | Size | Chunk | UTF-8 bytes | Write median ms | Write p95 ms |
| --- | --- | --- | ---: | ---: | ---: |
| ER14-C1 | fresh | actors | 66 | 0.063209 | 0.261667 |
| ER14-C2 | fresh | claims | 49 | 0.047167 | 0.053625 |
| ER14-C3 | fresh | core | 350 | 0.059125 | 0.237709 |
| ER14-C4 | fresh | expired | 23 | 0.056542 | 0.217833 |
| ER14-C5 | fresh | inventory | 953 | 0.045708 | 0.056459 |
| ER14-C6 | fresh | pacing | 130 | 0.050125 | 0.232083 |
| ER14-C7 | fresh | manifest | 1,256 | 0.148792 | 0.253583 |
| ER14-C8 | crowded | actors | 579,112 | 0.156750 | 0.193458 |
| ER14-C9 | crowded | claims | 49 | 0.034083 | 0.053875 |
| ER14-C10 | crowded | core | 36,153 | 0.047584 | 0.085791 |
| ER14-C11 | crowded | expired | 122,912 | 0.055541 | 0.082959 |
| ER14-C12 | crowded | inventory | 488,916 | 0.132334 | 0.299834 |
| ER14-C13 | crowded | pacing | 130 | 0.029583 | 0.052375 |
| ER14-C14 | crowded | manifest | 1,256 | 0.089791 | 0.126750 |

MEASURED full referenced snapshot totals: fresh **2,827 bytes**, crowded **1,228,528 bytes**, including manifest. These exclude old/orphan content-addressed generations and directory overhead. They are not a reduction claim against ER1's native envelope, because the schemas differ. Full snapshot validate/serialize/hash/write/read-for-byte-count cost is **0.694958 / 1.408167 ms** fresh and **5.731125 / 7.776792 ms** crowded (median / p95).

After one idle minute, validation names only `pacing`, and writes are only `core`, `pacing`, `manifest`: **1,750 bytes** fresh and **37,553 bytes** crowded. Unchanged actors, inventory, expired opportunities and claims chunks are not rewritten. Core validation scans pending jobs on every operation; chunked persistence does not remove that cost. The backend still reads unchanged chunks for total-byte accounting and leaves orphan files after failed writes; both are explicit prototype limits.

## Ranked proposals and open gates

| Rank / code | Proposal | Cost once / palette |
| --- | --- | --- |
| 1 / ER14-A1 | Extract one pure existing consumer behind the current time/context/publisher authority, retaining native calendar and absence rules. Bind dependency manifests as wiring, without importing the whole cyclic registry into a new core. | Small bounded adapter plus native equivalence work; OE10, RT1, CH2. |
| 2 / ER14-A2 | Add per-entity staging or one batched actor publication per causal boundary before treating the crowded settlement cost as acceptable. | Moderate ownership/rollback validation work; OE2, PF1, E3/E5. |
| 3 / ER14-A3 | Map real cross-domain validation edges and split replay/receipts from core; measure serialization, hashing and writes separately on the chosen browser backend. | Moderate save compatibility and failure tests; OE5, DA2, MC21, E2/E4/E8. |

OPEN: complete expansion/native adapter; pause-before-choice/death and remaining-time semantics; varying world/season contexts; actual stock-backed meal consumption; legacy full-envelope compatibility/migration; exact durable plan/write/publish; multi-tab writer authority; browser backend failure/reload/export/literal import; retained generation GC and history policy; rebuilt desktop gameplay acceptance. Existing native gates remain with their owners. Nothing here selects a new gameplay, offline, world or UI policy.
