# PC1: making-path crosswalk and owner map (docs)

Read COMMON.md in `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/modular-chains-2026-10-14/` first. Folder `pc1/`.

Goal: show how far the live code already is from one shared chain shape. Map each making or resource path onto HV2 MODEL M1 roles (source, part template, operation, output batch, observation), extended downstream to refine, assemble, repair and salvage.

Paths to map (SHOWN with file:line): `src/crafting_recipes.js` (upstream; do not propose rewriting it), `src/mixture_state.js` and `src/mixture_native.js`, `src/alloy_equipment.js`, `src/field_workshop.js`, `src/artifact_workshop_*`, `src/systems_workshop_*`, `src/world_completion_materials_*`, `src/native_craft_transaction.js`, `src/gameplay_transactions.js`, `src/tag_store.js` (root says zero importers; verify), `src/rules.js`, `src/energy_resources.js`, gathering hooks such as `registerMixtureGathering`, and HV1 `git show proc/hv1-carcass:src/harvest.js`. Grep for any other making path the root missed.

Deliver in REPORT: one row per path (what each role maps to, save owner, transaction seam used, gaps); which seam every new stage should route through and why; owners in docs that rounds 1 and 2 missed; corrections to MDF1-MDF4. Ranked next steps that reduce divergence without a big-bang merge.
