# E8. One idea, many forms: power types, aspects, shards (proposal)

Claude, 2026-10-10. Weibao: "Types of observe skills and more? Just like types
of future sight? aspects of the same idea? Like aspects of a certain law or
more? shards of abilities? types of immortality? subtle stuff like these?"

Builds on the north star's
[one skill, many Daos, and tiers of concepts](../LIFE_SIM_NORTH_STAR.md#one-skill-many-daos-and-tiers-of-concepts-2026-10-08),
[E7 observation](E7_OBSERVATION_AND_MYSTERY.md), [E1 stream access](E1_SEEDED_STREAMS.md)
and [E4 rule layers](E4_TAGS_AND_RULES.md). The Codex lane
[ttks-novels-2026-10-10](../gm/dispatch/ttks-novels-2026-10-10/ASSIGNMENT.md)
is reading four web novels Weibao named for this lens; its findings fold in
here. Everything is a proposal under
[everything is possible, reasonably](../USER_VISION.md#anything-is-possible-2026-10-09).

## The core model

A power is **an idea plus a position on a few axes**. "Future sight" is the
idea; what makes one seer different from another is where they sit on each
axis. Two powers with the same idea and different axes play differently,
and that is where the subtle stuff lives.

| Axis | Question | Example values |
|---|---|---|
| Object | What does it act on? | Self, a person, an item, a place, a stream, a rule |
| Mechanism | How does it work? | Sense, knowledge, vision, record, rewrite |
| Trigger | When does it fire? | At will, on danger, in sleep, on death, on touch |
| Certainty | How reliable? | Exact, likely, a branch among many, a riddle |
| Scope | How much, how far? | One second, one fight, a life; arm's reach, a city |
| Price | What does it cost? | Time, health, sanity, years of life, luck, memories |
| Limit | What stops it? | A counter-power, a material, a law, its own rules |
| Visibility | Who can tell? | Hidden, felt by sensitives, obvious to all |
| Persistence | What carries over? | This body, the soul, the bloodline, nothing |
| Growth | How does it change? | Use, insight, fusion, a stage ladder, a price paid |

Data shape:

```js
{ id: 'power:spawn:...', idea: 'foresight',
  aspects: { object: 'stream:encounter', mechanism: 'vision', trigger: 'on_danger',
             certainty: 'likely', scope: 'one_fight', price: 'stamina:10',
             limit: ['fateless', 'tag:void'], visibility: 'hidden', persistence: 'soul' },
  tags: ['foresight', 'danger_sense'], stage: 1 }
```

Aspects are tags on the power entity (E4), so counters are ordinary rules: a
`fateless` person can't be seen by any `foresight` whose object is a stream.

## Aspects of a law

A law is a family of facets. Each facet is usable alone; together they make
the law. This refines the north star's concept tiers (concept under law).

| Law | Facets |
|---|---|
| Fire | Heat, light, consumption, spread, purification, change of form, the hearth (warmth, home), ash and rebirth |
| Water | Flow, pressure, reflection, depth, dissolving, patience, the tide (cycles), the mirror (what water shows) |
| Time | Pace, decay, memory, foresight, return, stillness, order of events, age |
| Separation | Severance, distance, ending, boundary, refusal, the gap between moments |
| Life | Growth, healing, hunger, birth, kinship, persistence, the swarm |
| Fate | Luck, destiny, coincidence, debt, the thread (links between people), the omen |

Rules:
- **Facets are learned separately**, through different life paths. A
  firefighter, a cook and a pyromancer reach different facets of Fire.
- **Facets combine.** Heat plus spread gives wildfire; hearth plus
  purification gives a home no curse can enter.
- **Facets can conflict** inside one person (consumption versus hearth) and
  need a higher facet or a price to hold together.
- **Holding most facets is grasping the law**, which opens the facets you
  never trained at a lower strength.
- **Worlds stress different facets.** One world's Fire is mostly
  purification (holy flame); another's is consumption (hungry fire).

## Shards

A shard is **a piece of a larger power**, usually one facet at reduced
strength, with a bit of the whole's will.

- **Where shards come from:** a broken artifact, a dead god, a scattered
  inheritance, a power split among heirs, a world that shattered, a cheat
  that dispenses pieces.
- **Collecting** shards of the same whole climbs toward it. Each new shard
  adds a facet or strength, and the shards start to talk to each other.
- **Fusing** shards from different wholes makes something new (the north
  star's sideways fusion), sometimes unstable.
- **Shards have will.** They push their holder toward the whole's goals,
  pull toward other shards, and can reject a holder.
- **Shards move:** stolen, traded, inherited on death, lost in another
  world. Rivals collecting the same set is a ready-made story.
- **Shard holders sense each other**, at a range that grows as the set
  completes.

## Catalog: kinds of observation

Extends E7's senses with what is observed.

| Kind | Sees | Subtle variant |
|---|---|---|
| Sensory | What the senses can reach | Night sight sees in dark but not through walls |
| Identify | What a thing is, its tags | Names only versus full tags versus grade |
| Relational | Bonds, debts, loyalties between people | Sees links but not why |
| Causal | Why something happened (the chain log) | Only chains you were part of |
| Past | What happened here or to this thing | Only violent memories; only the last owner |
| Odds | The chance of an outcome | Shows a number, but not what changes it |
| Intent | What someone plans or wants | Sees the goal, not the method |
| Rule | Which rules apply here (E4 layers) | Personal rules of others stay hidden |
| Self | Your own hidden stats and body | Shows a constitution nobody told you about |
| Survey | Everything at once, shallowly | Wide but easily fooled |

## Catalog: kinds of future sight

Future sight fits the engine directly: it is **access to future draws of
specific streams** (E1). That makes each type honest and checkable.

| Kind | What it does | Engine form | Breaks when |
|---|---|---|---|
| Danger sense | A warning before harm | See next `encounter` or rule result, as a feeling | Harm from a `fateless` source, or from your own choice |
| Combat precognition | Next few seconds of a fight | See the `encounter:<id>` stream a few draws ahead | Opponents with their own foresight; chaos (K2) |
| Odds sight | Chances as numbers | Show weights, not draws | Hidden tags change the weights |
| Branch viewing | Several possible outcomes of a choice | Preview with E1 `branch` in fork mode | Too many branches cost sanity |
| Fixed prophecy | One outcome that will happen | E1 `pin` on a fate stream | Another fate contests it (E5) |
| Death sight | When and how someone dies | See far ahead on a person's fate stream | Death changes if they learn of it, or not, per world |
| Riddle oracle | True but cryptic | E6 grammar renders a real future fact as a riddle | Misreading is the player's problem |
| Dream sight | Glimpses in sleep | Random sample of future cards, during Sleeping | Can't choose what you see |
| Others' futures | Another person's next choice | See `people:<id>` stream | Strong-willed people, other seers |
| Seen futures change | Seeing collapses it | K3 future: fixed on first sight | That's the point |

Subtle variants come from the axes: a danger sense that works only for
others, a prophecy that is certain but has no date, a branch view that shows
only the worst branch.

## Catalog: kinds of immortality

The question for each: **what persists, what kills it, what it costs.**

| Kind | What persists | Killed by | Price |
|---|---|---|---|
| Ageless | The body, but only from age | Anything else | Watching others die (E3 grief) |
| Regeneration | The body heals anything | Total destruction, a specific material | Hunger, pain, slow madness |
| Anchor revival | Returns at a fixed point (shrine, phylactery) | Destroying the anchor | Anchor is a target; time lost |
| Daily revival | Returns after a delay, adapted (north star *A Novel Concept* notes) | Soul wear; a damaged blueprint | Exposure, time |
| Reincarnation | The soul, in a new life (B mode) | Soul destruction | Memory loss per carryover rules |
| Regression | Loops back in time with memory | Breaking the loop's condition | Others don't remember; loop wear |
| Backup | A copy restored from a record | Destroying all copies | Is the copy you? |
| Possession | Takes another body | Exorcism, a stronger will | A victim each time |
| Lineage | Lives on through heirs' bodies or memories | The line ending | Heirs' freedom |
| Legend | Exists while remembered (E6 legends) | Being forgotten | Must stay famous |
| Ascension | Becomes a concept or law | Another being taking the seat | Losing personhood |
| Undeath | The body without life | Holy, fire, the rules of that world | Lost needs, lost warmth |
| Stasis | Frozen outside time | Being woken wrong | The world moves on |
| Swarm | Spread across many bodies | Killing all of them at once | A divided self |

Under "everything is possible, reasonably", each kind needs its price and
its kill condition, and enemies can have any of them. A rival with anchor
revival makes a quest out of finding the anchor.

## More families worth the same treatment

Each idea below splits along the same axes; the
[ttks lane](../gm/dispatch/ttks-novels-2026-10-10/ASSIGNMENT.md) and later
reading will add real examples.

- **Luck:** passive bias, stored luck spent later, luck stolen from others,
  luck that balances (good now, bad later), luck only in one domain.
- **Copying:** see once, study to learn, copy by killing, copy one at a
  time, copies weaker than the original, copies that drift into your own.
- **Space:** short blink, marked points, swapping places, folding rooms,
  storage spaces, distance that lies.
- **Healing:** speed up, rewind a wound, transfer it to someone else,
  heal by cost to the healer, heal only what you understand.
- **Summoning:** contract, call by name, borrowed from another world,
  summons with their own lives (E3).
- **Mind:** read surface thoughts, read memories, suggest, possess, link
  minds, hide your own.
- **Inheritance** (B4's idea): from whom (a master, a dead race, all of
  humanity), what (skills, memories, will, debts), how it is chosen, and
  what the dead still want from you.

## Variants for everyone: generated powers

With axes as data, the game can **roll unique variants** for NPCs, rivals
and enemy protagonists: pick an idea from the world's table (E6), then
sample axes within the world's rules. Every rival's foresight is different,
and observation (E7) is how you learn its axes and its limits. A power that
matches nothing in the catalogs is fine; it is just a new point in the
space.

## Growth: powers shift along axes

Powers move along axes as they are used, matching the "skill is a doorway"
idea:
- Use one way enough and that axis deepens (a danger sense used to protect
  others starts to work for others).
- A price paid can unlock an axis (spend years of life for certainty).
- Insight moves mechanism up the tiers (sense to knowledge to rewrite).
- Fusion with another power or shard adds axes.
- Worlds can force a shift: arriving in a world without fate turns odds
  sight into a blur.

## Showing it

Keywords on hover (the north star's Path of Achra idea): "foresight ·
on danger · likely · costs stamina · blind to the fateless." Unknown axes
show as "?" until observed or tested. A Notebook entry per power, yours or
someone else's, lists what you know of each axis.

## Smallest proof

Village: Observe with three kinds (sensory, identify, intent), one danger
sense as See on the `encounter` stream, one NPC with a rolled variant of the
same danger sense but a different limit. Test: the two danger senses behave
differently in the same fight, and the log explains why.

## Survey fold-in: keep a power's parts apart (2026-10-10)

From the three power-system surveys ([A](../research/power-systems/anime-manga/REPORT.md), [B](../research/power-systems/web-fiction/REPORT.md), [C](../research/power-systems/western/REPORT.md)). Their shared lesson: a power
is several parts that can be owned, moved, lost and graded separately. All
proposals; codes point to the survey rows.

**The six means (B P1.01).** In many worlds a power splits into these parts (others fuse some of them, or have parts of their own):

| Part | Question | Example of it moving alone |
|---|---|---|
| Fuel | What runs it? | Out of qi, technique intact |
| Vessel | What holds it, and how much stress it takes? | A body that stores much but breaks easily (B P1.08: capacity is not tolerance) |
| Mastery | How well can you execute it? | A returned master who knows the move but lacks the body (B P1.11) |
| Source | Where did it come from, and who has custody? | A gift you carry but haven't digested (B P1.04) |
| Permission | Who authorizes its use? | A patron's service cut off while native senses still work (B P1.09) |
| Apparent grade | What others think it is? | A low reading in one suit, strong in another body (A P9) |

**Carriers (A P4, P5; C M10).** Power, mind, host body and container are
separate carriers: move a mind into a doll without moving its power. An
item can be **owned, known, equipped and activated** as four states, and a
stolen item can stay bound to its living owner (custody is not
credential).

**Copies keep the maker's meaning (A P2).** A copied or stolen power carries
its original conditions, so a thief gets the rules along with the effect.

**Interpretation can grow (A P3).** Insight can widen what a concept is
allowed to target, one permitted step at a time.

**Borrowed energy carries feeling (A P13).** Absorbed or shared power can
bring the sender's mood with it (E3).

**Counters match mechanism (B P1.14; C M12).** A mind ward stops mental
illusion but not real sound; silence blocks spoken casting but not a
permitted written version. Record a technique's `expression_medium` and
what it actually does, not only its tags.

**Tags aren't enough for composition (C M6).** A part may share tags with a
technique and still not be able to modify it; composition needs a typed
contract of what each part can change.

**Paid costs can feed other rules (C M7)**, once: a spent cost is an event
with a receipt, so legal combos chain and replay exploits don't.

## Wiki fold-in (2026-10-10)

From [lane W](../research/power-systems/wiki-digests/NEW_MECHANICS.md), which read two wikis (The Wandering Inn, Path of Exile) with
revision evidence; the rest await dumps. Proposals, as ways things can go:
- **Change before notice (M3).** A power can change before anyone,
  including its holder, is told; keep the change time, the notice time and
  who heard apart.
- **Carrier and payloads (M6).** One item or slot can carry several unlike
  effects; its label isn't what each effect does.
- **Reserved versus spent (M7).** Some powers lock part of a resource while
  active instead of draining it; maximum, reserved and spendable are
  separate.
- **Growth can outgrow its host (M13).** A tool or technique that improves
  may stop being usable by its current holder.
- **Leakage near artifacts (M1, M12).** In some worlds, active powerful
  items leak and interfere with each other by proximity; monsters may
  guard treasure that keeps them strong.

## Vocabulary additions

Entity field `idea`; aspect axes `object`, `mechanism`, `trigger`,
`certainty`, `scope`, `price`, `limit`, `visibility`, `persistence`,
`growth`; tags `foresight`, `danger_sense`, `shard`, `immortal`; facets as
`facet:<law>.<name>` (for example `facet:fire.hearth`); shard sets as
`shardset:<id>`.
