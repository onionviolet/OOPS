# R22c: fill the center and color the inventory, 2026-10-18

Candidate, technically verified; Weibao's visual/play acceptance stays OPEN (UR16).
[Checkpoint](R22C_CHECKPOINT.md) · plan row R22c, FC1–FC19 in the
[Round 15 plan](next-parts/round-15-whole-plan.md#fill-the-center-and-color-the-inventory-2026-10-18).
Built on R22b in the same branch, `claude/ui-r22b-screen-use`, so both merge together. Not merged,
not pushed. Rules: UR11, UR17, UR37, UR52, UX18 (FC13 dial); AR1, AR3; AD36.

## What changed

| Code | Change | Files |
| --- | --- | --- |
| FC11 | Opponent rows and Reports show names only ("Wolf rat"). Stacked rows sort by kind, no group headings. Appearance → Opponents → *Opponent letters*: Off (default), On hover, Always. Screen readers hear "Wolf rat, 2 of 3" | `src/village_workspace.js`, `src/layout_spec.js`, `styles/opponents.css`, `styles/combat_log.css` |
| FC12 | Hovering or focusing a combat line outlines its opponent's row (current wave only); hovering a row outlines its lines | `src/village_workspace.js`, `src/display.js` (slot on the line) |
| FC13 | With letters off, adjacent lines that read the same from one kind merge into ×N; the ×N list names each occurrence ("08:18 · Starving wolf rat 2 of 8"). Events stay distinct and countable. Letters on keeps R22's per-opponent lines | `src/combat_log.js` (`combatLogKey` `byKind`, `occurrenceLabel`), `src/display.js` |
| FC2, FC14 | Fight top centre splits: **Target** (name, a full-width health bar like You's, cycle, facts) and **Encounter** (opponents, defeated, per-kind left, groups left, clears). R22d adds the damage and hit tally | `src/village_workspace.js`, `styles/opponents.css` |
| FC3 | In a fight Stances sit under the actions on the left; the opponent list takes the whole right column | `styles/shell_layout.css` |
| FC4 | A selected item's detail opens beside the actions, idle too, so Around you stays whole; old rules that hid Around you or dropped the top-row fit now apply only where the detail shares a top region | `src/layout_spec.js`, `styles/shell_layout.css`, `styles/ui_tokens.css`, `styles/shell_chrome.css` |
| FC5 | Inventory tabs carry their items' kind hue: a colored top rule, colored count, tinted fill when chosen | `styles/inventory.css` |
| FC6 | The existing session "new item" marker reads as a yellow "new" tag in the shell | `styles/inventory.css`, token in `styles/ui_tokens.css` |
| FC7 | The inventory region has its own navy-to-teal tint; the item detail a purple tint (Proto23) | `styles/inventory.css`, `styles/ui_tokens.css` |
| FC17 | A fight opens Inventory on Usable when you hold any; the idle tab returns after. The stored preference is untouched | `src/proto23_shell.js` |

Found and fixed on the way (R22b defect): R22b raised the layout spec to 3, and stored Move to
placements only loaded when their spec matched, so any boxes moved with R21 would have reset. Spec-2
placements now load (each entry is still checked); spec 1 is still dropped (GU6).
`src/shell_layout_edit.js`, test in `tests/layout_spec.test.js`.

No `main.js`, save or engine change.

## Checks

Rebuilt worktree on 19496, fresh origins, browser checks one at a time.

| Gate | Result |
| --- | --- |
| [`check-r22c.cjs`](check-r22c.cjs) D1–D7 | Pass. D1 no visible letters on rows or log by default, the Always setting shows 8 row letters and log letters. D2 a line outlines one row; a row outlines only its own lines. D3 eight of one kind: 5 merged lines, the first lists 2 occurrences naming "Starving wolf rat 2 of 8" and "3 of 8". D4 Target and Encounter visible; Defeated equals the struck rows. D5 idle item detail beside the actions, Around you and actions visible, top row unchanged, no page scroll. D6 tab hues equal the kind tokens; the marker reads "new". D7 Usable in a fight, All after the fight flag clears (flag set by hand in the check) |
| [`check-r22b.cjs`](check-r22b.cjs) B1–B8 | Pass (B3 now reads the target's accessible name, since the screen shows names only) |
| `npm test` | 2,112 pass, 0 fail; spec reference updated for FC4 and the spec-2 placement case |
| `npm run check:arch` | Pass |
| CH1 gate H1–H6 | 6/6 |
| Inherited, one at a time | check-r22 C1–C5, check-r21b 9/9, check-r21 14/14, check-r20 12/12, check-r18 8/8, check-r17-preview 7/7, check-r16 16/16, check-r16-default 6/6, check-r15 4/4, check-r14, check-r13 26/26, check-r12 ticks / recipe 20/20 / success, check-r11-interactions |
| Check updates (deliberate changes, not product fixes) | `check-r20` read the defeated row's letter from its text; it now reads `data-letter` (names on screen). `check-r18` expected All in a fight; it now expects Usable there (FC17). `check-r22b` B3 reads the target's accessible name |

Screenshots (14px): [fight 1920](evidence/r22c/after/fight-1920-14.png) ·
[fight, hovering a line](evidence/r22c/after/fight-hover-1920-14.png) ·
[fight MacBook](evidence/r22c/after/fight-mbp-14.png) · [fight 1366](evidence/r22c/after/fight-1366-14.png) ·
[idle 1920](evidence/r22c/after/idle-1920-14.png) · [idle with an item 1920](evidence/r22c/after/idle-item-1920-14.png) ·
[idle with an item 1366](evidence/r22c/after/idle-item-1366-14.png).

## Gaps

- FC3 (Stances on the left) is CSS only: the fight fixtures have no Skills discovered, so it is
  implemented-unverified in a real fight with Stances.
- FC17's return path was checked by clearing the fight flag by hand, not by walking out of a fight.
- FC6's marker only changed its look; it appears for items gained after your first click (native).

## Open

- Weibao's visual check (UR16), with R22b.
- R22d: Encounter tally, misses out of the log, loot this trip (FC15, FC16, FC18).
- CH1 leak lint dormant-export failure (pre-existing, R22b report; trace proposed).
- Merge into `codex/gameplay-foundations` waits for Weibao's yes.
