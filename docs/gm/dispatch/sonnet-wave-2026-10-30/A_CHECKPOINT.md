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

## Update 2026-10-30 ~02:45

- **Gate on committed HEAD** (clean worktree, through `slot_run.mjs`, with the private `docs/research/novels` and `private_packs` linked in): build PASS; `check:arch` PASS (205 cycle edges, no growth); `check:rules` PASS; full `npm test` 4176/4189 first run. All 11 failures were worktree gaps, not code: missing private book data (9 native fixtures plus 2 CLI tests) and an untracked `D2_LOAD_INTEGRATION.patch` that `tests/cast_topic_talk.test.js` reads. The patch is now tracked (`3efe400b8`). The failing files pass on rerun with the data linked (45/46, then `cast_topic_talk` 7/7 with the patch). The earlier "machine load" explanation for the same failures was incomplete; the missing private data was the cause.
- **Browser floor: still pending.** The headless-game MCP route costs about 7k tokens per reply and is a DOM harness, not a real Chrome run. Needed: a scripted headless Chrome run at 1920×1080 on a fresh origin (be seat, a journey from the live pack's 531 rows, pending save/reload, arrival, Export/Import), through `slot_run.mjs --kind browser`. T2 and the integration slices stay "implemented, below floor".
- **Band build, ch 31-213** (scratch): 1,319 routine rows, 465 usable, 384 unresolved place, 131 order edges, 136 hours rows. A row is usable only with a place and a time (band, order edge or role hours), so timing limits yield as much as places do.
- **A3 (Luna medium, `sw-a-a3`)**: 240 free-text place strings mapped: 37 match (all ids exist in the registry), 159 new, 27 generic, 17 not-a-place. Not adopted: several matches are bare generic names (church, bedroom, reception hall) that need the owner's context. Output is private: `a3-places/mapping.json`.
- **Integration status:** L4 slices 1-3, L8 sheets, L9 harm, L10 ladder and learn, L11 region and cities, L13 bridges and L14 events are all "landed, read model only". Divination is the one slice with a host consumer, but nothing supplies its facts. Wire L14 events first when a day-rollover hook is chosen. L9 restart stays unwired until `sw-death` scopes the whole-save rewind.

Next exact steps: (1) scripted Chrome floor for the journey route; (2) resolve generic place matches by owner, then rebuild the 31-213 band with the mapping as a place seed and check usable count; (3) timing: see why 854 of 1,319 rows lack a time and whether `roleHours` or order edges can supply it.
