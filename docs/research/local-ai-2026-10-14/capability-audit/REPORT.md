# Retained local AI capability audit

October 14, 2026, America/New_York. Assessment and recommendations, not a selected model or implementation. Read-only diagnosis plus public primary-source research; writes confined to this new audit directory. No inference, acquisition, cancellation, deletion, installation, restart, settings/default change, game mutation, commit or push initiated by this audit.

## R1: A new worker invalidates the inherited stopped-workflow assumption

At the final metadata capture, **5:40:59 p.m. EDT**, `finish_upgrade.py` PID **43987**, PPID 1, is running. It started **5:30:38 p.m.**, after the predecessor terminated PID 75330. Its status says MXFP8 is downloading again, about **4.63 / 31.66 GB**, and Huihui is downloaded. Its localhost sockets are established. This audit did not restart it, and cannot establish who did. The earlier removal remains a valid historical event; “MXFP8 remains removed and its workflow is inactive” is no longer current truth.

The inspected worker code first checks the baseline, then pulls all three models, waits on the quality/MXFP8 future first, creates aliases, runs inference checks, and can write profiles and promote the uncensored default after its checks. Those later effects are **possible future actions**, not observed completion. Current configuration still says `default: fast`, `fast: qwen3.8:27b`; inventory has only the two retained models and residency is empty. Reconcile this worker's current authorization and intended scope before any later controlled comparison. This audit has no cancellation authority and left it untouched.

The separate **download-only Gemma worker PID 44425** is also alive. Its final receipt reports **13,027,552,018 / 19,424,434,885 bytes**, approximately **67.1%**, in the 5:40:59 p.m. final snapshot It shares the underlying Gemma transfer with the other worker. Gemma is not registered or qualified; no reliable ETA follows from this snapshot. Both progress figures are worker reports, not independent hashes of downloaded content. [Live evidence](live-evidence.json) preserves dates, configurations and workers; [final state](final-state.json) updates transfer progress and confirms the same two models with empty residency.

## D1–D3: Ranked use of what is already here

| Rank | Artifact / proposed role | Reason and limit |
|---|---|---|
| D1 | **Qwen3.8 27B NVFP4/MLX: retain baseline** for reviewed offline YAIR drafts, bounded plans and initial short companion conversation | Already working in prior local samples; no migration cost. Exact upstream checkpoint/conversion remains unverified. Do not transfer upstream scores to this digest. |
| D2 | **Huihui Qwen3.8 27B Q8_0/ggml: first acquisition-free comparison** for dialogue taste and legitimate-fiction breadth | Available now, with native renderer/parser and vision projector metadata. No local Huihui capability/quality acceptance found. It changes fine-tune, quantization and backend together, so any win cannot be attributed to Q8 or ablation alone. |
| D3 | **Gemma4 31B MLX: optional different-family quality comparison once available** | Finishing an already-existing download may make a comparison convenient, but does not make it the next best role. It is dense 31B, not the Gemma26B-A4B MoE responsiveness candidate. No new acquisition is recommended. |

For the next quality question, compare D1 versus D2 before acquiring more models. If both fail prose taste, the prior targeted Hemmingway lead remains relevant. If responsiveness fails under normal desktop use, the prior Gemma26B MoE speed lead remains relevant. Neither is newly selected for download. Runtime migration must answer a measured defect or unsupported required mechanism rather than a generic speed promise.

## F1: Exact machine and inventory

Mac17,9, M5 Pro, 18 CPU cores, 20 GPU cores, 64 GB unified memory, as verified in the current hardware read and predecessor GPU evidence. Apple's specification is **307 GB/s**, not measured sustainable bandwidth: [Apple specifications](https://www.apple.com/uk/macbook-pro/specs/). Base M5, M5 Max and NVIDIA FP4 throughput do not predict this machine.

Ollama reports **0.40.3**, served by `/Users/weiwei/.local/bin/ollama`, resolving to `/Users/weiwei/.local/share/ollama/ollama`; binary SHA-256 is captured. Listener is **127.0.0.1:11434**. Both retained manifest hashes match their inventory digests, and referenced config/layer files have expected sizes. Large weight blobs were not independently rehashed.

| Artifact | Stored size | Exact digest | Metadata |
|---|---:|---|---|
| Qwen | 18.17 GB | `47951e4a666180bc2aedfc93c169472f2de783696fe196efbf063f5730ecf163` | safetensors, NVFP4, MLX; `/show` reports 27.8B, `qwen3_5`, requires 0.32.12 |
| Huihui | 29.98 GB including projector | `150af2e2fa9b3e09d6dfd1cf6f315bb9cb7d688af157d1cc1c9fe1a809ebb230` | GGUF, Q8_0, ggml; 27.3B, `qwen35`; 461M-parameter vision projector metadata |

Huihui's modification timestamp changed to 5:31:18 p.m. while its digest stayed the same. The upstream page supports its advertised identity, not local correctness: [Huihui registry page](https://ollama.com/huihui_ai/Qwen3.8-abliterated:27b-q8_0). Config architecture labels such as amd64/linux are packaging metadata, not proof that macOS cannot execute this artifact.

## F2: Capability matrix and evidence levels

**A** = advertised; **S** = matching-version source mechanism; **I** = installed metadata/library presence; **E** = previously exercised output; **U** = local acceptance untested. Source was pinned to Ollama tag v0.40.3, tree **eab97e9f92b9a25c2d52d2cc6c1b1c99bd9fae21**. A version string and binary hash do not establish build provenance or prove every source branch is in use.

| Capability | Qwen NVFP4/MLX | Huihui Q8/ggml | Useful boundary |
|---|---|---|---|
| Plain text, scenes, summaries, plans | A/I/E, representative samples only | A/I/U | Fluency is demonstrated only for Qwen; semantic usefulness and taste are separate. |
| Constrained JSON / native schema | S/I; **E for two tiny schema fixtures** in the external worker's saved baseline checks | S via common API; U on exact artifact | MLX source compiles grammar and masks logits; installed Metal v3/v4 bundles contain `libollama_xgrammar.dylib`. This supports a real mechanism, not universal schema coverage or truthful fields. |
| Native chat rendering | I: renderer `qwen3.8`, parser `qwen3.5` | Same I configuration | Both `/show` templates display `{{ .Prompt }}`. Native renderer config supplies the relevant route, so this alone is not a broken template. Exact upstream template equivalence remains U. |
| Tool calls / parser | A/S/I; E not established | A/S/I/U | Native renderer emits tool instructions and parser separates XML tool calls from thinking/content. Parsed arguments are proposals; client tools still require allowlists and execution authority. |
| Thinking controls | A/S/I; E for thinking-off and thinking-rich samples | A/S/I/U | Both advertise `false`, `low`, `medium`, `xhigh`; default `medium`. Use exact native `think:false` for a later interactive trial. A prompt saying “do not think” is not equivalent evidence. |
| Streaming / cancellation | S; installed API surface; actual abort latency U | S common API; actual abort U | MLX request context carries HTTP cancellation through queue and runner; no new disconnect test was run. First reasoning token is not first final-answer token. |
| Vision | A/S/I/U | A/I projector present/U | Mechanism and package evidence do not prove image reading, OCR or visual grounding quality. No audio/STT/TTS capability is established for either retained artifact. |
| Context / prefix snapshots | I: 262,144 advertised positions; S caching; filled-context U | I: 262,144; actual cache/recall U | Context limit is not a qualified useful context budget. Cache reuse is not durable memory. |
| Optional MTP | S, historical speculative log evidence; exact present benefit U | Stored `draft_num_predict 4`; usable drafter U | Parameter alone cannot prove a draft model. Preserve current behavior for comparison; no manual depth change recommended. |
| Durable companion memory | U; not supplied by weights | U; not supplied by weights | Correction, expiry, deletion and restart recall belong to the application, not the model label. |

Primary mechanisms: [chat API](https://docs.ollama.com/api/chat), [structured outputs](https://docs.ollama.com/capabilities/structured-outputs), pinned [MLX grammar implementation](https://github.com/ollama/ollama/blob/eab97e9f92b9a25c2d52d2cc6c1b1c99bd9fae21/mlxrunner/grammar.go), [generation pipeline](https://github.com/ollama/ollama/blob/eab97e9f92b9a25c2d52d2cc6c1b1c99bd9fae21/mlxrunner/pipeline.go), [native renderer](https://github.com/ollama/ollama/blob/eab97e9f92b9a25c2d52d2cc6c1b1c99bd9fae21/model/renderers/qwen35.go), [parser](https://github.com/ollama/ollama/blob/eab97e9f92b9a25c2d52d2cc6c1b1c99bd9fae21/model/parsers/qwen35.go). Captured source hashes are in [source-captures.json](source-captures.json).

The new worker's [saved baseline checks](external-baseline-checks.json) report arithmetic 323, two schema-constrained outputs, and a fiction reply, with stop completion. These are evidence read from another process, **not inference run by this audit**. Its fiction checker only requires at least 40 words and no selected refusal phrases; it does not enforce the requested 70–100 words or good writing. No comparable Huihui check is recorded at this capture.

## F3: YAIR value and consequential gaps

The best immediate role is **offline authoring with review**: supported site drafts, alternative motives, short scenes, explicit proposed mechanics, dependency plans with missing consumers named, and source-grounded summaries. Separate settled facts from permitted invention. Stock Qwen previously answered adult betrayal and political disagreement; its material failures were invented authority/laws/durations, missed length constraints and generic exposition. Reduced refusal and higher bits do not solve those defects by definition.

Use P15's [authoring owner](../../../gm/dispatch/procgen-2026-10-13/p15/AUTHORING_PIPELINE.md), [runtime text](../../../gm/dispatch/procgen-2026-10-13/p15/RUNTIME_TEXT.md), [dialogue](../../../gm/dispatch/procgen-2026-10-13/p15/DIALOGUE.md), [options](../../../gm/dispatch/procgen-2026-10-13/p15/LLM_OPTIONS.md) and [T5 routes](../../../gm/dispatch/research-tech-2026-10-14/t5/LLM_ROUTES.md). The existing one-site `validateDraft`/`compileDraft` path supports 14 fields and scalar gather/work/pay. It does not implement arbitrary quests, NPC effects or a general live AI-to-game pipeline. Native state owners retain knowledge, stock, time and consequences. Accepted direction stays canon-first, laptop/desktop-first, one playable slice; proposals cannot promote themselves into canon or gameplay.

The useful adjacent opportunity is to measure **review time and accepted useful drafts**, not more catalogue scores. Freeze selected content so it survives provider/model loss; later integration needs its own native/save/reload/import evidence. No model call per idle tick, no automatic state writer, and no raw books, private saves or sealed lore sent externally.

## F4: Companion responsiveness, concurrency and privacy

Short conversation and narrow activity summaries are plausible uses. A personal identity, persistent memory, screen awareness, voice and action execution are separate application layers. The planning owner's accepted Ghost remains a narrow collector, no persisted raw titles/screen content and no tools/network egress from the summarizer. This audit adds no memory or observation authority.

Historical local results were roughly 22–27 tok/s for story decode, around 3.5 seconds for a very short reply, and a thinking-rich run lasting 156 seconds/1,800 tokens without a final answer versus about 26 seconds thinking-off. These are prior samples, not current latency guarantees. The supposed 4K packet actually had 431 input tokens. Cold loading, filled context, queue time, speech first-audio, interruption, thermal behavior and ordinary-desktop contention remain U. Current download traffic also makes a controlled latency comparison poorly isolated.

Share one inference service with separate game/personal contexts; start with one resident large model and queued bounded drafts. An interactive-priority queue cannot preempt existing work without functioning cancellation. No queue, voice or priority implementation is proved here. Speed, semantic quality, taste and whole-Mac energy require separate measures.

[Ollama's snapshot description](https://ollama.com/blog/mlx-performance) supports prefix reuse across branches, not durable personal memory. [Adaptive MTP](https://ollama.com/blog/faster-gemma-4-mlx-mtp) depends on workload; its nearly 90% result is Gemma12B/M5 Max/Aider, not this machine's prose. Do not copy benchmark decode averages as first completed-answer latency.

Privacy has five separate stores: weights, active context, prompt cache, transcripts and durable memories. Deleting a transcript does not prove summaries/embeddings/caches were cleared. Require source pointers, reviewed writes, correction/deletion/expiry and restart tests before persistent memory acceptance. Current manifests contain no remote-model fields, and the service listens on loopback. `~/.ollama/server.json` is absent; environment-based cloud disabling and client fallback/telemetry were not established. Public [FAQ](https://docs.ollama.com/faq) describes local privacy and optional cloud disabling; this is not a network-isolation test. Existing HTTPS sockets accompany weight transfers and do not prove prompt transmission. No credentials or private records were inspected.

## A1: Smallest later comparison that changes a decision

After R1 is reconciled under separate authority, use **Qwen versus installed Huihui**, thinking off, fixed model digests/settings, two counterbalanced seeds. Use four request steps per model/seed, **16 requests total**: one supported-site schema draft; one constrained scene; one correction follow-up to that scene; one short companion reply with an explicit unknown. This chooses the already-installed challenger rather than expanding the predecessor screen. It is proposed, not run or silently authorized.

Record schema/validator rejection, invented authority/knowledge, agency violations, missed corrections, final-answer emptiness/truncation, first final-answer token, total completion time, cold load, actual input/reasoning/output counts, memory pressure and editing minutes. Blind-label outputs for Weibao. Taste follows semantic checks, and all failures stay in the denominator. Close results favor keeping Qwen; Huihui earns a role only by fewer refusals on relevant fiction or better accepted writing without unacceptable correctness/latency cost. A win identifies a deployed-artifact difference, not its quantization cause.

Only expand for a named remaining gap: equal-fact real 4K/8K context and one desktop-contention/cancellation case for companion availability; Gemma31B for a different-family quality hypothesis. Vision, tools and memory need separate mechanism-specific acceptance if selected for use. No threshold or expanded harness is imposed on unrelated YAIR development.

## Scope and authoritative gate

Recovered live AGENTS, standing PROJECT priorities, USER_VISION, dirty shared `codex/gameplay-foundations` checkout and P15/T5/planning owners. This absent-before-task `capability-audit/` directory is task-owned; no shared owner was rewritten. Inspected hardware, binary identity, metadata endpoints, manifests/configs/layer sizes, worker code/status/sockets, saved prior checks and pinned public runtime source. No gameplay or inference tests by this audit were appropriate.

Assessment is complete; the setup is not fully qualified. **The authoritative remaining gate is the selected local comparison followed by Weibao's blind acceptance.** R1 must be reconciled before that comparison is controlled. Later application/game integration has separate native, persistence and human acceptance gates.
