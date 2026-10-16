# R17 checkpoint: structural layout spec + Step 0 preview, 2026-10-16

Owner: the R16 core-ui Claude session, at the coordinator's request ("start R17 … run it exactly as
queued"). Weibao approved this round to follow R16c (Round 15 plan, "Ground-up restructure", GU1–GU8).
Shared checkout `codex/gameplay-foundations`, HEAD `f1e4b9c84` at start (engine merge `ae42e850e`
included). **No commit:** Weibao is deciding whether to commit R15+R16 together.

## One gap (AR9 structural round)

Layout decisions move out of code into one layout spec (UIE20 seed), and a separate preview page
shows real shell panels from a hand-made fixture (UIE24 Step 0). **The game looks identical before
and after** at 1366×768 14/21px and 1920×1080 21px. No behavior change, no save change.

| Part | What moves or appears | Rules |
| --- | --- | --- |
| Spec | `src/layout_spec.js` (new, pure data + resolvers). It holds the five shell regions and which panel IDs live in each (replacing `parityRegion`'s ID lists), the parity default order (replacing `makeShellLayout`'s list), per-context companions (idle: Journal, Skills; combat: Skills) and the top-row fit numbers. `workspace_layout.js` and `shell_composition.js` read it; the measuring host stays the fit engine | GU1, NX29, PX7 (for the IDs it moves), AR9 |
| CSS lift | R16c's region-height and companion-placement block moves whole from `styles/ui_tokens.css` to `styles/shell_layout.css`, linked right after `ui_tokens.css`, so cascade order is unchanged | GU3, NX41 (ui_tokens counts only shrink) |
| Identity | Stored shell layouts keep their storage keys and panel IDs; the spec changes no identity, so no mapping or reset is needed. A test proves the spec reproduces the old region and order tables for every ID | GU6, PX5, UR17 |
| Preview | `ui-preview.html` + `src/ui/preview/` entry, built by `scripts/build_ui_preview.mjs` (copied from `build_nethack_preview.mjs`'s pattern) to `dist/ui-preview.js` (local artifact, gitignored). It mounts the real workspace host, layout spec and composition engine with the real shell CSS. **First real panel:** `createVillageWorkspace` (place header with R15 type tags, Around you, opponent cards) over an observer-safe hand fixture, plus `createWorkspaceViews` (current work). Every `display.js`/`proto23_shell.js` panel is a labelled placeholder | UIE22, UIE24, NX37, NX38, NX40, PV1, PV2 |
| Preview safety | In-memory storage before any import; counts timers and storage writes during import evaluation; the game's keys are byte-identical after a preview session; text sizes 14/17.5/21 through the same tokens, never stored preferences | PV3, PV4, PV8, PV7 |
| Projections | Preview uses `read()` injection over fixtures. Registry projections are available since the engine merge, but swapping is a per-panel touch (GU8) | GU8 |

- **GU5 (proposal, not applied):** classic stays frozen; nothing here adds to classic.
- **Deferred:** context compositions beyond idle/combat, workbench (`prototypes/workbench/`)
  integration of the preview (UIE22 iframe) and fixture capture (UIE23), converting `display.js` panels.
- **Not touched:** `src/main.js`, `src/display.js`, `src/save_files.js`, `build.js`.

## Checks chosen before editing (AD36)

- **Failure scenario:** a moved ID lands in a different region, or the CSS lift changes cascade
  order, so a panel moves by a pixel. Caught by `check-r17-identical.cjs` (new): geometry of every
  region and panel plus screenshot pixels, before vs after, three fixtures × three targets, fresh
  origins, seeded randomness. Noise floor measured on the frozen R16 build: the fresh-game fixture
  varies by itself (an optional "Market courtyard" group); such a case must still match geometry
  exactly and is reported as noisy.
- Unit: `tests/layout_spec.test.js` (old tables reproduced for every ID), existing
  `shell_composition` and `workspace_*` tests unchanged.
- `check-r17-preview.cjs` (new): preview boots with no errors, zero import-time timers and storage
  writes (or each listed), game keys unchanged after a preview session, the village panel renders at
  14/21px, and its place header and Around you geometry match the native shell's at 21px (PV8).
- `npm run build`, `npm test`, `npm run check:arch` (baseline only shrinks), R16 checks and the
  inherited sweep (r11–r16).

## Before evidence

Frozen R16 build: `~/.codex/candidates/yair-ui-r16-final-2026-10-16`, port 19274.
Noise run: `evidence/r17/noise/`.

## Reservation

`src/layout_spec.js` (new), `src/workspace_layout.js`, `src/shell_composition.js`,
`styles/ui_tokens.css` (removing the R16c block), `styles/shell_layout.css` (new), `index.html`
(one stylesheet link; other sessions' edits left as they are), `ui-preview.html` (new),
`src/ui/preview/` (new), `scripts/build_ui_preview.mjs` (new), `package.json` (one script line),
`.gitignore` (preview bundle lines), tests and dispatch-folder checks.

## Technical close (amended scope)

[R17 report](R17_REPORT.md). One addition to the plan above: **R17a**, a fix to the R16c top-row
fit ratchet in `src/shell_composition.js`, kept as a separate step with its own listed effect. The
first CSS lift attempt changed the layout through that ratchet; with R17a in place, the lift is
pixel-identical (R16+R17a vs R17+R17a, 9/9). `build.js` gained one version line for the new
stylesheet (reservation amended).

Files changed: `src/layout_spec.js`, `src/ui/preview/main.js`, `src/ui/preview/fixtures.js`,
`ui-preview.html`, `styles/ui_preview.css`, `styles/shell_layout.css`, `scripts/build_ui_preview.mjs`,
`tests/layout_spec.test.js` (new); `src/workspace_layout.js`, `src/shell_composition.js`,
`styles/ui_tokens.css` (block moved out), `index.html` (one link), `build.js` (one line),
`package.json` (one script), `.gitignore`; dispatch checks `check-r17-identical.cjs`,
`check-r17-preview.cjs` (new), `check-r16.cjs` (own launcher); build outputs; `.claude/launch.json`.
Reservation released. No commit.
