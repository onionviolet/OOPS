# Progression paths and learned magic: research dossier

Research date: 2026-09-30, America/New_York. Scope: Western progression fantasy, cultivation hybrids, and learned/research magic. Research and original design proposals only. No gameplay implementation, favorite-book declaration, or direct fan adaptation is implied.

**Recommendation:** build an ordinary discovery → study → practice → application loop before making cultivation the campaign default. Separate what a character knows, what their body/energy system permits, and what they can execute under pressure. Later power paths can specialize those foundations instead of replacing them.

## Evidence boundaries and checkout

Read `AGENTS.md`, `PROJECT.md`, `docs/EXPANSION_DESIGN.md`, and `docs/REFERENCE_RESEARCH.md`; inspected local books, reading completion, skills, conditions, quests and cultivation transitions. Git status showed the existing dirty prototype and setup files. This lane owns only this new dossier. All pre-existing edits, source, bundles and saves were left untouched. No build or browser test was needed for this research-only change, and no playable acceptance is claimed.

Labels used below:

- **Text:** a directly inspected chapter or author-hosted appendix. In-world speakers can be mistaken; their uncertainty remains part of the evidence.
- **Author:** official synopsis, author explanation or author-authored introduction. This establishes only its stated claims.
- **Interpretation:** an analytical connection between examples, not a universal genre rule.
- **Proposal:** invented YAIRPG mechanics, costs and architecture awaiting creative review.
- **Gap:** a rule not verified in this pass. No default assumption fills it.

Five core contrasting works were selected: *Cradle*, *Mother of Learning*, *Mage Errant*, *Arcane Ascension*, and *Warbreaker*. The last is a learned-magic comparator, not a claim that it belongs to the same progression-fantasy subgenre. Four have chapter-level or equivalent evidence; Mage Errant remains a narrower author/synopsis case. Mistborn contributes a supplemental sixth chapter-level comparison in the inherited/acquired section. No paid access or private reading-list content was used.

## Selection, reception and local-library check

The strongest documented recognition in this pass is for Cradle: its publisher reports more than 25,000 five-star reviews for Unsouled and carries a named endorsement from Travis Baldree. That is publisher-reported reader reception and peer praise; it is not an independent critical consensus. [Publisher listing](https://www.panmacmillan.com/authors/will-wight/unsouled/9781037420221). The author describes Cradle as a New York Times bestselling series; commercial success is a separate signal. [Series page](https://www.willwight.com/cradle.html).

Mother of Learning's live Royal Road listing displayed 33,879 followers, 32,413 favorites and 17,569 ratings during this pass. These document substantial platform readership and engagement, not a jury award or a universal best-book ranking. The extracted page did not expose a reliable numeric overall score, so none is claimed. [Author's platform listing](https://www.royalroad.com/fiction/21220/mother-of-learning).

Arcane Ascension and Mage Errant remain specifically requested comparison candidates with distinctive rules, rather than works whose critical standing was independently established here. Warbreaker was selected for its unusually accessible primary text and contrasting allocation economy. Fame alone did not justify any proposed mechanic. An attempted Goodreads 2017 Fantasy award check did not establish an Arcane Ascension nomination; no award claim is made.

Following the updated research request, queried `/Users/weiwei/Sync/CalibreLibrary/metadata.db` through SQLite `mode=ro` for these five English title strings. No matches appeared. This is a narrow title lookup, not proof that no translated edition exists. The parent lane verified a local Lord of the Mysteries EPUB; detailed chapter research belongs to the alternative-power dossier and was not duplicated here. No book text, full catalog, unrelated coursework or library metadata was copied or modified.

## Primary-source cases

### 1. Mother of Learning: knowledge, control and execution differ

**Text, chapter 2, “Life's Little Problems”:** the academy restricts portions of its library by guild status. Structured spells trade flexibility for easier execution; unstructured shaping is difficult and slow to learn. Combat instruction uses formula-bearing rods/staves because conventional invocations are awkward under attack. Dispelling attacks a mana construct, not every physical consequence: a fire started by magic can remain after the casting ends. Disruption can also make the situation worse. [Author's chapter 2](https://www.fictionpress.com/s/2961893/2/Mother-of-Learning).

**Interpretation:** a manual, a practice routine and a battle-ready focus solve different problems. Anti-magic should have a target and consequence rather than erasing everything tagged magical.

**Text, chapter 46, “The Other Side”:** repeated missile practice improves efficiency, while overcharging runs into a stability ceiling. Zorian experiments with low-power precision drills, an approach he conjectures will improve later full-power casting. The same chapter tests a golem: resistance to direct attacks does not prevent burial or immobilization. [Author's chapter 46, opening spar and golem tests](https://www.fictionpress.com/s/2961893/46/Mother-of-Learning).

**Interpretation:** measured improvement need not mean increased peak damage. Greater endurance, reliable execution and an answer to a different obstacle are useful mastery rewards. Zorian's proposed regimen is a character hypothesis here, not an omniscient statement about the sole correct training method.

**Proposal:** a prepared focus gives an accessible combat action; study unlocks a cheaper or more flexible variant. A warded opponent can resist the bolt while remaining vulnerable to terrain control or ordinary weapon damage. Exclude loop duration, soul mechanics and reset engineering from this lane; those belong to the systems dossier.

### 2. Cradle: compatibility and access shape progress

**Text, Underlord bonus scene, explicitly placed at chapter 7, PDF pages 4–6:** Kiro credits royal resources for reaching his current stage. The passage distinguishes conversion speed, steadiness, comprehension, spiritual perception and compatibility between Iron body and cycling method. Meira simultaneously heals and surveys nearby life through a gardening-derived technique adapted for combat. [Author-hosted bonus scene](https://www.willwight.com/uploads/9/0/7/1/9071768/underlord_extra_scene.pdf).

**Interpretation:** this is a stronger design reference than “cultivation gives all stats.” Good training can mean stable output rather than maximum throughput, and a trade skill can provide tactical information without becoming raw damage. Royal patronage is an access advantage, not proof that all progress requires nobility. Meira's simultaneous execution is explicitly exceptional in this scene; it should not become free multitasking for every player.

**Author:** the series page establishes growth from weak magic user to great strength, but does not document every Path or advancement rule. [Will Wight's Cradle page](https://www.willwight.com/cradle.html).

**Proposal:** earned cultivation could offer a stable foundation and a volatile high-throughput foundation. Herbalism could identify an enemy habitat or hazard before a fight. Body/cycling compatibility could change interruption risk rather than permanently invalidating a character.

**Gap:** no full early-core, split-core, Iron-body construction, Remnant, Lord-revelation or ascension ladder audit. Do not use those details as verified implementation requirements. The bonus scene is useful because it supplies a precise contrast without relying on Lindon's exceptional package.

### 3. Arcane Ascension: role packages and evolving specialization

**Text, Sufficiently Advanced Magic appendices I–II, PDF pages 1–3:** Judgment grants attunements in towers. Roles differ: Diviners gather information, Guardians reinforce bodies, Enchanters imbue objects, and Shapers manipulate solid mana/fields. Advancement includes functional changes, including defensive shrouds and additional mana access, with role exceptions. The narrator presents higher-stage claims partly as rumor. [Author-hosted first-book appendices](https://andrewkrowe.wordpress.com/wp-content/uploads/2021/06/aa1-appendices.pdf).

**Text, On the Shoulders of Titans appendix II, PDF pages 10–12:** specialization changes an attunement's output; generations of marks differ. Historical conversion required preparation of mana types, whereas newer versions can convert more freely. Autonomous functions consume mana. The lecture compares attunements with complex enchanted items and discusses imperfect artificial replication. [Author-hosted second-book appendices](https://andrewkrowe.wordpress.com/wp-content/uploads/2021/06/aa2-appendices.pdf).

**Interpretation:** role, specialization and infrastructure are separate axes. Recovered older equipment can have a preparation cost without being automatically worthless. A support identity can matter through equipment and information, not a compensatory universal damage multiplier.

**Proposal:** an original inscription discipline could choose between prepared charges and slower flexible conversion. Advancing unlocks a new action or preparation option; it need not simply double every number. Use different original names and access fiction.

**Gap:** exact safe-use limits, numerical rank thresholds, injuries, opposed mana interactions, advanced artificial attunements and protagonist-specific powers were not audited. The appendices are canonical text in the form of fictional instruction, not an excuse to promote every speaker's speculation to fact.

### 4. Mage Errant: a teaching mismatch is a lead, not a dead character

**Author/synopsis:** Hugh initially struggles to cast, with explosive failures; an unusual apprenticeship changes his prospects before a labyrinth test. This does not establish the precise reason for his failures. [Author's Into the Labyrinth page](https://johnbierce.com/books/into-the-labyrinth/).

**Author-authored introduction:** Bierce describes a science-inspired system with many kinds of magic, including stone, hair and bismuth. This supports narrow and unusual categories, but not specific affinity-acquisition or spell-construction rules. [Bierce's AMA introduction](https://www.reddit.com/r/ProgressionFantasy/comments/135k7r8/im_john_bierce_author_of_mage_errant_ama/).

**Author:** the Aetheriad books page states that its universes have distinct magic systems operating through aether under particular conditions. [Author's books/world description](https://johnbierce.com/books/).

**Interpretation:** an unconventional specialty and an appropriate teacher can be more interesting than declaring a character permanently deficient. Shared metaphysical terminology does not entail identical world rules.

**Proposal:** a failed basic technique yields a diagnostic clue and a different lesson, not an RNG reroll of the entire character. Specialized material knowledge could reveal a route or reagent use that general attack magic misses.

**Gap:** no chapter text retrieved from the accessible book page. Warlock contracts, affinity formation, language effects, mana reservoirs, wards and cross-world portability remain unverified. The substitute evidence above is adequate for these narrow design leads, not a technical Mage Errant adaptation.

### 5. Warbreaker: deployed power has an opportunity cost

**Text, prologue:** Awakening uses Breath, color and a Command. Object shape changes requirements. Vasher places Breath in objects, then recovers it from one he Awakened; while it is deployed, his own awareness changes. This scene does not establish universal recovery from every type of Awakened object. [Author's prologue](https://www.brandonsanderson.com/blogs/blog/warbreaker-prologue).

**Text, chapter 46:** Vivenna experiments with commands, consumes available color, and discovers that a useful thrown rope can become difficult to retrieve. Vasher advises keeping access to the rope rather than leaving power tied up unnecessarily. [Author's chapter 46](https://www.brandonsanderson.com/blogs/blog/warbreaker-chapter-forty-six).

**Text, Ars Arcanum:** Heightenings have different capabilities, but listed Breath requirements are estimates; some upper-tier powers remain unconfirmed in-world. [Author's magic appendix](https://www.brandonsanderson.com/blogs/blog/warbreaker-ars-arcanum).

**Interpretation:** deployed capacity can be recoverable while fuel is spent. A preparation specialist makes choices about allocation, retrieval and terrain; “recoverable” does not mean free. Numerical-looking fiction can still contain uncertainty.

**Proposal:** an original ward kit commits focus capacity to one device and consumes ink. Retrieving it restores capacity, not ink. Give a clear reclaim option and safe fallback when an expedition ends. This is a resource model, not a requested Breath economy or living-object adaptation.

## A bounded taxonomy: 16 families

These are recurring design patterns illustrated by the selected sample, not prevalence estimates. The fiction motif and proposed game operation are deliberately separated. Case numbers refer to the sourced passages above; they do not add unsupported novel-specific rules.

| Family | Fiction pattern / evidence anchor | Proposed YAIRPG operation | Limit that preserves decisions |
|---|---|---|---|
| 1. Restricted knowledge | Libraries, tutors and guarded traditions; cases 1–2 | Acquire a lead, then manuscript access | Two authored entry routes; no sole rare-drop gate |
| 2. Comprehension before execution | Study and practical control differ; case 1 | Read → understand → practice states | Reading completion alone grants no finished combat mastery |
| 3. Prepared vs flexible casting | Formula tools versus shaping; case 1 | Cheap prepared action vs adaptable slower action | Tool slot, preparation or stamina cost |
| 4. Capacity vs efficiency | More casts need not mean more reserve; case 1 | Lower cost or faster recovery as mastery reward | Cap each benefit; avoid infinite self-feeding savings |
| 5. Spell stability ceiling | Overcharging has boundaries; case 1 | Technique power ceiling and separate control rating | Bigger energy pools do not bypass every defense |
| 6. Diagnostic practice | Low-power experiments; case 1 | Choose efficiency or execution drills | One bounded practice objective at a time |
| 7. Body/method compatibility | Multiple talents and fit; case 2 | Foundation changes interruption tolerance | Early retraining, explicit tradeoff, no permanent blind choice |
| 8. Energy conversion style | Steady vs faster cycling; case 2 | Stable rate vs higher rate with preparation demand | Neither is universally best across expedition lengths |
| 9. Functional trade techniques | Gardening method used for perception; case 2 | Herbalism grants scouting or hazard clues | Information affects a choice, not all damage globally |
| 10. Social infrastructure | Patronage/apprenticeship/access; cases 2, 4 | Reputation opens tutor or workshop | Public/self-study substitute; social route changes cost |
| 11. Role packages | Information, reinforcement, enchanting; case 3 | Small original discipline kit | Same milestone reachable through different kits |
| 12. Practice-driven specialization | Attunement output adapts; case 3 | Choose a reversible specialization after use | Prevent accidental irreversible choices from routine idling |
| 13. Capability thresholds | New functions at stages; cases 3, 5 | Tier unlocks an action or conversion option | Show the qualitative reward before investment |
| 14. Narrow unusual affinities | Many material categories; case 4 author intro | Specialty reveals specific resource interactions | Do not simulate hundreds of materials in first slice |
| 15. Allocation and retrieval | Breath committed to objects; case 5 | Deploy/reclaim ward capacity | Account separately for consumed fuel and committed capacity |
| 16. Counterplay by mechanism | Disruption, physical effects, immobilization; case 1 | Enemy intent + damage/control/counter options | Match counters to effects; no universal dispel button |

**Interpretation of genre conventions:** Rowe distinguishes repeated skill use, conflict/reward and attempt/train/retry loops; he also argues for niches and partly separate attributes. These are the author's design positions, not binding definitions for all fiction. [Core-loop essay](https://andrewkrowe.wordpress.com/2022/11/03/progression-fantasy-core-loops/), [role/weakness essay](https://andrewkrowe.wordpress.com/2019/03/02/writing-progression-fantasy/).

The common game trap is to turn every fiction advantage into a permanent multiplicative bonus. A story can feature a prodigy, patron, exceptional method and artifact together because the author controls opposition. An idle game that stacks all four without limits makes alternative builds temporary detours.

## Lifecycle comparison and unknowns

The table summarizes only audited evidence. “Gap” is intentional, including where a reader may remember a rule from later books. Reset and portability belong in the design contract even when these sources do not answer them.

| Dimension | Mother of Learning | Cradle | Arcane Ascension | Mage Errant | Warbreaker |
|---|---|---|---|---|---|
| Acquisition | Library/manuals, instruction | Tutors/resources in sampled scene | Tower Judgment, then role instruction | Apprentice Choosing, synopsis only | Breath and Commands in sampled scenes |
| Prerequisites | Access status, control, practical formula | Body/method fit contributes | Role and available mana types | Exact magical prerequisite is a gap | Breath, color, valid Command |
| Practice | Shaping, casting, spar/testing | Cycling, comprehension, diligence | Specialization changes output | Exact routines are a gap | Experiments and teacher correction |
| Resources | Mana; formula tools | Aura converted to madra; patronage | Mana, conversion and item functions | Exact reservoirs are a gap | Committed Breath; color fuel |
| Advancement | Efficiency/control separate from reserve | Integrating powers; exact ladder gap | Functional stages; mark changes | Exact tier model is a gap | Capacity-associated capabilities |
| Costs/limits | Time, casting conditions, spell ceiling | Speed/steadiness/fit vary | Role limits and mana overhead | Explosive failures stated; cause gap | Fuel, capacity commitment, retrieval |
| Failure/recovery | Rest in spar; redesign/testing | Exact injury/recovery is a gap | Injury/recovery is a gap | Failure creates teaching problem | Failed Commands and reclaim in scenes |
| Social access | Guild restriction, academy | Royal resources and tutors | Towers and role geography | Academy and apprenticeship | Mentor instruction; wider market gap |
| Retention/reset | Loop engineering referred to systems lane | No reset rule established here | No reset rule established here | No reset rule established here | Local reclaim differs from character reset |
| Cross-world compatibility | Not established | Not established | Not established | Distinct universes stated; portability gap | Not established by selected passages |

**Proposal:** use a shared knowledge record with separate local energy, body and equipment state. Recognizing a spell pattern abroad can reduce study time without enabling immediate casting. Imported gear needs an explicit compatible fuel or a costly adapter. Travel is not rebirth, and no fictional breakthrough sampled here justifies erasing ordinary YAIRPG skills.

## Four proposed playable loops

All names, timing and rewards here are original proposals. They fit the existing adventure layer and can be prototyped within one region and one prestige layer. They are alternatives for creative selection, not four simultaneous implementation commitments.

### A. Damaged manual and two teachers

**Loop:** a village dialogue reveals a watchpost → an expedition recovers a damaged manual → restore it through Literacy/crafting or earn a mentor lesson through a service quest → practice one technique → apply it at the watchpost's sealed route.

**Decision:** acquire a prepared binding tool through craft, or learn a stance that withstands the obstacle. Both clear the same milestone; one keeps better resource economy, the other better sustained defense. Cooking supplies can replace some preparation cost without being compulsory.

**Idle shape:** recovery and restoration are bounded actions; practice stops when its requirement is met. Quest decisions wait for the player. Show “owned / understood / practiced” and one next lead, rather than three unexplained progress bars.

**Existing hooks:** books in `src/items.js`, reading rewards in `src/main.js`, sequential quests, dialogue and conditions. New comprehension/practice state is required; current books already give bonuses but do not establish this full lifecycle.

**Acceptance:** fresh martial and artisan characters obtain a useful technique without a lucky drop, complete the route, and reload without duplicating the discovery reward. The result should work before cultivation exists.

### B. Learn a spell's failure mode

**Loop:** study a small ward → test it on a training object → choose efficiency or quick execution → encounter a warded enemy → use dispel, physical attack or control according to its mechanism.

**Decision:** the fast focus wins a short encounter but uses a preparation charge; efficient sustained casting takes practice. A nonmagical stance remains a viable counter. Display enemy intent and why a counter succeeds before asking players to invest.

**Idle shape:** simulate deterministic practice at a safe station; automatic combat uses one saved rule and stops when fuel ends. No twitch input or mandatory live timing. Use authored diagnostic results, not a free-text spell compiler or random instant death.

**Existing hooks:** combat stances, equipment, crafting, skill practice. This requires actual new combat effects and browser verification; the current timed cultivation trial is not a spell combat engine.

**Acceptance:** two builds defeat the same obstacle with different preparation and report meaningful cost differences. A shielded enemy must still have a comprehensible alternative answer. Reload must preserve charges and selected practice.

### C. Survey, prepare and reclaim

**Loop:** Herbalism identifies a dangerous habitat → craft a ward kit or obtain a borrowed kit through reputation → deploy it for an expedition → recover the kit → spend survey knowledge on a safer route or a local material recipe.

**Decision:** commit focus capacity to a safety ward, or keep that capacity for a combat action and bring food/armor. A garden-derived survey benefits exploration directly. It does not multiply all rewards.

**Idle shape:** one active kit in the prototype; fuel exhaustion stops the supported action. Reclaim is available at the expedition summary, with an explicit rescue cost if needed. Avoid permanent capacity loss from tab closure or an unhandled location transition.

**Existing hooks:** Herbalism, Alchemy/Crafting, locations, equipment, reputation and dialogue. Capacity commitment and deployment bookkeeping are new work. Do not label an untargetable free-damage object a full companion system.

**Acceptance:** the UI reconciles total/free/committed capacity; retrieval restores only committed capacity, and reload cannot duplicate a kit or refund fuel. Craft and reputation routes are both practical.

### D. Earn a later cultivation initiation

**Loop:** ordinary expedition finds a circulation diagram → comprehend through study or mentor service → prepare through body training or herbal craft → choose stable or throughput initiation → unlock qi practice and a path-specific application.

**Decision:** stable foundation tolerates interruptions; throughput foundation accelerates a local technique but needs consumable preparation during difficult expeditions. Neither gives unrestricted bonuses to every profession. A character who declines initiation can continue the ordinary content and use gear/techniques to meet comparable challenges.

**Idle shape:** no random foundation roll. Initiation is a clear one-time choice, with reversible early retraining. Keep two alternative preparation routes and avoid demanding Literacy, every craft and every martial skill together.

**Existing hooks:** the Jade Hollow resources, body/preparation routes and trials already provide a review slice. Campaign gating, tutors, specialization and alternative non-cultivation continuation are proposals. They are not implemented by renaming the current buttons.

**Acceptance:** new characters earn access through two routes; characters with existing prototype progress keep access via migration. Cultivation state resumes correctly; the non-cultivation build can reach an authored equivalent milestone without being universally weaker.

## Small rule set, several interactions

**Original design, not canon:** the smallest promising subset of loops B/C is one portable ward and three rules. It needs no new profession or tier ladder.

1. A prepared ward occupies the character's single technique slot and needs one crafted or purchased charge per encounter.
2. It blocks one named incoming effect, such as a magical snare. It does not stop ordinary damage, heat already released or physical terrain changes.
3. The player chooses a safe stance or a ward as their preparation; the stance reduces incoming damage but leaves the snare active. A cleared encounter consumes the ward charge even if the enemy never used its countered effect.

Those rules create several choices from the same content: buy a charge to avoid leveling Alchemy, craft it for lower repeat costs, use a defensive stance and accept a slower fight, or scout through a quest/Herbalism clue so a charge is only spent where needed. Armor can make the stance route affordable; a quick offensive build can try to finish before the snare; a ward can protect an aggressive build at a recurring material cost. Reputation can unlock a vendor rather than grant another combat multiplier.

**Concrete encounter proposal:** a marsh sentinel alternates ordinary strikes and a telegraphed snare. The ward frees the technique slot's wearer from that snare but does nothing against strikes. The safe stance reduces strikes while prolonging the encounter. A scouting clue reveals that the dry route contains fewer snares but more armored enemies, giving existing stance/equipment choices another use. Every route reaches the same quest objective; none requires all professions. Tune combat durations and fuel costs through fresh-save playtests rather than asserting balance from this sketch.

**Implementation boundary:** this still needs a real effect, an equipment/technique-slot decision and trustworthy resource consumption. If the existing combat engine cannot support those cleanly, prototype one authored quest encounter before creating a general spell framework. Technique IDs, recipes, rewards and enemy hints matter more than inventing a second XP bar. The separate idle-game research lane owns comparisons with other compact emergent systems; this section only shows the magic proposal's interaction budget.

## Persistence, readability and idle contract

**Verified local foundations:** `BookData` stores reading time, skill metadata, bonuses and rewards; `do_reading()` adds Literacy XP and applies completion bonuses/rewards. `src/conditions.js` checks item/stat/reputation requirements. Skills include Literacy, Meditation, Weightlifting, Herbalism, Alchemy, Crafting and Climbing. `src/cultivation.js` stores schema 1 with local qi/body/preparation, trial and legacy state. It rejects unsupported cultivation schemas. Those are extension points, not evidence that a research system or all proposed gates already exist.

**Proposal data contract:** add a versioned knowledge namespace keyed by stable technique ID: acquired source, comprehension, bounded practice, chosen variant and application flags. Keep a deployed item's identity and committed resource in local world state. Derived bonuses recalculate on load; one-time rewards need receipt flags. Definitions and saves need separate versions so a tuning change does not erase discoveries.

Migration must keep known prototype cultivation characters admitted if campaign entry changes. A character who has only visited the review shortcut needs an explicit policy; do not infer mastery from a discovered-location flag. Save/reload tests should cover mid-reading, mid-practice, active deployment, advancement and the one authorized rebirth layer. Unknown versions must preserve the original save instead of quietly replacing it.

Closed-browser progress remains outside these proposals unless separately implemented. If catch-up is added, cap elapsed time, stop at resource exhaustion, and leave unknown discoveries and choices pending. Safe idle drills can advance routine practice; they should not silently select a permanent specialization, execute a risky experiment, or initiate prestige.

Show each technique's next requirement, use, cost and drawback together. Summarize why an activity stopped. Use a small prepared loadout so a player need not inspect every learned spell at each fight. Full hidden physics, hundreds of affinities and a sprawling prerequisite graph would obscure the decisions these references make interesting.

## Traps and safeguards

| Trap | What goes wrong | Proposed safeguard |
|---|---|---|
| Universal multipliers | Every path converges on the same best character | Unlock actions, information and bounded efficiency instead |
| Dead-end RNG entry | A player idles indefinitely without the foundational manual | Authored quest/mentor route; rare drops accelerate rather than enable |
| Grind every profession | Multiple paths become a checklist of mandatory skills | OR prerequisites with visible costs and viable substitutions |
| Prodigy entitlement | Every exceptional protagonist ability becomes free baseline power | Separate method, infrastructure, specialization and extraordinary exceptions |
| Automatic specialization | Idling accidentally locks a character into a bad build | Explicit choice after demonstrated use; preview and early retraining |
| Research as passive bonus shopping | Books become obligatory global XP multipliers | Each discovery solves an obstacle or changes preparation |
| Permanent failure without a lead | Flavorful mistakes become stalled progression | Diagnostic result, bounded loss and a recovery route |
| Imported power dominates | Travel makes local systems irrelevant | Local fuels, adapters, compatibility tags and opportunity costs |
| Prestige erases the interesting part | Relearning everything becomes compulsory repetition | Explicit retention preview; knowledge retention chosen on purpose |

## Inherited, acquired and learned magic

**Text, Mother of Learning chapter 62, “Improperly Used”:** Zorian explains that permanent enhancement rituals can grant abilities while reserving some of a human target's mana for maintenance. Ritual sophistication, materials and practitioner skill affect the cost. Blood magic can integrate an enhancement sufficiently for it to become inheritable. Magical creatures depend on adequate ambient mana; low-mana environments cause weakening rather than instant death. These are the chapter's explanations of fictional magic, not real genetic mechanisms. [Author's chapter 62, enhancement discussion before the shaping exercises](https://www.fictionpress.com/s/2961893/62/Mother-of-Learning).

**Evidence boundary:** the same chapter discusses an inherited explanation for Zach's unusual reserves as uncertain speculation. It must not establish a hereditary capacity rule. No dilution equation, Mendelian inheritance model, guaranteed stacking of family gifts or environmental induction of Mage Errant affinities was verified. Do not conflate a trained specialization with inheritance: the Arcane Ascension appendix's specialization changes are acquired through use, while its attunement “generations” describe revisions to granted marks, not biological generations.

**Supplemental sixth work, Mistborn: The Final Empire, Brandon Sanderson, original chapter 3:** Kelsier explains Allomancy as hereditary while saying ancestry alone does not guarantee strength. He demonstrates that metal supplies the resource Vin previously misunderstood as “Luck,” then tests a second application she did not know she possessed. The chapter presents access to one basic ability versus the full set; this is the character's early explanation, not an exhaustive account of later-series exceptions. These scenes distinguish inherited access, acquired fuel, conceptual knowledge and demonstrated execution. [Author's chapter 3, vial test and explanation](https://www.brandonsanderson.com/blogs/blog/mistborn-chapter-three).

**Author design explanation:** Sanderson says he designed powers around roles in a thieving crew and connected metal use with an industrial/alchemical feel. That is a useful design starting point: choose a job and interaction first, then the resource. [Author FAQ](https://faq.brandonsanderson.com/knowledge-base/how-did-you-come-up-with-the-magic-system-2/).

**Proposal/boundary:** use one fuel-consuming specialty with a trainer who reveals a second use of the same action. A calming technique might open dialogue while a defensive application affects combat preparation, with an explicit charge cost. Full-spectrum access should not be the automatic superior build. Do not import the setting's class hierarchy into a character-generation lottery. Precise metal counters, later inheritance changes and multi-system interactions need other chapters; no full-text acquisition is necessary for the narrow access/fuel/knowledge comparison already supported here.

**Interpretation:** an innate gift, an acquired permanent modification, a learned technique and a social family's access to tutors are four different advantages. Their effects can overlap without having the same origin. A lore label like “bloodline” does not imply a simulation needs breeding, purity scores or a superior ancestry.

**Original trait proposal:** a reversible “resonant perception” prototype gives earlier warnings when scanning a magical environment, but reserving that sense leaves less capacity for a combat focus. It reveals information; it does not supply the learned counter-technique. Three small constraints suffice: the sense reserves one capacity slot, works only near an active magical source, and can be suppressed before the next activity.

That trait interacts with Herbalism when identifying an unusual plant, Alchemy when choosing whether to refine it, and equipment when a dampening visor lets the character cross a noisy magical area without the warning benefit. A mentor offers a trained surveying method, while a crafted detector offers the same necessary quest clue at a consumable cost. No ancestry roll gates the quest. Choose/discover the trait through authored play for the prototype; whether it later has inherited flavor remains a creative decision. Food may supply ordinary expedition preparation, but no diet-induced permanent affinity is asserted from these sources.

Prototype recovery should mean resting, suppressing the trait or using the detector. Dangerous fictional enhancement rituals do not require random permanent crippling in an idle game. Permanent body changes, lineage systems and species adaptation belong to the other research lanes; this lane recommends only the capacity/technique distinction and bounded affinity interactions.

## Source-acquisition wishlist

Prioritized by unanswered design questions, not fame. Use author excerpts or a library/owned edition first. No purchase or book download was performed. The checked local catalog returned no matches for these English title strings; translated editions were not exhaustively searched.

| Priority / reference | Sections to consult | Design question / current evidence | Is more full text necessary? |
|---|---|---|---|
| 1. **Into the Labyrinth**, John Bierce, Mage Errant book 1, original English; lawful current publisher or author-linked edition | The apprenticeship diagnosis and initial lessons establishing Hugh's casting problem and affinity rules. Exact chapter numbers were not verified; locate by scene rather than inventing them. | Is the failure caused by teaching method, innate/acquired affinity, capacity, or another constraint? Official synopsis verifies failure and mentorship; author introduction verifies breadth of categories, but neither resolves those rules. | **Yes, targeted chapters are needed for precise Mage Errant affinity proposals.** An authorized excerpt covering the lessons may suffice; a whole-series acquisition is unnecessary. |
| 2. **Soulsmith**, Will Wight, Cradle book 2, original English; author-linked or publisher edition | Early body/foundation training and associated explanations of cycling. Chapter numbers and edition pagination remain unverified. | What body/method commitment creates a meaningful tradeoff, and what recovery or alternative training exists? The Underlord chapter-7 bonus establishes compatibility, speed/steadiness and access differences, not foundation construction. | **Yes if adapting precise foundation rules.** Not required for the original manual expedition or stable/throughput sketch. Acquire only after choosing that research question. |
| 3. **Mother of Learning**, Domagoj Kurmaic/nobody103, original English web serial | Chapters 2, 46 and 62, especially structured magic, missile refinement and enhancement maintenance. Use serial chapter numbering; a collected edition may divide volumes differently. | Can ability acquisition change resource maintenance without replacing learned control? The public chapters already support the sampled distinction; broader inherited transmission and later consequences remain unaudited. | **No additional acquisition needed now.** Read the lawful public serial linked above; an ebook is optional for convenience, not an evidence gate. |

Arcane Ascension's public appendices and Warbreaker's public chapters already cover the proposed role, preparation and allocation comparisons. Obtain additional books only if a selected mechanic needs rules those sections do not establish. Parent chat should reconcile this wishlist with the other lanes before recommending downloads.

## Coverage and integration recommendation

This sample covers acquisition, comprehension, body/method fit, practical casting, roles, specialization, preparation, counterplay, mentor access, local resource limits and recovery. It contains precise scenes from Mother of Learning and Warbreaker, a chapter-positioned Cradle bonus scene, and two Arcane Ascension appendices. Mage Errant contributes author-level breadth and teaching/access themes, with precise technical lore left open. No whole series or genre has been exhaustively audited.

The largest unresolved topics are early Cradle foundation mechanics, Mage Errant affinity/contract rules, Arcane Ascension injuries and advanced mana interactions, and canon portability across worlds. These are research gaps, not blockers for the original manual expedition. If a direct adaptation is later requested, obtain lawful chapter access and audit those exact rules before design uses them.

**Recommended integration, in order:** choose loop A as the smallest next ordinary-adventure slice; borrow loop B's limited counterplay after that route works; retain loop C as a focused crafting/exploration extension; use loop D only after the campaign placement decision. Parent chat owns accepted decisions and integration into PROJECT.md. No proposal here changes the existing prototype, save contract or accepted creative direction.

Self-review: primary links were opened during this pass; chapter titles, appendix headings and PDF page references were checked. Search snippets and fan-wiki results were not treated as lore evidence. Claims remain close to supporting links, fictional hypotheses stay qualified, and all numeric/progression choices for this fork remain proposals. Only this dossier was created by this lane.
