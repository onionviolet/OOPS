# KJ3H implementation receipt: the advance, the accounts office and Old Neil

2026-11-02. Authorized by Weibao ("Yes, next" after KJ3G). **Agent-verified, not human-reviewed (AD43).** Not committed, not installed, no personal save touched. Content-only: bundle is KJ3E's (`919b17d3…`); pack `f61c147e…` (revision `cast-reviewed-kj3h-d92c2436…`, carrying KJ3F-KJ3H).

## Scope and source

English v1 ch20 P001-P116 (official edition, sha256 `395c9d9f…`; ch19 ended at P059, so the armory scene is ch20), read from the sweep shard 2 text; sweep rows s2.1-s2.6 were inputs. Nine native intents: Dunn offers an advance, Dunn rings for Rozanne, the bullets note, the walk upstairs, the accounts payout, Mrs. Orianna's Butcher story, meeting Old Neil, what to read, recognising the diary's writing. Next boundary: ch21 (the old friend).

| Decision | Basis |
| --- | --- |
| Advance is a native money gain of 2880 pence | ch20 P010, P065, P070: twelve pounds, two fives and two ones; 240 pence a pound (`LOTM_PENCE`). Repayment (half of weekly pay) is a fact `advance.owed` plus knowledge, not a mechanism |
| Banknotes are money, not items | Inventories asserted unchanged |
| One non-player relocation per act | KJ3E's freeze on a two-actor relocation is still undiagnosed; `upstairs` moves Rozanne, `accounts` moves Orianna, `neil` moves Neil |
| Bullets note is a held fact plus knowledge | Thirty ordinary bullets a day, the range at No. 3 Zouteland Street and Neil's badge are named; no bullet issue, badge or range mechanism exists. The original ten demon hunting bullets are dropped in-source (P050) |
| Neil's room uses the pack's Armory anteroom | Source: a cramped room with a desk, two chairs and a locked iron door (P086-087); the route from the accounts office is not mapped |
| Chinese recognition is private | `roselle.diary.chinese` and a player-only note; no one in the scene knows (P112-116) |

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Presence preflight, prefix `kj3h.` | 0 blockers; Rozanne, Orianna, Neil and Dunn all `PLACED_BY_ARRIVAL_ACT`; no AMBIGUOUS | |
| Native route, headless Chrome, fresh origin, seed = KJ3G checkpoint, KJ3E bundle | Passed on the second run: nine intents, money 3 -> 2883 at `accounts`, inventories unchanged, 0 page errors, 211 s runner time | first run reached the last step and failed my own stale end check (expected first act `myth` after copying the KJ3G runner); no counterfactuals, no 14/21 px captures |
| Literal Export/Import | Position, money and `roselle.diary.chinese` preserved | |

`reviewed-episode.json` still says "Ten intents" in its scope text; the builder source now says nine and was not rerun, to keep the pack digest unchanged. Not run: full `npm test`, human play-through, civil clock.

## PF13 comparison point (not a speedup claim)

| | KJ3E | KJ3F | KJ3G | KJ3H |
| --- | --- | --- | --- | --- |
| Intents | 11 | 5 | 9 | 9 |
| Runner executions to green | 11 plus 3 probes | 4 | 1 | 2 |
| Late presence corrections | 3 and a freeze | 1 | 0 | 0 |
| New actors / places | 5 / 4 | 1 / 1 | 0 / 0 | 3 / 2 |

KJ3H is the first window since KJ3E with several new actors and places, and the changed preflight passed it without a presence correction. The source read was done by the coordinating session itself, not by a delegated reader (AU5 routes bounded reading to haiku): the per-window read is still the dominant cost. PF13 stays a proposal; four episodes, one builder lineage.

## Next

ch21 (the old friend) from sweep rows s2.7 onward. Delegate the window read to a haiku reader that returns a structured brief, then check it against the text before building.


## Content reconciliation B482: scope, findings and remaining evidence

Historical scope and incomplete integration, reconciled under AD36, AD42 and AD43. KJ3H corrects the earlier handoff boundary: the armory scene is ch20 after ch19 P059. Its twelve-pound advance is recorded as 2880 pence, with the seeded balance changing 3 to 2883. This is an actual money effect in the recorded route, whereas the half-weekly-pay repayment promise remains fact/knowledge without a deduction schedule. Banknotes are represented as money rather than inventory items. The bullets allowance, badge, range and dropped original ammunition remain distinct from issued stock or executable use.

One actor relocation per act is the recorded workaround for the undiagnosed two-actor freeze, not evidence that the freeze was repaired. An armory-anteroom representation does not establish a mapped upstairs route. Private recognition remains player knowledge rather than shared actor knowledge. The first runner's stale copied end assertion is retained as a harness failure; the second run's nine intents and 211 seconds do not measure source-reading efficiency or prove every branch. The stale ten-intent generated scope remains a disclosed artifact discrepancy: a corrected builder that was not rerun does not change the saved pack bytes.

Fresh-origin seeded play, literal import and presence preflight retain their separate scopes. No counterfactual, civil-clock, font-scale, ordinary-start or human evidence is added here. PF13 is still a proposal across one builder lineage. The dated next-reader/model instruction is historical workflow, not a present request to spawn a reader or change current authority. This review read the whole receipt, not the linked source text, generated pack or runtime.
