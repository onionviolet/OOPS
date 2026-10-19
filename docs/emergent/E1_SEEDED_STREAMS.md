# E1. Seeded streams: build-ready draft (proposal)

Claude, 2026-10-09. Expands layer E1 of [Emergent systems](../EMERGENT_SYSTEMS.md#e1-seeded-streams),
its [stream access for cheats](../EMERGENT_SYSTEMS.md#stream-access-for-cheats-q5)
section and [tags and rules everywhere](../EMERGENT_SYSTEMS.md#tags-and-rules-everywhere-engine-level).
Names follow [the shared vocabulary](SHARED_VOCABULARY.md). The native call-site
audit lives in the [RNG doc](../RNG_ENCOUNTERS_AND_SOURCE_DEVELOPMENT.md#1-live-rng-audit-and-save-boundaries).

**Everything marked Proposal is a proposal.** Nothing here is selected or built.
Section 1 is verified source, read on 2026-10-09. Principle: [anything is
possible](../USER_VISION.md#anything-is-possible-2026-10-09). Where this doc
gives one default, the other options stay reachable and the world, cheat,
storyteller or player decides.

## 1. Verified source facts

| Code | Fact | Where |
|---|---|---|
| F1 | The expansion engine keeps one xorshift32 state, `state.rng`. `draw(state)` advances it with shifts 13, 17, 5 and returns `rng / 2^32`. | `src/expansion_engine.js` `draw` |
| F2 | A fresh game seeds that state from `crypto.getRandomValues` at page load. The default seed argument is `1`. Validation needs an integer in `1..0xffffffff`. | `src/main.js:346`, `src/expansion_engine.js:69-71`, `:135` |
| F3 | `rng` is a moving cursor, not a stored root. Nothing keeps the original seed. | F1, F2 |
| F4 | A new life builds fresh expansion state seeded from the previous life's current `rng`. Lives are chained by cursor position. | `src/life_experience_host.js:16` |
| F5 | Enrolling the living-world simulation sets its seed to `hash(state.rng, "world.services")`. The seed therefore depends on how many draws happened before enrollment. | `src/simulation.js:46` |
| F6 | `hash` is an FNV-style multiply over the id's characters, returning `n \|\| 1`. It is written twice, identically: `hash` in `simulation.js` and `deriveSimulationSeed` in `simulation_resolution.js`. | `src/simulation.js:33`, `src/simulation_resolution.js:4-7` |
| F7 | Each automatic event gets its own check `{due, interval, rng: hash(s.seed, d.id), count}`. Each due check draws once from its own `rng` via `draw(check)`. | `src/simulation.js:34`, `:64`, `:492` |
| F8 | Outcome tables (`d.outcomes`) draw from a **third** cursor, `s.seed`, copied into a temporary check and written back. Every outcome roll in the simulation shares it. This is not in the EMERGENT doc's list of what exists. | `src/simulation.js:174-178` |
| F9 | Event checks support `chance`, pity (`guaranteeAfter`), `maxOccurrences` and duplicate blocking. The roll is drawn before the pity test, so a pity hit still burns a draw. | `src/simulation.js:484-497` |
| F10 | Committed expansion actions store `draw` and `rolls` in `history`, which is cut to the last 100 entries. | `src/expansion_engine.js` (`finish`, same region as F1) |
| F11 | Plans clone state first (`plan()`), so preview is pure. Commit writes. This is the pattern streams must follow. | `src/simulation.js:35` |
| F12 | `rollBaseCombatDamage` and `rollCombatStrike` already take an injectable `random` argument that defaults to `Math.random`. | `src/combat_math.js:34`, `:43-44` |
| F13 | `random_range` uses `Math.round`, so the two endpoints get half the probability of interior integers. | `src/misc.js:68-70` |
| F14 | Trader stock uses `Math.random` for presence, count and quality. `last_refresh` is the only saved marker of the refresh epoch. | `src/components/trader_component.js:39`, `:85`, `:97`, `:116-122` |
| F15 | `process_rewards` skips a reward with `chance: 0`, because `rewards.chance &&` is falsy. Absent, zero and one are not distinguished. | `src/main.js:2442` |
| F16 | Gameplay `Math.random` call sites number about 45 (table in section 4). Cosmetic ones number about 25 (particles, floating effects, flavor lines, one text easter egg). | `grep Math.random src` |

**Contradictions with EMERGENT_SYSTEMS.md, 2026-10-09:**
- The doc says "one root seed per life, saved at enrollment." Source has no root (F3). `rng` moves, and the simulation seed is derived from it at enrollment time (F5). A root must be added.
- The doc lists the per-event checks as the only existing stream idea. Outcome tables use a separate shared cursor, `s.seed` (F8), which also needs a home.
- The doc implies commit draws are the only RNG users. Combat math already accepts an injected `random` (F12), which makes combat the cheapest native site, not the hardest.

## 2. Design (Proposal)

### 2.1 What a stream is

A **stream** is a named, saved source of draws. A **decision** is one thing a
stream settles (a drop, a card, a hit). Game code never reads floats. It asks
for a decision and gets back a result plus a receipt.

```js
rollChance(stream, key, p)            // -> { hit, receipt }
rollTable(stream, key, weights)       // -> { index, receipt }
rollInt(stream, key, lo, hi, opts)    // -> { value, receipt }   opts.dist: 'uniform' | 'legacyRound'
```

Why decisions and not floats: See, Pin, Bias and Reroll (section 7) need to know
what a draw means. A Pin to "drops the hide" only works if the site said it was
choosing among drops.

### 2.2 Two cell kinds

| Kind | State | Used for | Why |
|---|---|---|---|
| **Cursor stream** | `{n, salt}` (plus cached `x` while hot) | Things drawn repeatedly in order: `deck:<id>`, `people:<id>`, `director`, `fate:<id>` | Order matters and is part of the story |
| **Keyed draw** | Nothing saved. Value is a pure function of `(root, stream, key, salt, n)` | One-shot decisions: a kill's loot, a shop epoch, a craft batch, one combat roll | Order cannot shift it. The receipt is the only memory |

Value function (Proposal): `unit = mix32(hash(root, stream + "|" + key), salt, n) / 2^32`,
with `mix32` a murmur3-style finalizer. It is counter-based, so `n` plus `salt`
is the whole state. Consequences:
- See is free: compute `n+1..n+k` without touching state.
- Branch is trivial: copy `{n, salt}`.
- Compaction is trivial: a cold stream stores `{n}` and recomputes on demand.
- Legacy xorshift cells (F1, F7, F8) stay as they are and are wrapped (2.5).

Options for the generator: **G1 counter-based** (recommended above), **G2** keep
xorshift32 everywhere (one algorithm, but See and Branch cost a replay and cursor
streams cannot skip). G1 costs one new 10-line function and tests.

### 2.3 Root and derivation

- `streams.root`: one uint32 per **campaign**, from `crypto.getRandomValues` on a
  fresh start. Never `Date.now`. Never re-rolled on load.
- Stream seed: `hash(root, name + "|" + key)`. Reuse the one FNV `hash` (F6) and
  delete the duplicate when the code is touched.
- Seed codes (optional, Proposal): a player may type a root to start a life. The
  life is flagged `seeded: true`. Nothing is blocked or ranked by it.

## 3. Full stream list (Proposal)

Names marked * are new here (see Vocabulary additions). `@w` means world-scoped
(section 6): the stream key gets the world id, `world.events@village`.

| Stream | Kind | Scope | Owns | Replaces |
|---|---|---|---|---|
| `world.events` | cursor, per `event:<id>` | `@w` | Automatic event checks (chance, pity) | Per-check `rng` (F7) |
| `world.people` | cursor | `@w` | Births, arrivals, migration, generated names and traits | `npc_lives.js` hash rolls (not audited here) |
| `people:<id>` | cursor | person | One person's choices: utility tie-breaks, gossip distortion | New (E3) |
| `deck:<deckId>` | cursor | `@w` | Which card a deck tick draws and its cast order | New (E2) |
| `director` | cursor | `@w` | Storyteller spikes, pity, personality noise | New (E5) |
| `fate:<personId>` | cursor | person, travels | Fate pulls: does fate intervene, toward which card tag | New (E5 fate) |
| `interaction` | keyed | `@w` | Rule `chance` (fire spreads at 0.6) | New (E4) |
| `encounter` | keyed by instance | `@w` | Lineup, group size, enemy stat variation, enemy status picks, enemy on-hit callbacks | `location.js:344-381`, `enemies.js:216, 440-515` |
| `encounter:<instanceId>` | keyed | `@w` | Every roll inside one fight: damage spread, block, evade, crit, target count | `combat.js:157, 320, 348, 370`, `combat_math.js:34, 44` |
| `loot` | keyed by kill | `@w` | Drop checks and counts | `enemies.js:170, 174` |
| `market` | keyed by epoch | `@w` | Shop stock presence, count, quality | `trader_component.js:116-122` |
| `craft` | keyed by batch | person | Batch success, stochastic rounding, quality | `main.js:3672-3721`, `crafting_recipes.js:205, 235, 301` |
| `gather`* | keyed by period | `@w` | Gathering occurrence, count, quality; consumable recovery | `main.js:6884-6890`, `:4129` |
| `reward`* | keyed by source | `@w` | Chance rewards, mixed reward picks, native action success | `main.js:2442, 2800-2804, 2102` |
| `discovery` | cursor, per family | `@w` | Expansion discovery tables | `expansion_engine` `draw` (F1) |
| `text` | cursor | `@w` | Grammar choices (E6). Only text that is saved or replayed | New (E6) |
| `legacy.action`* | legacy cell | campaign | Old `state.rng` | F1 |
| `legacy.outcome`* | legacy cell | campaign | Old `simulation.seed` | F8 |

Rules:
- A stream owns a **kind of decision**. Two sites may share a stream only if one
  would never reasonably shift the other. A shop epoch must not move a fight.
- A stream name appears in code as a constant in one registry. Unknown names are
  rejected at draw time in tests.
- Cosmetic randomness stays on `Math.random` and never reads a stream.
  Flavor text that changes nothing, sounds, particles: cosmetic. Text that a
  replay must repeat (a saved news line): `text`.

## 4. Save shape and migration (Proposal)

### 4.1 New shape

```js
state.streams = {
  schema: 1,
  root: 3141592653,                       // uint32, from crypto at campaign start
  cells: {                                // only streams that have drawn
    'deck:village.daily@village':   { n: 12, salt: 0 },
    'director@village':             { n: 12, salt: 0 },
    'people:person:village.oren':   { n: 31, salt: 0 },
    'fate:person:player':           { n: 4,  salt: 0, bias: { lucky: 2 } }
  },
  legacy: { action: <old rng>, outcome: <old simulation.seed> },   // see 4.2
  mods:   { pins: [], biases: [], leases: [] },                     // cheat state, section 7
  log:    [],                                                       // stream access log, capped (4.5)
  branches: {}                                                      // branch saves, section 7.6
}
```

Size: a cell is about 30 bytes of JSON. 200 live cells is about 6 KB.

### 4.2 Migration from the single `rng` and per-check `rng`

| Step | Rule |
|---|---|
| M1 | Add an engine schema (next integer after the current top schema). On load of an older schema, create `streams` if missing. Never rewrite history. |
| M2 | `streams.root = hash(state.rng, "streams.root")`. It is derived once, then stored. A legacy save gets a root that is stable from here on. |
| M3 | `state.rng` is not touched. The expansion `draw()` keeps using it as the `legacy.action` cell until the discovery and action tables move to `discovery` (build step B5). |
| M4 | Per-check `rng` (F7) and `s.seed` (F8) stay in place. The stream resolver treats them as **views**: `world.events` for `event:<id>` reads and writes `simulation.checks[id].rng`. No data moves. |
| M5 | Counters for legacy cells start at 0 "since migration." Past draws are never re-derived. |
| M6 | An enrolled simulation keeps its stored `s.seed`. Only new enrollments use `hash(streams.root, "world.services")`, which fixes F5. |
| M7 | Each feature moves off a legacy cell in its own wave. A move is a deliberate change to that feature's future draws and is noted in PROJECT.md. |
| M8 | Imports of pre-streams saves run M1 to M6. Imports of newer saves in an older build are refused with a readable message. |

Where `streams` lives: in the expansion state, so `persistExpansionPlan` writes it
in the same envelope as everything else. Native sites reach it through one host
bridge (`gameRandom`) and commit the cell update with the native save that
records their result. Per the RNG doc, the native save is separate from the
expansion envelope; that atomicity gap is the main build risk (section 11, R1).

### 4.3 Draw lifecycle

1. **Plan:** `rollX` on a cloned state computes the result from `(root, stream, key, salt, n)`. Pure.
2. **Commit:** the cell advances (`n+1`) and the receipt is attached to the thing decided. Both go to the same save.
3. **Display:** the UI reads the receipt. It never draws.
4. **Load:** reconstruction never draws. A loaded kill shows its saved loot.

### 4.4 Receipt format

```js
{ id: 'loot@village|frog#17|k0|n1',   // stream|key|n, unique per decision
  s: 'loot@village', k: 'frog#17.drop.hide', n: 1, salt: 0,
  u: 0.7312,                           // the unit value used, 4 decimals
  site: 'enemies.get_loot',            // static call-site tag
  decided: 'drop:frog_hide x1',        // short result
  table: 'r3',                         // optional: table revision, for weights
  via: null,                           // or { kind:'reroll'|'pin'|'bias', cheat, cost }
  orig: null                           // receipt id replaced, when via is a reroll
}
```
Storage:
- On the thing decided: the event, the kill record, the craft batch, the shop epoch. This survives past the 100-entry history cut (F10).
- A per-stream ring of the last 32 receipts, used by See, Steal and the player-facing luck log.
- Receipts carry results, not full inputs. The contributing weights are frozen by reference to a table revision.

### 4.5 Compaction

| Thing | Rule |
|---|---|
| Keyed draw | Nothing to compact. Receipt stays on its owner. |
| Cursor of a dead person (`people:<id>`) | Collapse to `{n}`. Drop `x`. Drop entirely after one year of game time unless the person is a named foe or has a grudge fact. |
| Closed encounter | Drop `encounter:<instanceId>` bookkeeping at close. Receipts stay on the kill records. |
| Cold cell (no draw for 30 game days) | Store `{n, salt}` only. Hot cache `x` is optional and recomputed. |
| Cap | At most 512 live cells. Over the cap, the least recently drawn cold cells collapse. Collapse is lossless because `n` plus `salt` is the whole state. |
| Receipt ring | 32 per stream, 256 total. |
| Access log | 200 entries. Entries older than that fold into per-cheat counters. |
| World streams of a closed world | Keep. They are `{n}` only and cost bytes, not design. |

## 5. Native call sites by priority (Proposal)

Priority: **P1** blocks the Village proof or is reload-fishable today.
**P2** is the combat/loot/shop/craft order the checklist asks for. **P3** is low
consequence. Lines are as of 2026-10-09 and shift when files change.

| Pri | File:line | Decides | Stream and key |
|---|---|---|---|
| P1 | `models/location.js:344` | Which enemy group spawns | `encounter` / entry id |
| P1 | `models/location.js:355-357` | Group size and species picks | `encounter` / entry id |
| P1 | `models/location.js:367-381` | Per-stat enemy variation (9 draws per enemy) | `encounter` / entry id + enemy index + stat |
| P1 | `components/trader_component.js:116, 118, 122` | Stock presence, count, quality | `market` / shop id + epoch |
| P1 | `enemies.js:170, 174` | Drop check and drop count per item | `loot` / kill id + item |
| P2 | `models/combat.js:320` | Block | `encounter:<id>` / fighter + attack index + `block` |
| P2 | `models/combat.js:348` | Evade | `encounter:<id>` / fighter + attack index + `evade` |
| P2 | `models/combat.js:370` | Crit | `encounter:<id>` / fighter + attack index + `crit` |
| P2 | `models/combat.js:157` | Randomized target count | `encounter:<id>` / fighter + attack index + `targets` |
| P2 | `combat_math.js:34, 44` | Damage spread (`1.2 - r*.4`), per hit | Pass an injected `random` bound to the keyed stream (F12). No file change in the math. |
| P2 | `enemies.js:440, 451, 498, 515` | Enemy on-hit callback chances (10%, 20%) | `encounter:<id>` / attack index + `onhit` |
| P2 | `enemies.js:216` | Which status effect an enemy applies | `encounter:<id>` / attack index + `status` |
| P2 | `main.js:3672` | Stochastic rounding of craft successes | `craft` / batch id + `round` |
| P2 | `main.js:3684` | Extra attempt success | `craft` / batch id + attempt |
| P2 | `main.js:3721` | Stochastic rounding of scaled output | `craft` / batch id + `scale` |
| P2 | `crafting_recipes.js:205, 235, 301` (via `random_range`, `misc.js:69`) | Quality of components, equipment, items | `craft` / batch id + output + `quality` |
| P3 | `main.js:2102` | Native action success | `reward` / action id + completion count |
| P3 | `main.js:2442` | Chance reward (fix F15 at the same time) | `reward` / source + completion count |
| P3 | `main.js:2800, 2804` | Mixed reward inclusion and pick | `reward` / source + completion count |
| P3 | `main.js:6884, 6885, 6890` | Gathering occurrence, count, quality | `gather` / activity period id |
| P3 | `main.js:4129` | Consumable container recovery | `gather` / item instance + use count |
| Cosmetic | `main.js:2020, 2095, 2098, 2119, 3009, 3011, 6955-6962`; `display.js:269, 284`; `particles.js` (all) | Floating effects, failure-line variants, rat easter egg, sound lines, pixels | Stay on `Math.random` |

`random_range` and group-size rounding (F13): `rollInt` takes `dist`. Default
`legacyRound` for every ported site, so no balance changes slip in with the
plumbing. A site can later move to `uniform` as a separate, noted change.

Combat note (verified in the RNG doc, not re-run here): fighters run on
`setTimeout`/`Date.now`. Keyed draws make each roll independent of timer order,
so replay of a fight's rolls is stable even though fight timing is not. Full
fight replay still needs ordered turns, which belongs to the RNG doc, not E1.

## 6. Cross-world, lives and reincarnation (Proposal)

### 6.1 Do streams travel with a person or stay with a world?

| Option | Rule | Effect |
|---|---|---|
| W1 (recommended default) | **Split by owner.** World-owned streams (`world.*`, `deck`, `director`, `market`, `loot`, `encounter`, `discovery`) are scoped `@worldId` and stay. Person-owned streams (`people:<id>`, `fate:<id>`, `craft`) travel. | Leaving and returning to a world resumes its stream where it stopped. Matches "only played game time advances the world." Fate follows the person across worlds, as EMERGENT Q4 says. |
| W2 | Everything per world. | Fate would need to be re-attached on entry. Clean, but fate stops being personal. |
| W3 | Everything global, one set per life. | Smallest save. A cheat that reads `loot` sees one pool across worlds. Worlds cannot have their own luck. |
| W4 | A world declares its own mode in its card (`streams: 'split'\|'world'\|'global'`). | The world decides. A loop world can say `world`, a dream world `global`. This is the "it depends" answer. |

Recommendation: W1 as default, W4 as the way any world overrides it.

Entry and exit: crossing a barrier runs arrival rules (E4). A world entered for
the first time creates its cells lazily from `root`. A world revisited after a
long gap does not catch up draws; only the E3 far-tier summary rolls run, on
`world.people@<w>`.

### 6.2 Multiple lives and reincarnation

Today a new life seeds from the previous life's cursor (F4).

| Option | Rule | Use |
|---|---|---|
| L1 | New life, **continue** campaign streams. World streams keep their cursors. Person streams start fresh for the new person. | Default. The world goes on; you are a new person in it. |
| L2 | New life, **new root** (`hash(root, "life:<k>")`) for person streams only. | Cleanly different luck per life, same world history. |
| L3 | **Replay root**: reset counters to the life's start. | A loop or regression life. The world rolls the same dice again. |
| L4 | Reincarnator keeps `fate:<id>`. The fate cell transfers to the new body. | Fits "fate follows a reincarnator." Other people's fate cells stay with them. |

Compose them per campaign: L1 for world streams, L2 or L4 for person streams, L3
only when a cheat or world asks for it (section 7.6).

## 7. Stream access for cheats (Proposal)

A cheat declares access entries. Each entry names a kind, the streams it can touch
(with wildcards), a scope, a cost, and what it retains. A cheat may combine any set.
Access works on **decisions** (2.1), so a cheat needs no knowledge of floats.

```js
{ kind: 'reroll', streams: ['loot@*'], scope: 'own',          // own | party | near | any
  uses: { per: 'day', n: 1 }, cost: [ {type:'resource', key:'luck_charge', amount:1} ],
  retains: 'original', logged: true }
```
Costs reuse the existing effect vocabulary (`resource`, `vital`, `fact`,
`condition`, verified present in `simulation_effects.js` per the EMERGENT doc). New
cost currencies are facts, not new code: `world.attention`, `fate.debt`.

### 7.1 See

| Item | Draft |
|---|---|
| Reads | The next `N` unit values of a cursor stream, or the value of a named key. |
| What the player gets | Level 1: the category of the next declared decision ("a card of tag `threat`"). Level 2: only a band for later ones (low, middle, high). Later tables are unknown until their site declares them. |
| Staleness | The result is exact only until weights change (E5 multipliers, new facts). The log marks a See `stale` when it was invalidated. |
| Cost | None, charge, time spent (a ritual), or attention. |
| Log | `{at, cheat, kind:'see', stream, n, N, level}` |

### 7.2 Reroll

Replace one specific unclaimed result. "Unclaimed" means its effects have not been
applied: a drop not yet picked up, a card not yet answered, a craft quality not yet
inventoried.
- Mechanic: bump `salt` for that key, redraw, mark the new receipt `via: reroll`, set `orig` to the first receipt.
- The original stays in the log and on the thing. It is never erased.
- Options for the retry: **keep better** (player picks), **forced new** (must take the new one), **limited** (n per day).
- A reroll of a fate pull (section 8) is allowed only if the cheat names `fate:*`.

### 7.3 Pin

Force the next result of a decision to a chosen category.
- Mechanic: `mods.pins[]` gets `{stream, keyPattern, want, uses, expires}`. The site's `rollTable` or `rollChance` checks pins before returning. The unit value is replaced by one inside the wanted interval (`start + frac * width`, with `frac` from the same hash), so receipts still look native.
- A pin cannot name a category the table does not contain. It cannot make an impossible thing happen. A different cheat can (Origin tier, 7.8).
- Cost shape: usually per use, or "once per day, free."

### 7.4 Bias

Shift weights on one stream for a while.
- Mechanic: `mods.biases[]` holds `{stream, tag, mult, until}`. Applied to weights before the draw, like an E5 multiplier. Composition: **multiply** by default. Options: add, or clamp to a max.
- Strength is bounded unless the cheat says otherwise. A pure cheat can be unbounded.
- Bias on `fate:<id>` changes how often fate pulls, not what a card is.

### 7.5 Steal

Take part of or all of another person's `fate:<id>` or luck.

| Option | Rule |
|---|---|
| S1 transfer | Move `bias` points from the victim's `fate` cell to the thief's. Victim gains `unlucky`, thief `lucky`. Points decay back over time. |
| S2 swap | Exchange the two fate cells. Events aimed at the victim now find the thief. |
| S3 share | Copy. Both draw from one cursor, so they get the same pulls. Breaks when they part. |

Every steal writes an access log entry on both sides. The victim's `fate.debt`
fact can raise a callback card ("something is wrong with my luck"). Two fates in
one place compete (EMERGENT Q4): by default each pulls, and the higher pull
decides, unless a collision rule says otherwise.

### 7.6 Branch and rewind

A **branch** saves `{n, salt}` for chosen streams, plus the world state the cheat
declares. Restoring has three modes, set by the cheat:

| Mode | Streams after restore | What the player gets |
|---|---|---|
| `replay` | Same `n`, same `salt` | The world rolls the same dice. Knowledge is the power. Keyed draws (2.2) stay identical even if the player acts in a different order, so a rewind cannot farm a better loot roll. |
| `fork` | Same `n`, `salt + 1` on chosen streams | New dice. This is reward farming. |
| `split` | `replay` for `world.*`, `fork` for named streams (`loot`, `craft`) | A loop world where days repeat but drops vary. |

- What carries back is a separate dial (north star): memory only, memory plus skill, or items. Streams do not care; they only decide the dice.
- Detectability: a rewind writes `history.loop` as a fact. Diviners and blind-lifted checks read it (north star: rewinds are detectable).
- Costs are per cheat: a charge, sanity, a soul wear, a world that hardens each loop (`director` weights rise with loop count).
- Save-slot restore is not a cheat. It is a `replay` of whole state. See 9.

### 7.7 Blind

Hide your streams from others' See.
- Mechanic: a `blind` flag on a stream cell or person. A See against it returns one of: **nothing**, **noise** (values from a decoy stream), or **a lie** (a different real stream's values). Cheat picks.
- Contest: if the viewer's See and the target's Blind both apply, default **higher tier wins**; a collision rule can declare otherwise (north star: precedence is declared per collision).
- Cost: none or attention. Blinding to a See leaves no log for the viewer.

### 7.8 Example cheats

| Tier | Name | Access | Cost | Limit | Log |
|---|---|---|---|---|---|
| Knack | Weather nose | See, `world.events@*`, level 1, next result only, once per day | None | Only your own world's next event, only its tag | Entry per use |
| Gift | Second Look | Reroll, `loot@*`, scope own, 1 per day, keep better | 1 `luck_charge` per use, refilled at dawn | Only unclaimed drops | Original and replacement both kept |
| Golden finger | Ledger Jar | See `loot@*` level 1 for 3 kills ahead, plus Pin `loot` category once per day | 1 `coin` per Pin | Pin cannot add an item the kill table lacks | Pins list on the jar's panel |
| Fate-class | Luck Eater | Steal S1 on `fate:*` in scope `near`; Blind own `fate` | Raises `world.attention`; victims gain `unlucky` | Points decay in 7 days | Entry on both sides |
| Fate-class | Regression loop | Branch `split`; See own `fate` | 1 sanity per restore; `director` hardens by 5% per loop | World remembers a loop via `history.loop` | Loop count visible to diviners |
| Origin-class | Absolute luck (pure, no cost) | Bias `*` on own streams, unbounded, plus Pin any declared category | None | A world that reads it literally may treat "luck" as a debt (EMERGENT Q4 fate); people who learn of it react | Log exists; others' See is Blind by default |

Pure cheats stay pure: the log is information for the player and a hook for rules,
never a price.

## 8. Fate streams and how cheats meet them (Proposal)

A fate stream `fate:<id>` is a cursor stream. It does not pick cards. It answers
two questions for decisions that carry the person's tag: **does fate pull now**
(a draw against the person's `fated` strength) and **toward which card tag**.

Order at one deck draw (default):

| Step | What | Stream |
|---|---|---|
| 1 | Base weights from the deck (cooldowns, E5 multipliers by world and place) | none |
| 2 | Fate pull: if it fires, multiply weights of cards tagged to the person | `fate:<id>` |
| 3 | Cheat Bias (7.4) | cheat state |
| 4 | Draw the card | `deck:<id>` |
| 5 | Cheat Pin or Reroll (7.2, 7.3) | cheat state |
| 6 | Receipt, with `via` set if any cheat touched it | receipt |

Collision options, declared per collision (not a global rule):

| Option | Rule |
|---|---|
| C1 (default) | Player cheats act last. A Pin at step 5 beats fate. |
| C2 | Fate locks. A card tagged `fated` cannot be pinned or rerolled away, only delayed. |
| C3 | Contest. Both sides compare strength each draw; the stronger side wins this one. |

C2 is what gives a Fated Child story teeth. C1 is what a pure cheat wants. The
cheat's own definition or the world's collision list chooses.

## 9. Import, export and save-scumming policy (Proposal)

Ground truth (RNG doc): a local save can always be restored or edited. The
enforceable contract is coherent restoration with no mixing of old costs and new
rewards, not anti-cheat.

Per-life setting, `saves`, with these options:

| Option | Rule | Notes |
|---|---|---|
| `free` (default) | Slot restore and import are allowed. Streams are in the save, so a restore is a `replay`. | Honest. Costs nothing. |
| `sticky` | The game keeps the one live save per life and overwrites on every decision commit. Reload resumes. No manual restore. | Closer to "no free reroll" without an anti-cheat claim. |
| `ironman` | `sticky` plus death ends the life with no restore. | A challenge, per life, per Weibao's call. |
| `loopaware` | `free`, but each restore writes `history.loop`, so worlds with diviners notice. | Fits the north star's detectable rewinds. |

What streams do to scumming, with no policy at all:
- A reload cannot reroll a pending decision, because its result is a saved receipt or a keyed pure function.
- Acting in a different order cannot shift a keyed result (kills, shop epochs, craft batches). It can still shift cursor streams (`deck`, `director`) if a different number of draws happens first. That is intended for cursors: order is part of the story.
- A reroll costs only what a cheat says it costs.

Export and import:
- Export includes `streams` whole. Import validates each cell (`n` and `salt` integers, `bias` a plain object), keeps unknown stream names, and creates missing ones lazily.
- Importing an older save is a historical branch. Do not merge it with newer state.
- Seed codes: exporting `root` lets a friend start the same campaign. The life is `seeded: true`. Same root plus same choices gives the same results, because of keyed draws.
- Import of a save from a newer build is refused.

## 10. Worked Village examples (Proposal)

Start: root `R`. Village, day 12, calm.

### V1. Reload does not reroll

| Step | Action | Stream | Result |
|---|---|---|---|
| 1 | Morning deck tick | `deck:village.daily@village` n=11 | Card `debt_collector_visits`, receipt `…|n11` |
| 2 | Casting picks Oren | `people:village.oren` n=30 | Oren, receipt on the card |
| 3 | Player reloads | none | Same card, same cast, same receipts. No draw on load |

### V2. A shop refresh does not shift a fight

| Step | Action | Stream | Result |
|---|---|---|---|
| 1 | Fight frog `frog#17` starts | `encounter:frog#17` keys `f1.a0.crit`, `f1.a0.block`… | Fixed by `(root, key, n)` |
| 2 | Mid fight, player opens the trader after epoch change | `market@village|epoch:42` | Stock is a pure function of the epoch |
| 3 | Fight ends | `loot@village|frog#17.drop.hide` | Drop decided by the kill key. The shop never drew from it |
| 4 | Player buys, closes, reopens | none | Same stock until epoch 43 |

Without streams, the shop and fight share `Math.random` (F14, F16) and a reload
mid-fight rerolls loot.

### V3. Receipt on day 12

```js
{ id: 'deck:village.daily@village|n11', s: 'deck:village.daily@village', n: 11, u: 0.4128,
  site: 'deck.draw', decided: 'card village.debt_collector_visits',
  via: null, orig: null }
```
`director@village` n=11 holds a threat multiplier of 1.3 at that tick. Hovering the
card shows why: "calm four days; Oren owes 40."

### V4. Second Look on frog loot

Cheat: Second Look (7.8). Kill `frog#17`. Natural receipt:
`{ k:'frog#17.drop.hide', salt:0, u:0.91, decided:'no drop' }`. Player pays one
`luck_charge`, salt becomes 1, new receipt `u:0.22, decided:'drop:frog_hide x1',
via:{kind:'reroll', cheat:'second_look', cost:'luck_charge'}, orig:<first id>`.
The log shows both. Re-running the reroll on the same unclaimed drop is blocked by
`uses` (1 per day). Reloading restores the second result because it is saved.

### V5. Luck Eater against Oren

Oren is not fated, so S1 steals little. The collector card fires, tagged
`debt`. The thief steals 2 bias points from `fate:village.oren`. Oren gains
`unlucky`. His `fate.debt` fact sets a callback card eligible 4 days later: "Oren
swears the dice have turned." No script wrote that.

### V6. Rewind on day 12 with Regression loop (`split`)

Restore to day 11. `world.events@village` and `deck:*` replay (same card again).
`loot` forks (`salt + 1`), so frog drops differ. `history.loop` is set. A visiting
diviner next week asks about it. The player remembers that the card is coming, so
they can walk past before it lands.

### V7. Smallest proof test

Move the Village `deck:village.daily` and `people:<id>` onto two named streams.
Same root, same 30 days: byte-identical log (including receipts). Different root:
different log. Add a third assertion: opening the trader 50 times changes no
other cell.

## 11. Risks, build order and checklist status (Proposal)

**Risks**
- R1 Two saves: native `create_save` and the expansion envelope are separate (RNG doc). A stream cell advanced in one and not the other can reroll on load. Fix: native sites commit cell and result together, or keyed draws only for native sites (no cell to lose).
- R2 Keyed draws make rewinds identical for loot. Intended, but Weibao may want loops to farm. `fork` and `split` cover that.
- R3 Changing draw order moves future results of old saves. Accepted for future draws (EMERGENT E1 risk). Never re-derive past ones.
- R4 `legacyRound` preserves F13's half-weight endpoints. Documented, not fixed.
- R5 See on cursor streams goes stale when weights change. Labeled in the log.
- R6 Stream sprawl. The registry (section 3) and the 512-cell cap bound it.

**Build order**
1. B1: `streams` cell, `mix32`, `rollChance/Table/Int`, registry, tests for purity and compaction.
2. B2: Village deck and people on `deck:` and `people:` (the smallest proof, V7).
3. B3: shop epochs (`market`), encounter composition (`encounter`).
4. B4: loot and combat via injected `random` (F12).
5. B5: craft, gather, reward; then move `legacy.action` to `discovery`.
6. B6: cheat access layer (see, reroll, pin, bias) and the access log.
7. B7: fate, steal, branch, blind.

**Checklist status**

| Item | Where |
|---|---|
| Stream list agreed (names and what each owns) | Section 3 (draft; Weibao to agree) |
| Save shape and migration from single `rng` decided | Section 4.1 and 4.2 (draft) |
| Native call sites ordered by priority | Section 5 (draft) |
| Receipt format | 4.4 |
| Stream compaction | 4.5 |

## Open questions for Weibao

1. Q1: Should a rewind inside a cheat default to `replay` (same dice, knowledge is the power), `fork` (new dice, farming) or `split`? Each cheat can override.
2. Q2: Which `saves` default for a new life: `free`, `sticky`, `loopaware`? I assumed `free` and no anti-cheat claim.
3. Q3: Default fate collision with a player cheat: player last (C1), fate locks (C2), or contest (C3)?
4. Q4: Should streams travel by owner (W1: world stays, person travels) or should each world declare its own mode (W4) from day one?
5. Q5: For a new life after death, should world dice continue (L1) while the person gets a fresh root, or should fate carry over (L4) by default?

## Vocabulary additions

Added to [SHARED_VOCABULARY.md](SHARED_VOCABULARY.md) names (not renames):

- **Streams:** `gather`, `reward`, `legacy.action`, `legacy.outcome`.
- **Stream key forms:** `<stream>@<worldId>` (world-scoped), `<stream>|<key>` (keyed draw).
- **Terms:** *cell* (a stream's saved state `{n, salt}`), *decision*, *keyed draw*, *cursor stream*, *receipt*, *salt*.
- **Roll API:** `rollChance`, `rollTable`, `rollInt` (`dist: 'uniform' | 'legacyRound'`).
- **Cheat access kinds** (exact words): `see`, `reroll`, `pin`, `bias`, `steal`, `branch`, `blind`. Branch modes: `replay`, `fork`, `split`. Steal modes: `S1 transfer`, `S2 swap`, `S3 share`.
- **Facts:** `world.attention`, `fate.debt`, `history.loop`.
- **Life flag:** `seeded`. **Life setting:** `saves: free | sticky | ironman | loopaware`.
- **Resource:** `luck_charge` (example cheat currency, not engine-reserved).
- **State fields:** `streams.root`, `streams.cells`, `streams.mods`, `streams.log`, `streams.branches`.
