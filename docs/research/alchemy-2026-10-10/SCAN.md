# Alchemy scan: how it works across fiction, games and history

Research note, 2026-10-10. Prompted by Weibao's "What about alchemy and more?".
Scope: collect the rules of alchemy in each source, then place them in our
cheat cosmology. All claims are paraphrased from secondary sources (wikis,
guides, forum posts, search summaries) and are not verified against primary
text unless a row says so. All YAIR mappings and engine items are proposals,
not accepted rules.

Labels: **(S)** sourced with a link; **(MEMORY)** from my own background
knowledge, not checked here; **(I)** inference.

Source routes: Fandom wikis returned HTTP 402 (fma, toaru, btth, reverend
insanity); after one block each I switched to search summaries and other
hosts. Wikipedia fetched for waidan. No terms accepted, no login.

## 0. What already exists (not repeated)

- Noita: seeded secret recipes, exact versus family matching, mixture
  conservation, the proposed recipe contract: [noita/ALCHEMY_AND_SUBSTITUTION.md](../noita/ALCHEMY_AND_SUBSTITUTION.md).
- Fullmetal Alchemist: earlier lane mappings only (labeled unverified there):
  [DIGEST_fullmetal-alchemist.md](../power-systems/wiki-digests/DIGEST_fullmetal-alchemist.md).
- Battle Through the Heavens cases (qualification by soul/fire/wood, monster
  cores in pills, medicine versus commissions): [RESEARCH_CULTIVATION_PATHS.md](../../RESEARCH_CULTIVATION_PATHS.md)
  (cases 4 and 11, "Medicine and commissions rather than compulsory alchemy").
- Cheat library hits: "Perfect crafting" row in [CHEAT_LIBRARY.md](../../CHEAT_LIBRARY.md);
  Noita recipe-tool row in [CHEATS_BY_WORLD.md](../../CHEATS_BY_WORLD.md);
  alchemy as ingredient ordering or a tile puzzle in [LIFE_SIM_NORTH_STAR.md](../../LIFE_SIM_NORTH_STAR.md).
- Backing table and compatibility modes (Works, Reread, Rechannel, Weakened,
  Blocked): [CHEAT_COSMOLOGY.md](../../CHEAT_COSMOLOGY.md).
- Engine today: one `Alchemy` skill (max level 60) in `src/data/skills.js`
  and ordinary recipes in `src/crafting_recipes.js` (`alchemy_recipes.items`),
  for example Potash from Charcoal and Bufonite from Toxin glands: a
  level-gated material conversion with a success-chance range. No properties,
  traits, toxicity, discovery or power source.

## 1. Fiction: the rule sets

### 1.1 Fullmetal Alchemist (Amestris and Xing)

- **Inputs:** matter to rearrange, a transmutation circle (pattern), and an
  understanding of the target's composition. Price is a matching amount of
  value, the law of equivalent exchange. [S: overview](https://wikipedia.com/wiki/Automail),
  [S: conservation-law essay](https://jgeekstudies.org/2026/05/12/on-the-relation-between-full-metal-alchemists-equivalent-exchange-and-the-scientific-conservation-laws/).
- **Process:** decompose, reconstruct, per circle. Survivors of the Gate can
  work without a circle (the body acts as the circle). [S](https://fma.fandom.com/wiki/The_Gate)
  (search summary; page itself blocked).
- **Power source:** Amestrian alchemy is explained in-world as tectonic
  movement; Xingese alkahestry runs on the Dragon's Pulse, a life flow through
  the land. Fans speculate the real source is souls kept underground; that is
  conjecture. [S](https://fma.fandom.com/wiki/Alkahestry).
- **Failure and cost:** human transmutation sends the alchemist to the Gate;
  Truth takes a body part, often tied to what they valued, and the survivor
  gets a flood of knowledge. Edward's leg for Alphonse's soul binding is the
  standard case. [S](https://fma.fandom.com/wiki/The_Gate).
- **Philosopher's Stone:** substitutes for a soul as payment; made by trapping
  many souls, and homunculi burn them as fuel. So it moves the cost to a
  hidden payer instead of removing it. [S](https://fma.fandom.com/wiki/Human_Sacrifice).
- **Who:** trained practitioners, state certification (digest). Alkahestry is
  aimed at the Elixir of Life and healing; alchemy at the Stone and
  augmentation. [S](https://fma.fandom.com/wiki/Alkahestry).
- **Portability (I):** knowledge travels. The power source does not: Amestris
  tectonic energy and Xing's pulse are both world-law-style supply. Elsewhere
  you would need Rechannel (a local flow, a patron, a stored soul pool) or
  the art is Blocked. The circle-free body is a Body-backed upgrade bought
  with a Gate toll.

### 1.2 Toaru Majutsu no Index (Aureolus Izzard, Ars Magna)

- **Goal and process:** alchemy as the pursuit of perfecting a natural body
  (Magnum Opus), recast as simulating the whole world in a single chant, so
  that thoughts can be brought into reality. [S](https://toarumajutsunoindex.fandom.com/wiki/Alchemy).
- **Why "incomplete":** the wiki says any result short of the full simulation
  is treated as useless by the alchemist. Fan summary also says writing the
  whole-world model takes centuries even with descendants helping. [S](https://toarumajutsunoindex.fandom.com/wiki/Alchemy).
- **Who/source:** Aureolus is a descendant of Paracelsus and a former church
  alchemist in a rare post; the art is Hermetic in origin. [S](https://anibase.net/de/character/mRQp6/Aureolus-Izzard).
- **Failure/cost:** time and completeness. The art has no small tier of
  payoff, which is the point.
- **Portability (I):** Knowledge-backed with a model-completeness gate, plus a
  Concept-adjacent flavor (rewrite by simulation). Elsewhere it travels as a
  partial model that is "worthless" by its own standard, unless the new
  world's rules are small enough to simulate. Good Reread case.
- **Gap:** I did not find a primary statement of Aureolus's exact limits
  (what his Ars Magna cannot do). (MEMORY: he builds and fires from a
  prepared model and was defeated by Touma's right hand and a flaw, not
  verified.)

### 1.3 Type-Moon (Atlas, Clock Tower, Einzbern)

- **Two traditions:** Atlas alchemy descends from Egyptian metallurgy and
  focuses on converting phenomena; Clock Tower alchemy merged with Western
  magecraft. [S](https://typemoon.fandom.com/wiki/Golemancy).
- **Atlas people:** little or no magic circuits; "man-machine" bodies; six
  families with special energy-producing cells that work only inside their
  bodies. Weapon production is the institute's purpose. [S](https://typemoon.fandom.com/wiki/Encyclopedia/AFM)
  (search summary; fan wiki). Some fan discussion disputes whether Atlas
  alchemy needs circuits.
- **Homunculi:** the Einzbern factory made homunculi over about 900 years to
  reproduce the Third Magic, ending in Justeaze, who was flawed. Also a
  vessel (Grail) maker. [S](https://typemoon.fandom.com/wiki/Magician_of_the_Third_Magic).
  Atlas made Rani VIII as a test of life without a body. [S](https://typemoon.fandom.com/wiki/Rani_VIII).
- **Thought acceleration:** **not found** in any source I could reach. The
  brief's claim is unverified here. One lead: Logos React as a computer-like
  superweapon. [S](https://typemoon.fandom.com/wiki/Logos_React). (MEMORY: the
  Atlas "accelerated thought as computation" idea appears in Type-Moon
  lectures; confirm before use.)
- **Portability (I):** Atlas is Body-backed (cells, man-machine) plus Item
  (superweapons); Einzbern is institution-and-time (a lineage and a factory).
  Only the knowledge and the finished homunculus travel.

### 1.4 Lord of the Mysteries (brief; covered elsewhere)

- Potions give Pathway powers at an entry Sequence. The acting method:
  behave according to the potion's name to settle it gradually, which
  speeds digestion; a higher-Sequence witness helps; at the top the aim is
  control, not full digestion. Prior knowledge can pre-digest part of it.
  [S](https://lordofthemysteries.fandom.com/wiki/Acting_Method).
- Failure: loss of control, madness, monster, or death (game adaptation page;
  keep game and novel apart). [S](https://thegameswiki.com/lord-of-mysteries/wiki/beyonders).
- Portability (I): Item (the potion) plus a behavioral practice, so the
  practice is Knowledge-backed and portable; the pathway's world-law
  metaphysics probably is not.

### 1.5 Xianxia pill refining and 炼器

- **Battle Through the Heavens.** Three essentials: material, flame, soul
  perception, plus a trace of wood attribute with fire as a catalyst;
  spiritual strength matters most. [S](https://www.wuxiaworld.com/novel/battle-through-the-heavens/btth-chapter-6),
  [S](https://www.wuxiaworld.com/novel/battle-through-the-heavens/btth-chapter-933).
  Trash input caps output; pills are graded in tiers with sub-grades (for
  example a tier-7 middle grade). [S](https://www.wuxiaworld.com/novel/battle-through-the-heavens/btth-chapter-415).
  Heavenly flames: 23 ranked, wild, explosive, need protective pills to
  absorb. [S](https://www.wuxiaworld.com/novel/battle-through-the-heavens/btth-chapter-1048).
  Higher pills draw pill lightning (Chinese-language search summary), which
  needs strong defenders at the top end. [S](https://m.qidian.com/chapter/1016914010/507449025/).
  Toxicity accumulation: **not found in sources reached**. (MEMORY: BTTH
  has pill toxicity that limits repeated use; verify.)
- **I Shall Seal the Heavens.** Ranks; grandmaster needs several pills at 90
  percent or more medicinal strength; bulk pills average out potency while
  individually adjusted pills fit each soul; "concocting" with huge
  ingredient counts is praised over mere refining. [S](https://www.wuxiaworld.com/novel/i-shall-seal-the-heavens/issth-book-3-chapter-236),
  [S](https://www.wuxiaworld.com/novel/i-shall-seal-the-heavens/issth-book-3-chapter-257),
  [S](https://www.wuxiaworld.com/novel/i-shall-seal-the-heavens/issth-book-3-chapter-238).
  Monthly quota for master alchemists. [S](https://www.wuxiaworld.com/novel/i-shall-seal-the-heavens/issth-book-3-chapter-221).
- **Reverend Insanity.** Gu refinement from recipes ranked and guarded by
  clans, stored on a cheap recording Gu; long recipes include tips (moonlight,
  jade rock) and past failures; Fang Yuan memorizes rather than carrying
  copies, and a refinement-path expert reads a low-rank recipe's principles
  at once. [S](https://reverend-insanity.fandom.com/wiki/Fang_Yuan/Cultivation).
  Success rate, essence cost and failure outcomes: not reached.
- **炼器 versus 炼丹.** In one novel both need a fire source, with artifact
  refining leaning on flame strength and alchemy on heat control and
  attribute harmony; alchemy uses a cauldron to hold potency, with many
  methods; artifacts are persistent and bondable, pills consumable.
  [S](https://www.wuxiaworld.com/novel/alchemists-path-to-eternity/apte-chapter-41),
  [S](https://www.wuxiaworld.com/novel/alchemists-path-to-eternity/apte-chapter-33).
  Success rates are low and a numbers game (same novel). (MEMORY for the
  prestige and bonding generalizations.)
- **Aptitude gates:** soul strength and flame/wood affinity (BTTH), a
  rank-certifying guild (ISSTH), recipe access and clan secrecy (RI).
  Often inborn or guild-gated, which our existing research says not to apply
  as an immutable birth lock on the base skill.
- **Portability (I):** Knowledge for technique and recipes; Body for flame
  affinity and soul strength; Item for flames and cauldrons; fuel is local
  qi, so Rechannel or Weakened elsewhere. Pills are Items and travel if
  carried (their consumers may not be able to use them).

## 2. History and real traditions

- **Waidan (external alchemy).** Inputs are cinnabar, mercury, lead, arsenic
  compounds; process is heating in a sealed clay crucible over rice-hull,
  charcoal or dung fire; ritual conditions (secluded lab, door orientation,
  ceremonies to spirits); risk is poisoning, with several Tang emperors
  dying; practiced by ritual specialists, court alchemists and scholars; key
  texts include the Baopuzi and the Cantong qi. [S](https://en.wikipedia.org/wiki/Waidan).
  Elixir poisoning is documented in the official histories, from the Qin
  emperor to the 1735 case. [S](https://en.wikipedia.org/wiki/Chinese_alchemical_elixir_poisoning)
  (via search summary).
- **Neidan (internal alchemy).** The furnace becomes the lower abdomen,
  the raw materials become jing, qi and shen, and the lead and mercury
  language is code for inner states; it grew from waidan in the Tang and
  took over the immortality aim. [S](https://en.wikipedia.org/wiki/Waidan),
  [S](https://wiki.wudang.academy/article/philosophy-neidan) (practice site,
  weaker source). This is the historical root of "cultivation as alchemy":
  same grammar, different carrier.
- **Western Hermetic.** Tria prima: sulfur (burns), mercury (vaporizes),
  salt (stays fixed in fire), mapped by Paracelsus onto soul, spirit, body.
  [S](https://sourcelibrary.org/encyclopedia/Mercury%2C%20Sulfur%2C%20and%20Salt),
  [S](https://en.wikiquote.org/wiki/Tria_prima). Four stages of the Great
  Work: nigredo (blackening, dissolution of the prima materia), albedo
  (purification), citrinitas (yellowing, sometimes omitted), rubedo
  (reddening, the Stone). Sources disagree on stage details and the
  psychological readings (Jung) are later interpretation. [S](https://www.cabinet.ox.ac.uk/node/3388).
- **Portability (I):** Waidan is physical chemistry with a local fuel
  (portable by Knowledge plus materials, though its payoff is mundane
  poison). Neidan is Body-backed and ports with the body, with the carrier
  (qi, a dantian) only if the new world has an equivalent. Hermetic stages
  port as a process shape (dissolve, purify, fix) onto any substance.

## 3. Games

Each: inputs, process, output, power, failure/cost, aptitude, portability.

- **Atelier (Arland to Ryza).** Inputs are materials with quality and traits;
  process is slot-based synthesis; traits inherit from ingredients up to a
  cost level, max five in Arland; later entries added element boosts and
  secondary effects; Ryza has Effect, Trait and Quality slots in a
  grid that opens adjacent slots; Yumia moved traits out of synthesis to
  equippable slots and makes quality depend on activated mana. [S](https://www.rpgsite.net/news/8352-koei-tecmo-details-item-synthesis-in-atelier-lulua-the-scion-of-arland),
  [S](https://www.ginx.tv/en/atelier-ryza-3-synthesis-system-explained),
  [S](https://steamcommunity.com/app/3123410/discussions/0/565870386383722294).
  Power: mana or catalyst in later entries. Failure: low quality, not
  explosion. Aptitude: skill level and recipe. Portability (I): Knowledge of
  the grid plus local materials; traits are properties, so they port as
  tags.
- **Potion Craft.** Grind and stir along a hidden effect map, up to five
  symbols per potion; partial grind and early stop matter; hazards on the map
  damage the potion. [S](https://steamcommunity.com/app/1210320/discussions/0/3105764536425529790).
  Skill is dexterity plus route planning. Portability (I): the map is a
  property space; a world with a different property space has a different map.
- **Potionomics.** Ingredients contain five magimin types; the ratio sets
  quality, total amount sets tier (Minor to Masterwork), and off-ratio costs
  quality gradually. [S](https://www.gamepressure.com/S013-amp.asp?ID=19328).
  Pure proportion math. Portability (I): excellent; works with any set of
  named property axes.
- **Little Alchemy and Doodle God.** Start from four elements; combine to
  discover; combinations are physical (water + lava) or metaphorical (water
  + fire gives alcohol). [S](https://Www.Wikipedia.org/wiki/Doodle_God).
  Both descend from a 1997 DOS game. No cost; discovery is the reward.
  Portability (I): works anywhere if the world supplies a seed set of
  elements; the recipe graph is the world's flavor.
- **Noita.** Material reactions; three-ingredient seeded recipes for Lively
  Concoction and Alchemic Precursor. [S](https://noita.wiki.gg/wiki/Lively_Concoction),
  [S](https://noita.wiki.gg/wiki/AP). Details in the existing note.
- **Cultist Simulator and Book of Hours.** Aspects on cards, recipes accept
  enough of an aspect (for example five of an aspect across three card
  types for an apprentice craft), not every ingredient is consumed; books
  and memories feed slots. [S](https://steamcommunity.com/app/1028310/discussions/0/3812913565882175906),
  [S](https://weatherfactory.biz/boh-the-early-draft-edition/). Existing
  repo research: [cultist-simulator](../cultist-simulator/), [book-of-hours](../book-of-hours/).
  Hush Workings and translation: not reached.
- **Skyrim.** Eating reveals one effect; the lab combines two or three
  ingredients; any shared effect succeeds and reveals all matches; no match
  loses ingredients; strongest effect decides potion versus poison; perks add
  strength. [S](https://app.uesp.net/wiki/Skyrim:Alchemy). Discovery by
  tasting is a knowledge gate. Portability (I): knowledge map is world-local.
- **Witcher 3.** Potions are short and multi-charge; decoctions last long,
  single-use; both raise a toxicity meter that drains; going over hurts;
  decoction toxicity does not drain with time; refill by meditating with
  alcohol, not new ingredients. [S](https://eip.gg/witcher-3/guides/potions-and-decoction-crafting/),
  [S](https://gamertagmythras.com/blog/the-witcher-3/witcher-3-alchemy-guide).
  Aptitude: mutation-hardened body (MEMORY). Cost sits on the drinker, so
  toxicity is Body-backed tolerance.
- **Dungeon Meshi.** Cooking monsters as applied ecology: identification is
  a skill, harvest and preparation choose edibility; a fan TTRPG adds
  corruption tables for risky monsters (not canon). [S](https://rhymeswithmenace.itch.io/the-dungeon-gourmet-guide),
  [S](https://comicsworthreading.com/?p=18463). Canonical rules for
  monster-eating effects beyond this: MEMORY.
- **Dr. Stone.** Science as alchemy: the revival fluid is nitric acid with
  alcohol, with the story building each ingredient from guano or ammonia,
  fermentation and distillation through failures; the shell is calcium
  carbonate. [S](https://dr-stone.fandom.com/wiki/Taiju_Oki/Synopsis),
  [S](https://Www.Wikipedia.org/wiki/Nital). Tech tree and needed tools are
  the real gate. Portability: Knowledge, almost fully, if the elements
  exist. Blogs claiming sulfuric acid conflict with wiki sources; I trust the
  wiki.
- **Witch Hat Atelier.** Magic drawn as glyphs in special ink; sigils pick
  the element/effect, direction and shape matter; glyphs on bodies and
  magic on living bodies (even healing) are banned; memory-wipe is the
  exception that guards the secret. [S](https://en.wikipedia.org/wiki/Witch_Hat_Atelier),
  [S](https://mangacraft.substack.com/p/witch-hat-atelier-unique-magic-systems).
  Irreversibility of mistakes: unconfirmed. Portability (I): Knowledge plus
  an Item (ink); drawn craft with a legal and secrecy layer.
- **Tensura.** Dwarven potions from Hipokute herbs top out at 98 percent
  purity; Rimuru's reach 99, enough for full restoration; Vesta later
  matches this. [S](https://tensura.fandom.com/wiki/The_Gathering). Rimuru's
  Great Sage turns herbs and ore intake into potions through Predator
  absorption plus analysis. [S](https://tensura.fandom.com/wiki/Mighty_Foes_in_the_Forest_of_Jura).
  Kurobe's smithing runs on the unique skill Divine Craftsman with a minimum
  Rare grade. [S](https://myanimelist.net/character/162770). Predator
  "synthesis" as a named step was not found. The key lesson: a tiny
  threshold difference (98 to 99) separates healing wounds from regrowing
  limbs. Portability (I): System- or Soul-backed (skills); Knowledge only for
  the herb-and-purity idea.

## 4. Taxonomy of alchemy kinds (proposal)

| Kind | Core move | Examples | Typical backing |
|---|---|---|---|
| A. Transmutation by exchange | Reshape matter at a price | FMA | World law or soul pool for the payer |
| B. Recipe and furnace | Combine inputs under heat and skill into a consumable | BTTH, ISSTH, Atelier, Skyrim, waidan | Knowledge + Item + local fuel |
| C. Property mixing | Hit a ratio or map | Potionomics, Potion Craft, Noita | Knowledge (pure) |
| D. Discovery and combination | Find the recipe graph | Little Alchemy, Doodle God, Skyrim tasting | Knowledge (world-local) |
| E. Internalization | The body is the furnace | Neidan, cultivation | Body or soul |
| F. Stage-based Great Work | Dissolve, purify, fix, perfect | Hermetic, FMA's stone | Knowledge + patience |
| G. Simulation alchemy | Model the world and fire the model | Toaru Ars Magna | Knowledge + time |
| H. Living-input alchemy | Creatures, souls or lineages as material | Homunculi, Gu, Philosopher's Stone | Soul or lineage |
| I. Practice-gated digestion | The act of living changes what the potion does | Lord of the Mysteries | Item + Knowledge of a rite |
| J. Tolerance-limited use | Body carries the cost | Witcher toxicity, pill poison | Body |
| K. Applied-science alchemy | Chemistry from scratch | Dr. Stone, waidan | Knowledge |
| L. Drawn or written craft | Symbols plus ink | Witch Hat Atelier, FMA circles | Knowledge + Item |
| M. Diet alchemy | Cooking as practical monster handling | Dungeon Meshi | Knowledge |
| N. Absorb-and-synthesize | Eat, analyze, regenerate | Tensura | System |

## 5. Cross-world portability findings

1. **Same art, different fuel.** FMA's own two arts share technique but not
   source (tectonic energy versus a life flow), and the two sources can be
   mixed to defeat a local effect. That is the model for our worlds:
   identical recipe card, a per-world `fuel` field.
2. **Recipe, material, fuel, operator are four separate things** and each
   has its own backing: recipe (Knowledge), material (Item or local world),
   fuel (World law or local supply), operator (Body, Soul or System).
   Moving between worlds usually breaks the fuel first, then the material.
3. **Neidan is the portability winner.** It needs only a body and a method.
   Waidan is next (cinnabar and a crucible exist almost anywhere). Heavenly
   flames and pill lightning are world-law loaded and block hardest.
4. **Discovery is world-local.** Skyrim tasting, Doodle God graphs and Noita
   seeds are knowledge of one world's property map. A returning traveler
   carries a hypothesis, not a recipe (matches the Noita note's rule).
5. **Cost placement differs by kind.** Exchange (FMA), time (Toaru),
   tolerance on the drinker (Witcher, pill poison), failed attempts and
   consumed ingredients (Skyrim), hidden payer (Stone). A port should keep the
   cost kind while rescaling the amount.
6. **Threshold, not tier, drives breakpoints.** Tensura's 98 to 99 purity gap
   and Potionomics magimin thresholds both put big effects behind small
   numeric gaps. Useful for non-linear unlocks.
7. **Aptitude gates are cheap to carry in fiction and cheap to drop in a
   game.** Soul strength and fire/wood affinity should be modifiers and
   shortcuts, not locks (consistent with the existing research note).

## 6. Engine implications (proposals)

- **P1 Four-field recipe:** extend `ItemRecipe` use with optional `fuel`
  (a named supply with a world tag), `operator` (skill and optional trait),
  `material profile` (exact or property family), and `cost kind`.
  Existing recipes keep working with defaults.
- **P2 Property axes on ingredients** (Potionomics-style amounts per named
  axis) with a ratio-match scorer; the output quality is a function of
  ratio distance and total amount, with named breakpoints. Compatible with
  the Noita note's S-P1 to S-P4.
- **P3 Tolerance meter** on the character for consumables (Witcher
  toxicity and cultivation pill poison): per-item load, different decay
  rules, a hard cap with a stated penalty. Keep it opt-in per world.
- **P4 Discovery log:** per-world knowledge map for ingredient effects
  (Skyrim reveal) and combination graphs (Doodle God) saved with the world,
  not the character. Cross-world entries import as hypotheses.
- **P5 Stage runner:** a recipe may declare ordered stages (dissolve,
  purify, fix, perfect) with a per-stage check; an idle player advances a
  stage clock while a manual player can intervene.
- **P6 Trait inheritance** (Atelier): ingredients carry tags, the output
  chooses a limited number up to a cost cap. Fits the existing item tag
  categories.
- **P7 Fuel adapters per world:** same recipe, different `fuel` source
  mapped by world (qi, mana, tectonic, ordinary fire). A missing fuel gives
  Blocked or Weakened by the existing compatibility modes.
- **P8 Body furnace as a skill variant:** neidan-like training that uses the
  same stage runner with the body as the vessel; its fuel is a stored resource,
  not an item.
- **P9 Digestion state** for potions that change the user over time
  (Lord of the Mysteries acting): a percent-digested field and a
  behavior-matching bonus; otherwise skip.

None of these are accepted. Pick by slice.

## 7. More to consider

- Where does alchemy sit in cheat cosmology: as a cheat (Perfect crafting,
  recipe-tool), as a world skill, or as a source of cheats (the Stone as an
  item cheat with a hidden payer)? Probably all three; the backing table
  already supports that split.
- Alchemy as a bridge between worlds: a recipe that needs a material only in
  one world forces travel; a potion that carries a world's fuel in it
  (stored qi) travels.
- Cooking, brewing and medicine as sibling crafts sharing the P2 scorer.
- Homunculus and Gu as living-input alchemy are a bridge to the
  "nonhuman-fiction" research folder.
- Social layer: guild ranks, monthly quotas, guarded recipes (ISSTH, RI),
  bulk versus individually tuned pills (ISSTH).
- Transmutation as a failure-prone idle-resource converter: an idle loop
  that converts surplus into scarce goods under a visible exchange rate.
- Toxicity and accumulation tied to the existing life-sim body model.
- Lineage alchemy (Einzbern) as a multi-generation project in the life-sim
  clock.

## 8. Gaps

- Fandom wikis were blocked (HTTP 402); mechanics for FMA alkahestry,
  Toaru, BTTH and Reverend Insanity come from search summaries and
  chapter pages, not full wiki articles.
- Not found in reachable sources: BTTH pill toxicity, pill tribulation as a
  defined rule (only pill lightning in a Chinese-language summary), Reverend
  Insanity success rates and essence costs, Atlas thought acceleration,
  Predator synthesis wording, Dungeon Meshi canonical monster-food effects,
  Hush Workings and book translation, Toaru Ars Magna limits.
- Primary texts were not read; no manga, light novel or game was run.
- Several search results were low-quality mirrors or generated pages; I used
  them only where a better host agreed or marked them weak.
- Lord of the Mysteries game-adaptation meters are contradictory between
  sources; unverified.
- Claims marked MEMORY need a source before they enter a design doc.
