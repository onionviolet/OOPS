# L4e brief: polish the beside view (from the L4b and L4d checkpoints)

Model: `gpt-6-luna`, medium effort. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg` beside L5r
(L5r changes no game source). Do not commit; the coordinator commits. Never stash, reset, force or push.
UI rules: `.claude/rules/player-ui.md`, UR42, UR44, UR70-UR75, RPT1-RPT12 (plan section 21). Target
1920×1080 desktop. Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md).

## Publication class (CLR3)

Code name-free; screenshots private (`docs/research/novels/lord-of-mysteries/private/cast-evidence-2026-10-28/`).

## Fixes

| Code | Fix | Done check |
| --- | --- | --- |
| P1 | Report lines rendered from cast templates start lowercase ("a young man shares..."). Capitalize the first letter at render time in the cast report projection (`src/book_world_lotm_cast_host.js`), keeping masked names as they are | Focused test: a masked-name template renders with a capital first letter |
| P2 | The resident's place panel lists every walk and place in one long run. Group walks and the Places list by district (the existing district rows), with the current district open and the others collapsed (UR42); the four original profiles keep their exact lists | Screenshot at 1920×1080 shows grouped walks; original-profile view output unchanged (existing compatibility test) |
| P3 | The panel's section header reads "Tingen workroom" in the resident's flat. Show the current place's name for the beside profile | Screenshot |
| P4 | The person view's settled-beat rows (L4b) are unproven on screen: after talking to a principal (so they are known) and witnessing one of their beats, the person view lists it | Screenshot of the person view row; focused test |

## Owned files

`src/book_world_lotm_ui.js`, `src/book_world_lotm_cast_host.js` (report render only), `tests/lotm_cast_week.test.js`
(new cases only), `cast-lives-lanes/L4E_CHECKPOINT.md`. If a fix needs another file, stop and report with
a prepared patch, as L4d and L4b did.

## Done check

Focused tests pass; `BUILD_OUT` rebuild with zero page errors in a fresh 1920×1080 browser run (or say the
sandbox blocked it); `npm run check:arch` no growth; checkpoint with one line per check and FLR3 stated.
