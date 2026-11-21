# Sol lane: inventory truth and Other worlds navigation (F13, F27, 2026-11-20)

Read [the shared lane rules](SOL_UI_LANES_COMMON_2026-11-20.md) first, except for its "panel must look different" bar, which does not apply to these two bug fixes. Lane id `truth-nav-sol`; evidence folder `docs/representations/evidence/truth-nav-sol-2026-11-20/`. Queued by Weibao ("queue F13 and F27 as the next lane too", 2026-11-20). It runs in the main checkout after the combat feel pass is committed, or earlier if the coordinator confirms no running lane owns these files.

## F13 · Harry's inventory contradicts itself

From [ACTIVITY_UI_REVIEW F13](ACTIVITY_UI_REVIEW_2026-11-20.md): with seed 42 and the composed `hp-exam-week` save, in the Great Hall, Inventory shows "2 / 2 stacks · 6 items" above "You carry nothing of your own." The second string lives in `src/book_world_hp_lead_domain.js`.

1. Find which owner each line reads. Decide from the code which one is true for Harry at that moment (school-issued items, items he owns, items held for him).
2. Make the panel say one consistent thing. If both are true (he holds school items he does not own), word it so it reads as true: for example "6 items, none your own".
3. Add a test that pins the case.

## F27 · All panels → Other worlds opens empty

From [ACTIVITY_UI_REVIEW F27](ACTIVITY_UI_REVIEW_2026-11-20.md): in a visited authored site, All panels → Other worlds opens an empty pane, while Journal → Worlds works. The picker entry is `optional-worlds` in `src/panel_directory.js`; the rendered element is `optional_content_panel` in `src/content_pack_ui.js`.

1. Reproduce with the same save through both routes.
2. Acceptance from the review: either entry shows the site's work controls immediately, with one visible copy and no extra tab switch.
3. Add a test that opens the panel through the picker route.

## Owned files

`src/book_world_hp_lead_domain.js` (inventory wording only), the inventory panel file that renders the count line, `src/panel_directory.js`, `src/content_pack_ui.js`, and tests for these. Run `node scripts/rule_routes.mjs --for <path>` on each first. No save-shape change.

## Done means

Before and after screenshots of both cases in the rebuilt game on a fresh origin, the two new tests passing, and save and reload around the fixed screens.
