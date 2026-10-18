# Qud and CDDA UI observations

2026-10-15. Inspected images plus source-defined interaction paths. No source-game launch, clicks in either game, keyboard trial or save access. A depicted control is not evidence that this researcher exercised it. Screenshots and full original interface strings stay in [private/qud-cdda](private/qud-cdda/).

## UIQ1: Qud historical ingredient screen

Source: [September 4, 2024 post](https://www.reddit.com/r/cavesofqud/comments/1f8p6ub/old_meal_preparation_screen/) by homelessstreetbum, reproducing a video frame and asking about the older screen. The original image was inspected directly and retained as [historical-ingredient-ui.jpeg](private/qud-cdda/qud/historical-ingredient-ui.jpeg), plus browser context and enlarged captures. [Asset receipt](private/qud-cdda/qud/UI_ASSET_MANIFEST.json) preserves its URL. The exact game build, video timestamp and mod state are unknown. The posted image is itself cropped, so it cannot establish the full window or all controls.

Visible: a vertical ingredient list with selection markers, a focus arrow, colored item names, quantities on the right, and a lower region listing selected ingredients' broad effect domains. Starapple jam is selected with 15 servings shown. Soul curd is also visibly selected. Several liquids show dram quantities; foods show servings. This is a useful local comparison of material, remaining stock and possible effect family. It is not an exact result prediction, a stock-debit receipt, a discovery-result screen or the jam-plus-jerky branch studied in the source trace.

The screenshot does not match the selection call inspected in assembly 2.0.211.56. That call supplies checkbox/name/count rows and a selected/remaining-slot header to a general popup, without an inline description payload. `PreparedCookingIngredient` separately supplies a broad effect-domain inspection postfix. The image therefore shows a historical UI idea, while the assembly establishes a different source-defined route. The post's complaint about newer UI is a user report, not independent proof of present usability.

## UIQ2: Qud source-defined journey

| Step | Display or interaction supplied by the inspected code | Qualification |
|---|---|---|
| Campfire entry | Separate choose-ingredients, known-recipe and preserve actions; enabled states reflect skill, hunger or eligible stock | Source calls retained; actual rendering not captured for this version |
| Ingredient choice | Checkbox rows, item rendering, available count, selected count, remaining slots and Escape cancellation; two slots or three with Spicer | Count used by the selector is not automatically identical to every special item's charge count |
| Inspiration choice | Meal description and a generated effect-choice popup, then a recipe-created notification | Effect choices depend on the selected domains and generation; no exact sampled menu observed |
| Known recipe | Missing-stock recipes can be revealed; recipe description precedes Cook/favorite/forget/Back submenu | Ingredients are checked again on Cook; forget has confirmation |
| Successful meal | Metabolism effect description | Immediate body status, not a portable meal-item result screen |
| Later use | Triggered-action message, plus a status description available from the effect | HP mutation is source-traced; exact native visual update not exercised |

## UIC1: CDDA author screenshot

Source: [ImGui crafting PR #86044](https://github.com/CleverRaven/Cataclysm-DDA/pull/86044), author dobbry-vechur. PR body, dates, merge metadata and image URL are retained in [pr86044.json](private/qud-cdda/cdda/pr86044.json); original screenshot is [pr86044-image-0.png](private/qud-cdda/cdda/pr86044-image-0.png). The source page records merge on April 1, 2026. Image dimensions are large, 1757×1598; it is not a 1366×768 acceptance image and its exact executable commit is not pinned to the October checkout.

The screenshot selects bread. It shows three adjacent regions: a recipe list; a center preparation/requirements view; and a result-item inspection pane. Category/subcategory controls sit above, keybinding help below. The middle names the reference source, shows batch adjustment, estimated work, success/destruction chances, and an expanded breakdown for skills, proficiencies and conditions. A darkness warning is visible. Components show quantities and alternatives in availability colors. Preparation is split into named mixing, rising and baking steps, with tool requirements shown beneath. The output view includes nutrition ranges, freshness/spoilage and many technical inspection fields.

The image documents the **bread UI**, not a completed cooked-meat craft or a salt use. A large scrollable list and dense technical output panel are visible; the screenshot alone does not establish readability at laptop size, accessibility, responsive behavior or good everyday pacing. Its wide/high information density should be judged independently from the usefulness of adjacent candidate/means/result information.

## UIC2: CDDA source-defined controls

The pinned `crafting_gui.cpp` retains category and recipe navigation, filter reset, read/unread and available-first selection modes, favorite/hide controls, batch adjustment, crafter choice, related recipes, component prioritization, and keyboard navigation into details. Components are availability-colored; available alternatives are sorted before hidden overflow alternatives. Details can expand to show the factors affecting work and skill. Rotten/favorited ingredient warnings are explicit. The PR describes reusing existing subdialogs; it does not prove those dialogs are all equally usable.

The source trace follows selection through actual component/tool choice and into an in-progress craft. The subsequent consume route has actor admission, meal messages and consumption history. This pass has no screenshot for the exact meat recipe, in-progress activity, edible-item picker, digestion/body display or recipe-memorization message. Their source strings/calls are retained, so the gaps are named rather than replaced with unrelated screenshots.

## UIP1: Useful comparison, still a proposal

Qud's historical screen gives an effect-family explanation beside the ingredients. CDDA's author screenshot gives reasons for eligibility, costs and resulting-item consequences in one context. These support a future comparison of “what can this ingredient do?” and “what do my actual means change?” They do not select a universal crafting layout, reveal unknown effects to a character, or authorize changes to YAIR's accepted Proto23 composition. Any later UI implementation remains subject to the existing shared UI owners and laptop-first direction.

## Acquisition limits

The GDC deck's shell request returned HTTP 403 and its earlier web extraction exceeded size limits; no deck pages are claimed read. Qud's image CDN shell request also returned 403. A hidden in-app browser then rendered the public post and its observed original image; the browser asset API preserved that displayed asset. The GitHub PR API supplied the author's image successfully after the web image route failed. No login, foreground native control, posting or other account mutation was needed.
