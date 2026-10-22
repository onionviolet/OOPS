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

## Screened (27)

Decoded (8): Seedship, Eigengrau's Essential Establishment Generator, Azgaar's
Fantasy Map Generator, Talk of the Town, Nothing Beside Remains, Condition
Unknown, Signal Garden, You wake up in a new town.

Screened and set aside, one line each:

| Title | Why not decoded |
|---|---|
| KINGMAKER (PROCJAM 2023) | HTML5 but a Unity wasm build; story generator from chosen origin, title and event. Not worth the Unity route for a prompt generator. |
| Castaway Trails | Unity wasm, v0.1.4 playtest. Stated: companions' friendships, rivalries, betrayals emerge on the road. Nothing to read statically cheaply. |
| CultGame | Not browser playable. Devlog read, see "Stated only" below. |
| Tree of Heroes | Small stat-challenge puzzle about a lineage; no generator. |
| Peregrin, Infini-Quest, Eternal Night Vale | Text and scene generators (Tracery family); Signal Garden covers the grammar-with-state idea better. |
| Colony Adventure, Frostward, ProcTown | Native-first or already screened elsewhere in this wave. |
| World Map Generator, Procedural Kingdoms Generator, Worlds History Simulator | Map/civ toys; Worlds History Simulator page returned 429, Windows only. Azgaar covers the ground. |
| OpenDnD, Alethea World History Engine, D&D NPC Generator | Names/people lists or Python; no new mechanism over Eigengrau and Azgaar. |
| Press to date, A Tarot Reading, Herbarium | Herbarium is an alchemy prototype and belongs to the potion lane. The other two are card/dating toys. |
| History/worldbuilding tag listings | Mostly educational or map quizzes; no generators found. |

## Decoded

### P1. Seedship (Space Goblin Games)

Build: itch HTML5, `html-classic.itch.zone/html/18244111/index.html`, 1,077,017
bytes, SHA-256 `9b01f14f…c3d044`. Twine/SugarCube, 119 passages in one file
(`<div tiddler=…>` store). Readability: plain. License: none stated (ideas only).

**Systems (source)**
- **Planet generator.** Per attribute (atmosphere, gravity, temperature, water, resources) a roll lands in green, yellow or red bands. A scanner level narrows the range: level 0 rolls the full range, level 1 removes red, level 2 forces green. The first planet is always forced out of the best band so the opening is never a free win. A visible scanner success roll can also fail and widen the range. This is a confidence ladder, not a hidden-or-shown switch.
- **Coherence repairs after the rolls.** Cold planets freeze their oceans (always at very cold, half the time at cold); no liquid water without an atmosphere; moon, caves, plants and animals have chances derived from already-rolled attributes (gravity drives moon and cave odds, atmosphere drives plant odds). Derived facts, not independent dice.
- **Stored state is a ledger.** Ship systems (landing, constructors, scientific database, cultural database) and a colonist count start at 100 and are only ever reduced by events. Nothing is flavor: the ending reads these numbers.
- **Ending is computed from the ledger.** Technology score comes from the scientific database, modified by resources and a metal-rich moon. Culture score comes from the cultural database scaled by surviving colonists, then nudged by planet beauty and alien observers. Score bands pick a named society ("Corrupt Democracy", "Warring Superpowers", "Post-Nuclear Wasteland", and so on), and some bands damage the databases further so the aftermath continues.
- **Event picker.** Malfunction chance rises with visited planets (0 to 5 in 10 by the sixth stop), uneventful and rare events are removed from the pool once used, the same encounter never repeats back to back, and the first two events come from a gentler pool. Events read the ledger (the rogue-program event's text and options depend on how intact the databases still are).
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
- **Past campaigns** are generated per neighbor with start and end years placed before the current year, named from an adjective of the foe plus a weighted type (war, conflict, rebellion, crusade). They are stored on both states, so later queries can ask who fought whom.
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

Build: Unity WebGL, not decoded (route skipped). Evidence is the developer's devlog and page comments: **stated**, not source.

- A simple society simulation runs until one of three collapses (ecosystem, population, crops) with tuned parameters so each ending is about equally common. The sim tracks population groups, crops, a few cosmetic traits and a sacred number.
- Text comes from Tracery-style templates whose tags the society fills; the sacred number leaks into small descriptions (chairs with three legs), and the main engraving image is chosen by the collapse cause.
- The world is rendered after the simulation from final values only: weathering scales with climate numbers, toy counts with surviving population, predator remains and the weed-to-crop ratio hint at the cause. Ecosystem health cannot recover, so the final state is the only readable one.
- The developer regrets low clue density and haphazard placement, and that rendering happens after the sim so layout cannot reflect history. No seed (considered, not shipped); each world can be visited once.

**YAIR mapping**: AD3 and the discovery work in [world secrets](../../worlds/WORLD_SECRETS_AND_DISCOVERY.md): keep a handful of stored variables, derive readable ruins and relics from their final values, and tune ending frequencies. A trait that propagates into small descriptions ("a culture's number") is an inexpensive coherence device.

### P6. Condition Unknown (same developer, 2018)

Build: Unity WebGL, not decoded. **Stated** by the developer's devlog.

- A turn-based simulation runs a research station to disaster: layout rooms, terminals and barrels, 5 or 6 researchers, a hostile entity that follows simple rules. Crew behaviors are layered and overlap (no state machine) with a rough three-phase arc (routine, alarm and hiding, a plan) that emerges from the sim; a scripted endgame fires when two survivors remain.
- Events write timestamped messages, 3 or 4 variants each, with names substituted. After the sim ends, messages go onto terminals, deeper terminals getting later timestamps.
- Evidence is deliberately small and cumulative (locations, companions, sounds); some cases are unsolvable by design. Perception is positional: characters "notice a body" because they can see it, not by dice.
- The player writes a cause-of-death report per crew member.

**YAIR mapping**: a household or sect incident (AD1, AD2) simulated at fine grain and then shown only as records is a model for the lore history and chronicle UI. A player-written verdict that is checked against the stored truth fits the sealed-secret rule. Source not read.

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

## Stated only (not decoded)

- **CultGame** (Bucephalus Studios; devlog, in development, ASCII text, not browser playable): history is a sequence of episodes (war, disaster, peace) chosen by weights that each episode changes for later picks, which builds arcs; chosen episodes create characters, factions, sites and map conditions at world start (a war episode starts the two factions already at war). No details on storage, seed or UI found. Source not available.

## Cross-cutting patterns worth a design pass (proposals)

- **F1** Stored standing-relation matrix between factions, with wars and alliances derived by rule and logged with named causes (Azgaar). Gives AD4 histories something to differ on per world.
- **F2** Ledger-then-ending: decay-only counters feeding a generated societal summary (Seedship) and a few stored variables from which ruins are drawn (Nothing Beside Remains).
- **F3** Post-hoc story recognition over stored receipts, thresholds in config (Talk of the Town).
- **F4** Reciprocal, asymmetric relationship templates with world-roll exclusions (Eigengrau's).
- **F5** Scanner-style confidence ladders for revealing generated attributes (Seedship), a finer version of AD3.

## Top findings

1. **Azgaar's diplomacy matrix plus derived wars** is the most reusable history mechanism: one stored matrix, wars decided from power and expansionism, vassals and allies joining or defecting, each step logged with its cause. Matches AD4 and `lore_history_state.js`.
2. **Seedship's ledger and ending** shows how to make a generated outcome feel earned: counters only fall, events read them, the ending reads them.
3. **Talk of the Town's story recognizer** finds love triangles, rivalries and misanthropes in finished state instead of scripting them; salience scores say who matters to whom.
4. **Eigengrau's roll-plus-modifier stack** with derived descriptions is a clean model for per-world dials (AD1) and for generated settlements, with relationship templates that carry reciprocal labels.
5. **Nothing Beside Remains** (stated): few stored variables, tuned ending frequencies, a culture trait leaking into small details; its own post-mortem says clue density was the weak point.

## Verification

Read in full or in part, statically: Seedship (all 119 passages extracted; planet generator, culture, technology, event picker, rogue-program event and share-code encoder read), Eigengrau (three source files plus tree), Azgaar (six source files, key sections), Talk of the Town (eight files, partial), Signal Garden (five script files, partial), the new-town Twine (one file). Not read: any Unity or wasm build (Nothing Beside Remains, Condition Unknown, KINGMAKER, Castaway Trails); their entries rest on developer devlog text fetched through a summarizing reader, so treat them as stated. Not read: map layout code, rendering code, Eigengrau factions and plot hooks, Talk of the Town person.py beyond greps. Nothing was executed or played; no native downloads. About 55 tool calls. Raw files and hashes are under `private/procgen/` (gitignored); itch page fetches were spaced at least 3 to 4 seconds, with one 429 (Worlds History Simulator) not retried.
