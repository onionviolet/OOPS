# World pass rules

Weibao, 2026-10-23: after a facilities and person-to-person-roles pass on
Reincarnation Paradise, "consider reviews and basic rules to expand on the
expansion/exploration passes for the future ... save more strongly locally ...
consider making broad rules for other world audits/implementations as well?"

A world pass is one bounded round of work on one world: reading a source,
mapping a part (facilities, roles, economy, time), reviewing what came back, or
building a thin slice. This rulebook fixes how every such pass runs so a later
session, Claude or Codex, repeats it without the chat that started it.

It composes existing owners and adds only what none of them covers: pass shape,
the coverage checklist, review gates and durable saving.

| Owner | What it keeps | Used here as |
| --- | --- | --- |
| [World absorption rules](WORLD_ABSORPTION_RULES.md) WA1-WA21 | Source to pack to proof | The implementation half of a pass |
| [Source deep dive playbook](research/SOURCE_DEEP_DIVE_PLAYBOOK.md) | Reading once, evidence modes | The reading half of a pass |
| [Topic expansion audit playbook](audits/TOPIC_EXPANSION_AUDIT_PLAYBOOK.md), [world core kit playbook](worlds/WORLD_CORE_KIT_AUDIT_PLAYBOOK.md) | Rounds, lanes, triggers | Round and lane mechanics |
| [Agent usage rules](AGENT_USAGE_RULES.md) AU1-AU15 | Budgets, readers, model routing | Cost bounds |
| [Completion standard](WORLD_COMPLETION_STANDARD.md) | Sections S00-S14, levels C0-C5 | What "fuller" means |
| [Presence and interaction rules](PRESENCE_AND_INTERACTION_RULES.md) PIR1-PIR25 | Who is present, roles, stations | Person-to-person coverage |

Status: proposed 2026-10-23 from Weibao's request. Defaults for agents; a world
may propose an exception with a reason. Proposals and findings from a pass are
never accepted decisions, and a pass authorizes no build, selection of a world,
commit or push on its own.

## Rules (WPR)

### Shape of a pass

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| WPR1 | **Name the pass before starting.** Record world, part (a kit K code or coverage-checklist row), mode (reuse and check, bounded read, full read, implement, review), source edition, budget, output owner and stop condition in the owner doc's checkpoint. | A one-question check needs one line | Passes that wander, with no way to say what was covered |
| WPR2 | **Reuse before reading.** Read the world's brief, kit card, subtle-gaps entry and earlier passes first; read the source only for a named gap. | Reread a consequential claim at its locator | Paying twice for facts already saved |
| WPR3 | **One owner file per part per world, one writer per file.** New findings extend the owner, with a dated round. A pass that needs a new file says why and links it from the owner and the world card. | A large world splits by part, never by agent | Parallel, unlinked docs that contradict each other |
| WPR4 | **Evidence labels on every claim:** shown, stated, inferred, proposed, authored, generated, fan. Include a locator (chapter, scene, page, URL) for shown and stated. Flag machine-translation uncertainty on the claim. | Inferred claims may share a locator with their basis | Guesses read as canon (WA3, WA8) |
| WPR5 | **Defaults, dials and in-world reasons, never "never/always/only".** An engine fact from the source gets its default, the dial that varies it, the in-world reason and cost, and the exceptions the text itself shows. | None | Blanket claims that break the next world (AGENTS design framing) |
| WPR6 | **Route models by job.** Bounded readers, extraction and lookups run on haiku first in Claude sessions, unless Weibao specifies Codex limits, then Luna; synthesis, review and code on sonnet or the equivalent. A thin or contradicted shard reruns on the stronger tier and the report says so (AU5). | Escalate a named difficulty, not a whole book | Spending the budget on the wrong tier |
| WPR7 | **Stay inside the budget and report it.** Each pass reports invocations used, source words read, chapters or pages read (consecutive versus keyword search), and what remains unread. | A full-book request uses the AU13 source-sized plan | Claiming a whole-source read from a sample |
| WPR8 | **Sealed secrets stay sealed.** Agents read and write sealed truths to design; summaries, chat, indexes and commit messages give ID, route and status only (AGENTS sealed secrets, WA11). | Unseal only on Weibao's request for that secret or world | Spoiling the player-facing discovery |

### What a pass must cover

Every world has these dimensions. A pass names the rows it covered and lists the
rest as open gaps rather than silently skipping them. Rows are a palette, not a
quota: a world may have none of a row, and says so with its source locator.

| Code | Dimension | Prompts |
| --- | --- | --- |
| WPR9 | **Places and facilities** | What each place offers, costs and units, access, hours or clocks, who runs it, tiers and caps, loopholes, upkeep, what a mistake costs, how it differs from its neighbours, what changes with rank or start |
| WPR10 | **Person-to-person roles** | Team and party roles, mentors and students, service providers and staff, brokers and informants, patrons and clients, rivals and enemies, group or faction membership, debts and contracts, how people meet, what each owes, what each can offer or refuse, how a mistake changes the bond, how a newcomer is treated against a high-ranked one. Use PIR for presence and stations |
| WPR11 | **Institutions and law** | Who enforces what, penalties, bribery and exemptions, official versus unwritten rules, etiquette, what the world does when a rule is broken |
| WPR12 | **Money, goods and information** | Currencies and conversion, prices and who sets them, what is rationed, what is sold only by whom, rumors and how they spread, what can be known by whom (ECR, AD6-AD8) |
| WPR13 | **Time and rhythm** | Calendars, cooldowns, cycles, deadlines, away-time behaviour, what continues while the player is gone, season or event windows |
| WPR14 | **Power and growth subtleties** | Costs, limits, side effects, misuse, stacking, rank gates, failure modes, loopholes the text itself shows, what the power does to its holder |
| WPR15 | **Starts and entry** | First-day experience, arrival at each start (including starts that are not first arrival), what the start knows, what carries over (WA13-WA14) |
| WPR16 | **Failure, recovery and aftermath** | What losing, dying, defaulting or offending costs; how each is recovered; what the world remembers |
| WPR17 | **Surfaces** | What the player sees and when (UI lens, log, panels), what is hidden until discovered, what an idle player misses |

### Reviews

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| WPR18 | **Every lane return gets a review before it is folded.** A reviewer other than the author spot-checks at least five of the highest-consequence claims against their locators, checks the labels, confirms the output stays inside the owned file and budget, and lists contradictions with existing docs. | A single-fact pass needs one check; a long return needs more | Fabricated or mistranslated facts reaching canon |
| WPR19 | **Reviews check the source, not the summary.** A reviewer opens the locator. A claim without a locator is marked unverified, never accepted on the author's word. | Use haiku for the spot-check reading and sonnet for the judgment | Confirmation by repetition |
| WPR20 | **Contradictions are kept, not smoothed.** Both readings stay with sources, the pack's chosen reading, owner and status (unbiased lens, WA27). A newer source version supersedes by marking, not deletion. | None | Silent loss of a source disagreement |
| WPR21 | **Separate review states:** drafted, source-spot-checked, rules-reconciled, built, browser-verified, director-accepted. A report names the highest state reached and does not imply a later one. | None | Calling a draft "verified" |
| WPR22 | **Reconcile against live owners.** Name the AD, WA, PIR, ECR and other codes the findings touch, and mark any conflict with standing direction. Agent proposals never change a priority or turn deferred work into a gate (AGENTS). | A tiny pass cites only the codes it touches | Findings drifting from accepted direction |
| WPR23 | **Check stale labels.** "Ongoing", "complete", "no source found" and any freshness claim get a date and the route used; a "not found" records where it searched and where it could not. | None | Treating an unsearched route as empty |

### Expansion rounds

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| WPR24 | **End each pass with a more-to-consider round.** Each new angle is classed ACT NOW (done in the owner), ACCOUNT FOR NOW (a constraint on current work) or LATER/DELEGATE (level, effort, done check). Suggestions go in a short separate list, never as a reason to stop. | A repeated "more to consider" on the same idea expands it again with a genuinely new angle | Passes that stop at the first answer |
| WPR25 | **Rank next worlds and parts by readiness, not enthusiasm.** The report names which world or part should get the same pass next, with a suggested budget, based on the kit card gaps and source availability. | Weibao's ordering overrides (canon-first order in PROJECT.md) | One world getting depth while a base layer stays empty |
| WPR26 | **Fold lessons into the playbook.** A method that worked or a mistake that repeated is added to the relevant playbook or to this file, not left in one report. | None | Relearning the same lesson per session |

### Saving durably

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| WPR27 | **Save in the repo first.** A finding lives in the owner doc under `docs/`; deep source detail lives in the gitignored private store; memory holds only a pointer to the repo owner. Never only in a memory file or a chat. | A personal preference may live in memory and the vault template | Findings lost when a session ends |
| WPR28 | **Register what you add.** A new rulebook updates the RULES_INDEX register and router; a new world doc is linked from the world's brief or kit card; new research is linked from its research index. | None | Orphan files nobody finds |
| WPR29 | **Commit narrowly and only when authorized.** Stage only this pass's paths, follow the shared-worktree practice, and hold pushes for Weibao's yes. | Whole new files may be listed; shared docs get hunks only | Overwriting other sessions' edits |

### Implementation passes

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| WPR30 | **Build the thinnest complete loop, then layer.** A slice covers one signature loop with its items, people and clock, proven by journey before the next layer. Layers follow the coverage rows. | A world may need two loops for its signature mechanic | Many shallow details with no playable loop |
| WPR31 | **Mechanism over item list.** A recurring detail becomes a shared mechanism (a gate, a clock, a role, a cost) with data rows per world (WA1, WA5, AD38). | A truly unique mechanic gets a local module the pack names | A hundred one-off scripts |
| WPR32 | **Prove every layer by play.** Rebuild, play the changed behavior from a fresh origin in a browser at the accepted viewport, and when persistence changes, save, reload and import. Label anything else implemented-unverified (AGENTS verification, WA19). | Reuse unchanged passing evidence | "Done" without a played journey |

## How to run a pass (checklist)

1. Open the rules index router; name the pass (WPR1) and cite codes.
2. Read the world's owner docs (WPR2); set the budget (WPR7).
3. Read or map the part with labeled, located claims (WPR4, WPR5, WPR9-WPR17).
4. Review the return (WPR18-WPR23), keep contradictions (WPR20).
5. Close with the more-to-consider round and the ranked next passes (WPR24-WPR25).
6. Save to the owner, register new docs and fold lessons (WPR26-WPR28).
7. Commit only if authorized, narrowly (WPR29).

## Lessons carried in

Add here, dated, after each pass.

- 2026-10-23: three parallel research lanes (forum quests, Twine/ink/VN, CYOA)
  each caught 30-50% snippet-only rows and a few unreachable sites. The reports
  were most useful when each row said opened or snippet and each gap named the
  route that failed. That is WPR4 and WPR23.
- 2026-10-23: the Reincarnation Paradise facilities pass showed that keyword
  hits for "facility" mostly named institutions of derived worlds, not hub
  facilities, so a census must separate hub from derived-world places before
  windows are chosen (WPR9). A model-routing instruction sent mid-run arrived
  after the helpers had returned, so set the reader tier in the first brief
  (WPR6). A "touch no other file" limit left the new doc unlinked from the
  brief and kit card; plan the link as a named follow-up (WPR3, WPR28). The
  LOCAL_LIBRARY path for the EPUB was stale; confirm the path first (WPR2).
- 2026-10-23: round 2 (six haiku readers, about 62k words) found that a hub
  "gap" can be an honest absence: a regex across the whole book found no hub
  mission board, gene service or cursed-item registrar, so record "not found,
  searched where" (WPR23) instead of padding the table. Keyword excerpts are
  not reading; the manifest must label each window consecutive, excerpts or
  mixed (WPR7). The user's correction that derived-world institutions count
  also shows a census must ask where a place sits before dropping it (WPR9).
- 2026-10-23: four parallel passes (LOTM, Reverend Insanity, ORV, Paradise
  round 3) showed that a Haiku reader can misread a price or fee line: open
  every price, fee and rate locator before it enters a pack (WPR19). A keyword
  census finds where terms are dense, not where existing notes are weak, so
  pick windows from the owner docs' gaps first (WPR2). Declare the word unit
  for Chinese sources (one character per word). Check name spellings before
  logging a zero hit: LOTM's sea region is spelled differently from the
  assumed name, so a zero-hit search was a spelling miss (WPR23). Never put an
  unsourced "earlier notes say" claim in a reader brief. Reader returns kept
  in the scratchpad must move to the gitignored private store.
- 2026-10-23: the MoL, HP, Shadow Slave and Circle of Inevitability passes added
  these. An honest absence is a result: MoL names no currency, so record "none
  in this edition" and mark any repo price authored. A thin price check proves
  little when the windows hold almost no prices; widen a price census over the
  whole book first. Locator schemes differ between a dossier and a fresh
  extraction, so cite which scheme a locator uses. A regex on a phrase
  ("house points") under-counts; census the concept's variants. Chapter
  detection can fail on a book (two HP books returned zero chapters); test it
  before building windows. A reader can invent a conflict from two true lines
  (five versus three Transcendents); open both locators before logging it.
  Sequel text changes names and institutions, so do not reuse the first
  novel's pass unedited. Check that a window contains the focus term before
  briefing a reader.
