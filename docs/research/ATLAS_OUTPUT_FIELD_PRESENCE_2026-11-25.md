# Atlas output field presence

Execution receipt for [batch field coverage](ATLAS_BATCH_FIELD_COVERAGE_2026-11-25.md). This implements bounded input-presence measurements; it does not measure extraction completeness, source truth or which fields a view renders.

| Preflight | Scope |
| --- | --- |
| Reading | Count public structured fields in each selected output file, after source-row admission and exact public matching. Keep false and zero, omit empty structures, and disclose counts rather than source content. |
| Fit and authority | Existing reading contracts in `scripts/lead_run/batch_lib.mjs`, schema 1.5 including 1.4; twelve kinds from `batch-output-index.mjs`; admission/exact joins in `output-records.mjs`. AD6–AD8, AR3 and the owning audit’s privacy boundary apply. |
| Player sentence | Suggested heading: “Structured input fields”. Suggested count: “Ritual needed: 1 of 2 matched source rows”. Input presence and display in a record are measured separately. |
| Mechanism | A per-file streaming collector inspects fixed contract paths. The caller supplies admission/match verdicts separately from row data. Each matched public source row contributes at most one count per descriptor, before pagination or target deduplication. |
| Failure scenario | A source row claims its own admission, a zero/free service disappears by truthiness, an empty acquisition shell looks populated, nested private data is counted, or a source-controlled field name appears in JSON. Focused tests cover these cases. |
| Files | Lane files: `prototypes/world-atlas/output-field-coverage.mjs`, `tests/atlas_output_field_coverage.test.js`, and this receipt. The coordinator owns `output-records.mjs` and `reading-output-view.mjs`; neither was changed by this lane. |
| UI boundary | Coordinator integrates and verifies desktop 1920×1080. This lane makes no browser-display claim. Mobile and raw-text inspection remain outside scope. |

## Measurement contract

`createOutputFieldCoverage(pass, kind)` validates the logical output against twelve fixed descriptors. `observe(row, {admitted:true, matched:true})` counts only rows the caller has admitted and matched. Missing verdicts, explicitly rejected rows, malformed row containers, private/sealed rows and private news are rejected. Privacy checks also apply to nested structured entries.

The descriptors count public content that can be absent or empty in a row. This includes required-but-empty schema containers as well as formally optional schema extensions. It is not a JSON-schema required-field compliance score. Identity and provenance scaffolding do not make an otherwise empty structured value count. Naming provenance is an explicit census field, while bare evidence label/locator shells are not substantive acquisition, reset or ritual content.

Only declared typed leaves count: nonempty text, finite numbers including zero, booleans including false, and text-list entries. Empty strings, whitespace, empty arrays/objects, provenance-only shells, undeclared object keys and ordinary “not stated” placeholders do not count. Source accessors and inherited properties are ignored. Repeated entries inside an array count once for the containing source row. Repeated source rows remain distinct source rows, even if they target one deduplicated public record.

The public snapshot contains static pass/kind, fixed descriptor IDs/labels, numeric counts and a static note. It returns no field values, row IDs, titles, source paths, source-defined keys, census notes, private knowledge, speech or reset memory holders. The `presentation.status` remains `not-assessed`; input presence never changes it.

| Logical file | Descriptor count |
| --- | ---: |
| census / census | 13 |
| scenes / scenes | 21 |
| scenes / fills | 5 |
| rules / rules | 41 |
| rules / other | 1 |
| people / people | 15 |
| people / other | 1 |
| texture / places | 9 |
| texture / services | 9 |
| texture / news | 2 |
| texture / customs | 1 |
| texture / other | 1 |

## Measured example

The focused integration fixture calls the real `readOutputRecords` exact-join route for a six-row selected rules file. Its admitted digest contains two rule targets. The measured result is **6 file rows, 2 admitted matched source rows, 2 unindexed/rejected-from-digest rows and 2 private/withheld rows**. The field collector receives those same per-row join decisions, and reports:

| Public structured field | Matched rows supplying it |
| --- | ---: |
| Total duration, from a supplied zero | 1 / 2 |
| Numeric cost, from a supplied zero | 1 / 2 |
| Whether a ritual is needed, from supplied false | 1 / 2 |
| Each of the remaining 38 rule descriptors | 0 / 2 |

The second matched row has an empty ritual object and acquisition evidence labels/locators without substantive acquisition data. Those do not add field counts. The other four rows cannot inflate the numerator or denominator. The snapshot still says display is not assessed. These are reproducible fixture measurements, not populated shares from a real book collection; the owning audit’s actual-corpus availability qualification is unchanged.

## Coordinator integration

For `output-records.mjs`, import the constructor and create one collector after the supported pass/kind check. After `matches(raw).filter(Boolean)` yields one or more admitted public targets, call the collector once for that raw source row. Do this before looping over matched targets, before target deduplication and before pagination:

```js
const fields = createOutputFieldCoverage(pass, kind);
// Within the existing source-row loop, after the no-match return/continue:
fields.observe(raw, {admitted:true, matched:true});
// Once the whole selected file has been processed:
result.fieldCoverage = fields.snapshot();
```

Do not call it for parse failures, withheld rows, no-match rows or rejected file admission. A file with no admitted digest or unavailable/unreadable inputs should retain the endpoint’s unavailable/invalid qualification; zero observed matches must not be presented as corpus completeness. The existing endpoint counts remain separate from the field denominator.

For `reading-output-view.mjs`, render `page.fieldCoverage.fields` under “Structured input fields”, with `field.rows + ' of ' + page.fieldCoverage.rows + ' matched source rows'`. Render the static `presentation.note` beside it. Use text nodes; do not enumerate raw source object keys or infer field support from positive counts. An actual renderer-support claim needs a separate explicit renderer assessment. Reference downloads can include the same labels/counts if desired, without adding raw row content.

## Verification

| Check | Result and gap |
| --- | --- |
| `node --test tests/atlas_output_field_coverage.test.js` | 7/7 passed on final module. Covers twelve-kind coverage, zero/false, private nested entries, denied admission, undeclared keys, accessors/prototypes, empty shells, detached snapshots, array counting and a real exact-join fixture. |
| `node --check prototypes/world-atlas/output-field-coverage.mjs` and test syntax | Passed. No runtime/browser or filesystem writes are needed for the collector. |
| Integration ownership | Instructions supplied to the coordinator; shared endpoint and view edits are not claimed by this lane. No source acquisition, provider calls or private corpus reading. |
| Review and cleanup | Agent-tested, not human-reviewed. The fixture uses in-memory file reads and makes no temporary file, server, process, worktree or branch. |
