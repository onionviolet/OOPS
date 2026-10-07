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

## Power scale, combinations and distinct world systems, 2026-10-02

**Status: source-backed investigation and implementation proposal, not gameplay.** [User request and clarification](USER_VISION.md#power-scale-combinations-and-distinct-world-systems-2026-10-02) owns provenance; [implementation contract](ENGINE_EXPANSION.md#power-scale-and-world-system-implementation-contract-2026-10-02) owns engineering. PROJECT.md supersedes this dossier's earlier prototype-era statements about keeping cultivation/Jade Hollow active. This follow-up changes no shipped Rat-step route, saved progress or balance number.

Requested: scale low-level techniques sensibly; investigate skill/talent/ability combinations, leveling and other development; use A Death a Day and other Royal Road favorites as inspiration. Clarified: “everything equally scoped, different worlds with different systems/powersystems?” Give every studied reference the same acquisition/development/combination/limitation/world-fit questions. The four cases below are a bounded first sample, not a closed favorite list or selected world roster. Equal design scope is carried through a common research template and distinct system models; implementation delivery remains incremental.

### Reference selection and evidence

The named reference resolves to Priam's **A Novel Concept - He Who Eludes Death**, previously called **A Death a Day, MC Will Live Anyway**. Its author-posted Royal Road fiction/chapter identities were checked live. The existing entertainment reading owner was read only as a discovery/taste source: it records A Novel Concept as favorited, Super Supportive as a top active serial, Saintess Summons Skeletons as an enjoyed reading lane, and Delve as a cerebral pick. Those older notes are not a fresh signed-in favorites audit or current chapter-progress claim. The user's clarification authorizes comparable scope for these references without converting every saved follow into a confirmed favorite. No private reading history or ebook text is reproduced here.

**Verified narrative** below comes from author-posted chapters checked on 2026-10-02. **Interpretation/proposal** is our design work. A character's imagined future power or uncertain interpretation remains a hypothesis, even when it sounds plausible.

| Reference and bounded primary evidence | Acquisition and development actually supported | Combination/limitation evidence | Proposed world-system use; remaining source gap |
|---|---|---|---|
| **A Novel Concept**, Priam: [chapter 1](https://www.royalroad.com/fiction/66455/a-novel-concept-he-who-eludes-death/chapter/1155206/chapter-1-an-unexpected-journey), [6](https://www.royalroad.com/fiction/66455/a-novel-concept-he-who-eludes-death/chapter/1161872/chapter-6-kinetic-control), [11](https://www.royalroad.com/fiction/66455/a-novel-concept-he-who-eludes-death/chapter/1169647/chapter-11-people-change-heroes-improve), [119](https://www.royalroad.com/fiction/66455/a-novel-concept-he-who-eludes-death/chapter/1418575/chapter-119-back-to-basic) | Exposure/experience yields skills; bodily adaptation yields a talent. Chapter 11 shows training and skill levels; chapter 119 distinguishes raised attributes/skill levels from sound weapon fundamentals. | Chapter 6 makes broad kinetic manipulation expensive. Understanding and restrictions reduce creation cost: contact, partial energy storage, limited accumulations and no reference-frame manipulation at level one. The resulting skill is Epic despite being newly created. | **Aether design model:** discover faculties and develop skills; invest in a bounded new function or meaningful evolution. Skill grade, level and bodily capacity remain distinct. Exact later evolution thresholds, fusion rules and complete resurrection retention were not audited. |
| **Delve**, SenescentSoul: [author description](https://www.royalroad.com/fiction/25225/delve), [006: Skill](https://www.royalroad.com/fiction/25225/delve/chapter/368135/006-skill) | Rain spends a point to acquire Refrigerate, then finds that further improvement requires skill experience. He allocates another point to Extend Aura and invests in mana regeneration. | The displayed modifier adds range while multiplying mana cost; intensity has a separate cost increase. Early aura range and continuing mana consumption constrain use; a pulse reduces sustained expenditure. | **Aura investment model:** point choices, practice and resource economy interact. Wider, stronger and longer effects compete; a support build has practical tradeoffs. General respec, full tier unlock formulas and all stacking rules remain unverified. |
| **Super Supportive**, Sleyca: [24: Rabbit](https://www.royalroad.com/fiction/63759/super-supportive/chapter/1132920/twenty-four-rabbit), [32: Chaining](https://www.royalroad.com/fiction/63759/super-supportive/chapter/1198333/thirty-two-chaining) | A B-rank skill can start at level one with small physical supplements. Chapter 32 shows that having instructions and practicing gestures/pronunciation did not initially mean successful wordchain execution; correction produces an actual effect. | The selected skill preserves an entrusted tangible item during carriage, with contact/retargeting conditions. It does not promise preservation of the bearer. Chapter 24's imagined shields and vehicles remain hypotheses. Chapter 32 includes paired benefit/sacrifice and adaptation to the resulting discomfort. | **Authority/obligation model:** a narrow rule can be powerful while the user's body remains ordinary; entrustment, valid targets and obligations matter. Use procedural correction and coherent conditions, not arbitrary low-level weakening. Ultimate authority mechanics, all rank rules and later preservation exploits remain unverified. |
| **Saintess Summons Skeletons**, Mornn: [chapter 1](https://www.royalroad.com/fiction/62087/saintess-summons-skeletons/chapter/1066845/chapter-1-un-holy-beginning), [author description](https://www.royalroad.com/fiction/62087/saintess-summons-skeletons) | Conflicting Saintess/Necromancer acquisition produces a system recovery and a level-one Saintomancer display with changed resource maxima and named active/passive skills. Existing classless skills remain listed with their levels. | This is an exceptional hybrid-class event; the display distinguishes active, passive and classless categories/capacities. It is not evidence that every character can freely fuse arbitrary skills or double all bonuses. | **Hybrid class model:** an authored conflict/exception changes available functions, resource profile and social implications. Preserve existing ordinary expertise. Later skill evolution, summon upkeep, merge recipes and complete class-slot rules need additional targeted chapters. |

### Low level and low grade answer different questions

**Proposed distinction, refined by the simple-skill follow-up:** level measures development within a particular method; grade/rank describes its local structure and current scope, with fixed or growing potential according to that world's definition. Mastery can greatly expand the capacity of the same simple function, and some models can award new functions through leveling alone. Others use insight, evolution or source development. The actor's body/source/resources determine current execution, and those means may themselves develop through the skill. A rare source can have a strong beginning without making every deeply trained common skill permanently inferior. No universal correspondence between one world's “B,” another world's “Epic,” a cultivation realm and a native skill level is proposed. [Long-term simple-skill growth](#simple-skills-with-extraordinary-long-term-growth-2026-10-02) owns the expanded proposals.

| Progression dimension | Proposed role | Why an early technique stays believable |
|---|---|---|
| Ordinary skill | Trainable domain expertise such as Evasion, Equilibrium, craft or interpretation, using existing native XP where appropriate | Improves the user's execution and preparation; it does not independently grant every imaginable related power |
| Technique/ability | A specific executable action with a defined target, conditions, effect and cost | A basic sidestep starts with ordinary movement. Its local development definition may let earned mastery create an extraordinary function or faculty; no universal rare-bloodline requirement is imposed |
| Talent/source | Innate, acquired or awakened faculty that can enable a function, alter learning or change a narrow rule | Its provenance and functional scope explain exceptions. A talent need not be another universally levelable bar |
| Mastery/level | Proficiency, control, reliability, efficiency or capacity within the current method | Early gains can reduce wasted stamina or improve a small correction; later gains can substantially increase output/control and expand permitted applications under the local model |
| Evolution/rank transition | An authored change to available functions, prerequisites or tradeoffs under local world rules | New behavior needs the relevant knowledge/source/trial or investment; a cosmetic rename or more XP alone does not establish it |

**Early Rat-step proposal:** an ordinary character already has a sidestep/guard response against a slow, avoidable threat. Rat-step makes that movement cleaner or cheaper, and later training improves return to position. A recovery strike is a separately supported ordinary attack, not free damage generated by learning footwork. Moving out of one narrow attack's path can completely avoid that attack when space and reaction allow it; this never promises universal evasion. Tracking strikes, filled space, faster threats, burden and exhausted stamina remain different circumstances.

Develop the same basic move through learning, useful application and refinement. Native Evasion/Equilibrium growth supports it; a practiced Rat-step plus weapon familiarity can make a coordinated sidestep-and-thrust procedure. Comprehension initially improves reading a familiar cue. Later forms of the same skill lineage can earn extraordinary displacement, perception or force handling when their world permits that development, including a level threshold where appropriate. The current introductory Rat-step record remains a mundane twelve-point proof; future functions need explicit development/execution rules and must not be silently granted on load.

### Five distinct kinds of combination

| Combination | Proposed example and progression | State and cost boundary |
|---|---|---|
| **Synergy** | Equilibrium supports Rat-step; a compatible perception talent makes a familiar cue easier to distinguish | Both remain separately learned. Derived effectiveness uses declared contributions once; there is no automatic new owned ability |
| **Sequence** | Sidestep, recover, then a normal thrust against an exposed target | Each supported action consumes its own time/resources. A trigger does not create an unpaid extra turn or bypass the attack's normal requirements |
| **Composite technique** | Repeated successful practice of compatible movements opens an authored cross-step thrust with its own applications | Learn and practice the derivative; preserve constituents and their XP. Selecting the composite cannot also apply every constituent's full duplicate bonus |
| **Fusion/replacement** | An authorized magical or class-system rule transforms two functions into a new one with different restrictions | Requires that world's actual fusion permission and a reviewed replacement/retention policy. Preserve provenance and dormant originals if replacement is selected; do not erase native XP casually |
| **Source-supported hybrid** | A class anomaly or bloodline changes how an existing skill can be expressed, such as a locally valid new target or medium | This needs a functional source instance and compatible body/fuel, not a generic combination button. Rank/level/capacity and social consequences follow the selected local rule |

These patterns have equal design standing; they do not all need to be forced into the frontier. For instance, native training may support synergies and sequences, an aura system may allow modifiers with escalating upkeep, a contract power may compose through custody and conditions, and a class system may authorize a specific hybrid. Copying another actor's knowledge is still separate from receiving its source, practiced control or physical means.

### Leveling, practice and evolution

Keep the existing native skill XP totals as the authority for ordinary skills. Keep current Rat-step provenance, ownership and proficiency0-12 as the authority for its existing content. The first new movement proof can derive novice/practiced/trained bands from that proficiency without converting old progress into a new global level scale. Those bands measure the authored introductory exercise; the twelve-point cap is not a permanent design ceiling on the skill lineage. Further growth belongs to a selected local development rule with preserved progress and actual new execution support.

For later abilities, a model-specific development definition can grant use/practice XP, allocate local points, require correction/evidence, or invest in source control. Store the chosen irreversible advancement and its provenance; derive read-only descriptions and effective values. Offer an idle practice route to the same selected competence, while an optional active drill supplies feedback. Different forms may use different exercises rather than all having three Rat-step questions.

Useful practice should exercise the function: a new cue for interpretation, a burden for movement, another target for control, or a longer safe operation for endurance. Repeating harmless content indefinitely should not manufacture breakthrough evidence or duplicate event XP, but ordinary routine practice remains legitimate idle play. Award execution/practice and native skill XP through the committed result, respecting existing parent inheritance. Do not award the same contribution again when a composite's trigger fires or a save reloads.

Evolutions can add a new target class, medium, range, control mode or application; they can also specialize rather than universally improve. Preserve the older affordable form when a new form is expensive or unsuitable, unless an explicitly selected fusion replaces it. Show the function gained, requirements, spent resources, restrictions and retained old use before commitment. Skill-specific caps, point costs, failures and refunds remain world/content choices, not imported canon from one book.

### Distinct world profiles with comparable scope

All names below are **original working labels**, not selected settings or claims of implemented canonical worlds. Each reference receives acquisition, growth, combinations, limits and carry-over design. Broadly authorized direct reference campaigns remain an option when source roster and setting details are selected.

| Proposed profile | Local acquisition and growth | Combination grammar and early limit | Potentially useful carry-over |
|---|---|---|---|
| **Frontier practice** | Manuals, teachers, observation and ordinary work; use-based native skill XP plus specific technique practice | Physical synergy/sequence; movement constrained by body, burden, space and stamina | Procedural knowledge and trained movement remain useful with compatible bodies/tools |
| **Aether design**, A Novel Concept-inspired | Experience/discovery, source adaptation and deliberate bounded-function development | Conceptual construction/evolution allowed by this local source; capacity, contact/control and fuel limit a novice's execution | Learned principles and an actually owned faculty, with declared local replenishment or carried supply |
| **Aura investment**, Delve-inspired | Allocated local skill points plus practice and equipment/resource specialization | Modifier composition; wider/stronger/longer effects have their own declared upkeep, range and saturation | A support technique, compatible gear and resource knowledge; a foreign world's energy is not automatically the same currency |
| **Authority and obligation**, Super Supportive-inspired | Contract/class access, narrow rule abilities, trained procedures and adaptations | Composition through valid targets, custody, wording and fulfilled costs; user and protected item can have different vulnerability | Portable rule functions when their governing source/conditions continue to apply; knowledge of procedures and agreements |
| **Hybrid classes**, Saintess-inspired | Class acquisition, exceptional authorized intersections, ordinary/class skill development | Authored hybrid/replacement rules and local loadout categories; resource profile and compatible targets matter | A supported class faculty or summon method plus retained classless expertise; no free duplication of class grants or minions |

Common services must not flatten these into five names for one XP/resource loop. Keep local currencies and development rules distinct. The shared executor asks whether the acting source can perform a declared action now; a world-specific model calculates its actual limits. Cross-world comparisons use effects on a concrete target or objective, not one global fictional rank conversion.

Other authorized world families can have their own development rules too. A technological individual might grow through gene compatibility, implant quality, power supply and heat control; a cultivation method through circulation, comprehension, materials and breakthroughs; a pact through negotiated access and fulfilled obligations. These are original extensions of the saved direction, not additional verified book cases or selected starting worlds. They receive the same development/execution/compatibility contract when their concrete content is investigated, without inheriting a class slot limit or aether point currency.

Travel preserves owned powers according to a declared journey/source policy. An imported strong power should remain strong when compatible. Body, fuel, target law or issuer/custody conditions can require a particular adaptation, supply or local action; they should not become an unexplained blanket nerf. Knowledge can travel without granting an unearned talent. A source's resurrection clause, ordinary fainting, optional rebirth and world travel remain separate contracts. This pass selects no new death/loss policy, extra prestige layer or second playable realm.

### Effect bounds and meaningful low-tier choices

Author effects per family. A numeric efficiency improvement can have a small declared ceiling; a force-storage effect needs an absolute capacity; a preservation effect needs exact custody/target/termination conditions; a summoning effect needs owned means, legal targets and upkeep. Applying a percentage of an enemy's attack without an absolute bound can let a weak technique steal arbitrarily large output. Likewise, adding range while ignoring area/upkeep can turn a small aura into a free world-scale effect.

For a quantitative effect, calculate requested output under its model, then enforce the source's capacity, actual actor means and the output purchasable with the reserved fuel in that effect's own units. Fuel conversion belongs to the applicable model; do not take a minimum of raw mana, strength and damage values. Allocate one shared event budget across reactions instead of capping every proc independently. For a rule effect, validate the rule's scope and obligations rather than arbitrarily replacing preservation with a universal damage percentage.

Good early decisions include a cheaper learned movement versus a sturdier guard, a short aura pulse versus continued upkeep, a safe cargo route versus dropping custody to fight, or a support summon requiring different preparations from a martial attack. Small efficiency gains become useful because they change a specific plan. Exceptional sources can supply a strong narrow verb immediately, while broader control and development remain earned.

### Implementation findings and remaining proof

Live source read: `src/models/skill.js` already separates native XP, level caps, milestones and coefficient curves; `src/gameplay_transactions.js` handles fixed skill XP with parent inheritance. `src/techniques.js` separately stores Rat-step knowledge/proficiency/ownership/executions, but requires its current observation sequence, enemy ID, three-cue practice and definition world. `src/capabilities.js` queries conditional numeric grants/provenance; it does not execute an ability or develop a talent. Native combat branches on shield presence, random rolls and player-global XP/stamina/stance callbacks. The current expansion schema is3 and the live journal context is player/base.frontier.

Therefore the proposed work is a model-specific progression/action adapter feeding shared typed effects, with explicit participant and resource bindings. Reuse current native skill records and save publication; introduce only the new persisted fields the chosen content uses. [The engineering owner](ENGINE_EXPANSION.md#power-scale-and-world-system-implementation-contract-2026-10-02) supplies concrete module roles, migration boundaries, a revised basic-movement proof and five validation groups.

This follow-up read eight author-posted chapters across four references and their public descriptions, with bounded early/mid-series claims and no copied text. No full novel audit, current signed-in favorites refresh, gameplay source/bundle change, save access, implementation test or rebuilt browser verification was performed. Older “all54 tests pass” entries remain evidence of their earlier runs, not a new result here. Remaining gate: implement the selected bounded proof, rebuild from changed source, exercise generated fresh saves and compare actual decisions, costs and save/reload before human balance acceptance.

## Simple skills with extraordinary long-term growth, 2026-10-02

**Requested direction; concrete examples are original proposals.** A simple skill should be able to become extremely powerful in an appropriate world through leveling, deep mastery, creative application or development. Its modest beginning describes the starting form, not an automatic lifetime ceiling. [User vision](USER_VISION.md#simple-skills-with-extraordinary-long-term-growth-2026-10-02) owns the request; [growth contract](ENGINE_EXPANSION.md#long-term-growth-of-simple-skills-2026-10-02) owns implementation. This refines the previous scale distinction while retaining believable beginner behavior and distinct world rules. No new canonical book mechanic is asserted by these examples.

### Five ways to develop a simple skill

| Growth pattern | Original example and observable payoff | Choices and local boundaries |
|---|---|---|
| **Greater capacity within the same function** | Push begins by nudging an object, later deflects a projectile, and eventually can arrest a huge charge or move many targets. A basic strike can become devastating while retaining the same strike rather than being discarded for a new named skill | Output, reach, reaction and sustained force grow through the selected model. Skill practice may develop the actor's means directly. Continuous levels can suffice where the world permits; a rare source or rank replacement is not universally required |
| **Precision and creative use** | Spark grows from ignition to finely controlled heat delivery. Carefully heating an exposed mechanism or supporting a forge can be useful before its total output is large | Accuracy, target discrimination, shaping and efficiency are distinct development dimensions. Clever application needs a real vulnerable target or supported material interaction, not a general instant-kill rule |
| **Deeper understanding of the same principle** | Cleaning progresses from removing dirt to purifying a material, and in a suitable magical system to removing particular adverse effects. Footwork can develop from stable placement to extraordinary movement under that world's laws | Expand only supported target/effect categories. Leveling, interpreted evidence or an authored insight can supply the advancement. Keep the original cheap application useful, and make the new function's conditions visible |
| **Personal expression and combinations** | Two Throw specialists develop different strengths: efficient repeated throws and controlled ricochets versus concentrated armor penetration. A Throw/movement procedure can open a distinct tactic | Meaningful use/evidence or explicit choices develop authored variants; ordinary repeated practice remains valid. Combining techniques preserves provenance and applies each contribution once. Avoid forcing every user to merge away a favorite skill |
| **Ordinary professions reaching extraordinary importance** | Cooking starts with a useful meal, advances to tailored expedition preparations, and can eventually support an exceptional recovery or breakthrough feast. Farming or smithing can similarly support powerful living materials and equipment | Skill quality, knowledge and the selected world's ingredients/tools determine what is made. Professions provide viable growth and influence, including institution/expedition value; neither mastery nor every recipe requires leveling every other profession |

Large output, exquisite precision, broad usefulness and a deep rule interaction are different kinds of strength. A simple skill can pursue more than one, but not every advancement has to improve all four. A high-level common skill may outperform an unfamiliar rare ability in its specialty; rarity can instead offer earlier access, different functions or versatility. Use actual actor means and target interactions when comparing them rather than automatically awarding victory to the higher rarity label.

Show the continuity: retain the skill's stable identity, original uses, earned XP and recorded development. An evolution can be a new application or changed scope within that lineage, and an optional renamed derivative can still record its ancestry. Pure level growth remains an available design pattern; mandatory external treasures, examinations, rank promotions and replacement skills are not a universal progression rule.

Growth should have practical next leads. Routine practice develops the selected competence; challenge, experimentation, teaching or insight may accelerate or branch it where those activities are implemented. Do not promise an attainable legendary level behind an impractically steep placeholder XP curve, require endless repeated clicks, or make every early skill obsolete when a flashy acquisition appears. Some methods can genuinely have limited potential, but content should identify their current limit, a useful continuation lead or the uncertainty honestly.

### Equal world scope, different routes to mastery

The four reference profiles retain comparable attention. An aether-design profile can grow a small owned function's control/capacity and later broaden it through understanding. An aura-investment profile can develop the same aura through skill experience and paid modifiers while its resource build sustains greater output. An authority/obligation profile can develop application, supported scope or control of a narrow rule without pretending its initial effect is ordinary damage. A hybrid-class profile can retain and develop classless expertise alongside its exceptional class functions. These are original extensions of the already bounded source cases, not claims about their entire novels.

Cultivation and technological worlds retain their own opportunities: a familiar practice may develop bodily/source means through comprehension and preparation, or an engineering skill may improve a device's output, accuracy and support infrastructure. Cross-world travel preserves actual learned development according to the journey/source policy. The engine must not reset a veteran's technique to its novice interpretation just because its name still sounds simple.

### Implementation implications and open gate

Native `Skill.add_xp` already has per-definition level caps and XP/milestone handling, while `get_coefficient` exposes bounded-by-definition scaling. Current Rat-step's maximum proficiency is12 for its introductory practice. Those are inspected implementation limits, not adopted universal endgame rules. A long-term growth design needs explicit level/stage curves and actual execution functions; simply raising every native maximum or adding a giant multiplier does not supply new targets, control, costs or world interactions.

Treat an effect's present capacity as derived from its selected development rule, actor means and world context. That capacity may grow enormously through the skill itself while still being finite and accounted for at each action. The absolute-bound rule continues to prevent a novice from capturing an arbitrary fraction of a colossal enemy's output; it should not freeze a veteran at the novice's capacity. One shared action budget still governs reactions and resource expenditure at the current mastery.

For the first selected long-term example, compare introductory, experienced and advanced instances of the same skill against the same declared objective. Show both a real increase in usable capacity and a remaining contextual choice, preserve a worthwhile low-cost use, and verify that rare acquisition is not automatically mandatory. An authored level-triggered function and an optional insight/branch can use different advancement policies; neither is selected for every world. Save/reload and failed-write checks must cover threshold/function grants with their XP/development receipt. These gameplay/code/build/browser gates remain pending. This pass updates proposals and request ownership only.

## Skill tiers, critical points and advancement routes, 2026-10-02

**Requested exploration; original proposals, not implemented rules.** Weibao requested skill-level tiers with benefits at critical points, other small rules that add depth, then action-based, RNG-based and other advancement directions. [User vision](USER_VISION.md#skill-tiers-critical-points-and-advancement-routes-2026-10-02) owns provenance; [runtime integration](ENGINE_EXPANSION.md#skill-tier-trigger-and-reward-policies-2026-10-02) owns execution/save requirements.

Separate **what earns the tier** from **what the tier changes**. A threshold can grant efficiency, a new control mode, a valid target/application, a branch choice, a combined procedure or practical access to a recipe/teacher/job. It can also raise the same simple skill's capacity substantially. Between thresholds, ordinary progress can continue under the world's existing model. Named ranks, exact levels and a universal novice/adept/master ladder remain unselected.

Illustrative Throw milestones, with unbalanced placeholder levels: at5, spend less effort on a normal throw; at10, gain finer aim/control; at20, choose an efficient rapid-use or concentrated-impact specialization; at40, gain a supported multi-target application in a world that permits it. Those functions still need body/resource/target handlers and appropriate local development. Different skills can have different critical points, and a skill can retain its name while changing significantly.

### Five advancement families

| Route | Original example | Small rule that creates decisions or variety |
|---|---|---|
| **Accumulated competence** | XP, relevant use or routine training crosses a specified threshold and grants a supported tier benefit | An approaching milestone makes another session worthwhile. A threshold may open a branch or cross-skill procedure, while ordinary levels keep improving the base action. It need not require a rare item or manual exam |
| **Demonstrated application** | Resolve a guard/recovery sequence, sustain a supported effect, or produce a specified result under pressure to qualify | Timing/conditions matter: a heavy strike benefits from an exposed target, and safe positioning can preserve an objective. An authored idle policy can demonstrate the same result. A useful feat is an event outcome, not repeated UI clicks |
| **Insight, research or synthesis** | Interpret observed behavior, test a formulation, or combine adequate movement and weapon understanding | Shared tags and skill pairs create reusable connections: an off-balance target supports a particular follow-up; heat control and craft knowledge open a selected process. Tags/relationships require concrete effects, not automatic all-purpose bonus stacking |
| **Transmission or integration** | A mentor, manuscript, school, compatible material or source teaches a new application or refines an owned method | Different teachers can offer different branch rewards or preparation routes. Acquiring instructions is separate from practiced execution; transmission can upgrade a lineage without deleting its existing expertise. Costs/access and donor/claim rules follow the existing owners |
| **Stochastic development** | A relevant use produces an unexpected insight; a prepared breakthrough has a success chance; an environmental discovery reveals a rare variant | Randomness may affect whether advancement occurs, when it occurs, which branch appears or the outcome's quality. Prepared attempts, spontaneous events and pure rare discoveries are distinct optional policies. Known circumstances can affect odds; exact rates, pity/guarantees and failure consequences remain unselected |

These routes can differ between worlds, between skills in one world, and between milestones of the same skill. They are not five compulsory bars. A local system may use only levels, only rare opportunities, or a deliberate hybrid. Give the four reference profiles comparable design coverage without assuming one book supplies their combined universal rulebook.

**Original hybrid example:** Throw practice raises ordinary competence; a displayed threshold opens advancement; a demonstrated accurate throw earns a specific control benefit; eligible later experiments can reveal a rare personal variant. Another school might teach that variant through a paid procedure instead. The player can understand each route's current requirements and resulting benefit. This is a design example, not a selected item, skill roster or global promise of a guaranteed alternative to every rare power.

### RNG and action accounting

A random tier-up needs a declared unit of opportunity: an eligible use, resolved encounter, completed training session, controlled experiment or supported world-event check. A chance per use and a chance per session have different pacing. Opening a panel, revisiting a preview or reloading is not another learning attempt. Some contexts can bias the offered branch rather than change the chance of any advancement, letting repeated use shape a character while retaining surprise.

Preserve the eligible event/attempt, relevant conditions, spent cost, committed result and awarded benefit together. Ordinary advancement and stochastic variation can coexist, but pure chance-based development remains an available authored choice. Failure may consume disclosed preparation/time or produce partial learning if selected; no permanent-loss or lethal policy is inferred here. Exact chance is displayed when known, with honest uncertainty when the actor lacks that information. [RNG owner](RNG_ENCOUNTERS_AND_SOURCE_DEVELOPMENT.md#proposed-probability-and-reliability-rules) owns stream/receipt/reroll distinctions.

Native source already supplies `milestones` with stat/XP benefits and selected skill/recipe/quest unlocks; `Skill.add_xp/get_bonus_stats` traverses crossed levels. New composite grants, feat evidence, semantic tags, mentor tier choices and stochastic development remain adapter/content work. `prepareGameplayPublication` rejects unsupported content unlocks. The existing saved draw/frozen-outcome machinery is relevant groundwork, not a general random skill-tier implementation. Keep the first selected proof to one skill, one concrete tier benefit and the trigger routes actually exercised; other policies stay available for later distinct worlds. This pass changes documentation only and claims no new gameplay/test/browser result.

## Granular progression for skills, talents and connected paths, 2026-10-02

**Requested exploration; the designs here are original proposals.** [User vision](USER_VISION.md#granular-progression-for-skills-talents-and-more-2026-10-02) records the request. This extends the preceding simple-skill growth and combination work. [Runtime refinement](ENGINE_EXPANSION.md#granular-development-refinement-2026-10-02) owns implementation; bloodline physiology and acquisition remain with [source development](RNG_ENCOUNTERS_AND_SOURCE_DEVELOPMENT.md#4-bloodline-and-other-source-development). No new book-canon claim or universal advancement ladder is introduced.

Granularity should let two characters with the same named skill develop different useful capabilities, while keeping a familiar ability worth developing for a long time. Give the player a legible next improvement and a choice about how to earn it. Persist a new dimension only when it changes a supported action, unlock or preparation decision; accuracy, efficiency and range can often be derived from existing progress rather than becoming three extra bars.

The preceding [tier and advancement-route proposal](#skill-tiers-critical-points-and-advancement-routes-2026-10-02) still governs possible triggers: levels, meaningful application, insight/research, transmission/integration and stochastic development. Those can also develop talents when locally appropriate. The ordinary/idle alternatives proposed below are defaults for the demonstrated frontier loop, not a requirement to replace a world's authored pure-RNG discovery or advancement policy.

### Five connected growth families

| Family | What develops | Original progression example | Observable payoff |
|---|---|---|---|
| **Skills** | Broad competence, output, precision, efficiency and selected specialties | Footwork: stable placement → economical changes of direction → control across difficult terrain. A suitable later world can support extraordinary movement within the same lineage | Safer carrying routes, longer outings or different automatic plans. Levels can supply the growth directly where the model permits |
| **Techniques and abilities** | A specific procedure's timing, reliability, cost, targeting and applications | Deliberate step → practiced response → coordinated step-and-strike procedure | A real movement/recovery improvement; the follow-up attack still pays its costs. A broad skill supports several techniques without granting all of them |
| **Talents, traits and bloodlines** | Learning aptitude, accessible faculties, control, endurance or an authored new function | Proposed Pattern sense: notices an unusual cue → distinguishes a familiar sequence → retains enough detail for later analysis | Better evidence; the technique's separate learning and execution rules decide what can actually be learned or used |
| **Body, energy and power foundations** | Supported adaptations, capacity, delivery/control and local stage transitions | Conditioning improves sustained carrying; an energy path improves routing; an implant path develops calibration and supported load | The same method becomes usable longer or at greater output. New physiology needs a real handler. Technology, magic and rule-based powers retain distinct development rules |
| **Professions and supporting progression** | Material familiarity, procedures, tools, product quality, research and institutional access | Cooking: ordinary meal → tailored expedition ration → exceptional preparation. Engineering: maintenance → calibration → a supported device improvement | Products/services affect real expeditions, remedies or equipment; faction/class/home progress can supply access and support |

These are overlapping design roles, not five mandatory menu tabs or exclusive character slots. A talent can be passive and fixed, a trait develop through adaptation, and a bloodline have local stages. Classes, titles, equipment, companions and facilities retain their existing owners; their development feeds these interactions without inventing duplicate skill bonuses or independent engines.

### Skill depth between level-ups

Use the existing broad skill as the foundation. A selected specialty can record meaningful application or a choice when it changes what that character can do. A spear user might develop reach control, armor penetration or formation support. Those are authored possibilities, not a requirement to track every motion or to choose an exclusive build at character creation.

Continuous progress should produce useful changes between thresholds. A threshold can grant a target, material, response, automation permission or specialization. Pure leveling remains a valid full route in appropriate systems; every advancement need not require an external treasure, trial or insight token. Knowledge of a recipe stays separate when practice alone cannot reveal its ingredients.

Record evidence only for selected distinctions: studying an armored target can qualify a penetration application; repeating an unrelated easy attack cannot claim that discovery. Routine practice still develops baseline competence. A prepared idle activity can train the selected specialty or test a known counter when it has the required target, time and means. Active exercises can improve pacing or supply authored evidence, with an equivalent idle/assisted route where supported.

Show the next useful change and why the current activity can or cannot reach it. A practice cap can expose a continuation lead such as a stronger rig, mentor, material or exercise. Do not require endless manual clicks or leveling every specialty before normal play continues. No automatic mastery decay, universal cap removal or new XP curve is selected here.

### Talent progression differs from skill mastery

Distinguish a **learning aptitude** from a **functional faculty**. An aptitude improves a named practice's acquisition rate or helps notice a clue. A faculty supplies a supported verb, sense or exception: retaining a seen sequence, conducting energy through a material, or tolerating a fictional environment. Faster learning does not imply higher current mastery; a rare faculty does not supply competence in every related skill.

Talents can be innate, earned through training/adaptation, acquired through a selected transformation, or granted by another supported source. Potential can be dormant or already usable. Awakening, control, sustained use, a branch and structural evolution are optional authored events, not a compulsory sequence. A talent can use continuous levels, discrete functional changes, no growth at all, or uncertain further potential under its world's rules.

For proposed Pattern sense, early use separates a cue the actor could previously miss. Training distinguishes familiar sequences amid distraction. A later function retains an observed sequence for study, subject to declared detail/capacity and sensing conditions. Copying still needs the observed ability's learning rule, compatible means and practice. The talent cannot capture invisible information, guarantee a feint's interpretation or create an unowned ability from a label. Prepared ordinary observation or a suitable instrument remains a possible alternative.

A branch could favor battle movement or workshop/material patterns. Show gained functions, retained uses, cost and any exclusivity before choosing. Reversible choices or declared paid retraining are useful early prototype options. Strain, suppression and incompatible conditions affect current use only when authored; unavailable access is separate from erasing learned competence. Source removal or replacement follows its explicit retention rule.

Talents can change or combine with other talents when a selected relationship supports it. A derived synergy is not automatically a new owned source; evolution/fusion needs its own earned or paid receipt and constituent-retention policy. Bloodline purity, universal slots and random mutation failure remain open variants rather than default rules.

### One connected example

Original proposed frontier loop: an outing contains a damaged route and the optional slow-sweep rig from the existing encounter proposal. Native Equilibrium/Perception and owned Rat-step provide the ordinary foundation. If selected later, Pattern sense makes one obscured cue readable and develops through useful observation. Rat-step practice independently improves the supported movement/recovery cost. A compatible weapon procedure coordinates a paid follow-up during a real opening. Profession preparation supplies a product or tool with its own practical contribution.

Ordinary training, better preparation, a talent-assisted route or a profession service can help solve the outing. The talent offers an advantage without becoming a universal entry requirement. Guard remains useful against tracking or where space prevents movement. Observation does not move the body, and mastery does not create the rope, medicine, fuel or weapon. A later world can greatly expand these same lineages under its rules.

This refines the existing encounter proposal, not its implementation order. Current Rat-step remains the saved 0–12 introductory proof. No automatic function at twelve proficiency, talent-growth tree, profession product or new encounter action is implemented here. The conversation's growth-path explorer is an illustrative comparison with local selection only, not integrated game state or a gameplay test.

### Readability, pacing and proof

Show **current use**, **next useful change** and **how to develop it** beside a skill/talent. Keep provenance and calculations inspectable. Display a supported threshold or prerequisite, not an invented percentage for unmeasurable comprehension. Explain contributions from skill, technique, talent, equipment and conditions once. An achievement title can provide recognition/access instead of freely stacking the same mastery bonus again.

For the proposed ordinary frontier loop, discovery can offer unusual functions while regular practice remains a viable mastery route. Other authored systems may rely on random development according to the tier policies above. Refusing an optional specialization should not block baseline XP. Shared actor rules can support trained enemies/companions with different actual builds and privileges; their autonomous advancement still requires the existing actor/clock/possession work. Talent growth alone does not implement enemy lives.

The smallest proposed proof remains movement/guard derived from existing Rat-step, followed by one supported specialization or talent-development event. Compare baseline, developed and advanced states against the same objective, retain another viable approach, and verify ordinary/idle continuity. A contrasting profession can follow when its product/unlock transaction exists. XP curves, milestones, branches, respec policy and event rates remain open for playable review.

Source inspected for this pass: `src/models/skill.js` and `src/data/skills.js` expose native XP, parents, milestones and capped coefficients. `src/techniques.js` and `src/technique_content.js` implement bounded Rat-step knowledge/proficiency/ownership. `src/capabilities.js` supplies conditional numeric grants/provenance. Actual Field eye in `src/expedition_content.js` is a fixed earned route-preparation trait, distinct from proposed Pattern sense. `src/gameplay_publication.js` rejects staged XP causing unsupported native unlocks. This pass changes documentation and the illustrative comparison only; no gameplay source, bundle, save schema or personal save was changed, and no new gameplay test/build/browser result is claimed.

## Mastery beyond the creator, rarity and other distinctions, 2026-10-02

**Requested refinement; exact labels and rules remain proposals.** The earlier Beginning/Developed/Advanced comparison sampled three states; Advanced is not a lifetime ceiling. [User vision](USER_VISION.md#mastery-beyond-advanced-creators-and-rarity-2026-10-02) records the clarification. [Runtime refinement](ENGINE_EXPANSION.md#mastery-grades-lineage-and-comparison-contract-2026-10-02) owns future execution and persistence. This extends the existing local-development policies rather than adopting one global martial ladder.

### An extended mastery vocabulary

A possible display sequence is **Beginner → Practiced → Advanced → Mastered → Perfected → Transcended**, with further stages or different terms where the world's rules support them. These are our working labels, not a claimed canonical sequence from a book. A method can have continuous growth between and beyond named stages; a stage is useful only when it describes an actual difference in execution, understanding or application.

| Proposed band | Meaning in a selected technique | Example of a useful change |
|---|---|---|
| Beginner / Practiced | Learn and reproduce the supported procedure, then perform it more reliably | A deliberate step becomes repeatable with lower waste; ordinary training remains useful |
| Advanced | Adapt familiar elements to the supported context | Link movement to a paid weapon action or use a procedure under load |
| Mastered | Command the core applications of the specified taught form | Choose among its supported responses under pressure; an authored policy can execute those responses automatically |
| Perfected | Refine that form's declared efficiency/control or close a known flaw | Preserve footing while carrying or reduce a demonstrated recovery weakness. Perfected describes this version and scope, not mathematical perfection against every possible threat |
| Transcended and further development | Extend the method's principle, develop a new application or exceed a former structural boundary | A movement specialist develops a new response to a tracking threat, or in a suitable magical world earns an extraordinary movement function. New costs, scope and actual handlers apply |

Mastered need not stop XP, force a rename or require invention before further capacity growth. A world can permit extremely high development of the unchanged action. In another, a genuine structural evolution is required for a new function. A copied method can reach or exceed the donor's practical mastery through its own development; copying acquisition and competence remain separate. A fixed trait may instead have one complete function and no mastery sequence.

### Surpassing people and surpassing the method are distinct achievements

**Surpassed the creator** compares actual command/application with a known creator or recorded version. **Surpassed the school** compares with its declared benchmark. **Beyond the known frontier** means a new result beyond the supported known records. They are not interchangeable and need not appear in that order. A creator can have been a modest inventor, a later practitioner can be better, and a world can contain undocumented experts.

For an original movement method, a surviving training record might show its creator retaining balance under a particular load, footing and threat. The player first reproduces the full taught form, later performs it more efficiently under comparable conditions, and finally authors a response the original manual lacks. The efficiency achievement can leave the method's grade unchanged; the new function may create a revision or derivative according to local rules. Neither automatically makes the player stronger in every fight than the creator was.

Compare like objectives and declared means. Outperforming a weak instructor with a vastly stronger body proves greater output, but does not by itself prove superior technique. An authored mastery comparison can use comparable resources, a difficult control objective, independently inspectable research, a resolved duel criterion or a reliable demonstration. It need not require a live creator fight; a manual's executable challenge or preserved record can supply the reference. Unknown authorship means unknown authorship, not an invented creator receipt.

Claim **best known in this school/world at this recorded time** only when the relevant evidence exists. Do not label someone above everyone in the universe from beating one teacher. Preserve a historical first/surpass achievement if a rival later improves; any current leading status can separately change through supported events. Mechanical mastery, personally known evidence and public recognition/title are three distinct states. A secret breakthrough works mechanically before a school agrees to recognize it.

### Five dimensions to keep separate

| Dimension | What it answers | Why it matters |
|---|---|---|
| **Personal development** | How well does this actor understand and execute this version? | Native level, selected mastery band, precision, reliability and efficiency can develop independently of acquiring a rarer method |
| **Method grade and scarcity** | What structure/functions does this method support, and how common is access? | A world's rarity label may encode structural rank, scarcity or both. Define its meaning locally. An obscure ordinary technique can be scarce without being cosmically powerful; a widely taught method can still be excellent |
| **Potential and completeness** | What further growth is supported or known, and is this copy/form complete? | Two same-grade branches can have different continuation routes. An incomplete manual differs from the full method. Unknown potential is not a low ceiling, and a common starting form need not have a fixed weak endgame |
| **Actor means and fit** | What can this practitioner actually sustain with their body/source, affinity, fuel and tools? | Aptitude changes a supported learning operation; mastery changes execution; capacity and compatible means constrain present use. A rare technique's exclusive function can remain decisive even against a skilled ordinary practitioner |
| **Expression and lineage** | Which specialties, discoveries, revisions and relationships define this person's method? | A controlled variant, a powerful burst form, an inherited exception and a new derivative can have different practical uses at the same grade/mastery. Creator/school/frontier benchmarks supply scoped achievements, not a global winner score |

Cost, preparation, startup/recovery, range, target/medium, concealment, risks, teachability, tool dependence and world compatibility belong to the actual definition/read model when exercised. Do not make every attribute another independently grinded bar. Keep structural strength meaningful: a stronger source can confer an unavailable verb or higher starting capacity. Deep mastery can also make a simple skill extraordinary where the local model allows it. Neither rarity nor mastery alone determines every outcome.

Original comparison: a Common-grade push at great mastery moves a large supported load; a Rare-grade unfamiliar seal can bind an eligible spirit. The push can excel at moving the load and have no authority to bind that spirit. The seal's rarity does not make it the better cargo tool. If the push later earns an authored spirit-targeting function, that is an actual local development event, not a free consequence of being called Mastered.

### Bounded book evidence checked for this refinement

| Primary source | Verified detail | Design interpretation, separate from canon |
|---|---|---|
| **A Novel Concept**, [chapter 119](https://www.royalroad.com/fiction/66455/a-novel-concept-he-who-eludes-death/chapter/1418575/chapter-119-back-to-basic) | Kazuki demonstrates that raised attributes and skill progress can mask deficient spear handling; he names linking basic techniques as Mastery's Stage 0 | A separate measure of practical command can be useful alongside native levels. This verifies an introductory mastery stage, not the novel's complete higher-stage ladder |
| **A Novel Concept**, [chapter 120](https://www.royalroad.com/fiction/66455/a-novel-concept-he-who-eludes-death/chapter/1422216/chapter-120-thrust-and-trust) | Spear Strike experience transfers into a specialized Common thrust without duplicate attributes/Potential. At its authored Common cap, three Rare upgrades differ in functions, cost and stated future upgrade potential | Same rarity can conceal different growth prospects and personal expressions. Preserve earned lineage/progress on selected evolution, and show continuation prospects. The chapter's exact caps/currencies are its local rules, not imported defaults |
| **Desolate Era**, [book 1, chapter 16](https://www.wuxiaworld.com/novel/desolate-era/de-book-1-chapter-16) | Ning can use powerful received sword methods while not yet reaching their expertise/mastery; his general swordplay is separately described as advanced | Possession, method quality and the practitioner's development can be separate. This early scene does not verify a complete creator-surpassing ladder or all later Dao stages |

Checked 2026-10-02. These bounded cases complement the existing equally scoped world-model work; they do not replace its other reference families. The original **creator/school/frontier comparison contracts above are proposals**, not a claim that these chapters implement that exact achievement system. Reverend Insanity remains a relevant attainment research lead, but the licensed [chapter 1502](https://www.webnovel.com/book/reverend-insanity_7996858406002505/lacking-souls_43682938063209851) exposed only an introductory excerpt in this pass. Fan fiction and unofficial reposts were excluded from canonical evidence; its highest-attainment definition was not newly verified here.

### Small proof and current boundary

Continue the existing movement proof, then compare one taught form with its supported refined application. A later authored challenge can award a scoped creator/manual benchmark receipt independently of the skill's grade. Add a new function only when its development and execution actually work. Preserve the old affordable form, and allow a grade change only where that local model declares one. Stronger forms need appropriate target/cost/body/world handlers, not only a renamed tier.

The updated conversation comparison includes Mastered, Perfected and Transcended examples; it remains a design explorer. Current Rat-step's saved twelve-point introductory limit and its existing crossing modifier remain unchanged. No creator is invented for that wolf-rat-derived exercise, no rarity table is retrofitted into native saves, and no new gameplay/build/browser-playthrough claim is made. The first milestone and existing playable review remain in place.

## Choosing an advancement policy, 2026-10-02

**Design selection guide, not a selected universal rule.** [User vision](USER_VISION.md#choosing-advancement-routes-2026-10-02) owns the request. Choose the trigger from the reason the character changes, then check its player control, pacing, world fit and practical consequence. [The five route families](#skill-tiers-critical-points-and-advancement-routes-2026-10-02) and [runtime tier contract](ENGINE_EXPANSION.md#skill-tier-trigger-and-reward-policies-2026-10-02) remain the owners of available policies and their implementation. This guide narrows a concrete choice without making every skill use every route.

| Choose this route when… | Suitable benefit / original example | Main design cost to account for |
|---|---|---|
| **Accumulated competence:** change comes from repeated relevant practice, and players should be able to plan the improvement | Footwork becomes more economical; a practiced simple power's capacity grows; a displayed threshold opens a new supported control mode | Choose an attainable time-to-benefit and useful gains between thresholds. The routine used to progress should exercise the relevant method; native XP/parent gains still apply once |
| **Demonstrated application:** the tier means the character can perform a particular thing or handle a new circumstance | A coordinated movement/strike is earned by completing its supported sequence; protection mastery comes from preserving an objective | Define what counts and supply feedback. A prepared idle/assisted policy can perform the same eligible sequence where supported. Avoid requiring repeated manual reactions to maintain normal idle progression |
| **Insight, research or synthesis:** the gain comes from understanding a principle, resolving uncertainty or relating known methods | A tested heating process opens a craft application; interpreting an enemy's cue enables a relevant counter | Author a discoverable evidence/procedure loop and an actual new application. Variations should change what is learned, prepared or done, rather than become an opaque generic insight currency |
| **Transmission or integration:** advancement depends on knowledge, permission, a method or a compatible faculty obtained from elsewhere | A school teaches a distinct branch; a manual or mentor supplies a procedure; an owned method integrates a compatible source | Access, price, obligations and scarce opportunities must fit local play. Acquiring instructions/source is separate from execution mastery. Keep an already useful base skill worthwhile while offering that access |
| **Stochastic development:** uncertainty is part of the world process or the desired experience of discovery | A rare awakening, unexpected variant or prepared but uncertain breakthrough | Declare the eligible attempt and evaluate waiting-time variation plus failure costs. Decide whether preparation affects success, available branches or quality, and which uncertainty the actor can understand. Pure chance remains a legitimate authored policy where chosen |

### Apply the choice to a concrete milestone

First describe the payoff as an observable action: “after this advancement, the character can sustain the movement longer” or “can apply the process to this additional material.” Decide whether its underlying cause is practice, a demonstrated capability, new understanding, outside access or a genuinely uncertain process. That causal fit takes priority over using a different trigger simply to increase system count.

Then choose how much control the player needs. The proposed frontier's basic route competence benefits from a predictable practice path. Its first optional specialization can use a relevant feat or teacher, with context shaping the result. A later unusual variant can use a random discovery if that uncertainty is useful. These are recommendations for this local proof, not restrictions on a world whose basic power acquisition or growth is stochastic.

For Rat-step specifically, proposed ordinary efficiency growth follows existing practice; a coordinated recovery procedure can follow demonstrated application or instruction; a more unusual future form may use the selected world's insight/source/chance policy. Preserve its existing crossing/proficiency and allow the same lineage to grow. No route, new function or numerical threshold is implemented by this recommendation.

Use one clearly understandable primary route for a selected introductory milestone. A secondary route can add a different preparation, cost, branch or opportunity. That is a simplicity guideline for the first proof, not a permanent limit on later worlds or powers. Distinguish an **alternative** (“practice OR mentor”) from a **compound requirement** (“practice AND a valid source”); the former offers another route, while the latter deliberately adds a gate.

### Pacing, failure and useful variation

Match the attempt cadence to simulated play. A chance per valid use and the same chance per completed session imply very different waits; neither is a chance per rendered frame or panel opening. Count the cost/time of qualifying actions, input supply, interruption and retry. Only include supported active/idle progress in the forecast; current closed-browser replay remains unimplemented.

**Calculated illustration, not selected balance:** independent attempts with a constant5% success chance require20 attempts on average. The probability of no success after20 is `0.95^20`, about35.85%;59 attempts give at least a95% chance of one success. If each attempt took5 simulated minutes, the mean would be100 minutes and59 attempts would take295 minutes. These figures assume a fixed rate and no accumulated protection, prerequisite changes or competing outcomes. An average alone does not describe a player's likely long wait.

Accordingly, choose whether a failed attempt spends only time, spends disclosed materials, gives partial understanding, changes the offered branch or has another explicitly authored consequence. Optional accumulated protection or deterministic alternatives can suit a routine development path; a genuinely rare discovery may retain long-tail uncertainty. Exact odds, protection, guarantees and permanent-loss rules remain unselected. A deliberately exceptional lucky power need not be reduced to average strength to make the system uniform.

Keep choices meaningful after advancement: different targets, timing, fuel, burden, environment or obligations can favor another method. A branch can improve reach while costing more upkeep, or improve precision while affecting fewer targets. Shared tags and cross-skill relationships should connect those choices to existing play. Apply the same supported rule to relevant enemies/companions through their actual bindings, without handing them player-private knowledge or automatically scaling their advancement to the player's level.

### Prototype decision and validation

Before implementing, write one bounded choice: which skill/milestone, actual new benefit, chosen trigger and qualifying context, time/input budget, failure/retry behavior, permitted alternative and next lead. Make that result work through the existing authoritative state and [tier settlement contract](ENGINE_EXPANSION.md#skill-tier-trigger-and-reward-policies-2026-10-02). Current source supports native stat/XP milestones and committed authored draws, while new function/feat/source/unlock effects still need their actual adapters; ease of naming a definition does not establish gameplay support.

Compare two fresh supported approaches at similar starting progress. Observe how much play is spent preparing, waiting, deciding and repeating; whether the next step and payoff are understandable; whether the alternative has a useful context; and whether costs/rewards survive reload once. Inspect failure/long-wait cases as well as success for selected RNG. Preserve strong simple-skill growth and distinct local systems. This pass records a selection guide and verified probability arithmetic only; no gameplay source, migration, build, runtime test or browser result was added. The current playable review and first milestone remain in place.

## Personal techniques, incomplete methods and living traditions, 2026-10-02

**Requested feature direction; concrete content and rules remain proposals.** [User vision](USER_VISION.md#personal-techniques-incomplete-skills-and-broader-book-inspiration-2026-10-02) owns the request. This extends the existing mastery/lineage work into a feature: discover a person's technique, learn a usable part, compare versions, complete or reinterpret it, develop a personal expression, and possibly transmit that expression. [Character ownership](CHARACTERS_AND_WORLD_EVENTS.md#personal-techniques-and-teaching-refinement-2026-10-02) owns the people; [runtime contract](ENGINE_EXPANSION.md#personal-technique-and-fragment-contract-2026-10-02) owns future implementation. The books supply contrasting design sources, not one merged canonical system.

### Five connected considerations

| Consideration | Proposed interaction | Useful boundary |
|---|---|---|
| **People with actual styles** | A teacher, rival or crafter owns and uses an authored method, including a distinct application, preferred response and exploitable limit. The player can recognize it, request instruction, spar, exchange knowledge or investigate its history | A signature technique changes an action or product. Its name/title alone is insufficient. Important holders keep their actor identity, resources and actual mastery; NPC growth follows authored causes rather than scaling automatically with the player |
| **Fragments and reconstruction** | An incomplete manual offers one usable application and a lead. Another record, demonstration, teacher or validated experiment supplies a missing element or a different reconstruction | Missing instructions, misunderstanding, an unfinished method and incompatible means are separate. Reconstruction need not reproduce the historical original; a working derivative records its evidence and ancestry |
| **Personal fit and expression** | Two students learn the same foundation, then adapt it to reach, carried load, energy, equipment, senses or a selected talent. A later bodily/source change can motivate further adaptation | A visible movement does not transmit the donor's unique faculty, fuel or full internal process. A copied ordinary component can remain useful. Prerequisites should identify the real missing means rather than impose a generic foreign-world penalty |
| **Transmission, access and secrecy** | A school teaches foundations publicly and offers a specialization through trust, payment, service or another authored route. A manuscript can be borrowed, copied, traded or stolen as an object | Physical custody, learned knowledge, public attribution and permission/obligations are different. Taking a manual does not delete the teacher's knowledge; copying need not weaken them. A secrecy consequence needs an actual informed observer/event |
| **Innovation and history** | Master a fragment, fix a supported flaw, add an application, author a derivative, teach it and compare later practitioners with recorded benchmarks | Preserve the lineage and historical achievement without requiring universal fame. A variant may trade strength for efficiency rather than improve everything. Sharing a method can create a student, ally, competitor or institutional response when those actors/events are implemented |

This can become an ordinary discovery/progression feature alongside exceptional powers. Techniques can belong to anonymous traditions, extinct schools, monsters, craft guilds or individual inventors; not every person needs a unique named ability. Authored definitions and variants are the first practical content route. A later generator can assemble only validated functional pieces; unrestricted generated prose does not become executable mechanics automatically.

### What does Incomplete actually mean?

| Actual condition | Player-facing meaning | Possible development |
|---|---|---|
| **Missing transmission** | This copy lacks a recovery section; the initial movement can be practiced, while the unsupported follow-up is unavailable | Find another copy, learn the missing section or test a supported reconstruction |
| **Damaged or distorted transmission** | A translation, diagram or instruction conflicts with observed results; its correctness may initially be uncertain | Compare evidence, consult a relevant translator/teacher or run an authored safe experiment. Counterfeit or deliberately misleading versions are optional content, not a default penalty for every discovery |
| **Unfinished original method** | The inventor's prototype works for one application but has no finished continuation yet | Research can complete or extend it. There need not be a hidden perfect historical copy waiting somewhere |
| **Partial personal understanding** | The method is complete, but this actor has not understood or practiced a part | Study, useful application and supported active/idle practice develop the actor; relabeling the manual as broken would be misleading |
| **Unavailable means or access** | The method is understood but cannot currently use the needed faculty, fuel, body, tool or accessible instructions | Adapt, prepare, acquire compatible means or use a supported substitute. This is an execution/access gate, not proof that the method itself is incomplete |

Use exact statements such as “Recovery section missing; initial step usable” instead of a universal “37% complete.” A percentage is appropriate only when the definition has a finite known collection of sections and those sections are what it measures. Display unknown completeness honestly. A complete introductory lesson is not a defective full art simply because later advanced teachings exist.

Someone can **master the usable fragment** while the inherited method remains incomplete. Restore missing instructions without erasing that mastery. Two fragments can overlap, contradict or come from incompatible revisions; collecting any two items must not automatically assemble the true art. Extra copies can provide comparison/trade value instead of free repeated XP. A full method may remain poorly suited to the player, while their incomplete or reconstructed variant is excellent for a particular objective.

Do not make every incomplete discovery inert until the final chapter drops. Give its supported subset a use, a comprehensible limitation and a development lead. Missing a crucial safety/control element can instead make that application unavailable; disclose what is known before committing. For an introductory proof, use a nonlethal rig and a safe fallback. No unattended permanent injury, lethal experimentation or manual-loss policy is selected.

### Bounded book evidence

Checked author/licensed pages on 2026-10-02, with mechanical summaries rather than plot retellings.

| Reference | Verified detail | Original proposed use |
|---|---|---|
| **Shadow Slave**, [chapter 1618](https://www.webnovel.com/book/22196546206090805/79322323986992324) | The public excerpt distinguishes widely taught styles from styles formed around personal habits, with strength, speed/precision and defense/counterattack emphases; it also distinguishes sound and poorly founded methods | Give people coherent authored styles, priorities and flaws. A shared method family can contain genuinely different personal variants |
| **Shadow Slave**, [chapter 2019](https://www.webnovel.com/book/22196546206090805/83991483329331898) | The public excerpt describes a higher battle art fitting the practitioner's changed powers and being fundamentally individual because their Aspects differ | Growth can involve integrating the actor's real faculties into an existing style. Copying movements does not, in our proposal, automatically reproduce an unavailable faculty. The excerpt does not certify all Shadow Dance stages, copying limits or later exceptions |
| **A Novel Concept**, [chapter 120](https://www.royalroad.com/fiction/66455/a-novel-concept-he-who-eludes-death/chapter/1422216/chapter-120-thrust-and-trust) | Teacher-led correction reveals neglected weapon applications, and existing progress transfers into a specialization; same-grade evolution options differ in continuation prospects | Instruction can change practical command and personal direction, while selected specialization preserves prior progress without duplicate grants |
| **Mother of Learning**, [chapter 23](https://www.royalroad.com/fiction/21220/mother-of-learning/chapter/306244/23-lighting-the-fuse) | Novelty says lesson progression is restricted; Zorian interprets some teachings as withheld and considers acquiring secrets from other groups. Elsewhere in the chapter, instruction is offered with apprenticeship/work commitments | Partial transmission can arise from access and institutional interests. A character's suspicion about withheld material remains their interpretation, not proof that every teacher supplies a defective method |

These cases complement the earlier Desolate Era, Delve, Super Supportive, cultivation and alternative-power comparisons. Wider book inspiration remains open; a future canonical method needs its own source check and adaptation choice. No specific reference world is selected. Shadow Slave's incomplete-technique rules are not asserted from these excerpts; the incomplete-method taxonomy above is our proposed game design.

### A bounded first feature proposal

Original working family: **Split Reed Footwork**, separate from the current Rat-step exercise. Attach it to the proposed Village peer/teacher work rather than creating another actor simulation. A torn record teaches positioning and a short step but lacks recovery under a carried load. The visible reward is a usable preparation/movement application, not a blank locked skill.

The teacher can explain the recovery section through a disclosed paid/service route; the peer demonstrates a loaded variant that provides another reconstruction lead. A supported training rig lets the player compare the partial form, the taught form and a personally refined form. Observation supplies evidence, not instant mastery or ownership of the donor's faculties. Guard or another prepared approach remains available where the step is unsuitable. Both timed practice and untimed inspection reuse the established idle-friendly rules.

Reconstruction settles the learned section/variant and costs once, preserving already-earned practice. A later refinement can qualify a recorded teacher/manual benchmark; teaching that refinement is a subsequent actor/transmission extension. The authored names, section structure, prices, requirements and actor roster remain proposals. Do not add a universal fragment hunt to every power or make this new family a prerequisite for the existing crossing.

**Current source boundary:** `src/techniques.js` separates Rat-step evidence, understanding, ownership and proficiency but validates a fixed enemy-observation provenance and three-cue practice. It has no per-copy section/completeness or teacher-transmission handler. Actor domains in `src/expansion_engine.js` do not themselves implement durable teacher policies, personal technique revisions or autonomous research. Extending these services needs the actual acquisition, actor, knowledge, action/effect and persistence adapters. This is feature design and source-backed research; no gameplay source/bundle, save schema or personal save changed, and implementation/build/browser-playthrough gates remain pending.

## Bookshelf acquisition and source distinctions, 2026-10-03

The [shelf dossier's acquisition notes](BOOKSHELF_INSPIRATION.md#1-acquisition-development-and-the-identity-of-a-power) preserve the newly requested detailed research for I06–I11/I14/I31/I33/I36. B01's two bounded scenes and the remaining premise-level cases motivate separate method, practiced command, bodily faculty, independent holder and authority acquisition. Its table distinguishes copy from transfer/extraction, lineage-preserving growth from replacement and source development from the acquired method's mastery. Exact reference-specific mechanics retain their evidence limits.

[Scenario A](BOOKSHELF_INSPIRATION.md#a-a-method-acquired-in-two-genuinely-different-ways) supplies an original two-route practical-method proof with actual donor/ownership aftermath and useful execution. [Institution notes](BOOKSHELF_INSPIRATION.md#3-institutions-professions-and-social-power) add teaching/access/facility routes; [combination and presentation notes](BOOKSHELF_INSPIRATION.md#presentation-pacing-and-cross-system-combinations) connect faculties, tools, collaborators and local conditions. These detail requests extend the existing progression research without imposing one training sequence, rarity ladder, slot budget or drawback on every power. The full scenario is owned there rather than copied here.

Current shared power/effect primitives and remaining native bindings are distinguished in the [engine map](ENGINE_EXPANSION.md#bookshelf-scenario-and-adapter-map-2026-10-03). This saving pass adds documentation only; inherited Rat-step, source progress, saves and playable acceptance remain unchanged.
