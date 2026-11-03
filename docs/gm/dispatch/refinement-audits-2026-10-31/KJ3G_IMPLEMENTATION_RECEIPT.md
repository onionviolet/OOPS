# KJ3G implementation receipt: Dunn's briefing, the duties and the gate

2026-11-02. Authorized by Weibao ("Yes, both" after KJ3F: fix the preflight, then the next episode). **Agent-verified, not human-reviewed (AD43).** Not committed, not installed, no personal save touched. Content-only: the bundle is KJ3E's (`919b17d3…`); pack `4deb642e…` (revision `cast-reviewed-kj3g-97a84727…`, which also carries KJ3F).

## Scope and source

English v1 ch17 P075, ch18 P001-P056, ch19 P001-P059 (official edition, sha256 `395c9d9f…`), read in full from the sweep shard text; sweep rows s1.11-s1.16 were inputs. Nine native intents in one situation in Dunn's room before the Chanis Gate: creation myth and the Goddess's title, potion origins and Sequences, the Blasphemy Slate order, the four remaining loss-of-control kinds, weighing the risks (the decision to stay is private, no promise of a path), the two standing duties, the gate and sealed-artifact grades, the fugitive's photo, the armory handoff. Next boundary: the armory and Old Neil (ch19 P059 onward).

| Decision | Basis |
| --- | --- |
| `myth` re-places Dunn and lists no participants | An arrival act cannot hold its own participants (the preflight rule fixed after KJ3F); KJ3F's visit ended at `headcount` |
| Duties, the Slate order, the day off and the gate warning are facts plus knowledge | No standing-duty scheduler, clearance or wage mechanism exists; none was added. The weekly day off stays unchosen (`dayoff.unchosen`) |
| The decision to stay is `decision.stay`, a private resolve | ch19 P015 is Klein's thought; Dunn promises nothing (P017) |
| Loss of control is told as four notes after the three outcomes | Dunn's "five kinds" (ch18 P042) include the Slate-linked first one; the categories are recorded as told, not merged into one rule |
| Display "Daly" (ch19 P026) unchanged | Matches the KJ3D examiner display |
| No item or document is created | The photo and the artifact description are knowledge only; 0-08 is described aloud, never written (P057) |

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Presence preflight, prefix `kj3g.` | 0 blockers; only the weak Chanis Gate duplicate-place warnings and earlier visits | |
| Native route, headless Chrome, fresh origin, seed = KJ3F completed checkpoint, KJ3E bundle | Passed in one run, nine intents, money and inventories unchanged, 0 page errors | first and only run: no counterfactuals, no 14/21 px captures |
| Literal Export/Import | Position, `armory.sent` and the KJ3F `contract.signed` fact preserved | |

Not run: full `npm test` (content-only), human play-through, civil clock.

## PF13 comparison point (not a speedup claim)

| | KJ3E | KJ3F | KJ3G |
| --- | --- | --- | --- |
| Intents | 11 | 5 | 9 |
| Runner executions to green | 11 plus 3 probes | 4 | 1 |
| Late presence corrections | 3 and a freeze | 1 | 0 |
| Other late fixes | 2 | 2 (mine) | 1 (a 210-character report over the 200 cap) |

Three episodes, one builder lineage, all in one room with one recurring actor. The cheap parts (sweep rows as inputs, presence preflight, a copied builder and runner) now work; the source read still costs the same per chapter. The last episode had no new actor placement problem because there was no new actor, so it does not test the preflight against a harder window. PF13 stays a proposal.

## Next

The armory and Old Neil (ch19 P059 onward; sweep row s1.16's end and the next rows). That window adds a new place and a new actor, which is the first real test of the changed preflight.
