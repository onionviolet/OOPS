# M3: crafting as first registry consumer

**Status 2026-10-16: PASSED on resume (B4).** See the [checkpoint's M3 resume section](CHECKPOINT.md#m3-resume-2026-10-16-claude-session-lane-worktree)
for diagnosis, changed inputs, regressions, gates and AR1. The stop report below is retained history.

## Original stop (retained)

Stopped under the dispatch's two-failure gate rule. No M3 completion or GR12
closure is claimed. M4 was not started. Do not merge this candidate as playable.
Pre-round M2 commit: `4498c8e6`; required start merge: `ae9be1700`, which brought
upstream rule/index/branch-practice documentation, no runtime source changes.

## Candidate source

The crafting registration owns its optional `crafting` save slice, validation,
migration/load, commands, projection, native-clock rendering and panel mount.
Original Village source data uses existing keyed harvesting, source nodes and
frozen material truth. Exact harvested lots are carried in native inventory.
Batch composition uses craft_resolver and records products in craft_state.
The native item adapter uses resolveProductKey through the existing product-family
registry; shared carrier templates live with native item registration. A dose is
derived from the retained product and persisted in native active_effects, with
restore and envelope validation. A new dose replaces the prior dose. Observer
knowledge is recorded on use; the UI projects no unobserved chemistry.

The new home is declared expanded-center, has its own node and definePanel home,
uses crafting_detail, and is reached from Other known panels → Herbal experiments.
The shared workspace/center controller supplies the bottom Back bar and Esc.
The final source uses existing UI tokens in styles/crafting_detail.css. Desktop
1366×768 is the target; mobile, other world modes and UI redesign remain deferred.
These are implementation descriptions, not verified player behavior.

## Gate failures and stop

B1: The first browser attempt reached the generated fresh life, then failed to
open the home: its Local actions launcher had been removed by the native redraw.
The real source fix removed that foreign-host launcher and uses the existing
Other known panels navigation instead.

B2: The second rebuilt attempt opens the home through that route but cannot
Gather: the button retains the native readiness-disabled reason in the paused
fresh-load scenario. Harvest, craft, use and persistence were therefore not
exercised. The run stops here rather than adding another attempted fix/retry.
The diagnostic opening also displays the native read-only / restore-saving
message. Whether the cause is harness save-authority setup, initial rendering or
other native eligibility is not established. The candidate has no new timer; rendering currently follows
registry ticks/commands. Investigate initialization/open refresh before resuming.

The full `npm test` attempt also found the UI contract rejected inline cssText and
foreign-host insertion. After the launcher correction, source styling moved to
classes and token-based CSS. `node --test tests/ui_contract.test.js` then passed
2/2. There was no further full-suite run after that correction. The last generated
bundle predates this final style-to-class source edit. Rebuild before further
browser work; do not use that artifact as proof of the final source.

## Commands and evidence

- `npm run build`: passed for the candidate before the last style-to-class edit;
  final source rebuild remains open.
- `npm test`: last full result 1798 tests, 1794 pass, 1 fail, 3 TODO. The failure
  was the UI contract above, fixed only at the focused source-test level.
- `npm run check:arch`: passed, 8 grandfathered main imports and 298 cyclic edges.
  No baseline expansion. Final styling change does not change this import graph.
- `node --test tests/domain_registry.test.js tests/craft_engine.test.js tests/save_files.test.js`:
  25 pass before the last UI corrections.
- `node --test tests/crafting_runtime.test.js`: 4 pass. Covers conserved native
  lots, unknown-before-use knowledge, stale quotes, unsupported/dangling references,
  three deterministic roots with JSON reload/depletion, and tampered exposures.
- `node --test tests/ui_contract.test.js`: 2 pass on final source.
- `node scripts/modular_crafting_browser.cjs`: two failed fresh-context attempts,
  as above. The kept script includes the intended useful-recovery control,
  inventory use, Back/Esc, Save/reload/Export/literal Import and old-save checks;
  those later assertions have NOT run successfully.
- [Machine-readable stop](evidence/M3_STOP.json) and
  [blocked opening diagnostic](evidence/M3-blocked-opening.png).
  No successful materials/observed-home screenshot exists.

## AR1 and change surface

Actual additions this round: main **8**, display **0**, save_files **1**.
Main's eight are one import, five lines of narrow native operation registration,
and two generic registry item-use dispatch sites (inventory and existing hotkey).
Save_files adds the registration-module import. Save/create/load/validation/tick
behavior all runs through the registry; there are no crafting conditionals there.

This exceeds the literal one-line main target. Proposed exception: the registry
needed native item-use dispatch and a native transaction/inventory port, both
missing from M2's harvest/care seam. Narrow operation injection necessarily has a
composition-site declaration. This is documented, not accepted as a rule change;
reduce/extract this shared host seam before calling AR1 satisfied if required.
No new import cycles or imports of main were introduced.

Core counts now: main 10108, display 6655, save_files 257. Cumulative net versus
start: −152 / −9 / +1. Passing M1–M2 alone had removed 160 main and 9 display lines.
M2 report's removed/added breakdown is corrected to 52 removed / 31 added; its
net reduction of 21 was correct.

## Reconciliation and open work

Keep shared-checkout continuation behavior when reconciling main's imports,
composition bindings, Save/load/tick locations and generic item-use dispatch;
display import extraction; save_files ordered registry validators. M3 also changes
items decoding and active-effect restoration, which need ordinary merge review.
No shared checkout source or personal saves were touched. No push or merge back.

GR12, useful-output gameplay, effect restoration, old crafting-less save loading,
complete desktop fit/navigation and durable failure rollback remain browser-open.
Only the listed pure-source properties have evidence. Human visual/gameplay
acceptance remains open. All M3 runtime claims are implemented-unverified.

Rule feedback: the referenced UI_RULES.md and modularity assessment are absent
from this branch. Existing PANEL_KIT.md, the UI contract tests and the dispatch
were used without inventing replacement authority. AR1's one-line target needs
to distinguish registration/import/host-seam work; this candidate exposes the
missing native item-use/transaction interface. No standing rule was edited.

Commit hygiene: source/doc diff whitespace checks pass. The generated minified
bundle triggers git diff --check on a generated long line; it was not hand-edited.
