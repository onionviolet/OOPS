# P8 resume 1: the be seat on the whole-book pack crashes the page

P8 is committed (`f35fa6d4c`). The beside start with the whole-book pack passes the coordinator's floor (load 14.9-16 s, zero page errors,
Save/reload/Export/Import). The **be start** does not. Repro with headless Chrome 1920×1080 on a scratch build of HEAD with
`pack-backups/cast-whole-book-journeys-candidate-2026-10-29.json` as `private_packs/lotm-cast/cast.json`: open the Tingen panel,
pick "Begin as the lead" (`pick_be`), press `enroll_be`; the page reloads (about 8 s) and then the browser target **closes (page crash)** before the first
snapshot can be read. The replay driver sees the same as "play button never visible" after the reload (180 s). With the 204-person
candidate the same be start works (the be floor passed earlier; script copy: `be_seat_floor_probe.cjs.txt` beside this message,
edit `root` to the build dir). So something in the be-seat enrolment/reload path is eager over all 1,500 people or places (memory
blow-up or an unbounded loop): for example the enrolment's history pass, seat registration, native contexts or facts for all bodies,
`syncLotmCast` run with the be profile, or the lazy-body cutoff (256) not applying on the be path.

Do this in Node first: drive the be enrolment through the P5/P6/P8 full-game fixture with the whole-book pack (`tests/headless/cast_scale_fixture.mjs`
extended to `enrollBeFresh` and a save/reload), measure bodies created, heap and time per phase, and find the eager step. Fix with lazy creation
as P8 did (no schema change; if one is needed, stop and record). Grants: as P8 (`src/book_world_lotm_cast_host.js`,
`src/book_world_lotm_content.js`, `src/book_world_lotm_domain.js`, `src/book_world_lotm_host.js`, `src/book_world_lotm_state.js`, P8 tests/harness)
plus any be-seat module the profile points to; list each file in the checkpoint. Add a be-start case to the scale test so this
cannot recur. Append "Resume 1" to P8_CHECKPOINT.md with one line per check and a statement of what a Chrome run still has to confirm.
Do not commit.
