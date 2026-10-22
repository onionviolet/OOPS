# itch.io batch scout: new games beyond the first screen, 2026-10-22

Proposals only (AD32). Static reads only: no game code run, no native
downloads, no accounts. Private notes and locators: `private/BATCH_SCOUT_NOTES.md`;
full SHA-256 of every file read: `private/SHA256SUMS.scout.txt` (both
gitignored). Labels: **source** = read in served code, data or build metadata;
**stated-not-found** = a page claim I did not locate in the build.

## Discovery routes

- "Games like" pages for the four decoded games (ids 4047477, 4875880,
  5071571, 5095834): 118 unique titles, mostly noise.
- Tag listings fetched with redirects followed: `tag-genealogy`,
  `tag-alchemy/tag-html5`, `tag-dynasty`, `tag-life-simulation/tag-text-based`,
  `tag-colony-sim/tag-idle`, `tag-idle/tag-family`. `tag-time-loop/tag-incremental`
  and `tag-village/html5` loaded but my list parser returned nothing for them
  (not re-read). The first attempt hit 429 or 403 on several combos and
  without `-L` showed 301s; the second pass worked after pacing at 5 s.
- Web search for village management, time loops, jams, alchemy and life sims.
  The New Years Incremental Game Jam entries page loaded but was not parsed.
- The dynasty and text life-sim tags were by far the best yield.
- Dedupe: no decoded or screened title appears in `RESEARCH_IDLE_GAMES.md`,
  `NICHE_GAME_REFERENCES.md`, the screen report or the lane tables (grep by
  title). Kinfolks, Great Expanse and Xianxia LifePath came back again and
  were skipped as already covered.

## Screened by page (one line each)

Decoded below: **HUNGERHOLD, Heirdeep (identified only), Peasant to King, House of
Ashes, Pegs & Bones, Frostward, Noble, Colony Adventure V36, Midnight Idle,
Ensis IDLE.**

| Title | Page finding |
| --- | --- |
| Idle Island | Village sim claiming generations of islanders and jobs; desktop download only. |
| Tree of Heroes | Android/download hero-line puzzle. |
| Ascendance (Ploquin) | Download; loads any GEDCOM family tree and scores music from it. Lineage presentation idea only. |
| Physician Simulator (demo) | Godot web (`index.pck`), clinic under a mandatory-service law. PCK not extracted. |
| My Township | Unity web, small, incremental plus crowd management. Thin. |
| Island Of Mine (beta) | Construct 3 build, crystals unlock land. Not read. |
| Text Town | Text game: assign people to hunt, build, raid; game over at zero population. Thin. |
| Village Builder | Freeform building clicker. Thin. |
| Horse Master | Twine joke game about raising a horse. Thin. |
| Life and Lemon | Orchard card game; index path differs, not read. |
| Inn Over Your Head | Tavern funds a dungeon dig; desktop download. |
| Immortality Factory | Wizard automation incremental; desktop. |
| Outhold | Tower-defense incremental with skill tree; web plus download. |
| Idle Looter | Idle RPG loot loop. |
| Wizard Cats | Page is only a Steam widget. |
| Worldwide Arts Society | Deck-building incremental 1799 to today; download. |
| Starflower Inc. | Space-farm robots. Off theme. |
| Earth ReGen | No description. |
| Castle: Build&Defend | 3D castle and wave defense. Off theme. |
| Failed State | Satirical nation strategy; download. |
| Gekokujō | Card-based Risk-like; download. |
| Timeline | GMTK jam network economy (Unity). |
| Idle Judgment Day | Short Twine clicker. |
| The Daring Entrepreneur | 48-hour jam incremental. |
| Loopbound | Page hit 429; search snippet says 156 MB download. |
| Imperium Sine Fine, Mos Maiorum, Labor Omnia Vincit, Labor Omnia Vincit: Fall | Roman dynasty strategies from one author (`stronma`), browser per their pages; listing text only. Open next. |
| Trade World | "You are a person with a business" economic sandbox; listing text only. |
| Bloodlines & Banners, Anamnesis of Renascents and Monsters, Knight of Adalia, The Lists, Proscribed Palimpsest, Riverwood Eons, IMAGINERY | Listing or page text only. IMAGINERY page: observational village sim where villagers marry, form families, elect leaders and the player intervenes with miracles (no web build id found). |

Named by web search only, never opened: Re:Increment (60-day loop keeping
memory, shadows and points), Tiny Lives (text, relationships, HTML5),
Alchemical Amalgamation, Alchemy Clicker, Trans Mutation, Dwarf Alchemy Idle,
Incremental Alchemy.

## Decoded games

### S1: HUNGERHOLD (BiosicStudios): strongest find

Itch: https://biosicstudios.itch.io/hungerhold, in development, web iframe id
19566811, single HTML file 5.16 MB, plain JS with a large inline JSON data
block (readable). No license found (ideas only). Page: each life teaches the
next, from a cave to a kingdom; death is routine and a child continues.

**Systems (source, from the data block)**
- **Death teaches.** Each cause of death has a "lesson keepsake" that gives
  later lives a small permanent edge (starvation: hunger drains 5% slower;
  wolves: bites hurt 10% less; old age: heal 10% faster; cold, drowning,
  mushrooms, raw meat, rockfall, thirst each have their own). The edge is small
  and tied to the cause.
- **Keepsakes from deeds.** Other keepsakes unlock from stats (for example a
  wolf-pelt cloak after wolf kills, a sea chart item). Achievements track
  "pass on 3 different keepsakes" and "10 different traits in your family".
- **Bloodline constants.** Three heirs offered, 70% trait inheritance chance,
  parent traits weighted double, days lived weighted 1.5, 40% chance of a second
  trait (60% of those a flaw), 12% mutation, and a "knack" (skill) carry of 10%
  with a start cap and diminishing returns. Writing (a tech) raises knack carry.
- **Succession crisis (kingdom stage).** When a new ruler wakes, a claimant
  challenges with chance = base 0.30 + 0.12 per grown sibling at camp (max 2)
  + 0.10 if the ruler is under 18 + 0.15 if renown is under 45. A lost
  succession, a lost war or two revolting provinces breaks the realm back to a
  city, warned in advance, with a payable peace cost and a reclaim recipe.
- **Faith and memory.** About 50 memory-line templates record who did what in
  which year ("X would not hear our priest, in year Y"), attached to factions;
  choices change attitude and add a memory line.
- 14 epitaph lines keyed to how a life ended, and quirk and tell systems with
  their own inherit chance (60%).

**Representations**: recap screen with an epitaph and "memories return to
you" count; family traits tracked as a seen-set.

**Improvements**: none (no comments); data block carries tuning values.

**YAIR mapping**: `heir_inheritance.js`, `home_inheritance.js`,
`chronicle.js`, `life_experience.js` (has epitaphs and a youth/adult/elder
`lifeStage`). Grep of `src` for cause-of-death terms and "knack"
matched only `expedition_content.js` for knack and nothing for cause-keyed
carry. I did not read `heir_inheritance.js`, so I cannot say what an heir
already carries. Candidate: a cause-keyed, small, per-world dial on what a
death hands the next life (AD10-AD12, AD38 "things work by how they work").

### S2: Peasant to King (madmarkiemarc)

https://madmarkiemarc.itch.io/peasant-to-king, released, iframe id 19801130,
one 1.57 MB HTML, plain. No license found.

**Systems (source: in-game help and event text; deeper code not traced)**
- Release 1.5 notes: educate children from the Dynasty panel and the heir
  inherits what you teach. A child heir means a regency until sixteen.
- Two heirs of age at death with stakes high makes the succession disputed:
  play the chosen heir or the claimant, settle within ten days by gold, court
  or arms.
- Marriage to a crown costs a dowry (150 gold) and acts as a treaty: that
  kingdom will not make war on your house, and a broken bond is remembered in
  every court.
- Six kingdoms declare wars and peace on their own among twelve walled
  towns; spies reveal war plans; authored story threads per kingdom.

**YAIR mapping**: `feature_expansion_book_situated.js` matches regent/regency
only; household and inheritance owners above. Marriage-as-treaty fits AD25/AD27
(local economies, institutions). Not compared in depth.

### S3: House of Ashes (doubleorcrit)

https://doubleorcrit.itch.io/house-of-ash, in development, iframe id 19613502,
Vite bundle (433,692 B, readable, minified identifiers). Text dynasty game. No
license found.

**Systems (source)**
- Play continues through death: on the player's death the heir list is ranked
  and the next heir becomes the player; the run ends only when the bloodline
  does (page claim matches the `succession` object in code).
- Event cards with typed tests (adult dynasty members of the main house) such
  as an inheritance quarrel. The player's ruling changes traits on both people
  (one becomes Content, the other Ambitious, or an even split gives both
  prestige) and each side gets a personal life-log line.
- A childless couple event has a grief branch that marks a person infertile and
  gives a trait.
- Every member is remembered; a married-off daughter can still be checked later
  (page claim; not traced).

**YAIR mapping**: per-person life log lines produced by event resolutions
resemble `chronicle.js`; typed event tests resemble Noble's role requirements.
Thin on novelty beyond Kinfolks I3.

### S4: Pegs & Bones (pofi-g)

https://pofi-g.itch.io/pegs-bones, prototype, iframe id 19793980, 196 KB HTML,
plain, Russian-titled. Page: Plinko-style expeditions where a villager bounces
through encounters and you choose when fate stops them; villagers age, have
children, inherit traits. Source scan found 20 pregnancy and 37 trait mentions
and few inheritance mentions; I did not trace it. One line, not a decode.

### S5: Heirdeep (senaris), identified, not decoded

https://senaris.itch.io/emberfall, iframe id 19611918. Page claims: dynasty
hold game, pairing bench that forecasts children, inherited base stats that
can be surpassed, seat passes to the blood heir. The served file is a single
78.8 MB HTML (SHA in the sums file), almost certainly an embedded engine
build; not extracted. Worth a PCK or wasm pass if Weibao wants the pairing
forecast.

### S6: Frostward (Digital Acres)

https://digitalacresstudios.itch.io/frostward, in development (also Steam),
Next.js build id 18458696, three JS chunks (minified, strings intact), data
driven with a mod system. No license found.

**Systems (source)**: Child, Adult, Elder life stages (elders work at 60%
speed, a staffed schoolhouse educates children and shortens childhood). Daily
elder death roll that rises with age past the threshold. Pairing is
housing-driven (unpartnered adults of opposite sex in the same house), births
need a free bed, 10 food and a happiness-scaled roll, and the child records
parents and surname. Death clears the survivor's partner link and logs an
"orphaned" line for each child. Death kinds (old age, cold, starvation,
illness, slain, killed on the road) each have a chronicle string.
**From config/strings, not a traced path**: town-wide grief from unburied
corpses (per-corpse value, capped), a "came of age with nowhere to live" line.

**YAIR mapping**: no match for orphan or grief in `npc_lives.js` or
`home_household.js` (separate grep: `orphan` only hits unrelated validators;
`grief|mourn` and `came of age` match nothing in `src`). YAIR does have a PC
`lifeStage` (`life_experience.js`). Idea: events for those left behind.

### S7: Noble - Family Tree Sim (Extra Nice)

https://extra-nice.itch.io/noble-fts, in development, Unity WebGL (IL2CPP),
iframe id 12463107, data 22.1 MB, wasm 85.0 MB. Readability: engine-compiled.
I parsed the Unity data container and read `global-metadata.dat` strings, so
claims are by type and prompt names only. No license found.

**Systems (source, names)**: Gene, AllelePair and Genotype types and a
Phenotype layer (age, sex, sterility and tag aware). An opportunity engine with
typed role requirements (age, alive, blood, married, title, years dead, tag),
weighted outcomes, fertility and phenotype checks, an outcome-usage database,
and named effects (pregnancy, engagement, duel, killed, scar, nickname, title
transfer, house reputation, trust, stability). Embedded writer prompts for an
LLM that titles and describes outcomes from placeholders; a GPT client class
exists. Whether the shipped build calls a model at runtime is
stated-not-found (Il2CppDumper on the wasm not run).

**YAIR mapping**: grep for genotype, allele and phenotype found nothing in
`src`. AD-level direction on LLM-written text: grep of `RULES_INDEX.md`,
`USER_VISION.md` and `PROJECT.md` for LLM, language model and generated
narration found nothing, so no accepted direction either way; treat as open.

### S8: Colony Adventure V36 (gamebuegar, "MiniColonyAdventures")

https://gamebuegar.itch.io/asd, released, iframe id 16883111, single 306 KB
HTML (page title and build title differ). Plain, Turkish comments. No license.
**Systems (source)**: per-pair relationship scores (-100 to 100) changed by
social chats (chat +3, joke +8, quarrel -15); courtship needs both adults,
opposite sex, score above 10, unpartnered; marriage at a higher score by
chance. Founders begin as a couple with a pregnancy. Yearly tick: adulthood at
13, death roll from 60 rising 5 points per year. Leader is the oldest living
man (hard-coded). Mother, father and spouse ids are saved. Mourning happens
only when the player directs a colonist to a grave. Thin for YAIR.

### S9: Midnight Idle (AccurateCat)

https://accuratecat.itch.io/midnight-idle, released, iframe id 12978029, plain
multi-file JS (v0.3.8, 2025-02-11). Monster-form roguelite. **Source**: skill
tree marks upgrades "class inherit" (carries into the next absorbed form) vs
"class active"; toggles force the next form. **Improvements** (its nine
changelog entries in `verlog.js`): mostly bug fixes and cost rebalancing, such
as lowering an early skill's cost and raising a level cap; nothing design-level.
Thin for YAIR.

### S10: Ensis IDLE (Cerbion)

https://cerbion.itch.io/ensis-idle, in development, iframe id 19799551, Vite
bundle (1.53 MB, readable), patch 0.6.10 dated 2026-10-16 with an embedded
changelog (not mined). **Source**: an offline cloning time bank exists; it is
spent when cloning runs and is zeroed when auto-cloning is off (fill side not
traced). Thin for YAIR; compare Lowmoor's capped offline (screen I8) and
`simulation_clock.js`.

## Top findings

1. **HUNGERHOLD**: cause-keyed lessons (each way of dying hands the next life a
   small, specific edge), plus a numeric succession-crisis formula and
   faction memory lines with year stamps. Closest match to AD10-AD12.
2. **Peasant to King and House of Ashes**: succession as a played scene (child
   heir regency, disputed succession settled by gold, court or arms; inheritance
   quarrel whose ruling rewrites two people's traits and life logs).
3. **Frostward**: housing-driven pairing and births, plus events for survivors
   (orphaned, widowed, came of age homeless). YAIR `src` has no match.
4. **Noble**: typed role requirements and an outcome-usage database for scene
   choice; embedded LLM writer prompts (no accepted direction found in YAIR docs).
5. **Heirdeep and the Roman dynasty set (Mos Maiorum, Labor Omnia Vincit)** are
   the next reads: pairing forecast and multi-generation houses; not decoded.

## Verification

Read: about 45 itch pages (listing and game pages, one 429 with a 90 s wait),
and the exact web builds for HUNGERHOLD (one HTML, JSON data block by regex),
Peasant to King (grep and text context only), House of Ashes (bundle, grep and
context), Pegs & Bones (grep counts only), Frostward (three chunks,
pretty-printed with esbuild), Colony Adventure (one HTML), Midnight Idle (six
scripts, greps), Ensis IDLE (bundle, greps), Noble (Unity container, metadata
strings). Not read: Heirdeep (78.8 MB), Noble's wasm logic, Physician Simulator
PCK, any behaviour at runtime. Several games were sampled by keyword context,
not traced end to end. About 80 tool calls; itch pages spaced 5 s. Nothing
committed; only files under `docs/research/itch-io-2026-10-22/` written.
