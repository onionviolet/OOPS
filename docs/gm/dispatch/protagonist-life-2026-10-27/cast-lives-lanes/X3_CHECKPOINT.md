# X3 checkpoint: household verbs in the replay mapper

Status: mapping/tooling implemented; agent-verified, not human-reviewed. No runtime source or pack data changed. No commit, staging, reset, stash or push. Rules: AD36, CLR1–CLR3, CLR6–CLR8, CLR12.

## Probe

| Input | Expected | Observed | Result |
|---|---:|---:|---|
| Live pack `householdActs.acts` | 9 | 9 | Pass |
| M4 chapters 1–24 rows at household act places with a listed household verb | At least 5 | 10 | Pass; `pay` 1, `light` 1, `wash` 1, `clean` 1, `eat` 3, `take` 1, `check` 2 |
| X1 prior chapters 1–24 mapping | 1,491 steps | 1,491 | Pass |
| V2 controls for household act IDs | IDs from pack and be-seat inventory | 9 act IDs in pack; IDs are emitted directly from pack | Pass |

The verb probe uses exact household act locations and word boundaries. `use the washroom` is not counted as a `wash` verb. Two `check` rows remain gaps because their object text does not distinguish a household act.

## Mapping result

The generator resolves an act only when the step's place resolves to an act place and its verb/object select one pack act. The route carries the pack's command ID, resolved place and source object. Household-looking steps without a match stay typed gaps. No IDs are hardcoded in tracked code. When `householdActs` is absent, the legacy mapping result remains unchanged.

Private outputs are in `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/x3-be-mapping-2026-10-29/` (`chapters-1-24.json`, `chapters-1-3.json`). No canon names or source text were added to tracked files.

| Pack act ID | Chapter 1–24 mapped steps |
|---|---:|
| `book.lotm.household_inspect` | 0 |
| `book.lotm.household_pay` | 1 |
| `book.lotm.household_light` | 1 |
| `book.lotm.household_wash` | 1 |
| `book.lotm.household_clean` | 0 |
| `book.lotm.household_check` | 0 |
| `book.lotm.household_eat` | 3 |
| `book.lotm.household_store` | 0 |
| `book.lotm.household_take` | 1 |

Seven steps map. The remaining household gaps by reason are:

| Gap reason | Count | Detail |
|---|---:|---|
| No act for verb at place | 1 | The clean step is at the washroom place; the clean act is at the flat place. |
| Object does not disambiguate act | 2 | The step text says `check` with a pocket-watch object, while the pack has two inspect acts at this place. |

## Before/after counts

Before uses the same M4, crosswalk, registry and controls with `householdActs` removed from a temporary pack copy. Counts are generated mapping rows, not gameplay proof.

| Range | State | Steps | Walks | Waits | Talks | Other gaps | Household act mappings | Household gaps |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| 1–24 | Before | 1,491 | 29 | 167 | 117 | 1,178 | 0 | 0 |
| 1–24 | After | 1,491 | 28 | 165 | 117 | 1,171 | 7 | 3 |
| 1–3 | Before | 175 | 3 | 29 | 7 | 136 | 0 | 0 |
| 1–3 | After | 175 | 3 | 27 | 7 | 133 | 4 | 1 |

`Other gaps` are the mapper's pre-existing generic gap rows; household gaps are counted separately. The rebuilt output recategorizes each matched row as an act or household gap, so these figures are mapping classifications, not an increase in source steps.

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/replay_mapping_household.test.js tests/build_replay_mapping.test.js tests/lead_replay_score.test.js` | PASS, 12 tests | Synthetic mapper and scoring tests; no gameplay proof |
| Generate chapters 1–24 with the M4 merged inputs, X1 controls, live pack and `--from 1 --to 24` | PASS, 418 scenes / 1,491 steps; 7 acts, 28 walks, 165 waits, 117 talks, 3 household gaps | Offline mapping only |
| Generate chapters 1–3 with the same inputs and `--from 1 --to 3` | PASS, 57 scenes / 175 steps; 4 acts, 3 walks, 27 waits, 7 talks, 1 household gap | Offline mapping only |
| `node --check scripts/lead_run/build_replay_mapping.mjs` | PASS | Syntax only |
| `git diff --check -- scripts/lead_run/build_replay_mapping.mjs tests/replay_mapping_household.test.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/X3_CHECKPOINT.md` | PASS | Whitespace only |
| `node scripts/lane_review.mjs --grant scripts/lead_run/build_replay_mapping.mjs --grant tests/replay_mapping_household.test.js --grant docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/X3_CHECKPOINT.md scripts/lead_run/build_replay_mapping.mjs tests/replay_mapping_household.test.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/X3_CHECKPOINT.md` | PASS; tracked=1, 118 private names scanned, 0 name-hit files, 0 top-level-await files, 0 outside-grant files | Static publication/scope check |

The focused tests include the no-`householdActs` fallback. No browser replay or build was run; this is an offline mapping lane. Mapping counts do not establish gameplay coverage.
