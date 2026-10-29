# M4 checkpoint: whole-book crosswalk and worksheets

Status: whole-book tooling pipeline completed across eight volumes. Route kind: local tooling with private source inputs; review: agent-verified, not human-reviewed. Rules: AD36, AD44, AD45, CLR2, CLR3, CLR4, CLR12, X5, X12, LSD151, LSD156-LSD159.

## Probe and locator gate

| Probe | Expected or gate | Observed | Result |
| --- | --- | --- | --- |
| `/tmp/m3-lotm` input | Present | Present | pass |
| Lead-POV scenes by shard volume | 539, 627, 621, 487, 365, 224, 140, 98 | Same counts | pass |
| Scenes with non-lead actor POV | Count only | 1,798 scenes, 211 actor IDs | reported |
| Chapter-only locator comparisons in crosswalk and worksheet stages | List | None; both compared language, volume, chapter and paragraph, then rejected cross-volume endpoints | range guard fixed |

The whole-book range now uses `compareLocators` from `merge_shards.mjs`, including volume order. Three baseline lead-POV rows lack a parseable locator and are omitted from the selected crosswalk range: two in volume 2 and one in volume 6. All other baseline rows are selected. Evidence-linked persona POV rows are included; 70 persona IDs were found and 706 unreviewed reveal candidates are in the private output review file.

## Whole-book output

| Volume | Baseline lead rows selected | Persona rows selected | Total lead rows selected | Crosswalk-selected people | Routines with usable timing | Worksheets written | Worksheet output MB |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 539 | 30 | 569 | 162 | 502 | 1,468 | 71.82 |
| 2 | 625 | 28 | 653 | 286 | 603 | 1,199 | 4.44 |
| 3 | 621 | 83 | 704 | 275 | 537 | 1,164 | 3.38 |
| 4 | 487 | 92 | 579 | 236 | 513 | 923 | 2.45 |
| 5 | 365 | 54 | 419 | 205 | 424 | 699 | 1.44 |
| 6 | 223 | 39 | 262 | 123 | 131 | 339 | 0.50 |
| 7 | 140 | 13 | 153 | 91 | 157 | 342 | 0.66 |
| 8 | 98 | 7 | 105 | 58 | 35 | 150 | 0.12 |

People are unique IDs with present or partial status in selected scenes for that volume. Routine timing uses the existing explicit-time, time-band and relative-order checks. Each worksheet is assigned once to the volume of its first locator; worksheet bytes therefore sum across assigned files without double-counting.

The run selected 3,444 lead rows (3,098 baseline rows plus 346 persona rows), generated 6,284 worksheets, and wrote 21,672 worksheet rows. The private persona review file contains 706 unreviewed candidate links. Whole-run wall time was 18.55 seconds; `/usr/bin/time -l` could not report peak memory in this environment (`sysctl kern.clockrate: Operation not permitted`). The full `/tmp/m4-lotm` output occupies 203 MB. Resource timing and full-output size apply to the shared eight-volume run, not to an individual volume.

Volume 1 comparison: M2's whole-index totals of 539 baseline lead scenes and 1,897 routine slots match the M4 source totals. The 502 usable timing rows match M3's reported value. M2's `usable` routine and scene fitness counts require registered place mappings, so they are distinct from these source-row counts. The three no-locator omissions occur outside volume 1.

## Check log

| Check | Command | Result | Gaps |
| --- | --- | --- | --- |
| Focused crosswalk, worksheet and pipeline tests | `node --test tests/lead_run_crosswalk.test.js tests/cast_worksheet.test.js tests/world_lead_pipeline.test.js` | PASS, 26/26; two-volume range, persona POV, authoritative registry kind, unique sanitized filenames and clean reruns covered | None |
| Whole-book pipeline | `/usr/bin/time -l node scripts/lead_run/world_lead_pipeline.mjs lotm --from 'zh 第1章 p1' --to 'zh b8 第99999章 p99999' --match '^(s[0-9]+[rv]?m$|w[1-4]s[0-9]+m$|b[4-7]s[0-9]+m$|lotm[2-8]c[0-9]{3}m$)' --overlay docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/L1_overlay_reviewed.json --out /tmp/m4-lotm` | PASS, seven stages; 712 shards, 4,899 merged scenes, 12,294 registry IDs, 3,444 selected lead rows, 6,284 worksheet files; 18.55 s | Peak memory unavailable; 3 baseline lead rows lack parseable locators |
| Output file count | `find /tmp/m4-lotm/cast-worksheets -maxdepth 1 -type f \| wc -l` | PASS, 6,284 files, matching the generator's entity count | None |
| Lane review | `node scripts/lane_review.mjs --grant scripts/lead_run/build_crosswalk.mjs --grant scripts/lead_run/cast_worksheet.mjs --grant scripts/lead_run/world_lead_pipeline.mjs --grant scripts/lead_run/merge_shards.mjs --grant tests/lead_run_crosswalk.test.js --grant tests/cast_worksheet.test.js --grant tests/world_lead_pipeline.test.js --grant docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/M4_CHECKPOINT.md scripts/lead_run/build_crosswalk.mjs scripts/lead_run/cast_worksheet.mjs scripts/lead_run/world_lead_pipeline.mjs scripts/lead_run/merge_shards.mjs tests/lead_run_crosswalk.test.js tests/cast_worksheet.test.js tests/world_lead_pipeline.test.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/M4_CHECKPOINT.md` | PASS; tracked=3, private-names=118 scanned, name-hit-files=0, top-level-await-files=0, outside-grant=0 | None |

Output and full receipts remain in `/tmp/m4-lotm`; source text, IDs and candidate identities remain private there. No runtime files were changed. No commit or push was made.
