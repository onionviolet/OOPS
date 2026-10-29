# X1 checkpoint: be-seat replay mapping

Status: mapping files and deterministic generator prepared. No runtime source changed. Route kind: local mapping/tooling with private inputs. Review: agent-verified, not human-reviewed. Rules: AD36, AD44, CLR1-CLR4, CLR12, ON3, ON5, LSD103-LSD125, LSD156-LSD160.

## Probe

| Probe | Expected | Observed | Gate |
|---|---:|---:|---|
| L5r private mapping rows | 18 | 18 | pass |
| Be entry controls | IDs from driver/UI builders | `pick_be`, `enroll_be`; walks `lotm.move.<castPlaceId>`; wait `wait.until.<absoluteMinute>` | pass |
| M4 lead rows, chapters 1-24 | count | 418 scenes, 1,491 steps | pass |

## Outputs

- `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/x1-be-mapping-2026-10-29/chapters-1-3.json` preserves L5r and remaps its be-seat routes/gaps. Seven `needs seat: be` rows are now typed as the missing effect/control; the CLR1 rejected source assignment stays a gap. The dawn wait is marked as a be wait intent.
- `.../chapters-1-24.json` is deterministic M4 output. Counts: 418 scenes, 1,491 steps, 0 matched walk controls, 197 wait intents, 0 matched talk controls; gaps by verb class: appraise 73, care 12, craft 20, fight 51, other 227, research 82, rest 44, ritual 102, socialize 182, study 109, trade 105, travel 117, unknown 107, work 39, practice 24. Canon identifiers and choices remain private in this file.
- `.../controls.json` is the private ID index derived from the cast pack. No canon names or text were added to public code, tests or this checkpoint.

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/build_replay_mapping.test.js` | PASS, 2 synthetic tests | No game/browser proof |
| `node scripts/lead_run/build_replay_mapping.mjs --scenes <M4>/merged/scenes.jsonl --crosswalk <M4>/merged/crosswalk.json --controls <X1>/controls.json --from 1 --to 24 --out <X1>/chapters-1-24.json` | PASS; 418 scenes, 1,491 steps, counts above | M4 time windows are descriptive, so waits are intents and remain gaps; current pack exposes no matching be talk controls; place strings did not resolve to walk controls |
| Be replay, chapters 1-3 | Not run | `lotm_ui_replay.mjs` requires an action route for every executable fold; dynamic wait is currently performed in its `waitBand` stage. `X1_DRIVER_WAIT.patch` prepares the small coordinator-owned change. |
| Be replay, chapters 1-24 | Not run | Current replay validator is hard-coded to the chapters 1-3 scene shape; M4 rows also lack the numeric day/minute windows and per-step anchors required for executable routes. A coordinator-side adapter is needed before this file can be replayed. |

## Coordinator commands

After applying/reviewing `X1_DRIVER_WAIT.patch`, chapters 1-3:

```sh
root=docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27
node scripts/headless/lead_runs/lotm_ui_replay.mjs --seat be --null-player \
  --mapping "$root/x1-be-mapping-2026-10-29/chapters-1-3.json" \
  --scenes "$root/merged-cast-2026-10-28/scenes.jsonl" \
  --l4b-gaps "$root/l4b-probe-2026-10-28/gaps.jsonl" \
  --out "$root/x1-be-mapping-2026-10-29/replay-1-3" --build /tmp/yairpg-x1
```

Chapters 1-24, after the coordinator adds a replay adapter for the M4 schema and numeric windows:

```sh
root=docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27
node scripts/headless/lead_runs/lotm_ui_replay.mjs --seat be --null-player \
  --mapping "$root/x1-be-mapping-2026-10-29/chapters-1-24.json" \
  --scenes "$root/m4-whole-book-2026-10-29/merged/scenes.jsonl" \
  --l4b-gaps "$root/l4b-probe-2026-10-28/gaps.jsonl" \
  --out "$root/x1-be-mapping-2026-10-29/replay-1-24" --build /tmp/yairpg-x1
```

No browser or build proof was run in this scripts/private-data lane. The whole-book output is generated mapping coverage, not verified gameplay coverage.
