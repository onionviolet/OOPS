# F12: the complete trial table

**Shown:** `src/app/game-state/hell.service.ts` (H) defines Gates plus the following 18 trials. Actions below are in `activity.service.ts` (A). Thresholds preserve `>` versus `>=`; a displayed full bar can precede success.

| Trial / H lines | Required result | Rule or route |
|---|---|---|
| Tongue-ripping / 1059-1116 | follower power >5000 | Stash followers, lower charisma 10% each day, recruit damned followers with hell money |
| Scissors / 1119-1156 | >=100 fingers | Stash weapons, fight for drops |
| Trees of Knives / 1159-1203 | >=10000 gratitude tokens | Stash mortal money, lose 10% current HP daily, pay hell money to honor ancestors |
| Mirrors / 1206-1246 | >=1000 mirror shards | Stash followers, fight reflections, consume shards at task completion |
| Steamers / 1249-1305 | >100 current enemies | Stash gear, heat and theft; rehabilitation spawns enemies whose defeats create two stronger replacements |
| Copper Pillars / 1308-1359 | right-hand base damage >10000 | Stash weapons, local mine/forge route; displayed progress additionally checks Copper Hammer identity |
| Mountain of Knives / 1362-1406 | steps >=total kills/100 | Damage falls with steps and elapsed atonement; climb needs strength/toughness 1e24 |
| Mountain of Ice / 1409-1453 | >=10000 ice cores | Fire cores block daily cold damage; fire lore falls daily; melting spawns ice golems |
| Cauldrons / 1456-1520 | >=1000 ice cores and HP >100000 | Ice produces costly steam damage; otherwise heat and random weapon drops |
| Cattle Pit / 1523-1555 | animals healed >1000000 | Healing consumes stamina and qi; success discovers a beast concept |
| Crushing Boulder / 1558-1627 | height >1000 | Entry resets height; below height 101 attack power is reduced and daily damage continues |
| Mortars and Pestles / 1630-1664 | fast days >1000 | Daily passive counter; hostile feeding reset is implemented but lost by normal spawn mapping, see combat digest |
| Blood Pool / 1667-1695 | depth >10000 | Entry resets depth; only swimming, each step costs health and stamina |
| Wrongful Dead / 1698-1736 | escaped souls >1000000 | Daily HP/stamina drain; discover exit, then teach it to souls |
| Dismemberment / 1739-1777 | returned relics >10000 | Interrogate for map, project to recover relic, return it; distinct charisma/intelligence/speed checks |
| Mountain of Fire / 1780-1825 | >=10000 fire cores | Ice can block heat; water lore falls daily; freezing spawns lava golems |
| Mills / 1828-1853 | endured crushes >total lives x100 | Only endurance; count rises only when the action leaves HP positive |
| Saws / 1856-1896 | contracts examined >3000 | Intelligence-gated chance per costly reading action; damage stops after enough contracts |

H110-150 applies daily effects only before task completion and checks results on both ordinary and battle ticks. Defeat returns to Gates and clears enemies. H210-283 separates task completion, exit cleanup, realm entry and permitted normal/projection activities. H242-261 skips the new entry effect on loading; this does not by itself prove restoration is safe for every stash. H936-977 saves trial counters and completion lists.

H981-1056 exposes all trial gates, not gates chosen from a moral history. All mastered bosses open the final challenge. H301-839 gives 18 distinct boss records with short attacks and, for several, a very long delayed huge attack. H841-934 gives Yama and two allies, plus poison/doom immunity on Yama. These are largely timers and stat checks, not 18 different tactical systems.

**Shown detail:** the hell status template enables a challenge after the task and still offers further fights after mastery. The service itself does not enforce all that UI eligibility. `item-repo.service.ts:2337-2366` and the other crown records mark boss mastery on item use. A kill, crown possession and crown acceptance are different states.

**Inferred adoption lesson:** model task result, boss result and accepted reward separately; make custody restoration explicit; derive a conduct-based challenge only from actual remembered events if the world calls for it. Source-specific moral text and huge numbers are not proposed YAIRPG rules. Trials may recur by world law, without a fixed once-only player limit.
