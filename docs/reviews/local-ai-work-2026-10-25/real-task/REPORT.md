# Real local-AI task: tool-registry inventory

Latest authorized follow-up: [Harness settings repaired and same-task replay](../harness-fixed/REPORT.md). The original attempt and direct recovery below remain dated evidence.

2026-10-25, America/New_York. User selected one real local-AI task and independent assessment after the [routing audit](../../LOCAL_AI_WORK_AUDIT_2026-10-25.md). Applied AD32, AD36, AD37/AU1–AU15, AD41 and sealed-secret boundaries. Only this audit's artifact area was written; shared gameplay, tool configuration and user saves were not part of the task.

**Result: the generated script passed its bounded acceptance checks after one failed Harness attempt and one controlled same-model recovery.** No edits to the generated Python code were required. This qualifies a narrow code-generation/file-processing use, not unattended repository work.

## Task and actual useful output

Produce a reusable standard-library Python CLI that inventories the real [tool registry](../../../../scripts/toolsets/registry.json): counts and IDs by kind, configured probe coverage, absent owner fields, duplicate IDs and required-path counts. Keep configured routes distinct from installed or successfully executed tools. No listed tool was launched or probed.

The input was an exact 20,422-byte copy, frozen before dispatch; SHA256 `e4d217d7b20a7fae6c325b2c5d6753bdb4c584fe31fcf38a1740ca6d6f69a9a1`. See [registry-snapshot.json](registry-snapshot.json). A unique temporary workspace kept the Harness away from active shared project writers; this was not a new Git worktree. Workspace-write/never was explicitly selected. This run does not constitute a separate sandbox security test.

Accepted artifact: [summarize_registry.py](summarize_registry.py). Outputs: [inventory.json](inventory.json), [inventory.md](inventory.md).

| Metric | Independently verified result |
|---|---:|
| Tool entries | 41 |
| Launch / reference entries | 31 / 10 |
| Launch entries with / without nonempty configured probes | 20 / 11 |
| Entries without nonempty explicit owner fields | 27 |
| Repeated IDs | 0 |
| Required-path references / distinct raw required strings | 40 / 38 |

Absent probe or owner fields are inventory facts, not automatically defects. These counts say nothing about installation, current executable health, practical tool fit or whether the owning documentation describes a route elsewhere. Detailed IDs are in JSON; the generated Markdown is a terse count summary.

## F1: Harness attempt did not complete

Route: installed `dsh-work`, using its existing Local work composition and Qwen. Budget: one local worker, at most eight model steps and 480 seconds, no alternate model or paid fallback. A supervisor recorded PID/process group and watched the JSON event stream. The task itself instructed at most eight model responses. The step guard terminates if a ninth step-start is observed, so it is not a strict server-side eight-request admission controller. It was not reached.

Observed: loaded `local-scripts`, listed scratch files, read `registry.json`, then ended `max-tokens` on step 3. No script or inventory files were produced. Input unchanged. Harness exit code 1; elapsed **208.936 seconds**. Last step reported 4,096 output tokens. A capped response was not a usable artifact; the final text repeated an earlier inspection message. The output limit is evidenced; a specific internal cause such as thinking consumption is not independently established.

Receipts: [run.json](run.json), [harness-summary.json](harness-summary.json), [events.jsonl](events.jsonl), [original prompt](prompt.txt). The projected read result may be truncated by the Harness JSON logger; it is not the authoritative input snapshot. This audit does not assert that the model was deprived of input because the logger truncated an event.

## F2: Compact direct generation succeeded

One recovery request to the same local `qwen3.8:27b`, digest `47951e4a666180bc2aedfc93c169472f2de783696fe196efbf063f5730ecf163`. Supplied the input schema and required transformation, instead of carrying the full registry through the model. Thinking explicitly off, temperature 0, seed 42, context 4,096, output limit 2,048; client socket timeout 240 seconds; no retries; `keep_alive: 0`.

Observed: normal stop in **27.346 seconds**, 276 prompt tokens and 782 output tokens reported; zero thinking characters. Returned raw Python without a Markdown wrapper. The primary agent reviewed the source for effects and then executed it against the full real registry snapshot. The model did not itself run or verify the recovery script. No model tools were exposed in this request.

Receipts: [recovery.json](recovery.json), [prompt](recovery-prompt.txt), [raw output](recovery-raw-output.txt), [reproducer](recover_direct.py). This changed route, context size and thinking controls together, so it does not isolate which factor caused the improvement. The recovery reused an already loaded model; its load duration was about 0.024 seconds, so 27 seconds is not a cold-start benchmark.

Combined measured Harness runtime plus direct-request wall time: **236.282 seconds**, about 3 minutes 56 seconds. This excludes human/primary-agent orchestration, source review and report-writing time. One recovery intervention, zero code corrections. A paid-token saving or net human-time saving was not measured.

## F3: Independent acceptance passed, with narrow limits

The primary agent wrote [verify.py](verify.py) separately from the model, compared all **nine** requested JSON fields against independent calculations, checked exact top-level keys, verified unchanged frozen and owning inputs, checked the Markdown evidence caveat, and reran the generated CLI on two additional inputs: an empty registry and a registry containing repeated IDs, repeated path references and absent/null/empty optional fields.

**15/15 checks passed** in a recorded 0.066 seconds. This is fifteen assertions across one real task and two small edge cases, not fifteen tasks or a general reliability score. The substantive script review also confirmed only standard-library imports and declared input/output file operations; no registry commands, network calls or environment discovery.

Evidence: [verification.json](verification.json), [expected.json](expected.json). No code or Markdown corrections were applied before scoring. Minor limitations: the CLI silently does nothing with no output flags, and the Markdown omits detailed ID lists available in JSON. Neither breaks the requested invocation. Invalid JSON or arbitrary malformed record schemas were outside the declared test contract.

The initial progress message called this ten output fields; the actual requested schema has nine. The independent comparison uses the actual nine-key contract.

## Recommendation

Use local AI for compact script generation or bounded transformations with independently checkable outputs. Let deterministic code process the whole real input, rather than asking the model to read and count every row. Retain the accepted script in this evidence area for reuse; no production tool registration is implied.

Do not yet treat the current `dsh-work` settings as qualified for unattended jobs of this type. Its first attempt failed despite the small input. A later Harness-specific task should inspect the effective reasoning/output policy and retest on the same frozen input; this result does not authorize silent profile changes or stronger-model fallback. Source extraction, cross-file code changes and autonomous playtesting still need their own representative acceptance checks.

## Reuse and verification

From the repository root:

```sh
python3 docs/reviews/local-ai-work-2026-10-25/real-task/summarize_registry.py scripts/toolsets/registry.json --json /tmp/yair-tool-inventory.json --markdown /tmp/yair-tool-inventory.md
```

For exact frozen-data comparison, use `registry-snapshot.json` as input. The checker initially used the recorded temporary copy and also checked the live registry hash; it now uses the retained snapshot so reruns do not require that temporary workspace. A later live registry edit can correctly fail the owning-source identity check without implying a generated-script regression.

No game build/test/browser gates were run because the task changed no gameplay or runtime source. No model installation, profile edit, commit or push occurred. The generated utility is source-reviewed and test-executed at the stated scope; autonomous Harness completion remains failed for the first attempt.

## More-to-consider round 1: keep Harness, qualify the request, 2026-10-25

Weibao: “why not use deep seek harness? more to consider?” This selects an explanation and consideration pass. It does not by itself select persistent configuration edits or another inference trial. The prior real-task request remains satisfied; this round clarifies the next useful experiment. Applied the `more-to-consider` skill and its infrastructure/configuration lens.

**Current recommendation:** retain DeepSeek Harness as the tool-capable local worker. The direct API recovery was a way to finish and diagnose a bounded task; it is not evidence that bypassing the Harness is generally better. Harness is the agent/tool runner; Qwen on Ollama is the selected model backend. Using Harness does not require using a hosted DeepSeek model.

| Code | Finding / consequence | Disposition |
|---|---|---|
| H1 | The comparison changed the runner, prompt size, thinking setting, context and execution responsibility together. The direct request also reused a loaded model. It did not demonstrate superior end-to-end speed or reliability for the direct route. | **ACT NOW, done:** correct the interpretation here. Keep the original timings and failed-run status. |
| H2 | The live home patch declares `agent-default-model.reasoningEffort: low`, the Ollama route's model `maxTokens: 4096`, and a 32,768-token context window. Its compatibility declares `thinkingFormat: qwen` and supported reasoning efforts low/medium/high. The headless profile's local patch is empty. The Local work overlay inspected here does not override the default model's reasoning setting. Low is not the direct request's explicit `think: false`. | **ACCOUNT FOR NOW:** verify effective request settings before comparing. Current inspection is source/config evidence, not a captured historical wire request. Reasoning consumption remains an inference, not the proven reason for the failed answer. |
| H3 | The adapter's `profileOptions` omits the common reasoning option for `off`; its own comments warn that omitting an option on some provider/model combinations can leave backend-default thinking enabled. The actual wire behavior also depends on the installed pi-ai serializer and Ollama compatibility. | **ACCOUNT FOR NOW:** a UI label or YAML change is insufficient acceptance. Verify backend-facing request controls and output behavior. Do not assume adding an `off` label or raising the token cap fixes this route. |
| H4 | The winning transformation did not require the model to carry all 20 KB of registry prose. The generated program computed the real facts. Harness can use the same strategy: inspect keys and a bounded representative record with Python, write the generic program, execute it, inspect results and tests. | **ACCOUNT FOR NOW:** make task prompts favor schema inspection and deterministic processing. Let the worker execute and verify, retaining file tools, shell results and durable session receipts. Smaller model context is compatible with using Harness. |
| H5 | Success should mean a verified artifact produced by the worker, including failure recovery. A correct code-only answer executed by the primary agent proves less. The full human/primary-agent supervision cost matters as well as model latency. | **LATER / DELEGATE:** one fresh Harness-only replay on the frozen registry with matched task settings; bounded worker level, Luna low or the same local Qwen, one trial, no alternate provider. Allow about 10–20 minutes of setup/review plus a finite run budget. Use Sol medium only if the wire mapping remains ambiguous. Done when the worker itself writes and runs the utility, independent checks pass, actual request settings and elapsed time are recorded, and failure is reported honestly. No worker launched by this round. |

Focused source evidence inspected for H2–H3:

- `/Users/weiwei/.dsh/cordis.patch.yml`, default model and the `ollama-local` model declaration; credentials and headers excluded from this report.
- `/Users/weiwei/.dsh/profiles/headless/cordis.patch.yml`, empty local profile patch.
- [Local work overlay](/Users/weiwei/code/deepseek-harness/apps/cli/config/examples/local-work/headless.patch.yml).
- [Adapter reasoning mapping](/Users/weiwei/code/deepseek-harness/packages/llm/llm-pi-ai/src/adapter.ts) (`profileOptions`, `resolveReasoningLevel`, `reasoningInfo`).
- [Catalog reasoning declarations](/Users/weiwei/code/deepseek-harness/packages/llm/llm-pi-ai/src/catalog.ts) (`resolveModelReasoning`).

These are the live files inspected now. The original run's 4,096-output-token max-tokens termination remains independently recorded in `harness-summary.json`. No request-body capture or new Harness replay was performed in this round.

For the proposed replay, use a fresh session and an invocation-scoped configuration, then inspect the effective configuration after precedence resolution. A global home patch affects other sessions, so avoid silently editing it to conduct a local experiment. Output-generation cap, compaction-summary cap and runtime context allocation are separate settings even when some numbers happen to match. Keep bounds finite; enlarging every limit is not the default repair.

Recovery should inspect actual output files before retrying. A durable conversation is not file rollback. Preserve the failure reason in the task receipt, and do not silently switch to a direct API or paid model and count that as Harness success. Keep one active local worker initially; extra sessions share this laptop's memory and model runtime.

Checks for this round: relevant live configuration and owning adapter sources inspected; consideration saved in the existing owner; local report links checked. No runtime or configuration edits, inference requests, tests of new wire behavior, or gameplay claims.
