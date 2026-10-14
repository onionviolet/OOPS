# Hunger and bodily needs considerations, 2026-10-13

Status: ordinary food direction accepted in the later follow-up; detailed
mechanics remain proposals, not an implementation assignment. The
[vision owner](USER_VISION.md#food-benefits-and-famine-consideration-2026-10-13)
records the exact request and interpretation. Earlier recommendations below
are preserved as the discussion's dated history.

User asked: “Should we even implment hunger stuff and more? MOre to consider?”

## Current evidence

The [project summary](../PROJECT.md) records an existing optional home-world hunger proposal. Current [pacing source](../src/absorb_e1/pacing.js) confirms default-off hunger, a full bar draining over eight played hours, meals restoring fullness, and ordinary XP efficiency ranging from 80% to 100%. Sleep and travel use the same drain clock; other-world calls do not advance it. Nutrition currently derives from food buff duration, rather than an explicit nutritional property. These are source observations. This consideration pass ran no build, tests or browser journey and makes no new runtime claim.

Accepted direction: each world makes its own rules; bodily capabilities and available means matter. See PROJECT.md's Rulebook and means direction. [User vision](USER_VISION.md#world-texture-loreful-adversaries-and-parallel-timelineprogression-authoring-2026-10-05) also allows incidental texture without compulsory mechanical payoff. One realm and one prestige layer remain the delivery scope.

## Recommendation and considerations

- **D1: Keep hunger optional while evaluating its purpose.** Food can support cooking, hospitality, trade and preparation without compulsory hunger. A meaningful survival segment can justify stronger hunger rules locally. Do not make the existing XP penalty the universal bodily-needs model.
- **C1: Connect needs to decisions and eventual relief.** Compare carrying rations, paying for an inn, foraging, taking a shorter route or acquiring a supported food-producing capability. Earned provisioning should reduce repeated upkeep. These are proposals, not existing capabilities claimed by this note.
- **C2: Respect actual bodies and sources.** Ordinary humans, altered bodies and nonhuman forms may have different needs, substitutes or none. Define each applicable need and exemption from the selected world's/body's rules; do not invent hunger to offset a powerful exemption.
- **C3: Make the idle/time contract deliberate.** Decide played time, sleep, travel and offline treatment separately. Show enough information to plan. A future auto-eat feature needs a player-selected eligible stock/reserve policy and must not consume valued ingredients indiscriminately. NPC needs require reachable supplies and actual means, rather than universal offscreen starvation.
- **C4: Add adjacent systems selectively.** Existing stamina/recovery and meal effects are the first integration points. Thirst, fatigue, temperature, illness, food spoilage and equipment wear deserve separate decisions. Avoid several meters taxing the same action unless the chosen survival experience warrants it. Explicit nutrition is a possible replacement for the current buff-duration proxy if nutrition becomes important.

## Proposed next playable comparison

Use one bounded home-world journey, at the standing laptop/desktop viewport, to compare current hunger off/on. Observe food cost and availability, interruptions per played hour, whether existing meals cover sleep/travel, and whether the player actually changes a route or preparation. No balance target is accepted here. Rebuild and fresh-origin behavior/persistence checks would belong to an authorized implementation task, followed by Weibao's judgment of the feel.

No runtime, saves, settings defaults or accepted direction changed. Other ongoing edits were preserved.

## Follow-up: nonlethal food bonuses and Proto23

User proposed food without hunger death and asked whether a bonus for eating is effectively a penalty for abstaining. This remains a tentative design discussion, not authorization to replace the hunger implementation.

Directly fetched and inspected Proto23 revision `e93a8cd617932fb698ff889b968a32f9a20d48f3` from [primary source](https://raw.githubusercontent.com/23html/23html.github.io/e93a8cd617932fb698ff889b968a32f9a20d48f3/index.html). Source inspection only, not a browser playthrough:

- Food replenishes `sat`, displayed as energy; apple restores 7, bread 14 (2566–2584). Eating also trains Gluttony.
- `You.efficiency()` (7321) varies from 20% at empty to 100% at full before bonuses, at Famine level zero. Famine raises the empty-energy floor by one percentage point per level, capped at an additional 60 points.
- The hunger tick (13869–13873) drains positive energy; otherwise it grants Famine XP. That branch contains no HP damage/death. Low energy can still worsen combat outcomes through effectiveness consumers (10476–10582).
- Character XP uses `0.4 + efficiency * 0.6` before other adjustments (13735), so 20% effectiveness means a 52% multiplier there, not 20% XP. Combat accuracy/damage also consume effectiveness. This is a substantial gameplay penalty rather than merely losing a small meal perk.

Current native YAIRPG already has the bonus pattern: Basic meal adds 0.5 flat stamina regeneration (`src/active_effects.js`); Stale bread grants it for 60 game minutes (`src/items.js`). The optional fullness XP modifier is an additional system, not required to make food useful. It has no hunger HP/death effect in its own pacing module.

**D2 recommendation:** evaluate normal unfed play as the comfortable balance baseline and use temporary, bounded meals for better recovery or specific preparation. No hunger death, mandatory eating gate or negative hunger condition is proposed for this slice. Different meal profiles can make preparation interesting without an always-optimal universal XP boost. Do not implement a second overlapping fullness bonus by accident.

**C5 framing versus balance:** 80 unfed / 100 fed can be described as a 25% fed bonus, with identical outcomes. Keeping an existing 100 baseline and adding a modest bonus changes actual outcomes. Either becomes practical pressure if progression, enemies or income assume continuous feeding. Judge affordability, duration, repeat clicks and the unfed experience, not the word “bonus.”

**C6 interaction decisions:** choose stacking/replacement, duration behavior during sleep/travel/offline time, and any opt-in auto-eat stock policy explicitly. Nutritional capacity and finite special bonuses must not permit unlimited benefit from repeated eating; body/source exceptions remain local. Spoiled-food harm is a separate choice from starvation and must not be implied by a nonlethal hunger proposal. Reusing existing meal effects is the smallest initial implementation route if selected; replacing the saved optional hunger setting requires its own compatibility decision.

## Passive progression correction and structure

Accepted direction is recorded in the [vision owner](USER_VISION.md#food-benefits-and-famine-consideration-2026-10-13). The agent's active-exertion-only suggestion was wrong for the intended idle RPG and is superseded. Famine must be able to gain XP passively while underfed as eligible game time advances. Very slow positive XP is an available balance choice, not a chosen numeric rate. No new implementation occurred in this pass.

- **D3: Condition, time, progress, benefit.** A sustained applicable condition or queued activity supplies XP through the game's progression clock. Manual presence is not a prerequisite. For Famine the condition is underfeeding; for other systems it can be queued study, work, recovery or environmental exposure where supported. This is design structure, not authorization for a generic engine rewrite or universal XP.
- **C7: Slow should remain real progress.** Accumulate fractional XP so a tiny passive rate is not rounded to zero each tick. Display progress and a useful rate once known. Increasing level costs can make mastery slow without introducing an active-only unlock. Optional extra routes may accelerate progress, but none should be required for the passive route to continue. Numbers remain proposals.
- **C8: Train time, not toggles or logins.** Integrate only the actual eligible underfed portion of elapsed game time. Switching food/settings or repeatedly loading a save should not award fresh XP. Pause should not advance the clock. Sleep, travel and offline time require explicit applicability rules; equal eligible game time should give equal XP regardless of tick frequency or foreground attention. Preserve fractional progress across saves.
- **C9: Give Famine a real function.** Candidate benefits include tolerating a longer gap between meals or reducing an applicable underfed efficiency loss. A skill must not manufacture a hunger penalty merely to cancel it, or silently make the no-food path best for every build. Food can remain useful through separate recovery/preparation effects. Exact benefits remain unselected; supported independence from food remains valid.
- **C10: Keep idle agency.** A player can leave a chosen routine running and return to progress. Future auto-eat needs an explicit on/off choice and stock policy, so it does not silently erase a selected underfed training condition. Bodies that do not require nourishment need their own applicability decision rather than fictional starvation. Any added saved Famine/fullness state requires compatibility and save/reload/import checks when implemented.
