# Rules shared by the three Sol UI lanes (2026-11-20)

Lanes: [combat page](SOL_COMBAT_PAGE_BRIEF_2026-11-20.md), [potion bench](SOL_POTION_BENCH_BRIEF_2026-11-20.md), [forge picker](SOL_FORGE_PICKER_BRIEF_2026-11-20.md). Coordinator: a Claude session in the main checkout. Why these exist: [cross-chat drift review](../../../audits/CODEX_CHAT_DRIFT_REVIEW_2026-11-20.md#across-the-five-chats-added-2026-11-20), goals UG2 and UG4. Nobody has built either goal yet. Earlier lanes shipped label, focus and string fixes and left every panel looking the same.

## The bar

- **UR177** ([UI rules](../../../UI_RULES.md)) is the gate. Before you code, write a visual spec from your reference pictures: hex palette sampled from the image, font, borders, semantic colour map, ornaments. Put shared colours in theme tokens. Finish with a same-size side-by-side composite (reference beside your screen) and a list of every visible difference. Each difference is either fixed or named as a deliberate improvement.
- **The panel must look different from before.** A changed label, a moved hint or a focus fix does not count. If your before and after screenshots look the same at a glance, you are not done.
- **Build it in the real game.** No dev pages, concept art or sample states with invented data.
- **Weibao's words are the brief.** They are quoted in each brief. Do not take "Weibao wants" from any other chat as his direction.

## Working in a shared checkout

- Touch only your owned files. Two other lanes are writing at the same time.
- **Stylesheets:** add a new CSS file of your own. Register it with one added line in `styles/manifest.txt`, and re-read that file immediately before editing. Never rewrite other lines. `build.js` regenerates the links.
- **Hands off:** `index.html`, `src/main.js`, `src/display.js` and `styles/ui_tokens.css`. The only exception is adding new tokens at the end of `ui_tokens.css`, with a re-read just before the edit.
- **Saves:** do not change the save shape. If the design needs it, stop and report the field and the reason.
- **Git:** no commits, stash, reset or push.

## Proof (AD43)

- Rebuild, then play the change through ordinary controls on a fresh origin. If state changes, save, reload, export and import, and confirm it survives.
- If the sandbox blocks Chromium, use the WebKit capture route the atlas lane used: `/private/tmp/yair-atlas-proof-nov20/capture.swift` with `build.mjs` beside it.
- Save evidence under `docs/representations/evidence/<your-lane>-2026-11-20/` as `before.png`, `after.png` and `side-by-side.png`, plus any step shots.
- Run the focused tests for files you touched, and report each command with its exit status.

## Report

List the files you changed, the screenshots, and the checks with exit status. Then give the difference list from the side-by-side. Name anything you did not build, and say why.
