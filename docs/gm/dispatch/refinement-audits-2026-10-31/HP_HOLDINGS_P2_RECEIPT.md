# Own-holdings P2: school and trade live readers, 2026-11-03

P2 of [OWN_HOLDINGS_PLAN](OWN_HOLDINGS_PLAN_2026-11-03.md), after [HP_HOLDINGS_P1_RECEIPT](HP_HOLDINGS_P1_RECEIPT.md). Rules: AD44, AD46, AD51, AR1-AR16, display only. **Agent-verified, not human-reviewed.** Nothing committed.

## What was wrong
`book.hp.school` and `book.hp.trade` showed the native Village hero's purse (102 coins) and mixed the hero's bread and pants into the item list, though the lives hold their own units, debt and stock.

## What changed (source-edited)
- New `src/hp_life_holdings.js`: registers `book.hp.school.world` and `book.hp.trade.world` with P1 readers. Purse reads the actor resources (`book.hp.school.allowance`/`.debt`; `book.hp.trade.coins`/`.debt`) from the expansion state, debt beside the units ("8 allowance units, 4 owed to the supply fund"; "12 trade units, 6 rent owed"; "no debt" at 0). Items read the **native inventory** (both lives declare `native-stock`; `people.player.inventory` is `native`, so `lifeHoldings().items` is empty for them) through the existing `character` port, filtered to the life's own item ids. Static text (wand and paper; wand and glass stock) is the fallback.
- `src/book_world_beginning_registration.js`: one call, `registerHpLifeHoldings()`, when ports exist. No pack data, hash, save or migration touched; main.js and display.js unchanged.
- `tests/own_holdings.test.js`: new test for both lives (live values, spend follow-up, debt 0, other-life and Village items excluded, fallbacks, Village null).

## Price/spend paths and the native purse (A: report only)
No hit. The school and trade pack data and extension have no `money` effect or cost; every price is a life resource (`allowance`, `coins`, `debt`) on the player or the trader (Elias 20 trade units). Nothing in these lives reads `character.money`. The native purse shown before P2 was display only. Not checked: native vendors reachable from these worlds outside the packs (none seen in the packs).

## Checks
| # | Command / route | Result | Gap |
|---|---|---|---|
| 1 | `node --test` own_holdings, hp_lead_life, world_look, world_pack_hp, hp_school_progression | 39 pass, 0 fail | no full `npm test`, by instruction |
| 2 | `npm run build` | built | tracked `dist/` rebuilt in the shared tree (already modified by others) |
| 3 | `npm run check:arch` | main.js 10110, display.js 6757, under baseline | |
| 4 | `npm run check:rules` | PASS (1 warning, untracked file not mine) | |
| 5 | headless Playwright, 1920x1080, isolated before bundle (registration removed) vs after bundle, `p2shot.mjs` | Before school/trade: "102 coins" and Village bread/pants. After school: "8 allowance units, 4 owed..." then after *introductory charms* items "paper x6" becomes "paper x5"; after *Repay* (earlier run) purse "4 allowance units, no debt". After trade: "12 trade units, 6 rent owed", items "glass fragments x2" becomes "glass fragments" after *Repair*. Shots: `/private/tmp/claude-501/-Users-weiwei-code-yet-another-idle-rpg/7ec4d183-6970-4fe2-a347-ecbe53084ae1/scratchpad/shots/{before,after}-{school,trade}/` | See row 8 for the trade unit spend |
| 6 | Same, 14 and 21 px, school and trade (after), Village (before and after) | Text identical at both sizes; Village purse "10C 2W", bread, pants, 60/60 hp identical before and after | Layout not human-reviewed |
| 7 | School, `p2persist.mjs` (scratchpad; same harness as the HP window `verify-ui`): charms lesson, 30 min step, `saveProgress`, page reload, then `save_to_file()` export and `load_progress` literal Import | Reload and Import digests (actors, simulation, position, inventory, structured record) equal the saved state; purse "8 allowance units, 4 owed..." and items "paper x5" identical after each; 0 page errors | Installed app not run |
| 8 | Trade, same harness: Repair (items: fragments x2 to x1), 15 min step (repaired pane appears), Walk to the glass counter, 10 min step, Sell one repaired pane | Purse "12 trade units, 6 rent owed" becomes "16 trade units, 6 rent owed"; items "repaired pane" gone after the sale. Reload and Import digests equal the saved state, purse and items text identical; 0 page errors | The earlier miss was the harness: the clock is paused, so jobs need an explicit step, and the workspace must be re-pointed at the Beginning panel before each click |

## Builds
After the first pass the tracked `dist/` was rebuilt in the shared tree (already modified by others). Later runs used the isolated bundles in the scratchpad (`out-after`, `snapb/out`); no further dist builds.

## Open
- **A1.** Closed (row 8).
- **A2.** Closed (rows 7 and 8).
- **A3.** The plan's "panes" show as "repaired pane" once made.
- **A4.** Installed app and human review not run.
