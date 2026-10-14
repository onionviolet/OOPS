# E2 Storylets: build-ready draft (proposal)

Claude, 2026-10-09. Expands layer E2 of [Emergent systems](../EMERGENT_SYSTEMS.md#e2-storylets).
Names follow [the shared vocabulary](SHARED_VOCABULARY.md); additions are
listed at the end. Principle: [anything is possible](../USER_VISION.md#anything-is-possible-2026-10-09).
Where there are several answers, the card, deck, world, storyteller, cheat or
player picks, and every option stays reachable.

**The 2026-10-09 draft below remains a proposal** except its verified source facts.

## P3 implementation status, 2026-10-13

Weibao authorized the bounded P3 deck slice. Fourteen cards now draw from four
saved competing Village decks after explicit opt-in. Storylet decisions retain
their mode but continue played time and expire safely; existing decisions retain
their global pause. Single-target fixed-contact adaptation and faster cadence
are implementation choices, not acceptance of the entire draft. Unknown-fact
negation also fails in the live rules, requiring explicit local defaults.

The [P3 report](../gm/dispatch/procgen-2026-10-13/p3/REPORT.md) owns exact source,
rebuilt desktop, natural and seeded-native persistence evidence and shared-file
edits. Its [backlog](../gm/dispatch/procgen-2026-10-13/p3/BACKLOG.md) owns unverified
native branches and deferred casting/storyteller/season/remaining-card work.
The original sketches and questions below are preserved as dated design history;
this slice does not implement all twenty cards or the full E2 engine.

## 1. Verified source facts (read 2026-10-09)

Each line is checked against the file named. Section 2 lists where these
disagree with the parent doc.

- **V1.** `occur()` (`src/simulation.js:383`) builds one event record from a
  definition: `id`, `definitionId`, `actorId`, `targetId`, `mode`, `expiresAt`,
  a *copy* of `responses` and `onExpire`, `discoveredBy`, `cause`. Ambient
  events resolve at once. `public` events write to the log and show to the
  player. Terminal events are pruned to 100 (`:395`).
- **V2.** Event modes are `ambient`, `offer` and `decision`
  (`src/simulation_contracts.js:137`). The parent doc lists only two.
- **V3.** Expiry skips a player `decision` the player has seen
  (`src/simulation.js:481`): such a decision never times out. `offer` and
  `ambient` do expire and run `onExpire`.
- **V4.** A waiting player `decision` (`waitingSimulationChoice`,
  `simulation.js:79`) blocks every new command (`simulation.js:103`), stops the
  time-advance loop (`expansion_engine.js:597`, `stoppedAtChoice`), and blocks
  travel, trading and native actions (`main.js:722,813,1217`;
  `native_gameplay_adapter.js:48`). Today a `decision` is a global pause.
- **V5.** Each automatic event has its own check
  `{due, interval, rng, count}` (`simulation.js:64`). At each due check
  (`:484-497`) the engine tests `requires`, blocks a duplicate open event of the
  same definition, resolves `chance` from facts, draws from the per-check
  xorshift32 (`draw`, `:34`), and applies `guaranteeAfter` (pity) and
  `maxOccurrences`. Checks never compare events with each other.
- **V6.** The `event` effect (`simulation_effects.js:319`) schedules an event
  check after `delay` with id `event:<cause>:<eventId>:<actor>`. It is
  one-shot only if the definition has `maxOccurrences: 1`.
- **V7.** Predicates allow only `eq`, `gte`, `lte`, with `all`, `any`, `not`
  (`simulation_contracts.js:28-35`, `rules.js`). There is no `neq`.
  Unknown facts count as not known, so a missing fact fails a positive test.
- **V8.** The `fact` effect only *sets* a value (`simulation_effects.js:188`).
  The `resource` effect *adds* and rejects results below 0 (`:191-197`).
  Money for the player is `{type:'resource', native:true, key:'money'}`.
- **V9.** Effect selectors accept only `$actor`, `$target`, `$party`,
  `$spawn.<key>` or a stable ID (`simulation_contracts.js:37`). There is no
  per-card role such as `$who`. `participant()` maps only `$target` and
  `$actor` (`simulation_effects.js:53`).
- **V10.** `simulationFacts` exposes `relationship.*` and `person.<id>.*`
  knowledge only for the single `targetId` of the context (`:~108`). One event
  carries one `targetId`.
- **V11.** `spawn` creates a person from a frozen template with a stable
  `personId` or `instanceKey` (`simulation_contracts.js:47-52`;
  `simulation_effects.js:147`).
- **V12.** `relationship` effects write axes and memories (last 32), with a
  per-cause receipt so one cause cannot farm favor (`simulation_effects.js:229`).
- **V13.** The `event` feed (`src/event_feed.js`) turns player-visible open
  events into "leads" with a "View responses" action, and resolved or expired
  ones into news. News is capped at 8 (`event_feed.js:102`). The comment at the
  top says it never projects the global simulation log.
- **V14.** Calendar: 30-day months, 12 months, `GAME_YEAR = 360 * 24 * 60`
  game minutes (`chronicle.js:3,91`). No `season` fact exists in
  `simulationFacts`. Host facts include `day.hour`, `weather.raining`,
  `weather.damp` (`main.js:541`).
- **V15.** Only played game time advances the simulation (log text,
  `simulation.js:67`). Nothing runs while the tab is closed.
- **V16.** Real Village content: the elder (`village.elderMet`), the old
  craftsman (`oldCraftsman`, facts `village.craftsmanMet`,
  `village.craftsmanIrritated`, `actor.village.tokenReturned`), Tessa the
  patrol colleague (`village_career.js:105`, kit debt 50 coins), Nell, Roe,
  Tarin, Asha, Orin (`causal_story_ids.js:11`), Iona the recruit, Tamsin the
  visitor (`event_feed.js`). Items: Rough wood log, Survey rope, Weathered
  route notes, Surveyor's brass token, Prepared survey kit; wooden coins.
  Places: Village, Shack, Infested field, Infested woods, Eastern mill (NPC
  `villageMillers`), Nearby cave, Forest road, the river with old structures
  on the far bank (`data/locations.js:297-743`). Vanilla ambient lines already
  include "Anyone seen my cow?", "Tomorrow I'm gonna fix the roof" and the rats
  almost eating a cat.
- **V17.** Oren, Maia, Lio, Neri, Rhea and Nima exist only in
  `src/npc_lives.js`: a yearly, hash-timed record with no location, no
  inventory and no actor. They cannot be cast as `person` today.
- **V18.** The one existing random Village event is `village.shower`
  (`simulation_content.js:103`): `offer` mode, `lifetime 8`, `maxOccurrences 1`,
  two responses, `onExpire`. It is the template for a ported card.

## 2. Where the source contradicts the parent doc

- **X1.** The doc's example uses `neq` and `'add'` on a fact. Neither exists
  (V7, V8). Use `not` and a `resource` or a counter fact.
- **X2.** The doc says Hard cards pause "only the activity they touch."
  Today a decision pauses everything (V4). Hard needs new work; Crisis is the
  existing behavior for free.
- **X3.** The doc says timeouts and `onIgnore` use `onExpire`. For a seen
  player decision they never fire (V3). Soft maps to `offer`, which does expire.
- **X4.** O5 "while you were offline" cannot happen (V15). Letters can queue
  only during long played activities until an offline-progress decision exists.
- **X5.** The doc names Oren as a casting example. He is not castable (V17).
- **X6.** "Cast" in the doc implies several people per card; an event holds
  one `targetId` and facts see one target (V9, V10).

## 3. Card schema (final proposal)

Binding shape from the vocabulary, field by field. "Maps to" is the existing
event field. "New" is engine work.

```js
{ id, deck, tags, needs, cast, weight, cooldown, once, urgency, timeout,
  text, choices, onIgnore, sets,
  // additions (listed in the vocabulary file):
  stage, world, hint, blocks, fallback, travels, createdBy, receipt }
```

| Field | Rule | Maps to | New work |
|---|---|---|---|
| `id` | `stableId`, unique, `<world>.<name>` | `definitionId` | none |
| `deck` | must name a registered deck | n/a | new `decks` registry family |
| `tags` | 1 to 6 tags; exactly one of `daily people opportunity threat callback rare`; extras from the vocabulary (`money`, `romance`, `crime`, `family`) | none | tag read by weights and E5 |
| `needs` | a `meets` rule over facts; no `neq`; facts may be `cast.<role>.*` | `requires` | `cast.<role>.*` fact builder (V10) |
| `cast` | map role to a casting spec (section 6); max 4 roles; role `actor` is always the player | `actorId`, `targetId` plus rewritten effects | new casting pass (V9) |
| `weight` | `base` 0..20; `plus`: up to 6 `{when, add}` or `{fact, scale}`; result clamped to 0 or more | `chance` (replaced) | new draw |
| `cooldown` | `self` and `cast` in game minutes; `cast` blocks reusing the same person | none | per-card record (section 5) |
| `once` | true means never again in this life | `maxOccurrences: 1` | record survives card removal |
| `urgency` | `ambient soft hard crisis` | `ambient offer decision decision` | `hard` scope (X2) |
| `timeout` | game minutes; required for `soft`, optional for `hard`; absent for `ambient`, `crisis` | `lifetime` | `fallbackAt` for decisions (V3) |
| `text` | string with `#role.name#` slots; max 240 chars; E6 grammar later | `label` | slot filler |
| `choices` | 1 to 5; each `{id, label, requires, costs, effects, tags}`; `costs` use the `spending` rules (resource, vital, item, transfer, custody, energy) | `responses` | choice `tags` (new, used by orders and fallback) |
| `onIgnore` | effects when the card times out unanswered | `onExpire` | none for `soft`; fallback hook for `hard` |
| `sets` | list of fact keys the card may write; every `fact` or `resource` effect key must appear here | none | validator and chain lint |
| `stage` | optional list: `child young middle old later` | none | read the life stage from the chronicle |
| `world` | optional world ID; absent means portable (portable cards may use only portable tags) | `worldId` check | lore guard |
| `hint` | one line: "because #who.name# owes 40 coins"; may use slots | none | feeds the "why" hover |
| `blocks` | `none`, `activity`, `place`, `all` | none | new scoped waiting rule (X2) |
| `fallback` | `{safe: <choiceId>}` choice used when the character acts for you | none | O3 scorer |
| `travels` | true: the card moves with its cast person (section 9) | none | per-person card list |
| `createdBy` | set on cards an NPC or the player wrote (section 9) | none | runtime card registry |
| `receipt` | engine-filled: deck, counter, roll, top weights, cast | event `roll` plus new | saved with the event |

### Validation rules
1. `id` unique across registry; `deck` exists; `world` exists.
2. `needs`, every `choice.requires`: pass `validatePredicate`. All fact names
   either exist in a fact builder or appear in some card's `sets` (lint warns
   on a fact nobody sets).
3. Every effect passes `validateSimulationEffect`. No effect may name a hardcoded
   person unless the card has tag `callback` and a `world` (rule from the parent
   doc: no hardcoded people except callbacks).
4. `choices` always include one that costs nothing and needs nothing
   (the "walk past" choice), unless urgency is `crisis`.
5. `soft` needs `timeout`. `ambient` has no `choices`. `hard` and `crisis` have
   at least two.
6. `onIgnore` required on `soft`, so ignoring always changes the world a little.
7. A card with more than 25 lines or a host file is a quest, not a card.
8. `sets` keys follow the fact naming rule: dotted, lowercase, world-scoped.

### How a drawn card becomes a saved event
1. Cast people are chosen and frozen (section 6).
2. The card is compiled into a plain event definition with every `$role` and
   `#slot#` replaced by concrete IDs and text.
3. `occur()` stores it. Because `occur` copies `responses` (V1), a saved event
   stays self-contained and never re-reads the card, so editing a card later
   cannot break an old save.
4. The `receipt` goes on the event for the "why" hover.

**New engine work, ranked:** (1) deck record and draw loop; (2) casting pass and
role rewrite (V9); (3) scoped waiting and decision fallback (V3, V4);
(4) `cast.<role>.*` facts (V10); (5) a calendar `season` fact (V14); (6) a
roster adapter so `npc_lives` people can be cast (V17); (7) runtime cards for
NPC and player authors.

## 4. Decks and tick rates

A deck is `{id, scope, interval, slot, quiet, perTick, gate}`, saved as
`simulation.decks[deckId] = {due, interval, rng, drawn, nulls, pity:{}, cards:{}}`.
`rng` is the `deck:<deckId>` stream; it starts as `hash(seed, 'deck:'+id)`, the
same rule checks use today (V5). Decks are included when the next boundary is
computed, so time-advance stops at each due deck.

| Deck | Scope | Interval (game min) | Slot | `quiet` | Role |
|---|---|---|---|---|---|
| `village.daily` | Village | 1440 | 07:00 | 3 | texture, small people moments |
| `village.people` | Village | 1440 | 13:00 | 4 | debts, feuds, illness, romance |
| `village.chances` | Village | 2880 | 10:00 | 4 | teachers, peddlers, jobs, apprenticeships |
| `village.threats` | Village | 4320 | 16:00 | 6 | rats, scouts, fever; gated by E5 |
| `village.seasonal` | Village | 10800 (3 months) | day 1 | 0 | festival, harvest, winter (needs `season`) |
| `road.travel` | route | per leg, at start and midpoint | n/a | 5 | travel cards (240-min Forest road gives 2 draws) |
| `life.milestone` | person | on birthday | n/a | 0 | stage cards by age |
| `rare.anywhere` | any world | 10080 (7 days) | 03:00 | 40 | life-changing; portable only |

`quiet` is the weight of "nothing happens." Expected load at default weights:
about 1.5 cards per game day in Village. How many real minutes that is depends
on how fast idle play moves time; this is the first number to tune.

### Draw algorithm (one deck tick)
1. **Due?** Deck due <= clock. Advance `due += interval` first, so a long jump
   catches up one tick at a time, capped at 8 catch-up ticks per advance
   (the 512-boundary cap, V5, still applies).
2. **Gate.** Ask E5 `gate(deck)`. A closed gate (for example "no second threat
   within 3 days") means skip with a receipt. Default gate: open.
3. **Collect.** Cards in this deck, plus cards whose `world` matches and whose
   deck is `anywhere` when the deck lists them in `pulls`.
4. **Hard filters.** Drop a card when any is true: `needs` fails;
   `once` already used; `clock < last[card] + cooldown.self`; stage or world
   mismatch; a lore guard forbids one of its tags; an open event of the same
   card exists; or a dry-run cast fails (section 6).
5. **Weight.**
   `w = max(0, base + sum(plus))`
   `w *= seenFactor` where `seenFactor = max(0.1, 0.6 ^ seen)`
   `w *= product over storyteller instances (world, place, fate) of mult[tag]`,
   taking the strongest multiplier per instance for that card's tags, each
   clamped to 0.05..5
   `w *= familyEcho` where `familyEcho = 0.5` if the last drawn card of this
   deck shared its family tag, else 1
   `w *= pityBoost[family]` (step 6)
6. **Pity.** Each family has `miss[family]`, counting draws in this deck where
   no card of that family was picked while one was eligible. After the deck's
   `pityAfter` (default 6), `pityBoost = 1 + 0.25 * (miss - pityAfter)`, max 4.
   `rare` also has a hard guarantee: if `miss >= guaranteeAfter` (default 40
   draws, about 9 months) the draw is forced to the rare family. This mirrors
   `guaranteeAfter` in V5. Good-luck pity: three bad outcomes in a row (a card
   whose chosen choice lost money or health) adds 0.5 to every `opportunity`
   boost.
7. **Quiet weight.** `quiet` is also scaled by E5 comfort, so a deck still has
   calm days.
8. **Roll.** One draw `r` from the deck stream times `total = sum(w) + quiet`.
   Walk the sorted list (sort by card id first so order never depends on
   registry load order). Record the roll and the top three candidates.
9. **Cast for real** with the same stream (section 6). If casting fails here
   after passing the dry run, discard and redraw once, then record a null.
10. **Resolve urgency** (section 7): ambient resolves, soft and hard may match a
    standing order before they wait.
11. **Commit counters:** `seen[card]++`, `last[card]=clock`,
    `cast[personId]=clock`, `drawn++`, family misses reset for the picked
    family and incremented for the others that were eligible.
12. **Receipt** to the event and to a ring buffer of the last 20 draws per deck
    (the director log E5 reads).

Preview never draws (as `commit` vs `preview` do today, parent doc). A cheat
with `See` access (Q5) reads the same algorithm in preview.

## 5. Per-card record

```js
simulation.decks['village.daily'].cards['village.cow_on_the_road'] =
  { seen: 2, last: 91440, cast: {villager: 'person:spawn:deck:cow_owner'}, outcome: 'ignored' }
```

Capped at 400 cards per deck; the oldest `outcome`-less records compact into
`seen` counts only. History facts (`history.<eventId>`) are written by the card's
own effects, not by this record.

## 6. Casting algorithm

A role spec: `{ pick, where, prefer, spawn, distinct }`.

1. Order roles as written. `actor` (the player) is bound first.
2. For each role, build a candidate list by `pick`:
   `villager` (anyone alive in the player's location or world),
   `stranger` (nobody; always spawn), `named` (a fixed ID, callbacks only),
   `tagged:<tag>`, `relation:<tag>` (from the player's relationships).
3. Filter each candidate with `where`, a `meets` rule over a **light person
   fact set** `personFacts(state, id)`: life state, location, resources,
   `actor.*` facts, tags, relationship to the player. Not the full
   `simulationFacts` (too heavy per candidate).
4. Drop candidates already bound to another role (`distinct` default true), dead
   or departed ones, those in `cast` cooldown, and those occupied by a job or
   session (`simulationOccupiesActor`, `simulation.js:~42`).
5. Score survivors: `1 + 2*(prefer matches) + 1*(opens relationship tie to the
   player) - 0.5*(times cast in the last 10 days)`. Draw one by weight from the
   deck stream. A tiny pool (one candidate) skips the draw.
6. If the pool is empty and `spawn` is set, spawn from the world's cast
   template using key `<cardId>:<role>:<counter>`. That gives a stable ID of
   shape `person:spawn:<cardId>:<role>-<n>` and keeps replays identical (V11).
   If no `spawn`, the dry run fails and the card is out for this tick.
7. Freeze: `cast = {role: personId}`. The main role becomes `targetId`. The
   other roles are rewritten into every effect and `requires` as concrete IDs
   (V9). `cast.<role>.*` facts are filled for `needs` checks that need them.
8. Cards can ask for **lasting** casts: `cast: {who: {keep: 'roof_owner'}}`
   reuses the person already bound under `deck.<id>.bind.roof_owner`, which is
   how a chain keeps the same villager across cards.

Casting pool until E3 exists: the Village has only a few real simulation
people (V16, V17). Proposal: `village.population` is a small table of 8 to 12
generated villagers spawned at enrollment with traits as tags, so the pool is
never empty. Oren, Maia and Lio join through the roster adapter as
`named` casts for callbacks only.

## 7. Urgency tiers, standing orders and the character acts

### Tiers (Q1, O1)

| Tier | Event mode | Waits? | Blocks | On timeout |
|---|---|---|---|---|
| `ambient` | `ambient` | never | nothing | n/a; goes to news |
| `soft` | `offer` | yes, in the events panel | nothing | `onIgnore` runs |
| `hard` | `decision` | yes | scoped by `blocks` | fallback ladder |
| `crisis` | `decision` | yes | all (today's behavior, V4) | fallback ladder, long timeout |

`blocks` values: `activity` (the touched job pauses; a shop closes, a patrol
stops), `place` (the player cannot leave this place), `all` (global pause).
Implementation of scoping: replace the single global test in
`waitingSimulationChoice` with a test that takes the thing being started
(`startCommand`, travel, trade) and compares it to the open event's `blocks`
and `tags`. Today's callers all pass "any", so the default stays safe.

Caps (E5 enforces): at most one `crisis` open at a time and one per 3 game days
(defaults; per "anything is possible", a world or storyteller may override); at most two `hard` open; unlimited `soft`.

### Fallback ladder for a `hard` or `crisis` card whose `timeout` is reached
Proposal field `fallbackAt = at + timeout`. A new pass at the same place as
the expiry loop (`simulation.js:481`) handles decisions that currently never
expire (V3).
1. **Standing order** (O2): first enabled order matching the card.
2. **Character acts** (O3): the scorer below.
3. **Letter** (O5): if the card has `irreversible` choices and no safe choice,
   it becomes a letter and waits up to 3 more game days; then `onIgnore`.

Soft cards use the same ladder at *draw time* (orders first) and at expiry
(`onIgnore`), because they never block.

### Standing orders (O2)

```js
{ id: 'order:help_debtors', owner: 'player', enabled: true, priority: 5,
  when: { tags: ['money','people'], urgency: ['soft','hard'],
          extra: { fact: 'resource.money', op: 'gte', value: 30 } },
  do: { choiceTag: 'help' },                       // or { choiceId }
  limits: { maxCost: 20, perDay: 2, onlyWhenAway: false } }
```

Match rules: highest priority first; the card must have a choice with the
`do` tag whose costs are within `limits`; `requires` must pass; the order may
not pick a choice tagged `irreversible` unless the order names it. Every use is
logged as "Your order 'help debtors' paid 20 coins for Oren" and counts against
`perDay`. Orders are plain saved data, so the player writes them in a small
form (pick card tags or one card, a choice tag, a cap). Player-written orders
are listed in section 9.

### The character acts in character (O3)

Choice tags are a small set: `help`, `profit`, `risk`, `avoid`, `violence`,
`honest`, `deceive`, `pay`, `learn`, `irreversible`, `safe`.

`score(choice) = sum over choice.tags of affinity[trait][tag]`
`+ 1.5 * relationship(player, target) / 10`
`- costPenalty * (0.5 if greedy else 0.2)`
`+ noise from fate:player * 0.3`
Starter affinities (proposal): `kind` help +2, pay +1; `greedy` profit +2,
pay -1; `brave` risk +1, violence +1; `cowardly` risk -3, avoid +2; `honest`
deceive -3; `curious` learn +2; `lazy` avoid +1, pay 0; `vengeful`
violence +2 against a `grudge`. The top score wins; ties fall to `fallback.safe`.
Never auto-chosen: any choice tagged `irreversible`, any cost above 25 percent
of the player's money, any choice with a lethal risk tag. Then step 3 applies.

The log line says why: "You were away. Weibao's character, who is kind and
owed Oren, paid 20 coins." The trait list is the player's current `traits`
(E3 Person). Drift (proposal): each fallback pick adds 1 to a hidden
`habit.<tag>`; at 10 the trait strength moves one step. A life lived mostly by
fallback drifts toward its traits, which is the point of O3.

### Autonomy slider (O4) and letters (O5)
- Slider 0..3 per life. 0 promotes `soft` to `hard`. 1 is default. 2 lets
  orders and fallback run immediately for `soft`. 3 does that for `hard` too.
  `crisis` always waits at levels 0 to 2.
- Letters: a bundle of `soft` and fallback-pending cards shown on return from a
  long activity or travel leg: "While you walked, 4 things happened; 1 needs
  you." Offline letters need an offline-progress decision first (X4).

## 8. Where cards appear in the original UI

Follows "follow the UI of the original" and the center menu as the main surface.
All proposals; nothing new window-wise.

| Surface | What it shows | Source |
|---|---|---|
| Center menu (Village `field_panel` / `simulation_panel`) | Open `soft` and `hard` cards as an "Open matters" list with their choices and costs, ordered by time left | existing leads path (V13) |
| Events panel (side log, "World events" feed) | New cards as one-line leads ("Oren's roof gave way · 18 h left"), expiry notices, and the news of ambient cards | `event_feed.js` leads and news |
| News | Ambient cards and resolved or expired cards, with `hint` lines | news list; raise the cap of 8 to 12 or add a "Today" filter |
| Bio ("More details in bio") | Life filter: cards that changed a relationship, set a `history.*` fact or ended with a notable choice, compacted by year | chronicle log, `life` list in the feed |
| Hover | "Why now" (`hint` plus weights if a See power is owned); cast names; which orders could answer | receipt |
| Notebook (`simulation_panel`) | "Ways I live": standing orders, autonomy slider, last 10 fallback picks | new panel section |
| Toast or pulse | `crisis` only, small, with the reduce-motion setting | text effects section of the north star |

`ambient` cards never need the center menu. `hard` cards appear there with a
clear "this stops: your patrol" line when `blocks` is not `all`.

## 9. Variants

- **Life stage decks.** `life.milestone` and every deck honor `stage`. Child:
  threats mostly off (E5), `family` and learning cards up. Young: romance,
  rivals, jobs. Middle: debts, followers, offices. Old: heirs, teaching,
  illness, grief. Later lives: past-life echoes (C20). The child deck is
  authored; adult decks reuse it with a cast swap (a parent becomes the
  child's `who`).
- **World decks.** Each world registers its own decks and cast templates, plus
  `pulls: ['rare.anywhere']`. Portable cards may use only portable tags.
  A world's default storyteller lowers or raises tags (Cyoria: `crime` x0.5,
  `learning` x2). Lore guards forbid tags (no `gun` in Village).
- **Cards that travel with a person.** `travels: true` and a cast person marks
  the card as *carried*. It lives in that person's `cards` list and is drawn at
  `road.travel` and on arrival in a new world, whichever deck is active. A
  student carries "a rival from home" to a new world (the `family`/`grudge`
  tags cross worlds); a cursed item carries its own cards. C20 is one.
- **Cards created by NPCs.** `createdBy: <personId>`. An NPC controller action
  (E3) may write a runtime card from a template ("post a notice on the board")
  into `simulation.cardsRuntime`; it lasts until `timeout`. The player sees it
  as an ordinary lead with the author named. Limits: at most 3 runtime cards
  per NPC, each built from an approved template (never free text), so the
  save stays small and validation passes.
- **Player-written standing orders.** Section 7. The same form can write a
  *runtime card* from a template for the player's own purposes ("remind me to
  check on Lio every season"), `createdBy: 'player'`.
- **Cheats.** `Pin` forces the next draw's family; `See` reads the receipt in
  preview; `Reroll` replaces one drawn card and keeps the original in the log.
  All use the deck stream, so they work with no extra card data.

## 10. Card shorthand for the sketches

Not new syntax: shorthand for the real structures. `F(k,op,v)` is
`{fact:k, op, value:v}`. `all/any/not` are the real combinators. Effects:
`fact(k,v)` is `{type:'fact', scope:'world', key:k, value:v}` (`scope:'actor'`
when written `afact`); `res(who,k,n)` is `{type:'resource', actor:who, key:k,
amount:n}`; `money(n)` is the native resource effect; `rel(who,axis,n,text)` is
`{type:'relationship', actor:'$actor', target:who, axis, amount:n, text}`;
`item(k,n)` and `xp(skill,n)` are the real item and xp effects. `tag(who,t)`
and `untag` are **new** (E4); until E4 exists they are written as an actor
fact `tag.<name>`. `$role` is rewritten at cast time (V9). Times are game
minutes; `DAY = 1440`. Every draft carries a `hint`.

## 11. The first 20 Village cards (data sketches, proposal)

All are in `village.*` decks. Weights are first guesses.

### Daily texture

```js
{ id:'village.cow_on_the_road', deck:'village.daily', tags:['daily'], urgency:'ambient',        // C01
  cast:{ owner:{pick:'villager'} }, weight:{base:4}, cooldown:{self:6*DAY},
  text:'#owner.name# is out on the road asking everyone if they have seen a cow.',
  hint:'Texture. A vanilla Village line made into an event.', sets:[] }

{ id:'village.roof_promise', deck:'village.daily', tags:['daily','people'], urgency:'ambient',   // C02
  cast:{ owner:{pick:'villager', keep:'roof_owner', where:not(F('cast.owner.roof.fixed','eq',true))} },
  weight:{base:3}, cooldown:{self:4*DAY, cast:2*DAY},
  text:'#owner.name# tells the whole road they will fix the roof tomorrow.',
  effects:[ res('$owner','roof_neglect',1) ], sets:['resource.roof_neglect'] }
// Chain A step 1. Seen 3 times for the same owner makes C07 eligible.

{ id:'village.shower_bench', deck:'village.daily', tags:['daily'], urgency:'soft', timeout:480, // C03
  weight:{base:2, plus:[{when:F('weather.damp','eq',true), add:4}]}, once:true,
  needs:F('world.workbench.wet','eq',false),
  text:'A short shower reaches the Village workbench.',
  choices:[
    {id:'cover', label:'Cover the bench', costs:[money(-1)], tags:['help','pay'],
     effects:[ fact('workbench.wet',false), rel('oldCraftsman','respect',1,'Covered the bench during the shower.') ]},
    {id:'wait',  label:'Let it dry naturally', tags:['avoid','safe'], effects:[fact('workbench.wet',false)]} ],
  onIgnore:[ fact('workbench.wet',false) ], fallback:{safe:'wait'} }
// Port of village.shower (V18). Same effects; the deck now chooses when.

{ id:'village.rats_nearly_ate_cat', deck:'village.daily', tags:['daily','threat'], urgency:'soft', timeout:2*DAY, // C04
  cast:{ owner:{pick:'villager'} },
  needs:F('world.rats.pressure','gte',2), weight:{base:3, plus:[{fact:'world.rats.pressure', scale:1}]},
  text:'#owner.name#\'s cat came home with a torn ear. "Those rats are getting bold."',
  choices:[
    {id:'coin',  label:'Give #owner.name# a coin for a trap', costs:[money(-1)], tags:['help','pay'],
     effects:[ rel('$owner','trust',1,'Gave me a coin for a trap.'), fact('rats.pressure_trap',true) ]},
    {id:'hunt',  label:'Promise to thin the rats in the Infested field', tags:['help','risk'],
     effects:[ rel('$owner','respect',2,'Said you would clear the field.'), fact('rats.promised',true) ]},
    {id:'pass',  label:'Pat the cat and move on', tags:['avoid','safe'], effects:[] } ],
  onIgnore:[ fact('rats.pressure',3) ], sets:['world.rats.pressure_trap','world.rats.promised','world.rats.pressure'] }

{ id:'village.stray_dog', deck:'village.daily', tags:['daily'], urgency:'soft', timeout:DAY,   // C05
  weight:{base:2}, once:true, needs:not(F('actor.tag.dog','eq',true)),
  text:'A thin dog has followed you from the Eastern mill road. It watches your hands.',
  choices:[
    {id:'feed', label:'Share your food', costs:[item('Bread',-1)], tags:['help','pay'],
     effects:[ afact('tag.dog',true), rel('$dog','trust',3,'Fed me when I had nothing.') ]},
    {id:'shoo', label:'Send it off', tags:['avoid'], effects:[ fact('dog.driven_off',true) ]} ],
  cast:{ dog:{pick:'stranger', spawn:'village.dog'} }, onIgnore:[ fact('dog.driven_off',true) ],
  sets:['actor.tag.dog','world.dog.driven_off'] }
// Chain B step 1. Item key "Bread" is a placeholder: use a real Village food item.
```

### People problems

```js
{ id:'village.debt_collector_visits', deck:'village.people', tags:['people','money','crime'], // C06
  urgency:'hard', blocks:'activity', timeout:6*60,
  needs:all(F('cast.who.resource.debt','gte',30)),
  cast:{ who:{pick:'villager', where:F('resource.debt','gte',30), keep:'roof_owner'},
         collector:{pick:'stranger', spawn:'world.collector'} },
  weight:{base:3, plus:[{fact:'world.tension', scale:-0.05}]}, cooldown:{self:30*DAY, cast:10*DAY},
  text:'#collector.name# knocks on #who.name#\'s door, smiling too much.',
  hint:'because #who.name# owes #who.debt# coins',
  choices:[
    {id:'pay', label:'Pay part of the debt for them', costs:[money(-20)], tags:['help','pay'],
     effects:[ rel('$who','trust',2,'Paid part of my debt.'), res('$who','debt',-20) ]},
    {id:'stand', label:'Stand beside them', requires:F('strength','gte',8), tags:['help','risk','violence'],
     effects:[ rel('$collector','respect',-3,'Stood in my way.'), afact('grudge.collector',true) ]},
    {id:'walk', label:'Walk past', tags:['avoid','safe'],
     effects:[ rel('$who','trust',-2,'Walked past.'), fact('village.ignored_debt',true) ]} ],
  fallback:{safe:'walk'}, sets:['resource.debt','village.ignored_debt','actor.grudge.collector'] }
// Chain A step 3. Real money, real choices; the walk-past is a safe default.

{ id:'village.roof_gives_way', deck:'village.people', tags:['people','money','family'], // C07
  urgency:'soft', timeout:3*DAY,
  needs:F('cast.owner.resource.roof_neglect','gte',3), cast:{ owner:{keep:'roof_owner'} },
  weight:{base:5, plus:[{when:F('weather.raining','eq',true), add:6}]},
  text:'#owner.name#\'s roof gave way in the night. The rain came straight in.',
  hint:'because #owner.name# kept promising to fix it',
  choices:[
    {id:'repair', label:'Help with the roof', costs:[item('Rough wood log',-2)], tags:['help'],
     effects:[ rel('$owner','trust',3,'Helped me fix the roof.'), res('$owner','roof_neglect',-3) ]},
    {id:'lend', label:'Lend #owner.name# 40 coins', costs:[money(-40)], tags:['help','pay','irreversible'],
     effects:[ res('$owner','roof_neglect',-3), rel('$owner','trust',2,'Lent me the roof money.') ]},
    {id:'leave', label:'Leave them to it', tags:['avoid','safe'], effects:[] } ],
  onIgnore:[ res('$owner','debt',40), res('$owner','roof_neglect',-3) ],
  sets:['resource.debt','resource.roof_neglect'] }
// Chain A step 2. Ignored: the owner borrows 40 to repair, and C06 becomes eligible.

{ id:'village.fence_feud', deck:'village.people', tags:['people'], urgency:'soft', timeout:2*DAY, // C08
  cast:{ a:{pick:'villager'}, b:{pick:'villager', where:not(F('cast.a.rel.friend','eq',true))} },
  weight:{base:3, plus:[{when:F('village.harvest.poor','eq',true), add:3}]}, cooldown:{self:20*DAY, cast:8*DAY},
  text:'#a.name# and #b.name# argue loudly over where a fence ends and a field begins.',
  choices:[
    {id:'mediate', label:'Walk the line with both of them', requires:F('actor.charisma','gte',3), tags:['help','honest'],
     effects:[ rel('$a','trust',2,'Settled the fence fairly.'), rel('$b','trust',2,'Settled the fence fairly.') ]},
    {id:'side_a', label:'Side with #a.name#', tags:['deceive'],
     effects:[ rel('$a','trust',3,'Took my side.'), rel('$b','trust',-3,'Took the other side.'), fact('village.feud.open',true) ]},
    {id:'pass', label:'Stay out of it', tags:['avoid','safe'], effects:[ fact('village.feud.open',true) ] } ],
  onIgnore:[ fact('village.feud.open',true) ], sets:['world.village.feud.open'] }

{ id:'village.kit_ledger', deck:'village.people', tags:['people','money','callback'], urgency:'soft', timeout:2*DAY, // C09
  cast:{ tessa:{pick:'named', id:'tessa'} },
  needs:all(F('actor.village.career.kit_debt','gte',1), F('target.life','eq','alive')),
  weight:{base:6}, cooldown:{self:12*DAY},
  text:'Tessa taps the ledger. "Fifty coins for the lantern and baton, still open."',
  choices:[
    {id:'pay', label:'Pay what you can', costs:[money(-10)], tags:['pay','honest'],
     effects:[ rel('tessa','trust',2,'Paid toward the kit debt.') ]},
    {id:'work', label:'Offer to walk a patrol round', tags:['help'], effects:[ fact('village.career.offered_shift',true) ]},
    {id:'dodge', label:'Say you will get to it', tags:['avoid','deceive'], effects:[ rel('tessa','trust',-1,'Put off the kit debt.') ]} ],
  onIgnore:[ rel('tessa','trust',-1,'Let the kit debt sit.') ], sets:['actor.village.career.offered_shift'] }
// Callback to village_career.js (V16). The fact name is a proposal: the career state is not yet exposed as a fact.

{ id:'village.child_has_fever', deck:'village.people', tags:['people','family'], urgency:'hard', blocks:'place', timeout:DAY, // C10
  cast:{ child:{pick:'villager', where:F('actor.age','lte',12)}, parent:{pick:'villager', distinct:true} },
  stage:['child','young','middle'], weight:{base:2, plus:[{when:F('weather.raining','eq',true), add:2}]},
  cooldown:{self:40*DAY, cast:20*DAY},
  text:'#parent.name# carries #child.name# to you, hot to the touch. "You know herbs. Please."',
  choices:[
    {id:'brew', label:'Brew a cooling tea', costs:[item('Healing herb',-2)], tags:['help','learn'],
     effects:[ untag('$child','sick'), rel('$parent','trust',4,'Saved my child from a fever.') ]},
    {id:'healer', label:'Send for the healer', costs:[money(-6)], tags:['help','pay'],
     effects:[ fact('village.fever.treated',true) ]},
    {id:'nothing', label:'Say it will pass', tags:['avoid'], effects:[ fact('village.fever.untreated',true) ]} ],
  onIgnore:[ fact('village.fever.untreated',true) ], fallback:{safe:'healer'},
  sets:['world.village.fever.treated','world.village.fever.untreated'] }
// "Healing herb" is a placeholder for a real herb item. Chain C starts here.
```

### Opportunities

```js
{ id:'village.teacher_passes_through', deck:'village.chances', tags:['opportunity'], // C11
  urgency:'soft', timeout:2*DAY, cast:{ teacher:{pick:'stranger', spawn:'world.teacher'} },
  weight:{base:3, plus:[{when:F('actor.village.discovered','eq',true), add:1}]}, cooldown:{self:45*DAY},
  text:'#teacher.name#, a traveling #teacher.job#, is staying one night. They will teach for coin.',
  choices:[
    {id:'learn', label:'Pay for a lesson', costs:[money(-8)], tags:['learn','pay'], effects:[ xp('#teacher.skill#',30) ]},
    {id:'trade', label:'Offer a favor instead', tags:['help','learn'], effects:[ xp('#teacher.skill#',15), rel('$teacher','trust',1,'Traded a favor for a lesson.') ]},
    {id:'skip',  label:'Let them move on', tags:['avoid','safe'], effects:[] } ],
  onIgnore:[ fact('village.teacher.missed',true) ], fallback:{safe:'skip'}, sets:['world.village.teacher.missed'] }
// #teacher.skill# comes from the cast template; the world table picks a skill the world teaches.

{ id:'village.peddler_with_rope', deck:'village.chances', tags:['opportunity','money'], // C12
  urgency:'soft', timeout:DAY, cast:{ peddler:{pick:'stranger', spawn:'world.peddler'} },
  weight:{base:2}, needs:F('item.Survey rope','lte',0), cooldown:{self:30*DAY},
  text:'#peddler.name# unrolls a coil of good rope on a blanket. "Surveyor\'s own. Half price."',
  choices:[
    {id:'buy', label:'Buy it for 3 coins', costs:[money(-3)], tags:['profit','pay'], effects:[ item('Survey rope',1) ]},
    {id:'haggle', label:'Haggle', requires:F('actor.charisma','gte',3), tags:['deceive'],
     effects:[ item('Survey rope',1), money(-1) ]},
    {id:'pass', label:'Walk on', tags:['avoid','safe'], effects:[] } ],
  onIgnore:[], fallback:{safe:'pass'} }
// Uses the real Survey rope item (V16). Real key form is the JSON string key; shown plain for clarity.

{ id:'village.craftsman_offers_bench', deck:'village.chances', tags:['opportunity','people','callback'], // C13
  urgency:'soft', timeout:4*DAY, cast:{ c:{pick:'named', id:'oldCraftsman'} },
  needs:all(F('actor.village.tokenReturned','eq',true), F('relationship.respect','gte',3), F('village.craftsmanIrritated','eq',false)),
  weight:{base:8}, once:true,
  text:'The old craftsman clears a corner of his bench. "You listened. Come learn the work."',
  choices:[
    {id:'apprentice', label:'Take the corner', tags:['learn','help'],
     effects:[ afact('tag.apprentice',true), fact('village.apprenticed',true), xp('Crafting',40) ]},
    {id:'later', label:'Not now', tags:['avoid','safe'], effects:[ rel('oldCraftsman','respect',-1,'Turned down the bench.') ]} ],
  onIgnore:[ fact('village.apprentice.offer_lapsed',true) ], sets:['actor.tag.apprentice','world.village.apprenticed'] }
// Needs facts that already exist in the Village content (V16).
```

### Threats

```js
{ id:'village.rats_in_the_granary', deck:'village.threats', tags:['threat'], urgency:'soft', timeout:2*DAY, // C14
  needs:F('world.rats.pressure','gte',3), weight:{base:4}, cooldown:{self:25*DAY},
  text:'Scratching in the granary wall. A week of grain is already gone.',
  choices:[
    {id:'clear', label:'Clear them out', tags:['help','violence','risk'], costs:[{type:'vital',key:'stamina',amount:-3}],
     effects:[ fact('rats.pressure',1), xp('Pest killing',12) ]},
    {id:'trap', label:'Set the trap you bought', requires:F('world.rats.pressure_trap','eq',true), tags:['help','safe'],
     effects:[ fact('rats.pressure',2) ]},
    {id:'leave', label:'It is not your grain', tags:['avoid'], effects:[] } ],
  onIgnore:[ fact('village.harvest.poor',true) ], sets:['world.rats.pressure','world.village.harvest.poor'] }
// Chain: C04 (trap or promise) gives C14 a free counter. A poor harvest feeds C08's weight.

{ id:'village.scouts_on_forest_road', deck:'village.threats', tags:['threat','crime'], // C15
  urgency:'hard', blocks:'place', timeout:90, cast:{ scout:{pick:'stranger', spawn:'world.scout'} },
  needs:F('world.tension','gte',30), weight:{base:3, plus:[{when:F('actor.tag.dog','eq',true), add:1}]},
  cooldown:{self:40*DAY},
  text:'#scout.name# studies the Village from the Forest road, counting doors.',
  choices:[
    {id:'warn',  label:'Warn Tessa', tags:['help','honest'], effects:[ fact('village.scouted',true), fact('village.warned',true), rel('tessa','trust',2,'Warned of scouts.') ]},
    {id:'dog',   label:'Let the dog bark', requires:F('actor.tag.dog','eq',true), tags:['safe'],
     effects:[ fact('village.scouted',true), fact('village.scouts.spooked',true) ]},
    {id:'ignore',label:'Pretend you saw nothing', tags:['avoid'], effects:[ fact('village.scouted',true) ]} ],
  onIgnore:[ fact('village.scouted',true) ], fallback:{safe:'warn'},
  sets:['world.village.scouted','world.village.warned','world.village.scouts.spooked'] }
// Chain B step 2. The dog from C05 adds a choice and a little weight.

{ id:'village.fever_spreads', deck:'village.threats', tags:['threat','family'], urgency:'soft', timeout:3*DAY, // C16
  needs:F('world.village.fever.untreated','eq',true), cast:{ victim:{pick:'villager'} },
  weight:{base:4}, once:true, stage:['young','middle','old'],
  text:'Three more houses have a sick child. Word is it started at #victim.name#\'s door.',
  choices:[
    {id:'cure', label:'Gather herbs for the street', costs:[item('Healing herb',-4)], tags:['help','learn'],
     effects:[ fact('village.fever.contained',true), rel('$victim','trust',2,'Went house to house with herbs.') ]},
    {id:'hide', label:'Keep your own door shut', tags:['avoid','safe'], effects:[ fact('village.fever.spread',true) ]} ],
  onIgnore:[ fact('village.fever.spread',true) ], sets:['world.village.fever.contained','world.village.fever.spread'] }
// Chain C step 2: C10 ignored makes C16 eligible.
```

### Callbacks

```js
{ id:'village.collector_returns', deck:'village.people', tags:['callback','people','money'], // C17
  urgency:'hard', blocks:'activity', timeout:60,
  needs:all(F('world.village.ignored_debt','eq',true), F('world.tension','gte',20)),
  cast:{ who:{keep:'roof_owner'}, collector:{keep:'collector', spawn:'world.collector'}, friends:{pick:'stranger', spawn:'world.thug'} },
  weight:{base:6, plus:[{when:F('actor.grudge.collector','eq',true), add:4}]}, once:true,
  text:'#collector.name# is back at #who.name#\'s door, and #friends.name# is not smiling.',
  choices:[
    {id:'pay_all', label:'Clear the whole debt', costs:[money(-40)], tags:['help','pay','irreversible'],
     effects:[ res('$who','debt',-60), fact('village.ignored_debt',false) ]},
    {id:'tessa', label:'Fetch the patrol', tags:['honest'], effects:[ fact('village.ignored_debt',false), rel('tessa','trust',1,'Fetched us.') ]},
    {id:'stand', label:'Stand in the doorway', requires:F('strength','gte',8), tags:['violence','risk'],
     effects:[ afact('wanted.village',true) ]} ],
  onIgnore:[ res('$who','debt',-60), fact('village.house.seized',true) ], fallback:{safe:'tessa'},
  sets:['world.village.ignored_debt','world.village.house.seized','actor.wanted.village'] }
// Chain A step 4. Walking past C06 sets the fact; this card cashes it in.

{ id:'village.the_road_remembers', deck:'village.threats', tags:['callback','threat'], // C18
  urgency:'crisis', timeout:180, needs:all(F('world.village.scouted','eq',true), not(F('world.village.warned','eq',true)), not(F('world.village.scouts.spooked','eq',true))),
  weight:{base:7}, once:true, cast:{ captain:{pick:'stranger', spawn:'world.captain'} },
  text:'Torches on the Forest road at dusk. The scouts counted well.',
  choices:[
    {id:'defend', label:'Stand with the patrol', tags:['violence','risk','help'], effects:[ fact('village.raided',true), rel('tessa','respect',3,'Held the line.') ]},
    {id:'pay',    label:'Buy them off', costs:[money(-30)], tags:['pay','deceive','irreversible'], effects:[ fact('village.raided',false), fact('village.tribute',true) ]},
    {id:'flee',   label:'Take the children to the Nearby cave', tags:['avoid','help','safe'], effects:[ fact('village.raided',true), fact('village.evacuated',true) ]} ],
  onIgnore:[ fact('village.raided',true) ], fallback:{safe:'flee'},
  sets:['world.village.raided','world.village.tribute','world.village.evacuated'] }
// Chain B step 3. Needs the scouts to have been unanswered. A threat with three answers, one of which is flight.
```

### Rare

```js
{ id:'village.door_beyond_the_river', deck:'rare.anywhere', tags:['rare','opportunity'], // C19
  urgency:'soft', timeout:7*DAY, world:'base.frontier',
  needs:all(F('actor.village.discovered','eq',true), F('item.Weathered route notes','gte',1)),
  weight:{base:1, plus:[{when:F('actor.tag.fated','eq',true), add:3}]}, once:true,
  text:'On the far bank, in one of the old structures, a doorway stands where there was a wall. The notes\' drainage marks point straight at it.',
  hint:'Rare. Pity draw: guaranteed within about 40 rare ticks.',
  choices:[
    {id:'step', label:'Step through', tags:['risk','learn'], effects:[ fact('door.opened',true), {type:'unlock',kind:'flag',id:'door.beyond_river'} ]},
    {id:'mark', label:'Mark it and tell no one', tags:['avoid','honest'], effects:[ fact('door.known',true) ]},
    {id:'leave',label:'Turn back', tags:['avoid','safe'], effects:[ fact('door.known',true) ]} ],
  onIgnore:[ fact('door.known',true) ], sets:['world.door.opened','world.door.known'] }
// The doorway links to the first-crossing milestone in the north star; the effect names are placeholders.

{ id:'village.stranger_knows_your_name', deck:'rare.anywhere', tags:['rare','callback'], // C20
  urgency:'hard', blocks:'place', timeout:DAY, stage:['later'], travels:true,
  needs:F('history.prior_life','eq',true), cast:{ stranger:{pick:'stranger', spawn:'world.echo'} },
  weight:{base:1, plus:[{when:F('actor.tag.fated','eq',true), add:2}]},
  text:'A stranger stops in the road. "You hold your knife like a man I buried. Who taught you?"',
  choices:[
    {id:'tell', label:'Say the truth', tags:['honest','risk'], effects:[ rel('$stranger','trust',4,'Spoke plainly about a past life.'), fact('echo.known',true) ]},
    {id:'lie', label:'Say you learned it here', tags:['deceive'], effects:[ rel('$stranger','trust',-1,'Lied about my past.') ]},
    {id:'go', label:'Walk away', tags:['avoid','safe'], effects:[ fact('echo.seen',true) ]} ],
  onIgnore:[ fact('echo.seen',true) ], fallback:{safe:'go'}, sets:['world.echo.known','world.echo.seen'] }
// `travels:true` and `stage:['later']`: only a later life draws it, and it follows the person across worlds.
```

## 12. Emergent chains (nobody writes the whole chain)

**Chain A: the roof and the collector.**
1. C02 `roof_promise` fires 3 times for the same owner (`keep:'roof_owner'`).
   `resource.roof_neglect` reaches 3.
2. C07 `roof_gives_way` becomes eligible (weight higher in rain). Ignore it: the
   `onIgnore` writes 40 debt on the owner.
3. C06 `debt_collector_visits` needs debt >= 30. Walk past: it sets
   `village.ignored_debt`.
4. C17 `collector_returns` needs that fact and tension >= 20, and casts the
   *same* owner. The house can be seized.
Every step is a separate card in a deck; only the `sets` and `needs` link them.
Help early (C07 `repair`) and the chain ends at step 2 with a friend.

**Chain B: the dog and the raid.**
1. C05 `stray_dog`, feed it: `actor.tag.dog`.
2. C15 `scouts_on_forest_road` gains a "let the dog bark" choice and weight.
3. If scouts go unanswered (not warned, not spooked), C18 `road_remembers`
   becomes a crisis. If the dog barked or Tessa was warned, it never draws.

**Chain C: the fever.** C10 ignored sets `fever.untreated`; C16 `fever_spreads`
needs it. Treating C10 (`brew` or `healer`) removes the path. C16 also feeds
C08 (poor harvest raises feud weight) through C14's `harvest.poor`.

**Chain lint (a build check, proposal).** A script walks `needs` and `sets`
and prints, for each fact, which cards write it and which read it. A fact read
by no card, or needed but written by none, is a warning. It also finds cycles
and reports the longest chain (here: C02, C07, C06, C17, four steps).

## 13. Build-ready status

- [x] Card schema final (section 3), pending Weibao's answers below
- [x] First 20 Village cards written as data (section 11)
- [x] Where cards appear in the original UI (section 8)
- [x] Deck tick rates (section 4); the real-time pace is the first thing to tune
- [ ] Engine items, in order: deck record and draw; casting and role rewrite;
      scoped waiting and decision fallback; `cast.*` facts; `season` fact;
      roster adapter; runtime cards
- [ ] Smallest proof: `village.daily` plus `village.people` with the 20 cards,
      two fresh saves for 30 days, the receipt log compared side by side,
      and the chain lint output attached
- [ ] Per AGENTS.md: browser test from a fresh origin, plus save, reload and
      import (the deck record is new persistence, so a migration entry is needed)

## Open questions for Weibao

1. **Q1.** Should a `hard` card be allowed to pause only one activity (the
   scoped waiting rule, new work), or is the existing global pause enough for
   the first build, with `hard` becoming `soft` until scoping exists?
2. **Q2.** When the character acts for you, may it spend your coins and use your
   items (capped at a quarter of your money, never `irreversible`), or should it
   only pick free choices until you opt in per card?
3. **Q3.** Oren, Maia and Lio exist only as yearly records. Should the Village
   get a small set of generated, simulated villagers at enrollment so cards
   have a cast, with Oren's family joining as named people later?
4. **Q4.** Should the player see deck odds ("why now" with weights), always, never,
   or only with a perception skill or a cheat?
5. **Q5.** Is one Crisis card per 3 game days a fair default cap for Village, with
   Wild and war worlds free to raise it?

## Vocabulary additions

Additions only; nothing renamed. To append to `SHARED_VOCABULARY.md`.

- **Card fields:** `stage` (life stage list), `world`, `hint`, `blocks`
  (`none|activity|place|all`), `fallback` (`{safe: choiceId}`), `travels`,
  `createdBy`, `receipt`; choice field `tags`.
- **Choice tags:** `help`, `profit`, `risk`, `avoid`, `violence`, `honest`,
  `deceive`, `pay`, `learn`, `irreversible`, `safe`.
- **Deck record:** `simulation.decks[deckId] = {due, interval, rng, drawn,
  nulls, pity, cards}`; deck fields `scope, interval, slot, quiet, perTick,
  gate, pulls, pityAfter`.
- **Urgency to mode:** `ambient` to `ambient`, `soft` to `offer`, `hard` and
  `crisis` to `decision`; event field `fallbackAt`.
- **Standing order:** `{id, owner, enabled, priority, when:{tags, urgency,
  extra}, do:{choiceTag|choiceId}, limits:{maxCost, perDay, onlyWhenAway}}`.
- **Autonomy:** per-life integer 0 to 3.
- **Fact namespaces:** `cast.<role>.*` (cast-time facts), `deck.<id>.bind.<key>`
  (kept casts), `calendar.season` (proposed fact).
- **Terms:** `receipt`, `letter`, `runtime card` (`simulation.cardsRuntime`),
  `kept cast`, `family echo`, `seen factor`, `chain lint`.
- **Person fact helper:** `personFacts(state, id)` (light fact set for casting).
- **Stream use:** `fate:player` also drives the O3 noise term.
