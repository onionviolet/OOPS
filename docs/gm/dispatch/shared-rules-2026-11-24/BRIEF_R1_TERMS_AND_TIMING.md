# Lane R1: law terms for supported objects, delayed and triggered pulses, area-field wiring

Read [README](README.md), then:
- `src/area_field_law.js`, `src/item_bound_law.js` (`ITEM_BOUND_TERMS`, shared as `AREA_TERMS`) and `src/form_transformation_law.js`;
- `src/world_effects.js` (`W_OBJECT_OF`, and what each verb does on position, thing, property and law objects) and `src/stored_working.js` (triggers, pulse, charge);
- `scripts/law_defaults.mjs` and `docs/coverage/fields/law_take.json`;
- commit `84ffdad69` (PSA28), the pattern for wiring a law that passes its dry run;
- `scripts/item_bound_ledgers.mjs`, the pattern for attaching law cases to ledgers.

## 1. World accounts for supported objects

Add term entries for (verb, object) pairs the world layer already executes, each backed by an existing `world_effects` act, never a new world concept. Start from the dry run's miss list:
- `move.position`, `alter.position`;
- `add.thing`, `remove.thing`, `move.thing`, `conceal.thing`;
- the counterplay verbs `block.<object>` and `end.<object>` where EF3 says they work (for example `block.vitality`, `block.essence`, `end.vitality`);
- `transform.moisture` if a property exists for it.

Leave `force`, `mind`, `information`, `memory`, `working`, `luck` and `soul` out. R2 owns force, and the rest belong to other owners (A, L, N, K, P per `W_OBJECT_OF`). Each entry needs one focused test that runs a case and sees the world change.

## 2. Delayed and triggered pulses

The dry run reports "time delayed/triggered has no pulse model" (92 rows). Map `delayed` to a stored working that fires once after the law's `later` dial, and `triggered` to the stored-working trigger kinds that already exist (event or word). Add them to `AREA_TIMES` with tests. Do not add a new scheduler.

## 3. Dry run, then wire if it passes

Run `node scripts/law_defaults.mjs --write` and report the area-field take before (8.4%) and after, with the new miss list.
- If the take reaches the PWC60 quarter floor (25%), wire area-field as a law the way PSA28 wired form-transformation: an attach step that gives each taken row its `case` and lets `check:coverage` compute expressed. Report rows moved per ledger (top 10).
- If it stays under, do not wire. Report the largest remaining miss reasons.

## Checks

Run the new and touched tests, `node --test tests/item_bound_law.test.js tests/area_field*.test.js tests/form_transformation*.test.js` (whichever exist), `npm run -s check:coverage`, `npm run -s check:arch` and `npm run -s check:rules`. Report each exit status. Write `r1/REPORT.md`.
