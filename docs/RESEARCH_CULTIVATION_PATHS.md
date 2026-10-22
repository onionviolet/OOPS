# Cultivation paths: earned entry, distinct methods and bounded power

Research date: 2026-09-30, America/New_York. Research and design proposals only. No gameplay changes, save access, commits or integration.

**Recommendation:** let ordinary adventure reveal cultivation, then make the first method a choice of practice and access rather than a compulsory character-wide multiplier. Begin with a manual/mentor expedition; keep Jade Hollow available as the existing review prototype. A martial adventurer, medicinal artisan and researcher should each have a useful route before and after spiritual initiation.

## Scope and evidence rules

Read `AGENTS.md`, `PROJECT.md`, `docs/EXPANSION_DESIGN.md` and `docs/REFERENCE_RESEARCH.md`, and inspected Git status before writing. The checkout already contains dirty source, generated bundles and untracked prototype/documentation files. Only this new dossier is owned by this research lane. Source reads sampled `src/items.js` (`BookData`), `src/quests.js`, `src/conditions.js`, `src/skills.js` and `src/cultivation.js`; they establish integration opportunities, not a browser-tested implementation of these proposals.

Evidence labels throughout:

- **Text:** events or explanations in the linked published chapter. A character's explanation may be incomplete or self-interested; it is not automatically an omniscient rule.
- **Publisher:** synopsis, introduction or editorial recognition. This supports framing, not unmentioned detailed lore.
- **Interpretation:** a design lesson inferred from the evidence.
- **Proposal:** an original mechanic for this fork. Names, gates, costs and retention are not canonical adaptations or accepted decisions.
- **Gap:** not established in the consulted material. Absence in this sample does not establish absence from the novel.

Primary evidence is publicly accessible published English chapters on Wuxiaworld and official publisher material for Jin Yong. Original Chinese editions were not collated against the translations. No private reading list, library catalog or novel text is reproduced. The parent lane reported a local Lord of the Mysteries EPUB; its detailed examination belongs to the alternative-power lane and was not duplicated here. Catalog presence would not establish a favorite or textual authority.

### Selection and acclaim boundary

Seven contrasting works are selected below. **A Hero Born** has explicit editorial recognition: its [publisher page](https://www.hachette.co.uk/titles/jin-yong/a-hero-born/9781529432671/) identifies inclusion in TIME's 100 best fantasy novels. This is critical/editorial recognition, distinct from the publisher's sales claims. The other six are mechanic-focused reference candidates with accessible chapters; this dossier does **not** claim that each is award-winning, critically acclaimed or part of a universal top list. Wuxiaworld's [own history](https://www.wuxiaworld.com/page/about) specifically identifies I Shall Seal the Heavens among modern works in its translation tradition; that establishes platform recognition, not a measured ranking. A deeper reception audit remains a gap, rather than a pretext to invent acclaim.

## Genre distinctions are design boundaries, not realm templates

The [Wuxiaworld glossary](https://www.wuxiaworld.com/page/general-glossary-of-terms) frames wuxia around martial heroes and internal training, xianxia around immortality and Chinese religious/mythic elements, and xuanhuan as a broader fantasy mixture. It is a publisher-hosted glossary, not a primary novel or a universal classification test. Treat these as working descriptions with porous boundaries.

**Proposal:** distinguish worlds by what mastery changes. A wuxia-like frontier can deepen stances, footwork, schools, loyalties and reputation without ever granting ascension. An immortality-oriented world can change bodily limits, resource dependence and access to higher environments. A mixed fantasy world can use its own energy and profession rules. Neither a Chinese name nor an XP bar is sufficient to make those worlds mechanically distinct.

The consulted systems already disagree: Myriad Races uses academy-led physical and willpower routes; Desolate Era distinguishes ki and Fiendgod body practice; Battle Through the Heavens uses Dou Qi and specific alchemical qualifications. These observations are supported by the chapter cases below. Do not rename all three into an identical qi/body/soul ladder.

## Eighteen trope and mechanic families

The middle column is a narrow textual anchor, not a claim that every novel uses the trope. The final column contains **original proposed mechanics**. A trope is a recognizable fiction pattern; its game mechanic must produce a choice, feedback and a bounded consequence.

| Family | Evidence anchor | Proposed playable expression |
|---|---|---|
| 1. Martial apprenticeship | RMJI [1](https://www.wuxiaworld.com/novel/rmji/rmji-chapter-1): sect entry through a relative | Dialogue lead and service contract unlock a school; a public expedition provides an alternative to sponsorship. |
| 2. Manual secrecy | RMJI [6](https://www.wuxiaworld.com/novel/rmji/rmji-chapter-6): restricted chant | Separate permission to study from permission to teach; do not make theft the sole efficient route. |
| 3. Understanding versus execution | BTTH [15](https://www.wuxiaworld.com/novel/battle-through-the-heavens/btth-chapter-15): understood technique exceeds usable energy | Journal shows acquired, understood, practiced and usable as separate states. |
| 4. Internal circulation | RMJI [7](https://www.wuxiaworld.com/novel/rmji/rmji-chapter-7): circulation has bodily limits | Safe practice has a visible cap; optional overexertion previews fatigue and stops automatically. |
| 5. Body transformation | DE [6](https://www.wuxiaworld.com/novel/desolate-era/de-book-1-chapter-6): body and ki are distinct methods | Weightlifting and stance drills unlock resistance or recovery utility, not mandatory parallel qi spending. |
| 6. Mental cultivation | TMR [9](https://www.wuxiaworld.com/novel/tribulation-of-myriad-races/tmr-chapter-9): language study and willpower | Research contributes to a different readiness condition; avoid reducing it to weaker melee. |
| 7. Soul perception | BTTH [6](https://www.wuxiaworld.com/novel/battle-through-the-heavens/btth-chapter-6): refining requires perception | Perception improves process control; it is not automatically a new universal damage stat. |
| 8. Comprehension tests | RMJI [7](https://www.wuxiaworld.com/novel/rmji/rmji-chapter-7): chant layer examined | Demonstrate one principle in a trial or route interaction; timer fills prepare the attempt rather than prove understanding. |
| 9. Foundations and shortcuts | DE [7](https://www.wuxiaworld.com/novel/desolate-era/de-book-1-chapter-7): methods differ in foundation and difficulty | Choose quick readiness with a repairable drawback or slower stable readiness. Expose the later cost. |
| 10. Bottlenecks | BTTH [6](https://www.wuxiaworld.com/novel/battle-through-the-heavens/btth-chapter-6): compression can fail | Requirements plus preparation replace repeated blind rolls; failure unlocks a specific remedy. |
| 11. Medicinal aids | BTTH [15](https://www.wuxiaworld.com/novel/battle-through-the-heavens/btth-chapter-15): training liquid depletes | Cooking supports sustain; Alchemy supplies specialized preparations; buying or commissioning remains viable. |
| 12. Pill backlash | RMJI [21](https://www.wuxiaworld.com/novel/rmji/rmji-chapter-21): medicine mitigates pain | Optional combat stimulant produces explicit fatigue; recovery medicine does not silently erase every underlying cost. |
| 13. Sect and clan allocation | RMJI [5](https://www.wuxiaworld.com/novel/rmji/rmji-chapter-5): unequal teaching access | Reputation unlocks facilities and commissions, with bounded obligations rather than endless daily chores. |
| 14. Merit economies | TMR [10](https://www.wuxiaworld.com/novel/tribulation-of-myriad-races/tmr-chapter-10): merit differs from money | One local service credit buys instruction; avoid adding currencies without a distinct spending decision. |
| 15. Formations | DE [6](https://www.wuxiaworld.com/novel/desolate-era/de-book-1-chapter-6): formations among ki capabilities | Prepare a site effect with limited charges and material upkeep. Exact formation lore remains unsampled. |
| 16. Artifacts and equipment | ISSTH [1](https://www.wuxiaworld.com/novel/i-shall-seal-the-heavens/issth-book-1-chapter-1): item enables earlier flight | Equipment opens a traversal exception at a cost; acquiring it does not grant the corresponding bodily advancement. |
| 17. Tribulation and ascension | DE [6](https://www.wuxiaworld.com/novel/desolate-era/de-book-1-chapter-6): tribulation and celestial transition | A forecast encounter changes environment access. Do not treat every ordinary breakthrough as a lightning boss. |
| 18. Reincarnation exceptions | DE [2](https://www.wuxiaworld.com/novel/desolate-era/de-book-1-chapter-2): disrupted forgetting | A declared legacy rule can be a world-specific exception; it does not prove routine voluntary prestige exists in the source. |

## Chapter-level cases and contrasting works

### 1. A Record of a Mortal's Journey to Immortality: ordinary opportunity before spiritual identity

**Text:** [chapter 1](https://www.wuxiaworld.com/novel/rmji/rmji-chapter-1) gives Han Li a family-mediated sect examination and describes instruction, support and allowances. [Chapter 5](https://www.wuxiaworld.com/novel/rmji/rmji-chapter-5) gives unsuccessful but persistent candidates a provisional route; Doctor Mo recruits herb/alchemy help. Other disciples describe preferential access through connections.

**Text:** [chapter 6](https://www.wuxiaworld.com/novel/rmji/rmji-chapter-6) combines medicinal training, literacy, anatomical study and a confidential chant. Mo initially presents it as strengthening rather than direct combat instruction. [Chapter 7](https://www.wuxiaworld.com/novel/rmji/rmji-chapter-7) shows slow, uneven results, limited guidance and harmful overextension. Han Li's method does not initially behave like the martial energy his peers use. [Chapter 21](https://www.wuxiaworld.com/novel/rmji/rmji-chapter-21) shows pill backlash and a medicinal favor creating a relationship, without establishing a universal pill-toxicity system.

**Interpretation:** an entry sequence can make ordinary skills causally important before the player recognizes a supernatural path. Teacher access, reliable guidance and usable knowledge should be different benefits. A medical specialist can earn influence through recovery rather than defeating every opponent.

**Proposal:** a frontier healer commissions herbs; restoring an anatomy text or completing a rescue earns a guided practice session. The first reward is a useful recovery or perception technique. Spiritual initiation remains an optional later branch.

**Gap:** detailed spiritual-root classifications, bottle/herb acceleration, higher-level pill recipes and later realm transitions were not audited here. The bounded constitution addendum verifies only specific root/access observations. Early Doctor Mo scenes are not evidence that every teacher is trustworthy or that the entire novel is a medical progression game.

### 2. Tribulation of Myriad Races: institution, original texts and delayed payoff

**Text:** [chapter 9](https://www.wuxiaworld.com/novel/tribulation-of-myriad-races/tmr-chapter-9) describes physical-first and willpower-first approaches. Liu Wenyan links language study to willpower and describes greater resource demands, a vulnerable early period and rapid bodily advancement after sufficient mental preparation. Forced battlefield advancement can damage foundations.

**Text:** [chapter 10](https://www.wuxiaworld.com/novel/tribulation-of-myriad-races/tmr-chapter-10) distinguishes ordinary study materials from powerful original texts, warns of mental danger and links access to academies. The principal questions Liu's recruitment pitch. Merit points have uses beyond cash; Su Yu's unusual book activates a temporary method using blood essence and interacts with ambient source qi.

**Interpretation:** research is a power route, not automatically a noncombat profession. A long preparation period needs useful interim rewards and transparent readiness. A teacher's sales pitch is not proof that one route is objectively superior for everyone.

**Proposal:** use safe copied notes for foundational Literacy progress, then an optional supervised original inscription trial. Ready characters choose a martial application or analytical counter, both relevant to combat and exploration. The strange book is an exceptional protagonist device, so do not grant every player a universal ability-copying engine by default.

**Gap:** exact character/rune mechanics, acupoint networks and late-series systems need further chapter research. This sample does not equate willpower with a universal soul realm or establish global cross-world energy conversion.

### 3. Desolate Era: accessible excellence, difficult practice and separate bodily methods

**Text:** [book 1, chapter 6](https://www.wuxiaworld.com/novel/desolate-era/de-book-1-chapter-6) explains ki and Fiendgod body routes with different capabilities and risks. Ning proposes progressing both, selecting a primary strength later. The father's account separates early bodily/foundation transitions from later tribulations and celestial status.

**Text:** [book 1, chapter 7](https://www.wuxiaworld.com/novel/desolate-era/de-book-1-chapter-7) contrasts painful quick methods, a slow survival-oriented method and Crimsonbright. The latter is presented as powerful, widespread and easily obtained, yet exceptionally difficult to practice. Other manuals have different ceilings. [Book 1, chapter 2](https://www.wuxiaworld.com/novel/desolate-era/de-book-1-chapter-2) depicts an interrupted reincarnation process with a forgetting ritual, not a repeatable player-controlled reset.

**Interpretation:** scarcity need not mean a rare book drop. The challenge can be safely executing a public method. Manual ceiling, acquisition difficulty, practice difficulty and eventual strength are independent dimensions. Source statements of same-tier dominance are fiction rules, not a requirement to balance the game identically.

**Proposal:** offer a public method with several practice problems and a service-earned mentor shortcut. Body specialization buys environmental resistance or recovery; energy specialization buys charged techniques and tool use. Limit training commitments rather than requiring permanent, irreversible early exclusion.

**Gap:** detailed Dao comprehension, tribulation encounters, higher-stage methods and artifact binding have not been examined. The listed stages should not become the fork's canonical realm roster.

### 4. Battle Through the Heavens: profession qualifications, consumable supply and usable techniques

**Text:** [chapter 1](https://www.wuxiaworld.com/novel/battle-through-the-heavens/btth-chapter-1) ties public strength testing to clan treatment and shows lost progress. [Chapter 6](https://www.wuxiaworld.com/novel/battle-through-the-heavens/btth-chapter-6) describes failed energy compression and a preparation that assures success; alchemy requires particular attributes, strong soul perception, materials and suitable flame. [Chapter 9](https://www.wuxiaworld.com/novel/battle-through-the-heavens/btth-chapter-9) adds a teacher and prior Dou Zhe/fire-method requirements before alchemy practice.

**Text:** [chapter 11](https://www.wuxiaworld.com/novel/battle-through-the-heavens/btth-chapter-11) makes monster cores useful in pills and equipment, unsafe to absorb directly, valuable and not guaranteed drops. [Chapter 15](https://www.wuxiaworld.com/novel/battle-through-the-heavens/btth-chapter-15) shows depleting medicinal training liquid and a learned technique with limited practical power because of insufficient energy.

**Interpretation:** preparation can change risk rather than merely increase XP. A profession can have identity without every character practicing it. A rare component shared by equipment and medicine creates an allocation choice, but a novel's unlucky hunt is poor justification for a dead-end game gate.

**Proposal:** allow artisans to craft a stabilization item, warriors to earn a commission voucher, and explorers to secure an alternate reagent. Supply a guaranteed first-entry component after a disclosed number of authored objectives. Preserve the optional excitement of a lucky drop as acceleration.

**Gap:** later soul advancement and unusual-flame acquisition remain unverified. Do not impose a randomly assigned, immutable fire/wood birth qualification on this fork's existing Alchemy skill.

### 5. Renegade Immortal: selection institutions have alternate doors

**Text:** [chapter 2](https://www.wuxiaworld.com/novel/renegade-immortal/rge-chapter-2) places candidates in a family recommendation process. [Chapter 3](https://www.wuxiaworld.com/novel/renegade-immortal/rge-chapter-3) depicts talent testing, Wang Hao gaining alchemy-helper access after presenting a valuable herb, and a further perseverance examination for rejected candidates. Rescue is explicitly available during that test. The chapter does not establish that Wang Lin ultimately passes it.

**Interpretation:** social access is a contested institution, not a single universal talent score. An examination, service role and material contribution can lead to different arrangements. A playable recovery route should be authored rather than relying on protagonist luck.

**Proposal:** failed initiation opens a named mentor remedy, supplier contract or expedition clue. Preserve progress toward those remedies. Permit retreat from the trial; do not turn rejection into deleting a build.

**Gap:** later intent/domain, soul and cultivation rules are outside this sampled opening. The herb exchange is not evidence of a universal purchasable admission system.

### 6. I Shall Seal the Heavens: contact is not consent, and artifacts can bypass one threshold

**Text:** [chapter 1](https://www.wuxiaworld.com/novel/i-shall-seal-the-heavens/issth-book-1-chapter-1) starts Meng Hao in ordinary scholarly poverty. Attempting a rescue leads to forced sect recruitment into servant quarters. A sect-bestowed Wind Pennant permits flight before Foundation Establishment.

**Interpretation:** a good acquisition scene can connect everyday problems to an unfamiliar power institution, but being taken to a sect is not the same as voluntarily choosing a path. Equipment access can precede bodily advancement without granting all its benefits.

**Proposal:** an ordinary rescue introduces a traveler and a school; let the player accept training, negotiate a service arrangement or keep adventuring. A borrowed traversal artifact spends charges and has a return obligation. Avoid using a compulsory kidnapping as the entire campaign's onboarding unless Weibao explicitly chooses that story.

**Gap:** later alchemy, perfect foundations, sealing and ascension rules were not audited. This chapter cannot substantiate them.

### 7. A Hero Born / Legends of the Condor Heroes: martial heroism without an assumed immortality endgame

**Publisher/text:** the [official Macmillan edition](https://us.macmillan.com/books/9781250220622/aheroborn/) includes Anna Holmwood's introduction and the opening of chapter one. The introduction frames martial heroes, social outsiders and honor; the synopsis names Guo Jing's teachers. The chapter excerpt grounds initial information gathering in a traveling storyteller and tavern conversation. It does not expose a full technique progression system.

**Interpretation:** ordinary locations, rumors, loyalties and teachers can carry martial progression. “Power path” need not mean immortal ascension. This supplies the strongest counterweight here to designing the entire frontier as a waiting room for qi.

**Proposal:** a school teaches stance counters and route utility through practice and reputation. Its capstone is competence in a local conflict, with an optional later supernatural lead. A martial career remains useful even if the player declines that lead.

**Gap:** no specific Nine Yin, internal-energy, poison or manual rule is asserted from this short excerpt. A full chapter-level technique case needs a longer authorized excerpt or an available edition. The static promotional page returned 403; the ordinary Macmillan book page supplied the usable substitute.

## Lifecycle mapping without filling unknown lore with guesses

This table normalizes the **consulted evidence only**. Detailed claims and links are in the cases above. “Unspecified” is an evidence gap, not a rule that the system lacks the feature.

| Work | Acquisition and social access | Prerequisites and practice | Resources and advancement | Costs, failure and recovery |
|---|---|---|---|---|
| RMJI | Relative, sect exam, provisional medicinal apprenticeship | Literacy/anatomy instruction and chant practice | Time, instruction, medicine; chant examination | Slow/inconsistent results, circulation limits; outer-role fallback is offered |
| TMR | Teacher and academy access | Language/text study; physical or willpower ordering | Resources, institutional texts, merit; mental preparation can precede bodily advance | Early vulnerability, dangerous texts, damaged foundations; general repair unspecified |
| DE | Clan books and parental instruction; public difficult method | Method-specific body or ki practice | Manuals with differing ceilings; early transitions distinct from tribulations | Difficulty/foundation tradeoffs, later lethal trial in father's account; general repair unspecified |
| BTTH | Clan/mentor and technique materials | Energy sufficient for execution; refining qualifications | Energy, medicinal liquid, herbs, cores; compression transition | Compression setback; guaranteed preparation described; energy limits technique utility |
| Renegade Immortal | Recommendation, testing, herb-assisted helper role | Talent or perseverance trial | Valuable herb and instruction access; subsequent ladder unsampled | Rejection and timed test; rescue provision, final admission outcome unsampled |
| ISSTH | Forced contact and servant assignment; bestowed artifact | Flight exception tied to artifact | Equipment and bodily threshold distinguished; broader practice unsampled | Loss of agency at entry; broader failure/recovery unsampled |
| A Hero Born | Named teachers in synopsis; rumors in opening excerpt | Kung fu tutelage framed by publisher | Detailed resource/advancement rules unsampled | Social/political stakes established; precise technique recovery unsampled |

| Retention, reset or compatibility question | What the evidence permits | Original proposal for YAIRPG |
|---|---|---|
| Are breakthroughs prestige resets? | No sampled chapter establishes that equivalence. | Breakthrough changes capabilities; voluntary rebirth remains a separate confirmed action. |
| Is reincarnation automatic knowledge retention? | DE's opening distinguishes forgetting from an exceptional interrupted process. Other sampled works do not establish reusable reset contracts. | Explicitly retain selected knowledge through a declared legacy rule, without claiming genre universality. |
| Does a stronger body preserve everything abroad? | Cross-setting comparisons between separate novels have no shared canon. | Ordinary trained skill transfers; extraordinary bodily effects need per-world compatibility. |
| Can every energy power every technique? | TMR demonstrates ambient-energy dependence; no sampled work validates universal inter-novel conversion. | Tag techniques with energy type and environment; conversions need adapters, losses and visible limits. |
| Do relationships and permissions travel? | Institutions are specific to their settings. Global permission is unsupported. | Remember faction history while keeping local standing and facility permission local. |
| Can artifacts substitute for advancement? | ISSTH supports one specific traversal exception, not wholesale replacement. | Item grants the named action only; charge, maintenance or expedition constraints bound it. |

## Five proposed playable loops

Everything in this section is **original invention awaiting creative review**, not implemented gameplay. These are increments or alternatives, not a demand to ship five systems at once. Loop 1 is the recommended next slice; loops 2–4 test different path identities; loop 5 is a later encounter conversion.

### 1. The lost route and the first method

**Loop:** Village rumor → expedition clue → practical obstacle → damaged manual → mentor or restoration → practice → useful application → optional spiritual invitation.

**Choice:** a combat build escorts the expedition and earns instruction; a craft/exploration build repairs equipment or supplies medicine and earns the same first opportunity. Use existing dialogue/reputation, quests, books and conditions. The common introductory method could teach controlled breathing with a small combat recovery or environmental benefit. The cultivation invitation follows that demonstrated use, so owning a book does not instantly activate qi.

**Cost/limit:** committed travel/activity time, ordinary supplies and one preparation choice. A guaranteed quest reward opens entry; RNG loot can shorten restoration. Declining initiation keeps the ordinary technique and a next martial-school lead.

**Idle/readability:** routine reading/practice can tick automatically while safe; discovery, route choice and invitation are explicit. The journal states the next lead and separates “owned,” “understood” and “usable.”

**Acceptance:** fresh martial and artisan/explorer characters both acquire and apply the method; a character who declines cultivation still receives a useful reward and next objective; mid-reading and mid-quest reload do not duplicate rewards.

### 2. Body practice that buys a different solution

**Loop:** choose stance/body method → train within a safe load → test in combat or a harsh route → improve control → open a resistance/recovery application.

**Choice:** Weightlifting/Combat supports enduring pressure and stagger resistance; energy practice supports a limited charged counter. Both can solve the same expedition obstacle with different costs. If one stance already models a relevant effect, deepen it rather than adding a redundant stat.

**Cost/limit:** one active training commitment and consumable sustain; a technique occupies an existing stance/slot or a clearly limited new slot. Optional overexertion creates a recoverable fatigue penalty with a preview. Do not make body practice a passive multiplier that every caster must grind.

**Idle/readability:** safe drills stop at readiness or sustain exhaustion. Show marginal utility and the practical test needed for mastery. Never simulate unattended permanent injury.

**Acceptance:** comparable-strength body and charged-technique builds succeed against the obstacle through visibly different interactions, and ordinary equipment still matters.

### 3. Medicine and commissions rather than compulsory alchemy

**Loop:** identify herb/material trait → gather, buy or commission → choose food sustain or refined stabilization → prepare breakthrough/expedition → spend preparation → recover/replenish.

**Choice:** Cooking gives economical sustain; Alchemy gives targeted stabilization; a warrior earns a voucher by service and purchases the preparation. A crafter allocates a rare reagent between medicine and equipment rather than being forced to produce every profession's item.

**Cost/limit:** bounded ingredient consumption and a preparation slot. Keep starter recipes deterministic; advanced quality can be a visible optimization, with salvage or a guaranteed adequate commission. Proposed tolerance/backlash, if adopted, applies only to clearly named items and has an explicit remedy. No claim that all source pills share it.

**Idle/readability:** production can queue only with known ingredients and an exhaustion stop. Display “prevents this setback” or “reduces this resource cost,” not an unexplained preparation score.

**Acceptance:** self-crafted and commissioned preparations both reach the same milestone; quality affects efficiency, never basic eligibility; reload cannot recreate consumed ingredients.

### 4. The dangerous text and the research alternative

**Loop:** discover inscription → read safe copy → obtain supervised access through service or recovered context → prepare focus/protection → interpret one principle → use a counter or survey insight.

**Choice:** Literacy/Meditation plus mentor access gives a research route; combat/exploration retrieves missing context and earns supervised access with less independent study. Reward a specific enemy read, hazard warning or technique efficiency, rather than “all damage +50%.” A formation can later convert the insight into a prepared site effect; exact literary formation rules remain a separate research need.

**Cost/limit:** a local focus or strain variable only if it changes the decision. Limit hazardous study to safe, previewed segments; failure spends preparation and unlocks annotated guidance. Powerful text is not safe merely because the inventory contains it.

**Idle/readability:** safe copies may be routine work; first hazardous interpretation pauses for review. Describe missing knowledge and a remedy. No repeatedly pressing a hidden-probability “comprehend” button.

**Acceptance:** research and retrieval builds obtain different useful applications; players can predict the study limit and recover without resetting ordinary skills.

### 5. Trial, breakthrough and optional legacy as separate events

**Loop:** inspect trial → choose endurance, crafted defense or analytical counter → prepare → run a bounded encounter → review result → advance → optionally review rebirth losses/legacy.

**Choice:** strengthen body against pressure, spend a crafted ward, or identify and counter a predictable phase. Start with one ordinary trial in one realm. A later tribulation can reuse encounter machinery with distinct hazards, not merely a larger timer.

**Cost/limit:** disclosed supplies, energy and recovery. The trial cannot start unless minimum preparation is viable. Failure returns the player safely with a diagnostic and a finite preparation cost. Breakthrough opens one capability or route. A prestige choice retains one active legacy, with no uncapped multiplier stack.

**Idle/readability:** routine preparation can automate; first initiation and destructive reset require intentional action. A trial preview lists requirements, spends and stop conditions. A rebirth preview separately lists inventory, storage, knowledge and ordinary progress consequences.

**Acceptance:** two viable preparation builds clear the trial; mid-encounter reload preserves costs/progress; advancing does not reset the character; rebirth does only what the confirmed preview says.

## Innate capacity, roots and acquired constitution

This addendum treats fictional spiritual physiology as **fiction**, not real genetics. A soul attribute, spiritual root or Fiendgod transformation does not establish genes, Mendelian inheritance or a real-world ancestry hierarchy. The sampled novels do not substantiate a lineage-dilution formula, inheritance probabilities, breeding system or environmental switch for root expression. Those remain gaps.

**Text, narrow observations:**

- RMJI [chapter 30](https://www.wuxiaworld.com/novel/rmji/rmji-chapter-30) has Doctor Mo describe early-age practice and spiritual roots as requirements for Eternal Spring Arts, while admitting that he does not understand roots. This is a limited teacher explanation, not a complete physiology model. [Chapter 239's public teaser](https://www.wuxiaworld.com/novel/rmji/rmji-chapter-239) shows a teacher examining Han Li's roots before selecting a compatible art; the truncated sentence does not establish the full compatibility list.
- RMJI [chapter 1803's teaser](https://www.wuxiaworld.com/novel/rmji/rmji-chapter-1803) identifies Hai Yuetian's mistaken diagnosis at birth. Han Li says a recessive lightning root makes cultivation harder but can eventually help others through lightning tribulations. The excerpt does not explain inheritance or the root's timing. “Recessive” here is translation terminology, not evidence of real genetic recessiveness.
- BTTH [chapter 6](https://www.wuxiaworld.com/novel/battle-through-the-heavens/btth-chapter-6) links soul-determined fire/wood compatibility and perception to alchemical qualification. This is profession-specific, not evidence that one ancestry is best at every activity. See case 4 for the requirements; no inherited bloodline mechanism is inferred.
- DE [book 1, chapter 6](https://www.wuxiaworld.com/novel/desolate-era/de-book-1-chapter-6) presents techniques that let ordinary bodies approach innate supernatural bodies. This contrasts acquired transformation with a birth condition; it does not establish hereditary changes.
- RMJI [chapter 28](https://www.wuxiaworld.com/novel/rmji/rmji-chapter-28) shows a medicinally aided breakthrough producing sensory and bodily changes, while medicine-making competes with cultivation time. This supplies an acquired-development example without requiring an inherited superior lineage.

**Interpretation:** separate capacity, compatibility, expression and proficiency. A trait might permit efficient energy uptake; a compatible method might harness it; sufficient practice might make it usable; the environment might supply its fuel. None of those states entails the others. The difficult lightning-root support example is useful because early training efficiency and eventual social utility differ.

**Original proposal: one optional “heat-retaining constitution” trait, discovered through play.** This is invented, not a renamed literary bloodline. Offer it through a reversible conditioning regimen or a story discovery with an equivalent training route. Do not roll it at character creation or require it for the first breakthrough.

Three rules suffice: the trait retains heat after a fire technique; retained heat can pay part of one compatible action's energy cost; a small capacity limit creates fatigue if exceeded. At capacity, automation stops safely and the journal names the remedy. A cool environment clears heat faster but reduces reuse; an insulated item preserves it but occupies a gear choice. Cooking supplies a cooling preparation, while Alchemy offers a costly stabilizer for a larger reserve. Both are purchasable or commissionable. Ordinary body training increases safe tolerance, and Literacy/manual practice unlocks the compatible technique rather than being replaced by the trait.

A fire specialist reuses heat for a charged strike; an artisan spends it on a suitable refining operation; a generalist avoids the trait and uses a neutral technique with predictable ordinary stamina costs. A cold expedition encourages different equipment or diet from a hot cavern. The cost is heat management, an equipment/preparation opportunity and local fuel availability, not universal damage superiority. No ancestry or companion system is needed to ship this experiment. Save the optional regimen and temporary heat separately from technique knowledge; removing the regimen keeps learned methods and provides a neutral fallback.

**Acceptance:** a trait build and a neutral build both solve the same obstacle; the trait is situationally useful and visibly costly; players can discover, switch and reload it without permanent eligibility loss. Any future bloodline should start with similarly narrow compatibility and a nonhereditary access alternative. Exact literary bloodline inheritance remains unverified.

## Three rules, several useful interactions

**Original proposal: a resonant watchpost ward.** This is a small encounter for loop 1 or 4, not a new world or a canonical book mechanic. Start with three rules and ordinary items/skills:

1. The ward telegraphs alternating **pressure** and **surge** phases. Pressure strains endurance; surge consumes maintained technique charge. A stance handles one phase well and the other less well. Let players set a stance policy before starting rather than require rapid clicking.
2. One support slot holds a food, stabilizer or inscribed tool. Food restores endurance between phases; a stabilizer preserves charge during surge; an inscribed tool reveals the next phase and reduces the cost of responding. Items deplete and the slot prevents stacking every preparation.
3. Success requires handling both phase types within a fixed expedition supply budget. A known safe retreat saves discovery and spent practice, but does not refund consumed support. A failed attempt records which phase exhausted the budget and opens a mentor hint.

These constraints create several choices without another permanent XP bar. A Weightlifting/Combat build uses a defensive stance for pressure and cheap Cooking food for sustain. A technique-focused build spends its support slot on an Alchemy stabilizer and saves charge for surge. An explorer brings the inscribed tool and a response policy, sacrificing sustain for efficiency. A generalist buys any preparation through a reputation commission instead of leveling its profession. Literacy can earn the phase annotation through research; a combat rescue earns the same initial information through a mentor. Both acquisition routes expose the same facts in the journal.

The interaction is in allocation: spending charge early makes the next surge harder; choosing food solves endurance but leaves charge unmanaged; the tool makes a leaner supply plan possible but provides no healing. Equipment affects endurance or charge capacity, and ordinary crafting helps prepare the chosen support. Costs are finite supplies and one occupied slot. Numbers require playtesting; no build is claimed viable yet.

**Smallest delivery:** two telegraphed phases, one support slot, three item effects, two authored clue routes and safe retreat. Test two builds first; add a third only when it changes the choice. Reuse existing stance, item and quest machinery where verified. Compare with the parallel idle-game lane's eventual dossier for other compact systems; this lane does not duplicate that game survey.

## Fit with the existing fork and persistence contract

`BookData` already stores reading time, accumulated time, required skills and reward metadata. `QuestTask` supports ordered conditions/rewards; `conditions.js` checks reputation, tools and flags. These are useful foundations. Their existence does not establish that every new prerequisite is enforced by every activity and UI, so an implementation must inspect the actual call path. Existing Meditation, Weightlifting, Cooking, Herbalism and Alchemy should keep their ordinary meanings.

The current cultivation state is schema 1, with `qi`, `body`, `preparation`, `realm`, `seal`, `trial`, rebirth/legacy and discovery fields. Trials are deterministic active-tick pressure exercises; the existing formation route is not a new spatial formation editor. The prototype's advancement speeds its own training. None of the proposed lore loops has been browser-exercised here.

**Proposed compatibility contract:**

1. Use stable technique IDs and an additive, versioned discovery/knowledge namespace. Acquisition, comprehension, practice and first-use rewards are distinct saved states. Calculate modifiers from state instead of regranting completion rewards at load.
2. Preserve schema-1 characters who already practiced, earned a seal or advanced. A campaign entry gate must not strand them or delete their progress. Offer a credited initiation/discovery record and an optional replay of the story; an untouched upstream-shaped save starts with the new ordinary leads. Write and test that migration before changing access.
3. Travel, local initiation, advancement and rebirth have different state effects. Each imported extraordinary technique needs an explicit energy/environment rule; ordinary skills and learned recipes remain discoverable even when temporarily unusable.
4. Keep the current active-tick behavior until an offline policy is deliberately implemented. Future catch-up needs caps, resource exhaustion, hazard stops, one-time-reward handling and a summary. Never auto-initiate, auto-rebirth or resolve a new irreversible story choice while the browser is closed.
5. Verify fresh builds, schema-1 migration, mid-activity reload, consumed resources, equipment/stance effects and full export/import on dedicated test origins. Use synthetic saves only. Rebuild source and inspect actual changed behavior in a browser; this research pass does not satisfy that future acceptance gate.

## Traps and bounded substitutes

| Trap | Better design and concrete cost |
|---|---|
| Universal cultivation multiplier makes all other careers obsolete | Grant a capability with a named environment/encounter use. Balance and author several obstacle solutions. |
| Talent/root RNG permanently locks a preferred path | Let preparation, service or discovery change eligibility. Keep an affinity as a reversible efficiency choice, not a save-level exclusion. |
| Rare-drop manual or core is the only entry | Guaranteed authored acquisition with a visible alternate route; lucky loot accelerates it. This costs quest/content authoring. |
| Every profession is mandatory | Self-craft, trade, commission and service alternatives. Distinct routes must be balanced for comparable time-to-opportunity. |
| All manuals are identical permanent XP buffs | Different practice requirements, applications and slot tradeoffs. More technique effects require encounter coverage. |
| Public hardest method is secretly always optimal | Offer methods with useful near-term niches and reversible switching. Avoid source-inspired dominance with no actual game tradeoff. |
| Foundations punish an early uninformed choice forever | Preview consequences and provide a concrete repair path. Charge time/materials, not deletion of unrelated progress. |
| Soul, willpower and comprehension become three duplicate bars | Add a variable only when it changes a decision; otherwise represent understanding as knowledge/quest state. |
| Sect membership becomes daily chore debt | Finite service contracts unlock facilities; recurring work is optional income. Reputation history survives travel. |
| Every realm is the same loop with new names | Change one local constraint and one useful exported discovery before adding a second world. |
| Tribulation implies prestige | Advancement is an unlock; rebirth is a separate choice with its own contract. |
| Imported artifact ignores the destination's rules | Specify fuel, maintenance, hazards and supported actions. Keep incompatibility visible before travel. |

## Prioritized source-acquisition wishlist

These are consultation priorities, not purchase/download requests. Use lawful public text first, then a library or owned licensed edition. No books were purchased or downloaded. Chapter numbers below refer to the linked English serialization and may differ from another edition; locate by title and scene when needed.

| Priority and title | Precise target and design question | Already covered; is more full text necessary? |
|---|---|---|
| 1. **A Record of a Mortal's Journey to Immortality / 凡人修仙传**, Wang Yu / 忘语. Prefer the original Chinese novel or licensed Wuxiaworld translation, not the Immortal Realm sequel or screen adaptation. [Author/publisher metadata](https://www.wuxiaworld.com/novel/rmji). | Chapter 127, **Knowledge on Spiritual Roots**, for classification and advancement implications; chapter 239, **Choice**, for method matching; chapter 1803, **The Woman in Purple**, for unusual-root cost/support utility. Does compatibility produce niches or merely faster/slower progression? What changes eligibility? | Public chapter 30 covers one entry requirement; later teasers support matching and a slow/supportive root but omit key explanations. **Targeted full chapters are necessary for precise rules, not the whole series.** Chapter 1219, **Five Elements as One**, was inspected but its public teaser does not establish root alteration; read the full passage before claiming an artificial-root mechanism. |
| 2. **A Hero Born**, Jin Yong, Anna Holmwood's English translation, St. Martin's Griffin ISBN **9781250220622**, or a lawful original Chinese **射雕英雄传** edition. [Official edition](https://us.macmillan.com/books/9781250220622/aheroborn/). | Early training under Guo Jing's teachers and later practical application. Exact training chapter numbers have not been verified; locate those scenes from the edition. How do different instruction and learner limitations create martial choices without an immortality ladder? | Public introduction, opening chapter excerpt and synopsis establish social framing and teachers, not technique rules. **Longer relevant text is needed for a precise training case.** A library edition is sufficient; no complete collected works set is needed. |
| 3. **Battle Through the Heavens / 斗破苍穹**, Li Hu / Heavenly Silkworm Potato / 天蚕土豆; licensed Wuxiaworld translation by goodguyperson or lawful Chinese original. [Author/publisher metadata](https://www.wuxiaworld.com/novel/battle-through-the-heavens). | Chapters 6 **Alchemists**, 9 **Yao Lao**, 11 **The Market** and 15 **Training**. How can innate qualification, learned control, fuel, tools and commissioned supply interact without forcing every player into alchemy? | These public chapters already support the proposed compact profession loop. **No additional full-text acquisition is necessary for that loop.** Consult an owned edition for translation comparison if a precise adaptation is selected; later hereditary-bloodline mechanics need separately located primary passages. |

RMJI's [publisher page](https://www.wuxiaworld.com/novel/rmji) claims a first-place Qidian recommendation ranking without dating it. Treat that as publisher-reported popularity, not a verified current chart position or critical award. Jin Yong's editorial recognition remains stronger critical-acclaim evidence. These priorities answer specific design questions rather than ranking books by fame.

## Coverage, gaps and review result

Covered: eighteen mechanic families; seven works; detailed published-chapter cases for RMJI, TMR, DE, BTTH and Renegade Immortal; a precise opening artifact/access case for ISSTH; a publisher/excerpt-bounded wuxia contrast; five original loops, a constitution interaction example, a three-title consultation wishlist and an explicit migration/idle contract. Acclaimed-work evidence is strongest for Jin Yong; the remaining selections are justified primarily by contrasting mechanics and readable primary evidence.

Not exhaustive: no whole-series realm encyclopedia, original-Chinese comparison, favorite-book inference or direct fan-setting proposal. Soul manipulation, Dao/intent development, detailed formation construction, artifact refinement/binding, actual high-stage tribulation sequences, ascension economies and long-run foundation repair remain gaps. DE's early explanation is the precise available substitute for a late trial case; it supports the existence and distinction, not encounter details. BTTH's early soul-perception account substitutes for a soul-cultivation case but does not prove an independent soul path. RMJI's medicinal apprenticeship and TMR's research route supply unusual alternatives without asserting that either avoids combat forever.

Self-review: citations sit beside the relevant claims; chapter outcomes are not extended beyond what was read; teacher claims are attributed; proposed costs, recovery, slot limits and cross-world compatibility are identified as invention. Inspected the public pages without paid access or outbound messages. Failed static Jin Yong page was replaced by the official book page. No wiki, mirror, adaptation or reader comment supplies a canonical mechanic in this dossier. Search results mentioning those sources were discovery only. No private book passages or saves were copied.

**Next playable gate for parent integration:** one ordinary manual/mentor expedition with two acquisition routes, one meaningful application and an optional later initiation; preserve existing cultivation progress; rebuild and browser-check both builds and reload before calling it implemented. Creative acceptance of cultivation's campaign placement, faction tone and alternative career viability remains Weibao's decision.

## Round 2026-10-22: digitized paths of ascension

Weibao asked to consider digitizing paths of ascension for cultivation worlds
from what each book canon needs, with more to consider, using the specific
Discord UI images. This round is a consideration palette. Everything below is a
proposal; no ladder, schema or UI is selected or implemented. It extends the
first Mistglass method slice ([task record](gm/dispatch/cultivation-spacing-2026-10-22/CHECKPOINT.md))
without reviving retired Jade Hollow. Applies AD5, AD6, AD7, AD8, AD16, AD33,
AD34 and AD38; UI items follow [UI rules](UI_RULES.md), runtime items the
`absorb_p23/world_adaptation` seam under [architecture rules](ARCHITECTURE_RULES.md).
Target viewport for any later UI: desktop 1920×1080, then 1800×1040 and
1536×864, at 14/21px. Mobile deferred.

### Discord UI references

All seven are Corc's posts in the Proto23 channel. The images are saved under
the gitignored `docs/research/proto23/private/discord-media-2026-10-20/captured-media/`
by attachment ID; cite them by message ID and do not copy them into a public path.
They are dated design snapshots, not one verified current loop (PFA061).

| Ref | Message (date) | What the image shows | Lesson for YAIRPG |
|---|---|---|---|
| DR1 | 902703178783522928 (2021-10-26) | "Cultivation" tooltip for the no-method state: absorbing nearby Ki without a method, a Ki multiplier, per-element rates per second, infinite duration | Absorbing without a method is a real, weaker state. Mistglass Open-mist already matches it. |
| DR2 | 902703368290598932 (2021-10-26) | "Cultivate" tooltip: practice gives insight, gain varies by location, selected method named, then a Stages list with a bar between Half Opening and Opening stage | The stage ladder belongs to the **method**, and the bar sits between the two stages it connects. |
| DR3 | 907044786802946069 (2021-11-07) | Actions row "Cultivate" with the method as an expandable subrow | Method is a child of the action, not a separate tab. |
| DR4 | 907042945872588820 (2021-11-07) | "QI coverage: 1.1" in the place strip beside season and weather | Place suitability lives with place facts. |
| DR5 | 1202411899338096700 (2024-01-31) | "QI STORED" panel: accumulated internal energy expressed as days; hover lists derived HP/STR/AGL/INT percentages | Stored energy is one number with derived effects on hover. |
| DR6 | 1549836622168592484 (2026-09-16) | Cultivation tooltip: global multiplier, a named Support Tech, Qi and Elemental Qi split, State of Mind, current stage, Qi bar out of 5000, Difficulty | Method and support technique are distinct slots; a mind state and difficulty sit next to the rate. |
| DR7 | 1549842644279238716 (2026-09-16) | QI STORED at 7 days with QI Capacity 5000; larger derived stat bonuses | Capacity equals the stage bar's denominator in DR6: one record, two views. |

### What the canons need

Built from saved summaries only (subagent extraction, 2026-10-22). Confidence:
H means a ladder summary or table was read, M partial or wiki-derived.

| Canon | Ladder shape | What crosses a boundary | What a stage changes beyond numbers | Failure and recovery | Conf. |
|---|---|---|---|---|---|
| Reverend Insanity | Master ranks 1–9, four sub-stages each; Gu carry their own rank; paths shape Gu, not the master | Essence quantity and quality, aptitude grade, the right Gu; tribulation for immortal | New Gu operations, extra apertures as separate fuel pools, lasting body changes | Crippled aperture, Gu death injures master | H shape |
| Lord of the Mysteries | 22 pathways × Sequence 9→0; neighbor swaps near Sequence 4 | Ingest a potion, then digest it by acting its principles; rituals from Sequence 5 | New powers, mythical form from Sequence 4; world conserves characteristics per pathway | Loss of control with five causes; early signs reversible, full loss not | H |
| Cradle | Three realms plus distinctions above (Sage, Herald, Monarch); Paths are madra aspects | A power quota **and** a typed structural check per edge (core compression, Iron order, Remnant, revelation) | Senses, soulspace, near-stopped aging, authority | Weak foundation makes later edges shaky; elixirs cannot cross into Lord | M (wiki) |
| Renegade Immortal | About 19 rows in four steps; non-linear protagonist route | Domain, resources, gate breaking, trials | Lifespan cap changes, domain and law operations | Destroyed attempt, vulnerable during fusion | H |
| Beyond the Timescape | Qi Condensation with separate body track, apertures, flames, palaces, baptisms | Aperture count, flame count, tribulation, one gate per Dao | Flame count sets the palace **ceiling**; ceiling and completed count differ | Fuel exhaustion cripples apertures | H |
| ISSTH | Ten tiers; Ancestor is a state, not a tier | Celestial needs three gates: resources, fusing techniques, a named entity's approval | Lamps and special meridians | Unsampled | M |
| Fated Villain | About 13 bands with four sub-stages | Route-specific gates (a Dao imprint); fortune ledger separate from rank | Lower worlds cap visiting strength | Karma backlash | M |
| Virtuous Demon | Rank 1 with 12 stages (bottlenecks at 6, 9, 12), then 4 sublevels per rank | Bottlenecks; Paths from experience plus understanding | Oath ladder and letter grades run beside rank | Visible regression of a stage | H |
| Dao of the Bizarre Immortal | Seven body points, not a rank ladder; office, sect, bureau and rite ladders kept separate | Per-point operation | Each point grants a distinct operation | Last point unreliable | H |
| Path of the Idle Cultivator (game) | Main path plus parallel paths contributing an "effective realm" | Per-path predicates | Feature unlocks by effective realm | Rebirth resets named fields, keeps others | H |
| Proto23 (DR1–DR7) | Per-method stage track | Stage quota on a shared Qi pool | Derived stat percentages from stored energy | Unshown | Images |

Named evidence gaps, not to be filled by guessing: A Will Eternal ladder contents;
Primordial Saint Sect upper stages; Fanren simulator chapters 45–184; Cradle has
no full-book pass; Fated Villain per-rank gates (`REALMS_AND_FATE.md` unread);
Reverend Insanity per-rank thresholds (`rank_ladder.csv` unread); Path of the
Idle Cultivator late resets; LOTM digestion, promotion and loss of control are
outside the current Seer slice. Fated Villain sealed material is referenced by
ID only in its owner.

### Findings

**ACT NOW (done in this round)**

- **ASC1: the ladder hangs on the world and the method, not on the player.**
  DR2 and DR6 attach stages to the selected method. That lets each world digitize
  its own canon ladder without a universal one. Saved here as the organizing rule
  for later work.
- **ASC2: one descriptor vocabulary covers every canon above.** Proposal shape:
  a *path* declares its world, shape (ladder, tree, web, wheel, stack or field,
  from [E8C](emergent/E8C_POWER_PATHS_AND_ANIME.md)) and tracks. A *stage*
  declares its position, a quota on a named pool, a list of typed crossings,
  its grants, an optional ceiling source, a peak flag and its failure signs,
  outcome and recovery. Crossing types needed by the table: quota, structural
  check (order of operations, compression), insight, trial or tribulation,
  ingest-then-digest, consumption, recognition by a person or institution,
  and body point. Grants are capabilities, lifespan, senses and rule changes,
  not only multipliers. Saved; not implemented.
- **ASC3: canon mappings that would break a naive ladder.** Reverend Insanity
  needs two ranked subjects (master and Gu). LOTM needs an atomic irreversible
  ingest followed by a duration of acting tasks, plus a world-level conservation
  rule. Beyond the Timescape needs a ceiling distinct from progress. Cradle
  needs a structural check alongside the quota, and one permanent order choice.
  Renegade Immortal and ISSTH need states and parallel lines that are explicitly
  not rungs. Bizarre Immortal needs a field of points. Each fits ASC2 as data.

**ACCOUNT FOR NOW (constraints on any ladder work, Mistglass included)**

- **ASC4: one record, two views (AD7).** DR6/DR7 show capacity and the stage bar
  as the same 5000. A Mistglass ladder would read the existing condensate and
  practice minutes, not a second pool or XP currency.
- **ASC5: breakthrough is an unlock, not a prestige reset.** Trial, breakthrough
  and legacy stay separate events, as this doc's lifecycle table already proposes.
- **ASC6: own stage exact, others' stage by means (AD6/AD8).** Reading another
  person's realm needs a canon means (spiritual sense, Copper sight, spirit vision)
  and starts as an impression. Unknown next stages show `???` until known
  (PFA056); sect common knowledge can reveal a public ladder while a pathway's
  high Sequences stay hidden.
- **ASC7: saves.** Any ladder state is an optional child schema absent by default,
  like Mistglass F3. Retired Jade Hollow `realm`, `seal` and `trial` fields stay
  dormant and untouched.
- **ASC8: away time (AD16).** Accumulation can continue as a chosen routine;
  ingestion, breakthrough attempts and tribulations stop and wait for the player
  because they are irreversible choices.
- **ASC9: grants are evaluated where the body is.** World ceilings (Fated Villain's
  lower-world Dao, DR4's place coverage) and travel compatibility read the stage's
  grants in the destination, following the C9 body-faculty reader precedent in
  [the C7/C9/C10 record](research/additional-cultivation-2026-10-22/IMPLEMENTATION.md).
- **ASC10: no cross-world effective realm.** Path of the Idle Cultivator's
  effective-realm conversion is useful inside one world; across worlds it becomes
  the universal multiplier trap listed above.

**UI proposals from the images (desktop first)**

- **ASC11: method tooltip shows a ladder slice.** Previous stage, current bar,
  next stage (DR2), plus difficulty and the current consequence (rate, purification,
  work cost). Mistglass already exposes Learning, Practiced and Integrated, so it
  is the first consumer.
- **ASC12: place suitability in the place header** beside weather and exposure
  (DR4), keeping the single-home rule from UIL8.
- **ASC13: stored energy row with capacity**, and a hover listing derived effects
  (DR5/DR7). A "days of practice" reading is a label on the same number, offered
  only where the world measures practice that way.
- **ASC14: show typed energy and mind state only where they change a decision.**
  The Qi and Elemental Qi split (DR6) belongs to worlds with typed energy. State
  of mind earns a row only if it moves deviation odds or rate.
- **ASC15: method and support technique are separate slots (DR6).** A support
  technique modifies the main method's track; it fits the existing slot-limit
  pattern in this doc's ward example.
- **ASC16: an inspector view.** A debug panel that shows the descriptor and each
  crossing's evaluation for the current body, read-only, so ladder data can be
  checked without playing to the stage.

**LATER / DELEGATE**

| Code | Work | Level and effort | Done check |
|---|---|---|---|
| ASC17 | Pure path-descriptor evaluator in the `world_adaptation` seam, with Mistglass's three methods expressed as descriptors | Sonnet or Codex Luna-medium; M | Existing P12 pure/host tests pass unchanged; new tests cover stage boundaries, chunk equivalence and absent state. Coordinate with the P12 and W1–W4 owners before editing. |
| ASC18 | Fill the named evidence gaps that block a ladder: RI `rank_ladder.csv`, Fated Villain `REALMS_AND_FATE.md`, A Will Eternal ladder | Haiku/Sonnet reader; S | Rows above rise to H confidence with file citations; no sealed truth in public text. |
| ASC19 | First canon ladder: LOTM Seer digestion and Sequence 8 promotion on the existing slice | Sonnet design, Codex implementation; L | Native journey: ingest, acting tasks, digestion, promotion with reversible early loss-of-control signs; save, reload and import pass at the desktop targets. |
| ASC20 | Method tooltip ladder and place-suitability header (ASC11–ASC13) after ASC17 | Sonnet; M | Rebuilt browser proof at 1920/1800/1536 at 14/21px, no clipped text. |
| ASC21 | Reverend Insanity rank-one aperture slice with Gu rank separate from master rank | Sonnet design; L | Two ranked subjects saved distinctly; a Gu death injures the master; travel out of the world disables Gu operations visibly. |

Suggestions, not reasons to stop: compare DR6's "Difficulty" against this doc's
foundation-repair gap; a sect's public ladder board could be an in-world UI
surface for ASC6.

## Round 2026-10-22b: gaps filled, first ladders built, value of progress and rituals

Weibao asked to "fill gap and build them here accordingly", then mid-task asked
how to digitize the value of progress, how the LOTM MMO does it, and about
rituals. Execution and evidence live in
[the task record](gm/dispatch/ascension-paths-2026-10-22/CHECKPOINT.md).

### ASC18 gap fill (saved summaries only)

- **Reverend Insanity:** `engine_inputs/rank_ladder.csv` is a claims ledger
  (about 1,626 rows, rank blank in about 1,557), mostly Gu grades rather than
  master realms. Five rows describe master cultivation (lines 131, 238, 347, 398,
  623), for example a middle-to-upper rank-three step through a fuelled session
  and a rank-four peak after about a month with help. No essence colour,
  lifespan, failure or per-rank crossing columns exist. Gap stays open: a per-rank
  table needs a targeted reading pass, not inference from the ledger.
- **Fated Villain:** `readers-2026-10-10/REALMS_AND_FATE.md` lines 13–26 list about
  27 bands from Mortal Body to the Dao Realm. Crossing gates are recorded only
  for Emperor (a Heavenly Dao imprint in lower worlds, or breaking Quasi-Emperor
  and passing a Nirvana path in upper ones) and for the Dao bottleneck (it loosens
  with world fortune). World ceilings: escorts cannot use full power in the lower
  realm, and secret realms cap entrants (lines 40–54). No sealed IDs in that file.
- **A Will Eternal:** `er-gen-haul-2026-10-09/a-will-eternal/DOSSIER.md` lines 29–45.
  Crossings are recorded for Foundation (route-dependent: pill or field resource,
  with different futures), Core (seas converge; nine strikes on one route), Nascent
  Soul (fifteen- to twentyfold flame), Demigod, Celestial (three gates, failure
  fatal) and Sovereign (an approval, with counterexamples). Ancestor is a state,
  not a tier. Qi Condensation and Eternal have no recorded crossing.

The canon table above stands; these rows raise Fated Villain and A Will Eternal
to H for the recorded gates and keep Reverend Insanity at H for shape only.

### Build status

- **ASC17, engine ready, not integrated in Mistglass UI.** `src/ascension_paths.js`
  validates descriptors and projects an observer-safe view (`???` past `known`,
  owner ceilings, typed crossings with irreversibility, failure signs).
  `src/ascension_paths_mistglass.js` expresses Threaded-breath and Still-pool as
  descriptors read over the P12 table; a test proves stage agreement at every
  practice minute. The Projects tooltip is P12/W1–W4-owned, so no UI change there.
- **ASC19, integrated, partial.** LOTM Seer digestion by acting and the Sequence 8 Clown
  promotion, per [LTS11–LTS14](worlds/LOTM_SEER_SLICE_LAWS_2026-10-19.md). The
  workroom panel shows the Seer pathway ladder, the felt digestion state and each
  crossing. This is the second case that proves the seam (AR11). Against round 1's
  done check: reversible early loss-of-control signs moved to ASC35 (2026-10-22),
  and only 1920×1080 at default text was browser-checked; 1800×1040, 1536×864
  and 21px remain open.

### Digitizing the value of progress

**ACCOUNT FOR NOW**

- **ASC22: progress is four numbers, not one.** Position (which stage), quota
  (amount toward the next), quality (foundation, purity, completeness) and
  readiness (which gates are met). DR6 already separates the stage, the bar and
  a difficulty. Keep them separate in state and UI; a single "power level" hides
  the decisions.
- **ASC23: the value of a stage is what it changes.** Show grants (senses,
  lifespan, operations, rules that now apply) before multipliers. DR5/DR7's
  derived stat percentages are one legitimate kind, not the default.
- **ASC24: legibility of your own progress is a world dial.** Exact (Proto23's
  Qi bar), felt (LOTM digestion, LTS12) or assessed by someone fallible (a church
  assessor, a sect testing stone). The dial is per world, with the reason in
  canon.
- **ASC25: quality sets ceilings.** Cradle's structural checks, Beyond the
  Timescape's flame-to-palace ceiling and A Will Eternal's route-dependent
  Foundation make slow, careful progress worth more later. The engine's
  `ceiling` option is the hook; quality itself stays with the world's owner.
- **ASC26: time-equivalent value.** DR5/DR7 show stored energy as days, and many
  canons speak of "years of cultivation". Offer it as a label on the same number
  where the world counts that way; never as a second store.

**What the official LOTM games do** (subagent web research, 2026-10-22; sources
in the task record). The 《诡秘之主》 MMORPG by Kuaishou's Sparknexa launched in
China on 2026-08-21; Zulong's 《诡秘之主：愚者》 was in pre-registration. Verified
from the store page and press: 22 pathways with Sequences 9 to 0; promotion
needs potion ingredients plus acting, not level grinding; forcing a potion
without acting makes loss of control very likely; a SAN value falls under
unnamable exposure and long pressure, and zero is irreversible. Guide-reported
only: promotion as four components (materials, acting, sanity, ritual), with
rituals from Sequence 5 and an 80% acting threshold. Press reports dailies,
energy and seasonal resets, and the store lists passes and currency packs.

- **ASC27: promotion is a checklist of independent gates.** The MMO's four
  components map to ASC2 crossings: consume, digest, a sanity/strain condition
  and a ritual. Each can fail on its own, and the UI lists each.
- **ASC28: forcing is allowed and priced, where the world allows it.** Under
  AD38, a held potion can be drunk undigested if the world's mechanism allows;
  the price is loss-of-control risk with reversible early signs. The Tingen slice
  does not reach this (its dose arrives only after assessment); a found or bought
  dose route would expose it under H3–H7.
- **ASC29: keep sanity inside the existing pool.** LTS5 keeps one spirituality
  record with strain. Add a separate mind value only where it changes a decision
  the strain record cannot express.
- **ASC30: do not copy MMO friction.** Daily tasks, energy timers, seasonal
  resets and paid gates add nothing for one player (AD22). Scarcity comes from
  the world: ingredient rarity, a supplier's limited attention, risk.

### Rituals

**ACCOUNT FOR NOW**

- **ASC31: a ritual is a prepared, sited crossing with named components.**
  Components seen across canons: a place, a time or celestial condition,
  materials, a helper or witness, an acting or mental condition, and an invoked
  target. In ASC2 terms a ritual is a group of crossings of type `ritual` that
  must all hold at one moment, plus a risk if the invoked target is wrong (LOTM
  H3). Cultivation analogues: tribulation preparation arrays, Cradle's Remnant
  adoption, A Will Eternal's Celestial approvals.
- **ASC32: rituals start where the canon starts them.** LOTM uses them from
  Sequence 5; low Sequences need materials and acting only. A low-tier ritual
  would be invented scope.
- **ASC33: a failed ritual leaves a trace.** Spent materials stay spent, the
  attempt is recorded, and a wrong invocation creates attention rather than a
  generic failure. This follows the existing "trial, breakthrough and legacy are
  separate events" rule.

**LATER / DELEGATE**

| Code | Work | Level and effort | Done check |
|---|---|---|---|
| ASC34 | Add `ritual` as a crossing type with grouped, simultaneous components to `ascension_paths.js` | Sonnet; S | Pure tests: a ritual group passes only when all components hold together; unchanged LOTM and Mistglass views. |
| ASC35 | Exposed forcing route: a found or bought Clown dose drunk undigested, with reversible early signs and a qualified loss-of-control outcome | Sonnet design with source pass; L | H3–H7 qualified in the LOTM plan first; native journey shows warning, signs, recovery by sleep, and the terminal outcome only after the stated cause. |
| ASC36 | Clown abilities in use: one Tingen performance or scuffle that reads the Clown source | Sonnet; M | A native action changes outcome only with `book.lotm.clown` active; save, reload and import pass. |
| ASC20 | Mistglass method tooltip ladder (unchanged from round 1) | Sonnet; M | Coordinate with the P12 and W1–W4 owners; rebuilt browser proof at desktop targets. |

## Round 2026-10-22c: required future work and further MMO lessons

Weibao asked "Future stuff required and more? more to consider? What did we
learn from the MMO and more?" New angles only; earlier codes keep their meaning.

**ACT NOW (done in this round)**

- **ASC37: Mistglass UI ladder is now unblocked.** PROJECT.md records that the
  W1–W4 chat finished and released its ownership, so ASC20 no longer waits on a
  reservation. It still needs its own task and browser proof.

**ACCOUNT FOR NOW**

- **ASC38: characteristics are conserved matter.** LOTM conserves Beyonder
  characteristics per pathway, and the MMO's high-Sequence recipes ask for them
  (guide-reported). A promotion consumes authored stock; it never mints a
  characteristic. When they appear, they ride the existing material-lineage
  owner, so a dropped characteristic carries who it came from.
- **ASC39: cross-path edges need a `links` field later.** Neighbor swaps near
  Sequence 4, Reverend Insanity path shifts and Cradle Path changes are edges
  between descriptors, not stages inside one. The current engine orders stages
  in one path; add links between paths only with a real consumer.
- **ASC40: acting quality versus acting count.** The MMO guide's 80% threshold
  and canon persona bleed (0603) suggest two readings of the same acts: how well
  they fit the role, and how far the role is eating the self. A world that needs
  drift adds it as a second counter fed by the same completed acts, never by time.
- **ASC41: a path can belong to an item or companion.** Reverend Insanity ranks
  Gu separately from their master; pets, artifacts and swords in other canons
  advance too. `pathView` already takes any subject's facts; the owner of that
  subject supplies them.
- **ASC42: away time can run acting routines (AD16).** Readings are a chosen,
  repeatable routine, so away play may run them until spirituality or strain
  stops it. Assessment and every ingestion wait for the player.
- **ASC43: progress has social visibility.** Sects display rank; LOTM Beyonders
  hide what they are behind an ordinary job (LW6). The ladder panel is private
  knowledge. What others know of your Sequence or realm needs a means (ASC6) and
  a reason to spread.
- **ASC44: promotion supply comes from the world, not a store.** The MMO's late
  materials come from relics, elites, auctions and player-run clubs
  (guide-reported). For one player that maps to authored clubs, black markets and
  institutions with real restocking stock and attention, using the existing
  restock owner.
- **ASC45: what a ladder keeps through the one prestige layer.** Path of the Idle
  Cultivator resets realm and stage but keeps soul power, peaks and completed
  quests. The first-milestone prestige layer needs an explicit per-world list of
  what each ladder keeps; breakthrough itself is not prestige (ASC5).

**What the MMO taught, in one place**

1. Promotion is several independent gates, not experience (ASC27).
2. Acting is lived behavior with a visible threshold that gives a wait-or-gamble
   choice (ASC24, ASC40).
3. Forcing is allowed and priced, which matches AD38 (ASC28).
4. A sanity pool ties ability use to long-term risk (ASC29).
5. Rituals scale with tier and are absent low down (ASC31–ASC33).
6. Avoid dailies, energy timers, seasonal resets and paid gates (ASC30).
7. Late supply comes from social and dangerous sources (ASC44).
8. Nobody answers pathway switching; that is ours to design (ASC39).

**LATER / DELEGATE**

| Code | Work | Level and effort | Done check |
|---|---|---|---|
| ASC46 | Test scenario fixture that builds a digested or promoted Tingen save from honest commands, for faster UI proof at every desktop target | Sonnet; S | A script produces disposable saves through real commands only; the six-case desktop/text matrix runs from them. |
