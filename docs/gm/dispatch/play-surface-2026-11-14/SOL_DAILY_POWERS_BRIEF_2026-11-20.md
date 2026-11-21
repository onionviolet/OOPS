# Sol lane: powers in daily life, one played slice (MC5 to MC7, 2026-11-20)

Read [the shared lane rules](SOL_UI_LANES_COMMON_2026-11-20.md) first. Lane id `daily-powers-sol`; evidence folder `docs/representations/evidence/daily-powers-sol-2026-11-20/`. Background: [walkthrough note, "Powers in daily life" and MC5 to MC7](PROTAGONIST_WALKTHROUGH_UI_ELEMENTS_2026-11-20.md#powers-in-daily-life).

## Weibao's words

"Channel that has a chance to be broken by enemy attacks? ways to prevent it> other aspects? Powers in daily life? ... Should we move things around?"

## Build one slice, Fang Yuan first

Pick one Gu Fang Yuan can already own and use, and one ordinary non-fight task it plausibly helps, such as a harvest, a search or reading a stranger. Pick from what the game already has. If no Gu fits a daily task with existing rules, stop and report the closest candidates.

1. **Shared reserve (MC7's brake).** The use spends the same primeval essence a fight would. A fight later that day starts with what is left. Add no new cap.
2. **Time in the day (MC5).** The use costs game time through whatever already advances time for that task. First check whether `src/cast_schedule.js` or `src/npc_schedule.js` actually plan the player's day. They may only project where people are. Use the real owner and report which it is. Add no second clock.
3. **Being seen (MC7).** If the task happens where others are present, whether anyone notices goes through the existing concealment and perception rules. Show what the player can know ("the herb seller glanced over"). Do not show a hidden roll.
4. **Where it sits.** The power is reached from the left column, beside the reserve it spends, following the walkthrough note's "Moving things around". Not as a new centre panel.

## MC6, report only

Find whether any existing NPC already uses a power outside a fight. If the observer rules can show it, describe one concrete case: the file, what the player would see, and where. Do not build it in this lane.

## Owned files

The Gu and task files you pick, plus a new `styles/daily_powers.css`, and tests for these. Do not touch `src/workspace_views.js`, `src/combat_situation_ui.js`, `src/tempo_fight.js`, `src/opponent_board.js` or `styles/combat_page.css`: the combat lane is editing them now. Do not touch `src/harvest_ui.js` or `src/gathering_panel.js` beyond the smallest hook. A later lane rebuilds them, so name any hook you add. Run `node scripts/rule_routes.mjs --for <path>` first, and read `docs/AREA_GUIDE.md` for powers and time.

## Done means

A played sequence: use the Gu on the task, see the reserve drop and the time pass, then start a fight the same day with the lower reserve. Include one witnessed use if a witness exists there. Save and reload, export and import, with the reserve and any witness memory kept. Report the files, the checks with exit status, which owner holds day time, and the MC6 finding.
