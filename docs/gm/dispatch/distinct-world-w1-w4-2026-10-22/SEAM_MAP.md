# Native seam map and acceptance gaps

Read from live primary source on 2026-10-22. Findings, not additional product
requirements. [Checkpoint](CHECKPOINT.md) owns authorization and writer status.

| Code | Existing authority | Binding to verify before claiming the W |
| --- | --- | --- |
| W1 | `material_lineage.js`: immutable process/key lineage; `material_lineage_domain.js`: native envelope validation; `processed_materials.js`: native outputs; `gear_work.js` / `gear_workshop_domain.js`: actual assembly/material consequences | The concurrent `material_treatment.js` adds two hide-preparation routes and a recipe quality reader. That alone is not W1: learning, tool consequence, advancement preparation and a changed operation still require proof. Avoid replacing or racing that module. |
| W2 | `simulation.js` / `simulation_effects.js`: jobs, people, finite resources and stock; `home_household.js`: paid appointments, finite supplier, leave/rest; `home_inheritance.js` / `heir_inheritance.js`: retained-holder settlement | Household pantry orders do not establish institutional office authority or automatic reserve-floor policy. Succession needs an actual living new officeholder, reviewed agreement and separation of institutional property from personal mastery/body/relationships. |
| W3 | `world_instances.js`: retained era/instance identity and clock; `lore_history_state.js`: causal receipts; `world_knowledge.js` and `simulation.knowledge`: observer evidence; present site/claim/people owners | Current history validation explicitly binds receipts to `base.frontier`, `Village` and the P3/P4 outcome vocabulary. Extend that owner deliberately for historical initialization, with immutable causes and real present consumers. A new parallel history array would violate the task. |
| W4 | `techniques.js`: observed/understood/owned/practiced execution; `energy_resources.js`: capacity/output/control/conversion/strain; P12 `world_adaptation/techniques.js` and host join: local practiced Mistglass methods | Concurrent engine E1 adds practiced sluice expenditure. Lower cost alone does not prove two paths with different intake/preparation or a quality/control result beyond throughput. Reuse it and test the remaining actual differences. |

Native entry substrate: existing local Options enrollment opens Iona's ledger;
Projects owns the Mistglass controls. Native host commands use detached plans and
current sequence, revalidate and publish through the incumbent save/transaction
path. Export/literal Import must pass the real envelope validators rather than
restore a helper object. Existing browser helper:
`../cultivation-spacing-2026-10-22/browser-helper.cjs` and `browser.cjs`.

Required failure cases remain in the checkpoint. Existing tests to extend/reuse:
`material_lineage.test.js`, `processed_materials.test.js`, gear-work tests,
`home_household.test.js`, `lore_history.test.js`, `world_instances.test.js`,
`techniques.test.js`, `p23-world-adaptation.test.js` and
`p23-host-joins-world-adaptation.test.js`. The names are source pointers, not
passing evidence for this task. Heavy native/suite work uses
`node scripts/test_queue.mjs browser|suite -- <command>`.

The checkpoint's six desktop cases are still required for changed controls.
A prebuilt/staged app or another chat's helper probe does not satisfy those
checks. No private player saves are needed for these disposable journeys.
