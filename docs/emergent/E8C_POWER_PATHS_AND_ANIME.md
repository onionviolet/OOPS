# E8C. Power paths and anime power systems (proposal)

Claude, 2026-10-10. Weibao: "there might be more? Consider power paths and
more? JJK and other anime worlds? more to consider?"

Companion to [E8 power aspects](E8_POWER_ASPECTS.md) (one idea, ten axes)
and [E8B catalog](E8B_POWER_CATALOG.md) (families, sources, delivery, vows).
This file covers **paths**: how a power grows over a life, and the shapes
that anime and similar sources use for it. Follows the accepted
[rulebook](../RULES_FROM_SCRATCH.md): each world makes its own rules, and
everything here is a default with a dial, not a law. Franchise mechanics are
described in Claude's own words as structure only; per the north star's
[franchise note](../LIFE_SIM_NORTH_STAR.md#comic-anime-game-myth-and-other-worlds-proposal-2026-10-08),
public builds use original names and direct adaptations live in a private
pack.

## What a path is

A path answers: **how does this power get stronger, and what does growing
cost or change?** E8's `growth` axis was one line; a path is the full
structure. A world can have one path, several side by side, or none, and a
person can walk more than one where the world allows.

A path can have these parts (a world may skip some or add its own):

| Part | Question |
|---|---|
| Currency | What fuels it? (qi, mana, XP, cursed energy, faith, fear) |
| Steps | What are the stages, and are they named? |
| Gate | What moves you to the next step? (time, insight, an ingredient, a trial, a kill, a ritual) |
| Risk | What goes wrong at a gate? (madness, a tribulation, a crippled path) |
| Shape | Ladder, tree, web, wheel, stack, or open field |
| Branching | Can you choose, switch, merge or walk two at once? |
| Grader | Who decides your rank? (the world, yourself, an institution, other people) |
| Ceiling | Is there a top, and what is past it? |

## Path shapes

| Shape | How it works | Inspired by | Default and dial |
|---|---|---|---|
| Realm ladder | Named stages, each with a breakthrough and a risk | Cultivation novels | Default: big gates every few stages. Dial: tribulation harshness, number of minor stages |
| Levels and classes | XP to levels; class picks and evolutions | LitRPG, system novels | Default: levels per class. Dial: class changes, multi-class, hidden classes |
| Sequence pathways | Drink a formula to move down a numbered pathway; "digest" it by acting in character; madness if rushed | *Lord of Mysteries* (already in repo research) | Default: 10 steps per pathway, adjacent pathways can swap at set points. Dial: madness rate |
| Institutional grade | Rank given by an organization by tests and deeds, apart from real strength | Sorcerer grades in *Jujutsu Kaisen*, hero licenses | Default: grade lags true power. Dial: corruption, politics, re-grading |
| Release stages | A bonded weapon or spirit opens new forms as the bond deepens | Bleach's sword spirit releases | Default: two or three stages with a conversation as the gate. Dial: spirit's personality and demands |
| Affinity wheel | One home category; efficiency drops for categories further away | Nen's six types (*Hunter x Hunter*) | Default: six categories, 100/80/60 percent rings. Dial: categories and falloff |
| Natures and fusion | Elemental natures; two combined make a rare new one | Chakra natures (*Naruto*) | Default: one or two natures, fusion by bloodline. Dial: learnable fusion |
| Innate gift plus shared toolkit | Each person has one personal technique; everyone can learn the same universal skills on top | *Jujutsu Kaisen* | See the JJK section below |
| Fixed gift, creative mastery | The power doesn't grow much; mastery is finding new uses | Quirks (*My Hero Academia*) | Default: gift fixed at birth, uses unlock by insight. Dial: awakening late in life |
| Stacked inheritance | A power passed down that keeps each holder's gift | One For All (*My Hero Academia*) | Ties to E8 shards and the heir rules |
| Eaten gift | Eat once, gain a strong power and a weakness | Devil fruits (*One Piece*) | Default: one per person. Dial: some bodies hold two at a cost |
| Universal trio | Three trainable arts anyone may learn: sense, harden, overwhelm | Haki (*One Piece*) | Default: rare masters, slow training. Dial: which worlds have it |
| Manifested spirit | A visible spirit with its own stats, range-versus-power trade, and shared damage | Stands (*JoJo*) | Default: letter-grade stats, close spirits strong, far ones weak |
| Schools and styles | Lineages of technique with derived styles and secret forms | Breathing styles (*Demon Slayer*) | Default: a master teaches a style; students derive new ones |
| Fear-powered contracts | Beings as strong as the fear of their concept; contracts paid in body or years | Devils (*Chainsaw Man*) | Default: power tracks world fear facts (E6). Dial: contract prices |
| Exchange craft | Understand, break down, rebuild; equal value; a taboo with a terrible toll | Alchemy (*Fullmetal Alchemist*) | Ties to E4B transmutation and substitution |
| Accumulated study | Magic as knowledge built over a long life; spells become common over centuries | *Frieren* | See "powers age with history" below |
| Emotional overflow | Power held back until a feeling reaches 100 percent | *Mob Psycho 100* | Default: a meter per emotion. Dial: what happens past 100 |
| Lone system | One person gets a game interface nobody else has | *Solo Leveling* | Identity mode D, or a cheat |
| Raise the fallen | Enemies you defeat become your followers | Shadow extraction (*Solo Leveling*) | E3 spawned followers with traits from the fallen |
| Eat and analyze | Absorb things, study them, gain their abilities | Predator skill (*Tensura*) | E8B consumption plus E7 study |
| Naming evolves | Giving a monster a name evolves it, at a cost to the namer | *Tensura* | E7 true names; a price in the namer's energy |
| Legend spirits | Heroes return as spirits whose powers come from their legends | Servants (*Fate*) | E6 legends become power (fame immortality) |
| Return by death | Die and wake at a moving save point; can't tell anyone | *Re:Zero* | E1 branch with a gag rule |

## The JJK shape, in detail

Worth a closer look because it splits power into clean layers that fit our
engine. In our words:

| Layer | What it is | Our form |
|---|---|---|
| Fuel | Energy from negative emotion | A currency that grows with E3 moods like `angry`, `grieving`, `afraid` |
| Innate technique | One personal power per person, born with it | E8 power rolled per person (variant generator) |
| Reinforcement | Pour energy into the body or a tool | Universal technique, everyone can learn |
| Barriers | Raise a zone with conditions | Place rule layer with a cost (E4) |
| Domain | A zone where your technique always hits, a fight inside your rules | A personal place layer that overrides others while it lasts |
| Domain counters | Simpler zones that blunt a domain; clash of domains by refinement | Rule priority contests |
| Reversal | Turn the fuel positive to heal; or reverse your technique's effect | A second, harder mastery of the same power |
| Binding vows | Accept a limit or reveal your technique to gain strength | E8B vows; "explaining your power to the enemy" as a real buff |
| Perfect timing crit | A rare perfect hit that also lifts your state for a while | A timing event that raises a hidden stat temporarily |
| Born from fear | Curses spawn from human fear and grow with it | E5 world events driven by E6 fear facts; monsters from the world's mood |
| Grades | Institution ranks for people and curses | Institutional grade path |

The reusable lesson: **a personal gift plus a shared toolkit plus
conditions.** Everyone has something unique, everyone can learn the
universal layer, and vows and information turn the fight into a puzzle.

Expanded 2026-10-10 into a full world brief with domains, busted
techniques, subtle features and placement (book world, Frontier echoes,
Proving Ground): [JJK world brief](../worlds/jujutsu/WORLD_BRIEF.md).
Mahoraga's adaptation became a generic primitive: [E8E](E8E_ADAPTATION.md).

## More to consider

### Paths meeting each other
- **Two paths at once.** A cultivator who also has a system class.
  Default: allowed, with a conflict or synergy rule per pair. Dial: some
  worlds forbid mixing; a cheat can reconcile.
- **Switching paths** mid-life, keeping some progress. Default: partial
  carry by how related the paths are.
- **Path translation across worlds** follows the rulebook's per-edge carry
  and the [verse equalization](../CHEAT_COSMOLOGY.md#verse-equalization-converting-between-systems)
  dial: a realm in one world may read as a grade, a level or nothing in
  another.

### Information is power
- **Revealing your power** can strengthen it (a vow) or doom you (a
  counter). Observation (E7) and secrecy become core play.
- **Power reading** by others: letter grades, scouters, sense, gossip.
- **False reputations**: being graded too high or too low has consequences.

### Society around power
- **Registration and licenses**: who may use powers legally, and what
  happens to unlicensed users (E3 law tags).
- **Schools, sects and lineages** as path owners; teaching as a source of
  power for the teacher (E8B leadership).
- **Markets for power**: formulas, fruits, shards, contracts, sold or
  stolen.
- **Collateral**: powerful fights wreck places; places remember (E7 lore).

### Powers age with history
In a long life, the world's power changes too:
- **Devaluation**: a once-legendary spell becomes common after a century
  as people study it (the *Frieren* idea). Its old users look different in
  hindsight.
- **Counters spread**: once a technique is famous, defenses against it
  spread.
- **Fear and faith drift**: a feared concept weakens as people stop fearing
  it; a forgotten god fades.
- **Lost arts**: a style with no students dies, survives as a legend, and
  can be rebuilt from records (heir rules).

### Power ecosystems
- Each world's powers form a rock-paper-scissors web, by design or by
  accident. The variant generator (E8B) can check that counters exist.
- **Monsters from the world's mood** (fear, grief, greed) give each world
  its own threats from its own history.

### Personal growth flavors
- Growth by **understanding** (insight, epiphany), by **repetition**
  (vanilla skills), by **danger** (near-death gains), by **emotion**
  (overflow), by **resources** (pills, formulas), by **people** (bonds,
  followers, teachers), by **deeds** (titles, merit), by **sacrifice**.
  Default: each path names its favored flavors; others work at a lower
  rate.

## Survey fold-in: paths (2026-10-10)

From [A](../research/power-systems/anime-manga/REPORT.md), [B](../research/power-systems/web-fiction/REPORT.md), [C](../research/power-systems/western/REPORT.md). Proposals; codes point to survey rows.

- **Grades are response policies (C M13; A).** An institution's grade says
  what to do about you, based on its evidence and purpose. Two institutions
  can grade the same power differently, and neither changes the power.
  Store grader, purpose, evidence, date and recommended response apart from
  real strength.
- **Digest versus practice (B P1.04).** Acting your role assimilates a
  gift; practicing technique improves execution. A person can be strong in
  one and weak in the other.
- **Foundations use their weakest part (B P1.06).** A breakthrough built on
  a cheap ingredient caps you later; the preview shows where the ceiling
  comes from.
- **Reservoirs (C M4, M5).** Capacity, balance, quality and refill are
  separate. A store pays out what you put in; an outside amplifier
  multiplies output while spending its own fuel.
- **Facet fusion beside rank (B P1.07).** Two people of equal rank solve
  different problems because they fused different facets.
- **Counters become public (A P8).** Research makes an old threat ordinary;
  matches E8C "powers age with history."
- **Legacies have a voice (B P1.05).** Coexist with an inherited will or
  absorb it; the choice changes control and relationship.
- **Simulations retain what their rules say (B P1.15).** A paid simulated
  run lets you keep knowledge, method or growth under that system's policy;
  seeing an outcome isn't automatically prophecy.
- **Group blessings split (B P1.13).** A fixed blessing shared with more
  recipients spreads thinner.
- **Parallel study (A P14).** Clones learn in parallel and return divided
  energy and fatigue, with no free duplicate work.
- **Escape reserves (A P7).** Survival gear (an emergency recall) uses up
  part of a build's budget and has a range.
- **Trade becomes concept (B P1.12).** Real debts and work history can open
  a narrow new method.

## Wiki fold-in (2026-10-10)

From [lane W](../research/power-systems/wiki-digests/NEW_MECHANICS.md). Proposals:
- **Merged paths need routing (M4).** When two paths fuse, say which
  everyday activities now advance which part.
- **Collective trials (M8).** Some gates admit you after a group trial, a
  collective judgment, or knowledge the trial keeps secret.
- **Joint techniques can go solo (M9).** A move learned with a partner may
  later work alone, or not; record who contributed.
- **Jokes can bank (M11).** In a gag-friendly world, completed pranks can
  store a local credit spent on other effects.

## Hooks into our layers

| Need | Layer |
|---|---|
| Path stages, gates, ranks | New path record per person; vanilla skills as the base |
| Currencies from moods and fear | E3 moods, E6 fear and faith facts |
| Domains, barriers, vows | E4 place and personal rule layers |
| Return by death, save points | E1 branch modes |
| Legends to power | E6 legends |
| Followers from the fallen | E3 spawn and brains |
| Grades by institutions | E3 factions and law |
| Monsters from mood | E5 cards weighted by world facts |

## Vocabulary additions

Entity kind `path` with fields `currency`, `steps`, `gate`, `risk`,
`shape` (`ladder`, `tree`, `web`, `wheel`, `stack`, `field`), `branching`,
`grader`, `ceiling`; tags `domain`, `barrier`, `licensed`, `graded`;
currencies `qi`, `mana`, `cursed`, `faith`, `fear`, `xp`.
