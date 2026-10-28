World: Harry Potter (English source, book 1 unless the header says otherwise). Id prefix `hp`.

- Locators are `en bB cN pM`: book B and chapter N from the chapter header, paragraph M from the `pM:` line. The card's `zh 第N章 pM` form does not apply to this book.
- The `zh` field holds the name exactly as printed in English. A title alone ("the Professor", "Uncle") is not a name; record the person under their name and keep the titled form in `aliases`.
- Money: Galleon (gold), Sickle (silver), Knut (bronze); 17 Sickles to a Galleon, 29 Knuts to a Sickle. Muggle money is pounds and pence. Units: `galleon`, `sickle`, `knut`, `pound`, `penny`.
- Calendar: the school year runs from 1 September to the summer; record stated dates and days of the week as given, term events (Halloween, Christmas, exams) as anchors. The year is not printed in book 1: leave it out rather than guess.
- Kinds: spells and charms are `rules` rows of kind `spell` (incantation in `worldKind`, wand movement and effect in `steps`); potions are kind `potion` with ingredients as `inputs`; magical creatures use census kind `creature`; the four Houses and the Ministry are `organization`.
- Lead: Harry Potter (`pov: lead`). Chapters seen through another person (for example the opening chapter) are not lead scenes; record their people, places and facts in census, people and texture.
- In a scene's `touched`, a spell, potion or ritual uses its rule kind (`spell`, `potion`, `rite`, `ability`), never `rules`.
