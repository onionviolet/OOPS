# Lane Q1: how a Monarch Lotus could be obtained in ordinary play, from the lore (Codex sol)

Read first: [OWNERSHIP.md](OWNERSHIP.md). You own only `docs/research/MONARCH_LOTUS_ACQUISITION_LORE_2026-11-24.md`. Read-only everywhere else.

Weibao, on how a player should get a Heavenly Essence Treasure Monarch Lotus in ordinary play: "we can figure that out lorewise?"

Context: row `gu_kinds:fandom:Heavenly_Essence_Treasure_Monarch_Lotus` runs only in the effects workshop demo (src/world_packs/gu_lotus_essence_case.js, act "lotus" in src/world_packs/effects_workshop.js, test tests/gu_lotus_essence_play.test.js). Its ledger note cites rank four (ri:ch308:p82, ri:ch558:p9, ri:ch2235:p2) and the effect, producing primeval essence (ri:ch463:p2).

Do:
1. Lore: use `python3 -I scripts/check_passage.py --name "Heavenly Essence Treasure Monarch Lotus" --alias "Monarch Lotus" --alias "Treasure Lotus" --json` (and `--chapter`/`--chapters` to read around hits) to establish what the novel says: what kind of thing it is (Gu, plant, Gu house, resource point), where it grows or is held, who owns or guards it, how characters obtain, cultivate, trade or lose it, what it costs to keep, and what limits its output. Cite locators (ri:chN:pM) for every claim. Paraphrase rather than quote the novel, for the reason that its text is private. Mark anything inferred or uncertain.
2. OOPS today: read the Gu keeper start and Gu systems to see what acquisition routes exist (search src/ for gu_keeper, book.ri.keeper, gu_aperture, gu refinement, Gu trade or market, resource points, quests). List each route with its file.
3. Options: propose 2 to 4 lore-faithful ways a player could come to hold one in ordinary play, each with: the lore basis (locators), the OOPS route it reuses or the smallest new piece it needs, the cost and limits (rank gate, upkeep, output cap), what it means for balance (primeval essence is the core resource), and the ledger and proof consequence (which ladder rungs it would fill). Rank them; recommend one. Include one unusual option.
4. Open questions for Weibao, at most three.

Rules: proposal (AD32). No book text. No code changes. Report the doc path and the recommended option in three lines.
