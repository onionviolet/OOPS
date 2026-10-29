# A3 checkpoint: whole-book fixed place-act rows

Status: offline candidate and exact-step mapping generated; agent-verified, not
human-reviewed. No runtime integration, pack adoption, commit or push. Rules
applied: CLR1–CLR8, CLR12, AD36, AD38. Public outputs are name-free compiler,
mapper and synthetic tests; canon data and source locators stay in private
`pack-backups/`.

## Data probe

| Input | Expected | Observed | Gate |
|---|---:|---:|---|
| Target-family steps across the whole book | about 3,100 | 3,283 | no |
| Target-family steps with a resolved pack place | count | 1,888 | no |
| Resolved-place steps with extractable object wording | count | 773; 542 were unambiguous and emitted, 231 were ambiguous | no |
| H1 operation fit | existing operations | inspect, use, wash, store and take; no new engine | yes |

## Result

`build_place_acts.mjs` applies X4's ordered family rules to lead-POV M4 steps,
resolves their scene place and one concrete object, and adds only `householdActs`
to the whole-book journeys candidate. The original seven objects and nine acts
remain first and unchanged. New rows have one seeded object fact, an operation
already accepted by `definePlaceActs`, source-step identity, duration from the
step or a labelled one-minute fill, and a short paraphrased result. No stock,
price, cost or unsupported effect was inferred. Ambiguous places/objects stay
out as gaps.

The candidate adds 542 acts across all eight volumes. Row totals by family are
92 inspect/investigate, 128 observe/listen, 97 make/write, 97 handle/move,
62 read, 64 rest/personal-care and 2 change/maintain. The private report has the
full family-by-volume table and rejection counts. Of 3,283 target-family steps,
539 map to their exact act controls in the 11,159-step whole-book mapper output
(16.4%). Three candidate steps have no chapter-bounded row in the current mapper
input. Six other overlaps resolve to the exact act control, ahead of existing
journey controls.

The mapper assigns an act through its `sourceStepId`; unrelated acts at the same
place cannot be selected by lexical similarity. The private report and mapping
are candidate evidence only, not proof of runtime execution. Actor fields remain
unknown in the M4 source, and dynamic evidence, variable recipes, writing,
observation of changing events, sleep needs and broader state changes remain
typed gaps for other mechanisms.

Private outputs:

- `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/cast-whole-book-acts-candidate-2026-10-29.json`
- `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/cast-whole-book-acts-report-2026-10-29.json`
- `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/x4-whole-book-mapping-2026-10-29/resume-1/acts-mapped.json`

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/build_place_acts.test.js tests/build_replay_mapping.test.js tests/build_journeys.test.js tests/lead_replay_score.test.js` | PASS, 23 tests | Synthetic compiler, mapper and scoring only; no gameplay proof |
| `node --check scripts/lead_run/build_place_acts.mjs` | PASS | Syntax only |
| `node scripts/lead_run/build_place_acts.mjs ...` with M4 whole-book input and journeys candidate | PASS, 542 rows; 3,283 target-family steps; 8 volumes; rejection reasons recorded | Offline private-data generation; rows need coordinator/source review |
| `definePlaceActs` over the generated candidate | PASS, 551 definitions including H1's nine; all are JSON-safe and round-trip unchanged | Adapter validation, not command execution or save proof |
| `node scripts/lead_run/build_replay_mapping.mjs ... --pack <acts candidate> --from-locator 'zh 第1章' --to-locator 'zh b8 第99999章'` | PASS, 11,159 steps; 539/542 new acts map to their exact control | Three source steps have no chapter-bounded mapper row; offline only |
| `node scripts/lane_review.mjs` with explicit A3 grants and candidate paths | PASS: 2 tracked paths scanned, 2,896 private-name tokens, 0 top-level-await files, 0 outside-grant paths; canon-bearing private output hits are expected | Static publication and ownership review only |
| Full `npm test`, build, `check:arch`, desktop/browser/persistence | Not run by lane | Offline private content lane; coordinator combined gates |

No runtime UI or persistence changed, so build/browser and Save/Export/Import
checks do not apply. Pack remains private and unadopted. No file in
`private_packs/` was changed.

## Resume 1: registry rejects generated requirements

The coordinator's rebuilt desktop repro found that the acts candidate failed at
load. The registry check on the previous candidate reproduced the failure for
all 542 generated acts: each supplied `requires: []`, and `definePlaceActs`
inserted that array as an `all` child. `validatePredicate` requires a predicate
object there. The nine H1 commands installed successfully. The earlier adapter
and JSON checks missed this registry contract.

The generator now omits `requires` when there is no stated prerequisite. The
regenerated candidate has SHA-256
`b22d6829d74755187b7ec0db4729018ee062a843bdb1d49b62f036d23918393a`.
Comparing it to the previous candidate after removing those 542 empty arrays
shows no other changes. The synthetic test installs generated commands with the
host's be-seat guard through `createSimulationRegistry` and demonstrates that
the old array shape fails.

[A3_INTEGRATION.patch](A3_INTEGRATION.patch) is an optional, unapplied adapter
diagnostic for the coordinator: it rejects a non-object or array top-level act
requirement with a `TypeError` and code `PLACE_ACT_INVALID_REQUIREMENT`. The
registry remains responsible for validating nested predicates. The generator
fix does not depend on applying this patch.

| Check | Result | Gap |
|---|---|---|
| `node --test tests/build_place_acts.test.js tests/build_replay_mapping.test.js tests/build_journeys.test.js tests/lead_replay_score.test.js` | PASS, 24 tests | Synthetic tests; no browser load or gameplay |
| `node scripts/lead_run/build_place_acts.mjs` with M4 scenes/crosswalk/registry and the whole-book journeys candidate | PASS, regenerated 542 acts with prior family and volume counts | Private candidate, no adoption |
| Node `definePlaceActs` with the host's world, situation, group and be-seat guard, followed by `createSimulationRegistry({commands})` | PASS, all 551 candidate commands installed; completion predicates and JSON round trips passed | Node registry only; rebuilt browser load remains coordinator's gate |
| Node comparison of previous and regenerated candidates | PASS, only 542 empty `requires` fields removed | Structural comparison, not source or gameplay review |
| `git apply --check .../A3_INTEGRATION.patch` and disposable patched-adapter Node probe | PASS, valid synthetic row accepted and array rejected with typed code | Patch prepared only; nested validation remains in registry |
| `node scripts/lane_review.mjs` with A3 resume grants | PASS, 0 outside-grant paths or top-level-await files; 1 expected private-name hit in the private candidate | Static scope/publication review only |
| `node --check scripts/lead_run/build_place_acts.mjs` and scoped `git diff --check` | PASS | Syntax and whitespace only |

Status: candidate registry-verified, not browser-verified or human-reviewed.
Coordinator's remaining gate is to rebuild the combined candidate and repeat
the desktop load and relevant gameplay checks. No commit or `private_packs/`
write was made.
