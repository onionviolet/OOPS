# Ranked implementation packets

2026-10-13. All packets are PROPOSALS, unaccepted and unimplemented. Ranking is this lane's fit assessment. Names below are original working names. Conditional keep and mastery re-runs stay with [Modding Tree P1/P3/P4](../modding-tree/IMPLEMENTATION_PACKETS.md).

Every selected packet needs live source/ownership refresh, focused source checks, a rebuild and a fresh-origin desktop browser exercise at 1440x900. Verify the changed state through Save, reload, Export and literal-file Import. Mobile optimization, a second realm, a second prestige layer and a general script engine remain deferred. Limits, reward lifetimes and capacities belong to named world adjectives, never a universal fixed "once" rule. UI must expose only already discovered rules and rewards.

## P1: World-aware routine permissions (adapt; F12/F14)

- **Smallest result:** one existing finite work plan, "Quiet Workshop", keeps its saved steps when a known local rule forbids one tool. The next step pauses before reserving inputs, with "This tool cannot be used under this rule." Leaving the restriction makes the plan eligible to resume by player choice. No general interpreter.
- **Seams:** `src/feature_expansion_work_plan.js` definition/cursor validation and common boundary; `src/simulation.js` command preview and finite programs. Add a stable capability/reason identifier to the existing eligibility route only if current predicates cannot express it. World content supplies the adjective. Transitions must recheck permissions and stale sequence; preserve the existing pause-on-transition behavior.
- **Player path:** earn and start a short plan, encounter an already disclosed local restriction, see the exact blocked step and reason, resolve the restriction, choose Resume.
- **Acceptance:** no forbidden step starts manually or through a routine; no cost is spent by the blocked step; an already accepted job follows its existing cancellation policy; the saved plan is retained; removal of the rule alone does not silently restart work; execution remains on the common clock. Desktop panel shows current step, reason and Resume without hidden tool names.
- **Compatibility/cost:** reuse existing plan IDs and predicate rules first. Any saved reason field is additive and optional, with old cursors readable. This extends earned automation already covered by Increlution, rather than duplicating it.

## P2: Run-purpose ledger (trial; F1/F2/F3/F13)

- **Smallest result:** one existing authored transition gains a visible purpose label, such as "Prepare a field record", and a short display of current objective, available reward and the early subsystem feeding it. Use one allowed prestige layer. Do not create a reset currency.
- **Seams:** `src/simulation.js` transition preview/receipt; `src/simulation_contracts.js` authored definition validation; existing command/completion facts. Reward amount and permission come from the current authored effect preview, not a second UI calculator. Actual native presenter selection remains open and belongs to its owner.
- **Player path:** open the known transition, see why doing it now is useful, inspect what is lost and retained, complete the objective or return to ordinary work, then explicitly confirm the transition.
- **Acceptance:** purpose text changes only from known facts; preview and paid receipt agree; stale previews reject; lost/retained domains remain exact; no unrevealed future-layer checklist. Save/reload/Import preserves the receipt and objective state.
- **Compatibility/cost:** prefer definitions-only labels and derived UI. If a receipt gains an optional purpose ID, migrate additively. This complements Modding Tree's keep preview and does not implement conditional retention.

## P3: Expedition timing contract (trial; F6/F8)

- **Smallest result:** one known expedition, "Shifting Passage", uses an authored rule that samples the current local threat when entry is accepted. Preview shows the known risk and reward at that point. Waiting may improve the reward and raise the risk. It is an optional route inside the current world, not another prestige layer or a generic challenge engine.
- **Seams:** `src/simulation.js` command preview/commit, sequence checks and existing encounter/reward effects. Reuse a world's authored threat facts and durable job receipt. The exact reward-expression support must be checked before implementation; no formula was added here.
- **Player path:** acquire the passage lead, compare entering now with continuing ordinary work, accept entry, then resolve the existing encounter path.
- **Acceptance:** entry freezes disclosed threat/reward facts; later world progress cannot silently rescale a paid encounter; stale previews reject; quitting follows an explicit existing cost/cancellation policy; deterministic entry survives reload/Import with no new reward roll. An idle routine pauses before the risk commitment.
- **Compatibility/cost:** optional receipt metadata if needed. Skip drop probability/pity mechanics, already covered by cultivation-idlers P4, and omit reference Void names/assets. No universal map slots or replay cap.

## P4: Relic preparation (park until a canon/world carrier is chosen; F4/F5)

- **Smallest result:** one existing owned relic, "Archive Lens", affects an information-gathering bottleneck instead of flat combat damage. Its world rule states the legal carrier across the already authorized transition. The preview can show the relic and why it still works in the next opening.
- **Seams:** `src/structured_equipment_runtime.js` actual equipment/custody projection, `src/simulation.js` explicit equipment/source domains, and `src/heir_inheritance.js` only if a physical estate is the selected carrier. Do not create a second equipment inventory or turn Trimps Heirlooms into family inheritance.
- **Player path:** discover the relic normally, acquire and equip it, observe the changed field-record task, inspect its known carrier in the transition preview, and encounter the changed task after the transition.
- **Acceptance:** benefit requires real ownership and valid equipment/source state; switching items removes the effect; a forbidden world suppresses use without deleting ownership; no duplicate copied item; a missing carrier is explicitly lost. Persistence preserves item identity. Discovery remains sealed outside its route.
- **Compatibility/cost:** definitions first; any cross-run item identity change needs a migration or explicit compatibility decision. If retention needs new conditional rules, merge into Modding Tree P1 rather than implementing that here. No new global relic slot or fixed collection cap.

## P5: Reward lifetime labels (adapt; F7)

- **Smallest result:** the same reward preview labels one authored consumable as "until this life ends" and one earned record as "carried by your papers". These labels are resolved from world-defined effect/transition semantics. No Bone Trader clone or cash shop.
- **Seams:** `src/simulation.js` authored costs/effects and transition preview; `src/heir_inheritance.js` named papers/estate carrier. Use definitions-only display metadata when possible. The exact UI presenter is an integration choice still open.
- **Player path:** inspect a paid reward, read what it does and when it ends, buy it, then see its fate in the existing transition receipt.
- **Acceptance:** the label predicts actual expiry/carry; a mid-life reward does not trigger a reset; a counter award cannot be described as a real reset; missing ownership and world restrictions show distinct reasons. Save/reload/Import retains the same effect lifetime.
- **Compatibility/cost:** no new premium currency, shop, balance cap or counter meaning. Definitions-only metadata is preferred; changes to persistent effect state need migration review.
