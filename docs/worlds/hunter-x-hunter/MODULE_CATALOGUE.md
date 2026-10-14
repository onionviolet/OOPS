# Hunter × Hunter module catalogue proposal

Status: proposal r1, 2026-10-14. All implementation mappings are P. Evidence links use the exact page title and revision; see [source ledger](SOURCE_LEDGER.md).

## P1. Master capability table

| Module ID | Family | Source anchor | Proposed stages / useful action | Dependencies and boundary |
|---|---|---|---|---|
| M-NEN-01 | Aura control | *Nen* r421055 | Notice → learn Ten → sustain → defend against exposed aura | Actual instruction and practice; basic defense is not invulnerability. |
| M-NEN-02 | Zetsu | *Nen* r421055 | Suppress aura signature → reduce fatigue → conceal within demonstrated limits | Closing nodes removes defense; not invisibility or safety. |
| M-NEN-03 | Ren | *Nen* r421055 | Increase output → hold under strain → shape intentional pressure | Costs reserve and can harm unprotected people; no free stat multiplier. |
| M-NEN-04 | Hatsu / personal ability | *Nen* r421055 | Discover method → test predicates → develop a personal technique | Ability identity, semantics and conditions are distinct from generic category skills. |
| M-NEN-05 | Gyo / In / En / Shu | *Nen* r421055 | Focus, conceal/reveal, sense, extend aura to an object | Each has its own scope, attention and counter. En is tiring; no global detection. |
| M-NEN-06 | Ko / Ken / Ryu | *Nen* r421055 | Concentrate, sustain broad defense, redistribute aura | Strong local defense leaves other areas exposed or uses costly output. |
| M-NEN-07 | Six affinity categories | *Nen* r421055 | Train own type and nearby types; separately gate Specialist ability use and creation | Affinities are approximate, not damage equations. The wiki states Specialist ability use is all-or-nothing and only Specialists create those abilities; no partial Specialist proficiency on an ordinary ladder. Possible later transition and other exceptions remain WIKI/OPEN pending primary review. |
| M-NEN-08 | Conditions / vows | *Nen* r421055 | Define one-time or continuous predicates; accept a restriction | A missed activation predicate differs from breaking a vow. The page gives loss of the affected ability and risk to Nen capacity as baseline breach consequences; additional penalties remain case-specific. No universal penalty calculator. |
| M-NEN-09 | Post-mortem / parasitic / collaborative effects | *Nen* r421055; *Nen Exorcism* r420724 | Author a bounded exception, support or counter | Case-specific; retain uncertainty and cost. Do not generalize from one named ability. |
| M-HUNT-01 | Exam and license | *Hunter Exam* r419181; *Hunter License* r405166 | Prepare → register → complete one variable exam → gain credential if passed | Two authored phases in the first slice are only a preview unless explicitly defined as an exceptional complete exam. A lost/stolen license is not replaced and a successful passer cannot retake, per the wiki. An otherwise unsuccessful candidate's phase-three pass is separately reported to grant following-year access; reconcile this with the license page in primary review. License, concealed Nen qualification, job eligibility, office and stars are distinct; no universal legal immunity. |
| M-ARENA-01 | Competitive training | *Heavens Arena* r417607 | Earn fees, recover, train, accept a match or withdraw where allowed | Source describes dangerous Nen exposure at high floors. No guaranteed safe progression. |
| M-GI-01 | Greed Island | *Greed Island* r411117 | Qualify, enter, collect/store/trade cards, pursue quests, exit | Body, death and exit rules need primary review and exact instance adapter. |
| M-ECO-01 | Creature ecology | *Chimera Ants* r419293; *World of Hunter × Hunter* r410311 | Survey species, habitat, behavior and resource risks | Species-specific biology; no universal monster-level ladder. |
| M-SOC-01 | Hunter Association | *Hunter Association* r419296 | Apply, qualify, take contracts, hold office by demonstrated service | Association services and actual local jurisdiction must remain separate. |
| M-SOC-02 | Research / archive / black market | *Hunter Association* r419296; *Mafia Community* r411637 | Gather reports, appraise, exchange leads or restrict disclosure | Information may be stale, paid, misclassified or private; no automatic omniscience. |
| M-SOC-03 | Care and exorcism | *Nen* r421055; *Hunter Association Exorcist* r420724 | Diagnose, stabilize or seek an eligible exorcist | Exorcism rarity, cost and transfer are not fully defined. Ordinary medicine cannot erase supernatural effects by default. |

## P2. Data model sketch

Proposed records: `ActorAuraState` (source, capacity estimate, reserve, output, fatigue, node state); `TrainingRecord` (teacher, method, practice, evidence); `AffinityProfile` (known/estimated/unknown); `PersonalAbility` (owner, category hypothesis, effect, allowed targets, trigger predicates, costs, counters, visibility, persistence); `RestrictionRecord` (voluntary choice, scope, stake, breach rule); `HunterCredential` (owner, status, issuer, privileges known, loss/sale history); `ExamScenario` (year, phase list, actual conditions, alternatives, expiry); `KnowledgeClaim` (observer, source, confidence, communicated-to); `WorldInstanceState` (local people, goods, routes, outcomes).

All fields are proposals, not current save keys. Preserve one authority per fact. A hypothesis about affinity must not overwrite the actual ability; observers may disagree. Any persistent change needs an explicit migration or compatibility decision before implementation.

## P3. Meaningful non-Nen and support modules

| Module | Useful without power | Proposed join |
|---|---|---|
| Route craft | Repairs transport, estimates weather and cargo | Opens an alternate route without winning a fight |
| Appraisal / literacy | Reads provenance and compares claims | Disputes an auction or map lead with evidence |
| Medicine / recovery | Treats ordinary injury and schedules care | Reduces downtime without reversing unsupported lasting damage |
| Research / field notes | Records observations with uncertainty | Improves a later decision if the note reaches that actor |
| Trade / logistics | Funds, supplies or carries another actor's work | Lets a provider contribute to an expedition without being its fighter |
| Team coordination | Assigns distinct tasks and contingency signals | Enables simultaneous operations only when actors and communication are real |

## P4. Coverage and unresolved detail

The notes include hundreds of character and item pages, but no complete primary-source catalog is claimed. Star ranks, techniques, special card effects, Nen ability exceptions, animal use, aura accounting and late manga status require scoped primary review before any exact numerical or universal rule is frozen. The source ledger owns conflicts and limits; this catalogue does not silently resolve them.
