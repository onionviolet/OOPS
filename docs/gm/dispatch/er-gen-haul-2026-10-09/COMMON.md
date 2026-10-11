# Er Gen haul 2026-10-09: shared rules for all five runs

Dispatched 2026-10-09 by Claude Code at Weibao's request ("send out new
codex book collection runs accordingly for my er gen haul"). Five parallel
Codex runs, one per book. Each run is the coordinator for its own book only.

Follow [NOVEL_SOURCE_GM_PROMPT.md](../../NOVEL_SOURCE_GM_PROMPT.md),
AGENTS.md, [SUBAGENT_RUN_RULES](../../../research/novels/SUBAGENT_RUN_RULES.md)
and the method of the [2026-10-09b wave](../novel-wave-2026-10-09b/ASSIGNMENT.md):
- Read the supplied book in full. These are long (1,000 to 2,100 spine
  members), so split into bounded chunk readers (about 100 to 150 chapters
  each). Qualify one representative chunk yourself before batching. Keep at
  most three of your own readers live at once; four other runs share this
  machine.
- Never modify, move or delete the source files. Never commit raw prose.
  Derived notes go only in your own gitignored folder
  `docs/research/novels/er-gen-haul-2026-10-09/<slug>/`. Do not write in
  another run's folder or in any finished wave's folder; cite them instead.
- Research only: no `src/`, builds, saves, Calibre writes or commits.
- Do NOT edit `docs/LIFE_SIM_NORTH_STAR.md` or any other shared doc. Five
  runs would collide. Put your proposed subsection in your folder as
  `NORTH_STAR_FINDINGS.md` (paraphrase only, marked proposals); Claude Code
  integrates the five afterward.
- Record file sha256 and the ordered chapter list in INTAKE.json.

## Prior work to extend, not repeat

[ER_GEN_AND_GU.md](../../../research/novels/xianxia-masters-2026-10-08/ER_GEN_AND_GU.md)
and its [REPORT](../../../research/novels/xianxia-masters-2026-10-08/REPORT.md)
built Er Gen ladders from wiki indexes and discussion only, with no full
reads. Confirm, correct or extend every row that touches your book, and say
which wiki-index claims the text contradicts or never supports.

## Lens

Use [LIFE_SIM_NORTH_STAR.md](../../../LIFE_SIM_NORTH_STAR.md) and
[WORLD_CARDS.md](../../../WORLD_CARDS.md). Weibao's lasting interest in Er
Gen (see the xianxia-masters F5): personal insight that grows out of work,
loss and relationships, and power that changes function rather than size.
For your book:
1. **Progression:** the full ladder as the text gives it, each breakthrough's
   gate, what it actually changes (a new operation, a new dependency, how
   people treat you) and how it fails.
2. **Insight and Dao:** how comprehension happens on the page, what triggers
   it, false or harmful insight, and whether it is book-local.
3. **The protagonist's cheat** and every other priceless or harmful
   advantage: rules, costs, limits and how they break.
4. **Body, soul, clones and avatars** kept separate from the main ladder.
5. **Crafts and ordinary life:** alchemy, formations, artifacts, sect work,
   trade, debt, family, teachers and friends.
6. **Sects, factions, followers and politics.**
7. **Worlds and crossing:** map growth, what transfers, how outsiders are
   treated, shared-universe links to the other Er Gen books (cite chapter).
8. **Enemies and their powers,** including run-ending threats.
9. **At least twenty small touches** mapped to vanilla YAIR.
10. **One draft world card** (original names) and **one cheat card** if the
    protagonist's advantage is distinct.

## Output (in your folder)

1. REPORT.md: a short plain-language summary first.
2. DOSSIER.md plus per-chunk notes.
3. PRIOR-CLAIMS.md: the reconciliation against ER_GEN_AND_GU.md.
4. Five to eight ranked proposals. Proposals are not decisions.
5. NORTH_STAR_FINDINGS.md as above.
6. CHECKPOINT.md, saved as you go, and run validation (hashes, coverage,
   link check) before claiming completion.
