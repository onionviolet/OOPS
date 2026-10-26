---
name: local-scripts
description: Inspect, run or adjust local Python and shell scripts, or use them to process text, JSON and CSV files.
---

# Local scripts and file tasks

Inspect the applicable project instructions, relevant source and existing tests together. For a bounded task, default to one batched inspection; inspect again only for a specific missing fact or observed failure. Use the existing environment, and inspect help before an unfamiliar command. Let deterministic code process full datasets instead of listing records repeatedly.

For a code fix, preserve existing interfaces and return types when a library option can express the behavior change. Reproduce with an existing checker or a small fixture file rather than embedding tricky byte literals in multiple shell quoting layers. Construct binary test fixtures with bytes([...]) or bytes.fromhex(...) when embedding a child Python program, so string decoding cannot turn escaped bytes into invalid source. For exact child output, use [fixture_program.py](scripts/fixture_program.py): output_program(stdout_bytes, stderr_bytes, exit_code) builds ASCII source with hex payloads, or its CLI writes a fixture with --stdout-hex, --stderr-hex, --exit-code and --out. Keep generated fixtures portable rather than adding a dependency on this installed skill to project tests. Preserve original tests and add a regression for the reproduced behavior. A new narrow check passing does not override a failure in the existing focused module.

For data tasks, preserve inputs, write explicit outputs, and check actual headers, counts, totals and a relevant edge case. Quote paths containing spaces.

Use a supplied acceptance checker rather than inventing a second oracle. When a task has several required commands, use [verify_task.py](scripts/verify_task.py) with a JSON file containing explicit source paths and checks: each check has a name, an argv string array and an optional timeout_seconds (default 120, maximum 600). Run python3 <skill-dir>/scripts/verify_task.py task-checks.json --receipt verification-receipt.json. The helper uses no shell, stops on failure and records source hashes with actual statuses. Treat a receipt as current only while its source hashes still match. If no check file is provided, run required commands with explicit failure propagation; do not hide test failures behind tail, a later successful command or printed summaries.

Reserve the final two responses for verification and reporting. When the helper returns next_action final_answer with a passing receipt, the next response should be the final answer, not another tool call. After required checks pass, return a short final answer with changed paths, commands/results and unresolved limits. Do not reread verified outputs or clean comments after a pass. Any later edit, including comments, invalidates the prior source receipt and requires verification again. Keep necessary cleanup before the final check.

After resuming in a fresh process, reread a file before editing it. After interruption, inspect effects before retrying. A failed check changes the next action; do not repeat it unchanged or weaken its assertions.

Sending, submitting, spending, publishing or deleting user data retains the user's specific authorization requirements. Script access does not expand that authority.
