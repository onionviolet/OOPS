# HP window 3 receipt: the keeper of keys, book 1 chapter 4 (2026-11-03)

Follows [HP_WINDOW2_RECEIPT](HP_WINDOW2_RECEIPT.md), the [G3 and G8 note](HP_G3_NARRATION_NOTE_2026-11-03.md) and the [whole-world plan](HP_WHOLE_WORLD_PLAN_2026-11-03.md). Rules: AD36, AD43, AD44, AD51, AR1-AR16, CLR1-CLR13, LR2-H1, LSD199, LSD209. **Agent-verified, not human-reviewed.** Nothing committed or pushed. The tracked `dist/` was not rebuilt; the build below went to an isolated output folder.

## Boundary and route
- Scenes 00324-00335 of shard hp1c003 (12 scenes, all `en b1 c4`), from the knock-in to the coat; chapter 4 ends at p136. They became 12 acts, one per scene, each written from the cited paragraphs (CLR1).
- Route: a fresh origin through the finished acts of windows 1 and 2. `make-origin.mjs` begins the Harry life and plays the 23 earlier acts through the panel until the next task is `book.hp.lead.w3.arrival`. Window 2's completed checkpoint was not loaded (saved under a smaller pack; not tried).

## What changed in what Harry knows
- Hagrid and the Dursleys tell Harry the story. Every such note is an `instruction` attributed to the teller, so the Knows page reads "You were told" and nothing becomes a checked fact. Doubts are `inference` entries at the interpreted stage (shown as guessed).
- Chapter 1 stays out. The leak check changed its list because the telling now legitimately supplies Hogwarts, Voldemort, wizard, owl and similar words; it checks the chapter 1 just terms and later windows' terms instead (see check 6).
- Scene rows were not trusted. Scene 00329's choice (note now or in the morning) and 00335's choice (explain the expulsion or change the subject) are Hagrid's, so they are locked rows with a scene basis. Scene 00332's choice is Harry's own (accept or deny being a wizard, p115).

## Gaps
- **G10 owl post: the carrier appears, no new seam.** Harry sees an owl take Hagrid's note (p65-p68); his own letter reached him by hand. There is still no delivery owner in code (LSD446 is a LATER lane) and no HP events host. Smallest honest route: the act records the note as a fact (`w3.note.sent`) and Harry's observation; `tests/hp_lead_window3.test.js` shows the existing `world_events` reader already models a carrier route (a `via` carrier and an `audience`) that reaches the named recipient and no bystander. It is a unit test on the reader, not wired to the game. Wiring it needs a host that settles days for the HP life, a new shared seam, so I stopped there. Options: (a) a small HP events host like the LOTM one, (b) a delivery row kind in the act pack, (c) leave letters as observations until a window needs a reply deadline. Default: (c), dial: move to (a) when a letter must arrive on a day (the reply due on 31 July is not enforced), reason: no later window in book 1 depends on it.
- **G8 fame:** Harry is told he is famous (p45, p83, p101, p121) and doubts it. No NPC-side fame state is built; window 4 needs it. Back-test in check 7.
- **G7 purses:** no costs, no money and no items for Harry in any act. The cake, the coat and the sausages are things Hagrid did or lent, kept as facts (`w3.cake.given`, `w3.coat.lent`) and the hunger fact from window 1 is cleared by the sausages.
- **LR2-H1:** Harry holds no wand and uses no magic. Hagrid's umbrella is his instrument; Harry's notes call it a pink umbrella and a flash of violet light, nothing more. His own accidental magic appears just as a guess (p117-p119) and window 1's free act stays free.
- **Clock:** act minutes are fill, so the shell's weekday and day labels are still unproven (window 2's O2 carries over). The book says Tuesday just after midnight; the shell does not show it.

## Checks (one line each)
| # | State | Command / route | Input identity | Result | Gap |
|---|---|---|---|---|---|
| 1 | focused-tested | `node --test` on hp_lead_window1, hp_lead_window2, hp_lead_window3, hp_lead_life, world_pack_registry, world_pack_hp, hp_arrival_compatibility | tree of this session; `own_holdings.js` `70773758…` | 32 pass, 0 fail (school, trade and `book.hp` hash proofs are in hp_lead_life) | Not the full `npm test` (not run, by instruction) |
| 2 | source gate | `npm run check:arch` | | pass; main.js 10110 lines, baseline 10115 | main.js untouched |
| 3 | source gate | `npm run check:rules` | | PASS (1 warning, an untracked file linked from the index, not mine) | |
| 4 | rebuilt | `BUILD_OUT=<scratchpad>/bundle3 node build.js` | `dist/bundle.js` sha256 `cd579a47…`, `cast.json` `3993ae2b…` | built, 0 errors | tracked `dist/` and installed app not rebuilt |
| 5 | natural journey | `make-origin.mjs` (fresh game, Beginning panel, Begin, 23 earlier acts through the panel), headless 1920x1080 | `origin.json` `638ab783…` | next task `book.hp.lead.w3.arrival`, 0 page errors | |
| 6 | natural journey | generated `play-episode.mjs` (`gen-runner.mjs --pack private_packs/hp-cast/cast.json --id-prefix book.hp.lead. --panel hp --attr-prefix hp`) with a leak list of chapter 1 and later-window terms | same bundle | 12 of 12 acts in order through the task link and act button; facts and knowledge asserted per act; no item or money moved; no non-player knowledge key holds a window 3 entry; 0 page errors; export and Import keep position and facts | Act minutes are fill. The snapshot purse of 102 is the shell's native hero (window 1's O1, display-veiled) |
| 7 | back-test | `backtest.mjs` on the earned checkpoints | `earned-pig`, `earned-coat`, `completed-checkpoint` | the knowledge store holds one actor, the player; from `pig` on the Dursleys are in the other room and Hagrid in the hut, so the last act (participants: Hagrid just) started without them; the player holds 46 window 3 entries | NPC-side knowledge is not modeled at all, so the leak path does not exist yet; this test must be rerun when window 4 adds it |
| 8 | UI | `verify-ui.mjs`: each act is the next task from its predecessor checkpoint | earned checkpoints | 3 acts show one disabled "Not how it happened" row each (letter, vanished, coat), 9 show none; no forbidden word on the panel; completed checkpoint reads `arc.done` | Locked rows are presentation from the private pack; the engine refuses nothing because those commands do not exist |
| 9 | UI | same, Settings font size 14 then 21, 1920x1080 | `ui-14px.png`, `ui-21px.png` | computed panel font 14 px and 21 px, no page overflow | Panel text and layout not reviewed by a human |
| 10 | persistence | same: reload of the completed save; literal Import of the exported file | `completed-checkpoint.json`, `completed-export.txt` | both give the same digest (simulation, actors, position, inventory, structured record) | Installed-app persistence not run |
| 11 | cast | `build_cast_pack.mjs hp --from "en b1 c4 p1" --to "en b1 c4 p9999"` into `private_packs/hp-lead-w3/` | `cast-built.json` `c190af6d…` | 11 people, 22 rows added, 0 conflicts, 0 gaps. Mapped: Hagrid (spawned), Vernon, Petunia, Dudley, the hut | Text just, recorded in the pack's id map: Dumbledore, Voldemort, Lily, James, the letter signer, one more name from the registry join; the owl and the umbrella have no id |

## Open
- **O1** window 2's `play-episode.mjs` and `verify-ui.mjs` no longer run against the combined pack (the arc moves on). Window 3's `make-origin.mjs` replays windows 1 and 2 natively and is the current rerun.
- **O2** clock labels as above.
- **O3** Dursleys and Hagrid are role-tier in the cast pack; the Dursleys' side of the telling (their knowledge) is not modeled.
- Human review, the full `npm test`, the installed app, mobile and the tracked `dist/` rebuild are not done: **implemented, below the AD43 floor on those lines.**
