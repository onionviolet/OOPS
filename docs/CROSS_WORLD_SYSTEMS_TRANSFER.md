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
