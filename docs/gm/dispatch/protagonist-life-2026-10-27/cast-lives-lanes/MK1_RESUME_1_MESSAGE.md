# MK1 resume 1: rebase the integration patch on DV1

DV1 (divination) is committed (`git log -1`) and touches the same host hunks as your `MK1_INTEGRATION.patch` (`src/book_world_lotm_cast_host.js`, `_host.js`, `_state.js`, `_ui.js`; `git apply --check` now fails on all four).
Regenerate `MK1_INTEGRATION.patch` against the current HEAD (apply it to a disposable copy of HEAD to prove it, then write the patch; do not edit the shared files yourself). Re-run your focused tests against that copy including
the save/reload/Export/Import case, then run `node --test tests/cast_making_adapter.test.js tests/cast_divination_adapter.test.js tests/perspective_controls.test.js`. Append "Resume 1" to MK1_CHECKPOINT.md with one line per check. Do not commit.
