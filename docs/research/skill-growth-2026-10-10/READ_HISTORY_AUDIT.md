# Read-history audit: how power grows, and what a level means

Date: 2026-10-10. Scope: Weibao's Royal Road fav and follow rows in
`docs/research/novels/royal-road-2026-10-10/mine.tsv`. Framework: growth
models G1 to G22 and level meanings L1 to L10 in
[SKILLS_AND_TALENTS.md](../../SKILLS_AND_TALENTS.md#ways-to-grow-and-what-a-level-means-2026-10-10).
System-evolution findings (systems that break, merge, wake up or reset) are
already in [the system evolution survey](../system-evolution-2026-10-10/SURVEY.md)
and are only cited here.

## Method and honesty notes

- **Input.** 189 rows marked fav or follow. Rows that are only `readlater`
  were skipped. About 40 rows (follower count 0 in the TSV) carry only a
  "last read" line instead of a blurb, which shows how far he got. Several
  stop at chapter 1 to 20, so "followed" does not always mean "read deeply".
- **Triage.** By tags and blurb. About 75 titles have a progression system.
  The table below covers 66 of them. Pure fan fiction without a system
  (Pokemon SI stories, Naruto SI, Harry Potter) was left out unless the
  blurb named a growth rule.
- **Fetch route.** Direct fetches (curl, WebFetch) got HTTP 403. The
  in-app browser pane worked. Pages were fetched from inside a royalroad.com
  tab with cookies omitted, so no reading position or account state was
  touched. Only public fiction pages and early chapters were read. The pane
  was shared with another session, which navigated it during the work; my
  fetches did not depend on the visible page.
- **What was read.** Chapter 1 to 3 (or the first chapters with a status
  screen) of 19 titles: Super Supportive (ch 2, 3, 9), A Novel Concept,
  Stubborn Skill-Grinder, Cultivation is Creation, The Lone Wanderer,
  Godclads (index and two chapters), Heretical Fishing, Applied Cultivation
  (ch 1 and a ch 102 public sample), Rock falls everyone dies, DIE TRYING,
  Death After Death, Just a Human, The Jade Shadows Must Die, Path to
  Prosperity, DIE. RESPAWN. REPEAT., Lord of Hunger, [Farmer] Mage,
  Dreamer's Throne (book 4 ch 1), Rift-Runner Returns Home. Corpo Age gave
  only a prologue. All The Skills and Just Add Mana returned no chapter text
  (stubbed or failed once; not retried).
- **Labels.** STATED = blurb or fiction page says it. READ = I read it in
  a chapter this session. MEMORY = my recall, unverified. INFERRED = deduced
  from title or tags. Early chapters show the bottom of each system only.
  Anything about late-story levels is MEMORY or INFERRED.
- **Quotes.** Only short system-text fragments are quoted.

## Table

G and L codes from the framework. New codes (G23+, L11+) are defined in the
next section.

| Title | RR id | Growth | Level means | Distinctive mechanic (one line) | Label |
|---|---|---|---|---|---|
| Super Supportive | 63759 | G2, G4, G14 | L5, L8, L12 | The System's proper name is the "Interdimensional Warrior's Contract", offered to 0.07% of Earth; Avowed get a class and ranks (A, S) the public analyzes like sports stats | READ (name, odds, ranks); MEMORY (service owed) |
| The Perfect Run | 36735 | G16, G22 | L12 | Fixed elixir powers; growth is knowledge across save-point loops | STATED (save point); MEMORY (elixirs fixed) |
| Super Minion | 21410 | G20, G5 | L10 | Bioweapon built in a lab; growth through design and modification | STATED (premise); INFERRED (growth) |
| The Lone Wanderer | 95097 | G9, G17, G28 | L11, L5 | Core colors Red to Orange; reaching Orange tripled remaining lifespan; bloodline clones explore other worlds and bring back techniques; the clone body has two Red cores | READ |
| A Novel Concept | 66455 | G1, G15, G27, G18 | L10 | Status shows the pre-integration human average (10) as a baseline; dense aether adapts the body over a set time; daily resurrection plus "rebuilt to resist what killed it" | READ |
| Stubborn Skill-Grinder in a Time Loop | 83294 | G1, G7, G16, G18 | L1, L5 | Skill numbers cross thresholds into social titles (Cleaning 30 becomes Cleaning Apprentice); levels Initiate, Apprentice, Adept, Elite name whole classes of soldiers; nobles alone know Observe | READ |
| Just Add Mana | 125163 | G16, G17 | L4 | Each past life adds mana; too much mana makes normal spells collapse | STATED |
| Cultivation is Creation | 100432 | G9, G26, G28 | L4 | Power is the inner world you build in your soul, adding elements and celestial bodies; the cheat lets him possess the recently dead across dimensions | READ (inner world); STATED (possession) |
| Jackal Among Snakes | 48969 | G8, G16-like | L1 | Wiki knowledge of the game the world mirrors; foreknowledge as growth | STATED |
| All The Skills | 55687 | G13, G6 | L3 | Spells are captured in cards; a Master of Skills card lets him learn all skills | STATED |
| Industrial Strength Magic | 57011 | G2, G20 | L5 | System boots on Earth; magically dull hero blends villain tech with magic | STATED (premise); INFERRED |
| [Farmer] Mage | 86267 | G2, G16 | L5 | Regressor picks a despised class ([Farmer]) on purpose; ranks Initiate and up; chooses a reset point at death | READ (ranks, reset); STATED (class) |
| DIE TRYING | 124235 | G2, G12, G18 | L15 | Quests pay storefront coins; stat screen mirrors real injuries he brings from Earth; zones labeled "Lowest Level. Lethal Difficulty." | READ |
| Death After Death | 58180 | G16, G15, G8 | L15 | "Level" means a floor of the Pit; no status screen answers him; growth is his own character across deaths | READ |
| The Laws of Cultivation: Qi = MC^2 | 46550 | G20, G11 | L1 | Cultivation by making drugs, as a scientist | STATED |
| DIE. RESPAWN. REPEAT. | 66643 | G15, G24, G16 | L12 | Each death pays stat credits; credits must be banked all at once, and a bigger bank raises the skill's grade; bonuses at 100 and each power of 10 | READ |
| Immortality Starts With Generosity | 56949 | G25 | L14 | Whatever he gives as a gift comes back 100 times better | STATED |
| Hocus, Pocus, Hypothesis | 118886 | G20, G8 | L1 | Builds a new science-based magic inside a System world | STATED |
| Rock falls, everyone dies | 55418 | G2, G18 | L18 | Stats are physical quantities (velocity vectors); an assist grants 500,000 XP but overflow past the next level is discarded | READ |
| A Universe of Bloody Evolution | 58667 | G5, G2 | L10 | 90% of the universe turned to monsters; System is the only ally | STATED; INFERRED (evolution) |
| Department of Otherworld Rescue | 126289 | G2 | L3 | A state agency retrieves teens summoned to other worlds | STATED (premise) |
| God of Trash | 107252 | G2, G6 | L5 | "Trash talent with trash skills and no chance of progression" polished upward | STATED |
| Applied Cultivation | 97091 | G2, G9, G17, G12 | L3, L5 | "Level 0" mortals; levels grant a heavenly allocation of body, mind and spirit origin points; bloodline traits evolve; affinity has grades; courtyards cost sect contribution points equal to years of work | READ |
| Godclads | 59663 | G11, G26, G13 | L4, L12, L10 | Power is a Heaven: a hollowed, slain god installed in a person; Thaumic mass is the capacity to project an alternate reality; miracles cause Rend, which a Hell module vents; hubris and paradox limit it; Spheres rate threat level | READ (index) |
| Wizard's Tower | 41881 | G13, G20 | L4 | A 150-year wizard ends up as a tower that grows | STATED (premise); MEMORY (tower body) |
| Heretical Fishing | 67114 | G1, G8 | L9 | Broken System runs low on power; the prologue hints ascension requires a change in goal | READ (error text, prologue hint) |
| Technomagica | 73052 | G20, G14 | L1 | Scientific method applied to the System; soul-bound to his twin | STATED |
| Duskbound | 97850 | G2, G17 | L2 | Ten years of levels from killing monsters; a racial subtype that thrives at night | STATED |
| Blueprint for Immortality | 75240 | G20, G9 | L1 | Crafting xianxia | STATED |
| Rise of the Living Enchantment | 86184 | G16 | L8 | The System issued a "recommended" termination; regression to day one | STATED |
| Common Sense Is Overpowered | 75079 | G31 | L16 | The world runs on protagonists; he is an "extra" free of the cliche rules | STATED |
| Transcending Dreams | 65765 | G9, G14 | L2 | A cultivator patron grants him the first chance | STATED |
| I Am Become Death | 109537 | G9, G11 | L10 | Divine Breath cultivates gods' energy to steal divine strength | STATED |
| Mana Devourer | 89231 | G11 | L4 | Devours monsters' mana; the reserves might kill him | STATED |
| Master, This Poor Disciple Died Again Today | 47340 | G22, G15 | L5 | Survives a cultivation world by faking death | STATED |
| Idiot's Paradox | 75864 | G2 | L16 | Only the top-rated 1% survive 365 days; the System calls humanity a plague | STATED |
| Harvesting Skills and Cultivating | 97574 | G11, G9 | L2 | Harvests skills from defeated enemies inside a cultivation world | STATED |
| Corpo Age | 75446 | G12 | L14 | Money is power; wealth needs ever more spending to protect | STATED |
| Demonic Sect Elder Cultivates Righteous Disciples | 73452 | G21, G9 | L11 | Starts with 24 hours of remaining lifespan; the System wants demonic cultivators eradicated; he grows by reforming disciples | STATED |
| Deadworld Isekai | 71319 | G2 | L1 | Full isekai stat package on a dead planet where stats barely help | STATED |
| Lord of Hunger | 95702 | G11, G5, G17 | L10 | "Omnivore" is a bloodline skill, "Rank 0, Evolution Possible"; eating divine flesh breaks him out | READ |
| Path to Prosperity | 89323 | G11, G13 | L4 | His Ego is a coin, Tier Mortal-0; it consumes things he owns and reforges them into better things | READ (Ego, tier); STATED (reforge) |
| Rift-Runner Returns Home | 119140 | G23, G1 | L13, L14 | Skills grow as crystals inside organs during a 30-minute window and are cut out and sold to citizens; his body was "worth" a million Cosm | READ |
| Dreamer's Throne | 66110 | G2, G24, G26 | L4 | XP for exploring; XP is also spent (replanting dream flowers); subdued dream locations become territory; ability cap 10 | READ (book 4); STATED (exploration XP) |
| King of Fools: Silver Tongue | 54714 | G14, G1 | L9 | God of Fools patron; trash talk as power | STATED; INFERRED |
| Magic Made Simple | 97151 | G29, G8 | L5 | The System gave an S+ rank to the physicists who doomed Earth, as a judgment of their deed | STATED |
| Ghost of the Truthseeker | 56136 | G9, G2 | L2 | Earth initiated early into an AI-run cultivator empire | STATED |
| Speedrunning the Multiverse | 46319 | G16, G17 | L2 | Reached the peak once; restarts to do it faster | STATED |
| My Demonic Farm | 76493 | G13, G20 | L4 | Growth through crops with moods and hunger | STATED |
| Apocalypse Me | 68491 | G11, G6 | L10 | He is an Apocalypse; devours other apocalypses | STATED; SURVEY #14 |
| Lord of EXP Farming | 94774 | G2 | L16 | Leaderboards over one year after the 42nd Merging | STATED |
| Schemer's Paradise | 97188 | G29, G23 | L8 | System brands him cursed and slows his growth; tutorial overseers plan to farm initiates for XP | STATED |
| Eternal | 74977 | G16, G17 | L6, L8 | Reincarnates forever; must meet benchmarks and quests or be swallowed | STATED |
| Ruthless: Path of Conquest | 72635 | G29, G2 | L8 | System judges past actions and assigns a villain path with matching stats | STATED |
| Tainted Reflections | 55075 | G16 | L5 | A System reset after 35 years wipes all levels | STATED; SURVEY |
| Advent of Eternity | 58668 | G2 | L11 | Every mortal has a clock to their death; he was born outside it | STATED |
| From Nothing | 53533 | G2 | L13, L16 | Galactic caste competition; top 1% get a tutorial | STATED |
| Escaping Valhalla | 88775 | G15, G2 | L15 | Tower climbing in Valhalla with repeated deaths | STATED |
| War of Divinities | 54715 | G2 | L15 | Conscripts climb the Empyrean Tower for losing gods | STATED |
| Just a Human | 75164 | G5, G8 | L5 | Classes come from gods via churches; the hero refused a class and grows by evolution | READ (refusal); STATED |
| The Jade Shadows Must Die | 117944 | G9, G12 | L3, L13 | System access is granted by a blood test; corps sell techniques; mortals have no Path; he has qi, outside the System | READ |
| DAOPOCALYPSE | 80446 | G9, G14 | L5 | A cultivator gains a god's leftover System and runs a mortal country | STATED |
| Revenant | 115870 | G11 | L12 | Steals the superpower of any corpse he touches | STATED |
| Omniplex | 115945 | G11, G15 | L10 | Alien serum promises power plus a growing hunger inside him | STATED |
| OP Character | 112533 | G2 | L6 | Eons alone in a training realm with rewards from nowhere | STATED |
| Roadtrip (Madness Re-Incarnate 2) | 73245 | G16, G17 | L10 | Sent his own memories through the Flow to his next life | STATED |

## New growth models and level meanings

These were not in G1 to G22 or L1 to L10. Each has at least one READ or
STATED example.

### New growth models

- **G23 Harvest.** Growth happens in your body but is not yours. Others cut
  it out, sell it, or farm you for it. Rift-Runner: skills crystallize in
  organs during a timed window, then get extracted and installed in
  civilians (READ). Schemer's Paradise: overseers farm initiates for XP
  (STATED). This turns a character into a resource and makes keeping your
  own growth a crime.
- **G24 Banking.** Points pile up and convert later in one lump; the size of
  the lump sets the quality. DIE. RESPAWN. REPEAT.: credits must be banked
  all at once, bigger banks raise the skill's grade, bonuses at 100 and each
  power of 10 (READ). Dreamer's Throne spends XP like money on upkeep
  (READ). Tension: spend now to survive, or hoard for a better grade.
- **G25 Giving.** You grow by giving things away. Immortality Starts With
  Generosity: gifts come back 100 times better (STATED). Glimpse of
  Eternity hints at the same with a donation (STATED, partial). Fits
  life-sim relationships directly.
- **G26 World-building.** Power is the size and complexity of a world you
  hold. Cultivation is Creation: an inner world in the soul gains elements
  and celestial bodies (READ). Godclads: Thaumic mass measures how complex
  a reality you can project (READ). Dreamer's Throne: subdued dream
  locations become territory that pays XP (READ). Distinct from G13 because
  the world is the self, not an item.
- **G27 Exposure.** Living in a harsher environment remakes you on a clock.
  A Novel Concept: denser aether gives a talent with a one-month adaptation
  time, plus fever and weakness (READ). Not death-based like G15.
- **G28 Proxies.** Growth gathered by bodies you send out. The Lone
  Wanderer: bloodline clones explore other worlds and bring back techniques
  (STATED, READ for clone setup). Cultivation is Creation: possessing the
  recently dead across dimensions (STATED).
- **G29 Verdict.** The System grades you by your past or your morals, and
  growth follows the verdict. Ruthless: villain path from past actions
  (STATED). Magic Made Simple: S+ rank for the deed that ended the world
  (STATED). Schemer's Paradise: branded cursed (STATED). Demonic Sect Elder:
  the System wants your faction gone (STATED).
- **G30 Threshold titles.** A use-XP number turns into a social title at
  fixed marks. Stubborn Skill-Grinder: Cleaning 30 makes you a Cleaning
  Apprentice, and Adept or Elite describe whole ranks of soldiers (READ).
  Close to G7, but the number is visible and the title is public.
- **G31 Narrative role.** The world runs on story roles, and your role sets
  your growth. Common Sense Is Overpowered: protagonists follow cliche
  rules, extras are free of them (STATED). Reincarnated in a Shounen Manga
  plays the same idea from the punching-bag side (STATED).
- **G32 Ownership reforge.** You can only power up what is yours, by feeding
  owned things to your power. Path to Prosperity: the Ego consumes what he
  owns and reforges it (STATED). A blend of G11 and G13 with an ownership
  gate.

### New level meanings

- **L11 Lifespan.** A level is how many years you have left. The Lone
  Wanderer: reaching Orange tripled remaining lifespan (READ). Demonic Sect
  Elder: "Remaining Lifespan: 24 hours" (STATED). Advent of Eternity: every
  mortal has a death clock (STATED). Different from L6, which is time already
  spent.
- **L12 Threat rating.** An outside body files you by danger. Godclads:
  Heavens of the First to Third Sphere are "tactical-level threats" and
  Godclads get diplomatic rights (READ). Super Supportive: S-rank Brute,
  A-rank, debated by fans (READ). DRR: Trial "Danger Rank: SSS" (READ).
- **L13 Citizenship.** A level is which class of person you legally are.
  Rift-Runner: civilians are a privileged class; riftborn are second-class
  and cannot keep skills (READ). Jade Shadows: mortals without System
  access have no Path (READ). From Nothing: a galactic caste competition
  (STATED).
- **L14 Price.** A level or skill has a market value. Rift-Runner: his body
  was worth about a million Cosm while he earned a hundred a month (READ).
  Corpo Age: money is power and must be spent to keep (STATED).
  Generosity: gifts as investments (STATED).
- **L15 Depth.** A level is where you stand: a floor, a zone or a tower
  story. Death After Death: levels are the Pit's floors (READ). DIE TRYING:
  "Lowest Level" of a shelter-city (READ). War of Divinities and Escaping
  Valhalla: towers (STATED).
- **L16 Percentile.** A level only means something against everyone else.
  Idiot's Paradox: top 1% survive (STATED). From Nothing: the best 1% get a
  tutorial (STATED). Lord of EXP Farming: leaderboards (STATED).
- **L17 Judged worth.** A rank as the System's moral or legal verdict on
  you (see G29). Separate from L5 status because nobody else granted it.
- **L18 Physical quantity.** Stats in real units, so a level is a
  measurement. Rock falls: velocity vectors in m/s instead of Str or Dex
  (READ). A Novel Concept shows the pre-integration human average as a
  reference line (READ).

## Standout subtleties

- **Bottom versus top.** The bottom is mundane and numeric: Cleaning 23 to
  24 (Stubborn Skill-Grinder), "Level 0" mortals (Applied Cultivation), a
  pebble with zero velocity (Rock falls). The top is described as a threat
  class, not a number: Godclads Spheres that level city blocks (READ). The
  number fades and the classification takes over as you climb.
- **Overflow is thrown away.** Rock falls grants 500,000 XP for an assist
  and discards everything past level 1 (READ). A per-event cap stops one
  lucky kill from skipping the early game.
- **Information is a class privilege.** Stubborn Skill-Grinder: only nobles
  and their guards learn Observe (READ). Seeing levels is itself a status
  good.
- **Too much power is a disability.** Just Add Mana's spells collapse under
  its mana; Mana Devourer's reserves might kill him (STATED). Growth can
  make basic actions harder.
- **Bodies cap growth.** The Lone Wanderer lost his Orange core in an infant
  clone body but gained a second core (READ). Moving between bodies resets
  rank and can change the slots.
- **Stats mirror real damage.** DIE TRYING's stat screen matched his old
  neck and leg pain (READ). The system reports the body as it is, not an
  idealized one.
- **Growth has visible costs.** Godclads: miracles cause Rend, which needs
  Hells to vent (READ). A Novel Concept: adaptation brings fever, thirst and
  weakness (READ). Rift-Runner: crystals grow from organs (READ). Omniplex:
  hunger for violence (STATED).
- **Clashing systems.** Jade Shadows: qi exists outside the System (READ).
  DAOPOCALYPSE: a cultivator with a LitRPG System (STATED). Just a Human:
  refusing a god-issued class (READ). Virtuous Demon: a System user disrupts
  a cultivation sect (STATED). In each, the outsider's growth is illegible to
  the locals' measuring tools.
- **Power as contract.** Super Supportive's System is named as a warrior's
  contract (READ), so its levels double as service owed (L8). This is the
  clearest verified L8 in his history.
- **Status grows in the open.** Super Supportive's public dissects villains'
  skills from one appearance (READ). Ranks are spectator sport, which ties to
  L9 visibility.
- **Broken systems run on low power.** Heretical Fishing opens with
  "Insufficient power. Superfluous systems offline." (READ). The System
  itself has a resource bar.

## Five candidates for a later deep read

1. **Godclads (59663).** The richest unusual model: slain gods as installed
   Heavens, Thaumic mass as capacity, Rend as cost, Hells as compensators,
   hubris and paradox as rules for clashes. Maps to G26 and L12. The index
   chapter is a ready glossary.
2. **Super Supportive (63759).** His top-rated favorite. Slow, school-based
   growth, a System framed as a contract, public ranks, aliens with their own
   magic. Best fit for the life-sim north star and for L8.
3. **Rift-Runner Returns Home (119140).** Only 54 chapters, so cheap. Skills
   as harvested organs, citizenship by skill ownership, skill prices. The
   cleanest G23, L13 and L14 source.
4. **A Novel Concept (66455).** 449 chapters. Death adaptation, timed
   environmental adaptation, baseline-human stat references, tutorial rank
   rewards. Strong G15 and G27 source with long-run data on how numbers
   scale.
5. **The Stubborn Skill-Grinder in a Time Loop (83294).** Closest to YAIRPG's
   current use-XP skills with milestones. Threshold titles (G30), social
   ranks by skill number, Observe as privilege, and a loop that keeps
   grinding. Directly testable in the existing skill engine.

Alternates: DIE. RESPAWN. REPEAT. (66643) for banking (G24), but only 4
public chapters remain. Applied Cultivation (97091) for origin points and
sect contribution economics.
