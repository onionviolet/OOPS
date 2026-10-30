# Replay harness

Same starting save + seed + ordered command log must give byte-identical
canonical durable JSON. Ambient `Math.random` throws during every CLI and test
run, so a gameplay path that bypasses the seeded streams fails loudly.

- `replay_core.mjs`: recording format (`yairpg.replay` v1), `recordRun`,
  `replayRun`, canonical JSON, the recorder's own chooser and the adapter
  registry.
- `engine_adapter.mjs`: headless expansion engine with shipped expedition
  content. Commands: `advance`, `action`, `cancel`, `sim`, `simCancel`,
  `respond`, `answer`, `withdraw`, `travel` (host location fact).
- `cli.mjs`: `record`, `replay`, `check` (record twice, replay twice, compare).

```bash
node scripts/replay/cli.mjs check --seed 17 --commands 1000 --out-dir /tmp/replay-17
```

A recording holds the starting durable save, the generator seed, every command
stamped with the game clock before it ran, a sha256 checkpoint every 100
commands and the final sha256. Replay stops at the first clock or checkpoint
mismatch and names the command index, so a failing seed narrows to one step.

The chooser is a separate xorshift seeded from `hashStreamSeed(seed,
'replay.chooser')`. It never touches the save's streams; only the commands it
picks are logged. Candidates are previewed as legal first; a candidate that
still throws on apply is skipped and counted, never logged.

## Hook for the headless full-game runner

Register another runner with `registerReplayAdapter`:

```js
{id, newSave(seed), load(save), save(run), clock(run), apply(run, cmd), candidates(run, choose)}
```

`apply` returns a new run and must not mutate its input. `save` returns the
durable JSON value that gets compared. `candidates` is needed only for random
recording; replaying a recorded log needs the rest. Recordings name their
adapter, so both runners share one format and CLI (`--adapter`).

## Limits

- Previewing all ~1,400 living-world commands costs about a second per step,
  so each step previews a seeded sample of 40 local commands plus ids seen
  eligible earlier in the same recording.
- `advance` costs ~100 ms (fact building), so the suite test replays 40
  commands; set `REPLAY_COMMANDS=1000` or use `cli.mjs check` for the full gate.
- Native publication returns (`nativePatch`, acquisition log rows) stay with
  the host and are outside the engine adapter's durable JSON.

## Branch explorer (2026-10-30)

`branch_explorer.mjs` runs one decision every way from a single save: each legal response (or an explicit command
list) x a set of seeds x stat variants, then an optional `follow` command list. It reports the outcome spread per
metric, which axis drives it (choice, seed, variant), distinct outcomes, and which canon beats were added or removed.
`apply()` is non-mutating and every branch works on a copy; the report states `inputUnchanged`. A seed replaces
`state.rng` and resets the keyed streams, so it reads as "fate differs from here on".

```bash
node scripts/replay/explore.mjs --find-event --world-seed 1 --seeds 6 --follow-minutes 1440 --stat Perception=40
```

API for other lanes: `exploreBranches({adapter, save, prefix, branch, seeds, variants, follow, metrics, beats})` and
`formatReport`. Pass your own `metrics(afterSave, beforeSave)` and `beats(save) -> ids` to read a native adapter's
beat ledger or canon-pull slice; the defaults read the expansion state only. A new adapter needs only the adapter
contract above (`load/save/apply/candidates`).
