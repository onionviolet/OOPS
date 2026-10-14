# B2 / CN11 fixture report, 2026-10-14

Implemented on `codex/rt-slice1-fixtures` exclusively in the assigned worktree.
Base: `b12f5161af7c8996d34229a29a9a41d0fbe8b575`.
Authority: main-checkout NEXT_SLICE_PROMPT and TECHNOLOGY_AND_PROGRESSION round 11,
plus PROJECT.md and USER_VISION standing priorities. This task supplies seeded
states only; no production text, UI, save field, planner integration or balance change.

## F1: Deliverables

- `tests/helpers/rt_slice1_fixtures.mjs`: test-only esbuild/browser harness and generator.
- `tests/fixtures/rt_slice1/`: four native serialized saves, four native encoded
  exports, craft provenance manifest and regeneration/import instructions.
- `tests/rt_slice1_fixtures.test.js`: one browser test loads all four serialized
  saves through real native startup, then compares native reserialization and facts.

Heroes are named `TEST FIXTURE RT SLICE1 ...`. The low checkpoint has successful
Woodworking and Forging crafts initiated at level 0; the high checkpoint has
both initiated at level 11. Native success-rounding retains a partial processed
wood output: four processed wood in low, seven in high; chainmail counts are one
and two. Craft counters are 21 attempts / 2 successes and 24 / 4 respectively.
Resources remain for the slice executor to craft again and inspect transient
cue/receipt text. Saved inventories do not preserve a transient craft receipt.

## F2: Native construction and boundaries

A fresh disposable 1366×768 browser origin constructs expansion seed 17. Only
wall-time scheduling and random seed injection are changed in the temporary
bundle; production files and build artifacts are untouched. The real elder
hello dialogue runs. Crafting prerequisites use the actual field-clear and
craftsman learning reward processors. Native inventory and XP functions seed
materials and the higher skill level. `use_recipe` performs normal inventory
consumption, chance rolls, XP, crafting statistics and durable transactions.
These are seeded-native states, not naturally earned combat/training/resources.

Town work executes actual `town.begin`, `town.brief`, `town.timber`,
`town.settle`, `town.return` commands and `update_timer(3)` for the paid timber
completion. All five facts/completions, corrected-ledger source, one kit and
empty pending queue survive native loading. No debug setter, direct actor-fact
write or hand-edited save supplies this outcome.

Ordinary timed travel failed with `Invalid calendar anchor` on the first Town
outskirts relocation. The generator uses the existing native `change_location`
option `skip_travel_time:true` for seeded relocation. This does not establish
ordinary travel correctness and is not a runtime repair. Natural town travel
remains open. The state is reachable through native code without a debug write.

The old fixture is the actual pre-slice serializer format from the base above,
before either proposed text change, captured before seeding or crafting. It
contains the existing `town.returned:false` default; it is not a fabricated
pre-town schema. Keep that archived artifact frozen for future reader checks.

## F3: Verification

- Focused browser loader test: 1 pass, 0 failures; all four native load paths,
  native export decoding, saved actor facts, XP/levels, inventory, craft counts,
  town source/completions/pending state and no browser page errors.
- Regenerated all four fixtures in a second fresh origin and compared complete
  expansion state, native levels, inventory, calendar and craft statistics:
  identical. Wall-time save metadata is intentionally outside byte equality.
- Final `npm test`: 1,382 tests, 1,379 pass, 0 failures, 3 existing TODOs,
  0 skipped/cancelled.

Early checks exposed three harness/test mistakes, all corrected: decoder version
argument, removed hero-confirmation DOM access, and the partial scaled-output
count assumption. The first whole-suite run's sole failure was the new test;
no unrelated failing test was repaired or skipped.

Open: rebuilt production cue rendering, 1600×1000 presentation, literal UI Import,
ordinary timed travel and human feel acceptance belong to the slice executor.
This fixture-only task changes no gameplay production source, dist/ or index.html.
No push or merge authorized or performed.
