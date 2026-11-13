# Zorian's research row: the ward question (2026-11-10, proposal)

Task from the parallel-systems group: give research its first lead-world caller (KNW13) in Mother of Learning. Status: agent-verified, not human-reviewed. Authority: proposals under AD32; KNW, STY and WKR rows are as written in their rulebooks.

## What plays

Zorian, once he holds Haslush's object-analysis lesson (the carried entry), can work out a narrower way to question the spell:

1. **Library shelf** (40 min, stamina): Ibery's divination shelf set beside the lesson. Interpreted entry.
2. **Three sealed-box trials** at home (15 min, one reserve cast and stamina each): an empty box, a warded box asked what the ward *is* (inconclusive, KNW14), the same box asked what it is *for*.
3. **Write-up** (30 min): the refined method, an understood entry.
4. **Consumer (FLR4, STY33):** `book.mol.zorian.arc1.identify_watch_refined` is a second route for the printed watch beat (c22 p104-107): 5 minutes and no cast against the original's 10 minutes and one cast. It stands for `identify_watch_purpose` in the arc chain (`ALT_DONE` in `mol_zorian_arc_one.js`); the two never both show.

Card line (campaign description) and the next-step route card come from `molResearchLine` and `molResearchRoute`.

## Where it lives

- `src/mol_zorian_research.js`: ids, the planner graph (`invention_planner`: goals, primitives, methods; `checkFeasibility`, `roadmapView`), facts, line, route. No store.
- Six command rows in `src/world_packs/book_mol_pack.js` (the pack is the authority for command data).
- Progress is derived from `book.mol.zorian.research.ward.*` knowledge entries, which the Zorian restart scope already carries (`knowledge: [/^book\.mol\./]`). World, reserve and receipts reset, so run two resumes at the next trial and the shelf is not reread (WKR13, KNW19, STY34).
- `inquiry.js` is deliberately not used: its slice is a top-level key that `scopedRestart` rebuilds from the anchor.

## Source grounding

Printed: c16 (Haslush's narrow question), c22 p104-107 (the watch). Authored: the shelf reading, the three trials, the notebook entry and every number (scene dials). Bank shapes: Magic Research 2 (research unlocks knowledge, the refined result lowers a cost and does not add reserve), Upload Labs (prerequisite queue over a data list), Academagia (study against a dated beat). No bank number copied (SKR11).

## Checks

| Check | Result |
|---|---|
| `node --test tests/mol_zorian_research.test.js` | 4 pass: order and costs, place gate, carry across `scopedRestart`, refined watch route (eligible, no cost, stands for the original in the chain) |
| `npm run build`, `check:arch` | pass (main.js growth -2) |
| `check:rules` | stops at `docs/STORY_RULES.md` broken link `gm/causal-endings/FATE_REDDIT_CLAUDE_HANDOFF_2026-11-10.md`, already on master and not touched here; receipts, direction sync, player text (0 new), names, continuity run singly: pass |
| `scripts/playtest/mol-research.mjs`, rebuilt bundle, 1920x1080, fresh origin | pass: fresh native Zorian start, named fixture (lesson entry), five earned sessions, reload, Export/Import, named clock-only jump to month end, automatic reset: entries crossed, reserve 8, receipt reset, no pageerrors |

## Gaps

- The earned private checkpoints (`mol-zorian-haslush`, `mol-zorian-ward-reader`) fail to load on current master ("Optional registration needs an explicit migration", content_packs.js), with or without this change. The browser route therefore starts fresh and writes the lesson entry as a named fixture.
- The refined watch route is proven at the command and fact level, not clicked in the browser (it needs the Arc 1 chain to the watch).
- One research row; trial results are fixed text, not rolled. Other lead worlds have none.
- Inquiry-style effort bars and a Knows-home grouping for research entries are not built.
