# Away ledger: idle progress while away (pure module, 2026-10-14)

Authority: Weibao, 2026-10-14: "Idle stuff to gain progress out of the game
as well? like meditating and wheatver While Im gone?" Accepted direction:
passive progression is required for an idle RPG (USER_VISION, Famine entry).
Evidence: the [offline audit](../../../research/OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md)
found no automatic catch-up today; its S1 asks for an elapsed ledger first.
Design: intro doc rounds 12 (OT1-OT10) and 22 (AW codes).

Not playable: a pure module with tests. Wiring into the game is a later,
separate decision (implementation map owns the seam).

## Spec

`src/away_ledger.js` exports `computeAway(input)`, pure, no DOM:
- input `{lastSeen, now, capMinutes, gameMinutesPerRealMinute = 1, activity
  = null, barriers = [], overflow = 'drop' | 'bank', bankedMinutes = 0,
  remainderMs = 0}`; times in ms; `activity = {id, xpPerMinute,
  diminishAfter?, diminishFactor?}`; `barriers = [{at, id}]` in game minutes
  after leaving (pause before an important event).
- whole real minutes (with carried remainder) times the ratio, capped; the
  first barrier below the applied amount stops there and `nextLastSeen` moves
  only to that point, so the rest is applied after the event; time going
  backwards applies nothing (`stoppedBy: 'clock-back'`).
- returns `{appliedMinutes, overflowMinutes, bankedMinutes, gains:{xp},
  stoppedBy, remainderMs, nextLastSeen}`; never mutates input.
- `tests/away_ledger.test.js` with your own cases.

Done check: `check.sh` (A1-A9, npm 0 failures, unit file present).
Allowed files: those two only, in the worktree
`/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg`.
No git add/commit/push; never edit checks/check.sh/GATE.sha256.

## Coordinator verification (2026-10-14)

Reran `check.sh` after the worker ended: exit 0 (A1-A9 PASS, npm 667 pass / 0 fail). Pure module only; not wired into the game.
