# Agent instructions

Read the PROJECT.md summary and the relevant source before changing this
project.

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
commit raw prose. Keep `docs/research/novels/` out of git.

Finish one playable slice before starting the next. A wave ends
at a checkpoint where Weibao can play it, not when a context or batch boundary
is reached.

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

## Multi-agent work

For GM-role tasks, follow [the GM prompt](docs/GAME_MASTER_PROMPT.md)
and recover after a context restart from its refresh protocol and the task's
saved checkpoint. Check live files and running workers before resuming writes.
One writer per file area; hand off ownership explicitly. A context refresh
continues the authorized task and grants no new scope.

## Reporting

Report what changed, how it was checked and any remaining playable acceptance
gate. Setup alone is not implemented gameplay.
