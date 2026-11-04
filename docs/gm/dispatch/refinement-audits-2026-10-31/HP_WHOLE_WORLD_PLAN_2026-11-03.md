# Harry Potter lead run: whole-world window plan (proposal, 2026-11-03)

Proposal under AD32; nothing here is accepted except the instruction in [USER_VISION](../../../USER_VISION.md#harry-potter-protagonist-playthrough-starts-2026-11-03). Follows the [gap probe](HP_LEAD_RUN_START_2026-11-03.md), whose G1-G12 this plan places against windows. Rules applied: AD44 (lead first), AD45, AD46, AD48, AD51 (shared seams validated by a second world), LSD216 (planning must not outrun playable change). HP windows run beside Klein's route and the B2-B12 lane and take no file those lanes own.

## Why this exists, and the miss

The probe listed gaps but did not say which window first needs each, and Weibao asked on 2026-11-03 whether sectioning the whole world should have come earlier. Advisor read: the book 1 map was due with the probe, since book 1 was already read and the map costs nothing. Detailed plans for books 2-7 were not due (shards ungraded, LSD216). Building window 1 first was right (one playable slice at a time).

Cost of the late map: the own-holdings track (O1/O2, P1, P2) grew from a window-1 symptom. P2 covers the school and trade lives, which are off Harry's path. The work fixes a real shell leak and was approved step by step, so it continues. A map made earlier would have ranked it below window 2. Default: P2 and P3 stay as bounded side work, dial: they pause if a lead window is blocked on a shared file, reason: the lead is the main line (AD44).

## Book 1: shard facts (read from the shard headers this session)

All nine shards were read by claude-haiku-5-5 on 2026-10-28. Chapter titles below are the book's own and used as labels only.

| Shard | Chapters | Scenes | Grade, lint | Note |
| --- | --- | --- | --- | --- |
| hp1c001 | 1-2 | 8 | B, pass | Chapter 1 has no lead scene; all 8 scenes are chapter 2 |
| hp1c003 | 3-4 | 35 | B, pass | Name accuracy 0.989 |
| hp1c005 | 5-6 | 14 | B, pass | |
| hp1c007 | 7-8 | 12 | B, pass | |
| hp1c009 | 9-10 | 14 | B, pass | |
| hp1c011 | 11-12 | 12 | **C, lint fail** | Failure reason not recorded in the header or in `hp1c011_m13_review.json` (empty list). Re-read or repair before window 8 |
| hp1c013 | 13-14 | 25 | B, pass | |
| hp1c015 | 15-16 | 25 | B, pass | |
| hp1c017 | 17 | 7 | B, pass | Name accuracy 0.976 |

Grade is the shard header's own; spot checks are 0 for all nine, so B means lint plus locator and name accuracy, not a human read.

## Book 1 windows (proposal)

A window is one playable slice with its own done check (AD43 floor: rebuilt bundle, fresh origin, 1920x1080 at 14/21 px, save, reload, literal Import; anything not run is "implemented, below floor"). Reading cost is $0 for every window below (book 1 is on disk). Gap codes are from the probe; "seam" is the shared owner the window tests as the second world (AD51).

| Window | Source | Boundary | Gaps first hit | Seam tested | Status |
| --- | --- | --- | --- | --- | --- |
| W1 | hp1c001, ch2 | Cupboard waking to the cupboard that night | G2, G4, G11, G12 | child body under custody, locked options, free act | Done, agent-verified ([receipt](HP_WINDOW1_RECEIPT.md)). G4: the glass vanishing is a free act with no method and no cost. G12: the hissing voice is "you could have sworn", the word Parseltongue is not used |
| W2 | hp1c003, ch3 | Summer holidays, the letters, the hut on the rock (scene order in shard) | G10 owl post, G7 pounds | delivery channel for letters | Done, agent-verified ([receipt](HP_WINDOW2_RECEIPT.md)). Split at the chapter 4 boundary: scenes 00301-00323 are 15 acts ending at the knock; scene 00324 starts W3. G10: receiving side (default, reason: no carrier is seen in ch3), no delivery owner in code (LSD446 is a LATER lane), the carrier first appears in W3. G7: no money or items. Clock labels unproven (fill minutes) |
| W3 | hp1c003, ch4 | The keeper of keys, the first magic told to him | G8 fame as knowledge asymmetry, G7 | observer projection (strangers know him) | Done, agent-verified ([receipt](HP_WINDOW3_RECEIPT.md)). 12 scenes, 12 acts, 3 locked rows. G10: the carrier (an owl) is seen; no new seam, reader-level test, options in the receipt. G8: told, not known; back-test passes, NPC-side fame waits for W4 |
| W4 | hp1c005, ch5 | Diagon Alley, the vault, the wand shop | G6 individual wand (LR2-H1 reopen trigger), G7 vault Galleons | per-owner currency, wand as one instrument | Done, agent-verified ([receipt](HP_WINDOW4_RECEIPT.md)). 9 scenes, 21 acts, 2 locked rows. G7: one Knut integer per holder (purse, vault, Hagrid's coat, wandmaker), ladder is pack data, wand 7 Galleons; G6: use, answering and possession are three states in time, Hagrid's kept pieces are the counterexample; G8: NPC-side knowledge exists and a load-time guard keeps it to the people in the act; back-test rerun passes with it. Prices other than the wand are fill |
| W5 | hp1c005, ch6 | Platform and the train | G5 school-year calendar | calendar by order and events, no invented year | Proposed |
| W6 | hp1c007 | The Sorting, first days, the potions master | G9 Sorting with a locked alternative | locked-option row at a canon choice | Proposed |
| W7 | hp1c009 | Flying lesson, midnight duel, Halloween | house points (Merit shape), troll | institution currency, danger without a power flag | Proposed |
| W8 | hp1c011 | Quidditch, the mirror, the library | none new | repair the C-grade shard first | Blocked on re-read or repair of hp1c011 (reason unknown) |
| W9 | hp1c013 | The stone, the egg, the forest detention (as the shard orders them) | none new | long-arc clue ledger | Proposed. 25 scenes, may split |
| W10 | hp1c015-017 | Trapdoor to the end of term | none new | multi-actor climax with a canon outcome | Proposed |

Default order is the book's, dial: a window moves when a shard is blocked (W8), reason: canon order is the lead run's spine. Splits are decided when a shard is opened; this table gives the sequence and the first-hit gaps, not scene counts.

## Gaps not yet placed

| Gap | Where it waits |
| --- | --- |
| G3 prologue and the ten-year skip | Narration grain; settle before W3 so Harry's notebook cannot hold reader-only facts |
| G1b crosswalk residue: only 4 places and 4 people mapped (O5), thin cast (O3), canon names in tracked G2 files (O4, CLR3 residue) | Default: the window's builder maps the ids it touches (reason: mapping everything up front would outrun playable change, LSD216); dial: O4 is a cleanup before a commit, since it is tracked text (CLR3) |
| Own vitals readout (P4 of the own-holdings plan) | After P2 and P3; not needed by W2-W7 |

## Books 2-7 (coarse on purpose)

Shards on disk: book 2 about 18, book 3 about 19, book 4 about 34, book 5 about 38, book 6 about 30, book 7 about 34 (file names in the lead-run folder). Quality is unchecked and chapter spans are not read, so no windows are cut. Default order for each book: header grade check, chapter span and scene count, then a sizing pass, then windows. Dial: a book is cut earlier only if a window of the previous book needs its seam. Reason: LSD216 and the fact that W1-W10 will change what later books need.

| Book | Pressure it adds (from the series, to be checked against the shards) |
| --- | --- |
| 2 | Repeating school year with a new calendar start; a hidden threat the lead cannot name |
| 3 | An outside agent hunting a person; third-party knowledge the lead lacks |
| 4 | A tournament with fixed tasks and public scoring; foreign delegations |
| 5 | An institution turning on him; examinations; underage-magic enforcement |
| 6 | Lessons from a second teacher; a private hunt that is not school |
| 7 | Leaving school; a long hunt away from every institution; the end |

Pressures are my reading of the series from general knowledge, not from the shards, and need their own check before they drive a design.

## Reconciliation of this plan

| Claim | Evidence reached | Gap |
| --- | --- | --- |
| Shard chapters, scene counts, grades | Read from the nine `hp1c0*m_header.json` files this session | The header grade is not a human read; spot checks 0; hp1c011 lint failure reason not found |
| W3 done | [Receipt](HP_WINDOW3_RECEIPT.md): 12 of 12 acts native, reload and Import digests match | Agent-verified, not human-reviewed; not committed; tracked dist not rebuilt |
| W2 done | [Receipt](HP_WINDOW2_RECEIPT.md): 15 of 15 acts native, reload and Import digests match | Agent-verified, not human-reviewed; not committed; tracked dist not rebuilt |
| W1 done | [Receipt](HP_WINDOW1_RECEIPT.md): 8 of 8 acts native, reload and Import digests match | Agent-verified, not human-reviewed; not committed; tracked dist not rebuilt |
| W2-W10 splits and gap placement | My reading of the shard order and the probe | Not checked scene by scene; to be settled when each shard is opened |
| Books 2-7 pressures | General knowledge | Not checked against any shard |

## More to consider (this round)

ACT NOW (done): built the book 1 map from the headers; found the C-grade shard before it blocks W8; checked the window-1 receipt for G4 and G12.

ACCOUNT FOR NOW:
- Park P2 and P3 as side work with the stated dial (above).
- W2 and W3 both come from a 35-scene shard; the builder must decide the split on scene order, not file name.
- The G3 narration decision is needed before W3, not after.

LATER / DELEGATE:
- Repair or re-read hp1c011 (Sonnet, high effort, done check: lint pass and grade B).
- Spot-check one scene per remaining shard by hand (cheap, local, haiku can list candidates; a person or Sonnet judges).
- A sizing pass for books 2-7 once W5 is through the school gates.
