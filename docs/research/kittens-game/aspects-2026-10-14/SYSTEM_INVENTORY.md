# System inventory

Counts are runtime base-table counts from the pinned source boot, not unlocked content counts or exhaustive subtable totals. Size signals are file lines where tables were not counted. Prior lane means RESEARCH_IDLE_GAMES.md; this dossier adds bounded coverage. No UI/player secret counts are proposed.

| System | Location | Size signal | Coverage |
| --- | --- | --- | --- |
| Resources and caps | `js/resources.js` | 60 resource rows | Feature F1/F2; cap and shared pool covered |
| Buildings, conversion, storage, housing, energy and pollution | `js/buildings.js` | 40 building rows | F2/F3/F4; most late buildings unread |
| Tech knowledge and unlock graph | `js/science.js` | 62 technology rows | F3 and A10 covered |
| Policy blocks and capacity-dependent effects | `js/science.js` | 64 policy rows | Initially undocumented in prior Kittens lane; deeper D3 now bounded |
| Manual recipes and engineers | `js/workshop.js` | 23 recipes | F1/F2/F4 covered; late recipes not exhaustive |
| Workshop upgrades and zebra upgrades | `js/workshop.js` | 143 base upgrade rows | Architecture/read for entry points; late content unread |
| Kitten population, jobs, skills, happiness, leaders and loadouts | `js/village.js` | 9 job rows | F2/F4; individual NPC behavior partial |
| Map, biomes, expeditions and combat | `js/village.js` | 13 biome rows | Undocumented deep combat paths |
| Trade races, embassies and diplomacy | `js/diplomacy.js` | 8 race rows | A01/A02 messages covered; trade math partial |
| Calendar, seasons, weather and random events | `js/calendar.js` | 1268 source lines | A02/A09 bounded |
| Offline time, acceleration, heat and shatter | `js/time.js` | 2791 source lines including queue | A04/A09 bounded; parity unread |
| Purchase queue and reordering | `js/time.js; js/jsx/queue.jsx.js` | 13 queue source categories | Initially undocumented in prior Kittens lane; deeper D1 now bounded |
| Religion, ziggurat and transcendence | `js/religion.js` | 3273 lines | Undocumented late content |
| Space missions and planet buildings | `js/space.js` | 1603 lines | Undocumented deep behavior |
| Prestige and reset carriers | `js/prestige.js` | 715 lines | Undocumented full reset behavior |
| Challenges and stacking rules | `js/challenges.js` | 1328 lines | Undocumented all challenge effects |
| Achievements and badges | `js/achievements.js` | 31 achievement rows | Inventory only; all conditions unread |
| Void processing | `js/void.js` | 76 lines | Inventory only |
| Statistics | `js/stats.js` | 246 lines | Inventory only |
| Read-only save preview | `js/preview.js` | 229 lines | Initially undocumented in prior Kittens lane; deeper D2 now bounded |
| Manager framework, buttons and tooltips | `core.js` | 2856 lines | F1/F3 covered |
| Game loop, save/migration, rate stacks and unlock dispatch | `game.js` | 6432 lines | A03/A04 bounded |
| UI state, themes, settings and toolbar | `js/ui.js; js/settings.js; js/toolbar.js` | 1197/392/241 lines | A06/A11 partial settings breadth |
| Resource, mid, toolbar, chiral and queue React views | `js/jsx/*.jsx.js` | 5 source modules | Resource view covered, others inventory |
| RNG helpers | `js/math.js` | 104 lines | A08 bounded |
| Localization and bootstrap | `i18n.js; index.html; res/i18n/*.json` | English full table privately retained | A01/A07 bounded |
| Telemetry, server/account bridge and cloud service | `game.js server/telemetry classes; server.json` | 2 service managers | Blocked all non-origin requests; account routes unexercised |
