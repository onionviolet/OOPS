Coordinator (2026-10-14 17:35): I stopped your run right after tranche 3 (b0fba727, clean tree) to reorder work so verified tranches can merge sooner. Nothing was lost.
New order:
1. NEXT, as one tranche: join P01 long-life (worn titles, domestic title goals, related training milestone; edits in src/titles.js, src/titles_ui.js) and P11 known-detail (hotkeys/detail; edits in src/display_settings.js). These are the last unverified edits to live shared files; once they pass, the coordinator merges tranches 1-3 plus this one while you continue. Commit `P00 tranche 4:`.
2. Then field/market/leisure/search (P07/P09/P10/P14), then adaptation/encounters/growth (P12/P16/P18), each its own `P00 tranche N:` commit.
3. Merge `codex/gameplay-foundations` and rerun the full gate.
4. P15 last, under the Q2 conditions in p23-host-joins.resume2.md.
Answer to your P18 question: add a native producer that counts earned local skill XP from real grants going forward (optional counter, absent on old saves = 0, no back-filled history). Keep 150000 as a labelled proposal threshold. Expose the counter in the existing known-progress view so the gate is discoverable. If the tonic needs stock, use the separate optional native inventory/counter you described; never change the conserved shop schema.
Keep going through all steps without ending your turn unless a save-format or USER_VISION conflict blocks you.
