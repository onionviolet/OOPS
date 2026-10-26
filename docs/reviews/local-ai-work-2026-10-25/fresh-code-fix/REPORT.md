# Fresh local code fix: tests pass and normal finish without follow-ups

2026-10-25, America/New_York. Weibao asked to fix the remaining fixture/finish issues, then test a fresh small code fix through Harness without additional prompts. Applied AD32, AD36, AD37/AU1–AU15 and AD41.

**Result: yes, this fresh trial passed both verification commands on its first verification run and finished normally in 93.925 seconds. One initial human task message, zero follow-ups, no resumed session, no repair prompt and no primary-agent code correction.** Independent review accepted and applied the exact patch locally.

## N1: Fixture and finish improvements

Added a standard-library [fixture builder, installed](/Users/weiwei/.dsh/skills/local-scripts/scripts/fixture_program.py) and [source copy](/Users/weiwei/code/deepseek-harness/apps/cli/config/examples/local-work/skills/local-scripts/scripts/fixture_program.py). It turns exact byte payloads into ASCII child Python source using hex strings, or writes a fixture through its CLI. Tests execute the generated program with invalid bytes, NUL/newline/quote/backslash bytes, valid Unicode, empty output and nonzero exit status. They also test a fixture file path containing spaces and reject invalid input types/statuses.

Updated the [verification helper](/Users/weiwei/.dsh/skills/local-scripts/scripts/verify_task.py) to return a small finish packet after a pass: next_action final_answer, actual check names/statuses, receipt path and source identity reminder. It continues to fail fast and retain tested hashes.

Updated the [installed skill](/Users/weiwei/.dsh/skills/local-scripts/SKILL.md), [source skill](/Users/weiwei/code/deepseek-harness/apps/cli/config/examples/local-work/skills/local-scripts/SKILL.md), and [Local work headless overlay](/Users/weiwei/code/deepseek-harness/apps/cli/config/examples/local-work/headless.patch.yml). The system-level instruction makes a final answer the next response after a passing finish packet, with an exception for a named unresolved failure/discrepancy. It forbids post-pass comment cleanup and confirmation reads. The skill explains the fixture builder and avoids introducing an installed-skill dependency into portable project tests.

**10/10 focused helper tests pass**: three fixture-builder tests and seven verification-helper tests, including the finish packet. Recorded 0.644 seconds. [Test receipt](helper-tests.json), [fixture tests](test_fixture_program.py), [verification tests](test_verify_task.py), [change/backup receipt](settings-change.json). Installed and source copies match. No Harness package runtime source, dependency, permission mode or model setting changed.

This new PID task did not need binary fixtures. Fixture construction is validated through the helper tests; this trial does not show that a model will never hand-write an incorrect fixture in another task.

## N2: Fresh task and no-intervention protocol

Selected a different real defect in [scripts/lanes/lanes.py](../../../../scripts/lanes/lanes.py). Its _alive helper accepted zero, negative integers and booleans, sent them to os.kill(pid, 0), and could classify malformed receipt values as a running process. That can produce misleading status or block a replacement launch. [Reproduction](reproduction.json) used mocks, not real OS signals. The original six lane tests passed. The fixed [acceptance checker](acceptance.py) failed the original code: [baseline rejection](baseline-acceptance.json).

One fresh session received a bounded task with the owning code, existing tests and fixed check configuration. Only two code/test files could change; fixed checker/config stayed read-only. New liveness and launch cases had to mock process operations. Existing Git tests created temporary fixture repositories; no project Git state or real agent process was used.

[Initial task prompt](prompt.txt), [protocol declared before launch](protocol.json), [runner](run_verified.py), [input hashes](input-manifest.json), [run receipt](run.json), [event log](events.jsonl). Budget was ten model steps and eight minutes, including verification and final, instead of earlier trials' eight-step ceiling. The worker actually used seven steps, so the extra allowance was not required to reach completion.

| Observed metric | Result |
|---|---|
| Runtime | 93.925 seconds |
| Model steps / backend requests | 7 / 8 |
| Verification helper runs | 1, pass |
| Test failures or model repair attempts | 0 |
| Human task messages / follow-ups | 1 / 0 |
| Resume or second task invocation | None |
| Process exit / supervisor stop | 0 / none |
| Terminal event | completed |

The worker read the relevant files and checker, changed the PID predicate, added four regression methods, ran the supplied verification command, then returned its final answer. No tool call occurred after the passing verification result. [Worker final answer](final-answer.txt).

The durable session contains one human-origin task message and three automatic startup contexts (workspace instructions, runtime policy snapshot and skill catalog). These are normal startup context, not additional human repair prompts. It contains one turn. [No-follow-up proof](no-followups-proof.json). No additional message was sent while it ran.

All eight backend requests sent reasoning_effort none and emitted zero reasoning text. [Wire receipt](wire.json). Positive/negative thinking-control qualification remains in the earlier settings trial; none was needed here.

## N3: Independent assessment and local delivery

The implementation adds one predicate condition plus a comment: reject bool values, non-integers and non-positive integers before querying liveness. Existing behavior for valid positive PIDs, ProcessLookupError and PermissionError remains. Four new regression methods cover invalid inputs/no OS call, valid-PID outcomes, status for invalid receipts and replacement launch from an invalid receipt. All new process/OS probes are mocked.

[Exact accepted patch](accepted.patch). Primary review compared all original test/helper ASTs and found them unchanged. The new tests fail against the original implementation, then all **10 lane tests pass** against the candidate. The independent checker passes ten invalid-PID cases, three valid-liveness outcomes, three invalid status receipts and a replacement-launch case. [Independent results](independent-checks.json).

The worker receipt records both required commands exiting 0, with hashes matching its final files. [Verification receipt](after/verification-receipt.json). Fixed checker and check config bytes remained unchanged.

After a fresh source-hash ownership check, the primary agent applied the exact worker-produced code/test files and reran the focused module in the primary checkout: **10/10 pass**. [Integration and test receipt](integration.json). The primary also updated the owning [lane README](../../../../scripts/lanes/README.md). No model-produced code or test was corrected by the primary. The earlier accepted tool-probe fix remained untouched.

## Instrumentation corrections and limits

A literal request-body flag did not detect the new system finish text. I initially speculated that a preset persona shadowed it. That explanation was premature: the owning headless implementation uses the global prompt layer, and the durable system/message contains the rendered instruction. [Policy observation](prompt-policy-receipt.json), [durable confirmation](no-followups-proof.json), [composed settings](effective-worker-settings.json). No preset change or live trial intervention was made. The false raw diagnostic flags remain in the wire receipt; they are not presented as proof of shadowing or absence.

My first independent regression audit selected old tests as well as old source because of an overly broad filename suffix match. It failed its audit assertion before applying code. I corrected that selection in [the saved verifier](verify_independently.py); the retained independent evidence then tests new regressions against old implementation as intended. Neither audit correction involved the Harness worker or changed its code.

This is one successful fresh task with explicit checks, a known local model and a small isolated edit. It demonstrates no-follow-up completion at that scope, not a general first-pass reliability rate or isolated causal proof for any one instruction change. The PID task differs from the prior output-decoding task.

Helper/skill changes were tested directly, and the lane changes use their focused Python tests. No gameplay/UI runtime changed, so no game build/full suite/browser run was performed. Temporary relays and worker processes were checked stopped. Project changes remain uncommitted; no project push, publication or installation of model dependencies occurred.
