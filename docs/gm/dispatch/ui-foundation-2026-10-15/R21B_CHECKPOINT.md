# R21b checkpoint: retire the character selector, 2026-10-17

Saved before editing. Session: Claude (UI main chat), worktree
`.claude/worktrees/ui-r21b-retire-selector`, branch `claude/ui-r21b-retire-selector` from
`codex/gameplay-foundations` at `8bf1ed55d` (R21 merged). Weibao: "Yes, the new-game hero creation
panel (name, gender, height, age, race). Retire it in R21b." Plan: [R21 feedback](next-parts/r21-feedback-2026-10-17.md)
BX15, HR1–HR10; queue row R21b in the Round 15 plan.

## Task record (UR18)

- **Surface:** new-game start (start screen and the hero creation panel), both presentations.
- **Targets:** the UI_RULES target set; the start screen at 1920×1080 and 1366×768.
- **Visible outcome:** a new game goes from PLAY straight into play with a default hero (name
  "Hero", human, adult, ambiguous, average height); the name is typed in the You header (R21). The
  panel's "Optional beginning" choice, the local start probe (`?start_probe=1`) and the backlog
  opening panel move to a "Beginning" section on the start screen, shown only for a new game, and
  PLAY applies them as the panel's confirm did. A first start logs one line saying where the name
  lives (UR13). Loaded saves are unchanged.
- **Deferred:** an identity view for age, gender and height; a designed beginning flow (start-as-X,
  other selves) beyond re-homing the probe; deleting the panel markup and its translations (kept
  inert so classic and old checks keep working; removed at start).

## Live facts (stated)

- HEAD wiring: `src/main.js` creation block (`if(!global_flags.is_hero_created && config.do_hero_creation)`)
  fills the panel, mounts the start probe inside it, and in the confirm handler's capture phase
  applies the start snapshot and the cheat beginning choice; the panel's confirm (`character_creation.js`)
  writes the bio and calls `run()`. `backlog_opening_panel` takes the panel as parent.
- Shared checkout, uncommitted, owner not identified (HR1): `config.js` `do_hero_creation: false`
  ("temporarily"), `complete_default_hero()` in `character_creation.js`, and its call in
  `main.js`. This round ports `complete_default_hero()` unchanged and replaces the `main.js` block;
  `config.js` is not touched. The shared checkout's `main.js` hunk will conflict at merge and is
  resolved by hand, keeping that session's other edits.

## Plan

1. `src/new_game_beginning.js` (new, leaf): builds the start-screen "Beginning" section, moves the
   panel's `.cheat_start_choice` into it, exposes a host for the start probe and backlog opening.
2. `character_creation.js`: `complete_default_hero()` (ported as found).
3. `main.js`: replace the creation block: fresh game → mount Beginning, complete the default hero,
   remove the panel, apply the beginning on PLAY (capture, once), then `run`. Backlog opening parent
   becomes the Beginning host. `start_probe_ui.js` accepts a host without the confirm wrapper.
4. Checks: `check-r21b.cjs` (fresh start without the panel; Beginning choices applied; old custom
   bio save loads unchanged; mid-creation save completes; save, reload, export and import; classic
   starts; UR13 line), CH1 gate rerun, inherited sweep r11–r21.

## Writer reservation

`src/main.js` (creation block and the backlog opening parent only), `src/character_creation.js`,
`src/start_probe_ui.js`, new `src/new_game_beginning.js`, `styles/shell_chrome.css`, tests and this
folder.
