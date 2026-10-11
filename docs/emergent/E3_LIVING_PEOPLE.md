# E3. Living people: build-ready draft (proposal)

Claude, 2026-10-09. Expands layer E3 of [emergent systems](../EMERGENT_SYSTEMS.md).
Names follow the [shared vocabulary](SHARED_VOCABULARY.md); additions are
listed at the end.

**Everything here is a proposal.** Nothing is selected for a build. Every
number is a starting value to tune in play, not a measured result. Section 1
is the only part that states verified source facts. All other sections are
design. Per [anything is possible](../USER_VISION.md#anything-is-possible-2026-10-09),
where there are several answers, each stays reachable and a world, storyteller
or player setting picks one.

Codes: `V` verified source fact, `X` contradiction with the parent doc,
`D` design decision, `Q` question for Weibao.

---

## 1. Verified source facts (2026-10-09)

Read from `src/`. Line numbers are as of this date.

| Code | Fact | Where |
|---|---|---|
| V1 | Clock unit is the game minute. A schedule period of one day is 1440. | `village_content.js` (morning_circle `period: 1440`) |
| V2 | Controllers run at boundaries. Each has `due` and `interval`. Actions are sorted by `priority`, the first eligible one starts, then the loop breaks. Controllers are sorted by id, dead people skipped. | `simulation.js:505-531` |
| V3 | A controller action is `command`, `encounter` or `event`. It has a **fixed** `targetId`. There is no target choice at run time. | `simulation.js:509-512`, validated `simulation_contracts.js:147-152` |
| V4 | A controller must name a registered person (`actorId`). Contract asserts `interval > 0`. | `simulation_contracts.js:148` |
| V5 | `spawn` builds a person from a template with `inventory === "simulation"`, copies `vitals`, `body`, `lifePolicy`, sets `createdBy`, and only attaches controllers whose `actorId` equals the **template id**. Spawned people from one template share its controller definition. | `simulation_effects.js:147-156` |
| V6 | `spawn` accepts a frozen inline `template` (and `instanceKey` instead of `personId`). But saved people are validated with `registry.people.has(definitionId)`, so a generated template id that is not registered would fail validation. | `simulation_contracts.js:49-51`, `:223` |
| V7 | `relationship` effect: directed `s.relationships[actor][target]` with `axes` (any id, any finite number, **no clamp**) and `memories` capped at 32 per directed pair. Memory shape `{cause, at, text}`. | `simulation_effects.js:229-237`, `simulation_contracts.js:234` |
| V8 | The relationship effect writes a receipt `s.causes[cause:actor:target:axis]` so one cause cannot farm favor. **Receipts are never pruned** (no other write or delete of `causes` in `src/simulation*.js`). | `simulation_effects.js:232-236` |
| V9 | The chronicle keeps a separate, **player-owned** relationship set: keyed by NPC id, axes clamped to plus or minus 100, free `ties` (flags, strings), 32 memories `{id, at, text}`, at most 64 owners. Axes in use: `trust`, `respect`, `fear`. | `chronicle.js:29-34`, `:57-65`, `:258` |
| V10 | `life` effect: setting `dead` requires `lethal: true` on the effect ("explicit authored permission"). Reviving needs `resurrection: true`. Statuses: `alive`, `incapacitated`, `dead`, `departed`. | `simulation_effects.js:260-264`, `simulation_contracts.js:222` |
| V11 | `lifePolicy` `{lifespan, ending: dead or departed, work: refund, forfeit or finish}` ends a life deterministically at `bornAt + lifespan`. | `simulation.js:445`, `:470-473`, `simulation_contracts.js:90` |
| V12 | `simulationFacts` builds one fact table from about 40 providers on every call, then adds `relationship.<axis>` and `person.<id>.*` knowledge for a `targetId`. `previewSimulationCommand` calls it, so one preview is not cheap. | `simulation_effects.js:68`, `:104-109` |
| V13 | `acceptActorProposal` lets an outside planner propose a registered command by id. It rejects `effects`, `costs`, `sourceCode`. `inspectActorChoices` lists visible commands with eligibility and reasons. | `simulation.js:606-620` |
| V14 | Effect operations available: spawn, relocate, fact, resource, vital, body, item, transfer, xp, reputation, knowledge, relationship, claim, condition, life, source, faculty, power, progress, title, equipment, custody, unlock, event, world, party, energy, observation, site, pursuit, situation. Effects take an `actor` (and `target`, `from`, `to`) field. | `simulation_contracts.js:42`, `simulation_effects.js:119-124` |
| V15 | `custody` is a loan of an **item** with a loan id and a return check. Coins are an actor `resource` (`scope: "external"`, key `money`), not an item. | `simulation_effects.js:221-230`, `village_content.js` costs |
| V16 | Per-event streams: `hash(seed, id)` is a stateless-style FNV hash. | `simulation.js:33`, `:64` |
| V17 | `npc_lives.js` is **not** simulation people. It is a separate bounded store of Village household data: Maia (25) and Oren (27), married; Lio (4); Neri (born in 3 years); Rhea; Nima; and Iona (a 19 year old patrol recruit added by `addVillageRecruit`). Death year is `birth + 65 + hash % 20`. Max 32 people, 64 events. | `npc_lives.js:5-30`, `:41-47` |
| V18 | The chronicle holds a relationship owner named `villageElder`. The elder is the only other named Village person in source besides the household above and an unnamed "old craftsman". | `chronicle.js:76-78` |
| V19 | `Oren` is also the name of a hook tollkeeper enemy in a battle feature. A name clash if the household Oren becomes a simulation person. | `feature_expansion_battle.js:37` |
| V20 | The simulation log is capped at 100 entries, the chronicle log at 40. | `simulation.js:32`, `chronicle.js:67` |

### Contradictions with the parent doc

- **X1.** Parent doc says controllers pick "the highest-priority eligible
  action" and E3 will "score every eligible action". True, but V3 means
  targets are fixed in the definition. Utility scoring needs a **target
  selector** (`here.people`, `known.people`), which does not exist.
- **X2.** Parent doc says "the chronicle stores relationships". That is the
  player's only (V9). **NPC to NPC relationships live in the simulation store**
  (V7), which has no clamp and a different memory shape. E3 should build on V7,
  and mirror into V9 only for pairs that involve the player.
- **X3.** Parent proof uses "4 Village people". Those people are not
  simulation actors (V17). They must be promoted (spawned) first. The parent
  vocabulary example `person:village.oren` also clashes with V19.
- **X4.** Parent "Save size" risk misses V8: every relationship effect leaves
  a never-pruned receipt. Dense NPC to NPC activity would grow the save by
  tens of KB a month unless receipts get a pruning rule (section 16).
- **X5.** Parent says spawn gives generated people. V5 and V6 say they share
  a template controller and may fail validation. A small contract change is
  needed (section 11).

---

## 2. The person record (proposal, extends the vocabulary shape)

```js
{ id, traits: { greedy: 4, proud: 7, ... },          // tag:strength, 3 to 5
  needs: { rest, safety, belonging, status, purpose, ...world },   // 0 to 100
  goal: { id, target, since, p0, stall },            // one at a time
  mood: [ { tag, until } ],                          // expiring tags
  beliefs: [ { h, about, sev, flags, conf, hops, from, at } ],   // max 10
  habits: { <verb>: n },                             // used by O3, section 14
  lod: 'here'|'near'|'far', pinned: false, lastTick, ledger: [reason x3] }
```

Money is **not** stored as a need. It is the existing `external.money`
resource (V15) and a derived need (section 3). Relationships stay in the
simulation store (V7), not in this record. Authored traits are a template
field. Instances store only changes (vocabulary rule).

---

## 3. Needs: list, decay, recovery, thresholds (proposal)

Each need is 0 to 100, where **100 is fully met**. Pressure is `100 - value`.
Pressing is below 40, critical is below 15 (below 25 for `rest` and `safety`,
which have mood tags). Decay is applied lazily from `lastTick`, so far people
cost nothing between rolls.

| Need | Start | Decay | Recovery | Pressing | Critical | Mood tag |
|---|---|---|---|---|---|---|
| `rest` | 80 | 3 per awake hour; work adds 1 per hour | `rest` verb or sleep: 8 per hour | 40 | 25 | `tired` |
| `money` (derived) | n/a | none; the buffer shrinks by upkeep | `work`, `sell`, `borrow`, `gift` received | 40 | 15 | none |
| `safety` | baseline | relaxes toward baseline 8 per day | friend present +5 per tick; `pray` (pious) +10 | 40 | 25 | `afraid` |
| `belonging` | 60 | 6 per day | friendly contact +12; family night +20; festival +25 | 30 | 10 | `grieving` after a death, 14 days |
| `status` | base | relaxes toward base 3 per day | title, win, praise; comparison rule | 35 | 10 | `ashamed` |
| `purpose` | 50 | 4 per day with no goal progress | goal step +10; goal done +15 | 30 | 10 | none |

Rules:

- **Money value** = `clamp(100 * coins / (7 * upkeep), 0, 100)`, with upkeep
  of 1 coin per person per day in the household. Seven days of coins is "met".
  Two coins for one person is about 29.
- **Safety baseline** by place tag: `lawful` 70, no tag 50, `lawless` 30,
  `dark` minus 10. Seeing violence drops it 20, hearing of it 10, an injury 15.
- **Status base** by role: apprentice 35, worker 50, guard 60, elder 80. A
  title moves the base. **Comparison rule** (E4 `contact`): when a person with
  `proud` meets someone of lower base who now holds more coins or a higher
  title, status drops 8 once per week per pair.
- **World needs** are rows in the world table: `{id, decay, recoveryVerbs,
  thresholds}`. Examples: `faith`, `honor`, `mana`, `qi`. A world may also
  switch a core need off.
- Hunger is not a need here. Food is a cost inside `rest` and `money`. A
  later world with hard survival can add `food` as a row.
- Mood tags from needs use the vocabulary mood family and expire (a mood is
  re-derived every tick, `until` is only a hold of 120 minutes so a person
  does not flicker).

---

## 4. Traits: twelve, with exact effects (proposal)

Traits are E4 tags with strength 1 to 9 (`greedy:4`). **Weight** `w =
strength / 5`, so strength 5 counts as 1.0. Bias values below are points added
to a verb's utility at `w = 1` (section 7, term `T`). A person has 3 to 5
traits. **Opposed pairs cannot coexist:** `brave/cowardly`, `honest/cunning`,
`kind/vengeful` (the last one only at strength 6 or more on both).

| Trait | Verb biases (points at w=1) | Changes in the model | Rule participation (E4) |
|---|---|---|---|
| `greedy` | `steal` +12, `sell` +4, `work` +4 when money pressure is over 50, `gift` minus 8, `lend` minus 8 | money upkeep buffer target x1.5 (so money pressure rises sooner) | `contact` with `wealthy` target: forms `grudge` if refused, 20% per meeting |
| `kind` | `gift` +8, `lend` +6, `forgive` +6, `argue` minus 6, `fight` minus 8, `steal` minus 10 | belonging gains from helping +20% | `contact` with `hungry` or `injured` person: offers help once per day |
| `brave` | `fight` +8, `travel` +4, `report` +3 | safety pressure x0.6 | in a `crowded` place with `afraid` witnesses: stands ground, calms 1 `afraid` tag |
| `cowardly` | `fight` minus 12, `travel` minus 6, `argue` minus 4, `report` +6 | safety pressure x1.5 | `contact` with a feared person: flees the place (relocate) if safety under 40 |
| `proud` | `borrow` minus 10, `argue` +6, `forgive` minus 6, `make_amends` minus 8, `gift` to lower base +4 | status pressure x1.4 | `proud` plus `indebted`: `ashamed` mood each day; comparison rule (section 3) |
| `jealous` | `gossip` +6 about a person with higher status, `argue` +8 with higher status, `steal` +3 | status gaps count double in the comparison rule | `contact` with `famous` or `married` rival: opens a `grudge:1` |
| `curious` | `travel` +8, `train` +4, `gossip` +4, `work` minus 3 on a repeated job | purpose decay x1.3 | `contact` with a `hidden` or unknown item or fact: investigates first |
| `lazy` | `work` minus 10, `train` minus 6, `rest` +8 | goal patience x0.6; `rest` recovery x1.3 | none in the first set; reserved for E4 workplace rules |
| `pious` | `pray` +10, `steal` minus 12, `gift` +3 to a shrine | `safety` recovers +20% in a `sacred` place | `sacred` place plus `afraid`: removes the tag in 2 hours |
| `vengeful` | `fight` +10 and `argue` +10 against a `grudge` target, `forgive` minus 10 | grudge decay x0.3; goal `get_revenge` score x1.5 | `contact` with a grudge target: free `argue` offer when alone |
| `honest` | `steal` minus 14, `report` +6, any false statement minus 12 | gossip distortion chance is 0 for facts they saw | `contact` with a lie tagged claim they know is false: corrects it (once per day) |
| `cunning` | `borrow` +4, secret `steal` caught-risk x0.6, `gossip` that benefits own goal +6 | gossip distortion chance x1.3 and may be deliberate | `contact` with `indebted` person: offers a loan with interest, 25% |

Notes:

- Strength drifts rarely (section 14 for the player; for NPCs, one step per
  year of life through events tagged with the trait).
- A trait never forbids an action. It only moves a score. Restraint comes
  from costs (section 12), so a `kind` person can still steal when starving.
- Base trait pool per world and per job is a table (section 11).

---

## 5. Goals: catalog of 15, with pick, progress, abandon (proposal)

One goal at a time. **Progress `p` is measured from facts**, not counted, so
it cannot be farmed or lost on reload. `since` is the day it was picked.

| Id | Need links | Trait pull | Progress measure | Typical verbs | Abandon also when |
|---|---|---|---|---|---|
| `earn_coin` | money | greedy | `coins / target` | work, sell | none beyond stall |
| `pay_debt` | money, status | proud, honest | `1 - debt / startDebt` | work, sell, gift | creditor dead (debt is forgiven or passed on) |
| `marry` | belonging | kind | stage: notice 0.2, court 0.5 (affinity 40), proposal 0.8, `married` 1.0 | court, gift, gossip | target `married` to another, or dead |
| `raise_family` | belonging, safety | kind | household fed 7 days (0.5), home safe (0.8), child alive (1.0) | work, rest, buy | none |
| `master_craft` | purpose, status | curious | `skill / target` | train, work | skill at cap |
| `get_revenge` | status, safety | vengeful, proud | stages: find 0.3, confront 0.6, act 1.0 | travel, argue, fight, report | target dead, forgiven, or fear over 60 |
| `leave_home` | purpose | curious | stages: save fare 0.5, pack 0.8, `leave` 1.0 | work, sell, travel, leave | `belonging` over 80 for 14 days |
| `win_office` | status | proud, brave | title held (1.0); stages: standing 0.4, rival beaten 0.7 | train, work, argue, gossip | office filled by someone else |
| `find_friends` | belonging | kind, curious | count of relations with affection over 20, over 3 | gossip, gift, court | none |
| `protect_someone` | safety, belonging | brave, kind | target safety over 60 for 7 days | report, fight, gift | target dead or departed |
| `serve_faith` | purpose, safety | pious | `faith` need or prayer count this month over 12 | pray, gift, mediate | faith lost (world need low 10 days) |
| `learn_secret` | purpose | curious, cunning | the target `fact` known, or knowledge stage `understood` | travel, gossip, train | secret revealed to all |
| `improve_home` | safety, status | greedy, kind | home level (a fact) vs target | work, buy | none |
| `prove_worth` | status | proud, brave | a contest won, or a rank reached | train, fight, work | contest cancelled |
| `make_amends` | belonging, status | kind, honest | target relationship axis `trust` back over a floor | apologize, gift, work | target refuses 3 times |

**How a goal is picked.** When a person has no goal, after a goal ends, on a
**shock**, and at a 14 day reflection:

1. For every goal whose `when` fact holds, score
   `GS = 40 * sum(link pressure / 100) + 10 * sum(trait w for pulled traits)
   + opportunity (0 to 20) + 15 if it is the current goal + shock bonus`.
   Opportunity is a `meets` rule read from facts (a target exists, money in
   hand, a vacancy). Shock bonus is 25 for goals the shock names.
2. Keep the top 3. Draw one with softmax at temperature 8 from a stateless
   hash of `(seed, person, day, "goal")`.
3. **Hysteresis.** A running goal is only replaced at reflection if a rival
   scores at least 20 higher. Shocks bypass that check.

**Shocks** (`change` triggers): a debt appears or clears, a kin or friend
dies or leaves, a new grudge reaches strength 3, a title is gained or lost,
a need goes critical for 3 days, a new belief about a loved one with severity
2 or more.

**Progress and stall.** `p` is recomputed each tick. If it has not risen for
`patience` days the goal stalls. Patience is 20 days, times 0.6 for `lazy`,
times 3 for `get_revenge`, times 1.3 for `prove_worth` with `proud`.

**Abandon.** On stall, on an "abandon also when" condition, or when a core
need stays critical for 7 days (survival override, any goal). Abandoning
writes a memory, costs 10 `purpose`, and gives a `proud` person the `ashamed`
mood for 3 days. Success gives `purpose` +15, a memory, and a chance (30%)
the person tells someone (a gossip seed).

---

## 6. Verbs mapped to existing commands and effects (proposal)

"Command" means a registered simulation command a controller can run through
`previewSimulationCommand` (V2). **Existing** means the effect type exists (V14).
**New** means content or a small engine piece must be added. Today no command
is written for NPC use; all verbs need authored commands per world (new
content) even where the effects exist.

| Verb | Mapped to | Status |
|---|---|---|
| `work` | command with `resource` (money) plus `xp` and a vital cost | effects exist; NPC work commands are new content |
| `rest` | command with `condition` removal and a long `duration` | exists |
| `buy`, `sell` | `resource` on both actors plus `item` or `transfer` | effects exist; NPC shops are new (native shops are player-only) |
| `lend` | `resource` minus on lender, plus on borrower, `fact` `person.<b>.debt`, `relationship` tie `creditor` | effects exist, one command, not atomic with an interest rule (new) |
| `borrow` | the same command seen from the borrower, needs lender consent score | new consent check (a second utility roll by the lender) |
| `steal` | `transfer` or `resource` from victim, `relationship` minus, `knowledge` for witnesses | effects exist; witness and law rule (E4) new |
| `gift` | `transfer` or `resource` plus `relationship` plus | exists |
| `court` | `relationship` `affection` plus, `fact` stage, shared `duration` | effects exist; command is new |
| `argue` | `relationship` minus on both, `condition` `angry`, `knowledge` for witnesses | new command |
| `fight` | `encounter` or weighted outcome (`resolveOutcomeWeights`, V14 neighbor) then `vital`, `condition injured`, `relationship` minus | NPC to NPC resolution is new; weighted outcome exists |
| `train` | `xp` or `progress` effect | exists; NPC drill commands new |
| `pray` | `condition` or `fact` plus `safety` and `faith` change | new command, engine pieces exist |
| `gossip` | `knowledge` copy with a distortion step | `knowledge` exists; distortion and `beliefs` are new (section 10) |
| `travel` | `relocate` | exists; destination selector new |
| `leave` | `life` `departed` | exists (no lethal flag needed, V10) |
| `report` | `knowledge` to an official plus `event` for the law | new command |
| `forgive` | `relationship` tie `grudge` removed, axis plus | new command |
| `apologize`, `make_amends` | `relationship` plus and a `gift` option | new command |
| `mediate` | an `event` that rolls both sides' beliefs against `history.<id>` | new, used by Elders and `pious` people |
| `recruit` | `party` join or `relationship` tie `follower` | `party` exists; non-player recruiting new |

Rule for **new** verbs: they are commands in the registry, so they pass
through the same legality gate as the player (V2, V13). An NPC can never
spend what it does not have. No verb carries an effect that is not in the
command's definition.

---

## 7. Utility scoring, step by step (proposal)

Each tick a person scores every verb candidate, takes the best few, and runs
the first one that passes the legal gate.

**Step 0. Gates (hard, before any score).**
The verb must be allowed by the world's cruelty preset (section 12), must be
in the person's verb list, and the person must be free (no pending job,
V2 `simulationOccupiesActor`).

**Step 1. Build candidates.** For each verb, for targeted verbs enumerate up
to **6 targets**: people here first, then people they have a relationship
with, sorted by `|opinion|`. (This is the target selector missing in V3.)

**Step 2. Score.**

```
U(a) = N(a) + G(a) + T(a) + R(a) + H(a) + eps - C(a)

N = sum over needs n of (pressure_n^2 / 100) * relief(verb, n)
G = 30 * goalShare(goal, verb) * expectedGain/bestGain
T = sum over traits of (strength/5) * bias(trait, verb)
R = friendly verbs:  0.15 * opinion(me, target)
    hostile verbs:  -0.20 * opinion(me, target) + 0.15 * 10 * grudge strength
H = +8 if same verb last tick, minus 10 if that verb failed in the last 2 ticks
eps = uniform(-5, +5) from hash(seed, person, tick, verb)    // stateless
C = risk(a) * penalty(a) + resourceCost(a)
```

- `pressure^2 / 100` makes urgent needs dominate (30 pressure gives 9,
  70 gives 49). `relief` is a table per verb and need (-1 to 1; negative is
  a cost).
- `goalShare` is a table per goal and verb (1.0 means the verb is a direct
  step). `expectedGain/bestGain` shrinks `G` when the verb pays less now
  (a poor harvest halves `work`).
- `opinion` is defined in section 9. `risk` and `penalty` are in section 12.
- Mood adds to `T`: `angry` gives `argue` and `fight` +10; `afraid` gives
  `fight` minus 10 and `travel` +6; `tired` gives `rest` +10; `ashamed`
  gives `argue` minus 6 and `gossip` minus 8.

**Step 3. Rank and test.** Sort by `U`. **Preview only the top 3** (V12 says a
preview is costly). The first eligible one starts through
`startCommand`. If none is eligible, `rest`.

**Step 4. Log the reason.** Write the top two terms by size: "Oren borrowed
from the Elder: money need 92 (+59 relief), pride (-14)." The last 3 reasons
stay on the person (`ledger`); the sim log (V20) takes one line when the
player is here.

### Worked example (numbers are illustrative, not run)

Oren, day 6, 08:00, `here` tier. Traits `proud:7` (w 1.4), `greedy:4` (w 0.8),
`brave:5` (w 1.0). Goal `earn_coin`. Needs (value, pressure):
money 29 (71), safety 80 (20), belonging 60 (40), status 45 (55), purpose 50
(50), rest 70 (30). So `pressure^2/100` is: money 50.4, safety 4.0, belonging
16.0, status 30.3, purpose 25.0, rest 9.0.

| Verb | N | G | T | R | H | C | eps | **U** |
|---|---|---|---|---|---|---|---|---|
| `work` | 50.4x0.6 + 25x0.2 + 30.3x0.1 - 9x0.3 = **35.6** | 30x1.0 = 30 | greedy +4x0.8 = 3.2 | 0 | +8 | 3 effort | +2 | **75.8** |
| `borrow` (Elder) | 50.4x0.8 - 30.3x0.3 = 31.3 | 0 | proud -10x1.4 = -14 | 0.15x30 = +4.5 | 0 | 6 (new debt) | -3 | **12.8** |
| `steal` (Iona) | 25.2 - 12.1 - 1.2 = 11.9 | 30x0.3 = 9 | greedy +9.6, proud -8.4 = +1.2 | -0.2x5 = -1.0 | 0 | 0.35x80 = 28 | +1 | **-5.9** |
| `rest` | 9.0 | 0 | 0 | 0 | 0 | 0 | +4 | **13.0** |
| `gossip` | 16x0.4 + 30.3x0.1 = 9.4 | 0 | 0 | 0 | 0 | 0 | 0 | **9.4** |

Result: `work`. Stealing is far below zero because of the risk term, not
because Oren is "good". Now the harvest fails: fields close, `work` is
**ineligible**, money value falls to 8 (pressure 92, `pressure^2/100` =
84.6):

- `borrow`: N = 84.6x0.8 - 9.1 = 58.6; U = 58.6 - 14 + 4.5 - 6 = **43.1**.
- `steal`: N = 42.3 - 12.1 - 1.2 = 29.0; U = 29.0 + 9 + 1.2 - 1.0 - 28 =
  **10.2**.
- Best is `borrow`, which a proud man chooses only when the other road is
  closed. The Elder then runs his own `lend` roll (section 15).

---

## 8. Level of detail: here, near, far (proposal)

Tier follows distance to the player, read from `people[id].location` and
`actors[id].worldId` (both exist, V5). Tick rates are in game minutes.

| Tier | Who | Tick | What it simulates | Cap |
|---|---|---|---|---|
| `here` | same location as the player | every **240** (4 hours); 60 while the player is in a scene with them | full utility (section 7), real commands, can trigger E2 cards, writes relationships and memories | 12 per location |
| `near` | same world, other location | every **1440** (1 day) | one summary action per day: best verb by `U` from cached facts, applied as one bundled `fact` plus `relationship` plus `resource` change, no per-command preview unless it touches the player | 60 per world |
| `far` | other worlds, and anyone in a closed past | one roll per **game year** (or 30 days if `pinned`) | one life event roll per person: goal outcome, job change, marriage, birth, death, move. Numbers only | no cap, 120 bytes each |

Moving between tiers:

- **Promote** (far to near, near to here): run catch-up as at most **30**
  summary steps of the lower tier, then the rest as one far roll. Needs, goal
  and relationships are recomputed from `lastTick`. Possessions, debts,
  grudges and pending jobs are never rewritten.
- **Demote**: write needs and goal, drop `ledger`, keep `beliefs` top 5 by
  weight, keep relationships (section 16 caps).
- **Pinned.** A named enemy, a rival protagonist, and anyone holding a
  `fate` instance (section 13) is pinned: far people tick every 30 days
  instead of yearly, near-style, at most **8 pinned** at once.
- **Boundaries.** The tick budget per advance call is **25 person-ticks**.
  The rest wait on their `due`, so offline catch-up spreads over several
  calls. After **14 days** away the near tier skips to one far-style roll.
- One `people.tick` controller per tier group, not one per person, to avoid
  one controller record per villager (V5 gives one per template). The group
  controller loops its people with the same gating as V2.

---

## 9. Opinion and memory, on top of the existing relationships (proposal)

Use V7 as the store: directed `relationships[a][b]` with `axes` and
`memories`. The player's side stays in V9. For pairs that include the player,
write both (same text, same cause).

**Axes** (unclamped in V7, so E3 clamps to plus or minus 100 on write, like
V9): `trust`, `respect`, `fear`, `affection`, and `debt` (coins owed by a to
b). `trust`, `respect`, `fear` match V9 names.

**Opinion** used in section 7:

```
opinion(a->b) = affection + 0.5*trust + 0.3*respect - 0.2*fear - 10*grudge
```

`grudge` is a relationship tag with strength 1 to 9 (vocabulary). It rises 1
per serious harm, falls 1 per 30 days (1 per 100 days if the holder is
`vengeful`), and is removed by `forgive`.

**Memory entry** (E3 shape, replaces free `text` for NPC pairs to save size):

```js
{ cause, at, k: 'harm'|'help'|'gift'|'insult'|'shame'|'betrayal'|'apology',
  w: -9..9 }       // weight; text is a template id + names, built when shown
```

Max **5 memories** per NPC pair (V7 allows 32, the player keeps 32). On
overflow, drop the smallest `|w|`, oldest first.

**Update.** An action writes memory `w` and moves axes by the same sign:
a harm of weight 6 sets `trust` minus 6 and `respect` minus 3 on the victim's
side only. **Lazy relaxation** at read time: each axis moves toward 0 by
0.5 per day since `touched`, not for `grudge`. A memory halves its `w` every
60 days. This costs nothing for pairs that are not read.

**Unique cause.** V8 dedupes by `cause:actor:target:axis`. Each NPC action
uses a cause `npc:<person>:<tick>:<verb>`, so repeated verbs count. E3 also
adds the pruning rule in section 16.

**Beliefs are not relationships.** A relationship moves on what a person
saw or did. A **belief** (section 10) is a claim about a third party. The
two cross: a belief of severity 2 or more about someone you like triggers a
shock (section 5).

---

## 10. Gossip and information spread, with distortion (proposal)

**Truth anchor.** Every event worth telling writes one `history.<eventId>`
fact (vocabulary): who, what, where, when, true severity 0 to 3 and
`flags` (for example `selfDefense`, `accident`, `mitigating`). It is written
once. People hold **beliefs** that point at it.

**Belief** (stored on the person, max 10):
`{h: eventId, about, sev, flags, conf, hops, from, at}`. `conf` is 0 to 100.
`hops` is 0 for a witness. `sev` and `flags` are what *this* person thinks.

**Who learns what.**

- **Witness**: present in the place and `aware` (there is already `aware`
  and `public` discovery in events). Gets `conf` 90, `hops` 0. A witness who
  arrives late sees only part (the beat, not the cause): `flags` are missing.
- **Heard**: from `gossip` or `report`, below.
- **Inference**: a person who sees an effect but not the cause (a crying
  spouse, a missing coin) builds a belief with `conf` 40 and `sev` set by
  their traits (`cowardly` +1, `kind` +0, `cunning` 0).

**`gossip` verb.** Speaker picks one belief to tell, listener is a person here
or met:

```
juice = |valence| * (1 + recency) * (1 + 0.3 if jealous or curious)
share chance = min(0.8, 0.35 + 0.2 * belongingPressure/100)
listener conf = speaker conf * trust(listener->speaker)/100 * 0.9
hops + 1
```

**Distortion**, rolled once per hop from the `people:<id>` stream
(stateless hash). Chance `0.15 + 0.1` per `jealous` or `cunning` speaker
(both: 0.35), **0** if `honest` and the speaker was a witness. If it fires,
choose one:

| Distortion | Weight | Effect |
|---|---|---|
| Exaggerate | 45 | `sev` plus 1 (max 3) |
| Drop qualifier | 30 | one of `selfDefense`, `accident`, `mitigating` removed |
| Soften | 10 | `sev` minus 1 (min 0), only if the teller likes the subject |
| Swap | 3 | `about` changes to a person in the same place and household |
| Embellish | 12 | adds a made-up `flag` such as `weapon` (cap 1 per chain) |

Limits: version drift is capped at **3** steps per chain. A person never
passes on `conf` under 25. Honest people say "I heard" and pass `conf` x0.7.

**Correction.** A witness, an `investigate` by the Elder or a `mediate` roll
compares the belief to `history.<eventId>`. If wrong, the holder's belief is
overwritten (`conf` 85), their opinion of the *teller* drops by 4, and a
`shame` memory is written if they acted on the false belief.

**Reputation.** Stop using one global number. A region's reputation of person
X is the mean of `sev x valence` over beliefs held by people there, weighted
by `conf`. The existing `reputation` effect (V14) stays as a **cache**,
recomputed daily at the near tier. A deed in one village reaches the next when
a traveling person (`travel` verb) carries their top 3 beliefs. Each
carrier adds 1 hop and the same distortion roll.

---

## 11. Generated people: spawning and births (proposal)

**Contract fix first** (X5, V5, V6): allow a spawned person to carry its own
controller group membership (`tier`, `brain: 'utility'`) instead of
inheriting by template id, and relax V6 validation to accept a
`definitionId` that matches a **stored frozen template**. Until then, register
a small number of generic templates (`village.adult`, `village.child`) and
store per-person traits as instance changes.

**World table** (E6 lore layer supplies it; one per world):

```js
{ id: 'village', names: [...], jobs: { farmer: 40, guard: 12, craft: 20, ... },
  traitPool: { greedy: 8, kind: 14, brave: 10, ... },       // weights
  jobTraitBias: { guard: { brave: +6 }, craft: { curious: +4 } },
  goalPool: { farmer: ['earn_coin','improve_home','raise_family'], ... },
  resources: { coins: [2, 14] }, ageRange: [16, 60], upkeep: 1 }
```

**Arrival** (E2 cards tagged `people` call it): stream `world.people` picks
a job and a name; traits: draw **3 to 5** distinct traits by weighted pool plus
job bias, skipping opposed pairs, strength `3 + roll(0 to 4)`; goal from the
job's pool; resources from the range. ID `person:spawn:<cause>:<key>`
(vocabulary), then one `spawn` effect. Initial possessions are rolled once and
saved (the parent character doc already requires this).

**Births.** A couple tagged `married` or `lover`, both alive, same home,
`belonging` above 40: monthly roll `p = 0.04 * (comfort/100)` (E5 comfort).
Pregnancy lasts 270 days (`pregnant` tag on the parent), then a `spawn`.
Child traits:

- For each parent trait: inherit with **50%**, strength = average if both
  parents have it, else parent's minus 1 (min 1).
- Add **1 upbringing trait**: the household's most common trait among
  non-parent members, else from the world pool.
- **Mutation** (stream `people:<id>`): 10% replace one trait with a world
  pool draw; 5% flip one trait to its opposite; 30% strength plus or minus 1.
- Keep 3 to 5, no opposed pairs, no more than 2 traits at 8 or 9.
- Parents' `family` relationship tag, affection 40, trust 30 both ways.

**Growing up.** A child (`age < 16`) has no brain, ticks only at the near
rate, and its `purpose` and `belonging` need follow the household. At 16 it
gets a utility brain and picks a goal from `goalPool` with a `leave_home`
bonus of 10 if the household has more than 4 members.

**Death and leaving.** Old age uses `lifePolicy` (V11), with lifespan from
`people:<id>` (65 to 85 years, as V17 does by hash). Violence and illness come
from the cruelty preset (section 12). Leaving uses `life: departed`.
A death writes `history.death`, a `grieving` mood on kin (14 days) and a
`belonging` drop of 20, and may pass `debt` and `claim` to heirs.

**Existing Village household.** Promote Maia, Oren, Lio, Rhea, Nima, Neri
and Iona from `npc_lives.js` into spawned people on first use, keeping their
ids, ages and marriage. Their `npc_lives` yearly events stay the **authored
ceiling**: a death or birth there is a floor the live simulation cannot
contradict (a person alive in E3 cannot die "peacefully" in `npc_lives`
early). Q1 below asks whether to keep that coupling.

---

## 12. How cutthroat: world and storyteller settings plus restraint (proposal)

Weibao's Q2 answer: "anything is possible and it depends". So cruelty is a
set of **dials** in the world card and a **multiplier** from the storyteller,
not a global rule. Everything permanent is logged with its cause.

### 12.1 World dials (`offscreen`)

Each world card declares what NPCs may do when the player is not watching.
A verb outside the allowed set is gated off at Step 0.

| Dial | Values |
|---|---|
| `violence` | `none`, `brawl` (no lasting harm), `injury`, `maim`, `kill` |
| `theft` | `none`, `petty`, `shop`, `home` (includes the player's home) |
| `leave` | `temporary`, `permanent` |
| `death_of_named` | `never`, `old_age_only`, `by_cause`, `any` |
| `death_of_kin_of_player` | `never`, `by_cause`, `any` |
| `death_of_player_character` | `never`, `warned_crisis`, `any` |
| `mass` | none, `plague`, `war`, `famine` (each its own card family) |

### 12.2 Presets (proposal names, from gentle to lethal)

| Preset | Sets | Feels like |
|---|---|---|
| `hearth` | violence none, theft none, leave temporary, named death old age only, player kin never, player never | A quiet village. Quarrels, debts, sulking, gossip, love and moves. |
| `hardscrabble` | violence brawl, theft petty, leave permanent, named death old age only | Money fights and small crimes. Nobody dies by hand. |
| `harsh` | violence injury, theft shop, leave permanent, named death by cause, player kin by cause, player never | Real harm, real consequences, still survivable. Default candidate for Village. |
| `feud` | violence maim, theft home, named death by cause, player kin by cause, player `warned_crisis` | Grudges become duels and killings. Needs witnesses and law to hold. |
| `grim` | violence kill, theft home, named death any, player kin any, player `any`, mass on | War, plague, murder. The player can lose everyone. |
| `custom` | any mix | Weibao or a cheat sets each dial. |

The storyteller (E5) **scales the odds** inside the dials, never past them.
Gentle uses the lethal verbs at 0.2 of normal weight, Wild at 1.5. A place
storyteller can lower a dial (a temple city) or raise it (a border fort). The
world's preset can be changed in play by a world event (peace becomes war);
that is a logged `world` effect.

### 12.3 Restraint: law, fear and witnesses (E4 rules)

These turn "may" into "would". They enter the utility score as `C`:

```
C(a) = risk(a) * penalty(a) + resourceCost(a)
risk = clamp( 0.10*lawful + 0.15*witnesses + 0.25*victimKnowsWho
              - 0.15*cunningW - 0.20*hidden, 0, 0.95 )
```

- `lawful` is 1 on a `lawful` place, 0 on `lawless`. A `lawful` place also
  runs a `report` rule: any aware witness with trust in the law may report,
  and the Elder or guard may act (a `fight` or fine verb on the offender).
- `witnesses` is the count of aware people in the place, capped at 3.
- `penalty` per verb is 80 for `steal`, 120 for `fight` with injury, 400 for
  killing (so a kill is chosen only when `N` and `G` are huge: revenge,
  starvation). Penalty falls by 30% if the target has a standing `grudge`
  that the community knows about ("he had it coming").
- **Fear.** `fear(b->a)` over 60 makes `b` not report and not confront `a`.
  Fear rises with known violence. A feared person gains `status` and loses
  `belonging` over time, which pushes them to leave or to be pushed out.
- **Desperation.** A core need critical for 3 days halves `penalty`. So
  starvation produces theft, not a random crime wave.
- **Disgrace.** A person caught is recorded in beliefs. Later `trust` toward
  them drops across the region (section 10), a real social cost.

### 12.4 What stays the same under every preset

- NPC actions are registered commands through the legal gate (V2, V13).
- A death needs a command authored with `lethal: true` (V10). A world that
  forbids killing simply registers no such command for NPC use.
- Each loss writes `history.<id>` with cause and a log line the player can
  find. Nothing happens silently.
- **Player protection is a separate switch** (parent doc): `protect named
  people` per life. Default follows the world.

---

## 13. Named enemies and rival protagonists as people with fate (proposal)

Same person model, same needs, traits, goals and verbs. Differences:

- **Harsher goals** in their `goalPool`: `get_revenge`, `prove_worth`,
  `win_office`, plus world-specific ones (`seize_throne`, `gain_power`).
- **Finite means.** They spend real money and items and train with real xp.
  A rival's level never rises just because the player's did (the rivals doc
  already states this principle; here it is enforced by the `train` verb
  and by the resource gate).
- **Grudge on defeat.** If the player beats them, add relationship tag
  `grudge:player` strength 3 on their side, an `ashamed` mood, memory
  `{k:'shame', w:-6}`, and a goal shock toward `get_revenge` or `prove_worth`.
  If the player spares them, add `debt` instead: `grudge` 1, `respect` 15,
  and `make_amends` becomes a candidate goal.
- **They train, recruit, return.** `train` raises skills over days. `recruit`
  makes followers with `follower` ties (the north star's followers section).
  `travel` and `relocate` bring them back, pinned (section 8), one action every
  30 days at far distance, daily when near the player.
- **Fate** is a storyteller instance on the person (Q4). The person gets a
  `fated` tag. Fate multiplies **cards about them** (opportunities, disasters,
  rivals) by up to x3 at draw time; it does not change their utility scores,
  so the person still decides. Two fated people in one place compete for the
  same `rare` cards.
- **Their own arc.** Phases: `rise` (train, gather means), `clash` (meets the
  player or another rival), then one of `fall`, `ally`, `retire`, `win`. A
  phase change is a `change` trigger and a `history` entry. The arc closes on
  retirement, death by law or by cause, or when `purpose` stays met for 60
  days (the rival is outgrown). A closed arc stops producing threats.
- **They notice the player.** A regressor or transmigrator belief ("this
  person acts on knowledge they should not have") is a belief with
  `hops: 0` created by an E4 rule when the player uses future knowledge. It
  feeds `learn_secret` and `get_revenge`.
- **Cheats on others.** A cheat on an NPC is a trait or tag plus a stream
  access (Q5), not a special brain. The same person model runs; the cheat
  adds verbs (`rewind`, `steal_fate`) with their own costs.
- **Rule for named enemies in `hearth` and `hardscrabble`:** they still hold
  grudges and plot, but cannot choose `kill`. Their goals bend to
  `humiliate`, `ruin` (money), `expose` (gossip) and `outlast`.

---

## 14. Player character autonomy: acting in character while away (proposal)

This is O3 from [decisions while idle](../EMERGENT_SYSTEMS.md#decisions-while-idle-q1).
It sits under O2 standing orders and above the card's `onIgnore`.

**Order of resolution when a choice times out** (soft or hard card, with
Weibao away):

1. Standing order (O2) that matches. If it applies, stop.
2. **In character** (this section), if the autonomy slider (O4) allows.
3. The card's `onIgnore` effects.

**How the character chooses.** The same utility as section 7 on the card's
own `choices` list, scored with:

```
U(choice) = 0.5*N(choice) + T(choice) + R(choice) + habit(choice) - C(choice)
habit(choice) = min(10, 1.5 * habits[verb])
```

The player's needs are weighted 0.5 so the trait and the habit lead. Each
choice carries `tags` (cards have `choices[].tags`), which map to verbs. The
log says: "You were away. Your character chose to help the debtor (kind +6,
habit +4)."

**Limits (proposal defaults, all settable per life).** In-character never
picks a choice that is irreversible unless the matching trait is 8 or more
and the world allows it: spending over 20% of coins, a lethal act, leaving
a world, breaking a vow, ending a relationship. If every choice is blocked,
it takes `onIgnore`. These limits are a setting, because "anything is
possible" and a `ruthless` life may want none.

**Habits.** `habits[verb]` counts the player's own choices (a click counts 1,
an away choice counts 0.5) and decays 2% per day.

**Drift.** Each in-character choice adds to `drift[trait]` (+1 if the choice
matches the trait's bias, -1 if it opposes). A player's manual choice adds
**+2 or -2**, so the player can steer. Rules:

- When `drift[trait]` reaches **plus or minus 12**, that trait's strength
  changes by one step in that direction and its drift resets to 0.
- Drift decays 1 per 14 days toward 0, so only a pattern counts.
- Max **one** strength change per trait per 30 days.
- A new trait can appear at most once per 90 days, only when a drift
  is at plus 12 with no existing trait to change; an opposed trait is
  replaced first, not stacked.
- The log writes it: "Years of taking from the till. Your character has
  become `greedy`." And the bio records the date and cause.
- **Slider.** At low autonomy the player is asked more and the character
  decides less, so drift is slow. At "live it for me" drift is fastest,
  which fits the proposal's note that an away life drifts to who the
  character already was.
- **Lock.** A per-life switch locks traits (no drift) for players who want
  a fixed character.

The same code runs for a rival or follower, with their own habit table, so an
NPC's traits can drift too (one step per year, section 4).

---

## 15. Worked example: four Village people over 30 days (proposal, not run)

Cast from source (V17, V18): **Maia** and **Oren** (married), **Iona** (the
patrol recruit) and the **Elder** (chronicle id `villageElder`). Lio is 4 and
the other children are not born yet, so they stay out. This scenario assumes
preset `harsh` in a `lawful` Village, all four `here` tier at 240 minutes,
seed fixed. All trait and need values below are proposals.

| Person | Traits | Goal at day 0 | Start |
|---|---|---|---|
| Maia (25) | `kind:6`, `honest:7`, `curious:3` | `improve_home` | 14 coins savings, `affection` for Oren 50 |
| Oren (27) | `proud:7`, `greedy:4`, `brave:5` | `earn_coin` | 5 coins, `trust` for Maia 55 |
| Iona (19) | `brave:6`, `curious:5`, `proud:4` | `prove_worth` | 3 coins, patrol wage |
| Elder | `honest:6`, `pious:5`, `cunning:4` | `serve_faith` | 40 coins, status base 80 |

**Scripted inputs, only two:** the existing recruit enrollment (Iona), and one
E2 storylet `village.harvest.poor` at day 4. **Everything below that is
people.**

| Day | What happened | Why (from the model) |
|---|---|---|
| 4 | Storylet: poor harvest. Fields close days 5 to 9, `work` ineligible for farmers | E2 card, tagged `threat`, storyteller allowed it |
| 6 | Oren **borrows 10 coins** from the Elder. `fact person.oren.debt=10`, tie `creditor` on the Elder's side. Oren `ashamed` 3 days | Section 7 example: `borrow` 43.1 vs `steal` 10.2. Elder's `lend` scored 31 (belonging +, honest, `trust(Elder->Oren)` 22 over the floor 20) |
| 7 | Oren's goal becomes `pay_debt` (shock: new debt, need money critical) | Section 5 shock bonus 25 |
| 9 | At the well, Oren sees Iona buy a good knife with patrol pay. His `status` drops 8 (comparison rule: `proud`, she is lower base). Next tick **Oren argues with Iona**. Oren->Iona `respect` -6, Iona->Oren `trust` -4, both `angry` 2 hours | `argue` 28.4 vs `rest` 11; mood `angry` +10, `proud` +6. Witnesses: none else |
| 10 | Maia, passing, meets Iona and chats. Maia->Iona `affection` +10, Iona->Maia +8. Both `belonging` +12 | `gossip` / `find_friends` kind trait, curious Iona; no card |
| 12 | The Elder tells Maia, in prayer hours, that Oren owes 10 coins (`gossip`, `hops 1`, honest so no distortion, `conf` 85). Maia's `trust` for Oren: -6 (he hid it). Shock: her goal becomes `pay_debt` for the household | Maia had no belief about the debt. Elder `gossip` juice high for a `pious` person caring about Oren |
| 14 | **Maia repays the Elder 10 coins** from the household savings, tells no one. Debt fact 0, Elder->Maia `trust` +3, `respect` +2 | Section 6 `gift` plus debt clear. `kind` +8, `honest` +0, `proud` is not hers. Needs: savings drop to 4, safety still 70 |
| 16 | Oren saves 6 coins and goes to repay; the Elder says it is paid. Oren `status` -15, `ashamed`. He **argues with Maia** at home that evening. Oren->Maia `trust` -8, `respect` -3. Maia->Oren `affection` -4, `belonging` -10 both | `proud` x1.4 status pressure. The cause of Maia's gift is the *hidden debt he hid first*, which is now the target of the shame. `argue` 36 vs `rest` 14 |
| 16 | **Iona, on patrol outside, hears raised voices, sees Maia leave crying.** She is `aware` of the end only. Belief `{about: Oren, sev: 2, flags: [], conf: 55}`. The true record: `sev 0`, `flags [moneyQuarrel, noViolence]` | Inference rule (section 10). Nobody lied. `brave` and `curious` set `sev` 2 |
| 17 | Iona's goal changes from `prove_worth` to `protect_someone` (Maia). Shock: belief `sev 2` about a friend's household | Section 5. `affection` for Maia over 20 |
| 18 | Iona **tells the Elder** (`report`). The Elder is honest, so `conf` x0.7: his belief conf 40. He sets `serve_faith` aside for a mediation shock | Distortion chance for Iona 0.15 (no jealous or cunning): not fired. Honest Elder passes with "I heard" |
| 19 | Iona **confronts Oren** on the road (`argue`, high intensity). Oren: `fight` U = -14 (law 120 x 0.45, `fear(Oren->Iona)` 8), so `argue` back. Oren->Iona `respect` -4 more, Iona->Oren `respect` -10 total | `lawful` penalty makes violence cost more than `N` and `G` can pay |
| 20 | The Elder **mediates** (`mediate`): asks Maia and Oren. `history.moneyQuarrel` (true, `sev 0`) overwrites Iona's belief (conf 85). Iona->Oren `respect` gets a `shame` memory for *her* (she acted on a false belief). Iona->Elder `trust` unchanged (he told no one) | Section 10 Correction. Maia is `honest`: no false statement possible |
| 21 | Iona's goal becomes `make_amends` (target Oren) | Shock: shame memory, `kind` and `honest` pulls |
| 22 | **Iona apologizes** to Oren. `honest` rule: apology gives `respect` +8 on his side. Oren->Iona `respect` -10 to -2. `grudge` falls 1 | `proud` penalizes `make_amends` for himself, not for being on the receiving end |
| 25 | Oren, fields reopened, earns again. His goal becomes `earn_coin`. He meets Iona at the drill ground, trains alongside her (`train`, curious Iona offers, his `prove_worth` interest) | `train` 31, `work` 28 on a drill day. No card |
| 27 | **Oren apologizes to Maia** (`make_amends`) and repays her 10 coins over 3 days. Maia->Oren `trust` back to +34 | `proud` -8 bias on `make_amends`, beaten by N (belonging pressure 62) and `R` (opinion of Maia +46) |
| 30 | Net: Oren->Iona `respect` +5, `trust` +3. Iona->Oren `respect` +6. Elder->Maia `respect` +9. Maia->Oren `trust` -2 net vs day 0 (scarred, not broken) | Cumulative memories (max 5 per pair kept) |

**The unscripted NPC to NPC story:** a proud man hides a debt, his wife
quietly pays it, the Elder talks, shame becomes a quarrel, a patrol recruit
misreads the end of it, confronts him, is corrected by the Elder, and ends as
his training partner. The card only closed the fields. This passes the smallest
proof in the parent doc (a relationship change between two NPCs no card or
script caused: Oren and Iona, day 9 and day 22).

**Branch points that a different seed could take** (each a roll or a close
score, none forbidden by the preset `harsh`):

- Day 9: if `eps` is -9 instead of +2, Oren does not argue, and day 16 never
  gets its Iona witness.
- Day 16: Oren's `fight` against Maia is below zero (`kind` is not his; his
  `penalty` is law 120 and her `fear` is 4). In `feud`, with `fear` 50 and a
  hidden place (`risk` x0.4), the same scoring could produce real harm, which
  is the dial's job.
- Day 18: with `cunning` Iona (not `honest`), the Elder's belief would carry
  a distortion chance of 0.35, and a rumor `sev 3` could reach the whole
  village.

---

## 16. Performance and save-size budget (proposal)

**Compute** (unmeasured; targets to test):

| Item | Budget |
|---|---|
| Candidates per person-tick | up to 16 verbs x 6 targets = 96 cheap scores (table lookups) |
| Full previews per person-tick | **3** (V12 makes each preview heavy) |
| Person-ticks per advance call | **25**, the rest wait (section 8) |
| `here` load | 12 people x 6 ticks a day x 3 previews = 216 previews a day |
| `near` load | 60 people x 1 tick a day x 0 previews (bundled) |
| Target cost per advance call | under 4 ms added (measure first; V12 suggests cache facts per tick) |

**Save size.**

| Item | Bytes (target) |
|---|---|
| Person core (traits, needs, goal, mood, lastTick) | about 250 |
| Beliefs (max 10, 40 each) | up to 400 |
| Relationship pair (axes 5 x 8, tags) | about 80 |
| Memories (max 5 per NPC pair, 45 each) | up to 225 |
| Relationships kept per person | **8** (drop lowest `abs(opinion)` unless it has a `grudge`, `lover`, `family`, `debt` or an open goal target) |
| Far person record (numbers only) | 120 |
| Reasons ledger (3 lines) | 150, `here` tier only, not saved at demote |

- Worst case per detailed person: 250 + 400 + 8 x (80 + 225) = about **3.1 KB**.
  Cap of **72** detailed people (12 here x 3 hot locations, plus the near
  cap) gives about **225 KB** worst. Typical (few relationships, few
  beliefs): about 1.2 KB each, or **90 KB**.
- Far people: up to 400 x 120 = **48 KB**.
- **Hard budget for E3 state: 300 KB; target typical: under 150 KB.** Fail a
  build that exceeds the hard budget in a test world.
- **Receipts (X4, V8).** The sim writes a receipt for each relationship axis
  update. At about 100 NPC to NPC effects a day and about 80 bytes per
  receipt, that is 8 KB a day, 240 KB a month. **Prune receipts older than
  60 game days** (a unique cause is never reused that late, because each
  NPC cause includes the tick), and add one `causes` pruning step to the
  simulation boundary. This is a required engine change before E3.
- **Logs.** The sim log is already capped at 100 (V20). E3 adds at most one
  line per `here` person-action when the player is here, none otherwise.
- **Persistence rules.** NPC deaths, departures and debts are never pruned;
  closed arcs shrink to a summary (the parent character doc requires keeping
  ownership, closure and unique-reward facts). Save migration: new fields on
  `people`, `beliefs`, `needs`, `goal`, `habits` get defaults on load, and
  the old save keeps its Village household (V17).

**Determinism.** Draws are stateless: `hash(seed, person, tick, slot)`
(from the V16 hash). Changing a person's tier or order never shifts another
person's draws, so reload and catch-up give the same results.

---

## 17. Build-ready checklist (proposal)

Parent items, with where each is filled:

- [x] Need list and decay rates (section 3)
- [x] Trait list (12) with what each changes (section 4)
- [x] Goal catalog and pick, progress, abandon (section 5)
- [x] Verb list mapped to existing commands and effects (section 6)
- [x] Utility formula and worked example (section 7)
- [x] Level-of-detail tiers and tick rates (section 8)
- [x] Opinion and memory on top of relationships (section 9)
- [x] Gossip and distortion (section 10)
- [x] Generated people, births, inheritance (section 11)
- [x] "What NPCs may never do" answered as dials plus the unchanging rules
      (section 12): by preset, never the same list for every world
- [x] Named enemies, rivals, fate (section 13)
- [x] Player autonomy and drift (section 14)
- [x] Budgets (section 16)

Engine work this draft needs (all small, none started):

1. A `utility` brain on controllers: target selector, scored candidates,
   preview top 3 (X1).
2. Group controllers by tier (section 8).
3. `causes` pruning (X4).
4. Spawned-person controller and validation fix (X5, V5, V6).
5. NPC-usable commands per world for the new verbs (section 6).
6. `beliefs`, `needs`, `goal`, `habits` person fields, with a schema
   bump and migration.

Smallest proof, restated: the four people of section 15 on `harsh`, ticking
every 240 minutes for 30 days, with an acceptance check that at least one
relationship change between two NPCs has a cause chain that includes no card.

---

## Open questions for Weibao

- **Q1.** Promote the existing Village household (Maia, Oren, Lio, Rhea, Neri,
  Nima, Iona) into live people, with their old yearly ages and deaths acting
  as a floor? Or start the live Village with fresh generated people and leave
  `npc_lives.js` as the authored backstory? (Also: the battle enemy named Oren
  needs a new name if the household Oren is promoted.)
- **Q2.** Which preset does the Village start on: `hearth`, `hardscrabble` or
  `harsh` (my pick)? And can a named person you care about ever be killed by
  other NPCs in that world?
- **Q3.** Should your character's traits drift by default, or only when you
  turn drift on? (My default is on, with the lock switch, because it makes
  being away mean something.)
- **Q4.** How much of an NPC's reason do you see? Always in the People panel,
  only through a perception skill, or only for people you know well?
- **Q5.** How long is a game year in game days? Births, aging and the yearly
  far roll depend on it. The source only fixes the day at 1440 minutes (V1).

---

## Vocabulary additions

Added to [the shared vocabulary](SHARED_VOCABULARY.md) (none renamed):

- **Need id** `rest` (the five existing needs stay). `money` is derived from
  the `external.money` resource. World need rows may add `faith`, `honor`.
- **Relationship axes** `trust`, `respect`, `fear` (already used by the
  chronicle), plus `affection` and `debt`. Clamped to plus or minus 100.
- **Relationship tag** `follower`.
- **Mood tags** none new; `angry`, `ashamed`, `afraid`, `tired`, `grieving`
  are reused as the vocabulary has them.
- **Person fields** `beliefs`, `habits`, `pinned`, `ledger`, `drift`.
- **Terms** `utility`, `verb`, `shock`, `reflection`, `belief` (a claim about a
  third party, distinct from a relationship), `witness`, `restraint`,
  `pinned` (always near-tier tick), `preset`, `dial`.
- **Cruelty presets** `hearth`, `hardscrabble`, `harsh`, `feud`, `grim`,
  `custom`. World setting key `offscreen`, with dials `violence`, `theft`,
  `leave`, `death_of_named`, `death_of_kin_of_player`,
  `death_of_player_character`, `mass`.
- **Facts** `person.<id>.need.<need>` (0 to 100), `person.<id>.goal`,
  `person.<id>.goal.p` (0 to 100), `person.<id>.trait.<name>` (strength),
  `person.<id>.debt` (already in the vocabulary example),
  `history.<eventId>` carries `sev` (0 to 3) and `flags`.
- **Streams** `people:<id>` draws are stateless:
  `hash(seed, person, tick, slot)`. Sub-slot names `goal`, `gossip`,
  `birth`, `mutation`.
- **Goal ids** `earn_coin`, `pay_debt`, `marry`, `raise_family`,
  `master_craft`, `get_revenge`, `leave_home`, `win_office`, `find_friends`,
  `protect_someone`, `serve_faith`, `learn_secret`, `improve_home`,
  `prove_worth`, `make_amends`.
- **Verb ids** `work`, `rest`, `buy`, `sell`, `lend`, `borrow`, `steal`,
  `gift`, `court`, `argue`, `fight`, `train`, `pray`, `gossip`, `travel`,
  `leave`, plus `report`, `forgive`, `apologize`, `make_amends`, `mediate`,
  `recruit`.
- **Entity** `tier` is the same as `lod`; no new entity kinds.
