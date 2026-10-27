# Village loop and backlog dispatch, common packet (2026-10-27)

Requested by Weibao (verbatim intent): establish a gameplay loop first for the Village (the YAIR Village, then a Proto23-style village); send coordinators to implement small backlog items and loose audit / more-to-consider rows that can be worked now; start a GM chat that plans gameplay loops and self-audits across USER_VISION (a Sonnet look, then the advisor on lore and gameplay) so the game keeps its own identity while heading to a whole playable world with endless possibilities; make procedural and other banked ideas usable; look at the saved Discord discourse.

## Sessions and ownership (one writer per path)

| Session | Owns (writes) | Does not touch |
| --- | --- | --- |
| `village-gm` | Docs only: `docs/gm/dispatch/village-loop-2026-10-27/GM_PLAN.md` and its own audit files. Proposes hunks for PROJECT.md, USER_VISION.md, RULES_INDEX.md; does not edit them. | Runtime, tests |
| `village-loop` | Village runtime for the loop slices (start from `src/absorb_c2/local_life.js` and the Village career/mentor owners it finds), their focused tests, `docs/gm/dispatch/village-loop-2026-10-27/VILLAGE_LOOP_CHECKPOINT.md` | UI-primitive files owned by `backlog-ui`; `main.js` registration beyond one line per feature (AR rules) |
| `backlog-ui` | Small ready UI rows: UIV1 visible blocked reasons first, then Q18 P02-P10 in order, as far as each is dependency-ready; `docs/gm/dispatch/village-loop-2026-10-27/BACKLOG_UI_CHECKPOINT.md` | Village loop logic |

Check live ownership before each write. If two sessions need one file, the later one waits or hands the hunk to the owner in its checkpoint.

## Standing direction to apply (reconciled 2026-10-27)

- Weibao's later request makes the Village loop the first loop to establish. The 2026-10-26 "Frontier and Mistglass get no new depth of their own" line still holds for everything except this loop: the Village is the home base the travel loop (master plan round 5, TL4) returns to, and the test bed for shared mechanisms. Record this reading in the checkpoint; do not widen it to new Frontier content.
- "Proto23 village" means an original village drawing on Proto23's mechanics and feel, credited as inspiration (PW2, PW4, PW5); Proto23-derived content already inside the Village stays. Proto23 has no licence file: copy no code, assets or prose (PW3).
- Read first: `docs/GROUND_RULES.md`, `docs/RULES_INDEX.md` router, master plan rounds 3-6 (`docs/MASTER_PLAYABILITY_PLAN_2026-10-25.md`), `docs/PROTO23_VILLAGE_LIFE_LOOPS_2026-10-14.md`, `docs/reviews/ENGINE_AND_IDENTITY_THREAD_2026-10-16.md` (the core-loop scoping pass was requested 2026-10-16; continue it, do not restart), `docs/audits/IDEAS_TRIAGE_2026-10-26.md`, `docs/WORLD_COMPLETION_STANDARD.md`.
- A loop is: live, earn, carry, apply, react, return (TL1). Every slice names its outcome, consumer, cost, world mechanism and done check (IB3). Limits are adjectives, not fixed lines. Constraints are default, dial and reason (AD38).
- UI work: desktop first, evidence at 1920x1080 and 1536x864 at 14 and 21 px; mobile deferred. Prose follows round 4 PR1-PR5 (discovery wording, no undiscovered names).
- Verification: AD36 and AD43. Focused tests while editing; the committer runs `npm run build`, `npm test`, `npm run check:arch`, `npm run check:rules` once. Rebuilt fresh-origin browser journey for gameplay claims; Save/reload/Import when state changes. Say "agent-verified, not human-reviewed". A slice below the six-line floor is recorded "implemented, below floor".
- Sealed secrets stay sealed: refer by ID and route. Agent audits and proposals cannot change Weibao's priorities (AGENTS.md gates).
- Git: commit only your own paths from a fresh HEAD; never stash, reset, force or push; no Co-Authored-By trailer. Detached long runs get their own process group; stop by PID, never `pkill -f`. No normal-app adoption.
- Saved Discord research is read-only input (`docs/audits/DISCORD_RESEARCH_AND_UI_STATUS_2026-10-21.md`, `docs/research/yair-upstream/DISCORD_RESEARCH_2026-10-20.md`). New collection needs Weibao's yes and the polite tools.
- Report: what changed, how it was checked (one line per check), gaps, and any decision waiting. Link owners; do not copy competing specs.
