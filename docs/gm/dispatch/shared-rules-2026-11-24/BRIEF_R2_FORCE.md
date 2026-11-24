# Lane R2: the `force` object in the world layer

Read [README](README.md). `force` is a quantity in the effect grammar (`src/effect_grammar.js` `EFFECT_OBJECTS`), but `src/world_effects.js` maps it to `null`, so no law can run "add force", "alter force" or "remove force". It blocks at least 224 area-field rows outright, part of the item-bound law's 726 unaccounted rows, and the form-transformation law's handoffs.

## 1. Design first, briefly

Write `docs/research/FORCE_OBJECT_DESIGN_2026-11-24.md` (proposal, AD32). Ground it in evidence:
- how rows phrase force (sample the `add.force` and `alter.force` misses through the fills in `docs/coverage/fields/area-field.jsonl` and the item-bound ledgers);
- what the tabletop rule rows say about force, shoves, pushes and impacts (`docs/research/power-catalogues-2026-11-16/README.md` §TTRPG rules as rows and its rule-row files);
- what the engine already does with impact: `src/damage_types.js` and native combat, `src/gu_giant_hand.js`, the Gu strength path, and `world_substrate` positions.

Compare at least three genuinely different designs, including an unusual one. Candidates:
- (a) force as a transient impulse that resolves into existing accounts (vitality loss on a body, position displacement, breaking a thing) by the target's properties;
- (b) force as its own world quantity, a held pressure or strength;
- (c) force lowered to the native combat damage layer;
- (d) something better you find.

Pick a default under AD56 with its reason, name the rejected designs in a line each, and list the world dials (AD5). AD38 applies: things work by how they work. The default must not fork combat. It reuses the damage layer's authority where a hit happens (AR3).

## 2. Build the default

Make the minimal world-layer change: `W_OBJECT_OF.force` and the act or acts it lowers to. Put any new logic in a small module (for example `src/force_effects.js`) and add focused tests where "add force" on a body, a thing and a place each does what the design says.
- Do not edit `src/item_bound_law.js` or `src/area_field_law.js` (lane R1). Put the exact term entries (`add.force`, `alter.force`, `remove.force` if meaningful) in your report, and the coordinator adds them.
- Saves: say whether anything new is saved. If it is, give the migration or compatibility decision (AGENTS.md safety).

## Checks

Run the new tests, `node --test tests/world_effects*.test.js` (or the focused W tests), `npm run -s check:arch` and `npm run -s check:rules`. Report each exit status. Write `r2/REPORT.md`.
