# C1 fold receipt

Status: agent-verified proposals, not human-reviewed. Runtime promotion: 0. Commits: 0.

## Counts

| ID | Before | After |
| --- | ---: | ---: |
| Covered slugs | 1,575 | 1,575 |
| Resolved slugs | 213 | 212 |
| Unread/conflicting slugs | 1,362 | 1,363 |
| Reader groups | 210 | 209 |
| Folded groups | n/a | 206 |
| Reviewed aliases | 0 | 3 |

| Review ID | Result |
| --- | --- |
| `clown_pathway_active` → `clown_ability_active` | corrected; 4 members retained |
| `glove_worn` | conflicting; 2 occurrence locators; removed from resolved groups |
| `lucid_in_dream` → `awake_in_dream` | reviewed alias |
| `meditating` → `meditation` | reviewed alias |
| `meditation_used_as` → `meditation` | reviewed alias |

## Spot-checks

| Family | Rows | Pass | Corrected | Buckets |
| --- | ---: | ---: | ---: | --- |
| Cost inference | 15 | 15 | 0 | 5 stated, 5 qualitative, 5 reason-only |
| Slug clustering | 15 | 14 | 1 | 3 multi-member, 7 singleton, 5 unread |

Multi-member bucket: 3 eligible groups; all 3 checked; 2 replacement singleton rows.
Additional review correction outside the 15-row sample: `glove_worn`.

Private root: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l10/`.

- `cost-infer/spotcheck-receipt.json`: 15 rows, locators, input hashes, results.
- `slug-cluster/aliases.json`, `folded.json`, `semantic-review.json`, `spotcheck-receipt.json`: alias review, fold and 15-row receipt.
- `slug-cluster/coordinator-gaps.json`: complete 1,363-slug unread/conflict list; `glove_worn` occurrence ids/locators.
- `slug-cluster/lane4-review.json`, `review-input-hashes.json`: artifact check and reviewed input identities.
- `slug-cluster/out_1.jsonl`, `out_3.jsonl`: 2 corrections; original outputs preserved privately.

## Checks

| Command | Result | Gaps |
| --- | --- | --- |
| `node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c1/prep.mjs --check` | PASS; 18 artifacts; source SHA-256 values unchanged | none in snapshot |
| `node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c1/fold.mjs --validate-only` | PASS; 7 lanes; 1,575 covered; 209 groups; 1,363 unread/conflicting | locator validation only |
| `node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c1/fold.mjs --aliases docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l10/slug-cluster/aliases.json` | PASS; 206 folded groups; 212 resolved | proposals; 1,363 unread/conflicting |
| `node docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l10/slug-cluster/finalize-review.mjs` | PASS; 15 cost rows; 15 pass; source hashes unchanged | proposal integrity |
| `node docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l10/slug-cluster/finish-receipt.mjs` | PASS; 15 slug rows; 14 pass; 1 corrected | sampled source review |
| `node --test tests/ability_cost_infer.test.js docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c1/fold.test.mjs` | PASS; 8/8 | focused slice |

Lane 4: 100 groups; 125 unread; copied source passages found in output: 0.
Reported oversized tool read: not independently verified; reader transcript unavailable in lane inputs.
Reader relaunches: 0. Outstanding coordinator ids and locators: private `coordinator-gaps.json`.
