# Historic LOTM slice reconciliation

Owner: [Atlas batch field coverage](ATLAS_BATCH_FIELD_COVERAGE_2026-11-25.md). Execution evidence for the authorized output-inventory task; no new reading, spending or canon acceptance.

The legacy selector previously recognized migrated census files shaped like `b4s42m_census.jsonl`, but missed the early graded stage families. It also missed a historic wave when its census existed solely in the Luna lane.

| Preflight | Scope |
| --- | --- |
| Reading | Reconcile observed historic output identities against their tracked naming and grading contracts. |
| Owners | [make_wave_plans](../../scripts/lead_run/make_wave_plans.mjs), [schema](../gm/dispatch/protagonist-life-2026-10-27/LEAD_RUN_SCHEMA.md), [reading handoff](../gm/dispatch/protagonist-life-2026-10-27/READING_HANDOFF.md), [first extra-pass plan](../gm/dispatch/batch-reading-2026-10-27/plans/v1_people_w1.json). |
| Fit | Existing registry-directory ownership, legacy selection, canonical/Luna preference, partial markers and byte-attested digest admission. |
| Failure | Collapsing `s2` and `s2r`; treating plan presence as an observed output; promoting grade C or an unreadable header; disclosing comparison arms as canonical coverage; assigning the new local `lotm1` directory the historic archive. |
| Files | `reader-slices.mjs`, `batch-output-index.mjs`, restricted legacy admission in `reader-findings.mjs`, focused inventory tests. Root owns endpoint/UI integration and desktop proof. |

## Reconciled families

| Observed identity | Naming evidence and handling |
| --- | --- |
| `s2m` | `make_wave_plans` includes it in the graded glossary. The first extra-pass plan assigns raw `s2` to chapters 1–3. Retain as its own stage. |
| `s2rm` | The same plan assigns raw `s2r` to chapters 4–6. It is distinct from `s2`, despite sharing the stage number. |
| `s3rm` through `s6rm` | Explicit graded stage family in `make_wave_plans` and the reading handoff. |
| `s7vm` through `s9vm` | Explicit migrated protocol-v2 stage family in the same owners. |
| `wNsNm`, `bNsNm`, `cNsNm` | Existing late-wave selection stays compatible. Observed b/c aliases remain grouped by their existing slice ordinal; metadata records each alias's own grade evidence. A Luna-only migrated census now discovers its base wave. |
| Canonical `lotm1cNNN` | Belongs to the separate new registry entry and directory. It does not match a historic family. |

Discovery needs an observed output, not a header or a plan alone. No planned slice list is turned into a completed or missing-output denominator. Newly recognized graded stages inventory observed output files, with pass completion unasserted and no missing sibling-file count. Late-wave metadata retains its existing compatibility shape. Stage chapters come from a valid observed header; no range is inferred from the prefix number. Extra-pass outputs retain the raw prefix with its trailing migration `m` removed, as `make_wave_plans` specifies.

New early-stage digest admission needs recorded grade A or B, a valid `shard-header/1.3` metadata record, and the existing LOTM archive's registry ownership. Grade C, missing, invalid and unreadable headers remain visible qualifications in metadata. Legacy late-wave admission keeps its previous compatibility behavior, including cases without grade evidence; displaying an actual grade does not regrade those rows. Per-file clean selection, partial/full markers, whole-file JSONL validation, sealed filters and same-buffer SHA-256 receipts apply to new early-stage admission. The digest records `legacyInputs`; endpoint links need matching captured bytes, rather than an entity-ID coincidence.

## Residual observed forms

Tracked plans define pilot arms `pN`, `uN`, `hN`; Sonnet arms such as `zw3s33c`; A/B variants such as `w3s33x`, `w3s33y`, `w3s33q`; split rereads such as `b5s53c155` and `b6s61c179`; and `bNsNx2` reruns. Their plan presence establishes what the labels mean, not an adopted canonical output owner. When such files are observed, `legacy.residuals` reports their logical prefixes, family and available grade evidence. It does not merge them into historic digest slices. No adoption receipt for these residual forms was found in the inspected tracked contracts.

The default Windows registry points the historic `lotm2`–`lotm8` entries at the old shared archive; those directories are absent on this host. Therefore this pass verifies parser/plan reconciliation and synthetic fixtures, not actual archive completeness or actual per-file grades. There is no inferred count of unseen output files.

## Checks

| Check | Result |
| --- | --- |
| `node --test tests/atlas_batch_outputs.test.js` | 12 passed. Includes separate `s2`/`s2r`, original/migrated headers, grade C, absent/invalid headers, partial/full markers, Luna-only waves, b/c aliases, residual families, source ownership, and byte-attested early-stage digest admission. |
| `node --test tests/atlas_batch_outputs.test.js tests/atlas_reader_findings.test.js` | 30 passed. |
| Syntax, `git diff --check`, `npm run check:docs` | Passed. Docs check reported a warning in a separate LOTM charm receipt; no finding in this receipt. |
| Desktop | Root owns a combined 1920×1080 fixture proof. A valid A/B `s2` file and a grade-C sibling supply a bounded test without source prose. |
