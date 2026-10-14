# Next slice: craft cue and village sentence (continuation prompt, not dispatched)

Status: ready to run once Weibao says go. Written 2026-10-14 by root from
[round 11](../../../TECHNOLOGY_AND_PROGRESSION.md#from-palette-to-play-round-11-2026-10-14).
This file is the authority for the slice's scope, ownership and completion
evidence. Ideas outside it stay in the owner doc.

Suggested executor: one Codex worker, balanced route, medium effort for
code, high effort only if a save question appears. Root reviews wording,
ownership and the browser evidence. Weibao judges feel.

## Goal

A player who crafts a Woodworking or Forging item reads one short cue that
depends on their skill, and a player who has shared the corrected ledger
(`town.returned`) sees one changed sentence in the Village. Text only. No
new save field, no reward, no feed message.

## Before writing

1. Read AGENTS.md, PROJECT.md standing priorities, and in the owner doc:
   round 7 (MS, MU), round 8 (SW), round 11, and lane results T10 (U40),
   T11 (N19) and T13 (R11a).
2. Recover live ownership: `git log -5` on `src/crafting_detail.js`,
   `src/display.js`, `src/town_content.js` and whatever produces the Village
   location description; check `docs/gm/dispatch/*/STATUS.md` and active
   worktrees for a writer of the same files. If another lane holds them,
   stop and report; do not edit around it.
3. Create a worktree from current `codex/gameplay-foundations` and a
   `CHECKPOINT.md` under `docs/gm/dispatch/research-tech-2026-10-14/slice1/`
   inside it.

## Build

- **Cue (U40).** A pure function in a new small module (for example
  `src/craft_cues.js`): input is recipe skill id, the crafter's level at
  craft time and the result, output is one sentence or nothing. Cover
  Woodworking and Forging with novice, practiced and master wording (T10
  `crafts/woodworking.md`, `crafts/smithing.md` give the sentences; adjust
  to fit the game's voice). Show it inside the existing collapsed
  "Result details" (`src/crafting_detail.js:61-75`) and after the receipt
  line (`craftReceiptText`, `src/crafting_detail.js:127`). Use the level
  captured with the receipt, not the current level, so old receipts don't
  change wording. Unknown skills return nothing.
- **Village sentence (N19).** When `actor.town.returned` is true, the
  Village description gains one sentence about travelers using the
  corrected signs (`src/town_content.js:42-46`, `:55-63` for the
  precedent). Pure projection from the saved fact; viewing grants nothing.
- Keep wording keyed by sense channel (sight, sound, touch) in plain data so
  a later nonhuman body can swap channels, but build no presenter layer.
- No danger content applies here.

## Done means

- Unit tests for the cue function (each skill and band, unknown skill,
  missing level) and the village projection (fact absent, present).
- `npm test` 0 failures; `npm run build` passes.
- Browser, rebuilt bundle, fresh origin, 1366x768 plus 1600x1000: craft one
  Woodworking and one Forging item at two skill levels (seeded through real
  game code, hero named `TEST FIXTURE RT SLICE1`), read the cue in Result
  details and the receipt; complete `town.return` and read the Village
  sentence. Then Save, reload, Export and literal-file Import: the Village
  sentence is identical and nothing else changed. An old save without the
  fact shows the old text.
- Screenshots for both viewports; label every claim natural, seeded-native
  or source. Anything not exercised goes in `slice1/BACKLOG.md` as
  implemented-unverified.
- Commit on the worktree branch, plain message, no Co-Authored-By trailer,
  never `dist/` or `index.html`. Do not push or merge; root merges after
  checking the evidence.

## Stop and report instead of improvising

- A file owner conflict, a needed save field, a wording choice that changes
  game balance, or any test failure you did not cause.
