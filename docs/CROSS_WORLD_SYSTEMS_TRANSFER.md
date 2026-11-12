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

## The comprehensive check (2026-11-08)

Weibao asked whether each system was made "comprehensive and modular and extendable/procedural", and named homes (expansion, improvement, furniture) and powers. Every port answers three questions: (1) does it reach the whole engine, not a display shape; (2) can a world add content procedurally (palettes, seeded families) as well as authored rows; (3) can a third world plug in by data only (LT5). The wave-3 engine-completion work updates these answers; the [task record](gm/dispatch/cross-world-systems-2026-11-07/CHECKPOINT.md) distinguishes native proof from source-contract and unit checks. “No” names a remaining boundary, not a new gate.

| System | (1) Whole engine | (2) Procedural content | (3) Data only for a third world | Next step |
|---|---|---|---|---|
| Crafting | Fixed batches resolve through the shared craft law; ordered preparation now uses native jobs, actual conditions and agents, with paused progress in actor facts. Neil’s brew and the Potions bench call it | Existing seeded material families plus authored catalogues share `making_traits` through TagRegistry; production mixture results stay on the existing resolver | Yes for declared batches and step combinations; new physical effect kinds still need an owning mechanism | Story rows supply formulas; player-selected free mixing remains outside the fixed-batch adapter |
| Ties | Shared directed regard, observed notes and gates; Ron now participates in repeatable joint practice which refines the learned power. Seller regard can gate a house contract | People/offers remain authored rows; there is no claim that a social-life generator was built | Yes for declarations, native assisted actions and purchase predicates | Story events add meaningful tie changes and their local consequences |
| Homes | World catalogues reach the engine for tenure, furnishings, world-specific room improvements, full overview, dormitory access and purchases. A retained purchase balance feeds Owed; current rental possessions survive title transfer | Authored world rows; existing building generators remain separate | Yes for registered home/furniture/room/purchase rows. World staff institutions and construction methods outside those declarations still need their own appropriate ports | Add later source homes as content. Cash/loan/installment branches are tested; financed title is a developer fixture, not a new canon offer |
| Powers | `power_grammar` composes effect functions, magnitude/range/duration/targets and world price lists, then uses spell records and the structured descriptor; casting keeps seeded failure, costs and mastery. Timed Cogitation uses native jobs and exact save validation | Authoring is compositional; seeded invention is still the later XP4 dial, not claimed here | Rows compose known parts. A genuinely new effect type needs a handler into an existing physical owner or a justified engine extension | Story rows/calibration anchors; source-shape contracts cover indexed first-year magic and pinned Seer methods |
| Research | Yes for Harry (`inquiry` with authored topics, gate and evidence readers) | No | Yes: a topic, its sources and an evidence reader | Klein's records onto `inquiry` |

## Round 2. Cross-world build cases from community discussions (2026-11-09)

**ACT NOW (done).** Compared the [30 lore cases](research/LORE_EDGE_CASES_2026-11-09.md)
with named community examples and the existing source owners. Bounded
reuse-and-check under WPR1–5, WPR24 and WPR27. Reviewed job completion,
ability records, observation channels, obligations, material lineage and
continuation state at the current checkout. This is a design round under
AD5, AD38, AD46, AD51 and AD52. Each row proposes a contrast for a selected
slice. It changes neither build order nor acceptance rules. The lore note
keeps each novel, manga and VN claim at its own evidence level.

### ACCOUNT FOR NOW

**LT11. Recheck what supports the next step, then settle what actually happened.**
The D&D 2024 *Antimagic Field* text says “the time it spends suppressed
counts against its duration” ([official spell](https://www.dndbeyond.com/spells/2618860-antimagic-field),
[community rules discussion](https://www.dndbeyond.com/forums/dungeons-dragons-discussion/rules-game-mechanics/212268-2024-antimagic-field)).
That gives a useful contrast to LOTM's nested projections and a borrowed
wand. A capability can stop working temporarily while an independent
clock and completed effects continue. A job in `simulation.js` can
already recheck support and return reservations or keep disclosed costs.
The missing design case is a repeatable order that encounters a material
boundary between operations. Continue with a substitute when it fits
the player's agreed method and budget. Pause if the substitute would
spend more, require fresh consent, or change the product. Test expiry
just before, at, and after the relevant completion boundary. A prior
effect that already settled keeps its consequences unless the world
has an actual means to undo them. See ACR2/6–8/10–11 and LE1/3/6.

**LT12. Give an alternate method a real chance at the same objective.**
The [community discussion about meaningful costs](https://www.reddit.com/r/ProgressionFantasy/comments/1syy6hb/discussion_what_makes_a_cost_in_progression/)
distinguishes cooldowns from costs to relationships, reputation or
abilities. Treat this as reader preference, with no requirement that
every use hurt. The book checks already support an in-world contrast:
Hanged Man flesh manipulation and Faceless both offer appearance
changes with different precision, and the same apparent escape can
leave different evidence (LMD1–2). Use the existing ability and spell
ports for the source, method, target and actual output. Let a second
method change the next decision, even if both get the player through the
door. For example, one leaves a witness who can be interviewed and one
changes the mechanism a subsequent guard checks. If a more capable
character genuinely solves the entire problem, let the advantage
stand (ACR12). Sample an ordinary method and a different powered method
before adding more variants. See the [effect cases](worlds/deeper-interactions-audit-2026-10-13/01_EFFECT_KINDS_AND_ACTIONS.md).

**LT13. A changed appearance updates a particular check.** A
[Larian forum player](https://forums.larian.com/ubbthreads.php?Number=880962&ubb=showflat)
describes using disguise to question a corpse that refuses its killer.
Larian's Patch 4 confirms a related retry condition, “if you didn't ask
any questions the first time,” with a Wild Shape example
([developer notes](https://baldursgate3.game/news/patch-4-now-live_96)).
The useful decision is whether to change the evidence a listener uses,
try a different listener, or acquire independent proof. LOTM Error
and HP Polyjuice can use different channels. Run an appearance-based
check and one based on separately verified knowledge against the same
actor. A successful disguise can change the current verdict while
the witness's old account, actual identity, and earlier custody remain
available to their proper owners. Reuse the existing actor facts and
observer-scoped receipts where the operation fits.
See ACR9, LE2 and the [identity palette](worlds/HP_POLYJUICE_AND_PERCEIVED_IDENTITY_CONSIDERATIONS_2026-11-03.md).

**LT14. Keep custody and liability separate when the agreed route changes.**
[Courier players discussing collateral](https://forums.eveonline.com/t/how-does-collateral-work-for-courier-contracts/324789)
raise who recovers the stake on failure. CCP's guide confirms a
stronger case: if a destination is removed after acceptance, “an
accepted contract's destination will change” to the issuer's asset
safety location in the ordinary documented case, with a wormhole
exception that fails the contract
([official courier guide](https://support.eveonline.com/hc/en-us/articles/203218982-Courier-Contracts)).
ORV adds a penalty a qualifying proxy can partly absorb. Fate adds a
charge that may produce weaker compulsion than intended. For ordinary
work, run the existing custody, agreed-duty and owed owners together.
Given the same cancelled or disrupted delivery, inspect who physically
has the item, who may redirect it, who owes what, and whether earlier
effort or a paid fee survives. Redirect under a term already accepted.
Otherwise ask for a new choice where the character can make one.
Test repeated notification or reload at settlement and require a single
payment or debt. See ACR6/7/11 and LE26/28/29.

**LT15. Group stock by what the next action needs to distinguish.**
A [Factorio forum suggestion](https://forums.factorio.com/viewtopic.php?t=135672)
asks for control over which destination stack receives incoming stock.
Wube's Gleba design post says “recipe results inherit their freshness
from the ingredients” ([Friday Facts 414](https://www.factorio.com/blog/post/fff-414)).
The useful comparison is selecting stock for an order versus the
world's law for physically mixing stock. YAIRPG's `planMaterialMerge`
already keeps unequal lineage keys separate. Build on that. For a
perishable, inspected or claimed item, preserve the cohort if a recipe,
buyer, healer or authority reads the distinction. Use a single UI line
for convenience when the details can be expanded and the policy still
selects the real units. Let a world that truly mixes ingredients write
a transformation, with actual sources and yield. Test two similar
Tingen doses or Village rations, one with an actionable difference.
Show that transfer, reservation and reload preserve it. See ACR8/13
and the [M1 batch, portion and label gap](audits/LARGER_FOUNDATIONS_2026-11-06.md#gaps-still-without-an-owner-class-c-after-the-spot-check).

**LT16. Test what follows the body, the learner, and the world at a reset.**
[Outer Wilds players](https://www.reddit.com/r/outerwilds/comments/1d49c6x)
frame discovery as the improvement in a loop. Mobius describes a solar
system stuck in a time loop and mysteries explored across it
([developer overview](https://www.mobiusdigitalgames.com/outer-wilds.html)).
Use this as a player-experience comparison. The novel evidence gives
different causal cases. RTOC can retain a mind that exceeds the body's
capacity, Mother of Learning has an eligibility delay before a lapsed
temporary marker can be reused, and Revival Hunter's window follows
the time of the triggering death. Our continuation state already
holds an initial point and a replaceable checkpoint. Reuse the
snapshot machinery where appropriate and choose the carry rules per
event. Test one thing kept, one lost, one that now has a different
cost or use, and the expiry of a relevant permission. Distinguish
memory of how something is done from training or authority to do it.
See LE7–11/27/30 and ACR9/11.

### LATER / DELEGATE

Three shapes were considered. Per-world scripts are a good fit for an
isolated story beat but duplicate custody, work and reload semantics
when two worlds need the same behavior. A universal magic or contract
engine would have to encode very different enforcement, timing and
sources before any of them has a player. The proposed default keeps
the current per-system ports and adds the smallest missing behavior
when an active slice needs it. The unusual comparison is to run the
same test with an ordinary cook, porter or student as the second
consumer. That often exposes a false assumption faster than a second
magical duel. These are proposed build cases and can enter in either
order when their real consumers arrive.

| Ranked build case | Level and effort | Done check |
| --- | --- | --- |
| 1. Interrupted preparation or practice (LT11–12). Reopen when an existing Tingen or Hogwarts job has an interruptible support or a meaningful substitute. | Runtime designer, medium for one shared behavior. | Finish normally, lose support during work, and replay the same case through a recurring order. Save and reload before the boundary. Show retained progress, spent inputs, remaining reservations and the true reason for pause. Compare with a second setting when selected under AD51. |
| 2. Mundane handoff across a boundary (LT14–15). Reopen when a selected delivery or care job reads source identity and accepts a named recipient. | Runtime designer, medium for one cargo or batch. | Close or change the destination mid-job. Keep actual custody, apply the agreed terms once and retain remaining duty or cost. Let an affected material difference reach the recipient's decision. |
| 3. Competing recognition and memory (LT13/16). Reopen when a selected disguise or reset makes knowledge or permission consequential. | Source reviewer then runtime designer, medium for one branch. | Compare two independent observers or two carriers, including one exception. Preserve what the character learned and limit disclosures to those with an actual source. |

Separate follow-up suggestion. In a future playable review, put the failed
case next to the successful one in the existing scenario builder. Reuse
one setup and one change in means, place or timing so differences are
easy to diagnose (AD54). The examples above do not require a new shared
schema before any story can move.

## Deriving playable rules from source scenes (2026-11-11 proposal)

The [source derivation tables](research/GU_AND_HOGWARTS_RULE_DERIVATION_2026-11-11.md)
record the Gu inventory, book-checked cases, and comparisons to run before prototyping.
The checked Draught scene also records the intermediate changes from crushing and stirring.

Fit each world's rule to a demonstrated success and a contrasting attempt.
Record the medium and scene, the changed input, and the observed consequence.
Keep explicit rules, inferred mechanisms and original game tuning distinguishable
(AD38, AD49, AD51, SKR1, SKR17, SKR21). Test an inferred rule against a second
scene before using it to predict a new result. Keep unexplained cases local to
the method. Share execution and trial records where the existing ports fit.

| Case | Source anchor | Proposed playable check |
|---|---|---|
| Hogwarts spellcraft | Pronunciation and wand motion both matter in the first Charms lesson. Snape's inventions establish that spell invention exists. Latin-like word roots can suggest a spell family. Their causal role and the mechanics of creating a spell remain open. [Levitation Charm](https://www.harrypotter.com/fact-file/spells/the-levitation-charm), [Snape's inventions](https://www.harrypotter.com/features/8-times-the-half-blood-prince-reveals-the-real-snape) | Extend `hp_lead_spells.js` through the existing cast lowering. Practise Wingardium Leviosa on a feather, change spoken stress or wand motion independently, then use the learned charm to pass the feather to Ron. Use selectable technique steps and observable feedback. Compare a second levitation-family spell before inferring a reusable word or motion. Keep book and adaptation evidence distinct. |
| Hogwarts potions | In the first sixth-year Potions lesson, the Prince's annotations change bean preparation and stirring for Draught of Living Death. The observed success combines both changes. [Prince's brewing notes](https://www.harrypotter.com/features/8-times-the-half-blood-prince-reveals-the-real-snape) | Build on the existing preparation and making readers. Compare the textbook brew, crushing alone, the added clockwise stir alone, and both changes. The two isolated results are original tuning unless independently sourced. Let the method change observable batch quality and record the result for repeat use. |
| Gu composition and refinement | The English novel text in ch. 106 gives a direct comparison. One Little Light Gu doubles moonblade attack power, a second leaves that boost unchanged, and refining the three into Moonglow Gu yields triple base attack power. Ch. 536 describes combining Gu functions into killer moves. [Ch. 106](https://www.webnovel.com/book/32605619408374705/87585817844827688), [ch. 536](https://www.webnovel.com/ru/book/32605619408374705/88009497980759107) | In Gu practice, compare Moonlight alone and with one or two supports on the same target. Use the refined Gu as a separate calibration case. Extend the [Gu owner](GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#killer-moves) for one complete move using actual held Gu, activation order where sourced, essence and backlash. Check which Gu are still held after activation or refinement. |

Start with Hogwarts Charms as the smallest extension of an existing ordinary
route. Use potions and Gu as distinct tests of the approach. In-game, a lesson
or a recipe gives a reliable method to start from. A notebook preserves what
the character tried and observed so they can repeat or refine it. A new method
earns its place by producing an effect the character can use in the world.

### External references for the three experiments

| Case | Use now | Gap to resolve in YAIR |
|---|---|---|
| Hogwarts spellcraft | Use [Hogwarts Is Here Charms 101](https://www.hogwartsishere.com/courses/CHRM-101/lesson/1/) for fan-authored lesson structure, [Aliffi's linguistic study](https://iris.unipa.it/handle/10447/263708) for word roots, and [the community spell-invention discussion](https://scifi.stackexchange.com/questions/17788/what-must-one-do-to-create-new-magic) for candidate scenes. Compare [The Arithmancer's fan model](https://secure.ao3.org/works/14281440/chapters/33099237) and the published [Wonderbook: Book of Spells](https://blog.playstation.com/2012/11/13/journey-into-the-world-of-wonderbook-book-of-spells-out-today/) for experimental spellcraft and motion practice, respectively. | Fit spell-family hypotheses against the books. Author any reusable motion semantics the sources leave open. Compare [Ars Nouveau](https://www.curseforge.com/minecraft/mc-mods/ars-nouveau) for building a cast from parts. |
| Hogwarts potions | Use [Hogwarts Is Here Potions 101](https://www.hogwartsishere.com/courses/PTNS-101/lesson/42/) for fan-authored lab structure and the [HP Lexicon ingredient index](https://www.hp-lexicon.org/thing/potion-ingredients/) for lookups. Compare [Wonderbook: Book of Potions](https://blog.playstation.com/archive/2013/10/31/wonderbook-book-of-potions-arrives-on-ps3-next-month/) for classroom interaction and [Potion Craft](https://store.steampowered.com/app/1210320/Potion_Craft_Alchemist_Simulator/) for alternative routes to an effect. | Fit ingredient, preparation and process rules against individual recipes. Use fan recipes for candidate experiments and the books for calibration. |
| Gu killer moves | Use [Saga of Gu's chapter-linked entries](https://sagaofgu.com/cultivation/killer-moves/) with the existing [held-edition comparison](research/SAGA_OF_GU_SCOUT_2026-10-24.md). Use [fan-designed moves](https://www.reddit.com/r/ReverendInsanity/comments/1fronxe) as candidate cases and [Gu World's command reference](https://guworld.site/commands/) as a direct comparison for building a move from owned Gu. | Gu World documents move creation and use in duels. Its resolution and failure rules remain untested here. Cross-check support stacking, activation order and backlash in the novel before generalizing. |

This was a public-source scout. Hogwarts Is Here's lesson listings and
indexed excerpts were available. Direct lesson fetches returned HTTP 403.
The games were checked against public documentation.

## Round 3. Playable precedents and layers to share (2026-11-11 proposal)

### ACT NOW

The scout identified these design references. Developer documentation or source
describes the shipped projects below. Fan interpretations and project threads
provide candidate mechanics and test cases. No gameplay runs were performed.

| Code | Reference and disposition | What to carry into YAIR |
|---|---|---|
| LT17 | Adapt the lesson-to-world route from the fan server [PotterworldMC's former Potions class](https://wiki.potterworldmc.com/index.php?title=Potions_Class) and its [professions documentation](https://wiki.potterworldmc.com/index.php?title=Professions). | A lesson teaches chopping, cutting and peeling, with wrong inputs or delays able to spoil the brew. Gathering, stations, a portable recipe book and potion use make the lesson relevant outside class. Try this route with a batch that has a practical use. |
| LT18 | Adapt selected execution behavior from [Hex Casting's evaluator notes](https://github.com/FallingColors/HexMod/blob/main/Common/src/main/java/at/petrak/hexcasting/api/casting/eval/README.md) and [Spellmasons](https://store.steampowered.com/app/1618380/Spellmasons/). Compare the [local Noita analysis](research/noita/REPORT.md) for modifier scope. | Hex Casting evaluates a sequence and applies side effects in order, with a mishap able to stop the cast. Spellmasons shows a swap changing what later steps target. Noita has separate modifier scope for nested payloads. Try one authored action where order changes an outcome and one interrupted attempt that reports which steps took effect. |
| LT19 | Trial competing fan models against book cases. [The Arithmancer](https://www.fanfiction.net/s/10070079/1/The-Arithmancer) models spell design through original Arithmancy. [HP fanfiction discussion](https://www.reddit.com/r/HPfanfiction/comments/1q2af5w/what_is_your_theory_on_how_spells_are_created_and/) proposes mathematical and intent-led models. [Infinite Aperture development discussion](https://www.reddit.com/r/ReverendInsanity/comments/1w21m4s/2_years_after_finishing_ri_nothing_filled_the/) proposes core and supporting Gu nodes. | For Hogwarts, ask what a deliberate change in words or wand motion does and how expert silent casting fits. For Gu, use two instances providing the same support to test whether the model explains a redundant effect. Gu World's documented inventory-to-move command is the direct comparison. The Infinite Aperture discussion supplies design ideas. |
| LT20 | Adapt process comparison from [Opus Magnum](https://www.zachtronics.com/opus-magnum/) and exposure modeling from [Dwarf Fortress syndromes](https://www.dwarffortresswiki.org/index.php/Syndromes). | Compare two ways of making the same product with different time, equipment or byproducts. Read dose, delivery and exposure from the result where the world supports them. This also fits a mundane dye, poison treatment or metalworking process. |
| LT21 | Trial the environment and fuel distinctions suggested by [Amazing Cultivation Simulator](https://store.steampowered.com/app/955900/Amazing_Cultivation_Simulator/) and [Sanderson's Mistborn annotation](https://www.brandonsanderson.com/blogs/blog/annotation-mistborn-3-chapter-thirty-eight). | Environment can contribute to a technique through a place or apparatus. A consumed material may be a catalyst that accesses a separate source of power. Ask separately what is consumed, what provides power, and what shapes the result. LOTM rituals and Gu formations offer distinct cases for the same questions. |

### ACCOUNT FOR NOW

- **Source and knowledge.** Keep scene evidence, competing explanations and game tuning traceable for authors. Give characters only observations their trials, teachers or books actually reveal. A witness, assay or repeat under different conditions can distinguish hypotheses.
- **Method and means.** Keep a learned method separate from the current caster, tools, target, ingredients, fuel and surroundings. Hogwarts can use wand technique and spell knowledge, Potions uses actual lots and equipment, and Gu uses held instances and grade of essence. An alternate method can reach the same intended effect while paying a different cost.
- **Execution and consequences.** Reuse the current cast and making entry points. `power_grammar.js` composes distinct typed functions and prices features. An ordered procedure should carry actual repeated operations or separate Gu instances where a case needs them. Specify what was spent, what persists, what can be interrupted and what took effect before failure. A Gu made busy by a sustained move remains tied up until release. Refinement has its own input and output custody.
- **Practice and replay.** Present the ordinary lesson or recipe first. Offer the experiment as a variation with visible costs and outcomes. Store learned methods and observations through existing knowledge and job owners as applicable. If a trial can pause or save, resume its actual inputs, progress and resolved effects. Include one downstream use beyond the practice bench.

### LATER / DELEGATE

| Proposed trial | Effort and done check |
|---|---|
| Compare two spellcraft hypotheses on one Charms family | Source and runtime designer, medium. Two known cases and a held-out case distinguish what the model predicts. A novice can try the lesson and use the result through the existing spell route. |
| Compare two processes on one batch and one mundane analogue | Making designer, medium. A preparation change reaches a practical consumer, and the trial records the actual lots, cost and result through save and reload. |
| Test support, interruption and custody with one early Gu composition | Gu runtime designer, medium. One versus two supports reproduce the sourced comparison. A separate refinement case changes holdings. An interruption reports what has already happened and preserves remaining custody. |

Access check: the Chrome extension required an active tab and did not expose
background visibility control. The hidden in-app browser was unavailable.
Hogwarts Is Here remains supported here by its indexed lesson excerpts.

## Round 4. One extensible vocabulary for invention (2026-11-11 proposal)

### ACCOUNT FOR NOW

- **LT22 · A working describes a causal process.** Use the same vocabulary for a brew, spell, Gu move, or mundane treatment: bind actual means and targets, execute ordered operations, and pass the results to the owning systems. Describe what was consumed, retained, changed, observed, and left unfinished. A working may bind a donor at dosing or keep a Gu occupied until release. Local rules determine what the operation does and when it can happen. See the [spellcraft vocabulary](research/PROCEDURAL_SPELLCRAFT_ENGINE_EVIDENCE_2026-11-11.md#proposed-vocabulary) and [potion evidence](audits/PROCEDURAL_POTION_ENGINE_2026-11-11.md).
- **LT23 · Improvement has an observed comparison.** MR43 treats a recipe as a teachable baseline. Changing preparation, order, apparatus, or delivery can improve a measured result, including strength, yield, reliability, cost, or suitability for a particular target. Keep each changed condition and each observed consequence. A classroom colour comparison supports that colour result; a downstream use establishes what the product actually does in that use.
- **LT24 · Invention composes known means and local mechanisms.** A player can vary a learned method, combine operations with compatible inputs and outputs, or pursue an effect by a different route. An experiment may reveal a useful unintended result. Record an observed working as a reproducible method with its inputs and conditions. Characters learn from evidence; the resolver evaluates actual world state. Allow world packs to declare new properties or operations and supply a local evaluator for a genuinely new law.

### LATER / DELEGATE

| Proposed proof | Effort and done check |
| --- | --- |
| One method editor, two different consumers | Medium, making and power runtime. Extend a known brew with one material or process operation and compose a spell whose output becomes another operation's input. Each newly arranged method uses existing operations and changes a real target. Include a failed binding, a saved partial attempt, and a learned revision the player can execute with fresh means. Revise the contract if either route needs special cases for individual methods. |

## Round 5. Foundations map before further playable work

**LT25. ACT NOW.** Connect the domain rule maps and compare counterexamples on paper. Existing game results are evidence of what the current owners can express. This phase expands the law families, explains what they could combine with, and marks what evidence is still missing. Keep the [common language and authoring contract](research/ROOT_RULES_CREATURES_GU_POTIONS_AND_MAKING_2026-11-11.md#round-3-foundation-before-the-next-playable-slices) as the source for shared terms.

| Domain | Existing basis | Missing rule or discriminating comparison | Combination and possible side effect |
| --- | --- | --- | --- |
| Material history and chemistry | The potion liner retains, releases and washes out a measured tracer. [Material history owner](../src/potion_vessel_history.js) | Compare whether release follows surface, bulk material, temperature, or a magical interaction. Distinguish reaction, loss and transfer. A filter and a dye bath should reveal which assumptions travel. | Use discarded rinse to trace an irrigation leak. A warm rinse can clean the apparatus and expose a downstream crop or workpiece. |
| Potions | Book cases distinguish preparation, condition, dose and recipient. [Potion cases](research/HOGWARTS_POTION_CHEMISTRY_PROPOSAL_2026-11-11.md) | Establish which magical contributions depend on source identity, timing, ritual or recipient. Keep preparation yield, active dose and adverse effects separately observable. | A reused liner can contaminate an otherwise correct brew. A clean-looking wash can carry away a useful coating as well as the tracer. |
| Creatures | Stable individuals, custody, care, injury and paid broods already have native consumers. [Creature lifecycle evidence](gm/dispatch/creature-lifecycle-2026-11-11/CHECKPOINT.md) | Vary inherited potential, expression, current condition, learned response and needs independently. Specify what another system reads, what it changes and when the creature can decline. | A creature that controls an inlet can change the humidity it senses. Delay can produce cycling. Selling the creature moves its learned behavior and condition, while a shed part carries only relevant material traits. |
| Crafting and engineering | Authored stages, equipment and reservations have current owners. The drain route connects tether, arrival, impact and a mill consumer. [Making palette](CRAFTING_ENGINE.md) | Define joins, load distribution, wear, transfer losses and feedback. Give an output and byproduct a consumer and show when a larger system changes the load or rate. | Removing an active Gu brace transfers the load to another part. A backup catches it, bends, or fails depending on its actual condition and supports. |
| Spellcraft | Vocabulary and spell workings distinguish learned form, operator, target and ordered effects. [Spell evidence](research/PROCEDURAL_SPELLCRAFT_ENGINE_EVIDENCE_2026-11-11.md) | Separate observed words, gesture and delivery from inferred grammar. Paper-test arrival, sustained support, release and same-target continuity against a blocked or substituted target. | Fetch-and-hold can release a jar if concentration breaks. The falling object and spilled contents reach different world owners. |
| Gu | Source-qualified identities and native examples cover rival claims, custody, reproduction, fuel, effects, time and copied technique. [Gu coverage](GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#foundations-first-extend-the-rules-before-more-routes) | Distinguish identity and authority, internal quantity and rank, creation mechanisms, and technique versus effect. Check conflicting rank and fuel evidence and let a second source disprove the candidate rule. | A produced Gu can become food or a support. Year Gu output attracts its predators. An Immortal claim may block one output tier while mortal production remains possible. |

**LT26. ACCOUNT FOR NOW.** Use separate foundation goals by evidence and state owner. Each goal ends its current phase with a source and uncertainty inventory, law families with explicit reads and writes, supported combinations, falsifying cases, and a small paper test set. Keep already verified work in the baseline. The Derive and Implement World Rules thread already has the broader Gu objective. Retain that goal and make the map its current phase. The synthesis is a deliverable within that phase, with playable verification still part of the broader goal when the work returns to it.

| Goal owner | Foundation phase outcome |
| --- | --- |
| Gu and world rules | Maintain this cross-domain map. Expand the Gu evidence and rule inventory across kinds, identity, living state, production, progression, composition, conceptual effects and contests. Record the failures and unresolved interpretations that would affect an implementation. |
| Creatures | Map individual and cohort state, care, behavior, inheritance, habitat, handling and use across ordinary work and combat. Derive controls for a living regulator and for transferring a creature or its products. |
| Potioncraft | Map source recipes, preparation, magical contributions, dose, target and aftermath. Distinguish book, supplement, adaptation and authored possibilities. Give each major family a controlled comparison. |
| Chemistry | Map matter, phase, concentration, transfer, rate, competing reactions and material history. Compare conserved streams across a liner, filter and dye bath and show where scale changes the method. |
| Crafting and engineering | Map tools, fixtures, interfaces, supports, wear, movement, repairs and machinery. Trace ownership and loss under partial work, changed components and load transfer. |
| Spellcraft | Map observed expression, delivery, duration, targeting, interruption and research. Compare copied demonstrations with changed bindings and derive only composition rules that have independent checks. |

**LT27. LATER / DELEGATE.** Review which interfaces the paper checks actually require. Prefer extending existing owners for binding, clocks, stock, bodies, and consequences. Start with independently witnessed observations and local laws. Use an explicit counterexample when the same apparent effect can arise by another mechanism. Return to more playable work after the foundation map identifies the next missing real reader or consequence.

**LT28. ACCOUNT FOR NOW.** The [Gu foundation split](GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#inventing-moves-raising-gu-and-reaching-conceptual-effects) gives two independent paper passes a shared question. What can this operator actually use, through what source or agreement, for how long, and what changes when that access ends? The invention pass binds contributions and checks their timing and consequences. The acquisition pass supplies the current specimen, permissions, and conditions through ecology, care, capture, or trade. Test both against a temporary projection whose real Gu remains elsewhere. Spellcraft can ask the same question of a borrowed working and crafting of a loaned tool. Potioncraft can use the contribution search for material substitutes, with the reaction owning consumption and changed output. Keep permanent custody, temporary access, and a completed world effect separately traceable wherever those cases require it.

## Round 6. Foundations goals by existing chat

**LT29. ACT NOW.** The cross-domain gaps that change the next design are authority at settlement, a living or material input that changes during a plan, and evidence that a proposed rule survives a contrasting source case. The existing owners below can resolve those gaps independently. Each phase ends with checked source cases, what each proposed rule reads and changes, an example and counterexample, and paper checks tied to the live owner. The cross-domain map and the Gu chapter catalogue stay with Derive and Implement World Rules. Playable slices follow the foundations phase.

| ID | Chat | Foundation goal and acceptance check |
| --- | --- | --- |
| FG1 | Procedural creatures and systems beyond… | Derive how inherited potential, development, learned behavior and present condition combine in a persistent individual. Use the creature root rules as your sole write owner. Compare an ordinary pet brood, a wild cohort that gains a named member, and a transferred living regulator whose handler or environment changes. For each, settle elapsed care, inheritance and permission to act independently and show one counterexample that would break the proposed interface. Leave Gu control and unique claims with the Gu lane. |
| FG2 | Procedural potions and brewing | Derive world-specific magical contributions, delivery and persistence from contrasting potion cases. Own the potion engine audit. Compare Hogwarts and Lord of the Mysteries, holding material processing fixed while changing ritual, recipient, dose or target identity. Show a known recipe, a substitution that works differently, and a new candidate with failure and observation. Keep conservation, vessel surfaces and reaction kinetics with the chemistry lane. |
| FG3 | Potioncraft and chemistry-inspired reactions | Derive accounting for material transfer, reaction order, capacity, time and scale. Own the Hogwarts potion chemistry proposal. Trace the same constituent through a liner, a filter and a dye bath, including saturation, losses, residues and what remains after an interrupted stage. Identify the state owner and a falsifying result for each trace. Use existing vessel and separation evidence. Leave magical efficacy and recipient effects with the brewing lane. |
| FG4 | Comprehensive procedural crafting | Derive the rules for physical joins, load paths, power, wear, maintenance and salvage that let designed assemblies work from parts. Own the procedural crafting considerations. Compare a familiar assembly, a changed component that fails at a different point, and a new arrangement with one interruption. Track forces, supports, material loss and ownership through the next operation. Separate making a machine from what the machine can do while running. |
| FG5 | Hogwarts spell vocabulary and spellcraft | Derive which elements of Hogwarts casting can be recombined from witnessed cases. Own the Hogwarts spell vocabulary proposal. Use a held-out family to distinguish shared word roots, gestures, timing and intent from aliases and coincidence. Record a reproduced casting, an accepted or unresolved variation and a failed recombination with concrete predictions. Leave cross-world progression and research settlement with Procedural spells and research. |
| FG6 | Procedural spells and research | Derive which rules for learning, preparing, inventing and repeating a working carry across Hogwarts, edition-specific D&D and one contrasting magic system. Own the procedural spellcraft engine evidence document. Compare copying a witnessed cast, rebinding it to a new operator or target, and an interruption after costs have been paid. Identify who owns knowledge, preparation and counters in each world. Consume the Hogwarts vocabulary lane's evidence without changing its document. |
| FG7 | Other YAIR systems to proceduralize | Derive the adjacent relationship, institution, market and place rules that affect whether otherwise valid plans can happen. Own the other procedural systems proposal. Compare a personal bond, a time-limited offer and an institutional or territorial permission. Trace what happens when each changes between plan and settlement. Bring back which existing facts owner supplies each and one concrete counterexample for each. Keep Gu specimen and Immortal-claim rules with Derive and Implement World Rules. |

**LT30. ACCOUNT FOR NOW.** Preserve an existing comprehensive goal in each chat and use the scoped objective as its current phase. Where the chat has no active goal, set the scoped objective there. Each owner reads the latest shared work and edits only its own document. Preserve the shared 64,500-credit reserve and checkpoint before expensive research. The integration check is one proposed operation that crosses two owners and shows how a changed input, condition or permission affects settlement without duplicating world state.

**Dispatch checkpoint.** All seven briefs were delivered and each destination showed an in-progress turn. Check the receiving chats for native goal state and finished evidence before marking a phase resolved. FG1 `01a1c96a-fcf3-73b3-9b1a-f34c953afbd5`, FG2 `01a1c967-2266-70d2-9e83-13c4a2de1be4`, FG3 `01a1c950-377c-7250-a646-e33577035811`, FG4 `01a1c96a-fb11-7273-984f-12196dc83eab`, FG5 `01a1c950-35b6-7b82-aa2e-b795cd3bac1e`, FG6 `01a1c967-24a5-78d1-b3b2-6c717e351938`, FG7 `01a1c950-3ba7-7cf1-a0ae-89eba7c575f4`.

**First shared paper check.** A bought Gu can serve as a living regulator in a workshop. Quote the recipe with a named Gu and a keeper's agreement, begin the heated stage, then have the Gu's carrier leave before the next required correction. Creature settlement supplies the current condition and location. The agreement and Gu binding supply authority and whether it can reach the station. Chemistry settles the remaining heat, batch and spent fuel. At reload, the already heated batch and paid fuel persist. A substitute regulator succeeds only if it can supply the needed correction in time under its own binding. This is a proposed integration check for the lane results.

### Interruption depends on what the support already did

**LT31. ACT NOW.** Read-only probes through existing resolvers separate three consequences of the same removal. The combined workshop is a paper case. The numbers below are fixture values for the individual resolvers.

| Boundary | Existing result | Proposed cross-owner check |
| --- | --- | --- |
| A correction is scheduled and still needs live support | The regulator fixture reaches minute 2 at 52 humidity with an open inlet and closure due at minute 3. Choosing fixed-open mode before settlement clears the pending closure. It reaches 44 at minute 4. | A departure before a correction that still needs the Gu's action leaves that correction unsettled. The Gu owner supplies reach and authority. The fixture owner chooses its physical fallback. |
| A correction has already moved the mechanism | Settling the closure at minute 3 and then using fixed-closed mode reaches 54 humidity at minute 4. Both regulator branches started from the same round-tripped state. | A latched inlet stays closed after the Gu leaves. A spring-return inlet would require its own fallback law. For a closure due at the departure boundary, check whether the actuator already has the means to finish or still needs the Gu to act. |
| A process continues from stored energy | The thermal fixture reaches 73.04 °C after 20 seconds and has burned 5 fuel. After heat is stopped, it cools to 20.36 °C by second 50, with fuel still at 5 and usable material increasing from 420 to 501 out of 1,000 units. Continued heating reaches 786 usable at 12.5 fuel. Each branch accounts for all 1,000 units. | Settle passive cooling and residual extraction after a loss of active support. Keep the batch and its measured history available for an independently admitted substitute. A substitute supplies new work through its own current binding. |

The regulator currently accepts fixed or linked mode and has no custody input. The thermal resolver already retains residence and paid fuel on stop. The proposed host settlement should read the actual Gu and its carrier, then apply the station's fallback and preserve the chemistry history at the same boundary. Compare one clock jump with stepwise settlement and a reload immediately before departure. A changed result is expected only when the order changes a causal input such as reach, command delivery or the latch. [Regulator](../src/living_regulator.js) · [Thermal process](../src/craft_process_thermal.js) · [Gu aid](../src/gu_cooperation.js)

**LT32. ACCOUNT FOR NOW.** FG5 and FG6 returned source and paper evidence. The Hogwarts comparison separates removing an active amplification from preventing a listener from hearing. The cross-world spell comparison separates interruption during a cast from losing an ongoing effect after it resolves. Apply the same question to Gu support. Name the exact effect being ended, who still maintains it and what physical change has already happened. A stopped lift can change the inputs to the next step. A weight already moved into a locked cradle stays there through the cradle's own support. [FG5 vocabulary checks](research/HOGWARTS_SPELL_VOCABULARY_PROPOSAL_2026-11-11.md#v9-fg5-recombination-checks) · [FG6 interrupted repetition](research/PROCEDURAL_SPELLCRAFT_ENGINE_EVIDENCE_2026-11-11.md#fg6--learning-preparation-and-interrupted-repetition)

**LT33. ACCOUNT FOR NOW.** Three other returned briefs sharpen the workshop comparison. FG1 keeps the transferred creature's history but requotes its response in the receiving chamber and rechecks the handler. FG4 separates the drive that raises a load from the fixture that may keep it supported. FG7 distinguishes an expired offer from one that already settled and separates entry to a place from authority to do work there. Test all three in one trace. An expired offer blocks a purchase before settlement. If the purchase already settled and the Gu then leaves with its keeper, the departure changes reach even if the agreement remains valid. A loaded fixture still uses its own support and failure rules. [FG1 creature transfer](research/CREATURE_ROOT_RULES_2026-11-11.md#fg1-persistent-individuals-across-birth-promotion-and-transfer) · [FG4 assemblies](PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md#fg4-assembly-rules-and-paper-checks-2026-11-11) · [FG7 permission cases](research/OTHER_YAIR_PROCEDURAL_SYSTEMS_PROPOSAL_2026-11-11.md)

### Competing contributions at one boundary

**LT34. ACT NOW.** FG2 and FG3 also returned, so all seven Round 6 briefs now have foundation results. FG2 freezes preparation and changes delivery conditions, showing why a ready dose, a completed ingestion, and a sustained transformation need different checks. FG3 follows the same constituent through lining, filter, dye bath, cloth and rinse. The filter's passage, the cloth's finite uptake, and the next fixation step each read different facts. Taken together, the briefs support preserving the completed transfer and independently settling what the next receiving owner can do with it. [FG2 potion delivery](audits/PROCEDURAL_POTION_ENGINE_2026-11-11.md#fg2-magical-contribution-delivery-and-persistence) · [FG3 material accounting](research/HOGWARTS_POTION_CHEMISTRY_PROPOSAL_2026-11-11.md#pc18-fg3-material-accounting-across-a-liner-filter-and-dye-bath)

**LT35. ACCOUNT FOR NOW.** The current dose helper processes pairs in declared order. A read-only probe with two six-unit effects and one shared six-unit defense left the second effect intact. Reversing the pairs left the other effect intact. The same probe checked that a Gu modifier changes a later beat from 6 to 12 while the synchronized beat remains 6 in either list order. These are current resolver results. The Gu paper comparison adds an equal-rate contact where each effect receives three units of defense. Treat ordered contact, joint competition and independent delivery as different cases. A versioned local rule must explain whichever applies, and capacity, transfer rate and target threshold remain independent quantities. [Dose helper](../src/craft_dose_rules.js) · [Gu paper matrix](GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#when-gu-effects-arrive-together)
