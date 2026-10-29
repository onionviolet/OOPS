# Lane brief: P5, cut the per-boundary cost of idle spans (CO3, LSD138, LSD162; P4 F2)

Model: `gpt-6.1-sol`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg` beside R1 (scripts and the
private pack only). Evidence: [P2](P2_CHECKPOINT.md), [P3](P3_CHECKPOINT.md), [P4](P4_CHECKPOINT.md) checkpoints. Rules:
`.claude/rules/runtime-code.md` (AR1-AR16), AD36, AD43, AD45, MD3, MD6. CLR codes: CLR2, CLR10, CLR12.

## Why

Coordinator browser floor on bundle `34b15ea0` (D1 and P4 committed): 1,240 ms per game minute; the 349-minute wait
advanced 451 minutes in 50.1 s (about 111 ms per minute, up from 82 ms before D1). P4 found the cost inside
`expansion_engine.js:advanceSimulation`: 349 boundaries for 349 minutes, because a controller has a one-minute
interval (F2), and local-life publication is not span-equivalent (F4: encounter and visitor streams differ), so
span-end batching is not safe there.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Which controller(s) wake every minute in the beside and be fixtures, and what each checks | 1+ | | yes |
| Cost per boundary split: controller scan, D1 constraint work, cast settlement, publication | | | yes |
| Boundaries per 349-minute wait in the be fixture | ~349 | | yes |

## Scope and seam

- Give minute-interval controllers a next-wake time from what they actually wait for (their predicate's inputs: a
  schedule edge, a need threshold, a window edge), using `src/wake_queue.js`; a controller with no derivable wake keeps
  one-minute stepping (safe default).
- Profile and cut D1's per-boundary cost (index lookups, repeated derivations) without changing outcomes.
- Do not batch local-life publication (P4 F4).
- **Side by side (MD6):** the existing span/stepped dial and an equivalence test over the three P4 fixtures plus a be
  life with the pack; state and save bytes equal before and after.
- **Files owned.** `src/expansion_engine.js`, `src/simulation.js`, `src/constraint_store.js`, `src/constraint_pack.js`,
  new focused tests, checkpoint `cast-lives-lanes/P5_CHECKPOINT.md`. LOTM world files and `main.js`:
  `P5_INTEGRATION.patch`. Name any other file before editing.

## Done check

Equivalence passes; boundaries per 349-minute be wait drop by at least half in the harness; focused tests of touched
files pass; `npm run check:arch` no growth; `node scripts/lane_review.mjs` with grants. Chrome cannot start in the
sandbox: the coordinator runs `scripts/floor/run_floor.cjs` for real timings. Known limits named (AD45). Do not commit.
