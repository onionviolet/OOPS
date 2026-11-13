# Test speed and selection, 2026-11-10 (FRC69, FRC70)

Task record for round 8 of the [coverage audit](FOUNDATIONAL_RULES_COVERAGE_2026-11-10.md):
eleven build sessions queued for hours behind the one-suite limiter. Branch
`claude/faster-tests-ea51a3`.

## What changed

- **`npm run test:changed`** ([scripts/test_changed.mjs](../../scripts/test_changed.mjs)). It takes the files
  changed since the merge base with master, plus staged, unstaged and untracked edits. It parses
  imports outward from each test file with the esbuild parser that `check:arch` uses, through
  `importSpecs` in [check_architecture.mjs](../../scripts/check_architecture.mjs). A test file is
  selected, with a printed reason, when:
  - it changed itself;
  - it imports a changed file, directly or through other imports;
  - a file in its closure names a changed file as a path literal (`loadNative('./src/x.js')`,
    `new URL('../src/main.js')`, fixtures and docs). Named code files count as imports and are
    followed;
  - it walks folders (`readdir`, `globSync`, `cpSync`) and a game file changed.

  Comments do not count as naming a file, and paths match only as whole tokens: `items.js` does
  not match `combat_items.js`. Docs-only changes run `check:rules` and `check:docs`, plus any
  test that names a changed doc. `package.json`, the lockfile and `node_modules` run the full
  suite.
- **The run goes through `scripts/slot_run.mjs`.** A selection of up to a tenth of the suite may
  take the second heavy slot. A larger one queues for `npm test`'s single slot. `--list` prints
  the selection without running it, and `--files a,b` overrides the changed set.
- **The headless DOM is faster** ([scripts/headless/dom.mjs](../../scripts/headless/dom.mjs)). A
  CPU profile of one boot plus reload showed about half the time in the mini DOM and almost
  none in the game. Two fixes:
  - Tree links, attributes and listeners moved from WeakMap-backed prototype accessors to
    private fields behind the same accessors. Nodes still have no own data properties.
  - `getElementById` no longer scans the whole tree on every miss. Every connected id is indexed
    on insert or `setAttribute`, so a miss is final unless a mapping was dropped while a
    duplicate id may still be in the tree. Those ids still get a full scan.

  An interleaved A/B at load 44–61 on the same probe: boot 4.6–9.3 s → 2.4–2.8 s, reload
  3.6–5.5 s → 2.3–2.5 s, save 0.3–3.9 s → 0.18 s. Every test that boots the headless game gains,
  and no assertion changed.
- **Things tried and kept as they were.** Dropping or linking the 35 MB inline source map in the
  headless bundle made no measurable difference. In the `cast_*` files, the copy, nested
  `check:arch` and build take about 4.5 s together. Their minutes go to the worker that plays
  the game.
- **A duration budget** ([scripts/test_budget_reporter.mjs](../../scripts/test_budget_reporter.mjs),
  [tests/duration_budget.json](../../tests/duration_budget.json)). `npm test` and
  `test:changed` add a reporter that prints the five slowest files and warns, without failing,
  about any file over `default_ms` (20 s) or its labelled entry. Labelled entries are files that
  are slow because they play the game, each with its reason. `YAIRPG_TEST_DURATIONS=<file>`
  dumps every file's wall time.
- **A slow tier.** Every labelled entry in the budget has `tier: 'slow'`. Known dependency
  matches, including through helpers, still select slow tests. A broad folder-walker match
  prints as deferred to the merge batch, and `--slow` runs it during the focused check.
- **The budget ratchets down.** Like the `check:arch` growth baseline, budgets only shrink.
  `npm test` and `test:changed` keep each run's per-file times for the checkout. The reporter
  names labelled files that now run well under budget, and `npm run test:budget -- --tighten`
  lowers their entries to twice the measured time, in 10 s steps. Entries for files back under
  `default_ms` are dropped, and `suite_sum_ms` is lowered after a faster full run. Nothing is
  ever raised.
- **Re-profile trigger.** When a full run's total file time is 25% over `suite_sum_ms`, the
  reporter prints a re-profile warning that points here. Re-profile then: run with
  `YAIRPG_TEST_DURATIONS=<file>`, take a CPU profile of the slowest file's setup
  (`node --cpu-prof`), fix what is incidental, and label what is play.
- **Test-writing rules** are in AD36 item 2 and the AGENTS.md Lean tests paragraph, each as a
  default with its dial and reason: shared starts per file cloned per test, no real waits,
  play-length files in the slow tier, and new files under the budget.
- **Verification text**: the Lean tests line in AGENTS.md, AD36 item 3, the GROUND_RULES lanes
  line, the mechanic absorption workflow and the foundation run playbook now name
  `test:changed` for lanes and the full suite per merge batch.

## Looked at and left

- **Concurrency.** 40 mid-weight files, two rounds through the limiter, at load 30–45:

  | `--test-concurrency` | Round 1 | Round 2 |
  | ---: | ---: | ---: |
  | 2 | 57.3 s | 64.3 s |
  | 4 | 33.9 s | 33.7 s |
  | 6 | 27.1 s | 27.2 s |

  The machine has 18 cores and 64 GB, with 60% free. Six was about 20% faster on this subset,
  which leaves out the play-length files that spawn their own build and an 8 GB worker.
  Proposal: try 6 on one full merge-batch run, and adopt it if the full suite also gains. This
  change keeps 4, so before and after compare like for like.
- **Real waits.** The headless runner already runs page timers on a virtual clock (`settle`).
  The only real sleeps are about 0.1 s in `continuation_clock` and the process timing in
  `slot_run`, so nothing was worth changing.
- **Shared starts.** The slow files each boot one game in a worker process and then play it.
  A shared start per file would not remove the play, and the faster DOM already cut the
  boots. Kept as a rule for new tests.
- **Repeated work.** The bundle-compile share of a boot is about 4–7%. Each `cast_*` copy builds
  its own headless bundle, which is legitimate: each one patches `main.js` differently.
  Neither was worth a change now.

## Twenty slowest files before

From the first profiled full run on 2026-11-10 at 1-minute load 35–61. The suite's wall time was
983 s through the limiter, with 834 files at concurrency 4. The figures are the sum of each
file's top-level test durations, matched back from TAP names, so module load time is not
included. Every file on this list plays the game; none was slow from setup alone. The one
failure in that run, `cast_inference_adapter`, was its save worker killed by its own 270 s
timeout under load.

| s | File | Why it is slow |
| ---: | --- | --- |
| 248.5 | cast_journeys | built copy, worker drives save/reload/arrival/export/import |
| 237.4 | cast_making_adapter | built copy, worker, 5 reloads, 4 imports |
| 229.5 | cast_inference_adapter | built copy, worker, 5 reloads, 5 imports |
| 229.2 | cast_divination_adapter | built copy, worker, 4 reloads, 3 imports |
| 228.0 | cast_ability_adapter | built copy, worker, 3 reloads, 3 imports |
| 197.2 | cast_exchange_adapter | built copy, worker, 4 reloads, 3 imports |
| 173.7 | cast_body_adapter | built copy, worker, 3 reloads, 2 imports |
| 140.7 | cast_topic_talk | two headless boots, built copy |
| 109.2 | lotm_rites_live | built copy, live rites through save/reload/import |
| 106.9 | place_acts | acts across save, reload, export and import |
| 90.5 | village_lead_line | bot route to all five dates twice, then save/export/import |
| 83.1 | story_spine_qa | seeded real scheduler drained across chunked runs |
| 68.9 | palette_native | three headless boots through native journeys |
| 66.7 | cast_card_integration | built copy, worker |
| 57.7 | interaction_native | headless interaction journey |
| 57.4 | currency_subunits_save | built copy through save/reload/export/import |
| 54.7 | lotm_money_save | built copy through save/reload/export/import |
| 53.1 | gu_upkeep | a played year and more of upkeep |
| 49.8 | person_memory_route | built copy, headless route |
| 46.9 | beat_ledger | headless save, export, import, reload |

The eight `cast_*` files add up to about 1,700 s of roughly 3,900 s of runner capacity.

## After

<!-- filled from the final gated run -->

## Checks

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/test_changed.test.js tests/test_budget_reporter.test.js` | pass (6) | – |
| `npm run check:arch` | pass | – |
