# Duplicate and consistency audit: synthesis (2026-10-18)

Read-only audit by 12 Sonnet agents (S1-S4 src, T tests, D1-D2 top-level docs, D3 worlds, D4 reviews/audits, D5a gm, D5b gm/dispatch, D6 research). Each report lists exact paths, VERIFIED or SUSPECTED labels, and its own coverage gaps. Findings are proposals, not accepted decisions; nothing was edited except these reports. Counts below are as the agents reported them (D5a's own "2 high" tag was wrong; it is 9 med, 9 low).

| Report | Findings |
|---|---|
| S1 src 1-185 | 18 (3 high) |
| S2 src 186-370 | 22 (2 high) |
| S3 src 371-538 + merged files | 12 (1 high) |
| S4 src subfolders | 24 (2 high) |
| T tests | 23 (0 high) |
| D1 docs top 1 | 24 (3 high) |
| D2 docs top 2 + USER_VISION | 20 (2 high) |
| D3 worlds | 15 (1 high) |
| D4 reviews/audits | 22 (4 high) |
| D5a gm | 18 (0 high) |
| D5b dispatch | 17 (4 high) |
| D6 research | 14 (0 high) |

Merge check: the earlier merge left no conflict markers or duplicated hunks in main.js, simulation.js or simulation_effects.js (S3).

## Cross-area themes (same problem found by several agents)

**X1. Helper boilerplate cloned across src (S1-F1, S2-F1/F5/F6/F7, S3-F1, S4-F1, T-F5..F7).** `eq/all/check/natural/object/copy/same` and effect builders (`money/item/know`) are redeclared in about 79 files, and have drifted (argument order of `stamina`, JSON depth limits 16/24/30/32, `same` meaning stringify vs structural, `fail` having three meanings). The test side repeats it: the esbuild stub loader in 10 tests, hand-rolled fake DOMs in 8. Fix: one no-import leaf module (not `simulation_contracts.js`, which creates cycles) plus one shared test harness.

**X2. Cloned world binding stacks (S1-F3, S2-F2, S3-F2).** `book_world_mol_native`/`paradise_native` are 88% identical; `proto23_world_native`, `feature_expansion_nested_native`, `feature_expansion_destination_*` and four `steam_*` stacks share large blocks. Related stale claim: S2-F13 says two modules call Mother of Learning and Paradise unbound while native modules exist.

**X3. Hash/RNG copies (S3-F4, S4).** FNV and xorshift pasted in simulation.js, simulation_resolution.js, start_records.js, expansion_engine.js; `gen_kit.js` duplicates `mix32` from `seeded_streams.js`. Combat hit/evade math lives in three places (S4-F10).

**X4. Architecture ratchets do not bite (S1-F11, S2-F11, S3-F9, T-F12).** `check_architecture.mjs` passes with main.js +49 lines, display.js +103, save_files.js +54 over baseline; a 56-module import cycle exists (removing `simulation_effects.js:50` import shrinks it to 37); `trade.js` still imports main.js; main.js has 13 unused imports; `core_ratchets.baseline.json` allows 60 `Math.random` calls against 24 real.

**X5. Real runtime defects found while auditing (verify before trusting).**
- S4-F6: `src/data/traders.js:27,32` use template "Cafe trader", which does not exist (`inventory_templates.js` defines "Cat cafe"); `trader_component.js:118-122` indexes it unguarded. Inferred, not run.
- S4-F7 / T-F20: `src/mods/glassmaking.js` imports a missing file.
- T-F20: `src/absorb_p23/repeat_search/panel.js` is never mounted.
- S4-F9: seven "(proposal)" panels mounted on Local actions at `main.js:10009-10021`, against UR2.

**X6. Rule-code collisions (D1-F2, D2-F1/F2, D3-F1/F2).** Registered prefixes (CX, GR, SR, AU, MR, AR, AD) and others (SU3, NX1-NX10, OM3, WT2, IL12, CW3) are reused for unrelated local tables; sealed-secret "S1.." IDs collide with ordinary S-codes, and the `sealed/` folders that WORLD_SECRETS_AND_DISCOVERY points to do not exist. Four weaponcraft palettes overlap with colliding codes.

**X7. Acceptance status drift (D1-F1, D2-F4, D4-F2, D4-F1, D5a-F14).** RULES_INDEX lists GR/CX as "never binding" while the register and PROJECT.md say accepted. IDEA_INDEX and three core audits still call BHR/CBR/ECR/SLR "Proposed" while RULES_INDEX says "Accepted 2026-10-18" (D4 found no USER_VISION entry recording that acceptance, which needs Weibao's confirmation, not an agent edit). Six review passages say "M3 remains stopped" while the modular-seams checkpoint says it passed. AGENTS.md cites AD1-AD36 (index has AD38) and UR41-UR48 (UR49 exists).

**X8. Stale "never implemented / no name" claims (D3-F7, D4-F4/F5).** Docs say `buildLifeHeirSave` is never called and "no cheat is implemented" and "no game name is selected"; `src/main.js:2763` calls the heir builder, `src/cheat_cards.js` exists, OOPS was accepted. Line anchors into main.js/display.js are 1,000+ lines off (D3-F5, 355 of 4,598 sampled); 20 `file.js:N` citations are not links.

**X9. Duplicated docs and snapshots (D1-F12, D4-F3, D5a-F1/F2/F3, D3-F3).** `docs/ENGINE_AUTHORING.md` vs `docs/gm/book-world-completion-2026-10-06/RECOVERED_ENGINE_AUTHORING.md` (5 changed link lines, 44 dead links); the Core-rule reconciliation block pasted into six audits; 57 BEFORE/HISTORY snapshots (4.1 MB); 12 near-identical ASSIGNMENT.md; about 34% of `world-core-kit-2026-10-14/cards/` is identical template text; the viewport decision is restated in 8 places with drift, and THEMATIC_UI_AND_INFORMATION_DESIGN still sets 1366x768 as the default (D2-F6) against the 1920x1080 primary target.

**X10. Repository bulk and state conflicts (D5b, D6).** Dispatch holds 12,074 files (1.9 GB), 809 MB tracked, 482 byte-identical clusters (125 MB redundant between tracked files); drifted copies of `src/` live in three dispatch folders (main.js copies about 1.4 MB each); 41 `launch.py` copies in 22 variants; 265 files hardcode a Playwright path. Research has 66 identical-file groups (about 2.7 MB) and 278 unresolved relative links. State conflicts: `world1-full-completion` STATE.json says active while CHECKPOINT.md says ended and PROJECT.md:539 says paused; FUTURE_ACQUISITION_QUEUE says Magical Diaries is not owned though a finished pass exists; three sets of queue edits were never applied; four owners give different game counts. `SHARED_WORKTREE_PRACTICE.md:67` says push under existing authorization while AGENTS.md says push waits for a yes.

## Suggested order (proposal, for Weibao's call)

1. Fix the doc truth first, cheap and risk-free: X7 and X8 status/anchor drift, AGENTS.md counts, the SHARED_WORKTREE push line. Needs the USER_VISION acceptance question answered (X7).
2. X5 defects: the traders template name, the glassmaking import, the unmounted panel. Small, each needs a regression and a browser check.
3. X1/X3 as one structural change (shared leaf module), separate from behavior per AR rules, then X2 clones one stack at a time.
4. X4: make the architecture check fail on growth and refresh baselines in the same change.
5. X6 code collisions: add a prefix register entry rule, then rename local tables.
6. X9/X10 repo bulk: dedupe tracked evidence and snapshots; this touches history-like material, so decide what is kept as dated history first.

## Limits

Agents skimmed or machine-checked, not line-read: big palettes (LIFE_SIM_NORTH_STAR, ENGINE_EXPANSION), about 4,000 of USER_VISION's 5,300 lines, two 3,000-line book data tables and main.js/items.js (grep only), 114 CHECKPOINT.md bodies, per-game research dossiers. Tests were not run, the full suite was not run, nothing was built or browser-checked. SUSPECTED items (D4-F12, D4-F15, S4-F6's runtime throw) need verification before action.
