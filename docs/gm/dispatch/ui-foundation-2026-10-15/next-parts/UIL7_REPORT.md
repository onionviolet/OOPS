# UIL7: adjustable parity panels, 2026-10-18

UIP1 from [Round 2](surface-manifest-and-ui-flow-2026-10-18.md#round-2-adjustable-panels-stat-sheet-and-splits-2026-10-18).
Rules: UR11, UR17, UR23, UR24, UR30, UR33, UR46, UR52, UR53, UR58; AR1–AR16; AD36.
Target: 1920×1080 primary, 1366×768 floor, each at actual 14px and 21px. Mobile,
classic changes, stat/Condition/weather content and inventory splits are deferred to their owners.
The required technical gates pass for the input snapshot below. Weibao's visual acceptance remains OPEN (UR16).
No commit, push, branch switch, stash or reset. HEAD at start: `5976bf3d3d77034cfe01b94a5e89506ac6af2509`, branch `codex/gameplay-foundations`.

## Change and ownership

| Code | Change |
| --- | --- |
| F1 | R21 could move boxes but had no adjustable gutters. `src/shell_resize.js` now overlays four focusable separators in the existing gaps: upper left/centre, lower left/actions, centre/Reports and upper/lower rows. Upper/lower left widths are independent, including when their boundaries cross. In a service, the upper separator runs the full centre height and the absent lower boundary has no handle. No new grid gap or simulation writer. |
| F2 | `shell_layout_edit.js` adds optional `sizes: {topLeft, bottomLeft, log, top}` fractions to each existing R21 placement context. Spec remains 4: older v2/v3/v4 placements with no sizes keep automatic fit, box moves, companions and swap. Invalid fractions drop. Reset this layout clears the current context's arrangement and sizes, preserving other contexts. Preferences belong to this browser, not a world or character. |
| F3 | `workspace_layout.js` injects the placement read/write seam into the controller and `shell_composition.js`. The fit engine restores default geometry before computing default fit on Reset/context changes, then applies stored rows/columns over automatic CSS. Width minima measure visible content words and header controls at their current font; controls hidden with visibility still reserve their real space. Rows reuse the spec's font-scaled top/bottom budgets. Text never scales down. Reports keeps its column and full height. Layout Export/Import now includes `shellPlacement` while retaining legacy layout-only imports. Game Save/Export does not gain browser preferences; same-browser game import preserves them. |
| F4 | Pointer capture, keyboard arrows (10px; Shift 40px), labelled separator semantics, visible focus and widened gutter hit targets. Escape restores pre-drag geometry and storage and stops before global Back. Pointer cancel/lost capture cancel too. No tick listener or gameplay effect. Existing shared per-panel Collapse/Expand controls are reused, including their critical-panel safeguards; no second header control system. |

Owned runtime paths: `workspace_layout.js`, `shell_composition.js`, `shell_layout_edit.js`, new
`shell_resize.js`, `styles/shell_layout.css`; UIL7 test hunks in `tests/layout_spec.test.js`;
new `check-uil7.cjs`, evidence and this report. **UIL7 did not edit `layout_spec.js`,
`proto23_shell.js`, the stat sheet, inventory styles, place header or any gameplay owner.**
Their dirty UIL8 edits are part of the shared verification input. UIL8 also updated separate hunks
of `tests/layout_spec.test.js`; the coordinator must retain both sets.

## Verification

Chosen regression: a v4 R21 placement gains sizes without losing box moves; service resizing and
Reset cannot mutate idle/combat/travel; malformed sizes cannot hide Reports. Browser checks also
assert actual geometry changes, no gameplay mutation, Esc restoration and a stable paused target.

| Command | Result |
| --- | --- |
| `node --test tests/layout_spec.test.js tests/shell_composition.test.js tests/ui_contract.test.js` | 23 pass |
| `npm test` | 2,145 pass, 0 fail, 3 existing TODO (2,148 total) |
| `npm run check:arch` | Pass |
| `npm run check:rule-behavior` | 36 pass |
| `node build.js` | Pass; rebuilt shared checkout, including concurrent UIL8 source |
| `R4_URL=http://127.0.0.1:19277 PHASE=after node docs/gm/dispatch/ui-foundation-2026-10-15/check-uil7.cjs` | Pass: all four targets; every visible gutter by pointer and arrow keys, Esc cancel, idle/service/combat restoration, Reset, Save/reload/game Export/Import, layout Export/Import; no page errors |
| `R4_URL=http://127.0.0.1:19277 LEGACY_ONLY=1 node docs/gm/dispatch/ui-foundation-2026-10-15/check-uil7.cjs` | Pass: old v4 placement unchanged on read; move survives resize; Reports stops at 439px at 1366/21; page 1366×768; no page errors |
| `R4_URL=http://127.0.0.1:19278 PHASE=before node docs/gm/dispatch/ui-foundation-2026-10-15/check-uil7.cjs` | Four targets captured on separately rebuilt baseline |

The baseline is `/tmp/uil7-baseline-live`: current source/styles copied, then only the three changed
pre-UIL7 JS owners and shell layout CSS restored from start-of-task copies. It retains UIL8's
manifest/content instead of comparing against a different feature set. Neither build changes the
user's saves. Browser contexts are fresh with the existing populated fixture; native imports use
only temporary fixture exports. Build artifacts and index.html were dirty before this task;
the coordinator owns their integration.

Evidence: [`../evidence/uil7/`](../evidence/uil7/). `before.json`, `after.json`,
`legacy-and-limits.json`; before/default-after/resized/imported/combat screenshots at all four
targets, plus the Reports minimum at 1366/21. Input hashes and command logs are saved there.

The matrix checks the real Mixing route and native Village → Infested field → Village combat
transitions, without injecting a context flag. Each gutter's pointer step changes actual geometry
by a bounded amount, then its keyboard step updates the stored size. Escape restores both geometry
and storage. A paused pending target stays fixed for 1.5 seconds. Every target saves, reloads,
exports a native save, imports the literal file, then separately exports/imports the layout
configuration after Reset. All four results have `cancel`, `stable`, `reload`, `import` and
`layoutImport` true, a restored combat size and an empty page-error array. The legacy pass loads
an unmodified v4 placement with Inventory moved to the top left, verifies no write on read, then
resizes without losing that move. Thirty Shift+Right steps stop Reports at 439px at 1366/21;
an additional step changes nothing, the viewport stays 1366×768, and text stays at the selected size.

During development, screenshot review caught the Reports minimum accidentally counting closed
menu text, then omitting header buttons that use visibility:hidden but still occupy space.
Both measurements were corrected before final verification. Early shared-tree tests saw UIL8's
Condition registration arrive before its manifest/test updates; those unrelated transient
failures cleared when UIL8's own hunks arrived. No foreign file was repaired by UIL7.

## Remaining gates and release

No requested technical gate remains open for this snapshot. Implemented-unverified: touch hardware, OS/browser zoom distinct from
the specified text-size setting, and actual native travel (same context store, unit-covered;
fixture has no reachable persistent journey, as UIL4 documented). Mobile and classic optimization
remain deferred. Visual/play acceptance belongs to Weibao.

UIL7 source is stable and releases its runtime file ownership, including `workspace_layout.js`,
against `evidence/uil7/inputs.sha256.txt`. Remaining work in this chat is recording the final
browser evidence against the already-built bundle. A1/A2 may integrate their own authorized
changes after this snapshot; those edits are outside this report's proof and need their own
affected checks. UIL7 started no additional composition or Around you work. UIL9 and later
composition work should consume the existing placement/fit seam.
