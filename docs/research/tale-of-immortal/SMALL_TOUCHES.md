# Twenty-two small touches for vanilla YAIR

All T-codes are original proposals, not existing gameplay or accepted decisions. Source evidence is in FINDINGS.json; existing path mapping does not prove a suitable runtime interface.

| Code | Proposed touch | Source finding | Vanilla entry point |
|---|---|---|---|
| T1 | Show preparation outcomes before choosing breakthrough | CE1 | src/data/skills.js + src/crafting_recipes.js: recipe/skill milestone description |
| T2 | Different quality attempts grant different optional perks | CE1 | src/models/skill.js + src/skill_expansion_content.js |
| T3 | A failed attempt leaves a visible timed recovery condition | CE3 | src/activities.js + native effect/center action |
| T4 | Reveal aptitude through doing an activity | CE4 | src/skill_discovery_native.js + src/data/skills.js |
| T5 | Rare gathered food subtly improves a mundane specialty | CE5 | src/crafting_recipes.js + src/data/skills.js |
| T6 | Book study displays time and money separately | CE6 | src/activities.js + src/data/skills.js: Literacy |
| T7 | Technique practice spends consumables and a day | CE7 | src/crafting_recipes.js + src/activities.js |
| T8 | Mastery stages have readable names | CE8 | src/models/skill.js + src/data/skills.js |
| T9 | A tool perk modifies recipe practice rather than global power | CE23 | src/crafting_recipes.js: Alchemy/Smelting/Forging |
| T10 | Separate eligibility from chance in event content | CE9 | src/chronicle.js + src/event_feed.js |
| T11 | Family of related encounters shares a cooldown | CE9 | src/chronicle.js + src/event_feed.js |
| T12 | Cap disruptive encounters per month | CE10 | src/game_time.js + src/chronicle.js |
| T13 | Milestone triggers a letter instead of another random popup | CE11 | src/data/skills.js + src/event_feed.js |
| T14 | Rare seasonal encounter needs the right month and place | CE12 | src/game_time.js + src/event_feed.js |
| T15 | Missed opportunity produces a successor rumor | CE13 | src/chronicle.js + src/event_feed.js |
| T16 | A warning arrives ahead of a timed market | CE24 | src/data/traders.js + src/game_time.js + src/event_feed.js |
| T17 | Threat left alone gets stronger but has a cap | CE16 | src/data/locations.js + src/game_time.js |
| T18 | A relic has a reseal or release center action | CE17 | src/data/locations.js + dialogue/center menu |
| T19 | An elder remembers how you handled an earlier obligation | CE18 | src/chronicle.js: existing villageElder + relationshipChange |
| T20 | Crafting tool failure leaves repair work | CE23 | src/crafting_recipes.js + Forging/Alchemy |
| T21 | Trade stock reflects the settlement and your reputation | CE25 | src/data/traders.js + src/components/trader_component.js |
| T22 | Health loss has a calendar cost shown before long work | CE19 | src/activities.js + src/chronicle.js |
