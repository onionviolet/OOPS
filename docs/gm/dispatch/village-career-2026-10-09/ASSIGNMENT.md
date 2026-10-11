# Village career slice (P1), 2026-10-09

Dispatched 2026-10-09 by Claude Code at Weibao's request ("send new stuff
accordingly"), after three research lanes converged on the same first proof:
[novel wave P1](../../../research/novels/novel-wave-2026-10-09/COMPARISON.md)
(local, gitignored), [open idle games P1](../../../research/open-idle-games-2026-10-09/PROPOSALS.md)
and [library games LG-P1](../../../research/library-games-2026-10-09/REPORT.md).
The design is an original proposal; label it so in PROJECT.md until Weibao
accepts it after playing.

## Goal

From the vanilla opening, one ordinary Village job becomes a career that
leaves a mark on a life:

1. Accept a guard or courier shift (extend native patrolling or a native job,
   not a new window; center menu stays main).
2. Take a loaned kit; it must be returned or it becomes a recorded debt.
3. Get paid at the end; see the next promotion's exact unmet requirement
   (apprentice, dependable worker, mentor).
4. One named colleague remembers how the last shift went and says so.
5. A promotion writes one biography/life-record entry.

Keep it small: one location, one colleague, three ranks. No new realm,
prestige, world travel or separate career XP.

## Rules

- Follow AGENTS.md and docs/GAME_MASTER_PROMPT.md. Read PROJECT.md and the
  relevant src owners first (`src/activities.js`, `src/data/locations.js`,
  `src/life_record.js`, `src/npc_lives.js`, `src/save_files.js`).
- The working tree is dirty with earlier Codex waves. Preserve every
  unrelated change. Check for other live writers before editing a file.
- Persistence: new save fields need a migration or explicit compatibility
  note; old saves must load. Never touch private saves in `~/Downloads/Games/`.
- No commits or pushes.

## Verification gate

`npm test`, `npm run build`, then a fresh browser origin: play the shift,
return kit, get paid, hear the colleague, earn one promotion; save, reload,
import an export. Anything not exercised is implemented-unverified and goes
in this folder's ACCEPTANCE_BACKLOG.md.

## Output

CHECKPOINT.md (resume state), REPORT.md (short, plain: what to click to see
it, what was checked, what remains), and a PROJECT.md entry marked proposal.
