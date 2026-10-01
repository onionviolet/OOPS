# LitRPG systems, professions and repeated runs

Research date: 2026-09-30, America/New_York. Research and design proposals only. No gameplay, shared documentation, save, library or upstream changes are made by this dossier.

## Recommendation and evidence rules

Make ordinary adventure generate recognizable expertise before introducing a universal system or another reset. A useful first loop is **clue → expedition → manual or mentor → practice → a new way through an obstacle**. Offer martial and craft/research approaches. Later classes can recognize those choices; cultivation can be an earned optional branch. Preserve Jade Hollow as the current review prototype until a replacement is implemented and tested.

The strongest contrasts in this sample are a profession recognized through work, externally imposed survival rules, learned information surviving a reset, and an explicit ability that preserves powers through regression. These are different contracts, not interchangeable flavors of prestige.

Labels used below:

- **Verified narrative:** the cited original chapter or licensed translation supports the specific claim. Characters' beliefs remain beliefs, not omniscient explanations.
- **Verified game/source:** developer documentation or inspected public code supports the claim. Source inspection does not establish current deployed balance or a browser playtest.
- **Interpretation:** a design lesson drawn from those observations.
- **Proposal:** original YAIRPG rules awaiting creative review.
- **Gap:** precise lore or behavior was not verified. No inference from a title, synopsis or wiki becomes canon by repetition.

This is a bounded sample of eight works, four fiction references and four games. It is not an exhaustive genre survey. No named work becomes a confirmed favorite or selected fan setting. The parent chat reported a local Lord of the Mysteries EPUB and assigned its detailed research to the alternative-power lane. This lane did not inspect the library, private lists, coursework or personal saves.

## Why these eight references

| Work and inspected source | Selection reason and reception boundary | Contrasting design question |
|---|---|---|
| **The Wandering Inn**, pirateaba, [rewritten 1.00](https://wanderinginn.com/2017/03/03/rw1-00/) | Its official [new-reader page](https://wanderinginn.com/new-landing-page/) reports three r/Fantasy Stabby awards. This is community recognition, not a juried critical consensus. | Can ordinary work create a valuable identity without first becoming combat? |
| **Dungeon Crawler Carl**, Matt Dinniman, [author's book page and chapter-one preview](https://mattdinniman.com/books/dungeon-crawler-carl/), [licensed publisher excerpt](https://www.penguinrandomhouseretail.com/book/?isbn=9780593820254) | Publisher identifies it as a New York Times bestseller and includes endorsements from genre authors. Commercial success and selected endorsements are different from universal acclaim. | What happens when the rules are an exploitative institution rather than neutral convenience? |
| **Mother of Learning**, nobody103/Domagoj Kurmaić, [author's Royal Road publication](https://www.royalroad.com/fiction/21220/mother-of-learning), chapters 5 and 6 | The live listing displayed over 33,000 followers and 12,000 favorites. This demonstrates substantial platform reception, not an award or a cross-platform ranking. | How does learning change the next itinerary while material work must be repeated? |
| **SSS-Class Revival Hunter**, Sinnoa, [licensed novel publication](https://www.wuxiaworld.com/novel/sss-class-revival-hunter), chapters 1–3 | Selected for a sharply contrasting death-triggered regression contract. Licensing and reader reviews establish availability/reception, not a claim that it is among the universally best books. The [Yen Press comic series](https://yenpress.com/series/sss-class-revival-hunter) is a separate adaptation. | Which abilities persist, which trigger applies, and what cost makes recurrence consequential? |
| **Proto23**, [published source](https://github.com/23html/23html.github.io/blob/e93a8cd617932fb698ff889b968a32f9a20d48f3/index.html) | Directly relevant to YAIRPG's inspiration. Selected for source access and skill/manual structure, with no acclaim claim. | Can dense mastery feel grounded in books, instructors and local activities? |
| **Your Chronicle**, Samurai Games, [developer Steam listing](https://store.steampowered.com/app/1546320/Your_Chronicle/) | Direct comparison requested; developer description inspected rather than treating a community guide as authoritative. | Can story choices unlock automation and additional systems gradually? |
| **Melvor Idle**, Games by Malcs, [developer Steam listing](https://store.steampowered.com/app/1267910/Melvor_Idle/) | Useful contrasting skill economy; store showed Very Positive English reviews. Store reception is not measured design quality. | How do noncombat skills remain relevant through outputs consumed by other activities? |
| **Idle Loops**, [omsi6 public implementation](https://github.com/omsi6/omsi6.github.io/tree/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops) | Smaller source-readable reference selected for route planning and retention, not fame. This is the omsi6 implementation, not a claim about every fork or the original version. | Does repeating a queue change its order, prerequisites and endpoint? |

Source reads were live. GitHub references are pinned to the latest commits returned during inspection; novel wording follows the inspected edition or translation. No book purchase or paid unlock was used.

## Taxonomy: 18 families and their mechanical translations

These are analytical families, not a claim that each occurs in every LitRPG. The evidence column states what the sample actually establishes. Rules in the final column are proposals, not borrowed canon.

| Family: narrative trope versus game mechanic | Sample evidence and limits | Proposed YAIRPG translation and trap |
|---|---|---|
| 1. **System as an actor** versus an ordinary HUD | Carl's author synopsis establishes a dungeon staged as an intergalactic reality show. [DCC](https://mattdinniman.com/books/dungeon-crawler-carl/) | A local trial authority can grant licenses and impose conditions. Do not assume that an inventory panel requires a cosmic judge. |
| 2. **Earned profession/class** versus a fixed creation choice | Erin's work precedes an Innkeeper notification. [TWI 1.00](https://wanderinginn.com/2017/03/03/rw1-00/) | Recognize a body of completed work, then offer a specialization. Avoid forcing every new character to choose a permanent class before seeing play. |
| 3. **Profession utility** versus combat-stat reskin | TWI's first class grants cleaning and cooking Skills. [TWI 1.00](https://wanderinginn.com/2017/03/03/rw1-00/) | Cooking can support expeditions and social access; repair can enable routes. A profession should have an output beyond generic damage. |
| 4. **Practice acquisition** versus automatic level grants | SSS chapter 2 presents several reported acquisition routes, including repeated training and abilities available on entering the Tower. [SSS 2](https://www.wuxiaworld.com/novel/sss-class-revival-hunter/sss-chapter-2) | Separate discovered, understood and practiced states. A displayed requirement is not meaningful unless completion changes an action. |
| 5. **Manual/mentor knowledge** versus buying a passive | Proto23's instructor offers specialization manuals; its Bladesman Manual changes Sword Mastery XP. [Source](https://github.com/23html/23html.github.io/blob/e93a8cd617932fb698ff889b968a32f9a20d48f3/index.html#L5478) | Restore or obtain a manual, practice it, then unlock a stance or obstacle solution. An XP bonus alone is a weak discovery reward. |
| 6. **Trait or aptitude** versus another additive stat | Idle Loops stores talent separately from temporary stat XP. [stats.js](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/stats.js#L132) | A trait can alter a narrow practice cost or preparation route. Do not add a universal learning multiplier that makes every activity mandatory. |
| 7. **Title/reputation** versus automatic mechanical power | Proto23 milestone tables grant titles; SSS's public Hunter ranking exists alongside actual Skills. [Proto23](https://github.com/23html/23html.github.io/blob/e93a8cd617932fb698ff889b968a32f9a20d48f3/index.html#L1764), [SSS 1](https://www.wuxiaworld.com/novel/sss-class-revival-hunter/sss-chapter-1) | Separate descriptive titles, faction credentials and equipped effects. A public nickname need not be a supernatural buff. |
| 8. **Quest contract** versus an objective tracker | Your Chronicle's developer describes quests and choice-dependent endings. [Listing](https://store.steampowered.com/app/1546320/Your_Chronicle/) | Give a contract a requester, evidence and reward. A journal is interface convenience unless the world recognizes the contract. |
| 9. **Achievement recognition** versus a grind counter | Proto23 has milestone rewards and titles in source; this is a verified game example, not verified DCC achievement lore. [Source](https://github.com/23html/23html.github.io/blob/e93a8cd617932fb698ff889b968a32f9a20d48f3/index.html#L1865) | Reward first successful applications or distinct solutions. Repeatable kill totals should not produce endless global bonuses. |
| 10. **Class branching/consolidation** versus collecting every tree | Proto23 offers multiple manual choices. No fiction consolidation formula was audited here. [Source](https://github.com/23html/23html.github.io/blob/e93a8cd617932fb698ff889b968a32f9a20d48f3/index.html#L11743) | Keep familiarities, equip one practice commitment. A hybrid needs a unique interaction and opportunity cost; do not require completion of all professions. |
| 11. **Dungeon expedition** versus infinite auto-combat | Melvor developer description connects combat, dungeons and bosses; Your Chronicle advertises automated dungeon battles. [Melvor](https://store.steampowered.com/app/1267910/Melvor_Idle/), [YC](https://store.steampowered.com/app/1546320/Your_Chronicle/) | Prepare food, tools and a stance; stop at a safe checkpoint. Automation needs exhaustion and retreat rules. |
| 12. **Tower as staged progression** versus stronger floor numbers | SSS chapter 1 establishes floor clears and competitive guild attempts. Exact later floor rules are unaudited. [SSS 1](https://www.wuxiaworld.com/novel/sss-class-revival-hunter/sss-chapter-1) | Each chamber tests a different preparation decision. Use three authored stages before imagining an endless tower. |
| 13. **Trial of competence** versus arbitrary XP gate | Idle Loops implements guild tests with eligibility, progress and guild-specific access. [actionList.js](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/actionList.js#L2112) | Prove a technique under a known constraint; offer craft and combat solutions. Show failure causes, not only “power too low.” |
| 14. **System apocalypse** versus campaign starting difficulty | DCC's official synopsis establishes destruction and organized survivor exploitation. [Author](https://mattdinniman.com/books/dungeon-crawler-carl/) | A later quarantined region can have externally imposed rules. Do not erase the ordinary campaign to justify UI numbers. |
| 15. **Regressor foreknowledge** versus extra permanent stats | Zorian uses prior encounters to make different choices. [MoL 5](https://www.royalroad.com/fiction/21220/mother-of-learning/chapter/301795/5-start-over) | Remember a schedule, password or hidden route. Foreknowledge should enable a plan, not guarantee all choices are correct. |
| 16. **Time loop** versus prestige | MoL 5 resets again after leaving the endangered city; MoL 6 distinguishes memory from lost written notes. [5](https://www.royalroad.com/fiction/21220/mother-of-learning/chapter/301795/5-start-over), [6](https://www.royalroad.com/fiction/21220/mother-of-learning/chapter/301799/6-concentrate-and-try-again) | Confine recurrence to a local trial scenario. Reset scenario supplies and NPC state, preserve learned leads. Avoid rerunning every dialogue by hand. |
| 17. **Death-triggered recurrence** versus optional restart | Returner's Clockwork has a death trigger and explicit retention/penalty wording. [SSS 3](https://www.wuxiaworld.com/novel/sss-class-revival-hunter/sss-chapter-3) | Death, retreat and retry require distinct outcomes. A challenge retry can be optional without pretending the source's death trigger is optional. |
| 18. **Reincarnation/legacy** versus travel or ascension | No biological reincarnation mechanics were chapter-audited here. YAIRPG's current rebirth is a project prototype, not novel evidence. | Explicitly choose one legacy and disclose losses. A new body, a world visit, an unlocked tier and a reset must not silently share one button. |

## Precise primary-source cases

### A. The Wandering Inn: ordinary work precedes class recognition

**Verified narrative:** rewritten volume-one chapter **1.00** ends after Erin cleans the abandoned inn and rests. Notifications grant Innkeeper level 1 and Basic Cleaning and Basic Cooking. The scene does not present a creation-screen class selection. It supports this particular acquisition sequence; it does not prove a universal hours-worked formula or every later class rule. [Chapter 1.00, closing notification block](https://wanderinginn.com/2017/03/03/rw1-00/)

**Interpretation:** a service profession can be an entry into power. Work, place and circumstances matter before a label arrives. **Proposal:** an expedition cook earns a certificate through preparing and delivering supplies, then unlocks a useful shelter interaction. Do not copy Erin, the inn or canonical Skill names. Do not infer that every YAIRPG profession should gain classes while sleeping.

### B. Mother of Learning: rerouting is the payoff

**Verified narrative:** in **5. Start Over**, Zorian remembers prior meetings, skips an argument he expects to be fruitless, and changes where he sits on the train. Later he leaves Cyoria before the festival but still wakes at the repeated starting point. This is evidence that leaving that danger does not end this iteration. It does not establish the loop's ultimate ontology or every possible reset trigger. [Chapter 5, Ilsa meeting, train encounter and ending](https://www.royalroad.com/fiction/21220/mother-of-learning/chapter/301795/5-start-over)

**Interpretation:** recurrence can reward better sequencing and better questions. **Proposal:** a learned lead removes one search step and allows the player to spend the saved action budget investigating another route. Higher XP alone would miss the point.

### C. Mother of Learning: memory is not an inventory

**Verified narrative:** **6. Concentrate and Try Again** explicitly says Zorian's previous written notes are gone. He reconstructs some from memory. A conversation suggests library employment as a route to learning search spells; he obtains the job, but must learn protocols and classifications before hoped-for instruction. Access to restricted material begins as his expectation, not a guaranteed reward in this scene. [Chapter 6, notebook and library-employment sequence](https://www.royalroad.com/fiction/21220/mother-of-learning/chapter/301799/6-concentrate-and-try-again)

**Interpretation:** a contact supplies a lead; employment supplies an opportunity; competence still takes practice. **Proposal:** retain discovered library leads, reset local favors within a loop, and let remembered procedures accelerate repeated work. A player's journal can retain the reconstruction for convenience without claiming physical notebooks survive canonically. Detailed magic remains outside this lane.

### D. SSS-Class Revival Hunter: acquisition and recovery are separate powers

**Verified narrative:** licensed translation **chapter 1, Legendary Jealousy**, grants Gongja the S+ copying Skill. Its card says an enemy must kill him; one enemy Skill is copied, selection is described as random, and the same enemy's Skills cannot be copied more than once. The stated price is death. This card alone offers no recovery. [Chapter 1, final Skill card](https://www.wuxiaworld.com/novel/sss-class-revival-hunter/sss-chapter-1)

**Verified narrative:** **chapter 3, But you will die (2)** depicts a card-selection scene, followed by return to the previous day and possession of **Returner's Clockwork**. That card specifies automatic activation on death, return twenty-four hours before death, preserved memory and abilities, and a penalty that strengthens with Class. The sample does not explain the penalty's exact manifestation. The selection scene and card's “random” wording should be reported together, not resolved into a precise probability model without further chapters. [Chapter 3, copy sequence and Clockwork card](https://www.wuxiaworld.com/novel/sss-class-revival-hunter/sss-chapter-3)

**Interpretation:** a power can be unusable until a second rule changes its cost. **Proposal:** discover a risky technique, then separately discover a way to contain its drawback. Use nonlethal sparring or a simulation for the YAIRPG prototype. Do not turn this into endlessly profitable death farming or silently make all skills portable between worlds.

### E. Idle Loops: three types of progress survive differently

**Verified source:** in the inspected omsi6 implementation, `driver.js/restart()` resets time and resources, calls `restartStats()`, restarts towns and the action queue. `stats.js/restartStats()` clears stat experience, while `addExp()` also accumulates a separate talent quantity. It does not clear talent there. `saving.js` restores talents, soulstones and skill XP. These observations support separating temporary stats from longer-lived learning; they do not establish that every town counter survives. [driver.js](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/driver.js#L145), [stats.js](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/stats.js#L132), [saving.js](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/saving.js#L226)

Its Adventure Guild and Crafting Guild action definitions both check that the `guild` variable is empty before joining, then assign different values. Guild-dependent actions include team gathering and apprenticeships. `prepareRestart()` supports pausing before restart or on an unfinished loop. [actionList.js, Adventure Guild and Crafting Guild](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/actionList.js#L2112), [driver.js](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/driver.js#L123)

**Interpretation:** a retained learning layer can coexist with temporary memberships and spending. **Proposal:** expose a trial route budget and pause when prerequisites fail. Avoid copying the full implementation or assuming source-defined guild exclusivity is a permanent character commitment.

### F. Proto23: a manual is a concrete local reward

**Verified source:** `item.skl1a` defines Bladesman Manual with a reading-time field set to fourteen hours. Completion consumes a copy, grants 3,250 Sword Mastery XP, adds 0.15 to that mastery modifier, marks reading finished and grants a generic book item. An instructor scene offers this and several alternative specialization manuals. These are source-defined values, not measured wall-clock pacing. [Manual definition](https://github.com/23html/23html.github.io/blob/e93a8cd617932fb698ff889b968a32f9a20d48f3/index.html#L5478), [instructor choice](https://github.com/23html/23html.github.io/blob/e93a8cd617932fb698ff889b968a32f9a20d48f3/index.html#L11743)

**Interpretation:** local people and objects can make numerical progression feel earned. **Proposal:** borrow the acquisition structure but give the first manual an action-changing reward rather than requiring fourteen hours or copying a percentage.

## Lifecycle comparison and unanswered contracts

This table maps the requested lifecycle dimensions. “Unknown” is deliberate, not permission to fill a gap with genre assumptions. Cross-world compatibility below is a design question unless a source explicitly demonstrates it.

| Model | Acquisition, prerequisites and practice | Resources, advancement and limits | Failure/recovery and social access | Retention/reset and compatibility |
|---|---|---|---|---|
| TWI sample | Inn work precedes class/Skills; exact threshold unknown | Level 1 is explicit; continuing XP formula and resource budget unaudited | Physical needs remain in the scene; later guild/mentor rules unknown | No reset audited; no universal cross-world Skill contract verified |
| DCC official sample | Survivor enters a coercive dungeon premise; detailed class allocation unaudited | Traps, potions and next levels are official synopsis features; exact floor/economy rules unknown | Survival and spectacle frame access; no resurrection guarantee verified | Destruction is a world event, not evidence of prestige; export compatibility unknown |
| MoL 5–6 | Prior memories enable new conversations and employment; training still requires competence | Available month constrains plans; material notes vanish; precise magic growth outside scope | Leaving the city fails to escape recurrence in the observed run; librarians mediate learning | Memories survive; local work must be repeated; no blanket item/relationship retention claim |
| SSS 1–3 | Granted copying power, then a copied recovery power; trigger is specified | Copy limit, card ambiguity, twenty-four-hour rollback and Class-scaled penalty | Enemy death trigger is distinct from recovery; rank/media do not prove moral authority | Clockwork preserves memory and abilities; equipment retention and later Tower compatibility unaudited |
| Proto23 source | Instructor manual selection, reading and weapon practice | Source-defined mastery XP/modifier and milestone titles | Instructor provides access; complete failure/reset lifecycle not audited | Persistent flags exist; exact death/prestige contract not established by manual read |
| Your Chronicle listing | Village story actions unlock systems; summons have skills/equipment | Routine, automated actions/dungeons and offline bonus are advertised | Choices affect endings; precise defeat and recruitment requirements unknown | Developer listing does not specify exact Dark Ritual/Reincarnation retention; do not adopt community tables as canon |
| Melvor listing | Combat and noncombat skills interact through progression | Gathering/crafting and combat form a connected economy; detailed mastery rates unverified here | Dungeons and bosses exist; safety thresholds and death rules need official detailed source | Offline/cloud saves advertised; this does not prove a prestige rule or an imported-world energy model |
| Idle Loops inspected branch | Ordered actions, skill progress and guild eligibility | Temporary resources/stat XP versus talent/skill learning; guild routes change available actions | Pause controls exist; not all failure branches or town resets audited | Separate retention demonstrated in code; offline and cross-world behavior need further audit |

## Travel, ascension, loop, death and prestige

The following is an original recommended vocabulary for this fork, not a universal genre definition.

| Transition | What happens | What should remain | Why a later visit or run differs |
|---|---|---|---|
| Travel | Change location or world | Character progress and unexpired local state | Different hazards, compatible tools and access rules |
| Ascension | Unlock a higher capability or region | Existing progress, unless an explicit cost is paid | New actions and constraints, rather than restarting low-tier chores |
| Local loop | Restore a bounded scenario checkpoint | Learned leads, validated techniques and chosen planning aids | A different itinerary, solution or question becomes available |
| Death/defeat | End an encounter or expedition | Follow its displayed recovery contract | New enemy knowledge and a preparation choice, without farming deliberate losses |
| Reincarnation | Story claim of a new life/body | Only explicitly defined memories, powers and identities | Changed starting circumstances and opportunities |
| Prestige/rebirth | Player elects a reset for a specified reward | Exact previewed fields | A selected legacy changes a tradeoff; run count alone need not add power |

Do not attach a global reset to every breakthrough. Do not call a floor clear rebirth. Do not silently reset ordinary reputation because one local simulation loops. The current project rebirth already has its own cultivation-only loss list and one active legacy; this dossier recommends preserving that compatibility until an explicitly accepted migration changes it.

## Five original playable loops

All names, rules and scopes below are proposals. None is implemented by this research. Implement one at a time within the first milestone's one-realm, one-prestige-layer boundary; the later local loop must not add a second permanent prestige layer by stealth.

### 1. Earned profession: expedition quartermaster

**Loop:** hear a supply request in dialogue → gather or buy materials → prepare supplies → deliver evidence → receive a credential → choose a practice benefit → use it on an expedition.

**Two builds:** Cooking/Herbalism supplies support endurance; equipment/tool craft supports obstacle repair. A martial character can protect a delivery and buy prepared supplies instead of grinding both professions. The credential opens a practical opportunity, not a damage multiplier: a safe replenishment stop or an extra preparation choice. Ordinary combat remains useful to all routes.

**Cost and recovery:** consume delivered supplies once, disclose the required counts, and let an incomplete delivery remain resumable. A failed expedition does not revoke the earned credential. Reputation changes only on an authored action such as delivery/reporting.

**Idle/readability/save:** gathering and crafting can idle under existing rules; delivery is a decision point. Journal shows next requirement and alternative purchase path. Persist credential ID and selected benefit, not a computed bonus that gets added again on reload. **Acceptance:** martial/buyer and artisan routes earn it, apply different useful preparations and reload without a duplicate reward.

### 2. Manual discovery: damaged watchpost technique

**Loop:** local rumor → map/journal → prepare rope and food → reach watchpost → obtain damaged instructions → mentor interpretation or craft restoration → practice → demonstrate against a specific obstacle.

**Two builds:** combat earns safe access through a guarded route; Climbing/Camping and supplies reach a side route. After acquisition, a mentor asks for a useful service or restoration uses materials and Literacy. These are alternatives, not an AND gate across every skill.

**Reward/cost:** an equipped technique changes a stance tradeoff or permits a traversal action. Practice consumes a limited activity commitment; swapping it is reversible at a safe location. A random drop may shorten the chain but cannot be the only entrance.

**Idle/readability/save:** idle practice has a visible cap; application is an authored encounter or route choice. Persist acquisition, comprehension, practice and demonstrated use separately. **Acceptance:** two routes discover and apply the same foundational technique with different costs; reload during restoration preserves progress and does not consume materials twice.

### 3. Three-room licensed trial

**Loop:** obtain a trial permit through reputation or demonstrated expertise → inspect room hazards → select stance and preparation → attempt → rest/revise → report a first clear.

**Two builds:** martial uses a defense-breaking stance and food; artisan prepares a countermeasure that reduces the hazard but does not automatically win the fight. Rooms respectively test stamina use, mitigation and preparation. Do not build a procedurally endless tower before these decisions work.

**Failure/reward:** abort at a safe checkpoint; spend only declared supplies and retain discovered hazard information. First clear unlocks a route or recipe; repeat clears supply ordinary materials, not infinitely stacking achievements. A public trial record can affect a local faction without being a cosmic title.

**Idle/readability/save:** auto-repeat only an already-cleared safe room, with health/food stop rules and no automatic entry into a new boss. Preview exact consumed items and next room. Persist checkpoint and first-clear flags atomically. **Acceptance:** both builds complete the license, failure has an intelligible cause, and reload at a checkpoint cannot duplicate the first-clear reward.

### 4. Bounded repeated expedition: remembered route

**Loop:** enter an optional training reconstruction → allocate a short action budget → seek one lead or complete one objective → exit/reset local scenario → use remembered knowledge to remove a search cost → investigate a new branch.

**Two builds:** fighter learns patrol/weakness information; explorer/crafter learns a bypass or maintenance procedure. A third run should have a different feasible itinerary, not just higher damage. Cap the authored learning set so leaving the scenario remains attractive.

**Retention/cost:** preserve player knowledge and verified technique familiarity; reset only scenario supplies, local favors and checkpoint flags. Do not take or reset real character inventory: use a separate temporary kit. Failure yields information only when something was actually observed; it does not grant rewards for repeatedly pressing “die.”

**Idle/readability/save:** save a route plan, pause at novel choices, allow skipping already-understood exposition. UI distinguishes journal memory from local NPC trust. A later feature, not a prerequisite for ordinary advancement or another global prestige track. **Acceptance:** three runs demonstrate three different decisions; a reset/reload cannot export temporary items or erase ordinary reputation.

### 5. Earned optional power path: contained initiation

**Loop:** ordinary expedition finds a sealed teaching → comprehend through mentor or research → discover a safety method → prepare body or crafted support → complete initiation → choose whether to continue that path.

**Two builds:** martial conditioning versus craft/research preparation, with purchased alternatives for players avoiding a profession. The initiation opens cultivation training if chosen. An ordinary specialist receives an equally useful mundane technique or faction opportunity rather than an inferior consolation prize.

**Cross-world rule/cost:** method knowledge travels; qi generation needs a compatible environment or a costly adapter. Craft knowledge can make that adapter, but it should not grant unlimited qi in every setting. A retained legacy modifies a narrow preparation choice and replaces another legacy rather than stacking.

**Idle/readability/save:** keep Jade Hollow accessible for existing prototype characters through a documented grandfathering flag or earned-equivalence mapping. Fresh saves follow the new discovery gate only after implementation and review. Persist access separately from realm level. **Acceptance:** two builds earn entry, one build declines without becoming unable to progress, and prototype saves retain valid progress after migration.

## Small rule set, several useful choices

**Original proposal: a flooded watchpost**, refining loop 2. Use three rules rather than adding a profession tree or currency:

1. The direct route has one armored sentry; its defense makes a heavy stance useful, but a long fight spends more stamina and food.
2. The flooded side route needs a rope and either Climbing preparation or a repaired anchor. A bought prepared kit substitutes for making one yourself.
3. The damp manual can be restored with a purchased drying kit or interpreted by a mentor after earning local trust. Neither route requires both skills.

These rules yield several plans: fighter buys food and takes the sentry; explorer buys rope and bypasses combat; crafter repairs the anchor and restores the manual; a socially connected character reaches the manual by either route and uses mentor interpretation. A mixed build chooses the cheapest currently available substitution rather than grinding every profession. Heavy stance is a counter to this obstacle, not a universal upgrade: a stamina-limited fighter can use a slower safe plan or switch routes. Ordinary recipe/material costs give suppliers value without granting them free combat wins.

**Shared payoff:** the learned technique opens a later obstacle solution for every route. Keep monetary cost, consumed supplies and practice time visible before starting. Failure retains the discovered route and unfinished manual, while consumed supplies remain spent. First prototype only this obstacle and its acquisition chain; environment-sensitive timing can wait. No weather gate should make the player wait for an unannounced real-time window.

**Acceptance:** expose at least three feasible plans from those three rules, with two completing the same milestone in fresh test saves. Confirm that adding one useful item changes the cheapest plan, that no plan requires leveling all relevant professions, and that reload preserves an unfinished restoration. The separate idle-game dossier can later inform queue previews and compact interactions; this lane does not duplicate its game survey.

## Integration, usability and balance guardrails

Local source inspected: `src/items.js/BookData` declares reading time, required skills, accumulated time, completion status and rewards; `src/quests.js` supplies sequential tasks, hidden unlock quests and reward processing with loading-related parameters; `src/skills.js` exposes milestones and unlock arrays; `src/conditions.js` checks items, stats, tools, reputation and flags. `src/combat_stances.js` already expresses speed/power and defensive tradeoffs with stamina costs. These are useful integration points, not proof that every proposed requirement or state is already enforced end to end.

Prefer an additive versioned `knowledge`/`specializations` namespace with stable IDs and source provenance. Keep world-local resources, temporary trial kits and local favors separate from global knowledge. Recalculate active effects on load; do not replay acquisition payouts. Define unknown-schema behavior, migration defaults and duplicate-reward prevention before implementation. A proper check includes an upstream-shaped fresh save, a prototype cultivation save, mid-action reload and export/import using fresh test data. Historical personal saves remain untouched.

Five guardrails cover the main traps:

1. **Scope modifiers to a choice.** Universal XP multipliers make every profession a compulsory preliminary grind. Prefer a route unlock, ingredient substitution, safer preparation or stance tradeoff.
2. **Guarantee foundational access.** Authored clues, purchases or mentor service provide entry; RNG can accelerate or vary a reward. No essential build should stall forever at a rare drop.
3. **Keep alternatives substitutable.** A cook can trade, buy tools or recruit services; a fighter can pay for supplies. Do not require Cooking, Alchemy, Smithing, research and combat at the same threshold for every gate.
4. **Make automation bounded.** Show activity costs, stop conditions, last failure and current objective. Closed-browser progress requires a separately verified simulation contract; a new timer or inherited claim about another game does not supply it.
5. **Make resets legible.** Preview losses/retention by state category, pause at unresolved choices and offer an exit before spending. Speed up familiar setup through learned routes or saved plans rather than deleting meaningful decisions.

Diegetic information and UI convenience can coexist. A mentor may know that a technique needs a certain material; the journal can show exact available counts without making the mentor omniscient. A quest tracker need not be a voice in the character's head. An achievement toast need not mean the universe has awarded a permanent supernatural title. Use a world-facing system only where its authority changes the fiction or choices.

## Fictional physiology boundary and one compact interaction

No species inheritance, bloodline dilution or mutation formula was verified in this lane's primary passages. A class, public title, talent field or preserved ability is not evidence of biological inheritance. YAIRPG's current races are described as cosmetic in PROJECT.md; this dossier does not assume existing race bonuses. Detailed biological lore belongs to the other lanes.

**Original optional trait proposal: dusk-adapted sight.** Two rules: it reveals one route clue in a dim trial room, and strong light imposes a small accuracy cost while the trait is active. A crafted or bought visor suppresses both the benefit and the drawback; an ordinary character can instead use a scouting lantern to reveal the clue, spending a consumable. This connects environment, equipment, exploration and stance accuracy without a universally best ancestry or another XP bar. Both characters can learn the same manual once found; perception capacity does not grant technique comprehension.

Treat this as invented fantasy physiology, not a real genetic or medical model. If prototyped, offer a reversible trial-only transformation and an equivalent tool route, with effects previewed. Do not gate campaign access behind a random birth trait. Record acquired trait state separately from learned technique state, and never infer parentage, inheritance or lineage purity from a numeric rarity label. No new race implementation is proposed for the immediate milestone.

## Prioritized source-acquisition wishlist

Consult these only if their unresolved question becomes relevant to an accepted feature. This is a reading/source wishlist, not a request to purchase or download anything now.

| Priority and exact work | Target passages and design question | Already available evidence | Is additional full text necessary? |
|---|---|---|---|
| 1. **Dungeon Crawler Carl**, Matt Dinniman, book 1, official English novel edition | Locate the first class/race selection, achievement rewards and floor-transition explanations. Exact chapter numbers were not established here. Determine which choices are imposed, reversible or audience-driven before designing a system authority. | Author synopsis and lawful author/publisher opening excerpts establish the apocalypse/game-show premise, not those later mechanics. | Additional authorized text is needed for these precise rules if adopted; a library/owned edition or expanded lawful preview can suffice. No need to obtain the entire series. |
| 2. **SSS-Class Revival Hunter**, Sinnoa, licensed English novel translation by Namu on Wuxiaworld, not the comic adaptation | Continue after chapter 3's Clockwork card to the first explicit penalty explanation. The exact later chapter was not verified. Resolve card-selection ambiguity and the recovery cost rather than assuming generic resurrection. | Public chapters 1–3 already establish the copy/death trigger and twenty-four-hour retention wording. | No immediate book acquisition needed. Check lawful public/wait-unlock chapters first; use an owned/library edition only if those sections are unavailable. Do not substitute the comic's rules without labeling adaptation differences. |
| 3. **Mother of Learning**, Domagoj Kurmaić/nobody103, author-posted English serial | Author's contents identify **9. Cheaters** and **11. Limiters** as candidate follow-up chapters; they were not read here, so their titles are leads, not verified mechanisms. Investigate limits on accumulated learning and what shortcuts actually cost; locate explicit retention passages as needed. | Chapters 5–6 support changed itineraries, lost physical notes and work-mediated access. | No download necessary: the author states the full serial remains publicly available on Royal Road/Fictionpress. Read targeted chapters there if the local-loop feature is selected. |

## Coverage, gaps and self-review

**Covered:** 18 distinct families; eight contrasting works; six precise cases across original fiction, licensed translation and public game source; lifecycle comparison; transition/retention vocabulary; five feasible original loops; idle, UI, alternative-build and additive-save constraints. The best-supported canon is deliberately early-series and narrow.

**Remaining gaps:** later TWI class evolution/consolidation and exceptional Skills; DCC detailed class/race selection, achievement economy, sponsors, timers and floor rules; MoL ultimate loop architecture and exhaustive retention; SSS exact penalty and later copying exceptions; biological reincarnation in a separate novel; detailed Your Chronicle reset tables; Melvor current mastery/checkpoint and death formulas; complete Idle Loops town/reset/offline behavior. These cannot be claimed from the inspected synopses or source slices.

**Access/substitute record:** Melvor wiki Mastery and v0.17 pages returned errors through the web tool; the developer listing is used only for connected skills/offline/dungeon claims, with no numerical mastery claims. A guessed Yen Press volume-one URL failed, so licensed Wuxiaworld chapters supply the precise SSS case. TWI's next rewritten-chapter URL exposed no useful Skill evidence during this read; only verified 1.00 is used. DCC publisher excerpt was inspected but did not establish the later gameplay details sought; its author synopsis supports only the survival/spectacle premise. Primary MoL chapters were accessible on the author's publication, avoiding unofficial mirrors.

**Self-review performed:** all adopted chapter links were opened; source files and quoted identifiers were read live; pinned GitHub line anchors were checked against retrieved line-numbered code. Search results, fan wikis and reviews were not used to establish mechanics. Reception evidence is labeled community, platform or commercial rather than inflated into consensus. Chapter summaries are brief paraphrases; no book text or private catalog is reproduced. Proposals explicitly identify invented names and rules. No implementation or browser acceptance is claimed.

**Recommended first acceptance gate:** implement loop 2 with loop 1's profession utility, then show fresh martial and craft/research characters acquiring and applying the technique through distinct routes. Measure time to first meaningful choice, explain the next lead, reload mid-progress and keep the current cultivation prototype compatible. Only then decide whether the later trial, local loop or optional initiation should be the next playable increment.
