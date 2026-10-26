# Harness settings repair and same-task replay

Latest authorized follow-up: [bounded workflow, worker verification and normal completion](../harness-finished/REPORT.md). Earlier replay results below remain dated evidence.

2026-10-25, America/New_York. Weibao authorized fixing Harness settings, rerunning the same task and verifying actual thinking behavior. This follows the [initial task and consideration round](../real-task/REPORT.md). Applied AD32, AD36, AD37/AU1–AU15, AD41, source/secret boundaries, and the Harness repository instructions. No Harness package source, gameplay code or user saves changed.

**Settings fixed and backend behavior verified. The Harness produced correct artifacts without code corrections, but the supervisor stopped its session at the step limit before a normal final summary.** Artifact acceptance and clean agent completion remain distinct.

## H6: Persistent settings repair

Changed `/Users/weiwei/.dsh/cordis.patch.yml` with an exact local edit after saving a private backup. [Change receipt](settings-change.json) includes before/after hashes and the backup path, without copying authentication settings into this report.

| Setting | Before | After |
|---|---|---|
| Compatibility thinking format | `qwen` | `openai` |
| Default agent reasoning effort | `low` | `off` |
| Off dispatch | absent | `off: none` |
| Offered effort mapping | low, medium, high sent literally | off → none, low → low, medium → medium, high → xhigh, xhigh → xhigh |
| Model output cap | 4,096 | 4,096, unchanged |
| Declared Harness context | 32,768 | 32,768, unchanged |

Live `/api/show` reported thinking values `[false, low, medium, xhigh]`, default medium. The prior route's literal high did not match that list. The previous high selection is retained as an alias mapping to supported xhigh so an existing explicit selection can remain meaningful. That alias was added after the replay; it does not change the tested off dispatch. No broader reasoning-budget change was needed.

The installed pi-ai serializer's Qwen branch sends `enable_thinking`, while its OpenAI branch can send the model's mapped `reasoning_effort` off value. [Ollama's documented OpenAI control](https://docs.ollama.com/api/openai-compatibility) includes `reasoning_effort`; the actual local none behavior is verified below. Do not infer backend acceptance of other vendor fields from their names.

[Final composed settings](final-effective-settings.json) confirm default off, the OpenAI mapping and the direct `http://127.0.0.1:11434/v1` URL. [Replay-time composed settings](effective-settings.json) predate only the compatible high alias. Existing sessions with a stored explicit reasoning selection can override a new default; this replay used a fresh session. Web-session adoption was not tested.

## H7: Actual backend off verification

A temporary loopback HTTP relay forwarded each request body unchanged to Ollama. It recorded only request controls/hashes/counts and response field lengths/finish status, not authentication headers or reasoning text. It did not inject a thinking-off parameter. The Harness itself supplied `reasoning_effort: none`. The relay URL was an invocation-only overlay, never the persisted endpoint, and its server was closed after the run.

Positive/negative control, same model and prompt, 96-token output ceiling:

| Request | Returned answer | Backend reasoning characters |
|---|---|---:|
| `reasoning_effort: low` | 391 | 43 |
| `reasoning_effort: none` | 391 | 0 |

The model was cold before the first control and warm for the next. The controls establish an observable difference in backend thinking behavior; they are not a fair speed comparison. See [controls.json](controls.json) and [preflight-wire.json](preflight-wire.json). Ollama documents separate thinking output in its [thinking guide](https://docs.ollama.com/capabilities/thinking); this local OpenAI route returned it under `reasoning`.

My first control summary counted only `reasoning_content` and wrongly failed its assertion despite the relay already recording 43 reasoning characters across supported field names. I corrected the summary using that original capture. A third direct diagnostic confirmed the returned fields were role/content/reasoning; it was a diagnostic request, not another task completion. The canaries were not rerun or hidden.

All **9 backend requests in the Harness task** carried `reasoning_effort: none`, completed with HTTP 200, and returned **zero reasoning characters** and no literal thinking tags in the observed content. Response records ended in stop/tool_calls. [wire.json](wire.json) retains the two controls followed by those nine task requests. This establishes the backend off control and absence of emitted reasoning for this task; it makes no claim about inaccessible internal computation.

## H8: Same task, correct artifacts, inefficient completion

Input and original prompt were reused byte-for-byte from the first Harness trial. Input SHA256: `e4d217d7b20a7fae6c325b2c5d6753bdb4c584fe31fcf38a1740ca6d6f69a9a1`. [Snapshot](registry-snapshot.json), [prompt](prompt.txt), [run receipt](run.json), [event log](events.jsonl), [runner](run_verified.py). Same Qwen model, Local work composition, workspace-write/never, eight-minute wall limit, eight-step allowance, no paid or alternate-model fallback. The diagnostic controls warmed the model before this run; the original first attempt had a different load state.

Observed trajectory: loaded the local-scripts skill, listed the workspace, made five schema/data exploration shell calls, wrote the Python script, ran its CLI, and read both output files. Script generation/execution occurred entirely through Harness tools. The primary agent did not execute the real-input transformation for it or edit its code.

Elapsed task run: **117.066 seconds**. The original failed Harness attempt took 208.936 seconds and produced no artifact. The direct recovery took 27.346 seconds for code generation only and left execution to the primary agent. These are three different completion paths with different warm/context conditions, not a controlled runner ranking.

The worker used eight completed steps and began a ninth; the supervisor then sent SIGTERM to its recorded process group. The terminal event is **aborted/disposed**, despite process exit code 0. Nine backend requests were observed across those completed steps; a step count is not identical to request count. The reactive step guard is not a strict request-admission ceiling. No continuation or extra completion request was launched after reaching the bound.

The files were already written and read back before the stop. This is successful artifact production, not a normally completed Harness session. The repeated exploration consumed the small allowance and prevented final self-verification/reporting. A follow-up prompt should cap exploration explicitly and reserve steps for tests and the final answer, rather than silently raise the ceiling.

Accepted files, unchanged from the worker's writes:

- [summarize_registry.py](summarize_registry.py): reusable standard-library CLI, 7,452 bytes; primary-agent source review found input/output file operations and no registry execution or network calls.
- [inventory.json](inventory.json): correct counts and complete requested ID lists.
- [inventory.md](inventory.md): useful detailed summary including the installation/probe evidence caveat.

The larger script includes some unused local variables and broader input handling than requested; these were left intact for honest scoring. It uses newer f-string syntax supported by the local Python used for the trial; cross-version portability was not claimed.

## H9: Independent acceptance

The same [independent verifier](verify.py) used for the earlier task checked all nine JSON fields, exact keys, source/snapshot preservation, the Markdown evidence caveat and two edge inputs (empty registry; missing/null/empty optional fields, repeated IDs and repeated paths). **15/15 passed**, recorded execution 0.052 seconds. [Verification receipt](verification.json), [expected values](expected.json). Zero generated-code corrections.

The actual input and owning registry were unchanged. Correct results: 41 tools, 31 launch and 10 reference; 20 launch rows with configured probes and 11 without; 27 missing explicit owner fields; zero duplicate IDs; 40 required references and 38 unique raw strings. These are configuration facts, not defects or installation checks.

The worker read back its real-input outputs; the primary agent performed the independent oracle and edge-case tests. Do not attribute those stronger tests to the worker. Game build, full game tests and browser checks were unnecessary for local configuration and audit-artifact changes and were not run.

## Incidental setup failures and final state

The first relay-only invocation replaced the provider row without its local placeholder Authorization header, so Harness rejected it before any backend request. The overlay was corrected to preserve the placeholder. [Startup failure receipt](relay-startup-failure-run.json), [diagnostic](relay-startup-failure-stderr.log). This was an observation-overlay error, not a failure of the persisted off mapping. The successful replay used the corrected overlay.

Two controls, one additional field-diagnostic request and nine Harness task requests were made in this follow-up. The failed relay startup made no backend request. No other inference run, model download, configuration service restart, package edit, commit or push occurred.

Recommendation: keep the repaired settings for new local jobs. Harness now demonstrates file creation, execution and correct outputs with backend thinking off at this scope. Its next improvement is fewer exploration turns and a reserved finish/test budget. Normal end-to-end agent completion under the original eight-step limit remains open; there is no need to reinterpret the accepted artifacts as a clean session finish.
