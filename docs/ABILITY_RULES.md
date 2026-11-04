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
| [Implementation map](worlds/IMPLEMENTATION_MAP_ABILITIES_PROCEDURES_SUBTLE_INTEGRATIONS_2026-10-23.md) C1–C19 mechanism cards | Ascension ladders with typed crossings, status bundles, other cross-world classes | Tier and crossing patterns (ABR17) |
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
Observation, Aftermath, Recovery. Commands quote, then revalidate at each actual commitment boundary (AR7).
Admission and quoted entitlement remain fixed for admitted work; completion
checks apply to support the operation still needs and newly committed stages
check their own requirements (GTR11). The current structured timed-ability
adapter requires refunds for cancellation and lost-support reservations. Other
policies need demonstrated adapter and transaction support, not prose alone.
[Source trace and limitations](gm/dispatch/non-ui-rules-follow-through-2026-10-26/RECEIPT.md#t1-admission-and-support-source-trace).

**ABR12. Each ability needs a fitting use in the world.** An ability ships with
at least one situation where it changes an outcome the player cares about: a
task, a person, a place, a fight, a making step. A button that only applies a
timed condition with no reader is unfinished (AR10, MR32). Default: show the use
in the same slice as the ability.

**ABR13. Abilities meet other systems through shared effects.** Damage, healing,
items made or mended, knowledge, movement, social standing and conditions go to
their owning systems (body, crafting, inventory, knowledge, presence). Making
abilities obey MR20: magical input uses its actual requirements and costs,
including no cost where the mechanism supports it (AD5, AD38). Do not invent
a balancing surcharge.

### Costs, limits and aftermath

**ABR14. Costs follow the world's mechanism.** An ability declares its actual
resource, custody and other requirements, including none, through the shared
energy/vital/item cost entries. Distinguish a source-qualified requirement from
an authored runtime default. Current authored examples include LOTM ability
stamina costs, its Seer method's spirituality cost, and HP school charms' stamina
and held-wand requirements. These examples do not establish source law. When
next selected for alignment, verify the consequential requirement at the source
locator before changing rows; naming a resource here selects no port or migration.

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
unchanged proven mechanism uses its row validation plus one sampled batch
journey under AD36 item 7. Add a focused regression for a changed meaningful
invariant or reproduced defect. A new verb, cost resource or crossing needs a rebuilt
desktop browser run of acquire, use, observe aftermath, and Save/reload/Export/Import
when persistence changes. Receipts say "agent-verified, not human-reviewed" when
Weibao has not played it.

## How this applies per world today

This table is an October 25 source snapshot and proposed work palette, not a
current runtime census or source-law authority. Resource examples are authored
runtime defaults until source-qualified; verify current owners when selecting
a row. Its cost-alignment suggestions do not authorize a migration.

| World | Ability rows at the October 25 inspection | Proposed next step |
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
shared seam, the descriptor's seven consumers (DWF165 counted six), and each world's parallel pieces
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

### Round 2 (2026-11-03): mechanisms from one world that serve all, and the adaptation slice

Proposal round, not accepted rules (AD32). Trigger: Weibao asked for "other world stuff that could be useful in all the worlds ... from like bloodlines and stuff", then "Save and try implementing with room to improve with source info, using the source stuff" ([USER_VISION](USER_VISION.md#mechanisms-from-one-world-for-all-worlds-and-adaptation-2026-11-03)). Neighbour audit, not a duplicate: [cross-world detail pass](audits/CROSS_WORLD_DETAIL_PASS_2026-11-03.md) covers detail families (CW, J, H codes); this round covers power mechanisms. Evidence: wiki digests for JJK, Naruto, HP and LOTM, the held JJK wiki page on the Ten Shadows' adaptive general (revision 79200, text SHA-256 `b3b971e7…cd197a4cad`, secondary source), `src` reads listed per row.

#### ACT NOW (done)
- **AB11 Adaptation seam.** Built as a pure world-neutral module with no registration and no save slice: [adaptation_ledger.js](../src/adaptation_ledger.js), calibration in [adaptation_catalogue.js](../src/adaptation_catalogue.js), [test](../tests/adaptation_ledger.test.js) (9 cases). One ledger per holder; the bearer is a separate field, so a tamer can take the exposure while the wheel keeps the result. It is calibrated to the source page ([E8E source calibration](emergent/E8E_ADAPTATION.md#source-calibration-2026-11-03)), and body tolerance is the second, non-JJK case (AD51). State: **implemented, below floor**. There is no consumer (FLR4), no route from a fresh life (FLR2) and no UI (FLR3), and persistence is unchanged.

#### ACCOUNT FOR NOW
- **AB12 Bloodline goes through AB1 provenance, not a new module.** The body side already exists: `src/lineage_traits.js` (gene model, visible phenotype, genotype learned by testing; Frontier household and creature profiles). The provenance side to add: how the trait was assigned (born, awakened at an age or trigger, transplanted as an organ, granted), and its carrier (body, organ, soul, manual). Source rows: an inherited technique comes with training knowledge but exposes weaknesses to rivals (JJK digest DJ9); a restriction can be imposed at birth, involuntarily (DJ4); a clan heir held the inherited technique, but her clan's law forbade it, so she used only a partial application (page r79200, Usage). Having a capability and being permitted to use it are separate facts, which J2 (custody, access, method) already names. Naruto rows are now held: a WikiTeam Narutopedia dump from the Internet Archive (2020-02-23, md5 checked, newest revision per page). It is secondary and has not been canon-checked. These rows sharpen AB12:
  - **Birth versus awakening.** Some eye techniques are present from birth; others awaken under specific conditions. A more diluted descendant may awaken the eye in only one eye. Dilution becomes a dial (Byakugan r1347292, Kekkei Genkai r1348849).
  - **Transplant with a carrier mismatch.** A transplanted eye works, but a non-clan host cannot switch it off and pays more energy to keep it active. Full power stays with the original owner. Overuse blindness is cured by transplanting a close relative's eyes, so donor kinship is a compatibility fact (Sharingan r1344802, Rinnegan r1348956).
  - **Theft and guarding.** Villages tried to steal one clan's eye. That clan brands its branch members so their eyes are destroyed at death, and one outsider still got an eye and guards it. This links AB15 conserved power to bloodline custody (Kekkei Genkai r1348849).
  - **Inheritance is the ordinary route, with exceptions for a reason.** Most bloodline abilities pass within a clan, but one person had one with no lineage, and one person naturally had two. Mixed parents can pass one of each, which the existing allele model already fits (Kekkei Genkai r1348849; Byakugan r1347292 trivia, citing a databook).
  - **Inherited versus taught.** Clan secret techniques pass orally and can be taught to anyone, so they are not bloodline. Body and knowledge are separate carriers (J2) (Hiden r1289236).
  - **Copying needs prerequisites.** A copying eye cannot reproduce bloodline abilities it lacks. This answers AB6's question about copying versus "innate means fixed" (Sharingan r1344802).
  - **Granted by procedure, at a stated risk.** One survivor among ten subjects set a one-in-ten success rate, a fixed point under AD49 (Cursed Seal of Heaven r1332211).
- **AB13 Digestion/acting and AB14 loss of control** run only in LOTM files (`book_world_lotm_*`, `lotm_potion_rule_rows.js`). They belong to the in-flight LOTM mechanism lane under AB7, so that lane names the shared seam when it touches them. Nothing is lifted from outside the lane. Later users: cultivation insight, technique understanding, warlock patrons, Gu and curse corruption.
- **AB15 Power is conserved.** When something powerful dies, its power goes somewhere: a relic, a monster, an heir, a lawful pickup (LOTM characteristics, E8E inheritance case). This feeds heir rules and the Frontier relic echoes.
- **AB16 Living tools with upkeep** (Gu feeding and starving, familiars, contracted spirits, intelligent blades): AB4 plus the cross-world pass's H5 intake and upkeep seam.
- **AB17 Soul anchors.** Death returns you to a found, destroyable anchor; U13 loss and continuation; H2 rewind is its neighbour.
- **AB18 Vows with an enforcer.** Extend `src/vow_rules.js` (AB3) with a third party who enforces the terms and a lethal price. The JJK digest says mutual vows are punished more severely, with no predictable schedule given (DJ1).
- **AB19 Emotion as fuel**, with places that collect fear and spawn things (JJK cursed energy and wombs, HP Patronus). Source rows still to be read: Cursed Womb r78895 (its incubation time is unstated).
- **AB20 Bounded rule spaces.** Domains, curtains, formations and planes: a site whose rules overwrite the world's. Domains can impose procedures instead of lethal sure-hits, and incomplete domains lack some sure-hit functions (DJ5, DJ7).
- **AB21 Capacity limits** (D&D attunement): holding several innate methods runs into a bodily storage limit that an external aid can change (DJ9).
- **AB22 Felt rank** (realm pressure, Sequence aura) and **AB23 names that draw attention** (LOTM honorific names, the HP name taboo): leads, source rows not yet opened.

#### LATER / DELEGATE (not dispatched)
- **AB24 First adaptation consumer.** Default: body tolerance on an existing food, drink or medicine effect, because it needs no combat hook. Alternative: a hook before `rollCombatStrike` that turns the ledger into a `damageModifier`, waiting until combat L2b reaches the floor and the combat files have no other writer. Either one needs a save slice under the namespaced-slice rule, with save, reload, Export and Import (FLR5). Sonnet; done when a fresh life reaches it and the description, cost and refusal show.
- **AB25 Source gaps for AB11.** Seconds per turn, speedup per repeat hit and post-fight fade are unstated and set as dials (the catalogue's `unstated`). The held battle pages and the Ten Shadows page were read 2026-11-03: they source the two slots and the gradual defense, and record a 5-versus-4 turn conflict ([E8E](emergent/E8E_ADAPTATION.md#source-calibration-2026-11-03)). None gives a time per turn, and the Modulo duel page is not held. Done when each remaining dial has a locator or stays labelled unstated.
- **AB26 Known limits and expected refactor (AD45).** Phenomenon keys are caller strings with a fixed read depth. Spill reaches the parent only (not siblings). `answered` is one flag rather than distinct offensive outputs. Expect a refactor when the first consumer arrives or a second world's keys disagree.

### Round 3 (2026-11-03): in-world reasons per world, Ars Magica read, more rulebooks

Proposal round (AD32). Trigger: Weibao, “Read them, but also consider the in world reasons for the various worlds, more to consider? more rulebooks”. Evidence:
- Ars Magica Definitive Edition core rules (open CC BY-SA 4.0 corpus, `reviewed` markdown). Sections read: Warping, Gaining Warping Points, Effects of Warping, Wizard's Twilight, Raw Vis, Vis Extraction, Faerie Blood, Strong Faerie Blood, Mythic Blood, the Gentle and Blatant Gifts, Susceptibility to Warping, the Limit of Warping, Longevity Rituals.
- The JJK and Naruto rows from rounds 1 and 2.
- Canon lines for LOTM, HP, D&D, Reverend Insanity and cultivation are from public knowledge and are labelled "to check" until a held source is cited.
- Original worlds (Frontier, Mistglass, the Village) are not given reasons here: each one's brief owns its reasons, and some are sealed.

#### Ars Magica findings
- **AB27 Loss of control has one shared accumulation and a reaction per tradition (AB14).** Points are bought quadratically: score n costs 5×n more points. They come from four stacking sources: living in a strong aura, a powerful effect not made for you, a continuous effect, or botching a supernatural roll. The book says "most magical traditions have a unique reaction to Warping", and Wizard's Twilight is the Hermetic one. That is exactly the AD51 split: share the accumulator and keep the reaction local, such as LOTM losing control, JJK curse takeover or Naruto beast chakra (to check).
- **AB28 Aligned sources do not warp you.** Practitioners whose powers come from the same realm as an aura gain no warping from living in it. As a dial: a power that matches its user's nature is safe, and a mismatched one corrodes. LOTM's digestion through acting is one such reason (AB13, to check against the held LOTM wiki).
- **AB29 Aftermath reflects its source.** Warping flaws reflect the main source. One example: someone repeatedly healed by powerful magic grows a stigmatic wound that looks real but does no harm. Reuse AB11's phenomenon keys so the aftermath can name its cause.
- **AB30 Warping is also adaptation.** At warping score 5 a mundane character gains a supernatural Virtue tied to the main source, and stops gaining points from auras of that type. So AB11 and AB14 are two outputs of one exposure. Keep one exposure input with two readers rather than two counters.
- **AB31 A crisis a capable character can turn to profit (AD50).** Twilight triggers when two or more points arrive from one event. The character can resist with a roll or choose to enter. Comprehending it gives knowledge, a Virtue or a spell; failing gives a bad scar. Time in Twilight grows with the score, up to "Final Twilight" (permanent) at 10. This is AD50's shape: announced, with authored exits, ending a run only at the top of the dial.
- **AB32 Stored power as a typed, consumable, tradeable item (AB15).** Vis is raw power stored in matter that fits its Form (blood, sap, crystal). Using it destroys it. Magi trade it as currency (pawns), and it can be extracted from a magical aura by the season. LOTM characteristics play the same role (to check). One shared shape: kind, potency, carrier substance, consumed on use, tradeable.
- **AB33 A bloodline gives a gift, a sense and a social effect, not just a stat (AB12).** Faerie Blood gives a typed ancestry with a small power, slower aging and easier dealings with faeries; Strong Faerie Blood adds Second Sight. Mythic Blood reduces casting fatigue. The Gift's social effect (Gentle versus Blatant) is a felt-power reading other people react to (AB22).
- **AB34 Anchors have a body cost.** The Longevity Ritual "creates a magical anchor" that keeps the magus alive and leaves him permanently sterile. It is also a continuous effect, so it warps him. It sits beside AB17 soul anchors and the aging owners.

#### In-world reasons by seam and world (AD38: things work by how they work; each row is a default with its reason and cost)

| Seam | JJK | Naruto | LOTM | Harry Potter | Ars Magica | D&D | Gu / cultivation |
|---|---|---|---|---|---|---|---|
| AB11 adaptation | A shikigami's wheel analyses what hits it; untamed, it kills its summoner (held) | to check | to check | No canon adapter. A body's tolerance is ordinary biology (AB11 body case) | Warping score 5 stops aura gain (AB30) | Hydra-like monsters at the GM's call; immunity is usually fixed | Refined Gu or bodies tempered by a substance (to check) |
| AB12 bloodline | Inherited techniques with the clan's manuals; clan law decides who may use them (held) | Born with it or awakened; transplants carry a mismatch cost; a theft economy (held) | Lineage and family ties to the pathways (to check against the held wiki) | Magic usually runs in families, but squibs and muggle-borns show it is not certain. Some talents run in a line (to check) | Faerie, Giant and Mythic Blood Virtues (AB33) | Sorcerer bloodline origins (SRD to check) | Inborn aptitude grades (Gu `aptitudePercent`, ABR5) |
| AB13/AB14 digestion and loss of control | Vessel takeover and curse energy (to check) | Beast chakra and curse marks (to check) | Acting digests a potion; failing leads to losing control (lane-owned) | Little on the ordinary route; suppressed or damaged magic is the exception (to check) | Warping and Twilight per tradition (AB27, AB31) | Not in the default rules; dial for patrons and madness (CoC and Blades are the sources) | Heart-demon or deviation risks (to check) |
| AB15 conserved power | Cursed objects hold a dead sorcerer's power; destroyed shikigami pass their power on (to check against the Ten Shadows page) | Tailed beasts re-form after death (to check) | Characteristics are conserved (to check) | Mastery of a wand passes by defeat: custody, not conservation (to check) | Vis (AB32) | Not in the default rules | Gu can be refined and inherited (to check) |
| AB17 soul anchor | to check | Reanimation needs a body or a sacrifice (to check) | to check | Horcrux: the soul split by murder (to check) | Longevity anchor with sterility (AB34) | Lich phylactery (SRD to check) | to check |
| AB18 enforced vow | Binding vows; mutual ones punished more severely (DJ1, held) | none found | to check | Unbreakable Vow: a third party binds it, and breaking it kills (to check) | The Hermetic Oath, enforced socially by Tribunals (to check) | Geas (SRD to check) | to check |
| AB20 rule spaces | Domains and curtains (DJ5, DJ7) | Barrier techniques (to check) | to check | The castle's anti-Apparition wards; rooms that answer a need (to check) | Realm auras change what magic does (to check) | Planes and spell areas | Formations and arrays (to check) |
| AB21 capacity | Bodily storage limit for innate methods (DJ9) | One bloodline ability is the usual case, with two as a stated exception (held) | One pathway with adjacent swaps (to check) | none found | Longevity and Parma limits (to check) | Attunement slots (SRD to check) | Dantian or Gu aperture capacity (to check) |
| AB22/AB23 felt rank and names | Energy sensing (to check) | Chakra sensing (to check) | Honorific names draw attention; a high Sequence's presence is felt (to check) | The name taboo (to check) | The Gift unsettles people (AB33) | none found | Realm pressure (to check) |

**AB35 The reasons are rules too.** Each world's reason above decides its counters and costs: a transplant mismatch, an untamed wheel killing its summoner, sterility for longevity. A seam use states its world's reason in its WA55 difference row. A use without a reason is incomplete, not neutral.

#### ACCOUNT FOR NOW
- AB27 and AB30 change AB11's first consumer: body tolerance and warping read one exposure. Do not build a second counter.
- AB31 joins AB14 to AD50, so a loss-of-control slice needs two authored exits and a capable-character route.
- Every "to check" cell is a source gap, not a design gap. Fill it from the held LOTM, Naruto and HP sources and the fetched SRDs before any slice relies on it.

#### LATER / DELEGATE (not dispatched)
- **AB36 Fill the "to check" cells.** Haiku, one world per reader, bounded to the held wiki pages and SRDs. Done when every cell cites a page and revision, or says "not found".
- **AB37 Read the next rulebooks** from the [library index list](research/LIBRARY_INDEX.md#wikis-and-rulebooks-acquired-missing-and-routes-2026-11-03) (Ironsworn vows, Eclipse Phase backups, Warhammer corruption, Unknown Armies obsession), one seam per read.
