# Lane brief: P6, many people at role tier cost little (LSD126, LSD138, LSD162; SZ6)

Model: `gpt-6.1-sol`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; the
coordinator commits. Never stash, reset, force or push. Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md);
[P2](P2_CHECKPOINT.md), [P3](P3_CHECKPOINT.md), [P5](P5_CHECKPOINT.md) checkpoints (read first: measurement method,
equivalence harness `tests/headless/controller_wake_equivalence.test.js`). Rules: `.claude/rules/runtime-code.md`
AR1-AR16, AD36, AD43, AD45, MD3, MD6, CLR2, CLR10, CLR12.

## Why

The combined candidate pack (R1 people plus R2 places, 204 people: 8 principal, 16 recurring, 180 role; 89 places)
passes the beside floor (Save, reload, Export, Import; zero page errors) but is about 4x slower: 4,258 ms per natural
game minute (live pack: about 1,100) and the 349-minute wait 90.7 s (live: about 21 s); pack load 7.6 s, save 490 KB.
LSD126 says role-tier people have the cheap mechanical layer only, updated at schedule boundaries. The candidate is
saved privately at `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/cast-r1r2-candidate-2026-10-29.json`.
The live pack stays the old one until this lands.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Per-boundary cost split with the candidate pack in the Node harness (cast sync, schedules, facts, contexts, publication, people rendering) | table | | yes |
| Work done per person per boundary by tier | table | | yes |
| Where the cast host iterates all people every boundary or every render | list | | yes |

Use a scratch copy of the candidate as the pack in your harness (copy it into a temp fixture, as P5's harness does);
**do not edit `private_packs/`**.

## Scope

- Make cost follow tier and wake times: role-tier people update at their schedule boundaries only (P5's wake queue),
  never per minute; their facts and contexts are built when a boundary or a co-located observer needs them (P3 frame);
  the panel renders only people at or near the player's place. Principals and recurring keep today's behavior.
- Equivalence: with the live pack, state and save bytes equal before and after (P5's harness). With the candidate,
  role people's whereabouts at sampled minutes equal the always-update path.
- **Owned files**: `src/book_world_lotm_cast_host.js`, `src/cast_schedule.js`, `src/wake_queue.js`, focused tests,
  `cast-lives-lanes/P6_CHECKPOINT.md`. Shared engine files (`simulation.js`, `expansion_engine.js`, `main.js`,
  display, saves): prepared patch only.

## Done check

Focused tests and the equivalence harness pass; Node-harness ms per game minute and 349-minute wait for both packs,
before and after; target: candidate pack within 1.5x of the live pack. `npm run check:arch` no growth; lane review;
checkpoint with FLR lines. The coordinator runs the browser floor.
