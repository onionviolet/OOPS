---
paths:
  - "docs/research/**"
  - "docs/audits/**"
  - "tools/**"
  - "private_packs/**"
  - "docs/AGENT_USAGE_RULES.md"
---

Original worlds and specific book references are both allowed design sources.
Follow PROJECT.md on attribution, source verification, and inspiration versus
a requested direct adaptation. Do not block on a finalized favorite-book list.
Reading a supplied book in full is allowed; never modify the source library or
commit raw prose. Keep `docs/research/novels/` out of git. For a deep dive
on a whole source (power system, rules, fan premises, wiki cross-check),
follow [the source deep dive playbook](docs/research/SOURCE_DEEP_DIVE_PLAYBOOK.md).

Research passes save deep details for future reference
([standing rule](docs/USER_VISION.md#save-deep-details-for-reference-2026-10-14)):
full dialogue and text with IDs and conditions, full data tables, decoded
flows and native notes. Store them in gitignored
`docs/research/<source>/private/` (bulk raw data may stay in
`~/.codex/research/<source>/`). Committed docs still paraphrase and link
there; gameplay stays original unless a direct adaptation is requested.

Audits and research use the unbiased lens: report what a source actually does,
including contradictions with project ideas; label claims shown, stated or
inferred; do not rank sources or turn one source into a general rule. Standing
task (2026-10-13): source-read or decompile every game in the
[acquisition queue](docs/research/FUTURE_ACQUISITION_QUEUE_2026-10-13.md) that
Weibao already owns, read-only, and repeat when his library, the queue or local
tools change; buying needs his yes. Repeatable topic audits live in
`docs/audits/*_CORE_AUDIT.md` with the
[topic audit playbook](docs/audits/TOPIC_EXPANSION_AUDIT_PLAYBOOK.md); fold a
method that worked into its playbook rather than leaving it in one run report.

## Source acquisition tools

Start at [the shared tool registry](docs/TOOL_REGISTRY.md) or
`python3 scripts/toolsets.py list` for current REA/Ghidra, managed/Unity,
Discord, book, media and verification routes. Use `show` and scoped
`doctor --probe` before a launch; dated tool-fit reports are history, not
current installation authority. Launchers do not install, register or sign in.

Before collecting books or fanfiction, read
[source acquisition tools](docs/research/SOURCE_ACQUISITION_TOOLS.md). Discover
the existing `/Users/weiwei/code/lncrawl-polite` fork and project bridges before
writing another downloader. Reuse its polite transport; an upstream adapter or
a script with a delay is not automatically polite mode. Keep actual source,
capture, reading and gameplay verification separate. The shared rules here
apply to both Codex and Claude through CLAUDE.md's AGENTS.md import.

## Agent usage budget

Before generating agents or bulk book readers, follow [agent usage rules](docs/AGENT_USAGE_RULES.md)
AU1–AU15 / AD37. One coordinator, one shared budget including retries and successors;
readers may spawn lesser agents from reserved portions of that same budget.
For full-book requests, declare one finite whole-source plan (AU13), target one
to three coordinating chats, and use fresh reader contexts: haiku first in
Claude sessions (2026-10-23) unless Weibao specifies Codex limits, then
Luna-medium when available. Each reader owns at most 12,000 source words and six model responses,
then retires; never feed it the next shard. Keep raw chapters out of coordinator
history and use bounded continuity notes (AU15). Two generated agents run at once
by default. The old four-reader cap applies to exploratory tasks, not full books.
Budget and allowance ceilings still apply; no silent paid or stronger-model fallback.
