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
