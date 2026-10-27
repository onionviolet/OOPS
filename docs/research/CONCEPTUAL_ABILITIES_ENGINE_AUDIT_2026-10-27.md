# Conceptual abilities and the engine (audit and proposals, 2026-10-27)

Request: [USER_VISION record](../USER_VISION.md#conceptual-abilities-and-inherent-seeding-request-record-2026-10-27).
Brief: [audit prompt](CONCEPTUAL_ABILITIES_ENGINE_AUDIT_PROMPT_2026-10-27.md), run as written, with its own closing list used as constraints.
Status: research and proposals only. Nothing here is accepted; no runtime changes.
Builds on [time travel and seeded worlds](TIME_TRAVEL_AND_SEEDED_WORLDS_2026-10-27.md) Parts C and D (DT1, TT1-TT6, K1-K9, E1-E12, C1-C12),
the [NPC absence clock record](NPC_ABSENCE_AND_REACH_OUT_2026-10-27.md#update-2026-10-27-weibaos-correction-many-clocks-scoped-to-the-life-proposals)
and [canon beats as clocks](CANON_PROTAGONIST_INTERACTIONS_2026-10-27.md#c2-a-canon-beat-is-a-clock-with-extra-fields).
Rules applied: WPR1-WPR32 (pass named, claims labelled, more-to-consider round), AR1-AR16, MR1-MR36 (saves), AD22 (limits are adjectives),
AD38 (things work by how they work), WA5 (engine owns verbs, worlds own nouns), sealed secrets (IDs only).
Tags: [S] sourced, [S-snip] sourced from a search-result snippet only, [U] unverified memory, [I] inference.
Codes in this file use the prefix `CAE-` because the short prefixes (C, CA, CC, E, K, IL, A) are taken elsewhere.

## Short answer

A conceptual ability is an **operation on one channel of a thing**, scoped to an audience, timed, priced, and stored as a **delta over
the seeded base**. Erasing a name masks the *reference* channel; the body and its effects stay; records and memories follow only by
authored dials; a residue fact remains. The repo already has two thirds of this: stable actor ids, an observer list on story receipts
(`lore_history_state.js:66-72`, `audience` and `known`), reference pinning (`historyPins`, `:11-19`), and a seeded name grammar that is
pure in (seed, key) (`name_grammar.js:11-20`). What breaks it today is narrower and fixable:

1. **Names are baked into prose when written** (`npc_lives.js:15`, `chronicle.js:320,326`). A mask cannot reach a string that already says the name.
2. **Facts have no observer** (`expansion_engine.js:451`, `factsFor`), so "who knows" cannot be asked of the main rule evaluator.
3. **Some derivations consume an entity** (family tree, world history factions), so a *total* retroactive erasure is a new world line, not a mask.
4. **Some targets are not entities** (distance between places, a law, luck on a draw), so the channel model needs three non-entity target kinds.

Top three recommendations are at the end.

---

## Part A. Repo reality

Locators checked 2026-10-27 on `1b9a035af`'s tree.

### A1. Where identity lives today

| Row | What | Locator | Shape | Note [I] |
|---|---|---|---|---|
| CAE-A1 | Stable actor ids for relationships | `chronicle.js:64` `relationshipChange(c, actorId, …)`; validation of ids `:36-39` | Keyed by id (`villageElder`), up to 64 owners, 32 memories each | Good: the bond is on the id, not on the name |
| CAE-A2 | Chronicle log and lived notes | `chronicle.js:74` `note()` | `{at, text}` free prose, last 40 kept | Prose embeds names at write time |
| CAE-A3 | Graves and heirs | `chronicle.js:311-342` `createHeirChronicle`; `lifeGrave` from `life_experience.js`; grave validated `:26` | `grave.name` string, `ties.rememberedPredecessor = grave.name` (`:320`), note text with `${grave.name}` (`:326`) | The tie stores a *name*, not an id. Breaks reference masking |
| CAE-A4 | Village family lives | `npc_lives.js:10-29` | `{id, name, birthYear, deathYear, parents, spouseId}`; events carry prebuilt `text` with the name (`:15,21,24,26,57`) | Ids for parents (good); news text is baked (bad) |
| CAE-A5 | Generated travelers | `generated_people.js:15-34` | `id: traveler_${i+1}` (array index), name from `generatePersonName` fed a **cursor** draw (`:24`) | Index ids and cursor seed: the first migration target (CAE-P8) |
| CAE-A6 | Name grammar | `name_grammar.js:11-20` (people), `:22+` (things, places) | Pure in `(seed, key)`, returns `grammarRevision`; "saved names win over grammar edits" | Already the target shape for inherent seeding |
| CAE-A7 | Facts | `expansion_engine.js:451-458` `factsFor(state, context)` | Merges campaign, journey, world, actor, scenario facts into one flat map | No observer argument (AR8 gap) |
| CAE-A8 | Knowledge | `chronicle.js:35` `c.knowledge` booleans | Per-life, per-key | Knowledge is the character's; no "who else knows" |
| CAE-A9 | Story receipts | `lore_history_state.js:41-73` | Each receipt has `targetPerson`, `targetObject`, `targetPlace`, `audience` (discoveredBy), `known.{person,item,label}`, `causeRefs`, `historyCauses` | **The pattern to generalize**: a record with an audience and a per-receipt "what was known" |
| CAE-A10 | Reference pinning | `lore_history_state.js:11-19` `historyPins` | Receipts referenced by open events, causes or request callbacks are never evicted | A working "no dangling reference" rule |
| CAE-A11 | Carry ledger | `carry_ledger.js:5-6,35-47` | Scopes this/last/any life; boundaries death, rebirth, world crossing | No `time travel` boundary yet (KN1) |
| CAE-A12 | Display names | 15 scattered `displayName`/`nameOf`-style hits in `src/`, no single resolver found [I] | Each consumer reads `.name` | No one authority for "how is X named" (AR3) |

Owner docs that already model parts of identity, which this audit extends rather than replaces:
[CHEAT_COSMOLOGY "Names as an axis" (A1)](../CHEAT_COSMOLOGY.md#names-as-an-axis-a1-proposal) (name kinds and operations),
[RIVALS identity stack](../RIVALS_IDENTITIES_AND_FATE.md#what-chosen-and-identity-actually-mean) (ten identity layers, observer-owned belief),
[IDENTITY_LAWS IL29](../worlds/IDENTITY_LAWS_BY_WORLD_2026-10-14.md#minimal-engine-shape-for-a-wc-start) (`lawRef`, `operations`, `recognitionRules`),
[ABILITY_AUTHORING causal execution contract and conceptual contract](../worlds/ABILITY_AUTHORING.md#causal-execution-contract),
[DEEP_CONCEPTS implication test T1-T10](../DEEP_CONCEPTS.md#the-implication-test).

### A2. Where effects live today

| Row | What | Locator | Note [I] |
|---|---|---|---|
| CAE-A13 | Timed stat effects | `active_effects.js:9-40` `ActiveEffect` (stats, tags, `group_tags`, potency) | Removal and precedence are a todo (`:34`). Effects are on stats, never on identity |
| CAE-A14 | Cheat actions | `cheat_mechanisms.js:51-125` `planCheatAction` then `executeCheatAction({capture, commit, publish})` | Quote, commit, publish: already the AR7 shape a conceptual op needs |
| CAE-A15 | LOTM abilities | `book_world_lotm_abilities.js:16-40` | Conditions with `stacking:'max'`, `look` with `concealed` and `seenBy`; perception abilities write notes. The `seenBy` field is a second observer pattern |
| CAE-A16 | Storylet outcomes | `lore_history_state.js:53-73` `appliedStoryDeltas` | "Observe actual resolved native snapshot deltas, never infer them from prose" (`:52`): the right rule for residue too |
| CAE-A17 | World events and history | `lore_history_state.js:110-179` `deriveWorldHistory` | Derived by rule from a faction list and keyed draws; an entity in that list is *consumed* by the derivation |
| CAE-A18 | Existing conceptual mechanics in runtime | grep of `src/` for erase/forget/true name/honorific/oath/fate | No runtime mechanic targets a name, record or memory. "Seal" and "fate" hits are item seals, sealed-secret plumbing and opportunity labels |

### A3. Base versus delta

Using the time travel report's split (D1, G1-G17): **pure derivations** are names from the grammar (G-name, `name_grammar.js`), village lifespans
(G2), life events (G3), weather (G7), mixtures (G12) and starts (G13). **Saved state** is the chronicle (G14), generated travelers (G1),
story receipts (G15), relics (G11). A conceptual op attaches as follows (CAE-P2):

- To a pure derivation: as a delta keyed by the entity id the derivation produces. The base still produces the entity; the view applies the mask.
- To saved state: as a delta keyed by the same id, never by editing the saved record. The saved record is the base for that entity.
- To prose already written: it cannot attach. See CAE-F1.

### A4. Blast radius and where the model breaks (findings)

Consumers of one person's identity in the Village today (read from the locators above): their family row and parents' links, news events,
the chronicle log, relationships keyed by id, story receipts (`targetPerson`, `known.person`), historyPins, heir ties and notes, generated-people views,
and every UI that prints `.name`. Erasing one name touches about ten consumers, three of which store it as text.

| Code | Finding | Evidence | Consequence |
|---|---|---|---|
| CAE-F1 | **Prose bakes the name at write time** | `npc_lives.js:15,21,24,26,57`; `chronicle.js:320,326`; `note()` `:74` | A reference mask cannot change old text. Default: treat baked text as the *record* channel (a written thing still says the name unless an op targets records). New text stores `{ref}` tokens and renders through one resolver |
| CAE-F2 | **Heir tie stores a name, not an id** | `chronicle.js:320` `rememberedPredecessor: grave.name` | Renaming or erasing the predecessor desyncs the tie. Store the life id plus a frozen display snapshot |
| CAE-F3 | **No observer on facts** | `expansion_engine.js:451` | "Does this character know X's name" must be its own query, not a flat fact. Add an observer-scoped read beside `factsFor`, do not change it |
| CAE-F4 | **Derivations consume entities** | `npc_lives.js:10-29` (parents, spouse links), `lore_history_state.js:150` (faction list) | A *total* retroactive erasure would change derived descendants and history. Default: retroactive-total on a consumed entity is a TT4 branch (new world line); a mask covers views and leaves residue |
| CAE-F5 | **Non-entity targets** | Distance (a relation between places), a law (IL29 `lawRef`), luck on a draw (DT1/E3) | Add three target kinds: *relation*, *law*, *draw threshold*. Luck must shift a threshold after the keyed draw, never reseed |
| CAE-F6 | **Two observer patterns already exist** | `lore_history_state.js:68` `audience`; `book_world_lotm_abilities.js` `look.seenBy` | Generalize, do not invent a third |
| CAE-F7 | **Effect precedence undefined** | `active_effects.js:34` todo | Two conceptual effects on one thing need a stated order (CAE-P3) |
| CAE-F8 | **Index ids** | `generated_people.js:23` `traveler_${i+1}` | A mask keyed by an index id points at a different person after regeneration. Stable keyed ids (K1, A8) are a precondition |

---

## Part B. How other works implement concept-level powers

Readers: two bounded haiku lanes (14 calls each), plus one coordinator search. Many batch-2 [S] tags rest on search snippets and are
marked [S-snip]. Paraphrased; no long quotes. Fields: what it targets, what it leaves, reversibility, contradictions, limits, how rules stay checkable.

| Work | Targets | Leaves behind | Reversal | Contradictions | Limits | Checkable by |
|---|---|---|---|---|---|---|
| Fullmetal Alchemist ([wiki](https://en.wikipedia.org/wiki/Fullmetal_Alchemist)) | Matter; a soul bound to an object | The toll taken by Truth (a body part tied to what the alchemist valued) [S] | Tolls not restored in the summary read [S] | One law, equivalent exchange [S] | Philosopher's stone made from souls for human transmutation [S] | Summing inputs and outputs [S]. Blood-seal rules unread [U] |
| Earthsea ([wiki](https://en.wikipedia.org/wiki/A_Wizard_of_Earthsea)) | The true name | Trust: telling your name gives power over you [S] | Not stated [U] | Beings who live openly with a name are not bound by it [S] | Must know or guess the name; guessing a dragon's is a life gamble [S] | Knowledge of the name is the whole gate [I] |
| Jujutsu Kaisen ([wiki](https://en.wikipedia.org/wiki/Jujutsu_Kaisen)) | Cursed energy; domain seals target and makes techniques hit [S] | Not stated | Not stated | Not stated | Binding vows (self-imposed limits for power) [U] | Technique rules per user [U] |
| JoJo Part 5 ([wiki](https://en.wikipedia.org/wiki/JoJo%27s_Bizarre_Adventure:_Golden_Wind)) | King Crimson erases a span of time; Requiem returns an action to its start [S] | The affected do not remember the gap; counting blood drops measures it [S] | Requiem undoes King Crimson's effect [S] | Requiem cancels the erasure by acting earlier [S] | Not stated | Event sequence, not formal rules [S]. Fits an order-of-effects stack [I] |
| Bleach, Aizen ([wiki](https://en.wikipedia.org/wiki/S%C5%8Dsuke_Aizen)) | Perception of all who saw the release [S] | False images until released [S] | Touching the blade beforehand exempts [S] | Not stated | A precondition (must have seen it once) [S] | A per-observer flag set by a past event [I] |
| A Certain Magical Index ([wiki](https://en.wikipedia.org/wiki/A_Certain_Magical_Index)) | Supernatural effects on touch [S] | Also negates the holder's luck [S] | Not stated | Not stated | Touch only [S] | Counter by target kind [I]. "Authority" unread |
| Type-Moon ([Kara no Kyoukai](https://en.wikipedia.org/wiki/Kara_no_Ky%C5%8Dkai)) | Death perception named as a fundamental concept [S]; lines of death [U] | Not stated | Not stated | Root and Counter Force named as concepts [S] | Not stated | Gae Bolg reversed causality [U] |
| Mushishi ([wiki](https://en.wikipedia.org/wiki/Mushishi)) | Mushi as primitive life most cannot perceive [S] | Illness-like phenomena [S] | Ginko treats them case by case [S] | Not stated | A tobacco wards them [S] | Each mushi is one folklore rule [I]. Memory-eating episodes unread |
| Magic: The Gathering ([mtg.wiki Layer](https://mtg.wiki/page/Layer), [WotC 2021 CR changes](https://magic.wizards.com/en/news/announcements/comprehensive-rules-changes-2021-11-10)) | Object characteristics | n/a | Effects end by duration | Layers in fixed order: copy, control, text, type (613.1a-d) [S-snip]; then color, abilities, power/toughness [U]. Within a layer, timestamp order (613.7) unless a dependency (613.8) [S-snip] | Targeting rules (hexproof, shroud), exile as a zone change [U] | A published, total order. **The model for CAE-P3** |
| Madoka Magica (batch 1 note) | A person's existence, retroactively [S] | One rememberer keeps her [S] | No | The new law replaces the old [S] | The wish's cost | Lone-rememberer is a scope, not a special case [I] |
| Doctor Who, crack in time | A person erased from history [U] | Others feel a gap; a lover is restored by remembering [U] | Yes, by memory [U] | n/a | n/a | Memory as the restoration channel [I] |
| Dwarf Fortress ([historical figure](https://dwarffortresswiki.org/index.php/DF2014:Historical_figure), [Legends](https://dwarffortresswiki.org/index.php/Legend)) | Historical figures, linked records [S-snip] | Legends mode shows every figure [S-snip] | Generated history is read-only after world gen [U] | n/a | n/a | Records with ids and links. Name and epithet rules unread |
| Caves of Qud ([Sultan](https://wiki.cavesofqud.com/wiki/Sultan), [wiki](https://en.wikipedia.org/wiki/Caves_of_Qud)) | Generated sultans' histories [S-snip] | Statues, engravings, cults as factions [S-snip] | n/a | Accounts can be biased and disagree [S-snip] | n/a | **Records as observer-authored claims**, not truth. Amnesia mutation unread |
| Disco Elysium ([Thoughts](https://discoelysium.wiki.gg/wiki/Thoughts), [wiki](https://en.wikipedia.org/wiki/Disco_Elysium)) | A thought (an idea the character holds) [S-snip] | Bonus stays while held [S-snip] | Forget a completed thought for a skill point; bonus leaves [S-snip] | n/a | Slot cap, research timer while awake [S-snip] | Each thought is a record with state, timer, effect [I] |
| Planescape: Torment (repo [REPORT](planescape-torment/REPORT.md)) | Name, memory, mortality of one immortal [U, repo report] | Past selves and their deeds persist in the world [U] | Recovering the true name opens a later route (repo REPORT:22) | Past incarnations act as separate people [U] | n/a | Repo's own audit is the source; web unread |
| Pillars of Eternity ([fanlore](https://fanlore.org/wiki/Pillars_of_Eternity), [Deadfire](https://en.wikipedia.org/wiki/Pillars_of_Eternity_II:_Deadfire)) | Souls; a Watcher reads past lives [S-snip] | Hollowborn: soulless births [S-snip] | A god restores the Watcher's soul for service [S-snip] | Sources disagree on Hollowborn cause [S-snip] | n/a | Soul state per character [I] |
| Undertale (fan sources, [Steam](https://steamcommunity.com/app/391540/discussions/0/496880203072672213)) | The save and reset itself [S-snip] | Some characters remember resets [S-snip, fan] | Reset is the mechanic | Fans dispute who remembers [S-snip] | n/a | Persistent flags outside the save slot [U] |
| Hades | Run resets [U] | NPCs remember runs [U] | n/a | n/a | n/a | Persistent dialogue flags [U]. Not searched |
| Dark Souls ([DS2 Hollowing](https://darksouls2.wiki.gg/wiki/Hollowing)) | The self, as hollowing per death [S-snip] | Max HP loss, capped at half (DS2) [S-snip] | An effigy reverses it [S-snip] | n/a | Hollow cannot summon (DS1) [S-snip] | A numeric level [S-snip]. Name loss unread |
| Hollow Knight ([Moth Tribe](https://hollowknight.wiki/w/Moth_Tribe), [Radiance](https://hollowknight.wiki/w/The_Radiance)) | A god's place in memory [S-snip] | A surviving statue [S-snip]; suppressed memory returns as an infection [S-snip] | A confession ends the forgetting [S-snip] | n/a | Sealed in a vessel [S-snip] | **Correction to the brief:** the moths chose to forget her; she was not erased by a power [S-snip] |
| Outer Wilds ([Steam](https://steamcommunity.com/app/753640/discussions/0/3126037522476271572)) | Nothing but knowledge carries [S-snip] | Ship log [S-snip] | Loop resets the world [S-snip] | n/a | 22-minute loop [S-snip] | A list of discovered facts [S-snip]. Developer sources unread |
| Crusader Kings III | Not reached | Historical damnatio memoriae removed names and images from monuments [S-snip, catalogue entry] | n/a | n/a | n/a | Game mechanics unread |
| Dominions ([Dom3 wiki](https://en.wikipedia.org/wiki/Dominions_3:_The_Awakening), [Dominion page](https://strategywiki.org/wiki/Dominions_3:_The_Awakening/God_Design/Dominion)) | A province's dominion and global enchantments [S-snip] | Scales set climate, luck, magic, events [S-snip] | Drive out enemy dominion first [S-snip] | Dominions cannot overlap [S-snip] | Scope rules per enchantment [S-snip] | Data-driven scales; manual cites Ars Magica as inspiration [S-snip] |
| RimWorld ([Royalty](https://rimworldwiki.com/wiki/Royalty)) | A pawn's mind and social state [S-snip] | Hediffs such as neural heat [S-snip] | [U] | n/a | Heat and focus [U] | Abilities and hediffs as data [U] |
| Ars Magica (forum, [Arcane Connection](https://forum.atlas-games.com/t/explain-arcane-connection-simply/10255)) | A link to a distant target [S-snip, fan] | n/a | n/a | A true name is not the same as a sympathetic link [S-snip, fan] | Magic resistance as a sum [S-snip, fan] | Penetration versus resistance is arithmetic [I] |
| Mage: The Ascension ([coincidental](https://whitewolf.fandom.com/wiki/Coincidental_magic), [vulgar](https://whitewolf.fandom.com/wiki/Vulgar_magic)) | The consensus reality [S-snip] | Paradox from vulgar acts [S-snip] | n/a | The local consensus decides; a hypothetical average bystander test (M20) [S-snip] | Paradox | **Witnesses decide the cost**: an observer-scoped price [I] |
| Lord of the Mysteries ([Klein](https://lordofthemysteries.fandom.com/wiki/Klein_Moretti)); repo [CHEAT_COSMOLOGY:990](../CHEAT_COSMOLOGY.md#names-as-an-axis-a1-proposal) | An honorific name as a handle [repo] | Fog distorts identity and protects lower sequences [S-snip, fan] | n/a | n/a | n/a | Recitation reaches the bearer [repo, public franchise mechanic]. The exact perception rule unread |

**Patterns the table supports [I]:**
- **Handle versus thing.** Earthsea, LOTM honorifics and Ars Magica split the *name or link* from the *being*. Power over the handle is not power over the body.
- **Residue is the norm.** King Crimson (blood drops), Hollow Knight (statue, returning infection), Doctor Who (felt gap), Madoka (one rememberer). Total, traceless erasure appears only as a world's top-rung act.
- **Who remembers is a scope.** Madoka's one rememberer, Undertale's some-remember, Aizen's saw-it-once: all are observer sets, not special cases.
- **Retroactive versus prospective.** King Crimson and Madoka are retroactive; Imagine Breaker and Disco Elysium's forgetting are prospective. Retroactive ones always pay more or leave more.
- **Order is published.** MTG's layers and timestamps are the only fully checkable system read here. Fiction leaves order to the author, which is exactly what ABILITY_AUTHORING warns against ("do not choose whichever order helps the current plot").
- **Records are claims.** Qud's biased histories and damnatio memoriae: a record says something; it is not the truth, and it can be edited separately from memory.
- **Contradiction with a project idea (unbiased lens):** most fiction here has *no* reversal rule. Our default of reversible deltas is a design choice for saves and time travel, not something the sources show.

**Unreached or thin (named per WPR):** Earthsea Old Speech; JJK binding vows and disclosure; Bleach's Almighty; Toaru "Authority";
Gae Bolg and death-perception mechanics; Mushishi memory or sound eaters; MTG 613.1e-g and 613.8 full text (403 on mtg.wiki fetch, snippets only);
Doctor Who (not fetched); Hades and Planescape web sources (not searched; repo report used for Planescape); DF epithets; Qud Amnesia;
CK3 mechanics; Dominions "forgotten" effects; RimWorld mind effects and heat; Ars Magica Mentem; LOTM name-perception rule; Outer Wilds developer sources.

---

## Part C. Proposals

Default, dial, reason throughout. None accepted. No permission list: whether a method works is decided by its mechanism (AD38); the
model only says *which channel* a mechanism touches and *how the change is stored*.

### C0. Crosswalk to existing owners (CAE-P0)

| This audit | Existing owner | Mapping |
|---|---|---|
| Reference channel and its handles | CHEAT_COSMOLOGY A1 name kinds | Registered, given, true, honorific, remembered, magic, hidden become **handles** on the reference channel. "Remembered" lives in the memory channel, which is why Gluttony-style eating needs no body contact |
| Operations | CHEAT_COSMOLOGY A1 ops | read, give, eat, force, recite, change, hide, restore map onto the delta kinds in CAE-P6 (read = no delta; give/change = rewrite; eat/hide = mask; force = bind; restore = remove delta) |
| Channels | RIVALS identity stack | Stable id = the entity; appearance/alias, credential, office, faction, legend, label = handles and claims; body = existence; soul/true name = a handle with custody; fate/mandate = claim |
| World's law | IL29 `lawRef`, `recognitionRules` | A world's channel list (CAE-P1 table) is part of its law record. IL29's `operations` column uses allowed/forbidden; this audit reads it as *what the world's mechanisms reach*, not a permission list (AD38) |
| Phases | ABILITY_AUTHORING causal execution | Eligibility, preview, commitment, resolution, observation, aftermath, recovery supply the card fields: cost at commitment, scope at observation, reversal at recovery |
| Edge questions | DEEP_CONCEPTS T1-T10 | Run on every card; the "breaks at" line is the T9 answer |

### C1. The channel model (CAE-P1)

**Entity channels.** One entity (person, item, place, organization) has separable channels:

| Channel | What it holds | Today's owner |
|---|---|---|
| existence | body or object, location, alive/dead | world state, `npc_lives`, inventory |
| reference | the handles that point at it (names of each kind, ids, epithets) | scattered `.name` (CAE-A12) |
| record | written traces: chronicle, graves, receipts, documents, registers | chronicle, lore history, graves |
| memory | who knows it, per observer | `c.knowledge` (self), receipt `audience`, `seenBy` |
| effects | what it causes: abilities, conditions, ongoing work | active effects, cheat state |
| relations | bonds to other entities | `relationships`, family links, bonds |
| claim | ownership, office, duty, debt, fate eligibility | inventory custody, obligations, debts |

**Non-entity targets (CAE-F5).** *Relation* (place to place: distance, route, adjacency), *law* (an IL29 rule row in a world instance),
*draw threshold* (the cut-off a keyed draw is compared against). Each takes the same op shape.

**An operation** is `{op, target, channels[], scope, timing, duration, cost, residue, reversal, source}`:
- `scope`: who perceives the change: the world (all observers), a named set, everyone except a set, only the wielder, only the target.
- `timing`: *prospective* (from now on), *retroactive with residue* (the past reads differently, a residue fact explains the seam), *retroactive total* (no residue; see the dial below).
- `duration`: until reversed, for a span, while a condition holds, or permanent within this world instance.
- `cost`: paid at commitment (ABILITY_AUTHORING); adjectives, not counts.
- `residue`: a fact written by the op (`gap:<entityId>`) that consumers can read and render ("someone used to sit here").
- `reversal`: what removes the delta (a ritual, a memory, the wielder's death, a rewind before the op).

**Worked: erase a name.**
1. `op: mask`, `target: person:maia`, `channels: [reference]`, `scope: world`, `timing: retroactive-with-residue`.
2. Body and effects stay: Maia still lives, still works, still causes things. Her bonds stay on her id.
3. Dials, authored per world or per ability: *propagate to records* (graves and documents read as blank; default **no**, records keep the name because ink does not forget, AD38), *propagate to memory* (observers lose the handle; default **yes for the scope**, since that is what "erase a name" means), *who keeps it* (the wielder by default; the target too in a world where self-knowledge is a channel).
4. Residue: `gap:person:maia` fact. The resolver renders her as "someone" or a world's residue text. People feel a gap; a record that still says "Maia" becomes an inconsistency a curious life can follow (a discovery route, not a bug).
5. Undo: remove the delta. The base was never touched.

**Residue default.** Erasure leaves residue by default. "No residue" is a dial with a heavy cost and a reason in the world's mechanism, because
traceless erasure breaks cause and effect (AD38). Reason: every source in Part B that erases something leaves a trace or a rememberer.

**Per-world channel emphasis (brief constraint: lists per world, not per ability).**

| World | Channels that carry weight | Why [I unless marked] |
|---|---|---|
| Village (variant) | record, relations, claim | An elder keeps archive duty (`chronicle.js:132,138`), graves and heirs are records, debts settle through the estate (`chronicle.js:336-337`). Names matter mostly as they appear in records and bonds |
| Proto23 (credited port) | existence, effects | Faithful build; no source mechanism touches names or records. Nothing is added to the faithful build |
| YAIR (faithful baseline) | existence, effects, claim (inventory) | Faithful build; nothing is added. Conceptual ops arrive only through a crossing or cheat (cards K3, K4) |
| LOTM (Tingen) | reference (honorific handles), memory, effects | Honorific names reach their bearer when recited (repo CHEAT_COSMOLOGY:990, public franchise mechanic); perception and concealment (`look.seenBy`) |
| HP | reference (spoken names as triggers), memory, relation (concealed places), claim (vows) | Public franchise mechanics [U]: memory charms, a secret-keeper concealment, spoken-name detection, magically bound promises |

### C2. Seeded-base compatibility (CAE-P2)

**Default.** The entity exists in the regenerable base (keyed by DT1 and K1-K9). The ability is a logged delta in the existing proposed
`timeDeltas` slice, extended with entity-scoped rows: `{kind: 'mask'|'rewrite'|'seal'|'swap'|'bind', target, channels, scope, timing, at, by, opId, residue, reversal}`.
The view is `resolve(base(entity), deltas(entity, observer))`.

- **Revisit and rewind.** A rewind restores the delta log with the snapshot (SI3), so a rewind to before the erasure shows the name; after it, the mask applies.
- **Branch (TT4).** Copies the delta log to the fork point. Retroactive-total on a consumed entity (CAE-F4) forks by default.
- **Un-erasing** is deleting the delta. The base and its seed never change, which keeps the seed honest.
- **What a rewind carries** (KN1 time-travel boundary): the wielder's knowledge of the original name, by default (knowledge always carries, TT rules).
  The delta itself does not carry unless the kind says the effect is anchored outside time (a world's top-rung dial).
- **Retroactive effects touch the delta log, never the base** (brief constraint). A retroactive op writes a delta whose `timing` tells the resolver to apply it to past views too.

### C3. Resolution order (CAE-P3)

Like MTG's layers, a fixed published order, so two effects on one thing are deterministic.

| Layer | What applies | Example |
|---|---|---|
| L0 base | The seeded or saved entity | Maia, from the family tree |
| L1 authored rewrites | World and story facts that change identity on purpose (a marriage name, an office title) | "Maia of the Weir" after joining a household |
| L2 swaps | Exchange of a channel between two entities | Two people swap names or luck |
| L3 rewrites by ability | An op that replaces a channel value | A record rewritten to say another name |
| L4 masks | An op that hides a channel from a scope | Name erased for the world |
| L5 seals and binds | Ops that freeze a channel or attach a condition | An oath that forbids speaking a name; a sealed place |
| L6 observer filter | Per-viewer projection (CAE-P4) | What this character, and the player, are shown |

- **Within a layer:** timestamp order (`at`, then `opId`), unless one op depends on another (it reads or changes the channel the other writes); then the depended-on op applies first. This copies MTG 613.7/613.8 [S-snip] in shape.
- **Conflict rule:** two masks with different scopes union; a mask over a rewrite hides the rewritten value; a *restore* removes the specific delta it names, never "all masks".
- **Counters work for their actual reason** (ABILITY_AUTHORING): a power that cancels supernatural effects on touch removes the deltas whose `source` is supernatural on the touched entity, not a layer wholesale.
- **Test:** shuffle the op list and assert the resolved view is identical (order comes from the rule, not from arrival).

### C4. Observer model (CAE-P4)

Three views, each a projection (AR8): **world** (what the world state holds after L0-L5), **character** (what one observer knows: the world view filtered by that observer's memory and the op scopes), **player** (the character view plus UI-safe residue; never a sealed truth).

- **One resolver**, `refOf(entityId, observerId) -> {label, handle, known, residue}`. Every consumer reads it; none reads `.name` directly once migrated.
- **Fallback:** an erased or unknown reference renders a world's residue text ("someone", "a name you can't hold", a blank in a ledger) and never throws. A dangling id renders "unknown" and logs a validation warning in tests.
- **Facts:** add `factsFor(state, context, observer)` as a separate read beside the current one (CAE-F3), with knowledge facts scoped by observer. The existing call stays unchanged.
- **Receipts:** generalize CAE-A9: every new record row stores `{ref}` tokens plus `audience`. Rendering resolves tokens per viewer.
- **Sealed secrets:** the player view never carries a sealed truth; a mask whose route is sealed shows only its residue, by ID and status in logs.

### C5. Per-ability cards (CAE-P5)

Twelve cards: at least two per world, and two awkward ones per world tested against the model, with a **breaks at** line. "No new verb"
means the card runs on CAE-P6's five delta kinds plus existing commands. Sealed content is referred to by route only.

| Card | World | Ability (original framing) | Target channels | Scope | Timing | Cost (adjective) | Residue | Reversal | Resistance | Seeded-base interaction | Tests | New verb? | Breaks at |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CAE-K1 | Village | **A name struck from the archive.** The elder's archive is a record; striking an entry hides a person from records | record | Readers of the archive | Prospective, with old copies still existing | A favor owed to the archivist | A torn page fact | Re-entering the name by a witness | Other copies (graves, heirs' notes) | Mask on record channel of a base person | Struck name absent from archive view; grave still shows it | No | Baked prose (CAE-F1): old news lines still say the name. Accepted: they are other records |
| CAE-K2 | Village | **A debt forgiven by fate.** A festival custom says a debt dies with a forgiven oath | claim | The creditor and the guard | Prospective | Standing with the creditor | Debt row marked forgiven with cause | None once the oath is kept | Creditor may dispute | Delta on claim; the estate settles nothing for it (`chronicle.js:336-337`) | Heir inherits no debt; receipt names cause | No | Fine. Test of AD38: works because the custom is a mechanism in the world, not a flag |
| CAE-K3 | Proto23 | **A borrowed skill from a crossing cheat.** A cheat carried in from another world lends a skill for a span | effects | Holder | Prospective | The cheat's charge | Skill leaves a practice trace | Ends with the span | None in source | Delta on the holder's effects; Proto23 data untouched | Skill gone after span; Proto23 save keys unchanged | No | Proto23 data has no channel fields. Model holds only if the resolver falls back to plain `.name` and existing effects |
| CAE-K4 | Proto23 | **Erase an enemy's name before a fight.** | reference | Holder | Prospective | Charge | Enemy shown as "something" | Fight ends | None | Mask on a bestiary entity; bestiary counts use names (RIVALS:43) | Kill still counts once | No | **Breaks:** bestiary counts are keyed by name string. A mask must not split one enemy into two kinds; needs the stable-id rule first |
| CAE-K5 | YAIR | **Luck swap.** Swap fortune with a target for a day | draw threshold | Both | Prospective | Heavy | A "the dice feel wrong" condition | Day ends | Target's own protection | Shifts the threshold applied to keyed draws; never reseeds (DT1, E3) | Same seed and day: base roll identical, outcome differs only by threshold | No | Holds only for keyed draws. Cursor-drawn ambient content (G1, G6, G8) cannot be shifted without changing other systems' rolls |
| CAE-K6 | YAIR | **A place forgotten.** A crossing cheat makes a shop forgotten by the town | memory, relation (route) | Town except the wielder | Retroactive with residue | Heavy | "A shuttered door no one mentions" | Someone who remembers leads another back | None | Mask on the shop's memory channel; stock still generated by K3 key | Shop absent from town talk; wielder can still trade | No | Faithful build has one global shop list. Hiding a place from a route needs the *relation* target kind (CAE-F5) |
| CAE-K7 | LOTM | **Recite an honorific to reach its bearer.** | reference (honorific handle) | The bearer, and anything else that answers to the same words | Prospective | The risk of who answers | The bearer knows you called | n/a | Concealment (fog-like distortion) | Bind delta: recitation event addresses a handle, resolved to whoever holds it | A recited handle resolves to the holder; a world without the bearer resolves to "nobody" or another answerer | No | Holds. The handle, not the name string, is what resolves. Sealed bearers stay by route ID |
| CAE-K8 | LOTM | **A record rewritten.** A divination-adjacent act makes a police report say something else | record | Readers of the report | Retroactive with residue | Strain and later scrutiny | An investigator's unease | An original copy | Higher-sequence observers | Rewrite delta on a record entity | Report reads the new text; the original exists in a sealed copy route | No | Holds; cost and investigation are the limit (AD22). Breaks only if records are not entities |
| CAE-K9 | LOTM | **A death undone.** An authored ritual restores a life | existence, relations | World | Retroactive with residue | Very heavy, a named price | Mourning already happened (G3 events) | n/a | n/a | Remove the `dead` delta (D2) on a base entity | Revisit after: alive; mourning receipts remain | No | **Breaks** for a death the base derives (`npc_lives` deathYear). Undoing a *base* death is an L1 authored rewrite, not a delta removal; needs care in order |
| CAE-K10 | HP | **A memory charm.** Remove one fact from one person's memory | memory | One observer | Prospective in them | Spell skill | They feel a gap | Strong magic or a trigger | Mental defenses | Mask on one observer's memory row | That observer's view lacks the fact; others keep it | No | Holds. Needs per-observer memory rows for NPCs, which only receipts have today |
| CAE-K11 | HP | **A secret-keeper concealment.** A place knowable only through its keeper | relation, memory | Everyone except those told | Prospective | Ritual | People walk past | Keeper tells, or dies (a dial) | None | Seal delta on the place's reference and route | Untold observer cannot resolve the place; told one can | No | Holds with the relation kind. The "keeper dies" dial is a claim channel on the keeper |
| CAE-K12 | HP | **A name that detects whoever says it.** | reference (a spoken handle) | The caster's side | Prospective | Ongoing upkeep | Speakers are found | Lifting the spell | Not saying it | Bind delta on a handle: speech events with that handle emit a detection fact | A storylet line that uses the handle fires the detection | **Yes**: a speech or recital event. Small; shares the recital event with K7 |
| CAE-K13 | Cross-world | **An oath that binds.** A promise that costs if broken | claim, effects | Swearer and witness | Prospective | Weight of the oath | Broken-oath mark | Release by the other party | n/a | Bind delta; clock record (NPC absence C1) for its deadline | Breaking applies the cost once | No | Holds; binds plus clocks |
| CAE-K14 | Cross-world | **A distance folded.** Two places become one step apart | relation | World or the wielder | Prospective | Heavy | The road "feels short" | Ends | Places with wards | Rewrite on a place-to-place relation | Travel time between the pair drops; base map unchanged | No, with the relation target | **Breaks** without CAE-F5: a distance is not an entity |
| CAE-K15 | Cross-world | **A concept denied.** A world's rule stops applying in a zone | law | Zone | Prospective | Very heavy | The zone feels wrong | Ends | Other laws | Mask on an IL29 law row, scoped to place | Inside the zone, the rule's check is skipped; outside unchanged | No, with the law target | **Breaks** if a law is code rather than a data row; only data laws can be masked |

**Verdict on the model [I].** It holds for name, record, memory, claim, oath, and honorific cases with five delta kinds. It breaks at
four points: baked prose (K1), name-keyed counts (K4), cursor-drawn content under luck (K5), and base-derived facts (K9). Three more need
the non-entity targets (K6, K14, K15). One card needs a new small verb (K12, a speech or recital event).

### C6. Engine implications (CAE-P6)

| Item | Proposal | Owner |
|---|---|---|
| Reference resolution service | `refOf(entityId, observerId)`, one authority for how a thing is named and known; consumers migrate when touched | AR3, AR8 |
| Delta kinds | `mask`, `rewrite`, `seal`, `swap`, `bind`; each names channels, scope, timing, residue, reversal | AR3, AR12 (kinds in engine, meanings in worlds, WA5) |
| Save slice | Additive entity rows in the proposed `timeDeltas` (or a sibling `conceptDeltas` slice if the time-travel slice is not built first); absent = empty | AR6, MR saves |
| Validation | No delta targets a missing id; no bond points at a fully erased entity without residue; every `{ref}` token resolves or falls back | AR6 |
| Projections | World, character and player views as read models; never write | AR8 |
| Headless hooks | `resolveEntity(save, id, observer)` and `applyOps(base, ops)` as pure functions | AR10, AR16 |
| Cost | Ops quote first, then revalidate at commit (the cheat pipeline already does this) | AR7 |
| Import | Imports deltas verbatim, never re-resolves the base; an unknown delta kind is kept and shown as an inert notice | AR6, E6 |

**Property test (brief constraint):** apply a random op set, save, reload, Export, Import; assert no dangling references, identical resolved views,
and that removing every delta restores the base view byte-for-byte.

**Ordered changes (smallest first).**

| Order | Change | Level | Effort | Done check |
|---|---|---|---|---|
| CAE-E1 | `{ref}` tokens for *new* chronicle notes and life events, rendered through a resolver that today returns `.name` | L1 | 0.5-1 session | Rendered text identical before and after on existing saves; a token in a new note renders the name |
| CAE-E2 | Heir tie stores the predecessor's life id plus a frozen display snapshot (CAE-F2) | L1 | 0.5 | Heir view unchanged; renaming the predecessor in a test changes the resolved label, not the snapshot |
| CAE-E3 | Observer-scoped fact read beside `factsFor` (CAE-F3) | L1 | 0.5 | Two observers get different knowledge facts for the same state; old calls unchanged |
| CAE-E4 | `refOf` with fallback and residue rendering | L2 | 1 | Unknown id renders fallback, never throws; masked id renders residue |
| CAE-E5 | Entity delta rows (`mask` first) in the additive slice, resolved in L0-L6 order | L2 | 1-2 | Shuffle test passes; save, reload, Export, Import keep deltas; removing the delta restores the view |
| CAE-E6 | Relation, law and draw-threshold targets (CAE-F5) | L2 | 1-2 | K14 and K15 pass their tests; luck shifts only thresholds on keyed draws |
| CAE-E7 | Speech or recital event (K7, K12) | L2 | 1 | A recited handle resolves to its holder; a spoken trigger handle emits a detection fact |
| CAE-E8 | Bestiary and other name-keyed counts move to ids (K4) | L2 | 1 | A masked enemy counts once |

Each change names its seam (AR14): the resolver for E1-E4, the save slice for E5, the world registry for E6, storylets for E7.

### C7. Interactions (CAE-P7)

- **Time travel.** A rewind restores deltas with the snapshot, so a mask written after the rewind point is gone. Regressors remember by default (knowledge carries, TT rules); a world may say a mask is anchored outside time (a dial with a top-rung cost). A memory charm on the regressor's own memory is the one case where knowledge does not carry, and it is the op's whole point.
- **Heirs and continuation.** Deltas belong to the world instance, so an heir inherits the world's masks. An heir's own knowledge starts from inheritance rules; a predecessor's erased name reaches the heir as residue, not as the name. Continuation snapshots include the delta rows (extends KN2).
- **Clocks.** A clock attached to an entity (NPC absence C1) still runs if only the reference is masked. A clock tied to a *claim* (a debt date) stops if the claim is forgiven (K2). A canon beat whose `inputs` include a masked person treats the person as present but unnamed; whether that changes the outcome is the beat's own input rule.
- **Return note.** Lists deltas the life caused or noticed, by residue text, never the masked truth. A sealed route's mask appears by ID and status.
- **Frozen worlds.** No ops resolve while frozen; deltas persist. Ops cast from another world into a frozen one queue as pending until the world resumes.
- **Exploit limits (AD22).** Nothing blocks repeating an erasure. Limits are adjectives: how costly, how often a world's mechanism lets it work, how likely observers notice the residue, how fast records drift back to consistency through people who still remember.

### C8. Inherent seeding (CAE-P8)

Adds only the delta over the time travel report's K1-K9, E1-E12 and C1-C12.

**API.** `generated(kind, key, {world, instance, genVersion})` returns `{entityId, value}`:
- `entityId` = `kind:key`, using the A8 grammar (`kind:scope:slot:n`).
- `value` = the pure keyed draw (same shape as `generatePersonName({seed, key})`, which is already pure in seed and key).
- Registers `genVersion` per kind for the E7 fingerprint.
- For ambient kinds (travelers, finds, stock, storylet slots, names), throws if called with a cursor seed. Cursor draws stay for player-caused chance (E3).

**Saves** store only the key plus deltas. An entity that **diverged** (recruited, renamed by an op, transformed, carried across a boundary) becomes a saved entity with `origin: {kind, key, genVersion}`, so a revisit can still show the base version where the world allows doubles (D2).

**Migrate first.** (1) `generated_people.js:23-24`: replace `traveler_${i+1}` with a slot key (K1) and pass `seed: worldSeed` with the slot key into `generatePersonName` instead of `draw(0x100000000)`. Keep revisions 1 and 2 readable (A6); the keyed one is revision 3. (2) Relic and thing names through the same call (`name_grammar.js:22+`, G11). (3) Storylet slots (K6, C5).

**Enforcement.** Extend E11/C12's `check:arch` rule rather than adding a new check: in files that call `generated(` for an ambient kind, fail if the same module also passes a `drawUnit` cursor result as a seed. Done check: the check fails on a seeded violation fixture.

---

## More to consider (round 1)

**ACT NOW (done in this doc):** repo map CAE-A1-A18; break findings CAE-F1-F8; source table with gaps named; crosswalk CAE-P0; channel model with non-entity targets; resolution order; observer model; fifteen cards with break points; ordered changes CAE-E1-E8; seeding API delta.

**ACCOUNT FOR NOW (shape near-term slices so these stay possible):**
- **CAE-N1 Stop baking names into new prose.** Any slice that writes a chronicle note or life event uses a `{ref}` token from now on. L1, small, done: a grep check flags new `${…name}` in note text.
- **CAE-N2 Stable ids before masks.** Generated traveler ids (CAE-F8) and bestiary counts (K4) move to keyed ids before any conceptual op ships. L2, 1, done: regeneration keeps ids.
- **CAE-N3 Residue text is world data.** Each world pack supplies its residue phrases; the engine supplies only the fallback "someone". L1, 0.5, done: two worlds render different residue for the same mask.
- **CAE-N4 Records are claims.** A record entity stores who wrote it and when (Qud's biased histories): a rewritten record keeps its author trail. L1, 0.5, done: receipt shows author and rewrite chain.
- **CAE-N5 Laws as data.** New world laws are IL29 rows, not code branches, so K15 stays possible. L1, ongoing, done: one law masked in a test zone.

**LATER / DELEGATE:**
- **CAE-L1 Source gaps.** A source pass on Earthsea Old Speech, JJK binding vows, Toaru Authority, LOTM name-perception rules, Hades and CK3 memory. L1, 1 session, done: each unreached row gets a [S] locator.
- **CAE-L2 Self-knowledge channel.** Whether the target remembers their own name after erasure, per world (Re:Zero-style). L2, 1, done: one world card states it and a test shows it.
- **CAE-L3 Double effects across worlds.** An op cast in one world on an entity that exists in two (a traveler's counterpart, IL22). L3, 2, done: a crossing test with a masked counterpart.
- **CAE-L4 UI for residue.** A desktop-first ledger line style for gaps ("a name is missing here"), with rebuilt evidence at the target viewport. L2, 1, done: screenshot at desktop viewport.
- **CAE-L5 Retroactive-total as TT4.** Wire "erase from history" to the branch verb with a visible fork. L3, 2-3, done: fork shows both lines.

**Decisions only Weibao makes:** none that are either/or. Build order is the one open choice: CAE-E1-E3 can ship alone as safe groundwork,
before any time-travel slice.

## Top three recommendations

1. **Make every reference go through one resolver with a fallback and stop baking names into new prose** (CAE-E1, E2, E4, N1). It is small, safe on old saves, and it is the precondition for every name, memory and record ability.
2. **Store conceptual abilities as entity delta rows over the seeded base, resolved in a published layer order** (CAE-P2, P3, E5). Rewinds, branches and un-erasing then fall out of the delta log the time-travel report already proposes.
3. **Make seeding inherent with `generated(kind, key)` and migrate generated travelers first** (CAE-P8). Stable keyed ids are what a mask points at; without them, an erased name lands on the wrong person after regeneration.
