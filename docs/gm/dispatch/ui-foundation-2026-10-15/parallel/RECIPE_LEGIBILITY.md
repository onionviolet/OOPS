# One native recipe legibility trial

2026-10-15. Read-only investigation for the R8 owner. Proposal only; no runtime source, save, browser, build, engine or shared owner edited. Inherited dirty tree inspected and preserved. Six shared UI files remain root-owned. This worker owns only this report and its unapplied patch.

## Outcome

**P1, ACT NOW:** keep the existing native recipe list and adjacent detail. Name the currently ambiguous requirement ratio **“Uses · have / need”** and give each existing requirement row an accessible label naming both values. This is the smallest original MR2-inspired improvement. The unapplied [recipe-legibility.patch](recipe-legibility.patch) changes only presentation in `src/crafting_detail.js` and forwards existing `state.amount` through the `display.js` detail model as `attempts`. It adds “Can craft now: N attempts”, separate from the output and chance, and no command. The count is zero when the existing guard rejects crafting, even when materials are sufficient. Root must explicitly include that renderer in its write scope before applying. Current token/CSS owner already controls its visual styling.

**P2, ACCOUNT FOR NOW:** use the existing explicit Result details path for longer reading and keep Craft separate. Do not put crafting on a hover or add another catalog, tooltip owner or action dispatcher. The existing Items recipe route already has a stable full-detail surface, costs and blockers. A hover restoration is not required to realize MR2's useful pattern.

**P3, LATER:** a known ingredient → known reverse use → service navigation journey is more than a text patch. No observer-qualified reverse-use projection or callback exists in the inspected detail model. Do not scan every recipe and expose names or counts. A root-owned consumer/producer extension is required before a Factorio-style link is truthful. Likewise, no capacity field exists here; do not invent a storage-cap warning.

Surface: existing place-service Crafting → Cooking → Items, with one selected known recipe. Home, controller, explicit commands, log and return remain the existing owners. Target: populated synthetic test origin at 1366×768, actual 14/17.5/21px text; also 1920×1080 and 3600×1906. Mobile, visual-baseline replacement, changes to crafting rules/eligibility, remote service access and a new reference system are deferred.

## Source facts and native correspondence

| ID | Verified source fact | Native consequence |
| --- | --- | --- |
| F1 | MR2 `CostViewer.ResourceRow` receives distinct current, cost and cap. Current<cost changes current color; cap<cost changes cost color. Default visual order is current/cost. Cap is not itself printed as a third number. Item costs use a synthetic `1e10` cap. | Adapt the distinction and clear reading, not an assumed visible three-column capacity table or item storage rule. YAIR already supplies have/need; label those values explicitly. |
| F2 | MR2 `ActionContainer` uses `isEnabled` for button disabling, separate `isCapEnough` for a strikethrough, collapsed tooltip description/cost and an explicit Expand/Collapse control. Expanded secondary commands are separate callbacks. | A collapsed preview is optional reading. It is not an action or substitute for explicit reasons. Do not copy strikethrough-only feedback, repeated-action behavior, auto-purchase or MR2's confirmation flow. |
| F3 | `display.js:3202–3285` builds one item-recipe status through `itemRecipeStatus`, then sends the detail its observer-filtered requirements, output, native success chance, station tier, XP explanation, blocker and result tooltip. | Most proposed source features already exist. The actual gap for this route is ratio explanation, not a new cost subsystem. |
| F4 | `crafting_detail.js` already renders have/need, “missing N”, reserved, named reason, explicit Craft 1/5/10/All, result disclosure and measured receipt. `focusFirstBlocker` focuses a missing row or reason without executing. | Preserve existing controls and feedback. The patch adds visible ratio meaning, a plain accessible row label and the existing allowed-attempt count, retaining requirement labels and ratios. |
| F5 | `crafting_visibility.js:itemRecipeStatus` reuses `recipe.get_availability()`, fills later requirements after an early shortage, includes station/unlock/disposition checks, and returns `amount`. Native availability is material constrained. | A later “Up to N attempts” could use existing `state.amount`; do not call this N guaranteed outputs, because success chance and partial results can differ. The optional count is included in the unapplied patch after the root owner selected it for the next trial. |
| F6 | `main.js:4716` returns false both for `nativeOccupationReason()` and disposition rejection; the public callback exposes only a boolean. The current detail says “a material is reserved, or you are busy elsewhere.” | Retain this truthful combined reason. Exact named reservation versus occupation cannot be derived safely in a UI adapter. A richer producer is a separate request. |
| F7 | `display.js` filters unknown exact ingredients and unknown material-type labels to “Unfamiliar material”; row creation is for unlocked native recipes. | Build accessibility labels from existing public `req.label`, never internal material IDs. Do not add hidden recipe names to the DOM, search, title or ARIA. |

MR2 input bodies were read locally from the pinned source index, not fetched or copied into runtime. The interpretation is source proof, not an MR2 ordinary-play or retail-parity claim. No code or asset reuse is proposed.

## Concrete route and acceptance journey

Use native **Roasted rat meat** (`cooking/items/Roasted rat meat`) as a controlled fixture, only when unlocked and its station is available. Source definition `src/crafting_recipes.js:1636` needs 2 Rat meat chunks and makes 1 result with native success-chance projection. Counts below are synthetic setup states, not natural-progression claims.

| ID | Check | Observable acceptance |
| --- | --- | --- |
| A1 | Known recipe, one known chunk; select by pointer and keyboard. | Reads “Uses · have / need”, Rat meat chunks 1/2, missing 1, native reason. Selection/hover/blocked command does not advance clock, craft, interrupt work, or hide log. Accessible row names both values. |
| A2 | Same fixture with two chunks and with a reserved/busy state. | 2/2 does not imply craftable when native guard rejects. Existing combined reason remains. Blocked command focuses reason; no output or consumption. |
| A3 | Open Result details, close it, leave through shared controller and return. | Existing result text, selection, scroll and Craft controls remain reachable; no automatic use/craft. If existing return loses position, record as an existing gap rather than claiming this patch fixed it. |
| A4 | At a native eligible state, explicitly Craft 1 once. | Existing native outcome and measured receipt agree with inventory/XP deltas. A failed attempt is not reported as a guaranteed result. Do not run paid gameplay on personal saves. |
| A5 | Repeat A1–A3 at 1366×768 actual 14/17.5/21px and wide viewports; add one unknown-material fixture. | No page scroll in ordinary workspace, log and current work stay readable, pinned Back remains reachable. Requirement heading can wrap within its scroll region. Unknown names stay unknown in visible text and ARIA. No resizing text down to pass. |

Fresh rebuilt origin and browser evidence are required before any UI behavior claim. No browser check was run by this read-only lane. The patch has only been checked for application against its recorded renderer and display inputs. Visual/default-flow acceptance stays open.

## Exact input receipt

SHA-256 values captured from the live dirty source on this pass. Other root work may subsequently change shared files; root should recheck before integrating. Private paths are existing ignored research inputs.

| Path | SHA-256 |
| --- | --- |
| `PROJECT.md` | `26a18222c172444db48356be97b50b471bbc7305d4df043464573a34d0258b78` |
| `docs/USER_VISION.md` | `e4bad762167217bb63691b2f789ca77541512de1ca90e4329c8ce7e48b58829e` |
| `docs/UI_RULES.md` | `d3ce48569c23eb5198aa3600c12d557cc5684dad14e580e874d389e0e2f2f8a0` |
| `src/crafting_detail.js` | `4f0112feaba20103f86fbe7bb771468715551ec9df57c68bcfce567873a7aab4` |
| `src/crafting_visibility.js` | `65fb7c4cab55b91a56d156f147b89b8080efdfaa732cd75a0d0b80aa0851ad66` |
| `src/crafting_recipes.js` | `524ca70eb426164bce5ea9621c644a654be40ba61e979298318923f05e14c4d9` |
| `src/display.js` | `685c322350702a48512f2b8d7260108c51ba56b3aaacb31e3ba5c5b6f081d1e4` |
| `src/main.js` | `dfe9fbcc4b87e70f6993c3578b7fc789fb23a1700ffa3980e1dc75f3492d7b71` |
| `src/items.js` | `b5e80a1406855e1d733386cd4c5253bad01bc3c9e35f6ef17d682d56a517b520` |
| `styles/crafting_detail.css` | `3dd028cc7721ae96c0ced0c2cd7aed0a5c9a16d2963b7330970f2401c3054487` |
| `docs/research/climb-mr2-playtest-2026-10-15/UI_SOURCING.md` | `dd975fcde4de9d55681cd5f2c3a701dba8bfc64df4f0b802086acfcb9a77781d` |
| `docs/research/climb-mr2-playtest-2026-10-15/private/source-index.json` | `41124664ad425be4e1f6ade8cda3f1428b97b4cd33e5776412a5321c2071274e` |
| `…/private/mr2-sources/src/components/utility/CostViewer.tsx` | `289c17d3b404a9e87c20d7922204ba9d69f8b9b012b29f34942d908554c11475` |
| `…/private/mr2-sources/src/components/utility/ActionContainer.tsx` | `013521c1ea31ee444bcc1f00f2c2cb9033f4ed8cde984c70a1b69a77b353c4b8` |

The final two paths expand under `docs/research/climb-mr2-playtest-2026-10-15`. Source-index entries 126 and132 match the actual body hashes. Shared direction UR41–UR48 and desktop-first authority were read. No memory file was read or used by this lane.

Root follow-up: the next coherent trial may include this patch after R8 source/build pin and an explicit write transfer. This does not authorize this worker to apply it.
