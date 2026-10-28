# L4a brief: the cast lives in Tingen (host wiring, start, location, save)

Model: `gpt-6.1-sol`, medium effort (runtime, save-touching, cross-system ordering). Runs locally in
`/Users/weiwei/code/yet-another-idle-rpg`. Starts when [L3_CHECKPOINT.md](L3_CHECKPOINT.md) reports done.
Plan: [CAST_LIVES_PLAN_2026-10-28](../CAST_LIVES_PLAN_2026-10-28.md) sections 2.3, 3.1, 6 (D1-D3),
8.3, 9.5 (CL48, CL49), 12-14. Rules: `.claude/rules/runtime-code.md`, AR1-AR16, AD36, AD43, WER, WA24.
Do not commit: the Codex sandbox cannot write `.git`; the coordinating session runs the full suite and
commits. Never stash, reset, force or push.

## Goal (PRF1)

A new LOTM start, "beside the lead", in which the cast from `src/book_world_lotm_cast.js` lives in
Tingen: each cast person is where their schedule puts them at the current time, and asking someone who
is away fails with when and where they will be back. The existing three starts behave exactly as before.

## Player sentence (PRF2)

At the start menu: a fourth Tingen start whose blurb says you live near the lead's household as an
ordinary resident. In Tingen: a cast person present at your place can be talked to; one who is away
gives "Away; usually back by [band] at [place]".

## Seam (AR14) and the decisions already made

- **Start profile and continuity (D1):** add `beside` to `LOTM_PROFILES` (`src/book_world_lotm_lives.js`)
  and enroll the cast people in `enrollLotmBranch` (`src/book_world_lotm_content.js`) only for that
  profile, with situation continuity `book.lotm.tingen.canon_beside`. The other profiles enroll exactly
  the people they enroll today.
- **Compatibility decision (AGENTS.md safety, AR6):** additive. A new start option and new people in new
  lives only; no change to any existing save's shape or behavior; no migration needed. State this in the
  checkpoint and test it: an existing-profile enroll produces the same people set as before.
- **One location authority (AR3):** `simulation.people[id].location` stays the only store. A host sync
  (one function in a new `src/book_world_lotm_cast_host.js`) sets each cast person's location from
  `whereabouts()` in `src/cast_schedule.js`, applied to the plan state inside the host's existing
  `act` and `move` paths before preview and commit, and in its existing `tick`. A person with no active
  row keeps their last place, marked away for the gate. No second clock, no new save field for location.
- **Calendar without a start month:** the LOTM start month is an open question for Weibao (implementation
  prompt D3), so do not add a dated Tingen calendar profile. Day index is
  `floor((state.clock - state.lotm.initializedAt) / 1440) + 1`; minute of day is the clock offset from
  the profile's start time. Build the calendar object `cast_schedule` reads from those two numbers.
- **The consumer (FLR4):** the existing co-location gate (`src/simulation_resolution.js:115-127`) already
  refuses a talk when the target is elsewhere. Add one talk command per principal (`targetId` the cast
  person, `coLocated: true`) whose refusal reason, when away, is the `awayReason()` sentence. Reuse the
  LOTM command kit (`cmd` in `book_world_lotm_kit.js`); the talk writes a knowledge note of what you saw.
- **Fate and canon (D3, CL21-CL25):** no locks, no weight use, no beats in this lane (L4b owns beats).

## Owned files

`src/book_world_lotm_cast_host.js` (new), `tests/lotm_cast_week.test.js` (new), and minimal hunks in
`src/book_world_lotm_lives.js`, `src/book_world_lotm_content.js`, `src/book_world_lotm_host.js` (the
sync call sites only). Any start-menu label change goes through the existing start UI data, not a new
panel. No `main.js`, `save_files.js` or `display.js` line unless the start list requires one, paid for
under AR1.

## Done check (AD43 floor; report each line)

- FLR1 build: `npm run build` passes; name the bundle hash.
- Focused: `node --test tests/lotm_cast_week.test.js` covers: beside start enrolls the cast; old starts
  enroll unchanged sets; a principal moves between two places across a day by schedule; talking while
  they are away is refused with the away sentence; save, reload, Export and Import keep their positions
  (they are recomputed from the clock, so reload must give the same place).
- FLR2 route: from a fresh life, Village to the beside start to meeting two cast people at different
  places at different times, through the MCP (`yairpg-game`) or the headless driver; name the route.
- FLR3 shown, FLR5 kept: rebuilt browser at 1920×1080 from a fresh origin: screenshot of a present
  person's talk action and of the away refusal; save, reload, Export, Import exercised.
- If the sandbox blocks the browser or the MCP, say so; the coordinating session runs FLR2, FLR3 and
  FLR5 on the rebuilt bundle.
- `npm run check:arch` no growth; `npm run check:rules` pass. A missing line means "implemented, below
  floor", stated as such.

## Stop and report if

The host has no single place to apply the sync before both preview and commit, the start list needs a
core-file change beyond one line, or any existing-profile test changes.
