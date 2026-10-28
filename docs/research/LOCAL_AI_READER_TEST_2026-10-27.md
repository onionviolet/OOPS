# Local models as LOTM lead-run readers, and DeepSeek Harness as a runner (2026-10-27)

Status: measured test, proposals only. Nothing here changes the reading protocol; the reading coordinator decides.
Owners: [READING_STATUS](../gm/dispatch/protagonist-life-2026-10-27/READING_STATUS.md), [reader brief](../gm/dispatch/protagonist-life-2026-10-27/READER_BRIEF_TEMPLATE.md), [schema card 1.3](../gm/dispatch/protagonist-life-2026-10-27/SCHEMA_CARD_1_3.md), [agent usage rules](../AGENT_USAGE_RULES.md) (AU5, AU15). Machine: Apple M5 Pro, 64 GB. Raw outputs are private and gitignored: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/localai-*`. Haiku outputs were not touched.

## Answer in five lines

1. **Round 1 (one big prompt, whole job): no local model can replace haiku.** Best was lint pass and grade B on one shard; census recall 9% to 42%; scenes thin.
2. **Round 2 (narrowed lane, see below) works.** Per-chapter chunks, a script for known names, schema-constrained output and deterministic repair gave **lint pass, grade B (census only), name accuracy 1.0 and census recall 87% to 93% on all 6 runs** (2 shards, 3 seeds), about 2 to 4 minutes per shard on `qwen3.8:27b`.
3. **The Q8 abliterated model is not needed.** Under the same lane it matched the fast model (recall 87%) but needed 40 locator repairs and held 30 GB.
4. **Scenes stay with haiku.** No local run was good enough on options, choices or motives.
5. **dsh can run local Ollama and its overhead can be cut from about 3,160 to 170 tokens per call** with a no-tools patch; a plain script is still simpler for this job.

## Method

- **Shards:** w1s16 (chapters 43-45, haiku grade A, 8 scenes, 57 census, 4 fills) and w2s20 (55-57, grade B, 7 / 46 / 3). Baseline is the graded migrated haiku output (`w1s16m_*`, `w2s20m_*`).
- **Prompt:** the shard's own assembled brief (template, schema card, known names, candidates), unchanged, plus a short override saying "no tools, reply with one JSON object `{scenes, census, fills}`" and the paragraph-numbered chapter text. One call per run. Ollama `/api/chat`, thinking off, JSON mode, temperature 0, seed 42, `num_ctx` 49152, one run per model per shard (no repeats: results are single samples).
- **Gate:** `audit_shard.mjs` unchanged (lint, locators, name-at-locator, grade). The grade B ceiling here is the script's own rule (lint ok and name accuracy at least 0.9); grade A needs 5 spot checks, which were not run.
- **Models:** `qwen3.8:27b` (NVFP4, MLX runner), `gemma4:31b-mlx`, `huihui_ai/Qwen3.8-abliterated:27b-q8_0`.
- **Memory:** Ollama `/api/ps` loaded size (weights plus KV cache). Ollama process RSS misses MLX/Metal memory, so it is only meaningful for the Q8 model (32.8 GB).
- **Recall:** share of haiku's distinct `zh` census names that the local run also has. It treats every haiku row as correct, which understates local models where haiku was incomplete and ignores whether extra local rows are right.
- **Invented facts:** no automatic check exists. Money anchors were checked against their cited paragraphs (all supported), and 5 random census notes per run on w1s16 were read against their paragraphs by hand. Small sample.

## Results

| Run | Lint | Grade | Scenes (haiku) | Census (haiku) | Fills (haiku) | Census recall | Name accuracy | Wall | Tok/s | Out tokens | Memory |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Qwen3.8 27B, w1s16 | pass | **B** | 6 (8) | 21 (57) | 2 (4) | 22% | 0.905 | 314 s | 39.9 | 9,695 | 18.2 GB |
| Qwen3.8 27B, w2s20 | fail (name-source 7) | C | 3 (7) | 12 (46) | 2 (3) | 17% | 0.667 | 104 s | 36.8 | 2,685 | 20.7 GB |
| Gemma4 31B, w1s16 | pass | C | 10 (8) | 13 (57) | 0 (4) | 13% | 0.769 | 228 s | 24.6 | 4,243 | 23.1 GB |
| Gemma4 31B, w2s20 | fail (placed-without-address 1) | C | 5 (7) | 5 (46) | 1 (3) | 9% | 1.0 | 131 s | 23.9 | 2,122 | 23.4 GB |
| Huihui Qwen3.8 Q8, w1s16 | pass | **B** | 7 (8) | 31 (57) | 3 (4) | 42% | 0.903 | 673 s | 20.9 | 12,778 | 29.3 GB (RSS 32.7) |
| Huihui Qwen3.8 Q8, w2s20 | fail (name-source 15) | C | 3 (7) | 19 (46) | 2 (3) | 28% | 0.737 | 302 s | 24.8 | 6,324 | 29.3 GB |

All prompts were 10.5k to 14k tokens (Chinese text is token-cheap), prefill 31 to 61 s. Wall time includes model load (0 to 16 s). Haiku wall time per shard was not measured here; its cost is about 130-150k tokens per shard.

**Known-name recall** (haiku rows whose name is in the brief's known-names table; 34 on w1s16, 30 on w2s20): Qwen 6 and 6, Gemma 1 and 1, Huihui 18 and 11. **New-name recall** (21 and 16 rows): Qwen 6 and 2, Gemma 6 and 3, Huihui 5 and 2. The models mostly ignore the table and stop early.

**Scene content** (haiku w1s16: 6 options, 6 choices, 11 motives; w2s20: 7 / 7 / 10): Huihui 3 / 3 / 8 and 1 / 1 / 3; Qwen 2 / 2 / 6 and 1 / 1 / 3; Gemma 0 / 1 / 1 and 0 / 1 / 2. Locators are valid on every run. Local scene boundaries follow the story, and three money anchors in each of Qwen and Huihui (w1s16) have a figure in the cited paragraph, but haiku recorded different anchors, so I did not match them.

**Invented or unsupported rows** (5-note hand sample on w1s16): Huihui 3 of 5 notes were unsupported by the cited paragraph ("Sleepless", "Squad leader" read as outside knowledge; one locator pointed at a paragraph without the name). The census-only Qwen run had 0 of 5 (all price rows, quoted correctly). Both Qwen3.8 variants also emitted a name absent from the shard text (a `·` versus `.` printing difference may explain one); the audit counts those as name misses (0.905 and 0.903 accuracy are 2 and 3 misses).

### Split design (local labels, haiku scenes)

Two parts were tested with no haiku involved:

| Part | Run | Result |
| --- | --- | --- |
| **A. Script, no model:** one census row per known-names table entry, first paragraph containing the exact `zh`, `rung M0`, id, label, kind and nameSource from the table | `script_census` on both shards | 44 and 55 rows, **name accuracy 1.0**, 0 tokens, 60% and 63% of haiku's census names. Lint flags 2 and 3 duplicate ids (one id, two spellings): merge as aliases. It also emits 11 and 26 names haiku did not list (short-name matches; unchecked) |
| **B. Local model, census only:** Qwen3.8 27B gets known names, candidates, schema card and chapter text; writes only census rows | w1s16 and w2s20 | w1s16: 26 rows, 158 s, lint pass, name accuracy 1.0, but known-name recall 2 of 34. w2s20: 63 rows, 362 s, recall 65%, known 23 of 30, but lint fail (`name-source` 42 invalid values, 1 duplicate). Price rows I read were correct and well-formed |

Variance is the finding: the same prompt style gave 2 of 34 and 23 of 30 known names. A model lane needs a recall check per shard (compare with the table) and a retry, so it is not a set-and-forget lane.

**Estimated haiku saving [I, not measured].** In haiku's output the census file is 55-57% of bytes written (18.8 of 33.8 KB on w1s16, 15.1 of 26.3 KB on w2s20). Part A removes about 60% of census rows, so about 33% of the bytes haiku must write, plus a shorter brief if the known-names table is dropped from it (the table is about a third of the brief's text). Under protocol v3 (one call, roughly 25-30k tokens per shard: 14k input, about 10k output) that is about 3-4k output tokens per shard, roughly 12-15% of the shard cost. Under the old agent loop, where output is resent on later calls, it was larger (guess 20-30%). Part B would remove price and time rows only (about 10-15% of census rows) and costs minutes of machine time per shard, so its saving is small.

## Verdict per model

| Model | Verdict |
| --- | --- |
| **Qwen3.8 27B (NVFP4, `local-ai --fast`)** | Fastest (37-40 tok/s, 1.7 to 5 min per shard, 18-21 GB, leaves room to work). Usable for candidate confirmation (price, measure, time rows) with lint and a recall check. Not usable for scenes (under-produces options and choices) or for census beyond the table. Grade B / C on the full job |
| **Huihui Qwen3.8 abliterated Q8** | Best coverage of the three (census recall 28-42%, most scene detail) but 2 to 3 times slower (21-25 tok/s, 5 to 11 min per shard), 29-33 GB resident (tight with other work on 64 GB), and the worst invented notes in the sample. Marginal gain over the fast model does not justify the slowdown. No refusal issue appeared, so the abliteration gives nothing here |
| **Gemma4 31B (MLX)** | Not usable: shortest outputs, census 5-13 rows, no options, no fills on one shard, grade C on both. Splits scenes finely (10 on w1s16) but without content |

Common failure: invalid `nameSource` values (lint `name-source`, 7 to 42 rows), early stop on the census, and notes that import outside knowledge.

## Round 2: census lane v2 (items 3, 4, 5, 6 from the follow-up)

Script: [local_census_lane.py](../../scripts/lead_run/local_census_lane.py) (proposal, not wired into the protocol). Changes against round 1:

- **Less input (5):** one call per chapter, each with only that chapter's text, its candidates and a one-line "already listed" names list. Prompts were 2.4k to 3.7k tokens each against 11 to 14k before.
- **Script does the known names (A):** rows for the known-names table, with exact id, label, kind, nameSource and first paragraph; duplicate ids merge as aliases.
- **Structured output (6):** Ollama JSON schema with the `kind` enum, a locator pattern and optional amount fields. The script sets `nameSource` (always `pinyin-unconfirmed` for model rows), `rung`, and all fixed fields, and parses money amounts from the Chinese numerals (model amounts as fallback; a price with no amount becomes a `note`).
- **Repair (3):** every model row's `zh` is checked against its cited paragraph; a wrong locator is moved to the first paragraph that contains the name, and a name found nowhere is dropped. The id is rebuilt as `lotm.<kind>.<slug>`.
- **Recall check (4):** if more than 30% of a chapter's candidates are not covered by any row, the chapter gets one retry listing the missing ones. It never triggered in these runs (0 retries in 18 chapter calls).

First draft of the lane failed lint (id-namespace 24, price-amount 11, duplicate 3); those three were fixed in the script and the six runs below used the fixed version. These are census-only results, so the "grade B" is the gate's best for a census-only file with no spot checks.

| Run | Rows (haiku 57 / 46) | Recall vs haiku | Lint | Grade | Name accuracy | Wall | Out tokens | Locators repaired |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Qwen 27B, w1s16, temp 0, seed 42 | 89 | 91% | pass | B | 1.0 | 224 s | 4,509 | 0 |
| Qwen 27B, w1s16, temp 0.3, seed 7 | 83 | 91% | pass | B | 1.0 | 139 s | 3,964 | 0 |
| Qwen 27B, w1s16, temp 0.3, seed 99 | 81 | 93% | pass | B | 1.0 | 129 s | 3,702 | 0 |
| Qwen 27B, w2s20, temp 0, seed 42 | 99 | 89% | pass | B | 1.0 | 168 s | 3,994 | 0 |
| Qwen 27B, w2s20, temp 0.3, seed 7 | 92 | 91% | pass | B | 1.0 | 117 s | 3,403 | 0 |
| Qwen 27B, w2s20, temp 0.3, seed 99 | 89 | 87% | pass | B | 1.0 | n/a | n/a | 0 |
| Huihui Q8, w2s20, temp 0, seed 42 | 92 | 87% | pass | B | 1.0 | 215 s | 3,489 | **40** |

- **Stability:** the three seeds share 74 of 96 names on w1s16 and 83 of 108 on w2s20 (about 77%); recall against haiku varied only 87% to 93%.
- **Precision:** the model rows haiku did not list are mostly real and supported by their paragraph (12-row sample on w2s20: about 8 real names, items, documents or dates; the rest generic nouns or idioms such as 几天, 半天, 齿轮). No invented facts in that sample. Rows haiku did list but the script/model missed are in the 7% to 13% gap. Extras are noise for the glossary, so the coordinator should decide whether to keep generic nouns.
- **What the lane cannot do:** `whereabouts`, `touchedByLead`, `claimant` and `rung` M1 stay at defaults, and the notes are short own-words labels, so the census is a name index, not the detailed haiku rows.

### Why Q4 Huihui would not have helped

The Q8 abliterated model (29-33 GB resident) has no advantage in the lane: same recall, 40 locator repairs, slower, and the memory it takes is the main risk on this machine. A 4-bit abliterated build (about 16-18 GB) would be the same size as the fast model with the same compression loss, so it would only add value if the official model refused source text. Neither model refused anything in these tests. Not worth downloading.

### Memory (measured, with a lesson)

During round 2 the Q8 run left `huihui_ai/Qwen3.8-abliterated:27b-q8_0` loaded (30.5 GB at 16k context) for the 10-minute keep-alive I had set, and **swap sat at 22.0 of 23.5 GB** at that moment (other apps and sessions also use memory, so not all of it is mine). I unloaded it with `ollama stop`; free memory went from 33% to 83%, but the swap file stays used until macOS reclaims it. Round 1 prompts at `num_ctx` 49152 also took more KV cache than the lane needs (the Qwen model showed 30 GB resident at that context against 18 GB at the model's own size). Lessons: use a small `num_ctx` (16384 is enough per chapter), keep one model at a time, and unload at the end of a batch. The script now sets `keep_alive` to 2 minutes and unloads its model when it finishes.

### dsh overhead (item 2)

Patch: [dsh_reader.patch.yml](../../scripts/lead_run/dsh_reader.patch.yml) disables every file, shell, todo, skill and working-directory tool and replaces the persona with one sentence. `dsh --profile headless --patch <local-work patch> --patch ~/.dsh/routes/local.yml --patch dsh_reader.patch.yml --json "Reply with the single word OK."` used **170 input tokens (against 3,160 with `dsh-local`)** and returned in 5.9 s. This is one trivial call; I did not run the reader job through dsh. The patch is applied per command, so it changes no standing dsh config.

## Recommended split for the remaining 30-odd shards

1. **Census lane (new, local, no haiku tokens):** run `local_census_lane.py` per shard on `qwen3.8:27b` (known names by script, the rest by the model per chapter). It produced a lint-clean census with name accuracy 1.0 and 87-93% recall in 2 to 4 minutes per shard. Haiku then writes only scenes, fills and any census detail the coordinator still wants (whereabouts, claimant). This is the one change to start with. The haiku saving is the whole census file, 55% to 57% of what haiku writes (estimate [I]), and the known-names table (29% to 35% of the brief) could shrink to a one-line list. The coordinator decides whether the lane's thinner rows are acceptable.
2. **Haiku stays on scenes, options, choices, new entities and fills** (v3, one call per shard). All local lanes failed at these.
3. **Hard rule for the lane:** lint pass and candidate coverage 70% or more, else fall back to haiku for that shard.
4. **Do not use** Gemma, and do not use the Q8 abliterated model for readers. Run one model at a time with a small `num_ctx`, and unload when done.
5. Keep the sonnet 10% spot check on script-generated rows too: the script's id and kind come from earlier graded shards (PL-A47), so a wrong earlier row propagates.

## dsh (DeepSeek Harness) as a runner

- **What it is:** a plugin agent harness (Cordis based; `~/Documents/Dev/deepseek-harness`). `dsh --profile headless "task"` runs one agent task and exits; `--json` streams events with per-step token usage.
- **Providers:** LLM adapters are `llm-deepseek` and `llm-pi-ai` (multi-provider: Anthropic, OpenAI, DeepSeek and any OpenAI-compatible endpoint by `baseURL`). Credentials are references (`apiKeyEnv` or a managed credential store), not values in config.
- **Local Ollama: yes, already set up.** `~/.dsh/profiles/headless/cordis.patch.yml` declares route `ollama-local` at `http://127.0.0.1:11434/v1` with model `qwen3.8:27b`; `dsh-local` and `dsh-work` use it. I ran `dsh-local --json "Reply with the single word OK"` (no tools): it returned OK in 8.7 s with 3,160 input tokens, i.e. about 3.2k tokens of harness prompt per call. It never touched the network beyond localhost. Smoke test `HARNESS_LOCAL_OK` from 2026-10-25 agrees.
- **Other routes already configured** (from `~/.dsh/setup/README.md`, not exercised by me): `dsh-haiku`, `dsh-sonnet`, `dsh-opus` use an **Anthropic Console API key** (promotional credit of $100 expiring 2026-11-10, no payment method on file) and `dsh-deepseek*` use a DeepSeek key. I did not call any of them.
- **Would it help as a batch runner? Not for this job.** Value of dsh is tools, sessions, delegation and hooks for agentic work. The reader job after protocol v3 is one prompt in, one JSON out, then lint; a 60-line script against `/api/chat` (the one I used) does that with exact control over context size, seed and JSON mode, and no per-call 3k-token overhead. dsh helps if a lane needs the model to read files or re-run lint on its own (agentic repair), and its Haiku route could in principle run the same reader at API price.
- **"Run dsh with my Claude tokens":** the official way to spend the Claude subscription from a script is the Claude Code CLI in headless mode (`claude -p`), which is what the existing haiku readers do. Putting subscription login tokens into a third-party harness may break Anthropic's terms and risk the account, so I did not configure that and recommend against it. dsh's `anthropic` route uses an API key, which bills separately (here from the promo credit, which expires 2026-11-10); using it for readers needs Weibao's explicit yes, and I did not use it. A sound use of that credit would be a small haiku batch via the same script pattern, after the yes.

## Next steps

| Code | Step | Owner | Done check |
| --- | --- | --- | --- |
| A1 | Review `local_census_lane.py` and wire it into protocol v3 prep (census from the lane, haiku writes scenes and fills only) | Reading coordinator | A wave 4 shard: lint pass, name accuracy at least 0.98, haiku brief without the census section |
| A2 | Re-estimate haiku tokens per shard with A1 in place | Reading coordinator | Measured on one wave 4 shard against 150,000 |
| A3 | Check the lane census with the 5-locator spot check on one shard (grade A path) and decide whether generic-noun rows stay | Coordinator | 5 locators match; keep/drop rule recorded |
| A4 | Anthropic API key route for a haiku batch via script | Needs Weibao's explicit yes | Spend within the stated promo credit |

## Gaps

Round 2 used the same two shards the lane was tuned on, so the 87-93% recall may be optimistic on other shards. Haiku is treated as ground truth. Memory in round 2 was not polled per run; the 30.5 GB figure is a later snapshot. The dsh patch was tested on one trivial call only. Round 1 gaps:

One sample per model per shard; temperature 0, so each is a deterministic sample, not an average. No grade A attempt (no spot checks). Invented-fact rate rests on a 5-row hand sample plus an anchor check. Recall counts haiku as ground truth. The split design's haiku saving is an estimate; no v3 shard was run. Model times were measured one run at a time with other sessions active on the machine.
