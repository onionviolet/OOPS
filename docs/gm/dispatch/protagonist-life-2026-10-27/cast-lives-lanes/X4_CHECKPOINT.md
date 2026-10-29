# X4 checkpoint: whole-book replay gap census

Status: volume-aware mapping and private census completed; agent-verified, not human-reviewed. Offline mapping/tooling only; no runtime or pack changes. Rules: AD36, CLR1–CLR3, CLR6–CLR7, CLR12.

## Data probe

| Input | Expected | Observed | Result |
|---|---:|---:|---|
| M4 lead-step inputs | Eight volumes, thousands of steps | Eight volumes, 11,159 selected steps | Pass |
| Chapters 1–24 comparison baseline | 1,491 steps | 1,491 steps | Pass |
| Mapping ranges | Every volume range generated or recorded as a failure | 19 ranges generated; 0 failed | Pass |

The mapper now accepts `--from-locator` and `--to-locator` bounds such as `zh b2 第1章` and `zh b2 第100章`; volume 1 uses `zh 第1章`. Existing `--from`/`--to` chapter-only callers remain supported. Whole-book generation used 100-chapter ranges, clipped to each volume's observed final chapter. The private runner loaded M4 `scenes.jsonl`, `crosswalk.json`, `registry.jsonl`, X1 `controls.json`, and the live cast pack, then called `buildReplayMapping` once per range. A CLI sample of volume 1, chapters 1–100, returned 396 scenes / 1,130 steps.

Mapping files, `range_failures.json`, `census.json`, and the chapter 1–24 comparison are private under `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/x4-whole-book-mapping-2026-10-29/`. Census rows are deduplicated by step ID across ranges; none overlapped in this run. Public code, tests and this checkpoint contain counts only.

## Chapters 1–24, prior mapper and X4

The prior row counts are from X3's generated output on the same 1,491-step range. Gaps exclude mapped acts, walks, wait intentions and talks.

| State | Steps | Acts | Walks | Waits | Talks | Gaps by class |
|---|---:|---:|---:|---:|---:|---|
| X3 prior mapper | 1,491 | 7 | 28 | 165 | 117 | ritual 97; socialize 124; unknown 95; other 219; rest 43; trade 92; travel 115; research 74; fight 51; work 36; study 103; practice 24; appraise 70; craft 19; care 12 |
| X4 mapper | 1,491 | 7 | 28 | 159 | 130 | ritual 99; socialize 116; unknown 87; other 213; rest 43; trade 96; travel 124; research 74; fight 51; work 36; study 101; practice 24; appraise 71; craft 20; care 12 |

The additional matches use existing talk controls for explicit social verbs with a resolvable present person, and existing walk controls for explicit movement verbs with a resolvable destination. Generic `other`/`unknown` rows are reclassified only when their verb clearly supports one of those existing classes. Unresolved people and places, and actions needing a different control, remain typed gaps.

## Whole-book ranked gap table

Share is each class's portion of the 10,047 gap steps. The private census contains counts by volume, reason split, and up to 40 normalized verb phrases per class.

| Rank | Class | Gap steps | Share |
|---:|---|---:|---:|
| 1 | other | 1,853 | 18.44% |
| 2 | ritual | 1,191 | 11.85% |
| 3 | travel | 1,167 | 11.62% |
| 4 | socialize | 982 | 9.77% |
| 5 | study | 795 | 7.91% |
| 6 | fight | 693 | 6.90% |
| 7 | appraise | 633 | 6.30% |
| 8 | research | 585 | 5.82% |
| 9 | trade | 571 | 5.68% |
| 10 | rest | 486 | 4.84% |
| 11 | work | 377 | 3.75% |
| 12 | practice | 240 | 2.39% |
| 13 | care | 198 | 1.97% |
| 14 | craft | 178 | 1.77% |
| 15 | unknown | 98 | 0.98% |

Reason split: missing verb 0; missing place/person 466; missing UI path 9,581. Mappings and reason labels are census inputs, not gameplay coverage evidence.

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/build_replay_mapping.test.js tests/lead_replay_score.test.js` | PASS, 13 tests | Synthetic mapping and scoring only |
| `node --check scripts/lead_run/build_replay_mapping.mjs` | PASS | Syntax only |
| `node --check scripts/lead_run/gap_census.mjs` | PASS | Syntax only |
| Volume-aware CLI generation, volume 1 chapters 1–100 with M4/X1/live-pack inputs | PASS, 396 scenes / 1,130 steps | One real-data range; offline mapping only |
| Whole-book mapping runner over volume/chapter ranges | PASS, 19 ranges / 11,159 steps / 0 range failures | Offline mapping only; not browser or gameplay proof |
| `node scripts/lead_run/gap_census.mjs --mappings <private-x4-dir> --failures <private-x4-dir>/range_failures.json --out <private-x4-dir>/census.json` | PASS, 10,047 gaps; all 8 volumes represented; 0 failed ranges | Private report; no gameplay coverage claim |

No build or browser replay was run because this is a private-data mapping/tooling lane. No commit or push was performed.
