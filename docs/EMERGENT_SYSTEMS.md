# Emergent systems: randomness, storylets, living people and weird interactions (proposal)

Claude, 2026-10-09, from Weibao's question: "whats the best way to implement
randomness and more? random events, interactions, people, enemies... unscripted
stuff? stuff following lore? weird interactions we cannot predict?" and his
follow-up: expand each idea, then implement each one once it is comprehensive.

**Everything here is a proposal.** Nothing is selected for a build. This doc
owns the generative side (how the game makes things nobody wrote). The
[RNG audit](RNG_ENCOUNTERS_AND_SOURCE_DEVELOPMENT.md) owns native call sites and
save boundaries. [Characters and world events](CHARACTERS_AND_WORLD_EVENTS.md)
owns the character model. The [north star](LIFE_SIM_NORTH_STAR.md#random-events)
owns the overall life-sim direction and links here.

## Detail files (2026-10-09)

Each layer has a build-ready draft with verified source facts (file:line)
kept apart from proposals, worked Village examples and open questions. Names
shared across layers live in [the shared vocabulary](emergent/SHARED_VOCABULARY.md).

| Layer | Detail | Highlights |
|---|---|---|
| E1 | [Seeded streams](emergent/E1_SEEDED_STREAMS.md) | Stream list, save migration, ranked `Math.random` call sites, receipts, cheat access with example cheats |
| E2 | [Storylets](emergent/E2_STORYLETS.md) | Card schema, 12-step deck draw, casting, urgency tiers and standing orders, first 20 Village cards, three chains |
| E3 | [Living people](emergent/E3_LIVING_PEOPLE.md) | 6 needs, 12 traits, 15 goals, 22 verbs, utility formula, detail tiers, gossip, cruelty presets, 30-day Village story |
| E4 | [Tags and rules](emergent/E4_TAGS_AND_RULES.md) | Tag store, rule schema, 42 tags and 26 rules, item-state tiers, tag-mix crafting and alchemy, world physics, concept tiers |
| E4B | [Materials, states and Noita](emergent/E4B_MATERIALS_AND_NOITA.md) | Materials, reactions, stains, containers, seeded secret recipes, technique composition like wand building |
| E7 | [Observation and mystery](emergent/E7_OBSERVATION_AND_MYSTERY.md) | Six kinds of unknown, lore generated on demand, observe senses and skills, layered tooltips, Notebook codex |
| E8 | [Power aspects](emergent/E8_POWER_ASPECTS.md) | One idea on ten axes; aspects of laws; shards; catalogs of observation, future sight and immortality kinds; generated variants |
| E8B | [Power catalog](emergent/E8B_POWER_CATALOG.md) | About 70 families in seven groups, power sources, delivery modes, vows that trade limits for strength, cross-family combos, a variant generator |
| E8C | [Power paths and anime systems](emergent/E8C_POWER_PATHS_AND_ANIME.md) | What a path is, 24 path shapes, the JJK layering, information as power, powers aging with history |
| E8D | [Vow system](emergent/E8D_VOW_SYSTEM.md) | Vow sentence with core and extra slots, interpretation as tag matching, pricing quote, lifecycle, engine mapping, vows by NPCs and groups |
| E8E | [Adaptation](emergent/E8E_ADAPTATION.md) | One ledger for anything that learns you: Mahoraga's wheel, body tolerance, rivals, societies; signature granularity as the balance dial; counters with real causes |
| E8F | [Adjectives](emergent/E8F_ADJECTIVES.md) | Everything as noun plus adjectives: ladders, grammar (comparative, superlative, conditional, paradox), operations (climb, trade, steal, invert), economy, literal-word worlds, outlier extremes |
| E8E | [Powers in a life](emergent/E8E_POWERS_IN_A_LIFE.md) | Awakening, self-discovery tests, everyday uses, jobs and economic disruption, identity drift, family and lineage, teaching, combos, clash resolution, loss, idle policies, balance |
| E9 | [Laws as a power](emergent/E9_WORLD_LAWS.md) | Law powers (domains, sanctuaries, personal and contract laws, decrees, rule-writing, world seats) and the law toolkit: kinds, strengths, sense test, implementation tiers, meetings, heaven, profile. No world laws assigned yet |
| E5 | [Storyteller and fate](emergent/E5_STORYTELLER_AND_FATE.md) | Tension and comfort formulas, 7 personalities, 10 fairness rules, instance stacking, fate as an entity |
| E6 | [Lore layer](emergent/E6_LORE_LAYER.md) | World table schema, full Village tables, 31-symbol grammar, history facts, legends, callbacks, lore guards, private book packs |

## The core idea

Surprise comes from small systems that collide, not from more written events.
Authored lore becomes the *material* the systems draw from, never a script.

Six layers, each usable alone, strongest together:

| Code | Layer | Job | One-line test |
|---|---|---|---|
| E1 | Seeded streams | Make every random thing saved, reproducible and independent | Reload never rerolls; a shop refresh never changes a fight |
| E2 | Storylets | Small event cards drawn when the world matches their needs | Two fresh saves have different weeks |
| E3 | Living people | NPCs with needs, traits and goals act on their own | Something happens between two NPCs that the player didn't cause |
| E4 | Tags and rules | Properties plus property-level rules make interactions nobody authored | A combination happens that no single file mentions |
| E5 | Storyteller | Paces everything by tension, life stage and recent history | Quiet stretches end; disasters don't stack unfairly |
| E6 | Lore layer | Per-world tables, facts, callbacks and text grammars | A random event in Cyoria reads as Cyoria, not as Village |

## What already exists (verified in source, 2026-10-09)

More than the older docs say. This changes the build cost of every layer.

- **Saved RNG.** `src/expansion_engine.js` keeps one xorshift32 state `rng`
  in the save; commit draws, preview doesn't.
- **Per-event streams.** `src/simulation.js:64` gives every automatic event
  its own check `{due, interval, rng: hash(seed, id)}`. That is already E1's
  stream idea, at event granularity.
- **Event director primitives.** `src/simulation.js:484-497`: each due
  check tests `requires` against facts, resolves a fact-dependent `chance`,
  supports pity (`guaranteeAfter`) and `maxOccurrences`, and blocks
  duplicates while one is open. Facts include `event.misses`/`attempts`.
- **Events with choices.** `occur()` creates events with modes (`ambient`,
  `decision`), responses, expiry, `onExpire` effects, `public`/`aware`
  discovery and a capped log.
- **Effect vocabulary.** `src/simulation_effects.js` supports spawn,
  relocate, fact, resource, vital, body, item, transfer, xp, reputation,
  knowledge, relationship, claim, condition, life, source, power, title,
  equipment, unlock, event, party, situation, pursuit, energy and more.
- **Weighted outcomes.** `resolveOutcomeWeights` in
  `src/simulation_resolution.js` already supports weights that depend on facts.
- **Generated people.** The `spawn` effect binds new actors from templates
  with stable IDs per cause.
- **NPC brains (simple).** Controllers (`src/simulation.js:510`) run each
  NPC on an interval and pick the highest-priority eligible action. That is a
  priority list, not needs-based utility.
- **External planner hook.** `acceptActorProposal` lets an outside planner
  (rules, utility AI or an LLM) *propose* a registered command. It can never
  prescribe effects. That is the right safety boundary for any later AI layer.
- **Coarse lives.** `src/npc_lives.js` is a fixed, predetermined yearly
  household (births, marriages, deaths by hash). Not simulated.
- **History.** The chronicle stores the player's relationships (32 memories per actor),
  knowledge and a compacted biography; `event_feed.js` reads it as news.

**Corrections found by the layer passes (verified 2026-10-09):**
- No root seed exists. `rng` is a moving cursor; the simulation seed is
  derived from it at enrollment (`src/simulation.js:46`), and weighted
  outcomes share a third cursor `s.seed` (`src/simulation.js:174-178`).
- `src/combat_math.js:34-48` already takes an injected `random`, so combat
  is cheap to move onto a stream.
- Rules support only `eq`, `gte`, `lte` (`src/rules.js`); no `neq`, and
  the `fact` effect sets values only.
- A waiting decision blocks other activities such as trading
  (`src/main.js:722`, `:813`). Scoped "hard" waits are new work.
- Event modes include `offer` besides `ambient` and `decision`. Life stages
  in code are only youth, adult and elder (`src/life_experience.js:9`).
  Nothing tracks idle or offline time.
- The `npc_lives.js` household are yearly records, not simulation people.
  They must be spawned before cards or brains can use them. NPC-to-NPC
  relationships live in the simulation store; the chronicle holds the
  player's.
- The 64 recent and 200 annual biography caps are in `life_record.js`.
  Chronicle knowledge is true/false only, so history facts need their own
  store.
- Vanilla items (`src/items.js:170-202`) and enemies (`src/enemies.js:237`)
  already carry tags, and `conditions` already handle expiry and ticks.

**What's missing:** a deck picker (choose *among* eligible events by
weight and cooldown, not each event rolling alone), needs and goals for
NPCs, any tag/interaction layer, a pacing director, world lore tables, a text
grammar, and fact callbacks between events. Native combat, loot, shops and
crafting still use `Math.random` (see the RNG audit).

---

## E1. Seeded streams

### Goal
Every gameplay random draw is saved, reproducible and isolated. This is
plumbing, but it's what makes emergent bugs debuggable ("replay seed X, day
40") and stops save-scumming from being free.

### Design
- **One root seed per life**, saved at enrollment (new: today's `rng` is a moving cursor, not a root). Never `Date.now` on resume.
- **Named streams derived once from the root:** `world.events`,
  `world.people`, `encounter`, `loot`, `market`, `craft`, `discovery`,
  `interaction`, `director`, `text`. Each stream state is saved.
- **Sub-streams by subject** where independence matters:
  `people:<id>` so one villager's choices don't shift another's,
  `encounter:<instanceId>` so a fight is fixed once entered.
- **Cosmetic randomness stays on `Math.random`** (particles, flavor lines
  that change nothing). It must never touch a gameplay stream.
- **Receipts.** Each committed draw records stream, counter and result on
  the thing it decided (event, loot drop, craft batch). The UI never draws.

### Player-facing
Invisible, except: reloading gives the same result, and "luck" powers can
point at a real thing (reroll *this* drop, preview *this* stream's next
three results) instead of a vague bonus.

### Interactions with other layers
E2 and E5 draw from `world.events`/`director`; E3 from `people:<id>`;
E4 from `interaction`; E6 grammars from `text` so a replay reads the same.

### Risks
- Changing draw order in code silently changes old saves' futures. Fine for
  future draws; never re-derive past results.
- Too many streams is a save-size cost. Cap and compact sub-streams of dead
  people and closed encounters.

### Smallest proof
Move the Village storylet deck (E2) and its people (E3) onto two named
streams. Test: same seed, same 30 days, byte-identical log; different seed,
different log.

### Build-ready when
- [ ] Stream list agreed (names and what each owns)
- [ ] Save shape and migration from the single `rng` decided
- [ ] Native call sites ordered by priority (combat, loot, shop, craft)

### Open for Weibao
- Answered 2026-10-09: "depends on the cheat, each is possible." See
  [stream access for cheats](#stream-access-for-cheats-q5).

---

## E2. Storylets

### Goal
Replace "write a quest" with "write a card." You write 30 small cards per
place; the world decides which show up, when, and in what order.

### What a storylet is
```js
{
  id: 'village.debt_collector_visits',
  deck: 'village.daily',
  needs: all(fact('person.$who.debt', 'gte', 30), not(fact('calendar.season', 'eq', 'winter'))),
  cast: { who: { role: 'villager', needs: tag('indebted') },
          collector: { role: 'stranger', spawn: 'world.collector' } },
  weight: { base: 3, plus: [{ fact: 'world.tension', scale: -0.5 }] },
  cooldown: { self: 30 * DAY, cast: 10 * DAY },
  once: false,
  text: '#collector.name# knocks on #who.name#\'s door, smiling too much.',
  choices: [
    { label: 'Pay part of the debt for them', costs: [money(20)],
      effects: [rel('$who', 'player', +2), fact('person.$who.debt', 'add', -20)] },
    { label: 'Stand beside them', requires: stat('strength', 'gte', 8),
      effects: [rel('$collector', 'player', -3), tag('$collector', 'grudge:player')] },
    { label: 'Walk past', effects: [memory('$who', 'player', 'ignored_me')] },
  ],
  onIgnore: [ /* what happens if the player never answers */ ],
}
```

### Key parts
- **Needs** use the existing `meets()` rule language. Nothing new to learn.
- **Casting.** Roles are filled from the *current world* (a villager with
  tag `indebted`, a stranger spawned from a template). This is where E3's
  people walk into stories. One card plus different casts gives different
  stories.
- **Decks.** Cards live in decks by place and rhythm: `village.daily`,
  `village.seasonal`, `road.travel`, `cyoria.academy`, `life.milestone`,
  `rare.anywhere`. A deck is drawn on its own clock.
- **Deck draw**, the main new mechanic: on each deck tick, collect eligible
  cards, apply cooldowns, multiply weights by E5's pacing, draw one from the
  deck's stream. Today each event rolls alone, which can't express "one of
  these 30 things happens today."
- **Choices** reuse simulation event responses (`decision` mode) and the
  full effect vocabulary. Ambient cards resolve on their own and become news.
- **Ignoring is a choice.** `onIgnore`/`onExpire` effects make the world move
  without the player ("the collector took his cart").
- **Chains without scripts.** A card sets a fact; other cards need that fact.
  Nobody writes the chain. With 30 cards each setting one or two facts, you
  get chains you didn't plan.

### Card families worth having from day one
1. **Daily texture:** small, cheap, mostly ambient (a stray dog follows you,
   the baker burns a batch). Gives the world a pulse.
2. **People problems:** cast villagers into debt, feuds, romance, illness,
   ambition. These feed E3 and are where most stories come from.
3. **Opportunities:** a teacher passes through, a cheap rare item, a job.
   Should feel lucky and be time-limited.
4. **Threats:** a raid, a sickness, a rival. Throttled hard by E5.
5. **Callbacks:** only eligible because an earlier card set a fact ("the
   collector returns with friends"). This is how lore builds up.
6. **Rare:** under 1% per season, life-changing (hidden master, door to
   another world, cursed relic). Pity counters keep them from never coming.

### Player-facing
The center menu and events panel show cards as they come up. Decisions wait;
ambient ones go to news. Hovering a card shows why it showed up ("because
Oren owes 40 coins").

### Lore
Each world has its own decks, fact names and cast templates. Shared
"anywhere" decks must use only portable tags (E4) so they read right in any
world.

### Risks
- **Repetition.** Fix with cooldowns, `once`, casting variety and E6 text
  grammars. Track "times seen" per card and down-weight.
- **Incoherence** (a dead person shows up). Casting must check life state
  and location; cards never refer to people by hardcoded ID unless they're
  callbacks.
- **Authoring cost.** A card must stay small: aim for 10 to 25 lines. If a
  card needs a host file, it's a quest, not a storylet.

### Smallest proof
One deck `village.daily` with 20 cards across families 1 to 5, drawing once
per game day. Two fresh saves, 30 days each, compared side by side.

### Build-ready when
- [ ] Card schema final (needs, cast, weight, cooldown, choices, ignore)
- [ ] First 20 Village cards written as data
- [ ] Where cards appear in the original UI agreed (center menu vs. events panel)
- [ ] Deck tick rates agreed (per day, per season, per travel leg)

### Open for Weibao
- Weibao is unsure (2026-10-09). Options in
  [decisions while idle](#decisions-while-idle-q1).
- Q: Should the player be able to see a deck's odds? Maybe only with a
  perception skill or cheat.

---

## E3. Living people

### Goal
NPCs (and named enemies) have lives that move without the player. Most
"stories nobody wrote" come from people bumping into each other.

### Model
Each simulated person carries:
- **Traits** (3 to 5 tags): `greedy`, `brave`, `pious`, `jealous`,
  `curious`, `lazy`, `kind`, `vengeful`. Traits are E4 tags, so they join
  interaction rules.
- **Needs** (0 to 100, decay over time): `money`, `safety`, `belonging`,
  `status`, `purpose`. A world can add its own (`mana`, `faith`, `honor`).
- **One goal** at a time, chosen from needs and traits: pay a debt, marry,
  get revenge, master a craft, leave the village, become guard captain.
- **Opinions** of others: the existing relationship model, plus memories
  ("she paid my debt", "he walked past").
- **Resources:** money, items, skills, home, job. Finite, so they must choose.

### Brain
Upgrade controllers from a fixed priority list to **utility scoring**:
each tick, score every eligible action by how much it serves the current
goal and needs, weighted by traits, plus a small random term from
`people:<id>`. Pick the best. Same legal-action gate as the player
(`previewSimulationCommand`), so NPCs can't cheat.

Verb list to start (all through existing effects):
`work`, `rest`, `buy`, `sell`, `borrow`, `lend`, `steal`, `gift`, `court`,
`argue`, `fight`, `train`, `pray`, `gossip`, `travel`, `leave`.

### Level of detail (the scale trick)
Simulate by distance, like Dwarf Fortress and Crusader Kings:
- **Here** (same location as the player): ticks every few game hours, full
  actions, can trigger storylets.
- **Nearby** (same world): ticks daily, summarized actions.
- **Far** (other worlds, the past): ticks yearly as a summary roll, like
  today's `npc_lives.js` but generated instead of fixed.
This keeps big populations cheap and fits the 512-boundary cap.

### Generated people
New arrivals come from **world templates** (E6): name tables, typical traits,
jobs and goals. Spawned with the existing `spawn` effect. Births combine
parents' traits with mutation. Over a long life, the village is made of
people nobody wrote.

### Named enemies are people too
A rival, bandit leader or reincarnator uses the same model with harsher
goals and finite means. They remember losing to you (`grudge:player`), train,
recruit and come back. This links to the
[enemy protagonists](ENEMY_PROTAGONISTS.md) and
[rivals](RIVALS_IDENTITIES_AND_FATE.md) docs.

### Gossip
Information moves person to person: `gossip` copies a memory or fact to
another NPC, sometimes distorted. Reputation becomes "what people heard,"
not a global number. A deed in one village reaches the next one later.

### Player-facing
The People panel shows each person's mood, current goal (if known) and
relationship history. The bio records the times their life crossed yours.
News reports what people did off-screen.

### Risks
- **Chaos.** Unchecked NPCs murder each other by day 10. Traits need
  restraint costs (law, reputation, fear) and E5 throttles violence.
- **Save size.** Cap here-tier people per location; compact memories into
  summaries; far-tier people are numbers only.
- **Opaque behavior.** Every NPC action logs its reason ("Oren borrowed from
  the collector because he needs money and is proud").
- **Replacing vanilla NPCs.** Vanilla NPCs stay as they are; the simulation
  wraps them only if they opt in.

### Smallest proof
4 Village people with traits, needs and one goal each, on utility brains,
ticking every 4 game hours. 30 days: at least one relationship change
between two NPCs that no card or script directly caused.

### Build-ready when
- [ ] Need list and decay rates
- [ ] Trait list (about 12) with what each changes
- [ ] Verb list mapped to existing commands/effects
- [ ] Level-of-detail tiers and tick rates
- [ ] Rules for what NPCs may never do (kill the player off-screen? steal
      from the player's home?)

### Open for Weibao
- Answered 2026-10-09: "anything is possible and it depends." See
  [how cutthroat](#how-cutthroat-q2).
- Q: Can villagers you care about leave forever? (Covered by the same
  answer unless Weibao says otherwise.)

---

## E4. Tags and interaction rules

### Goal
The "weird interactions we cannot predict" layer. Things get properties;
rules connect properties, never specific things. 15 tags and 25 rules give
hundreds of combinations nobody authored. This is how Breath of the Wild's
chemistry, Noita and Caves of Qud work.

### Tags
Short strings on anything: items, people, places, enemies, weather, bodies.

| Family | Examples |
|---|---|
| Material | `wood`, `metal`, `cloth`, `glass`, `flesh`, `stone` |
| State | `wet`, `burning`, `frozen`, `rotten`, `broken`, `blessed`, `cursed` |
| Mind | `afraid`, `angry`, `drunk`, `hungry`, `grieving`, `in_love` |
| Trait | `greedy`, `brave`, `jealous` (from E3) |
| Nature | `alive`, `undead`, `construct`, `spirit`, `beast` |
| Energy | `mana`, `qi`, `holy`, `void` (world-specific, see below) |

Tags can carry a strength and an expiry (`burning:3`, lasts 2 hours).

### Rules
A rule is: **when** these tags meet, **then** do this.
```js
{ id: 'fire_spreads', when: { a: 'burning', b: 'flammable', contact: true },
  then: [tag('$b', 'burning', 2)], chance: 0.6 }
{ id: 'cornered_fear', when: { a: 'afraid', place: 'cornered' },
  then: [tag('$a', 'angry'), untag('$a', 'afraid')] }
{ id: 'greed_meets_cursed', when: { a: 'greedy', b: 'cursed', owns: true },
  then: [untag('$a', 'kind'), memory('$a', '$b', 'wont_let_go')] }
{ id: 'drunk_gossip', when: { a: 'drunk', a_knows: 'secret' },
  then: [{ type: 'gossip', from: '$a', leak: 'secret' }], chance: 0.3 }
{ id: 'wet_freezes', when: { a: 'wet', place: 'frozen' }, then: [tag('$a', 'frozen')] }
```

### Where rules run
- **On contact:** combat hits, using an item on something, two people in a
  storylet cast.
- **On ticks:** state tags (burning, rotten, grieving) run each tick until
  they expire.
- **On arrival:** entering a place with weather or terrain tags.

Rules can trigger other rules, capped per tick (say 8 hops) so nothing loops
forever. Every rule firing is logged with its chain ("the lamp broke → oil
spilled → oil caught → the stall burned → the merchant is angry at you").

### Different worlds, different physics
This is where the multiverse gets interesting. Each world can **add,
remove or override rules.** In a world without mana, `mana` tags do nothing
or fade. In a holy world, `undead + holy` destroys; in a void world it might
empower. Items carry their tags across worlds and meet that world's rules.
This hooks into the north star's
[barriers and multiverse physics](LIFE_SIM_NORTH_STAR.md#barriers-between-worlds-and-the-multiverses-own-physics-proposal-2026-10-08).

### Player-facing
- Hovering an item or person shows its tags (some hidden until learned).
- A "how that happened" chain in the log for every surprising result.
- Players discover rules by seeing them fire; a known rule goes in a
  knowledge list. Research can reveal rules early.

### Risks
- **Exploits.** Some combo will be busted. The north star wants busted
  combos, so log them, don't ban them; balance only what kills fun.
- **Unreadable chaos.** The chain log and hover tags fix most of it.
- **Rule explosion.** Rules must stay tag-to-tag. If a rule names a specific
  item or person, it belongs in a storylet instead.

### Smallest proof
10 tags, 15 rules, wired into item use, the storylet cast and one fight.
Test: a play session where a rule chain of 3+ hops happens and the log
explains it.

### Build-ready when
- [ ] First tag list with families
- [ ] First 15 rules written as data
- [ ] Where rules fire (contact, tick, arrival) wired to which existing code paths
- [ ] Chain cap and log format
- [ ] Which tags are visible, hidden or learnable

### Open for Weibao
- Answered 2026-10-09: yes, as a possible major overhaul reaching crafting,
  alchemy and more. See [tags as the material layer](#tags-as-the-material-layer-q3)
  and [tags everywhere](#tags-and-rules-everywhere-engine-level).

---

## E5. Storyteller (director)

### Goal
Randomness without pacing is noise. By default the director decides
*when*, not *what*. It turns weights up or down and doesn't write events. A
fate or world storyteller instance may inject events of its own, as a dial.

### Inputs
- **Tension:** recent threats, damage taken, losses, open crises.
- **Comfort:** wealth, food, safety, how long since anything happened.
- **Life stage:** child, young adult, middle life, old age, later lives
  (from the north star's pacing table).
- **Recent history:** which decks and families fired lately.
- **Player intent signals:** idling vs. active, current goal or job.

### Outputs
A multiplier per card family per deck draw. Examples:
- Long calm plus high comfort: threats ×2, opportunities ×0.7.
- Just survived a disaster: threats ×0.2 for a while, recovery cards ×2.
- Child life stage: threats mostly off, family and learning cards up.
- Idle for 8 hours: fewer decision cards, more ambient news.

### Personalities
Like RimWorld, a few director personalities the player picks at the start of
a life (or a world picks for you):
- **Steady:** smooth curve, few spikes.
- **Wild:** big swings, more rares, more disasters.
- **Gentle:** life-sim first, few threats.
- **Fated:** the life bends toward drama; ties to the `Fated Child`
  constitution idea.

Different worlds can have their own default director (a war world runs
Wild; a slice-of-life world runs Gentle).

### Fairness rules
- No two run-threatening threats within a cooldown.
- By default a threat has at least one counter available or a way to flee.
  Harsh worlds and fairness `off` drop this ([E5 section 6](emergent/E5_STORYTELLER_AND_FATE.md#6-fairness-rules-and-cooldowns-proposal)).
- Pity on good things too: a long bad streak raises opportunity odds.
- Everything the director does is logged, so it can be checked and tuned.

### Risks
- **Feels rigged** if too smooth. Wild exists for that.
- **Hidden hand.** Log director decisions; a later perception power could
  even reveal "fate is turning against you."

### Smallest proof
One director (Steady) on the Village deck: track tension and comfort, adjust
three families. Test: compare 30 days with and without the director; with
it, no stretch of 5+ days with nothing, and no two threats within 3 days.

### Build-ready when
- [ ] Tension and comfort formulas
- [ ] Family multipliers per personality
- [ ] Fairness rules and cooldowns
- [ ] Where the player picks a personality (life start? settings?)

### Open for Weibao
- Answered 2026-10-09: it depends, maybe both; sometimes it's "fate," or a
  storyteller instance for that world. See
  [storyteller instances and fate](#storyteller-instances-and-fate-q4).

---

## E6. Lore layer

### Goal
Generated content reads like it belongs to *this* world, and history
accumulates so later random things refer back to earlier ones.

### Pieces
1. **World tables.** Each world has data: name lists (by culture/faction),
   jobs, factions, goals people pursue, materials, local tags, taboos,
   gods/powers, place names, weather. E2 casting and E3 spawning draw only
   from the current world's tables. Book worlds fill tables from their
   [source ledgers](worlds/); original worlds from their world cards.
2. **Facts as history.** Every resolved storylet, notable rule chain and NPC
   life event writes a fact to the chronicle (`fact.collector_burned_stall`,
   with who, when, where). Facts are what later cards need.
3. **Callbacks.** Cards whose `needs` include an old fact. The man whose
   stall burned asks about you a year later. Callbacks are what make random
   events feel like lore instead of noise.
4. **Text grammars** (Tracery-style). Templates with slots and variants:
   `'#greeting#, #player.title#. #weather_comment#'`. Per-world grammar
   files give each world its own voice. Drawn from the `text` stream so
   replays read the same.
5. **Legends.** Every in-game year, summarize the biggest facts into a few
   legend lines (Caves of Qud style). Legends are what NPCs in other places
   gossip about, and what the bio shows for old years.
6. **Lore guards.** A world can forbid tags, cards or rules that would break
   its fiction (no guns in a low-fantasy village unless a traveler brings
   one; then that becomes a story).

### Risks
- **Bland generic text.** Grammars need real per-world vocabulary, and
  important cards keep hand-written text with only small slots.
- **Fact bloat.** Facts compact into legends yearly; minor facts expire.
- **Book-world fidelity.** Direct adaptations keep their source rules;
  generated content fills gaps and never contradicts canon facts marked
  fixed in the source ledger.

### Smallest proof
Village tables (names, jobs, goals), one grammar file, 3 callback cards.
Test: a fact from day 3 is referenced by a card on day 20 or later.

### Build-ready when
- [ ] World table schema
- [ ] Grammar format and the first Village grammar
- [ ] Fact naming rules and compaction policy
- [ ] Legend summary format

---

## Weibao's answers and the expansions they open (2026-10-09)

His words, then Claude's proposals.

- Q1 (decisions while idle): "I am unsure, ideas?"
- Q2 (cutthroat): "anything is possible and it depends"
- Q3 (vanilla tags): "could have major overhaul and interact with systems
  like crafting and alchemy and more?"
- Q4 (storyteller scope): "maybe it depends, maybe both, it can be 'fate'
  in some circumstances or in that case it would be a storyteller instance
  for that world?"
- Q5 (cheats and streams): "depends on the cheat, each is possible"
- "We can expand tags and rules to engine stuff and more? every layer as well"

### Decisions while idle (Q1)

Options, from least to most intrusive. They combine; the recommendation is
O1 + O2 + O3, with O4 kept rare.

| Code | Option | How it works |
|---|---|---|
| O1 | Urgency tiers | Every card has a tier. **Ambient** never waits. **Soft** waits in the events panel with a timeout. **Hard** pauses only the activity it touches (the shop closes, the patrol stops), not the whole game. **Crisis** pauses idle play; rare and capped by the storyteller. |
| O2 | Standing orders | The player sets policies ahead of time: "help villagers in debt if it costs under 20 coins," "never fight above my level," "accept every teacher." Cards check orders before waiting. This reuses the prepared-policy idea from the [RNG doc](RNG_ENCOUNTERS_AND_SOURCE_DEVELOPMENT.md#3-mechanical-difficulty-with-understandable-counters). |
| O3 | The character acts in character | With no order and the timeout reached, the character's own traits, habits and relationships choose. A `kind` character helps; a `greedy` one doesn't. The log says "you weren't there; Weibao's character did what they'd do." This ties to [who the player is](LIFE_SIM_NORTH_STAR.md#who-the-player-is-the-character-or-someone-living-through-them-proposal-2026-10-08): the player guides a person who has a will of their own. |
| O4 | Autonomy slider | Per life: from "ask me everything" to "live it for me." Low autonomy turns more cards into hard waits. |
| O5 | Letters and catch-up | While offline, decisions queue as letters. On return: "while you were gone, 6 things happened; 2 still need you." Expired ones resolved by O2 or O3. |

O3 is the most interesting. A character who answers for you when you're
away gains a personality through play, and those choices can push their
traits, so a life where you're often away drifts toward who the character
already was.

### How cutthroat (Q2)

No global cap. Cruelty becomes a **setting the world and storyteller own**:
- Each world declares what can happen off-screen: NPC death, permanent
  departure, theft from the player's home, war, plague.
- The storyteller personality scales it (Gentle rarely uses lethal cards;
  Wild uses them freely).
- Law, fear, reputation and witnesses are rules (E4) that make cruelty
  costly for NPCs, so violence has a reason and consequences, not just odds.
- Everything permanent is logged with its cause, so a loss is a story,
  not a bug.
- A player-side safety option can exist per life (protect named people),
  but the default follows the world.

### Tags as the material layer (Q3)

Proposal: tags become what things are *made of*, and crafting, alchemy,
cooking, smithing, enchanting and farming become rules over tags.

- **Ingredients carry tags with strength:** a herb is `bitter:2, healing:3,
  cold:1`. Ore is `metal:4, brittle:1`. A monster part is `venom:3, beast:2`.
- **Alchemy is mixing tags.** Tags add, cancel or react (`hot` + `cold` →
  `volatile`; `healing` + `venom` at the right ratio → `antidote`). Known
  recipes are named results; unknown mixes still produce something, which is
  how players discover recipes. Potion Craft, Noita and Skyrim alchemy work
  like this.
- **Smithing and alloys** combine metal tags; D1's Springsteel becomes one
  result of the rule system instead of a one-off item. Quality comes from how
  well the tags fit, plus skill.
- **Equipment inherits tags** from what it's made of. A `cold` sword in a
  `burning` world matters. Enchanting adds a tag; curses are tags too.
- **Cooking and farming:** dishes inherit tags (`warming` food in winter);
  soil, seeds and weather have tags that change crops.
- **Skills meet tags:** a `fire` skill on a `wood` target, a `healing` skill
  on an `undead` target. This is the link to skill evolution: a skill that
  fires the same tag rule enough times can learn a new rule from it.

**Vanilla compatibility (needs a decision before building):**
- Tags for vanilla items live in a **separate overlay table** keyed by item
  ID. Vanilla item files stay untouched, and turning the overlay off gives
  vanilla back.
- Vanilla recipes stay as they are; tag-based crafting adds new routes
  next to them.
- **Instance state is the hard part.** Vanilla stacks items by key, so a
  `wet` sword and a dry sword can't share a stack. Options: put temporary
  state only on equipped or unique items; add a variant suffix to the item
  key; or keep instance tags in a side table. This touches persistence, so it
  needs a migration plan per AGENTS.md.

### Storyteller instances and fate (Q4)

Proposal: storytellers are **instances that stack**, not one global setting.

- **World storyteller:** each world has one, matching its nature (a war
  world runs Wild, a quiet world Gentle). It owns world-scale events.
- **Place storyteller (optional):** a dungeon, a city, a sect can run its own
  on top of the world one.
- **Fate:** a personal storyteller attached to a *person*, not a place. Most
  people have none. A `Fated Child`, a protagonist, a reincarnator or a
  cursed bloodline does. Fate follows them across worlds and pulls events
  toward them: opportunities, disasters, rivals.
- **Combining:** at each draw, the active instances (world × place × fate)
  multiply card weights. Fate can override the world for cards tagged to
  that person.
- **Fate as a thing in the world:** it can be gained, lost, stolen, shared
  (a protagonist's companions get dragged along), broken or fought. Enemy
  protagonists have their own fate, and two fates in one place compete.
  This fits [protagonists and cheaters as other characters](LIFE_SIM_NORTH_STAR.md#protagonists-and-cheaters-as-other-characters-proposal-2026-10-07).
- **Visible in play:** a perception power or cheat can show "fate is
  turning against you" by reading the instance log.

### Stream access for cheats (Q5)

Each cheat declares which access it has, to which streams, at what cost.
Every one is possible; a cheat picks its combination.

| Access | What it does | Example cheat |
|---|---|---|
| See | Show a stream's next N results | Foresight, a fortune teller |
| Reroll | Replace one specific unclaimed result; the original is kept in the log | "Second chance" |
| Pin | Force the next result of a stream to a chosen category | "Lucky find" once per day |
| Bias | Shift weights on one stream for a while | A fortune charm |
| Branch | Save a stream's state and return to it later | Rewind, save point |
| Steal | Take another person's fate or luck stream | A luck-eating cheat |
| Blind | Hide your streams from others' See | Anti-divination |

Rules: access is per stream (seeing loot doesn't show combat), uses are
logged, and a cheat's limits are part of its design. Under the north star's
[no-exception cheats](LIFE_SIM_NORTH_STAR.md#rewinds-farming-and-no-exception-cheats-weibao-and-claude-2026-10-08),
a top-tier cheat can have no limit at all.

## Tags and rules everywhere (engine level)

Weibao: expand tags and rules to engine stuff and every layer.

### The unifying idea

**Everything is an entity with tags; every system is rules over tags.**
Items, people, places, worlds, skills, powers, cheats, events, factions,
weather, bodies and even streams carry tags. One rule engine runs them all.
Today each feature has its own content/facts/host files. Under this design,
most new content becomes data: new tags, new rules, new cards.

### Engine shape

- **Tag store.** Templates declare base tags; instances store only changes
  (added, removed, strength, expiry). Keeps saves small.
- **Facts from tags.** Every tag shows up as a fact (`$actor.tag.burning`),
  so the existing `meets()` rule language can check tags with no new syntax.
- **Rules as a registry family** next to events, controllers and
  situations. Each rule has a trigger, a pattern, effects, chance, stream
  and priority. Effects reuse the existing effect vocabulary.
- **Triggers:** contact (two entities interact), tick (a tag is active),
  arrival (enter a place), change (a tag is added or removed), and
  custom engine hooks (craft finished, skill used, world entered).
- **Indexing.** Rules are indexed by the tags they mention; only rules
  touching a changed tag are checked. Without this, cost grows with every
  rule.
- **Chains and caps.** Rule effects can fire more rules, capped per tick,
  and every chain is logged with its cause.
- **Rule layers.** Base rules → world rules → place rules → personal rules
  (powers, cheats, constitutions). Later layers add, override or disable
  earlier ones. This is how different worlds get different physics.

### Every layer, tagged

| Layer | What tags and rules add |
|---|---|
| E1 Streams | Streams carry tags (`luck`, `fate`, `blessed`); cheats and curses act on them by rule. |
| E2 Storylets | Cards carry tags (`threat`, `romance`, `money`, `rare`). Decks select by tag, storytellers and fate weight by tag, and casting matches people by tag. |
| E3 People | Traits, moods, needs past a threshold, jobs and statuses are tags. Relationships carry tags (`rival`, `mentor`, `debtor`). Brains score actions by the tags they would add or remove. |
| E4 Rules | Already the core. Extended to rules that change other rules (meta-rules). |
| E5 Storyteller | Reads tags of recent events to measure tension; instances are entities with tags (`cruel`, `merciful`) that rules can change. |
| E6 Lore | World tables are tag pools; taboos are forbidden tags; legends and facts are tagged so callbacks can search them. |
| Skills and powers | Skills apply tags and fire rules. A power can be "your `fire` counts as `holy`" or "you are immune to rule X." |
| Crafting and alchemy | See [tags as the material layer](#tags-as-the-material-layer-q3). |
| Combat | Attacks, stances, wounds and terrain are tagged; counters are rules (`braced` + `sweep` → `exposed`). Links to the RNG doc's mechanical encounters. |
| Worlds and travel | A world is a rule layer. Crossing a barrier runs arrival rules on everything you carry. |
| Factions and law | Laws are rules that tag wrongdoers (`wanted`); factions react by tag. |
| UI | Hover shows tags; the log shows chains; knowledge lists show learned rules. |

### Rules about rules (the deep end)

Comprehension of a concept = **owning a rule**. A cultivator who
understands `fire` can add a personal rule (`fire` + `water` → steam that
scalds the enemy) or disable a world rule for themselves. Higher concept
tiers touch wider layers: personal → place → world → multiverse. This gives
"all paths lead to the Dao" a mechanical meaning: any skill, used enough,
leads toward owning the rules behind it. It connects to
[one skill, many Daos, and tiers of concepts](LIFE_SIM_NORTH_STAR.md#one-skill-many-daos-and-tiers-of-concepts-2026-10-08).

### Risks

- **Rewrite scope.** Moving existing features onto tags is a big change.
  Proposal: new systems use tags from day one; old ones move over only when
  touched, with an adapter that reads their facts as tags.
- **Performance.** Indexing plus chain caps; far-tier entities run no
  rules, only summaries.
- **Busted combos.** Wanted, per the north star. Log them; balance only
  what kills the fun.
- **Readability.** Every surprise must explain itself in the log, or it
  feels like a bug.

### Build-ready when

- [ ] Tag store shape (template plus instance changes) and save migration
- [ ] Rule schema, trigger list and layer order
- [ ] Index and chain cap
- [ ] Adapter from existing facts to tags
- [ ] Vanilla overlay table and an item-instance state decision (Q3)
- [ ] First cross-system proof: one tag rule that touches crafting, combat
      and a storylet in the same session

## Open questions after the layer passes (2026-10-09)

The six layer files hold 30 open questions. Under "anything is possible",
most become per-world or per-cheat settings, and each file's draft default
stands as a proposal. These five block the first Village build, ranked:

- **Q6. Village cast.** Promote the yearly household in `npc_lives.js`
  (Maia, Oren, Lio, Rhea, Neri, Nima, Iona) into live people, or start with
  freshly generated villagers and keep the household as backstory? (E2 Q3,
  E3 Q1; the battle enemy named Oren would need renaming if promoted.)
- **Q7. Item state in the first slice.** Tags on templates only, or also
  durable item state such as `wet` or `cursed` in the item key? (E4 Q1)
- **Q8. What the character may do while you're away.** Spend your coins and
  items (capped), or only take free choices until you opt in? (E2 Q2)
- **Q9. Game year length** in game days. Aging, births and the yearly
  far-tier roll depend on it. (E3 Q5)
- **Q10. Hard waits.** Build scoped pauses (one activity) now, or use the
  existing global pause first and treat `hard` as `soft` until then? (E2 Q1)

## Answers to Q6 to Q10 and what they open (2026-10-09)

Weibao's words:
- Q6: "both possible"
- Q8: "it depends on the character, and how we want things to be? would we
  be the characters, or someone guiding them, or something else entirely?
  this changes the gameplay flow accordingly"
- Q9: "unsure whats the best option, how does other idles and games do it?"
- Q10: "unsure what is most optimal"
- Q7: "we can expand on the ideas accordingly? More stuff as well? Learning
  from noita?"

### Q6. Village cast: both

Both stay reachable. A new life can start with the authored household
promoted to live people, with fresh generated villagers, or a mix (the
household as live people plus generated newcomers over time). The
`npc_lives.js` household becomes one possible starting cast, not the only
one. The battle enemy named Oren still needs a new name if the household
Oren is promoted.

### Q8. Who the player is decides what happens while you're away

This builds on [who the player is](LIFE_SIM_NORTH_STAR.md#who-the-player-is-the-character-or-someone-living-through-them-proposal-2026-10-08).
Proposal: identity is a **mode of a life**, picked at the start or changed by
events, and each mode sets control, away behavior, log voice and what failure
means. Full table in the north star section.

| Mode | You are | While you're away | Flow |
|---|---|---|---|
| A. The character | This person | Only your standing orders run; otherwise they wait | Classic RPG; you decide everything |
| B. The soul | What persists across lives | The body acts on its traits, shaped by what the soul brought | Default proposal; feels like A in the moment |
| C. The guide | An outside will | The character always has their own will; you spend influence to nudge | Management, persuasion; they can refuse |
| D. The system | The cheat or system inside them | You offer quests and rewards; they choose | Gamebook; you shape them through incentives |
| E. The lineage | A house or bloodline | Heirs live on their own; you pick who to focus on | Crusader Kings style; death is a handoff |
| F. The fate | A storyteller instance | You bend odds and cast cards, not actions | God game over one life or a world |
| G. A second soul | A passenger in a body with its owner | Owner acts; you fight for control by will | Shared-body tension, possession |

Modes can change in play: a guide merges into the body (C → A), a soul loses
its body and becomes a guide (B → C), a system awakens in a character you
were living as (A → D). That is the gameplay flow change: the same world and
systems, but different verbs and a different relationship to the person.

### Q9. How long is a year? How other games do it

**Verified in source:** the calendar is 30-day months and 12-month years
(`src/game_time.js:36-41`), and the chronicle's `GAME_YEAR` is 360 days
(`src/chronicle.js:3`). The clock advances one game minute per tick
(`src/main.js:6652`) and one tick per real second at the default
`tickrate: 1` (`src/config.js:19`). **Inference:** a game year is about
518,400 real seconds, roughly **6 real days of nonstop play**. A 60-year life
would take about a real year. So the real question is clock speed and
skipping, not the number of days in a year.

How others handle it (from memory, not re-verified; treat numbers as rough):

| Game | Year | Aging | How a long life fits |
|---|---|---|---|
| Stardew Valley | 4 seasons of 28 days | None | Years are a soft cycle, no death |
| RimWorld | 60 days (4 × 15) | One year per game year | Short year plus 1x to 3x speed |
| Dwarf Fortress | 12 × 28 days | Real aging | Fast simulation, years pass in hours |
| Crusader Kings | Real calendar | Real aging | Days fly at high speed; play the dynasty |
| The Sims | Days per life stage | Lifespan slider, can be off | Player picks lifespan length |
| BitLife | One tap = one year | Real aging | Turn-based by year; events between taps |
| Progress Knight (idle life sim) | 365 days | Real aging | About one day per real second, plus time-warp; rebirths |
| Tale of Immortal | Months as turns | Hundreds of years | Seclusion skips years at once |

Patterns: (a) shrink the year, (b) run time fast, (c) make years turns,
(d) separate aging from the calendar, (e) skip boring stretches.

**Proposal: keep the 360-day calendar** (saves already depend on it) and
make time speed a design tool, not a constant:
1. **Active moments run at 1 minute per second**, as now, for fights,
   work and conversations.
2. **Routines compress.** A day of known routine (work, study, training)
   can be lived as a summary in seconds, with storylets interrupting.
3. **Seclusion and time skips.** Training, cultivation, travel or recovery
   can jump weeks, months or years in one action, with the deck drawing a
   few cards for the skipped time (Tale of Immortal style).
4. **Life-stage speed.** Childhood can play as yearly turns (BitLife
   style), adulthood in days, old age in seasons. Each is a setting.
5. **Worlds keep their own time rates.** A year in one world can be a day in
   another, which is a multiverse mechanic by itself.
6. **Aging rate is a per-life setting** (Sims style), and some bodies,
   cheats or worlds change it.

Under "anything is possible", every pattern stays reachable. The default
target to test: one adult year in roughly 2 to 6 hours of mixed active and
skipped play, so one life fills "days and days" of play without a year
taking a real week.

### Q10. Hard waits: what's optimal

**Recommendation: skip the `hard` tier in the first build.** Use three
tiers:
- **Ambient:** resolves on its own, goes to news.
- **Soft:** waits with a timeout, then the away rule (Q8 mode) resolves it.
  This uses the existing `offer` event mode.
- **Crisis:** pauses everything, using the existing global pause
  (`src/main.js:722`, `:813`). Rare and capped by the storyteller.

Why: soft plus a timeout covers almost every case, and crisis is free today.
A scoped "pause only this activity" pause needs changes wherever the game
checks for waiting decisions (13 source files call
`waitingSimulationChoice`). Add it later only if playtest shows soft cards
being missed or crisis feeling too heavy.

### Q7. Item states, expanded with lessons from Noita

Full study: [Materials, states and Noita](emergent/E4B_MATERIALS_AND_NOITA.md).
Proposal for the first slice: states on **bodies and places** first (they
reuse the existing `conditions` expiry and ticks), a handful of durable item
states in the item key, and containers so liquids can be carried, thrown and
drunk.

## About AI writers (LLMs)

**D1 proposal: by default no LLM decides mechanics.** It can't be seeded, it breaks
save integrity and replay, and a browser game would need an API key. The
engine already has the right boundary: `acceptActorProposal` lets an outside
planner *propose* a legal command and nothing else.

Later, optional, behind a setting: an LLM may (a) rewrite the text of an
event the systems already resolved, or (b) propose a command for an NPC
through that hook. Its output is saved as text, so reloads don't regenerate
it. An opt-in LLM-proposer mode could go further and propose mechanics or
irreversible NPC choices, still validated and saved once. The game must be
fully playable with it off.

## How the layers combine (worked example)

Day 12, Village. The **director** (E5) sees 4 calm days and raises threats a
little. The `village.daily` deck (E2) draws "debt collector visits," casting
Oren, who is `indebted` because his **utility brain** (E3) borrowed money
last week to fix his roof. The player walks past. Oren gains the memory
"ignored me," and his `belonging` need drops. Two days later Oren, `proud`
and `angry`, gets drunk at the tavern. The **rule** `drunk_gossip` (E4)
fires, and he leaks that the player owns a `cursed` ring that Oren saw. A
`greedy` neighbor hears it. The rule `greed_meets_cursed` lines up for when
she gets the ring. A **callback card** (E6) is now eligible: "someone tried
your door at night." None of this was written as a story.

## Build order (proposal)

1. **E1 + E2 + E6 tables** in the Village: the deck, 20 cards, Village name
   and job tables, on named streams. This is the foundation and the first
   thing you can play.
2. **E4** with 10 tags and 15 rules, hooked into cards and item use.
3. **E3** upgrade for 4 villagers: traits, needs, goals, utility brains.
4. **E5** Steady director over the deck.
5. **E6** grammars, callbacks and yearly legends.
6. Then widen: more decks, other worlds' tables and physics, named enemies
   as people, far-tier simulation.

**Revised after "tags everywhere" (2026-10-09):** the tag store and rule
engine become step 1, because every other layer reads tags. Proposed order:
tag store + rule engine with a small Village rule set → storylet deck on tags
→ people on tags → storyteller instances → tag-based alchemy/crafting as the
first big overhaul → lore grammars and legends → widen across worlds.

Each step ends playable, per AGENTS.md. Each "build-ready" checklist above is
the gate for starting that step.

## On "comprehensive before implementing"

Proposal: treat "comprehensive" as the build-ready checklist, not as
finished design. Emergent systems can't be fully designed on paper. Their
tuning (weights, decay rates, chain caps, how cutthroat) only shows up in
play. The plan is to spec each layer to its checklist, build the smallest
proof, play it, then expand the spec from what actually happened.
