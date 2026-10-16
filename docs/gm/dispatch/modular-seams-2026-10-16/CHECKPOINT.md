# Modular seams checkpoint

Requested 2026-10-16 by Weibao: "make a codex run to fix accordingly and create
rules accordingly". Rules: [architecture rules](../../../ARCHITECTURE_RULES.md).
Brief: [BRIEF.md](BRIEF.md).

## Writer and reservation (AR15)

- Writer: one Codex run, `runs/m.log`, PID in `runs/m.pid`.
- Worktree: `/Users/weiwei/.codex/worktrees/modular-seams/yet-another-idle-rpg`,
  branch `codex/modular-seams`.
- Reserved on that branch: `src/main.js`, `src/display.js`, `src/save_files.js`,
  `src/domain_registry.js`, `scripts/check_architecture.mjs`. Other lanes may
  keep editing these on `codex/gameplay-foundations`; this run merges them in at
  each round start. Merging back needs reconciliation with any uncommitted
  continuation work still in the shared checkout.

## Status

| Round | Status | Commit | Gate |
| --- | --- | --- | --- |
| M1 cycle break + check | passed | 9e089696 | build, 1793 pass / 3 TODO, arch, rebuilt before/after route + full save equality |
| M2 registry + two domains | passed | 4498c8e6 | build, 1795 pass / 3 TODO, arch, two-domain rebuilt comparison + old save |
| M3 crafting consumer | passed on resume (B4), 2026-10-16 | see M3 resume below | build, 2045 pass / 3 TODO, arch, native browser journey 1366×768 |
| M4 second case | not started | | separately recorded round; not authorized in this resume |

The live checkpoint is the copy in the worktree; this shared copy records the
dispatch. Fold the worktree copy back when the branch merges.

## M1 checkpoint

See [M1 report](M1_REPORT.md). Core line counts: main 10121 (−139), display 6655
(−9), save_files 256 (unchanged). Original baselines: 10260 / 6664 / 256.
Graph baseline: 8 main imports, 298 cyclic edges. Reservation remains active.
No remaining M1 playable gate; human taste is outside this structural round.
M2 is next. Commit identity is recorded at M2 start or in branch history.

## Reconciliation notes

Only this worktree has been changed. M1 overlaps continuation's main state,
imports, assignment sites and display imports. M2 will also touch save_files.
Preserve continuation's behavior during coordinator merge; do not copy its
uncommitted sources into this branch. No push or upstream merge authorized.

## Rule feedback

AR5's baseline exception is necessary for existing whole-graph cycles. The check
rejects new cycles and main imports while requiring the exemption set to shrink.
The named assessment file is missing from this branch; standing rules are present.

## M2 checkpoint

See [M2 report](M2_REPORT.md). Start-of-round merge: already up to date. Core
counts 10100 / 6655 / 256; net this round −21 / 0 / 0. Baseline remains 8 main
imports and 298 cyclic edges. Existing transaction and writer authority retained.
Both domains exercised on both rebuilds, complete save equality excluding saved_at;
old saves keep both absent slices and inventory unchanged. Reservation active.

M3 target: expanded center crafting home, 1366×768, harvest to useful native
consumable with full persistence. Mobile, UI redesign and broader product modes
stay deferred. docs/UI_RULES.md is absent on this branch. Use explicit dispatch
surface requirements plus existing PANEL_KIT.md and center controller; record
this missing authority as a documentation gap, not permission to invent rules.

## M3 stop checkpoint

See [M3 report](M3_REPORT.md) and [stop evidence](evidence/M3_STOP.json).
Required start merge ae9be1700 brought current branch/rule documentation only.
Browser B1 failed on a detached launcher. After the source fix and rebuild, B2
opened through Other known panels but Gather remained disabled in the paused
fresh-load scenario. Stop rule applied; no further gameplay fixes/retries or M4.
No harvest/craft/use/persistence or old-save crafting journey passed in browser.

Source checks: crafting runtime 4 pass; final UI contract 2 pass. Last full suite
1794 pass, 1 UI-contract failure, 3 TODO; focused source fix does not prove the
full suite. Build passed before final style-to-class edit; latest source remains
unrebuilt. Last arch check passed with the same graph baseline. Every M3 runtime
change is implemented-unverified. GR12 stays open; canonical crafting engine
owner still correctly lists the integration gate as not complete.

Core counts: 10108 / 6655 / 257. M3 added 8 / 0 / 1 lines. Passing M1–M2 net
reductions: main160, display9, save_files0. Final candidate net: main−152,
display−9, save_files+1. M2 breakdown correction: 52 removed / 31 added, net−21.

Reservation released at this stopped checkpoint. No worker or preview server is
needed to keep running. Resume only from the stopped candidate and reports,
merge current foundations at the next round start, rebuild, recover native
readiness/open rendering, then run the complete M3 gate. Human acceptance remains
separate. The kept journey script's later assertions have not been reached.

## Additional rule feedback and reconciliation

AR1: one registration import plus five adapter lines and two generic native-use
hooks in main exceed the literal target. Missing native item-use/transaction
ports are the demonstrated seam gap. Proposed exception only, no rule change.
UI_RULES.md is also missing; PANEL_KIT and dispatch requirements used, with UI
contract test catching styling/host violations. M3's item decoding and active-
effect restoration changes also need reconciliation with later work. The
upstream merge changed PROJECT/USER_VISION; this lane made no authored edits to
those files. No personal saves, shared uncommitted sources, push or merge back.


## Planning update, 2026-10-16: interaction-aware continuation

Weibao asked to update the modular engine plan before continuing. [BRIEF.md](BRIEF.md)
is updated in both dispatch copies: MP2 readiness recovery, MP3 conditional seam
hardening, unchanged M3 crafting gate, then MP4–MP7 a cross-domain M4 proof.
MP8–MP10 are future opportunities with scoped triggers and done checks, not a
mandatory foundation bundle. This is documentation work, not a resumed attempt.
The original brief is retained in [history/PRE_INTERACTION_UPDATE_BRIEF.md](history/PRE_INTERACTION_UPDATE_BRIEF.md).

M1/M2 inherited evidence, M3 STOPPED state and all failures/unrebuilt/open gates
above remain exact. Runtime reservation remains released; no new runtime writer
was launched. The recorded original PID/PGID 502/500 had no matching process in
the bounded planning check. Shared and lane inputs must be recovered again before
runtime edits. Shared current-state checkpoint now mirrors these reported states.
No commits, build/tests/browser, branch merge, push or user-save access in this
planning task. Relevant plan docs live in the shared checkout where missing from
this branch; the updated brief names their paths and requires input receipts.


## Plan-update verification receipt, 2026-10-16

Docs-only checks passed: identical shared/lane briefs, required MP/EI codes,
new/plan links and anchors, unchanged archived original dispatch bytes at edit
time, preserved lane checkpoint history and no conflict markers.
`node scripts/check_rules_index.mjs`: PASS, 9 warnings for existing untracked
linked documents. They remain a docs-availability concern for future worktrees;
this task neither stages them nor claims to resolve their owners. No runtime
tests/build/browser or resumed process. Input identity receipts:

```text
5047bafa5565eaaa244c733a4346fc49efd493609e70c2999cbec7c386ecd3e8  /Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/modular-seams-2026-10-16/BRIEF.md
5047bafa5565eaaa244c733a4346fc49efd493609e70c2999cbec7c386ecd3e8  /Users/weiwei/.codex/worktrees/modular-seams/yet-another-idle-rpg/docs/gm/dispatch/modular-seams-2026-10-16/BRIEF.md
bfc53223873486b15f4925c5c69ba0989e0388b621c24f32f91dae3672990121  /Users/weiwei/.codex/worktrees/modular-seams/yet-another-idle-rpg/docs/gm/dispatch/modular-seams-2026-10-16/M3_REPORT.md
55d33d81b3bd915a45c7d8eb2019102b6e0bfbabde6280aff081a7aec27de060  /Users/weiwei/code/yet-another-idle-rpg/docs/ENGINE_EXPANSION.md
```


## UI engine planning extension, 2026-10-16

The synchronized [brief MP11](BRIEF.md#ui-engine-support-for-the-touched-slice-mp11)
adds UIE1–UIE12 for readiness/open refresh, projection/command consistency,
semantic selection/focus, navigation, receipt feedback, safe inspection, cleanup,
text/layout resilience and shared prototype fixtures. Applicable rules UR/AR/MW
stay authoritative. [Previous brief](history/PRE_UI_ENGINE_UPDATE_BRIEF.md)
is preserved verbatim. This is docs-only, with no new chat/run/mockup or runtime
writer. M3 remains STOPPED and keeps its existing gate. Larger design comparisons
stay with the UI owner rather than becoming an engine prerequisite bundle.

UI planning verification: matching briefs; 13 new/brief links and anchors
resolve; UIE1–UIE12 present; appended text preserved; prior briefs archived exactly.
Source-only inspection, no runtime tests/build/browser. SHA-256 inputs:

```text
cc06cec525598db8c30271a776da914a7e097baeae449a795b361782c7d9eb43  src/panel_kit.js
72dcc0cc4ded2e4d52216a82f06daa85b168a50ce62584f4c419cbab06696d02  src/center_modes.js
e6c6ce9cd19af1aea23aec2d9da4f7c5ad748d056b08413a87dbf34a3145eeae  src/crafting_detail.js
238d13e591298ba96e46f85c55a3646ca9747cde0b87d38d8b23da90f9152ba8  src/simulation_render.js
99b7245c67be00ed8b346196c8210f89446485d8ef7c84c1ce8711c54802b145  prototypes/workbench/build.mjs
```

## M3 resume, 2026-10-16 (Claude session, lane worktree)

Recorded before each retry, per the two-failure rule.

- **Round-start merge.** `git merge codex/gameplay-foundations` (base `a595d4768`). Conflicts resolved:
  `main.js` imports (lane's moved harvest imports kept, base's `village_obtainability` import added),
  `package.json` (both `check:arch` and `check:rules`), `crafting_detail.css` (both blocks), `index.html`
  and `dist/*` (rebuilt). Base added `src/data/locations.js -> main.js` for `readVillageLedgerSentence`;
  moved to the existing `native_view.js` reader port so `check:arch` stays at 8 main imports.
- **B2 diagnosis (UIE13/UIE15, shown by source and regression).** Save ownership resolves after the
  first registry panel render; `main.js` re-rendered about 30 named panels then, but never registry
  panels, and the paused harness advanced no ticks. Gather kept its pre-ownership disabled state.
  Changed input: registry `refresh` hook, batched through `deferSimulationRender`, fired from
  `renderTickPanels`, the ownership publication and restore end; first failing native gate surfaced
  (UIE14); harness waits on read-only `simulationTestHooks.saveStatus()`. Regression
  `tests/crafting_home_refresh.test.js` fails on the stopped source (0/1) and passes on the fix.
- **B3 (browser, rebuilt):** gather, craft, drink, native inventory use, Back, Esc and Save passed.
  Reload failed: "Invalid gathered material reference." Diagnosis (shown, reproduced headlessly with
  `scripts/headless/runner.mjs` gather → save → reload): the native `inventories` restore loop in
  `load()` has no branch for crafting keys. A gathered lot `{id,materialRef,quality}` falls into the
  generic quality path, which rebuilds the key without `materialRef`; a product key would collapse to
  its bare carrier template. M3's runtime tests round-trip only the crafting slice, never native load.
  Changed input for B4: registry `ownsItemKey` hook; `load()` keeps a domain-owned key verbatim after
  resolving it, as the mixture branch already does. Regression: headless gather/craft → save → reload.
- **B4 (browser, rebuilt `v0.6-237dea4e7017`): PASS.** `node scripts/modular_crafting_browser.cjs` on a
  fresh origin at 1366×768: fresh generated life, gather, native material lot, craft, unknown projection,
  drink, native recovery vs no-dose control (hp_to_full 22.1 vs 23), native inventory use, Back and Esc,
  Save, reload, Export download, literal Import, old save with no `crafting` key loads with it absent and
  inventory/money unchanged. Zero page/console errors. Evidence: `evidence/M3_BROWSER.json`,
  `M3-home-materials.png`, `M3-home-observed.png`. GR12's integration gate is met at this level; human
  visual/play acceptance remains separate.

### M3 resume gates (final source, lane working tree before the M3 commit)

| Check | Result |
| --- | --- |
| `npm run build` | pass |
| `npm test` | 2048 tests, 2045 pass, 0 fail, 3 TODO |
| `npm run check:arch` | pass; 8 grandfathered main imports, 298 cyclic edges, no growth |
| `node --test tests/crafting_home_refresh.test.js` | pass; fails (0/1) on the stopped source |
| `node --test tests/crafting_native_reload.test.js` | pass; fails (0/1) with the `load()` line removed |
| `node scripts/modular_crafting_browser.cjs` | B3 failed at reload (diagnosed above); B4 PASS |

An earlier full run right after the merge had one failure, `p23-combat-options` "R51 ... 4:1 speed ratio";
it passed 3/3 in isolation and in the final full run. Recorded as load-sensitive timing, not M3.

### AR1 for the resume

Main +11 / −7 (net +4 lines): `harvestWriteReason`/`harvestBlockReason` replace the two boolean gates
(+3 with a comment), one `ownsItemKey` restore line in `load()`; five existing lines edited (three
`domainRegistry.refresh()` publication sites, the read-only `saveStatus` test hook, the crafting read's
`blocked` field). Display 0, save_files 0. The excess over one registration line is two generic registry
seams that M2's harvest/care domains never needed: publication refresh (UIE13) and domain-owned item keys
on native load. Both are generic; no crafting conditional was added to main.

Lane vs current base `a595d4768`: main 10359 → 10208 (−151), display 6716 → 6707 (−9), save_files
306 → 307 (+1). Versus the original architecture baseline: main −52, display +43, save_files +51; the
growth is base work (UI R13/R14, durable writer) merged in, not this lane.

## Merge readiness on current base (2026-10-16)

Base `codex/gameplay-foundations` at `a595d4768`, merged into the lane as `e2bb80509`.

- **Before:** `node scripts/modular_baseline_build.mjs a595d4768` rebuilt the base source; its bundle
  hash `cc4dc48d3066` equals the base's committed bundle version. `modular_seams_browser.cjs` (M1 route)
  and `PROOF_DOMAINS=1` (M2 route with harvest/meadow care and the missing-slice old save) both passed.
- **After:** lane build `237dea4e7017`, same two routes, fresh contexts, 1366×768, zero errors.
- **Comparison:** all four envelopes (saved, restored, imported, final) equal except
  `availabilities.item["Gathered herb"]` and `["Herbal vial"]`, the M3 carrier templates the
  availability registry now lists. Expected M3 addition, no M1/M2 drift. `compare_modular_saves.cjs`
  is strict and reports this difference; the field-level diff above is the recorded result.
- One lane-side M2-route run in a chained command failed with its output lost; two later runs passed
  with identical envelopes. Not diagnosed; recorded so it is not mistaken for a clean three-of-three.

Ready: M1+M2+M3 as one unit (the lane branch after the M3 commit). Merging M1+M2 without M3 would need a
separate pre-M3 merge that has not been gated on this base; M3 now passes, so no reason to split.
Merge into `codex/gameplay-foundations` is Weibao's decision. Nothing pushed or merged back.

## Reconciliation list for the shared tree (uncommitted shared edits vs this lane)

1. `src/main.js` misc.js import: shared adds `stat_names`; the lane reformatted that import across
   lines (M1). Textual conflict; keep both.
2. `src/main.js` R15 `placeTypes` in the village workspace `read()` plus imports of
   `place_types_projection.js` and `get_location_type_penalty`: no lane overlap beyond the import block.
3. `src/main.js` continuation (`continuation_*` imports, `continuationCanWrite`, publish/observe): it
   reads `ownsSave`, `nativeOccupationReason()` and the occupation flags directly, which the lane left
   intact. Consider `harvestWriteReason()` for its blocked wording later; not required.
4. `src/save_files.js`: shared adds `validateContinuationEnvelope` beside validators the lane moved
   into `domainRegistry.validate`. Keep its position after the registry call.
5. Lane-owned new seams the UI side should reuse rather than duplicate (NX32/NX34): `domainRegistry.refresh()`
   for registered panels, `projection` as the panel view model, `ownsItemKey` for domain item keys.
6. Shared index still shows `ARCHITECTURE_RULES.md` and the modular dispatch files as staged deletions
   with the files on disk (NX17); use explicit pathspecs when committing there.

## Open after this resume

- Human visual/play acceptance of the crafting home. Observed in `M3-home-observed.png`: the panel
  header overlaps the scrolled "Carried materials" heading, and a harness-left inventory tooltip covers
  part of the view. Not a gate failure; for the UI owner's review.
- UIE13 generalization to harvest and meadow-care panels (they still render through their own paths).
- The workspace has no open event, so refresh rides publications rather than the panel opening itself.
  Correct for every gate checked here; an open hook would be a UI-owned file change.
- M4 not started.

## Rule feedback (resume)

AR1's one-line target again met generic host seams (publication refresh, domain item keys on native load).
Suggest AR1 count registry-generic seams separately from per-feature lines. UIE15's read-only probe made
B3 a one-read diagnosis; worth keeping as standard harness setup.
