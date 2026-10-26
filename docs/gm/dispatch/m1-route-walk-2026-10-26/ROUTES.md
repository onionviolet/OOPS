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

## Second pass, 2026-10-26 (compact view, IPC17)

Label: agent-verified, not human-reviewed. Headless MCP worker driven with `view:"compact"` (about 30 calls per route; layout not verified). Seeds 11, 22, 33, 251042, 251043. The walks drove the live working tree through `scripts/mcp/game_worker.mjs`, not a frozen copy. A `game_freeze` at the end gave bundle `dc341c58254ce4ea2f70a276dbd25ab263205165a7d32320d6614f02649ebba6`, manifest `f9a19ae7e0c5bcea3c2ec9901cba5c6ef8e47a1adbd1d5157b799b6d97a4ed2a` (121 inputs); the MCP regression's freeze matched it, so the tree did not change during the walk. These replace the first-pass hashes above for this pass. Persistence check = `export`, `load`, compare clock, location and a route fact.

| Route | Status (IPC8) | Walked | First friction | Persistence |
| --- | --- | --- | --- | --- |
| 1 Frontier work and mixing | Reached naturally | Find work (quote, then Patrol commit), 125 min step (5 coins paid, 10 to 15), mixing counter, bought 1 River bellleaf (8) and 1 Spring water (2), mixed one vial | Find work quote and commit are two clicks. After the paid round the log says "Patrol blocked: return the loaned kit" before any hint of where to return it. The mixing panel reports purse "142" while inventory reads "14C 2W" (coin units differ) | PASS: after export/load, "Latest finished mix: Striped clay vial ... Made: 1 vial" is still shown |
| 2 Mistglass prerequisite chain | Reached naturally (9 clicks, no fixture) | Elder hello, back, 1 min, place Options, Iona's work ledger, Follow local people and work, Projects, Optional projects, Mistglass, Enter; reached "Learn the conservatory method" and "Trade with conservatory keeper" | Blocked reason "Choose Follow local people and work first" names the step, not the place (Options tab > Iona's ledger, a 54-action list). The elder's dialogue also shows a raw "text not found, id: 'Ask about the moonlit herb bed'" line | PASS: location Mistglass conservatory and its 3 actions survive export/load |
| 3 Earned household/cohort | Two parts. Household entry reached naturally; the cohort exercise is fixture-prepared (cohort-roster receipt "actual old earned prefix" imports; not re-imported here) | Homes > Choose a home beginning > "Shared household" (also ducal and royal manor entries): arrived in Family longhouse room, 2 days stepped | Panel ids for cultivation and family are not guessable (game_report_limit filed). The earned cohort chain (bread purchases, Cloudseed sealing, Mara delivery, studies, exams) has no short natural path | PASS for household: day 3 08:00, Family longhouse room after load. Cohort not tested |
| 4 Tingen | Fixture-prepared (localhost `lotm_probe=1` URL, the game's own disposable start). On the ordinary origin the begin buttons are absent from the action list | Probe URL, Tingen workroom, Begin as a Nighthawk probationer: Tingen supervised workroom, Seer and Corpse Collector pathways, merit watch proposal | Ordinary origin: all 3 begin buttons show "Begin from the Village with nothing else under way" and cannot be clicked, with nothing under way | PASS: location Tingen supervised workroom, day 1 08:00 survive export/load |
| 5a HP school | Reached naturally (first pass) | See above | See above | PASS (first pass) |
| 5b HP adult glass trade | Reached naturally | Beginning select (value `book.hp.trade`), Confirm arrival into the Diagon Alley workshop, repair a pane (10 min), walk to the counter (5 min), sold it to Elias: 12 to 16 trade units, till 20 to 16 | Select value is the pack id again; "Insufficient, stale or unavailable item quantity. Refresh the trade." remains in the log after a successful sale | PASS for location and clock (08:15, glass counter); the trade purse was not re-read after load |

New friction not in the ranked list (propose for M2): the Mistglass blocked reason points to no place (already item 1); the raw "text not found" dialogue line; stale "Refresh the trade" message. One tooling limit filed with `game_report_limit` (panel ids not discoverable). Compact mode itself: indices from an earlier reply go stale after any change, so re-read or click by key.

## Not done / next

Superseded by the second pass above. Still open: re-import the cohort receipt fixture, and a browser check of the layout.
