# Batch: companions, relationships and creatures (itch.io decode wave, 2026-10-22)

Brief: [DECODE_BRIEF](DECODE_BRIEF.md). Topic: how bonds remember events, how
creatures carry needs and goals, and how traits inherit or mutate. Everything
below is a proposal (AD32), not an accepted decision. Private notes with URLs,
sizes, hashes and line locators: `private/BATCH_COMPANIONS_NOTES.md` and
`private/<slug>/`.

**Dedupe.** YAIR already holds a deep palette: the
[companions core audit](../../audits/COMPANIONS_CORE_AUDIT.md) (C1-C16), the
[companion palette](../../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md)
(temperament shaped by life, small memories, offline raising with mercy, pocket
ranch) and [genetics and brood play](../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md)
(G1-G51: dormant traits, close-kin risk GN7, pedigree, testing as defence).
YAIR `src` has `companion_roster.js` and `relationship_view.js` only; no
genotype, pedigree or bond-ritual code (grep). So most findings are
*concrete rule shapes and numbers* for ideas the palette states in prose.
No title below appears in any `docs/` file or earlier batch (grep, `private/`
skipped); Tamer Guild and Spirit Beasts appear only as palette references.

## Screened (about 110 listed, 30 considered; tag pages monster-taming, virtual-pet, breeding, relationship, companions)

**D** = decoded.

- **D** DRGN (Mikolaj Wicher, Godot): dragon sanctuary, bonds, memories, genetics. Polish with English strings.
- **D** Grim Brood (Spirevale): monster ranch, plain-JS genetics, villagers with wishes.
- **D** BEASTBLOOM: BLOODLINES (sasbyxan): gene families, breeding intent, auto battles.
- **D** LureField (tf01048594): farm, catch, breed, creatures that work and go on trips.
- **D** PITBULL COLISEUM (YKYM): you are the dog; lifespan is an action budget; blood is inherited.
- **D** Monster Ranch: Crossbreed! (Sunday Plugins, RPG Maker MZ): 3x3 parents, one raised year.
- **D (names only)** Cat Cove Inn (Loaf Labs, Unity): fostering, per-cat relations, rehoming to owners.
- **D (sibling, not traced)** Spiretoon Park (Spirevale): same engine as Grim Brood (its genetics.js header says so).
- Checked, not decoded: princi-pal (itch page is an egg wrapper that opens a Next.js site), Racing Pigeons (Blazor/.NET), Murong Yi's Celestial Pet Zone (Ren'Py web, xianxia pet VN), Greyhound Dynasties and Beanlings Wildlands (no HTML5 iframe found on the page), Dungeon Calamity (pets that evolve, plain dungeon crawler).
- Seen, not opened (listing only): Tamaweb, Pixel Monster, KittyToy, Mothkeeper (itch 429), Goldfish Husbandry, Cat Breeding Simulator, Monster Recombinator, Breaking Rat, Neuro-Sama Tutel Rancher, Sunny Spot Breeders, Blob Ranch, Shrimp Raising, Hachiko, Pocket Pet Day Care, Beast Keeper, Echolon, Tamer Guild (paid), Spirit Beasts, Omnissey, Hamster Simulator, Fishsie, SHOALKEEPER.
- Relationship tag (373 hits) is mostly visual novels and interactive fiction with no system to read; none opened.

## Verdicts

| Game | Worth playing? | The one thing play should confirm |
|---|---|---|
| DRGN | Yes, first | Whether the bond rite feels like a relationship (scene text per temperament) or a once-per-cycle stat button |
| Grim Brood / Spiretoon | Yes, 15 minutes | Whether reading a hide (what the coat shows, what testing reveals) actually guides pairing |
| BEASTBLOOM | Yes, one breed cycle | Whether the "intent" nudge plus the genetic-visibility research unlock make hidden genes a pleasant chase |
| LureField | Short look | Whether creature trips and farm chores read as companions with jobs or as production queues |
| Pitbull Coliseum | Five minutes | Whether action-budget lifespan plus chosen inherited trait feels like a short life that matters |
| Monster Ranch | Yes, it is 15-20 minutes | Whether the pairing dice plus weekly planning give the baby a personality or just stats |
| Cat Cove Inn | Maybe | Whether trait-to-owner matching is a real puzzle |

## Per-game findings

### DRGN (Godot 4.7 pck, compiled GDScript; readability: engine-compiled, fully decoded)

Build: Godot web export, `index.pck` 4,137,020 B, seven scripts decoded with the project tool
(0 errors; the pack header is v4, so the pack was split with a small ad hoc parser). Alpha, single-player,
AI used for code, art and text per the page. No license stated (ideas only).

- **Systems (source).**
  - *Heritable temperament picks the bond rite.* Eight temperaments (proud, spiteful, timid, curious, lazy,
    calculating, attached, wild). Each offers exactly two evening options out of three (activity, quiet, care).
    The temperament's preferred option gives bond +7 and happiness +6; the other gives +4 and +3. A dragon takes at
    most one full evening per five-day cycle, and the keeper has two evenings per cycle. (game_state.gd 885-931, 1827-1832)
  - *Scenes become memory.* Each evening writes a templated scene (action, plus a reaction that depends on whether
    the rite suited it, with hand-written special cases such as the spiteful one waiting for you to catch up). The
    text is appended to the dragon's own memory list, capped at 12, oldest dropped. The same list gets injury
    healed lines, departure and binding lines. (1835-1851, 1866-1872)
  - *Temperament and body inherit.* A hatchling takes color, pattern, eyes, horns and size from one of four
    candidate alleles per trait (each parent's shown gene and carried gene), an 8 percent reroll from the pool,
    temperament from either parent, and averaged immunity, fertility, mutation rate and rarity with noise. (1507-1526)
  - *Genes set how long it stays.* Departure age comes from immunity, size and mutation rate, clamped 48-76, plus 0-5
    days at hatch. Old dragons leave for the wild at that age unless bound. (1659-1677, 1569)
  - *Binding a dragon to the line.* Only old dragons; price grows with generation and breeding value; one "line
    mother" at a time (binding another demotes the previous); a bound dragon never leaves. (1147-1176)
  - *Work contracts read the creature.* Four contracts (caravan, forge, night scout, courier) score size, color,
    immunity, temperament and bond, and return human-readable reasons ("dark scales help at night", "lazy
    temperament lowers the pace"). Injury risk and bond thresholds (courier needs bond >= 35 for a bonus) feed in. (1704-1785)
  - *Quirk from the seed.* A per-dragon idle quirk line is chosen by hashing its visual seed. (1853-1864)
- **Stated-not-found.** Market demand and reputation text on the page; I read functions for sale and
  appraisal prices but did not trace the demand curve.
- **Representations.** Forecast with reasons before committing a work contract; a genealogy canvas script
  and a separate visual-genetics shader (dragon_genetics.gdshader) draw phenotype from the genotype.
- **Improvements.** Save version constant (3) and `_normalize_dragon` migrate old saves.
- **YAIR mapping.**
  - Bond rite chosen by temperament with a preferred and a second-best option: palette has "temperament shaped by
    life" (FC) and micro behaviour; no code. Owner: companions palette + `src/companion_roster.js`. Default/dial:
    the preference is the default; a dial lets a companion's recent events override it.
  - Capped memory list of generated scene lines: palette DD (small memories) states it; this is a 12-line ring with
    typed sources. Maps to the chronicle/lore history (AD codes in RULES_INDEX for chronicle).
  - Departure as lifespan by genes unless a costed rite prevents it: companion palette B-rows and heir inheritance
    (`src/heir_inheritance.js`) have succession, not a "leaves for the wild" exit; it supplies the
    followers-who-leave beat.
  - Explained forecasts for assignments: household staff (`src/home_staff.js`) would be the consumer (grep: no
    reasons text for job fit found).
  - License: none stated, ideas only.

### Grim Brood (plain JS, 28 script files; Spiretoon Park uses the same engine)

Build `19809240`, `index.html` plus `js/*.js`, unminified, comments explain intent. Demo, in development. No license stated.

- **Systems (source).**
  - *Mendelian loci with two awkward genes.* Seven loci (base color, dilution, spots, pattern, albino, melanism and a
    "mythic" locus). The mythic allele and the spot gene are "fickle": passed on only half the time even when
    present. Lucky parents triple mutation. (genetics.js ~60-80)
  - *Real inbreeding.* Pedigree kinship by the recursive method; inbreeding subtracts vigor and fertility from
    child stats by `coi * 45` and raises the chance of bad traits by `coi * 0.55`. Every animal ever kept stays in a
    registry so a four-generation pedigree can go back to founders. (genetics.js kinship, lineage.js)
  - *What you can see of a genotype.* The player sees only what the phenotype shows (a dominant-looking coat shows
    one known allele and a "?"); a test reveals the rest. (genetics.js knownFromPhenotype)
  - *One leader per kind.* A monster with high stats and no bad traits becomes Alpha (+8 all stats); only one Alpha
    per kind, the next-best rises when it is gone. Elders grow calmer and fiercer. (forms.js)
  - *Mood as an itemized list.* Happiness is a base plus named modifiers (loves its floor, lonely with no kin,
    short temper, sick, filthy lair) each added with a label, so the UI can list reasons. (sim.js ~123-161, care.js 183-192)
  - *Villagers with wishes.* Each cottage houses two; wishes are predicates (a lantern near my door, to see a species
    on the grounds, no sick monsters); neighbours never share an identical wish; a granted wish gives joy, rent and
    reputation; two nights under joy 22 and they leave. High joy occasionally brings gifts. (village.js 19-110)
  - *Chronicle from a register.* Records and hall of fame computed from the register on open, not stored. (lineage.js)
- **Representations.** Hand-drawn canvas UI, ribbons and show classes, collection book keyed by English hide name.
- **Improvements (comments).** A migration hook exists for ranches that had several Alphas per kind.
- **YAIR mapping.**
  - Kinship/inbreeding math: palette GN7 names the dial; a 20-line recursive kinship is the missing implementation.
    Owner: genetics doc + `src/heir_inheritance.js`.
  - Phenotype-only knowledge with a test to reveal: palette cites "testing is the defence" (GD2, OB4); exposure ledger
    (CO4, AB2) is the owner.
  - Single leader per kind: no YAIR analogue; a household "head companion" slot is a candidate.
  - Itemized mood: UI rules (UR codes) on showing reasons; consumer is `relationship_view.js`.
  - Wishes as predicates: household staff and companions could carry one wish each with the "no duplicate among
    neighbours" rule; no code in `src` (grep "wish" found none in runtime files).

### BEASTBLOOM: BLOODLINES (Vite bundle 805,187 B, minified; pretty-printed)

Demo, in development, Aseprite art, no license stated, Steam version planned.

- **Systems (source).**
  - *Eight gene families* (vitality, power, tempo, guard, affinity, instinct, signature, form). Each allele has an
    expression type: dominant, recessive, variable, mutated, ancestral. Expression is resolved per family; a
    "dormant" list keeps the hidden allele; an ancestral allele expresses fully only when homozygous or when
    inherited from an ancestral source. (pretty.js 526-528, 1040-1072)
  - *Breeding intent.* Five intents (preserve, combine, mutate, hybridize, discover) with different gold and
    essence cost. Preserve biases a chosen family toward the parent's stronger allele (0.7 vs 0.3); combine raises
    cross-pair mutation chance by 15 points when both parents carry strong alleles; a focus pick forces one parent's
    best allele for one family. (4666-4672, 4725-4742)
  - *Hybrids unlock from clues.* Each hybrid has a "revealed by" sentence in the world ("a wolf of frost and a fox of
    flame, their coats might share both") and fixed parent pairs. (line 564)
  - *Visibility is a research purchase.* "Genetic Visibility I" shows which parent passed each trait; II shows allele
    pairs and predicted inheritance percentages; the breeding screen previews offspring chances in bands from
    guaranteed to possible. (573)
  - *Personality as a combat nudge.* Eight personalities, each a small targeting or defence bias (Loyal prefers enemies
    attacking its allies, Cautious watches wounded friends, Proud picks healthy opponents), plus an idle animation tag. (625)
  - *Modifiers on a dungeon floor.* "Genetic Eclipse" suppresses recessive genes; "Gene Surge" doubles one family. (582)
- **Stated-not-found.** Full predicted-percentage code beyond the per-gene probability helper.
- **Improvements.** Tutorial-ish quest list teaches one breeding concept per step ("breed a child that inherits a
  parent's selected Tempo allele").
- **YAIR mapping.** Palette G18 (genetics with real texture), G29 (mixing lines), G49 (tools the player sees):
  the intent-as-nudge pattern is new as a *player-facing control*; expression types map to the
  "expression versus possession" row (line 77). Owner: genetics doc; no `src` code. Personalities as small
  behaviour biases match the companion palette's "verbs that change as it grows".

### LureField (Vite bundle 395,123 B; pretty-printed)

In development, no license stated.

- **Systems (source).** Breeding takes the better parent's rating 35 percent of the time, else a random parent's;
  then +1 with 15 percent and -1 with 8 percent, floored by rarity; shiny parents multiply shiny chance by 4;
  both parents then sit in a 6 game-hour cooldown. Farm pets and expedition crews are removed from the team.
  Expeditions pay from elapsed hours times crew size with a level factor and a capped chance of rare items, an egg
  and creature XP, so a creature away comes home with a story-sized return. (pretty.js 389, 1736-1757, 2116-2130)
- **YAIR mapping.** Companion palette J4 (pocket ranch), V3 (offline raising with mercy) cover the loop; the
  numbers are ordinary. Low value beyond confirming the shape.
- License: none stated.

### PITBULL COLISEUM (single plain HTML 1,483,380 B, prototype)

- **Systems (source).** One dog lives a fixed count of actions (28 plus a legacy bonus); every training, work,
  meal, sleep and fight spends it. On death the player chooses up to a cap of abilities to inherit; the cap rises by
  one every three generations (max 4); the legacy adds +1 to all starting stats and +2 lifespan, each capped; the
  last 12 generations are kept. (index.html 779-800, 1119-1150)
- **YAIR mapping.** Heir inheritance owners (`src/heir_inheritance.js`, AD codes on prestige). The new bit is the
  *growing carry cap* by generation count. Small.

### Monster Ranch: Crossbreed! (RPG Maker MZ; plugin plain, events in JSON)

- **Systems (source).** The pairing is 3 fathers x 3 mothers (fire, water, wind) giving six species with young and
  adult forms; the dice set a baby talent; weekly activity plan for 24 weeks through a generic raising plugin
  (stats with ranks, activity success rate, forecast, period names); snacks change a stat or the "love" stat
  (+12 from a brush); the ending title depends on love. (CommonEvents.json events 1, 8, 10, 14; SDY_Raising.js)
- **YAIR mapping.** Weekly plan with success rate and rank-up lines is the same as the DRGN planning cycle.
  Plugin says "this copy for this game only, do not reuse": ideas only.

### Cat Cove Inn (Unity WebGL, IL2CPP; names only)

Not decompiled. Metadata strings show types for cats (`CatAI`, `CatData`, `CatHunger`, `CatRelationship`,
`CatState`), two trait slots per cat, fullness and entertainment values with neutral and happy thresholds, relations
with increase and decrease amounts, and a `RehomeManager` that generates owners, can rig a trait for a tutorial,
reshuffles owners on a timer and records rehomed cat names and types. Mechanics are `stated-not-found` beyond names.

## Top findings

1. **Temperament decides which bond action works; scenes become capped memory** (DRGN). A concrete rule:
   preferred rite = double bond gain, one rite per creature per cycle, a templated scene appended to a 12-line
   memory. Cheap, readable, and it makes "how relationships remember events" visible. Owners: companion palette
   FC and DD; `src/companion_roster.js`. [source]
2. **Leaving as a gene-driven clock with a costed bind** (DRGN). Companions or brood leave at an age set by
   immunity/size/mutation; a rite binds one forever, one "line mother" at a time. Adds the missing
   "followers who leave" beat to inheritance. [source]
3. **Recursive kinship with stat and trait penalties, plus phenotype-only knowledge** (Grim Brood). Turns palette
   GN7 into ~20 lines and a visible testing step. [source]
4. **Breeding intent as a nudge, and expression types incl. ancestral** (BEASTBLOOM). Player picks a goal
   (preserve, combine, mutate, hybridize, discover) with different costs; hidden genes surface under rules that
   the UI previews in probability bands. [source]
5. **Wishes as predicates, with neighbour de-duplication and leave-after-two-bad-nights** (Grim Brood villagers).
   A small goal engine for household members that acts without scripting. [source]

## Verification

Read: DRGN game_state.gd lines 1-60, 885-935, 1147-1177, 1507-1526, 1659-1680, 1704-1760, 1827-1873 (decoded from
bytecode); Grim Brood genetics.js (lines 1-230), forms.js, lineage.js, village.js in full, grep of care.js and
sim.js; BEASTBLOOM pretty.js excerpts (526-534, 564, 573, 625, 1040-1075, 4660-4760); LureField pretty.js 389-398,
1730-1760, 2116-2130; Pitbull index.html 759-800, 1119-1150; Monster Ranch common events summary and plugin header;
Cat Cove Inn metadata strings only. Not read: Spiretoon Park beyond its header, DRGN main.gd and
market code, BEASTBLOOM battle code, all VN titles, Racing Pigeons, Greyhound Dynasties. Not run: any game code.
Tools: esbuild as pretty-printer; project `decode_gdc.py` for GDScript; ad hoc pck v4 splitter (the shared
`extract_pck.py` supports only embedded v3 packs); about 60 tool calls, itch page requests spaced at least 5 s,
one HTTP 429 (Mothkeeper, not retried).
