# Canon events and branch overrides lanes, 2026-10-14

Authority: Weibao, 2026-10-14: "more to consider for branch overrides and
canon events? Exent and consider accordingly? send out codex agents
accordingly?" Design owner: [intro flow considerations](../../../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md)
rounds 12-13 (DV, OV, CV codes) and [TIMELINES_AND_DIVERGENCE](../../../TIMELINES_AND_DIVERGENCE.md)
(C1-C6, T1-T5). Proposals and prototypes only.

Writing rules: the same as
[start-sources COMMON](../start-sources-2026-10-14/COMMON.md) (no raw prose in
git, paraphrase, locators, SHOWN/STATED/INFERRED/MEMORY/UNKNOWN labels,
project voice, no git add/commit/push, own outputs only, CHECKPOINT.md).

| Lane | Writes | Status |
| --- | --- | --- |
| pilot-mol | private graph under `docs/research/novels/full-book/mother-of-learning/event-graph-2026-10-14/`; tracked lessons `pilot-mol/LESSONS.md` here | running |
| pilot-fv | private graph under `docs/research/novels/full-book/fated-villain/event-graph-2026-10-14/`; tracked lessons `pilot-fv/LESSONS.md` here | running |
| overrides | `src/anchor_snapshots.js` and its test in the start-records worktree, after the derived-snapshots lane passes | queued |

Overrides done check: `check_overrides.sh` (derived-snapshots gate G1-G9 as
regression plus `checks/overrides_gate.mjs` O1-O8, npm test 0 failures).
Override API to add: `branch.changes = [{at, set?, cancel?, insert?, cause?}]`
(old `{divergeAt, overrides}` still works), event `alternatives` (first
whose requirements hold substitutes, listed in `substituted`), event
`fixed: true` (applies despite failed requirements, listed in `resisted`
with the failed fact), and `explainFact(result, key)` returning
`{by:'base'|'event'|'change', id?, cause?, at?}` (OV12). Changes at time t
apply after canon events at t; inserted events count as `by:'change'` with
the change's cause.

## Event format v2 lane (2026-10-14)

From both pilot lessons (pilot-fv, pilot-mol). Spec, additive to the existing API:
- **Knowledge:** `snapshot.knowledge = {actor: {fact: {value, channel, at}}}`, separate
  from facts. Effects and changes may `tell: {to, facts, channel}`. Requirements may be
  `{knows: actor, fact, eq}`.
- **Reveal axis:** events may carry `reveal_at`; results list `revealed` = applied events
  whose `reveal_at` (or occurrence time) is at or before the derived time.
- **Windows:** events may use `window: {from, to}` instead of `at`; the time resolves
  deterministically from `opts.seed` (default the world id) and the event id, inside the
  window; results expose `resolvedAt`. Options are passed as `deriveSnapshot(world, at,
  {branch, seed})` and carried by `deriveIncremental`.
- **Loop reset:** a change `{at, reset: {to: anchorId, keepKnowledge: [actors]}}` restores
  facts and knowledge to the canon snapshot at that anchor (keeping only listed actors'
  knowledge), drops earlier scoped changes, and replays events marked `loop: true` at
  `resetAt + (event.at - anchor.at)`. Results expose `localAt`.
Done check: `check_v2.sh` (V1-V7 plus O1-O8, G1-G9, npm 0 failures).
