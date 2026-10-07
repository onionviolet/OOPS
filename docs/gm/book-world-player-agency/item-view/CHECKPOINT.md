# Fieldcraft native item view checkpoint

Pure native display projection is implemented in `src/nethack_fieldcraft_item_view.js`. API: `projectFieldcraftItemView(item, state, {name, description} = {})` returns `{name, description, identified, charge}`. Exact frozen fieldcraft vial IDs and serialized keys are exported for static linking.

A full vial keeps its template name and description until both the actual optional fieldcraft opening receipt/player-opened flag and a player `reed_oil` understanding plus an actual completed assay or dull/fine-dull maintenance command exist. Then its view names reed oil, shows one charge, and explains the external fitting-bench use. Empty vials always show zero charge and retain their template identity; emptiness reveals no prior contents. Unrelated items pass through the supplied view strings unchanged. The module reads but never mutates item, template, inventory or state data.

Checks: `node --check` and static import/definition branch inspection pass. No projection invocation, evaluator, test suite, browser, save or NPC simulation was run. New display behavior is implemented-unverified; native rendering integration and playable acceptance remain with root.
