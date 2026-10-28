# P1 checkpoint: one command per book to records-ready

Status: runner and focused tests complete; real LOTM and MoL runs completed. Route kind: local tooling with private source inputs; review: agent-verified, not human-reviewed. Codes: AD36, AD44, CLR2, CLR3, CLR9, CLR11, CLR12.

## Data probe

| Field | Expected | Observed | Gate |
| --- | ---: | ---: | --- |
| Required stages: merge, crosswalk, worksheets, conflict contracts, after-actions, fitness report | 6 | 6 | met |
| Existing records-ready books for comparison | 2 | 2 (LOTM, MoL) | met |

`build_crosswalk.mjs` writes `consumer_fitness.json` alongside `crosswalk.json`; the runner records that report as the sixth receipt stage after the five script stages. The remaining stage interfaces and recorded source boundaries are in [L1](L1_CHECKPOINT.md), [L2c](L2C_CHECKPOINT.md), and [L6a](L6A_CHECKPOINT.md).

## Interface and outputs

`node scripts/lead_run/world_lead_pipeline.mjs <book> --from <locator> --to <locator> [--out <dir>]` resolves the world profile and reviewed private input folder. Optional `--input`, `--match`, `--overlay`, and `--review` let a caller pin the existing source selection and review data. Each stage receives its own command, hashes of its script and inputs, output hashes, and elapsed seconds. The first failing stage is named in the thrown error. Stages write to a temporary directory under the private research input because the existing crosswalk and worksheet scripts enforce that root; completed artifacts and `pipeline_receipt.json` are copied to `--out`, which may be scratch storage.

Owned files are public and name-free. Canonical output stays in the selected book's private research data or caller-provided scratch output. The runner sequences existing scripts without duplicating their derivation logic. No runtime or save behavior changed.

## Checks and data comparisons

| Check | Command | Result | Gaps |
| --- | --- | --- | --- |
| Focused pipeline tests | `node --test tests/world_lead_pipeline.test.js` | PASS, 2/2; synthetic two-chapter fixture covers ordered six-stage receipt and first-failure naming | Fixture only for stage behavior |
| Syntax | `node --check scripts/lead_run/world_lead_pipeline.mjs && node --check tests/world_lead_pipeline.test.js` | PASS | None |
| LOTM pipeline | `node scripts/lead_run/world_lead_pipeline.mjs lotm --from 'zh 第1章 p1' --to 'zh 第24章 p99999' --match '^(s[0-9]+[rv]?m$|w[1-4]s[0-9]+m$|b[4-7]s[0-9]+m$)' --overlay docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/L1_overlay_reviewed.json --out /tmp/p1-lotm-final` | PASS; 6 receipt stages; 187 worksheets | Current input snapshot differs from saved L1 records-ready output; see differences below |
| MoL pipeline | `node scripts/lead_run/world_lead_pipeline.mjs mol --from 'en b1 c1 p1' --to 'en b1 c5 p9' --match '^molc[0-9]+m$' --overlay docs/research/novels/mother-of-learning/private/lead-run-2026-10-28/L1_overlay_reviewed.json --review docs/research/novels/mother-of-learning/private/lead-run-2026-10-28/L1_crosswalk_review.json --out /tmp/p1-mol-final` | PASS; 6 receipt stages; 93 worksheets | Four metadata/provenance differences plus a newly emitted empty conflict file; details below |
| Prepared integration patch | `git apply --check /tmp/p1-integration.patch` | PASS; patch applies to the current stage and runner sources | Patch is prepared, not applied |
| Lane name/publication review | `node scripts/lane_review.mjs --grant scripts/lead_run/world_lead_pipeline.mjs --grant tests/world_lead_pipeline.test.js --grant docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/P1_CHECKPOINT.md --grant docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/P1_INTEGRATION.patch scripts/lead_run/world_lead_pipeline.mjs tests/world_lead_pipeline.test.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/P1_CHECKPOINT.md docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/P1_INTEGRATION.patch` | PASS; 0 name-hit files, 0 outside grants | Private-name tokens matched only against owned public files; reviewer reports counts only |

The pipeline used the source folder and flags from L1's last recorded LOTM and MoL runs. `merge_shards` and `build_crosswalk` command forms are recorded at [L1](L1_CHECKPOINT.md#check-log); worksheet and derived-table forms are recorded at [L2c](L2C_CHECKPOINT.md#check-log-addendum) and [L6a](L6A_CHECKPOINT.md#check-log). The fitness report has no separate command; it is emitted by the crosswalk stage.

### Byte comparison against saved records-ready outputs

- **LOTM:** all seven merge artifacts differ (`registry`, `scenes`, `fills`, `extras`, `affordance`, `overlay_proposed`, `merge_report`); `crosswalk.json`, `consumer_fitness.json`, and `after_actions.jsonl` differ; 52 of 187 worksheet files differ. `conflict_contracts.jsonl` matches. The current merge selected 72 shards and produced 637 scenes, 2,358 registry rows, and 358 fills; the saved merge has 61 shards, 429 scenes, 2,127 registry rows, and 283 fills. The current private source therefore no longer matches the snapshot behind the saved outputs. Crosswalk and fitness are downstream of those changed merged rows; all 52 changed worksheets are downstream of the same input delta. The remaining 135 worksheets and conflict contracts are byte-identical.
- **MoL:** `registry`, `scenes`, `fills`, `extras`, `affordance`, and `after_actions` match byte for byte; all 93 worksheets match. `overlay_proposed.json` adds an empty `reveals` list and `merge_report.json` adds `revealsForReview: 0`, both emitted by the current merge script. `crosswalk.json` and `consumer_fitness.json` differ only in the recorded `build_crosswalk.mjs` runtime-input hash; merged inputs, review input, counts and derived values match. The pipeline also emits an empty `conflict_contracts.jsonl`, which the saved MoL merge folder did not contain. This exposed the stage selector's LOTM-only locator handling, so [P1_INTEGRATION.patch](P1_INTEGRATION.patch) adds range-based selection using the caller's `--from`/`--to` values and updates the runner call. The prepared patch is syntax/diff checked, not applied or rerun; MoL contract contents remain unverified until coordinator integration.

No source names or prose are copied into this tracked receipt. Full generated outputs and receipts are in `/tmp/p1-lotm-final` and `/tmp/p1-mol-final` on this machine and remain scratch results.

## Remaining boundary

The coordinator should review the diff, prepared integration patch, and two source-drift findings before treating these runs as byte-reproduction evidence. P1 does not claim that current LOTM private source data reproduces the older saved snapshot or that the prepared MoL contract selector has been executed. No commit was made.

## Coordinator review (2026-10-28)

`P1_INTEGRATION.patch` applied. Focused `tests/world_lead_pipeline.test.js` and `tests/lead_run_conflict_after.test.js`
PASS 6/6. MoL rerun through the pipeline: 6 stages, now 6 fight contracts (empty before the patch). LOTM rerun:
conflict contracts byte-identical to the lane's run. Reading of the LOTM differences: input drift (72 shards now
against 61 behind the saved outputs, from the batch-reading pipeline), not a pipeline defect; the saved LOTM
outputs are a stale snapshot. Remaining: CL272's byte-identical done check holds for MoL apart from the
listed metadata; for LOTM it can only hold against a pinned shard list (`--match` narrowed to the 61 shards),
which is a follow-up if anyone needs the old snapshot reproduced.
