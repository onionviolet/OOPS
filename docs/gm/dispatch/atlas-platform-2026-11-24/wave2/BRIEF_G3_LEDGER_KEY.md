# Lane G3: play records which ledger row it exercised (Codex sol)

Read first: [OWNERSHIP.md](OWNERSHIP.md), then [ATLAS_LADDER_SOURCES_2026-11-24.md](../../../../audits/ATLAS_LADDER_SOURCES_2026-11-24.md) ("Biggest gap" and request A3), src/played_effects_domain.js, src/played_landing.js (read only), scripts/effect_landing_count.mjs, scripts/headless/trace.mjs (read only), docs/coverage/README.md, and the tests that cover those two files.

Problem: the ordinary-play landing counter records only `law` and `entry`. The 9 recorded landings come from a generic attack sentence and join to zero coverage rows, so the atlas can never show "proven in ordinary play" for any row.

Do:
1. Add an optional `ledgerKey` (a coverage row key such as `gu_kinds:vitality-leaf`, or an array when one entry point exercises several rows) to the `ENTRY_POINTS` rows in src/played_effects_domain.js where the entry point really plays that row's effect. Only set it where the connection is real and checkable (the entry point lands the same sentence the row's case expects, or calls the row's case module). Leave it absent elsewhere; absent is honest. List each key you set and the evidence.
2. Make scripts/effect_landing_count.mjs carry `ledgerKey` through to each landing record it emits, in every mode, without changing what default mode writes for entries that have no key (default mode must still be byte-identical for keyless entries). Do not run default mode; use `--start` or `--check` style modes or a fixture.
3. Tests: a keyed entry point emits its key; a keyless one emits none; the existing played_effects and landing tests still pass.

Rules: gameplay code. Keep the change minimal; no behavior change in play. Do not touch src/world_effects.js, src/force_effects.js or any file in OWNERSHIP's forbidden list, even if a key would be easier to set there; report it instead.

Run: the affected tests, `npm run -s check:arch`, `npm run -s check:rules`, and one scoped `node scripts/effect_landing_count.mjs --start <a start that reaches a keyed entry> --minutes 60 --actions 20` in a non-writing mode if one exists (report the mode and whether any keyed landing appeared).

Report: files, keys set with evidence, test lines, whether any ordinary-play landing now joins a row, gaps.
