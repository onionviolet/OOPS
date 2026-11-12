# Procedural foundation plan

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
