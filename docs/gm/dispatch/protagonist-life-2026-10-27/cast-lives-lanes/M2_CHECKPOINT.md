# M2 checkpoint: union row kinds across schema versions

Status: script and focused tests complete; LOTM and MoL records-ready pipelines completed. Route kind: local tooling with private source inputs; review: agent-verified, not human-reviewed. Rules: AD36, AD45, CLR2, CLR3, CLR4, CLR12.

## Data probe

| Book/input | Expected | Observed | Result |
| --- | ---: | ---: | --- |
| MoL selected shard files with `pre-sv14/` backup by kind | 106 per kind | 106 each for customs, news, places, rules, services | met |
| MoL people backup files | probe | 4 of 106; 102 absent | reported; current people retained |
| LOTM selected people files / backed-up people files | probe | 72 / 69 | three missing backups; current rows retained |
| LOTM selected files per other backed-up kind | probe | 72 per kind | reported below |
| Row identity | id where present; normalized kind/name otherwise | both paths exercised synthetically | met |

## Union counts

Rows count source rows across selected shards. “Backup rows” sums the available version folders; “backup-only kept” counts unique row identities absent from current. The output report records detailed per-file values under `kindFiles` and compact totals under `kinds`.

| Book | Kind | Files | Current rows | Backup rows | Backup-only kept | Fields filled from backup |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| LOTM | people | 69 | 1,429 | 1,297 | 78 | field provenance retained by M1 merge |
| LOTM | customs | 72 | 731 | 853 | 33 | 0 |
| LOTM | news | 72 | 584 | 698 | 48 | 0 |
| LOTM | places | 72 | 1,169 | 1,215 | 300 | 2,800 |
| LOTM | rules | 72 | 823 | 1,010 | 888 | 1,121 |
| LOTM | services | 72 | 658 | 507 | 36 | 63 |
| MoL | people | 4 | 48 | 47 | 7 | field provenance retained by M1 merge |
| MoL | customs | 106 | 874 | 923 | 51 | 0 |
| MoL | news | 106 | 890 | 1,032 | 65 | 0 |
| MoL | places | 106 | 1,206 | 1,232 | 247 | 2,744 |
| MoL | rules | 106 | 1,553 | 1,704 | 1,029 | 6,128 |
| MoL | services | 106 | 422 | 491 | 74 | 69 |

The people union additionally reports current/backup/union rows as 1,429/1,297/1,507 for LOTM and 48/47/55 for MoL. The people path preserves M1's slot-level merge and `_from` provenance; it uses newest available backup selection. The generic row-kind path searches all `pre-svN` folders newest first, fills silent fields from older rows, keeps older-only identities, and records `_from` per field.

## Consumer fitness comparison

Format is usable/total, before P1 records-ready snapshot to current M2 output. “All” covers all merged records; “lead” covers the requested chapter slice. These comparisons include source snapshot drift since P1 and are not an isolated causal estimate of M2.

| Book/scope | Relations | Routines | Reacts | Scenes | Rules |
| --- | --- | --- | --- | --- | --- |
| LOTM all | 1,026/1,205 → 3,314/3,858 | 88/696 → 289/1,897 | 317/812 → 1,070/2,055 | 295/369 → 337/539 | 0/1,926 → 96/1,711 |
| LOTM lead | 209/266 → 206/267 | 11/131 → 12/94 | 79/196 → 83/112 | 40/58 → 40/58 | 0/454 → 18/180 |
| MoL all | 3,314/4,020 → 3,353/4,058 | 66/1,693 → 71/1,713 | 867/2,632 → 1,130/2,665 | 96/714 → 96/714 | 0/6,721 → 181/2,582 |
| MoL lead | 110/132 → 149/170 | 10/76 → 15/96 | 37/100 → 76/133 | 4/25 → 4/25 | 0/182 → 6/77 |

## Check log

| Check | Command | Result | Gaps |
| --- | --- | --- | --- |
| Focused union and pipeline tests | `node --test tests/schema_union.test.js tests/world_lead_pipeline.test.js` | PASS, 4/4; covers older-only id row, silent field fill, three-version precedence, id-less normalized-name dedupe, pipeline ordering | Synthetic fixture only |
| LOTM pipeline | `node scripts/lead_run/world_lead_pipeline.mjs lotm --from 'zh 第1章 p1' --to 'zh 第24章 p99999' --match '^(s[0-9]+[rv]?m$|w[1-4]s[0-9]+m$|b[4-7]s[0-9]+m$)' --overlay docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/L1_overlay_reviewed.json --out /tmp/m2-lotm` | PASS; 72 shards, seven stages; 69 people backups and three missing | Current source differs from the previous records-ready snapshot |
| MoL pipeline | `node scripts/lead_run/world_lead_pipeline.mjs mol --from 'en b1 c1 p1' --to 'en b1 c5 p9' --match '^molc[0-9]+m$' --overlay docs/research/novels/mother-of-learning/private/lead-run-2026-10-28/L1_overlay_reviewed.json --review docs/research/novels/mother-of-learning/private/lead-run-2026-10-28/L1_crosswalk_review.json --out /tmp/m2-mol-final` | PASS; 106 shards, seven stages; current aggregate report verified | 102 people backups absent; row-kind backups are complete for five kinds |
| Lane review | `node scripts/lane_review.mjs --grant scripts/lead_run/schema_union.mjs --grant tests/schema_union.test.js --grant docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/M2_CHECKPOINT.md scripts/lead_run/schema_union.mjs tests/schema_union.test.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/M2_CHECKPOINT.md` | PASS; tracked=1, private-names=118 scanned, name-hit-files=0, top-level-await-files=0, outside-grant=0 | None |

Outputs and full receipts remain in `/tmp/m2-lotm` and `/tmp/m2-mol-final`. No private source text was copied into this checkpoint. No commit was made.
