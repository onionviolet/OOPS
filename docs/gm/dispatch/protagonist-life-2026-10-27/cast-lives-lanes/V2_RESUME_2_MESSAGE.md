# V2 resume 2: two fresh be lives differ, so nothing scores as reproducible

Coordinator run (headless Chrome 1920×1080, scratch build of HEAD `71e6c29db`, the 204-person R1+R2 candidate as the pack, mapping
regenerated with `--pack`, ch1-24 `--max-steps 100 --offset 0`) now completes: `run1.json`, `run2.json`, `proof.json`, `audit.json`, `mismatch.json`
under the private `replay-c204-2026-10-29/b0/`. Result: 2 control rows, 15 waits, 83 gaps, fidelity 0, and `mismatch.json` ("mismatch recorded") because
the two fresh runs differ at these paths (identical in both runs):
`absorb_local_life.lastClock`, `absorb_local_life.lastHubAttempt`, `current time.minute`, `expansion.rng`,
`expansion.simulation.controllers.village.craftsman_controller.due`, `expansion.simulation.events.occurrence:3.roll`, `expansion.simulation.seed`,
`expansion.streams.root`, `last_rewarded_export`, `levels.person.main_character.skill_xp.Breathing`, `saved_at`,
`skillRecords.tracked.Breathing.seen`, `total_playtime`.

Make the replay deterministic and its comparison meaningful, in this order (CLR8, CLR13):
1. Wall-clock fields (`saved_at`, `total_playtime`, `last_rewarded_export`, `absorb_local_life.lastClock`, `absorb_local_life.lastHubAttempt`,
   time-driven skill tracking `levels...Breathing`, `skillRecords...Breathing`): normalize in the comparison, the way
   `scripts/floor/run_floor.cjs` does (its `canonical` function), with the list printed in the audit.
2. Seed and RNG (`expansion.seed`, `expansion.rng`, `expansion.streams.root`, the village controller `due`, `occurrence:3.roll`, `current time.minute`):
   find why two fresh be lives get different seeds. B1 added "seeded draws" for the be seat; check whether the be fresh life takes a fixed
   seed when a test hook or URL parameter is given, and have the driver pass it. If the game has no such hook, write the smallest prepared patch
   (`V2_INTEGRATION.patch`, src is outside your grant) that lets a test hook fix the root seed for a fresh life, and explain it in the checkpoint. Do not change normal play.
3. After 1 and 2 the two runs should be identical; if some path still differs, list it with the likely owner.
Grants: `scripts/headless/lead_runs/lotm_ui_replay.mjs`, `tests/lead_replay_score.test.js`, `V2_CHECKPOINT.md` (append "Resume 2"), `V2_INTEGRATION.patch`. Run
`node --test tests/lead_replay_score.test.js`. You cannot run Chrome; the coordinator will. Do not commit.
