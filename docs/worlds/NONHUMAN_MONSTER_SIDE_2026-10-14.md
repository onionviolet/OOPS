# Nonhuman starts: the monster side, 2026-10-14

Status: source-read findings and **INFERRED original proposals**. Nothing here
is accepted design, implemented monster-side gameplay or browser proof. This
lane writes only this report and its [checkpoint](../gm/dispatch/nonhuman-starts-2026-10-14/monsterside/CHECKPOINT.md).
Authority: [COMMON](../gm/dispatch/nonhuman-starts-2026-10-14/COMMON.md),
[requirements, all rounds N1-N23](NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md),
[PROJECT](../../PROJECT.md) and [user vision](../USER_VISION.md).

**STATED (Weibao, standing direction):** useful meals, no hunger death;
desktop/laptop first, mobile deferred; first milestone one realm and one prestige
layer. This palette creates no extra release gate or world-priority change.
**INFERRED central proposal:** a monster has a home, work, acquaintances and
interests before an adventurer calls it an encounter. Species, personhood,
allegiance, danger and current hostility are separate facts.

Evidence labels: **SHOWN** means directly inspected source definitions, not
executed behavior; **STATED** names a design owner or source-summary author;
**INFERRED** covers every original mechanic/default/dial below; **UNKNOWN** means
unestablished. No outside-text MEMORY claim is used as evidence. No primary novel
text, web source or sealed world file was opened. Franchise comparisons below
report sibling evidence with its qualifications, rather than new canon findings.

## Joins and present seams

**STATED (existing proposals):** [PLAY](NONHUMAN_STARTS_PLAY_2026-10-14.md)
owns BK1 beast, BK2 evolving monster, BK7 place/core, BK9 collective, BK13 undead
and BK15 small creature, plus NP3 offline, NP4 recognition and NT transformations.
[Mechanics](NONHUMAN_PROTAGONIST_MECHANICS_2026-10-14.md) owns TM1-TM7 and
NM1-NM12; this lane extends NM5 territory, NM8 nations and NM10 ecology through
visitors, pressure and neighbors. It does not repeat evolution, absorption,
naming or body schemas. [ENGINE_SPEC](NONHUMAN_STARTS_ENGINE_SPEC_2026-10-14.md)
owns corrected F/B findings, T1-T10 consumers and S1-S12 save touchpoints.
[BY_WORLD](NONHUMAN_STARTS_BY_WORLD_2026-10-14.md) owns W01-W16, NC1-NC14 and
NX1-NX10 source-qualified species and institution palettes.

**STATED (existing owners):** [encounters/pursuit](../ENCOUNTERS_AND_PURSUIT.md)
owns trigger, locator, access, contact and settlement distinctions.
[Enemy protagonists](../ENEMY_PROTAGONISTS.md) owns independent goals and bounded
arcs. [Villain starts](VILLAIN_STARTS_AND_OTHER_SELVES_2026-10-14.md) VX3 owns
event-attributed blame, VX4 useful services under a hostile office, VX7 limited
collaboration and OX9 narrow recognition tests. Being nonhuman does not select
a villain role. This report adds the monster's relationship to those services.

**STATED (siblings reconciled at closing read):**
[TRANSFORMATION](NONHUMAN_TRANSFORMATION_AND_BODY_CHANGE_2026-10-14.md)
TF1-TF12 and TX1-TX16 own change/carry/control contracts; TX11 already covers
hunters retaining evidence after a shift. This lane adds claim and pursuit
aftermath, not another transition record.
[SENSES_SCALE_AND_UI](NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14.md)
SU1-SU5/SU14 own qualified perception, channel-specific reach and observed threat
warnings. Its Body/Reach/Partner/Current work surfaces remain the presentation
homes for this lane's known visitors and claims.
[Paradise beings](paradise-hub/BEINGS_PETS_AND_BODIES_2026-10-14.md)
BC1-BC11, BR1-BR6 and BI1-BI8 own companion/body source evidence; BS1-BS5 and
PL1-PL5 own proposed seats/passage contracts. These outputs arrived during
drafting and were read before completion. Their mechanics remain proposals and
their canon/translation qualifications remain intact.

| Code | SHOWN seam, from this lane's reads | Limit / INFERRED implication |
|---|---|---|
| MF1 | `src/enemies.js:39-95` stores combat stats, tags, drops and callbacks; `:61` says rank orders the bestiary. `:763-767` binds template IDs to keys. | A template ID is a kind, not a persistent individual. Bestiary rank does not establish pack leadership, office or evolution eligibility. |
| MF2 | `src/models/location.js:335-388` draws groups, creates new Enemy instances, varies stats and sets them alive. | Existing repeated encounters do not establish population loss, migration or returning individuals. Named residents need an explicit actor-to-fighter binding; leave ordinary legacy encounters compatible. |
| MF3 | `src/models/combat.js:38-55,98-123` accepts fighter arrays and an action adapter; `:253-256` dispatches that adapter before ordinary combat. `:141-175,279-307` uses main_character tags for native stance/XP branches. | ENGINE_SPEC's B1/B7 correction is confirmed: arrays exist; generic persistent monster combat, body-fit attacks and reward routing are still missing joins. Swapping screen sides alone is insufficient. |
| MF4 | `src/models/combat.js:393-450` calls hit/damage callbacks, routes player defeat through kill_player and awards target drops to the global character. `src/enemies.js:162-198` rolls drops and reads that character's Butchering coefficient. | Surrender, capture, dispersal, live-body harvesting and visitor prizes need explicit outcomes/custody; generic defeat must not automatically award a living neighbor's pelt. |
| MF5 | `src/pursuit.js:11-27,59-77,107-118,128-168` validates targetId=player, charges owned supplies, follows leads, checks contact and supports bounded signature/authority locating. | Useful pursuit machinery exists, with player-only targets and no general bounty issuer/claim ledger. Cross-body or NPC targets, report leads and hostile raids are extensions, not drop-in content. |
| MF6 | `src/pursuit.js:174-198` records only witnessed supported departures and filters the player view; `src/encounter_content.js:12-20,29-56` defines optional nonlethal tests, finite focus, settlement and durable requests. | Reuse information boundaries and request/session settlement. These examples do not prove forced ambushes, lethal exorcisms, automatic native group battles or bounty payouts. |
| MF7 | `src/simulation_contracts.js:217-250,257-260` supplies people, stock owners, custody, knowledge, directed relations, sites and jobs with actor reservations. | Prefer these owners for selected residents and work. A monster mind or town cannot be made persistent merely by adding arbitrary fields to Enemy. New bindings require schema validation and E14. |
| MF8 | `src/field_workshop.js:20-27,45-46,78-87` defines paid specialist phases, finite site capacity, transferred logs, later assembly and repeatable funded output. | Lair building can adapt the project pattern. Existing workshop verbs/location/body prerequisites do not already support a rooted core or monster builders. |

## 1. Being hunted: N13 from your side

All of this section is **INFERRED**. Default: one local pressure case with a
specific claimant, evidence, funded hunter and a playable resolution. Dial:
no hunt, opportunistic hunting, lawful capture, extermination, sect trial or
source-supported champion. Reasonably per world: neither inevitable persecution
nor universal diplomacy; use the world's actual institution and means.

| Code | Who comes / what they want | Finding and contact | Useful monster choices |
|---|---|---|---|
| MH1 Bounty contractor | A farmer wants crop damage stopped; a merchant wants a road reopened; a collector wants a particular gland. Issuer, beneficiary and hunter may disagree. | Posted description is a claim. Witness/report leads can be wrong or stale; verification decides whether this individual matches it. | Shift a route, protect crops, contest identification, buy out a claim where allowed, negotiate a substitute, defend or leave. Peaceful closure actually cancels that contract's future payment eligibility. |
| MH2 Adventurer party | Treasure, training, rescue, research, an employer's deliverable or prestige. A broke novice and prepared expedition have different budgets. | Known entrance, scouts, purchased maps and camp supplies. Party roles matter at a bounded encounter, without requiring a full adventurer simulator. | Offer a challenge, trade maps, bargain for a survey, deny entry, mislead, retreat or fight. Rescue their missing companion if that is the actual problem. |
| MH3 Exorcist | Ends an alleged haunting, protects residents, repairs an anchor or obeys a doctrine. | Requires an actual sensing/ritual channel and compatible banishment method. Ghost presence is not automatic visible target knowledge. | Arrange a witness, demonstrate a harmless service, relocate an anchor by supported means, interrupt a ritual or resist. Exorcism may disperse, banish or end a person only under E6's selected rule. |
| MH4 Sorcerer or specialist | Removes a dangerous curse, contains an artifact, studies a rare body or retrieves a vessel. | World-qualified detection, barriers, marks and technique range. Incarnated human, independent corpse and spirit remain distinct (BY_WORLD W08, NC2/NC5). | Choose a message channel, negotiate a restricted service, hide by a real faculty, exploit a technique's actual reach or battle. Research consent and capture are different encounters. |
| MH5 Hero or coalition | Saves a named population, fulfills an office/prophecy or opposes a declared disaster. | Public reports, allies and supported divine/narrative authority. A title supplies only its actual permissions. | Remove the cause, offer compensation/protection, enlist a credible mediator, challenge the mandate, surrender under explicit terms or defeat them. No automatic perfect locator, level matching or invulnerability. |

### Escalation dials, independent rather than one danger bar

| Code | Default | Dial / reason |
|---|---|---|
| MD1 Cause and attribution | One observed incident with event actor and claimant. | Body resemblance, inherited office claim, verified conduct, framing or doctrine. A rat-shaped player does not inherit every rat's offense (VX3). |
| MD2 Notice and reach | Local sightings and a short supported route. | Rumor network, scent, paid scout, signature or declared authority. Strength and locating power are separate; MF5-MF6 already distinguish ordinary and exceptional means. |
| MD3 Resources and preparation | One hunter, finite supplies, fixed kit. | Party, reinforcements, study, specialized counter or exhausted retreat. A later counter costs real time/resources and comes from evidence, not perfect knowledge of the player's build. |
| MD4 Frequency and timing | One caused case; closure stops it. | Renewing contracts, patrol windows, rising local pressure or a chapter deadline. Cooldown, eligibility, issuer funding and new cause constrain recurrence. No stronger wave merely because the last one lost. |
| MD5 Access and stakes | Known refuge boundary and negotiated/nonlethal contact for the first prototype. | Search warrant, siege, forced battle, capture or source-specific terminal loss. Show known stakes, interruption and recovery before selecting a severe premise. Arrival guarantee, combat outcome and death policy are independent. |
| MD6 Response and absence | A durable request; browser-closed time freezes by default. | Bounded selected defense/evacuation plan or opted-in offline preparation. Pause at a new consequential decision. No silent unattended tenant massacre; a severe auto-resolve policy needs its own advertised contract. |
| MD7 Institution and closure | One issuer can settle its own case. | Rival guilds, religious orders or kingdoms with separate records. Paying one bounty does not erase another institution's evidence, and vindication can propagate by actual reports. |

Proposed causal ladder: crop loss is witnessed → issuer funds a notice → one
party accepts → party obtains a lead → pays for search → reaches an actual
contact → settles once → surviving observers may report the outcome. Escalation
needs a new funded decision, such as a survivor reporting a demonstrated toxin;
it can also fall through corrected identity, changed land use, depleted funding,
a treaty or completed objective. The player sees only delivered evidence,
not hidden hunter coordinates or remaining focus (MF6).

**Original Village case:** a wolf-rat player keeps a mana patch and can divert
its known route away from grain, offer a bounded crop-watch service through a
learned signal, shelter, relocate or defend. SHOWN context: cave mana supports
rats and weak expelled rats forage above ground (`src/enemies.js:227-230`);
field combat rewards currently reward clearing rats (`src/data/locations.js:469-501`);
the elder unlocks that field through the human opening (`src/data/dialogues.js:73-94`).
INFERRED: add a separate authored monster opening and incident, not retroactive
blame, auto-entry into that human quest or a rewrite of its earned rewards.

## 2. Monster ecology and society

**STATED (Mechanics TM6, secondary to this lane):** Tensura's supplied WN summaries
locate crafts, medicine, roads, trade and mixed patrols at T1 members 22/30/46/
50/53-57; dungeon settlement/services at TC C21-C22, members 104-106/119.
LN/wiki generalizations are not substituted for those WN cases. TM6/NM8 already
own the productive society pattern. The additions below are **INFERRED** local
dependencies that make a player's home react to other beings.

| Code | Default loop | Dial + reasonably per world |
|---|---|---|
| ME1 Pack | A few named neighbors share one patrol/refuge agreement; each has their own preferences and work. | Kin, voluntary crew, territorial group, chief-led pack or solitary life. Leadership comes from local authority/conduct, not MF1's bestiary rank. Leaving need not erase affection. |
| ME2 Hierarchy | One real duty and its benefits: guard a nursery, maintain a trail or teach a method. | Elected steward, elder, strongest challenger, caste or sourced naming bond. Power, leadership legitimacy and command channel differ; TM3/NM4 owns actual naming effects. |
| ME3 Territory | One patch has habitat support, occupants, access and known boundaries. | Shared ranges, exclusive den, seasonal ground, sanctuary or conquest. Land title, effective defense and a core's bodily reach are distinct. Trespass matters where its rule and witnesses exist. |
| ME4 Town and nation | A safe market/service site plus named workers and an agreement with neighbors. | Citizen, craft resident, caravan, diaspora, mixed town, founder or ruler. Civic progress opens actual services; no shared consciousness from nationality (NM8 versus NM11). |
| ME5 Food web | A small directed support graph: mana patch supports rats; rat activity changes crops; villagers respond to crop evidence. | Scavengers, predators, pollinators, decomposers, magical energy sinks and plant producers. Diet is not a universal kill quota; feeding improves eligible work/growth and never kills through hunger. |
| ME6 Migration | A declared change to a habitat or route prompts a bounded group decision. | Seasonal move, expulsion, refuge, caravan or staying with adaptation. Save origin/destination, carriers, obligations and arrival capacity; displacement does not spawn free duplicate residents. |
| ME7 Neighbors and recovery | A lost habitat service leaves an observable repair/relocation opportunity. | Overcrowding, flood, magic depletion, mining dispute or stable prosperous ecology. Schedule only selected changes; no obligation to simulate every birth/death or manufacture ecosystem collapse. |

**SHOWN vs proposal boundary:** the wolf-rat lore explicitly supplies mana,
limited cave space and expulsion (MF1's surrounding source, `src/enemies.js:227-230`).
It does not implement capacity, food flows or migration. The author's starving
description is history/flavor, not permission for hunger death. Cave rooms and
depths currently define rat groups of 2-3 and 5-8, progressive clears and unlocks
(`src/data/locations.js:560-618`); these numbers are encounter definitions,
not a census. INFERRED: start with two habitat patches and one relocation/service
decision, retaining a compatibility boundary around ordinary repeat combat.

Idle play can maintain a scent boundary, prepare a shared shelter, process a
compatible material, teach a known skill, carry supplies or patrol a negotiated
route. An individual can gain a friend and a home without becoming pack ruler.
N8 instinct offers migration/hunt suggestions or benefits; it does not choose
crimes for the player. N9 habitat determines method support, while N11 native
mind versus human-memory origin determines known plans, not innate morality.

## 3. Dungeon core and lair play

All mechanics here are **INFERRED**. BK7 owns the body promise; NM5/TM6 owns
territory/facility inspiration; E7 owns reach and E8 owns distinct controllers.
Default: one anchored room, one funded building job, one visitor with a purpose
and one settlement. Dial: den, workshop, sanctuary, tourist challenge, lethal
dungeon or haunted house. Reasonably per world: ownership of a lair does not
grant control or perception of every occupant.

| Code | Play from inside | Required causal detail |
|---|---|---|
| ML1 Visitors as encounters | Scout, customer, tenant, raider, pilgrim, rescuer and inspector arrive for different reasons. | Entrance/channel, observed identity claim, arrival time, purpose, permissions, means and exit. Sense only supported room traces; an unknown footfall is not an adventurer's full status sheet (N1). |
| ML2 Traps as jobs and policy | Build, test, arm, signal, reset, disable or negotiate passage. | Material/energy cost, footprint, trigger observation, target rule, effect, reset capacity and collateral exposure. Mechanical latch, alarm, restraint, puzzle and damage trap are different implementations. |
| ML3 Rewards as bait | Advertise a prize/service, stock it, admit a challenge, settle its eligible claim. | Actual owned stock or a funded source production rule; display/reveal, claimant and settlement receipt. False advertising is a chosen deceptive act, not a default free treasure dispenser. |
| ML4 Idle building | Queue repair, room expansion, fixtures, ward practice or staff supply. | Builder functions, supported reach, site reservation, inputs, completion condition, cancellation and retained progress. MF8 is the reusable phased-project pattern, not a shipped dungeon builder. |
| ML5 Defense and evacuation | Choose an existing policy: alarm and pause, refuse entry, escort, defend a boundary or evacuate agreed occupants. | Workers remain people; exits, warnings, consent/command terms and refuge capacity exist. Opening a door cannot reserve one guard in two simultaneous scenes. |
| ML6 Dungeon economy | Sell challenge entry, guides, crafting, lodging, salvage rights or a produced ingredient. | Counterparty budget, actual visitor arrivals, payment/custody, prize spending, worker pay, maintenance jobs and external trade. Tourists are not an infinite timer payout. |
| ML7 Defeat and restoration | Shutter a damaged room, repair fixtures, retreat to an anchor or move a core by supported means. | Separate core integrity, resident fate, equipment custody, destroyed stock and land access. Revival requires the particular world's permission/domain, not a property of all dungeons. |

Illustrative one-room accounting, **INFERRED unselected values**: two actual
customers each pay 3 coins; one claimed prize costs 2 coins and one reset/worker
job costs 1 coin. Net coin change is +3 only if those arrivals/payments happen.
Every prize leaves stock once; an unclaimed prize remains held and reserved
as applicable. Mana is a separate ledger with a declared source/conversion rule,
not visitor spending renamed. A world may explicitly grant creation or
kill-to-energy powers; record their payer, capacity, result and growth rule.
Do not silently infer conservation exceptions from a creature's drop table.

The proposal keeps separate ledgers for fees, prize custody, salvage, XP and world
growth: a nonlethal trial can pay a stocked prize without yielding a corpse,
a scavenger can trade salvage without rerolling Enemy loot, and practice XP can
follow a supported method without being proportional to dead visitors. Native
loot currently goes to global character on defeated targets (MF4).

**STATED (TM6):** visitor-bracelet revival in the supplied Tensura summaries is
bounded by domain/permissions (TC C21-C22); it is not universal resurrection.
**UNKNOWN:** exact core/body rules for a selected adaptation, trap costs,
conversion rates and native settlement support. OS05/OS06 in Mechanics are
synopsis-level dungeon comparisons, not certified kill-reward formulas.

**Original Village candidate:** an explicitly authored side alcove at a known
cave location with a core reach and supplied repair stock. A visitor wants a
safe survey, not a fight. Queue an alarm fixture, reserve a real survey prize,
choose a guide/deny/challenge policy, then settle once. SHOWN Village has
craft tiers and NPCs (`src/data/locations.js:378-392`) and an initially locked
Nearby cave (`:530-557`). INFERRED: give this alternate origin only its declared
footprint/support; do not unlock the whole cave or claim BK7's locked Shack
already belongs to it (`:396-409`). Dungeon generation remains deferred.

## 4. Existing enemies become beings with goals

All goals and starts in this table are **INFERRED original additions**. SHOWN
locators establish templates/flavor only. A creature need not have human
language or an autobiographical soul to have a goal; sentient starts declare
their actual mind/history in N11. No compulsory personhood upgrade of every foe.

| Code / existing kinds | Goal that can precede combat | Start / NPC / foe contexts | SHOWN locator |
|---|---|---|---|
| MB1 Starving/Wolf/Elite wolf rat, guardian | Secure a mana patch, protect a den or find room after displacement. | Start: resident with a known route. NPC: passage broker or neighbor. Foe: defended boundary or crop raid. Elite strength and guardian label do not establish a political caste. | `src/enemies.js:227-290` |
| MB2 Wall rat | Keep a particular living boundary intact or expand a supported footprint. | Start: explicit place-body/mind premise. NPC: communicating threshold. Foe: hostile obstruction. Description does not prove one mind, fixed reach or a brood. | `src/enemies.js:292-304` |
| MB3 Starving/Young/Wolf, Direwolf, Direwolf hunter | Keep a trail safe, rear dependents or pursue a known prey/supply opportunity. | Start: mobile pack member. NPC: escort/territory partner. Foe: contested hunt. Age, present condition and powerful variant are separate axes, not a verified evolution chain. | `src/enemies.js:306-377` |
| MB4 Boar, mountain goat, Forest/Grizzly bear | Protect a resting patch, cross a blocked route or keep access to seasonal support. | Start: habitat worker/explorer. NPC: boundary negotiator with a channel. Foe: intrusion/competition. No universal territorial aggression or automatic domestication. | `src/enemies.js:380-425,605-619` |
| MB5 Frog | Hold a wet refuge, develop a gland technique or protect an actual egg site if authored. | Start: amphibious craft/exploration. NPC: ingredient supplier under safe collection terms. Foe: dangerous habitat encounter. Refactor actual target effects before playable poison. | `src/enemies.js:427-464`; callbacks use global effects at `:209-217` |
| MB6 Red ant swarm / queen | Maintain a nest, move materials or assign a guard route. | Start: one member, queen or declared collective. NPC: work crew. Foe: defended entrance. Swarm attack_count=30 is combat data, not 30 persisted minds or a reproductive rate. | `src/enemies.js:466-490` |
| MB7 Huge dragonfly / queen | Secure a flight corridor, shelter or pursue a material opportunity. | Start: flying scout. NPC: route informant. Foe: patrol encounter. Queen label does not grant swarm control; poison callbacks need actor routing. | `src/enemies.js:492-524`; group definition `src/data/locations.js:505-523` |
| MB8 River/Stone crab, Alligator, Snapping turtle, Giant snake | Keep access to water, claim a resting site, escort a crossing or follow a local trail. | Start: aquatic/scale-specific life. NPC: crossing partner. Foe: contested channel. A Giant snake has no aquatic tag here, so do not assign swimming just by grouping it with river creatures. | `src/enemies.js:536-604` |
| MB9 Owlbear / Bandersnatch / Grizzly squirrel | Find a perch/refuge, protect a route or pursue a supported prey/cache. | Start: distinct anatomy. NPC: territorial neighbor. Foe: particular hunt/ambush. Bandersnatch's ambush description supports flavor, not a shipped concealment planner. | `src/enemies.js:620-662` |
| MB10 Slums thug / human challenge actors | Seek pay, perform a guard duty, pressure a debtor or accept a practice bout. | Human start: joins monsters by agreement. NPC: broker/guard. Foe: local criminal or challenger. Humans already appear in the same template catalog; enemy is a role, not a species. | `src/enemies.js:526-534,669-708` |
| MB11 Goat/crab/Warthog challenge variants | A specific dispute, nesting threat or authored trial. | Start/NPC only from a selected compatible ordinary body profile; foe retains the actual challenge contract. No automatic unique boss biography. Enraged giant crab's source comment marks a known uncertainty. | `src/enemies.js:711-759`, uncertainty `:732` |
| MB12 Suspicious wall | Remain an obstacle unless a mind/presence is explicitly supplied. | Ordinary inanimate foe/test target by default; sentient wall start is a new BK7/SA15 premise. Targetable does not imply alive. | `src/enemies.js:689-698` |

Proposed join: revisioned species/body template → persistent actor with location,
knowledge, goal and commitments → encounter relation → combat/dialogue projection
→ one aftermath applied back to that actor. Return the same wounded/settled
neighbor rather than regenerate a named wolf with fresh stock. Anonymous repeated
foes may remain legacy templates; bind only the selected cast initially (MF2/MF7).
Save actor identity, resolved draws and aftermath, not live browser timers.

Callback warning, **SHOWN:** Frog and dragonfly definitions call global
add_active_effect and write player-shaped messages (`src/enemies.js:442-462,500-522`);
Combat invokes callbacks with actual fighters (`src/models/combat.js:393-396`).
**INFERRED:** player/NPC parity needs target-aware effects, exposure channels and
natural attack profiles. Reusing that callback as a player power unchanged could
poison the player instead of the intended hunter. This report identifies the seam;
it does not reproduce or repair the behavior.

## 5. Crossing sides without compulsory body change

All routes below are **INFERRED**. Default: a bounded useful service with one
counterparty, one communication convention and a known refuge. Dial: open
citizenship, temporary passage, secret double life, emissary, coerced capture or
lasting mixed community. Reasonably per world: entry, trust, rights, profession
and species remain distinct; return-to-human is optional (N15).

| Code | Monster joining a human town | Human joining monsters |
|---|---|---|
| MC1 First contact | Repeat a signal, use a translator or demonstrate a sourced speech faculty. A guard learns only its content and observed intent. | Learn a scent/sign/telepathic convention through actual instruction and permission; no automatic collective mind access. |
| MC2 Useful work | Offer tracking, compatible manufacture, ferry guidance, medicine ingredient or ward care. | Bring a craft, route map, teacher role or broker service that locals actually need; humans are not automatically superior administrators. |
| MC3 Safe place and support | Find a body-fit berth and meal benefit; arrange gear/custody with a willing artisan/agent. | Obtain appropriate air/water/light protection or a supported alternative where habitat requires it; community food is not assumed to suit a human. |
| MC4 Membership and disagreement | Patronage, worker contract, visiting permit or recognized citizenship. Existing crimes/claims persist under local event attribution. | Ally, apprentice, pack associate, captive, citizen or dissenter; command and belonging differ. Leave, negotiate or keep a quiet role if actual means support it. |
| MC5 Changed allegiance | A town witness may sponsor passage; a monster neighbor may approve, distrust or remain indifferent based on history. | A former hunter can work for the people they once fought; affected claimants learn through reports, not a global alignment flip. Disclosure changes only the audience reached. |

Village proof target: monster performs one body-specific helpful act, guard
learns a repeatable signal, artisan accepts one paid fitting/repair contract,
and a separate claimant's dispute remains legible. The converse human visitor
can commission one real monster service without receiving pack authority.
SHOWN: the NPC/craft palette exists (MF8 and `src/data/locations.js:378-392`);
it does not establish those agreements. This joins PLAY NP4/NP8/NP9 and NM7/NM8,
not a new universal reputation meter or a parallel legal/economy database.

For franchise cases, preserve BY_WORLD's qualifications: W08 curse visibility
and exorcism differ from W09 Hollow purification and W14 Devil/Fiend/Hybrid
contracts. TM7's church doctrine and road-revenue conflict are source-specific
human motives, not a rule that every human settlement attacks monsters.
N16-N23 Paradise mission/pet/borrowed-body terms can change affiliation and
visitor jurisdiction without changing source rank, body strength or ownership
automatically. STATED (Paradise beings BR2/BS4): Reed's paid-worker transfer is
distinct from regular Contractor status; BS4 uses this as a recruitment model
with a viable native continuation after refusal. INFERRED: apply that distinction
to a monster visitor's offered job without granting universal hub citizenship.
PL1's issued vessel is explicitly a proposal, not a verified mission-body law.

## 6. Considerations MS1-MS24

Every row is **INFERRED** and extends the linked owners rather than adding
required gates to unrelated work. Defaults and dials are proposals for selection.

| Code | Consideration / default | Dial + reason / owner join |
|---|---|---|
| MS1 | Species, person, allegiance and hostility have separate owners. | Mindless beast, sapient native, transformed person or explicit AU; selecting a monster never silently selects villain intent. E1/E8/E10, NC1/NC2. |
| MS2 | A bounty identifies a target by a stated claim and evidence. | Individual, mistaken description, group or office claim; issuer correction can close it. N13, VX3, MH1. |
| MS3 | Hunters have goals beyond the player's defeat. | Pay, research, rescue, doctrine, promotion or a real narrative mandate; objective completion permits closure. Enemy-protagonist owner. |
| MS4 | A stronger hunter still needs a locating means. | Tracks, signature, scoped authority or accurate testimony; strength alone does not expose a secret body. N1/E10, OX9, MD2. |
| MS5 | Escalation has a cause, payer and next decision. | Coordinated raid or solitary recurring rival; cap only the selected policy, never invent universal level scaling. MD3/MD4. |
| MS6 | Being captured is a declared custody/control state. | Escape, ransom, agreed employment, containment or terminal outcome; do not equate ownership claim with mind control. N4/N5/N22, E6/E8. |
| MS7 | A core's bodily reach and an institution's jurisdiction differ. | Remote ward/source-supported extension, steward or ordinary landowner; occupancy grants no universal vision. E7/N1/N2. |
| MS8 | Pack duty is a meaningful supported idle job. | Voluntary crew, sourced command bond, shared mind or autonomous neighbor; member reporting and availability remain real. NM11, BK9, N6/N21. |
| MS9 | Hierarchy is local and may have peaceful succession. | Challenge, election, inheritance or no hierarchy; bestiary rank is not social rank. N12, TM3, MF1. |
| MS10 | Habitat support changes useful output/movement, with no hunger death. | Magical, aquatic, seasonal or stable habitat; distinguish lack of bonus from lack of any agency. N8/N9, E5, NX2. |
| MS11 | Migration has a destination and carries actual residents/stock. | Safe move, contested refuge or adaptation in place; arrival capacity and old claims matter. N2/N9/E7, NT9. |
| MS12 | Food-web abstraction tracks only selected causal joins. | A few resource patches or richer ecology; no manufactured mass starvation/death to simulate every species. ME5-ME7, NM10. |
| MS13 | Society stays productive without making every monster a leader. | Apprentice, guardian, merchant, founder or quiet resident; useful services are growth. TM6/NM8, NP11. |
| MS14 | Dungeon bait has provenance and one settlement. | Stocked treasure, manufactured reward, explicit source creation or deliberate fraud; no drop-table-funded infinite wealth. N3/N23, MF4/ML3. |
| MS15 | Traps follow actual observation/trigger channels. | Alarm, restraint, puzzle, damage or sourced certainty; cover and mistaken identification remain meaningful where supported. N1/E11, ML2. |
| MS16 | Visitors and builders compete for real capacity/time. | Multiple rooms/teams or autonomous fixtures with declared means; one body cannot work and fight through overlapping reservations. E3/E7/E8, MF7/MF8. |
| MS17 | Defeat settles individuals, lair and community separately. | Reassembly, dispersal, repair, capture, retreat or local terminal loss; no generic bed/tenant death assumption. N10/E6, NC5/NC13. |
| MS18 | Prize, salvage, XP and growth are distinct rewards. | Entry fee, nonlethal challenge, hunt, tourism or sourced kill conversion; each has an actual recipient and cause. E9/E11, ML6. |
| MS19 | Body change does not automatically cancel a bounty. | Face-based mistaken pursuit, continuing identity or new sourced trace; update only what actual observers know. N7/N11/N15/E13, NT5, TX11, OX9. |
| MS20 | Side crossing can keep the same body and former friends. | Disguise, citizenship, emissary, mixed party, ordinary household animal or temporary service; a human form/awakening is one route, not completion. N5/N6/N14/N15, MC1-MC5, Paradise BS5/PB5. |
| MS21 | Nonhuman economy prices actual service/fit requirements. | Large transport, custom berth, unusual intake or ordinary rates; no universal strange-body surcharge. N3/N7/N23, NP9; detailed law/price rules remain the separate society lane's area. |
| MS22 | Mission body, pet bond and threat classification are independent. | Contractor, pet, summon, local resident or rented body; return date/owner claim and access tier need their actual terms. N16-N22, Paradise BR2/BS4/PL1-PL5/PB1-PB2. |
| MS23 | Offline work follows a selected policy and the existing clock. | Freeze, bounded building/production/defense or reviewed chapter advance; no new wars or irreversible bargains from loading. M1/M10, NP3, MD6. |
| MS24 | Show observed pressure beside useful current work. | Simple known visitor/contact row or expanded territory/incident details; no sealed identity, hidden hunter map or compulsory town dashboard. N1/N2, NU1-NU9, SU1/SU5/SU14-SU16. |

Future selected UI target: **1366×768 desktop/laptop**. Visible outcome: current
body/reach, one queued job, known visitor/claim and available responses remain
readable together in the existing workspace. Mobile, a full nation dashboard,
world map generator and every named body's implementation are deferred. This
report specifies no measured UI improvement and ran no browser check.

## 7. At most five suggestions

All five are **INFERRED recommendations**, not assigned implementation. E1/E2/E14
foundation plus each selected action/body/admission dependency remains necessary;
ENGINE_SPEC owns that work. Finish one selected playable slice before another.

| Code / order | Suggested bounded slice | Grounding and future observable acceptance |
|---|---|---|
| MSS1 | One wolf-rat resident, one mana patch, one crop claimant and a named hunter. | MB1/MF5 plus Village field/lore locators. Use a new original monster opening. Demonstrate avoidance through changed route/service and one defensible contact; closure prevents duplicate claim/payment. No full pack or ecology required. |
| MSS2 | Bind one returning neighbor to a persistent actor and a combat/dialogue projection. | MF1-MF4/MF7. Same individual can negotiate, oppose and later cooperate while retaining actual wounds/stock/knowledge. Ordinary anonymous enemies retain their compatible repeat loop; player/NPC toxin routing checked where selected. |
| MSS3 | One small lair project with one real visitor and a stocked prize. | BK7/NM5, MF8, ML1-ML4. Build a funded alarm/fixture, encounter surveyor, choose passage/challenge/refusal and pay only the settled claim. Core reach, worker reservation and pause behavior need actual implementation. No procedural dungeon first. |
| MSS4 | One mixed-community service agreement in both directions. | MC1-MC5 and Village NPC/craft locators. Monster performs a supported service for a human; human commissions a supported monster service. Each changes real access/output without instantly granting citizenship or command. Dedicated signal/contract adapters remain open. |
| MSS5 | One habitat change with a relocation or repair route. | ME5-ME7, MB1 cave-expulsion context. A paid boundary/repair job or carried move changes one patch and one neighbor's options, with no hunger death, duplicate residents or mandatory combat. Keep a quiet settled life viable. |

Future selected proof, not run: source tests for identity/knowledge, paid work,
finite claim/prize, interruption and NPC parity; rebuild; fresh-origin desktop
exercise of the chosen routes; save/reload/export/literal-file import at pending
and settled boundaries, without rerolls, duplicate bodies/stock or lost closures.
Use generated saves, never private user saves. Balance and human play acceptance
remain separate from technical evidence.

Lane closure: 8 source findings, 5 hunter types, 7 independent escalation dials,
7 ecology/society entries, 7 lair entries, 12 existing-enemy group rows, 5 crossing
routes, 24 considerations and exactly 5 suggestions. Rates, precise local law,
source-specific detection/defeat, schema/adapters, offline balance, performance
and playable integration remain UNKNOWN/unimplemented. No runtime edits, tests,
builds, browser/save actions, downloads, commit, push or publication.
