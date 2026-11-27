# R1 shared terms and timing

Proposal under AD32. Engine and coverage lane for the existing item-bound and area-field laws.

| Preflight | Scope |
|---|---|
| Reading and authority | Execute the R1 brief under the shared-rules README and Weibao's authorization to work on missing shared rules. |
| Player sentence and ordinary route | This lane proves engine fixtures, not a player route. A fixed field acts in its place. A carried field resolves the carrier's place when it fires. |
| Mechanism and fit | PSA28 and PWC55 compose existing W acts through the effect host and keep timing in stored workings (SW1–SW12). |
| Ring and rules | Shared term producer, item and area case consumers, timing and target failures. AD36, AR10/14/16, EF3 and PWC60. |
| Files | R1 law modules, their focused tests, PSA28 dry-run script and generated law results, and this report. Area attach and ledgers are conditional on PWC60. |
| Failure and checks | A pulse fires early or outside the area, or a ward affects the wrong account. Check actual world observations with the existing case runner, then run coverage, architecture and rules. |

## Result

F1. The area-field dry run took **476 of 2,933 rows (16.2%)** through 112 distinct cases. The previous receipt was **245 of 2,921 (8.4%)**. The previous terms and times still account for 245 taken rows on the current corpus. The holdout took 85 of 571 rows. The denominator now counts blocked holdout rows as well as runnable ones.

D1. PWC60 requires 25%. Area-field remains a spec and moved zero ledger rows. The generated report also refreshed the form-transformation counts from the current corpus.

F2. The shared table now covers moving positions and altering their wards, creating, damaging, moving and concealing things, and blocking or ending named world effects. Removal uses the existing physical condition-loss act. Ending uses a named, already installed ward. Moisture is the humidity quantity in W, with no moisture property for a transform. Force terms belong to R2.

F3. Nine delayed rows and 23 triggered rows ran. A delayed working fires once 600 world minutes after storage. The triggered case uses an arrival event at the field's current place as an authored default. The spec also accepts a word trigger, exercised with a wrong word and a repeated correct word. The arrival and delayed cases exercise engine serialization and restore before firing. Four sustained creation rows still need a distinct output identity per pulse. Repeated ward tests pulse in separate world minutes because W keys default block fields by scope, object, verb and minute.

### Largest misses

| Reason | Rows |
|---|---:|
| No stated sentence | 1,293 |
| Read as outside area-field | 278 |
| No account for `add.force` | 189 |
| No account for `alter.mind` | 72 |
| No account for `block.force` | 71 |
| `none` has no pulse model | 66 |
| No account for `alter.force` | 60 |
| No account for `conceal.light` | 23 |
| No account for `block.working` | 22 |
| No account for `alter.law` | 22 |

The JSON receipt contains the full list.

## Files and checks

| Files | Change |
|---|---|
| `src/item_bound_law.js`, `src/area_field_law.js` | Shared world terms, authored cases and stored-working timing |
| `scripts/law_defaults.mjs`, `docs/coverage/fields/law_take.json`, `docs/coverage/derivation_rules.json` | Composition, dry-run receipt and updated area time-default score |
| `tests/item_bound_law.test.js`, `tests/area_field_law.test.js`, `tests/law_defaults.test.js` | World observations and timing regressions |
| `r1/REPORT.md` | Lane receipt |

| Command | Exit | Result and gaps |
|---|---:|---|
| `node scripts/law_defaults.mjs --write` | 0 | 476 rows taken. The area catalogue remains below the 25% gate. |
| `node --test tests/item_bound_law.test.js tests/area_field_law.test.js tests/form_transformation_law.test.js tests/law_defaults.test.js` | 0 | 18 passed. Includes term and pattern matrices, wards, delayed restore, arrival and word. |
| `npm run -s check:coverage` | 0 | Passed across 224 ledgers. |
| `npm run -s check:arch` | 0 | Passed with grandfathered imports and cycles. |
| `npm run -s check:rules` | 0 | Nine nonblocking warnings outside R1 paths, two known continuity findings and one stale glob. |
| `git diff --check` scoped to tracked R1 paths | 0 | Passed. |

FLR1–FLR6. Agent-verified engine fixtures under AD32, pending human review. The case runner exercised world effects and existing record serialization. There is no player route in this lane, so browser build, UI and player save/export/import proof remain below the AD43 floor. The lane adds no save schema, composition-root registration or cycle edge.
