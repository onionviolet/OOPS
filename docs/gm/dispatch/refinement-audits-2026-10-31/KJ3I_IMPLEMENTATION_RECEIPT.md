# KJ3I implementation receipt: the diary pages, the issue of items and Leonard Mitchell

2026-11-02. Authorized by the coordinator's window brief after KJ3H. **Agent-verified, not human-reviewed (AD43).** Not committed, not installed, no personal save touched. Content-only: bundle is KJ3E's (`919b17d3…`); pack sha256 `b576bd9c…` (revision `cast-reviewed-kj3i-cf4f64532a54613f`, carrying KJ3F-KJ3I). Private files: `docs/research/novels/lord-of-mysteries/private/kj3i-ch21-2026-11-02/`.

## Scope and source

English v1 ch21 P001-P066 (official edition, sha256 `395c9d9f…`), read in full from the sweep shard 2 text and checked against the window brief. Six native intents (the brief's five, with the last one split in two): read the diary pages, cover and ask for more, the bullet type and holster record, the issue and fitting, heading for the stairs, meeting Leonard Mitchell. Next boundary: ch22 P001 (Rozanne says the captain wants Klein to start Monday).

| Decision | Basis |
| --- | --- |
| Intent 5 split into `stairs` and `leonard` | A visit needs a departure act different from its arrival act (an arrival act cannot hold its own participants), so Leonard's arrival and the greeting are two acts |
| One non-player relocation per act | `diary` moves Neil (new visit), `stairs` moves Leonard; no act moves two |
| Issue of items is held facts plus knowledge | `kit.issued`, `holster.worn`, `log.signed`; no bullet, badge or custody mechanism (TD9). Ten demon hunting bullets and thirty revolver bullets are recorded as told; the ch20 dropped-bullets fact is not merged with them |
| Badge range claim not modelled | ch21 does not show a range badge request closing |
| Diary lead and the Sequences question are open facts | `diary.more.wanted` (other cathedrals) and `ask.rozanne.sequences` give ch22 and later windows consumers |
| Leonard's muttered closing exchange is not given to Klein | Not heard by him in the text; the reply's speaker is unmarked; nothing modelled |
| Neil's room and the stairs reuse pack places | Armory anteroom, Stairs below the office |

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Presence preflight, prefix `kj3i.` | 0 blockers; Neil and Leonard `PLACED_BY_ARRIVAL_ACT`; two RELOCATED_ACTOR_IN_OTHER_VISIT warnings (Neil: KJ3H visit; Leonard: kj3b visit), both earlier visits already ended | static check only |
| Native route, headless Chrome, fresh origin, seed = KJ3H completed checkpoint, KJ3E bundle | Passed on the fourth run: six intents, money 2883 unchanged, inventories unchanged, Leonard knowledge present and no mutter knowledge, 0 page errors, 151 s runner time | no counterfactuals beyond a re-load check, no 14/21 px captures (not taken: runs were headless without a screenshot step; gap) |
| Literal Export/Import | Position (stairs), money, `leonard.met`, `kit.issued` and the KJ3H `roselle.diary.chinese` fact preserved | |

Not run: full `npm test` (content-only, AD36), human play-through, civil clock. No freeze or engine limit appeared; both Neil's second visit and Leonard's membership in two visits ran without a hang.

## PF13 comparison point (not a speedup claim)

| | KJ3E | KJ3F | KJ3G | KJ3H | KJ3I |
| --- | --- | --- | --- | --- | --- |
| Intents | 11 | 5 | 9 | 9 | 6 |
| Runner executions to green | 11 plus 3 probes | 4 | 1 | 2 | 4 (plus one read-only state probe) |
| Late presence corrections | 3 and a freeze | 1 | 0 | 0 | 0 |
| New actors / places | 5 / 4 | 1 / 1 | 0 / 0 | 3 / 2 | 1 / 1 |

Additional PF13 fields for KJ3I:

- Source read: the coordinating window's brief did the reading beforehand (sweep-tier reader plus a checker); I re-read the 2,000-word ch21 section myself, about 3 minutes, and found the brief right on every fact I checked.
- Sweep-row corrections the brief needed: 5 table rows (6 omissions or overreaches); I added none.
- Authoring time: about 8 minutes (builder and runner adapted from KJ3H, preflight included).
- Native-proof time: about 7 minutes of wall clock across four runs (runs of about 95 to 150 s each).
- Late corrections (all content, not presence): (1) the `stairs` act was placed at the stairs although the player was still in Neil's room, so the task was never offered and the run waited 300 s; acts take the place the player is at, the move is an effect; (2) a knowledge key I gave Klein's first sight of Leonard collided with the `leonard` act's own completion key, so the arc ended early; (3) a runner typo left over from copying (counted as a run). Rule for the builder: a note key must not equal `<act id>.seen`.
- Boot/import counts: final run 2 boots and 1 import; all four runs together 5 boots and 1 import.

## Next

ch22 from sweep row s2.11. Add a builder lint for note keys that equal an act's completion key, and for acts whose place differs from the player's current place without a prior move.


## Content reconciliation B485: current disposition and preserved history

Historical six-intent continuation and incomplete item integration under AD36/AD42/AD43. Preserve the split arrival/greeting: an arrival act cannot use its own visit as prior participant support. The later issue records held facts/knowledge, not ammunition, badge, holster item ownership or usable custody. Ten and thirty ammunition statements retain their source-window context rather than merging with ch20's dropped-bullets note; TD9 remains the missing operational stock/custody consumer. Open diary/Sequences questions provide later story consumers, not completed inquiry or a closed badge-range request.

Do not give the lead an unheard closing exchange or invent its speaker. Reused rooms/stairs and explicit arrivals do not establish complete schedules. Static preflight warnings about earlier ended visits and the successful native overlap are distinct: this route's no-hang outcome does not solve KJ3E's specific undiagnosed freeze or prove a global two-visit invariant. Four runs plus a read-only probe retain their failures: wrong action location, note/completion-key collision causing early arc completion, and copied-runner typo. A note key matching an act's completion marker is a concrete producer/state collision to check, not a newly implemented lint just because the Next paragraph requests one.

The seeded KJ3H checkpoint, final151-second run, unchanged2883 balance/inventories and literal import support the original bounded continuation. No14/21 px screenshots were taken, so headless native success cannot become visual proof. Civil clock, broad counterfactuals and human play remain untested here. Reader brief/checker plus coordinator reread, approximate reading/authoring/proof timings and five corrected sweep rows are separately attributed; they do not establish PF13 speedup or fresh source reading in this reconciliation. The ch22 handoff remains a historical boundary, not new execution authority.
