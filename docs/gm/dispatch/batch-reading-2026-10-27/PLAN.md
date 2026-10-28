# Batch API reading campaign (proposal, 2026-10-27)

Status: **proposal; nothing submitted, no key read.** Weibao picks the books and says go per batch.
Weibao's ask (verbatim in [USER_VISION](../../../USER_VISION.md#batch-api-reading-campaign-2026-10-27)):
send a chat to plan a batch API send to cover the most important of our books. Rules: AU1-AU15
([usage rules](../../../AGENT_USAGE_RULES.md); AU7 "no paid/API fallback without explicit spending authority", AU13
finite plan), WPR7, WPR18-WPR19, the sealed-secrets rule. Owners it builds on: [reading handoff](../protagonist-life-2026-10-27/READING_HANDOFF.md),
[status](../protagonist-life-2026-10-27/READING_STATUS.md), [schema card 1.3](../protagonist-life-2026-10-27/SCHEMA_CARD_1_3.md),
[other books readiness](../protagonist-life-2026-10-27/OTHER_BOOKS_READINESS.md).

## 1. What changed and what it costs

Agent readers cost 130-170k haiku tokens a shard because they resend their context on every tool call. A batch request is
one call per shard: stable system prefix (instructions, schema card, output schema), then glossary hits, script candidates
and the shard text; the answer is schema-constrained JSON. Model `claude-haiku-5-5`, Batch API half price.

| Item | Value | Source |
| --- | --- | --- |
| Price | $0.10 input, $0.50 output per million tokens (prompts up to 100K), batch = half | claude-api skill cached table, 2026-10-06 [S] |
| Per request, LOTM shard (dry run) | about 14,000-15,000 input tokens [I, character-count estimate] | `batch_submit.mjs` dry run |
| Output per request | **25,000 tokens assumed** [I]; thinking at `effort: low` counts as output | to be measured by the A/B |
| Cost per shard per pass | about **$0.007** (output is 90% of it) | formula above |
| Cost per shard, both passes | about $0.014; stress case (3x output) $0.042 | |
| Agent route for comparison | 150,000 tokens a shard on the subscription | READING_STATUS wave 3 |

Dollars are not the binding limit. What binds is audit and repair throughput, the glossary merge, the spot checks, and the
English runtime adapter (section 4). The account holds $100/month of credits; every plan below stays far under it.

## 2. Scored book table

Score = 3 x interest + 2 x implementation + 2 x source in hand + 2 x runtime readiness + 2 x game benefit + 1 x size ease; each 0-5, maximum 60.
Interest comes from [USER_VISION](../../../USER_VISION.md): the five priority worlds (Harry Potter, D&D, A Soldier's Life, TTKS, Mother of Learning),
widened to LOTM with Circle of Inevitability and Shadow Slave. Implementation: packs in `src/world_packs` and design owners. Source: a complete local edition
(sizes measured from the Calibre EPUBs 2026-10-27 [S]; Harry Potter words 2-7 estimated from public counts [I]). Runtime: the lint and shard tools handle the language today.

| Rank | Book / scope | Int | Impl | Source | Runtime | Benefit | Size | Score | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **LOTM volume 1** (ch 121-213 left) | 5 | 5 | 5 | 5 | 5 | 4 | **59** | In progress; 31 shards left |
| 2 | **Harry Potter year 1** (book 1 only) | 5 | 5 | 5 | 2 | 5 | 5 | **54** | 79k words, about 10 shards; private extraction with page locators |
| 3 | **Mother of Learning** (whole, 106 chapters) | 5 | 4 | 5 | 2 | 5 | 4 | **51** | 807k words; needs a `loop` field |
| 4 | Harry Potter books 2-7 | 5 | 3 | 5 | 2 | 4 | 3 | 46 | About 1.0M words; follows year 1 |
| 5 | **Shadow Slave** | 4 | 4 | 5 | 2 | 4 | 2 | 44 | 2.27M words, 1,873 members; packs exist |
| 6 | **A Soldier's Life** (books 1-3, 5, 6) | 5 | 2 | 3 | 2 | 4 | 3 | 40 | 851k words held; **book 4 not found** in the library |
| 7 | LOTM series after volume 1 (ch 214-1460) | 4 | 1 | 5 | 2 | 4 | 2 | 38 | Same EPUB; 3.2M characters, about 295 shards; **not runtime-ready**: `prepare_shard.mjs` keeps only the first run of chapter links because chapter numbers restart in later parts, so `zh 第N章 pM` locators collide across parts. Needs part selection and a part-qualified locator first |
| 8 | Super Supportive (to ch 312) | 5 | 2 | 3 | 2 | 4 | 1 | 38 | Browser capture, 1.5M words; edition is a capture, not an EPUB |
| 9 | TTKS five books | 5 | 3 | 1 | 1 | 4 | 3 | 36 | **Blocked:** no full local edition (COVERAGE.json: B2 has 10 chapters, B1 none); needs acquisition first |
| 10 | Reverend Insanity | 3 | 3 | 4 | 2 | 3 | 1 | 34 | 4.96M words, 2,363 members; largest single job |
| 11 | LOTM sequel, Circle of Inevitability | 3 | 1 | 4 | 2 | 3 | 2 | 31 | 2.05M words; embedded title reads Lord of Mysteries 2; provenance unauthenticated |

**LOTM whole series and its sequel are separate decisions** (rows 7 and 11). The series row shares volume 1's language and glossary but needs the part-aware locator work above, and
its game value waits on volume 1 being used; the sequel is an unauthenticated English scrape and ranks last until its edition is settled.
D&D is a priority world but not a novel; it has no row. Other held books (Omniscient Reader, Regressor's Tale, Labyrinth 1-2, Fated Villain, Legendary Mechanic, Worm) have full dossiers already and score under 35 here.

## 3. Recommended order (Weibao picks)

1. **LOTM volume 1, chapters 121-213**, proving the runner (section 5). Cost about $0.43 for both passes.
2. **Harry Potter year 1**: best test of reuse. It is small (about $0.14), English, an implemented world, and it forces the language adapter that every later English book needs. LOTM volume 2 onward would test only glossary carry, not the runner's reach.
3. **Mother of Learning**: same adapter, plus the loop field; about $1.5.
4. Harry Potter 2-7, Shadow Slave, A Soldier's Life, then LOTM after volume 1 once its part-aware locators exist (each $1.5-4).
5. TTKS after acquisition; Reverend Insanity and Circle last.

Everything held, all passes: about $26 at the base estimate, about $78 at 3x output. So the campaign needs a per-book cap, set from the A/B's measured output.

## 4. Per-book plan

Common shape (proposal): shards of at most about 11,000 source tokens, split at a chapter or scene boundary. **Pass 1** census batch over the whole book
(`batch_submit.mjs`, plan `pass: census`). Shards must pass lint and the audit gate (grade A or B) before their census joins the glossary (PL-A47). **Merge** one glossary
(one id per entity across shards: GF1, GF19, PL-L16). **Pass 2** scene batch with the merged glossary hits per shard (`pass: scenes`; scenes and fills). Where order matters, pass 2 runs in waves with a small state capsule (AU15). Pass 2's glossary admits a census file only when its header grade is A or B (enforced in code; the pass-2 plan's `censusMatch` includes the `b4`-`b7` pass-1 prefixes). Failure and repair: one repair batch per shard carrying only the failing rows and lint codes; a shard still grade C gets one fresh full request; never a third (AU13). Pilot before the rest of each book: one shard, then five, then the rest. Stop rules (kept from the volume 1 plan): more than 2 of 10 shards grade C, name accuracy under 0.9 on any shard, the same failure on three shards in a row, or measured cost over 2x the estimate. Audit thresholds are the existing `audit_shard.mjs` grades. Turnaround: most batches finish within an hour, the maximum is 24 hours, results stay downloadable 29 days [S, claude-api skill]. Privacy: shard text goes to Anthropic's API; request files, outputs and ledgers stay under each book's gitignored private folder; this folder holds counts, ids and dollars only.

| Book | Scope | Shards | Language / locator | Schema fit and brief changes | Passes | Pilot | Estimate (both passes) | AU13 finite plan |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LOTM vol 1 | ch 121-213 | 31 | zh, `zh 第N章 pM` | None; schema 1.3 as is | 2 | A/B shard, then 5 | $0.43 (31 x $0.014) | 31 + 4 repair requests per pass |
| HP year 1 | book 1, 17 chapters | 10 | en, `B1:PDF-pN` (existing pack form) | English adapter; money (Galleons, Sickles, Knuts); school-year calendar anchors as dated rows; no translation glossary | 2 | 1 chapter pair, then all | $0.14 | 10 + 1 |
| Mother of Learning | whole, 106 chapters + epilogue | 106 (one chapter each; chapters average 7,500 words) | en, `c001 p75` | Add `loop` to scenes (which restart); knowledge carries across loops, world resets (PLAN 18.3); settle the arc boundary and canon golden-run line | 2, pass 2 in 4 waves by arc with a loop-state capsule | Chapters 1-5 | $1.5 | 106 + 11 |
| HP 2-7 | 6 books | 125 | en | As year 1; per-book calendar anchors | 2 | Book 2 first | $1.8 | 125 + 13 |
| Shadow Slave | whole, 2.27M words | 284 | en, chapter+paragraph | Rift/Dream Realm places and Aspect/Memory items need kind mapping (item, creature); Nightmare Spell as `law`/`note` | 2, waves by volume | Chapters 1-10 | $4.0 | 284 + 29 |
| LOTM after vol 1 | ch 214-1460 | about 295 | zh, needs a part-qualified locator (chapter numbers restart per part) | Part selection in `prepare_shard.mjs`; pathway ids carry across the glossary | 2, waves by volume | 5 shards | $4.1 | 295 + 30 |
| A Soldier's Life | books 1-3, 5, 6 (book 4 missing) | 106 | en | Military ranks as titles (relational words must not carry ids); campaign calendar | 2 | Book 1 ch 1-4 | $1.5 | 106 + 11 |
| TTKS | five books | not sized | zh | Acquisition first; per-book brief, yearly-trait simulator content differs | 2 | after acquisition | n/a | plan after the editions exist |
| Reverend Insanity | whole, 4.96M words | 620 | en | Gu, aperture, Immortal Gu as `item`/`creature`; long-timeline pass 2 waves | 2 | Chapters 1-10 | $8.7 | 620 + 62 |
| Circle of Inevitability | 2.05M words | 257 | en (scrape) | Settle the edition first | 2 | 5 shards | $3.6 | 257 + 26 |

AU13's repair reserve is min(3, ceil(0.1 x N)) agent invocations; at batch scale that cap would starve a 100-shard book, so this plan reserves 10% of N in repair requests
(cents, not usage-window points). That is a proposed change to the finite plan and needs Weibao's yes with the books.

**English runtime adapter (prerequisite, one lane for all English books).** The lint and shard tools are Chinese-only today: `LOCATOR` in `lint_lead_run.mjs`
(`zh 第N章 pM`), `parseShard`'s `第N章` header, the CJK quote guard (six or more characters), `extractCandidates` patterns in `shard_tools.mjs`, `prepare_shard.mjs`
(EPUB nav parsing), and the schema card's units (pence, soli, pounds). Needed: a per-world language profile (locator form, header pattern, quote guard in words, candidate patterns,
units, glossary source), selected by the plan's `world`. Without it every English row fails lint. Until it lands, the Chinese books (LOTM) are the only batchable ones.

## 5. LOTM volume 1 remainder (dry run done)

Plans (paths and ids only; request files are private): [pass 1](plans/lotm_v1_ch121-213_pass1.json), [pass 2](plans/lotm_v1_ch121-213_pass2.json).
Shards for chapters 145-213 were prepared offline from the EPUB (`prepare_shard.mjs`, prefix `b4s42`...`b7s72` in the batch plans so they cannot collide with agent-read ids).

| Plan | Requests | Input tokens [I] | Output assumed | Batch cost |
| --- | --- | --- | --- | --- |
| Pass 1, census, ch 121-213 | 31 | 434,014 | 775,000 | $0.2155 |
| Pass 2, scenes and fills, ch 121-213 | 31 | 477,561 | 775,000 | $0.2176 |

Pass 2's dry run uses the glossary that exists today (2,907 hits); after pass 1 and its merge the hit lists grow, so re-run the dry run before submitting.
Order: pass 1 batch, collect, lint and grade, merge ids across shards, rebuild plan, pass 2 batch, collect, grade.

### A/B plan (first live batches, about $0.015 in all)

One graded wave-3 shard, `w3s33` (chapters 94-96, grade B: 6 scenes, 126 census rows, 4 fills, name accuracy 1.0, about 145,000 agent tokens), is re-read by batch.
The glossary is built only from shards before chapter 94 (`w1`, `w2`, `w3s30`-`w3s32` plus earlier), the same inputs the agent reader had, so its own answers do not leak in.

| Batch | Plan | Output prefix | Tests |
| --- | --- | --- | --- |
| A | [ab_w3s33_full](plans/ab_w3s33_full.json), one request, estimate $0.0071 | `w3s33x` | Single-pass shape vs the agent result; **also the first test of the strict output schema** |
| B | [ab_w3s33_census](plans/ab_w3s33_census.json), one request, estimate $0.0070 | `w3s33y` | Pass 1 shape: census recall and cost alone |

Compare with `node scripts/lead_run/batch_compare.mjs <private dir> w3s33m w3s33xm`: grade, census recall of the agent's names, names found only by batch, scene, option and fill counts, name accuracy;
tokens and dollars from `<label>_usage.csv` against about 145,000 agent tokens. **Switch rule (from the handoff): grade A or B and census recall at least 0.9 of the agent run**, plus measured output tokens
within 2x of the 25,000 assumed (otherwise re-cap the books). If the strict schema is rejected with a 400, set `"schemaMode": "prompt"` in the plan (schema in the prompt, JSON parsed and linted in code) and re-run the A.

## 6. The runner

| File | Job |
| --- | --- |
| [batch_lib.mjs](../../../../scripts/lead_run/batch_lib.mjs) | Schemas per pass, stable system prefix, request builder, estimate, client factory, result parsing, collect, repair merge |
| [batch_submit.mjs](../../../../scripts/lead_run/batch_submit.mjs) | `--plan`; default is a **dry run** that writes `<label>_requests.jsonl` and `<label>_estimate.json`; `--live` needs the key and `--max-usd` at least the estimate |
| [batch_collect.mjs](../../../../scripts/lead_run/batch_collect.mjs) | Poll, download, key by `custom_id`, write only the files the pass returned (a scenes pass never blanks the census), migrate, audit gate and header, `<label>_usage.csv` per request (AU12); repairs are decided on the migrated rows, so structural failures that `migrate_shard` fixes for free cost nothing |
| [batch_compare.mjs](../../../../scripts/lead_run/batch_compare.mjs) | A/B metrics |
| [test](../../../../tests/lead_run_batch.test.js) | Mocked client; no network |

Key handling: read only from `ANTHROPIC_API_KEY` at run time, passed explicitly with the base URL; `authToken` is forced null so no other credential, profile or
base URL is picked up. A missing key stops with a clear message; there is no fallback to the subscription or another model. The key is never printed, logged or written
(receipts hold batch id, counts and estimate only).

### Store the key once, then run

Create a key in the Anthropic Console for this use, in its own workspace, and **set a monthly spend limit on that workspace** (the real hard stop; `--max-usd` is only a check on the estimate). Then:

```bash
security add-generic-password -a "$USER" -s anthropic-api-yairpg -w
```

It prompts for the key without echoing it, so it stays out of shell history. Dry run needs no key:

```bash
node scripts/lead_run/batch_submit.mjs --plan docs/gm/dispatch/batch-reading-2026-10-27/plans/ab_w3s33_full.json
```

Live submit, key only in the child process environment:

```bash
ANTHROPIC_API_KEY="$(security find-generic-password -a "$USER" -s anthropic-api-yairpg -w)" node scripts/lead_run/batch_submit.mjs --plan docs/gm/dispatch/batch-reading-2026-10-27/plans/ab_w3s33_full.json --live --max-usd 0.05
```

A repair batch (written by collect) is submitted from its request file under the same cap rules:

```bash
ANTHROPIC_API_KEY="$(security find-generic-password -a "$USER" -s anthropic-api-yairpg -w)" node scripts/lead_run/batch_submit.mjs --plan <plan.json> --requests <outDir>/<label>_repair_requests.jsonl --live --max-usd 0.05
```

Collect (the first Keychain read may show a macOS access prompt):

```bash
ANTHROPIC_API_KEY="$(security find-generic-password -a "$USER" -s anthropic-api-yairpg -w)" node scripts/lead_run/batch_collect.mjs --plan docs/gm/dispatch/batch-reading-2026-10-27/plans/ab_w3s33_full.json --batch <msgbatch_id from the receipt>
```

**The go phrase for the first live batches:** "Go on batches ab-w3s33-full and ab-w3s33-census, cap $0.05 each." (Each later batch needs its own go with its label and cap. A live submit refuses to run twice for one label unless `--resubmit` is passed.)

About "DSH's key": I did not look for, read or use any other tool's key. If DSH means the DeepSeek harness, its key is for a different provider and cannot call Claude Haiku on Anthropic's Batch API [I]; this route needs an Anthropic key.

Verification (2026-10-27): `node --test tests/lead_run_batch.test.js` 12 pass (mocked client, includes a census-then-scenes collect, the graded-only glossary, repair submit and the SDK surface of the pinned 1.3.0); full `npm test` 3579 pass after the final runner edits; `check:arch` and `check:rules` pass. `npm run build` was not run: no `src` file changed. No live call was made and no key was read. Implemented and mock-tested, **unverified against the real API**.

## 6a. API rules found (live rejections plus the docs, 2026-10-27)

Sources: [structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs), [batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing), [prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) [S].

| Rule | Consequence here |
| --- | --- |
| Strict schema: at most 24 optional properties and 16 union-typed properties per request; recursive schemas, numeric and string constraints unsupported; plus undocumented grammar-size limits (each optional property roughly doubles part of the grammar). | Three live rejections: 38 optionals, then 41 unions, then "compiled grammar too large" on the combined scenes+census+fills schema. The census-only schema compiled and ran. |
| Docs' simplification order: make fields required, flatten nesting, split work across requests. | The two-pass shape (census, then scenes and fills) fits the limit; the combined single call uses `schemaMode: "prompt"` instead. |
| A batch is capped at 100,000 requests or 256 MB; most finish within 1 hour; expire at 24 hours; results kept 29 days; requests that expire are not billed. | One batch per pass per book fits (largest book: 620 requests). |
| **Batches can go slightly over the workspace spend limit** (high concurrency). | The Console limit is a soft stop for batches. Keep `--max-usd` on every submit and size each batch to its cap; do not rely on the limit alone. |
| Batch discount stacks with caching; the docs advise the 1-hour cache for shared context because a batch can outlast 5 minutes. Cache reads cost 0.1x input; 1-hour writes 2x; Haiku 5.5 minimum cacheable prefix is 512 tokens. | The system prefix now uses `ttl: "1h"` (about 3,500 tokens, a one-time $0.0004 write per batch). First live census batch already showed 2,906 cache-read tokens with the 5-minute default. |
| Haiku 5.5 batch price: $0.05 input / $0.25 output per million (up to 100K-token prompts); over 100K it doubles. | Matches the estimate basis; keep prompts under 100K. |
| `max_tokens: 0` is not allowed in a batch. | Not used. |
| Batches are scoped to a Console workspace. | Use a dedicated workspace for this campaign. |

**First live results (2026-10-27/28, $0.0129 spent in all, six requests, three rejected at $0):**

| Batch | Shape | Result | Cost |
| --- | --- | --- | --- |
| B `ab-w3s33-census` | Pass 1, strict schema | Succeeded: grade B, 119 census rows (agent run 126), name accuracy 1.0, **recall 0.778** (gate 0.9), 20 names the agent run lacked; 18,685 input (2,906 cache read), 25,984 output tokens | $0.0074 |
| A `ab-w3s33-full` | Single call, prompt-mode schema | Succeeded but **grade C**: only 35 census rows (recall 0.21), 5 scenes with **0 options and 0 choices** (agent run: 7 options), three lint issues (Chinese text copied into a `place` field and one `whereabouts`; one name off its locator); 16,997 output tokens | $0.0055 |

**Recall, three ways (batch B vs the agent run, which is itself agent output, not ground truth):** row count 119 of 126 (94%); exact-name overlap **0.778**; with name variants (a full name versus its given name, titles and kinship words excluded, names under 2 characters excluded) **0.897**, defined after seeing the data and still under 0.9, so it is not a pass. Of the 28 exact misses, 15 are variants and 13 are true misses (singletons such as places, notes, calendar years). A free local fix, `addMissingKnown` in collect (known glossary names found in the shard text but absent from the census get an M0 row with `claimant: script`; nothing invented), lifts the same output to 145 rows, exact recall 0.881, with variants 0.929. Those 26 rows are script-added from the known-names table, not reader observations; some short names may be false hits, so spot-check them before trusting the figure.

**Round 2 (same shard, 2026-10-28; $0.0236 more, running total about $0.037):**

| Batch | Result | Cost |
| --- | --- | --- |
| Census, Haiku **medium** effort | 135 reader rows, 24 of the 27 new entities found (0.889; low effort 0.63); recall with script fill 0.95 exact, 0.98 with variants; grade C from 6 duplicate ids that the script fill caused (fixed afterwards: the fill now skips ids the reader already used; 2 duplicates remain offline) | $0.0112 (40,437 output tokens) |
| Census, Sonnet 5.5 **low** effort | Only 20 reader rows (3,322 output tokens); recall came from the script fill; new-entity recall 0.26. This tests effort, not the model | about $0.04 (collect priced it at Haiku rates; fixed) |
| Scenes pass, strict schema | Rejected: "compiled grammar too large" even alone. The scene schema cannot be strict. | $0 |
| Scenes pass, prompt mode, **low** effort | Grade C (9 lint issues): 6 scenes but **0 options, 0 choices, almost no steps**, 1 fill (agent run: 7 options, 6 choices, 9 steps, 4 fills); 8,719 output tokens | $0.0034 |

**Round 3 (scenes pass in prompt mode, same shard; $0.0159 more, running total about $0.053):**

| Scenes effort | Result | Cost |
| --- | --- | --- |
| Low | Grade C, no options or choices (round 2) | $0.0034 |
| Medium | Grade C (2 lint issues); 8 scenes, options in 3 and choices in 3 | $0.0054 (17,628 output) |
| **High** | **Grade B, 0 lint issues**; 7 scenes, options in 6 and choices in 6 of 7 (agent run: 6 scenes, options and choices in all 6), 4 fills (agent run 4); but 4 of 7 scenes marked `great` (agent run: 1), so the weight label needs a spot check | $0.0105 (38,364 output) |

**Best settings so far:** census at medium effort ($0.011) plus scenes at high effort ($0.0105), about **$0.022 a shard for both passes**; the 31 remaining LOTM shards would cost about $0.69 at this rate. Still one shard (n=1): the pilot on other graded shards must confirm it, and `weight: great` needs a check against the agent run.

**What the evidence says:** (1) 99 of the agent run's 126 census rows are names already in the glossary; only 27 are new entities, and only those test the model. Measure recall on new entities, not on all rows. (2) **Effort is the lever.** Low effort under-writes both passes; medium raised new-entity recall from 0.63 to 0.89. (3) The scenes pass needs prompt mode and a higher effort; that has not been tried. (4) The combined single call stays rejected.

**Conclusion:** the single combined call is rejected: with scenes to write the model spends its output on scenes and drops the census and the option rows. The two-pass shape stands (census alone gets 78% recall at $0.007 a shard). The switch rule is **not yet met**: recall 0.778 is under 0.9. Round 1 follow-up, run 2026-10-28 (see round 2 above). **Run 2026-10-28 (Weibao: go ahead):** scenes pass at [medium](plans/ab_w3s33_scenes_medium.json) and [high](plans/ab_w3s33_scenes_high.json) effort, each on the medium census (about $0.01 and $0.02), phrase "Go on the w3s33 scenes medium and high batches, cap $0.05 each." Superseded round 1 plan: three new labels: [scenes pass](plans/ab_w3s33_scenes.json) on the batch's own graded census (prefix `w3s33y`, strict first; $0.007), [census at `effort: medium`](plans/ab_w3s33_census_medium.json) ($0.007), and a [Sonnet 5.5 census](plans/ab_w3s33_census_sonnet.json) as a ceiling check ($0.14). Then a 3-shard pilot of the winning settings on other graded shards (for example `w2s25`, `w3s36`) before the 31-shard pass, since one shard is n=1 (AU4). Go phrase: "Go on the w3s33 scenes, census-medium and Sonnet census batches, cap $0.05, $0.05 and $0.30." Dollars are not the issue: one shard is under a cent, so a second pass or a Sonnet re-read is affordable.

## 7. Risks and open points

| Code | Item |
| --- | --- |
| R1 | The strict output schema is untested against the API; the A batch is its first test; fallback `schemaMode: prompt`. |
| R2 | Output tokens (25,000 per shard) and Haiku 5.5's thinking at `effort: low` are assumptions; the A/B measures them and sets each book's cap. |
| R3 | Batch prompt caching is best effort; estimates assume no cache hits. |
| R4 | Token estimates are character counts; `count_tokens` could refine them but needs the key and is not called in dry runs. |
| R5 | English books fail lint until the language adapter exists (section 4). |
| R6 | Privacy: source text of held books goes to Anthropic's API under its standard retention; outputs, request files and ledgers stay private and gitignored. |
| R7 | Agent output quality equals the agent run only if the A/B says so; census recall is the gate. |

## 8. More to consider (round 1)

**ACT NOW (done):** runner, mocked test, dry runs and plans, TOOL_REGISTRY row, register row, status pause, vision record.

**ACCOUNT FOR NOW:**
- Set the workspace spend limit before the first live call; it is the only enforcement outside this repo.
- The Keychain read can prompt; do the first collect while at the machine.
- Pass-1 output is untrusted until graded: only A or B shards enter the glossary.
- Source EPUB shards carry copyrighted text in the request files; keep `batch/` out of any export or backup that leaves the private folders.
- A batch is all-or-nothing in time (up to 24 hours); the usage CSV is the record of cost, not the Console.

**LATER / DELEGATE:**
- Language profile and English adapter (code lane; done when a Harry Potter year 1 shard lints clean and `check:arch` passes; effort: one lane).
- Sonnet spot check as a batch (10% of rows per book at about 10x the haiku price per token still costs cents); level: sonnet; done when `spotChecked >= 5` is recorded in headers.
- Cross-shard id merge script (PL-L16) as a pass 1 to pass 2 step; done when the merged glossary is one file with unique ids.
- Acquisition of TTKS editions before any TTKS plan.
- A Soldier's Life book 4: find or acquire.
- Prompt-cache the glossary prefix if the same shard set is read in several variants.
- Compare against the local-AI reader test when its report lands (`docs/research/LOCAL_AI_READER_TEST_2026-10-27.md` did not exist at planning time).
