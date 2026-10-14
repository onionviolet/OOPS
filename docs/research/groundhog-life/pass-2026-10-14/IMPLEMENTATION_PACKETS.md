# Implementation packets: PROPOSALS ONLY

No packet is accepted or implemented. Each is an independent candidate, not an added completion gate. Select one playable slice before building another. No copied code/assets. Future persistence work needs a compatibility decision; future UI proof requires a rebuilt fresh desktop origin at 1440 x 900, with mobile deferred.

## P1: Notify, pause or act

Owner: work-plan/routine owners and docs/ENGINE_EXPANSION.md. Proposed state: policy enum, next decision, pause boundary and reason.

Behavior: Choose among notice, stop before change and execute. Never toggle pause in response to a trigger. A selected pause stops before job/queue/resource changes.

Acceptance if selected: Compare all three modes at the same boundary; verify one tick cannot spend after stop. Save/reload/literal import must preserve changed state if persisted. Human acceptance remains separate.

## P2: Reset comparison by skill

Owner: reset owner and docs/LIFE_SIM_NORTH_STAR.md. Proposed state: selected reset domains, current skill carry, projected deltas and provenance.

Behavior: Preview each affected skill and its retained gain. Commit from the same validated snapshot. Repeated resets remain possible under the world rule without requiring a new prestige layer.

Acceptance if selected: Preview and committed deltas match; cancellation changes nothing; one repeated eligible reset works. Save/reload/literal import must preserve changed state if persisted. Human acceptance remains separate.

## P3: A fitting defense reward

Owner: docs/TRIALS_AND_TRIBULATIONS.md and docs/gm/dispatch/procgen-2026-10-13/p21/WARS.md. Proposed state: authored threat, arrival time, defense result and research contribution.

Behavior: One opt-in threat rewards a local research route. Show how defenses and elapsed time affect arrival. Province control still uses its own objectives, people and supply.

Acceptance if selected: Prove a successful defense, arrival consequence and a reachable noncombat exit. No absent-player requisition. Save/reload/literal import must preserve changed state if persisted. Human acceptance remains separate.

## P4: Ordered goals with visible skips

Owner: work-plan owner and docs/LIFE_SIM_NORTH_STAR.md. Proposed state: goal IDs, targets, order, blockers and active step.

Behavior: Retain a locked future goal, but run the next allowed unfinished one. Explain skips and default new goals to a meaningful target.

Acceptance if selected: Reorder, unlock, finish and reload a two-goal plan without selecting a finished or invalid target. Save/reload/literal import must preserve changed state if persisted. Human acceptance remains separate.

## P5: Achievements as dated life records

Owner: chronicle and docs/CHARACTERS_AND_WORLD_EVENTS.md. Proposed state: stable achievement IDs, predicate type, occurrence date and group membership.

Behavior: One profession story groups a pace feat and a craft feat. Explicitly distinguish badge, payout and title. Keep retained records independent of transient current stats.

Acceptance if selected: Trigger both through normal actions, show their dates and exact reward, and retain them across the selected life transition. Save/reload/literal import must preserve changed state if persisted. Human acceptance remains separate.
