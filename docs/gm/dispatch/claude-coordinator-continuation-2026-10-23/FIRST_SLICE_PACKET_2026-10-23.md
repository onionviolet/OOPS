# First-slice packet: Primordial Saint Sect, "Priced credit and the restart" (2026-10-23)

Status: PACKET ONLY. Drafted and rules-reconciled by the world-readiness coordinator (Sonnet, `claude-sonnet-5-5`, parent-recorded Agent id `ac5fff40b1e908106`). Nothing here is built, browser-verified or director-accepted. Weibao's go-ahead is the next gate; this file selects no world and opens no deferred gate. Every authored value below is a proposal (AD32, WA3). Source: [Primordial Saint Sect pass](../../../worlds/PRIMORDIAL_SAINT_SECT_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md) (source-reviewed on its listed rows, sections 16-17 and 18), W4 window return in the gitignored store `docs/research/novels/primordial-saint-sect-2026-10-10/passes-2026-10-23/W4_P2_return.md`.

Rules applied: AD1, AD5, AD6, AD11, AD12, AD14, AD19, AD22, AD33, AD34, AD38; WA1, WA3-WA6, WA8, WA11, WA12, WA14, WA19; ECR (credit, standing, dated terms: ECR17-ECR23 as cited by `src/economy_standing.js`); GTR1-GTR4, GTR9 (gate descriptor); AR12 (shared layer holds the verb, world holds numbers); WPR30-WPR32. PIR/SR/MR/BHR/SLR are not touched by this slice. Target viewport: desktop 1920x1080 primary with 1536x864 at 14px and 21px as the relevant floor, mobile deferred (superseded 2026-10-24: this line first read 'desktop 1366x768 and 1600x1000', a retired target); visible outcome: a credit panel that refuses or grants, a ledger line, and a carry list after a restart. Deferred: mobile, NPC-heavy cast (AD33), the Book's later mechanics, Golden Nature settling, talent rolls, the death-menu four-slot picker.

Build status (2026-10-24, code lane): built opt-in at `?primordial_probe=1`, tested and played, not accepted; see [checkpoint](../primordial-credit-2026-10-24/CHECKPOINT.md).

## Live summary (2026-10-24, supersedes earlier wording below, which stays as history)

- **Authorization:** Weibao authorized building this slice and directed the workers dispatched from the "Fleshing out worlds" chat (one code worker, one source worker; no duplicate lanes). Building starts from this packet; it is not accepted until played and reviewed.
- **Loan terms (source, opened):** a flat 460 CP a year on a 1,000 CP loan (100 principal plus 360 interest; 4,600 total over ten years), and a 500 loan owes 180 after a year (c0006 p35, c0008 p63-67). The earlier "1,360 after one year, lump sum" reading is superseded; the test asserts the flat schedule, with the rate a dial.
- **Resolved loan meaning (2026-10-24, parent reopened c0006 and c0008 in the full-book source):** two different loans, so no contradiction. (1) The sect's first-exchange cultivation-method loan (c0006 p33-36): the narrator's arithmetic is that 36 percent a year means paying back 460 contribution points every year including principal and interest, 4,600 over ten years. That is 100 principal a year plus 360 interest a year, i.e. simple interest on the ORIGINAL principal, a flat yearly installment (STATED by the narrator through Lu Yang; the split into 100 and 360 is the arithmetic that reproduces 4,600, an inference). (2) The 500-point Three Rivers Society loan (c0008 p51, p63, p67), a different lender with a one-year term at the same 36 percent: 'the 500-point principal for the seeds plus 180 points in interest comes due', so it owes 500 + 180 = 680 at the end of the year as one lump (a bullet loan, not an installment). The earlier phrase 'a 500 loan owes 180 after a year' meant its interest only; a 500 sect loan on the ten-year schedule would owe 230 a year (50 + 180), which the source does not state. Implementation, tests and UI keep four quantities distinct: annual INSTALLMENT (460 for 1,000), accrued INTEREST (flat 360 a year on the original principal), remaining PRINCIPAL (falls 100 a year, 900 after the first payment), and TOTAL OBLIGATION (4,600 over the term; remaining installments times 460). The 'owed amount' line shows total remaining obligation and the next installment, never a lump-sum 1,360.
- **Build result (2026-10-24):** built as the pack-local fallback, not the standing-faction route (the standing route would list the lender for every player, its 28-day due date and 31-day ratchet cannot hold a ten-year schedule, and it pays coins not CP); see the primordial-credit CHECKPOINT and the GAP_AUDIT build round. The standing seam note above is history.
- **Source versus authored dials:** SOURCE: the 36 percent first-exchange rate and ten-year term, the 460 a year schedule, the 1,000 CP and 300 CP item prices, rent 30 CP a month, the credit cap rule (c0009 p65-66). AUTHORED (proposals, labelled): the 30-day month and 360-day game year (the source gives twelve monthly cycles but no day count), the 600 CP second-half manual price (not stated; Lu's 10,000 is a guess, 1,500 is a different sale), the recorded body-value formula. SHOWN BASIS, DIAL KEPT: open obligations `drops` on the loop restart (c0015 p6, p9-15, p86); a non-loop restart is not shown, so it stays a dial.
- **Target viewport:** 1920x1080 primary, 1536x864 at 14px and 21px as the relevant floor, mobile deferred. 1366x768 and 1600x1000 are retired.
- **Excluded from this slice:** the Merit Pool (entry rule found in Ch 12: one monthly pick, 10 CP into the pool account; the yearly versus monthly tension is unresolved), the death-menu picker, the same-body restart, talent settling and later-Book mechanics.
- **Dispositions (rules-reconciled, none built):** Primordial READY for this thread; A Soldier's Life NEEDS SPECIFIC SOURCE; Fanren and Regressor's Tale NEED MECHANISM and source; TTKS NEEDS MECHANISM per book.

## Why this world first (ranking default and what changes it)

Default: Primordial Saint Sect, because its floor records K2, K3 (loan path) and K8 are source-reviewed with opened price and rate locators, and the mechanism classes it needs already have seams (credit with dated terms, the obligations ledger, a gate descriptor, a per-world carry ledger with a rebirth boundary). Changes: (a) if the build lane will not accept the two additive fields below, fall back to a pack-local accrual row on the obligations ledger (loses the standing UI line); (b) if Weibao names a loop-first world, A Regressor's Tale or Fanren needs the loop-restart boundary first (see dispositions in GAP_AUDIT).

## Scope (one signature thread, WPR30)

Borrow against yourself, buy the first-half manual, die on purpose, and see what the restart does to the debt. One thread, three rows of law, no cast beyond a clerk.

## Floor records used (all from the pass doc, WA6)

| Pass record | Used as | Evidence |
|---|---|---|
| K2 EF1 credit never exceeds a disciple's total value | Refusal rule | c0009 p65-66, STATED (V) |
| K2 EF3 first-exchange loan: zero down, 36 percent a year, ten years | Loan terms | c0006 p33-35, SHOWN (V); simple-interest reading is inference |
| K2 debt and restart | Dial on the rebirth boundary | Lu's plan that a restart makes the old loan moot: c0006 p40, STATED as a character's belief; the sect's price rule (c0009 p66) is the counter. Whether the debt really ends is NOT a source fact; keep as authored dial (WA8, AD6) |
| K3 learn path: first half issued, second half bought | The thing the loan buys | c0006 p27-35, SHOWN (V) |
| K8 price anchors | Item rows | Divine Firmament Sword Control True Formula 1,000 CP (c0006 p32); Killing Life Curse 300 CP (c0011 p46); rent 30 CP a month (c0003 p25); merit pick 10 CP a month (pass K8 row; locator not separately reopened by this packet) |
| W4 Merit Pool | Deferred; recorded only | c0089 p61-64: staking a year's CP for a prize draw; tiers named gold and purple, top result a seven-colored jackpot; entry rules, fees and odds not found in the window |

## Data rows needed (proposals; IDs namespaced `book.primordial.` per WA9)

1. `book.primordial.credit.sect` : faction row `{label, region, creditScale, interestScale, why}` for the Library system. Rate row: 0.36 a year converted to the per-`termDays` rate the formula uses (`rate x days / termDays`, so the flat per-term rate is 0.36 x termDays / year length in days of the world's calendar). Authored conversion.
2. `book.primordial.gate.credit_cap` : a `defineGate` descriptor, kind `resource`, requires `{fact: 'loan.requested', op: 'lte', value: {dial: 'bodyValue'}}`, reason from c0009 p66, one costed route (raise recorded body value by an in-world act, authored cost). Dial `bodyValue` default authored (proposal: 1,200 CP, so that the 1,000 CP formula passes and a 1,500 CP Coiling Dragon method, c0027 p1, is refused). 
3. Item rows: the 1,000 CP formula (first half free of charge issue, second half priced, authored 600 CP; the half-split itself is source c0004 p11, c0006 p12-13, the second-half price is not stated), the 300 CP curse.
4. `book.primordial.carry` : a world row set for `src/carry_ledger.js` `WORLD_RULES`: death drops body and wealth; rebirth carries memory and the chosen base cheat; rebirth row "Open obligations" is `drops` as the proposed default, with the scope `this life` and the reason "the sect reads a restart as a body no longer in hand"; the opposite default (`carries`) stays a one-line dial. Mirrors the Paradise precedent (AD11, AD14).
5. One clerk (Library elder) at T2 with one verb, offer a loan (c0006 p1, V role only).

## Existing seams to reuse (read-only survey, none edited by this packet)

- `src/economy_standing.js` (`takeLoan`, `owedNow`, `loanStatus`, `repayLoan`; `creditTerms` computes limit from tier credit): hosts the loan and its UI line (`economy_standing_ui.js`). Gap found: `creditTerms` limit comes from standing tier, not a body value, and rate comes from tier. Smallest extraction: two optional additive fields on a faction row (`fixedRate`, `limitFrom`). If refused: pack-local adapter writing a `coin` row to `src/obligations_ledger.js` (`writeObligation`, `eases: 0`).
- `src/progression_gates.js` (`defineGate`, `evaluateGate`) over `src/rules.js` leaves (`eq`, `gte`, `lte`): the refusal with its reason and costed route; a thin world-side caller supplies the facts and runs before `takeLoan`.
- `src/obligations_ledger.js`: coin obligation with `carries` and `eases`; `carriedObligations` already filters on `carries`.
- `src/carry_ledger.js` and `src/lives_carry_domain.js`: the rebirth boundary and its player-visible carry list; `src/heir_inheritance.js` and `src/life_experience_host.js` for the end-of-life route.
- `src/world_pack*.js`: lint and `id@revision` pin once the rows are a pack (WA10, WA21). Not required for the first play.
- Missing and NOT in this slice: a same-person loop restart with an anchor (C17 gap in the implementation map), the death-menu four-slot picker (`death-menu` in `src/cheat_cards.js` is a C0 data contract that runs nothing), the Book page counter. Because AD12 and AD11 make the restart a player option, the slice reaches the rebirth boundary through the existing end-of-life heir route and labels the stand-in honestly: it shows what the sect's rule does to debt at the boundary, not a same-body restart.

## Save impact

Additive. A faction row, a gate, items and a `WORLD_RULES` entry are data. Loan state rides the existing standing slice (`economy_standing` schema 1, validate and migrate present); no new save slice if the standing route is used. Under the fallback the ledger rows ride `obligations@1` with `MAX_OBLIGATIONS` 256. Persistence of the changed state is unproven until saved, reloaded and imported (WPR32); existing saves unchanged.

## Refusal and allowed cases

- Refused: a loan above recorded body value, with the gate's reason and its costed route shown; a second first-exchange loan (the zero-down offer is first exchange only, c0006 p33).
- Allowed: any loan at or under the value; partial repayment; overdue handled by the existing grace days and ratchet (forgiving by default, AD19).
- Allowed by AD38: borrowing against a different asset the world prices (a route, not a permission list).
- Sealed: no Golden Nature truth, talent settlement or later-Book mechanism appears in player text or this packet (WA11); those stay `[S]` by ID in the pass doc.

## Focused test idea (one file, lane runs only it)

`tests/primordial_credit.test.js` (name proposed): (1) gate refuses 1,500 against 1,200 with the vague hint until the character knows the value rule, then names it; (2) a 1,000 loan at the converted rate owes the expected total after one year and after ten (simple interest: 1,360 after one year, 4,600 total only if repaid as the source's 460 a year schedule; assert the formula, not the narration); (3) borrow, serialize, reload, still owed; (4) rebirth carry list shows "Open obligations" as `drops` for this world and as `carries` for `base.frontier`.

## Browser journey to play later (rebuilt bundle, fresh origin, 1920x1080 and 1536x864 at 14px and 21px, then save, reload, import)

(Superseded heading, kept as history: 'fresh origin, 1366x768 and 1600x1000'. 1366 was retired; see the live summary above.)

Open the Library panel, ask for the 1,500 CP method (refused with reason), ask for the 1,000 CP formula (granted at 36 percent a year), see the ledger line, advance time and see the owed amount rise, end the life through the existing route, read the carry list on the far side, import the saved file and confirm the same line. Label anything not exercised implemented-unverified.

## Open locators before build (do not fill as canon)

Second-half manual price (not stated); the length of a game year to convert the rate; whether the sect actually recovers a restarted borrower's debt (shown only as intent, c0009 p64-66); the Merit Pool entry rule (not in Ch 75, 76, 80, 88, 89, 90).

**Annotation, 2026-10-24 (source-gap coordinator; details in pass doc section 19).** The list above is kept as written. Updates, each opened at its locator:
- Second-half manual price: still not stated; only Lu's guess that a complete Sword Control formula would cost about ten thousand (c0007 p17) and a full Coiling Dragon method sold for 1,500 (c0027 p1). Keep 600 CP authored.
- Game year: no day count; twelve monthly cycles shown by Lu's budget (rent 30 CP a month, 360 a year, c0008 p63-65). Convert 36 percent as 12 months; days per month authored. Source repayment is a flat 460 a year on a 1,000 loan (c0006 p35), so the test idea's "1,360 after one year" is a lump-sum reading, not the sect's schedule.
- Restarted borrower: in the loop as shown the restart returns to intake and the first-exchange loan is again unused (c0015 p9-15, p86); no recovery is shown. The `drops` default now has a shown basis for the loop; a non-loop restart is still not shown.
- Merit Pool entry rule: found in Ch 12, not in the earlier window: one pick a month, blind-picked number, 10 CP into the pool's account, five fish colors, one rainbow fish takes the account (c0012 p3-11). "One draw a year" (c0022 p7) and "all my points this year" (c0089 p61) stay as an unresolved tension. Still deferred for this slice.
