# Deeper considerations: home world and hubs (2026-10-13, proposals)

Worker A. Proposals only; nothing here is accepted. Read-only pass over the repo.
Franchise facts not in repo notes are labeled (general knowledge). Paradise facts
are paraphrased from the supplied-MTL dossier and marked STATED (source claim in
that edition) or inferred. No sealed truth appears below.

---

## Original frontier, the home world / Village (`docs/worlds/original-frontier/`, RULES_FROM_SCRATCH "The home world")

The existing docs cover the economy, four careers, five arcs, OF.EXPLORE/CONTROL/MASTERY,
pacing and endings. This pass adds the year itself: weather, food sources, fire,
gossip, bodies and graves, what home does with foreign things, and how home looks.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| OF1 | **Unique verb: keep a household through the year.** Default: the Frontier rewards keeping things going (wood in before winter, roof sound, field tended) more than winning anything. Dial: how hard winter bites, from flavor to real shortage. | Vanilla already closes many jobs outside Spring to Autumn (`availability_seasons`). Stock laid in by autumn decides whether winter is quiet practice or a scramble, and the village learns who is rarely short. |
| OF2 | **A thin village almanac.** Default: a few named days per season (weekly market day, harvest supper, first snow, the rat season tied to the native rat quests). Dial: denser festival calendar. Reasonably: each day has a host who spends real stock. | A bad harvest means a thin supper, which residents remember and talk about. The almanac gives idle play dates to aim at without mandatory windows (TIMELINE_AND_ENDINGS row 13 keeps them optional). |
| OF3 | **Rain with small, specific consequences.** `weather.js` already has rain, temperature and light. Default: rain slows the Forest road a little, soaks unsheltered logs and cancels outdoor drills. Dial: Proto23-style named weather states (O4). | Wet logs go to the Shack rack to dry, so a rack becomes worth owning. A slow wet road makes Wen's lot arrive late, and his remembered reply reflects it. Frontier weather stays plannable (the 13-day cycle), which is its identity next to Proto23's surprises. |
| OF4 | **Gossip as a slow, lossy carrier.** Default: a witnessed public act travels by named talkers at walking pace, carries its source and day, and can inflate or blur (rule 6). Dial: drift size. Reasonably: someone who saw nothing cannot vouch, only repeat. | A Town deed reaches the Village days later as a rumor, then a villager-coined nickname (LIFE_SIM line 161) that can be flattering, mocking or wrong. The elder's greeting or a trader's price shifts on the rumor, not on the truth. |
| OF5 | **The wandering peddler as home's window outward.** The card's deck names him. Default: arrives on a seasonal cycle with finite stock and far-off news; buys odd things at a puzzled price. | Selling a foreign relic to someone who cannot value it gets little coin and starts a rumor. That rumor can bring a stranger asking questions: a quiet, causal way for other worlds to notice home. |
| OF6 | **Food has a source and a season.** Default: Village bread depends on the eastern mill and its grain. Dial: whether a hard freeze stops the mill. Reasonably: stored flour covers a few days, then bread gets scarce and pricier. | Links the native mill quest and storehouse rats to daily food. A player who cleared the storehouse or stocked flour keeps the R11 one-coin Stale bread affordable for neighbors, and they notice. |
| OF7 | **Fire and fuel.** Default: hearths burn counted wood; the card's barn fire is a natural-course event with a real cause (dry season, a careless lamp). Preparation (water barrels, cleared straw) changes how much burns. | Helping, arriving late or being away all leave different barns, debts and memories. A rebuilt barn needs logs, which feeds the Open Counter's demand with a real reason. |
| OF8 | **Fainting carries a cost for someone else.** Default stays unconsciousness. Deeper: someone found and carried you, and spent their day doing it. Dial: lasting scars or limps in a harsh life. | Lio carrying you back from the cave becomes a directed memory and a later favor asked. Repeated rescues change how people rate your judgment, separate from your strength. |
| OF9 | **Graves, epitaphs and a remembering village.** `chronicle.js` already stores a grave, age and epitaph. Default: the epitaph is written by whoever knew you best, from what they saw. Dial: whether the heir can visit and tend it. | The village treats an heir by the predecessor's record: an unsettled lot on Mira's ledger, an old grudge, a debt nobody can enforce but everyone mentions. Social inheritance is distinct from legal inheritance. |
| OF10 | **Home while you're away.** Rule default: absent worlds freeze. Dial: a paid neighbor tends the Shack while you travel. Reasonably: the neighbor needs food or coin and does only what they can. | On return the neighbor tells you what happened, attributed and partial, not an omniscient log. A neighbor who was never paid stops tending, so the Shack's state tells its own story. |
| OF11 | **Foreign things stay strange at home.** Card dial: carry is generous in and out. Deeper: carrying is not maintaining. Default: the old craftsman cannot sharpen or repair an unfamiliar foreign blade until he studies it. | His study becomes a project with his own time and materials. It can end in a new local recipe of foreign origin, attributed to the source world, and the Frontier gains a technique the right way. |
| OF12 | **A superhuman at a village table.** Rule 4 says superhuman bodies change ordinary life. Default: a returning, much stronger body breaks a chair, frightens a dog, needs bigger meals. | The craftsman builds a reinforced chair, children dare each other to arm-wrestle you, and a nickname follows. This is why home stays interesting for a strong returner: it is the one place where power shows up as clumsiness. |
| OF13 | **Late-game reasons to come back.** Beaten obstacles stay beaten (rule 11), so rats don't scale. Default: home holds people who change, apprentices to teach, the grave, stored records and the elder's tea. | A strong character returns to hand off, teach or rest. Teaching is how home outlives the player; the apprentice's competence is their own (CAMPAIGN stewardship) and later carries the family name. |
| OF14 | **Natural-course pressure points.** TIMELINES says the Frontier has a natural course: harvest, rat season, rival plans. Default: a few authored causes per year that run without you. Abstention is a real choice. | If you skip the rat season, the storehouse loses grain, bread tightens (OF6) and the peddler hears of it (OF5). Each link reads a real cause; none is restored just because it was planned. |
| OF15 | **The clearing as an unexplained origin.** Default: the awakening stays a mystery with no truth fixed in this pass. Dial: a future world secret (unassigned ID) could hang on it, found through Perception at the clearing, the elder's talk or a stranger's recognition. | Keeps the vanilla opening intact while leaving room for the card's "stranger who knows your name". Any truth chosen later belongs in a sealed file. |
| OF16 | **Presentation.** V6: the Frontier keeps Vivid's navy everywhere, so every other world reads as leaving home. V7: header shows a season glyph and a cloud count from the plannable rain cycle; dusk warms it. V8: a faint frost edge outdoors in winter without warm clothes. | Log voice is the first-person diary the chronicle already uses. Sound is off by default; an opt-in hearth crackle at the Shack. The panel only home shows: a small almanac strip of the season's named days (OF2). |

**Smallest playable taste:** OF3. Rain already exists in `weather.js`; making it soak
unsheltered logs and slow the Forest road a little gives the Shack rack a real job and
makes weather felt in one existing loop with no new meter.

### Starting points

| Code | Start | What it changes downstream |
|---|---|---|
| OF17 | **The winter arrival.** Wake in the clearing at the first snow instead of the usual season. | No field work for weeks, so the first skills are indoor ones (craft, reading, rest) and the village meets you as a mouth to feed. Spring becomes the first big unlock. |
| OF18 | **The peddler's helper.** Arrive as the peddler's hired hand and stay when he moves on. | You know Town prices and far news early but have no village ties; the peddler's later visits carry personal news for you. |
| OF19 | **The mill family's child.** Start young at the eastern mill. | Food and grain stock are your family's worry from day one; the mill quest is your own household's problem, and aging into adult work is a stage, not a timer. |
| OF20 | **The Town clerk sent to the Village.** Start in Town square with a posting to count Village stock. | Short Measure looks different from the receiving side: you know Wen's needs first and have to earn Mira's trust. Dispatch work is natural; field work is hard. |
| OF21 | **After the barn fire.** Start the morning after OF7's fire, as a farmhand whose employer lost everything. | Your first goal is rebuilding someone else's life; the Open Counter's first demand is real and urgent; the cause of the fire is a small inquiry thread. |

### Parallel versions

| Code | Version | How the player notices or crosses / what carries |
|---|---|---|
| OF22 | **The Frontier where the mill burned.** A divergent copy where the eastern mill was lost years ago. | Bread comes by cart from Town, so the Forest road is busier and richer in jobs. Crossing via a branch atlas; your skills come with you, your local ties do not. |
| OF23 | **The vanilla mirror.** A copy that is plain original YAIR, with none of the fork's residents. | Mira, Wen and the Open Counter don't exist there. Useful as a quiet, pure-vanilla place; carried items arrive, relationships don't. |
| OF24 | **The pressured Frontier.** The card's late stance: a barrier to an expansionist world has thinned. | Strangers, odd weather and missing peddlers signal it. Same map, different natural course; what you built at home matters as defense or as something to evacuate. |
| OF25 | **A rerolled-truth Frontier.** If OF15 ever gets a sealed truth, a parallel copy can roll a different one. | Exists as a sealed variant reachable by branch start; noticed through the same clearing routes. Content stays sealed. |

### Subtle details

- OF26 The old craftsman stops work exactly at dusk and won't start a job he can't finish before dark.
- OF27 The Village's day count starts on Monday as day 1 (`game_time.js`), so market day lands on the same weekday each week and regulars plan around it.
- OF28 Rough wood logs, Wood logs and Ash wood logs look alike in a stack; a new hand mixing them is a classic Short Measure-style mistake.
- OF29 First snow quiets the log: fewer outdoor lines, more indoor ones, and the header cools before anyone mentions it.
- OF30 Children copy whatever skill the player trained most that week (sticks for swords, counting pebbles for tallies).
- OF31 A rumor about you is a little bigger each time it passes a person, and it carries the name of whoever told it.

---

## Proving ground (`docs/worlds/proving-ground/`)

The brief defines two faces, carry rules and four fixtures. This pass gives the place
a keeper, honest limits on what a simulation proves, a placement dial instead of an
open either/or, and a presentation that keeps fake damage from being mistaken for real.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| PG1 | **Unique verb: isolate one variable.** Default: every bout holds named conditions constant (still air, fixed footing, one dummy behavior) and changes one. Other worlds tangle causes; here a result has a clean cause. | A clean result climbs the knowledge ladder (PRESENTATION KN1 upward). Carried into a real world it may be partly wrong (rule 6), which is itself a lesson. |
| PG2 | **Placement as coexisting entries, not a choice.** Default: the fiction face is a hall behind the Village, a short walk. Dial: also a dream entry through Sleeping, a Paradise facility rental, or its own travel destination. Reasonably: each entry has its own cost. | Hall costs the keeper's fee; dream costs sleep time and blurs detail on waking; Paradise rental costs hub points. Settles the brief's Q1 by building all reachable doors. |
| PG3 | **A keeper with a purse and opinions.** Default: one original keeper tunes dummies by hand, charges for repairs, remembers what you tested and can refuse an effect she thinks will wreck the hall. | A destroyed dummy becomes a straw-and-wood order to the Frontier craftsman, and the hall closes for a day. The place joins the home economy instead of floating outside it. |
| PG4 | **A simulation is only as good as what it was told.** Default: a dummy copy of a foreign technique is built from your observation, so a wrong observation makes a wrong dummy. Dial: fidelity from rough (description) to exact (a real sample or recorded fight). | Prevents the hall from being an oracle. False confidence from a rough copy can cost you in the real fight; getting a sample becomes a reason to travel. |
| PG5 | **Written test reports cross; loot does not.** Brief: items and money made here stay. Deeper: a written report is a record carrier (rule 5). | A report on how a technique fails can be sold to a Paradise route broker or taught to an apprentice. Honest evidence becomes a trade good without making the hall a farm. |
| PG6 | **Dream-face time ratio.** Default: fiction face uses ordinary time. Dial: a dream face where an hour of bouts costs minutes of sleep but leaves fatigue on waking. | Ties to the Sleeping to dream-walking path in LIFE_SIM. Time feels different here without a free time cheat, because the body pays. |
| PG7 | **Stakes on request.** Default: a "felled" result ends the bout with soreness and stamina loss. Dial: live-steel bouts after a signed waiver with the keeper. Reasonably: the fiction face adds risk only where the player asks for it. | A live-steel scar is real and travels with the body; the village hears about it. Most players may not need it; those who want tension can have it. |
| PG8 | **Spar a recorded style.** SELVES lists ghosts from the atlas. Deeper: a ghost is built from records, so an heir can spar a predecessor's written fighting notes. | Links heirs (rule: records can be learned again) to practice. A life that wrote things down leaves a sparring partner; one that did not leaves little to rebuild. |
| PG9 | **Hall results are tagged as hall results.** TIMELINES: hall runs make no branches. Default: Notebook entries and counters from here carry a "practice" tag; kill-count titles skip hall dummies. | Proto23 gave titles for training-ground clears (R3); here those become clearly labeled practice titles. Keeps real biography and practice from blurring. |
| PG10 | **Late-game use: calibrate restraint and test combinations.** Default: a strong character tests the smallest output of a power, or two powers from different worlds together, before using them for real. | Connects to Paradise's paid cross-world experiments. A known collision found here prevents an accident at home (OF12) or in a mission. |
| PG11 | **Dev face doubles as a sealed-text check.** Default: dev fixtures can render every knowledge stage of a test secret so tests assert truth text is absent before its route fires. | Gives the sealing rule a concrete test bench. The dev face still carries nothing into saves. |
| PG12 | **Presentation.** V6: a neutral slate tint for the hall; a pale paper wash for the dream face. V7: the header shows held conditions ("still air, bout 3 of 5") instead of weather. V8: real vitals keep a solid edge; simulated damage shows as a dashed edge. | Log voice is a terse referee. The panel only this world shows: a conditions list of what is held constant and what changed. Effect gallery (PRESENTATION) lives in the dev face. |
| PG13 | **Wear and care.** Default: dummies wear, need re-stuffing and can be named; the keeper notes each one's history. | A dummy you named and broke is a small story. Repair costs keep the hall honest about effort. |

**Smallest playable taste:** PG5. One bout that isolates one variable and ends in a
written report the player can carry home shows the whole idea: clean evidence,
a real carrier and nothing farmable.

### Starting points

| Code | Start | What it changes downstream |
|---|---|---|
| PG14 | **The keeper's apprentice.** Start as the hall's junior, repairing dummies. | You learn by watching others test, so your first knowledge is about other people's techniques; the Frontier economy is your supplier from day one. |
| PG15 | **Wake inside the dream face.** Start asleep and dreaming, with a body back in the Village you haven't met yet. | The first hours are practice with no real stakes; waking is the real start, with a little real skill and a half-remembered dream. |
| PG16 | **A broken veteran sent to recover.** Start as a former fighter whose body was hurt elsewhere. | Training is rehab: low stats, old knowledge in records, and every bout is about relearning control rather than gaining power. |

### Parallel versions

| Code | Version | How the player notices or crosses / what carries |
|---|---|---|
| PG17 | **The hall where the keeper never came.** An automated, unkept hall. | Dummies drift and break unrepaired; results get less trustworthy over time. Reached through the same door after a branch start; reports from it carry a lower trust tag. |
| PG18 | **A mirror hall that tests you.** Its dummies study the player instead of the reverse. | Noticed when a dummy repeats your own cue back. Your habits become visible as weaknesses; the report you carry out is about yourself. |
| PG19 | **The hall in another world.** Same idea hosted by a different world's rules (for example under Paradise or a cultivation world). | Local physics apply inside, so the same test gives a different answer. Comparing both reports is a cheap way to learn what each world changes. |

### Subtle details

- PG20 The keeper sweeps straw from the floor between every bout, so a fast series of bouts gets messier.
- PG21 Dummies are numbered in chalk; a retired dummy keeps its number and nobody reuses it.
- PG22 Sound drops in the hall: the outside world's ambient lines stop until you leave.
- PG23 A practice title shows in a lighter weight than a real one, so the biography stays honest.
- PG24 The dream face has no smell lines; waking adds them back first.

---

## Reincarnation Paradise hub and Goa (`docs/worlds/paradise-hub/`)

The brief covers residence, workshop, research, calendar, failure and the delivered
first-Goa branch. This pass goes into the hub's ledger logic, what survives a trip home,
how death and debts are recorded, Goa's ordinary schedules and the hub's look.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| RP1 | **Unique verb: settle.** STATED (PR03): settlement withdraws World Source and pays points, attribute access and access-level progress under that trial's multiplier; one faction admission earned source, a later assassination earned none. Default: an outside ledger judges a lived mission. | What you did and what the ledger credits differ. The player learns the hub's valuation and weighs hub-valued outcomes against what locals needed, which is the hub's moral texture. |
| RP2 | **Points sit until you reach the facility.** STATED (PR03): allocation needs a named facility. Default: unspent points travel with you, unusable until you visit. Dial: a bought remote-allocation permission. | A contractor who skips the visit runs the next mission weaker than they could be. When to go home becomes a real decision. |
| RP3 | **Access level is not strength.** STATED tier sheet: imprint/access level differs from skill level and combat power. Default: clerks and shops serve by access level. | A strong low-access contractor gets refused while a weak high-access one is served. Respect at the counter and respect in a fight become separate reputations. |
| RP4 | **Employees are a society of their own.** STATED (PR04): a paid service worker explains shops, rest and return permissions by a tablet; employees have family concerns. Default: each service has one original employee with hours, a purse and opinions. | Their tips are attributed and can be wrong. Befriending one changes which warnings you hear before a mission, without exposing hub truth. |
| RP5 | **What crosses into your origin world.** STATED (PR05): attributes and passives work at home while most abilities and items are blocked; a later paid seven-day storage service has weight, size and hazard limits. Heirlooms are excluded at entry. | A hub sword at the Frontier can't even be drawn; the craftsman (OF11) has nothing to study. Storage expires after seven days, so a home visit with gear is a timed plan with a fee. |
| RP6 | **A kill notice is a record, not a corpse.** STATED: soul, kill notice and corpse differ; a headless corpse acts after its notice. Default: notices report what the hub registered. | Trusting the notice can mean turning your back on a body still moving (rule 6). Careful contractors check the body; it becomes a habit NPC veterans teach. |
| RP7 | **Dead contractors and their rooms.** SUCCESSION row: no routine resurrection; newborns don't own predecessor power. Default: the hub holds a dead contractor's room for a set period, then clears it. Dial: a will filed with the ledger keeper. | A filed will lets the hub act as executor and deliver items to an heir in another world, under RP5's limits. A teammate who never filed one leaves friends arguing over a locked room. |
| RP8 | **Promises are not cash.** STATED: a promised payment is not received money; a deposit certificate differs from coin. Default: an unpaid local promise stays in that frozen world. | Leaving Goa before a noble pays leaves a debt you can collect on revisit, or lose if the noble fell. Ties to the retained-instance revisit. |
| RP9 | **Return extension has its own contract.** STATED (PR07): an accepted hidden task can delay forced return; early return forfeits it with stated penalties. Default: staying longer needs a real in-world task. | Staying to help Goa's aftermath (Hank, Rin, refugees) is a priced choice with a clear exit, not a free extension. |
| RP10 | **Rivals see only public messages.** STATED: rival contractors saw only a public abandonment notice while a private exemption stayed hidden. Default: hub-to-hub information follows public channels. | Two hubs in one world misread each other. A player can exploit or suffer that asymmetry; rival hubs in LIFE_SIM gain a concrete information rule. |
| RP11 | **The hub while you're gone.** Rule default: absent worlds freeze; dial: a 3:1 clock. Deeper: Default keeps the hub frozen. Dial: a lived hub where shop stock rotates and friends' ranks change. Reasonably: rooms are granted by rank, so absence costs no rent. | In lived mode a friend may be promoted or dead when you return, which makes the bar feel like a real workplace. |
| RP12 | **Goa's people keep schedules.** Proposal: before the fire, civilians are at docks, markets or homes by hour and weekday. Default: who is where when the fire spreads follows those schedules. | Abstaining lets the natural course play out; arriving at a different hour changes who you can warn. The civilian cache and warning (delivered) gain a time-of-day dimension. |
| RP13 | **Goa remembers your face.** Default: in a retained instance, people who saw you recognize you on revisit. STATED: a disguise-mask boost lasts 72 hours or ends after a very hard disguise. | A returner who acted openly is a known foreigner; one who stayed hidden can come back fresh. A late-game reason to return: Goa as a trade partner for the hub workshop's local seal recipe. |
| RP14 | **Two voices in the log.** Default: hub notices use a bracketed, impersonal system voice; Goa people use human speech with names. | The player can tell whether a line is the institution or a person. Notices can be wrong (RP6) and still sound certain, which is the point. |
| RP15 | **Presentation.** V6: hub tint is a cold contract-ink indigo; Goa is smoky amber that darkens as the fire nears. V7: hub header shows mission and time-ratio glyphs (no weather indoors); Goa shows wind direction, which matters for fire. V8: a "return pull" edge glows during the STATED 30-second return. | The panel only this world shows: the settlement receipt listing what was credited and what was not (RP1). Sound: a short chime for notices, off by default. |
| RP16 | **Name seams from the edition.** STATED alias file: Byakuya/Bai Ye, Benny/Beini, Rank/Tier shift at a translation seam. Default: one stable display name per person, with the alias recorded in metadata. | Fans of different translations notice. Stable names keep save text and dialogue from changing mid-play. |

**Smallest playable taste:** RP1. One settlement receipt that credits part of a finished
Goa task and declines another shows the hub's unique logic at once, using the delivered
Goa branch and a single new ledger screen.

### Starting points

| Code | Start | What it changes downstream |
|---|---|---|
| RP17 | **A hub employee, not a contractor.** Start behind a service counter. | You learn the hub's rules from the inside, earn wages instead of points, and meet contractors as customers; becoming a contractor later is a real career change. |
| RP18 | **A Goa local who survives the fire.** Start as an ordinary Goa resident before the fire. | The hub is a rumor; contractors are strangers who sometimes help. Your goals are family and shelter; recruitment can come later or not at all. |
| RP19 | **The returned veteran.** Start as a contractor coming back from a failed mission with unallocated points and a dead teammate. | First tasks are the facility visit (RP2), the teammate's room (RP7) and a reputation hit at the counter. |
| RP20 | **A rival hub's defector.** Start having just left another paradise. | Both hubs remember. You know a rival's tactics but have low access here, and some employees won't serve you yet. |

### Parallel versions

| Code | Version | How the player notices or crosses / what carries |
|---|---|---|
| RP21 | **Goa after the fire as a premise.** A copy where the fire already happened without any contractor. | Reached by a branch start; the city is rebuilding and its politics differ. Your hub gains carry; Goa ties start at zero. |
| RP22 | **A rival paradise's hub.** Same structure, different charter (the source names several). | Crossing means defecting or a visit pass. Points don't convert by default; attributes come with your body. |
| RP23 | **The hub that pays for different things.** A copy where settlement values local survival over objectives. | Noticed on the first receipt. Same missions, different best choices; a quiet test of what the player was really doing it for. |
| RP24 | **A rerolled-truth hub.** A variant where one hub secret (unassigned sealed ID) differs. | Exists as a sealed branch reachable by premise start; noticed through employee hints and ledger oddities. Content stays sealed. |

### Subtle details

- RP25 Employees stay standing while a contractor is at the counter, and they rest in shifts you can learn.
- RP26 The bar goes quiet when a death notice arrives; the next round is on the house.
- RP27 Goa smoke clings: after the fire, Goa items carry a "smells of smoke" note until washed.
- RP28 A new contractor's room is bare; veterans' rooms collect mission souvenirs that can't leave the hub.
- RP29 Settlement receipts list items in the order the hub values them, not the order you did them.
- RP30 The 30-second return countdown ticks in the log even mid-sentence, cutting a conversation short.

---

## Proto23 village (`docs/worlds/proto23/`, `docs/research/proto23/`)

The brief and status cover the visitor cottage, reading or tutor, fixtures and the
Shack kit; the research files cover UI and mechanism absorption into the home world.
This pass treats the village as its own world with different physics: instant
geography, fullness pacing, a weekday rhythm, surprising weather, a cat, a basement
and the dojo ladder as a fair measure.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| P231 | **Instant geography as local physics.** STATED (F6): Proto23 moves between menu places with no travel time. Default: inside this village, walking costs no game time. | The Frontier's 240-minute roads vanish, so errands chain fast and the limit becomes energy and food. A visitor feels the change immediately; it is the world's clearest mechanical identity. |
| P232 | **Fullness paces work here.** STATED (F3): fullness scales XP efficiency and combat. YAIRPG has optional hunger (`absorb_e1`). Default: hunger is on as this world's adjective. Dial: off. | With no travel cost (P231), meals become the schedule. Cheap bad food trains Survival and Gluttony (O6), so a poor visitor grows tougher by eating badly. |
| P233 | **A weekly rhythm.** STATED (R5): the dojo serves a free Sunday meal; weekdays show with an optional kanji display. Default: Sunday meal at the dojo for anyone enrolled. | A broke visitor plans around Sundays, the cook learns their face, and a weekly social beat exists where the Frontier runs on seasons. |
| P234 | **Weather that surprises.** STATED (R1): a 14-state seasonal weather chain with fog, thunder and lightning; rain wets you outdoors unless rain-proofed. Default: Proto23 weather stays stochastic here. | Rain Shoes and rain gear matter. A rare lightning strike outdoors does real damage and earns a title. Contrast with Frontier's plannable cycle is the point. |
| P235 | **A cat that adopts the cottage.** STATED (R1): a growing cat ages, has mood, brings gifts and improves bed rest; a smoke event pushes it outside. Default: a stray adopts the visitor cottage if fed. | It ages while you are there and freezes while you are away (rule default). It crosses worlds only if you carry it, and then it is a Frontier cat with Frontier needs. |
| P236 | **Danger under the floor.** STATED (R3): "Your basement" is a higher-level area (bats, spiders) with a rare coin. Default: the cottage has a cellar door that stays shut until the visitor has means. Dial: open from the start. | Home with danger beneath. A strong returner has a reason to come back to a quiet village; the brief's basement rat arc can grow from it. |
| P237 | **The dojo ladder as a fair measure.** STATED (R3, R5): training tiers, four golem trials with a final title, rewards every five levels. Default: an adult visitor can enroll for fees; the master judges shown form, not imported level. | Golems have fixed difficulty, so a strong returner can measure themselves honestly (beaten stays beaten). The visitor skips the pupil's biography but can still earn the ladder. |
| P238 | **Scarce income by design.** STATED (F8): vendors mostly sell; a few fixed-price buyers take goods. Default: no money changer at the passage (brief: no currency conversion). Dial: a barter desk that buys Frontier goods at a fixed price with a finite purse. | Money is hard here, which makes the paid guest agreement and guard duty meaningful. A finite buyer purse keeps imports from flooding the village. |
| P239 | **Food spoils by local rules.** STATED (R1): spoilage is seasonal; the Iron Stomach title lets you guess rot time. Default: food in your pack follows the world you are in. | Frontier bread goes off faster in a Proto23 summer. Packing for a visit becomes a small skill, and Iron Stomach is useful across worlds as knowledge. |
| P2310 | **Karma as a quiet local ledger.** STATED (R1): quests grant karma +1. Its effects were not traced in the readers (unknown). Default: the village tracks a visitor's karma from zero; it does not cross. | Keeps the number honest as a local memory of good deeds, without inventing effects the source may not have. |
| P2311 | **Death as a counted event.** STATED (R1, R3): a death counter, titles for deathless streaks, a Stupa that adds a small chance to avoid death. Default: a visitor's defeat returns them to the cottage and counts. Dial: real death in a harsh life. | Deathless titles give careful play a long goal. The Stupa is a fan-recognizable item worth a small local role. |
| P2312 | **A hint of a higher system.** STATED (R1): a cultivation-pill purification effect deals damage over time and grants large XP if survived. Default: a dangerous voluntary trial for a strong visitor, clearly warned. | Gives late-game Proto23 a rung without importing a full cultivation ladder. Its source scope is partial, so it stays one bounded trial. |
| P2313 | **Absence is a cold hearth.** STATED (R5): source offline mode is defined and never called. Default: the village freezes while you are away; the cottage fire is out on return (brief: no perpetual fire). | Returning means relighting, counting firewood and feeding the cat (P235). Small chores make arrival feel like coming home. |
| P2314 | **Presentation.** V6: Proto23's own teal-to-purple region gradients (STATED P2) as this world's tint. V7: the weather glyphs this idea came from, plus the weekday (kanji toggle). V8: a blue edge while Wet, green while poisoned. | Log voice is short and colored, with "New Title Earned!" style lines. The panel only this world shows: the worn-title picker, since Proto23 wears one title at a time. |
| P2315 | **Look-alikes with home.** STATED (R1): Proto23 seasons sit two months off YAIRPG's, and its weekday index counts Monday as 0 while YAIRPG's day count starts Monday at 1. Both have a "Village Center" (prefixed in the brief). | Crossing in some months changes season even on the same date. Fans notice; the passage log can show both calendars side by side. |

**Smallest playable taste:** P235. A stray cat that adopts the existing visitor cottage
when fed, ages there and improves rest uses the delivered cottage and bed, adds one
small companion and makes the world feel lived-in at once.

### Starting points

| Code | Start | What it changes downstream |
|---|---|---|
| P2316 | **The dojo cook.** Start as the person who makes the Sunday meal. | Fullness (P232) is your trade; everyone passes through your kitchen; fighting is optional and late. |
| P2317 | **Yamato's hunting partner.** Start as an adult hunter in the forests outside the first branch. | Firewood and First Hunt quests are your daily work, not a pupil's chores; the village is a market you visit. |
| P2318 | **The previous guest.** Start as the cottage's last visitor, the year before the current one. | You set up the fixtures the later visitor finds; what you leave in the cottage is inherited by the next life (heir rules). |
| P2319 | **A store keeper's child.** Start behind the Shabby General Store's counter. | You know stock and buyers' fixed prices (P238) and grow up on gossip; the dojo is across the square and expensive. |

### Parallel versions

| Code | Version | How the player notices or crosses / what carries |
|---|---|---|
| P2320 | **The finished Catacombs.** STATED (R5): the Catacombs are an unreachable 26-room maze in this revision. Variant: a copy where they are open. | A later source build may finish them; treat as a separate source revision with its own instance. Your body and skills carry; the village state is separate. |
| P2321 | **Proto23 with travel time.** A copy where its places sit on a real map with distances. | Noticed when walking costs minutes. Lets the player compare the two physics; useful as a test of P231 inside the Proving Ground (PG19 idea). |
| P2322 | **The pupil's own village.** A copy where you are the source's kid at the dojo. | Starts from the source biography with its rewards; your visitor cottage doesn't exist there. Carries nothing of the visitor branch. |

### Subtle details

- P2323 The cat sleeps on the bed on cold days and by the hearth on warm ones.
- P2324 A lifetime counter keeps rising quietly (pats, years at home) long before its title appears.
- P2325 Fog cuts the log's place line short; you know less about who is around.
- P2326 The dojo floor creaks at the same spot; regulars step around it.
- P2327 The Hikikomori counter resets the moment you step out, so leaving home for one errand costs a long streak.
- P2328 Thunder arrives a line after lightning in the log, not at once.

---

Sealed-secret IDs touched: none. OF15/OF25 and RP24 name possible future sealed
secrets only by existence and route, with no truth and no assigned ID.
