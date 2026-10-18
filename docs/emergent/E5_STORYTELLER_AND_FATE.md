# E5 Storyteller and fate: build-ready draft (proposal)

Claude, 2026-10-09. Expands layer E5 and "Storyteller instances and fate (Q4)"
of [Emergent systems](../EMERGENT_SYSTEMS.md). Names follow the
[shared vocabulary](SHARED_VOCABULARY.md). Principle:
[anything is possible](../USER_VISION.md#anything-is-possible-2026-10-09).

**Everything below is a proposal.** Nothing is selected for a build. Numbers are
starting guesses to be tuned in play. Section 1 lists verified source facts with
file and line. Every other section is design, labelled as such.

Reference only (my own knowledge, not checked against current RimWorld files):
RimWorld storytellers pick incident types by a threat budget that grows with
colony wealth and size, then pace them with a "wave" curve. Cassandra rises
steadily, Phoebe gives long rests between hits, Randy rolls with no pacing.
Adaptation (fewer raids after a bad stretch) is a separate system. This draft
borrows the shape, not the numbers.

---

## 1. Verified source facts (2026-10-09)

| # | Fact | Where |
|---|---|---|
| V1 | Each automatic event has its own check `{due, interval, rng: hash(seed, id), count}`. Events roll alone. There is no deck or director. | `src/simulation.js:64` |
| V2 | The check xorshift32 `draw(check)` advances that check's own state. | `src/simulation.js:34` |
| V3 | A due check requires: actor alive, `maxOccurrences` not reached, `requires` met, no open event of the same definition for that actor. | `src/simulation.js:484-490` |
| V4 | `chance` is resolved from facts and must be 0 to 1 (asserted). `guaranteeAfter` forces a hit when `misses + 1 >= guaranteeAfter`. `misses`, `attempts`, `occurrences` are facts. | `src/simulation.js:484-495` |
| V5 | The roll is drawn on every attempt that passes `requires`, hit or miss. So a stream's position depends on attempt count, not on hits. | `src/simulation.js:491-493` |
| V6 | An `occur()` creates an event with mode `ambient` (resolved at once) or `decision` (open), optional `lifetime`, `onExpire`, and a stored `roll`. Only `public` events write to the log. Closed events are pruned past 100. | `src/simulation.js:383-397` |
| V7 | Event checks are simulation boundaries: `nextSimulationBoundary` takes the minimum `due` of jobs, checks, controllers, events, conditions and life policies. The scheduler visits them in due order. | `src/simulation.js:440-447` |
| V8 | Controllers run each NPC on an interval and take the highest-priority eligible action. | `src/simulation.js:510-525` |
| V9 | Source states the simulation advances only on played game time. I found no idle, offline or real-time signal in `simulation*.js` or `chronicle.js`. | `src/simulation.js:67` |
| V10 | Game time is in minutes. `GAME_YEAR = 360*24*60`. | `src/chronicle.js:3`, `src/life_experience.js:2` |
| V11 | The chronicle life starts at `initialAge: 18`, `lifespan: 80`, mode `mortal` or `open`. Validation allows `initialAge >= 0`. | `src/chronicle.js:75`, `:16` |
| V12 | `lifeStage` returns only `youth` (under 25), `adult` (under 65), `elder`. Age comes from the chronicle clock. There is no `child` stage. | `src/life_experience.js:8-9` |
| V13 | `ageYears(c, clock)` gives age at any clock. A mortal life ends at `lifespanDeadline`. The last game year before it fires a "seasons feel shorter" note. | `src/chronicle.js:87`, `:97`, `:111-113` |
| V14 | `event_feed.js` is read-only news: "No rolls, rewards, enrollment or save fields." | `src/event_feed.js:2` |
| V15 | Vanilla character creation picks race, height, age, gender. (From the north star; I did not re-open `character_creation.js`.) | `docs/LIFE_SIM_NORTH_STAR.md:2290` |

### Conflicts with docs/EMERGENT_SYSTEMS.md

- **C1.** The doc's E5 life stages are "child, young adult, middle life, old age,
  later lives". The code has three (V12): `youth`, `adult`, `elder`, and a run
  starts at age 18 (V11). Section 8 adds a finer director stage derived from
  `ageYears` and keeps the three code names as parents.
- **C2.** The doc says per-event checks are "already E1's stream idea". True for
  isolation, but V5 means attempts, not outcomes, advance a stream. A director
  that skips a due check changes later rolls. The director must still consume
  the draw (section 9, rule R7).
- **C3.** The doc lists `Hard` and `Crisis` urgency tiers as if events had them.
  Source events have only `ambient` and `decision` (V6). Tiers are new.
- **C4.** The doc's idle signals ("idle for 8 hours") have no source support (V9).
  Section 9 says how to record one so replay still works.

---

## 2. Job and shape (proposal)

By default the director decides **when and how often**, not **what**. It
outputs one multiplier per card tag. It doesn't write events or touch
effects. A fate or world storyteller instance may inject events as a dial.

Per deck tick (proposal):

1. Collect eligible cards (`needs` met, cast fillable, off cooldown).
2. Compute each card's final multiplier `M(card)` from section 5.
3. Weight `w = base(facts) * M`. Apply repeat damping (section 6).
4. Fire chance for the whole deck: `rate = deck.baseRate * tempo` (section 3).
   Roll once on stream `deck:<deckId>`. On a miss, nothing happens.
5. On a hit, draw one card by `w` from the same stream.
6. Write a receipt (section 6, R9).

Adapter for existing events (build step 0, proposal): add facts
`director.mult.<cardTag>` so today's independent checks can read a multiplier
inside their `chance` expression. The result must be clamped to 0..1 because of
V4. This gives pacing before any deck exists.

---

## 3. Tension and comfort (proposal)

Each storyteller instance keeps its own `tension` and `comfort` (0 to 100), as
in the vocabulary. A world instance counts world events, a place instance counts
events in that place, a fate instance counts events cast on its owner.

### 3.1 Tension T

`T = min(100, recent + state)`

**recent** is a decayed sum of impacts of resolved cards:

`recent = sum( impact_i * 0.5 ^ (age_i / halfLife) )`

- `age_i` is game minutes since the card resolved (V10).
- `halfLife` default 3 game days (4320 minutes). Gentle 2 days, Wild 5 days.
- `impact` comes from the card's outcome, not its text. Defaults:

| Outcome fact | Impact |
|---|---|
| Vital damage taken, per 10% of max health | 6 |
| Item or money lost, per 10% of net worth | 4 |
| Person lost (death, leaving) with relationship `friend` or `family` | 25 |
| Person lost, other | 8 |
| Card tagged `threat`, resolved with no loss | 5 |
| Card tagged `lethal`, survived | 30 |
| A `grudge` or `rival` relationship created | 6 |
| Card tagged `recovery` resolved | -10 (floor 0 on `recent`) |

Impacts live as facts the card's own effects can already express (vital,
resource, relationship, event effects are all in the existing vocabulary), so
the director reads results from the chronicle, not from a new log.

**state** is current pressure, from existing facts:

`state = 25*(1 - hp/maxHp) + 10*min(3, openThreats) + 15*[sick or injured or wanted] + 10*[debt > 30 days of upkeep]`

### 3.2 Comfort C

`C = 0.30*safety + 0.25*wealth + 0.20*food + 0.25*quiet`

- `safety = 100 - state` (so safety reflects current danger, not past hits).
- `wealth = 100 * money / (money + 30*dailyUpkeep)`. Upkeep is a world value
  (`world.upkeep`). A broke character scores 0; 30 days of cash scores 50.
- `food = 100 * hunger fraction` (the existing vital, `1 = fed`).
- `quiet = 100 * min(1, daysSinceLastNonDailyCard / 7)`.

### 3.3 Pressure P and tempo

`P = (C - T) / 100`, from -1 (crushed) to +1 (safe and bored).

- `P > 0`: the instance may add trouble. `P < 0`: it eases and offers help.
- `tempo = clamp(1 + swing * 0.5 * P, 0.3, 1.6)` scales the deck's fire rate,
  so long calm raises event frequency and a bad stretch lowers it.

### 3.4 Per-tag response

Each card tag has a **slope** (how strongly it follows P):

| Tag | Slope | Reads as |
|---|---|---|
| `threat`, `crime`, `lethal` | +1.0 | more when calm |
| `opportunity`, `money`, `romance` | -0.5 | more when struggling |
| `rare` | -0.3 | slight pity |
| `recovery` | -1.0 | most when crushed |
| `daily`, `people`, `family`, `callback`, `learning`, `legacy` | 0 | pacing neutral |

---

## 4. Personalities (proposal)

A personality is a row of base multipliers per card tag plus a `swing` (how hard
it follows P), a `halfLife`, and fairness settings. The per-instance multiplier:

`m(tag) = base[p][tag] * clamp(1 + swing[p] * slope[tag] * P, 0.2, 2.5)`

### 4.1 Base table

| Personality | daily | people | family | opportunity | threat | lethal | rare | callback | recovery | swing |
|---|---|---|---|---|---|---|---|---|---|---|
| Steady | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 0.6 | 1.0 | 1.0 | 1.0 | 0.5 |
| Wild | 0.8 | 1.0 | 0.8 | 1.2 | 1.6 | 1.5 | 2.5 | 1.0 | 0.7 | 1.2 |
| Gentle | 1.3 | 1.3 | 1.3 | 1.1 | 0.4 | 0.1 | 0.8 | 1.0 | 1.5 | 0.4 |
| Fated | 0.8 | 1.2 | 1.0 | 1.6 | 1.3 | 0.9 | 3.0 | 1.6 | 0.8 | 0.8 |
| Adaptive | 1.0 | 1.0 | 1.0 | 1.0 | see below | 0.8 | 1.0 | 1.0 | 1.0 | 0.8 |
| Tidal | 1.0 | 1.0 | 1.0 | 1.0 | wave | 0.8 | 1.0 | 1.0 | 1.0 | 0.9 |
| Pure Chance | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 0.0 |

- **Steady** (RimWorld Cassandra analog): smooth curve, few spikes.
- **Wild** (Randy analog, but still paced by P): big swings, many rares.
- **Gentle** (Phoebe analog): life-sim first, rare lethal cards, long rests.
  `halfLife` 2 days, so it forgives fast.
- **Fated:** pulls drama toward its owner: more opportunities, more rares, more
  callbacks, and still a real threat weight. Used mainly as a fate instance
  (section 7) but a player may also pick it as a table style.
- **Adaptive:** threat cards carry a `tier` 1 to 5. Define a player `power`
  score from level, gear tags and followers. Cards at `tier == band(power)` get
  x1.4, one tier below x0.5, two or more below x0.15, one above x1.1, two or
  more above x0 unless the deck is marked `ambush`. Lore answer to "why would
  the world scale up": a hunting heaven, a rival, an arms race.
- **Tidal:** a deterministic wave from the clock, no random draw:
  `w = sin(2*pi * dayOfYear / seasonLength)`. `threat * (1 + 0.8w)`,
  `opportunity * (1 - 0.4w)`. Good for harvest and winter worlds, exam seasons,
  war campaigns.
- **Pure Chance:** swing 0, all ones. It makes no pacing choices. Fairness drops
  to `light` by default (section 6).

Personalities are data. A world, cheat or player can define more rows.

### 4.2 Table dial and where the player picks (proposal)

Three player-facing controls, each reachable, none forced:

1. **World default** (default choice): the world's own instance runs. The
   character screen shows its name and one line ("Village: Gentle").
2. **Table dial**: a global scale on the `threat`, `lethal` and `crime` tags,
   0.25 to 2.0 (labels Easier, Standard, Harsher, Brutal). It is a setting on the
   save (`storyteller.table`), not an instance.
3. **Replace the world's storyteller**: the player names a personality for their
   own life. It replaces the world instance only, not the world's rule layer
   (physics, lore guards). A mix is allowed: "world default, plus Fated".

**Where:** a "Storyteller" step on the character creation screen (V15 says
creation already has race, height, age and gender steps), plus a settings pane.
Changing mid-life is allowed and logged. A `lock` option for ironman-style lives
stores the choice and refuses later changes. A cheat, constitution or world
event can also change any of these three, and the log says so.

---

## 5. Instances and how they stack (proposal)

### 5.1 Scopes

| Scope | Owner | Counts | Typical life |
|---|---|---|---|
| `world` | a world | world events | always on in that world |
| `place` | a place (dungeon, city, sect, ship) | events in the place | while the actor is inside |
| `person` | a person (this is **fate**) | events cast on the owner | with the owner, across worlds |

A world has one. A place has zero or one. A person has zero or one fate. Most
people are `fateless` (a vocabulary tag).

### 5.2 Applicability

- `world` applies to every card drawn in that world.
- `place` applies when the card's primary location is inside the place.
- `person` applies only to cards where the owner fills the **primary cast role**
  (the card's `who`, or the role named in `card.fateTarget`). A fate pulls cards
  to its owner. It does not bend unrelated cards.

### 5.3 Stacking rule

For each card and each tag the card carries (take the **max** multiplier across
the card's tags, so a `threat+lethal` card uses the larger swing):

1. List applicable instances with their `m(tag)` from section 4.
2. Instances may carry an **op** on a tag: `mul` (default), `set`, `cap`, `floor`,
   `veto`.
3. **Priority:** person 3 > place 2 > world 1. A `set` replaces the multipliers
   of all **lower-priority** instances for that tag. Higher-priority instances
   still multiply on top.
4. `veto` sets the card weight to 0 for that tag. A `veto` in a world is a lore
   guard (no guns). A `veto` in a person's fate is "this fate never dies young".
5. Then multiply by the **stage factor** (section 8) and the **table dial**
   (section 4.2).
6. Clamp `M` to `[0.05, 5.0]`. Apply `cap` and `floor` ops last.

`M = clamp( stage * table * product_of_surviving_instance_multipliers )`.

### 5.4 Worked numeric example

Setup: adult stage (factor 1.0), table dial Standard (1.0).

- World: Village, **Gentle**, `P_w = +0.5` (calm, comfortable).
- Place: Old Mine, **Wild**, `P_p = 0`.
- Fate: the player has **Fated**, `P_f = +0.25`.

Card A, tag `threat`, base weight 4 ("wolves on the mine road"):

| Instance | Calculation | m |
|---|---|---|
| World Gentle | 0.4 * (1 + 0.4 * 1.0 * 0.5) = 0.4 * 1.20 | 0.480 |
| Place Wild | 1.6 * (1 + 1.2 * 1.0 * 0) | 1.600 |
| Fate Fated | 1.3 * (1 + 0.8 * 1.0 * 0.25) = 1.3 * 1.20 | 1.560 |

`M = 0.480 * 1.600 * 1.560 = 1.198`, weight `4 * 1.198 = 4.79`.

**Override variant 1.** The mine has a warding stone: place op `set threat 0.5`.
The world multiplier (priority 1) is ignored. Fate (priority 3) still
multiplies: `0.5 * 1.560 = 0.78`, weight 3.12.

**Override variant 2.** The player is a cursed bloodline: fate op
`set threat 2.0`. Fate has top priority, so it replaces both lower ones:
`M = 2.0`, weight 8.0.

Card B, tag `rare`, base 0.5 ("a stranger offers a map"):

| Instance | Calculation | m |
|---|---|---|
| World Gentle | 0.8 * (1 + 0.4 * -0.3 * 0.5) = 0.8 * 0.94 | 0.752 |
| Place Wild | 2.5 * (1 + 1.2 * -0.3 * 0) | 2.500 |
| Fate Fated | 3.0 * (1 + 0.8 * -0.3 * 0.25) = 3.0 * 0.94 | 2.820 |

Raw product `0.752 * 2.5 * 2.82 = 5.30`. The clamp makes it **5.0**, weight 2.5.
(The cap is what stops a stack of friendly instances from owning the deck.)

Card C `people` base 3 ("debt collector"): `1.3 * 1.0 * 1.2 = 1.56`, weight 4.68.
Card D `daily` base 5 ("market day"): `1.3 * 1.0 * 0.8 = 1.04`, weight 5.20.

Deck odds on a hit: total `4.79 + 4.68 + 5.20 + 2.50 = 17.17`. Wolves 27.9%,
collector 27.3%, market 30.3%, map 14.6%. Without any storyteller (all ones) the
same deck gives wolves 4/17 = 23.5% and the map 2.9%. So these instances roughly
quintuple the map and raise wolves by a fifth.

### 5.5 World defaults for contrasting worlds (proposal)

All are proposals. Worlds can set any row, a `veto`, or `fate: 'none'|'rare'|'public'`.

| World type | World default | Reason | Notable ops |
|---|---|---|---|
| Quiet village | Gentle | Life-sim first, news and people | `lethal` set 0.1 for NPCs, off for child stage |
| Cultivation sect or war world | Wild | Duels, tribulations, raids | `lethal` x1.5, `rare` x2.5 (hidden masters) |
| Academy city with exams | Tidal | Term rhythm: crunch then break | wave length = term |
| Dungeon, tower or hunt world | Adaptive | The place scales to you | per-floor place instance |
| Horror or mystery city | Steady plus a `callback` x2 override | Slow dread, facts return | `veto` on `daily` cheer cards late at night |
| Hostile heaven (suppressing world) | Adaptive, plus a **world fate** aimed at deviants | See 7.8 | stance Suppressed halves fate |
| Idle farm or craft world | Gentle with swing 0.2 | Almost no pacing, only texture | threat tags `veto` except weather |
| Book world with a protagonist | Steady, plus the protagonist's own fate with `canon` anchors | Rails live in fate, not the world | lore guard from E6 |

---

## 6. Fairness rules and cooldowns (proposal)

Three fairness levels per life: `full` (default), `light` (Pure Chance default),
`off` (player or cheat sets it, logged). `off` removes R2, R3 and R6 only. R7,
R9 and R10 are plumbing and always stay.

All times are game time. Numbers are Steady defaults. Scale cooldowns by
personality: Gentle x2, Wild x0.5.

| Rule | Text | Default |
|---|---|---|
| R1 threat gap | No two `threat` cards within the gap, per instance. | 3 days |
| R2 lethal gap | No two `lethal` cards within the gap. | 60 days; after a life-threatening hit, 120 days |
| R3 crisis gap | A `crisis` urgency card needs the gap since the last crisis. | 20 days |
| R4 quiet breaker | If no non-daily card fired within the limit, the next deck tick must fire a card tagged `people`, `opportunity` or `daily`. | 5 days |
| R5 open cap | At most 3 open decision cards and 2 open threats per actor. | caps |
| R6 counter guarantee | At draw time a `threat` or `lethal` card must have at least one choice whose `requires` and `costs` pass now, or a `flee` choice. If none, the card is dropped from the draw (not rerolled). | on |
| R7 stream integrity | A skipped or dropped draw still consumes its roll, so later results do not shift (see C2, V5). | always |
| R8 repeat damping | Card weight `* 0.5 ^ timesSeenIn90Days`. `once` cards unaffected. | 90 days |
| R9 receipts | Every deck tick writes `{tick, deck, instances, T, C, P, multipliers, eligible, chosen, roll}`. Ring buffer of 200 per life. Debug panel and "fate" perception read it. | always |
| R10 no director writes | The director changes weights and rates only. It has no effect list. | always |

**Good-luck pity.** Track `badStreak`: consecutive cards whose outcome impact
> 8. Each step adds +25% to `opportunity` and `recovery` weights, cap x2.0.
Resets on the first opportunity card taken. This is the director twin of the
existing `guaranteeAfter` (V4).

**Post-disaster relief.** After a card with impact >= 30: `threat` and `lethal`
x0.2 and `recovery` x2 for 2 game days (Wild: 1 day, Gentle: 4 days).

**Cutthroat is a setting.** Per [how cutthroat (Q2)](../EMERGENT_SYSTEMS.md#how-cutthroat-q2):
`full` fairness is the default, not a limit. A world that declares
`fairness: 'off'` runs without R2, R3 and R6. A permadeath life can ask for it.
The log still shows causes.

---

## 7. Fate as an entity (proposal)

Fate is a **person-scope storyteller instance** with extra fields. It is an
entity (kind `storyteller`) with its own ID, tags and stream `fate:<personId>`.

```js
{ id: 'storyteller:fate.<personId>', scope: 'person', owner: '<personId>',
  personality: 'Fated',            // any personality row
  amplitude: 0..100,               // how hard it pulls (scales the multipliers)
  bias: -1..+1,                    // -1 doomed, 0 chaotic, +1 charmed
  reserve: 0..N,                   // spendable luck points (Q5 reroll, pin)
  anchors: [{ id, kind, claimable, charges, expires }],  // named openings
  thread: 'underdog'|'chosen'|'trickster'|'doomed'|...,   // flavor tag
  arc: 'obscure'|'rising'|'peak'|'fall'|'done',           // stage of its story
  state: 'intact'|'strained'|'dormant'|'stolen'|'broken',
  share: { <personId>: 0..1 },     // companions riding along
  reach: 'local'|'portable'|'native',  // see 7.7
  tags: [...], tension, comfort, multipliers }
```

This keeps both models the [rivals doc](../RIVALS_IDENTITIES_AND_FATE.md)
leaves open: **reserve luck** (visible, spendable, transferable) and **anchored
fate** (links to named openings). A fate may have either or both, and a world or
cheat chooses. (Doc line 197 warns that picking both for a first slice is hard
to explain: the first slice should ship one, with the fields left open.)

**Effective multiplier.** `amplitude` scales a fate instance's *deviation* from
1.0: `m_eff = 1 + (m - 1) * (amplitude / 50)`. At amplitude 50 the table is used
as written. At 0 the fate does nothing. At 100 it pulls twice as hard.
**Bias** then shifts tags: `opportunity, rare *= 1 + 0.5*bias`;
`threat, lethal *= 1 - 0.5*bias`. A Fated Child has high amplitude and bias 0
(luck and disaster both, per the north star line 2303). A doomed bloodline has
negative bias.

### 7.1 Who has fate

Default nobody. It comes from, any of:

- a constitution (Fated Child, section 7.9),
- a cheat (system, transmigration, regression),
- a world rule (the book's protagonist; a ruler's mandate; or `public` worlds
  where everyone has a small one),
- a bloodline or curse,
- an anchor claim ("the chosen one" vacancy),
- a transfer from another holder (7.3).

### 7.2 Gained

- **Born with it:** constitution or bloodline at creation, hidden until tested.
- **Granted:** a cheat card gives it, with a visible price (Blessing) or hidden
  one (Parasite, Con, Debt) per [cheats that hurt](../LIFE_SIM_NORTH_STAR.md#cheats-that-hurt-proposal-2026-10-08).
- **Claimed:** a vacant anchor with eligibility. The claimant must meet its
  `needs`. Claiming creates a fate with amplitude 20 and one anchor.
- **Earned:** finishing an anchor raises amplitude by 5 to 15. Defeating a fated
  rival can transfer a share (7.3).
- **Grown by deeds:** each time the owner takes the anchor's call at cost,
  amplitude +2. Each time they refuse it, amplitude -3 (a fate that is ignored
  fades). This is a tunable, not a rule.

### 7.3 Lost, stolen, shared

- **Lost:** the owner dies and the world says what happens (7.6). Or an anchor
  resolves and the fate goes `dormant`. Or world stance turns Rejected.
- **Stolen** (Q5 `Steal` access): a theft needs a method (cheat, ritual, a
  contact tag). It moves `min(victim.reserve, method.cap)` reserve and optionally
  one anchor. It moves amplitude by `method.share`, default 0.3 of the victim's.
  The victim goes `strained`. At amplitude 0 the victim becomes `fateless` plus a
  `fate_scar` tag (a later theft or restoring ritual can read it). Unique anchor
  IDs and charges mean a claim cannot duplicate across reload, rewind or two
  thieves (the rivals doc, line 286, asks for the same).
- **Symptoms of theft:** the victim's luck streak breaks for days: their
  opportunity weight drops, their threat weight rises. Others see "he was
  charmed, now he isn't" as gossip (E3).
- **Shared:** a companion in a `bond` relationship gets a **share** `s`
  (default 0.3). Their person instance is the owner's fate scaled by `s`, and
  it applies to cards they fill. Sharing costs the owner nothing by default
  (echo mode). A world or cheat can set `conserved` mode, where `s` is
  subtracted from the owner. Shared fate also shares the threat side: a
  protagonist's friends get dragged into their trouble.
- **Pooled:** in a party, the highest amplitude fate is the **lead**. Others
  with fate keep their own, and 7.5 handles conflict.

### 7.4 Broken and fought

- **Broken:** amplitude 0, state `broken`, tag `fate_scar`. Causes: a severing
  ritual (the north star's D2a "fate thread", line 605, not accepted), killing
  the anchor target, a world will's judgment, a paradox from a rewind. The owner
  is then run by world and place instances only. Repair paths exist: a
  new anchor claim, a long ritual, a patron's gift.
- **Defied (cheap fight):** spend `reserve` to refuse a drawn card (Reroll) or to
  pin a result (Pin). The original is kept in the log (Q5 rule).
- **Contested (costly fight):** a `counter-fate` effect (a rival cheat, an
  anti-divination charm, a blessed place) adds a `set` or `veto` op to the owner's
  instance on chosen tags, for a time. Cost scales with the owner's amplitude.
- **Hunted:** a world storyteller can run **hunters**: world-scope cards
  (tag `hunter`) cast against owners whose `amplitude > world.tolerance`.
  This is the suppressing heaven, in data.

### 7.5 Two fates in one place

Every opportunity card draws from the place's **fortune budget**
`B = place.fortune` per period (default 4 opportunities per 10 days per place).
Each holder `i` with fate in the place has claim weight
`a_i = amplitude_i * proximity_i * (1 + 0.1 * lostClaims_i)`.
`proximity` is 1.0 same room, 0.6 same district, 0.3 same world region.

When an opportunity card could go to more than one holder, pick its target by
`a_i / sum(a)` on the place's `director` stream. Example: amplitudes 60 and 30,
equal proximity: 2/3 versus 1/3. The loser gets `lostClaims +1`, so the next
contest is 1/3 * 1.1 and so on (pity, cap at 1.5 for the multiplier). The loser
also gets a **foil** card (an interference or rival-advantage card) with weight
`x1.5` on that same contest.

**Clash.** If the amplitude ratio is under 3, the place instance enters a
**clash**: both owners' `tension` and `threat` weights x1.3 while they share a
place, and `fate_clash` cards (duel, auction, tournament, a shared prophecy)
unlock. If the ratio is 3 or more, the weaker fate is **overshadowed**: its
`m_eff` deviation halves while they share the place. A weaker holder can leave,
shield (Blind), or share into the stronger one.

If the player holds one of the two, the log says "Two currents in this place"
only to perceivers (7.10).

### 7.6 Enemy protagonists

An enemy protagonist is a person with a fate, same schema, same rules, no
special engine. Differences are data:

- **Tier of attention.** `lod: here` runs the fate as above. `near` and `far`
  run a **yearly arc roll**: the arc stage moves (`obscure` to `rising` to
  `peak` to `fall`) with weights from the fate's personality, and each stage
  writes a fact (`history.<id>.arc_rising`) and maybe a legend (E6). The player
  can find the protagonist rising off-screen, or fallen.
- **Default personality** Fated, unless a world card or book ledger sets canon
  anchors. A book protagonist's canon anchors are `fixed` and the world mode
  (faithful, loose, remix; north star line 1021) says how far they can bend.
- **Player options** (from [protagonists and cheaters](../LIFE_SIM_NORTH_STAR.md#protagonists-and-cheaters-as-other-characters-proposal-2026-10-07)):
  sponsor (share), steal, warn, replace (claim a vacated anchor), or ignore them
  and run the inn. Each is a rule over the fate fields above.
- **Reincarnators, regressors and transmigrators** (north star line 1694) get
  fate by cheat. Foreknowledge is a fact set, not fate. A regressor may have
  anchors that the world already spent in the last loop (charges 0), so their
  fate is thinner each loop. A second regressor in the same place triggers 7.5.

### 7.7 Fate across worlds

- **`reach`:** `local` (ends at the world's edge; a book hero's plot armor),
  `portable` (follows the owner), `native` (changes with the world's stance).
- **Crossing** a barrier runs arrival rules (E4): the new world's stance rewrites
  the fate's effective amplitude. Proposal factors from the
  [world stance](../LIFE_SIM_NORTH_STAR.md#how-each-world-treats-you-proposal-2026-10-08) list:
  Favored x1.25, Neutral x1.0, Suppressed x0.5 (and `hunter` cards turn on),
  Rejected x0.25 (and an `expel` card family turns on).
- **Worlds may set** `fate: 'none'` (fate cannot act; amplitude held dormant),
  `fate: 'rare'` (default), or `fate: 'public'` (everyone has a small one, so
  fate is the world's physics).
- **Stacking on arrival:** the old world's place and world instances stop applying.
  The fate keeps its `reserve` and `anchors`. Anchors tied to the old world's
  facts go `dormant` and wait for a return.
- **Outsiders:** a world that has no notion of an outside fate treats it as an
  anomaly, with `watcher` cards and `callback` cards ("something followed you
  here").

### 7.8 Fate across lives

On the owner's death, the **soul layer or the world** decides (any is reachable):

| Option | Effect |
|---|---|
| Vanish | Fate ends. Anchors turn vacant in that place. |
| Heir | Fate passes at half amplitude to a named heir or the killer (the world's choice). |
| Soul carry | The reborn character gets `amplitude * 0.5` and the same `bias`, hidden at first. Anchors reset. |
| Debt | Negative bias carries (a doomed line). Positive does not. |
| Fixed | A world or cheat says the fate does not cross lives. |

Past-life memories (north star "later lives") can reveal that the fate existed.
A reborn soul may meet its own old foe whose fate it once stole.

### 7.9 Fated Child

Concrete first fate: the `Fated Child` constitution (north star line 2303). Born
amplitude 60, bias 0, personality Fated, reserve 0, no anchors, `reach: portable`,
hidden until a `fate` test or a remarkable event reveals it. Its price is
built into the table: threat x1.3, lethal x0.9, rare x3.0. The player experiences
both a lucky stranger and a bandit wave in the same month.

### 7.10 The player perceiving fate

Fate is hidden by default. Layers of knowing, each reachable by a skill, a cheat
or a world:

| Layer | What the player sees |
|---|---|
| 0 | Nothing. Only a log of events. |
| 1 Symptoms | Odd luck lines: "again?", NPC comments, animals avoiding someone, a long streak noted in the bio. |
| 2 Tilt | A gauge: `tilt = ln(m_opportunity_fate / m_threat_fate)`. Over +0.25 reads "fate is with you", under -0.25 "fate is turning against you". |
| 3 Read | A perception power (Q5 `See`) shows the next N card **tags**, not names, from the owner's `fate` stream. |
| 4 Others | See other people's `fated` or `fateless` tag and amplitude band (low, mid, high). |
| 5 Full | The receipts (R9) for the owner, in plain text. |

`Blind` access hides a person from layers 3 to 5.

---

## 8. Pacing by life stage (proposal)

The code has three stages (V12). I propose a finer **director stage** derived
from `ageYears` (V13), with the code names as parents:

| Director stage | Age | Parent (V12) |
|---|---|---|
| child | under 12 | `youth` |
| youth | 12 to 24 | `youth` |
| adult | 25 to 64 | `adult` |
| elder | 65 and up | `elder` |
| later life | any age, life number > 1 | adds to the above |

A run starts at 18 today (V11). Because validation allows `initialAge >= 0`
(V11), a child start is already legal. Child needs no new clock.

### 8.1 Stage factors (applied once, outside the instances)

| Tag | child | youth | adult | elder | later life (extra) |
|---|---|---|---|---|---|
| daily | 1.3 | 1.0 | 1.0 | 1.0 | x1 |
| people, family | 1.5 | 1.1 | 1.0 | 1.3 | x1 |
| learning | 2.0 | 1.5 | 1.0 | 0.5 | x1 |
| opportunity | 1.3 | 1.3 | 1.0 | 0.8 | x1 |
| romance | 0 | 1.3 | 1.0 | 0.5 | x1 |
| money, crime | 0.2 | 1.0 | 1.2 | 0.7 | x1 |
| threat | 0.15 | 1.0 | 1.0 | 0.7 | x1.2 (harder origins) |
| lethal | veto | 0.6 | 1.0 | 1.5 (illness, frailty) | x1 |
| rare | 1.0 | 1.2 | 1.0 | 0.8 | x1.5 |
| callback | 1.0 | 1.0 | 1.0 | 1.5 | x2 (past-life echoes) |
| legacy | 0 | 0 | 0.5 | 2.5 | x1.5 |
| recovery | 1.0 | 1.0 | 1.0 | 1.3 | x1 |

- `child lethal veto` is a default that a harsh world or a cutthroat life can
  lift (Q2). The log notes that it was lifted.
- **Final year.** V13 already fires a "seasons feel shorter" note in the last
  game year. The director adds a `legacy` x3 weight in that year so people come
  to the door and teaching cards show up. (Proposal; it ties to the existing
  `lesson` and `inherit` commands in `chronicle.js:170-173`.)
- **Gates, not ages.** The north star's pacing table ("The first crossing and
  first death are the two biggest gates... open by deed") stays the owner of
  *what content unlocks*. The director only scales frequency by stage. A deed
  gate can add or lift a tag's `veto`.
- **Fate and stage.** A fate's `arc` stage and the owner's life stage are
  separate. A Fated Child is `obscure` in childhood by default: amplitude acts at
  x0.5 until the first anchor appears.

---

## 9. Idle, active and offline (proposal)

### 9.1 Activity signal

Source has no activity concept (V9, C4). Proposal: the UI passes a recorded
`play.activity` fact at each boundary:

| Value | Meaning |
|---|---|
| `active` | input in the last 5 real minutes |
| `idle` | the tab runs, no input for 5 minutes to 8 hours |
| `away` | the clock jumped on return (catch-up) |

**Replay rule.** The value is stored in the receipt (R9) when used. Replay reads
the receipt, not the wall clock, so a saved run still replays byte for byte.

### 9.2 Urgency tiers (new; see C3)

Proposed, from the Q1 options (O1 to O5):

| Tier | Behavior |
|---|---|
| ambient | resolves at once, becomes news |
| soft | waits in the panel with a timeout |
| hard | pauses only the touched activity |
| crisis | pauses idle play, rare, capped by R3 |

### 9.3 Activity multipliers (proposal)

| | decision tiers | ambient | crisis |
|---|---|---|---|
| active | x1.0 | x1.0 | x1.0 |
| idle | soft x0.5, hard x0.25 | x1.5 | x0 (queue until input) |
| away | soft becomes a letter, hard x0 | x1.5 | x0 |

Idle shifts weights toward ambient news, so a long idle session still has a
pulse and does not pile up decisions (the doc's "idle for 8 hours" example).

### 9.4 Offline catch-up

Source facts: boundaries are visited in due order (V7), and each check reads
facts at its own tick. So catch-up is the same code path as live play. Proposal:

- **Same ticks, same rules.** The director runs at every deck tick during
  catch-up. T, C and cooldowns advance with the game clock, so a 3-day absence
  cannot stack 3 days of threats (R1 to R3 hold).
- **Away mode caps.** `threat` severity cap `away.cap` (no `lethal` unless the
  life or world is brutal, or a standing order allows). At most 6 letters.
  Overflow resolves by standing orders (O2), then by the character's traits (O3).
  Overflow beyond that is summarised as one news line.
- **Opportunity cap while away** of 3 per game day, so leaving the game open
  is not a farm.
- **Return summary:** "While you were gone, 6 things happened; 2 need you." Each
  line links to its receipt.
- **Fairness holds on resume.** First 10 game minutes after return: no `threat`
  cards, so a player who comes back is not hit by a loaded gun.

---

## 10. "Anything is possible" check (proposal)

Every option stays reachable by some route.

| Option | Reached through |
|---|---|
| No director at all | Pure Chance with fairness `off` (settings) |
| Pure global storyteller, no fate | World default, `fate: 'none'` |
| Fate only, no world storyteller | Player replaces world instance with a flat one, keeps fate |
| Everyone has fate | World `fate: 'public'` |
| Fate you can see | Layers 2 to 5 (7.10) |
| Fate you can lose or steal | 7.3, 7.4 |
| Lethal childhood | Harsh world lifts the child veto (8.1) |
| Brutal stacking | Table dial Brutal, Wild instances, fairness `off` |
| Gentle for me, harsh for them | Gentle table dial with a hostile world's fate hunting NPCs |
| Rigged luck on purpose | A cheat with `Bias` or `Pin` access, or `no-exception` tier (north star line 1408) |

---

## 11. Build-ready checklist (updates E5)

- [x] Tension and comfort formulas (section 3)
- [x] Multipliers per personality (section 4.1)
- [x] Fairness rules and cooldowns (section 6)
- [x] Where the player picks (section 4.2)
- [ ] Deck exists (E2) so the director has something to weigh. Until then use
  the adapter facts in section 2.
- [ ] Tag store (impact tags, `fated`, `fateless`) from the engine proposal.
- [ ] Receipt format and `director` stream saved (E1).
- [ ] Decision on amplitude scale (0 to 100) and `m_eff` formula.
- [ ] First fate content: Fated Child as one constitution (7.9), one anchor.

Smallest proof (proposal): Steady on `village.daily`, with Fated on one test
character. Run 30 days, same seed, with and without the director. Pass when
no stretch has 5 or more empty days, no two `threat` cards land within 3 days,
and the fate character sees at least twice the `rare` weight in the receipts.

---

## Open questions for Weibao

1. **Q1.** Should the player see the table dial and the world's personality name
   on the character screen, or should the personality stay hidden until found?
2. **Q2.** Is a fate a thing the player can lose forever, or should a broken fate
   always have a repair path? (This draft keeps a path, but a cheat can remove it.)
3. **Q3.** Shared fate: echo by default (companions gain, owner loses nothing), or
   conserved (the owner pays)? This draft says echo.
4. **Q4.** Should a child life exist as a start option now (it is already legal in
   the chronicle), or only after a first death?
5. **Q5.** Should idle play be allowed to pause on a crisis, or should the crisis
   queue until you return? This draft queues it.

---

## Vocabulary additions

Added to [SHARED_VOCABULARY](SHARED_VOCABULARY.md) terms. None renames an existing name.

**Card tags:** `lethal`, `recovery`, `learning`, `legacy`, `loss`, `hunter`,
`watcher`, `expel`, `fate_clash`, `foil`.

**Tags (fate family):** `fate_scar` (a broken or stolen fate left a mark).

**Storyteller instance fields:** `amplitude`, `bias`, `reserve`, `anchors`,
`thread`, `arc`, `state`, `share`, `reach`.

**Personalities:** `Steady`, `Wild`, `Gentle`, `Fated`, `Adaptive`, `Tidal`,
`Pure Chance`.

**Terms:**
- `pressure` (P): `(comfort - tension) / 100`.
- `tempo`: scale on a deck's fire rate.
- `slope`: how strongly a card tag follows pressure.
- `swing`: how hard a personality follows pressure.
- `op`: `mul | set | cap | floor | veto` on an instance's tag multiplier.
- `tilt`: `ln(opportunity multiplier / threat multiplier)` for a fate.
- `director stage`: `child | youth | adult | elder`, plus `later life`.
- `table dial`: save setting `storyteller.table`, 0.25 to 2.0.
- `fairness`: `full | light | off`.
- `fortune budget`: `place.fortune`, opportunities per period.
- `clash`, `overshadowed`: two-fate states in one place.
- `lostClaims`: contest pity counter.
- `play.activity`: `active | idle | away`.
- `urgency` tier `crisis` and `hard` (already in the card shape; first defined
  with behavior here).

**Facts:** `director.mult.<cardTag>`, `play.activity`, `world.upkeep`,
`world.tolerance`, `place.fortune`, `history.<id>.arc_<stage>`.

**IDs:** fate instance `storyteller:fate.<personId>`.

**Streams:** none new. Uses `director`, `deck:<deckId>`, `fate:<personId>`.


## World agendas and threat growth direction, 2026-10-15

[Accepted direction](../USER_VISION.md#cause-driven-threats-world-agendas-and-adaptation-2026-10-15):
cause-driven threat growth; fate/world agendas, modes/cheats and informed adaptation
can legitimately change it. World support and opposition may shift. This accepts
that possibility, not the earlier proposed T/C/P formulas, universal fate reserve,
personality table, schema or mandatory global difficulty controller.

An authoring proposal should separate choosing an eligible event, changing an
actual probability/cause and an actor deliberately pursuing an agenda. Record the
actual supported mechanism and selected world facts; don't invent a world mind
merely to explain all difficulty changes. An intelligent or impersonal correction
mechanism can be powerful where its world says so. Different mechanisms may
cooperate, conflict or target different outcomes. What they know and what the
player discovers remain means-dependent. Rival and implementation implications
are owned by [cause-driven threats](../RIVALS_IDENTITIES_AND_FATE.md#cause-driven-threats-and-adaptation-direction-2026-10-15).
No new source-specific fact or runtime implementation is established here.
