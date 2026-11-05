# Progress atlas, 2026-11-04

Whole-project view built from live owners on 2026-11-04, master at `f15a37f90` with a heavily dirty shared checkout (other writers active). This is a map of existing evidence, not a tracker or completion score. Proposals here change no priority (AD32). Visual: rendered inline in the Claude session that made this file; panels match the sections below.

**Inspected:** PROJECT.md, master playability plan (outcome P1-P5, F1-F5), Klein campaign plan (KJ1-KJ8, B0-B7), mechanism backlog (B1-B12 board), HP whole-world plan (W1-W10), release reconciliation RP1-RP6, git merge state of the two mechanism branches, commit counts 2026-11-01 to 11-04. **Not inspected:** source code per system, cultivation/Frontier/Mistglass depth, UI rounds, ideas inventory, browser replay. Every status below is the owner's recorded evidence level, not a fresh run.

## Where things stand

Dimensions are independent: built in code, proven (agent-native run), integrated with other systems, delivered (reachable by a player on a normal install).

| Area | Built | Proven | Integrated | Delivered | Owner |
|---|---|---|---|---|---|
| Klein lead life, ch1 to ch69 P082 (KJ1-KJ3AE) | yes, 28 slices | native, agent-verified | uses B1-B6, B12 | private-pack delivery scope (AT6) | Klein plan, KJ3AE receipt |
| Klein KJ4-KJ8 (Backlund to ending) | no | n/a | n/a | n/a | Klein plan |
| LOTM mechanisms B1-B6, B12 | yes | partly (B1/B4/B5/B6 first native use in KJ3AA) | yes | as above | mechanism backlog |
| LOTM mechanisms B8 firearms (below floor), B9 time carry (diagnosed), B10 cast energy, B11 persistent cast | partial | no | no | no | mechanism backlog |
| Harry lead life W1-W4 (cupboard to wand shop) | yes | agent-verified | partial | private packs | HP plan |
| Harry W5-W10 (train to end of year 1) | no | n/a | n/a | n/a | HP plan |
| Combat/health | L2b fixture at floor | fixture scope | below floor beyond fixture | unknown | L2b receipt |
| Ordinary player starts and second lives (B5-B7) | no | n/a | n/a | deferred by direction | Klein plan, WER owner |
| Cultivation, HP school/trade, Village, Frontier, Mistglass | earlier slices | earlier receipts (F1-F4) | partial | last app adoption Luminous Gothic | master plan |
| Release | committed, CI-equivalent full suite pass | yes | n/a | installed app not rechecked | release reconciliation |

## Gaps and findings

| ID | Finding | Kind | Consequence | Next check or action |
|---|---|---|---|---|
| AT1 | Mechanism backlog says B2/B3 and B4/B5 are "not merged"; both branches are ancestors of master. | Stale owner | Agents may redo or wait on merged work. | Update B2-B5 rows in MECHANISM_BACKLOG to merged with their receipt state. |
| AT2 | B8 firearms is implemented below floor (no native proof; shared-pack proof acts still open per KJ3AE), B9 night-to-morning time carry is diagnosed not fixed, B11 persistent cast is not built, and combat has floor evidence on the health fixture. B7 brewing was scoped observation, so it is not a gap. | Missing connection / verification gap | The Tingen climax and later KJ arcs need fights and long time skips; these share one blocker. | Bring B8 to floor with a native fight, and fix B9, before the Tingen climax window. |
| AT3 | Klein is at ch69 of a volume ending ch213; arcs 2-5 have probe rows (partial, unverified) but no packets. | Depth gap | The spine is moving, about 40 Klein commits on Nov 3-4, but the remaining volume-1 runway is mostly mechanism-gated. | Read the "Build order after probes #3-#5" section before the next window. |
| AT4 | Harry W5-W10 proposed; 3 HP commits since Nov 1 against about 40 Klein. | Stalled lane | Second-focus world is waiting, not failing. | W5 (calendar, G5) is the next ready window; W8 needs semantic shard review. |
| AT5 | Ordinary starts and second lives (B5-B7) wait on Klein's ending by schedule, not by logic. | Deferred by direction | P2 "different kinds of lives" stays unmet for a non-developer start. | Direction choice only; no action unless Weibao moves it. |
| AT6 | Campaign content lives in private packs; a fresh public install cannot reach it (RP section). | Delivery gap | Published repo shows engine, not the Klein or Harry lives. | Recorded delivery state; no new acceptance inferred. Note when release state changes (AD32). |
| AT7 | Installed app last adopted at Luminous Gothic; no current-master recheck was recorded in the inspected owners. | Verification gap | What Weibao plays in the app may lag the agent-proven bundle by weeks. | Rebuild and adopt, then one native smoke in the app. |
| AT8 | Every slice is agent-verified, none human-reviewed (AD42 allows this). | Unknown | P1-P5 "fun and comfortable" are unjudged; pacing and taste have no evidence. | Optional: one play session on the KJ3AE checkpoint. |

## What blocks what

- B8 firearms to floor + combat beyond fixture → Tingen climax (KJ3 end) → KJ4-KJ8 (required).
- B9 time carry → any window with overnight or multi-day skips (required where the text skips).
- B11 persistent cast → recurring people like Glacis acting in place (helpful; text roles cover it today).
- Klein ending → ordinary starts B5-B7 (scheduled, not logical; hypothetical dependency).
- HP W8 shard semantic review → W8-W10 (required for that order).
- App adoption → anything Weibao plays in the installed app (required for human review).

## Momentum (commits by day)

Nov 1: 7 total. Nov 2: 14 (3 Klein). Nov 3: 171 (32 Klein, 2 HP). Nov 4: 54 (5 Klein, 1 HP). Klein spine is the moving lane; HP and mechanism rows move slowly; most Nov 3 volume was depth-dial, overnight, cast-lives and UI-direction work.

## Next moves

Standing priority ([PROJECT current focus](../../PROJECT.md), AD32): Klein full journey, then Harry beside it, book-world depth, three-worlds proposal, playability plan.

Suggestions, ranked: (1) AT1 board fix, minutes. (2) AT2 B8 to floor plus B9, since it gates the rest of Klein. (3) AT4 Harry W5. (4) AT7 app adoption so play is possible. (5) AT8 optional play session.
