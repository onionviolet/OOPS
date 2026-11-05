# Natural-play second-pass evidence

Read-only source audit at ce005a31. The worktree source/config/index/dist stayed untouched. `session.cjs` and `fingerprint.cjs` belong only to this evidence directory. The existing private_packs symlink is preserved.

- `build.json`: actual in-memory rebuild fingerprint, source-map parity, viewport and dev-mode check. Served bundle hash was independently read in the browser harness process and matched.
- `steps.json`: observed timings and real tick counts. Relay rows are native travel/action timings, not advanceTicks batches. Failed patrol batches still completed and paid; their error and before/after clocks are retained. Timing is an observed lower bound because two earlier automation timeouts and the first 25 delivery jobs were not completely instrumented.
- `checkpoints.json`: exact own disposable native snapshots, not manufactured prerequisites. Internal verification data; use the report's known-only summaries rather than presenting undiscovered save data.
- `recovery-earned-checkpoint.yair`: exact earlier earned snapshot imported after an automation-kernel timeout, with no field edits. Progress rolled back and was earned again.
- `earned-pre-undo-continuation.yair`: exact earned snapshot before Undo enrollment, used for a separate continuation branch after another harness timeout. The enrolled Undo proof remains a separate branch; its progress is not added twice to the retained main-life total.
- `undo-comparison.json`: captured state, five real ticks later, then native Undo/reload restoration. Clock 46428 -> 46433 -> 46428.
- `candidate-sanitized.json`: ID/count-only fresh candidate save/reload comparison. `candidate-known-hints.json` contains text only from actually reached visible action rows, not unchosen outcomes. `candidate-network.json` records real pack requests. <!-- slip-ok: Historical capture inventory; this describes recorded evidence scope, not a design constraint. -->
- Screenshots are 1366x768. Settings overflow, first combat vitals, exchange break/living gear, parcel completion, training save blocker, salvage and paid Mistglass are specifically captured.

Two automation-kernel timeouts closed ephemeral browsers. Those are harness failures, distinct from the reproducible patrol display exception and one training encounter save/display failure. The later persistent Node process avoids that kernel timeout. It uses the game's own advanceTicks, public native controls and exact earned checkpoint imports only. No grants, money edits, dev mode, pinned clock/RNG or seeded prerequisites were used.

Final authority is reports/natural-play-2.md. timing-summary.json gives qualified measured totals; final-save-reload.json records exact checked projection equality. Screenshots24/25 show native paid herb recipe and fifth-attempt success;26 household ventilation;27 final reload. OBSERVATIONS.md is a chronological working record with final corrections appended, not competing current authority. Screenshot12 filename overstates its early partial-clear capture; final40/40 is in checkpoints.json.
