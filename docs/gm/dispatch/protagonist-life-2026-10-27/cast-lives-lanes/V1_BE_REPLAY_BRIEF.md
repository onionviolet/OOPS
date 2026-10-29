# Lane brief: V1, replay the lead's steps in the be seat and score fidelity (CL269, LSD123, LSD156, LSD160)

Model: `gpt-6-luna`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`; scripts only, no `src/`. Beside
R1, P5 and F1. Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md); L5r ledger in this folder; design section 15 and 18.
Rules: AD36, AD43, AD44, CLR2, CLR3, CLR12.

## Why

AD44: the progress measure is the replay of the lead's steps through the game's own screens. L5r replays chapters 1-3
in the beside seat (1/18 verified). The be seat now exists (B1, D1). CL269: measure fidelity there.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| L5r ledger rows for chapters 1-3 and their status, including the 7 `needs seat: be` rows | 18 | | yes |
| What `scripts/headless/lead_runs/lotm_ui_replay.mjs` assumes about the start (beside picker, snapshot paths) | list | | yes |

## Scope and seam

- Extend `scripts/headless/lead_runs/lotm_ui_replay.mjs` (or add a sibling) with `--seat be|beside`. The be route is:
  "Be [lead]", then "Start this new life", then wait for the reload, then play from the be life. Wait-until uses his
  intention buttons where they fit.
- For each ledger step: reached through ordinary controls, reached by waiting, blocked (with the reason the game
  shows), or not representable (gap). Write a scored ledger (JSON plus a short Markdown table) to a private output
  folder. Fidelity is events reached in order inside their windows (LSD156), not minute accuracy.
- Add a `--null-player` mode: as the lead would, no input other than canon steps, run twice; compare state hashes
  without the natural clock (LSD123).
- **Files owned.** `scripts/headless/lead_runs/lotm_ui_replay.mjs` (or a new sibling), a synthetic test of the scoring
  logic `tests/lead_replay_score.test.js`, checkpoint `cast-lives-lanes/V1_CHECKPOINT.md`. Canon step text stays in
  private outputs.
- Chrome cannot start in the Codex sandbox: build the script and its scoring test, dry-run what you can without a
  browser, and stop; the coordinator runs it.

## Done check

Scoring test passes; `node --check` on the script; `node scripts/lane_review.mjs` with grants; the checkpoint gives the
exact command for the coordinator. Do not commit.
