# G48-B7.B: save budget at 100, 1,000 and 10,000 NPCs

2026-10-14. Planning estimates, not measured serialized records, heap usage or
population benchmarks. Arithmetic below was evaluated in Python. No runtime,
save, build or browser was exercised. Current `src/npc_lives.js:26` caps its
owner at 32 people; read-only P4
`.claude/worktrees/proc-p4-people/src/generated_people.js:31` requires exactly
three. These tables do not widen either validator or claim large-cast support.

## G48-B7.B1 Units, assumptions and scope

`src/save_files.js:194-207` currently guards the entire shared origin at
4,194,304 UTF-16 bytes, including the save key and other keys. That is not a
4 MiB UTF-8 body allowance. Browser quota failure is also handled independently.
`src/save_files.js:176-182` exports UTF-8 base64 with the 11-character prefix
`YAIR-UTF8-1:`. Neither file export nor lossless compression implies that the
current importer stores a compressed local save.

The model estimates incremental B7 data only. Existing names, inventories,
social graph, source definitions, native hero, unrelated saved worlds and
history still need their own bytes. Qualified references/key punctuation and
compact generation receipts are assumed within each row allowance; definitions
and model tables are referenced by pinned revision, not repeated per body.
Long IDs, Unicode, many observers, model complexity or many unique constraints
can invalidate those assumptions. The fixed dictionary/index allowance is also
a target, not an observed bound.

| Code / allowance | Assumed compact JSON bytes | Included |
|---|---:|---|
| B0 Shared header/index/reference dictionary | 8,192 | Schema/revisions, mapping and common references; excludes existing base-game save |
| B1 L0 unresolved capsule | 128 / NPC | Qualified body/owner slot, seed/revision/template/constraint reference, sparse coverage; no generated phenotype |
| B2 L1 visible demand | 384 / NPC | B1 plus small species/age-basis/appearance bundle and commitments |
| B3 L2 recurring demand | 1,024 / NPC | B2 plus relevant build/quirk instances and bounded parameters |
| B4 L3 specialist/lineage demand | 3,072 / NPC | B3 plus a modest set of physique/constitution/model inputs and receipts; not a complete genome |
| B5 Observation reference/claim | 96 / entry | Compact observer/path/epoch/stage/value/evidence reference; referenced external claim text must be counted separately |
| B6 Creation capsule add-on | 256 / capsule | Event time/model/contributor/snapshot references and child anchors, no copied parent body |
| B7 Unique parent transmission snapshot add-on | 192 / snapshot | Small qualified model subset, epoch and provenance; shared by twins/litter and later demands only when inputs are identical |

B1-B4 are total row allowances, not incremental promotion costs to add together.
Default example observations per body: L0=0, L1=2, L2=6, L3=12. They count
across observers, not twelve for each observer. More observations add actual
bytes; no relationship count or biological trait limit follows from the table.
B6/B7 are separate because many old or young family members can have lineage
dependencies while otherwise remaining L0. A lineage capsule is not free merely
because the child's detailed body has not been generated.

## G48-B7.B2 Population estimates

Assume all numeric/string content is ASCII for this planning arithmetic, so
UTF-16 bytes are twice compact JSON bytes. This is not an encoding identity for
arbitrary text. For real fixtures measure `TextEncoder().encode(json).length`
and `json.length * 2` separately. Export column includes base64 and prefix,
excluding any additional file metadata and existing save fields.

| Case | L0 / L1 / L2 / L3 | Body rows B1-B4 | B5 evidence | Total with B0, assumed UTF-8 | UTF-16 storage | Base64 file bytes |
|---|---|---:|---:|---:|---:|---:|
| B8 100 NPCs, proportional | 70 / 25 / 4 / 1 | 25,728 | 8,256 | 42,176 (41.19 KiB) | 84,352 | 56,247 |
| B9 1,000 NPCs, proportional | 700 / 250 / 40 / 10 | 257,280 | 82,560 | 348,032 (339.88 KiB) | 696,064 | 464,055 |
| B10 10,000 NPCs, proportional | 7,000 / 2,500 / 400 / 100 | 2,572,800 | 825,600 | 3,406,592 (3,326.75 KiB) | 6,813,184 | 4,542,135 |
| B11 10,000 NPCs, sparse working set | 9,664 / 256 / 64 / 16 | 1,449,984 | 104,448 | 1,562,624 (1,526 KiB) | 3,125,248 | 2,083,511 |

B8/B9 leave substantial headroom **for the body-only estimate**. B10 exceeds
the current origin guard by 2,618,880 bytes even before the rest of the game.
B11 leaves only 1,069,056 bytes for every other origin key and game domain;
it is a conditional scenario, not a safe default or a cap on deep relationships.
If repeated play fixes thousands of bodies, backgrounding cannot make them L0
again. Retain their fields and count them at their actual stored sizes.

For comparison, all bodies at the assumed L3 size with twelve observations
would consume 430,592 / 4,232,192 / 42,248,192 compact JSON bytes at
100 / 1,000 / 10,000 NPCs. Their UTF-16 storage would be
861,184 / 8,464,384 / 84,496,384 bytes. Population size alone cannot predict
whether a save fits; fixed detail and history dominate long-run growth.

## G48-B7.B3 Family history sensitivity

Illustrative lineage load: one creation capsule for 25% of NPCs and two unique
parent snapshots per capsule. Snapshot sharing could reduce this; changing
parents across epochs or large models could increase it. Add `256*C + 192*P`
bytes. No existing household parent list is claimed to contain these snapshots.

| Case | C / P | Additional compact bytes | Total compact bytes | Total UTF-16 storage |
|---|---|---:|---:|---:|
| B12 100 proportional + lineage | 25 / 50 | 16,000 | 58,176 | 116,352 |
| B13 1,000 proportional + lineage | 250 / 500 | 160,000 | 508,032 | 1,016,064 |
| B14 10,000 proportional + lineage | 2,500 / 5,000 | 1,600,000 | 5,006,592 | 10,013,184 |
| B15 10,000 sparse + lineage | 2,500 / 5,000 | 1,600,000 | 3,162,624 | 6,325,248 |

Lazy phenotype alone does not make B15 fit. The fix needs measured lossless
reference sharing, compact transmission models or a larger durable-storage
backend with its own atomic compatibility and import/export proof. Turning a
known child into an anonymous crowd or forgetting conception inputs would
break [CONSISTENCY](CONSISTENCY.md), so it is not a budget remedy.

## G48-B7.B4 Engineering options and domain joins

Default proposal: target <=128 KiB incremental UTF-16 for the 100-person
fixture and <=1 MiB for 1,000, including the illustrated family load. At
10,000, select a measured storage/retention design before population admission;
no unconditional fit claim. Targets guide engineering, not import rejection of
a valid life. The actual shared-origin guard still applies.

Dial: a reversible codec can pool long references and encode cold capsules in
typed compact rows while decoding to B2's logical field paths. If B11's L0
rows fell from the assumed 128 to 64 compact bytes with no semantic loss, its
total would be 944,128 UTF-8 / 1,888,256 UTF-16 bytes. That is hypothetical,
not a measured codec. With B15's lineage add-on, even this would be 2,544,128
compact / 5,088,256 UTF-16 bytes and still exceed the current guard.

Reason/cost: sharing immutable templates and snapshots saves bytes without
erasing an NPC. Keep commitment coverage, model revisions, qualified identities
and dependency references intact. Retained definitions must remain resolvable
after pack updates. Compress disposable view caches and repeated labels first;
never truncate unresolved care, lineage, custody, diagnosis or replay evidence.

B2 SPEC.md:137-152 budgets a single native record, not a record to multiply
by 10,000. P19 CONTRACT.md:86-102 estimates about 776 KiB incremental social
state per active world and calls it unmeasured. Count shared records once, but
their extra references still cost bytes. Adding that estimate as ASCII to B11
would add about 1,589,248 UTF-16 bytes, exceeding the shared-origin guard before
other game data. Multiworld retained instances compound the problem.

If the selected backend cannot hold a new optional observation/event, reserve
capacity before taking costs. Keep previous saved state and surface a neutral
capacity result. Do not show a half-generated trait or use hidden genotype
complexity as a revealing error message. Optional detail can wait; paid actions
need a complete admission/settlement policy. Saving more to a file does not
silently increase current local-storage capacity.

## G48-B7.B5 Reproduction and remaining measurement

Arithmetic executed without accessing saves or generating gameplay:

```python
sizes = (128, 384, 1024, 3072)
observations = (0, 2, 6, 12)
cases = [(100, (70,25,4,1)), (1000, (700,250,40,10)),
         (10000, (7000,2500,400,100)), (10000, (9664,256,64,16))]
for n, counts in cases:
    rows = sum(c*s for c,s in zip(counts, sizes))
    claims = sum(c*k for c,k in zip(counts, observations)) * 96
    total = 8192 + rows + claims
    export = 11 + 4*((total+2)//3)
    family = 256*(n//4) + 192*(n//2)
    print(n, rows, claims, total, total*2, export,
          total+family, (total+family)*2)
```

Later benchmark fixtures need actual full-envelope serializer output, native
guarded writes and literal-file imports at 100/1,000/10,000, including long
qualified IDs, Unicode, multiple observers, family snapshots, known-detail
accumulation and all-pinned retention. Report decoded UTF-8, local UTF-16,
encoded export, other origin keys, serialized delta and retained lineage bytes
separately. Also measure heap, serialize/validate/import time, p95/p99 body
resolution and due-work backlog on a named laptop/browser/build. No O(N²)
observer matrix is allocated; only actual observations and active demands are
stored. Sparse design is a proposal, not measured engine-wide performance.
