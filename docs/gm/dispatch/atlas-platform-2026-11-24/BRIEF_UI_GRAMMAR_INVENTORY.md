# Lane brief: inventory of the shared UI pieces for the design grammar (2026-11-24)

Coordinator: Claude session (atlas platform). Model: Codex Luna, high. Mechanical inventory; read-only except the output file.

## Why

Weibao: "We can work on the design language and stuff". The plan (L1 and DC1-DC4 in the [atlas platform note](../../../reviews/WORLD_ATLAS_PLATFORM_2026-11-24.md)) names a small grammar of shared primitives with one implementation each. Before naming them, we need the facts on what exists.

## Do

1. For every module in `src/ui/` and the shared UI modules at `src/` top level (`ui_components.js`, `panel_kit.js`, `reference_kit.js`, `ui_ports.js`, `known_things.js`, `inspector`-style modules), record: what it draws, which candidate primitive it implements (box, box tab, row, verb row, fold, glyph token, meter, number known/estimated/unknown, report line, map node, motion beat, tooltip, inspector, other), its importers (count and list), and its stylesheet(s) in `styles/`.
2. Group the 783 entries in `tests/ui_contract_allowlist.json` by file and by rule; list the 15 files with the most entries.
3. List every panel home registered through `definePanel` (or the project's equivalent registry), with its file, so a later per-home design receipt (DC1) can be checked.
4. Note duplicates: two modules drawing the same primitive differently.
5. Write `docs/audits/UI_GRAMMAR_INVENTORY_2026-11-24.md` with those four tables and a short list of the clearest duplicates. No recommendations beyond naming duplicates.

## Rules

- Owned file: only that output file. Touch nothing else, commit nothing.
- Counts come from the current tree; say how each was computed.
