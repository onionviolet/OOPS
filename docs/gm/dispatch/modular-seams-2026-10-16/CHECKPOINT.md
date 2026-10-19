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
| M4 second case | implemented 2026-10-19 (lamplight, PF52); see [M4 round](#m4-round-lamplight-2026-10-19) | 914e8d579, fast-forwarded into codex/gameplay-foundations 2026-10-19 on Weibao's yes, not pushed | build, 2243/2243 npm test, arch, rules, headless journey, 1920×1080 smoke; human play OPEN |

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

## Merged into codex/gameplay-foundations, 2026-10-16

Weibao approved: "Yes, merge codex/modular-seams into codex/gameplay-foundations, reconciling the shared
tree's uncommitted main.js/save_files.js edits per the lane checkpoint list. Do not push."

- Fast-forward `a595d4768` → `163d9a818` (lane contained the base), guarded `update-ref` with the old
  value; no stash, reset or force. Not pushed.
- Shared uncommitted edits kept in the working tree via three-way merge against `a595d4768`:
  `main.js`, `save_files.js`, `character_creation.js` merged clean (continuation, R15 `placeTypes`,
  `stat_names` all kept; `validateContinuationEnvelope` stays before `domainRegistry.validate`);
  `package.json` keeps `check:arch`, `check:rules` and the shared `check:rule-behavior`. Others'
  staged entries untouched except the two stray staged deletions of this BRIEF/CHECKPOINT, which the
  merge resolves. The shared dispatch copy of this checkpoint is preserved verbatim as
  [history/PRE_MERGE_SHARED_CHECKPOINT.md](history/PRE_MERGE_SHARED_CHECKPOINT.md); this file is now
  the folded lane copy.
- Committed tree `163d9a818` equals the lane tree that passed every gate above.
- Shared working tree (committed + other sessions' WIP), rebuilt: `check:arch` pass (8 main imports,
  298 cyclic edges); focused crafting/registry/save/architecture tests pass; `npm test` 2071 tests,
  2065 pass, 3 fail, 3 TODO. All three failures reproduce in a scratch replica of the pre-merge shared
  state (`a595d4768` plus the same WIP) or come from an untracked WIP file: `cheat_awakening` x2
  (fail pre-merge too), `ui_contract` on untracked `styles/oops_branding.css`. None from the merge.
- M3 browser journey on the shared WIP build could not open the crafting home: the "Other known
  panels" select is not reachable under the in-progress shell restructure. Seam item for the UI
  owner (NX33): Herbal experiments needs a discoverable route in the new shell, and the M3 harness's
  `open()` follows whatever route that is.

### Post-merge follow-up, 2026-10-16

- The UI session fixed the NX33 route: "More panels…" is visible in the shell again. The M3 harness's
  inventory-use step now presses the inline `[use]` when it is visible and otherwise selects the row
  and presses Use in `#proto23_item_detail`, the shell route since R14. With that change,
  `scripts/modular_crafting_browser.cjs` passes in full on the shared build, including the
  uncommitted R16 shell (evidence went to scratch, not to this folder).
- `[data-craft-*]` duplicates: the herbal home is a second legitimate `crafting_detail` instance.
  Checks should scope to their view (`#crafting_window ...`), as the UI session did for
  `check-r14.cjs`. The R12 checks (`check-r12-recipe/success/ticks.cjs`) still use unscoped selectors
  and are UI-owned.

## Plan reconciliation receipt, 2026-10-18

The shared BRIEF opening now follows the later M3 B4/merge/post-merge entries
above, retaining the original stops as history. This folded shared checkpoint
owns that recorded evidence; the original "live checkpoint is the copy in the
worktree" sentence describes its pre-merge arrangement. Fresh runtime input
recovery is still required. MP13 carries the applicable G26–G30 cases and the
current compatibility/viewport overrides. No runtime worker, retry, M4, test,
build, merge, commit or push was launched by this docs-only reconciliation.

## M4 round: lamplight, 2026-10-19

Selected by a Claude session under Weibao's 2026-10-19 request "begin implementing
features, and address issues; tests and more that take a long time can be deferred".
Why this slice: QR1's remaining gates are human acceptance and extra viewport sweeps;
QR2's native consumer is RS26, which waits on Weibao's play gate; M4 is the queue's one
selected-separately item whose next gate is implementation. Rules: AR1–AR16, AD36, AD38,
SR5, SR6, SR9, SR11, SR13, SR22–SR24, MR4 (quote reads only), UR touched only through
native inventory use and log lines. Inputs recovered from this branch at `89e5a0618`
(the M3 crafting/tools/registry seams as merged); no stale worktree copy is used.

**MP4 candidate.** PF52 default: a real light changes a reading condition and lets
observed evidence guide an actual route. Traced means: the native game already has
`get_current_light_level()` (night 40, dark stages 40/20/0), a hero light-bonus reader
that only living gear feeds, and no lamp item. The Cave depths (dark 2) fourth clear
already reveals the Suspicious wall challenge that opens Hidden tunnel. No new power or
world is needed, so PF52 stands (PF53 not needed).

**MP5 seam (proposal values).**
- Adapter and state owner: new `src/lamplight_domain.js`, registered through the domain
  registry, slice `lamplight` `{schema:1, lit, oil, noticed}`; ports come through the
  existing tools-domain configuration (main.js may not grow).
- Actual method: native items Oil lamp (usable, manual use only) and Lamp oil, sold by the
  village trader. Use lights or puts out the lamp; lighting spends one flask when the lamp
  is dry. A flask burns 240 game minutes; put-out oil stays in the lamp.
- Physical rule: a lit lamp held in the pack adds 40 light, capped at 100.
- Readers: (1) the hero light reader, so dark/night combat uses it as living gear already
  does; (2) everyday reading pace, which rises with the lamp's real gain over ambient
  light (×1.2 at night, ×1 in daylight; old reading is unchanged without a lamp);
  (3) exploration: in Cave depths, 20 minutes at 50+ light notices loose mortar and
  reveals the existing Suspicious wall route early. Comparison means: the living-gear aura
  (+25 at night) reaches 45 there, so it shows nothing; the lamp reaches 60.
- Quote/commit: `useItem` quote reads only; execute revalidates, spends inside the native
  transaction and persists once (tools-domain pattern). Projection: `lamplight` view for
  tests. Save: the slice plus native location unlocks; old saves load with an unlit, empty
  lamp and nothing noticed.

**MP6 checks chosen before editing.** Existing: `tests/domain_registry*.test.js`, tools and
crafting domain tests, `tests/headless/runner.test.js`, check:arch, check:rules, build.
Failure scenario: a failed save write while lighting must leave the flask in the pack and
the lamp unlit (failed-write conservation). Also: stale quote refusal, support loss (lamp
leaves the pack while lit: light and notice progress stop), insufficient light learns
nothing, old save without the slice, Save/reload/Export/Import of a lit lamp and a noticed
place. Deferred per Weibao's 2026-10-19 deferral rule: real-browser Playwright journey,
1366×768 and multi-viewport sweeps, human play acceptance.

### M4 results, 2026-10-19

**Changed.** `src/lamplight_domain.js` (new registry domain, slice `lamplight`);
`src/models/hero.js` (named light sources plus `nativeLightBonus()`, the one authority for
carried light); `src/reveal_chain.js` (reading light reader); `src/items.js` (Oil lamp,
Lamp oil, reading pace × light factor); `src/data/inventory_templates.js` (both appended to
the village trader's Basic stock); `src/display.js` (one line: manual-use items get no
auto-use); `src/tools_domain.js` (forwards its ports to the lamp); `src/main.js` (three
same-line edits, growth 0: two ports, and registry ticks on the two travel branches).

**Defects found while building (fixed).**
- E1, real: once the p23 market or freight owner exists (any village trade), travel advanced
  the clock through `persistExpansion` without `domainRegistry.tick`, so registry domains
  missed walking time. Both travel branches now tick the minutes they consume.
- E2, real UI: the center-mode back bar left trade through the module `exit_trade`, skipping
  the page's `exitTrade`, so `in_trade` stayed true, [use] buttons stayed hidden and the next
  inventory click threw "No npc with id null". The back bar now calls `exitTrade`.
- E3, harness: the headless DOM kept attributes, listeners and tree links as own data
  properties (a `Map` among them), so any combat transaction snapshot failed with
  "Unsupported native craft owner" and headless combat always paused. Those fields are now
  prototype accessors, as in a real DOM. Real browsers were not affected.

**Checks (input: this branch, rebuilt).** `tests/lamplight_domain.test.js` 7/7 (old save,
spend-and-persist, refusals, stale quote, failed-write conservation, burn-out, support loss,
night/day reading pace, Cave depths reveal versus the 45-light gear aura, once only, slice
round trip, six malformed slices). `tests/headless/lamplight_journey.test.js` 1/1: fresh
save with no slice, buy both items at the market, light through the shell Use action,
Save/reload exact, walk to Cave depths (oil burns for the walk), the wall is revealed with
no clear, Export/Import exact. `tests/headless/*.test.js` 6/6. `npm test` 2243/2243.
`check:arch` growth 0, 6 main imports, 226 cyclic edges; `check:rules` PASS; build OK.
Browser smoke at 1920×1080 on a fresh origin (port 19542, empty storage, seeded with the
journey's fixture save): market purchase, no auto-use on the lamp, Back restores [use]
display, lighting logs "about 4h 0m of light", the Cave depths line appears, Suspicious
wall is listed from Nearby cave, page reload restores the lit lamp and the noticed place,
putting it out keeps the oil. Only console errors: `private_packs/manifest.json` 404.
Pointer clicks were unreliable in the emulated pane, so the smoke dispatched DOM clicks on
the exact elements.

**MP7 measurement.** One new adapter; bespoke core edits are the light-source seam in
`hero.js`, the reading reader and three `items.js` call sites, one display line and three
same-line main.js edits. Eligibility is not duplicated: combat, reading and inspection all
read `nativeLightBonus()`. Most setup/debug time went to E1–E3, not to the feature. Seam
notes (proposals): AR1's zero-growth ratchet forced the lamp to borrow the tools domain's
port bag; a shared native-ports bag for registry domains would remove that coupling.
Location unlock truth is `availabilities.location`, not `locations[...].is_unlocked`.

**Acceptance backlog (implemented-unverified, deferred per the 2026-10-19 deferral rule).**
- A1: Weibao plays the lamp: price (250/25 base), 240-minute flask, ×1.2 night reading and
  the early wall reveal are proposal dials.
- A2: real-browser Playwright journey with pointer input; 1366×768 floor and the other
  UI_RULES viewports.
- A3: lamp state disclosure beyond log lines and the item text (G8-style inspection of oil
  left and lit state).
- A4: `scripts/village_browser.cjs` still clicks `.end_dialogue_button`, which center mode
  hides; update it when that Playwright route next runs.


## Domain rule application, 2026-10-19

Weibao accepted the domain rulebooks on 2026-10-19 "as long as core rules are
followed"; codes are from [DOMAIN_RULES](../../../DOMAIN_RULES.md) and act as
default dials under the core rules. Checked against M3 and M4 as merged; no runtime
change in this note.

**M3 crafting consumer (herbal home).**
- Meets: BHR20 (the drinkable remedy is made through the crafting envelope with
  maker and provenance, not a separate medicine engine); BHR21/MR1 (a dose drunk
  under an unknown projection still works by its actual effect: the browser
  journey measured native recovery against a no-dose control); BHR5 (the dose
  changes HP recovery only and claims nothing about injury or illness); SLR2/MR21
  (practice changes control, not what the herb is).
- Departs, minor: BHR25 asks action text to name the specific outcome (restores
  HP, eases pain) with stock, time and cost. The drink action is named by the item
  and its known projection; when the projection is unknown the player cannot see
  "restores HP" until observed, which is correct for knowledge (AD6) but the
  known case should name the outcome. Owner: crafting projection text; not built.
- BHR23 one authority for combined effects: meets in its narrow form, since a
  new dose replaces the previous preparation (item text in
  `src/crafting_native_items.js`), so one owner holds it. Interaction tags
  between different remedy kinds stay open until a second kind exists.

**M4 lamplight.**
- Meets: CBR17/CBR18 (the lamp feeds the one light authority
  `nativeLightBonus()`, which combat, reading and inspection all read; a light
  works by how light works, no tool or weapon list); CBR26 (light in idle dark
  combat is paid from real oil stock and stops when it burns out); ECR2 (bought
  from the local trader through the native trade path); ECR16 (lighting spends
  oil, not money; the purchase uses the existing staged native trade, adding no
  direct money write); SLR3/SLR4 (reading pace rises only from the lamp's real
  gain over ambient light; the gain's cause is the reading itself).
- Departs: ECR6 says prices follow a per-world reference basket. Village has no
  basket yet (ECL1 unbuilt), so the 250/25 prices are proposal dials set by hand.
  Already listed as acceptance item A1; reconcile when ECL1 lands.
- Inherited, not M4's: ECR10 (selling never destroys silently). A lamp sold back
  to the trader is deleted at the next trader refresh (ECX3). Not a new departure,
  but the lamp is now one more durable good it applies to.
- No BHR rule applies; eyesight is not modelled as a body function here (BHR27
  would apply if a world made darkness block reading outright).
