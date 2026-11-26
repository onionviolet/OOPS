# Measured reading readiness, 2026-11-25

| Preflight | Scope |
| --- | --- |
| Authority and outcome | User requested audit and intake across recovered batches. Root assigned an offline aggregate over the shared exact-output reader, with an on-demand World → Reading summary. AD36/AD43, AR2–AR7, UR43/UR74. This measures admitted output availability and matching, not exhaustive source truth. |
| Seam | `createBookOutputReader` shares one book inventory and its family indexes across its logical prefixes and the existing twelve `OUTPUT_KINDS`. The aggregate copies counts and approved field descriptors, discarding rows, record IDs, source paths and text. |
| Costs and bounds | One explicit CLI process per world. Read one selected file at a time; release its temporary byte cache after fingerprinting. No aggregate at server startup or when a world opens. The button loads stored measurement and checks snapshot/digest bytes plus selected-file metadata, without parsing source outputs. |
| Failure scenario | Mixed missing/partial/invalid/unattested files, withheld/unindexed/ambiguous rows, changed snapshot/digest/file metadata, malicious extra fields in a stored report and no stored measurement. Missing and stale must remain distinct. |
| View | Desktop headless Chrome 1920×1080. Words include “Measured snapshot” and “Stale measurement”. Public record browsing and ordinary gameplay remain outside this aggregation. Mobile deferred. |

F1: The offline module emits counts by book and by all twelve pass/kind pairs. `expected` is the logical-prefix/kind denominator. `selected`, `inspected`, `missing`, `partial` and `unattested` are explicit, overlapping counters. Parsed, matched, withheld, ambiguous, unindexed, parse-error and read-error rows follow the shared reader. Each book may also include approved field-presence counts from `.fieldCoverage`; field presence does not establish semantic completeness or presentation coverage.

The pre-sweep review found the world accumulator dropped field counters while each book retained them. Corrected before the 44-world sweep: world `fieldRows` and each approved field count now sum all contributing books without mutating book counts. The focused regression checks two books and the public GET projection. The earlier bounded artifact retains its original book field counts; its source-row totals are unchanged. The sweep owner confirmed no default aggregate had yet been generated, so no completed default report required rerunning.

F2: Bindings fingerprint exact snapshot bytes, world digest bytes and selected source bytes. The aggregate stores a separate metadata signature for cheap current selection checks. The GET response distinguishes `missing`, `invalid`, `measured` and `stale`. A matching metadata stamp is labelled metadata, not a fresh byte audit. Subsets say `subset` and `not-checked` for whole-world metadata. The server projects the output allowlist again so adding private text or arbitrary keys to the local report cannot expose them.

F3: The bounded real measurement covers LOTM chapters 127–130 against the adopted pre-130 digest. All 48 selected files were inspected in 0.125 seconds: 359 parsed rows, 295 matched, five withheld and 59 unindexed. There were no missing, partial, unattested, ambiguous, parse-error or read-error counts. The unindexed rows include the newly read chapter absent from that digest; this is evidence of the admission gap, not a claim of missing source facts. Root's separate four-chapter digest proof owns the positive 354/359 comparison. [Measured subset](../representations/evidence/reading-readiness-2026-11-25/recent-four.json).

| Pass / kind | Parsed | Matched | Withheld | Unindexed |
| --- | ---: | ---: | ---: | ---: |
| census / census | 185 | 164 | 0 | 21 |
| scenes / scenes | 17 | 12 | 0 | 5 |
| scenes / fills | 0 | 0 | 0 | 0 |
| rules / rules | 29 | 23 | 0 | 6 |
| rules / other | 13 | 10 | 0 | 3 |
| people / people | 28 | 23 | 0 | 5 |
| people / other | 8 | 5 | 0 | 3 |
| texture / places | 32 | 27 | 0 | 5 |
| texture / services | 15 | 12 | 0 | 3 |
| texture / news | 7 | 2 | 5 | 0 |
| texture / customs | 11 | 7 | 0 | 4 |
| texture / other | 14 | 10 | 0 | 4 |

Generate a full world after canonical staging and the Atlas build:

```powershell
node prototypes/world-atlas/measure-reading-readiness.mjs --world lotm --snapshot work/atlas-snapshot/snapshot.json
```

This atomically replaces `readiness/lotm.json` beside that snapshot. Other worlds have independent files; rerun a failed world without restarting the others. Root owns the final full sweep. The all-world invocation uses separate sequential processes:

```powershell
$worlds = (Get-Content docs/gm/dispatch/batch-reading-2026-10-27/plans/books.json -Raw | ConvertFrom-Json).books.world | Sort-Object -Unique
foreach ($world in $worlds) {
    node prototypes/world-atlas/measure-reading-readiness.mjs --world $world --snapshot work/atlas-snapshot/snapshot.json
    if ($LASTEXITCODE) { throw "Readiness failed: $world" }
}
```

For a bounded rerun use `--keys lotm1 --prefixes lotm1c127,lotm1c128,lotm1c129,lotm1c130 --out <separate-file>`. The result remains a subset and must not replace the default full-world measurement during final verification. GET `/reading-readiness?world=lotm` reads the default report. World → Reading → the reading-pass panel has a “Show measured output readiness” button.

| Check | Result and gap |
| --- | --- |
| Focused | `node --test tests/atlas_reading_readiness.test.js tests/atlas_output_records.test.js`: final 16/16 passed. Exact-reader parity, all twelve kinds, missing/mixed inputs, privacy, per-book and world field totals, read errors, ambiguity and stale states covered. Missing full-pass markers remain missing plus partial; clean Luna replaces partial canonical output through the shared selector without double counting. |
| Syntax | `node --check` on new aggregate, normal server and browser proof: passed. |
| Browser | `node tests/atlas_reading_readiness_browser.mjs`: passed, exit 0 after final shared runner repair. Standalone shared view and GET projection at 1920×1080 prove on-demand display, twelve kinds, measured subset, stale snapshot and missing measurement; no page errors. [Measured](../representations/evidence/reading-readiness-2026-11-25/measured-subset.png), [stale](../representations/evidence/reading-readiness-2026-11-25/stale.png), [missing](../representations/evidence/reading-readiness-2026-11-25/missing.png). This is an explicitly labelled HTTP fixture with actual bounded source counts, not a full-world UI acceptance claim. |
| Normal route | Earlier invocation with normal server `http://127.0.0.1:4186` reached `#workbench/ideas` and verified the new module returned 200; all page assertions passed, then the earlier shared runner cleanup failed. [Normal shell](../representations/evidence/reading-readiness-2026-11-25/normal-workbench.png). Root independently verified the repaired normal shell at 1366 pixels with exit 0. Actual GET returned `missing` without a default measurement; no subset was installed there. |
| Integration correction | A missing static allowlist entry initially made the new view import return 404 and blocked the normal Atlas shell. The exact module entry was added to `serve.mjs`; normal-shell verification follows. |
| Privacy failure | Invalid CLI options return a generic failure with exit 1, without forwarding source parse errors, row values or paths. A test injects raw fields into a stored report and confirms the GET projection removes them. |
| Docs | `node scripts/check_doc_slips.mjs`: passed on final receipt, exit 0. |
| Cleanup | Scoped normal Atlas server on 4186 stopped by its verified listening PID. Fixture snapshot/digest copies removed. Final runner warned of a Windows-locked private Chrome profile `yairpg-owned-chrome-NTMHuF`; retained for runner owner. Cited count artifacts and screenshots retained. |
| Release | Agent-verified, not human-reviewed. No full recovered-archive sweep, public upload, game bundle change, commit or release performed by this lane. Root owns final canonical staging, full aggregate and default UI acceptance. |
