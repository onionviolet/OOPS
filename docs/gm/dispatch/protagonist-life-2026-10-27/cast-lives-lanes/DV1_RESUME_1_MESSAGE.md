# DV1 resume 1: the integration-patch fixture fails now that the patch is integrated

DV1 is committed (`3ece3baf2`) with the integration patch applied to the shared tree. `tests/cast_divination_adapter.test.js` test 5, "prepared integration patch crosses native UI and real save validator in a disposable copy",
now fails because it applies `DV1_INTEGRATION.patch` (already integrated) to its disposable copy. Same as the earlier D2/H1 fixtures (ON9: a reverse-clean patch is already in): make the fixture run against the live source, applying a patch only if it is not
already integrated (check with `git apply -R --check`), keep the coverage (UI, real save validator, Export/Import). Note MK1 is rebasing its own patch on this commit in parallel; do not touch its files.
Run `node --test tests/cast_divination_adapter.test.js tests/perspective_controls.test.js`. Append "Resume 1" to DV1_CHECKPOINT.md. Do not commit.
