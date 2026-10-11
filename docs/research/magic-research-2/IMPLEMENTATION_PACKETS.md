# Original YAIR proposals from the demo audit

These are design proposals for the current one-realm, one-prestige milestone. They do not authorize implementation or change PROJECT.md decisions.

**P1, earned knowledge with a separate casting gate.** Add one researchable home-world technique whose knowledge comes from a repeatable study action. Show its learned state separately from live fuel, capacity, and cooldown. Playable proof: reach the knowledge threshold with insufficient capacity, then improve capacity and cast it. Acceptance: the UI explains both gates and a failed cast spends nothing. Source rationale: F1/F2.

**P2, equipment that closes a loop.** Let one craft consume gathered materials and alter a specific technique's output plus a practical fuel stat. Playable proof: gather, craft, equip, cast, unequip. Acceptance: the effect is scoped to the named technique family and the old equipment/save path still works. Source rationale: F3.

**P3, bounded automation.** Add one worker rule for a learned repeatable action with visible assigned capacity, per-attempt fuel cost, condition, and pause/stop reason. Playable proof: automate under adequate fuel, exhaust fuel, recover, and disable. Acceptance: an ordinary failed attempt consumes no fuel; any later sustained mode states and tests its ongoing drain explicitly. Source rationale: F4.

**P4, discovered prestige preview.** Gate the existing first prestige layer behind a concrete achievement and show a before/after preview of run loss and retained benefit. Playable proof: trigger, inspect, confirm, restart. Acceptance: save/reload/import and migration checks prove retention and old-save behavior before calling this gameplay done. Source rationale: F5.

The proposals intentionally preserve the vanilla opening and current save ownership. Scope, balance, fiction, and acceptance still belong to Weibao and the game's owning design documents.

## Review status, 2026-10-07

Source: [PROPOSAL_REVIEW](../../gm/dispatch/new-game-audits-2026-10-07/PROPOSAL_REVIEW.md). Weibao authorized closing the duplicates and building P2.

- **P1: closed, already shipped.** Lessons grant the method; casting separately needs an active faculty, mastery and energy. Log any UI-clarity gap in the acceptance backlog.
- **P2: selected.** Built as slice D1 with Soulash O2 (see the D1 checkpoint under `docs/gm/d1-alloy-equipment-2026-10-07/`). Verification status lives there, not here.
- **P3: closed, already shipped.** Programs already provide bounded automation with a pause reason.
- **P4: closed, already shipped.** The field renewal is the gated prestige layer with a loss and reward preview.
