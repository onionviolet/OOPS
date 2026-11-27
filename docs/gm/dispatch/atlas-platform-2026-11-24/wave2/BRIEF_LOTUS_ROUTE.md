# Lane: the Monarch Lotus route, first ordinary-play slice (Codex sol)

Read first: [OWNERSHIP.md](OWNERSHIP.md) for the forbidden list (do not touch those files), then [the Lotus acquisition proposal](../../../../research/MONARCH_LOTUS_ACQUISITION_LORE_2026-11-24.md), especially option O1 and **Working defaults D1-D3** (Weibao delegated the choice; build to them). Then the Gu keeper start: src/world_packs/book_gu_keeper.js, src/gu_keeper_refinement.js, src/world_packs/book_gu_keeper_refinement_trials.js, src/gu_keeper_potato_market.js, src/world_packs/book_gu_keeper_gardens.js, src/gu_aperture.js, src/book_world_gu_keeper_domain.js, and the existing Lotus case src/world_packs/gu_lotus_essence_case.js. Read AGENTS.md and the rules it routes you to for new gameplay code (architecture check, domain registry, save slices, UI rules).

Goal: a player in the ordinary Gu keeper start (book.ri.keeper) can, through normal actions, come to hold a Heavenly Essence Treasure Monarch Lotus and use it, so row `gu_kinds:fandom:Heavenly_Essence_Treasure_Monarch_Lotus` gains a real play route beyond the workshop demo.

First slice, smallest version of O1 that is honest:
1. **Precursor and recipe.** The player can obtain a rank three Heavenly Essence Treasure Lotus and the Monarch recipe knowledge through existing keeper routes (the steward market or a refinement trial), each with a visible, priced cost. Reuse existing title, custody and trade code; do not invent a generic shop.
2. **Springs (D1).** A small set of spirit springs outside the settlement, each with a named custodian and stated terms (price and an obligation). Advancing to rank four consumes seven spring charges through the existing staged refinement pattern; consumed springs stay consumed and say so. Seven is the lore count; how many distinct springs exist and their prices are authored dials, marked as such in code comments.
3. **Holding and use (D2, D3).** Any rank may hold the result. Using it refills the holder's own pool by the existing Lotus case's sentence, capped by the holder's pool capacity and a per-day cadence (authored dial). No stones.
4. **Persistence.** Every new piece of state lives in a save slice with save/reload and export/import round trips.
5. **Join to the ledger.** Add an ENTRY_POINTS row in src/played_effects_domain.js with `ledgerKey: 'gu_kinds:fandom:Heavenly_Essence_Treasure_Monarch_Lotus'` if, and only if, the use action lands the case's own sentence. src/played_effects_domain.js is open to you for that one row.

Tests: unit tests for each new module; one play test `tests/gu_lotus_route_play.test.js` that drives the real UI path from a keeper start (fast-forward with existing test hooks where the time is long) through precursor, recipe, seven spring charges, refinement, and one use, then save/reload and export/import, with a `// @ladder` manifest: scope "headless", route "fixture", honest checks only. Keep it under 240 s.

Run: your tests, `node --test tests/gu_*.test.js tests/played_effects*.test.js tests/effect_landing_count.test.js`, `npm run -s check:arch`, `npm run -s check:rules`, `npm run -s check:coverage`, `npm run -s check:docs`. Do not run `scripts/effect_landing_count.mjs` in default mode. Do not edit docs/coverage ledgers, prototypes/world-atlas, or the forbidden list.

Report: files, the player path in steps with the in-game time and costs it takes, the dials you authored, test lines and run times, and anything you had to leave out.
