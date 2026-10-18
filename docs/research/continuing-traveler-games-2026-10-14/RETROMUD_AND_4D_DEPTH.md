# RetroMUD and 4Dimensions: worlds, livelihoods and portable capabilities

2026-10-14, America/New_York. Requested deeper research. Findings and original YAIRPG proposals, not implementation or accepted direction. This extends the [30-game scout](REPORT.md). No game login, account creation, playtest, purchase, installation, runtime edits, commit or push.

**Application to YAIRPG:** [coverage check and absorption proposals](YAIRPG_ABSORPTION_PROPOSALS.md). Read this before treating a donor mechanism as missing from YAIRPG; several relevant connections already exist in source.

## F9. The important correction to the comparison

**RetroMUD is a strong model for a traveler whose existing capabilities interact differently with each world. 4Dimensions is a strong model for a traveler who pursues different local livelihoods and brings back selected skills, goods and institutional rewards. Neither is evidence of unrestricted acquisition of a separate complete power system from every destination.**

Travel, changing class, death, logout and rebuilding the server world have separate rules. In particular:

| ID | Finding | Evidence boundary |
|---|---|---|
| F9a | RetroMUD's homeworld affects skill/spell performance, travel and commerce. Its elemental balance also connects pairs of planets. | Official help, not tested combat or measured prices. |
| F9b | RetroMUD careers include actual service products, hired shop workers, construction and multi-stage companion manufacture. | Official guild and ability descriptions. A listed ability is not a tested complete business. |
| F9c | 4Dimensions has remembered skills/spells in addition to four class-history slots. An executable eligibility branch and save fields support this. | Public source at a pinned revision; correspondence with the running server remains unverified. |
| F9d | 4Dimensions' trading help restricts organic cargo between dimensions while allowing materials such as logs and minerals. | Help documentation. Exact exceptions and script enforcement were not exercised. |
| F9e | Both sites contain documentation of different ages. Some rules disagree, and some registered professions are unfinished. | Differences retained below; source presence, documented intent and tested delivery stay separate. |

Labels: **D** = official website/help or its published data; **S** = executable source inspected statically; **A** = archived/bundled help; **P** = original YAIRPG proposal; **U** = unresolved. All gameplay claims here are documented or static, never playtested.

Authority remains [USER_VISION](../../USER_VISION.md), [PROJECT](../../../PROJECT.md) and the [multiverse design owner](../../worlds/MULTIVERSE_STRUCTURES.md). This report does not add universal power suppression, compulsory remort, upkeep chores, a mandatory home opening or a new world priority. The requested reference details are retained in the [private evidence library](private/deeper-muds/), described in [SOURCE_GUIDE](MUD_SOURCE_GUIDE.md).

## R1. RetroMUD: six worlds with different demands

These are planets of one Retroverse. Distinct environments and institutions make them useful comparisons without relabeling them independent fictional universes.

| World | Documented differences | Travel and local-life implications |
|---|---|---|
| **Sosel** | Hot, humid, biologically crowded; world prose connects spoilage, rust and building form with climate. | Living transport pods depend on daylight; not every apparent pod is safe. This supplies a route constraint beyond a portal fee. Climate prose alone does not establish a general implemented decay simulator. [World help](https://www.retromud.org/proxy/help?=Worlds/sosel) |
| **Wysoom** | Predominantly underwater; culture uses durable carved records and equipment suited to water. | Portal ships have particular destinations. Aquatic suitability, getting to the ship and knowing its route are separate questions. Do not infer numerical weapon penalties just from the cultural description. [World help](https://www.retromud.org/proxy/help?=Worlds/wysoom) |
| **Welstar** | More familiar land environments, cities and institutions; law and virtue shape its identity. | Statue transport involves statements, variable statue locations and an alignment-dependent risk. A player's social/moral state can affect a route without erasing the rest of their skills. [World help](https://www.retromud.org/proxy/help?=Worlds/welstar) |
| **Raji** | An airborne world with islands, currents and storms. Some peoples can fly naturally; others need support. | Sky transport and a rift route matter. An alchemist's arrival method can put the traveler in midair, so access and safe arrival need separate preparation. [World help](https://www.retromud.org/proxy/help?=Worlds/raji) |
| **Perdow** | Persistent darkness; inhabitants, senses and livelihoods respond to it. | The travel help describes partly unreliable gates. Sensing and navigation become useful capabilities rather than another damage tier. World prose also links monsters and occupations, but does not prove a fully simulated labor market. [World help](https://www.retromud.org/proxy/help?=Worlds/perdow) |
| **Crypt** | Underground, dark and rich in minerals; necromancy is described as civic labor as well as combat magic. Different physiologies value the same environment differently. | Shafts link destinations with changing configurations. Storage, miners, light, anatomy and undead services can all have consumers here. [World help](https://www.retromud.org/proxy/help?=Worlds/crypt) |

The [transport overview](https://www.retromud.org/proxy/help?=Movement/interplanetary_transport) is especially useful because it describes a network of different mechanisms, rather than one interchangeable gateway in each world. The [newbie advantages](https://www.retromud.org/proxy/help?=Basics/newbie_advantages) also show why early exploration can mislead: free movement, visibility, particular transport access and protections disappear at different levels. A comfortable beginner trip does not prove the same route is sustainable later.

### R2. A retained skill can perform differently without being forgotten

[Homeworld help](https://www.retromud.org/proxy/help?=Worlds/homeworld_bonuses) documents a +3% skill/spell bonus at home, reduced overland endurance costs and better buying/selling terms, including stable services. That version also describes corresponding penalties on the directly opposing world. A second [home-world help alias](https://www.retromud.org/proxy/help?=Abilities/home_world_bonuses) lists the home benefits but omits the opposing-world paragraph. Treat the latter as incomplete corroboration, not proof that the penalty was removed. The help alone does not settle the exact additive or multiplicative formula.

[Skill help](https://www.retromud.org/proxy/help?=Skills/skill) separately lists training, skill bonuses, equipment, environment and armor bulk as influences. This is a useful decomposition: the traveler retains training, while the current conditions change effective performance. Underwater competence is not the same property as having learned a skill.

[Elemental balance](https://www.retromud.org/proxy/help?=Magic/elemental_balance) adds a much less obvious interaction. Damage use affects a planet's elemental balance; opposing worlds mirror one another. The documented pairs are Welstar/Perdow, Wysoom/Sosel and Crypt/Raji. The help gives a 60–120% damage range and excludes physical, harm, psionic and sonic damage. This is a documented aggregate world effect, not evidence of an individual NPC remembering a player's spell use. It could alter later preparation on another planet even though the spell itself persists.

**P11:** For YAIRPG, distinguish acquired capability, local support and current effectiveness. The source's exact bonus, penalty and global balance are options to study, not universal balancing rules to adopt.

## R3. Guilds: a build path, a service economy and an institution

The website's published catalogues list **19 primary, 55 secondary and 279 tertiary guild entries** at capture. Those are 353 catalogue locations, not 353 tested full careers. This pass captured every primary's full ability table and five selected secondary tables, totaling **1,510 listed ability rows** across 24 guild pages. Raw tables, prerequisite text, descriptions and permitted continuations are saved privately.

[Guild-system help](https://www.retromud.org/proxy/help?=Guilds/guild_system) describes 20/14/9 level capacities. Taking one guild high enough changes how far later guilds may advance: a second primary need not supply the complete original primary kit. Tertiary choices have prerequisite paths. Higher-tier guilds can also supply different stat growth per invested level.

There is a real documentation discrepancy: that help says to complete the relevant 20-level primary before a secondary, while [Paths of Power](https://www.retromud.org/proxy/help?=Guilds/paths_of_power) says access can begin after primary level 14 and recommends finishing first. This pass does not pick one as the live rule. The safely supported conclusion is constrained composition, not unrestricted guild collection.

[Alignment rules](https://www.retromud.org/proxy/help?=Guilds/guild_alignment) affect ongoing use as well as admission. The documented restricted guilds cannot train, study, advance or use guild abilities while the required alignment is not maintained. That is conditional usability, not evidence that training records are deleted.

### R4. What each primary contributes

This is a routing table from captured primary data and [guild-dues help](https://www.retromud.org/proxy/help?=Guilds/guild_dues). Exact ability names, levels and paths are in the private tables. Dues entries are institutional descriptions; different help pages can emphasize different earning methods.

| Primary | Useful progression identity or consumer |
|---|---|
| Abjurer | Protection; institutional accounting for defensive spell use |
| Alchemist | Components, glass vessels, elemental equipment, potions, constructs and ranged weapons |
| Assassin | Specialized violence and trophies rather than generic kill XP alone |
| Bard | Exploration and stories feed the instrument/progression loop |
| Biomancer | Diagnosis, treatment, physiology and healing services |
| Cultist | Sacrifices, patron standing and contracted services |
| Druid | Nature products and reincarnation services |
| Fallen | A signature weapon and accumulated power with its own consumer |
| Fighter | Combat specialization and visible evidence of prowess |
| Jomsviking | Devotional combat conduct and offerings |
| Mage | Magical research/development and elemental continuation paths |
| Merchant | Repair, fitting, valuation, construction, storage and shops |
| Monk | Unarmed disciplines and practices linked to its institution |
| Necromancer | Body-part acquisition, assembly, animation and creature development |
| Paladin | A signature shield and institution-linked power |
| Psionicist | Mental development, chakra-related practices and gem consumers |
| Ranger | Travel knowledge, animal support, practical processing and ranged/melee tools |
| Sentinel | Rescue, law enforcement and protection |
| Templar | Ritual care of the dead and resurrection services |

The important lesson is not nineteen new XP bars. It is that membership recognizes different actual outputs: exploration, healing, a crafted product, a rescue or a prepared creature.

### R5. Detailed career chains worth keeping

**R5a / Merchant: convert world travel into a service network.** [Merchant help](https://www.retromud.org/proxy/help?=Guilds/merchant_guild) describes repair, fitting/alteration, valuation and gem services. It also describes renting a shop and training a clerk, with the owner maintaining supplies and the clerk performing less well than the merchant. This is meaningful delegation rather than an unexplained passive-income button. Construction and storage give the profession an enduring consumer. A skill owner can support travelers with different equipment needs without granting those customers the merchant's mastery.

The published [Merchant ability table](https://www.retromud.org/proxy/guildsxml?=primary:merchant) gives a concrete growth sequence: repair at guild level 9, gem cutting at 10, resizing and castle repair at 11, chest creation at 15, and shopkeeping/masonry at 20. These are displayed guild-grant levels, not universal ability difficulty. [Gem-cutting detail](https://www.retromud.org/proxy/skillsxml?=gem_cutting) supports batches of up to twenty gems and describes a life-force relationship affecting results. The exact calculation and demand for player services were not measured.

**R5b / Alchemist: one material chain supplies combat, research and travel.** [Alchemist help](https://www.retromud.org/proxy/help?=Guilds/alchemist_guild) connects mineral/plant collection, glass containers, fundamentals, ammunition, potions, gear enchantment and constructs. [Glass blowing](https://www.retromud.org/proxy/skillsxml?=glass_blowing) names a reusable kit and consumable sand. [Potion research](https://www.retromud.org/proxy/skillsxml?=research_potion) names four fundamental-charge inputs, limits eligible spell categories and says some spells cannot be made into potions. Thus research is not automatic acquisition of every possible spell effect.

[Fundamental travel](https://www.retromud.org/proxy/spellsxml?=fundamental_travel) uses elemental material to reach particular worlds or the Rift. The guide warns that arrival can demand flight. This gives a component competing useful consumers: gear work, research and transportation. The guide's familiar progression also branches toward magical damage, ranged expertise or service versatility. Full source behavior and every alternative path remain untested.

**R5c / Biomancer: imported bodies change useful expertise.** [Physiology help](https://www.retromud.org/proxy/help?=Races/physiology) allows multiple body classifications and describes how healing handles them. The published [Biomancer table](https://www.retromud.org/proxy/guildsxml?=primary:biomancer) places diagnosis, surgery and physiology alongside healing. Alchemist construct repair/protection is documented as useful for construct players as well as pets. A healer's useful method can depend on what the patient actually is. That is richer than assigning every species the same potion compatibility.

**R5d / Ranger: knowledge changes where you can act.** [Ranger help](https://www.retromud.org/proxy/help?=Guilds/ranger_guild) distinguishes memorizing a place from navigating toward it, with navigation scoped to the same planet. It connects terrain knowledge, endurance-saving travel, food, animal support and material processing. The sampled table puts packing/cooking/field dressing early and later introduces tanning, crafting and combat riding. The useful acquisition is a practical route or preparation that expands future choices, not merely more attack damage.

**R5e / Necromancer: companions are assembled and developed.** [Necromancer help](https://www.retromud.org/proxy/help?=Guilds/necromancer_guild) describes assessing corpses, collecting parts, assembling in a laboratory, implanting a brain, supplying ingots and animating. The documented body has four part locations, classifications and types; the help currently restricts all four parts to a matching type. Brain type and level affect the creation, while later equipment and advancement develop it. All full conditions are saved privately. This is a construction process with compatibility checks, not a claim that arbitrary collected parts combine successfully.

**R5f / Telemancer: transporting yourself, cargo and companions are different capabilities.** Its [published table](https://www.retromud.org/proxy/guildsxml?=secondary:telemancer) separates marks, relocation, object transport, summoning, projections and portals. [Create mark](https://www.retromud.org/proxy/skillsxml?=create_mark) permits marks associated with the present world. [Dimensional portal](https://www.retromud.org/proxy/spellsxml?=dimensional_portal) requires both endpoints to allow teleportation and ties duration to mastery. This creates destinations to establish and routes to support, rather than a universal travel flag.

### R6. Subtle restrictions that change a build

| ID | Documented interaction | Why it matters |
|---|---|---|
| R6a | [Limbs](https://www.retromud.org/proxy/help?=Races/limbs): more arms do not automatically yield more attacks; a particular later skill supports those attacks. | Body capacity and trained coordination are different capabilities. |
| R6b | The same help distinguishes free limbs for somatic casting from weapon use; limbless races have their own casting accommodation but cannot use some required held guild items. | A body can suit ordinary casting yet be unsuitable for a signature-item guild. Do not reduce this to a universal disability penalty. |
| R6c | [Wands](https://www.retromud.org/proxy/help?=Treasure/wands) hold spell effects and require zapping; the help distinguishes carrying wands from the instability of holding too many. | Possessing an effect carrier is not learning its spell. Exact carried/held handling still needs a runtime check. |
| R6d | [Recharge](https://www.retromud.org/proxy/spellsxml?=recharge) can destroy a wand; a power room reduces strain. [Masonry](https://www.retromud.org/proxy/spellsxml?=masonry) can create that room. | A home facility materially changes treatment of an acquired tool. |
| R6e | [Sensitize](https://www.retromud.org/proxy/spellsxml?=sensitize) adds a selected vulnerability but does not stack. | A party's imported attacks can compete for one shared preparation rather than all multiplying freely. |
| R6f | [Mounts](https://www.retromud.org/proxy/help?=Movement/mounts) provide movement benefits, possible flight and packing, but are not automatically protective party members. | Carrier, mount and combat companion are separate roles. |
| R6g | [Summon minions](https://www.retromud.org/proxy/spellsxml?=summon_minions) needs the follow link and a teleport-permitting destination; this spell explicitly excludes necromancer undead. | A broad ability name does not guarantee every companion crosses. |

### R7. Institutions, teaching and home persistence

[Training](https://www.retromud.org/proxy/help?=Skills/training) consumes experience and normally gold at a guild training room, with several beginner fee waivers. [Teaching](https://www.retromud.org/proxy/help?=Guilds/teach) is distinct: a full member present with the learner can reduce the cost, saving experience when the normal gold cost is already waived. [Apprenticeship](https://www.retromud.org/proxy/help?=Guilds/apprenticeship) adds named ongoing support, eligibility, a graduation boundary and an institutional benefit to the master. A temporary apprentice bonus is not the student's whole learned skill record.

[Guild credit](https://www.retromud.org/proxy/help?=Guilds/guild_credit) adds another non-equivalent resource: primal energy can fund training credit, with normal versus reincarnation-exp rules and a druid-mediated conversion to credit usable in other guilds. That is a documented service for portability, rather than assuming all institutions accept one currency.

[Castles](https://www.retromud.org/proxy/help?=Treasure/castle) connect construction, protected storage, fitted doors, traps, anti-teleport support and golem defenses. [Settlements](https://www.retromud.org/proxy/help?=Treasure/settlements) change the access default from private to public, retaining room permissions and exclusions. Upgrading a private home into a public establishment changes access policy, not just its size. Masonry also prices underwater construction differently and supports recovery facilities.

Persistence has a sharper boundary than the earlier scout established. [Storage help](https://www.retromud.org/proxy/help?=Treasure/storage) says server-world destruction/reboot removes unprotected items; surviving goods need appropriate containers and locations. [Rent help](https://www.retromud.org/proxy/help?=Treasure/rent) describes rented storage with expiration and limited capacity. A castle is not unconditionally safe either. [Castle-decay help](https://www.retromud.org/proxy/help?=Treasure/castle_decay) explicitly suspends decay from time alone while retaining other collapse risks. Do not turn its generic maintenance warning into a current daily decay claim.

## D1. 4Dimensions: four eras, common traveler, local livelihoods

The [world catalogue](https://4dimensions.org/wiki/index.php/Zones) describes a central travel/social area plus four dimensions. It is a substantial authored catalogue, but its wiki revision is dated 2021. Current reach and quest availability were not established by reading it.

| Dimension | Useful documented local activity | Boundary of the comparison |
|---|---|---|
| **Prehistoric** | Ancient/mythic Mediterranean regions, sea travel, markets and ingredient-based trade chains | The name includes much more than literal prehistory. Do not infer an accurate historical simulation. |
| **Medieval** | Olde Yorke services, farming, craft workshops and institutional/social centers | Common workshops make work a local place. A workshop sign or planned craft is not proof of a complete executable production chain. |
| **Old West** | Ranching, trapping, skins, mining, goldpanning, rail travel and related trade | The catalogue and occupation help connect transport and livelihoods. Individual jobs have different tools and risks. |
| **Future** | Space travel, vehicles, multiple planets, technical settings and social/service destinations | This is a broad setting family, not one combat biome. No proof that every technology has a full progression system. |

A traveler can have magic and visit the future, or develop practical trade in another era, without a new character being created just by moving. **No documented butterfly-effect simulation or general rule that magic shuts off in the future was established.** Different eras are authored destinations; they are not automatically causally linked historical states.

### D2. Classes are not guilds, clans or professions

[Class guidance](https://4dimensions.org/4dimensions-org-port-6000/classes/) lists eight classes grouped as rogues, casters and fighters. Its concrete interactions include lighter-weapon speed for rogue classes, hands-free casting, and orbs/staves for magical combat. Manifesting an orb from a weapon and obtaining a woodsung staff connect different practitioners' products.

The distinctions matter:

| Layer | Function | What should not be inferred |
|---|---|---|
| Class | Main skill/spell eligibility and advancement | Not a separate world learned on arrival |
| Remort history/mastery | Rebuilding a level path while retaining selected capability/history | Not ordinary dimension travel |
| Remembered ability | A separately recorded learned skill or custom spell | Not another complete class slot |
| Clan | Social membership, rules, facilities and routes | Not interchangeable with RetroMUD's class-like guilds |
| Occupation/craft | Useful local work, inputs, processing, trade and rewards | Not necessarily a globally registered profession skill tree |

[Clan guidance](https://4dimensions.org/4dimensions-org-port-6000/clans/) describes halls with services and exits to the four dimensions, plus different membership conditions. Thus membership can supply practical infrastructure as well as identity. The page repeats a clan entry and its stated count is unreliable; this report does not reproduce that count as current truth.

### D3. What remort actually preserves, and what it does not

The public source revision is **`d2ee92671693f2f0eac88d7d5f9d86bebc17d89c`**, dated 2026-09-23. Its running-server correspondence is U. Full source excerpts and line references are indexed privately.

In [remort.cpp](https://github.com/4dmud/mud/blob/d2ee92671693f2f0eac88d7d5f9d86bebc17d89c/remort.cpp#L52), remort resets level/experience and updates current plus three remembered class slots. A full history requires selecting a slot to discard. Mastery flags persist separately. The earlier report stopped at a comment about broad mastery; deeper inspection now finds an executable `grand_master` check and a related grant branch in [spell_parser.cpp](https://github.com/4dmud/mud/blob/d2ee92671693f2f0eac88d7d5f9d86bebc17d89c/spell_parser.cpp#L1437). That branch uses each ability's `gm` eligibility field, so it is not evidence that every game effect becomes available.

Ordinary skill/spell access depends on recognized class history, effective tier, current level and prerequisites. The inspected code caps non-current class tier contribution at two. The [wiki remort help](https://4dimensions.org/wiki/index.php/REMORT_REMORTS_REMORTING_TIER_TIERS) describes progressive forgetting as a new class advances. Joining the eligibility function to the history update explains that behavior: four old-class slots become one new plus three old, then two/two, three/one and finally four new as successive remorts replace the oldest slots. Old-class effective tiers therefore fall from two to one to absent. The four-slot history is itself a mechanism for forgetting, rather than a second undocumented subtraction in the eligibility function. The chosen discard slot matters before full specialization; this is a static trace, not an exercised remort journey.

The helper named `MakeNaked` temporarily unequips gear into character-held bookkeeping. Its name is not proof that remort destroys possessions. Full remort triggers and later restoration were not executed, so blanket item-retention claims remain open.

### D4. Remembered skills add an explicit route around lost class access

[Remember help](https://4dimensions.org/wiki/index.php/REMEMBER) describes a contract-based service for recovering previous skills/spells and creating custom spells from remembered magic. No quest solution is reproduced here.

Static source goes further than this description:

| ID | Source trace | Supported conclusion |
|---|---|---|
| D4a | `structs.h` 1775–1796, 1827 and 2048 | Remembered records separately hold skill ID/name, percentage remembered, percentage learned and custom spell fields; the default vector has five records. Five defaults are not proof of an immutable live cap. |
| D4b | `spell_parser.cpp` 1461–1470 | A fully remembered matching ability can pass the early eligibility branch before ordinary class/tier checks. |
| D4c | `skills.cpp` 3082–3146 | Effective chance still needs learned proficiency and handles prerequisite skill percentages; memory is not automatic perfect execution. |
| D4d | `trainers.cpp` 618–711 | Remembered abilities have a training path, including a special intermediary condition when ordinary trainers are absent. Training caps and later improvement remain distinct. |
| D4e | `db.cpp` 5776–5830 and 6236–6256 | Save read/write paths include remembered percentages, IDs/names and custom messages/types. This is static persistence support, not a verified save roundtrip. |

The similarly named `mremember`/`mforget` commands manipulate NPC script memory. They are **not** the player's remembered-skill acquisition API. This is an easy false match when searching the source.

### D5. Trade can develop the character without being combat

[Occupation help](https://4dimensions.org/wiki/index.php/PROFESSIONS_OCCUPATIONS) distinguishes gathering/production work from preparing, crafting and trading. [Crafting help](https://4dimensions.org/wiki/index.php/CRAFTING) is unusually candid: some crafts are complete, others partly developed or planned. It also allows useful material preparation before learning the later craft. Raw preparation and mastery are different useful roles.

The [tradepoint rules](https://4dimensions.org/wiki/index.php/TRADEPOINTS_POINTS_TRADING_TP) let work produce a portable reward, including experience and practical equipment/services. The same help reserves important personalized goods and homes for tokens. Thus “earn TP through work” does not imply “buy anything with TP.” [Currency tables](https://4dimensions.org/wiki/index.php/Currency) likewise distinguish accepted tenders, conversions and service prices. Their age and incomplete status make them a reference, not a current purchasing quote.

Several linked mechanisms are unusually useful:

| ID | Documented mechanism | Why it matters |
|---|---|---|
| D5a | [Trade value](https://4dimensions.org/wiki/index.php/TRADEVALUE): processing can improve price; finished products require the right buyer. | The same input can be sold now or reserved for a more useful chain. |
| D5b | [Trade supply](https://4dimensions.org/wiki/index.php/TRADESUPPLY): limited supplies, respawns, decay and competition affect availability. | A route can be known without its required stock being available. |
| D5c | That supply help limits cross-dimension organic goods, with exceptions, while allowing logs/minerals. | Inventory ownership does not guarantee that every crossing preserves every cargo type. |
| D5d | [Trade demand](https://4dimensions.org/wiki/index.php/TRADEDEMAND): repeat deliveries, buyer state or a trade sequence can affect return; confidence can open later requests. | Price and opportunity can depend on history rather than one universal sell multiplier. |
| D5e | [Ranching help](https://4dimensions.org/wiki/index.php/RANCHING_MILKING_SHEERING): animals can supply market stock or processed materials. The help itself is unfinished. | Animal ownership has competing consumers; a half-written recipe must not become an exact implemented production claim. |

The bundled farming help additionally describes a once-per-player/per-reboot field yield, crop processing and different buyers. Fishing has tools, bait, eligible locations and possible dangerous catches. These are distinct work contracts, not automatic passive-income tracks. Full original help and conditions are retained privately.

### D6. Source registration does not prove a finished profession

`proffessions.cpp` groups and displays subskills. `subskills.cpp` registers many attractive labels, including mining, business and technical abilities. However, the inspected command dispatcher only handles selected subskills, and some handlers explicitly report unfinished behavior. Several craft registrations are commented out.

This does not prove the corresponding **local scripted occupation** is absent. It means the generic profession catalogue, implemented command handlers and zone scripts are different layers. A player may have a working ranch or craft chain even when a similarly named generic subskill is unfinished. Conversely, a profession enum named Shipbuilder is not proof of a playable shipbuilding career.

The private extraction indexes 333 lexical ability-registration calls, with source lines and original arguments. It deliberately includes the qualification that comments/preprocessor state can affect activation. It is a reference index, not a census of live usable skills.

### D7. Homes, quit and item survival are separate persistence routes

[Quit/save help](https://4dimensions.org/wiki/index.php/QUIT_SAVE) describes keeping character progress and equipment when leaving. The inspected quit path saves exploration when flagged, a separate keyring, aliases and rented-object state before extraction. The object-save path filters non-rentable items, with key-specific rules. Do not simplify this to “all keys disappear” because a separate keyring path exists.

[Player-house help](https://4dimensions.org/wiki/index.php/PLAYERHOUSES) describes controlled guest access and crash-saving room contents. Its warnings about nested containers and modified items look old relative to the current source's recursive object serializer and newer format handling. This pass does not certify those warnings obsolete or certify arbitrary contents safe. It preserves the source/help difference and leaves roundtrip testing open.

Personalized, reloadable, ordinary stored and temporary goods are also separate categories in the currency/service documentation. Being named for the player is not automatically the same as being saved at a location or being recoverable after destruction.

## C6. Carryover comparison by transition

| Transition/state | RetroMUD | 4Dimensions |
|---|---|---|
| Ordinary world travel | Continuing character; changing local environment/affinity can change effective use. D | Continuing character across eras; cargo-specific trade restrictions documented. D |
| Learned ability elsewhere | No evidence of universal deletion at a planet border; guild, body and environment conditions still matter. D/U | Class/tier/level/prerequisite eligibility plus a separate remembered-ability path. S; not a rule that each era grants a complete class |
| Held equipment | Fitting, condition and required held items affect use; travel-wide cargo exceptions not comprehensively checked. D/U | Documented special handling for cross-era organic trade goods; no comprehensive all-object crossing trace. D/U |
| Companions/mounts | Summoning depends on creature kind, follow state and destination; mounts have their own role. D | Housing/service documentation offers pets, mounts and vehicles; full travel/logout behavior of each remains U |
| Logout/server reboot | Special surviving equipment/storage matters; rent and castle rules differ. D | Character/object save, keyring and house-room save are distinct source paths. S |
| Ordinary death/recovery | Recovery choice, healer role/alignment and training affect penalties. D; percentages refer to the game's death framework, not a new world transition | Corpse and dangerous-area recovery mechanisms documented; exact complete death-item branch not audited. D/U |
| Reincarnation/remort | Reincarnation replaces race/guild setup and refunds taxed/requalified experience; some equipped/autoload categories differ. D | Level/class rebuild with bounded history, mastery and separately remembered skills. S/D |
| Home/estate | Persistent facilities support storage, repair/recharge and public services; not all structural risks are time decay. D | Controlled storage, routes, services and personalized possessions; exact latest live capacities U |

[RetroMUD reincarnation help](https://www.retromud.org/proxy/help?=Death/reincarnation) is explicit that it changes race/guild choices rather than keeping every learned guild in full. [Reincarnation experience](https://www.retromud.org/proxy/help?=Death/reincarnation_experience) is a re-spendable resource with special training/eligibility interactions, not an unchanged skill list. Likewise, [death scenarios](https://www.retromud.org/proxy/help?=Death/death_scenarios) show why healer specialization, alignment and party membership matter during recovery. These sources should not be repurposed into a mandatory YAIRPG death tax.

## P12. Ranked YAIRPG mechanisms to adapt, as proposals

These are research suggestions. Existing career, craft, custody, world, body and NPC owners should be reused when a later authorized implementation selects a slice.

| Priority / ID | Mechanism and concrete connected journey | Small interactions and acceptance evidence |
|---|---|---|
| 1 / P12a | **Foreign skill with a home consumer.** Learn one material-treatment method abroad, retain the learned record and use it on a native repair/craft order after returning. | Separate knowledge, permission, tool, input and actual practice. Prove changed output plus unchanged old mastery through travel and save/reload/import. |
| 2 / P12b | **A service business with a real worker.** A trained helper operates one stocked repair bench while the traveler takes an expedition. | Worker competence, wages, supplies, customer eligibility, receipts and absence policy each have consumers. No income when the bench lacks inputs or access. RetroMUD's clerk is the reference; no always-online server is required. |
| 3 / P12c | **Local preparation creates multiple travel choices.** A material can fund a portal, make a protective item or support a study experiment. A carrier route is an alternative where authored. | Entry, arrival safety, return and cargo are separate. Prove two useful routes and a truthful blocker, rather than inventing a universal restriction to make travel hard. |
| 4 / P12d | **Training and active institutional favor stay separate.** A teacher's temporary aid expires at graduation; the practiced method and teacher relationship remain. | Membership can change credit, access or discounts without deleting acquired skill. Prove the exact supported effect and learned record after the relationship state changes. |
| 5 / P12e | **A home facility changes treatment of acquired gear.** A fitted workshop allows safer maintenance of a foreign tool. | Tool provenance, ownership, charge/condition, failure and a real downstream use matter. Prove the facility's specific consumer and persistence; no need to copy rent expiry or destructive daily resets. |

Further subtle combinations worth retaining:

| ID | Interaction | Original proposal or question |
|---|---|---|
| P13a | Body × skill × tool | Extra manipulators can permit carrying/casting together without automatically granting coordinated attacks. Adapt only where a start/body supports it. |
| P13b | World ecology × material culture | Local record media, clothing, containers and buildings can explain what residents make and teach. Enforce only rules with actual supported consumers. |
| P13c | Mount × load × companion | A carrier may solve transport and endurance without becoming a combat shield. Track cargo custody and the creature's own needs. |
| P13d | Price × buyer history × tender | Familiarity can open a later commission while the same buyer accepts only specific currencies or goods. Display the real reason. |
| P13e | Dues × useful deed | A rescue, healing shift, expedition account or accepted craft order can advance institutional recognition. Avoid awarding every kind of rank from generic kills. |
| P13f | World aggregate × later return | An authored finite change could affect a paired destination's preparation. RetroMUD's global elemental balance inspires the possibility, not a promise of unrestricted offscreen simulation. |
| P13g | Shared effect carrier × learned method | A borrowed wand or hired specialist supplies an output without teaching mastery automatically. A later apprenticeship could establish the missing learning route. |
| P13h | Ordinary goods × durable records | A declared cargo rule can preserve notes or learned technique while transforming/losing particular goods. No reset should silently replace the character's whole inventory. |
| P13i | Beginner help × future route | Show when assistance expires before a player depends on it. A high-level return should explain a newly relevant movement or sensing requirement. |
| P13j | Private home × public institution | Opening a workshop/settlement changes entry and property permissions, service reach and resident responsibilities, not merely its label. |

## A2. What is saved, checked and still open

The reference library includes full help text, all captured world descriptions, guild indices, full sampled skill/spell tables, individual ability conditions, the pinned 4D source files and bundled text archive, and decoded static flow notes. [SOURCE_GUIDE](MUD_SOURCE_GUIDE.md) explains what to read next without rereading everything.

Validation covers captured-byte hashes, derived JSON/CSV structure, catalogue/row counts, exact source spans, local links and Markdown whitespace. Malformed RetroMUD XML is retained unchanged; lexical extraction is documented, and the site's own renderer confirms how raw level indices become displayed guild levels. No gameplay or numerical-effect test was run.

The authoritative remaining gates are live help/source agreement where noted, one ordinary cross-world acquisition/return trace, the relevant companion/item exception, and actual logout/death/remort persistence. A source table or saved report does not close those gates. No gameplay build is needed for this documentation-only pass.
