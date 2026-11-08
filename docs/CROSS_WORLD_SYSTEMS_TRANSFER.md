# Cross-world systems transfer pattern

**Status: proposal (AD32), written 2026-11-07.** Weibao asked for a separate chat to "broadly address" the finding of the [long-term atlas](audits/PROGRESS_ATLAS_2026-11-07_LONG_TERM.md#deep-systems-by-world-2026-11-07-follow-up): the deep systems run in the native Village and the Frontier test beds, while Klein and Harry hand-build their own versions or have none. Nothing here is accepted. Applied: AD5, AD38, AD45, AD46, AD51 (abstract the reasonable, keep differences local), AR11 and AR17 (proposed), MR reuse direction, CX2, FND5. Standing direction kept: LOTM first, Harry alongside, depth to book worlds, no new depth for Frontier or Mistglass. Delivery record: [task checkpoint](gm/dispatch/cross-world-systems-2026-11-07/CHECKPOINT.md).

## The pattern in one paragraph

Every deep system has **one engine** and **one world port**. The engine owns verbs, conservation, saving and the shape of results. The world owns its laws, costs, palettes, numbers and content, and hands them to the port as data. A world never reaches into an engine's internals, and an engine never names a world (AR17 proposed). A world's **systems sheet** declares, per system, whether its data is authored, palette or missing, and which port and data file hold it. The sheet is a declaration and a coverage printout. It does not compile anything, and every row carries a default, a dial and an in-world reason. A system "transfers" to a world when that world's data runs through the same port as the Village's, reached by a player in that world (AR10). A second, different world is the proof (AR11, LT3).

## Options weighed

| Code | Option | What it buys | Why not alone |
|---|---|---|---|
| O1 | **Per-system ports only** (today's shape: `defineCastMaking`, the spell adapters, `registerPeopleSource`) | Exists; each port is small and tested | Nothing says what a world has, so a missing piece looks like the world lacks it (FD14's complaint), and lanes build beside the port |
| O2 | **One world sheet compiled into every engine** | One file per world; bring-up is filling a form | A mega-schema couples eleven systems; one bad field blocks a world; the compiler becomes the new hand-built layer |
| O3 | **Laws, not systems** (unusual): a world declares a few physical and social laws (what is conserved, what is exchanged, how regard decays, what powers draw on) and each system derives its rules from them | The deepest reuse, and genuinely "things work by how they work" (AD38) | Canon is specific (LOTM's exact formula, Hogwarts' house points); derived behaviour fights stated numbers (AD49) and is hard to debug |
| O4 | **Borrow the Village by reference** with a rename table | Cheapest bring-up | AD46: no world is the template; book laws differ, and a renamed Village is not Tingen |

**Converged (proposal):** O1 plus a thin declaration. Ports stay per system, and the systems sheet lists them per world. O3 survives inside each port as that port's law rows: a craft law, tie kinds, cost sources. Each world writes laws only for the systems it uses. O2's form-filling survives as the sheet's palette rows, which bring a missing system up with a labelled default. Rejected: O4, because AD46 forbids it. O2 as a compiler, because its coupling cost arrives before its payoff.

## Per system: engine, world port, world data

Columns: the shared engine (one), the port a world uses, what a world supplies as data (default, dial, reason), and the state in Klein's and Harry's lives at `a152827dd` plus this task. "Hand-built" means world code that duplicates the engine's job.

| System | Engine (one) | World port | World data: default, dial, reason | Klein (LOTM) | Harry (HP) |
|---|---|---|---|---|---|
| Procedural crafting | `craft_materials`, `craft_resolver`, `craft_recipes`, `craft_state` | `defineCastMaking` (`cast_making_adapter.js`) | A catalogue (axes, materials), a law (ops, reactions, outputs, directions, thermal) and recipe rows. Default: only items a window makes. Dial: authored materials versus seeded families. Reason: outcomes follow ingredients by the world's own chemistry (MR6) | **Neil's Seer brew resolved by the engine** (W2a, `lotm_seer_brew.js`): the drink needs the engine's batch; document rows stay timed acts | Hand-built Polyjuice state machine (`hp_brewing_state`); Potions class is a chance roll |
| Mixtures and discovery | `mixture_*`, `craft_experiment_log`, `craft_failure_ledger` | Same port; the experiment log records trials | Which axes are hidden, what a failure leaves. Default: failure leaves residue and a reason. Dial: how much a trial teaches. Reason: both books show learning from a wrong brew | None | Polyjuice reuses the trial log only |
| Materials and lineage | `material_lineage` (+ `_domain`) | Lineage rows on inventory keys | Where an item came from and how it was treated. Default: only items whose origin changes an outcome (LT9). Dial: lineage depth. Reason: provenance is a canon fact in both books (Beyonder characteristics, wand cores) | None | Polyjuice lots carry provenance by hand |
| Gear and runes | `gear_*`, `alloy_equipment`, `rune_grammar` | Gear content rows and dimensions | Slots, materials, enchantment grammar. Default: the world's own gear words (amulets, wands). Dial: affix depth. Reason: tools differ by world but wear, repair and quality do not | None (amulet craft is open item R8 in KJ3AE) | None (one wand fact) |
| Economy and trade | `economy_domain`/`money.js`, `own_holdings`, `owed_ledger_sources`, `trade.js`, `shop_*` | Purse holders and named sources; owed-ledger rows; shop rows | Currency ladder, price bands, holders. Default: one authority per currency (ECX6). Dial: price bands per district. Reason: canon prices are fixed points (AD49) | Purse seam, duties, rent; its own shop rows | Purse seam, vault, the ladder as display |
| Relationships and standing | `simulation.relationships` edge, `person_memory`, **`person_ties`** (this task) | `registerWorldTies` (people, kinds, offers) | Tie kinds a world shows, who holds them, what a tie opens. Default: five kinds, and regard opens disclosure. Dial: thresholds and kinds per world. Reason: the lead lives narrate trust and friendship; a gate must read real state | **Dunn's trust from weekly filings** (LT8) | **Ron's affection from the Sorting and first Charms** (LT8) |
| Companions | `companion_roster` (`companion_bonds` slice) | None yet; next step: a companion row binds a tied person | Who can travel with the lead, and the bond rites. Default: a companion is a tied person (LT8) who agreed to come along. Dial: party size. Reason: Klein's teammates and Harry's friends act beside him in canon | None | None |
| Homes and households | `home_*` (34 files), `home_household`, `home_building_model` | `worldHomeModel` (W2c): residents, dues and stores as data, the shared model shape back | Who lives there, rent owed, what is stored. Default: read side first (LT10). Dial: furnishing and staff later. Reason: both leads have a home that is scene text today | **Flat through the port** (W1d, W2c): residents, rent line, stores | **Guardians' house through the port** (W2c) |
| Heirs and genetics | `lineage_domain`, `lineage_traits`, `heir_inheritance`, `home_inheritance` | Lineage rows; inheritance policy | Inheritance law, trait carriers. Default: none in a lead life until a window needs it. Dial: per-world inheritance law. Reason: neither book's first volume uses it | None | None |
| Gathering and seasons | `harvest.js`, `gathering_*`, `world_rhythm`/`world_calendar` | Gathering rows on the world calendar | What grows where and when. Default: the world calendar drives seasons. Dial: yield bands. Reason: ingredients (Polyjuice lacewings by moon, LOTM herbs) are seasonal in canon | Calendar only | Moon phase inside Polyjuice |
| Research and study | `inquiry`, `inquiry_study`, `research_*` | Inquiry topics | Topics, minutes, what finishing teaches. Default: study is time plus lessons attended. Dial: per-topic minutes. Reason: Hogwarts and the Tingen library both reward reading | Records offers (KJ3AD) | Library study via `book_world_hp_inquiry` |

Two more rows run across systems:

| Layer | Engine (one) | World port | World data | Note |
|---|---|---|---|---|
| Powers (LT2) | `ability_records` + `spell_seam` (`defineSpells`, `settleSpellCast`) | `defineSpellAdapter` per world (`spell_adapter_lotm`, `spell_adapter_hp`) | Cost source (spirituality, stamina, an item), formula (incantation and wand, or a ritual), failure dial, strain. Default: one row per ability, naming an FD18 channel. Reason: powers are what make worlds mechanically distinct | `effect_dsl` stays the inert SRD vocabulary (ABR4). It is not the executor |
| Society (FD14) | the society sheet (`world_society_sheet.js`) | sheet rows | money, calendar, institutions, positions, law, information, address | Exists for Tingen and Hogwarts; the systems sheet extends it |

## The ten idle seams (LT4), proposed fate

| Seam | Fate (proposal) | First consumer |
|---|---|---|
| `law_case` | Adopt | LOTM heat and fines (Tingen police already has a heat slice) |
| `faction_rank` | Adopt | Harry's house standing beside house points (LARGER F6) |
| `life_events` | Fold into FD16 events | The event director's first book-world consumer |
| `research_*` | Fold into `inquiry` | HP library study already runs on inquiry |
| `ability_ladders` | Keep as UI grouping only | The power grammar's display |
| `effect_dsl` | Keep inert (ABR4) | D&D Phandalin at LT5 bring-up, as a source vocabulary |
| `conflict_frame` | Adopt | LOTM B8 fight (AT15) through the frame |
| `check_contract` | Adopt | The spell seam's failure draw (HP's 60% fizzle dial) |
| `home_building_model` | Wait | LT10 read side first |
| `tempo_fight` | Adopt via `conflict_frame` | Same as above |

## Bring-up recipe for a new world (LT5)

1. Write the society sheet and systems sheet rows: every row authored, palette or missing.
2. For each system the world's first day uses, write its data for that port. Write no new engine code. A port that cannot express the world's law gets a port change, recorded as one (AR11).
3. Declare tie people and offers, cost sources and spell rows, a catalogue and law if anything is made.
4. Measure the new files and lines that are not data. That number is the LT5 result.

## LT8 ties

`src/person_ties.js` (proposal). Truth is the existing relationship edge with an axis `tie.<kind>`, saved inside the expansion state, so it adds no new slice. Every change also writes a player observation attributed to the person, and views show only that observation (AD6-AD8). Rule facts `tie.<alias>.<kind>` let any gate read the holder's regard. An **offer** row is the first consumer shape: regard opens disclosure. Hosts render offers their own way: Klein's Work & merit panel draws a button, and Harry's lead life gets a native command shown under Friends.

- Klein: each week's expense application handed to Dunn raises his trust by one, once per week. At two, "Ask Captain Dunn how the funding request works" opens. Default: two weeks. Dial: the threshold. Reason: the book shows Dunn answering Klein's routine questions.
- Harry: the Sorting and the first Charms lesson each raise Ron's affection. At two, "Sit with Ron in the common room" opens. Default: two shared moments. Dial: the threshold. Reason: the friendship grows from shared school days.
- Gates read the raw regard. `tie.<alias>.<kind>` is the axis baseline, while the older `relationship.<axis>` facts read the same edge through `derivedBond` decay. A gate uses one of the two, never both. Default: raw, so a threshold means a count of shared acts. Dial: a world can switch its ties to decayed regard. Reason: decay belongs to person memory, and that rule is not yet stated for these leads.
- Save slice: none new. The axis and notes live in the expansion state. Old saves load unchanged, because a missing axis reads as 0. Ron is a new person in the HP lead definition, so a save from before this change that holds the HP lead life has one more definition row. That is accepted under "old saves may break" (Weibao, 2026-11-07).
