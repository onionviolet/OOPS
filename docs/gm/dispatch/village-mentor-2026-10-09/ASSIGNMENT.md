# Village wave 3: the Mentor teaches, 2026-10-09

Dispatched 2026-10-09 by Claude Code at Weibao's request ("check on the lanes
and continue accordingly"), after [village study](../village-study-2026-10-09/REPORT.md)
reached a playable checkpoint. One writer. Follow AGENTS.md and
docs/GAME_MASTER_PROMPT.md. Preserve all unrelated dirty work; check for live
writers first. No commits or pushes. Private saves untouched.

## Why

Mentor is currently the top rank with nothing to do. Three research lanes
point at the same next step: a breakthrough earns a new operation and a new
responsibility ([novel P2](../../../research/novels/novel-wave-2026-10-09/COMPARISON.md)),
later life opens teaching ([open idle P5](../../../research/open-idle-games-2026-10-09/PROPOSALS.md)),
and remembered preparation shapes outcomes (Sucker for Love and Kill the Lich
in [the Steam audits](../steam-installs-2026-10-09/REPORT.md)).

## Slice (original proposal)

In Village, after reaching Mentor in the existing career:

1. One junior recruit (a new named NPC, or an existing native NPC if one
   fits) is assigned to you.
2. You can teach them Watchcraft (the existing study method) by bringing
   them on a patrol and spending a short teaching action. The recruit has
   their own known/practiced state, reusing the study model.
3. The recruit's progress changes something concrete: a solo patrol they
   take earns the career a small payment or reputation with Tessa, and they
   remember who taught them.
4. Teaching costs you something real (time, a shared round's pay, or a
   missed round), shown before you choose.
5. One life-record entry when the recruit first patrols on their own.

Keep it small: one recruit, one method, one location. Reuse village_career,
the study fields, npc_lives and life_record; do not add a ticking loop per
NPC, a party system, new world or prestige. Save schema bumps need an
additive migration from schema 2 with old-save tests.

## Verification gate

`npm test`, `npm run build`, fresh browser origin journey (reach Mentor via
generated save is fine, then teach, recruit solo patrol, payment, memory,
bio entry), save/reload/import, and a schema-2 save loads. Anything not
exercised goes in ACCEPTANCE_BACKLOG.md.

## Output

CHECKPOINT.md (as you go), short plain REPORT.md (what to click, checks,
what remains), PROJECT.md entry marked proposal.
