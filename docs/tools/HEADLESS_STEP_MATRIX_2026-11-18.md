# Headless exact-step benchmark matrix · November 18, 2026

Measured local master `eb029a974099c967775d90f7984c6d7ea0a3e669` from a clean Git archive. The primary checkout had shared edits, and the adjacent [Reports and step-receipt work](STEP_SPEED_UI_AND_READERS_2026-11-18.md#implementation-preflight) had separate ownership. This run kept those changes out of the candidate. See the [original profile](HEADLESS_STEP_SPEED_2026-11-18.md) and [wave audit](../audits/EFFECT_WAVE_PROGRESS_2026-11-18.md).

## Inputs and replay

Each row starts a new Node v24.22.2 process and advances 240 game minutes at seed 1 using exact ticks. Host was a Darwin arm64 Mac17,9 with 18 CPUs, six performance cores and 64 GiB RAM. The same local private-pack tree was copied into the archive for both fixtures. Its sorted relative-path file checksum list, excluding `.DS_Store`, hashes to `6709ffd30fc6bf39ddc20dc09700db7df6595cc351ef7bc044433dc9fd346ed0` with SHA-256.

| Save | SHA-256 |
| --- | --- |
| `lotm-tingen-day3`, 398,689 bytes, copied from the adjacent verified fixture at `/tmp/oops-ward-step.VsRzSZ/tingen.json` | `d5a38737f577943a461e388e0a69d09819703bd08a6bb15e1f66a170cfee42eb` |
| `tests/fixtures/perf/mid.json`, saved Village control | `3393f93ebbe4f12c4d4669d0a45d03168f31b7c5fbff5c58cf1ecd1598089a1d` |

For Tingen, this exact input was also present in the runner's OS temp scenario cache as `yairpg-scenarios/lotm-tingen-day3-s1-0aef526897.json`. Verify the hash before replay. Fresh scenario builds with the cast directory alone stopped at `pick_be`. The cached save also rejected cast-only boot with “Optional registration needs an explicit migration.” Boot with the full copied pack tree accepted the unchanged save.

Run from the clean archive with the private packs and the local `node_modules` available.

```sh
/usr/bin/time -l node scripts/headless/step_digest.mjs "$save" 240 "$chunk" 1
```

Run the 120-minute Tingen and Village jobs serially, then run that pair concurrently as independent processes. Finish the serial matrix in order Tingen 60, Village 240, Tingen 240, Village 60. Reported worker wall includes digest assembly. Process wall includes boot and teardown, process CPU is user plus system, and RSS is maximum resident set size per process. The worker times the step call for its CPU measure. The bundle cache was warm from setup. One sample per row gives a point estimate under shared host load.

## Results

All eight workers exited 0, advanced 240 minutes and reported zero game errors. The matrix assertion exited 1 on the Tingen 60-minute storage difference. The table includes the Village differences as well.

| Worker | Fixture | Chunk | Step CPU s | Worker wall s | Process CPU s | Process wall s | Peak RSS GiB | Stored `save data` digest |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| serial | Tingen | 60 | 12.581 | 11.596 | 18.12 | 16.060 | 1.99 | `f013e1fe047accc6` |
| serial | Tingen | 120 | 11.191 | 10.515 | 17.00 | 15.299 | 1.96 | `7ef4183e8ad1d7f0` |
| serial | Tingen | 240 | 12.986 | 12.343 | 20.27 | 18.562 | 1.94 | `7ef4183e8ad1d7f0` |
| serial | Village | 60 | 6.267 | 5.820 | 12.51 | 10.981 | 1.88 | `699287c5e7016fab` |
| serial | Village | 120 | 3.452 | 3.012 | 7.96 | 6.545 | 1.86 | `7ee4320b1bdb85a9` |
| serial | Village | 240 | 4.531 | 4.385 | 10.20 | 8.910 | 1.86 | `259b2dd1ddd76f81` |
| pool2 | Tingen | 120 | 9.755 | 8.866 | 15.34 | 13.355 | 1.96 | `7ef4183e8ad1d7f0` |
| pool2 | Village | 120 | 3.636 | 3.164 | 8.34 | 6.812 | 1.87 | `7ee4320b1bdb85a9` |

**F1. Live state matched across chunks, while stored saves differed in both fixtures.** All Tingen rows ended at expansion clock 3121 with snapshot `4874f7a3babf2cc9` (410,308 characters). Village ended at 250 with `24871b7b9056ba02` (117,124 characters). The worker hashes the canonical snapshot and each localStorage value, normalizing JSON where possible. Tingen's other keys matched throughout: display `5e6f713597cf9727`, profile `28e5026375df7860`, folds `fa2bc629bc481e85`. Village's display and folds also matched at `7137ec585fa91ea9` and `fa2bc629bc481e85`. The Tingen hashes reproduce the earlier [Reports-tail difference](STEP_SPEED_UI_AND_READERS_2026-11-18.md#chunk-size-probe). A follow-up decoded the three Village saves and reproduced all three hashes. Relative to chunk 120, the only differing path was `/reports_dock/lines/2` at 60 and `/reports_dock/lines/1` at 240.

**F2. A two-process pool preserved each fixed-chunk result.** At chunk 120, pair makespan fell from 21.845 s to 13.356 s (1.64× throughput, 39% less wall time), with the same per-fixture live and storage digests as serial. The workers' peak RSS values sum to 3.83 GiB. That sum is a ceiling from individual peaks, and simultaneous aggregate RSS was unmeasured. The host's one-minute load average moved from 5.46 at start to 5.79 after the serial pair and 6.15 after the pool. This measures independent jobs on this Mac.

**F3. Chunk 120 used the least step CPU among the serial samples.** It used 11% less than 60 in Tingen and 45% less in Village. Chunk 240 cost more than 120 in both samples. With one sample per row, these timings can nominate a retest after the save fix. The saved Village control already showed a chunk-dependent storage difference, so the known fresh Village variation was outside this probe.

## Ranked next work

1. **A1. Close the storage parity gate before raising the default chunk.** Give the existing Reports owner both saves and the 60/120/240 matrix. Check canonical snapshots, stored values and reloads on the fix candidate.
2. **A2. Use a two-process pool for independent fixture jobs where RAM allows.** Repeat the paired benchmark in alternating order and measure concurrent aggregate memory on the 8 GB target before raising the pool size.
3. **A3. Profile exact ticks and save projection on the corrected candidate.** Measure chronicle context, expansion persistence and batch-close render separately. Start with a narrow read at the hottest recurring call site. For short jobs, separate boot costs before sizing a pack compile cache.
4. **A4. Hold exact span promotion behind passives and RNG parity.** Use a quiet Tingen route first, then the saved Village control with its per-minute local-life draws. Compare Reports and durable state as well as the clock.

Focused check on the archived candidate: `node --test tests/stepper_life_commit.test.js` exited 0, five tests passed.
The shared-checkout docs check exited 1 on six findings in two unrelated documents. The receipt passed the same checker in an isolated scratch repo.
