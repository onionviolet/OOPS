# Polyjuice slice: more to consider, round 1

2026-10-22. **PROPOSAL.** Saves findings only; the LATER rows are not authorized work.
Extends [CHECKPOINT](CHECKPOINT.md). Evidence: extracted B2 text (page tags), the
[Hogwarts games findings](../../research/hogwarts-games/FINDINGS.json) F1-F15 (verified
page/wiki summaries, not game builds), MR1-MR36, AD6-AD8, AD33.

## ACT NOW (done this round, data only)

| Code | Finding | Change |
|---|---|---|
| A1 | The window at p481 shows Hermione adding more lacewings during simmering. The slice adds every input at once, which is a simplification of a shown fact. | Added evidence row `late_lacewings` and unknown `staged_additions`; the pack states the simplification. |
| A2 | Three more shown facts the design touches were missing: secret brewing site and teacher-note book access (p427, p432), own clothes not fitting the new body (p487-488). | Added rows `hidden_brewing`, `clothes_misfit` so later work cites them. |
| A3 | "Full moon" is the game calendar's `Full` phase (about a week wide); the novel gives no window. | Added `orig.moon_window` so the width is a labelled dial. |

Pack, registry and HP tests re-run: 29 pass. Full suite not re-run (data rows only; fingerprint changes by design).

## ACCOUNT FOR NOW (constraints on the next slice, no feature work)

| Code | Finding | Constraint |
|---|---|---|
| C1 | **No reader for the transformation (MR32).** Drinking binds a donor and writes ledger and trust, but nothing else reads "you are X". | Before calling the slice more than a craft proof, add one consumer: a gate or scene that checks the bound donor (an errand, a place only the donor may enter, a conversation). Use the P9 first proof: deliver institutional stock, receive a funded share or lesson. |
| C2 | **Knowledge gate missing (AD6, MR10).** The panel lists all six slots from the first screen, so the player "knows" the recipe without a route. Canon route: Restricted Section book needs a teacher's note (shown p427). | Treat the formula as knowledge with routes (borrow the book with a note, copy, be taught, trial). Until then the panel is a recipe-known start; record it as a start condition, not a given. |
| C3 | Slice owns its purse and lots; nothing appears in Inventory or main money. | When S1's craft product registry lands, move lots and doses onto the shared item carrier (MR29, `craft_product_registry`) instead of a second inventory. Coordinate with S1 before touching it. |
| C4 | Ledger is capped at 64 entries, so very old aftermath scrolls off. Standing and debts persist, the prose does not. | Keep the cap but archive counts per kind before dropping, or raise the dial; decide when the ledger gets a reader. |

## Perception: who knows what (MR1, MR31, AD7)

| Observer | Knows now | Should also perceive (not built) |
|---|---|---|
| Player | Claims on lots, witnessed harvest moon, cue of a batch (muddy brew; original looks thin and grey), own transformation, assay results | The glass reacting when a sample goes in: hiss, froth and a colour per sample (shown p486). It would be a free cue that differs for a bad batch, a cat hair and a good sample. Taste and pain on drinking (shown p487). |
| Donor | Nothing until a discovery draw fires; then trust drops | Whether the donor was present, saw the double, or was asked (consent route); a donor who consented should not lose trust. |
| Potions master | Loan agreements and, after a draw, theft | Inventory counts of the private stores; who has the book. |
| Classmates and staff | Nothing | The double acts out of character; clothes do not fit (p487-488); the one-hour limit is public canon but the potion's existence is not. |
| Other worlds | Nothing | A Polyjuice dose in another world stays inert unless a directional law says otherwise (MR14). |

The hidden draws (lot provenance, sample species and donor, batch grade, notice, discovery) all live in the save as truth. A truth inspector for authors is a dev view only and must not appear in reports (sealed-secret rule).

## How the Hogwarts games cover this, and what that suggests

Sources are the saved findings only; they do not establish the mechanics of the
Legacy or Mystery potion screens, so treat the right column as proposals.

| Game finding | Their approach | Fit for this slice |
|---|---|---|
| F5 Mystery lessons | Timed star tasks, short checks, tracing or potion gestures wrap a lesson | Optional "quick / guided / deep" depth (MR18) could wrap stir and add steps; the resolver stays one. Do not adopt real-time energy. |
| F4, F14 energy timers | A real-minutes energy clock stops the story and is criticized | Already avoided: stew and simmer run on played game time, so idle and away work. Keep it that way. |
| F8 Legacy Room of Requirement | Potion and plant stations in a productive room with local permissions | Matches the cauldron, stew pot and school-versus-owned stock. A room with permissions is a good future host for the bench. |
| F9 creature care to materials | Feeding and brushing yield crafting inputs | A later source for bicorn horn or boomslang skin (a living creature route, MR27) instead of only stores. |
| F1 spells learned then used elsewhere | Learning a spell changes verbs available outside class | Potion knowledge should likewise unlock use outside class (the C1 reader). |
| F6 House Cup, F7 friendship encounters | Points and recurring friend scenes | Donor trust is a small friendship channel; a house or lesson score could read brewing outcomes. |
| F12 graduation keeps progress | Continuity transition, not reset | The slice's saved ledger and standings should survive any later term or life change. |
| F15 combine a visible term with useful subject verbs | Idle timetable plus a lesson join | The strongest fit: a term timetable with a potions lesson as the host that supplies the book, the cupboard and the master. |

What the games do not give: an exact canon formula, ingredient identity,
provenance and truth-versus-knowledge. That is the slice's contribution, and the
reason the source windows were pinned instead of borrowing a game menu.

## LATER / DELEGATE (not authorized)

| Code | Item | Level / effort | Done check |
|---|---|---|---|
| L1 | Staged additions, stir and heat verbs (p481, p432 order), each with a declared state effect (MR16/MR17) | Sonnet, after a source read of the later-chapter windows; medium | A near-miss order produces a labelled outcome; verbs absent from the source stay original |
| L2 | Glass reaction cue and drinking sensations as observer cues | Sonnet; small | The cue differs for good, degraded, original and cat samples without naming the grade; Save/reload keeps it |
| L3 | Recipe knowledge routes (C2) and the book with a teacher's note | Sonnet; medium | A fresh start cannot brew until a route is used; knowledge persists across Import |
| L4 | Transformation reader (C1) plus clothes that do not fit (p487-488) and a donor-presence check | Sonnet; medium; needs a host scene | A gated place or errand accepts only the bound donor; aftermath differs if the donor was present |
| L5 | Diversion and hidden-site means for the private stores (shown p454 onward), creature-care sources (F9) | Sonnet; medium; read p454-460 first | A diversion route exists with its own consequences |
| L6 | Join to native items and money through S1's registry (C3) | Sonnet; medium; after S1 merges | Doses appear in Inventory; purse reads native money; import preserves keys |
| L7 | Author truth inspector as a dev-only view | Haiku; small | Hidden values reach no report or UI text; test greps output for sealed terms |
| L8 | Full-play browser evidence for the unverified paths (degraded, cat hair, loan, notice, assay, scour, free mixing) | Haiku; small | Each path in the journey script with Save, reload and Import |

Round 2, if asked, would read the p454-460 diversion window and the Hogwarts
Legacy potion-station evidence directly rather than through the saved findings.
