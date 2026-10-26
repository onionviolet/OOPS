# Bounded Harness workflow: verified outputs and normal completion

2026-10-25, America/New_York. Weibao authorized fixing excessive exploration and rerunning through Harness until it verifies its outputs and finishes normally. This follows the [settings repair](../harness-fixed/REPORT.md). Applied AD32, AD36, AD37/AU1–AU15 and AD41. The final task succeeded; the preceding unsuccessful attempt is retained below.

**Final result: Harness generated and ran the utility, passed its fixed acceptance checker, and returned a normal final answer in 111.255 seconds. Six completed steps, seven backend requests, no supervisor stop. Primary-agent independent verification passed 15/15.**

## H10: Persistent workflow correction

Updated the existing `local-scripts` skill in both its installed location and its source example:

- [Installed skill](/Users/weiwei/.dsh/skills/local-scripts/SKILL.md).
- [Source skill](/Users/weiwei/code/deepseek-harness/apps/cli/config/examples/local-work/skills/local-scripts/SKILL.md).

The narrow addition defaults bounded file transformations to one batched inspection, permits extra inspection for a specific missing fact or failure, reserves the last two responses for verification and final reporting, reuses an existing acceptance checker when available, and avoids another confirmation read after checks have already opened and verified the outputs. It does not restrict research or complex repairs to one inspection.

[Current skill snapshot](local-scripts-SKILL.md), [final change receipt](skill-change.json), and the [first bounded-edit receipt](../harness-bounded/skill-change.json) preserve the changes and original private backup pointer. Installed and source copies match. Frontmatter parsed successfully using the existing Node YAML library. The skill-creator Python `quick_validate.py` was attempted but could not import PyYAML; no dependency was installed. Live skill loading and worker behavior provide separate execution evidence, not a claim that the Python validator passed.

The tested local default remains Qwen through Ollama with thinking off and the unchanged 4,096-token model output cap. No Harness package runtime code or persistent permission setting changed. The source skill was already part of another uncommitted Local work area; this task added only the bounded-work guidance and preserved the existing content.

## H11: Failed intermediate attempt and the correction it justified

The first fresh attempt with advisory batching and self-authored tests is retained in [harness-bounded](../harness-bounded/run.json). It used three schema inspection shell calls rather than the prior five, generated a script, and tested it. Its own test expectations were wrong twice: an ID appeared on both probe and non-probe rows, and a missing-owner row was omitted from an expected list. It revised those tests, reported they passed, then reread the generated reports and reached the step limit. Session ended aborted/disposed at 219.704 seconds. [Summary with failed checks](../harness-bounded/summary.json).

Crucially, the primary agent's unchanged independent verifier then scored that script **14/15**. It had incorrectly removed repeated IDs from per-row output lists. The real registry has no duplicate IDs, so its real-input output looked correct while the edge input exposed the defect. Its own revised tests had missed this. The failed script remains in that evidence folder and was not promoted or edited to appear passing.

This justified two concrete changes: reuse a fixed acceptance checker rather than spending turns inventing inconsistent expectations, and return a final answer after a pass instead of rereading already verified reports. The final trial started in a fresh workspace with no prior generated utility. The final prompt retained the original transformation contract and added those workflow instructions.

A preparation script also missed a local variable while copying the first verifier; the verifier was copied before use. This affected only audit setup, not worker-generated code or any reported test result.

## H12: Final trial inputs and observed behavior

Artifacts: [prompt](prompt.txt), [runner](run_verified.py), [input snapshot](registry-snapshot.json), [run receipt](run.json), [events](events.jsonl), [compact summary](summary.json), [worker final answer](final-answer.txt).

Same frozen real registry as the preceding trials: 20,422 bytes, SHA256 `e4d217d7b20a7fae6c325b2c5d6753bdb4c584fe31fcf38a1740ca6d6f69a9a1`. Same Qwen model and repaired local configuration, workspace-write/never. New prompt and supplied checker make this a workflow trial, not an isolated single-variable benchmark. The model was already warm from earlier work.

Budget: one final fresh local worker, six-step allowance, 480-second wall limit, no paid or alternate-model fallback. This followed one interrupted worker in the current follow-up. No new inference was launched after the final successful run.

Observed final sequence:

| Step | Worker action |
|---|---|
| 1 | Load the revised local-scripts skill |
| 2 | Batched workspace/schema inspection and checker help |
| 3 | Read the fixed checker and one further schema inspection batch |
| 4 | Write the generic utility |
| 5 | Execute the utility and fixed acceptance checker together |
| 6 | Return a final answer with commands, paths and verification result |

The one-batch target remains instruction-level guidance, not a hard tool restriction. This worker used two inspection shell calls plus a checker read, compared with the preceding settings-only run's five schema calls. It did not inspect output files again after the checker passed. No assertion or implementation repair was needed in this final attempt.

Task elapsed **111.255 seconds**, process exit 0, terminal reason **completed**, no supervisor stop. There were seven backend requests across six steps, so step count is not request count. The existing supervisor reacts to an excessive step-start rather than preventing a request in advance; it was not triggered in the successful trial.

## Worker verification and independent acceptance

Supplied [acceptance.py](acceptance.py) is fixed task scaffolding, not model-generated implementation. It computes expectations from input, checks the actual JSON and Markdown caveat, executes the generated CLI against empty and duplicate/optional-field fixtures, checks inputs remain unchanged, and writes [acceptance-results.json](acceptance-results.json). The worker ran it successfully on the first attempt and left its bytes unchanged.

Before supplying it, the primary agent qualified the checker against the earlier independently passing utility and the newly failing duplicate-list implementation: it accepted the good script and rejected the bad one. [Qualification evidence](checker-qualification.json). This checks a real regression rather than only testing a checker that approves its intended output.

After Harness finished, the primary agent reviewed the generated source and ran the same separately retained [independent verifier](verify.py) used in earlier trials. **15/15 passed**, recorded 0.054 seconds. [Receipt](verification.json), [expected values](expected.json). Real input and owning source hashes match, all nine requested JSON fields match, exact keys and evidence caveat pass, and both edge inputs pass. The generated code was not corrected or rewritten by the primary agent.

Useful outputs:

- [summarize_registry.py](summarize_registry.py): reusable standard-library CLI, 6,216 bytes.
- [inventory.json](inventory.json): 41 tools, 31 launch/10 reference; 20 configured probes/11 without; 27 missing explicit owners; zero duplicate IDs; 40 required references/38 unique raw strings.
- [inventory.md](inventory.md): human-readable report and evidence caveat.

Missing fields and probe counts remain configuration facts, not installation failures. The utility uses data-driven computations rather than hard-coded registry totals. Source review found the declared input/output operations and no registry execution, network request or installation behavior. Malformed arbitrary schemas and cross-platform runtime acceptance were outside this trial.

## H13: Backend thinking and final state

The unchanged-body loopback observation relay captured all seven final-task backend requests: every one sent `reasoning_effort: none`, returned HTTP 200, and emitted zero reasoning characters. No thinking tags appeared in observed content. [Wire receipt](wire.json). The earlier [positive/negative controls](../harness-fixed/controls.json) established that this observer distinguishes enabled reasoning from disabled reasoning; no new canary requests were needed here.

The relay changed only the invocation endpoint. It never inserted an off control. Persistent configuration retains the direct Ollama URL and off mapping. The relay was closed and the worker process exited after normal completion.

No game runtime source, user save, model download, package build, commit or push changed. Full game or Harness runtime suites were not run for these skill instructions and audit artifacts. The observed success qualifies this bounded file task with fixed checks, not every local-agent workload. Prompt/skill guidance alone does not enforce an arbitrary future task's exploration limit.

The completed outcome is the worker's verified artifact plus normal terminal completion. No additional work is required for this trial.
