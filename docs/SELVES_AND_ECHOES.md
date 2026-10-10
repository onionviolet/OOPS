# Selves and echoes: past, future, perfect and shadow versions of you (proposal)

> **How to use this doc (Weibao, 2026-10-10):** these are considerations
> for established and future worlds, to help ideaboard and implement
> fitting characters at fitting times. Tiers, lists and tables are
> illustrative, not complete or fixed; more distinctions can exist.
> Everything just has to make sense for the world and character at hand.

Claude, 2026-10-10. Weibao: "all three possible, depending on situation?
more to consider? My current self could have like different stuff or the
same stuff depending on my actions? Consider generating 'future selves' for
certain things like the 'perfect version' from Death a Day? Save
accordingly?"

**Proposal only.** Companion to [timelines and divergence](TIMELINES_AND_DIVERGENCE.md#meeting-your-past-self-b3-implementation-proposal)
(past-self ghosts, branches) and the [ability contract](worlds/ABILITY_AUTHORING.md)
(record versus understanding versus execution). Each world decides which of
these exist (rule 2).

## Recognition: all three, by situation

Weibao's answer to the open question: a past self can recognize you by
**soul, face or habits**, depending on the situation.

| Cue | When it works | When it fails |
|---|---|---|
| Soul | Worlds where souls are perceivable; the ghost or you has a soul sense; a vow or relic links you | Soul concealed, changed by a power, or no one present can read souls |
| Face and body | Same body or same family resemblance | Different body, disguise, age gap, regression into a child |
| Habits | You fight, talk or haggle like it does; it notices over time, not at once | You've changed; it is unobservant; you hide your style |

Recognition is a reading (rule 6): it can be partial ("you remind me of
someone"), wrong (it thinks you are its parent) or delayed. Once recognized,
it reacts by its own personality: trust, fear, rivalry, denial.

## Same stuff or different stuff

Weibao: your current self "could have different stuff or the same stuff
depending on my actions." Yes. Proposal for how:

- **Things are instances, not copies.** A unique item exists once in a
  world. If you get it first, the ghost never does, and its trace bends
  (a disturbance). If the ghost has it, you can buy, earn, steal or be
  given it.
- **Same kind is fine.** A common sword, the same recipe, the same skill
  learned the same way: you can end up with the same kit by repeating
  your old choices.
- **Carried items** follow carriers (rule 5). If a regression carries a
  unique item into a world where the ghost holds it too, the world
  decides: one fades, both exist and the world reacts to the anomaly, or
  they merge.
- **Convergence.** If your build, habits and items grow close to the
  ghost's, odd things can happen, per world:
  - Perceptive people confuse you for each other.
  - Fate (E5) treats you as interchangeable and pushes one of you into
    the other's role.
  - Soul resonance: shared senses, shared wounds, or a pull to merge.
- **Divergence** the other way: the more different you are, the less it
  recognizes you and the less fate cares.

## Generated selves

Not every self is a real past life. Many are **generated** from your
current state and shown for a reason. The reference case:

**Perfect fight (*A Novel Concept*, chapter 293, local research).** A
Colosseum reward: pick one of the abilities that could have beaten an
opponent, then watch an optimal version of yourself win with it. The
research notes that the demonstration helps but does not solve every
future fight. It teaches; it does not hand over the power.

### Kinds

| Code | Self | Built by | What it's for |
|---|---|---|---|
| G1 | **Perfect self** | Your current stats and kit, played optimally against one target | Coaching, a reward, a "how could I have won" replay |
| G2 | **Perfect with one more ability** | G1 plus one ability you pick from those that could win (the reference case) | A taste of a path; points toward what to learn |
| G3 | **Projected future self** | Your habits and growth rates run forward N years | "If you keep going like this." A warning or a goal |
| G4 | **Alternate self** | The choice you didn't make at a fork, from the atlas or generated | Regret, curiosity, a path preview before choosing an upgrade |
| G5 | **Potential self** | Your current path at its ceiling | Shows a ceiling, which can be a wrong reading |
| G6 | **Shadow self** | Your suppressed choices: offers you refused, people you failed, cruelty you avoided, built from receipts | Heart-demon trials, inner battles |
| G7 | **Worst self** | Your actual worst habits amplified | A cautionary tribulation |
| G8 | **Real past self** | A branch's life trace | See the timelines doc |
| G9 | **Real future self** | A regressor from a later branch, as a carried-in outlier | Stale but valuable knowledge |

G1 to G7 are readings or simulations; G8 and G9 are real people.

### Where they appear

- **Rewards:** arena feats, firsts, trials passed (the perfect fight).
- **Tribulations:** heart-demon trials (common in cultivation stories)
  where you fight G6 or G7.
- **Mirrors and divination:** an item, a technique or a seer shows G3 to
  G5, possibly wrong.
- **Upgrade choices:** before picking a skill evolution, see G4 for each
  branch.
- **Vows:** see who you'd be after swearing.
- **Death:** a life review showing G4, the life you could have had.
- **Dreams and near-death:** unprompted glimpses.
- **The [Proving Ground](worlds/proving-ground/WORLD_BRIEF.md):** spar
  against G1, G3 or a ghost from your atlas.

### How to generate them without simulating everything

Every generated self is a **transform of your real state**:

| Transform | Used by | How |
|---|---|---|
| Optimize | G1, G2 | Search a small decision space: stances, triggers, timing, one added ability. Native idle combat already has few choices per fight, so a bounded search fits. Run it off the main thread; seed it (E1) |
| Extend | G3, G5 | Apply your recent growth rates and habit profile for N years; aggregates, not day-by-day |
| Swap | G4 | Re-run from a fork with the other choice, coarse (like a branch's natural course) |
| Invert | G6 | Build traits from refused offers and avoided acts in your receipts |
| Amplify | G7 | Scale your strongest bad habits |

The output is either a **demonstration** (a replayed combat log you watch)
or a **combatant** (an NPC with a stat block and habit AI).

### What you get from them

Per the ability contract, seeing is not learning:

- **Observation, then understanding.** A perfect fight can grant the
  `observed` and maybe `understood` steps of a technique (the same steps
  Rat-step uses in [technique_content.js](../src/technique_content.js)).
  You still practice and internalize it yourself.
- **Insight, not stats.** A gap report ("perfect you used the opening
  three times; you used it once") is a training guide.
- **Titles and mood.** Beating your shadow can earn a title. Losing to
  your perfect self can inspire, humble or obsess you (E3 mood).
- **Honest limits.** A generated self is optimal only against what it
  knew. A hidden enemy trick makes the "perfect" line wrong (rule 6).

## Where self-generation comes from (2026-10-10)

Weibao: "Perfect fights and ideas like that can be a cheat or part of a
cheat or part of an ability or a bloodline and more, there are many
possible ways."

So a perfect fight (or any generated self) is a **function** that can be
delivered by any source. The source changes its price, its limits and who
else can have it. Uses the [E8B source axis](emergent/E8B_POWER_CATALOG.md#where-power-comes-from-source-axis)
and the [cheat cosmology](CHEAT_COSMOLOGY.md#the-key-to-portability-what-backs-a-cheat).

| Source | Example form | Price and limits | Distinct play |
|---|---|---|---|
| **Cheat (whole)** | "Replay any fight perfectly" as your one cheat | Usually a cooldown, a charge, or attention from whoever gave it | Run-defining; the world may not have it at all |
| **Part of a cheat** | A system's reward menu that sometimes offers a perfect fight | Only when the system decides; tied to its goals | You chase the system's feats to get it |
| **Ability or technique** | A trained foresight art; a combat-sim technique | Fuel, concentration, startup; skill limits accuracy | Gets better with mastery; can be taught |
| **Bloodline** | A clan eye or dream-gift that shows an ancestor beating the foe | Awakens at an age or trigger; family politics | Heirs inherit it; a clan wants you back |
| **Item** | A mirror, a replay crystal, a training doll that becomes you | Charges, breakage, theft | Can be lent, sold, stolen |
| **Place** | An arena, a dream temple, a hall of echoes (the reference case is an arena reward) | You must be there; entry costs | A destination worth traveling to |
| **Institution** | A school's simulation room; a guild's archive of fights | Membership, fees, rank | Social access; rivals see your replays |
| **Patron** | A god who shows you how it would have done it | Faith, service, revocable | A relationship that can turn |
| **Vow** | "I accept one perfect replay per defeat, and never fight the same foe twice" | The vow's restriction | Built by you (E8D) |
| **Consumed** | A drug, a fruit, a monster's dream organ | Side effects, addiction, one use | A hunt for ingredients |
| **Technology** | A combat recorder plus analyzer | Data needed, power, repairs | Better data, better sims |
| **Curse or affliction** | You relive every defeat perfectly in your dreams, whether you want to or not | Sleep, sanity | A gift that hurts |
| **Shard** | A fragment of a fate or time power | Rivals hunting the other shards | Collectible |
| **Ancestors and ghosts** | Spirits of past wielders fight the ideal line for you to watch | Respect, rites, their own opinions | They may disagree with you |
| **Your own past lives** | Your atlas runs as sparring echoes | Requires real branches | Your history as a training tool |

The same split holds for every generated self in the table above (G1 to
G9). A projected future self can be a bloodline's prophecy, a technique,
a mirror or a cheat; a shadow self can be a tribulation, a curse or a
patron's test.

### Dials on any self-generator

| Dial | Range |
|---|---|
| Scope | One fight; one opponent type; any situation; your whole life |
| Timing | After the fact (replay); before (preview); during (live guidance) |
| Fidelity | Rough sketch; good; truly optimal for what it knows |
| What it may use | Only your current kit; plus one ability (the reference case); anything in the world |
| What it reveals | Only the line; also the enemy's hidden rules; also your weak points |
| Who sees it | Only you; you and a witness; anyone in the institution |
| Frequency | Once per feat; per day; per charge; at will |
| Learning yield | Spectacle only; observed; understood; a free practice boost |
| Side effects | None; fatigue; obsession; dependence (you stop thinking for yourself) |

**Live guidance** is the strongest version: the perfect self whispers the
next move mid-fight. Rare, with a heavy cost, and it can be wrong when the
enemy hides something.

## The kinds, expanded

### G1 and G2: perfect selves
- **What "perfect" means** is set by the source: fastest win, safest win,
  least resources, most style, or the one that keeps the enemy alive.
  Different sources optimize different things.
- **Picking the extra ability (G2)** shows paths you don't have yet: a
  free look at a technique, school or bloodline you could seek.
- **Failure case:** "no perfect line exists" is a real answer. Some
  fights could not have been won; knowing that is valuable too.
- **Against hidden information:** the perfect self knows only what the
  source knows. A clan eye may see hidden rules; a recorder won't.

### G3 and G5: projections
- **Projected self** extrapolates your habits; it can be unflattering ("in
  ten years you are a tired debt-ridden fisherman").
- **Potential self** shows a ceiling; a ceiling reading can be wrong, and
  outliers break it (rule 12).
- Both can motivate goals the player sets themself: a projection as a
  target to beat or avoid.

### G4: alternate selves
- Built from forks in your receipts: the apprenticeship you refused, the
  person you didn't save.
- Can visit as a dream, or meet as a real person in a branch you travel to.
- Life review at death shows several G4s; a regression power might let you
  choose one to aim for.

### G6 and G7: shadow and worst selves
- **Shadow** is everything you refused; **worst** is everything you did,
  amplified. A cruel player's shadow is kind, and that hurts too.
- **Heart-demon trials:** win to gain a stage, a title or peace; lose to
  gain a flaw, a mood, or to let the shadow out.
- **Intensity dial:** abstract (a dark figure), personal (uses real names
  from receipts), raw (your actual worst moments replayed).

### G8 and G9: real selves
See [timelines and divergence](TIMELINES_AND_DIVERGENCE.md#meeting-your-past-self-b3-implementation-proposal).

## More to consider, expanded

### Others use it on you
- **Rival perfect fights.** A rival who replays losing to you learns your
  pattern. Ties to [E8E adaptation](emergent/E8E_ADAPTATION.md): the rival
  steps toward `resistant` against your favorite tactic.
- **Institutions archive you.** A school with a replay room studies your
  famous fights; your techniques "age with history" faster (E8C).
- **Counter-play:** fight differently in public than in private; hide your
  best tricks from recorders; feed false patterns.

### Selves that act in the world
- **Escaped shadows** become rivals ([enemy protagonists](ENEMY_PROTAGONISTS.md)),
  with your skills, your knowledge and your refused choices as goals.
- **Mentor selves:** a projected future self as a voice; useful, opinionated,
  sometimes wrong.
- **Student selves:** teach a past self (B3) and watch it grow differently.
- **Companion echoes:** a shadow you reconciled with becomes a summon, a
  second soul, or a stand-like partner.

### Emotional and social effects
- Losing to your perfect self can inspire, humble or break you (E3 moods).
- **Dependence:** relying on replays can lower your own skill growth
  (a dial), the way a calculator can.
- Others' reactions: a clan that sees you only as your bloodline's ideal;
  friends unsettled by a shadow that wears your face (odd-record reactions).

### Game feel and idle fit
- **Gap reports as coaching.** "Perfect you held the shield until the
  third lunge" is the most useful thing an idle game can tell a player.
- **Speedrun ghosts:** race your best previous run of a trial.
- **One click to watch, never required.** Replays are optional reward
  content; the game stays playable without watching.

### Abuse and cost

Full cross-system treatment: [abuse and limits](ABUSE_AND_LIMITS.md).
- **Priced by the source.** Each source has a price and a frequency
  adjective (once, daily, at will); replaying the same fight usually
  teaches less each time. Low priority overall: Weibao is the only player.
- **Storage:** keep seed, transform and summary; regenerate replays on
  demand. Pinned replays keep their full log.
- **Fairness:** generated replays are seeded and reproducible, so a reload
  never rerolls a better demonstration (rule 9).

### Cross-world
- A perfect-fight cheat may not work in a world whose rules block foresight
  or simulation (rule 2). Or it works and the world reacts to it.
- A bloodline's replay gift carried to another world (rule 5) may show
  ancestors who never fought there and get things wrong.

## Open questions

- Q1: Should the perfect-fight reward exist outside the Crucible world? (Now
  answered in part: it can come from any source; which worlds have which
  sources is each world's call.)
- Q2: Answered 2026-10-10: intensity depends on the world; every level is
  possible. Trials expanded in [trials and tribulations](TRIALS_AND_TRIBULATIONS.md).
