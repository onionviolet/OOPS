# Topic expansion audit playbook

Saved 2026-10-14. The repeatable method behind Weibao's recurring request
shape: "more to consider? other stuff and more? save and extend accordingly,
send out codex as useful", with follow-up axes such as subtle and micro
details, cheats that would show it, overarching principles, implementation
implications, abstraction, crafting, research, comic and other world types,
and merging. First full instance: [companions core audit](COMPANIONS_CORE_AUDIT.md).
Other topics run the same way (UI at scale, weaponcraft and runes, world core
kit, procedural story); each can get its own `<TOPIC>_CORE_AUDIT.md` here.

Related methods: [source deep dive](../research/SOURCE_DEEP_DIVE_PLAYBOOK.md)
for one book or wiki; this playbook is for one design topic across all worlds.

## Shape of a run

1. **Root palette.** One `docs/<TOPIC>_CONSIDERATIONS_<date>.md` owned by the
   root agent. Rounds are appended, never rewritten; each round gets fresh
   section codes. Add a topic map once it passes about six rounds.
2. **Find owners first.** Search `docs/` for the topic before writing. Link
   sibling owners; do not restate them. If a lane later finds an owner you
   missed, say so plainly in the palette.
3. **Lanes.** Each Codex lane gets `COMMON.md` (rules) plus its own prompt,
   exactly two owned output files (output and report), a CHECKPOINT at the
   top, and evidence labels SHOWN / STATED / INFERRED / MEMORY. Launch
   detached with `runs/launch.py` (setsid double fork) and log session ids.
4. **Lane menu.** Pick what fits; these worked for companions:
   by-world source check; engine fit (code seams, cheapest steps);
   references (games and books); journeys plus stress test; procgen; owner
   map; craft study in books; idle and prestige; real-world grounding (e.g.
   ethology); presentation and line budget; per-world defaults for tensions;
   reveal cheats; implementation implications; comics; crafting and
   research; overarching abstraction.
5. **Rounds while lanes run.** Each round answers the axes Weibao asked, with
   new angles only. Fold lane returns as they land, corrections first.
6. **Record** every round in USER_VISION and keep one IDEA_INDEX entry.
7. **Commit when authorized** with [commit_own_paragraphs.py](tools/commit_own_paragraphs.py)
   so only this run's files and paragraphs land while other sessions edit
   the same shared docs. Push and merge only on explicit yes.
8. **Save the audit** as `<TOPIC>_CORE_AUDIT.md` with triggers, lane table and
   a run log, so the next run starts from it.

## Standing rules every round

Default + Dial + Reasonably; no absolutes; no either/or questions to Weibao;
no fixed "once" limits; sealed secrets by ID only; desktop first, mobile
deferred; proposals are not accepted decisions; no em dashes.

## Lessons from the first run

- Lanes find existing owners and existing code the root missed (Rill, the
  nonhuman bonds doc). Run an owner-map lane early.
- MEMORY world rows need a source lane; about a quarter needed correction.
- A stress-test lane (journeys) finds contradictions the palette hides.
- zsh does not word-split `$VAR` file lists; build file lists in Python.
- Other sessions append to USER_VISION and IDEA_INDEX constantly; never
  `git add` those whole files for a topic commit.

## Core-rule reconciliation pass, 2026-10-18

Weibao requested auditing the plans and other audits against core rules. Apply
this inside the affected audit's next round, not as a required whole-project
review for every small edit (AD36).

1. **Classify the owner.** Read current RULES_INDEX and later user decisions.
   Separate live brief, palette, evidence checkpoint and historical snapshot.
   Record section-reviewed versus indexed-only coverage; recency alone is not
   authority. A report does not override its brief or the user's later direction.
2. **Reconcile the selected contract.** Name relevant codes, producer, truth/
   transaction owner, projection and useful consumer. Keep source unknowns,
   player unknowns, unbuilt coverage and local impossibility separate (AD38).
   Follow current compatibility and viewport decisions rather than stale gates.
3. **Compose one affected scenario.** Use relevant G26–G30: safety/knowledge,
   clock/credit settlement, interrupted work, queued outcomes or capability
   coverage. Existing owners and passing unchanged evidence come first. Do not
   require every scenario or every world before a slice can ship.
4. **Fold and record.** Correct the live owner, preserve superseded history and
   link the result from the audit entry. Separate ACT NOW corrections, ACCOUNT
   FOR NOW constraints and LATER proposals with level, effort and done checks.
   A proposal update is not acceptance of a new mechanic or implementation.

Lanes are optional when this controlling chat can finish the pass. Dispatch,
commit, merge and push steps elsewhere in this playbook still require applicable
current authorization; they are not automatic consequences of an audit request.
Respect AU1–AU15 and current one-writer reservations. Do not reset the shared
index or overwrite another session's staged hunks to commit audit paragraphs.
Source receipts and private/secret fixtures stay in their existing safe owners.

Method evidence: [plan/rule reconciliation](../reviews/PLAN_RULE_RECONCILIATION_2026-10-18.md).

**Commit-tool caveat (source-inspected in this pass):**
`tools/commit_own_paragraphs.py` currently describes and performs a real-index
reset after its guarded temporary-index commit. Its filename is not proof that
unrelated staged hunks survive. Before any separately authorized use, inspect the
exact affected paths/index and use a route that preserves other staged work;
do not execute that reset as part of an audit. This pass changed no Git index.

## Group superseded control records before rereading, 2026-10-18

Weibao requested grouping superseded plans so unchanged history is not audited
again each round. Start the next pass with
`python3 docs/audits/tools/plan_review_status.py --check` and the
[supersession ledger](../reviews/plan-rule-reconciliation-2026-10-18/SUPERSESSION_GROUPS.md).
Current/reusable contracts and actual live reservations take priority over old
launch/checkpoint instructions. Group membership is explicit and hash-bound.

A grouped archived or folded checkpoint loses its role as an alternate active
execution plan; it does not lose its source findings, unique proposals, failures,
partial coverage or unfinished acceptance. Keep semantic review coverage separate
from routing/skip state. SPEC/TEST_PLAN/MIGRATION artifacts are not automatically
retired because their research lane ended. New sibling files are not grouped by
prefix alone. An unresolved successor is a mapping gap, not verified clearance.

Reopen a changed member or a selected unmet clause. If an owner or its
relationship-evidence receipt changes, inspect the relationship first rather
than rerunning every child. Changes in user
direction/selected consumer can invalidate reuse even when file bytes match.
The helper is read-only and grants no execution, publication or acceptance.
This method replaces repeated per-checkpoint scanning with a current-owner
check; it adds no required whole-project audit before ordinary slice work.
