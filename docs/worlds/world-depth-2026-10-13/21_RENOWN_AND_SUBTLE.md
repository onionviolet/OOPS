# U: Renown and other subtle social stuff (2026-10-13)

> Code namespace 2026-10-19 (no codes renamed): SU rows here are local to this part; SU3 is also defined in NONHUMAN_SENSES_SCALE_AND_UI, skyrim/SOURCE_LEDGER and parts 06 and 24. Outside this file cite `21_RENOWN_AND_SUBTLE#SU3`. See [reserved prefixes](../../RULES_INDEX.md#reserved-prefixes-2026-10-19).

Weibao: "Renown? other subtle stuff?" Proposals only. Default + Dial + Reasonably. Nothing here is accepted.

Already covered and not repeated (pointers instead):
- Audience reputation vs notoriety, rumor with a speaker, belief per observer: `docs/CHARACTERS_AND_WORLD_EVENTS.md:184-196, 339-365`.
- Identity layers (alias, office, public legend), impostor routes, claims: `docs/RIVALS_IDENTITIES_AND_FATE.md:140-186, 284`.
- Public reputation as a finding channel for pursuers: `docs/ENCOUNTERS_AND_PURSUIT.md:12`.
- Legends that drift, shape your own legend, fame as power, museum of you, reputation across lives, power-scaled gossip: `docs/LIFE_SIM_NORTH_STAR.md:165-169, 588, 2079-2082, 2152, 3507-3516`.
- Parts 01-18: OF4 / OF31 lossy gossip, HP1 house points, HP9 Prophet, HP29 portraits gossip, DDC3 lifestyle, DDC10 faction renown, MOL9 fame from a cure, SLV3 rank as standing, ORV1 broadcast choice, WUS1 anonymous deeds, MC1 carrier-speed fame, IX5 memory not score, IN6 gossip speed, EO8 reputation earns entry roles, DS7 notorious start, DS10 your old life as a legend, SXF10 witnessed arrival, RLX2 mistaken identity, SCX3 rumor sets into opinion, SCX10 notice radius, CL9 reputation split by handle, PA10 recognized by affiliation, PT14 feeling lines.
- Siblings: gossip as a talk verb, drift, speed, prices and named village mouths are in `S_dialogue_actions.md` (DA14, IC7, IC9, IC10, DW9, DW38). Introductions and friends warning you first are in `T_friends_and_relationships.md` (MF9, RD5). Features-as-cheats go to V_.

## 1. Code today (X)

| Code | Consideration | Why it matters |
|---|---|---|
| X1 | The hero carries three fixed regions, `Village`, `Slums`, `Town`, with the comment "effects would go up to 1000?" (`src/models/hero.js:31-35`). Titles start as `{}` beside them (`:30`). | Renown today is a three-bucket integer. Any world, faction or alias needs a new handle, and the closed set is the blocker (X2). |
| X2 | `add_reputation` throws on an unknown region or a non-integer (`src/reputation.js:5-14`); restore throws on unknown saved regions (`src/reputation_state.js:6-16`); old saves without totals replay (`:2-4`). | Same blocker parts 07 R9 and 17 RT11 name. Any renown model here sits on per-world or per-audience keys, so it waits on RT11 or uses a separate record. |
| X3 | Reputation enters through quest rewards (`src/main.js:3225-3231`, e.g. `src/quests.js:363-365`, `:381-386`), location first rewards (`src/data/locations.js:480`, Gang hideout `:1231` gives Slums 200 and Town 50) and native gameplay effects (`src/gameplay_transactions.js:72-76`, `src/simulation_contracts.js:65`, expedition check `src/main.js:730`). | Every source is a first-time deed. Nothing decays, nothing spreads, nothing is witnessed: the number jumps the moment you finish, wherever you are. |
| X4 | Textlines cannot grant reputation ("currently not supported", `src/components/dialogue_component.js:64`). | Talking your way to fame, boasting or confessing has no code path yet. A talk reward of regard needs this hole filled first. |
| X5 | Reputation reads: trader margin shrinks with region reputation, capped at 1000 for half the margin (`src/components/trader_component.js:141-146`); fuzzy unlock between two thresholds (`src/conditions.js:246-254`); elder's amulet line at Village 400, guard greeting at 200, swamp chief report at 50 (`src/data/dialogues.js:375`, `:553`, `:1257`). | Renown already does two things: cheaper prices and opened conversations. Both are good seeds for RE rows. |
| X6 | Inferred from X5's formula: a negative total gives `1 - (negative)/2000`, which raises the margin with no floor (`trader_component.js:143`). No authored source grants negative reputation today (grep of `src/`). | Infamy would already work as a price penalty the moment a negative reward exists. Worth a cap before anyone authors one. |
| X7 | The reputation tab lists a region only when its value is above zero (`src/display.js:4268-4291`). | Being disliked or unknown is invisible. The player cannot see "they have never heard of you" or "they distrust you". |
| X8 | Heirs inherit half of each region, truncated (`src/heir_inheritance.js:51-55`), added to the heir's matching regions (`:91-92`). | A first, literal version of "living in a parent's shadow". It carries the number, not the story, nickname or enemies (RC rows). |
| X9 | Titles are counter thresholds in four families (combat, endurance, craft, life) with small derived bonuses (`src/titles.js:8-37`); the save stores `{id: {at}}` and bonuses rebuild on read (`:3-4`, `:58-87`); a check runs every 5 s (`src/main.js:7653`) over counters built from saved state (`:7661-7682`) and logs "Title earned" (`:7688-7703`); the panel sits in the character bio (`src/titles_ui.js:7-31`). | Titles are private achievements. No NPC reads them, nobody witnessed them, and they do not change by audience. They are the cheapest place to add an audience field (SU1). |
| X10 | Native and book NPCs carry empty reputation maps (`src/book_world_mol_native.js:101`, `src/feature_expansion_destination_native.js:57`); causal story actors use lowercase `village: 0` (`src/causal_story_actors.js:40-42`) while the hero uses `Village`. | NPCs have no renown of their own, so rivals cannot be famous yet. The case mismatch is a small trap if anyone joins the two maps. |
| X11 | Witnessing exists in narrow places: chronicle context marks a witness when the village guard is present (`src/main.js:1207`); observation receipts are `private` or `witnessed` (`src/observation_channels.js:53`, `:132`). | The first building block for "who saw it" already exists. Renown could read a witnessed receipt instead of a reward table. |
| X12 | Book recognition evidence already states that a nickname, masked public theory or copied form does not acquire True Name, Aspect or Memories, and a public title or alias does not prove the faculty (`src/feature_expansion_book_recognition.js:2172-2174`). | The repo already separates public name from real power for Shadow Slave. RN rows generalize that line. |

## 2. Renown model (RN)

| Code | Consideration | Why it matters |
|---|---|---|
| RN1 | **Six words, six records.** Default: *renown* is how widely you are known; *reputation* is what an audience thinks of you; *regard* is one person's feeling; *infamy* is renown for harm; *rank* is a place on an institution's ladder; *title* is a name someone grants or that sticks. Dial: a world can merge two of them in its own lore (D&D faction renown is both renown and rank). | Keeps one number from doing six jobs. A feared outlaw has high renown, low reputation and maybe high regard from one fence. |
| RN2 | **Audience scales.** Default: renown rows key to an audience: person, household, street, guild or house, faction, city, world, multiverse. Dial: how many scales a world shows. Reasonably: a scale needs a carrier to exist (a city has papers, a hamlet has a well). | Lets "known in Village, nobody in Town" and "famous among Awakened, unknown to sleepers" both be true. |
| RN3 | **What they know is a claim with a grade.** Default: each audience holds a deed claim graded *seen*, *told by a witness*, *rumor*, *story*, *song*. Each step down keeps the outline and loses detail. Dial: how fast a grade slips. | The same rescue is "you pulled Tam out of the canal" at home and "a giant who fights rivers" three towns away. |
| RN4 | **False stories are ordinary.** Default: a share of what any audience believes about you is wrong: credited to someone else, inflated, reversed in meaning. Reasonably: wrong stories come from real gaps (no witness, a rival's telling, a slanted paper). | Gives fame texture without random noise. Correcting a story is a quest; leaving it alone is a choice. |
| RN5 | **Spread has carriers and channels.** Default: witnesses, gossips, papers, songs, records, broadcasts, portraits, dreams. Each channel has speed, reach and fidelity. Dial per world. | Builds on IN6 and IC9. New here: songs and records as long-lived channels that outlast the people who carried them. |
| RN6 | **Decay by audience, not by clock alone.** Default: local renown fades slowly while you keep showing up and faster once you leave; a record (ledger, plaque, card) does not fade but can be lost. Dial: per-world half-life. | An idle-friendly rule: absence lowers live gossip but leaves the plaque. Coming home revives it fast. |
| RN7 | **Renown can be faked.** Default: paid bards, planted papers, staged rescues, bought ranks and borrowed deeds raise renown without the deed. Reasonably: fakes have a crack (a witness who was there, a skill test) and a cost if they fail. | Lockhart is the canon model (HP, general knowledge). It also makes renown a resource villains can spend. |
| RN8 | **Renown can be hidden.** Default: do it masked, at night, through a proxy or off-broadcast; renown goes to the mask or to nobody. Dial: how often a careful witness still connects it. | Supports the "stay unknown" path (RE12). Pairs with ORV1 and WUS1 without repeating them. |
| RN9 | **Renown split across identities.** Default: each alias carries its own renown rows (builds on CL9). An unmasking event can merge two rows, and the merge is lossy and loud. Dial: merge cost (lost trust, a scandal, a bounty). | LOTM's many faces and CoI's aliases (general knowledge) need this; so does any HP Polyjuice play. |
| RN10 | **Costs of being known.** Default: recognized at gates, targeted by challengers, expected to help, quoted out of context, followed, and lower privacy at home. Reasonably: each cost scales with renown in that audience, not world-wide. | Makes fame a real trade, not a free buff. Also gives the low-renown life a positive reason. |
| RN11 | **Expectation debt.** Default: every claim about you sets an expectation in its audience ("the one who never refuses a fight"). Failing it costs reputation faster than the deed gave it. Dial: how strict audiences are. | A quiet consequence of an inflated rumor: you inherit obligations you never made. |
| RN12 | **Deeds have a credit split.** Default: a shared deed's renown goes to whoever the audience saw or heard about, not by contribution (contribution credit is LIFE_SIM `:6404-6405`). Dial: a fair institution that audits credit. | Supports quiet support roles honestly: the healer is famous to the patients, not the paper. |
| RN13 | **Renown as a key, not a number.** Default: show renown as words per audience ("unknown", "heard of", "known", "famous", "a legend") and keep the integer in a tooltip. Reasonably: worlds with an official number (house points, rank) show that number as that institution's view (IX5). | Fixes X7's invisibility and reads like a life sim, not a spreadsheet. |
| RN14 | **Belonging renown.** Default: renown attaches to things you made, places you held and animals you kept, not just you. A sword or a recipe can be famous while its maker is not. | Lets crafters and builders be famous through their work; ties to LIFE_SIM maker's mark (`:2265`) without repeating it. |

## 3. What renown does (RE)

| Code | Consideration | Why it matters |
|---|---|---|
| RE1 | **Doors.** Default: a renown key per audience opens rooms and people (X5 already does this for Village textlines). Dial: some doors open for infamy instead (fences, rival houses, the black market). | The existing fuzzy condition (`src/conditions.js:246-254`) can read new audience keys directly. |
| RE2 | **Prices, both ways.** Default: liked renown lowers margins (X5), famous renown can raise them where sellers smell money or a collector wants your touch. Dial: per-shop temperament. | Same number, different shopkeeper. Gives haggling a social angle beyond IC10's bounded nudge. |
| RE3 | **Invitations arrive.** Default: past a renown threshold, letters and visitors bring offers you did not seek: a feast, a wedding, a patron, a teaching post. Reasonably: each has a date and a cost to decline. | Turns idle time into a mailbox of choices. Offers that pile up while away become a return report line. |
| RE4 | **Challengers.** Default: fighters, duelists, scholars and chefs seek you to test themselves, scaled to your renown in their field. Dial: frequency, and a quiet setting that turns them away at your door. | A fame curve that pushes back. A famous fighter gets ambushed in the bath; a famous cook gets cooking duels. |
| RE5 | **Students and apprentices.** Default: renown in a craft brings requests to learn; accepting changes your daily schedule and spreads your methods (and your mistakes). | Ties renown to the apprentice line the heir code already reads (`src/heir_inheritance.js:45-60`). |
| RE6 | **Enemies by association.** Default: renown with one audience makes its rivals notice you (DDC10 does this for factions). New: it also reaches your friends and household, who get asked about you. | Fame touches the people near you, which is where the life sim lives. |
| RE7 | **Quests that seek you.** Default: past a threshold, a petitioner travels to you with a problem fitted to what they believe you can do. If the belief is wrong (RN4), the quest is wrong too. | A lovely failure mode: a widow asks the "dragon slayer" for help, and you have never seen a dragon. |
| RE8 | **NPC behavior shifts.** Default: known people get small changes: kids stare, guards wave you through, drunks pick fights, a vendor sets aside the good bread. Reasonably: shifts read the audience's view, not the truth. | Small, visible, cheap to author as conditional textlines and tooltip lines. |
| RE9 | **Being asked to judge.** Default: high regard in a community brings disputes to your door: a boundary fight, a stolen goat. Your ruling moves regard on both sides. | A social verb that fame unlocks, and a non-combat late-game loop. |
| RE10 | **Renown lowers some odds.** Default: the famous are harder to hide, rob quietly or sneak past (gate recognition), easier to find (pursuit channel). Dial: a disguise skill offsets it. | Connects RN10 to existing stealth and pursuit rules instead of adding new stats. |
| RE11 | **Late game, the famous path.** Default: legend status draws pilgrims, statues, festivals and a political role; the world reacts when you arrive. Cost: no quiet days and steady requests. | A real ending shape: becoming part of the world's furniture. |
| RE12 | **Late game, the unknown path.** Default: staying low keeps privacy, low prices of attention, freedom to act without crowds, and access to people who avoid the famous. Dial: a "grey eminence" variant where a few powerful people know and nobody else does. | Both paths valid. A legendary nobody with five friends who know is a full late game, not a failure. |
| RE13 | **Renown as a soft defense.** Default: a known protector deters small threats in their area (bandits avoid your road). Reasonably: it deters people who heard, not people who did not. | A passive idle effect with a real in-world reason, and it fades when the rumor fades. |

## 4. Across worlds and lives (RC)

| Code | Consideration | Why it matters |
|---|---|---|
| RC1 | **Fame that does not cross.** Default: renown stays in the world that saw it; you arrive elsewhere as a nobody. Dial: hubs and multiversal institutions (MC1) carry some. | The honest default, and it gives every new world a fresh social start. |
| RC2 | **Fame that echoes as a legend of a previous life.** Default: when you return to a world after a life ended, the old deeds survive as stories with drift, a grave, maybe a song (DS10 covers the start; new here is that the legend keeps changing between your visits). | The world remembers you better or worse than you were, and you can check it against your log. |
| RC3 | **Your past self as a rival legend.** Default: NPCs compare the new you to the old legend, often unfavorably ("the old one would have"). Dial: a reveal route if you claim to be them, with disbelief as the usual answer. | A built-in rival who never shows up, and a strange, fun pressure. |
| RC4 | **Renown in a copy or AU.** Default: a copy starts with its own renown rows; your fame in the canon copy is a story there at most, unless the copy plan carries memory (pairs with T_ RX3 for friends). | Prevents cross-copy leakage and lets a player be famous in one copy and wanted in another. |
| RC5 | **The famous parent's shadow.** Default: an heir gets the half regard X8 already gives, plus the parent's nickname as a label strangers use, the parent's enemies, and expectation debt (RN11). Dial: an heir can disown the name and lose both. | Makes the existing half-reputation into a story the heir lives inside. |
| RC6 | **Name versus face versus soul.** Default: the heir inherits the name's renown, a reborn soul inherits none publicly, a body-swap inherits the face's renown (extends CL9 to renown specifically: a face can be famous in a world you never visited if the body was). | A good source of mistaken-identity play that is about renown, not just regard (RLX2). |
| RC7 | **Hub renown.** Default: hubs (Paradise, proving ground) keep their own audience and rankings; a hub legend arrives in a world as a rumor with a hub accent. | Hub fame is a separate life track with its own costs, like a sports star abroad. |
| RC8 | **Legend inheritance across eras.** Default: in a later-era start of the same world, an earlier life is a historical figure in books, maybe with a festival. Dial: whether the history is accurate (sealed if changed: name the route, never the content). | Your own past becomes lore you can read in another life. |

## 5. Per world (RW2)

### Harry Potter (`docs/worlds/harry-potter/`)
| Code | Consideration | Why it matters |
|---|---|---|
| RW2-HP1 | **Chocolate Frog card.** Famous witches and wizards appear on Chocolate Frog cards (general knowledge). Default: a top renown tier in the wizarding public gets you a card, which collectors trade and children quote back to you. | A physical, tradable piece of your renown. Finding your own card in a sweet shop is a perfect scene. |
| RW2-HP2 | **Honors and ranks that can be taken back.** Order of Merlin classes, prefect badges, Quidditch captaincy and Ministry posts (general knowledge). Default: each is a rank with an issuer; the issuer can revoke it when the Prophet turns. | Rank and press interact: a slanted article (HP9) can cost a badge, not just goodwill. |
| RW2-HP3 | **The Lockhart trap.** Fame from other people's deeds via memory charms (general knowledge). Default: a fake-renown route exists and its crack is a witness who resists or a skill demonstration in public. | Canon's own example of RN7, with a clear failure state. |
| RW2-HP4 | **A name nobody says.** "You-Know-Who" and the 1997 Taboo that traced anyone who said the name (general knowledge). Default: in eras with a taboo, saying a famous name is a risk; for your own infamy, people use a nickname instead. | Being so feared that your name turns into a curse is a renown state with real mechanics. |
| RW2-HP5 | **Trophy room plaques.** Hogwarts keeps awards for service to the school (general knowledge). Default: a plaque is a record channel (RN5) that outlasts gossip and that future students read. | Pairs with RC8: a later-era student finds your plaque. |

### D&D / Forgotten Realms (`docs/worlds/dnd/`)
| Code | Consideration | Why it matters |
|---|---|---|
| RW2-DD1 | **Background features are native renown rules.** 5e backgrounds grant social features like Folk Hero hospitality, Entertainer's "by popular demand", Noble privilege, Soldier rank, Criminal contact (general knowledge, 2014 PHB). Default: each background sets which audience starts knowing you and how. | A start already wired to a renown audience, without inventing anything. |
| RW2-DD2 | **Faction ranks with pins and duties.** Beyond DDC10's scores: 5e renown ranks within a faction come with titles, missions and a token such as a Harper pin (general knowledge). Default: ranks bring orders you are expected to follow. | Renown as a job with a boss, which gives late-game duties. |
| RW2-DD3 | **Bards as the press.** Default: a bard who travels with you or hears of you writes a song that spreads your deed with their spin; paying for a better song is RN7 with a crack (a rival bard). | The world's natural renown channel, with a personality. |
| RW2-DD4 | **Townmaster and notice board.** In a frontier town the townmaster's board posts bounties and names (Phandalin, general knowledge for the module). Default: a name posted as solver of a bounty is local renown; a name posted as wanted is local infamy. | One shared object shows both directions of RN1. |

### A Soldier's Life (held, design only; private pack owners)
| Code | Consideration | Why it matters |
|---|---|---|
| RW2-SL1 | **Rank and repute are different ladders.** Default: rank comes from the chain of command; repute comes from the people in the line. A low rank with high repute is a known type. | A soldier world's native split of RN1, buildable from rank rows. |
| RW2-SL2 | **Mentioned in dispatches.** Default: a deed reaches the army at large when an officer writes it down; the line's memory is faster but local. | A record channel (RN5) with a gatekeeper whose favor matters. |
| RW2-SL3 | **The squad nickname.** Default: the unit names you after a deed or a blunder; the nickname travels with transfers and arrives before you. | Small, warm, and sometimes mean. A great log line on transfer day. |
| RW2-SL4 | **Infamy that follows the unit.** Default: a unit's disgrace attaches to every member in the eyes of other units. | Renown at the group scale, which is rare in other worlds. |

### TTKS (five books; `docs/LIFE_SIM_NORTH_STAR.md:7294`)
| Code | Consideration | Why it matters |
|---|---|---|
| RW2-TT1 | **B1: being known makes you worth copying.** Inferred from the replacement premise (TT1). Default: higher renown raises the chance a replacement targets you, since a famous face opens more doors. | Fame becomes a hazard with a native reason. |
| RW2-TT2 | **B2: the trait draw is public.** Inferred from TT4 and TT20. Default: neighbors learn your yearly trait at the birthday scene; a good draw brings favors asked and envy. | A yearly renown event built into the calendar. |
| RW2-TT3 | **B3: challenger standing in the hub.** Default: the system space keeps a record of submitted worlds that other challengers can see (proposal on top of TT7's trophy room). | A cross-world record channel that does not decay. |
| RW2-TT4 | **B4: purity reading as public renown.** Inferred from TT10. Default: a reading off the top of the scale is known within a day in that band, and every party wants you. | A single scan sets your renown, which is unusual and very TTKS. |
| RW2-TT5 | **B5: the inspector's name on rulings.** Inferred from TT13 and TT15. Default: applicants you admitted tell the town your name; refused ones outside the walls tell another version. | Two audiences, opposite stories, same desk. |

### Mother of Learning (`docs/worlds/mother-of-learning/`)
| Code | Consideration | Why it matters |
|---|---|---|
| RW2-ML1 | **The loop erases all renown.** Default: every restart resets every audience to zero; your renown lives in what you know, not what they think. | The cleanest test of renown as memory. A month of fame vanishes at the reset. |
| RW2-ML2 | **Rebuilding fame fast as a skill.** Default: a looper learns which three acts make Cyoria notice them by day two (a public duel, a cure, a correct prediction). Dial: how much attention that also draws from dangerous parties. | Turns renown into a speedrun craft, a distinct MoL verb. |
| RW2-ML3 | **The famous sibling.** Zorian lives in the shadow of a celebrated older brother (general knowledge). Default: a family member's renown sets your starting regard with teachers and family, and RC5 runs in reverse (a sibling, not a parent). | A canon example of shadow fame that the loop cannot erase, since it predates it. |
| RW2-ML4 | **Sudden competence gets noticed.** Default: a student who improves overnight draws questions from teachers and classmates (in-loop observers lack your history). Dial: hide it at the cost of slower use. | Canon pressure point and a sealed-route friendly signal: ties into MOL-SEAL-1's investigation route by ID only. |

### Lord of the Mysteries (Fog City)
| Code | Consideration | Why it matters |
|---|---|---|
| RW2-LM1 | **Fame invites the wrong listener.** Speaking an honorific name can reach its owner (general knowledge). Default: renown among Beyonders raises the chance that something above notices you; ordinary fame in the civil papers does not. | The native case for RE12. Being unknown is safety, not modesty. |
| RW2-LM2 | **Many faces, many ledgers.** Klein runs several public identities (general knowledge). Default: each identity holds its own renown rows (RN9), and the papers report them as different people. | The cleanest showcase for split renown. |
| RW2-LM3 | **Bounties as renown.** Pirates and adventurers carry public bounties that rise with deeds (general knowledge). Default: a bounty number is infamy you can read, and some people respect it. | Infamy with a price tag and a social upside. |
| RW2-LM4 | **Cover stories in the papers.** Default: churches hide Beyonder incidents behind ordinary news; your deed appears as a gas leak. | Renown where the true story is suppressed by an institution, not by drift. |

### Circle of Inevitability
| Code | Consideration | Why it matters |
|---|---|---|
| RW2-CI1 | **Village gossip that resets.** Inferred from COI1. Default: inside the looping village, gossip about you resets each cycle; outside it, renown persists. Header shows which clock applies. | Two renown rules in one world, matching its two clocks. |
| RW2-CI2 | **Trier's papers and editors.** SCI8 places a magazine editor in Trier. Default: published pieces build renown for a pen name, not a face. | A pen-name audience separate from the night-economy gossip (DW28). |
| RW2-CI3 | **Aliases on the run.** Lumian works under aliases (general knowledge). Default: renown under an alias can grow while the real name stays wanted. | A practical, low-tier version of RW2-LM2. |

### Shadow Slave (The Dreaming)
| Code | Consideration | Why it matters |
|---|---|---|
| RW2-SS1 | **The Spell names you.** The Spell grants True Names to Awakened (general knowledge; EW33 covers the earned name). Default: a True Name is public renown with a hidden edge; who knows it has leverage. | A title that is both fame and a weakness, in one record. |
| RW2-SS2 | **Rankings and broadcast.** Weibao's framing: Awakened rankings and broadcast coverage (verify against the SS report before use). Default: rank tiers (Sleeper to Saint and beyond) set public treatment like SLV3, and covered feats reach waking-world audiences who never meet you. | Two audiences again, waking and dream, with channels that link them (DW34). |
| RW2-SS3 | **Legacy celebrity.** Legacy clan stars are public figures (general knowledge). Default: standing near a famous Legacy draws attention to you by association (RE6). | Renown you get from who you walk beside. |
| RW2-SS4 | **Flaw gossip as anti-renown.** SS2 and DW33 cover Flaws as social facts. New: a known Flaw becomes part of your public name ("the one who cannot lie"). | Renown that tells enemies how to beat you. |

### Village (home, `docs/worlds/original-frontier/`)
| Code | Consideration | Why it matters |
|---|---|---|
| RW2-VL1 | **Village renown is regard.** Default: in a hamlet, renown and regard are close to the same thing; the elder and guard thresholds (X5) read it. | Explains why Village uses one number and other worlds want more. |
| RW2-VL2 | **The well and the inn as channels.** Default: Village renown moves through two or three places, not people alone (DW38 names the mouths). | A place-based channel for RN5 that idle time can run. |
| RW2-VL3 | **Leaving fades you.** Default: weeks away lower live Village talk (RN6) while the elder's memory holds. | Makes coming home a small social event. |
| RW2-VL4 | **The Gang hideout echo.** Clearing the hideout already moves Slums and Town (`src/data/locations.js:1231`). Default: a Village line reacts a few days later, through a carrier. | First, cheap use of carrier lag in existing content. |

## 6. Other subtle stuff (OS2)

| Code | Consideration | Why it matters |
|---|---|---|
| OS2-1 | **The haggle stops.** Default: a shopkeeper who knows you quotes one fair price and refuses to haggle, as respect. Dial: some shopkeepers start haggling harder, as a game they enjoy with you. | Renown felt in the most ordinary act. Different from IC10's price nudge: the verb itself changes. |
| OS2-2 | **Kids play you.** Default: children play-act your deed in the street, often with the wrong weapon. | A free, warm sign that renown reached the young. |
| OS2-3 | **A song with wrong lyrics.** Default: a song about you gets a key fact wrong (your hair, the monster, the ending); correcting the singer is an option that costs goodwill. | Drift you can hear. Also a hint vector (part 15 HF2 style). |
| OS2-4 | **Your name as an oath.** Default: locals swear by your name or use it as a curse ("may the [nickname] find you"). | Tells you which way your renown runs without a number. |
| OS2-5 | **A tavern named after a deed.** Default: a tavern renames itself after your best-known deed (or your worst). The landlord asks you to visit for business. | A permanent place mark of renown with a small favor attached. |
| OS2-6 | **An impostor using your name.** Default: someone in a far town claims your deeds and collects your free drinks; meeting them is a quest with many endings (expose, ignore, hire). | Your renown spent by someone else, with your reputation at stake. |
| OS2-7 | **Praise you do not deserve.** Default: credit lands on you for someone else's deed; correcting it hurts their chance to be known, keeping it is a quiet lie. | A small moral texture that renown creates on its own. |
| OS2-8 | **Your face on a wanted poster that is badly drawn.** Default: a bad likeness makes the poster useless to guards and hilarious to friends. Dial: a good artist arrives later. | Infamy with comedy and a real stealth effect. |
| OS2-9 | **Strangers know your business.** Default: a known person hears their own private news from strangers before friends tell them. | The privacy cost of RN10 in one line. |
| OS2-10 | **The name goes ahead of you.** Default: arriving at a place your renown has reached, the innkeeper already has a room. Dial: or already has your rival waiting there. | A small, pleasant payoff for renown that also seeds challengers. |
| OS2-11 | **People lower their voice.** Default: infamous characters notice conversations stop when they enter. | Infamy felt, not counted. A log line, no new system. |
| OS2-12 | **Fan mail, then hate mail.** Default: letters arrive once renown passes a threshold; a slanted story flips the ratio for a season. | A mailbox that reads the public mood, and good idle return-report material. |
| OS2-13 | **An old friend acts strange.** Default: a friend from before your fame treats you more formally, or asks for a favor they would not have asked before. | The social cost of fame on existing ties (pairs with T_). |
| OS2-14 | **Souvenirs of you.** Default: vendors sell cheap fake relics of your deeds (a "tooth" of the beast). Owning one is a joke between you and your household. | Renown becomes a small economy you did not ask for. |
| OS2-15 | **The children's rhyme.** Default: in time, a deed becomes a skipping rhyme whose words no longer make sense. | The last stage of drift (RN3), a lovely late-life detail. |
| OS2-16 | **Your old room is a sight.** Default: where you once lodged, the landlord shows visitors "the famous bed". | Places remember too, with a little exaggeration. |
| OS2-17 | **Being asked to name a baby.** Default: a family names a child after you or asks you to choose. That child appears later, carrying your name. | A long-tail renown echo that crosses into the next generation. |
| OS2-18 | **Wrong scale of fame.** Default: someone very important has never heard of you while a beggar knows all your deeds. | Shows audiences are separate (RN2) in one human moment. |
| OS2-19 | **Your rival's version.** Default: a rival's telling of a shared fight circulates beside yours; audiences pick a side by loyalty, not truth. | Makes rivals social, not only combat (pairs with `RIVALS_IDENTITIES_AND_FATE.md:11`). |
| OS2-20 | **A free meal you cannot pay for.** Default: a cook refuses your coin out of gratitude; insisting offends. Dial: per-culture norm. | Generosity as a tiny friction, and money that stops working in one place. |
| OS2-21 | **Renown shown by clothes.** Default: copied styles of your coat or hat show up in the market a season after a deed. | A visual tell that renown reached a whole town. |
| OS2-22 | **Forgetting your name, remembering the deed.** Default: an old audience recalls the deed and loses the name, so they thank you as "the one who did it" without knowing it was you. | A gentle state between known and unknown; good for return visits and RC2. |

## 7. Suggestions (SU), ranked cheapest first

| Code | Consideration | Why it matters |
|---|---|---|
| SU1 | **Audience line on titles.** Add an optional `heard_by` text to catalog entries in `src/titles.js` (e.g. Hunter: "Village hunters know this") and show it in `src/titles_ui.js`. Save impact: none (save stays `{id:{at}}`, `titles.js:3`). Owner: titles files (released per part 18 line 114); confirm current owner before writing. | Smallest step from private achievement to renown, no persistence change. |
| SU2 | **Renown words in the reputation tab.** Show each region with a word (unknown, heard of, known, liked, famous) and the number in a tooltip, including zero and negatives (fixes X7). Save impact: none (display only). Owner: `src/display.js:4268-4291`; it has uncommitted edits in the tree, so coordinate with that writer. | Makes the unknown and disliked states visible with no data change. |
| SU3 | **One recognition greeting per region.** Add Village textlines with `display_conditions: {reputation: {Village: N}}` that react to the hideout deed or a held title (RE8, RW2-VL4). Save impact: additive textline ids; verify that loading an old save tolerates unseen ids. Owner: `src/data/dialogues.js`. | Exercises existing fuzzy conditions (`src/conditions.js:246-254`) for a visible renown effect. |
| SU4 | **A renown-reading title.** Add a counter `village_renown` from `character.reputation.Village` in `readTitleCounters` and a title such as "Known in Village" at 200. Save impact: none for titles (keyed by id); counter derives from saved reputation. Owner: Foundation R15 (`src/main.js:7661-7682`) plus titles catalog. | Ties titles to an audience in a few lines. |
| SU5 | **Heir hears the parent's nickname.** On heir start, log one line naming the parent's highest held title as what the Village called them (RC5). Save impact: small optional field in the heir leftovers manifest (`src/heir_inheritance.js:56-59`, schema 1), defaulting to absent. Owner: Foundation R15 (heir is R15 G5, saves and tests). | Turns X8's half-number into a story with almost no new state. |

Not suggested now: a negative reputation source, until X6 gets a floor; per-world renown keys, until RT11 opens the closed region set.

Sealed secrets touched: MOL-SEAL-1 (route reference only).
