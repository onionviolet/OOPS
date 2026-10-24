# Primordial credit loop: browser proof, 2026-10-24

Candidate: isolated build in the session scratchpad (`.../scratchpad/cand`, dist/bundle.js with the feature), served on 127.0.0.1:19931 (stopped by PID at the end), URL `?primordial_probe=1`, built-in Browser pane. Nothing under src/, tests/, dist/ or index.html touched. Labels: PLAYED = exercised in the pane; HARNESS = outside the player route.

Method note: the pane was reported "hidden" by the host, yet the page ran and laid out normally once resized. The page's game clock runs 1 game minute per real second. The pane closed itself once during a 20 minute wait (clock stopped, page lost); the game's autosave restored it on reopen (see 3a).

## 1. Viewports (PLAYED, panel opened via More panels, "Sect Library · priced credit")
| Viewport | Text size | docSW/innerW | panel width / scrollWidth | Result |
|---|---|---|---|---|
| 1920x1080 | 14 | 1920/1920 | 701 / 699 (client 699) | no overflow |
| 1920x1080 | 21 | 1920/1920 | 701 / 699 | no overflow (panel font 21px) |
| 1536x864 | 14 | 1536/1536 | 479 / 477 | no overflow |
| 1536x864 | 21 | 1536/1536 | 479 / 477 | no overflow (panel font 21px) |
Screenshots: one at 1536x864 text 14 (panel text legible, buttons visible, wraps cleanly). Gap: no screenshot saved at 1920x1080 (measurements and text reads only); no screenshot at 21px at either size. At 21px legibility is judged from computed font size and zero overflow, not seen.

## 2. Cap refusal, grant, ledger (PLAYED)
- Ask Coiling Dragon (1,500 CP): "Refused: Coiling Dragon method | Credit never exceeds a disciple's total value (c0009 p66, stated). | Something is still missing. | Route: A higher recorded value is a higher ceiling. Cost: Authored proposal: a recorded act for the Library elder that raises your value by 300 CP; not built in this slice." Ledger stayed "You owe the Library nothing." PASS.
- Ask the 1,000 CP formula: "Borrowed 1000 CP from the Sect Library. Total obligation left: 4,600 CP of 4,600 over 10 years (10 installments left). | Next installment: 460 CP, number 1, due in 360 days. | Installment 460 CP a year = 100 principal + 360 interest (simple, flat on the original 1,000). Interest accrued so far: 0 CP. Principal remaining: 1,000 CP." Four quantities distinct. PASS.
- Killing Life Curse (300 CP) after the formula: "Refused: Killing Life Curse | Credit never exceeds ... The zero-down loan is offered on a disciple's first exchange only (c0006 p33). | Something is still missing. | Route: A higher recorded value is a higher ceiling..." Refused as expected. Not tested before the formula.

## 3. Real mission, interest, insufficient repay (PLAYED)
- Start the mission at clock 01/04/999 about 09:01: "In progress: about 8 game hours left." Time passed only by the game's own clock (waiting in real time, 1 game min per second; the game offered no sleep or skip in the village: Rest buttons were 4 min each). Mission ran about 480 game minutes.
- 3a. The pane closed mid-mission; after reopen and PLAY the save restored (clock 15:47, "In progress: about 2 game hours left", mission state survived reload). Then waited about 130 s more.
- At 18:01 (about 9 game hours after start): "CP in hand: 4. Missions done: 1 ... Not started." PASS (5 less 1 lamp oil).
- Interest by the clock: 0 CP right after the grant (about 09:00); "Interest accrued so far: 1 CP" already at 15:47 and still 1 CP at 18:43, same game day (0.3 to 0.4 day elapsed). So it appears to round up (ceil) in display; expectation of about 1 CP per game day not confirmed as a second increment. NOT DONE: I did not wait the full game day (about 24 real minutes of page uptime) to see 2 CP; the pane closing made a long wait unsafe within the call budget. Flag: possible ceil at 0.28 day; worth a unit-test glance.
- Repay 460 with 4 CP: live-region text "You hold 4 CP and this payment is 460 CP. Nothing was paid." CP 4, installment 460 number 1, interest 1, principal 1,000, total 4,600 all identical before and after (string compare of the ledger). PASS. Note: the refusal text is in an aria-live region, not in the persistent ledger text.

## 4. Partial and full repayment (HARNESS-SEEDED, CP set to 5000)
Seeding: native Export blob text captured from the page (the pane cannot save downloads: Export creates an anchor with download "yet-another-idle-rpg 2026-10-24 15_14_03.txt" and a blob URL; I hooked URL.createObjectURL and read the same blob string, 161,976 chars, prefix YAIR-UTF8-1:), posted it to a throwaway localhost receiver, decoded/edited/encoded it with the project's own decodeSaveFile/encodeSaveFile (script in scratchpad/seed/seed.mjs, outside the tree), setting primordial_credit.cp 4 -> 5000, then fed that literal text to the game's native Import file input (set programmatically via a DataTransfer File, since the pane has no file picker). Import reloaded the page; "Save game version: v0.6". Same origin as step 3 (not a new port).
- Seeded import: ledger unchanged (4,600 / 460 / interest 1 / principal 1,000), "You hold 5,000 CP".
- Repay 300: "Paid 300 CP." Total obligation left 4,300 of 4,600, 10 installments left, Next installment: 160 CP, number 1, due in 360 days, interest accrued 1, principal remaining 1,000, CP 4,700. Matches expectation. PASS.
- Repay 160: "Paid 160 CP." Total 4,140, 9 installments left, Next installment 460 CP number 2 due in 720 days, principal remaining 900, CP 4,540. PASS. Oddity: "Interest accrued so far: 1 CP" is unchanged after installment 1 was paid (interest-first would imply accrued interest is consumed or the line is the simple-interest accrual since the loan date, not unpaid). Unclear, flag only.
- "Repay the whole obligation (4,140 CP)": "Paid 4140 CP." Ledger: "You owe the Library nothing. | Repay | Nothing to repay." CP 400 (4,540 - 4,140). Repay input and buttons gone; Held line kept. PASS.

## 5. Persistence (PLAYED)
Export in this pane = browser download of a text file (blob anchor), nothing visible in-page; I read the same blob.
- Open loan (after the 300+160 payments): captured Export A. Decoded: loan.paid 460, cp 4540, takenAt 518011752. Literal Import of that exact text, then PLAY: CP 4,540 and ledger string identical to the pre-export snapshot. Then page reload (navigate): CP 4,540, ledger identical. PASS.
- Paid-off state: Export B decoded as loan null, cp 400. Literal Import then reload: "CP in hand: 400", "You owe the Library nothing. | Repay | Nothing to repay." identical to the pre-export snapshot. PASS.
- Mid-mission reload restore also seen (3a).

## 6. Not tested / gaps
- Merit Pool, same-body restart, mobile, talent settling: excluded.
- Second interest increment by the clock (see 3): not observed; no day-boundary evidence.
- Screenshots: only 1536x864 14px; none at 21px; none at 1920x1080.
- Import used a programmatic file set, not a native file dialog.
- Fresh-origin: used 19931 throughout (it was new at start), not a second new port for the import.
- Process cleanup: static server 19931 and receiver 19940 stopped by PID; viewport reset to desktop.
