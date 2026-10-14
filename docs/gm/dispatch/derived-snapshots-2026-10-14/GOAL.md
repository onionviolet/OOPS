# Derived snapshots prototype and offline-time audit (2026-10-14)

Authority: Weibao, 2026-10-14: "more to consider for derived snapshots and
offline branch time? Other stuff and more? send codex accordingly". Design
owner: [intro flow considerations](../../../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md)
rounds 10-12 (AH3, DV1-DV12, OT1-OT10, BR6). Proposals; reversible prototype.

Not a playable slice: a pure module with tests, plus a read-only audit.
No gameplay claim follows from it.

## Lane 1: derived snapshots (code, worktree)

Worktree `/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg`,
branch `codex/start-records` (the start-records lane there is finished).

Create `src/anchor_snapshots.js` (pure ES module, no DOM, no imports from
main/ui code) exporting:

- `deriveSnapshot(world, at, {branch} = {})`: `at` is an anchor id or a
  number. `world = {id, revision, base:{facts}, events:[{id, at, requires?,
  effects, evidence?}], anchors:[{id, at}]}`. Requirements are
  `{fact, eq}` or `{fact, exists:true}`; effects are `{set:{k:v}}`,
  `{add:{k:n}}`, `{unset:k}`. Events apply in time order, ties in array
  order. A failed requirement skips the event with a reason naming the fact
  (DV2, DV3). `branch = {divergeAt, overrides}` applies overrides after
  events at or before `divergeAt` (DV6). Returns `{snapshot:{facts},
  applied, skipped:[{id, reason}], evidence:[{id, label, locator}], revision,
  at}` (plus anything needed for incremental use).
- `deriveIncremental(world, previousResult, at)`: continues from a previous
  result; must equal full derivation (DV5).
- `diffSnapshots(a, b)`: `[{key, from, to}]` sorted by key, changed keys only
  (DV11).
- `lintWorld(world)`: `[{kind, ids}]` with kinds at least `never-fires`
  (requires a fact nothing sets) and `same-time-conflict` (same time, same
  fact, different values) (DV8). Empty for a clean world.
- Never mutate inputs.

Also `tests/anchor_snapshots.test.js` (node:test) covering the same
behaviors with your own fixtures.

Done check: `check.sh` exits 0 (gate integrity, npm test 0 failures,
unit file present, `checks/gate.mjs` G1-G9, pure imports).

Constraints: create only those two files in the worktree; no edits to other
src/tests/dist/index.html; no git add/commit/push; never edit this folder's
checks/, check.sh, GATE.sha256. Stop and write a diagnosis below if a check
seems wrong.

## Lane 2: offline time and clock audit (read-only)

Read-only on code in `/Users/weiwei/code/yet-another-idle-rpg`. Output:
`docs/research/OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md`.

## Next round

## Dead ends
