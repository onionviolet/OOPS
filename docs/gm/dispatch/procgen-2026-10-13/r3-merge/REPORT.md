# R3-10 merge: G1 kit, GX5 appearances, P34 story spine

2026-10-14, branch `proc/r3-merge` in `.claude/worktrees/proc-r3-merge`, cut from `codex/gameplay-foundations` at `fd176f27`. Owner sessions (G1 `01a138cf`, GX5 `01a138d6`, P34 `01a138c8`) had finished and were not running; each CHECKPOINT records a complete slice with the merge left to root.

## Merges

| Order | Branch | Merge commit | Conflicts and resolution |
|---|---|---|---|
| 1 | `gen/g1-kit` `adaa4e18` | `4466a69b` | None (two new files) |
| 2 | `proc/gx5-appearances` `cb98f67f` | `60b5a818` | `src/main.js` load: kept both `restoreSystemsWorkshopAvailability` and `setProductAppearanceOwner` |
| 3 | `proc/p34-story-spine` `f9a95e6a` | `bafbb76a` | P34 had merged P1/P3/P4 itself from an older base. `expansion_engine.js`: kept workshop import and P34's stream/storylet/lore validators. `save_files.js`: kept base imports, added `validateStoryRequests`. `main.js` imports: kept base. `registerGeneratedPeople` read: kept wave 1's stream-derived `generatedPeopleSeed()` and added P34's `expansion:expansionState` |

## Checks (merged tree)

- `npm run build`: pass. `npm test`: 853/853, zero fail/skip.
- `scripts/lint_story_spine.mjs`: 15 cards, 1 request contract, no findings.
- `scripts/run_story_spine.mjs`: seed 43, 3600 played minutes, `sameSeedExact: true`.
- Browser, rebuilt bundle served from this worktree, SHA-256 `f7dad18199d29dbeada0ea531786b737106acc50e6b397d30747ef4d50d76225`, fresh `/private/tmp` profiles only:
  - GX5 journey (`gx5_journey.mjs`, port-only copy of the lane script): N1-N14 pass, including unidentified and identified Save/reload, Export and literal-file Import into a second fresh origin, second seed mapping differently, 1366x768 and 1600x1000, zero page errors. Evidence `browser_evidence.json`.
  - P34 natural journey (`p34_proof.cjs`, port and output-folder copy): elder, encounters, traveler, raise request, take, deliver Stale bread, recap, later same-person card, pending and completed Save/reload exact, Export then literal Import into a second profile exact, both desktop viewports, zero page errors. Evidence `NATIVE_CHECKPOINT.json` and screenshots.

## Open

- Two of three fresh seeds drew a Rat tail request; the natural script stops there because that stock has no easy buy route (P34 BACKLOG). Fine for play, but a player may meet a request they cannot cheaply fill.
- G1 kit is merged as a pure library; no live generator uses it yet (G1 REPORT lists seven dedupe targets).
- Wave 1 B1-B4 remain as recorded in STATUS; P34 S-1 covered part of B4 (storylets now cast generated travelers).
- Human taste acceptance for GX5 and P34 is Weibao's.
