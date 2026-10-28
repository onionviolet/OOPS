# L5r brief: the lead's chapters 1-3 steps, reproduced through the UI (CL161-CL169, CL171-CL190)

Model: `gpt-6.1-sol`, medium effort (mapping judgment). Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`.
Runs beside L4e; changes **no** game source. Do not commit; the coordinator commits. Never stash, reset,
force or push. Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md) (CLR codes). Plan sections 18 and 19.

## Publication class (CLR3)

Private: the step table, the mapping file with row text, screenshots. Public: the replay script (name-free;
it reads ids from the private files), a synthetic test and counts in the checkpoint.

## Data probe (CLR2; gate counts)

Gate: lead scenes in chapters 1-3 of the LOTM merge (`merged-cast-2026-10-28/scenes.jsonl`) with steps;
expected roughly 8-12 scenes and 25-40 steps (the slice has 58 scenes and 161 steps over 24 chapters).
Stop if under half.

## Work

1. **Step table** (CL161, private): one row per lead step in chapters 1-3: verb, class (classifier from
   `build_crosswalk.mjs`, reader where it misses), place (crosswalk id), time band (L4a binding), inputs,
   outputs, locator.
2. **Map, fold or gap** (CL162, CL171-CL177): map each step to an existing game action id in the beside
   life (walks, talks, existing LOTM and Village actions), fold steps below the game's grain into one
   action only when the fold loses none of choices, inputs and outputs, time and order, who was there,
   place, outcomes, what was noticed; otherwise record a gap with its kind (missing verb, missing UI
   path, hidden by disclosure, missing knowledge, blocked by mechanism, needs seat: be). Each fold row
   lists what it loses (`loses: []` for a clean fold).
3. **Replay through the UI** (CL163-CL165): `scripts/headless/lead_runs/lotm_ui_replay.mjs` drives a
   fresh beside life through the real interface (the browser route used in L4c/L4b: headless Chrome,
   1920×1080, fresh origin; clicks on visible controls, no direct state writes, no cheat verbs) for every
   mapped or clean-folded step in order, and asserts the book's facts it can (place, purse change if
   any, knowledge note). Steps that need the lead's own identity are `needs seat: be` (CL167).
4. **Score** (CL166, CL178-CL180): per scene and overall: reproducible, clean fold, lossy fold, gap by
   kind. Feed the gap rows into the L4b gap ledger format (private) so one ranked list exists.

## Done check

- Data probe passes; every chapter 1-3 step is reproducible, folded (with `loses`) or a typed gap; no
  silent skips.
- The replay script runs twice with identical results and zero page errors; three private screenshots
  of mapped steps; bundle hash named.
- Checkpoint `cast-lives-lanes/L5R_CHECKPOINT.md`: the score table, gap counts by kind merged with
  L4b's, and the top three gap kinds by count with one candidate second case each (CL182).
- If the sandbox blocks the browser, write and unit-test the script and say so; the coordinator runs it.
