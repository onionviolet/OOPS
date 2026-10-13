# First-cycle static integration review

Read-only review of actual isolated candidate against `FIRST_CYCLE.json`, 2026-10-12. Root owns fixes, rebuilt native browser proof and persistence evidence. Reviewer authored the initial runtime module; this pass examines the root-integrated consumers and UI, not an independent authorship audit. No candidate source changes in this pass.

## Findings

**F1 [P2] Cancel and settings do not reach native crafting effects.** `src/work_ledger_ui.js:83` binds Cancel active effect to its panel-owned `effects.cancel`; settings handlers similarly cancel that instance only. `src/main.js:2138` routes actual crafting receipts to a separate `workLedgerCraftEffects` instance. Thus cancel, Motion off, or Sound off while a native pulse/tone is active does not stop that active craft effect. C3 requires cancellation/quiet controls for the actual connected consumer. Connect presentation-only cancel/settings handling to both instances. No gameplay command should be added.

**F2 [P2] Unknown commission records count as earned points on import.** `src/work_ledger_system.js:24` validates only meal/hilt, but line 29 sums every value of `state.commissions`. A direct source probe using a new state with sequence 2, connection connected, meal claimed at sequence 1, hilt available, extra `fake:{status:'claimed'}`, and points 4 returned `validateWorkLedger(...) === true`. This malformed optional state bypasses the finite two-commission reward accounting and then passes `migrateWorkLedger` used by `validateSaveEnvelope`. Reject nonexact commission keys and calculate earnings from canonical IDs. This is an imported-state consistency defect, not a security restriction on personal save editing.

**F3 [P2] A mixed quality batch can omit a real assist application receipt.** `src/main.js:4139` retains the first rolled quality tuple only. If that output is already at the native cap, but a later component in the same batch is improved, the observer sees before===after and emits no applied-assist receipt despite actually improved inventory output. C2/C3 connected application evidence should retain the first improved tuple, falling back to the first tuple only when none improve. This does not affect the actual bonus calculation, which is correctly applied to each output before inventory-key/rarity XP construction.

## Static checks and limits

The reviewed save path validates the envelope, writes via existing guarded `lifeSaveStorage`, then migrates/publishes Work Ledger state and effects. A failed storage write occurs before the ledger assignment and effect publication. Native craft inventory/material/XP mutations precede this call, as in the preexisting native crafting design; this review does not claim whole native craft rollback.

Exact category/subcategory/recipe IDs feed observation after actual output and material consumption. Actor, alive, occupied, Village and exact next-sequence checks exist in the runtime; modifiers use the holder context and existing native recipe limits. Claims, point spending, acquired method and connected lease have distinct states. UI uses textContent for public receipts; no sealed-truth source or hidden actor projection was added. Effects use animation/audio/resize/visibility only and add no gameplay clock or reward dispatch. Root's browser and generated save/reload/import proof remains authoritative for exercised behavior.

Only additional executed probe in this review was F2's minimal malformed-state validator reproduction. No broad test rerun or browser interaction performed. Source paths/line numbers above describe the reviewed revision; root may change them while fixing findings.

## Reviewed source snapshot

- `src/main.js`: `9c39985ce4f946cace1c7ee886786483db7ef1b704eb3603cc54b3edf86e6768`
- `src/save_files.js`: `1a36af0b56b924469ef6ca097be905e759911e655b53b9f6b4f346a3dd29b21f`
- `src/work_ledger_system.js`: `a9d01c8fd4187d9f20fb8b59b5dfbeab06373080d6068fd4a2175502b9e18da7`
- `src/work_ledger_ui.js`: `ab021d73eb2006df2bfd7f39c6bdbd91bc1c40fa3cd9457a65e4c6df97fba250`
- `src/settled_text_effects.js`: `370ad804f8d498aeac5e54c28535c644a909f0a48eebfaddb3f73fb1aec8c671`
