# Characters and a world that changes

Saved 2026-10-02 at Weibao's request. This document owns the combined design proposal for character implementation, other characters' inventories, traits/titles, AI behavior and spontaneous world events. [User vision](USER_VISION.md#characters-ai-world-events-and-saving-ideas) preserves the exact requests. [Idea index](IDEA_INDEX.md) connects this proposal to the existing research. [Engine expansion](ENGINE_EXPANSION.md#character-and-world-event-contracts-requested-2026-10-02) owns runtime integration and delivery gates.

**Current playable subset:** the Village elder has a saved control encounter, debrief/lesson, directed memories, timed duty/inheritance and missed-event reports. The [shared simulation platform](ENGINE_EXPANSION.md#shared-simulation-platform-2026-10-02) and [independent actor increment](ENGINE_EXPANSION.md#independent-actors-and-authored-chance-rules-2026-10-03) additionally supply the craftsman's owned work, weather response, finite routines and independently acting hired pathfinders. Existing Journal Notebook/local actions present these services; source-backed bodies/knowledge and paid controllers do not establish a complete autonomous regional campaign, family tree or pursuit/native-party-combat adapter. Human review and the first milestone remain in place. Earlier proposal sections retain their dated scope.

[Prototype history](PROTOTYPE_HISTORY.md#character-proposal-overview-before-the-shared-platform-refresh-2026-10-03) preserves the previous chronicle-only overview.

## Autonomous situations, readiness and selective intervention, 2026-10-03

**Requested exploration; concrete mechanics remain proposed.** [Direct request](USER_VISION.md#simulation-references-interface-and-selective-intervention-2026-10-03) asks about a world moving around the traveler, regression-style knowledge, choosing interactions and leaving powerful affairs alone until ready. [Reference comparisons](RESEARCH_IDLE_GAMES.md#selected-simulation-references-and-living-world-implementation-2026-10-03) supply bounded evidence; [runtime/interface contracts](ENGINE_EXPANSION.md#interface-integration-autonomous-situations-and-foreknowledge-2026-10-03) own implementation scope.

Model a situation with participating people/institutions, motives, actual means, location, preconditions, next meaningful boundary, possible resolutions and lasting aftermath. It can develop while the traveler pursues ordinary work. Authored schedules give a legible baseline; participant decisions and interventions can change it. A failed prerequisite revises/cancels the relevant event rather than executing a contradictory script. Simulate active participants and due changes, with aggregate or dormant treatment for distant background populations. Exact policies for unvisited worlds and browser absence remain separate decisions.

Different player dispositions should have different commitments. **Observe** obtains supported information and may carry an exposed risk. **Follow a lead** retains interest without promising assistance. **Help indirectly** contributes a report, supplies, preparation or an ally through a real action. **Intervene** starts a declared negotiation, rescue, contest or conflict. **Leave it alone/defer** makes no assistance commitment; the situation can resolve and later produce a supported report or altered route/service. Declining an optional invitation is not automatically a betrayal or failed quest. A promise already made can have its own consequences. Urgent player-required decisions and voluntary watched situations require separate UI/clock treatment.

Keep actual world state, observed evidence, hearsay and expectations distinct. Reports name their source/time where useful; private outcomes appear only after actual observation or an information route. A saved journal can retain what was learned without pretending a physical letter traveled with the character. If an explicit historical reset is later implemented, retained foreknowledge describes a prior timeline; intervention may invalidate a prediction. A remembered date is a lead, not omniscient certainty. No universal world rewind, forced loop or exact book adaptation is selected by this request.

Power is one dimension of readiness. Preparation can also require technique/control, knowledge, protection, allies, equipment, local permission, credibility or an escape route. Fixed local strong actors need not scale with the player or wait for their arrival. Early play can observe consequences, investigate, trade with survivors, supply an intermediary or choose another route. Later capabilities can open a stronger form of participation. Not every obstacle needs a workaround, and some disclosed encounters can remain presently overwhelming. Explain known threats and uncertainty using observation, rather than leaking hidden numerical stats or private powers. Existing ordinary defeat/recovery rules remain in force until a specific supported danger policy is authored.

Original candidate: two armed groups contest a river salvage site. The traveler can hear a credible warning, observe from an allowed position, contribute supplies to a chosen intermediary, negotiate access with sufficient standing, or leave the dispute alone. Resolution changes actual custody and local access; later reports disclose only what their speaker knows. A more capable return can open another interaction with the resulting situation, without resetting it to an untouched reward chest. Names, actors, timing, hostility and rewards remain proposals; no new faction or event is implemented here.

Acceptance should compare observing, helping and abstaining through a saved resolution, then returning with changed means. Check that NPC action does not depend on opening a menu, essential unrelated progress remains available, watchers receive no unobserved secrets, and commitments/rewards settle once across reload and failed persistence. Human review owns whether the scene feels fair, optional and worth following.

## Personal techniques and teaching refinement, 2026-10-02

Party readiness is assessed separately in [Party, companions and shared adventures](#party-companions-and-shared-adventures-2026-10-02). Earlier references to recruiting companions and joint outings describe proposed content, not an existing party feature.

[Personal techniques, incomplete methods and living traditions](RESEARCH_LITRPG_SYSTEMS.md#personal-techniques-incomplete-methods-and-living-traditions-2026-10-02) owns the requested feature design and bounded book evidence. Important holders reference their actual learned method/variant, mastery, faculties and custody of manuals. Teacher/student/rival roles share the same person and possessions across dialogue, practice and encounters. A signature style must change a supported action, preferred policy or product.

Selected teaching offers state which section/function is taught, requirements, cost/service/obligation and what the learner retains. The teacher's policy can depend on their goals and known relationship/evidence; a hidden player power is not automatically known. Giving instruction does not remove the teacher's competence. Taking a physical manual can affect custody and informed relationships, with a separate theft consequence when authored; it does not transfer every faculty or erase the owner's knowledge.

Personal refinements and discoveries need actual work/access/resources and retained lineage. Secret development can work before public recognition. A future student may adapt the taught method, but new NPC progress is not an automatic response to the player's level. The proposed Split Reed example can attach to the existing bounded Village actor/encounter work. Names, styles, offers and implementation order remain proposals; no durable teaching controller or gameplay is added here.

## Broader character interactions, 2026-10-02

The user requested more character interactions while broadening existing systems, and chose design exploration before implementation. These original proposals extend the shared actor model below; they do not add a second relationship engine or select a cast. [Gathering and resource uses](GATHERING_AND_RESOURCE_USES.md) owns related finds, methods and resource decisions.

People should be useful company, knowledgeable specialists, unreliable partners or interesting adversaries in ways the player can act on. A personal relationship can matter even when nobody is providing a stat bonus.

| Interaction family | Proposed player actions | What changes afterward |
|---|---|---|
| **Exchange and practical help** | Discuss a need, barter, commission work, give an appropriate gift, lend a tool, request a service or settle a debt | Actual possessions/work/custody change. Reliability can affect a later offer; gifts are interpreted through the recipient's preferences and circumstances |
| **Learning and personal methods** | Ask for a demonstration, apprentice, spar under agreed terms, compare an incomplete method, teach back or collaborate on research | Gain a specific observation, function or interpretation. A teacher can learn a student's refinement; competing schools can disagree without one universal mastery score deciding everything |
| **Joint work and expeditions** | Share a gathering plan, escort, recruit a companion, assign a role, agree a reward split, rescue or request help | Their equipment, skill and goal affect a supported task. Contributions consume real means; agreements determine settlement. A companion can refuse a plan or pursue an incompatible objective |
| **Personal bonds and ordinary life** | Talk about an experience, share a meal, practice a hobby, attend a local event, keep a promise, apologize or introduce two acquaintances | Learn preferences/history, create a shared memory, open a personal scene or change willingness to confide. Friendship, mentorship and optional courtship remain different authored relationships; none requires a daily gift chore |
| **Conflict and social standing** | Negotiate a claim, challenge a boast, bargain for secrecy, refuse pressure, expose wrongdoing, mediate a feud or reconcile | A specific dispute, obligation, witness belief or institutional access changes. Intimidation can gain compliance while damaging trust; public recognition and private affection remain distinct |

An interaction needs **context, a meaningful response and a later consequence**, not always a reward. A person who helped on a failed trip can remember the effort even if no loot was earned. Someone can respect the player's skill but decline to lend money. A refusal should give useful known context where appropriate, such as needing their own tool for tomorrow's work, while keeping undisclosed motives private.

Retain only relationship dimensions a scene exercises: trust, respect, affection, fear, rivalry or an explicit debt. Concrete memories explain them: returned loan, shared rescue, kept secret or disputed share. A fulfilled loan closes its obligation; it need not erase every other grievance. A repeated gift or greeting cannot manufacture unlimited favor, rewards or new story memories.

Conversation can disclose leads, permit a commitment or express personality. A rumor has a speaker and an evidence status; hearing it does not make it true. A private confidence does not instantly update faction reputation. Show known offers and why they matter instead of exposing every secret inventory, goal or numeric relationship value.

The player's build creates alternate social contributions. A cook can prepare a useful expedition meal, a herbalist can recognize a requested sample, a craftsperson can repair equipment, and a fighter can provide escort or a demonstration. These are authored functions of existing skills, not a requirement to grind a new universal Charisma bar. A straightforward paid service remains an alternative where the scene supports it.

NPC initiative can start a commission, invitation, warning, repayment or request for a joint outing. At a supported time boundary, a known peer may finish independent work or change availability. That uses the existing agency/event contracts and the person's actual information and resources; a broad autonomous life simulation is not required for the first recurring interaction.

The smallest comparison pairs one resource outing with one recurring peer and a concrete agreement. Meet them again after cooperation, refusal or a disputed settlement and show a different useful response. [The connected willow outing](GATHERING_AND_RESOURCE_USES.md#one-connected-outing-to-compare-later) is an optional variant of the existing peer/outing proposals, not a replacement work order. Further friendship, institutions, companions and personal traditions can grow from the same model after the first consequence is playable.

## Party, companions and shared adventures, 2026-10-02

User request: “Is there even a party system currently? other stuff to consider?” **Current answer: no playable recruitable party system.** Earlier companion examples and party-oriented game references are proposals. The native foundation contains useful multi-fighter/person components, but those components do not establish recruitment, management or a saved party journey.

### Source-verified current state

| Layer | Inspected evidence | Present boundary |
|---|---|---|
| Ordinary combat | `src/main.js:2094` constructs `Combat` with `attackers: [character]` and the location's enemy group | Player fights alone; normal combat does not assemble a companion roster |
| Multi-fighter combat/display groundwork | `src/models/combat.js:34` accepts attacker/defender arrays; `src/ui/combat_display.js:44` iterates attackers; the console helper in `src/main.js:6195` creates special multi-fighter encounters | Engine/display structure, not a recruit/order/equipment interface or verified party gameplay |
| NPC bodies and possessions | `src/models/npc.js:8` extends Person; `src/data/npcs.js:28` registers inventory/equipment/levels and dialogue | Reuse these owners for a companion's actual character. Native NPC XP multipliers default to zero; independent learning/history policies still need definition |
| Expansion actors/support | `src/expansion_engine.js:22` starts with only a player actor; `src/main.js:142` binds only the player; `src/capabilities.js:4` includes the `support` source kind | Multi-actor scheduling and support vocabulary are groundwork. No live recruitment/controller/party binding is established |

Simply adding an NPC to `attackers` is insufficient. Target selection currently takes the last living opponent in `Combat.setAttackLoop`; loot/character XP and several rewards depend on `main_character`; player fainting follows the existing solo recovery path. `clearAllAttackLoops` also compares indexes against arrays rather than their lengths. These are inspected integration concerns, not newly reproduced party failures or fixes. A selected combat-party increment must validate targeting, actor-specific outcomes, cleanup, rewards and supported persistence.

### Five design considerations

| Consideration | Proposed choices and useful interaction |
|---|---|
| **Kinds of company** | Distinguish traveling companions, temporary escorts/hirelings, contacts who stay home, apprentices and summons/mounts. A friend need not be recruitable, and a summon need not share a human companion's learning, pay or bond rules. |
| **Roles and cooperation** | Give scouts, healers, guards, gatherers or scholars supported tasks that alter decisions. Scouting reveals a route, guard support creates a safe research opportunity, or two methods combine in a declared maneuver. Shared combat needs actual target/protection/healing handlers; narrative role labels alone do not implement them. |
| **Goals and relationships** | Recruitment can require trust, payment, shared purpose or a temporary agreement. Companions may refuse a specific act, leave for an obligation, disagree or teach a personal method. Explain known causes through remembered events; exact loyalty/betrayal rules remain open. |
| **Possessions, growth and aftermath** | Decide who owns equipment, pays supplies, receives loot and learns from work. Distinguish carrying a borrowed tool from owning it. Show a reward split before commitment. Injury, rescue, recovery and any authored death must leave consistent personal/party state across reload. |
| **Scale, control and the wider world** | Keep solo play viable; define player orders and simple editable idle policies. Consider home assignments, faction affiliations, group reputation and which companions can travel between particular worlds. World access and local power compatibility remain separate from party membership; no universal party size, wage upkeep or offline-loss rule is selected. |

**First-proof recommendation:** extend the existing proposed Village peer into one optional outing helper. Agree a role and payment/share, consume their actual supplies, let their knowledge or equipment change one approach, and show remembered success/failure afterward. This could use the current journal/center menu before general party combat. It is a recommended route, not a selected implementation order or a permanent limit on party size.

Acceptance for that selected proof would require a real joined/left state, useful task contribution, once-only cost/reward settlement, a meaningful solo alternative and save/reload continuity in the rebuilt game. Combat companions need the additional targeting/defeat/reward gate above. This pass inspects and documents; no gameplay, bundle, schema, personal save or new runtime/browser test changed.

## Party saving and member inventory interface, 2026-10-02

User request: “how will stuff like those be saved and more? inventory interface for party members and more? more to consider?” This is a save/interface design proposal for the party direction, not implementation of recruitment or native member controls.

**Recommendation:** keep one existing game save. Party membership refers to stable actors; their possessions, development and personal history remain attached to those same actors when they join, leave, stay home or travel. The selected inventory screen is a view of these owners, not another independent copy of their goods.

### What saves now and what needs extending

Inspected `src/main.js:create_save/load`, `src/data/npcs.js`, `src/data/storage.js`, `src/expansion_persistence.js`, `src/acquisition.js`, `src/gameplay_transactions.js`, `src/save_files.js`, `src/models/person.js` and `src/display.js:update_displayed_character_inventory`.

| Domain | Verified current state | Proposed extension |
|---|---|---|
| Native bags and progression | `create_save` serializes registered `inventories[category][owner]` and `levels[category][owner]`; NPC registration exposes personal inventory/equipment/levels; the chest is `inventories.storage.player` | Bind companions to existing Person inventories/levels. Register any selected shared pack as a real inventory owner; do not overwrite the existing chest |
| Equipment and body | The hero's equipment, health/stamina deficits and biography are saved under `character`; a registry component existing does not imply general NPC equipment/body serialization | Add validated actor-specific equipment and exercised body/condition records. Preserve the hero's existing save shape through a compatibility adapter; never maintain two independently mutable hero equipment records |
| Party, life and relationships | Expansion state has actor-scoped facts, sources, techniques and commitments; the live bridge remains player-only | Add party membership/order, native actor bindings, known location/life/controller metadata and selected relationships/agreements, with one authority per fact. Retain equipment at its owner and derive current stats from actual owner records |
| Jobs and events | Expansion jobs retain participants/context, costs, draws, deadlines/effects and receipts in the same save envelope | Save actual helper participants, reserved supplies, negotiated shares and cancellation/settlement terms. Loading resumes the recorded job; it does not reroll the event or grant it again |
| Interface and storage | The game uses one localStorage save envelope, export/import and writer ownership; item/equipment controls in the inventory display directly address `character` | An owner selector and owner-aware commands need new UI bindings. Selection, sorting and expanded sections are preferences; opening a member panel cannot grant equipment, create a person or spend supplies |

Static native NPC definitions exist before ordinary component restoration. A future generated or recruitable actor needs validated identity/profile reconstruction and component registration **before** restoring its inventory, levels, equipment and dependent jobs. Unknown definition revisions or unresolved owners preserve the original save and block affected writes rather than silently discarding a companion. Old saves start with no added members/shared pack unless selected migration explicitly introduces them; existing items, shops, quests, Rat-step and dormant content are retained.

### Inventory surface proposal

**Accepted UI direction, 2026-10-02:** follow the original YAIRPG interface. Keep character stats/equipment above inventory on the left, location/actions in the center and the existing journal/skill surfaces. Preserve the blue panel treatment, compact item rows, equipment slot grid, sorting/filter controls and Stats/Bio/Equipment/Tools vocabulary. The earlier separate party-window presentation is retired as the preferred layout; its evidence remains in [prototype history](PROTOTYPE_HISTORY.md#standalone-party-inventory-study-superseded-2026-10-02).

A proposed **Inspect member** selector binds that person's profile, bag, equipment and supported skills to the same stable actor. A proposed Shared tab shows the real shared-stock owner while retaining the inspected person's profile. Inspection does not change the active player, location, combat participant or command permission. Keep original Inventory/Combat, sorting and category behavior, including favorites, when integrating; exact selector placement and responsive geometry still need native acceptance. A total-supplies view may summarize real bags with holder/access labels, without creating another storage owner.

### Original UI integration considerations

Add supported companion conversation, preparation, joint work and orders through the existing center action menu; use the existing journal for known goals/history and reports. Extend native item details with contextual Give/Lend/Return and blocked reasons. Equipment comparison and consumption must target the inspected actor explicitly, while player travel, shops and global actions retain their declared executor. Keep per-owner filters/selection and a fallback when a member/item becomes unavailable. Improve keyboard/touch access and pinnable details while retaining familiar controls. No new navigation shell or map is selected.

Item detail should distinguish **owned by**, **carried by**, **equipped by**, **available quantity**, **reserved quantity** and **borrowed/return obligation** when exercised. Give transfers ownership; lend changes custody under an agreement; equip changes the chosen person's actual slot. A member's equipment comparison uses that member's learned skills, body/world requirements and other equipment. The player cannot equip incompatible gear simply because the player personally qualifies.

Direct management is permission-dependent. An agreed managed companion can allow selected changes; a hired specialist might reserve personal equipment and accept requests instead. Known personal goods appear through a supported inventory agreement or discovery, not by revealing every NPC's private bag. Use explicit labeled transfer/equip controls, quantities and reasons; drag-and-drop can be optional. Return selection and focus to the affected member/item after a transaction, and preserve a useful fallback when that item or member leaves the current view.

Ordinary interchangeable materials can remain native stacks. Copy-specific notes, wear, provenance or personal/borrowed ownership require stable item-instance or validated claim references before those mechanics are enabled. Native item keys currently identify template/components/quality; adding an arbitrary suffix would break reconstruction. Do not merge distinct personal copies or let a mixed borrowed stack be sold as wholly player-owned. Detailed copy/stack adapters remain design work, not an implemented identity model.

### Five connected policies to decide through play

1. **Command permissions and access:** who may equip, consume, lend or sell whose goods; whether a person/item is present or remotely accessible; reserved work blocks conflicting transfers.
2. **Shared resources and agreements:** party ownership differs from the person carrying supplies. Save contributors, consumption permissions, loot/pay splits and any loan/return terms actually exercised by the scene.
3. **Joining, separation and recovery:** leaving changes membership without deleting the person or resetting their bag. Reconcile jobs, loans and shared supplies on departure; injury, rescue, authored death and travel use their declared outcomes.
4. **Development and automation:** track each person's retained skills/methods and paid work; derive stats after loading. Idle plans consume supported resources and pause for a new decision or loss of access. Broad offline autonomy remains unselected.
5. **Clarity and scale:** reveal only known information, offer owner-specific comparison and future saved loadouts, summarize large rosters without forcing everyone into the active party, and retain understandable solo play. Carry limits, degradation and wages are optional mechanics, not required upkeep.

### Refining the original-style interface, proposed 2026-10-02

User follow-up: “more stuff to consider nd more? this is good but could potentially be better, more to consider?” This acknowledges the direction and requests improvement; it does not accept every control, numeric example or a completed party system.

| Priority | Useful refinement | Present boundary |
|---|---|---|
| **Intent and access** | Keep active player, inspected member and shared stock distinct. Show known role, location, availability and why a particular command is blocked. A remote or busy companion remains inspectable where known, while unavailable goods/actions stay unavailable. | Prototype adds player/companion context and personal/reserved/equipped reasons. Real actor life/access/permission remains future native work |
| **Better decisions** | Compare equipment for the selected member across power, speed, defense, requirements and supported skill effects. Explain what an item, book or next milestone enables, with useful preparation/advancement leads. Avoid assigning one universal score to every build. | Prototype compares illustrative attack power and speed. Body requirements, defense/effect comparisons and native advancement leads remain proposed |
| **Less repeated work** | Quantities, available-only Max, favorites, per-owner filters/selection and later named loadouts make repeated preparation easier. Retain keyboard focus on the same action/item after updates; if a stack disappears, focus the next item rather than silently reusing its action. | Prototype implements quantities/Max, favorites, remembered views and contextual focus. No native batch transfer, loadout or automatic equipment system is added |
| **People with purpose** | Recruitment, roles, refusals, teaching, compatible goals and remembered joint outcomes give company a reason to exist. Explain contribution and agreed cost/share before an outing; show a concise debrief afterward. Independent work should spend the actor's own resources and affect later options. | Existing peer/actor/event proposals own these rules. Prototype context is fictional display, not a controller or implemented joint outing |
| **Attention and scale** | Keep routine details quiet, reveal deeper book/gear/history details on demand and group important changes by cause. Distinguish a progress update, an expiring opportunity and a decision needing input. As a cast grows, use a compact roster selector with meaningful present/away states and the same inspector. | No alert cadence, roster size, offline loss, upkeep loop or additional permanent dashboard is selected. Existing native UI remains the baseline |

The updated conversation study preserves the original arrangement and adds these narrow interaction improvements. It keeps UI preferences apart from its demonstration inventory snapshot. Browser checks verified a two-herb transfer, available-only Max leaving one reserved herb, invalid quantity rejection without a debit, focus remaining on Unequip after a swap, and favorites/filter/selection restoration after reopening the demo. Comparison exposes a power/speed tradeoff; neither weapon is labelled universally better. Prior original-layout fragment is preserved as `party-inventory-original-layout-study.html` beside the active task visualization; earlier standalone history remains archived. Specific attack/speed values are mockup examples, not approved balance or the native combat formula.

Native acceptance should include partially reserved and borrowed stock, invalid/stale amounts, equivalent items in different owners' bags, member/item disappearance, comparisons using the correct actor, filtered versus truly empty states, pointer/keyboard focus, and restoration of UI preferences without reapplying gameplay effects. This pass edits the conversation prototype/design only; unrelated gameplay source work in the shared checkout is preserved.

### Reviewable interface study and gate

A conversation-only **Member inventory** study now follows the original panel/control patterns, checked against `index.html`, `style.css` and a fresh disposable-origin playable screen. Its member inspection updates profile/equipment/bag/skills together, with shared stock, sorting/filter controls and center-menu companion examples. Fictional actors/items and demo snapshot operations remain separate from native gameplay. The original standalone study is archived; prior interaction evidence is retained there. The revised study verifies a borrowed guide and equipment change through demo reload, with player location/actions retained. This is a responsive composition proposal, not a pixel-identical reconstruction or implemented native party interface.

Native acceptance still requires additive migration, owner registration/load order, exact item-copy/claim reconstruction where used, atomic transfer/equip/membership/job settlement, failed-write and stale-command behavior, and rebuilt save/reload tests. Test a member leaving/rejoining and an interrupted outing without duplication or vanished equipment. Current playable review remains pending; no runtime source, bundle, schema or personal save changed in this design pass.

## A shared character model

The [broader interaction proposal](#broader-character-interactions-2026-10-02) develops what the player can do with these people; [gathering and resource uses](GATHERING_AND_RESOURCE_USES.md) owns the resource-side content.

An important character should remain the same person through combat, dialogue, trading, assignments and world changes. Enemy, ally, teacher and merchant are roles that can change. They should reference one saved actor rather than create separate people with duplicate possessions.

| Character part | Proposed state | What it changes in play |
|---|---|---|
| Identity and life | Stable actor ID, world/location, origin, body/controller where exercised, alive/missing/dead/retired status and arc phase | A defeated apprentice can reappear as a supplier; death closes their personal arc unless an established survival rule applies |
| Means and development | Stats, practiced skills, techniques, body-bound faculties, energy, inventory, equipment, injuries and pending work | A talented rival without medicine or compatible fuel has a different plan from a fully supplied one |
| Motives and commitments | Goals, temperament, obligations, selected policy, available resources and assignments | Seeking safety, a cure or institutional approval can produce different responses to the same dispute |
| Information and relationships | Observations/reports/beliefs with sources, directed trust/fear/respect/debt facts and faction memberships | Respect need not imply affection; a witness can report a theft, while an uninformed patron remains unaware |
| Recognition and history | Traits, titles/claims, aliases, significant outcomes and active disputes | Credentials can unlock a teacher; a settled grievance stays settled; an old enemy can become irrelevant |

Start with the fields an actual scene exercises. Ordinary mobs can remain template encounters. A small important cast receives durable identities; distant actors can use summarized jobs and milestones. Promoting a background actor into a detailed scene must preserve their established identity, possessions and outcomes. Demotion cannot erase ownership or pending consequences.

## Other characters' inventories

Proposed inventories hold real item keys/counts and selected unique item identities, using the shared ownership service. Personal possessions, merchant stock, faction stores, ground caches and reserved job inputs have distinct owners or locations. A shopkeeper's personal weapon is not automatically merchandise.

Ownership, custody, equipment and permission are separate when content needs them. A borrowed sword can be equipped by the borrower while remaining subject to a return obligation. A stolen object can be in the thief's bag while its original owner retains a claim. Hidden items are not visible just because they exist in saved state; inspection, trust, theft or an authored perception ability determines what the player learns.

Gifts, trades, loans, theft, confiscation, consumption and corpse recovery specify source/destination, quantity, permission/claim changes and consequences. Transfer, reservation and reward resolve once in the same saved commitment. Removing an equipped ability carrier needs an equipment/capability transaction before the donor can lose its use. Merely putting an item in a recipient's bag does not grant its practiced technique.

An NPC can spend limited supplies on healing or preparation. That creates counterplay: poison protection may leave less money for a weapon. Initial generated possessions are drawn once and saved. Reopening dialogue or encountering the same person again does not regenerate their bag. Ordinary renewable monster loot can retain its authored repeat policy; unique NPC possessions need explicit loot, recovery and renewal rules.

Carry capacity, decay, theft during absence and universal hunger are optional mechanics, not implied requirements. Add them only when a selected loop benefits from their decisions and supports save compatibility.

## Traits, titles and conditions

| Kind | Proposed distinction | Original example |
|---|---|---|
| Temperament/background trait | Influences choices or access; context can outweigh a tendency | Cautious apprentice prefers a partner for an unsafe expedition |
| Innate or developed faculty | Grants a declared capability with body, fuel, awakening and retention rules | An awakened eye enables one observational acquisition policy |
| Practiced capability | Earned skill/technique with its own proficiency and execution requirements | A copied pattern still needs compatible movement or fuel when its rules say so |
| Temporary condition | Duration, treatment/counter and stacking policy are explicit | A damaged leg changes travel and available tactics until recovery |
| Achievement title | Records an earned deed; any effect follows its authored rule | Bridge rescuer receives recognition from people who know the rescue |
| Institutional title or office | Authority, access and duties depend on issuer/jurisdiction and can be revoked | A guild examiner can certify work but must fulfill examination duties |
| Claimed identity or reputation | What an observer believes, with evidence and uncertainty | A disguised traveler claims to be an examiner without acquiring their expertise |

Each effect needs an explanation, acquisition/removal rule, scope, provenance and stacking policy. Titles do not all need numerical bonuses or equip slots. Losing an office need not erase learned skills. Public reputation differs from private traits and from an observer's belief. Follow [rivals, identities and fate](RIVALS_IDENTITIES_AND_FATE.md) for the existing identity/theft distinctions rather than making a second identity system.

## Things that happen without being requested

World events can originate away from the player and change a region before discovery. An event is not necessarily a choice prompt, quest or combat. The following are original candidates, not selected content or rates.

| Event family | Examples | Possible consequence |
|---|---|---|
| Ambient/local variation | Unusual tracks, a conversation, a flowering patch, changing weather | Atmosphere or an optional clue; some events need no response |
| Personal life | A minor accident, illness, recovery, a lucky find, an unsolicited invitation | A condition, contact or new approach; adverse events can have remedies |
| Ecology and resources | Storm damage, migration, herb bloom, crop blight, a newly exposed cave | Routes, gathering and preparation change |
| Institutions and economy | A visiting teacher, festival, shortage, caravan delay, change of office | Temporary services, access, demand or faction obligations |
| Other actors' actions | A rival trains, buys a remedy, settles a debt, recruits help or wins an opportunity | Their next scene and the world's available options change |
| Campaign/world transitions | An authored conflict, discovery, regional recovery or succession | Larger phase changes with declared causes and aftermath |

Separate **occurrence, discovery, response and aftermath**. A storm damages a crossing; a merchant learns it; a report reaches the player; the player repairs, detours or waits. A remote consequence may initially be unknown. Records can preserve the actual occurrence without exposing secret information in the UI.

Use authored calendar/phase triggers, condition-dependent random draws and causal NPC actions together. Random selection can choose timing, participants or severity where appropriate; not every part needs to be random. Include a no-event result and quiet intervals. Foundational progression retains dependable routes while rare events provide optional advantages or alternatives.

A proposed event definition declares stable ID/revision, eligible region/actors, cause or check interval, weight/rate, selection rules, cooldown/repeat policy, duration, visibility, response policy, effects and follow-up. Its saved instance freezes participants, occurrence time, draws, expiry and committed results. Frequency follows simulated time boundaries, not rendered frames, clicks or browser reloads. Large time advances process the same supported boundaries in the same order.

Shared world events occur once with multiple affected actors; they are not separately rerolled copies for each observer. Unique rewards resolve through a shared claim. Causal follow-ups carry their originating event/dispute ID so settlement, recovery or invalidated conditions can cancel an obsolete response. Bound chain depth and event volume to avoid endless cascades.

The current game has separate native and expansion clocks. Linking weather, travel, rest, jobs, years and world absence requires the explicit adapter described in [engine expansion](ENGINE_EXPANSION.md#world-rules-starting-lives-and-meaningful-time-requested-2026-10-02). Offline catch-up, aging, lethal accidents and loss of unique characters remain open policies. This proposal does not silently select unattended death or permanent theft. Events may wait, expire, resolve automatically or use a previously chosen policy when their rules declare it.

### Text-first presentation of a changing world, 2026-10-02

The user asks how a mostly text-based game can include events beyond player control, naming A Dark Room and Level13. [Source comparison](RESEARCH_IDLE_GAMES.md#text-interface-and-independent-world-events-2026-10-02) verifies three bounded patterns. The accepted center action menu remains the main exploration surface; these refinements are proposals, not new gameplay.

1. **Events change ordinary play.** Weather can affect gathering, a delayed caravan can change shop availability, and a peer finishing training can change the next encounter. Descriptions and logs explain actual changes. Decorative prose alone supplies atmosphere, not mechanical autonomy.
2. **Knowledge controls presentation.** Record a remote occurrence once, then reveal it through witnessing, a delivered report or investigation. Perception can find a clue; domain insight can interpret its cause and reveal a useful response. Higher insight need not stop the event or grant remote omniscience. Known predictions can remain uncertain.
3. **Responses have different urgency.** Ambient news needs no prompt; ordinary arrivals can wait or leave at declared boundaries; a previously chosen automation policy can handle a routine case. An authored pivotal choice can pause supported progression. Use quiet intervals and concise summaries so continuous activity remains usable. Genuine deadlines need understandable warning and a declared fallback, rather than every event demanding an immediate click.
4. **Begin with a finite causal chain.** Extend the existing optional crossing-disruption scenario: while the player mines, a storm damages the crossing. A supplied peer begins a paid/timed repair plan. A courier later reports the damage; the center menu offers help, a detour or continued mining. If the player leaves it alone, the peer's supported plan can still resolve and restore access. Supplies, labor and route effects must be real state changes. This is an original example, not selected content, a second competing first proof or a claim that native routes already support these states.
5. **Choose time and aftermath deliberately.** For a small proof, use supported in-game time while ordinary foreground play advances. Independent occurrence does not automatically imply progress with the browser closed. Saved event history distinguishes what happened from what the player knows, and later dialogue/actions reflect committed results. Offline catch-up and unattended losses remain separate decisions under the existing contracts.

Present the known situation in the location description; expose relevant responses in the existing action menu; keep discovered causes, unresolved leads and outcomes in the journal; use the right-hand log for short notices. New knowledge can reveal more options gradually. Optional Hanzi presentation can depict this same state later, but none of these mechanics has a map prerequisite. The cost is authored causes, state/effect handlers, persistence and usable pacing, not additional map design.

## AI and independent agency

Keep tactical choices, long-term character decisions and event pacing distinct. A character may fight cautiously while pursuing an ambitious goal; an event director may create an eligible opportunity without rewriting that character's resources or memories.

Proposed first controller: at meaningful changes, evaluate legal actions against goals, accessible information, costs and risk; commit one bounded job; reconsider after its result or relevant new evidence. Authored priorities or utility scores are enough to test this. Shared rules make behavior coherent because an actor's plan changes when their means or knowledge change. Off-screen training is a paid job with an outcome, not free levels tied to the player's strength.

Goal planning is a later option. Jeff Orkin's [F.E.A.R. developer talk overview](https://gdcvault.com/play/1013282/Three-States-and-a-Plan) describes dynamic action planning and replanning. It supports considering goal-based AI, not an RPG-ready implementation or performance estimate. The [Generative Agents paper](https://arxiv.org/abs/2304.03442) studies memory, reflection and planning with LLM agents in a small social sandbox; it does not establish save-safe economy, combat or ownership behavior for YAIRPG.

Optional LLM use could include conversations, interpretations or proposed high-level plans. Feed only actor-accessible information; validate any command through ordinary game rules; save accepted intentions/results and meaningful generated text rather than regenerating them on reload. Provide a deterministic fallback and measure latency, cost and consistency before selecting a provider or mandatory dependency. No AI provider or running external agent is authorized by these design questions.

Characters can deceive, cooperate with rivals, disagree with the player, change loyalties or settle conflicts. An old enemy may retire or be outgrown. Adaptation follows witnessed evidence or investigation and spends available resources. The [enemy-protagonist and clone comparison](ENEMY_PROTAGONISTS.md#concurrent-characters-rogue-clones-and-alternate-modes) remains the owner of alternate-mode feasibility and independent-arc references.

## Persistence, legibility and open choices

Persist important actors, ownership, ongoing jobs, active evidence/claims and significant outcomes. Combat cleanup must not revive a story-dead actor. Travel, defeat, death, retirement, rebirth and rewind declare different retention rules. A dead character's apprentice or inherited obligation is a new actor/claim with provenance, not an unexplained return of the same enemy.

Keep summaries for closed arcs and distant actors. Any pruning must retain the ownership, closure and unique-reward facts needed to prevent duplication or renewed hostility; bounded prose history is not the authority for those invariants. Exact save fields need a schema/migration decision before implementation. Old saves default safely without granting titles, spawning previously claimed treasures or replaying event rewards.

Proposed UI: a character dossier shows known goals, observed equipment, titles and relationship evidence; the world journal summarizes discovered events and relevant deadlines; inventory/trait tooltips explain real effects and obligations. Unknown information stays unknown. Present information when it changes a decision rather than demanding daily management of every acquaintance.

Open choices are cast size/detail, event frequency/severity, world time during absence, defeat/death/retention policies, title effects and NPC consumption/loot rules. These do not need to be settled globally before a small original scene tests the model.

## First proposed proof

Use one recurring Village apprentice and one regional crossing disruption. The apprentice has a concrete expedition goal, a cautious trait, owned supplies and one pending preparation job. Storm damage occurs at a supported world-time boundary independently of a player action. A report reveals it and changes both actors' eligible plans.

The player can lend a kit, join preparation or contest the available work. The apprentice's supply use and response follow their means and knowledge. A cooperative resolution can earn a local recognition title; a contested one changes later trust or available help. The title's name, benefits, rates and story are proposals. This combines the current expedition with a small cast rather than selecting a second world or whole-population simulation.

Acceptance requires:

1. The same actor recurs in two scenes with consistent possessions, condition and remembered evidence.
2. One loan/transfer and one NPC consumption commit once; failed saving cannot publish partial ownership or rewards.
3. An independently occurring world event changes a later route or plan, with the same committed outcome after reload and supported time advancement.
4. One trait affects a choice and one earned title has an explained, observable consequence; uninformed observers do not acquire secret knowledge.
5. Mid-job save/reload, old-save defaults and closure preserve pending work, unique claims and aftermath in a rebuilt browser slice.

This gate is unperformed. Existing runtime tests and prior browser evidence do not validate this proposed gameplay.

## Giving enemies life: investigation, 2026-10-02

Scope comes from the delegated investigation brief from chat `01a0f94f-c762-7df2-9198-95d1190ed828`: inspect the saved ideas and current source, then prepare persistent enemies/peers with lives beyond one fight. This pass delivers findings and a packet, not gameplay. The [source audit and implementation packet](ENGINE_EXPANSION.md#persistent-peer-source-audit-and-implementation-packet-2026-10-02) owns bindings, schema, combat, clock and verification. Existing book comparisons remain inspiration with their recorded evidence limits; this example is original Village content.

The useful unit is a person who can remain recognizable while changing roles. Reappearing with the same name is insufficient if their possessions regenerate, their defeat disappears, or their next plan ignores what happened. Their life needs a few causally connected changes the player can discover and affect.

| Encounter class | Required continuity | Appropriate first treatment |
|---|---|---|
| Ordinary disposable monster | Template/species and ordinary renewable loot policy | Keep current generated wolf rats and routine combat; no personal history for every spawn |
| Episodic encounter | Stable encounter instance, selected participants/results and aftermath | Save one traveler, pack or incident through its scenes; archive a summary when its arc closes |
| Named actor | Identity/body, actual means, possessions, current condition, evidence, relationships, goal and closure | One registered native NPC with a durable actor extension; combat/dialogue refer to that same person |

Persistence is selective, not a requirement that every rat receive a childhood. An episodic survivor can later become named without replacing their original identity or issuing their possessions twice. A dead named actor can leave a successor, debt, corpse or memory; each has its own identity/owner and cause.

### Life outside encounters

| Activity | Cause and means | Later observable change |
|---|---|---|
| Training or research | Known deficiency, access to a method, paid inputs and elapsed work | An actual skill milestone, learned procedure or preparation option changes a later contest |
| Work and supplies | An available task, owned money/tools and committed output | A peer earns or spends money, packs a kit or lacks the resources for another plan |
| Injury and recovery | Recorded bodily condition, treatment/rest requirement and completion | They rest, refuse an unsafe job or return with a healed limitation |
| Rivalry and competing claims | A particular dispute and a shared scarce opening | One claimant wins; the other bargains, changes route, prepares or accepts the result |
| Cooperation and obligations | What was given/promised and who knows it | Help becomes available, a loan has a return condition, or an obligation is fulfilled |
| Affiliation changes | An offer, conflict, institutional requirement or loss of backing | Access, duties and informed relationships change without inventing free combat strength |
| Closure | Settlement, fulfilled goal, departure, retirement or supported death | The arc stops producing obsolete threats; a later unrelated dispute needs a new cause |

Development follows authored causes/resources/time. A rival can be outgrown; increasing the player's level alone never increases the rival's level. Later technological actors can develop gene-warrior faculties, cybernetics or synthetic bodies through local projects just as magical actors develop their own powers. Technology and magic do not specify a fixed ordering of personal strength. Body replacement, procedure knowledge and institutional recognition have separate retention rules.

Keep authoritative events separate from an NPC's interpretation and the player's discovered information. A witnessed defeat supports “I lost that contest”; it does not reveal a private copying eye or an unseen theft elsewhere. Reports require a sender, recipient and delivery cause. A belief may be mistaken; it must not alter the historical fact it describes. Lasting cause/claim/closure records survive the journal's 100-entry display limit.

### Smallest proposed Village proof

**Proposal, not selected or implemented:** one route apprentice, two encounters and one optional marker-work contract beside the existing crossing. Use a stable internal ID such as `frontier.apprentice`; the name, temperament, timings and rewards are reversible tuning. Their goal is to finish paid route work and earn a useful contact. They begin with limited personal money, one bread, native skill progress and an unarmed loadout. They have no secret knowledge of the player's powers.

This narrows the earlier apprentice/storm/title proof into a first actor increment. Meet the peer in Village after learning the crossing's anchor notes; earlier completed surveys stay completed. Keep storm damage, an earned title, loans, patron reports and affiliation changes as the next variants. A spontaneous storm needs a world-occurrence service; this first proof instead demonstrates an NPC taking a timed action while the player does ordinary supported activities.

| Player choice | Immediate commitment | Peer life and later payoff |
|---|---|---|
| Give a survey kit and cooperate | Transfer one real kit as a disclosed gift; peer reserves it for one marker job | Peer consumes it once, completes work and later offers one-use departure assistance; a tired-guide departure can take three rather than six minutes |
| Contest through a sanctioned spar | Explain nonlethal rules and stake; save one named encounter and the shared contract resolution | Winner earns the work claim; its payout requires the later kit-consuming job. After losing, the peer can recover and buy one balance-practice job; a later unstaked spar uses their actual improved native stats |
| Decline or accept the peer's claim | No player fee or surprise penalty; peer packs supplies only if affordable, then works | Peer can fulfill the job without the player. A later meeting explains their completed work; declining creates no compulsory feud |

The marker contract is a new optional claim, not a conversion of the existing `frontier.departure` or a replay of old survey rewards. First commitment reserves it globally. Cooperation assigns it to the peer; a contest reserves it for its participants until a result; declining yields it to the peer. There is no hidden race timer that confiscates the player's existing crossing progression.

Provisional concrete resource example for the packet: peer starts with ten personal coins, one Stale bread and thirty Equilibrium XP. Packing costs six personal coins/four game minutes. One recovery job consumes their bread/four minutes; a subsequent practice job costs two personal coins/eight minutes and grants twenty fixed Equilibrium XP. Reaching fifty total XP earns the native level-one Agility bonus. A completed marker job consumes one kit/three minutes and pays six coins to its actual claimant. A player contest win followed by the player's completed marker job pays the player; a cooperative/declined job pays the peer and never credits player Haggling or acquisition counters for the peer's own preparation. These amounts are proposals, not balance acceptance.

Use “winded” as the first authored spar condition, with rest before practice/work. A cautious peer with insufficient resources waits or closes the goal rather than receiving free supplies. After the later meeting, the player can settle the original dispute; closure cancels its pending retaliation/rematch prompts, while earned skill and spent resources remain. An optional unstaked rematch creates no second contract payout. Assistance is granted after the cooperative job, requires the living available peer, is consumed at departure commitment and cannot change a previously frozen departure result.

### Outcomes and readable consequences

| Outcome | Required distinction |
|---|---|
| Nonlethal defeat | Actor continues; authored fatigue/injury/rest applies; no corpse, death extraction or revive consumption |
| Retreat | Persist withdrawal, declared reserved costs and any claim outcome; unfinished fighting grants no kill reward |
| Surrender | Ends fighting with authored custody/terms; surrender does not automatically transfer every possession |
| Capture | Captor/custodian, location, escape/release conditions and retained ownership are explicit |
| Confirmed bodily death | Body stops acting; declared corpse/custody/loot and eligible continuation are resolved once |
| Eligible survival | An established source with real conditions and costs creates the declared continuation; the prior body and possessions are not duplicated |
| True death | A player run ends only under an eligible authored lethal threat with no valid continuation; a named NPC's permanent death closes their arc, not the player's run |

The first scene implements only its disclosed nonlethal spar, withdrawal, rest and settlement policies. The other rows constrain future handlers and synthetic validation fixtures; they are not promised gameplay. Follow [defeat/true-death direction](DIRECTION_SYNTHESIS.md#defeat-true-death-and-run-progression-clarified-2026-10-02): ordinary player defeats usually mean fainting/recovery. Specific zones, enemies, weapons, effects or authored events may support lethality, with preparation/protection/avoidance explained and any selected result saved once. Do not infer a lethal result from native `total_deaths`, or apply the player's recovery default to all creature/NPC kills. An anchor/revival explanation remains optional lore.

The known-character view should show the peer's observed loadout, disclosed goal, known recent changes, relationship cause and next available action. One concise summary can say: “After losing the spar, the apprentice rested and spent two coins practicing balance.” Display public outcomes and received reports; retain secrets in state without leaking them into the dossier. Arrival/amnesia can stay vague and later worlds can emerge gradually.

Developer evidence refreshed 2026-10-02: Chris Hoge/Monolith's [Nemesis session overview](https://www.gdcvault.com/play/1025150/Helping-Players-Hate-%28or-Love%29) discusses sustaining memorable positive and negative relationships. Jeff Orkin's [F.E.A.R. session overview](https://gdcvault.com/play/1013282/Three-States-and-a-Plan) describes action planning and replanning around changed circumstances. Only those overviews were read. Our inference is that recognized recurrence and causal decisions are useful targets; one authored priority policy is sufficient for this experiment. Neither source supplies this RPG's save, economy or controller implementation, and no AI provider is required.

**Next implementation action:** bind and hydrate this one NPC's personal inventory/skill totals and validated life/evidence records, with a migration that never reissues its endowment. Then execute the packet's remaining adapters. **Playable gate:** cooperate and contest in generated saves, meet the same changed person later, settle the dispute and reload through preparation/encounter/aftermath without rerolls, duplication or reopened closure. Build/browser gates remain unperformed.

## Open-world actions, reputation, law and karma, 2026-10-02

**Requested exploration; concrete rules and examples are original proposals.** [User vision](USER_VISION.md#open-world-actions-karma-and-reputation-2026-10-02) retains the request. The center menu stays primary: select a present known person, inspect supported interactions, then choose a legal game command. A command can be permitted by the game while forbidden by a local institution. Contextual freedom can deepen text menus without a spatial-world conversion.

### Actions and persistent outcomes

Support ordinary interaction and selected conflict verbs on the same actor: talk/trade, agreed challenge, threaten, attack, and separately authored aid, theft, capture, negotiation or recruitment. Availability follows presence, bodily state, means and the selected world's actual rules. A selected target is not an automatically hostile enemy. Inspection is pure; an attack revalidates participants, occupation, access and any actual protection. A guarded office can provide interception or a supported entry problem rather than an inexplicable plot immunity.

Distinguish an agreed spar, hostile assault, self-defense, sanctioned combat and an explicitly supported lethal attempt. An attack's outcome may be withdrawal, surrender, injury, capture, defeat or supported death. Intent is not the achieved result. A successful robbery transfers the actual specified possessions and leaves ownership/claim history; winning a fight does not automatically grant all goods, knowledge, bloodlines or titles. Existing ordinary player defeat remains fainting/recovery; eligible lethal threats need their own announced rules. The player's recovery default does not define every NPC's outcome.

### Five consequence layers

| Layer | What it means | Example effect |
|---|---|---|
| Personal relationship | What this person knows, feels and owes; use only exercised trust/fear/respect/grievance/debt dimensions | A defeated merchant fears the player but refuses another loan; respect does not erase betrayal |
| Audience reputation | A region, faction or institution's evaluation based on its values and received evidence | Rescuing a dissident helps one community and angers another; Village reputation does not grant foreign guild standing |
| Notoriety and recognition | How widely a deed or identity is known, distinct from approval | A feared fighter is recognized at a gate; a secret benefactor receives no public credit without disclosure |
| Law and enforcement | Jurisdiction-specific offenses, evidence, authority and active cases | A witnessed assault produces a report, wanted status, restitution demand or response by actual available guards |
| Karma, if the world supports it | An explicit spiritual/causal rule, or a nonmagical chronicle of conduct when used only descriptively | A broken vow creates a declared obligation; a soul law can detect a hidden act only through its actual authored faculty |

Keep reputation values, legal cases and lasting causes distinct. Faction approval does not prove innocence; a pardon can close prosecution while leaving the victim's grievance. A gift cannot mechanically erase an unrelated assault. Rivalry, fear, trust and affection need not sum into one goodness number. Track significant deeds with circumstances, cause and settlement; a world may derive its own karma effect from those facts rather than use a universal good/bad ladder.

Supernatural karma must specify what it detects, how it attributes responsibility, what consequence it can impose, who can perceive it, and how release/transfer/restitution works. It is not automatically luck, reputation, an always-present cosmic judge or a moral verdict shared by all worlds. A technological setting can have local legal/social consequences while a selected spiritual setting adds its own karmic mechanism. Ordinary moral ambiguity remains possible without an alignment meter.

### Information and aftermath

Preserve occurrence → observation/identification → report/belief → response → settlement. A victim can know they were attacked without recognizing a disguised attacker. A witness must have access to observe; a report needs a sender, recipient and delivery rule. Initially use a few authored witness groups, not a universal rumor simulation. Existing observers do not know private powers or distant events simply because the save contains them. Specific divination or surveillance can supply a separate evidence route.

Responses follow means, motives and context: seek help, flee, treat an injury, refuse service, demand compensation, retaliate, reconcile, change affiliation or close the dispute. A remote case changes when its audience receives information. Opposition can organize within its actual resources; it does not automatically scale to match the player's level. A powerful character can overwhelm enforcement, while changed cooperation, access or commitments remain real outcomes. Support coherent outlaw, mercenary, secretive or protective paths with alternate contacts/services where selected; freely chosen hostility is not a mandatory campaign-ending punishment.

A missing or dead actor's service, teaching, loans, contracts and possessions need explicit aftermath. A successor or alternate contact exists only through authored world development; neither reload nor returning to the location resurrects the actor or replenishes unique possessions. Essential progression needs an alternative or an explicitly previewed closure policy. Surrender and escape retain unfinished claims; reconciliation closes its own causes without deleting history. Unique rewards and recognition resolve once, including after the displayed history is pruned.

### Optional bounded comparison

Introduce one optional traveler/peer, one local witness group and one report recipient. Compare an agreed spar, a witnessed unprovoked assault, and a private assault whose later identification requires an actual report/evidence route. Show the target's remembered outcome, the informed audience's response, actual possessions, and one changed service or encounter. One restitution/negotiation route closes the relevant case while retaining the historical deed. This is a design comparison, not a selected cast, lethal policy, karma formula or implementation order.

[Runtime requirements](ENGINE_EXPANSION.md#open-world-action-and-consequence-contracts-2026-10-02) own integration. Native regional reputation already affects pricing/access; arbitrary player-initiated NPC attack, durable case/witness propagation and karma are not implemented by this pass. Keep the existing playable review and one-realm/one-prestige milestone.

## Hidden strength, combat profiles and threat estimates, 2026-10-02

**Hidden-strength concept endorsed; bounded elder gameplay now implemented and browser verified.** See [Chronicle runtime](ENGINE_EXPANSION.md#chronicle-runtime-increment-2026-10-02) for actual limits; the broader profile/actor proposal below remains distinct. [User vision](USER_VISION.md#scoping-the-endorsed-hidden-strength-concept-2026-10-02) records the latest request. [The bounded prototype scope](ENGINE_EXPANSION.md#village-elder-hidden-strength-prototype-scope-2026-10-02) uses the existing `villageElder` as the proposed first content binding. Specific backstory, numerical build, counter rules and prices remain reversible proposals. This refines open-world actions and functional actor powers; it does not select a universal rank ladder or make every NPC secretly powerful.

Every supported attackable person needs enough real stats, equipment, techniques, faculties and conditions to resolve their encounter. Important actors keep detailed persistent profiles; ordinary people can use simpler consistent templates. Distant background populations need not run full character sheets or continuous combat simulations. A displayed level or rank is a local progression measure; estimated threat depends on the actual matchup, terrain, knowledge, preparation and objective. An aggregate estimate never replaces execution rules or maps every world's rank to one number.

Keep three things separate: actual capabilities, deliberately exposed behavior, and each observer's estimate/beliefs. A chief could be an ordinary administrator with guards, a practiced veteran, or a concealing retired master. Public authority and personal combat strength are independent. Hidden means are authored or generated once at the actor's initialization and retained, including costs and restrictions; attacking does not reroll them or increase them to defeat the player. Revealing a source changes disclosure or activates an actually owned faculty under its rules. A justified transformation or emergency artifact pays its real cost and can be exhausted.

### Five design considerations

1. **Believable variety:** mundane people, specialists and rare exceptional individuals coexist. Secret strength can have a history and motive; it is not the default explanation for every protected service character. Guards, wards and political backing are separate participants/resources, not folded into an inflated personal level.
2. **Clues and appraisal:** observed balance, an old scar, a demonstrated response, local testimony or an authored sensing faculty can support partial estimates. Rumors can be wrong. Show Unknown or an evidence-based range when appropriate; a concealed signal is not proof of weakness. Insight/appraisal has a specific disclosure scope and never supplies omniscience.
3. **Legible escalation:** the chief might evade, restrain, call guards, surrender, retreat or reveal a practiced technique according to actual motive and means. Where supported, a response creates a chance to stop, bargain or reassess. No universal mercy rule or automatic lethal punishment is selected; lethal risk follows existing eligible-threat policy. Demonstrations, protection events and teaching can reveal strength without requiring an attack.
4. **Discoveries change later plans:** retain witnessed technique/source evidence, provisional estimates, the actor's memory and changed access. Observation does not grant the actor's unique faculty. Show a recognizable reveal and supported action/effect, not only a dialogue assertion that the opponent is powerful.
5. **Progression stays real:** a later stronger player can defeat the same chief if actual capabilities permit it. Injury, fuel, body limits, compatible counters or an absent guard can matter when modeled. Old opponents do not gain automatic player-relative levels, surprise immunity or regenerated unique resources. Victory, retreat and restraint settle distinct aftermath once.

Original example informing the endorsed scope: an apparently ordinary chief stops a novice's wrist with a practiced movement, offers a supported withdrawal, and leaves a movement observation plus personal distrust if witnessed. An earlier scene or manual margin note could foreshadow the method. Later training or a compatible counter changes the same encounter. Restraint, observation reward and a teaching route require actual supported handlers; the concept is now endorsed for scoping, while concrete lore and balance remain provisional. The result must follow the actual supported encounter rather than a forced-loss script.

[Runtime refinement](ENGINE_EXPANSION.md#actor-profiles-and-hidden-strength-contracts-2026-10-02) owns integration. The current fork supplies native Person/NPC components but has no authored hidden-chief profile or general threat-appraisal/attack system. Current playable review and the first milestone remain in place.

## Village elder prototype direction, 2026-10-02

The user endorsed the hidden-strength concept and asked to scope it with existing systems. Proposed first content: the already registered Village elder, optional inspection/challenge/provocation through the retained center menu, one practiced nonlethal restraint/counter, and remembered observation/relationship aftermath. Early base quest dialogue remains usable. His first build is fixed independently of the player; later progression can win the supported contest. A retired martial background and tea joke are original reversible writing proposals, not upstream lore claims.

[Implementation scope](ENGINE_EXPANSION.md#village-elder-hidden-strength-prototype-scope-2026-10-02) owns the source bindings, five work packages, schema/clock decisions and acceptance. This selects a bounded scoping candidate, not full NPC aggression, lethal attacks, automatic population scaling, global appraisal or cosmic karma. Existing research variants and playable human-review gates remain available.

## Favorability and encounter-driven follow-ups, 2026-10-02

**Requested exploration; examples remain proposals.** [Engine owner](ENGINE_EXPANSION.md#encounter-driven-scenes-and-relationship-conditions-2026-10-02) supplies structured causes, directed relationship memory, conditional definitions, saved scenes and atomic aftermath. This extends existing interactions and the endorsed elder scope.

Favorability can summarize how a particular person currently responds to the player, but important scenes can ask about actual trust, respect, fear, affection, grievance or debt. Keep only dimensions the scene uses. A rival may respect a victory and resent humiliation; a friend may like the player while refusing to entrust a secret. A faction's public reputation and the person's private relationship remain separate. Their values and available evidence determine what changes; NPCs do not automatically know every player action.

A scripted event can branch on encounter intent/outcome, observed behavior, relevant competence/knowledge, kept promises, current means and whether someone is present. Courtesy after an agreed loss could produce a debrief; an assault could instead lead to a demand for settlement. Later trust and observed method evidence might enable one lesson. Give scene-specific leads, not a compulsory exact-number guessing game. A condition changing while an invitation is queued follows that event's explicit policy.

Memories retain significant causes rather than every greeting. Repeat interaction has an explicit renewal/cooldown policy; a fulfilled obligation cannot pay again and repeated gifts cannot endlessly erase unrelated grievances. Quiet time and refusal can remain valid. Higher favorability is not consent to every request, proof of moral goodness or ownership of another person's possessions/techniques.

Conversations and reactions appear through the retained center menu at supported boundaries. Some offers can wait; a genuinely time-sensitive opportunity declares its simulated deadline. Independent actor/world changes and player-required decisions use different presentation/stop rules. This exploration does not select real-world deadlines or unattended irreversible choices.

This refines the elder aftermath candidate without selecting every branch, a romance mode or universal social formulas. Current playable acceptance and the first milestone remain in place; new scripted-scene integration is unimplemented.

## Chronicle relationships, inheritance and meaningful time delivered, 2026-10-02

The latest request authorizes implementation. The elder scene now remembers a courteous challenge, assault, settlement or kept promise differently. Future valid relationship axes/ties are preserved without declaring one universal favorability meter; current succession follows a concrete fulfilled obligation and unresolved-grievance rule. The cartographer, archive and later elder offers have announced game dates. Missing a window creates a later local report without awarding a missed lesson or manual.

The player can enroll a new age record now and choose open or mortal lifespan policy. It does not infer lost-memory ancestry or retroactively age an old save. Mortal old age ends this selected life once; export and an explicit native reset are available, while offspring/body continuity and whole-world regression remain future designs. Ordinary defeat retains native fainting. These are original prototype rules, with deadline/price/lifespan/fiction acceptance pending. [Runtime policy](../PROJECT.md#implemented-chronicle-and-time-policy-2026-10-02) is the owner, not a second age formula here.

## Bookshelf histories, institutions and collaborators, 2026-10-03

[Histories and independent people](BOOKSHELF_INSPIRATION.md#2-histories-beliefs-recognition-and-independent-characters) owns the full shelf-derived notes on reports versus observations, former-history memories versus current conduct, forecasts versus occurrences, actual builds versus reputation and counterpart similarity versus identity. B04's publication-platform premise is a bounded source for conflicting remembered history; the game's truth, claim and discovery rules remain original proposals. [Scenario B](BOOKSHELF_INSPIRATION.md#b-a-visitor-remembers-a-promise-you-have-not-made) defines a visitor, an investigable mismatch and changed later cooperation without requiring a global rewind.

[Institutional roles](BOOKSHELF_INSPIRATION.md#3-institutions-professions-and-social-power) and [Scenario C](BOOKSHELF_INSPIRATION.md#c-two-useful-ways-into-an-institution) connect practical competence, instruction, facilities, authority and funding to specific access and obligations. Private knowledge does not instantly become public reputation. Useful teachers and helpful institutions remain valid choices; no universal betrayal or elite-relative escalation is selected.

[Collaborators and growing places](BOOKSHELF_INSPIRATION.md#4-collaborators-multiple-selves-and-growing-places) distinguishes hires, students, summons/constructs, copies and domains. [Scenario D](BOOKSHELF_INSPIRATION.md#d-a-project-that-needs-two-different-specialists) uses a few durable specialists, their actual means and one useful staged project. Independent goals, legal commands, supported availability, causal memories and output ownership stay with the existing character/work owners. Shared clone consciousness, a whole population and native party combat remain separate engineering scope.

The [detail map](IDEA_INDEX.md#bookshelf-detail-map-2026-10-03) routes these elaborations; no new character roster, relationship formula, lethal/offline policy or gameplay delivery is claimed by saving them.
