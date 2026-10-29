# D2 resume 1: integration fixes

The coordinator applied `D2_INTEGRATION.patch` and `D2_SAVE_INTEGRATION.patch` to the shared tree (also applied: P6, P7,
H1's save fix is already committed). Two focused tests now fail in the shared tree; fix both (you own the files for this
resume, plus `tests/perspective_controls.test.js`, `src/perspective_controls.js` or wherever the family tags live,
`tests/place_acts.test.js`):

1. `tests/perspective_controls.test.js` "perspective control inventory covers shell routes and LOTM block families":
   `LOTM data family data-lotm-topic-person is tagged` fails. Tag the new topic-talk data families with the right
   perspective tag (CL243), same as H1's act families.
2. `tests/place_acts.test.js` "be-seat native pending and settled acts survive save, reload, export and import": the
   fixture applies `H1_SAVE_INTEGRATION.patch` to a disposable copy, but that hunk is already in HEAD and
   `book_world_lotm_state.js` now also carries D2's lookup, so the patch no longer applies. Update the fixture to not
   apply patches that are already integrated (check the live source first, as ON9 says), and keep the coverage.

Run `node --test tests/place_acts.test.js tests/perspective_controls.test.js tests/cast_topic_talk.test.js tests/facts_frame.test.js`
(facts_frame failed once in the full suite but passes alone; note if it is order-dependent). Append "Resume 1" to
D2_CHECKPOINT.md with one line per check. Do not commit.
