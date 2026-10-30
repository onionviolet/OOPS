# Idea intake: sw-chars

Append-only. Format and rules: [QUEUE](../QUEUE.md#idea-intake).

## 2026-10-30, slice: pilot 5 + extension 10 principals + recurring builder (volumes 1-8)

ACT NOW (done in the slice)
- Sheets carry `personaIds` (L11) and the loader returns the persona ids held at a chapter. Standing stays in `standingOf`.
- `sheet_joins.mjs` adds `ability` (L10 record id) to matched rule entries and adds missing L10 abilities from the merge (6 joined, 5 added). [folded: done in slice]
- Recurring tier by script (`recurring_sheets.mjs`): about 300 people with identity, dated power from stated Sequence mentions, derived might/mind bands (ev I), routine. No model call. [folded: done in slice]
 [folded: done in slice]
ACCOUNT FOR NOW
- Bundle thinning drops rule rows a join needs; the join reads the merge directly instead.
- A tie in a stated outcome cannot be a strict "beats" on a 0-9 scale; such an outcome is dropped, not bent. Outcomes with `survives` and no opponent band cannot be checked and count as uncalibrated. [folded: WA53]
- Lane output is never trusted: loc check against the bundle, 5-field source spot check, and the loader test. [folded: kept in the sheet loader notes]
 [folded: WA53]
LATER
- Join L4 rows (`lotm.aid.*`, `lotm.potionrule.*`, `lotm.div.*`, `lotm.summon.*`) to sheet rule entries by shared locator. Level: script. Effort: small. Done check: join count per sheet in `sheet_joins.mjs`. [folded: QR6b]
- Abilities carry empty conditions, costs and limits on most sheets; fill from the owner records (L10) instead of the lane. Level: script. Done check: no ability entry copies condition text. [folded: QR6b]
- Calibrate recurring bands with a cited outcome where a band is read by play (a fight or a bargain). Level: Luna medium. Done check: loader test reproduces 1 outcome per such person. [folded: QR6b]
- Add people volume by volume as they enter (volume 2 onward principals not yet sheeted). Level: Luna medium per person. Done check: pilot test pattern. [folded: QR6b]
- Sheet read-model hooks: `sw-bridge` consumes `sheetAsOf`; knowledge and relations stay in the cast records. [folded: QR6b]

## 2026-10-30 improvement pass 1 (sheets)

ACT NOW (done)
- check:arch run (pass). Routine copies removed; sheets link to the cast routine and slot ids (310 sheets). Loader returns `links`.
- Unread empties stripped from ability entries. Findings: gates on 1 of 1,494 entries; believed/by on 3.

ACCOUNT FOR NOW
- The next principal briefs ask for an explicit gate pass (another person's concealed identity or sealed fact, by id) and a believed-view pass (what observers think), since the first lanes skipped both.

LATER
- Observer beliefs per sheet from `reacts`/`relations` rows. Level: Luna medium. Done check: loader test finds one `believed` entry per principal that differs from `actual`.
