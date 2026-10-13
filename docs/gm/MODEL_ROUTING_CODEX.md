# Model routing for Codex hosts

*Type: AGENT-REFERENCE. Moved verbatim from GAME_MASTER_PROMPT.md on 2026-10-13 so Claude-hosted GMs do not load OpenAI-specific routing. Claude hosts map these tiers to the Agent tool model choices (opus for ambiguous coordination, sonnet for settled bounded work, haiku for mechanical checks).*

## Choosing models without flattening the design

Route by ambiguity, consequence and the acceptance gate, not the role's title or the number of edited lines. Keep the master's configured model unless I request a change. The following are proposed execution defaults, not measured equivalence or guaranteed allowance savings. Check the host's current model and effort inventory before dispatch.

| Work | Proposed route | Escalation trigger |
|---|---|---|
| Shared design, world synthesis and normal integration | Current capable coordinator; `gpt-6.1-sol` at medium is a candidate for a newly assigned GM | Unresolved cross-system behavior or consequential recovery decisions |
| Settled local gameplay/UI code with explicit existing interfaces | `gpt-6-luna` at high for the first representative task | Failed edge cases, unclear integration or a need to change shared contracts |
| Deterministic content entries, bounded copy edits or mechanical checks | `gpt-6-luna` at low or medium according to the task | The task starts requiring new design or broad reasoning |
| Diagnosis that remains difficult after scope and evidence are repaired | `gpt-6.1-sol` at medium or higher supported effort for a named uncertainty | Use the capable integrator; a frontier route such as Astra at low needs a concrete reason |

Official OpenAI documentation recommends Luna for clear, narrowly scoped subagents and Sol for demanding, ambiguous work. It currently recommends high as an explicit starting effort for Luna, with effort adjusted to the task. These defaults apply that guidance to our workflow; lowering effort for mechanical work is a proposal to evaluate. [OpenAI subagent guidance](https://learn.chatgpt.com/docs/agent-configuration/subagents), [GPT-6 Luna model reference](https://developers.openai.com/api/docs/models/gpt-6-luna). Checked 2026-10-03; future hosts and model offerings can differ.

Qualify a cheaper route on one representative real slice before assigning a batch. Require the same behavior, knowledge boundaries, persistence and relevant browser checks as a stronger route. Review the fiction's fit as well as technical correctness. Do not simplify a distinct mechanic, omit an alternative route or weaken a gate to make a worker pass. Until that trial succeeds, describe Luna as a candidate for that task family.

On failure, first identify whether the brief, evidence, environment or implementation is wrong. Repair an understood defect and inspect the result. Repeat only when a new diagnosis supports another concrete correction; escalate unresolved design, architecture or capability needs to the appropriate GM rather than repeating unchanged attempts. Increase reasoning for a named edge case; use a stronger model when broader judgment is needed.

Track first-pass acceptance, repair rounds, escaped defects, elapsed time and total coordinator-plus-worker usage when the host exposes it. Parallelism can improve throughput while increasing total context. Official API prices do not establish this account's Codex allowance savings. Keep small workers' inputs focused and never duplicate a broad repository scan or full test suite merely because another agent is available.
