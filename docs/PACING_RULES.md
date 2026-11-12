# Pacing rules

Proposed 2026-11-06 (AD32); run authorized by Weibao, lines not yet accepted.

Nobody had written down what pacing should feel like, so numbers drifted. These lines name the felt outcomes
(time to first payoff, the longest wait with nothing new, the gap between unlocks) and how they are measured.
Weibao is essentially the only player (AD22), so this is about feel, not exploit hardening. Targets are
proposals per start, in game minutes, from a deterministic curious-player trace.

Owners and neighbours: [BALANCE](BALANCE.md) (the dial index; its rows say "No target" until a line here is
accepted), [skill and learning rules](DOMAIN_RULES.md) (SLR7 learning rate is an adjective per world),
[economy rules](DOMAIN_RULES.md) (ECR26 honest baseline income), [UI rules](UI_RULES.md) (opening surfaces).
Check: `node scripts/check_pacing.mjs` (plays the game; not part of `check:rules`). The full run is a periodic check, not a per-edit one (the trace cache key hashes all of `src/`, so about 44 minutes cold); re-measure touched starts with `--only <start,...>`, 3 parallel recordings by default. Recorder:
`scripts/headless/trace.mjs`. Backlog: [PACING_BACKLOG](pacing/PACING_BACKLOG.md).

| Code | Rule | Default, dial, reason |
| --- | --- | --- |
| PAC1 | **A payoff is a visible gain.** Money up, an item gained, a skill level, a new unlock (a panel, person, recipe, quest, flag or codex entry). | Default: those four, read from the save and the navigation list. Dial: a world adds its own payoff kinds (a binding fitted, a rank, a pack purse, knowledge or a power gained, a settled action), read from the life's own records. Reason: the player sees these; a changed counter nobody can see is not a payoff. |
| PAC2 | **Measure five things per start, in game minutes since the first press.** First payoff, first acted payoff (a press, not a wait), longest stretch with no payoff, longest dead stretch (no save change, no new text, no new Reports line), and the gaps between unlocks. | Default: those five. Dial: more measures when a world has a rhythm they miss. Reason: they are the felt numbers; run length and level counts are not. |
| PAC3 | **Targets are per start: a default, a dial and a reason.** Default: first payoff in 30 minutes, first acted payoff in 60, no payoff gap over 240, no dead stretch over 90. | Dial: the Village opening is tighter (acted payoff in 30, gap 120); book lives are lesson, trade or shift shaped (first 60, gap 300 to 480); cultivation starts may run slowest (first 90, gap 480, dead 180). Reason: a slow cultivation world can be slower than a Village start if its slowness is the point and something small still lands in the first hour. |
| PAC4 | **The first hour is a promise.** Every start shows one acted payoff in its first hour, by default. | Dial: a start whose canon opens with waiting names the wait and what ends it in its first screen. Reason: the opening is where a new life wins or loses attention (UI rules on opening surfaces). |
| PAC5 | **Pacing is ratcheted, not tuned by memory.** `scripts/pacing_baseline.json` records each start's misses; a new miss or a worse number fails; a better one asks to retire the entry. | Default: a tolerance of 30 minutes or 25%, whichever is larger. Dial: `--update-baseline` after a deliberate pacing change. Reason: the trace is deterministic but unrelated edits shift it by a step or two. |
| PAC6 | **Away and idle pacing is a separate proposal.** The trace is attended play, `dt` minutes per press. | Default: attended only. Dial: an away recap trace later (SLR26, AD17). Reason: the two feel different and one number would hide both. |
| PAC7 | **A dead stretch needs a reason or a nudge.** If a start has a stretch past its dead target, the screen says what is happening and what ends it (a running job, a timer, a person who will answer). | Default: a named reason in the Current work or scene line. Dial: a silent wait is fine inside a ritual or sleep the world made. Reason: silence reads as broken; a stated wait reads as pacing. |
| PAC8 | **Changing a dial that saves already used needs the usual care.** A pacing change to XP curves, prices or timers follows AGENTS.md Safety (migration or a compatibility note). | Default: new lives take the new pacing; saved lives keep theirs. Dial: a world may migrate. Reason: a life already lived should not be re-priced. |

## Progression through ordinary play

Adjustable working defaults under AD56, 2026-11-11. PAC1–PAC8 retain their
proposal status. These review prompts use the existing pacing trace and local
world rules. [Source comparisons and trial cases](research/GAME_UX_GUIDES_2026-11.md#ui-progression-and-choice-research-2026-11-11).

| Code | Rule | Default, dial, reason |
| --- | --- | --- |
| PAC9 | **Measure time from a gain to its first useful consequence.** | Default: name the next real use of a skill, resource, tie, place or permission and trace when the player can first use it. Record the owning clock, time spent acting and the reason for any gap between gain and use. Dial: the payoff can open a route, remove a chore, change how something is understood, or improve a method the player already likes. Long waits can serve the world’s rhythm. Reason: frequent gains can leave choices unchanged. Use PAC1–PAC2 for visible payoffs and FLR4 for the consumer. |
| PAC10 | **Compare progression under different conditions before tuning a curve.** | Default: for a changed repeating loop, compare a fresh start, an established routine and a plausible interruption or return. Record the source and use of resources, the rate or prerequisite that controls the next capability, and what the player can do about it. For a reset that exists, compare the next run’s useful choices and carryover. Dial: sample the cases that could change the decision and state what was simulated. Reason: a good opening can conceal an accumulating shortage, or a healthy rate can conceal a blocked appointment. Preserve lore anchors (AD49), long play and powers that legitimately remove work (ACR12). |

**PAC9, applying a discovery.** For a targeted trial, name the player's purpose
and the likely action before the discovery. On a separate use, record the
decision the new evidence supports and compare what that decision gains, costs
or trades away. Count the relevant inputs and actions when testing reduced
setup. A discovery can matter by changing the recipe or route while taking the
same number of actions. [PX84 Mix trial](audits/PLAYER_EXPERIENCE_CORE_AUDIT.md#round-10-2026-11-11-px84-at-the-mixing-counter).

## Measuring (how the numbers are made)

SHOWN by `scripts/check_pacing.mjs` against `scripts/headless/trace.mjs`:

- Policy: "work" (the pacing check's default, `--policy work`). It plays the start's own paid or main work first: a Village job
  (run one paid round, then stop it so the pay lands), a book life's structured action, a Tingen task, a pack duty (one of each
  "Choose ..." set, not every alternative). The Village work waits for the opening's first payoff, so the talk the screen asks for
  comes first. Everything else falls back to "unseen first". 10 game minutes per press; opening a panel costs 1. It is attended
  play of a player who wants to earn, not optimal play.
- The old "unseen-first" policy (browse what the screen offers, never work) is still recorded by the openings and feedback checks and
  stays valid for them (`--policy unseen-first` here). It under-measured: it left the Village job running unstopped (pay lands on
  stopping) and never pressed a book life's actions.
- Counted from the first press (the recorder's one-minute init tick is not play).
- A gain a life keeps in its own records is a payoff (PAC1 dial): settled completions on a book life's action rows, knowledge, powers,
  faculties, titles or progression gained, a pack's purse or rank. A rise in the life's event log, or a job running, is liveness
  for the dead-stretch measure only: a refused or failed command is not a gain.
- Passive buckets (`levels`, `skillRecords`, `absorb_local_life`) are not change; a passive skill level-up still counts as a payoff
  because the player sees it (Breathing and Patience are the clock, not play).
- The Village is traced over its open day (720 minutes from 08:00): paid work closes at 20:00 and the screen says so (PAC7), so the
  night is a world rhythm, not a stall (`START_MINUTES` in the check).
- The full run is a periodic check, not a per-edit one: the trace cache key hashes all of `src/` (about 44 minutes cold under load).
  Re-measure touched starts with `--only <start,...>`.
