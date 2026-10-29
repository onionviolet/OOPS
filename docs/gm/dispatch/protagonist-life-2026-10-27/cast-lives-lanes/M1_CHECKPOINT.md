# M1 checkpoint: schema 1.4 and census union

Status: schema union and LOTM volume 1 pipeline complete. Route kind: local tooling with private source inputs; review: agent-verified, not human-reviewed. Codes: AD36, AD44, CLR2, CLR3, CLR4, CLR9, CLR12.

## Data probe

| Input | Expected | Observed | Result |
| --- | ---: | ---: | --- |
| LOTM v1 selected shard people files | 70+ | 72 files, 1,462 current rows | met |
| Matching pre-1.4 people backups | one per replaced file | 69 backups; 3 missing | partial; retained current rows and listed shards below |
| Second census files | 31 | 31 | met |
| MoL ch1-4 schema 1.4 people files | 4 (non-gate) | not probed | out of this LOTM run |

Missing backup shards: `w1s18`, `w3s33`, `w3s35`. Their current rows remain in the union unchanged, per the brief's stop condition. The missing backups do not stop the other shards.

## Union and pipeline result

| Measure | Before | After union |
| --- | ---: | ---: |
| Selected people files / people rows | 72 / 1,462 | 72 / 1,574 |
| Routine slots | 1,197 | 1,897 |
| Routine slots with `recurrence` | 190 | 190 |
| `reacts` entries | 1,033 | 2,055 |
| `reacts` entries with class or response class | 981 | 981 |
| Census x1 / x2 / union entities | n/a | 3,431 / 3,832 / 4,085 |
| Ambiguous census name matches kept separate | n/a | 7 |

The union adds 700 routine slots and 1,022 reaction entries. It keeps 190 recurrence-bearing slots; none were newly added relative to current schema 1.4 rows. Census x1 and x2 aliases were folded by normalized name, while ambiguous matches stayed separate. Each merged census row retains its source locators.

The pipeline command completed all 72 selected shards with seven receipt stages in order: `schema_union`, `merge_shards`, `build_crosswalk`, `cast_worksheet`, `conflict_contracts`, `after_actions`, `fitness_report`. The selected lead-scene cast found through the crosswalk is 134 people across 539 lead scenes; the previous records-ready output has 107 people across 369 lead scenes. The previous output is an older source snapshot, so this is a comparison, not a claim that the only difference is schema union.

Private unioned inputs, merged records, worksheets, and the hash receipt are in `/tmp/m1-lotm-final4`. No source prose or canon names are in this checkpoint.

## Check log

| Check | Command | Result | Gaps |
| --- | --- | --- | --- |
| Synthetic union | `node --test tests/schema_union.test.js` | PASS, 1/1; field precedence, silent-field retention, older-only person, duplicate locators, alias-pair union, both locators, deterministic JSONL | Synthetic fixture only |
| Syntax | `node --check scripts/lead_run/schema_union.mjs && node --check scripts/lead_run/world_lead_pipeline.mjs && node --check tests/schema_union.test.js` | PASS | None |
| LOTM v1 pipeline | `node scripts/lead_run/world_lead_pipeline.mjs lotm --from 'zh 第1章 p1' --to 'zh 第24章 p99999' --match '^(s[0-9]+[rv]?m$|w[1-4]s[0-9]+m$|b[4-7]s[0-9]+m$)' --overlay docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/L1_overlay_reviewed.json --out /tmp/m1-lotm-final4` | PASS; 72 shards, seven stages; receipt in output | Three shards have no backup; retained as listed |
| Existing synthetic pipeline test | Not run; `tests/world_lead_pipeline.test.js` still asserts the old six-stage order and receipt | Gap; that file is outside this lane's owned paths and needs coordinator integration |
| Lane publication/name review | `node scripts/lane_review.mjs --grant scripts/lead_run/schema_union.mjs --grant scripts/lead_run/world_lead_pipeline.mjs --grant tests/schema_union.test.js --grant docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/M1_CHECKPOINT.md scripts/lead_run/schema_union.mjs scripts/lead_run/world_lead_pipeline.mjs tests/schema_union.test.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/M1_CHECKPOINT.md` | PASS; tracked=1, private-names=118 scanned, name-hit-files=0, top-level-await-files=0, outside-grant=0 | None |

No book pack was regenerated, and no commit was made.
