# Foundations for long-term world implementation, 2026-11-07

Weibao, 2026-11-07: "what about foundational stuff? How to address long term world implementations and more?" Follow-up to the [2026-11-07 atlas refresh](PROGRESS_ATLAS_2026-11-04.md#refresh-2026-11-07-master-a152827dd-clean-pushed). Proposals (AD32); nothing accepted or dispatched. Evidence: `node scripts/seam_register.mjs` plus a static-import grep for the Nov 6-7 seams at `a152827dd`, by file-name family. Code reach only, not route proof. Visual: [seams by world](../../prototypes/progress-atlas/2026-11-07-seams-by-world.html). Builds on [LARGER_FOUNDATIONS](LARGER_FOUNDATIONS_2026-11-06.md) FD14-FD18 and the [enablement plan](../reviews/FOUNDATION_WORLD_ENABLEMENT_PLAN_2026-11-04.md) E1-E10.

**Entry point for the 2026-11-09 rounds:** read [Reconciliation of LAYX81-LAYX218](#reconciliation-of-layx81-layx218-2026-11-09) and its next-order table (N9-N13); search the rest of this file by code.

## What the matrix shows

- LOTM imports nearly every seam; Harry is the second consumer for about ten; MoL, Gu, Paradise and Primordial touch a few each; Shadow Slave and D&D import none.
- Ten seams have no world consumer at all: `law_case`, `faction_rank`, `life_events`, `research_*`, `ability_ladders`, `effect_dsl`, `conflict_frame`, `check_contract`, `home_building_model`, and `tempo_fight` outside the shared host.
- The thinnest layer is powers: one LOTM ability runtime, a channel vocabulary with no executable effects, and two unused ability seams. Every long-term world (Gu, Nen, Casting Seals, D&D spells, cultivation) needs that layer most.

## Long-term moves (proposals)

| ID | Move | Default, dial and reason | Done check |
|---|---|---|---|
| LT1 | **World declaration as one runtime file.** Extend the FD14 society sheet into a world sheet covering the core kit K1-K34: calendar and clocks, money, authorities and positions, institutions, power grammar, crossing and reset law. Each line reads authored, palette or missing, with its owner seam. | Default: every world ships one; test beds keep palette rows. Dial: depth per world. Reason: a missing piece today looks like the world lacks it. | Coverage printout for LOTM, Harry and one bounded world lists every K line with a state |
| LT2 | **Power grammar as the next big foundation.** One effect form (target, channel, cost source, support, duration, interruption, counter) executed by `effect_dsl` or its successor, read by fights, scenes and making. FD18 channels supply the vocabulary. | Default: Klein's Seer and Clown abilities and one Harry spell move onto it first. Dial: per-world cost sources (spirituality, wand, Gu essence, slots). Reason: power systems are what make worlds mechanically distinct, and today each is hand-built. | A LOTM ability and a Harry spell run through the same executor with different local costs, walked natively |
| LT3 | **Contrast rule for "shared".** A seam counts as shared only when a world with a different law uses it (AR11 made checkable by the seam register). Harry is the default contrast: money-less obligations (house points, detentions; LARGER F6) and school positions. | Default: Harry for society seams, MoL for reset and knowledge, Gu for living tools, D&D for rules profiles. Reason: two LOTM-shaped callers prove little. | Seam register proof column shows a two-world route for positions, duties, obligations and lesson |
| LT4 | **Adopt or retire the ten idle seams.** Each gets a named first consumer in a lead world, or it is folded into a live seam or removed (AD45). | Default: `law_case` joins duties and heat; `ability_ladders` and `effect_dsl` fold into LT2; `life_events` joins FD16 events; the rest wait for a named window. Reason: idle seams mislead lanes into building beside them. | Zero-world row count in the register drops, each with a cited reason |
| LT5 | **World bring-up test.** Measure how much new hand code a bounded world needs to boot a playable first day from its sheet plus palettes. Run it on one existing bounded world (Shadow Slave or D&D Phandalin, both at zero shared seams) after LT1 and LT2. | Default: one bounded world, a first day, not a campaign. Reason: this is the honest measure of whether foundations make later worlds cheaper. Not new depth for a test bed; a portability check. | A recorded count of new files and lines for the bring-up, compared against the next one |
| LT6 | **Content throughput is the other long-term limit.** Klein is at ch69 of 213 in volume 1 after 33 slices; engine reuse does not write canon content. Bulk local-AI drafting stays later by direction; until then, spine-and-fill (PF13, under trial) and the canon pull are the levers. | Account for now; no change to direction. | The PF13 trial records slices per chapter range before and after |

Suggested order: LT3 and LT4 (cheap, inside current Klein and Harry work), then LT2 (largest payoff), LT1 alongside, LT5 once both land. LT6 is a standing constraint. Current focus (Klein first, Harry alongside) is unchanged.

## Deep systems by world (2026-11-07 follow-up)

Weibao, 2026-11-07: "systems like procedural crafting, relationships, nd more?" Evidence: static importers of each system's modules under `src/` at `a152827dd`, by file family, read against [docs/systems/README.md](../systems/README.md) maturity rows. Code reach, not route proof. Visual: [systems by world](../../prototypes/progress-atlas/2026-11-07-systems-by-world.html).

**Pattern: two stacks that rarely meet.** The deep procedural systems (craft engine with 32 importers, mixtures and discovery, material lineage, gear and runes, economy and shops, 34 home files, heirs, harvest) run in the native Village and Frontier. Klein and Harry, where depth is supposed to go, use their own hand-built versions (LOTM brew rows and potion rules, HP brewing domain, purse-seam pay and vault) or nothing (no materials with identity, no home, no gear). Relationships are the weakest system everywhere: `relationship_view` and `companion_roster` have no static importer, and both lead lives hold people as cast facts and knownness, not as a per-person bond.

| ID | Move (proposal) | Default, dial and reason | Done check |
|---|---|---|---|
| LT7 | **Bridge, do not port.** Each native system reaches a lead life through the next story window that needs it, with the world's own laws as data on the shared engine (MR reuse direction). | Default order: Klein's potion making onto the craft engine with LOTM's exact-formula and digestion rules; Harry's Potions class onto mixtures (a wrong stir has a result). Reason: the engine already has failure, substitution and experiment logs that both books show. | One LOTM and one HP potion made through the craft engine, walked, with the old rows retired |
| LT8 | **One person record for relationships.** Per person: tie kinds (trust, debt, affection, rivalry, duty), shared history, what each knows of the other, all fed by facts the story and seams already write (cast facts, knownness, recurring people, positions, obligations). | Default first consumers: Klein's Nighthawk colleagues (AT17 recurring people) and Harry's classmates. Dial: how many tie kinds a world shows. Reason: relationships are the core of a life-sim and today no lead life has them as state. | A colleague's tie changes after a scene and changes a later option, kept across reload |
| LT9 | **Materials with identity in lead lives.** Ritual supplies, amulet blanks and potion ingredients carry lineage (where from, treatment, quality) instead of counts, where the window needs it (A2 in the refined atlas). | Default: only items whose origin changes an outcome. Reason: lineage exists and is unused by the books. | One LOTM ingredient's source changes a brew result |
| LT10 | **Homes as places you live in book worlds.** Klein's apartment and Harry's dormitory go onto the household model, read side first (who lives there, rent owed, what is stored). | Default: read side only; furnishing and staff later. Reason: 34 home files and both leads have a home that is scene text. | The apartment row shows rent, residents and stored goods from the shared model |
| LT11 | **Test-bed depth stays put.** The Village keeps its systems as the reference; new depth goes to book worlds by direction, so each bridge above counts as book-world depth, not Village work. | Account for now. | n/a |

Order inside the current focus: LT8 with the next Klein colleague scene (it also gives AT17 a reason), LT7 with the next potion window, LT9 alongside LT7, LT10 when a window centres on the home. These sit beside LT2 (power grammar); LT8 and LT2 are the two biggest.

## Delivery pointer (cross-world systems session, 2026-11-07)

The method these moves lead to is in [the cross-world systems transfer pattern](../CROSS_WORLD_SYSTEMS_TRANSFER.md) (proposal). Delivery, the world × system coverage table with both layers (foundation and use in the world proper) and the wave plan are in the [task record](../gm/dispatch/cross-world-systems-2026-11-07/CHECKPOINT.md). LT8 landed first: `person_ties` is on a two-world native route (Klein and Dunn, Harry and Ron).

## Weibao's 2026-11-08 ideas, reconciled

Weibao, 2026-11-08 (verbatim in the [direction log](../gm/USER_VISION_LOG_2026-11.md#story-walks-calibrate-the-systems-and-more-crafting-reputation-and-homes-2026-11-08)): potion crafting and other crafting types, a reputation system, buying a house from the landlord, earlier visible relationships, story walks as retroactive calibration, more to consider. The coordinating chat ran the reconcile-project skill on this section. Everything below is a proposal (AD32) unless it is marked as his direction.

### Progress ledger (cross-world systems, as of 2026-11-08)

The owner is the [cross-world systems record](../gm/dispatch/cross-world-systems-2026-11-07/CHECKPOINT.md), which holds the coverage table and the walk rows. This ledger only says which evidence row each claim reached.

| ID | Claim | Evidence reached | Gap |
|---|---|---|---|
| LT8 | One person record; Dunn's trust (gated on meeting him) and Ron's affection open a talk | Committed (`2933f87e3`, `f28fa8e45`, `e84b9a79e`, `ce99b8b68`); natural/fixture walks recorded as passing in the checkpoint, not rerun here | One consumer shape so far (a tie opens an offer) |
| LT7 | Neil's Seer brew and Harry's Potions class on the shared craft engine | Committed (`bcc7a5463`, `e84b9a79e`); walks recorded | Polyjuice and LOTM's other potions still use their own code; one recipe per lead so far |
| LT2 | Spirit Vision and the levitation charm on one cast lowering, with practice | Committed (`74275ccef`, `e84b9a79e`); walks recorded | Cost, works-or-fizzles and practice so far; the full effect grammar is not built yet (sent 2026-11-08) |
| LT10 | Klein's flat and Harry's house through `worldHomeModel` | Committed (`5ce04874a`, `949672b3b`); display side so far | The home engine's catalogues are hard-wired to the Village (session survey, 2026-11-08), so furnishing and building need catalogue registries first |
| Suite | Full `npm test` | Session report: 5,698/5,701 with one failure fixed and that file rerun | A full run on the latest tree is not recorded |

Not verified here: none of these commits is pushed or in the installed app (AT36), and none is human-reviewed.

### Answers to his questions (proposals)

| ID | Question | Answer: default, dial, reason |
|---|---|---|
| XC1 | Potion crafting and other kinds of crafting | One making engine, many crafts as world data: brewing (potions), rites and rituals (`lotm_rite_rows`, `ritual_conditions`), smithing and gear, cooking, inscription and charms, tailoring. The difference between crafts is which axes and operations a law row uses (heat, timing, order, words, moon, spirit), not a separate engine per craft. Default: each lead gets every potion its story names, through the same `defineCastMaking` port, before a new craft type is added. Dial: how many hidden axes a craft has. Reason: the engine already has failure, substitution and experiment logs; LOTM's rites and HP's Polyjuice are the next two cases still on their own code |
| XC2 | A reputation system | The code holds about seven separate standing stores: `reputation`/`reputation_state` (main only), `persona_standing`, `peer_standing`, `economy_standing`, `person_standing`, knownness and `heat`, and `faction_rank`. Classification: duplicate and incomplete integration, not a missing system. Proposal: reputation is a view, not a store. It reads what observers know (ties, knownness, heat, rank, credit) per audience: a person, a group or institution, a district, a world. Default: unify the read side first, with no save change. Dial: how fast word spreads and fades per world (already a knownness half-life). Reason: AD6-AD8 keep knowledge per observer, and a separate reputation number would become a second truth |
| XC3 | Buying a house from the landlord | A tenure law on the home port: renter, lodger, owner, tied (school, barracks) and squatter, each with what you may change, who you owe and how you leave. Buying is a deal with a person: the landlord is a tied person (LT8) whose trust and the price (economy port) decide the terms, with payment by cash, loan or instalments on the obligations ledger. Default: Klein rents, and moves to a better rented place later, which his story does; buying is open in free play. Dial: whether a world sells houses to someone of your standing. Reason: this joins homes, ties, economy and obligations, which is the cross-system test the ports need |
| XC4 | Should relationships be visible earlier? | Yes by default: a person shows in People with their ties at zero, and with what moves them, from the moment you meet. Change still follows events, so visibility does not alter the canon pace. Dial: per world, how much of another's regard you can read (a Seer's insight reads more). Reason: his direction that visible does not mean changed earlier; it also makes the calibration observable |
| XC5 | Story walks as retroactive calibration | His direction, recorded: AD49 applies to events and relationships. The canon walk is the calibration fixture: a tie's gain per event, a brew's success odds and a price are set so the walked route reproduces canon, and free play diverges from the same rules. Default: each slice names the canon events it calibrates against and the dial values it chose. Reason: it tunes systems from real data instead of guesses |

### More to consider (round 1)

| ID | Disposition | Consideration | Next check |
|---|---|---|---|
| XM1 | ACCOUNT FOR NOW | Calibration overfits if one route is the only target. A tie gain tuned to make Dunn trust Klein by a given week must still behave sensibly for a lazy Klein or a different start. | Each calibrated dial gets one off-route test (half the filings, double the filings) |
| XM2 | ACCOUNT FOR NOW | Several reputation stores already write standing. Unifying the read side must not double-count an act that two stores both record. | Map each store's writer before the first reputation view |
| XM3 | ACCOUNT FOR NOW | The home engine needs registries before any world plugs in, and that is an engine change touching the Village's live saves. | A registry slice with Village saves loading unchanged, before Klein's furnishing |
| XM4 | LATER (medium) | Crafting creates goods that feed the economy, homes (furniture), ties (gifts) and reputation (a known brewer). The ports should pass products across systems as items with lineage, not as port-specific results. | One crafted item used by a second system in a lead life |
| XM5 | LATER (medium) | Visible relationships invite the player to act on them. That needs ways to raise ties outside the story (gifts, help, shared work) under the same calibrated rules, or the panel shows numbers you can't influence. | Two free-play tie sources per lead |
| XM6 | LATER (small) | Housing changes daily rhythm: commute, where you sleep, who sees you come and go (knownness). Moving should change the world clock's routes and witnesses, not just a label. | A move changes one travel time and one witness |

Unmapped residue: gear, companions, gathering and heirs for the leads; other worlds; the power grammar's full parts list (sent to the session 2026-11-08, not yet built).

### Procedural abilities without per-ability tuning (2026-11-08)

Weibao, 2026-11-08: "how to procedurally create the various posibiltiies and more in the future, or will every ability require so much fine tuning work?" Proposal (AD32), read against [ABILITY_RULES](../ABILITY_RULES.md) ABR1-ABR12, `structured_ability_runtime.js`, `spell_seam.js`, `spell_cast_lowering.js` and `scripts/calibrate_fights.mjs`; no code run.

**Finding.** The project already has the parts for composition. `compileStructuredAbilities` builds abilities from descriptor fields (function, acquisition, executionKind, control, target, counters, carriers, conditions), and ABILITY_AUTHORING gives every use the same phases. There is also a seeded rate-band calibrator for fights. The new spell lowering is a second, narrower path beside that descriptor. Hand-tuning gets expensive when numbers are set per ability. It stays cheap when they are set per part and per world.

| ID | Option | Cost profile |
|---|---|---|
| XP1 | Hand-author and tune each ability (today's default) | Grows with every ability, so tuning never ends |
| XP2 | **Compose from parts, price the parts once per world.** An ability is a descriptor row: target, channel, effect verb, magnitude band, duration and upkeep, cost source, delivery, counters, growth. Each world sets a price list: what one band of magnitude, one step of range or one minute of duration costs in its currency (spirituality, stamina, Gu essence, slots). An ability's cost, odds and strain are derived from its parts. | Grows with the number of parts and worlds, not abilities. A new ability is a row plus a check |
| XP3 | **Fit the price list from canon anchors (unusual).** Every ability the book states numbers or effects for is an anchor (AD49). A fitting script solves each world's part prices so the anchors come out, on the fight calibrator's model. Outliers mean one of two things: the ability is a canon exception (it gets an authored override with a reason), or the grammar is missing a part (add the part once, which helps every later ability). | Tuning effort becomes reading results, not adjusting each number |
| XP4 | **Generate inside a world's grammar.** For free play, original worlds and variation (AD5 parallel worlds): draw new abilities from the parts a world allows, its themes (a pathway's domain, a Gu path, a school of magic) and the price list, seeded through `seeded_streams`. Generated rows pass the same validators as authored ones. | Nearly free once XP2-XP3 exist. Needs guards against nonsense combinations |

**Converged proposal:** XP2 as the base, XP3 as the tuning tool, XP4 on top for generation. Hand-tuning remains for anchors that disagree and for signature abilities a world states exactly. Default: the spell lowering folds into the structured descriptor, so there is one ability path (ABR5, ABR6), not two. Dial: how strictly a world's prices must fit its anchors (exact where the text states numbers, banded where it is vague). Reason: tuning per part scales to many worlds, and canon anchors turn tuning into measurement.

Status 2026-11-09: the fit runs (`fitPowerPrices`, `scripts/calibrate_powers.mjs`), but its two anchors are gameplay dials, one per world, so no power price is tuned to canon yet ([LAYX24](#is-the-approach-right-and-tuning-by-lore-2026-11-09)).

| ID | Disposition | Consideration | Next check |
|---|---|---|---|
| XM7 | ACCOUNT FOR NOW | Two ability paths now exist: the descriptor and the spell seam. Building the grammar on the spell seam would split abilities in two. | Lower Spirit Vision and the charm onto descriptor rows before adding parts |
| XM8 | ACCOUNT FOR NOW | Prices fit to one lead's early abilities will misjudge late, high-tier ones (HTP: tiers add domains and verbs). | The fitting script reports error per tier, and a tier with no anchors stays flagged as assumed |
| XM9 | LATER (medium) | Generated abilities need readable names and prose (PRS, NMR) and must not reveal sealed truths. | Generation writes from the naming sheet and passes `check:rules` |
| XM10 | LATER (medium) | Source reading can fill descriptor rows in bulk: readers turn each ability in the text into a row with its anchors, and validators reject rows that miss a part. That replaces most hand authoring for canon worlds (bulk local-AI drafting stays later by direction). | One world's census converted to rows with an outlier report |

### Potions and crafting breadth, where they stand (2026-11-08)

Weibao, 2026-11-08: "What about crafting and more? or potions? or implementing other potions?" Read against the cross-world record (W2a, W1a, W3d), LARGER_FOUNDATIONS line 438 and `src/` file names; nothing was run.

| Area | State | Next (proposal) |
|---|---|---|
| Klein's Seer potion (Seq 9) | Shared craft engine, walked (W2a) | Calibration anchor for the LOTM price list |
| Clown and Magician (Seq 8-7), Sun 9-8 | Tested data rows, not on the craft engine and not walked | W3d: through `defineCastMaking` with the formulas the book states |
| The other LOTM pathways and higher Sequences | Not built; formulas need source reading first (LG2) | Readers fill formula rows from the text (XM10); the engine resolves them, so each new potion is data |
| Harry's Potions class | One engine brew where order matters (W1a) | The first-year curriculum the book names, one row each |
| Polyjuice | Its own code (moon timing, lacewings) | Move onto the engine as law rows (W3d); it is the stress case for long, timed brews |
| Rites, amulets and other crafts | LOTM rites have their own code; amulet craft is open (R8); smithing, cooking and runes run in the Village | Same engine, different law rows (XC1) |

**XC6 (proposal): procedural recipes on the same idea as XP2-XP3.** Ingredients carry property axes (a LOTM characteristic's pathway and sequence, an HP ingredient's potency and reactions). A world's law turns properties into outcomes. Canon formulas are anchors that the axes and law are fitted to (AD49). Off-book combinations then produce reasoned results, such as a weaker brew, a side effect or a failed one, instead of nothing. That gives experiments and discovery (mixtures, experiment log) in book worlds without writing every recipe. Default: canon formulas stay exact and free experiments are banded. Dial: how forgiving a world's alchemy is. Reason: both books show failed and altered brews, and the engine already records trials.

Status 2026-11-09: the Cure for Boils and the Seer brew run on the shared craft engine, each with axes that belong to its one recipe; the 43 LOTM formula rows and Polyjuice sit on the separate process envelope with fixed slots. What XC6 still needs is in [the potion round](#procedural-potion-crafting-2026-11-09) (LAYX41-LAYX49).

### Rites and a shared procedure layer (2026-11-08)

Weibao, 2026-11-08: "how expandable are these ideas? Do we need rites system, to make implementation more object oriented/procedurea;?" Read against `ritual_conditions.js`, `dose_process.js`, `lotm_rite_rows.js`, `book_world_lotm_ritual.js` and their importers; nothing was run.

**Finding.** A world-neutral ritual mechanism already exists. `ritual_conditions.js` checks a list of conditions at a transition (a potion drunk, a breakthrough, an Animagus preparation), grades the result (met, substituted, partial, absent) and lets a stand-in count by physical, functional and symbolic fit. `dose_process.js` is the shared dose envelope, used by both LOTM and HP brewing. Only LOTM calls the ritual mechanism (divination, spells, rituals), and the Seq 5 rites are a preview because Seq 5 doses can't be drunk yet. What is missing is not a rites system but the layer that runs a procedure: ordered steps over time with interruption.

**XC7 (proposal): one procedure layer built from five parts, not a rites system.**

| Part | Owner today | Role in a procedure |
|---|---|---|
| Material | craft engine, material lineage | What is consumed or shaped, with identity |
| Condition | `ritual_conditions` | Place, time, state, words and substitutes, graded |
| Step | missing (process cues and the dose envelope come closest) | An ordered action with time, a skill check and an interruption point |
| Effect | the structured ability descriptor (XP2) | What happens when it works, partly works or fails |
| Agent | missing as a part | Who answers or witnesses: a deity, a hidden existence, a spirit, a contract partner, or nobody |

Brewing, LOTM rites and rituals, amulet making, HP Polyjuice and Animagus preparation, D&D ritual casting, alchemy arrays, Casting Seals and cultivation breakthroughs are then all the same object: a procedure assembled from these parts, with the world's law and price list as data. Default: build the Step and Agent parts and reuse the other three. Dial: how strict a world's steps are (exact canon order, or banded). Reason: rites sit between crafting and powers, and a separate rites engine would be a third copy of both.

**How expandable.** In design, broadly: a new world adds law rows, price lists, catalogues and procedures as data, and a new kind of magic is usually a new combination of parts, sometimes one new part. The practical limits are elsewhere:

| ID | Disposition | Limit | Next check |
|---|---|---|---|
| XM11 | ACCOUNT FOR NOW | Content still has to be read from the books: formulas, rite conditions and canon numbers. The engine makes each one cheap once read, not free. | Track rows per source chapter as the throughput measure (LT6) |
| XM12 | ACCOUNT FOR NOW | Unique signature powers (Klein's secret, a Gu immortal, plot-specific artifacts) resist composition; they get authored overrides with reasons. | Count overrides per world; many means a missing part |
| XM13 | ACCOUNT FOR NOW | Each world still needs its own presentation and words (DSG, PRS); shared parts show through world prose, not a generic panel. | A procedure's text comes from the world's rows, checked by `check:rules` |
| XM14 | LATER (small) | Five composable parts multiply the save shapes; procedures that pause mid-step need a stable saved shape and migration once. | One interrupted procedure kept across save, reload and import |

### Material tags and generic alchemy (2026-11-08)

Weibao, 2026-11-08: "Lots of stuff need a engine to cover all of it's aspects? Material tags and more? general / 'generic' alchemy based on traits of ingredients?" Read against `craft_materials.js`, `tag_store.js`, `rule_modules.js`, `mixture_rules.js`, `ingredient_world_fit.js`, `lotm_ingredient_catalogue.js`, `lineage_traits.js` and the [procedural materials and alchemy audit](../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md); nothing was run.

**Finding.** Trait-based alchemy already exists at the engine level. `craft_materials.js` takes axes, tags, families and authored materials from content packs and can generate seeded materials, and its header says the engine never names a specific ingredient. `tag_store.js` holds the tag registry, and `rule_modules.js` with `mixture_rules.js` (`responsive@2`) resolves outcomes from tags by a world's law. The Village uses all of it. The book worlds keep their own vocabularies instead: HP fits ingredients through `ingredient_world_fit` and its own substitution, LOTM's ingredient catalogue (with `substitutesFor`) has no static importer, and the ritual checker scores stand-ins by physical, functional and symbolic layers. `lineage_traits` holds traits of beings separately again. So the gap is a split trait vocabulary, not a missing engine.

**XC8 (proposal): one trait vocabulary as the glue between a few engines.** A trait is a tagged property with a value (potency, element, pathway and Sequence, temperature, spirit, toxicity, symbolism). Materials, items, beings, effects (FD18 channels) and conditions all carry traits from the same registry. A world declares its traits and maps canon names onto them as data, so a Beyonder characteristic, a lacewing fly and a Village herb are the same kind of object with different traits. Generic alchemy is then the existing law-over-tags resolver, with canon formulas as fitted anchors (XC6). The same traits feed substitution (the ritual layers), appraisal, prices and powers.

Default: reuse `tag_store` and `craft_materials`, and move LOTM's and HP's catalogues onto them with no new engine. Dial: how many traits a world exposes to the player (hidden axes are learned by appraisal or experiment). Reason: the engine was built for this in October and only the Village feeds it.

**Engines, not one per aspect.** The aim is a small set of engines with traits and world data doing the rest: making (materials and procedures, XC7), effects (the ability descriptor, XP2), people (ties, knowledge, reputation as a view), places and time (homes, calendar, travel), and value (economy and obligations). A new aspect such as poison, enchantment or spoilage should usually be traits plus law rows, not a new engine.

| ID | Disposition | Consideration | Next check |
|---|---|---|---|
| XM15 | ACCOUNT FOR NOW | Merging vocabularies can change what an existing Village recipe produces if a tag's meaning shifts. | The Village's mixture results stay byte-identical on its seeded checks after the merge |
| XM16 | ACCOUNT FOR NOW | Hidden traits are knowledge: what the player has learned about an ingredient is observer state (AD6-AD8), not the truth table. | Appraisal and experiment write observations; views read observations |
| XM17 | LATER (medium) | Traits across systems allow emergent links, such as a toxic ingredient raising heat if witnessed, or a symbolic one pleasing a deity Agent (XC7). They need guards so a chain doesn't run away. | One cross-system trait effect with a cap and a reason |

### Other domains on traits and procedures (2026-11-08)

Weibao, 2026-11-08: "Blacksmtithing and harvesting, and other stuff and more? Simiar stuff that would benefit from having something like this?" Read against `src/` importers; nothing was run.

**Finding.** None of the other making and resource domains uses the trait engine. Smithing (`alloy_equipment.js`, a hand-set property table, and `gear_work.js`), harvest (12 importers), gatherings, crop clocks, household meals, home medicine and care, and weather all keep their own property tables, and none imports `craft_materials` or `tag_store`. They are the same shape as alchemy: things with traits, changed by steps, under a world's law.

**XC9 (proposal): the same three pieces for every making and resource domain.** Traits (XC8), the procedure layer (XC7) and law rows fitted to canon anchors (XC6). Ranked by what the lead lives reach first:

| Rank | Domain | Traits | Procedure | Lead-life consumer |
|---|---|---|---|---|
| 1 | Medicine and healing | potency, toxicity, what it treats, dose | diagnose, prepare, treat, recover | Tingen physician (AT30), Hogwarts hospital wing, Klein's injuries |
| 2 | Cooking and meals | nourishment, taste, spoilage, warmth | prepare, cook, serve, keep | Household meals at the flat and the Dursleys', the Great Hall |
| 3 | Harvesting, gathering and farming | season, yield, freshness, where it grows | find, gather or tend, cure, store | Herbology and the greenhouse; LOTM ingredient sourcing |
| 4 | Smithing and gear | hardness, weight, edge, conductivity, spirit affinity | smelt, forge, temper, finish, repair | Klein's revolver and bullets, amulet blanks (R8), wand care |
| 5 | Enchantment, runes and inscription | channel, charge, symbol, stability | inscribe, charge, bind | LOTM amulets and charms, HP charmed objects |
| 6 | Creatures and animals | temperament, diet, what parts yield | tame, feed, breed, harvest | HP creatures (`hp_animal_features`), Gu feeding |
| 7 | Textiles and disguise | warmth, look, status, concealment | spin, weave, sew, alter | Cover identities (AT19), Klein's costumes, robes |
| 8 | Building and repair | strength, insulation, cost | plan, build, furnish, maintain | Homes (XC3, W3a) |
| 9 | Poisons, spoilage and decay | toxicity, rate, preservation | decay over time, preserve, detect | Every stored good; LOTM poisons |
| 10 | Mining and raw materials | purity, grade, deposit | prospect, mine, refine | Later worlds (D&D, cultivation ores) |

Default: move a domain only when a lead window or a calibration anchor needs it, starting with medicine (AT30 already waits on it). Dial: how many traits a domain exposes per world. Reason: each move retires a hand-set table, and every later world inherits the domain as data.

| ID | Disposition | Consideration | Next check |
|---|---|---|---|
| XM18 | ACCOUNT FOR NOW | Frontier and Village balance (the D1 Springsteel proposal) is set in those tables; moving them onto traits must reproduce today's numbers before anything new is added. | Each moved table passes its existing focused tests unchanged |
| XM19 | ACCOUNT FOR NOW | Domains share outputs: a harvested herb feeds medicine, cooking and alchemy. One item with traits must serve all three without three copies. | One gathered item used by two procedures in a lead life |
| XM20 | LATER (medium) | Skills differ per domain but practice should carry over where it reasonably does (a cook's knife work, a smith's heat sense), by AD38. | A shared skill trait with a stated transfer rate |

### Chemistry, physics, tech with magic, and general research (2026-11-08)

Weibao, 2026-11-08: "chemistry? Making game somewhat educational at the same time? Physics? Combing tech and magic? How to go about working on 'genera;' research or other stuff more abstract like that?" Read against the [physical field layer design](../PHYSICAL_FIELD_LAYER_DESIGN_2026-10-23.md) and `field_layer.js` (built first slice: heat, gas and ventilation per place over the mixture's own shape), `energy_resources.js` (15 importers), `craft_process_thermal.js` (no importer), [TECHNOLOGY_AND_PROGRESSION](../TECHNOLOGY_AND_PROGRESSION.md) TK, TN and TM, and the inquiry seam. Nothing was run. Educational play has no prior direction in USER_VISION, so XC11 is new and stays a proposal.

**XC10 (proposal): laws stack in layers, and tech meets magic where layers touch.** A world's law is a stack: an ordinary physical layer (heat, pressure, combustion, electricity, chemistry), then any supernatural layers (spirituality, wand magic, Gu essence, qi). Each layer adds traits and the rules that act on them; it does not replace the layer below unless the world says so. Tech and magic combine wherever two layers act on the same trait: a steam engine run on a Beyonder's flame, an amulet charged by a battery, a charm that changes friction. The engine needs no special case for the combination, because both layers read and write the same traits (XC8) through the same procedures (XC7). Default: every world inherits the ordinary physical layer from the field layer, and magic layers add on top. Dial: how much the ordinary layer is simplified per world. Reason: LOTM's Steam and Machinery Church, artificers and HP's wizarding blind spot for Muggle tech are canon examples of layers meeting or failing to.

**XC11 (proposal): educational where the world runs on real science.** In worlds whose ordinary layer is real (Tingen's chemistry and engines, the Muggle world, the Village's farming and smithing), the ordinary layer follows real principles in simplified, banded form: combustion needs fuel, heat and air; alloys trade hardness for brittleness; dilution weakens a dose. The Notebook explains the principle the player just observed, in the world's voice, once they have seen it happen. Magic layers follow their own canon and are labelled as such, so play never teaches a fictional rule as real. Default: principles at the level of a good school textbook. Dial: depth per world and an option to show the real-world note. Reason: the player learns by experimenting, which the engine already supports. Guard: dangerous real procedures (explosives, toxins, weapons) stay banded and abstract, never step-by-step.

**XC12 (proposal): general research as discovering the world's own law.** Research is a procedure (XC7) whose product is knowledge, not an item. What there is to research comes from what the player does not yet know about the world's law: a hidden trait, a law row, a recipe, a missing part. That makes the research tree generated from the law rather than authored as a list. Knowledge has fidelity steps (TK0 rumour to TK4 recipe and beyond), and sources are experiment, reading, teaching, observation and insight (TN). An experiment is a hypothesis tested on the real engine: choose ingredients or conditions, run the procedure, observe and record. That is the scientific method as play, and the core of XC11. Default: the inquiry seam is the research container, and the trait engine is the lab. Dial: how fast fidelity rises per source per world. Reason: abstract research then needs no per-topic code; every law row a world declares is something that can be discovered.

| ID | Disposition | Consideration | Next check |
|---|---|---|---|
| XM21 | ACCOUNT FOR NOW | Real-science accuracy is a factual claim (AGENTS: separate verified facts from inference). Each principle the Notebook teaches needs a cited source. | A principle row carries its source before it ships |
| XM22 | ACCOUNT FOR NOW | Layered law can let a cheap magic trait cancel an expensive physical one and break economies (AD22 says no anti-cheat hardening, but world agents still push back). | One layered interaction priced by both layers' price lists |
| XM23 | ACCOUNT FOR NOW | Research generated from hidden law must not reveal sealed secrets by listing what is unknown. | Default: an unknown the player has not noticed shows as nothing; once noticed (an anomaly seen, a rumour heard, a failed brew) it becomes an identified unknown with a placeholder name, researchable like any other node (refined 2026-11-08, XC14). Dial: a world whose lore openly names a mystery can list it. Reason: the sealed-secrets rule |
| XM24 | LATER (medium) | `craft_process_thermal` has no importer and the field layer has two; heat and pressure are the first ordinary-layer laws to wire into potions and smithing. | One brew and one forging step read heat from the field layer |

### Exotic materials, research outputs and the research map (2026-11-08)

Weibao, 2026-11-08: "magic stuff/'scifi' alloys and stuff and more? Would general research also be procedural? Would it work towards understanding abilities and more? or result in better potions? Would we need to abstract into progress bar kind of stuff? XM23 does make sense but researching to understand an identfieid unknown could be a interesting endeavor, representing in UI might be hard tho, should it be some sort of tree that has a adjustable canvas? Consider speific research and more? Maybe this is where all the minecraft mod research comes in,"

Read against the [research representation](../representations/RESEARCH.md) (built slice: study rows, `research_view.js` projection, Study panel, a dependency-map figure; "two bars", understanding from research and usability from practice; a tree as the main view considered and rejected while only two studies existed), the [Minecraft magic research audit](../research/minecraft/audits/MR_MAGIC_RESEARCH.md) MR1-MR9 and [TECHNOLOGY_AND_PROGRESSION](../TECHNOLOGY_AND_PROGRESSION.md) TK, TGR6 and RB6. Nothing was run.

**XC13 (proposal): exotic and sci-fi materials are ordinary materials with layer traits.** Mithril, orichalcum, a Beyonder-touched metal, a Gu-refined alloy, an exotic sci-fi composite: each is a material in the same `craft_materials` catalogue whose traits come from more than one law layer (XC10), such as hardness and weight from the physical layer plus spirit conductivity or mana capacity from a magic layer. Alloys and composites are trait mixes resolved by the world's law, fitted to canon examples (XC6), so new alloys can be generated and invented. Default: a world's canon materials are anchors, and generated ones stay inside its trait ranges. Dial: how wide invention can range. Reason: one material model covers fantasy, magic and sci-fi without a separate exotic system.

**XC14 (proposal): research is procedural and pays out into the other engines.** Research produces knowledge with fidelity (TK), and knowledge changes what the other engines let you do:

| Researching | Pays out as |
|---|---|
| An ingredient or material | Its hidden traits revealed: better substitutions, new recipes, better potions and alloys |
| An ability (your own or one observed) | Its descriptor parts and price understood: lower cost, fewer failures, counters, new compositions (XP2) |
| A procedure or rite | Its conditions understood: higher grades, safe substitutes, shortened steps |
| A person, group or place | Ties, motives and law rows of that society |
| An identified unknown | What it is, step by step from rumour to principle; this is where a mystery becomes play |

The progress shape borrows from the Minecraft research corpus rather than a single bar:
- Two kinds of input, seen and thought, as in Thaumcraft's Observation and Theory (MR1): observation comes from looking, experimenting and being taught; theory from study time.
- Routine accumulation shows as a bar, compressed by ACR when repeated.
- Breakthroughs are discrete moments with visible odds (MR3), which feel like discoveries rather than waiting.
- Some knowledge carries a cost on the reader where the world says so (LOTM's danger from knowing too much, TGR6 and RB6).

Default: a bar per fidelity step, plus discrete experiment and insight moments. Dial: the odds and the share of seen versus thought per world. Reason: pure bars turn research into waiting, while pure puzzles turn it into homework.

**XC15 (proposal): the research map as a pannable, zoomable canvas.** Nodes are knowledge items at their fidelity, edges are "needs" and "came from", and identified unknowns show as fogged nodes with a placeholder name. The map is generated from the knowledge records, not authored. The earlier rejection of a tree as the main view rested on there being two studies; generated research (XC12, XC14) makes the node count large, which is the reopen trigger. Default: the queue and inspector stay the main view; the canvas opens from Study and centres on the selected node. Dial: which edges show. Reason: a canvas suits a graph that grows without bound, and desktop is the target viewport. Reuse: `figure.js` positioned nodes and the planned layered layout (RESEARCH M2).

**Specific research.** Each world can still define named research with its own currency and law (Thaumcraft aspects, Ars Magica laboratory seasons, LOTM's acting and digestion as a form of understanding, Hogwarts homework and exams). These are data on the same research procedure, not new engines.

| ID | Disposition | Consideration | Next check |
|---|---|---|---|
| XM25 | ACCOUNT FOR NOW | Research that improves abilities overlaps with practice and digestion. Each growth route must record its cause (SLR4) and not double-count. | One ability improved by research and by practice, with two recorded causes |
| XM26 | ACCOUNT FOR NOW | A generated map can become a wall of nodes. | Default zoom shows only nodes within two steps of the current focus |
| XM27 | LATER (medium) | The Minecraft audits (MR, SR, GT, TA, WV2-WV3) hold many more mechanisms (tiers, flux and warp, automation chains). They should be mapped onto these engines as rows before anything is built. | One audit's findings classified by engine and law row |

## Approach review for the remaining waves (2026-11-08)

Order superseded by Weibao’s later 2026-11-08 instruction to finish wave 3’s engines and source-shape checks before resuming story windows. The [current task record](../gm/dispatch/cross-world-systems-2026-11-07/CHECKPOINT.md#wave-3-engine-completion-2026-11-08-current) owns execution; the review below remains historical.

Weibao, 2026-11-08: "first consider if better way of going about them, and then once improved.decided, continue accordingly, consitder wether if more progress needs to go into the protaginist playtrhough to help feed certain features". He delegated the decision; this section records it as decided under that delegation, applied in the [cross-world record](../gm/dispatch/cross-world-systems-2026-11-07/CHECKPOINT.md).

**What the evidence says.**
- Klein's story endpoint has stayed at KJ3AE (ch69 P082) since 2026-11-04. KJ3AE recorded the R5 rites and both B3 Spirit Vision uses as facts, not mechanisms (F6).
- Harry's road to Hogwarts, the Sorting and first lessons exist in code, but HP plan windows W5-W10 are still marked proposed. W6 (Sorting, first days, the potions master) and W7 (flying, the duel, Halloween, house points, the troll) are dense with exactly what wave 3 builds.
- Remaining wave 3 and 4 slices mostly lack a live consumer: the powers grammar has two anchors per world, potions beyond the Seer brew have no reachable window, and reputation and the second tie shape have nothing in play that reads them. Seam-first slices without callers failed four times in the overnight run (AT27).
- XC5 makes walked canon events the calibration data. Fewer walked events means less to calibrate against.

**Answer to the playthrough question: yes.** Story progress is now the bottleneck for several features: calibration anchors in play, potions beyond the first, Klein's rites, reputation and house points, a dormitory to live in, and later house buying (Backlund). The fix is not a pause in engine work but a fused order.

**Decided (D-A to D-D).**

| Code | Decision | Reason |
|---|---|---|
| D-A | **Story-led integration waves.** Each wave takes the next Klein window, then the next Harry window (LOTM first). Each window names the engine parts its canon events need and builds them as shared, world-neutral parts through the ports, with the window as their consumer in the same wave. | Matches the standing "mechanism slices lead, book windows follow as consumers" (2026-11-02) while closing the AT27 gap; each part lands with a caller and calibration data |
| D-B | **Anchors come from source reading as well as walks.** Fitting price lists and recipe laws (XP3, XC6) uses census rows of what the books state about abilities and potions, read by bounded haiku readers (AU5). Walks validate, they don't have to supply every anchor. | Anchors for a whole first-year spell list or a pathway's formulas don't need the story to reach them |
| D-C | **Fixture-first walks.** Each window ends with a saved fixture (AD54 O1), and the next window starts from it, with no full-route replays. | The 150-task Klein walk showed replays are the expensive part |
| D-D | **Engine-only slices only when structural** (registries, save shapes) or when no window will pull a part soon. Wave 4 domains are pulled by windows too: medicine by an injury or the hospital wing. | Keeps every slice playable and avoids idle seams |

**Revised order.**

| Wave | Klein window | Harry window | Engine parts pulled |
|---|---|---|---|
| 3' | kjw22, from ch69 P082 | W6: Sorting, first days, the potions master | W3b powers grammar on the descriptor, anchored by Klein's divination methods and Spirit Vision plus Harry's first-year spells; W3d procedure layer and shared traits through R5 rites (Agent part) and Harry's first Potions brew; dormitory as a location (home) |
| 4' | kjw23 | W7: flying, the duel, Halloween, house points, the troll | W3e reputation view and house points (money-less obligations, LARGER F6); second tie shape (rivalry with Draco, friendship with Hermione); medicine (hospital wing) as the first W4a domain |
| Later | following windows | W8 onward | Remaining W4a domains, W5a and W5b, as windows pull them |

Rejected: finishing every engine wave before story windows (repeats AT27 and leaves calibration without data), and story windows with fact-only mechanisms (repeats F6). Not changed: Klein first, Harry alongside, Frontier and Mistglass get no new depth, and every slice lands at floor or is recorded below it.

## Engine growth as a gap finder, and the Minecraft mapping (2026-11-08)

Weibao, 2026-11-08, after the wave-3 engine work: "The engines first growing is a good thing, since it shows gaps we have and will eventually need to address". This replaces the proposed fixed exit bar for engine work (D1 in that chat), which treated growth as scope creep.

State at the time: the wave-3 engines (powers grammar, procedure layer and shared traits, reputation view, homes and ties) are implemented and agent-verified, not human-reviewed, per the [cross-world record](../gm/dispatch/cross-world-systems-2026-11-07/CHECKPOINT.md#wave-3-engine-completion-2026-11-08-current). They were uncommitted when this was written. The source-shape check (D2 in that chat) landed with them as `SOURCE_SHAPES.md`.

| Code | Decision | Default, dial and reason |
|---|---|---|
| D-E | **Engine growth is welcome, and every gap it finds is recorded.** When a shape check, a source row or a caller finds something an engine can't express, it becomes a gap row: what's missing, which source or caller showed it, which engine owns it, and what will pull it. | Default: build a gap now when a lead caller or a source-shape row uses it, and log it with its expected puller otherwise. Dial: how far ahead of callers engine work runs, raised by Weibao's direction here. Reason: growth shows the real shape of the engines, and logging keeps the AT27 idle-seam risk visible instead of hiding it |
| D-F | **Map the Minecraft research onto the engines before building more from it** (XM27, raised from LATER to next). Each mechanism in the 17 audits under `docs/research/minecraft/audits/` (MR, SR, GT, TA, TB, WV2, WV3, EP, GL, WC and the syntheses) is classified once. | Classes: fits an existing engine as data (name the engine and law row), needs a missing part (becomes a D-E gap row), or is out of scope for the life sim, with a reason. Done check: one table, `docs/research/minecraft/ENGINE_MAPPING_2026-11-08.md`, with every audit's mechanisms classified and unmapped residue listed. Docs only, one sonnet reader per shard of audits, no runtime edits. Reason: a source unlike either book tests the engines' shape from outside the two leads |

Still open from that chat: kjw22's mechanisms (AT34) before Klein's story windows resume, and rebuilding the installed app (AT36) once the wave-3 work is committed.

**D-F result, 2026-11-08.** The [engine mapping](../research/minecraft/ENGINE_MAPPING_2026-11-08.md) classifies 561 mechanisms from the 17 audits: 409 fit an existing engine as data, 102 need a missing part and 50 don't fit the life sim. The 102 gaps collapse into 18 missing parts (MG1-MG18), each with an owner and a puller, which start the D-E gap ledger. Proposed first picks with lead callers: MG1 (overdraw into the body, Klein's spirituality), MG7 (plan before you make) and MG2 (standing procedures). Readers worked from engine descriptions; a spot-check corrected three gaps that partly exist already. Docs only, nothing run.

## Pool limits, the player as an outsider, and Minecraft-style progression (2026-11-08)

Weibao, 2026-11-08, on MG1 and the mapping: "Past pool can simply be unable to use and maybe reduced stats? Make it reasonable and more? COnsider hte fact that we, as the player, is simply different after all, what about research and tech progression and more from minecraft mods?"

Proposals, not accepted decisions (AD32).

| Code | Topic | Proposal |
|---|---|---|
| XC16 | **Past the pool** (reshapes MG1) | Default, in three grades: a pool near empty **strains** (reduced focus, precision and success odds, slower recovery while you keep pushing); an empty pool **refuses** the ability, with the reason shown; spilling past empty into the body (health, injury, lasting harm) is an exception a world grants with its own cost, as in Blood Magic. Recovery is rest, sleep, food and the world's restoratives. Repeated strain trains capacity a little in worlds whose lore says so. Dial: per world and per pool, the strain threshold, the stat hits and whether push-through exists. Reason: refusal plus fatigue is the ordinary case in most sources and keeps an empty pool readable. Klein's canon low-spirituality effects get confirmed from the census (D-B) before numbers are set. Engine: the existing pool plus a graded "strained" condition the power grammar's quote reads, with each stat hit recording its cause |
| XC17 | **The player is different** | The player brings habits a native lacks: systematic notes, controlled experiments, planning tools, tier-and-tree thinking from modded games, and for book worlds some memory of the canon. Default: that difference shows as **method**, not raw power. Notes keep better (the Notebook), experiments are logged and compared (`craft_experiment_log`), plans show missing inputs (MG7), and an unknown can be named and researched sooner (XM23). Each method costs in-world time, materials or attention, and world agents can notice odd behaviour through their own means (WER12: divination, fate, gossip). Dial: per start, how much outside knowledge the character carries (born there, transmigrator like Klein, the player as himself), and per world, how reliable canon memory is where truths are changed (sealed secrets). Reason: Weibao is essentially the only player (AD22), so the question is fit, not fairness; method keeps the difference playable without breaking world law (AD38) |
| XC18 | **Research and tech progression from Minecraft** | Four shapes carry over, mapped onto the engines: (1) **tier ladders**, where each tier's station is built from the previous tier's products (GT voltage tiers, TGR7), on E-MAKE with MG6 and the TK0-TK5 knowledge levels; (2) **discovery-gated research**, where observing and taking things apart earns research input (TGR6 scanning, TGR3 fragments, TGR5 disassembly), on E-RES with observer-held knowledge; (3) a **visible progression map** like a quest book, on MG17 and the XC15 research map; (4) **automation as the idle layer**, hand work then tools then helpers then standing orders, the late-game arc of most modpacks and the core of an idle game. Default: anything done by hand often enough can be handed to the world's means of delegation (a hired hand in Tingen, a house-elf, a golem, a machine), at their cost and quality. Dial: per world, which tiers and delegation means exist; Tingen has steam-age industry beside mysticism, the wizarding world mostly replaces machines with charms. Reason: these four shapes are what the 17 audits share, and automation joins the Minecraft arc to the idle genre |

### More to consider (round on XC16-XC18)

| Code | Level | Consideration | Done check |
|---|---|---|---|
| XM28 | ACCOUNT FOR NOW | Strain's stat hits overlap with injury and fatigue from other causes. Each hit records its cause (SLR4) so recovery removes the right one and nothing double-counts | A strained, injured caster recovers each cause separately |
| XM29 | ACCOUNT FOR NOW | Canon memory (XC17) must not leak sealed truths: where a world's truth is changed or randomized, memory is a belief, not a fact, and the foreknowledge certainty lens (Mother of Learning) is the model | Memory of a changed truth shows as uncertain and can be proven wrong in play |
| XM30 | ACCOUNT FOR NOW | Knowing a recipe (TK4) shortens research but not construction: the station, tools and materials of its tier are still needed, and a low-tech setting pays more to build above its level (TGR4) | An outsider who knows a recipe still needs the tier's station to make it |
| XM31 | LATER (medium) | Automation can make mastery pointless. Default: delegated output is steadier but plainer than master hand work (TK5); dial: a world's best machines match it | One delegated product with a lower quality ceiling than the master's hand-made one |
| XM32 | LATER (medium) | Automation runs while the player is away, so it joins the idle offline loop. Upkeep (MG2) and supply (MG13) bound it, so an offline factory stalls instead of running forever | Offline delegation stops when its upkeep or inputs run out |
| XM33 | LATER (small) | Across lives and crossings (WER), knowledge and notes can carry over and stations can't, by default. Dial per crossing | A crossing keeps one note and drops one tool, with the reason shown |

## Hunger that doesn't kill, shops, productive places and the rat cellar (2026-11-08)

Weibao, 2026-11-08: "Player also cant physically die from hunger, which has to count for something right? other stuff and more? We can create a shop that sells something in demand? Other aspects to consider? We need to create enviorments to farm things, both like creaturs to kill or like actually farm to create some sort of economy? Would we have a endless basement of rats or something? more to consider?"

What exists (read 2026-11-08, no run): hunger is optional and default-off, drains a bar over eight played hours and lowers XP efficiency to 80% at worst ([hunger considerations](../HUNGER_AND_BODILY_NEEDS_CONSIDERATIONS_2026-10-13.md) D1, C1-C4, and the Proto23 non-lethal model there); `market_saturation.js` lowers a loot price as more of it sells in a region; `gathering_model.js` sites hold stock, deplete and regrow per day; `world_completion_crop_clock.js`, the Paradise coppice nursery and the frontier bow cover first crops, a managed wood and hunting; `creature_layers.js` builds creatures from removable templates. Proposals below, not accepted decisions (AD32).

| Code | Topic | Proposal |
|---|---|---|
| XC19 | **Hunger that can't kill still counts** | Default for the player: hunger does not kill, and it still costs. Low fullness stops natural healing and recovery, then strains like a low pool (XC16: precision, stamina, success odds), and the body adapts a little with repeated going without (Proto23's Famine skill). Food then matters as a decision (C1): rations, an inn, foraging, cooking for bonuses, hosting. Dial: per world and body, whether hunger exists, how hard it bites, and whether it can kill (a survival segment, a famine, NPCs without supplies under C3). Reason: XC17 says the player is different, and a body that can't starve is one of those differences; it counts as a softer floor, not as no cost. It also follows the existing default-off, non-lethal direction instead of replacing it |
| XC20 | **A shop that sells what's in demand** | A shop is a home-engine room or stall (tenure law: rent a stall, own a shop) plus the economy: you make or buy stock, set prices, and buyers come from demand. Demand is visible as signals you can learn to read (XC17 method): requests and shortages (MG13 request chains), seasons and events, a rival's prices, and what sells out. Selling the same good floods it and the price falls (`market_saturation`, already per region). World agents push back by their own means: a guild wants a licence, a landlord wants a cut, a rival undercuts, a tax collector visits. A clerk or apprentice can mind the counter (XC18 delegation) at lower skill than you. Dial: per world, what may be sold without a licence and who notices. Reason: joins making, homes, economy and standing, the cross-system test the ports exist for; Klein's canon route doesn't run a shop in volume 1, so it is free play there, and the Village is the first natural caller |
| XC21 | **Productive places: farms, herds and hunting grounds** | One shape for anything that renews: a place holds a population or a yield with a cause, grows toward a carrying capacity, and is depleted by taking. Wild game and fish regrow from survivors (slow when overhunted, fast when left alone), with seasons and predators as inputs; farms add effort and inputs (plots with fertility, MG gap D; crops on the crop clock; livestock that breed, eat and need care); creatures that drop magical ingredients follow their world's law, so LOTM's Beyonder ingredients are scarce and dangerous, not farmable by default, while Hogwarts' greenhouses are a canon farm (Herbology). Land needs tenure like a home (rent a field, work someone's estate, poach and raise heat). Dial: per place, capacity, regrowth rate and who owns it. Reason: AD38, things renew by how they renew; it extends `gathering_model` sites (stock, depletion, regrowth) instead of a new engine |
| XC22 | **An endless basement of rats** | Default: no endless spawn without a cause. A cellar has rats because of something: a sewer link, stored grain, a breeding colony. They regrow from survivors and inflow, so clearing the cellar gives a short break; blocking the cause ends the job for good. The job pays as pest control from a landlord or innkeeper (ties to XC3 tenure and LT8 ties), with small extras (practice, cheap ingredients that saturate fast). A truly endless source exists where the world has a mechanism for one (a spawner, a summoning circle, a dungeon heart, a curse), with that mechanism's cost and risk. Dial: per world, which endless sources exist. Reason: the classic cellar grind becomes a reasonable early idle loop, low pay and low risk, that ends when you fix the cause, which is itself a choice (steady income or a grateful landlord) |

### More to consider (round on XC19-XC22)

| Code | Level | Consideration | Done check |
|---|---|---|---|
| XM34 | ACCOUNT FOR NOW | Hunger strain, pool strain and injury all lower the same stats. One condition list with causes (XM28, SLR4) keeps them from stacking without limit and lets each recover on its own clock | A hungry, strained caster shows two causes and recovers each separately |
| XM35 | ACCOUNT FOR NOW | Renewing places run while the player is away (C3, XM32). Regrowth and breeding follow the world clock, and offline catch-up uses the same rule, capped by capacity | A hunting ground left alone for a week regrows to its cap and no further |
| XM36 | ACCOUNT FOR NOW | Overharvest is observed by others: a gamekeeper, a rival hunter, a landlord. Taking from owned land is knowledge with an audience (W3e reputation view), so poaching raises heat where someone can see it | Poaching on a watched estate changes one audience's view; unwatched land changes none |
| XM37 | LATER (medium) | A shop's demand needs buyers with reasons. The first slice can use world demand rows (season, event, shortage); later, NPC needs and traders (MG13, MG15) supply them | One good whose demand rises with a season and falls when you flood it |
| XM38 | LATER (medium) | Farming and herding want a calendar with weather, and animals want care and feed. These use E-GATH seasons and the delegation shape (XC18) instead of separate timers | One crop and one animal on the same world clock, cared for by a hired hand |
| XM39 | LATER (small) | Debug and inspection: a place inspector showing population, capacity, regrowth and the cause of renewal makes ecology tuning legible without changing state | The inspector reads one place's numbers and changes nothing |
| XM40 | LATER (small) | A world that grants hunger death (a famine arc) needs fair warning and relief routes (C1) and a recorded reason; the player's soft floor is the default, not a guarantee in every world | One world row that turns lethal hunger on, with its warning shown |

## Simple first: sell to anyone, a grind spot in every world (2026-11-08)

Weibao, 2026-11-08: "For selling, cant we just find a bazarr or a npc to sell things to> more to consider? Other aspects? XC21, how to consider accordingly? we need something in each world to grind in, endless mining for endless mining, enldess, or well, combat that continues for a certain point? more to cnsidr? consider how YAIR or proto23 or otherd handle these? Some stuff can just remain simple, consider hwaat is theb est way to go about these?"

**How YAIR and Proto23 do it (read 2026-11-08, no run).**

| Source | Selling | Grinding |
|---|---|---|
| YAIR (upstream, still in this fork) | Named traders (`src/data/traders.js`): an inventory template per place, a restock every few hours and a profit margin per trader (4 for the village, 20 for the cat cafe). Any trader buys your goods; `market_saturation.js` lowers the price of a loot type the more of it you sell in a region | `CombatZone` (`src/models/location.js`): endless enemy groups, a clearing count (default 30), a first-clear reward and a repeatable reward after it. The place's text changes as you clear it (the Nearby cave and its wolf rats). Gathering activities (mining, woodcutting, fishing) run without end and scale with skill and tools |
| Proto23 (as absorbed in `src/absorb_p23/`) | A market with customer favours and changing notices (`market_life`, a Village proposal) | Level-banded areas with readable moves and layered area loot (`encounter_profiles`), familiarity that grows with repeat visits to a place (`field_familiarity`), and a repeatable search whose stock is replenished by events, not accumulated (`repeat_search`). Hunger drains energy without killing (see XC19). Exact Proto23 vendor and respawn numbers are unverified in this pass |
| Others (from TGR and the idle genre, recalled, not re-read) | Melvor-style sell-anywhere at a fixed price; RuneScape-style specialist shops paying more for their goods | Melvor and RuneScape: endless skilling spots, combat areas with level bands, returns that fade as you outgrow a spot |

**The read.** Simple already works and is already here. Every source keeps the everyday loop plain: anyone buys at a margin, a spot pays forever, returns fade as you outgrow it. Depth (XC20 shops, XC21 renewal by cause, XC22 the cellar's cause) sits on top where a world or a caller wants it, and is never required for the loop to run.

| Code | Topic | Proposal |
|---|---|---|
| XC23 | **Sell to a buyer, simply** | Default: each world has ordinary buyers you can find, such as a bazaar, a pawnshop, a general dealer or a market stall, who buy most goods at a margin on YAIR's trader shape, with saturation lowering repeated sales. Specialists pay more for their own goods (an apothecary for herbs, a smith for ore). Illicit goods go to a black market or a Beyonder gathering, where selling raises heat if seen. The player's own shop (XC20) is an optional layer for steady income, not the way to sell. Dial: per world, which buyers exist and what each refuses. Reason: selling should be one click in the ordinary case; the world's law decides who buys, not a new system |
| XC24 | **A grind spot in every world** | Default: every start has at least one safe, repeatable loop from day one, plus a riskier one for when you're stronger. Combat zones follow YAIR: endless groups, a clearing reward, text that changes as you clear, and XP, loot and price returns that fade as you outclass the spot, so combat "continues to a point" by paying less instead of stopping. Mining and other gathering are effectively endless at one person's scale: a real seam outlasts one worker's life, so `gathering_model` capacity is set large for deep sources and small for surface pickings. Lead candidates: Klein in Tingen, paid work and practice (divination drills, guard shifts, firearm practice), with danger reserved for rare Beyonder fights; Harry, class practice, homework and greenhouse work, with combat rare by canon; the Village keeps the cave, forest and mine. Dial: per world, which loops exist and how fast they fade. Reason: an idle game needs a loop that never stalls, and each world's canon decides what that loop looks like |
| XC25 | **Simple by default, depth when pulled** | The method for all of XC19 to XC24: each system ships its simple layer first, on existing YAIR or Proto23 shapes, and gains a deeper layer only when a lead caller, a source row or Weibao's request pulls it (D-E). The simple layer obeys world law through data (who buys, what regrows, what is dangerous), not through extra mechanics. Reason: Weibao, "Some stuff can just remain simple"; the deep versions stay recorded so nothing is lost |

### More to consider (round on XC23-XC25)

| Code | Level | Consideration | Done check |
|---|---|---|---|
| XM41 | ACCOUNT FOR NOW | Story walks must not need grinding. Canon pace is calibrated without grind time (AD49, XC5); grind is free play, so a canon route reaches its events on story actions alone | A canon fixture reaches its next event with no grind loop run |
| XM42 | ACCOUNT FOR NOW | Returns that fade should reuse existing levers (saturation for money, level gap for XP, practice decay for skill) rather than a new cap | One spot whose pay falls with level gap and saturation, with each cause shown |
| XM43 | ACCOUNT FOR NOW | Simple buyers still respect world law cheaply: a pawnshop refuses Beyonder ingredients, a student can't sell at a Diagon Alley shop, and so on, as rows in each trader's template | One refusal per lead world, with its reason shown |
| XM44 | LATER (small) | Grind texture is cheap legibility: YAIR's changing place text, Proto23's familiarity. Each grind spot gets progress text and a familiarity gain from repeat visits | A spot's text changes twice with progress |
| XM45 | LATER (small) | Long grinds want small surprises: a storylet card (a rumour, a mugging in the sewers, a rare find) drawn while grinding keeps a loop alive without a new system | One grind spot draws one storylet card at a stated rate |
| XM46 | LATER (small) | Proto23's exact vendor and respawn numbers are unverified here; read its pinned source before copying any number | Numbers cited with a line reference before use |

## Creatures at Hogwarts, open futures, and modern society beside magic (2026-11-08)

Weibao, 2026-11-08: "does hunting and skinnign creatures make sense for hogwarts xD I think maybe but also idk / These ideas are good, but it shouldnt limti any future prospects / For wildrness maybe, but in general idk. also how to implement the modern society thing that can apply to worlds with well, some sort of modern society in conjunction with their magical stuff?"

Recorded direction: these proposals are defaults for a first slice and close no future option ("it shouldnt limti any future prospects"). Each one keeps its dial, and a later world, start or idea can take a different setting with its reason (AD5). Proposals below, not accepted decisions (AD32). Canon notes are from general knowledge of the books, to confirm from the census before numbers or content are set.

| Code | Topic | Proposal |
|---|---|---|
| XC26 | **Creatures at Hogwarts: care and harvest, mostly not hunting** | Default for a student: creatures are cared for and harvested, not hunted. Herbology yields ingredients from plants, Care of Magical Creatures handles live animals, and many potion ingredients come from shed or gathered parts (hair, feathers, venom, slime) rather than a kill. Killing a protected creature is a crime in canon with real weight (the unicorn in book one), so it raises heat with the authorities who see it. Hunting and skinning do exist in that world as regulated adult trades (dragon hide, keepers, licensed dealers, the creature-regulation office) and as illegal poaching, reachable later or in the wilderness. Dial: per place and start, whether hunting is open, licensed, illegal or unthinkable. Reason: the world's law decides, which is XC24's grind default seen through Hogwarts; the forest edge (H4) stays dangerous and rare |
| XC27 | **A modern-society kit** | Many worlds pair magic with a mundane society: wizarding Britain beside 1990s Muggle Britain, LOTM's steam-age cities beside hidden Beyonders, later and future settings in other books. One kit of world data on the existing society seams covers it, with no engine per world. **Era** sets what exists (gas lamps and telegraphs, telephones and cars, phones and the internet) and feeds layered law (XC10) for how tech and magic interact (electronics failing near strong magic is a canon HP case). **Institutions** come from positions, duties, the purse, `institution_store`, `institution_access` and `law_case`: banks and exchange, jobs and wages, rent and tenure, police and courts, schools, hospitals, records and ID. **Daily rhythm** comes from the world calendar and rhythm seams: work hours, timetables, shop hours. **Media** is a knownness channel: newspapers, gossip, broadcasts spread word at their own speed. Dial: per world, era and which institutions exist. Reason: modern life is mostly institutions and timetables, which the society seams already model |
| XC28 | **The veil between the mundane and the magical** | The hinge of a modern-and-magic world is who can see what. Default: two kinds of audience, mundane and magical, on the W3e per-audience reputation view, so one act lands differently with each: casting in front of mundane witnesses raises heat with the magical authority that enforces secrecy (the Statute of Secrecy and its memory-wiping teams in HP, the churches and Nighthawks in LOTM), while mundane police see only a strange incident. Crossing the veil uses ordinary mechanisms: currency exchange (Gringotts changing pounds), mundane goods in magical shops, mundane jobs as cover. Dial: per world, how strict the veil is, who enforces it and what a breach costs; some worlds have no veil at all. Reason: secrecy already decides who sells and who notices (DEEP_WORLD_WORKFLOW), and per-audience knowledge (AD6-AD8) carries it without a new store |

### More to consider (round on XC26-XC28)

| Code | Level | Consideration | Done check |
|---|---|---|---|
| XM47 | ACCOUNT FOR NOW | Mundane and magical prices differ and exchange between currencies; the economy port already has world money words, so the veil adds an exchange rate, not a second economy | One purchase in pounds converted to wizarding money at a stated rate |
| XM48 | ACCOUNT FOR NOW | Mundane witnesses have their own knowledge and memory; a memory charm edits an observer's records (AD6-AD8), which is a mechanism with a cost and a trace, not a reset | A wiped witness forgets one fact, and the wipe itself is a fact someone else can know |
| XM49 | ACCOUNT FOR NOW | Era gates content cheaply: a phone in 1991 is a landline, and LOTM has telegrams, not phones. Each row names its era so a world can't offer something that doesn't exist yet | A Tingen action list shows no telephone, and a 1991 one does |
| XM50 | LATER (medium) | Modern jobs are good grind loops (XC24): shifts with wages, promotion by duty record, and a mundane cover job for a magical life. The guard contract in Tingen is already one | One mundane job in a modern world paying shifts on the duty seam |
| XM51 | LATER (medium) | Creature trade spans both sides of the veil: magical parts sold to apothecaries, illegal poaching, regulated hunting licences. The trader templates (XC23) and law cases cover it | One creature part sold legally and one sold on the black market, with different heat |
| XM52 | LATER (small) | Muggle-born and transmigrator starts (XC17) cross the veil from the mundane side; their mundane knowledge is method on that side, as XC17 describes | A Muggle-born start knows one mundane thing a pure-blood start doesn't |

## A comprehensive society kit, norms, and mundane people in magical societies (2026-11-08)

Weibao, 2026-11-08: "Children can do that but might be frowned upon, what should we do for a comprehensive society kit? More to consider? Muggle living in magic societty? other aspects to conisder?"

Proposals, not accepted decisions (AD32). Seams named below were listed from `src/` on 2026-11-08; their depth was not re-read.

| Code | Topic | Proposal |
|---|---|---|
| XC29 | **Allowed but frowned upon** (refines XC26) | A student can hunt, harvest or skin where the means exist; nothing blocks it by label (AD38). What changes is how people react: classmates, teachers, parents and the creature authorities each judge it through their own norms, from a shrug to detention, house points, a letter home or a case. Default: social cost, not a wall. Dial: per world and audience, how strongly an act is judged. Reason: this is the general case of norms (XC30), and it keeps the option open as Weibao directed |
| XC30 | **A comprehensive society kit** | Ten layers of world data, most on seams that already exist. A world fills the ones it has; an empty layer means the world doesn't have it. The table after this one maps each layer to its seams and the parts still missing |
| XC31 | **Mundane people in a magical society** | Default: a body without the world's power is an ordinary start with the same systems, under a different law. The power grammar refuses spells for want of a pool (XC16 refusal), while items, potions, trade, work, ties and research still work wherever their mechanisms don't need the power (to confirm per world: which HP potions and devices work for a non-wizard). Perception is part of the law: some enchanted places hide from mundane eyes (the Leaky Cauldron in canon), and a few non-wizards can see them (Squibs). Status follows the world's norms: in HP, Squibs and Muggles face prejudice and pure-blood politics. Their roles are real ones (a caretaker, a family member, a liaison, a shopkeeper's mundane supplier), and their method is mundane knowledge and tools (XC17), limited where tech fails near magic (XC27). The same shape covers ordinary people in LOTM and mortals in cultivation worlds. Dial: per world, what the powerless can perceive, use and become. Reason: most people in most of these worlds have no power, so this is the ordinary life the society kit models |

**The ten layers of XC30.**

| Layer | What it holds | Existing seams (by name) | Missing part |
|---|---|---|---|
| SKIT1 Era and technology | What exists and how it interacts with magic | layered law (XC10), `field_layer` | Era tags on content rows (XM49) |
| SKIT2 People and roles | Who lives here, their jobs and households | `people_sources`, `generated_people`, `positions`, `cast_schedule`, the society residents in `feature_expansion_society` | None for a first slice |
| SKIT3 Status and standing | Class, rank, blood status, caste, titles, and how they shape access and treatment | `faction_rank`, `rank_gap_observer`, `authority`, `reputation_view` | A status hierarchy row per world that other rows can read |
| SKIT4 Norms | Which acts each audience approves, frowns on, reports or punishes, adjusted by the actor's age, role and status | `observer_view`, `authority_witness`, `heat`, `heat_grades` | **A norms table**: act kind, audience, reaction, modifiers. The key new piece; XC29 and XC28 both read it |
| SKIT5 Institutions | Government, courts and police, churches, schools, guilds, banks, hospitals, the press | `institution_store`, `institution_access`, `law_case`, groups, the church positions in LOTM, school positions in HP | Licences and taxes as institution rows |
| SKIT6 Economy | Money, wages, prices, rent, debts, black markets | the economy port, purse, `obligations_ledger`, traders (XC23), `market_saturation` | Exchange between currencies (XM47) |
| SKIT7 Daily rhythm and travel | Calendar, holidays, work and shop hours, timetables, transport | world calendar and rhythm, `book_world_hp_school_calendar`, `travel_legs` | Scheduled transport (a train that leaves at eleven) as data |
| SKIT8 Information | Gossip, newspapers, broadcasts, records and ID, surveillance | knownness, `people_knowledge`, inquiry | Media channels with their own spread speed |
| SKIT9 Life stages and law | Childhood, majority, guardianship, marriage, inheritance, age gates such as HP's underage-magic Trace | `lineage_domain`, households, duties | **Age and legal status** on the actor, read by norms, institutions and powers |
| SKIT10 The veil | Who can perceive and know what across mundane and magical sides | XC28 audiences, `observer_view` | Perception law per observer kind (XC31) |

The first slice that tests the whole kit is small: SKIT4 norms plus SKIT9 age, with one frowned-upon act (a first-year skinning a creature) judged differently by a classmate, a teacher and the creature authority.

### More to consider (round on XC29-XC31)

| Code | Level | Consideration | Done check |
|---|---|---|---|
| XM53 | ACCOUNT FOR NOW | Norms and law differ: an act can be legal but shameful, or illegal but admired. SKIT4 holds social reaction and SKIT5 holds legal consequence, and an act can trigger either, both or neither | One act frowned on without a crime, and one crime some audience admires |
| XM54 | ACCOUNT FOR NOW | Prejudice is a mechanism with an observer, not a stat on the victim. Blood-status contempt lives in the judging audience's norms, so a Squib's or Muggle-born's treatment changes with who is watching (AD6-AD8) | A Squib is treated differently by two audiences in the same scene |
| XM55 | ACCOUNT FOR NOW | Children's acts reach their guardians: a school writes home, a parent pays a fine. SKIT9 links a minor's consequences to a guardian through the existing ties and obligations | A student's fine lands on a guardian's Owed, with the reason shown |
| XM56 | LATER (medium) | Servitude and rights carry weight: house-elves in HP, indentured or bound servants elsewhere. They are people with their own views and norms, and changing their status is a story with costs, not a toggle | One bound servant whose view of their own status differs from the household's |
| XM57 | LATER (medium) | Cultural fluency: a wizard bungles Muggle money, a Muggle-born misses wizarding customs. Fluency per culture is a skill that grows with exposure, and a gap shows as small mistakes, not a block | A first visit to the other side costs a small mistake that practice removes |
| XM58 | LATER (small) | Passing as one of them (disguise, borrowed status, a false ID) uses perception and records: it holds until someone with the means checks | A disguise that passes one audience and fails a better-informed one |

## How each idea gets considered: the idea register (2026-11-08)

Weibao, 2026-11-08: "how can we consider each idea? commit and push too, what to be done next?"

**Method.** Every XC idea passes the same four questions, in order, and lands in one bin. XM rows already carry a level and a done check; MG rows carry an owner and a puller, so they follow the same bins.

1. Is it already built? Then it needs a walk at floor, not more design.
2. Does a lead caller or a source row pull it now (D-E)? Then it is next.
3. Does a simple layer already exist (XC25)? Then it ships simple and waits for depth.
4. Otherwise it is logged with its expected puller, and nothing about it is closed (Weibao, 2026-11-08: "it shouldnt limti any future prospects").

Status read on 2026-11-08 from the cross-world record and `src/` names; "built" means implemented and agent-verified, not human-reviewed.

| Bin | Ideas | Note |
|---|---|---|
| Built (wave 3, committed d9d8d21be) | XC2 reputation view, XC3 house purchase terms, XC4 ties visible from meeting, XC7 procedure layer, XC8 shared traits vocabulary; XC1 and XC6 in part (Seer brew, Potions bench) | Polyjuice and the Sequence-5 rite are later content on the same layer. As of 2026-11-09 XC8 is ten presence tags with no values, and XC6's two brews use per-recipe axes (LAYX41) |
| Next, a lead caller pulls it | XC16 pool limits (Klein's divination drills), XC23 simple selling (a Tingen pawnshop), XC24 grind spots (Klein G1-G4, then Harry H1-H4), XC30 society kit first slice (SKIT4 norms and SKIT9 age), with XC26 and XC29 as its test act | One slice each, at floor, LOTM first |
| Simple layer exists, depth waits | XC21 renewing places (`gathering_model` sites), XC22 the rat cellar (YAIR's cave), XC19 hunger (default-off, non-lethal), XC20 shops (traders exist; the player's own shop waits) | Ship as is; deepen when pulled |
| Method, applied in every slice | XC5 calibration by story walks, XC17 the player's difference as method, XC25 simple by default | Not features; each slice records how it applied them |
| Logged with an expected puller | XC9 other domains (medicine via the hospital wing), XC10 layered law, XC11 education, XC12 general research, XC13 exotic materials, XC14 research payouts, XC15 research map, XC18 tiers and automation, XC27 era and institutions beyond the first slice, XC28 the veil (Harry's Muggle side), XC31 mundane people | Each names its puller in its own row |

**Suggested next order (proposals).**

| Code | Step | Why now |
|---|---|---|
| N1 | Rebuild and install the app (AT36) | Wave 3 is committed but not in the app Weibao plays |
| N2 | Klein's grind slice: steady guard shifts, a firearm range, divination drills with XC16 strain, a Tingen pawnshop | LOTM first; the first lead caller for four ideas at once |
| N3 | Norms and age slice (SKIT4, SKIT9) with the first-year skinning act | Tests the society kit at its smallest, on Harry |
| N4 | Decide kjw22's mechanisms (AT34), then resume Klein's story windows | Story-led waves resume on finished engines |

## Expanding wave 3: more callers and more procedural systems (2026-11-08)

Weibao, 2026-11-08: "What can we do to expand wave 3? other procedural stystems and stuff?"

What wave 3 left (from its [task record](../gm/dispatch/cross-world-systems-2026-11-07/CHECKPOINT.md#wave-3-engine-completion-2026-11-08-current) and [source shapes](../gm/dispatch/cross-world-systems-2026-11-07/SOURCE_SHAPES.md)): the engines compile all 26 indexed HP1 spell tasks and nine LOTM divination methods as contract tests, but only four powers, two makings, two tie consumers and two homes are playable. So expansion runs two ways: **widen** (turn compiled shapes into playable rows) and **build on** (new procedural systems that are mostly compositions of the wave-3 engines). Existing seams named below were listed from `src/` (`story_requests`, `storylet_deck`, `npc_schedule`, `encounter_content`, `lesson`, `book_world_hp_lessons`, `craft_item_name`); their depth was not re-read. Proposals, not accepted decisions (AD32).

**Widen the engines.**

| Code | Engine | Expansion | Caller |
|---|---|---|---|
| W3X1 | Powers grammar | Promote compiled shapes to playable rows: Harry's first-year charms in class order, Klein's divination methods (each a prepare, rite, attempt, interpret procedure). Bulk rows come from the census (XM10) with an outlier report, so most need no hand tuning | Harry's Charms class, Klein's drills (XC24 G3) |
| W3X2 | Powers grammar | Pool limits (XC16) and player-composed variants: a known part swapped for another known part, priced by the grammar and learned by research or practice | Klein's spirituality; Harry's practice room (H1) |
| W3X3 | Procedure layer | More rites and makings as procedures: LOTM rites from the census, more potions in Harry's class order, Polyjuice later; cooking and first aid as ordinary procedures (XC9, medicine first) | Potions class, Tingen injuries, the hospital wing |
| W3X4 | Procedure layer | Standing procedures with upkeep (MG2) and plan-before-make (MG7) | Wards and long rites; the Potions bench |
| W3X5 | Shared traits | Appraisal writes observations of hidden traits (XM16), so an ingredient's traits are learned, and generic trait-based brewing reaches the lead worlds | Neil's lessons, Snape's class |
| W3X6 | Reputation view | More audiences: institutions (the Nighthawks, Hogwarts houses with house points as standing), districts and the norms table (SKIT4) as the judge | The norms slice (N3) |
| W3X7 | Ties | Second tie shapes: rivalry (Draco), mentorship (Dunn, a teacher), friendship that grows from shared acts; free-play tie sources (gifts, help, shared work, XM5) | Harry's W7, Klein's team |
| W3X8 | Homes | Rooms with functions (a workshop, a shop counter for XC20, storage with count and kind caps, MG14), and renovation as a procedure | Klein's flat, Harry's trunk |

**New procedural systems built on the engines.**

| Code | System | Composition | Why it pays |
|---|---|---|---|
| W3X9 | **Commissions** | A generated request from someone's need (`story_requests`, MG13 request chains) names a product or service, a deadline and a pay; doing it runs a making or procedure, delivery moves a tie and an audience's view | One system feeds grind (XC24), selling (XC23), ties and reputation at once; works in every world with its own requesters |
| W3X10 | **Investigations** | A case is a procedure whose conditions are clues: gather (inquiry, divination), connect, confront. Clues are observer knowledge, so a case can be half-solved and resumed | Klein's whole job; the Nighthawks' cases are its canon caller |
| W3X11 | **Classes and exams** | A school term as a procedure: lessons (`lesson`, `book_world_hp_lessons`), homework, practice, and end-of-year exams that grade the spells and potions you can actually do | Harry's school year end to end |
| W3X12 | **Encounters in grind spots** | Level-banded encounter tables (`encounter_content`, Proto23's profiles) plus storylet cards drawn while grinding (XM45) | Keeps XC24's loops alive without new engines |
| W3X13 | **Daily life schedules** | People keep routines (`npc_schedule`, `cast_schedule`) that put them where a commission, a case or a meeting can find them | Makes commissions and investigations land on real places and times |
| W3X14 | **Item identity** | Crafted items carry a maker, a lineage and a generated name (`craft_item_name`, material lineage), so a gift, a sold potion or a found relic has a history someone can recognise (XM4) | Crafting feeds ties and reputation as items, not numbers |

**Suggested picks (proposals).** W3X9 commissions first, since it joins the most systems and runs in both lead worlds; then W3X10 investigations for Klein and W3X11 classes for Harry, which are the two leads' daily lives; W3X1 widening runs alongside as bulk rows from the census. Each is one slice at floor, after N1 (the app rebuild).

## Other systems that need the procedural engines, and how far ahead to look (2026-11-08)

Weibao, 2026-11-08: "Other stuff that needs the procedural engines and more? other systems that require those? Do we need to move further down the story to understand those systems better and create whats required?"

**Systems that need the engines.** Existing modules were listed from `src/` (`lotm_advancement`, `lotm_formula_rows`, `hp_brewing_formula`, acting and digestion in the LOTM state and ability files, `material_apprentice`, `place_act_sequence`); where one exists, the proposal moves it onto the shared engines rather than replacing it. Later-rung names stay out of tracked files, as `lotm_advancement.js` already does. (Checked 2026-11-09: the tracked `lotm_formula_rows.js` does hold the whole ladder by name, so this is true of this doc and that module, not of `src/`; see LAYX56.) Proposals, not accepted decisions (AD32).

| Code | System | Engines it needs | Lead caller in range |
|---|---|---|---|
| W3X15 | **Acting and digestion** (LOTM): living by a potion's principle digests it; acting against it, or advancing undigested, raises the risk of losing control | Procedure conditions (acting rules as graded conditions), research-style affinity buckets (MG10), strain and harm (XC16) | Klein, volume 1 |
| W3X16 | **Advancement** (LOTM): acquiring a formula, gathering main and supplementary ingredients, brewing, and the rite some rungs ask for | Procedure layer, shared traits, economy (buying formulas and ingredients through gatherings), the existing ladder | Klein's next rung |
| W3X17 | **Prayer, sacrifice and summoning** (LOTM): rites addressed to an Agent that may answer, refuse or misread | Procedure layer's Agent part, ritual conditions with substitutes | Klein's rites (census) |
| W3X18 | **Mystical items** (LOTM): Beyonder characteristics turned into items with powers and drawbacks, stored and sealed | Making plus traits, misfiring relics (MG10), institutions (sealing) | Nighthawk storage, the Gathering |
| W3X19 | **Flying, Quidditch and matches** (HP): lessons, practice, tryouts and matches as procedures with skill checks | Procedure layer, classes (W3X11), audiences for house standing | Harry's first year |
| W3X20 | **The obstacle chain** (HP book one's climax): a sequence of trials, each passable by a skill, a spell, a person or a clever substitute | Procedure conditions with substitutes, ties (who is with you) | Harry's end of year |
| W3X21 | **Detentions, points and school discipline** (HP) | Duties, the norms table (SKIT4), reputation audiences | Harry's first year |
| W3X22 | **Errands and journeys**: multi-leg trips with stops, timetables and things to do on the way | Procedure steps over `travel_legs`, schedules (W3X13), SKIT7 transport | Both leads |
| W3X23 | **Teaching and apprenticeship**: learning a method from someone over sessions, and later teaching it | Lessons, ties, research (two bars), `material_apprentice` | Neil and Klein; Harry's teachers |
| W3X24 | **Plans and schemes**: heists, investigations that go active, setting a trap, staging a cover | Procedure layer with conditions, knowledge per observer, heat | Klein's cases; later volumes |

Wider palette, logged: construction, farming cycles, animal training and bonding, festivals and seasonal events, courtship, contracts and negotiations, medicine and surgery, combat techniques as sequences of steps.

**Do we need to go further down the story?**

| Code | Decision (proposal) | Reason |
|---|---|---|
| D-G | **Read ahead fully, walk ahead one window at a time.** Default: the census already covers LOTM volume 1 to chapter 213 and Harry's book one index, so system shapes come from mining those rows now (D-B), with no walk needed. A bounded pass extracts every system demand those rows imply (acting, advancement, rites, flying, the obstacle chain) into the gap ledger with chapter locators. Walks then go one window at a time as callers and calibration, which is where integration gaps show (F6, the KJ3AE lesson). Dial: walk further ahead when a system's timing or interplay can't be judged from text, such as acting's pace over weeks. | Reading is cheap and complete for volume 1; walking is expensive and finds different things. The walk sits at chapter 69 of 213, so most of volume 1's systems are known from text but not yet played |

Suggested first step for D-G: one docs-only pass over the existing volume-1 and book-one census rows that lists each system demand with its chapter range and its engine, then folds the result into this register. No new reading and no paid route.

**D-G result, 2026-11-08.** The [system demands](SYSTEM_DEMANDS_VOL1_BOOK1_2026-11-08.md) pass grouped 3,643 volume-1 rows and 528 book-one rows into 42 repeatable mechanisms (23 for Klein's volume, 20 for Harry's book, less two residue groups of plain narrative facts). By the reader's judgment, 11 already fit the engines as data, 27 fit in part with a named missing part, and 4 need a missing mechanism. Counts are approximate (keyword grouping). What it changes in the register:

| Code | Finding | Consequence |
|---|---|---|
| DG1 | The three largest Klein demands are advancement (about 365 rows), an organisation career with rank, pay, rota and probation (about 311) and prayer and summoning (about 290). The career layer is new and is Klein's daily life | W3X16 and W3X17 move up; a career layer (rank ladder, rota, probation) joins XC24's guard shifts as one slice |
| DG2 | Loss of control with a conserved power-trait pool is a NO and sits beside XC16 | XC16 grows a third grade for Klein's world: risk of losing control, with W3X15 acting as its counterweight |
| DG3 | Divination and investigations together are about 355 rows, each PART: answer tiers by scope and cost, and a case file with deduction steps | W3X10 investigations is confirmed as Klein's second slice, with divination as its inquiry channel |
| DG4 | Harry's largest demands are creature care (about 54 rows), the team sport (about 50), spells with exact words and counters (37) and house points (31); the obstacle chain is a NO | W3X19, W3X20 and house standing (W3X6) are Harry's slices; creature care confirms XC26's care-and-harvest default |
| DG5 | One lead-specific signature power is a NO by design | It stays an authored override with reasons (XM12), not a general engine |

Next, under D-G: walk Klein's next window as the caller for DG1, with the census rows above as its anchors.

## Layers that condense the work (2026-11-09)

Weibao, 2026-11-09: "Layers of abstraction needed and more, to condense things to a format that fits what we have/what we are tying to achieve?" Follow-up to the missing-foundations read (F1-F9 in that chat: ordinary loops, career and cases, power grammar, encounter frame, procedures for rites and advancement, people with plans, the world sheet, idle seams, content throughput). Everything here is a proposal (AD32). Evidence: the seam register at the current tree, the [transfer pattern](../CROSS_WORLD_SYSTEMS_TRANSFER.md), [ACR1-ACR14](../ACTIVITY_ABSTRACTION_RULES.md), [AR1-AR19](../ARCHITECTURE_RULES.md) and a grep of `src/`. Code shape only, no play proof.

**What the code shows.** The engine, port and world-data split already exists for systems. What has no runtime layer is everything between an engine and a story window. 44 files redefine the same rule helpers (`eq`, `all`, `set`, `note`, `stock`), and 34 define their own `act()` builder. Most of them are the 33 `book_gu_lead_*` window modules (4,666 lines). In `book_gu_lead_wolf_front.js`, 88 of 146 lines are code around the window definition. The shared helpers turned out to be about 20 of those lines (measured in the LAYM1 status below); the rest is window-specific gates, clock requests and registration. LOTM already has the better shape: `lotm_act_engine.js` compiles a source row plus an authored binding into native commands and reports a missing binding instead of guessing. It serves LOTM alone. ACR1-ACR14 describe repeated activities well, but they are rules with no runtime templates, so each window hand-builds its case, lesson or errand.

### The stack

| Layer | Holds | Owner today | Gap | Foundations it serves |
|---|---|---|---|---|
| LAY0 · Kernel | Clock, registry, save slices, seeded streams, custody, transactions, observer knowledge | AR1-AR19, `simulation`, `structured_pack_*` runtime | Sound; keep | All |
| LAY1 · Engines (verbs) | Make, cast, procedure, encounter, exchange, ties, home, inquiry, travel, harm | Seam register (about 40 rows) | Group the rows into about ten verb families. Encounter has no world consumer, effects are partial, and the procedure layer lacks advancement and the answering Agent | F3, F4, F5, F8 |
| LAY2 · World law | Society sheet, systems sheet, law rows per port, cost sources, palettes | Transfer pattern, `world_society_sheet.js` | The systems sheet (LT1) is not built, so a missing piece still reads as absent | F7 |
| LAY3 · Activity forms (missing) | Job or shift, case, lesson and practice, making, rite, journey, deal, care of a living thing, upkeep, encounter. Each is a thin template over LAY1 with one contract: find a place, person and means; check access; commit means; settle cost, custody and result; hand the result to a later consumer; settle interruption by ACR7 | ACR1-ACR14, as rules with no runtime | No runtime templates. Forms are actor-neutral, so a character can run the same form later | F1, F2, F6 |
| LAY4 · Situations | A form bound to a place, people and world data: a Nighthawk case at the club, the Monday Charms lesson, feeding a held Gu | `causal_situations.js` (phases, private truth, participants, response window; 5 importers), structured packs, `place_acts`, storylet deck | Exists as a simulation type; window files bypass it (corrected in the next round) | F1 |
| LAY5 · Routes | A lead route is an ordered policy over situations with canon outcomes pinned as calibration (AD49, XC5) and authored overrides where canon is singular (DG5). Ordinary life is player choice over the same situations | One module per window (Gu), the row-plus-binding compiler (LOTM alone) | No shared builder; this is where throughput is lost | F9 |
| LAY6 · Projection and words | Read models, views at quick, guided and detailed depth, prose | AR8, `src/read_models/`, UR, PRS | Small; ACR3 depth views | F1 |

Two rows cut across every layer: **evidence** (source, focused test, browser, installed, human-reviewed, kept distinct) and **demand** (census row, mechanism, owning layer, as D-G already does).

### Options weighed

| Code | Option | What it buys | Why not alone |
|---|---|---|---|
| LAYO1 | **The layered stack above** | Each gap has one home; a world is a sheet plus situations | Seven layers can drift into ceremony if a layer has no caller |
| LAYO2 | **Everything is a procedure:** one engine runs making, rites, lessons, cases and fights | The most condensed form | It becomes a mega-engine. Fights and timed scenes fit badly, and one bad change breaks every activity |
| LAYO3 | **Beats as the unit (unusual):** each census row compiles to a form, its bindings and a pinned outcome. Windows become lists of beat rows citing locators | It attacks content throughput (LT6) directly, and the canon pull already produces the rows | Beat granularity varies by book, and it still needs LAY1 and LAY3 underneath |
| LAYO4 | **Agents first (unusual):** every person runs needs and plans, the player is one more actor, and canon is a set of nudges | It is the purest life sim and makes F6 central | It fights canon fidelity (AD49), is expensive and hard to debug at this stage |

**D-H, converged (proposal).** LAYO1 as the frame. LAYO2 survives inside LAY3: forms share one step-and-settle contract but stay separate thin templates. LAYO3 becomes the authoring format for LAY4 and LAY5 wherever a census row maps cleanly to a form; the rest stays authored with a reason. LAYO4 is a dial for later. Forms are actor-neutral from the start, so S1 (people with their own plans) costs content rather than a rebuild. Rejected: LAYO2 as one engine, for the coupling risk; LAYO4 as the frame now, for canon cost.

### Moves (proposals)

| Code | Move | Default, dial and reason | Done check |
|---|---|---|---|
| LAYM1 | **One window builder.** Lift the repeated helpers and `act()` into one shared module, and widen LOTM's row-plus-binding compiler to every world | Structural first (AR9): emitted commands stay identical, so content hashes and earned saves hold. Old windows move only when touched. Dial: how much of a binding a world may leave to defaults. Reason: the cheapest throughput gain, available now | The next Gu window and the next Klein window both use it. Each records its non-data line count against its predecessor (baseline: wolf front, 88 lines of code around 58 lines of definition) |
| LAYM2 | **First two activity forms: case and lesson.** Build them over existing inquiry, duties, lessons and the purse | Default consumers: a small Tingen case from intake to report and follow-up (F1, F2), and a Hogwarts school week. Dial: how many steps a world shows (ACR3). Reason: these are the largest ordinary-life and career demands (DG1, DG3) | An ordinary character and the lead route run the same form, each walked natively, with Save/reload/Export/Import |
| LAYM3 | **Lead beats cite forms.** When a window's beat matches a form, the route points at a situation instead of a new once-only act | Canon outcome pinned as calibration; a singular beat stays an authored override with its reason. Reason: lead play and ordinary play share one path, so each window adds reusable situations | One window where most beats are situations, and an ordinary character can take one of them |
| LAYM4 | **Systems sheet printout (LT1)** across LAY1 to LAY3 per world, each row authored, palette or missing | Lead worlds first; test beds keep palette rows. Reason: it makes gaps visible before a lane builds beside them | Printout for LOTM, Harry and Qing Mao |
| LAYM5 | **One capability map for the docs.** A layer-by-world grid where each existing code (LT, XC, W3X, MG, DG, F, A, S) sits in one cell, with its evidence state | Docs only; no codes renamed and no new register. Reason: the many parallel code families are hard to read as one picture | Every code in this atlas and the ordinary-play audit lands in one cell or is marked retired |

**LAYM1 status, 2026-11-09: implemented, below floor by design (structural, AR9).** [`src/window_chain.js`](../../src/window_chain.js) holds the shared helpers (`windowKit`: prefix and energy pool only, usable at top level) and the chain act builder (`kit.chain`: world, place, admission, readiness, default refusal). It emits keys in the existing order, because a window's content hash is `JSON.stringify` of its definition. Harry's windows already load private JSON packs through a thin compiler over `place_acts`, and Klein's come from the private generated cast, so the hand-rolled duplication was in the 33 Fang Yuan modules.

| Check | Result | Gaps |
|---|---|---|
| `node --test tests/window_chain.test.js` | 4/4 pass: key order, shape, parts, repeat, extra fields, loud failure on missing context | Fixture inputs |
| Scratch migration of every Fang Yuan window, compared by `node scripts/compare_window_exports.mjs` | 10 of 33 byte-identical with no hand work, same content hash: ear grass, estate claim, estate handover, hunt follow-through, rank two, relic market, river toad, white jade, wolf front, year end. About 20 lines saved per window. The other 23 need a hand move: 4 use helpers at top level before the kit line (ice crystal, ice soul, stone forest, wood charm); 9 differ through a same-named helper with another meaning or act options the builder does not cover (exam result's `reserve` is an exact-equals check); 10 have no standard act builder (the life base, selection, vital, refinement and others) | Proof ran on scratch copies; no window file was changed |
| `npm run check:arch`, `npm run check:rules` | Pass; `main.js` growth 0 | |
| Build, browser | Not run: nothing in the bundle imports the module yet, and no behavior changed | |

**Correction and next lever.** The helper lift is a modest win, about 20 of 88 code lines per window, not the throughput lever this section first claimed. The bigger saving is the shape Harry's windows already use: a module of about 40 lines over a private JSON pack, with one shared compiler (`compileHpSchoolContinuation` over `place_acts`). That also keeps canon content in the gitignored `private_packs/` instead of public `src/`. Moving Fang Yuan's windows to that shape is the second half of LAYM1.

**Proof standard for a move.** A move is proved by `compare_window_exports.mjs` showing identical bytes, because the runtime hashes exactly that JSON and earned saves pin the hash, so identical bytes mean identical admission (AR9's reason). The cheap confirming step is admitting one earned save for the moved window in a rebuilt build.

No window was moved. The Fang Yuan files are another lane's uncommitted, untracked work, edited as late as 16:31 today. Remaining LAYM1 work: the next Fang Yuan window uses the builder (the done check); moving existing windows is left to that lane or to a later pass with its owner's handoff, each proved with the compare script; widening the row-plus-binding compiler (`lotm_act_engine.js`) to other worlds is a separate step.

Suggested order: LAYM1 now (cheap, structural, and it speeds every following window), LAYM2 alongside KJ3AV and the Harry school week, LAYM3 as each window lands, LAYM4 beside them, and LAYM5 whenever a docs pass is free. Current focus (Klein first, Harry alongside) is unchanged.

### More to consider: bigger moves, procedural systems, UI and other aspects (2026-11-09)

Weibao, 2026-11-09: "bigger stuff too? more procedural systems? UI rules for implmentation? other aspects and more?" Proposals (AD32). Evidence: `ls src` (1,169 files, flat), `dist/bundle.js` at 8.9 MB, [UI rules](../UI_RULES.md#task-layers-and-long-running-work-2026-11-04) task layers and BF105/BF106, and the importers of `causal_situations.js` and `storylet_deck.js`. Code shape only.

**ACT NOW (done).** The LAY4 row said situations were missing as a type. That was wrong. `causal_situations.js` already defines a phased situation with private truth, participants and a response window, and the storylet deck already draws cards in the Village and LOTM (`book_world_lotm_deck.js`). The row now names them. LAY4 builds on these; it doesn't add a third situation type.

**ACCOUNT FOR NOW.** These constraints apply to LAYM1-LAYM5 as they are built.

| Code | Constraint | Evidence and reason |
|---|---|---|
| LAYX1 | **Every activity form has a routine mode.** It can repeat as a standing order with a stop policy and settle in batches (ACR1, ACR8). | This is an idle RPG. A form that runs just once, by hand, recreates the click-through windows. BF106 already sketches the policy controls. |
| LAYX2 | **One saved shape for work in progress:** reserved, spent, partial output and pending settlement, shared by every form (AR6, ACR7, ACR11). | XM14 asked for this for procedures alone. Without it each form invents its own pending state and its own refund bugs. |
| LAYX3 | **One view per form, not per world.** A form ships one activity row (BF105) and one current-work block (BF106), mapped onto the [accepted task layers](../USER_VISION.md#task-appropriate-ui-layers-and-crafting-follow-through-2026-11-04): browse, inspect, configure, commit, running, settle. A world supplies words, fields and its own law, not a layout. | `src/ui/` holds world-specific views (`lotm_task_summary.js`, `gu_house_view.js`, `rite_figure.js`). Each new world would otherwise add its own. |
| LAYX4 | **The form owns the quote.** UI reads the form's quote and revalidation (AR7) and by default computes no cost or chance itself (UR74). | This keeps one meaning across lead and ordinary play, and across hover, row and receipt. |
| LAYX5 | **Situations sit in homes that already exist** (UR76-UR79): today's work, requests and offers go in the existing Local and work surfaces as rows. There's no panel per form or per world. | UR78: content inside a surface that already exists is not a promotion. |
| LAYX6 | **Private truth stays sealed in projection.** A generated or canon situation's private truth is world truth (AR8); by default the player sees what their character observed and nothing more (UR80). | Sealed-secrets rule. Generated cases make leaks easier, because the truth is now data next to the clues. |
| LAYX7 | **Window data stays data.** LAYM1's builder emits plain rows with no closures over other windows' modules, so a world's packs can later load on their own (LAYX9). | 8.9 MB bundle against the 8 GB target. Today windows import their predecessors' modules to reach item ids. |
| LAYX8 | **Each form gets one scenario fixture** (a success and a single-change failure, S4) under tests by system. Per-window tests default to checking bindings. | Lean tests. One fixture per form beats a test per window as the window count grows. |

**LATER / DELEGATE. Bigger structural moves.**

| Code | Move | Level, effort | Done check |
|---|---|---|---|
| LAYX9 | **Load a world's packs on entry** (code split per world) instead of one bundle | Sonnet, medium, after LAYM1 | Cold start and memory on the target machine drop, with every earned save still admitted |
| LAYX10 | **Re-home code by layer and system.** 63 files are named after delivery waves (`backlog_expansion_*`, `feature_expansion_*`, `continuation_*`, `absorb_*`), in a flat `src/` of 1,169 files. Move them under layer and system folders, structurally (AR9, AR15) | Sonnet, large, in rounds with writer reservations | `check:arch` passes and the same scenario replays identically before and after; no wave-named file left in a moved family |
| LAYX11 | **Calibration as a layer.** Generalize the XP3 fitting script, so each form's dials (odds, gains, prices, minutes) are solved from canon beats that cite it, with outliers reported as canon exceptions | Sonnet, medium, after LAYM2 has two forms | One report per form listing fitted dials, the anchor beats and outliers |
| LAYX12 | **Inspector and lint for authors.** A developer view and a game MCP tool that list, for a chosen character: available forms and situations, why each is shut, and every unbound or unconsumed row (like `lotm_act_engine`'s binding report). It inspects and never mutates, so it is safe against saves (reason: inspection is separate from mutation) | Sonnet, small to medium | The MCP lists Klein's and an ordinary Tingen clerk's open situations with their shut reasons |
| LAYX13 | **Crossing as a form property.** Each form and situation declares what crosses worlds (knowledge, item, tie, pending work) under WER1-WER17, instead of per-crossing code | Design pass, then sonnet | One item and one tie cross Tingen to Hogwarts and back through the declaration |

**LATER / DELEGATE. More procedural systems.** Each fills LAY4 with generated situations, so ordinary life isn't hand-written. Each waits for a named first caller.

| Code | System | Built on | First caller and done check |
|---|---|---|---|
| LAYX14 | **Situation director:** the storylet deck widened to draw today's requests, cases, offers and trouble per world from place, season, standing and the character's forms | Storylet deck, `world_events`, world calendar, reputation view | A Tingen clerk sees different requests over three days, each tied to state that changes them |
| LAYX15 | **Generated cases:** a private truth, clues placed with people and places, witnesses with their own accounts, and an answer that grades by evidence | `causal_situations` private truth, `people_knowledge`, the case form (LAYM2) | One generated case closes by records search and another by a witness, after reload |
| LAYX16 | **Generated ordinary people:** role, schedule, wants and ties for people who aren't canon cast, drawn from the world's naming sheet | `cast_schedule`, `person_ties`, naming sheets (NMR) | A case's witness and a shop's keeper exist without authoring, and they remember the player |
| LAYX17 | **Places that fill in:** addresses, shops and workplaces with demand and stock (XC20, MG15) | Shops, economy port, `place_acts` | A district gains a shop that sells what nearby demand asks for |
| LAYX18 | **Timetables and curricula:** generated lesson weeks, shifts and rotas from the world calendar | World calendar, lesson form, duties | A Hogwarts week and a Nighthawk rota come from one generator with different law rows |
| LAYX19 | **Word of mouth:** how news, rumours and standing spread and fade per audience (XC2's dial) | Reputation view, knowledge per observer | A case's outcome reaches a second district a day later, changing a price or an offer |
| LAYX20 | **Prices solved over the world** (MG8) and generated abilities within a world's allowed parts (XP4) | Economy port, power grammar | Already logged; listed here so the director can call them |

**LATER / DELEGATE. Other aspects.**

- **LAYX21, prose slots per form.** Each form's rows and receipts read world word slots (PRS1-PRS8, naming sheets), so a generated situation sounds local. Sonnet, small, with LAYM2. Done check: the same case form reads as Tingen in one world and Hogwarts in another, with `check:rules` passing.
- **LAYX22, lane briefs name their layer cell.** A runtime brief names the layer, the form and the world cell from LAYM5, so foundation runs pick slices by gap rather than by window. Docs, small. Done check: the next lane brief cites a LAYM5 cell.
- **LAYX23, routine cost per tick.** Measure the cost of twenty forms running as routines on the target machine before LAYX14 multiplies them. Sonnet, small. Done check: recorded tick time with twenty routines against none.

Suggested order is unchanged at the front: LAYM1, then LAYM2 carrying LAYX1-LAYX8. LAYX12 (the inspector) is the cheapest next one with lasting value. LAYX14 and LAYX15 are the biggest procedural step for ordinary life, after the case form exists.

## Is the approach right, and tuning by lore (2026-11-09)

Weibao, 2026-11-09: "is the way we go about to implement something like the relationship system or combat system even the right way? other aspects to consider?", then "or like hte procedural systems too", then "what about making the system fit what happens in lore to tune it? more to consider? Procedural crafting and other aspects?" Proposals (AD32). Evidence: `person_ties.js`, `tempo_fight*.js` and their importers, `power_grammar.js`, `power_grammar_worlds.js`, `scripts/calibrate_powers.mjs`, `scripts/calibration/fight_cases.json`, the making and craft file list. Code shape only; nothing was run or played.

**The read.** The skeleton (shared engine, world law rows, a real caller, the floor) is sound. Three things are off.

- **Ties are a ledger so far.** `person_ties.js` is 110 lines: five axes holding numbers, nine importers, two playable consumers, against about 1,250 lines of relationship design (RLA to RLY). A tie is a system when a person behaves differently because of it.
- **Story windows are the wrong puller for repeating systems.** A chapter is a once-only beat, so it pulls a once-only act. Ties, fights and generators are about the ordinary day. This is the LAY3 gap seen from the player's side.
- **Feel has no check.** Contract tests and scripted walks can't say whether a fight is tense or a friendship is noticeable.

Fights do run on a shared engine in the lead worlds: `tempo_fight` is called by `book_world_lotm_fight.js`, `book_world_hp_lead_duel.js` and four Gu windows. The upstream `models/combat.js` is the Village's.

**ACCOUNT FOR NOW.**

| Code | Constraint | Evidence and reason |
|---|---|---|
| LAYX24 | **A fit report counts source-backed anchors per channel, and zero reads as "assumed".** | Both power anchors in `POWER_CALIBRATION_ANCHORS` have basis "gameplay dial", one per world. The fit currently reproduces our own numbers, so powers are not yet tuned to lore. The script's header says so; the atlas text above reads as if they were. |
| LAYX25 | **Fit to the kinds of statement books make.** Default kinds: point (a price, a wage, a count), band, order (A beats B, this is harder than that), duration or count (three tries, spent after two uses in a day), sequence (before or after), tolerance (how far off still works, and in which direction it fails; added with LAYX44). Census rows carry their kind. | Novels state outcomes, orders and durations far more than costs. `hpPowerPrices` lists canon stamina, failure and strain as unknown. The fight calibrator already uses bands; powers, ties and making can use the same shape. |
| LAYX26 | **Fit the route as well as the row.** A lead taking canon choices with the fitted dials reaches canon outcomes at a stated rate over many seeds, with no grind (XM41). Default: the canon outcome sits inside the reachable band; where the book calls it lucky or desperate it may be a low-odds result plus the lead's own edge (XC17). Dial: the target reach rate per world. | Ten steps at 80% each is an 11% route. Canon is one sample and often an unlikely one, so pinning every canon result as the median makes the world too easy for everyone else. |
| LAYX27 | **Negative anchors count.** Failed brews, substitutes that didn't work, fights lost and trust refused are recorded as anchors with the same weight as successes. | A law fitted only to successes fits by being permissive. Under AD5 a negative is the ordinary case with a reason, not an absolute. |
| LAYX28 | **Outliers have three classes:** canon exception (XM12), missing part, and canon disagreeing with itself. The third keeps the earlier or more specific statement and records the other. | `fitPowerPrices` offers the first two. Long serials contradict their own numbers, and a missing-part hunt for those wastes a slice. |
| LAYX29 | **Ties are tuned to behaviors by chapter.** The anchor is "by chapter N this person does X for the lead" (shares a secret, lends money, takes a risk). Each such behavior is a threshold with a consumer, and gains per event are fitted so the canon events between cross it in time. Per-person warmth is a trait of the person, not one global rate. | Checked 2026-11-09: the tie does keep events. `simulation_effects.js` stores up to 32 memories per pair (cause, time, text) beside the axes. What is thin is behaviors that read them. Without behaviors there is nothing for lore to tune. |
| LAYX30 | **Fights are tuned to what decided them.** The anchor is who won, roughly how long, what it cost and what decided it (preparation, information, a tool, an ally), not health totals. | `fight_cases.json` says there was no canon fight in chapters 1 to 24 to calibrate against. Klein's walk is now at chapter 129, so that note is stale and canon fights can replace proposal bands (inferred from the walk's reach; the fights were not listed here). |
| LAYX31 | **A refit is a versioned law row, and fixtures replay after it.** | Changing a price list silently changes what earlier window receipts proved. Old saves are disposable; old proofs are not. |
| LAYX32 | **New making goes onto the shared craft engine, not a new path.** Corrected 2026-11-09: the first wording said only the Village feeds the trait engine. The Cure for Boils and the Seer brew already resolve through it (`cast_making_adapter`, `craft_materials`). | What is thin is the shared vocabulary: `making_traits.js` is ten presence tags with no values, and each brew brings its own axes ([potion round](#procedural-potion-crafting-2026-11-09)). |
| LAYX33 | **A generator ships a "read ten" check beside FND1's four lines:** generate fifty, read ten as a player, and name the decision today's output changes. | Validators catch malformed output, not bland output. |

**LATER / DELEGATE.**

| Code | Move | Level, effort | Done check |
|---|---|---|---|
| LAYX34 | **Anchor ledger.** One table per lead world: system by statement kind (LAYX25), with source-backed anchor counts and locators, from the existing census rows | Haiku readers per shard, sonnet fold, small; no new reading | LOTM volume 1 and Harry's book one each have a table; a system with fewer than three anchors is flagged assumed |
| LAYX35 | **Canon replay harness.** Run a lead's fixture chain over many seeds and report the reach rate per canon event | Sonnet, medium, after LAYM1 | Klein's chain to chapter 129 prints a reach rate per window |
| LAYX36 | **Hold-out check.** Fit on the walked chapters and predict the read-but-unwalked ones (LOTM 130 to 213) before walking them | Sonnet, small, after LAYX34 | A report of predicted against stated outcomes, with misses classed by LAYX28 |
| LAYX37 | **Borrowed baselines where canon is silent.** Period wages, travel times and learning hours, or a sibling source, labelled "borrowed" and kept apart from canon anchors | Haiku lookup, small | Each lead world's law rows show canon, borrowed or assumed per dial |
| LAYX38 | **Inverse making.** The player names a wanted effect, the law lists the traits it needs, and the search for materials that carry them becomes the activity; extends MG7 (plan before you make) | Design pass, then sonnet, medium | One Potions-bench and one Tingen making reached from a stated goal, with a missing trait named |
| LAYX39 | **Someone wants what you make.** Generated demand for made goods through commissions (W3X9), so trait-based results have a use (FLR4) | With W3X9 | A banded off-book brew finds a buyer or a refusal with a reason |
| LAYX40 | **One week with one person, one fight you can lose.** Two ordinary-day loops as the pullers for ties and fights, beside LAYM2's case and lesson | Sonnet, medium each | Dunn's and Hermione's ties each change five things (an offer, a favor, a refusal, an unprompted visit, a remembered act); one fight per lead world ends in a loss with an aftermath |

Suggested order: LAYX34 first, since it is docs only and shows where lore can tune at all. Then LAYX30's fight anchors and LAYX40, with LAYX29 riding on LAYX40. LAYX35 follows the window builder.

## Procedural potion crafting (2026-11-09)

Weibao, 2026-11-09: "procedural potion crafting, other aspects and more? Reoncile things accordfingly". Proposals (AD32). Extends XC6 and the [October alchemy audit](../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md) (five records, P1-P15, R1-R9), which stay the design owner for composition; this round is about what the book worlds need next. Evidence: `hp_lead_making.js`, `lotm_seer_brew.js`, `cast_making_adapter.js`, `dose_process.js`, `lotm_formula_rows.js`, `hp_brewing_*.js`, `making_traits.js`, `mixture_rules.js`, `power_grammar.js` and their importers. Code shape only; nothing was run or played.

**What exists.** Brewing in the book worlds runs on three paths. The shared craft engine resolves the Cure for Boils and the Seer brew from material properties, ordered process steps and a law, and it already yields a different product when a step is done wrong. The process envelope (`dose_process`) holds 43 LOTM formula rows, 23 of them brewable, and Polyjuice, as fixed slots; its header says only an exact item key resolves against holdings today, so substitution by trait can't run there. Polyjuice also keeps its own 524-line state machine and save slice. The Village has a fourth, its own mixing law.

**ACT NOW (done).** Corrected in this doc: LAYX32's claim that only the Village feeds the trait engine; status notes on XP3 and XC6; the wave-3 "built" row for XC8; the later-rung names sentence. Added the tolerance kind to LAYX25.

**ACCOUNT FOR NOW.**

| Code | Constraint | Evidence and reason |
|---|---|---|
| LAYX41 | **Axes belong to the world, not the recipe.** Default: each world declares one set of potion axes that every one of its ingredients carries, and a recipe is one point in that space. Dial: how many axes a world has and how many the player can see. | The Cure for Boils declares `cure`, `sting` and `acid`; the Seer brew declares `charge` and `binding`. Nettles only mean something inside their own recipe, so two recipes can't interact and an off-book mix across them has no reading. This is the one change that makes brewing procedural. |
| LAYX42 | **One brewing path.** Formula rows and Polyjuice move onto the craft engine as ingredients with world axes plus a pinned canon point, when a slice touches them. No fourth path. | Three paths today. The envelope's fixed slots are what makes those 44 recipes a recipe book. |
| LAYX43 | **Each world says which of three things is open:** ingredients (substitution), process (order, timing, heat, precision) and effect (new combinations). Defaults: in LOTM the main ingredient sets the effect, and the open space is substitutes, dose precision and risk. At Hogwarts process and preparation are open and a new effect is rare invention. Original worlds can open all three. Dial per world. | Canon, as recorded in the two brew files: Neil's first five ingredients barely matter and the last two fail in one direction; the quills go in after the cauldron leaves the fire. "Procedural" means a different thing in each, and one free-mixing model would get both wrong. |
| LAYX44 | **Potions are where tuning by lore gets proven first.** | They have source-backed anchors where powers have none yet (LAYX24): quantities with locators on the LOTM formula rows, step order and named failure products. Corrected by the [anchor ledger](ANCHOR_LEDGER_VOL1_BOOK1_2026-11-09.md): this holds for LOTM (advancement and formulas, about 100 numeric anchors). Harry's book-one potions have 12 rule rows and no numeric anchor, so his bench can be shaped by lore (order, failures) but not numerically fitted. |
| LAYX45 | **An off-formula result is a product.** It has identity and traits and can be used, sold, studied or thrown at something. Default: no empty result. Dial: a world can make inert sludge common. | The Cure for Boils law already outputs a corrosive when the quills go in early. The alchemy audit says the same for leftovers. Failures feed LAYX27. |
| LAYX46 | **Potion effects and power effects share one vocabulary.** | `boil_cure` exists only in `hp_lead_making.js`; `power_grammar.js` has its own functions. A potion and a spell that do the same thing should stack, counter and price the same way. |
| LAYX47 | **A brewed thing has a use in play before more recipes are added.** Uses: a fight, the body (tolerance, and digestion under W3X15), a sale or commission (LAYX39), a gift that moves a tie. | No `tempo_*` file, `book_world_lotm_fight.js` or `book_world_hp_lead_duel.js` mentions a potion or a dose (FLR4). |
| LAYX48 | **Each world law gets property checks.** The canon point reproduces; neighbours are banded; constituents are conserved unless the law says otherwise; more of an active gives more effect until it saturates; nothing generated beats a higher canon rung at lower cost without a stated reason. | One test file per law beats a test per recipe as rows grow (LAYX8). The last check is an order anchor (LAYX25). |
| LAYX49 | **Ingredients come from somewhere.** LOTM's main ingredients are creature parts, so the source is a hunt or a purchase, and their scarcity is the in-world limit on experiments. Hogwarts has greenhouses, stores and suppliers whose word isn't proof. | Polyjuice already models unverified provenance. No artificial cap on trials is needed where the world prices them (AD22). |

**LATER / DELEGATE.**

| Code | Move | Level, effort | Done check |
|---|---|---|---|
| LAYX50 | **World axis sheets.** For LOTM and Hogwarts, the axis set and each ingredient's values, marked canon, borrowed or assumed, from the formula rows and census | Sonnet with haiku readers, small; docs only, same pass as LAYX34 | Every ingredient in the 23 brewable rows and book one's potions has values and a basis |
| LAYX51 | **First procedural slice, Harry's bench.** The Cure for Boils on world axes, one more first-year potion sharing an ingredient, an off-book mix that gives a third product, and one use for each | Sonnet, medium, after LAYX50 | At floor, with Save/reload/Export/Import; LAYX48's checks pass |
| LAYX52 | **Klein's bench: substitution and precision.** One substitute for a main ingredient with its risk, and the tolerance asymmetry Neil describes reproduced by the law | Sonnet, medium, after LAYX50 | The canon brew is exact; a short measure and an over measure give the two different stated outcomes |
| LAYX53 | **Formulas as knowledge you trade.** A formula has a price, a source and a chance of being partial or false; the price notes on the formula rows are its anchors | Design pass, then sonnet | One formula bought at a gathering and checked before brewing |
| LAYX54 | **Standing brew orders.** A learned method repeats in batches with a stop policy (LAYX1; the audit's P9) | With LAYM2 | A batch stops on shortage and reports what it made |
| LAYX55 | **Generated ingredients** for parallel worlds and places canon doesn't describe, drawn on the world's axes and named from its sheet (`craft_materials` can already seed materials) | Sonnet, medium, after LAYX51 | Two seeds give different local herbs that a known recipe accepts as substitutes at different strength |
| LAYX56 | **What a fresh character sees of the ladder.** `lotm_formula_rows.js` holds every rung by name; check what the bench and reference views show before Klein reaches them | Haiku read plus one MCP walk, small | A new Tingen character's views show no rung above what they've learned of |

Suggested order: LAYX50 with LAYX34 as one docs pass. Then LAYX41 through LAYX51 on Harry's bench, since first-year Potions is the cheapest place to prove world axes, with LAYX47 deciding which uses ship with it. LAYX52 follows for Klein.

Several rows in this round restate accepted [making rules](../MAKING_RULES.md); the [action register](#action-register-for-layx24-layx56-and-other-crafts-2026-11-09) below maps each one.

## Action register for LAYX24-LAYX56, and other crafts (2026-11-09)

Weibao, 2026-11-09: "Reconile all of thes ideas into the docs to act upon? From relationship to other crafting type and more? OTher aspects to consider?" Proposals (AD32). Nothing here is accepted or dispatched; writing a row into this register does not adopt it. Evidence: [MAKING_RULES](../MAKING_RULES.md) MR1-MR36, AD49, the [relationship palette](../RELATIONSHIPS_AND_CANON_CONSIDERATIONS_2026-10-18.md), `simulation_effects.js`, `book_gu_lead_refinement.js`, `book_world_lotm_content.js`, `rune_grammar.js` and import lists, plus the [live task record](../gm/dispatch/cross-world-systems-2026-11-07/CHECKPOINT.md#sonnet-handoff-november-9). Code shape only.

**What the mapping found.** On ties, fights and making, the design is ahead of the code. Typed memories are in the relationship palette since October (RLA3) and the code stores them. Free experimentation, formulas as attractors and composition over catalogues are accepted rules (MR6-MR8). So about a third of LAYX24-LAYX56 are not new ideas. They are places where the code hasn't reached a rule that already exists, and they act as build targets, not as design.

### Ledger

Class: **gap** means an existing rule or palette row the code hasn't reached; **restates** means already covered, kept only as a pointer; **new** is a proposal with no earlier owner found; **method** changes how work is done; **correction** fixes a stale statement.

| Rows | Class | Existing owner | What remains to act on |
|---|---|---|---|
| LAYX24 | correction | AD49, XP3 | The fit report prints source-backed anchor counts; done in docs, not in the script |
| LAYX25 | new | AD49 names stated figures (price, change, wage, time window) | Orders, counts, sequences and tolerances as anchors widen AD49's reach. That is Weibao's call, not a reading of AD49 |
| LAYX26 | new | AD49, XC5, XM41 | Route-level reach rate, and lucky canon results as low-odds outcomes |
| LAYX27, LAYX45 | restates, with a small addition | MR6 (every combination resolves to an outcome), MR7 (near misses) | The addition: failures are recorded as anchors for fitting |
| LAYX28 | method | `fitPowerPrices` outlier text | A third outlier class, canon disagreeing with itself |
| LAYX29 | gap | RLA3 typed memories; XC5 | Memories are stored. Behaviors that read a tie at a threshold are the missing part |
| LAYX30 | correction | LSD350, `scripts/calibration/fight_cases.json` | The "no canon fight in chapters 1 to 24" note is stale; walked fights can become cases |
| LAYX31 | restates, with an addition | MR30 (products keep their law revision) | The addition: fixtures replay after a refit |
| LAYX32, LAYX42 | restates | MR29 (one shared envelope, separate product logics), AR11 | Compatible with MR29: one resolver for brewing, each world keeping its own product logic. Formula rows and Polyjuice are the unmoved content |
| LAYX33 | method | FND1 (proposed) | A read-ten check for generators |
| LAYX41 | gap | MR8 (author reusable properties, operations and laws) | Per-recipe axes in the two book brews. The largest making gap |
| LAYX43 | restates | MR11 (each world declares its making modes per domain) | Nothing new; the LOTM and Hogwarts defaults are examples for MR11 |
| LAYX44 | method | AD49, XC5 | Prove fitting on potions first |
| LAYX46 | new | ABILITY_RULES, XP2 | One effect vocabulary for potions and powers |
| LAYX47 | gap | MR32 (no maker system without a reader), FLR4 | No fight code reads a potion or dose |
| LAYX48 | restates, with additions | MR34, MR35 (exact formula, near miss, free mixing) | Additions: effect rises with the active until it saturates; canon tier order holds |
| LAYX49 | restates | MR25-MR27 (resource layers, canon scarcity, forms of supply) | Nothing new |
| LAYX34-LAYX40, LAYX50-LAYX56 | new moves | none found | Binned below |

Unmapped: the combat owners ([COMBAT_RULES](../COMBAT_RULES.md), the [combat considerations](../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md)) were not read row by row, so LAYX30 and LAYX40's fight half may restate rows there.

### Other crafts

The same pattern holds outside potions: the lead worlds' other crafts were built inside story windows and don't call the making engine.

| Craft | Where it runs today | Mode it would declare under MR11 (proposal) | Lore anchors | First caller |
|---|---|---|---|---|
| Potions (Cure for Boils, Seer brew) | Shared craft engine, per-recipe axes | Composition with canon attractors | Dense | Harry's bench (LAYX51), Klein's bench (LAYX52) |
| LOTM formulas, Polyjuice | Process envelope with fixed slots; Polyjuice also has its own state machine | Formula with conserved identity (LOTM); formula with strict process (Polyjuice) | Dense | When a window touches them (LAYX42) |
| Amulets and charms (LOTM) | Authored in `book_world_lotm_content.js`; no making-engine import | Pattern plus material plus a rite: the procedure layer, with stand-ins graded by `ritual_conditions`' physical, functional and symbolic fit | Klein's sessions through chapter 129 | Klein's paid clients |
| Gu refinement (Reverend Insanity) | `book_gu_lead_refinement.js`, a window pack with no making, recipe or craft reference | Conserved identity: the specimen stays the same Gu. Open dials would be odds, feeding and cost of failure (inferred from the file header; RI rows were not read) | Fang Yuan's walk through chapter 140 | His next refinement or fusion window |
| Smithing and alloys | Upstream recipes, `alloy_equipment.js`, Village craft content | Composition with components and grade | None in lead worlds | None now; the Village gets no new depth by direction |
| Cooking and meals | `household_meal_items.js` | Simple formula; hunger is off by default (XC19) | Household scenes | The Moretti dinners |
| Medicine and balm | `contextual_balm_*`, `home_medicine.js` | Context-sensitive use (the alchemy audit's P12) | Sparse | The hospital wing (XC9) |
| Runes and inscription | `rune_grammar.js`, imported only by pledges | Pattern grammar | None in the lead worlds' first volumes | Logged; no caller in range |
| Rites | Procedure layer and `ritual_conditions`, LOTM only | Procedure with an answering Agent (W3X17) | Dense (about 290 census rows, DG1) | Klein's rites |

### Bins

By the [idea register's](#how-each-idea-gets-considered-the-idea-register-2026-11-08) four questions.

| Bin | Rows | Note |
|---|---|---|
| Already built, needs a consumer | LAYX29 (memories stored), LAYX32 (brews on the engine) | Not more design |
| Docs only, can run beside the live arcs | LAYX34 anchor ledger, LAYX50 axis sheets, LAYX56 ladder visibility, LAYX60 below | No runtime file touched |
| Next, a lead caller pulls it | LAYX30 fight anchors (walked fights exist), LAYX61 below (the next window with a making beat), LAYX41 with LAYX51 (Harry's bench) | One slice each, at floor |
| Method, applied in every slice | LAYX24-LAYX28, LAYX31, LAYX33, LAYX44, LAYX48 | Each slice records how it applied them |
| Logged with an expected puller | LAYX35 (after LAYM1), LAYX36, LAYX37, LAYX38, LAYX39 (with W3X9), LAYX40, LAYX46, LAYX52-LAYX55, LAYX58 below | Each names its puller in its own row |

### More to consider

| Code | Disposition | Consideration | Level, effort and done check |
|---|---|---|---|
| LAYX57 | ACCOUNT FOR NOW | **A making brief answers five things** before a lane starts, all from existing rules: the mode (MR11), the world's properties or pattern vocabulary (MR8), the canon point with its near miss and failure (MR35), the use (MR32) and where inputs come from (MR27). | A prompt for briefs, like PRF1-PRF8; a blank answer names a gap and stops nothing |
| LAYX58 | LATER | **"Made for someone" as one slice.** A person asks for a thing, the lead makes it on world axes, hands it over, and the tie records it and later cites it. One slice then proves LAYX41, LAYX47, LAYX29 and LAYX39 together, and it is the palette's handmade gift (RLG3). | Sonnet, medium, after LAYX50. Done: a Hogwarts remedy for a named student and a Tingen charm for a client, each with a later line or choice that reads the memory, at floor |
| LAYX59 | ACCOUNT FOR NOW | **On ties, fights and making, a new considerations round first names the accepted rule or palette row it would change.** Default: if none changes, the round is a pointer and the effort goes to a slice. Dial: Weibao asking for a round overrides this. Reason: the palettes already hold these ideas, and the gap is in code. | Applies to this atlas; the ledger above is the first use |
| LAYX60 | LATER | **Do the two craft-engine brews show MR35's three cases?** Exact formula gives the canon product, a near miss gives a degraded one, free mixing gives an outcome. | Haiku read of the W1a and W2a receipts and their tests, small. Done: a yes or a named missing case per brew |
| LAYX61 | ACCOUNT FOR NOW | **A window whose beat is a making binds to the making engine.** This is LAYM3 applied to making; amulets and Gu refinement are the examples already passed. Old windows move only when touched (AR9). | The next Klein or Fang Yuan window with a making beat names its engine row in its receipt |
| LAYX62 | ACCOUNT FOR NOW | **World axes change product identity.** Moving a brew to world axes is a new law revision; products made before keep theirs (MR30). | Old saves may break by Weibao's standing preference, but the Seer brew and Cure for Boils fixtures need a replay or a recorded re-earn |
| LAYX63 | ACCOUNT FOR NOW | **Axes reach the player as words.** A bench shows what the character has observed in the world's terms, never axis names or numbers they haven't learned (MR31, PRS, XM16). | `check:rules` vocabulary lint passes on the bench copy |
| LAYX64 | LATER | **An ordinary character can do it too.** Each of LAYX51, LAYX52 and LAYX58 is walked once from a non-lead seat. | With each slice. Done: one non-lead walk per slice, natively |

### Next order (proposals)

Extends N1-N4. The live goal is unchanged: Klein to chapter 213 and Fang Yuan to chapter 199, owned by the live task record. Runtime steps below wait for an arc endpoint or Weibao's word.

| Code | Step | Why |
|---|---|---|
| N5 | One docs pass: LAYX34 and LAYX50, with LAYX56 and LAYX60 as small checks | Shows where lore can tune and what the axes are, with no runtime risk and no conflict with the arcs |
| N6 | Fight cases from fights already walked (LAYX30), then one calibrator run | Data only; replaces proposal bands with canon outcomes |
| N7 | Harry's bench on world axes (LAYX41, LAYX51) as a "made for someone" slice (LAYX58) | The cheapest proof of procedural making, with a use and a tie in the same slice |
| N8 | Klein's bench (LAYX52) and a week with one person (LAYX40) | The same proof in the first lead world, after N7 shows the shape |

## Rules, research, Gu, creatures, chemistry and what every domain needs (2026-11-09)

Weibao, 2026-11-09: "Yes do that, address the rules accordingly,  consider other implicit/required things and more? Research? Gu? Pet raising? oother stuff? Chemestry?" and "reconcile docs and core rules and more as to make future dev easier". Proposals (AD32). Evidence: file headers and import counts for the modules named below, the brew tests' titles, `.claude/rules/making-systems.md`. Code shape only; nothing was run or played.

### Rules

The rows of this chat that read as rules now have rule form, all proposed until accepted by name:

- [System practice rules](../SYSTEM_PRACTICE_RULES.md) SPR1-SPR14: how to pull, prove and tune a repeating system. They carry LAYX24-LAYX31, LAYX33, LAYX40, LAYX44, LAYX59 and LAYX61.
- [Making rules](../MAKING_RULES.md#proposed-additions-2026-11-09-ad32) MR37-MR41: world-level properties (LAYX41), one effect vocabulary (LAYX46), story makings on the engine (LAYX61), the making brief (LAYX57) and living things keeping identity (new, from Gu and creatures below).
- [Ground rules](../GROUND_RULES.md) gained a four-line SPR prompt block, and the [rules index](../RULES_INDEX.md) has register and router rows for both.
- **A gap that made the rules easy to miss:** the making path rule loaded for files named craft, potion, brew, dose, mixture, rune, alloy, workshop and invention, but not for `hp_lead_making.js`, `cast_making_adapter.js`, `lotm_formula_rows.js`, `lotm_ingredient_catalogue.js` or `book_gu_lead_refinement.js`. So an agent editing the book-world brews did not get MR1-MR36 loaded. The rule now also matches making, formula, ingredient, refine and amulet.

### Two checks from N5, done here

| Code | Result | Evidence and limit |
|---|---|---|
| LAYX60 | Both craft-engine brews test the exact formula and a near miss. Neither has a test for free mixing, MR35's third case. | Test titles in `tests/hp_lead_making.test.js` and `tests/lotm_seer_brew.test.js`; test bodies not read. Free mixing can't be tested meaningfully until axes are world-level (MR37) |
| LAYX56 | Not settled. `benchRowList` in `book_world_lotm_bench.js` returns the name, pathway and rung of every formula row with a `formulaKnown` flag, so the view model carries rungs the character hasn't learned of. | Whether the screen hides them was not walked. Next: one MCP look at a fresh Tingen character's bench |

### Where these domains stand

| Domain | In source today | Lore demand | What it lacks |
|---|---|---|---|
| Research | A Study view over existing lessons (`research_content`, `research_home`, `inquiry_study`); an AND/OR invention planner (`invention_planner`, one importer); an experiment log with six importers, HP brewing among them | Schools and study in both leads; Zorian's study months | Nothing generates what there is to research (XC12). Research doesn't yet write observations of a hidden property in the book worlds (XM16) |
| Gu | An original keeper's first year (`book_gu_keeper`: stipend, prices, meals, one refinement, upkeep through the `living_upkeep` seam, all authored dials); Fang Yuan's windows, with refinement as a window pack | Fang Yuan's walk to chapter 140 | Two implementations of the same things. Whether the lead windows use the keeper's upkeep was not traced |
| Creatures and pets | Four care families (`habitat_care` for a Village sheep pen, `book_care_*`, `field_care_*`, `status_care_*`), the companion roster with stages and wishes, `creature_layers` with no importer | Creature care is Harry's largest book-one demand, about 54 rows (DG4) | Whether the care families share one owner was not traced. No bond behaviors found by name |
| Chemistry | `craft_process_thermal` (staged heat kinetics, no importer), `craft_process_separation`, `craft_agitation`, `material_corrosion` | Tingen's ordinary layer; the Potions bench | The ordinary layer is built and unwired (XM24). XC10's layered law has no world using two layers |

### More to consider

| Code | Disposition | Consideration | Level, effort and done check |
|---|---|---|---|
| LAYX65 | ACCOUNT FOR NOW | **Gu is the stress test for the shared model.** One Gu is an item, a living creature, a tool and a power at once: it is fed (care), refined (a making on a living thing, MR41), used (the power grammar) and limited by the aperture (a pool, XC16). Engines that carry a Gu also carry a familiar, a wand with its own loyalty, living gear and a sealed artifact. | Fang Yuan's next refinement or feeding window names which engines it binds to (SPR3) |
| LAYX66 | ACCOUNT FOR NOW | **Care is one activity form.** Needs on a clock, what neglect does, growth and yield. Feeding a Gu, tending a Hogwarts creature, a sheep pen, a potted mandrake and a familiar are the same form under different law. Feeding is also the plainest standing order (LAYX1). | Before a fifth care family: LAYX71's trace |
| LAYX67 | ACCOUNT FOR NOW | **Raising a pet is care plus a tie plus teaching, with no new system.** The bond is a tie with a non-person and is counted by its readers (SPR2): it comes when called, refuses a stranger, defends, sulks after neglect. Training is the lesson form with the creature as the learner. | A creature slice lists its bond behaviors |
| LAYX68 | ACCOUNT FOR NOW | **Research is how hidden properties get learned.** Its product is an observation about a world property (MR1, MR31, MR37), so the axis sheets (LAYX50) define what there is to research, and an unknown shows only once noticed (XM23). | A research slice changes a later prediction, not a meter |
| LAYX69 | ACCOUNT FOR NOW | **Chemistry is the ordinary layer under potions.** A world's property set says which properties are ordinary (heat, solubility, acidity; real principles, banded and cited, XM21) and which are supernatural, so Tingen's chemistry and Neil's brew share a bench. Dial per world: Hogwarts can leave the ordinary layer thin. | The axis sheets mark each property's layer |
| LAYX70 | ACCOUNT FOR NOW | **Each domain slice says which implicit needs it covers** (the table below), in the way PRF6 names its ring. | A brief lists covered and left-out needs; a blank stops nothing |
| LAYX71 | LATER | **Trace the care families.** Who owns needs, clocks and neglect in `habitat_care`, `book_care`, `field_care`, `status_care`, `living_upkeep` and the companion roster, and what reads each. | Haiku read, small. Done: one table of owner and readers per family, with overlaps named |
| LAYX72 | LATER | **Gu on the engines.** Fang Yuan's next refinement runs on the making engine with the keeper's upkeep, and the same specimen survives it with its history. | Sonnet, medium, with the live Fang Yuan arc and its owner's agreement. Done: at floor, and the keeper life can run the same refinement |
| LAYX73 | LATER | **A creature for Harry.** One creature with needs, two bond behaviors and a yield that a potion uses (XM19: one item, two procedures). | Sonnet, medium, after LAYX51. Done: at floor, plus one non-lead walk |
| LAYX74 | LATER | **Learn a property by experiment.** One hidden property of an ingredient is learned at the bench and changes the next brew's stated expectation. | Sonnet, small to medium, with LAYX51 |

### Implicit needs of any making, care or research slice

Things a design rarely lists and a slice always meets. Each has an owner already; the table is a reminder, not new rules.

| Need | Question | Existing owner |
|---|---|---|
| Quantity and unit | How much, in what unit, and does a little more matter? | Alchemy audit's five records; MR5 |
| Time | How long, what happens while away, does it age or spoil? | ACR1-ACR14; the audit's P14 |
| Station and tools | What is needed at hand, and does it wear? | MR16, MR17; cauldron condition in Polyjuice |
| Who can do it | Skill, body, rank, and can someone else do it for you? | MR21, MR23 |
| Knowledge | What does the character know, and what stays hidden? | MR1, MR31, XM16 |
| Source of inputs | Wild, grown, bought, taken from a creature, salvaged? | MR25-MR28 |
| Storage and custody | Where does it sit, who may hold it, how much fits? | MG14; custody in the kernel |
| Harm and aftermath | What does failure do to the maker, the thing and bystanders? | Affliction seam; AD50 |
| Use and demand | Who or what consumes the result? | MR32, FLR4, W3X9 |
| Law and norms | Is it allowed, who would notice, and can they reach you? | SKIT4; authority needs a claim, knowledge and reach |
| Words and names | What is it called here, and what does the player read? | PRS1-PRS8, NMR1-NMR8, MR12 |
| Saved shape | What is pending if the game closes mid-work? | LAYX2, AR6, MR30 |

Other domains on the same footing, logged without a caller: herbology and farming, wandlore, enchanting, tailoring, breeding, taming, formations and arrays, cooking as a craft, construction.

### N5 results (2026-11-09)

Two sonnet readers ran the docs pass. Their files were read back here before folding; neither touched runtime code.

**Anchor ledger (LAYX34), [file](ANCHOR_LEDGER_VOL1_BOOK1_2026-11-09.md).** A script classified the 3,643 volume-1 rule rows and the 528 book-one rule rows by system and statement kind, with about 15 rows per kind hand-checked. Counted, not played.

| Code | Finding | Consequence |
|---|---|---|
| AL1 | LOTM's money has by far the most numeric anchors (about 340 of prices, wages and fares), then advancement and formulas (about 100), divination (about 85), the organisation career (about 80) and prayer and summoning (about 70) | Lore-fitting is best proven on Tingen's prices and wages, then on advancement. Corrects LAYX44, which named potions in general |
| AL2 | Harry's book-one potions have 12 rule rows and no numeric anchor. Six Harry systems have fewer than three anchors of any kind | Harry's bench is shaped by lore (order, failures), not fitted. N7 stays the proof of world-level properties and stops being a proof of fitting |
| AL3 | Loss of control (LOTM) has two numeric anchors and several negatives | It stays a shape: directions and failures, with assumed figures (SPR13) |
| AL4 | The rule rows hold no group for ties or for fights. Those statements sit in scene and people rows, which this pass did not read | LAYX29 and LAYX30 cannot be judged from this ledger. A second pass over scene rows is needed before either is tuned by lore |
| AL5 | The tolerance kind was detected poorly (4 of 15 and 2 of 5 correct). The other kinds held up at 11 to 15 of 15 | Tolerance anchors need a targeted read, not a regex. SPR8 keeps the kind; the ledger's tolerance column is not usable |
| AL6 | The three-anchor bar is low on large row sets | The ledger says where anchors exist. A fit still counts anchors per quantity it tunes (SPR7) |

**World potion axes (LAYX50), [file](WORLD_POTION_AXES_2026-11-09.md).** Six properties per world, drafted and run on today's craft engine in a scratch harness (the reader's report; the harness is not in the repo and was not rerun here).

| Code | Finding | Consequence |
|---|---|---|
| AX1 | Hogwarts: mend, calm, bite, venom, ward, burn. LOTM: spirit, bind, harsh, power, echo, strain. Both canon brews and their stated failures reproduce on world-level properties with today's numbers | MR37 looks workable on the current engine without changing a canon result |
| AX2 | No ingredient value is canon on level: 1 of 8 Hogwarts values and 1 of 31 LOTM values have even their presence stated for that ingredient. The rest follow from a recipe rule, are borrowed or are assumed | The sheets are a design, not a measurement, and say so per value (SPR13) |
| AX3 | The modes held (LAYX43), with corrections: Hogwarts shows no ingredient substitution in book one, so it defaults closed there. LOTM's substitutes are same-rung alternates and the same-pathway characteristic, not general stand-ins | LAYX52 is narrower than written: one alternate principal, not free substitution |
| AX4 | Three engine gaps showed up in the runs: an ingredient can't carry its own add-step (so a general "hot sting" rule can't coexist with a timed add); nothing caps an overdose; the law can't see two pathways clashing in one brew | Three gap rows for the D-E ledger, each with a puller: Harry's bench for the first, Klein's bench for the other two |
| AX5 | The canon Cure for Boils failure gives boils as well as a melted cauldron; today's law outputs the corrosion alone | One law row on a skin route, no new property |
| AX6 | Two repo sources disagree on which way the Seer brew's principals fail: the brew file's comment, and the brewing owner doc | A source question to settle against the text before LAYX52, not a design choice |
| AX7 | One more LOTM ladder has full formulas inside volume 1. The reader kept it in the private table and unnamed in the tracked sheet | Weibao's call whether the tracked sheet may name it |

**What changes in the order.** N5 is done. N6 (fight cases) needs a scene-row pass first (AL4). N7 keeps its place as the proof of MR37 with a use and a tie. A new candidate sits beside N6: fit Tingen's prices and wages against their anchors, since that is where the numbers are (AL1), and L-ECON was already judged to fit the engines as data.

## Ties, other systems and the area guide (2026-11-09)

Weibao, 2026-11-09: "what abou trelation ship stuff and more? other systems? rules to make future implementation easier ? areas/established abstraction guidiance?" Proposals (AD32). Evidence: `person_ties.js` read whole; greps for its callers, for `derivedBond`, `temperament` and `.memories`; file names of the `person_*` and `*_memory` families. Code shape only; nothing was run or played.

**What the tie trace found.** There are three layers, built at different times, and the newest one skips the middle one.

| Layer | Module | What it does | Reach |
|---|---|---|---|
| Record | The native `relationship` effect in `simulation_effects.js` | Directed regard per pair: axes plus up to 32 memories (cause, time, text), replay-safe by cause | Everything below writes through it |
| Character | `person_memory.js`, `person_memory_effects.js` (`derivedBond`), `person_temperament.js`, with `person_loyalty`, `person_severity`, `person_silence`, `person_standing`, `crowd_memory`, `rival_memory` | Regard that fades with time and depends on the holder's temperament | No `book_world_*` file mentions temperament, so the lead worlds supply none |
| World ties | `person_ties.js` (LT8) | A world declares its people and tie kinds; `tieEffects` writes regard plus what the player saw; an offer opens at a threshold | Two declarations (Tingen colleagues, Harry's lead life), three offers in all, one `tieEffects` call site in each |

| Code | Disposition | Consideration | Level, effort and done check |
|---|---|---|---|
| LAYX75 | ACCOUNT FOR NOW | **The lead worlds read raw regard.** `tieValue` returns the baseline and its comment says decay belongs to `person_memory` and is not applied. So fade and temperament, which exist, do nothing for Klein's or Harry's people. That may be right for a lead's circle and wrong for acquaintances; either way it should be a stated choice (SPR17). | The next tie slice says which read it uses |
| LAYX76 | ACCOUNT FOR NOW | **The offer is the only reader shape.** Three offers across two worlds is the whole of what ties do in lead play. Favor, refusal, visit, remembered act and vouching (SPR16) can be data shapes on the same declaration, as the offer is. | A second shape exists on `registerWorldTies` before more offers are written |
| LAYX77 | ACCOUNT FOR NOW | **Memories are text, and the palette asks for types (RLA3).** A memory is `{cause, at, text}`. `story_recognizer.js` finds grievances by matching words in the text. A kind on each memory would let a person cite the right one without parsing prose. | A remembered-act reader picks a memory by kind |
| LAYX78 | ACCOUNT FOR NOW | **The other person acts first sometimes.** Nothing in the tie module starts anything; every reader waits for the player. A visit or a message needs the storylet deck or world events as its trigger, with the tie as the gate (LAYX14). | One person-started beat in a week-with-one-person slice (LAYX40) |
| LAYX79 | LATER | **Trace the person and memory families.** Which of `person_*`, `crowd_memory`, `rival_memory`, `rehearsed_foe` and the companion roster own what, and which the lead worlds could adopt as they are. | Haiku read, small, alongside LAYX71. Done: one table of owner, readers and world reach per module |
| LAYX80 | LATER | **Tie and fight anchors from scene rows** (AL4). A pass over the scene and people rows for "by this chapter, this person does this for the lead" and for who won each fight, what it cost and what decided it. | Sonnet with a script, docs only, private rows. Done: an anchor table per lead for ties and fights, with row handles and no plot detail in the tracked copy |

**Rules.** Five tie lines joined the proposed [system practice rules](../SYSTEM_PRACTICE_RULES.md#ties-between-people) as SPR15-SPR19: one record and one way in, reader shapes beyond the offer, which regard a gate reads, warmth as a trait of the person, and audiences versus ties.

**Other systems, and the guide.** The same question (what is established, where is it, what bypasses it) applies to every area, so it now has one home: the [area guide](../AREA_GUIDE.md). For each area it names the module to build on, the entry points to call, where the state lives, a real caller to copy, the focused test and the known traps. It is navigation built from a source read; it makes no rule. [AGENTS.md](../../AGENTS.md) and the rules index point to it.

## Answers to the three questions, and what follows (2026-11-09)

Weibao answered the open questions ([his words](../gm/USER_VISION_LOG_2026-11.md#anchors-sealing-in-development-and-the-bench-2026-11-09)). Orders, counts and tolerances count as anchors where reasonable (SPR8). The axis sheet may name further LOTM ladders. The bench may show unlearned rungs. Sealing gates play, not development. The rows below are agent proposals (AD32).

| Code | Disposition | Consideration | Level, effort and done check |
|---|---|---|---|
| LAYX81 | ACCOUNT FOR NOW | **Three gates were being treated as one.** Spoiler sealing (lifted in development for books he has read), character knowledge (what Klein can know, AD6-AD8, unchanged) and raw prose out of git (unchanged). A brief that says "sealed" names which of the three it means. | No work. Done: briefs name the gate |
| LAYX82 | ACCOUNT FOR NOW | **Unlearned rungs in play are a knowledge question.** Default: the play screen shows a rung Klein has heard of by name with its formula unknown, and nothing for one he has never heard of; a developer view shows all rows. Dial: a world where ladders are public knowledge shows every name. | Decide when N8 touches the bench. Done: the bench has both views |
| LAYX83 | ACCOUNT FOR NOW | **World-level properties can now be fitted against every ladder.** The LOTM property set (MR37) was shaped on three ladders' lowest rungs. With the whole series open, all 23 brewable rows are test points, and a set that only fits Seer would show early. | Sonnet with the scratch harness, docs only, medium. Done: the set reproduces all 23 or names the rows it cannot |
| LAYX84 | ACCOUNT FOR NOW | **Non-numeric anchors need a hand check before they bind.** The ledger's classifier found tolerance rows at 4 of 15 and order rows at 11 of 15 on LOTM. AD49's guard (a reader row is not an anchor until checked) matters more for these kinds than for prices. | Part of N6-N8 briefs. Done: each bound anchor has a checked locator |
| LAYX85 | ACCOUNT FOR NOW | **Order anchors can contradict each other.** "A beats B" in one scene and "B beats A" in another is usually a deciding factor (preparation, information, a tool) and not an inconsistency. Fit the factor first (SPR14), then treat what remains under SPR11. | Applies to LAYX80. Done: the pass records the deciding factor per fight |
| LAYX86 | LATER | **Which other sources are open.** Only LOTM is stated as read in full here. Default: other franchise sources keep the current handling until he says the same of them. | Ask when a source's later volumes first matter |

## Numbers from results, and the other sources (2026-11-09)

Weibao on LAYX84: "build numbers based off of results? More to consider?" and on LAYX86: "What do we need to do for the others? I think some others were read already" ([his words](../gm/USER_VISION_LOG_2026-11.md#numbers-from-results-and-the-other-sources-2026-11-09)). The first became three proposed rules, [SPR20-SPR22](../SYSTEM_PRACTICE_RULES.md#tuning-by-lore): results are the contract and numbers are whatever reproduces them; results fix order and ratio while one stated figure or a declared unit fixes scale; some results are held back to test the rest. Rows below are agent proposals (AD32).

**Done in this round.** The potion-axis sheet now lists all 23 brewable LOTM rows across seven ladders ([section 2.7](WORLD_POTION_AXES_2026-11-09.md#27-all-23-brewable-rows-every-ladder-added-2026-11-09)), generated from the private skeleton. Read as a table it already says three things for LAYX83: six rows have one principal, fifteen state no amount for at least one principal, and rungs 4 and above take a characteristic, a uniqueness or divine blood, which belongs with advancement more than with a bench.

**What has been read.** From the [reading status](../gm/dispatch/protagonist-life-2026-10-27/READING_STATUS.md#reader-reconciliation-2026-11-09) (its statements, not rechecked here): 51 of 152 registered books have all five reading passes, including Harry Potter books 1 to 7 and LOTM volumes 2 to 8 with extras. Reverend Insanity volumes 5 to 7 have 31,812 rows that passed a source review and 2,015 held. The anchor ledger covers LOTM volume 1 and Harry's book one only. So the reading is ahead of the ledger by a wide margin, and extending the ledger is local script work with no provider cost.

| Code | Disposition | Consideration | Level, effort and done check |
|---|---|---|---|
| LAYX87 | ACCOUNT FOR NOW | **LAYX86 restated.** With sealing lifted for development, what another source needs is not permission. It needs a ledger: its rule rows sorted by anchor kind per system, then a hand check of the ones that will bind. | No work. Done: LAYX86 is read through this row |
| LAYX88 | LATER | **Extend the anchor ledger to what is already read.** `build_ledger.py` hardcodes two folders and two keyword-group lists. Give it a source profile (row folders, group keywords) and run it on LOTM volumes 2 to 8, Harry's books 2 to 7 and Reverend Insanity volumes 5 to 7. | Sonnet with the script, docs only, medium, no provider spend. Done: one ledger per source with per-kind precision samples |
| LAYX89 | ACCOUNT FOR NOW | **Reviewed rows outrank unreviewed ones.** Reverend Insanity's rows carry a qualified-or-held review; LOTM volume 1 and Harry's book one rows do not. A ledger built on the reviewed set starts closer to AD49's "checked" than the two already built. The ledger says which review state its rows have. | Part of LAYX88. Done: each ledger states its rows' review state |
| LAYX90 | LATER | **A fit that takes results.** `fitPowerPrices` fits prices to point anchors. SPR20 needs constraints: this beats that, this dose fails, this works within a margin. The fit returns numbers plus slack per number (SPR21). | Sonnet, runtime-adjacent tooling under `scripts/`, medium. Done: `fight_cases.json` and the Seer brew run through it and report slack |
| LAYX91 | ACCOUNT FOR NOW | **Each result is a replayable case.** `scripts/calibration/fight_cases.json` holds bands with a stale note. Under SPR20 it holds results with locators (winner, cost, deciding factor), and the numbers are free to move as long as the cases pass. That makes retuning cheap and safe (SPR12). | Part of N6. Done: cases are results, not bands |
| LAYX92 | ACCOUNT FOR NOW | **Channels meet at exchange points.** Money has a scale (about 340 stated figures); fights and ties have none. Scenes where one buys the other pin the ratio: a doctor's fee for a wound, a bounty for a kill, a loan a friend makes. Collect these in the scene-row pass (LAYX80). | Part of LAYX80. Done: exchange points listed per pair of channels |
| LAYX93 | ACCOUNT FOR NOW | **Numbers derived from the lead apply to everyone.** A fight number that reproduces Klein's wins is also the number a clerk meets. After a fit, one non-lead seat runs the same loop to see it is still livable (SPR1's seat check). | Part of every fit receipt. Done: one non-lead run named |
| LAYX94 | ACCOUNT FOR NOW | **Upper-rung potions are not bench recipes.** From section 2.7: where the principal is a singular thing with custody and a rite, the making is the mixing step inside the advancement procedure. MR37's property set is tested on rungs 9 to 5. | Decide when N8 touches the bench. Done: the bench brief says which rungs it covers |

**LAYX88 result (2026-11-09).** The ledger ran over the rule rows already read: [more sources](ANCHOR_LEDGER_MORE_SOURCES_2026-11-09.md), findings AM1-AM8. Row sets (counted, rerun once by the controller with matching totals): LOTM volumes 2 to 8, 30,060 rows; Harry Potter books 2 to 7, 7,762; Reverend Insanity volumes 5 to 7, 5,420 review-qualified rows; Reverend Insanity volumes 1 to 4, 6,998 unreviewed. What it changes:

- **The tunable/shape/assumed class stops being useful at this size** (AM1): every system group in the large sets clears the three-anchor bar. Compare anchors per 100 rows instead.
- **Where the anchors are** (AM3): money in LOTM, potions and money in Harry Potter, and in Reverend Insanity killer moves, Gu refinement and rank advancement. Thin: investigation, sealing and loss of control in LOTM; wands and daily routine in Harry Potter; feeding and kinship in Reverend Insanity volumes 5 to 7.
- **Gu feeding anchors sit in the unreviewed early volumes** (AM6), so the keeper's upkeep numbers need those rows hand-checked before they bind (LAYX89).
- **Order anchors are usable on Reverend Insanity and poor elsewhere; tolerance is poor everywhere** (sampled, 10 rows per kind: order 10/10 on the qualified set, 5/10 on LOTM, 6/10 on Harry Potter; tolerance 2 to 5 of 10). SPR8's tolerance kind needs a hand read per case, which fits SPR20: take the result ("too much killed him") as the constraint and skip the classifier.
- **A quarter of LOTM and Harry Potter rows fall in no system group** (AM8), so the keyword groups from volume 1 and book one miss later-volume systems. Regrouping is the next improvement to the ledger, before any fit uses it.

## Scope of ties, effect distinctions, and places that refill (2026-11-09)

Weibao asked whether relationships should be deferred as too open-ended, said crafting seems reasonable and that potions and spells sharing effects "is nice, but there can still be distinctions", and raised abstraction layers such as "the areas to farm" and "regenerting areas of enemies" ([his words](../gm/USER_VISION_LOG_2026-11.md#ties-scope-effect-distinctions-and-farm-areas-2026-11-09)). MR38 now carries the distinction as a delivery record. The rows are agent proposals (AD32).

**Code read for this round.** `craft_sources.js` (`defineSourceTable`, `nodeAt`, `harvest`) already keeps standing availability apart from harvested inventory on a calendar, used by the Paradise coppice. Upstream `models/location.js` combat zones carry a fixed `enemy_count` per clear. `shop_restock.js` is eight lines. Nothing joins them.

| Code | Disposition | Consideration | Level, effort and done check |
|---|---|---|---|
| LAYX95 | ACCOUNT FOR NOW | **Ties: build the bounded part, defer the open part.** Bounded: five tie kinds times a short list of reader shapes (SPR16), anchored on results ("by this chapter she does this", SPR14, SPR20). Deferred until a slice needs them: fading and temperament, ties between two non-player people, typed memories, family and romance dynamics. | No work. Done: tie briefs name one reader shape and one person |
| LAYX96 | LATER | **First new tie reader: the favor.** A person's regard changes a price, a wait or an access. It is the cheapest shape because money already has a scale, and it gives a source (LAYX97) an owner to be on good terms with. | Sonnet, runtime, small. Done: one person's terms change with regard, reachable in play |
| LAYX97 | ACCOUNT FOR NOW | **One abstraction for places that deplete and refill.** A source is a place, a stock, a recovery law, an access condition and who else draws on it. It covers a herb patch, a mine, a hunting ground, a monster den, a shop shelf and a notice board. It is the ordinary-day caller SPR1 asks for: gathering feeds making, hunting feeds fights. Default: extend `craft_sources.js` from materials to populations before writing a second module. | Design note first, then one slice. Done: one gather source and one enemy source on the same module |
| LAYX98 | ACCOUNT FOR NOW | **Recovery is a law per source, not one timer.** Kinds: regrows on the calendar; breeds from what is left, so overhunting collapses it; restocks from a supplier, so it fails when the supplier does; refills from outside (migration, a tide, new arrivals); does not recover (a vein, a ruin). | Part of LAYX97. Done: at least two kinds exist |
| LAYX99 | ACCOUNT FOR NOW | **Enemies in an area are a population that responds.** Killing lowers a count; the rest may flee, band together, send something worse or draw a rival who was waiting. That is what separates a hunting ground from a counter that resets. Dial: a world with endless spawn (a dungeon that refills by its own law) says so. | Part of LAYX97. Done: one response beyond the count dropping |
| LAYX100 | ACCOUNT FOR NOW | **How farmable a world is, is the world's dial.** LOTM keeps Beyonder ingredients scarce and priced, so a farmable patch there breaks stated prices (AD49); the Gu world has wild Gu, beast groups and tides; Hogwarts has greenhouses and a forest with rules about entry. The first slice belongs where canon does not constrain it. Default: the Village, which is original. | Decide at LAYX97's slice. Done: the slice names its world and why |
| LAYX101 | ACCOUNT FOR NOW | **Others draw on the same source.** A rival hunter, a clan's claim or a season's buyers change what is left and what it sells for. Supply reaching the market moves the price (economy seam), and a claim makes access a matter of standing or a favor (LAYX96). | Later slice. Done: one non-player draw on one source |
| LAYX102 | ACCOUNT FOR NOW | **Repeating a source is the idle loop.** The routine/program machinery already repeats a job; a source gives it something that changes as it is repeated (thinner yield, rising danger), so a long run is a decision and not a multiplier. | Part of LAYX97. Done: yield or danger changes across a routine |

## Keep areas simple; long-term features not yet considered (2026-11-09)

Weibao: "consider areas to just keep simple? consider how other games addresses these? YAIR and proto23 just has areas for fighting enemies and stuff?" and "Also consider long term features like farming and more? Other stuff not considered yet?" ([his words](../gm/USER_VISION_LOG_2026-11.md#simple-areas-and-long-term-features-2026-11-09)). This round revises LAYX97-LAYX99: the simple area is the default and the responding population is a later option. Rows are agent proposals (AD32).

**How the two parents do it** (shown in source; the Proto23 lines are from the repo's [reader notes](../research/proto23/readers-2026-10-10/R3_equipment_creatures_areas.md), not reread here).

| | YAIR (`src/models/location.js`, `CombatZone`) | Proto23 (`Area`, reader notes section 3) |
|---|---|---|
| Who you fight | A list of enemies or fixed groups, up to 8 at once | A weighted pool with a level band, one at a time |
| How long | `enemy_count` groups to a clear, then it repeats | `size` kills to a clear, or -1 for endless |
| Refill | None needed; every fight is a fresh draw | No timer; a cleared area resets its size by script |
| Why come back | First-clear reward, repeatable reward, rewards at a clear count, unlocks | Clear unlocks the next area; an area drop table beside creature drops, improved by a hunting skill |
| What the place adds | Location types that train a skill (dark, narrow), light, temperature | Area drops, `onEnd` and `onDeath` hooks |

Neither tracks a population, a respawn clock or a response. The area stays the same and the character changes, and the reasons to move on are unlocks, drops a recipe needs and a finish line. Other idle games known to the agent (inference, not checked here) follow the same shape: pick an area, it loops, and tasks or dungeons supply the reason to switch.

| Code | Disposition | Consideration | Level, effort and done check |
|---|---|---|---|
| LAYX103 | ACCOUNT FOR NOW | **The simple area is the default.** An area is a pool of opponents, a size, a clear reward, an area drop list and entry conditions. No clock and no population. The Village already has this through `CombatZone`. LAYX97's richer source stays for gathering, where `craft_sources.js` already does it. | No work. Done: area briefs start from this shape |
| LAYX104 | ACCOUNT FOR NOW | **One three-way dial covers the worlds.** Endless (a training ground, a forest), sized (clear it, it resets) and finite (it does not come back). Finite is what LOTM needs, where ingredients are scarce and priced; the Gu world's beast groups can be sized. LAYX98's recovery laws fold into this until a slice asks for more. | Part of the first area slice. Done: the slice names its setting |
| LAYX105 | LATER | **The missing piece is an area for the lead worlds' fight engine.** The Village's zones call the upstream battler. `tempo_fight` has no repeatable caller: every lead-world fight is a story window. A simple area that draws an opponent and runs `tempo_fight` is the ordinary-day caller (SPR1) at the lowest cost. | Sonnet, runtime, small to medium, needs the owning session's agreement for the world it lands in. Done: one area in one lead world, cleared twice in play |
| LAYX106 | ACCOUNT FOR NOW | **Variety comes from reasons to move, not from the area.** Clear unlocks, a drop a recipe needs, a bounty or commission (W3X), a skill a kind of ground trains, a condition such as night or season. Each is data on the simple area. | Part of LAYX105's brief. Done: the area has at least one reason to leave it |
| LAYX107 | ACCOUNT FOR NOW | **The place can give things the creature does not.** Proto23's area drop list, improved by a skill, is the cheap link from fighting to making: herbs, ore and oddments from where you were. | Part of LAYX105. Done: one area drop feeds one recipe |
| LAYX108 | LATER | **A population that responds (LAYX99) becomes an option, not a requirement.** It suits a world where canon makes hunting consequential (a clan's beasts, a protected forest) and is a setting on one area when a slice wants it. | Not scheduled. Done: recorded as an option on the area shape |

**Long-term features not yet considered in this chat.** A palette, not a plan (AD5). "Exists" is from module names and heads, not walked.

| Code | Feature | What exists | What it would need |
|---|---|---|---|
| LAYX109 | **Farming and plots.** Timed growth, seasons, tending, yield | `field_layer*`, `habitat_care` (sheep, lazy ticks), the Paradise coppice on `craft_sources` | One plot shape shared by crops, herds and coppice; the care area's missing shared seam (area guide) |
| LAYX110 | **Time away.** What happens to timers, plots and routines while the game is closed or time is skipped | Lazy evaluation in `habitat_care`; routines/programs | A stated rule per kind of timer: catches up, pauses, or spoils. Farming cannot be designed before this |
| LAYX111 | **Delegation.** Someone else farms, hunts or minds the shop | Routines repeat the player's own jobs; companions exist | A hired or allied person running a routine, paid from the purse; ties give the first favor (LAYX96) |
| LAYX112 | **Storage and carrying.** How much can be kept and moved | Inventory; `ready_stock` | A limit that makes a long run a choice; spoilage for fresh goods |
| LAYX113 | **Sinks.** Where farmed goods and coin go so prices hold | Economy faucet and sink ledger (memory only) | A sink per faucet a new area or plot opens; in LOTM the stated prices are the check (AD49) |
| LAYX114 | **What kills teach.** A bestiary that fills in with experience | Knowledge rules (AD6-AD8) | Counts per creature unlocking what the character knows about it; improves odds reading |
| LAYX115 | **Defeat in an area.** What losing costs outside a story scene | Story windows author their own | A default per world: wake at home, lose the run's haul, an injury, or worse |
| LAYX116 | **Bounties and commissions.** Standing reasons to go somewhere | W3X commissions (atlas) | Boards that point at areas and plots |
| LAYX117 | **Carry between worlds.** Whether farmed goods and trained skills cross | Cross-world transfer rules, cheat cosmology | A per-item answer; otherwise the easiest world's farm supplies every world |
| LAYX118 | **The long run.** What a player works toward after the areas are cleared | Continuing growth and optional restarts (direction of 2026-11-01) | Each new repeatable (area, plot) says what it feeds beyond itself |

### Other games (added the same turn, Weibao: "Consider oter games too")

From the agent's memory of well-known games, not checked against sources today; treat each line as a lead (inference).

| Game | Areas and enemies | Refill | Farming | Reason to move on |
|---|---|---|---|---|
| Melvor Idle | Pick one monster or area and it loops; dungeons are fixed sequences ending in a chest | Next monster appears at once | Plots with real-time timers, seeds and compost; plot count is the limit | Slayer tasks assign a target and pay their own currency; areas with entry requirements |
| Clicker Heroes, Idle Champions | A ladder of zones; so many kills advances; a timed boss every few zones | Instant | none | The ladder itself; failing a boss means you farm the last zone |
| NGU Idle | Zones with a chance of a boss; an endless tower scaled to you | Instant | none | Each zone drops one gear set; manual play beats idle play |
| Kittens Game | No areas. "Send hunters" is a button with a yield roll | Not applicable | Fields as buildings with seasons | Resource needs |
| Idleon | Each character is parked in an area; gains are computed from stats as a rate | Rate-based, also offline | Plots and timers | Per-area drops and quests |
| Stardew Valley | Mine floors with a fixed set of monsters | Resets each morning | Plots, seasons, daily watering | Deeper floors, seasonal crops |
| Monster Hunter | A named quest into a map for a target | Per quest | Small farm that ticks per quest | The quest board |
| RimWorld, Dwarf Fortress | Real animal populations; raids scale with wealth | Simulated | Simulated crops and seasons | The simulation pushes back |
| Cultivation sims (several) | Send a disciple out; a timed trip returns a result | Per trip | Spirit fields on timers | Events on the map |

| Code | Disposition | Consideration | Level, effort and done check |
|---|---|---|---|
| LAYX119 | ACCOUNT FOR NOW | **There are four models, and the cheapest three are enough.** Loop (stay and fight: YAIR, Proto23, Melvor), ladder (clear to advance, with a gate), expedition (go out for a set time, come back with a result) and simulated population. LAYX103 is the loop. The simulated population is the costly one and stays optional (LAYX108). | No work. Done: area briefs name the model |
| LAYX120 | ACCOUNT FOR NOW | **The expedition fits the story worlds better than the loop.** A Nighthawk does not farm a forest; he takes a case, is gone a night and comes back with an outcome. "Commission, time away, result from your abilities and preparation" is canon-shaped for LOTM and Hogwarts, needs no area screen, and is results-first (SPR20). Default: loop in the Village and the Gu world's wilds, expedition in LOTM and Hogwarts. | Shapes LAYX105. Done: LAYX105's brief picks loop or expedition for its world |
| LAYX121 | ACCOUNT FOR NOW | **Assigned targets solve "park in the best area forever".** Melvor's slayer task hands you a target and pays in its own currency. Here that is a bounty or commission (LAYX116) from a person or institution, which also gives ties and standing something to pay out. | Part of LAYX116. Done: one board assignment |
| LAYX122 | ACCOUNT FOR NOW | **Idle and offline play need a fight you can summarize.** Rate-based games compute gains from stats. `tempo_fight` resolves move by move. A summary run (many fights, expected result and spread) is needed for a long routine, and it is the same tool SPR9 needs to report route odds. | Sonnet, tooling then runtime, medium. Done: a summary of N fights matches N played fights within a stated margin |
| LAYX123 | ACCOUNT FOR NOW | **"Resets each morning" is the simplest refill that still means something.** The game has calendars; a daily or seasonal reset gives scarcity and a reason to return without a population or a clock per node. It is the sized setting of LAYX104 with the calendar as the trigger. | Part of the first area slice. Done: reset trigger named |
| LAYX124 | ACCOUNT FOR NOW | **Plot count is the farming limiter everywhere.** Timers and seasons set pace; the number of plots sets scale and is what a player buys, earns or is granted. That makes land and tenancy (homes, institutions) the gate for farming. | Applies to LAYX109. Done: the plot shape says what grants a plot |
| LAYX125 | ACCOUNT FOR NOW | **Attention should beat absence.** NGU pays more for manual play. Here a routine could give the plain result while playing it yourself opens the decisions (preparation, a tool, an ally) that SPR14 says decide fights. | Design note with LAYX122. Done: the difference between routine and played is stated |

## The lore run versus the game, and what other games suggest (2026-11-09)

Weibao: "What about other inspirations from games and more? Dwarf fortress's procedural stuff? More to consider? COnsider the distinction of a lore run for the sake of fleshing out the world versus the gameplay of playing as someone seperate or part of the same story, just a different part of it?" ([his words](../gm/USER_VISION_LOG_2026-11.md#lore-run-versus-gameplay-and-game-inspirations-2026-11-09)). Accepted direction stays as it is: the lead's life is the main line and the developer playthrough (AD44), ordinary entry uses lore-grounded starts, and non-lead characters do not need full lives. The rows are agent proposals (AD32) about what follows from naming the distinction. Game descriptions are from the agent's memory, not checked today.

**The distinction.** A lore run and a game are measured differently.

| | Lore run (the lead, canon choices) | Game (another seat) |
|---|---|---|
| Purpose | Flesh out the world: places, people, prices, institutions, events, anchors | Live in it: an ordinary day that is playable and choices that matter |
| Measure | Fidelity to the book | Whether a repeatable loop exists and is worth repeating |
| Shape | Scenes, each once | Loops, favors, areas, makings, done many times |
| Who plays | The developer playthrough, and anyone who wants story mode | Weibao as someone in the same story at a different part, or someone separate |

This explains the chat's main finding. Story windows produce once-only acts because a lore run is scenes; that is correct for a lore run and insufficient for a game.

| Code | Disposition | Consideration | Level, effort and done check |
|---|---|---|---|
| LAYX126 | ACCOUNT FOR NOW | **A lore-run window leaves three kinds of thing, and says which.** World facts (a place, a person and their routine, a price, an institution's rule), system anchors (results a system must reproduce, SPR20) and lead-only scenes. The first two are what other seats live on. Default: each window's receipt lists what it added of each. | Receipt line, no new gate. Done: one window's receipt lists the three |
| LAYX127 | ACCOUNT FOR NOW | **The bystander check.** After a window, ask what someone standing nearby got from that chapter: a shop that now exists, a rumour, a price change, a person who is now busy or dead. If the answer is nothing, the window built a scene and not the world. | Prompt in the lead-life brief. Done: the answer is written per window |
| LAYX128 | ACCOUNT FOR NOW | **The story is the world's calendar.** For another seat, canon events happen on their dates whether or not you are there, as news, closures, danger or opportunity. The lore run already knows the dates. Default: canon events are world events with a visible wake, and a seat's distance decides how much reaches it. | Design note. Done: one canon event reaches a non-lead seat as a consequence |
| LAYX129 | ACCOUNT FOR NOW | **The lore run's choices are the lead's script as a non-player person.** When Weibao plays someone else, Klein still has to act. The developer playthrough's recorded choices are that behaviour, played back until the player disturbs something. | Later. Done: the lead runs one day from the recorded choices with the player elsewhere |
| LAYX130 | ACCOUNT FOR NOW | **Three seats, by distance.** The lead (story mode). A participant in the same story at a different part (a colleague, a classmate, a clan member), who meets canon at set points. Someone separate (another city or year), for whom canon is distant news. Each needs less of the book and more of the repeatable systems as distance grows. | Applies to world entry (WER). Done: a start names its distance |
| LAYX131 | ACCOUNT FOR NOW | **The player knows the plot and the character does not.** Weibao has read LOTM. Playing beside the story with that knowledge is the fun of it, and it is the knowledge rule (AD6-AD8) under strain: the character can act on a hunch, and cannot cite what they never learned. Dial: a start that grants foreknowledge in-world (a transmigrator) says so. | Applies to starts. Done: a start states what the character knows |
| LAYX132 | ACCOUNT FOR NOW | **Disturbing canon needs a default.** The canon-pull rules cover the lead. For another seat: canon holds unless the player removes something it depends on, then the nearest plausible person or event fills the gap, and what cannot be filled diverges and is recorded. | Design note, owned by the lead-life systems design (LSD). Done: one worked example |

**From other games.**

| Code | Source | What it does | What it suggests here |
|---|---|---|---|
| LAYX133 | Dwarf Fortress | Generates a world, then simulates its history, then lets you play in it. Fortress mode and adventure mode share one world: you can walk into the ruins of your own fort | The same split as lore run and game. For a book world the history is the book and the lore run is history generation done by hand; for original worlds the history can be generated |
| LAYX134 | Dwarf Fortress | Materials, creatures and items are defined in data files with properties; everything made is a combination | MR37's world property set is this. It argues for properties in data per world, not in recipe code |
| LAYX135 | Dwarf Fortress | Artifacts and engravings depict real events from the history | Made things and places that reference real receipts: a keepsake names who made it and when (MR30), a ruin shows what happened (AV1 in the procedural story palette) |
| LAYX136 | Dwarf Fortress | Legends mode lets you read the generated history | A history view of canon and generated events, limited in play to what the character has learned |
| LAYX137 | Dwarf Fortress, Crusader Kings | Detail falls off with distance from the player | Already in `EMERGENT_SYSTEMS`; it is what makes LAYX128 affordable |
| LAYX138 | Crusader Kings | Opinion is a sum of named modifiers with reasons and expiry; you can play any character in the world | Regard as remembered causes is what the tie record already stores (32 memories per pair). Shown as reasons, never a number. Playing any seat is LAYX130 |
| LAYX139 | Persona, Fire Emblem, Hades | A relationship is a short ladder of ranks, each opening a scene or a benefit | Supports LAYX95: bounded ties work in loved games. A ladder is the simplest reader shape for people outside the lead's circle |
| LAYX140 | Caves of Qud | Hand-written main story and places inside a procedurally generated history and villages | The mix this project is heading to: canon authored, the rest generated around it |
| LAYX141 | Mount and Blade, Kenshi | You start as nobody; lords and factions use the same rules you do and carry on without you | The separate seat. It is also SPR1's test: a system a non-player can run is a system that exists |
| LAYX142 | Shadow of Mordor | An enemy who beat you remembers and is promoted | `rival_memory` and `rehearsed_foe` exist (LAYX79 to trace). One remembered opponent per area is cheap variety on the simple area |
| LAYX143 | RimWorld | A storyteller paces events by how the colony is doing | A pacing director over world events, with canon dates as fixed points it works around |

## Fleshing out the world with lore runs, chance, and the three core inspirations (2026-11-09)

Weibao: "how to flesh out world with the lore runs? Do we need to adjust current work and more? more to consider? Isnt alot of stuff we do probalistic and more? Caves of QUd and RImworld, and maybe Shadow of mordor would and should be core inspirations, we should have considered this previously already along time ago did we not?" ([his words](../gm/USER_VISION_LOG_2026-11.md#fleshing-out-the-world-and-core-inspirations-2026-11-09)). The core-inspirations line is his direction and is now in [USER_VISION](../USER_VISION.md) and the digest. Everything else here is agent proposal (AD32).

**Were they considered before? Yes, and the previous round of this atlas missed it.** Found in the repo today:

| Game | What already exists | State |
|---|---|---|
| Caves of Qud | Named in USER_VISION for unfair difficulty (2026-10-03). A [systems audit](../research/qud-systems-audit-2026-10-15/REPORT.md) with a generated-world-and-quests part, plus `research/caves-of-qud/`. "Legend lines, Qud style" in `EMERGENT_SYSTEMS.md` | Researched; legends not built |
| RimWorld | `research/rimworld/` findings (body and social). Director personalities in `EMERGENT_SYSTEMS.md` | Researched; no director in code (no module by that name) |
| Shadow of Mordor | Weibao asked "Nemesis system?" on 2026-10-01. "Enemies that remember" is I2 in the procedural story palette. `rival_memory.js` is imported by `tempo_fight_domain.js` and `native_battle.js` | Partly built; reach in lead worlds not walked |
| Related code | `storylet_deck.js` (simulation), `storylet_deck2.js` (LOTM deck), `story_recognizer.js`, `cast_schedule.js` with source ranks canon, intention, routine, fill | Built |

LAYX133-LAYX143 presented these as fresh ideas from memory. They were already researched and partly built. The gap was that they lived in palettes and research folders and not in the one-page direction, so a new chat did not start from them. That is now fixed for these three; LAYX144 covers the general case.

**Chance.** Much of the game is rolled: fight harm odds, brew outcomes, gather odds, seeded streams for generation. A lore run is then one path through a world of chances.

| Code | Disposition | Consideration | Level, effort and done check |
|---|---|---|---|
| LAYX144 | ACCOUNT FOR NOW | **Research that is not in the digest gets rediscovered.** A core inspiration belongs in USER_VISION with a link to its research and the code that came from it. Default: when a reference game or book is named as core, one line goes there. | Done for three. Done check: the digest names them |
| LAYX145 | ACCOUNT FOR NOW | **Canon is one draw.** The book shows what happened once. The world a bystander lives in is the spread that draw came from. So the lore run records, per result, whether the book treats it as ordinary, lucky or desperate (SPR9), and the fit targets the spread with canon inside it. The lore run itself pins the canon outcome by a recorded seed or a stated override, so it stays replayable. | Receipt line. Done: one fight and one brew carry the label |
| LAYX146 | ACCOUNT FOR NOW | **Rolled interactions answer "ties are too many possibilities".** RimWorld does not author relationships. People with a few traits roll small interactions by compatibility, each leaves a remembered reason that fades, and the relationship is what accumulates. Here the tie record already stores remembered causes. A small set of rolled everyday interactions per world, weighted by temperament, fills in everyone the book does not cover; the lead's circle stays anchored to canon (SPR17). | Design note, then a slice after LAYX96. Done: two non-lead people's regard changes over a week with no authored scene |
| LAYX147 | ACCOUNT FOR NOW | **Canon is the fixed point and generation is the fill, at one lower rank.** `cast_schedule.js` already ranks canon over intention over routine over fill. The same ranking can apply to places, shops, prices and people: what the book states is fixed, what it implies is borrowed (SPR13), and the rest is generated from the world's own grammar. This is Qud's hand-written story inside generated villages. | Design note. Done: one street in Tingen has canon shops and generated ones, told apart in the developer view |

**How a lore run fleshes out the world** (method, each a receipt prompt and not a gate).

| Code | Step | What it produces |
|---|---|---|
| LAYX148 | **Harvest each window.** Every place, person, routine, price, rule of an institution and dated event in the chapter becomes a world record, whether or not the lead uses it | The world facts of LAYX126 |
| LAYX149 | **Play the days the book skips.** "A week later" is seven ordinary days. The lead's shifts, study, practice, wages and errands in that gap are the repeatable loop (SPR1), and the book's before and after are its anchors | The ordinary day, calibrated by canon at both ends |
| LAYX150 | **Write down what others did meanwhile.** The people and scene rows say where the cast was off the page. Those become schedule rows at canon or intention rank | A cast that moves without the lead |
| LAYX151 | **Fill around the fixed points** (LAYX147) and label each fill by basis | A street with more than the named shop |
| LAYX152 | **Walk one ordinary person at each arc waypoint.** From the saved scenario (AD54), play a day as a clerk or a first-year who is not the lead. What they can do is the measure of how fleshed out the world is | The bystander check, played and not asked |
| LAYX153 | **Record canon results with their odds label** (LAYX145) | Anchors a fit can use |

**Does current work need adjusting?** A proposal for the session that owns the Klein and Harry arcs; this chat has not edited its record.

| Code | Adjustment | Cost |
|---|---|---|
| LAYX154 | Keep going. Klein through Tingen stays the build order. Nothing here stops or re-plans it | None |
| LAYX155 | Add to each window's checkpoint entry: what it added to the world, the results it recorded with an odds label, and the bystander answer | Three lines per window |
| LAYX156 | Where the book skips days, build or reuse a loop for them and do not jump the clock. This is the one change that alters what gets built | Varies; it is the missing ordinary-day caller, so the cost buys the thing the chat found missing |
| LAYX157 | At each arc waypoint, one non-lead day-walk (LAYX152) before the next arc | One short walk per arc |
| LAYX158 | Trace where `rival_memory` and the storylet deck already reach in the lead worlds before proposing anything new for opponents who remember or paced events (extends LAYX79) | Haiku read, small |

## Potion numbers from later books and outside sources (2026-11-09)

Weibao: "Does the potions ever get the numbers? Did they ever release the mad blood princ'es book or something? In that case why cant we get the values elsewhere, search online if anyone analyzed it, or find lore books, or look at the games? there are manmy ways?" ([his words](../gm/USER_VISION_LOG_2026-11.md#potion-values-from-other-sources-2026-11-09)). SPR13 now ranks borrowed sources. Rows are agent proposals (AD32).

**Later books (counted, from the [more-sources ledger](ANCHOR_LEDGER_MORE_SOURCES_2026-11-09.md), rows unreviewed).** Book one has 12 potion rule rows and no figure. Books 2 to 7 have 169 potion rows with 45 anchors: 10 points, 17 bands, 18 counts or durations, plus 37 sequences and 23 negatives. So the series does give numbers, mostly from book 2 on (brewing durations, counts, stirring sequences, what went wrong).

**Outside sources (web search today, four queries; each line is a lead to verify before use).**

| Source | What it has | Rank under SPR13 | Checked today |
|---|---|---|---|
| The Half-Blood Prince's textbook | Not published. Only fan-made replicas were found | none | [HP Lexicon](https://www.hp-lexicon.org/?p=546), search found no official edition |
| Pottermore's brewing game (2011 to 2015) | Step recipes with counts. One lexicon entry gives the Cure for Boils as 6 snake fangs, 4 horned slugs, 2 porcupine quills, five clockwise stirs and a wand wave | Author-adjacent | [World of Potter lexicon](https://worldofpotter.eu/lexicon/entry/019e8a18-15f4-72a8-8864-d208498554d3), [Compendium](https://harry-potter-compendium.fandom.com/wiki/Cure_for_Boils). Exact timings not confirmed |
| Wonderbook: Book of Potions (2013) | A potions primer with a new author character, made with Rowling; its Cure for Boils is a one-part recipe that differs from Pottermore's | Author-adjacent | [Harry Potter Wiki](https://harrypotter.fandom.com/wiki/Book_of_Potions), [MuggleNet](https://www.mugglenet.com/?p=1206241). Full recipe list not retrieved |
| Hogwarts Legacy (2023) | Ingredient sets, counts and brew times per potion; guides disagree on some values across patches | Licensed game | [Sportskeeda](https://www.sportskeeda.com/esports/hogwarts-legacy-potions-guide-how-obtain-recipes-ingredients), [Fextralife](https://hogwartslegacy.wiki.fextralife.com/Potions) |
| Fan lexicons and class sites | Collated recipes, often mixing the above | Fan analysis | [HP Lexicon note](https://www.hp-lexicon.org/?p=4726) |

| Code | Disposition | Consideration | Level, effort and done check |
|---|---|---|---|
| LAYX159 | ACCOUNT FOR NOW | **The Hogwarts potion bench need not wait for numbers.** LAYX44's "no numeric anchor" was about book one alone. Later books and author-adjacent material give counts, sequences and durations. | No work. Done: N7's brief cites this section |
| LAYX160 | LATER | **Collect the outside values for the book-one potions.** Pottermore and Book of Potions recipes for the potions a first-year meets, each value with its source and rank, into the axis sheet's Hogwarts section. Values and steps only, paraphrased; no copied text. | Haiku with web search, docs only, small. Done: the Cure for Boils and two more have a sourced value table |
| LAYX161 | ACCOUNT FOR NOW | **Outside sources disagree with the book and with each other, and that is data.** Pottermore's Cure for Boils had no way to take the cauldron off the fire, which the book makes the whole point of the lesson; Book of Potions uses a different recipe. Under SPR11 the book wins, the others fill what it leaves open, and a disagreement between them is a dial. | Applies to LAYX160. Done: each conflict names which source governs |
| LAYX162 | ACCOUNT FOR NOW | **A game's numbers carry order and ratio, not scale.** A 15-second brew was tuned for an action game. Which potion takes longer, how many ingredients, which ingredient recurs: usable. Seconds and Galleon prices: not, unless a book figure pins the scale (SPR21). | Applies to every licensed-game source. Done: borrowed values say what was kept |
| LAYX163 | ACCOUNT FOR NOW | **The same ladder exists for every world.** LOTM has the author's side material, the adaptation and a large wiki; Reverend Insanity has fan-compiled Gu lists; Mother of Learning has the author's worldbuilding posts. A source's outside ladder belongs in its ledger so a slice knows where to look when the book is silent. | Part of LAYX88's follow-up. Done: each ledger has an "outside sources" section |
| LAYX164 | ACCOUNT FOR NOW | **Real-world counterparts are the bottom rung and often the best.** Hemlock, aconite, nettles and mandrake are real plants with real toxicity. A world's harsh ingredients can borrow their ordering from pharmacology, labelled as borrowed. The LOTM sheet already does this for one auxiliary. | Applies to MR37 property sets. Done: borrowed-from-real cells are labelled |

## Many routes to one product (2026-11-09)

Weibao: "There might be different ways to make the same thing, and there might be differences in quality and efficientcy, after all, the prince's potion book had enhanced recipes and more? same thing should apply for other worlds and more, and potions should be derivable from procedural rules, like effects of ingredients and more" ([his words](../gm/USER_VISION_LOG_2026-11.md#many-routes-to-one-product-2026-11-09)). The direction is in USER_VISION. Its rule form is proposed as [MR42-MR44](../MAKING_RULES.md#proposed-additions-2026-11-09-ad32); accepted MR6-MR10 and MR21 already hold most of the ground (formulas as attractors, composition over catalogs, open slots, recorded methods, skill as control). Rows are agent proposals (AD32).

| Code | Disposition | Consideration | Level, effort and done check |
|---|---|---|---|
| LAYX165 | ACCOUNT FOR NOW | **What was missing from the accepted rules.** They say any mix resolves and a formula is an attractor. They do not say a product has several deliberate routes with different quality and cost, that the taught recipe sits below the best one, or that a method is ownable. MR42-MR44 add those three. | No work. Done: making briefs cite MR42-MR44 |
| LAYX166 | ACCOUNT FOR NOW | **The Prince's notes are handling changes, which the engine can express.** Crushing where the book says cut, an extra stir the other way, a different count: each changes how much of a property a material releases or when. That is a preparation verb acting on extraction (MR16), which today's engine lacks per ingredient (gap G1 in the axis sheet). So G1 is the gap that blocks enhanced recipes. | Raises G1's priority for N7. Done: one ingredient has two preparations with different yields |
| LAYX167 | ACCOUNT FOR NOW | **Canon gives the ranking as a result.** The annotated method beat the textbook followed exactly, in class, more than once. That is an order anchor (SPR8, SPR20) the Hogwarts property set has to reproduce: textbook-exact lands inside the region, the annotated route lands better. | Part of N7's canon boundary (MR35). Done: both routes run and rank correctly |
| LAYX168 | ACCOUNT FOR NOW | **Efficiency has several axes, so different makers want different routes.** Ingredient cost, time, yield per batch, risk of a bad failure, skill demanded, and apparatus needed. A poor student wants the cheap slow route; a shop wants yield; an expert takes the risky fast one. One "quality" number would hide this. | Design note in the axis sheet. Done: a product shows two routes that trade cost for risk |
| LAYX169 | ACCOUNT FOR NOW | **Each world sets how wide the region is, and canon supports the idea in all four.** Hogwarts: wide, with room above the textbook. The Gu world: several refinement recipes for one Gu with different costs and success rates are part of the setting, and better recipes are treasures. LOTM: narrow, since a wrong potion costs the drinker dearly, with latitude mostly in auxiliaries and in equivalent main ingredients of the same pathway. Mother of Learning: alchemy that improves with study. | Per-world line in each axis sheet. Done: each sheet states its width and what a miss costs |
| LAYX170 | ACCOUNT FOR NOW | **Deriving a route is the research loop.** If potions follow from what ingredients do, then learning an ingredient's properties is progress, and working out a new route is something to do at a bench. `invention_planner` and `craft_experiment_log` exist for this (LAYX65); knowledge of properties stays per observer (MR1, MR31). | Trace those two modules with LAYX71. Done: one derived route recorded as a learned method |
| LAYX171 | ACCOUNT FOR NOW | **A better method is worth money and trust.** A master's secret, a family recipe, a margin note in a second-hand book: each is knowledge with a holder (MR44). That gives ties a favor to grant (LAYX96), institutions something to guard, and shops a reason to differ. | Later slice. Done: one method learned from a person and not from a list |
| LAYX172 | ACCOUNT FOR NOW | **Substitution answers scarcity, within what canon fixes.** Many routes mean a missing ingredient is a problem to solve and not a wall. MR26 still holds: where canon makes an ingredient the scarce thing (a Beyonder main ingredient), no route goes around it, and the dial says so. | Applies to LOTM's sheet. Done: the sheet lists which ingredients have no substitute |
| LAYX173 | ACCOUNT FOR NOW | **One dominant route would undo all of this.** If a derived route is cheaper, faster and better on every axis, everyone uses it and the product has one recipe again. Each fit checks that no route wins on every axis, and that the best route for quality costs something. | Check in the fit (LAYX90). Done: the check runs on one product |

## Rules all the way down, and the same breadth for forging (2026-11-09)

Weibao: "Everything can be reasonably built around rules and more? Trying different steps can result in different results, or no result, other stuff and more? Same level of bredth for forging and more?" ([his words](../gm/USER_VISION_LOG_2026-11.md#rules-for-every-craft-and-forging-2026-11-09)). This is AD38 (things work by how they work) and MR6-MR8, MR16-MR17 applied across crafts; nothing here changes an accepted rule. Rows are agent proposals (AD32).

**The shape every craft shares.** Materials carry properties. Steps change state. A law reads the final state into what the thing does. Different steps give a different state and so a different result; a step the law does not read at that moment changes nothing that matters, and the maker gets a cue saying so. MR11 already names the modes (composition, formula, slots, budget, grade, conserved identity, pattern, assembly). What differs between crafts is what a step acts on.

| Family | Crafts | What a step changes | Why order matters | What "no result" looks like | Code today |
|---|---|---|---|---|---|
| Mixing | Potions, cooking, medicine, alloys | A blend of properties | Weakly: timing and heat windows | An inert or spoiled mix | `craft_resolver` (8 importers); deep only for two potions |
| Working | Forging, carving, tailoring, wand and tool making | One object's structure and shape | Strongly: each step acts on what the last left, and some cannot be undone | Hammering cold metal: nothing, or a crack | `alloy_equipment.js` (one authored alloy), `temperature_band.js`; `craft_process_thermal.js` has no importer |
| Patterning | Runes, enchanting, talismans, formations, spell design | An arrangement of symbols | Adjacency and sequence are the grammar | A pair the grammar does not name resolves to discord | `rune_grammar.js` (4 importers), already resolves unnamed pairs |
| Assembling | Devices, constructs, suits | Which parts connect, within budgets | Interfaces and load, not sequence | A part with nothing to drive it | `temporary_construct.js`; not traced |
| Growing | Gu refinement, breeding, grafting, herb beds | A living individual over time | Seasons, feeding and age | It lives and does not change | Window pack for Gu; care families unshared (LAYX71) |
| Performing | Rites, summoning, oaths | Conditions met for a party that answers | The answering party decides | Silence | Procedure layer and `ritual_conditions`, LOTM only |

| Code | Disposition | Consideration | Level, effort and done check |
|---|---|---|---|
| LAYX174 | ACCOUNT FOR NOW | **Six families, one shape.** A new craft declares its family and its world's properties before any recipe. The families differ in what a step acts on, so the engine needs both a blend resolver (exists) and a history resolver (LAYX175). | No work. Done: craft briefs name the family |
| LAYX175 | ACCOUNT FOR NOW | **Forging needs the step history, and the piece for it sits unwired.** A blade is the same steel with a different past: quench then temper is one sword, temper then quench is another. `craft_resolver` sums; `craft_process_thermal.js` models staged kinetics and nothing imports it. That module is the start of the working family. | Trace it (LAYX74), then decide. Done: its fitness for forging stated |
| LAYX176 | ACCOUNT FOR NOW | **Forging's property set, as a starting palette.** Hardness, toughness, flex, edge, weight, purity, and how well it carries the world's energy. Steps: alloy (a mixing sub-step), heat to a band, hammer or fold, quench in a medium, temper, anneal, grind, fit to a user. Routes that trade off: fine metal treated carelessly against plain metal treated well. | Palette only. Done: one world's sheet adopts or changes it |
| LAYX177 | ACCOUNT FOR NOW | **Real metallurgy is the richest borrowed source any craft has.** Books rarely give forging numbers; the real craft has them in abundance (which steps harden, which toughen, what overheating ruins). Under SPR13 it is borrowed from the real-world counterpart, labelled, and a world's magic adds to it. | Applies to LAYX176. Done: borrowed cells labelled |
| LAYX178 | ACCOUNT FOR NOW | **A worked object persists, which mixing products mostly do not.** A blade wears, is repaired, reforged and renamed; it has a history as a living thing does (MR41 by analogy) and a maker (MR30). Hogwarts canon has a made thing that takes in what strengthens it. So the working family needs wear and upkeep as readers, where potions need only use. | Design note. Done: one object's history changes its stats |
| LAYX179 | ACCOUNT FOR NOW | **"No result" has to teach.** MR16 says a verb with no stated effect is not offered; MR17 says timing counts only where the law reads it. Reconciled with "trying different steps can result in no result": a verb always changes declared state, and sometimes that state does not change the product. The cue says which (nothing happened; too early; wasted). Without the cue, experimenting is guessing. | Applies to every bench screen. Done: a no-effect step shows why |
| LAYX180 | ACCOUNT FOR NOW | **Rules alone make things that are all slightly different and none special.** MR2 keeps a third source of chance for this: rare authored reactions. Each craft keeps a small set of named works and odd reactions that no formula predicts, as overrides with a reason. | Applies per craft. Done: each sheet lists its authored exceptions |
| LAYX181 | ACCOUNT FOR NOW | **Breadth is cheap in rules and costly in readers.** A property with nothing that reads it is a number (SPR2, MR32). Forging is the best-supplied craft here because fights read weapons; cooking is the worst while hunger is off. Order crafts by how many readers they already have. | Ordering input. Done: the crafts table has a readers column |
| LAYX182 | ACCOUNT FOR NOW | **Forging has no lead-world caller yet.** The Village holds the smithing content and gets no new depth by direction; Tingen, Hogwarts and Qing Mao are not smithing stories. Its first caller would be a world where making gear is the life (a cultivation world's artifact refining, an original world). Until then it stays a palette. | Not scheduled. Done: recorded |
| LAYX183 | ACCOUNT FOR NOW | **Crafts feed each other.** An alloy is mixed then worked; a blade is worked then patterned; a talisman needs ink that was mixed; a Gu is grown then used in a rite. A product of one family is a material in another, carrying its properties across (MR14 for across worlds). | Design note with LAYX174. Done: one chain across two families runs |

### Research, the shared abstraction, and what this chat has not covered (same turn: "Research? Abstraction? Did we cover all our basis?")

| Code | Disposition | Consideration | Level, effort and done check |
|---|---|---|---|
| LAYX184 | ACCOUNT FOR NOW | **Research is the seventh family, and the one that makes the other six playable.** Its product is knowledge. Steps are experiments, reading, asking and watching; the state changed is what one observer knows (MR1, MR31); "no result" is an inconclusive test. If things follow from properties, then finding out a property is progress in every craft at once. Modules exist (`research_content`, `research_home`, `inquiry_study`, `invention_planner`, `craft_experiment_log`); their reach in lead worlds is untraced (LAYX65). | Trace with LAYX71. Done: which of the five a lead world calls |
| LAYX185 | ACCOUNT FOR NOW | **The abstraction is already an accepted rule; the code has four routes.** MR29 says one shared envelope with separate product logics. The area guide found four making routes. So the abstraction question is consolidation as slices touch them (the standing default), with the family table (LAYX174) as the target shape: properties, steps, a law, readers and a knowledge view per craft. | No new abstraction. Done: the next making slice lands on the envelope |
| LAYX186 | ACCOUNT FOR NOW | **Not covered: how any of this looks at a bench.** Properties, routes, cues and "why nothing happened" all need a screen a player can read. UI rules exist (UR41-UR43, UR71, UR74); this chat applied none of them. | First making slice. Done: a bench shows two routes and one cue |
| LAYX187 | ACCOUNT FOR NOW | **Not covered: non-player makers.** MR23 says every maker uses the same rules. Then a shop's stock, a rival's potion and a master's work come from the same properties, and prices follow cost of route. Nothing here checked whether any non-player makes anything. | Later. Done: one shop item made by the resolver |
| LAYX188 | ACCOUNT FOR NOW | **Not covered: fights got less than making.** This chat gave fights anchors, areas and a summary tool, and no equivalent of the property-and-route treatment. What decides a fight (preparation, information, a tool, an ally, SPR14) deserves the same pass. | A round of its own if asked. Done: recorded |
| LAYX189 | ACCOUNT FOR NOW | **Not covered: cost.** Step histories, properties per material and remembered reasons per pair of people all grow saves and compute. No estimate was made. | With the first slice that adds one. Done: save growth measured once |
| LAYX190 | ACT NOW (for Weibao to decide) | **The base most at risk is building.** This chat has produced about 190 atlas rows and 30 proposed rules; none of the rules is accepted by name and nothing has been built or played. SPR5 was written for this case. Recommendation: stop the rounds and take one slice that tests several threads at once, an ordinary first-year's day at Hogwarts with a potion made two ways (the textbook route and a better one). | Weibao's call. Done: a slice is chosen or the rounds continue by his choice |

## Farming, and long-term systems already in the code (2026-11-09)

Weibao: "Farming? Other stuff?" ([log](../gm/USER_VISION_LOG_2026-11.md#farming-and-other-long-term-systems-2026-11-09)). Extends LAYX109 and LAYX124. Rows are agent proposals (AD32). "Exists" is from module headers and importer counts read today, not walked in play.

**Correction to LAYX97 and LAYX103.** `craft_sources.js` (6 importers) already does more than those rows said: location sources (herb patches, ore seams, fishing spots, salvage heaps) with regional variants, yield rolls keyed on game time, tool, skill, hour and season gates, depletion and regrowth, rare finds, an odds forecast and bounded idle gathering. The gathering half of "areas to farm" is built. What is missing is the owned, tended half.

| Code | Disposition | Consideration | Level, effort and done check |
|---|---|---|---|
| LAYX191 | ACCOUNT FOR NOW | **A farm plot is a source you own and tend.** Take a `craft_sources` node, add an owner, and let care change its regrowth and quality. Then farming, herb beds, a fish pond and a herd are one shape with gathering, and the growing family (LAYX174) has its first shared seam. Default: extend the source module before writing a farming module. | Design note, then a slice. Done: one tended plot and one wild patch on the same module |
| LAYX192 | ACCOUNT FOR NOW | **Farming by rules, same as potions.** A plant has needs (water, light, soil, season, company) and gives a yield with quality. Soil is a material with properties, so compost and feed are mixing. Steps are sow, water, weed, prune, graft and when to harvest. Routes trade labour for yield (MR42): a neglected bed still gives something. | Palette. Done: one plant with two care routes |
| LAYX193 | ACCOUNT FOR NOW | **Breeding is the long loop.** Selecting for a trait over generations is progress that takes seasons. `lineage_traits.js`, `lineage_domain.js` and `material_lineage_domain.js` exist; whether they cover plants or animals is untraced. | Trace with LAYX71. Done: what the lineage modules own |
| LAYX194 | ACCOUNT FOR NOW | **The book worlds give farming real callers.** Hogwarts has the greenhouses and a plant whose growing-up is tracked across a school year (book 2). The Gu world has feed: a keeper who grows or buys what a Gu eats has a reason to own a plot, and the keeper code already predicts starvation (`living_upkeep.js`). LOTM has none. From the agent's memory of the books; check against rows before use. | Shapes where LAYX191's slice lands. Done: the slice names its world and its canon anchor |
| LAYX195 | ACCOUNT FOR NOW | **Weather and seasons already exist as modules** (`weather.js`, `weather_calendar.js`, `world_calendar`). Farming is their first strong reader: a dry month, a frost, a tide of pests. Bad seasons are events with a wake (LAYX128), which gives the storyteller (LAYX143) something to pace. | Part of LAYX191. Done: one weather fact changes one yield |
| LAYX196 | ACCOUNT FOR NOW | **Time away has to be settled first** (LAYX110). `habitat_care.js` projects time lazily so reloading never grants stock; that is a working answer for one pen and the candidate default for all plots. | Decide at LAYX191. Done: the rule is stated once for all timers |

**Other long-term systems that already have code.** Found by module name today; none traced in this chat. A palette for later rounds, not a plan.

| Code | System | Modules seen | Question it raises |
|---|---|---|---|
| LAYX197 | Family, heirs and inheritance | `family_tree`, `village_family`, `heir_inheritance`, `home_inheritance`, `lineage_*` | Playing on as an heir is the Crusader Kings long game. Does any lead world use it, and does it meet the tie record or sit beside it (the area guide's third person store)? |
| LAYX198 | Aging | `aging_contact*` | With seasons, breeding and heirs, age is what makes long loops cost something |
| LAYX199 | Schooling, teaching and apprentices | `home_school*`, `teacher_window`, `material_apprentice`, `book_world_hp_school_calendar` | A method can be taught (MR44). Is there one teaching seam or several? |
| LAYX200 | Careers and work | `village_career*`, LOTM shifts in story windows | The ordinary day (SPR1) is mostly work. One career shape across worlds is the skipped-days loop (LAYX149) |
| LAYX201 | Law and cases | `law_case` | Standing has five owners; where does a crime or a contract land? |
| LAYX202 | Workshops and storage | `*_workshop_*` (several), `storage_*`, `workshop_placement` | Several workshop families: are they the bench for all six craft families or one each? |
| LAYX203 | Not seen in code by name | Health and illness, faith and churches, trade routes and caravans, running a business | Faith is central to LOTM (churches grant standing, work and protection); caravans are in the Gu world's story windows |

## What to defer, what is most pressing, and what has nothing yet (2026-11-09)

Weibao: "Aging and heir and family could porobably be delayed, other stuff and more? What is most imperative? More to consider/ Stuff that doesnt have anything yet?" ([log](../gm/USER_VISION_LOG_2026-11.md#deferral-and-priorities-2026-11-09)). The deferral is his; the ordering below is an agent proposal (AD32).

**Deferred by Weibao ("could probably be delayed"):** aging, heirs and family (LAYX197, LAYX198). Their code stays; no new depth and no slice until he raises them.

**Correction to LAYX203.** "Not seen in code by name" was wrong as a reading of the code. A keyword count today (file counts in `src/`, which show a word appears and not that a system works): illness and infection 27 files (`affliction_catalogue`, `affliction_track`), wounds 89, church and prayer 41 (LOTM files), caravans 9 (Gu world), bounty or commission 67, offline or catch-up 32. Almost nothing discussed in this chat has no code at all. The codebase is wide. What it lacks is callers in an ordinary day and a map of what each family does.

| Code | Disposition | Consideration | Level, effort and done check |
|---|---|---|---|
| LAYX204 | ACT NOW (Weibao's call) | **Most pressing: one ordinary day in one book world.** Every engine here waits for a caller that repeats. A first-year's school day at Hogwarts (Book 1 is closed) with a potion made two ways tests the day loop, many routes (MR42, MR43) and the bystander view together. | Sonnet lanes with a brief; runtime; medium. Done: played twice in the browser at 1920x1080 from a fresh origin |
| LAYX205 | LATER (cheap, can run beside LAYX204) | **Second: a census of what the module families do.** Today's name searches kept finding built things the chat did not know about (gathering sources, afflictions, bounties, lineage, workshops). The area guide covers 18 areas; the families outside it are unmapped. One pass per family: what it owns, who calls it, whether a lead world reaches it. | Haiku readers, docs only, extends the area guide. Done: care, person and memory, research, workshops, afflictions, bounties and commissions, offline handling each have an entry |
| LAYX206 | ACCOUNT FOR NOW | **Third: the time-away rule** (LAYX110, LAYX196). It blocks farming, plots and long routines, and 32 files already mention offline or catch-up, so there may be several answers in the code already. | Part of LAYX205's census, then one stated rule. Done: one rule, with the modules that follow it |
| LAYX207 | ACCOUNT FOR NOW | **Fourth: preparation per ingredient in the making engine** (axis-sheet gap G1, LAYX166). Without it there are no enhanced recipes, and many routes collapse to one. | Inside LAYX204 if the potion needs it. Done: one ingredient, two preparations, different yields |
| LAYX208 | ACCOUNT FOR NOW | **Fifth: one tie reader that is not an unlocked line** (LAYX96, the favor). Small, and it makes regard matter in the ordinary day. | After LAYX204. Done: one person's terms change with regard |
| LAYX209 | ACCOUNT FOR NOW | **What has nothing yet, as far as this chat's traces go.** A repeatable fight caller for the lead worlds (LAYX105); a fight that can be summarized (LAYX122); rolled everyday interactions between people (LAYX146); the lead played from the recorded choices (LAYX129); canon events reaching another seat as a calendar (LAYX128); a fit that takes results (LAYX90). Each is a connection between things that exist. | Ordering input. Done: recorded |
| LAYX210 | ACCOUNT FOR NOW | **Also undecided: the 30 proposed rules.** SPR1-SPR22 and MR37-MR44 are prompts until accepted by name. Three of them now quote his direction (SPR20, MR38, MR42-MR43). Accepting or rejecting them is quicker than another round and tells every later brief what holds. | Weibao's call. Done: each rule marked standing, rejected or left as a prompt |

## Give the lore run the freedom first (2026-11-09)

Weibao: "Would it be easier to start from giving the lore run the same freedom first, so like the opition to diverge and ore? nd then we can extend that freedom to non lore runs?" ([log](../gm/USER_VISION_LOG_2026-11.md#freedom-for-the-lore-run-first-2026-11-09)). The agent's answer is yes, and it revises LAYX204 and the "play as a bystander next" advice given earlier the same day. Rows are agent proposals (AD32).

**What exists.** The lead-life rules already cover this ground: results follow the book's chain while the state matches, a state that no longer matches is logged as divergence, and worlds differ in how canon resists change (causal mass, plus a world mechanism where a world names one). A keyword search found no divergence handling in the two lead domains (`book_world_lotm_domain.js`, `book_world_hp_lead_domain.js`); not walked, so how much choice the windows give today is unverified.

| Code | Disposition | Consideration | Level, effort and done check |
|---|---|---|---|
| LAYX211 | ACCOUNT FOR NOW | **Yes: the lead is the cheapest seat to free.** The lead has state, panels, a cast with ties and saved waypoints (AD54). Another seat needs a start, an identity, a kit and its own knowledge before its first minute (WER). Freedom for the lead costs only the free actions themselves. | Replaces "bystander first" in LAYX204. Done: the first slice is the lead's free day |
| LAYX212 | ACCOUNT FOR NOW | **The lead's free actions are the repeatable loops.** Skip the lesson and go to the library, brew something else at the bench, take an odd job, visit someone. Built once for the lead, they are what any other seat does all day. So this order builds the missing ordinary-day callers (SPR1) directly. | Design consequence. Done: each free action names the non-lead seat that can also run it |
| LAYX213 | ACCOUNT FOR NOW | **Three levels of freedom, cheapest first.** (1) Free in the gaps: the days the book skips have no canon to break (LAYX149). (2) Free inside a scene in ways that keep its result: variance of detail, which the lead-life rules already allow. (3) Free to break a result: the divergence is recorded and what depended on it changes. Level 1 needs no divergence machinery at all. | Order of work. Done: level 1 played before level 3 is designed |
| LAYX214 | ACCOUNT FOR NOW | **A lead who has diverged is the first non-lead seat.** Once Harry stops following the book, later scenes that depended on him fall away and he lives on the generic loops and the world's calendar, which is exactly a bystander's life. So extending freedom to other seats is the same thing with a different starting state and no canon pull. | Framing for LAYX130. Done: a diverged save and a bystander start are compared once |
| LAYX215 | ACCOUNT FOR NOW | **Diverging makes the world thinner, and that should be said.** Authored scenes are the rich part. Past a real divergence the game has what the loops and the calendar provide. Default: tell the player in-world that things are no longer as they would have been (a hunch, a missed appointment), and keep the canon choice available at each scene so the lore run stays replayable. In play the canon choice is not labelled; the developer view labels it. | Part of level 3. Done: one divergence shows its consequence and the canon path still replays |
| LAYX216 | ACCOUNT FOR NOW | **The lead's privileges make this flattering.** Harry's fame, Klein's secret resources and Fang Yuan's foreknowledge make any loop easier and more interesting than it is for a clerk. A loop that only works with them is a lead scene in disguise. Keep the seat check (LAYX152): after the lead's free day, the same day once without the privileges. | One short walk per slice. Done: the walk names what was missing |
| LAYX217 | ACCOUNT FOR NOW | **What happens to canon when the lead leaves it** (LAYX132) becomes urgent at level 3 and not before. The rules give the default (causal mass, nearest plausible fill, recorded divergence); no code was found. Level 1 and 2 can ship without it. | Design note before level 3. Done: one worked example in the lead-life systems design |
| LAYX218 | ACT NOW (Weibao's call) | **Revised first slice.** Harry's free day between two Book 1 scenes: the timetable as the default day, three or four free actions (a lesson attended or skipped, the library, the potion bench with two routes, a visit), then the same day once as an ordinary first-year. Tingen gets the same treatment at its skipped days when Klein's volume closes. | Sonnet lanes with a brief; runtime; medium. Done: played twice at 1920x1080 from a fresh origin |

## Reconciliation of LAYX81-LAYX218 (2026-11-09)

Weibao: "save acc0rd9gjgly long term" with the more-to-consider and reconcile-project skills. This section is the entry point for everything the 2026-11-09 chat added after LAYX80. It maps 138 rows into six bins, marks what was corrected or replaced, restates the next order and adds one more round. It accepts nothing: a row's bin says what kind of thing it is, and only the first bin is Weibao's word. Source: this file at the working tree of 2026-11-09 (HEAD `05d446148` plus uncommitted appends); no code was run for this pass beyond the named searches.

### Bin 1: direction Weibao gave, and where it now lives

Each line traces to his words in the [direction log](../gm/USER_VISION_LOG_2026-11.md). The owner holds the wording; rows here only point.

| What he said (short) | Owner updated | Rows that build on it (proposals) |
|---|---|---|
| Sealing gates play, not development; he has read all of LOTM | AGENTS.md "Sealed secrets", the secrets doc | LAYX81, LAYX82 |
| Non-numeric anchors count where reasonable | SPR8 note in the system practice rules | LAYX84, LAYX85 |
| The axis sheet may name every LOTM ladder; the bench may show unlearned rungs | Axis sheet section 2.7 | LAYX83, LAYX94 |
| "Build numbers based off of results" | Quoted in SPR20 (rule still proposed) | SPR20-SPR22, LAYX90-LAYX93 |
| Potions and spells share effects, "but there can still be distinctions" | Quoted in MR38 (proposed) | none further |
| Values may come from other sources (later books, lore books, games, analyses) | Quoted in SPR13 (proposed) | LAYX159-LAYX164 |
| Many ways to make the same thing, with quality and efficiency, in every world, derived from what ingredients do | USER_VISION "Making and crafting" | MR42-MR44, LAYX165-LAYX173 |
| Caves of Qud, RimWorld and Shadow of Mordor are core inspirations | USER_VISION, VISION_DIGEST | LAYX144, LAYX146, LAYX147, LAYX158 |
| Aging, heirs and family "could probably be delayed" | This atlas (LAYX197, LAYX198 deferred) | none |
| Keep areas simple (asked as a question, read as a preference) | This atlas | LAYX103-LAYX108 |
| Freedom for the lore run first, then other seats (asked as a question; the agent agreed) | This atlas | LAYX211-LAYX218 |
| The lore run versus the game as a distinction | Direction log; consistent with the digest's "developer build-through, not the default player start" | LAYX126-LAYX132 |

The last three were phrased as questions. They are recorded as his leaning and not as decisions.

### Bin 2: rules awaiting his word

SPR1-SPR22 ([rulebook](../SYSTEM_PRACTICE_RULES.md)) and MR37-MR44 ([making rules](../MAKING_RULES.md#proposed-additions-2026-11-09-ad32)). Thirty lines, all prompts for briefs until accepted by name. Offered as three bundles so the decision is short (LAYX219).

### Bin 3: done in this chat (docs and local scripts only)

| Row | What was done | State reached |
|---|---|---|
| N5 (LAYX34, LAYX50) | Anchor ledger for LOTM volume 1 and Harry's book one; world potion axes sheet | Committed `b038f1bb7`; script output, samples hand-judged by the reader |
| LAYX83 (first step) | All 23 brewable LOTM rows listed in the axis sheet | Committed `05d446148`; generated table, nothing fitted |
| LAYX88 | Ledger over LOTM 2-8, Harry Potter 2-7, Reverend Insanity 1-7 (about 50,000 rows) | Uncommitted at the time of this pass; script rerun once by the controller with matching totals |
| LAYX155-LAYX158 | Sent to the session building the lead arcs as proposals | Delivered; no reply seen; that session's record not edited |
| Area guide, SPR, MR additions | Written and routed | Committed; names verified by script, no behaviour run |

### Bin 4: corrections and replaced rows

| Earlier row | Now read as | Why |
|---|---|---|
| LAYX44 "no numeric anchor" for Hogwarts potions | True of book one only; books 2-7 have 45 potion anchors (LAYX159) | Ledger over later books |
| LAYX86 "which other sources are open" | Replaced by LAYX87: a source needs a ledger, not permission | Sealing direction |
| LAYX97-LAYX99 (rich source model, responding population) | Default is the simple area (LAYX103, LAYX104); the population is an option (LAYX108) | His leaning to simple |
| LAYX97, LAYX103 "nothing joins gathering and areas" | `craft_sources.js` already does gathering with depletion, regrowth and idle bounds (LAYX191 preface) | Module header read |
| LAYX133-LAYX143 presented as new ideas | Already researched and partly built (table under "Were they considered before?") | Repo search |
| LAYX203 "not seen in code" | Wrong; keyword counts show files for each (LAYX209 preface) | Keyword search |
| LAYX204 "an ordinary first-year's day" as the first slice | Replaced by LAYX218: the lead's free day first, then the same day without privileges | His order |
| N7 (Harry's bench as a "made for someone" slice) | Folded into N9 below | Same world, same bench |
| The axis sheet's line that naming an out-of-scope rung breaks sealing | Withdrawn in the sheet | Sealing direction |

### Bin 5: palettes for later (no order implied)

Simple areas and the four models (LAYX103-LAYX125); lore-run method (LAYX126-LAYX132, LAYX145-LAYX153); other games (LAYX133-LAYX143); outside value sources (LAYX159-LAYX164); routes and methods (LAYX165-LAYX173); craft families, forging and research (LAYX174-LAYX189); farming (LAYX191-LAYX196); long-term systems with code (LAYX199-LAYX203); time away, storage, sinks, defeat, bounties, carry between worlds (LAYX109-LAYX118).

### Bin 6: deferred by Weibao

Aging, heirs and family (LAYX197, LAYX198, and LAYX193 where it concerns people).

### Next order, restated (proposals; replaces N6-N8 as the working list, which stay above as history)

| ID | Next | Why | Needs |
|---|---|---|---|
| N9 | The lead's free day at Hogwarts (LAYX218): the timetable as the default day, three or four free actions including the potion bench with two routes, then the same day once without Harry's privileges | Tests the ordinary-day loop, many routes and the seat check together, in a world whose first book is closed | Weibao's go; agreement with the session that has uncommitted edits in Harry's files; one writer |
| N10 | Census of the module families outside the area guide (LAYX205), including every answer to time away (LAYX206) | Name searches kept finding built systems this chat did not know; cheap, docs only, can run beside N9 | Weibao's go; haiku readers |
| N11 | Decide the thirty proposed rules in three bundles (LAYX219) | Tells every later brief what holds | Weibao, a few minutes |
| N12 | Fight cases as results with locators (N6, LAYX91), then a fit that takes results (LAYX90) | Turns "numbers from results" into a tool | After N11's bundle A |
| N13 | Tingen's skipped days and a week with one person (N8, LAYX149, LAYX96) when Klein's volume closes | The same free-day treatment in the first lead world | The arc session reaching chapter 213 |

### One more round (more to consider)

| Code | Disposition | Consideration | Level, effort and done check |
|---|---|---|---|
| LAYX219 | ACT NOW (Weibao's call) | **Three bundles make the rules a short decision.** A: lines that quote his own direction (SPR8, SPR13's source ranks, SPR20, MR38, MR42, MR43). B: practice prompts for briefs (SPR1-SPR7, SPR9-SPR12, SPR14, SPR21, SPR22). C: design lines for ties and making (SPR15-SPR19, MR37, MR39-MR41, MR44). He can accept A alone and leave B and C as prompts. | His word. Done: each bundle marked standing, rejected or prompt |
| LAYX220 | ACCOUNT FOR NOW | **N9 touches files another session is editing.** `book_world_hp_lead_domain.js`, `_pack.js`, `_ui.js` and `book_world_hp_facts.js` are modified and four new Harry files are untracked in the shared checkout. A free-day slice written now would collide. One writer per file area: the arc session lands or parks first, or takes N9 itself. | Before any N9 lane. Done: ownership written in the task record |
| LAYX221 | ACCOUNT FOR NOW | **The school calendar exists and is the free day's spine.** `book_world_hp_school_calendar.js` maps the lead clock to the school year as pure data. N9's brief starts by reading it and `tests/hp_school_progression.test.js`, and adds a timetable row only if one is missing. No Hogwarts scenario was found by name in `scripts/headless/scenarios.mjs` (searched, not exhaustive), so N9 may need to save its own waypoint (AD54). | Brief input. Done: the brief names the calendar seam and the scenario it boots |
| LAYX222 | ACCOUNT FOR NOW | **Free actions change state shape, and saved waypoints go stale.** Old saves are disposable by standing preference, but AD54 scenarios are assets. A slice that adds state regenerates the scenarios it invalidates, or says which are stale. | Part of N9's receipt. Done: scenarios listed as kept, rebuilt or stale |
| LAYX223 | ACCOUNT FOR NOW | **A developer view makes all of this checkable.** Which choice is the canon one, which route landed where in a product's region, why a step did nothing, which numbers are derived and from what. Players see none of it; without it an agent cannot verify a route ranking or a divergence. Default: an inspector panel behind the existing developer or cheat surface, read-only. | Small addition to N9. Done: the bench's two routes are visible side by side in the inspector |
| LAYX224 | ACCOUNT FOR NOW | **Claims from memory are marked, and need a check before a brief uses them.** Other games' mechanics (LAYX119-LAYX125, LAYX133-LAYX143), what canon says about recipes in the Gu world and LOTM (LAYX169), Hogwarts greenhouse and feed-crop anchors (LAYX194). The reading rows or a short search settle each. | Per brief. Done: a brief cites a row or a source for any such claim it relies on |
| LAYX225 | ACCOUNT FOR NOW | **The arc session got its adjustments before the "lead freedom first" idea.** What it was sent (play the skipped days, LAYX156) is level 1 of that idea, so nothing conflicts. It has not been told the framing, or that N9 may want Harry's files. | One follow-up message when N9 is authorized. Done: sent or dropped |
| LAYX226 | ACCOUNT FOR NOW | **This file is past 1,300 lines and holds 226 LAYX rows.** A new chat should read this section and the next-order table, and search the rest by code. If the chat's rows keep growing, the next step is a separate file per topic with this atlas as the index, done as one move with redirects so codes keep resolving. | Not now. Done: entry-point line at the top of the atlas (added with this pass) |
| LAYX227 | LATER | **Writeups from this chat are registered.** The area guide, the two ledgers, the axis sheet and the practice rulebook get one row in the writeup register, state New, with the open decisions (N9-N11). | Done with this pass |

### Residue not mapped

Rows LAYX81-LAYX218 not named in a bin above are considerations attached to a named neighbour (for example LAYX89 to LAYX88, LAYX92-LAYX93 to LAYX90) and keep their own done checks. Nothing in LAYX1-LAYX80 was re-read for this pass.
