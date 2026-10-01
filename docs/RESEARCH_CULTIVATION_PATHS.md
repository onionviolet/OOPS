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
