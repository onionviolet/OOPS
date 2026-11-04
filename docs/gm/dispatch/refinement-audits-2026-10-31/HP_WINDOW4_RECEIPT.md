# HP window 4 receipt: Diagon Alley, the vault, the wand shop, book 1 chapter 5 (2026-11-04)

Follows [HP_WINDOW3_RECEIPT](HP_WINDOW3_RECEIPT.md) and the [whole-world plan](HP_WHOLE_WORLD_PLAN_2026-11-03.md) (row W4). Rules: AD36, AD43, AD44, AD51, AR1-AR16, CLR1-CLR13, LR2-H1. **Agent-verified, not human-reviewed.** Nothing committed or pushed. The tracked `dist/` was not rebuilt; the build below went to an isolated output folder.

## Boundary and route
- Scenes 00501-00509 of shard hp1c005 (`en b1 c5 p1-p247`): the owl at the window to the train home. Scene 00510 is the first with a `c6` locator and starts window 5. The nine scenes became 21 acts, each written from the cited paragraphs (CLR1); the scene rows name things the paragraphs do not (the pale boy's name, the owl's name), so the pack uses "the pale boy" and no owl name.
- Route: `make-origin.mjs` begins the Harry life and plays the 35 acts of windows 1-3 through the panel until the next task is `book.hp.lead.w4.wake`.
- Private files: `docs/research/novels/harry-potter/private/hpw4-ch5-2026-11-03/` (build-episode, make-origin, play-episode, verify-ui, backtest, earned checkpoints). The cast pack `private_packs/hp-cast/cast.json` now holds W1-W4 (the pre-W4 copy is `cast.json.bak-20261103-pre-hp-w4` there).

## What changed in the shared code (tracked, name-free)
- `src/coin_ladder.js` (new, pure): a display ladder over one integer of the smallest coin. No names or rates; the ladder is pack data.
- `src/book_world_hp_lead_pack.js`: merges `pack.items` into the native life; validates `currency` and `items`; **rejects a pack whose act writes knowledge to someone who is not in that act's participants** (the leak-free rule is enforced at load, not authored by hand).
- `src/book_world_hp_lead_domain.js`: live holdings readers. The purse is the player's own resource under the pack's currency key on the pack's ladder; items are the life's own declared items from the native stock. Absent pack or resource falls back to the old "no money of your own".
- No `book.hp.school`/`trade` data, no `book.hp` hash, no `own_holdings.js` (`70773758…` unchanged), no main.js line.

## Gaps
- **G7 per-owner currency.** Money is one integer of Knuts per holder, as an actor resource: Harry's purse (the player), the vault (an account actor, not a person), Hagrid's coat, the wandmaker. Rates 17 Sickles to a Galleon and 29 Knuts to a Sickle (p136) are the pack ladder, display only (1 Galleon = 493 Knuts). Every act asserts exact balances for each holder and that native `character.money` does not move.
  - Debits are `costs`, credits are `effects`. The withdrawal is a vault cost plus a purse credit (30 Galleons); the wand is a purse cost (7 Galleons, p237) plus a wandmaker credit and the wand's transfer.
  - The owl's five Knuts (p16) are paid from **Hagrid's** coat, not Harry's. The tickets (p58) use Hagrid's bills, the owl, the ice cream and the hamburger are Hagrid's gifts: Harry's purse does not move for them.
  - The vault enters the engine at the counter act (the opening balance is a fill dial; Harry's start still has no resources, `hp_lead_life` still passes). Harry never sees a total ("a small fortune", p134), the shell shows only his purse.
- **G6 individually distinct wand (LR2-H1).** One item with its own id (holly, phoenix feather, eleven inches), not a stock wand. Three separate states, in time:
  - *use* (p230): the sparks act sets `wand.used`; the wand is still the shop's (asserted: in the wandmaker's inventory, not Harry's);
  - *allegiance* (p230-p235): a world fact `wand.answers_to = player`, set at the same act, and the brother-feather knowledge at the next;
  - *possession* (p237): payment act, `transfer` plus the 7 Galleons; asserted in the player's native stock only after it.
  - Counterexample: Hagrid keeps the pieces of his snapped oak wand (item in his inventory, `hagrid.pieces_kept`) and says he does not use them (`hagrid.wand_used = false`, p217-p219): possession without use. The three tried wands (p224-p228) show a wand held and waved with no answer (`wand.tried = 3`). No power, no method, no new rank system: "use" stays an event.
- **G8 fame as knowledge asymmetry, with NPC-side knowledge.** The knowledge store now holds a second kind of holder.
  - Bartender, two patrons and Professor Quirrell each hold a `fame.*` entry (they know who he is), the wandmaker too; Harry holds only his observation that they knew his name (and his recollection of Mr. Diggle bowing, p84).
  - The pale boy in the robe shop is a wizarding-family child next to Harry who never learns who he is (p171-p179). He holds exactly one entry, what Harry said aloud in front of him, with no identity.
  - Harry's inferences ("I know nothing, how can they expect great things", p242) are held by nobody else; Hagrid holds only what Harry said aloud.
  - What I did not model: NPC beliefs about NPCs, rumour spread, and how Hagrid learns (all other knowledge between NPCs). The leak path closed here is act-to-holder only.
- **Clock:** act minutes are fill. The text states ten minutes to get away (p90), five minutes to the train, twenty minutes at the owl shop; the weekday and day labels are still unproven (window 2's O2 carries over).
- **G10 owl post:** the owl is Hagrid's gift; his advice at the end (send a letter by the owl, p246) is told, nothing is delivered. No new seam.

## Fill dials (authored proposals, labelled fill in the acts)
Hagrid's coat 40 Knuts (a handful, p15); vault opening balance 1000 Galleons ("a small fortune", no number); amount drawn 30 Galleons ("enough for a couple of terms", no number); robes 3, parchment and ink 1, books/scales/telescope/ingredients 8 Galleons (prices unstated). Only the wand (7), the beetle eyes (5 Knuts a scoop), the unicorn horns (21 Galleons) and the rates are in the text; the last two are seen, not bought. Purse at the end: 11 Galleons.

## Checks (one line each)
| # | State | Command / route | Input identity | Result | Gap |
|---|---|---|---|---|---|
| 1 | focused-tested | `node --test` on hp_lead_window1, hp_lead_window2, hp_lead_window3, hp_lead_window4, own_holdings, hp_lead_life | tree of this session; `own_holdings.js` `70773758…` | 25 pass, 0 fail (window 4: ladder arithmetic, load-time leak guard, currency and item data, per-holder purse) | Not the full `npm test` (not run, by instruction) |
| 2 | source gate | `npm run check:arch` | | pass; main.js 10108 lines, baseline 10115 | main.js untouched by me |
| 3 | source gate | `npm run check:rules` | | PASS (1 warning, an untracked file linked from the index, not mine) | |
| 4 | rebuilt | `BUILD_OUT=<scratchpad>/bundle4 node build.js` | `dist/bundle.js` sha256 `c3cd5bd8…`, `hp-cast/cast.json` `766a34c3…` | built, 0 errors | tracked `dist/` and installed app not rebuilt |
| 5 | natural journey | `make-origin.mjs` (fresh game, Beginning panel, Begin, 35 earlier acts through the panel), headless 1920x1080 | `origin.json` `e2cff29d…` | next task `book.hp.lead.w4.wake`, 0 page errors | |
| 6 | natural journey | `play-episode.mjs` (hand-written; the acts move money and items, so gen-runner's plain mode does not apply) | same bundle | 21 of 21 acts in order through the task link and act button; per act: done fact, every player fact and knowledge effect, every other holder's knowledge set, exact Knut balances for four holders, native money unchanged, wand states in time, leak regex on Harry's knowledge; export and Import keep position, balances, wand and every holder's knowledge; 0 page errors | Act minutes are fill. An earlier attempt failed on a place chain I got wrong (pub, courtyard); fixed in the pack, origin regenerated |
| 7 | back-test | `backtest.mjs` on the 21 earned checkpoints | `earned-*.json` | every non-player store equals the writes of finished acts in which that person took part; no store before the pub; the wandmaker empty before the wand shop; fame held by 4 pub people and the wandmaker, not by Harry; pale boy 1 entry, no identity; no inference leaked; the Dursleys hold nothing | NPC-to-NPC knowledge not modeled (see G8) |
| 8 | UI | `verify-ui.mjs`: each act is the next task from its predecessor checkpoint | earned checkpoints | 2 acts show one disabled "Not how it happened" row (vault 713 package, gold cauldron), 19 show none; no forbidden word on the panel; completed checkpoint reads `arc.done` | Locked rows are presentation from the private pack |
| 9 | UI | same, Settings font size 14 then 21, 1920x1080, from the checkpoint after payment | `ui-14px.png`, `ui-21px.png` | computed panel font 14 px and 21 px, no page overflow; shell purse "Your purse contains: 11 Galleons" and items "Holly and phoenix feather wand, eleven inches" at both sizes. Along the route: "no money of your own" until the withdrawal, 30, 27, 26, 18, then 11 Galleons; items empty until the wand | Panel text and layout not reviewed by a human |
| 10 | persistence | same: reload of the completed save; literal Import of the exported file | `completed-checkpoint.json`, `completed-export.txt` | both give the same digest (simulation, actors, position, inventory, structured record) | Installed-app persistence not run |
| 11 | cast | `build_cast_pack.mjs hp --from "en b1 c5 p1" --to "en b1 c5 p9999"` into `private_packs/hp-lead-w4/` | `cast-built.json` `ec2674a9…` | 16 people, 42 rows added, 0 conflicts, 0 gaps. Spawned: bartender, two patrons (one is Mr. Diggle), Professor Quirrell, the pale boy, the wandmaker, and the vault account | Text only: Griphook (his lines are Harry's observations), Madam Malkin, the Minister, the owl; recorded in the pack's id map |

## Open
- **O1** the live purse reader depends on the pack carrying `currency`; with the pack absent the old static text shows. Intended.
- **O2** the vault total and the amounts drawn and spent are fill dials; a later window can overwrite them if a later book fixes numbers.
- **O3** window 5 starts at scene 00510 (the Dursleys' house, c6 p1) and must move the player from `book.hp.lead.homebound`; the wand, the owl-as-gift fact and the 11-Galleon purse carry over. The trolley's 11 Sickles 7 Knuts (c6 p157) is window 5's first real spend and should come from this purse.
- **O4** clock labels as in windows 2 and 3.
- Human review, the full `npm test`, the installed app, mobile and the tracked `dist/` rebuild are not done: **implemented, below the AD43 floor on those lines.**
