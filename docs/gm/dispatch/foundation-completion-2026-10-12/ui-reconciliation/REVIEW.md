# Bounded UI union reconciliation review

Read-only source review by root/ui_reconcile_review on 2026-10-12. Only this report is written. Rehearsal and shared/candidate sources are untouched. No build, browser, suite, private pack/library, or personal-save operations ran.

Inputs: current shared checkout; `ui-reconciliation/REHEARSAL.json`; rehearsal 24-path union; frozen UI `UI_UNION_INPUT.json`, `CANDIDATE_MANIFEST.json`, and `REPORT.md`. Rehearsal `src/main.js` SHA-256 at inspection: `2727e4fefc16796297ad215292cd587431f01f808359d0729a56cbeda41f1021`. Every frozen after hash agrees with final UI manifest; all 15 newly added rehearsal files match their frozen after hashes.

## Actionable finding

**F1 [P2]: Player waiting-response summary includes NPC-owned decisions.** Rehearsal `src/main.js:8201-8202`, in the new `createWorkspaceViews` reader, filters open decision events by player discovery but omits `e.actorId === 'player'` in both the work-label list and `waiting` Boolean. A public or otherwise discovered NPC-owned decision therefore shows “Waiting response” and “Open waiting response.” Current `src/simulation.js:416` rejects attempts to respond for another actor, and its `waitingSimulationChoice` at line 79 correctly requires player ownership. The normal notebook/simulation event consumer also requires player ownership. Add that ownership predicate to both new filters, or reuse the existing waiting-choice reader for the Boolean. The finding concerns false actionability, not a demonstrated hidden-truth disclosure. A narrow shared native negative case should confirm a discovered NPC-owned decision does not claim a player response, while an actual player-owned required response remains reachable.

## Preservation observations

**F2: Current incumbent repairs remain in the merged source.** Actual shared-to-rehearsal diff retains the current Lin/Ink host/dispatch, qualified backlog, native equipment preparation with simulation-person owner bindings, native crafting custody guard, fieldcraft knowledge reader, import-probe lock and saving ownership code. The imported native equipment transaction is outside the 24 union paths. UI `simulation_ui.js` changes presentation status only; current actor-filtered events and audience-qualified history are retained. Native traveler/destination host work is outside this union and was not reviewed.

**F3: Save additions use the incumbent durable owner.** `save_files.js` adds validation of optional customization and Work Ledger fields before the existing checks. Missing fields initialize defaults; schema-1 ledger migration retains frozen terms and acquired benefits; future ledger schemas are rejected. `create_save`, native load and durable publication join the same fields. Profile/rule/receipt publications call existing `lifeSaveStorage`, whose `writeGuardedSave` succeeds before the newly added in-memory ledger/profile assignment. Craft receipt/effect publication occurs after that write. Existing native craft mutation before storage and incomplete rollback are explicitly qualified in UI REPORT, and remain a shared failure-gate concern rather than a newly concealed claim. No demonstrated additional save migration defect was found in this bounded source review.

**F4: New presentation readers stay within observed player state, with F1 exception.** Held/worn equipment comparison reads character inventory/equipment; native work queues filter player ownership; quiet place detail uses native known-Village/weather/calendar predicates and suppresses itself away from Village. Current simulation history audience filter survives. The discovered-event predicate protects unknown events, but F1 still needs the owner guard for actionable decisions.

## Remaining integration gate

Known `index.html` conflict concerns generated bundle query versions only; root owns its resolution/rebuild. This report establishes bounded source preservation and the finding above, not native acceptance or all-horizon completion. Root/UI integrator owns rebuilt shared G5 UI/save/response/failure/legacy-save proof. No additional broad audits or unchanged source suites are requested.
