# Windows source-reader portability repair

Status: focused repair verified; existing heavy consumer walk bounded below. No full-suite rerun, commit or push.

## Guarded tooling residue, November 25

The parent assigned failures 10, 15 and 18 in `%TEMP%/oops-resumed-residue-20261125.log`. All three reproduced with `node --test --test-name-pattern='synthetic cast name|master moves underneath|commits only my hunk' tests/lane_review.test.js tests/merge_queue.test.js tests/own_hunks.test.js` before editing.

| Defect | Repair and preserved boundary |
|---|---|
| Cast-name review found no private names because its pack selector assumed forward slashes. Its CLI entry check also treated a file URL pathname as a native path. | Normalize the selector's comparison path and decode the CLI URL with `fileURLToPath`. A synthetic-name fixture verifies both imported and CLI rejection; private cast data stays local. |
| Own-hunks comparison spawned an absent Unix `diff`, then wrote undefined output. | Use the existing Git dependency's `diff --no-index`, check its status, and label its patch for the requested file. Application remains `git apply --cached --recount`; missing snapshots and colliding hunks still refuse. Tests verify a second session's edit remains uncommitted and paths with spaces work. |
| The moving-master fixture inserted a Windows path into a JSON string without escaping it, so npm stopped at `EJSONPARSE` before the race. | A committed Node fixture invokes Git with an argument array. The real merge queue reaches its guarded update and refuses the moving master; the racing commit survives, primary files stay untouched, and a staged primary index also refuses. The production merge queue is unchanged. |

| Check | Result |
|---|---|
| `node --test tests/lane_review.test.js tests/own_hunks.test.js` | 6/6 passed, including imported/CLI synthetic-name rejection, unrelated-hunk preservation, missing-snapshot/collision refusal and spaced paths. |
| `node --test --test-name-pattern='master moves underneath' tests/merge_queue.test.js` | 1/1 passed, exercising both moving-master and staged-index refusals. |
| `git diff --check` on the five changed utility/test paths | Passed. |
| `npm run check:docs` | Passed, no new hits after the audit update. |

Own-hunks fixtures now register teardown, including failed assertions. Task-created fixture repositories were removed after inspection. Older unclaimed `ownh-*` fixtures remain outside this task. No primary-checkout commit was created; fixture-only commits exercise the guarded tools. No full suite or gameplay build was needed for these tooling repairs.

## Preflight

| Field | Scope |
|---|---|
| Reading | Repair reproduced file-URL, source-ID and line-ending failures from the resumed Windows suite, preserving game behavior and reviewed expectations. |
| Authority | Parent's bounded repair instruction; AD36 focused verification; AR14 existing owners. |
| Player sentence / ordinary route | n/a: tooling and test-fixture readers, with no player text or interaction change. |
| Mechanism | Decode file URLs with Node's native helper, keep filesystem paths native, normalize public relative source IDs, accept both Markdown line endings, and preserve reviewed byte digests with scoped LF attributes. |
| Fit | Existing books ledger, rule-route parser, reachability reporter and procedural-grammar fixture reader. |
| Ring | Producer/consumer and failure regressions; persistence and UI n/a because runtime behavior and saves are unchanged. |
| Files | Scoped script/test changes listed below; preserve shared dirty files and the preexisting Ink attribute hunk. No mechanics or golden expectation changes. |
| Failure scenario and checks | Windows file URLs create a doubled drive; CRLF prevents frontmatter/table headings from matching; native separators disagree with stable report IDs; CRLF checkout changes immutable reviewed hashes. Reproduce in the six original failing test files, then exercise direct effect-reader consumers. |

## Changes

- **F1 Paths:** `scripts/books_power_ledger.mjs` uses `fileURLToPath`; `scripts/reachable.mjs` exports a stable relative source-ID formatter while retaining native absolute paths in its reachable set. Coverage/report and effects-workshop tests use the correct distinction.
- **F2 Readers:** `scripts/rule_routes.mjs` accepts CRLF frontmatter and Windows input separators. `tests/fixtures/procedural_grammar/effect_worlds.mjs` accepts CRLF table headings. Added regression cases for both. Grammar, spell and mechanism definitions are unchanged.
- **F3 Bytes:** `.gitattributes` pins `tests/fixtures/invention_qa/v1/*.json` and `src/data/invention_pack_home.js` to LF. Their current working copies were normalized. Existing manifest hashes and expected values are unchanged; normalized fixture/source files have no content diff. The separate Ink LF lines predated this lane and were preserved.

The existing reviewed LF SHA-256 values still match: input `7bd7a80d55b4343b419c9a386555605b30cc67bea42af677d45f4abc85849caf`, golden `e557eee5ecfff10d26d04d3766583814425c52d107cf3958d695a9cf667b6a05`, invention pack `c0a6305606a880b43fb683415aaa39f69b13888b2c3f0e2b6ca4739a097aa10e`.

## Checks

| Command / evidence | Result | Gap |
|---|---|---|
| `node --test tests/books_powers_a.test.js tests/coverage_report.test.js tests/rule_routes.test.js tests/effects_workshop.test.js tests/grammar_search.test.js tests/invention_planner_golden.test.js` before repair | 39/45 passed, six failures reproduced | Books module failed during import. |
| Same six-file command after repair | **64/64 passed**, about 49 seconds | Count includes the recovered books module and two added regressions. |
| `node scripts/rule_routes.mjs --for src/heat.js` | Passed: runtime AR and standing STN routes returned | No rule content changed. |
| Scoped `git diff --check` | Passed | No unrelated paths checked or altered. |
| `node --test tests/effect_grammar.test.js tests/effect_host.test.js tests/hp_effect_pack.test.js tests/contest_consumers.test.js` | 31 passing results observed, including the former EF1/GL2/canon-reader failures; **group incomplete** | Stopped the verified owned test process tree after about six minutes; `hp_effect_pack` remained in its existing large case/ledger walk without a file result. No assertion failure emitted. No timeout threshold or spell test changed. |
| `node --test tests/effect_grammar.test.js tests/effect_host.test.js tests/contest_consumers.test.js` | **31/31 passed**, about 20 seconds | Isolated the three completed consumer files from the heavy check to obtain their final aggregate result. |

## Remaining suite failures outside this repair

The original log is `%TEMP%/oops-resumed-full-20261125.log`. Browser journey timeouts, hardcoded Mac Playwright imports in native browser harnesses, the alloy fixture-main/esbuild namespace failure and Windows signal/slot tests are separate host or heavy-test work. They were not skipped, reclassified as passes or changed here. Weather VM extraction is repaired in the follow-on below. No full suite was rerun. This tooling/test-reader repair makes no new playable acceptance claim; existing gameplay proof remains separate.

Changed source/test paths: `.gitattributes`, `scripts/books_power_ledger.mjs`, `scripts/reachable.mjs`, `scripts/rule_routes.mjs`, `tests/coverage_report.test.js`, `tests/effects_workshop.test.js`, `tests/rule_routes.test.js`, `tests/grammar_search.test.js`, `tests/fixtures/procedural_grammar/effect_worlds.mjs`. Temporary regression fixtures remove themselves in `finally`.

## Follow-on: combat, weather, equipment and Village source extraction

Bounded authority: reproduce the four gameplay-labelled suite failures and repair the actual owner without changing intended mechanics or assertions. AR14/AD36 apply. The failure scenario is source extraction retaining imports or missing anchors under CRLF. Runtime and player UI are out of this repair because the reproduced defects occur before those consumers execute.

**F4:** All nine reproduced failures were source-reading defects: six combat VM fixtures retained module imports, the climate comparison retained weather imports, the equipment fixture missed Hero's method closing line, and the Village table reader missed the fresh-life inventory anchor. The Village failure falsely reported the market as the first bread route even though the fresh-life source supplies five loaves. All four readers now reuse the existing `readCanonicalText` helper before their unchanged extraction. No source gameplay, balance, assertions or expected values changed.

Additional owned paths: `scripts/village_supply_tables.mjs`, `tests/combat_options.test.js`, `tests/world_climate.test.js`, `tests/structured_equipment_runtime.test.js`. The existing canonical helper was reused without modification; active gameplay lanes were untouched.

| Command / evidence | Result | Gap |
|---|---|---|
| `node --test tests/combat_options.test.js tests/world_climate.test.js tests/village_obtainability.test.js tests/structured_equipment_runtime.test.js` before repair | 28/37 passed; all nine failures reproduced | Extraction failures, not observed native gameplay failures. |
| Same four-file command after repair | **37/37 passed**, about five seconds | Includes native strike/armor, one-time defeat reward, ammo/break/smoke/resume/cooldown checks; full seasonal weather comparison; exact Hero equipment effect consumer; live Village source tables. |
| Scoped `git diff --check` | Passed | Four changed reader/test files. |
| `node --test tests/village_traveler_asks.test.js tests/traveler_lint_hint.test.js` | **6/6 passed**, about 21 seconds | Immediate table-reader consumers; reachability, price/fees, knowledge hints and replay checked. |

No rebuild or player-facing smoke was needed: runtime code and behavior are unchanged. These are native source/fixture checks, not browser gameplay claims. No full suite rerun, commit, push, server or saved-game artifact.

## Follow-on: Windows flow-check staging

Bounded authority: repair the existing `check:flow` Windows staging EPERM while preserving identical build/fixture inputs, then run its normal command. Existing flow checks and finding baselines remain unchanged (AD36, UR33, UR139–UR146).

**F5:** `scripts/perf/lib.mjs` now uses the existing fixture staging utility's policy for the dependency directory: a Windows junction to the same `node_modules`, with the original symlink behavior elsewhere. `tests/helpers/fixture_fs.mjs` gains a synchronous companion because `prepareTree` is synchronous; its test exercises synchronous file/directory input identity and cleanup alongside the existing async route. `scripts/check_flow.mjs` decodes its repository file URL before loading the unchanged perf fixture. No inputs or runtime/gameplay source were replaced.

| Command / evidence | Result | Gap |
|---|---|---|
| `node --test tests/fixture_fs.test.js` | **1/1 passed** | Both staging APIs read the same source bytes and cleanup leaves source intact. |
| `npm run check:flow`, first repaired attempt | Staging/build and headless launch succeeded; **interrupted** | Stopped verified owned node 93356 and its child browser tree after about three minutes. Browser child identity had changed, so this is evidence of progress, not a proven stall. The bound was premature for played-days/rain states; normal-command retry follows. No finding baseline changed. |
| `npm run check:flow`, retry | Staging/build and headless launch succeeded; **full flow incomplete** | Bounded at about eleven minutes without aggregate output. Node CPU remained 7.65 seconds for several minutes; last CIM browser record was absent from native process lookup. Stopped verified owned node 21420. The remaining browser lifecycle wait needs separate diagnosis; no flow finding or test expectation was suppressed. |
| `npm run check:docs` after line-55 correction | Passed, no new hits | Corrected the reported wording. |
| `npm run check:docs` at final receipt update | Failed on two concurrently added documents | `ORDINARY_WORK_REPEAT_2026-11-25.md:26` and `WINDOWS_NATIVE_CAST_ACCEPTANCE_2026-11-25.md:9` have absolute-rule wording; this receipt emits no hit. Owners notified. |
| `npm run check:rules` | Passed | Existing warning-only rule lints and absent private-pack glob remain. |

Failed-run scratch retained for diagnosis: `C:/Users/wayba/AppData/Local/Temp/yairpg-flow-c9MXkW` (created 14:49:56 local) and retry `C:/Users/wayba/AppData/Local/Temp/yairpg-flow-pg8J0K` (14:53:29). These contain copied builds, not player saves. The older `yairpg-flow-uNaeLF` predates this lane and was left untouched. No lane process remains. Additional owned paths: `scripts/perf/lib.mjs`, `scripts/check_flow.mjs`, the sync companion/test hunks in `tests/helpers/fixture_fs.mjs` and `tests/fixture_fs.test.js`.
