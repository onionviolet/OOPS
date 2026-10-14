# Cheat save field (C0) and status window (CH1): until-done goal (2026-10-13)

Authority: Weibao, 2026-10-13: "coordinate the cheat save field, then build
the status window, use codex accordingly". Design owners:
[CHEAT_LIBRARY](../../../CHEAT_LIBRARY.md) (card fields, phases C0-C6),
[PANEL_KIT](../../../PANEL_KIT.md), card CH1 in
[CHEAT_PANEL_CARDS.json](../panel-kit-2026-10-13/CHEAT_PANEL_CARDS.json).

Status: Foundation R15 root approved 2026-10-13; this lane is R15 G8 (FA23 UI).
C0 runs on branch `ui/cheats-c0` in `.claude/worktrees/ui-cheats-c0` (from
219270e4, contains b0461b75); root merges, clean-builds and pushes. Ports
18321-18329. C0 gate frozen in GATE_C0.sha256; CH1 + optional-start gate is
written after the merge.

## Phases

1. **C0, in a worktree** (`ui/cheats-c0`): `src/cheat_cards.js` (schema,
   validator), optional `save.cheats = {schema:1, held:{}, known:{}}`
   (missing = empty), minimal named hunks in `src/main.js` and
   `src/save_files.js`, tests for old-save load, round trip and invalid card.
   Root merges.
2. **CH1 status window, UI-only** on the panel kit after the merge: panel
   `status-window`, discovered from a held card whose first system message is
   persisted, showing known level, stats, titles, points and quests; setting
   `panel.status-window.density`; reveal once; no name before discovery.

## Acquisition (decided 2026-10-13)

Weibao chose an **optional start** as the first route, keeping every other
route possible ([AQ1-AQ14](../../../CHEAT_LIBRARY.md#acquiring-cheats-routes-rarity-and-types-considerations-2026-10-13)).
Phase 3: the new-game flow offers "Begin with a system" (pick the system card,
"surprise me", or no cheat). Choosing it writes a held card to `save.cheats`
through real game code and emits the first system message, so CH1 is reachable
by natural play from a new game.

3. **Optional start** in the new-game flow (hero creation or the existing
   "Your beginning" panel): opt-in, default "no cheat", choice recorded in the
   life record. Proposal after Weibao's progression concern (2026-10-13): the
   card is held **dormant** (ST11) and awakens on the first won fight or day 3,
   whichever comes first, writing its first system message; the status window
   appears only then. Unlock gates US1-US5 come later behind a per-world dial.

## C0 done check

`checks/c0_gate.cjs` (REPO = the worktree, URL = 18321) exits 0:
Z1 card/state validators, Z2 old save gains empty `cheats`, Z3 held card
survives save, reload, Export and literal-file Import into a new origin, Z4 an
invalid card is refused with a message and the current save untouched, Z5
`npm test` all pass with at least three tests whose names mention cheat.

C0 card shape (from CHEAT_LIBRARY): `{id, family, name, ui, terms, hooks,
state, stages, observers, sources}`; `ui` is a panel id from
CHEAT_PANEL_CARDS or "quiet"; `terms` from the patron-terms table. Held entry:
`{card, acquired:{route, at}, messages:[]}`; route values follow AQ1-AQ14
(`optional-start`, `test-fixture`, ...).

## Dead ends

(append only)
- 2026-10-13 coordinator: Z4 wrote raw JSON while import expects the YAIR-UTF8-1 base64 export encoding, and compared raw strings that autosave changes; fixed to encode and compare facts. Message must name the cheat/card.

## CH1 + optional start done check (frozen 2026-10-13)

C0 merged and pushed by R15 root (12a088bf, bundle e758c3af). CH1 runs on
branch `ui/cheats-ch1` in `.claude/worktrees/ui-cheats-ch1`. `check_ch1.sh`
exits 0: `checks/ch1_gate.cjs` H1-H6 plus the C0 gate (Z5 includes npm test),
panel-kit, settings, crafting and Vivid gates against the worktree build.

| ID | What |
| --- | --- |
| H1 | Hero creation has `[data-cheat-start]` (none / system-quests / surprise), default none, `[data-cheat-start-desc]` says it starts dormant; choosing none holds nothing and no cheat name appears anywhere |
| H2 | Choosing system-quests holds it with route `optional-start`, dormant (`awakened:false`), no messages, no panel or name shown |
| H3 | `fixtures/dormant_day3.save.txt` (real code, clock just before day 3): within 120 s the card awakens, its first system message is stored and shown in the log, the status window reveals exactly once |
| H4 | Kit panel `status-window`, role character: `[data-status-level]` equals the vitals level, `[data-status-stat="strength"]` equals the stats panel, `[data-status-titles]`, `[data-status-points]`, `[data-status-quests]`; setting `panel.status-window.density` compact tightens rows |
| H5 | Reload and literal-file import keep the panel without replaying the reveal |
| H6 | Fits and reads (≥4.5:1) at 3 desktop sizes; F6 reaches it |

Design: dormant seed (ST11) wakes on the first won fight or day 3, whichever
first; stage 0 is informational (knowledge, not power). "surprise" picks from
the cards available for an optional start (today only system-quests) and
says so. The life record notes the choice.

## R1 stage 0 hardening (2026-10-14)

Authority: Weibao, 2026-10-14, after the
[audit](AUDIT_REPORT.md): "more to consider? ... Send out codex as usesful?".
Palette: [AW1-AW5](../../../CHEAT_LIBRARY.md#more-to-consider-after-the-stage-0-audit-stage-1-and-beyond-2026-10-14).
Scope is correctness of the shipped stage 0 only: no new milestones, no
stage 1, no new panels. Branch `ui/cheats-r1` in `.claude/worktrees/ui-cheats-r1`
(from master cc5fa556). Ports 18451 (check) and 18452-18459 (worker). The
worker writes the R gate first, freezes it in GATE_R1.sha256, then edits
source. The coordinator reviews and merges; the worker never pushes.

| ID | What |
| --- | --- |
| R1 | Storage fault: while saves containing an awakened card are refused, crossing day 3 shows no panel, no first system line and leaves the durable card dormant; once writes succeed the card awakens, the line is logged and the reveal plays exactly once (AW1) |
| R2 | Travel: from `fixtures/dormant_day3.save.txt`, crossing day 3 by native travel awakens the card within 10 s of arrival without waiting for another tick-driven day boundary (AW2) |
| R3 | Load past the milestone: importing a real-code save whose clock is past day 3 with a dormant card awakens it within 10 s of load; sleeping across the boundary does too where a bed is reachable from the fixture (AW2) |
| R4 | Reveal in view at 1366x768 Standard and Vivid: when the reveal plays, the status window's level row is inside the viewport or a visible pointer brings it there in one action; F6 then Tab reaches a control or focusable region inside the contents, not only the header (AW4) |
| R5 | Validator: import of an awakened card without a first message, or with negative or non-integer points, is refused with a message naming the card and the current save stays untouched (AW5) |
| R6 | `npm test` passes with at least three new tests whose names mention cheat and awakening |
| REG | C0, CH1, panel-kit, settings, crafting and Vivid gates still pass against the R1 build |
