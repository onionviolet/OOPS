# CV1 semantic audit rows

This receipt covers only [CV1_SPEC.md lines 1–70 and 337–349](../dispatch/body-lineage-2026-10-14/b15/CV1_SPEC.md). It gives F1a–F1n separate rows, plus D1 and D6. The 2026-10-14 report calls CV1 a build-ready proposal, not a selected implementation. Its source locators point to that dated dirty snapshot and should be rechecked before implementation.

The key correction is F1a: optional `awakened` has state-specific typing, while current card validation separately checks `points` as a nonnegative safe integer. Neither check validates a proposed nested CV1 observation object. F1d/F1k use parent-verified current status-consumer pins, so the old “no body tab” and main callback offsets are not current UI proof. F1l’s old render-before-save sequence is superseded by the parent-verified durable `awakenOptionalStart` ordering. That source ordering does not establish storage-fault recovery or CV1-specific effect/evidence publication.

D1 remains a conditional route through B2’s optional body record and serialization/migration owner; the referenced B2 spec and linked test-plan sections were not re-read here. D6 is a proposed gate, not evidence of implementation or acceptance. Findings whose named code was not in this bounded read remain dated or explicitly inherited from parent-verified pins.

Lines 71–336, D2–D5, and all 22 payload cards were not semantically reviewed. No source modules were changed; no tests/build/browser/saves/gameplay/human acceptance were exercised. Full claims, locators, consumer status and unresolved joins are in [the private JSON crosswalk](private/SEMANTIC_CV1_AUDIT_ROWS.json).
