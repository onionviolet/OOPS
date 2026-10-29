# V1 checkpoint, 2026-10-29

Status: replay driver and synthetic scoring checks implemented; browser replay not run in this lane.
No `src/` files changed. No commit, staging, reset, stash or push.

Authority: [V1 brief](V1_BE_REPLAY_BRIEF.md), [cast lives card](../CAST_LIVES_CARD.md),
[lead-life design §§15, 18](../LEAD_LIFE_SYSTEMS_DESIGN.md); AD36/AD43/AD44, CLR2/CLR3/CLR12,
LSD123/LSD156/LSD160.

## Probe and route

The private L5r mapping has **18** rows covering chapters 1–3. Seven rows are still typed
`needs seat: be`, all with no route in the current mapping: `001#1`, `001#2`, `002#3`,
`003#5`, `004#2`, `005#3`, `005#4` (scene prefix `lr.lotm.main.`). They remain gaps until
ordinary be-life controls can represent and reach them. The other 11 rows retain their L5r
statuses; V1 adds no unsupported fidelity credit.

The existing driver assumes a beside life: it reads the beside pick/enroll IDs from the private
mapping, then waits for the mapped entry place. It reads place and clock from the snapshot's
`expansion.simulation` and `clock`/`lotm` fields. The new `--seat be` route uses the visible
`pick_be` and `enroll_be` controls and waits for the be profile after the new-life reload.

The replay score counts reached control and wait outcomes only when their order and time window
hold. Blocked outcomes require the reason shown by the game; unrepresented rows stay typed gaps.
In the be seat, time alignment clicks a visible "Wait until" intention only when its duration lands
inside the step's window; otherwise the natural clock continues. `--null-player` skips setup legs,
performs only mapped canon-step routes, runs twice from a fresh life and compares state hashes after
removing natural `clock` fields. Hashes and canon step text stay in the private output.

## Checks

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/lead_replay_score.test.js` | PASS, synthetic scoring, order/window, clock-excluded hash, and canon-only routing cases | No game or browser proof |
| `node --check scripts/headless/lead_runs/lotm_ui_replay.mjs` | PASS | Syntax only |
| `node scripts/lane_review.mjs --grant scripts/headless/lead_runs/lotm_ui_replay.mjs --grant tests/lead_replay_score.test.js --grant docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/V1_CHECKPOINT.md scripts/headless/lead_runs/lotm_ui_replay.mjs tests/lead_replay_score.test.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/V1_CHECKPOINT.md` | PASS; `private-names=118`, `name-hit-files=0`, `top-level-await-files=0`, `outside-grant=0` | Script/test/checkpoint are granted; scanner reports one tracked candidate path |
| Replay CLI with `--seat be --audit-only` on the private L5r inputs | PASS: 5 scenes, 18 steps; 1 clean-fold candidate pending UI, 17 typed gaps including all seven be-seat rows | Accounting only; no be-life route or replay was exercised |
| Browser replay | Not run; sandbox cannot start Chrome per brief | Coordinator owns rebuilt browser route, two receipts and review |

No runtime change or persistence change. This is a script/test lane, below the gameplay floor;
the be-seat fidelity and null-player determinism claims remain unverified until the coordinator
runs the command below against the same private inputs and a rebuilt bundle.

Coordinator command from the primary checkout:

```sh
l5r_private=docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27
v1_out="$l5r_private/v1-be-replay-2026-10-29"
node scripts/headless/lead_runs/lotm_ui_replay.mjs \
  --seat be --null-player \
  --mapping "$l5r_private/l5r-ui-replay-2026-10-28/mapping.json" \
  --scenes "$l5r_private/merged-cast-2026-10-28/scenes.jsonl" \
  --l4b-gaps "$l5r_private/l4b-probe-2026-10-28/gaps.jsonl" \
  --out "$v1_out" --build /tmp/yairpg-v1
```

Build `/tmp/yairpg-v1` from the coordinator's reviewed combined candidate first. If private
mapping rows gain be-seat routes, update only that private mapping and record its input hash in
the output; do not copy canon step text into this checkpoint.
