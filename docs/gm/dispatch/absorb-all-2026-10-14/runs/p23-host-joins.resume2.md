Coordinator answer to Q2 (2026-10-14): APPROVED as an opt-in proposal, implemented LAST.
Order: do tranches 2-5 first (gear/combat, reading/salvage, field/market/leisure, detail/adaptation) and merge `codex/gameplay-foundations` into your branch before the final gate. Commit `P00 tranche N:` after each passes and list merge-ready lanes.
Then implement your P15_SAVE_AUTHORITY_PROPOSAL.md steps 1-4 with these conditions (this is the explicit compatibility decision required by AGENTS.md):
- Enrollment is an explicit player action, default off; no game is enrolled implicitly, and boot behaves exactly as today when the new key is absent.
- Every legacy key stays byte-identical before and after enrollment; prove it with a hash test.
- A present-but-invalid new authority is rejected loudly with no silent fallback and no mutation; the player is shown how to recover from the preserved legacy save.
- Enrollment UI states plainly that enrolled games need this build or later.
- Same writer lock; single durable write per save/import/undo; quota/failure leaves the prior authority unchanged (test quota failure).
- Gates: old saves (made on current main tip) load unchanged; enroll, play, undo, save/reload, Export/literal-file Import of an enrolled game; corrupt-authority rejection; unsupported schema rejection.
If any of these cannot be met, keep capture/download only, mark native Undo OPEN, and finish your report. Multi-slot switching and N29 offline catch-up stay out of scope.
