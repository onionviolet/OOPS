# Engine dev and test tools (2026-10-30)

Weibao asked for engine-level help: faster time, running an event several ways, and stat interactions. These extend
the existing headless runner, replay core, check inspector and game MCP; none is a parallel stack. Registered in the
[tool registry](../TOOL_REGISTRY.md). Verification states are kept separate below.

| Tool | Entry | Verified |
|---|---|---|
| Advance a save | `scripts/headless/advance.mjs --days N / --until event`; MCP `game_step({days})`, `({until:"event"})` | Equivalence test passed (below); CLI ran; MCP check re-run pending at time of writing |
| Branch explorer | `scripts/replay/branch_explorer.mjs`, CLI `explore.mjs` | Toy-adapter tests pass; real Village run below |
| Check sensitivity | `readCheckSensitivity` in `src/check_inspector.js` | `tests/check_sensitivity.test.js` passes |
| Stat report | `scripts/stat_report.mjs`, `src/stat_interactions.js` | `tests/stat_interactions.test.js` passes; one real run below |
| Scenario library, determinism | `scripts/headless/scenarios.mjs`; MCP `game_new({scenario})` | Names listed; determinism run: see result line at the end |
| Dev console skips | `skip_days(n)`, `skip_minutes(n)`, `skip_to_event()`, collapsed "Dev time" panel (dev flag only) | Unit test with injected `fastForward`; **panel not browser-checked at 1920x1080** |

## Worked runs

**Time (equivalence).** `perf/fresh.json`, seed 5, two game days, three ways: one call, 60-minute chunks, a day at a
time. Canonical saves identical (`tests/headless/advance_equivalence.test.js`, run explicitly; it boots the whole game).
Receipt for the one-call run on a machine at load ~75: 2880 minutes, 206 s wall, 63 s CPU, about 14 game minutes per wall
second (about 46 per CPU second). Treat as a loaded-host figure; `bench.mjs` is the unloaded baseline. The headless path
uses the dev stepper; the browser-only sliced `fastForward` was not exercised headless (it needs a real event loop), and
RT8 is what ties the two together.

**Branch explorer, Village event.**

```bash
node scripts/replay/explore.mjs --find-event --world-seed 1 --seeds 6 --follow-minutes 1440 --stat Perception=40
```

Result: event `occurrence:14` open at clock 6934, 24 branches (2 responses x 6 seeds x 2 stat variants) in 179 s on the
loaded host, none rejected, input save unchanged. Distinct outcomes 4. Only `skill.Perception.xp` varied (16..48),
driven by choice and by the stat variant, not by the seed. No beats moved (the default beat reader sees expansion-state
facts only). Not run: a LOTM volume 1 beat. Its beats live in the native save, so it needs a headless-runner adapter
(patch for floor-wire if it touches `book_world_lotm_*`).

**Stat report.** `node scripts/stat_report.mjs`: 33 stats, 144 grants from items, effects and races. `evasion` and
`hit_chance` have no writer and no named reader. Nine stats (for example `block_strength`, `crit_resistance`,
`heat_tolerance`) are named by behavior code but granted by no walked content; they may come from base stats, skills
or titles, which the report does not walk. No single multiplier at or above 3 and no worst-case stack at or above 20.
Static name matching: evidence, not proof.

## Limits and not done

- No browser check of the Dev time panel at 1920x1080 (needs a frozen rebuild; `dist` is dirty from other lanes).
- Explorer covers the expedition engine adapter only.
- Scenario library holds six names (fresh, fresh-day3, fresh-week, perf-fresh, perf-mid, perf-crowded); other lanes'
  QA fixtures are not registered yet.
- `until:"event"` needs `src/`, so it is not available in a frozen-build session.

## Determinism run

`node scripts/headless/scenarios.mjs determinism perf-fresh --days 1`: two boots, same seed, one game day each,
`identical: true`, no differing paths, hash b3ef217c915e5707.
