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

Start every task at the [rules index](docs/RULES_INDEX.md) (2026-10-16): its
router names the rule codes that apply to the task, and AD1–AD36 restate the
accepted direction for aspects without their own rulebook. Cite codes in task
records and handoffs. The rulebooks below keep their own detail. Keep the index
current in the same change: a new or changed rulebook updates its register and
router rows, and a new or changed accepted decision updates its AD line. Lane
briefs and task packets name the codes they apply. Shared guidance lives here and
in the repo docs, not in one agent's private memory.

Player-facing UI also follows [UI rules](docs/UI_RULES.md) (2026-10-15): declare
a surface type and home, use shared tokens and components, own your node, open
center views through the shared controller with a bottom back bar and Esc, keep
the log column intact, give features in-world logic, and check discoverability
on a populated save at the 1920×1080 primary target and the 1366×768 floor
(viewport targets in UI_RULES, 2026-10-17). Choose the appropriate panel/navigation scope;
not every view opens in the lower center. Follow UR41–UR48 for disclosure,
hover/pinned inspection, clean logs/hierarchy and faithful reference evidence.
Lane briefs that touch UI link that file.

Making systems (potions, cooking, smithing, runes, enchanting, formations,
constructs and other crafts) follow [making rules](docs/MAKING_RULES.md)
MR1–MR36 (2026-10-15): truth stays separate from knowledge and chance, free
experimentation works in every world with formulas as attractors, world styles
are data with canon-status labels, depth is chosen per activity, mastery improves
control rather than truth, and one shared envelope sits over separate product
logics.

Runtime code follows [architecture rules](docs/ARCHITECTURE_RULES.md) AR1–AR16
(2026-10-16): `main.js` is a composition root, so a feature adds at most one
registration line there and lands through the domain registry; one authority
per fact; no new import cycles or imports of `main.js`; namespaced save slices
with migrations; structural moves separate from behavior changes; integration
means a player journey crosses the module. Runtime lane briefs name their seam
and link that file.

Sites, ruins, natural places, maps and exploration follow
[site/exploration rules](docs/SITE_AND_EXPLORATION_RULES.md) SR1–SR24
(2026-10-16): world-qualified identity, claims separate from truth, scoped
discovery, useful readers, actual means/access, conserved custody and persistent
aftermath. A map is an information artifact, not automatic truth, permission or
ownership. Apply relevant rules to a selected slice; do not turn adjacent proposals
into prerequisites. NPC-heavy systems and procedural layouts retain their current
deferrals. Domain mechanics and new implementation still require their own scope.

## Role

Weibao is the creative director. Implement authorized ideas directly and show
playable results. Do not impose a coached coding workflow unless he asks to
learn the implementation.

Make reasonable reversible prototype choices, label them as proposals and show
the playable result. Record accepted decisions in PROJECT.md.

## Design framing

- **Everything is possible, reasonably** ([Rulebook 1](docs/RULES_FROM_SCRATCH.md#the-rulebook-accepted-2026-10-10), AD5).
  Do not ask Weibao to pick between reasonable design options; his answer has
  consistently been "both, depending on the world". Propose the default and the
  conditions yourself, and ask only about build order, first-slice defaults,
  save compatibility, effort or anything irreversible. No either/or open
  questions in docs or replies.
- **Write constraints as default, dial and reason** (the in-world reason and
  cost), not never/always/only. No design line holds for every world. A world's
  stated absolutes, canon ones included, describe the ordinary case; exceptions
  can exist with an in-world reason and cost (2026-10-17). Balance is not forced; pushback
  needs an in-world agent with a reason. Sweep new docs for blanket claims before
  reporting. Do not call agent proposals "accepted"
  ([audit of 24 such slips](docs/DESIGN_DEFAULTS_AUDIT.md)).
- **Idea docs are palettes, not specs.** Tiers and tables are illustrative; pick
  what fits a given world and character at a given time.
- **Limits are adjectives** (how often, how much, how sure), set per world, never
  a fixed "once". Weibao is essentially the only player: no anti-cheat or exploit
  hardening beyond save integrity (AD22, [limits](docs/ABUSE_AND_LIMITS.md#limits-are-adjectives)).
- **Many worlds are Weibao's own direction.** Raise sequencing as a practical
  risk, never as scope drift by earlier agents.
- **Repeated "more to consider" on one idea means expand it.** Each round finds
  a genuinely new angle and saves it in the owner; suggestions go in a separate
  short list, never as a reason to stop. Run the `more-to-consider` skill (Claude
  and Codex both have it) and save each round in the owning palette as ACT NOW
  (done), ACCOUNT FOR NOW and LATER/DELEGATE (with level, effort and done check).
  Full topic rounds with lanes use `topic-expansion-audit`; repeatable audits such
  as the [world core kit](docs/audits/WORLD_CORE_KIT_CORE_AUDIT.md) extend their
  root doc with a new round and never restart codes.

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

Follow [AD36: efficient rule verification](docs/RULES_INDEX.md#efficient-rule-verification-ad36).
Before implementation, choose relevant existing checks and a failure scenario
from the touched rules and consumers. Add or extend a regression for changed
behavior or a reproduced defect when it protects a meaningful invariant; avoid
duplicate assertions and tests of incidental implementation details. Run focused
checks while editing, then the existing required completion gates. Reuse passing
evidence only for unchanged relevant inputs; a full suite already covers its
focused subsets. Record commands, input identity, results and gaps in the existing
task record. Load bounded sources and summarize successful output; investigate
failures before retrying. This applies to lane briefs and handoffs too.

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

## Agent usage budget

Before generating agents or bulk book readers, follow [agent usage rules](docs/AGENT_USAGE_RULES.md)
AU1–AU15 / AD37. One coordinator, one shared budget including retries and successors;
readers may spawn lesser agents from reserved portions of that same budget.
For full-book requests, declare one finite whole-source plan (AU13), target one
to three coordinating chats, and use fresh Luna-medium reader contexts when
available. Each reader owns at most 12,000 source words and six model responses,
then retires; never feed it the next shard. Keep raw chapters out of coordinator
history and use bounded continuity notes (AU15). Two generated agents run at once
by default. The old four-reader cap applies to exploratory tasks, not full books.
Budget and allowance ceilings still apply; no silent paid or stronger-model fallback.

## Multi-agent work

For GM-role tasks, follow [the GM prompt](docs/GAME_MASTER_PROMPT.md)
and recover after a context restart from its refresh protocol and the task's
saved checkpoint. Check live files and running workers before resuming writes.
One writer per file area; hand off ownership explicitly. A context refresh
continues the authorized task and grants no new scope.

Several Claude and Codex sessions share this checkout and branch. Follow
[shared worktree practice](docs/gm/SHARED_WORKTREE_PRACTICE.md):

- Edit shared docs (USER_VISION, PROJECT, IDEA_INDEX) from disk, hunk only, and
  run its zero-loss check before committing.
- Commit only your own paths from a fresh HEAD with a guarded branch update;
  never stash, reset or force. Push waits for Weibao's yes. No `Co-Authored-By`
  trailer.
- Merge finished, gate-passing lanes before dispatching a new wave, and check
  for same-day owner docs on the same topic.
- Detach long Codex runs in their own process group, record session IDs and
  PIDs, and stop processes by PID, group or port, never `pkill -f`.

## Reporting

Report what changed, how it was checked and any remaining playable acceptance
gate. Setup alone is not implemented gameplay.
