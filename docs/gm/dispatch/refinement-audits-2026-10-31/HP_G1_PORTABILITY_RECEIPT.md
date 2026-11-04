# HP G1 portability receipt (2026-11-03)

Task G1 of [HP_LEAD_RUN_START_2026-11-03](HP_LEAD_RUN_START_2026-11-03.md). AD51 seam work; no LOTM behavior change. Agent-verified, not human-reviewed. Nothing committed, no `dist/` rebuild, no browser, no full `npm test`.

Changed: `scripts/lotm_slice/gen-runner.mjs` (flags `--pack --id-prefix --panel --attr-prefix`, export `DEFAULT_WORLD`), `scripts/playtest/native-continuation.mjs` (options `panel`, `attrPrefix`), `scripts/lead_run/build_cast_pack.mjs` (options `placePrefix`, `districts`; flags `--place-prefix`, `--districts a,b`). New test: `tests/world_portable_tools.test.js`. Defaults are the old LOTM values everywhere.

- (a) PASS: `gen-runner.mjs` on kj3t `reviewed-episode.json --origin cast-before.json` before and after the edit is byte-identical (sha256 `d7dba67c…dec`). The committed `play-episode.mjs` is not pure generator output (hand-added `lastOk` checks), so the comparison is old generator vs new generator.
- (b) PASS: the cast compiler on `lead-run-2026-10-27/merged` with base `private_packs/lotm-cast/cast.json`, old vs new script: default run, `--places-only` (`2946c8ca…`) and `--whole-book` (28 added rows, `46609d5e…`) all give identical output hashes.
- (c) PASS (generator and test level): HP fixture (`book.hp.lead`, prefix `book.hp.lead.`, panel `hp`) generates a runner with zero `lotm` strings after line 1 (the generator's own path), `node --check` clean, constructing `NativeContinuation(session,{"panel":"hp","attrPrefix":"hp"})`. `NativeContinuation` with the HP options selects only `[data-hp-*]` and panel `hp` (stub page; no lotm selector seen). `buildCastPack` with `placePrefix: book.hp.lead.place.`, `districts: ['privet-drive']` resolves districts with no lotm or evernight string. Not run: the generated HP runner against a real browser and bundle (no HP pack or panel exists yet).
- (d) `node --test tests/world_portable_tools.test.js tests/build_cast_pack.test.js`: 21 pass, 0 fail.

## Open
- Fourth LOTM-bound seam, not mine to edit: `scripts/lead_run/build_crosswalk.mjs` (`runtimeCatalogue`) throws `world must be lotm or mol`, so an HP crosswalk cannot be built by `buildCrosswalk` or by the cast CLI when no `crosswalk.json` sits in `--merged`. The HP test supplies the minimal crosswalk shape by hand. The G1 lane or the content builder needs this routed next.
- `build_cast_pack.mjs` still defaults its fallback district to the first of `districts`; an HP pack needs its own district list in the build call.
- The generated runner still passes `?test_hooks=1` and reads `scripts/playtest/lib.mjs`; whether the HP panel exposes `simulationTestHooks.project('hp')` with `arc.next` is for the content lane.
