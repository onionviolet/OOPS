---
name: local-scripts
description: Inspect, run or adjust local Python and shell scripts, or use them to process text, JSON and CSV files.
---

# Local scripts and file tasks

Read the project's instructions and the relevant script before running it. Use its README and --help to identify the interpreter, inputs, output paths and side effects. Prefer the project's existing environment and dependencies.

For an unfamiliar command, first inspect help or use its documented dry-run option. Keep original input files intact unless the user requested replacement. Write generated outputs to an explicit project output directory, and quote paths that contain spaces.

For bounded file transformations, default to one batched inspection: read the applicable instructions, top-level schema, one representative record and relevant optional-field shapes together. Once the input and requested output are clear, implement rather than listing more records. Inspect again when a specific missing fact or observed failure changes the implementation. Let deterministic code scan the full input. Reserve the final two model responses for executing output checks and reporting the result; combine related checks in one tool call. A successful run still needs output assertions, including an applicable empty or missing-field case. Finish with a normal final answer once checks pass; do not spend the remaining budget exploring already understood input.

For script changes, reproduce the problem, make the smallest appropriate change, and run the relevant check. Do not change tests merely to make them pass. For data tasks, check the actual output: headers, row counts, totals and at least one edge case such as quoted fields or a blank value.

Read existing files again after resuming in a new process before editing them. A failed tool call is evidence: inspect its reason and change the next step rather than repeating it. After interruption, inspect effects before rerunning.

Sending, submitting, spending, publishing or deleting user data requires the user's explicit authorization for that action. Do not use a script as a shortcut around that requirement.

Finish with the command run, actual output paths, verification results and anything unresolved. Distinguish a script exiting successfully from its output passing the requested checks.
