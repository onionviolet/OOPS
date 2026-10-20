# Local AI: newer models, larger models and better 27B variants

2026-10-14. Research and proposals only. Human request: “For local ai, consider better ai models and more”, clarified as “better versions of the 27 b and more? Are there later and greater models and more?” No model download, replacement, inference trial, game integration or accepted product decision occurred.

## F1: verified local baseline

Read-only hardware inspection reports an Apple M5 Pro MacBook Pro with 64 GiB unified memory. Ollama's local `/api/tags` reports only `qwen3.8:27b`, 18,174,721,847 bytes, safetensors, NVFP4, MLX runner, digest `47951e4a666180bc2aedfc93c169472f2de783696fe196efbf063f5730ecf163`. `/api/ps` reports no loaded models. A model's installed name does not certify its performance or exact correspondence to today's remote tag. Pin the local digest for comparisons; do not silently refresh it.

Repository searches found local-model proposals in [P15 LLM options](../gm/dispatch/procgen-2026-10-13/p15/LLM_OPTIONS.md) and [T5 invention routes](../gm/dispatch/research-tech-2026-10-14/t5/LLM_ROUTES.md), with no matched Ollama/MLX adapter in the searched JS/Python source and scripts. This is bounded search evidence, not proof about every possible external tool.

## O1: upgrade candidates

Official catalogs and model documentation were checked on this date. Sizes below are listed download sizes, not peak runtime memory. All recommendations are trial priorities, not measured quality rankings.

| Candidate | What changes | Recommendation for this Mac |
|---|---|---|
| Qwen3.8 27B MXFP8, about 32 GB; Q8_0, about 30 GB | Less aggressive compression than the installed NVFP4; same model generation | First quality experiment. May recover quantization losses; speed, quality and memory headroom need measurement. Compare MLX MXFP8 first to reduce runtime differences. |
| Qwen3.8 27B BF16, about 56 GB | Higher precision reference, same generation | Park for ordinary laptop use: weights leave little room for macOS, apps, context and scratch memory. |
| Gemma 4 31B, about 19–20 GB in listed quantized variants | Different model family, slightly larger dense model | First alternative-family experiment for dialogue and content drafting. No evidence yet that its writing fits this game better. |
| Gemma 4 26B A4B, about 16–19 GB | Mixture of experts with fewer active parameters | Latency/quality candidate. Lower active count does not remove storage for all weights or guarantee faster execution. |
| Qwen3.6 35B-A3B, about 23–24 GB at lower precision, 38–39 GB at higher precision | Larger total parameter count, older generation, sparse activation | Compare for structured proposals or speed if the 27B baseline fails those tasks. Larger does not establish better quality. |
| Qwen3-Coder-Next Q4_K_M, about 52 GB | Coding specialist, 80B total / 3B active | Park unless local development becomes the main goal; tight headroom and little reason to choose it for NPC voice. |
| Qwen3.5 122B, about 81 GB | Much larger older model | Outside comfortable resident operation on 64 GiB. More memory or a separately chosen remote machine is the practical route. |

[Qwen3.8 official release repository](https://github.com/QwenLM/Qwen3.8) and [official model card](https://huggingface.co/Qwen/Qwen3.8-27B) document the 27B release. Targeted searches for Qwen3.9 and Qwen4 did not establish an official successor. This search result means **no verified later successor found**, not a claim that no newer model exists anywhere. A recently updated quantization/tag is not a new model generation.

Sources: [Qwen3.8 variants](https://ollama.com/library/qwen3.8/tags), [Gemma 4 catalog](https://ollama.com/library/gemma4), [Google model overview](https://ai.google.dev/gemma/docs/core), [Qwen3.6 variants](https://ollama.com/library/qwen3.6/tags), [Coder-Next](https://ollama.com/library/qwen3-coder-next), [Qwen3.5 catalog](https://ollama.com/library/qwen3.5). Catalog variants and runtime support can change.

## O2: improvements beyond weights

Use separate task profiles: short optional NPC expression, typed-intent interpretation, and slower development-time pack drafting. Do not assume one model or one reasoning budget is best at all three. Preserve the existing authored/grammar baseline and deterministic game authority described by P15/T5; this report does not narrow their reachable experiments.

Improve selected context before buying more parameters: retrieve only relevant, actor-visible facts; keep canon evidence and player knowledge distinct; retain source locators for authoring. Avoid feeding the whole world dossier into every NPC turn. Large advertised context does not prove reliable recall or acceptable latency.

Use schema-constrained proposals where supported, then semantic and native-consumer validation. JSON validity alone cannot certify executable effects, truth or feasibility. Freeze admitted artifacts and exact accepted speech so reload/import requires no regeneration. Scope caches to world instance, actor knowledge, content revision and request identity.

[MLX LM](https://github.com/ml-explore/mlx-lm) documents prompt caching and quantized execution. The incumbent already uses an MLX runner; changing runtimes alone is not an established upgrade. Compare bounded context, thinking controls, prefix caching and supported speculative decoding separately. Measure cold start and warm turns; do not infer battery cost from tokens per second.

## A1: proposed next experiment, not executed

Compare the existing digest, Qwen3.8 27B MXFP8 and Gemma 4 31B sequentially on identical synthetic, source-neutral fixtures. Use dialogue, structured content proposals, ambiguous intent and contradiction cases. Record exact revisions, quantization, context, decoding settings, cold/warm latency, peak memory, valid-and-useful output rate, factual changes and blind voice preference. Measure task success per elapsed second rather than parameter count. Keep sensitive scenes authored and test secrecy only with synthetic IDs.

Stop a candidate on unacceptable memory pressure or loss of foreground responsiveness. A proposed adapter trial must later cover unavailable model, timeout, malformed/stale output, failed save and exact reload/import while the model is absent. Rebuilt desktop browser behavior and director taste remain separate future gates. All model-quality, performance and gameplay gates are OPEN. Only this report was added; shared live owners and unrelated dirty files were preserved.

## Round 2, 2026-10-20: speed for game decisions

Weibao: "best local ai to use and other stuff and more?", then "would the 35b
even be faster? More to consider?" Context: AI playthroughs
([harness palette](../AI_PLAYTEST_HARNESS_CONSIDERATIONS_2026-10-20.md), where
PT64 measured about 6 s and 600 decisions an hour). Measured on this Mac, quiet
machine, one synthetic five-choice village scene (131 to 142 prompt tokens),
thinking off, temperature 0, seed 42, two warm runs each.

| Model | Answer format | Output tokens | Warm time per decision |
| --- | --- | --- | --- |
| `qwen3.8:27b` (NVFP4) | JSON with a one-sentence reason | 37 | 3.5 to 5.4 s |
| `qwen3.8:27b` | JSON `{"choice": n}` | 9 | 1.3 to 2.0 s |
| `qwen3.8:27b` | bare number | 1 | 0.39 to 0.43 s |
| `gemma4:31b-mlx` | JSON with a reason | 32 | 6.1 to 8.9 s |
| `gemma4:31b-mlx` | JSON `{"choice": n}` | 6 | 1.5 to 1.9 s |
| `gemma4:31b-mlx` | bare number | 1 | 0.53 to 0.55 s |

Cold load was 9 to 11 s. Repeating the same prompt prefix dropped prompt time
from 1.25 s to 0.16 s, because Ollama reuses the cached prefix.

| Code | Finding or angle | Disposition |
| --- | --- | --- |
| F2 | **Output length is the cost, not the model.** On the same 27B, a bare choice number is about ten times faster than JSON with a reason. That takes the harness from about 600 to several thousand decisions an hour with no download | ACT NOW (measured above) |
| F3 | **Would a 35B-A3B MoE be faster? Yes at writing text, barely at picking.** On Apple Silicon each generated token reads the active weights from memory. The dense 27B reads about 17 GB per token (measured 9 to 11 tokens/s); a 3B-active MoE reads about 2 GB, so it could plausibly write 3 to 5 times faster (estimate; community guides report 25 to 45 tokens/s). A one-token pick already takes about 0.4 s, mostly fixed overhead, so the MoE saves a fraction of a second there. It is an older generation (Qwen3.6) with far fewer active parameters, so choice quality is the open question | ACCOUNT FOR NOW: download it for a measured quality check, not for speed |
| F4 | **Asking for a reason changed the choice.** Qwen picked 3 (sell bread) with a reason and 2 (chop wood) as a bare number; Gemma picked 2 both ways. A short reason acts like brief thinking. Default: bare numbers for routine steps, a reason on sampled, surprising or high-stakes steps (danger, spending, choices that cannot be undone) | ACCOUNT FOR NOW. LATER: a fixture set scoring choice quality per format, Sonnet, low effort, done when each format has a hit rate on 20 or more scenes |
| F5 | **The 2026-10-14 upgrade stalled.** Its installer died with `qwen3.8:27b-mxfp8` at 72%. Gemma and the abliterated Q8 downloaded but were never checked or enabled, so `local-ai` still offers only `fast`, and its speed/cleanup job has polled since then | LATER: waits for Weibao's yes to finish it |
| O3 | **Stable prefix first, changing state last.** Rules, persona and hero sheet go in an unchanging prefix; the current scene and choices go at the end, so each step pays only for new tokens (measured 1.25 s down to 0.16 s) | ACCOUNT FOR NOW |
| O4 | **Cap and validate rather than constrain.** A `num_predict` of 1 to 3 plus parsing the number is enough for picks. Gemma generated about half as fast under `format: json` here as PT64 measured without it (cause unverified) | ACCOUNT FOR NOW |
| O5 | **Score every choice in one pass.** The model's probability for each choice number ranks all options for the price of one token, which helps "what else would a player try" coverage. Needs log-probability support in the runner (unverified for Ollama 0.40.3) | LATER, small: check runner support first |
| O6 | **The bottleneck moves.** At about 0.4 s a decision, the game clock and browsers become the limit again, which ties into the harness round on the speed dial and parallel runs. One loaded model with `OLLAMA_NUM_PARALLEL` can feed several bots | ACCOUNT FOR NOW |
| O7 | **Long overnight runs on a laptop.** Sustained inference heats the machine and drains battery. Default: plugged in, sleep held off (for example `caffeinate`) only for the run, stop on thermal pressure | LATER, with the first overnight run |
| O8 | **Smaller dense models (7B to 14B)** follow F3's logic: little gain on one-token picks and a likely quality loss | Park unless a fixture shows they pick as well |
