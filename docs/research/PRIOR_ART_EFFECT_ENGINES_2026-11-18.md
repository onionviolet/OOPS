# Prior art for an effect-engine life-sim (scout, 2026-11-18)

Status: research and proposals only (reference-scout). Everything here is a proposal; none of it is decided, adopted or built, and no owner doc changed. A saved recommendation is a finding, not a decision.

Ask: see whether other projects have done what YAIRPG does, or large parts of it, and say what to take, avoid or reuse. The four things YAIRPG does: (1) catalogue powers, items and rules from many worlds into ledgers, (2) lower ability descriptions into one effect grammar a simulation can run, (3) derive missing rules from data, (4) deliver effects through a life-sim's ordinary play.

Evidence tags (same as the sibling research docs): **[S]** read from a primary or near-primary page or API this pass; **[S-snip]** from a search-result summary only, not opened; **[U]** unverified memory; **[I]** inference about fit. Most tabletop claims below are [S-snip]. Licences marked [S] were read from the repo's LICENSE file or GitHub's licence API on 2026-11-18. Wording is paraphrased; no code or rules text is copied.

## What was already scouted (not repeated)

Game source passes already exist and were read at their heads, not redone. Each PA entry below carries a `prior:` link and adds only the effect-grammar or substrate angle.

| Project | Prior owner |
|---|---|
| Caves of Qud | [REPORT](caves-of-qud/REPORT.md), [qud-systems-audit](qud-systems-audit-2026-10-15/) |
| Dwarf Fortress | [REPORT](dwarf-fortress/REPORT.md) |
| Noita (spells, materials) | [REPORT](noita/REPORT.md), [COMPOSITION_DIGEST](noita/COMPOSITION_DIGEST.md) |
| RimWorld (hediffs) | [REPORT](rimworld/REPORT.md), [conceptual abilities audit](CONCEPTUAL_ABILITIES_ENGINE_AUDIT_2026-10-27.md) |
| Wildermyth | [REPORT](wildermyth/REPORT.md) |
| Elin | [REPORT](elin/REPORT.md) |
| Magicka and procedural spellcraft | [OTHER_PROCEDURAL_GAMES](procedural-crafting-ui-2026-10-15/OTHER_PROCEDURAL_GAMES.md), [PROCEDURAL_SPELLCRAFT_ENGINE_EVIDENCE](PROCEDURAL_SPELLCRAFT_ENGINE_EVIDENCE_2026-11-11.md) |
| Braid, Sands of Time, Deathloop, rewinds | [TIME_TRAVEL_AND_SEEDED_WORLDS](TIME_TRAVEL_AND_SEEDED_WORLDS_2026-10-27.md) |
| Outer Wilds, Majora's Mask | [outer-wilds](outer-wilds/REPORT.md), [majoras-mask](majoras-mask/REPORT.md) |
| Comme il Faut, Facade, NPC architecture | [SIMULATION_AND_NPC_ARCHITECTURE](SIMULATION_AND_NPC_ARCHITECTURE_2026-10-14.md) |
| Hero, GURPS, Nobilis, Mage, Exalted (as books to buy or read) | [RULEBOOKS_FOR_WORLDS](../RULEBOOKS_FOR_WORLDS_AND_GM_CONSIDERATIONS_2026-10-14.md), [TABLETOP_BOOK_SWEEP](TABLETOP_BOOK_SWEEP_2026-10-14.md), [LIBRARY_INDEX](LIBRARY_INDEX.md) |
| Engines and frameworks catalogue | [ENGINES_AND_FRAMEWORKS_CATALOG](ENGINES_AND_FRAMEWORKS_CATALOG_2026-10-14.md) |

What the repo had not done before this pass, by grep: the tabletop families as **effect-construction architectures** (they were catalogued as books, not compared with the grammar); Ludii, Ceptre and VGDL; MTG-engine card scripting; Foundry's rule elements; rewind as an engine contract (GGPO, Achron); and any prior art for deriving missing rules.

## The incumbent (what we are comparing against)

Read this pass: `src/effect_grammar.js` (12 verbs, a fixed object list typed as quantity, state, knowledge, relation, thing, working or law, one effect sentence per ability), `src/effect_host.js` (one host lands a settled working's sentence into the world) and [WORLD_SUBSTRATE_CONTRACT](../WORLD_SUBSTRATE_CONTRACT.md) rules WSC7 to WSC10. Ordering in the world today is **WSC7: packs in composition order, laws in pack order, holders by id, effects breadth first**, with a cascade depth cap (WSC9). Laws look up nearest scope first. I did not read every law module (`area_field_law.js`, `continuation_laws.js` and others), so claims about "no explicit ordering between laws" are limited to WSC7 and the host header.

## Ranking: what would change a decision now

Ranked by the decision each entry changes. The top row changes a design the code already has; the bottom rows change a plan.

| Rank | Code | Project | Decision it changes now | Verdict |
|---|---|---|---|---|
| 1 | PA1 | MTG rule 613 layers, Inform 7 rulebook ordering | How effects on one holder are ordered (today: pack order, WSC7) | Adapt the idea |
| 2 | PA2 | Forge card scripts, card2code | How lowering coverage is measured (a script corpus plus held-out text) | Adapt the method; read, do not copy |
| 3 | PA3 | Pathfinder 2e rule elements (Foundry) | Whether a ledger row lowers to typed elements with a selector, and where selectors live | Adapt |
| 4 | PA4 | M&M, Hero, GURPS, Wild Talents | Effect versus descriptor split, modifier stacks and a stack cap as dials | Adapt |
| 5 | PA5 | Mage spheres, Nobilis | Substrate completeness check and a level ladder per substrate | Trial as a checklist |
| 6 | PA6 | GGPO and GGRS, Braid, Achron | The rewind contract: snapshot versus event replay, and delayed causality | Adapt the contract |
| 7 | PA7 | DF interactions and syndromes, CDDA effect_on_condition | Effect triggers, classes for immunity, recurrence as data | Adapt |
| 8 | PA8 | Path of Exile support tags | Composition gating (a modifier requires and adds tags) | Adapt |
| 9 | PA9 | Ludii (Digital Ludeme Project), Apperception Engine | How "derive missing rules" is validated | Adapt the method; no reuse |
| 10 | PA10 | Versu, Ceptre | How effects arrive through ordinary play (affordances, not commands) | Adapt |

Entries PA11 onward are lower priority, parked or skipped.

## Top ten

### PA1. MTG layers and Inform 7 specificity (ordering)

- **Solved:** many authored effects hitting one object must resolve to one answer, with exceptions allowed to beat general rules.
- **Mechanism:** MTG's continuous effects apply in a fixed sequence of layers (copy, control, text, type, colour, abilities, then power and toughness), within a layer by timestamp, with a dependency able to override timestamp; game-rule effects apply after the rest [S-snip, mtg.wiki and a rules-mirror of rule 613; the official PDF did not render]. Inform 7 runs action rulebooks in a fixed phase order (before, instead, check, carry out, after, report) and sorts rules inside a phase by specificity, with authors able to place a rule relative to a named one [S-snip, the manual's chapter on rulebooks].
- **Licence:** rules are a published document, not code. Ideas are free to adapt.
- **Map:** the landing seam (`effect_host`, WSC7, WSC9). WSC7 orders by pack composition, which cannot say "a law of time beats a law of mood" or "the specific exception beats the general rule" unless pack order happens to match. Time stops, conceptual erasure and "cannot be affected" powers are exactly the cases that need layers plus dependency.
- **Take:** a small layer list per effect object kind (substrate first, then knowledge, then relations, then rules about rules last, as MTG puts rule-changing effects last), timestamp as tiebreak, and a recorded "applied because" line (we already have WSC10 records). Treat dependency override as a later dial, not a first slice.
- **Avoid:** MTG's layer count (seven, plus sublayers) is a result of 30 years of card text; a copy would import problems we do not have. Inform 7's naming quirks (named rules sorting before unnamed ones) are a trap [S-snip].
- **Prior:** none for ordering. Related: [CONCEPTUAL_ABILITIES_ENGINE_AUDIT](CONCEPTUAL_ABILITIES_ENGINE_AUDIT_2026-10-27.md) (channel masks).
- **Decision:** whether WSC7 stays pack-order or gains a layer key. Proposal: add a `layer` field to law rows and keep pack order as the tiebreak inside a layer. [I]

### PA2. Forge and card2code (a coverage measure for lowering)

- **Solved:** turning thousands of free-text card abilities into executable scripts, and measuring how well text-to-code works.
- **Mechanism:** Forge scripts each card as lines with a type prefix (activated, spell, drawback or trigger-chained) and key-value parameters separated by pipes, using a shared library of ability handlers; defaults can be omitted [S-snip, Forge wiki pages named "AbilityFactory" and "Card scripting API"]. card2code (Ling et al., 2016) built paired text-to-code datasets from Magic and Hearthstone cards and trained a model to generate card code; it reports results on those and on a third corpus [S-snip, arXiv 1603.06744 and ACL P16-1057].
- **Licence:** Forge is GPL-3.0 [S, GitHub licence API]. card2code is Apache-2.0 per its LICENSE file, and the repo is archived [S]. GPL means study, do not paste code into this repo.
- **Map:** the lowering seam (ability text to effect sentence) and the ledger coverage counts. Forge's corpus is the nearest thing to "an effect grammar tested against tens of thousands of authored abilities".
- **Take:** (a) the idea of a **held-out set**: set aside ledger abilities that did not shape the verbs and objects, then count how many lower without new primitives. EF2 already says a new primitive needs a second consumer; a held-out lowering rate would turn that into a number. (b) Forge's habit of a small handler library with parameters, rather than one class per card. (c) Hearthstone-style "text on the card" next to "code" as a regression pair.
- **Avoid:** copying card2code's neural approach; its datasets describe card games with a closed rules set, which fiction powers are not. Do not read Forge's script parameter set as our grammar.
- **Prior:** [power-catalogues-2026-11-16](power-catalogues-2026-11-16/CENSUS.md) counts powers per world and lists blocking capabilities by inference; no held-out lowering rate exists.
- **Decision:** whether the next ledger round reports "lowered without new primitive" as a per-world rate. Proposal. [I]

### PA3. Pathfinder 2e rule elements in Foundry (typed effect rows with selectors)

- **Solved:** thousands of published feats, items and effects as data that automate a play system.
- **Mechanism:** each element has a `key` naming its type, most take a `selector` that says which rolls or statistics it applies to, and several types add modifiers, grant items, change actor data or add toggles; a form exists for simple types and raw JSON for the rest [S-snip, the system's rule-element quickstart and release notes].
- **Licence:** system code Apache-2.0 [S]; game text under Paizo's licence and OGL 1.0a per the repo README [S]. Studying structure is fine; the content is not ours to reuse.
- **Map:** the grammar's "target and shape" and the law-field `scope` and `appliesTo`. A selector is the same job as our `appliesTo` tests, written as data on the effect row.
- **Take:** one **row = one typed element + selector**, with a small closed key list and an escape hatch row type, plus a generator/validator form so ledger authors fill fields instead of prose. Their experience that "most elements need a selector" suggests our effect sentences should carry an explicit selector field rather than infer it.
- **Avoid:** the long tail. The system accumulated many one-off keys and a changelog of breaking changes to modifier shapes [S-snip]; keep to EF2's few-primitives rule.
- **Prior:** none. Foundry and Pathfinder appear as a licence row and nothing more.
- **Decision:** the shape of the lowered ledger row (sentence plus selector plus source). [I]

### PA4. Effects-based tabletop families (M&M, Hero, GURPS Powers, Wild Talents)

- **Solved:** building any superpower from a small list of effects plus modifiers, with a cost that moves with the modifiers.
- **Mechanism:** M&M builds a power from an effect, modifiers called extras (raise cost) and flaws (lower it), and **descriptors** (flavour tags that carry no mechanics) [S-snip]. Hero builds Active Points from base cost and advantages, then divides by limitations to get Real Cost, and uses Active Points to drive range and endurance [S-snip]. GURPS Powers builds abilities from existing advantages plus enhancements and limitations, groups abilities under a power with a shared source, and caps total limitations near 80 percent [S-snip]. Wild Talents composes a power from per-die effects with extras and flaws, so a power is designed from scratch [S-snip, thin].
- **Licence:** M&M text is mostly open game content under the OGL with hero points and power points reserved [S-snip]. Hero and GURPS are proprietary; rule structure is not copyrightable but text is. Fate is CC-BY [S-snip].
- **Map:** the grammar contract (effect plus cost and limits), WA5 (engine owns verbs, worlds own nouns) and AD22 (limits are adjectives).
- **Take:** (a) M&M's **descriptor** split is the same as WA5: the effect is mechanical, "fire" or "shadow" is a world word that carries no rule by itself. Keep descriptors on the ledger row, not in the grammar. (b) Hero's two-stage cost (what the effect could do, then what the limits remove) is a template for a per-effect "reach before limits" and "reach after" pair in the quote. (c) A stack cap on limitations is a dial, not a rule; GURPS shows people want one.
- **Avoid:** point-buy arithmetic as a balance goal. AD22 says balance is not forced, and these systems exist to price powers for a table of players, which YAIRPG does not have. Hero's difficulty of setting what a point of change is worth is a known complaint [S-snip].
- **Prior:** at book level ([RULEBOOKS_FOR_WORLDS NR11](../RULEBOOKS_FOR_WORLDS_AND_GM_CONSIDERATIONS_2026-10-14.md)); the structural comparison is new here.
- **Decision:** keep descriptors out of the grammar and decide whether "reach before and after limits" appears in a quote. [I]

### PA5. Mage spheres and Nobilis (is the substrate list complete?)

- **Solved:** one small ontology of "what a power can touch", used by every magical tradition in the game.
- **Mechanism:** Mage: The Ascension names nine spheres: Correspondence, Entropy, Forces, Life, Matter, Mind, Prime, Spirit, Time [S-snip, fan wiki and rules extracts]. Each is learned in levels that widen what the mage can do (a ladder from perceiving up to commanding is my reading, not a quote) [U]. Mage: The Awakening uses ten arcana instead; I did not verify them [U]. Nobilis lets a power embody a concept (an estate), with miracles scaled by level [S-snip, thin].
- **Licence:** rules text proprietary; structure is free to compare.
- **Map:** our substrates (time, space, body, mind, chance, powers, rules, relations) and the object list in `effect_grammar.js`. Comparison, by reading the object list and quantity list this pass: Correspondence is position and place; Time is the `time` law object; Life is `vitality` and `lifespan`; Mind is `mind`, `memory` and `information`; Entropy is `luck`, which acts on draws; Forces are the quantities heat, light, sound and `force`; Prime is `essence` and `energy`. Matter has no quantity of its own and rides on `form`, `thing`, the `transform` verb and the material property; Spirit rides on `soul`, `relation` and crossings between worlds. [I] So **no sphere lacks a home**, but Matter and Spirit are served by properties and verbs, not a named substrate. That is a decision to make on purpose, not a gap proven by a count.
- **Take:** use the nine spheres (and, once verified, the Awakening arcana) as a **completeness checklist** each time a new substrate or object is proposed. Use the level ladder as a prompt for a per-substrate "how much may this verb touch" dial.
- **Avoid:** copying sphere names into the grammar (PFP3 says it names no world), and Mage's paradox and consensus as a model for law fields without a design pass; AD38 already says things work by mechanism.
- **Prior:** [RULEBOOKS_FOR_WORLDS NR4](../RULEBOOKS_FOR_WORLDS_AND_GM_CONSIDERATIONS_2026-10-14.md) (belief-made reality, MV3); [CONCEPTUAL_ABILITIES_ENGINE_AUDIT](CONCEPTUAL_ABILITIES_ENGINE_AUDIT_2026-10-27.md) for the concept-as-channel idea.
- **Decision:** whether Matter and Spirit stay property-and-verb based. Trial: write the checklist, run the Worm and Re:Zero ledgers through it. [I]

### PA6. Rewind as a contract: GGPO and GGRS, Braid, Achron

- **Solved:** reversing or replaying a simulation and keeping it consistent.
- **Mechanism:** rollback netcode asks the game for three hooks (save state, load state, advance one frame) over a **deterministic** engine; saving every frame is the default and sparse saving trades speed for longer resimulation [S-snip, GGRS docs and articles]. Determinism is the hard part; fixed-point or integer maths is the safe route, and the same binary and hardware class matter for floats [S-snip, Gaffer on Games and others]. Braid stores recorded state to rewind and lets the player scrub; Sands of Time keeps a short rewind buffer with little lasting effect on the world [S-snip, GDC talk listing and commentary; the talk itself not read]. Achron lets a player act in the past, propagates changes forward in delayed "time-waves" rather than instantly, and resolves a paradox by letting the timeline waver between states before it settles [S-snip, reviews and fan wiki; no developer documentation found].
- **Licence:** GGPO MIT [S]; GGRS is dual MIT and Apache per its LICENSE files [S]; Braid and Achron closed.
- **Map:** the clock and carry ledger, save integrity and [TIME_TRAVEL_AND_SEEDED_WORLDS](TIME_TRAVEL_AND_SEEDED_WORLDS_2026-10-27.md) (its three gaps: save-keyed streams, cursor-based draws, no delta log). WSC6 "decisions once per minute" and integer quantities are already close to the three-hook shape.
- **Take:** (a) write the contract as the three hooks plus a determinism statement and test it with a replay equality check; (b) choose between full snapshots at minute boundaries and an event log by measuring cost, since replay-based roguelikes reported debugging pain and save desync and some moved to snapshots [S-snip]; (c) **delayed propagation** from Achron as a candidate default for time-travel effects, so a change in the past reaches the present on a schedule instead of instantly, which also answers paradox without a special case [I].
- **Avoid:** per-frame saves (our unit is a played minute, WSC6); cross-machine float assumptions; Achron's real-time, multi-player framing.
- **Prior:** the TIME_TRAVEL doc covers Braid and Sands of Time at a high level and names the three engine gaps; Achron and the rollback hook contract are new.
- **Decision:** snapshot versus event log for rewind, and whether delay is the default for past-to-present effects. Proposal; needs a cost measurement. [I]

### PA7. Dwarf Fortress interactions and syndromes, Cataclysm DDA effect_on_condition

- **Solved:** effects as data with conditions, classes and timers.
- **Mechanism:** DF interactions name a source, a target and an effect, and the effect can add a **syndrome** whose creature-effect tokens say what changes; a syndrome class lets one effect block or be blocked by another class; counter-triggers can undo an effect in some circumstances [S-snip, DF wiki pages, fetched once, then HTTP 429, so not retried]. CDDA's effect_on_condition (EOC) objects pair a condition with an effect, can recur on a timer, can be tied to a game event, and are invoked from spells, monster attacks, bionics and dialogue with named talker roles ("u" and "npc") [S-snip, official docs; the page URL I guessed first returned 404, the search result URL is cited below].
- **Licence:** DF's raws are Bay 12's, closed; CDDA's licence is CC BY-SA 3.0 per its LICENSE.txt, and GitHub reports it as "other" [S].
- **Map:** the active-effect and law-field rows, WSC9 cascade, and the host's publish and answer mechanism.
- **Take:** (a) a **class tag on an ongoing effect** so a ward, immunity or cure can target "any effect of class X", which is how DF lets a cure work without naming every poison; (b) CDDA's trigger list (event, timer, call from another effect) as the three ways an effect row gets run; (c) talker roles as a naming convention for "source" and "target" in a sentence.
- **Avoid:** DF's version drift and untested token lists; CDDA's JSON conditions language grew into a general scripting language, the thing EF2 tries not to build [S-snip].
- **Prior:** [DF REPORT](dwarf-fortress/REPORT.md), [Qud](caves-of-qud/REPORT.md), [RimWorld](rimworld/REPORT.md) cover their source; none compared the effect-row schema.
- **Decision:** whether ongoing effects carry a class field. [I]

### PA8. Path of Exile support gems (composition gating)

- **Solved:** modifiers that apply to a skill only if the skill has the right nature, and may change the skill's nature for later modifiers.
- **Mechanism:** a support gem carries tags it **requires** on the linked skill and tags it **adds** to it, so ordering and chaining matter; a capacity budget disables supports that do not fit; sources disagree on whether tags alone decide compatibility [S-snip, official wiki and third-party guides; the official wiki says tags do not fully determine it].
- **Licence:** closed game; the wiki is community content.
- **Map:** how working modifiers compose in the spell and Gu kernel ([PROCEDURAL_SPELLCRAFT_ENGINE_EVIDENCE](PROCEDURAL_SPELLCRAFT_ENGINE_EVIDENCE_2026-11-11.md)) and `appliesTo`.
- **Take:** "requires and adds tags" as the shape of a modifier row, plus a capacity as a dial. It would let a new world's modifiers declare what they need without engine edits.
- **Avoid:** treating tags as the whole story (the wiki warns they are not); PoE's balance tuning.
- **Prior:** Noita's modifier-as-interpreter and Magicka's element combos are covered in [noita](noita/REPORT.md) and [OTHER_PROCEDURAL_GAMES](procedural-crafting-ui-2026-10-15/OTHER_PROCEDURAL_GAMES.md); PoE's requires-and-adds is not.
- **Decision:** the modifier row shape. [I]

### PA9. Ludii and the Digital Ludeme Project, Apperception Engine (deriving missing rules)

- **Solved:** reconstructing rules that nobody wrote down, and learning rules from observed sequences.
- **Mechanism:** the Digital Ludeme Project describes games as sets of ludemes, builds candidate rule sets from archaeological and textual evidence, and tests them by self-play with AI agents, judging historical fit and playability; a 2026 case compared 130 rule configurations over many simulated games for a worn Roman board and the researchers call the result a plausible reconstruction, not proof [S-snip, university and press pages]. Evans's Apperception Engine induces a symbolic causal theory from a sensory sequence and requires four **unity conditions** (spatial, conceptual, static, temporal), and its ablations show each condition matters; it is built on answer-set programming and its code is on GitHub [S-snip, arXiv 1910.02227].
- **Licence:** Ludii's repository LICENSE is **CC BY-NC-ND 4.0** (no derivatives, no commercial use) [S]; the lead developer separately said .lud files are intended as public domain research output where possible [S-snip, a forum thread], so the two statements conflict and the file governs. The Apperception repo shows **no licence file** [S, GitHub API], which in practice means all rights reserved. Neither is reusable here; both are methods to learn from.
- **Map:** the derive-rules lanes ([GU_AND_HOGWARTS_RULE_DERIVATION](GU_AND_HOGWARTS_RULE_DERIVATION_2026-11-11.md)) and the derivation rules version.
- **Take:** (a) **a derived rule should pass a play test and a fit test**, not by plausibility: the DLP pairs evidence fit with simulated play. (b) The four unity conditions as pass-or-fail checks for a derived rule set: it must connect its objects, connect its concepts, hold at one instant and form a chain over time. (c) State plainly that a method that finds some rule for any input proves nothing, as the DLP's own researchers note.
- **Avoid:** importing Ludii or its descriptions (licence); using the Apperception Engine as a dependency (no licence, ASP).
- **Prior:** none found in the repo for either.
- **Decision:** what "derived" must pass before a rule is marked as derived rather than proposed. [I]

### PA10. Versu and Ceptre (delivery through play)

- **Solved:** getting rules to act through characters in a social setting without scripting every outcome.
- **Mechanism:** Versu treats a **social practice** as a reusable situation (a successor to the Schankian script) that offers actions to participants as suggestions, while each agent still chooses by utility [S-snip, Evans and Short 2014, IEEE TCIAIG]. Ceptre (Martens, AIIDE 2015) specifies game rules in linear logic, where resources are consumed, and lets a designer add interactivity to a generative model selectively, so intermediate states can be inspected [S-snip]. The old repository name I tried returned 404; Ceptre lives in `chrisamaphone/interactive-lp` and a tutorial repo per GitHub search [S, from search results, licence not checked].
- **Licence:** Versu closed (the paper is public); Ceptre repos not checked.
- **Map:** delivery of effects through ordinary play ([SIMULATION_AND_NPC_ARCHITECTURE](SIMULATION_AND_NPC_ARCHITECTURE_2026-10-14.md) already recommends schedules, utility, reserved jobs, situations and a director).
- **Take:** an effect that arrives in play is best modelled as an **affordance offered by a situation**, so a stopped-time power is an offered option inside the situation, and the character (player or NPC) still chooses. Ceptre's consume-a-resource reading of a rule is a clean way to check that a lowered effect spends what it says.
- **Avoid:** adopting linear logic as the engine language; Versu's cost of authoring practices by hand.
- **Prior:** Comme il Faut and Versu are named in SIMULATION_AND_NPC_ARCHITECTURE; the practice-as-affordance reading is the new point.
- **Decision:** whether powers are offered as situation affordances or as global verbs. [I]

## Below the top ten

### PA11. Fan power databases (Powerlisting wiki, VS Battles tiering)

The Powerlisting wiki gives each power a repeated template: also called, capabilities, applications, associations, limitations, known users, with some pages adding methods of acquisition [S-snip]. VS Battles scales characters by attack potency and related tiers [S-snip; many search results were spam mirrors and were ignored]. Fandom wiki text is CC BY-SA in general [U]. **Take:** "associations" and "applications" as two ledger columns, and a scale axis for reach. **Avoid:** tier numbers as a balance system (AD22). **Prior:** [power-scaling-2026-10-08](power-systems/) and [CHEAT_COSMOLOGY](../CHEAT_COSMOLOGY.md) mention VS Battles. **Disposition:** park; our ledgers already exceed these in coverage.

### PA12. Time-loop and deduction games (Outer Wilds, The Forgotten City, Obra Dinn, Majora's Mask, Deathloop, Twelve Minutes)

The Forgotten City resets the town's memories while keeping the player's progress, items and knowledge [S-snip]. Outer Wilds uses the loop to carry knowledge only, with no gear progression [S-snip]. Obra Dinn confirms deductions three at a time, so a player must be sure of several before any is marked right [S-snip]. Deathloop and Twelve Minutes returned nothing usable and are not covered. **Take:** a per-actor "what persists across a reset" row (player knowledge, other characters' memory) and Obra Dinn's batch confirmation as a deduction check for knowledge-heavy powers (precognition). **Prior:** [outer-wilds](outer-wilds/REPORT.md), [majoras-mask](majoras-mask/REPORT.md), [TIME_TRAVEL](TIME_TRAVEL_AND_SEEDED_WORLDS_2026-10-27.md). **Disposition:** adapt later, within the carry ledger.

### PA13. Talk of the Town and Neighborly (generated social history)

Talk of the Town (James Ryan's thesis, 2018) simulates a town and the spread and mutation of knowledge; its repo is MIT [S]; Neighborly is a later settlement-simulation framework, also MIT [S]. **Take:** knowledge propagation with mutation as a model for rumour and memory edits. **Avoid:** Python as a runtime. **Prior:** referenced in [ITCH_IO_IDLE_SCREEN](ITCH_IO_IDLE_SCREEN_2026-10-22.md) only. **Disposition:** park.

### PA14. Baba Is You (rules as objects)

Rules are text objects the player can rearrange; the project already lists it among presentation and stack references ([PRESENTATION_AND_FOURTH_WALL](../PRESENTATION_AND_FOURTH_WALL.md)). Not re-researched this pass. **Disposition:** the law-field-as-row design (WSC) already covers "rules as data"; skip unless a rule-editing power needs a player-facing form.

### PA15. Fate (aspects)

Fate's text is under CC BY 3.0 and OGL [S-snip, with the version disputed between sources]. Aspects as free-form tags with mechanical hooks resemble descriptors with teeth. **Disposition:** skip for the grammar; it matches WA5's rule that tags carry no rule unless a law reads them.

### PA16. VGDL and Ludii as description languages

py-vgdl (BSD-3-Clause) separates a human-readable game description from a library of dynamics, interactions and control; its README calls the repo dormant and points to a 2.0 fork and a Java version used in a game-AI competition [S]. Ludii's ludeme tree is the same idea at larger scale (licence as in PA9). **Disposition:** skip; our grammar already has the same split, and the sources add no new constraint.

### Not scouted this pass

Spore, Zachtronics games, Elona, Ultima Ratio Regum, Grim Dawn, Lancer, Ars Magica, Exalted, Sorcerer, Wildermyth beyond the prior report, Facade, generative agents, Machinations and Wolfram-style rule systems were not searched. The brief named them but each would repeat covered mechanisms or has little overlap with effect composition; they need a named question before a pass.

## What to take, avoid, reuse (summary)

- **Take (ideas):** a layer key plus timestamp for ordering (PA1); a held-out lowering rate (PA2); typed rows with selectors (PA3); descriptor split (PA4); a nine-sphere completeness checklist (PA5); the three-hook rewind contract and delayed propagation (PA6); class tags on ongoing effects (PA7); requires-and-adds modifier tags (PA8); play-and-fit acceptance for derived rules (PA9); effects as situation affordances (PA10).
- **Avoid:** point-buy as balance (AD22); a general scripting language inside effect rows (EF2); importing Ludii or Apperception (licence); copying Forge scripts (GPL); per-frame saves.
- **Reuse (code, data) now:** nothing. The permissive options are GGPO (MIT), GGRS (MIT or Apache), Talk of the Town and Neighborly (MIT), py-vgdl (BSD-3), pf2e system code (Apache) and card2code (Apache), and none solves a problem we have in a form worth adding as a dependency. All are reference reading.

## Licence table (checked 2026-11-18)

| Repo | Licence | How checked |
|---|---|---|
| Card-Forge/forge | GPL-3.0 | [S] GitHub licence API |
| CleverRaven/Cataclysm-DDA | CC BY-SA 3.0 (code and data per LICENSE.txt; API says "other") | [S] LICENSE.txt |
| Ludeme/Ludii | CC BY-NC-ND 4.0 | [S] LICENSE file |
| james-owen-ryan/talktown | MIT | [S] |
| ShiJbey/neighborly | MIT | [S] |
| deepmind/card2code | Apache-2.0, archived | [S] LICENSE file |
| foundryvtt/pf2e | Apache-2.0 for code; content under Paizo licence and OGL | [S] API and README |
| pond3r/ggpo | MIT | [S] |
| gschup/ggrs | MIT or Apache-2.0 | [S] LICENSE files |
| RichardEvans/apperception | no licence file | [S] |
| schaul/py-vgdl | BSD-3-Clause | [S] README |

## Routes and limits

Fetched through public pages and GitHub's API only; no logins, downloads or CAPTCHA steps. The DF wiki returned HTTP 429 on one fetch and was not retried (search results used instead). `docs.cataclysmdda.org/EFFECT_ON_CONDITION.html` returned 404 and the cited path came from search. `github.com/chaudhuri/ceptre` returned 404. Most tabletop and game-design evidence is search-result summary, so the tabletop rows are [S-snip]; none of these books were read. Search results from mirror and AI-persona sites were ignored. This pass read no source of the engine beyond the heads of `effect_grammar.js`, `effect_host.js` and the substrate contract. Nothing was executed or measured.

## Sources

- MTG rule 613 summaries: [mtg.wiki layers](https://mtg.wiki/page/Layer), [rule 613 mirror](https://mtg-rules.vercel.app/chapters/613)
- Inform 7: [manual, Rulebooks](https://zedlopez.github.io/i7doc/WI_19.html), [rule-sorting discussion](https://intfiction.org/t/the-order-of-check-rules-in-inform-7/79260)
- Forge: [repo](https://github.com/Card-Forge/forge), [card scripting wiki](https://github.com/Card-Forge/forge/wiki/Card-scripting-API), [AbilityFactory](https://github.com/Card-Forge/forge/wiki/AbilityFactory)
- card2code: [arXiv 1603.06744](https://arxiv.org/abs/1603.06744v2)
- Pathfinder 2e Foundry: [repo](https://github.com/foundryvtt/pf2e), [rule element quickstart](https://github.com/foundryvtt/pf2e/wiki/Quickstart-guide-for-rule-elements)
- M&M, GURPS, Hero, Wild Talents, Nobilis, Mage: [M&M material and licence excerpts](https://www.misfit-studios.com/?p=358), [GURPS Powers designer notes](https://sjgames.com/pyramid/sample.html?id=5782), [GURPS Power-Ups 8](https://www.sjgames.com/gurps/books/power-ups/power-ups8/), [Hero System overview](https://en.wikipedia.org/wiki/Hero_System), [Wild Talents](https://en.wikipedia.org/wiki/Wild_Talents_(role-playing_game)), [Nobilis](https://en.wikipedia.org/wiki/Nobilis), [Mage spheres](https://whitewolf.fandom.com/wiki/Sphere)
- Fate: [CC-BY licensing](https://fate-srd.com/official-licensing-fate/cc)
- Rewind: [Gaffer on Games, float determinism](https://gafferongames.com/post/floating_point_determinism), [GGRS docs](https://docs.rs/ggrs/^0.5.0), [Braid rewind talk listing](https://gdcvault.com/play/1012210/contactUs), [Braid time mechanics write-up](https://gamedeveloper.com/programming/recreating-the-time-mechanics-of-braid-part-1-), [Sands of Time rewind](https://retronauts.com/article/1003/hitting-rewind-on-prince-of-persia-the-sands-of-time?amphtml=1), [Achron preview](https://bit-tech.net/previews/gaming/pc/achron-hands-on-preview/1/), [Achron review](https://www.bit-tech.net/reviews/gaming/pc/achron-review/2/)
- DF and CDDA: [DF syndrome examples](https://dwarffortresswiki.org/index.php/Syndrome_examples), [DF interaction](https://dwarffortresswiki.org/index.php/Interaction), [CDDA EOC](https://docs.cataclysmdda.org/JSON/EFFECT_ON_CONDITION.html), [CDDA LICENSE](https://github.com/CleverRaven/Cataclysm-DDA/blob/master/LICENSE.txt)
- PoE: [gem tag wiki](https://pathofexile.fandom.com/wiki/Gem_tag), [support gem wiki](https://www.poewiki.net/wiki/Support_Gem)
- Ludii and DLP: [Ludii site](https://ludii.games/), [Ludii repo](https://github.com/Ludeme/Ludii), [Ludii licence thread](https://ludii.games/forums/printthread.php?tid=150), [Maastricht news](https://www.maastrichtuniversity.nl/news/thanks-ai-we-can-play-roman-game-again)
- Apperception: [arXiv 1910.02227](https://arxiv.org/pdf/1910.02227), [repo](https://github.com/RichardEvans/apperception)
- Versu and Ceptre: [Evans and Short 2014](https://www.cs.uky.edu/~sgware/reading/papers/evans2014versu.pdf), [Ceptre, AIIDE 2015](https://ojs.aaai.org/index.php/AIIDE/article/view/12784), [interactive-lp repo](https://github.com/chrisamaphone/interactive-lp)
- Time loops: [Outer Wilds, Game Developer](https://www.gamedeveloper.com/design/live-die-repeat-how-i-outer-wilds-i-piques-curiosity-in-an-ambivalent-solar-system), [The Forgotten City](https://en.wikipedia.org/wiki/The_Forgotten_City), [Obra Dinn](https://en.wikipedia.org/wiki/Return_of_the_Obra_Dinn)
- Fan databases: [Powerlisting wiki](https://powerlisting.fandom.com/wiki/List_of_Powers), [VS Battles tiering (mirror wiki)](https://omniversal-battlefield.fandom.com/wiki/Tiering_System)
- Social sim: [Talk of the Town repo](https://github.com/james-owen-ryan/talktown), [Neighborly paper](https://www.kmjn.org/publications/Neighborly_CoG22-abstract.html)
- VGDL: [py-vgdl](https://github.com/schaul/py-vgdl)
