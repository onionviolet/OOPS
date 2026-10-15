Coordinator (Weibao direction, 2026-10-14 ~17:50): "do everything together and then have the gates at the end to save tokens and also speed things up". I stopped your run to apply it. Keep any uncommitted work in your tree and continue.
New gate policy for the rest of this run:
- Per step: build + focused unit tests only (cheap). No per-tranche browser or persistence runs.
- Still commit each step separately (`P00 step N: ...`) so a final-gate failure can be bisected.
- Order: (1) P01 long-life + P11 known-detail; (2) P07/P09/P10/P14; (3) P12/P16/P18 (use the P18 producer answer from resume4); (4) merge `codex/gameplay-foundations`; (5) P15 opt-in Undo, last and in its own commits only, under the resume2 conditions.
- Then ONE final native gate over everything: full `npm test`, and for every lane a fresh-origin 1366x768 browser loop plus save/reload/export/literal import for persistent families, old-save defaults, unsupported-schema rejection. Write each lane's browser check as a script under `docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-host-joins/` that takes `URL` from the environment (no hardcoded port) so the coordinator's FINAL_GATE.sh can rerun it.
- Report per lane: merge-ready yes/no with evidence. If P15 fails its conditions, leave it in separate commits and say so; the coordinator can land everything before it.
Do not end your turn until all of this is done, unless a save-format/USER_VISION conflict blocks you.
