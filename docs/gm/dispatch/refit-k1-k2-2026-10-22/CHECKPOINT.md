# Re-fit K1 + K2 checkpoint (2026-10-22)

Owner: Claude session started from the decomp re-fit session. Source rows: K1 and K2 in
[DECOMP_REFIT_2026-10-22](../../../research/DECOMP_REFIT_2026-10-22.md). Status:
implemented, gates passing, browser-verified at desktop targets; committed on
Weibao's instruction (relayed 2026-10-22: "close their open verification gaps, then commit only their own paths with the guarded procedure. No push.").

## Rules applied

- Runtime: AR1 (no `main.js` change), AR3 (one authority per fact), AR6 (namespaced
  slice plus compatibility decision below), AR16 (player journey crosses the module).
- Making: MR1 (player text names products only through `mixturePresentation`, never
  the identity string that encodes hidden fractions), MR30/MR33 (old saves load
  unchanged; the new field stays absent until first completion), AD38.
- UI: UR65–UR68 (no new literal spacing or `cssText`; the cards reuse the tokenized
  `#mixture_feedback` grid), desktop-first viewports from UI_RULES line 76.
- Verification: AD36.

## Target and deferred scope

Target viewports 1920×1080, 1800×1040 and 1536×864 at 14 px and 21 px text. Mobile is
deferred. Visible outcome: the Village mixing counter shows a completion receipt with
consumed inputs beside current work, and the current selection quoted into two real
products side by side with carried, held, blocked and free counts.

## What changed

| Path | Change |
|---|---|
| `src/mixture_state.js` | Optional `lastCompletion` receipt on the mixture owner, validated: product must exist, `consumed` must equal that product's retained inputs, sequence and time bounded. |
| `src/mixture_native.js` | Writes the receipt on `mix` and on timed-batch `advance` only (from the completed batch's `held`, never the next reservation). Outcomes: single, next reserved, queue finished, repeat stopped (with reason). New `blockedIngredients` asks the native disposition owner (`assertNativeItemDisposition`) per ingredient key; a refused key is blocked whole, exactly as crafting detail's `canConsume` treats it. The admission token includes it, and reservation refuses a blocked key ("Held elsewhere"). |
| `src/mixture_feedback.js` | "Last result" projects the receipt: product name, game minutes ago, consumed inputs, one vial made, and what happened to the queue. Free counts exclude keys the disposition owner blocks. The old acquisition-only fallback is unchanged for saves without a receipt. |
| `src/mixture_destinations.js` (new) | Pure projection: one stock quoted for steep and boil, each with its own native token, per-ingredient carried/held/blocked/free and vials the free stock supports. |
| `src/mixture_ui.js` | Two destination cards as further cells of the existing feedback grid; each commits with its own token. The held/blocked/free line sits in "Holds and cost". |
| `src/feature_expansion_work_plan.js` | `workPlanView().lastResult`: latest settled step since the itinerary began, read from the common simulation log (completed, stopped or cancelled), respecting log audience. No cursor field and no schema change. |
| `src/audited_kit_reserve_host.js`, `src/crush_social_views.js`, `src/factorio_retort_host.js`, `src/feature_expansion_society_host.js`, `src/feature_expansion_wave_host.js` | Each existing itinerary status line appends `lastResult.text`. One-expression edits. |
| `tests/refit_k1_k2.test.js` (new), `tests/fa09_routines.test.js` (one test added) | Regressions listed below. |
| `scripts/playtest/refit-k1-k2.mjs`, `scripts/playtest/refit-k1-work-plan.mjs` (new) | Headless fresh-origin proofs at six desktop cases (mixing counter plus persistence; work-plan receipt). |

## Decisions recorded here

- **K1 needed persisted state.** No transaction owner kept consumed inputs after a
  completion: acquisitions are first-appearance receipts, and the job is cleared.
  Compatibility decision (AR6, MR33): missing `lastCompletion` is inert and shows the
  old "unavailable" text. Older builds ignore the extra field because
  `validateMixtureState` has no key whitelist. No migration is needed.
- **Work-plan receipt is a projection.** Adding a cursor field would change the
  `keysOnly` save contract. The simulation log already records each settled job, so the view
  reads it. Limits: the log keeps 100 entries, so an evicted entry shows "none
  recorded"; consumption is not claimed because the job record is deleted on
  completion.
- **K2 destinations are steep and boil of the same selection.** Both are real, distinct
  products with existing stale-token refusal on the same inventory keys, so no new
  commit path was needed. The hold owners are the mixing vessel (`job.held`) and
  the native disposition owner (borrowed custody, bound specimens, later rules), read
  through the same function crafting detail uses, so both screens agree (AR3). `craft_batch_goal.js` is not used as a reservation.
  Cross-system destinations (sell at a shop, a native item recipe) are not built here.
- **Gap fixed in passing:** the mixing counter could previously spend a borrowed
  ingredient key. It now refuses: "River bellleaf is borrowed or committed elsewhere."

## Verification (input: working tree on HEAD `619427c8c` plus this task's paths)

| Check | Result |
|---|---|
| `node --test tests/refit_k1_k2.test.js` | 6/6 pass: mix receipt and JSON reload; batch receipt with next batch reserved; stopped repeat with reason, cancel and buy keep the receipt; tampered receipt refused, missing receipt inert; two quotes where committing one makes the other refuse "quote changed" with stock unchanged; on a real expansion state a custody record blocks its whole key (agreeing with `assertNativeItemDisposition`), leaves other keys free, stales the old quote and refuses the mix. |
| `node --test tests/fa09_routines.test.js` | 18/18 pass, including the new K1 work-plan test (none recorded, completed after reload, cancelled). |
| `node --test tests/mixture_*.test.js tests/ui_contract.test.js` | pass (an earlier full run caught a UR65–UR68 `cssText` violation; fixed by reusing the tokenized grid). |
| Final `npm run build && npm test`, `npm run check:arch`, `npm run check:rules` | build 0; **2561 pass, 0 fail**; arch PASS (no growth, no new cycle); rules PASS (4 warnings about other sessions' untracked linked docs). HEAD `619427c8c` plus uncommitted working tree; bundle sha256 prefix `8f03f44ecc056e43`. The bundle includes other sessions' uncommitted source. |
| `node scripts/playtest/refit-k1-work-plan.mjs . <out>` after `npm run build` | `{"ok":true,"cases":6}`, zero page or console errors. The fixture drives the real audited-kit-reserve route in node on top of the perf fixture (as `fa09_routines` does) to one completed batch, then loads as a generated save on six fresh origins (1920×1080, 1800×1040, 1536×864 at 14 and 21 px). The player route is Notes, practice & people → Here → Tools, practice & local lives → Finite survey-kit reserve. It shows "1/3 accepted batches used; 2 remain … Last step result: Bind two sound staves with set resin · two survey kits + 3 min completed. 0 game min ago." with no horizontal scroll. Fixture facts are not natural-acquisition evidence. Evidence: [work-plan-result.json](proof/work-plan-result.json), [1536/21](proof/work-plan-1536-21.png). |
| `node scripts/playtest/refit-k1-k2.mjs . <out>` after `npm run build` | `{"ok":true,"cases":6}`, zero page or console errors. Six fresh origins: 1920×1080, 1800×1040 and 1536×864, each at 14 and 21 px. Each case checks that the two cards sit side by side, there is no horizontal scroll, the counts are right, steep commits, the retained old boil button refuses as stale without spending, the receipt shows the consumed inputs, and the boil quote follows the new stock. After that, at 1920×1080: save, reload, export and import keep the identical `lastCompletion`. Then drink, save the method and queue 2; one timed batch completes, and the receipt reads "Next queued batch reserved" beside the Work card, with the vessel holding 1 of each. It persists as batch / next reserved. Evidence: [result.json](proof/result.json), [receipt 1536/21](proof/receipt-1536-21.png), [compare 1800/21](proof/compare-1800-21.png), [batch receipt 1920/21](proof/batch-receipt-1920-21.png). |

## Gaps and open items

- At 21 px the mixing feedback grid keeps its existing small type role. That predates this task.
- The browser proof found two defects, both fixed: the absolute calendar minute in receipt text (now "N game min ago"), and a disabled card reason duplicated by the shell's title rendering.
- After reload at 1536×864/21, the shell's stacked layout covered the mixing launch button. Another session is changing the shell, so the persistence phase runs at the 1920 target and this is not claimed. The six viewport cases ran before any reload.
- Dossier coverage: steep/boil closes RF5 "one stock, two outcomes" and Taiwu "one herb, two products". Still open: PO2/Potionomics "two destinations for one batch" (a sell destination) and Stardew's "alternative destination for one chain good".
- Cross-system K2 destinations (shop sale, native recipe) are a possible next slice. They are not started.
