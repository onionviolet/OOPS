# Rivals, identities and stolen destiny: future gameplay audit

Date: 2026-10-01, America/New_York. Status: requested research completed for this pass; mechanics below are original proposals for future selection. No new enemies, NPC persistence, theft, fate or rivalry gameplay is implemented. This is a broad, expandable inventory, not an exhaustive list of fiction or an accepted feature checklist.

[PROJECT.md](../PROJECT.md) owns accepted direction and runtime status. [User vision](USER_VISION.md) owns request provenance. This dossier extends [run-defining advantages](RUN_DEFINING_ADVANTAGES.md) and uses the proposed boundaries in [engine expansion](ENGINE_EXPANSION.md). It preserves the current base-adventure direction and the first expansion milestone of one realm and one prestige layer.

The requested follow-up, [Enemy protagonists](ENEMY_PROTAGONISTS.md), examines independent NPC progression, five book comparisons, changed forecasts, relationships and inherited duties. It adds eight arc patterns and three worked scenarios without duplicating this dossier's broader identity/theft catalogue or selecting a runtime implementation.

## Main design finding

Treat a recurring opponent as a person with capabilities, claims, relationships and a history. A young master's important power may be his patron; a chosen one's may be a future opportunity; an impostor's may be what other people believe. These require different solutions even when their combat stats match.

Five reusable parts can support much of the catalogue: a persistent actor, layered identity claims, relationships with evidence, opportunities with ownership rules, and committed aftermath. A trope supplies initial circumstances and likely behavior. It does not dictate permanent hostility or a single ending. Enemies, peers, allies, mentors and the player can use the same identity rules.

The desired loop is **discover a person and their leverage → prepare or scheme → contest something specific → resolve it → encounter the consequences**. Idle preparation supports the loop. Rivals can act and discover information through authored outside events; the player chooses their own new commitments and responses. Disclosure, consequences and automatic actions need declared rules. The earlier blanket player-choice requirement is preserved in PROTOTYPE_HISTORY.md.

## Evidence and interpretation boundaries

Sources checked on 2026-10-01. Only the bounded observations in this table are attributed to them. The taxonomy, numbers, scenarios and rules elsewhere are our inventions unless a passage explicitly says otherwise.

| Reference | Verified observation | Useful design question and source limit |
|---|---|---|
| *I Shall Seal the Heavens*, Er Gen, Wuxiaworld [chapter 23](https://www.wuxiaworld.com/novel/i-shall-seal-the-heavens/issth-book-1-chapter-23) and [chapter 35](https://www.wuxiaworld.com/novel/i-shall-seal-the-heavens/issth-book-1-chapter-35) | Wang Tengfei combines talent, status, clan backing and a pursued inheritance. Defeat produces humiliation and a departure with powerful clan connections | Model personal defeat separately from social standing and lost opportunity. These chapters do not establish a universal chosen-one shield, automatic revenge chain or luck-theft rule |
| *I Am the Fated Villain*, Tianmingfanpai/faloo and HuiShu animation, [licensed Tappytoon adaptation](https://www.tappytoon.com/en/book/i-am-the-fated-villain) | The official synopsis describes Gu Changge's system absorbing luck and abilities from defeated protagonists | A villain origin can change acquisition and objectives. The synopsis does not verify exact thresholds, harvesting sequences, all novel exceptions or identity replacement |
| *Renegade Immortal*, Er Gen, Wuxiaworld [chapter 425 preview](https://www.wuxiaworld.com/novel/renegade-immortal/rge-chapter-425) | Du Tian recognizes apparent possession and attempts to intervene | Separate body, apparent behavior and controlling consciousness. The preview does not establish complete possession mechanics, success probabilities or transferred memories |
| Wuxiaworld [general glossary](https://www.wuxiaworld.com/page/general-glossary-of-terms) and [terms of address](https://www.wuxiaworld.com/page/wuxia-xianxia-terms-of-address) | Clan, sect, master-disciple ties and seniority are distinct social structures; cultivation vocabulary includes roots, internal demons and tribulations | Distinguish kinship, apprenticeship, office and ability. Terminology varies between books; the glossary is not a universal fictional ruleset |
| Chris Hoge, Monolith, GDC 2018, [Helping Players Hate (or Love) Their Nemesis](https://www.gdcvault.com/play/1025150/Helping-Players-Hate-%28or-Love%29) | The session overview identifies memorable, long-term positive and negative relationships with procedurally created Orcs as a design goal | Recurrence and emotional recognition matter more than endless stat inflation. This pass read the overview, not the full talk, slides, code or internal algorithms |
| Paradox, [Crusader Kings III: Friends & Foes](https://www.paradoxinteractive.com/games/crusader-kings-iii/add-ons/crusader-kings-iii-friends-and-foes) | The publisher describes character memories, personal rivals and grudges between noble houses across generations | Individual friendship can coexist with family conflict. This is feature evidence, not a playtest of its balance or a verified implementation algorithm |
| Massive Damage / Raw Fury, [Star Renegades developer store description](https://store.steampowered.com/app/651670/Star_Renegades/) | An adversary system has enemy officers that evolve and move through ranks | A recurring-adversary structure can fit a mission-based RPG. No claim of implementation equivalence, legal clearance or reproduced behavior follows |

Specific-book audit candidates: *Reverend Insanity* for luck, theft, disguise and conflicting interests; *Lord of Mysteries* for identity, impersonation and role performance. Existing [alternative-power research](RESEARCH_ALTERNATIVE_POWER.md) records relevant evidence and edition limits. Exact later rules are not newly verified here. Locate an authenticated chapter before using one as a direct adaptation rule. No favorite-book selection is inferred.

Subsequent evidence in [Enemy protagonists](ENEMY_PROTAGONISTS.md#five-books-to-discuss-in-detail) includes *Reverend Insanity*'s official opening and *Lord of Mysteries*'s opening identity memories plus one later Amon theft/prohibition preview. This resolves those bounded reference questions; complete luck transfer, impersonation, parasitism and later exceptions remain unaudited.

## What the current YAIRPG source can actually support

The table below is the historical v0.5 source inspection, not the current v0.6 file layout or a new browser playtest. [Engine readiness, 2026-10-02](ENGINE_EXPANSION.md#engine-readiness-audit-2026-10-02) owns the refreshed source/test assessment. Native NPC dialogue/action/trader state exists in v0.6; durable story life, rival memories/goals and an encounter-result bridge remain future work.

| Inspected source | Present behavior | Reuse and missing work |
|---|---|---|
| `src/enemies.js`, `Enemy` | Templates have stats, loot, tags, descriptions and hit/damage/death callbacks. `rank` is explicitly for bestiary ordering | Reuse combat forms and authored abilities. Tags are classifications, not relationships; rank is not a social office. Persistent actor identity, intentions and memories are absent from this class |
| `src/locations.js`, `Combat_zone.get_next_enemies` | Generates fresh Enemy objects from templates, optionally with random stat variation | Regular monsters can remain disposable. A named rival needs an actor-to-encounter adapter; repeatedly generating a template does not preserve the same person |
| `src/main.js`, `set_new_combat`, `do_character_combat_action`, `kill_enemy` | Combat accepts a supplied enemy list; lethal damage invokes a death callback, grants XP/loot and emits kill events; bestiary counts use names | Reuse explicit encounters, but distinguish kill, surrender, escape, capture and sparring. Do not award permanent theft on every template kill or label a nonlethal duel as murder |
| `src/main.js`, enemy callbacks | Calls such as `target.on_death(character)` supply the player; callbacks can have method receiver/closure context, but there is no explicit persisted encounter-result object | Do not put chain-wide ownership, witnesses and payouts into incidental combat callbacks. Resolve new named encounters once with actor IDs, outcome and cause |
| `src/main.js`, `kill_player` | Combat defeat causes loss of consciousness, relocation and recovery | Defeat currently is not a journey ending or automatic rival promotion. Any capture, humiliation or theft aftermath must be separately authored and explained |
| `src/person.js`, `src/reputation.js` | Person has inventory and basic personal data; reputation updates integer regional values | Neither is a persistent NPC social simulation. Regional reputation alone cannot express trust, fear, debts, suspicion, patronage or belief about aliases |
| `src/quests.js`, `src/dialogues.js`, `src/actions.js` | Authored tasks, dialogue state, requirements and chance-based actions exist | Useful presentation and legacy adapters. A general relationship graph, fate market and reversible feud chain are new work |
| `src/rules.js` | Pure all/any/not fact checks, graded outcomes and resolve-once receipts | Useful precursor for eligibility and aftermath. It does not collect evidence, move resources atomically, persist RNG or connect itself to the save envelope |
| `src/main.js`, `create_save` and `load` | Saves character progress, quests, reputation and kill counts. Load explicitly notes current enemies are not saved | Add a versioned extension for persistent actors, claims, opportunities and receipts. Mid-encounter persistence and unsupported-schema preservation require an explicit design |

Practical conclusion: this foundation is suitable for an authored recurring rival and a bounded opportunity dispute. A simulated society of hundreds of scheming actors, arbitrary body swapping and whole-campaign fate rewrites would be substantial new systems. Start with real content and extract shared rules when needed.

## Enemy and peer archetype catalogue

All 35 entries are original gameplay interpretations. Labels may overlap on one actor. Gender, temperament and ally/enemy role are independent of the label. A saintess, merchant, mentor or underdog should have their own goals and choices, rather than exist as a reward for someone else's arc.

### Institutional power and face

| Archetype | Distinct pressure | Response beyond superior damage | Possible recurring consequence |
|---|---|---|---|
| Pampered young master | Wealth, retainers and confidence that his claim will prevail | Establish who owns the disputed goods; choose a public duel, restitution or patron negotiation | A private loss produces a different response from public humiliation |
| Competent clan heir | Real skill plus responsibility for family assets | Offer a trade, rival expedition or joint defense | Respect can create a peer; resource competition can survive personal friendship |
| Sect holy son / saintess | Institutional investment and a contested succession position | Compete for qualification or expose conflicting duties | Losing a trial need not remove the office; patrons may disagree about replacement |
| Inner-disciple gatekeeper | Controls access to instruction or trials | Earn a recognized credential, take an independent route or investigate favoritism | Becomes a sponsor, displaced rival or resentful administrator |
| Elder's favored disciple | Protection tied to a particular mentor's interests | Challenge the disciple under agreed rules or persuade the mentor | Protection weakens if the disciple violates the mentor's priorities |
| Clan patriarch / ancestor proxy | Family survival, prestige and scarce intervention power | Settle the claim, secure neutral mediation or threaten a relevant interest | An ancestor may intervene through one agent instead of appearing as a bigger boss |
| Guild examiner / alchemy authority | Professional legitimacy and control of supply | Demonstrate craft skill, audit an accusation or find another supplier | Certification creates access and obligations; fraud can damage both sides |

### Protagonist and destiny patterns

| Archetype | Distinct pressure | Response beyond superior damage | Possible recurring consequence |
|---|---|---|---|
| Heaven's favored chosen | Access to unusual opportunities and recoveries | Investigate the source of protection; contest a named opportunity | Losing one anchor changes a route, not automatically every stat |
| Humiliated underdog | Rapid growth after exclusion or loss | Help, compete fairly, recruit or steal an opening | The player can create the avenger by causing the original wrong |
| Regressor | Knowledge of future opportunities and disasters | Change the sequence or introduce genuinely new information | Past knowledge becomes unreliable where events diverge |
| Transmigrator | Outside knowledge and unfamiliar assumptions | Negotiate information, detect inconsistencies or race to apply an idea | Knows theory but may lack local materials, legitimacy or practiced skill |
| System bearer | Objectives, rewards and constraints from an external mechanism | Discover its actual contract, cooperate or disrupt one objective | Mission incentives can oppose personal loyalty; powers need not disappear on defeat |
| Reincarnated expert | Old expertise with a weaker current body | Exploit resource or recovery limits; negotiate teaching | Old allies may recognize the soul while new institutions recognize the body |
| Vengeful destined hero | An explicit grievance and allies sympathetic to it | Repair the cause, dispute evidence or accept a decisive confrontation | Compensation may settle the debt while mistrust remains |

### Concealed power and dangerous methods

| Archetype | Distinct pressure | Response beyond superior damage | Possible recurring consequence |
|---|---|---|---|
| Hidden mentor in a relic | Advises or lends limited power to a host | Separate host interests from mentor demands | Mentor allegiance, release or depletion changes the host's choices |
| Soul possessor | Attempts to control a body or identity | Detect a signature mismatch, defend the soul or interrupt the ritual | Rescue, coexistence and replacement are different outcomes |
| Demonic / devouring cultivator | Acquires strength through victims or consumed capabilities | Cut off supply, prepare a counter or bargain over a specific target | Public exposure changes access even when raw strength stays high |
| Cursed-technique prodigy | Great power with a concrete failure mode | Diagnose or exploit the method, offer treatment | A cured rival may become stronger but grateful |
| Clone / puppet operator | A defeated body may be expendable | Trace the controller or isolate the communication link | Body destruction differs from controller death; loot belongs to a defined owner |
| Sealed old monster | Enormous latent power with restrictions | Renew, change or deliberately break the seal | The freed being has commitments and motives beyond attacking the player |
| Rival villain / destiny hunter | Competes for protagonists, opportunities and secrecy | Mislead, bargain, form a temporary pact or expose their scheme | They can take opportunities the player neglected and become a recurring competitor |

### Ordinary people with consequential leverage

| Archetype | Distinct pressure | Response beyond superior damage | Possible recurring consequence |
|---|---|---|---|
| Righteous investigator | Pursues evidence, including the player's misconduct | Provide proof, hide traces, redirect suspicion or make restitution | Jurisdictions and witnesses matter; goodness does not imply gullibility |
| Paid assassin / bounty hunter | Payment, professional standards and a specific contract | Buy out, reveal false grounds or evade the disclosed pursuit | Contract ends, changes sponsor or creates a personal grievance |
| Merchant monopolist | Controls supplies, credit or information | Create an alternate chain, ally with a supplier or expose cheating | Economic competition changes available preparation, not just prices |
| Informant / rumor broker | Sells beliefs that may be incomplete or false | Check provenance, plant evidence or protect a source | A false rumor can outlive its correction in another faction |
| Betrayed former ally | Knows habits and has a concrete personal grievance | Reconcile, compensate, change methods or face them | Shared history makes prediction plausible without universal counter immunity |
| Ambitious peer / fellow crafter | Competes for recognition, commissions or scarce instruction | Specialize, collaborate or contest a professional challenge | Rivalry can generate joint progress rather than mandatory violence |
| Opportunistic scavenger | Benefits when others fight or leave resources unattended | Secure claims, hire them or negotiate salvage | Recovery creates debt, resentment or a reliable partner |

### Nonhuman and world-specific identities

| Archetype | Distinct pressure | Response beyond superior damage | Possible recurring consequence |
|---|---|---|---|
| Beast monarch / territorial guardian | Protects habitat, offspring or a resource cycle | Change route, offer resources or solve the ecological conflict | Permission or hostility is local to territory and remembered actions |
| Spirit / oath creditor | Enforces a particular promise or unpaid obligation | Fulfil, renegotiate, transfer or contest the debt | A title may grant power while binding conduct |
| Sentient weapon / artifact heir | Chooses users and remembers treatment | Prove affinity, negotiate purpose or rebuild a bond | Possession of the item need not imply obedience or rightful succession |
| Divine avatar / church champion | Delegated authority and a patron's objective | Contest doctrine, cut an anchor or fulfil a competing mandate | Defeating the avatar does not automatically kill the deity |
| Engineered hunter / institutional AI | Recognition systems, protocols and replaceable bodies | Spoof a credential, exploit a rule or obtain authorization | Identity credentials matter more than cultivation rank in this world |
| Dream double / heart-demon reflection | Exploits memories, unresolved commitments or a copied self-image | Identify the rule, change the relevant commitment or escape the domain | Resolving a fear can alter access or technique stability |
| World steward / fate administrator | Protects a world-level process or succession contract | Demonstrate eligibility, challenge a rule or replace a broken function | Late-game conflict can concern who owns a role rather than another health bar |

## Young-master chains as branching conflicts

The familiar chain is useful when escalation follows interests: heir → retainers or senior sibling → patron or elder → clan authority. It becomes repetitive if each defeat automatically summons the next stronger relative.

Original example: a caravan heir accuses the player of taking a sealed cargo lot. What actually happened, who saw it, the heir's private motive and the clan's commercial interest are separate facts. A mistaken accusation, stolen shipment and deliberate framing should not all resolve identically.

| Player route | Immediate result | Later branch |
|---|---|---|
| Prove lawful ownership through an invoice and witness | Cargo released; heir can save face | A family auditor investigates the corrupt quartermaster |
| Win a sanctioned nonlethal duel | The disputed concession transfers under agreed terms | The heir may respect the player; breaking the agreement creates a distinct grievance |
| Settle privately or repay actual damage | Local claim closes, with a cost | No public humiliation is broadcast; a debt or contact can remain |
| Humiliate the heir and seize the cargo | Gain goods and notoriety | Witnessed misconduct gives patrons a reason and evidence to intervene |
| Rescue the heir during a competing ambush | Create gratitude without automatically resolving ownership | Cooperation, repayment or conflicted loyalty can become available |

Each escalation needs a report, a concerned actor, means to intervene and a reason worth its cost. An elder may refuse a petty request, demand arbitration, cut the heir's allowance, hire a hunter or seek a deal. A family can protect its heir while disagreeing with them. Public face, private anger, formal standing and economic damage are distinct consequences.

Content guardrail proposal: one local dispute starts with a small authored cast and a finite set of escalation stages. A settled grievance stops generating interventions unless a new recorded action reopens it. Higher-realm relatives do not teleport in without a world-access rule. Cross-realm backing is a later possibility, not part of the first ordinary event.

## What “chosen” and “identity” actually mean

Separate **recognized status**, **actual talent** and **metaphysical favor**. A sect's best disciple need not have fate protection. A fortunate wanderer need not be recognized. A publicly celebrated fraud can have status without either talent or favor. This gives the player distinct investigative and political strategies.

Identity is a stack of claims and capabilities rather than a single enum:

| Layer | What it can change | Acquisition or transfer distinction |
|---|---|---|
| Stable actor identity | History and references to the same person | Never replace the internal actor ID just because their display name changes |
| Appearance / alias | Who a casual observer thinks they are seeing | Disguise can copy appearance without copying memories, rights or powers |
| Profession / credential | Services, examinations and authorized actions | A forged badge, genuine qualification and stolen certificate are different claims |
| Office / succession title | Institutional resources and authority | Transfer requires a defined appointing authority, contest or succession rule |
| Faction / lineage affiliation | Patrons, duties and inherited claims | Membership, blood relationship and public recognition need not agree |
| Public legend / reputation | Expectations and treatment within an audience | Fame belongs to what a community believes; distant communities can know something else |
| Moral or political label | Investigations, sanctuary, enemies and allies | “Villain,” “hero” and “traitor” can be competing judgments, not omniscient alignment |
| Body / constitution / bloodline | Physical capacities and compatibility | Copying an appearance does not create a transplant; transplanting a trait does not grant a clan office |
| Soul / true name / controller | Possession, soul-bound artifacts and recognition | A body swap must say which memories, inventory rights and bindings follow each owner |
| Fate / mandate / narrative role | Eligibility for a named opportunity or succession | Taking a destined role may require a ritual, vacancy or transfer, not merely lower luck |

Social identities can stack and conflict: a healer can be a clan heir, a secret impostor and a hunted heretic. Use compatibility rules only where the fiction needs them. Do not invent a universal one-identity slot or make every title another permanent stat multiplier.

Belief belongs to an observer and an evidence source. “The examiner trusts this badge,” “the examiner suspects the face,” and “the soul ward confirms the signature” can coexist. A hidden theft does not lower every faction's opinion automatically. For a first scene, use authored witness groups rather than simulating universal rumor propagation.

## Villain-MC routes and what can actually be stolen

A villain origin should change what the player can pursue. A villain reputation is a social consequence. Cruel actions are choices. These can coexist, but accepting one does not select a compulsory sequence of atrocities or a single story ending. Other actors retain their own ambitions, consent to alliances and ability to refuse bargains.

| Route family | Primary loop | Distinct challenge |
|---|---|---|
| Destiny predator | Discover a favored actor, undermine or contest a specific protection, claim a reward | Decide when a target is vulnerable and what remains after one opportunity is lost |
| Public benefactor / secret schemer | Earn legitimacy while preparing concealed appropriation | Manage witnesses, evidence and contradictory commitments |
| Impostor / usurper | Learn a role, establish a cover, pass challenges and redirect its resources | Sustain the identity against people and systems with different recognition methods |
| Devourer / collector | Acquire compatible capabilities, select an application and integrate them | Capacity, incompatible methods and missing comprehension can matter without erasing the power fantasy |
| Sect patron / mastermind | Invest in peers, choose beneficiaries and redirect institutions | Control differs from loyalty; sponsorship creates benefits and obligations |
| Antihero / destiny liberator | Break an imposed mandate or reclaim stolen opportunity | The rightful claimant, beneficiary and world process may have conflicting interests |

### Theft and appropriation catalogue

These are separate operations. Defeating someone is a possible precondition, not a universal ownership-transfer event.

| Target | Concrete gameplay | What must remain separate |
|---|---|---|
| Treasure / material | Find, rob, salvage, purchase or win the object | Possession, rightful ownership, theft evidence and a soul binding |
| Opportunity | Reach a shrine, audition or mentor before a competitor | Available opening, qualifying conditions and eligibility to claim it |
| Fortune reserve | Transfer a finite amount of a defined fate resource | Reserve, maximum capacity, renewal and the events it can influence |
| Fate connection | Redirect a bond to a treasure, patron or prophecy | A bond is not the same thing as probability or social friendship |
| Protective anchor | Break or appropriate one recovery, ward or intervention | Exhausting a protection does not automatically grant it to the attacker |
| Technique / ability | Learn from a manual, imitate, copy or absorb a selected effect | Access, comprehension, practice, fuel and bodily compatibility |
| Aptitude / constitution | Perform a specific graft, extraction or transformation | Trait ownership, integration, recovery and lineage recognition |
| Memory / knowledge | Extract an account, read a memory or inherit expertise | Remembering an action differs from having its practiced skill; evidence can be unreliable |
| Appearance / social cover | Adopt an alias and supporting credentials | Resemblance, trusted recognition, legal authority and the real actor's existence |
| Office / title / inheritance | Win succession, forge recognition or depose the holder | The office's authority and obligations, not just its item rewards |
| Merit / acclaim | Take credit for a rescue, discovery or commission | What happened, who believes the claim and whether proof can correct it |
| Soul / body | Possess, exchange or temporarily control a defined body | Controller, original occupant, memory, equipment and soul-bound rights |
| System access / contract | Steal a key, inherit a vacancy or renegotiate a patron bond | The external mechanism can reject the new claimant; an interface is not its entire power source |

Declare whether each operation **copies**, **moves**, **leases**, **shares**, **destroys**, **redirects** or **exposes** the target. A move removes it from the donor; a copy does not. Neither should occur accidentally because both sides reference the same mutable object. Donor, recipient, target, quantity, compatibility and recovery policy belong in one committed result.

### Luck and fate as gameplay, not one global multiplier

Use fortune only on explicitly supported events. Ordinary drops, opportunity discovery, escape, breakthrough risk and encounter selection are different scopes. A character's social credibility and metaphysical fortune should not secretly be the same number. Otherworldly fortune needs a declared compatibility rule before it influences a technological world's access control. Scoped fortune is the default; a simple flat luck multiplier (a 100x cheat) remains a dial.

Two useful models remain open. **Reserve luck** permits a visible spend or transfer that alters a supported distribution. **Anchored fate** links a character to specific openings, protections or milestones. Either can be powerful; selecting both immediately would make the first slice harder to explain and verify.

Original numeric illustration, not proposed balance: a shrine attempt has success / setback odds of 40% / 60%. Spending a qualifying fortune charge might produce 55% / 45%, with the charge consumed once at commitment. Gaining luck changes future unresolved supported events. It cannot retroactively change an already committed result. A forecast must distinguish known odds from uncertainty caused by an undiscovered protection.

Protection options include a finite escape token, a guardian's intervention, a one-use recovery, eligibility for a unique inheritance or an authored favorable lead. Reveal the existence or observable effect of relevant protection before asking the player to commit a decisive action. Mystery can concern its source; repeated invisible invulnerability makes investigation pointless.

Anti-farming rules follow ownership: a finite reserve cannot be stolen twice, a claimed inheritance cannot respawn merely on reload, and a fabricated duplicate is not another genuine protagonist. Renewable fortune is possible if its source, timing and incentives are deliberately designed. Do not quietly create an infinite “humiliate the same captive” currency loop.

Losing fortune need not turn a rival into a helpless nobody. They may retain skill, allies, stubbornness and another route to progress. A powerful late-game thief could gain extensive control over fate; at that point choices can move toward competing claims, allocation and world-scale consequences instead of every enemy conveniently becoming immune.

### Identity theft and replacement

Three scales should remain separate: temporary disguise, institutional usurpation and actual body/soul replacement. The first can fit an authored infiltration scene; the third can affect almost every ownership rule in the game.

Original infiltration loop: study a missing examiner's habits → obtain a badge and a plausible cover → choose which checkpoint to approach → answer a knowledge or credential challenge → use access or retreat → encounter a later audit. Different observers may check appearance, practiced expertise, personal memory, a seal or a soul signature. One failed check can create suspicion, expose the cover or summon a witness according to authored rules.

The original person can remain alive, be missing, expose the fraud or owe the player a favor. A body death, soul escape, dormant clone, fake death and rumor of death need explicit distinct states. A definitive death stays definitive by default; a revival cheat, ritual or world law can undo it at a cost.

Replacement must list exactly what transfers. It may grant a recognized office while transferring its debts, expected performance and enemies. It should not automatically move the original person's skills, relationships, unearned quest rewards and inventory into the player's account. Swapping bodies while simultaneously rewinding history requires a later ownership-and-timeline audit.

### Worked combination: stealing the chosen heir's future

This is an original later cultivation scenario, not a selected plot or a reason to re-enable the archived prototype. It illustrates how the systems connect without turning every target into another loot roll.

| Beat | Player opportunity | State that actually changes |
|---|---|---|
| Discover | Learn that a clan heir's ruin invitation, real sword talent and one-use fate anchor are separate advantages | Record evidence about three distinct targets; knowledge does not grant ownership |
| Infiltrate | Use a forged envoy identity to redirect the invitation, or compete openly for the vacant expedition slot | The registrar's belief and invitation claimant change; the clan office and heir's skill do not |
| Appropriate | If the selected villain origin supports it, perform a ritual against the exposed anchor | Move its remaining charge once, subject to the authored compatibility rule; future supported odds can change |
| Face the rival | The heir survives without that protection and pursues another method or seeks patron help | Their actual loss, witnesses and motives determine recurrence; they retain ordinary ability and backing |
| Close or deepen the conflict | Return the charge, negotiate a shared expedition, retain the gain openly or maintain the cover | Record settlement, alliance or unresolved claims; theft of an invitation does not magically confer rightful succession |

The power fantasy is taking a route the protagonist expected to own. The interesting consequence is meeting that same talented person after their story has changed. A heroic origin could instead protect the invitation, restore the stolen anchor or challenge the clan's succession rule. These are different objectives using the same underlying actors and claims.

## A persistent rivalry system for this game

“Nemesis” is a useful research reference for remembered relationships and recurring opposition. The proposed game-facing concept is an original **rival chronicle** spanning encounters, disputes and alliances. Renaming alone does not determine whether an implementation differs from any reference.

Each active recurring actor needs an understandable identity, motive, leverage and a reason to return. A chronicle entry should answer: who are they, what do they want, what happened between us, what can they plausibly know, and what changed since the last encounter?

| Trigger | Possible response | Required causal limit |
|---|---|---|
| Sanctioned defeat | Practice a weakness, seek another competition or acknowledge skill | Preparation uses available time and resources; one loss does not create universal immunity |
| Public humiliation | Seek redress, manipulate witnesses or pressure a patron | Public knowledge requires a witness/report, and some personalities accept or conceal the loss |
| Theft of an opportunity | Pursue another lead, expose the thief or negotiate compensation | Rival retains only opportunities still available to them |
| Rescue / spared life | Gratitude, obligation, embarrassment or renewed competition | Gratitude is not automatic obedience and does not erase unrelated debts |
| Player misconduct becomes known | Investigation, boycott, sanctuary refusal or bounty | Only informed parties and relevant jurisdictions react |
| Rival loses backing or office | Seek a patron, negotiate, go independent or concede | Actual institution rules determine the transfer; strength and office are separate |
| Revealed disguise / possession | Audit credentials, protect a target or recruit a specialist | A discovered mask does not teach everyone the player's hidden origin |

Personal adaptation should have costs and tradeoffs. A rival who hires poison protection may have fewer resources for retainers. They can learn only from witnessed actions, testimony or investigation. Persistent rival power is authored advancement, not a permanent rubber band to the player's level. Returning after a long absence can leave an old foe weaker than the player, which makes progression visible.

Resolve arcs through settlement, alliance, conversion, retreat, incarceration, loss of office, death or an explicit unresolved feud. Do not preserve hostility just to keep the mechanic running. New conflicts can concern a shared resource even after personal reconciliation.

Author major turning points; use procedural variation for compatible names, temperaments, evidence and preparation. Begin with a few important people and a bounded set of scenes. Check combinations at meaningful interfaces rather than writing every archetype × origin × world × outcome combination. Rare memorable encounters are more useful than endless revenge interruptions.

### Nemesis-style progression refinement, 2026-10-02

The user requested a further Nemesis-style system review and saved findings. Refreshed primary evidence: Chris Hoge/Monolith's [GDC session overview](https://www.gdcvault.com/play/1025150/Helping-Players-Hate-%28or-Love%29) describes memorable long-term positive and negative relationships with generated Orcs. [Star Renegades' developer description](https://store.steampowered.com/app/651670/Star_Renegades/) describes evolving enemy officers and rank progression in a mission-based campaign. Only the published overview/descriptions were examined, not full talks or implementation code. The shared lesson is recognizable personal continuity and changed encounters; the following rules are our own proposals.

| Proposed ingredient | Saved cause/state | Meaningful next encounter |
|---|---|---|
| Recognition and memory | Stable actor/body identity, selected meeting/outcome receipt and known facts | The person recognizes the actual earlier contest, rescue or betrayal; chronicle text comes from committed history |
| Evidence and relationships | Directed grievance/debt/respect, informed observers, report route and jurisdiction | A witnessed event changes the right relationship; hidden powers or private events are not automatically known to every faction |
| Growth and adaptation | Authored practice/equipment/mentor project, input budget, time boundary and evidence of the relevant tactic | The rival can buy a protection or change a tactic at a real opportunity cost; they can also fall behind the player's growth |
| Goals and local opportunity | A bounded intention/assignment, target claim, available resources and deadlines | The rival may take another route, compete for instruction or gain a position independently of whether the player challenges them |
| Closure and aftermath | Settlement, alliance, custody, departure, durable death or unresolved status | The arc can end or become cooperation. A successor is a different person; repeated battle cleanup cannot silently revive this actor |

Scale personal advancement through that actor's events/resources/time, not continuous comparison to the player. A spared rival can remain weak, become a useful contact or deliberately prepare; an old enemy does not need to acquire new immunity every time the traveler gains power. A powerful adversary can focus on institutions or a contested objective instead of endlessly raising damage. Injury, loss of equipment or a scar should matter only if the authored aftermath makes it meaningful. Rare survival/return needs an explicit outcome, not a universal immortality policy. The actor can stay local after the player travels; pursuit into another world requires a route and motive.

Current v0.6 source adds an important boundary: Combat.reset() restores temporary battle fighters' is_alive flags. Keep durable life/custody/body state outside that cleanup and stage the encounter result back to the native NPC/actor binding once. Ordinary generated monster templates can remain disposable. Persistent NPC skill/growth plans also need declared advancement because native NPC constructors disable ordinary XP multipliers. The expansion journal keeps at most 100 history entries, so lasting memories/claims need their own retained cause record rather than disappearing when display history is pruned. Existing trader/dialogue saves are useful reuse, not proof of autonomous life simulation.

First proposed proof: one persistent Village-region peer, one nonlethal technique contest and one information/craft alternative, followed by a remembered response. The peer either undertakes one paid/timed preparation or settles the dispute, depending on committed evidence and goals. Reload between scenes; show changed access, tactic or claim; preserve closure and verify no duplicate reward or durable resurrection. Extend to a few authored actors before adding population-wide hierarchies, inherited feuds or cross-world pursuit. This is package C with B's combat/knowledge and D's clock dependency, not implemented Nemesis gameplay.

The earlier source table and identity catalogue remain discovery/history context. [Scaling and starting-world design](DIRECTION_SYNTHESIS.md#scale-starting-worlds-and-technologicalmagical-development-saved-2026-10-02) owns broader power/world progression; [engine readiness](ENGINE_EXPANSION.md#engine-readiness-audit-2026-10-02) owns current missing adapters and the proposed proof sequence. No specific roster, generated hierarchy, compulsory feud or final narrative has been selected.

### Nemesis reference implementation boundary

The published [US10926179B2 patent, claims 1–4](https://patents.google.com/patent/US10926179B2/en#C1), includes changes to a second opposing NPC's parameters following a player interaction with a first NPC; dependent claims discuss triggers and faction rank. This verifies that a relevant patent document exists, not which proposed mechanics infringe or the status of every related patent. No legal-clearance conclusion is made here. Research remains focused on our own authored conflicts and gameplay requirements; a close reference implementation would need a separate scope review. The source is not evidence that all recurring rivals or character memories are categorically prohibited.

## Engine contracts and difficult edge cases

Use [ENGINE_EXPANSION.md](ENGINE_EXPANSION.md) as the architectural owner. These are specific requirements the new ideas would add, not a second framework proposal or existing runtime APIs.

| Proposed record / boundary | Minimum information | Behavior it protects |
|---|---|---|
| Actor record | Stable actor ID, world, body/controller when relevant, life state, capability references and motive | The same rival survives scene changes; ordinary monster templates remain unaffected |
| Identity claim | Claim ID, holder, type, issuer/scope, authenticity, obligations and recognition evidence | A stolen badge does not silently transfer a profession or global reputation |
| Relationship / evidence | Directed parties, grievance or debt, cause receipt, informed observer and disclosure | Trust, fear and obligation need not cancel out in one signed integer |
| Opportunity / fate anchor | Stable instance ID, eligibility, claimant, capacity/charges, expiration and renewal | First claim or transfer cannot duplicate across reload, rewind or multiple actors |
| Encounter commitment | Event/actor IDs, selected route, rule revision, costs, draw if any, outcome and effects | Preview and execution agree; nonlethal outcomes and theft receipts resolve once |

Keep facts, observer beliefs and remembered player knowledge separate. Save minimal evidence and important transitions, not every attack or a growing prose transcript. Generate chronicle text from committed facts so an event cannot both say “we spared him” and record his permanent death.

Examples requiring explicit policy:

| Case | Required rule |
|---|---|
| Repeated kills of a named enemy template | Each actor/encounter has stable identity; farming the template does not re-award their title, reserve or first-clear opportunity |
| Surrender, escape or capture | Outcome chooses appropriate XP/loot/quest semantics; no automatic legacy kill event grants a stolen identity |
| Two claimants arrive simultaneously | Deterministic ordering or an authored contest decides ownership; resource grant and donor removal commit together |
| Reward or save failure | Stage and validate the full transfer, then use the engine's defined recovery; no half-removed donor or newly granted reward that can be reclaimed |
| Load during a named encounter | Explicitly resume saved encounter state or return to a safe pre-commit checkpoint; regeneration cannot reroll the target or its loot |
| Disguise exposed to one witness | Scope the evidence to that observer/group, then process any declared report route |
| Soul escapes a destroyed body | Preserve controller identity and declared soul-bound rights; ordinary corpse inventory has its own owner |
| Copied power has no comprehension or fuel | UI distinguishes possession from executable use; incompatibility follows a known rule rather than a surprise universal nerf |
| NPC has several covers | References point to one stable actor with separate claims, not duplicated NPCs and inventories |
| Grievance is settled | Cancel obsolete pending responses by cause ID; unrelated conflicts remain |
| World travel | Preserve appropriate actor/history state; local credentials, fate and imported powers use declared scopes |
| Rebirth / scenario rewind | Declare reset versus retention for actors, beliefs, claims, opportunity ownership and transferred resources together |
| Retained knowledge after rewind | Remembering an alias does not mean the rewound NPC remembers you; retained luck plus restored donor luck would need an intentional duplication rule or prevention |
| Offline preparation | Process only supported known work; stop at choices and disclosed risk boundaries. No unannounced theft, identity exposure or murder while catch-up skips past a decision |

The existing proposed scheduler and save-extension work are prerequisites for general delayed retaliation or off-screen schemes. First content can use authored event steps and bounded facts. Arbitrary world simulation, party possession, dynamic economies and all-body persistence remain later structural work.

## Concrete future slices and acceptance gates

This is a proposed sequence, not a replacement for the current next-event plan or authorization to implement all five stages. The first stage can be the ordinary event already contemplated in PROJECT.md; cultivation labels can arrive later. No prestige mechanic is added by this audit.

| Stage | Small playable result | Observable acceptance gate |
|---|---|---|
| 1. Ordinary rival dispute | One caravan/guild peer, one claim, a combat route and an evidence/craft route, one later reaction | Both routes change actual access or ownership; nonlethal result is correct; actor and aftermath survive reload with no duplicate payout |
| 2. Bounded feud and reconciliation | Add one patron, witnessed/private variants and a settlement | Patron responds only to relevant information; escalation can stop; settlement remains settled after reload |
| 3. Named opportunity contest | One rival pursues one inheritance or appointment, with disclosed eligibility and a deadline | Time advancement processes the deadline consistently; exactly one claim resolves; stealing the opening changes a later plan without deleting the rival |
| 4. Contrasting villain tools | Compare a one-scene disguise/usurpation route with a bounded fortune-transfer route | The tools create different viable strategies; title, belief, luck and skill stay distinct; supported odds and transfer accounting match the preview |
| 5. Small rival chronicle | A few persistent actors, compatible authored memories and one costly adaptation | Returning encounters recognize actual history; adaptation has evidence and a tradeoff; arcs can end or become alliances; old saves preserve ordinary and dormant data |

Exact plots, names, odds, starting identities and persistence policy await selection. For any runtime delivery, rebuild and exercise the changed behavior in a fresh browser origin with generated saves. Verify save/reload and relevant export/import behavior without personal saves. Source tests establish rules, while browser checks establish actual integration; user review separately assesses whether the rival is memorable and the choices feel different.

Relative implementation cost: an authored dispute is small content plus save integration; scoped witness response and one opportunity are moderate event/state work; disguise with multiple recognition methods is larger; general luck manipulation is larger if it affects existing RNG; body/soul replacement and whole-world autonomous rivals are major structural changes. These are qualitative judgments, not delivery estimates.

## Coverage, further research and completion status

| Requested area | Result of this pass | Remaining evidence or implementation gate |
|---|---|---|
| Young masters and escalating chains | Institutional archetypes, branching cargo dispute and motivated intervention rules | Select and playtest a bounded cast; source a specific novel chain only if adapting it directly |
| Heaven's chosen and other identities | Distinct status/talent/favor and ten identity layers; 35 overlapping archetypes | Select world-specific recognition and eligibility rules |
| Villain-MC subgenre | Six route families and thirteen appropriation targets | Select a run-defining tool; verify exact selected book mechanics if needed |
| Identity stealing | Disguise, office replacement and body/soul replacement separated | First infiltration acceptance gate; body ownership needs later architecture work |
| Luck stealing | Reserve versus anchor options, bounded odds example, transfer and farming rules | Decide scope and renewal; implement saved RNG/receipts for affected events |
| Nemesis / persistent rivals | Relationship-first chronicle, authored/procedural split, adaptation and closure | Persistent actor/encounter integration and a memorable returning scene; reference scope review for any close implementation |
| Broader worlds and future breadth | Nonhuman/technological/world-level identities plus travel/reset contracts | Test selected identities in mechanically different worlds; no exhaustive cross-product promised |

Future source work should answer the chosen mechanic's missing question. For *Reverend Insanity*, locate an authenticated luck-transfer/theft example and a disguise case rather than infer mechanics from names. For *Lord of Mysteries*, verify a selected impersonation method, recognition counter and identity limit against an authenticated edition. For the Fated Villain reference, inspect an accessible licensed episode or original chapter for the intended harvesting preconditions. For rivalry references, review an accessible full developer talk or exercise one focused scenario before claiming detailed algorithm or pacing conclusions.

Completed here: current-source audit, bounded primary-source checks, broad trope inventory, original mechanic contracts, candidate slices and documentation links. No source code, built bundle or personal saves changed. No new gameplay, balance validation or creative acceptance is claimed. The remaining playable gate is a selected ordinary dispute with two meaningfully different resolutions and persistent aftermath.
