# UI modularity round, 2026-10-22

Request (Weibao, 2026-10-22): "Do all 5 things", meaning the five open items from the
[UI modularity palette](../ui-foundation-2026-10-15/next-parts/ui-modularity-2026-10-17.md):
UM3/UM8 grid from the spec, UM4 regions and Tab order from the spec, UM9 box-keyed styling,
UM5 one control vocabulary for Skills/Quests/Crafting, and a `main.js` composition-root step.

Rules: AR1, AR3, AR4, AR9, AR15 (runtime); UR51, UR52, UR53, UR54 (UI); AD40/UR49 (parity);
AD41 (checkout). Target: desktop 1920×1080, 1800×1040 and 1536×864 at 14/21px. Mobile deferred.

## Ownership and isolation (AD41, AR15)

- Owner: this Claude session. Isolated worktree `/Users/weiwei/code/yair-worktrees/ui-modular`,
  branch `ui-modular-2026-10-22`, base `e59df9a28`.
- Reason: the primary checkout had uncommitted cultivation-spacing hunks in `main.js`,
  `proto23_shell.js` and `ui_tokens.css`, and engine-bindings plans `main.js` joins.
- Reserved writes: `src/layout_spec.js`, `src/workspace_layout.js`, `src/shell_strip_boxes.js`,
  `src/dev_console.js`, the `main.js` dev-console hunk, one `proto23_shell.js` mount hunk and one
  query hunk, and the grid/region rules in the stylesheets listed under Changes.
- The worktree's `node_modules` is a symlink to the primary checkout's; at retirement remove the
  link itself (`rm node_modules`), never its target.
- Retirement: after Weibao's decision on merging, integrate the branch into master hunk-wise
  (rebuild `dist/` and the `index.html` versions instead of merging them), then remove the worktree.
- Nothing is committed or pushed.

## Status

| Code | Status | Evidence |
| --- | --- | --- |
| UM4 | Already delivered before this round. `workspaceRegions()` builds regions and DOM/Tab order from `spec.regions`, and an existing test reorders them. The 2026-10-17 palette row was stale. | `tests/layout_spec.test.js` "a new or reordered region is supplied by the spec" |
| UM3/UM8 | Implemented, structural. `LAYOUT_SPEC.grids` holds named grids in width bands (areas and column shares), and a context can name its grid. The host writes `--shell-areas`, `--shell-columns` and `--shell-share-N`, and each region carries `--shell-area`. CSS keeps one generic rule. Inventory composition shares are derived from the band and no longer hand-computed per breakpoint. | Identity 18/18 (see Checks); 3 new spec tests, one of which adds a sixth region and its own grid with no CSS edit |
| UM9 | Implemented, structural at default. Shells carry `data-box`, and regions carry `data-main-box`. Region backgrounds, the Around you custom palette, You overflow, the binding hide and the status-window rules now key on the box. Slot geometry stays keyed on the region on purpose: the companion layout beside the actions, item inspection beside the actions, and the inventory composition condition (all 8 `inventory_composition.css` hits). No JS reads a region except the host. | Default identity 18/18. Box moves compare region background, overflow, header, title, first row, control-box button and binding: before, 6 of 9 moves changed a box's look; after, all 9 keep it. |
| UM5 | Implemented as a **proposal**, which is a visible change. Skills sorting and Hide max level, Quests Hide completed, and Crafting recipe kind plus Makeable now each open from one control box. Frequent categories stay inline (CB2). Native controls move in and back, so their owners keep their state (CB5). | Journey check, 21 gates at 1920/14, 1920/21 and 1536/21: native action and label; Esc and focus return; keyboard open, Tab and Enter on moved `div[role=button]` controls; Save, reload and relabel of the two gameplay-save toggles (CTL4); native homes restored after leaving the shell. Label test. Bespoke strip census 8 → 3; the remaining three are the inline category tabs. |
| main.js | One structural slice. The dev console moved to `src/dev_console.js` with injected deps and getters for live bindings, leaving one call line in `main.js`. `main.js` went from 10,274 to 10,114 lines. | Arch check passes (no new cycles or main imports). Dev-console comparison with dev mode switched on in the served bundle only: 12 calls identical on both builds. |

Pre-existing defects seen, not fixed (structural rounds change no behavior, AR9):
- Dev console `add_xp` throws (`character.xp` undefined) and `add_skill_xp` returns undefined.
- With an empty search, the expanded Skills view reads "0 / 14 stacks · No matches".
- The shared R11 `textSize` helper sometimes fails to open the Menu on both builds. This round's
  harness copy retries it up to three times.

Remaining limits:
- Grid rows, gaps and the top-row fit stay in the stylesheet and `shell_composition.js`.
- `shell_resize.js` still names the five default regions, so a sixth region is placed by the spec
  but has no resize handle.
- The non-parity Proto23 Shell `core` panel list in `updateWorkspace` still duplicates shell IDs.
- `main.js` remains far from a composition root. Next ranked candidate: the `option_*` handlers
  (about 270 lines, medium risk because of load-order coupling).
- The architecture line baseline was not shrunk (`--shrink` would also tighten `display.js` for
  other lanes). At integration, lower only the `main.js` entry to 10,114.
- UM5 cost (UR51): skill sort, recipe kind and Hide completed each take one more click than before.
- `src/ui/control_box.js` now also sends initial focus to `[role=button][tabindex=0]` controls,
  so a box holding native div strips focuses its first control. Inventory, Reports and Menu bodies
  begin with real inputs or buttons, so their focus is unchanged (suite and strip journey pass).
- Human visual acceptance of UM5 is open.

## Checks (rebuilt bundle, fresh origins, headless Chrome)

Builds: before = `git archive e59df9a28` built in the scratchpad and served on 127.0.0.1:19401;
after = this worktree served on 127.0.0.1:19402.

- `npm run build`: pass. `npm test`: 2520/2520 pass. `npm run check:arch`: pass (`main.js` 10,114
  against a 10,310 baseline). `npm run check:rules`: pass.
- `check-identical.cjs` (3 fixtures × 6 targets):
  - After UM8 and after UM9: all 18 cases have equal geometry and are pixel-identical apart from content noise. The text-size click timeouts passed on rerun.
  - Final, with UM5: all 18 cases have equal geometry. The only pixel differences are in the Journal companion box, where "Hide completed" became the "All quests ▾" box.
  - Evidence is under `evidence/{um8,um9,final,final-rerun3}`.
- Final bundle `a51bdcb6f79b96a9…`, `evidence/final-bundle`: 18/18 geometry equal. Six populated
  cases differ in pixels only inside the Journal companion box (UM5). The other twelve are
  pixel-identical or noise-equal.
- `check-extra-surfaces.cjs` (`evidence/extra-surfaces.json`), comparing before and after:
  - A live resize 1920 → 1536 → 1920 with the simulation running matches on both builds.
  - Neither build settles back to fresh-load geometry at 1920 after a live resize; that is pre-existing fit-engine behavior.
  - A stored resized placement (inline `areas:none` grid), then Reset this layout, matches on both builds and returns to the fresh grid.
  - The UI preview at 1920 and 1536 matches with no errors.
- `check-box-moves.cjs`: after build 9/9 same look (`evidence/box-moves`).
- `check-strip-boxes.cjs`: pass at three targets (`evidence/strip-boxes`).
- `check-dev-console.cjs`: pass (`evidence/dev-console.json`).

Proof servers: `http.server` PIDs 35203 (19401, before) and 35204 (19402, after) stopped by PID.
`check:rule-behavior`: 36 pass, 0 fail.

Not exercised: import. Persistence did not change: UM placements and storage keys are untouched, and the dev console touches no save. Electron was not run. Layout-config export/import with a moved box was not run.

## Integration, 2026-10-22

Weibao approved a hunk-wise integration into master in the primary checkout, with no push.

- Base: HEAD had moved to `619427c8c`, docs only. My files were unchanged there, so the branch build applies to it as is.
- The commit tree is that HEAD plus only this round's hunks, built in a temporary index with a guarded `update-ref`. Its generated `dist/`, `index.html` and `ui-preview.html` come from this branch's build.
- The "UI optimization base rules" lane had uncommitted edits in the same files: the UR65–UR69 spacing tokens and region lending. It confirmed it was done with them. Its edits stay uncommitted in the working copy, and my hunks were 3-way merged in beside them.
- `ui_tokens.css` had four conflicts. Their spacing tokens are kept, and the hard-coded grid columns and areas are removed.
- The UM5 strip-row padding now uses `round(.15em, 1px) round(.3em, 1px)` to satisfy their new UR65 guard. This is a 1px-scale change from `.15em 4px`.
- The `main.js` architecture baseline is lowered from 10,310 to 10,115. The committed file has 10,114 lines; the working copy has one other-lane line.
- Evidence (171 MB) stays untracked in `evidence/`; only this record and the check scripts are committed.
