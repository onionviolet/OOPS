# P8 resume 3: two tests fail after the lazy quoting and the V2 seed patch

Browser check passed: with the acts candidate (1,500 people, 616 journeys, 551 acts) the be seat now runs about 1 s per natural game minute
(31 game minutes in 20 s) and enrols/reloads in 9.5 s. The full suite on the working tree is 3988/3990; fix the two failures (you own the files for this resume):

1. `tests/cast_topic_talk.test.js` test 7 "live host and save validator round-trip native topic jobs, choices and receipts": the worker asserts
   `button('book.lotm.fixture_away.ask').disabled === true, 'place gate is shown'` but the control is null because remote controls are no longer
   quoted until the player is at their place (your change). Per the design, an unavailable-because-elsewhere topic is shown disabled with its away reason when
   the person is known and the place is the player's district or the topic's person is in the current panel; decide the rule that keeps the shown
   behavior for topic talks (D2's UI rule: a person in the panel lists their topics with the away reason) while remote journeys and acts stay lazy.
   If topic talks are cheap (13-64 rows), quote them all as before; restrict laziness to journeys and place acts. Update the test only if the rule
   deliberately changed, and say which.
2. `tests/native_save_fixtures.test.js` test 1 (CN11): `assert.ok(source.includes('createExpansionState(crypto.getRandomValues(new Uint32Array(1))[0])'))`
   fails because V2's committed seed patch (`ca1985737`, loopback-only fixed seed for the fresh be probe) changed that line to
   `createExpansionState(replaySeed ?? crypto.getRandomValues(new Uint32Array(1))[0])`. Update the pinned source expectation to the new line (keep the intent: the
   default seed is `crypto.getRandomValues`).
Run `node --test tests/cast_topic_talk.test.js tests/native_save_fixtures.test.js tests/cast_whole_book_scale.test.js tests/place_acts.test.js tests/cast_journeys.test.js`. Append "Resume 3" to P8_CHECKPOINT.md. Do not commit.
