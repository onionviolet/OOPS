# Local Harness workflow improvement after the code-fix trial

2026-10-25, America/New_York. Weibao asked to “improve accordingly” after a supervised local code fix needed repair and close-out prompts. Applied AD32, AD36, AD37/AU1–AU15, AD41 and the skill-creator guidance. This task improves the existing local workflow; it selects no new gameplay work, model, provider, package dependency, commit or push.

**Delivered:** a revised installed/source skill, a tested verification helper, and a same-defect replay that produced a simpler implementation and ended normally after one bounded continuation. Verification is stronger; unattended first-pass coding is still not established.

## I1: Persistent changes

Updated [installed local-scripts](/Users/weiwei/.dsh/skills/local-scripts/SKILL.md) and its [source copy](/Users/weiwei/code/deepseek-harness/apps/cli/config/examples/local-work/skills/local-scripts/SKILL.md). The revised instructions preserve useful existing interface/return types, reuse supplied reproduction/checkers, recommend numeric/hex construction for binary child-program fixtures, require the existing focused suite as well as new checks, preserve failing statuses, and place cleanup before final verification.

Added [installed verify_task.py](/Users/weiwei/.dsh/skills/local-scripts/scripts/verify_task.py) and [source helper](/Users/weiwei/code/deepseek-harness/apps/cli/config/examples/local-work/skills/local-scripts/scripts/verify_task.py). The standard-library helper reads a task JSON with explicit source paths and check argv arrays, runs without a shell, uses bounded per-command timeouts, stops on failure, and writes a receipt containing real statuses, bounded output and before/after source hashes. A source edit after a pass leaves a stale hash rather than silently inheriting that result.

On failure it prints bounded multiline diagnostics directly, avoiding the Harness read tool's truncation of a long JSON string containing a traceback. It retains at most 8,000 stdout and 8,000 stderr characters per check. Actual outputs remain JSON-serializable even when commands emit invalid UTF-8.

Snapshots: [skill](../workflow-improvement/local-scripts-SKILL.md), [helper](../workflow-improvement/verify_task.py), [change/backup receipt](../workflow-improvement/change.json). Installed/source copies were checked equal. The helper is a task-check runner, not a sandbox or new execution permission.

## I2: Helper checks

Focused [source tests](/Users/weiwei/code/deepseek-harness/apps/cli/config/examples/local-work/skills/local-scripts/scripts/tests/test_verify_task.py) pass **7/7**, recorded 0.426 seconds after the final diagnostic change. [Test receipt](../workflow-improvement/helper-tests.json), [test snapshot](../workflow-improvement/test_verify_task.py).

| Case | Observed |
|---|---|
| Two successful checks | Passing receipt with both results and matching hashes |
| First command exits 7 | Helper exits 1; later marker-writing command never runs |
| Command mutates a source | Passing exit status cannot produce a verification pass |
| Invalid stdout/stderr bytes | Recorded as text with replacement characters |
| Timeout | Fails and does not run later checks |
| Shell-looking argument | Passed literally; no marker executed |
| Source edited after pass | Current hash differs from receipt |
| Failure diagnostics | Actual stderr appears directly as multiline output; assertion included in failure test |

The skill frontmatter parsed with the existing Node YAML library, and its helper reference resolved. The Python skill validator was unavailable in this environment because PyYAML is absent, as recorded in earlier rounds; no dependency was installed. This is not a claim that the Python validator passed.

## I3: Replay and remaining failure

Used a fresh isolated copy of the original unfixed launcher, its eight original tests and registry from the earlier captured inputs. The adopted project fix remained untouched. This was a guided replay of the known defect, not a new or held-out coding benchmark.

The worker immediately chose a one-line library configuration change: retain text mode and add UTF-8/replacement decoding. It preserved the existing test/mocking interface, avoiding the first trial's bytes-versus-string regression. [Candidate patch](candidate.patch).

Its new regression fixture initially embedded decoded byte escapes into a child Python program, causing the child to exit 1 rather than the expected 7. The verification helper correctly stopped on the focused-suite failure and did not run acceptance. While investigating that failure, a JSON read truncated the diagnostic line. The primary corrected the helper to print multiline errors and added binary-fixture guidance to the skill; the helper tests were rerun after that code change.

The worker corrected its own fixture before the initial eight-step limit stopped the session. [Initial replay receipt](../workflow-improvement/run.json), [initial events](../workflow-improvement/events.jsonl). The limit was retained; no interrupted result was relabeled complete. The newly added binary-fixture instruction was not independently tested in another fresh-context trial during this task.

One same-session continuation was explicitly limited to running the helper and returning a short final answer. It passed both required checks and finished normally in **10.226 seconds**, two steps, terminal reason **completed**. [Continuation receipt](run.json), [events](events.jsonl), [final answer](final-answer.txt). No primary-agent code or test correction was made to the replay candidate.

Recorded initial replay plus continuation: **129.258 seconds** (119.032 + 10.226), excluding primary workflow development, review and testing. The prior code-fix task excluding its brief error took 236.557 seconds across its repair/close turns. Different guidance, scaffolding and warm state prevent treating these observations as a general speed or success-rate comparison.

## I4: Independent acceptance and final state

The worker's [verification receipt](after/verification-receipt.json) records both the focused launcher suite and fixed acceptance checker exiting 0. Source hashes match the final copied files, and the checker/config stayed unchanged. The final answer followed the passing helper call without another source edit or output read.

Primary verification separately established:

- Original tests/helpers were unchanged; the candidate added a regression.
- The candidate passes all **9 launcher tests** and the independent mixed-byte/status/CLI/output-limit checker.
- The new regression fails with UnicodeDecodeError on the original source.
- Final source bytes match the helper receipt, and the adopted repository source/test files still match the preceding accepted fix.

[Independent receipts](independent-checks.json). All 11 captured requests across the replay/continuation used reasoning_effort none and emitted zero reasoning text. [Replay wire receipt](../workflow-improvement/wire.json), [continuation wire receipt](wire.json). The temporary servers and worker processes were checked stopped.

Assessment: this improves preservation of existing interfaces, test status handling, diagnostic visibility and source-version evidence. The replay still needed a fixture correction and a continuation, so the workflow should remain supervised for code edits. The helper can reject or expose failures; its checks do not make the model's reasoning, testing or stopping reliable by themselves.

No additional production fix was applied from the replay. Runtime/gameplay tests and builds were not run because the current task changed a Python skill helper, its focused tests and instruction files. Existing uncommitted gameplay and Harness work was preserved.
