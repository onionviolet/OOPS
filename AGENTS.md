# Agent instructions

Read [GROUND_RULES](docs/GROUND_RULES.md) (one page, 2026-10-26), then the
PROJECT.md summary and the relevant source before changing this project.

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
router names the rule codes that apply to the task, and AD1–AD44 restate the
accepted direction for aspects without their own rulebook. Cite codes in task
records and handoffs. The rulebooks below keep their own detail. Keep the index
current in the same change: a new or changed rulebook updates its register and
router rows, and a new or changed accepted decision updates its AD line. Lane
briefs and task packets name the codes they apply. Shared guidance lives here and
in the repo docs, not in one agent's private memory.

Player-facing UI: follow `.claude/rules/player-ui.md` and [UI rules](docs/UI_RULES.md) (UR1–UR69). Lane briefs that touch UI link that file.

Making systems: follow `.claude/rules/making-systems.md` and [making rules](docs/MAKING_RULES.md) MR1-MR36.

Runtime code: follow `.claude/rules/runtime-code.md` and [architecture rules](docs/ARCHITECTURE_RULES.md) AR1-AR16. Runtime lane briefs name their seam and link that file.

World audits, expansion and exploration passes, source dives and reviews: follow [world pass rules](docs/WORLD_PASS_RULES.md) WPR1-WPR32. Lane briefs for such passes name the WPR codes they apply.

Sites, ruins, maps and exploration: follow `.claude/rules/sites-exploration.md` and [site/exploration rules](docs/SITE_AND_EXPLORATION_RULES.md) SR1-SR24.

World entry, starts, crossings between worlds and transmigration: follow [world entry rules](docs/WORLD_ENTRY_RULES.md) WER1-WER17. Every world pass settles each start's WER answers or names the gap.

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
- **Things work by how they work** (AD38, 2026-10-17). If a method, potion,
  tool or plan reasonably works by the mechanisms in play, it works, whatever
  its label or category; nothing needs a permission list to happen. Model
  mechanisms, not allowed-outcome lists, and let costs and the world's real
  mechanisms decide what "reasonably" means.
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

The one-realm/one-prestige first milestone is no longer a required gate
(2026-10-24, [direction](docs/USER_VISION.md#first-milestone-and-scope-check-2026-10-24)). Preserve
the broader vision in PROJECT.md: deeper existing systems, several progression
paths and mechanically distinct worlds.

Research and source rules (original worlds and book references, source-reading standing tasks, source acquisition tools, agent usage budget AU1-AU15): `.claude/rules/research-and-agents.md`. Read it before collecting books, running research passes, or spawning bulk readers; also see [agent usage rules](docs/AGENT_USAGE_RULES.md) and [source acquisition tools](docs/research/SOURCE_ACQUISITION_TOOLS.md).

Finish one playable slice before starting the next. A wave ends
at a checkpoint where Weibao can play it, not when a context or batch boundary
is reached.

## Verification

Runtime completion and pre-commit commands are `npm run build`, `npm test`,
`npm run check:arch` and `npm run check:rules`, at the stages assigned by AD36
below. `check:rule-behavior` is an optional focused route into existing tests,
not an additional universal gate. Docs-only changes use relevant document/link
checks; changes to the rules index or registered codes run `check:rules`.

Follow [AD36: efficient rule verification](docs/RULES_INDEX.md#efficient-rule-verification-ad36).
A runtime slice is done only at [the six-line floor](docs/RULES_INDEX.md#definition-of-done-the-floor-ad43) (AD43, 2026-10-26); otherwise record it as "implemented, below floor".
Lean tests (2026-10-22): lanes and subagents run only their focused test file; the
committer runs the full `npm test` once as the pre-commit gate. Organize tests by
system, not delivery wave, and delete or merge tests that only pinned a reworked
shape. Task records get one line per check (command, result, gaps).
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

## Source acquisition tools

Before searching for or acquiring any book, check the [library index](docs/research/LIBRARY_INDEX.md)
(prime books, the five TTKS titles, Calibre IDs, what is missing) and the
[Calibre](docs/research/CALIBRE_CATALOGUE.md) and
[Source Library](docs/research/SOURCE_LIBRARY_CATALOGUE.md) catalogues (regenerate: `python3 -I scripts/library_catalogue.py`). Name TTKS books by title, never "TTKS" alone.

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

## Game MCP

The `yairpg-game` MCP (registry `game-mcp`, registered in `.mcp.json` and `.codex/config.toml`) plays the headless game.
When a limit blocks or slows you, call its `game_report_limit` once and keep going. Before extending the server, read
[the limits doc](docs/tools/GAME_MCP_LIMITS.md) and its ledger; repeated or work-stalling entries become tools there.

## Multi-agent work

Default future work to the primary checkout at
`/Users/weiwei/code/yet-another-idle-rpg` (AD41). A new chat or agent does not
itself require a worktree. Reuse an existing checkout when isolation is needed
for overlapping writers, clean verification/integration, or a user request;
record ownership and retire finished lanes through the
[primary-checkout procedure](docs/gm/SHARED_WORKTREE_PRACTICE.md#primary-checkout-default-2026-10-21).

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
gate. Under AD42 a human gate is optional review, not a blocker; say
"agent-verified, not human-reviewed" instead. Setup alone is not implemented
gameplay.


<!-- BEGIN PORTABLE AGENT RULES v1 -->
<!-- PORTABLE AGENT RULES MODE: global -->
## Working agreement source

The portable agreement is owned by the planning vault's
`_templates/portable_agent_rules.md`. `~/.claude/scripts/sync_user_prefs.py`
generates `~/.claude/user-preferences.md` and `~/.codex/AGENTS.md`.
Claude loads the former through `~/.claude/CLAUDE.md`; Codex loads the latter
as global instructions. Apply that already-loaded agreement without rereading it.
If your host did not load global preferences, read the corresponding generated
file once. If neither exists, read the canonical vault template before working.

This managed pointer is generated by the vault's
`.claude/scripts/sync_agent_rules.py`; edit its template, not repository copies.
Text outside the BEGIN/END markers belongs to this project.
<!-- END PORTABLE AGENT RULES v1 -->
