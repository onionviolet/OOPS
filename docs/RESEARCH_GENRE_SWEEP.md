# Progression fantasy sweep: creatures, roles and scenario rules

Research date: 2026-10-01, America/New_York. Status: future implementation findings and original design proposals. No gameplay, roster, world, balance or additional prestige layer is selected by this document.

Requested scope: broaden the existing research across progression fantasy, including monster taming, other paths, different scenarios and practical implementation approaches; the follow-up explicitly asks for tropes too. [PROJECT.md](../PROJECT.md) owns accepted direction; [User vision](USER_VISION.md#genre-sweep-follow-up) preserves both messages. This supplements the five existing dossiers rather than replacing their chapter research. [Tropes and subversions](RESEARCH_GENRE_TROPES.md) owns the companion community/genre discussion; [Rivals, identities and fate](RIVALS_IDENTITIES_AND_FATE.md) owns detailed opponent and identity patterns.

## Main finding and how to use this dossier

Progression can change **what you can do, who or what helps you, which plans you can sustain, and what the world permits**. These create different play even at the same character level. Monster bonding, a research career, a caravan charter and a managed dungeon should each change the player's plans, available solutions and long-term goals.

Separate a power system from its scenario. A creature bond can support a wilderness expedition, an academy, a siege or an ecological mystery. A tower can test martial skill, logistics, relationships or investigation. Choosing a genre label does not choose the resource economy, protagonist role or reset rules.

Andrew Rowe distinguishes combat/reward, repeated practice, conflict-driven growth and attempt/train/retry loops, and discusses agency in dungeon and settlement stories. This supports mixing loops; it is one author's framework, not a universal genre taxonomy. Our inference: repeatable work should prepare for occasional situations where progress enables a different solution. [Author's core-loop essay](https://andrewkrowe.wordpress.com/2022/11/03/progression-fantasy-core-loops/).

Read the [genre map](#genre-map-and-new-design-coverage) for breadth, [trope catalog](#trope-to-gameplay-catalog) for story patterns, [monster systems](#monster-taming-and-related-systems) for depth, [scenario library](#scenario-library) for conflicts, and [implementation](#implementation-in-the-current-yairpg-foundation) for source fit. The final [selection shortlist](#five-candidates-for-later-selection) is a proposal, not a new delivery commitment.

### Evidence boundaries

**Verified reference** below means the linked author, publisher or developer material supports the stated premise or mechanic. Most new fiction evidence is synopsis-level, not a complete novel or chapter audit. **Interpretation** connects that evidence to a design question. **Original proposal** describes our invented gameplay, including every numerical example and species below. None of the proposed limits, recovery rules or costs should be attributed to the novels.

Works are selected for mechanical contrast. Inclusion does not establish favorite status, critical acclaim, a complete genre survey or authorization for a direct fan setting. Adjacent games illustrate mechanics; they do not establish fiction conventions. Exact canon must be verified before a direct adaptation. No private library catalog, ebook text or personal save was copied into this research.

The core genre emphasis is deliberate growth in character power and skill. Economic, civic and social progression are included as adjacent design inspirations for this game's broader vision; growing wealth alone does not automatically make a story progression fantasy. This follows the distinction in Rowe's original genre proposal without requiring every world to use numeric levels. [Author's genre definition](https://andrewkrowe.wordpress.com/2019/02/26/progression-fantasy-a-new-subgenre-concept/).

## Fresh reference cases

The last column contains original adaptation ideas. A synopsis confirms an interesting starting point, but not every rule needed to implement its fictional system.

| Reference and verified evidence | What remains unverified here | Original adaptation opportunity |
|---|---|---|
| **Jekua / On Lavender Tides**, Travis M. Riddle. The author describes a summoner accompanying a pilgrimage across an archipelago, imprinting monsters and battling other summoners. [Author page](https://travis-riddle-a8eg.squarespace.com/on-lavender-tides) | Exact imprint process, summon persistence, energy costs and progression of individual patterns | Exploration finds summon knowledge. A pattern library and a limited prepared roster serve different functions; a pilgrimage joins creature discovery to local people and places |
| **Knightmare Arcanist / Frith Chronicles**, Shami Stovall. Becoming an arcanist requires a mythical-creature bond. The author's **Academy Arcanist** synopsis explicitly says the bonded creature determines magical abilities. [Author's book descriptions](https://sastovallauthor.com/#books) | Bond exclusivity, lifespan, mutual advancement, separation and exceptions | One partner changes the player's own capability kit. Joint milestones and partner goals give this path a different identity from collecting disposable summons |
| **Chrysalis**, RinoZ. Anthony is reborn as an ant in a dungeon, developing himself and his colony; the publisher identifies monster evolution and collective growth as series elements. [Publisher, book 1](https://aethonbooks.com/book/the-antventure-begins/) | Mutation costs, evolution thresholds, biomass arithmetic and colony governance | The player can become a monster, changing tools, traversal and social access. Colony projects convert personal discoveries into shared infrastructure |
| **Dungeon Born**, Dakota Krout. The publisher description identifies Cal as a Dungeon Core growing a dungeon around himself. The author identifies the series as a dungeon-core/wuxia/GameLit combination. [Publisher description](https://books.apple.com/us/audiobook/dungeon-born-divine-dungeon/id1641926882), [author's introduction](https://www.reddit.com/r/Fantasy/comments/bwbjin/) | Creation costs, ecology, room growth, visitor rewards and exact core survival rules | A bounded managed ruin reverses the usual expedition perspective: configure rooms and negotiate visitor access instead of only clearing enemies |
| **The Weirkey Chronicles / Soulhome**, Sarah Lin. The author establishes the Nine Worlds and a return with expertise from a previous lifetime, and links supplementary soulcrafting material. [Author's series page](https://sarahlinauthor.blogspot.com/p/the-weirkey-chronicles.html) | Detailed soulhome architecture, material properties and rebuild constraints. Linked tutorials were located, not fully audited in this sweep | Cross-world expertise can inform an original configurable internal structure. A small module layout is a candidate; its rules must be invented explicitly or source-checked later |
| **All the Skills**, Honour Rae. The author describes a card-based magic system and a Master of Skills card that changes Arthur's opportunities. [Author page](https://honourrae.com/book/all-the-skills/) | Card slots, transfer rules, combinations, upgrade costs and later dragon systems | Modular ability access can let discoveries change a build. Collection, comprehension and prepared use need separate rules; no requirement to grind every skill |
| **A Summoner Awakens**, Kerberos. The publisher describes cards, a summoner origin, a Tower and retained memory of a coming calamity. [Publisher, Origins](https://aethonbooks.com/book/origins/) | Exact regression trigger, card inheritance, deck restrictions and summon maintenance | Foreknowledge changes expedition priorities; prepared cards determine which interventions are possible. This combination need not grant both an unlimited library and unlimited deployment |
| **Mark of the Fool**, J.M. Clarke. The publisher describes a magical academy and a Mark that obstructs combat, divinity and spellcraft while enhancing other skills. [Publisher, book 1](https://aethonbooks.com/book/mark-of-the-fool/) | Exact workarounds and the limits of the Mark across the series | A disclosed limitation creates an alternative research, craft or support route. It needs encounters written for those roles, not just a damage penalty |
| **Super Supportive**, Sleyca. The author describes a would-be battlefield support hero, an extraterrestrial System, slow growth and several worlds. [Author's publication](https://www.royalroad.com/fiction/63759/super-supportive) | Exact authority, class/skill rules and the protagonist's particular abilities | Progress through extraction, protection, coordination and reliability. Mission success can depend on rescued people or completed objectives, alongside combat |
| **Beware of Chicken**, Casualfarmer. The publisher describes a cultivator leaving for farming, building a home and feeding spirit herbs to a rooster. [Publisher, book 1](https://podiumentertainment.com/titles/1655/beware-of-chicken) | Full farm ecology, animal awakening rules and how ordinary work connects to later strength | A home and relationships can be an ongoing goal. Agriculture and cooking support expeditions, creature care and regional problems without mandatory daily chores |
| **12 Miles Below**, Mark Arrows. The publisher establishes a frozen surface, guarded recovered technology, dangerous underground machines and an expedition that becomes a survival crisis. [Publisher, The Frozen Realm](https://aethonbooks.com/book/the-frozen-realm/) | Armor power systems, technical schematics and later advancement rules | Repair, insulation, route surveying and salvage become progression. New technology opens deeper expeditions but carries compatibility and supply constraints |
| **Book of the Dead**, RinoZ. The publisher's book-2 synopsis describes a hunted necromancer and tactical skeleton use. [Publisher, Sacrifice](https://aethonbooks.com/book/sacrifice/) | Corpse preparation, control budgets, autonomy, soul rules and creation costs | Units can require construction and commands rather than trust training. Local law and evidence affect access; an outlaw path needs authored alternatives and consequences |
| **Defiance of the Fall**, JF Brink / TheFirstDefier. The publisher describes Earth's introduction to a System-controlled multiverse, wilderness survival and a mixture of LitRPG and cultivation. [Publisher, book 1](https://aethonbooks.com/book/defiance-of-the-fall/) | Detailed integration rules, class combinations, settlement systems and later cosmic advancement | A changed region can introduce unfamiliar rules while preserving ordinary skills. Shelter, information and allies matter before raw combat dominates |
| **The Primal Hunter**, Zogarth. The publisher describes an ordinary worker entering a dangerous tutorial after humanity's integration into a multiverse. [Publisher, book 1](https://aethonbooks.com/book/the-primal-hunter/) | Exact tutorial selection, rewards, time limits and later power exceptions | A bounded introductory scenario can teach unfamiliar rules through choices and field evidence; a tutorial is not automatically a safe zone or a whole-character reset |

### Mechanical contrasts from games

| Verified developer material | Design inference and boundary |
|---|---|
| **Monster Sanctuary** advertises monster skill trees, team synergies and creature abilities used outside combat for traversal. [Developer listing](https://store.steampowered.com/app/814370/Monster_Sanctuary/) | A creature should sometimes open an expedition action or route. Its turn-based party combat is a reference requiring substantial adaptation, not an existing YAIRPG capability |
| **Cassette Beasts**, the released original game, describes recording monster forms, transforming, fusing with a human partner, relationship-dependent fusion and elemental chemistry. [Developer listing](https://store.steampowered.com/app/1321440/Cassette_Beasts/) | A recorded form, its user and a human relationship can be separate objects. Prototype one authored reaction before any combinatorial fusion system. The current series homepage markets a sequel; this row uses the original game's listing |
| **Siralim Ultimate** is presented by its studio as creature collection with fusion and many specializations. [Developer's catalog](https://thylacinestudios.com/) | Collection can support interacting builds, but a large roster is not evidence of manageable implementation cost. Detailed trait rules need a separate audit or playtest before borrowing them |

The earlier [alternative-power dossier](RESEARCH_ALTERNATIVE_POWER.md) retains the more precise Pokémon evolution, temporary transformation, species-ability and living-equipment cases. Those were not re-audited here. [Niche game references](NICHE_GAME_REFERENCES.md) remains the owner of the broader game shortlist.

## Genre map and new design coverage

This is a design coverage map, not a claim about genre prevalence. Families overlap; a world can combine two or three without implementing all of them. **Extended** means the existing dossiers covered the family but this pass adds scenarios or implementation detail. **Added** means a distinct design treatment is new here, not that the motif was never mentioned before. Late-scale entries are future options.

| ID / family | Coverage and reference anchor | What advances | Choice and limiting rule |
|---|---|---|---|
| PF01 Martial and cultivation traditions | Extended; [cultivation dossier](RESEARCH_CULTIVATION_PATHS.md) | Usable methods, bodily capacity and earned transitions | Choose a method and preparation; a larger energy pool does not replace knowledge or local compatibility |
| PF02 Learned magic and research | Extended; [magic dossier](RESEARCH_PROGRESSION_MAGIC.md) | Procedures, control, efficiency and applications | Reliable prepared formula versus flexible field technique; scarce preparation time or capacity |
| PF03 Professions, classes and credentials | Extended; [systems dossier](RESEARCH_LITRPG_SYSTEMS.md) | Recognized competence and service access | Demonstrate a role, then specialize; no blind permanent class selection before trying the role |
| PF04 Individual beast bonding | Added depth; Frith Chronicles | Partner relationship and joint abilities | Select a partner whose strengths change plans; cooperation and habitat limit deployment |
| PF05 Imprints and summoned patterns | Added depth; Jekua | Observations, pattern quality and prepared summons | Know many patterns, prepare a few; field energy and preparation differ from ownership |
| PF06 Riders and paired techniques | Added treatment; Frith bonding as a starting point, rider rules original | Coordination, mounts and combined traversal | Mounted utility trades indoor access or maneuverability; separate rider and partner competence |
| PF07 Habitats, ranching and ecology | Added treatment; farm/creature premises, ecosystem rules original | Enclosures, care knowledge and sustainable yields | Assign habitat space to care, research or production; finite expedition batches rather than real-time neglect |
| PF08 Monster viewpoint and body evolution | Added depth; Chrysalis | Body functions, adaptations and social possibilities | A useful form changes equipment fit and traversal; acquired alternatives keep basic progress possible |
| PF09 Necromancy and controlled forces | Added treatment; Book of the Dead | Prepared units, command doctrine and concealment | Control capacity and local permission; unit ownership does not imply independent action or free upkeep |
| PF10 Constructs, golems and programmable helpers | Extended; [alternative-power dossier](RESEARCH_ALTERNATIVE_POWER.md) | Blueprints, behavior and reliable execution | Instructions plus input reserves; pause when a job no longer matches known conditions |
| PF11 Cards, runes and modular loadouts | Added depth; All the Skills, A Summoner Awakens | Known modules and usable combinations | Prepared slots or a compatibility budget; collection is not simultaneous use of every effect |
| PF12 Internal architecture and personal spaces | Added treatment; Weirkey is a source candidate, exact layout rules original | Configuration and capability combinations | Three modules with one adjacency interaction; reconstruction has a disclosed cost, not an irreversible hidden trap |
| PF13 Evolving relics and living equipment | Extended; [alternative-power dossier](RESEARCH_ALTERNATIVE_POWER.md) | Tool behaviors, maintenance knowledge and provenance | Choose a role or refinement; finite activation resources and handling requirements |
| PF14 Pacts, oaths, occult and divine paths | Extended; [alternative-power dossier](RESEARCH_ALTERNATIVE_POWER.md) | Agreements, procedure and earned permission | Visible obligations, limits and exit rules; different traditions need different progression tests |
| PF15 Healing, protection and support | Added depth; Super Supportive | Intervention quality, extraction and coordination | Triage or evacuation changes who survives; combat, support and logistics can each complete a mission |
| PF16 Investigation, stealth and information | Extended; occult evidence plus original scenarios | Verified clues, access, cover and contacts | Information opens an action; it does not automatically increase every success chance or become NPC knowledge |
| PF17 Academies, mentors and instruction | Added depth; Mark of the Fool, Academy Arcanist | Demonstrated applications, teachers and curriculum | Choose projects and a tutor; time or facility capacity prevents taking every opportunity at once |
| PF18 Sect, guild and apprentice leadership | Added treatment; [institutional research](RESEARCH_ALTERNATIVE_POWER.md), leadership rules original | Delegation, doctrine and services | Teach one known role and fund a bounded project; learner progress belongs to the learner |
| PF19 Merchant, logistics and regional economy | Extended; [alternative-power dossier](RESEARCH_ALTERNATIVE_POWER.md) | Reliable routes, contracts and production | Reserve supplies for personal play or a delivery; avoid infinite arbitrage or inactive-town decay |
| PF20 Farm, home and civic development | Added depth; Beware of Chicken | Useful infrastructure, relationships and local resilience | Garden, workshop or refuge changes preparation; facilities need a function beyond global XP |
| PF21 Dungeon core and managed territory | Added treatment; Dungeon Born | Rooms, residents and visitor policy | Allocate a fixed room budget and choose access rules; a safe low-yield policy can remain viable |
| PF22 Frontier and System apocalypse | Added depth; Defiance of the Fall | Adaptation, shelter and understanding of changed rules | Explore, shelter or negotiate during explicit simulated phases; no silent destruction of earlier campaign state |
| PF23 Survival, salvage and magitech | Added treatment; 12 Miles Below | Repair, environmental endurance and recoverable technology | Equipment capability versus fuel/weight; crafting or a paid specialist can enable the same route |
| PF24 Loops, regression, reincarnation and legacy | Extended; [systems dossier](RESEARCH_LITRPG_SYSTEMS.md), A Summoner Awakens, Weirkey | Knowledge, alternate plans or expressly retained legacies | Specify exactly what resets; memory cannot also preserve every item, relationship and reward by default |
| PF25 Domains, concepts and world-law authority | Extended future scale; [cultivation dossier](RESEARCH_CULTIVATION_PATHS.md), original domain rules | Influence over a bounded interaction | A storm domain changes one region's weather-dependent actions; conflicting domains and local scope prevent universal victory |
| PF26 Ocean, sky and interworld expeditions | Extended future scale; [PROJECT.md world families](../PROJECT.md#3-worlds-with-different-rules), Jekua's archipelago premise | Navigation, vehicles, routes and environmental access | Crew, vessel and personal abilities solve different obstacles; transport capacity and habitat remain relevant |

Horror, mystery, romance, comedy and slice of life can shape several rows without needing their own resource systems. A horror investigation can use knowledge, exposure and containment; a friendship story can use authored partner goals; a quiet farm chapter can use seasonal opportunities and civic needs. A horror tone does not require hidden permanent save damage, and a quiet chapter can still contain meaningful choices.

## Trope-to-gameplay catalog

A trope supplies a recognizable situation or expectation; a mechanic specifies a choice and a state change. The catalog below includes familiar patterns and original variations. It makes no frequency or popularity claim. **Fresh** points to the narrow primary-source cases above; **Prior** points to an existing dossier whose exact chapter evidence was not refreshed; **Lead** means an original candidate without a newly verified specific-book instance. Only the evidence stated in the cited source is canonical. Every playable expression and reversal below is invented.

Rowe's discussion of alternative paths highlights treasure choices, routes and other branching moments that invite readers to imagine a different character or outcome. His preference is for meaningful alternatives rather than one obviously correct selection. Our translation: show a small set of interesting possibilities and implement the selected branch's actual use. A mentioned future path may remain a lead, but an advertised available choice must work. [Author's branch-design essay](https://andrewkrowe.wordpress.com/2023/05/29/the-spark-of-paths-untraveled/).

### Entry, advantages and acquisition

| ID / story pattern | Evidence anchor | Original playable expression | Useful variation or consequence |
|---|---|---|---|
| T01 Underestimated or incompatible aptitude | Prior: Mage Errant in [magic research](RESEARCH_PROGRESSION_MAGIC.md#4-mage-errant-a-teaching-mismatch-is-a-lead-not-a-dead-character) | A standard lesson fails; another teacher or apparatus reveals a usable specialty | The original institution was incomplete, not necessarily malicious; adaptation changes cost and application |
| T02 Lost manual or hidden inheritance | Prior: [manual/mentor research](REFERENCE_RESEARCH.md#a-technique-framework-that-fits-ordinary-adventure) | Recover, interpret and field-test a method | A current craftsperson can improve an old method; inheritance can confer a claim as well as a tool |
| T03 Choose one treasure from a vault | Fresh: Rowe's branch-design essay above | Choose an expedition instrument, a pattern archive or a workshop blueprint | Each unlocks a different plan; later opportunity can permit a second choice without making the first pointless |
| T04 Gift or mark with a troublesome limitation | Fresh: Mark of the Fool | Disclosed limitation changes viable projects and techniques | Treat the apparent weakness as a design challenge; do not quietly exempt every action or secretly trap a new character |
| T05 Expert returns in a weaker body | Fresh: Weirkey's second-chance premise | Knowledge opens early preparations, while current execution still needs tools or practice | Knowing a route does not restore an old ally's trust or give the new body every former capability |
| T06 Ordinary person enters an extraordinary tutorial | Fresh: The Primal Hunter | A bounded chapter introduces rules through shelter, survey and an authored test | A support or research solution earns a different credential; the tutorial's consequences persist explicitly |

### Creature and identity patterns

| ID / story pattern | Evidence anchor | Original playable expression | Useful variation or consequence |
|---|---|---|---|
| T07 Feared monster is protecting something | Lead: S01 and [territorial actors](RIVALS_IDENTITIES_AND_FATE.md) | Observe a nest or migration, then fight, divert the threat or restore access | An observation changes an available response; threat and innocence need not be a universal binary |
| T08 Rescue an egg or raise a fragile partner | Fresh: Stovall's [The Last Rift Dragon synopsis](https://sastovallauthor.com/#books) describes protecting a dragon egg with a hoped-for future bond | Safe transport and a prepared habitat unlock a future partner introduction | Hatching is a new relationship, not instant obedience; rare lineage is not a guaranteed best build |
| T09 Bond grants the wielder a new power identity | Fresh: Frith/Academy Arcanist | A joint field milestone unlocks one paired capability | The partner has goals and a role; separate its experience from the player's advancement |
| T10 Search the world for monster imprints | Fresh: Jekua | Habitat evidence leads to a pattern acquisition task | Pattern quality may improve through observation; whether an actual individual is captured is a separately chosen rule |
| T11 Reborn as a monster, then evolve | Fresh: Chrysalis establishes rebirth/evolution; exact transformations remain unaudited | A body-specific trial unlocks a previewed adaptation | Retain identity and useful old knowledge; changing form need not mean eventually becoming human |
| T12 Unassuming home animal becomes exceptional | Fresh: Beware of Chicken's spirit-herb/rooster premise | One preparation enables a field behavior that a normal animal lacks | Care, habitat and practice determine utility; exceptional animals need not become permanent damage multipliers |

### Training, mastery and visible payoffs

| ID / story pattern | Evidence anchor | Original playable expression | Useful variation or consequence |
|---|---|---|---|
| T13 Training arc pays off in a real obstacle | Fresh: Rowe's core-loop framework | Practice a known method, then apply it to an authored field problem | An upgrade opens an action or changes a tradeoff; a timer alone does not prove the character understood a principle |
| T14 Return to an earlier overwhelming opponent | Fresh: [Rowe on satisfying progression](https://andrewkrowe.wordpress.com/2019/04/13/making-progression-satisfying/) discusses comparison with earlier threats | Optional rematch shows faster or safer victory with the improved build | Let earned strength be visible. The old opponent does not always need to level up to cancel it |
| T15 A narrow technique defeats a stronger defense | Prior: counters in [magic research](RESEARCH_PROGRESSION_MAGIC.md) | Identify an exposed mechanism and use a learned counter | The same technique can struggle elsewhere; knowledge supplements strength without making numbers irrelevant |
| T16 Broken treasure becomes useful through restoration | Lead: S06 plus existing craft/artifact proposals | Diagnose a failure, replace a component and complete a field test | Repair reveals function, not automatically unrestricted ownership or permission |
| T17 Failed experiment reveals the missing principle | Prior: diagnostic learning in [magic research](RESEARCH_PROGRESSION_MAGIC.md#b-learn-a-spells-failure-mode) | A failed attempt preserves an observation and opens a specific remedy | Pay the disclosed experiment cost once; endlessly repeating the same failure provides no new insight |
| T18 Legendary profession changes what counts as success | Prior: Overgeared in [origin research](RUN_DEFINING_ADVANTAGES.md) | Commission and field use develop an exceptional craft capability | The craft route can solve the campaign problem directly, while access, designs and relationships remain meaningful |

### People, institutions and consequences

| ID / story pattern | Evidence anchor | Original playable expression | Useful variation or consequence |
|---|---|---|---|
| T19 Student becomes a teacher or school founder | Lead: PF18 | Teach one known method and fund an apprentice field assignment | Student discoveries can later help the teacher; training another person does not copy all player knowledge |
| T20 Helping a minor character creates a major later opportunity | Lead: S01/S07 | Record survival, recovery or a debt; read that fact in a later chapter | Assistance earns a contact or service without making every kindness a secret legendary jackpot |
| T21 Status opens doors and creates obligations | Prior: [rival/identity audit](RIVALS_IDENTITIES_AND_FATE.md) | A faction recognizes a credential and offers a restricted loan or duty | Status, personal strength and public belief are separate; refusal can change access without erasing the character |
| T22 Powerful method is socially forbidden | Fresh: Book of the Dead establishes a hunted necromancer | Witnessed practice changes a city's investigation/access facts | A permit, concealment, another jurisdiction or a legal substitute can be distinct responses |
| T23 Leadership arrives before the character feels ready | Lead: S09/S10 | A charter gives one regional project and a limited delegation choice | Leadership progresses through useful services, not an immediate mandatory empire simulator |
| T24 Rival becomes ally when the conflict changes | Prior: [recurring-rival audit](RIVALS_IDENTITIES_AND_FATE.md) | Resolve an evidence dispute or shared threat, retaining the earlier grievance | Cooperation can coexist with competition; a single dialogue need not erase years of history |

### Worlds, opportunities and changed goals

| ID / story pattern | Evidence anchor | Original playable expression | Useful variation or consequence |
|---|---|---|---|
| T25 The dungeon is a person or body | Fresh: Dungeon Born's core premise | Meet a custodian/core and choose access, repair or a managed-site agreement | Visitors and residents have different interests; a clearing reward is not proof the place is ownerless |
| T26 New realm makes old methods work differently | Prior: [world-campaign proposal](DIRECTION_SYNTHESIS.md#world-campaigns-and-book-settings) | Local fuel, a converter or a permission changes an imported capability's operation | Earlier mastery still matters; arrival does not silently reset ordinary skills |
| T27 Foreknowledge of a disaster becomes unreliable | Fresh: A Summoner Awakens supports memory/calamity; divergence is an original variation | Compare observed evidence with a remembered plan after interventions | Mark predictions as uncertain; actual observations remain knowledge rather than being erased to preserve suspense |
| T28 Supply knowledge defeats apparent scarcity | Prior: Gu upkeep and logistics in [alternative-power research](RESEARCH_ALTERNATIVE_POWER.md) | Substitute a ration, preserve a reagent or negotiate a delivery | Supply abundance shifts the choice to allocation and projects; avoid restoring identical scarcity through arbitrary nullification |
| T29 Powerful person chooses ordinary work | Fresh: Beware of Chicken's departure/farming premise | Home construction, crops and regional needs become useful ongoing goals | Allow a quiet chapter to showcase competence; it need not become a forced detour before the next fight |
| T30 Technological ruin changes the route to power | Fresh: 12 Miles Below's guarded recovered technology | Recover a blueprint, repair insulation and open a deeper expedition | Engineering and a commissioned service are alternate routes; acquiring a relic does not mean understanding every subsystem |

Further familiar leads include auctions, contested inheritances, hidden realms, sealed mentors, heart-demon trials, bloodlines, chosen-one claims, luck appropriation, possession and identity replacement. Their existing ownership is the [cultivation](RESEARCH_CULTIVATION_PATHS.md), [origin](RUN_DEFINING_ADVANTAGES.md) and [rival/identity](RIVALS_IDENTITIES_AND_FATE.md) dossiers. They remain available options. This catalog adds scenario and implementation coverage rather than silently selecting all of those branches.

### Compose a chapter from a few tropes

Use one entry opportunity, one operating constraint and one consequence as a starting composition. This is an authoring heuristic, not a permanent restriction on the world.

| Original composition | Playable question | Minimal state and visible payoff |
|---|---|---|
| T07 territorial creature + T20 rescue aftermath + T09 later bond | Can observation and preparation turn a dangerous route into a cooperative relationship? | Observed nest fact, selected intervention, guide outcome and a later partner lead; S01 |
| T03 treasure choice + T16 restoration + T30 survival technology | Which recovered tool makes the next descent feasible for this build? | Selected artifact, repair evidence, fuel reservation and unlocked route; S06 |
| T04 limiting mark + T13 practical training + T19 instruction | Can an unusual method become a useful specialty others can learn? | Declared limitation, field-test result, specialty and one apprentice assignment; S04 then PF18 |
| T25 living dungeon + T23 charter + T28 supply allocation | Can stewardship make the site useful without treating every resident as loot? | Site agreement, room policy, bounded inputs and one visitor result; S08 |
| T05 returning expert + T27 divergent forecast + T24 changed rivalry | What does remembered history still predict after a new intervention? | Remembered lead, new observation, current relationship and scoped aftermath; a later bounded replay |

Reveal lead, commitment, result and later callback at different moments. A callback makes a choice feel remembered; it need not start a second permanent grind. Include a plain baseline route so a special origin or rare discovery creates an alternate plan instead of blocking the campaign. A later exceptional power can deliberately remove an early limitation; meaningful choices can move to responsibility, scope or goal selection rather than every enemy negating the reward.

## Monster taming and related systems

### Choose the relationship model before choosing the roster

These are distinct original implementation contracts. The references above establish contrasts, not these exact rules.

| Model | What is acquired and saved | How growth works | Cost and distinctive scenario |
|---|---|---|---|
| Living bonded companion | One persistent individual with a bond and goals | Shared field applications unlock coordination or a role | Reserve one helper assignment and compatible supplies; rescue or migration builds trust |
| Captured or hatched creature | Individual ownership plus independently earned training | Trainer practice, habitat and field experience | Housing and a prepared expedition slot; a captured creature is not instantly a practiced partner |
| Imprinted summon | Pattern knowledge plus a temporary manifestation | Improve an observed pattern or its execution | Commit summon capacity and use field fuel; studying rare wildlife can succeed without transporting it |
| Familiar or patron spirit | A named relationship and agreement | Fulfill authored agreements and practice linked abilities | Known restrictions; a mystery may require negotiation rather than capture |
| Rider and mount | Two individuals plus paired-technique familiarity | Train handling and the partner's traversal role | Size, space and equipment fit; excellent overland mobility can be unusable inside a narrow ruin |
| Player transformation | A known form or body adaptation, separate from identity | Learn form actions and choose an adaptation | Equipment/fuel/environment constraints; old skills remain known even when the form cannot use a tool |
| Undead or manufactured helper | Instance, construction history and command loadout | Repair, improve a component or teach a behavior | Control or power budget; explicit independence and local legal rules, not a renamed friendship meter |
| Habitat or colony | Site, occupants and project policy | Survey, improve habitats and complete bounded projects | Space and supplies; a region-level expedition problem replaces individually micromanaging every creature |

Acquisition and relationship are separate axes. Purchase, rescue, hatching, capture and a pact can lead to different initial relationships. Species, individual temperament, learned behavior and current condition should also be separate. Neither a rare species nor an acquired bond should silently grant every technique.

### An ordinary-adventure entry loop

Original proposal: **lead → habitat observation → approach → acquisition or agreement → practice → deployment → field evidence → optional adaptation**. The first loop can stop at deployment and its observed result. Later systems should earn their complexity through additional play.

Example: hear that a reed-dwelling creature tracks safe water channels. Observe it on a survey, then either help restore its nesting bank or arrange supervised training with a handler. Both are reliable authored entry routes. A rare encounter may add a trait, cosmetic variation or a different lead, but should not be the only way to start the path.

Practice first earns one capability, such as **find safe ford**. Save the demonstrated application rather than requiring thousands of identical pet commands. Trust records meaningful cooperative experiences; it does not decay because the player closes the browser. Affection, command reliability and species physiology need not share one number.

Deployment selects a role for an expedition. A companion assigned as scout cannot simultaneously run a home production job. The first implementation needs one expedition helper, not a global one-pet ownership limit. Further individuals can remain safely housed when roster storage is implemented.

### Three original creatures with different uses

| Creature proposal | Useful role and interaction | Drawback or counter | Alternative available to other builds |
|---|---|---|---|
| Reed hound | Detect safe channels and locate a missing traveler in wet terrain; Perception helps interpret its signals | Dry ruins need protective salve; strong scents can obscure a specific trail | Survey tool, known ford or paid guide |
| Lantern moth | Reveal an inscription or hidden path; learned dim mode reduces exposure | Bright mode attracts a disclosed nocturnal predator; light is poor concealment | Lantern equipment, translated map or daylight route |
| Stoneback beetle | Brace a temporary shelter or carry a fragile salvage case | Narrow passages restrict access; a heavy shell trades speed for protection | Forged brace, porter contract or guarded ground route |

These species and physiology are invented fantasy rules. The examples extend the earlier lantern/symbiote proposal, not a claim that these species exist in a referenced book. All three need not appear in one slice. One species and one useful role are enough to test the relationship model.

### Progression that changes play

Training can add a behavior, improve reliability under a named condition or allow a paired action. Adaptation can branch toward marsh sensing or dry-land endurance rather than simply turning every stat up. Preview lost and gained capabilities and provide an authored later retraining option in the original design.

Evolution, temporary empowered form, fusion and inherited traits are different transitions. Evolution changes the persistent development state. A temporary form expires under stated rules. Fusion reserves two participants and cannot leave their ordinary jobs running. Breeding introduces parentage, generation pacing and population management; defer it until individual identity and roster persistence work. No realistic genetic claim is implied by fantasy traits.

Bench catch-up can let an established reserve partner become usable without repeating the entire early game. Mastery of a special role still needs its field test. Rare discoveries should offer distinct roles or combinations before universally superior base stats, so attachment to an early companion remains useful.

### Compact synergies instead of an unlimited combo engine

One authored chain could be **scout reveals damp seam → player deploys a prepared freezing wedge → Stoneback role braces the opening**. Any two steps can have an ordinary tool substitute. The payoff is a different route or intact salvage, not merely more damage. Later combat examples could combine a marked target with a precision technique, or shelter with a long preparation action.

Specify trigger, scope, duration and stacking for every interaction. A reveal should trigger once per event instance. A free-action proc cannot recursively trigger itself. Capacity refunds cannot create extra capacity. Do not add unrestricted elemental chemistry, reactive passives, status propagation and fusion together before one readable interaction works.

### Companion persistence and portability

Proposed stored fields include `instance_id`, `species_id`, `source_event_id`, `bond_state`, `known_behaviors`, `role_mastery`, `adaptation_id`, `condition`, `assignment` and `home_site_id`. IDs identify an individual independently of its name or evolved species. Derived capabilities are calculated from these fields rather than granted again on reload.

Travel preserves individual identity but checks transport, habitat, fuel and local permission. A home job stays with its site; a traveling partner cannot also be there. Pattern knowledge may cross worlds even where the manifestation needs local energy. Local witnesses can know a partner's history without automatically sharing the player's private memories.

Rebirth retention for partners is undecided. Preview whether a bond, pattern, individual or home population survives the selected transition. For a future bounded rewind, never spawn a second permanent copy of a rescued individual or duplicate its reward. Temporary scenario partners belong to the scenario until an explicit single acquisition is committed. Exhaustion pauses a role; irreversible death requires an explicitly authored, previewed risk contract.

## Scenario library

All entries are original setting/scenario proposals. Source cases motivate the differences, not these plots. **Small** means one authored event after the shared persistence/commit foundation exists. **Medium** adds a reusable state model or scheduler. **Large** needs substantial actor, combat, economy or history work. These are relative engineering estimates, not verified durations.

| ID / scenario | Defining situation and useful paths | Consequence that gives progression meaning | Size and main dependency |
|---|---|---|---|
| S01 Flooded nesting bank | Locate a stranded guide and a displaced creature; ecology/scouting, engineered shelter or a guarded rescue | Surviving guide opens a later route; restored nesting bank offers a companion lead | Small; event facts and a committed outcome. Persistent companion growth is a later extension |
| S02 Pilgrimage across islands | Choose escort, researcher or summoner preparations; different local hosts reveal different routes | One introduction grants access elsewhere; recorded habitat information helps a return expedition | Medium; regional state and compatibility, then vehicles if travel itself becomes simulated |
| S03 Paired tournament | Rules test handling, precision and endurance in separate rounds | A credential opens training or a specialized challenge; a loss provides a rematch lead | Small as authored trials; Large if a full party battle simulator is required |
| S04 Academy field examination | Complete a practical problem through a technique, a crafted apparatus or a support plan | Demonstrated method determines a tutor/project offer rather than a universal class | Small untimed; Medium with shared lab capacity and scheduling |
| S05 Region after System arrival | Familiar countryside changes rules; shelter, reconnaissance and negotiation compete for preparation | Saved contacts and verified rules open different recovery chapters | Medium; phase changes and local history. Global apocalypse simulation is Large |
| S06 Winter salvage descent | Repair insulation, manage expedition fuel and survey a machine ruin | A blueprint or repaired tool opens deeper travel; recovery preserves useful observations | Small with a bounded expedition budget; Medium with continuing facility production |
| S07 Siege relief and evacuation | Fight a breach, move civilians, treat an injury or supply a refuge | Survival and infrastructure determine later allies and services | Medium; timed interventions and NPC state. Full army combat is Large |
| S08 Living ruin management | Negotiate custodianship, configure three rooms and decide visitor policy | Safe research, material yield and local standing differ by policy | Medium; site/project state and scheduled visitor events, not full dungeon AI |
| S09 Farm and sanctuary charter | Restore irrigation, provide shelter and choose habitat or workshop investment | A regional need is solved; a facility enables expeditions or creature care | Small for a charter quest; Medium for persistent production/habitats |
| S10 Caravan treaty and rival guild | Share evidence, insure a cargo or take a difficult alternate route | Trade access and named NPC cooperation change; rivalry can escalate or reconcile | Small with authored decisions; Medium for recurring contracts and rival state |
| S11 Nonhuman initiation | Acquire a temporary form and solve a body-specific trial; later choose an adaptation | Different traversal and equipment options become available; inhabitants react to visible form | Medium for a bounded form; Large for a permanent new player-body model |
| S12 Forbidden practice in a lawful city | Seek a permit, work covertly or replace a controlled unit with a legal construct | Witnessed actions change access and investigation; broad alignment does not explain every faction | Medium; legal facts, disclosure and helper provenance |
| S13 Dream investigation or horror trial | Gather evidence, control exposure, translate a warning or use containment | An understood protocol or resolved relationship changes the next encounter | Small without rewind; Medium with isolated scenario checkpoints |
| S14 Competing domains at a world border | Calibrate an imported tool, negotiate passage or learn a local technique | An adapter makes an older world's discovery useful again | Medium for one compatibility rule; Large for territorial domain simulation |

### S01 worked card: flooded nesting bank

**Goal and lead:** A village guide is missing near a nesting bank. A rumor identifies the search region; a field observation reveals the safe-channel clue. The creature is part of the situation, not a required purchased upgrade.

**Approaches:** Perception plus observed channel knowledge enables a careful search and guided extraction. Crafting plus a brace and supplies enables temporary refuge followed by a slower extraction. A strong guarded rescue can work with higher injury risk. Merchant-bought preparation or a guide contract substitutes for personally training the relevant trade.

**Cost and result:** Show supplies spent and the projected simulated action budget. If a deadline is used, its start and expiration policy must be explicit. Resolve to safe extraction, extraction with a recoverable complication, or safe withdrawal with a specific new lead. Do not make entry to the entire companion path depend on the rescue roll.

**Aftermath:** A surviving guide teaches a route. Restored habitat creates a later meeting with a handler or creature. Failure changes the recovery quest and retains observed knowledge. Future companion recruitment remains a separate decision.

**First implementation gate:** Two prepared builds solve the event through different actions; a named downstream option changes; reload mid-action or after completion cannot reroll, repeat costs or grant the guide's reward twice. Creature data can remain descriptive until the companion subsystem is implemented.

### S04 worked card: academy field examination

**Goal:** Recover a sealed sample intact, proving practical competence. Brute force can open the container but damages the specimen, making another method worth learning.

**Approaches:** Interpret the seal with Literacy and a learned procedure; craft or commission a calibrated opening tool; arrange a qualified partner and protect the extraction. These are route-specific alternatives, not a checklist demanding every skill. One limited lab reservation or preparation assignment prevents completing all projects simultaneously.

**Progression and consequence:** A successful field application earns a relevant tutor introduction. An incomplete sample earns salvage and a precise repair/research lead. Optional later projects can train a specialty or teach an apprentice. The first examination should remain untimed until scheduler behavior is delivered.

**Implementation gate:** The sample's condition changes the reward and available follow-up, the tool route is viable without magical initiation, and permission to use the lab persists without repeating the reward on load.

### S07 worked card: siege relief

**Goal:** Preserve a refuge and extract a named group. Counting only kills would make support a permanent secondary role, so mission objectives include shelter integrity, a cleared route and survivors extracted.

**Approaches:** Combat clears the blocked route; a support build stabilizes a key person and coordinates a protected withdrawal; logistics establishes a secondary refuge with stores and transport. An initial event may use authored intervention outcomes rather than simulate autonomous allies.

**Tradeoff and aftermath:** A disclosed phase budget lets the player secure two of three objectives. Saved people, recovered records and preserved supplies open different follow-ups; none should be required for every later campaign route. An injured expert may recover later with a visible treatment plan. Rival factions respond to actions they can witness or learn about.

**Implementation gate:** Objective completion, injury and NPC presence survive reload, a weaker support character can achieve a meaningful success, and automation stops before selecting who to prioritize. No wall-clock attendance window.

### S08 worked card: living ruin management

**Goal:** Restore a ruin under a negotiated charter. This preserves a traveling player as the main actor while testing a dungeon-core perspective through one managed site.

**Configuration:** Three room slots support a refuge, a specimen garden or a training chamber. One adjacency rule, such as refuge beside garden protecting a delicate sample, gives layout a use. Configure safe access for lower yield, or a licensed challenge with greater wear and reward. Visitors arrive through bounded authored events.

**Progression and consequence:** Research unlocks a room function; completed visitor contracts earn a tool loan or blueprint. Maintain a declared reserve floor. A depleted room pauses, and the player can leave without the site silently collapsing. Material outputs must have defined sinks and cannot become an infinite passive-money source.

**Implementation gate:** Moving a module changes an observable visitor or production result, supplies are counted once, two sites cannot claim the same housed creature, and travel separates the site's ongoing assignment from the player's action. Becoming a permanent dungeon core remains a larger alternative campaign.

### S10 worked card: caravan treaty and rival guild

**Goal:** Deliver a delicate batch through a contested pass. One faction suspects theft; another controls the safe road. A rival operator has a specific motive and assets, not a universal hostility score.

**Approaches:** Obtain proof of origin and negotiate passage; buy insurance and an escort; survey a harder route and preserve the cargo. The crafted preservation route changes risk and cost, while diplomacy changes permission. A combat option can protect against attackers without automatically resolving the dispute.

**Rival progression:** After an explicit number of completed regional operations, the rival may secure a permit, spread a claim or offer a deal. Show a journal lead before an actionable change. Its progress uses world events, not unattended wall-clock decay or unexplained scaling to the player's best stat.

**Implementation gate:** Cargo condition, evidence provenance, route permission and rival action are separately saved. Rejoining the same story milestone preserves different relationships and services. A restored save cannot generate a fresh rival action or pay a delivery twice.

## Interactions across systems and worlds

Each proposed combination needs an enabling condition, a cost and a failure/stop rule. Imported knowledge, possessions and active effects are different kinds of transfer. Earlier areas should offer optional useful connections without becoming mandatory daily rounds.

| Combination | New available plan | Compatibility or budget | Reason to return |
|---|---|---|---|
| Creature observation + learned magic | Prepare a sensory spell from a studied behavior | Observation supplies knowledge; a local method still needs comprehension and fuel | Revisit a habitat to study a different behavior, not repeatedly harvest the same universal bonus |
| Crafting + partner care | Build a dry-land harness for a marsh companion | Tool slot, fit and protective supplies | An old workshop can adapt a newly discovered partner |
| Farming + occult/alchemical work | Grow a substitute ritual reagent | Research local conditions and use a garden plot; no instant universal transplant | A frontier garden solves a later supply bottleneck |
| Constructs + formations | Place a mobile ward support | Reserved power plus one site effect; no duplicated capacity refunds | Earlier refining knowledge reduces an adapter's preparation cost |
| Merchant charter + expedition research | Finance a survey from a reliable delivery | Reserve floor and delivery time; borrowed supplies retain ownership | A known town becomes a route hub rather than an obsolete shop |
| Apprentice + old manual | Delegate a known preparation while pursuing a new lead | One funded assignment; apprentice knowledge belongs to that NPC | Return for a specialist service or a joint field test |
| Temporary form + machinery | Explore a route the ordinary body cannot enter | Form-specific controls, equipment fit and explicit return conditions | A previous engineer offers an interface adapted to the form |
| Foreknowledge + investigation | Warn a witness or choose a different preparation | Must have observed evidence; other people need a reason to believe the warning | One earlier chapter offers a changed plan under its declared history policy |
| Domain + ecology | Establish a sheltered microclimate for one project | Local scope, a maintained focus and conflict with another domain | A former habitat supports a high-level specialty without requiring endless upkeep |

Do not import every world rule into one global formula. A mechanical world can require cartridges, a spirit world can require an agreement, and an academy can require permission even when the character is powerful enough. Provide a baseline tool, service or local learning route where possible. Compatibility should create new preparations and alternatives, not arbitrary immunity to all imported progress.

## Implementation in the current YAIRPG foundation

### Source fit verified in this pass

Reads were made against this working tree on 2026-10-01. Existing unrelated changes were present. These are source observations, not a new gameplay or balance playtest.

| Local source | Actual useful foundation | New work required |
|---|---|---|
| `src/rules.js` | Pure `evaluateRule` handles all/any/not and explicit facts; `chooseOutcome` selects validated distributions; `resolveOnce` returns a serializable result receipt | Build contextual facts and integrate persistence. A receipt does not atomically spend resources, apply consequences or save an RNG stream |
| `src/actions.js`, `src/conditions.js`, `src/main.js/start_game_action` and `finish_game_action` | Required/display conditions, durations, progress and probabilistic resolution exist | Adapt a new event without letting inspection consume resources. Existing conditions must not be assumed to have the pure library's missing-value or side-effect contract |
| `src/quests.js`, `src/dialogues.js` | Staged objectives, conditions, flags, dialogue and unlock rewards support authored acquisition and field tests | Add explicit event/NPC outcome state and exactly-once effects; quest definitions currently also hold mutable progress |
| `src/activities.js`, `src/locations.js` | Jobs/training/gathering, tools, location activities and combat-zone definitions | One companion assignment can affect an event first. Several simultaneous actors or jobs need resource ownership and scheduling; `base_skills_names` comments warn that multiple base skills break assumptions |
| `src/main.js/create_save`, `load`, `process_rewards` | Central save/reconstruction and reward paths | Independently version an extension namespace, validate references and prevent rewards repeating during reconstruction. Unknown extension versions must preserve the original payload before autosave |
| `src/save_compatibility.js` | Existing retirement adapter preserves Jade Hollow content in `retired_content` | Preserve that payload alongside new extension data. Retired-content handling is not a ready-made migration for companions, habitats or new worlds |
| `src/person.js`, character/inventory and combat code | `Person` extends an inventory owner; character stats/equipment and enemy combat loops exist | This is not a party engine. Targetable allies need identity, health, targeting, damage, equipment, death/retreat, rewards and save ownership, plus timer coordination |
| `src/game_time.js`, `src/main.js` action/combat timing | Simulated calendar plus several timing paths | Define deadline and catch-up policy before habitat growth, rival actions or simultaneous production. A calendar alone does not implement safe offline simulation |

Baseline races remain cosmetic under the current project audit. PF08/PF11-style body changes cannot be implemented by renaming a race and assuming combat or equipment rules follow. Relevant older source findings and architectural ownership remain in [Engine expansion](ENGINE_EXPANSION.md), [Baseline audit](BASELINE_AUDIT.md) and the five dossiers.

### Five reusable contracts

| Contract | Minimal original shape | First real use | Avoid building prematurely |
|---|---|---|---|
| Capability query | Actor, source, action, environment, permission, available budget and reasons | Companion finds a ford; purchased tool is an alternative | A universal physics or arbitrary spell language |
| Assignment and reservation | Owner, assigned role/job, reserved inputs/capacity, start point and stop rule | One helper prepared for one expedition | Independent parties, factories and every NPC on the same scheduler |
| Committed event | Instance ID, definition revision, selected approach, costs, pending draw/result and applied-effect receipt | Rescue outcome and a later guide reaction | Event sourcing of every existing tick |
| Scoped consequence | Who/where owns a fact, how it can be observed and which transitions preserve it | Guide injury, route access or witnessed illegal practice | Whole-world opinion propagation or historical rollback |
| Content definition and progression state | Stable definitions separately from versioned progress and derived effects | One species, one role, one practice objective | Migrating every legacy object before the first new event |

These extend the existing architecture proposal. They are new integration work; no class, callback or JSON example establishes implemented behavior.

### Example data contract for an expedition helper

Illustrative JavaScript, not runnable content. The numeric budget and IDs are invented. The role definition stays outside the save; progress references it.

```js
const roleDefinition = {
  id: "frontier.reed_hound.find_ford",
  capability: "find_safe_ford",
  environment: "wetland",
  deployment: { assignment: "expedition_helper", rationPerTrip: 1 },
  masteryEvidence: "frontier.ford_field_test",
};

const progress = {
  schema: 1,
  companions: {
    "companion-001": {
      species_id: "frontier.reed_hound",
      source_event_id: "bank-recruitment-001",
      bond_state: "cooperative",
      known_behaviors: ["frontier.reed_hound.find_ford"],
      role_mastery: {},
      adaptation_id: null,
      condition: "ready",
      assignment: null,
      home_site_id: "frontier.handler_lodge",
    },
  },
};
```

A future capability query joins companion state to actor practice, environment, permission and supplies. It returns an explanation; it does not spend the ration. Commitment reserves or spends that ration once according to the chosen cancellation policy, assigns the helper and stores a pending event. Resolution applies a receipt and aftermath once. Reload resumes or displays the recorded event instead of repeating recruitment or drawing new odds.

For random actions, persist the chosen draw or a persisted RNG state as part of commitment before time passes; a future completion call must not obtain a new unrecorded draw after reload. A preview should use the same pure eligibility/outcome calculation as execution. Existing `resolveOnce` helps retain an outcome but cannot by itself ensure resource transactions, durable writes or single-tab ownership. Those remain explicit implementation gates.

### Delivery shapes, preserving the current milestone

| Slice | Observable addition | Additional cost and evidence |
|---|---|---|
| Ordinary event | One S01/S04/S10-style problem, two preparations and one downstream consequence | Event/save integration plus explanation UI; old-shaped saves and new outcome reloads verified |
| One helper or tool branch | A discovered companion role changes one event, with an ordinary tool alternative | Persistent identity and assignment; reliable acquisition, exhaustion recovery and no duplicated ownership |
| One reusable progression choice | Two role specializations, a card loadout or a temporary form | A budget and explicit tradeoff; each choice wins in a different relevant situation |
| One facility or institutional service | A sanctuary, workshop, tutoring project or managed room | Bounded project inputs, ownership, stop rules and useful output; no infinite production or neglect clock |
| One distinct-world interaction | A visited world's rule requires an adapter or local agreement | Local state and compatibility; older discoveries remain useful, cross-world transfer and reload work |

These are alternate implementation shapes, not authorization to deliver all five now. The current next increment remains one ordinary expedition/event from the base adventure. One realm and one prestige layer remain the first expansion milestone. None of these paths inherently requires a new reset layer, and the archived cultivation slice stays archived.

### Acceptance cases to use when the relevant system is built

| Failure case | Required observed behavior |
|---|---|
| Reopen preview repeatedly | No supplies spent, no trust awarded and no hidden random outcome generated |
| Reload during recruitment or a timed event | Same participant identity, reserved costs and committed draw/result; no duplicate reward |
| Assign a partner at home and to an expedition | One assignment succeeds or a clear reassignment occurs; no double production |
| Run out of feed or fuel | Stop/retreat under the previewed rule; preserve creature/tool and unused inputs |
| Evolve, rename or remove content | Keep instance identity; validate/migrate definition references and preserve unsupported data |
| Travel to incompatible terrain/world | Show the failing condition and a substitute or adapter; ownership is not silently erased |
| Rewind or select a legacy | Reset/retain the displayed domains; no copied individuals, cargo or mutually exclusive aftermath |
| Leave the game or open another tab | Follow a declared pause/catch-up and ownership policy; no unattended loss or duplicated new-system progress |
| Use a stronger ordinary build | Strength improves its applicable solution without automatically satisfying knowledge, trust or legal requirements |
| Repeatedly farm a resolved event | Explicit repeat rewards only; no uncapped trust, credentials, first-clear rewards or capacity refunds |

No new automated tests or browser playtests were performed for these proposals. A future gameplay implementation must rebuild the changed source and exercise the relevant cases in an isolated browser origin with generated saves. Documentation breadth does not count as playable acceptance.

## Five candidates for later selection

1. **Ecological expedition with a helper opportunity, S01.** Strongest immediate extension of ordinary adventure. It joins Perception, preparation, story aftermath and a later beast path without requiring party combat. Choose this if creature relationships are the next theme to test.
2. **Role-based field examination, S04.** Strongest test of combat, research, craft and support reaching one milestone differently. It can later feed mentors, card specializations or apprentice systems. Choose this to establish path diversity first.
3. **Winter salvage expedition, S06.** Strongest small contrast to cultivation. Tool capability, repair and fuel change how far a character can travel; one bounded budget comes before a factory or survival simulator.
4. **Sanctuary or managed ruin, S09/S08.** Strongest later bridge between creatures, home development and dungeon-core play. Build one useful site project before visitor AI, breeding or colony-scale simulation.
5. **Relief or caravan chapter, S07/S10.** Strongest test of progression through people, support and institutional leverage. Select an untimed event first if the shared scheduler is still absent; add rivals and deadlines only when they change an already playable decision.

These are recommendations for future selection, not an accepted order. Full party battles, permanent monster protagonists, breeding/fusion combinatorics, complete dungeon-core campaigns and continent economies remain substantial separate expansions. A quest-only version can test their appeal but must not be reported as the full system.

## Focused source gaps and coverage limits

| Priority source, if a direct adaptation is selected | Question and useful material | Does it block an original implementation? |
|---|---|---|
| **Jekua, book 1**, first imprint and first summon use | Is a pattern distinct from an individual, and what controls acquisition, deployment, retention and improvement? Read those scenes and their explanation before designing canonical imprints | No. Explicit original pattern/energy rules suffice for a prototype |
| **Knightmare Arcanist**, first bond and subsequent training | What do each partner's abilities, agency, costs, advancement and separation actually allow? A synopsis cannot establish exclusivity or shared lifespan | No. An original partner agreement and one field role can proceed |
| **Dungeon Born**, early core/creation teaching and first visitor interaction | What limits rooms, creature creation, resource gain and survival, and how do rewards affect visitors? Needed before direct core/economy adaptation | No. A negotiated managed ruin with invented finite budgets can proceed |

The Weirkey author's supplementary-material links are an additional locator, not a completed architecture audit. Detailed card combinations, rider progression, necromantic soul/control rules, species breeding, support authority and late domains also remain unsampled. Existing dossiers own their earlier chapter gaps. No purchase is requested merely to complete this map.

This sweep adds a 26-family design map, thirty trope-to-gameplay entries, eight creature/relationship contracts, fourteen scenario seeds, five worked scenario cards and source-aware implementation boundaries. It is intentionally broad but not exhaustive. It does not measure genre prevalence, complete any referenced game, certify complete novel canon or implement new play. The next useful evidence is a selected, rebuilt slice that proves its decisions and consequences.
