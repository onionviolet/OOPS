# Proposal for lane A (main.js owner): structured pack render

Proposal, not applied. Patch: [lane-a-structured.patch](lane-a-structured.patch)
(against `src/main.js` at `7504a1e4`; three hunks, applies with `patch -p1`).

## Why

The "Your beginning" panel refreshes only through its own 250 ms poll. Each poll
calls `readStructuredCampaign`, whose `structuredContext()` rebuilds
`simulationNativeContexts` outside any publication frame: 80-160 ms per game tick
on the crowded fixture, 6-15 ms on developed. That one read is most of this lane's
remaining per-tick cost.

## Change

1. Render `structuredPanel` in the publication frame list in `persistExpansion`
   (after `lifeRecordPanel`). Inside the frame its native contexts come from the
   frame cache other panels already filled. Dev-stepped batches coalesce it like
   the others (it is already in the `advanceTicks` panel list).
2. Pass `changed` to `createStructuredPackPanel`: the poll then reads only when
   this token moves (compared element by element with `Object.is`):
   `expansionState, optionalPackState, structuredNotice, ownsSave,
   foundationSaveBlocked, expansionError, importProbeToken, current_location?.id,
   current_activity, current_game_action, current_combat, current_dialogue,
   is_sleeping, is_reading, is_in_trade(), feedbackClockPauseReason(),
   character.money, inventoryDisplayRevision(), !!active_effects.Recovering`.
   `inventoryDisplayRevision` (display.js, this branch) bumps on every displayed
   inventory refresh, which every native inventory change goes through.

## Behavior to accept

- Native inputs outside the token (skill levels, vitals, equipment) refresh at the
  next publication instead of within 250 ms. In the profiled runs `update_timer`
  reached `persistExpansion` every tick (inferred: the lag is at most one tick
  while time runs; not verified for every activity). While the clock is paused,
  only token changes refresh the panel.
- Repetition plans advance on settlement, which is a publication, so the
  in-frame render runs them. Checked: the repeat-3 plan on the fresh fixture
  produced byte-identical panel text to base after each dev-stepped step.

## Measured with the patch (scratch build only)

Owned-module time per tick: developed 0.19x-0.30x of base, crowded 0.03x-0.05x
(host load 130-640). Details in [RESULTS.md](RESULTS.md).

## Broader dirty flags (ER1-F4)

The same shape fits the other per-publication calls in `persistExpansion`:
`update_displayed_character_inventory()` and `update_displayed_item_log()` run on
every publication even when `plan` touched no native inventory or item log. This
branch made both cheap when nothing changed (no forced layouts, no DOM writes),
so a `plan.native`/`plan.itemLog` dirty check there is now a small win
(about 2-3 ms per tick on crowded for the inventory scan, under 0.1 ms for the
item log), not a requirement.
