# CU1 resume 1: rebase on KN1 and stop patch-applying in tests

KN1 (inference) is committed after DV1, MK1 and the others; `git apply --check CU1_INTEGRATION.patch` now fails on `src/book_world_lotm_cast_host.js`, `_host.js`, `_state.js` and `tests/perspective_controls.test.js` (context moved).
1. Regenerate `CU1_INTEGRATION.patch` against the current HEAD (prove by applying to a disposable copy of HEAD; do not edit the shared host files), keeping host hunks to one registration site.
2. Your tests' disposable-copy fixtures must **not apply patches** once the integration is live; follow TH1's pattern (`TH1_CHECKPOINT.md`): run against the live source when the integration is present, and apply the patch only when it is not (a reverse-clean check), so the tests pass before and after the coordinator applies it.
3. Perspective tags for any new UI family: include the `src/perspective_controls.js` hunk and the expectation hunk in `tests/perspective_controls.test.js` in the patch.
Run `node --test tests/cast_exchange_adapter.test.js tests/cast_inference_adapter.test.js tests/cast_making_adapter.test.js tests/cast_divination_adapter.test.js tests/perspective_controls.test.js`; append "Resume 1" to MF_EXCHANGE_CHECKPOINT.md. Do not commit.
