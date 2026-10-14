# Course and class gain tables

Shown in installed binary records, decoded passively. Course fields agree in base and both patch files. Names below are short record identifiers. No story prose or code is copied.

Source: `OfficialContent/data.bin`, `ContentModel/Clazz.LoadFromStream`, `ClazzSkill.LoadFromStream`; code: `GameLogic.dll/Academagia.GameSystems/ClazzSystem.cs`. All source paths are relative to the installed payload or the extract root specified in TOOLING.md.

## Course configuration

| Course | Final weight % | Style | Midterm day in month 12 | Final day in month 6 | Gain rows |
|---|---:|---|---:|---:|---:|
| Glamour | 90 | Distribution | 9 | 22 | 75 |
| Enchant | 95 | Distribution | 19 | 19 | 59 |
| Revision | 97 | Distribution | 2 | 13 | 75 |
| Astrology | 90 | Distribution | 17 | 16 | 74 |
| Incantation | 95 | Distribution | 3 | 20 | 75 |
| Negation | 99 | HybridDistribution | 10 | 12 | 77 |
| Calligraphy | 97 | HybridDistribution | 1 | 10 | 76 |
| History | 80 | Distribution | 8 | 17 | 79 |
| Arithmetic | 95 | Curve | 15 | 23 | 73 |
| Dialectic | 99 | Distribution | 6 | 15 | 58 |
| Geometry | 95 | Distribution | 5 | 11 | 56 |
| Zoology | 90 | Distribution | 13 | 25 | 58 |
| Rhetoric | 90 | Distribution | 16 | 18 | 62 |
| Music | 85 | PNP | 18 | 9 | 61 |
| Botany | 87 | HybridCurve | 4 | 24 | 77 |
| Grammar | 80 | Distribution | 12 | 8 | 80 |
| Athletics | 80 | PNP | 11 | 26 | 77 |

The previous 80–95% range was too narrow: the shipped range is 80–99%. There are 17 courses; the character initializer fills six, starting from college classes.

## Dated class step records

Each of 1,192 rows names a course, subskill and anchor date; every row has variance 3. At game initialization the engine chooses a weekday in the inclusive anchor ±3-day window. Attendance grants one step for every row assigned to that date. Multiple rows can collide. The resulting calendar is saved. This is randomized curriculum placement, not a new class-gain roll every day and not date-seeded RNG.

| Anchor month | Rows |
|---|---:|
| 1 | 147 |
| 2 | 150 |
| 3 | 144 |
| 4 | 149 |
| 5 | 136 |
| 9 | 155 |
| 10 | 150 |
| 11 | 161 |

No gain anchors occur in exam months 6 or 12, or summer months 7 or 8. The generic scheduler still offers weekday attendance based on weekday alone; zero gain anchors is a data fact, not proof that all class UI disappears. The full dated rows remain in the work area.

## Subskill allocation by course

Exact row counts, not earned levels. Attribute and train modifiers decide how many steps form a level.

| Course | Subskill | Step rows |
|---|---|---:|
| Glamour | Art Appreciation | 2 |
| Glamour | Concentration | 1 |
| Glamour | Cosmetics | 1 |
| Glamour | Court Hairstyles | 1 |
| Glamour | Courtly Fashion | 1 |
| Glamour | Ethics | 1 |
| Glamour | Forms | 1 |
| Glamour | Glamour Methods | 14 |
| Glamour | Glamour Phemes | 16 |
| Glamour | Glamour Spells | 14 |
| Glamour | Observation | 2 |
| Glamour | Painting | 1 |
| Glamour | Playfulness | 1 |
| Glamour | Practical Jokes | 1 |
| Glamour | Satyric Revelry | 1 |
| Glamour | The History of Magic | 1 |
| Glamour | The Middle Empire | 1 |
| Glamour | Theory of Glamour | 14 |
| Glamour | Theory of Negation | 1 |
| Enchant | Carpentry | 1 |
| Enchant | Concentration | 1 |
| Enchant | Glamour Spells | 1 |
| Enchant | Ink Compounds | 1 |
| Enchant | Jeweler | 1 |
| Enchant | Library Knowledge | 1 |
| Enchant | Materials Knowledge | 12 |
| Enchant | Memorization | 2 |
| Enchant | Music Theory | 1 |
| Enchant | Observation | 2 |
| Enchant | Painting | 1 |
| Enchant | Palettes | 15 |
| Enchant | Roots | 1 |
| Enchant | The History of Magic | 2 |
| Enchant | Theology | 1 |
| Enchant | Theory of Enchantment | 15 |
| Enchant | Theory of Incantation | 1 |
| Revision | Anatomy | 1 |
| Revision | Artisan | 1 |
| Revision | Concentration | 1 |
| Revision | Danger Sense | 1 |
| Revision | Duelling Circles | 1 |
| Revision | Endurance | 1 |
| Revision | Ethics | 1 |
| Revision | Forms | 1 |
| Revision | Glamour Phemes | 1 |
| Revision | Incantation Methods | 1 |
| Revision | Materials Knowledge | 1 |
| Revision | Revision Methods | 15 |
| Revision | Revision Phemes | 16 |
| Revision | Revision Spells | 16 |
| Revision | The History of Magic | 1 |
| Revision | Theory of Negation | 1 |
| Revision | Theory of Revision | 14 |
| Revision | Wit | 1 |
| Astrology | Alchemical Tools | 2 |
| Astrology | Cartography | 1 |
| Astrology | Clockwork | 2 |
| Astrology | Comets | 2 |
| Astrology | Courtly Fashion | 1 |
| Astrology | Famous Battles | 1 |
| Astrology | Geometric Laws | 1 |
| Astrology | Glamour Phemes | 1 |
| Astrology | Glamour Spells | 3 |
| Astrology | Moons | 15 |
| Astrology | Navigation | 1 |
| Astrology | Observation | 1 |
| Astrology | Planets | 13 |
| Astrology | Stars | 15 |
| Astrology | The Early Empire | 1 |
| Astrology | Theology | 1 |
| Astrology | Theory of Astrology | 13 |
| Incantation | Composure | 1 |
| Incantation | Coordination | 1 |
| Incantation | Danger Sense | 1 |
| Incantation | Diction | 1 |
| Incantation | Drafting | 1 |
| Incantation | First Principles | 1 |
| Incantation | Flawless Timing | 1 |
| Incantation | Forms | 1 |
| Incantation | Incantation Methods | 15 |
| Incantation | Incantation Phemes | 15 |
| Incantation | Incantation Spells | 15 |
| Incantation | Materials Knowledge | 1 |
| Incantation | Mimicry | 1 |
| Incantation | Observation | 1 |
| Incantation | Patience | 1 |
| Incantation | The History of Magic | 1 |
| Incantation | Theory of Incantation | 16 |
| Incantation | Theory of Revision | 1 |
| Negation | Concentration | 1 |
| Negation | Danger Sense | 1 |
| Negation | Diction | 1 |
| Negation | Ethics | 1 |
| Negation | First Principles | 1 |
| Negation | Flawless Timing | 1 |
| Negation | Forms | 1 |
| Negation | Incantation Phemes | 1 |
| Negation | Magical Appraisal | 1 |
| Negation | Negation Methods | 15 |
| Negation | Negation Phemes | 17 |
| Negation | Negation Spells | 15 |
| Negation | Observation | 1 |
| Negation | Palettes | 1 |
| Negation | Phemes | 1 |
| Negation | The History of Magic | 1 |
| Negation | Theory of Enchantment | 1 |
| Negation | Theory of Glamour | 1 |
| Negation | Theory of Negation | 15 |
| Calligraphy | Alchemical Tools | 1 |
| Calligraphy | Analyze | 1 |
| Calligraphy | Anatomy | 1 |
| Calligraphy | Art Appreciation | 2 |
| Calligraphy | Birds | 1 |
| Calligraphy | Chemistry | 1 |
| Calligraphy | Flowers | 1 |
| Calligraphy | Forms | 17 |
| Calligraphy | Illustration | 13 |
| Calligraphy | Ink Compounds | 14 |
| Calligraphy | Library Knowledge | 3 |
| Calligraphy | Mammals | 1 |
| Calligraphy | Memorization | 1 |
| Calligraphy | Orthography | 16 |
| Calligraphy | Painting | 1 |
| Calligraphy | Patience | 2 |
| History | Agriculture | 1 |
| History | Anthropology | 2 |
| History | Archaeology | 2 |
| History | Architecture | 1 |
| History | Art Appreciation | 1 |
| History | Bookbinding | 1 |
| History | Comets | 1 |
| History | Courtly Fashion | 1 |
| History | Decipher Handwriting | 1 |
| History | Ethics | 1 |
| History | Famous Speeches | 1 |
| History | Forms | 1 |
| History | Notation | 1 |
| History | The Calamities | 17 |
| History | The Early Empire | 15 |
| History | The History of Magic | 16 |
| History | The Middle Empire | 14 |
| History | Theology | 2 |
| Arithmetic | Accounting | 1 |
| Arithmetic | Administration | 1 |
| Arithmetic | Applications of Arithmetic | 13 |
| Arithmetic | Cryptology | 1 |
| Arithmetic | Famous Prose | 1 |
| Arithmetic | First Principles | 1 |
| Arithmetic | Identities of Arithmetic | 13 |
| Arithmetic | Logic | 2 |
| Arithmetic | Memorization | 4 |
| Arithmetic | Properties of Arithmetic | 15 |
| Arithmetic | Puzzles | 1 |
| Arithmetic | Reason | 4 |
| Arithmetic | Theory of Arithmetic | 15 |
| Arithmetic | Theory of Astrology | 1 |
| Dialectic | Civil Law | 1 |
| Dialectic | Conversation | 1 |
| Dialectic | Criminal Law | 1 |
| Dialectic | Debate | 1 |
| Dialectic | Famous Dilemmas | 15 |
| Dialectic | Famous Speeches | 2 |
| Dialectic | First Principles | 13 |
| Dialectic | Logic | 15 |
| Dialectic | Puzzles | 1 |
| Dialectic | Reason | 3 |
| Dialectic | Semantics | 1 |
| Dialectic | Storytelling | 1 |
| Dialectic | Temperance | 1 |
| Dialectic | The Middle Empire | 1 |
| Dialectic | Wit | 1 |
| Geometry | Applications of Arithmetic | 1 |
| Geometry | Cartography | 1 |
| Geometry | Duelling Circles | 1 |
| Geometry | Famous Battles | 1 |
| Geometry | Famous Geometry Problems | 15 |
| Geometry | Geometric Laws | 16 |
| Geometry | Knots | 1 |
| Geometry | Memorization | 1 |
| Geometry | Moons | 1 |
| Geometry | Planets | 1 |
| Geometry | Stars | 1 |
| Geometry | Trigonometry | 16 |
| Zoology | Anatomy | 1 |
| Zoology | Animal Husbandry | 1 |
| Zoology | Biology | 1 |
| Zoology | Birds | 15 |
| Zoology | Conceal | 2 |
| Zoology | Dance | 1 |
| Zoology | Illustration | 2 |
| Zoology | Insects | 15 |
| Zoology | Library Knowledge | 2 |
| Zoology | Mammals | 15 |
| Zoology | Painting | 1 |
| Zoology | Practical Jokes | 1 |
| Zoology | Seeds | 1 |
| Rhetoric | Acting | 1 |
| Rhetoric | Character | 15 |
| Rhetoric | Command | 1 |
| Rhetoric | Competition | 1 |
| Rhetoric | Composure | 1 |
| Rhetoric | Confidence | 14 |
| Rhetoric | Debate | 2 |
| Rhetoric | Dedication | 1 |
| Rhetoric | Ethics | 1 |
| Rhetoric | Etiquette | 1 |
| Rhetoric | Famous Speeches | 13 |
| Rhetoric | Flawless Timing | 1 |
| Rhetoric | Innuendo | 1 |
| Rhetoric | Oratory | 2 |
| Rhetoric | Passion | 1 |
| Rhetoric | Patience | 2 |
| Rhetoric | Persuasion | 1 |
| Rhetoric | Theatre | 1 |
| Rhetoric | Theology | 1 |
| Rhetoric | Wit | 1 |
| Music | Composure | 1 |
| Music | Decipher Handwriting | 1 |
| Music | Diction | 1 |
| Music | Famous Songs | 16 |
| Music | Forms | 2 |
| Music | Ink Compounds | 1 |
| Music | Intimidation | 1 |
| Music | Listen | 2 |
| Music | Mimicry | 2 |
| Music | Notation | 13 |
| Music | Oratory | 1 |
| Music | Prayer | 1 |
| Music | Revision Spells | 1 |
| Music | Tease | 1 |
| Music | Theatre | 1 |
| Music | Voice | 15 |
| Music | Wit | 1 |
| Botany | Agriculture | 13 |
| Botany | Birds | 2 |
| Botany | Chemistry | 1 |
| Botany | Courtly Fashion | 1 |
| Botany | Decipher Handwriting | 1 |
| Botany | Flowers | 13 |
| Botany | Greengrocery | 2 |
| Botany | Illustration | 3 |
| Botany | Ink Compounds | 1 |
| Botany | Library Knowledge | 2 |
| Botany | Observation | 2 |
| Botany | Palettes | 1 |
| Botany | Perfumes | 1 |
| Botany | Poisons | 2 |
| Botany | Recipes | 1 |
| Botany | Roots | 14 |
| Botany | Seeds | 16 |
| Botany | Worms | 1 |
| Grammar | Bluff | 1 |
| Grammar | Comets | 1 |
| Grammar | Etiquette | 2 |
| Grammar | Famous Battles | 1 |
| Grammar | Famous Poetry | 16 |
| Grammar | Famous Prose | 15 |
| Grammar | Famous Speeches | 1 |
| Grammar | Flirting | 1 |
| Grammar | Innuendo | 1 |
| Grammar | Memorization | 1 |
| Grammar | Oratory | 1 |
| Grammar | Reason | 1 |
| Grammar | Romance | 1 |
| Grammar | Semantics | 16 |
| Grammar | Storytelling | 1 |
| Grammar | Syntax | 14 |
| Grammar | The Exile | 1 |
| Grammar | The Second Captivity | 1 |
| Grammar | Theatre | 1 |
| Grammar | Theory of Astrology | 1 |
| Grammar | Wit | 2 |
| Athletics | Anatomy | 1 |
| Athletics | Competition | 15 |
| Athletics | Coordination | 2 |
| Athletics | Endurance | 5 |
| Athletics | Escape Artist | 1 |
| Athletics | Famous Battles | 1 |
| Athletics | Fish | 1 |
| Athletics | Flawless Timing | 2 |
| Athletics | Intimidation | 2 |
| Athletics | Navigation | 1 |
| Athletics | Passion | 1 |
| Athletics | Patience | 1 |
| Athletics | Playfulness | 1 |
| Athletics | Running | 14 |
| Athletics | Swimming | 14 |
| Athletics | Willpower | 1 |
| Athletics | Wrestling | 14 |
