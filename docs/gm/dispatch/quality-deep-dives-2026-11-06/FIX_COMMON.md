# Common rules for the fix lanes (2026-11-07)

Weibao's goal: "continue accordingly, plan for in case of usage full, fix everything".
Read [COMMON.md](COMMON.md) first; its writing, secrets and git rules still hold. What changes:
fix lanes DO edit `src/` (and `styles/`, `scripts/`), under these rules.

## Claims (one writer per file)

- Before editing any file, run `git -C /Users/weiwei/code/yet-another-idle-rpg status --short <file>`.
  If it shows changes you did not make, another session owns it: do not edit; record the item as
  blocked in your report.
- Append each file you will edit to [CLAIMS.md](CLAIMS.md) as `- <path> : <LANE>` BEFORE editing.
  If another lane already claimed it, do not edit; work around it or record it as blocked.
- Never edit package.json, AGENTS.md, RULES_INDEX, USER_VISION, PROJECT.md, DESIGN.md, UI_RULES or
  another lane's check/baseline. Never `dist/` by hand.

## What "fixed" means

- Ids, save keys, dialogue keys and location ids stay. Change what the player reads (display text,
  labels, feedback). If a display layer is missing, add the smallest one at the owning seam
  (runtime rules: `.claude/rules/runtime-code.md`, AR1-AR16).
- Persistence: no change to saved shape without a migration or an explicit compatibility note.
  Saved history and old Reports lines keep their wording (PRS8).
- A finding that is a false positive or a deliberate design choice gets the rulebook's dial: the
  check's allow comment with a one-line in-world or design reason, not a silent baseline bump.
- After fixing, run your check with `--update-baseline` only for your area, confirm the fixed
  entries retired and nothing new appeared, and run your focused tests plus the tests of any
  src module you touched (`node --test tests/<module>*.test.js`). Not `npm test`; the coordinator
  runs it once.
- Prove changed behaviour headlessly with `scripts/headless/runner.mjs` (boot, click, read text)
  and quote what the player now sees. Never open a visible window.
- Player text follows PRS4/PRS6 and the world's naming sheet (docs/names/WORLD_NAMING_SHEETS.md).
  Voice sample (Village): look at the existing elder dialogue in src/dialogues*.js and match it.

## Report

`docs/gm/dispatch/quality-deep-dives-2026-11-06/FIX_<LANE>_REPORT.md`, under 80 lines: CHECKPOINT line,
items fixed (file:line, before -> after, proof), items left with reason, checks run with results.
