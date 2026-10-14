# Z5: saved meaning across pack revisions

2026-10-14. **PROPOSAL / NOT RUN.** Extends PQ4, PI5/PI7/PW1 and P18
[F2.1/F2.2](../../procgen-2026-10-13/p18/HYGIENE.md:9).
Planner `src/invention_planner.js:99-100` stamps graph `version:1` only.
Pack `src/data/invention_pack_home.js:3` has an ID containing v1; neither
constitutes a pack/world/resolver digest or a save migration. No T6 save owner,
product handler or persistence API is shown in the inspected module/pack.
This packet designs a pure receipt layer first. It does not authorize touching
native saves, strict validators, user data or shared registration.

## Z5: freeze results, not only seeds or IDs

Saving `{targetId:'lamp'}` then expanding against a new pack can change the
recipe, requirements, known alternatives or meaning. A seed cannot reproduce
an output if table/law/algorithm changes. Retain enough immutable definitions
and supported resolver semantics to restore actual saved commitments. Keep
world truth and actor knowledge separate; save access is not in-game discovery.
Public QA manifests must not contain private truth or reversible secret hashes.

Proposed optional owner `inventionReceipts` has a schema revision, an immutable
manifest table, interned graph bundles and project/product records. These are
new optional data, not added fields on existing exact-key owners. Source/save
integrator chooses the actual enclosing seam when native work is selected.

| Part | Proposed retained fields / purpose |
|---|---|
| Manifest | `manifestId, schemaVersion, plannerId/plannerRevision/plannerDigest, packId/packRevision/packDigest, worldId/worldInstanceId/lawRevision/lawDigest, sourceSnapshotRef/continuityId/eraId/overlayRevision` as applicable. Original fixture uses explicit synthetic refs; legacy missing provenance stays `legacyUnspecified` |
| Graph bundle | Exact expanded graph, target descriptors, captured primitive availability context/reasons, pruned-method record, selected choices, graph schema, semantic digest, danger verdict/policy revision and consumer contract revisions. Preserve original text/knowledge projection inputs separately; old world topology is never inferred from newest flags |
| Project | Stable scoped `projectId`, manifest/bundle refs, actor-known fidelity/belief labels and their basis refs, status, selected method choices and record revision. Later scheduled execution adds only owner-approved reservations, paid-input refs, pending terms and clock receipts; T6 itself executes none |
| Product | Future stable specimen/service ID, source project/bundle, function/magnitude/form, immutable resolved effect contract, handler ID/revision, actual custody/output/settlement refs. A planner result alone cannot create this record as an earned product |
| Future generation | Pinned instance generation manifest, retained RNG stream positions and chosen geography/results if generated. T6 currently has no seed or stream; use explicit N/A. Never reset future draws when opening a roadmap, importing or updating text |

Digest canonical JSON after schema validation and normalized structural ordering.
Include target meaning, method requirements, world pruning predicates and
consumer/effect contracts in a semantic digest; retain a separate presentation
digest for labels/reasons. Hash metadata does not validate references or preserve
removed resolver code. Intern graph bundles by immutable scoped manifest+digest
to share lamp/thermometer definitions, not by mutable global node ID alone.
Dedup must not conflate the same `lamp` ID in distinct worlds/instances/laws.

Do not restore availability as fresh stock or replay witness steps as paid work.
The stored availability snapshot explains the old feasibility decision. A later
live availability query uses current qualified means against retained topology;
it cannot prune/add methods implicitly. A world-law transition needs its own
stamped policy. A retained plan may become currently blocked without losing
its identity or changing already paid terms. Actor discovery likewise adds
new knowledge with cause/time; loading cannot auto-correct wrong beliefs.

## Z5: compatibility and negative matrix

| Revision/change | Required outcome |
|---|---|
| Old save without this owner | Stay absent. No retroactive invention enrollment, graphs, products, stock or knowledge. Pure decoder returns absent without consulting new packs |
| Pack reorder, same semantics | Same canonical graph/meaning and saved output. Provenance may identify new raw bytes; do not migrate stable records just to refresh a digest |
| Label, description, translation update | Existing saved display stays exact under original presentation revision. New content may use new labels. Optional explicit display-only migration preserves mechanical/knowledge queries and passes danger/secret lint |
| New target/OR method or changed world flags | Existing instance manifest/topology pinned by default. New instance/project can choose a newer reviewed manifest at an explicit activation boundary. Do not change an old witness or accidentally reveal a new unknown branch |
| Removed/renamed method, changed requirements or reused node ID | Retained bundle and old resolver continue supported semantics. Alias migration requires exact old meaning and collision checks; reused ID with changed meaning must be a new semantic revision, not a transparent replacement |
| Changed price, time, effect or consumer handler | Existing pending accepted terms/products retain old contract and supported handler. New work uses reviewed new terms. Snapshotting text does not make missing executable behavior safe to settle |
| Missing pack, valid self-contained bundle | Read-only roadmap can restore from validated bundle without newest catalog lookup. Pure QA demonstrates display/semantic queries only. Execution requires exact supported resolver and handlers |
| Missing executable resolver/handler, live obligation or product | Return `unsupported-revision` before mutation/publication. A future integrator may select supported dormant behavior that preserves data and ordinary play. Do not guess a handler, refund or delete the obligation |
| Future schema, broken refs, bad digest, duplicate IDs, invalid choice, unknown operator or oversized owner | Reject detached import with structured opaque diagnostic. Current state/storage/RNG unchanged; exportable old state remains recoverable. Validate every retained record, not just active roots |
| Lint policy tightens on old text | Preserve opaque identity/paid terms; withhold flagged exposure/optional execution for review. Explicit safe presentation migration or supported dormant disposition records old/new policies; never regenerate or erase saved truth to clear the finding |

A compatible additive update is a named migration decision, not “always use
latest.” Reuse P18 F2.2's retained-resolver principle. Canon corrections and
source contradictions require qualified overlays; keep source baseline and
original evidence distinct. Cross-world/life transfer still needs an actual
carrier, not shared invention IDs.

## Z5: atomic restore and migration acceptance

Proposed pure `src/invention_receipts.js` API:
`captureRoadmap(input)`, `encodeReceipts(owner)`,
`decodeReceipts(json,{resolverRegistry,limits})`,
`migrateReceipts(owner,migration,{resolverRegistry,limits})`,
`receiptQueries(owner)` and `projectKnownRoadmap(owner,projectId,knowledge)`.
All return detached objects or structured rejection; no storage/DOM/game imports.
`captureRoadmap` receives explicit stable IDs and stamps, not Date.now() or RNG.
Validate graph shapes, operators, unique references, choices, manifest membership,
digests, policy/handler support and resource limits on **every** external graph
before calling T6. Its current APIs assume internally expanded graphs; native
JSON imports cannot rely on that assumption. `checkFeasibility` reads live
availability but does not validate a graph's originating world revision.

Future native pipeline, separately owned: decode/migrate in detached envelope,
validate all native refs/reservations/custody, preflight full shared-origin
quota, persist, then publish all owners. Failure at any stage leaves old
owners/storage/stock/time/stream positions intact. Pure fault-injection fixtures
can demonstrate the protocol without writing localStorage or personal saves.
They are SOURCE_SYNTHETIC, not native Save/reload or literal-file Import.

Preservation query inventory, equality before/after supported revision:

| Query | Exact pass condition |
|---|---|
| `targetMeaning(projectId)` | Same function/magnitude/form, roots, world/instance/law and scale semantics |
| `requirements(projectId)` / `selectedTerms(projectId)` | Same AND/OR edges, retained choices, paid/pending terms and handler revision where present |
| `knownRoadmap(projectId,knowledge)` | Same actor projection, believed labels, hidden slots and next knowledge gap at equal knowledge; no discovery on load |
| `productEffect(productId)` / `custody(productId)` | Same actual supported effect/custody and settlement identity. Pure mock contracts are labelled mock, never native handlers |
| `settled(causeRef)` / `nextGeneratedResult(instanceId)` | Duplicate settlement still rejected; next draw unchanged only when a selected generator exists. T6 has no generation/settlement, so first-lane checks are N/A |

Use exact retained records for authority. Lossy prose/summary cannot reconstruct
requirements, obligations, stock or knowledge. Transitive pins include product,
project, paid input, consumer, knowledge evidence and manifest/bundle refs.
Compaction can discard only unreferenced terminal optional detail with declared
query parity, deterministic/idempotent behavior and no RNG. At all-pinned limits,
deny new optional admission and preserve existing records; storage handling is
not a fixed once-per-world invention restriction. Reuse P18
[F3 pin/query protocol](../../procgen-2026-10-13/p18/HYGIENE.md:86).

Measure UTF-8 serialized bytes, UTF-16 storage use and eventual full-envelope
quota separately, per P18 [M9](../../procgen-2026-10-13/p18/METRICS.md:207).
The Z6 one-MiB/128-receipt profile is a proposed synthetic bound, not guaranteed
free browser capacity. Interned definitions reduce duplication; if still full,
pause optional admission instead of throwing away earned products. Repeated
queries must add zero records/bytes. Test 1/32/128 projects, repeated capture
with same project ID, equivalent graph sharing, long labels and all-pinned
overflow. Never claim hundreds of game-years of persistence from pure JSON size.

### Proposed `tests/invention_receipts.test.js` sketch

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {captureRoadmap, encodeReceipts, decodeReceipts, receiptQueries}
  from '../src/invention_receipts.js'; // Proposed module, build it.
import {receiptInput, resolverV1, changedPackV2, corruptReceipt,
  restoreIntoMemoryAtomically, emptyMemoryFixture}
  from './helpers/invention_qa.mjs'; // All synthetic, no real saves.

test('Z5: retained meanings survive newest-pack replacement', () => {
  const saved = captureRoadmap(receiptInput('lamp'));
  const text = encodeReceipts(saved);
  const restored = decodeReceipts(text, {resolverRegistry: resolverV1,
    currentPack: changedPackV2()}); // v2 changes lamp requirements/labels.
  assert.equal(restored.status, 'ok');
  assert.deepEqual(receiptQueries(restored.owner), receiptQueries(saved));
  assert.equal(encodeReceipts(restored.owner), text);
});
test('Z5: invalid or unsupported import cannot publish owners', () => {
  for (const kind of ['future-schema', 'missing-handler', 'dangling-ref',
    'bad-digest', 'reused-id', 'invalid-choice', 'oversize']) {
    const memory = emptyMemoryFixture(), before = structuredClone(memory);
    const r = restoreIntoMemoryAtomically(memory, corruptReceipt(kind),
      {resolverRegistry: resolverV1});
    assert.equal(r.status, 'rejected');
    assert.deepEqual(memory, before);
  }
});
test('Z5: failed durable write preserves the old fixture', () => {
  const memory = emptyMemoryFixture(), before = structuredClone(memory);
  const r = restoreIntoMemoryAtomically(memory,
    encodeReceipts(captureRoadmap(receiptInput('soap'))),
    {resolverRegistry: resolverV1, failWrite: true});
  assert.equal(r.status, 'rejected');
  assert.deepEqual(memory, before);
});
// Add absent-owner, retained wrong knowledge, missing-pack display, pinned-law,
// renamed IDs, digest/schema checks, query idempotence, sharing and capacity.
// Add mocks for effect/settlement only with explicit SOURCE_SYNTHETIC labels.
```

Only pure receipt roundtrip and synthetic atomic-protocol tests belong in the
later planner QA lane. Real native Save/reload, Export/literal-file Import,
old-save compatibility, failed browser publication, actual product use and
desktop rebuild proof remain separate if game wiring is later authorized.
All receipt APIs, migrations, size benchmarks and persistence gates above are
NOT RUN by T9.
