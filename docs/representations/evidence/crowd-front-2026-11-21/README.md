# Crowds and bringing a target to the front (TF2 to TF5, 2026-11-21)

Weibao: "implement entirely" (TF6 in the [walkthrough note](../../../gm/dispatch/play-surface-2026-11-14/PROTAGONIST_WALKTHROUGH_UI_ELEMENTS_2026-11-20.md)), then "we dont need the fresh descriptors". Branch `feat/crowd-front-2026-11-21-r2` in worktree `~/code/yarpg-crowd-front`. The base commit `b31816241` is a snapshot of the primary checkout's uncommitted work after the combat feel polish (resume-2); don't merge it. Take the commits on top. The first branch, `feat/crowd-front-2026-11-21`, stood on an older snapshot and is superseded.

| Commit | What |
| --- | --- |
| `df539fe18` | Engine. A crowd is ordinary fighters plus a rank order on the battle (`b.crowds`). A blow at any member lands on the front. Sweep hits the first two ranks, each with its own lighter blow, and nothing carries past them. Single out (4 beats) pulls a chosen member to the front, and the rest may press in (keyed draw). A hurt front member falls back for a fresher one. The field is optional and validated on load. Every other fight saves nothing new, so the schema stays 7. |
| `914314090` | Card and encounter. TF2: the target row stays in view while the list scrolls. A crowd draws as one layered bar with a ×N chip and member picks, front first. TF3: a crowd fight keeps the chosen member's full row in a fixed slot above the moves, marked "Behind the front" until Single out. Single out stays in place, blocked with "Pick one behind." The new opener `ri.wolf.pack` is "Hold a gap in the wall against a wolf pack": five ordinary lightning wolves, or fewer if the wall is thinned, with parts and a tide kill per killed wolf. |

## Browser proof (offscreen WebKit, fresh origin per run, rebuilt bundle)

Fang Yuan's composed day save (`ri-fang-yuan-wild-gu` plus a Moonglow Gu) opens the encounter from its own button in the encounter list. [Log](crowd.log) · [1280 log](crowd-1280.log)

1. **Open.** The pack shows as one crowd row with ×5, and the slot shows the front wolf. Single out is blocked. [Frame](crowd-1-open.png)
2. **Pick D behind the front.** The slot follows the pick and reads "Behind the front". Single out unblocks. [Frame](crowd-2-picked.png)
3. **Single out, Quick strike, Sweep.** The engine and card both put D in front. The strike hurt D and no other wolf. The sweep hurt the front two and no others. [Frame](crowd-3-struck.png) · [1280](crowd-1280-3-struck.png)
4. **Save, reload, export and import.** The crowd order and front are the same after reload and after file import.
5. **The move strip held still** through every step: y=258 at 1920 and y=292 at 1280. The page logged no errors.

TF2, from the eight-opponent mixed fixture at 1280 where the list scrolls: a target at the end stays in view with the list scrolled to the top, and a target at the start stays in view with the list scrolled to the bottom. The list order is unchanged. [Frame](sticky-1280-pinned-end.png) · [log](sticky-1280.log)

Bar words: the combat feel lane removed every drawn state word from foe bars (Weibao: "we dont need the fresh and other descriptors"). The crowd bar follows it, drawing the fill and its ×N chip, with the words in the hover.

## Checks

- **`node --test`** on the 13 combat suites plus `tempo_crowd`: 135 of 136 passed. The failure is `ui_style_ratchet`, on `src/ui/book_craft_controls.js` (ownMarkup 4 to 5). It was there before these commits, and the combat feel receipt reports the same.
- **`npm run check:arch`:** exit 0.
- **`git diff --check`:** clean.

## Not built

- **Front width (MS4).** Every wolf can bite you.
- **Rout (MS6) and an observed count (MS8).**
- **Who carries Sweep.** Every crowd fight offers it today; it should come from a weapon or kit.
- **Not exercised:** a fallen member's fate window inside a crowd. The pack's terms finish at once.
- **TF1** (move the target row to the top) was not built, because it conflicts with TF2.
