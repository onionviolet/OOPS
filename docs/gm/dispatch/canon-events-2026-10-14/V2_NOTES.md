# Event format v2 source notes, 2026-10-14

Authority: Event format v2 lane in COMMON.md and Weibao's explicit worker assignment. Prototype source utility only. Changed files: `src/anchor_snapshots.js` and `tests/anchor_snapshots.test.js` in `/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg`; this note is the only dispatch write. Earlier unrelated worktree edits were preserved. Checks, shell gates, hashes and private graph artifacts remain read-only. No staging, commit or push.

## API and conventions

- A1: Effects and timed changes accept `tell: {to, facts, channel}`. Entries live in `snapshot.knowledge[actor][fact]` as `{value, channel, at}`; requirements accept `{knows: actor, fact, eq}` including structured values and false/null/zero. Base knowledge is cloned. For backwards compatibility, an empty legacy snapshot has no knowledge key until a tell occurs. Ordinary facts and `diffSnapshots` retain their earlier meaning. Knowledge producer lint is actor-specific.
- A2: `revealed` lists unique applied event IDs whose reveal coordinate has arrived, defaulting to occurrence time. Delayed reveals advance without reapplying effects; skipped events do not reveal. Across resets, applied/evidence/skip histories remain global receipts and may repeat IDs. Replay reveal coordinates shift with their loop-local template.
- A3: `deriveSnapshot(world, at, {branch, seed})` accepts a seed, defaulting to world ID. `resolvedAt` maps event IDs to deterministic occurrence times, including future schedules. Integer windows resolve inside inclusive bounds; fractional bounds produce a deterministic in-window number. Explicit `at` wins when old graphs also carry descriptive window metadata. Insertions support windows and must resolve at or after their change. Incremental derivation carries the seed through normal advancement, backward requests and source invalidation; anchor edits now invalidate the cache too.
- A4: A timed reset restores canon facts, base/anchor knowledge and fact provenance at its named anchor. Listed actors retain their current knowledge instead of the anchor version; other actors return to anchor knowledge. Cancellation state and pending insertions originating at or before the reset are cleared. Later changes remain scheduled on the global axis. Pending old loop schedules are replaced with loop templates strictly after the anchor, shifted by `resetAt - anchorAt`; templates already represented by the anchor are not applied twice. Non-loop future events remain globally scheduled. `localAt` equals global time before any reset, then the restored anchor time plus elapsed time. `resolvedAt` for replay templates reports the latest scheduled occurrence. Reset branches use full finite replay in `deriveIncremental`, preserving correctness without a cache-performance claim.

## Verification

F1: Focused suite: 27 tests pass, zero failures (21 earlier tests plus six v2 tests). Coverage includes actor knowledge and alternatives, delayed reveal advancement, seeded boundaries/invalidation, canon restoration, retained knowledge, cancellation/pending-insertion clearing, successive nonzero-anchor resets, later interventions, purity and full/incremental equality.

F2: Both private pilot JSON graphs were rerun through an absolute import of the worktree module using a read-only inline validator. Existing pilot scripts were not run because they write private RESULTS.json, outside this worker's write scope. Canon anchors have zero skips; lint is empty; full/incremental entire results agree for canon and all timed branches; prefixes and author inputs are unchanged. Expected branch facts, skips, independent events, substitution, cancellation reasons and insertion provenance were checked where authored.

| Pilot | Events | Canon anchors | Branch skip counts | Substitutions |
| --- | ---: | ---: | --- | --- |
| Mother of Learning | 45 | 6 | B1: 12; B2: 12; B3: 4 | B3: 1 |
| Fated Villain | 33 | 5 | B1: 8; B2: 4; B3: 1 | none |

Pilot compatibility is not new source validation: existing fact-key knowledge, explicit return observations and descriptive windows were left untouched. The synthetic v2 tests and gate exercise typed knowledge, resolved windows and resets; these private graphs are earlier-format regressions. No book prose is included here.

F3: Required `bash /Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/canon-events-2026-10-14/check_v2.sh` exited **0**. Output summary:

```text
PASS gate_integrity_v2
PASS gate_integrity (override and derived gates)
PASS npm_test # pass 655 # fail 0
PASS unit_file
PASS G1-G9 (all nine individual checks)
PASS pure_imports
PASS O1-O8 (all eight individual checks)
PASS V1-V7 (all seven individual checks)
```

The gate files required no diagnosis or edits. A focused current-source run also passed 27/27 after the final readability-only adjustment. Final source SHA256: `cdd206b641de8de774adc5e7f0e8c506c904e908f6a65f543ee98c4fe1b94998`.

## Open boundaries

U1: No browser gameplay, build, save/reload/import, actor visibility UI, source fidelity review, persuasion/planning, recurring-event scheduler or performance benchmark was exercised. No general reset trigger or broader world-law scope is claimed. This lane does not change the accepted desktop-first direction or deferred gameplay scope.
