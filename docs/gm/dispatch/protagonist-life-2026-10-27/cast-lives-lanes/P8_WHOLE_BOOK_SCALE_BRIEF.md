# Lane brief: P8, pack load, derive and per-boundary cost at whole-book size (1,500 people, 1,516 places)

Model: `gpt-6.1-sol`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force
or push. Read first: [P6_CHECKPOINT](P6_CHECKPOINT.md), [P7_CHECKPOINT](P7_CHECKPOINT.md), [R3_CHECKPOINT](R3_CHECKPOINT.md), the
overnight log lines in [the handoff](../COORDINATOR_HANDOFF_2026-10-28.md) (04:05). Rules: `.claude/rules/runtime-code.md`
AR1-AR16, AD36, AD43, AD45, MD3, MD6, CLR2, CLR10, CLR12; SZ1-SZ7 and LSD126, LSD138 for scale.
Publication: public code (name-free); packs are private and never edited.

## Why

The whole-book candidate (`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/cast-whole-book-candidate-2026-10-29.json`,
2.66 MB, 1,500 people of which most are role tier, 1,516 places, 348 walk targets) passes the pack validator but the beside floor
fails: the page does not reach ready within 30 s (the 204-person candidate loads in about 15 s; the live 36-person pack in about 11 s).
So load and derive cost grows far faster than people. The whole book is not playable until this is cheap. Also: the 349-minute wait
and the ordinary minute must stay near the live pack's cost with 1,500 people (target 1.5x of the live pack under the same load).

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Node-harness pack load/derive time with the live pack, the 204-person candidate and the whole-book candidate (use scratch copies as P6's fixtures do) | table | | yes |
| Cost split of load/derive by phase (validate, deriveCast, alias maps, schedule compile, commands, seed, first sync) and which are quadratic in people or places | table | | yes |
| Cost of an ordinary minute and a 349-minute wait with the whole-book candidate once it loads | table | | yes |
| Pack size on disk and in the save (people nothing has read must not enter the save) | bytes | | yes |

## Scope

- Find and remove superlinear work in load, derive and first sync (for example repeated array scans, per-person full-pack searches, per-place
  object spreads, all-pairs travel tables). People nobody has met should cost a map entry, not a body, commands or save bytes: instantiate
  bodies lazily when a person is first co-located, scheduled to be due, or referenced by a job; their schedule rows stay in the compiled index.
  Role tier stays cheap mechanical (LSD126). No saved-schema change; if lazy bodies would need one, stop and record the compatibility
  question (CLR12) instead.
- Equivalence: live-pack and 204-person-candidate state and save bytes unchanged (P5/P6/P7 harness); whole-book whereabouts equal the
  eager path at sampled minutes for a 150-person sample.
- **Owned files**: `src/book_world_lotm_cast_host.js`, `src/cast_schedule.js`, `src/wake_queue.js`, any pack-loader or derive module the profile
  points to, focused tests, `tests/village_lead_line.test.js` (its child `timeout: 110000` is now too tight in the full suite: it passes alone in
  93 s and fails under suite load; raise it with a comment, nothing else), `cast-lives-lanes/P8_CHECKPOINT.md`. Lane T2 has finished;
  `src/cast_journeys.js` and `src/cast_topic_talk.js` are stable, touch only to fix a measured cost. Outside this list: prepared patch only.

## Done check

Focused tests and equivalence harness pass; Node-harness load, ordinary minute and 349-minute wait for all three packs, before and after;
`npm run check:arch` no growth; lane review; checkpoint with FLR lines. Coordinator runs the full suite and browser floor with the
whole-book pack (target: beside floor passes, pack load under 20 s, minute and wait within 1.5x of the live pack).
Ambiguity default (CLR12): when a cost needs a schema change, keep the eager path and record the decision needed.
