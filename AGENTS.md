# Agent instructions

Read the PROJECT.md summary and the relevant source before changing this
project.

## Standing direction and consistency gates

`docs/USER_VISION.md` preserves Weibao's goals, reasons and original requests;
`PROJECT.md` surfaces current priorities and accepted decisions. Relevant design
owners translate that direction into behavior. Checkpoints and verification
reports record execution and evidence, not new product authority.

Before substantive work, reconcile the task's outcome, relevant accepted direction
and deferred scope against those live owners. Agent proposals, audits, review
responses and inherited prompts cannot change a standing priority or turn deferred
work into a required gate. Only Weibao's later instruction can change his direction;
record that instruction and update affected live owners. Resolve clear conflicts
from existing authority without asking him to repeat an established preference.

UI work follows the [standing UI priority](docs/USER_VISION.md#standing-ui-priority-2026-10-13):
desktop/laptop first, mobile optimization deferred. For substantive UI work, name
the target viewport, visible outcome and deferred scope in the existing task
record. Before completion or handoff, check both the result and remaining gates
against the accepted direction. Rebuilt browser evidence at the target viewport
is required for UI behavior claims; mobile checks cannot substitute for it.

When direction changes, update its owner and PROJECT.md's summary, reconcile
affected active instructions, and preserve superseded wording as dated history.
Handoffs link to owners rather than copying another competing specification.

Making systems (potions, cooking, smithing, runes, enchanting, formations,
constructs and other crafts) follow [making rules](docs/MAKING_RULES.md)
MR1–MR36 (2026-10-15): truth stays separate from knowledge and chance, free
experimentation works in every world with formulas as attractors, world styles
are data with canon-status labels, depth is chosen per activity, mastery improves
control rather than truth, and one shared envelope sits over separate product
logics.

## Role

Weibao is the creative director. Implement authorized ideas directly and show
playable results. Do not impose a coached coding workflow unless he asks to
learn the implementation.

Make reasonable reversible prototype choices, label them as proposals and show
the playable result. Record accepted decisions in PROJECT.md.

## Scope

Keep the first milestone to one realm and one prestige layer, while preserving
the broader vision in PROJECT.md: deeper existing systems, several progression
paths and mechanically distinct worlds.

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

Finish one playable slice before starting the next. A wave ends
at a checkpoint where Weibao can play it, not when a context or batch boundary
is reached.

## Source acquisition tools

Before collecting books or fanfiction, read
[source acquisition tools](docs/research/SOURCE_ACQUISITION_TOOLS.md). Discover
the existing `/Users/weiwei/code/lncrawl-polite` fork and project bridges before
writing another downloader. Reuse its polite transport; an upstream adapter or
a script with a delay is not automatically polite mode. Keep actual source,
capture, reading and gameplay verification separate. The shared rules here
apply to both Codex and Claude through CLAUDE.md's AGENTS.md import.

## Verification

Before calling gameplay done: rebuild, then exercise the changed
behavior in a browser from a fresh test origin. When persistence changes, also
save, reload and import. Label anything not exercised as implemented-unverified
and add it to that wave's acceptance backlog. Do not claim a change works
based on the prebuilt bundle.

## Safety

Preserve upstream attribution and LICENSE. Keep user saves private and
untouched. Changes to persistence need a migration or an explicit
compatibility decision.

Use origin for the personal fork (public) and upstream for the original.
Inspect the working tree before editing and preserve unrelated changes.

## Sealed secrets

Weibao plays the game too, so world secrets are sealed by default
([details](docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md#sealed-secrets-standard-rule-2026-10-10)).
Agents read and write sealed files freely to design, implement and test
them. Do not show a secret's truth to Weibao in chat, reports, summaries,
indexes, commit messages or UI text outside its discovery route. Refer to
secrets by ID, route and status ("S2: Medicine route works"). Unseal only
when he asks for that secret or world. Public franchise twists are not
sealed; a changed or randomized truth is.

## Multi-agent work

For GM-role tasks, follow [the GM prompt](docs/GAME_MASTER_PROMPT.md)
and recover after a context restart from its refresh protocol and the task's
saved checkpoint. Check live files and running workers before resuming writes.
One writer per file area; hand off ownership explicitly. A context refresh
continues the authorized task and grants no new scope.

## Reporting

Report what changed, how it was checked and any remaining playable acceptance
gate. Setup alone is not implemented gameplay.
