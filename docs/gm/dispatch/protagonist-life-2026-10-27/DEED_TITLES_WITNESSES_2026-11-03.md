# Deed titles that need a witness: Klein Moretti (SLC122, design pass, 2026-11-03)

**Status: proposal under AD32.** Nothing here is a decision, an implementation or a run. Design only: no file under `src/` was touched, because the SLC121 owner is editing `src/titles.js` in a separate worktree. Owners read: [SLC112 and SLC115](../../../SKILLS_AND_LEARNING_CONSIDERATIONS_2026-10-18.md#round-6-2026-11-03-milestone-ladders-titles-and-perks-in-a-lead-s-playthrough-more-skills-proposal-only), [SLR40-SLR43](../../../DOMAIN_RULES.md#titles-skills-and-effect-causes-2026-10-21), [Recovered Corc round 6](../../../SKILLS_AND_TALENTS.md) (recognition and authority mode), `src/titles.js`, `src/person_memory.js`, `src/crowd_memory.js`, `src/person_standing.js`, `src/life_record.js`, LSD301, LSD352, LSD373.

## 0. Reading and lead

**Lead.** Klein Moretti (Lord of the Mysteries). [LEAD_LIFE_GUIDE](../../../LEAD_LIFE_GUIDE.md) holds no ranked list of leads; its "current authorized execution" line names the Klein full-journey campaign, and the guide's chapters are all LOTM-first. I read that as the first-ranked lead. Playable ground already built is KJ1 to KJ3Z (English v1 to ch54), so every deed below is one the engine can already stage in Tingen.

**What a witness is here.** No new witness system. A recognizer is a person whose memory holds an episode about the lead's deed fact (`src/person_memory.js`, kinds `witnessed` and `told`, source `saw` or a named teller, with certainty and feeling). Crowd scenes already promote one witness per scene and write a group impression (`witnessScene` in `src/crowd_memory.js`). A group impression carries no fact pointer, so by default it cannot recognize a deed; a named or promoted person can.

**Sealed secrets.** None used. All three deeds are public Tingen conduct. Nothing about any sealed fact (by id or route) is needed, and the titles' texts must stay free of them.

**Default, dial, reason (whole design).** Default: a deed title is granted when the deed's own threshold is met and at least one recognizer holds a credible episode of it. Dial: how many recognizers, which routes count, minimum certainty, and whether a world grants the same title with no recognizer (a system window, per the SLC115 dial). Reason: SLR42 splits what a title recognizes from what it supplies, and a designation is a public fact, so someone has to know.

## 1. Three deed titles

Shared columns: *Recognizes* is the deed; *Supplies* is what the title itself adds. Per SLR42/SLR43 the competence stays with the skill, and the title adds no second copy of any gain. All three carry **no bonus** by default (like `village_neighbour` in `src/titles.js`: G2 recognizes a standing, supplies nothing).

### T1. Read True (Divination, the querent confirms)

| Field | Content |
|---|---|
| Deed | Klein gives a querent a stated divination result (the existing attempt step with status `signal`, see `src/cast_divination_adapter.js`), and the outcome later matches what he said. The counter is the number of such matched readings (proposal: 3). |
| Recognizer | The querent, plus at least one other person who holds the result. Route: the querent sees the outcome (`witnessed`, source `saw`) or is told it by someone who saw it (`told`, with `tellMemory` loss). The Divination Club of ch52-54 (the `members`, `room` and `booking` acts in the KJ3Z pack) supplies named holders; a crowd's anonymous impression does not count. |
| Recognizes versus supplies | Recognizes: readings that came out as stated, known to others. Supplies: nothing of its own. The divination competence lives in the skill and the lead's Spirit Vision means (SLR40); losing the name leaves it intact (SLR42). Dial: a club may offer a booking to a title holder as a different, real invitation effect (CRL42 recognition mode). |
| Existing consumer | Certain: the Titles panel row and `titleBonuses` (empty bonus). Proposed, not verified: a booking/fee read in the club acts using `standingView` or `reactionLine` (`src/person_standing.js`, `src/person_memory_effects.js`), which already derive a person's stance from episodes. See G2. |
| Canon strain (SLC115) | The pack's read range names no title for this deed. Canon's Sequence 9 designation for Klein's pathway is a rank, not a deed title, and is held on canon dates by the pack; T1 neither grants nor replaces it. If a later volume names a designation at the same moment, canon is the baseline and T1 is recorded as strain, and is not silently granted or erased. Checked by pack and receipt grep only (G6). |

### T2. Steady on the Watch (Patience, the logbook keeper)

| Field | Content |
|---|---|
| Deed | Klein stands the church's night watch to the end of the hour, several times (the `cold_room_watch` mission in `src/book_world_lotm_merit.js`: 60 minutes, "not logged as done until the hour ends"). Counter: logged watches (proposal: 5). Patience, from the SLC121 Sleeping and Patience slice, is the skill that trains during the hour. |
| Recognizer | Warden Hale, the issuer, who enters the watch in the log. Route: `witnessed` (Hale present at hand-over) or `told` (the entry read by the captain). A watch Hale never logs does not count. |
| Recognizes versus supplies | Recognizes: reliability across logged watches. Supplies: nothing new. Merit already pays the assignment (counter `earned`); the title must not pay merit again (SLR43). Patience gain stays with the skill record and survives the title's loss (SLR42). Dial: a church may list the title in a handover check, which would be a separate institutional entitlement with its own cause. |
| Existing consumer | Certain: merit store and mission ledger (`NIGHTHAWKS` in `src/book_world_lotm_merit.js`), which can show the title next to the logged count; the Titles panel. Proposed: `clearanceFor` takes a `known` argument (`src/book_world_lotm_clearance.js`), so a captain's confidence could be read there. Not verified (G2). |
| Canon strain | Canon has churches paying merit and checking it before a Sequence 8 handover (the merit file's own evidence note). That is merit, not a title. T2 is not a handover gate; a church that wants one can read merit, or this title, as a dial. Where canon dates the handover earlier than five logged watches, canon wins and T2 stays unearned (strain recorded, SLC115). |

### T3. Returned in Full (a conduct deed, no skill)

| Field | Content |
|---|---|
| Deed | Klein returns a found wallet with its contents and the owner checks it (the KJ3Z `owner`, `verify`, `return`, `settled` acts). Counter: wallets returned in full that were verified (proposal: 1). This is the case where the deed trains no skill and exists only as recognition. |
| Recognizer | The owner, who counted it. Route: `witnessed`, source `saw`, or `told` if the finder is described to someone else. |
| Recognizes versus supplies | Recognizes: a stranger's finding of trust. Supplies: nothing of its own. The practical effect already exists as an episode (`helped`) that `derivedBond` and `debtOf` read (`src/person_memory_effects.js`, `src/person_loyalty.js`). The title only names it, so it must not add a second bond bump (SLR43). |
| Existing consumer | Certain: the Titles panel row. The bond effect is already read through the episode, not the title. A Tingen reputation region does not exist yet (`character.reputation` has a `Village` entry only, see G8). |
| Canon strain | None expected; canon does not name this. The KJ3Z receipt records Dewey and the owner's settlement as authored play; a canon title, if the pack ever adds one for the same moment, is the baseline. |

## 2. The witness-free case

**Scene.** Klein's divination reads true but the querent never learns it, or he stands five watches Hale never logs, or he leaves a wallet where no one sees him.

**Default behavior.**
- The skill trains. Patience and Divination gain through their own records as usual. Titles do not gate skill growth.
- The deed counter advances (it reads the skill/log owner).
- No title is granted: no episode about the deed fact exists in any holder, so `recognitions` is empty.
- No second reward: merit is paid by the mission, bonds by episodes, and neither depends on the title.

**How the record shows it.**
1. The Titles panel row shows the counter met and the title unheld, with the line "Done, and known to no one yet." (a proposal for the `awaiting` flag in section 3).
2. The skill inspector (SLC118) lists the unwitnessed work: "Patience: 5 watches, 0 logged. No recognition."
3. `src/person_memory.js` holds no episode with the deed fact, so every person-facing read (`standingView`, `reactionLine`) stays silent about it.
4. `src/life_record.js` gets no `career` milestone by default. The life record is "a lossy biography, never an authority for rewards", so it must not be the evidence for or against a grant. Dial: a quiet `memory` line ("I kept the watch alone") is a fair taste choice for a lead who values it; it carries no reward.

**It can still become recognized.** A later `told` episode (Hale reads the log, the querent hears of the outcome from a neighbour) satisfies the recognition. The title is then granted with the date of the recognition, not of the deed. Reason: the recognition is what makes it a designation. The deed's own date lives in the episode.

**Forgetting.** If compaction later folds the episode into an impression (LSD360), the title stays and its effects stay (SLR42). The title is a recorded recognition, not a live read of memory (the SLC112 rule: "a title is a recorded recognition").

## 3. The change needed in `src/titles.js` terms (for the SLC121 owner)

Today a row is `{id, family, name, counter, at, text, bonus?, requires_counter?}`. `newlyEarnedTitles(titles, counters)` grants every row whose `counters[row.counter] >= row.at`, and `grantEarnedTitles(titles, counters, at)` stamps `{at}`. Both grant paths call it: `refresh_titles` (`src/main.js`, around line 9249) and `stageTitleRecognition` (`src/absorb_p23/host_joins/long_life.js`, line 11). Counters come from `readTitleCounters()` in `src/main.js`; nothing else enters. A recognizer has no way in.

Proposal, with default and dial:

1. **Row field.** Add optional `deed: {id, recognizers: 1, routes: ['saw','told'], minCertainty: 60}`. Rows without `deed` behave exactly as now. The counter and `at` still say what the deed amounts to; `deed` says who must know it. Dial: `recognizers`, `routes` and `minCertainty` per world.
2. **Third argument.** `newlyEarnedTitles(titles, counters, recognitions = {})` and `grantEarnedTitles(titles, counters, at, recognitions = {})`. A row with `deed` is earned when its counter is met and `recognitions[deed.id]` holds at least `recognizers` entries. With no argument (the legacy call shape), a deed row cannot be granted. A caller that forgets to pass recognitions then fails closed.
3. **Where recognitions come from.** A small reader outside `titles.js` (next to `src/person_standing.js`, with the memory owners) scans `readMemories` for episodes about the lead whose `fact` matches the deed fact id, kind `witnessed` or `told`, route in `routes`, `certainty >= minCertainty`, and returns `{[deedId]: [{holder, route, day}]}`. `titles.js` stays pure, with no memory import (the AR3 one-owner idea: memory owns who knows, titles own what is held).
4. **Both grant paths pass it.** `refresh_titles` and `stageTitleRecognition` take the reader's result. Nothing is stored by the reader; it is derived each call, and `titles[id]` makes the grant idempotent.
5. **Save shape.** Default: keep `{at}` only. Recognizer detail lives in the memory episode and, for display, in a `career` entry written to `life_record`. No migration. Dial: add optional `by` (holder id) and `via` to the record, kept by `normalizeTitles` when valid, if the panel must name the recognizer after memory compaction. That would change persistence and needs the AGENTS.md compatibility decision.
6. **View.** `titleView` rows for `deed` titles gain `awaiting: true` when the counter is met and the title is not held, so the panel can say "known to no one yet". `describeTitleBonus` is unchanged.
7. **Catalog home.** The current catalog is one global list. Klein's rows belong with the LOTM pack. Default: a per-world registration seam that merges rows into `title_catalog` at world load (see G7). Dial: put them in the global catalog with an id prefix if the SLC121 owner prefers a single list for now.

### Failure scenario to pin as a test (title: "an unwitnessed deed trains the skill and grants no title")

1. Fixture: a fresh life with the T2 row (`counter: 'logged_watches'`, `at: 5`, `deed: {id: 'deed.watch', recognizers: 1, routes: ['saw','told'], minCertainty: 60}`) and counters at `logged_watches: 5`.
2. Call `newlyEarnedTitles(titles, counters)` with no third argument: expect `[]`.
3. Call it with `{}`: expect `[]`, and `titleView` shows `awaiting: true`, `held: false`, `progress: 5`.
4. Call it with one `told` entry of certainty 40 (a tell that lost too much, per `tellMemory`) or an `impression`: expect `[]`.
5. Call it with one `witnessed` entry, certainty 70, holder Hale: expect `['<id>']`.
6. `grantEarnedTitles` stamps `{at: recognition minute}`. Run it again and run a `normalizeTitles` round trip (a reload): expect `[]` the second time and the same record.
7. Remove the episode (simulate compaction): the title stays held and `titleBonuses` is unchanged. The skill record still holds its level.
8. Rust the skill below the peak: the title stays (SLC112, SLC118 scenario).

Pass means the title is granted exactly once, after a credible recognition, not from a legacy two-argument call, and survives reload and forgetting. The same fixture with a counter below `at` and a valid episode must also grant nothing (the recognition cannot substitute for the deed).

## 4. Gaps

| Code | Gap | Note |
|---|---|---|
| G1 | The counters named here (`matched_readings`, `logged_watches`, `wallets_returned`) do not exist. Divination has a status step but no "outcome later matched" fact; the watch mission has no count of logged completions; Patience is SLC121's skill and not built. | Each needs a producer in its own owner before a row can read it. |
| G2 | The consumers for T1 and T3 beyond the Titles panel are proposed, not read in code. T2's clearance `known` argument is proposed. | By FLR4 a title with only a panel row is "a renamed meter", so each needs a real read before it counts as used. |
| G3 | Crowds promote one witness per scene and the group impression has no fact pointer. | A deed seen only by a crowd gives no recognizer by default. A world may choose to let a group impression above a count recognize, with a reason. |
| G4 | The deed fact id scheme (`deed.<name>`) and who writes the first episode (the act that stages the deed) are not designed. | The episode needs a producer in the act or the witness scene. |
| G5 | Placeholder numbers: counts 3, 5 and 1, `minCertainty` 60, `recognizers` 1. | Calibrate against the lore's stated numbers where it gives any (AD49). |
| G6 | Canon check was by repo grep of receipts and the merit file, not a reread of the source. | A source read could find a title I missed. |
| G7 | Title rows are global in `titles.js`; a per-world registration seam is not designed. | Needs the SLC121 owner and the world pack owners. |
| G8 | There is no Tingen reputation region (`character.reputation` shows `Village`). | T3's reputation read is not available. |
| G9 | Two grant paths must both take recognitions. | A miss on `stageTitleRecognition` would silently disable deed titles on the long-life route. |
| G10 | Coordination with SLC121's one deed title: its owner should pick which of T1 to T3 is the slice's title, or a Sleeping/Patience one, and confirm the shape. | The change in section 3 touches the file they are editing. |
| G11 | Text: the three titles' player-facing description needs the UR70-UR75 shape. | Wording here is a placeholder. |
| G12 | Not exercised: no test, build or browser run. | Design only, "agent-reviewed on paper, nothing run". |
