# Heat grade gate, first slice (L3), 2026-10-20

Task record for GDP21, GDP26 and GDP30 from the gear-depth research doc.
Rules applied: MR1, MR4 (quote spends nothing), AR3 (one authority), AR7
(quote, then revalidate), AR12, AD5, AD38, UR40.

**Target viewport:** 1920x1080 desktop. Mobile deferred (standing UI priority).
**Visible outcome:** the Smelting detail for Iron ingot names its fuel need and
refuses a log with a reason; charcoal or coal runs it.
**Deferred:** timed clock jobs, bellows or station heat, other recipes, other
energy kinds (GDP27-GDP29), a world-pack format for fuel rows.

## Seam

New leaf module [`src/heat_grades.js`](../src/heat_grades.js) (pure, no state,
no timer). It owns the per-world grade scale and fuel rows and one function,
`quoteHeat(heat, stacks)`. It lands through the native recipe path, not a new
domain: `find_recipe_material` in `src/crafting_recipes.js` gets a branch for a
slot that carries `heat: {minGrade, load}`, and the existing single status
reader `itemRecipeStatus` (`src/crafting_visibility.js`) and the native debit in
`execute_native_recipe` read the quote's `need`. `main.js` and `display.js` grew
by zero lines (modified lines only; `check:arch` shows -1 and -29).

Why not the other seams: native smelting never goes through `resolveBatch`
(that is the herbal frontier law), so a station level there would be a second
path. `energy_resources.js` records are per-actor learned reserves; loose fuel
items do not fit, so no heat reserve exists and inventory stays the only fuel
store (AR3, WDI46).

## Data (default, dial, reason)

- Grades, base world: 1 open fire, 2 forge fire, 3 bellows heat. Default three;
  a world declares more, fewer or none in `HEAT_WORLDS`. Reason: what fuel
  reaches decides which reactions exist (AD38). Ordinal labels, never a
  temperature.
- Fuels: Rough wood log and Wood log grade 1; Charcoal grade 2; Coal grade 3.
  `amount` is heat per item, `burn` is heat per minute. The log's amount of 2
  matches the two uses one log gives the brass lung.
- First consumer: smelting recipe Iron ingot. Its coal slot became
  `{material_type: 'fuel', heat: {minGrade: 2, load: 4}, count: 1}`. Charcoal and
  Coal still cost one item per craft (amount 4), so existing economy and the Fort
  quest text ("one coal") hold. A log is a fuel but grade 1, so it fails by name.
- The quote picks the lowest eligible grade, so coal is not burned on soft work
  when charcoal is held. Failure still burns fuel as before (unchanged rule).

## Job semantics: stated honestly

Native crafting is an instant batch, so no timed clock job was built (a timer
would be a second clock, AR3). The quote shows fuel, grade, units per craft and
burn minutes in the requirement row and the tooltip. Settlement is the existing
native craft transaction: fuel is debited with the batch, and
`beginNativeCraftTransaction` rollback restores it on interruption. Duration is
displayed, not simulated. Fuel burning over game time needs a later slice.

## Persistence

No new saved state: fuel is ordinary inventory and grades are data. Compatibility
note per the 2026-10-17 decision: nothing to migrate.

## Evidence

- `node --test tests/heat_grades.test.js`: 3 pass. Covers log refusal text, lowest
  eligible grade, per-world data, no mutation of the held list, and the real Iron
  ingot recipe against a native inventory.
- `npm run build && npm test`: 2283 pass, 0 fail. `check:arch` and `check:rules`
  pass.
- Browser, rebuilt bundle from this tree, fresh origin, 1920x1080 (Playwright with a test-only
  main.js hook to grant items): Iron ingot with logs shows "Rough wood log only reaches grade 1
  (open fire); this needs grade 2 (forge fire)", Craft blocked. After adding
  charcoal the row reads "Charcoal, grade 2: 1 per craft, burns 2 min" and 2 attempts.
  Craft 1: Iron ore 10 to 5, Charcoal 2 to 1, logs untouched. Save, then reload on
  the same origin: counts persisted. Export JSON has no heat or fuel keys.

## Not exercised

- Literal Export file download then Import of that file (only create_save and a
  localStorage reload). In-page `load()` of an export onto a live game
  merged inventory instead of replacing it; that is existing load behavior, not
  changed here.
- The recipe detail after reload (row click timed out in the harness, category
  tab reset); counts after reload were checked.
- Interruption rollback with a thrown error after the fuel debit is covered by
  the existing native transaction, not re-tested here.
- Other smelting recipes keep their coal slot; Steel and Glass gates are later.
- Mobile layout.
