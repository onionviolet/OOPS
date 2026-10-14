# Crafting screen: current map, routes and Proto23 reference (2026-10-13)

Research for the gate "one crafting screen that explains itself fully". Read-only on
source. Build measured: `dist/bundle.js` sha256 prefix `0219035cdbca2bee` (no rebuild;
`index.html` is newer than the bundle but is not bundled). Line numbers are current
working-tree lines. Labels: **measured** = browser run at 1366x768, Workspace + Vivid
(the fresh defaults); **read** = source; **inferred** = deduced, not exercised.

Checks and fixtures: [`../checks/`](../checks/) (`routes.cjs`, `build_fixtures.cjs`,
`verify_fixtures.cjs`, `measure_current.cjs`, [`fixtures/README.md`](../checks/fixtures/README.md)).

## Key findings

| Code | Finding |
|---|---|
| F1 | No list/detail split today. Each recipe is a row; the only "detail" is a hover tooltip (`.recipe_tooltip`, mouse-positioned). Items rows craft on **click of the name**; there is no Create button, no selection, no focusable row. |
| F2 | Availability has **four-plus owners** that can disagree (table below). The craft path re-derives its own answer. |
| F3 | Blocked rows are only grey (`.recipe_unavailable`); clicking one does nothing and logs nothing (measured: log delta empty). The reason lives only in the hover tooltip (red `x0/1`). |
| F4 | Unknown ingredients are half-hidden: tooltip shows `Unknown <material_type>` (e.g. "Unknown raw wood"), which leaks the type; the **result name and full item tooltip are always shown**; recipe row names are always shown. Component material choices skip unknown materials entirely. |
| F5 | Receipt contradicts output (measured). Processed rough wood (`scale_results`) produced 1 item, log said "Created Processed rough wood [1 out of 3]", but the settled receipt said "Craft settled: no output from Processed rough wood. 0/1 attempts succeeded." Cause: receipt keys success off `successes` (whole-craft success) while output uses the fuzzy scaled count (`main.js:4175`, `4217`; `work_ledger_system.js:136-139`). |
| F6 | Equipment crafts bypass the transaction and the receipt: `use_recipe` wraps only `items`/`components` (`main.js:4029-4031`); the equipment branch never calls `settleWorkLedgerCraft` (`main.js:4344-4445`). |
| F7 | At 1366x768 the crafting view fits without page scroll (doc 768 = viewport), but the fixed-height window clips its own list and Exit (measured, below). |

## 1. Current crafting UI

### Entry and window

- Entry: `.location_choices.choice_craft` "Try to craft something" (Village `use_text`), built in `src/display.js:2190-2200` when `global_flags.is_crafting_unlocked` and `accessoryCraftingTiers(location, …)` is non-empty. `onclick="openCraftingWindow()"`. Fallback label "Cook with travel hearth" for the portable-hearth case (`src/absorb_c1/accessories.js:95-103`: safe zone + equipped portable cooking accessory).
- Window markup `index.html:347-370`: `#crafting_window.crafting_window` > `#crafting_mainpage_buttons` (7 `.crafting_mainpage_button[data-crafting_category]`: crafting "Tinkering", butchering, cooking, woodworking, smelting, forging, alchemy) > `#crafting_subpage_buttons` (`.crafting_subpage_button[data-crafting_subcategory]`: items "Items/trinkets", components, equipment) > `label.crafting_filter` with `#crafting_makeable_filter` ("Makeable now") > `#crafting_filter_empty` > `#recipe_categories` > `#exit_crafting_button` ("Exit", `closeCraftingWindow()`). `#cancel_craft_visual_effect` is appended at boot (`main.js:8191-8196`).
- Window API on `window`: `openCraftingWindow`, `closeCraftingWindow`, `switchCraftingRecipesPage`, `switchCraftingRecipesSubpage`, `useRecipe` (`main.js:7726-7730`).
- `open_crafting_window` (`display.js:2867-2902`): hides `action_div`, shows the window, binds the filter once, hides category buttons with no station tier, clicks the first available category if none selected, then `update_displayed_crafting_recipes()`. `close_crafting_window` `display.js:2904-2908`.
- `switch_crafting_recipes_page` (`2914-2926`) hides subpage buttons whose recipe bucket does not exist and clicks the first subpage; `switch_crafting_recipes_subpage` (`2933-2947`) toggles `display` on every `[data-crafting_category][data-crafting_subcategory]` page. Both call `unexpand_displayed_recipes` (`2949-2958`), which clears `.selected_recipe` etc., so **switching tab drops any selection**.
- Pages: one `.crafting_category.crafting_recipe_list[data-crafting_category][data-crafting_subcategory]` per bucket, created lazily in `get_recipe_page` (`display.js:2995-3014`) under `#recipe_categories`.
- Workspace: `#crafting_window` is itself a `.customization-module` inside the Local actions module (`main.js:2183`); `workspace.css:560-563` hides place prose while a local task is open and puts the cancel-effect button in flow.

### Recipe rows (`add_crafting_recipe_to_display`, `display.js:3031-3170`)

- Skipped entirely unless `recipe.isUnlocked()` (`3037`).
- **Items** (`3049-3066`): `.recipe_div[data-recipe_id]` > `span.recipe_item_name` (name + `xN` result count) + `.craft_ammount_buttons` (5, 10, all; `create_craft_amount_buttons` `3172-3196`) + `.recipe_tooltip.items_recipe_tooltip`. Click on the name crafts 1 unless the row has `.recipe_unavailable`; amount buttons craft N even when unavailable (the craft path then no-ops with a console warning, `main.js:4229`).
- **Components** (`3067-3079`) and clothing/cape `component`/`componentless` (`3080-3103`): name with a dropdown icon; click toggles `.selected_recipe` and calls `updateDisplayedMaterialChoice`, which lists known held materials as `.selectable_material` rows; **clicking a material row crafts immediately** (`3535-3545`).
- **Equipment** (`3104-3165`): one "Select a [type]" list per component slot, `.selectable_component` rows from inventory; `.recipe_creation_button` "Create" + amounts, shown only under `.selected_recipe` (`style.css` `.selected_recipe .recipe_creation_button`).
- Tooltip content `create_recipe_tooltip_content` (`display.js:3322-3423`): success rate colored lime/yellow/orange/red; "Materials required" each `name x have/need` lime or red; per-stack sub-list for typed/quality materials; XP value; full result item tooltip. Components show quality range and XP range; equipment shows "Select one component from each category" until both are picked.
- Tooltip placement: mouse-following via `--recipe_tooltip_top/left` (`index.html:1415-1422`), shown on `:hover` (`style.css:1581-1592`).

### Availability and missing requirements (several owners)

| Owner | Used for | Notes |
|---|---|---|
| `ItemRecipe.get_availability()` `crafting_recipes.js:126-141` via `find_recipe_material({needed_count})` `314-374` | Items row `.recipe_unavailable` (`display.js:3054`, `3227-3231`, `3571-3575`); the craft itself (`main.js:4097`) | Honors `stop_crafting_on_material_change` (cheapest stack first). Does not check occupation or item disposition. |
| `find_recipe_material({ignore_stop:true})` | Tooltip have/need (`display.js:3331`) | Sums all stacks, so it can show "have" higher than the craft will use. |
| `recipeMakeableNow` `crafting_visibility.js:3-34` + `canConsumeNativeCraftingItem` `main.js:3435-3443` | "Makeable now" filter only (`apply_crafting_filter`, `display.js:2960-2993`) | Adds occupation and disposition checks. Station tier read from `current_location?.crafting?.tiers` (`2975`), unlike every other site, which uses `accessoryCraftingTiers` (`2880`, `3324`, `main.js:4073`). **Inferred:** with only a portable travel hearth, the filter would treat cooking as tier 0 and hide all cooking rows. |
| Material choice count `display.js:3534` | Component/clothing material rows grey vs clickable | `material.count <= held` only. |
| `execute_native_recipe` `main.js:4066-4446` | The craft | Re-checks station (`4073-4074`), disposition of every chosen stack (`4085-4092`), then per-type availability. |

- **Skill/level gate: none.** `recipe_level` only scales success chance (`crafting_recipes.js:80-84`) and XP falloff (`get_recipe_xp_value` `396-420`). Station tier also raises chance and quality.
- **Tools: none** for recipes (gathering activities need tools; `main.js:2304-2310`).

### What a craft does

- Instant, no timer. `use_recipe` (`main.js:4029-4064`) opens a `beginNativeCraftTransaction` scope (`native_craft_transaction.js`), runs `execute_native_recipe`, persists via `settleWorkLedgerCraft` → `publishWorkLedger` (`main.js:2208-2230`) and only then releases buffered log messages; failure rolls back owners and logs "Craft was not saved…".
- Items: batch of N attempts with success chance; stops early at the next skill level and recurses for the rest (`4104-4220`); consumes materials for all attempts; `scale_results` recipes give a fuzzy partial count (`4170-4175`).
- Components: per-item quality roll, XP accumulated, outputs keyed by quality (`4256-4340`).
- Equipment: quality from weighted component quality and tier (`4344-4445`); no ledger receipt (F6).
- Quality: `get_quality_range` (`crafting_recipes.js:86-102`) from skill level, station tier minus result tier and, for equipment, component quality (`get_component_stats` `376-394`); caps per skill (`get_crafting_quality_caps` `39-44`). Component data generation `crafting_component_filling.js` is item data, not UI.

### Receipt and log

- Log: `Created X x1` / `Created X [k out of n]` / `Failed to create X …` with category `crafting` (`main.js:4176-4195`); components/equipment add quality and XP.
- Settled receipt: `.work-ledger-effect` overlay inside `#crafting_window`, anchored to the recipe row (`main.js:2217-2218`, `styles/settled_text_effects.css`), text from `work_ledger_system.js:136-139`. Measured at 348-421px, over the list rows; it shares space with the hover tooltip.

### Hiding unknowns today

- Recipes: hidden until unlocked (`display.js:3037`).
- Item recipe ingredients: `obscure_name_to_type` (`display.js:347-349`) → `Unknown <material_type|component_type|"material">`.
- Component material choices: unknown materials skipped (`display.js:3520`).
- Not hidden: recipe names, result names and result item tooltips.

### Keyboard (measured)

Tabbable in the window: 7 category divs, 2 subpage divs, the filter checkbox, `#exit_crafting_button`, `#cancel_craft_visual_effect`, then the list container (scrollable). **Recipe rows, names, amount buttons and material rows are not focusable** (`DIV`, `tabIndex -1`, no role). No crafting key handlers (the only document keydown in `display.js:264-267` is an inventory baseline). After a click-craft focus is `BODY`.

## 2. Routes and fixtures

- Legit native route to crafting: clear Infested field (15 groups) → elder "cleared field" → old craftsman "hello", "learn". A fresh hero died in about 30 s with 0 kills (measured), and Playwright's fake clock does not drive combat, so the fixture uses **one save edit** that stands in for the clear (details in [fixtures/README](../checks/fixtures/README.md)); everything after is UI play.
- `routes.cjs` exports the vivid routes (`startFresh`, `saveText`, `unlockCombatRoute`, …) plus `loadSave`, `readFixture`, `talk`, `learnCrafting`, `openCrafting(p, category?)`, `recipePage`, `selectRecipe(p, idOrName)` (scrolls and hovers; no craft), `craftOnce`, `closeCrafting`.
- Fixtures: `craft_ready.save.txt` (Woodworking: Processed rough wood makeable, Processed wood blocked by "Unknown raw wood x0/1"); `craft_none.save.txt` (crafting known, nothing makeable, Makeable now shows `#crafting_filter_empty`). `verify_fixtures.cjs`: 4/4 PASS (each fixture twice, fresh contexts, 0 page errors, open/close/reopen).

## 3. Proto23 crafting UX (source `index.html` e93a8cd, L10620-10735, R4 §1, F6/F7)

- **Layout:** recipe list (`renderRcp`) on the left; detail region `ct_bt1_2` on the right with three labeled bands: "reagents required", "output", "tools needed". The detail is filled on **mouseenter** of a row (hover selects); a `⋗⋗` marker shows the current recipe. **Click on the row crafts.**
- **Unknowns:** ingredient name `?????????` until `item.data.dscv`; output name `?????????` and amount `???` unless `rcp.allow`. Locked recipes are not listed; the Assemble tab reads `???????` until the first recipe unlocks.
- **Requirements:** each ingredient row `need / have`, lime when enough, grey when not; `[E]` marks an equipped gear copy that would be consumed (worst durability first); `∞` for non-consumed tools. Row names grey when not makeable.
- **Tools:** text lines (e.g. "Nearby firesource", "Any sharp tool", "Tailoring tool lvl: 1", "Cooking lvl: 3"), lime when met, red when not.
- **Skill XP:** per-recipe `giveCrExp` cap ("tutorial grind"); no general level gate; only Steak's tool text is a level check (and tests `== 3`, a bug).
- **Repeat craft:** toggle shown once Crafting ≥ 1; interval `max(300, 5000 − 350·Crafting − 150·Patience)` ms; stops on empty materials or any choice click; +0.05 Patience XP per repeat. `_fcraft` refuses while sleeping, fighting, reading or busy, with a red message each.
- **Counters and the bug (F7):** `canMake` correctly requires every tool (`!o.includes(2)`), but row color, click safety and `_fcraft` check only `o[0]`. With tool A present and tool B missing, the row looks makeable, the click "crafts", nothing is produced or consumed, and the craft counter `crftt` still increments. Lesson: one authoritative result for enabled state, every missing requirement, execution and receipt; count only actual crafts.
- **F6 lesson:** keep quote, missing requirements and the next command together; preserve selection/focus/scroll; keyboard-first selection with hover as preview only.

## 4. Current state at 1366x768, Workspace + Vivid (measured, `craft_ready`, Woodworking)

| Measure | Value |
|---|---|
| Page scroll | none (docH 768 = viewport; no horizontal scroll), before and after a craft |
| `#crafting_window` | top 199, bottom 599, 543 px wide (x 392-935), fixed `height:400px` (`style.css:1452-1455`), overflow hidden, content 493 px |
| Visible recipe list | top 342, bottom 642 (`height:300px`, `overflow-y:scroll`, `style.css:1497-1506`), scrollH 487 / clientH 298, 11 rows; **bottom 43 px clipped by the window** |
| `#exit_crafting_button` | 592-625, `position:absolute`; center hit-tests to `.workspace-module-body`, so **Exit is not visible/clickable at its center** without scrolling the module |
| Detail | none; hover tooltip only. Craftable tooltip 372-690, blocked tooltip 411-709 (inside viewport, overflowing the window and covering rows) |
| Disabled reason | not visible without hover; row only grey. Click on a blocked name: no message |
| After craft | list scrollTop kept (20 → 20), window stays open, row class refreshed, focus on `BODY`, no selection concept, receipt overlay at 348-421 over the rows, log line in Reports |

Screenshots: `current_open_woodworking.png`, `current_hover_ready.png`, `current_hover_missing.png`, `current_after_craft.png` (this folder).
