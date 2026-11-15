# Round 14 UI kit, 2026-11-15 (PS171; proposal, AD32)

One page with every shared form a new feature draws from, in round 14's grammar: box, box tab, verb row, Ready mark, known, estimated and "?" numbers, state tokens, glow, motion, tooltip, controls, empty and unknown, and the Reports line. Open `index.html` at 1920x1080. It is live:
- hover, press and Tab through anything;
- click the tabs, the verbs and the tooltip, which pins (Esc unpins);
- a demo loop every 4 s steps through near to ready (with one pulse), a new item's pulse, bar easing, a level tick, damage floating off a fighter with a darker remainder, a fallen fighter dimming in place, a tab waking, a running job and live material counts;
- r toggles reduce motion, p replays a beat, and the OS reduce-motion setting is honoured.

It links `styles/ui_tokens.css` for the PS103 state tokens and the tooltip fill. The box, tab and verb styles follow the [round 14 mock](../yair-columns-2026-11-15/), which Weibao liked.

| File | What it shows |
|---|---|
| kit.png | All twelve cells, still (`?still`) |
| kit-live-frame.png | A frame from the live loop: ready verb, eased bar, damaged fighter, awake Combat tab |
| kit-page2.png | Page 2 (`?page=2`, or the Page 2 button): forms from the DU review that had no owner. DU6 pale locked tabs, DU34 active-effects count (opened), DU21 start-screen load chip (clean and repaired), DU22 selected tile. DU14 two-sided fight panel and DU37 sigil tile in a compact form, agreed with the combat lane; the full fight screen is ui-drafts D6 |
| kit-tooltip-pinned.png | The tooltip pinned: chance, have/need per material, the XP breakdown and the interruption outcome |

Sources: rounds 14 to 16 in the [play surface considerations](../../docs/gm/dispatch/play-surface-2026-11-14/CONSIDERATIONS.md) (PS103, PS109, PS119 to PS157) and the [Discord UI elements review](../../docs/research/yair-upstream/DISCORD_UI_ELEMENTS_REVIEW_2026-11-15.md). Folded in from that review: DU1, DU2, DU3, DU8, DU10, DU11, DU12, DU19, DU20, DU29 and DU35. UI_RULES codes cited: UR32, UR43, UR52, UR100 and UR125.

Open points:
- Class names (`.box`, `.tab`, `.verb`, `.mark`, `.num`, `.k`) are the mock's. They change to match the frame ui-cohesion builds.
- Glow and motion (cells 4, 7 and 8) follow feel-finish's settled names and link `styles/feel_finish.css`: ready is a green inset edge (`--feel-ready-edge`) with one `feel-ready-pulse`; near is a 1px dashed gold outline; rarity is an inset glow on the row from `--feel-rarity` (`data-feel-rarity`), with no text glow; plus `feel-new-pulse`, `feel-tick-up`, the ☆ and ◆ marks, the hover, press and focus tokens, and `html[data-feel-motion=reduce]` for reduce motion.
- Quality grade names (fine, rare, masterwork, relic) are placeholders; each world names its own.
