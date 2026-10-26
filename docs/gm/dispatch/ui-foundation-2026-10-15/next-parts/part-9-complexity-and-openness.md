# Part 9: complexity, open world and what to defer

2026-10-16. **Planning only; every guardrail below is a proposal.** Weibao asked,
about Part 9:

> Consider how other games and more deal with levels of complexities like these
> ... would we need to implement each npc and more? that would be really tough ...
> Scopes that are impossible to achieve? ... maybe we need to setup guides so we
> cant reach that level of complexity quite yet and defer alot of things for the
> future? How to make it open world as possible and more? Generating things?
> Creating core things, interactions and more?

This extends [part-9-direction](part-9-direction.md) and
[part-9-room-to-world](part-9-room-to-world.md). It keeps their first slice
(P9D2: Village plus one known route) and the
[ruins and world first](../../procgen-2026-10-13/p11/DUNGEON_CONTENT.md#ruins-and-world-first-consideration-2026-10-16)
NPC deprioritization. It selects no implementation. Codes use **P9Z**.

Game examples below come from general knowledge of how those games work, not
from a new decompile or source audit. Treat them as patterns, not citations.

## Short answers

| Code | Question | Answer |
| --- | --- | --- |
| P9Z1 | Do we implement each NPC? | **No.** Nobody does, including the games that feel most alive. One person template, role and culture data, shared verbs, and promotion when the player looks. Already the rule: [GR3 freeze on reveal, GR4 lazy addresses, GR11 budgets, GR13 same rules for NPCs](../../../../GENERATION_FOUNDATION_RULES_2026-10-14.md). Cost scales with **interactions the player can exercise**, not with how many people exist. |
| P9Z2 | Are some scopes impossible? | Some are impossible as literally stated (a planet of individually scheduled people, free conversation with everyone, every canon cast fully authored). Each has an achievable version that feels the same from the player's seat. See P9Z30. |
| P9Z3 | Should we set guides to stop over-complexity? | **Yes, and make them triggers, not bans.** A deferral register says what is deferred and what evidence reopens it. Proposed rules CX1–CX8 below. |
| P9Z4 | How open-world can it be? | Openness comes from **verbs × places × systemic rules**, not map size. A small world where many things interact feels more open than a huge world of inert destinations. |
| P9Z5 | Generate or author? | Author the anchors (canon places, signature people, the first slice). Generate the fill (ordinary people, minor sites, ruins, rumors, side routes) through addressed, frozen-on-reveal generators. |

## How other games handle it

| Code | Game | Technique | What we take |
| --- | --- | --- | --- |
| P9Z10 | Dwarf Fortress | World gen runs centuries of coarse history once; only the fortress is simulated in detail. Historical figures exist as records until you meet them. | Coarse history plus one deep locality. History is data you read, not a live simulation. |
| P9Z11 | RimWorld | World map is coarse tiles; only maps with your colonists are simulated. Visitors, raiders and traders are generated on arrival. A storyteller picks events. | Only the active place ticks in detail. People arrive as generated events, not as a standing population. |
| P9Z12 | Mount & Blade | Lords and companions are persistent named records; armies are counts with a few named leaders. | Named few, counted many. A garrison is a number until you fight it. |
| P9Z13 | Crusader Kings | Thousands of characters with no spatial simulation; irrelevant characters are pruned from active processing. | Relevance pruning. A person matters by relationship to the player, not by existing. |
| P9Z14 | Minecraft, No Man's Sky, Elite | Universe from a seed; only player changes are saved. | Seed for the unseen, save the delta. Already GR3/GR4. |
| P9Z15 | Caves of Qud | Hand-authored main spine and named villages; procedural ruins, villages and a generated history of sultans around them. | Authored spine, generated fringe. Fits book worlds: canon is the spine. |
| P9Z16 | Kenshi | Persistent towns and factions; squads spawn near the player. Killing a faction leader flips a world-state flag that changes towns. | Big world changes as a few flags on places, not a simulation of every citizen. |
| P9Z17 | Taiwu | Many NPCs with relationships and monthly coarse ticks; map is a grid of areas, not walkable space. | Coarse time steps for distant people. Closest model to our format. |
| P9Z18 | Warsim, text sims | Huge breadth from tables and text; almost no spatial or per-agent simulation. | Text carries breadth cheaply. The idle/text format is an advantage here. |
| P9Z19 | Breath of the Wild | A small set of chemistry rules (fire, wind, metal, water) applies to everything. | Systemic rules on tags give emergent openness with few pairwise rules. Matches [E4 tags and rules](../../../../emergent/E4_TAGS_AND_RULES.md). |
| P9Z20 | Shadows of Doubt | Simulates every citizen's schedule in one city. | The counterexample: it works by capping at one city with simple routines. Shows what "every NPC" costs. |
| P9Z21 | Oblivion's early Radiant AI | Free-running NPC needs caused NPCs to steal, kill and break quests; it was cut back. | Unbounded autonomy breaks authored promises. Autonomy needs scopes and guards. |
| P9Z22 | Skyrim radiant quests | Templates fill slots (a cave, a person, an item) from the world. | Template plus slot filling turns a few quest shapes into many quests. |

Common thread: **simulate where the player is, summarize where they are not,
generate on look, persist only what the player touched.** Level of detail for
time and people, not only graphics.

## Would we need to implement each NPC?

**P9Z23, proposed people ladder.** Each step is cheaper than the next; a person
climbs only when play needs it.

| Rung | What exists | Cost | Example |
| --- | --- | --- | --- |
| Count | A number on a place or group | Near zero | "About forty miners work here" |
| Address | A generator address; regenerates the same person if looked at | Near zero until seen | `gen:village:person:7f3a` (GR4) |
| Met | Frozen name, role, a few traits, last-seen place | Small save entry | The miner you asked for directions |
| Known | Relationships, memory of interactions, commitments | Moderate | The miner who owes you a favor |
| Authored | Hand-written dialogue, schedule, story role | High, per person | Canon or signature characters |

A person never drops a rung the player has relied on (P9T9). Shared verbs
(talk, trade, hire, fight, teach, ask) work for every rung that has the needed
data; authored people get extra content, not separate systems.

**P9Z24:** NPC deprioritization stays. The ladder is the contract a future NPC
pass would use; ruins and world systems can use the Count and Address rungs now
(an abandoned mine's former miners as history, not live people).

## Impossible or unwise scopes and their achievable versions

**P9Z30:** candid list. "Impossible" means not achievable by this project at
acceptable cost, not forbidden.

| Code | Scope as stated | Why it fails | Achievable version |
| --- | --- | --- | --- |
| P9Z31 | Every person on a planet with daily schedules | Compute, save size (4 MiB guard), and nobody can observe it | Ladder P9Z23; coarse ticks for Known people; counts elsewhere |
| P9Z32 | Free conversation with any NPC | Needs hand-writing or an LLM; consistency and spoiler risk | Shared conversation verbs plus generated topics; authored depth for few |
| P9Z33 | Full canon cast authored for every book world | Hundreds of characters per source | Canon spine people authored as needed; others as Met/Known with source labels |
| P9Z34 | Walkable continuous world | Wrong format for idle/text; huge UI and pathing cost | Place graph with optional local scenes (P9W) |
| P9Z35 | All worlds simulating at once | Multiplies every cost by world count | Inactive worlds pause or catch up at boundaries per accepted clock policy |
| P9Z36 | Full economy and ecology simulation | Balancing and debugging cost grows with every link | Bounded models with declared inputs and outputs (P9L4) |
| P9Z37 | Every cheat × every world × every system tested | Combinatorial | Shared hooks (GCR6) plus representative matrix tests, not exhaustive |
| P9Z38 | Every place deep from day one | Authoring cost with no player use yet | Depth ladder CX1: deepen where play goes |

## Guides: complexity guardrails

**P9Z40, guardrails CX1–CX8, accepted 2026-10-16** (Weibao: "I like these
rules"). Original wording, preserved: "proposed ... none is accepted product
authority until Weibao accepts it." The deferral register entries remain proposals. They limit **when** depth
arrives, not **how much** depth the game may eventually have.

| Code | Guardrail | Test |
| --- | --- | --- |
| CX1 | **Depth on demand.** A place, person or system gains detail only when a player choice uses it. | Can you name the choice the new detail serves? |
| CX2 | **Connect, don't add.** A new system plugs into existing verbs, tags and owners before it adds new ones. | Does it reuse at least one existing verb and one existing consumer? |
| CX3 | **Rules over pairs.** Prefer one rule on tags over many pairwise interactions. | Would adding the tenth content item need new code? |
| CX4 | **Promote, don't pre-simulate.** Unconstrained detail can remain counts or addresses until observed (GR3, GR4). Hidden causes already consumed by an event retain their actor/resource/time/custody bindings; see [GW5](../../../../GENERATION_FOUNDATION_RULES_2026-10-14.md#gw5-causal-commitment-before-observation-2026-10-15). | Does anything tick that the player cannot affect or learn about? |
| CX5 | **Budget declared.** Each generator and simulation states entity, draw and time budgets (GR11). | Is there a number that fails a test when exceeded? |
| CX6 | **Honest coverage.** Background, inspectable and playable are distinct (P9K4). Unfinished content is not disguised as a fictional lock. | Does every travel button resolve to real play? |
| CX7 | **One slice at a time.** Finish a playable slice before widening (AGENTS.md). | Can Weibao play the last slice now? |
| CX8 | **Deferral register.** Every deferred feature records its reopen trigger. | Does each LATER item say what evidence reopens it? |

**P9Z41, proposed deferral register for Part 9.** Seed list; owners keep their
own entries.

| Deferred | Reopen when |
| --- | --- |
| Live NPC schedules and presence | A slice needs "where is this person now" for a real choice, and the Known rung exists |
| Regional aggregate simulation | Two consumers need a region's state (for example trade and a regional event) |
| Atlas / world map view | A disclosed network exceeds the useful neighbourhood list (P9S3) |
| Local scenes with anchors | A place has authored anchors and a choice that uses position |
| Generated spatial sites (rooms, tiles) | The ruin site model (DUNGEON_CONTENT W1) proves its first candidate |
| Multi-stop itineraries, remote work | Travel quote reconciliation (P9F4) is done and a player asks for routing |
| Cross-world simultaneous time | An accepted clock policy change, never by default |

## How to stay as open-world as possible

**P9Z50:** openness the player feels comes from these, most of which are cheap:

1. **Many ways in.** Several travel methods, skills and cheats reach the same place (P9X7). Different means, different costs.
2. **Generic verbs on every place.** Look around, rest, forage, ask around, explore. Every place, even a generated one, answers them. This is where generators connect to play.
3. **Systemic rules.** Tags and rules (E4) let fire, cold, spirit energy or a cheat affect any matching thing without per-item code.
4. **Consequences persist.** A cleared ruin stays cleared, a helped village remembers. Small flags on places (P9Z16), frozen on reveal.
5. **Player-set goals.** Long-range aims the player picks, not a fixed quest line. Idle format helps: the player chooses what runs.

**P9Z51, ACCOUNT FOR NOW:** "explore" and "ask around" are the doors where a
generator adds a new place, rumor or ruin to the player's known network. That
keeps the map growing from play while P9C1 (filter undisclosed before layout)
still holds.

**P9Z52:** openness has a floor of honesty. A generated place offered as
reachable must resolve to real play (CX6). Better a smaller honest world than a
large one of dead ends.

## Generating things

**P9Z60, proposed split:**

| Generate | Author |
| --- | --- |
| Ordinary people (ladder rungs Count to Met) | Canon places and landmarks (constraints, never shuffled; P9L7) |
| Minor sites, ruins, caves, side routes | Signature people and their arcs |
| Rumors, notices, small requests (later, per NPC deprioritization) | The first slice and every showcase |
| Resource variation, weather, local conditions | World rules and world styles (MR world styles are data) |
| Coarse regional history | Sealed secrets and their discovery routes |

**P9Z61, generator contract** (already in GENERATION_FOUNDATION_RULES): addressed
draws (GR2), freeze on reveal (GR3), lazy IDs (GR4), declared budget (GR11),
validity check with a fallback (a generated route must connect; a ruin must be
enterable and leavable), and a version so content edits do not rewrite what the
player saw.

**P9Z62, LATER:** text generation by a language model for flavor or conversation.
Useful for P9Z32, but needs cost, offline play, consistency and spoiler guards.
Not a first-slice dependency.

## Core things and interactions

**P9Z70, proposed kernel.** Everything else should be data, tags or an owner
built on these. Most already exist in some form; the proposal is to treat them
as the stable core and judge new features against them.

| Core thing | Already owned by (approximate) |
| --- | --- |
| Place (with containment) | `src/models/location.js`, location data |
| Route (directional, method, cost) | location connections, travel in `src/main.js` |
| Person (ladder rung) | NPC data; generator addresses |
| Thing / resource | inventory, `src/craft_*` materials |
| Activity (work at a place, site, person or resource) | activity data, craft engine |
| Knowledge record (what the player knows and from where) | disclosure owners |
| Scheduled event (due boundary) | `src/expansion_engine.js` bounded causal loop |

| Core verb | Examples |
| --- | --- |
| Go | travel, enter, leave, return |
| Look | inspect, explore, ask around |
| Talk | ask, learn, persuade |
| Work | gather, mine, craft, study |
| Exchange | trade, give, hire |
| Fight | native combat |
| Rest | recover, wait, let time pass |

**P9Z71, ACCOUNT FOR NOW:** a new world or system should first ask "which core
things and verbs does this add data to?" before "what new screen or system does
this need?" Part 9's map is a **view** over Place, Route, Person and Knowledge;
it should own no gameplay state of its own (consistent with P9I1).

## More angles

| Code | Angle | Disposition |
| --- | --- | --- |
| P9Z80 | **Inspector for generated worlds.** A dev view showing a place's rung, address, frozen facts and budget use makes generation debuggable. Read-only; never mutates a save. | LATER, first consumer is the ruin site candidate |
| P9Z81 | **Idle catch-up is the real scale test.** Hours of offline time across many Known people and sites is where cost appears, not the visible map. | ACCOUNT FOR NOW: P9G3/P9G4 measure catch-up, not only rendering |
| P9Z82 | **Save growth from promotion.** Every Met person and frozen place adds bytes. Needs a size check at late-game counts against the 4 MiB guard. | ACCOUNT FOR NOW in any promotion work |
| P9Z83 | **Authoring tools beat more code.** A small content template per place (P9K5 five questions) lets worlds grow without engineer time. | LATER |
| P9Z84 | **Per-world adjectives set density.** A crowded city world and a lonely wasteland can use the same ladder with different default rungs and counts. | ACCOUNT FOR NOW, matches world styles as data |
| P9Z85 | **Complexity welcome, cost managed.** Per the 2026-10-16 complexity entry, these guardrails pace depth; they are not a simplicity ceiling. | ACCOUNT FOR NOW |

## Dispositions

- **ACT NOW:** none. Planning only.
- **ACCOUNT FOR NOW:** people ladder P9Z23 as the vocabulary for any people
  work; CX1–CX8 as accepted pacing under the core rules; map as a view with no own state (P9Z71);
  explore/ask-around as generator doors (P9Z51); catch-up and save-growth
  measurement (P9Z81, P9Z82).
- **LATER:** deferral register items (P9Z41), generated-world inspector,
  LLM text, authoring templates.

Current-status reconciliation, 2026-10-26: the earlier disposition said
"CX1–CX8 as proposed pacing". That wording is history; CX was accepted on
October 16 and confirmed conditional on the core rules on October 19
([authority](../../../../USER_VISION.md#proposal-rulebooks-accepted-2026-10-18)).
The people ladder, deferral entries and other P9Z proposals retain their status.

## Questions for Weibao

None required. CX1–CX8 were accepted 2026-10-16; see P9Z40.

## Whole canon, gameplay areas and saves under CX1–CX8, 2026-10-16

Weibao, after accepting the rules:

> I like these rules, but how do we implement entire cannon with these rules in
> consideration? How to implement gameplay areas and content accordingly? Save
> accordingly?

Planning only. This maps the rules onto the existing
[World Core Kit](../../../../worlds/WORLD_CORE_KIT_2026-10-14.md) (K1–K18, K33–K34,
tiers T1–T5) and [lore/continuity](../../../../worlds/LORE_AND_CONTINUITY.md)
owners rather than writing a competing spec. Codes **P9Y**.

### What the current code shows

| Code | Evidence | Consequence |
| --- | --- | --- |
| P9Y1 | Mother of Learning is a bespoke six-file module (`src/book_world_mol_{ids,content,state,host,native,actions}.js`). `validateMolCampaignState` in `book_world_mol_state.js` asserts an exact field list, `state.schema===11`, and a full actor, body, vitals and purse for each of nine residents. | Works for one hub and nine people. Copying this per world and per area means every new place or person needs new code and a validator edit. That is the "implement each NPC" trap in code form. |
| P9Y2 | Shared layers already exist: `world_instances.js` (definition, instance, visit, clock), `realm_connections.js`, `content_packs.js` (pack registry, `packSaveState`), `save_compatibility.js` (retired content kept), `world_visit_history.js` (visit cap 128, compaction). | Canon at scale should grow as **data on these shared owners**, with a per-world module only for that world's signature rules (K2, K13). |
| P9Y3 | The kit already plans pack revisions (K33), dormant missing packs (IS8), one writer per world pack (II24) and calendars as pack content (KX81). | The save side has a direction; it has not been built as a generic world pack yet. |

### "Entire canon" means three different amounts of work

**P9Y10, proposed:** separate *knowing* the whole canon from *playing* all of it.

| Layer | What it holds | Cost | Rule |
| --- | --- | --- | --- |
| Catalog | K1 whole-source census as data: every place (with containment), named person, institution, item, power and event, with source locator, era and canon weight. Coverage = background. People at Count/Address rung. | Research and data entry, no gameplay code | Can cover the **entire** canon early. Cheap, and it lets the game honestly name anything. |
| Inspectable | Catalog entries the player can learn about: books, rumors, maps, appraisal. Text and knowledge records only. | Small per entry | Reached through K11 knowledge routes. No travel button yet (CX6). |
| Playable | Areas with verbs, activities, people at Met+ and real consequences. | The expensive part | Grows outward from the entry area as play goes (CX1, CX7). |

So the whole canon *exists* from the start as a catalog. Playable coverage
spreads like rings from where the player enters. That is how Caves of Qud and
Crusader Kings-style games feel huge while only a slice is deep.

**P9Y11, canon events:** the K12 event graph lives in the catalog with era
dates. An event becomes a scheduled due boundary (P9L6) only when it touches a
playable area or a Known person. Others arrive as news through knowledge
routes. Divergence is stored as **changed anchors**, never a copy of the whole
timeline (LORE_AND_CONTINUITY continuity promises).

**P9Y12, canon people:** canon fixes their name and identity, so they are not
"generated". They still use the ladder: a catalog record until met, then Met,
Known, Authored as play needs. Spine characters (K6 floor: 2–3 at T3, one T5)
are authored. Gaps between canon people (shopkeepers, students, miners) are
generated from the area's slots and labelled original.

### Gameplay areas: one area kit

**P9Y20, proposed area record.** An area is data on shared owners, not a module:

| Field | Source | Notes |
| --- | --- | --- |
| Place, containment, routes | Catalog + K5 | Directional routes with method and cost |
| Generic verbs answered | Default set (look, rest, ask around, explore) | Every area answers these, even a thin one (P9Z50) |
| Activities and services | K8, K9 | Reuse native activity, craft and trade owners |
| People slots | K6 | Named canon people plus generated slots by role and count |
| Encounters and hazards | K10 | Native combat contracts |
| Discoveries | K11, ruin site model | Sealed by ID |
| Storylet and template hooks | K12, P9Z22 | Template quests fill slots from the area |
| Optional: anchors, scene, art, lens rules | P9W8 | Only when a choice uses position |
| Coverage level and revision | P9K4, K33 | Background, inspectable or playable |

**P9Y21, area done check** (proposed, uses K18): a player can reach it, do at
least one useful thing, meet at least one person at Met+, leave and return with
consequences kept, and save, reload and import without loss. Everything else is
depth for later.

**P9Y22, content pipeline:** source deep dive → catalog data → P9K5 five-question
brief per area → area data → shared engine. Lints and a coverage printout (K34)
check that every playable area passes P9Y21 and every travel button resolves.

**P9Y23, order inside a world:** K2, K3, K6, K8, K13 at floor make it feel like
that world (kit rule of thumb). Build the entry area to that floor, then add
neighbour areas where the player's goals point.

### Saves: store the delta, not the world

**P9Y30, proposed save rules.**

1. **Content is not save.** Catalog, area definitions and templates ship with the game, versioned per world pack (K33). The save pins the pack revision.
2. **Save only what play changed or revealed:** frozen facts (GR3), promoted people at Met+, changed world facts and anchors, commitments, inventory and custody, player knowledge, instance and visit records.
3. **Stable namespaced IDs** (`book.mol.*`), never indexes (IS1). An ID never changes even when text does.
4. **Per-world sub-state with its own schema and migration chain**, validated from the pack definition. Avoid a whole-save exact-schema assert per world (P9Y1), which forces every world to change when the root schema changes.
5. **Missing or removed content** loads dormant with a plain message (IS8), with values kept in `retired_content` style storage until a migration decides.
6. **Seen beats revised.** If a content revision changes something the player already saw, the frozen value wins unless a migration decides otherwise; unseen things take the new revision.
7. **Bounded history.** Disposable logs and old visits compact (visit cap exists); history that gameplay reads is kept.
8. **Size budget per world**, tested at late-game counts against the 4 MiB guard (P9Z82, IS10). A rough estimate, not a measurement: a Met person at a few hundred bytes and a Known person at about a kilobyte means a thousand Known people across worlds is around 1 MB. Count and Address people cost nothing.

**P9Y31, LATER:** if measured saves approach the guard, consider compressing the
payload or moving to IndexedDB. Measure first; no backend is selected.

### Dispositions

- **ACCOUNT FOR NOW:** catalog/inspectable/playable split (P9Y10); canon people
  on the ladder (P9Y12); area record and done check as the vocabulary for the
  next book-world area (P9Y20, P9Y21); save rules 1–8 for any new world state.
- **LATER / DELEGATE:** a generic world-pack loader and per-world schema chain
  that MoL could migrate onto (P9Y1, P9Y2). That is a real engineering slice
  with save migration and needs its own authorization, gate and owner check
  with the live save/foundation owners (II26).

No new questions for Weibao.

## Full detail, every student, engine limits, pack loader rules and procedural links, 2026-10-16

Weibao:

> HOw to implement with full considerations and little details and everything?
> All the students? relevant characters and more? We can rescope external rules
> like the size budget by converting into real game engine and more? more to
> consider? Rules for World pack loader and more? Connecting with the procedural
> stuff?

Planning only; everything below is a proposal. Codes **P9Q**. Accepted CX1–CX8
still apply: full detail is the destination, reached through data and shared
behavior rather than per-person code.

### P9Q1: full detail without writing each person

**Principle: detail is data, behavior is shared, presence is derived.** A
person's facts live in records; what they do comes from shared verbs and their
group's routine; where they are is computed when someone asks, not ticked.

**P9Q2, a whole student body as layers:**

| Layer | Holds | Stored where | Example (school) |
| --- | --- | --- | --- |
| Institution | Houses or classes, years, rules, timetable, calendar, staff roles | Pack data | Houses, year groups, term dates, lesson blocks |
| Cohort | Year × house (or class): count, timetable, trait spread, standing, cohort events | Pack data; small delta in save when changed | "Third-year, house A: about forty, Tuesday double lesson" |
| Named canon student | Canon facts with source locator: name, entry year, house, relationships, canon events, canon weight | Pack catalog | Every named student the source census (K1) finds |
| Generated student | Address in a cohort slot; name, look, habits and micro details from generators | Nothing until met (GR4); frozen on reveal (GR3) | The classmate you sit next to |
| Relevant to the player | Ladder rung Met, Known or Authored | Save delta | Friend, rival, study partner |

All students exist from the start as cohorts plus named records. Only the ones
you meet cost save space. Canon numbers that sources leave unclear (a school's
size, for example) are recorded as disagreements in K1 and given a labelled game
value.

**P9Q3, presence by query:** where a student is = cohort timetable at this time,
then personal exceptions (club, detention, illness, a canon event, a quest
override), then known disruptions. Computed when the player looks or a system
asks; no student ticks. Hogwarts Legacy's schedules restore routine when a
quest override ends ([T24](../../../../research/hogwarts-legacy/SMALL_TOUCHES.md)); here the override is just
an exception record with an end time.

**P9Q4, relationships as a sparse graph:** store only edges canon states or play
created. Others are derived on demand from shared cohort, house, club or family
(same year and house means "acquainted" by default). A derived edge freezes once
the player relies on it.

**P9Q5, little details:** the kit's micro rows (T1 named texture) come from
templates keyed by role, house, year, culture and tags (IS6 keys and templates).
Derived detail is free to save; only revealed or changed detail is stored.
Tag rules (E4) give reactions, so a hundred details do not need a hundred
handlers.

**P9Q6, aging and eras:** store entry year, not year group. Year group,
graduation and staff turnover follow from the date and era. A graduated
student you know becomes an adult in the same world with the same ID.

**P9Q7, depth by canon weight and relevance:** canon weight W0–W3 (K1) and
player relevance decide which people get authored content. Everyone gets shared
verbs; spine characters get authored arcs; the rest climb the ladder through play.

### P9Q10: the size limit is a browser rule, and can be rescoped

**Finding.** `SAVE_STORAGE_BUDGET = 4 * 1024 * 1024` in `src/save_files.js` is a
conservative guard for the browser's **localStorage** quota, measured in UTF-16
(two bytes per character, so about two million characters of JSON). Saves are
written to `localStorage` from `src/main.js`. The cap comes from where the save
is kept, not from game design, so it can be lifted without changing engines.

**P9Q11, ranked options (proposal):**

| Code | Option | Lifts | Cost | View |
| --- | --- | --- | --- | --- |
| P9Q11a | Move saves to IndexedDB or the Origin Private File System | Byte cap (browser quotas are typically a share of disk; varies by browser) | Async save path, migration from localStorage, export/import unchanged | **Recommended first** |
| P9Q11b | Compress the save (gzip via the browser's CompressionStream) | Several-fold smaller saves and exports | Small; needs a format marker | Pair with 11a |
| P9Q11c | Chunked saves: one record per world pack plus core, write only changed chunks | Save time and crash blast radius | Moderate; per-pack schema (P9Y30) makes it natural | After 11a |
| P9Q11d | Desktop shell (Tauri or Electron) keeping the same JS | File saves, no browser quota, Steam later | Packaging and update path | Later, when distribution matters |
| P9Q11e | Port to Godot, Unity or similar | Native performance | Rewrite of a large existing codebase; does not reduce design or authoring complexity | Not recommended now |

**P9Q12, what stays limited after storage is lifted:** these become the real
CX5 budgets, measured in time rather than bytes.

- **Catch-up compute:** hours of idle time across many active processes.
- **Save and load time:** whole-state `JSON.stringify`, `structuredClone` and full validators run on the main thread (for example `structuredClone(original)` in `save_compatibility.js`). A big save freezes the page.
- **Memory:** every pack's catalog loaded at once.
- **Export size:** a save the player downloads or imports.
- **Authoring cost:** people still have to write the canon spine.

Proposed engine budgets to replace the byte budget once measured: milliseconds
per save, per load and per catch-up hour on a named laptop, plus peak memory.
A Web Worker for catch-up and validation is a later option if the main thread
stutters.

**P9Q13:** any storage move changes persistence, so it needs a migration and a
compatibility decision (AGENTS.md safety), and its own authorization.

### P9Q20: world pack loader rules (proposed WP1–WP15)

| Code | Rule |
| --- | --- |
| WP1 | **Manifest.** Pack id, revision, source snapshot hash, engine features required, dependencies, coverage map. |
| WP2 | **Contents are data.** Catalog, laws (K2), power core, areas (P9Y20), canon people, institutions and cohorts, calendar (KX81), event graph, generator slots with budgets, sealed secrets by ID, presentation. |
| WP3 | **Signature rules as registered hooks.** A world's unique loop (K13) is a small module registered through engine hooks, not a fork of core state. |
| WP4 | **Validate at load.** Schema, reference integrity (every route endpoint, slot generator and travel target exists), honest coverage (every travel button reaches playable content), declared budgets, sealed-secret lint on compiled text (IS7). |
| WP5 | **Fail dormant.** A pack that fails validation or is missing loads dormant with a plain message; the rest of the game runs (IS8). |
| WP6 | **Namespaced permanent IDs.** `book.<pack>.*`; never reused after retirement (IS1). |
| WP7 | **Own namespace only.** A pack writes its own sub-state and touches shared owners (inventory, actors, knowledge, craft) only through their APIs. Cross-world contact goes through realm connections. |
| WP8 | **Per-pack save section.** `{packId, packRevision, schema, delta}` with a validator derived from the definition and a migration chain per pack. |
| WP9 | **Seen beats revised.** Revealed values stay; unseen content takes the new revision; removed content is retired, not deleted. |
| WP10 | **Scoped seeds.** Every pack draw uses `hash(root, pack, instance, scope, slot)` (GR2), so adding content to one pack never reshuffles another. |
| WP11 | **Lazy loading.** Inactive worlds keep only what an active system needs; full catalogs load on entry. |
| WP12 | **Feature gating.** A pack part needing an engine feature that is absent stays dormant instead of half-working. |
| WP13 | **One writer per pack** (II24). |
| WP14 | **Tools.** Coverage printout, lints and a read-only inspector (K34, P9Z80). |
| WP15 | **Load budget test.** A synthetic large pack and many-world save prove the P9Q12 time budgets (IS10). |

### P9Q30: connecting to the procedural systems

**P9Q31, one loader for canon and generated worlds.** A generated original
world ([WORLD_SEEDS W1–W4](../../procgen-2026-10-13/p11/WORLD_SEEDS.md)) can be a
pack the generator writes at admission, stored as a resolved profile plus
receipts (W2). A canon pack is authored. Both use the same format, loader,
validation and save section. This is the main unification.

**P9Q32, canon as generator constraints.** Generators fill pack slots (cohort
students, minor sites, ruins, side routes) and take canon facts as fixed inputs.
Canon landmarks and people are never shuffled (P9L7).

**P9Q33, the crafting engine already fits.** `src/craft_sources.js` scopes
variation by `{root, world, location}` (`localVariants`, `nodeKey`), and
`src/craft_state.js` freezes materials and recipes and records observer
knowledge. A pack supplies the material catalogue, source tables bound to
location tags, and recipe laws (MR world styles as data). No new crafting seam is
needed.

**P9Q34, ruins and sites from history.** The ruin site model
([DUNGEON_CONTENT W1, W3](../../procgen-2026-10-13/p11/DUNGEON_CONTENT.md#ruins-and-world-first-consideration-2026-10-16))
can take era and event inputs from the pack catalog: an abandoned mine exists
because a canon or generated event closed it.

**P9Q35, people and stories.** Cohort slots use the same person generator as
everywhere else (GR13). Template quests (P9Z22) fill their slots from the pack's
areas, cohorts and catalog.

**P9Q36, a rule tension resolved.** GR3 regenerates unseen detail from its
address; WORLD_SEEDS W2 stores resolved world profiles. They agree under one
rule: **store what is consequential or relied on, regenerate only cheap,
unseen detail.** A world's laws and profile are consequential at admission; a
background student's habits are not until seen.

### P9Q40: more to consider

| Code | Angle | Disposition |
| --- | --- | --- |
| P9Q41 | Catalogs come from source deep dives. Catalog entries are paraphrased facts with locators, never raw prose (AGENTS.md). A converter from deep-dive output to catalog data saves authoring time. | LATER |
| P9Q42 | Hidden truth vs knowledge applies to rosters too: a student list the player sees is what they learned, not the cohort record (IS9). | ACCOUNT FOR NOW |
| P9Q43 | Query-time presence must be deterministic for a given time so two panels never disagree about where someone is. | ACCOUNT FOR NOW |
| P9Q44 | Timetable exceptions from canon events need priorities (canon event over club over routine) and an end time. | ACCOUNT FOR NOW |
| P9Q45 | A synthetic test school (hundreds of students, thousands of days) is the cheapest proof of P9Q2–P9Q4 before any canon pack uses it. | LATER, first proof slice |
| P9Q46 | Debug view: pick any student, see layer, rung, derived schedule and frozen facts. Read-only. | LATER |

### Dispositions

- **ACCOUNT FOR NOW:** layered student bodies with derived presence (P9Q2–P9Q7);
  detail derived until revealed; one loader for canon and generated packs
  (P9Q31); "store what is relied on" (P9Q36); time budgets replace byte budgets
  once storage moves (P9Q12).
- **LATER, needs authorization:** storage move to IndexedDB plus compression
  (P9Q11a–b), chunked saves, desktop shell; the loader itself with WP1–WP15;
  the synthetic school proof (P9Q45). An engine port is not recommended.

No questions for Weibao.

## World pack loader dispatch considerations, 2026-10-16

Weibao:

> Send out the world pack loader but consider aspects like subtle details and
> world gen? procedural systems? Following different rule books like rulebooks
> and other stuff and more? more to consider?

Authorization: dispatch the world pack loader. Storage move (P9Q11) is not part
of this dispatch. Codes **P9P**. The lane brief links here.

### P9P1: existing seams the loader must build on (inspected 2026-10-16)

| Code | Seam | Consequence |
| --- | --- | --- |
| P9P1a | `src/content_packs.js` (pack registry, `packSaveState`) and `src/structured_pack_{definitions,runtime,state,ui}.js` (families: worlds, actions, sources, rollTables, techniques, people, sites, events, encounters, energies and more) | **Two pack systems already exist.** The loader extends or wraps them; it must not become a third. The lane decides which is the base and records why. |
| P9P1b | `src/world_instances.js`, `src/realm_connections.js`, `src/world_visit_history.js` | Instance, visit, clock and passage owners. Packs declare; these execute. |
| P9P1c | `src/rule_modules.js` (layered rule modules, kinds incl. `world_law`, `cheat_overlay`; `createRuleLock` fingerprints a pack) | Rulebook selection per world goes through rule modules and their lock, not loader-specific logic. |
| P9P1d | `src/gen_kit.js` (addressed draws, weighted picks, fallback) and `src/tag_store.js` | World gen and slot filling use these (GR2). |
| P9P1e | `src/craft_*` (material catalogues, source tables by `{root, world, location}`, recipe laws, freeze/observe) | A pack supplies craft data; no new crafting seam. |
| P9P1f | Branches `codex/rbe-r1-resolver` (check resolver, odds, receipts) and `codex/rbe-r2-effect-dsl` are complete but **not merged** and await semantic review | The loader references rule profiles by ID and treats a missing resolver as a dormant feature (WP12). It must not merge or depend on unmerged code. |
| P9P1g | `src/book_world_mol_*.js` bespoke module; `src/save_files.js` localStorage saves; Foundation owners of `main.js`, saves, tests and `dist/` (II26) | First slice is additive: new files and tests only. MoL migration and runtime wiring are a later, owner-checked step. |

### P9P2: subtle details the loader must get right

| Code | Detail |
| --- | --- |
| P9P2a | **Load order and dependency cycles.** Packs can depend on engine features, other packs (a D&D multiverse pack under a D&D world pack) and rule modules. Detect cycles; load in a stable order sorted by ID (IS2). |
| P9P2b | **Revision pinning vs live content.** The save pins `packRevision`; a newer pack runs its migration chain; an older pack than the save refuses with a plain message, never a silent downgrade. |
| P9P2c | **Hash of what matters.** Pack fingerprint covers rules and generator definitions, not display text, so a typo fix does not trigger migrations. Text changes keep IDs (IS1). |
| P9P2d | **Partial validity.** One bad area makes that area dormant, not the whole pack, when the rest is self-consistent (WP5, WP12). Report which. |
| P9P2e | **Hidden truth.** Validation errors and the inspector are author-only; player text never names a sealed secret or an undisclosed place (IS7, IS9). |
| P9P2f | **Same name, different instance.** Two packs or two instances of one pack never share people, debts or discoveries by name (P9W2). |
| P9P2g | **Retired content.** IDs used by a save but removed from a pack go to retired storage, not deletion. |
| P9P2h | **Determinism.** Loading the same packs in any file order gives identical registries and draws. |
| P9P2i | **Attribution travels with data** (MC5-3): each record keeps source, licence tier and revision; the loader can emit a pack notice. |
| P9P2j | **Budgets declared and checked** per generator and per pack (GR11, CX5), with a synthetic large-pack test (WP15). |

### P9P3: world generation through packs

- **P9P3a:** a generated world is a pack produced at admission ([WORLD_SEEDS W1–W4](../../procgen-2026-10-13/p11/WORLD_SEEDS.md)): profile, laws, calendar, resource families, institutions and site slots resolved and stored with receipts (W2). Same loader, same validation, same save section as a canon pack (P9Q31).
- **P9P3b:** generation validity is checked before the world is admitted: every law has a resolver, every institution has a reachable teacher or means, routes connect, there is an ordinary livelihood (W4). Failure retries with a fallback, never admits a broken world.
- **P9P3c:** generated packs are versioned by generator version; a generator update never rewrites an admitted world (W2, GR3).
- **P9P3d:** hybrid packs: a canon pack can declare generated regions (fringe) around authored spine areas (P9Z15), with canon facts as fixed generator inputs (P9Q32).

### P9P4: procedural systems as pack slots

A pack declares **slots**; generators fill them through `gen_kit` with scoped
addresses `hash(root, pack, instance, scope, slot)`:

| Slot kind | Filled by | Frozen when |
| --- | --- | --- |
| Cohort and population members | person generator (GR13) | Met (P9Z23) |
| Minor sites, ruins, caves | site/ruin model (DUNGEON_CONTENT W1) | Discovered |
| Material variants and sources | craft engine | Harvested or appraised |
| Recipes per world style | `craft_recipes.generateRecipe` with world law | Learned |
| Rumors, notices, template quests | storylet deck / templates (P9Z22) | Delivered |
| Micro details | text templates (IS6) | Shown |

### P9P5: following different rulebooks

- **P9P5a:** a pack names its **rule profile**: resolver family, growth unit, scale class, director policy (EP1–EP7 in [the rulebooks doc](../../../../RULEBOOKS_FOR_WORLDS_AND_GM_CONSIDERATIONS_2026-10-14.md#engine-primitives-rulebooks-need-ep)). The loader resolves these through `rule_modules` and the rule lock; it does not implement checks itself.
- **P9P5b:** a world without a declared profile keeps its current behavior (EC5).
- **P9P5c:** a multiverse rulebook (one rulebook over many worlds) is a parent pack whose rule modules sit at a lower layer; child world packs override at the world layer (MV, rule module layers core → world → region → actor → director).
- **P9P5d:** cross-world contact uses declared cross-profile rules (scale class, carry tables, K15); the loader rejects a pack pair that claims a crossing with no rule.
- **P9P5e:** licensed rulebook content (SRD, ORC) carries licence tier per record; private paid-book research never ships in a pack (MC5-6).
- **P9P5f:** rulebook data needs a ruling status per record: supported, needs ruling, unsupported (MC5-1). Unsupported records load dormant.

### P9P6: more to consider

| Code | Angle | Disposition |
| --- | --- | --- |
| P9P6a | **Engine-first trap** (EC9, CX7). A loader with no playable consumer is not done. The first slice proves itself on a synthetic test school pack in tests, then names the smallest playable wiring. | ACCOUNT FOR NOW |
| P9P6b | Author ergonomics: packs as plain JS/JSON modules bundled by the existing `build.js`; no runtime fetch requirement for core packs. | ACCOUNT FOR NOW |
| P9P6c | A pack diff tool (what changed between revisions, which saves are affected) helps migrations (K33). | LATER |
| P9P6d | Mods or user packs later: the same loader, with stricter validation and no access to sealed-secret tooling. | LATER |
| P9P6e | Lazy load of inactive packs affects memory, not correctness; keep it behind one interface so the storage move (P9Q11) can change it. | ACCOUNT FOR NOW |
| P9P6f | Merging R1/R2 is a separate review decision; the loader stays compatible either way. | LATER, separate |

### Dispatch

Lane brief and done check are in the dispatched session's first message. Owned
paths: new `src/world_pack*.js`, new `tests/world_pack*.test.js`, and the lane
folder `docs/gm/dispatch/world-pack-loader-2026-10-16/` on its own worktree branch.
Read-only: everything else.

## World types, world rules and universe/multiverse rule sets, 2026-10-16

Weibao:

> what about type of world and more? different rule of world? Different rule of
> set of uni or multiverse, more to consider/

Planning only; proposals. Codes **P9M**. Owners stay where they are:
[MULTIVERSE_STRUCTURES](../../../../worlds/MULTIVERSE_STRUCTURES.md) (cosmologies,
authoring records, OD5 accepted connection direction),
[rulebooks MV1–MV20](../../../../RULEBOOKS_FOR_WORLDS_AND_GM_CONSIDERATIONS_2026-10-14.md#what-a-rulebook-for-a-multiverse-actually-means-mv),
[CHEAT_COSMOLOGY](../../../../CHEAT_COSMOLOGY.md) (verse equalization),
[E8F adjectives](../../../../emergent/E8F_ADJECTIVES.md),
[RULES_FROM_SCRATCH](../../../../RULES_FROM_SCRATCH.md). This section says how
the world pack loader carries them.

### P9M1: "world type" is several axes, not one label

A single type enum ("cultivation world", "sci-fi world") hard-codes too much.
A pack instead declares independent axes. A type name is only a **preset** that
fills defaults the pack can override.

| Code | Axis | Examples | Existing owner |
| --- | --- | --- | --- |
| P9M1a | Cosmology structure | shared universe, independent universe, branch, pocket, layered, cycle, constructed, converged | MULTIVERSE_STRUCTURES |
| P9M1b | Law profile (what powers and things do) | magic costs, spirit energy, tech level, what is impossible | K2, MV3 |
| P9M1c | Resolution profile (how checks resolve) | d20, bell curve, percent, diceless | MV1, R1 branch |
| P9M1d | Progression profile (how you grow) | levels, learn by use, seasons, realms, careers | MV2, EP3 |
| P9M1e | Scale class | mortal, heroic, mega, divine, conceptual | MV6, EP5 |
| P9M1f | Time model | clock ratio to other worlds, calendar, frozen when absent, cycles | world_instances clock, KX81 |
| P9M1g | Life and death rules | permanent death, respawn, reincarnation, ghosts, revival costs | defeat/continuity owners |
| P9M1h | Knowledge and metaphysics | are souls, fate, prophecy, gods real here; is the world fiction or simulation | LORE_AND_CONTINUITY, K11 |
| P9M1i | Canon course | fixed, resists change, freely divergent | continuity promises, K12 |
| P9M1j | Persistence policy | durable, reset trial, cycle, branch on revisit | PersistenceDefinition |
| P9M1k | Genre and tone adjectives | grim, cozy, horror, comedic, harsh | E8F adjectives, K14 |
| P9M1l | Society and economy defaults | money or none, law, institutions, population density | K7, K8, OD11 |
| P9M1m | Body and being | human-majority, nonhuman-majority, bodiless | NONHUMAN docs |

Two worlds can share a type name and differ on any axis. A canon world takes
axes from its source census; a generated world draws them (WORLD_SEEDS W1),
with an incompatibility check before admission.

### P9M2: rule sets stack from multiverse down to the actor

**Proposed layer ladder:**

`engine core → multiverse rulebook → cluster → universe → world → region/zone → institution → actor → cheat overlay → director`

- **P9M2a, gap:** `src/rule_modules.js` layers are `core, world, region, actor, director`. There is no multiverse, cluster or universe layer. A rule a whole multiverse shares currently has to be copied into every world or put in core. **Proposal:** add those layers above `world`, through the rule-module owner, with a migration for existing module priorities. Not done by the loader lane, which treats rule_modules as read-only.
- **P9M2b:** a parent pack (multiverse rulebook) supplies defaults; child packs override at their layer. Deeper and more specific wins (existing priority rank), with an explicit `locked` flag for multiverse laws a world may not override (for example "souls are conserved across this cluster").
- **P9M2c:** a world can belong to more than one structure (an independent universe that contains a pocket realm and a spirit layer). Membership is a list of parent references with declared law scopes, never one parent pointer.
- **P9M2d:** a converged world can hold two law profiles in zones (Torg-style). Zone is the region layer with its own profile; the boundary is a place on the map.

### P9M3: whose rules apply when worlds meet

Per cluster or per connection, declare one authority model (MV5):

| Model | Rule | Fits |
| --- | --- | --- |
| Place rules | Local reality wins; imports work only as the host allows | Torg-like, harsh worlds |
| Traveler rules | You translate into the local form (function record, MV7) | Most book crossings |
| Raw | Everything works as itself | Rifts-like chaos clusters |
| Equalized | A declared conversion between systems | Verse equalization (CHEAT_COSMOLOGY) |
| Dominant | One law wins by a declared cause | Converged worlds with a winner |

The loader rejects a crossing between packs that declares no model (P9P5d).
Cheats can carry their own model for the cheat holder only (MV9). Titles and
achievements follow their owner's split of recognition, entitlement, active
power and local authority (C6).

### P9M4: which world rules are data, which need engine hooks

| Kind of rule | Examples | Status |
| --- | --- | --- |
| Data only | Magic costs, prices, adjectives, calendars, resource tables, which jobs exist, tech limits | Pack data on existing owners |
| Existing hook | Resolver profile, rule-module parameters/gates, clock ratio, connection rules, knowledge gating | Pack references by ID |
| Needs a new hook | Different death model, time ratio across worlds during catch-up, diceless worlds, fate/prophecy enforcement, non-human bodies | One hook each, landed with one real consumer (EC9) |
| Out of scope now | Free-form reality rewriting, arbitrary nesting depth, worlds that change engine-level physics per tick | Coverage says unsupported; disclose before commitment (P9L8) |

Non-Euclidean space, impossible geography and pocket realms larger inside cost
nothing extra: the place graph never assumed geometry (P9W3).

### P9M5: subtle details

| Code | Detail |
| --- | --- |
| P9M5a | **Rules are discoverable** (MV11). The engine knows the profile; the player learns "luck runs wild here" or "this is a multiverse" through play. The world rules panel shows only what is learned (MV20). |
| P9M5b | **Freeze profile per instance** (MV12). A visited world stores `profile id@rev`; changing its rules is a migration. A rulebook update never silently changes a world the player lives in. |
| P9M5c | **Time across worlds.** Absent worlds follow their declared policy (freeze, run at ratio, catch up at return). Two worlds with different ratios must agree on causal order for shared people and mail. |
| P9M5d | **Same person, different rules.** A companion from another world keeps their home profile (MV13); the host decides only what the host's law decides. |
| P9M5e | **Scale contact.** Cross-scale effects use a declared rule, never raw subtraction (MV6). |
| P9M5f | **Conservation across worlds.** Goods, money and people cannot duplicate through a connection, reset or branch. Value conversion follows OD11. |
| P9M5g | **A multiverse rulebook is not a power rank.** Belonging to a bigger cluster grants nothing by itself (MULTIVERSE_STRUCTURES). |
| P9M5h | **Generated multiverses.** A generator can produce a cluster (several generated worlds plus connections) with a cluster budget. Each world still passes W4 validity. |
| P9M5i | **Genre is not law.** A horror adjective changes tone and events; it does not make enemies unbeatable unless a law says so. |
| P9M5j | **Conformance tests per profile** (MV17): one scenario through each profile; cross-world act matrix per authority model. |

### Dispositions

- **ACCOUNT FOR NOW:** pack manifest carries the P9M1 axes and parent memberships;
  type names are presets; authority model per crossing; profile frozen per instance.
- **LATER / needs owner:** multiverse, cluster and universe layers in
  `rule_modules.js` (P9M2a); new hooks in P9M4 each with a consumer; generated
  clusters (P9M5h).

Loader lane addendum sent 2026-10-16: manifest fields for P9M1 axes, parent
memberships and authority models, validated in fixtures; the rule-layer gap
recorded as a proposal for the rule-module owner.

## Series, multiverses and how subtleties are handled, 2026-10-16

Weibao:

> Would a multiverse be considered a book world? maybe multiple book worlds of
> the same series? more to consider? Ad the subtle details and more, but then
> we will need to consider the subtltiies of how everything works and more?

Planning only; proposals. Codes **P9S**. Builds on MULTIVERSE_STRUCTURES'
"three independent decisions", [LORE_AND_CONTINUITY](../../../../worlds/LORE_AND_CONTINUITY.md)
source snapshots and continuity promises, the
[comic worlds answer](../../../../worlds/COMIC_WORLDS_STARTS_AND_BRANCHES_2026-10-14.md#answer-and-evidence-boundary),
and [TIMELINES_AND_DIVERGENCE](../../../../TIMELINES_AND_DIVERGENCE.md#do-we-calculate-every-detail-no).

### P9S1: a book world is a source, a multiverse is a structure

"Book world" says **where the content comes from**. "Multiverse" says **how
places and histories relate**. They are separate axes, so a source can produce
one world, several worlds, or a whole multiverse. The pack tree follows the
source:

| Code | Source shape | Example shape (generic, not a canon claim) | Pack structure |
| --- | --- | --- | --- |
| P9S1a | One world, many books or eras | A seven-book school series | One world pack; books and eras are start snapshots and timeline anchors, not separate worlds |
| P9S1b | One world with layers | A city with a hidden spirit or dream layer | One world pack with layered realms (P9M2c) |
| P9S1c | One series, several continuities | Reboots, a later part set in a new universe, anime vs manga | **Series pack** (shared catalog, glossary, base laws) with a child pack per continuity |
| P9S1d | Series with an in-canon multiverse | Comics multiverses, parallel-world franchises | Series pack acts as a **cluster** with its own multiverse rulebook layer; each canon world a child |
| P9S1e | Shared author cosmology across series | One cosmology spanning several planets and series | **Cosmology pack** above several series packs; underlying law locked, planet laws override |
| P9S1f | Prequels, sequels, spin-offs | Same world, other era or cast | Eras or branches of the same world pack, unless the source says new universe |
| P9S1g | Adaptations disagree | Book vs film vs game | One canonical edition per continuity pack; other editions recorded as diffs (source snapshots) |
| P9S1h | Fan AUs and fanfic premises | "What if X joined Y" | Overlay pack on a continuity (K17), labelled as overlay |
| P9S1i | Official crossovers | Two series meeting | Explicit connection between series packs with an authority model (P9M3) |

**P9S2, the game's own frame.** The player's multiverse that links book worlds
together is the game's own **frame cosmology** (hub, connections, cheat
cosmology). A series multiverse sits *inside* the frame as a cluster. Default
proposal: the series' own rules govern inside its cluster, and frame rules
govern crossing in and out. A series that already has canon travel between its
worlds keeps that as a canon connection, separate from the frame's connections.

### P9S3: subtle details for series and multiverse packs

| Code | Detail |
| --- | --- |
| P9S3a | **Counterparts are different people.** The same character in two continuities gets two IDs linked by `counterpartOf`. Knowledge, debts and relationships never transfer by name (INV1). |
| P9S3b | **One census per series.** The series pack holds the shared catalog once; continuity packs reference and override. Avoid copying a character into every child. |
| P9S3c | **Spoilers by era and continuity.** Facts from later books are sealed relative to the start era. Reader foreknowledge is a cheat type (CRSIM), not free knowledge. |
| P9S3d | **Retcons.** When a source contradicts itself, each continuity pack picks one version and records the other as a disagreement (K1). |
| P9S3e | **Shared power, local variants.** One underlying law can show up differently per part or planet: lock the law at the series or cosmology layer, override the expression per child. |
| P9S3f | **Cluster-level state.** Events that span a series multiverse (a cross-world crisis) live in a cluster save section, not inside one world. |
| P9S3g | **Partial coverage.** A series pack can be mostly catalog with one playable world. Other worlds stay background until built (CX6). |
| P9S3h | **Load once.** Shared series catalog loads once for all its children; inactive children stay lazy (WP11). |
| P9S3i | **Attribution per series**, with licence tier where content ships (MC5-3). |
| P9S3j | **Entry to a series world** can be through the frame (your connection) or through the series' own canon means. Both resolve to the same instance unless a fresh or parallel version is chosen (OD5). |

### P9S4: handling "the subtleties of how everything works"

The list of subtleties is effectively endless. Enumerating them upfront would
stall everything (CX7). Four tools keep them under control:

1. **A small set of invariants every system keeps.** Most subtleties are one of these broken in a new place.
2. **Generic tests that check the invariants across every pack**, so a new world is checked without new test code.
3. **The six timeline tricks** (TIMELINES C1–C6: coarse event graph, inertia, lazy resolution, level of detail, roles not people, motives outlive scripts). They decide what does not need to be calculated.
4. **A subtlety register.** A discovered subtlety gets a code, an owner and a slice that will meet it. It is fixed when play reaches it (CX1, CX8), not pre-solved.

**P9S5, proposed invariants:**

| Code | Invariant | Generic check |
| --- | --- | --- |
| INV1 | **Identity.** One ID per being, thing or place; counterparts and copies are different IDs. | No two records share an ID; transitions never reuse one |
| INV2 | **Conservation.** Goods, money and people never duplicate through travel, reset, branch, aggregation or promotion. | Totals before and after every transition |
| INV3 | **Truth vs knowledge.** The player sees only what they learned. | Change hidden state; player view, text and ARIA stay identical |
| INV4 | **Determinism.** Same state, inputs and time give the same result; no reload farming. | Replay and seed sweeps |
| INV5 | **Causal order.** Events across worlds and clocks resolve in causal order. | Single advance vs split advance agree (P9G4) |
| INV6 | **Freeze on reliance.** Anything seen or relied on never rerolls. | Content revision and generator update leave revealed facts unchanged |
| INV7 | **Honest coverage.** Every offered action resolves to real play. | Every travel and action target resolves in the loaded packs |
| INV8 | **Scoped, versioned rules.** Every rule has a layer, scope and revision; visited worlds keep their revision. | Rule lock fingerprints stable across reload |
| INV9 | **Round trip.** Save, reload and import give the same next result. | Round-trip then advance, compare |
| INV10 | **Locality.** A pack or system writes only its own state and touches others through their owners. | Write-set check per pack in tests |

**P9S6:** these ten reduce "consider every subtlety" to "keep ten promises
everywhere, and log the rest when play meets them". New subtleties either fit
an invariant (add a case to its generic test) or reveal a missing one (add it).

### P9S7: subtlety register, first seeds

| Code | Subtlety | Invariant | Meets it |
| --- | --- | --- | --- |
| SR1 | Counterpart meets counterpart (two versions of one character in one place) | INV1, INV3 | First fresh-vs-revisit or crossover slice |
| SR2 | Goods carried between worlds with different economies | INV2 | First cross-world trade |
| SR3 | Two worlds at different time ratios exchanging letters or companions | INV5 | First cross-world mail or companion |
| SR4 | A later book's fact learned through foreknowledge cheat | INV3 | Reader-foreknowledge slice |
| SR5 | Pack revision changes a seen character | INV6, INV9 | First content revision after a playtest save |
| SR6 | Cluster-wide event touching a world the player is not in | INV5, INV10 | First series cluster |

### Dispositions

- **ACCOUNT FOR NOW:** source and structure are separate axes; series pack →
  continuity child packs; cosmology pack above series; frame cosmology hosts
  series clusters; invariants INV1–INV10 as the shared test target; subtlety
  register (P9S7) maintained in this doc until a better owner exists.
- **LATER:** cluster-level save section implementation, counterpart encounter
  rules, a generic invariant suite across real packs.

Loader lane addendum sent 2026-10-16: series and cosmology parent packs,
continuity children, `counterpartOf`, a cluster save section shape, and generic
invariant tests (INV1, INV2, INV4, INV6, INV8, INV9, INV10) over the fixtures.
