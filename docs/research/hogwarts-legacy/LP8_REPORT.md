# LP8 earned drying tracker

The player sees an earned drying-work counter after meeting Eda. Every two completed drying batches allow collection of one real Tree sap from her finite stock. The lifetime count stays earned after collection; more rewards require more work and available stock. This is an authorized, reversible PROPOSAL, not an accepted balance decision.

Try it: Village → meet the ordinary craftsman → Notes, practice & people → Tools, practice & local lives → Fitting tools & materials → Meet Eda. Carry one Rough wood log, buy or borrow her sharp fitting knife, then choose **Cut one actual log into two wet staves**. Complete **Dry in the ordinary sheltered rack** twice, then **Collect earned drying reward**. The sap can restore the dulled knife through **Restore the knife edge**, or supply existing survey-kit work. Inspection is not work.

D1: Target viewport is 1366 × 768 desktop, under the standing laptop-first direction. Mobile optimization, new worlds, prestige, total completion checklists and S1 disclosure are deferred. Authority is the user's 2026-10-14 LP2–LP8 dispatch and the LP8 row of [IMPLEMENTATION_PACKETS](IMPLEMENTATION_PACKETS.md), read alongside the live PROJECT and USER_VISION owners. `LP_COMMON.md` is absent in this checkout; the supplied common rules were followed.

Compatibility decision: reuse existing optional simulation command completion receipts, native item transfers and the existing durable save envelope. No new save namespace, schema version, stock grant or restore mutation. Old completed drying work remains earned work. The reward collection receipt is absent until collection. Unintroduced activities disclose no tracker.

## Changes

F1: `src/earned_drying_tracker.js` projects only the existing `dry_shade`, `dry_braced` and `dry_shelf` completion receipts. The lifetime total advances on completed drying work. Inspection, accepting a pending job, cancellation, collection and restore leave that total alone.

F2: The normal fitting command host offers repeatable collection after each pair of completed batches. The existing atomic transfer moves one Tree sap from Eda to the player. No new stock is minted. An empty owner stock blocks collection and preserves earned work. The ordinary completion count for collection prevents duplicate claims.

F3: The existing fitting section shows the tracker at its top after Eda introduces the activity. No unintroduced goal list or whole-world completion claim is added. S1 remains untouched.

## Files

| Path | Change |
|---|---|
| `src/earned_drying_tracker.js` | Pure tracker and reward descriptor |
| `src/feature_expansion_objects.js` | Register the reward in the existing fitting commands |
| `src/feature_expansion_objects_host.js` | Eligibility projection, load validation and tracker projection |
| `src/feature_expansion_wave_host.js` | Display the tracker in the fitting introduction |
| `tests/earned_drying_tracker.test.js` | Eight focused source checks |
| `dist/bundle.js`, `dist/bundle.js.map`, `index.html` | Rebuilt served candidate |
| `lp8-evidence/` | Browser harness, controlled prerequisite builder, screenshots and result records |

## Checks

| Check | Result |
|---|---|
| `npm run build` | PASS, including Ink compiler check |
| `node --test tests/earned_drying_tracker.test.js` | 8 passed, 0 failed |
| Focused plus `simulation_optional_enrollment` and `fieldcraft_saved_jobs` | 14 passed, 0 failed |
| `npm test` | 1,402 tests: 1,399 passed, 0 failed, 3 existing TODOs; 216,859 ms |
| Fresh-origin Chrome desktop, 1366 × 768 | 11 acceptance groups passed; 0 page errors, [results.json](lp8-evidence/results.json) |
| Native Save/reload/Export/literal Import | PASS for pending work and collected reward, including two repeated literal imports with no extra count, material or reward |
| Shipped worker timers, real wall time | PASS: restored pending job at minute 15 completes at minute 21, count 1 → 2, no reward claim, no page errors |
| Rebuilt and served bundle | Exact SHA-256 match in [build.json](lp8-evidence/build.json) |

The three full-suite TODOs are the existing determinism inventory for native combat RNG, local-life search/contact RNG, and encounter/loot/craft/market/gather RNG. No unrelated fixes were made.

F4: Browser prerequisites are controlled. [make-fixture.mjs](lp8-evidence/make-fixture.mjs) uses the existing enrollment functions to introduce the body/workshop and adds three logs to a disposable, freshly created native save, validated by the actual save-envelope validator. Zero drying receipts and zero player sap are seeded. Cutting, inspection, job acceptance, cancellation, completion, collection and later sap use are actual UI actions through the native publisher. This proves the slice with stated prerequisites, not natural acquisition of those prerequisites from a fresh character. The separate natural introductory journey was stopped before workshop access and supplies no LP8 acceptance evidence. No user saves were read or changed.

F5: Tooling uses the prescribed Playwright package and installed Chrome headlessly because the default bundled browser is absent. The deterministic harness substitutes standard browser timers for the HackTimer worker shim and controls elapsed browser time. Earlier attempts mixed worker time with virtual time across reloads and could not prove resumed completion. The corrected harness is separate from [worker-smoke.cjs](lp8-evidence/worker-smoke.cjs), which restores the actual pending export with the shipped worker unchanged and observes completion under natural wall time. [worker-results.json](lp8-evidence/worker-results.json) records the positive result. Production timer code is unchanged.

| Browser evidence | Observed result |
|---|---|
| [01-unseen](lp8-evidence/01-unseen.png), B1 | No tracker or reward action before introduction |
| [02-discovered-zero](lp8-evidence/02-discovered-zero.png), B2–B4 | Repeated panel inspection and a real joint inspection leave zero; cutting spends one log and six coins for the purchased knife; pending/cancelled drying leaves zero and refunds the reserved wet stave |
| [03-first-earned](lp8-evidence/03-first-earned.png), B5 | One drying completion: 1 count, 1 wet stave remaining, 1 sound stave produced, reward unavailable |
| B6 | Pending second job survives Save, reload, Export and literal file Import at count 1 with its one wet stave still reserved |
| [04-reward-earned](lp8-evidence/04-reward-earned.png), B7 | Second paid completion reaches count 2 and two actual sound staves |
| [05-collected](lp8-evidence/05-collected.png), B8 | Count stays 2, claims become 1, player sap 0 → 1 and Eda sap 2 → 1; further collection blocked |
| [06-reloaded-imported](lp8-evidence/06-reloaded-imported.png), B9 | Save/reload and two literal-file imports keep count 2, claim 1 and both owners' exact sap stock |
| B10 | The earned sap is consumed by actual edge repair: one dull knife becomes one sharp knife, count stays 2 |
| B11 | Original disposable native save loads without a collection receipt or stock changes |

The tracker was visually checked at the top of the existing fitting section at 1366 × 768. No global checklist or world-completion total was added. [browser.cjs](lp8-evidence/browser.cjs) records the exact test route. Raw disposable save payloads and exports remain outside Git in the temporary test directory.

## Merge and remaining gate

R1: The three fitting integration files may overlap LP1, LP2, LP3 or LP7. The new module and test are isolated. Preserve sibling command definitions, body/tool checks and lesson changes when resolving these few additions.

R2: Generated bundle, map and index fingerprints will conflict with sibling builds. Integrate source, then rebuild the combined branch. This branch is based on the dispatched `codex/gameplay-foundations` snapshot; its gate evidence does not prove the later merged bundle.

Implemented-unverified: the braced and sealed alternatives share the same source receipt projection but were not played in this browser path. The unchanged natural workshop-acquisition route was not completed end to end. Mobile is deferred. All LP8 acceptance checks pass for the stated ordinary-rack path and controlled prerequisites. The one remaining acceptance gate is Weibao's play and taste. No push, merge, installation or director acceptance is claimed.
