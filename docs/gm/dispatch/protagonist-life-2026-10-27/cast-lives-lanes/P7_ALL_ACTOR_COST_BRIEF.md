# Lane brief: P7, all-actor facts and contexts skip actors nobody reads (LSD126, LSD138, SZ6)

Model: `gpt-6.1-sol`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force
or push. Read first: [P6_CHECKPOINT](P6_CHECKPOINT.md) (method, harness, profile tables), [P5](P5_CHECKPOINT.md),
[P3](P3_CHECKPOINT.md). Rules: `.claude/rules/runtime-code.md` AR1-AR16, AD36, AD43, AD45, MD3, MD6, CLR2, CLR10, CLR12.
Publication: public code (name-free); private packs and the candidate pack are never edited.

## Why

P6 cut the combined candidate pack (204 people, 89 places) from 4,258 to 2,298 ms per natural game minute and the
349-minute wait from 91 s to 57 s, still about 2x the live pack's 1,100 ms. The remaining hot work in P6's profile:
`simulationFacts` (673 calls, 1,566 ms per minute), `simulationNativeContexts` (17 calls, 1,703 ms), state copy and GC.
Whole-book packs will hold thousands of people, so cost must scale with people who are read, not people who exist.
Target: candidate pack within 1.5x of the live pack, with live-pack state and save bytes unchanged.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Per-call count and ms of `simulationFacts` and `simulationNativeContexts` by actor tier with the candidate in the Node harness | table | | yes |
| Callers that request facts or contexts for all people versus one actor | list | | yes |
| Work done per role-tier actor per call that nobody reads (no observer, no due boundary, no job) | table | | yes |

Use scratch copies of the packs as P6's fixtures do. **Do not edit `private_packs/`.**

## Scope

- Make facts and contexts for role-tier actors lazy: built when read by an observer, a due boundary, an explicit job, or a
  command preview; otherwise reuse the last built value keyed by the actor's inputs (cache keyed by revision, not
  clock). Principals and recurring keep today's behavior. Reduce state copying on the all-people path if the profile
  shows it dominates.
- Equivalence: live-pack state and save bytes equal before and after (P5/P6 harness); candidate pack role whereabouts and
  every observer-visible fact equal the eager path at sampled minutes.
- **Owned files**: `src/main.js` (the existing frame and context loops only, no growth: check:arch), `src/simulation.js`
  or the facts/context modules the profile points to, `src/book_world_lotm_cast_host.js`, focused tests under
  `tests/` named by system, `cast-lives-lanes/P7_CHECKPOINT.md`. Any file outside this list: prepared patch only.
  Another src lane may be working in new `src/cast_*` modules; do not touch those.

## Done check

Focused tests and equivalence harness pass; Node-harness ms per game minute and 349-minute wait for both packs, before
and after; `npm run check:arch` no growth; lane review; checkpoint with FLR lines. The coordinator runs the full suite
and the browser floor. Ambiguity default (CLR12): when a cache key is unclear, keep the eager path for that actor class and
record why.
