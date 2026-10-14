# Nonhuman starts: PLAY lane, 2026-10-14

Status: **INFERRED original design proposals**, not accepted decisions, implemented content or browser proof. This lane develops the play promise beyond the [engine owner](NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md), especially M1-M7 and M9-M11. All proposed body faculties, NPC responses, first-minute events, goods and progression below are INFERRED unless explicitly marked SHOWN or STATED. No franchise canon is asserted. No sealed file was read.

## Authority and evidence

**STATED (Weibao, via live owners):** nonhuman/tree starts, childhood, generated families and distinct beginnings are requested direction in [origins](ORIGINS_AND_WORLD_TIMELINES.md); food helps, hunger never kills and eligible passive progression does not require clicks in [food direction](../USER_VISION.md#food-benefits-and-famine-consideration-2026-10-13). [PROJECT.md](../../PROJECT.md) preserves one realm/one prestige layer and laptop/desktop priority. The specific mechanics in this report remain proposals.

**STATED (design owners, proposal status retained):** [shared audit](../SHARED_FOUNDATIONS_AUDIT_2026-10-12.md) U01 separates person/body/controller, U03 requires coherent means and beginnings, U12 declares carriers, X01 separates recognition from actual identity, X06 gives care real owners, and V06 requires exact retention without duplication. [Identity/control](PLAYER_CHARACTER_IDENTITY_AND_CONTROL_2026-10-13.md) offers ordinary roleplay, possession, advising and remote vessels as distinct premises. [Intro](../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md) SA14-SA19 asks for different verbs, holders/visitors, collectives, playable systems, ghosts and growth; CR4 requires truthful body effects. [Brood G9](../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md#g9-brood-play-autonomy-and-feedback-across-scales) keeps members, knowledge and actual control distinct.

**STATED (supporting proposals):** [north star](../LIFE_SIM_NORTH_STAR.md#why-this-exists) asks whether a life leaves a mark on a person or place. [Emergence](../EMERGENT_SYSTEMS.md#the-core-idea) connects small causal systems rather than scripted destiny. [Skills/means M1-M6](SKILL_MECHANISMS_AND_MEANS_2026-10-13.md) separates a result, mechanism, support, learning and retention. [Deeper interactions DSI1-DSI5](DEEPER_SYSTEM_INTERACTIONS_2026-10-13.md) supplies changing local demand, independent NPC boundaries, quiet success and bounded delegation. [Bodily needs](../HUNGER_AND_BODILY_NEEDS_CONSIDERATIONS_2026-10-13.md) keeps comfortable unfed play and fractional eligible passive growth. These are inspiration for joins, not an assignment to implement every system.

### SHOWN: Village anchors inspected in source

Locators are from reads on 2026-10-14; they establish definitions, not fresh gameplay execution.

| Anchor | Read locator | What can be reused; what is not established |
|---|---|---|
| V1 Village people and craft station | `src/data/locations.js:378-393`; `src/data/npcs.js:63-66`, `:81` | Elder, guard, old craftsman, trader; tier-one crafting, forging, smelting, cooking, alchemy, butchering, woodworking. Nonhuman recipes/services are new proposals. |
| V2 Training and work | `src/data/locations.js:1930-1983`; `src/activities.js:84-149` | Fieldwork trains Farming, pays on a 120-game-minute work period and has hours/seasons; Running, grain-bag Weightlifting, Meditation and patrol definitions. No shortened payday is assumed. |
| V3 Housing | `src/data/locations.js:396-409` | Shack is initially locked, contains housing and Sleeping XP. It does not yet establish a spirit anchor, nest or living-house body. |
| V4 Combat and rat context | `src/data/locations.js:469-503`; `:349-360` | Initially locked Infested field, wolf-rat enemies, clearing rewards; rat-dependent background text. That text does not prove a complete rat start or sentience recognition. |
| V5 Later mill | `src/data/locations.js:412-467` | Initially locked Eastern mill, millers and Eastern storehouse combat. Not an automatically available first-minute destination. |
| V6 Opening access | `src/data/dialogues.js:73-92`, `:164-190`; `src/data/traders.js:9-14` | Elder routes unlock field/training, market, fieldwork and later canal work. Human dialogue requires new adapters for proposed nonhuman starts; a trader is initially locked. |
| V7 Existing short-search constraint | `src/data/locations.js:2553-2581` | Missing grain-delivery search takes 15 game minutes and has Perception conditions. New tiny searches below are separate, not instant completions of this action. |
| V8 Gathering output | `src/data/locations.js:1985-2008` | Tool-required woodcutting can yield Rough wood log/Tree sap; sand is locked and tool-required. Plant sap production is not that existing gathering action. |
| V9 Skill palette | `src/data/skills.js:431`, `:538`, `:597`, `:931`, `:1183`, `:1269`, `:1354`, `:1464`, `:1575`, `:1942-2013`, `:2155-2257`, `:2470-2479`, `:2539-2583`, `:2845`, `:2930` | Spatial awareness, Night vision, Presence sensing, Swords, Farming, Sleeping, Meditation, Running, Weightlifting, gathering/crafts, Perception, Literacy, Medicine, Regeneration and Haggling are defined. New body-specific consumers and XP custody are not established by names alone. |

**UNKNOWN:** exact balance, costs, minute-by-minute native availability, offline settlement and whether every cited definition is consumed correctly. No build, test, browser or save operation was run. `src/data/activities/` is absent; activity definitions were inspected in `src/activities.js` and local bindings in `src/data/locations.js`.

## How to read the body palette

**INFERRED:** each profile proposes one original Village variant. Default means a recommended starting experience; Dial means reachable alternatives; Reasonably per world means faculties and social rules need a local source or explicitly original/AU premise. A verb is unique relative to an ordinary unmodified human body's direct faculties, not a ban on a human reproducing the result with magic, tools or helpers. Five distinct faculties do not mean five compulsory new XP tracks.

Ten-minute outlines use **real player attention** as a pacing target, not ten authoritative game minutes. Each names a small visible win and a routine ready to continue. Numerical payouts/timers are unselected. V1-V9 are existing anchors; every added interaction is a proposal. A slice can adapt an opening unlock with explicit origin authority; it cannot silently erase existing quest conditions or unlock the whole mill.

Every **idle** loop means queued work or a sustained supported condition while eligible game time advances. **Offline** loops are proposed opt-in bounded settlement of that same work, with actual stocks, actor availability and stopping rules. Default browser-closed behavior grants nothing and inflicts no new loss. This lane does not claim offline implementation. Common NP/NT policies apply to every profile, including its individual exceptions.

## Body profiles (INFERRED)

### BK1 Beast: a village hound

**Promise and verbs:** live through scent, territory and companionship. Track a named scent beyond ordinary human smell; read another hound's scent mark; broadcast a canine scent mark; pivot mobile ears toward separate sounds; brace/run on four paws; communicate with a tail-and-ear display. These are distinct proposed bodily consumers, not six renamed attacks. Dial: cat, wolf or other locally authored anatomy rather than attaching hound faculties to every beast.

**Active / idle / offline:** choose which trace to follow, whom to approach and where to escort. Queue a known boundary circuit, scent discrimination practice or safe rest; offline repeats only that authorized local route, stopping at an unfamiliar trail or threat. Remember one personally meaningful trace instead of grinding anonymous kills.

**Progress and skills:** grow tracking discrimination, pack bonds, a recognized name or a protected resting patch. Running and Spatial awareness get quadruped consumers; Perception uses scent/hearing. Bite/grapple technique replaces sword execution. Literacy knowledge can remain if the premise supplies it, but reading needs a supported channel; no free literacy from reincarnation alone.

**Needs, rest, defeat:** meals help recovery; unfed ordinary play remains viable. Shelter and companionship can be benefits without obligatory meters. Sleep in a den; injury interrupts the circuit and permits retreat, care or recovery at an agreed refuge. No automatic coin or XP loss.

**Social and economy:** guard may read a stray, threat or helpful animal according to observed acts; elder can recognize a repeated signal without knowing your private identity. Bark, posture, paw marks and later explicit speech are channels. A collar can denote custody without proving consent or legal ownership. Carry small goods in a harness, barter an escort service, keep earnings with a named holder, commission gear from V1; crafting knowledge can guide a cooperating artisan without awarding manual craft XP.

**First ten minutes:** V1/V2/V6 opening adapter: demonstrate a yes/no signal to the guard, follow a new short grain-scent trace, compare it with noise, choose whether to report or lead the guard, earn a recognized signal and queue a boundary circuit. V7's full delivery search remains separate. Optional V4 combat waits for real access and a retreat rule.

**Other starts:** familiar bond with an actual human, earned shapeshifting or a separately sourced human body. A future human can meet the same named hound and learn its signal; perspective change does not transfer its purse or memory automatically.

### BK2 Monster that evolves: a small gel creature

**Promise and verbs:** solve daily problems by changing your material body. Flatten through a narrow seam; engulf a loose object; extrude a temporary pseudopod; split off a non-sentient scouting feeler; dissolve an explicitly compatible scrap; alter surface tack to anchor yourself. Default: useful cooperative creature. Dial: predatory, elemental or non-gel evolution with its own faculties.

**Active / idle / offline:** choose one substance to test, retrieve something trapped, negotiate a safe work surface. Idle refines an already tested material or practices one organ. Offline consumes a capped approved scrap batch, never unidentified valuables or living visitors; novel integrations wait.

**Progress and skills:** branch into sensory membrane, gripping lobes, storage cavity, armor or an independent mobile form. Evolution adds usable functions rather than a mandatory linear rarity ladder. Perception/Spatial awareness retain transferable discrimination; Alchemy principles can guide testing. Engulf control and organ use are new practice; sword XP does not become pseudopod mastery.

**Needs, rest, defeat:** compatible intake helps growth, not survival-by-feeding. Settle into a dish for dormancy. Defeat disperses gel to a recoverable nucleus in this variant; retreat, regroup or request a vessel. No obligatory sample loss or generic weakness to water/fire.

**Social and economy:** craftsman first sees an unusual material, then can notice deliberate choices through repeated demonstrations. Shape glyphs, tap rhythms or use sourced speech. Traders can buy a defined cleaning service or safe resin rather than treating your body as free stock. Owned engulfed items remain identifiable; sell processed scrap, commission a container or self-grow body fittings using declared inputs.

**First ten minutes:** V1 workshop edge: flatten to retrieve a proposed dropped fitting, refuse/accept one known scrap, test tack on a grain bag from V2, show the craftsman a deliberate glyph and choose a grip or sensing project. Queue only the tested refinement; no instant recipe unlock or evolution is promised.

**Other starts:** become a construct's soft core, evolve into a beast-like form or earn a human vessel. A later human can find the same workshop creature and its remaining stock, not a respawned copy.

### BK3 Plant or rooted spirit: a sapling at Village's edge

**Promise and verbs:** make a small patch of land into a lived place. Extend roots toward a local water signal; photosynthesize; bud a leaf; exude sap from your own tissue; graft a compatible shoot; signal through directed leaf movement in this spirit variant. Default: fixed reach and real nearby life. Dial: mobile reedling, mundane plant with a separate communication source, grove or seasonal dormancy.

**Active / idle / offline:** choose root direction, signal a visitor, allocate a useful output. Idle grows an approved root route or tended shoot; offline follows known light/water/support and caps outputs, stopping at a contested boundary rather than colonizing someone's field automatically.

**Progress and skills:** growth, protected bark, naming, caretaker bond, local habitat or optional worship can open new reach/communication. Farming and Herbalism knowledge guide cultivation; root steering and sap control require plant consumers. Woodcutting knowledge can identify damage without authorizing self-harvest; Running has no current execution and stays available for a later compatible body.

**Needs, rest, defeat:** sunlight, water and tending support growth; their absence does not become a reskinned hunger-death clock. Quiet/dormant periods retain ordinary agency such as signaling. Broken growth can regrow from an authored surviving root or seed; transplantation/repair is another route, not universal bed respawn.

**Social and economy:** a caretaker may first call you a useful plant, then notice intentional signals. Rustling, leaf patterns, root-touch or sourced speech convey limited messages. Soil ownership, plant custody and personhood are distinct. Sell safe sap/fruit or shade service through a named agent, fund irrigation, commission protection; V8 sap gathering is not permission to harvest you. Grafting can be a craft action with real inputs.

**First ten minutes:** V1/V2/V8 setting: sense two nearby patches, grow a proposed short root toward one, signal the elder, demonstrate a repeatable leaf pattern and negotiate tending in return for one bounded sap output. Queue root growth. Do not assume early access to V6's later canal quest.

**Other starts:** consenting carrier/transplant, mobile seed avatar, construct vessel or sourced human form. A later human can rest beneath the original plant; whether seed and parent share a controller is declared, not inferred.

### BK4 Ghost or spirit: a quiet presence near the Shack

**Promise and verbs:** learn how to be present without ordinary flesh. Pass through a locally permitted thin wall; phase between visible and unseen presence; manifest a cold trace without bodily contact; resonate with a declared spiritual imprint; bind presence to an anchor; project a spectral outline. Default: talk-and-help mystery without compulsory tragedy. Dial: freely roaming spirit, unfinished business or no material influence.

**Active / idle / offline:** investigate accessible traces, choose a manifestation and communicate with a witness. Idle practices a known signal or maintains a ward within anchor reach. Offline preserves presence and rehearses that signal; it invents no conversations, newly learned secrets or visitor bargains.

**Progress and skills:** naming, clearer manifestation, anchor range, bonds or voluntary reverence can develop. Meditation and Perception get spirit-compatible consumers; Presence sensing is possible only with its actual faculty. Haunting practice replaces Running/Weightlifting. Retained Literacy still needs visible/written material access, not wall-omniscience.

**Needs, rest, defeat:** no food need by default; offerings can help manifestation without becoming compulsory worship. Rest by quieting at the anchor. Dispersal returns to a known anchor or allows a helper to reassemble a trace in this variant; no forced eternal banishment or lost levels.

**Social and economy:** guard may hear a noise, suspect a haunting or recognize a deliberate knock. Knock codes, condensation writing, visible manifestation and sourced speech are separate routes. Fear follows evidence and local belief, not a global ghost penalty. Commission work through a witness, receive a service fee in an account held by that witness, use an anchor charm rather than boots; crafting can be ritual participation or direction of a real artisan.

**First ten minutes:** V3 exterior, without granting Shack housing access: choose a safe anchor, repeat a new knock signal, direct the guard toward an ordinary lost token, decide whether to manifest and queue signal practice. A helpful receipt is not proof of your former name.

**Other starts:** possessing spirit, bonded familiar, sentient object or earned living body. A human later discovers the same anchor and known messages; haunting lore is authored original material, not a sealed truth revealed here.

### BK5 Possessing spirit: a guest in a clay vessel

**Promise and verbs:** learn embodiment through a real relationship or vessel. Leave your current vessel; enter an admitted vacant vessel; share a consenting host's sensory stream; overlay a host's motor channel under agreed control; transmit a word internally without sound; leave an identifiable spiritual signature after departure. Default: cooperative guest or ownerless constructed vessel. Dial: contested possession/replacement with disclosed control terms, not automatic resistance.

**Active / idle / offline:** select an admitted body, test one function, communicate boundaries and return. Idle rehearses a negotiated shared routine or vessel control. Offline uses only the approved control window and route; switching hosts or expanding authority waits for a choice.

**Progress and skills:** connection, reliable return, new vessels and mutual coordination; domination is an optional premise, not the required endpoint. Knowledge stays with its actual knower. A host's Running or craft habits are available only under the selected access policy; practice can improve that body's coordination without duplicating XP in both people. Guest control is a distinct practice consumer.

**Needs, rest, defeat:** vessel upkeep and host meals are separate; no hunger death for either. Rest outside, share agreed downtime or park in a maintained vessel. Loss of a clay vessel can return the guest to its anchor. Host injury remains theirs; return does not erase it. No universal backlash or surrender fee.

**Social and economy:** an NPC recognizes the visible vessel/host first; manner or a witnessed transfer can support a new identity claim. Internal dialogue, vessel taps and host speech have different audiences. Host coins/tools remain theirs unless transferred. A guest commissions repairs, rents an admitted vessel or earns an agreed share of cooperative work; gear fits the occupied body, crafting credits the actual practitioner.

**First ten minutes:** V1 old craftsman: an original offered clay shell, not an assertion that the engine owner's Tern route starts here. Tap, enter, manipulate one loose fitting, negotiate repair custody and return on purpose. Queue clay-hand control at the bench. Show both guest and vessel status.

**Other starts:** ghost when unoccupied, construct when housed, shared host or genuinely human embodiment with its own carrier rule. A future human can find the parked shell, with no entitlement to its occupant.

### BK6 Sentient object or weapon: a speaking practice blade

**Promise and verbs:** become useful and known through changing hands. Feel pressure along your own blade; resonate through your own metal; project a hilt-bound message into an admitted wielder; alter a locally sourced edge state; store a declared strike imprint in the blade; recall yourself to a bonded sheath through a sourced link. Default: no autonomous walking, cooperative wielding. Dial: ordinary speech, self-levitation, ceremonial object or tool instead of weapon.

**Active / idle / offline:** decide what to tell a holder, whether to bond and which task to support. Idle practices resonance or participates in a bounded wielder drill. Offline drills only if the wielder and place are available, pays their time and stops on disagreement; pocket time does not award combat XP.

**Progress and skills:** naming, bond trust, tempering, inscriptions, parts or a reputation across holders. Swords knowledge can inform timing, but the wielder owns their physical technique; the object's edge-control practice owns its different contribution. Perception reads contact/vibration if supported; Forging knowledge permits instruction, not self-forging without a means.

**Needs, rest, defeat:** no meals by default; polish/tempering can be useful upgrades without mandatory decay. Rest in a sheath or rack. Cracking interrupts edge use; reforge the same identified object, act through a retained hilt or negotiate another vessel. No compulsory destruction on holder defeat.

**Social and economy:** guard can call you equipment until an intentional message is witnessed. Holder, owner, bonded partner and recognized person are different statuses. Voice, resonance and hilt-link have different reach. Keep service earnings in an agreed purse, buy sheath/runes/wraps through an agent; crafting modifies the same unique item, not a duplicate copy of your body.

**First ten minutes:** V1 craft bench and guard: signal with resonance, choose a temporary holder, coordinate one practice strike, show the distinction between your contribution and theirs, agree a return-to-rack routine. V6's weapon-gift dialogue needs adaptation, not granting a second player-sword.

**Other starts:** become a construct core, obtain a projected or human body, remain an heirloom found by a later human. The finder gets custody, not automatic control or friendship.

### BK7 Place, dungeon core or haunted house: the Shack awakens

**Promise and verbs:** shape a home that people choose to visit. Sense footfalls across your own floor; move a bonded door without limbs; redirect a locally supported room ward; grow a magical interior alcove; animate a fixture; project a voice from a wall. Default: safe living Shack with finite reach. Dial: dungeon core, hostile haunted house or larger territory, each with its own actual rules.

**Active / idle / offline:** choose a visitor policy, orient a room and negotiate a use of space. Idle completes one funded repair/ward job or tends an approved room. Offline advances that job and records known arrivals, but does not admit strangers, trap them or sign leases without a policy.

**Progress and skills:** parts, rooms, local territory, naming, tenant bonds or optional worship. Woodworking/Forging knowledge helps design; building requires stock and a capable executor or sourced self-building faculty. Spatial awareness operates inside the body footprint; Meditation can tune a ward. Running is replaced by room/fixture control, not renamed movement between towns.

**Needs, rest, defeat:** no food; shelter maintenance and magical charge are useful support, not forced daily tax. Dormancy can leave rooms usable under agreed terms. Defeat shutters damaged rooms or retreats to a surviving core; repair, relocation of the core or mediated rebuilding remain authored options. Not universal homelessness or tenant death.

**Social and economy:** elder can see a useful shelter, guard a suspected haunting, tenant a friend. Door rhythms, wall speech and written notices provide evidence. Ownership of land/building is not ownership of a recognized mind. Earn rent or services only from actual agreed occupants; buy materials through a steward, hold stock in real rooms, craft fixtures with workers.

**First ten minutes:** V3 is an explicit alternate origin giving the player a defined Shack footprint, not silently unlocking vanilla housing. Open a door, demonstrate one fixture response to the elder, choose a quiet visitor boundary, allocate a provided repair board and queue its installation. Avoid a dungeon generator in the first slice.

**Other starts:** portable core into a construct, spirit manifestation or later human body; future human tenant/wielder can encounter the same place. Leaving does not export land as inventory or evict inhabitants automatically.

### BK8 Construct or golem: an apprentice helper

**Promise and verbs:** customize how work feels through parts. Replace a detachable hand module; lock a joint as a brace; route charge into one circuit; feel stress through an embedded frame sensor; detach a still-linked probe; reassemble a named compatible limb. Default: small cooperative helper. Dial: clockwork, clay, stone or magical material with different functions.

**Active / idle / offline:** inspect a joint, choose grip/brace/probe and negotiate a task. Idle does a funded repeatable bench job or recharges. Offline uses the same reserved bench, parts and charge budget; depletion parks safely rather than causing new catastrophic failure.

**Progress and skills:** better parts, learned calibration, creator/peer bonds, naming and independent work. Weightlifting can use actual load support; Crafting/Forging principles and Perception transfer when known. Calibration is bodily practice; installing a better arm changes capacity without fabricating mastery. A maker's skill does not automatically become yours.

**Needs, rest, defeat:** fuel/charge can support boosted output while ordinary low-power practice remains viable in the default variant. Rest at a charger, still frame or workshop berth. Broken joints disable those functions; repair, a loaned limb or a temporary stationary task is recovery. No automatic coin loss or universal rust curse.

**Social and economy:** craftsman might first treat you as equipment, then respond to deliberate choice. Voice box, chalk grip and signal lamp communicate. Creator, maintainer, owner and controller can disagree without automatic hostility. Paid work goes to a declared account; buy compatible modules, borrow tools and craft using actual grip/source. Salvaged parts require legitimate custody and compatibility.

**First ten minutes:** V1/V2: choose one provided hand, signal an independent preference to the craftsman, brace a grain bag, notice a frame strain, switch to a safe grip and queue calibration. The short demonstration is new content, not a full Weightlifting payday.

**Other starts:** spirit in a frame, weapon-core, earned biological/human shell or modular successor. A later human finds a parked construct whose condition, mind and outstanding job survive.

### BK9 Collective, hive or brood: three linked original insects

**Promise and verbs:** be in several places through a real connection. Perceive through two linked members at once; lay a chemical trail for the colony; route a signal through living relays; assemble a body cluster around an object; bud a specialized member in a nursery; redistribute a declared shared energy reserve. Default: one colony mind, three bodies, small reach. Dial: founder commanding independent people, consenting network or coerced brood; these are different control models.

**Active / idle / offline:** assign scout, gatherer and nest-tender; choose which discovery to follow. Idle members repeat their own supported jobs while relevant observations reach the chosen controller. Offline settles bounded batches per assignment, stops contested recruitment or expansion and preserves isolated members' actual continuation policy.

**Progress and skills:** nest territory, roles, specialization, naming, recognition, optional worship or links. Perception knowledge belongs to its real knower/shared channel; gathering and craft practice belong to actual member/body execution. Founder level is not free mastery for every new worker. Coordination practice grows a concrete relay or scheduling capability.

**Needs, rest, defeat:** provisioning helps growth without starving members to death. Rest can rotate active bodies. A defeated scout interrupts its task; surviving bodies retain their own experience. Rescue, repair/nurture or growth of a new body can recover reach, but replacement does not resurrect an independent person automatically. No universal founder-death wipe.

**Social and economy:** elder may recognize a recurring cluster, fear an infestation or befriend its messenger after evidence. Chemical channels do not automatically communicate with humans; arrange pebble glyphs or use a sourced translator. One purse/storehouse avoids duplicated money. Sell a bounded retrieval/pollination service, commission a nest fitting, gather real tiny inputs; a crafting team credits its actual practitioners.

**First ten minutes:** V1/V2 backdrop: use a proposed nest beside the workshop, assign two short paths and one tending job, relay a found loose bead, choose one message to show the craftsman and queue retrieval of approved scraps. No instant town-wide hive or full brood reproduction simulation.

**Other starts:** focus on a disconnected member, grow a beast/construct avatar or meet a later human caretaker. Split/rejoin declares which minds, memories, stock and commitments move.

### BK10 Familiar or pet bonded to a human: a lantern moth

**Promise and verbs:** share a life without being someone's gear. Send a sensory impression across a bond; feel a specified partner's call remotely; perch and travel on their shoulder; illuminate with your own sourced glow; spin a protective silk wrap from your body; fold wings to pass a small aperture. Default: cooperative magical moth and an authored partner. Dial: ordinary pet without magic, independent familiar or constrained ownership premise.

**Active / idle / offline:** explore a reachable ledge, choose what to share and negotiate a joint errand. Idle practices a known signal, tends silk or accompanies the partner's funded routine. Offline follows agreed route/time limits and pauses departure or new promises. A sleeping partner does not erase your independent local options.

**Progress and skills:** bond clarity, naming, glow precision, silk work, independent territory or new form. Perception can use your own senses; partner knowledge is shared only through the declared channel. Climbing/Running do not automatically become flight XP. A new flight-control consumer handles wings; Literacy needs a readable projection or learned means.

**Needs, rest, defeat:** suitable meals offer recovery; no hunger death or universal separation damage. Rest in a chosen nest/partner pouch. Injury means retreat/care; optional bond-supported recall if sourced. Partner defeat does not automatically kill you, and your defeat does not secretly kill them.

**Social and economy:** guard may see a pet, craftsman a skilled helper; repeated intelligible signals can establish personhood. Bond messages reach one partner, glow patterns others. Adoption/custody is not an irrevocable control contract. Share only agreed earnings, sell silk/light service, buy perch/glow fittings via partner or merchant; silk crafting is your work, the partner's sewing remains theirs.

**First ten minutes:** V1/V6: meet an original consenting guard-side partner, choose a shared glow signal, inspect a workshop ledge, send one observed image, choose whether to accompany a short errand or stay tending silk, and queue your selected routine. Do not assume existing guard dialogue already models a bond.

**Other starts:** independent beast/small creature, spirit after loss under explicit terms, or sourced human form. A future human can find/adopt/befriend you while the old bond/history still matters.

### BK11 System, AI or patron guiding a host: a local guiding presence

**Promise and verbs:** play advice and granted means rather than moving someone like a puppet. Project a private HUD through a sourced channel; send an internal message without sound; allocate a genuinely owned blessing; monitor one permitted host vital remotely; store a declared memory outside the host's body; instantiate a locally supported training projection. Default: original magical advisor with one cooperative host. Dial: artificial hardware AI or divine patron needs its own infrastructure; no ubiquitous Village internet is presumed.

**Active / idle / offline:** suggest a task, explain your information and negotiate a budget; host can agree, misunderstand or decline under the chosen contract. Idle maintains an approved cue/training order or studies an accessible record. Offline settles only the host's agreed routine and your own supported work; refusal produces a visible alternative, not compulsory obedience.

**Progress and skills:** communication fidelity, archive, host trust, granted faculties, succession of hosts or optional worship. Advisor Literacy/research knowledge stays theirs; host Running/Farming improves through actual host practice. A projection can teach without supplying anatomy/fuel. Blessing capacity and grant authority are distinct from Haggling mastery.

**Needs, rest, defeat:** no food for a bodiless advisor; host food follows ordinary direction. Quiet mode, hardware recharge or attention withdrawal is source-local. A severed channel leaves its supported archive/anchor and permits reconnection/new hosting; host continues according to their own life policy. No universal host punishment or forced resource tithe.

**Social and economy:** private host communication does not make outsiders know you exist. Host testimony, witnessed projection or local diagnostics establish different evidence. Give/loan your actual resources; host purse is separate. Earn advice/services only through a contract, commission an anchor, help plan crafting while host/artisan owns execution and learning.

**First ten minutes:** V2/V6 adapted human opening: clarify one private signal, offer Running or Meditation, let the host state a preference, observe actual progress, explain one known constraint and agree a continuation boundary. No invented reward currency for assigning a quest.

**Other starts:** manifested spirit, sentient device, construct or embodied human; a later human can discover an archive or become a new host without automatically inheriting the former person's mastery.

### BK12 Infant or child: an ordinary dependent life, optional awakened variant

**Scope honesty:** infant/child is a human life stage. Five verbs an ordinary human literally cannot do would contradict this category. The ordinary route therefore has five **stage-shaped verbs**, not falsely nonhuman powers: establish a caregiver signal, learn a local word, practice supported motor control, recognize a familiar voice, ask for a supervised task. An adult can perform related actions; the distinctive play is developing reach and relationships. Default: meaningful ordinary agency, no supernatural prerequisite.

**Optional supernatural five-verb palette:** for an explicitly awakened spirit-child variant only, form an internal soul cocoon; transmit a thought before vocal speech; perceive a sourced prenatal memory trace; bud a temporary spirit-hand independent of motor development; share a caretaker's senses through a specified bond. These are INFERRED magic, not claims about ordinary infancy, universal biology or canon. Dial: child with local competence, remembered-life infant or ordinary child; memories alone supply none of these powers.

**Active / idle / offline:** select attention, repeat a signal, explore a reachable object or ask a question. Idle listens to agreed instruction, practices a signal or rests under an actual care routine. Offline by default freezes; opt-in settlement budgets caregiver availability and stops before a consequential chapter advance. No attendance requirement for supported passive learning.

**Progress and skills:** growth, language, bond, naming/social recognition and supervised craft. Existing Literacy can develop through actual instruction; retained knowledge remains distinct from speech/grip. Perception/Meditation are adapted only where supported. Running, Weightlifting and weapon execution wait for appropriate functions; no automatic adult skill package at a birthday.

**Needs, rest, defeat:** meals help, care is supplied by a named capable NPC, sleep is ordinary rest. Distress/injury pauses the affected practice and opens care, comfort or safer work. No hunger death, universal developmental stat penalty or forced years of real-time waiting; chapter advancement discloses consequences.

**Social and economy:** adults may misunderstand an early signal or recognize a learned one. Caregiver, guardian and legal heir are separate roles; supported children can make friends, refuse a task or request help. Household coins/tools remain household-owned. Trade through permission/allowance or a caregiver, wear stage-fit goods, earn a small supervised craft output without duplicating the adult's inventory.

**First ten minutes:** original caregiver setting at V3's exterior or explicitly admitted housing: choose a voice/object, learn one repeatable request, get an observable response, select a supervised V1 craft observation or V2 field visit, then queue learning. A chapter preview offers later child play without completing future Village quests.

**Other starts:** grow into a human adult; acquire a familiar/advisor relationship; an optional world-supported transformation can lead elsewhere. A later human may meet you as caregiver/friend or encounter your earlier records; viewpoint switching does not rewrite parentage.

### BK13 Undead: an original animated skeleton

**Promise and verbs:** live beyond flesh without making monstrosity compulsory. Detach and reconnect a hand; see through a sourced skull faculty without eyes; reassemble identified scattered bones; store a harmless object within your rib frame; remain active without breathing; route a declared animating thread through a replacement bone. Default: articulate, cooperative skeleton. Dial: revenant, corpse-bodied person or vampiric form, with different faculties and needs.

**Active / idle / offline:** choose repair, conversation or a bodily trick that helps work. Idle calibrates an accepted joint or completes a safe carrying order. Offline performs that known job with finite supplies; no automatic nocturnal attacks or feeding on neighbors.

**Progress and skills:** parts, naming, repaired self-image, social bonds, local recognition or an optional animating source. Running/Weightlifting can read skeletal functions; anatomy-bound vitality skills need an explicit undead consumer. Literacy/Medicine knowledge can remain, while regeneration/repair is source-specific. A bone replacement improves structure without granting donor skills.

**Needs, rest, defeat:** no food for this skeleton; offerings/charge may help animation without compulsory draining. Rest is stillness in a chosen refuge. Scattering permits reassembly from an authored retained core and recovered parts. Missing pieces create actual function changes, not a generic XP penalty; care/repair offers a useful noncombat task.

**Social and economy:** guard may be startled, suspicious or accustomed according to local setting; a witnessed helpful act is evidence, not universal acceptance. Voice, taps or writing communicate. Corpse provenance, former identity and current personhood remain separate claims. Earn work payments, buy braces/wraps, commission parts and craft with functioning grip; carrying a bone does not mean owning the person.

**First ten minutes:** V1/V2: reattach a provided hand, deliberately wave to the guard, brace a bag, choose a repair instead of more strain, establish a name/signal and queue joint calibration. No mandatory combat to prove you are safe.

**Other starts:** ghost if animation separates, construct vessel, restored living body or human appearance through a real means. A future human can discover your remains and request a response, not loot an automatically empty body.

### BK14 Shapeshifter: two known forms

**Promise and verbs:** choose the embodiment that serves today's life. Change into an authored hound form; regrow an admitted human hand; redistribute a declared body mass; restore a learned facial pattern; shift your own scent signature through a sourced faculty; selectively manifest a known sensory organ. Default: human/hound with disclosed carry rules. Dial: fixed forms, fluid anatomy, disguises or large forms; no arbitrary unlimited new species library.

**Active / idle / offline:** choose a form for a task, negotiate whether to disclose it and test one partial change. Idle practices a known transformation or repeats work in a pinned form. Offline does not switch into a materially different social identity or incompatible gear automatically; it can stop and request that choice.

**Progress and skills:** stable forms, precision, anatomy library, naming/recognition and bonds that cross appearances. Literacy/theory can remain; Running has different practiced execution per anatomy. Haggling needs a communication route in the current form. Shifting mastery changes control/transition precision, not every combat skill at once.

**Needs, rest, defeat:** meals support current form, with one declared resource account rather than eating in every form for stacked bonuses. Rest in a chosen stable shape. Injury carries, converts or remains body-local according to the selected rule; do not hide an automatic cleanse or add universal instability. Recovery can be care, a compatible stable form or actual transformation healing if granted.

**Social and economy:** NPCs recognize observed face, scent, behavior or witnessed shifts; no instant universal exposure or loyalty wipe. Human speech, beast posture and writing differ by form. One purse/item set; harness/pack/storage handles incompatible equipment. Craft in a capable form; shifting to a skilled appearance does not supply its expertise or legal title.

**First ten minutes:** V1/V2/V6: show the guard a planned shift, do a short human grain-bag demonstration and a hound scent task, compare actual functions, choose a work form and queue its practice. Establish one witness who can recognize continuity without informing all Village.

**Other starts:** enter directly as beast, remain human or obtain other earned forms. A later human may recognize an old companion from evidence; recognition is local and fallible.

### BK15 Small creature: an original clever rat, with bird alternative

**Promise and verbs:** make scale into access and a different home. Rat variant: traverse a rat-sized wall gap; perceive nearby contact with a whisker field; stabilize a tight turn with a tail; gnaw a compatible thread with rodent incisors; carry a scent-mark message intelligible to another rat. Bird alternative has its own five: fly on wings; perch using grasping feet; preen flight feathers with a beak; weave a nest with beak/feet; use a sourced species-specific call channel. These do not stack onto a universal small-creature template.

**Active / idle / offline:** explore one small path, retrieve one approved object and select whom to trust. Idle rehearses a known route or improves a nest with available scraps. Offline repeats safe retrieval within permitted spaces; entering new rooms, stealing stock or encountering a predator stops the order under its policy.

**Progress and skills:** nest territory, route knowledge, naming, communication, bonds or optional awakening. Perception/Spatial awareness read real senses; Climbing may map to rat limbs, flight needs a bird consumer. Human Running/gear effects are not copied at full strength. Literacy knowledge can carry, but page scale/visibility/turning needs means. Gnawing or nest work can replace hand crafting without granting every recipe.

**Needs, rest, defeat:** small meals help; no accelerated hunger death or universal fragility multiplier. Rest in a protected nest. Retreat, rescue and recovery in shelter follow the local variant; do not silently respawn into hostile extermination encounters. A bird's damaged wing changes flight, not all intelligence and social progress.

**Social and economy:** V4's pest context gives a reason some villagers may misidentify a rat, not a blanket attack rule. Paw-taps, arranged beads, calls or sourced speech can show intention. A human can offer shelter or custody without instant ownership of a recognized person. Trade tiny retrieval services, keep money in a named cache/agent account, commission small gear and craft nests from legitimately held scraps.

**First ten minutes:** V1/V4: start at a proposed workshop skirting gap, demonstrate a bead pattern, retrieve a dropped fitting through that gap, choose nest or messenger practice and queue the safe path. V5 mill/storehouse remains later content; recognition as a player rat does not make enemy wolf rats friends or copies of you.

**Other starts:** familiar bond, collective member, awakened beast, shapeshifter or gained human body. A later human can find the same nest and learn its signal; nest stock and former allies persist under their declared owners.

## Cross-cutting considerations (INFERRED)

| Code | Default + Dial + Reasonably per world | Observable play question |
|---|---|---|
| NP1 | **A positive body promise.** Default: one unique faculty changes a real result, one person responds, one supported idle routine remains. Dial: powerful, vulnerable or already-established starts. Reasonably: unequal starts can differ, but a limited body is not only a human with disabled buttons. | Does root reach, scent or room control solve something the current human route cannot directly do? |
| NP2 | **Useful passive time.** Default: show the condition/job, actual actor, means and next useful milestone. Dial: practice, exposure, growth, study or delegated output. Reasonably: Famine follows the accepted passive rule where applicable; not every skill earns unconditional XP. | Does unattended eligible time give positive progress, including tiny fractional growth, without toggle/login awards? |
| NP3 | **Offline is an explicit promise.** Default: closed-browser freeze, no newly imposed penalties. Dial: opt-in bounded job settlement, capped absence or reviewed chapter advance. Reasonably: use the common clock and declared NPC availability; visitor presence is not a perpetual resource generator. | Are costs/output and paused exceptions identical for equal eligible time, without replaying production on reload? |
| NP4 | **Recognition is a relationship, not a global switch.** Default: each witness knows what they observed and can be mistaken. Dial: common talking animals, hostile superstition, lawful personhood or sourced perfect identity detection. Reasonably: a message can establish intention without proving your old name or truthfulness. | Can the guard recognize your signal while the trader still thinks you are an ordinary stray? |
| NP5 | **Communication can itself progress.** Default: one useful starting channel, no click-by-click charades for settled routines. Dial: speech from day one, evolving code, translator, telepathy or nonverbal-only life. Reasonably: expose what the actual receiver can understand; save the learned convention. | Does learning “yes,” “no” or “come here” open a concrete choice and remain understood later? |
| NP6 | **No universal needs tax.** Default: comfortable unfed play and helpful meals; exemptions remain real. Dial: sourced fuel, sunlight, worship or stronger optional survival logistics, still no hunger death. Reasonably: distinguish missing growth support from losing ordinary agency. | Can the plant signal and the construct practice safely when an optional growth boost is absent? |
| NP7 | **Recovery leaves a playable next step.** Default: local retreat/care/repair/anchor recovery; show the affected function. Dial: source-supported severe loss or terminality with known terms. Reasonably: ghost dispersal, broken blade and child distress are different outcomes; neither guaranteed total loss nor universal loss immunity. | After defeat, can the player identify a supported next action without a compulsory restart or generic coin tax? |
| NP8 | **Rights, custody and affection are different.** Default: world-local institutions and evidence; a bond is not a slave title. Dial: recognized citizens, protected dependents, owned objects, contested property or darker coercion. Reasonably: actual world rules can be unfair; cooperation, escape, advocacy and remaining in a chosen role are possible when their means exist. | Can an NPC love a pet yet misunderstand its autonomy, and can that situation actually change? |
| NP9 | **Economy has a useful endpoint.** Default: one saleable service/output, one meaningful purchase and a real holder/account. Dial: direct coins, barter, agent, household allowance or collective stores. Reasonably: a free powerful faculty can disrupt a local demand without mandatory nerfs, price inflation or a parallel currency. | Does a plant's sap pay for protection, or a sword's service pay for a sheath, through a real transfer? |
| NP10 | **Others own their work.** Default: helpers have availability, means and a boundary; output/XP go to the actual executor. Dial: direct body control, independent members or bounded delegation. Reasonably: a reliable consenting team can remain reliable; conflict need not be fabricated every session. | Can the familiar stay home while its partner works, and does that choice avoid double-counting both jobs? |
| NP11 | **A quiet life is progression.** Default: a maintained nest, recurring customer, known friend or useful room is a viable arc. Dial: evolution, conquest, exploration, worship or chapter closure. Reasonably: remaining a rat or tree is not failure to unlock human form; worship does not need to be everyone's fuel. | Does a settled routine leave a recognizable life worth revisiting? |
| NP12 | **Small causal joins beat a universal simulation.** Default: one sensory distinction, one meaningful material/output, one witness and one bounded job. Dial: more organs, visitors or members when they change decisions. Reasonably: aggregate distant repeated work; retain individual evidence/custody where it matters, especially brood G9. | Can one saved retrieval alter one relationship or service without simulating the whole Village minute by minute? |
| NP13 | **Bodies overlap without flattening identity.** Default: kind labels describe supported functions, not exclusive species slots. Dial: undead beast, spirit sword, hive construct or shapeshifting child. Reasonably: compose only locally compatible faculties, declare precedence and retain one actual resource/item owner. | Is a spirit in a blade still the same controller, and which body is currently doing the work? |
| NP14 | **Reproduction is not free extra control.** Default: distinguish offspring, buds, clones, new modules and copied minds. Dial: one shared mind, independent offspring, inherited traits or adoption. Reasonably: X06 assigns nursery supplies, care time and legal/social roles; inheritance is not automatic memory duplication. | Does a new worker actually know a scout's route, and who cares for it while the founder is busy? |

## Transformation between bodies (INFERRED)

These expand U12/V06 and engine E9/E13/E14 as play contracts, not a second transition engine.

| Code | Default + Dial + Reasonably per world | Example and eventual check |
|---|---|---|
| NT1 | **Preview the known change.** Default: before commitment show new usable functions, reach, needs, equipment placement and current jobs. Dial: voluntary shift, earned evolution, forced source event or mystery body. Reasonably: conceal undiscovered identity truth, not known severe-risk/control terms. | “Hound: follow scents; no hand grip; sword stays in your stored pack.” Mystery preview does not disclose a sealed origin. |
| NT2 | **Carry knowledge and execution separately.** Default: actual retained memories/theory remain; bodily practice/faculties follow the selected carrier. Dial: perfect transfer, instinctive familiarity, new learning or no memory. Reasonably: do not impose universal awkwardness or erase mastery because an adapter is missing. | Literacy can remain after becoming a plant; reading needs a channel. Innate root steering can be fully operative without a remedial grind. |
| NT3 | **Settle one item once.** Default: each item remains with its owner/holder, in a compatible slot, stored at a reachable place or deliberately transferred. Dial: sourced shrinking, engulfing, pocket dimension or destruction with known terms. Reasonably: object-as-body stays a unique item; no drop-and-equip clone. | Blade gains a construct shell: either mounted in it or left with the guard, never both. Preserve loans and return commitments. |
| NT4 | **Update work at a real boundary.** Default: continue compatible work, pause incompatible execution and retain paid progress/remaining inputs. Dial: authored conversion to a new method or cancellation with stated settlement. Reasonably: optional automatic shifts use a selected policy, not a hidden worker replacement. | Root growth pauses after gaining legs; a helper may continue only with an actual assignment. Do not refund inputs and keep the finished output. |
| NT5 | **Relationships persist as histories; recognition needs evidence.** Default: same person retains their side of bonds/commitments, while observers know only what reached them. Dial: soul-recognition, witnessed transformation, impersonation or independent new person. Reasonably: identity change need not wipe affection or immediately inherit a host's office. | Guard witnessed hound-to-human shift; trader did not. An unchanged nickname is a claim, not universal proof. |
| NT6 | **Injury, resources and loss follow a selected mechanism.** Default: show whether they carry, convert, stay with the old body or genuinely heal. Dial: restorative evolution, replaceable vessels, shared reserve or independent vitals. Reasonably: no hidden full-heal farming and no mandatory shared injury when separate bodies are advertised. | Ghost takes a clay vessel: clay cracks belong to the vessel; dispersal belongs to the spirit. Re-entering does not mint charge or repair clay for free. |
| NT7 | **Keep becoming human optional.** Default: finish the current life's promise in its own body. Dial: human body, temporary avatar, disguise, restored flesh or separate human perspective. Reasonably: each requires an actual world-supported route; a new perspective is not proof of consciousness transfer. | The tree can remain a grove; a later human gardener can become playable without stealing the tree's mind or goods. |
| NT8 | **Departure has an aftermath.** Default: vacated bodies, hosts, children, tenants and isolated members keep declared owners and continuation policies. Dial: shared presence, split mind, retirement, merging or ending. Reasonably: no abandoned-host deletion or unannounced tenant eviction; a source can genuinely end a connection. | Advisor leaves: host retains genuinely learned Farming, loses only borrowed functions that actually depended on the advisor. |
| NT9 | **World crossing carries supported things.** Default: inspect destination admission, scale, ecology, language and source compatibility; a carrier moves actual cargo. Dial: exception/cheat/AU or portable body. Reasonably: a house travels via a real core/territory mechanism, not because ordinary character travel ignores immobility. | A transplanted spirit-tree carries the admitted roots/seed and items, not every acre of its old garden. Unsupported absent-world growth stays frozen. |
| NT10 | **Durable transitions preserve the same outcome.** Default: future delivery needs rebuild/fresh origin plus save, reload, export/literal import around one chosen transformation. Dial: old-save migration or explicit compatible schema decision. Reasonably: verify person/body/controller, jobs, equipment, knowledge, injuries, stock and recognition evidence separately. | Repeated previews/imports do not evolve again, duplicate parts, reroll identity or replay a naming reward. Not tested by this design lane. |

### Three short continuity walks (INFERRED)

**Beast → familiar → human:** the hound earns a name and escort payment; an explicit bond adds a private channel without transferring the partner's money; an earned human body retains declared memories and bond. Harness and stored coins still have one holder. The guard can recognize the witnessed change while another NPC requires a signal. A broken escort commitment remains part of history.

**Rooted spirit → portable core → construct:** plant growth leaves real roots/outputs at the original patch; a selected transfer moves the continuing mind/source into one unique core. The old plant can remain living but is not automatically a second controlled copy. The construct opens grip; Farming knowledge survives, plant-only production does not unless actually retained. An unpaid tending agreement must be renegotiated, delegated or ended rather than silently forgotten.

**Sword → found by a new human:** switch player perspective only under an explicit contract. The blade remains a person/object with its history and a real holder; the human has their own skills, money and motives. A bond can permit shared play later. No default assumption that the sword's controller became the finder, that found property is legally theirs, or that all observers now know the blade speaks.

## UI and text needs on a laptop screen (INFERRED)

Target: **1366×768 laptop**, with 1440×900 as a useful wider comparison. Visible outcome: current presence, usable body verbs, chosen routine/progress and nearest social/economic option stay legible together in the existing workspace. Mobile optimization is deferred. These are proposed acceptance questions, not screenshots or measured UI results.

| Code | Default + Dial + Reasonably per world | Visible outcome / future check |
|---|---|---|
| NU1 | **Body and presence in the current character/location panels.** Default: concise form, reach/carrier, controller and current state. Dial: expand anatomy/host/network details. Reasonably: show only known faculties; private identity stays sealed. | “Clay shell at workshop; guest controls grip; original anchor nearby” is clearer than a human race badge. No mandatory six-panel anatomy dashboard. |
| NU2 | **Actions lead with what you can do.** Default: show the unique usable verbs next to local actions, not beneath a long disabled human list. Dial: expand known unavailable actions/reasons. Reasonably: suggest a known alternative without leaking undiscovered means. | Rooted start visibly offers Grow roots, Signal visitor and Tend shoot; a known unavailable Carry bag says “No mobile grip; request a carrier.” |
| NU3 | **Routine, support and next change stay visible.** Default: activity line, finite budget/support, progress and reason for pause. Dial: queue details/member rows. Reasonably: no universal ETA when completion is uncertain; no “offline earnings” for frozen time. | “Grip practice; clay intact; next: hold a loose fitting” uses an actual future milestone. Tree growth does not show human Sleeping XP by mistake. |
| NU4 | **Speech identifies speaker, receiver and channel.** Default: distinguish your message, the host's reply and observed NPC reaction. Dial: first/third person or diegetic system styling. Reasonably: internal advice is not public speech; fallible belief is not secret truth. | “You send the host a cue. They agree to train.” No false “You decide to run” in independent-host mode. |
| NU5 | **Trade shows who owns and holds things.** Default: accessible stock/purse beside the trader and a small custody line for an agent or host. Dial: expand communal stores/loans. Reasonably: bespoke slots replace humanoid slots only where relevant. | Blade shows hilt/sheath, plant shows protective fittings, brood shows selected member gear. Purchasing through a partner is a real transfer, not pooled money by appearance. |
| NU6 | **Several bodies need one useful focus.** Default: select an acting body/member and show other ongoing jobs in compact rows. Dial: synchronized views or facility room list. Reasonably: performance scales with relevant decisions, not every insect render. | Three-member brood shows job, location/reach, condition and last delivered evidence; selecting a scout does not give unreachable nest actions. |
| NU7 | **Defeat offers a body-appropriate next step.** Default: state the specific interruption and recovery route with Resume/Rest/Request care where supported. Dial: serious loss terms in optional modes. Reasonably: save, pause, settings, accessibility and import remain usable regardless of fictional hands or speech. | “Blade cracked; edge work paused; request repair” replaces “You wake in bed.” Ghost recovery does not call its anchor a bed unless it really is one. |
| NU8 | **Creation promises the actual slice.** Default: known body effects, communication, routine and opening support beside the preview, following CR4. Dial: simple start/full options. Reasonably: an ordinary pet is not advertised as a magical familiar; no unsupported form offered as implemented. | “Rooted: act nearby, grow and signal; tended patch provided” is an honest hook. Five supernatural infant verbs appear only on the awakened variant. |
| NU9 | **Text uses real anatomy and perspective.** Default: say coil, settle, perch, manifest, recharge or sleep when appropriate. Dial: humorous/personified prose by preference. Reasonably: avoid “your hands,” “your heartbeat” or a gendered greeting when the current body makes them false, while keeping ordinary idiom where it reads naturally. | A craft failure names the actual missing function; ambient rat text does not assert your secret identity. |

Future selected UI gate: rebuild the selected slice; on a fresh origin at 1366×768 exercise its unique verb, queue, NPC message, trade/custody and recovery; inspect readable text and reachable controls, then verify applicable persistence. No such gate was exercised here.

## Content-preference and darker-premise dials (INFERRED)

These are experience choices, not automatic moral verdicts or a universal hardship preset. Default: cooperative local life with understandable terms. Dial: darker or stranger premises remain reachable where world/source/AU rules support them. Reasonably per world: preferences alter an explicitly selected branch; do not present a changed rule as canon or silently change an established save.

| Code | Independent dial | Concrete effect |
|---|---|---|
| ND1 | Recognition and rights | Talking creatures can be ordinary citizens, protected dependents, contested persons or property under local law. Fear, legal custody and friendship vary independently. No automatic persecution just because the body is unusual. |
| ND2 | Host/bond control | Cooperation, advice, shared control, negotiated possession, coercion or replacement. State who can refuse, leave or command and what evidence outsiders get. A coercive act can work without creating affection or guaranteed detection/backlash. |
| ND3 | Predation and intake | Nonliving provisioning, scavenging, hunting, supernatural draining or no intake need. Keep meals helpful and hunger nonlethal. A darker undead route can have a specific optional predatory act without making starvation the reason the player must choose it. |
| ND4 | Body change presentation | Clean module changes, abstract molts, visible reassembly or body-horror detail. Mechanical scope and prose intensity are separate: low-detail text need not secretly remove an evolution faculty. |
| ND5 | Care and childhood | Supportive care, scarcity, disputed guardianship or darker dependency, with explicit available support. Caregiver effort has an owner; no mandatory neglect, trauma or offscreen hunger death as a tutorial device. |
| ND6 | Brood growth | Budding, consensual recruitment, adoption, engineered succession or darker infiltration/conversion. Original sample-copying is not imported into franchise lore without verification. Independent members and a single mind are different selectable premises. |
| ND7 | Stakes, absence and privacy | Gentle recovery, contested jobs or locally severe defeat; closed-browser freeze or bounded opted-in settlement; public powers or a chosen concealment route. Avoid a bundled “hard mode” that unexpectedly changes all three. |
| ND8 | Worship, ownership and romance | Worship can be esteem, institutional support, an actual sourced power channel or irrelevant. Ownership can be contested; bond can be friendship, duty or another age/body-appropriate relation. Romance is optional, not a default reward for caregiving, obedience or possession. |

Show the few dials relevant to the chosen start; keep the rest in optional premise details. A scene can be skipped or summarized without falsely awarding outcomes. Known control and severe-risk terms stay clear even when identity mysteries remain sealed. Changes during play need a coherent transition or clearly labeled branch setup, rather than retroactive rewriting of witnessed history.

## Suggestions ranked by playable value per effort (INFERRED)

Relative estimates, not measured engineering schedules. Shared engine E1/E2/E14 and each selected body's real missing dependencies remain prerequisites; these ranks do not authorize work or make the whole palette a release gate. Each suggestion ends in one playable slice before another starts.

| Rank/code | Suggested slice | Playable value / relative effort | Minimum result and main open dependency |
|---|---|---|---|
| 1 / NS1 | **Hound, one scent errand, one recognized signal, one routine** | High / medium after shared foundations. Reuses V1/V2/V6 and directly tests sensory verbs, local NPC evidence, body-fit gear and a paid/service path. | Complete one original short trace, establish a witness, queue a safe circuit, recover locally and make one useful purchase. Needs actual beast action/communication/combat or noncombat recovery adapters; no full pack simulation. |
| 2 / NS2 | **Small rat, one gap retrieval and a nest** | High / medium. Shares NS1's recognition/trade seams; adds scale access and makes existing rat texture consequential. | Retrieve one fitting through a body-specific route, choose nest or messenger work, retain stock and witness knowledge. Needs scale/reach and retreat support; mill/storehouse stays later. |
| 3 / NS3 | **Rooted sapling, one caretaker agreement and growth job** | High / medium to high. Strongly different idle identity; connects V8 sap context to tending, agency and useful spending. Engine owner reports a reedling seam, but that is not proof of this rooted route. | Signal, choose one root direction, deliver one supported output, queue growth and negotiate protection. Needs immobile reach, actual production/support and agent custody; no grove/avatar required. |
| 4 / NS4 | **Speaking practice blade with a cooperating guard** | High / high. Strong holder/object perspective without a full dungeon generator. Reuses V1/V6 and proves credit/ownership separation. | Choose a holder, influence one drill, return to rack, commission a fitting and keep the unique blade through reload/import. Needs real holder/controller and object/combat consumers; no infinite wielders or full inheritance campaign. |
| 5 / NS5 | **Ordinary child, one caregiver signal and reviewed chapter preview** | Medium-high / medium to high. Broad life-sim value and reusable care/learning seams, though fewer inherently nonhuman verbs. | A signal changes an NPC response, supervised learning progresses unattended, and a chapter preview names what changes without committing it. Needs caregiver capacity, stage functions and actual time/retention rules; supernatural infant variant and full childhood simulation deferred. |

These suggestions are separate from the engine owner's recommendation. They leave constructs, spirits, hosts, place bodies, evolution, brood and mixed forms reachable as later scoped choices, not rejected options. No new realm, prestige layer, native acceptance gate for unrelated work or resumed paused campaign is introduced.

## Coverage, gaps and lane closure

**SHOWN (this artifact):** 15 requested body profiles; ordinary and supernatural childhood alternatives distinguished; each profile covers active/idle/offline play, progression/skills, needs/rest/defeat/recovery, social communication/recognition, economy/crafting, proposed first ten minutes and links to other starts. Fourteen nonhuman profiles have at least five proposed distinct direct faculties. BK12 gives five ordinary stage verbs plus five explicitly supernatural alternatives because ordinary children are human.

**INFERRED:** NP1-NP14, NT1-NT10, NU1-NU9, ND1-ND8 and five ranked suggestions define comparison/acceptance questions. All first-minute slices are original additions using inspected anchors, not current walkthroughs. Exact rates, goods/recipes, NPC agreements, legal status and body recovery terms need selected content design. Every body can remain itself where its selected world supports a coherent continuing life.

**UNKNOWN / unverified:** implementation cost estimates, gameplay feel, fresh-start legality, runtime skill consumers, offline settlement, balance, migrations and browser/save/reload/literal-import behavior. No runtime edits or tests, builds, installs, browser actions, commit, push, publication or source downloads. Checkpoint: [PLAY lane](../gm/dispatch/nonhuman-starts-2026-10-14/play/CHECKPOINT.md). The document is the requested repository artifact; proposals are not accepted direction.
