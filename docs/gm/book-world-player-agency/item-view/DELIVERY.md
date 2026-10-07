# Fieldcraft native item view delivery

Added a pure view projection for the exact full and empty fieldcraft vial IDs/keys. `projectFieldcraftItemView(item, state, {name, description} = {})` returns `{name, description, identified, charge}`. A full vial is always physically one charge, while its display name changes to “Reed oil vial • 1 charge” only when the player's explicit opening, completed assay or maintenance, and understood reed-oil knowledge all agree. Its learned description gives one useful external application detail. Empty vials always carry zero charge and do not disclose their previous contents. Unrelated items retain supplied strings and are marked unidentified with no projected charge.

This module is read-only. It does not alter global templates, native inventory objects, IDs, quality, custody, counts, prices, or serialized state. It does not infer knowledge from purchases, loads, templates, or NPC records, and it does not own/cache a discovery ledger. Root retains all native display, tooltip, save, and runtime wiring.

Validation was limited to source syntax and static import/branch checks as assigned. No tests, player projection/evaluator, browser, save/reload, or NPC instance was invoked. Status: implemented-unverified; root still owns display integration and later playable acceptance.
