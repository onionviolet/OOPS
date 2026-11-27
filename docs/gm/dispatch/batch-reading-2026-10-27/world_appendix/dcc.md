World: Dungeon Crawler Carl (English source; eight books, each numbered 1-N and carried as book B in the shard header). Id prefix `dcc`.

- Locators are `en bB cN pM`: book B and chapter N from the chapter header, paragraph M from the `pM:` line. The card's `zh 第N章 pM` form does not apply.
- The `zh` field holds the name exactly as printed in English. Titles, nicknames, class names and ranks a person earns are `aliases` of that person.
- Numbers and units (levels, stats, points, money, ranks, tiers) are recorded as printed with the locator, never converted or inferred from power shown.
- System text is printed rules text: record every system notification, stat or status screen, class, skill, title, race or evolution description, level-up, point allocation, reward box, quest, rule-change announcement and cost or limit exactly as printed, with its locator and its numbers. Classes, skills, spells and the lead's special abilities are `rules` rows (kind `ability`, `spell` or `rite`, the book's own term in `worldKind`); gear and consumables are census `item`; groups, guilds, factions and teams are `organization`; cities, buildings, dungeons and realms are `place`; monsters and beasts use census kind `creature`.
- Lead: Carl, the viewpoint character of book 1 (his cat companion Princess Donut is a second main character) (`pov: lead`). Chapters seen through another person are not lead scenes; record their people, places and facts in census, people and texture.
- In a scene's `touched`, an ability, spell or rite uses its rule kind (`ability`, `rite`, `spell`), never `rules`.
