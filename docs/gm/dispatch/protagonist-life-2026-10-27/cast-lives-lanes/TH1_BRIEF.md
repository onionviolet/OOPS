# Lane brief: TH1, tests stop applying prepared integration patches

Model: `gpt-6-luna`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force or push. Rules: AD36 (lean tests organized by system), CLR13.

## Why

Prepared `*_INTEGRATION.patch` files were applied to the shared tree by the coordinator, but several tests still apply those patches to a disposable copy of the source ("live or prepared" fixtures). Whenever another patch changes the same hunk
context, the older patch stops applying and its test fails even though the integration is live (it happened to D2, H1, T2, P8, DV1, MK1, and now with KN1). Patches are delivery vehicles, not part of the permanent test contract.

## Scope

- Tests that mention an integration patch (`rg -l "INTEGRATION.patch|_SAVE_INTEGRATION" tests`): `tests/cast_divination_adapter.test.js`, `tests/cast_making_adapter.test.js`, `tests/cast_inference_adapter.test.js`, `tests/cast_exchange_adapter.test.js` (CU1 is still running and owns this one until it exits: skip it),
  `tests/cast_topic_talk.test.js`, `tests/facts_frame.test.js`, `tests/place_acts.test.js`, `tests/headless/controller_wake_equivalence.test.js`, `tests/headless/cast_scale_equivalence.test.js`, `tests/headless/cast_tier_equivalence.test.js`, plus helper fixtures they share.
- For each: if the patch is integrated in HEAD (reverse-clean or its hunks already present in `src/`), remove the patch-apply branch and the fallback entirely so the fixture runs against the live source. If a patch is still unintegrated (check `git apply --check` against the working tree), leave that test alone and list it.
- Keep every assertion and coverage (UI, real save validator, Export/Import, equivalence). Do not weaken tests. Do not touch `src/`.
- Run each touched test file alone, then together: `node --test <files>`; report pass counts.
Grants: those test files and shared fixtures, `cast-lives-lanes/TH1_CHECKPOINT.md` (one line per file: what changed, pass count). Do not commit.
