# Local models as LOTM lead-run readers, and DeepSeek Harness as a runner (2026-10-27)

Status: measured test, proposals only. Nothing here changes the reading protocol; the reading coordinator decides.
Owners: [READING_STATUS](../gm/dispatch/protagonist-life-2026-10-27/READING_STATUS.md), [reader brief](../gm/dispatch/protagonist-life-2026-10-27/READER_BRIEF_TEMPLATE.md), [schema card 1.3](../gm/dispatch/protagonist-life-2026-10-27/SCHEMA_CARD_1_3.md), [agent usage rules](../AGENT_USAGE_RULES.md) (AU5, AU15). Machine: Apple M5 Pro, 64 GB. Raw outputs are private and gitignored: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/localai-*`. Haiku outputs were not touched.

## Answer in four lines

1. **No local model can replace haiku on the full job.** Best result: lint pass and grade B on one shard (Qwen3.8 27B, both variants), grade C on the other; census recall 9% to 42% of haiku's rows; scenes thin (no options or choices to speak of).
2. **A script beats every model on the mechanical part.** Known-name census rows built straight from the brief's known-names table cost zero tokens, got name accuracy 1.0 and cover 60% and 63% of haiku's census rows.
3. **Local Qwen3.8 27B is usable for one narrow lane:** price, measure and time rows from the candidates table (sampled rows were accurate), at about 38 tokens/s. Not for scenes, not for new-entity discovery, not unattended without lint.
4. **dsh can drive local Ollama today** (`dsh-local`, already configured), but for a one-call-per-shard job it adds an agent loop and about 3,200 tokens of system prompt per call. A plain script against Ollama's API is simpler.

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

## Recommended split for the remaining 30-odd shards

1. **Script step (new, zero tokens):** generate known-name census rows from the brief's table before the reader runs; the reader then writes only scenes, fills and census rows for names not in the table, plus notes where a row needs one. Merge by id. Needs a small script in `scripts/lead_run/` (about 40 lines, the proof of concept is the scratchpad `script_census.py`, not committed) and a lint-clean alias rule for duplicate ids. This is the one change to start with.
2. **Haiku stays on scenes, options, choices, new entities and fills** (v3, one call per shard). All local lanes failed at these.
3. **Optional local lane, after step 1 proves out:** Qwen3.8 27B (fast profile) for price, measure and time rows from the candidates table, run overnight or in the gaps, with a hard rule: lint pass and every candidate accounted for, else fall back to haiku for that shard. Expected saving is small (10-15% of census rows), so skip it if step 1 already meets the budget.
4. **Do not use** Gemma, and do not use the Q8 abliterated model for readers.
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
| A1 | Add `scripts/lead_run/known_census.mjs` (table-derived census rows with alias merging) and wire it into protocol v3 prep | Reading coordinator | Output of a graded shard matches `known` names with name accuracy 1.0 and lint clean; reader brief drops those rows |
| A2 | Re-estimate haiku tokens per shard with A1 in place | Reading coordinator | Measured on one wave 4 shard against 150,000 |
| A3 | Decide on the optional Qwen price/time lane only if A2 misses budget | Weibao / coordinator | Two shards: lint pass, all candidates accounted, recall check |
| A4 | Anthropic API key route for a haiku batch via script | Needs Weibao's explicit yes | Spend within the stated promo credit |

## Gaps

One sample per model per shard; temperature 0, so each is a deterministic sample, not an average. No grade A attempt (no spot checks). Invented-fact rate rests on a 5-row hand sample plus an anchor check. Recall counts haiku as ground truth. The split design's haiku saving is an estimate; no v3 shard was run. Model times were measured one run at a time with other sessions active on the machine.
