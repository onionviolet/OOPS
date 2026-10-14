# Procedural story and content generation: considerations

Claude (root), 2026-10-14. A palette, not a spec. Nothing here is selected for a
build. Request history is in [USER_VISION](USER_VISION.md) (2026-10-14 "Procedural
story generation?" and follow-ups). Current state lives in the
[status map](PROCEDURAL_GENERATION_STATUS_2026-10-13.md). Detailed lanes:
[procgen wave 1](gm/dispatch/procgen-2026-10-13/PLAN.md) P12 to P18.

Baseline (verified 2026-10-14): live randomness only picks among hand-authored
outcomes. P3 (storylet deck, 14 Village cards) and P4 (generated people) are built on
branches and not merged. P12 to P16 were dispatched for quests and arcs, canon and
divergence, history and legends, text and the authoring pipeline, and further
angles. This doc covers what those lane prompts did not name. Where a lane already
owns a topic, the entry here is only a pointer.

Every entry follows standing rules: everything reachable with per-world adjectives,
no fixed "once" limits, reload never rerolls, sealed secrets by ID only, comfortable
idle play, desktop first.

## A. How stories get made

| Code | Idea | Why it matters |
|---|---|---|
| A1 | **Salience casting.** When a card or arc needs an actor, prefer people who already share history with the player (helped, wronged, owed, loved, rivaled) over fresh strangers. A small recurring cast feels like a story; a stream of strangers feels like noise. | Turns P4 people into characters. Cheapest drama upgrade available. |
| A2 | **Planted hooks and payoffs.** Because draws are seeded and saved, the game can schedule a future event and plant hints first: a limp before the injury, debt gossip before the collector. Hooks that never fire decay quietly instead of dangling. | Foreshadowing makes generated events read as authored. |
| A3 | **The future is readable.** Saved streams mean the next N draws already exist. Divination, prophecy, precognition cheats and seers can read the real future, and acting on it changes it. Self-fulfilling and averted prophecies fall out for free. | Uses a property we already guarantee. Links E7 observation and fate. |
| A4 | **Coincidence budget.** Track how often unlikely things happen to the player per world. Cozy worlds allow more; grim or realist worlds spend it sparingly. Protagonist halos and luck cheats raise the budget explicitly. | Stops "everything happens to you" fatigue without banning anything. |
| A5 | **Stakes from attachment.** Threat weight reads what the player invested in: a home they built, a student they trained, a pet. Loss is only meaningful against something cared about. Gentle storytellers protect these; harsh ones aim at them. | Gives D9 pacing a real target. |
| A6 | **Story threads as one registry.** Cards, quests, rumors, legends and chronicle entries reference the same thread id, so a rumor can mention an open quest and a legend can retell a finished one. | Prevents five systems inventing five story stores. P12 and P14 own the shape. |
| A7 | **Counterfactual echoes.** After a big choice, the game can later show what the other branch would have produced: a ghost, a dream, a regressor's memory, a parallel self. | Fits loop and regression worlds. Points to P16. |

## B. More content to generate

These go beyond P6 (creation), P8 (resources) and P11 (context, markets, dreams,
festivals, dungeons).

| Code | Content | Notes |
|---|---|---|
| B1 | **Factions and institutions over time:** guilds, sects, houses, gangs, governments with goals, budgets, membership, internal politics, wars and mergers | NPC plots need groups that want things. Canon factions stay authored; generated ones fill local gaps. |
| B2 | **Exams, tournaments and selections:** Hunter Exam, Chunin Exam, sect entrance trials, school terms with classes and house points, D&D contests | A recurring anime and xianxia structure. One generator with per-world rules serves many worlds. |
| B3 | **Solvable mysteries:** a clue graph generated backward from a truth, checked so it can be solved through means the player actually has | Fits E7 and sealed secrets. Unsolvable generated mysteries are worse than none. |
| B4 | **Myths, religions and cosmologies** for original worlds, plus local cults and saints in canon worlds' gaps | Feeds legends (P14), festivals and divine powers. |
| B5 | **Languages and scripts:** naming phonology per culture (P7), plus untranslated texts where reading them is a skill and a discovery route | Turns names into a knowledge system. |
| B6 | **Laws, crimes and trials:** local law sets, generated crimes with witnesses, bribery, bounties and courts | Gives reputation and villain play real consequences. |
| B7 | **Visual generation:** sigils, heraldry, portraits from parts, item icons composed from material and shape, simple region maps of authored geography | Generated items and people need faces. Cheap SVG composition, no image AI needed. |
| B8 | **Careers and ranks:** generated job ladders, promotions, rivals for the same post, retirement | Life-sim spine (LIFE_SIM_NORTH_STAR). |
| B9 | **Weather-driven and ecological events:** droughts, migrations and blights from simulation state rather than dice | Links P8 ecology and COSMIC_EVENTS. |

## C. Book-world canon, beyond P13

| Code | Idea | Notes |
|---|---|---|
| C1 | **Canon density map.** Generation freedom scales inversely with canon density: tight near the protagonist's key scenes, loose in offscreen provinces, years before canon and ordinary lives. | One per-world dial instead of a yes/no on generation. |
| C2 | **Spoiler dial per world.** Weibao has read some sources fully and others not. Generated rumors, prophecies and NPC chatter respect a per-world spoiler level. This differs from sealed secrets: public twists are not sealed, but they can still be spoilers. | Needs a setting and a tag on canon-derived content. |
| C3 | **Non-canon fill, labeled.** Where the source is silent, a generator may fill the gap, stamped as fill so a later chapter or a better reading can overwrite it. Never presented as canon in UI or docs. | Unbiased lens applied to runtime content. |
| C4 | **Canon characters' offscreen lives.** Plausible daily schedules for canon cast between their known appearances, never contradicting known anchors. Meeting a canon character on a Tuesday should be possible. | Uses P13 anchors and P7 people laws. |
| C5 | **Adaptation versions.** Book, anime, game and fan-wiki versions disagree. Each world picks a canon version, can switch, and stores which one a generated fact came from. | P9 started this with sourceSnapshot. |
| C6 | **Serial sources keep moving.** Ongoing web novels (Shadow Slave, Wandering Inn and others) add chapters. New canon arrives as a reviewed content update; existing saves keep their branch and get a note about what changed. | Same rule as P9: never silent regeneration. |
| C7 | **Power-scale fidelity.** A generated threat or reward must sit inside the world's actual scale at that point in the timeline. A random Sequence 3 in early LOTM breaks the world. | Generators read the era from P13. |
| C8 | **Translation name variants.** Chinese and Korean sources have several translated names per character, place and technique. Store all variants; show the player's preferred one. | Matters for Reverend Insanity, ISSTH, Renegade Immortal, ORV. |
| C9 | **Killing and saving canon characters.** Reachable, with real downstream changes and canon pull where the world has it. Fix-it play (saving someone who died in canon) is a top fan premise. | P13 owns the mechanics. Listed here so it is not dropped. |

## D. Stories as a power source (world-specific)

Several sources make story itself a game mechanic. Here generated narrative feeds
power instead of being decoration.

| Code | Source pattern | Generation hook |
|---|---|---|
| D1 | **ORV stories and constellations:** feats become named stories, and watching sponsors pay for drama | Story sifting (P12) names the player's real feats; generated audience reactions and sponsorships read actual drama. |
| D2 | **LOTM acting method:** potions digest faster when behavior matches the Sequence's role | Generated situations offer in-role chances; the digestion progress reads actual choices. |
| D3 | **LitRPG Systems as diegetic quest givers:** in System worlds, the generated quest board is the world's own entity, with its own rules, rewards and possibly agenda | The P12 quest generator gets an in-world voice. Links the status window work (R15) and P11 CHEAT_VARIANTS. |
| D4 | **Luck, fate and plot armor** (Fated Villain, protagonist halos, cultivation luck) | Gives A4's coincidence budget an explicit in-world resource. |
| D5 | **Reputation as narrative mass:** legends and titles grant power in some worlds (gods fed by belief, Wandering Inn class conditions) | P14 legends become a resource where the world says so. |

P17 explores D1 to D5 per world.

## E. Player control and idle fit

| Code | Idea | Notes |
|---|---|---|
| E1 | **Standing policies.** The player sets values ("help neighbors", "never pay extortion", "spend up to 5 coin on strangers") and idle time answers generated decisions accordingly, labeled as auto-answered. | Strongest idle fit. Makes decisions non-blocking without random fallbacks. Extends P3's safe-expiry choice. |
| E2 | **Taste tags.** More or less romance, horror, politics or slice-of-life; content filters; "more like this" and "less like this" on any card. | Steers weights only; nothing becomes unreachable. |
| E3 | **Stories tab.** Finished and ongoing sifted stories with their cast, readable as a journal and exportable as text. | P14 owns the chronicle. This is the player-facing surface. |
| E4 | **Shareable seeds.** A seed plus a world reproduces the same starting world for someone else; an optional daily seed. | Cheap once P1 streams land. Solo game, so purely for fun. |
| E5 | **Time-skip mode for long lives.** Cultivators live centuries. A skip summarizes generated history, with optional interrupts for big beats. | Pairs with P14 recaps and offline rules (still unselected). |
| E6 | **"Why did this happen?"** Each event can show its causes (receipts, salient people, storyteller state). It helps debugging and is satisfying for players. | Data already exists in P3 receipts. |

## F. Quality, scale and safety

| Code | Idea | Notes |
|---|---|---|
| F1 | **Headless story QA.** Simulate many game-years per seed and measure distinct stories per hour, repetition, dead threads, decision load, softlocks and drama curve. | The only way to tune generators without playing for a week. P18 owns it. |
| F2 | **Generator revisions in saves.** Every generated thing stamps its table revision, so content updates never rewrite existing saves. | P9 proposed fields; needs one shared rule. |
| F3 | **History budget.** Chronicles grow forever. Compact old detail into summaries while keeping receipts that later content reads. | Links the save-scale review I29. |
| F4 | **Leak checks on generated text.** Templates and any runtime LLM must not leak sealed truths or reproduce canon prose. Run a scan in tests. | P15 owns the pipeline; listed as a gate. |
| F5 | **Repetition memory.** Track recently seen phrasings, card families and casts per player so variety holds over hundreds of hours. | Extends P3's seen-decay. |

## Suggested order, if Weibao picks any

Proposal only. Merge P3 and P4, then A1 (salience casting), E1 (standing policies)
and F1 (story QA). Together they turn the existing deck into recurring-cast stories
that run comfortably idle and can be tuned with evidence. Book-world items (C, D)
wait for P13 and P17's per-world reports.

---

## Round 2 (2026-10-14): more to consider

Request: "more to consider? other stuff and more? Save and extend accordingly, use
codex as needed and more?" Lanes P19 to P22 expand G, H, I-J and K respectively.

## G. The social web

| Code | Idea | Notes |
|---|---|---|
| G1 | **NPCs have lives with each other.** Friendships, marriages, breakups, children, feuds and business partnerships form between NPCs without the player. The player walks into situations already in motion. | P4 gives people; this gives them relationships. RimWorld and Dwarf Fortress get most of their stories here. |
| G2 | **Companion arcs from their own past.** Each companion's backstory generates a personal thread (a debt, a lost sibling, a rival master) that surfaces when trust is high enough. | Mass Effect loyalty missions, but generated from P4 data. |
| G3 | **Lineages and inheritance.** Grudges, debts, techniques, heirlooms and reputations pass to children and students. A second generation inherits the first generation's story. | Ties D7 households, P14 history and long cultivator lives. |
| G4 | **Mirror rivals.** A rival whose progress tracks the player's along a parallel path, choosing differently at the same kinds of decisions. | Extends RIVALS_IDENTITIES_AND_FATE. |
| G5 | **Gossip that spreads by contact.** Who knows what about the player depends on who talks to whom. Secrets leak along real relationship edges. | Pairs with P14 rumors; uses G1's network. |
| G6 | **Banter and small moments.** Short exchanges between companions that read their relationship state, recent events and the place. Low stakes, high warmth. | Cheap text (P15). Feeds cozy play. |

## H. Places that remember

| Code | Idea | Notes |
|---|---|---|
| H1 | **Place memory.** Locations collect history: the bridge where someone died, the field of a famous duel, the shop the player saved. Later events and NPC talk refer to it. | Needs place-scoped receipts. Links P14. |
| H2 | **Settlements that change.** Village population, buildings, prosperity, mood and culture shift over years from actual generated events and player actions, and the change is visible. | Life-sim spine. Authored geography stays fixed (P9 rule); occupancy and condition change. |
| H3 | **Several scales at once.** Personal, local, regional, world and cosmic stories run on separate clocks. News from far away arrives late and distorted. | Gives idle time a "the world moves" feel. Offline advancement stays unselected. |
| H4 | **Haunting and residue.** In worlds that support it, strong events leave lasting effects: ghosts, cursed ground, blessed springs, Nen or cursed-energy residue. | Per-world laws from P9 and P10. |
| H5 | **Home stories.** The player's house, workshop or sect hall gets its own events: visitors, break-ins, renovations, pets and neighbors. | Uses P6 buildings. |

## I. Conflict stories

| Code | Idea | Notes |
|---|---|---|
| I1 | **Battles tell stories.** Fights record turning points (last stand, betrayal, a rescue, a fluke) that the chronicle and the people involved remember. | Reads native and party battle receipts. |
| I2 | **Enemies that remember.** Survivors return changed: scarred, stronger, humbled, allied. Nemesis-style, per world. | P12 and P13 cover rival plans; this is the combat-side memory. |
| I3 | **Wars, sieges and campaigns** generated from faction goals (B1), with fronts, supply and refugees that reach the player's village | Needs B1 factions. Long horizon. |
| I4 | **Monster ecology stories.** Predators move because prey moved, nests grow if ignored, and a hunted species fades. | Builds on P8 ecology. |

## J. Economic stories

| Code | Idea | Notes |
|---|---|---|
| J1 | **Booms, busts and shortages** that come from actual supply, not dice. The player's own selling can crash a local price. | Builds on P8 trade supply and P11 markets. |
| J2 | **Merchant rivals and partnerships.** Generated traders compete with the player, offer ventures and remember deals. | Fits G1 and N1 requests. |
| J3 | **Investments and ventures.** Fund a caravan, a ship or an expedition; it comes back with a story and a result. | A natural idle mechanic. |

## K. Tools for the creative director

| Code | Idea | Notes |
|---|---|---|
| K1 | **Director mode.** A dev-only panel where Weibao can browse every card and thread, force or pin an event, set a seed, watch storyteller state and replay from a checkpoint. | Lets him direct generated content instead of waiting for it. |
| K2 | **Story requests.** Weibao types a premise ("a neighbor's son runs off to join a sect"); agents author a validated content pack offline through the P15 pipeline; he plays it and accepts or rejects it. | Turns "more to consider" into playable content on demand. |
| K3 | **Content packs.** Cards, people templates, places and threads ship as versioned packs per world that can be switched on and off. Saves record which packs made what. | Pairs with F2 revisions. |
| K4 | **In-game card editor** with live validation (requirements reachable, consequences real, no sealed-truth text) | Desktop only. Depends on K3 and P15 lint. |
| K5 | **Bookmarks and annotations.** Mark any event as "more like this", "bug" or "great"; the marks go to a file that agents read during the next tuning pass. | A cheap feedback loop between his play and agent work. |

## L. Other angles

| Code | Idea | Notes |
|---|---|---|
| L1 | **Tone curve.** Mix comic relief, quiet slice-of-life beats and tension so generated runs don't flatline in one mood. Storyteller styles shape the curve. | Adds a dimension to D9 pacing. |
| L2 | **Prestige legacies.** The one prestige layer can carry story forward: your previous life's legend, a ruin of your old house, a disciple who remembers. | P16 owns loops and endings; this is the prestige-specific hook. |
| L3 | **Narrative research reading list.** Procedural Storytelling in Game Design (Short and Adams, eds.), Ryan's work on story sifting and curating simulated storyworlds, Kreminski's Felt and Winnow sifting tools, Emily Short on quality-based narrative. | My own knowledge, not verified this session. P12 checks it with citations. |
| L4 | **Per-world generation showcase.** One small generated thread per major world, built early, to show what each world's generator feels like before deep investment. | Choose after P13 and P17 report. |

## Round 2 suggested order

Proposal only. K5 (bookmarks) and K1 (director mode) are cheap and make every later
generator easier to tune with Weibao in the loop. G1 (NPC-NPC lives) and H2
(changing village) add the most life-sim feel on top of the A1/E1/F1 picks from
round 1.

---

## Round 3 (2026-10-14): more to consider

Request: "more to consider? other stuff and more? save and extend accordingly".
Lanes P23 (M, N, R, S), P24 (O, P, Q) and P25 (T, U) expand these.

## M. The hero's inner life

| Code | Idea | Notes |
|---|---|---|
| M1 | **Beliefs that shift from experience.** Being betrayed, saved or rewarded nudges the character's values and opinions, which then change dialogue options and NPC reactions. Like Disco Elysium's thought cabinet, but grown from generated events. | Links PLAYER_CHARACTER_IDENTITY. Player control stays primary; drift is visible and optional per world. |
| M2 | **Wants and fears.** The character proposes small goals from their current state ("learn to swim", "pay Sela back", "avoid the forest at night"), like the Sims. | Gives idle play direction without forcing it. |
| M3 | **Dramatic irony.** Track what the player knows separately from what the character knows. Generated scenes can play on the gap, and acting on player-only knowledge can be allowed, tagged or explained per world. | Matters for transmigrators and regressors. |
| M4 | **Growth and scar arcs.** Repeated experiences produce named traits (steady under fire, afraid of deep water) that can heal or harden over time. | Feeds talents (D3) and E8E adaptation. |

## N. Ambitions

| Code | Idea | Notes |
|---|---|---|
| N1 | **Ambition board.** Long goals suggested from real state: open a shop, join a sect, master a technique, save someone canon kills, found a village. Each one breaks into generated steps (P12). | A life-sim north star for idle sessions. The player can add their own goals. |
| N2 | **NPC ambitions intersect.** NPCs chase their own ambitions (G1), so goals collide: two people want the same apprenticeship. | Conflict without villains. |

## O. Knowledge and foreknowledge

| Code | Idea | Notes |
|---|---|---|
| O1 | **Foreknowledge decays with divergence.** A transmigrator's canon knowledge is reliable at first. Each real butterfly effect lowers confidence in downstream canon beats, shown as a per-anchor confidence. | A book-world mechanic that reads P13 divergence receipts. Strong fan-premise fit. |
| O2 | **Wrong maps and wrong books.** Generated information can be outdated, biased or mistaken, and checking it is gameplay. | Pairs with P14 retelling and B3 mysteries. |
| O3 | **Investigation as a story engine.** Questions come from real unknowns (P11 M2), and answers come from actual evidence. | Story-shaped research. |

## P. Other perspectives

| Code | Idea | Notes |
|---|---|---|
| P1 | **Stakes by body.** A beast, monster, sword spirit, dungeon core or ghost needs different story generators: hunger and territory, a wielder's choices, delvers and loot. | Links the nonhuman-starts dispatch. Stakes differ, systems stay shared. |
| P2 | **"Meanwhile" cutaways.** Short scenes from an NPC's point of view show what is happening elsewhere, limited to things the player could plausibly learn later, or flagged as dramatic irony. | Adds texture to idle time; keeps M3's knowledge rules honest. |
| P3 | **Items with stories.** Heirlooms, cursed blades and sentient artifacts carry their own history and generate events around whoever holds them. | Builds on P14 provenance and canon-reserved artifact rules. |

## Q. Time structures

| Code | Idea | Notes |
|---|---|---|
| Q1 | **Anniversaries.** Deaths, weddings, foundings and victories come back on their dates as memorials, festivals or grudges. | Cheap and very life-like. Reads P14 receipts and the calendar. |
| Q2 | **Canon countdowns.** Known canon catastrophes (MoL's invasion, a sect war, a monster wave) create long urgency arcs: prepare, warn, flee, profit, or change it. | Reads P13 anchors. Calm-before-the-storm pacing. |
| Q3 | **Life stages.** Childhood, apprenticeship, prime, mastery and old age each get their own generator weights and story types. | Links STARTS_ENDINGS and long-lived cultivators. |
| Q4 | **Seasonal arcs.** Planting and harvest, winter scarcity, monsoon floods, sect recruitment seasons. | Uses the live weather and calendar. |

## R. Moral texture

| Code | Idea | Notes |
|---|---|---|
| R1 | **Dilemmas without a right answer**, with consequences that arrive late and that factions read differently | Pairs with G5 gossip and B6 law. |
| R2 | **Redemption and corruption arcs** for the player and NPCs, built from repeated real choices rather than a meter | Villain play stays reachable. |
| R3 | **Same act, different readings.** One deed can be heroic to a village, criminal to a lord and heretical to a temple. | Per-faction reputation, not one karma bar. |

## S. Progression through story

| Code | Idea | Notes |
|---|---|---|
| S1 | **Epiphanies from life events.** Cultivation insight, dao comprehension and skill breakthroughs triggered by real moments: a loss, a sunrise after a hard fight, teaching a child. | A xianxia staple; many sources support it. Extends D (story as power). |
| S2 | **Heart demons built from your actual history.** Tribulation trials and loss-of-control episodes use the regrets, grudges and fears this life actually produced. | Per world: cultivation tribulations, LOTM loss of control, JJK cursed emotions. Reads M1/M4 and P14. |
| S3 | **Titles earned from sifted feats** that do something in worlds where titles matter | Extends D5 and P17. |

## T. Presentation

| Code | Idea | Notes |
|---|---|---|
| T1 | **Episodes.** Idle sessions are grouped into chapters with generated titles and a short recap, like anime episode titles. | Desktop panel. Pairs with E3 Stories tab and P14 recaps. |
| T2 | **Timeline and map views.** Threads on a timeline and pins on authored maps, with filters by person, place or thread. | Desktop-first layout. |
| T3 | **Notification triage.** Urgent, interesting and ambient events get different weights in the UI so idle play isn't a wall of text. | Extends P3's own panel and the eight-item feed cap. |

## U. Export and memory beyond the save

| Code | Idea | Notes |
|---|---|---|
| U1 | **Your life as a wiki page.** Generate an in-world fandom-wiki-style page for the hero: infobox, history, relationships, trivia, all from real receipts. | On brand for a project built on wiki research. |
| U2 | **Your life as a light novel.** Export chapter titles and summaries as a readable document. | Uses P15 text and the sealed-secret scan (F4). |
| U3 | **Past saves as legends.** With explicit opt-in import, a finished character from one of Weibao's own saves can appear in a new life as a legend, ghost or ancestor. | Never reads private saves automatically; the player chooses the file. |

## V. Generator architecture (root note)

Generators should compose: a quest generator calls the people, place, item and
text generators through one shared tag vocabulary (E4) and one condition language,
with world-agnostic cores and per-world rule plug-ins. Root takes this into
integration with P18 hygiene; no separate lane.

## Round 3 suggested order

Proposal only. Q1 (anniversaries) and T3 (notification triage) are small and
improve every generator. O1 (decaying foreknowledge) and S2 (personal heart
demons) are the most distinctive book-world ideas in this round and wait on P13.

---

## Round 4 (2026-10-14): more to consider

Request: "more to consider? other stuff and more? save and extend accordingly Send
out codex as useful". Lanes P26 (W, X, Z), P27 (AA, AB, AC) and P28 (Y, AD, AE, AF)
expand these.

**First lane result folded in.** [P15](gm/dispatch/procgen-2026-10-13/p15/REPORT.md)
finished. Its main correction: the live game already has authored state-sensitive
scenes and a working Ink dialogue seam, so new text and dialogue should reuse it
instead of adding another engine. Its top pick is a batch lint and review tool
that rejects impossible requirements, bad references and unsupported effects
before content is registered. That tool is a prerequisite for K2 story requests and
for any agent mass-authoring, so it moves up next to the A1/E1/F1 picks.

## W. Mining the books for story shapes

| Code | Idea | Notes |
|---|---|---|
| W1 | **Beat templates from canon scenes.** Abstract recurring scene shapes from each read book (an inn quarrel, a sect entrance test, a tutor's lesson, a duel challenge) into beat templates: roles, preconditions, turning point, outcomes. No prose carried over. | Turns the full-book reading into generator fuel. The attribution rule holds: structure only, with locators. |
| W2 | **Per-world trope decks.** Each world gets weights over shared tropes (face-slapping in xianxia, tea and class politics in HP, desperate improvisation in Worm). | Builds on RESEARCH_GENRE_TROPES. |
| W3 | **Fan-premise mining.** Common fanfiction tags and premises per franchise (self-insert, fix-it, adopted by X, time-travel do-over) become selectable generator seeds and start options. | Follows source-acquisition rules. Links P13's fan-premise patterns and the start-sources dispatch. |

## X. Genre modes

| Code | Idea | Notes |
|---|---|---|
| X1 | **One generator, many genres.** Mystery, romance, horror, heist, tournament, school life, cooking, survival, political intrigue and military campaign as template packs over the same thread engine (A6). | Variety without a new system per genre. |
| X2 | **Heists and plans.** Recon, crew, plan, complication, improvisation, getaway, all reading real skills and gear. | A strong engine for player agency. |
| X3 | **Slice-of-life as first class.** Cooking for friends, a festival date, teaching a kid to fish. No stakes, real warmth and small rewards. | Life-sim north star. |

## Z. Humor and novelty

| Code | Idea | Notes |
|---|---|---|
| Z1 | **Running gags.** Track recurring comic events (the cow on the road again, a neighbor's doomed inventions) and escalate them on purpose. | Pairs with F5 repetition memory: wanted repetition versus unwanted. |
| Z2 | **Rare legendary events.** A small set of very rare cards with big, memorable outcomes, findable over hundreds of hours. Rarity is a per-world adjective. | Discovery rewards. Sealed if they carry secrets. |
| Z3 | **Story firsts.** Note the first time something happens (first kill, first love, first betrayal) in the chronicle and as optional achievements. | Cheap, reads receipts. |

## AA. Journeys

| Code | Idea | Notes |
|---|---|---|
| AA1 | **Road events between authored nodes.** Travel generates encounters, weather, breakdowns, fellow travelers and inns, like Oregon Trail, FTL or Banner Saga, without generating map layouts. | Respects P9's no-procedural-geometry rule. |
| AA2 | **Caravans and voyages** as idle expeditions with crew stories and a log on return | Pairs with J3 ventures. |

## AB. Leading groups

| Code | Idea | Notes |
|---|---|---|
| AB1 | **Running a sect, guild, company or household.** Member stories, recruitment, council advice, succession disputes and defections, in the style of Crusader Kings councils. | Builds on B1 factions and G1 social web. |
| AB2 | **Disciples and apprentices** with their own arcs that reflect how they were taught | Pairs with G3 lineages. |

## AC. Death and after

| Code | Idea | Notes |
|---|---|---|
| AC1 | **Funerals, wills and inheritance disputes** for NPCs and the player | Pairs with P16 endings and G3. |
| AC2 | **Mourning and memory.** NPCs grieve, change and remember the dead on anniversaries (Q1). | Makes NPC death matter. |
| AC3 | **Afterlives per world.** Ghosts, reincarnation, soul realms, Bleach-style afterlife societies, as world laws decide | Per-world laws from P9/P10. |

## Y. Player intent

| Code | Idea | Notes |
|---|---|---|
| Y1 | **Say what you want to do.** A small intent box ("court the baker", "find out who stole the rope") maps to an ambition (N1) or a thread. Start with a keyword and menu parser; an optional model can come later (P15 LLM_OPTIONS). | Gives a menu game a sense of freedom. |
| Y2 | **Conversation topics** drawn from real knowledge, so you can ask anyone about anything you've learned | P15 S3 covers the base. |

## AD. Learning Weibao's taste

| Code | Idea | Notes |
|---|---|---|
| AD1 | **Weights that learn from bookmarks.** K5 marks gently shift card and genre weights for his saves, visible and resettable, never making anything unreachable. | A simple bandit, not a black box. |

## AE. Writers' room for agents

| Code | Idea | Notes |
|---|---|---|
| AE1 | **Role-split authoring.** For a content pack, agents take showrunner, writer, continuity editor, canon checker, tone editor and QA roles, with the P15 lint as the gate. | Raises the quality of K2 story requests. Fits the existing Codex dispatch pattern. |

## AF. Complexity onboarding

| Code | Idea | Notes |
|---|---|---|
| AF1 | **Generators unlock as play deepens.** Early hours show simple cards; factions, wars and lineages appear as the life grows, so systems never arrive all at once. | Reads life stage (Q3) and play time. |

## Round 4 suggested order

Proposal only. P15's batch lint (its S1) comes before any agent-authored content.
W1 (beat templates from the books) is the best way to turn the reading work into
content. X3 (slice-of-life) and Z1 (running gags) are the cheapest warmth.

---

## Round 5 (2026-10-14): more to consider

Request: "more to consider? other stuff and more? save and extend accordingly Send
out codex as useful?". Lanes P30 (AG, AH, AI), P31 (AJ, AK, AL) and P32 (AM, AN, AO)
expand these. P29 (makers and NPC crafters) belongs to another session.

**Lane result folded in.** [P14](gm/dispatch/procgen-2026-10-13/p14/REPORT.md)
finished. Its top pick: one real deed produces a short readable recap, and a later
offer reads that history. It extends P5's D8 lore slice instead of adding a new
history store. Its other picks: a canon-gap record that a second source disputes;
a deed that becomes a rumor and then a performed song or play; an original-world
past that leaves a usable ruin and heirloom; and a finished life leaving traces
that a later life finds.

## AG. Stories at every power level

| Code | Idea | Notes |
|---|---|---|
| AG1 | **Late-game stories without threat.** When the player outgrows danger, stories shift to responsibility, politics, mentoring, legacy, boredom and outliving friends (the Frieren problem). | Prevents generated content from going dead at the top of a power curve. |
| AG2 | **Weak in a strong world.** Survival by wits, hiding, alliances, running away and luck, scaled to a low-power hero among monsters (A Soldier's Life, early Worm, early LOTM). | Generators read relative power, not absolute. |
| AG3 | **Scale-appropriate problems.** A sect master's problems differ from a farmhand's. The generator reads role, power and reach to pick the problem's scale. | Pairs with H3 scales. |

## AH. Body, health and age

| Code | Idea | Notes |
|---|---|---|
| AH1 | **Injury and recovery arcs.** Wounds, rehab, lasting changes, healers and remedies, handled with care and no punishment for idle absence | Links the HUNGER_AND_BODILY_NEEDS doc. No hunger death. |
| AH2 | **Illness in the community.** Outbreaks, quarantines and cures with real spread (C10/C16 cards are the seed) | Pairs with G1 social web. |
| AH3 | **Aging.** Bodies and minds change with age per species and cultivation. Elders become storytellers and teachers. | Pairs with Q3 life stages. |

## AI. Family and companions

| Code | Idea | Notes |
|---|---|---|
| AI1 | **Raising children.** Adopted or born children grow up with personalities shaped by upbringing and events. "Adopted by X" is a top fan premise. | Life-sim core. Pairs with G3 lineages. |
| AI2 | **Animals with stories.** Pets, mounts and familiars with personalities, bonds, old age and their own small adventures | The C05 stray dog card is the seed. |

## AJ. Promises and obligations

| Code | Idea | Notes |
|---|---|---|
| AJ1 | **Promise tracker.** Promises made by and to the player ("back before winter", "I'll teach your son") are recorded, remembered and come due. Keeping or breaking them drives story. | Cheap and powerful. Reads receipts. |
| AJ2 | **Oaths and contracts with teeth** where worlds support them: binding vows, devil contracts, Unbreakable Vows, Nen restrictions | Links E8D vow system and per-world laws. |
| AJ3 | **Debts of gratitude and favors** as a social currency that NPCs call in | Pairs with G1 and the C06 debt card. |

## AK. Secrets as currency

| Code | Idea | Notes |
|---|---|---|
| AK1 | **Information brokers, spies and blackmail.** NPC secrets (generated, not sealed world secrets) can be learned, traded, sold, used or protected. | Intrigue genre on G5 gossip. Villain play stays reachable. |
| AK2 | **The player's own secrets** (a cheat, a past life, a crime) can be discovered by NPCs through real evidence, with consequences per world | Pairs with M3 dramatic irony. |

## AL. Faith in practice

| Code | Idea | Notes |
|---|---|---|
| AL1 | **Prayer, offerings and divine attention** with world-law answers: silence, signs, miracles, demands | Builds on B4 myths and per-world divinity laws. |
| AL2 | **Temples and clergy as story actors** with doctrine disputes, pilgrimages and heresy trials | Pairs with B6 law and R3 readings. |

## AM. Simulation level of detail

| Code | Idea | Notes |
|---|---|---|
| AM1 | **Detail where it matters.** People and places near the player are fully simulated; distant ones run as summaries and get promoted to full detail when they become relevant. | Keeps a living world affordable in a browser. Extends E7 lazy lore. |
| AM2 | **Promotion keeps history.** A promoted NPC's summary becomes a consistent backstory, never a reroll. | The reload-never-rerolls rule applied to level of detail. |

## AN. Continuity guard

| Code | Idea | Notes |
|---|---|---|
| AN1 | **Runtime contradiction checks.** Before a generated event fires, check its cast and facts against the world: the dead don't visit, the absent don't speak, the destroyed stay destroyed. | A whole class of story bugs. Extends P18 hygiene. |

## AO. Content math and playtest data

| Code | Idea | Notes |
|---|---|---|
| AO1 | **Authoring budget.** Estimate how many cards, templates and people per world are needed for N hours to feel fresh, given generator recombination. Plan production against it. | Turns "infinite content" into a production plan. |
| AO2 | **Local play logs.** An opt-in, local-only record of Weibao's own sessions (what he skips, bookmarks, lingers on) feeds F1 metrics and AD1 taste. | Never leaves the machine; never touches saves. |

## Round 5 suggested order

Proposal only. AJ1 (promise tracker) and AN1 (continuity guard) are cheap and
improve everything else. AG1 (late-game stories) protects long play, which matters
most for an idle game. AM1 (level of detail) decides whether the G1 social web is
affordable at all.

---

## Round 6 (2026-10-14): convergence, then more to consider

Request: same as round 5. Lane P33 expands AP to AU.

## Convergence across finished lanes

Four finished lanes point independently at the same first build. This is the most
useful signal in the wave so far.

| Lane | Its top pick |
|---|---|
| [P12](gm/dispatch/procgen-2026-10-13/p12/REPORT.md) | A request with an aftermath: a P4 traveler asks for help with a real need, you deliver or decline, and a later offer refers to that same person and object |
| [P14](gm/dispatch/procgen-2026-10-13/p14/REPORT.md) | A real deed produces a readable recap, and a later offer reads it |
| [P15](gm/dispatch/procgen-2026-10-13/p15/REPORT.md) | Batch lint that rejects broken content before registration |
| [P18](gm/dispatch/procgen-2026-10-13/p18/REPORT.md) | A headless runner that reproduces a seeded story run and fast-forwards under the scheduler budget |

Together they describe one slice: **merge P1, P3 and P4; a generated person makes a
real request; the outcome is recorded; a recap shows it; a later card remembers it;
lint gates the new cards; a headless run proves it repeats and stays idle-safe.**
That is the smallest version of "procedural stories" that is real rather than
decorative. Every later round builds on its receipts and cast. Proposal; root
integration has not started.

P12's other picks (a relationship arc from learning, an NPC plan with a competing
peer, a small fixed mystery, recognizing emergent micro-arcs) and P18's (30-day
variety report, generator revisions, repeat and leak gates, "why?" view) are the
natural second steps.

## AP. Rankings and public ladders

| Code | Idea | Notes |
|---|---|---|
| AP1 | **Rankings as story generators.** Heaven lists, guild ranks, adventurer boards, tournament ladders and hero rankings (MHA) move as generated rivals act. Climbing or being noticed triggers events. | A xianxia and LitRPG staple. Makes the world feel populated by other strivers. |

## AQ. In-world media

| Code | Idea | Notes |
|---|---|---|
| AQ1 | **Forums, chats and broadcasts per world.** Worm's PHO forum, ORV's constellation chat, LitRPG world announcements, newspapers and town criers react to real events with bias and error. | Extends P14 retelling into each world's native medium. Big flavor per world. |

## AR. Calendar and appointments

| Code | Idea | Notes |
|---|---|---|
| AR1 | **A social calendar.** Invitations, lessons, dates, festivals and deadlines compete for the same evening, as in Persona's calendar. Choosing is the story. | Pairs with Q time structures and AJ1 promises. Idle-safe if missed invitations just pass. |

## AS. Other outsiders

| Code | Idea | Notes |
|---|---|---|
| AS1 | **Other transmigrators and regressors** in the same world, generated with their own cheats, foreknowledge and goals: allies, rivals or threats | A common fan premise. Links P16 other selves and P24 foreknowledge. |

## AT. Session-sized stories

| Code | Idea | Notes |
|---|---|---|
| AT1 | **Stories sized to the session.** A 5-minute check-in gets a short beat and a summary; a 3-hour session gets an arc. Pacing reads how the player is actually playing right now. | Idle-specific. Pairs with T1 episodes and D9 pacing. |

## AU. Defeat as story

| Code | Idea | Notes |
|---|---|---|
| AU1 | **Losing opens arcs.** Defeat can lead to capture, ransom, rescue, debt, a new mentor or a grudge instead of only a reload or death, per world. | Extends P12 failure-forward to combat and social loss. |

## Round 6 suggested order

Proposal only. Start the convergence slice above when Weibao wants something
playable. Of the new ideas, AQ1 (in-world media) adds the most per-world flavor
for the least simulation, and AU1 (defeat as story) protects long runs.

---

## Round 7 (2026-10-14): the shared spine, then more to consider

Request: same as round 6. Lane P34 builds the spine below (code, isolated
worktree). Lane P35 expands AV to AY.

## What fourteen lane reports agree on

P12 to P25 have reported. Read side by side, nearly every lane's first slice needs
the same five pieces before its own idea can work:

| Spine piece | Needed by (first slices) |
|---|---|
| **S-1 Integrated P1 streams, P3 deck and P4 people** in one branch | Every lane |
| **S-2 Typed outcome receipts** that later content can query (who did what, where, with what result), retained instead of lost in the feed | P12 S1, P14 S1, P19 S1, P20 S20-1, P21 S1, P23 A, P24 S1, P25 S2 |
| **S-3 A request from a real need**: an issuer, a need, a reserved reward, supported routes, settlement | P12 S1, P13 S1-S3, P17 S2, P21 S2-S3, P11 N1 |
| **S-4 Known-context projection**: only what the player has learned is shown, so recaps, gossip and "why?" stay honest | P16 T, P18 S5, P19 S2, P25 S1-S3 |
| **S-5 Lint and a headless runner** so new cards are checked and seeded runs are reproducible | P15 S1, P18 S1, P22 S22.3 |

The lanes' own first slices then become small additions on top of the spine:

| Lane | First slice on the spine |
|---|---|
| P16 | Idle return letter assembled from actual outcomes while you were away |
| P17 | LOTM acting opportunity; TWI System-issued request; ORV deed and sponsor |
| P19 | Two NPCs do work together, and each reacts to it differently later |
| P20 | A place remembers a repair, and later work reads it |
| P21 | A contest whose turning point a participant remembers correctly |
| P22 | Passive "mark" on any card, exported for an agent to propose tuning |
| P23 | A reflection on a real deed that the player can endorse, revise or dismiss |
| P24 | An anniversary of a real shared repair |
| P25 | Triage that routes live events to the right panel |
| P13 | Canon-world versions of the request: HP term-side work, a D&D town hinge, Soldier logistics |

**Decision for Weibao (proposal):** build S-1 to S-5 once, in Village, then add
lane slices one at a time. P34 is dispatched to build the spine in an isolated
worktree so nothing touches the main checkout or its active integration worker.

## AV. Environmental storytelling

| Code | Idea | Notes |
|---|---|---|
| AV1 | **Scenes that show what happened.** An abandoned camp, a broken cart or a burned field is generated from a real past event in the receipts, with clues the player can read. | Show, don't tell. RimWorld and Dwarf Fortress ruins. Reads S-2. |

## AW. The player's encyclopedia

| Code | Idea | Notes |
|---|---|---|
| AW1 | **An in-game codex built from what you've learned.** People, places, creatures, techniques and factions get entries as you discover them, with sources and contradictions noted. | Cheap on S-4. Turns knowledge into a collection. |

## AX. Sound for stories

| Code | Idea | Notes |
|---|---|---|
| AX1 | **Leitmotifs and ambience.** Recurring people and threads get short musical motifs, and places change ambience with their state. Optional narration through the system's text-to-speech. | Low priority. Pure presentation. |

## AY. Generated challenges

| Code | Idea | Notes |
|---|---|---|
| AY1 | **Self-set challenges from patterns.** The game suggests optional run modifiers from how you play ("a life without violence", "never use the cheat"), recorded in the chronicle if met. | Pairs with Z3 story firsts. Never required. |

## Round 7 suggested order

Proposal only. Spine first (P34). Then P25 triage and P16 idle return letter,
because both make idle play better right away, followed by P19 NPC joint work for
life-sim feel.

---

## Round 8 (2026-10-14): subtle micro details

Request: "more to consider? other stuff and more? save and extend accordingly Send
out codex as useful? Subtle micro stuff too?" Lane P36 expands BA to BG; lane P37
builds the per-world micro catalog (BH).

**Progress.** P34 committed stage S-1 (P1, P3 and P4 integrated on
`proc/p34-story-spine`). [P27](gm/dispatch/procgen-2026-10-13/p27/REPORT.md) top
pick: a road interruption on one authored travel edge that leaves a same-person
callback on arrival. [P28](gm/dispatch/procgen-2026-10-13/p28/REPORT.md) top pick:
type a supported goal and get a real next step, with an honest note when it isn't
supported yet.

Most micro details below are cheap once the spine's receipts (S-2) and known
context (S-4) exist. They are what make generated content feel noticed rather than
rolled.

## BA. How people address you

| Code | Detail |
|---|---|
| BA1 | **Names by familiarity.** "Stranger", then your name, then a nickname. Nicknames come from real deeds ("the one who fixed Sela's roof"). |
| BA2 | **Honorifics shift with status** per world: senior brother, Daoist, -san, sir, Professor. Rank changes them visibly. |
| BA3 | **Greetings read the moment:** time of day, weather, your visible injuries, a recent fight ("rough night?"). |
| BA4 | **Your phrases spread.** A nickname or saying of yours turns up in village talk. |

## BB. Being remembered

| Code | Detail |
|---|---|
| BB1 | **Small preferences remembered.** What you buy often, what you ordered last time, the topic you asked about. The baker sets aside your usual. |
| BB2 | **Noticing absence.** "The smith isn't at the forge today" is itself a hook. NPCs notice when you've been gone. |
| BB3 | **Unprompted small kindnesses.** Bread left at your door after you helped; a warning whispered by someone you once defended. |
| BB4 | **Gratitude fades, grudges linger.** Different decay rates per relationship and per world, refreshed by contact. |
| BB5 | **Your choice retold in their words.** Later, an NPC describes your decision with their own bias, not the menu text. |
| BB6 | **NPCs misremember; the chronicle doesn't.** People get dates and numbers slightly wrong; the player's chronicle stays exact. |

## BC. Things and places carry traces

| Code | Detail |
|---|---|
| BC1 | **Wear tells history.** A tool notched in the wolf fight, a coat patched after the fire. Described from receipts. |
| BC2 | **Objects earn names** through use or deeds, if the player wants. |
| BC3 | **Failed crafts become keepsakes.** A lopsided first pot can be kept and shown to people later. |
| BC4 | **Marks in places.** Carved initials, a repaired fence in a different wood, a grave with fresh flowers on the anniversary. |
| BC5 | **Belongings after death.** The empty chair, the tools passed to an apprentice, the unsent letter. |

## BD. The village reacts in small ways

| Code | Detail |
|---|---|
| BD1 | **Children play at your deeds.** Kids reenact your fight or your famous repair. |
| BD2 | **Animals know you.** The dog you fed stops barking; horses calm for a good rider. |
| BD3 | **Stock and prices follow you.** Merchants stock what you buy, give a regular's price, and sigh when you haggle again. |
| BD4 | **Routines with small variance.** NPCs keep schedules but sometimes sleep in, run late or skip a day, which is noticeable and sometimes meaningful. |

## BE. How information sounds

| Code | Detail |
|---|---|
| BE1 | **Certainty markers.** Firsthand ("I saw"), secondhand ("they say") and guesses ("probably") read differently, from the knowledge basis. |
| BE2 | **Numbers grow in retelling.** Three wolves become five, then a pack. |
| BE3 | **Vague quantities from vague knowledge.** "A few", "dozens", "more than I could count", depending on who is speaking. |
| BE4 | **Lies have tells** that perceptive characters can notice, per skill. |
| BE5 | **Silence is an answer.** Some NPCs refuse, change the subject or just don't reply, and that means something. |

## BF. Timing and rhythm

| Code | Detail |
|---|---|
| BF1 | **Plausible hours.** No market at midnight, no visitors at dawn without reason, letters arrive with the courier. |
| BF2 | **News lags the event** by distance and channel. |
| BF3 | **No twins in a row.** Two similar cards never fire back to back; streaks get broken gently. |
| BF4 | **Quiet is content too.** Occasionally an idle stretch reports a peaceful day on purpose. |
| BF5 | **Return line first.** On coming back, the first line names the single most important change. |

## BG. Small interface touches (desktop)

| Code | Detail |
|---|---|
| BG1 | **Keyboard answers** for responses (1, 2, 3) and a short undo window on decision misclicks. |
| BG2 | **A tiny face or sigil** on each card for its main person (B7 visual generation). |
| BG3 | **Hover for why** (E6) without opening a panel. |
| BG4 | **Urgency with icon and color,** never color alone. |

## BH. Per-world micro texture

Each world has its own small habits that make generated content feel native.
Examples only, to be catalogued with locators by P37 (no prose):

- Cultivation worlds: bowing depth, face, how juniors address seniors, sect uniform details.
- Harry Potter: owl post timing, house points, Muggle money confusion.
- LOTM: honorific code names, the weekly gathering rhythm, newspaper culture.
- A Soldier's Life: rank, salutes, rations, mail from home.
- ORV and LitRPG: the format of system and constellation messages.
- Worm: forum usernames and thread styles.
- D&D: visible dice culture, tavern rumor tables.

## Round 8 suggested order

Proposal only. After the spine: BA1 (names by familiarity), BB1 (remembered
preferences), BF5 (return line first) and BE1 (certainty markers) are each small
and make every generated line feel more personal. They are good first additions
to P34's recap and later-card work.
