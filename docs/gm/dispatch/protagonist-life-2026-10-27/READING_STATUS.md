# LOTM volume 1 reading status

Updated after each wave. Plan: [VOLUME1_READING_PLAN](VOLUME1_READING_PLAN.md). Output is private
(gitignored); this file carries ids, counts and grades only.

| Wave | Chapters | Shards done | Grades (A / B / C) | Tokens (haiku) | Usage after (5-hour / weekly) | State |
| --- | --- | --- | --- | --- | --- | --- |
| Pre-gate (v1) | 1-15 | 6 (+1 re-run) | 0 / 4 / 2 | about 1.05 million | n/a | Read; 165 review items under 1.3 |
| Gate (v2) | 16-24 | 3 (+1 lost try) | 0 / 3 / 0 | about 0.45 million | 7% / 12% before wave 1 | Gate passed |
| 1 | 25-54 | 10 of 10 | 2 / 8 / 0 (one B after a safe repair) | 1,317,219 (131,700 per shard; 43,900 per chapter; 6.2 calls) | 12% / 13% | **Done; paused at the AU7 bound** |
| 2 | 55-84 | 10 of 10 | 0 / 10 / 0 (one B after a locator repair) | 1,340,283 (134,000 per shard; 44,700 per chapter) | 1% (window reset) / 13% | Done |
| 3 | 85-114 | 10 of 10 | 0 / 10 / 0 | 1,501,355 (150,100 per shard; 50,000 per chapter) | 4% / 14% | Done; **stopped: 122% of the wave estimate (stop line 110%)** |
| 4 | 115-144 | 0 of 10 (prepared) | | | | Waiting for Weibao: continue at the new rate or revert |
| 5-7 | 145-213 | 0 of 23 | | | | Waiting |

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

**Blockers:** the 110% wave-cost stop line (needs Weibao's call on the new rate).
