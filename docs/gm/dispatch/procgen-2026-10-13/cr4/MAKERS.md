# Maker identity and recipe lineages

2026-10-14. **PROPOSAL ONLY.** Extends root MK1-MK6 and KN1-KN4 in the [crafting palette](../../../../PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md). P6 owns [manuals and editions](../p6/CREATIVE_WORKS.md), [invention](../p6/TECHNIQUE_INVENTION.md) and [schools as production routines](../p6/MORE.md); P11 owns [appointments and apprenticeship](../p11/MORE.md); P19 owns [social lineage](../p19/LINEAGE.md). CR4 adds recognition, attribution and recipe transmission readers, not competing owners.

## MK1: style emerges from work

MK1.1: Derive the player's style from committed creation receipts: processes actually used, ingredient roles selected, precision choices, finish/shape, and repeatability in comparable tasks. NPCs can start with a saved original school/habit profile, but their subsequent work updates demonstrated style. A taste for boiling is a preference, not an automatic potency multiplier. A signature has mechanical value only where a process or consumer reads it.

MK1.2: Keep preference, practiced competence and observer recognition separate. A maker who attempts a technique often need not be good at it. An expert who has examined several products can infer a likely maker with an attributed basis and uncertainty; a novice can recognize a visible mark without recognizing the technique. Counterfeits, collaborative work and changing methods can contradict the attribution. Identification cannot expose a sealed identity through a style label.

MK1.3: Let styles overlap and evolve. Two schools may both favor low heat; neither owns that physical operation. The player can learn both, blend them, return to an older style, outsource a step or deliberately conceal a signature. No permanent exclusive specialization choice. New receipts can revise a profile; rewriting its displayed nickname cannot rewrite its history.

First useful consumer: a buyer recognizes consistent known finish or dose behavior and offers a matching commission. The recognition record cites inspected work, not the hero's hidden crafting history.

## MK2: marks are claims; provenance is evidence

MK2.1: A physical stamp, embossed vial seal, signed label or magical seal is an object feature produced by a supported operation. It asserts maker/brand/edition. Actual production receipt records contributing actors and steps. An authentic seal may require a local key, issuer or source; ordinary engraving is copyable. The marks law, not the UI icon, decides how forgery works.

MK2.2: Store maker, assistant, designer, refiner, bottler, repairer and seller roles where relevant. Shared credit does not duplicate output. A school brand and an individual maker may both be credited. Brand reputation is scoped by product line, audience, place and knowledge: someone trusted for tools is not automatically a trusted healer.

MK2.3: Product truth, made batch and mutable object have different identities. P2's current canonical key has no maker field (branch `src/mixture_state.js:61-74`). If buyers query maker, two identical chemical vials from different makers need retained lot provenance in an admitted holder adapter, even if the UI groups them. Do not append decorative JSON to keys and assume all native decoders preserve it. Retain revision-1 P2 keys; root chooses an explicit compatible extension.

## MK3: exceptional work uses saved draws

MK3.1: Define what a masterwork improves before rolling: supported precision, recovery yield, durability under an enabled law, presentation or an exceptional local effect. Skill and apparatus establish eligibility; identical deterministic chemistry does not acquire unrelated powers because the quality draw is lucky. P2 currently has deterministic resolution and no execution-quality draw (`mixture_state.js:47-62`). This is a proposed addition.

MK3.2: Admit the actual job, reserve means, stage one named saved creation draw for that occurrence, resolve its result and durably publish draw advancement with output and receipts. Preview, rejected admission, reload, naming and inspection spend no draw. If a draw occurs at a later real process boundary instead, save that boundary and draw atomically. Cancellation after a consumed boundary preserves the consumed state and lawful partial output; it never rewinds the stream. Root/P1 owns the actual API.

MK3.3: A masterwork may be named, sold, lent, gifted, copied as a design or repaired. A name grants no stats. No fixed lifetime masterwork allowance: plentiful, exacting, volatile or miraculous world adjectives determine attainable frequency and exceptional laws. Exceptional work can be common in a powerful maker's workshop.

## MK4-MK6: schools, secrecy and specification commissions

| Extension | Concrete design | First useful evidence |
|---|---|---|
| MK4.1 school access | Teach supported process ranges, equipment use, assay protocols and characteristic habits. Apprenticeship, self-study, paid service and independent experimentation can coexist. A manual does not confer a missing magical faculty. | Student uses their own means and learned edition to make a supported product; switching schools preserves earned knowledge. |
| MK4.2 mixed expertise | Several disciplines can contribute real steps to one job. Herbalist supplies prepared stock; bottler supplies fitted vessel; alchemist resolves the batch. | Contribution receipts and actual debits explain quality and credit without granting everyone the same skill. |
| MK5.1 disclosure | Distinguish knowledge of a method, possession of a notebook, contractual copying permission and institutional exclusivity. Trade, teach, conceal, independently discover, reverse-engineer or steal through supported world actions. | An assay reveals only measured properties; an observer may reproduce behavior without discovering the original formula. |
| MK5.2 protection | Ordinary secrecy, coded notes, supply control, magical seals and open publication are selectable local strategies. Their stated claims and actual effectiveness can differ. | Leakage travels through P11/P19 contact; copied information supplies no stock, source or mastery. |
| MK6.1 acceptance | Bind real recipient/body/context and measurable target ranges, exclusions, quantity, route, deadline clock, evidence protocol and funded reward. Accept any supported product satisfying the predicate, including purchased goods or a hired maker's output. | Two different recipes pass one spec; a famous marked product failing the actual spec does not pass. |
| MK6.2 negotiation | Separate hard constraints, soft preferences and requester beliefs. A disputed or outdated need can be investigated. Negotiate dose, quantity, timing, evidence or alternative help before committing. | Terms freeze at admission. Partial delivery and changed need use declared settlement, never a hidden reroll. |

The root exam-awake/no-bitterness example exceeds P2's current consumers: it has no taste property, awake target or recipient-body adapter. Start with declared P2 dose ranges and process preferences, then admit taste/body fields only with real consumers from CR1/CR2. Do not rename stamina regeneration as proven wakefulness.

## KN1-KN4: flawed knowledge has an executable edition

KN1.1: A recipe edition holds typed instructions, quantities/units, source claims, apparatus assumptions, translation/version and known omissions. Its physical copy is P6's object. Author truth records why an edition differs only if needed; player knowledge retains evidence. Following written steps resolves those actual steps. Unknown-to-player physics operates; an undefined required operator is unsupported model data and must reject before spending, not masquerade as a mystery.

KN1.2: A contradictory book need not be malicious. It can use a different regional ingredient, older apparatus, different serving size, missing page, mistranslated unit or purposeful sabotage. Keep these hypotheses separate until evidence distinguishes them. Retain both accounts with locators and scope. Correcting a book creates a new edition, leaving prior manufactured products and receipts under their original law.

KN2.1: Folk remedies have claims linked to a symptom/body/route. A test can show benefit, no detected effect or an inconclusive result without identifying every fraction. Correlated recovery is weaker than a controlled causal observation. If belief itself changes outcomes in a selected world, that is an explicit CR2 law with its own payer/consumer, never a universal rescue of incorrect instructions.

KN3.1: Partial recipes generate answerable research hooks. A missing step is a knowledge gap with several routes: compare editions, interview a practitioner, measure a sample, test alternatives, buy a completed product or commission expertise. A promised reachable method has a feasibility witness. Deliberately lost historical recipes remain labeled historical, not falsely offered as currently solvable.

KN4.1: Teaching creates a child edition connected to exact parent editions and demonstrated lessons. Drift may omit a step, add a local substitute or improve a tested method; save the actual change and transmission cause. It need not be a random degradation penalty. Several independent inventions can converge. A merge retains multiple parent/source references and contradictions rather than inventing one authoritative ancestor.

KN4.2: Source lineage matters: three notebooks copied from one erroneous ancestor are one evidential origin. A student learns instructions; their practice establishes execution skill. A school credential establishes recognition only through its issuer. Public dissemination changes who can attempt a method, while materials and station access can still limit production.

## Attributed boundary and future gates

STATED, inherited dossier evidence: [P6 K4](../p6/CANON_LOCATORS.md) and private HP craft evidence CCF14 locate Half-Blood Prince ch9, PDF3070-3073/TXT6472-6573. SHOWN as classified by that dossier: an annotated preparation changes observed cues and receives a favorable classroom judgment. The printed method also receives approval; the winning attempt is not established there as a completed patient-tested potion. INFERRED: the episode supports testing editions and scoped judging, not universal superiority of a metal tool, all marginal notes or a completed cure. CR4 checked the dossier locator, not the novel afresh. All numeric/design rules here are original proposals. No private prose is reproduced.

OPEN: attributable lot reconstruction across carried/stored/vendor/held goods, knowledge-safe recognition, same-origin evidence handling, two valid commission solutions, forged-mark disputes, saved masterwork draw, failed-write purity, legacy continuity and native Save/reload/literal-file Import. [REPORT](REPORT.md) owns the selected future slice gates.
