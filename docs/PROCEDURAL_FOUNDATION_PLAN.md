# Procedural foundation plan

**Start at [PROCEDURAL_CORE](PROCEDURAL_CORE.md)** (proposal, 2026-11-12): the frozen procedural core, its metrics and work queue. It marks which sections below are core and which are palette, and its definitions of ledger states, expressibility and generation fit replace CV2 and the GL2 target here.

*Owner of the foundations-first build: what the foundation is, who builds which part, and when each part is done. Weibao's direction is quoted. Everything else here is a proposal under AD56 (it widens play) and stays adjustable. Started 2026-11-11 after the [Codex foundations review](audits/CODEX_FOUNDATIONS_REVIEW_2026-11-11.md).*

## The idea, in his words

> We want the foundational systems to be able to cover basically the whole story

> Foundations first

> They have all stopped, we should have chats each working on creating the foundational procedural system?

## The idea, sharpened

Build one procedural foundation, several chats at a time, each owning one part of it. A canon case from a book (a Gu, a potion, a spell, a creature, a made object) should be **a row of data that shared rules run**, not a module of code written for that scene. The same rules then produce plausible variants and new combinations, and explain why an attempt failed. Playable slices come after, as consumers of the foundation; the lead lives (Klein, Fang Yuan) are the first ones.

What changes from the 2026-11-11 Codex wave: that wave covered every topic but mostly wrote one module per scene (67 Gu Keeper files, 21 catalogued Gu kinds against 2,206 indexed rows), with four separate versions of the same "ordered steps over typed inputs" shape. This plan measures progress by how much canon runs as data through shared rules, and gives every chat a finish line.

## Three layers

| Layer | Holds | Example |
| --- | --- | --- |
| Kernel | The one shape of a **working**: typed roles bound to actual things, ordered steps, quote, settle, receipt, what the maker observed kept apart from the truth, and the same result whether time settles in one jump or many | A brew, a killer move, a cast, a forge job and a creature task all quote and settle the same way |
| Domain law | How one family of mechanisms behaves: Gu activation and claims, living bodies and inheritance, matter and reactions, joins and loads, spell grammar | Gu essence by rank; heat moving through a batch; a fastener's limiting load |
| World pack | Each world's numbers, local laws and catalogue rows | Reverend Insanity's Gu list; Hogwarts recipes; D&D spell slots |

World numbers stay in world packs. Domain law never names a world. The kernel never names a domain.

## The chats

One writer per layer and file area (AGENTS multi-agent rules). The kernel chat owns the kernel file; each domain chat owns its own law files and moves its own leaf onto the kernel. Kernel changes go to the kernel chat as requests.

| Chat | Owns | Done check (default numbers, adjustable) |
| --- | --- | --- |
| **K · Kernel** | A new shared working module and the comparison of `craft_working`, `spell_working`, `creature_methods`, `gu_procedures`, `method_program` | One contract that two domains run on with their focused tests passing; one old shape retired; a time-partition and reload test in the kernel's own suite |
| **G · Gu** | `gu_*`, Gu Keeper files, `gu_catalogue`, Gu world packs | 60 or more Gu kinds as catalogue data, chapter-checked first; 10 Keeper scenes re-expressed through shared leaves with their old modules deleted; move records drive move search; a list of what the rules could not express |
| **L · Living things** | `creature_lifecycle`, habitat, care, living regulator | Pet, livestock, wild cohort and Gu-as-creature all read one lifecycle; inheritance, development, learned behavior and condition change independently; one task consumer reads it through the kernel |
| **F · Fabrication** | Crafting, materials, lineage, gear assembly | Joins, loads, wear and salvage expressed as data; 10 existing recipes re-expressed with no bespoke code; a changed part fails at a different point by the rules alone |
| **B · Brewing and chemistry** | Potion workings, brewing state, vessel history, thermal process | Known recipes as data (Hogwarts and LOTM); matter conserved through transfer, residue and interruption; a substitution that works differently for a stated reason |
| **S · Spellcraft** | Spell dictionary, spell workings, spellbook | Spell families as data from the vocabulary; canon spells reproduced from roots and gestures; D&D and Mother of Learning as second consumers of the same grammar |

Relationships, offers and permissions (the FG7 work) join K as the authority read at settlement until a domain needs more.

## Long-term rules (PFP)

- **PFP1 · Canon is data.** A new canon case should cost a data row. A new mechanism costs code once, in its layer.
- **PFP2 · Measure coverage.** Each domain keeps two counts in its checkpoint: canon cases that run as data, and bespoke scene modules. The first rises and the second falls.
- **PFP3 · Layers stay apart.** World numbers in world packs, mechanisms in domain law, the working shape in the kernel.
- **PFP4 · One writer per layer.** Requests cross layers; edits do not.
- **PFP5 · Second consumer before promotion** (AD51). Nothing moves into the kernel until two domains need it.
- **PFP6 · Every phase has a runnable done check.** Open questions go to the domain's backlog, not into the goal, so a goal can close.
- **PFP7 · Cross-domain joins prove the kernel.** Each domain proves one join with another through kernel settlement. The first shared case: a Gu regulating a workshop leaves partway through a heated brew ([LT31](CROSS_WORLD_SYSTEMS_TRANSFER.md#interruption-depends-on-what-the-support-already-did)).
- **PFP8 · Commit per phase, prove combined.** Each phase ends committed. The checkpoint ends with one browser pass on the combined bundle, receipts saved in the repo.
- **PFP9 · Slices resume per domain.** A domain that meets its done check opens for playable slices, lead lives first.

## The overarching system: one world the parts embed into

Weibao (2026-11-11): "What about the overarchiing system and then embedding these into them? Consider proceduralness, and emergent behavior and more>"

The kernel above only says how an action quotes and settles. Emergence needs more: the parts have to touch the **same world**, so that a Gu, a brew and a sheep can affect each other without anyone writing that join by hand.

### Options weighed

| | Shape | Emergence | Cost and risk |
| --- | --- | --- | --- |
| O1 | Kernel only; domains call each other where a join is written | Only the joins someone wrote | Cheapest; stays a set of separate engines |
| O2 | **Shared quantities.** Every thing carries typed amounts (heat, moisture, load, vitality, essence by kind, attention, ownership, knowledge) with units and provenance. Domain laws read and write amounts, never each other | High: a brew's heat warms a Gu because both touch heat | Generic sludge if the vocabulary grows unchecked; must still settle in one jump for idle time |
| O3 | **Effects that land on whatever is there.** Each settlement publishes typed effects (heat released, load moved, Gu left, noise made) into a place; what is present reacts | High, and reads like a story ("the noise drew the wolf") | Cascades and order dependence; needs a depth limit and a fixed order |
| O4 | **Everyone runs the same workings.** Wild Gu, NPC refiners, weather and ecology use the same quote and settle the player uses (SPR26) | High and lore-shaped: rivals, predators and markets act on the rules | Background cost; needs coarse settlement away from the player |
| O5 | **Laws are things too.** A world law, a dao mark, a ward or a Hogwarts charm field is data scoped to a place, body or item, and can be added, contested or removed | The deepest kind: a Gu that changes a local rule, two dao marks interfering | Hardest to explain and test; only where a source actually works that way |

### The default: all five, in layers

Proposal. Use O1 for actions, and build O2 to O5 as one world substrate on what already exists: the facts frame and `applySimulationEffects` (29 callers today), active effects and the clocks.

| Layer | What it is | Built on |
| --- | --- | --- |
| Substrate | Places, bodies and things, each carrying typed **quantities** (O2) and scoped **law fields** (O5) | Facts frame, inventory keys, material lineage |
| Contact | Settlements publish **effects** into a place; present things react through their domain law, with a cascade limit and fixed order (O3) | `applySimulationEffects`, active effects |
| Actors | The player, NPCs, creatures, Gu and processes all act through the **kernel working** (O4) | Kernel, SPR26 |
| Detail level | Near the player, things settle in detail. Away, they settle as rates and counts that give the same totals (SPR28) | Away-time harness |
| Packs | Gu, living things, fabrication, brewing and chemistry, spellcraft, plus world packs | Domain chats |

**How a domain embeds.** Each domain pack declares five things: the quantities it reads and writes, its laws (how those quantities change), its workings (what an actor can attempt), its generators (how new canon-shaped things are made from parts) and its catalogue rows. Gu, for example: essence by kind and rank, with dao marks as law fields; each Gu a living actor from L; abilities and killer moves as workings; new Gu generated from path, role and rank; the 2,206-row index as catalogue.

**Where emergence comes from.** Shared quantities, effects that land on whatever is present, and actors on the same rules. These chains should appear with no join code, and are the first test cases:

- A Gu regulating a brew leaves with its keeper. The latch stays shut, the stored heat keeps working, and the batch finishes weaker.
- Rinse water from a potion vessel reaches a field. The crop takes up residue, and the sheep that graze it change.
- A farmed firefly colony brightens the hill. Wild Gu that feed on starlight move in, and a rival keeper notices.

**Proceduralness.** Generators build new things from the same grammar as the canon: a Gu from path, role and rank; a spell from roots and gesture; a potion from ingredient properties; a creature from lineage. Laws check whatever a generator makes. A world can run its history forward before the player arrives (the Caves of Qud inspiration) with the same actors.

**Keeping emergence readable.** Every outcome keeps a cause chain the player can read (SPR32). Cascades stop at a depth dial. Settlement order is fixed, so a reload reproduces the run. Canon numbers are fixed points the laws are calibrated to (AD49), so emergence fills what the book leaves open instead of overwriting it. Runaway loops are damped by in-world causes (food runs out, a predator arrives), with a dial, not a blanket cap.

### Two more chats

| Chat | Owns | Done check |
| --- | --- | --- |
| **W · World substrate** | Quantities, law fields, contact and detail level, extending the facts frame and simulation effects | Two domains exchange a quantity and an effect with no direct import between them, with the same result after one jump, many steps or a reload |
| **E · Emergence harness** | Scripts and tests only: run seeded worlds headless for long stretches, record cause chains, flag new multi-domain chains and runaway loops | Each run reports the chains it found and the loops it damped; the three chains above appear without join code |

K keeps the working shape; W owns the world it acts on. The domain chats depend on both.

- **PFP10 · Domains touch the world, not each other.** A domain reads and writes shared quantities and effects; a direct import between domains needs a reason in its checkpoint.
- **PFP11 · Everyone acts on the same rules.** No NPC, creature or process gets a shortcut the player cannot also use under the same conditions (SPR26).
- **PFP12 · Near is detailed, far is rates.** Both settle to the same totals.
- **PFP13 · Every emergent outcome can explain itself.**
- **PFP14 · Laws as data only where the source works that way.** Law fields serve conceptual mechanisms (dao marks, wards, charm fields), not ordinary numbers.
- **PFP15 · Hunt for emergence.** The harness runs at every foundation checkpoint; a found chain becomes a regression test or a backlog row.

## The procedural system: how new things come to exist

Weibao (2026-11-11): "procedural system?"

How a draw is made is already settled: the accepted generator contract [GR1-GR17](GENERATION_FOUNDATION_RULES_2026-10-14.md#the-rules-gr) (addressed draws, freeze on reveal, tag tables, retries with a named fallback, same rules for NPCs) and its helpers in `gen_kit.js` (45 callers). What this plan adds is **what gets generated and why it fits the world**: new Gu, spells, potions, creatures and objects that look like they belong in the book because they are built the way the book's own things are built.

### Options weighed

| | Source of new things | Strength | Weakness |
| --- | --- | --- | --- |
| P1 | **Tables.** Roll a name, rank and effect from lists | Cheap, fast | Feels random; nothing explains why it exists |
| P2 | **Grammar of parts.** A thing is assembled from typed parts with rules for how parts combine: Gu from path, role, rank and dao marks; a spell from roots, gesture and intent; a potion from ingredient properties and process steps; a creature from lineage and environment; an object from materials and joins | Canon becomes a special case of the grammar; variants are explainable | Needs the grammar derived from the source first |
| P3 | **Born from the simulation.** Things arise when the world's conditions produce them: a Gu emerges where a habitat has enough of the right essence; a breed drifts under selection; a recipe changes as an ingredient runs short | The deepest emergence; every new thing has a history | Slow to show results; needs the world substrate |
| P4 | **Invented by actors.** The player, rival refiners and teachers search the grammar for something that does what they need, through the kernel working (the existing move search is the first case) | New things carry an inventor, a purpose and a cost | Search must be bounded |
| P5 | **Fitted to the corpus.** Use the source index (2,206 Gu rows, the spellbook, recipe lists) to measure which part combinations the book actually uses, and weight the grammar to match | Generated things sit inside the book's range | Needs labelled parts; the index fits the book, not every world |

### The default: grammar at the base, the world and actors as the sources

Proposal. **P2 is the base**: every domain writes its grammar of parts. **P5 calibrates it**: weights come from what the source uses, so a generated Gu is about as likely to be a rank-one support as the book's Gu are. **P3 and P4 are where new things come from during play**: the world grows them and actors invent them. **P1 is only for flavor fill** (a name, a minor detail) once the grammar has fixed the substance. All of it draws through GR1-GR17.

A generated thing is valid only if the same laws that run canon things can run it. Generated means runnable.

**The canon test** (the finish line for each grammar). Hold out canon items, give the grammar only their parts, and see whether it rebuilds them. Then check that generated items fall inside the corpus's range. A grammar that cannot rebuild most of its held-out canon is missing a rule, and that missing rule is the next foundation task.

**Where generation happens in the world**

- **Place:** a place's quantities favor what can arise there. Moonlight and the right essence make Moonlight-path Gu likelier.
- **History:** before the player arrives, the world runs actors forward, so sects, recipes and lineages already exist with a past.
- **Pressure:** scarcity, rivals and predators push actors to invent, breed or substitute.
- **Discovery:** the player finds generated things through research, trade, hunting or experiment. What they know is separate from the truth (GR5).
- **Storage:** keep only what has been observed (GR3, SPR23); everything else is an address that can be regenerated.

### One more chat

| Chat | Owns | Done check |
| --- | --- | --- |
| **P · Procedural grammar** | The shared grammar contract (parts, combination rules, fit weights), the canon test harness and the corpus fit. Each domain chat writes its own grammar on this contract | Two domains pass the canon test on held-out items; generated items from both run through their laws with no special case; one place-driven and one actor-driven generation happen in a seeded world run (with E) |

- **PFP16 · Generated means runnable.** A generated thing goes through the same laws and workings as canon.
- **PFP17 · Canon is a special case of the grammar.** Each grammar's done check is rebuilding held-out canon from its parts.
- **PFP18 · Weights come from the source.** Fit part weights to the corpus where one exists; record where a world's dial departs from it and why.
- **PFP19 · New things have a cause.** A place, a history, a pressure or an inventor; never a bare roll for anything that matters.
- **PFP20 · Draws follow GR1-GR17.** The grammar decides what; the generator contract decides how.

## Order

1. **Stabilize.** Fix the four combined-tree test failures and commit the Codex wave by lane, so every chat starts from the same commit.
2. **Start K, W and the domain inventories together.** K and W first publish a v0 contract (MC2). Domain chats catalogue canon as data and list what their current code hand-writes; this needs nothing from K or W yet, and embedding waits for v0. E starts once W has a first contact case. P starts with the domain inventories, since each grammar is derived from the canon they catalogue.
3. **Embed.** Each domain moves its actions onto K's working and its reads and writes onto W's quantities and effects, then deletes what the shared rules now cover.
4. **Emergence and proof.** The harness runs the three chains (PFP15), then the combined browser proof (PFP8), then playable slices by domain (PFP9).

Source and evidence documents stay with their current owners: the [cross-world map](CROSS_WORLD_SYSTEMS_TRANSFER.md#round-6-foundations-goals-by-existing-chat), the [Gu palette](GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#comprehensive-goal-evidence-and-open-foundations), the [creature root rules](research/CREATURE_ROOT_RULES_2026-11-11.md), the [potion engine audit](audits/PROCEDURAL_POTION_ENGINE_2026-11-11.md), the [crafting considerations](PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md) and the [spellcraft evidence](research/PROCEDURAL_SPELLCRAFT_ENGINE_EVIDENCE_2026-11-11.md).

## Other systems the foundations need (2026-11-11)

Weibao (2026-11-11): "other systems that might also be needed?"

Each of these already has scattered owners in `src`, the same pattern the review found for workings: real code, no shared foundation. Proposals under AD56, in order of how much the rest depends on them. None starts before K and W publish v0.

| Code | Chat | Why the plan needs it | Existing owners to fold in | Done check (default) |
| --- | --- | --- | --- | --- |
| OS1 | **A · Agency** | Actors on the player's rules (O4), pressure (P3) and invention (P4) all need actors that choose. Nothing owns how an NPC, creature or Gu picks a working from its wants, knowledge and means | `npc_lives`, `npc_schedule`, `causal_story_actors`, `*_intents` | An NPC and a wild creature each pick workings through K from wants and what they know, with the same quote the player sees; a changed scarcity changes the choice |
| OS2 | **C · Conflict** | Fights, contests, hunts and duels are workings that meet another actor's workings and land on bodies. Combat has some 20 modules and no shared contest | `combat_*`, `cohort_battle*`, `book_world_lotm_fight`, `field_care_battle` | One contest rule runs a Gu duel, a Hogwarts duel and a wolf hunt, with damage landing on L's bodies |
| OS3 | **R · Progression** (MC13) | Gu rank and aperture, cultivation, Lord of the Mysteries sequences and digestion, skill practice and faction rank are all thresholds, risk and cost | `cultivation_*`, `faction_rank`, skill practice | A Gu rank step, a sequence step and a skill level run on one rule with world numbers in packs |
| OS4 | **M · Societies and markets** (MC15) | Prices, scarcity, sects, guilds, law and rumor are where pressure and history come from | `trade`, `regional_prices`, `market_saturation`, `lotm_price_map`, relationships from FG7 | A scarcity in one domain moves a price, which changes an NPC's choice through A, and word of it spreads by knowledge, not by flag |

Scope notes for chats already in the plan (no new chat):

- **OS5 · Bodies are living things.** L owns people as well as animals, Gu and plants: injury, illness, poison, aging, growth and crops (`field_layer`, `home_medicine`, fluxweed beds). Medicine and poison are B acting on L's bodies.
- **OS6 · Sky and seasons are substrate.** Weather, calendar, moon phase and day length are W quantities and processes (`weather`, `world_calendar`), so a moon window or a frost reaches every domain the same way.
- **OS7 · Ritual and divination are spellcraft.** Lord of the Mysteries rituals and divination use S's grammar of parts on K, with their own world pack.
- **OS8 · Saves are a contract.** K and W v0 include a versioned save shape and one migration path; each domain's save keys hang from it (MC4).

Order: A first, since P3, P4 and E's chains need choosing actors; then C and R; then M. Each takes the per-chat goal template above.

## Broad systems and the generators built on them (2026-11-11)

Weibao (2026-11-11): "include agency, conflict, progression and markets chats too, consider other braod systems, and then procedural systems to build upon them?"

A, C, R and M above join the send-out. Three more broad systems have the same pattern: plenty of code, no shared foundation.

| Code | Chat | Why the plan needs it | Existing owners to fold in | Done check (default) |
| --- | --- | --- | --- | --- |
| OS9 | **N · Knowledge and learning** | Discovery (GR5), invention (P4), rumor (M) and teaching all move what someone knows, apart from the truth. Study, lessons, research, lore and beats each keep their own | `discovery_codex`, `knowledge_home`, `research_*`, `inquiry_study`, `lesson`, `teacher_window`, `lore_*`, `beat_knowledge`, `world_events_knowledge` | One rule moves a fact from observation, teaching, reading or rumor into an actor's knowledge with a source and a confidence; a wrong belief stays wrong until evidence changes it |
| OS10 | **X · Places and travel** | Places carry W's quantities; routes, regions, sites and exploration decide what an actor can reach and find | `region_kit`, `region_view`, `known_routes`, `travel_legs`, `authored_site`, `site_projects`, `drainage_site` (SR1-SR24) | A region, a route and a site come from one place model; travel time, danger and what is found read W and L, not per-site code |
| OS11 | **D · Situations and story** | Emergence needs a layer that notices a chain worth telling, keeps canon beats as fixed points (AD49) and turns pressures into situations, quests and events | `causal_story_*`, `causal_situations`, `story_director`, `storylet_*`, `quest_generator`, `world_events`, `life_events`, `beat_*` | A situation arises from a W or M pressure with no authored trigger; a canon beat holds or bends by a stated cause; the player reads both in Reports |

Scope notes: minds (wants, mood, fear, sanity, loss of control) belong to A, read from L's bodies. Talk and relationships are workings between actors on K, with M owning groups and standing. Names come from the naming sheets (NMR) through P.

### The generators on top

Each broad system gets a generator on P's grammar contract once its v0 exists. Every generator follows PFP16-PFP20: what it makes is runnable, rebuilds canon from parts and has a cause.

| Code | Generator | Grammar of parts | Causes that feed it | Built on |
| --- | --- | --- | --- | --- |
| PG1 | **People** | Lineage, body, upbringing, wants, skills, ties | Place, family, society, history | A, L, M, N |
| PG2 | **Societies** | Founding need, doctrine, ranks, holdings, rivals | Scarcity, conflict, a founder | M, R, C |
| PG3 | **Places** | Terrain, quantities, habitats, routes, ruins | Sky, geology, past use | X, W, L |
| PG4 | **Histories** | The world run forward with actors (Caves of Qud style) | Everything above | E, A, M, C |
| PG5 | **Situations** | Pressure, actors, stakes, a clock | Shortage, a feud, a discovery, a beat | D, M, A |
| PG6 | **Lore and rumor** | Claim, source, truth value, spread | Events, witnesses, texts | N, M |
| PG7 | **Conflicts** | Parties, cause, means, ground | Rival wants, territory, revenge | C, M, A |
| PG8 | **Paths of advancement** | Steps, thresholds, risks, costs | A world's laws and a society's teaching | R, P |
| PG9 | **Things** | The domain grammars: Gu, creatures, recipes, spells, objects | Place, pressure, inventor | G, L, F, B, S |

Order: K, W and P first; domain and broad inventories in parallel; each generator after its system's v0, with PG4 (histories) last because it runs everything else.

## Sectioning: by mechanism, not by franchise (2026-11-12)

Weibao (2026-11-12): "how to section things properly? gu under creatures, gu killer moves, under combat system? or its own thing? More to consider?"

### Options weighed

| | Shape | Fits | Breaks |
| --- | --- | --- | --- |
| SC1 | **Gu is its own domain** (today's G) | One owner for the book's richest system | It rebuilds a lifecycle, a making system and a contest of its own, which is how 67 bespoke modules happened (review F2) |
| SC2 | **Gu under creatures** | Gu eat, breed, die, live wild and in habitats (GKM51) | A Gu is also an owned tool, a refinement product and a part in moves; L would absorb making and abilities |
| SC3 | **Killer moves under combat** | Many moves fight | Many do not: Fixed Immortal Travel moves people, Ear Grass with Lightning Eye scouts (GKM141), moves refine into new Gu (ch. 1561, 1570; GKM162, GKM200). Combat would own travel, scouting and making |
| SC4 | **By mechanism** | A Gu shows up in every mechanism it uses, as data on that mechanism's contract | Needs one identity for a thing that is several kinds at once |

### The default: SC4, with Gu as a world pack and a thin law

Proposal. Section the foundations by mechanism. A world's thing, whether a Gu, a wand, a Beyonder characteristic or a familiar, is a set of rows on every mechanism it uses, under one identity.

| A Gu as | Mechanism owner | What the Gu supplies |
| --- | --- | --- |
| A living thing: feeding, hunger, breeding, wild cohorts, death | L | Lineage and diet rows on L's lifecycle |
| An owned thing you carry, lend, steal or lose | Inventory, custody, M for claims | One identity that is both item and body |
| An ability you activate | K working | Activation as a working with essence cost |
| A part in a killer move | K **composed working** | Roles filled by Gu; the move is a recipe of workings |
| A refinement product, and a move refined into a Gu | F making grammar, B process steps | Recipe rows; the move-to-Gu cycle is a making recipe whose input is a practiced move |
| A move in a fight | C contest | C runs the contest; the move enters it like any working |
| Rank and aperture | R and L | Aperture as a body organ with capacity (L); rank steps as R's path |
| Essence and dao marks | W | Essence by kind and rank as quantities; dao marks as law fields |
| A new Gu | P grammar | Path, role, rank, dao marks |

What stays Gu-only, in the **Gu law** (the G chat's files): the rules no other world shares, such as primeval essence, aperture grades, the Immortal uniqueness rule and dao mark interference. Everything else is the Gu world pack: catalogue rows, recipes, moves and numbers.

The same split answers the other worlds: Hogwarts potions are B rows, spells S rows, wands F plus a bond; a Lord of the Mysteries potion is B to brew and R to digest; a familiar is L plus a tie.

### More to consider (SC5 onward)

**ACT NOW**

- **SC5 · One writer per file stays.** The G chat keeps writing `gu_*` files; the mechanism chats own the contracts. Moving Gu files to L, F or C mid-phase would cost churn for nothing. G re-expresses each Gu piece on the owning contract when that contract's v0 lands, and asks the owner for anything missing.

**ACCOUNT FOR NOW**

- **SC6 · Composition is a kernel feature.** A killer move combines workings into one. So do a spell combined from charms, a recipe step that runs two processes and a formation. Under PFP5 it enters K once a second consumer exists. Spells and Gu are the first two candidates. K owns it; G and S are its first consumers.
- **SC7 · One identity, several kinds.** A Gu is an item and a living body at once; a Beyonder characteristic is an item, a potion input and a remnant of a person. Inventory keys and L's bodies need a shared identity, not a copy in each. The request goes to K and W for v0 (the OS8 save shape).
- **SC8 · Moves and Gu turn into each other.** Practiced moves refine into Gu, and Gu simplify moves (ch. 1561, 1570, 1571). The making grammar takes a working as input, not only materials. F's grammar draft accounts for it.
- **SC9 · The contest does not own its entrants.** C defines how workings meet, with timing, interruption and outcomes landing on bodies. It never defines what a Gu, spell or weapon does. The same holds for travel (X), scouting (N) and healing (B on L).

**LATER / DELEGATE**

- **SC10 · Mechanism coverage view.** A table per world thing, generated from the packs, showing which mechanisms it appears in. A Gu missing from L's lifecycle, or a move with no composition row, then shows up as a gap. Level haiku, effort low. Done check: the view lists every catalogue Gu with its mechanism rows and flags the empty ones.

- **PFP21 · Section by mechanism.** A world's thing is rows on every mechanism it uses, under one identity. Only rules no other world shares stay in that world's law.

## Separate but connected, and effects beyond the book (2026-11-12)

Weibao (2026-11-12): "How to make things both seperate but interconnected? Consider procedural settings that can have interesting results, like killer moves not from the original book and more? or spell not from the original book? How can we do about that?" and "Can we create a procedural system that generates the effects of the oriignal, but broad enough to cover stuff beyond the original?"

### Separate in law, connected through six seams

Each domain keeps its own law, files and writer. Domains never import each other (PFP10). They connect only through six shared seams, each owned once:

| Seam | What crosses it | Owner |
| --- | --- | --- |
| SB1 **Identity** | One id for a thing that is several kinds at once (SC7) | K |
| SB2 **Quantities and properties** | Heat, load, essence by kind, vitality, light, noise; plus properties such as sharp, alive, moon-aspected | W |
| SB3 **Effects** | The shared effect grammar below | W primitives, P composition |
| SB4 **Workings** | Quote, settle, receipt, composed workings (SC6) | K |
| SB5 **Knowledge** | Who knows what, from which source, how sure (OS9) | N, existing owners until then |
| SB6 **Generators** | Grammar contract and canon test | P |

The rule that makes connection free: **laws read properties, not categories** (AD38). A cauldron's law reads heat, not "is this a fire charm". A Gu that gives off heat, a fire charm, a hot stone and a burning barn all warm it, with no join written between Gu and brewing.

### One effect grammar for every world

Today each world names its effects in its own terms. The D&D-shaped `effect_dsl.js` has schools, conditions and damage types; Gu abilities, Hogwarts spells and potions each have their own forms. Proposal: one **effect grammar** whose primitives act on W's quantities and properties. Canon effects become sentences in it, and new effects are new sentences.

| Part | What it says | Examples |
| --- | --- | --- |
| **Verb** | What changes | move, add, remove, transform, bind, sense, conceal, copy, block, alter a law field |
| **Object** | Which quantity or property | load, heat, vitality, essence, position, form, light, sound, memory, a relation |
| **Target and shape** | Where it lands | self, touched thing, line, cone, area, everything bound to a mark |
| **Time** | How long and when | instant, sustained while paid, lasting, delayed, triggered |
| **Carrier** | What delivers it | a Gu, a spoken spell, a potion, an item, a ritual, a formation |
| **Cost and source** | What it spends | essence by kind, stamina, spirituality, mana, lifespan, a consumed ingredient |
| **Limits** | What stops or resists it | mass, distance, a ward, a dao mark, the target's will, counter-effects |

Canon as sentences (paraphrased, illustrative):

- **Levitation charm:** move position upward, target touched thing, sustained while paid, carrier spoken spell with wand, cost stamina, limit mass.
- **Moonblade-style Gu attack:** remove vitality along a line, instant, carrier Gu, cost moon essence of its rank.
- **Polyjuice:** transform form to a donor's, self, lasting about an hour, carrier potion, source a donor's hair.
- **Spirit Vision (Lord of the Mysteries):** sense hidden properties, area around self, sustained, carrier Beyonder ability, cost spirituality.

Each world pack maps its own vocabulary onto the grammar (D&D's schools and conditions, Gu paths, Hogwarts charm families). Nothing in the grammar names a world (PFP3).

### Effects, moves and spells beyond the book

Generation is search over the grammar, with the world's laws as the judge:

| Code | Route | How it makes something new | Example |
| --- | --- | --- | --- |
| NV1 | **Recombine** | Swap one part of a canon sentence: a different verb, shape or carrier | A levitation that lifts along a line; a moon-essence move that conceals instead of cuts |
| NV2 | **Compose** | Chain workings into one composed working (SC6). The Gu move search already does this for supports plus a core (`gu_move_search.js`) | A killer move from three Gu the book never paired |
| NV3 | **Transfer** | Carry a sentence into another world's carrier and cost, when that world's laws can run it | A "summoning" Gu built from a Hogwarts summoning sentence, paid in essence |
| NV4 | **Invent under pressure** | An actor with a need searches for a sentence that meets it (P4, A's wants, `invention_planner.js`) | A besieged clan's keeper finds a move that hides the village from scouts |
| NV5 | **Discover by trying** | Experiments produce effects the maker did not intend. What they observe is separate from what is true (GR5) | A brew that was meant to heal also dulls pain in animals |

What a new effect must pass, in order:

1. **It runs.** The same laws that run canon effects run it (PFP16).
2. **It pays.** Cost and limits come from the world's rates. Bigger reach, longer time or more targets cost more by the same curve canon uses (P5 fit).
3. **The world allows it.** It breaks none of the world's ordinary laws, or it names the in-world reason and cost for the exception (AD5).
4. **It explains itself.** The player can read why it works, in the world's own words (SPR32, PRS rules).
5. **It is worth keeping.** Score candidates for usefulness, novelty and fit, and keep a spread rather than only the strongest (MC2 sample and score in GR; quality-diversity search). That way the world fills with different moves, not one best move copied.

A **novelty dial** per world and per actor runs from canon-near (one part changed) to far (new compositions and transfers). A traditional sect sits near. A genius or a desperate inventor sits far.

### More to consider

**ACCOUNT FOR NOW**

- **EF1 · Two worlds before it is real.** The grammar counts only when it rebuilds held-out canon effects from at least two worlds (P's canon test). Gu abilities and Hogwarts spells come first, D&D next through `effect_dsl.js` as a world-pack mapping.
- **EF2 · Primitives stay few.** A new verb or object needs a canon effect that the current set cannot express, and a second consumer (PFP5). Otherwise the grammar turns into an unchecked list.
- **EF3 · Counterplay comes free.** Block, conceal, sense and law-field verbs work against any effect with the matching object. Wards, Gu defenses and dispels then come out of the same grammar.
- **EF4 · Strong combos meet in-world pushback.** No balance is forced (AD22). A degenerate combo meets its costs, backlash, rivals who copy or counter it, and the world's limits, each with a dial.
- **EF5 · Names come last.** A new effect gets its name from the world's naming sheet after its substance is fixed (P1 flavor fill, NMR). A Gu path name or a Latin-root incantation follows the world's patterns.
- **EF6 · Generated truths can be sealed.** A randomized effect that a world hides is referred to by ID outside play.

**LATER / DELEGATE**

- **EF7 · Effect explorer.** A debug view that renders any sentence, its cost and its cause chain, and lists near neighbours of a canon effect. Read-only, on the existing inspectors (MC10). Level sonnet, effort medium. Done check: pick Levitation and see three runnable neighbours with costs.
- **EF8 · NPC repertoires.** Sects and teachers hold sets of sentences as secret or taught knowledge (M, N). A move spreads by teaching, theft or rumor. Level sonnet, effort medium, after A, M and N.

- **PFP22 · Laws read properties, not categories.**
- **PFP23 · Effects are sentences in one grammar.** Canon effects are sentences that already exist. New effects are new sentences that pass the five checks.
- **PFP24 · Novelty is a dial with a cause.** How far an actor strays from canon depends on who they are and what pushes them.

## Making "all" achievable: ledgers, grammar layers, procedural rules, milestones (2026-11-12)

Weibao (2026-11-12): "does the live goal meet the ambitions of my stated goal?" then "Consider procedural aspects, defining grammer, other aspects and more? Make sure it is achivable and actionable?"

The phase 1 goal undershot "all the Gu, all the possibilities of moves, all the potions": it had no denominators, no count for moves, no potion inventory for Lord of the Mysteries, and "works" meant contract tests. This section makes "all" countable and sets milestones that each leave the run better off if usage stops it.

### Coverage ledgers (CV)

- **CV1 · One ledger per corpus, in the repo.** `docs/coverage/<corpus>.jsonl`, one row per canon thing: `id`, `source` (locator), `state`, `mechanisms` (which owners it appears on, SC4), `test` (the test id that runs it), `note`. A script regenerates the counts table at `docs/coverage/README.md`.
- **CV2 · Five states, no silent gaps.**
  - `runs-canon`: runs as data with source-backed values.
  - `runs-authored`: the source is silent on a needed value, so it runs with original values labelled as authored (SKR rules).
  - `blocked:<rule>`: the rules cannot express it yet. The named missing rule is a backlog row for its owner.
  - `not-a-thing:<reason>`: a topic, alias or ordinary word, not a canon item.
  - `unclassified`: not yet looked at.
- **CV3 · The denominators.**

| Corpus | Ledger | Denominator | Owner |
| --- | --- | --- | --- |
| Gu kinds | `gu_kinds` | 1,466 index records (2,206 wiki rows) | G |
| Killer moves | `gu_moves` | 23 move records plus 753 move leads (leads may resolve to `not-a-thing`) | G |
| Hogwarts potions | `hp_potions` | 316 potion-related catalogue entries, classified into real potions and the rest | B |
| Hogwarts ingredients | `hp_ingredients` | 409 ingredient-related entries | B |
| Lord of the Mysteries potions | `lotm_potions` | Built first: one row per pathway sequence potion and named non-pathway potion, from the open canon (Weibao has read it in full, so it is open in development) | B |
| Hogwarts spells | `hp_spells` | 117 spellbook records | S |
| Gu as creatures, other creatures | `creatures` | Rows from G's catalogue plus L's inventory | L |

- **CV4 · Done means zero `unclassified`.** The `runs` share is the progress number, so a run that stops halfway still reports exactly how far it got. A `check:coverage` script reports the counts and fails only on malformed rows. Coverage percent is a report, not a gate.

### Grammar layers (GL): what "defining the grammar" means

P's v0 proved one layer: identity (path, role, rank, naming parts). Its own report shows the limits: revision 2 rebuilds names partly by construction, and generated kinds use a canon path and role pair only 56% of the time because the slots are drawn separately. Four layers, each with its own canon test:

| Layer | Says | Canon test (non-circular) | Owner |
| --- | --- | --- | --- |
| GL1 **Identity** | What it is: path, role, rank, lineage, family | Infer hidden parts from the rest above the majority baseline; joint pair support of 80% or more on generated items (dial) | P contract, domain grammar |
| GL2 **Effect** | What it does, as effect-grammar sentences (verb, object, target and shape, time, carrier, cost, limits) | Hold out the effect; predict it from identity plus the world's laws; compare with the recorded effect | P with W primitives |
| GL3 **Composition** | How things combine: killer moves, combined spells, recipes, assemblies (roles, order, timing, compatibility) | Rebuild held-out canon moves and recipes from their components; the result runs through K | P with K composed workings |
| GL4 **Context** | Where and why it arises: place, pressure, inventor, history | A seeded world produces things in the places and under the pressures the source shows (E) | P with W, A, E |

- **GL5 · Conditioned weights.** PGC3 allows one conditioning slot. GL1's pair-support target needs joint or chained conditioning; this is P's first v1 item.
- **GL6 · Nested parts.** Recipes and moves have steps with their own parts (P's v1 backlog). GL3 needs it.
- **GL7 · Labels from data first.** Labels come from catalogue fields and the effect sentences already written. Model help is bounded: haiku, at most two readers at once, shards of at most 12,000 words, repo data only, AU13 plan (MC14). A guessed label stays marked as an inference (PGC11).

### Procedural rules (PR) every generator follows

| Code | Rule | Default, dial and reason |
| --- | --- | --- |
| PR1 | **Addressed and repeatable.** Every draw has an address and a cause (PGC8, GR1-GR17) | A reload regenerates the same world |
| PR2 | **Freeze on reveal; grammar versions pinned.** Once observed, a thing is stored by value, and its grammar `ref` is stored with it | A grammar revision changes only what has not been seen yet; saves stay stable (OS8) |
| PR3 | **Bounded search.** Move, spell and recipe search runs under a trial budget and a time budget per settlement | Dial per actor. Reason: idle settlement must stay cheap (MC16) |
| PR4 | **Keep a spread, not a winner.** New effects go into a niche archive keyed by verb, object and carrier, best per niche (quality-diversity) | A world fills with different moves, not one best move copied |
| PR5 | **Novelty dial with a cause** (PFP24) | Sect tradition sits near canon; a genius or a desperate inventor sits far |
| PR6 | **Everyone uses the same generator** (PFP11) | NPC inventors and the player call the same search and pay the same costs |
| PR7 | **Explain every output.** Each generated thing renders as its sentence, its cause and its cost in world words (SPR32, PRS) | The player can ask "why does this work?" |
| PR8 | **Names last** (EF5, PGC12) | The naming sheet owner adds a Gu kind-name register (P's PGB7 request) |
| PR9 | **Sealed truths by ID** (EF6) | Randomized truths stay out of chat and reports |

### Milestones (MS): each one useful if the run stops after it

| Code | Milestone | Done check | Owners | Size |
| --- | --- | --- | --- | --- |
| MS1 | **Ledgers built, every row classified** | Zero `unclassified` in all CV3 ledgers; counts table committed | G, B, S, L; P supplies the script | Small. Mostly deterministic, with bounded haiku help |
| MS2 | **Effect layer** | GL2 canon test on Gu abilities and Hogwarts spells with held-out rebuild rates reported; target 70% (dial), with the misses as named missing rules | P, W, G, S | Medium |
| MS3 | **Runs as data** | Every chapter-checked Gu kind, every real Hogwarts potion and every spellbook spell either `runs-*` or `blocked` with a rule; Keeper compression has deleted at least 10 bespoke modules | G, B, S, K | Large |
| MS4 | **Moves and composition** | The 23 canon moves rebuilt as K composed workings; generated moves pass the five checks; niche archive populated for one Gu path | G, K, P | Medium |
| MS5 | **Works in play** | Each domain has one route a player can reach, at the AD43 floor (save, reload, import), with a headless browser receipt; one combined browser pass | All domains, E | Medium |
| MS6 | **Breadth** | N, X and D at v0 with one consumer each; PG1 people and PG2 societies generate with causes; E's three chains run with no join code | N, X, D, A, M, E | Large |
| MS7 | **The long tail** | `runs` share climbs across all ledgers; each `blocked` rule is built or rescoped with a reason | All | Ongoing after the run |

Order: MS1 first (cheap, and it shows the true size), then MS2 and MS3 together, then MS4 and MS5, then MS6. Usage pacing follows the run record: a stop at the 75% weekly line leaves the ledgers showing where each corpus stands.

- **PFP25 · "All" is a ledger.** A corpus is covered when every row has a state other than unclassified. Progress is the share that runs.
- **PFP26 · Each grammar layer has its own canon test.** Identity alone is not enough: effect, composition and context each rebuild held-out canon.

## Heredity and variation, player-made things, and lore from parts (2026-11-12)

Weibao (2026-11-12): "Procedural rules to account for player made possiblities and more?" then "Overarching systems like genetics and stuff, creature variations between same type and more? other aspects to consider? Procedural system to allow player made combinations nad more, but also for existing combinations to create the stuff in lore and more? Other fun ways we can take these ideas?"

### Heredity and variation within a kind (GN)

Two inheritance models already exist and disagree. `lineage_traits.js` has an allele model, two alleles per locus with dominant, recessive, incomplete and fickle modes. Its phenotype shows and its genotype is learned by testing or deduced from a child. `creature_lifecycle.js` copies each trait whole from one parent at random. Proposal: one heredity layer owned by L, built from the first model, with the second folded onto it.

| Code | Part | Default, dial and reason |
| --- | --- | --- |
| GN1 | **Genome as data.** Each kind declares loci in its world pack: what each one affects, its expression mode, mutation rate and any linkage | Loci are world rows, not code (PFP1). A Gu line, a Hogwarts beast and a sheep breed use the same machinery with different rows |
| GN2 | **What shows comes from genes, growth, place and life.** Phenotype = genes expressed through development, environment (W quantities while growing), condition and learned behavior | Two siblings differ by genes; two clones differ by upbringing. Variation within a kind has four separate causes the player can read |
| GN3 | **Individual spread.** Every individual draws its own spread around the kind's ranges, by address (PR1) | The tray Moonlight traits (G2) become the general case. No two of a kind are identical unless cloned |
| GN4 | **Mutation, drift and selection.** Mutation at a per-world rate, raised by W conditions (lightning, essence surges, potion residue). Wild populations drift under P3 pressure; breeders select | Dial per world. Reason: how new breeds and wild variants come to exist with a cause (PFP19) |
| GN5 | **Hybrids, fusions and lines.** Crosses inside a family breed true or not by genome distance. Some hybrids are sterile. Gu fusion and refinement make a different kind (GKM51), which goes through F's making grammar, not breeding | Distance thresholds are dials. Skrewt-style failures are allowed and costly |
| GN6 | **Known versus true.** The genotype is hidden until tested, bred out or deduced (the existing model's rule), through N's knowledge | Breeding is a puzzle the player solves, not a stat sheet |
| GN7 | **People too.** Talent and aperture grade (Gu), magical heredity and squibs (Hogwarts), Beyonder traits passed down (Lord of the Mysteries) use the same layer where the source does | Each world's own heredity claims are canon fixed points (AD49) |
| GN8 | **Detail near, counts far.** Individuals the player has met are stored. Herds and wild populations away from the player keep trait frequencies, not individuals (SPR28, PR2) | Cost stays bounded. An individual is drawn from the frequencies when someone looks |
| GN9 | **Canon breeds are fixed points.** A canon kind's normal range is its calibration (P5). Generated variants sit around it | Variants stay recognizably that kind |

### Player-made possibilities (PM)

| Code | Rule | Default, dial and reason |
| --- | --- | --- |
| PM1 | **One gate for everyone.** A player's move, spell, recipe, breed plan or device goes through the same `assemble` and the same K quote and settle as canon and NPC creations (PGC5, PFP16) | No special player path that NPCs lack, and none they have that the player lacks (PFP11) |
| PM2 | **Honest preview.** The quote shows what the player's character expects, from what they know. An unknown part shows as unknown, not as a guess presented as fact (GR5, the unknown marks UK1-UK7) | Knowing more makes previews sharper; trying teaches |
| PM3 | **Say what you want, get candidates.** The player can state a goal ("cross the river", "hide the camp"); a bounded search (PR3) proposes workings from what they know and own. The existing `invention_planner.js` and move search are the first engines | The player still chooses and pays. Search depth rises with skill and knowledge |
| PM4 | **Failures teach.** A failed or odd result records what happened and why, and the player's knowledge of the parts improves (NV5) | Experimenting is progress, not a dead end |
| PM5 | **Your names, true ids.** The player can name what they made. The name lives in knowledge, and the truth keeps a stable id (PGC9) | NPCs who learn it may call it something else |
| PM6 | **Inventions live in the world.** A player creation can be taught, sold, stolen, copied or reverse-engineered by NPCs through M and N. Rivals counter it (EF3) | The world answers what you make |
| PM7 | **Frozen with their grammar** (PR2) | A later grammar revision never changes what you already made |
| PM8 | **No exploit hardening** (AD22) | A strong combo meets in-world costs and counters, not a cap |

### Lore from parts: forward and backward (RV)

The same grammar runs both ways.

- **RV1 · Forward.** Combine parts and get a result. Canon combinations produce canon things: brew the Hogwarts recipe in its canon order and get its canon potion; pair the book's Gu and get the book's move. The canon test (PGC10) proves this for each corpus.
- **RV2 · Backward.** Start from a lore thing and search for the combinations that make it. The canon recipe is one answer. Others may exist where the mechanisms allow (AD38), such as a substitution route or a different Gu pairing for the same effect.
- **RV3 · Recipes are knowledge in the world.** Some canon recipes are common knowledge, some belong to a sect or teacher, and some are lost. The player finds them by teaching, books, theft, reverse-engineering or trying (N, M).
- **RV4 · Lore as targets.** A canon Gu, move or potion the player has heard of but cannot make yet is a goal with a visible gap: which part, skill or law they are missing. The coverage ledgers (CV) feed the world's list of what exists.
- **RV5 · New lore, too.** A player invention that spreads becomes part of the world's lore for later generations (PG4 histories).

### Other aspects to account for (OA)

- **OA1 · Ecology.** Population size, predators and prey, carrying capacity and invasive species, as W quantities and L actors. A released pet or an escaped Gu colony can change a region.
- **OA2 · Domestication.** Temperament and trust across generations (L with A), so a wild line can become a working line over time.
- **OA3 · Pedigree and registry costs.** Pedigrees are knowledge records with sources. Breeders and sects keep them; forged pedigrees are possible (M).
- **OA4 · Teaching drift.** An apprentice learns a recipe or move with errors or improvements. Schools of practice diverge over generations (N, PG4).
- **OA5 · One duplicate to fold.** `creature_lifecycle.js` inheritance folds onto the `lineage_traits.js` model. This is the first L task under GN.

### Fun directions (FN), as a palette

| Code | Idea | Built from |
| --- | --- | --- |
| FN1 | **Dynasties.** Breed a Gu or beast line over generations toward a goal, with tested and hidden genes | GN, N |
| FN2 | **Recipe archaeology.** Ruins and old notes hold partial recipes; reconstruct the missing steps by experiment | RV3, NV5, sites (SR) |
| FN3 | **Lore hunt.** A compendium shows every canon thing you have heard of, what you have made, and your own inventions. Gaps show what you lack | CV ledgers, RV4 |
| FN4 | **Rival inventors.** NPCs race you to the same discovery; first to teach it sets its name in the region | A, M, N, PM6 |
| FN5 | **Weather-born variants.** A thunderstorm season breeds lightning variants; a moon-heavy valley yields moon-aspected Gu | GN4, W sky |
| FN6 | **Cross-world crossings.** A transmigrated keeper carries a Hogwarts charm's effect into a Gu, or a potion into Gu feed (NV3, WER rules) | NV3, effect grammar |
| FN7 | **Your legacy.** Centuries later, a sect still uses your killer move under another name, slightly changed by teaching drift | PG4, OA4, PM6 |
| FN8 | **Reverse puzzles.** Given a lore item and a limited kit, find any working route | RV2 |
| FN9 | **Failed hybrids that turn useful.** A sterile, ugly cross finds a niche nobody planned (a Skrewt-like cross that guards a gate) | GN5, A |

- **PFP27 · One heredity layer.** Kinds declare genomes as data; individuals differ by genes, growth, place and life; the true genotype is known only through testing or deduction.
- **PFP28 · Grammars run both ways.** Forward builds results from parts; backward finds the parts for a lore thing. Canon recipes are one answer among the ones the mechanisms allow.
- **PFP29 · Player creations are world citizens.** Same gate, same costs, a name in knowledge, and the world can learn, copy and counter them.

## Lore first, inheritance beyond genes, and a depth checklist (2026-11-12)

Weibao (2026-11-12): "send out stuff to cover OA1-5. FN1-9, but we need to make sure foundational stuff works out too, Other stuff in books worth adapting into procedural systems and more? Consider lore aspects first?" then "Consider Aspects beyond genone, if that would even be the most optimal and more? other aspects to consider? selective breeding and more? consider magical aspects? Similar depth considerations for other aspects too?"

### Lore first (LR)

- **LR1 · Order: lore, then mechanism, then generator.** Before a generator is built for any area, its canon laws are collected as fixed points with locators (SKR1, AD49). The generator is then calibrated to them. A world law written as a W law field comes before any procedural variation of it.
- **LR2 · Lore laws from the books worth adapting** (paraphrased; each needs a locator from a source dive before it becomes a fixed point):

| Code | Source | Lore law or practice | Becomes |
| --- | --- | --- | --- |
| LR3 | Lord of the Mysteries | Beyonder characteristics are conserved. They pass on at death and gather together, and are never destroyed | A W conservation law on an identity (SC7). R reads it for advancement; M for trade in remains |
| LR4 | Lord of the Mysteries | Acting method: a potion digests by living its role. Loss of control comes from undigested power | R progression by working style (A and K read the role), and a madness meter in A |
| LR5 | Lord of the Mysteries | Speaking an honorific name draws a being's attention. Divination and ritual follow set forms | S ritual grammar; N knowledge hazards (knowing or saying a thing has a cost) |
| LR6 | Lord of the Mysteries | Sealed artifacts carry negative side effects as the price of their power | F and the effect grammar: a cost slot that is a standing effect |
| LR7 | Reverend Insanity | Blessed lands and immortal apertures face tribulations and calamities on a schedule set by their nature | X places with a W calendar of trials; R for the owner |
| LR8 | Reverend Insanity | Luck and fortune as a resource that can be read, stolen and spent | W quantity on actors; effect grammar verbs move and sense on it |
| LR9 | Reverend Insanity | Immortal Gu are unique in the world; refining one elsewhere is contested | P generator constraint plus M claims |
| LR10 | Reverend Insanity | Inheritances: a dead master leaves a trial that a successor must pass to take it | D situations from X sites, with R and N |
| LR11 | Harry Potter | A secret can be bound into one keeper, so that only that keeper can reveal it | N knowledge law: a fact whose spread routes through one actor |
| LR12 | Harry Potter | Wands choose their owners and change allegiance through defeat | F item with a tie (A) and an allegiance rule triggered by C outcomes |
| LR13 | Harry Potter | Binding vows enforce themselves | K authority read at settlement, with a lethal cost line |
| LR14 | Harry Potter | Experimental breeding of magical creatures is restricted by law | M law on L breeding: a dial, an in-world reason and a penalty, not a hard block |
| LR15 | Mother of Learning | A time loop resets the world but keeps a soul's memory | N plus save shape: what carries across a reset (WER) |
| LR16 | D&D | Attunement limits how many strong items one person can use | A limit adjective on ties (AD22 limits are adjectives) |

### Inheritance beyond genes (IH)

A gene model is the right base for ordinary bodies, but not the whole answer. The books pass traits on in other ways, and breeders work with numbers, not single genes. Proposal: **inheritance channels**, each with its own rules, declared per kind in the world pack.

| Code | Channel | How it passes | Fits |
| --- | --- | --- | --- |
| IH1 | **Polygenic value** | Most traits (size, speed, yield, essence capacity) are a sum of many small effects: offspring land near the parents' average plus noise. Heritability is a per-trait dial | Selective breeding as real breeders do it. Cheaper than many loci and better for "breed for X" |
| IH2 | **Marker loci** | A few visible traits use the existing allele model (`lineage_traits.js`): coat, markings, a rare gift | Readable puzzles: hidden carriers, test crosses |
| IH3 | **Magical aptitude** | Carried by blood but not purely by genes: magical families with rare squibs and rare magic from non-magical parents; Gu aperture grade | A world rule with canon odds as fixed points; can skip a generation |
| IH4 | **Essence and upbringing** | What the young are fed, the essence around them and how they are raised shape the adult | Gu feeding, moonlight exposure, a Hogwarts beast raised in a menagerie. Same genes, different adult |
| IH5 | **Conserved essence** | Some power is a thing that passes on rather than being copied (LR3) | Lord of the Mysteries remains; inherited Gu |
| IH6 | **Learned and taught** | Skills, songs and hunting styles pass by teaching and imitation (OA4) | Animals and people both. Can be lost in one generation |
| IH7 | **Blessings, curses and bonds** | A family curse, a divine favor or a contract follows a line until broken | Law fields scoped to a lineage (W O5) |
| IH8 | **Making, not breeding** | Gu fusion and refinement create a new kind through F, not breeding (GN5) | Keeps breeding and making separate |

**Selective breeding (SB7 onward):**

- **SB7 · Breeding values from what you know.** A breeder estimates an animal's worth from its own traits, its relatives and its offspring. The estimate improves with records (N pedigrees) and is never the hidden truth.
- **SB8 · Real costs.** Generation time, feed, space, culls and lost lines. Fast-breeding kinds such as insects and small Gu improve quickly; dragons barely do.
- **SB9 · Inbreeding has a price.** Close breeding fixes traits faster but raises hidden defects. Outcrossing restores vigor. Hybrid vigor in a first cross fades in later ones.
- **SB10 · Selection limits.** Traits linked to unwanted ones drag them along. A trait pushed hard reaches a ceiling set by the kind's biology or law.
- **SB11 · Magic speeds or bends it.** Essence feeding, potions, charms or Gu can raise expression, cause chosen mutation (at a cost and with side effects), or reveal hidden genotype (a divination or a testing Gu). Each is a working with a price, not a free shortcut.
- **SB12 · Society cares.** Breed registries, prize shows, bans (LR14), black markets and sect-guarded lines (M).

### A depth checklist for every aspect (DC)

The same questions applied to heredity work for every area. Each owner answers them in its checkpoint before building a generator:

| Code | Question |
| --- | --- |
| DC1 | **What carries it?** The channels: body, item, place, knowledge, relationship, law field |
| DC2 | **How does it vary?** Within a kind, between individuals, over time |
| DC3 | **How does it pass on or spread?** Inheritance, teaching, trade, theft, contagion, conservation |
| DC4 | **How is it improved on purpose?** Selection, practice, refinement, research, and what each costs |
| DC5 | **What is hidden, and how is it learned?** Testing, deduction, divination, records |
| DC6 | **What does magic add or bend?** Which working changes it and its price |
| DC7 | **What are the canon fixed points?** Lore laws with locators (LR1) |
| DC8 | **What does society do about it?** Law, markets, prestige, secrecy |
| DC9 | **Scale and cost.** Detail near, counts far |
| DC10 | **What can the player pull on?** The levers and what they read back |

Applied in one line each:

- **Items (F):** wear, provenance and history; repair and improvement; hidden flaws found by appraisal; enchantment adds properties; makers' marks.
- **Skills (R, N):** practice, teaching and drift; hidden aptitude; plateaus.
- **Potions (B):** recipe lines drift by teaching; batch variation; hidden contamination; substitution research.
- **Spells (S):** schools and personal styles; misremembered incantations; spell research.
- **Places (X):** soil, essence and history accumulate; land improves or exhausts; hidden sites found by survey.
- **Societies (M):** doctrine drifts; succession; schisms; secrets held by few.
- **Knowledge (N):** facts copy, decay and distort; records preserve them; some knowledge is dangerous (LR5, LR11).

### Routing (sent 2026-11-12, after the foundation milestones)

Foundations first: none of these starts before its owner's MS1 to MS3 items, except OA5, which is foundation work.

| Item | Owner | When |
| --- | --- | --- |
| OA5 fold the duplicate inheritance; IH1 and IH2 as the base | L | Now |
| OA1 ecology, IH4 upbringing, SB7-SB11 | L with W and E | After L's MS1 and MS5 |
| OA2 domestication | L with A | After A v0 |
| OA3 pedigrees, OA4 teaching drift, LR5, LR11, LR15, SB7 records | N (new chat) | When N starts |
| SB12, LR14 breeding law and markets | M | After M's first chain |
| LR3, LR4 | R with W | With R's sequence step |
| LR6, LR12, LR16 | F with A | After F's MS3 |
| LR7, LR10 | X and D (new chats) | When they start |
| LR8, LR9 | G with W and M | After G's MS3 |
| LR13 | K | With the actor quote |
| FN1-FN9 | Owners named in the FN table | After MS3, as play slices on the foundation |

- **PFP30 · Lore before generators.** Canon laws are fixed points with locators before any generator varies them.
- **PFP31 · Inheritance has channels.** Genes for bodies, plus aptitude, upbringing, conserved essence, teaching, bonds and making, each with its own rules.
- **PFP32 · Every aspect answers DC1-DC10** before its generator is built.

## Bloodlines, descent beyond creatures, and depth for spellcraft and potions (2026-11-12)

Weibao (2026-11-12): "consider aspects like bloodlines and more? Stuff beyond Creatures? Some stuff to focus on Spellcraft and potioncrafting? More to consider?"

### One descent graph for everything that has ancestors (DG)

Bodies are not the only things with lineage. A recipe has a parent recipe, a spell has a teacher, a sword has its ore, a sect has a founder, an estate has heirs. Today each keeps its own: `family_tree.js` and `village_family.js` for people, `lineage_traits.js` for breeding, `material_lineage.js` for materials, `heir_inheritance.js` and `heirloom_*` for estates and heirlooms. Proposal: one **descent graph** on K's identity (SC7), each owner writing its own edge kind.

| Edge | Means | Owner |
| --- | --- | --- |
| DG1 born-of | Biological parents | L |
| DG2 made-from | Materials and parts | F |
| DG3 refined-from | A Gu, potion or item made out of another, or a move refined into a Gu (SC8) | F, G, B |
| DG4 taught-by | A skill, spell, recipe or move learned from someone | N |
| DG5 forked-from | A variant of a recipe, spell or move | P |
| DG6 inherited-by | An estate, title, heirloom, Gu or Beyonder characteristic passed on | M, R (LR3) |
| DG7 founded-by | Sects, schools, families, houses | M |

Then "bloodline" is a query, not a separate system: everything reachable along born-of, plus what rides with it.

### Bloodlines (BL)

| Code | Part | Default, dial and reason |
| --- | --- | --- |
| BL1 | **Body inheritance** rides IH1-IH3: polygenic traits, markers and magical aptitude | Canon odds are fixed points (magical families, squibs, aperture grades) |
| BL2 | **Latent and awakened.** A trait can stay hidden for generations and wake under a trigger: danger, a ritual, an essence surge, a lore event | Reason: the xianxia and fantasy pattern of awakening blood. Trigger and odds are dials |
| BL3 | **Dilution and purity** as a computed share along born-of. Purity can matter in law and prestige without mattering to the body, or the other way round | Keeps "pure-blood" politics (M) separate from what blood actually does (L) |
| BL4 | **Blood-bound law fields.** Curses, blessings, pacts and vows scoped to a line (IH7, LR13), broken only by a working with a cost | A family curse is a law field, not a flag |
| BL5 | **Blood as a key.** Some wards, inheritances and artifacts open only to a line (LR10) | Identity check on born-of, with forgery possible at a cost |
| BL6 | **Family assets.** Family Gu, heirloom wands, guarded recipes and signature moves pass along inherited-by and taught-by | A bloodline's power is often its holdings and teaching, not its genes |
| BL7 | **Claims and politics.** Titles, succession, marriages, feuds and blood debts are M facts on the graph | Feuds can outlive the people who started them |
| BL8 | **Known versus true.** Parentage can be hidden, false or unknown. Bloodline tests, divination and records reveal it (N) | Secret lineage is a story engine (D) |

### Lineage beyond creatures (LN)

- **LN1 · Plants.** Cultivars, grafting, cuttings and seed saving. Spirit herbs and Gu-feeding grasses breed and drift like animals (L).
- **LN2 · Gu lines.** Propagation (the Thunder Potato mother), refinement upgrades, and fusion into new kinds (G, F).
- **LN3 · Objects.** Makers' schools, named smiths, a blade reforged from an older one, heirloom history raising value and attunement (F, M).
- **LN4 · Recipes and spells.** Family recipes, school spells, a teacher's annotated book. Drift and improvement along taught-by and forked-from (N, P).
- **LN5 · Institutions.** Sects split and merge, schools found branches, houses rise and fall (M, PG2).
- **LN6 · Places.** Estates, blessed lands and grottoes pass to heirs with their history and their trials (X, LR7, LR10).

### Spellcraft depth (SPD)

S's own finding: blind identity got verb and object right for only 35 of 94 spells (GL2). So the parts list does not yet carry what makes a spell work. What the grammar and laws need:

| Code | Aspect | What it adds |
| --- | --- | --- |
| SPD1 | **Components** | Incantation, gesture, focus (wand, staff, talisman), intent and attention as separate parts, each able to fail or be skipped at a cost (wordless and wandless casting) |
| SPD2 | **Skill curve** | Practice raises reliability, power and speed separately; a plateau per spell; rust without use |
| SPD3 | **Shaping** | Spell-shaping exercises (the Mother of Learning pattern) change area, precision and efficiency as trained skills |
| SPD4 | **Failure modes** | Fizzle, backfire, misfire onto another target, partial effect. Each is a sentence of its own, not just "failed" |
| SPD5 | **Counterplay** | Shields, counter-spells, dispels and wards as effect sentences against matching objects (EF3) |
| SPD6 | **Invention** | Canon shows students inventing spells. Research is an experiment loop on the grammar (NV1, NV5) with a notebook as the knowledge record |
| SPD7 | **Personal style** | A caster's signature: preferred families, quirks and variations that teaching passes on (LN4) |
| SPD8 | **Standing fields** | Wards, enchantments and charms that persist on places and objects, as W law fields with upkeep |
| SPD9 | **Cost sources by world** | Stamina, spirituality, mana, spell slots, essence; each world's pack maps its cost to the grammar's cost slot |

### Potion-craft depth (PTD)

| Code | Aspect | What it adds |
| --- | --- | --- |
| PTD1 | **Ingredient properties** | Each ingredient carries properties, not a label: what it does, how strongly, how it reacts. Preparation forms (sliced, crushed, powdered, stewed) change them |
| PTD2 | **Freshness and provenance** | Age, storage, harvest conditions (moon phase, season), and source quality change potency (the fluxweed rule as a general case) |
| PTD3 | **Process** | Temperature, stirring count and direction, timing, order and resting as tokens with tolerances. Off-tolerance steps shift the result rather than only failing it |
| PTD4 | **Vessel and tools** | Cauldron material, size and residue history (B's vessel history) |
| PTD5 | **Brewer skill and judgement** | Reading the brew's color, smell and texture; a skilled brewer can correct mid-process |
| PTD6 | **Batch variation** | Quality spread per batch, by address (PR1). Two batches of the same recipe differ |
| PTD7 | **Interactions** | Potions mix in a body: stacking, cancelling, dangerous combinations. Antidotes to blended poisons need more than the sum of single antidotes (a Hogwarts canon principle; locator owed) |
| PTD8 | **Shelf life and spoilage** | Potions degrade, separate or turn, using the existing spoilage owner |
| PTD9 | **Improvement and annotation** | A brewer's notes can improve a canon recipe. A notebook is an item carrying knowledge (N), like an annotated textbook |
| PTD10 | **Lord of the Mysteries formulas** | Main and supplementary ingredients, ritual conditions, and digestion afterwards (R, LR4); characteristics conserved (LR3) |

### More to consider (BX)

- **BX1 · Shared research loop.** Spell research, potion research, breeding programs and Gu refinement are all one loop: hypothesis, trial, observation, notebook update. K's working plus N's knowledge. Build it once (P, K, N).
- **BX2 · Notebooks and books as items.** An annotated book carries knowledge, provenance and a forger's risk. Reading it teaches on the taught-by edge (N, F).
- **BX3 · Descent is cheap if stored as edges.** One graph, with detail near and counts far (GN8). Only observed ancestors are stored.
- **BX4 · Canon families as fixed points.** Named canon families, clans and lines with their stated traits go into the lore ledger first (LR1).

- **PFP33 · One descent graph.** Bodies, things, knowledge, institutions and places record their ancestry as typed edges on one identity graph; a bloodline is a query over it.
- **PFP34 · Spells and potions are made of working parts.** Components, process steps and ingredient properties each carry their own tolerance, failure and skill, not one success roll.

## More systems at the same depth (2026-11-12)

Weibao (2026-11-12): "hand off for codex coordinator to take over and work on implementing everything in full? maybe can defer gameplay for now to focus on foundational systems like the procedural stuff and more. OTher systems with the same depth to send out too"

Each row answers the depth checklist (DC1-DC10) in short: what carries it, how it varies and spreads, how it is improved, what is hidden, what magic adds, canon anchors and society's part. Owners are the plan's chats; new ones are marked.

| Code | System | Carries it | Varies and spreads | Improved by | Hidden, and how learned | Magic and lore anchors | Society | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MD1 | **Knowledge and research** | Actors, books, notebooks, rumors | Copying, decay, distortion, teaching drift | Study, experiment, deduction | Truth versus belief; dangerous knowledge | Secret keepers (LR11), names that draw attention (LR5), memory across loops (LR15) | Libraries, sects guarding texts, censorship | N (new) |
| MD2 | **Places and terrain** | Regions, sites, routes | Soil, essence, ruin, weather history | Cultivation, building, drainage | Unsurveyed sites, hidden ruins | Blessed lands and their tribulations (LR7), inheritance trials (LR10) | Ownership, borders, claims | X (new) |
| MD3 | **Situations and story** | Pressures, actors, beats | Escalation, aftermath | Player and NPC intervention | Hidden motives and causes | Canon beats as fixed points (AD49) | Reputation, rumor | D (new) |
| MD4 | **Formations, wards and arrays** | Places and objects as law fields | Strength decays, upkeep | Layering, keystones, better materials | Unseen wards, traps | Gu formations, Hogwarts protective charms, ritual circles | Sect defenses, warded estates | S and W, with F for anchors |
| MD5 | **Health, injury and medicine** | Bodies | Wounds, infection, illness spread | Treatment, rest, potions, Gu | Undiagnosed conditions | Healing magic, curses that block healing | Healers, hospitals, fees | L with B |
| MD6 | **Minds and emotion** | Actors | Mood, fear, trust, sanity, loss of control | Rest, therapy, rituals, bonds | Hidden intentions | Lord of the Mysteries loss of control (LR4), mind magic | Stigma, cults | A |
| MD7 | **Faith, gods and higher powers** | Beings, churches, law fields | Favor, attention, doctrine drift | Worship, offerings, deeds | Who is really answering | Lord of the Mysteries deities and churches, Heaven's will in Reverend Insanity | Churches, heresy, inquisitions | M with W (law fields) |
| MD8 | **Law, crime and justice** | Societies, records | Enforcement strength by place | Bribes, patrons, reform | Unsolved crimes, evidence | Binding vows (LR13), breeding laws (LR14) | Courts, guards, bounties | M |
| MD9 | **Economy and work** | Goods, labor, coin | Prices, scarcity, wages | Trade routes, skills, tools | Market rumors, insider knowledge | Essence stones and Gu as currency | Guilds, taxes, debts | M |
| MD10 | **Time, calendar and sky** | W processes | Seasons, moon, festivals | Prediction, almanacs | Rare celestial events | Moon windows for brewing and Gu (LR2 rows) | Festivals, holy days | W |
| MD11 | **Weather and disaster** | W quantities | Storms, droughts, plagues | Forecasting, wards, granaries | Coming disasters | Earthly calamities and tribulations (LR7) | Relief, blame, migration | W with X |
| MD12 | **Language and names** | Knowledge, places, people | Dialects, nicknames, forgotten names | Learning, translation | True names, coded speech | Honorific names (LR5) | Prestige of names, taboos | N with naming sheets (NMR) |
| MD13 | **Travel and transport** | Routes, mounts, vehicles, Gu houses | Danger, speed, cost by route | Better mounts, roads, travel Gu | Shortcuts, secret routes | Apparition, Fixed Immortal Travel, Gu houses | Tolls, caravans | X with F and L |
| MD14 | **Enchanting and artifacts** | Items with law fields | Charge, wear, side effects | Recharging, refining, binding | Hidden properties, curses | Sealed artifacts (LR6), wand allegiance (LR12), attunement (LR16) | Collectors, bans, black markets | F with S |
| MD15 | **Relationships and households** | Ties between actors | Trust, debt, love, rivalry | Gifts, help, time | Secret feelings, betrayals | Pacts, familiars, binding vows | Marriage, adoption, feuds (BL7) | A with M |

Order, foundations first: N, X and D start as chats once usage allows, then the rows on existing owners join each owner's queue after its MS3. Each new system gets a contract v0, one consumer, a ledger where it has a canon corpus, and its DC answers before any generator.

- **Gameplay deferred (Weibao, 2026-11-12).** Playable slices stay paused while foundations are built. MS5's "one reachable route per domain" stays as proof that a foundation runs in the real game, not as content work.

## The goal

Weibao (2026-11-11): "go ahead and /sharpen /more-to-consider /goal creating comprehensive system for each sytem, /sharpen goal first"

**Coordinator goal** (for this plan's coordinating chat, Codex `/goal` or Claude `until-done`):

> Build one comprehensive procedural system for each foundation in this plan: the shared kernel working (K), world substrate (W), procedural grammar (P) and emergence harness (E), and on them Gu (G), living things (L), fabrication (F), brewing and chemistry (B) and spellcraft (S). Each domain declares its quantities, laws, workings, generators and catalogue rows over the shared layers, and canon is data on them, not bespoke modules. Work in order: stabilize and commit the current wave; K and W publish a v0 contract; domains inventory and embed; prove emergence with seeded runs and one combined browser pass. The goal is done when every chat meets its done check in the tables above, the PFP2 counts are recorded, the three emergence chains run with no join code, and each phase is committed. Breadth past the done checks goes to each domain's backlog, not into this goal. Playable slices stay paused until a domain is done (PFP9). Preserve the 64,500-credit reserve; push waits for Weibao's yes.

**Per-chat goal** (fill the brackets from the chat's table row):

> Own [chat letter and name] in the procedural foundation plan. Your files: [owns column]. Build on the K and W v0 contracts; request kernel or substrate changes from their chats instead of editing them. Done when: [done check column], the PFP2 counts are recorded in your checkpoint, your focused tests pass, the paused lead-life tests still pass, and your phase is committed from a fresh HEAD with your paths only. Record what the rules could not express as backlog rows. Stop at the done check.

## More to consider, round 1 (2026-11-11)

On the goal above. Codes MC1 onward; later rounds continue the numbering.

**ACT NOW** (done in this round)

- **MC1 · A finish line.** "Comprehensive" with open paper rounds kept the Gu goal open all day (review G5). The goal above closes on the table's done checks; further breadth becomes backlog (PFP6).
- **MC2 · Contract first.** Seven domain chats depend on K and W. Without a frozen interface they either wait or each guess a shape, which recreates review F3. Order step 2 now starts with K and W publishing a v0 contract (a short contract doc plus stub tests). Domains inventory before v0 and embed after it. Contract changes are versioned requests to the owning chat.
- **MC3 · Goal text per chat.** The template above gives every chat the same closing terms, so the coordinator can check one form.

**ACCOUNT FOR NOW** (constraints on every chat)

- **MC4 · Save shape.** Re-expressing Keeper scenes and recipes as data changes save keys. Old saves are disposable by standing direction, but each phase records one compatibility line (AGENTS Safety): migrated, reset with reason, or unchanged.
- **MC5 · Paused lead lines stay green.** Klein's and Fang Yuan's verified endpoints (ch129, ch140) are the first consumers when slices resume. Their existing tests are a gate on every embed phase, so foundations cannot quietly break them.
- **MC6 · Isolation for overlapping writers.** Nine writers in one checkout with 300+ dirty paths is how the 4 failures appeared. After step 1, each chat works in its own worktree from the stabilization commit (AD41 allows isolation for overlapping writers), and one integrator merges finished phases and runs the full suite.
- **MC7 · Test contention.** `npm test` takes about 9 minutes and runs one at a time through the limiter. Chats run their focused files; the integrator runs the full suite at merge, trusting its real exit code, not the wrapper's (review F4).
- **MC8 · Knowledge already has owners.** What a maker knows versus the truth (GR5, the kernel's observed-versus-true split) has existing owners: `discovery_codex`, `knowledge_home`, `knowledge_view` and `chain_inspector`. K reads and writes through them, with no new knowledge layer.
- **MC9 · Two worlds per domain.** One world's canon makes Gu-shaped generality. Each domain's done check uses canon from two sources where they exist. S and B already do. F adds a second world's recipes. G's second consumers are L (Gu as creatures) and F (refinement as making), not a second Gu world.
- **MC10 · Inspection reuses inspectors.** E and every domain need to see quantities, law fields and cause chains. Extend `chain_inspector` and `material_inspector` read-only. Mutation stays in debug tools that are labelled as such.
- **MC11 · Budget.** One coordinator and one shared budget (AU1-AU15). A Codex usage preflight runs before any dispatch, and the credit reserve holds.
- **MC12 · Sealed truths.** Canon test reports and generated or randomized truths refer to sealed secrets by ID (AGENTS Sealed secrets). Open canon such as Lord of the Mysteries can be named.

**LATER / DELEGATE** (adjustable working defaults under AD56; none is started by this round)

- **MC13 · Progression has no chat.** Gu rank and aperture, cultivation (`cultivation_*`), Lord of the Mysteries sequences and digestion, and faction rank are all advancement through the same pattern of thresholds, risk and cost, and no chat owns them. Proposed chat **R · Progression** after K v0: advancement as a domain on K and W. Level sonnet, effort medium. Done check: a Gu rank step and one Lord of the Mysteries sequence step run on one rule with world numbers in packs.
- **MC14 · Corpus labelling.** P5 needs part labels on the 2,206 Gu rows and the recipe and spell lists. That is bulk extraction: a finite plan under AU13, haiku or the local census lane, deterministic checks on the output. Level haiku, effort high (volume). Done check: labelled rows with locators and a spot-check pass rate.
- **MC15 · Markets and societies.** Actors under pressure (O4) need prices, scarcity and sect or guild behavior. FG7's relationships sit in K for now; markets have no owner. Proposed after W v0 as a domain on shared quantities. Level sonnet, effort medium. Done check: a scarcity in one domain changes a price that changes an NPC's choice in another.
- **MC16 · Far-rates cost.** W's away settlement must stay cheap over long idle time. E records settlement time per simulated day alongside its chains. Level sonnet, effort low. Done check: a budget number in E's report and a test that fails when it is exceeded.
