# L4b brief: the cast's beats settle on their days, with no player (starts after L4c)

Model: `gpt-6.1-sol`, medium effort. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`. Starts when
[L4C_CHECKPOINT](L4C_CHECKPOINT.md) reports done. Do not commit; the coordinator commits. Never stash,
reset, force or push. Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md); cite CLR, SUI and RPT codes.
Plan sections 2.3, 8, 9.5, 10.2, 18, 19, 21. Rules: `.claude/rules/runtime-code.md`, AR1-AR16, AD43.

## Publication class (CLR3)

Beat content and settlement text come from the private pack; `src/` holds name-free wiring; tests use
synthetic fixtures. Report lines are templates in the pack, rendered at witness level.

## Data probe (CLR2; gate counts)

Gate: bound beats in the LOTM pack (about 84, L3) and bound days (4, L4a). Stop if under half.

## Player sentence (PRF2)

Idle in the beside start for a few days: Reports shows only what you could know (RPT2), for example a
heard line about the household or an aftermath you walk into, and the person view lists each known
person's settled beats. Nothing tells you what the book did (RPT7).

## Work

1. **Settle beats on their bound days** through `beat_records` with `actor` set, committed to `beatLedger`
   (`src/beat_ledger.js`, built and unwired). The host sets each scene's window fact on its bound day
   (L4a); mechanism beats report `blocked` (LP9).
2. **Report lines** at witness level from the pack's templates (RPT1-RPT12): present, affected,
   aftermath, heard; written once by the settling event (RPT8); names as known then (RPT4) through the
   reference resolver at read time.
3. **Null-player run:** a headless script (`scripts/headless/lead_runs/lotm_beside_week.mjs`) runs the
   beside life with no player actions for the bound days and asserts every non-blocked beat settles on
   its day; prints per-day counts of settled, blocked and lapsed beats and report lines (CL199).
4. **Gap probe** (plan 8.2, CL15): for one scene per kind in chapters 1-24 (routine day, purchase, talk
   that changes a fact, police questioning, the night threat), record typed gap rows (noun, number, rule,
   verb, aftermath, detail) to a private ledger; counts go in the checkpoint.
5. **Fold-loss check on NPC days** (CL187): the lead's NPC day keeps choices' outcomes, inputs, place and
   who was there, or records the loss as a gap.

## Done check (AD43)

- Focused test (synthetic beats) passes; the null-player script passes twice with identical output
  (determinism, CL49), and again after Save, reload, Export and Import mid-run (the ledger survives).
- Browser at 1920×1080 from a fresh origin: screenshots of a witnessed beat's report line and of the
  person view's settled beats; bundle hash named.
- `npm run check:arch` no growth; checkpoint with FLR1-FLR6 each stated and the gap ledger counts.
