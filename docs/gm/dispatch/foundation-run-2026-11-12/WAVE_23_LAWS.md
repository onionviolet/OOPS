# Wave 23: three missing laws (2026-11-24)

Coordinator: Claude session (atlas platform). Weibao: "Send out codex agents to work on the foundation run?" Picking rule: the cross-world blocker census in the atlas codex (rows unblocked across ledgers), restricted to blockers with no law yet and enough labelled effect sentences for a sentence-first law (the PSA28 pattern). OR1-OR10 in [RUN.md](RUN.md) apply; these three are engine-first slices with a named consumer, and the played tie-in is the next wave.

| Lane | Blocker | Blocked rows / ledgers | Labelled rows | First consumer (OR1) | Model |
|---|---|---|---|---|---|
| W23-D | divination | 567 / 91 | 535 | Klein's readings (LOTM divination supply) | Codex Sol, medium |
| W23-S | soul-state | 1,234 / 129 | 811 | Gu soul and LOTM spirit body | Codex Sol, medium |
| W23-M | mind-binding | 1,758 / 159 | 1,225 | contest and social: charm, command, compulsion in fights and talks | Codex Sol, medium |

Not picked this wave (reasons for later selection):
- effect-unknown (4,335): mostly missing labels and effect families, not one law (lane A finding, 112 of 113 wiki effects without a family).
- area-field, item-bound-power: laws exist; the other session's R1/R2 took them as far as labels allow (16.2% take).
- power-interaction (1,920; 620 labelled): likely several mechanisms under one slug; needs a label read before a law.
- conceal-or-sense (1,163) and mind-state (866): almost no labelled sentences (0 and 4); a labelling wave first.
- spatial-storage (492; 312 labelled): next wave; its consumer is the Gu keeper, where the lotus-route-v1 lane is writing now.

Coordination: the lotus-route-v1 Codex lane owns the new Gu keeper lotus files. The other Claude session's shared-rules lanes have landed (R1, R2). Each W23 lane writes only its own new files; the coordinator runs ledger writes and the law_defaults wiring one law at a time after review.

## Resume block

- **Objective:** three laws built, dry-run scored on held-out rows, wired into ledgers only where the take clears the PWC60 floor (25%), each with its consumer named.
- **Input:** master `8f14ed1c7` plus the untracked lotus-route-v1 files (not ours).
- **Steps:** W23-D, W23-S, W23-M launched 2026-11-24 (Codex lanes `w23-divination`, `w23-soul-state`, `w23-mind-binding`). Fold: review each, run its attach script with `--write` one at a time, regenerate the coverage report, full `npm test` in a scratch worktree, commit by lane.
- **Pacing:** Codex highest window 75% at launch; stop new lanes above 90%.
- **Stop:** all three folded, or a decision Weibao must make (a label split, a floor exception).
- **Resume prompt:** "Resume foundation Wave 23 from docs/gm/dispatch/foundation-run-2026-11-12/WAVE_23_LAWS.md: check `node scripts/codex_lane.mjs status` for w23-*, fold each finished lane per the resume block, keep one writer per ledger write."

## Fold (2026-11-24, agent-verified, not human-reviewed)

| Lane | Dry-run take, all | Held out | Result |
|---|---|---|---|
| W23-D divination | 324 of 567 (57.1%) after the runner adapter | 67 of 131 (51.1%) | Wired: 324 rows in 51 ledgers move from `blocked:divination` to expressed. The coordinator added the `divination` family to `scripts/case_runner.mjs` (without it the take was 0) and the attach step to the three sidecar ledger builders and their rebuild tests. gu_kinds and gu_moves are left to their own builder. |
| W23-S soul-state | 79 of 1,234 (6.4%) | 26 of 273 (9.5%) | Spec only, below the 25% floor. Top reasons: 674 with no parseable sentence, 383 whose sentence is about another object. |
| W23-M mind-binding | 45 of 1,758 (2.6%) | 16 of 356 (4.5%) | Spec only. Top reasons: 660 with no parseable sentence, 362 `alter.mind` (a different mechanism from a command). |

Finding: soul-state and mind-binding are limited by labels and slug splits, not by the engine. The next useful step for both is a labelling and slug-split pass (proposals in each lane REPORT.md), then rerun the dry runs.

Next: played tie-in for divination (Klein's readings through `src/cast_divination_adapter.js`, per w23-divination/REPORT.md); spatial-storage law once the Gu keeper lotus lane lands.
