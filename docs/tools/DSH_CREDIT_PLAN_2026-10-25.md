# DSH provider and expiring-credit plan, 2026-10-25

## Current setup and verified correction, 2026-10-25

Weibao authorized setting up DSH and verifying credit/models. The signed-in Anthropic promotional-credit table shows the grant expires **November 10, 2026 UTC**, not November 1. November 1 is the monthly spending-counter reset. The grant started at $100 untouched; after bounded provider checks its table showed $99.93 remaining, with minor lag/rounding differences elsewhere on the page. The Console organization ID matches the response header returned to DSH's stored Anthropic key. No payment method was on file and billing settings were not changed. This supersedes the unverified expiry assumption and forced six-day pace below.

Local DSH Web/headless defaults are now Sonnet 5.5 at medium effort. Web Standard mode supports Haiku 5.5 fresh children by default, with explicit child selections for Sonnet, DeepSeek and local Qwen. Opus remains manually available, excluded from automatic child routes. Headless saved-credential access was enabled and awaited at startup after an observed missing-credential failure. Local routes and local presets remain available; `dsh-work` retains local Qwen. Credentials were not copied into configuration or wrappers.

Verified useful fixture checks: Haiku source extraction, Sonnet reproducing/fixing an arithmetic defect, DeepSeek Flash and V4 Pro responses, local Qwen response and a Sonnet-to-Haiku fresh-reader handoff. DeepSeek V4 Pro's initial medium-effort request was refused; its shortcut was corrected to the adapter's supported low effort and the rerun passed. Anthropic Opus is authenticated/listed and selectable; its generation was not exercised. Headless schema export passed; Web's six preset-carrier export errors also reproduced with an isolated copy of the exact pre-change configuration. Provider setup is not implementation of any YAIRPG mechanic or authorization for a new bulk work wave.

Convenience commands: `dsh-haiku`, `dsh-sonnet`, `dsh-deepseek`, `dsh-deepseek-pro`, `dsh-local`, and manual `dsh-opus`. `dsh-usage` estimates Haiku/Sonnet/Opus event-stream costs; it excludes children and unreported charges and is not a dollar cap. Local receipt, usage caveats, screenshots, exact check status and recovery paths: `/Users/weiwei/.dsh/setup/README.md`. No recurring spending automation was created. No DSH repository source changed or was committed/pushed.

## Initial assessment and proposal history

Weibao reports $100 of Anthropic API credit expiring November 1 and asks how to use DSH with Anthropic and DeepSeek accordingly. This is a proposed allocation and a read-only configuration assessment, not a dispatched run or a change to standing agent policy. Apply AD33, AD36, AD37 and AU1–AU15. Existing implementation owners retain their files and source ranges.

## F1: inspected configuration

- DSH home: `/Users/weiwei/.dsh`. Its credential file contains Anthropic and DeepSeek credential identifiers; values were not printed. Authentication, remaining balance, applicable organization and exact expiry timestamp have not been verified.
- The web profile declares the `anthropic` route through `llm-pi-ai`, referencing `ANTHROPIC_API_KEY`.
- The home patch selects `ollama-local/qwen3.8:27b` with reasoning off. Several web preset compaction policies also name that local model. Adding credentials does not change the selected route; effective defaults and per-session choices require checking.
- The headless profile patch declares the local route but has no explicit Anthropic route. Inspect effective merged configuration before using it for Anthropic jobs, then add the route if absent. Never copy credential values into configuration or Git.
- DSH's adapter documents multiple coexisting providers, per-request route selection and child model configuration. This supports the proposed division of work; an actual mixed-provider task has not been exercised here.

## D1: proposed routing through October 31

| Route | Useful role | Acceptance evidence |
|---|---|---|
| Anthropic Haiku available to this account | Bounded source extraction, locators, classification and mechanical checks, following AU5 | Structured evidence with source locators and unread/uncertain spans; sampled source checks |
| Anthropic Sonnet available to this account | Bounded implementation, regression work and cross-source synthesis | Owned patch or source-linked artifact; relevant checks; rebuilt desktop proof for gameplay |
| Anthropic Opus, following required advisor review | A named difficult failure or unresolved design conflict where Sonnet falls short | Specific resolved issue and evidence; budget comes from the same $100 |
| DeepSeek | Pilot bounded extraction, comparisons and source-to-existing-system crosswalks | Exact locators, uncertainty labels and checked sample; measure quality before a larger wave |
| Local Qwen | File inventory, formatting and other checkable preparation | Output checked by tools; no API expenditure |

Prefer Sonnet for useful work while the Anthropic credit expires. DeepSeek remains useful for inexpensive preparation and an independent comparison; its bill is separate and does not consume the Anthropic balance. Do not reread completed source ranges or create redundant agents to consume credit.

## D2: proposed $100 outcome budget

| Allocation | Outcome |
|---|---|
| $60 | Complete existing authorized playable slices, selected from the current reference-mechanics checkpoint and D5 queue after checking active ownership |
| $25 | Resolve named source gaps and synthesize already extracted evidence into implementable mechanisms |
| $15 | Repair concrete failures, verify selected results and consolidate usable artifacts |

Treat the allocations as adjustable planning targets. Reserve headroom for in-flight calls and stop before any paid overage. Use the actual remaining promotional balance rather than assuming the original grant is untouched. API keys may belong to different organizations, so confirm the selected key draws from the credited organization.

## A1: execution order and pacing

1. Verify the grant balance, eligible API organization and exact expiry in the signed-in Claude Console. Plan to finish by October 31 rather than relying on November 1 being available.
2. Resolve the available Anthropic models and effective web/headless defaults. Keep local presets usable. Run one bounded useful pilot and capture provider-reported token usage and billed cost.
3. Schedule subsequent finite tasks against observed cost, one playable slice at a time. If all $100 remains, October 26–31 requires about $16.67 per day; including October 25 gives about $14.29 per day. Recompute as remaining balance divided by remaining usable days.
4. Track task, provider/model, reserved amount, actual input/output/cache usage, cost, artifact, verification and remaining balance. A DSH context/token estimate is not an authoritative dollar or promotional-credit balance.

No provider defaults were changed, API generation invoked, recurring job created, or money spent by this assessment. Configuration inspection establishes setup only. Billing eligibility and a successful useful pilot remain the first execution checks.

## Sources and checks

- Inspected local DSH home/profile patches, credential identifier presence and `packages/llm/llm-pi-ai/README.md`, `packages/subagent/subagent/README.md`, `packages/llm/token-meter/README.md` under `/Users/weiwei/code/deepseek-harness`.
- [Anthropic API pricing](https://platform.claude.com/docs/en/about-claude/pricing), checked 2026-10-25: published Sonnet 5.5 standard input/output $2/$10 per million tokens; Opus 5.5 $4/$20. Account access and DSH catalog support remain unverified. Caching changes actual cost.
- [DeepSeek pricing](https://api-docs.deepseek.com/quick_start/pricing/): use the current table for the route actually selected.
- Document-only check: relative links and plan arithmetic. No runtime code or tests changed; no gameplay completion is claimed.

## More-to-consider round 1: Haiku and broader uses

User request: “what about haiku? other stuff and more? more to consider?” This expands recommendations and corrects the missing Haiku row. It does not dispatch jobs, alter project priorities or authorize the candidate work below.

### ACT NOW: corrections completed in this plan

**F2: Haiku is the default candidate for bounded extraction.** The first routing table omitted the route already supported by AU5's standing Claude workflow. Prefer Haiku for finding passages, structured chapter facts, terminology tables, file classification, duplicate candidates and reporting deterministic check output. Give it exact input ranges, required fields, source locators and a stop condition. Use Sonnet for synthesis, contradictory evidence and implementation decisions. DeepSeek remains a candidate for comparison and later ongoing work; before expiry, Haiku can do overlapping extraction work using the Anthropic credit.

**F3: useful volume and credit consumption are different.** Published Haiku 5.5 pricing is $0.10/$0.50 per million input/output tokens for prompts up to 100,000 tokens, versus Sonnet 5.5 at $2/$10. An illustrative 50,000-input/2,000-output Haiku request costs $0.006 before caching, tool overhead or retries; 100 such requests total $0.60. This is arithmetic, not a measured DSH job or promised throughput. Filling a week with cheap extraction alone is unlikely to use $100 without excessive work. Use the remaining budget for valuable synthesis and delivery rather than enlarging reader waves to burn tokens. Haiku prompts over 100,000 tokens have higher pricing; the project's existing bounded-reader rules remain tighter than this threshold.

### ACCOUNT FOR NOW: execution constraints

**D3: proposed model envelopes within D2's outcome budget.** Initially reserve $10 for Haiku, $65 for Sonnet, $15 for justified Opus escalation and $10 unassigned for completion/repair. These total $100 and are not an additional budget. Move unused Haiku or Opus allocation to useful Sonnet work. Keep Opus's existing advisor/escalation conditions. Model access, effort controls, effective configuration and billed usage need a pilot; no hard-coded new model ID is prescribed here.

**F4: the grant may recur.** Anthropic documents monthly API credits for eligible Max and Team plans, including $100 for Max 5x, with expiry each billing cycle and no rollover. If this is Weibao's grant, November 1 may be a refresh boundary, not the end of API access. The account's grant type, eligibility, linked organization and actual renewal date remain unverified. The published benefit covers API usage and excludes Claude Code and extra Claude-app usage. A direct Anthropic API route in DSH is the relevant candidate; do not assume a Claude Code process uses this credit simply because it has an API key.

**D4: reserve cost before launch.** Include all children, retries, compaction and reviewer calls in the same budget. Start at the existing default of at most two concurrent research workers. DSH's goal round cap is not a token or dollar cap, as its goal documentation explicitly states. Dollar estimates need actual provider-reported usage and Console reconciliation; limit in-flight work near the remaining balance. A model's self-reported spending estimate is insufficient.

**D5: preserve useful artifacts across expiry.** Readers write reusable source indexes and consolidated evidence, not repeated chat summaries. Implementers deliver reviewed patches and tests. Keep sealed source truths in their existing private discovery owners. Share evidence between model roles through bounded artifacts; avoid passing every raw source or full parent history to each role. Deterministic scripts should own hashing, counting and formatting.

**O1: batch independent extraction when worthwhile.** Anthropic documents 50% Batch API discounts and a processing window up to 24 hours. This suits prepared independent requests, not an interactive agent's next tool-dependent step. DSH Batch API support is unverified; do not promise a toggle or implement another runner without checking existing routes. Leave completion margin before the grant expires. The exact grant treatment of pending requests is unverified.

### LATER / DELEGATE: candidate outputs, subject to current owner triage

These are suggested opportunities based on known projects, not fresh audits of their current state. Each requires inspecting its live owners before dispatch. No agent was spawned in this round.

| Code | Candidate | Suggested capability / effort | Effort | Done check |
|---|---|---|---|---|
| O2 | YAIRPG: index unread authorized source ranges and map evidence to existing systems | Haiku, low for indexing and medium for semantic extraction; Sonnet for synthesis | M | Disjoint coverage manifest, source-linked evidence, unresolved facts and a bounded build brief; preserve sealed truths |
| O3 | YAIRPG: finish an owned playable mechanic or repair a reproduced failure | Sonnet, medium; Opus only for justified escalation | M–L | Focused checks, required completion checks and rebuilt desktop/persistence evidence under AD36 |
| O4 | Grimoire: inspect remaining upstream parity and acceptance gaps | Haiku for bounded comparison; Sonnet for semantic review | M | Source-linked discrepancy list and reproducible checks; distinguish local smoke from real-game acceptance |
| O5 | DSH itself: verify provider selection, recovery and usage recording | Sonnet, medium; Haiku for bounded configuration inventories | M | A useful task on the intended provider with artifact and usage receipt; tested provider selection and failure behavior |
| O6 | Portfolio: turn existing project evidence into case-study drafts | Haiku for evidence extraction; Sonnet for writing and structure | M | Claims linked to existing artifacts and a reviewable draft; publishing remains separate |
| O7 | Learning: make cited study guides, practice questions and searchable notes from authorized course materials | Haiku for extraction; Sonnet for explanations and question quality | S–M | Source references, answer checks and compliance with the actual course policy; no submitted AI-produced coursework |
| O8 | Campus organizations: prepare recognition checklists, event packets and outreach drafts | Haiku for checklist extraction; Sonnet for drafting | S–M | Reviewable packet with source-backed requirements and unresolved approvals; no sending or submission |

### Additional sources and checks

- [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing): Haiku tier threshold, standard prices and Batch discount, checked 2026-10-25.
- [Monthly API credits](https://platform.claude.com/docs/en/about-claude/api-credits-for-subscribers): recurring benefit, expiry and coverage; account applicability unverified.
- [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing): official search excerpt describes the 24-hour window; direct page fetch timed out. Pricing page independently confirms the discount.
- Local DSH `packages/goal/goal/README.md` explicitly describes round-count budgeting without currency metering; `docs/user/guide/local-work.md` describes a smaller tool preset and states it is not an unattended scheduler.
- Documentation-only verification: model-envelope sum and illustrative price arithmetic. No provider configuration, runtime code, account state or spending changed.
