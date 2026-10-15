# Lane E: reproducible runs and replay harness (2026-10-14)

Goal: same save + seed + command log gives byte-identical canonical durable
JSON. Harness: [scripts/replay/](../../../../scripts/replay/README.md).
Test: `tests/replay_harness.test.js`.

## Math.random inventory (this branch, 2026-10-14)

The ER9 audit counted 63 lines in 10 files. Commit 7b787fdd (P1 streams)
already moved native combat, encounters, loot, stock, crafting, gathering and
reward draws to saved streams, so 31 code sites remained at the start of this
lane. Lines below are this branch's.

| Code | File:line | Use | Status |
| --- | --- | --- | --- |
| RP1 | `src/enemies.js:285` Elite wolf rat guardian bleed (20%) | Gameplay | **Migrated** to `gameRandom(STREAMS.combat,'on_hit')` default; native combat passes its keyed `on_hit:N` draw like every other enemy hook. |
| RP2 | `src/combat_math.js:34,44` strike and base-damage `random` default | Gameplay injectable default | **Migrated**: default now throws "Combat rolls need a saved random stream." All six callers (models/combat, native_battle, party_battle, causal_story_core, feature_expansion_battle, tests) already pass a seeded draw. |
| RP3 | `src/misc.js:69` `random_range` | Gameplay helper, unbound fallback | **Labeled**, takes an optional `random`. Only callers are recipe `roll_quality`; native craft commits go through `seededRecipe`, which replaces `roll_quality` with the craft stream. No commit path reaches the Math.random fallback. |
| RP4 | `src/display.js:439,454` floating-effect offset and path | Cosmetic | **Labeled**, stays. |
| RP5 | `src/particles.js:8-13,19,46,52,75,88,89,105` (12 lines) | Cosmetic | **Labeled** (file header), stays. |
| RP6 | `src/main.js:3599` click floating text pick | Cosmetic | Proposed label (main.js owner). |
| RP7 | `src/main.js:3682,3685,3706` failure text line pick | Cosmetic text; outcome already decided by the seeded reward-stream success draw | Proposed label. |
| RP8 | `src/main.js:4632,4634` rat-name dialogue easter egg | Cosmetic text | Proposed label. |
| RP9 | `src/main.js:9024,9025,9028,9031` ambient sound log lines | Cosmetic log | Proposed label. |
| RP10 | `src/absorb_c2/local_life.js` | Already throws without a saved stream | No literal Math.random left. |
| RP11 | `src/models/combat.js`, `src/models/location.js`, `src/components/trader_component.js`, `src/expansion_engine.js`, `src/simulation*.js` | Gameplay | No literal Math.random left (P1 streams or saved xorshift). |

Not code: two `HOST_CONTRACT.md` lines and one comment in
`absorb_p23/encounter_profiles/profile.js` mention Math.random as a ban.

### Proposed patch for main.js (owner lane)

No behavior change. Labels the 10 remaining lines as cosmetic so a future
reader does not migrate them into a saved stream (which would shift gameplay
draws whenever a view renders).

```diff
@@ src/main.js:3598
     if(event && game_action.floating_click_effects) {
+        // Cosmetic randomness: presentation only, never saved.
         const random_effect = game_action.floating_click_effects[Math.floor(Math.random()*game_action.floating_click_effects.length)];
@@ src/main.js:3681
+    // Cosmetic: picks failure flavour text; the outcome came from the seeded reward-stream draw.
@@ src/main.js:4631
+    // Cosmetic easter egg: dialogue text only, never saved.
     if(character.isRat()) {
@@ src/main.js:9023
+            // Cosmetic ambient log lines; no saved state changes.
```

## Compatibility decision

Saves without `expansion.streams`, or without a given stream cell, load
unchanged. `ensureStreams` derives the root from the save's existing
`expansion.rng` on first native draw, and cells start lazily at n=0. The legacy
engine RNG cursor never moves when streams appear. No save format version
changes; no migration is needed. Distributions are unchanged: RP1 keeps
`<.2`, RP2 changes only what happens when no draw is supplied (previously
ambient, now an error; no caller relied on it).

Covered by `tests/seeded_streams.test.js` (old expansion save derives the same
root on two loads; guardian bleed replays from a restored stream state with
Math.random forbidden) and `tests/replay_harness.test.js` (a save with
`streams` deleted records and replays byte-identically).

## Evidence

| Check | Result |
| --- | --- |
| `cli.mjs check --seed 17 --commands 1000` | Record A, record B, replay 1, replay 2: all four finals sha256 `458bfb37…aa54b`, byte-identical; the two recordings are identical; 0 rejected candidates; ambient Math.random throws throughout. Game clock 22,357 min. [check-17.json](results/replay-e/check-17.json), [recording-17.json](results/replay-e/recording-17.json). |
| `node --test --test-concurrency=2` | 1725 tests: 1722 pass, 0 fail, 3 todo. |
| `tests/replay_harness.test.js` | Default 40 commands (`REPLAY_COMMANDS=1000` for the full gate): recording and replay twice, divergence localization, a save without streams, adapter hook. |
| Systems workshop browser (`scripts/systems_workshop_browser.cjs`) | 10/10 cases, no page errors, rebuilt bundle on a private port, 1366x768, dev-stepped. Bundle not committed (rebuilt for the check, then restored). |

Command mix for seed 17: 848 advance, 130 travel, 10 action, 6 sim, 5
respond, 1 cancel. Advance dominates because most of the ~1,400 living-world
commands need a location, target or earlier progress that a random walk rarely
reaches. Lane D's bots are the better source of deep command coverage; their
logs replay through the same format.

Timing (uncontended, 120 commands): record 18-36 s, replay 17 s. About 85% of
engine time is fact building inside `advanceSimulation`
(`buildSimulationFacts`, `auditRemainderCombinedFacts`); that belongs to the
engine-perf lanes. One replay pass that overlapped the full suite took 824 s;
that was contention, not a replay cost.

Not exercised: native browser combat with the guardian bleed hook (covered in
Node by the bundled native test with Math.random forbidden), lane C's headless
full-game runner (hook only), cross-engine or cross-locale replay.
