# J3 checkpoint: journey rows from whole-book travel steps

Status: offline candidate and replay mapping generated; agent-verified, not
human-reviewed. No runtime integration, pack adoption, commit or push. Rules:
CLR1–CLR8, CLR12, AD36. Publication classes: public name-free compiler,
mapper, tests and checkpoint; canon-bearing candidate and reports stay private.

## Data probe

| Input | Expected | Observed | Gate |
|---|---:|---:|---|
| X4 whole-book travel or move plus paid transport steps | about 1,270 (1,107 + 161 X4 gap rows) | 1,272 unique travel-family steps from the M4 input; X4 classifier over all steps finds 1,111 travel/move + 161 paid transport, including four travel rows already folded by existing controls | no |
| Both endpoints resolve in the pack | count | 616 emitted rows; rows require both endpoints | no |
| Explicit means, fare or duration | count | Rows preserve inferred means from the recorded verb/object, preserve fares only from an explicit numeric `fare` field or stated penny-fare input, and label one-minute fills where duration is absent; exact counts in the private row report | no |

## Result

`build_journeys.mjs` reads the whole-book scenes, crosswalk, registry, pack and
paragraph index. It selects the X4 travel/move and paid-transport verb families,
requires a source locator whose paragraph exists, and resolves the origin from
the prior resolved scene place or the current scene place. It resolves the
destination from a place-valued output/destination or explicit destination
phrase, falling back to the scene place. Missing endpoints, same-place movement,
duplicate (origin, destination, means) routes and unavailable source paragraphs
are separately counted. It does not invent fares. Duration falls back to a
labelled one-minute fill. Hours are copied only from a stated `hours` field.

The private candidate adds only `journeys` to the whole-book candidate. It has
616 unique rows: volume counts 196, 128, 84, 91, 57, 29, 19 and 12. The row
report records 1,272 family steps and rejection reasons: 20 missing source
paragraphs, 476 unclear destinations, 134 same-endpoint steps and 26 repeated
route uses. Repeated source steps share their route row and retain each step ID.
The adapter validates all 616 rows. No crossing was rejected as a separate adapter mechanism gap because
the pack schema accepts resolved endpoint IDs without requiring walk targets.

The mapper indexes journey rows by source step IDs and assigns the exact journey
ID as each step's control, ahead of generic household or walk folds. Whole-book
mapping includes 11,159 steps and maps 642/1,272 travel-family steps (50.5%) to
journey controls. This is offline replay mapping, not proof of actor attribution
or runtime execution. The source M4 scenes do not establish step actors.

Private outputs:

- `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/cast-whole-book-journeys-candidate-2026-10-29.json`
- `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/cast-whole-book-journeys-report-2026-10-29.json`
- `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/x4-whole-book-mapping-2026-10-29/resume-1/journeys-mapped.json`

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/build_journeys.test.js tests/build_replay_mapping.test.js tests/build_topic_talks.test.js tests/lead_replay_score.test.js` | PASS, 25/25 | Synthetic compiler, mapping and fidelity tests; no runtime journey |
| `node --check scripts/lead_run/build_journeys.mjs && node --check scripts/lead_run/build_replay_mapping.mjs` | PASS | Syntax only |
| `node scripts/lead_run/build_journeys.mjs ...` with M4 whole-book inputs and whole-book candidate | PASS, 616 rows; report has volume and rejection counts | Offline authoring; cited source paragraphs are present, not independently human-reviewed in this lane |
| `defineJourneys` over the generated private pack | PASS, 616/616 rows | Adapter definition only; no command execution or runtime persistence |
| `node scripts/lead_run/build_replay_mapping.mjs ... --from-locator 'zh 第1章' --to-locator 'zh b8 第99999章' --pack <journeys candidate>` | PASS, 11,159 steps; 642 step-to-control mappings; 50.5% of travel-family steps | Mapping only; actor attribution and gameplay remain unproven |
| Candidate comparison against whole-book input | PASS, only the `journeys` field differs | Structural equality; no adoption |
| `node scripts/lane_review.mjs` with J3 file grants | PASS, 325 private-name tokens scanned, zero name-hit files, zero top-level-await files, zero outside-grant paths | Scanner reports one tracked source path; new files were manually checked for synthetic-only identities |
| `git diff --check -- scripts/lead_run/build_journeys.mjs scripts/lead_run/build_replay_mapping.mjs tests/build_journeys.test.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/J3_CHECKPOINT.md` | PASS | Scoped whitespace check |

No build or browser check applies to this offline content lane. The candidate
remains private and unadopted; coordinator review and any combined replay gate
remain open. No runtime or `private_packs/` files were changed.
