# Lane brief: H1, everyday acts on things at hand (LSD17, LSD30, LSD40; ON6)

Model: `gpt-6.1-sol`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; the
coordinator commits. Never stash, reset, force or push. Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md);
[LEAD_LIFE_SYSTEMS_DESIGN](../LEAD_LIFE_SYSTEMS_DESIGN.md) LSD17, LSD30, LSD40, LSD103-LSD125 (canon run), LSD156.
Rules: `.claude/rules/runtime-code.md` (AR1-AR16), `.claude/rules/player-ui.md`, AD38 (mechanisms, not lists),
AD43 floor, AD45, CLR1-CLR13, SUI1-SUI19, RPT1-RPT12. Target 1920×1080.

## Why

The first be-seat replay of chapters 1-3 (2026-10-29, private `v1-be-replay-2026-10-29/run1.json`) scores 0 of 18.
Eight rows are `missing verb`, and all are ordinary acts on things at hand: look over objects on a desk, pay a
coin meter and light a lamp, wash, clean traces, check and count what a held item contains, eat from shared
household food, put an item away in a container so others notice it less. These are one mechanism family, not
eight features: an actor acts on an object or stock at a place, with time, inputs, outputs and visibility.

## Publication class (CLR3)

Engine and UI code name-free and world-neutral; any book-specific objects, prices and text live in the private
pack (`private_packs/lotm-cast/`); tests synthetic; screenshots private.

## Data probe (CLR2; gate counts)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| `missing verb` rows in the private `run1.json` | 8 | | yes |
| Existing owners for objects at a place, household stock, item containers, washing/hygiene, meter or fee payment | list with file paths | | yes (reuse before adding) |
| One CLR1 source-rejected row (an act the book gives to someone else) | 1 | | no (do not implement it as the lead's) |

## Scope and seam

- **One world-neutral act family** over existing owners: inspect (reveals object facts into the actor's
  knowledge, AD6-AD8), use or pay (spends a stock or coin through the one money seam, turns a fixture on),
  clean or wash (changes condition facts on the body or a place), consume from shared stock (household purse and
  food, LSD30), store in or take from a container (sets the item's concealment for observers, the hook G2 uses).
  Each act quotes minutes and costs before it runs (SUI6) and writes Reports from the actor's perspective (RPT).
- **Pack data, not code, names the objects**: the be life's flat gets its desk items, meter, lamp, wash stand,
  household bread and a drawer from pack rows with locators; other worlds use the same rows.
- **Canon run (LSD103-LSD125)**: the acts are free actions inside the reservations; nothing here bends canon.
- **Owned files**: a new `src/` module for the act family (name it by mechanism), hunks in
  `src/book_world_lotm_cast_host.js` and `src/book_world_lotm_ui.js` for the be panel, private pack rows, focused
  tests, `cast-lives-lanes/H1_CHECKPOINT.md`. For any needed hunk in another shared file (`main.js`,
  `simulation.js`, `expansion_engine.js`, display, saves), write a prepared patch and continue.

## Ramifications to state (CL220)

New save fields (expected: object and stock facts through existing owners), the compatibility decision for old
saves, and what changes for the four original LOTM starts and the beside seat (expected: nothing visible unless
they stand at the same objects).

## Done check

- Focused tests: each act's quote, effect and Report line on a synthetic place; a stored item is less noticeable
  to an observer; a consumed shared stock lowers the household's portion.
- `BUILD_OUT=/tmp/yairpg-h1 npm run build`; the coordinator runs the browser (Chrome cannot start in the sandbox).
- `npm run check:arch` no growth; `node scripts/lane_review.mjs` with grants; checkpoint with FLR1-FLR6 lines and
  the exact replay rows each act should now satisfy (by row id, no canon text).
