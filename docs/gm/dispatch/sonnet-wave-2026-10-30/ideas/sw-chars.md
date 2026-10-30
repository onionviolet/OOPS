# Idea intake: sw-chars

Append-only. Format and rules: [QUEUE](../QUEUE.md#idea-intake).

## 2026-10-30, slice: pilot 5 + extension 10 principals + recurring builder (volumes 1-8)

ACT NOW (done in the slice)
- Sheets carry `personaIds` (L11) and the loader returns the persona ids held at a chapter. Standing stays in `standingOf`.
- `sheet_joins.mjs` adds `ability` (L10 record id) to matched rule entries and adds missing L10 abilities from the merge (6 joined, 5 added).
- Recurring tier by script (`recurring_sheets.mjs`): about 300 people with identity, dated power from stated Sequence mentions, derived might/mind bands (ev I), routine. No model call.

ACCOUNT FOR NOW
- Bundle thinning drops rule rows a join needs; the join reads the merge directly instead.
- A tie in a stated outcome cannot be a strict "beats" on a 0-9 scale; such an outcome is dropped, not bent. Outcomes with `survives` and no opponent band cannot be checked and count as uncalibrated.
- Lane output is never trusted: loc check against the bundle, 5-field source spot check, and the loader test.

LATER
- Join L4 rows (`lotm.aid.*`, `lotm.potionrule.*`, `lotm.div.*`, `lotm.summon.*`) to sheet rule entries by shared locator. Level: script. Effort: small. Done check: join count per sheet in `sheet_joins.mjs`.
- Abilities carry empty conditions, costs and limits on most sheets; fill from the owner records (L10) instead of the lane. Level: script. Done check: no ability entry copies condition text.
- Calibrate recurring bands with a cited outcome where a band is read by play (a fight or a bargain). Level: Luna medium. Done check: loader test reproduces 1 outcome per such person.
- Add people volume by volume as they enter (volume 2 onward principals not yet sheeted). Level: Luna medium per person. Done check: pilot test pattern.
- Sheet read-model hooks: `sw-bridge` consumes `sheetAsOf`; knowledge and relations stay in the cast records.
