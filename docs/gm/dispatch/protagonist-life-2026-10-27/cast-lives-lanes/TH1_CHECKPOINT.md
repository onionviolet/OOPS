# TH1 checkpoint: integration patches are not test fixtures

Scope: AD36, CLR13. Tests now exercise integrations already present in the live
source tree. Prepared patch reconstruction remains only for D2_LOAD, which is
still unapplied to the shared source.

## Per-file checks

- `tests/cast_divination_adapter.test.js`: removed DV1/MK1 patch probing and
  fallback; `node --test` passed 5/5. Native UI, validator, save/reload and
  Export/Import coverage passed.
- `tests/cast_making_adapter.test.js`: removed MK1 patch probing and fallback;
  `node --test` passed 4/4. Native validator and persistence coverage passed.
- `tests/cast_inference_adapter.test.js`: removed KN1 patch application and
  reverse check; `node --test` passed 5/5. Native validator and persistence
  coverage passed.
- `tests/cast_exchange_adapter.test.js`: skipped; CU1 owns this test while its
  lane is active.
- `tests/cast_topic_talk.test.js`: unchanged. D2_LOAD remains prepared:
  `git apply --check docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/D2_LOAD_INTEGRATION.patch`
  succeeds against the working tree. Standalone `node --test` passed 7/7 with
  the fixture applying that still-unintegrated patch for malformed-pack recovery.
- `tests/facts_frame.test.js`: removed P3 patch parsing and live/prepared
  fallback; standalone `node --test` had a `create_save` byte mismatch in the
  fresh-life scenario. In the combined run its frame-on/off fixtures passed
  9/9. The standalone discrepancy remains unresolved under CLR13.
- `tests/place_acts.test.js`: removed H1_SAVE validator patch fallback;
  `node --test` passed 5/5, including native save/reload/Export/Import.
- `tests/headless/controller_wake_equivalence.test.js`: removed P5 patch
  application; after snapshot now uses current source. `node --test` passed
  5/5; all four scenarios retained state/save equality in both clock modes.
- `tests/headless/cast_scale_equivalence.test.js`: removed P8 patch application;
  before/after snapshots use frozen baseline/current source. `node --test`
  passed 3, skipped 1 because `YAIRPG_SCALE_BASELINE` is unset. Natural-minute
  ratio was 1.615, within the existing budget.
- `tests/headless/cast_tier_equivalence.test.js`: removed P6 patch application;
  before/after snapshots use frozen baseline/current source. `node --test`
  passed 2, skipped 1 because `YAIRPG_TIER_BASELINE` is unset.

## Combined check

- `node --test tests/cast_divination_adapter.test.js tests/cast_making_adapter.test.js tests/cast_inference_adapter.test.js tests/cast_topic_talk.test.js tests/facts_frame.test.js tests/place_acts.test.js tests/headless/controller_wake_equivalence.test.js tests/headless/cast_scale_equivalence.test.js tests/headless/cast_tier_equivalence.test.js`:
  passed 45, failed 0, skipped 2 (47 total). The two skips are the scale and
  tier frozen-baseline comparisons above. The facts-frame fixture passed in this
  run; its standalone byte mismatch remains open.

## Patch applicability

- Forward `git apply --check` fails for DV1, MK1, KN1, P3, H1_SAVE, P5, P8 and
  P6 against the working tree, consistent with already-integrated or overlapping
  hunks. Their live-source tests passed as recorded above.
- D2_LOAD is still applicable and its test was left unchanged.
- No runtime source was changed. All outcomes are test evidence only; the full
  suite and commit remain with the coordinator.
