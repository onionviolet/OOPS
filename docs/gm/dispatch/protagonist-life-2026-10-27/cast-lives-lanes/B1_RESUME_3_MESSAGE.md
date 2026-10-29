# B1 round 3 (coordinator review, 2026-10-28)

Review so far: focused tests pass (35/35 after the coordinator updated `tests/seat_profiles.test.js` for the sixth
profile: the be seat is excluded from the "allows every route" check by design); `lane_review` clean; no canon terms
in added public lines; `B1_INTEGRATION.patch` **is now applied** in the working tree. You now own its hunks in
`src/main.js`, `src/import_probe.js`, `src/book_world_lotm_envelope.js` and `src/book_world_lotm_domain.js`, plus
`tests/seat_profiles.test.js`. The isolated build matched your bundle hash `11520d97…`.

The browser floor at 1920×1080 (fresh origin, headless) found these. Fix all three in this round.

**F1. The be start never happens.** "Be [lead]" → "Start this new life" does nothing visible. The detached probe
fails with `This tab cannot commit expeditions.`, thrown by the general persist guard in `src/main.js` (the
`!ownsSave || importProbeToken || ...` check before `persistExpansionPlan`), reached through
`enrollBeFresh → host.enroll → persist`. Your `writable` change covers the LOTM port only. Let the probe persist
into its captured envelope (the guard must still refuse every other import-probe write), then confirm the parent
publishes and reloads into the be life.

**F2. The failure is silent.** The probe error goes only to the console; the player sees no message and the start
list stays. Show the refusal reason in the panel (UR70-UR75: what failed, that the current save is kept).

**F3. `npm run check:arch` fails: `src/main.js` 10126 lines against baseline 10115.** AR1: `main.js` is a
composition root. Move the fresh-life route (`startFreshLife`, the be pack hold in `load`, the probe capture and the
Menu "Start a new life" button) into a new module (for example `src/fresh_life_start.js`) built from a ports
object, with at most one registration line in `main.js`, so `main.js` ends at or under its baseline. Behavior
unchanged otherwise (AR9). Record the known limit and expected refactor in the checkpoint (AD45).

Also, small: the Tingen intro above the start list says "Pick a life ... before you cross". With the be start
selected, use wording that matches a new independent life (CL240), not crossing.

Then run `node --test tests/lotm_be_seat.test.js tests/seat_profiles.test.js`, `npm run check:arch`, and rebuild
into `BUILD_OUT=/tmp/yairpg-b1`. The coordinator reruns the floor script (start, menus, reload, pack-absent) after
you report. Same rules: do not commit; canon names stay in the pack; update `B1_CHECKPOINT.md`.
