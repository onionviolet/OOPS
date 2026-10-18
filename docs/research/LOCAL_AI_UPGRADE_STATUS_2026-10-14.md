# Local AI upgrade status

2026-10-14. Human authorization: “upgrade accordingly, dont forget uncensored and mroe?” This authorizes the local-model setup discussed in [the comparison](LOCAL_AI_MODEL_CONSIDERATIONS_2026-10-14.md). It does not by itself establish a game-runtime integration or gameplay acceptance.

## A1: selected upgrade

Downloads were started for official `qwen3.8:27b-mxfp8`, `huihui_ai/Qwen3.8-abliterated:27b-q8_0`, and `gemma4:31b-mlx`. The existing `qwen3.8:27b` NVFP4/MLX model and its digest are retained as the fast fallback. About 80 GB of additional weights are expected; initial disk inspection showed 424 GiB available.

The first uncensored candidate was [Darrellbest's Heretic Q8 build](https://huggingface.co/darrellbest/Qwen3.8-27B-Heretic-GGUF). Its publisher documents the ablation method and refusal/KL measurements, but the actual download route was impractically slow. The task-owned pull was stopped. The selected alternative is [Huihui's Qwen3.8 abliterated Q8 model](https://ollama.com/huihui_ai/Qwen3.8-abliterated/tags), linked by its [publisher model card](https://huggingface.co/huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF). No claim is made that this alternative matches Heretic's measurements. Reduced refusal behavior is separate from reasoning quality; it is not a new model generation.

## A2: installed control surface and automatic completion

Added [/Users/weiwei/.local/bin/local-ai](/Users/weiwei/.local/bin/local-ai) with `--fast`, `--quality`, `--uncensored`, `--gemma`, `--status` and `--help`. Only downloaded, passing new profiles enter its selectable configuration. The user-requested uncensored route becomes this launcher's default after its smoke checks pass; the original model remains selectable. There is no global Ollama default replacement and no cloud fallback.

The [one-off finisher](/Users/weiwei/.local/share/local-ai/upgrades/2026-10-14/finish_upgrade.py) is running under the user launchd job `com.weibao.local-ai-upgrade-20261014`. It joins resumable Ollama transfers, records installed digests and sizes, creates bounded profiles, executes checks serially and enables passing profiles. Its [live status](/Users/weiwei/.local/share/local-ai/upgrades/2026-10-14/status.json) is the current authority for completion, not this dated report. A failed download or check leaves that profile disabled and reports `needs_attention` when the batch ends. It writes only its dedicated local tool directory, not this repository's future state.

Usage and operation details: [local tool README](/Users/weiwei/.local/share/local-ai/README.md). Initial configuration uses the existing fast model until the new checks pass. Ollama 0.40.3 is already installed; no runtime replacement was required.

## F1: evidence and open gates

The original model returned `323` for 17×19 in an initial real API call (8.43 seconds total, 7.53 seconds loading). The finisher's separate baseline checks passed all four fixtures: arithmetic, exact stock JSON, supported-action interpretation and adult dark-fantasy dialogue. Every baseline response ended normally; observed generation rates were 12.48–23.83 tokens/second on these short fixtures. New-model checks are recorded as they finish. These are synthetic fixtures with no private saves, book prose or sealed world truths.

Python syntax compilation passed for the launcher and finisher. Launcher help/status and argument dispatch are checked separately. Download completion, all four fixtures per new profile and launcher promotion remain pending in the live status. Higher precision, model size and an uncensored label alone do not prove better task quality. A full comparative benchmark, director voice preference, image/tool calling, long-context performance and battery impact remain unmeasured.

This task changes local tooling only. P15/T5 text/pack proposals remain proposals; no game adapter, source runtime, save schema, browser gameplay, commit or push is claimed. Existing unrelated worktree changes are preserved.

## A3: cleanup and speed follow-up, 2026-10-14

Human instruction: “progress? delete old stuff and morea? does these versions run faster?” New-model timing is pending, so no speedup is claimed. Higher precision is a quality experiment; reduced refusals alone do not establish faster decoding.

Removed exactly 31 partial files belonging to the stopped Heretic transfer, after verifying no open descriptor and no installed-manifest reference to its full blob digest. Freed 22,519,808 allocated bytes (the large apparent file was sparse). The [cleanup receipt](/Users/weiwei/.local/share/local-ai/upgrades/2026-10-14/abandoned-cleanup.json) records the digest and scope. Active upgrade transfers were preserved.

Added a [speed and cleanup finisher](/Users/weiwei/.local/share/local-ai/upgrades/2026-10-14/speed_cleanup.py), running as one-off launchd job `com.weibao.local-ai-speed-cleanup-20261014`. It measures the existing model now, then measures each passing replacement after the installation finisher reaches its terminal state. Each comparison uses the same synthetic scene prompt with 4096-token context, thinking disabled, temperature zero and seed 42, once cold and once warm. Outputs, load time, total response time, generation rate and loaded memory are retained in [live speed/cleanup status](/Users/weiwei/.local/share/local-ai/upgrades/2026-10-14/speed-cleanup.json). Two short samples do not establish general performance or battery behavior.

After official quality and uncensored replacements pass both the original fixtures and these speed samples, it verifies the old digest is unchanged, repoints `--fast` to the fastest passing replacement on this fixture, and removes only `qwen3.8:27b` through Ollama. This retirement is authorized but pending; no old-model deletion is yet claimed. Shared-weight reclamation is left to Ollama. Failure retains the old model and records the blocker.

The launcher now explicitly keeps recently used weights for five minutes and disables extended thinking for routine chat; `--think=true` opts back in. [Ollama documents keep-alive and thinking controls](https://docs.ollama.com/api/generate). Syntax and argument-dispatch checks cover this change. It avoids repeated loading and optional reasoning cost; it does not establish that a new model generates tokens faster.

The original model's new scene samples both passed: cold response 27.472 seconds total / 14.941 seconds loading / 13.94 tokens per second; warm response 8.403 seconds total / 0.168 seconds loading / 16.16 tokens per second. Outputs differed in length (160 versus 125 tokens), so this is not a controlled threefold generation-speed improvement. The measured loading reduction supports keeping a model warm for successive turns. Downloads and other machine work were not isolated from these measurements.
