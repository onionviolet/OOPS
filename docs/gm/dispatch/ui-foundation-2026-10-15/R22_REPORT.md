# R22: combat log, 2026-10-17

Candidate, technically verified; Weibao's visual/play acceptance stays OPEN (UR16).
[Checkpoint](R22_CHECKPOINT.md) · [Round 15 plan](next-parts/round-15-whole-plan.md) (R22 row) ·
[NEXT_PARTS Part 2 Log](NEXT_PARTS_2026-10-15.md) (R1, W3, UX18, C2, C3, A5, IL55, IL60, KL19) ·
B6 · BX7 from the [R21 feedback](next-parts/r21-feedback-2026-10-17.md). Branch
`claude/ui-r22-combat-log` from `codex/gameplay-foundations` at `26eacdd15`. Not merged, not pushed.

Target: 1920×1080 primary, 1366×768 floor at 14px and 21px. Mobile deferred.

## What was wrong (before, reproduced)

In a fight with three or eight wolf rats the Reports column said "Starving wolf rat takes 1
physical" with no letter, so it could not say which rat; "Hero takes 3 physical" never said who
hit; "Hero evaded an attack" was most of the column; a defeat line ("Wolf rat was defeated") did not
say which one, while the board showed H defeated. Every log token went one color under a custom
palette. [Before shots](evidence/r22/before/).

## What changed

| Part | Change | Files |
| --- | --- | --- |
| Event on the line (R1, W3, IL60) | Each block, miss, hit and defeat passes a snapshot taken when it happens: encounter serial (one per Combat object, so a new wave is a new encounter), actor and target with side, native slot and letter, outcome, amount, hits, crit, partial block. Native text, RNG draws and order unchanged. Not saved (W3) | `src/combat_log.js` (new leaf), `src/models/combat.js` (one helper line, four call details) |
| Letters | The board's letter (`letterFor`, R20, one authority) appears when a side has more than one fighter: "Wolf rat B hits you for 2.4". One opponent gets none, as its card | `src/combat_log.js` |
| Dealt and taken (C2, C3) | Wording carries direction: "You hit Wolf rat H for 1.2", "Wolf rat H hits you for 3.1", "You crit…", "(2 hits, part blocked)". Your side's names are cyan, opponents' lilac; dealt values gold, taken values pink; a dealt hit has a cyan left rule, a taken hit a pink one. Color repeats the words, never replaces them (UR37) | `src/combat_log.js`, `styles/combat_log.css` |
| Quieter misses | "Wolf rat E misses you", "You miss Wolf rat H", "Rat C blocks you" in muted text, names unweighted | `styles/combat_log.css` |
| ×N (A5, UX18) | The next equivalent event on the newest line adds to its ×N: same encounter, actor slot, target slot, outcome, amount, hits, crit and block. Defeats never collapse. The ×N button lists each occurrence's in-game minute; the events stay countable. Parity shell only; classic keeps one line per event | `src/combat_log.js`, `src/display.js` |
| Defeat milestone (B6) | "Wolf rat H defeated": green, bold, wider rule | `styles/combat_log.css` |
| Report kinds (BX7) | One left rule per kind: combat (by direction), loot gold, crafting orange, discovery violet, events grey-blue, world dim | `styles/combat_log.css`, tokens in `styles/ui_tokens.css` |
| Custom palettes | Log roles map onto the palette's own contrast-recovered theme tokens (warning for dealt, danger for taken, accent for your side, text for opponents), instead of one forced color | `styles/combat_log.css` |

Shared-file touches: `src/display.js` +33 lines (one import, two helpers, two call sites in
`log_message`); `index.html` one stylesheet link; `build.js` one version line; `styles/ui_tokens.css`
one token block. No `main.js` or save change. `tests/p23-combat-options.test.js` injects the new
helper into its combat.js sandbox (it strips imports).

## Evidence (rebuilt worktree, fresh loopback origins, synthetic fixtures only)

Builds: before = HEAD `26eacdd15` bundle on 19521, after on 19520. Fixtures: parity-r9
`populated-three`, R20 synthetic `opponents-1` and `opponents-8-mixed`.

| Check | Result |
| --- | --- |
| `node --test tests/combat_log.test.js` | 4/4: letters only for sides of 2+, wording for every outcome, UX18 key separates actor, amount, crit, hits, block, outcome and encounter; custom palette roles ≥4.5:1 on five backgrounds and dealt ≠ taken |
| Seeded run, [`r22-rng.cjs`](r22-rng.cjs) | Pass on 8-mixed (55 events) and three (27): same combat events as the before build and the same turn counts and opponent health. Line order is compared as a multiset: same-tick swings interleave in real-timer order, which varies run to run on the before build itself (shown) |
| [`check-r22.cjs`](check-r22.cjs) C1–C5 | Pass. C1 every 8-mixed line names both sides with one letter, dealt and taken both present, no native wording left; one opponent has no letters. C2 a ×2 line opens two listed occurrences and closes. C3 Clear empties and the next event starts a new line; Stop records no event, ×N included. C4 contrast on the real line fill: lowest 8.45:1. C5 Reports width equal to before (501px at 1920, 394px at 1366 14/21px), no page overflow |
| [`r22-capture.cjs`](r22-capture.cjs) | 3 and 8-mixed at 1920×1080 14px, 1366×768 14px and 21px: 24 of 24 recent combat lines carry the event and a letter; page fits |
| `npm test` | 2090 pass, 0 fail, 3 skipped |
| `npm run check:arch` | Pass (7 main imports, 297 cycle edges, unchanged) |
| `check-r20.cjs`, `check-r21.cjs` | 12/12, 14/14 |
| `npm run check:rules` | 7 problems, the same 7 on a clean HEAD export (broken anchors in docs this round did not touch) |

Screenshots: [after 8-mixed 1920](evidence/r22/after/n8-mixed-1920x1080-14.png) ·
[after 8-mixed 1366 21px](evidence/r22/after/n8-mixed-1366x768-21.png) ·
[before 8-mixed 1920](evidence/r22/before/n8-mixed-1920x1080-14.png) ·
[before 8-mixed 1366 21px](evidence/r22/before/n8-mixed-1366x768-21.png).

## Gaps

- Custom palette in the browser: the token mapping and contrast are unit-tested; no live custom
  palette was applied in a rebuilt page. Implemented-unverified for the rendered colors.
- Classic presentation: unchanged by design (native text, no collapse); not re-captured.
- Reload: the log is not saved (W3), so nothing to round-trip; no save format change.

## Open (for Weibao)

- Visual check (UR16) at 1920 and the MacBook size.
- Misses still take one line per opponent per round with eight opponents: UX18 forbids merging
  different opponents. A round summary ("5 missed you") would be a new grouping, not ×N (IL26
  optional grouping). Proposal, not done.
- Merge into `codex/gameplay-foundations` waits for Weibao's yes.
