# Wave 17: day budget and coupling report (E4, E8)

Proposal, 2026-11-12. Branch `fable/w17-budget`. Nothing here is an accepted decision.

## E4: the shell regulator's rate form

What was wrong: the mixed engine day cost 799 of 800 segments. The shell regulator cut the settlement at every pull, every delayed draft and every threshold crossing, about eight cuts per 14-minute wave, all day.

What changed:

- `src/world_substrate_packs/shell_regulator.js` gains a `settle` dial. `switch` is the default and is the old behaviour, unchanged. `rate` settles a whole undisturbed stretch in one segment for a place with one shell and one inlet: the pack replays the same minute decisions on whole numbers, multiplies whole periods of the wave once a state repeats, and hands the substrate one total.
- `src/world_substrate.js`: a closed-form law's `advance` may return an `add` on a quantity its pack declares. The substrate joins it to the rates on that quantity before the bound clamps and credits the law. `advance` is now called before the segment's flows are applied (it reads the world as the segment starts). Before this, an `add` from `advance` threw, and the one existing `advance` (brew steam) reads its own state, so no existing caller changes.
- `tests/engine_world.test.js`: the mixed day's settings ask for `settle: 'rate'`; the budget assertion moves from 800 to 400 and states the totals.

Result for the mixed day: **319 segments** (was 799), 28 cause rows (was 447). 288 of the 319 are the vent Gu's five-minute pulse, which is now the largest cost in that day.

Totals, exact with no rounding (the replay is whole-number minutes, the same as the switch form):

| Total over the day | Switch form | Rate form |
| --- | --- | --- |
| Workshop humidity at the end | 20 | 20 |
| Ledger: brew steam, inlet, vent Gu, bound | 124, -16, -100, -46 | the same |
| Pulls, drafts opened, drafts closed | 210, 105, 105 as published rows | 210, 105, 105 as 1 published pull (the startle) plus counts in holder state |
| Every other cause row (time, kind, place, amount, reactions) | 27 rows | the same 27 |

Agreement: one jump, ten-minute steps, single minutes, ten reload points and a second day from a restored save reach the same serialized world (`tests/engine_world.test.js`). `tests/shell_regulator_rate.test.js` adds 30 undisturbed days in 1 segment against 18,901, and 60 seeded cases with outside humidity changes, smoke, a second pack's rate on the same air, airflow law fields that lapse, fixed inlets and reloads; each matches the switch form's totals and its own minute-by-minute save. The same generator passed 1,500 seeds once by hand.

The price of the rate form, and the way around it:

- R1. Switches made by humidity are counted (`pulls` on the shell, `opened` and `closed` on the inlet), not published, so nothing can hear `shell.pull`, `draft.opened` or `draft.closed` for them. No registered pack hears those kinds today. A room where something listens keeps `switch`.
- R2. While another pack's rate runs on the same air, the rate form goes minute by minute so the answer stays exact. With a second writer running all day that is up to 1,440 segments, more than the switch form. Such a room keeps `switch`, or a later lane lets a law see the other flows on its quantity.
- R3. A pack that watches the humidity of a rate-form room is not cut at crossings inside the wave; it sees the value at its own boundaries. No registered pack watches humidity from outside the regulator.
- R4. A place with two shells or two inlets falls back to the switch form on its own.

Game-reachable code changed, said plainly: both edited source files are reachable from `src/main.js` through `src/meadow_shell_state.js`. The meadow shell passes no `settle`, so it runs the default form, and its world has no law with `advance`. This still needs the coordinator's full suite and a build before the fold.

Tests that import the pack, all passing here: `tests/world_substrate.test.js`, `tests/engine_world.test.js`, `tests/meadow_shell_state.test.js`, `tests/brew_regulated_humidity.test.js`, `tests/emergence_harness.test.js`, `tests/procedural_reports.test.js`, `tests/shell_regulator_rate.test.js`.

## E8: the coupling report reads loaded packs

What was wrong: `scripts/coupling_map.mjs` scanned source text for object literals, so a list built in code came out as `unresolved`, and a method id in `mind.js` was counted as a pack.

What changed: the report creates every pack registered in `src/engine_world.js` and reads `reads`, `writes`, `publishes` and `hears` from the object. Packs that need settings are created from `SAMPLE_SETTINGS` in the script (the mixed valley's rows); `buildMap(settings)` takes another world's. A pack that cannot be created is listed with the reason. The text scan stays for one job: reads and writes in a pack's file that its declaration leaves out (`undeclared`). The line format is the same; packs now print in registry order.

| | Before | After |
| --- | --- | --- |
| Packs | 17 (16 plus the false `a.cross`) | 16 |
| Packs with unresolved declarations | 7 (`c.contest`, `m.market`, `w.sky`, `l.body_alteration`, `l.living_body`, `a.mind`, `a.cross`) | 0 |
| Couplings across domains | 6 | 7 |
| Writes nothing else reads | 20 | 44 |
| Reads nothing writes | 10 | 15 |

The new coupling is `effect sky.daylight: w.sky -> l.colony_light`. `satiety` and `liquor` are now typed as quantities, because loaded packs declare them so. The larger lists are the mind, market, contest and alteration vocabularies and the sky's other three effects, which the scan could not see. `sky.daylight` left "reads nothing writes".

## For the coordinator

- A1. Run the full suite and a build: `src/world_substrate.js` and `src/world_substrate_packs/shell_regulator.js` are game-reachable.
- A2. RUN.md and the E list: E4's budget half and E8 can be marked from the evidence above; C5 (cross-domain couplings) reads 7.
- A3. `docs/PROCEDURAL_CARRY_OUT.md` rows that quote the coupling count or "799 of 800" need the new numbers (hot files, not edited here).
- A4. Next cost in the mixed day: the vent Gu's `interval - clock % interval` horizon, 288 segments a day.

Not run here: `npm test`, `check:rules`, `check:docs`, a build, any browser check. In this sparse checkout `tests/effect_grammar.test.js`, `tests/effect_host.test.js` and `tests/gu_workshop.test.js` fail (11 tests) on missing `docs/research` files (ENOENT), which this change does not touch.
