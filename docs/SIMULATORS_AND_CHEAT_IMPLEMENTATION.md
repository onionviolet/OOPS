# Simulators and cheat implementation

*Status: considerations and proposals, not accepted. Written 2026-10-10 by
Claude Code at Weibao's request: "consider implementation of cheats, like
for simulators, how things can even be simulated and more? would it just be
a mini playthrough with some key decisions and more?" Builds on the
[fan fiction pilot](research/fanfic/REPORT.md) (F22 simulators, F13
Celestial Forge, F14 trait entries, F21 hubs), the
[cheat library](CHEAT_LIBRARY.md#implementation-proposal-from-reading-the-code-on-2026-10-10)
and [selves and echoes](SELVES_AND_ECHOES.md#how-to-generate-them-without-simulating-everything).
Like the other idea docs, this is a palette: pick what makes sense for a
world and a character at that time.*

## Short answer

Yes, one good form is a **mini playthrough with a few key decisions**: a
compressed run where most of life resolves on its own and you choose only
at the forks that matter. It is not the only form. A simulator can also run
with no decisions (follow your standing intent), run many times to show the
odds, test one choice against another, forecast what the world does if you
do nothing, or rehearse one fight. Which forms a cheat offers, how accurate
it is and what it costs are that cheat's and that world's adjectives.

## What the code allows (read on 2026-10-10, not run)

- **The living-world layer can be forked.** Commands in
  `src/simulation.js` plan on a deep copy (`plan(state, context)` copies
  state, then commits). Randomness there is a seeded xorshift stream saved
  in the state (`draw`, `hash`), and `advanceSimulationBoundary` steps jobs,
  conditions, events and lifespans on the common clock. A simulator can
  copy that state, give the copy its own seed, advance it, read the result
  and throw it away. The real save never changes.
- **A fast-forward with decision stops already exists.**
  `advanceSimulation(state, registry, minutes, ...)` in
  `src/expansion_engine.js:582` clones the state, steps it boundary by
  boundary, and stops early when the player dies or a blocking choice is
  waiting (`stoppedAtChoice`), returning the unspent time. A dream run is
  close to calling it on a copy in a loop: stop at a choice, show a
  decision card (or let the standing intent answer), continue. Caveat: a
  few helpers inside it also receive the original `state`, so purity must
  be proven with a state-hash test before relying on it.
- **Checkpoints and rewinds exist.** `previewScenarioRewind` and
  `rewindScenario` (`src/expansion_engine.js:661`) restore a scenario
  snapshot and list what is retained (campaign, journey, actors, worlds,
  random stream, receipts). That is the base for loop cheats and their
  carry dials.
- **Previews already exist.** Many hosts export pure preview functions
  (`previewCausalStoryCommand`, `previewMolCommand`, `previewBacklogAction`,
  `previewCarrierTransit`), and the expansion engine's preview/query is
  pure (see [RNG audit](RNG_ENCOUNTERS_AND_SOURCE_DEVELOPMENT.md)).
- **Native vanilla systems cannot be replayed.** Combat, crafting, shop
  refresh and gathering use `Math.random`, DOM timers and direct mutation.
  They can only be **estimated**. One exception helps: `combat_math.js`
  takes an injected random function (`rollBaseCombatDamage(..., random)`),
  so combat rehearsals can run on a seeded stream without touching live
  combat.

So there are three engines a simulator can use, from cheapest to most
faithful.

## Three simulation engines

| Engine | How it works | Good for | Limits |
|---|---|---|---|
| **S1 Story model** | A coarse life model: phases (a season, a year), each resolved from your stats, skills, people, the world's natural course and its event deck, using weighted outcomes | Whole lives, long horizons, other worlds you have not built in detail | A model, not the game; results are bands and narrative |
| **S2 Forked engine** | Copy the real living-world state, seed the copy, advance it boundary by boundary under a policy, read the report, discard | Near-term futures in built worlds (hours to days): jobs, events, people, pursuits, causal stories | Only covers content on the deterministic layer. Measured cost (audit D): about 0.8 s per 512 game minutes for an idle enrolled save, 33 s with 64 helpers, on the main thread. A year would take minutes of CPU, so long horizons need S1, a coarser clock, skipping idle controllers, or a worker |
| **S3 Estimates** | Expected values and distributions from native math: hit chance, damage, craft quality spreads, gathering yields | Fights, crafts, harvests | No branching story; native randomness still decides the real result |

A good simulator can mix them: S2 for the next day or two at home, S1 for
the months and years after, S3 for the fight in week two.

## Simulation modes (palette)

| Mode | What you do | What you get |
|---|---|---|
| **Dream run** | Play a compressed life: 3 to 7 decision cards at the biggest forks, everything else auto-resolves | A story log, the outcome, and one thing to keep |
| **Headless run** | Set standing intent ("accept apprenticeships, avoid the mine"); no stops | A log and outcome while you idle or are offline |
| **Spread** | Run the same start many times on different seeds | Odds: "dead before 30 in 4 of 10 dreams" |
| **Probe** | Fork at one decision, run both branches a short way | Side-by-side results of A versus B |
| **Forecast** | Simulate the world with you passive | What the natural course does next (deaths, wars, openings) |
| **Rehearsal** | One fight or craft, repeated on a seeded stream | Win rate, a combat log, an observation of a technique |
| **Shadow** | Run a generated self ([selves and echoes](SELVES_AND_ECHOES.md)) | A demonstration or an opponent |

## How a dream run could work, step by step

1. **Pick a start and horizon.** Your current life now, a slot you could
   take (a doomed noble, a village medic), or a whole life from birth; for
   a season, a year or a lifetime.
2. **Build the beat list.** Beats come from what the world already has: its
   natural-course timeline, the slot's scripted fate, the event deck,
   jobs, people's plans, aging. Each beat has outcome weights driven by your
   real stats and skills (S1), or it is played on the fork (S2).
3. **Choose which beats become decisions.** The simulator stops only where
   choices change the outcome most: a branch whose outcomes differ a lot
   and that your stats do not settle. Everything else follows your
   standing intent. More stops is a higher grade or a slower dream.
4. **Compress time.** Each beat is one line of log; a decision is one card
   with two to four options and the visible cost of each.
5. **Report.** Outcome, key turning points, cause of death if any, people
   met, what went better or worse than expected, and how confident the
   reading is.
6. **Keep something.** See "what you keep" below.
7. **Discard the fork.** The real save only records the charge spent, the
   report (trimmed) and the reward taken.

## Honesty: what a simulation knows

Rule 6 applies: a simulation is a reading, and readings can be wrong.

- **It knows what you know** by default. Sealed secrets you have not
  discovered are not in the model, so the dream can be confidently wrong
  about exactly the things that matter. A higher-grade simulator may model
  some unknowns; if it does, it can become a discovery route, but its
  output must not print a sealed truth outright (it can show "something
  unexplained killed you here").
- **Other cheats blur it.** Rivals with their own cheats, outliers (rule
  12) and divine interference appear as noise or as blank spots.
- **Confidence is shown.** Each report states how sure it is, and why.
- **The real run differs.** The dream uses its own seed. A stronger
  version can **lock** the seed so the real run follows the dream until you
  deviate, which turns a simulator into a short prophecy. Deviating breaks
  the lock and the report marks where.

## Telling the future (2026-10-10)

Weibao: "Shouldn't simulations (depending on the type) be able to tell the
future? like it is predicting how things would happen if keep going down
that path." Yes. Some types simulate a guess; some read the actual future.
Everything below is a proposal.

### Why this engine can really predict

The living-world layer is deterministic: the same state, the same seed and
the same choices produce the same future (`advanceSimulation` clones state
and draws from saved seeded streams). So a simulator that runs your
current path on the **real** seed computes what will actually happen, as
long as three things hold:

1. You keep doing what the prediction assumed.
2. Nothing outside the model acts: vanilla combat, crafting, shops and
   gathering still use unseeded randomness, so they are fog until the
   [RNG audit](RNG_ENCOUNTERS_AND_SOURCE_DEVELOPMENT.md)'s separate seeded
   streams exist. In fiction: "the battlefield is fog".
3. No one with their own cheat, no outlier (rule 12) and no god steps in.

That is enough for true prophecy inside the model, and gives natural,
explainable limits outside it. Rule 6 still holds: no grade certifies
itself. Concealment, outliers, other cheats, a lying patron or a flaw in
the reader can make even the highest grade wrong, and the player learns
how far to trust a seer from evidence, not from its label.

### Grades of foresight (palette)

| Grade | Knows | Seed | What it tells you |
|---|---|---|---|
| **Guess** | What you know | Fresh | A plausible future; can be wrong in shape |
| **Forecast** | What you know | Many fresh | Odds over many futures ("4 of 10 end in debt") |
| **Projection** | What you know | Real | The likely actual future of your path, except where unknown truths or outside forces matter; those show as fog; wrong wherever what you know is wrong |
| **True sight** | The truth, as far as the reader can see it | Real | The actual future as far as its reach goes, including things you have not discovered; shown at your discovery stage (you see the event, not always its cause); can still be fooled by concealment, outliers or stronger cheats |
| **Prophecy** | Fated events only | Any | Fixed points that happen on any path unless enough is disturbed |
| **Vision** | Fragments | Real | Glimpses: a face, a place, a date, a feeling; partial by design |
| **Counterfactual** | What you know | Real | What would have happened if you had chosen differently in the past |

"If I keep going down this path" is a **projection** or **true sight** run
on your standing intent and current commitments. A cheaper everyday form
fits ordinary skill too: an activity preview line, "a year of this:
Mentor rank, about 900 coins, the knee gives out", read from the same
fork with low detail.

### What happens once you know

- **Knowing changes it.** Acting on a prediction changes the inputs, so
  the future recomputes. The report marks the first point where reality
  left the prediction.
- **Some futures resist.** Under the natural-course rule, fated events
  pull back unless sufficiently disturbed; a prophecy grade shows how hard
  each fixed point resists (the world's dial).
- **Self-fulfilling and self-defeating.** Telling a person their predicted
  fate can make them cause it or avoid it; their reaction is part of the
  model only at higher grades.
- **Horizon fog.** Detail and confidence drop with distance; branching
  people and outside forces thicken the fog. A projection is sharp for a
  season and vague for a decade.
- **Time law per world.** In a world where changing the past branches,
  a counterfactual shows a sibling timeline; in one that overwrites, it is
  a warning about the only timeline (see the comics
  [time-law consideration](research/comics/PLAYTHROUGH_TARGETS.md#more-to-consider)).

### Foresight and sealed secrets

Sealing (AGENTS.md) is about agents not telling Weibao outside play. In
play, true sight is a legitimate discovery route. Its text still follows
the discovery stages: seeing the teacher die at midnight is "sensed" or
"suspected", not the full truth of why, until evidence makes it "known".

### Implementation notes (proposal)

- **Seeds decide the grade.** Audit D measured that reseeding only
  `state.rng` changes nothing: a fork must also reseed `simulation.seed`
  and every `simulation.checks[*].rng` to get a different future.
  Guess and forecast grades reseed all of them; projection and true sight
  keep the real ones, which is exactly why they can foresee.
- **Real-seed fork.** Copy the state with its saved streams, apply the
  standing intent as the policy, advance to the horizon, record the beats.
  Discard the copy. Only the report and a stamp of the seed and state
  version it was computed from are saved, so a stale prediction is
  detectable.
- **Fated events as data.** World timeline events can carry a fate
  strength and a disturbance threshold, which prophecy reads and the
  natural-course rule uses.
- **Divergence tracking.** After a prediction, each committed command
  compares against the predicted beat; the first mismatch is logged as
  "the future changed here".
- **Fog regions.** Anything driven by unseeded native randomness, by
  unknown truths (below true sight) or by other cheaters is reported as a
  range or a blank, never as a confident fact.
- **Tests.** A projection on the real seed must match a real advance of
  the same duration and policy exactly (inside the deterministic layer);
  a changed choice must produce a logged divergence; knowledge filtering
  must hold for every grade below true sight.

### More to consider (foresight)

- **Prediction as a good.** Seers sell readings; a reading's accuracy
  depends on the seer's grade and honesty.
- **Lying oracles.** A patron or system can show a false future on
  purpose (patron terms); rule 6 again.
- **Rivals foresee you.** A rival with projection plans around your
  standing intent; changing intent is how to surprise them.
- **Death dates.** A predicted death can pass to heirs as a family
  prophecy, true or not.
- **Timeline view.** A strip in an existing panel showing predicted beats,
  fixed points and where fog begins.
- **Butterfly meter.** How far the real world has moved from the
  predicted or canon path; ties into fate-change rewards.
- **Foresight across worlds.** Time ratios between worlds make a
  prediction in one world a long view in another.
- **Future memory.** A run's predictions feed the foreknowledge stock,
  which goes stale as you diverge.

## What you keep (options)

Things cross out of a dream only through the simulator as carrier (rule 5):

- **Memory:** knowledge of what happened, stored as foreknowledge that
  goes stale as you diverge (M17 in the pilot).
- **Observation:** the observed and understood steps of a technique you
  saw in the dream; you still practice it for real (the ability contract).
- **A talent or trait:** a small trait earned in the dream, as several
  Chinese simulator novels do (shown on their Qidian pages).
- **An item, a clone, a companion:** only in worlds whose rules allow it;
  the strongest options, and natural sealed-secret material.
- **Nothing but the report:** the cheapest grade.

## Talent generation (considerations, 2026-10-10)

Weibao asked: "how can we implement the talent generation? would it be
rng+action based". **Proposal: both.** What you did in the run decides the
theme and tilts the grade, and a seeded roll decides the grade and which
talent you get within that theme. Evidence is from the private deep dive
of 我有一個修仙模擬器
(`docs/research/novels/woyouyigexiuxianmoniqi/DEEP_DIVE_2026-10-10.md`).

### What the source book does (shown)

- Settlement first sums up the life in one line, then names the talent
  [0009][0035][0271].
- **The talent answers the life's wound or unfinished business.**
  - He died of pill poison, and got poison resistance.
  - He was raised as a vessel for a body thief and blew himself up to
    deny it, and got a will that resists soul attacks.
  - He lived through a century of demonic war, and got a bane against
    demonic cultivators.
  - He formed a flawless core but then doubted his own gift, and got a
    one-use rebirth with a top talent.
  - He died wanting to know what happened next, and got 100 years of
    watching the world after his death.
- **The grade follows the weight of the life.** Harder, longer and more
  world-changing runs rate higher. After delaying an invasion by centuries
  he expected at least purple [0271]. He still can't predict which talent
  he'll get, so chance is hidden inside the theme.
- **The B2 book is the pure-luck contrast:** one trait per lived year, with
  odds that depend on realm. Each world can use either.

### Pipeline (proposal)

1. **Run ledger.** Keep structured counters per run:
   - cause of death
   - foes by faction or element
   - gates passed or failed
   - sacrifices
   - deeds that changed a natural-course event
   - years lived
   - realm gained versus what was expected
   - events still unresolved at death
   - bonds kept or lost

   Keep it separate from the life record, which is lossy and "never an
   authority for rewards" (`src/life_record.js:1`).
2. **Find the arc.** Score each tag by intensity times rarity, with a bonus
   for the ending and the last years. The top theme wins, and a runner-up
   is kept for ties or a second talent.
3. **Roll the grade.** Use a weight table from white to prismatic, shifted
   by a difficulty and impact score. Roll tables already adjust odds from
   facts and list who contributed (`src/expansion_engine.js:474`), so the
   ledger can feed them as facts.
4. **Pick the talent.** Each theme has authored archetypes with slots the
   ledger fills: "bane of {faction}", "resist {cause of death}", "+{n}
   against {element}". Each archetype has a kind: passive, conditional,
   one-shot, delayed or after death. Make a seeded pick among the eligible
   archetypes at the rolled grade, skipping ones already owned or in
   conflict.
5. **Write the verdict.** One generated line ("You died of X ... you
   awakened Y") makes the talent feel earned.
6. **Grant it** as a trait source under `actor.sources` with its grants. It
   lasts across runs, so the save needs a migration.

Seed the roll from the run seed so the same run gives the same talent.
Whether reloading rerolls it is a world adjective. Anti-abuse is low
priority for a solo game.

| Part | Decided by action | Decided by the roll |
|---|---|---|
| Theme | Yes, the ledger's top arc | Only to break a tie |
| Grade | Shifts the odds | Rolls the result |
| Which talent | Filters the eligible archetypes | Picks among them |
| Magnitude | Grade sets the band | Picks a value inside the band |
| Slots (faction, element) | Filled from the ledger | Never |

### More to consider (talents)

- **T1 Omens.** During a run, hint at where the life is leaning ("your
  bones remember poison") so players can steer. A world can keep it hidden
  instead.
- **T2 Chasing a talent.** The book's hero dies on purpose to learn a gate.
  Some themes could need a specific ending, so a player can aim a whole
  life at one.
- **T3 Failure pays.** A failed great attempt weighs as much as a success.
  The book's gold rebirth talent came from failure.
- **T4 Mixed blessings.** White or joke talents and curses with an upside,
  as in B2, where a "vehicle killer" trait collapsed a world. Luck can
  hand you something strange.
- **T5 Growing a theme.** A repeat of the same arc upgrades the talent you
  already have instead of adding a new one, like the graded trait entries
  family.
- **T6 Locked and delayed talents.** An unlock after N more runs or on a
  condition makes waiting part of the content.
- **T7 How the world saw you.** A talent named from your reputation rather
  than your own deeds ("the Butcher of the Pass").
- **T8 Outside simulators.** The same generator could run at a real death
  and hand the heir a legacy trait through `buildLifeHeirSave`
  (`src/life_experience_host.js:8`).
- **T9 Companion talents.** Companions in the run earn smaller talents or
  memories of their own; the book copies memories into one.
- **T10 Saturation.** Repeating the same arc earns lower grades, which
  pushes variety. A world can also choose the opposite.
- **T11 Pick one of three.** Roll two or three candidates and let the
  player choose. The book gives one; the choice is a world adjective.
- **T12 Prismatic.** Reserve it for a first-ever or world-record deed.

From B2 (一年抽取一詞條, read in full through chapter 665;
`docs/research/novels/ttks-novels-2026-10-10/B2/DEEP_DIVE_2026-10-10.md`):

- **T13 Hardship as a rumor, not a rule.** Chen suspects that hard years
  draw better and sheltered years worse, but the system never confirms it
  [0565]. A world can make action tilt the odds openly, secretly, or not at
  all, and let players form theories.
- **T14 Talents that bend the generator.** There's no pity, but one trait,
  越老邁越幸運, raises your luck as you age [0050][0265]. Luck modifiers can
  themselves be talents.
- **T15 Real progress tilts the odds.** Draw odds and slots follow your
  actual realm, not your simulated one [0024]. Dreams can't inflate their
  own rewards.
- **T16 Ritual doesn't matter.** Grabbing the gold light faster doesn't
  improve a draw [0471]. Decide whether the reveal UI involves any skill.
- **T17 Owning versus equipping.** You can own hundreds of traits but
  equip only a few slots, set by realm [0024][0304]. Generating many and
  picking a loadout makes even a weak roll worth something.
- **T18 Copied racial talents can be rerolled; your own race's can't.**
  The rule is narrower than "innate can't be rerolled". The 萬族之劫 trait
  copies a race's talent on touch, and each copy rolls fresh values. The
  wing race's five-element affinity rolled water at mid grade when Chen
  wanted fire at top grade. A copied racial talent can be dropped at any
  time and copied again by touching another member, so it can be farmed.
  His own race's talent can't be dropped [0308]. The text states this and
  never explains it (see "Innate versus acquired" below).
- **T19 Cursed equips and the outside hand.** 毒液 gives ×10 to everything,
  but the dark self takes over and won't take it off. Only the real
  controller's yearly swap can remove it [0412][0553].
- **T20 Draws need the world's own clock.** In one simulated year the draw
  failed with the message that local time flow didn't match the 時間長河
  (river of time) [0342]. Chen reads it as an anti-bug rule. In a time room
  where a day inside is a year outside, a per-year draw would lose draws;
  in a reverse room it would gain them. Both are refused. It matters
  because B2's talents are counted per lived year, so any place with its
  own clock changes the draw rate. See "Whose clock counts" below.
- **T21 Earn-from-X caps written into the trait.** 嘉豪行為 earns points
  from nearby boasting, with daily and per-source caps in its own wording
  [0484][0485].

### Innate versus acquired (considerations)

In B2 "innate" means your own race's talent, which is part of what you
are. A copied one is a borrowed effect held by another trait, so it can
be set down. That is an inference; the book gives no reason. Elsewhere in
the source set, innate gifts change only through big, costly events:

- The 碧月池 pool raises a spirit root, but only up to 上品 (top grade)
  (我有一個修仙模擬器 [0048][0105]).
- Its origin anchor restarts from transmigration and lets you rebuild your
  foundation (same book [0044][0108]).

Proposal: under "anything is possible, reasonably", no talent kind is
permanently locked. The rule is the cost:

| Talent kind | Rerolled by | Typical cost |
|---|---|---|
| Copied or borrowed | Dropping it and copying again | Contact, time, sometimes a fight |
| Earned (settlement, deeds) | A new run or deed with a different arc | A whole run |
| Innate (race, body, root) | Rebirth, an heir, a new body, 洗髓 (marrow washing), an origin-anchor run, a world-specific ritual | A life, a body or a rare resource; often capped (the pool stops at 上品) |
| Sealed or cursed | Outside help: a controller's swap, a ritual, a person | Someone else's action |

Each world sets which rows exist. A world where your race's talent is
truly fixed is valid too; there, the fixed talent is part of who you are.

### Whose clock counts (considerations)

A per-year talent needs a clock. In a game with several worlds and time
rooms, the options are:

- **Lived time** (your own age): time rooms speed you up. This suits
  cultivation fantasy.
- **Shared world time** (B2's 時間長河): draws pause wherever the clock
  differs. That's B2's rule.
- **Home time**: only years at home count. It anchors the cheat to a place.
- **Event count** instead of time (per run, as in 我有一個修仙模擬器): no
  clock question at all.

The guard is a world adjective. In a solo game farming is not harm, so
some worlds can allow the time-room exploit as a feature, and a cheat that
is "broken on purpose" can be the fun.

### More to consider (innate talents and clocks)

- **T22 Innate talents that grow.** Your race's talent can't be swapped,
  but it can awaken in stages, like 葉楓's water body going from dormant to
  awakened (我有一個修仙模擬器 [0059]).
- **T23 Rolled values are part of the talent.** One talent can carry
  random sub-values (element, grade). Rerolling those values is a smaller,
  cheaper act than rerolling the talent.
- **T24 Heirs inherit innate talents with mutation.** A child gets the
  parent's racial talent with a fresh roll on its values. That is the
  natural reroll for innate talents in a lineage game.
- **T25 Being caught farming.** A world can notice it: a race whose
  members keep being touched and copied might hunt the copier.
- **T26 Draws in odd places as story.** A failed draw is information. It
  told Chen the place sat between the virtual and real worlds [0342]. A
  draw that fails, or behaves strangely, can reveal what kind of place
  you are in.

### More to consider (talents in play)

- **T27 Grade is rarity, not usefulness.** White 丹毒克星 was what let the
  hero eat pills nonstop and set his whole strategy (我有一個修仙模擬器
  [0049]). Let low grades be narrow but decisive, so a white roll can
  still make a build.
- **T28 Combos and clashes found in play.** In B2 a regeneration trait
  fought another trait's effect [0617]. Pairs of talents can make new tags
  or cancel each other, and players learn which by trying them. The
  notebook records what was found.
- **T29 Talents as hidden information.** A trial guardian can't see the
  hero's talents but can read their effects [0220], and B2 has a trait
  that reads others' aptitude. Seeing someone else's talents is a skill or
  a cheat, and your own can be a sealed secret.
- **T30 Theft and copying.** B2's copier takes racial talents by touch. In
  the other book an outer demon copies a body but fails to copy talents
  [0255]. Each world decides whether talents can be stolen, copied or
  only seen.
- **T31 The wording is the law.** 勝己半子 raises only the hero's own power,
  not the talismans he makes [0268], and B2 traits apply only within their
  wording. Store scope as tags so a careful reader of a talent's text can
  find edge uses.
- **T32 Talents need moods.** B2's 超級賽亞人 needs genuine extreme rage,
  and 毒液's dark self takes control. Talents can read the life-sim mood
  and personality state, so feelings become a resource.
- **T33 Talents for others.** Auras that help allies (B2's 領袖光環) or
  share power with a party (賜我力量吧) push talents into companion and
  household play.
- **T34 Talents and other worlds.** Effects can weaken under a stronger
  world's laws or a world's power cap, as in B2. A talent can be born in
  one world and lose strength in another, which is a reason to collect
  talents per world.
- **T35 NPCs earn talents too.** Run the same generator on important
  NPCs' life ledgers, so a rival's talent follows from their history. The
  world then explains itself: the man who survived the plague has the
  plague talent.
- **T36 Names with flavor.** Web novels give talents meme names
  (嘉豪行為, 番茄資深用戶). The verdict can lean into humor or fourth-wall
  jokes where a world allows it (see
  [presentation and the fourth wall](PRESENTATION_AND_FOURTH_WALL.md)).
- **T37 The world owes you.** Instead of a hidden pity counter, a great
  loss or tragedy leaves a visible "debt" that tilts a later roll,
  told as fate, not math. This fits T13's hardship rumor.
- **T38 Asking for a talent.** The player names a talent they want, and
  the generator turns it into a quest: the life arc that would earn it
  (T2), with a grade set by difficulty.
- **T39 Showing the reasons.** Roll previews already list contributors
  (`src/expansion_engine.js:474`). The settlement can show which deeds
  pushed the theme and grade, which teaches players how the system thinks
  without exposing the odds.

### More to consider (talents over many runs)

- **T40 Talent inflation.** The book's hero holds six talents after seven
  runs. An idle player may run hundreds. Slots (T17), merging (T5) or
  retirement keep a long save readable and the power curve sane.
- **T41 Spending talents.** Burn an unwanted talent to tilt the next roll,
  or offer it at a shrine. That's a sink that makes duplicates and joke
  rolls useful.
- **T42 The reveal.** The book shows the color first: gold light seeps in
  before the name appears [0153][0218][0271]. Grade first, name second
  builds anticipation in the UI.
- **T43 Every life earns something.** A cautious, cowardly or quiet life
  should earn a fitting talent too (escape, patience, a craft), so no
  playstyle is the wrong one.
- **T44 Run-only talents.** Some talents last only inside a simulation and
  vanish at settlement. That splits "what helps this dream" from "what I
  keep".
- **T45 Sealed talents.** A talent whose true effect is a sealed secret,
  found by using it, per the sealed-secrets rule. The verdict shows only
  its name and a hint.
- **T46 Talents open doors.** Owning a talent can unlock actions, people or
  places through the existing capability grants on sources, not only
  stat boosts.
- **T47 Being appraised.** Sects, guilds or rivals test and value talents:
  they recruit you, pay you or fear you. A rare talent is also a reason to
  be noticed (see the hero's habit of hiding power, R14 in the private
  deep dive).
- **T48 Talents remember their life.** Each talent keeps a link to the run
  that earned it ("from the life that ended at Wushan"), tying it to the
  life record and making the talent list a biography.
- **T49 Rebalancing old talents.** Sources already carry a revision. When a
  talent is retuned, a save either keeps the old revision or migrates to
  the new one, and that choice is made per talent and recorded.
- **T50 Never an empty roll.** Add a content test that every theme has at
  least one archetype at every grade, plus a determinism test (same ledger
  and seed give the same talent), so a settlement can't fail or drift.

## The simulator as one idea, many forms (2026-10-10)

Weibao: "This is expanding the aspects of a specific cheat." This section
applies the [E8 aspects model](emergent/E8_POWER_ASPECTS.md#the-core-model)
to the simulator itself. A simulator cheat is the idea, and each axis below
is a dial. Two simulators on different dials play like different cheats.
Examples come from 我有一個修仙模擬器 (XX, private deep dive), B2
(一年抽取一詞條) and the fan fiction pilot. Everything here is a proposal.

### Axes of a simulator (SA)

| Code | Axis | Question | Values seen or proposed |
|---|---|---|---|
| SA1 | Subject | Whose life or what runs? | Your own future (XX, B2); another person living it for you (圣女帮我模拟修仙, per r5); the world without you (Forecast); one fight (Rehearsal); a past self |
| SA2 | Start | Where does it begin? | Now; a fixed origin anchor (XX [0044]); a random era as a new identity (XX 一世傳說 [0153]); a chosen past moment |
| SA3 | Horizon | When does it end? | Death or exit (XX); a fixed span; one season; until a named event |
| SA4 | Control | Who decides inside? | You at forks (XX [0002]); a yearly loadout swap only (B2); nobody (headless); a companion who can disagree |
| SA5 | Fidelity | How true is it? | One possible future that drifts as you act (both books); exact under a locked seed; dreamlike fragments (B2's 逆知未來) |
| SA6 | Carry | What comes back? | Peak self XOR one item (XX [0009]); a fixed whitelist (B2); memory only; a talent; summonable past selves (B2 模擬分身 [0337]) |
| SA7 | Reward unit | What is earned, and how often? | One graded talent per run, by story (XX); one trait per lived year, by odds (B2); nothing but the report |
| SA8 | Refill | What brings the next charge? | Place quality (XX); a growing ladder plus a quest skip (B2); deeds; real idle time |
| SA9 | Price | What does a run cost? | Almost nothing (both); sleep, mood or sanity; luck; lifespan |
| SA10 | Visibility | Who can tell? | Hidden, but the leap in power leaks an aura (XX [0270]); rivals read the effects, never the cheat (XX [0188]) |
| SA11 | Reach | Who else does it touch? | Only you; copied memories in companions (XX [0274]); shared power (B2 賜我力量吧); a shared dream |
| SA12 | Growth | How does the cheat itself level? | New options unlock at a realm (anchors at 築基 in XX); the panel adds fields; gold talents add tools (the 100-year spectator) |
| SA13 | Failure | How does it break? | A draw fails on an alien clock (B2 [0342]); a cursed trait seizes the dreamer (B2 毒液); oaths made inside don't carry (XX [0076]) |

### Look alike, play differently (subtle pairs)

- **XX versus B2 rewards.** Both reward you for living, but XX pays once per
  life by its story, and B2 pays every year by odds. XX makes you plan an
  arc. B2 makes you plan a loadout.
- **Origin anchor versus random-era rebirth.** Both restart. The anchor
  keeps your known world and your crafts. The rebirth throws away your
  foreknowledge for a top talent.
- **Settlement versus spectating.** Both teach you about the future. The
  settlement gives a power. The 100-year spectator (死而不僵) gives only
  information, about years that you never lived.
- **Notes for others versus copied memories.** Both help companions across
  runs. Notes are slow and safe. A memory copy makes a "manufactured
  regressor" who believes in a rebirth that never happened.

### Shards of the simulator

Split the cheat into pieces and hand them to different holders:
- One person runs the dreams, and another can settle them.
- A cheat shard that only forecasts, or only settles, or only refills.
- An heir inherits the cheat with one axis rerolled (a different refill
  rule or reward unit).
- A rival holds a weaker simulator. Your real choices surprise them only
  when they fall outside their model.

### Generated simulators for NPCs and worlds

With the axes as data, the game can roll a simulator for a rival or for a
world's chosen one, as E8 proposes for any power. A world can also set
house rules: in a world without fate the fidelity axis drops to fragments,
and in a world with a fixed clock B2's draw guard applies.

### More to consider (simulator aspects, SM)

- **SM1 The cheat has a voice.** XX's panel writes the verdict line; B2's
  panel jokes ("老賊，我俏麗嗎"). The cheat's tone is an aspect, from cold
  ledger to chatty companion.
- **SM2 The cheat wants something.** Neither book's system has goals, but a
  variant could nudge you toward an arc, and that is a sealed secret worth
  discovering.
- **SM3 Simulating the simulator.** A dream inside a dream: a world can
  forbid it, make it blank, or let it show the cheat's own origin.
- **SM4 Upgrading by spending runs.** Trade a charge for a permanent dial
  change (a longer horizon, a second anchor, an extra fork card).
- **SM5 The cheat's history.** Has someone held it before? XX's sword
  master left an inheritance that exactly fits the hero's five crafts
  [0250][0270], which hints at an earlier holder or at foresight. Prior
  holders give the cheat lore without explaining it.
- **SM6 Losing the cheat.** A life without it, after a theft, a seal or a
  world that rejects it, shows how much of your power was the cheat and
  how much was you.
- **SM7 Many holders in one world.** Two simulator users see each other's
  futures. Each one's dreams contain the other acting on dreams, and the
  rules for that collision are a world adjective.

### More to consider (the holder and the game, SM8 to SM16)

- **SM8 The cheat changes its holder.** XX's blurb charts it run by run.
  After the first he is kind and careful, after the fifth he wants to
  repay his sect, after the eighth he thinks the world is wrong, and after
  the tenth he plans to overturn it. Memories come back without emotion
  [0009], yet he grows colder. A personality drift dial (caution, numbness,
  ambition) can follow the number of lives lived.
- **SM9 Dream people are real inside.** The dreamer's feelings inside a run
  are real [0003], and he grieves his loyal guard across runs [0008]. A
  run can leave mood effects (grief, resolve) in the real life even when
  nothing else carries. That's a life-sim hook.
- **SM10 Reading a long run.** Late XX runs skip decades in one line
  [0263][0285]. A run report needs pacing: highlights, a timeline you can
  scrub, and "skip to the forks". A thousand-year log that nobody reads is
  wasted.
- **SM11 The run archive.** Keep past runs browsable side by side ("in run
  3 the city fell in year 82; in run 4 I left before"). Comparing runs is
  the play.
- **SM12 Dreaming while idle.** An offline-friendly cheat: set intent,
  dream while away, settle on return. The refill clock and the offline
  clock need one owner.
- **SM13 Selling the future.** Foreknowledge has a market. XX sells
  outdated secret-realm news cheaply [0018] and turns old news into future
  knowledge [0081]. Selling a forecast to an NPC is a trade that spends
  your edge.
- **SM14 If the world knew.** In a world where simulators are known,
  institutions appear: seer guilds, insurers, laws against acting on
  dreams, and people who pay to be in your next run.
- **SM15 A run as a chapter.** Each settled run becomes a volume in the
  life record ("Run 4: The Flawless Core"), which links to T48 and gives
  long saves a table of contents.
- **SM16 The cheat in the prestige layer.** One run can be a prestige
  reset, or prestige can be what refills or upgrades the simulator. Pick
  per world which layer owns which, so the two systems don't count the
  same reward twice.

### Suggestions (not ideas for the cheat; next steps)

- **G1 Read the comparison set.** Done 2026-10-10; see below.
- **G2 Catch up XX later.** Refetch ttks when it reaches Qidian's 328 to
  see the first use of 一世傳說.
- **G3 A one-page dial card.** Turn SA1 to SA13 into a template that any
  world's cheat fills in, beside the E8 data shape.
- **G4 A playable proof.** The smallest dream run with a three-theme ledger
  and one talent, to see which dials matter in play.

### Two more simulators (G1, 2026-10-10)

Private deep dives:

- **SN, 聖女幫我模擬修仙:** `docs/research/novels/shengnvbangwomonixiuxian/DEEP_DIVE_2026-10-10.md`.
  All 264 chapters read except three lost to bad mirrors.
- **FR, 凡人：從極陰島開始的修仙模擬器:** `docs/research/novels/fanrencongjiyindao-moniqi/DEEP_DIVE_2026-10-10.md`.
  Only the free 44 of 184 chapters exist on any mirror.

**New values on existing axes**

| Axis | SN (someone else lives it) | FR (paid, canon-scheduled) |
|---|---|---|
| SA1 Subject | Invited runners live it; the owner only watches [0127] | His own future |
| SA2 Start | Continue the last life or reroll; talents can be swapped after 20 years | His current state |
| SA6 Carry | Owner picks 1 of 3 plus all extras; runner gets a degraded copy (50% becomes 10%, half a physique) [0100][0155] | First run gets everything; later runs pick 1; an extra pick costs 10 years off the lifespan cap [0010] |
| SA7 Reward unit | Pick 3 of 10 birth talents, plus extras by achievement | A talent drawn at run start, from a tier you pay for |
| SA8/SA9 Refill and price | A free 24-hour cooldown | Stones per run, per draw and per claim; prices ×10 at 結丹 [0006] |
| SA11 Reach | Several runners in one shared world; pooled luck; a person extracted as a reward [0115] | Sells loot inside the run and launders it back as stones [0009] |
| SA12 Growth | Permissions unlock (36 deaths); invite slots grow with realm; a v2.0 ruleset swap [0227] | Price and cooldown tiers by realm |
| SA13 Failure | Lost bodies of text aside, runners grieve and burn out; one-way extraction [0230] | Rewards misfire in reality (bloodlust from 煞氣) [0027] |

**New axes**

- **SA14 Beneficiary.** Who gets the reward: you, the person who lived it,
  both unequally (SN), or a pool.
- **SA15 Achievements.** Named deeds that add rewards (SN) versus pure odds
  (B2) versus the story's arc (XX).
- **SA16 Currency.** Free, money (FR), lifespan cap (FR), or charges.
- **SA17 Win condition.** Survive, clear the dungeon (SN [0219]), ascend
  inside (SN [0263]), or simply die.
- **SA18 Ruleset version.** The cheat can patch itself mid-story (SN v2.0)
  and change what everything means.
- **SA19 Schedule source.** A random world (SN), a seeded world
  (XX, B2), or a book's canon timeline (FR).

**Look alike, play differently**

- **SN's runners versus XX's memory transplant.** Both give other people
  simulated lives. SN's runners know they are in a simulator but not who
  profits. XX's companion believes she was truly reborn.
- **FR's paid draw versus SN's free pick 3 of 10.** Both hand you talents
  at the start of a run. FR is a gamble you fund. SN is a menu of mostly
  jokes, where the skill is spotting the one real talent.
- **SN's degraded copy versus B2's 賜我力量吧.** Both share power with
  others. SN shares by design and in secret, at a fixed discount. B2 shares
  on purpose, live, with a cap of ten people.

### More to consider (from SN and FR, SM17 to SM26)

- **SM17 Delegated runs.** Hire, persuade or trick NPCs into living runs
  for you. The player's role shifts from hero to manager, which fits
  Weibao's question "would we be the characters, or someone guiding them".
- **SM18 The runner's side.** Runners have their own goals, grief and
  growth (SN's 陳千雪 fears the simulator will abandon her [0251]). A
  runner who learns the truth is a major story beat.
- **SM19 Consent as a dial.** Open contract, a fair split, a rigged prompt
  (SN [0097]), or a gift. The ending note "don't abandon your tools" [0263]
  gives the game a moral spine without banning anything.
- **SM20 People as rewards.** A simulated person who comes out into
  reality (書芷畫) has questions about her own existence. SN's owner worries
  about this himself [0115]. That's a rich, sealed-secret-friendly arc.
- **SM21 A cheat economy.** FR funds runs with stones, makes stones from
  runs, and launders items. Pricing by realm means the cheat never becomes
  free.
- **SM22 Raw power needs taming.** Rewarded realm without understanding
  (FR) makes a real practice loop after each run, which gives idle time a
  job.
- **SM23 Rewards that misfire.** A reward tuned to the run's environment
  can backfire at home (FR's bloodlust). Tag rewards with the context they
  came from.
- **SM24 Canon as the calendar.** For book worlds, the source's timeline
  can be the simulator's schedule (FR uses 凡人修仙傳's). This ties the
  cheat to existing book-world work.
- **SM25 Shared world, separate clocks.** SN's runners meet in one world
  but live different ages, so their clocks differ [0242][0261]. Co-op
  dreams need a rule for whose time is "now".
- **SM26 The cheat's author is you.** SN's developer is the owner's future
  self [0263]. A loop origin is a strong sealed secret for a simulator
  world, and it pairs with SM5 (earlier holders).

## Costs and limits (world adjectives, never a fixed "once")

The surveyed novels refill charges per kill, per year, per seven days, or
only once (shown). Here each is a per-world or per-cheat adjective:
charges on a clock, on deeds, on a resource (luck, sanity, sleep), or on
real idle time spent dreaming. Other levers: horizon length, number of
decision stops, fidelity, what can be kept, and whether the seed can be
locked.

## Implementation shape (proposal)

**Request:** `{scope: life | decision | world | fight | self, start,
horizon, engine: S1 | S2 | S3 | mixed, mode, stops, policy, seedMode: free
| locked, knowledge: known | modeled}`.

**Report:** `{beats: [...], decisions: [...], outcome, bands, deaths,
people, divergenceFrom: lockedSeed?, confidence, keepOptions: [...]}`.

**Rules for the code:**
- Pure: the real state hash is identical before and after a simulation.
- Deterministic: same request and seed give the same report.
- Proven pure so far: audit D deep-froze inputs and found
  `advanceSimulation` pure and deterministic in every case it could build
  (fresh, pending action, enrolled with 0, 2 and 64 helpers); five owners
  that receive the original state could not be enrolled in Node, so their
  purity is still unproven
  ([audit](audits/cheat-implementation-2026-10-10/REPORT.md)).
- Bounded: a cap on boundaries per run (the engine already stops at 512
  boundaries per advance and returns the unspent time,
  `src/expansion_engine.js:619`), and long runs in a web
  worker or sliced across ticks so the page stays responsive.
- Save: only charges, trimmed reports and the chosen keep. New optional
  save data needs a migration; old saves start with no simulator.
- Sealed: report text passes through the same knowledge filter as the UI.

**Tests:** purity (state hash), determinism (fixed seed), no sealed-truth
leak, budget (time per run), and a browser check from a fresh origin with
save, reload and import, per AGENTS.md.

## Other cheat families mapped to engine pieces

Each family from the pilot as engine primitives. Existing hooks are from
the [cheat library](CHEAT_LIBRARY.md#implementation-proposal-from-reading-the-code-on-2026-10-10)
(cards as sources under `actor.sources`, hooks, seeded roll tables).

| Family | State it keeps | Trigger and sink | Existing piece to extend |
|---|---|---|---|
| Accumulator (Celestial Forge) | Reach, pool, bank | Reach grows on a boundary or on deeds; random offers; take if reach covers cost; keep the remainder | Day-boundary hook, seeded roll table |
| Sign-in | Claimed places or people, streak | Visiting a place or person on a calendar | Simulation boundary, people and locations |
| Draw wheel with doubling cost | Draw count, pity, pool | Spend currency; each draw costs more, rarer odds rise | Roll tables with contextual weights |
| Copy / template shelf | Templates, slots, tiers | Defeat or observe; store a lower tier; fuse to raise | Techniques (observed, understood, internalized) |
| Graded trait entries | Traits with grade and evolution graph | Spend luck to upgrade into a named successor; curses locked | Body and trait data, capabilities for seeing others' entries |
| Fate change reward | Watched fates, payouts | A scripted death or event averted mints currency | Natural-course timeline and causal stories |
| Hub store | Points, tolls, world grades, exchange list | World deeds earn points; trips cost a toll; grades unlock | Travel and carriers (`previewCarrierTransit`) |
| Rebate multiplier | Multiplier per person | Gifts, training, care for a target raise the return | People, gift and teach hooks |
| Quest system with stakes | Contracts, penalties (years of life) | Accept, fulfil or fail on a deadline | Jobs and deadlines on the simulation clock |
| Teach / deliver | Bestowed powers, copies back | Affection or contract gates a gift | Techniques, people, agreements |
| Loop | Checkpoint, carry dials (mind, body, items, people) | Death or trigger resets to checkpoint | Heir pipeline (`buildLifeHeirSave`) and life record |
| Foreknowledge | Knowledge stock with accuracy | Spent by acting on it; decays with divergence | Notebook and natural-course timeline |
| Simulator | Charges, reports, keeps | This document | All three engines above |

## A first playable slice (proposal)

"Dream of the coming year" in the home world: an S1 story model over the
Village career, patrol, study and household content that already exists.
Three decision cards at the largest forks, the rest following a standing
intent you set. Report with a result band and confidence. Keep one
observation step of a technique you saw. Charge refills per in-game season
(a home-world adjective). It never changes the real save except the charge,
the report and the keep. Needs a migration for the new optional field and
the full browser check.

## More to consider

- **Dreams have side effects.** Repeated dreams of dying can cost sleep or
  mood; a telepath might notice a dreamer, as one surveyed novel's world
  notices its cheat.
- **Shared dreams.** Simulate with a companion: both see the same branch,
  and the companion can disagree with your choice.
- **Others simulate too.** A rival with a simulator anticipates your moves,
  so your real choices can surprise only if they leave their model.
- **Dreams as a world's law.** A world where everyone can preview fate
  (prophecy culture) behaves differently from one where only you can.
- **Simulated people.** Characters inside a dream are only the model's
  guesses; meeting the real person can contradict the dream.
- **Simulating the simulator.** A dream inside a dream is a fair outlier
  case; most worlds should treat it as a blank spot.
- **Learning by losing.** A spread that shows you dying in every run is
  still useful; it can point to the one stat or person that changes it.
- **Idle fit.** Dreams are a natural offline activity: set intent, sleep,
  read the report on return.
