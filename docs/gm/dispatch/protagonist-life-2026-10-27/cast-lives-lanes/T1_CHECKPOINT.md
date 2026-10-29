# T1 tooling checkpoint

**Implemented, below floor for browser measurements.** Route kind: synthetic pipeline plus attempted fresh-build browser route. Review: agent-verified, not human-reviewed. Codes: AD36, AD43, AD45, CLR2, CLR3, CLR12, SZ5, CL278, LSD146-LSD147. No `src/` files changed, no commit made.

## Data probe

| Probe | Expected | Observed | Result |
| --- | ---: | ---: | --- |
| LOTM v1 source tree size | ~400 MB | 401 MB | Met |
| Existing floor prototype | 1 | 1 | Found at the brief's path |
| `launchChrome` helper | 1 | 1 | Found in `scripts/ui_helpers.cjs` |

## Part A: lean schema union

The union now writes merged people and first-census files plus its report. Untouched files are symlinked from the private input. Pipeline scratch is placed beside the selected input directory because `build_crosswalk` requires generated files under a novel private directory; this keeps scratch out of the selected 401 MB source tree, and cleanup removes it after the run.

The full LOTM v1 pipeline selected 72 shards. The union output contained 11,588,362 bytes of regular files and 17,370 symlinked entries. Each of the 11 merged outputs compared byte-for-byte equal to `/tmp/m1-lotm-final4/merged` with `cmp`; mismatches: 0. Three people files had no pre-1.4 backup and remained at their current version, as before.

## Parts B and C: floor and budgets

`scripts/floor/run_floor.cjs` supports a named build folder, fresh origin, viewport, LOTM beside profile, natural-play timing, wait timing, screenshots, save/reload/Export/Import comparison, JSON receipt and optional budget checks. `tests/floor_budget.test.js` covers only synthetic budget comparison.

The isolated build to `/tmp/t1-floor-build` passed; bundle SHA-256: `11520d97e2946bf0bbe3be66a22fa6b23984c12bb4f466d973b14830aad65586`. Headless Chrome then aborted during launch with `SIGABRT` (exit 134); a direct headless launch also exited 134 before opening a page. No floor screenshots or receipt were produced, so 60-minute natural timing, the fresh 349-minute wait, pack-load time and saved-byte size remain unmeasured. The budget example contains only the known same-day wait measurement from the prior G1 floor (13,400 ms); it does not invent the missing measurements. CO3's 3,000 ms wait target remains separate from this measured baseline.

Known limits: one LOTM world/profile per invocation; persistence comparison omits only the top-level natural clock; no human play review. After Chrome is available, rerun the documented floor command with `--build --build-out /tmp/t1-floor-build --out /tmp/t1-floor --natural-minutes 60 --wait-minutes 349`, then replace the example's provisional wait baseline and record all receipt measurements.

## Checks

| Command | Result | Gap |
| --- | --- | --- |
| `node --test tests/schema_union.test.js tests/world_lead_pipeline.test.js tests/floor_budget.test.js` | PASS, 5/5 | Synthetic fixtures only |
| `node scripts/lead_run/world_lead_pipeline.mjs lotm --from 'zh 第1章 p1' --to 'zh 第24章 p99999' --match '^(s[0-9]+[rv]?m$|w[1-4]s[0-9]+m$|b[4-7]s[0-9]+m$)' --overlay docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/L1_overlay_reviewed.json --out /tmp/t1-pipeline` | PASS, 72 shards, seven stages | Three missing backups retained |
| Per-file `cmp` against `/tmp/m1-lotm-final4/merged` | PASS, 11/11; zero byte mismatches | Exact to supplied baseline |
| `node scripts/floor/run_floor.cjs --build --build-out /tmp/t1-floor-build --out /tmp/t1-floor --natural-minutes 60 --wait-minutes 349` | Build PASS; browser launch failed, Chrome SIGABRT | No browser floor receipt or screenshots |
| `node --check scripts/lead_run/schema_union.mjs && node --check scripts/lead_run/world_lead_pipeline.mjs && node --check scripts/floor/run_floor.cjs && node --check scripts/floor/budgets.cjs` | PASS | None |
| `node scripts/lane_review.mjs` with explicit T1 grants and paths | PASS; three tracked tests scanned, 118 private names checked, no name hits or ungranted paths | Scripts are outside the reviewer's `src/`/`tests/` name scan |

## Coordinator review (2026-10-28)

Chrome cannot start inside the Codex sandbox (SIGABRT); the coordinator ran the floor outside it. Fixes made in
review: the floor's file server lacked an HTML content type (page downloaded instead of loading), and the save
comparison failed on harmless differences (key order, `saved_at`, time-driven `skillRecords.tracked`, and zero,
false or empty fills restored on load). The comparison now canonicalizes those and lists them as a known limit.
Result: `node scripts/floor/run_floor.cjs --build-out /tmp/t1-floor-build --out /tmp/t1-floor --natural-minutes 60
--wait-minutes 349` PASS; fresh beside life, natural play, save, reload, Export, Import. Receipt: pack load 6,406 ms,
1,716 ms per game minute (36 minutes), the wait advanced 440 game minutes in 45,101 ms, save 369,902 bytes, bundle
`11520d97`. These are worse than G1's 13.4 s wait; the run shared the machine with three lanes and carries B1's
round 2 changes, so they are a contended baseline for P2, not a regression verdict. `budgets.example.json` holds
them as `measured` and keeps CO3's 3,000 ms wait as the only `max`.
