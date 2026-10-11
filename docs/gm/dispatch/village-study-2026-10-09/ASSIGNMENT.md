# Village wave 2: acceptance repair, then practical study, 2026-10-09

Dispatched 2026-10-09 by Claude Code at Weibao's request ("start next parts
accordingly"), after the [village career slice](../village-career-2026-10-09/REPORT.md)
reached a playable checkpoint. One writer, two parts, in order. Follow
AGENTS.md and docs/GAME_MASTER_PROMPT.md. Preserve all unrelated dirty work;
check for other live writers first (the Steam installs lane is research-only
and does not touch src). No commits or pushes. Private saves untouched.

## Part 1: acceptance repair (finish before Part 2)

From [the career backlog](../village-career-2026-10-09/ACCEPTANCE_BACKLOG.md):

- **R1.** Diagnose and fix the three pre-existing schema-migration test
  failures (`chronicle.test.js:24`, `expansion_engine.test.js:173`,
  `simulation.test.js:75`). Decide per failure whether the test or the code
  is stale; persistence changes need a migration or an explicit
  compatibility note. Target: full `npm test` green.
- **R2.** Exercise in a fresh browser origin: Mentor promotion (five rounds,
  five returns), paying kit debt instead of returning, refusal when short of
  50 coins, and storage-quota rejection. Fix defects found.

## Part 2: practical study slice (original proposal)

Converged proposal from [novel P5](../../../research/novels/novel-wave-2026-10-09/COMPARISON.md),
[library LG-P1](../../../research/library-games-2026-10-09/REPORT.md) and
[open idle P3](../../../research/open-idle-games-2026-10-09/PROPOSALS.md):
study gives knowledge, practice makes it usable, and a tool makes a
visible difference in ordinary work.

In Village, from the vanilla opening plus the career:

1. A mentor (Tessa once you are Dependable, or a native NPC; pick what fits
   the existing fiction) offers or points to one manual or method, such as
   lantern-and-baton watchcraft or a better field/gathering technique.
2. Reading it gives **known** state; practicing it in one safe native
   activity makes it **practiced**; only then does it change a real task
   (a shift outcome, a gather yield or a craft) when the needed tool is held.
3. The difference is shown in the center menu before and after; one life
   record entry marks first successful use.

Keep known, practiced and executable visibly separate. Reuse native books,
skills, activities and the life record before adding new owners. Audit
existing home-study and Proto23 workshop content first and do not duplicate
it. One method, one tool, one location. No new world, prestige or XP track.

## Verification gate (each part)

`npm test`, `npm run build`, then a fresh browser origin journey, then save,
reload and import. Old saves load. Anything not exercised is
implemented-unverified in this folder's ACCEPTANCE_BACKLOG.md.

## Output

CHECKPOINT.md (update as you go), REPORT.md (short, plain: what to click,
what was checked, what remains), PROJECT.md entries marked proposal.
