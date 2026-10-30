# R3b remainder split

F1: Prepared 166 Luna-medium briefs and separate private input slices. No readers launched, commits, runtime edits or original answer edits. Source reading and classification are not claimed. Files are released to the coordinator. Rules: AD36/AD38, WPR4-WPR8/WPR18-WPR23, AU5-AU6/AU10-AU15; inherited C1 AR3/AR8/WA48 naming/data seam.

| Family | Unread assigned exactly once | Briefs | Maximum rows per brief |
| --- | ---: | ---: | ---: |
| C4 methods | 1,022 | 30 | 35 |
| C4 GM33 | 175 | 5 | 35 |
| C1 slugs | 1,363 | 35 | 40 |
| C5 texture/rules-other summaries | 42,580 | 96 | 500 |

F2: [queue.txt](queue.txt) contains every brief, C4 first, C1 second, C5 last. The 205 IDs in the old C4 methods-05b handoff are included once in the 1,022, not added again. Do not also launch that old handoff. All C4 occurrences use the fold's corrected volume addresses; GM33 stays separate. C1 preserves all occurrence metadata and the pathway-neutral naming instruction. C5 slices preserve summaries/stable IDs and renumber n locally; each brief requires projections of at most 50 rows. All briefs require actual reads, small batched citation calls (`--max 2`) and final unread trailers.

F3: Live original C5 answers arrived during preparation. The first frozen partition was rejected for input drift and regenerated, without changing old answers. The final snapshot preserves 8,614 existing labels and assigns the remaining 42,580 rows. `node scripts/codex_lane.mjs status` reported no running C5 lanes, but its kill-based check can report exited when this sandbox denies process inspection. Preparation therefore also excludes any C5 record lacking a final receipt. At the final snapshot there were no such records. [c5-lane-status.txt](c5-lane-status.txt) and [c5-unfinished-lanes.json](c5-unfinished-lanes.json) record those checks. These are snapshot observations, not a guarantee against later coordinator launches. Before launch, run verify again; input drift means regenerate only before any new repair reader owns its output. The generator refuses once a repair output exists.

## Files and fold entrypoints

A1: Briefs are in `../c1b/`, `../c4b/`, `../c5b/`; private slices are in each family's `r3b/` folder. [manifest.json](manifest.json) records input/brief hashes, output ownership, counts and source snapshot hashes. `prepare.py` reproduces this split and `verify.py` checks exact coverage. Before regeneration, refresh status with `node scripts/codex_lane.mjs status > /tmp/r3b-lane-status.txt`; absent that temporary file, preparation uses the saved status snapshot plus current final-receipt checks. Private files remain local and ignored; they do not travel with a tracked commit.

A2: C1's existing [fold.mjs](../c1/fold.mjs) now reads the registered private `out_b*.jsonl` returns. It replaces unread coverage, keeps original groups, rejects overlaps and reports pending repairs. C4's new [fold.py](../c4/fold.py) is the replacement fold entrypoint for these returns; it combines reviewed baseline rows with registered `out_b*.jsonl` into separate private `r3b/folded/*_candidate.jsonl` and unread ledgers. It does not overwrite reviewed originals or promote new returns as reviewed. Do not rerun the old private review script to consume these returns: that script reconstructs its old snapshot. C5's [fold.mjs](../c5/fold.mjs) and [repair.mjs](../c5/repair.mjs) map new `out_b*.tsv` local n through stable IDs into original shards, replacing unread coverage without mutating original answers. New outputs have not been created by this lane.

A3: Coordinator launch, semantic source review and later runtime integration remain separate. Preserve existing source-review/alias gates. C4 candidate rows still need source review before normalization/compile; artifacts do not enter the rite compiler. No build/browser/full-suite gates apply to this metadata-only lane. No source, accepted direction, registered rule or gameplay behavior changed.

## Checks

Commands run from checkout root. Let `R=docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3`. Each command below uses that literal prefix when run.

| Command | Result | Gaps |
| --- | --- | --- |
| `node scripts/codex_lane.mjs status` | Exit 0; C5 statuses recorded | Sandbox can misclassify a live PID; supplemented by final-receipt ownership checks |
| `node scripts/lead_run/family_pass.mjs tally --in <temporary copy of C5 ids/answers>` | Exit 0; missing/no-answer rows identified, no malformed/duplicate label rows | JSON trailers stripped in the temporary copy; old answers untouched; summaries not reviewed |
| `python3 $R/r3b/prepare.py` | Exit 0; counts above, 166 briefs | Metadata only; no readers launched |
| `python3 $R/r3b/verify.py` | PASS; exact once-only unread coverage, 166 queue entries, caps, frozen hashes, unchanged C5 summaries and corrected C4 addresses | Snapshot-bound; rerun before dispatch if original readers/inputs change |
| `node $R/c1/fold.mjs --validate-only` | Exit 0; 1,575 total covered, 209 baseline groups, 1,363 unread, 35 pending repair outputs | Matching locators is not semantic proof |
| `python3 $R/c4/fold.py --validate-only` | Exit 0; baseline 56 method IDs / 12 GM33 IDs; 1,022 / 175 unread; 30 / 5 pending repair outputs | New returns and source review pending |
| `node $R/c5/fold.mjs --allow-pending --validate-only` | EXPECTED exit 1: 8,614 labelled, 42,580 unread, 96 pending repairs; underlying tally exit 0 | Explicit incompleteness blocks integration; [C5_TALLY.txt](C5_TALLY.txt). Validation output stays in a temporary directory |
| `node --test $R/c1/fold.test.mjs $R/r3b/fold.test.mjs` | PASS 5/5 | Synthetic C1/C5 repair replacement and rejection cases, plus existing C1 checks |
| `python3 $R/r3b/fold_test.py` | PASS 2/2 | Synthetic C4 coverage and usable-shape checks |
| `node --check` on C1 fold, C5 fold and C5 repair; Python `compile()` on prepare/verify/C4 fold | PASS | Syntax only; no bytecode writes |
| `git check-ignore --stdin` over every private slice; generated-file whitespace assertions; `git diff --check -- $R` | PASS; 166/166 slices ignored | Scoped to this lane; unrelated shared work preserved |
