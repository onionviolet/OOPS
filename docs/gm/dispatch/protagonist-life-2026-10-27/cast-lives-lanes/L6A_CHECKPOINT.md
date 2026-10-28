# L6A checkpoint: MoL cast worksheets

Status: generalized worksheet stage and private MoL outputs complete; agent-verified, not human-reviewed. This is L3 preparation data, not runtime cast behavior.

Authority: [L6A brief](L6A_MOL_WORKSHEETS_BRIEF.md), [L1 checkpoint](L1_CHECKPOINT.md), [cast-lives plan](../CAST_LIVES_PLAN_2026-10-28.md). Codes: CL94, CL115, WA22-WA24, AR1-AR16, AD36, AD41.

Input probe: MoL merged input has 25 lead scenes in the selected slice, 109 crosswalk entities, and 1,693 routine slots across the merged index. Crosswalk kinds: 26 people, 61 places, 6 organizations, and 16 items. The first two measures exceed the brief's stop threshold.

Output: `docs/research/novels/mother-of-learning/private/lead-run-2026-10-28/cast-worksheets/`.

```text
TOTAL entities=93 rows=139 usable-time=43
```

MoL anchors after `en b1 c5 p9` are included in `anchors` only when the source row explicitly marks the first/same loop. Later presences with absent or other loop metadata are held in `anchorsOtherLoops`; no later restart is treated as a forward anchor for this loop.

## Check log

- Input count probe over `merged-cast-2026-10-28/{scenes.jsonl,crosswalk.json,extras.jsonl}`: PASS; 25 slice lead scenes, 109 crosswalk rows, 1,693 merged routine slots; no probe stop.
- `node --test tests/cast_worksheet.test.js`: PASS, 3/3; LOTM fixtures retained, MoL range and same-loop anchor fixture added.
- LOTM byte-identity command: `node scripts/lead_run/cast_worksheet.mjs <LOTM merged dir> --crosswalk <LOTM crosswalk.json> --world lotm --from 'zh 第1章 p1' --to 'zh 第24章 p99999' --out <LOTM private scratch>/` followed by SHA-256 comparison against existing `cast-worksheets/*.json`: PASS, 187/187 files byte-identical; summary `entities=187 rows=148 usable-time=36`.
- MoL generation command: `node scripts/lead_run/cast_worksheet.mjs docs/research/novels/mother-of-learning/private/lead-run-2026-10-28/merged-cast-2026-10-28 --crosswalk docs/research/novels/mother-of-learning/private/lead-run-2026-10-28/merged-cast-2026-10-28/crosswalk.json --world mol --from 'en b1 c1 p1' --to 'en b1 c5 p9' --out docs/research/novels/mother-of-learning/private/lead-run-2026-10-28/cast-worksheets`: PASS, 93 worksheets; totals above.
- Independent crosswalk coverage and forward-anchor scan: PASS, 93 eligible person/place/organization rows, 93 worksheets, no missing/extra outputs, zero later unqualified anchors in `anchors`.
- `git diff --check -- scripts/lead_run/cast_worksheet.mjs tests/cast_worksheet.test.js`: PASS; no diagnostics. Generated private outputs are ignored and not shown by `git status`.

## Remaining boundary

The worksheets are source-derived handoff data; downstream L3 review and implementation remain separate. No runtime behavior, build, browser, save or import claim is made. Changes remain uncommitted and unpushed.
