# Fieldcraft shared-admission review checkpoint

Read-only review completed 2026-10-06 against the four original fieldcraft modules, the eight-file integration patch/manifest, source qualification report/manifest, and the current root-owned shared publisher files. The active root checkpoint owns a combined Paradise campaign on schema 10.

Two P1 integration defects need adaptation before shared admission:

1. `nethackFieldcraftFacts` is absent from current `simulation_effects.js:simulationFacts`, although completion settlement recomputes support there. The feature patch omits this join, so required live support/scent checks are missing or stale at completion. Join the provider at the central fact boundary and make sure live completion context has current location/native vitals/inventory.
2. `validateNethackFieldcraft` requires `state.schema === 9`; current root campaign state is schema 10. Fieldcraft activation in the combined campaign would be rejected. Align with schema-10 publisher policy.

The patch input hashes match current content/host/feat integration surfaces only for `feature_expansion_content.js`, `feature_expansion_wave_host.js`, and `reference_gameplay_feats.js`. The item registry, simulation/effects, reference validator and main dispatch already contain root changes. Reapply those intended insertions surgically, preserving Paradise integration, group allowlists, root schema ownership and one durable main publisher. In particular, add `nethack_fieldcraft` to the current `simulation.js` reservation-return group list so canceled or unsupported accepted jobs refund reserved vials, care, stamina, knives and pins.

The content review found coherent declared costs and boundaries: Eda's finite seller stock and native coin transfer, separate ration/vial uses, actual dog and player care effort, consenting supported Rill, manual/dog branches to the same finite pins, native kit input/output, and optional once-only activation. The feat helper requires newly committed receipts and real item/knowledge evidence; retain its call within the shared post-commit feature-feat advancement path. Keep missing optional validator behavior inert and retain the existing legacy reference states.

No actions, previews, evaluators, tests, browser, save, or gameplay calls were run. This is not behavior proof. New gameplay remains implemented-unverified with the acceptance gates in `docs/gm/nethack/ACCEPTANCE_BACKLOG.md`. Exact source fingerprint and finding evidence are in `REVIEW.json`.
