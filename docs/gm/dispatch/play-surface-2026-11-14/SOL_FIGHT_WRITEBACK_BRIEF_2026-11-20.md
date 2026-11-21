# Sol lane: fight write-back by change, not by value (MO1, MO7, 2026-11-20)

Read [the shared lane rules](SOL_UI_LANES_COMMON_2026-11-20.md) first, except for its "panel must look different" bar, which does not apply to a bug fix. Lane id `fight-writeback-sol`; evidence folder `docs/representations/evidence/fight-writeback-sol-2026-11-20/`. Weibao: "more to consider? Send implementation accordingly" (2026-11-20).

## When it runs

After `daily-powers-sol` and `combat-page-sol` have finished. The coordinator starts this lane only once neither is running, so you are the only writer on these files. Their changes are still uncommitted in the checkout. Build on them and leave them in place. Note: `src/ri_daily_powers.js:60-62` already refuses a daily power while a fight is open. Count that in step 1.

## The bug

A fight copies the player's resources at the start and writes them back once at the end. Two of those write-backs set a value instead of applying the change:

- **Essence (part A).** `src/tempo_lead_fights.js:157` sets `pool.reserve = Math.max(0, Math.min(pool.reserve, left))`. If 3 essence is spent outside while a fight that spent 2 is open, the reserve ends 3 down instead of 5. The fight's spend is lost.
- **Health and stamina (part B).** `src/tempo_fight.js:264` sets `vitals.health` and `vitals.stamina` to the fight's values, so healing or rest between the fight's start and end would be lost.
- Ready stock (arrows) already writes back the change (`src/tempo_fight.js:270`, current minus start). Copy that shape.

## Steps

1. **Check the case can happen.** Find whether the game lets the player act (a chore, a rest, a daily power, an offline tick) while a tempo fight is open or held. Report the route, or report that none exists. If none exists, write the tests in step 4 as guards, make the change anyway (it is cheap and removes the trap), and say so.
2. **Part A.** Record the essence reserve at fight start in the fight record, and at the end apply `reserve - (start - left)`, floored at 0. A fight record without the start field (an old save) falls back to the current behaviour.
3. **Part B.** The same for health and stamina: record the start, apply the change, clamp to the maxima. Same old-save fallback.
4. **Tests.** For each part: spend or heal outside during an open fight, finish the fight, and assert the total. Also assert a normal fight with nothing outside gives the same result as before.

## Owned files

`src/tempo_lead_fights.js`, `src/tempo_fight_contract.js` (validation of the new start fields), `src/tempo_fight.js` lines for vitals write-back only (part B), and tests. Run `node scripts/rule_routes.mjs --for <path>` on each first.

## Save note

This adds optional start fields to the saved fight record. Weibao's standing position is that old saves are disposable; the fallback in steps 2 and 3 keeps them loading. Record that as the compatibility decision in the report.

## Done means

The new tests pass with `npm run test:changed`. If step 1 found a real route, a played proof in the rebuilt game on a fresh origin: open a fight, take the outside action, finish, and show the reserve or health is right; then save, reload, export and import with the fight held open.
