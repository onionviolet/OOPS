# Real code-fix trial: resilient tool-probe diagnostics

2026-10-25, America/New_York. Weibao asked for a small real code fix through the local Harness, relevant tests, normal completion and an independent assessment. Applied AD32, AD36, AD37/AU1–AU15 and AD41. The work was isolated until primary review and acceptance; unrelated shared changes were preserved.

**Outcome: a real launcher defect is fixed locally, with a regression. Harness ultimately ran both checks and finished normally. It needed functional repair and a final close-out prompt; this was not a one-shot autonomous success.**

## C1: Defect, patch and integration

The existing [launcher](../../../../scripts/toolsets.py) used strict subprocess text decoding. A synthetic child emitting invalid UTF-8 on stdout/stderr caused `doctor --probe` to raise `UnicodeDecodeError`, losing its structured diagnostic instead of reporting the child's actual status. The baseline eight launcher tests passed, so this was a reproduced uncovered case, not an injected source defect.

[Reproduction](../code-fix/reproduction.json), [baseline independent rejection](../code-fix/baseline-acceptance.json), [original inputs and hashes](../code-fix/input-manifest.json). Only synthetic Python fixture probes were executed; no registered external tool was probed.

Harness's reviewed patch captures probe output as bytes, normalizes stdout/stderr to UTF-8 text with replacement, tolerates already-text outputs used by existing mocks, and retains the previous 16,000/4,000-character output limits, exit-code classification and timeout behavior. [Exact accepted patch](accepted.patch). The implementation is a little larger than a subprocess decoding-option change, but the tested behavior is correct; primary review did not rewrite it.

The new [regression test](../../../../scripts/toolsets/tests/test_launcher.py) exercises actual invalid byte output and a nonzero child exit. All original test/helper ASTs were compared and found unchanged. The regression fails with `UnicodeDecodeError` against the old launcher: [before-patch regression evidence](regression-before.json).

After checking that owning source/test bytes still matched the frozen inputs, the primary agent copied the exact Harness-generated files into the checkout. [Integration receipt](integration.json). It also updated the existing [tool-registry documentation](../../../../docs/TOOL_REGISTRY.md) to explain decoding and retained-output behavior. No gameplay, persistence, model configuration, dependency, commit or push changed.

## C2: Harness trajectory and actual cost

Same local Qwen/Ollama route and repaired thinking-off mapping. Fresh isolated workspace for the initial code task; later repair/close turns resumed the same durable session. Source edit scope was the launcher and its test module. Registry and fixed checker bytes remained unchanged. Scratch reproduction files were used but not integrated into the repo.

| Stage | Recorded runtime | Result |
|---|---:|---|
| Brief preparation error | 46.147 s | Primary stopped the early run after finding byte-literal escaping errors in its own prompt. Retained in [aborted-brief](../code-fix/aborted-brief/run.json); not used for acceptance. |
| Corrected code-fix task | 148.761 s | Harness reproduced the defect, fixed byte output and added the regression, but broke an existing mock-based test by unconditionally decoding a string. Fixed independent byte checker passed; the full focused module failed. Step limit stopped the next turn. |
| Same-session repair | 57.127 s | Harness normalized bytes and strings, preserved old tests, and passed the nine-test module plus independent checker. It then spent steps cleaning a comment instead of finishing, and hit its bounded step limit. |
| Same-session normal close | 30.669 s | Harness reran both checks on the final source with `&&`, then returned a normal final answer. Two steps, terminal reason completed, no supervisor stop. |

Total recorded worker runtimes: **282.704 seconds**, about 4 minutes 43 seconds, including the primary's brief error. Excluding that error: **236.557 seconds**, about 3 minutes 57 seconds. These sums exclude primary investigation, review, independent checking and report-writing. [Stage metrics](stage-metrics.json). No subscription or human-time saving was measured.

The initial worker also needed a scratch reproduction file after mishandling shell escapes. Its first test command piped output through `tail`, so a successful last command could hide an earlier failing status; primary review inspected the failure and refused acceptance. The repair prompt demanded unhidden test outcomes. The final worker used `unittest ... && python3 acceptance.py`, so both checks had to pass before a normal finish.

[Initial prompt/runner and logs](../code-fix/run_verified.py), [repair prompt/runner and logs](../code-fix-repair/run_verified.py), [closing runner](run_verified.py), [normal run receipt](run.json), [normal event log](events.jsonl), [worker final answer](final-answer.txt). The accepted code is retained under [after/scripts/toolsets.py](after/scripts/toolsets.py), with the [added test](after/scripts/toolsets/tests/test_launcher.py).

The worker wrote the functional patch and regression. Primary-agent code corrections: **zero**. Primary intervention: defect selection/reproduction, fixed behavioral checker, correction of its own bad brief, a repair prompt after the existing-test failure, and a close-out prompt after unnecessary comment cleanup. Do not describe those interventions as independent unattended completion.

## C3: Independent acceptance and test coverage

The fixed [behavioral checker](acceptance.py) was supplied before execution and remained unchanged. It first failed on the original code, then passed on the accepted code. It exercises:

| Behavior | Evidence |
|---|---|
| Invalid bytes on stdout and stderr do not crash | Real synthetic child processes, not a decoding mock |
| Useful valid Unicode is retained and results remain JSON-serializable | Mixed valid UTF-8 and invalid bytes |
| Actual success/nonzero status preserved | Exit 0 and exit 7, both direct diagnose and CLI doctor JSON |
| Existing retained output limits preserved | Oversized streams with invalid trailing bytes |
| Arguments, environment, no fallback, reference routes and timeouts unchanged | Existing focused launcher tests |

Harness ran **9/9 focused tests** and the fixed checker successfully before its completed final answer. Primary then independently ran the integrated focused module: **9/9 pass**, recorded 0.079 seconds. [Primary test receipt](primary-focused-tests.json). It separately reran the checker against a byte-identical copy of the integrated source: [independent acceptance](independent-acceptance.json).

The old-source/new-test check demonstrates that the regression fails before the fix; it does not merely restate implementation details. The primary's AST comparison demonstrates that existing tests were not weakened. The new regression's small output does not prove large-output truncation; the independent long-output fixture provides that separate evidence.

`git diff --check -- scripts/toolsets.py scripts/toolsets/tests/test_launcher.py docs/TOOL_REGISTRY.md` passed. No full game tests/build/browser checks were run: this patch touches the standalone research-tool launcher and its Python tests, not gameplay or UI runtime. Cross-platform/locale matrix and real installed tools emitting invalid output were not exercised.

## C4: Backend observation and judgment

The successful repair/closing path retained the unchanged-body loopback relay. All 16 captured requests across the corrected initial task, repair and normal-close turn sent `reasoning_effort: none` and emitted zero reasoning text. The aborted bad-brief run is separate and not counted as a completed off-verification trial. [Initial task wire receipt](../code-fix/wire.json), [repair wire receipt](../code-fix-repair/wire.json), [normal-close wire receipt](wire.json). Positive/negative observer qualification remains in the earlier settings trial; no extra thinking canaries were run here.

**Assessment:** local Harness can implement this bounded repair, add a useful regression, recover from an existing-test failure and execute its checks. This example also shows why fixed full-slice tests and a primary review still matter: its first patch passed the new narrow checker while breaking an existing test, and it repeatedly spent completion turns on extra work. Use it for reviewable small patches with explicit tests and a clear stop instruction. This result does not establish reliable first-pass or unattended coding.

All local patch paths remain uncommitted. Temporary observation servers and worker processes were checked stopped after the run. The task is complete at the stated scope.
