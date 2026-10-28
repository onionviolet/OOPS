World: You Are Summoned (English source; five books, `book` is the volume number; chapter 0 of book 1 is its Introduction). Id prefix `yas`.

- Locators are `en bB cN pM`: book B and chapter N from the chapter header, paragraph M from the `pM:` line. The card's `zh 第N章 pM` form does not apply.
- The `zh` field holds the name exactly as printed in English. Titles, nicknames, cape or class names and ranks a person earns are `aliases` of that person.
- Numbers and units (money, levels, ranks, stats, tiers) are recorded as printed with the locator, never converted or inferred from power shown.
- Kinds: powers, skills, classes, spells and the lead's special ability are `rules` rows (kind `ability`, `spell` or `rite`, the book's own term in `worldKind`); gear and consumables are census `item`; groups, guilds, factions and teams are `organization`; cities, buildings, dungeons and realms are `place`; monsters and beasts use census kind `creature`.
- Lead: Rico (`pov: lead`; first person).. Status screens and contract or summoning terms are printed rules text: record them with their locators.
- In a scene's `touched`, an ability, spell or rite uses its rule kind (`ability`, `rite`, `spell`), never `rules`.
