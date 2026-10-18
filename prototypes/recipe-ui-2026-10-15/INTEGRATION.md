# Recipe comparison: result and base UI integration

2026-10-15. Requested by Weibao in chat `01a14152-2967-7052-bf73-9dc361f6f363`.
Build and show a playable recipe UI comparison, with clear integration notes for
the concurrently active base UI work. This directory is the only new write area;
no shared runtime/UI/build owner was taken over. Prior research is in
[UI_SOURCING](../../docs/research/climb-mr2-playtest-2026-10-15/UI_SOURCING.md).

## Open and reproduce

[Playable comparison](http://127.0.0.1:19218/). Default: B, ready stock, 100% text.
The retained server serves only this prototype directory. Restart from the repo:

```sh
node prototypes/recipe-ui-2026-10-15/build.mjs
python3 -m http.server 19218 --bind 127.0.0.1 --directory prototypes/recipe-ui-2026-10-15
```

Build snapshots shared YAIR tokens/detail CSS, bundles the actual detail renderer,
availability projection and component decorator, and extracts only two selected
recipe/item literals. [Input hashes](built/INPUTS.json) pin project-source inputs.
No downloaded reference-game code or assets are bundled. This is an isolated
prototype build, not a rebuild of the main game.

Synthetic inventory, station access, Cooking 5, activity and scripted successful
craft outcomes are labelled in the UI. Real source definitions supply ingredients,
outputs and effect names. Base success uses the source formula without native
bonuses; production success/XP/partial outcomes are not simulated. No main bundle,
game startup, user save, localStorage, native RNG or save migration is involved.

## Task and surfaces

Primary target: populated synthetic inventory at1366×768, actual14/17.5/21px text;
1920×1080 at21px also inspected. Visible outcome: select a known recipe, understand
costs/result, perform an explicit simulated cook, follow ingredient → known use →
related recipe, and return to the original recipe/query/focus while current work
and the full-height log remain available. Mobile, new gameplay/content systems,
save/layout migrations, universal search and a new UI baseline are deferred.

Surface types: place service at Cooking; compact recipe inspection in its own
task region; explicit full recipe/reference in an expanded center task region;
routine work summary in You; inventory at left; ambient Reports at right. The
prototype's simplified static five-region frame is a comparison fixture, not
a replacement implementation of R8 or its exact measurements.

| ID | Treatment | Observed tradeoff |
| --- | --- | --- |
| C1 | A: existing `renderCraftingDetail`, with the same synthetic public model | At14px it offers requirements, station, chance and optional result detail together. At21px its adjacent detail needs substantial scrolling. Batch controls are removed only in this fixture; all trial commands cook one item |
| C2 | B: compact summary plus explicit full recipe | At21px the known result effects, cook button, Full recipe route and current work stay visible. Optional facts and longer descriptions live in the full view. A longer blocker or receipt can still require scrolling inside the summary |
| C3 | Full recipe/reference | Uses more center height while preserving You, Inventory and Reports. At21px longer content scrolls; command and destination Back stay fixed. Reference/back history preserves original selection/query/focus |

**Recommendation, awaiting Weibao's visual choice:** use B for routine browsing,
with full detail explicit; permit richer adjacent detail where actual available
space supports it. Do not make text smaller to preserve A. Neither this result nor
the existing R8 technical evidence establishes human acceptance of a new default.

The first large-text pass hid current work inside the player scroll area. The
fixture now gives it a fixed footer. Its initial text-size selector also changed
the root size while inherited shared CSS kept body text at14px; body now inherits
the selected size and browser checks assert actual recipe-row font sizes. Final
captures supersede the early `compact-100`, `compact-150` and `actual-150-before`
images. Use the final filenames below.

## Integration map: extend these owners

The base UI chat `01a14072-4b0f-7300-a645-5a3d29d25a8f` was active at inspection.
Its R7/R8 reservation includes display/shell/layout/navigation/tokens. No message
or shared-file edit was sent to that chat. These notes are reviewable integration
input; recover its live ownership before production edits.

| ID | Existing owner | Proposed incorporation; avoid duplication |
| --- | --- | --- |
| I1 | `src/display.js`: `selected_item_recipe`, `build_item_recipe_model`, `refresh_crafting_detail` | Project compact and full views from the same current selected recipe/model. Keep a single selected recipe, filter and list position. If an adapter is needed, expose a narrow read interface in this owner, not a second recipe store |
| I2 | `src/crafting_visibility.js`: `itemRecipeStatus`; `display.js`: `item_recipe_state` | Use one live availability for row, filter, preview and command. Keep quantity shortage, missing station, reserved materials and knowledge distinct. The lab's lookup shim is fixture-only; never promote it into a second eligibility implementation |
| I3 | `display.js`: `commit_selected_item_recipe` → native `window.useRecipe`; `crafting_detail.js`: `craftReceiptText` | Both views call the same native commit path with an amount. It already rechecks availability and reports measured material/output/XP deltas. Do not promote the lab's scripted success, stock mutations, base-chance calculation or fake routine into production |
| I4 | `src/crafting_detail.js` and `styles/crafting_detail.css` | Add a compact presentation of the existing public model and reuse full detail. Surface important known effects before committing. Native result details are currently HTML; obtain structured known effect facts from their owner if needed, rather than parse tooltip text or build a second stat/effect pipeline |
| I5 | `src/panel_kit.js`: `definePanel`; `src/workspace_layout.js`: `openWorkspaceModule` / `expandWorkspaceModule`; `src/center_modes.js` | Keep Cooking in its existing service home. Use appropriate-panel inspection and the existing controller for center replacement. Reuse destination Back/Esc and current scroll/group restoration. The prototype's local history array/DOM layout is disposable; do not import it as another navigation manager |
| I6 | Existing `item_log.is_known`, recipe availability and `src/skill_discovery.js` public projections | Derive ingredient links/reverse uses only from currently known recipes/materials and real access. Unknown data must be absent from labels/counts/search/DOM previews. The lab's two-entry `knownRecipes` filter is not a production knowledge policy |
| I7 | Existing Reports/native event producers and UR48 | Continue real receipts/subject references through existing log owners. A historical hover explains the recorded event; a current recipe link must say it opens current state. The lab event snapshot demonstrates the distinction but is not a new event store |
| I8 | Shared `styles/ui_tokens.css`, `src/ui_components.js` and current shell | Use shared tokens/components and public model values. Keep rows/selection stable across progress ticks. Update only changing facts; avoid rebuilding detail while someone reads or tabs. Prototype CSS/classes are experiment geometry, not a new skin/component library |

A reverse-use link is currently **demonstrated over two explicit fixture recipes**,
not an established universal catalog. Start production with the known recipes of
the selected service. If an existing reference surface can host it, add a section
there. Expand indexing/search only when actual scale or another consumer warrants
it. Remote inspection must never grant travel, station access or crafting rights.

Capacity blocking is relevant to the broader pattern but not this cooking recipe:
no invented mana or capacity gate was added. A later energy-based consumer should
provide both current stock and real maximum through its authoritative projection.

## Acceptance and evidence

`node prototypes/recipe-ui-2026-10-15/check.cjs`: **19 browser check records pass**,
no page errors, no localStorage keys. [Detailed results](evidence/checks.json).
Both layouts at14/17.5/21px; no page scroll at laptop target; shortage/station/
reserved-stock attempts spend nothing; explicit trials apply real recipe
quantities; repeated attempts stop at depletion; variant switching retains
stock/selection/filter; reference history restores query and keyboard focus;
limited-knowledge fixture omits unknown names/recipe; event text stays historical;
simulated work continues during inspection; scrolled Reports hold position and
show unread activity; wide full view has no page overflow. Known compact result
effects are checked fully inside their visible scroll region before cooking.

Final inspected captures: [B14](evidence/compact-14.png),
[B21](evidence/compact-21.png), [A14](evidence/adjacent-14.png),
[A21](evidence/adjacent-21.png), [full21](evidence/full-21.png),
[wide full21](evidence/full-wide-150.png).

Remaining authoritative gates: Weibao's visual/default-interaction choice, then
an authorized native integration by the shared UI owner. That implementation
needs a main-game rebuild and fresh-origin natural recipe route with native
costs/chance/failure/XP, real discovery/access, work cancellation semantics,
keyboard/larger-text checks and affected save/import/layout compatibility.
Prototype tests do not close those gates. No commit, push or publication.
