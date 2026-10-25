# O4 body and heir journey, 2026-10-23

Status: **bounded journey and both persistence boundaries PASS**. No gameplay source changed. Coordinator retains shared checkpoint, runtime, combined gates and consolidation. O4 changes are `o4-browser.cjs`, this report and `evidence/o4-*` outputs. No commit, push, app installation or personal-save access.

Authority: [task checkpoint](CHECKPOINT.md), [PROJECT](../../../../PROJECT.md), [rules index](../../../RULES_INDEX.md). Applies AD11/13/33/36/38/41, BHR3/29, SLR20/31, AR6/10/16 and UR35/41–46. Existing Notebook Practice/Here/People surfaces; 1920×1080 browser target. Mobile and additional desktop/text matrix are outside this bounded O4 continuation and remain with combined UI verification.

## Harness correction and observed outcome

- **F1:** Native heir succession completed but its normal-URL navigation removed the localhost test-hook query. The harness now preserves the actual native Begin an heir action, reloads the same origin with `test_hooks=1` inside its new isolated browser context, and asserts the native heir save is byte-identical across that test-only reload. Gameplay navigation is unchanged.
- **F2:** The old purse assertion omitted the heir's own 102 starting coins (`src/main.js`, new-game branch). The estate records 4,999 coins; the heir has exactly 5,101. Assertions separately check the inherited amount and resulting purse. The exact worked-gear instance, including temper history and stats, is unchanged across inheritance. Discovered IDs persist; the heir starts at age 18 with a live generation-2 chronicle, without Weathered Skin, the cold-soak knowledge row or the old focus reserve.
- **F3:** Real body enrollment, three completed cold soaks and the earned Weathered Skin command precede a consenting clay-body entry. The earning-body faculty predicate is active before entry, inactive while borrowed and active after return; knowledge, exact inventory and energy are retained. Both the borrowed state and heir state pass native Save, reload, real Export download and literal-file Import. The chronicle is enrolled natively; only remaining age is accelerated in a generated fixture to reach its mortal boundary. No natural multi-decade aging claim is made.

## Evidence and input identity

Passing directory: [o4-body-and-heir-0BBN65](evidence/o4-body-and-heir-0BBN65/). [PASS manifest](evidence/o4-body-and-heir-0BBN65/o4-body-and-heir.json); [input hashes](evidence/o4-body-and-heir-0BBN65/o4-inputs.json). The manifest records zero page errors. Recorded files are hashed before and after the journey; every loaded bundle response and final served bundle match the local bundle.

Input export: `evidence/o1-focus-workshop-Nc1Np6/focus-tempered-gear.save.txt`, SHA-256 `18db9867e7996c69bef1a1d906e85524e7ce1d54ff48aefac2b7aa5f8145ddf9`.

Served/local bundle SHA-256: `e7ca5a704772147ee629f2f03123c6ae6d6c6f10cfe84cbe0b13a6cf3126e814`. Harness SHA-256: `49dc9f1163a92db2423560322a1663bf53dac77fbefbee80e5e6d079f635445b`. Other recorded source/helper hashes are in `o4-inputs.json`; relevant inputs stayed unchanged during this run. Build was already rebuilt by the coordinator; this lane did not rebuild or alter shared `dist/`.

1920×1080 captures: [earned practice](evidence/o4-body-and-heir-0BBN65/o4-earned-weathered-skin-1920x1080.png), [consenting borrowed body](evidence/o4-body-and-heir-0BBN65/o4-consenting-borrowed-body-1920x1080.png), [native estate preview](evidence/o4-body-and-heir-0BBN65/o4-ended-life-estate-preview-1920x1080.png), [heir after persistence](evidence/o4-body-and-heir-0BBN65/o4-heir-estate-fresh-body-1920x1080.png). Estate and final heir captures were visually inspected. Saved exports in this directory are task-generated.

## Checks, one line each

- `node --check docs/gm/dispatch/complementary-journeys-2026-10-23/o4-browser.cjs`: PASS, harness syntax.
- `O1_SAVE=docs/gm/dispatch/complementary-journeys-2026-10-23/evidence/o1-focus-workshop-Nc1Np6/focus-tempered-gear.save.txt URL=http://127.0.0.1:8743/ YAIRPG_PROOF_DIR=docs/gm/dispatch/complementary-journeys-2026-10-23/evidence node docs/gm/dispatch/complementary-journeys-2026-10-23/o4-browser.cjs`: PASS, bounded native journey plus both Save/reload/Export/literal Import boundaries; `/tmp/yair-o4-continuation.log`.
- `node --test tests/body_progression.test.js tests/lives_carry_codex.test.js`: inherited 15/15 PASS from coordinator checkpoint for unchanged body/codex source; not rerun in this harness-only continuation. Storm-gust stamina/temperature effects are unit evidence, not exercised as a browser storm in O4.
- Combined build, full suite, architecture and rules checks: coordinator/O5 owned, not rerun here; O4 makes no whole-checkout gate claim.

## Exact remaining gaps

**R1:** The existing native estate preview renders a worked-gear key as raw serialized component/gearwork data in the belongings line. It is visibly awkward and can overflow the preview line. `heir_inheritance.js:itemLabel` understands a top-level `id`, while this gear key uses `components`; correction needs explicit runtime seam ownership. No estate-label source was edited. This does not prevent inheritance or persistence, which passed. Human visual/pacing acceptance remains open.

Earlier failed evidence is retained: `o4-body-and-heir-mrffkg` reached the heir but failed the incorrect estate-only purse assertion; prior `cXLHms`/`eaYR4l` runs are superseded by the passing directory. The local server was left running for the coordinator.
