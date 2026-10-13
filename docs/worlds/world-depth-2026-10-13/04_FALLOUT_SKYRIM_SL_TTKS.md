# Deeper per-world considerations: Fallout, Skyrim, book world 1, TTKS (2026-10-13)

Proposals only. Nothing here is accepted. Rows were grepped against each world's existing owners before inclusion. "(general knowledge)" marks franchise facts from memory, not repo notes. "Default / Dial / Reasonably" means the proposed starting setting, the range a world or player can move it through, and the in-world reason and cost.

## Fallout, "Working Water Line" (`docs/worlds/fallout/`)

The eight local files cover water certification, valve custody, the rig, faction offers and careers in depth. They say almost nothing about junk, radio, chems, weather, settlers, synth paranoia, terminals or the Pip-Boy screen. This pass adds the everyday wasteland texture around the pump.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| FO1 | **Scrap-down as the world's own verb.** Every ordinary object is a bundle of components: a desk fan is screws, gears and copper (general knowledge). Default: breaking an item yields its listed parts and destroys its function. Dial: tag a component and the world highlights junk that holds it. Reasonably: a working toaster is worth more whole to someone who cooks. | Turns the whole map into a parts store. Micro: Mina needs one gear, you sacrifice a working clock. Macro: a hoarder economy forms, and Orren's carriers start buying junk by weight. No other world treats clutter as raw stock. |
| FO2 | **Radio as delayed news.** An O local station plays between reports (Fallout 4 has Diamond City Radio, general knowledge). Default: your deeds reach the broadcast only if a witness reached the DJ. Dial: station range, report delay, whether rumors get garbled. | Gives the observation rule a voice. Micro: Hana hears about the valve on air before you tell her. Macro: a faction envoy arrives because of a broadcast, not because the world knows. Doubles as V7 ambient header (current station or static). |
| FO3 | **Purified water as a second currency.** Caps stay the coin, but certified allotments trade like money (purified water is a trade staple in Fallout 4, general knowledge). Default: shops quote in caps and some sellers accept water at a posted rate. Dial: rate drifts with drought, outage arc and how much the Water Line ships. | Links the opening loop to every price in the region. Micro: one allotment buys a meal. Macro: flooding the market with water crashes its value and makes Orren's monopoly argument weaker or stronger depending on who holds stock. |
| FO4 | **Rads bite the ceiling, not the bar.** Radiation lowers maximum health until treated, separate from wounds (Fallout 4 behavior, general knowledge). Default: dose is a body layer; contaminated water is a sample property; the two stay distinct. Dial: Survival-style slower healing, or off. Reasonably: RadAway removes dose, Rad-X resists it (general knowledge). | Gives FU3 a concrete body shape once sourced. Micro: drinking dirty water on an expedition trades thirst for ceiling. Macro: Imani's clinic becomes the bottleneck for every heavy-exposure career. Shows as a V8 green edge on the vitals panel. |
| FO5 | **Radstorms as weather.** Green-sky storms raise outdoor dose (general knowledge). Default: storm warnings come from the radio or a Geiger reading, not the UI. Dial: frequency, warning lead time. Reasonably: outdoor bay work pauses, indoor work continues. | Weather finally matters to the pump. Micro: a storm delays a six-minute batch. Macro: a covered intake becomes a valuable upgrade and a reason the 2282 derelict intake failed. V7 header tints green during a storm. |
| FO6 | **Chems and addiction.** Jet, Buffout, Psycho give short boosts and can addict (general knowledge). Default: each dose rolls an addiction chance shown before use; addiction is a named condition with a cure route. Dial: off, flavor-only, or full withdrawal. | A real moral economy near a medic. Micro: Imani refuses to stock chems; Vale wants them for a detachment. Macro: a chem dealer at the harbor competes with the clinic for the same desperate customers. |
| FO7 | **Terminals and holotapes as owned knowledge.** Pre-war logs hold procedures, door codes and gossip (general knowledge). Default: reading a pump manual on a terminal gives a copyable procedure; a locked terminal is a credential. Dial: word-guess hacking minigame (general knowledge) or a plain skill check. | Pre-war paperwork becomes plot. Micro: an intake schematic halves Mina's diagnosis time. Macro: a pre-war deed on a terminal supports a land claim at the repair court, a new dispute in arc 4. |
| FO8 | **Collectibles with small permanent gifts.** Magazines and bobbleheads grant perks (general knowledge). Default: an O local equivalent, say repair manuals with numbered issues, grants one small method each. Dial: a collector NPC buys them, so reading and selling compete. | Rewards exploration with knowledge, not damage. Micro: issue 3 teaches seal patching. Macro: a full run of issues becomes a teachable curriculum Mina can sell to apprentices. |
| FO9 | **Settlers, beds and the raid math.** Settlements have a roster, jobs, happiness and a defense rating; low defense against high food and water draws raids (general knowledge). Default: an O river-pocket roster with named settlers on actual jobs. Dial: raid pressure off, gentle or harsh. | The strongest idle hook in this world. While you are away, crops grow and purifiers fill storage (general knowledge), which also raises raid risk. You return to a full tank or a fight report. |
| FO10 | **Synth paranoia as gossip.** Anyone could be a replacement (Fallout 4's public premise, general knowledge). Default: no reliable street test exists; accusations are social acts with costs. Dial: whether any accused O person is actually a synth is a world seed, not shown. | Gives reputation teeth. Micro: a rumor that Mina's supplier is a synth halts orders. Macro: a town that bans "suspected synths" loses workers and Edda's refuge gains them. Fits P32: every detection channel names its blind spot. |
| FO11 | **Ghouls as cross-era witnesses.** Ghouls live very long and face prejudice (general knowledge). Default: one O ghoul worker exists in both `era2282` and `era2287` snapshots and remembers the derelict intake. Dial: whether that memory is reliable. | Succession already has a ghoul ancestor; this is the work side. Micro: the ghoul knows where the old valve was buried. Macro: Diamond-City-style exclusion (general knowledge) decides whether that knowledge reaches the cooperative. |
| FO12 | **"Another settlement needs your help."** Fallout 4's recurring aid requests (general knowledge, a fan joke). Default: an O request board with a gentle cadence and declinable jobs. Dial: frequency from rare to radiant. | Late-game reason to return: a strong character still has supply runs, escorts and repairs across a network they built. The joke cadence can be a visible dial instead of a nag. |
| FO13 | **Companion approval per act.** Companions react to specific deeds (general knowledge). Default: O companions remember particular acts, such as chem sales or donated water, and comment; no global karma bar. Dial: whether approval unlocks a small perk. | Matches the per-memory reputation in INTERACTIONS. Micro: Imani's approval drops when you sell chems. Macro: two companions with opposite values cannot both stay happy on one route. |
| FO14 | **Aim pause as combat verb.** V.A.T.S. slows time and shows hit odds per body part (general knowledge). Default: an optional "aim plan" before a fight shows odds per target part and spends action points. Dial: off, preview only, full. | Gives local combat a Fallout feel without real-time skill. Crippling a leg versus a weapon arm changes how Orren's unit fights, which the rig docs already need. |
| FO15 | **Look-alike pairs a fan notices.** Purified versus dirty water; RadAway (remove) versus Rad-X (resist); Stimpak versus RadAway; Nuka-Cola versus Quantum (general knowledge). Default: each pair is a separate item with a separate effect. | Small correctness that fans check first. Also a teaching moment: Imani corrects a player who expects Rad-X to cure. |
| FO16 | **Presentation: the Pip-Boy screen.** V6: phosphor-green tint on the frame while here. V7: header shows radio station, time, weather and a faint Geiger tick during storms. V8: green edge for dose, red for wounds. Log voice: terse terminal printout. Sound: Geiger clicks, radio static between areas. Panel only this world reveals: a Pip-Boy-style Data tab once a wrist computer is owned, otherwise a paper notebook. | The world reads as Fallout before any text. Owning the device changes the UI, which ties presentation to custody. |

**Smallest playable taste:** FO1 scrap-down. Mina's pump needs a gear; the player can break a desk fan or a working clock from the existing stock to get one. It uses the custody and repair systems already designed, adds one new verb and shows the world's identity in a single click.

### Fallout: starting points

Already covered: `era2287` visitor, O `era2282`, vault dweller birth, wasteland arrival, ghoul long life. These add:

| Code | When and who | What it changes downstream |
|---|---|---|
| FO17 | **2077, the morning the bombs fall (general knowledge date).** A pre-war plumber with a city water contract. | You know the intake's original design and lose almost everything else. A Vault seat, a cellar or a ghoul route carries you forward; your old work orders become the terminals FO7 reads. |
| FO18 | **A caravan hand on Orren's carrier, 2287.** You start on the other side of the valve claim. | Arc 1 flips: you know the carrier's schedule and the crew, not the pump. Siding with Mina later is a betrayal people remember. |
| FO19 | **A settler born at the river pocket, age 12, 2280s.** | Child-scale work (sample runs, scrap sorting), a parent with a job, and growing up through `era2282` into `era2287`. Mina may have taught you. |
| FO20 | **A Brotherhood-style scribe on an O detachment (F4 anchor, O person).** | Starts with inspection tools and requisition duties. Access to parts is easy; civilian trust is hard. Vale is your superior, not a buyer. |
| FO21 | **A synth who does not know it (public premise, general knowledge).** | Whether you are one is a sealed world seed with its own discovery route; the start reads as an ordinary settler. A later reveal changes who hunts you, not your past deeds. |

### Fallout: parallel versions

Existing: `public_network`, `private_corridor`, the Paradise mission frame. These add:

| Code | What differs | How you cross or notice; what carries over |
|---|---|---|
| FO22 | **The intake never failed.** A Commonwealth where the Water Line has run for ten years and the conflict is over price, not water. | Chosen at start or reached through a branch menu. Carries body, methods and owned items; local people are new instances who never met you. |
| FO23 | **A different faction won the Commonwealth (FU6).** Same river pocket under a different flag. | Noticed by uniforms, radio content and who staffs the aid station. Carries knowledge of people, which may be wrong under the new rulers. |
| FO24 | **A wet wasteland.** Rain comes clean and radiation is in the soil instead. | A premise swap: water is cheap, food is the scarce good, and Hana becomes the powerful one. Water-certification skills still work, at lower value. |
| FO25 | **A rerolled truth behind the cartridge trail (arc 2).** The cause of the bad batches differs per run. | Sealed; existence and route only: the arc's comparative-testing route discovers it. Carries nothing that reveals the answer across runs unless a memory carrier is active. |

### Fallout: subtle details

| Code | Detail |
|---|---|
| FO26 | Mina keeps every broken part on a nail by the bay door; the row of parts grows with your history together. |
| FO27 | The Geiger counter ticks faster near the river bank after a storm, before any number appears. |
| FO28 | Purified and dirty water look the same in the bottle; only the label and Imani's tag tell them apart. |
| FO29 | Radio static gets louder in the culvert, so news stops while you work underground. |
| FO30 | Settlers sleep in shifts; a bed with two owners is normal here, and nobody calls it poverty. |
| FO31 | Pre-war cans list a price in dollars that no one can spend; children collect them as a game. |

## Skyrim, "Lower Road" (`docs/worlds/skyrim/`)

The local files cover the cart, ring study, enchanting, alchemy trials, careers and the depot arcs. They are silent on crime and bounty, guards, skill books, standing stones in the world, homes and marriage, carriages, couriers, disease, barrows and the civil war as a running state. This pass adds those, inside the base-game boundary.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| SK1 | **Taste to learn.** Eating a raw ingredient reveals its first effect (general knowledge). Default: one bite per ingredient type reveals one effect and consumes it. Dial: perks reveal more per bite. Reasonably: some ingredients are mildly harmful to eat. | The world's distinct verb: learning with your mouth. Micro: you sacrifice one rare cap to learn it. Macro: Serevyn buys your tasting notes, so knowledge becomes stock. |
| SK2 | **Hold-local bounty.** Crime builds a bounty per hold; guards ask you to pay, go to jail or resist (general knowledge). Default: bounty is a per-hold record, not a world flag. Dial: jail time drains skill progress (base game behavior, general knowledge) or not. | Gives law a geography. Micro: stealing from Runa's rival raises Whiterun bounty only. Macro: a courier who is wanted in one hold reroutes freight through another, which changes the Lower Road. |
| SK3 | **Guards read what they see.** Guards comment on visible gear, spells and deeds (the arrow-in-the-knee lines, general knowledge). Default: remarks key off actually visible state such as a drawn staff or an equipped College robe. | A cheap, funny observation rule that fans love. It also teaches the player what others can read: a hidden ring draws no comment. |
| SK4 | **Stolen items stay stolen.** A theft flag follows the item; merchants refuse it and fences buy it (general knowledge). Default: provenance is a property of the object. Dial: a long wait or a fence's service clears it. | Ties into CW09 provenance. Micro: a stolen ring cannot be legally studied under the existing ownership rule. Macro: a fence network becomes a quiet career beside Runa's honest yard. |
| SK5 | **Standing stones are places, not birth.** In the base game you can switch to another stone by visiting it, one active at a time (general knowledge). Default: the creation pick is your first stone, and later stones are a trip. Dial: lock at creation for a fate-heavy run. | Complements the entry matrix's birthsign screen with a world verb. A trip to a distant stone becomes a real expedition with a reason. |
| SK6 | **Skill books.** Reading certain books once raises a skill (general knowledge). Default: a book raises its skill the first time you read it and stays a normal book after. Dial: copies give nothing new. | Gives bookshops and the archive arc a reward. Micro: Teren's ledger copy might contain one. Macro: book collectors and the College compete for a rare volume. |
| SK7 | **Home, bed and spouse.** Sleeping in an owned bed gives a rested learning bonus; marriage via an Amulet of Mara gives a stronger one, and a spouse can run a shop that pays daily (general knowledge). Default: an O spouse candidate among the cast; the shop pays while you are away. | The main life-sim and idle hook here. You return to coin and a person who noticed you were gone. Hearthfire adoption and building are DLC and stay out unless the boundary changes. |
| SK8 | **Carriages and the long walk.** Hold-city carriages cost septims and skip road time (general knowledge). Default: an O driver on the Lower Road with a fare and a schedule; walking stays free and finds encounters. | Makes travel a choice with a price. The carriage driver is also a witness who knows who rode where. |
| SK9 | **Couriers find you.** A courier brings letters and inheritances wherever you are (general knowledge). Default: mail from people you know catches up after a short delay, including after a world trip. | Answers "what happened while I was away" without a dashboard. A letter from Odda about the kiln is news with a sender, which fits the observation rule. |
| SK10 | **Disease and the slow turn.** Wildlife spreads diseases; Sanguinare Vampiris becomes vampirism after about three days untreated (general knowledge). Default: a disease is a named condition; shrines and cure potions clear it. Dial: vampirism and lycanthropy as full body routes (SU4/SU6 gates). | Gives the shrines and Serevyn's stock a constant job. Micro: a bitten hauler needs a cure before the deadline. Macro: an untreated worker becomes a story, not a stat change. V8 shows a faint pale edge while infected. |
| SK11 | **Barrows and claw keys.** Nordic tombs hide puzzle doors opened by a claw whose palm shows the answer (general knowledge). Default: an O barrow near the depot with one claw door and draugr. | A fan detail that rewards looking at an item. It also connects to the draugr-ancestor succession idea: a family claw is an inheritance with a lock. |
| SK12 | **The civil war as a hold-state clock.** Which side holds a hold changes guards' uniforms, the jarl and who signs leases (general knowledge). Default: frozen at `opening_crisis`. Dial: advances on a slow calendar, or only through the player's choices. | Lets abstention matter. Micro: Runa's lease is signed by whichever jarl rules. Macro: the winter passage arc reads hold control, so the same convoy faces different checkpoints. |
| SK13 | **Inns as gossip and bounty boards.** Innkeepers share rumors and jarls post bounties on bandits and beasts (general knowledge). Default: an O inn on the Lower Road with a rumor slot that reports what someone actually saw, and a bounty board. | Gives a strong returning character steady reasons to come back: contracts that scale with real threats, not level. Rumors double as the world's news feed. |
| SK14 | **Soul gem look-alikes.** Petty through grand gems hold creature souls; black gems hold people (general knowledge). Default: gem size and soul size are separate properties; a grand gem cannot hold a person. | Fans check this. It also keeps the enchanting chain honest and gives SU6 a clear moral line for a later necromancy route. |
| SK15 | **Afterlife by culture.** Nords hope for Sovngarde; other peoples expect other fates (general knowledge). Default: an NPC's burial and expected afterlife follow their culture. Dial: whether any afterlife is reachable. | A death texture no other world has. A funeral on the Lower Road differs by family, and it sets up the draugr ancestor and SU6 without settling them. |
| SK16 | **Presentation: frost and constellations.** V6: slate and frost tint on the frame. V7: aurora at night near Winterhold, snow glyph on the pass, warmer header in the Whiterun plains. V8: blue edge for cold exposure, pale edge for disease. Log voice: a bard's understatement. Sound: wind, a distant roar before a dragon arrives. Panel only this world reveals: a starfield skill view, echoing the perk constellations (general knowledge). | The skill view reads as Skyrim at once. A distant roar before the dragon arc is a cheap, honest warning. |

**Smallest playable taste:** SK1 taste to learn. Serevyn sells three unknown ingredients; biting one reveals one effect and consumes it, and the notes can be sold back. It is one new verb on stock the alchemy design already has, and it teaches the "knowledge is stock" idea in under a minute.

### Skyrim: starting points

Already covered: `opening_crisis`, O `prior_generation`, prisoner cart, ship arrival, born. These add:

| Code | When and who | What it changes downstream |
|---|---|---|
| SK17 | **A Whiterun guard (general knowledge institution, O person).** | You enforce SK2's bounty law. Runa is a citizen you protect; stealing is now a crime against your own oath. Guard commentary (SK3) is your own voice. |
| SK18 | **A Khajiit caravan trader barred from city gates (general knowledge custom).** | Trade happens outside the walls. Carriage, fence and rumor routes open early; legal leases are hard. The Lower Road looks very different from a caravan camp. |
| SK19 | **A College apprentice sent south for samples.** | Starts with Magicka and a teacher, no money and no bench. Orven is a senior colleague. Arc 3's salt archive is your assignment rather than an offer. |
| SK20 | **A miller's widow at the western watershed, age 50.** | A late start with property, debts and grown children. Odda is a rival lease-holder. Ties into the north star's late-start idea. |
| SK21 | **A child in Honorhall-style care (general knowledge orphanage).** | Small body, no rights, chores. Growing up reaches `opening_crisis` as a young adult with local memories nobody else has. |

### Skyrim: parallel versions

Existing: `civilian_compact`, `exclusive_corridor`, `prior_generation`. These add:

| Code | What differs | How you cross or notice; what carries over |
|---|---|---|
| SK22 | **No dragons return.** The civil war is the whole crisis. | A premise pick. Arc 5 becomes a siege, not a dragon. Carries body and methods; dragon-specific stock has no use. |
| SK23 | **The other side won the civil war (SK12).** | Noticed by guard uniforms and the jarl's name on a lease. Carries your knowledge of people, who now answer to different masters. |
| SK24 | **A Skyrim where the College holds Whiterun's lease rights.** | Magic is municipal; the yard needs a permit to work. A divergence point the player can create by funding the College heavily in arc 3. |
| SK25 | **A rerolled truth behind the old-foundation archive.** Who really built the depot differs per run. | Sealed; existence and route only: arc 3's independent testing route. Teren's claim reads the same either way. |

### Skyrim: subtle details

| Code | Detail |
|---|---|
| SK26 | Runa hums while she works and stops when a stranger enters the yard. |
| SK27 | Nirnroot chimes faintly near water (general knowledge); the sound comes before the glow. |
| SK28 | Bread rolls and sweetrolls look alike on a shelf; the guards only joke about one of them (general knowledge). |
| SK29 | A septim from the Imperial mint and a Stormcloak-era coin weigh the same; old Nords still pick the older one. |
| SK30 | Wet boots steam by the inn fire; the inn smells of mead, smoke and wool. |
| SK31 | Snow on the pass fills your footprints within an hour, so tracking there has a short clock. |

## A Soldier's Life, book world 1 (private pack; owners `docs/gm/dispatch/soldiers-life-world-2026-10-09/`, `docs/gm/dispatch/dual-gm-2026-10-11/expansion/`, private cards W1-SRC-01..26)

Public-safe: no source names, characters or places. The first slice covers kit, vials, drill, wage and three colleague memories; the 26 private source cards cover kit terms, armor, mounts, food, storage rules, alchemy, guild queues and more. This pass adds the company's social life, absence and leave, and how one rare specialist changes a unit.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| SL1 | **Morning roll call as the world's verb.** The kit ledger counts things; muster counts people: present, sick, on detail, missing (source shows watch, patrol and casualty work; roll call shape is a proposal). Default: one muster per local day. Dial: the player takes the roll as clerk at a higher rank. | An absence is the first sign of trouble: a hidden debt, a fever, a desertion. Micro: one name missing. Macro: the clerk who notices patterns becomes the person officers ask, which is a non-combat road to trust. |
| SL2 | **Payday rhythm.** Wages land on a fixed day, then the town fills: drink, gambling, debts between soldiers, sending money home (pay and family-pay concerns are shown). Default: a payday event with a few choices. Dial: loans between soldiers enabled or not. | Gives the local wage a life after it is claimed. Micro: a squadmate borrows against next pay. Macro: an unpaid debt becomes a grudge on a later patrol. |
| SL3 | **The letter writer.** A literate soldier writes letters for those who cannot (literacy teaching appears in W1-SRC-18). Default: an optional evening service paid in favors. Reasonably: you learn everyone's family business. | A privacy dilemma with real stakes. Micro: you know who sends money to whom. Macro: that knowledge is valuable to an officer, a lender or an enemy, and keeping it quiet is a choice. |
| SL4 | **Discipline as a record that travels.** Extra duty, confinement and docked pay follow your file to a new posting (rank and punishment are shown; the record's travel is a proposal). Default: a short discipline list on the service record. Dial: severity, and whether a good report clears an entry. | Gives small misconduct a lasting but bounded cost. A new commander reads the file before meeting you, which fits the observation rule. |
| SL5 | **Insignia show rank, not skill.** People read the patch and the uniform first. Default: strangers treat you by insignia until they see work. Dial: false insignia as a disguise route with a high exposure cost. | Ties to CW23. Micro: a recruit with a rare gift is still ordered to carry water. Macro: an outsider wearing borrowed rank can open a gate once and close several doors after. |
| SL6 | **The dead soldier's effects.** When a squadmate dies, someone takes custody of their kit and personal things, and someone writes home. Default: issued kit returns to stores; personal items need a holder and a recipient. | Storage users are natural holders, which makes grief a custody task. Micro: a keepsake waits in your storage. Macro: delivering it on leave opens a family thread that the pension row in SUCCESSION_BY_WORLD can continue. |
| SL7 | **The storage specialist is a single point of failure.** If the company's potions and funds sit in one person's storage, that person leaving strands them (persistence rules in W1-SRC-11). Default: before any leave or world trip, the player hands stock back or the company refuses leave. Dial: the company plans around you, or treats an unplanned absence as a custody breach. | The best absence rule for this world. It turns "go visit another world" into a real military question with a lawful route (handover) and an unlawful one (leaving with the stores). |
| SL8 | **Leave, furlough and AWOL as the travel clock.** The service term counts local days; a leave pass makes a world trip lawful; overstaying changes status (term enforcement is backlog A3). Default: request leave, then travel. Dial: leave length, and whether overstaying is a warning or desertion. | Maps YAIRPG's multi-world travel onto a soldier's real calendar. Returning late has consequences people remember; returning on time with a gift has others. |
| SL9 | **Stasis turns the storage user into a market.** Contents that do not age let fresh food and medicine move across seasons (W1-SRC-11; time-stasis is backlog A4). Default: the player can carry perishables at their stored freshness. Reasonably: quartermasters and merchants notice. | Micro: fresh fruit in a winter camp lifts the company's mood. Macro: requisition offers, price gaps and smuggling temptations follow, and each route has different people who learn the secret. |
| SL10 | **The need-to-know circle.** The source makes power a political exposure. Default: a tracked list of who knows what about your gift, growing only through witnessed use or disclosure. Dial: an elite unit recruits once the list passes a size. Forced exposure stays tied to W1-SRC-13's sealed route. | CW24 in practice. Micro: you choose to use storage in front of one officer. Macro: that officer's report decides your next posting. |
| SL11 | **Orders need someone who can verify them.** Military action is bounded by who can check an order (shown). Default: written orders carry a seal; a messenger can be stopped, lost or faked. Dial: forged orders as a counter-intrigue route. | A non-combat puzzle with real teeth. Micro: a false report sends the patrol the wrong way. Macro: the messenger system becomes the target in a political crisis. |
| SL12 | **A roster of mixed peoples.** Peoples differ in size, lifespan, senses and needs (shown). Default: duty assignment reads real traits: night sight for watch, bunk size, ration needs. | Makes the unit feel like a world, not a list. Micro: a long-lived comrade outlasts the posting. Macro: assignments that ignore traits cost the company, and good ones earn trust. |
| SL13 | **The natural course keeps marching.** The company has its own deployments on a public calendar. Default: if the player transfers out or abstains, the unit goes on without them, and news arrives by letter. Dial: whether letters report true outcomes or soldiers' versions. Later horizons stay tied to W1-SRC-26's sealed route. | Lets refusal be a real path. A player who stays a quiet quartermaster in the city still hears what happened to the people who marched. |
| SL14 | **Veteran's return.** A late-game character can train recruits, run a depot or consult on logistics; preserved stock in storage stays fresh for years (W1-SRC-11). Default: a veteran role opens after a set term with a pension statement. | A strong returning character has reasons here that are not fights: people they trained, a depot they built, a stash that kept. |
| SL15 | **Presentation: the company ledger.** V6: worn leather and ledger-cream tint with a unit-color stripe. V7: header names the current call (reveille, mess, watch, lights out) plus weather. V8: amber edge for march fatigue, faint violet edge as storage fuel runs low. Log voice: clipped duty reports. VFX: a storage opening as a small fold in the air, quiet by default. Panel only this world reveals: the muster roll and service record. | The world reads as military routine before any combat. The violet edge shows fuel without another meter. |

**Smallest playable taste:** SL1 morning roll call. The three existing colleagues plus two new names answer muster; one is missing, and the player can report it, cover for them or go look. It reuses the first slice's location and memories and makes the company feel like people.

### Book world 1: starting points

Already covered: four premises (canon, divergent, remix, swapped) and 18 private start candidates. These are public-safe positions the palette may already hold under private IDs; the integrator checks overlap before adding.

| Code | When and who | What it changes downstream |
|---|---|---|
| SL16 | **The company cook.** | Food, rumor and morale run through you (W1-SRC-08 texture). Rank is low but everyone visits; SL2's payday and SL1's muster happen in your kitchen. |
| SL17 | **A soldier's spouse in the garrison town.** | Not enlisted. You live on remittances, the pension worry and letters (SL3, SL6). The company is something that happens to your family. |
| SL18 | **A retired sergeant called back for one campaign.** | Old body, deep procedure, a younger commander. Pension terms and the service record (SL4) are already long. |
| SL19 | **A supplier who bids on the company's contracts.** | You sell to the kit ledger instead of signing it. Quartermasters are customers; a missing vial is your loss or your profit. |

### Book world 1: parallel versions

Existing: divergent and swapped premises. These add:

| Code | What differs | How you cross or notice; what carries over |
|---|---|---|
| SL20 | **Storage is common.** Every quartermaster has the gift. | A premise swap. Logistics is easy, so the war turns on information and orders (SL11). The player's gift is ordinary; ledger skills carry over. |
| SL21 | **The company disbanded early.** | A branch where the unit broke up before the first campaign. People you know are civilians with trades. Carries memories of who they would have been. |
| SL22 | **A peacetime posting.** | No campaign; duty is roads, gates and refugees (W1-SRC-17). Noticed by the calendar, which has no deployments. Skills and kit carry. |
| SL23 | **A rerolled truth behind the world's crossing history.** | Sealed; existence and route only: W1-SRC-26's discovery route. Nothing on screen differs until that route is walked. |

### Book world 1: subtle details

| Code | Detail |
|---|---|
| SL24 | Recruits fold blankets the way their first sergeant taught them; you can tell someone's old unit by the fold. |
| SL25 | The issue clerk taps the ledger twice before writing a missing item. |
| SL26 | Boots squeak for the first week, then go silent; a silent new boot is someone else's. |
| SL27 | Mess benches have names carved in them; new names appear after each campaign and old ones stop. |
| SL28 | The storage opening makes no sound, but people near it lower their voices anyway. |
| SL29 | On payday the town tavern opens an hour early. |

## TTKS, five book worlds (`docs/LIFE_SIM_NORTH_STAR.md#ttks-five-book-findings-2026-10-10`, `docs/gm/dispatch/ttks-novels-2026-10-10/FINDINGS.md`, private deep dives)

The committed summary and the north star's C1-C29 cover power structure: anchors, chalices, carriers, settlement whitelists, archive and submit, use/own/know/command, consent copying. This pass goes into the daily life each book implies, plus presentation and cross-world joins. Rows name their book. All five books are ongoing; paraphrase only.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| TT1 | **B1: habit tells and the cleaner who moves the anchor.** A replacement is caught by small habits: tea order, handwriting, a pet that hisses (the parrot detector is shown; the rest are proposals). Default: each identity has three habits the player learns from the victim's life. Reasonably: a landlady who tidies can move the anchor object. | Chores become risk. Micro: the cleaner shifts a carved desk piece. Macro: the anchor's location in the home decides whether you can ever hire help, which shapes your whole household. |
| TT2 | **B1: the ritual shopping trail.** Rank rituals need named materials bought at the wild-wizard market (shown). Default: sellers remember regular buyers; a purchase list is evidence. Dial: whether the Association watches the market. | Shopping becomes intrigue. Micro: buying a rare reagent twice draws a seller's question. Macro: a detective reconstructs your rank from receipts. |
| TT3 | **B1: rent near the vein root.** Linking a vein is easier close to its root (shown). Default: housing near a known root costs more and fills with wizards. Dial: how much distance changes the odds. | Real estate as power. A poor apprentice commutes to the root; a rich family owns a house on it. The unknown seventh root becomes a property rumor. |
| TT4 | **B2: the yearly draw as a birthday.** One trait per lived year (shown). Default: the draw lands on the character's birthday with a small household scene. Dial: how many real minutes a local year takes; draws count only years lived in that world's time flow (the book blocks draws where time flows differently). | Ties the idle tick to a family ritual. Also a cross-world rule: time-ratio worlds may refuse the draw, which stops time-dilation farming without an invented cap. |
| TT5 | **B2: meeting the real version of a simulated friend.** Settlement keeps memory but not relationships (shown). Default: the player remembers years with someone who has never met them. Dial: how much that familiarity leaks into dialogue options. | An emotional texture only this book gives. Micro: you know their favorite food. Macro: acting on it reads as uncanny, and a suspicious companion arc follows (the simulation-aware companion seed). |
| TT6 | **B2: joke traits move markets.** Infinite porridge feeds an economy (shown). Default: a production trait affects prices in the town where it is used. Reasonably: food sellers lose work and the poor eat. | Micro to macro in one trait. The player decides whether to give it away, sell it or limit it, and each choice has people who react. |
| TT7 | **B3: the hub as a home.** The system space is the one layer that cannot be reset (shown). Default: the hub is a furnishable room that holds trophies from each challenge. Dial: whether NPCs from submitted worlds can visit it. | Gives the challenge board a place to live between runs. Idle play can happen there: training, reading, arranging rewards. |
| TT8 | **B3: one-sided history.** In a submitted world, you may remember a person's death in another attempt while they just met you (shown: new attempts have new people). Default: dialogue offers a "you seem familiar" path only through what you choose to say. | A relationship mechanic built on asymmetry. Grief and warmth both come from attempts the other person never lived. |
| TT9 | **B3: the notebook is an object there.** Written canon notes can be stolen and used against you (shown). Default: in this world, YAIRPG's Notebook has an in-world copy with custody. Dial: keep notes only in memory, at the cost of losing detail. | Turns a UI panel into loot. A rival who steals your dossier knows your plan, which is a new kind of loss. |
| TT10 | **B4: life inside a purity band.** Measured purity sets where you live, which shops serve you and whom you may marry (shown). Default: a commoner start at a mid band, with gate scanners on the road. Reasonably: a reading off the top of the scale is information, not a number. | Daily life is the class system. Micro: a bakery refuses you below a line. Macro: a single scan at a gate can expose the player's real status to a crowd. |
| TT11 | **B4: every injury becomes a request.** Human blood and touch heal engineered conditions (shown). Default: healing works and each use is witnessed by someone. Dial: whether a quiet clinic can hide it. | A cheat that pulls the player into a community. Micro: one healed child. Macro: a queue forms, then a church and a noble house both want control of you. |
| TT12 | **B4: the estate runs itself.** A household AI keeps the family's house going (shown). Default: once you accept the family's duties, the estate operates while you are away, and those duties keep accruing. Dial: what the AI does without orders. | The cleanest absence rule in TTKS: an estate that is both income and obligation. You return to a report and a pile of family business. |
| TT13 | **B5: the shift.** The gate has a daily queue and liability for errors (shown). Default: a shift is a set of applicants with quotas, breaks and a supervisor's review. Dial: overtime pay, peer inspectors at the next desk. | Turns the inspector loop into a job with coworkers, pay and gossip, not only a puzzle. |
| TT14 | **B5: the power bill gives you away.** Searches cost electricity (shown). Default: home charging shows up on a meter a landlord or neighbor can read. Reasonably: heavy use invites questions; the hydro plant route is lawful but public. | A social cost of a cheat with no invented price. Micro: a neighbor asks why your meter spins. Macro: lobbying for the plant puts the player in town politics. |
| TT15 | **B5: the people you admit become neighbors.** Applicants you pass live in the town; those you refuse appear outside the walls (inferred from the gate's role). Default: admission decisions write to a town roster. | Your job shapes the town. A refused scavenger turns up as a trader or a raider; an admitted child grows up down the street. |
| TT16 | **Cross-world: one world's power plant charges another's cheat.** B5's collector runs on electricity (shown). Default: a charge adapter can read power from any world that has it, such as the Fallout Water Line's generator, with a conversion rate. Dial: off, lossy, or one-to-one. | A concrete reason to visit worlds together. Micro: one full charge from a Commonwealth generator. Macro: an inspector who funds a Fallout utility gains searches, which links two worlds' economies. |
| TT17 | **Presentation, B1 to B3.** B1: sepia gaslight tint, fog in the V7 header, a V8 edge that darkens as echo voices pile up, and occasional echo lines in the log. B2: V6 frame shifts toward the realm's rarity color; the draw uses the white, green, purple, gold and prismatic grades (shown). B3: stark system-blue hub panel; header shows attempt number and archive state. | Each book reads distinctly before text. Echo lines in the log make the death loop felt without a meter. |
| TT18 | **Presentation, B4 and B5.** B4: cold chrome tint; when scanned, the purity reading appears in the header, and "off the scale" gets its own glyph. B5: floodlight amber at the gate; V7 header shows the charge meter in kWh and weather; V8 rot-light red or green edge after an inspection (red known, green no match, shown). | Gives B5 its job-desk look and makes B4's class system visible in one glance. |

**Smallest playable taste:** TT15, the people you admit become neighbors. It extends the deep dive's five-applicant gate slice with one new state, a town roster, so that a decision at the desk shows up later in the street. It is small and turns the job loop into a life sim.

### TTKS: starting points

Already covered: the deep dives' "living beside the protagonist" seeds (B1 wild wizard, Ember recruit, junior hunter, larva mimic, Yard partner, Mirror Isle resident; B2 companions; B3 hosted branches; B4 settler, knight, high elf, dwarf child, sin-monk; B5 inspector, scavenger, engineer, bird owner, plant child, furnace student). These add:

| Code | When and who | What it changes downstream |
|---|---|---|
| TT19 | **B1: the person who is about to be replaced.** | You start human with a normal job, and the play is noticing your colleagues change. If you survive, you know what a mimic missed about you. |
| TT20 | **B2: a parent at the draw.** A villager whose child gets the yearly trait. | You live the household side of the cheat: luck, envy and neighbors asking favors. The child's choices shape yours. |
| TT21 | **B3: a local in a submitted world after the challenger left.** | You live in a world that was judged and then kept. Its new history is your normal; the challenger is a rumor. |
| TT22 | **B4: a household AI.** | You are the estate's butler machine, with purpose and ethics, waiting for an heir. Playing machine rules from inside ties to R4 and R5. |
| TT23 | **B5: a refused applicant outside the wall.** | You start where TT15's refused people go. The gate is the enemy, the market, or the goal. |

### TTKS: parallel versions

Each book already has its own fork engines (B1 loops, B2 simulations, B3 attempts). These add variants of the worlds themselves:

| Code | What differs | How you cross or notice; what carries over |
|---|---|---|
| TT24 | **B1: no mimics.** Wizard London with a quiet seventh route. | A premise pick. Identity play disappears; the wizard ladder and market stay. Carries rank and rituals. |
| TT25 | **B2: a simulated world kept, not settled.** The run you would have discarded continues as a place. | A crossover with B3's submit rule. Notice it when a simulated companion writes to you. Carries what that world remembers of you, nothing more. |
| TT26 | **B4: humanity never ended.** Descendants and humans share a world, and purity has no meaning. | A swapped premise. The player's "last human" status is ordinary; machine rules read differently. Credentials carry, rank does not. |
| TT27 | **B5: a clean wasteland.** No infection sources; the gate checks only papers. | The collector's consent and power rules still work; inspection becomes customs work. Carries skills and charge. |
| TT28 | **Rerolled truths for B1's sealed hooks and B4's extinction cause.** | Sealed; existence and route only: B1's volume-two hooks and B4's deleted-record route. The books leave these open; a run can fix one without telling the player. |

### TTKS: subtle details

| Code | Detail |
|---|---|
| TT29 | B1: a mimic's tea goes cold untouched; it forgets that people drink while they talk. |
| TT30 | B1: the parrot only performs for food and sulks after a false alarm. |
| TT31 | B2: the yearly draw panel opens with a sound the household learns to wait for. |
| TT32 | B4: detectors that top out flash the same reading for a rich noble and for the player, so a crowd cannot tell them apart. |
| TT33 | B5: the rot-light hums higher when it shows red, so experienced inspectors look up before they read it. |
| TT34 | B5: the meter in the inspector's flat clicks once per search; neighbors count the clicks. |
