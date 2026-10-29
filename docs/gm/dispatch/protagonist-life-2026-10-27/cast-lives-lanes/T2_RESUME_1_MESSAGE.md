# T2 resume 1: stale patch fixture

`node --test tests/cast_topic_talk.test.js` now fails with T2's edits in the tree: "prepared host and save patches round-trip native
topic jobs, choices and receipts" applies `D2_INTEGRATION.patch` and `D2_SAVE_INTEGRATION.patch` to a disposable copy, but those hunks
are committed (`79f081eb3`) and T2 touched the same files, so `git apply` fails. Same cause as the earlier place_acts fixture
(ON9: check whether the patch is already in; a reverse-clean patch is already in). Update the fixture to run against the live source
without applying integrated patches, keeping the coverage. Grants: `tests/cast_topic_talk.test.js` plus your T2 files. Re-run
`node --test tests/cast_journeys.test.js tests/cast_topic_talk.test.js tests/place_acts.test.js tests/perspective_controls.test.js`,
append "Resume 1" with one line per check to T2_CHECKPOINT.md. Do not commit.
