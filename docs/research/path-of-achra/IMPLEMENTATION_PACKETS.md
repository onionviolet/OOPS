# Original YAIR proposals, unimplemented

These are candidates for Weibao's design review, not accepted decisions or retail Achra parity claims. Each packet would need a separately authorized playable slice and the project's browser/save acceptance gate.

| ID | Proposed YAIR slice | Acceptance idea |
| --- | --- | --- |
| P1 | Give one existing opt-in combat action a visible pending-effect row with a deterministic tie rule. | Trigger two effects in one turn and see their resolved order. |
| P2 | Add one earned charge action with one gain trigger and one spend trigger, shown in the native center action UI. | Gain, spend, exhaust and recover charges in a fresh browser origin. |
| P3 | Add one mutually exclusive temporary stance with duration extension on repeat and an explicit replacement outcome. | Activate, extend, replace, save, reload and import. |
| P4 | Let one existing damage type unlock a small conditional recovery path, capped by missing health. | Hit the condition, miss it, reach full health and defeat the actor. |
| P5 | Add one movement or wait consequence in an existing destination with a clear source and target. | Move, wait, defeat a target before resolution, then save/reload/import. |

These deliberately use original terms and YAIR's existing one realm/one prestige milestone. No new world, reset rule or copied character roster is selected here.

## Review status, 2026-10-07

Source: [PROPOSAL_REVIEW](../../gm/dispatch/new-game-audits-2026-10-07/PROPOSAL_REVIEW.md). Native combat has no deterministic shared turn, so these wait for an opt-in combat surface.

- **P1, P3, P5: later.**
- **P2: adopt-now, rank 3 for the milestone.** Not started; needs a decision on the saved `nativeBattle` schema first.
- **P4: closed, dropped.** Needs a damage-type system native combat lacks. This is a scope drop, not a duplicate of shipped work.
