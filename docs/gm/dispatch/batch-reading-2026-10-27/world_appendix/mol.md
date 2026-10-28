World: Mother of Learning (English source). Id prefix `mol`.

- Locators are `en bB cN pM` (always book 1): chapter N from the header, paragraph M from the `pM:` line. The card's `zh 第N章 pM` form does not apply.
- The `zh` field holds the name exactly as printed in English; titles alone are not names.
- Structure: the story repeats one month. When the shard shows a restart, record it: write `date.value` as `L<n>-D<d>` (restart count n as far as the shard shows it, day d of the month counted from the start of the month) and put what carried over and what reset in `outcomes` or `knowledge`. If the restart count is not clear, use label `U` and say so in the note. Knowledge the lead keeps across a restart is still `knowledge` with `change: gained`.
- Money and measures: record the units as the text gives them; do not convert.
- Kinds: spells, shaping skills, soul magic and rituals are `rules` rows (kind `spell`, `ability` or `rite`, the book's own term in `worldKind`); the Academy, guilds and houses are `organization`; magical creatures use census kind `creature`.
- Lead: Zorian Kazinski (`pov: lead`). Scenes from another person's view are not lead scenes; record their people, places and facts in census, people and texture.
- In a scene's `touched`, a spell, potion or ritual uses its rule kind (`spell`, `potion`, `rite`, `ability`), never `rules`.
