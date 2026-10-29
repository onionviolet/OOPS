# R3 checkpoint: whole-book cast and topic resolution, 2026-10-29

Status: private offline candidate generated; agent-verified, not human-reviewed. No runtime adoption, commit or push. Rules: AD36, AD44, CLR1–CLR5, CLR12, LSD126.

## Probe and candidate

The M4 whole-book registry contains 1,499 distinct people and 1,507 places. Lead-POV family steps reference 263 distinct registry people and 93 distinct registry places. The registry's unique identities by first-mention volume are:

| Volume | People | Places |
|---:|---:|---:|
| 1 | 588 | 526 |
| 2 | 318 | 275 |
| 3 | 240 | 229 |
| 4 | 132 | 168 |
| 5 | 127 | 146 |
| 6 | 33 | 72 |
| 7 | 51 | 76 |
| 8 | 10 | 15 |

The candidate retains every R1/R2 row across people, references, places, schedule, beats, remote whereabouts, anchors, place aliases and clock claims. Two registry identities remain in the existing references section; the remaining identities are represented in people. New identities are role-tier rows with registry names and aliases. Registry aliases remain distinct when they collide; no common-name merge is inferred.

Routines do not expose a general home/work field. The generator records a home/work place hint only for an exact source routine labelled home or work and when its place resolves. One work hint resolves; no home hint resolves. Other dated whereabouts remain event observations, not assumed residences or jobs. New place rows get walk targets only when a source-supported district is available. Existing authored R1/R2 rows remain byte-content equivalent after canonical comparison.

| Measure | R1/R2 input | Whole-book candidate |
|---|---:|---:|
| People | 204 | 1,500 |
| Places | 89 | 1,516 |
| Walk targets | 52 | 348 |
| Role-tier people | — | 1,476 |
| Alias strings | — | 937 |
| Life place hints | — | 1 (work 1, home 0) |
| Candidate bytes | — | 2,664,939 |

Candidate and topic report are private under `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/`. The candidate validator returns zero errors, including forward-anchor lint. It represents all 1,499 registry people across people plus references and all registry places; the candidate's extra place rows include the preserved R1/R2 places and explicit aliases.

## Topic yield

The prior candidate produced 13 rows from 849 family steps. Whole-book person/place coverage plus paragraph checks produce 64 rows:

| Volume | Family steps | Topic rows |
|---:|---:|---:|
| 1 | 179 | 10 |
| 2 | 168 | 13 |
| 3 | 157 | 8 |
| 4 | 143 | 11 |
| 5 | 110 | 14 |
| 6 | 53 | 5 |
| 7 | 28 | 2 |
| 8 | 11 | 1 |

Before → after D3 rejection counts: unresolved person 315 → 95; ambiguous person 248 → 437; unclear speaker 210 → 193; unresolved place 63 → 60. The ambiguity count rises because whole-book rows expose more distinct candidates; the builder now preserves same-name ambiguity even when only one candidate is present. It uses a cited paragraph only for a unique named speaker cue; otherwise the step remains unattributed. Nineteen emitted rows carry paragraph-level speaker evidence. Unresolved places remain a separate gate.

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/build_cast_pack.test.js tests/build_topic_talks.test.js` | PASS, 18/18 | Focused generator and attribution tests only |
| `node --check scripts/lead_run/build_cast_pack.mjs && node --check scripts/lead_run/build_topic_talks.mjs` | PASS | Syntax only |
| `node scripts/lead_run/build_cast_pack.mjs lotm --from 'zh 第1章 p1' --to 'zh b8 第99999章 p99999' --merged /tmp/m4-lotm/merged --base docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/cast-r1r2-candidate-2026-10-29.json --out docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/cast-whole-book-candidate-2026-10-29.json --whole-book` | PASS, 1,500 people; 1,516 places; 2,723 added rows; zero changed or removed rows | Offline candidate generation; no runtime adoption |
| `node scripts/lead_run/build_topic_talks.mjs --scenes /tmp/m4-lotm/merged/scenes.jsonl --crosswalk /tmp/m4-lotm/merged/crosswalk.json --registry /tmp/m4-lotm/merged/registry.jsonl --pack docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/cast-whole-book-candidate-2026-10-29.json --out docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/cast-whole-book-candidate-2026-10-29.json --report docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/cast-whole-book-topics-report-2026-10-29.json --source-dir docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27` | PASS, 64 rows from 849 family steps; eight volume counts recorded above | Paragraph cue heuristic is conservative; remaining attribution gaps stay unresolved |
| `node --input-type=module -e 'import fs from "node:fs";import{validateLotmCast}from"./src/book_world_lotm_cast.js";const p=JSON.parse(fs.readFileSync("docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/cast-whole-book-candidate-2026-10-29.json"));const e=validateLotmCast(p);if(e.length)throw Error(JSON.stringify(e));console.log("PASS: private candidate valid; forward-anchor lint clear")'` | PASS, zero errors; forward-anchor lint included | Schema validity only; no gameplay proof |
| `node --input-type=module -e 'import fs from "node:fs";const d="docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/",a=JSON.parse(fs.readFileSync(d+"cast-r1r2-candidate-2026-10-29.json")),b=JSON.parse(fs.readFileSync(d+"cast-whole-book-candidate-2026-10-29.json"));const c=v=>Array.isArray(v)?v.map(c):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,c(v[k])])):v,s=(x,y)=>JSON.stringify(c(x))===JSON.stringify(c(y));for(const k of ["people","references","places","schedule","beats","remoteWhereabouts","anchors","placeAliases","clockClaims"])for(const x of a[k]||[])if(!(b[k]||[]).some(y=>s(x,y)))throw Error(`${k} base row changed`);console.log("PASS: all R1/R2 rows preserved")'` | PASS, all existing R1/R2 rows unchanged | Does not establish candidate adoption |
| `node scripts/lane_review.mjs --grant scripts/lead_run/build_cast_pack.mjs --grant scripts/lead_run/build_topic_talks.mjs --grant tests/build_cast_pack.test.js --grant tests/build_topic_talks.test.js --grant docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/R3_CHECKPOINT.md scripts/lead_run/build_cast_pack.mjs scripts/lead_run/build_topic_talks.mjs tests/build_cast_pack.test.js tests/build_topic_talks.test.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/R3_CHECKPOINT.md` | PASS; tracked=2, private-names=325 scanned, name-hit-files=0, top-level-await-files=0, outside-grant=0 | None |
| `git diff --check -- scripts/lead_run/build_cast_pack.mjs scripts/lead_run/build_topic_talks.mjs tests/build_cast_pack.test.js tests/build_topic_talks.test.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/R3_CHECKPOINT.md` | PASS | Whitespace only |

Public tooling/tests remain name-free. No `private_packs/` file or runtime source was written. Coordinator review and candidate adoption remain open.

## Private outputs

- Candidate: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/cast-whole-book-candidate-2026-10-29.json`
- Topic counts: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/cast-whole-book-topics-report-2026-10-29.json`
- Generator report: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/build-report.json`
