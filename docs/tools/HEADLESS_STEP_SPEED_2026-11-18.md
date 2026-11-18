# Headless step speed (2026-11-18)

Goal: faster headless stepping with identical results. Direction: Weibao's life-walk lanes could cover only a few Tingen days. Rules: AR3 (one owner), AR9, RT8 (stepped results are byte-identical to single ticks). Persistence format is unchanged, so no migration.

Fixture: `node scripts/headless/scenarios.mjs build lotm-tingen-day3 --out <file>` (needs `private_packs/lotm-cast`, copied into the worktree because it is gitignored). Bench: `node scripts/headless/bench.mjs --minutes 120 <file>`. Profile: `node --cpu-prof`.

**Measurement caveat.** The machine was heavily loaded by parallel lanes (load average 30, later about 290), so wall time is noisy and the later span test took an hour. CPU seconds (`cpuS`) are the comparable number; ratios between runs taken minutes apart are good to roughly 20%.

## Results (Tingen, game minutes per CPU second, 120-minute runs)

| Step | Change | min/cpu-s | Parity receipt |
|---|---|---|---|
| Baseline | none | 8 (14.9 cpu-s per 120 min) | n/a |
| S3 | LOTM `purseBalance` reads the purse through a `money` port (`character.money`) instead of building a whole campaign context each tick (it was 15% of the run) | 13 | `step_parity` 180 min: identical |
| S1 | In a stepper batch only the newest envelope per key is made durable, once, at batch close (`deferredDurable` in `main.js`); size guard and compression move to the close | 15 | `step_parity` 180 min: identical, stored bytes identical |
| S5 | Separate span mode, see below | about 3x on the 180-minute probe (4.2 s vs about 12 s) | own test, not RT8 |

Reference after S1+S3 (profile): `advanceChroniclePlan` context build 16%, `persistExpansion` 15%, batch-close render flush 14% (once per chunk, so a larger chunk cuts it), boot `compileStructuredPack` 7%.

## Parity tooling (new)

- `scripts/headless/step_parity.mjs --ref <checkout> --save <file> --minutes N`: runs the same save and seed in a pristine reference checkout (`git archive HEAD | tar -x -C ref`) and in this one, compares the canonical snapshot, clock and every stored localStorage value. Exit 1 on any difference. Worker: `step_digest.mjs`.
- Receipts: S3 and S1, Tingen 180 minutes, seed 1: snapshot digest `6df2ce2fe1d30fa5` in both trees, no stored-key differences, 0 errors.

## What was not done, and why

- **S2 (context cache by state version): not done.** Counted per game minute on Tingen: native contexts 1.08 builds, campaign 1.07, expedition 3.1, persist 1, create_save 1. So the planning read frame already shares one build per tick; a cross-tick cache would have to key on every native global (character, location, inventory, activity flags) and would break byte-identical results for little gain. The real cost is per-minute work, which S5 removes by taking fewer minutes.
- **S4 (skip previews, frozen read views): not done.** After S3 the per-tick `previewSimulationCommand` and `structuredClone` shares fell below the contexts and persist costs; no safe single-owner change was found in the time available. Open item.
- **S6 (pack compile cache at boot): not done.** About 7% of a 120-minute run, paid once per boot. Open item; needs a keyed cache of `compileStructuredPack` output.

## S5 span mode (labelled separate mode, not RT8)

`game.spans(minutes)` in `runner.mjs`, `advanceGame({span:true})` and `advance.mjs --span`. It jumps idle minutes to the next kernel boundary: `nextSimulationBoundary(state, {controllerWakes})`, then `progress_time` with that span inside a stepper batch, capped at 15 minutes. It falls back to real ticks while the player sleeps, fights, talks, trades or acts.

- On Tingen the plain boundary is always one minute away (the `village.craftsman_controller` polls every minute and a check falls due each minute or two), so only the controller-wake boundary (2 to 12 minutes ahead) gives jumps.
- Equivalence: `tests/headless/span_mode.test.js` (180 minutes, Tingen, seed 3) passes: same clock and same canonical save except the idle passives `levels/person/main_character/skill_xp/*` and `skillRecords/tracked/*` (Breathing and Patience XP, 0.1 per skipped minute, which `simulateTick` grants each tick). Everything in `expansion` matches.
- Not equivalent in the Village: local life draws one random stream cell per minute, so the `mid` fixture differed in `streams` and `reports_dock`. Use single ticks there. A later pass can add the skipped passives in aggregate or make local life span-aware.
- Default stepping stays single-tick and RT8-identical. Nothing selects span mode unless asked.

## Seam for the timeline lane

`runner.spans` has one function, `spanMinutes(want)`, that decides how far the clock may move. A per-holder clock hook belongs there (and in the clock owner, `src/clock_owner.js`, which already takes a minutes argument per call). Stepper batch: `openStepperBatch` in `main.js`, now exposed to the harness.

## Per-holder clock hook (request from the coordinator, 2026-11-18; design note, nothing built)

The mechanism-foundation lane proposes a law field of kind `clock` on a holder or place scope, params `{rate (default 1; 0 = hold), until}`; a holder's effective rate is its own field times its place's. Compatibility of what exists here:

- **S1 (deferred durable write):** touches only when the whole envelope is written, never how far any holder advanced. No assumption about rates.
- **S3 (purse port):** reads `character.money`, a single value; unaffected.
- **S2:** not built. If added later, key a context cache on each holder's own clock and rate, never on one shared `clock`.
- **S5 (`runner.spans`):** it moves one global clock by `k` minutes, where `k` comes from `spanMinutes(want)`. That function is the hook. With per-holder rates it should return the largest `k` such that no holder's next boundary falls inside the span, where a holder's boundary is `(boundary - its clock) / rate` in global minutes and rate 0 contributes none, plus the rate-change times (`until`). `nextSimulationBoundary` currently reads one clock; it would take a per-holder time map the way `controllerWakes` already does. Today every holder gets the same `k`; the span test would then need a fixture with a rate-2 and a rate-0 holder.
- The real advance of each holder by `rate * k` belongs in the clock owner (`src/clock_owner.js`, `update_timer`), which already takes a minutes argument per call.

## Area guide

Time and calendar entry updated: stepper persistence is deferred per batch, the LOTM purse reads through a `money` port, and span mode exists.
