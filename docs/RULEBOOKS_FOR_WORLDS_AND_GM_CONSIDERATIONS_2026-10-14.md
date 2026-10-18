# Rulebooks for world building, and do we need a game master

2026-10-14. Weibao asked: "how can the core rulesets and D&D and other latest
downloaded stuff help us out in creating or expanding worlds and more? more to
consider? Do we need game master? / more to consider?"

Considerations palette, not a spec. Proposals only; no implementation,
dispatch or priority change. Canon-first world order in
[PROJECT.md](../PROJECT.md) still governs which world gets work first.

Builds on, does not repeat:
[tabletop library](research/tabletop-library-2026-10-14/README.md),
[world rules guide](research/tabletop-library-2026-10-14/WORLD_RULES_GUIDE.md)
(G1-G9: which book answers which design question),
[implementation considerations](research/tabletop-library-2026-10-14/implementation-considerations/REPORT.md)
(I1-I7, O1-O4),
[generation foundation rules](GENERATION_FOUNDATION_RULES_2026-10-14.md)
(GR1-GR17), [D&D foundation](worlds/dnd/FOUNDATION.md) and the
[simulation/NPC architecture](research/SIMULATION_AND_NPC_ARCHITECTURE_2026-10-14.md)
trial director (ER8-A4).

## Verified this pass

| ID | Fact | Evidence |
|---|---|---|
| V1 | D&D SRD 5.1 and 5.2.1 are CC-BY-4.0 | License text in the private extracted copies |
| V2 | Ironsworn text is CC-BY-4.0 | Playkit license text |
| V3 | Ars Magica open text is CC BY-SA 4.0 (share-alike) | Publisher page, per the [book sweep](research/TABLETOP_BOOK_SWEEP_2026-10-14.md#f8-particularly-useful-acquisition-opportunity) |
| V4 | SWN/WWN world tags each list Enemies, Friends, Complications, Things, Places | SWN Revised free p.136, WWN free p.150 (private index) |
| V5 | SWN and WWN both have faction stats, assets and a faction turn | SWN p.213-217, WWN p.324-327 |
| V6 | Ironsworn ships oracle tables (action, theme, region, location, settlement...) | Ironsworn core p.174-177 |

Not verified: Cypher open license terms for shipped game content, WWN/SWN
free-edition reuse terms, any GURPS/WFRP/M&M reuse (assume reference only).

## Part 1. How the rulebooks help build worlds (RB)

The library already maps books to questions (G1-G9). These are the angles
that are new, ranked by how directly they feed work already queued.

| Code | Use | Why it fits YAIR | Feeds |
|---|---|---|---|
| RB1 | **Tag decks as generator tables.** SWN/WWN tags (V4) are already the shape GR7 wants: a tag pulls in enemies, friends, complications, things and places. Write YAIR-original tags in that five-slot form; overlay per world (GR8). | Gives the GR kit its first real content table without inventing a format. Doubles as "per-world adjectives". | GR top pick 5 (table compiler), Village pool |
| RB2 | **Faction turn as the slow macro owner.** SWN/WWN faction turns (V5) are close to an idle macro sim already: stats, assets, one action per turn, income. | Matches the "separate slow owner" in ER8-P4. Factions act while you idle; you see consequences on return. | SIMULATION doc AI7, MULTIVERSE |
| RB3 | **Downtime systems are the idle layer.** Ars seasons, WWN/Blades downtime, Pendragon winter phase: each is "commit time, get a durable result." That is an idle job. | Tabletop downtime is the part of RPGs that already looks like an idle game. | Implementation O1/O2 (study/invention) |
| RB4 | **SRD as shippable D&D content.** V1 means monsters, spells, conditions, magic items and class features can ship in the public fork with an attribution notice. | D&D is a canon-first world. Removes the "paraphrase everything" cost for SRD content only. Setting (Forgotten Realms, Phandalin) is not in the SRD. | D&D first slice A1 |
| RB5 | **Tier bands as pacing, not numbers.** D&D tiers 1-4, Cypher tiers 1-6, WFRP career levels each say what new verbs a character gets at each band. | Use for "what changes at this stage of a world arc", never as cross-world power rank (K4). | World core kit audit |
| RB6 | **Per-world resolution curve.** d20 is flat and swingy, 3d6 (GURPS) is a bell curve, d100 (WFRP) is readable percent, Cypher lowers difficulty instead of adding bonuses. A world can declare its curve. | Makes worlds mechanically distinct cheaply. Cheats then differ by world: a crit-fishing luck cheat pays more in a flat-d20 world. | GR9 "why this?", cheat matrix |
| RB7 | **Oracles and moves as GM-less consequence.** Ironsworn moves resolve to strong hit / weak hit / miss, and a miss pulls from "pay the price". Oracles answer "what is here?" | This is the clearest published answer to running an RPG without a human GM. See Part 2. | Trial director ER8-A4 |
| RB8 | **Conversion guides as precedent for crossing.** SRD's own 5.1-to-5.2 guide, Strange translation, Eclipse Phase resleeving all keep function and conditions, then renumber locally. | Matches the accepted retain-powers premise: translate what a power does, not its number. | MULTIVERSE, ability owners |
| RB9 | **Monster/NPC blocks as templates.** SRD stat blocks, Numenera bestiaries, WFRP careers give a starting NPC kit: role, capabilities, motive hooks. | Same generator for NPCs and player (GR13). | Companions audit, NPC kit |
| RB10 | **Adventures as storylet chains.** Published adventures (EP2 NanoOps, Xenovore) show node order, clue redundancy and fail-forward. | Template for canon event graphs and local storylets, not content to copy. | Event graph pilots |
| RB11 | **Holdings and homes.** Ars Covenants, HarnManor, WWN/Godbound dominion, Forbidden Lands stronghold. | Home-as-progression already exists in the vision; these give concrete budgets and residents. | Home/residence owners |
| RB12 | **Rulings ledger.** Many rules end with "the GM decides" (spell level in Ars, improvised actions in 5e). Each such call becomes a frozen per-world ruling record: question, ruling, source locator, revision. | Without it, agents invent rules silently and two lanes rule differently. This is the concrete form of K5/U3. | Every world adapting a rulebook |

### Risks (R)

| Code | Risk | Guard |
|---|---|---|
| R1 | Silent edition mixing (SRD 5.1 vs 5.2.1, WFRP 4e vs 5e) | One edition per world, recorded in its source contract (D&D already does this) |
| R2 | Shipping non-open text in the public fork | License tier per source in the private manifest before any content import; V1-V3 are the only verified open ones. BY-SA (Ars) makes derived text share-alike |
| R3 | Reading backlog crowds out playable slices | Read by question (G1-G9), one packet per playable slice; the library is a shelf, not a queue |
| R4 | Book numbers becoming YAIR balance | K4 stands: function and conditions first, local numbers chosen by the world owner |
| R5 | Randomized module twists leaking | A changed or randomized canon truth is a sealed secret; refer by ID |

## Part 2. Do we need a game master?

Two different "GMs". Short answers first.

**GM-1: an agent GM role (Claude/Codex coordinating world work).** It already
exists: the [GM prompt](GAME_MASTER_PROMPT.md) and the D&D world GM. No new
"rulebook GM" is needed. Rulebooks are research input to existing world
owners. The D&D GM's next unit (A1 in [FIRST_SLICE](worlds/dnd/FIRST_SLICE.md))
is the natural first consumer of RB4 and RB12.

**GM-2: an in-game game master.** Yes, but not as one thing. A tabletop GM
does seven jobs; YAIR already has or has proposed an owner for most of them.

| Code | Tabletop GM job | YAIR owner | State |
|---|---|---|---|
| GM1 | Adjudicate rules | Engine resolvers + rulings ledger (RB12) | Resolvers exist; ledger new |
| GM2 | Decide what happens next, pacing | Director/storyteller over eligible storylets (ER8-A4); storytellers stack per world and per person (accepted 2026-10-09) | Proposed trial |
| GM3 | Improvise people and places | Generators (GR1-GR17) with tag decks (RB1) | Contract written, no live consumer |
| GM4 | Play the world's factions offscreen | Faction turn slow owner (RB2) | Proposal |
| GM5 | Remember continuity | Save, history, freeze-on-reveal (GR3) | Exists in part |
| GM6 | Narrate | Text grammar over fact IDs (GR15) | Contract written |
| GM7 | Interpret freeform intent ("I try to bribe the guard with my cursed ring") | Authored verbs plus optional local AI suggestion | Hard part; see below |

GM7 is the only job a deterministic engine cannot fully do. Options, all
compatible:

- **Authored verb lists** per place, with combination rules (current approach).
- **Ironsworn-style moves** (RB7): generic moves ("face danger", "secure an
  advantage", "compel") that any situation can call, resolving to a
  three-way outcome with an authored "pay the price" table. Covers a lot of
  freeform space with a small rule set.
- **Local AI as suggester, never truth-writer**
  ([local AI considerations](research/LOCAL_AI_MODEL_CONSIDERATIONS_2026-10-14.md)):
  it may propose which move or verb a typed intent maps to, or flavor text.
  The engine still resolves, saves and validates. Game must work with the
  model absent.

### GM angles worth keeping (GMA)

| Code | Angle |
|---|---|
| GMA1 | **Storyteller personalities = GM styles.** RimWorld's Cassandra/Phoebe/Randy map onto tabletop styles: module-runner (canon beats), sandbox (factions and tags, no plot), narrative (Ironsworn-style moves and consequence), OSR (dangerous, fair, player skill). Selectable per world and per life, stacking with the accepted fate rule. |
| GMA2 | **Visible GM screen.** A debug or cheat view showing the director's recent picks, cooldowns and "why this?" (GR9). Same data a "see fate" cheat reads. Inspection only, no mutation. |
| GMA3 | **Rule of cool and fudging as a policy, not a secret.** Tabletop GMs fudge for fun. In YAIR that is an explicit storyteller adjective (e.g. "fated protagonists survive"), already partly accepted under fate protection. Never a hidden reroll. |
| GMA4 | **Session zero.** Tabletop groups agree on tone, lines and veils before play. A per-world start screen could set storyteller, cruelty and pacing (cruelty-per-world is already accepted). |
| GMA5 | **The GM also plays NPC cheaters.** Same generator and same rules for NPCs (GR13) means the director never conjures a stronger rival to force a beat (ER8-A4 gate). |

## Dispositions

**ACT NOW:** nothing. No current correctness problem found.

**ACCOUNT FOR NOW** (constraints on any lane touching rulebook content):

1. A1-acc: record license tier per source before any shipped content (R2).
2. A2-acc: one edition per world, in its source contract (R1).
3. A3-acc: every "GM decides" rule gets a frozen ruling record (RB12).

**LATER / DELEGATE** (ranked; each needs Weibao's go before dispatch):

| Rank | Item | Suggested executor | Done check |
|---|---|---|---|
| L1 | Resume D&D A1 using SRD 5.2.1 content directly, with attribution file and first rulings ledger | D&D world GM, high effort | Frozen legal start snapshot plus ruling records with locators |
| L2 | Write 8-12 YAIR-original tags in five-slot form as the first GR table (RB1) | Codex medium, after GR pick 2 lands | Tag query returns valid picks; seed sweep test passes |
| L3 | Add Ironsworn-style moves and "pay the price" as one trial director option (RB7, GM7) | Codex high, alongside ER8-A4 | Three outcomes each change saved state; reload cannot reroll |
| L4 | Faction turn prototype as a slow owner in one world (RB2) | Codex high, later | Offline return shows faction changes with causes |
| L5 | Per-world resolution curve as a world adjective (RB6) | Design note first | Two worlds resolve the same check with visibly different odds |

Not changed: priorities, canon-first order, any gameplay or save.

## Round 2: more rulebooks, one rulebook per multiverse, and more

> if we incorporate more rulebooks and more? different rulebooks for different multiverses? other stuff and more? LEts consider things in detail first, and also consider more f=rulebooks to consider

Consideration first, per the request. Nothing here is dispatched or accepted.
Extends [DESIGN_CONSIDERATIONS D1/O1](research/tabletop-library-2026-10-14/DESIGN_CONSIDERATIONS.md)
and [MULTIVERSE_STRUCTURES](worlds/MULTIVERSE_STRUCTURES.md); those stay the
owners. Weibao's "everything possible, reasonably" applies: each option below
is a per-world or per-cluster choice, not either/or.

### What "a rulebook for a multiverse" actually means (MV)

A rulebook brings three separable things. Pick each per world or cluster.

| Code | Layer | Examples | YAIR form |
|---|---|---|---|
| MV1 | **Resolution profile**: how a check is rolled and read | d20 flat; 3d6 bell; d100 percent; Cypher difficulty steps; Genesys success plus side-effect axes; diceless (Amber, Nobilis) | Data overlay on one resolver (GR8). Records curve, degrees of success, crit rule |
| MV2 | **Progression profile**: how you get better | Levels and XP (D&D); careers (WFRP); point buy (GURPS, Hero); learn by use (BRP, Burning Wheel); seasons of study (Ars); tiers (Cypher) | Which activities grant growth here, and in what unit |
| MV3 | **Law profile**: what powers and things do here | Spell schools, Ars realms and auras, Mage paradigm and paradox, Torg axioms, Rifts ley lines | The world's own laws; owner is the world GM |

A cluster (say the D&D Great Wheel worlds) can share all three. A converged
world can hold two law profiles in zones (Torg-style). One profile can serve
unrelated cosmologies. This keeps D1's rule: engine, setting and cosmology are
independent.

### Detailed considerations (MV4-MV20)

| Code | Consideration | Consequence for YAIR |
|---|---|---|
| MV4 | **One runtime, many profiles.** Never N rules engines. Profiles are data plus a small set of resolver variants. | Start with two profiles (SRD d20 and one contrast, e.g. d100 or learn-by-use) and add only when a world needs a new curve. |
| MV5 | **Whose rules resolve a cross-world act?** Three models, all reachable per cluster: place rules (Torg: local reality wins), traveler rules (Strange: you translate into the local form), raw (Rifts: everything works as itself). | World adjective. Status window says which applies here, once discovered. |
| MV6 | **Scale classes.** Rifts mega-damage vs normal, Godbound divine vs mortal, Exalted essence. Numbers on different scales cannot be compared directly. | A scale field on actors and effects. Cross-scale contact uses a declared rule, not raw subtraction. Prevents a WFRP peasant and a Godbound hero sharing one HP axis. |
| MV7 | **Function record plus native sheet.** Every power keeps its home stats and a function record (what it does, target, range, carrier, needs). Abroad, the function record is what the local profile reads. | Same as RB8. Party UI shows a common function view plus a native sheet view per member. |
| MV8 | **Progression is local, retention is yours.** Skills earned anywhere stay (accepted premise). How you earn more follows the world you are in. | Visiting a learn-by-use world rewards a different play style than a level world. Variety without loss. |
| MV9 | **"System" cheats are a personal rulebook.** LitRPG protagonists (Legendary Mechanic, Shadow Slave) carry their own progression rules into worlds that have none. | A cheat can override MV2 for you only. NPCs stay local. Strong fit with the cheat matrix. |
| MV10 | **Numberless worlds.** Amber and Nobilis have no dice; rank and will decide. A status window there shows ranks, or nothing, until a system cheat imposes numbers. | Makes "seeing numbers" itself a power. |
| MV11 | **Rules are discoverable.** A world's profile starts hidden or partly known; you learn "luck runs wild here" by play or study. | GR5 truth vs knowledge applies to rules too. Rule discovery can be a research reward. |
| MV12 | **Freeze the profile per world instance.** Store profile `id@rev` in the world's save. Changing a visited world's rules is a migration, not a data edit. | Same logic as GR10. |
| MV13 | **Mixed parties and NPC travelers.** Companions and rivals from other worlds keep their own profiles (GR13). | No forced conversion when an ally follows you. |
| MV14 | **Content packs load per world.** SRD alone is hundreds of monsters and spells. | Lazy-load world data; no generator or content without a reader (GR12). Bundle size is a real cost (bundle audit exists). |
| MV15 | **GM procedures come with the book.** Fronts (Dungeon World), faction turns (SWN), oracles (Ironsworn), icon dice (13th Age), winter phase (Pendragon). | The world's storyteller options (GMA1) can come from its own rulebook, so worlds feel run by different GMs. |
| MV16 | **Downtime differs per world.** Ars seasons vs Blades downtime vs D&D short and long rests. | Idle jobs read the local time unit; offline catch-up keys on game time (GR17). |
| MV17 | **Conformance tests per profile.** Same scenario run through each profile; odds stay inside a stated band. | Feeds the "odds plus why" lens; catches a profile that makes a cheat useless or broken. |
| MV18 | **One owner per rulebook.** One deep dive per book, private exact tables, world GMs consume it. | Avoids every lane reading the SRD separately. |
| MV19 | **Licence tier is part of the profile record.** Open (shippable with notice), share-alike, reference only. | Public fork safety. Share-alike text stays in its own data files with notices (inference, not legal advice). |
| MV20 | **Player-facing honesty.** Changing dice curves without saying so feels like the game cheating. | A short world-rules panel in plain words, unlocked by MV11 discovery. Desktop first. |

### More rulebooks to consider (NR)

Not on the sweep, catalog or buying list. Ranked inside each group by fit.
Licence notes are from memory, **not verified this pass**; check before
shipping anything.

**Multiverse and world-hopping**

| Code | Rulebook | What it adds | Notes |
|---|---|---|---|
| NR1 | Planescape (5e 2023; 2e original) | D&D's own multiverse: Sigil hub, factions, belief shaping planes | Directly serves the D&D canon world; not SRD |
| NR2 | Spelljammer (5e 2022) | D&D travel between worlds by ship | Same |
| NR3 | Amber Diceless / Lords of Gossamer and Shadow | Walking through near-copies of worlds toward one true world; diceless attribute auction | MV10 numberless worlds; branching histories |
| NR4 | Mage: The Ascension 20th | Belief-made reality, paradox when magic looks impossible | MV3 law profile as consensus; MV5 place rules |
| NR5 | Feng Shui 2 | Time-period junctures and sites that grant power to whoever holds them | Branching histories; holding sites |
| NR6 | Nobilis | Beings who embody a concept; miracle levels | High-end power; "aspects of one cheat" |
| NR7 | Scion 2e | Mortal to demigod to god; fatebinding turns NPCs into fated roles | Fate and protagonist protection |

**Rule toolkits (the "different rulebooks per world" machinery)**

| Code | Rulebook | What it adds | Notes |
|---|---|---|---|
| NR8 | Fate Core + Fate System Toolkit | Aspects (tags with power), magic-system building chapter | Fate SRD reportedly CC-BY |
| NR9 | Savage Worlds Adventure Ed. | Setting Rules: named switches that change a whole world's play | Closest published model of MV1-MV3 overlays |
| NR10 | Cortex Prime | Explicit catalogue of mods to build a game per setting | Same, more modular |
| NR11 | Hero System 6e | Most precise power construction in print | Compare with GURPS Powers |
| NR12 | Pathfinder 2e Remaster | Huge open content, downtime, earn income, crafting, kingdom rules | ORC licence reportedly; second shippable library after SRD |
| NR13 | 13th Age | One Unique Thing; relationship dice with 13 world powers | Unique starts; patrons; Archmage SRD reportedly open |

**World creation and history**

| Code | Rulebook | What it adds | Notes |
|---|---|---|---|
| NR14 | Microscope | Build a history out of order: periods, events, scenes | World lore and timelines |
| NR15 | Dawn of Worlds (free) | Gods spend power over ages to shape land, races, nations | Generator by epochs |
| NR16 | The Quiet Year | A community's year by season and scarcity | Village start |

**Ordinary life and home (life-sim north star)**

| Code | Rulebook | What it adds |
|---|---|---|
| NR17 | Stonetop | A village you improve over time; steading moves and improvements |
| NR18 | Golden Sky Stories | No combat; helping neighbours; bonds as currency |
| NR19 | Ryuutama | Travel, seasons and weather as the core loop |
| NR20 | Wanderhome | Pastoral, seasonal, no violence |
| NR21 | Torchbearer 2e | Town phase, inventory slots, light and hunger pressure |
| NR22 | Burning Wheel | Learn by testing at the edge of ability; beliefs pay rewards |

**Anime, cultivation and power-at-a-cost (JJK/Bleach/Fate and the books)**

| Code | Rulebook | What it adds |
|---|---|---|
| NR23 | Double Cross 3e | Power use raises encroachment; bonds (Lois) pull you back |
| NR24 | Tenra Bansho Zero | Karma that turns you into a demon; emotions become power |
| NR25 | Shinobigami | Each character has a hidden secret others can uncover | 
| NR26 | Legend of the Five Rings 5e | Honour, glory, status; court conflict; strife |
| NR27 | Legend of the Wulin / Weapons of the Gods | Kung fu styles, chi, loresheets tying you to sects |
| NR28 | Fabula Ultima | JRPG classes, villains with their own resource |
| NR29 | Avatar Legends | Training moves; personal principles in tension |
| NR30 | Kids on Brooms; Magonomia | Magic school and Renaissance wizards (Harry Potter priority world has no official RPG) |

**Mystery, secrets and investigation**

| Code | Rulebook | What it adds |
|---|---|---|
| NR31 | GUMSHOE (Trail of Cthulhu, Night's Black Agents) | Core clues are always found; spend points for extra (reportedly open SRD) |
| NR32 | Call of Cthulhu 7e / Delta Green | Sanity and investigation; free quickstarts |
| NR33 | Shadowrun | Magic vs cyberware: implants cost your magic | 
| NR34 | Electric Bastionland | 100 failed careers with debts as starts |

**GM craft (for the in-game GM question)**

| Code | Source | What it adds |
|---|---|---|
| NR35 | Dungeon World | Fronts: dangers with impending doom and grim portents (reportedly CC-BY) |
| NR36 | Return of the Lazy Dungeon Master (Sly Flourish) | Strong start; secrets and clues not tied to one location |
| NR37 | The Alexandrian: Three Clue Rule, node-based design (free articles) | Discovery routes that cannot dead-end |

### Other stuff beyond rulebooks (OS)

| Code | Source | Why |
|---|---|---|
| OS1 | Lone Wolf gamebooks (free via Project Aon) | Text adventures where Kai disciplines carry from book to book: retained powers across a series |
| OS2 | Legacy board games (Gloomhaven, Pandemic Legacy) | Sealed envelopes and permanent world change; a physical model of sealed secrets |
| OS3 | VS Battles wiki tiering | Community cross-franchise power scale; reference for MV6 scale classes, with heavy caution |
| OS4 | Choice of Games stat design | Text-only stat checks shown as opposed pairs |
| OS5 | LitRPG "System" rules in our own books | Already supplied; treat each System as a personal rulebook (MV9) |

### Risks, round 2 (R6-R10)

| Code | Risk | Guard |
|---|---|---|
| R6 | Profile sprawl: every book becomes a new resolver | MV4 cap; a new profile needs a world that uses it |
| R7 | Reading sprawl: 37 more books | Pick by question and by the world being built; most NR rows are shelf, not queue |
| R8 | Cross-scale exploits (bring mega-damage to a mortal world) | MV6; also allowed as a fun cheat when a world says so |
| R9 | Profile changes rewriting saves | MV12 |
| R10 | Licences misremembered | Every NR licence note is unverified; check the actual text first |

### Dispositions, round 2

**ACCOUNT FOR NOW:**

1. A4-acc: worlds declare resolution, progression and law profiles separately (MV1-MV3); none of these is the universe.
2. A5-acc: profile `id@rev` frozen per world instance (MV12).
3. A6-acc: function record alongside native stats for every imported power (MV7).

**LATER / DELEGATE** (ranked; Weibao's go needed before dispatch):

| Rank | Item | Suggested executor | Done check |
|---|---|---|---|
| L6 | Design note: profile record schema plus MV5 cross-world resolution, using SRD d20 and one contrast profile | Claude or Codex high | Two worlds, same check, different visible odds; reload keeps the result |
| L7 | Verify licences for NR8, NR12, NR13, NR31, NR35 and record tiers in the private manifest | Codex medium | Licence text quoted privately with locator |
| L8 | Acquire free items: Dawn of Worlds, Lone Wolf (Project Aon), CoC quickstart, Fate SRD, Dungeon World SRD, PF2 ORC rules, Alexandrian articles | Codex medium, polite routes only | Catalog rows with hashes |
| L9 | Paid shortlist decision: Planescape (D&D canon), Savage Worlds or Cortex Prime (profile machinery), Stonetop (village), Double Cross (anime power cost) | Weibao | Weibao picks or skips |
| L10 | Deep dive Planescape for the D&D world's multiverse | D&D world GM, after L1 | Private exact tables; public paraphrase |

## Round 3: engine level, and should we implement everything?

> incorporating stuff into engine level and more? Implementing everything that might be needed?

Short answer: **build a small set of engine primitives that almost every
rulebook needs, each landed with one real consumer; make everything else a
data pack.** That keeps every rulebook reachable (everything possible,
reasonably) without building speculative engine that nothing plays. Building
"everything that might be needed" up front would break the standing rules
"finish one playable slice before the next" and GR12 "no generator without a
reader", and the [abstraction inventory](research/ABSTRACTION_INVENTORY_2026-10-14.md)
already counts 474 source files with duplicated clocks, RNG and schedulers.

### What the engine already has (verified in source this pass)

| Code | Existing seam | What it already does | Gap for rulebooks |
|---|---|---|---|
| EX1 | `src/rule_modules.js` | Layered rule modules: kinds `world_law`, `generated_law`, `institution_policy`, `cheat_overlay`, `learned_technique`; layers core, world, region, actor, director; tag-query selectors; `createRuleLock` fingerprints a pack | Only one resolver id (`village.mix@2`) and five facts. The lock is already MV12's "freeze profile per world" |
| EX2 | `src/gen_kit.js` | Addressed draws, weighted and stratified picks, shuffle bags, pity, retries with fallback | Has no reader yet beyond tests and mixture (GR fold) |
| EX3 | `src/tag_store.js` | Tag registry and observer-aware tag facts | Ready for RB1 tag decks |
| EX4 | `src/realm_traveler_profiles.js`, `realm_boundary_rules.js` | Traveler modes (physical, projection, alternate body, shared body); boundary permission rules | Half of MV5 (traveler side) |
| EX5 | `src/storylet_deck.js`, simulation event director | Storylet deck with cadence | Director policy per world (GMA1) not separated |
| EX6 | World instances (ER18-AB10), carriers (AB11), per-world law blocks (AB12) | Six adapters, six transfer paths, scattered law configs | AB12 says no universal world-law object yet |

Quick grep found **no shared check/roll resolver**; checks appear per domain
(inference from a name search, not a full audit).

### Engine primitives rulebooks need (EP)

Ranked by how many rulebooks and worlds need them.

| Code | Primitive | Covers | Build on | When |
|---|---|---|---|---|
| EP1 | **Check resolver with a resolution profile** (curve, target, degrees of success, crit rule) using addressed draws and a "why" receipt | MV1, RB6, every rulebook | EX2 draws; GR9 receipts | First, with the D&D first slice as consumer |
| EP2 | **Rule packs per world**: more resolver ids, wider fact vocabulary, a `ruling` kind for RB12 | MV3, RB12, MV12 | EX1 rule modules and lock | With EP1 |
| EP3 | **Progression ledger with a growth unit** (xp, use mark, season, career step, point) | MV2, MV8, MV9 system cheats | Existing skill/body progression owners | Second world that grows differently |
| EP4 | **Function record on abilities** (does what, target, range, carrier, needs, scale) | MV7, RB8, cross-world use | Cheat capability matrix, AB11 carriers | First imported power |
| EP5 | **Scale class** on actors and effects, with a declared cross-scale rule | MV6 | Small field plus EP1 hook | First world with a different scale |
| EP6 | **Progress tracks and clocks** (Blades clocks, Ironsworn tracks, Dungeon World fronts, faction turns) | RB2, RB7, NR35, GM2, GM4 | AB2 scheduler; keep ER18-N1 time kinds separate | With the director trial |
| EP7 | **Director policy per world** (storyteller style, pacing, cooldowns) | GM2, GMA1, MV15 | EX5 | Trial director ER8-A4 |
| EP8 | **Tag deck tables** | RB1, GM3 | EX2 + EX3 + `compileTagQuery` | GR top pick 2 |
| EP9 | **Content pack per world** with licence tier and lazy load | MV14, MV19, RB4 | AB9 manifests | First shipped SRD content |
| EP10 | **GM screen inspector** (director picks, odds, rule lock, rulings) | GMA2, MV17 | AB13 read models | Alongside EP1 for debugging |

Everything else on the earlier lists (faction economies, Torg zones, Amber
shadow-walking, Nobilis miracles, kingdoms) becomes a rule pack, a track, a
tag deck or a world-local module on top of EP1-EP10. A new rulebook should
then cost data plus at most one new resolver variant.

### Engine considerations (EC)

| Code | Consideration | Consequence |
|---|---|---|
| EC1 | **Code vs data line.** Code: resolver variants, new fact types, new growth units. Data: tables, tags, rulings, spells, monsters, profiles. | A validator for each data kind, so a bad pack fails at load, not in play |
| EC2 | **Idle and offline need batched resolution.** Catch-up can run thousands of checks. Keyed draws keep it deterministic; the curve also changes how spread out offline results are (a flat d20 world gives wilder offline days than a 3d6 world). | EP1 needs a batch path with a budget (GR11) and game-time keys (GR17) |
| EC3 | **Cheats are already a rule-module kind.** `cheat_overlay` exists. Luck, "see fate" and System cheats should be overlays reading EP1 receipts, not special cases. | One place to balance cheats across profiles |
| EC4 | **Strangler, not rewrite.** Wrap existing domain checks behind EP1 one at a time (kernel strangler order, ER18-P3/P4). | Old content keeps working; no flag day |
| EC5 | **Old saves stay inert.** New fields optional; a world without a declared profile uses its current behavior. | Matches the persistence rule: migration or explicit compatibility decision |
| EC6 | **One writer per seam.** `rule_modules.js`, `gen_kit.js` and the new resolver each get one owner lane. | Avoids the shared-branch race seen in parallel sessions |
| EC7 | **Truth vs knowledge for rules.** The engine knows the profile; the player sees what they discovered (MV11, GR5). | EP10 inspector is author-only; player panel is discovery-gated |
| EC8 | **Conformance and replay tests.** Same scenario through each profile; seed sweep; save/reload/import gives the same next result (GR16). | Proof that a profile is not just a label |
| EC9 | **Engine-first trap.** Months of primitives with nothing playable is the main risk. | Each EP lands only with a visible slice at 1366x768 |

### Dispositions, round 3

**ACCOUNT FOR NOW:**

1. A7-acc: extend `rule_modules.js` (resolver ids, facts, `ruling` kind) rather than inventing a second rules system (EX1).
2. A8-acc: any new check code uses EP1's shape (addressed draw plus receipt), even before EP1 exists as a shared module.
3. A9-acc: no engine primitive merges without a playable consumer (EC9).

**LATER / DELEGATE** (ranked; Weibao's go needed):

| Rank | Item | Suggested executor | Done check |
|---|---|---|---|
| L11 | EP1 + EP2 + EP10 with D&D first slice as consumer, plus one contrast profile in tests | Codex high, one owner for rule files | Two profiles give visibly different odds on the same check; receipts show why; save/reload/import keeps next result; rebuilt fresh-origin desktop proof |
| L12 | EP6 + EP7 with the trial director | Codex high, after L11 | A clock fills from real actions; director picks are saved and cannot reroll |
| L13 | EP3 + EP4 when a second world with different growth or an imported power is chosen | World GM | A skill learned in world A works in world B through its function record |
| L14 | EP9 content pack and licence tier for SRD | Codex medium | Attribution notice ships; pack lazy-loads only in the D&D world |

## Round 4: more engine-level angles

> incorporating stuff into engine level and more?

New angles only; round 3 (EP1-EP10, EC1-EC9) stands. Read as aspect
expansion of the same engine question, not a new priority.

### More existing seams found (EX7-EX9)

| Code | Seam | Relevance |
|---|---|---|
| EX7 | `src/power_models.js` | Power models (practice, design, investment, authority, hybrid) already compute scope and cost without "fictional rank conversion". Partly covers EP3/EP4; extend, do not duplicate |
| EX8 | `src/conditions.js`, `src/active_effects.js` | Upstream success-chance conditions and timed effect templates. Where SRD conditions (blinded, grappled...) would attach |
| EX9 | Upstream combat (`combat_math.js`, `combat_stances.js`) | Real-time auto-battle by attack speed. Tabletop combat is turn-based. See EA4 |

### New angles (EA)

| Code | Angle | Engine consequence |
|---|---|---|
| EA1 | **Resolver families, not one per book.** Almost every RPG uses one of eight: sum vs target (d20, 2d6), roll under (d100, BRP), dice pool counting successes (WoD, Shadowrun, Double Cross), step dice (Cortex, Savage Worlds), narrative symbols (Genesys), cards (Torg drama deck, Deadlands), spend a resource (GUMSHOE, Cypher effort), bidding or rank compare (Amber, Nobilis). | EP1 implements families with parameters. Eight variants cover the whole NR list |
| EA2 | **Exact odds, not simulation.** The odds lens and "see fate" need true probabilities. Dice math is small enough to compute exactly (convolution, like AnyDice). | A pure odds calculator beside EP1; the same function feeds UI, cheats and conformance tests |
| EA3 | **Spend-to-modify is a primitive.** Fate points, inspiration, Cypher effort, hero points, luck: spend a resource before or after a roll to change it. | One hook ("before roll", "after roll") that cheats and world currencies share |
| EA4 | **Combat models per world.** Keep upstream auto-battle as one model. Turn-based tabletop combat maps to timed actions (ATB-style: each action has a speed). Big idle fights resolve by expected outcome or batched rounds. | Combat profile per world; no rewrite of upstream combat |
| EA5 | **Time ladder.** Round, turn, scene, day, season, year. Rules name a rung; idle jobs and offline catch-up convert between rungs. | Explicit rung field on durations; respects ER18-N1 distinct time kinds |
| EA6 | **Effect DSL for spells and monsters.** SRD spells have structured fields: level, school, casting time, range, area, save, damage, condition, duration, concentration. | Encode as data with an "unsupported, needs ruling" flag. Measurable goal: percent of SRD spells representable |
| EA7 | **Importer pipeline.** Agents or a local model draft packs from rulebook text (spells, monsters, tables) into the DSL; the validator rejects bad output; a human or review lane accepts. | Turns reading into data at scale; raw text stays private, only accepted open-licence data ships |
| EA8 | **Nested random tables.** Rulebooks are often half tables: roll here, then on a subtable, reroll duplicates, roll twice and combine. | Extend gen_kit tables with subtable links and combine rules |
| EA9 | **Conditions with cross-world meaning.** "Grappled" in D&D and "Entangled" in WFRP do similar things. | Conditions carry a function record (EP4), so a foreign condition still works abroad |
| EA10 | **Rest and recovery as idle loops.** Short and long rests, WFRP recovery, Ars seasons of healing. | Recovery becomes queued idle work per world profile; it is a core idle loop |
| EA11 | **Injury and death models per world.** Death saves, critical injury tables, sanity, karma thresholds (Tenra), encroachment (Double Cross). | Per-world consequence tables; ties to the death and reset considerations and fate protection |
| EA12 | **Social resolution.** D&D attitudes, L5R strife, Masks labels, 13th Age icon relationships. | Relationship values become checkable facts for EP1 and the director |
| EA13 | **Laws as things the player can make.** `generated_law` already exists (Village uses it). Godbound miracles, Nobilis decrees and authority cheats would let a player author a world law at runtime. | Same validator and budget as authored packs; saved with the rule lock |
| EA14 | **Converged zones.** Two worlds' laws in one place resolve by the existing layer and specificity priority. | No new conflict system; add a zone scope to rule packs |
| EA15 | **Edition updates are migrations.** Moving a world from SRD 5.1 to 5.2.1 changes rules mid-save. | New lock revision; old instances keep the old lock unless migrated on purpose |
| EA16 | **Data-only mods.** Rule packs are JSON. Weibao or other players could load their own packs, validated and sandboxed, no code. | Public fork opportunity; the validator is the safety line |
| EA17 | **Receipt replay.** Every check stores its draw address, profile revision and modifiers. A debug tool replays any receipt and shows the same result. | Bug reports become reproducible |
| EA18 | **"Why not" explanations.** `rules.js` already returns reasons when a rule fails. | Surface them for blocked actions per profile ("in this world, magic needs a focus") |

### Dispositions, round 4

**ACCOUNT FOR NOW:**

1. A10-acc: EP1 is built as resolver families with parameters (EA1), not one resolver per rulebook.
2. A11-acc: odds come from exact calculation shared by UI, cheats and tests (EA2).
3. A12-acc: extend `power_models.js` for growth and function records before adding new modules (EX7).

**LATER / DELEGATE** (ranked; Weibao's go needed):

| Rank | Item | Suggested executor | Done check |
|---|---|---|---|
| L15 | Fold EA1-EA3 into L11's scope: two families (sum vs target, roll under) plus exact odds and one spend hook | Codex high, inside L11 | Odds shown equal computed odds; a spend changes the receipt |
| L16 | Effect DSL pilot: encode 20 SRD spells and 10 SRD monsters, report coverage | Codex high | Coverage percent with each unsupported item listing the ruling it needs |
| L17 | Importer pipeline trial on SRD conditions and one spell list (EA7) | Codex medium plus review lane | Validator rejects malformed drafts; accepted pack loads in tests |
| L18 | Combat profile note: map turn-based checks onto timed actions (EA4) | Design note, high effort | One D&D fight resolves in the existing combat loop with SRD numbers |

## Round 5: next best rulebooks and helpers, and the Codex wave

> send out codex accordingly, but consider next best set of rulebooks and whatever that can help incorproated and more? mroe to consider?

### Biggest new lever: machine-readable rules data (HD)

Parsing PDFs is the slow path. Several open projects already hold rulebook
content as structured data. Licence and repository details are from memory
and **must be verified by the R3 lane before any use**.

| Code | Source | What it holds | Why it matters |
|---|---|---|---|
| HD1 | 5e-database (5e-srd-api project, GitHub) | SRD 5.1 spells, monsters, equipment, conditions, classes as JSON | Feeds the effect DSL pilot (L16) without PDF parsing |
| HD2 | Open5e API and data | SRD plus other openly licensed 5e content | Second check against HD1; wider content |
| HD3 | Foundry VTT `dnd5e` and `pf2e` system repos | Compendium data for SRD 5e and the Pathfinder 2e remaster | Pathfinder data is ORC-licensed and very large; shows how a VTT encodes effects |
| HD4 | Archives of Nethys | Official Pathfinder 2e rules site | Reference for the PF2e profile |
| HD5 | Datasworn (GitHub) | Ironsworn and Starforged moves, oracles and assets as JSON | Feeds L3 (moves and "pay the price") directly |
| HD6 | Fate SRD, Dungeon World SRD (GitHub) | Open text of aspects, toolkit, moves, fronts | Feeds NR8, NR35 |
| HD7 | Cypher SRD (already captured) | Cypher rules text | Second resolver family check |
| HD8 | AnyDice / Troll dice math | Exact dice probability references | Ground truth for EA2 exact odds tests |
| HD9 | Foundry RollTable JSON, Perchance, Tracery | Table and grammar formats used by generator authors | Reference formats for EA8 nested tables and GR15 text |

### Next best rulebook set (NB)

Ranked by engine leverage, then priority-world fit, then cost. "Have" means
already in the library.

| Rank | Code | Set | Why next | Cost |
|---|---|---|---|---|
| 1 | NB1 | D&D SRD 5.2.1 + HD1-HD3 data | D&D is a canon-first world and the first EP1 consumer | Have / free |
| 2 | NB2 | Pathfinder 2e Remaster core (via HD3/HD4) | Second open, shippable library; downtime, earn income, crafting, kingdom rules; a contrast d20 profile | Free online |
| 3 | NB3 | Ironsworn + Datasworn, Dungeon World SRD, Fate SRD | GM-less play, fronts, aspects: the in-game GM toolkit | Have / free |
| 4 | NB4 | WWN, SWN, Godbound (have) | Tag decks, faction turns, world-changing projects | Have |
| 5 | NB5 | Savage Worlds (SWADE) + Super Powers Companion, or Cortex Prime | Published machinery for per-world rule switches | Paid, pick one |
| 6 | NB6 | GURPS Powers + Thaumatology (Basic Set have) | Precise power construction for EP4 function records | Paid |
| 7 | NB7 | Planescape (2023) | D&D's own multiverse for the D&D world | Paid |
| 8 | NB8 | Double Cross 3e, Fabula Ultima, Legend of the Wulin | Anime and cultivation power-at-a-cost for JJK/Bleach/Fate and the books | Paid |
| 9 | NB9 | Kids on Brooms | Magic school structure for the Harry Potter world (no official HP RPG) | Paid |
| 10 | NB10 | Stonetop, Ryuutama | Village and ordinary life for the life-sim north star | Paid |

NB1-NB4 cost nothing and are enough for the wave below. NB5-NB10 are a
buying decision for Weibao (L9); none blocks the wave.

### More to consider, round 5 (MC5)

| Code | Consideration |
|---|---|
| MC5-1 | Structured data still needs a ruling pass: HD1 encodes fields, not GM judgment. Each imported item gets "supported", "needs ruling" or "unsupported". |
| MC5-2 | Two sources for the same SRD content (HD1 vs HD3 vs our PDF text) will disagree on edge cases. Pick one canonical source per edition and diff the others as checks. |
| MC5-3 | Content attribution must travel with data: each record keeps source, licence and revision so a pack can generate its own notice. |
| MC5-4 | A VTT's data model (HD3) is designed for a human at a table; borrow field names and coverage, not its runtime. |
| MC5-5 | Exact odds must match what the resolver actually does, including spend hooks and rerolls. The test is "computed odds equal empirical rate over a seed sweep". |
| MC5-6 | Paid books bought later go to private research only unless their licence says otherwise. |

### Wave dispatched: rulebook-engine-2026-10-14

Authorized by "send out codex accordingly". Lanes, owners and gates are in
[the dispatch folder](gm/dispatch/rulebook-engine-2026-10-14/COMMON.md).
Six Codex lanes: R1 check resolver and odds (code), R2 effect DSL and SRD
pilot (code), R3 licences and free data acquisition (research), R4 profile and
combat design note (docs), R5 D&D rulings and SRD start (docs), R6 tag decks,
faction turns and moves from owned books (research). All outputs are
proposals; nothing merges without review and a playable consumer.


## OD16 settings versus in-world rule changes, 2026-10-15

[Accepted answer](USER_VISION.md#overarching-direction-discussion-od16-2026-10-15):
comfort settings freely changeable; difficulty/recovery changes explained and
normally prospective; actual rules can change through suitable in-world cheats
or means. This refines any earlier life-start-only wording into a possible
commitment option, not a universal mid-life restriction. Existing world-specific
storyteller/fate direction remains intact. No setting screen or engine assigned.

### ACCOUNT FOR NOW, proposed implications

- **MD1, comfort:** text size, motion, sound and other presentation/interaction
  accommodations are player facilities. Do not require the character to earn an
  ability, spend currency or discover lore to use them. Which preferences are
  browser- or save-scoped remains a technical/design choice.
- **MD2, prospective policies:** explain what changes now versus at the next
  eligible action, including any already committed activity, reward, danger or
  recovery promise affected. Do not silently reprice an already completed action
  or rewrite history by changing an ordinary mode setting. Exact treatment of
  pending commitments remains open; an explicit supported reset can differ.
- **MD3, actual rule-changing power:** specify scope, source and duration, and
  whether a cheat changes a law, grants an exception, suppresses enforcement,
  alters an observer or changes actual past history. NPC/world reactions follow
  what they can detect and do; do not universally force a punishment or announce
  a hidden power. World/means determine interactions, not a global setting wins.
- **MD4, unlock vocabulary:** learning a cheat exists, accessing it as a start
  option, acquiring it in the current life, using it and improving it can be
  separate achievements. They can also coincide where a means supplies them.
  Discovery should not imply ownership; ownership need not imply knowing all
  hidden functions. Special starts can bypass ordinary acquisition routes.
- **MD5, improvement and retention:** research/practice/insight/crafting/bargains
  can increase scope, reliability, reach, efficiency or carried capability rather
  than only numeric strength. A temporary local permission, a learned technique,
  an improved base cheat and an external artifact need not persist identically.
  OD2 memories/base cheat carry; other improvements follow their actual means.
  Exact retention, expiration and combinations remain open, with no universal tax.

An explanatory preview uses known consequences and uncertainty, not omniscient
access to sealed secrets. Actual time/identity/reality-changing cheats may revise
past states through their selected rules; this is distinct from changing a player
comfort or prospective mode preference. These implications are proposals, not a
new schema, global hierarchy of override rules, automatic NPC power or runtime
implementation. Concrete cheat design stays with its assigned discussion record.
