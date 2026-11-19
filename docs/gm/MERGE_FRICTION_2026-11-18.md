# Merge and test friction (2026-11-18)

Task from the coordinator after wave 7 needed four merge-queue rounds. Practice lives in
[SHARED_WORKTREE_PRACTICE](SHARED_WORKTREE_PRACTICE.md#merge-before-dispatch); this note records the causes and the open decision.

## What changed

- **F1 generated outputs.** `scripts/regen_generated.mjs` lists the deterministic regeneration steps in dependency order
  (capability-runs barrel, hp spells, creatures, worm powers, form cases, settle, derivation scores, B ledgers, worlds ledger,
  coverage report, systems-by-world). `scripts/merge_queue.mjs` runs them in its scratch tree on every merge (not only after a
  conflict), takes the queue side for a conflict in any file they rewrite, builds, and folds regenerated and rebuilt outputs
  into the last merge commit. Item-bound case attachment is a `slow` step (50 s quiet, many minutes under load): off by default,
  `--regen-all` or `regen_generated.mjs --all` runs it. Symlink refusal and the never-over-an-existing-path sync are unchanged.
  Proof: a synthetic pair of branches that hand-edited `docs/coverage/README.md` and `worlds.jsonl` merged with both conflicts
  resolved and the merged result back to the regenerated content (only the bundle differs from base).
- **F2 self-registration.** Derivation rules: one file each in `scripts/derivation_rule_sources/` (`order`, default function);
  `build()` output is byte-identical to before. Capability runs: one descriptor each in `src/capability_runs/`; the barrel
  `index.js` is generated (build.js and the queue rewrite it, `tests/self_registration.test.js` checks it).
- **F3 version hashes.** A rule's `version` is a hash of its scorer file, copied into every derived ledger row. The rows are
  audit records, and a reference would change the row shape for every consumer, so the hash stays. The cascade is handled by
  order: scores regenerate before the B ledgers. Gap: `gu_kinds.jsonl`, `gu_generated.jsonl`, `circle_of_inevitability_potions.jsonl`,
  `shadow_slave_artifacts.jsonl` and `lotm_rules.json` carry the hash too and need private or paid inputs, so the queue cannot
  regenerate them; an edit to a scorer they cite still needs a lane to rebuild them.
- **F4 test time.** `npm test -- --shards N` (or `YAIRPG_TEST_SHARDS=N`) splits the files into N duration-balanced groups,
  each its own `node --test` process, same total concurrency and the same limiter slot. Numbers below.
- **F5 LOTM tests.** Cause: `private_packs/lotm-cast/cast.json`, rebuilt 2026-11-16 23:06, holds 551 household acts and none of
  the KJ3 ones (`book.lotm.kj3o.cup`, `kj3p.drink`, `kj3aa.*`) and no `householdActs.requiredPeople`; both tests assumed the
  pack always had them. No older copy of the pack exists on disk. Both now check the pack (`tests/helpers/lotm_cast_pack.mjs`)
  and skip with the named gap. Still owed by a lane with the private sources: rebuild the pack with the place-act step so the
  two tests run again.

## Proposal for Weibao (not flipped): merge-queue test mode (AD36)

Routine merges run `npm run test:changed` against the merged result (files that import, name or walk what changed since H),
and the full suite runs at wave close and for pushes that touch what every test leans on, as AD36 and `gate:push` already say.
A flag `--tests affected|full` would pick; default stays `full` until you say otherwise. Cost: a routine merge can pass while an
unrelated slow-tier file is broken, found at wave close instead.

## Measured test time (2026-11-18, noisy)

Same checkout, 12 files at once (`YAIRPG_TEST_CONCURRENCY=12`), run one after the other on a machine with other lanes' suites running:

| run | load at start | wall | result |
| --- | --- | --- | --- |
| one process (`--shards 1`, as before) | 78 | 5755 s | failed: live save-worker tests hit their ~1200 s wall-clock timeouts |
| 3 shards of 4 files | 49 | 231 s | 0 failed, 0 cancelled |

These are not comparable: the load differed and the first run lost files to timeouts. What they show is that a loaded machine, not the runner,
sets the wall time, and that the 3-shard run completes cleanly. A quiet-machine A/B is still owed before calling sharding a speedup. The queue
now sets `YAIRPG_TIMEOUT_SCALE` from load per core for its test check unless it is already set (the live tests read it since `ca0041c51`), and
`npm test` takes the one machine-wide slot (`slot_run.mjs --slots 1`); `test:raw`, `test:changed` and plain `node --test` do not, and the queue
strips `YAIRPG_SLOT_HELD` so its own suite takes a slot.
