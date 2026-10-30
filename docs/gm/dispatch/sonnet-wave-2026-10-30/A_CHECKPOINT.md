# L-A checkpoint (sonnet wave, absorption line)

Agent-verified, not human-reviewed. Rules: AD36, AD43, CLR2, CLR9. Updated 2026-10-30 ~02:10.

## Landed
- T2 and TH2: `0df26deaa`, implemented, below floor (no 1920×1080 browser run; load average 100-225 made every native fixture time out in a clean worktree). Details in `cast-lives-lanes/T2_CHECKPOINT.md`, "Landing receipt".
- A1 (Sol medium, `sw-a-a1`): `build_cast_pack.mjs --whole-book` with a narrower `--from/--to` now builds routines, order edges and hours for that band. Chapter 1-24 output is pinned byte-identical. `node --test tests/build_cast_pack.test.js` PASS 18/18 (I reran it; model confirmed `gpt-6.1-sol`).
- Candidate band build, ch 31-60 (scratch output, live pack untouched): 163 routine slots, 39 usable, 97 unresolved place, 20 order edges, 21 hours rows. Most of the band's slots cannot be used because their places are not in the pack.
- A2 (Luna medium, `sw-a-a2`; WB1): 21 rows sampled from volumes 2-8, 7 fit the routine/hours shape. Misfits: travel between cities 8, seasonal or multi-day cycle 3, irregular timing 3. Coarse: 15 of 21 sampled ids trace to merged rows by locator; 6 carry descriptive labels.

## Next exact steps
1. **Places first.** Rebuild with `--places-only` (or `--place-seed`) for the ch 31-60 places the routines name, then rebuild the band; target unresolved-place under 30. Then do ch 61-100, 101-150, 151-213.
2. Shape: the pack's routine and `worldHours` rows hold Tingen-day anchors. Volumes 2-8 need a travel-between-cities leg (the T2 journey rows already carry `from/to/means/minutes`) and a seasonal/irregular recurrence. `cast_schedule.js` already accepts `seasonal`, `yearly` and `irregular`, so the gap is the generator emitting them, not the engine.
3. Adopting a band into `private_packs/lotm-cast/cast.json` is a pack revision (card P1 procedure); do it only after step 1 and a `cast_schedule` focused test on the band.
4. T2 browser floor at 1920×1080 once load is under ~20: `tests/cast_journeys.test.js` alone, then the fresh-origin journey (pending save/reload, arrival, Export/Import).
5. Still queued from the card: B1 browser check, L5r replay in the be seat, D1 determinism, steps 100-150 replay batch. Not started.
6. Wave: L4 owns divination rows (`src/lotm_divination_rows.js`); I wire them into the pack after its commit. Services and places from the ledger (items 3 and 5) are unstarted.
