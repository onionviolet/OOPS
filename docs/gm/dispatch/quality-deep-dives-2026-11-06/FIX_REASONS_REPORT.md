# FIX_REASONS report (2026-11-07)

CHECKPOINT: done. All 25 neutral controls in the book starts now carry a reason of their own. Pack definitions untouched.

## Finding (SHOWN)

- Probe: boot each start, `enterStart`, list disabled `[data-structured-action]` controls whose only reason is
  the engine fallback (`splitReasons(...).player` empty, so the player gets NEUTRAL_REASON). Printed after `game.close()`.
- Before -> after, NEUTRAL controls per start: hp.lead 3 -> 0, hp.school 4 -> 0, hp.trade 0 -> 0, ri.academy 5 -> 0,
  ri.keeper 0 -> 0, ss.apprentice 5 -> 0, ss.company 6 -> 0, ss.trial 2 -> 0. Total 25 -> 0.
- Why leaf reasons did not work: `simulation.js` `ruleReason` returns only the command's top-level `requires.reason`,
  else the engine fallback. A `reason` on a leaf inside `all(...)` is never read (existing leaf reasons such as
  "Study your specimen until you understand its pattern first." were dead text).
- Why not edit the packs: I added top-level reasons in the five pack files first. The headless boot then failed with
  "Restore the exact base content for this extension" (the HP school extension pins the base `contentHash`, and saved
  lives pin pack hashes). Any definition edit breaks saves. I reverted all five files (git apply -R) and used a display layer.

## Change

- New `src/structured_action_reasons.js`: display-only table keyed by command id (22 entries) plus a fallback that shows
  the first unmet authored leaf reason (used by hp.lead's sequenced acts, whose gates already say "First: <scene>.").
- `src/structured_pack_runtime.js`: one import and one changed line in the action view; only locked actions are
  rewritten, engine reasons and stock hints are kept. Ids, save keys and hashes unchanged.
- `tests/structured_action_reasons.test.js` (4 cases).

Voice sample quoted from the pack: "Study your specimen until you understand its pattern first." (book_shadow_slave_life.js).
Examples now shown: "Your shadow is already in storage." / "Refine the Moonlight Gu with Lin first." /
"Bind the coat and gloves together first." / "Prepare for the crossing first." / "You have no injury to treat."
No sealed truth is written; each line states what is missing or already done, in the character's terms.

## Left, with reason

- hp.lead w1.night, w2.hunted, w2.bedroom show "First: Get up and dress." (the next unmet scene, from the private cast).
  The real gate for night/hunted/bedroom may be a clock rather than only that scene; if so the private cast owner
  (git-ignored `private_packs/hp-cast/cast.json`, claimed by CONTINUITY) should author a `reason` per act.
- Table text is static: `ss.apprentice.fit_*` says "Each piece takes the fitting once" so it stays true after a fitting.
- Not touched: "Insufficient, stale or unavailable item quantity" rows (trade buttons) and the cast_* hint line; not neutral.
- Probe covers the Beginning panel actions only, not every panel.

## Checks

- Probe rerun: above, 25 -> 0.
- `node --test` on gu_life, shadow_slave_life, shadow_company_life, shadow_slave_trial, hp_school_progression,
  world_pack_hp, player_reasons, openings_check, structured_action_reasons: 71 pass, 0 fail.
- `node --test tests/structured_*.test.js tests/reach_structured.test.js`: 117 pass, 0 fail.
- `node scripts/check_player_text.mjs`: PASS (0 new).
- Not run: `npm test`, `npm run check:rules` (coordinator). Browser (non-headless) not exercised.

## Suggested owner hunk

UR73 could add: "A locked structured action takes its reason from `src/structured_action_reasons.js` when the definition
cannot carry one (content-hash pinned packs)."
