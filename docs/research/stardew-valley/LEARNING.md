# Learning is not present craftability

SHOWN source/data except the exact friendship-recipe mail enqueue timing, which remains unread.

| Route | Authoring / evaluator | Lasting result |
|---|---|---|
| Default | Recipe condition segment `default`; `Farmer.LearnDefaultRecipes`. | Adds stable recipe dictionary key with count 0. |
| Skill level | `Farmer.gainExperience`, level thresholds and queued level-up state; `CraftingRecipe.TryParseLevelRequirement` reads cooking segment 3 or crafting segment 4; `LevelUpMenu` learns applicable recipes. `AddMissedMailAndRecipes` repairs eligible missed level recipes. | Learned recipes persist independently of stock or a temporary skill buff. Keg Farming 8; jar Farming 4. |
| TV | `Data/TV/CookingChannel`, `TV.getWeeklyRecipe`, weekly selection/rerun code. | Adds cooking key if absent, and distinguishes already known from newly learned in its message. |
| Mail | `Data/mail` item directives; `LetterViewerMenu` handles cookingrecipe and craftingrecipe attachments, validates IDs and shows learned-name feedback. | Adds recipe directly; reading a normal old display is not a second copy of recipe stock. |
| Friendship | Cooking condition `f <NPC> <hearts>`, e.g. Parsnip Soup has Caroline 3. Blank cookingrecipe letter attachment finds the lowest-threshold unlearned recipe for sender. | Friendship is an acquisition condition; ingredients remain independent. Exact sender mail admission/scheduling path remains unread. |
| Purchase | `Data/Shops` item record with `IsRecipe=true`, price and knowledge condition; `ShopMenu` purchases then `Item.LearnRecipe`, categorizing cooking versus crafting. | SeedShop dehydrator recipe costs 5000 and is hidden when already known. Knowledge is stored, not dependent on retaining recipe item. |

XP is experiential in the inspected `Farmer.gainExperience`; TV/mail recipes do not thereby raise the same skill XP. 1.6 books and mastery exist in the payload but their full acquisition/application paths were not read; no claim of complete skill-source coverage.

Crafting lists only learned keys. Cooking lists its full recipe set, with unknown ones ghosted. Known recipes with missing materials render dim; usable ones render normally. `CraftingRecipe.drawRecipeDescription` compares required amounts with current inventory plus passed container contents, marks deficits red and conditionally displays owned totals through advanced crafting information. The UI distinguishes learned status and material shortage, but a dim icon alone is not an explanation of every possible access blocker.

Current YAIRPG seams were read: `auditedLessonFacts` already separates teacher, method, hands, location and real charged stock; `techniqueFacts` separates observation, understanding and practice. SD-P3/SD-P8 extend a missing route or missing receipt, not another learning engine. Proposed method IDs must stay stable through Save/reload/Export/literal Import and supported reacquisition must remain reachable.
