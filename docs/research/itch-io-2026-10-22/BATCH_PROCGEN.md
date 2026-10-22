# itch.io decode batch: procedural generation, 2026-10-22

Lane: generators of history, people, institutions, items and events that YAIR
could draw on (briefed by [DECODE_BRIEF](DECODE_BRIEF.md); screen in
[ITCH_IO_IDLE_SCREEN](../ITCH_IO_IDLE_SCREEN_2026-10-22.md)). Everything here
is a proposal (AD32). Map layout is weighted low (AD33).

Already covered in YAIR, so skipped: Dwarf Fortress, RimWorld, Caves of Qud,
Wildermyth, Cultist Simulator, CDDA (see
[status map](../../PROCEDURAL_GENERATION_STATUS_2026-10-13.md),
[opportunities](../../PROCEDURAL_AND_GENERAL_OPPORTUNITIES_2026-10-16.md),
[story considerations](../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md),
[other games](../procedural-crafting-ui-2026-10-15/OTHER_PROCEDURAL_GAMES.md)).
YAIR `src` already has seeded streams (`seeded_streams.js`), a name grammar
(`name_grammar.js`), generated visitors with goals (`generated_people.js`),
typed story receipts with causes (`lore_history_state.js`) and rivals
(`frontier_campaign.js`). Grep found no `salience`, `diplomacy`, `heresy` or
`schism` in `src`.

## Screened (27, twelve decoded)

Decoded (12): Seedship, Eigengrau's Essential Establishment Generator, Azgaar's
Fantasy Map Generator, Talk of the Town, Nothing Beside Remains, Condition
Unknown, KINGMAKER, Castaway Trails, Signal Garden, You wake up in a new town,
Worlds - History Simulator, ProcTown. The brief caps decodes at 8; Weibao then
raised the budget and allowed native downloads, so the last four (KINGMAKER,
Castaway Trails, Worlds, ProcTown) went past it.

Screened and set aside, one line each:

| Title | Why not decoded |
|---|---|
| CultGame | Not browser playable. Devlog read, see "Stated only" below. |
| Tree of Heroes | Small stat-challenge puzzle about a lineage; no generator. |
| Peregrin, Infini-Quest, Eternal Night Vale | Text and scene generators (Tracery family); Signal Garden covers the grammar-with-state idea better. |
| Colony Adventure, Frostward | Native-first or already screened elsewhere in this wave. |
| World Map Generator, Procedural Kingdoms Generator | Map/civ toys; Azgaar covers the ground. |
| OpenDnD, Alethea World History Engine, D&D NPC Generator | Names/people lists or Python; no new mechanism over Eigengrau and Azgaar. |
| Press to date, A Tarot Reading, Herbarium | Herbarium is an alchemy prototype and belongs to the potion lane. The other two are card/dating toys. |
| History/worldbuilding tag listings | Mostly educational or map quizzes; no generators found. |

## Decoded

### P1. Seedship (Space Goblin Games)

Build: itch HTML5, `html-classic.itch.zone/html/18244111/index.html`, 1,077,017
bytes, SHA-256 `9b01f14f…c3d044`. Twine/SugarCube, 119 passages in one file
(`<div tiddler=…>` store). Readability: plain. License: none stated (ideas only).

**Systems (source)**
- **Planet generator.** Per attribute (atmosphere, gravity, temperature, water, resources) a roll lands in green, yellow or red bands. A scanner level narrows the range: level 0 rolls the full range, level 1 removes red, level 2 forces green. The first planet's rolls skip the best band for atmosphere, gravity, temperature and water (resources can still roll rich), so the opening is never a free win. A visible scanner success roll can also fail and widen the range. This is a confidence ladder, not a hidden-or-shown switch.
- **Coherence repairs after the rolls.** Cold planets freeze their oceans (always at very cold, half the time at cold); no liquid water without an atmosphere; moon, caves, plants and animals have chances derived from already-rolled attributes (gravity drives moon and cave odds, atmosphere drives plant odds). Derived facts, not independent dice.
- **Stored state is a ledger.** Ship systems (landing, constructors, scientific database, cultural database) and a colonist count start at 100 and are only ever reduced by events. Nothing is flavor: the ending reads these numbers.
- **Ending is computed from the ledger.** Technology score comes from the scientific database, modified by resources and a metal-rich moon. Culture score comes from the cultural database scaled by surviving colonists, then nudged by planet beauty and alien observers. Score bands pick a named society ("Corrupt Democracy", "Warring Superpowers", "Post-Nuclear Wasteland", and so on), and some bands damage the databases further so the aftermath continues.
- **Event picker.** Malfunction chance is zero until the fifth stop, then rises one step per stop to 5 in 10 at the tenth. Uneventful and rare events are removed from the pool once used, the same encounter never repeats back to back, and the first two events come from their own pool. Events read the ledger (the rogue-program event's text and options depend on how intact the databases still are).
- **Share code.** The finished run is encoded as a short string of planet attributes and outcome letters for the high-score list. Randomness is not seeded; the code stores the result, not the run.

**Representations (source)**: a persistent status panel of ship systems, a planet card with per-attribute scanner confidence, and an end-of-run summary that narrates each stage (landing, construction, technology, culture) from the ledger.

**Improvements (source comments)**: pool-exhaustion for rare and quiet events, a rising malfunction curve with comments giving the initial and final ratios, and a first-planet rule.

**YAIR mapping**: the scanner ladder maps to AD3 (hidden rules found through fitting skills) as a per-attribute confidence level instead of a single reveal; the ledger-to-ending pattern is what `src/lore_history_state.js` receipts already aim at (typed outcome with causes), but Seedship shows decay-only resource ledgers feeding a generated society summary. `src/chronicle.js` could render a world's generated "state of civilization" from stored damage and gains rather than authored text. No existing `src` equivalent of derived coherence repairs (grep for water/atmosphere found none in generators).

### P2. Eigengrau's Essential Establishment Generator (ryceg)

Build: GitHub, TypeScript on Twine/Tweego, 297 source files in `src/`, MIT. Read: `Town/js/createTown.ts`, `createSocioPolitics.ts`, `NPCGeneration/Relationships/createFriends.ts` (raw, static). Readability: plain.

**Systems (source)**
- **A town is a stack of dice rolls plus modifiers.** Wealth, reputation, religiosity, sin, magic, size, law, welfare, equality and so on are each rolled as a sum of dice, then shifted by the town's size type, economic ideology and political ideology (each carries a modifier table), then clamped. Descriptions are derived from the numbers through getters, so changing a number rewrites the prose.
- **Governance as a chain.** Economic ideology and political source are weighted by town type; political ideology is chosen from what the source allows. The ideology decides whether the ruler is an individual NPC or a faction, which title and background the leader gets, and whether a separate ruler and a leader coexist (constitutional versus absolute monarchy).
- **Factions and buildings are created after the rolls** and read the same numbers (for example police source is derived afterwards).
- **NPC friendship templates.** A character's friend count scales with a personality roll plus a business-profession bonus. Each relationship is a template with a label, a reciprocal label, a base for the other person (same gender or age stage, same profession for a mentor) and an exclusion test that reads town rolls (a dealer needs high sin; a pastor needs a religious town or person). A secret crush draws a different reciprocal label, so the two sides can disagree about the tie.
- **Cast reuse.** A town-level reuse probability lets new relationships link to existing NPCs so the cast is connected rather than isolated.

**Representations**: every generated entity is a profile page with links to related entities (leader, factions, buildings, family). Not examined further.

**YAIR mapping**: world dials (AD1) as roll-plus-modifier stacks with derived descriptions; reciprocal asymmetric relationship labels fit `generated_people.js` (which has one `relationship` string today). Grep found no reciprocal-label or exclusion-by-world-roll structure in YAIR `src`.

### P3. Azgaar's Fantasy Map Generator (Azgaar)

Build: GitHub, TypeScript, MIT (LICENSE file; GitHub API reports NOASSERTION). Read: `generators/states-generator.ts`, `religions-generator.ts`, `names-generator.ts`, `components/seed.ts`, `lore.ts`, `notes.ts`. Map layout code not read (AD33).

**Systems (source)**
- **Diplomacy is one stored relation matrix** per state: ally, friendly, neutral, suspicion, rival, enemy, vassal and suzerain, drawn from separate weight tables for neighbors, neighbors of neighbors, distant states and naval powers. A large neighbor with a much smaller one may become its suzerain; vassals copy the suzerain's relations.
- **Wars come from the matrix.** A state with a rival that is independent and not already at war declares war if its area times expansionism beats the defender's by a randomized factor. Vassals join, defender allies join or sever their pact when the attacker is too strong (frightened, or already at war). Each step appends a sentence to a neutral "state 0" chronicle, so the history text is a log of rule outcomes with named causes.
- **Past campaigns** are generated per neighbor with start and end years placed before the current year, named from an adjective of the foe plus a weighted type (war, conflict, rebellion, crusade). They are stored on the attacking state; the ongoing wars declared by the diplomacy pass are stored on both sides, so later queries can ask who fought whom.
- **Religion pipeline.** One Folk religion per culture; Organized religions and Cults start at culture centers with a form (e.g. non-theism, animism, polytheism), expansionism, and a supreme deity name drawn from the culture's name base; Heresies are derived from a parent religion; a Folk religion is renamed with an "Old" prefix when an Organized religion spreads through its culture.
- **Names.** Markov chains over pseudo-syllables, built per name base from lists, with CJK handled one syllable per character. Cultures own a name base; deity, state and campaign names all draw on the owning culture, so place and person names agree.
- **Seed and lore.** A string seed seeds a global PRNG; seed history lets the user restore a past seed with its size and template. Lore (name, year, era, author description) is a small separate record that dates campaigns and battle reports. Notes attach safe HTML to any entity, which is the author's way to add authored facts to generated ones.

**Representations**: layered map with editors (states, cultures, religions, military, notes) that read and write the same stored data; seed history dialog.

**YAIR mapping**: AD4 (worlds keep their own histories) and `lore_history_state.js`. YAIR receipts are single-event outcomes with `historyCauses`; Azgaar's matrix-plus-derived-war pattern would give a world a stored standing-relations record from which events are derived. No `src` hits for diplomacy, schism or heresy. Religion derivation (folk, organized, cult, heresy) is a ready template for sects in cultivation worlds (see AD1, AD3).

### P4. Talk of the Town (James Ryan)

Build: GitHub, Python, MIT, repository updated 2024. Read: `mind.py`, `artifact.py`, `drama.py`, `life_event.py` (class list and base), `simulation.py` (outline), `config/salience_config.py`, `config/story_recognition_config.py`.

**Systems (source)**
- **Every event is an object with an event number.** Birth, death, marriage, hiring, home purchase, move, divorce, business construction and closure, and others derive from one base that stamps a date and a global ordinal, so same-day events keep their order. Events generated during pre-history (retconned years) get a random day inside their year.
- **Salience.** Each person keeps a salience score for other people, raised by each social interaction and by relationship changes with set increments (acquaintance small, friend and enemy higher, significant other highest, job level adds a boost). Salience decides who a person is likely to think about or talk about, a cheap stand-in for memory of people.
- **Memory is a heritable trait.** A person's base memory is drawn near a parent's (with a chance of independent draw), capped, with a small sex difference. Knowledge itself (mental models) is a separate, partly implemented layer; I did not find it fully wired in the files read (`stated-not-found` for rich gossip propagation here).
- **Story recognition after the simulation.** A separate module scans finished state for dramatic shapes: unrequited love, love triangles, extramarital interest, asymmetric friendship, misanthropes, rivalries, sibling and business-owner rivalries, each with a numeric threshold in config. Stories are found, not scripted.
- **Artifacts keep provenance.** A base artifact has a provenance list, an origin and a destruction field. The gravestone artifact is built from the subject's life facts (roles, children, occupation) and its age adjective is derived from years since death.

**Representations**: not read (the repo also ships an exporter). Text only.

**YAIR mapping**: provenance maps to AD38/MR rules on material lineage; YAIR already has `provenance` in 55 files, so the new part is the gravestone-style description derived from life facts and age. The salience table and post-hoc story recognizer have no `src` counterpart (grep for `salience`, and `recogniz` returns only recognition-of-items files). A recognizer over `loreHistory.receipts` plus household state could surface "stories" for the chronicle without authoring them.

### P5. Nothing Beside Remains (Cook and Smith Nicholls, PROCJAM 2018)

Build: Unity WebGL 2018 loader, `html-classic.itch.zone/html/1109490/Build/NBR.data.unityweb` (6,185,237 bytes; unpacked with a short UnityWebData1.0 parser I wrote in the scratchpad). IL2CPP: `global-metadata.dat` v24 (2,057,200 bytes) is readable, code is asm.js, so I read type, field and method **names** only (no logic). The title in the build is "Ozymandias". Game strings and templates are not in the metadata literal table and the serialized scene fields are not readable without type trees, so text content is **not recovered**. License none stated.

**Systems**
- **source (names)**: `Ecosystem` with `Tick`, `temperature`, `airpressure`, `hostilefauna`, `ecosystemhealth`, each with hard min and max and a per-tick `deltamax`; `Society` with `population`, `working`, `dependent`, `crops`, `livestock`, `births`, `deaths`, `abandoned`, `favoured_material`, `good_number`, `SocietyTick`; three dream constants (`DREAM_CROPS`, `DREAM_WORLD`, `DREAM_SAFETY`); an in-house grammar (`Tracerish`, `Corpus`, `ExecuteRule`, `AddWithArray`); `personalPossessives`; a `WorldGenerator` that places houses, fields, a church, lakes and trails between nodes (`AddHouse`, `AddField`, `AddChurch`, `AddLake`, `AddTrail`, `GetTrailNeighbour`); per-object `destructionChance` and `dropRate`, `RollItemTable` keyed by building type; and three death counters (`ecodeath`, `cropdeath`, `peopledeath`).
- **stated** (developer devlog, fetched through a summarizing reader): the sim runs to one of three collapses, tuned to similar frequency; the sacred number leaks into descriptions; the main engraving image depends on the collapse cause; weathering follows climate numbers; toy counts follow surviving population; predator remains and weed-to-crop ratio hint at the cause; the world renders after the sim from final values only; no seed shipped; the author calls clue density and placement the weak part.
- The names confirm the devlog's stored variables and that the build splits sim state (Ecosystem, Society) from the generator that reads it. The devlog's "fact storage" gap is real: there is no separate fact record, only these fields.

**YAIR mapping**: AD3 and [world secrets](../../worlds/WORLD_SECRETS_AND_DISCOVERY.md): keep a handful of stored variables with hard limits and per-tick change caps, and derive readable ruins and relics from their final values. Tally death by cause (ecosystem, crop, people) as three counters: cheap, and each ending can be told from them. A culture trait that leaks into small descriptions is a low-cost coherence device.

### P6. Condition Unknown (same developer, 2018-19)

Build: Unity 2019.3 WebGL, `html-classic.itch.zone/html/1770290/Build/WebGLBuild.data.unityweb` (16,090,348 bytes) and a 21,149,270-byte wasm. Il2CppDumper ran cleanly on the wasm plus v24.2 metadata (`dump.cs`, 4,851 string literals). My first pass missed the message templates because I searched for the wrong words; they are in the literal table. License none stated.

**Systems**
- **source (names)**: a `Model` that runs `GenerateWorld`, `SetupPost`, `EndTurn` over `crew`, `deadcrew`, `anomaly`, `fires`, `terminals`, `beds`, `kitchenWorkSpots`; room types (lab, corridor, mess, security, residence, generic) with pattern classes that decorate rooms (bed, desk, cooking area, work bench, artifact pattern); `GetSafeSpace` and `crewSeekingRefugeHere`; `CanSee` for perception.
- **Events travel as sound and knowledge.** Noise kinds (gunshot, explosion, scream, surge) go through `ReportNoise`, and the crew keep counters such as `explosionsHeard`, `screamsHeard`, `gunshotsHeard`, `turnsSinceLastReport`, `turnsSinceLastSighting`, plus flags `anyoneHasReportedAnomaly`, `reportedFireBlock`, `triggeredRescueBranch` and `AllAware`. The string table has paired keys by knowledge, for example one for witnessing a death and another for witnessing it while already knowing about the anomaly, and for hearing a noise as new, as a follow-up, as aware, or as panicked. This is the mechanism by which the same event reads differently per witness.
- **source (templates)**: 114 template literals use 22 slot tags filled from sim state: sender, recipient, reporter, victim, crew name, the room where the speaker is, the room of a death, another room, a noise kind, the kill effect, the investigation result, weather, time, and security role. About 70 `Strings` arrays (one per situation, each with 3 to 4 variants, picked by `Strings.Rand`) cover things like fire spotted, death witnessed, noise heard new or again or panicked, rescue planning, last death. Because every message names the speaker's own room, the terminals double as location evidence.
- **Messages** are objects with sender, recipient and a date offset (`MessageEntry`, `MessageLog`); terminals show them (`researchTerminal`, `MarkRead`).
- **Ending check.** `CheckEnding` and `ConvertToCause` take the player's cause-of-death entries from the crew roster and compare them with the sim's recorded causes.
- **stated** (devlog): behaviors are layered rather than a state machine, a three-phase arc emerges, a scripted endgame fires with two survivors, deeper terminals carry later timestamps, evidence is small and cumulative, and some cases are unsolvable by design; characters notice things because they can see them, not by dice.

**YAIR mapping**: a household or sect incident (AD1, AD2) simulated fine-grained and exposed only as records fits the lore history and chronicle UI. A player-written verdict checked against stored truth fits the sealed-secret rule. The knowledge-conditioned message variants map to storylet text keyed by what the witness already knew (no `src` equivalent found; `lore_history_state.js` receipts carry `known` and `audience` fields, which is the same idea at event level).

### P7. Signal Garden (samkeeper, PROCJAM 2020)

Build: itch HTML5, plain jQuery site, `html-classic.itch.zone/html/3098038/Signal Garden Compiled/`, files `scripts/randomgenREVAMP2branch5.js` (52,020 bytes), `TestEP/Winter/Actions3branch5.js`, `State2branch5.js`, `actionlistProcjam.js`, `dictionariesProcjam.js`. License none stated.

**Systems (source)**
- **A grammar engine with memory.** Tracery-like bracket calls over dictionaries, plus saved variables that keep the whole chosen subtree (not just text), hidden saves, a global push that outlives one generation, tags on lines with first/second/any/rare selection, joiners, pronoun sets and text post-processing.
- **State-conditional weights.** A line can carry a chance that depends on a stored variable (`%?var=x?100:0`), and the action and line selectors multiply base chance through a state tag lookup, so the same grammar yields different content as stored state changes.
- **A global state tracker** with timed qualities: it records how long a quality has held the same core value, and zeroes the timer when it changes. Only the global scope of the generator is exported to state.

**YAIR mapping**: `src/name_grammar.js` and `generated_people.js` already cover plain grammars. New: saved subtrees with global-scope export (a generated person's fields reused by later lines), and weights that read stored state without code. Related to `src/models` encounter profile weight modifiers (7 files matched), so check overlap before building.

### P8. You wake up in a new town (Rumpel Rodriguez, PROCJAM 2018)

Build: itch HTML5, Twine Snowman, single `index.html`, 151,514 bytes. License none stated.

**Systems (source)**: a persistent cast of 12 NPCs (name, three likes, an affinity counter) is created once; each new day regenerates the town (name, landmark from a place table with synonyms and qualities) and samples three cast members into it. Talking checks shared likes with the player; first affinity adds a friend and records the person under "misses"; the next town reports which friends are absent. The cast persists across regenerated places, so loss is a real stored fact.

**YAIR mapping**: AD4 and revisiting worlds: a persistent small cast resampled into regenerated settings, with absence tracked as state. Thin game, one idea.

### P9. KINGMAKER (fixgritt, PROCJAM 2023)

Build: Unity 6-era WebGL, `html-classic.itch.zone/html/9280185/kingmaker_web_build_wfullscreen/Build/*.data.br` (8,369,642 bytes, the host served it uncompressed) and a 19,205,022-byte wasm. Il2CppDumper ran on v29 metadata (`dump.cs`). Content lives in ScriptableObjects with no type trees, so story text is **not recovered**; the data model is. License none stated.

**Systems (source, names only)**: a phase chain location, type, title, conflict ("infamy" of four classes: political, magic, person, reaction), resolution, story, each phase offering three generated choices. Every choice carries points toward four ending families (death, disappear, ascend, changed) via `PlayerLocationPoints`, `PlayerTypePoints`, `PlayerConflictPoints`; the title is a prefix plus suffix built from tags; the ending is picked from a "linked" pool keyed by tags or a "bespoke" pool, and a second ending line is chosen by tag match with a default. The data model (source, `dump.cs`): an `Ending_01` asset has four family flags, a text, a default second line and a list of `Ending_02` matches; each `Ending_02` has text plus a list of tag strings; an `Infamy` asset has four class flags, a conflict text and a list of resolution texts. This is a tag-point scoring scheme that makes the ending depend on every earlier choice without branching trees.

The state tags that choices set and endings and titles consume (found as raw strings in the scene data, source): strong or weak state, weak population, magic, no magic, curse magic, godblood, tyrant, craftsman, rebellion, war, haunted, radiation, lover, spy, witch, cannibal and a few more. Titles are prefix and suffix pairs gated by tags (for example the burned, the rootbound, first of their name). So choices set world-state tags, and prose is gated by them.

**YAIR mapping**: chronicle epitaph or a character's legend summary built from accumulated tag points over a life, using AD4 history. Small.

### P10. Castaway Trails (Edudelm, playtest 0.1.4)

Build: Unity WebGL, `html-classic.itch.zone/html/18709887/Build/01_Playtesting.data.br` (133 MB; 99.8 MB of it is one resource file). Metadata v39: my name parser failed, so I read raw name strings with a byte split. Text not recovered; serialized behaviors unreadable. License none stated.

**Systems (source, names only)**: personality traits are Big Five requirements (`Openness`, `Conscientiousness`, `Extraversion`, `Agreeableness`, `Neuroticism` with `PersonalityRequirement`), traits (`PsychologyTrait`) carry hunger, watch, salary and reaction modifiers, conversation topics (positive and negative), incompatible traits and a compatibility check. A relationship is points per pair with `RelationshipModifierData` (positive value, negative value, solve percent, expiration time, tag multipliers), `RelationshipUpgrades` holds positive and negative events per relationship tag and tracks `Discussed` and `TimesDiscussed`, and an "issues" list gives problems that can be solved or ignored. The group manager handles `HandleRelationshipEvent`, memories added to the group, salaries, hunger and fatigue, followers who can leave.

**YAIR mapping**: companions (existing systems, see the companions audit) could carry relationship events with expiry and a "discussed" count so an unresolved grievance ages out or escalates. Grep found no `src` file with expiring relationship issues.

### P11. Worlds - History Simulator (DrTardigrade, v0.3.4-02, on hold)

Build: free Windows zip (`WorldHistorySim_034_02_win64.zip`, 47,571,900 bytes, SHA-256 `a2514a4f…1194f2`, from itch's anonymous download link), unpacked into its own directory. Never run. Unity mono build; I did not decompile the engine. The finding is the **mod data**: the game's rules ship as editable JSON with plain-text guides (`Mods/Base`, `Mods/Base_033`), so rule structure is source, read directly. License none stated for the code; the mod files are shipped for modders to edit (ideas only).

**Systems (source, mod data and guides)**
- **World model.** Terrain cells with altitude, rainfall, temperature, arability, accessibility and foraging capacity; biomes assigned from climate. Population groups per cell hold **knowledges** with levels (agriculture, shipbuilding, social organization) and **skills**; groups merge into polities (tribes) made of **factions** (clans) with a core group, a leader (charisma, wisdom), an influence value, an administrative load, and four preference axes (authority, cohesion, isolation, aggression).
- **Discoveries are data rows**: id, gain conditions, hold conditions, gain effects and loss effects (for example boat making adds a knowledge with level 1, raises its limit by 10 and grants a skill; losing it removes them). Eight base discoveries (boat making, rudders, sailing, keels, plant cultivation, terraced irrigation, slash and burn, tribalism).
- **Conditions and effects are a small string language.** Conditions: knowledge level, population, altitude, rainfall, temperature, arability, with NOT, AND, OR and neighbor quantifiers (any, all, at least N neighbor groups or cells). Effects are assignments such as `target.knowledges.add(...)`. **Factors** are values between 0 and 1 (with square and inverse operators) that multiply a base time-to-trigger, so how soon a discovery event fires depends on local conditions.
- **Decisions and events as data.** An event assigns itself to a group on spawn or when polity or core counts change, computes named properties (a random present tribe, the closest faction, core distance, a distance factor), checks assignment and trigger conditions (a clan far from its core, administrative load over a threshold, cohesion under a limit, the group's knowledge of social organization high enough), then fires a decision on a faction. The split-clan decision derives "can prevent the split" from authority, cohesion and administrative load, scales the influence transferred and the new clan's starting relationship by the leader's charisma, and shows conditional description fragments that explain why the leader could not prevent it. Options carry their own effects; a "probability adjective" function turns a number into a word shown to the player.
- **Player actions** are the same shape (access conditions, execute conditions with human-readable failure info, effects that trigger a decision), grouped in categories (territory, diplomacy).
- **Procedural languages.** A language generator "translates" English words defined in the data (nouns with plural marks, agent nouns from verbs, noun adjuncts, verbs by person and tense, phrase associations with prepositions and grammatical forms), so each polity names its own places and things consistently. Region attributes and elements are named through this path.

**Representations (stated and source)**: map modes and overlays for population, culture and technology; take over a polity faction and influence its events; a modding guide per data type.

**Improvements**: guides and a versioned `Base_033` copy alongside `Base` show that the author keeps the old data format documented per release.

**YAIR mapping**: this is the closest match to YAIR's own rule direction (AD1 rules per world, AD38 mechanisms not allowed-outcome lists, AD3 hidden rules). Direct parallels: knowledge levels with limits, discovery rows with gain and hold conditions and symmetrical loss effects, factors that scale event timing, decisions that explain themselves with conditional text and a probability word, and a per-polity generated language for names. YAIR `src` already has seeded streams and a name grammar; what it lacks (grep) is a condition and effect string language with hold conditions, so a lost prerequisite revokes a discovery. Cross-check with `src/lore_history_state.js` and the chronicle for where decision explanations would be recorded as causes.

### P12. ProcTown (VersiChrist, PROCJAM 2020)

Build: free Windows zip (`ProcTown.zip`, 24,570,766 bytes, SHA-256 `5c3650bc…563d6`), Unity mono, `Assembly-CSharp.dll` decompiled with the project's ILSpy CLI (11 small files, about 19 KB). Never run. License none stated.

**Systems (source)**: thin. Each house spawns one to three people: a first adult with a random gender, an optional spouse of the other gender (linked both ways), and an optional child (profession "Child", linked to both parents). Profession comes from a ten-entry list indexed by building type and gender. Each person gets a name from first and surname lists, one random personality, a like, a different dislike, and a quote. Randomness is unseeded `Random.Range`. No memory, no relationships beyond family links, no history.

**YAIR mapping**: nothing new; a confirmation that household-first spawning (a family unit with linked references) is the cheap way to get a connected cast. Useful negative result: "AI people" here means flavor fields only.

## Stated only (not decoded)

- **CultGame** (Bucephalus Studios; devlog, in development, ASCII text, not browser playable): history is a sequence of episodes (war, disaster, peace) chosen by weights that each episode changes for later picks, which builds arcs; chosen episodes create characters, factions, sites and map conditions at world start (a war episode starts the two factions already at war). No details on storage, seed or UI found. Source not available.

## Cross-cutting patterns worth a design pass (proposals)

- **F1** Stored standing-relation matrix between factions, with wars and alliances derived by rule and logged with named causes (Azgaar). Gives AD4 histories something to differ on per world.
- **F2** Ledger-then-ending: decay-only counters feeding a generated societal summary (Seedship) and a few stored variables from which ruins are drawn (Nothing Beside Remains).
- **F3** Post-hoc story recognition over stored receipts, thresholds in config (Talk of the Town).
- **F4** Reciprocal, asymmetric relationship templates with world-roll exclusions (Eigengrau's).
- **F5** Scanner-style confidence ladders for revealing generated attributes (Seedship), a finer version of AD3.

## Top findings

1. **Worlds - History Simulator's data-driven rules** (new): discoveries, decisions and events as editable rows with gain and hold conditions, symmetrical loss effects, timing factors and self-explaining decision text. Closest to YAIR's own direction; see P11.
2. **Azgaar's diplomacy matrix plus derived wars** is the most reusable history mechanism: one stored matrix, wars decided from power and expansionism, vassals and allies joining or defecting, each step logged with its cause. Matches AD4 and `lore_history_state.js`.
3. **Seedship's ledger and ending** shows how to make a generated outcome feel earned: counters only fall, events read them, the ending reads them.
4. **Talk of the Town's story recognizer** finds love triangles, rivalries and misanthropes in finished state instead of scripting them; salience scores say who matters to whom.
5. **Eigengrau's roll-plus-modifier stack** with derived descriptions is a clean model for per-world dials (AD1) and for generated settlements, with relationship templates that carry reciprocal labels.
(Also noted: Nothing Beside Remains and Condition Unknown, see P5 and P6; KINGMAKER's tag-gated prose, P9.)

## Verification

Read statically, as code: Seedship (all 119 passages extracted; planet generator, culture, technology, event picker, rogue-program event and share-code encoder read), Eigengrau (three source files plus tree), Azgaar (six source files, key sections), Talk of the Town (eight files, partial), Signal Garden (five script files, partial), the new-town Twine (one file).

Read as build metadata only (names, no logic, no game text): Nothing Beside Remains, Condition Unknown, KINGMAKER, Castaway Trails. Route: UnityWebData container unpacked with a small parser, UnityPy 1.25.4 from the project toolset (`doctor --probe` passed), `global-metadata.dat` parsed for names and string literals. Il2CppDumper (project toolset) was run on Condition Unknown and KINGMAKER (wasm plus metadata): Condition Unknown's templates and class layout are recovered; KINGMAKER's data model is recovered but its story text sits in ScriptableObjects without type trees. It was not run on Nothing Beside Remains (asm.js is unsupported) or Castaway Trails (metadata v39 is newer than the dumper handles), so those two stay at field and method names; their grammar corpora and text are **not recovered**. Method bodies were not decompiled for any of the four, so logic claims are limited to names, field layouts and templates. Devlog text for NBR and Condition Unknown was fetched through a summarizing reader and is labeled stated.

Native downloads, with Weibao's permission: Worlds (Windows zip, 47.6 MB) and ProcTown (Windows zip, 24.6 MB), each in its own directory under `private/procgen/dl/`, unzipped and read statically; nothing was launched. ProcTown's managed assembly was decompiled with ILSpy; Worlds' engine assembly was not (its rules are in the shipped JSON). The macOS Worlds build was not downloaded.

Audit pass on this file: I re-checked claims against the saved source and corrected three (Seedship malfunction curve and first-planet rule; Azgaar campaign storage). Deity names drawn from the owning culture (Azgaar) are confirmed in source. Still inferred, not read: Eigengrau's profile pages, and anything about Talk of the Town's knowledge model beyond `mind.py`.

Not read: map layout code, rendering code, Eigengrau factions and plot hooks, Talk of the Town `person.py` beyond greps, Frostward and Colony Adventure (covered elsewhere or native). Nothing was executed or played; no native downloads. About 140 tool calls in total, over the 80 budget (extra passes added on request). Raw files and hashes are under `private/procgen/` (gitignored); itch page fetches were spaced 3 to 4 seconds apart, with one 429 (Worlds History Simulator) not retried.
