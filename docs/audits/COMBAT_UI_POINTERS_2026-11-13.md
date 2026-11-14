# Combat palette UI pointers · 2026-11-13

A pointer packet for [CBD256](../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md#round-28-crowds-in-one-place-the-scene-as-the-place-up-close-and-what-the-screen-pattern-gives-other-activities-2026-11-13): where CBD247 to CBD252 meet the rules in [DESIGN.md](../../DESIGN.md), [UI rules](../UI_RULES.md) and the [UI design core audit](UI_DESIGN_CORE_AUDIT.md). Findings and proposals. **The UI owners decide what is adopted;** nothing here changes those files, and no code is claimed. Target viewport for the sketches: desktop, about 1366 to 1920 px wide (the standing UI priority); mobile is deferred.

## Pointers

| CBD | Proposal in one line | Existing rule it extends | Gap it fills | Found? |
| --- | --- | --- | --- | --- |
| 247 | A decision belongs in the Focus panel whatever raised it; Reports keeps what happened; Place is the scene | DSG1 (You and Focus as twin panels), UR41 (choose the navigation scope; Focus can be replaced), UR141 (a panel holds what its name says), DSG11 (one home per fact) | No rule says that a non-fight decision (a letter, a crossroads, a brew) takes Focus the way a fight pause does | **Extends a rule** |
| 248 | The policy page generalises to any repeating activity (wants, standing orders, "otherwise", ask-first, reasons) | UR79 (one shape per kind: policies use the policy row), coverage-plan B5 (policy row) and M1, M7, M15 in its map (pace dial, favour policy, battle policy) | The row exists per feature; a full page shape reused across activities is not stated, and neither is retune by example | **Extends a rule** |
| 249 | One "waiting on you" list across fights, routines, letters and visitors, with what each waits for and what happens if left | UIV3 (everything under way in one list, with time left), UR87 (lives list: what waits for each life), SUI8 (several scenes queue in an upcoming strip), O3 in the audit (a day page: what is due, who wants you) | UIV3 lists work **under way** (clocks). Nothing lists items **paused for an answer**, with a default if ignored | **Fills a gap** (adjacent rules found) |
| 250 | One what-changed block after any activity, sized by the stakes | UR81 and the B1 return note (a stop or an absence names what happened and why), UR92 (history lines linked to causes), RPT6 and RPT8 (results say what, why, cost and who saw), LTU3 (return digest and result notes), UR64 (condense repeats) | The shared shape for "after any activity" is stated per surface; "one line for a routine day, itemised for a weighty one" is a sizing dial nobody names | **Extends a rule** |
| 251 | A fight takes Focus when it needs room and parks what was there; a weighty fight takes the full screen | UR5 (weighty, rare decisions get a full screen), UR69 (regions lend space at stable moments, "outside a fight"), UR52 (nothing steals focus or replaces an inspected subject), UR154 (keep the player's place through live changes) | Parking: a fight arriving mid-task and the return note saying what it changed ("the brew sat eleven minutes too long") are not covered. UR52 forbids stealing, which this proposal must meet by asking or by a stated trigger | **Fills a gap** (needs a UR52 exception, with a reason) |
| 252 | The four answers (works, might work, does not because, not yet) and the compose row serve making, talk and exploration; one wish list | UIV1 and UR128 (a blocked control shows its reason beside it), UIW5 (a blocked reason names the missing thing), UR140 (one question, one answer), CX6 (the wish list, in the palette) | "Might work and trying is how to find out" and "the game has no effect for it yet" are not states in UR100's state sheet; the cross-activity wish-list ledger has no owner | **Fills a gap** (adjacent rules found) |

Reading: all six found adjacent rules. 247, 248 and 250 extend an existing rule. 249, 251 and 252 fill a gap next to existing rules, and 251 carries a conflict with UR52 to resolve. Read 251 before accepting 249, since the item a fight parks is what the waiting list lists.

## Sketch 1: a "waiting on you" list (CBD249)

Placed in the existing work line area (UIV3), about 480 px wide, folded to a count when long. Wording is a draft; the owners and the prose rules (PRS1 to PRS8) decide it.

```
WAITING ON YOU (3)                                                          [fold]
 1  Duelling club, Thursday       a bout is paused at your move     -> asks: what next?
    If left: Flint takes the pause as a yield, in 4 min.
 2  Letter from Neville          wants an answer by Saturday        -> asks: reply?
    If left: it goes unanswered, and he writes less.
 3  Brew on the hearth           needs you at 20 min (11 min ago)   -> asks: take it off?
    If left: it spoils at the stated time. Not in the cautious default.
Under way (2): reading in the library, 40 min left; walk to the Burrow, 25 min left.
```

Notes: the first column is what raised it; the second is what it waits for; "If left" is the cautious default where there is one (CBC25) and says so where there is none. The list sits above the under-way list so the unanswered come first, and it is the first thing a return shows (CBD129).

## Sketch 2: a what-changed block (CBD250)

Under the activity's own result in Reports, sized by the stake. A routine day is the first line only.

```
WHAT CHANGED   Thursday evening, the duelling club
 + Gained   Flint backed off; Dumbledore's note on your wand-work             [see record]
 - Spent    7 stamina, the borrowed wand's goodwill                           [see record]
 ! Hurt     a sprained wrist, 2 days to mend                                  [see record]
 ? Learned  Flint drops his left shoulder before a swing                      [see record]
 @ Seen by  twelve onlookers, Snape and Flitwick; Flitwick has a question     [see record]
Routine day (the same block, collapsed):  A quiet day: 3 chapters read, 6 coins earned.
```

Notes: each line links to its record (UR92); the symbols are drafts, not DSG4 glyphs. "Seen by" carries the witness record (CBD180).

## What I did not check

- Whether any of these exist in a branch other than the working tree of 2026-11-13; the rule texts were searched by grep, not read whole.
- DESIGN.md and UI_RULES.md carry a rule status per line (adopted, proposed, in use as the default). The codes above are quoted regardless of status; the owners should check each before building on it.
- No screen was built or measured; the sketches are plain text.
