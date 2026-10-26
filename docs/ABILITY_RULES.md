# Ability implementation rules

Weibao, 2026-10-25: "planning ability implementation rules for every world?
More to consider?" ([request](USER_VISION.md#human-gates-can-be-skipped-2026-10-25)).

An ability here is anything a character can do because of what they are, hold or
learned, beyond ordinary verbs: a Beyonder power, a charm, a cultivation
technique, a Gu's effect, a trained skill's special move, a cheat's power, a
device's function. Each world has its own; the engine already runs most of them
through one seam. This rulebook fixes how any world's abilities are absorbed,
modelled, used and shown, so the next world's abilities land as data over that
seam instead of a new script per power.

It composes existing owners and adds only what none of them covers.

| Owner | What it keeps | Used here as |
| --- | --- | --- |
| `src/simulation_contracts.js`, `simulation.js`, `simulation_effects.js` | Powers (`practice / design / investment / authority / hybrid` models), sources, faculties, commands with `requires`, `costs`, durations, cancellation; `power.<id>.*` and `faculty.<id>.*` facts; `powers[actor][id]` save state | The one runtime for abilities (ABR5) |
| `src/power_models.js` | Scope and cost preview per model, fluency shortening duration | Growth by use (ABR10) |
| `src/structured_ability_runtime.js` `compileStructuredAbilities` | Row descriptor: `function`, `acquisition`, `executionKind`, `control`, `target`, `counters`, `carriers`, `conditions` (charges, restriction, price, breach, strengthens); "classification never grants a source" | The authoring shape every world's ability rows use (ABR6) |
| [ABILITY_AUTHORING](worlds/ABILITY_AUTHORING.md) causal execution contract, comparison envelope, ASR1–ASR15 | Eligibility, Preview, Commitment, Resolution, Observation, Aftermath, Recovery; families versus instances; copy and teaching | The phases every use passes through (ABR11) |
| [Implementation map](worlds/IMPLEMENTATION_MAP_ABILITIES_PROCEDURES_SUBTLE_INTEGRATIONS_2026-10-23.md) C1–C* mechanism cards | Ascension ladders with typed crossings, status bundles, other cross-world classes | Tier and crossing patterns (ABR17) |
| [Domain rules](DOMAIN_RULES.md) SLR1, SLR4, SLR8, SLR13–SLR16, SLR27, SLR40–SLR43 | Competence layers, recorded causes, teaching, one authority per learning fact, faculty/method/trait/title distinction, activation by means | Learning and carriers (ABR8, ABR9) |
| [Progression gate rules](PROGRESSION_GATE_RULES.md) GTR2, GTR8, GTR30, GTR32 | Gates read mechanisms, re-evaluate on arrival, can reduce output instead of blocking | Eligibility and crossings (ABR7, ABR19) |
| [Making rules](MAKING_RULES.md) MR13, MR16, MR20, MR32 | Canon labels, verbs change declared state, magic input costs, no maker without reader | Abilities that make or are made (ABR13) |
| [High-tier power](HIGH_TIER_POWER_CONSIDERATIONS_2026-10-23.md) HTP7, HTP17, HTP20, HTP24, HTP29, HTP30 | Tiers add domains and verbs, laws push back, no cross-world rank, no tier from recall | High tiers (ABR18) |
| [World absorption rules](WORLD_ABSORPTION_RULES.md) WA1, WA3–WA6, WA14 | Engine owns verbs, world owns nouns, numbers and laws; floor before deep; carry per edge | Absorbing a world's abilities (ABR1–ABR4) |
| [Cheat library](CHEAT_LIBRARY.md), [simulators and cheats](SIMULATORS_AND_CHEAT_IMPLEMENTATION.md), AD26, AD29 | Cheat modules, terms, charges, quiet faculty | Cheats as abilities (ABR16) |
| [Deep world workflow](DEEP_WORLD_WORKFLOW_2026-10-19.md) DWF165, DWF168 | Census kinds to seams: HP spells and LOTM sequence abilities grow `compileStructuredAbilities`; artifacts as `device-construct` abilities | Census rows (ABR3) |

Status: proposed 2026-10-25 from Weibao's request. Defaults for agents; a world
may propose an exception with an in-world reason and cost. Nothing here is
accepted direction except where a rule cites an AD line or Weibao's own words.
It authorizes no runtime change or migration of existing abilities.

Direction applied: AD38 (things work by how they work), AD6 (means), AD3 (a
world's special rules start hidden), AD28 (power is relative), AD30 (titles may
grant powers), AD5 (both, depending on the world) and AD42 (human gates optional).

## Rules (ABR)

### Absorbing a world's abilities

**ABR1. Read the source before building the ability.** An ability ships from a
source locator (book, chapter, wiki page) with its canon status (WA3, MR13):
canon, inferred, or original with a stated reason. Recall-only abilities wait for
a source pass (HTP29). Where the source grants nothing at a rung (LOTM Sequence
9/8 rows today), the rung's use comes from what the source does give: acting,
digestion, perception it implies, institutions that use it. Default: no invented
power to fill a gap; dial: an original ability labelled as such when Weibao asks
for one or the world clearly implies one.

**ABR2. Model the mechanism, not the name (AD38, SLR41, GTR2).** Each ability row
names its means (source, faculty, method, device), trigger, cost and the consumer
its effect reaches. A spell that mends glass is a repair effect on a glass item
that any fitting means could also cause. A label alone does not gate; the mechanism does.

**ABR3. One census row per ability, grown in rungs.** World abilities enter as
census rows (DWF165). The shallow rung (hear of, read about, see used) needs no
runtime. The deep rung adds the row to the descriptor. A row moves rung by rung
as a slice needs it, and the world's completion ledger records which rung each
row reached.

**ABR4. Engine owns verbs, world owns numbers and laws (WA5).** Costs, durations,
ranges, drawbacks and gates are world data. A new verb (a kind of effect no
consumer reads yet) is engine work with its own consumer, proposed once and
reused by later worlds.

### Data shape

**ABR5. One runtime: simulation powers, sources and commands.** Default: every
usable ability resolves as a native simulation command against `powers`,
`sources` and `faculties`, with `requires`, `costs`, duration and cancellation.
Dial: a world keeps a bespoke resolver only when its mechanism cannot be
expressed there (named reason, recorded in the world's ledger). Mistglass
cultivation methods and enemy `techniques.js` are such cases today; they project
into the shared facts rather than duplicate them (SLR27).

**ABR6. Author through the structured descriptor.** World ability rows compile
through `compileStructuredAbilities`: `function`, `acquisition`,
`executionKind`, `control`, `target`, `counters`, `carriers`, `conditions`.
Lessons, practice and recharge commands that wrap an ability also come from row
data instead of hand-written commands (today HP lesson/practice and the LOTM Seer
method are hand-built; port them when next touched).

**ABR7. Gates are facts, not flags.** Eligibility reads facts: source held and
active, mastery, digestion, body (hands, senses), custody (wand held), place,
time, institution standing (GTR30 expressions). A missing world fact becomes a
fact projection in that world's facts module, not a boolean on the ability.

### Acquisition and growth

**ABR8. Every gain has a cause and a layer (SLR4, SLR8, SLR40).** Acquisition is
innate, learned, borrowed or acquired, and names what it grants: understanding,
fluency, source, expression. Drinking a potion grants a source; a lesson grants
understanding; practice grants fluency. Holding a source does not mean knowing
how to use it well, and the reverse.

**ABR9. Teaching, copying and transfer follow the authoring contract.** Teachers
teach what they hold (SLR15); lessons are transactions (SLR16); copying records
what was seen and inferred (ABILITY_AUTHORING); transfer conserves (SLR13).
Default: one learner resolver for player and NPCs (MR23, AD6).

**ABR10. Growth comes from real use.** Mastery and fluency rise from executions,
practice and digestion that the world defines (acting for LOTM, practice for HP,
throughput for cultivation). A new rung or mastery band changes what the ability
can do (scope, cost, new mode, new target) rather than only a number (HTP7, P3).

### Use

**ABR11. Every use passes the causal contract.** Eligibility, Preview (known
costs and range, no draw, no spend, no new knowledge), Commitment, Resolution,
Observation, Aftermath, Recovery. Commands quote, then revalidate at completion
(AR7). Cancellation refunds or forfeits as declared; losing support mid-use
refunds per the descriptor.

**ABR12. Each ability needs a fitting use in the world.** An ability ships with
at least one situation where it changes an outcome the player cares about: a
task, a person, a place, a fight, a making step. A button that only applies a
timed condition with no reader is unfinished (AR10, MR32). Default: show the use
in the same slice as the ability.

**ABR13. Abilities meet other systems through shared effects.** Damage, healing,
items made or mended, knowledge, movement, social standing and conditions go to
their owning systems (body, crafting, inventory, knowledge, presence). Making
abilities obey MR20: magic input is a step with cost, not a free multiplier.

### Costs, limits and aftermath

**ABR14. Costs use the world's own resource.** Default: an ability pays what its
world says it pays (spirituality for LOTM, essence for Gu, stamina and a held
wand for HP school charms), through the shared energy/vital/item cost entries.
Today LOTM abilities pay stamina while the Seer method pays spirituality; align
them when the rows are next touched.

**ABR15. Limits are adjectives, set per world (AGENTS limits).** How often, how
much, how sure: charges, cooldowns, durations, strain and drawbacks are world
dials. Drawbacks and lasting prices (loss of control, mental strain) are
conditions with their own consumers, not flavour text.

### Kinds of abilities

**ABR16. Cheats are abilities with terms.** A cheat's power uses the same
eligibility, cost and observation logic; its terms (gift, lease, lien) and
charges live in the cheat domain. Default: a cheat power that acts on the world
emits a simulation command or effect, so its results reach the same consumers.
Base cheats stay quiet and discovered in play (AD26, AD29).

**ABR17. Devices, artifacts and titles carry abilities through custody.** A
device or artifact ability is a `device-construct` row whose source is the held
item (DWF168); losing custody removes access, not knowledge. A title grants an
ability only through a declared supply (AD30, SLR42).

**ABR18. High tiers add domains and verbs (HTP7, HTP30).** A higher rung is ready
when it adds a new kind of thing to do, a new state domain, or new world
pushback (HTP17), sourced (HTP29). A bigger number on the same verb is not a new
tier. Others read your tier by their means (HTP20).

### Knowledge, observers and worlds

**ABR19. What the character knows decides what the player sees.** Unknown
abilities, formulas and future rungs do not appear as disabled rows, counts or
percentages (AD3, MC7). Refusals give only reasons the character can know
(GTR10). Witnesses learn only what they could observe; concealed effects stay
concealed (`look`, `seenBy`).

**ABR20. Abilities carry by world rule (WA14, SLR20, GTR8).** Crossing to another
world re-evaluates each ability against the destination's mechanisms: the source
may work, work differently, weaken (GTR32) or go dormant. There is no
cross-world effective rank (HTP24). Knowledge of how an ability works carries as
knowledge even when the source does not.

**ABR21. Player and NPC abilities share rows (AD6).** Hostile Beyonders, teachers
and rivals use the same rows, costs and drawbacks. An NPC ability the player can
observe follows ABR19 for what is revealed.

### Proof

**ABR22. Proof scales with the change (AD36 item 7, AD42).** A data-only row on an
existing verb needs its row validation and one focused test that the effect
reaches its consumer. A new verb, cost resource or crossing needs a rebuilt
desktop browser run of acquire, use, observe aftermath, and Save/reload/Import
when state persists. Receipts say "agent-verified, not human-reviewed" when
Weibao has not played it.

## How this applies per world today

| World | Ability rows now | Default next step under these rules |
| --- | --- | --- |
| LOTM | `book_world_lotm_abilities.js` ROWS: about 13 body-faculty rows over four pathways, stamina costs, drawbacks as prices, no digestion gate; Seer method hand-built with spirituality cost | ABR1/ABR12: give existing Spectator/Telepathist rungs a sourced use (acting toward digestion, perception that answers a real question). ABR14: move ability costs to spirituality. ABR7: add digestion facts where the source ties use to them |
| HP | Two spells (levitation, glass repair) as descriptor rows; lesson/practice hand-written | ABR6: generate lesson/practice/cast from spell rows so the 100-row census (DWF165) can grow as data; ABR12: each new spell arrives with a school or adult use |
| Frontier skills | `learn()` helper over powers; specializations by mastery | Already on the seam; ABR10: check each mastery band changes what the skill can do |
| Mistglass / cultivation | Native condensate methods, not powers; Gu and rights kept apart from techniques | ABR5 dial: keep the bespoke throughput model; project method/mastery facts so gates and other worlds can read them |
| Cheats | Own domain with charges and terms; RF1 uses the power registry | ABR16: cheat effects that change the world go through simulation effects |
| Enemy techniques | `techniques.js` observe/understand/own/practice | ABR5 dial and SLR27: project, do not merge |
| SRD effect schema | `effect_dsl.js` inert, no consumer | Keep as a source-reading vocabulary only until a consumer exists (ABR4) |

## More to consider, round 1 (2026-10-25)

### ACT NOW (done)

**ABM1. Ground the rules in the code that exists.** A read-only survey mapped the
shared seam, the descriptor's seven consumers, and each world's parallel pieces
before any rule was written; the per-world table above records it. The survey
also found the older [ability authoring doc](worlds/ABILITY_AUTHORING.md), so
these rules cite its contract instead of restating a second one.

**ABM2. Correct the LOTM first step.** The master plan's MC11 already moved the
LOTM default from "new ability" to "a sourced use of what exists"; ABR1 and the
LOTM row encode that for every world: when a source grants nothing at a rung, the
rung's use comes from what the source does give.

### ACCOUNT FOR NOW

| Code | Evidence / consequence | Apply when the next ability slice is chosen |
| --- | --- | --- |
| ABM3: one cost vocabulary per world | LOTM abilities pay stamina, its method pays spirituality; HP pays stamina plus items. Mixed vocabularies confuse the player and break balance between rows. | Pick the world's resource in its ledger before adding rows; port old rows in the same slice that touches them. |
| ABM4: ability buttons crowd the view | `lotm-q6` checkpoint E1-M8: unrelated pathways' buttons fill the service view. A 100-spell HP census would be worse. | Group by source and known use; show only abilities the character holds and can plausibly use here (ABR19), with the rest one step away. Check the touched list at its expected later size (MC7). |
| ABM5: abilities need targets that exist | An ability's use (ABR12) depends on people, items and places that accept the effect. Perception needs something hidden to perceive; repair needs broken things. | Name the target owner in the row; if the world lacks it, the slice adds the smallest target with its own continuing use. |
| ABM6: hostile use is the same row | LOTM hostiles already reuse ability rows. Abilities that hurt or control the player go through body and combat owners (BHR, CBR) and their recovery rules. | When a row can target the player, check the defeat, injury and recovery path in the same slice. |
| ABM7: saves hold `powers[actor][id]` with revision | Changing a row's revision changes what saved powers mean. | A row change that alters an owned power's meaning carries a migration or keeps the old revision readable (AGENTS Safety). |

### LATER / DELEGATE (proposals, not dispatched)

| Code | Opportunity | Suggested capability and effort | Done check |
| --- | --- | --- | --- |
| ABM8 | Generate HP lesson/practice/cast commands from spell rows (ABR6), then add a third census spell as data only | Sonnet medium; one slice in `book_hp_life_data.js` and the descriptor | A new spell row with no hand-written command can be learned, practised and cast in a rebuilt browser run, and survives Save/Import |
| ABM9 | LOTM ability cost and gate alignment (ABR7, ABR14): spirituality cost, digestion facts where sourced | Sonnet medium after a source check of the LOTM local text (HTP26) | Existing rows pay spirituality, refuse with a knowable reason when it runs out, and an observed use advances digestion where the source says so |
| ABM10 | An "ability coverage" view for agents: census rows per world by rung (ABR3), kept out of player UI | Haiku low for the script over existing census files | One command prints rows per world and rung; no sealed field in its output |
| ABM11 | Decide whether `effect_dsl.js` gets a consumer or is retired as a reading vocabulary | Sonnet low, after one world needs it | A named consumer exists, or the file is marked reference-only |
