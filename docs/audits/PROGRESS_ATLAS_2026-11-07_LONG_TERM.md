# Foundations for long-term world implementation, 2026-11-07

Weibao, 2026-11-07: "what about foundational stuff? How to address long term world implementations and more?" Follow-up to the [2026-11-07 atlas refresh](PROGRESS_ATLAS_2026-11-04.md#refresh-2026-11-07-master-a152827dd-clean-pushed). Proposals (AD32); nothing accepted or dispatched. Evidence: `node scripts/seam_register.mjs` plus a static-import grep for the Nov 6-7 seams at `a152827dd`, by file-name family. Code reach only, not route proof. Visual: [seams by world](../../prototypes/progress-atlas/2026-11-07-seams-by-world.html). Builds on [LARGER_FOUNDATIONS](LARGER_FOUNDATIONS_2026-11-06.md) FD14-FD18 and the [enablement plan](../reviews/FOUNDATION_WORLD_ENABLEMENT_PLAN_2026-11-04.md) E1-E10.

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
