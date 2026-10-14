# Groundhog Life: later-build follow-up, 2026-10-14

The remaining named systems are now statically traced: war waves, Loop Trap efficiency, auto-promotion/research/boosts and achievement groups. The important addition is a connected loop: research builds the weapon, defeated ships improve reset efficiency, and each skill banks its own permanent multiplier. The war pane is a defense-wave clock, not a territory, diplomacy or supply simulation.

This pass reads the same later-build bytes as the prior checkpoint, SHA-256 `d167076ecdafa7f4c0272a66a3cf193a3f465b6f7a3af60c478bf1d8ee214f3c`. The mirror's provenance/license is still unresolved. Ideas only. No execution, install, game launch, save access or YAIRPG runtime edit.

## Ranked PROPOSALS

| Rank / ID | Proposal | Owner | First bounded slice |
|---|---|---|---|
| 1 / P1 | Offer notify, pause and act as separate automation choices | Work plans/routines, [engine](../../../ENGINE_EXPANSION.md) | One paid repeat task pauses before choosing its next job |
| 2 / P2 | Preview reset gains per skill, with the cause of each gain | [Life sim](../../../LIFE_SIM_NORTH_STAR.md), [reset research](../../DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md) | A comparison of current retained skill and proposed gain |
| 3 / P3 | Let world defense improve a fitting research or reset route | [War proposal](../../../gm/dispatch/procgen-2026-10-13/p21/WARS.md), [trials](../../../TRIALS_AND_TRIBULATIONS.md) | One opt-in local threat changes one researched reward |
| 4 / P4 | A queue retains locked future goals and explains the next executable step | Work plans, [life sim](../../../LIFE_SIM_NORTH_STAR.md) | Two ordered goals, one temporarily blocked |
| 5 / P5 | Group achievements into life stories with dates and measurable conditions | Chronicle, [characters](../../../CHARACTERS_AND_WORLD_EVENTS.md) | One profession group with a pace feat and a craft feat |

Proposals only. P3 does not add a required second prestige layer or a universal war mechanic. A defense curve is not evidence for province logistics. For future presentation: desktop 1440 x 900, readable queue, cause breakdown and outcome together; mobile deferred. No rendering claim is made here.

## Prior lane reconciliation

| Prior ID | State | Follow-up result |
|---|---|---|
| F12 war | Extended | Target is the ship with least estimated time to arrival inside firing range. Waves change quantity, HP, speed and bosses by wave divisibility; after year 42 they can overlap. Arrival slows time by 10x instead of killing the player. |
| F12 Loop Trap | Confirmed, narrowed | Each skill adds Groundhog Factor x efficiency to its own retained multiplier, then clears ordinary loop best/XP/level. Research and current-life ship kills contribute to efficiency. The matching vendor bundle resolves the transform to log10; research feeds 0.01 x level into it. |
| F12 auto-x | Corrected | Auto-promote stays in the current career. Research scans for the first unfinished unlocked queue goal. Its Just Pause path also switches active research and toggles pause; it is not a clean stop-before-change contract. |
| F12 boosts | Corrected | Stacked mode waits for eligible boosts together; conference exclusion affects readiness in a surprising direction and activation still iterates all boosts. Independent mode checks all available boosts. Do not promise reliable exclusion. |
| F12 achievements | Extended | Seven groups, 31 achievements, saved completion time and group counts. Achievement reward method requests a save; the reward field does not prove a currency payout. Some subscription targets are duplicated. |
| F7 soft end | Version distinction | Old itch build's age-based time dilation should not be substituted for later build's ship-arrival dilation. |
| F9 boosts | Version distinction | Later build uses 1.75 multipliers, not the earlier build's 2.0. |
| F10 offline | Version distinction | Later bundle banks offline/paused ticks at 1/10 and Turbo runs at 2x; no claim of the old catch-up modal carrying over. |

See [system digest](LATER_BUILD_SYSTEMS.md), [packets](IMPLEMENTATION_PACKETS.md), [coverage](CHECKPOINT.md) and [tooling](TOOLING.md). Prior output files remain untouched.
