Lane: implementation considerations for YAIRPG design parts 28-39. Weibao
(2026-10-14): "more to consider? other stuff and more? save and extend
accordingly Send out codex as usesful? Subtle stuff too? Overarching stuff?
Implementation considerations and more?"

Read `docs/gm/dispatch/relationship-prereqs-2026-10-14/runs/COMMON.md` first and follow it.

You own only:
- `docs/worlds/world-depth-2026-10-13/40_IMPLEMENTATION_CONSIDERATIONS.md` (create)
- `docs/gm/dispatch/relationship-prereqs-2026-10-14/IMPL_REPORT.md` (create)
Read every other file; edit none. Other lanes are still writing parts 33, 35
and 37; read whatever exists of them.

Read: parts 28-39 in `docs/worlds/world-depth-2026-10-13/` (39 is the
overarching principles, especially OA17-OA30 joins and risks; 32 is the
social spine with build order SSB1-SSB10), `docs/ENGINE_AUTHORING.md`,
`docs/ENGINE_EXPANSION.md`, `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md`,
`docs/V06_MIGRATION.md`, `docs/PANEL_KIT.md`, AGENTS.md verification rules.

Investigate the actual code (cite file:line, label SHOWN/INFERRED):
- Save path: format, guarded write (`src/main.js:421` area), import/export,
  migrations, validators, current typical save size and localStorage limits;
  measure a fresh save if you can without touching personal saves.
- Simulation and chronicle stores, effect pipeline, cause receipts, clocks
  and advancement (`src/simulation*.js`, `src/chronicle.js`,
  `src/expansion_engine.js`), reservations, routines, offline handling.
- Content and pack pipeline: structured packs, private packs, ink
  (`scripts/compile_feature_ink.mjs`), authoring validators.
- UI: panel kit, display log, people notebook; desktop 1366x768.
- Build and tests: `build.js`, esbuild bundle (about 5 MB), `tests/*.test.js`
  conventions, browser-check patterns used in prior dispatch folders.
- Performance: tick cost hot paths, how many people/rows the loop touches.

Part 40 contents:
1. Code reality: what the shared engine pieces the parts need can reuse
   (signal registry, pattern counters, person card, value weights, spirits
   band, home record, claim/news object, obligation rows, carriers, age
   facts), each mapped to an existing seam or marked new.
2. Save strategy: budgets, compaction, additive fields versus migrations,
   compatibility decisions, old-save behavior, import validation; one
   proposed policy per new store.
3. Architecture options for the OA17-OA24 joins, with a recommended default
   and the alternatives kept reachable.
4. Authoring pipeline: how a content author adds a person, custom, signal,
   value-tagged act or institution cheaply; lint and fixture needs (sealed
   text, hidden-layer reads, age floor enforcement as a shared predicate).
5. Testing and acceptance: unit tests, fixtures, rebuilt browser evidence at
   1366x768, save/reload/import proofs; what a done slice must show.
6. Performance and scale budgets with proposed numbers labeled INFERRED.
7. Risks and sequencing: what to build before content scales; conflicts with
   files other active work owns (check git status and dispatch folders for
   live owners, especially `src/main.js`).
8. A concrete first implementation slice proposal (part 32 SSB1-SSB3 or
   better), with files touched, save impact, tests and acceptance cases,
   specified not run.
Also propose the index row for part 40 in the report (do not edit the index).
