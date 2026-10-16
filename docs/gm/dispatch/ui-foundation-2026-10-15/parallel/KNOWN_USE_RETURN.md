# Known item → known use → current station → return

2026-10-15. Read-only source proposal for the R8 root writer. No runtime edit, build, browser exercise, personal save, engine/persistence change, commit or push occurred in this lane. Existing dirty working tree was read before investigation and left intact. Root owns the six UI paths; this report owns no runtime files. Input hashes below are a point-in-time receipt, not a lock on the root writer.

## Authority and selected outcome

Follow PROJECT.md standing desktop priorities, USER_VISION R7/R8 steering and [UI_RULES](../../../../UI_RULES.md), especially UR19, UR22–23, UR35, UR41–43 and UR47–48. [UI_SOURCING](../../../../research/climb-mr2-playtest-2026-10-15/UI_SOURCING.md) recommends a connected comparison; it does not itself accept a UI or a second reference/navigation owner.

Surface: optional reference inside the existing selected-item inspector. Home: `shell-detail`; brief hover remains preview only. Full reading deliberately expands through the existing controller. Target: populated synthetic save at 1366×768, actual 14/17.5/21 px text. Visible outcome: select a held known ingredient, see one real known use with native cost/output/blocker, deliberately follow the available current station, then return to the same item and list position while current work and Reports remain legible. Mobile, universal recipe encyclopedia/search, reminders, remote crafting and engine changes are deferred.

The Climb contributes continuity of the fixed player/target/inventory/action/log regions. Factorio contributes an ingredient-to-use reference and named history. These are interaction patterns, not copied code/assets. This lane read the supplied local sourcing record and native YAIR code; it did not newly inspect Factorio or The Climb UI and makes no source-parity claim.

## Verified native facts

| ID | Fact | Native source |
| --- | --- | --- |
| F1 | A shell selected held item is keyed by native inventory key; detail copies its actual native tooltip. Preview has an explicit Full item button. Inspection excludes native use/equip/favorite controls. | `src/proto23_shell.js`:102–134,154–173,217–248 |
| F2 | Items recipe rows are created only for `recipe.isUnlocked()`. Clicking/Enter selects; only the detail Craft control executes. Components/equipment use different handlers, so a generic `.recipe_name.click()` is not a safe universal reference adapter. | `src/display.js`:3379–3500 |
| F3 | `build_item_recipe_model` already supplies output, exact requirement have/need, chance, native station, XP and a concrete blocker using the same `item_recipe_state` as command availability. This is the appropriate original YAIR cost owner. | `src/display.js`:3202–3218,3252–3286; `src/crafting_visibility.js`:39–59 |
| F4 | `centerModes` remembers scroll, details groups and location dropdowns. Expanded panels borrow original nodes. `workspace:shell-detail` can sit below `crafting` in one stack, providing “← Item details”, then the earlier context. Selection itself stays in shell state. | `src/center_modes.js`:39–80; `src/workspace_layout.js`:502–514 |
| F5 | There is no existing journal recipe index to navigate to. Current Crafting routes open the current place service, not a remote reference. Native station projection comes from `accessoryCraftingTiers`; navigation also checks `.choice_craft`. | `src/workspace_navigation.js`:8–24,55; `src/display.js`:3067–3106 |
| F6 | `item_log.is_known(id)` returns any record object. That is weaker than positive acquisition: the existing observer-safe bestiary adapter explicitly requires `.number > 0`. A new reverse-use adapter should use that positive test, plus a currently held source item. | `src/items.js`:74–121; `src/fork_discovery_views.js`:18–30 |
| F7 | Native recipe detail obscures unfamiliar ingredient names but still renders their have/need quantities. Reusing the whole model without a stricter projection can therefore expose counts the new reference should not reveal. | `src/display.js`:3258–3264; `src/crafting_detail.js`:44–57 |
| F8 | Closing Crafting invokes `update_displayed_normal_location`, which calls `centerModes().local()`. That retains workspace references but retires native activity/action/reading modes. Source inspection alone cannot establish uninterrupted native work presentation. | `src/display.js`:3103–3106,2340–2342; `src/center_modes.js`:14–18 |

## Smallest original adapter

**D1 · Limit this slice to native `items` recipes.** Add a presentation export beside `build_item_recipe_model` in root-owned `src/display.js`, consumed only by `proto23_shell.js`. No new module, registry, catalog, global, controller or save field is needed. Suggested interface:

```js
readKnownItemUse(itemKey, preferredRoute) // null or {route, model, canOpenStation, stationReason}
openKnownItemUse(itemKey, route)          // boolean, revalidates and selects only
```

Read uses `character.getItems()[itemKey]`, requires positive held count, and takes the actual entry's `item.id` and `material_type`. Iterate only `recipes[category].items`, require `isUnlocked()` and a real native already-created row with that exact category/subcategory/ID. Match an exact `material_id === item.id`, or a native `material_type === item.material_type`; never match display names or substrings. Require the result ID from `recipe.getResult()` to have positive acquisition or be currently held before returning the route, its name, count or description. Unlock alone is insufficient for this conservative new reference. Candidate names are already known recipe names, not speculative output names. Keep a chosen route stable while it remains valid. For this comparison show **one** matching use, not an all-recipes count or a count of withheld entries.

Use strict positive acquisition for every specific ingredient, or a currently held native item of that ID. A material-type requirement is safe only if at least one positively acquired/held template has that type. For the smallest fully safe slice, return a full quote only for a route whose requirements are all known by this rule. Return `null` when none qualifies; show “No related use to show from your known recipes.” Do not show a withheld-use count, missing hidden names, result previews or an index of unknown recipes. This conservative slice may omit a legitimately unlocked partial-knowledge recipe; widening that disclosure needs an explicitly sanitized model, not an accidental leak.

Then call the existing `build_item_recipe_model(route)` for the eligible route. Render the returned output/requirement rows, native station/chance and first blocker using existing tokens. The proposed read path invokes no quality roll, command, unlock, counter or RNG. Do **not** use `renderCraftingDetail` for a passive reference because it creates Craft controls. Do not synthesize blocker wording from DOM colors or promise that an unavailable station exists elsewhere.

A pure original module plus a shell binding is feasible for passive matching/rendering only if root provides already observer-qualified native recipe models through a display export or injected reader. A standalone module that imports the complete recipe registry and reconstructs station/cost knowledge would duplicate existing display authority and is not the preferred slice. Prefer two small additions in the existing root-owned display/shell files; if a new module is desired, keep it a pure selector over safe inputs, not another native-state reader.

**D2 · Keep preview, reading and service access separate.** Optional compact “Known use · [recipe]” belongs in the stable selected-item inspector, not in a nested hover. A brief preview can mention the same known label, but the readable cost/reference and command path remain keyboard accessible. Avoid replacing the item description each tick; keyed existing nodes, chosen route and scroll should survive quantity changes.

The follow action says “Open [native station label] ›”. Enable only when the current visible native Crafting entry exists, the selected category is currently available through the native tier source, and the ingredient/recipe/row are still eligible. Check this again inside the click adapter. If unavailable, keep the passive reference and native reason; no auto-travel, remote station or craft grant. Never invoke `window.useRecipe` or click a Craft/Create/amount button from reference navigation.

**D3 · Reuse existing return history.** On explicit station follow, first expand `shell-detail` if it is not already expanded. Then `open_crafting_window()`, switch the exact existing category and `items` subpage, and select the already-created row using the existing `select_item_recipe` function inside display.js. These calls stay inside the native display adapter, not exported engine state. Promote once, avoid duplicate stack entries. The returned back bar must name Item details; Esc once returns to that reference, then Back returns the original home/context. A quick hover never expands or changes history.

Do not clear shell `selected` when navigating away. Native inventory controls/search/filter/sort stay attached. If the item is no longer held on return, show its native no-longer-held state rather than resolving another item by name. If native rows rebuild, resolve them from the retained key/route and revalidate; do not retain detached command nodes.

**D4 · Native station follow during current work needs proof.** In a place/state with no real visible `.choice_craft`, the reference stays readable and the service follow stays unavailable. Do not add a substitute button to bypass that state. In a state where native service is legitimately reachable during work, capture the actual native journey before claiming it preserves work. F8 is an integration risk, not authorization to rewrite center modes, main, work or simulation. If that journey disrupts native work presentation, stop at passive known-use reference for R8 and record service follow as blocked on its existing owner.

## Concrete populated fixture route

The preserved R7 `evidence/parity-r7/equipped-village.save.txt` already holds Fresh bread ×5, Bread kwas ×2 and Stale bread ×5, with positive acquisition records for each. Native `cooking/items/Bread kwas` consumes a native `bread` material type ×2 plus Glass bottle ×1 and produces Bread kwas ×1 (`crafting_recipes.js`:1714–1723). Glass bottle is absent from that fixture, including its acquisition log, so **the unchanged fixture must withhold the complete related-use quote under the strict guard**. Do not quietly relax knowledge to make this case pass.

For a positive DEV SEEDED trial, copy that fixture to a new evidence file and add a held/positively acquired Glass bottle through the established synthetic-fixture route, leaving the preserved R7 file unchanged. Select Fresh bread, show the one Bread kwas use, and exercise known quantity/station blockers. Its default unlocked recipe still requires verifying the actual native row after import. This uses a real native recipe and already-known output; it is not natural progression. Village service access must still be read from the restored UI rather than assumed from the filename. Native `Village` declares cooking tier1 (`src/data/locations.js`:380–393), with its own unlock/availability guards. A valid Village service state can provide the positive follow path without travel. Combat or unavailable-service context supplies the passive blocked reference state; do not move the actor merely to produce a station-success screenshot.

## Concrete acceptance journey

| ID | Exercise on fresh rebuilt synthetic origin at 1366×768, 14/17.5/21 px | Evidence required |
| --- | --- | --- |
| A1 | Use the new DEV SEEDED equipped-Village copy described above. Inspect held Fresh bread and its native Bread kwas use; input and output are already acquired, and the explicit seeded bottle completes ingredient knowledge. | Native inventory key, recipe unlock/row, actual tooltip, one known-use quote; preview and explicit full route both readable. No hidden count. |
| A2 | In a separate labelled DEV SEEDED copy, quote an acquired input/output with insufficient quantity, e.g. acquired Wool and Wool cloth with less than five Wool, at an available native station. | Exact native have/need/output/chance and real blocker. Inspection/reference clicks cause zero command calls, inventory/XP/RNG/work changes. |
| A3 | Scroll Inventory and Reports, select ingredient, expand reference, follow the real station, select recipe, Back/Esc twice. | Named bottom Back always reachable; selected item/key, inventory filter/sort/search/scroll, chosen use and reference scroll restored; log scroll/follow/unread preserved. No page scroll or lost combat context at larger text. |
| A4 | Repeat passive reference during active gathering and active combat; attempt stale station link after native context changes. Also run native trade/shop state if it owns the action region. | Current work/target/log stay legible; no travel, stop-work, craft, consumption or remote access. Follow is disabled/revalidated when unavailable. A stale recipe/item route does not execute or expose replacement details. |
| A5 | Locked recipe, zero-count item-log record, entirely unknown ingredient, partially known recipe, item sold/consumed, recipe row rebuilt and live quantity tick. | No unknown label/result/count in DOM, aria-label, title or hidden reference text; no live resort/button movement; selected route survives valid updates and expires clearly. |

First prove read-only reference and return. A craft test is separately optional and must use the actual native Craft button with its existing guards; no need to spend merely to test inspection. Existing save/import and layout compatibility evidence does not automatically cover this new route. Human feel remains open after technical proof.

## Disposition

ACT NOW: one known-use reference and explicit return through current owners, if root chooses this candidate. ACCOUNT FOR NOW: zero-count discovery, unknown quantities, live identity, stale service availability, native work-mode return and 150% text. LATER: arbitrary recipe graph, ingredient links into a separate catalog, reminders, remote stations and multi-level cascades. No accepted product decision or runtime success is claimed here.

## Input hashes

SHA-256 of files read, captured after investigation. Source was concurrently owned by the root R8 writer, so re-read changed inputs before applying any proposal.

| Path | SHA-256 |
| --- | --- |
| `PROJECT.md` | `26a18222c172444db48356be97b50b471bbc7305d4df043464573a34d0258b78` |
| `docs/USER_VISION.md` | `e4bad762167217bb63691b2f789ca77541512de1ca90e4329c8ce7e48b58829e` |
| `docs/UI_RULES.md` | `d3ce48569c23eb5198aa3600c12d557cc5684dad14e580e874d389e0e2f2f8a0` |
| `docs/research/climb-mr2-playtest-2026-10-15/UI_SOURCING.md` | `dd975fcde4de9d55681cd5f2c3a701dba8bfc64df4f0b802086acfcb9a77781d` |
| `src/display.js` | `685c322350702a48512f2b8d7260108c51ba56b3aaacb31e3ba5c5b6f081d1e4` |
| `src/proto23_shell.js` | `9d4713e3e34aa00a88b477b6027210a3fe234a3c74f8e8ed92ab3a3cf6aa58d9` |
| `src/center_modes.js` | `28a6d846863eae116747fd87a516edb70174fa10a10ff9dd92fad913a4bf2cf7` |
| `src/workspace_layout.js` | `d9dae98efeec914c47de4f6e7dd82db94a0297595c61511f00a9aba818bc8451` |
| `src/workspace_navigation.js` | `98b624624e3f0e2d22af8668e9d57f97153a1d30af0c8c6880f970e49016d3ee` |
| `src/crafting_visibility.js` | `65fb7c4cab55b91a56d156f147b89b8080efdfaa732cd75a0d0b80aa0851ad66` |
| `src/crafting_detail.js` | `4f0112feaba20103f86fbe7bb771468715551ec9df57c68bcfce567873a7aab4` |
| `src/crafting_recipes.js` | `524ca70eb426164bce5ea9621c644a654be40ba61e979298318923f05e14c4d9` |
| `src/items.js` | `b5e80a1406855e1d733386cd4c5253bad01bc3c9e35f6ef17d682d56a517b520` |
| `src/fork_discovery_views.js` | `d33f0c199b4420c24889b7e59dac87fbd3e4908a6286ad0941506ad5bd388e5e` |
| `src/data/locations.js` | `1db9b22c4c2edc1f1d01849e47ba3c5e703ac9f7d0bfc80155170be913d68c05` |
| `docs/gm/dispatch/ui-foundation-2026-10-15/evidence/parity-r7/equipped-village.save.txt` | `4465402dfca7eb4cd137ec4911ee5ccd2ac70e86cc389f22492b2752e6b5388c` |
