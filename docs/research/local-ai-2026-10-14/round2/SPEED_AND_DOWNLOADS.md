# Download status and Apple Silicon speed follow-up

October14,2026. Requested follow-up to the round2 re-audit. Read-only local diagnosis and primary-source research. No inference, cancellation, installation, runtime/configuration/power change or game edit.

## F1: Downloads are still incomplete

The local installed-model API still lists only `qwen3.8:27b` NVFP4/MLX. Three `ollama pull` processes have run for approximately70minutes. Ollama has open remote connections and partial model files. Logs repeatedly report stalled parts and retries, including unexpected EOF for the Huihui blob. Active process is not proof of healthy progress; there is no reliable ETA.

Fresh registry manifests identify these packages. [Evidence JSON](speed-followup-evidence.json) saves capture time, full manifest and locally observed completion counters.

| Code / model | Registry layer bytes | Local evidence at capture |
|---|---:|---|
| D1 `qwen3.8:27b-mxfp8` |31.66GB|14.23GB in completed exact-size blobs;965/1208 layers present. Additional `.tmp` transfer bytes excluded. This is a lower bound, not an exact progress percentage. |
| D2 `gemma4:31b-mlx` |19.42GB|8.56GB in completed exact-size blobs;406/1248 layers present. Additional `.tmp` transfer bytes excluded. Current registry config includes a draft-model descriptor. |
| D3 `huihui_ai/Qwen3.8-abliterated:27b-q8_0` |29.98GB|14.50GB checkpointed inside the29.05GB main model layer, plus a0.93GB projector still needed unless already transferred. Partial counters are snapshots, not completed installation. |

Exact-size blob presence was checked, not independently rehashed. Layer counts are not byte percentages. A preallocated partial file's logical size is not bytes successfully downloaded. Other work started these pulls; this chat did not start or stop them. The previous installed-only answer could not establish download state.

Sources: [Qwen tag](https://ollama.com/library/qwen3.8:27b-mxfp8), [Gemma tag](https://ollama.com/library/gemma4:31b-mlx), [Huihui tag](https://ollama.com/huihui_ai/Qwen3.8-abliterated:27b-q8_0), corresponding public registry manifests saved in evidence JSON, local process/file/log checks.

## F2: These are experiments, not an established optimal set

| Code / disposition | Assessment |
|---|---|
| O1 Keep existing4-bit Qwen as default baseline | Already available and locally measured. Test useful response latency and semantic discipline before spending more memory on precision. The source identity caveat from REPORT remains. |
| O2 Deprioritize MXFP8 for everyday interactive use | A precision-control experiment can be worthwhile if a concrete4-bit failure improves. Its31.66GB package costs about1.74times the installed18.17GB package. Higher precision alone does not prove a meaningful YAIR gain or faster kernels. |
| O3 Keep Gemma31B as an optional different-family quality trial | About19.42GB package; more sensible capacity than another30GB quant. Still a large dense model, with no local speed/fiction acceptance established. A31B label does not make it the fastest Gemma. |
| O4 Deprioritize Huihui Q8 as the first reduced-refusal experiment | A29.98GB package changes both fine-tune and quant/runtime path relative to incumbent. It does not isolate the cause of any quality difference. Stock Qwen already complied with the tested fiction. If a refusal gap exists, qualify a smaller quant of the same pinned derivative before assuming Q8 is worth its cost. |
| O5 Separate speed challenger from creative challenger | Gemma26B-A4B and Qwen35B-A3B MoE are concrete speed candidates; a smaller9B companion is another route. Active-weight computation can lower per-token cost while full weights still consume memory. None inherits Qwen3.8 reasoning or Hemmingway writing results. |

This is a recommendation about trial order. No download is cancelled or replaced by this report. Three simultaneous large transfers are not required to answer which model is useful. If retrying transfers are later addressed, preserve their resumable state and identify their owning worker first.

## F3: Speed sources that change the decision

**Matched hardware, bounded metric.** An [M5 Pro64GB benchmark](https://github.com/daniel29348679/m5pro-llm-bench/tree/e39c76475a4ecd21155d5adaf1c940bf8844de1c) reports decode averages84.90tok/s for Qwen3.6-35B-A3B-MTP,55.52 for Gemma26B-NVFP4 and33.81 for Qwen3.8-27B-MLX. These span runtime versions and model packages. Most importantly, the [exact Qwen report](https://github.com/daniel29348679/m5pro-llm-bench/blob/e39c76475a4ecd21155d5adaf1c940bf8844de1c/results/ollama_0.32.13_update/installed/qwen3.8_27b-mlx.md) says all12 samples hit output limits and six returned reasoning only. Its throughput ranking is not completed-answer speed. Cached prefill measurements cannot be used as cold prompt throughput.

**Precision versus useful output.** A separate [M4 Max experiment](https://github.com/Alexander-Ollman/qwen3.8-on-m4max/tree/11cbfb241fde71b44b3d69e117d2e34fa97c9a18) reports NVFP4 decoding1.72times faster than MXFP8, with both scoring16/18 on its small accuracy set. It interleaved conditions and included a drift canary. This is useful evidence against presuming8-bit is worth the tradeoff; it is not an M5 Pro prediction or proof of equal quality on fiction.

**MTP is workload-dependent.** [Ollama's implementation account](https://ollama.com/blog/faster-gemma-4-mlx-mtp) describes adaptive draft length, batched verification and reduced repeated weight reads. Its nearly90% claim is Gemma12B NVFP4 on M5 Max/Aider, not Gemma31B on this Mac or YAIR prose. Overly long drafts can hurt when rejected. The local incumbent log already shows speculative decoding, so “enable MTP” is not evidence of a missing feature. Do not blindly set draft8 or copy one benchmark's draft3/4.

**Quantization has architecture/runtime conditions.** [Ollama's NVFP4 blog](https://ollama.com/blog/mlx-performance) reports improved quantization quality and throughput in its selected Gemma12B comparisons. It also explains snapshot caching for recurrent/sliding-window histories. This supports investigating exact package/cache behavior; it does not certify every NVFP4 quant or eliminate cold prefill. Current server0.40.3 is newer than these benchmark versions, so an upgrade is not automatically the fix.

**Conflicting deployment advice.** An [M5 Pro48GB guide](https://github.com/xiaoxianxian/qwen3.8-deployment/tree/7b8b0e0f3ffafd9dfe1cd18768d37e511f6f11ca) gives both early40.8tok/s and a later controlled29.9tok/s Qwen result, explicitly warning that the methods differ. It recommends manual MTP settings, while the exact64GB report describes automatic inline MTP. Preserve that disagreement; verify local acceptance rates/settings in a selected measurement rather than treating either recipe as universal.

A submitted [oMLX benchmark](https://omlx.ai/benchmarks/performance/b8z0k2qz) reports18.4tok/s for MXFP8 at8K on an M5 Max with29.6GB peak memory. It is another hardware/runtime condition, not a cross-system prediction for this Mac. Peak memory and methodology differ from process-footprint readings.

## A1: What to optimize next, without changing anything now

The useful metric is **time to a usable final response**, including cold loading, actual prompt processing, queued work, thinking, final generation and review. Record first final-answer token separately from first reasoning token. At25tok/s,600 generated tokens already require24seconds before other overhead;100 tokens take4seconds. An18GB model is not automatically slow enough to require replacement if the task needs a short reply. An8-bit model cannot rescue an unnecessarily large reasoning budget by its name alone.

For a later authorized measurement, use the incumbent first, one model loaded, short companion and bounded YAIR packets, thinking off versus one justified bounded-thinking condition, actual4K/8K envelopes, cold versus warm, and complete retained failures. Include MTP accepted/drafted tokens and queue delay. Compare one challenger only after naming the gap. Preserve source/quant/template/runtime identity and record current power mode; no switching power policy or upgrading runtimes is authorized by this research.

The prior outcome-based shortlist remains in [REPORT.md](REPORT.md): a speed experiment does not replace blind fiction preference, semantic checks or useful-output yield. The remaining authoritative gate is still the selected local trial and Weibao's review. No optimal model/configuration has been demonstrated here.
