# Alternative power: preparation, dependencies and borrowed strength

Research date: 2026-09-30, America/New_York. Research/design lane only. No gameplay, shared design document, library metadata or save changes. All proposed rules await Weibao's creative review. None of these titles is declared a favorite or a requested direct fan setting.

## Recommendation

Build a shared discovery and preparation layer before another realm ladder. Power can come from knowing a procedure, supporting a living tool, earning institutional access, keeping a promise, or configuring production. Each should solve a particular obstacle and carry a particular dependency. Cultivation can then be an earned optional path alongside them.

The strongest near-term candidate is a **licensed relic expedition**: clues and a mentor teach containment, the player chooses a martial escort or craft preparation, and a constrained relic solves an obstacle ordinary damage cannot. An **occult initiation** is the strongest later alternative to cultivation, but should follow readable discovery and failure rules. Companion combat and factories need larger implementation work.

## Evidence and selection boundaries

Read first: `AGENTS.md`, `PROJECT.md`, `docs/EXPANSION_DESIGN.md`, `docs/REFERENCE_RESEARCH.md`; inspected the dirty working tree before writing. The cultivation prototype and setup changes were already present and remain untouched. Local source reads covered books, dialogue, quests, conditions, reputation, skills and recipe declarations. These reads establish integration points, not complete runtime coverage.

This dossier selects eight contrasting works/settings: Lord of Mysteries, Reverend Insanity, Shadow Slave, Warbreaker, Mistborn/Wax & Wayne, The Stormlight Archive, Pokémon and Factorio: Space Age. Five have original chapter or author-compendium evidence; the others use author lore, official player instructions or developer design documentation. Coverage is deliberately bounded, with no claim to exhaust an entire genre.

Selection has two separate bases. Stormlight has documented genre recognition: it appears on the 2025 Hugo Best Series final ballot, which is a nomination, not a win. The author's Wax & Wayne page describes the spinoff as a New York Times bestseller. The Webnovel pages for the three web novels show substantial reader activity and ratings, but those are platform popularity signals, not independent critical acclaim. Warbreaker is selected for the accessibility and precision of its original text. Pokémon and Factorio are contrasting game references, not evidence that their mechanics are universal novel tropes. [Hugo ballot](https://www.thehugoawards.org/hugo-history/2025-hugo-awards/), [Wax & Wayne](https://www.brandonsanderson.com/pages/the-mistborn-saga-the-wax-wayne-series), [Lord of Mysteries](https://www.webnovel.com/book/lord-of-mysteries_11022733006234505), [Reverend Insanity](https://www.webnovel.com/book/reverend-insanity_7996858406002505), [Shadow Slave](https://www.webnovel.com/book/shadow-slave_22196546206090805).

**Evidence labels:** Canon means what the consulted passage or official documentation actually supports. Interpretation means a design reading of that evidence. Proposal means original YAIRPG invention. Unresolved means the inspected sources do not establish the claim. Statements by fictional teachers and protagonists are attributed to them rather than treated as omniscient explanations.

### Local Lord of Mysteries edition

Consulted the catalog read-only using SQLite `mode=ro`, restricted to the relevant entry. The EPUB is cataloged as `诡秘之主最`, author `爱潜水的乌贼`, at:

`/Users/weiwei/Sync/CalibreLibrary/Ai Qian Shui De Wu Zei/Gui Mi Zhi Zhu Zui (1)/Gui Mi Zhi Zhu Zui - Ai Qian Shui De Wu Zei.epub`

Read via Python zipfile/XML without extraction into the repository. Internal locators consulted: `OEBPS/content.opf`, navigation, `OEBPS/Text/lotm_c_0019.xhtml` (第一部, 第19章 封印物), `lotm_c_0031.xhtml` (第31章 魔药), `lotm_c_0051.xhtml` (第51章 接地气的仪式魔法), and `lotm_c_0057.xhtml` (梳理和总结). The OPF identifies StarPress Publisher and a 2021 modification timestamp; this does not authenticate the edition. Navigation includes author notes and volume-relative chapter numbering, so numeric suffixes alone are unsafe later in the book. No library catalog or book text is copied here.

Chapters 19 and 31 were cross-checked against the official English publication. Chapters 51 and 57 exposed only short official previews through this web route. Their titles and opening passages align, but the later local details below remain edition-qualified. Use the local title plus internal locator to recheck them. [Official ch.19](https://www.webnovel.com/book/lord-of-mysteries_11022733006234505/sealed-artifacts_31208778930126601), [ch.31](https://www.webnovel.com/book/lord-of-mysteries_11022733006234505/potion_31326301566593179), [ch.51 preview](https://www.webnovel.com/book/lord-of-mysteries_11022733006234505/the-grounded-ritualistic-magic_31623410509473622), [ch.57 preview](https://www.webnovel.com/book/lord-of-mysteries_11022733006234505/organization-and-summary_31623483792353138).

## Concrete contrasting cases

### 1. Lord of Mysteries: access, initiation and learning are separate

**Canon, ch.31:** Dunn warns that consuming a potion is a commitment. Klein chooses among available pathways using incomplete information. A potion qualifies him to learn mysticism; it does not simply install the knowledge. The organization supplies a formula and ingredients, subject to stock, and assigns Old Neil as a teacher. Old Neil describes lower-stage preparation as ordered, measured mixing without an additional ritual. Klein expects digestion/acting to reduce negative effects, but that expectation is not a complete verified advancement algorithm. [Chapter 31, Potion](https://www.webnovel.com/book/lord-of-mysteries_11022733006234505/potion_31326301566593179).

**Interpretation:** A powerful initiation can be short once preparation exists. Time belongs in acquiring reliable knowledge, materials, access and practical competence. Requiring a long random crafting bar at every stage would miss this contrast.

**Proposal:** Separate `formula_verified`, `initiation_completed` and `applications_learned`. A mentor teaches safe survey work before the new character enters hazardous combat. Alchemy can reduce material waste; Literacy can identify instructions; neither automatically confers every spell. Buying an ingredient is an alternative to personally grinding Herbalism.

**Canon, ch.19:** Dunn presents contribution and approval as access conditions. The Nighthawks keep formulas and materials behind controlled access, with classified records requiring greater clearance. Sealed Artifacts have danger grades and restrictions; some influence surroundings and attempt escape. He explicitly warns that low-Sequence power does not make firearms irrelevant. [Chapter 19, Sealed Artifacts](https://www.webnovel.com/book/lord-of-mysteries_11022733006234505/sealed-artifacts_31208778930126601).

**Interpretation:** Institution membership can confer logistics, information and tools without being identical to raw character strength. A dangerous artifact is a procedure to manage, not just an unusually strong sword.

**Local, edition-qualified ch.51:** Old Neil explains suitable ritual timing for ordinary practitioners, optional timing support for Beyonders, dependence on external help at low Sequence, and the danger of invoking unknown entities. This is his teaching in the local passage, not a complete theorem about every god or ritual. **Local ch.57:** Klein distinguishes digestion from control and writes competing hypotheses about why acting helps. Those hypotheses should remain hypotheses. Locators: `lotm_c_0051.xhtml`, `lotm_c_0057.xhtml`; official previews linked above do not expose all these details.

**Proposal:** A ritual worksheet exposes the known recipient, ingredients, environment, intended effect and unresolved warning. Unknown lore can remain mysterious while the UI still explains the consequence category. Completing relevant survey or interpretation tasks earns understanding. Merely equipping an occult identity does not passively digest every potion.

**Unresolved:** Higher-Sequence rituals, pathway-switching conditions, exact acting principles, anchors, corruption exceptions and artifact-specific countermeasures need further original chapters. No claim here that paths freely combine or that prayer produces unlimited divine energy.

### 2. Reverend Insanity: a loadout is also a supply problem

**Canon, ch.6:** Fang Yuan's initial primeval sea is 44% of the aperture; the chapter links this to his C-grade aptitude and contrasts the social response to his brother. **Canon, ch.7:** The academy teaches ranks and aptitude expectations, and defines Gu Masters through opened apertures and using Gu. Fang Yuan searches for a remembered inheritance using wine as a lure, despite not knowing its exact location. This supplies both institutional and exploratory acquisition precedents. [Chapter 6](https://www.webnovel.com/book/reverend-insanity_7996858406002505/the-road-to-the-future-will-be-interesting_21545127210182261), [chapter 7](https://www.webnovel.com/book/reverend-insanity_7996858406002505/a-gu-master-has-9-ranks-flower-wine-leaves-behind-treasure_21545144658486902).

**Canon, ch.23:** Refinement, use and feeding are distinct. Moonlight Gu consumes petals; the Liquor worm drinks wine, with cheaper wine requiring more volume. Food, practice and replenishment cost money. Petals have storage limits, while wine can be stockpiled. A coming trader threatens local wine availability. Maintaining many Gu is constrained by affordability and usable essence, rather than a simple ownership cap. These are early-stage examples, not rules for every Gu. [Chapter 23](https://www.webnovel.com/book/reverend-insanity_7996858406002505/raising-a-gu-is-like-raising-a-mistress_21632255436843318).

**Canon, ch.9:** Primeval stones help replenish essence spent on refinement. Family support is entangled with adoption and inheritance rights, making patronage materially useful but potentially costly. [Chapter 9](https://www.webnovel.com/book/reverend-insanity_7996858406002505/two-people-who-start-on-the-same-road-gradually-becoming-distant_21545157006517880).

**Interpretation:** The relevant alternative is living equipment and its economy, even though this setting also has cultivation ranks. Access, maintenance and combat expenditure should be different quantities.

**Proposal:** An original symbiotic tool consumes one assigned ration per expedition, not per real-world hour. Better feed improves expedition endurance; low-grade feed remains viable. Exhaustion sends it dormant rather than killing it. Combat builds find components; artisans cultivate or buy supplies. Institutions offer a ration contract with an explicit fee or mission obligation. Do not import inherited aptitude ceilings as an irreversible character-creation lottery.

**Unresolved:** Immortal Gu uniqueness, later refinement probabilities, dao-mark conflict and complete ecology were not audited. The early academy's talent forecast is not proof of an unbreakable series-wide ceiling.

### 3. Shadow Slave: structured trials and a sharply legible limitation

**Canon:** The author's auxiliary compendium distinguishes trials with a central conflict, the ruined Dream Realm, and return/anchor Gateways. Aspects confer specialized powers and a Flaw. Memories are magical items; Echoes are autonomous copies without souls. Its early hierarchy explains transitions through return and subsequent Nightmares. The same document has broad early generalizations, so it should not certify all later exceptions. [Author compendium, The Nightmare Spell](https://www.webnovel.com/book/shadow-slave_22196546206090805/the-nightmare-spell_62497733776301988).

**Canon, ch.17:** Sunny learns that his Flaw prevents lying and immediately worries that questioning could expose his True Name and put him under another person's control. The chapter gives a concrete informational vulnerability, not merely a combat debuff. [Chapter 17, Three Simple Words](https://www.webnovel.com/book/shadow-slave_22196546206090805/three-simple-words_59975805215755360).

**Interpretation:** Horror and portal-trial structure can create power through learning a situation and resolving its conflict. The reading experience's surprise is not a good default for irreversible idle-game penalties.

**Proposal:** Preview an original vow such as “cannot use ambush stance while this pact is active.” Disable incompatible queued actions before execution and show why. A trial can end through escort, negotiation or destroying a threat, with knowledge retained on withdrawal. Finishing a trial grants a specific tool or route, not automatic rebirth.

**Unresolved:** Full late-series advancement, identity exceptions, crafting and drop probabilities were not checked. No claim that every Nightmare supports pacifism or that Echoes equal living bonded companions.

### 4. Warbreaker: allocate power, recover it, and shape the substrate

**Canon, prologue:** Vasher Awakens straw and a cloak using Breath, color, visualization and Commands. Humanlike shape reduces Breath requirements. He recovers Breath from the straw figure he Awakened, so allocation is not always permanent consumption. While reserves are invested, he loses benefits he otherwise has. Transferring Breath requires an intentional Command, but the scene also shows coercion around that requirement. Nightblood speaks and is dangerous; this passage alone does not establish its full later operating costs. [Author's original prologue](https://www.brandonsanderson.com/blogs/blog/warbreaker-prologue).

**Interpretation:** A craft build can gain strength by preparing a suitable object and assigning a limited reserve. Cost can be temporary commitment, not perpetual grinding. “Voluntary transfer” should not be simplistically equated with an ethical transaction.

**Proposal:** Prepare a flexible scout charm or rigid guard charm, assign one of two available charges, and recover it on return. Crafting determines supported behaviors or lower allocation cost. Allocation trades exploration help against combat protection. Use an original energy system and commands, without presenting the numbers or objects as Warbreaker canon.

**Unresolved:** Full Heightening thresholds, Lifeless permanence, Returned upkeep and Nightblood consumption need more chapters. No blanket rule that all Awakening resources are fully recoverable.

### 5. Mistborn/Wax & Wayne: countertechnology and bounded transfer

**Canon, author FAQ:** Metallic Arts depend on setting-specific spiritual/genetic access; people elsewhere do not simply rediscover them accidentally. Extreme direct divine fueling can destroy the corporeal conduit. **Canon, chapter-18 annotation:** Sanderson explains designing a gun for an Allomancer and guns against Allomancers, integrating magic with metallurgy and society. [Author FAQ](https://faq.brandonsanderson.com/knowledge-base/preservation-ruin-harmony/), [Alloy of Law ch.18 annotation](https://www.brandonsanderson.com/blogs/blog/annotation-the-alloy-of-law-chapter-eighteen).

**Interpretation:** Resource compatibility and engineered counters preserve the usefulness of mundane craft. Knowledge of another world's system does not imply eligibility to wield it.

**Proposal:** An imported force tool works only with a calibrated alloy cartridge and suitable anchors; an enemy using the same principle can be countered by a differently built shield. Local metallurgy can adapt a tool, but cannot grant every bloodline ability. Do not claim this particular device is canonical Allomancy.

**Unresolved:** Complete metal tables, Feruchemical storage arithmetic and exceptional transferable powers were not chapter-audited. An author's explanation of ordinary access does not eliminate all special cases.

### 6. Stormlight: a relationship and a commitment, not a church attendance bar

**Canon, author lore page:** Radiant spren bond with candidates and grant Surges; Orders have different oaths and Ideals. The page contrasts protective Windrunner oaths, justice-oriented Skybreakers and Lightweavers' personal truths. Dustbringers receive greater destructive powers through progression in their oaths. This prevents assuming every Order advances through identical moral tasks. [The Ten Orders of Knights Radiant](https://www.brandonsanderson.com/blogs/blog/the-ten-orders-of-knights-radiant).

**Interpretation:** An oath path can specialize both conduct and utility. It is not automatically divine faith, patron worship or faction reputation; those are separate relationships.

**Proposal:** A protector compact unlocks an escort defense; a truth compact unlocks evidence-based dialogue. Each uses visible quest conditions and a reversible suspension rule. Advancement needs a meaningful authored dilemma, not hundreds of trivial repeated affirmations. Default automation cannot choose a promise-breaking answer.

**Unresolved:** Exact bond damage, repair, Stormlight supply and every Ideal's requirements need original chapters. Temporary suspension is a YAIRPG recovery proposal, not a claim about repairing every broken canonical oath.

### 7. Pokémon: distinguish permanent development from temporary deployment

**Official game mechanics, BDSP:** Evolution can depend on levels, items, friendship and other conditions. Delaying evolution can change when moves become available. Its raising guide also offers party XP sharing and a Nursery, rather than requiring each member to independently grind every fight. **Official Mega Evolution description:** Only eligible Pokémon use a temporary transformation involving the Trainer's Key Stone, the Pokémon's Mega Stone and their bond. This is the site's stated fiction; it does not prove a numeric friendship threshold in every game. [Raising/evolution guide](https://diamondpearl.pokemon.com/en-us/trainersguide/fundamentals/raising/), [Mega Evolution](https://mega.pokemon.com/en-us/).

**Interpretation:** Companion development can branch by habitat, training and cooperation rather than copy the player XP ladder. A temporary battle mode should not replace the baseline identity.

**Proposal:** One original companion earns trust through shared expeditions. A marsh adaptation trades movement for environmental resistance; a courier adaptation helps carry supplies. Give previewed tradeoffs and a later retraining route. No friend-trading requirement in a single-player fork. Party XP and Nursery behavior are reference mechanics, not existing YAIRPG features.

**Unresolved:** A complete taming model, franchise-wide friendship formulas and reversible evolution are not established. Real biological evolution is not what Pokémon transformations model.

### 8. Factorio: power from reliable throughput and recovery routing

**Developer design evidence:** FFF-394 describes circuit-controlled recipe changes at craft completion, ingredient/working signals and a separate inventory for leftovers. FFF-414 describes automated planting/harvesting, environmental planting requirements, nutrient-fed biochambers, spoilage and ways to process its byproduct. It explicitly favors throughput over hoarding perishables and reports reducing many shallow plants to fewer inputs with richer processing. These are historical development posts, not a current-version behavior audit. [FFF-394](https://www.factorio.com/blog/post/fff-394), [FFF-414](https://www.factorio.com/blog/post/fff-414).

**Interpretation:** Engineering progression is a change in what a configured system reliably accomplishes. An economic build can prepare stronger expeditions without increasing personal damage directly.

**Proposal:** Start with a single workshop queue, a target stock and a reserve floor. Craft antiseptic until target reached, then stop; spend no protected ingredients. A spoiled expedition sample becomes compost or research residue. Keep degradation to simulated expedition time initially, so closing the browser is safe. This is a deliberate adaptation, not Factorio's timing rule.

**Unresolved:** Current logistic networks, quality odds, interplanetary recipes and combat balance were not played or exhaustively inspected. No factory simulation belongs in the first slice by default.

## Bounded biology supplement: species capacity is not learned technique

**Additional source candidate, not a ninth full case study:** Adrian Tchaikovsky's *Children of Time* has stronger documented acclaim than a platform popularity score: the publisher identifies it as an Arthur C. Clarke Award winner. The publisher-hosted 2026 recap is written by Tchaikovsky, not an anonymous synopsis. It says an uplift virus reaches a planet without its intended monkeys, that jumping spiders develop a civilization and ant-based technology, and that contact eventually becomes interspecies cooperation. Its *Children of Ruin* section describes a host-inhabiting organism whose destructive exploration later becomes negotiated interaction. This supports ecology, different technological substrates and symbiosis as research directions; it does not verify detailed inheritance, spider senses or neurobiology. [Book page](https://www.panmacmillan.com/authors/adrian-tchaikovsky/children-of-time/9781447273301), [author's recap, spoilers for books 1–3](https://www.panmacmillan.com/blogs/science-fiction-and-fantasy/children-of-time-recap).

**Precise official game contrast:** The BDSP guide describes species Abilities that change interactions, such as Levitate's immunity to Ground-type attacks and Klutz preventing held-item use. It separately describes individual Natures that favor one stat at another's expense. These are designed fictional rules, not evidence of real genetic inheritance. This is a useful split between a capability, its local counter and an individual tradeoff. [Official raising guide, Other Pokémon Attributes](https://diamondpearl.pokemon.com/en-us/trainersguide/fundamentals/raising/).

**Original proposal:** Keep four fields distinct: bodily capacity, learned technique, temporary physiological state, and equipped adaptation. For an original marsh companion, a thin permeable membrane could enable a wet-environment sensory action but make dry expeditions require protective salve. This fictional physiology is invented; it is neither a Pokémon fact nor a real-world medical claim. A sensory technique still needs practice, while the membrane merely permits its use. A crafted resonator offers the same basic detection to another species at a material cost. Neither ancestry is universally better.

| Small original trait | Interaction | Readable benefit, cost and substitute |
|---|---|---|
| Moisture-dependent sensory membrane | Environment + technique + Alchemy | Detect hidden wetland passage; dry route needs salve or disables this action. Buy salve or use a crafted detector rather than train every profession |
| Hard protective carapace | Armor fit + stance + Crafting | Resists a named physical hazard but cannot use one flexible climbing harness; tailor a shell harness or take a guarded ground route |
| Diet-dependent luminescence | Cooking + companion role + enemy behavior | Meal enables scouting light; light also alerts a specified nocturnal enemy. Choose dim mode, paid guide or lantern equipment |
| Temporary gill graft | Adaptation + supplies + exploration | Allows an underwater survey for one expedition; land travel loses this benefit. Remove/retrain at a safe handler instead of permanent species replacement |

These are development/adaptation choices, not lineage purity scores. Introduce a trait through observation, then a safe field test, then a previewed choice. Do not invent dilution percentages or ancestry combinations without a sourced fictional rule and a worthwhile player decision. Equipment adaptation, training, hired help and alchemy can provide alternative access. No trait removes the baseline campaign route or makes early saves obsolete. Cultivation roots and inherited magical affinities belong to the other research lanes; this supplement focuses on species, mutation and ecological compatibility.

## Taxonomy: 18 families, with concrete rule differences

The family names below are an analytical taxonomy, not a claim that all genres use them. Evidence anchors point to the cases above. The mechanics column is entirely **original proposal**. A trope describes a recurring narrative arrangement; a mechanic states what the player can choose and what changes as a result.

| Family and narrative trope | Evidence anchor or gap | Distinct proposed mechanic, constraint and recovery |
|---|---|---|
| 1. Occult pathway initiation: become something through secret knowledge | LotM ch.31 | Verified formula + mentor + ingredients unlock a restricted action set; training broadens use. No random permanent mutation on first initiation |
| 2. Ritual procedure: correct preparation opens otherwise inaccessible effects | Local LotM ch.51, partial official check | Assemble a known procedure and choose recipient/timing; unresolved hazards block automation. Withdraw with unused materials returned |
| 3. Role practice: power integration follows relevant behavior | LotM ch.57 preview/local, incomplete theory | Interpret clues or conduct surveys to complete distinct practice objectives; ordinary Meditation cannot advance every occult role |
| 4. External patron contract: assistance carries obligations | Local LotM ch.51 supports petition, not a universal contract system; RI ch.9 supports costly patronage | Sponsor provides supplies for a stated service; debt has a visible cap and termination route. Never a hidden permanent ownership trap |
| 5. Divine faith: power mediated by devotion or divine response | LotM synopsis/local ritual teaching; no complete faith economy verified | Optional shrine service unlocks a limited blessing and known renewal task. Universal faith-to-damage conversion is invention and rejected |
| 6. Oath identity: committed conduct shapes powers | Stormlight author lore; Shadow Slave is an imposed limitation, not the same trope | Equip one compact with two clear rules; contradictory action suspends its benefits after warning, with an authored restitution route |
| 7. Bonded companion: cooperation grants capabilities | Pokémon official raising/Mega descriptions | Earn trust through shared activity; assign scout or guard role. Retreat on exhaustion, retain bond, no offline abandonment |
| 8. Biological transformation: change what the body can do | Pokémon evolution as fantasy transformation; Shadow Slave compendium's later transformation ability | Choose one habitat adaptation with explicit benefit/cost; retrain later. No claim about real biology or universal mutation canon |
| 9. Living equipment/symbiosis: power needs a maintained organism | RI ch.23 | Prepare species-specific expedition rations; depleted tool becomes dormant. Separate food from activation energy |
| 10. Summoned constructs: tools act on assigned instructions | Warbreaker prologue; Shadow Slave Echo definition contrasts living bonds | Allocate a finite reserve to scout/defense behavior and recall it. No free extra damage with zero tradeoff |
| 11. Hazardous artifacts: useful objects require handling | LotM ch.19; Warbreaker prologue | Containment kit + qualification + one field charge; misuse causes recoverable contamination or early retreat. Visible protocol persists in journal |
| 12. Material-keyed capability: substrate determines access and counterplay | Mistborn author FAQ/annotation; Warbreaker shape costs | Recipe builds an effect-specific tool; wrong environment disables it before spending. Adaptation uses a clear converter recipe |
| 13. Alchemical transformation: composition changes function | LotM ch.31; local Alchemy source | Choose antidote, focus tonic or preservation treatment from common inputs; efficacy changes a hazard or deadline, not all stats |
| 14. Craft mastery: expertise changes quality and available designs | Warbreaker preparation interpretation; local craft systems | Complete one commissioned item and field test; unlock a utility trait or repair recipe. Failed experiment returns salvage |
| 15. Engineering automation: configuration replaces repeated execution | Factorio FFF-394 | Queue to target with reserve floor and completion-boundary switching; halt on missing input with a named reason |
| 16. Logistics/economic leverage: sustain what others cannot | RI ch.23, Factorio FFF-414 | Choose stockpile, delivery contract or preservation recipe. Route shortages change cost and schedule, never permanently remove core access |
| 17. Institution/faction power: permissions and facilities extend reach | LotM ch.19/31; RI academy examples | Contribution unlocks an archive or loan tool; maintenance fee/service is explicit. Nonmembers buy a slower independent alternative |
| 18. Collective and informational power: coordinate people or resolve a trial | LotM restricted artifact teams; Shadow Slave conflict trials | Fund an escort, assemble evidence or prepare a rescue; outcome changes route access. Collective force is a quest/service first, not simulated faction armies |

Families 4, 5, 8 and 18 have intentionally narrower canon coverage than their broad labels. They are design slots with evidence boundaries, not completed research on all pact, faith, mutation or nation-building traditions. No speculative slot becomes a mandatory campaign system merely because it appears in this table.

## Acquisition-to-retention map

These are **proposed lifecycle contracts** for original YAIRPG systems. They cover acquisition, prerequisites, practice, resources, advancement, costs, failure/recovery, social access, retention/reset and cross-world use. They do not summarize the complete canonical lifecycle of any book.

| Track | Acquisition, prerequisites and practice | Resources, advancement, costs and recovery | Social access, retention/reset and cross-world rule |
|---|---|---|---|
| Occult/ritual | Clue → translated manual or mentor → verified procedure → initiation → supervised applications; combat route retrieves text, artisan route restores it | Reagents plus focus; improve by varied successful applications; instability pauses use at a disclosed threshold; rest/containment restores safety | Institution offers trusted recipes; independent scholar offers slower verification. Keep known procedures on travel; local focus and equipment required. No automatic reset |
| Patron/faith/oath | Meet sponsor or shrine → preview obligation → accept compact → authored service | Supplies/blessing charges; milestones change permission or ability. Cap obligations; warn before breach, suspend benefit, offer exit/restitution | Relationship history stays; active agreement and local divine response may not transfer. Rebirth preview must say whether the agreement ends. No worship requirement for other builds |
| Companion/body/symbiote | Observe habitat → rescue, purchase or hatch original creature → trust/practice → optional adaptation | Food is paid for a launched expedition; effort creates role mastery; rest/dormancy is recoverable. Adaptation adds a tradeoff rather than universal stats | Handler or independent fieldwork are alternatives. Retain identity/trust on travel, check habitat before deployment. Only an explicitly selected world reset can remove development |
| Artifact/construct | Expedition or loan → identify provenance → test in safe workshop → qualify for deployment | Finite charges or reserved capacity; mastery reduces handling burden or adds a behavior. Contamination pauses the item; salvage and repair are deterministic | Faction license borrows rare tool; craft build makes modest substitute. Item remains owned across travel; effects require compatible substrate/energy. A cultivation reset must not delete unrelated relic state |
| Engineering/craft | Commission, salvage blueprint or mentor → relevant tool → prototype → field evidence | Inputs, workshop slot, throughput and upkeep; expand recipe choices/stock limits. Stop at reserve floor; restart from retained recipe and salvage | Guild access improves supplies, traders substitute for gathering. Retain blueprints; deployed facility stays in its world. Travel changes supply routes, not ownership |
| Logistics/institution/collective | Survey route → prove reliability through a quest → charter or contract → operate limited service | Money, supplies and contract slot; advance through an authored obstacle or delivered batch. Shortage pauses work, not an ever-growing debt clock | Standing unlocks service/clearance separately from skills. Retain history and maps; local reputation applies locally. Cross-world recognition requires a negotiated introduction or credential |

Cross-world compatibility should expose four facts per ability: **eligibility**, **fuel**, **substrate/environment**, and **local permission**. Portability of a recipe differs from portability of an installed machine; portability of an owned artifact differs from permission to use it. An ordinary martial or craft build remains able to meet a world's baseline challenges while investigating its unusual powers.

## Five proposed playable loops

All names, quantities and outcomes here are original, reversible proposals. They are candidate slices, not five simultaneous implementation commitments. Each can exist in the mortal frontier before cultivation. No new prestige layer is required.

### A. Licensed relic expedition: best first addition

**Loop:** Elder dialogue reveals a missing survey team → recover a field report by combat or restore its damaged copy through Literacy/Crafting → learn containment → borrow a route-specific relic or craft a weaker ward → prepare expedition → retrieve the team and a new recipe → return or repair.

**Decision:** A relic reveals an otherwise hidden safe crossing but occupies the preparation slot and requires a sealed case. A mundane rope-and-escort route costs more travel time but avoids contamination. Martial build clears a threat and gets an escort voucher; artisan build provides the ward/case. Both reach the rescue, with different rewards and costs. Neither needs qi.

**Connections:** Existing quests and flags stage discovery; Climbing and combat support the physical route; Literacy/Crafting/Alchemy support report repair and containment; quest reputation unlocks loans. No assumed direct dialogue reputation reward.

**Idle and save contract:** Queue only discovered stages. Stop at rescue dialogue, containment limit, defeat or missing supplies. Save stage ID, clue IDs, chosen route, charge and recovery condition. Reload cannot duplicate loan or rescue rewards. Borrowing is a quest flag plus item initially, not a generalized lending economy.

**Acceptance:** Fresh martial and artisan saves complete the expedition; a retreat retains the clue; a reload mid-stage resumes correctly; relic UI says what it can do and why ordinary damage cannot replace it.

### B. Occult survey and earned initiation: best later power branch

**Loop:** Find an anomalous inscription → obtain verified instructions through mentor service or document restoration → acquire common reagents through gathering or purchase → initiate → survey two distinct anomalies → unlock one controlled application.

**Decision:** One application exposes enemy defenses; another stabilizes a hazardous route. Preparation limits prevent equipping every application. Instability is visible before launch; below a disclosed safety margin auto-survey is allowed, otherwise rest or mundane investigation is required. Do not make the earliest ordinary village tutorial depend on occult initiation.

**Connections:** Literacy handles interpretation; Herbalism/Alchemy supply preparations; Combat tests revealed defenses; dialogue teaches a technique. Meditation can help recover focus if chosen, but does not turn focus into qi or make cultivation mandatory.

**Idle and save contract:** Practice requires relevant objectives, not infinite identical readings. Save acquisition, verification, initiation and learned applications separately. Rest can idle; hazardous commitments pause at threshold. At launch validate full ingredient cost, then resolve one unit atomically. Future offline support cannot bypass safety stops.

**Acceptance:** Players can explain the distinction between owning the manual and wielding its technique; merchant-funded martial and gathering-funded artisan routes are viable; old saves receive empty state; existing cultivation characters keep their progress.

### C. Compact and field obligation: cheap relationship prototype

**Loop:** Earn sponsor trust → preview a protector compact or a scholar compact → accept one → complete an escort or evidence task → use the specialized benefit → renew through another authored mission, switch or leave.

**Decision:** Protector grants a defense on an escorted expedition but forbids ambush while active; scholar enables an archive dialogue but requires submitting a found record before selling it. The UI previews benefit, prohibited action, exit cost and recovery. These rules are invented and should be reviewed for fun, not treated as moral judgments on the player.

**Connections:** Dialogue branches, stances, quests, items and regional reputation. Faction service and a paid independent route both unlock the next expedition; the compact improves a chosen role rather than all XP.

**Idle and save contract:** Automation stops before any ambiguous pledge decision; it never breaks a promise on the player's behalf. Save agreement version, benefits, explicit obligation and suspension status. Canceling releases future obligations and retains relationship history. No obligations accumulate while the browser is closed.

**Acceptance:** Each compact changes one meaningful action, can be declined without blocking campaign progress, and has a visible restoration or exit route after suspension. Do not attempt a dynamic morality engine.

### D. Field symbiote or companion: one role first

**Loop:** Track a creature → help or obtain it through a known source → prepare preferred food → deploy on a shared expedition → choose scout or guard practice → learn a habitat adaptation → rest/redeploy.

**Decision:** Scout reveals a gatherable cache or short route; guard helps withstand a specific ambush. Better feed extends the deployment; ordinary feed works. The creature cannot simultaneously guard and scout. A symbiotic lantern tool is a smaller first version than a full targetable ally.

**Connections:** Herbalism/Cooking supply feed, Running/Climbing support scouting, Combat supports guard practice, dialogue supplies handler knowledge, faction standing offers feed procurement. Purchase is a legitimate substitute for every profession.

**Idle and save contract:** Deduct the chosen ration once at launch. Exhaustion retreats or dims the tool; there is no real-time starvation. Save stable creature/item ID, role, bond evidence, adaptation and active deployment. Unknown newer IDs remain preserved rather than silently deleted. True targetable companions require a separate combat audit before implementation.

**Acceptance:** Ordinary feed can complete the first mission; scouting offers real utility to a low-damage build; guard changes an observed combat outcome; a reload cannot consume the same ration twice.

### E. Workshop and supply charter: ordinary craft can scale

**Loop:** Discover a damaged pump or supply bottleneck → obtain blueprint by salvage or commission → fabricate parts or buy them → configure one workshop queue → supply a field camp → unlock a safer expedition or vendor contract.

**Decision:** Spend common metal on repair parts for personal gear, or on pump capacity that supplies preparations. A charter can purchase raw inputs at lower margin, while an artisan harvests/processes more efficiently. This is throughput and opportunity cost, not passive infinite money.

**Connections:** Smelting/Forging/Crafting build parts; Cooking/Alchemy produce supplies; Haggling changes procurement costs; Combat secures salvage; quests and reputation recognize delivered work. Engineering can initially be a recipe/quest capability without adding another skill bar.

**Idle and save contract:** Queue target stock, protected reserve and one recipe; commit a batch only with all inputs present. Switch after batch completion and return leftovers. No sale loop that buys its own products profitably. Save queue settings and a finite in-flight batch; summarize completed, blocked and returned amounts. Keep time-based spoilage out of ordinary inventory until item timestamps and migration are explicitly designed.

**Acceptance:** Both purchased and self-produced input routes work; reserve floor is respected; reload cannot duplicate output; the camp unlock changes travel/preparation rather than only displaying a larger stock number.

## Existing-source fit and required new work

### Three rules that create several choices

**Original design, a compact version of loop A/D:**

1. One utility slot carries a scout lantern, containment case or ordinary climbing kit.
2. The scout lantern needs one expedition ration and reveals hidden routes; bright mode also raises a visible threat level in a dark habitat.
3. A ward reduces that threat for one expedition, using common ingredients or a merchant-bought preparation; a guarded stance and longer known route remain a supply-free alternative.

The lantern can be an engineered tool or a luminescent symbiote, with the same initial gameplay contract. Do not implement both until identity adds a meaningful difference. An expedition consumes the selected ration/ward once, cannot launch without them, and automatically retreats at the disclosed threat threshold. The numerical threshold is a later balance proposal.

| Choice | Interaction and real cost |
|---|---|
| Lantern + bought ward | Haggling reduces procurement cost; faster discovery costs money and occupies the utility slot |
| Lantern + self-crafted ward | Herbalism/Alchemy can supply the same consumable more efficiently, costing preparation time rather than cash |
| Dim lantern + guarded stance | Lower discovery throughput and slower combat exchange for lower threat; no need to grind a crafting profession |
| Climbing kit on the known route | Climbing creates an alternate traversal; misses the hidden cache, saves ration/ward and avoids light-sensitive enemies |
| Containment case + escort voucher | Quest reputation funds safe relic retrieval; gives up scouting and climbing convenience for the mission reward |

This produces equipment choice, diet/fuel preparation, environmental counterplay, a stance tradeoff, faction access and different build economics with one slot and two operating rules. The lantern reveals information; the ward manages exposure; ordinary equipment changes traversal. None multiplies every activity. Empty supplies halt the run, while ownership and learned routes remain intact. The idle-game lane's eventual dossier should supply the broader comparison of compact emergent systems; this example only tests this lane's power dependencies.

| Local anchor inspected | Verified declaration or boundary | Implication for proposals |
|---|---|---|
| `src/items.js`, `BookData` | Reading time, accumulated time, completion, required-skills metadata and reward fields exist | Good place to represent a manual, but actual gating/reward dispatch must be checked before treating fields as enforced |
| `src/quests.js`, `Quest`/manager | Staged tasks, rewards and repeatable/finished state exist | Acquisition and one-shot field tests fit quests; idempotent new reward behavior still needs save/reload verification |
| `src/dialogues.js`, `Textline` | Branches, flags, locks and item/unlock rewards exist; comment explicitly says textline reputation rewards are unsupported | Put reputation in a supported quest reward flow, not an assumed dialogue property |
| `src/conditions.js` | Tool, season, flag and regional reputation checks exist | Entry requirements can reuse these patterns; investigate missing-value handling for newly created factions |
| `src/skills.js` | Literacy, Herbalism, Cooking, Alchemy, Crafting, Smelting, Forging, Running, Climbing, Meditation and Haggling are declared | Reuse relevant skills, do not require every character to train each one |
| `src/crafting_recipes.js` | Native recipes select crafting skills, including Alchemy | Start with authored recipes/commissions; do not claim arbitrary ritual or production queues already exist |

Companion AI, generalized contracts, relic containment, safe automation and offline catch-up are new systems, not baseline capabilities established by these reads. A quest-based helper or single workshop queue is a smaller acceptance target than a party engine or simulated economy.

## Design traps and recovery rules

| Trap | Concrete substitute |
|---|---|
| Every path becomes an all-stat or all-XP multiplier | Give each a unique application, enemy counter, route or production capability, with a finite loadout/preparation budget |
| A rare drop or inherited aptitude permanently gates the campaign | Authored clue/mentor/purchase alternatives; rare loot accelerates entry. Disclose specialization tradeoffs before commitment |
| Everyone must grind Herbalism, Cooking, Alchemy and Forging | Self-supply, trade and quest-service alternatives. Specialist efficiency should change cost or utility, not determine whether the build can play |
| Random ritual corruption irreversibly wrecks an idle character | Visible preparation thresholds and exposure warning; failure retains knowledge and sends player to a safe recovery stage |
| Pets, debts and factions punish time away | Charge finite launched missions, pause at limits, keep passive relationships stable when offline. No involuntary promise choices |
| Every world adds a renamed qi pool | Change eligibility, operating dependency, obstacle and advancement evidence. A fuel-fed workshop and social compact need not have energy bars |
| Every imported power works everywhere | Compatibility worksheet with supported effects, missing fuel/environment and explicit conversion recipe; basic local alternatives remain viable |
| Flavor hides a mechanic the player needs to know | Mystery concerns identity and motive; UI still states resource costs, recoverable consequence category and safe next step |
| Creature feeding, cooldowns and workshop upkeep bury the player in chores | One ration per mission, summary status, target stocks, safe dormant state and automatic stopping |
| Prestige silently erases cross-system progress | Travel changes context; advancement unlocks actions; reset is optional and previews exact namespaces/resources affected |

An original power system should supply an answer to “what can I now do differently?” A new label, lore paragraph or leveling bar without that answer is not implemented gameplay.

## Persistence, readability and acceptance contract

Use additive, independently versioned state with stable IDs. A proposed `alternative_power` namespace could contain discovered procedures, qualifications, owned helpers, agreements and queue state; exact schema should follow a later implementation audit. Defaults must leave existing saves playable. Do not move ordinary skill, item or reputation ownership into a new competing source of truth.

Travel preserves knowledge and owned objects while recalculating eligibility and local availability. Existing prototype cultivation state stays intact if access moves behind a discovery gate. If new reset rules affect other power systems, explicitly choose compatibility and show a loss/retention preview before confirmation. Current cultivation-only rebirth should not unexpectedly delete companions, loan flags or workshop blueprints.

Persist discrete commitments, not UI timers alone: which mission/recipe, resources reserved, stage, elapsed simulation work, output already granted, stopping condition and pending authored choice. On reload, rebuild effects from state and avoid granting rewards again. Recipe changes happen after the current committed batch; canceled reservations return unused inputs. Shared item mutation needs one transactional path across inventory and storage.

The first UI needs a compact card: discovered lead, acquisition route, prerequisites, operating supply, benefit, limit, recovery and next evidence objective. Show “known but unavailable here” separately from “not acquired.” Filter inactive systems. A blocked automation summary should name the missing input or pending decision, not simply show zero production.

Offline support remains an implementation gap. Before enabling it, specify eligible safe work, elapsed-time cap, batch boundaries, supply exhaustion, defeat, contamination limits and authored-choice stops. Reuse the same resource accounting in active and catch-up progression. For the first alternative slice, active-time-only behavior is acceptable if stated; it must not claim offline progress.

Playable acceptance should demonstrate two viable builds, application to a real obstacle, recoverable withdrawal/failure, old-save defaults, mid-stage save/reload, and explicit reset consequences. Browser rebuild and exercise are required for implementation. This dossier does not claim to have passed any new gameplay gate.

## Coverage, gaps and self-review

Delivered coverage: 18 families; eight contrasting works/settings; precise case studies in LotM ch.19/31, RI ch.6/7/9/23, Shadow Slave ch.17 plus its author compendium, Warbreaker's prologue, and the author's Alloy of Law ch.18 annotation. Official Pokémon instructions and developer Factorio posts provide equally precise game comparisons. Five proposed loops map to existing skills, combat, crafting, exploration, dialogue and reputation, with alternatives, recovery and save contracts.

Deepest evidence is early-stage power acquisition, maintenance, material dependencies and social access. Faith economies, patron negotiation, body mutation, faction-scale armies and superhero-specific systems remain under-sampled. Horror/portal mechanics are represented by Shadow Slave and occult danger by LotM; this does not constitute an infinite-flow genre survey. For a further bounded pass, use original superhero chapters or official RPG class documents to test pact repair and engineered augmentation, and an original institutional/economic fantasy text to test collective power. Those are research needs, not extra current implementation tasks.

Access gaps have substitutes: the local LotM EPUB supplements truncated official ch.51/57 previews, with edition uncertainty preserved; ch.19/31 provide fully readable official evidence. Stormlight author lore supports oath contrasts without pretending an entire book was read. Mistborn author FAQ and chapter annotation support compatibility/countertechnology without asserting a complete metallic magic audit. No paid access or unofficial download mirror was needed.

Source review: broad searches returned similarly named fanfiction; it was excluded. Webnovel book IDs were checked against the official title/author and chapter catalog before use. Reader reviews are not lore evidence; only platform popularity context is drawn from their parent listings. No direct quotations or reproduced book passages appear in this dossier. Canon summaries are short, links sit beside the claims, later local-only details are marked, and proposed numbers/penalties are not attributed to novels.

Remaining gate is creative selection and then a rebuilt browser slice, not more setup. Recommended order within this lane: relic expedition first; earned occult survey next if wanted; compact as a bounded relationship experiment; helper and workshop only after their supporting runtime is scoped. This file is exclusively research and proposals for parent-chat integration.

## Source-acquisition wishlist, maximum three titles

| Priority and exact reference | Design question and passages to consult | Already available; is more text necessary? |
|---|---|---|
| 1. *Children of Time*, Adrian Tchaikovsky; English Pan edition, ISBN 9781447273301, or a lawful library/owned edition | How do spider embodiment, inheritance and ecological relationships actually change communication and technology? Consult the Portiid-development and ant-technology sections. Exact chapter numbers have not been verified and must be located from the chosen edition | Publisher synopsis establishes the premise/award; the author's recap establishes uplift, ant-based technology and cooperation. Full original text is useful before claiming specific sensory, inherited-memory or physiological rules, but is unnecessary for the original marsh-trait prototype above |
| 2. *Warbreaker*, Brandon Sanderson; English author's free online text | When is invested Breath recoverable, and how do living/nonliving substrates and advanced Commands change that rule? Start with the verified prologue, then locate instruction scenes through the author's chapter navigation; later chapter numbers are not invented here | The public prologue already supports allocation, recall and shape costs. No book purchase/download is needed; further free chapters are enough for a deeper reserve/construct pass. Full-text reading is unnecessary for the first single-slot utility design |
| 3. *Lord of Mysteries / 诡秘之主*, Cuttlefish That Loves Diving / 爱潜水的乌贼; Chinese original or authorized English edition | Verify the complete ritual teaching and digestion hypotheses against an authenticated edition: 第一部 ch.51 接地气的仪式魔法 and ch.57 梳理和总结; later artifact cases should be chosen by named artifact before assigning chapter numbers | Local EPUB supplies these passages, but edition provenance is unverified; official public previews confirm only the beginning. No new download is needed for current proposal work. An authenticated owned/library edition would resolve provenance if exact later ritual rules become implementation inputs |

Mistborn ch.3 and the author's magic-design FAQ were additionally opened as parent-supplied discovery leads; their detailed inherited-access/consumable analysis belongs to the Western lane, so it is not duplicated here. [Public original ch.3](https://www.brandonsanderson.com/blogs/blog/mistborn-chapter-three), [design FAQ](https://faq.brandonsanderson.com/knowledge-base/how-did-you-come-up-with-the-magic-system-2/). No books were purchased or downloaded on the user's behalf.

## LOTM follow-up: full-text availability and deeper pathway trace

Requested follow-up, 2026-09-30. This section extends and qualifies the early LOTM sample above. It remains research and original gameplay proposals, not authorization for a direct adaptation or an implementation.

### Is the local EPUB the full book?

**It appears to contain the complete first novel's main story.** Its navigation has 1,394 numbered main-story chapters, all pointing to distinct existing content files. There are eight volume divisions. The last main-story entry is 第八部 第41章 新的旅程, `OEBPS/Text/lotm_c_1437.xhtml`; its body reaches an explicit end-of-book marker. The official English catalog also ends the main story at chapter 1394, *A New Journey*. The local file then includes completion notes and eight ordinary-person side-story chapters. [Official catalog](https://www.webnovel.com/book/11022733006234505/catalog), [official main-story ending](https://www.webnovel.com/book/lord-of-mysteries_11022733006234505/a-new-journey_47290778506034962).

This means no installation or new download is needed for targeted research. It does **not** mean this edition has every later bonus chapter: the official catalog includes additional *In Modern Day* and *That Corner* material not present in this EPUB's navigation. Nor does it include the sequel merely because it includes the first novel's ending.

The archive contains 1,450 `lotm_c_*.xhtml` content members, which also include author notes and announcements. Those are not 1,450 story chapters. A structural scan found no missing main-story target. The six very short content members found in the scan are announcements/notes rather than numbered main-story chapters. The text contains scraped-site boilerplate, and some markup is not strict XML; paragraph extraction was therefore made tolerant without altering the EPUB. Main-story coverage looks complete, but paragraph-by-paragraph authenticity and transcription accuracy are unverified.

**Availability is separate from research coverage:** this pass indexed the book and consulted selected relevant passages across early, middle and late volumes. It did not read all 1,394 chapters sequentially or fully audit all 22 pathways. The official early chapters corroborate some details; later official web views often expose only an opening preview, so the later trace is explicitly **local text, edition-qualified**. The Qidian book-page request failed in this pass and is not claimed as verification.

### A correction to the initial explanation

The ch.31 warning about not automatically acquiring mysticism knowledge should not be generalized into “every potion grants only eligibility and every ability must be learned from scratch.” In 第二部 第83章 魔术师, the narration describes awareness of granted spells after ingestion. In 第三部 第37章 命名, Audrey gains knowledge of her new abilities after recovering control. Practical application, external lore, experience and digestion still matter. **Canon boundary:** some abilities arrive with their own knowledge; that does not confer complete expertise in every field. Local locators `0300` and `0531` below.

The earlier ch.57 hypotheses also have later, stronger evidence. In 第一部 第158章 有备无患, Derrick reports the acting caution taught in the City of Silver. In 第167章 圣物, Crestet explains the potion-name/behavior connection and says the core rules are shared but individual boundaries differ, making another practitioner's experience a reference rather than an exact script. The warning to retain one's identity is a limit on acting, not an invitation to permanently become a caricature. Local locators `0160`, `0169`; [official ch.158 preview](https://www.webnovel.com/book/lord-of-mysteries_11022733006234505/preparedness-averts-peril_33320163914863356), [ch.167 preview](https://www.webnovel.com/book/lord-of-mysteries_11022733006234505/holy-artifact_33320573530593105). Those previews establish chapter identity, not all later details.

### Four central pathway traces

**All canon below is limited to the cited local passages, with edition uncertainty retained.** Sequence names here identify stages; they do not imply every other stage has been researched. The gameplay column is original invention.

| Pathway trace | What the consulted text actually shows | Proposed gameplay identity |
|---|---|---|
| Seer: 占卜家 9 → 小丑 8 → 魔术师 7 | Ch.31–33 separate initiation from guided Meditation/Spirit Vision control. Ch.126 shows that divination can omit detail and symbols can be misread. Ch.169 gives improved bodily coordination and practical adaptation. 第二部 ch.83 grants rapid spells with particular operating requirements; ch.95 shows advance placement of flames helping under combat pressure | Gather clues → interpret a bounded prediction → prepare materials/escape route → execute. Knowledge supplies a counter or route; equipment and stance make it usable. No automatic perfect-information button |
| Spectator: 观众 9 → 读心者 8 → 心理医生 7 | Ch.52 demonstrates detached observation of behavior, not universal telepathy. Ch.65 describes the next stages' more mystical observation and direct influence. 第三部 ch.37 shows Audrey's dangerous transition, Susie's calming help, and new fear, suggestion and calming abilities; calming can fail | Observation → evidence-backed dialogue → support/control tools. A recovery technique can assist another build, while protection, weapons or bought artifacts cover its attack limitations |
| Sleepless: 不眠者 9 → 午夜诗人 8 → 梦魇 7 | Rozanne's ch.22 account gives dark vision, reduced sleep needs and stronger nighttime capability, but still needs specialized ammunition for some threats. Ch.127 compares sleep/dream charms with the later stages' innate abilities. Ch.141 demonstrates Dunn entering Klein's dream | Choose night expeditions and conserve illumination supplies, while preparing the correct weapon/ward. Later unlocks change access to dreams or methods of control, not simply night damage. Use simulated game time, not the user's bedtime |
| Mystery Pryer: 窥秘人 9, with 巫师 7 and 星象师 5 sampled | Ch.22 presents ritual knowledge; ch.65's archive lacks the Sequence-8 entry. 第三部 ch.82 shows unwanted knowledge/whispers driving Cattleya toward instability and source isolation helping her. Ch.83 shows glasses suppressing what her enhanced sight reveals. This pass does not fill every missing intermediate stage | Controlled research → useful procedure → decide what exposure to permit → shield/filter → apply. A filter trades information for safety. This path cannot be reduced to “Literacy generates all spells” |

**Shared acquisition and limits:** the ch.19/31 institutional route supplies restricted formulas, materials and a teacher. That supports one canonical acquisition route, not a monopoly on every pathway. The independent market and commissioned artifact scenes show other channels. For each future selected class, verify its actual formula source and accessible next stage rather than assume the protagonist's church supplies everything.

**Practice is not one universal XP activity.** Seer interpretation, Spectator observation, Sleepless environmental use and Mystery Pryer research are distinct opportunities. Meditation helps control or recovery in the sampled passages; it does not replace every pathway's acting principles. Treat a compact set of authored application objectives as the first prototype, avoiding compulsory repetitive social tasks or real-world sleep scheduling.

**No universal failure recovery is claimed:** the book contains lethal and irreversible outcomes. Susie's calming help and isolation of incoming whispers are specific interventions in specific situations. A visible strain threshold, automatic retreat and safe rest are proposed idle-game recovery rules, not promises of universal canonical cures.

### Three additional directions worth considering

| Additional trace | Local evidence and limit | Original game opportunity |
|---|---|---|
| Savant: 通识者 9 → 考古学家 8 → 鉴定师 7 | 第一部 ch.65 links knowledge of materials/devices, field/ruin expertise and identifying extraordinary item capabilities/problems. It does not prove identification removes a drawback or give the complete later crafting tree | Craft an expedition tool → inspect a relic → choose a containment method. Knowing a downside can make an item usable without making it harmless |
| Sailor: 水手 9 → 暴怒之民 8 → 航海家 7 | Ch.6 describes balance, swimming and a bounded unassisted dive. Ch.65 describes anger-associated strength and later navigation/environmental knowledge. Some details are teachings/archive descriptions rather than omniscient guarantees | Navigation and water capability reduce route cost, while equipment offers another route. A temporary water tool can supplement a land build without turning every character into a sailor |
| Reader: 阅读者, with 守知者/侦探 7 and 博学者 6 sampled | 第二部 ch.206 records Klein distinguishing reasoning-heavy detective competence from a later change in capability. His broad inference about other pathways is still his inference. Specific ability-copying rules were not established in this pass | A knowledge build can progress through solving evidence problems and practical tests. Do not implement unrestricted spell copying from the name “Polymath” alone |

These directions help keep crafting, exploration and investigation central. They are seven sampled identities, not a recommendation to implement seven class trees. Apothecary/monster-bonding, Hunter, Prisoner and other pathways need their own precise trace before claiming actual acquisition, evolution or companion rules.

### Five deeper interactions that the early sample missed

1. **Consumables can borrow a capability without copying a whole path.** Ch.127 names sleep, calming-spirit and dream charms, describes low-grade spirituality fading, and contrasts their effects with abilities some Nighthawks already possess. **Proposal:** buy/craft a dream-access charm for one expedition, or develop the relevant personal technique for repeat access. Do not import the canonical two-week degradation into unattended player inventory without save timestamps and a reviewed offline policy.

2. **Preparing the environment can matter more than raising stats.** 第二部 ch.83 requires fire for flame jumps and prepared paper figures for substitution. Ch.95 demonstrates the value of having placed fire sources beforehand. **Proposal:** one preparation slot selects escape paper, a fire route or purification gear; enemy/environment tags determine what works. Crafting supplies alternatives to permanent investment, while a martial stance exploits the prepared opening.

3. **Artifacts solve weaknesses and introduce independent drawbacks.** 第二部 ch.132 describes the Sun Brooch's useful purification effects and persistent heat burden; isolating its outward purifying effect does not remove the negative effect. Klein plans situational use and ordinary ammunition instead of always carrying it. **Proposal:** an original purifying relic handles an undead obstacle but creates heat strain, making cooler routes, shorter use and a bought consumable meaningful alternatives. Ordinary insulation is not assumed to counter supernatural heat unless that is explicitly authored.

4. **Power materials can circulate between people, potions and objects.** 第二部 ch.5 explains characteristics remaining after death and being usable as material or extraordinary objects. 第一部 ch.144's diary and ch.203's information describe restricted higher-stage substitutions between particular pathways, rather than unrestricted mixing. **Proposal:** scarce components have competing recipe uses, and a compatibility map limits adaptations. Offer trade, commission or exploration sources so recycling does not turn into mandatory hunting of people. Full loss-of-control mathematics and all exception cases remain unverified.

5. **Late advancement changes the kind of requirement.** 第五部 ch.108 gives the Scholar of Yore formula a historical detachment requirement and discusses the protagonist's unusual situation. 第四部 ch.34 presents Roselle's account of followers acting as anchors against instability; this is evidence for a social stabilizing dependency, not a universal “faith = damage” conversion. **Proposal:** later advancement might require a completed archive expedition or sustained public identity, while an early village build needs neither worship nor a simulated three-century wait. A recipe, digestion, a ritual condition and social support are separate requirements, not four names for XP.

### Smallest useful original LOTM-inspired loop

Use **three rules** initially: an action requires its evidence or material; one prepared utility occupies the expedition slot; strain ends unsafe automation at a visible limit. The abilities and costs below are original YAIRPG design, not canonical items or numeric rules.

| Choice at the same haunted ruin | Interaction and cost |
|---|---|
| Investigate first | Literacy and a clue report reveal the enemy/route tag; spends time but prevents wasted preparation |
| Prepare a ward | Alchemy or a purchase supplies purification; gives up an escape aid in the utility slot |
| Prepare an escape aid | Crafting or a purchase allows a safe withdrawal from one ambush; does not solve the undead obstacle |
| Take the known exterior route | Climbing plus ordinary gear reaches the objective more slowly; no occult initiation required |
| Use faction support | A completed service quest loans the relevant tool; the loan has a visible return condition, while independent routes remain available |

One clue can change the preparation choice; one item can cover a missing personal ability; a stance can change exposure; an environment can make a tool useful or burdensome. Knowledge, materials and restraint create depth without requiring every profession or an entire Sequence tree. A later power initiation adds another way to approach the same world rather than replacing ordinary adventure.

Persist clue IDs, known procedures, initiation/stage, learned applications, equipped utility, reserved materials and strain separately. Travel does not consume or reset them. New knowledge must not duplicate quest rewards on reload. Existing cultivation-only rebirth does not erase these states. Starting with no passive charm decay and no offline hazard resolution avoids silently adding timestamp semantics to old items.

### Local trace locators and remaining limits

All identifiers below refer to `OEBPS/Text/lotm_c_XXXX.xhtml` inside the same local EPUB named above. Volume-relative chapter numbers must accompany member IDs because inserted author notes make member suffixes differ from chapter numbers. Later web previews were not used to pretend their omitted bodies had been officially read.

| Local locator | Volume and chapter | Used for |
|---|---|---|
| `0006`, `0022`, `0065` | 第一部 小丑, ch.6 非凡者; ch.22 序列起始; ch.65 非凡者资料 | Sailor entry, Sleepless progression, archive pathway contrasts |
| `0031`, `0032`, `0033` | 第一部, ch.31 魔药; ch.32 灵视; ch.33 “开关” | Initiation, taught perception/control, expenditure and rest |
| `0052`, `0057`, `0126`, `0127` | 第一部, ch.52 观众; ch.57 梳理和总结; ch.126 占卜不是万能的; ch.127 铺垫 | Observation, initial acting theory, limited divination, substitute charms |
| `0143`, `0160`, `0169`, `0170`, `0171` | 第一部, ch.141 梦魇; ch.158 有备无患; ch.167 圣物; ch.168 “小丑”魔药; ch.169 新的能力 | Dream application, acting caution/individual boundaries, advancement and bodily control |
| `0146`, `0147`, `0205`, `0214` | 第一部, ch.144 3方交易; ch.145 合作的请求; ch.203 “异种”; ch.212 复仇者 | Restricted higher-stage substitution and ritual requirements, as revealed then |
| `0221` | 第二部 无面人, ch.5 免费的常识 | Characteristic persistence and material/object use |
| `0300`, `0312`, `0351`, `0428` | 第二部, ch.83 魔术师; ch.95 有准备的“魔术师”; ch.132 太阳胸针; ch.206 心愿 | Granted spell knowledge, field preparation, artifact burden, Reader sample |
| `0531`, `0578`, `0579` | 第三部 旅行家, ch.37 命名; ch.82 知识逐人; ch.83 窥秘之眼 | Spectator transition/support, knowledge pressure, perception filter |
| `0788`, `1086` | 第四部 不死者, ch.34 诸神的“锚”; 第五部 红祭司, ch.108 “量身定做”的仪式 | Social stabilization account and distinct late ritual |
| `1361`, `1437` | 第七部 倒吊人, ch.55 特殊的6条途径; 第八部 愚者·共, ch.41 新的旅程 | Later cosmology qualifies early explanations; main-story ending |

The late cosmology passage was checked to avoid presenting early guesses about all power origins as timeless complete truth; a detailed cosmology, every pathway's final abilities and complete switch/retention rules are still outside this pass. Final-pathway labels, secondary mutations and sequel changes should be separately verified if selected. Chapter-level trace is now substantially deeper than general information, while full sequential reading and all-pathway coverage remain unclaimed.
