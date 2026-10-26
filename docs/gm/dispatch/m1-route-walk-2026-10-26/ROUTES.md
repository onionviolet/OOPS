# M1 route walk, 2026-10-26

Label: headless MCP; layout not verified. Findings are proposals, not accepted decisions. Step M1 of docs/MASTER_PLAYABILITY_PLAN_2026-10-25.md (MC3, MC14). No sealed content read; no debug tools used.

## Build identity (game_freeze, frozen build used for every session)

- Bundle SHA-256: 254b4495a38334a92cf9a2a2b05c1ac473b5d13c3ad923e23a0fec519efc226b
- Manifest SHA-256: 2203c75fdfa45298cbed23f20d64ace01633d36e3b55b5baef068dc8e3db0faf (117 inputs)
- Snapshot of the dirty working tree at freeze time, not the adopted v0.6-0e5bb8f76aef; not compared to F1's manifest.
- Seeds 11 and 22. Sessions r1, r1b (import check), r2. Screenshot backend present, not used (launch unverified).

## Coverage honesty

Reply size limited every route to about 6-8 calls instead of 40: each game_look/game_click repeats roughly 8k tokens of whole-screen text (reported once with game_report_limit). Routes 1, 3 and 5b were not walked past their entry. Only HP school got a real play-through slice.

## Route table

| Route | Natural entry | Reached | First friction | Fixture boundary | Persistence check |
| --- | --- | --- | --- | --- | --- |
| 1 Frontier ordinary life and making | game_new lands in Village. Find work (Tessa patrol, 2 h, 50 coins quoted), mixing counter, herb verge, gear workshop are listed | PARTIAL (entry and quotes seen; no work or mixing run) | Find work first click only expands a quote; second click is the commit. Action list opens with 80 items of panel chrome before the first game action | None needed for what was seen | Not done |
| 2 Mistglass | Projects > Optional projects > Mistglass shows from minute 0 | PARTIAL (visible, blocked) | Blocked reason says "Choose Follow local people and work first" without saying where that action is (limits doc: elder talk, 1 played minute, place Options tab, Iona's ledger) | Not reached; the prerequisite chain is natural per the doc but unwalked here | Not done |
| 3 Earned household/cohort | None found from a fresh life | NO (not walked) | Receipt chain needs an earned prefix (eight bread purchases, paid Cloudseed sealing, Mara delivery, studies, exams); impossible in budget | Receipt fixture: "actual old earned prefix" import (cohort-roster-ApyQPF/FbtBhV/j8G8zr) | Not done |
| 4 LOTM Tingen | All panels > Tingen workroom opens on a normal origin (no probe flag), titled "A disposable test start" with 4 begin choices | PARTIAL (panel reached; enrollment not started) | The 4 begin buttons are rendered disabled with the reason "Begin from the Village with nothing else under way", yet nothing is visibly under way (fresh life, only Projects panel open). Buttons are absent from the headless action list, so I could not click them | Disposable probe/test enrollment is the only start (by its own label). No ordinary in-world entrance seen | Not done |
| 5a HP school | Beginning panel > "Harry Potter · school life" > Confirm arrival (select value book.hp.school) | YES to lesson level | Select needs the pack id as value; blocked actions each repeat a long "Unavailable" paragraph (12 at once while a lesson ran) | None for entry or lesson; assessed repair continuation became selectable after glass-repair lesson (not run) | PASS: export (208 KB), game_new(path) in new session returned same clock 08:30 day 1 +30 min, same location, 5 parchment, shards, wand |
| 5b HP adult glass trade | Same Beginning select, "Harry Potter · adult glass trade" listed | NO (listed only, not entered) | n/a | Plan notes HP trade starts from an earned fixture; entry itself looks natural | Not done |

## Smaller observations (headless, unverified for layout)

- After import, the school "Around you" panel read "No known subjects here" and item values switched from "1 coins" to "1 W" (currency display differs between live and imported views). Unconfirmed in a browser.
- "Export Reward not available / available in 4:0:0 real time" appears in the action label for Export; unclear to a new player.
- Home pacing note "paused outside the home world" appears after leaving the Village; fine.

## Ranked friction for one M2 slice (max 5)

1. Blocked-action reasons that name a step without a place (Mistglass "Choose Follow local people and work first"; Tingen begin buttons disabled for "nothing else under way" with nothing under way). Evidence: r2 Projects panel text; r2 Tingen panel text.
2. Tingen start only through All panels (about 50 entries) and labelled a disposable test; no in-world entrance, and the begin buttons did not appear as actions. Evidence: r2.
3. Crowded unavailable lists: HP study room shows 12+ actions, most with repeated "Unavailable" paragraphs while one lesson runs. Evidence: r1 after starting glass-repair lesson.
4. Two-step Find work (quote then commit) and Beginning choice by hidden pack id; confirm the visible label is enough for a normal player. Evidence: r1 Find work and Beginning.
5. Import display drift (currency unit label, nearby-people panel) between live and re-imported view. Evidence: r1 vs r1b. Needs browser check before any fix.

## Not done / next

Walk Frontier work and mixing, the Mistglass prerequisite chain, Tingen enrollment via the probe URL, the HP adult trade, and the cohort fixture import. A delta-only view reply would make these cheap.
