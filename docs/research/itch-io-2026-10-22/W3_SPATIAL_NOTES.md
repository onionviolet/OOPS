# W3 spatial homes (G22), 2026-10-23

Built the smallest spatial layer for homes, as a per-world dial. Status: implemented, focused tests and desktop browser proof pass, not committed, Weibao's visual-feel acceptance open.

## AD33 exception (recorded reasoning)
AD33 defers procedural home layouts. Weibao later asked for the remaining itch.io items to be built, G22 among them, and that instruction counts as direction. This slice is therefore an explicit exception, not drift. It stays inside the spirit of AD33: no procedural generation, no NPC-heavy work, one home (the manor, four household members already exist), one small grid. Someone with edit rights to RULES_INDEX/USER_VISION should add the dated exception line to AD33 (not done here; shared owners belong to w3-direction).

## What exists
- `src/home_layout.js` (pure): 4x3 manor grid; placements map an installed fixture slot (bed, hearth, bookcase) to a cell. Fixtures stay owned by the home record; a removed fixture's cell is ignored. Warmth, turbid air and qi diffuse by relaxation; `bedDelta` reads the bed's cell, capped at +/-0.3. All numbers are dials with a `why` in `LAYOUT_DIALS`, keyed by world; a world with no entry has no layer. Only `base.frontier` has an entry, with qi weight 0.
- `src/home_layout_domain.js`: domain `home_layout`, slice `home_layout@1`, migrate and validate. `save` returns nothing until a layout is adopted, so existing saves gain no key. Commands: adopt (free), quote and execute a move. A move is one homes transaction (`layout_fee`, new case in `home_model.js`: 2 coins, 5 minutes, must be at the home) followed by the slice update.
- `src/home_layout_panel.js`: "Room plan" panel (id `home-layout`), reference dock. Selecting a fixture and a cell is free and shows before/after sleep term and fee; the move runs on the confirm button. `LAYOUT_SPEC.surfaces['home-layout']` added (ST6, proposal).
- Hook: `observeToday` in `household_fortunes_domain.js` adds `layoutBedDelta` to the manor's bed score (clamped 0..1; zero when the room has no bed access). Awakening, cause of death and the projected parts all read that one number. No layout, unknown world or no placed bed gives exactly the old value.

## The costed choice
The hearth warms the bed (+) and smokes it (-). Smoke falls off faster than warmth, so a hearth at the pillow costs about -0.30 and a hearth two or three cells away is slightly positive (+0.07 at best). Adopting changes nothing (default stand is far corners, about +0.02). Moving costs 2 coins and 5 minutes. The size of the benefit is small because the existing bed term in awakening is small (0.05 weight); that is the existing coefficient, not a new one.

## Checks
- `node --test tests/home_layout.test.js tests/household_fortunes.test.js tests/household_fortunes_domain.test.js`: 16 pass (includes: no slice reads the old bed score 0.7, smoke lowers it, unknown world unchanged, stale fixture ignored, validation, qi dial lifts a vein bed).
- `npm run check:arch` and `npm run check:rules`: pass (rules: 2 pre-existing untracked-file warnings). `npm run build`: ok.
- Browser (headless Chrome, served local build, `docs/gm/dispatch/w3-spatial-2026-10-23/layout-browser.cjs`, evidence in `.../evidence/home-layout-9uu5VQ`): manor save without the slice has no `home_layout` key; adopt; panel at 1920x1080 and 1536x864 inside the viewport; hearth move shows quote "+0.02 -> -0.30, 2 coins", confirm charges 2 coins (4425 -> 4423) and updates the slice; save, reload, Export, literal Import keep the slice; deleting the slice and loading works.

## Gaps and deferred
- Only the manor; other homes need a grid and default stand in `GRIDS`/`DEFAULT_AT`.
- No qi world exists yet: qi weight is 0 in the only world with homes, veins are data (`VEINS`), unit-tested only.
- Adjacency effects beyond the bed (station/bench bonuses, rest bonus through `homeBenefits`, crafting reads) are not wired. A hearth's smoke has no gameplay benefit beyond warmth, so the trade is warmth versus smoke on one sleeper score.
- All four staff share the one bed score; per-person beds, doors and walls, procedural rooms stay deferred.
- Pointer clicks in the helper are intercepted by a sticky shell resize handle at 1536/1920 when the center panel is scrolled; the proof uses keyboard Enter, as the shared helper does. Not investigated further.
- Shared dist/bundle.js and index.html were rebuilt; do not commit them as part of this slice.
