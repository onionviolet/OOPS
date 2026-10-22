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
- Gap pass added: Greyhound Dynasties, Racing Pigeons (ILSpy), Dungeon Calamity, princi-pal (server-side), Celestial Pet Zone (Ren'Py), Mothkeeper (no genetics); see "Gap pass additions". Beanlings Wildlands is account-gated on its own site.
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

## Gap pass additions (2026-10-22, second read)

Closing the "not read" items above found more. Same rules: static reads, proposals only.

### DRGN, rest of `game_state.gd` and `main.gd` (source; decoded)

- *Eggs know the keeper.* Spending one evening beside an egg ("watching" it) makes the hatchling start with bond 11
  instead of 5 and a first memory line that it knew the keeper's voice before hatching. (game_state.gd 828-846, 1534-1566)
- *Incubation is a three-way trade.* Natural heating hatches a day later with health +5 and stress -4; stable is neutral;
  intensive is a day sooner with health -6 and stress +8. Locked once incubation starts. Base incubation 3-8 days from size,
  rarity, mutation and immunity. (805-826, 1534-1536, 1642-1657)
- *Knowledge is bought in tiers.* Appraisal level 1 (10 coins) shows the market offer, level 2 (22) a breeding score, level 3
  (45) a genetic test that reveals carried genes. (1011-1037)
- *Market has a rotating mood and a saturation counter.* A four-phase focus rotates every cycle (colors, working
  dragons, breeders' lines, quiet); each phase adds up to about 16-18 percent to price for the matching gene; every sale adds saturation that cuts
  price (up to 45 percent) and decays one point per cycle; line prestige and reputation add up to 18 and 10 percent. (1178-1262)
- *Creatures decide for themselves at the edge.* An exhausted working dragon swaps itself to rest and the event line says so. (511-545)
- `main.gd` is UI only (78 functions: farm, breeding, incubator, market, genealogy, tutorial, hatch-reveal tween). Nothing further for mechanics.

### Greyhound Dynasties (Vite bundle 601,772 B; HTML5 on the itch page, GitHub README also exists but returned 404, so not read)

Readability: minified, pretty-printed (14,256 lines); build `18309949-1850252`. No license stated.

- **Continuous polygenic traits with regression and disagreement.** Eleven racing and health traits. A pup's trait is 55 plus 0.82 times
  (parent mean minus 55), scaled noise that shrinks as parents differ less (up to 42 percent), and a shared per-group wobble so related
  traits (pace group, stamina group, bend and temperament group) drift together. (pretty.js 8325-8350)
- **Inbreeding narrows variance and adds named penalties.** Coefficient up to 0.5 shrinks all noise (by 1.3x to 1.4x of the coefficient) and, above 0.06,
  can subtract from fertility, injury resistance and longevity with probability 0.9 times the coefficient; a tier label (none... severe)
  shows the impact. (8341-8350, 8449)
- **Major genes** (explosive break, deep stamina, fragile frame, late maturer, iron constitution): inherit with 0.82 if both parents carry,
  0.48 if one, 0.012 or 0.008 otherwise. (8352-8355)
- **Pairing "nick" score.** A compatibility number (20-95) from complementary strengths (one parent covers the other's weak traits),
  shared weaknesses (penalty), matching preference, mean temperament, and pairings of major genes (deep stamina with explosive break +5), with
  plain-language lines ("strong nick", "balanced cross"). Litter size 1-5 from fertility, dam brood quality and sire potency; conception chance
  from fertility state minus inbreeding. (9392-9420, 9279)
- **Rival kennels are personalities.** Archetype records (The Masters: elite blood, no cash, will not gamble) with weights for racing aggression,
  commercialization, dynasty acquisition and cash reserve drive their stud, sale and purchase choices. (8492-8530, 8640)
- YAIR mapping: the genetics doc's G46-G48 (population heredity, generated bodies); household and rival houses
  (`src/home_staff.js` is the only analogous consumer). The variance-shrinks-with-kinship shape is the reusable bit. [source]

### Racing Pigeons: Loft and Legacy (Blazor/.NET; webcil assemblies unwrapped and decompiled with ILSpy; source-level)

Polish UI, free browser sim. No license stated. `RacingPigeons.Core.wasm` was re-wrapped as a PE and decompiled.

- **Trait = sum of 8 four-level alleles per haplotype.** Each trait has 8 loci per haplotype with values 0-3; potential = (sire haplotype sum + dam haplotype
  sum) / 48 x 100, plus special-gene effects. Gametes pick each locus from a random parent haplotype and mutate +/-1 at 0.002 per locus. (Genetics/Genome.cs)
- **Five special genes that only act when both haplotypes carry them** (compass +12 orientation, iron lungs +10 endurance, weak heart -15 endurance and -5 speed,
  infertility -40 fertility, fragile -15 resilience); the code exposes "expression chance" as the product of the two parents' copy fractions, which is how a
  carrier-pair preview can be shown. (SpecialGenes.cs, Genome.ExpressionChance)
- **Breeding value is progeny-tested.** A bird's value is the average quality of its recorded offspring minus the population mean, plus their podiums
  and prestige. (Breeding/BreedingValue.cs)
- **Hatch odds.** Base 0.35, plus fertility bonus 0.6, minus inbreeding penalty 0.8; two eggs a clutch. (BreedingRules.cs)
- Also in the build (names, not traced): auctions, vaccination and season disease, lost birds per race, rival fanciers with skill and greed. (utf-16 strings, class list)
- YAIR mapping: G18 and G46; progeny-tested value is a clean answer to "how does the world judge a line" (bloodline prestige rows). [source]

### Cat Cove Inn, Il2CppDumper pass plus asset strings (names, fields, flavour text; method bodies not recovered)

Il2CppDumper (project toolset) ran against `WebGL.wasm` and `global-metadata.dat` (dump.cs, 11 cat types, `CatData`
fields: relationship value list, portraits, names). Rehoming UI has failed/success response lists, owner portraits and a trait-request
text list; the owners ask in flavour text ("I work long hours", "I can't have a pet that's too loud", "a cat that's always ready to tussle") rather than naming a trait. Each named cat has four
relationship-tier lines from wary to devoted, the top one ending in a gift. Numbers (tier thresholds, relation steps) live in serialized assets
that need type trees; not recovered (stated-not-found). (private/cat-cove-inn/asset_strings.txt)

### Spiretoon Park (engine shared with Grim Brood; additions only)

Trait table with a spontaneous rate per trait (good and bad), transmission 0.55 when both parents carry and 0.22 when one does, cap 4 traits; staff roles
(farmhand, stockman, vet, guide) with wages; a ranch dog companion that follows the rancher, herds loose animals home and chases foxes; a visiting
critic and a merchant who leaves at midnight; workshops that turn produce into goods at midnight. (index.html 836-856, 1013-1020, 2454-2470)

### Small reads

- *BEASTBLOOM preview is a sampled simulation.* The preview runs the real breeding function 400 times with derived seeds and reports species odds, mutation odds and trait
  odds as bands (guaranteed, likely, possible, unknown); habitat multiplies chosen mutation chances by 2.5 and a catalyst by 3; a "guaranteed surprise" rule
  forces one recessive trait or a form mutation when a breed would otherwise show nothing new. (pretty.js 4826-4850, 4915-4925)
- *Dungeon Calamity.* Taming is a chance per bait: 30 percent any, 45 lure, 70 percent with the beast's favorite food; pets are stat blocks with
  collars (+25 HP, +8 ATK, +10 percent absorb) and a kennel. No bond. (index.html 7963-7975, 8055-8100)
- *princi-pal.* The client posts the player's free-text advice to a server route and receives updated personality, six moral stats (dominance, compassion,
  devotion, ego, purity, retribution) and evolution ids. The judging is server-side. (private/princi-pal/pretty.js 85-130)
- *Celestial Pet Zone.* Ren'Py script strings show three egg types, a pet happiness level (happy to very unhappy) that selects the hatch/care scenes, and a release scene.
  Thin.
- *Mothkeeper* (Construct 3, `data.json` 1.6 MB): no gene, breed, trait or mutation strings; herbs feed moths. Not a breeding game.

## Verification

Read: DRGN game_state.gd lines 1-60, 885-935, 1147-1177, 1507-1526, 1659-1680, 1704-1760, 1827-1873 (decoded from
bytecode); Grim Brood genetics.js (lines 1-230), forms.js, lineage.js, village.js in full, grep of care.js and
sim.js; BEASTBLOOM pretty.js excerpts (526-534, 564, 573, 625, 1040-1075, 4660-4760); LureField pretty.js 389-398,
1730-1760, 2116-2130; Pitbull index.html 759-800, 1119-1150; Monster Ranch common events summary and plugin header;
Cat Cove Inn metadata strings only (first pass; the gap pass added Il2CppDumper output and asset strings). Not read after the gap pass: see the Gap ledger. Not run: any game code.
Tools: esbuild as pretty-printer; project `decode_gdc.py` for GDScript; ad hoc pck v4 splitter (the shared
`extract_pck.py` supports only embedded v3 packs); about 60 tool calls, itch page requests spaced at least 5 s,
one HTTP 429 (Mothkeeper, not retried).

## Gap ledger

| Gap | Status | Evidence or locator |
|---|---|---|
| Spiretoon Park not traced | closed (additions only; core is Grim Brood's engine) | index.html 836-856, 1013-1020, 2454-2470 |
| DRGN `main.gd` and market code | closed (main.gd is UI; market, incubation, appraisal read) | game_txt/game_state.gd 805-846, 1011-1037, 1178-1262 |
| princi-pal | server-side (judging is a server route; client read) | private/princi-pal/pretty.js 85-130 |
| Cat Cove Inn logic | closed at field and text level; method bodies and numeric tier thresholds unreadable without type trees (needs play) | private/cat-cove-inn/dump/dump.cs 223250-224560, asset_strings.txt |
| BEASTBLOOM predicted-percentage code | closed | pretty.js 4826-4850, 4915-4925 |
| BEASTBLOOM battle code | low value: auto-battle combat, not bonds | not opened |
| Racing Pigeons | closed (webcil unwrapped, ILSpy; Core assembly read for genetics and breeding; AI fancier and market classes listed, not read) | private/racing-pigeons/il/RacingPigeons.Core.* |
| Greyhound Dynasties | closed (bundle read for genetics, pairing, AI profiles); GitHub README returned 404 | private/greyhound-dynasties/pretty.js 8325-8530, 9392-9420 |
| Beanlings Wildlands | server-side and account-gated (no sign-up made); only the public form-rules script exists | private/beanlings-wildlands/ |
| Mothkeeper (429 earlier) | closed, low value: no genetics | private/mothkeeper/data.json |
| Murong Yi's Celestial Pet Zone | closed, low value: short VN, three pets and a happiness enum | private/xianxia-pet-zone/rpy/game/*.strings.txt |
| Dungeon Calamity | closed, low value: bait odds and pet stat blocks | private/dungeon-calamity/index.html 7963-8100 |
| Relationship-tag visual novels (373 hits) | low value: no system to read in a browser build; most are linear text | tag page only |
| Tamaweb, Pixel Monster, KittyToy and other listing-only titles | not opened: virtual-pet loops of the Tamagotchi type; the played verdicts above do not depend on them | listing only |
| Cat Cove Inn rehome matching puzzle, DRGN scene variety, Grim Brood hide reading | needs play | verdict table |
| Grim Brood remaining `care.js`, `pit.js`, `market.js`, `quests.js` | low value: sickness, fights and sales are standard | downloaded in private/grim-brood/js, only greps read |

Gap-pass tools: Il2CppDumper (project toolset) on the Cat Cove wasm; UnityPy raw-string scan; ILSpy CLI on a PE rebuilt from the webcil Racing Pigeons assembly; esbuild pretty-print (Greyhound Dynasties, princi-pal); Ren'Py rpyc zlib string scan; no game code executed. About 40 further tool calls.
