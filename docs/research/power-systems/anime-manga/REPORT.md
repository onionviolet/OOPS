# Lane A: anime and manga power systems

Research completed 2026-10-10 for the first 20 series in ASSIGNMENT_A.
This is a bounded mechanics survey, not a full-series read. All design
choices below are **proposals**, awaiting Weibao's acceptance. No gameplay,
shared E8 edits, build or commit is part of this lane.

The useful gain is a clearer model of **who owns a power, what lets it run,
what pays for it, and which rule can change**. E8 already has broad families;
adding another fire or sword entry adds less than making those distinctions
work. SERIES.json has each series' eight path parts, families, sources,
delivery modes, all ten axes, contract/cost slots, source-linked claims,
rule-abuse examples and one-line proposed takeaways. SOURCES.md explains
what each reference actually supports.

**Evidence:** `reference_verified` means the accessed public reference
extract supports the stated claim. Most references are fan wikis, not
primary chapter reads. `remembered_unverified` is a lead, even when a
relevant URL is attached. Path, family, axis and slot rows are analyst
mappings; they do not establish new canon. No remembered fee, fatality,
loophole or precise numerical threshold should become a book-world rule
from this survey alone. Late plot spoilers appear in the data.

## Findings

| Code | Finding | Why it changes the model |
|---|---|---|
| F1 | A vow, activation gate, body cost, learned method and imposed game rule are different mechanisms. | Give them different kinds before applying breach/pricing slots. |
| F2 | A power can have separate body, mind, item, authority and record carriers. | Theft, transfer and returning borrowed power affect different parts. |
| F3 | Mastery can change valid objects, delivery or failure handling. | Growth need not mean a larger damage number. |
| F4 | Graders observe a route, not a person's complete power. | A suit score, public grade and latent gift can disagree without any of them being fabricated. |
| F5 | Comedy can expose a consistent rule; it can also be a named outlier. | Keep literal loopholes and personal belief powers without making them universal. |

## Coverage and path comparison

This is the required 20, in dispatch order. The last 13 are optional and
were not surveyed. Shapes and grader distinctions below are mappings.
There is no universal cap, energy conversion or required hidden drawback
implied by this table. Each world sets its rules; exceptions stay named.

| Series | Main path shape | Gate that changes decisions | Main evidence |
|---|---|---|---|
| Chainsaw Man | Pact web plus host form | Patron agreement; fear can change external supply | [Contracts](https://chainsaw-man.fandom.com/wiki/Contract), [Devils](https://chainsaw-man.fandom.com/wiki/Devil) |
| Jujutsu Kaisen | Innate gift plus shared craft | Skilled technique/barrier work; grade is separate | [Techniques](https://jujutsu-kaisen.fandom.com/wiki/Cursed_Technique) |
| Hunter x Hunter | Affinity wheel plus authored ability | Category fit and creator-defined requirements | [Nen](https://hunterxhunter.fandom.com/wiki/Nen?file=Nen_Types_Diagram.svg) |
| Undead Unluck | Rule interpretation | Changed understanding changes eligible targets | [Negators](https://undead-unluck.fandom.com/wiki/Negators) |
| Bleach | Bonded release stages | Spirit communication and actual name | [Soul weapons](https://bleach.fandom.com/wiki/Zanpakut%C5%8D) |
| Naruto | Technique tree plus body limiter | Control, divided clone resource and body access | [Chakra](https://naruto.fandom.com/wiki/Chakra), [Clones](https://naruto.fandom.com/wiki/Shadow_Clone_Technique) |
| One Piece | Eaten gift plus parallel arts | Fruit-specific awakening; rare third-art potential | [Fruits](https://onepiece.fandom.com/wiki/Devil_Fruit), [Haki](https://onepiece.fandom.com/wiki/Haki) |
| My Hero Academia | Fixed gift, mastery and rare inheritance | Body fit and changed operating limits | [Quirks](https://myheroacademia.fandom.com/wiki/Quirk), [Inheritance](https://myheroacademia.fandom.com/wiki/One_For_All) |
| JoJo | Personal conceptual gift | Discover exact behavior; automatic forms differ | [Stands](https://jojowiki.com/Stand) |
| Fullmetal Alchemist | Craft knowledge graph | Material knowledge and usable catalyst | [Alchemy](https://fma.fandom.com/wiki/Alchemy) |
| Frieren | Accumulated study plus public research | New counters change an old spell's place | [Qual encounter](https://frieren.fandom.com/wiki/Episode_3) |
| Mob Psycho 100 | Gift plus emotional state | Release follows the strongest accumulated feeling | [Mob](https://en.wikipedia.org/wiki/Shigeo_Kageyama) |
| Demon Slayer | Derived schools | Body and weapon fit a new style | [Schools](https://kimetsu-no-yaiba.fandom.com/wiki/Breathing_Style), [Mitsuri](https://kimetsu-no-yaiba.fandom.com/wiki/Mitsuri_Kanroji) |
| Black Clover | Personal book plus partner route | Pact terms and synchronization are separate gates | [Devils](https://blackclover.fandom.com/wiki/Devil) |
| Dandadan | Hosted power and negotiated coexistence | Power custody differs from mind custody | [Turbo Granny](https://dandadan.fandom.com/wiki/Turbo_Granny) |
| Kagurabachi | Life-bound equipment credential | Custody alone does not grant technique authority | [Blades](https://kagurabachi.fandom.com/wiki/Enchanted_Blade) |
| Fire Force | Element facets and access types | Existing-fire control differs from creation | [Licensed guide](https://www.crunchyroll.com/id/news/guides/2025/3/26/fire-force-anime-guide) |
| World Trigger | Modular gear plus team tactics | Escape reserve competes with combat budget | [Triggers](https://worldtrigger.fandom.com/wiki/Trigger), [Escape](https://worldtrigger.fandom.com/wiki/Bail_Out) |
| Kaiju No. 8 | Gear compatibility plus alternate body | A reading measures a wearer/equipment pair | [Suits](https://kaiju-no-8.fandom.com/wiki/Defense_Force), [Kafka](https://kaiju-no-8.fandom.com/wiki/Kafka_Hibino) |
| Fate | Class vessel plus pact and supply | Finite authority, upkeep and agreement differ | [Commands](https://typemoon.fandom.com/wiki/Command_Spell), [Servants](https://typemoon.fandom.com/wiki/Servant) |

## Top 15 mechanics, ranked by what they add

Rank measures new decision space over the existing E8 to E8D sketches,
then breadth of reuse and evidence clarity. It is a design judgment,
not a popularity list or implementation order. All are **adapt proposals**.
The trial column is an observable future proof, not a check run here.
Costs are conceptual integration estimates against the incumbent schema.

| Rank/code | Mechanic and basis | Proposed take | Increment and cost | Future proof |
|---|---|---|---|---|
| 1 / P1 | Mechanism kinds, JJK/Nen | Classify limit before using vow slots. | High: prevents false breach/pricing logic; moderate schema work. | A failed activation spends no vow penalty; a real vow breach does. |
| 2 / P2 | Frozen creator meaning, Nen | Copies retain the original maker's predicates. | High: theft gains rules as well as effects; moderate knowledge/version work. | A real corpse fails, a constructed replica passes, even for the thief. |
| 3 / P3 | Interpretation growth, Undead Unluck | Insight can revise a concept's eligible objects. | High: growth changes use; needs explicit permitted transitions. | An insight opens one new target type and preserves old evidence. |
| 4 / P4 | Split carriers, Dandadan | Separate power, consciousness, host and container. | High: possession and storage become distinct; higher ownership cost. | Move a mind to a doll without moving the hosted power. |
| 5 / P5 | Custody versus credential, Kagurabachi | Stolen equipment can remain bound to a living owner. | High: protecting a former bearer matters; moderate item/bond work. | Thief carries the item but cannot run its locked effect. |
| 6 / P6 | Patron preference, Chainsaw Man | A grant's price can depend on what the patron wants. | Medium-high: extends E8D patron pricing; moderate relationship work. | Two people get distinct terms from the same patron without a global formula. |
| 7 / P7 | Escape reserves, World Trigger | Survival infrastructure consumes a build's usable budget. | High: safety has a specific carrier; higher body/anchor work. | Installed escape works in range; out-of-range deployment shows its limit. |
| 8 / P8 | Public counter history, Frieren | Research can make an old threat ordinary. | Medium-high: E8C already sketches spell history; moderate diffusion work. | New resistance gear blocks the old attack while another method still works. |
| 9 / P9 | Compatibility readings, Kaiju No. 8/MHA | Read a body/gear pair rather than label the whole person weak. | High: refines E7 observer truth; low-medium UI/data work. | One person gets a low suit reading and a strong alternate-body result. |
| 10 / P10 | Cooperative authority, Fate/Black Clover | Agreement and finite compulsion have different benefits. | Medium-high: pact partners keep agency; moderate action/relationship work. | Joint action succeeds where a broad coerced order has limited force. |
| 11 / P11 | Aura debt, Hunter x Hunter | Replace immediate damage with debt and repayment. | High: alternative win route; higher accounting/threshold cost. | Opponent hits repay debt; unpaid threshold temporarily seals power. |
| 12 / P12 | False release name, Bleach | A bonded item's disclosed name can expose only a partial form. | Medium: E8C already has releases; moderate secret/bond work. | A trusted spirit reveals the actual name and a distinct form. |
| 13 / P13 | Emotional payload, Mob/Fire Force | Borrowed energy can carry the sender's feeling. | Medium: links E3 mood to transfer; moderate provenance work. | Absorption changes recipient mood with a traceable source. |
| 14 / P14 | Parallel study carrier, Naruto | Clone knowledge returns with divided energy and accumulated fatigue. | Medium: E8B already has clones; high clock/memory accounting. | Two learners return two receipts and corresponding fatigue, no duplicate free work. |
| 15 / P15 | Safe recurring bargain, Dandadan | A hostile spirit can accept a named opponent and schedule. | Medium-high: promise improves daily life; low-medium schedule/relationship work. | The spirit respects other people and seeks the agreed sparring appointment. |

Existing fruit awakening, breathing schools, fire variants, emotion
thresholds and release stages remain useful. They are supporting choices,
not claimed as 15 entirely new discoveries. More case proposals, including
intent loopholes, material counters, ejection movement and owner-bound
traps, are in SERIES.json.

## Cross-series vow and contract designs

Slot summaries are mappings. A blank supernatural breach rule means
**unknown or not applicable**, not permission to invent one as canon.
Physical injury can be a real cost without any promise being made.

| Series | Bound party / object | Traded or gated | Breach or failure | Interpretation / collective rule |
|---|---|---|---|---|
| Chainsaw Man | Human and devil | Negotiated payment for patron effect | Reference says death on breach | Patron motive; intent matters in named protection case |
| JJK | Self or agreeing parties; birth body separate | Restriction, information, time or agreement | Self benefit loss; mutual penalty unknown | Game/domain rule authority differs from consent |
| Hunter x Hunter | Ability creator and target predicates | Setup, narrow use, commitment | Failed activation distinct from pledge penalty | Creator meaning can survive theft; no universal vote ledger |
| Undead Unluck | Bearer and world principle | Gift imposed; use depends on interpretation | Compulsory harm, not oath breach | UMA/world rules distinct from bearer's target rule |
| Bleach | Wielder and spirit | Communication/name/recognition | Refusal or partial release | Bond gate, not automatic exchange contract |
| Naruto | Body and chakra flow | Energy/control/limiter release | Exhaustion and injury | Anatomy not legal text; rank institutional |
| One Piece | Gift-bearing body | Acquisition and mastery | Water/sea-stone weakness, no oath breach | Fruit-specific counters and awakening |
| MHA | Gift and host | Compatibility and fine control | Strain; OFA host lifespan case | Licensing is social authority |
| JoJo | Automatic Stand and sole occupant | Trap condition | Escape metallizes occupant | User is also subject to rule; replacement releases |
| FMA | Material operation | Knowledge, input, catalyst | Failed operation/taboo toll | Hidden input is not a negotiated moral-value price |
| Frieren | Mage and spell knowledge | Study and execution | Error or depletion | Public counter knowledge changes feasibility |
| Mob | Sender, feeling and recipient | Restraint/release/loan | Overflow or loan fades | Moral restraint not proved a supernatural vow |
| Demon Slayer | Body, form and weapon | Training and breath control | Failure/injury | Style name not proof of elemental creation |
| Black Clover | Host and devil | Dominion or equal cooperation | Ritual defeat possession; breach unknown | Equal union needs joint control |
| Dandadan | Host/spirit; sparring partners | Power return or recurring duel | No general death penalty verified | Schedule/opponent promise; mind custody separate |
| Kagurabachi | Bearer and blade | Exclusive authority; innate route displaced | Death normally opens succession; named exceptions | Theft is not breach or succession |
| Fire Force | Body/fire/link | Capability access and mental feedback | Strain/feedback | Belief outlier contextual, not universal oath |
| World Trigger | Gear, body and anchor | Reserved trion and network access | Failed escape outside constraints | Match scoring governs lawful retreat |
| Kaiju No. 8 | Wearer and bio-gear | Compatibility and sustained output | Overheat | Institutional reading has a denominator |
| Fate | Master/Servant and ritual authority | Supply plus spent commands | Lost authority; hostility possible | Specificity and agreement matter; variants differ |

Each row's source IDs and claim status are in its corresponding SERIES.json
entry; full public links appear in the coverage table and SOURCES.md.

## E8D JJK audit: corrections to fold in

The JJK section is headed "structure, not a retelling." That allows
original takeaways, but the column claiming how the series works still
needs these qualifications. These are **proposed corrections**, not edits
to E8D or accepted design rules.

| Code | Current sketch | Readback / proposed correction | Evidence |
|---|---|---|---|
| J1 | Ratio as a vow kind | Ratio is innate. Keep Nanami's disclosure and overtime as separate vows. | [Ratio](https://jujutsu-kaisen.fandom.com/wiki/Ratio_Technique) |
| J2 | Chants as micro-vows | Chants/gestures belong to execution and subtraction; use vow classification only for a separately documented bargain. | [Technique craft](https://jujutsu-kaisen.fandom.com/wiki/Cursed_Technique) |
| J3 | Fatal one-shot technique as vow | Kashimo's effect inherently rebuilds and destroys his body. A one-use life-sacrifice vow remains an original option, not this example's proven kind. | [Mythical Beast Amber](https://jujutsu-kaisen.fandom.com/wiki/Mythical_Beast_Amber) |
| J4 | Mutual punishment can be anything | Exact punishment is unknown. Randomly drawing arbitrary penalties is an engine proposal, not a verified franchise procedure. | [Binding Vow](https://jujutsu-kaisen.fandom.com/wiki/Binding_Vow) |
| J5 | One generic breach economy | Separate ongoing self-restriction benefit loss from mutual unknown consequences. Do not treat an already-paid sacrifice as a refundable deposit. | [Binding Vow](https://jujutsu-kaisen.fandom.com/wiki/Binding_Vow); sacrifice policy is analyst caution |
| J6 | Heavenly Restriction as ordinary vow | Retain the involuntary birth distinction; no player quote, assent or easy release is implied. | [Birth restriction](https://jujutsu-kaisen.fandom.com/wiki/Heavenly_Restriction) |
| J7 | Open domain has no barrier | Say no closed trapping shell. Open domain craft still uses barrier techniques; escape buys area. | [Shrine](https://jujutsu-kaisen.fandom.com/wiki/Shrine), [domain encounters](https://jujutsu-kaisen.fandom.com/wiki/Sukuna/Synopsis) |
| J8 | Game rules imply collective consent | The ritual can entrap people. Rule-addition is governed by game conditions; not everyone bound consented to each rule. | [Culling Game](https://jujutsu-kaisen.fandom.com/wiki/Culling_Game) |
| J9 | Trial is a vow court | It is a domain/technique procedure with a disclosure vow, not a universal tribunal for oath breaches. Confiscation priority matters. | [Deadly Sentencing](https://jujutsu-kaisen.fandom.com/wiki/Deadly_Sentencing) |
| J10 | Worded loophole, exact terms unsure | Keep forgetting and one-minute control supported. Preserve later self-exclusion explanation as U until primary wording is checked; do not reduce interpretation to exact tag matching. | [Yuji synopsis](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori/Synopsis) |

Also qualify E8C's "universal trio": two Haki branches are broadly
learnable, but Supreme King potential is rare and innate. Stands are often
hidden and often share damage; automatic and object-bound exceptions
prevent a universal rule. Neither correction requires deleting an original
world where all three arts are learnable or every spirit shares damage.
[Haki](https://onepiece.fandom.com/wiki/Haki), [Stands](https://jojowiki.com/Stand).

## Proposed folds for E8 through E8D

| Code / owner | Proposed addition | Incumbent and required difference |
|---|---|---|
| D1 / E8 | Add relational metadata: effect owner, body host, authority holder, mind container and retained record. Add observer/source provenance to known axes. | Keep the ten axes; these links clarify carrier and reading, rather than add a mandatory eleventh axis. |
| D2 / E8B | Tag creation access separately from control access. Classify price as input consumed, body toll, reserve, ongoing supply, pledged sacrifice or social duty. | Families already cover these powers; improve interactions without a second catalog. |
| D3 / E8C | Keep capacity, skill, technique availability, compatibility and public grade separate. Allow growth to revise predicates or counter history. | Expand existing paths; no common XP currency or universal ceiling. |
| D4 / E8D | Add `mechanism_kind`, `term_owner`, `authority_carrier`, `resolution_order`, `penalty_knowledge`, and `cost_timing` where needed. | Most parties/scope/duration slots exist already. Exact matching is one possible interpreter, not every world's semantics. |
| D5 / E8D | Quotes can be approximate or unavailable; record what the player knows separately from enforceable terms. Rule changes need an authorized editor and explicit scope. | A transparent Village vow builder is a valid original prototype. It is not evidence that all source worlds expose prices or grant consent to victims. |

`mechanism_kind` candidates: `self_vow`, `mutual_contract`,
`activation_gate`, `innate_constraint`, `physical_cost`, `ritual_procedure`,
`institutional_rule`, `imposed_world_rule`. They are optional labels,
not a hierarchy. `cost_timing` distinguishes a paid fee, reserve held,
per-use cost, periodic duty, breach penalty and irreversible sacrifice.
`term_owner` preserves whose meanings apply after copying or transfer.

Keep the accepted possibility of cheap, harmless or drawback-free power.
These references show many priced systems; they do not prove everything
must have a hidden cost or that the taco joke must be denied. An original
literal-pricing or gag world can allow that deal openly. Source worlds
start with their own rules. [Accepted rulebook](../../../RULES_FROM_SCRATCH.md).

## Completion and limits

The research gate is the required 20 complete row sets, 15 ranked
mechanics, the 20-series contract comparison, JJK correction readback,
source ledger and durable checkpoint. JSON/source/link checks are recorded
in CHECKPOINT.md and VALIDATION.json. Gameplay verification does not apply.

Primary chapter verification, whole-series coverage and the optional 13
remain outside this bounded survey. The integrating GM can use the sourced
structure now, while remembered exact costs and newest-arc details stay
unverified. Shared E8 owners were not edited; proposals are ready to fold
in and are not accepted decisions.
