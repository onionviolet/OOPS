# LOTM volume 1 reading status

Updated after each wave. Plan: [VOLUME1_READING_PLAN](VOLUME1_READING_PLAN.md). Output is private
(gitignored); this file carries ids, counts and grades only.

## Correction, 2026-10-29 evening (resume session; nothing read, nothing spent)

The table below stops at 2026-10-27 and is stale. **LOTM volume 1 chapters 1-213 is fully read.** Chapters 115-213 (31 shards, `w4s40`-`w4s41` agent, `b4s42`-`b7s72` batch) went through the Message Batches route on 2026-10-28/29, with schema 1.4 rows for people, rules and texture on all 72 shards and a second medium census (`x2`) on the 31. Owners: [batch campaign](../batch-reading-2026-10-27/PLAN.md), [readiness rounds](../batch-reading-2026-10-27/READINESS_AND_SCOPE.md) C32-C36, [local overnight handoff](../batch-reading-2026-10-27/LOCAL_OVERNIGHT_HANDOFF_2026-10-29.md). A whole-book merge exists (`m4-whole-book-2026-10-29/`).

| Item (ch 121-213, 31 shards, read from the headers) | Count |
| --- | --- |
| Scenes pass grade B / C | 19 / 10 (lint failures are 1-9 rows each: `price-amount`, `note-length`, `quote-guard`, `zh-not-at-locator`, four `locator-format`, one `evidence-kind`; name accuracy 0.993-1.0) |
| Second census (`x2`) grade B / C | 29 / 2 |
| First census B / C | 1 / 1 listed by header (others carry a different header shape) |

Grade-C scene shards: `b4s42`, `b4s44`, `b4s48`, `b5s50`, `b5s52`, `b5s59`, `b6s63`, `b6s67`, `b6s68`, `b7s70`. By the driver's `repairable` rule only single-issue shards qualify; a script-only set-aside of the failing rows (no model call) is the cheapest fix and has not been applied.

**Budget (AU2) for this resume:** $0 and 0 tokens. October credit is spent (about $97.21 of $100); a paid call needs Weibao's go phrase per run file; the November plans (`plans/overnight_2026-11-01-*.json`) are `approval: PENDING` and the fresh credit arrives Nov 1. An agent haiku reader would cost 130-170k tokens a shard against about $0.02 by batch, so no agent reading is dispatched. Usage before/after: not sampled (no reading run).

**Luna pilot (2026-10-29, $0 API, Codex window 26% before and after):** a full scenes reread on Luna at 1.5 graded C/B/C on 3 shards with scenes about half as fine as Haiku's, so it is not the reread route. The better route is enrich-in-place: script tags (16,679 steps), then Luna fills only the 1.5 step fields on the fixed scenes. Pilot on 3 shards: 65 of 65 steps returned, 13 of 15 spot-checked steps supported, 2 partial, 0 contradicted. Details and requirements: [Luna lane](READING_LUNA_LANE.md). The grade-C shards above are fixed by the script set-aside, not by a reread.

**Luna enrich, all 72 shards (2026-10-29):** 1,768 of 1,768 steps carry 1.5 fields in a private sidecar after one retry of 13 shards; 3 locators outside the shard, 6 ids outside the table; 15-step spot check 11 supported, 3 partial, 1 wrong. $0 API; Codex window 26% before and after. Scenes unchanged. See [Luna lane](READING_LUNA_LANE.md).

**Lane L6, Circle of Inevitability on Luna (2026-10-30, `gpt-6-luna` medium, $0 API):** people, rules and texture passes on the shards that have a local census (40 of 295). Pilot `coic005`, `coic009`, `coic013`: 9 of 9 replies ok, 7 lint-clean, 15-row spot check in the wave notes below. Wave 2 (12 shards): the first try failed (2 lanes wrote nothing, 1 thin; the brief said "no repo edits" while requiring reply files), one retry in the pilot shape (one shard per lane, brief fixed) gave **36 of 36 ok, 8 lint issues total, rows per shard in line with the pilot**. The passes carry no audit grade or name accuracy; lint plus spot check stand in. Glossary is the local census, not a batch census (the Nov batch census will replace it). Usage: Codex 27% before and after; Claude weekly 44%, 5-hour 72% (shared with other sessions). Requirements and lessons: [Luna lane](READING_LUNA_LANE.md).

**Grade-C shards fixed (2026-10-30):** the 10 volume 1 scene shards are now grade B by `scripts/lead_run/setaside_lint.mjs` (no model call; backups in `pre-setaside/`; 5 rows set aside on `b4s44`, 1 each on 4 others). The Luna enrich sidecar had 3 bad locators, 1 unknown id and 13 self-targets removed.

**Luna read-forward queue (started 2026-10-30 05:15, driver PID 34137, stop with `kill 34137`, never `pkill -f`):** `scripts/lead_run/luna_queue.mjs`, one `gpt-6-luna` medium lane per shard doing census, people, rules and texture, 4 lanes at once, stops launching at Codex 85%, one retry at high effort, never a third. Books in order: Circle of Inevitability (279 shards left), You Are Summoned 1-5, Wish Upon the Stars 1-8, Worm, Super Supportive, A Regressor's Tale of Cultivation, TTKS 1-5, Shadow Slave 9-11 and gaps, Reverend Insanity 5-24 (about 3,600 shards in all). Already batch-read books are skipped (LOTM 2-8, Mother of Learning, Harry Potter, A Soldier's Life, Godclads, The Perfect Run, Reverend Insanity 1-4). Scenes stay on the Haiku batch route. Progress: private `<book private dir>/luna-q/<book>/state.json`, overall `docs/research/novels/_luna-queue/queue.out` (gitignored). Resume by rerunning the command with `docs/research/novels/_luna-queue/books.txt`. Rows are ungraded until ingest; ingest runs every 20 shards and at the end. Not yet spot-checked at scale.

**Free lane:** the local COI census queue (tag `n1`, 53 shards done, last entry 2026-10-29 21:05) is not running now; resume with the command in the local handoff when the coordinator's browser checks are done.

**Next step (one line):** script-set-aside the failing rows of the 10 grade-C volume 1 shards, then Weibao's go on a November run file (Circle of Inevitability `coi` first per C24).

| Wave | Chapters | Shards done | Grades (A / B / C) | Tokens (haiku) | Usage after (5-hour / weekly) | State |
| --- | --- | --- | --- | --- | --- | --- |
| Pre-gate (v1) | 1-15 | 6 (+1 re-run) | 0 / 4 / 2 | about 1.05 million | n/a | Read; 165 review items under 1.3 |
| Gate (v2) | 16-24 | 3 (+1 lost try) | 0 / 3 / 0 | about 0.45 million | 7% / 12% before wave 1 | Gate passed |
| 1 | 25-54 | 10 of 10 | 2 / 8 / 0 (one B after a safe repair) | 1,317,219 (131,700 per shard; 43,900 per chapter; 6.2 calls) | 12% / 13% | **Done; paused at the AU7 bound** |
| 2 | 55-84 | 10 of 10 | 0 / 10 / 0 (one B after a locator repair) | 1,340,283 (134,000 per shard; 44,700 per chapter) | 1% (window reset) / 13% | Done |
| 3 | 85-114 | 10 of 10 | 0 / 10 / 0 | 1,501,355 (150,100 per shard; 50,000 per chapter) | 4% / 14% | Done; **stopped: 122% of the wave estimate (stop line 110%)** |
| 4 | 115-144 | 2 of 10 (8 prepared) | 0 / 2 / 0 | 331,713 (165,900 per shard) | | **Paused by plan:** handed to a cheaper coordinator ([handoff](READING_HANDOFF.md)); protocol v3 A/B first |
| 5-7 | 145-213 | 0 of 23 | | | | Waiting |

**2026-10-27, late: agent reading is paused; moving to the Message Batches API.** The remaining 31 shards (chapters 121-213) are prepared as batch requests (dry run only, about $0.43 for both passes); nothing is submitted until Weibao says go. Plan and runner: [batch reading campaign](../batch-reading-2026-10-27/PLAN.md). The v3 headless `claude -p` design in the handoff is superseded by the batch route unless the A/B fails. **A/B so far (w3s33):** census pass B at $0.0074 with recall 0.778 (gate 0.9, not met); single-call shape C, rejected. Round 2: census at medium effort finds 0.89 of the new entities (low 0.63) for $0.0112; scenes pass at low effort is grade C (no options or choices), untested at higher effort. Round 3: scenes pass at high effort is grade B (options and choices in 6 of 7 scenes) for $0.0105; best settings about $0.022 a shard for both passes. Pilot on other shards next; switch not yet decided.

**Why wave 3 cost more:** from mid-wave 2 the reader prompt requires every named entity, not only
lead-relevant ones (one wave-2 reader had returned 28 census rows for three chapters). Census
rows per chapter: wave 1, 21.4; wave 2, 23.2; wave 3, **32.4** (+52%), for 14% more tokens per
shard. **Proposed:** keep the recall instruction and re-estimate the remaining 33 shards at
about 150,000 each, about 5.0 million haiku tokens (volume 1 total about 9.4 million with the
1.0 million already spent before wave 1). Alternative: revert to the wave-1 prompt at about
132,000 per shard with lower census recall.

**Wave 1 output (private):** 85 scenes, 641 census rows, 47 fills; 88 options, 69 not taken;
9 scenes with hour or minute precision. Name accuracy 1.0 on every shard. Coordinator spot
check: 15 census rows on three shards; every name sits at its locator; one note on one shard
states a fact the cited paragraph does not (a reader importing outside knowledge, PL-A46).
The sonnet 10% spot check was not run because the usage bound came first.

**Why it stopped:** the 5-hour usage window rose from 7% to 12% (plus five points, the AU7
ceiling); the weekly window rose one point. Other sessions share the account, so not all of
the rise is this wave.

**Bounds:** AU7 raised by Weibao 2026-10-27 to **15 points per window** for this task (from
each window's starting level: the 5-hour window reset to 1% before wave 3, so its stop is 16%;
the weekly window started at 12%, so its stop is 27%). Stop on a wave with more than two grade-C shards, name accuracy under 0.9 on any
shard, or three consecutive failures of one kind.

**Blockers:** none. Reading continues in a fresh coordinator per the [handoff](READING_HANDOFF.md). Wave estimate from wave 4: 150,000 tokens per shard under v2 (stop line 1.65 million per wave of 10).
