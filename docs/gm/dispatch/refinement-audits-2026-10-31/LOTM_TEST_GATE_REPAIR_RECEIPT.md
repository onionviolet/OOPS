# LOTM five-failure repair

2026-11-01. **Five-failure gate repaired, agent-verified, not human-reviewed (AD36/AD43).** Weibao authorized investigation and correction of the five failures before the next LOTM slice, distinguishing stale tests from bugs, conserving budget and saving volume/backward-design ideas. Applies AD32/AD36/AD43/AD44/AD45, AR3/AR7/AR8/AR9/AR10, existing UI/observer rules. No next story slice, new source reading, workers, paid resources, install, commit or push.

Primary shared checkout, preserve existing dirty work. This task owns targeted test corrections in cast-card integration, cast journeys, local clock and observer tests; the UI observer/capability declaration, existing perspective-control metadata and their focused regressions; this receipt and campaign advice. Existing staged CR2 patch remains historical. Do not force it into current runtime or weaken the observer ratchet.

## Diagnosis and selected correction

| Failure | Evidence / classification | Correction |
| --- | --- | --- |
| Card integration | Current source contains card enrollment, settlement and saved-effect validation. Test uses reverse-patch applicability as a feature detector, then attempts a historical patch that no longer applies. Stale integration harness. Shrinking its scene window subsequently exposed a real within-day card wake bug: the clock advanced but no unrelated cast change requested card settlement. | Run synthetic native integration against current source directly. Current card fixture keeps native pending reload, settled literal import and corruption guards. It now enters an authored one-minute future scene using native predicate stepping; cast synchronization and the existing wait splitter include due card windows. No new clock/save owner or marker schema. |
| Native journey worker timeout | Instrumented execution progresses through save/reload/import and journey cases. Test repeatedly boots once for reload and again for import of the same state. Workload under concurrent full suite is not a proved gameplay hang. | Remove redundant boots. Keep explicit paid pending reload, literal pending generated-journey import, literal paid-arrival import, actual save validation of movement methods, cost/term tampering refusals and return/fare assertions. Streamlined isolated file passes in about 72 s versus about 150 s for the diagnostic old workload under different load; this is not an isolated performance benchmark. The first full run confirmed the journey passes under suite load. Final integrated gate passes below. |
| Beside clock | Current source's established local-clock presentation includes HH:MM. Old test expects band alone. Stale expectation, not a reason to remove clock precision. | Expect the relative day, band and actual minute; source clock owner unchanged. |
| Observer ratchet | Four direct lead/profile reads violate allowed one; this is a real UI seam violation. | Keep the single profile-to-observer adapter read. Declare local-entry capability through observer API; route existing behavior through capability checks, with explicit lead/beside regression. Do not increase allowlist. |
| Perspective inventory | Existing local-entry/arc/stock families are missing from the inventory. Real metadata/disclosure coverage drift. | Add their in-world classification and preserve native eligibility/observer projections. Existing inventory test enforces completeness. |

## Budget and verification plan

Focused failing tests first, one rebuilt desktop journey for changed navigation/disclosure, then the required build/architecture/rule checks and one full suite on final inputs. Reuse prior native journey evidence for untouched cost/settlement rules; do not rerun every story stage or read the saga again. Record failed attempts and exact native input identity. Volumes and backward design stay in the existing campaign owner; no volume-start feature is implemented by this gate repair.


## Additional correctness found while reducing cost

The old card smoke fixture waited a whole day, masking a missing within-day scheduling trigger. A one-minute scene reproduced failure with local clock 3 and no settled card markers. The fix reuses the existing admitted scene-window computation for `castSyncDue`, `syncLotmCast` and card settlement. `nextCastBeatTime` also supplies card boundaries to the existing wait splitter, preserving event order in a compressed wait. The native fixture proves no early effect, due-boundary visibility, actual clock-driven effect/report, pending reload, settled literal import and rejection of changed markers/effects. The current private story pack has zero standalone event cards; this is an engine regression demonstrated with an explicit synthetic native pack, not new story coverage.

Compatibility: no new save schema. Already settled cards retain their existing markers and do not replay; unreserved due cards request settlement on the next authoritative cast update through the current canon policy. Existing pending/due semantics are unchanged. Source/volume-start definitions still need valid prior history rather than advancing a clock and replaying every old event.

A browser check completed 11 journey checks but timed out waiting for a PLAY button that was hidden. Session.open now accepts either visible PLAY or a live already-running game, retaining its readiness timeout and ordinary engine/ownership checks. The corrected journey rerun passes all 12 checks. This is test-harness lifecycle handling, not an invented player action or a longer timeout.

The first full diagnostic after the initial fixes ran 4,914 tests: 4,913 passed, card smoke worker timed out under concurrency. The final bounded card/clock fix passes the five focused card tests, and the final full run passed 4,914 tests with zero failures, cancellations or skips. An accidental duplicate focused journey command was stopped by its explicit process PIDs and is excluded from evidence. No paused story or combat lane was resumed.


## Final verification and boundaries

| Check | Result / input boundary |
| --- | --- |
| `node --test tests/observer_view.test.js tests/perspective_controls.test.js tests/lotm_task_summary.test.js tests/book_world_lotm_opening.test.js` | 21 passed on changed observer/metadata and existing task/opening behavior. |
| `node --test tests/cast_journeys.test.js` | 10 passed, about 72 s. Final full run also passes the native case at about 102 s. No timeout increase or skipped scenario. |
| `node --test tests/cast_card_integration.test.js tests/cast_card_runtime.test.js` | 5 passed, about 19 s. Final full native case passes at about 34 s. Synthetic-pack bundle `72fa15d17255c2a4101f6522239f8f1c2201e3374f5823890e9bc2379297940e` is recorded by the test log; use the exact log value rather than a production-bundle identity. |
| Focused `lotm_cast_week` clock case | 1 passed; full suite covers the complete file on final inputs. |
| `BUILD_OUT=/tmp/lotm-gate-repair-accepted npm run build` | PASS (AD36/AD43). Native bundle SHA256 `8614372f71dae87ff718c85a9ca5f972d4f5dd2f0f216c10b5411deda81d9f5a`. A write-free esbuild reconstruction matches current runtime byte-for-byte. |
| `node scripts/playtest/lotm-populated-ui.mjs /tmp/lotm-gate-repair-native` | 12 native journey checks passed after the Session lifecycle correction. This earlier observer-corrected bundle precedes the final card wake fix; current story pack has no standalone cards and unchanged journey/cost/settlement handlers. Reused for that unchanged path, not represented as a final-bundle full journey rerun. |
| `PW_TEST_SCREENSHOT_NO_FONTS_READY=1 node scripts/playtest/lotm-gate-entry-review.mjs` | 2 final-bundle native checks passed at 1920×1080: earned lead entry/navigation and actual separate Beside entry. Zero page errors; both captures inspected. Initial attempt passed assertions but font-ready screenshot timed out; retry avoids font wait. This does not prove every remote font loaded. |
| `npm run check:arch` | PASS; main 10,105/10,115, display 6,764/6,767, save 310/310; no new cycle. |
| `npm run check:rules` | PASS, 19 receipts; existing untracked campaign-owner warning. |
| `npm test` | **4,914 passed, 0 failed/cancelled/skipped**, 555,920 ms. Final integrated gate, after the intermediate failed diagnostic. Overlapping focused counts above are not added to this total. |
| `npm run check:docs` | Existing shared-tree findings, including older campaign lines 67/83; no findings in this repair receipt or the added VG proposal section. No unrelated document cleanup. |

Private evidence: `docs/research/novels/lord-of-mysteries/private/test-gate-repair-2026-11-01/` contains `verification.json` (source hashes, exact native bundle and command-log identities), `entry-review.json`, both desktop captures and copied reused journey evidence. Original prior UI evidence remains archived as `populated-ui-2026-11-01/result-before-gate-repair.json`.

Task-path whitespace checks passed, including the new receipt, campaign additions and browser probe. No personal save, save schema, installed app, package, commit or push changed. This repair closes the five-failure repository gate for the bounded populated UI work; it does not close L2b combat, later native mechanisms, source coverage or full-saga playability. Next slice stays under the existing campaign order. Optional human review remains open.

## More to consider, saved without expanding this slice

ACT NOW: the five repairs and within-day card scheduling regression above are delivered. ACCOUNT FOR NOW: native tests should use the smallest authored clock window that still checks actual settlement, persistence and refusal; a shorter fixture can expose a defect hidden by unrelated daily synchronization. Existing long-route evidence remains necessary when route continuity changes, not for every presentation edit. LATER / DELEGATE: volume maps, one later native preset and measured content-loading work live in [VG1–VG6](LOTM_KLEIN_FULL_JOURNEY_PLAN.md#volumes-starting-points-and-backward-design-2026-11-01), with effort, reopen trigger and done checks. No worker or paid/API route was used for this task.
