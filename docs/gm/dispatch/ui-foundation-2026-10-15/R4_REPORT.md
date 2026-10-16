# R4: readable inventory, hover inspection and richer native feedback

2026-10-15. Writer `01a13ffc-dd13-7c81-b87a-cc235dbb8c82`, effective [transfer](R4_TRANSFER.json). Human visual acceptance **OPEN**.

[Play the frozen synthetic demo](http://127.0.0.1:19155/r4-demo.html) · [Source / frozen R3 / rebuilt R4 comparison](http://127.0.0.1:19155/docs/gm/dispatch/ui-foundation-2026-10-15/evidence/parity-r4/comparison.html).

The demo seeds a synthetic save only if this separate origin has no save. Existing saves there remain intact. Ordinary start is available at the origin root; Presentation selects **Proto23 UI R4**. Existing default presentation is unchanged. Frozen output: `/Users/weiwei/.codex/candidates/yair-ui-parity-r4-2026-10-15-01a13ffc`.

## Direction and reproduction

Read live AGENTS, PROJECT standing direction, USER_VISION UI direction, UI_RULES UR1–40, R3 report/checkpoint/release, R4 packet and actual pinned original before runtime edits. Active fishing/crafting chats were inspected as research-only owners of separate folders. Root retains authority docs. No main/save/clock/continuation, simulation, active research or shared-direction edit. No worker/chat dispatch, queue restart, commit/push, personal-save testing or publication.

Surface types remain routine You/inventory/actions, contextual focus/item inspection, reference full item and ambient Reports. Primary target1366×768; affected1440×900 and1920×1080 checked. Mobile, global rank, new content and a new VFX engine remain deferred.

Live R3 was reproduced on its frozen origin with disposable synthetic contexts, not inferred from a screenshot. [Before captures](evidence/parity-r4/before-inventory-21.png) and `before-*.json` preserve the complaint. At150%, names/counts were21px while values stayed14px; counts abutted values. Source inspection and later field probes found two further causes: generic customization painted opaque grey rows over the source gradient, and equipment slot/quality fragments became anonymous grid cells. An inherited54px value width also clipped larger prices.

Later human steering here explicitly requested hover descriptions plus a fuller page, combat/larger-text feel, richer YAIR feedback connected to prior VFX, and more varied UI states/layout references. The reference request was clarified as **UI states and layouts**, not character-build balance. This report records that instruction for root's canonical fold; it does not edit competing authority docs.

## Finished changes

| Code | Change and reason | Runtime path |
|---|---|---|
| R4A | Native names, quantities, slot/quality tags, coins and prices share actual14/17.5/21px. Equipment uses a name line and a metadata line; value width follows content. Transparent ordinary rows reveal the source blue→teal gradient, with persistent selection/hover and explicit palettes preserved. | `src/display.js`, `styles/ui_tokens.css` |
| R4B | Hover opens a bounded, scrollable native-description preview with **Full item ›** and Esc. Compact previews sit below combat facts; expanded Inventory previews occupy the vacant inventory column, clearing both opponent and list. Free selection and the existing full reference/controller route remain. Native actions execute through original controls. | `src/proto23_shell.js`, shared tokens |
| R4C | Detail lines group native category, quality, stats, increases/decreases, effects/duration and value. Signed values and multipliers keep their actual text. Color means increase/decrease, not universal benefit. Duplicate name removed beneath the retained full title. Native facts/knownness are cloned, not reconstructed from hidden templates. | same shell/tokens |
| R4D | You retains source frame/bar hierarchy, with native species in its existing heading, native YAIR attributes/equipment and a distinct stat/value hierarchy. Biography and full native stats remain on their existing route. No rank, new character rule or invented attribute. | `src/workspace_layout.js`, tokens |
| R4E | Reports retains full-height ownership, native events, actor/outcome text and links, with readable category labels, source-like message-row background/hairlines and distinct discovery/loot/crafting/outgoing-hit/incoming-hit/victory roles. Message text now follows actual larger text. Generic person/thing ornaments removed; unassessed traits use words. | `src/display.js`, `src/village_workspace.js`, tokens |

The five runtime sources/styles above are the only changed source areas. `index.html` and `dist/bundle.js(.map)` are rebuilt output; new R4 scripts/evidence/report live in this dispatch. Baseline source hashes identify the exact delta from inherited dirty files; Git diff alone includes prior work and is not this slice's patch inventory.

## What Proto23 actually does

Pinned original SHA256 remains `a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`. Relevant source: `#dscr` CSS near77; `dscr` near10040; `addDesc` near10361; `renderItem` near11002, description attachment11093, click11094. It is a floating hover description, repositioned by mouse movement and cleared on leave. Its item click uses/equips and may reduce stock. `descsinfo` near10982 adds conditional food information on Shift/E when the source character has the corresponding means. This is not evidence of a permanent item page like YAIR's showcase.

YAIR already had native tooltip data. The persistent showcase/full-reference presentation is a YAIR UI addition from earlier shell work, retained here alongside the new hover route. YAIR deliberately keeps inspection free; source hovering can award Reading experience, and clicking may consume. Those source rules were not copied.

Fresh source-native actions/crafting/skills and hover captures are supplemented by **General Store, Journal, Night/settings, populated equipment inventory and Dagger hover**. See [varied source receipts](evidence/parity-r4/varied-source.json) and comparison's gallery. They call the existing disposable lab/native grant/view owners, remove only the lab display scale and leave original files unchanged. All four added states have zero page errors. Different progression/items are captioned; source grants are not natural-play evidence or equal game states.

Source base text is17.6px; YAIR retains the user's existing font and14px default, with actual17.5px at125% and21px at150%. Source's declared MS Gothic falls back differently on this host. R4 closes mixed-size gaps without silently changing player typography or claiming identical font rendering. The comparison supports natural1366px and fitted previews so scaling is explicit.

## Technical evidence and visual review

| Check | Result | Evidence |
|---|---|---|
| Native UI journey |24 groups pass: three desktops, equip/take-off/use/read, comparison, native stats, people/services, Back/Esc/history, old-layout return, save/file roundtrip, fresh opening and live combat | `runs/r4-browser.log`, `evidence/parity-r4/results.json` |
| Structure/text/combined combat/sort |8 groups pass, including actual17.5/21px, two opponents, native six-fact focus, free inspection, live log, single use, favorite/filter/reverse | `runs/r4-parity-final.log`, `parity-results.json` |
| Every inventory field |21 native rows ×3 sizes pass text/control bounds for names/counts/slot/quality/value, full item and Back | `runs/r4-fields-final.log`, `fields-results.json` |
| Hover/full routes |Six ordinary/multi-combat cases at14/17.5/21px plus live-log case pass; frozen final rerun retained | `runs/r4-hover-frozen.log`, `hover-results.json` |
| Expanded hover |Frozen21px combat: preview clears opponent and source list; first Esc closes preview, second returns; gameplay exact | `runs/r4-expanded-hover-final.log`, `expanded-hover.json` |
| Palette/unknowns/effects/bars |9 supplementary groups pass; custom palette, long names, native low/empty/full/normalized-overcap bars; Full motion3, Reduced/Off/system reduction0 | `runs/r4-extra-final.log`, `extra-results.json`, `bar-boundaries.json` |
| Native hotkey/effect/layout controls |4 bounded inherited checks pass against R4 | `runs/r4-boundaries.log` |
| Final source/controller/contract |11 focused tests pass;211 contract entries/273 occurrences, zero new exceptions | `runs/r4-focused-final.log`, `parity.json` |
| Build/source/served/frozen prior |Rebuilt565 project sources match source map;44 vendor entries separately classified;13 served JS/CSS match. Existing C1/R2/R3 frozen guards pass | `runs/r4-build.log`, `runs/r4-frozen-served.log`, `parity.json` |
| Frozen persistence refresh |Actual21px, selected two-opponent inspection plus Save/reload/Export/literal Import pass | `runs/r4-frozen-integrated-final.log`, `final-integrated.json` |

At1366×768, useful inventory list is273px at14px,258px at17.5px and239px at21px. Unselected lists show12/9/7 fully visible rows respectively in the tested populated state. Selected combat still passes six-full-row checks. Equipment metadata intentionally takes a second line; full names remain in hover/detail. All three desktop page bounds equal their viewport, with no ordinary page scroll. These are supporting measurements, not visual acceptance.

Screenshots reviewed include source equipment-hover, R4 equipment/detail at14/21px, hover during21px two-opponent combat, live combat log and larger text. Native upper regions remain aligned and log stays full board height. Long descriptions use one bounded scroll owner, with explicit Full item and pinned full-view Back. Custom palettes still win. Preview refresh follows the current native tooltip if inventory changes; item selection, previews and navigation add no game clock, RNG or save state.

The broader inherited R3 suite's two failures and three TODOs remain open; this round did not rerun or relabel that whole suite. Early R4 checks exposed retained-break description clipping, equipment grid fragmentation, fixed-price clipping and an expanded-hover overlap. These were repaired and the affected final checks rerun. No additional gameplay completion or physical/human acceptance is inferred.

## Richer YAIR direction and deeper considerations

Read the existing VFX owner `PRESENTATION_AND_FOURTH_WALL.md`, especially knowledge/number rules near2098 and native-realm boundary near2117, plus R2's VFX evidence, `settled_text_effects.js` and `native_discovery_feedback.js`.

- **C1 ACT NOW, completed:** repair scale/price/grid/contrast failures before adding ornament. Native event/category labels remain readable without color; hover never replaces explicit commands.
- **C2 ACCOUNT FOR NOW:** settled discovery receipts, seen-event policy, actor/name/health/stat/log anchors and plain-text outcomes remain authoritative. Inspection must not manufacture a discovery or replay an effect. Existing Full/Reduced/Off behavior is preserved, not presented as a new effects engine.
- **C3 ACCOUNT FOR NOW:** richer detail can expose existing native component, comparison, active-effect and appraisal information through the full route. Unknown traits are not missing facts; source rarity stars, equipment marks and YAIR currency letters are working data/affordances, not generic placeholders. Collapse/Expand, navigation arrows, favorite/hotkey and shield controls retain labels/titles. Source `???` and locked tabs are observed source states, not patterns to reproduce indiscriminately.
- **C4 LATER:** expand reference coverage further when a specific consumer needs it: dense shop/transaction detail, journal/history, recipe/material choices, settings and late populated logs. The new gallery supplies examples now; it does not authorize importing those features or replacing every YAIR surface.
- **C5 LATER:** richer ability-specific text VFX, compact actor/result emphasis, effect-bearing item showcases and observer-aware appraisal can use existing presentation owners. Each needs a real native event/receipt and supported facts, stable controls, static equivalent and no replay on inspection. No new universal appraisal, hidden-stat exposure, portrait pipeline, per-tick flourish or build queue is selected here.

## Compatibility and release

Same R3 presentation/layout keys and native IDs remain. New preview/selection/detail state is transient. Native quality markup gains a named wrapper only; underlying item keys, quantities, values and save schema are unchanged. Old/default layout raw bytes, pins and collapse state restore exactly. Native Save/reload/Export/literal Import is checked only on synthetic origins. Frozen R2/R3 artifacts and excluded native/continuation source hashes are preserved.

**R4 runtime UI ownership is released to root.** No further writer is dispatched and the queue stays held. The remaining authoritative gate is **Weibao's visual/feel acceptance of this rebuilt slice**, including hover comfort and palette taste. Exact pixel/typeface identity, mobile and new VFX/gameplay remain outside the claim.

## Later interaction-choice experiment, same chat

Weibao's next instruction: “rather than item details page we can have a hover menu or something? Different possibilities and more?” This reopens the default interaction choice; it does not accept a full item page as the primary route.

Applied `prototype-to-decision` in a disposable artifact, keeping production runtime unchanged after its final rebuild. [Village experiment](http://127.0.0.1:19156/docs/gm/dispatch/ui-foundation-2026-10-15/evidence/parity-r4/inspection-lab.html) and [two-opponent experiment](http://127.0.0.1:19157/docs/gm/dispatch/ui-foundation-2026-10-15/evidence/parity-r4/inspection-lab.html) run the actual frozen game in a1366×768 iframe, with a labelled external mode switch. Prototype controls are outside the game frame; prototype screenshots are1440×1000, not replacement1366×768 UR14 evidence. Each port is a separate synthetic origin; seeding occurs only if no save exists.

| Option | Observation from the same native item/combat task | Disposition |
|---|---|---|
| O1 Hover only | Quick and easy to dismiss, but transient text is a poor home for a long description or a precise command. Fuller view remains optional. | Useful preview behavior; not recommended as the only inspection route |
| O2 Hover → click to pin | Pin retains a scrollable menu with delegated native Use/Equip/Auto where available, Fuller view and Close/Esc. It clears upper combat facts and gives the description more space. The open overlay covers part of Local actions until closed. | Recommended default, **unaccepted prototype** |
| O3 Stable inspector | Existing R4 behavior preserves a stable selected context and visible local exit. The21px compact combat description has much less reading space; Full item supplies the longer route. | Optional deliberate comparison/reference home; not required as default |

`check-r4-lab.cjs` passes12 comparable cases (Village/combat ×14/21px ×3 modes), exact free-inspection snapshots, one native Use debit per scenario, optional full-view/Back and zero page errors. [Prototype receipts](evidence/parity-r4/inspection-lab-results.json), `runs/r4-lab.log` and `lab-*.png` preserve evidence. The underlying game is real; the capture-phase interaction/overlay adapter is experimental, not production-hardening or persistence proof. Prototype keyboard focus, Enter/Space and Esc are present.125% is selectable, but this specific prototype matrix exercised14/21px only. Source R4 separately checks17.5px.

The prototype implements no new item model, engine, controller, reward or clock. Native action controls remain the command owner; full inspection uses the existing reference route. Broader guard/lifecycle/palette/motion hardening of a chosen interaction belongs to implementation after selection. No selection or new mechanic is inferred from this experiment. **The updated remaining decision is the default inspection interaction and visual acceptance.** Existing rebuilt delivery, saved-layout compatibility and source proofs stay distinct. No further worker/chat is dispatched.
