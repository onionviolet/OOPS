World: The Menocht Loop (English source; six books, chapters numbered 1-N inside each). Id prefix `mnl`.

- Locators are `en bB cN pM`: book B and chapter N from the chapter header, paragraph M from the `pM:` line. The card's `zh 第N章 pM` form does not apply.
- The `zh` field holds the name exactly as printed in English. Titles, nicknames, class names and ranks a person earns are `aliases` of that person.
- Numbers and units (levels, stats, points, money, ranks, tiers) are recorded as printed with the locator, never converted or inferred from power shown.
- System text is printed rules text: record every system notification, stat or status screen, class, skill, title, race or evolution description, level-up, point allocation, reward box, quest, rule-change announcement and cost or limit exactly as printed, with its locator and its numbers. Classes, skills, spells and the lead's special abilities are `rules` rows (kind `ability`, `spell` or `rite`, the book's own term in `worldKind`); gear and consumables are census `item`; groups, guilds, factions and teams are `organization`; cities, buildings, dungeons and realms are `place`; monsters and beasts use census kind `creature`.
- Lead: the viewpoint character of book 1 (name as printed in the text) (`pov: lead`). Chapters seen through another person are not lead scenes; record their people, places and facts in census, people and texture.
- In a scene's `touched`, an ability, spell or rite uses its rule kind (`ability`, `rite`, `spell`), never `rules`.
