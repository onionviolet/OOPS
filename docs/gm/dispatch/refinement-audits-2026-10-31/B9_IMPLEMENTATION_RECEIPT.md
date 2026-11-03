# B9 implementation receipt: acts that have read past a canon beat meet it

2026-11-03. Runtime fix for [backlog row B9](MECHANISM_BACKLOG.md). **Implemented, focused-tested, built; not run natively; not human-reviewed (AD43).** Rules: AR3, AR9, AD5, AD38, AD48, AD49.

## Diagnosis (confirmed)

`reservationDecision` (`src/constraint_store.js:78-79`) refuses a timed act when an unsettled, non-fill beat of the same actor ends inside the window. `canonActionDecision` (`src/book_world_lotm_cast_host.js`) settles a beat only through `terminalBeat(ledger.done[id])`, which the cast host's day settlement writes when the clock passes the beat. The built acts run ahead of the canon clock, so at the KJ3M checkpoint (clock 3813) day-3 beats `.801` onward are future, unsettled and reserved. Read against the real KJ3E pack and checkpoint: 20, 120, 300, 360 and 720 minutes were all refused before the change with cover off (300 shown by the test), allowed after.

## Which beats the built acts cover

Beat locators are zh chapter/paragraph; act locators are en. The chapter numbers line up in this stretch (`.801` zh ch19 p18 against `kjw3g.duties` en ch19 P018-036). The nearest act per beat:

| Beat | zh locator | Act that covers it |
|---|---|---|
| `.704`, `.705` | ch17 p62, ch18 p1 | already `carried` (kj3f, kj3g.myth to origins) |
| `.801` | ch19 p18 | `kj3g.duties` |
| `.802` | ch20 p57 | `kj3h.upstairs` / `kj3h.advance` |
| `.803` | ch20 p68 | `kj3h.accounts` |
| `.804` | ch21 p4 | `kj3i.diary` |
| `.805` | ch21 p73 | `kj3i.leonard`, then `kj3j.monday` (en P066 ends short of zh p73; next chapter passes it) |
| `.901` | ch22 p26 | `kj3j.sleepless` |
| `.902` | ch23 p34 | `kj3k.cane` / `kj3k.pay` |
| `.903` | ch23 p62 | `kj3k.drill` / `kj3k.dinner` |
| `.904`, `.905` | ch23 p80, ch24 p27 | `kj3k.dinner`, `kj3k.errand` |
| `.906` | day 4, ch24 p58 | `kj3l.withdraw` / `kj3l.history` |

No built act leaves a day-3 beat uncovered. Beats beyond the furthest finished act (en ch29 P016 here) are uncovered by definition and keep reserving time.

## Change

New pure module `src/canon_source_reach.js` (`locatorReach`, `beatPassage`, `sourceCoveredBeats`) plus 8 lines in `canonActionDecision`: the `settled` callback is `terminalBeat(ledger.done[id])` OR the lead's finished acts (`actors.player.completed`) having read past the beat's passage. Default: on. In-world reason: the life has already lived the text through that point, so the scene is not owed. Dials, read from the pack's `leadLife.sourceReach` (absent means defaults): `enabled:false` restores the clock-only reading; `chapterOffset` (zh minus en chapter, default 0) corrects numbering drift. Continuity notes in act locators add no reach.

Not a never/always rule: only the lead's own beats; open mode and fill beats are untouched; the day settlement still carries the beat when its time comes.

## Change surface (FND2) and persistence

Touched core files: `src/book_world_lotm_cast_host.js` (one import, one closure, one settled clause). No new cycle edge (the new module has no imports), no registration line. **No new state**: the beat ledger shape, `terminalBeat` and every save slice are unchanged, so no migration. The decision is a read-time projection of the existing completed-act ledger.

## Evidence rows

| Row | State |
|---|---|
| Source edited | yes |
| Focused test | `tests/lotm_constraint_host.test.js`: 11 pass, 1 skip (clean clone). With `YAIRPG_PRIVATE_ROOT` pointing at the main checkout's private folder: 12 pass, including the KJ3M checkpoint against the KJ3E pack (300 min allowed with cover, refused with `sourceReach.enabled:false`). Fixture tests: refused while an unread beat sits inside the window; allowed once the covering act is done; the unread beat still refuses; no finished act means no cover; the offset dial; locator parsing. |
| Neighbours | `constraint_store` 7, `constraint_indexes` 3, `book_world_lotm_cast` 2, `lotm_cast_week` 17, `lotm_be_seat` 14, `lotm_cast_tier` 3 pass. Full suite not run (failures from other sessions). |
| Build | `npm run build` ok (bundle sha256 `2f659cc7…1431`; `dist/` and `index.html` were not committed). `check:arch` PASS (main.js growth -5), `check:rules` PASS. |
| Native run | **Not run.** Not verified in the pinned-bundle browser route: kjw4's first act (night to Sunday morning) taken at the KJ3M checkpoint. |
| Save/reload | Not applicable (no persistence change); not exercised. |

## Not verified, known limits

- The zh/en chapter alignment is an inference from the sampled locators, true for ch17-24 here; other stretches may drift (use `chapterOffset`).
- Waits still split at unsettled beat times (`nextCastBeatTime` is unchanged), and day settlement will still carry `.801` onward when the clock reaches them, with its report and knowledge writes. Only the time reservation is lifted.
- kjw4 itself is unbuilt; the unnarrated clock gap (dawn at 3793 versus Sunday morning) is a content matter for it.
