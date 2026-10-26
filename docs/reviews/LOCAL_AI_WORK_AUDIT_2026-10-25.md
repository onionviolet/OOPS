# Local AI task-routing audit, 2026-10-25

Scope: Weibao asked to “audit using local ai to work on certain stuff” in the YAIRPG checkout. This audit treats project development/research as the main scope and checks the existing general file-work route. Recommendations remain proposals. No production delegation, model download, profile change, gameplay edit, commit or publication selected.

Rules: AD32 (authority), AD36 (proportionate verification), AD37/AU1–AU15 (bounded workers and honest coverage), AD41 (primary checkout), sealed secrets. Existing owners: [model considerations](../research/LOCAL_AI_MODEL_CONSIDERATIONS_2026-10-14.md), [source-processing LM1–LM7](../research/SOURCE_DEEP_DIVE_PLAYBOOK.md#local-models-for-source-processing-2026-10-18), [playtest harness](../AI_PLAYTEST_HARNESS_CONSIDERATIONS_2026-10-20.md). No new product direction or rulebook is introduced.

## Findings

**F1. The equipment is ready for bounded jobs.** Live `/api/tags`, `/api/ps`, `/api/version` and `sysctl` checks found 64 GiB RAM, Ollama 0.40.3, three installed tags, and no model loaded before the pilot:

| Installed tag | Artifact bytes | Observed format/runner | Disposition |
|---|---:|---|---|
| `qwen3.8:27b` | 18,174,721,847 | safetensors, NVFP4, MLX | Start here: incumbent launcher route and fresh synthetic probe passes |
| `gemma4:31b-mlx` | 19,424,434,885 | safetensors, MLX | Retain as a candidate for a task-specific comparison; not retested here |
| `huihui_ai/Qwen3.8-abliterated:27b-q8_0` | 29,978,241,872 | GGUF, Q8_0, ggml | Retain for a named creative need; no demonstrated extraction/coding advantage here |

Sizes are on-disk artifacts, not resident memory or safe context budgets. The live launcher configuration exposes only `fast` pointing to Qwen. Installed tags do not establish enabled launcher profiles. Current filesystem free space was about 189 GiB, so the previous source-research disk shortage is historical, not today's measured state.

**F2. Use the existing harness for tools.** `/Users/weiwei/.local/bin/dsh-work` forwards to the DeepSeek Harness Local work example. Its source composition enables file/search/shell/job tools, skills and task tracking, and disables delegation and web tools. The simpler `local-ai` launcher invokes `ollama run` and adds no filesystem or shell tools. Asking it to read a path does not give it that capability.

The [Harness audit](/Users/weiwei/code/deepseek-harness/docs/local-harness-audit.md) records successful synthetic file edits, shell checks, resumed tasks, CSV processing and pressure-compaction trials. Those are existing recorded results, not trials rerun by this audit. Its route-specific 4,096-token compaction headroom matters for the declared 32K route; the model runtime's context allocation is a separate setting. The profile examples and audit are currently uncommitted work in that checkout. Preserve their writer and do not treat them as published upstream features. A small tool catalog reduces prompt overhead but shell capability remains subject to the actual permission mode.

**F3. Narrow extraction is plausible; bulk semantic trust remains unqualified.** Fresh Qwen probes passed exact extraction and contradiction preservation, detailed below. However, the [wiki digest owner](../research/power-systems/wiki-digests/REPORT.md) records a rejected `qwen3.5:4b` source-fidelity trial. That failure does not establish that Qwen 27B fails, but it does invalidate treating local output or successful parsing as proof of source reading. The source playbook's broad local-first language needs task/source qualification before use. No standing reader route was changed here.

**F4. Playtest infrastructure exists; policy integration is a separate job.** [The current browser runner](../../scripts/playtest/run.mjs) executes `scriptedPolicy()`. The [MCP server](../../scripts/mcp/game_mcp.mjs) and [playtest README](../../scripts/playtest/README.md) provide useful existing routes. Historical local action-choice timings in the model owner demonstrate individual choices, not an autonomous end-to-end player. Reuse these interfaces for a bounded local-policy trial rather than building another game runner. Player observations must remain distinct from detector-only state. Text-only MCP runs do not establish desktop visual acceptance.

## Ranked task routing

| Code | Work | Route and disposition | Acceptance that changes the decision |
|---|---|---|---|
| O1 | File inventories, CSV/JSON conversion, counts, duplicate candidates, link/path candidates | **Adopt existing deterministic scripts first; trial `dsh-work` for unfamiliar inputs or a small script adjustment.** Strongest initial use. | Independently verify counts/totals and output schema; preserve inputs. Do not spend inference on tasks `rg`, parsers or hashes already solve. |
| O2 | Bounded source-fact extraction, table tagging, OCR cleanup, contradiction candidates | **Trial Qwen with direct Ollama requests**, short source spans, exact locators and a fixed record schema. Reuse manga/source tooling where available. | Compare 3–5 representative source pages or spans, including ambiguity and contradiction; reject invented facts, missing material qualifiers and unsupported resolved conflicts. Keep original OCR alongside cleanup. Track reviewed, unread and rejected separately. |
| O3 | One-file script repair, focused test fixture, mechanical edit | **Trial `dsh-work` in an isolated scratch fixture or released file area.** Existing Harness evidence supports this class, not arbitrary YAIRPG refactors. | Reproduce the failure, inspect the diff, rerun the relevant test and check scope. Final runtime integration follows AD36. Do not assign shared dirty paths without ownership. |
| O4 | Offline names/dialogue variants, mundane descriptions, alternative hypotheses | **Trial Qwen first; compare Gemma only if a concrete quality gap appears.** Keep drafts as candidates. | Count accepted outputs and reviewer corrections, preserve source/knowledge boundaries, validate admitted content through its existing consumer. No automatic “accepted canon” promotion. |
| O5 | Persona playthroughs, confusing-control notes, exploratory action choices | **Trial after the existing MCP-to-Ollama loop is qualified.** Start with 20 choices, one fresh synthetic life, one model request at a time. | Valid available-action selection, detector receipts, clean stop on repeated ineffective actions, no save/profile access. Reproduce findings on the same build; keep desktop browser proof for UI claims. |
| O6 | Architecture, save migration, final source synthesis, conflicting accepted direction, release acceptance | **Keep primary-agent review.** Local AI can propose questions or bounded counterexamples. | Owning code/source and actual checks decide. Review burden and missed interactions can erase the allowance saving. |

These dispositions are task-fit judgments, not measured ROI. No local-versus-cloud end-to-end comparison or estimate of subscription savings was performed. Local inference avoids a hosted model request, but still costs elapsed time, power, memory and reviewer effort.

## Fresh two-request probe

Reproducer: [pilot.py](local-ai-work-2026-10-25/pilot.py). Receipts: [results.json](local-ai-work-2026-10-25/results.json). Only synthetic prose was sent to localhost; no source library, secret, game save or project file was passed to the model.

Budget: exactly two sequential requests; Qwen digest `47951e4a666180bc2aedfc93c169472f2de783696fe196efbf063f5730ecf163`; thinking off; temperature 0; seed 42; context 4,096; max output 256 tokens per request; client socket timeout 90 seconds per request; no retries; `keep_alive: 0`. The socket timeout is not a demonstrated server-side inference cancellation guarantee. This direct API probe is not a spawned autonomous worker.

| Check | Result | Wall time |
|---|---|---:|
| Extract kiln inputs, duration, output and source ID; preserve unspecified resale price | Exact expected JSON, normal stop | 13.567 s |
| Preserve conflicting gate costs and unknown precedence | Exact expected JSON, normal stop | 8.168 s |

Both prompts specify the expected keys and labels closely. This proves basic instruction-following and JSON production on two easy synthetic cases, not independent discovery, difficult extraction, long-context recall, tool use, code quality or representative reliability. `format: json` was exercised, not full JSON Schema enforcement. `keep_alive: 0` requested unload after each call, so these are not warm-throughput comparisons. Historical model comparisons remain dated evidence.

[Ollama structured-output documentation](https://docs.ollama.com/capabilities/structured-outputs) supports schema-constrained responses; [tool-calling documentation](https://docs.ollama.com/capabilities/tool-calling) shows the external executor/tool-result loop. Neither makes semantic validation automatic. No fresh tool-calling probe was run here.

## Proposed operating pattern

Use one primary coordinator for planning and integration, deterministic tools for preparation/validation, and one local job for a bounded transformation. Each job gets an input path/hash, exact allowed scope, output schema, source locators, unknown/conflict representation, output owner, finite call/output/time budget and an observable acceptance check. Preserve useful results before stopping. A narrower prompt is an instruction, not filesystem confinement; use the Harness permission mode and an isolated fixture when tools can write. Verify its effective mode before a live coding job.

For source work, default to candidate records with `source_id`, locator, claim, stated/inferred status and unresolved qualifications. Validate against input and sample the original before promotion. Use stronger review for contested mechanics, quantities and cross-source conclusions. A local model does not need the repo's entire instruction history to transform an already prepared source shard, subject to mandatory host rules.

For playtesting, supply complete player-visible observations and available actions. Keep save/debug truth with detectors. Prior PTF6 showed missing inventory in the prompt could create false game-confusion reports. A one-token choice can be efficient, but prior local experiments also changed choices when reasons were omitted, so qualify choice quality before using the fastest output format.

**Recommended first production qualification:** O1 on one real, nonsecret file-processing task with checkable totals. Then O2 on 3–5 source spans if research throughput is the actual bottleneck. Finish and measure useful accepted output per wall minute, correction count and failure recovery before expanding. No overnight batch or automatic routing was configured by this audit.

## Verification and boundaries

- C1: Live API tags/ps/version, RAM, launcher source/config and free-space inspection completed; initial model residency empty. Exact model unload was checked after the pilot.
- C2: `python3 docs/reviews/local-ai-work-2026-10-25/pilot.py --run --out docs/reviews/local-ai-work-2026-10-25/results.json`: 2/2 narrow fixtures passed. Dry run passed; receipt assertions passed; all 10 local path links exist (anchors not checked).
- C3: Source inspected at YAIRPG HEAD `9b4b220fd4867501a50ca2de2c9af3180d489402` and Harness HEAD `d375cb295810836045de40086c771b123d3d8c6c`, both with unrelated uncommitted work. This audit adds only its report, reproducer and synthetic receipts. Runtime tests/build/browser checks were not run because gameplay was not changed.

Open gate: one representative real task with independent acceptance and measured review cost. Two synthetic successes do not close that gate. Nothing was installed, committed or pushed.

## Selected real-task follow-up, 2026-10-25

Weibao authorized the representative trial. [Full result and reusable script](local-ai-work-2026-10-25/real-task/REPORT.md): the initial Harness run failed at its output cap after 208.936 seconds with no deliverable. One same-model, compact direct-generation recovery produced a script in 27.346 seconds; primary-agent execution and independent checking passed 15/15 bounded assertions on the real registry and two edge cases, with zero code corrections. This supports compact script generation plus deterministic execution, while unattended Harness reliability remains unqualified. No production configuration or gameplay changed.

Harness follow-up: [more-to-consider round 1](local-ai-work-2026-10-25/real-task/REPORT.md#more-to-consider-round-1-keep-harness-qualify-the-request-2026-10-25) recommends retaining Harness for tool execution. The failed run and direct recovery used different settings and split execution responsibilities; they do not establish a runner ranking. The live local default is reasoning low with a 4,096-token model output cap. A fresh, compact Harness replay with verified backend request controls is the proposed next gate, not a persistent configuration change already made.

## Authorized Harness repair and replay, 2026-10-25

[Latest result](local-ai-work-2026-10-25/harness-fixed/REPORT.md): repaired the local OpenAI reasoning mapping/default. A positive control emitted reasoning; none emitted zero. All nine captured task requests sent none and returned zero reasoning text. Harness itself wrote and ran the utility; independent acceptance passed 15/15 with zero code corrections in a 117.066-second task run. Its session was aborted by the eight-step supervisor before a final summary, so correct artifacts and normal agent completion remain distinct. Persistent settings are fixed; gameplay and Harness package source are unchanged.

## Bounded workflow completes normally, 2026-10-25

[Latest accepted trial](local-ai-work-2026-10-25/harness-finished/REPORT.md): updated the installed/source local-scripts skill to bound inspection, reuse fixed checks and stop after passing verification. One intermediate run failed a duplicate-list edge case and hit its finish budget; it is retained. The final fresh run generated and executed the utility, ran a qualified fixed checker and returned a completed final answer in 111.255 seconds, six steps/seven backend requests. Independent verification passed 15/15 with zero primary-agent code edits, and all backend requests remained thinking-off. The task is complete at this bounded scope; no gameplay, commit or publication occurred.

## Real code-fix trial, 2026-10-25

[Code-fix result](local-ai-work-2026-10-25/code-fix-final/REPORT.md): reproduced and repaired a real tool-launcher crash on non-UTF-8 probe output. Harness authored the source patch and regression; primary review applied them locally after independent acceptance. Nine focused tests, old-source regression rejection and independent mixed-byte/status/CLI/truncation checks pass. The same local session finished normally after repair and close-out prompts, so this is a successful supervised fix with explicit first-attempt failures, not a one-shot autonomous result. No gameplay, commit or push changed.

## Workflow improvement after the code trial, 2026-10-25

[Improvement and replay](local-ai-work-2026-10-25/workflow-improvement-final/REPORT.md): revised the installed/source local-scripts skill and added a seven-test verification helper with fail-fast statuses, multiline failure details and source-hash receipts. A fresh known-defect replay preserved the existing interface and produced a one-line implementation fix, but needed a fixture correction and one bounded continuation. Final worker verification and normal completion plus independent nine-test/behavioral acceptance passed. The adopted project fix was not overwritten, and first-pass autonomy remains unproven.

## Fresh no-follow-up code trial, 2026-10-25

[Fresh trial and workflow changes](local-ai-work-2026-10-25/fresh-code-fix/REPORT.md): added an exact-byte fixture builder, a verification finish packet and a system-level finish instruction; ten helper tests pass. On a different lane PID-validation defect, one fresh Harness session passed the focused tests and independent acceptance on its first verification, then finished normally in 93.925 seconds, seven steps/eight backend requests, with zero follow-up prompts or code corrections. Independent old-source regression rejection, preserved original tests and ten passing lane tests support the exact patch now applied locally. This is one successful bounded trial, not a general reliability estimate.
