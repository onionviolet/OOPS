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
| Built (wave 3, committed d9d8d21be) | XC2 reputation view, XC3 house purchase terms, XC4 ties visible from meeting, XC7 procedure layer, XC8 shared traits vocabulary; XC1 and XC6 in part (Seer brew, Potions bench) | Polyjuice and the Sequence-5 rite are later content on the same layer |
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
