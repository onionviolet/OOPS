# LOTM volume 1 reading status

Updated after each wave. Plan: [VOLUME1_READING_PLAN](VOLUME1_READING_PLAN.md). Output is private
(gitignored); this file carries ids, counts and grades only.

The [read-ahead findings](../cross-world-systems-2026-11-07/READ_AHEAD_USE_2026-11-08.md) record selected gameplay uses for existing readings, with next-slice and reference-only uses kept separate.

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

## Luna queue, 2026-10-30 (Codex subscription, $0 API)

One lane per shard (census, people, rules, texture), 4 lanes, stop at Codex 85%, one retry at high. Wave 1 (`books_wave1.txt`, 46 books: `coi`, `yas1-5`, `wus1-8`, `worm`, `sup`, `rtoc`, `ttks1-5`, `ss`, `ss9-11`, `ri5-24`) started 2026-10-30 05:15 UTC; at 13:46 UTC `coi`, `yas1-5` and `wus1-6` were finished, no shard failed after retry. About 60 shards an hour measured on `wus6`.

**Wave 2, go "Send the rest of the codex reading batches too" (2026-10-30, relayed by the supervisor chat).** Source Library epubs not yet read were registered in `plans/books.json` with `scripts/lead_run/register_sl_books.mjs` (chapter finder: `normalize_epub_chapters.py auto`), plans written by `make_book_plans.mjs --prepare --schema 1.5` (no run files, nothing sent). 75 books, 3,545 shards, about 59 Codex hours at the measured rate, spread over several days by the 85% stop. Order in `books_wave2.txt`: Mark of the Fool 1-7, Tree of Aeons 1-6, Randidly Ghosthound 1-6, Elydes 1-3, Street Cultivation 2-3, Raksura (1,079 shards), then Pale Lights, A Practical Guide to Evil, 12 Miles Below 1-7, Beware of Chicken 1-5, Skill-Grinder 1-5, Path of Ascension (1-8, 10, 11), Mana Mirror 1-5, Dungeon Core 3-6, Dungeon Life 1-2, Azarinth Healer, He Who Fights with Monsters, Small Town Hero, Virtuous Sons, Beneath the Dragoneye Moons, Forge of Destiny 2, and last Worth the Candle (237), The Runesmith (150), The Wandering Inn vol 1 (224), Ar'Kendrithyst (493). A supervisor starts the combined list once the in-flight lanes of driver 6790 (stopped by PID) finish, and retries every 30 minutes after a cap stop.

**Proposal, 2026-10-30 (reversible default, not a change to Weibao's go):** the stop line is 70% of the weekly Codex window instead of 85%, so the P5, P7 and P8 code lanes keep room until the reset on 2026-11-04. Codex was at 36% and rising; wave 2 alone would otherwise run it to the 85% line. Raise it again with `--cap 85` when those lanes finish.

Not registered (chapter finder found too few chapters): Street Cultivation 1, Vita Nostra, Forge of Destiny 1, Dragon's Egg, The Steerswoman 1-2, Chrysalis, Cradle 4-10, the Log Horizon and anime light novels. Scenes pass for these books stays on the Haiku batch route.

Spot check of 15 rows over 3 new books: not yet done (first new-book ingest comes after the wave 1 list ends).

**LOTM English extras `lotmx` (Weibao 2026-10-30, "send the readings and the side story ones"; owner: the lead-life design session).** From the official English edition: the 3 chapters missing from the Chinese shards (en 713, 794, 1360), side stories en 1395-1430 and 5 titled extras, renumbered 1-44 into a private EPUB, book 9, 15 one-to-three-chapter shards at schema 1.5. Separate Luna queue (2 lanes, stop at 70%) started 2026-10-30 18:54 UTC, driver PID 13508 in its own process group, log `lead-run-extras-2026-10-30/luna-queue-lotmx.log`. The queue skips the pilot shard `lotmxc001` (the three missing main chapters); its four passes run in a Luna lane started by a first driver (stopped after launch, 2026-10-30 19:05). Scenes on Luna at schema 1.5 and high effort (his "Send luna accordingly" and "we can run at higher effort as needed", 2026-10-30, instead of Haiku): `scripts/lead_run/luna_scenes.mjs`, PID 20890, waits for PID 13508, ingests, then reads all 15 shards, 2 lanes, log `luna-q/lotmx/scenes.log`. Known caveat: the 2026-10-29 pilot found medium-effort Luna scenes about half as fine as Haiku's.

**Circle of Inevitability scenes on Luna (2026-10-30).** Checked before launch: no CoI scenes exist in this checkout or any worktree (the 2026-10-30 merge `wb8-merged-2026-10-30` has 28 shards and 0 scenes; the read-forward passes are 276 of 295 done). Chain PID 20891, log `lead-run-2026-10-28/luna-scenes.out`: chapter 1026 from the official English edition (`coix`, book 2, the Calibre edition skips it) census, then its people, rules and texture, then schema 1.5 scenes at high effort for `coix` and all 295 `coi` shards in chapter order, 2 lanes, stopping at 70% of the Codex window and resumable by rerunning the same command.

**Next step (one line):** Luna queue runs wave 1 then wave 2 unattended; spot-check 15 rows in 3 new books at the first wave 2 ingest, then Weibao's go on November Haiku run files for scenes.


## Reading-status reconciliation, 2026-11-04 (B179)

The complete status owner, all October27–30 amendments, wave table, two Next-step lines and queue/extras sections were read. Later records supersede earlier snapshots: volume1 completion is reported after the old table’s waiting rows; the ten grade-C set-asides are reported done after the earlier next-step still asks to perform them. Keep the exact originals as chronology. Set-aside/lint grade repair does not mean every omitted fact was restored or source correctness proved.1768/1768 populated enrichment fields are completeness of fields, not1768 verified propositions: the15-step check retains11supported/3partial/1wrong. Likewise13of15supported pilot steps plus2partial is not perfect extraction.

Source-sized read-forward, census/people/rules/texture, scenes, enrichment, whole-book merge and actual native-readiness are different outputs. The note’s “fully read” claim records the campaign’s reported scope, not this reconciliation reading the underlying novel. Large prepared lists, acquired books, four-pass completion, rows ingested or script tags do not independently prove a complete semantic/scene audit. Medium versus high-effort trial results and metadata/lint grades retain exact samples. Unregistered chapter-finder failures are not automatically missing books, and frozen extras/chapter-number corrections retain their edition context. No sealed source truth is reproduced.

All quoted PIDs/process states, account percentages, dollar balances, month resets,70/85cap suggestions and projected59hours are dated observations or proposals. An old resume/kill command or request relayed in this record is not present permission to restart workers, stop someone’s process, spend API credit or alter current allowance. Current source/version coverage, quality and actual run authorization must be recovered only for a separately selected reading task. No private corpus, driver log, current process/meter/credit state or source edition was opened here, and no paid/subscription/local-model reading was launched.

## Reading order, 2026-11-08

Owner of the current reading queue (Weibao's words in the [direction log](../../USER_VISION_LOG_2026-11.md#2026-11-08-reading-order-for-the-openai-credits); procedure and the reread guard in [the batch workflow](../../../research/BATCH_READING_WORKFLOW.md#openai-backend-2026-11-08)). Counts are from the private folders on 2026-11-08 and include the Codex Luna queue's `<prefix>L` files. The Luna queue (`luna_queue.mjs`) is not running; its log stops 2026-11-04 at `wus6`. Caps assume every request uses its whole output budget, about $0.033 per shard-pass; measured spend has run near 55% of cap.

| Order | Books | What is left | Cap | Status |
| --- | --- | --- | --- | --- |
| 1 | Circle of Inevitability (`coi`) | 100 scenes, 16 census, 1 rules/people/texture shard | $3.96 | Approved 2026-11-08. First census batch (`batch_6af0bb6e0d94819084670d154d6c36f4`, $0.0567) stopped at its gate: 14 of 16 grade C because the OpenAI schema was non-strict and Luna dropped required fields (`whereabouts` missing on every row). Fixed (strict schemas, checked live for every pass), census rerun as `coi-census-oa-fix` under a stated reread, batch `batch_6af0f34b70808190af0767b89c530213`, driver PID 6215, 22:10 UTC. Collected 22:41: 13 B and 3 C (two with one lint row, repairable), $0.0609, gate passed; candidate coverage was 0 on two shards and 0.375 on one (unchecked). Scenes step `batch_6af0fa9c56e88190ad2e7e3662353baf` (100 shards, estimate $0.91) submitted 22:41 |
| 2 | Reverend Insanity 5-24 (`ri5`-`ri24`), plus leftovers in 1-3 | 608 unread shards, all five passes (3,040 shard-passes), plus 7 leftover shard-passes | $101.33 (pilots $1.60) | OpenAI plans written (`overnight_oa-2026-11-08-ri.json`, a one-shard pilot per new book first); needs its go |
| 3a | 巫师你好，我是伪人 (Wizard, Hello, I'm an Imposter, `ttks1`) | 60 scenes | $1.95 | Plan written (`overnight_oa-2026-11-08-ttks1.json`), not sent |
| 3b | 一年抽取一词条，模拟的也可以？ (One Entry a Year, and a Simulated One Counts?, `ttks2`) | 333 scenes | about $11 | Needs plans and its go |
| 3c | 咒回：特级的我去死灭打宿傩了！ (Jujutsu Kaisen: Special-Grade Me Goes to Fight Sukuna, `ttks3`) | 215 scenes | about $7 | Needs plans and its go |
| 3d | 全人类的继承者 (Heir of All Humanity, `ttks4`) | 103 scenes | about $3.40 | Needs plans and its go |
| 3e | Worm, Super Supportive, A Regressor's Tale of Cultivation, You Are Summoned 1-5, Wish Upon the Stars 1-8 | 1,438 scenes | about $47 | Needs plans and its go |
| 4 | Shadow Slave 9-11 and gaps, 废土边境检查官 (Wasteland Border Inspector, `ttks5`, 562 of 668 shards left), other small leftovers | about 3,347 shard-passes | about $110 | Needs plans and its go |
| 5 | The 76 unread wave 2 books (`motf` through `ark`) | about 18,350 shard-passes | about $600 | Ranked later |

Default for rows 3a-3e: scenes run on the provider whose CoI scenes grade better (Luna at high effort is unmeasured; the 2026-10-29 pilot found Luna at medium about half as fine as Haiku). Row 2 runs every pass on one provider at a time. Harry Potter 1-7 and Mother of Learning are fully read and are not in the queue.


## OpenAI $33 budget dispatch, 2026-11-08 22:37 UTC

Weibao approved B1–B4: “Goahead, Im surprised we havent read those already”. These books already have most non-scene passes from the Luna queue; this dispatch fills missing passes rather than reading every completed shard again. Existing Circle of Inevitability remains with driver 6215 and its $3.96 reservation. New runs use GPT-6 Luna via OpenAI Batch API, strict schemas, existing per-step quality gates, 128K output cap per request, no automatic paid repairs or stronger-model fallback. Aggregate new ceiling $23.72; combined reserved ceiling $27.68, leaving $5.32 against the user-reported approximate $33 budget. Account balance was not verified.

| Book | Run file under `plans/` | Requests | Cap | Driver PID / process group | Accepted first batch |
| --- | --- | --- | --- | --- | --- |
| 巫师你好，我是伪人 | `overnight_oa-budget33-2026-11-08-ttks1.json` | 64 | $2.11 | 18019 | `batch_6af0f998b2cc819081e92184aeacc6ae` |
| 一年抽取一词条，模拟的也可以？ | `overnight_oa-budget33-2026-11-08-ttks2.json` | 337 | $10.96 | 18020 | `batch_6af0f998b0f0819098e7d29b188547a6` |
| 咒回：特级的我去死灭打宿傩了！ | `overnight_oa-budget33-2026-11-08-ttks3.json` | 219 | $7.14 | 18021 | `batch_6af0f99987fc8190a1b61706d2e4fb5a` |
| 全人类的继承者 | `overnight_oa-budget33-2026-11-08-ttks4.json` | 107 | $3.51 | 18022 | `batch_6af0f99957b8819084965b4551595e3a` |

AU2/AU7/AU11: finite existing registered editions and prepared shard manifests; 727 unread shard-passes total, 711 scenes plus 16 non-scene gaps. No generated Codex reader agents. Four detached API drivers hold one census request each first, then submit later passes after their gates. Stop at each run ceiling or quality gate. Source payloads and outputs remain private. Runtime code was not changed by this dispatch.

Checks: `make_book_plans.mjs --keys ttks1,ttks2,ttks3,ttks4 --model gpt-6-luna --tag oa-budget33 --run oa-budget33-2026-11-08` generated plans with zero requests over prompt cap. `readOverlap` checked all 20 labels: zero completed/in-flight overlap before launch. Driver logs confirmed all four census batch submissions accepted; subsequent passes are queued, not yet submitted or quality-verified. Private launch receipt/logs: `docs/research/novels/_openai-budget33-2026-11-08/launch.json` and `ttks1.log`–`ttks4.log`. Do not launch older overlapping pending runs. No build/tests required for plan-only dispatch; no commit or push.


## Reading levels and schema migration, 2026-11-08 23:10 UTC

Current workflow: [reading levels](../../../research/BATCH_READING_WORKFLOW.md#reading-levels-and-system-relevance-2026-11-08); evidence and resume details: [reading-level review](../../../research/READING_LEVEL_REVIEW_2026-11-08.md). Weibao authorized implementation, checks of existing readings, unsent-schema fixes and extra reading inside the combined $33 budget, including procedural systems.

L1 extraction presence, L2 system synthesis, L3 build qualification and L4 expanded-life depth now have distinct products; relevance remains separate. New plans default to schema1.5; legacy unversioned requests remain1.3. Twelve unsent active rules/people/texture plans were upgraded in place without raising caps. Another150unsent OpenAI plans in the unapproved queue now use1.5; their pending run bounds are conservative prompt/output envelopes, remain PENDING and are excluded from the$33campaign. Already submitted scenes and all five passes for 巫师你好，我是伪人 retain their sent provenance. That book's approved run subsequently collected all five labels ($0.2243 measured); its 16 collector repair entries remain a quality backlog, not a claim that every row is source-correct.

Free inventory: all152 registered books,22 with all five extraction passes present at the snapshot,zero malformed JSON lines in selected canonical outputs. Source sample: seven procedure-related rows,three supported/three partial/one wrong; bounded source retrieval3,662characters. This is not a full-book semantic/recall audit. Detailed findings and partial dossiers remain private.

Supplement:19requests across16labels accepted by OpenAI, cap$0.73 inside a dedicated$1reservation; isolated1.5enrichment plus six missing LOTM census shard-passes. Original output folders are retained. Campaign reservations total$28.74 including the previous failed CoI batch rounded up to$0.06, leaving$4.26of$33unallocated. See `plans/reading_budget_2026-11-08.json`. Paid repairs and stronger-model fallback were not automatically dispatched.

Drivers reloaded from receipts without duplicate submissions: CoI30347, 巫师你好，我是伪人30350(subsequently exited complete), 一年抽取一词条，模拟的也可以？30353, 咒回：特级的我去死灭打宿傩了！30357, 全人类的继承者30360; supplementary driver32918. Each replacement/supplement has its own process group and private launch/log receipts linked by the review. Check live processes before resuming. Remaining gate: collect, inspect source-backed differences and retain unresolved repair entries; submission and schema validity are not semantic completion.

Checks:41focused batch/review tests passed; `check:rules` and `check:arch` passed. No game-runtime change, build/browser verification, commit or push.

## Source review closeout, 2026-11-08

All six approved original runs collected, with 41 receipts covering 865 requests. The follow-up audit checked 7,966 rows against their source shards and applied 1,819 corrections in a private overlay. It qualified 5,268 unchanged rows and held 879 with named reasons. Recorded usage for collection, audit and recovery is $4.56 of the $33 campaign. The updated schema passed a live synthetic probe and 42 focused tests. Source-qualified overlays, review limits and the unresolved queue are indexed in the [review receipt](../../../research/READING_LEVEL_REVIEW_2026-11-08.md#collection-and-source-audit-2026-11-08).

## Reverend Insanity complete-volume tranche, 2026-11-08

Weibao asked for a tranche that could finish complete readings or yield actionable progress. This run closes seven missing passes in volumes 1–3 and reads all five passes for volumes 5–7, one volume at a time. It reuses the prepared schema 1.5 OpenAI Luna plans. Census and scene pilots collect separately, followed by the full passes when their gates pass. The collector records review and repair candidates for source qualification.

Preflight confirmed 517 unique source/pass requests across 26 labels, all source shards present, no completed or in-flight overlap, and caps within the configured input and output bounds. The tranche reserves $23.72. Including $4.5561 recorded prior campaign usage, the conservative total reservation is $28.28 of $33, leaving $4.72 for follow-up.

Run and allocation: [tranche plan](../batch-reading-2026-10-27/plans/overnight_oa-2026-11-08-ri-complete-5-7.json) and [budget](../batch-reading-2026-10-27/plans/reading_budget_2026-11-08_ri-5-7.json). Driver PID and process group 17978 launched at 9:42 p.m. ET. The first gap batch has a provider receipt. Private launch receipt and driver log are in the Reverend Insanity batch directory. Check the live driver and receipts before any restart. The broader volume 5–24 plan remains pending.

Weibao then authorized Claude API reading as well. The split supersedes the original tranche driver. OpenAI resumes volumes 1–3 gaps and volume 5 from existing receipts under PID 31796. Claude Haiku 5.5 owns volumes 6–7 under PID 31798 and uses a separate private output directory and a snapshot of the earlier census for its glossary. The two Claude census pilots have provider receipts. Before launching, the handoff checked that volumes 6–7 had no OpenAI request files, receipts or summaries. Process group IDs equal the launch PIDs.

The [OpenAI plan](../batch-reading-2026-10-27/plans/overnight_oa-2026-11-08-ri-volume-5.json) caps 172 requests at $7.90. The [Claude plan](../batch-reading-2026-10-27/plans/overnight_claude-2026-11-08-ri-volumes-6-7.json) caps 345 requests at $12.82. The [combined ledger](../batch-reading-2026-10-27/plans/reading_budget_2026-11-08_ri-split.json) reserves $25.28 including prior usage and leaves $7.72 for review and repairs. Collection and source qualification remain open.

Source preflight confirmed 100 consecutive chapters in each volume and identical chapter coverage for all five passes. The pilot exposed that the English translation was routed through the default Chinese profile. The [Reverend Insanity appendix](../batch-reading-2026-10-27/world_appendix/ri.md) and world profile now specify English locators. Drivers reloaded the prompt code from existing receipts. Earlier source outputs keep their original form, and the qualification overlay normalizes a citation only after resolving its chapter and paragraph in the actual shard. All 42 focused tooling tests passed.

Current drivers are OpenAI volume 5 under PID 34780 and Claude volumes 6 and 7 independently under PIDs 41003 and 41004. The [independent allocation](../batch-reading-2026-10-27/plans/reading_budget_2026-11-08_ri-independent.json) retains the same combined reservation. The volume 5 census and scenes passed their gates, and its remaining rules, people and texture batches were submitted. Both Claude census pilots passed and both scene pilots were submitted. The private `ri-5-7-review/` directory holds the receipt inventory, direct field checks and per-volume qualification tool. Review can begin as a volume collects. Resume only from the current launch receipts and reconcile earlier provider receipts first.

The Claude drivers now run under PIDs 67898 and 67905. Both full census batches have receipts and can run alongside their scene pilots because the full census excludes the pilot shard. The remaining scene and non-scene passes write distinct files and can collect together after both gates pass.

The first source audit collected 232 review responses over 9,121 rows. It covered the volumes 1–3 gaps and volume 5 census, scenes, people and texture. The `audit-5-core/accepted.jsonl` overlay has 8,218 usable source-index rows, including 3,943 corrections or citation normalizations and one directly checked attribution fix. The `held.jsonl` queue records 903 uncertain or structurally unresolved rows. The overlay is source-index evidence. Cross-arc synthesis and implementation qualification are separate checks. Recorded audit usage was $0.6676. Volume 5 rules and volumes 6–7 remain in collection.

## Additional OpenAI reading before November 10

Weibao asked to send more through OpenAI Batch to use available credit before November 10. Two additional runs cover the remaining passes for [You Are Summoned books 1–5](../batch-reading-2026-10-27/plans/overnight_oa-2026-11-08-deadline-yas.json) and [Wish Upon the Stars books 1–3](../batch-reading-2026-10-27/plans/overnight_oa-2026-11-08-deadline-wus.json). The 236 requests include 204 scenes and 32 census, rules, people and texture gaps. The provider accepted all eight initial census requests. Subsequent stages are gated and collect through the same driver. Completion before the target depends on provider processing time.

The [deadline allocation](../batch-reading-2026-10-27/plans/reading_budget_2026-11-08_deadline-additions.json) reserves $7.04 for the two additions. Including prior usage, active reading caps and the remaining audit exposure at dispatch, the combined reservation was $27.32 with $5.68 unallocated. PIDs 64582 and 64583 own the additional runs. Their launch receipts and logs are under the private `ri-5-7-review/` directory, where the review tool also accounts for their exposure when reserving any subsequent audit.

The first Wish Upon the Stars census produced ten otherwise source-backed rows with kinds outside the schema. Direct checks supported classifying the rank and stats as measures and the named skills as abilities. The corrected census passed lint at grade B, and the continuation resumed from the completed census gate under PID 75442. The raw census, prior migrated file and original receipt are preserved. The OpenAI schema now uses the lint kind vocabulary on future 1.5 census requests. All 42 focused tooling tests passed.

After volume 5's final collection and audit freed its unused reservation, [Wish Upon the Stars books 4–8](../batch-reading-2026-10-27/plans/overnight_oa-2026-11-08-deadline-wus4-8.json) were added as a separate output lane. OpenAI accepted all five initial census requests. The extra 202 requests are capped at $6.01. The [updated budget](../batch-reading-2026-10-27/plans/reading_budget_2026-11-08_deadline-wus4-8.json) reserves $30.94 of $33 and leaves $2.06 at dispatch. The new driver is PID 78878. Together, the deadline additions cover 438 requests across the two series.

Volume 5 is fully collected and source-reviewed. Its final overlay has 8,920 accepted reference rows across all five passes. The earlier gap overlay adds 445 accepted rows. Across both, 758 rows remain held. The free recovery pass interpreted unwrapped provider values only when the existing field was a string, and allowed explicit removal only for schema-optional fields. It retained the row's identity and reran locator and lint checks. Combined audits ran 265 requests and recorded $0.7663. Volume 5 extraction and the earlier gaps cost $0.7088. Source-backed rules now cover concrete operating conditions, consumable costs, interruption and recovery examples. The private overlays are under `ri-5-7-review/audit-5-core/` and `audit-5-rules/`. Claude volumes 6–7 remain open for collection and review.

The Wish Upon the Stars book 8 and You Are Summoned book 5 scene pilots were repaired against the cited passages and reran clean at grade B. The continuations have receipts for all remaining scene batches. The first You Are Summoned restart exited during local preflight before an API call. The verified restart used the preserved gate results and submitted all five full scene labels. Their current continuation PIDs are 83847 for Wish Upon the Stars books 4–8 and 96001 for You Are Summoned.

Collection released enough reservation for [Worm](../batch-reading-2026-10-27/plans/overnight_oa-2026-11-08-deadline-worm.json), the next complete scene pass in the queue. It adds 270 requests covering 266 scenes and four earlier gaps, capped at $8.00. The [current budget snapshot](../batch-reading-2026-10-27/plans/reading_budget_2026-11-08_deadline-worm.json) reserves $32.32 of $33. PID 23874 owns its driver. Together the deadline additions stage 708 requests. Submission and collection receipts remain distinct from source qualification.

Worm collected all 270 requests at $1.1622. You Are Summoned books 1–5 and Wish Upon the Stars books 4–8 also collected their full additions at $0.6524 and $0.8193 respectively. These are extraction receipts. Only the gate repairs cited above received direct source review in these additions. The Wish Upon the Stars book 3 scene batch remained in flight at this checkpoint.

[Super Supportive](../batch-reading-2026-10-27/plans/overnight_oa-2026-11-09-deadline-sup.json) adds 262 requests including the full remaining scene pass. Its pilot and three non-scene gaps collected, and OpenAI accepted the remaining scenes. The [dispatch ledger](../batch-reading-2026-10-27/plans/reading_budget_2026-11-09_deadline-sup.json) reserved $32.03 of $33, including the active volume 6 census audit. This brings the deadline additions to 970 submitted requests across four series. Driver PID 53774 and the private receipts own collection.

## Reverend Insanity recovery and qualification, 2026-11-09

The volume 6 and 7 census pilots yielded 119 accepted source-index rows and four holds. Six directly checked duration and quantity details are in the private `volume-6-7-pilot-addenda.jsonl` receipt, with statements distinguished from observations.

Volume 6 full census returned five truncated shards. Thirteen chapter-sized reads restored all five at $0.0750. The effective census passed the original gate, with provider originals and replacements recorded separately. The source audit qualified 2,798 of 3,052 full-census rows, including 128 corrections, and held 254. The scene pilot passed at grade B. Rules, people and texture collected, and the full scene batch has a provider receipt. Volume 6 continuation PID 52850 and volume 7 PID 67905 own those remaining receipts. The review tool and per-pass receipts are under the private `ri-5-7-review/` directory.

Volume 6 collected all 175 requests. Across full census, rules, people, texture and scenes, the current overlays qualify 11,908 rows and hold 632. This excludes the separately reviewed census pilot. Four scene review responses hit their output limits. Complete review objects were recovered locally, and a five-request retry checked the 23 rows still missing reviews and recovered 22. The original and retry overlays are disjoint by source file and row number. The census repair is retained separately from the source audit. The qualified rules and texture rows remain source reference for later synthesis.

Volume 7 full census and the scene pilot cleared the batch gates. Claude accepted the four remaining passes. Rules, people and texture collected and entered source review. The first census review qualified 2,559 rows, with a targeted retry on 60 missing review decisions. The final full scene receipt is still in flight at this checkpoint.

Super Supportive finished at $1.2244 measured. Released capacity funded [A Regressor's Tale of Cultivation](../batch-reading-2026-10-27/plans/overnight_oa-2026-11-09-deadline-rtoc.json). It adds the full scene pass of the prepared Calibre 17 edition, covering 640 continuous prepared chapters including the prologue, and four missing non-scene requests. The remainder of the source library's edition coverage is separate. The four gaps and scene pilot collected, and the remaining 328 scene requests have a provider receipt. The English profile and [world appendix](../batch-reading-2026-10-27/world_appendix/rtoc.md) preserve prepared-edition locators and distinguish remembered knowledge, practiced execution and eligibility. The $8.55 run cap uses Luna at low effort and 48,000 maximum output tokens per request. [The dispatch ledger](../batch-reading-2026-10-27/plans/reading_budget_2026-11-09_deadline-rtoc.json) reserved $32.62 including final-review headroom. PID 90180 owns collection. The deadline queue now has 1,303 submitted requests across five series.

### Collection and source review closeout

All 517 Reverend Insanity requests returned and reconcile to provider receipts. The five passes cover every prepared chapter in volumes 5–7. The pilot-inclusive qualified row counts are 8,920 for volume 5, 11,962 for volume 6 and 10,930 for volume 7. The held counts are 729, 633 and 653 respectively. Earlier volumes 1–3 gaps add 445 qualified rows and 29 holds. Retries are deduplicated by source file and row number.

Seven volume 7 scene shards initially counted against the gate. A source audit and a 19-request targeted retry accepted 389 scene and fill rows, corrected 112 of those, and held 17. A virtual replacement of the accepted rows passes the original percentage gate. The original provider receipt remains unchanged. When used as an isolated set, some accepted scene rows refer to held chronology anchors or dependencies. Use them as source references and resolve those links before building a continuous timeline. Independent procedural checks in volumes 6 and 7 corrected failure context and an activation locator, and recorded a consumed input separately from an energy requirement. Their source and row hashes are recorded with the direct field patches.

A Regressor's Tale of Cultivation collected all 333 requests at $0.5986. At the deadline queue checkpoint, 1,277 of 1,303 requests were collected. Wish Upon the Stars book 3 scenes are the only outstanding label. OpenAI reported 25 of its 26 requests complete with zero failed, and driver PID 75442 owns collection. The deadline queue is extraction coverage with the specific gate fixes cited above.

Recorded spend totals $16.6763 against the $33 combined ceiling. This consists of $4.5561 earlier campaign spend, $4.7230 Reverend Insanity extraction, $2.5591 Reverend Insanity source review, $0.0750 census recovery and $4.7631 collected deadline additions. Including $0.77 reserved for the outstanding OpenAI label, measured spend plus outstanding exposure is $17.45. Provider receipts establish recorded usage. Credit expiry and settlement are separate account events.

## Reader reconciliation, 2026-11-09

F1. **The $33 campaign has $16.22 of unallocated headroom.** The last Wish Upon the Stars book 3 scene batch collected all 26 requests for $0.1061. All 1,303 additional OpenAI requests have terminal summaries with status OK. Those six runs recorded $4.8692. Total recorded campaign spend is $16.7824, and the receipt inventory has no outstanding reservation. The Reverend Insanity follow-up accounts for $3.2679 on OpenAI and $4.0892 on Claude, including source review and census recovery. The earlier campaign recorded $4.5561. Provider-wide account balances, expiry and unrelated usage are unverified. The dispatch ledgers and the preceding closeout preserve what was known while the last batch was in flight.

F2. **The register has 51 of 152 books with all five passes present.** Nine are partial and 92 have no registered extraction files. The standard registry folders show 44 complete. Reconciling the actual private outputs adds Reverend Insanity volumes 6–7 and Wish Upon the Stars books 4–8. The count uses `bookShards` and `passDone` with the named plans' isolated destinations. No source files moved. A canonical-only inventory can overstate gaps in those books, and a pass file can still have held rows. Earlier library totals are historical snapshots. Books, editions and other media outside this register were outside this count.

F3. **Extraction has two live providers. Qualification has separate consumers.** The five L1 passes are census, scenes, rules, people and texture. L2 connects procedures and other system evidence across contexts. L3 ties the evidence to a selected playable slice and its actual supplier, state owner and consumer. L4 deepens a selected life, region or alternative route. Relevance to the lead, the next slice, another life or reference stays independent. The implemented inventory and dossier helpers record those distinctions. The Reverend Insanity volumes 5–7 source overlays qualify 31,812 rows for reference with 2,015 held. The extra five-series OpenAI queue has extraction coverage and selected gate fixes. Selected lead slices already use [contextual read-ahead](../cross-world-systems-2026-11-07/READ_AHEAD_USE_2026-11-08.md). The [cast merge](../../../../scripts/lead_run/merge_reviewed_rows.mjs) consumes reviewed cast rows for LOTM. Its input contract is separate from the bulk reader overlays and from playable acceptance.

### Next reads proposed

| ID | Read | What it unlocks |
| --- | --- | --- |
| O1 | Reuse the existing opening evidence for Fang Yuan's first refinement, then consult volumes 5–7 where they clarify a rule or exception. | L2/L3 packet for input custody, partial progress, interruption and recovery, following RA9 and RA16. Keep Klein and Harry first in the active build order. No new paid extraction needed for the first pass. |
| O2 | Close The Perfect Run and A Soldier's Life books 3, 5 and 6. | Sixteen missing shard-passes total. The Perfect Run needs nine census, one rules and two people. A Soldier's Life needs one rules, two people and one texture. A finite batch could close four more extraction entries. At the recent $0.03 per-shard planning envelope this is about $0.48 before any repair reserve or refreshed preflight. |
| O3 | Pilot one cult entry from Cults of RuneQuest. | Test a section reader on membership, obligations, authority, rites, exceptions and consequences. Screen the held PDF first. Keep source claims and tabletop procedures distinct, then qualify one concrete sequence before widening. Pilot size and cost depend on the screened section. |
| O4 | Close the 59 extraction gaps across the registry's original Shadow Slave entry and volume 10 if another book tranche is useful. | Finish two mostly indexed entries before opening the larger volume 9 or 11 tranches. Recheck edition and source scope before staging. |

This pass reconciled file presence, provider receipts and named qualification evidence. Proposals remain unsubmitted. It did not reread the corpus or exercise a runtime route.

## Approved follow-up, November 9

Weibao authorized O1–O4, asked to submit the named gaps before November 10, and asked to try the held Cyberpunk sources within the remaining $16.22. The [gap run](../batch-reading-2026-10-27/plans/overnight_oa-2026-11-09-gap-closeout.json) submitted all 75 requests across 14 OpenAI Batch labels on November 9 Eastern time. The read-overlap and prompt preflight found no duplicate or in-flight shard-pass. Its [dispatch ledger](../batch-reading-2026-10-27/plans/reading_budget_2026-11-09_gap-closeout.json) caps it at $2.25. Driver PID 39670 owns collection. Closing a gap still depends on the collected result.

O1 is the [first refinement packet](../cross-world-systems-2026-11-07/READ_AHEAD_USE_2026-11-08.md#ra9-and-ra16-follow-up--first-refinement-november-9). This is a qualification of the existing opening, since Fang Yuan's route has advanced to ch98. The packet separates the text's observed progress and recovery from the game's reservation policy. No runtime change. All 36 focused lead-life tests passed.

O3 used the Humakt entry in *Cults of RuneQuest*, volume 1, *The Prosopaedia*, 2023 v1.00, printed p58 / PDF p61. Screening and rendered-page inspection confirmed the section boundary. The section reader returned six claims with exact locators and zero procedures. The page supports distinct cultural views and depictions. It supplies no initiation steps, costs, obligations or recovery sequence. This is a lore-index pilot, with a procedural-source gap. Its private receipt records $0.0003004.

Harry Potter books 1–7 and LOTM volumes 2–8 plus extras have all five passes present in the current registry folders. The LOTM volume 1 owner records the older chapter 1–213 read, with its oldest pilot outputs stored under legacy identifiers. These are reading coverage statements. The [gameplay checkpoint](../cross-world-systems-2026-11-07/CHECKPOINT.md#restart-after-the-95-allowance-checkpoint) records Harry at the Book 1 station endpoint with one final exchange missing and Klein's earned continuation through ch115 P067. The Fang Yuan and Zorian endpoints have separate receipts there.

The Cyberpunk text and visual queues are scoped to the 20 PDFs in the November 8 follow-up, the held Shadowrun Sixth World core and the ten acquired fiction EPUBs. Source paths, hashes, screening and output receipts are in the private `docs/research/novels/cyberpunk-reading-2026-11-09/` directory. Different RPG editions remain distinct. Text-poor and scan-only pages use rendered images. Screen-flagged or layout-sensitive claims require page-image confirmation before use in a build. The Cyberpunk RED core listing remains unverified and outside this source set.

OpenAI accepted the Cyberpunk tranche in six batches on November 9. Coverage is 346 text requests for the ten fiction EPUBs, 617 requests over 3,801 screened PDF pages and 374 visual requests over 1,463 rendered pages. The Night City Guide pilot covered one additional page. A page-set check confirmed disjoint text and image inputs covering all 5,265 physical PDF pages. The Cyberpunk 2020 core timed out during screening and used rendered pages throughout. Eleven non-text or empty EPUB spine members were logged separately. Collector process groups are 43331 for EPUB, 43335 for PDF text and 43341 for PDF images. No full corpus results had collected at this checkpoint. In the visual pilot, the printed p9 / PDF p10 image supported the cited bus fare, corporate rail gate and parking penalty. This is selected source evidence and remains edition-specific.

At dispatch, recorded usage plus conservatively rounded active caps reserved $23.91 of the $33 campaign, leaving $9.09 free. The new caps are $2.25 for the named gaps, $1.2019 for EPUB text, $2.0861 for PDF text and $1.5493 for images. The two direct pilots together measured $0.0011882. Settled batch usage awaits collection.

The existing batch adapter sends prepared inputs. A proposed discussion pass would gather bounded public threads, preserve post/comment URLs and edition claims, then hand that snapshot to the section reader for interpretation and primary-source follow-up. A first lookup found a [RuneQuest discussion](https://www.reddit.com/r/Runequest/comments/1cgie2a/godlearnerish_question/) that points to *Replenishing Rune Points*, Core Rules p315, for allied-shrine access. This is a retrieval lead. The Humakt encyclopedia entry does not settle the rule. No paid search request was sent.

## Cyberpunk source priority, November 9

Weibao put Cyberpunk ahead of RuneQuest and asked to consider lorebooks and rulebooks alongside fiction. Review the submitted Cyberpunk RPG sources first. The held set already includes the 2020 core and Night City Guide, RED Jumpstart Kit, Black Chrome, Danger Gal Dossier and Tales of the RED: Street Stories. Shadowrun, the other RPG systems and the fiction provide comparisons. Keep 2020, RED's 2045 setting and the 2070s evidence tagged separately. [Held source inventory](../../../research/LIBRARY_INDEX.md#cyberpunk-follow-up-2026-11-08-dl106)

- **Rules.** The full Cyberpunk RED core is now held. Read its checks, combat and injury, netrunning, advancement, prices and access as procedures. Check the publisher's conversion guidance when reusing Jumpstart material. [Publisher downloads and conversions](https://rtalsoriangames.com/downloadable-content/)
- **Setting.** Night City 2045 is the strongest next city source for districts, transit, services, jurisdiction and faction presence. The World of Cyberpunk 2077 can answer equivalent questions for the later setting when needed. [Night City 2045](https://rtalsoriangames.com/night-city-2045/) · [The World of Cyberpunk 2077](https://www.penguinrandomhouse.com/books/610712/the-world-of-cyberpunk-2077-by-written-by-marcin-batylda/)
- **Supplements and adventures.** Read held equipment, faction and adventure books together around one gig. Extract how an offer reaches the crew, who can sell or install gear, what can interrupt the work, and who can respond. Single Player Mode is a candidate for clocks and gig generation. The Edgerunners Mission Kit is a candidate for the later era's lore, quickhacks and a worked mission. [Single Player Mode](https://rtalsoriangames.com/2025/09/16/cyberpunk-red-alert-single-player-mode-single-player-mode-now-released/) · [Edgerunners Mission Kit](https://rtalsoriangames.com/cyberpunk-edgerunners-mission-kit/)

The DL106 intake now holds the full RED core, all three Edgerunners Mission Kit booklets, all three 2013 booklets, CyberGeneration and Version 3.0. These acquisitions followed the earlier dispatch. Read the RED core alongside the Mission Kit's 2070s rules and keep their eras and scope explicit. The city and solo-play books remain separate source candidates. RuneQuest's allied-shrine question stays in the reading backlog. [Edition and intake checks](../../../research/LIBRARY_INDEX.md#cyberpunk-core-editions-2026-11-09-dl106)

## Ghost in the Shell tool-assisted pilot, November 9

Read the six pages of chapter 01, Prologue, in the held 2004 Dark Horse English scan. PDF p. 7 starts chapter 01 and p. 13 starts chapter 02. The reader requested a panel crop, a glossary lookup and a Reddit search. The crop included the adjoining ammunition annotation. The glossary result tied the shield term to the command panel. Two Reddit threads helped flag adaptation differences. Two direct Responses calls cost $0.0029857 under a $0.10 reservation. The page check corrected two claims in the first model report, covering the conditional crossfire warning and the apparent separate outside blast. Reviewed report, raw model output, tool evidence and usage are private under `docs/research/novels/cyberpunk-reading-2026-11-09/ghost-tool-pilot/`.

## Ghost in the Shell original volume follow-up, November 9

Weibao authorized continuing through the held original manga using the image batches already submitted and targeted tools for ambiguity. The chapter map covers chapters 02–11 and back matter, PDF pp. 13–368. It reconciles to 92 existing image requests for the whole volume and excludes the duplicate image at physical PDF p. 268 from evidentiary counts. Whether the duplicate displaced an edition page remains open. The scope manifest and tool loop are in the private `ghost-original-review/` directory alongside the Cyberpunk batches.

The old local collectors exited during a DNS error. HTTPS became reachable again, and collection resumed using the original receipts under PIDs 57673, 57675 and 57677. The chapter follow-up process 58874 waits on the existing vision collector. It sends chapter-index text and, when requested, up to two panel crops per chapter. It can retrieve the author notes and a small set of Reddit adaptation leads. It has a $0.50 ceiling. Including the earlier campaign reservations and completed Prologue pilot, the conservative total is $24.42 of $33, leaving $8.58 unallocated at launch. No original-volume review charges had occurred at this checkpoint.

Two author-note lookups were checked visually while the batch was pending. PDF p. 360, note keyed to printed p. 153, describes a two-hour retrospective audit of Fuchikoma input records. The negative result leaves the intrusion possible. PDF p. 363, note keyed to printed p. 254, says rain impairs ordinary tailing and makes optical camouflage easier to see at speed. These are author explanations and useful source leads for the chapter review. Neither establishes an engine rule.

Chapter-map and fixture checks matched all 92 expected request IDs and verified the planned page bounds. The live review awaits collection. The largest efficiency gain is to keep the broad image pass as the index and spend on a few disambiguating crops or notes. A separate candidate for fresh reading is the opening chapters of the held A Starbrite Man, on corporate access to augmentation and the obligations that come with it. This title was outside the submitted Cyberpunk text tranche. The RED core and Edgerunners Mission Kit have since arrived under DL106. They are fresh reading candidates outside the submitted tranche.

## Cyberpunk RED core and Edgerunners Mission Kit dispatch, November 9

Weibao authorized sending the full RED core and all three Mission Kit booklets before November 10, with tools for unclear rules and tables. The manifest covers 458 RED core pages and 42 pages per Mission Kit booklet, in 195 disjoint three-page-or-smaller requests. RED uses the Poppler visual fallback after the intake text screen failed on a cross-reference. The Mission Kit screen completed and flagged covered and low-contrast text, so this pass also uses its rendered pages. The source hashes match the managed originals. The request schema keeps the RED baseline, 2070s changes, lore and mission-specific procedures distinct and lets the reader flag page and region for a closer check.

Preflight allocated approximately $0.84 for OpenAI Batch and $0.35 for targeted review against the previous $24.42 combined reservation. Use the exact private plan for the approved caps. A second provider is available for a named comparison or unresolved problem if needed within the same ceiling.

OpenAI accepted all three parts at 10:46 a.m. Eastern on November 9. The provider reported all 195 requests in progress across parts of 78, 69 and 48. The exact batch cap is $0.8468349. Combined with the $0.35 review reservation and prior exposure, the ledger reserves $25.62 of $33 and leaves $7.38 unallocated. The batch is all OpenAI.

Collector PID 61681 owns the saved receipts in the private Cyberpunk reading folder. Review PID 62362 waits on its summary and checks up to 20 flagged pages, balancing the four publications. It rerenders the requested page at higher resolution and supplies region crops and local OCR for checking table alignment or ambiguous text. Excess flags, failed source shards and unresolved review results stay explicit. No table review had run at dispatch.

## Edgerunners maps, Delta Green and A Starbrite Man dispatch, November 9

Weibao authorized a parallel OpenAI Batch tranche before November 10 within the $7.38 remaining. It covers six Edgerunners encounter maps and the Night City map, all 61 physical pages of Delta Green's Briefing Documents and Need to Know, and chapters 1–5 of Warby Picus's A Starbrite Man. The Delta Green copies were screened during intake. This pass uses page images to preserve briefing layouts and marks uncertain geometry or evidence. The fiction chapters are bound to the Podium EPUB's navigation and paragraph positions. Preflight verified 33 requests and found no source-edition overlap with the earlier Cyberpunk tranches. The prior campaign reservation is $25.62.

OpenAI accepted the batch at 11:02 a.m. Eastern on November 9. The provider reports all 33 requests in progress. The preflight cap is $0.1100138, with $25.74 reserved across the campaign after cent rounding and $7.26 unallocated. Collector PID 68702 owns the receipt and eventual result files in the private Cyberpunk reading folder.

## Cyberpunk 2013 and Potions comparison, November 9

Weibao authorized the three Cyberpunk 2013 booklets through OpenAI Batch before November 10, with $7.26 remaining, plus a short Ars Magica comparison for Hogwarts Potions. The Cyberpunk plan covers all 118 pages in 40 disjoint requests. View From the Edge has 50 pages, Friday Night Firefight has 26 and Welcome to Night City has 42. The intake screens and registered hashes were verified. The batch uses rendered images because the latter two books are scan-only, and it records edition-specific claims and table uncertainties.

OpenAI accepted batch `batch_6af1efc269c08190bf2ed83cf5144309` at 11:07 a.m. Eastern on November 9. The provider reported 40 requests in progress. The preflight cap is $0.17278625, with $25.92 reserved across the $33 campaign after cent rounding and $7.08 unallocated. Collector PID 71200 owns the private receipt and result files. Review should start with flagged scan text and table alignment, then trace gear access, injury and who can respond to trouble across the three booklets.

**Collector restart, 4:35 p.m. Eastern.** Every November 9 collector had exited on network errors (connect timeouts, ECONNRESET, ECONNREFUSED), including gap driver 39670 after five retries. The two review waiters, 62362 and 58874, exited with them. At restart, all eleven Cyberpunk batches and the sampled gap batches were still `in_progress` at the provider. Cyberpunk 2013 had 0 of 40 requests complete, and its 24-hour window closes at 11:07 a.m. Eastern on November 10. Retrying collect-only loops now own collection: `collect-loop.sh` in the private Cyberpunk folder, with PIDs and logs in `collect-loop-launch-2026-11-09.json`. They cover cp2013, red-kit, parallel-next, epub, pdf, vision and the gap run, plus the red-kit table review and the Ghost follow-up. Each review starts once its upstream summary exists. No request was resubmitted. An expired batch collects as partial results with `expired` rows.

## CyberGeneration, Version 3.0, RED extras and 2013 table review, November 9

Weibao approved O1–O3 (“Send O1–O3”) against the $7.08 unallocated, at about $1.20 total. O1 covers *CyberGeneration*, 195 scan pages (`0fd5ae65511a`), and *Cyberpunk Version 3.0*, 291 pages (`4f81185e7057`). These were the two held DL106 cores outside every earlier source manifest. O3 covers three official RED downloads: *Night City Atlas*, 15 pages (`85a672ea7890`), the *Edgerunners Folio*, 11 pages (`74fc3df71a56`), and *Karaoke Night*, 12 pages (`33c6bc0a16b5`). The 2013 player reference sheets and combat aids were left out because they reproduce pages already in the 2013 booklet batch. The managed originals matched their SHA-256. All 524 pages were rendered at 1650 px and sent as 175 disjoint image requests of three pages or fewer, under a new `cores-extras` section-reader lane with edition-scoped instructions and `tableChecks`. The V3.0 screen's two `instruction_hint` flags, on PDF pp. 20 and 117, are in-world prose. The pass reads page images, not text layers.

OpenAI accepted all four parts at 4:42–4:43 p.m. Eastern, with 52, 50, 49 and 24 requests. Their windows close at about 4:43 p.m. on November 10. The preflight cap is $0.7616493, and the ledger reserves $27.04 of $33, leaving $5.96 unallocated. That reservation includes $0.35 for O2. O2 is `review-cp2013.mjs`, the RED table review pointed at the 2013 results. Once the 2013 batch collects, it rerenders up to 20 flagged pages, balanced across the three booklets, with region crops and local OCR, through direct calls. Collect loop PID 41876 and review waiter PID 41877 are recorded in `cores-extras-launch.json`. Results arriving after November 10 may fall outside the credit window, and that was not verified.

The [short Ars Magica and Hogwarts comparison](../cross-world-systems-2026-11-07/READ_AHEAD_USE_2026-11-08.md#ra17ra20--hogwarts-potions-lab-comparison-november-9) is complete as source research and adds no API charge. The proposed bench interruption and partner handoff are recorded as future design work.
