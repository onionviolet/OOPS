# R1: how existing games give each mechanism its own form

Lane R1, 2026-11-10. Research only; no rule is accepted by this file. Context: UR93-UR99 in [UI rules](../../UI_RULES.md) and rounds 39 and 40 of the [UI design core audit](../../audits/UI_DESIGN_CORE_AUDIT.md). Levels used below are UR98's: L2 layout, L3 mechanism form, L4 world dress, L5 diegetic frame.

## How to read this file

Evidence tags: **[S]** a fetched page said it (source URL given). **[K]** from my own knowledge of the game, not verified in this lane; treat as a lead. **[?]** could not be verified. Search-engine snippets and wiki pages were the main yield: several developer-talk pages (GDC Vault, Medium, 80.lv, PC Gamer) returned 403, empty, or intro-only text, so "why the developers chose it" is thin for some entries and is marked. Quotes are avoided; everything is paraphrased.

Cost lines say what the sources say. Where they say nothing, the entry says "not stated" rather than guessing.

---

## Part 1: references

### 1. Cultist Simulator (Weather Factory)

1. **Mechanism.** Time-limited "verbs" (Work, Study, Dream, Explore) that take cards, run a timer, and return cards. Funds drain, cards burn away, a bad end explodes the table.
2. **Form and how it teaches.** The whole game is one table of cards and verb windows. A verb window has slots that accept only certain cards, so the shape of the slot is the rule. Combining cards is discovered by trying, in the manner of RPG crafting [S].
3. **Material, type, motion.** Deliberately minimal and dark: the developers describe a lonely figure in a dark room moving people and things around [S]. Timers visibly burn cards. Tone comes from short text snippets, not art [S].
4. **What reacts.** Timers tick on the verb, cards expire, a failed run changes the table. Under the hood a recipe system matches aspect counts; the player sees only results, not thresholds or chains [S, Weather Factory content-framework post].
5. **Cost.** Card-only UI was chosen partly to keep costs low and tests cheap [S]. Total budget about 142k GBP, ten freelancers [S]. The author built a JavaScript prototype of the loop first [S]. The no-tutorial choice was the most contested and needed late clue text and UI work a month before release [S].
6. **Fit.** L3 (verb window as the form for a rite or mixing), L2 (a table of slots). The warning is for onboarding: hidden rules need UI hints, which cost real money late.
7. Sources: https://gamedeveloper.com/design/why-the-i-cultist-simulator-i-devs-built-their-lovecraftian-game-on-a-house-of-cards ; https://www.gamedeveloper.com/business/cultist-simulator-the-retrospective ; https://weatherfactory.biz/nerdpost-content-frameworks-in-cultist-simulator-and-book-of-hours/

### 2. Book of Hours (Weather Factory)

1. **Mechanism.** Study books, work at stations in rooms, combine skills, aspects and ingredients, across a calendar of hours and seasons.
2. **Form.** Workstations (range, plot, mirrors, piano) are verbs with pre-fitted rites; unlocking a room unlocks its station, so house layout is the progression map [S]. Puzzles are built on aspects, small symbols for knowledge, emotion and mystic force [S, review]. Deep lore is optional and shown separately from the main text, linked through aspects [S, review].
3. **Material.** A medieval prayer-book setting suggested by the title [K]; specific type, material and motion choices: [?].
4. **What reacts.** Slots open and close as a recipe runs; a preview text appears when the UI predicts candidate recipes [S].
5. **Cost.** Not stated. The framework post says verbs became ordinary elements with aspects, which the author found more readable [S]. Player feedback reports a learning cost: some never knew what they were doing [S, Reddit quote via search].
6. **Fit.** L3 and L2 together: the room is the layout, the station is the form. Aspect symbols are an L1/L4 glyph set. Strong match for our "vessel for mixing" and "altar for rites".
7. Sources: https://weatherfactory.biz/nerdpost-content-frameworks-in-cultist-simulator-and-book-of-hours/ ; https://weatherfactory.biz/?p=12838 (early draft post) ; reviews found by search, e.g. https://www.noobfeed.com/reviews/book-of-hours-review . Wikipedia's "Book of Hours" URL is the medieval book, not the game.

### 3. Opus Magnum and Zachtronics

1. **Mechanism.** Build an alchemy machine from arms, glyphs and tracks that turns inputs into a product; score on cost, area, cycles.
2. **Form.** The mechanism is drawn as the mechanism: arms move parts on a board, and you watch the factory run. A small toolset combines into emergent behavior, and costs let players optimize different axes [S, Game Developer "Road to the IGF"]. The form teaches by being executable: the picture is the program. [K] A timeline of instructions under the board shows what each arm does at each step.
3. **Material.** The sources note clockwork-like circular motion that came out of the design space, not a style decision [S]. Alchemical theme is dressing over a systems puzzle.
4. **What reacts.** Running the machine animates it; players can export it as a GIF to share [S]. Leaderboards and histograms of other solutions [K] pull players to optimize; the designers deliberately gave no in-game reward for it [S].
5. **Cost.** Not stated. [K] Custom engine and a bespoke instruction UI; heavy.
6. **Fit.** L3. This is the strongest model for a vessel/mixing form and for a "route" form: the figure shows the process, and a run replays it. Our cheap version: SVG parts plus a replay of the quote.
7. Sources: https://www.gamedeveloper.com/business/road-to-the-igf-zachtronics-i-opus-magnum-i- ; https://www.gamedeveloper.com/design/video-zachtronics-approach-to-open-ended-puzzle-design (talk summary only, no interface detail)

### 4. Potion Craft (niceplay games)

1. **Mechanism.** Grind ingredients, mix them in a cauldron; each step moves a marker across a map of potion effects.
2. **Form.** The mixing is a path on a 2D map: ingredient choice and how finely it is ground or mixed bend the course, and the potion's properties come from where the path lands. The map starts shrouded, so using new ingredients explores it [S, Wikipedia].
3. **Material and motion.** Physical mortar, pestle and cauldron with tactile actions. A third-party piece praises the UI craft [S, title only; the page returned 403, so details [?]].
4. **What reacts.** The marker moves as you add and stir; closeness to an effect location sets strength; customers' requests judge the result [S].
5. **Cost.** Not stated. Founder says it grew from earlier alchemy games and a Kingdom Come: Deliverance minigame; he found that minigame's controls rigid [S, Shacknews intro]. The claim that it aimed away from menu crafting is from a low-authority page [?].
6. **Fit.** L3 vessel with an L2 map underneath. For a mixing UI, "the recipe is a path on a space of effects" is a form, not a list.
7. Sources: https://en.wikipedia.org/wiki/Potion_Craft ; https://www.shacknews.com/article/127752/how-kingdom-come-deliverance-influenced-potion-craft-alchemist-simulator ; https://medium.com/@saragiraltfdez/potion-craft-and-its-lovingly-well-crafted-ui (403)

### 5. Inscryption (Daniel Mullins)

1. **Mechanism.** Card battles on lanes where sacrifice is the cost, wrapped in a cabin of puzzles and a hostile host.
2. **Form.** There is little menu UI. Objects in the cabin show state and hold progression; the cabin also carries progress across runs and suits a first-person card game [S]. A reader of the game calls the cabin a diegetic room and a rules archive [S, search snippet, low authority].
3. **Material and motion.** Low-fi visuals, soundscape and an uncanny host set the mood [S, interview snippet]. The low resolution forced cards to show only the name as text and sometimes icons over art [S].
4. **What reacts.** Objects in the room respond to rules, and the host interrupts and modifies the table [S, snippet].
5. **Cost.** Built in Unity and Photoshop; the developer did not compose the music or make the sound or the 3D art from scratch [S]. The core rules came out of a 48-hour jam [S].
6. **Fit.** L5 diegetic frame, with the lesson that a frame is cheapest when it reuses one fixed scene (a room) and uses objects as state readouts.
7. Sources: https://www.gamedeveloper.com/design/how-game-jam-sacrifices-became-inscryption ; https://gamerant.com/inscryption-interview-horror-genre-medium-blending-world-design/

### 6. Pentiment (Obsidian)

1. **Mechanism.** Dialogue and investigation in a 16th century Bavarian setting where social standing and knowledge shape what people say.
2. **Form.** Typography is the form. Five type families, over 2,700 glyphs, stand in for voices because there is no spoken dialogue: scribe, peasant, humanist, monastic and printer type each signal education, class or medium [S, Lettermatic]. Handwriting can shift as the protagonist's view of a person shifts [S, search summary].
3. **Material and motion.** Text is written stroke by stroke on screen from per-glyph stroke data, including period spelling quirks and ink effects [S].
4. **What reacts.** Speaker, status and mood choose the script; the text appears as if being written [S].
5. **Cost.** Heavy but bounded: over 50 pages of mood boards, hand-inked glyphs, multiple alternate letterforms per letter, ductus diagrams cut into strokes, and a custom tool to animate them, over many months [S]. Accessibility: a setting forces the most legible script, and an optional long s [S].
6. **Fit.** L4 world dress and L1 marks. For us the cheap form is a small set of voices per world (UR99, DSG13): choose 3 to 5 typefaces or styles keyed to speaker kind, with a legible override.
7. Sources: https://lettermatic.com/custom/pentiment ; https://pcgamer.com/how-pentiments-hand-crafted-fonts-give-pen-and-ink-a-voice (page text truncated)

### 7. Return of the Obra Dinn (Lucas Pope)

1. **Mechanism.** Deduce each crew member's name and fate from frozen death scenes.
2. **Form.** A logbook is the whole interface: portraits, crew list, ship plan, a fate catalogue. Each death fills basic details automatically; you name who was present and pick a cause from a catalogue. Correct fates are only confirmed in sets of three (two for the last six), which blocks brute force [S, Wikipedia]. Ten events split the story into chapters, so the logbook is also the timeline [S].
3. **Material.** 1-bit dithered look inspired by early Macintosh games; every shape gets an inverse outline so form stays readable; the dither is anchored to the scene so it does not swim [S]. Dither type took several tries after viewer discomfort [S].
4. **What reacts.** A pocket watch replays the seconds before a death; the book updates entries and confirms in batches [S].
5. **Cost.** Planned crew shrank from 80 to 60, and the 2014 demo's tools did not scale, adding almost a year [S]. Pope favors a rigid, simple core mechanic [S].
6. **Fit.** L3 case board for investigation: fill a matrix of identity by fact, with batch confirmation as the integrity rule. L4 material comes from one deliberate palette limit.
7. Sources: https://en.wikipedia.org/wiki/Return_of_the_Obra_Dinn ; https://gamedeveloper.com/design/for-lucas-pope-i-return-of-the-obra-dinn-i-was-a-bunch-of-appealing-design-problems

### 8. Disco Elysium (ZA/UM)

1. **Mechanism.** 24 skills in four attributes; a Thought Cabinet of slotted ideas that take time to internalize and give bonuses with drawbacks [S, Wikipedia].
2. **Form.** Skills speak as inner voices in the dialogue log, offering suggestions you can follow or not, depending on points invested [S]. The log is a rising column of text because the team modeled it on a social-feed pattern where people skim for the gist [S, 80.lv]. The Thought Cabinet is a slot grid with timers [S].
3. **Material.** Painterly isometric look; white conversation text, orange choices over the scene [S]. Per-skill colour and voice style: [K], not verified here.
4. **What reacts.** Passive checks interrupt the log in the background [K from a 2017 interview via search; unverified detail]. The cabinet slots progress with in-game hours [S].
5. **Cost.** Not stated for UI. The game's cost is mostly writing.
6. **Fit.** L3 for "voices": give each skill or companion a recognizable text treatment in the Reports log, so one stream reads as many speakers. Directly serves our divination, oath and cultivation insight lines.
7. Sources: https://en.wikipedia.org/wiki/Disco_Elysium ; https://80.lv/articles/disco-elysium-working-on-ui-design

### 9. Citizen Sleeper (Gareth Damian Martin)

1. **Mechanism.** Each day you roll dice and place them on tasks; the body degrades and needs upkeep [S].
2. **Form.** The dice are the character's body and time. The sequel says this explicitly: dice take damage, break, are repaired with a glitch you must wait out, and stress is tracked on a gauge [S, AV Club]. Low rolls are made useful on data-cloud tasks and are not simply bad [S].
3. **Material.** Tabletop-derived (a faction system from Blades in the Dark, no dice at first) [S]. Specific visual and type choices: [?].
4. **What reacts.** Dice reflect harm and stress; a "push" trades stress for a better roll [S].
5. **Cost.** Not stated. The idea cost little because it reuses a single object (a die) for many facts.
6. **Fit.** L1 mark made meaningful: one drawn object carries body state, so the figure shows capacity. Fits our lives, cultivation and care surfaces. Note the ring-of-pips risk if every die is the same pip.
7. Sources: https://www.avclub.com/bodies-and-long-term-harm-gareth-damian-martin-discusses-citizen-sleeper-2 ; https://en.wikipedia.org/wiki/Citizen_Sleeper

### 10. Slay the Spire (Mega Crit)

1. **Mechanism.** Deck-building roguelike on a branching map of encounters, with relics as persistent rule changes.
2. **Form.** Enemy "intent" icons show the next move, and the team added numbers because playtesters found them more engaging and it removed memorizing symbols [S, Wikipedia]. The spire map is a branching path with typed nodes, inspired by FTL [S]. Relics are permanent buffs [S].
3. **Material.** Card frames per character [?]; not described in the sources fetched.
4. **What reacts.** Intents update every turn before commit; this is the standard example of showing a pending result (UR95). Pick-rate and win-rate metrics drove balance [S, talk summaries; one unverified blog claim excluded].
5. **Cost.** An early interface was reported to have almost hurt the game; a server fix is a search snippet only [?].
6. **Fit.** L2 route (branching map with typed nodes) and L1 (relic as an icon with a one-line effect). Intent-with-number is the cheapest high-value reaction pattern for our fights and contracts.
7. Sources: https://en.wikipedia.org/wiki/Slay_the_Spire ; https://gdconf.com/news/learn-slay-spires-successful-metrics-driven-approach-game-balancing-gdc-2019

### 11. Hades (Supergiant)

1. **Mechanism.** Boons from Olympian gods modify attacks, each with a theme.
2. **Form.** Colour and effect identity per god (Zeus lightning, Poseidon water, Aphrodite pink) make a boon readable by hue and effect before its text [S, partial; a reader comment argues colours also signal damage type, low authority]. Supergiant's own patch notes show they tuned pickup colours to be more distinct [S].
3. **Material and motion.** Effects by a VFX and UI artist, per-god effect signatures [S, 80.lv intro only; process detail [?]].
4. **What reacts.** Pickups, hits and boon effects use the god's signature on the field [K].
5. **Cost.** Not stated.
6. **Fit.** L4 world dress and L1 mark: a per-faction colour plus one effect signature. A readable-at-a-glance relic or boon is a mark that has one hue, one glyph and one verb.
7. Sources: https://www.supergiantgames.com/blog/5 ; https://80.lv/articles/a-behind-the-scenes-look-at-the-effects-in-hades

### 12. Caves of Qud (Freehold Games) and Dwarf Fortress (Bay 12)

1. **Mechanism.** Dense simulated worlds with procedural histories, factions and mutations.
2. **Form.** Colour glyph maps plus a text panel carry the world; the developers lean on abstraction and leave the surreal to the reader's imagination because rendering it concretely would be expensive and less effective [S, Game Developer]. Qud uses monospace glyph graphics, a text log of interactions and faction history, and procedurally generated in-world texts and villages [S]. Dwarf Fortress offers a Legends mode that lists events for people, sites and civilizations with a historical map and XML export; its Steam edition adds an optional tileset you can toggle [S, Wikipedia].
3. **Material.** Text-first; the writing gives creatures and mutations character [S].
4. **What reacts.** The log and the world history update as events occur [S].
5. **Cost.** Low art cost by design [S]. Reviewers call Dwarf Fortress's interface a major difficulty and the developer said interface work was not a priority, so fan tools filled the gap [S]. Lesson: density without form shifts the cost to the player.
6. **Fit.** L4 and L5: a text-forward game can stay distinct through voice and a history surface (an in-world chronicle) rather than art. Warn against the dense-menu failure.
7. Sources: https://www.gamedeveloper.com/design/tapping-into-the-potential-of-procedural-generation-in-caves-of-qud ; https://en.wikipedia.org/wiki/Dwarf_Fortress

### 13. Sunless Sea (Failbetter) and Kentucky Route Zero (Cardboard Computer)

1. **Mechanism.** Sea voyage with slow movement, resources and story events (Sunless Sea); a road journey made of text choices and interludes (KRZ).
2. **Form.** Sunless Sea runs combat and travel in the same map mode, events appear as card-like storylets with skill checks across five named skills [S, Wikipedia]; the slow pace is meant to build unease [S]. KRZ's reasoning, in the developers' words, is that consequences are words committed to the record, and the interface moved toward point-and-click when they removed puzzles [S, Game Developer]. [K] KRZ uses a stylized map-and-road figure and typographic effects (for example a shader on the word "Zero"); the Boing Boing post named in search results was not opened [?].
3. **Material.** Gothic sea and dim lighting for Sunless Sea [K]; KRZ uses flat colour theatre-like staging [K].
4. **What reacts.** Terror, fuel and cargo [K, unverified; the Wikipedia fetch did not list them]. KRZ choices accumulate in text [S].
5. **Cost.** Not stated.
6. **Fit.** L2 route and L5 frame. A route form that keeps travel and the encounter in one view is a model for our travel surface.
7. Sources: https://en.wikipedia.org/wiki/Sunless_Sea ; https://www.gamedeveloper.com/design/-taking-genre-conventions-as-your-starting-point-is-kinda-boring-

### 14. Idle and incremental games: A Dark Room, Kittens Game, Antimatter Dimensions, Melvor Idle

Source quality here is weak; most fetches failed (404, 402, wrong page). Treat as leads.

1. **Mechanism.** Numbers that grow and unlock new numbers.
2. **Form.** A Dark Room unfolds as text: idleness and time passing become part of the game, and the designer built for distracted players before the first reveal [S, InformIT summary via search]. Kittens Game is described as unfolding in paradigm shifts as scale rises, with storage caps that discourage unbounded numbers [S, community comments in search results, low authority]. Melvor Idle models RuneScape-like interlinked skills; each skill has a purpose and links to others [S, secondary coverage]. [K] Antimatter Dimensions adds a new tab and a new view with each prestige layer, so the layer's own metaphor gets its own screen; not verified.
3. **Material.** Mostly text and bars. The distinct part is what appears and when.
4. **What reacts.** Progress unlocks tabs and phases [K].
5. **Cost.** Low; these are small-team web games [K].
6. **Fit.** L2 and L5: "the interface itself grows" is the idle-game form of distinctness. We can unlock a form (a chart, a board) when the system opens, not only a number.
7. Sources: https://informit.com/articles/article.aspx?p=2228802 (page fetched was an index, so this is [?]); https://sourceforge.net/app/melvor-idle/ ; https://www.incrementaldb.com/community/review/3568

### 15. Cultivation games: Tale of Immortal and Amazing Cultivation Simulator

1. **Mechanism.** Tale of Immortal: equipped manuals grant skills, passive mind skills strengthen them, "destinies" set starting stats, relationships and disciples matter [S, Wikipedia]. Amazing Cultivation Simulator: run a sect like a colony; realms run foundation to heavenly tribulation; feng shui of rooms and cultivators matters [S, store text and Wikipedia]; a formation diagram uses a hexagonal grid for sect layout [S, store screenshot caption, low authority].
2. **Form.** In ACS the sect is a top-down map and formations are a hex layout, so the mechanism's form is spatial [S]. For Tale of Immortal the sources fetched did not describe the realm or meridian UI [?].
3. **Material, motion, reactions, cost.** Not found. No meridian-chart UI was verified in any source. This is a real gap: cultivation games in this lane did not show a body or meridian chart in writing. Next step is screenshots from the Steam pages and community guides, not more search text.
4. **Fit.** Our body/meridian chart (L3) has no verified precedent here. Candidate precedents to hunt: traditional acupuncture charts, Dwarf Fortress body-part screens [K], and Citizen Sleeper's body-as-dice.
5. Sources: https://en.wikipedia.org/wiki/Tale_of_Immortal ; https://en.wikipedia.org/wiki/Amazing_Cultivation_Simulator ; https://store.steampowered.com/app/955900

### 16. Occult and ritual mechanics UIs

Cultist Simulator's verb window (entry 1) and Book of Hours' station (entry 2) are the nearest examples I could verify: a ritual is slots with aspect rules plus a timer. Inscryption (entry 5) shows the cabin as the altar. No other occult ritual UI was verified in this lane [?].

---

## Part 2: patterns

Each pattern lists the mechanisms it serves and a disposition. ACT NOW means safe inside current work; ACCOUNT FOR NOW means plan for it in the contract of the next surface; LATER means wait.

**P1. Slot shapes are the rules.** (Cultist Simulator, Book of Hours, Disco Elysium's Thought Cabinet, Citizen Sleeper dice placement.) A slot that accepts only certain things teaches the rule without text, and a timer on it teaches duration.
Serves: rites (altar), mixing (vessel), contracts (clauses), cultivation (practice slots).
Disposition: **ACT NOW.** Effort: S per surface. Done check: with labels covered, a tester can say what each slot accepts, and the slot rejects a wrong item with one line of reason.

**P2. One drawn object carries the state.** (Citizen Sleeper dice, Obra Dinn logbook, Inscryption cabin objects.) A single object that shows a body, a case or a run beats a panel of stats.
Serves: lives and care (body), investigation (case board), progress.
Disposition: **ACCOUNT FOR NOW.** Effort: M each. Done check: the surface names its one carrier object in the UR76 card, and a screenshot reads without the stat rows.

**P3. The map is the recipe.** (Potion Craft, Slay the Spire, Sunless Sea.) Mixing or travel as a path on a space shows what a choice does to the result.
Serves: mixing, travel route, formations, divination.
Disposition: **ACCOUNT FOR NOW**, prototype one. Effort: M to L for an interactive version, S for a drawn, seeded one. Done check: adding an ingredient or stop moves a marker before commit using the real quote (UR95).

**P4. Show the pending effect, with numbers.** (Slay the Spire intents; Potion Craft marker.) Playtesters preferred the number to the symbol, and it removed memorizing icons [S].
Serves: fights, contracts, rites (risk builds), travel.
Disposition: **ACT NOW.** Effort: S. Done check: every committing surface shows its quoted result before the commit, with the number.

**P5. Voice as form.** (Pentiment type families, Disco Elysium skill voices, KRZ words as consequence.) Typography and speaker style carry class, mood and source of a line.
Serves: Reports, divination answers, oaths, dialogue, contracts.
Disposition: **ACT NOW** for 3 to 5 voices per world using type and weight; **LATER** for stroke-by-stroke animation. Effort: S for styles, L for animation (Pentiment's cost shows why). Done check: two lines from different speakers are distinguishable with the names covered; a legible override exists.

**P6. Replay what happened.** (Opus Magnum run and GIF export, Obra Dinn watch.) Re-running the mechanism on the same figure teaches why a result came out.
Serves: mixing, rituals, fights, contracts, investigations.
Disposition: **ACCOUNT FOR NOW.** Effort: M (needs per-step data in the quote). Done check: a "show again" plays the steps on the form and ends in the same result as the log.

**P7. Batch confirmation and rigid core.** (Obra Dinn confirms fates in sets of three.) A small rigid rule keeps a deduction surface honest without hiding it.
Serves: case board, divination, contracts.
Disposition: **LATER.** Effort: S once a case board exists. Done check: the board resolves guesses in batches and shows only counts of right answers.

**P8. Diegetic frame from one fixed scene.** (Inscryption cabin; Cultist Simulator's dark table.) A room whose objects show state is cheaper than many themed panels.
Serves: L5 frames per world (newspaper, jade slip, status window).
Disposition: **LATER** (after each world's basic kit, per UR98). Effort: M each. Done check: the frame holds the same data as the plain surface; switching frames does not change any number.

**P9. Per-faction colour and effect signature.** (Hades gods.) One hue, one glyph and one effect make an item readable before text.
Serves: relics, boons, standings, world dress.
Disposition: **ACT NOW** for hue and glyph; motion signature later. Effort: S. Done check: items are identified at one glance in a grayscale-safe test (hue plus glyph, never hue alone).

**P10. The interface grows as the system opens.** (A Dark Room, idle games [mostly K].) New forms arrive with new capability.
Serves: onboarding for each world, mechanism unlocks.
Disposition: **ACCOUNT FOR NOW.** Effort: S to M. Done check: a new player sees the form appear with its first use, and an old save shows it open.

**P11. Hidden logic needs visible hints.** (Cultist Simulator onboarding cost, Book of Hours learning cost, Dwarf Fortress interface.) Hiding aspect logic makes mystery but also confusion.
Serves: every knowledge-filtered surface (UR80, MDL4).
Disposition: **ACT NOW** as a review check. Effort: S. Done check: each hidden rule has a hint that appears the first time the player is stuck.

---

## Part 3: anti-patterns

Written as defaults with a dial and a reason, as the project asks.

- **Form without a rule behind it.** Default: avoid a figure whose parts encode nothing. Dial: pure ornament is welcome on top of a form. Reason: this is the circles problem; Potion Craft and Opus Magnum work because moving a part changes the result.
- **Mystery without onboarding.** Default: pair every hidden rule with a hint. Dial: how early, per audience. Reason: Cultist Simulator's late clue pass was costly, and Book of Hours players still reported being lost.
- **Dense text with no form.** Default: give dense data a form or a layered detail. Dial: how much, per frequency. Reason: Dwarf Fortress's interface is a main source of its difficulty, and fan tools fill the gap.
- **Colour as the only signal.** Default: pair hue with a glyph and a label. Dial: how strong. Reason: Hades tuned pickup colours; readability still needs shape.
- **Hand-lettered everything.** Default: a few voices per world, not a bespoke font system. Dial: heavier when a world is a flagship. Reason: Pentiment needed 2,700 glyphs, mood boards and a stroke tool over many months.
- **A frame that changes numbers.** Default: a diegetic frame shows the same data as the plain surface. Dial: how much detail the frame hides, per world. Reason: a frame that alters what the player can read is a second UI to maintain.
- **Many forms, no shared grammar.** Default: keep tokens, controls and back behavior shared (UR94). Dial: composition varies freely. Reason: distinct forms with unlike controls cost the player a relearn for each.
- **Static forms that wait for a log line.** Default: react before and after commit (UR95). Dial: reduced motion keeps a static mark. Reason: a form that does not move reads as a form to fill.
- **Claiming a precedent I did not verify.** Default: mark [K] or [?]. Dial: treat [K] as a lead. Reason: most developer talks here were not readable in this lane.

---

## Gaps for a follow-up lane

- No verified meridian or realm chart UI. Look at screenshots for Tale of Immortal and Amazing Cultivation Simulator (Steam pages) and for any acupuncture-chart game UI.
- No GDC talk text was read. Candidates: Mullins' "Sacrifices Were Made" (GDC 2022), Sawyer on Pentiment fonts (GDC 2025), Zach Barth (GDC 2019 and 2018), Giovannetti (GDC 2019). Videos are free on the GDC YouTube channel for some.
- Idle games (Kittens Game, Antimatter Dimensions, Melvor) were not verified at design level.
- Disco Elysium per-skill colours and passive-check display, and Citizen Sleeper's UI, need a screenshot check.
- Potion Craft's UI article (Medium) and Pentiment's PC Gamer piece returned 403 or truncated text.
