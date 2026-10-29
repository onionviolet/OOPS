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

## Resume 1: missing fare broke registry JSON validation

The coordinator's fresh scratch browser build at HEAD `f35fa6d4c` failed to
load the journeys candidate with `Simulation data must be JSON.` The same build
loaded the whole-book candidate without journeys. Reproducing against the real
candidate in Node through `defineJourneys` and `createSimulationRegistry` found
615 of 616 definitions failing: `command.journey.fare` was `undefined` when
the pack row omitted a fare. The adapter now emits `null` for an unknown fare;
zero and positive fares retain their values, and the quote still says the fare
was not recorded. The candidate itself needed no change or regeneration.

Malformed journey preflight and a typed pack-load message require changes beyond
the T2 files: `validateLotmCast` in `src/book_world_lotm_cast.js` does not
preflight journey commands, and `loadPrivateCast` in
`src/book_world_lotm_cast_days.js` collapses validation failures to `null` while
its later `onCastLoaded(deriveCast)` listener can reject the load promise.
The loader and startup UI need a typed diagnostic and a visible recovery path.
This remains open for the coordinator. Rules: CLR3, CLR4, AD36, AR10, AR14.

| Command | Result | Gaps |
|---|---|---|
| Node probe: real candidate through `defineJourneys` and `createSimulationRegistry` before the fix | Reproduced: 615/616 definitions rejected; sole non-JSON path `command.journey.fare` | Per-command registry probe, not a browser load |
| Node probe: real candidate through `defineJourneys`, `createSimulationRegistry` and `jsonData` on quotes after the fix | PASS, 616 commands registered, 616 quotes JSON-valid, 615 unknown fares retained | Synthetic binding; not a combined application boot |
| `node --test tests/cast_journeys.test.js tests/build_journeys.test.js tests/build_replay_mapping.test.js` | PASS, 23/23, including generator-shaped registry regression and native fixture Save/reload and Export/Import | Fixture pack; no whole-book browser load |
| `BUILD_OUT=/tmp/yairpg-j3-resume1-build npm run build` | PASS; bundle SHA-256 `a450d2fe0691f522d1f5f2a5b2b64456290063d34215f9de6a24f8e3d95b3186` | Isolated build, not browser-exercised |
| `npm run check:arch` | PASS; no baseline growth, 205 grandfathered cycle edges | Architecture only |
| `node scripts/lane_review.mjs` with the two T2 files and checkpoint as grants | FAIL: one name-hit file, zero top-level-await and outside-grant paths | Existing test-file hit also occurs at HEAD; the raw scanner result remains failed |
| Private-name scan of added lines against the same pack names and HEAD baseline | PASS: zero added-line hits; the one test-file hit predates this change | Scoped added-line comparison, not a replacement for the raw scanner |
| `git diff --check -- src/cast_journeys.js tests/cast_journeys.test.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/J3_CHECKPOINT.md` | PASS | Scoped whitespace only |

Input identities: adapter SHA-256 `88a05c96de5f89fd5688f2876c9f4a1bdf5eb25135cd86deae509489812db1e0`,
test SHA-256 `be9ebd2ef73b62f8b9ef065ba79da79f3d633250d30e12bc6555dd7c9c724539`,
private candidate SHA-256 `0d6c513fb6755f1322e3e7ae83abc99ef1e21695ed553aab3e9ffec7e0b57ec2`.
Runtime fix is implemented, below the AD43 floor: coordinator's rebuilt
fresh-origin browser load with the real candidate remains the authoritative
integration check. Agent-verified, not human-reviewed; no commit or push.
