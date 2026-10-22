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
- `tag-village/html5` parsed on the second pass: new names CIVIMAX, Four Seasons
  Valley (each season lasts one real week), Busybodies, Hearthbox, Moru & Friends
  (villagers pick their own jobs and ask for things). Their pages were read; the
  builds were not decoded. `tag-time-loop/tag-incremental` loaded on the third try: Loop For a While, The
  Aetherium Loop, Scratch Till Dawn, Loopbound, Thousandth Dawn (a text
  incremental about one repeating day). Listing text only; none opened.
- Web search for village management, time loops, jams, alchemy and life sims.
  The New Years Incremental Game Jam entries page loaded but was not parsed.
- The dynasty and text life-sim tags were by far the best yield.
- Dedupe: no decoded or screened title appears in `RESEARCH_IDLE_GAMES.md`,
  `NICHE_GAME_REFERENCES.md`, the screen report or the lane tables (grep by
  title). Kinfolks, Great Expanse and Xianxia LifePath came back again and
  were skipped as already covered.

## Screened by page (one line each)

Decoded below: **HUNGERHOLD, Peasant to King, House of Ashes, Pegs & Bones,
Heirdeep, Frostward, Physician Simulator, Tiny Lives, Mos Maiorum, Noble,
Colony Adventure V36, Midnight Idle, Ensis IDLE.**

| Title | Page finding |
| --- | --- |
| Idle Island | Village sim claiming generations of islanders and jobs; desktop download only. |
| Tree of Heroes | Android/download hero-line puzzle. |
| Ascendance (Ploquin) | Download; loads any GEDCOM family tree and scores music from it. Lineage presentation idea only. |
| Physician Simulator (demo) | Decoded second pass (S6b). |
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
| Labor Omnia Vincit and Fall of the Republic | Roman dynasty pair (`stronma`); pages show no web build. Imperium Sine Fine and Mos Maiorum are decoded (S5b, S6d). |
| Trade World | "You are a person with a business" economic sandbox; listing text only. |
| Bloodlines & Banners, Anamnesis of Renascents and Monsters, Knight of Adalia, The Lists, Proscribed Palimpsest, Riverwood Eons, IMAGINERY | Listing or page text only. IMAGINERY page: observational village sim where villagers marry, form families, elect leaders and the player intervenes with miracles (no web build id found). |

Named by web search only, never opened: Re:Increment (60-day loop keeping
memory, shadows and points; a community post only, no store page found, with a
marker on each progress bar for the previous run's progress, stated), Tiny Lives (text, relationships, HTML5),
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

**YAIR mapping (files read)**: `life_experience.js` already defines three life
lessons (route signals, a guard lesson, a control pattern), a youth/adult/elder
stage that scales learning (youth 1.2x), elders who can teach, deed-based
epitaphs and a grave that carries a bequest; `heir_inheritance.js` converts
written or taught lessons into the heir's start. So "a life leaves a lesson" is
present. What HUNGERHOLD adds is **cause-keyed** lessons (the way you died picks
the edge, with small percentage values) and its succession-crisis formula. Grep
for cause-of-death terms in `src` found none. Candidate: a per-world cause to
edge table feeding the existing bequest slot (AD10-AD12, AD38). Proposal only.

### S2: Peasant to King (madmarkiemarc)

https://madmarkiemarc.itch.io/peasant-to-king, released, iframe id 19801130,
one 1.57 MB HTML, plain. No license found.

**Systems (source: in-game help text and event templates in the served file; the
underlying functions were not traced)**
- Release 1.5 notes: educate children from the Dynasty panel and the heir
  inherits what you teach. A child heir means a regency until sixteen.
- Two heirs of age at death with stakes high makes the succession disputed:
  play the chosen heir or the claimant, settle within ten days by gold, court
  or arms.
- Marriage to a crown costs a dowry (150 gold) and acts as a treaty: that
  kingdom will not make war on your house, and a broken bond is remembered in
  every court.
- Regent kinds named in the event text: the late spouse, the senior retainer,
  a rival who seizes the seal, or the keep's steward. A child heir's authority
  grows (voice at 12, co-rule at 14, majority at 16) and a grasping regent may
  refuse to step down. A claimant's claim strength is shown against the heir's.
- Six kingdoms declare wars and peace on their own among twelve walled
  towns; spies reveal war plans; authored story threads per kingdom.

**YAIR mapping**: `feature_expansion_book_situated.js` matches regent/regency
only; household and inheritance owners above. Marriage-as-treaty fits AD25/AD27
(local economies, institutions). Not compared in depth.

### S3: House of Ashes (doubleorcrit)

https://doubleorcrit.itch.io/house-of-ash, in development, iframe id 19613502,
Vite bundle (433,692 B, 10,108 lines pretty-printed, minified identifiers). Text
dynasty game. No license found.

**Systems (source)**
- A person record holds house, gender, age, birth and death year, alive flag,
  cause, one or two traits, parents, and a personal **life log** of dated lines
  that events append to.
- Yearly mortality by age: 2.8% under 3, 0.5% to 13, 0.9% to 44, 3% to 54, 6%
  to 64, 12% to 74, 22% after; the Sickly trait doubles it. Cause text depends
  on age band (old age or a failing heart after 60, a childhood fever under 5).
- Death marks the person dead, writes "Died at N, of cause" in their log, and
  moves a household headship to its oldest living member, or marks the household
  extinct when none remain.
- On the player's death the heir list is ranked and play continues as the
  next heir; the run ends only when the bloodline does.
- About 119 weighted event cards. Inheritance quarrel: the ruling changes traits
  on both people and writes a life-log line for each; an even split gives both
  prestige. A childless couple event has a grief branch that marks infertility
  and adds a trait. A far-away relation can write asking to come home.
- Fertility chance falls by age band (21%, 15%, 10%, 6%).

**YAIR mapping**: a per-person life log fed by events matches the chronicle
pattern; `npc_lives.js` (read) holds a bounded 32-person village whose death
years are hashed from the seed and whose births and marriages are scripted, so
a yearly-roll household is the gap. Thin otherwise.

### S4: Pegs & Bones (pofi-g)

https://pofi-g.itch.io/pegs-bones, prototype, iframe id 19793980, 196 KB single
HTML, plain, Russian and English strings. No license found.

**Systems (source)**
- Aging is a health drain, not a death roll: none under 50, then 0.05, 0.1, 0.5,
  1.5 and 2.5 per tick by age band; a Longevity skill halves it. Death cause text
  is old age past 50, otherwise hunger and wounds.
- Birth is a modal choice: the player picks which positive skill to inherit
  from each parent (or "nothing to inherit"), and some negatives are rolled in.
- Miscarriage chance = 25, minus 4 per healer hut level, minus 6 with a healer,
  plus 10 if the mother is over 40, clamped 5 to 70. With no free seat the
  birth fails and costs the mother health.
- Strangers who join have a 15% chance (30% with one relic) of being a traitor
  who betrays after 150 to 500 days. Sparing or killing a cub sets a vendetta
  flag on the character ("the mother remembered the killer", danger +5).

**YAIR mapping**: chosen trait inheritance is the portable piece (compare
Heirdeep's forecast); the vendetta flag is an NPC-memory-by-deed example.

### S5: Heirdeep (senaris, itch slug "emberfall")

https://senaris.itch.io/emberfall, in development, iframe id 19611918. One
78.8 MB HTML file, but 78 MB of it is embedded images and audio; the game is a
1 MB Vue module script (media stripped, pretty-printed with esbuild, 17,214
lines). No license found. Readability: minified names but a named export list
and one large tuning table.

**Systems (source)**
- **Pairing is a chosen act with a forecast.** The player picks a mother and
  father; checks list why a pick is invalid (child, elder, at her birth limit,
  already expecting, knocked out, away, resting, already paired). Conception
  chance = base + charm term, raised for a "fertile" trait, shifted by a spring
  bonus and by happiness (above 70 helps, below 30 hurts), and reduced by a
  fertility fade as the mother ages past two-thirds of adulthood. A forecast
  of the child's stat grades is computed by sampling 400 draws and shown on a
  "pairing bench" before committing.
- **Mother caps by rank** (3 to 6 births, plus one if fertile). Beds are the
  population cap, and beds are held back for expected births.
- **Born versus learned stats.** Each person's stats split into born, school and
  life parts. With the school-inherit flag off (the shipped default), only
  born stats pass to children, so schooling improves a person but not their
  descendants. Mutation chance 6%.
- **Heir by blood.** The seat passes to the grown child with the best grade, ties
  broken by the stronger birth; a lower-grade kin ages in as plain "blood". The
  player can name an heir ("named by the Warden") or ask the blood to decide
  again. If nobody can hold the seat a regent sits.
- Life stages: child, adult (fading), elder; elders never pair, work at half
  speed, and stay home. Grief lowers mood for a set time after a death.
- Perk and trait lists, wage and loyalty numbers for sworn lords, seasons of
  uneven length, raids, rival holds: all in the same table (not traced).

**Representations**: the forecast bench; "why not" sentences on every disabled
pairing; heir named with a reason line ("grade 3, above X's 2").

**YAIR mapping**: `heir_inheritance.js` (read): it derives an heir's leftovers
(belongings, half reputation, a home, obligations, a kit debt settled first,
lessons written or taught) from a saved life; it does not model pairing,
genetics or a forecast. Heirdeep's born versus learned split and its explicit
"why not" lines are the portable ideas; YAIR's AD25/AD38 stance favors
mechanisms over a stat ladder, so treat the grade scheme as one world's rule.

### S5b: Imperium Sine Fine (stronma)

https://stronma.itch.io/imperium-sine-fine, released, iframe id 17877232,
319 KB single plain HTML. Same author as Mos Maiorum. No license found. (Labor
Omnia Vincit and Fall of the Republic: their pages show no web build, so not
read.)

**Systems (source: in-game help text and `adoptHeir`)**
- Heir by blood (cheap, a gamble of birth) or by adoption (costs auctoritas and
  an action, resented by traditionalists, but you choose his calibre). At most
  two Caesars may be named; adoption can draw from a provincial governor,
  which binds him to the house. Only men rule; daughters are wed to adopted
  Caesars to tie them to the blood.
- No named heir at the Princeps' death means a disputed succession that
  governors exploit. Each legion-holding governor has loyalty that falls with
  long tenure, ambition and a weak reign, and can proclaim himself emperor.

**YAIR mapping**: adoption as a priced alternative to blood is the same pattern
as Kinfolks I3-b (priced alternatives); `heir_inheritance.js` has one heir route
(AD1: world decides heir law).

### S5c: Village builders where residents act on their own

All read from their served builds.

- **Moru & Friends** (lilyunni, released, iframe 19947585, Phaser bundle 1.7 MB,
  plain): a **memory book**. `remember(id, who, x, y)` writes a once-only record
  with time, day, the residents involved and a map position; a news line says
  it entered the picture book and may unlock a placeable object (a blossom tree
  "that remembers the first friendship"). Fifteen firsts exist (first friend at a
  pair score of 50, best friends at 80, first path of five tiles, first bread,
  first cook, first festival, first gift, newcomer). Relationships are pair keys
  with a numeric score.
- **Hearthbox** (mauwpal, in development, iframe 19853425, Three.js bundle 1.7
  MB): villagers move in and pick jobs; wishes are text lines keyed by
  personality type (singer, angler, busybody, sweet tooth) with a matching
  thank-you line set when a bench is built. Only the string table was read.
- **Busybodies** (iframe 19952449, loads the live game from its own host with a
  local fallback copy): chapters give goals, each with a "why" line spoken by a
  named villager who has opinions about the build. Free chat, a player-visible
  **memory ledger with undo and forget**, and child-account limits go through
  server endpoints (`/api/chat/*`, `/api/memory*`, `/api/tea/spend` for a paid
  currency), so the client shows the ledger design but not the chat logic.
- **Four Seasons Valley** (roguebird, iframe 19905623, 254 KB plain): the season
  is computed from the wall clock (each lasts one real week from a fixed epoch),
  the same for every player; festivals are goal lists; a family leaves after 30
  seconds of no food or 40 in winter without wood.

**YAIR mapping**: Moru's once-only memory records with who, when and where are a
chronicle presentation (compare `chronicle_ui.js`); Busybodies' memory ledger
with forget is relevant to any NPC-memory feature (AD6/AD8, player sees what
they know). Frostward and these builders have no counterpart in `npc_lives.js`.

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

**YAIR mapping**: `npc_lives.js` (read) is a bounded authored 32-person village with scripted
births and marriages and hashed death years, so no emergent pairing, births
or orphan events exist; no match for orphan or grief in `home_household.js` (separate grep: `orphan` only hits unrelated validators;
`grief|mourn` and `came of age` match nothing in `src`). YAIR does have a PC
`lifeStage` (`life_experience.js`). Idea: events for those left behind.

### S6b: Physician Simulator (shishkin_blog, demo)

https://shishkin-blog.itch.io/poliklinika, in development, Godot web build
(iframe id 19945536, `index.pck` 32.1 MB, pack format 4, engine 4.7.x). I
extracted all 481 files (MD5 verified; the project's extractor only handles
exe-embedded packs, so I reused its directory loop with a 20-line change) and
decoded 27 scripts with `decode_gdc.py` (0 errors). No license found.

**Systems (source)**
- Structure: 5 cycles of 5 working days; a calendar offset skips weekends.
- Economy: start money 2,000, daily salary 1,500, daily living cost 1,300, a
  fixed loan payment of 2,500 every fifth day against a 6,000,000 loan
  (2,400 payments). Daily bonus = 500 x a reputation multiplier (0.4 to 1.4
  from a 0 to 100 rating), halved for every patient left unseen.
- Patient gifts are deterministic: a hash of the visit id picks about one visit
  in eight and the item (pickles 200, honey 300, eggs 150, tincture 250, apples
  150, pies 200 in money terms).
- Scoring: every patient carries authored lists of correct, incorrect and bonus
  actions with scores and feedback keys; the day total is a percentage; using
  the in-game assistant costs 3 points and caps the top rank.
- Locale files hold about 200 KB of English strings (51 sections: documents,
  drugs, interactions, stamps, reflections, endings).

**YAIR mapping**: an institution-with-debt loop and an evening reflection
beat; `economy` and `chronicle` own the nearest ideas. Scoring is authored case
grading, not a mechanism YAIR wants. Thin beyond the pay structure.

### S6c: Tiny Lives (lilkratzy)

https://lilkratzy.itch.io/tiny-lives, in development, iframe id 19783250
(path `tiny-lives-main/`), plain JS, `js/game.js` 5.07 MB / 78,966 lines with
long explanatory comments. Modern-day life sim: 289 jobs, 23 skills, 80 years.
Page says it also ships on CrazyGames. No license found.

**Systems (source)**
- **Skill floors.** A skill never falls below max(20, peak minus 40); the
  fundamentals (intelligence, wisdom, athleticism) never fall below 10. Daily
  decay applies only to skills not used at work or protected by a daily habit.
  So a once-great guitarist stays rusty-good.
- **Heir feeding rule.** A comment records a bug: an heir under 18 inherited
  with no housing or job and every food check failed, so a child could starve
  within days. Rule now: minors are always fed (guardian, state or whoever took
  them in), and an heir mid-transition counts as housed.
- **End-of-life ledger.** Per life it records milestones, "near misses"
  (things that were mechanically close to happening) and one-way flags like
  ever had a partner, ever traveled. Near misses become a plan for the next
  life; the code comment explains why. At death it contrasts stated interests
  with what the person actually spent time on.
- **Only a small family legacy record persists across generations** (surname,
  generations played, lives lived, legacy name), so continuing an heir's story
  is a reward, not a reset. A new life does not inherit the old save backups.
- Therapy builds a durable resilience floor ("recovery you keep"); medication
  manages symptoms only while taken. Recurring professionals (loan officer,
  advisor, agent) are the same person each visit in a town.

**Improvements (documented in comments)**: the child-heir starvation bug above;
a note that an earlier `withParents` flag did not exist and let an 18-year-old
living at home starve.

**YAIR mapping**: `life_experience.js` (youth/adult/elder `lifeStage`, epitaphs)
and `heir_inheritance.js` (lessons, obligations). Candidate ideas: the
skill-floor rule (peak minus margin) as a world dial for decay, near-miss
recording for the next life (AD10-AD12), and the "minor heir is always fed"
guard for any world that lets a child inherit. Grep of `src` for skill floor, near miss and
paths-not-taken terms found nothing; `decay` appears only in field-care and
location files (not inspected).

### S6d: Mos Maiorum (stronma)

https://stronma.itch.io/mos-maiorum, released, iframe id 19545422, single
1.75 MB plain HTML/JS (save version 98). No license found. Same author as
Labor Omnia Vincit and Imperium Sine Fine (not opened).

**Systems (source)**
- Yearly mortality by age band (0.4%, 1.8%, 5.5%, 13% under 45, 60, 70, over).
- Inheritance: the oldest living son gets 55% of the dead man's wealth and 18%
  of his prestige, and the log line says property and reputation "pass
  imperfectly"; a dead man with no living son passes nothing in this function.
- Marriage binds two houses: each side's standing rises by one and each
  person's relationship toward the other starts at +18 with a stored reason.
- Elections combine reputation, speaking ability, house standing, clients and
  wealth; the log states those factors as the explanation.
- Chronicle tags (Birth, Death, Marriage, Education, Inheritance, Household,
  Family Council, Dynasty) drive a Family versus Republic filter.

**YAIR mapping**: `chronicle.js` filters, `heir_inheritance.js`. The reason
string on every relationship change matches the "preview and settlement agree"
and AD8 stance (learned numbers, reasons visible).

### S7: Noble - Family Tree Sim (Extra Nice)

https://extra-nice.itch.io/noble-fts, in development, Unity WebGL (IL2CPP),
iframe id 12463107, data 22.1 MB, wasm 85.0 MB. Readability: engine-compiled.
Second pass: I ran the cached Il2CppDumper on the wasm and metadata (Il2Cpp
version 31, dump.cs 22.6 MB). That gives every type, field and method
signature but no method bodies, so mechanics below are the data model, not
traced logic. No license found.

**Systems (source, data model)**
- Genotype = a list of allele pairs, each pair tied to a gene id and holding
  two booleans, plus a `sterile` flag; the Phenotype layer reads genotype,
  age, sex and tags to pick sprites, colors and scale.
- A character record holds parents, children, current spouse plus a list of
  past spouses, house and house of origin, tags, age, years of immortality,
  year of death, age at last child, and flags for bastard, twin, available and
  dragged. Titles keep a previous holder, a current holder and a parent title.
  Houses hold their members, a root person, title list, name pools and stats
  with major and minor change sizes.
- Scene engine ("opportunities"): outcomes bind a role slot to a requirement
  (age, alive, blood, married, title, years dead, tag, relation to another slot),
  with variants, effects and special requirements. Effects include pregnancy
  (mother, father, legitimate flag), childbirth (quality, gender, twins,
  deadly, bastard), engagement, duel, killed, scar, nickname, title win, steal
  and transfer, and house reputation, trust and stability. An outcome-usage
  database exists to track which outcomes were used.
- Authoring-side text generation: a maintenance class generates descriptions
  for all opportunities via a GPT client (a `jwt` and `credits` login struct
  sit beside it), with a Stable-Diffusion image client of the same shape and
  embedded writer prompts. The dump cannot show whether a player's build calls
  it; the login and credit fields suggest a paid authoring service rather
  than a player feature. Treat as undetermined.

**Representations**: portraits assembled from phenotype layers, tooltips for
characters, house, tags and titles, relations panels, a family tree.

**YAIR mapping**: no genotype, allele or phenotype term in `src` (grep). Role
slots with typed requirements and a title history with previous holders are
the portable shapes (AD1 per-world rules; `chronicle.js`, `heir_inheritance.js`
own the nearest behavior). LLM direction: no mention in `RULES_INDEX.md`,
`USER_VISION.md` or `PROJECT.md` (grep for LLM, language model, generated
narration), so there is no accepted direction either way.

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
"class active"; toggles force the next form. **Improvements** (nine changelog entries in `verlog.js`, read): bug fixes and
cost rebalancing (an early skill cheaper, a level cap raised); one accessibility
round (pause key, footer icons moved); nothing design-level.
Thin for YAIR.

### S10: Ensis IDLE (Cerbion)

https://cerbion.itch.io/ensis-idle, in development, iframe id 19799551, Vite
bundle (1.53 MB, readable), patch 0.6.10 dated 2026-10-16 with an embedded
changelog (54 releases, read). **Source**: an offline cloning time bank exists; it is
spent when cloning runs and is zeroed when auto-cloning is off (fill side not
traced). **Improvements (changelog)**: milestones now count the highest reset or
jump ever reached instead of the current one, and the auto-exploration bank no
longer resets on a portal jump. Thin for YAIR; compare Lowmoor's capped offline
(screen I8) and `simulation_clock.js`.

## Top findings

1. **HUNGERHOLD**: cause-keyed lessons (the way you died picks a small edge for
   the next life), a numeric succession-crisis formula and dated faction memory
   lines. YAIR already has lessons and a bequest slot; the cause key is new.
2. **Tiny Lives**: skill floor of peak minus a margin, near-miss recording that
   becomes a next-life plan, a stated-versus-actual interests ledger, and a
   documented guard so a child heir is never left to starve.
3. **Heirdeep, Pegs & Bones, Imperium Sine Fine**: succession choices with
   priced alternatives: a sampled child forecast and "why not" lines; picking
   which parent's skill the child inherits; blood heir versus adopted heir.
4. **Moru & Friends and Busybodies**: a once-only memory book with who, when
   and where, and a player-visible NPC memory ledger with forget.
5. **Frostward, House of Ashes, Noble**: yearly-roll households with orphan and
   survivor events, per-person life logs, typed role-slot requirements. YAIR's
   `npc_lives.js` is a bounded authored village, so these are gaps by design.

## Verification

Traced in code or data: Heirdeep, Physician Simulator (481 pack files, MD5
verified, 27 scripts decoded), Frostward, HUNGERHOLD (JSON data block), Tiny
Lives (selected sections), Mos Maiorum (inheritance, mortality, marriage),
Imperium Sine Fine (`adoptHeir` and help text), House of Ashes (mortality,
death and household handoff, event weights), Pegs & Bones (aging, birth,
miscarriage, traitor and vendetta), Moru & Friends (`remember`), Four Seasons
Valley (season clock), Ensis IDLE and Midnight Idle (changelogs), Noble
(Il2CppDumper types and field layouts).

Read as help text, strings or greps only: Peasant to King (regency and dispute
rules are from in-page help and event templates), Colony Adventure, Hearthbox
(string table), Busybodies (client only, chat and memory are server side).

Not read: Noble method bodies (dump has signatures only, so whether a player's
build calls the GPT client is undetermined), any runtime behavior, Labor Omnia
Vincit and its sequel (pages show no web build), CIVIMAX, Re:Increment (no
store page found), the time-loop games (listing text only).

Local YAIR files read: `heir_inheritance.js` (first 60 lines),
`home_inheritance.js` (whole), `npc_lives.js` (whole), `life_experience.js`
(first 60 lines, the whole file is 36 lines), plus greps over `src`. Nothing
committed; only files under `docs/research/itch-io-2026-10-22/` were written.
itch pages were spaced 5 s with 90 s waits on 429.
