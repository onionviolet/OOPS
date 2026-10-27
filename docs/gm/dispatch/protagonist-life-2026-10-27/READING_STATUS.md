# LOTM volume 1 reading status

Updated after each wave. Plan: [VOLUME1_READING_PLAN](VOLUME1_READING_PLAN.md). Output is private
(gitignored); this file carries ids, counts and grades only.

| Wave | Chapters | Shards done | Grades (A / B / C) | Tokens (haiku) | Usage after (5-hour / weekly) | State |
| --- | --- | --- | --- | --- | --- | --- |
| Pre-gate (v1) | 1-15 | 6 (+1 re-run) | 0 / 4 / 2 | about 1.05 million | n/a | Read; 165 review items under 1.3 |
| Gate (v2) | 16-24 | 3 (+1 lost try) | 0 / 3 / 0 | about 0.45 million | 7% / 12% before wave 1 | Gate passed |
| 1 | 25-54 | 10 of 10 | 2 / 8 / 0 (one B after a safe repair) | 1,317,219 (131,700 per shard; 43,900 per chapter; 6.2 calls) | 12% / 13% | **Done; paused at the AU7 bound** |
| 2 | 55-84 | 0 of 10 | | | | Waits for the 5-hour window to reset (about 01:20 UTC 2026-10-28) or Weibao's higher ceiling |
| 3-7 | 85-213 | 0 of 43 | | | | Waiting |

**Wave 1 output (private):** 85 scenes, 641 census rows, 47 fills; 88 options, 69 not taken;
9 scenes with hour or minute precision. Name accuracy 1.0 on every shard. Coordinator spot
check: 15 census rows on three shards; every name sits at its locator; one note on one shard
states a fact the cited paragraph does not (a reader importing outside knowledge, PL-A46).
The sonnet 10% spot check was not run because the usage bound came first.

**Why it stopped:** the 5-hour usage window rose from 7% to 12% (plus five points, the AU7
ceiling); the weekly window rose one point. Other sessions share the account, so not all of
the rise is this wave.

**Bounds:** AU7: stop at plus five points on the 5-hour or weekly window from the 7% / 12%
baseline. Stop on a wave with more than two grade-C shards, name accuracy under 0.9 on any
shard, or three consecutive failures of one kind.

**Blockers:** the AU7 usage bound for this task (resume after the 5-hour window resets, or on Weibao's raised ceiling).
