# G3: lineages, inheritance and changed obligations

2026-10-14. **PROPOSAL ONLY.** Extend [root G3](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#g-the-social-web), [P5 D7 households](../p5/D7_HOUSEHOLDS.md) and [P14 legacy traces](../p14/CONTRACT.md). Ending, succession and temporal transformations stay with [P16](../P16.md), [succession by world](../../../../worlds/SUCCESSION_BY_WORLD.md), [timelines T4/T5](../../../../TIMELINES_AND_DIVERGENCE.md#implementation-planning-starts-histories-and-parallel-worlds-2026-10-11) and the existing life-experience owner. This lane supplies social transfer eligibility, provenance and reactions.

## G3.1: several kinds of descent

A lineage is a graph of qualified connections, not a surname or a global bloodline score. Biological descent, adoption, guardianship, chosen family, apprenticeship, office succession, school membership and spiritual continuity can overlap without being interchangeable. A person can reject an institution's claim about ancestry while still owning a bequeathed tool. Household residence does not prove parenthood. A parent's affection does not pass automatically to their child.

| Connection | What can be carried with a cause | What does not follow automatically |
|---|---|---|
| Parent/child | Genealogical identity, actual care, a qualified body trait, inherited titled goods | Personality, mastered techniques, the parent's friendships or legal debts |
| Adoptive/guardian | Care agreement, household access, bequest or recognized family standing | A biological faculty or every institution's acceptance |
| Teacher/student | Taught method/edition, practice history, credential issued by actual authority | Fuel, innate eligibility, teacher's full mastery, school ownership |
| School/sect | Membership, style provenance, stated duties and recognized reputation | Blood kinship, unconditional mutual trust or automatic canonical technique |
| Office/estate successor | Appointment/title under actual rules, transferred records/stock and defined obligations | Former holder's personal body, private memories or all their contracts |
| Prior-life/counterpart | Only selected source-supported memory, soul or carrier continuity | Shared custody, omniscient recognition or an unselected temporal merge |

Any first implementation uses original actors and law. Canon dynasty members, sole heirs, unique powers and plot-critical relationships remain authored/reserved under [P7 G1/G5/G9](../p7/GUIDELINES.md) and [P13 C5](../p13/RULES.md). A source-qualified inheritance or an explicit authored AU can create a different arrangement; generic random parentage cannot.

## G3.2: inheritance is a transaction and a communication event

Propose `LegacyTransfer` with origin person/life, recipient, source scope, actual carrier, object/obligation/teaching reference, authority/legal or supernatural rule, eligibility, terms, acceptance/dispute status, custody consequence, disclosure policy and cause receipt. P14 already proposes LegacyTrace; P19 adds the transfer reader's contract rather than storing a second trace. Future fields bind to its schema after root reconciliation.

Transfer stages: identify surviving carrier and available rights; determine the qualified recipient(s); reserve actual property or appointment; recheck support/terms; commit transfer and source-owner change atomically; send accounts through actual channels. A will can name a deceased or unavailable recipient and need its declared fallback, not a fresh invented child. Disputed heirs can split an estate or litigate where law allows. Partial acceptance, refusal, sale, donation, independent apprenticeship and ordinary unlinked starts remain reachable.

Death, retirement, departure and deliberate lifetime teaching can all initiate different transfers. No universal death/prestige trigger is assumed. Shares must total the actual estate inventory after debts and previous transfers. Unique objects retain identity; a student receives a manual copy or supported taught knowledge, not an extra copy of a unique source artifact. Equipment, money, land, appointment, body faculty and memory each use their own owner.

**F1 shown/SOURCE:** `src/chronicle.js:294-303` already creates a bounded heir/apprentice inheritance, predecessor recognition and selected grievance/archive duty. Therefore general inheritance is incomplete, rather than wholly absent. `src/npc_lives.js:12-20` supplies preauthored parent/spouse links but no estate resolver. `src/life_record.js:1,32-46` explicitly makes biography lossy and unsuitable as reward/quest/relationship authority. General lineages must read typed retained consequences, not parse old epitaphs.

## G3.3: grudges, debts and reputation have different carriers

| Payload | Actual carrier and transfer rule | Later play and counter-route |
|---|---|---|
| Grudge | A witness account, family teaching, institutional policy or supernatural mark; recipient separately adopts/rejects the grievance | Mediate, establish facts, make restitution, reconcile, avoid or oppose; a child can refuse the feud |
| Debt | A recorded obligation with actual creditor, debtor/estate, currency, amount, jurisdiction and inheritable-liability rule | Pay, contest, restructure, limit to estate assets, seek release or locally supported evasion; kinship alone creates no liability |
| Technique | Actual teacher, manual or qualified memory carrier plus supported method and learner prerequisites | Study, practice, hire a specialist, find another teacher or develop an alternative |
| Heirloom | Exact titled physical object, will/gift and custody transfer | Keep, lend, sell, recover, restore or donate; a story about a sword does not duplicate it |
| Reputation | Audience receives an attributed predecessor story and applies a local association rule | Benefit, distrust, expectation, mistaken recognition or indifference; personal regard can disagree with family reputation |
| Care duty | A qualified household/guardian agreement and willing capable caregiver | Share care, appoint help, contest authority, change residence or accept responsibility under local terms |

An inherited grudge is a new belief episode with source lineage, not a copied negative trust number. A debt changes legal/economic responsibility only under an authored rule; a coercive clan may demand payment without that demand being objectively valid. Creditor belief, enforceable claim, paid balance and public account remain separate. An audience must learn of the lineage or identity before reacting to it, unless an actual world power supplies recognition.

Reputation can arrive late, drift, be forged or be corrected under GOSSIP. A famous parent's child may inherit opportunity and pressure without innate aptitude. Positive legacies include gratitude, patron introductions, generosity traditions and practical manuals, not only revenge. Cruel/forgiving/institutional/honor-bound policies belong to the world and recipients. No global permanent feud, automatic debt forgiveness or compulsory inherited penalty is selected.

## G3.4: technique schools and long lives

Store teacher/method edition, what was actually learned, dated practice and any recognized school lineage. A style can be identified through witnessed technique or an issued credential; the observer does not gain the technique by naming the school. A student who outgrows a master keeps provenance while their current ability changes through real practice. Two teachers may transmit compatible pieces; branching schools retain shared history without creating duplicate mastery rewards. [P6 creative works](../p6/CREATIVE_WORKS.md) owns manuals/editions/copies; [P11 M4](../p11/MORE.md) owns teaching appointments; [live relationship owner BK19-BK22, section 14](../../../../worlds/world-depth-2026-10-13/29_RELATIONSHIP_PREREQUISITES.md) supplies related proposals, with its [dispatch addendum](../../relationship-prereqs-2026-10-14/CLAUDE_ADDENDUM_3.md) retained as history. P17 owns any source-specific power attributed to these bonds.

Cultivator lifespan gaps make ordinary care and student succession meaningful. Compute body exposure from the selected local clock, not player age or wall time. A master can live through several generations, maintain separate ties and choose different successors. During a supported skip, resolve scheduled transfers in causal order and retain significant episodes. A coarse recap cannot fabricate who taught which method if no cause was saved. Far-away family clocks stay under selected timeline policy; this packet enables no offline social aging.

## G3.5: branch, loop and identity boundaries

Fresh canon, a continued changed branch and a temporal reset have separate transfer manifests. [Intro LG1-LG9](../../../../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md#lg-rules-on-links) already distinguishes carrier/eligibility, fresh unlinked starts and shared-state lives. A branch fork remaps local actors and obligations; it cannot let the same owned heirloom settle both branches into the same shared external inventory without a declared duplication power. Memory of a legacy is distinct from possession of its object.

For a future loop, restore only designated body/stock/tie state and retain only authorized carriers. Learning a family's grievance in one cycle does not make them remember that conversation after reset. MoL's current visitor branch is continuous, per P9; no loop is inferred from its source inspiration. Past selves use ordinary NPC ties by default in a persistent instance and can be absent/nonexistent under the selected premise. They confer no privileged access to goods, trust or debts.

## G3.6: first proof and gates, all OPEN

Proposal: an original repairer retires and explicitly transfers one real manual/tool to an existing eligible apprentice. A customer carries a gratitude account to that apprentice, while a creditor presents a separately attributed disputed claim. The apprentice can accept the gift without automatically accepting the alleged debt. Supported study changes a real work method; custody and recognition change through receipts. This proves a living teaching lineage without waiting years for childbirth/death.

**A1** SOURCE: no ancestry cycles, no inconsistent parent/guardian ages, compatible reciprocal kinship records, qualified succession and correct shares; inherited reputation needs recognition. **A2** NATIVE: actual transfer/study/changed job, witnessed gratitude and reachable dispute route. **A3** PERSISTENCE: pending estate/teaching and post-transfer custody, recipient identity, accepted/refused claims, knowledge and next draws survive Save/reload/Export/literal-file Import. **A4** FAILURE/RETENTION: deceased claimant, missing carrier/pack, unsupported revision, duplicate delivery and failed write cannot mint goods or resurrect ties; compacted history retains active obligations. **A5** WORLD/UX: canon reservations, branch isolation and separately qualified temporal carriers; readable family/teaching connections at 1366x768 and 1600x1000 with undiscovered relations absent. Human family/legacy fiction remains open.
