# Lane brief: C1, tag every control with its perspective (CL236, CL243)

Model: `gpt-6-luna`, low. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`. Card:
[CAST_LIVES_CARD](../CAST_LIVES_CARD.md); plan sections 25 (CL236-CL246) and 27 (CL268, lead first) govern.
Rules: `.claude/rules/player-ui.md` (UR1-UR75), `.claude/rules/runtime-code.md` (AR3, AR14), AD44.
Target viewport 1920×1080. CLR codes applied: CLR2, CLR3, CLR9, CLR10, CLR12.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Top-level menu items in the shell navigation (Stats, Condition, Inventory, Journal, Data, Notebook, Travelers, Projects, Ledger, Worlds, Beginning, Connection, Settings, the pane selector, plus Save, Export, Import, Menu) | 18 | | yes |
| Blocks rendered by the LOTM place panel (`src/book_world_lotm_ui.js`) | 8 or more | | yes |
| Report kinds written to Reports by the LOTM host and cast host | 3 or more | | no |

## Scope and seam

- **Outcome.** One data file that names every player-visible control a life can see and tags it
  `in-world`, `system`, `crossing` or `other-seat` (CL236 has the meaning of each and examples). S1 reads it
  through `src/seat_profiles.js`; this lane writes no filtering code and changes no UI.
- **Files owned.** New `src/perspective_controls.js` (a frozen array of rows: `id`, `kind` one of
  `menu|panel-block|header-line|report-kind|pane`, `anchor` (the DOM id, `data-*` token or report prefix the
  shell or panel already uses), `tag`, `basis` (one short reason)); new `tests/perspective_controls.test.js`;
  checkpoint `cast-lives-lanes/C1_CHECKPOINT.md`. Nothing else.
- **Publication class (CLR3).** Public code. Anchors and labels are the game's own UI text; no book-pack
  (local book pack, not published) people, places or beats. If a control's label is pack text, anchor it by
  its token, never its label.
- **Seam (CLR10).** Read-only over the existing shell (`index.html`, `src/main.js` navigation, `src/display.js`,
  `src/workspace_navigation.js`) and the LOTM panel and hosts. One authority: the rows in this file.
- **Save and economy.** None.
- **Actor parametrization (CL225).** Not applicable (no capability). **Disclosure (CL228).** Each `panel-block`
  row names its existing disclosure group if it has one.

## Work and done check

- **Mechanism.** Enumerate from source, not from memory: the shell's navigation entries and buttons, every
  block the LOTM place panel appends, the header lines (place title, local clock line, the home calendar
  line), and each Reports kind. Defaults from CL236: Continuing connection, Worlds, Travelers, Beginning, the
  home calendar line and Village quest lines are `crossing`; the probationer workroom, its supervisor and the
  other Tingen start pickers are `other-seat`; Save, Export, Import, Settings and Menu are `system`; place,
  people, inventory, journal, walks, talk, wait and cast reports are `in-world`.
- **Failure case.** A control the lane cannot classify gets `tag: 'in-world'` only if it is plainly part of
  the character's life; otherwise list it under "unclassified" in the checkpoint with its anchor (CLR12
  default: leave it visible, never guess `crossing`).
- **Verification.** `node --test tests/perspective_controls.test.js`: every row has a known tag and kind;
  ids unique; every navigation entry found in the shell source has a row (the test reads the source and
  compares, so a new menu item without a tag fails); every `data-lotm` block family in the panel source has
  a row. `node scripts/lane_review.mjs` with your grants and paths.
- **Done when.** Test passes and the checkpoint lists counts per tag and the unclassified list. The browser
  check (every visible control in a beside-life screenshot has a tag) is the coordinator's.
- **Stop conditions.** None beyond the gate rows.

Do not commit. Keep canon names and source text out of tracked `src/` and `tests/` (CLR3).
