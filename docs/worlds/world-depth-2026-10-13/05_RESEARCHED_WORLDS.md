# Deeper considerations: researched worlds (proposal, 2026-10-13)

Weibao: "deeper considerations for each world?" Scope: every row under
"Researched worlds" in `docs/worlds/BOOK_WORLD_ENTRY_MATRIX.md`, plus the
author-synopsis candidates in `docs/worlds/novel-worlds/CANDIDATES.md`
(Perfect Run, Cradle, Traveler's Gate, Wandering Inn). Mother of Learning
is in CANDIDATES too but has its own world folder and owner, so it is left
to that pass.

Everything here is a proposal. None of these worlds has a
`docs/worlds/<world>/` folder yet; the existing owners are
`docs/WORLD_CARDS.md`, `docs/CHEATS_BY_WORLD.md`,
`docs/worlds/SUCCESSION_BY_WORLD.md`, the matrix itself,
`docs/LIFE_SIM_NORTH_STAR.md`, the Kenshi research folder and the private
full-book dossiers. Rows below were checked against those and try to add
what they do not say: daily-life texture, what keeps running, presentation,
and late-game reasons to stay. Creation screens, entry routes, system
levels and observation rules are in the matrix and not repeated.

Each world also gets a compact addendum block (per the brief's addendum, kept short because of world count): starting points, parallel versions and subtle details, numbered on from the world's table. Rerolled or changed truths are named as sealed, with no content.

Labels: (G) general franchise knowledge, not repo notes. (U) unverified or
machine-translated source. (I) our inference from repo notes. Rows
without a label paraphrase repo notes or are original proposals.
Presentation rows use V6 frame tint, V7 ambient header and V8 state edges
from `docs/research/proto23/VIVID_AND_UI_FLOW_CONSIDERATIONS_2026-10-13.md`.

---

## Shared-engine clusters

Per-world rows below assume these and do not repeat them.

### Integration worlds (`CLI`)

Crucible, Omniscient Reader, Labyrinth of the Mad God, Solo Leveling,
Genetic Ascension, and in part Shadow Slave, Gluttony and You Are Summoned.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| CLI1 | **Day-zero ledger.** Default: the character's pre-integration life (job, lease, bank balance, family contact) stays as live records that the new order rereads. Dial: how fast old institutions fail. | Unpaid rent meets a landlord who has his own survival problem; an old employer becomes a station boss. The old world's ties are the first quests, not flavor. |
| CLI2 | **One public notice, many private panels.** Default: world-wide announcements reach every NPC at the same tick, so neighbors react to the same message; the player's own panel is a separate channel. | Gossip about an announcement spreads with varying accuracy, while a private reward stays private until someone sees its effect. Fits rule 6 (sight can be wrong). |
| CLI3 | **Integration clock.** Default: scenario or gate clocks run while you play in that world and pause at routine stop conditions when the game closes, like any absent danger. Dial: "scenarios run offline" for harsh lives. Reasonably: the system schedules for its contestants. | Keeps the idle promise (no life lost while closed) while letting deadlines bite during play. One shared clock module serves gate breaks, scenario timers and tower thresholds. |
| CLI4 | **Commons pressure.** Default: some personal rewards raise a shared local danger value, and NPCs remember who cashed in. Dial: how visible the link is before you choose. | Generalizes Labyrinth's tower entry: individual healing makes everyone outside worse off. Turns selfish optimal play into a social cost with names attached. |
| CLI5 | **Mundane goods reread.** Default: pre-integration items get a value set by the new jurisdiction (a cheque refused, a lighter priceless). Dial: per-world reread table. | Gives the inventory a first-week story and makes ordinary knowledge (first aid, cooking) worth more than a bank card. |
| CLI6 | **Survivor settlement as first law.** Default: the first institution is a camp, station or refuge with levy, watch and food-ownership rules authored per world. | The player meets law before meeting a king. Running or reforming one settlement is a full mid-game career. |

### Loop and regression worlds (`CLL`)

Regressor's Tale, You Have Died Again, Circle of Inevitability, Perfect
Run, the Gu Wilds rewind route, Omniscient Reader's regression turns, and
Speedrunning's runs.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| CLL1 | **Reset receipt.** Default: at each reset the game shows what each carrier kept (memory, a single shared key item, a soul wound, an owned object) and what returned to start. | Players plan the next loop around the receipt. It makes rule 5 (things cross only if something carries them) visible at the moment it matters. |
| CLL2 | **Strangers again.** Default: NPC relationships reset while the player's memory of them stays; known preferences shorten rapport but uncanny familiarity can be noticed. Dial: how sharp the noticing is per person. | Gives loops their ache (Mother of Learning's pattern) and a detection risk. A close friend notices first; a shopkeeper rarely. |
| CLL3 | **Idle inside a loop.** Default: offline routine progress inside a loop resets with the loop except for retained categories, so idling in a loop farms skill and knowledge, not goods. | A mechanically distinct idle rule: the same hour of fishing yields a skill level that survives and a fish that does not. |
| CLL4 | **Branch residue.** Default per world: failed runs either vanish or persist as variant worlds reachable through the variant-world link at a cost. | You Have Died Again keeps them; others do not. One flag on the loop engine, and it feeds `docs/TIMELINES_AND_DIVERGENCE.md`. |
| CLL5 | **Variance detection.** Default: some observers compare histories; too-perfect play raises their attention, and looking weak is cover. | Gives a reason to play imperfectly on purpose. Ties loop worlds to the observation contest instead of a flat "you are found" event. |

### Host-transmigration worlds (`CLH`)

Fog City, Fated Villain, Warlock, the Gu Wilds host route, Speedrunning's
random bodies, Legendary Mechanic's reincarnation, Gluttony's shared body.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| CLH1 | **The host's unfinished calendar.** Default: the host's appointments, debts, shifts and promises keep arriving as dated obligations, revealed one at a time. | The first week is the host's life, not yours. A missed appointment becomes a rumor, then a reputation. |
| CLH2 | **Memory surfaces by trigger.** Default: host memories unlock from places, people and objects, recorded with basis "host memory" and a confidence level that can be wrong. | Exploring the host's town is how you learn your own past. A false memory is a real hazard. |
| CLH3 | **Intimates notice first.** Default: recognition of a changed person scales with closeness and with how often behavior breaks habit; looks rarely matter. | Thanking a relative who was never thanked before (Speedrunning small touch) becomes a test. Family is the hardest disguise check. |
| CLH4 | **Body is the host's.** Default: knowledge and soul-carried skill cross; aptitude, strength, reflexes and bloodline are the host's until trained or changed. | Each new host is a fresh build with old knowledge. Keeps transmigration from being a free stat carry. |
| CLH5 | **Original occupant status.** Dial per world: displaced, merged, dormant or unknown. Where a world randomizes it, the truth is sealed. | One flag drives recognition, heir claims and late reveals without hard-coding one answer for every book. |

### Cultivation worlds (`CLC`)

Gu Wilds, Er Gen worlds, Regressor's Tale, Cradle, Fated Villain.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| CLC1 | **Seclusion is the native idle.** Default: closed-door seclusion is an activity that runs offline and queues any breakthrough attempt for your return instead of resolving it unseen. Dial: harsh mode resolves it offline. | Cultivation worlds are where long offline stretches make in-world sense. The risky part waits for the player. |
| CLC2 | **Lifespan per realm.** Default: each realm adds years; mortal friends age on their own clock. Dial: the "lived time" mode makes seclusion cost real years. | Outliving friends is the genre's quiet cost (Beyond the Timescape's waiting). Gives old mortal ties weight late in a life. |
| CLC3 | **Sect duty while away.** Default: assigned sect duties pause with the world; under the lived-time dial, missed duties cost contribution and standing. | Contribution points, library access and rank already exist in notes; this ties them to time and absence. |
| CLC4 | **Currency grades move.** Default: spirit-stone or essence grades can be revalued by events (ISSTH shows this), so savings in one grade can lose worth. | A macro chain from one discovery or war to every household's purse. |
| CLC5 | **The mortal layer stays.** Default: a mortal village, its debts and crafts remain playable and useful at every realm. | Er Gen's three-silver debt pattern. Prevents the world from shrinking to the sect as power rises. |

---

## The Crucible (A Novel Concept) (owners: `docs/WORLD_CARDS.md` §2, north star "What A Novel Concept adds")

Adds the cohort, arrival waves and the tribulation due date as daily-life
facts; existing notes cover Concepts, the shop, revival and small touches.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| CR1 | **The Tutorial cohort as people.** Default: the people you entered with are a named roster whose fates are tracked, met again, mourned or envied. | A cohort gives the hostile world faces. A cohort-mate who died tests your later choice to revive or not. |
| CR2 | **Arrival waves reprice the world.** Default: new captured civilizations arrive on a schedule; each wave brings refugees, rivals and unknown knowledge that shifts market demand. (I) | Your cocoa-style novelty loses value when a wave brings its own; your survival notebook gains a new market of newcomers. |
| CR3 | **Survival notebook as an export.** Default: your identified foods, hazards and safe sites are a sellable record that later arrivals pay for. | Turns early suffering into a mid-game trade. The mentor career grows out of it. |
| CR4 | **Tribulation due date.** Default: a pending tribulation shows as a dated item; delay is allowed at a price. Dial: delay adds difficulty (our proposal, not in source). | Allies plan around it, rivals time attacks to it, and the player plans a life around a known exam. |
| CR5 | **Shelter quality feeds rest.** Default: refuge insulation against heat and energy sets sleep quality, which feeds training gain. (I) | Small chain: a better wall means better sleep, faster training, readier tribulation. Makes building the refuge feel like progression. |
| CR6 | **Unity changes the voice.** Default: deep Concept stages tint the log voice and some dialogue choices toward the Concept. Dial: how strong. | Identity risk at Unity becomes felt, not just stated. A returning strong character reads differently to old friends. |
| CR7 | **Presentation.** V6 tint: heat amber over navy. V7: ambient energy density and hostile weather. V8: soul wear from revivals as a hairline crack on the vitals edge. Panel only here: the Concept stage chart (Affinity to Unity). | Tells you you are somewhere that wants you dead before any text does. |

**Smallest playable taste.** CR1 with CR3: one named cohort-mate, one
risky food identification shared or sold. It uses existing gathering and
people records and shows the world's heart: survival is social.

- **Starting points.** CR9 *A later arrival wave:* enter years after the first civilizations, into a world with markets, refuges and old rivals already settled. CR10 *A native of the Crucible's ecology:* a body adapted to the environment, for whom newcomers are the hazard.
- **Parallel versions.** CR11 *A Crucible where a different Concept took the eighth throne* (sealed; reached by a rift whose energy feels wrong to anyone at Harmony or above); carries Concept knowledge, not stage. CR12 *A cohort that all survived the Tutorial:* same arrival, crowded refuge, scarce food; crossed by the variant-world link.
- **Subtle details.** CR13 Veterans of the first week eat sitting down with their backs to a wall. CR14 The refuge's first name, given in panic, sticks even after a nicer one is painted on. CR15 Fire users warm their hands on cold mornings without thinking, and newcomers stare.

## The Gu Wilds (Reverend Insanity) (owners: `WORLD_CARDS.md` §3, `CHEATS_BY_WORLD.md`, parallel-book-design RI report)

Adds Gu upkeep as the daily chore, the essence budget and what happens to
a stable at death.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| GU1 | **The feeding round.** Default: each Gu has a diet and interval; feeding is the daily loop in session. Absent worlds freeze, so Gu wait while the game is closed. Dial: lived time lets Gu starve. | The world's one verb: keeping living power alive. Distinct from every inventory elsewhere. |
| GU2 | **Gu food markets.** Default: Gu foods have seasons and suppliers; a beast tide or a clan feud spikes prices. (I) | Chain: one flower's bad season raises a clan stipend's real cost, which strains loyalty. |
| GU3 | **Essence as a daily body budget.** Default: aperture essence refills by day and bounds how much Gu work you do; primeval stones work as money (G). | Gives each day a hard spend limit that is the body, not stamina. |
| GU4 | **Clan school cohort.** Default: same-age students, monthly stipend, tests and petty politics before any real power. (G, partly) | The ordinary life of a weak practitioner. Most residents never leave this layer. |
| GU5 | **Calamity as fate weather.** Default: deviant or otherworldly acts raise unseen attention that shows as odd luck streaks and calamity events in the deck, not a visible meter. | Keeps Heaven's Will mysterious and lets concealment Gu matter as costly items. |
| GU6 | **A stable at death.** Default: your Gu go wild, pass to the clan, or wait for an heir who has to re-bond them. | Gives succession a living inheritance that can be lost by neglect. |
| GU7 | **Presentation.** V6 tint moss green and bronze. V7: mountain mist and season. V8: Gu hunger as an edge on the stable panel, not the vitals. Panel only here: the aperture (essence sea and Gu slots). | Hunger lives on the creatures, which is the point. |

**Smallest playable taste.** GU1 with one starter Gu, one food source and
one missed feeding consequence. It is small, uses existing activity and
item code, and is the clearest "this world is different" proof.

- **Starting points.** GU8 *A Gu caretaker servant:* feed a master's stable for wages, learning recipes without owning Gu. GU9 *A caravan merchant's child* who sees many clans and belongs to none.
- **Parallel versions.** GU10 *A rewind where the rewinder failed:* the 500-year history runs without the outsider's interference (divergent canon point; noticed through a clan that should have fallen and did not). GU11 *A rerolled fate of the clan village* (sealed; route through the inheritance-cave rumor).
- **Subtle details.** GU12 Children name their first Gu and stop once they have lost one. GU13 Elders tap the table twice before a stipend is paid out. GU14 Wine-loving Gu make a stable smell faintly sweet.

## The Fog City (Lord of the Mysteries) (owners: `WORLD_CARDS.md` §4, parallel-book-design LotM report)

Adds the city week, paperwork, careers that also digest, and the rule
that acting needs presence. Discovery routes S1 and S2 stay as recorded
(specified, sealed).

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| LM1 | **The week as rhythm.** Default: church day, club day, payday and market days repeat weekly and shape who is where. (G for the weekly club) | The city's clock is the week, not the season. Skipping church is noticed by a named neighbor. |
| LM2 | **Two kinds of papers.** Default: civil papers (rent book, references) and occult registration are separate records; holding one and not the other is a distinct state. | Echoes Kenshi's paper identity with a second, secret register. Inspectors check different papers. |
| LM3 | **Careers that also digest.** Default: a cover job that matches your role (a fortune shop for a diviner) digests faster but draws more notice; a mismatched job hides better and digests slower. | A real life choice with a trade-off, built from existing job and acting rules. |
| LM4 | **Acting needs presence.** Default: cover-job routines run offline; digestion progresses only from acts you choose in session. | A clean, distinct idle rule: money accrues while away, power does not. |
| LM5 | **Contagious reading.** Default: dangerous texts pass their risk to whoever reads them next; quarantined collections and their keepers are a career. | Turns "knowledge is dangerous" into social and economic play. A borrowed book can hurt a friend. |
| LM6 | **Funerals are custody disputes.** Default: a Beyonder's death leaves a hazardous characteristic; family burial and church custody compete. | Death becomes a household event with institutions, not just loot. |
| LM7 | **Presentation.** V6 tint sepia grey with gaslight gold. V7: fog density, smog weeks, and a red moon on some nights (G). V8: spirituality depletion as an edge separate from the existing sanity log tint. | Two separate mind costs read separately. |

**Smallest playable taste.** LM3 with LM4: one cover job, one role act per
day, money while away. It proves the world's core rule with almost no new
systems.

- **Starting points.** LM8 *A newspaper typesetter:* sees every odd advertisement first and decides which ones run. LM9 *A church night-watch recruit:* the hunter side of the city from day one.
- **Parallel versions.** LM10 *The sequel-era city* as a separate era with its own institutions, kept apart as the design report asks. LM11 *A rerolled pathway truth* (sealed; ties into the existing S1 records route without changing it).
- **Subtle details.** LM12 Landladies count candles because gas is expensive. LM13 Clerks keep their real reading glasses in a drawer and wear plain ones at the counter. LM14 Smog weeks make everyone speak a little quieter on the street.

## Circle of Inevitability (owner: private `full-book/circle-of-inevitability/WORLD_BRIEF.md`)

Adds two clock types in one world, night work, household wards and wills.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| COI1 | **Two clocks in one world.** Default: inside the looping village the day resets; outside it time is linear. Crossing the boundary changes which clock the header shows. | Lets the loop engine run as a local place rule, a good first test of CLL1 to CLL3 at small scale. |
| COI2 | **Night economy.** Default: theater and dance-hall work pays in wages plus tips that follow performance skill and local reputation. | A night-shift career with its own gossip network, distinct from day jobs. |
| COI3 | **Household ward chores.** Default: covering mirrors or similar cheap practices lower a household risk; skipping them is a small, real hazard. (I) | A chore with a reason. Gives ordinary people agency against the occult. |
| COI4 | **Wills with conditions.** Default: inheritance can require the heir to meet terms (give away a share, finish a task). | A succession quest shape that fits the source and works for "same player, related character". |
| COI5 | **Calendar-wide conditions.** Default: festivals and election weeks change which actors may move; the player can plan around them. | A city-scale schedule that NPC plans also read. |
| COI6 | **Presentation.** V6 tint wine violet with mirror silver. V7: date, plus a loop count once the character knows. V8: a borrowed-power edge in the bestower's color. Panel only here: the pact ledger. | The loan's imprint is visible on you. |

**Smallest playable taste.** COI1: one looping hamlet beside a linear road.
It reuses the loop engine in a bounded space and makes the reset feel
local.

- **Starting points.** COI7 *A Port Santa dockhand on the sea prayer day.* COI8 *A Trier student whose homework sits beside ritual knowledge.*
- **Parallel versions.** COI9 *A Cordu that never looped* (changed premise; noticed when villagers age normally). COI10 *A dream-festival copy of a city* with capped power and real harm, crossed by sleep.
- **Subtle details.** COI11 Shepherds count sheep twice at dusk out of habit. COI12 Theater staff tip the doorman, not the manager. COI13 Mirrors in cheap rooms are hung slightly crooked so they don't face the bed.

## The Dreaming (Shadow Slave) (owners: `WORLD_CARDS.md` §5, parallel-book-design SS report)

Adds sleep as scheduled risk, flaws as social facts, and two residences.
Routes SS-S01 to SS-S04 stay specified and sealed.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| SS1 | **Sleep is scheduled risk.** Default: sleep happens in guarded halls or with shift partners; vanilla Sleeping becomes a safety skill. Closing the game does not trigger a nightmare. Dial: harsh mode. | Turns an idle-game staple into this world's daily tension. |
| SS2 | **Flaws are social facts.** Default: employers, clans and friends can learn your Flaw; hiding it is a disguise contest. | A Flaw shapes jobs and trust, not only fights. |
| SS3 | **Memory upkeep as craft.** Default: Memories can be damaged, repaired and enchanted; a weaver career services them. (G for weaving) | Gives soul-bound items an economy beyond drops and inheritance. |
| SS4 | **Two homes, two rents.** Default: a waking-world flat and a dream-realm billet each carry costs; realm time ratios mean you come back to missed shifts. | Makes the realm split a household problem. |
| SS5 | **Status ladder of sleepers.** Default: sleepers, the Awakened and legacy clans live under different rules and duties. (I) | Gives an unawakened life a real place in the world. |
| SS6 | **Presentation.** V6: slate blue awake, near black with rune gold in the dream realm. V7: realm and gate alerts. V8: a Flaw-triggered edge. Log voice: rune-like descriptors for Spell notices. | The frame tells you which realm you are in. |

**Smallest playable taste.** SS1: one night in a guarded hall with a
shift partner and one small risk. Cheap, reuses sleep, and shows the
world's premise.

- **Starting points.** SS7 *A sleeper's parent:* daily life waiting for a child's first nightmare. SS8 *A dream-realm citadel cook* who never goes beyond the walls.
- **Parallel versions.** SS9 *A waking world where the Spell came later:* a decade more of ordinary life, different institutions. SS10 *A rerolled Spell rule* (sealed; separate from SS-S01 to SS-S04).
- **Subtle details.** SS11 People check the locks before naps. SS12 Clan heirs wear Memories as plain jewelry to look modest. SS13 Night shifts are paid more than day shifts in every trade.

## Fated Villain (owner: private `full-book/fated-villain/`, `CHEATS_BY_WORLD.md`)

Adds protagonists as local weather, fortune as a crop and the villain's
household. Source is (U).

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| FV1 | **Protagonists make weather.** Default: protagonists draw scripted fortune events (auction upsets, insulted heirs, falling treasures) and ordinary NPCs nearby take the fallout. | Living near a protagonist is a daily hazard and opportunity for every resident. |
| FV2 | **Grow, then harvest.** Default: fortune is worth more after a protagonist has grown; deciding when to strike is the unique verb. | A farming loop with rivals as the crop, and a reason to let enemies thrive for a while. |
| FV3 | **Two faces to keep.** Default: a public benevolent image and a private record; servants who know can leak. | Reputation play with named witnesses instead of one fame bar. |
| FV4 | **The clan estate.** Default: elders, guards and maids with their own lives make the villain's home an estate to run. | Life-sim depth inside a power fantasy. |
| FV5 | **Spirits in rings.** Default: resident spirits in objects advise with their own agenda and can recognize former masters. | A classic trope with a mechanical role in succession. |
| FV6 | **Presentation.** V6 tint imperial purple and gold. V7: fortune weather, visible only through the system. V8: a backlash warning edge. Panel only here: the protagonist roster with fortune values. | The private display is the world's identity. |

**Smallest playable taste.** FV2 with one rival and one timing choice.
Shows the villain loop without a whole clan.

- **Starting points.** FV7 *A minor young master* fated to be slapped by a protagonist. FV8 *A maid in the villain's estate* who knows more than the guests.
- **Parallel versions.** FV9 *A world where the protagonists won early* (divergent canon point; noticed through a clan hall in ruins); carries fortune knowledge, not fortune. FV10 *A rerolled system owner* (sealed).
- **Subtle details.** FV11 Auction houses seat strangers far from the young masters. FV12 Servants say the young lord is "wearing his good face" when guests arrive. FV13 Protagonists eat at the cheapest stall the day before they meet a treasure.

## Regressor's Tale (U) (owner: private `full-book/regressors-tale/`)

Adds the coworker cohort, support careers and two castes.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| RT1 | **Coworkers as cohort.** Default: the group transported together is met again each regression with varied fates. | The emotional core is people, and it reuses CR1's cohort records. |
| RT2 | **Knowledge income can be stolen.** Default: a profitable recipe known from past lives earns money, but competitors and bandits can take the market this life. | Knowledge stays an advantage without being a guarantee. |
| RT3 | **Support career.** Default: funding and housing a stronger friend's training is a valid, rewarded path. | Gives non-fighters a central role in a power world. |
| RT4 | **Two castes.** Default: martial artists and cultivators live under unequal law (a martial artist may not harm a cultivator). | Daily deference and risk depend on which ladder you are on. |
| RT5 | **The soul ages.** Default: each return gives a young body, but the log voice and some dialogue age with total lived years. | Fifty years lived once should show. |
| RT6 | **Presentation.** V6 tint ink-wash grey with cinnabar. V7: loop count to self. V8: a death-layer echo edge. | Quiet, literary tone matches the source. |

**Smallest playable taste.** RT2: one recipe, one market, one competitor
in a restarted life. It tests CLL1 retention on ordinary work.

- **Starting points.** RT7 *A coworker, not the regressor:* the same transport without memory. RT8 *A martial sect clerk* who sells method access.
- **Parallel versions.** RT9 *A loop where the coworkers were never taken* (changed premise; noticed when no familiar faces wait in the cave); carries memory only. RT10 *A rerolled cause of regression* (sealed).
- **Subtle details.** RT11 The regressor folds clothes the same way each life. RT12 Soap sellers recognize a rival's recipe by smell. RT13 A ghost that should greet the regressor sometimes simply does not come.

## Omniscient Reader (owner: private `full-book/omniscient-reader/`)

Adds being watched as a daily choice, running a station, and a book whose
text is uneven.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| ORV1 | **Choosing when to be seen.** Default: some acts happen on broadcast and earn reactions; others can be kept off-channel at a cost. | Kindness for an audience and kindness in private become different acts with different results. |
| ORV2 | **Running a station.** Default: a station's levy, dependents, defection and flag rules can be set by whoever holds it. | A micro-government career inside the first weeks. |
| ORV3 | **Deadlines beside chores.** Default: scenario timers run beside food and sleep; coins buy body stats. | The daily trade-off between survival and the next scenario. |
| ORV4 | **The book as uneven knowledge.** Default: book knowledge has a fidelity value; self-styled prophets sell wrong versions. | Foreknowledge stays useful and fallible. |
| ORV5 | **Probability as weather.** Default: big interventions raise local probability strain that shows as storms. | Gives the cost a place in the world, not a hidden number. |
| ORV6 | **Presentation.** V6 tint subway fluorescent with broadcast magenta. V7: scenario timer and channel indicator. V8: probability cracks. Log: constellation messages as filterable comments. | The audience lives in the log. |

**Smallest playable taste.** ORV1: one shared meal on or off broadcast,
with different results. Small, social, and true to the book.

- **Starting points.** ORV7 *A commuter in another carriage:* the same day without the reader. ORV8 *A station dependent* with no fighting role.
- **Parallel versions.** ORV9 *An earlier regression turn* where a related, different person leads; crossed only through story-level means, carries a Story, not a self. ORV10 *A rerolled book ending* (sealed).
- **Subtle details.** ORV11 People still tap transit cards that no longer work. ORV12 Sealed convenience-store lunches become comfort currency. ORV13 Survivors keep dead phones because the last messages are on them.

## Labyrinth of the Mad God (owner: private `full-book/labyrinth-mad-god-2/`)

Adds appeals against the System, needs set by class, maps that expire and
the watch roster as the thing that keeps running. The synthesis already
covers the tower contract, bog life and private secrets.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| LAB1 | **Appeals.** Default: when the god vetoes a reward, the System can offer a costly substitute, and the player can ask for one. Dial: how often appeals succeed. | The source shows contested reward authority. Working the gap between two rule-givers is a verb no other world has. |
| LAB2 | **Needs follow class.** Default: some classes lower food, water or sleep needs, so a class pick changes the daily chore list as well as combat. | A survivor class frees hours for scouting or cooking for others, which changes who the camp depends on. |
| LAB3 | **Maps expire.** Default: a labyrinth shift remaps routes; every map carries the shift it was drawn in, and a mapmaker sells current ones. | Knowledge with a date. A stale map walked in good faith is a believable way to lose a friend. |
| LAB4 | **The watch roster.** Default: companions cover your watch while you are busy or away and remember it; repeated gaps cost trust, repaid by taking their shifts. | Gives absence a social price that fits the camp, with no offline danger needed. |
| LAB5 | **Mundane loot has worth.** Default: scales, cores and plain utensils from the old world trade by local need, set per camp. (I) | A spoon can beat a sword in a camp with no cutlery. Pairs with CLI5. |
| LAB6 | **Presentation.** V6 tint swamp teal and wet stone. V7: current shift phase and the tower threshold percent. V8: flask cooldown as a thin edge. Panel only here: the appeal record. | Threshold numbers are public news, so they sit in the header. |

**Smallest playable taste.** LAB3: one map that expires on a shift and
one mapmaker who sells the new one. Small rule, strong feel, uses existing
locations.

- **Starting points.** LAB7 *Day one, sorted low:* a weak class and baseline, so the first arc is camp work and the tower is far off. LAB8 *After the tower opens:* arrive when the first threshold message has already changed conditions; the camp's politics are set and you are the newcomer.
- **Parallel versions.** LAB9 *Synchronized entry worked:* a branch where the camps coordinated their tower entries; danger outside is lower, but one faction controls the schedule. Crossed by the variant-world link; carries knowledge and soulbound items, not standing. LAB10 *A rerolled god's motive* (sealed; reached through LAB1 appeals that fail in an unexpected way; the world owner assigns the ID).
- **Subtle details.** LAB11 A healer keeps the reusable medicine on a string around her neck and counts it aloud. LAB12 Bog fish taste of the last thing they ate, which tells a forager where the herd went. LAB13 Old phones become mirrors and fire-starters once their batteries die.

## Solo Leveling (owner: private `full-book/solo-leveling/`)

Adds gig work under the gate economy, gate neighbors and the personal
daily quest. The dossier covers ranks, runestones, shadows and succession.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| SLV1 | **Gig raids.** Default: low-rank hunters take low-pay raids, porter jobs and fixed share splits through guilds and the association. (G for the guild economy) | The everyday life of a weak hunter is shift work with a death risk. Medical bills and rent drive the first choices. |
| SLV2 | **Gate neighbors.** Default: residents near a gate live with closure deadlines, drills and falling rents. (I) | Non-hunters get a daily link to the danger, and a gate break reprices a whole district. |
| SLV3 | **Rank as social standing.** Default: license rank sets jobs, loans and how strangers treat you; re-assessment is rare and changes all of it at once. (I) | A single public number with social reach makes re-awakening a life event, not just a stat bump. |
| SLV4 | **The daily quest.** Default: a compulsory personal exercise with a penalty for skipping; it counts days played. Dial: lived time counts real days. (G) | An idle-friendly daily habit that is unmistakably this world. |
| SLV5 | **Shadows at work.** Default: extracted shadows can take non-combat tasks in line with the roles they kept. (proposal) | Gives the army a life-sim use: guarding a sister's school run, carrying stock. |
| SLV6 | **Presentation.** V6 tint gate blue on charcoal. V7: nearest gate status and its deadline. V8: a penalty-quest edge. Sound: a short system chime on notices. | Recognizable at a glance, and the chime marks private messages as private. |

**Smallest playable taste.** SLV4: one daily quest with a mild penalty
area. Easy to build on existing activities, clearly this world.

- **Starting points.** SLV7 *A porter, never awakened:* civilian start inside a raid crew; you see the economy from below. SLV8 *Ten years before the gates* (I, from the rollback cup in our notes): a start where the gates are rumors and early preparation pays.
- **Parallel versions.** SLV9 *A world where the rollback was used:* the same city ten years earlier with one cohort remembering; crossed by the variant-world link, carries memory only. SLV10 *A guild-run Korea* where a private guild, not the association, controls gate licensing (AU); you notice through who issues your license.
- **Subtle details.** SLV11 Hunters tip porters in mana stones, not cash. SLV12 Raid crews knock on a gate's frame before entering, a superstition. SLV13 An E-rank's license photo is always a few years old because re-tests cost money.

## You Have Died Again (owner: private `full-book/you-have-died-again/`, its PROPOSALS O1 to O8)

Adds the delve town as a reset community, the patron's health and the cost
of cleansing failed branches. Proposals O1 to O8 already cover death
prices, detection, retained items and NPC lives.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| YHDA1 | **The delve town resets.** Default: the inn, guild and townsfolk reset each loop, with the end-of-world countdown as loop length. | A full, small town for CLL2. The innkeeper's bad knee is new to her every loop and familiar to you. |
| YHDA2 | **Personal level caps.** Default: each person has a cap, private or public by choice. | NPC careers have their own ceilings; a capped veteran teaching a high-cap youth is a story by itself. |
| YHDA3 | **The patron's health.** Default: failed branches worsen the time patron's condition, which narrows what the between-loop domain can offer. | A macro chain from your failures to your support. Losing slowly costs services, not just time. |
| YHDA4 | **Cleansing costs worlds.** Default: one victory clears the failed branches, which also deletes the variant worlds where related versions lived. Dial: whether any branch can be spared at a price. | A real late-game trade-off between healing a patron and keeping worlds you may have visited. Joins CLL4. |
| YHDA5 | **Marks as body terms.** Default: an enemy mark sits on a body part and can be removed with that part. | Sacrifice is a tactic with a lasting cost in later loops, if the soul keeps the wound. |
| YHDA6 | **Presentation.** V6 tint dungeon amber with clock silver. V7: the countdown, in large type near the end. V8: mark edge on the marked limb. | The clock is the world. |

**Smallest playable taste.** YHDA4 as the closing choice of a short loop.
Cheap text, real stakes, and it shows why branches matter.

- **Starting points.** YHDA7 *Inducted second:* start after a rival was inducted first, so someone already shapes the loop. YHDA8 *A local in the delve town:* a native who notices the loop from the outside through repeated odd days.
- **Parallel versions.** YHDA9 *A surviving failed branch:* a world where a related version of you lost; visitable before cleansing, carries key items as shared copies. YHDA10 *A branch where the hidden servant was never exposed* (divergent canon point; noticed through events that should have happened and did not).
- **Subtle details.** YHDA11 The guild clerk misspells your name the same way every loop. YHDA12 Bread in the town is always one day stale on the last day. YHDA13 A dog barks at loop-aware people and no one else. (proposal)

## Speedrunning the Multiverse (owner: private `full-book/speedrunning-multiverse/`, SMALL_TOUCHES T01 to T17)

Adds declared run rules, the aftermath of an abandoned run and the estate
as offline bank. The small-touch list covers the caretaker and estate
texture.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| SPM1 | **Declared run rules.** Default: the player can declare self-imposed run rules, and the estate keeps times by category. | A speedrunner's culture as an opt-in game, matching the source's stopwatch and records. |
| SPM2 | **Run aftermath.** Default: the body and life left behind end or continue by the realm's rule, and natives remember a person who vanished. | Absent worlds can move on in the story while their clocks freeze. Returning to a realm finds a legend about you. |
| SPM3 | **Fit per art.** Default: each known art has a fit value with the current body; you choose what to relearn first. | Makes "knowledge carries, execution doesn't" a weekly decision instead of a flat penalty. |
| SPM4 | **Estate as offline bank.** Default: the estate collects and banks time while you are away, then lets you spend it to speed up a run. | Gives the idle loop a home that fits the fiction. |
| SPM5 | **Realm rank order.** Default: higher realms read lower-realm methods as weaker, and the reverse can be dangerous to the body. (I) | A route-finding problem across realms. |
| SPM6 | **Presentation.** V6: parchment for the estate, each realm's own tint during a run. V7: run timer beside the local calendar. V8: a body-fit edge when using a poorly fitting art. | Clear split between home and run. |

**Smallest playable taste.** SPM3: one art, two bodies, different fit, one
choice. Uses the existing skill list.

- **Starting points.** SPM7 *The caretaker's view:* start as the estate's caretaker who waits between runs and handles news. SPM8 *Mid-run in a desert body:* the worst body with a hidden graveyard opportunity nearby.
- **Parallel versions.** SPM9 *A rerolled body table* (sealed; you notice when a familiar realm hands out a body type never seen there). SPM10 *A realm where your last run succeeded:* its natives treat you as a returning hero; carries soul-bound cores only.
- **Subtle details.** SPM11 The caretaker sets a place at the table on the expected return day. SPM12 The estate clocks show different realm times on one wall. SPM13 A modified technique keeps its grand old name, and old friends laugh at it.

## Bay City (Worm) (owners: `WORLD_CARDS.md` §7, north star "What Worm actually does")

Adds civilian life under capes, territory as rent and the logistics of a
mask. The north star covers triggers, ratings, the truce and small touches.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| WRM1 | **Civilian life under capes.** Default: shelters, insurance riders, school closures and repair contracts follow every big fight. (G for shelters) | A repair contractor or insurance adjuster career grows out of fights the player never joins. |
| WRM2 | **Territory as rent.** Default: protection payments, street rules and services change when a gang loses ground. | Daily prices track the street map, so a rival's fall changes your rent. |
| WRM3 | **Mask logistics.** Default: costume upkeep, alibis and schedule clashes between school or work and patrol are tracked chores. | The secret identity is a household problem before it is a plot twist. |
| WRM4 | **Thinker budget.** Default: thinker questions per day are limited by pain and recovery food. | A daily resource for precogs and analysts that rewards asking well. |
| WRM5 | **Other-Earth arbitrage.** Default: goods common on one Earth sell high on another through door owners. (I) | A trade path with a gatekeeper who can close it. |
| WRM6 | **Presentation.** V6 tint rainy bay grey teal. V7: threat level and disaster alerts. V8: a thinker-headache edge. | Matches the source's grim city mood. |

**Smallest playable taste.** WRM1: one repair job after a fight, using
existing crafting, with the cost billed to someone.

- **Starting points.** WRM7 *A rookie on a junior team:* start inside the hero agency's youth program with curfews and press. WRM8 *Shelter volunteer during a disaster:* no power, a full day of chaos, real choices.
- **Parallel versions.** WRM9 *An Earth with no powers:* reached by a door; your power reads as unknown and locals fear it; carries the power only if its source reaches. WRM10 *A rerolled source of powers* (sealed; noticed through a trigger that looks wrong to an expert).
- **Subtle details.** WRM11 Locals give directions by fight damage ("left at the crater"). WRM12 Hero merch is cheaper the week after a loss. WRM13 Grocery shelves empty before a disaster warning reaches the radio.

## Salvage Reach (Legendary Mechanic) (owners: `WORLD_CARDS.md` §8, parallel-book-design LM report)

Adds players as economic weather, guide markets, disposable labor and the
household power budget.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| LGM1 | **Player floods.** Default: each version launch brings crowds of respawning players who crash raw-material prices and over-hunt. | The native workshop opening lives with these demand spikes; timing sales around a launch is a skill. |
| LGM2 | **Guide markets.** Default: players share guides natives can't access; a former player can sell what he knows. | Knowledge trade with a social cost, and the knowledge goes stale each version. |
| LGM3 | **Disposable labor.** Default: natives hire players for risky work because they respawn; the ethics are argued in town. | Social texture from a game rule; the player can stand on either side. |
| LGM4 | **Household power budget.** Default: home machines share a daily power budget, and charging overnight is a chore. | Turns "no free energy" into a routine and gives idle play a natural cap. |
| LGM5 | **Presentation.** V6 tint gunmetal with HUD green. V7: version number and a galactic news ticker. V8: armor integrity edge. | Feels like a game world on purpose. |

**Smallest playable taste.** LGM4: one workshop, one power budget, one
overnight charge, one tool that does not get used because of it.

- **Starting points.** LGM6 *The week before the first players:* natives only, unaware of what arrives. LGM7 *A respawning player:* a body that returns, with the death allowance as the life clock.
- **Parallel versions.** LGM8 *A later version era:* same planet after several updates with raised caps and different factions; carries knowledge that may be wrong. LGM9 *A server where players never came* (changed premise; noticed by the empty newbie zones).
- **Subtle details.** LGM10 Natives call players by their odd name tags. LGM11 A repair shop keeps a jar of fried chips from EMP mishaps. LGM12 Prices are posted in two units: credits and favors.

## The Red Basin (Kenshi) (owners: `WORLD_CARDS.md` §9, `docs/research/kenshi/`)

Adds weather that hurts, hauling, bounty hunters, the offline settlement
question and the basin as a limb clinic for other worlds.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| KEN1 | **Weather that hurts.** Default: acid haze and dust storms damage skin and parts; routes change with weather. (G) | Ties the body-as-infrastructure law to the map and gives the V7 header real weight. |
| KEN2 | **Hauling.** Default: carry weight, packs and carrying a wounded friend shape trade and rescue. (G) | Ordinary strength matters; a hauler career grows Weightlifting and Running in line with vanilla. |
| KEN3 | **Bounty hunters.** Default: a bounty becomes named hunters with routes and habits; paying it off at an office is possible. (G) | Turns a status into people who can be bribed, hidden from or befriended. |
| KEN4 | **Settlement while away.** Default: stockpile use pauses with the world. Dial: a "lived basin" mode lets raids and shortages happen while closed. | Fills the world card's open offline question with a default and a dial. |
| KEN5 | **Limb clinic for travelers.** Default: travelers who lost limbs in worlds without regrowth can be fitted here. | A cross-world reason for a strong character to keep returning. |
| KEN6 | **Presentation.** V6 tint rust ochre. V7: wind, dust and haze. V8: per-limb damage edges that read by function. | Damage reads by body part, as the card's display asks. |

**Smallest playable taste.** KEN5: one prosthetic fitting for a traveler
from another world. Links worlds and uses existing equipment slots.

- **Starting points.** KEN7 *Escaped captive:* no money, malnourished squad, an ex-captive status. KEN8 *A well-house clerk's child:* comfortable start with debts owed to you rather than by you.
- **Parallel versions.** KEN9 *A basin where the faith march won:* mechanical bodies are banned; your arm is contraband. Carries body parts with legal risk. KEN10 *Rain returns:* the industrial sea refills (changed premise); trade routes are boats.
- **Subtle details.** KEN11 Guards lean on their weapons in the shade at noon. KEN12 Robot workers hum while their joints cool. KEN13 A tavern sign is a rusted gear painted red.

## Kairos and War of the Pantheon (U) (owner: private `novel-wave-2026-10-08/books/`)

Adds the ship as a town, the myth calendar, the waiting time between
quests and the dead crew. Notes cover Observe rank caps, ships, feathers
and titles.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| KAI1 | **The ship as town.** Default: crew, decks, wages, rations and quarrels make the ship a home that grows. | Daily life at sea; tributary ships turn a household into a fleet. |
| KAI2 | **Myth calendar.** Default: festivals, offerings and oaths shift the favor of particular gods by season. (I) | A schedule set by gods that NPCs and rivals also follow. |
| KAI3 | **The wait between quests.** Default: while the Fates' one quest is pending, ordinary life fills the days. | Idle-friendly pacing: no new quest pile-up, real downtime. |
| KAI4 | **Dead heroes on deck.** Default: heroic spirits aboard have wants, old grudges and favorite songs. | Succession and company in one; a crew of ancestors. |
| KAI5 | **Monster neighbors.** Default: monsters drawn to the home make taming and neighborliness an economy and a danger. | A source cheat turned into home life. |
| KAI6 | **Presentation.** V6 tint Aegean blue and bronze. V7: sea state and omens. V8: curse edges. | Mythic tone without heavy UI. |

**Smallest playable taste.** KAI1: one deck, one crew member, one wage
day. Uses existing people records.

- **Starting points.** KAI7 *A dockside fisher in a port the ship visits:* start outside the hero's story. KAI8 *A heroic spirit:* start dead, aboard, with limited reach.
- **Parallel versions.** KAI9 *A pantheon from another myth:* same structure, different gods (AU); carries titles, not favor. KAI10 *A rerolled Fate* (sealed; noticed when a quest arrives out of order).
- **Subtle details.** KAI11 Sailors pour a drop of wine overboard before meals. KAI12 The ship creaks louder near monster remains. KAI13 A spirit refuses to eat but still asks for a seat.

## Warlock of the Magus World (U) (owner: private `warlock/world-design-2026-10-11/`)

Adds the funding loop, long seclusion against short lives, and samples as
the chip's diet. Routes WD-S01 to WD-S04 stay specified and sealed.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| WMW1 | **Funding loop.** Default: tuition, grants and potion sales fund research; specimen procurement is a career whose legality depends on the region. | Research costs money; a cheap ingredient substitute (substitution with loss) changes household budgets. |
| WMW2 | **Long seclusion.** Default: higher ranks extend life; acolyte friends age while you are secluded. | CLC2 in a magus setting: return to an academy where your peers are elders. |
| WMW3 | **Samples as inventory.** Default: the chip needs samples; collecting and storing them is a daily activity. | The cheat's diet becomes play, with spoilage and theft. |
| WMW4 | **Rank and coast politics.** Default: wizard organizations hold coasts and markets with rank-gated entry. (I) | Access is social, not only power. |
| WMW5 | **Presentation.** V6 tint alchemical green on black. V7: chip scan status. V8: energy backlash edges. Log: terse chip lines in a separate voice. | The chip has its own voice in the log. |

**Smallest playable taste.** WMW3: one sample, one chip scan, one result
that predicts but does not guarantee.

- **Starting points.** WMW6 *An acolyte without a chip:* the same academy without the cheat. WMW7 *A merchant's apprentice selling to wizards:* ordinary life on the market side.
- **Parallel versions.** WMW8 *The merged world after the finale:* two worlds fused; cards mix. WMW9 *A world will that never suppressed outsiders* (changed premise; noticed by easy early magic).
- **Subtle details.** WMW10 Apprentices wear gloves stained by their master's favorite reagent. WMW11 Old wizards forget which century it is. WMW12 Market stalls price reagents by freshness hour.

## Second Coming of Gluttony (U) (owner: north star "Gluttony's golden fingers")

Adds the double life, vice and debt, and Paradise as a society.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| SCG1 | **Double life.** Default: an Earth job or school sits beside Paradise; the 3:1 clock means missed Earth time after each stay. | Family notices absences; Earth obligations become a schedule. |
| SCG2 | **Vice and debt.** Default: gambling dens and debt are daily temptations with real social costs. (G) | A risk economy that fits the hero's past without moralizing. |
| SCG3 | **Paradise politics.** Default: contribution exams and faction ranks gate access. | Paradise is a society, not only a dungeon. |
| SCG4 | **The Earth ability rule.** Dial: whether Earth strips abilities from returnees, since the book contradicts itself. | Keeps the source's conflict open as a choice. |
| SCG5 | **Presentation.** V6: warm white gold in Paradise, grey on Earth. V7: Nine Eyes color glimpse. V8: headache edge after long use. | Shows the cheat's cost. |

**Smallest playable taste.** SCG1: one Earth shift missed after a trial,
with a boss who remembers.

- **Starting points.** SCG6 *A Bronze mark with no talent:* starting below the hero's grade. SCG7 *A returnee who lost everything on Earth:* debts waiting.
- **Parallel versions.** SCG8 *A Paradise that never opened to Earth* (changed premise; noticed by the absence of invitations). SCG9 *A rerolled final enemy* (sealed).
- **Subtle details.** SCG10 Returnees check their phones' dates first. SCG11 Veterans eat slowly, as if counting essences. SCG12 Mark grades show on clothes by habit.

## Genetic Ascension (owner: private `novel-wave-2026-10-09/genetic/`, Shatterreach card)

Adds the frozen-Earth double life, the gene-window calendar, civic life
around the Stele, and hide trade.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| GEN1 | **Frozen Earth.** Default: Earth waits during the Trial, so returns find nothing changed except you. | A clean double life without missed shifts. |
| GEN2 | **Gene State weeks.** Default: life is scheduled around week-long gene windows with seizure risk and a caretaker. | Biology sets the calendar; a caretaker is a real relationship. |
| GEN3 | **City Stele government.** Default: Stele meetings and public rankings are civic life. | Public status in the open, readable by rivals. |
| GEN4 | **Skins and meat.** Default: hunter and tanner chains trade beast hides by quality. | An ordinary economy under the gene system. |
| GEN5 | **Presentation.** V6 tint bio cyan. V7: Aether density and convergence countdown. V8: gene strain edge. | Genetic identity. |

**Smallest playable taste.** GEN2: one gene window with a caretaker.

- **Starting points.** GEN6 *A city laborer:* no gene ambitions. GEN7 *Arriving after convergence:* the city is already built.
- **Parallel versions.** GEN8 *A world where genes cross freely* (changed premise). GEN9 *Rerolled lineage genes* (sealed).
- **Subtle details.** GEN10 People compare gene grades like star signs. GEN11 Tanners smell of Aether. GEN12 The Stele hums before a meeting.

## Wish Upon the Stars (owner: private `novel-wave-2026-10-09/wish-stars/`, Concord of Waymarks card)

Adds the cost of anonymity, wish wording as a craft and memory prices felt
by others. The card covers renown through institutions and the price law.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| WUS1 | **Anonymous deeds.** Default: a deed nobody reports earns no renown but draws no enemies; a local paper or school decides what becomes known. | A real trade-off between growth and safety, owned by named institutions rather than a fame bar. |
| WUS2 | **Wish wording as craft.** Default: a wish is drafted, priced against the giver's ability and negotiated; a counselor NPC can improve wording for a fee. | The world's verb. A bad draft costs more or delivers less, which rewards care instead of luck. |
| WUS3 | **Memory prices are felt by others.** Default: when a memory is paid, the people in it notice the gap before the payer does. | A friend greeted as a stranger is the cost; the relationship record changes, not only a stat. |
| WUS4 | **A faction that outlasts you.** Default: a candidate's faction has a named successor slot and charter; without one, it splits on the candidate's fall. | Ties succession to politics, and gives "same player, related character" a faction to inherit. |
| WUS5 | **District law.** Default: districts differ in policing and permitted conflict, so the same act is a crime in one and sport in another. (I, from the open G-district conflict) | Location choice changes which deeds are safe to do in public. |
| WUS6 | **Presentation.** V6 tint night indigo with star gold. V7: star visibility and festival nights. V8: a faint memory-gap edge on the people panel after a memory price. | The cost shows where relationships live. |

**Smallest playable taste.** WUS2: one wish drafted, priced and accepted
or refused, with a visible price. It is the world's identity in one
scene.

- **Starting points.** WUS7 *A citizen who never becomes a candidate:* work, school and gossip about candidates. WUS8 *A rival candidate's aide:* you see the other faction's books from inside.
- **Parallel versions.** WUS9 *A capital where wishes are rationed* by a civic office (changed premise; noticed through queue tickets); carries skill and memory, not standing. WUS10 *A rerolled star law* (sealed; reached when a wish's price differs from every recorded case).
- **Subtle details.** WUS11 Counselors charge by the word, so rich clients speak in long sentences. WUS12 Old residents touch a pocket star charm before signing anything.

## You Are Summoned (owner: private `novel-wave-2026-10-09/summoned/`, Lantern Compact card)

Adds interrupted home life, lease liability and companions with their own
consent. The series report covers class breakpoints and the Earth arc.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| YAS1 | **Summoned mid-shift.** Default: a summons interrupts whatever the character was doing at home; the employer and family record the absence. | Missed shifts and unexplained absences turn into a reputation at home. |
| YAS2 | **Lease terms with liability.** Default: a personal space can host guests under a lease, and a guest's harm makes the host liable. | Housing is a contract with real risk, so who you let in matters. |
| YAS3 | **Companions with wills.** Default: summoned foes have morale and a consent level that can drift with treatment. | The roster is people, so command style shapes outcomes over many assignments. |
| YAS4 | **Rules harden as you rise.** Default: a class step can remove automatic return or reconstruction. | Late game becomes riskier by design, a reason to plan the step. |
| YAS5 | **Delegated command.** Default: local commanders can borrow your summons under stated terms. | A military-cooperation career with visible exit terms. |
| YAS6 | **Presentation.** V6 tint lantern amber. V7: current assignment and return phase. V8: a roster mana edge when upkeep runs low. | The summoner's budget is the world's pulse. |

**Smallest playable taste.** YAS1: one interrupted shift and the boss's
reaction on return. Uses existing jobs and people.

- **Starting points.** YAS7 *A local host:* a resident who rents rooms to summoned specialists. YAS8 *A summoned medic:* a support assignment that turns lethal.
- **Parallel versions.** YAS9 *A summoning network run for profit* (changed premise; noticed through invoices after each assignment). YAS10 *A rerolled sponsor behind the system* (sealed).
- **Subtle details.** YAS11 The waystation keeps a guest book with hand-drawn faces. YAS12 Summoned arrive with dust from their last world on their boots.

## Er Gen worlds (owner: `docs/gm/dispatch/er-gen-haul-2026-10-09/`, private dossiers)

Adds the cosmos link between books, clones as residents and the fog-camp
mortal layer. The haul findings cover insight from lived work, the
three-silver debt and restoration chains.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| EG1 | **One cosmos, many eras.** Default: the books are time-separated worlds in one cosmos, so a character can meet a later book's era as someone's ancestor. (G) | Natural multi-world links without a portal invention. |
| EG2 | **Clones with lives.** Default: clones keep their own friends, jobs and preferences. Dial: they act on their own while you are away. | Avatars become people, and a clone's choice can embarrass you in town. |
| EG3 | **Fog camps.** Default: a scavenger-camp start lives with toxic fog, mutagen and rationed shelter. (G for Beyond the Timescape's opening) | A harsh mortal layer that makes the first breakthrough feel like escape. |
| EG4 | **Tone per book.** Default: each book sets stance and event decks: greed and haggling, grim survival, comic caution, cold scavenging. | One engine, distinct feel; cautious play pays in the comic book. |
| EG5 | **Presentation.** V6 per book: mirror bronze, blood red, wok green, fog purple. V7: sect bell schedule. V8: realm strain. | The frame names the book. |

**Smallest playable taste.** EG2: one clone with a job and one
disagreement. Tests CLH-style identity without a full sect.

- **Starting points.** EG6 *An outer disciple fetching water:* the sect from the bottom. EG7 *A mortal villager in a later era:* the cosmos seen from someone with no cultivation.
- **Parallel versions.** EG8 *A cosmos where the main sect never rose* (divergent canon point; noticed by missing landmarks). EG9 *A rerolled heaven's will* (sealed).
- **Subtle details.** EG10 Disciples bow a little deeper to anyone carrying a pill gourd. EG11 Pill smoke lingers in robes for days, so people can guess your craft.

## The Perfect Run (owner: `docs/gm/dispatch/parallel-book-design-2026-10-11/perfect-run/`)

Adds life beside someone else's save-point. Routes PR-S1 and PR-S2 stay
specified and sealed.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| PR1 | **Living beside a saver.** Default: when a native reloads, the player's day resets too, without memory. Dial: the player keeps memory as an outlier. | A loop you do not control, the reverse of every other loop world. |
| PR2 | **Faction city.** Default: corporate and organized-crime factions run districts, jobs and police. (G) | Urban daily life with clear employers and enemies. |
| PR3 | **Powers by elixir.** Default: elixir families set power types, and bought elixirs have risks. (G) | Acquisition has a market and a black market. |
| PR4 | **Civilian route.** Default: a civilian career reaches its own closure without powers, as the design report proposes. | Keeps the life-sim promise inside a power world. |
| PR5 | **Presentation.** V6 tint Mediterranean noon with neon. V7: city alert level. V8: a save glyph, shown only once the character knows a saver exists. | Bright tone; the glyph is earned knowledge. |

**Smallest playable taste.** PR1: one day reset by someone else, shown
only through small inconsistencies.

- **Starting points.** PR6 *A civilian shop owner on a busy street.* PR7 *A new faction recruit on day one.*
- **Parallel versions.** PR8 *A bad-run branch* modeled on the companion what-if anthology, kept separate from main history. PR9 *A rerolled save holder* (sealed).
- **Subtle details.** PR10 Locals shrug off déjà vu as weather. PR11 A café sets out the same pastries in the same order on a reset day.

## Cradle (owner: `docs/worlds/novel-worlds/CANDIDATES.md`)

Author synopsis only in our notes; rows lean on general knowledge (G).

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| CRD1 | **Small valley, big world.** Default: a closed valley with its own ranks, then a larger world that rereads them as tiny. (G) | Gives one world two scales and a humbling move between them. |
| CRD2 | **Aura shapes paths.** Default: where and on what you train sets the aspect of your path. (G) | Place matters for growth, so travel is a build decision. |
| CRD3 | **Remnants.** Default: the dead can leave remnants that are hazards and resources. (G) | Death leaves material, consistent with the succession patterns. |
| CRD4 | **Soul oaths.** Default: breaking an oath harms the core and channels. | Contracts become body risks, so promises are serious. |
| CRD5 | **Presentation.** V6 tint jade. V7: aura density and its aspect. V8: core strain edge. | Clean, focused look. |

**Smallest playable taste.** CRD2: one training site that shapes a path
differently from another.

- **Starting points.** CRD6 *A child judged without talent* in the valley. CRD7 *An outside world laborer* who never meets the valley.
- **Parallel versions.** CRD8 *A valley that was never closed* (changed premise). CRD9 *A rerolled great threat* (sealed).
- **Subtle details.** CRD10 Valley elders measure children by the color of their breath in cold air. (proposal) CRD11 Traders from outside laugh at valley ranks politely.

## Traveler's Gate (owner: `docs/worlds/novel-worlds/CANDIDATES.md`)

Author synopsis only; rows lean on general knowledge (G).

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| TG1 | **A realm as second home.** Default: a bound realm gives power and danger; time spent there is training. (G) | Power lives in a place you visit, not in your body. |
| TG2 | **Gate houses.** Default: noble houses control realm access and teaching. (G) | Travel is politics; access costs service. |
| TG3 | **The realm changes you.** Default: long contact shifts habits and temperament. (G) | An identity cost that friends notice. |
| TG4 | **Ordinary town.** Default: non-Travelers farm, trade and fear Travelers. | The life-sim base the power sits on. |
| TG5 | **Presentation.** V6 per realm. V7: realm pull while near a gate. V8: influence edge. | Each realm reads as its own place. |

**Smallest playable taste.** TG1: one realm visit with one useful find and
one risk.

- **Starting points.** TG6 *A farm child in a gate town.* TG7 *A servant in a gate house.*
- **Parallel versions.** TG8 *Realms open to anyone* (changed premise). TG9 *A rerolled realm* (sealed).
- **Subtle details.** TG10 Travelers carry a faint smell of their realm. TG11 Gate keys are worn on cords and touched before speaking to nobles.

## The Wandering Inn (owner: `docs/worlds/novel-worlds/CANDIDATES.md`, wiki digest)

Uses the wiki digest's revision-reviewed rules W01 to W13.

| Code | Consideration | Why it matters / micro-to-macro chain |
|---|---|---|
| WI1 | **Levels at sleep.** Default: class notices arrive when a character sleeps, and a level can take effect earlier. | Closing the game at night can bring level-ups on wake; sleep becomes a progression moment. |
| WI2 | **A many-species menu.** Default: guests have diets, customs and allergies; menu planning is the inn's daily craft. | Hospitality is a real career with consequences for who comes back. |
| WI3 | **Consolidation routing.** Default: a merged class states which activities earn its growth. | Clear rules for a classic system, avoiding surprise nerfs. |
| WI4 | **Execution first.** Default: a method done unaided can later be recognized as a Skill without a level. | Practice is rewarded before the system notices. |
| WI5 | **Banked mischief and vows.** Default: some Skills bank completed pranks or kept vows as stored currency. | Odd, cheerful growth routes beside combat. |
| WI6 | **Presentation.** V6 tint hearth amber. V7: season and snow. V8: a hidden condition revealed only after it is cured. | Cozy tone with one quiet surprise. |

**Smallest playable taste.** WI1: one level notice at sleep after a day
of inn work.

- **Starting points.** WI7 *A local server at a rival inn.* WI8 *A traveling merchant who stops each season.*
- **Parallel versions.** WI9 *A continent without classes* (changed premise). WI10 *A rerolled system rule* (sealed).
- **Subtle details.** WI11 Guests leave boots drying by the fire in a row by size. WI12 Regulars have a favorite seat and grumble when it is taken.
