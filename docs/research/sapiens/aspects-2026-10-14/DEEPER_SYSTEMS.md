# Three deeper systems by payoff

## D1: Storage evolution, highest CH payoff

Shown in `serverEvolvingObject:addCallbackForStorageAreaIfNeeded`: one pile schedules its earliest item due time, retains each fraction/reference, changes compatible types in place and emits incompatible output outside the pile. Count maps and resource stats update after evolution. `evolvingObject` categories choose covered/uncovered priorities. This supports distinct intermediate stock without a timer poll per item.

Caveat: loose-object overshoot is bounded into a next evolution, whereas storage changes reset progress fields and schedule a quick next check. Current cover controls the elapsed-time calculation. PROPOSAL for chain owner: compare stepped split timing and storage moves before claiming equivalent catch-up; adapt the mechanism only for one useful lot.

## D2: Social interactions, A01 payoff

Shown in `social.lua`: interaction entries choose a vocal phrase, optional gesture and notification data. Standard conversational entries return only at default/near distance. Greeting choice uses time-of-day and rotating variation; voice selection follows life stage/sex. `vocal.lua` supplies phrase IDs, with English UI/story/localization archived privately. No player response graph, teacher transfer or paid-choice continuation is proved by these barks.

PROPOSAL for dialogue owner: let an earned action emit a conditional short response with current context. Keep paid staged choices and teaching in their own existing consumers. This donor cannot close P19 or teacher-route gates.

## D3: Ordered mod composition, A03/A07 payoff

Shown in `modManager.lua`: loader reads mod scripts, catches errors, orders onload functions using loadOrder/default order, and tracks resource/localization additions and overrides. `typeMaps.lua` separates stable indices from text and reports undefined references. `serverWorld.lua` migrates old discovery keys rather than deleting learned state.

PROPOSAL for engine authoring owner: preserve stable content IDs and explicit order/error reporting for a bounded module. Do not port this loader or execute donor mods. Native saved-index mapping internals and mod compatibility across real saves remain unread.
