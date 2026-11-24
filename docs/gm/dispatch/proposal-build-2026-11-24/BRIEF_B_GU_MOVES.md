# Lane B brief: partial-recipe state (Q4), slot second-read (B1) and slot jobs (B4 data)

Read [README](README.md) for the shared rules. Context: WA23 slot evidence in `docs/coverage/evidence/gu_move_slots.jsonl` ([WA23 brief](../atlas-slots-passages-2026-11-24/BRIEF_WA23_SLOT_EVIDENCE.md)), and the [reconciliation](../../../audits/PROPOSAL_RECONCILIATION_2026-11-24.md) A4, HW1 and Q4.

## 1. Second-read the 88 chapter slots (B1)

For each `tier: "chapter"` row, run `python3 -I scripts/check_passage.py --ledger gu_moves --id <move> --chapters <N>-<N> --json` and read the paragraph. Add `secondRead` (`agree`, `differ` or `nothing`) and, on differ, `secondReadNote`. Do this in the builder as an input file it merges, for example `docs/coverage/evidence/gu_move_slot_reviews.json`, which you own, so a rebuild keeps it. Extend the test accordingly.

## 2. Slot jobs (B4 data, HW1)

Where a source states what a support does (for example "to conceal the breath", "for defence"), add `job` and `jobAt` (a locator) to that slot. For unnamed slots this is the main point: an open slot shows its job. Do not guess a job.

## 3. Partial-recipe state (Q4, decided 2026-11-24)

Moves with at least one second-read-agreed chapter slot whose recipe is still incomplete become `blocked:roles-partial`. This replaces `roles-unknown` or `roles-unchecked` on those rows. Moves without such slots keep their state.

1. Register `roles-partial` in `docs/coverage/blocked_slugs.json` with its meaning and next action.
2. Make `scripts/gu_coverage_ledgers.mjs` (the `gu_moves` producer) derive it from the slot file, with a minimal edit.
3. Regenerate `docs/coverage/gu_moves.jsonl`.
4. Report the counts before and after.

## Checks

Run `node --test tests/gu_move_slots.test.js`, `python3 -I scripts/gu_move_slots.py --self-test`, `npm run -s check:coverage` and `node --test tests/gu_coverage.test.js`. Report each exit status. Then give the updated slot JSON contract (new fields) for the atlas fold. Write a short record to `lane-b/REPORT.md`.
