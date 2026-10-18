# MXFP8 versus NVFP4 follow-up

October 14, 2026. Recommendation only. No inference or transfer/runtime changes.

## D8: Defer default adoption, retain the precision-control option

Keep NVFP4 as the everyday baseline. MXFP8 is a useful controlled alternative if a named semantic failure improves enough to offset slower generation and greater memory use. The earlier recommendation to stop its download was too categorical: evidence supports low trial priority, not a finding that completing the artifact has no value. This follow-up qualifies D3 in [REPORT](REPORT.md). It does not authorize cancellation, resumption or deletion. A fresh endpoint check still lists only the incumbent and Huihui, with no resident model.

## F8: What the precision labels establish

MXFP8 and NVFP4 are different scaled floating-point quantization formats, not different parameter counts or new training. Higher weight precision can preserve the source model more closely, but the useful difference depends on conversion/calibration, sensitive tensors, native template, execution precision and kernels. A format label alone does not fully specify activation/cache precision or establish that every tensor uses the nominal bit width. NVFP4 is also not interchangeable with an arbitrary integer Q4 quant. Ollama's [selected Gemma12B comparison](https://ollama.com/blog/mlx-performance) reports less quantization loss than Q4_K_M; that is not a Qwen fiction-quality result.

The inspected packages are 31.66 GB versus 18.17 GB, about 13.48 GB more stored data or 1.74 times the size. This does not mean 1.74 times peak running memory. On this 64 GB Mac, MXFP8 is plausible for one-model authoring; desktop apps, speech, runtime buffers and growing context still need headroom. Fit does not establish optimality. Weight precision does not itself extend reliable context recall or supply durable memory.

## F9: Evidence versus inference

The [pinned M4 Max comparison](https://github.com/Alexander-Ollman/qwen3.8-on-m4max/blob/11cbfb241fde71b44b3d69e117d2e34fa97c9a18/README.md) reports NVFP4 decoding 1.72 times faster, essentially equal prefill and both formats scoring 16/18 on a small accuracy set. It supports retaining NVFP4, but does not prove equal YAIR scene quality or predict this M5 Pro's rate. A [recent M5 Pro report](https://github.com/ollama/ollama/issues/18833) found BF16 faster for prefill-only tiny decision models. Thus lower bits do not guarantee faster time to first answer, nor does higher precision guarantee a useful gain.

Our observed invented rules/authority, generic prose and missed constraints could arise from model capability, prompts, sampling or quantization; their cause has not been isolated. More bits may help, but cannot be credited with fixing them before a comparison. Current incumbent upstream lineage remains unverified. A same-tag MXFP8 comparison is initially an artifact comparison; a precision-only causal claim needs matching source checkpoint, template, sampling, context and MTP conditions.

## A2: Smallest useful decision check

If precision is the selected uncertainty, compare these two Qwen artifacts before adding another family. Use three fresh, independently checkable variants of the previously observed constraint/correction failure, two seeds and both artifacts: 12 initial outputs. Lock exact prompts and identities, count actual tokens, match thinking/sampling and total output budgets, and counterbalance order. Preserve draft/MTP behavior, cold/warm latency and failures. Add filled 4K/8K cases only if context sensitivity remains a named uncertainty.

Promote MXFP8 only if it repeatedly reduces important semantic errors or blind editing burden enough to justify its measured latency/memory cost. A tie favors NVFP4. Offline authoring can tolerate extra seconds more readily than voice, so a specialist MXFP8 role remains possible without becoming the companion default. No numeric threshold or new acceptance rule is imposed. The authoritative gate remains the selected local comparison and Weibao's blind acceptance.

Download completion and model adoption are separate decisions. Previously transferred bytes are sunk cost, but remaining bandwidth, available disk, contention and the value of a ready comparison artifact are real forward costs and benefits. Preserve partials if deferring. Do not infer that missing pull clients mean server transfers ended; the preceding report observed continuing server-side growth. This turn did not remeasure growth or stop anything.
