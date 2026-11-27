# Atlas orphan outputs

Owner: [batch field coverage](ATLAS_BATCH_FIELD_COVERAGE_2026-11-25.md). This is execution evidence for the authorized Atlas output inventory, not a new product decision.

The inventory previously counted unindexed files by a loose book-key prefix, which could attribute `hp10` output to `hp1`. It also gave canonical chapter output without a shard text no inspectable inventory or digest route.

| Preflight | Scope |
| --- | --- |
| Reading | Inspect observed outputs belonging to an exact registry book when the prepared shard text is absent. |
| Fit | Existing canonical/Luna file selector, registry book directory, `bookShards`, legacy selection, bounded world digest and exact output-record joins. |
| Outcome | Separate prepared, historic legacy and canonical orphan output metadata. An orphan's first chapter can be identified; its range endpoint and chapter coverage remain unknown. |
| Failure | Adjacent book keys, reruns, malformed chapter stems, duplicate registry ownership, partial and unmigrated files, sealed rows, and input changes after snapshot must not gain false provenance or completed coverage. |
| Privacy | Inventory returns counts and logical identities. Digest returns its existing public bounded projections. File paths, filenames, source prose and private row content stay out. |
| Files | `batch-output-index.mjs`, `reader-slices.mjs`, orphan admission hunks in `reader-findings.mjs`, focused inventory tests. Root coordinates UI, endpoint and desktop proof. |

The API adds `orphans.shards`, `orphans.totals`, and `orphans.outputs`. These contain selected observed files, with missing sibling outputs excluded and pass completion unasserted (`complete: null`). Prepared totals and legacy totals keep their existing meanings. Exact chapter stems accept canonical and Luna outputs; reruns, arbitrary extra leading zeroes and ambiguous exact registry ownership do not establish orphan slices.

Clean migrated selections can enter the existing world digest. Partial-marker, invalid, unreadable and unmigrated selections remain inspectable metadata without admitting their rows. Each orphan file is read once; the same captured bytes supply its parsed rows and its hash. A malformed row prevents admission of that file's entire contents. `orphanSlices` stays separate from `planned`, `registryRead`, and `extraSlices`. Each admitted logical output has an `orphanInputs` receipt containing its registry key, prefix, pass, kind, selected source and SHA-256 input hash. Endpoint links need this receipt and matching bytes, rather than inferring provenance from a repeated entity ID.

| Verification | Result |
| --- | --- |
| `node --test tests/atlas_batch_outputs.test.js` | 10 passed, including temp-directory digest integration. Exact `hp1`/`hp10` ownership, partial/full markers, canonical/Luna preference, duplicate variants, separate denominators, privacy and orphan-input attestation covered. |
| `node --check prototypes/world-atlas/reader-findings.mjs` | Passed. |
| `git diff --check` | Passed with existing line-ending warnings elsewhere. |
| Desktop | Root owns the combined 1920×1080 proof. Suggested fixture: a canonical `c777` census output without shard text, public and sealed siblings, plus a partial rules output. |
| Cleanup | Successful tests remove their fixtures. One initial test hook left the empty temporary directory `atlas-batch-index-vwzCdu`; native cleanup returned an object-reference error. No source or private data remains in that directory. |
