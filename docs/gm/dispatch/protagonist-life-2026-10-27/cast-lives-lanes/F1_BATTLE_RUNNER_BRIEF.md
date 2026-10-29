# Lane brief: F1 step 1, one battle runner for the saved battles, no behavior change (LSD81, LSD82, LSD85, LSD89, AR9)

Model: `gpt-6.1-sol`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg` beside P5 (P5 owns
`src/expansion_engine.js`, `src/simulation.js`, `src/constraint_store.js`, `src/constraint_pack.js`), R1 (scripts and the
private pack) and V1 (replay script). Design: [LEAD_LIFE_SYSTEMS_DESIGN](../LEAD_LIFE_SYSTEMS_DESIGN.md) sections 13-14
(LSD81-LSD95). Rules: `.claude/rules/runtime-code.md` (AR1-AR16, AR9, AR15), AD36, AD43, AD45 (modular; past code earns
no weight), MD3, MD6. CLR codes: CLR2, CLR10, CLR12.

## Why

The be seat will reach the book's fights. LSD81: grow the saved-battle family into one conflict frame instead of a
second engine. LSD82: port first, with no behavior change; moves, ranges and morale come in a later step.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Hand-built saved battles and their files (road duel `native_battle*`, party battle `party_battle.js`, sluice battle `feature_expansion_battle*`; also check `cohort_battle*` and `field_care_battle.js`) | 3+ | | yes |
| Existing tests that replay each battle to a result | 1+ each | | yes |
| Shared shape across them: sides, objective, moves or actions, stop rules, results, save fields | list | | yes |

## Scope and seam

- **Outcome.** A world-neutral runner module (for example `src/conflict_frame.js`) that takes a battle as data (sides,
  objective, moves as rows per LSD85, stop rules, results) and runs it; the three hand-built battles become data
  definitions over it. Every existing battle replays to **byte-identical** state, save bytes and Reports through the
  runner (AR9).
- **Side by side (MD6).** A test-only dial runs old and new paths; an equivalence test replays each battle both ways
  over several seeds and compares state and `create_save()` bytes. Old code is deleted only when equivalence passes.
- **Draws.** Keyed draws only, never ordinal (LSD139), unless the old battle used ordinal draws; then keep its exact
  stream to stay byte-identical, and record it as a known limit.
- **Files owned.** The battle files named in the probe, new runner module and tests, a SYSTEMS_REGISTER entry for the
  frame (LSD89) as a proposed hunk in `F1_INTEGRATION.patch` if that file is shared, checkpoint
  `cast-lives-lanes/F1_CHECKPOINT.md`. `main.js`: patch only. Name any other file before editing.
- **Known limits (AD45).** List what the runner does not yet model (ranges, morale, situation card) for step 2.

## Done check

Equivalence passes for every ported battle over at least 5 seeds; existing battle tests pass; `npm run check:arch`
no growth (ideally lower); `node scripts/lane_review.mjs` with grants. Chrome cannot start in the sandbox: the
coordinator runs the browser floor for each battle. Stop condition: a battle cannot be expressed as data without
behavior change; leave it on its old path, record why, finish the others. Do not commit.
