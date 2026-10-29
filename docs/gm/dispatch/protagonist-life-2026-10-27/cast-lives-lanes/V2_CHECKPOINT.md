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
