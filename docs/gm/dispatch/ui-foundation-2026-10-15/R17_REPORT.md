# R17: layout spec + Step 0 preview, 2026-10-16

Structural round (AR9), technically verified. Weibao's visual review of the preview stays OPEN
(UR16). Nothing committed: Weibao is deciding on committing R15+R16 together.
[Checkpoint](R17_CHECKPOINT.md) · [Round 15 plan](next-parts/round-15-whole-plan.md) GU1–GU8.

## What changed

| Part | Change | Files |
| --- | --- | --- |
| Layout spec (GU1, UIE20 seed) | One data module now holds:<br>• which panel lives in which shell region<br>• the parity shell's default order<br>• the companions per context (idle: Journal and Skills; combat: Skills)<br>• the top-row fit numbers<br>The layout host and the fit engine read it instead of keeping their own ID lists. Moving a panel or adding a companion is now a data change; a test proves it | `src/layout_spec.js` (new); `src/workspace_layout.js` (`parityRegion`, `makeShellLayout` and the companion lists read the spec); `src/shell_composition.js` (re-exports the spec's `topRowHeight`/`companionsFor`; frame and settle time from the spec) |
| Stored layouts (GU6) | Storage keys and panel IDs are unchanged, so stored shell layouts read as before. No mapping or reset was needed | — |
| Step 0 preview (UIE22, UIE24, NX40) | Its own page and bundle, opened at `ui-preview.html`. It runs the real workspace host, layout spec and fit engine with the game's stylesheets. **First real panel:** `createVillageWorkspace`, the place header (with R15's type tags), Around you and the opponent cards, over a hand-made, observer-safe Village fixture (PV7). It also mounts the real Current work panel (`createWorkspaceViews`). The ten panels still drawn by `display.js` / `proto23_shell.js` are dashed, labelled placeholders. Fixture and text size (14/17.5/21) are chosen in the bar | `ui-preview.html`, `src/ui/preview/main.js`, `src/ui/preview/fixtures.js`, `styles/ui_preview.css` (all new) |
| Preview build (PV1, PV2) | Copies `build_nethack_preview.mjs`'s pattern: second bundle, fingerprint, receipt. **Fails if the closure reaches `main.js` or `display.js`.** The bundle is 21 modules and stays out of git; the page is tracked | `scripts/build_ui_preview.mjs` (new), `package.json` (`build:preview`), `.gitignore` (3 lines) |
| Preview safety (PV3, PV4, PV8) | In-memory `localStorage`/`sessionStorage` is installed before any module loads. Import-time timers and storage writes are counted and shown. Text size goes through the game's own `applyCustomizationProfile` and the shell's `--shell-context-size` copy, from the default profile, never stored preferences | `ui-preview.html` (inline guard), `src/ui/preview/main.js` |
| **R17a fix (separate from the structure)** | The top-row fit could ratchet upward: each measure counted You's currently visible secondary-stat rows as fixed content. Under load or extra measures, the frozen R16 build itself flipped between 387px and 427px at 1366×768 21px. Now the visible rows come off the measured content and their declared full height is offered back. The result no longer depends on timing | `src/shell_composition.js` (`elasticParts`) |

| CSS lift (GU3) | R16c's region-height and companion-placement block moved whole from `ui_tokens.css` into its own stylesheet, linked right after it so cascade order is unchanged. Token and control sizing stays in `ui_tokens.css` | `styles/shell_layout.css` (new), `styles/ui_tokens.css` (block removed), `index.html` (one link), `build.js` (one version line, like `ui_tokens.css`'s) |

Not touched: `src/main.js`, `src/display.js`, `src/save_files.js`. No save change.

**Why R17a is in this round.** The first lift attempt changed the layout: the separate stylesheet
shifted load timing enough to trigger the ratchet (427px against R16's 387px). A control build with
the block inlined matched R16 exactly. With the ratchet fixed, the lift is pixel-identical (below).
So the round is two steps, kept apart in the evidence: R17a (fix, with its own listed effect) and
R17 (structure, proven identical against R16+R17a).

## Evidence (fresh loopback origins, synthetic fixtures)

Builds:
- Frozen R16: `~/.codex/candidates/yair-ui-r16-final-2026-10-16`, port 19274.
- R16 + the R17a fix only: `~/.codex/candidates/yair-ui-r16-fixed-2026-10-16`, port 19276.
- R17 (spec, preview and R17a): the shared tree, port 19271.

Each identical-look case renders the fixture on fresh contexts with seeded randomness and a fixed
clock. It compares every region and panel box, then the screenshot pixels. If pixels differ, it
renders the before build up to three more times and accepts only noise the before build shows
inside the same box.

| Check | Result |
| --- | --- |
| **Structure is identical** (`check-r17-identical.cjs`, R16+fix → R17+fix, CSS lift included) | **9/9 pixel-identical**: fresh, populated and combat fixtures at 1366×768 14/21px and 1920×1080 21px. [Evidence](evidence/r17/structural/) |
| R17a's own effect (R16 → R16+fix) | 5/9 identical. 4 cases differ by a shorter top row with the same height going to Inventory: 1366×768 14px **311 → 307px**, 1920×1080 21px **439 → 429px**, fresh and populated alike. 21px at 1366 and every combat case are unchanged. [Evidence](evidence/r17/fix-effect/) |
| R16 against itself (noise) | The fresh fixture varies by itself (an optional "Market courtyard" group). Under load the R16 build's Skills field and top row varied run to run (2,338px), which is the ratchet R17a removes |
| Repeat probe, unseeded | R16+fix and R17 both give 387px every run; R16 gave 387 or 427 depending on load |
| `tests/layout_spec.test.js` (new) | 4/4. Every one of the 43 registered IDs, plus an unknown one, lands in the same region as R16's verbatim `parityRegion`, idle and in combat. Default orders match R16's for the parity and plain shells. The top-row formula equals R16's across 3 text sizes × 4 board sizes × player, elastic and combat cases. A panel move or a new companion works as data alone |
| `check-r17-preview.cjs` (new) | **7/7.** At all three targets the preview boots with no errors, **0 import-time timers, 0 import-time storage writes**, real panels visible, placeholders labelled and no page scroll. **PV8:** at the same text size the real panels match the native shell exactly: region widths, the place header box, every Around you row, the place text block and the calendar line (for example 21px at 1366: header 575×59, rows 424×35/57, text 420×283). **PV3:** a preview session with 4 writes (hide, density, presentation) leaves the game's 5 seeded keys on that origin byte-identical |
| `npm run build`, `npm run build:preview` | Pass; receipt `modules 21, gameCore false`. Final inputs: `dist/bundle.js`, `ui_tokens.css`, `shell_layout.css`, `dist/ui-preview.js` hashes in the session scratchpad |
| `npm run check:arch` | Pass: 8 grandfathered main imports and 298 cycle edges, unchanged. Its line-growth notes on `main.js`/`display.js`/`save_files.js` come from other sessions |
| `npm test` | Final build: 2,077 pass, 4 fail of 2,084. Three are the known unrelated ones (two cheat-awakening, `ui_contract` on `styles/oops_branding.css`); the fourth, `p23-combat-options` "R51 native independent cooldowns…", imports no R17 file and passes 15/15 three times alone (load-sensitive timing under the parallel suite). Earlier in the round: 2,078 pass, the known 3: two cheat-awakening tests and `ui_contract` on `styles/oops_branding.css`. The preview first tripped the contract's foreign-host rule; it now creates its own bar and root, so the flag is gone |
| Inherited, on the final build | `check-r16` 16/16, `check-r16-default` 6/6, `check-r15` 4/4, `check-r14` 4/4, `check-r13` 26/26, `check-r12-ticks`, `check-r12-recipe` 20/20, `check-r12-success`, `check-r11-interactions` 4/4. Under heavy load one run of `check-r11-interactions` failed on a hover/focus race (F3) and `check-r16` hit `r11-lib`'s 120 s browser limit; both pass alone, and `check-r16` now has its own launcher |

## How to open the preview

```bash
npm run build:preview
```

```bash
npm run serve
```

Then open `http://127.0.0.1:8123/ui-preview.html?size=21` (fixture and text size are in the bar).
It never touches the game's saves or layout on that origin (PV3 check above).

## Findings

| Code | Finding | Disposition |
| --- | --- | --- |
| F1 | The R16c top-row fit ratcheted with timing (above) | Fixed as R17a, separate from the structure; the effect is listed |
| F2 | Splitting the shell CSS into its own stylesheet changes load timing; with F1 present it changed the layout | Lift done after R17a; identical 9/9 |
| F3 | `check-r11-interactions`: after its Gear click the pointer can rest over a secondary stat, whose hover preview then beats the focused stat's preview. The check's own pointer placement, not a gameplay change; seen once under load | Tune the check to move the pointer away before the focus step |
| F4 | `r11-lib.cjs` closes the browser after 120 s, so long checks die under load | `check-r16`, `check-r17-*` use their own launcher; a shared resolver is PV6's LATER item |

## Not claimed

Visual acceptance of the preview. Opponent cards in the preview (needs a combat fixture in
`readNativeCombatFocus`'s shape). Workbench integration (UIE22 iframe, Compare) and fixture capture
(UIE23). Registry projections instead of `read()` (GU8: available since the engine merge, swapped per
panel touch). The Local actions placeholder shows rows but not its label. Mobile. Nothing committed.
