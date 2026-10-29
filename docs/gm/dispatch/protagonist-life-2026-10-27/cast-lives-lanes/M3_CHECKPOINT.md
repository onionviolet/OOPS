# M3 checkpoint: LOTM volumes 1–8 merge

Status: merge ordering fixed and focused proof passed; full-range pipeline is blocked at the existing same-volume crosswalk/worksheet boundary. Route kind: local tooling with private source inputs; review: agent-verified, not human-reviewed. Rules: AD36, AD44, AD45, CLR2, CLR3, CLR4, CLR12.

## Data probe

| Input | Expected | Observed | Result |
| --- | ---: | ---: | --- |
| Volume 2–8 `lotm<V>c<NNN>m_header.json` files | about 592; stop below 400 | 640 | met |
| Batch log `partial` census shards | 47 | 47 | listed below |
| Batch log people `json-parse` shards | 7 | 7 | listed below |
| 20-row part-aware locator sample | all parse with volume | 20/20 | met |
| Volume 1 shards in `/tmp/m2-lotm` | 72 | 72 | match |

The 54 retry candidates are `lotm8c015-census`, `lotm4c087-census`, `lotm4c121-census`, `lotm4c187-census`, `lotm4c113-census`, `lotm4c069-census`, `lotm4c081-census`, `lotm4c165-census`, `lotm4c011-census`, `lotm4c123-census`, `lotm4c103-census`, `lotm4c053-census`, `lotm7c061-census`, `lotm7c037-census`, `lotm7c039-census`, `lotm7c067-census`, `lotm7c025-census`, `lotm2c111-census`, `lotm2c187-census`, `lotm2c249-census`, `lotm2c215-census`, `lotm2c059-census`, `lotm2c259-census`, `lotm2c003-census`, `lotm2c047-census`, `lotm5c131-census`, `lotm5c165-census`, `lotm5c189-census`, `lotm5c177-census`, `lotm5c055-census`, `lotm5c083-census`, `lotm3c003-census`, `lotm3c109-census`, `lotm3c057-census`, `lotm3c083-census`, `lotm3c207-census`, `lotm3c015-census`, `lotm3c209-census`, `lotm3c049-census`, `lotm3c053-census`, `lotm3c203-census`, `lotm3c113-census`, `lotm3c179-census`, `lotm6c105-census`, `lotm6c045-census`, `lotm6c003-census`, `lotm6c047-census`, `lotm4c039-people`, `lotm4c081-people`, `lotm4c125-people`, `lotm4c001-people`, `lotm4c099-people`, `lotm4c123-people`, `lotm2c109-people`.

## Merged records

| Volume | Shards | Scenes | Lead scenes | People rows | Routine slots | Usable timing | Rules rows | Places rows |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 72 | 637 | 539 | 1,574 | 1,897 | 502 | 1,711 | 1,466 |
| 2 | 143 | 913 | 627 | 2,305 | 2,161 | 603 | 7,076 | 1,797 |
| 3 | 137 | 891 | 621 | 2,301 | 1,834 | 537 | 6,393 | 1,543 |
| 4 | 119 | 812 | 487 | 2,086 | 1,723 | 513 | 5,696 | 1,360 |
| 5 | 108 | 700 | 365 | 2,103 | 1,548 | 424 | 4,721 | 1,308 |
| 6 | 62 | 430 | 224 | 1,034 | 732 | 131 | 2,996 | 793 |
| 7 | 49 | 367 | 140 | 733 | 658 | 157 | 2,254 | 640 |
| 8 | 22 | 149 | 98 | 357 | 216 | 35 | 924 | 316 |

Counts are source rows from merged records. Usable timing uses the existing `hasTime`, `routineBand` or `hasRelativeTime` checks. The registry has 12,294 IDs; 1,213 Chinese-label collisions were detected, with 887 left for review. No cross-volume IDs were auto-joined by name; repeated IDs share one registry row.

## Check log

| Check | Command | Result | Gaps |
| --- | --- | --- | --- |
| Focused synthetic merge and pipeline tests | `node --test tests/merge_shards.test.js tests/world_lead_pipeline.test.js` | PASS, 3/3; cross-volume locator order and shared ID covered | Pipeline fixture remains single-volume |
| Requested whole-book pipeline | `node scripts/lead_run/world_lead_pipeline.mjs lotm --from 'zh 第1章 p1' --to 'zh b8 第99999章 p99999' --match '^(s[0-9]+[rv]?m$|w[1-4]s[0-9]+m$|b[4-7]s[0-9]+m$|lotm[2-8]c[0-9]{3}m$)' --overlay docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/L1_overlay_reviewed.json --out /tmp/m3-lotm` | Merge completed for 712 shards; pipeline stopped at `build_crosswalk` because it requires endpoints in one volume | `build_crosswalk.mjs` and `cast_worksheet.mjs` are outside the lane file grant; no edits made there |
| Whole-book merge with compatible v1 post-processing bounds | `/usr/bin/time -l node scripts/lead_run/world_lead_pipeline.mjs lotm --from 'zh 第1章 p1' --to 'zh 第24章 p99999' --match '^(s[0-9]+[rv]?m$|w[1-4]s[0-9]+m$|b[4-7]s[0-9]+m$|lotm[2-8]c[0-9]{3}m$)' --overlay docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/L1_overlay_reviewed.json --out /tmp/m3-lotm` | PASS, seven stages; whole-book merge has 712 shards, 4,899 scenes, 12,294 registry IDs; volume 1 shards/scenes/people rows match `/tmp/m2-lotm`; output 123 MB, 24.37 s wall | Crosswalk and worksheets cover only the v1 slice; peak memory unavailable because macOS `time -l` could not read `kern.clockrate` |
| Lane review | `node scripts/lane_review.mjs --grant scripts/lead_run/merge_shards.mjs --grant tests/merge_shards.test.js --grant docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/M3_CHECKPOINT.md scripts/lead_run/merge_shards.mjs tests/merge_shards.test.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/M3_CHECKPOINT.md` | PASS; tracked=1, private-names=118 scanned, name-hit-files=0, top-level-await-files=0, outside-grant=0 | None |

The full-range post-processing blocker prevents claiming that the complete lead pipeline is merged. `pov` rows retain actor IDs where present; this lane did not infer which cover identities should be normalized to `lead`. The batch retry list belongs to Weibao and the batch-reading session; no paid call was made. Outputs and full receipts are in `/tmp/m3-lotm`; no source text or canon names are copied here.
