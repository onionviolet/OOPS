# R15: combat place descriptor restored, 2026-10-16

Candidate proposal, technically verified; Weibao's visual/play acceptance remains OPEN.
[Scope saved before editing](R15_CHECKPOINT.md) · [Round 15 plan](next-parts/round-15-whole-plan.md).

## What was wrong and what changed

R14's shell hid the whole native location module (`styles/ui_tokens.css`,
`[data-module="location"] {display:none!important;}`), and the replacement place header showed only
name, weather and date. In a fight the place type tags (for example `open`) and their
description and effect (`EP x0.75`) were gone (NEXT_PARTS L1/L2, plan NX4/NX18).

Now the shell's place header shows each native place type as a small button under the place name.
Hover, keyboard focus and Enter all open the shell's existing context popover with the native
description and effective effect, worded as the native tooltip (base value shown when it differs).
Esc closes it and focus stays on the tag. Ticks do not rebuild the tags unless their facts change,
so a focused tag keeps focus.

| File | Change |
| --- | --- |
| `src/place_types_projection.js` (new) | Pure projection: label with stage numeral, description, effects with effective and base values. Callers inject the native stage lookup, `get_location_type_penalty` and stat names, so the module reads no game state (AR5, PV1) |
| `src/main.js` | One field, `placeTypes`, added to the existing village workspace `read()`, plus its three imports. Listed for the modular-seams lane's merge reconciliation (NX36) |
| `src/village_workspace.js` | `renderPlaceTags` builds tag buttons from `frame.placeTypes`; signature-guarded, focus-preserving |
| `src/proto23_shell.js` | Context popover gains a place-type branch; `.shell-place-tag` joins its hover/focus selector and its click route (Enter) |
| `styles/ui_tokens.css` | Four rules for the tag row and focus ring, using existing shell tokens |
| `tests/place_types_projection.test.js` (new) | Native wording, base value, stage numeral, unknown type dropped, empty input |

No save, simulation, combat-rule, clock or `save_files.js` change. The native location module stays
hidden in the shell; its facts now have a route (NX4). Not converted to the preview form: the
shell modules still import `display.js` (NX43).

## Evidence and checks

All browser checks use the synthetic fixture `evidence/parity-r9/populated-three.save.txt`
(Infested field, three opponents) on fresh loopback origins. No personal save was touched.

| Check | Result |
| --- | --- |
| `node --test tests/place_types_projection.test.js` | 3/3 pass |
| `npm run build` | Passed; rewrote bundle and stylesheet version strings in `index.html` (that file also carries another session's uncommitted branding edits, left as they were) |
| `npm test` (dirty shared tree) | 2,055 pass, 3 fail, 3 TODO of 2,061. Two failures are the cheat-awakening baseline failures R14 recorded. The third is the UI contract test flagging `font-family` in `styles/oops_branding.css`, another session's untracked file. None involve R15 files |
| [`check-r15.cjs`](check-r15.cjs) on the rebuilt tree (port 19261) | **4/4 pass** at 1366×768 14/17.5/21px and 1920×1080 21px: in combat, shell tags equal the native tags; tag on screen; focus opens the popover with the native description; Esc closes and keeps focus; Enter reopens; hover opens; 30 rendered ticks keep focus; no page overflow; no page errors. `evidence/r15/check-r15.json` |
| Same check on the frozen R14 build (port 19262) | **Fails 4/4** at the first assertion: shell tags `[]`, native `['open']`. The check catches the regression it guards. `evidence/r15/before/check-r15-before.json` |
| NX19 stylesheet parse check (new, in `check-r15.cjs`) | `ui_tokens.css`: 850 written style rules, 850 parsed, braces balanced, at all four sizes |
| Inherited regressions on the rebuilt tree | `check-r14.cjs` 4/4, `check-r13.cjs` 26/26, `check-r12-ticks.cjs` 1/1, `check-r11-interactions.cjs` 4/4; no page errors. Run by a Sonnet subagent with `R4_URL`/`R12_URL` set to port 19261 |
| Screenshots | `evidence/r15/combat-*.png`, `evidence/r15/tag-focus-*.png` |

## Side finding

CTL16 in the plan: the ☆ before a place name maps to `favourite_locations`, which is stored in the
game save (seen in the fixture's top-level keys). Not changed by R15.

## Remaining gate

Weibao's visual and play acceptance of the tag look and popover. Not claimed: other place types and
stages beyond `open` stage 1 in a real fight, custom palettes, mobile, natural progression.
Persistence did not change, so save/reload/export/import was not rerun. Nothing committed.
