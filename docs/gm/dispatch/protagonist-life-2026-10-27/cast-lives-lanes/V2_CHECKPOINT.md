# V2 checkpoint: generated replay adapter, 2026-10-29

Status: generated-mapping adapter and synthetic scoring checks implemented; browser replay not run in this lane. No
`src/`, private pack or mapping-generator files changed. No commit, staging, reset, stash or push. Rules: AD36, AD44,
CLR2, CLR3, CLR12; LSD156-LSD160.

## Probe

| Input | Expected | Observed | Result |
|---|---:|---:|---|
| Regenerated chapters 1-24 mapping | 1,491 rows | 1,491 rows | Pass |
| Rows with explicit numeric day and band/minute window | Count | 0 | Order-only fallback used |
| Rows with source order edge | 1,491 | 1,491 | Pass |
| Driver's legacy chapters 1-3 assumptions | Locate | Legacy fallback is `validateMapping` lines 59-60; numeric window reader is lines 270-286. V2 branches by schema and keeps V1 behavior | Replaced for V2 |

The mapping date values are relative or unstated and do not establish a numeric day. No day was inferred. V2 row validation
keeps malformed or unrouteable steps as typed gaps. Named bands are converted through `TIME_BANDS` only when a numeric
day exists. Order fidelity is scored per source chapter and overall. Six scenes have evidence in more than one chapter;
their steps are included in the overall score and reported as ambiguous chapter steps rather than assigned to one chapter.

## Implementation

- V2 rows are checked against selected source steps in book order. `--chapters a-b`, `--max-steps n` and `--offset n`
  select bounded contiguous batches; the audit and completed run receipts are written before proceeding to another batch.
- Mismatch comparison pauses the engine before the final snapshot, ignores natural `clock` fields, records differing
  paths only and does not fail the run solely for a state mismatch.
- Audit counts for the regenerated 1-24 mapping: 29 walk routes, 176 wait intents, 1,286 other gaps; 1,491 rows are
  order-only. These are mapping counts, not UI replay evidence.

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/lotm_ui_replay.test.js tests/lead_replay_score.test.js` | PASS, 10 tests | Synthetic scoring and adapter coverage only |
| `node --check scripts/headless/lead_runs/lotm_ui_replay.mjs` | PASS | Syntax only |
| Regenerate mapping with X2's `/tmp/m4-lotm/merged` inputs and `--pack private_packs/lotm-cast/cast.json`, chapters 1-24 | PASS, 418 scenes / 1,491 steps | Mapping generation only |
| Driver `--seat be --chapters 1-24 --audit-only` on that mapping | PASS, 1,491 rows; row-kind counts above | No browser replay; all windows are order-only |
| `node scripts/lane_review.mjs --grant scripts/headless/lead_runs/lotm_ui_replay.mjs --grant tests/lotm_ui_replay.test.js --grant tests/lead_replay_score.test.js --grant docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/V2_CHECKPOINT.md scripts/headless/lead_runs/lotm_ui_replay.mjs tests/lotm_ui_replay.test.js tests/lead_replay_score.test.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/V2_CHECKPOINT.md` | PASS; `tracked=2 private-names=118 name-hit-files=0 top-level-await-files=0 outside-grant=0` | Static review only |

## Coordinator browser command

Regenerate the mapping first using the X2 paths and add `--pack private_packs/lotm-cast/cast.json`:

```sh
l5r_private=docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27
mapping=/tmp/v2-generated-replay-mapping.json
out="$l5r_private/v2-generated-replay-2026-10-29"
node scripts/lead_run/build_replay_mapping.mjs \
  --scenes /tmp/m4-lotm/merged/scenes.jsonl \
  --crosswalk /tmp/m4-lotm/merged/crosswalk.json \
  --controls "$l5r_private/x1-be-mapping-2026-10-29/controls.json" \
  --registry /tmp/m4-lotm/merged/registry.jsonl \
  --pack private_packs/lotm-cast/cast.json \
  --from 1 --to 24 --out "$mapping"
node scripts/headless/lead_runs/lotm_ui_replay.mjs \
  --seat be --null-player \
  --mapping "$mapping" \
  --scenes /tmp/m4-lotm/merged/scenes.jsonl \
  --l4b-gaps "$l5r_private/l4b-probe-2026-10-28/gaps.jsonl" \
  --chapters 1-24 --max-steps 100 --offset 0 \
  --out "$out" --build /tmp/yairpg-v2
```

Build `/tmp/yairpg-v2` from the coordinator's reviewed combined candidate. For a bounded continuation, advance
`--offset` by the prior batch's selected step count and use a fresh output directory; each browser batch is a fresh life,
so later offsets are accounting/replay samples, not a continuous persisted session. Chrome/browser and bundle proof
remain unverified in this lane.

## Resume 1: page readiness, 2026-10-29

The initial navigation, reload and play-button visibility waits use a 180,000 ms default, adjustable with
`--ready-timeout-ms`. Each run records `packLoadMs.initial` and, for the be-seat reload, `packLoadMs.reload` in its
receipt and the audit as each play button becomes visible. Other timeouts are unchanged.

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/lead_replay_score.test.js` | PASS, 5 tests | Focused scoring coverage; browser behavior not exercised |
| `node --check scripts/headless/lead_runs/lotm_ui_replay.mjs` | PASS | Syntax only |
| `git diff --check -- scripts/headless/lead_runs/lotm_ui_replay.mjs` | PASS | Script whitespace only |
| Browser replay | Not run | Coordinator must verify readiness and load timings with the whole-book pack |

## Resume 2: comparison and fresh-life seed, 2026-10-29

The comparison removes the seven named wall-time and tracking paths in `comparisonOmissions` and uses the floor
runner's sorted, empty/default-pruning canonical form; the audit records both the list and policy. Game clocks and
random state remain comparable. Both the hash and differing-path report use the same normalized snapshot.

The be fresh-life probe inherits its parent URL, but `src/main.js` initializes its expansion with a new crypto seed.
Seeded draws therefore start from different roots. The prepared [V2 integration patch](V2_INTEGRATION.patch) accepts
`replay_seed` only in a loopback `test_hooks=1`, `authority_fresh=1`, `be_fresh=1` probe. Other starts retain the
crypto seed. The driver passes seed `1592594996` in the be seat and checks the resulting stream root after reload;
if the patch is absent or ineffective, it stops with an explicit integration error. Coordinator: apply the patch to
the reviewed candidate, rebuild, then rerun the prior browser command. The patch has not been applied to `src/` here.

Rechecking the two **pre-patch** saved snapshots after normalization leaves these paths. Post-patch differences are
unknown until the coordinator reruns both lives:

- `current time.minute`, `expansion.clock`: natural game clock and replay timing. Pausing after each run does not by
  itself establish the same elapsed game minute.
- `expansion.rng`, `expansion.streams.root`: expansion initialization and seeded streams; the patch targets their root.
- `expansion.simulation.seed`, `expansion.simulation.events.occurrence:3.roll`,
  `expansion.simulation.controllers.village.craftsman_controller.due`: simulation seed, event and controller owners;
  seed and elapsed game time may both affect them.

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/lead_replay_score.test.js` | PASS, 5 tests, including wall-field normalization and retained game-time/RNG differences | Synthetic coverage only |
| `node --check scripts/headless/lead_runs/lotm_ui_replay.mjs` | PASS | Syntax only |
| `git apply --check docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/V2_INTEGRATION.patch` | PASS against current source | Patch applicability only; no runtime proof |
| Driver `--seat be --null-player --chapters 1-24 --max-steps 100 --offset 0 --audit-only` on the regenerated mapping | PASS; audit prints omissions, canonical policy and fixed seed | No browser or seeded fresh-life execution |
| `node --input-type=module` comparison of the two prior private run snapshots | PASS; seven remaining paths listed above | Old unseeded runs, not a post-patch replay |
| Browser replay | Not run | Fixed-seed integration, equal game minute and any remaining mismatch need coordinator proof |

## Resume 3: compare at a game minute, 2026-10-29

Each run pauses the engine and reads its snapshot in one browser evaluation after replay. Both browser sessions remain
paused until their clocks are known. The earlier run advances through the existing `window.advanceTicks(1)` hook while
paused, with an exact-target check and a 1,000-tick budget. The audit records the original run clocks, target, mode,
and any exclusions. The existing hook is available, so no integration patch is needed.

If stepping is unavailable, overshoots, stalls or exceeds the budget, comparison uses the original paused snapshots
and excludes `current time.minute`, `expansion.clock`, and
`expansion.simulation.controllers.village.craftsman_controller.due`; the audit records those paths and the reason.
The paired reproducibility score credits a reached, in-order step only when both runs reached the same kind of step
and their compared states match. A mismatch still records differing paths and yields zero paired credit.

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/lead_replay_score.test.js` | PASS, 7 tests; covers exact alignment, inexact fallback, paired credit and a genuine mismatch | Synthetic stepping only |
| `node --check scripts/headless/lead_runs/lotm_ui_replay.mjs` | PASS | Syntax only |
| Driver `--seat be --null-player --chapters 1-24 --max-steps 100 --offset 0 --audit-only` on the regenerated mapping | PASS; alignment marked pending | Does not start browser sessions |
| `git diff --check -- scripts/headless/lead_runs/lotm_ui_replay.mjs tests/lead_replay_score.test.js` | PASS | Scoped whitespace only |
| Browser replay | Not run | Coordinator must verify stepping, matching snapshots and actual reproducibility with the candidate pack |

## Resume 4: tracked skill timing, 2026-10-29

The coordinator's clock-aligned candidate run reported `skillRecords.tracked` as the sole remaining differing path.
Comparison now excludes that exact path, as the floor runner does, and lists it in the audit. Other `skillRecords`
fields remain compared. Synthetic coverage checks matching snapshots, two reproduced controls, and a control reported
as a typed `missing UI path` gap when unavailable.

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/lead_replay_score.test.js` | PASS, 8 tests | Synthetic coverage; no actual control reachability claim |
| `node --check scripts/headless/lead_runs/lotm_ui_replay.mjs` | PASS | Syntax only |
| Driver `--seat be --null-player --chapters 1-24 --max-steps 100 --offset 0 --audit-only` on the existing regenerated mapping | PASS; audit lists `skillRecords.tracked` | No browser comparison |
| `git diff --check -- scripts/headless/lead_runs/lotm_ui_replay.mjs tests/lead_replay_score.test.js` | PASS | Scoped whitespace only |
| Browser replay | Not run | Coordinator must verify the two candidate controls as reproduced or typed gaps |

## Resume 5: explicit replay time, 2026-10-29

The coordinator reported that act timestamps differed when the natural clock ran between clicks. The driver now pauses
the engine before each life starts and keeps it paused through replay. It uses the existing loopback test hooks:
`simulationTestHooks.pause()` and `window.advanceTicks(1)`. A newly committed player job advances to its actual deadline,
checked against the visible duration when present. A synchronous wait uses the game's own quoted wait action and is not
advanced a second time. Window alignment with no suitable wait control uses explicit ticks. Interrupted or mismatched
timing and controls without an observable result become typed gaps. Journey destination anchors are checked after the job.
The audit records the replay clock mode and each run's start clock. Resume 3's end-clock alignment and fallback remain.
No new integration patch is needed for the existing hooks.

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/lead_replay_score.test.js` | PASS, 10 tests; identical synthetic acts match and a one-minute-late act differs | Synthetic ports, not browser proof |
| `node --check scripts/headless/lead_runs/lotm_ui_replay.mjs` | PASS | Syntax only |
| Driver `--seat be --null-player --chapters 1-24 --max-steps 150 --offset 0 --audit-only` on `/tmp/v2-generated-replay-mapping.json` | PASS; audit records paused replay mode | Earlier mapping input, not the whole-book acts candidate; no browser execution |
| `git diff --check -- scripts/headless/lead_runs/lotm_ui_replay.mjs tests/lead_replay_score.test.js` | PASS | Scoped whitespace only |
| Browser replay | Not run | Coordinator must exercise both lives and check actual act timestamps, control scores and page errors |

## Resume 6: volume-aware replay ranges, 2026-10-29

The driver validates generated mappings against their own locator bounds, using the mapper's inclusive volume/chapter
semantics. `--volume n` and `--chapters a-b` select a volume-specific range; with no explicit locator range, volume 1
is the default. `--locator-range 'zh 第25章..zh 第60章'` accepts the mapper's bounds, including `zh bN 第N章`;
without an explicit `--volume`, the locator bounds determine the volumes. When both options are supplied their
constraints intersect. A scene is selected when any of its evidence locators matches, as in the mapper. Offset and
maximum steps apply after selection. Audit records the chosen bounds.

The real audits used `/tmp/m4-lotm/merged/scenes.jsonl`, `l4b-probe-2026-10-28/gaps.jsonl`, and mappings under
`x4-whole-book-mapping-2026-10-29/ladder/` within the private lead-run directory.

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/lead_replay_score.test.js` | PASS, 11 tests, including repeated chapters across two volumes | Synthetic selection and score coverage |
| `node --test tests/lotm_ui_replay.test.js` | PASS, 5 tests | Legacy and generated replay unit coverage |
| `node --check scripts/headless/lead_runs/lotm_ui_replay.mjs` | PASS | Syntax only |
| Driver `--mapping .../v1-ch1-100.json --volume 1 --locator-range 'zh 第25章..zh 第60章' --audit-only` | PASS; mapping 1,130 steps, selected 317 | Accounting only |
| Driver `--mapping .../v2-ch1-100.json --volume 2 --chapters 1-40 --locator-range 'zh b2 第1章..zh b2 第40章' --audit-only` | PASS; mapping 902 steps, selected 363 | Accounting only |
| Source coverage comparison with `node --input-type=module` for both selected ranges | PASS; 317/317 and 363/363, zero missing, extra or duplicate IDs | No browser execution |
| Driver `--mapping .../v1-ch101-200.json --chapters 101-103 --max-steps 2 --offset 1 --audit-only` | PASS; default volume 1, 2 selected after offset | Bounded accounting only |
| `git diff --check -- scripts/headless/lead_runs/lotm_ui_replay.mjs tests/lead_replay_score.test.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/V2_CHECKPOINT.md` | PASS | Scoped whitespace only |
| Browser replay | Not run | Coordinator owns the candidate browser replay |
