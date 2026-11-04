# HP window 2 receipt: the letters, book 1 chapter 3 (2026-11-03)

Follows [HP_WINDOW1_RECEIPT](HP_WINDOW1_RECEIPT.md) and the [whole-world plan](HP_WHOLE_WORLD_PLAN_2026-11-03.md). Rules: AD36, AD43, AD44, AD51, AR1-AR16, CLR1-CLR13, LR2-H1. **Agent-verified, not human-reviewed.** Nothing committed or pushed. The tracked `dist/` was not rebuilt; the build below went to an isolated output folder.

## Boundary and route
- Shard hp1c003 has 35 scenes. The chapter 4 boundary is read from the scene locators: scenes 00301-00323 cite `en b1 c3`; scene 00324 is the first with a `c4` locator (the keeper of keys breaks the door in, `en b1 c4 p14`). It belongs to window 3. The window ends at the knock (`en b1 c3 p116-p117`).
- 23 scenes became 15 acts. Each text was written from the cited paragraph (CLR1), not from the scene row.
- Route: a fresh origin through window 1's finished acts. `make-origin.mjs` starts a new game, begins the Harry life and plays window 1's 8 acts through the panel until the next task is `book.hp.lead.w2.hunted`. Window 1's old completed checkpoint was not loaded (saved under the smaller pack; not tried).

## What was wrong or forced a call
- Scene 00306, 00307, 00308 and 00318 list guardian choices as options. They are events inside the acts. Harry's own untaken options come from the text (p4, p16, p64, p68, p115), and the guardians' options (p33, p48, p57, p93) are locked rows with a scene basis.
- Scene 00307 says "wizard nonsense"; p52 says "dangerous nonsense". Built from the paragraph, heard and unexplained.
- Window 1's `play-episode.mjs` and `verify-ui.mjs` cannot run against the combined pack: once window 1 is done the arc moves to window 2, so `arc.done` stays false. Their proof is tied to the earlier pack. Window 2's `make-origin.mjs` replays window 1 natively and is the current rerun.
- Clock: act minutes are fill. The shell's weekday and day labels in window 2 are not proven against the book's Friday to Tuesday, and no owner carries the multi-week gap after the punishment. Left open (O2).

## Gaps
- **G10 owl post: receiving side just.** Chapter 3 shows no carrier; Harry sees the address following him (cupboard, Smallest Bedroom, Room 17), the routes escalating (mat, under the door, eggs, chimney, front desk) and Vernon taking each letter. No letter item, no sender actor, no new mechanism. The repo has no delivery owner in code (LSD446 lists letters as a LATER lane). The existing `world_events` reader is just unit-tested to keep a private delivery from its addressee and is not wired to an HP host. The carrier first appears in window 3.
- **G7 purses:** no costs, no money and no items in any act. Vernon's purchases (package, boat, rations) appear as things he did. "Everything he owned" going upstairs (p60) is knowledge just.
- **G3 and G8:** chapter 3 did not force either, so no stop. Chapter 1 and the prologue not enter Harry's knowledge; the overheard lines stay unexplained.
- **LR2-H1:** no wand and no use of magic by Harry in this window; the letters' makers are not seen.

## Checks (one line each)
| # | State | Command / route | Input identity | Result | Gap |
|---|---|---|---|---|---|
| 1 | focused-tested | `node --test` on hp_lead_window1, hp_lead_window2, hp_lead_life, world_pack_registry, world_pack_hp, hp_arrival_compatibility | tree of this session; `own_holdings.js` `70773758…` | 29 pass, 0 fail. The school, trade and `book.hp` hash proofs live in hp_lead_life | Not the full `npm test` (not run, by instruction) |
| 2 | source gate | `npm run check:arch` | | pass; main.js 10110 lines, baseline 10115 | main.js untouched |
| 3 | source gate | `npm run check:rules` | | PASS (1 warning, an untracked file linked from the index, not mine) | |
| 4 | rebuilt | `BUILD_OUT=<scratchpad>/bundle node build.js` | `dist/bundle.js` sha256 `b76f5c32…`, `cast.json` `89a685fa…` | built, 0 errors | tracked `dist/` and installed app not rebuilt |
| 5 | natural journey | `make-origin.mjs`: fresh game, Beginning panel, Begin, window 1's 8 acts through the panel, headless 1920x1080 | `origin.json` `ab238d24…` | next task `book.hp.lead.w2.hunted`, 0 page errors | |
| 6 | natural journey | generated `play-episode.mjs` (`gen-runner.mjs --pack private_packs/hp-cast/cast.json --id-prefix book.hp.lead. --panel hp --attr-prefix hp`) from that origin | same bundle | 15 of 15 acts in order through the task link and act button; facts and knowledge asserted per act; no item or money moved; leak check (chapter 1, prologue, wizard, school, owl, Hagrid and similar words absent from Harry's knowledge); 0 page errors; export and Import keep position and facts | Act minutes are fill. The snapshot's purse of 102 belongs to the shell's native hero, not the life (window 1's O1, display-veiled) |
| 7 | UI | `verify-ui.mjs`: each act is the next task from its predecessor checkpoint | earned checkpoints | 8 acts show disabled "Not how it happened" rows (9 rows), 7 show none; no forbidden word on the panel; completed checkpoint reads `arc.done` | Locked rows are presentation from the private pack; the engine refuses nothing because those commands do not exist |
| 8 | UI | same, Settings font size 14 then 21, 1920x1080 | `ui-14px.png`, `ui-21px.png` | computed panel font 14 px and 21 px, no page overflow | Panel text and layout not reviewed by a human |
| 9 | persistence | same: reload of the completed save; literal Import of the exported file | `completed-checkpoint.json`, `completed-export.txt` | both give the same digest (simulation, actors, position, inventory, structured record) | Installed-app persistence not run |
| 10 | cast | `build_cast_pack.mjs hp --from "en b1 c3 p1" --to "en b1 c3 p9999"` into `private_packs/hp-lead-w2/` | `cast-built.json` `1f5c1832…` | 10 people, 44 rows added, 0 conflicts, 0 gaps. Mapped: hut, Privet Drive, Figg, Marge, Piers, the three gang members, the three Dursleys | Unmapped, recorded in the pack's id map: living room, second bedroom, Figg's house, Railview Hotel (just in world hours), hotel owner, boat owner |

## Content notes (CLR6 fold test)
Choices kept: refuse the practice, say nothing about the dye, grab for the letter, ignore it, move rooms, creep down at six. Time: window 2 holds 15 acts in the book's order; the just stated durations are half an hour of shouting and the ten minutes to midnight, and all other minutes are labelled fill. Who was there: act participants are checked at the place and the family follows Harry's moves. Sealed secrets: none touched.

## Open
- **O1 cast depth:** Figg, the gang, the hotel owner and the boat owner are role-tier text (G11), not spawned.
- **O2 clock labels** as above.
- **O3 holdings note:** the shell line "You carry nothing of your own" sits beside p60's "everything he owned". Left for the holdings session; `own_holdings.js` was not touched.
- **O4** window 1's scripts need the pre-window-2 pack to rerun (see above).
- Human review, the full `npm test`, the installed app, mobile and the tracked `dist/` rebuild are not done: **implemented, below the AD43 floor on those lines.**
