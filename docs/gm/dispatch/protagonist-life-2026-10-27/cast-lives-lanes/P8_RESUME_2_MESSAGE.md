# P8 resume 2: the be seat is about 10 s per game minute with the whole-book acts pack

Committed: P8 resume 1 (`2c6b289f1`). With the build of that HEAD and `pack-backups/cast-whole-book-acts-candidate-2026-10-29.json`
(1,500 people, 1,516 places, 616 journeys, 551 household acts) as the scratch build's pack:
- Beside start floor passes: load 21.7 s, 2,268 ms per natural game minute, 349-minute wait 50.8 s, zero page errors.
- **Be start** now enrols, reloads and reads its snapshot, but then natural play advances only **10 game minutes in 90 s (about 9.7 s per
  minute; 0 minutes in the first 20 s)**, and `page.screenshot` times out at 30 s (main thread busy). With the 204-person candidate
  the be life runs at normal speed. DOM is not the problem (about 12,000 nodes, 657 lotm controls).
So the be seat's per-minute (and first-render) work scales with journeys and acts, or with something else the be profile
does each tick that the beside profile does not.

Find it in Node with the P5-P8 full-game fixture (`enrollBeFresh`, then 60 natural minutes, with the acts candidate vs the 204-person
candidate): per-phase cost per minute (quote/preview of every journey and act control, `lotmFacts`, `knownPeopleView`,
panel view model, `pendingPlaceActReports`/`pendingTopicTalkReports`/journey reports, `quotePlaceActs`, `castSettledPeople`, any
loop that quotes all 1,167 pack commands per tick or per render). Make quotes lazy: a control is quoted only when its place is the
player's place, its origin is the player's place, or it is the pending job; previews for other places cost nothing until the player is there. Keep
outputs identical for the controls that are visible (same ids, labels, costs, reasons). No saved-schema change; if needed stop
and record. Grants: as P8 resume 1 plus `src/book_world_lotm_ui.js`, `src/place_acts.js`, `src/cast_journeys.js`, `src/cast_topic_talk.js` for
measured cost only. Add a be-start natural-minutes case to the scale test with a budget (for example under 3x the 204-person candidate)
so this cannot recur. Target: be-seat natural minute within 1.5x of the 204-person candidate with the same load. Append "Resume 2" to
P8_CHECKPOINT.md with before/after tables and one line per check. Do not commit.
