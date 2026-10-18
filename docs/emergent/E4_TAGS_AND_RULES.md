# E4. Tags and interaction rules: build-ready draft (proposal)

Claude, 2026-10-09. Expands layer E4 of [Emergent systems](../EMERGENT_SYSTEMS.md),
including "Tags as the material layer (Q3)" and "Tags and rules everywhere
(engine level)". Names follow [the shared vocabulary](SHARED_VOCABULARY.md);
new names are listed at the end.

**Everything here is a proposal.** Nothing is selected for a build. Principle:
[anything is possible](../USER_VISION.md#anything-is-possible-2026-10-09).
Where a design has several answers, each stays reachable and the world, cheat,
storyteller or player decides.

Labels: **[V]** verified in source on 2026-10-09 (`file:line`). **[P]**
proposal. **[I]** inference from verified code, not run.

**2026-10-15 direction and expansion:** titles may grant real powers through
worlds or cheats, achievements may supply grants, and tags may act on rules
themselves. [User direction](../USER_VISION.md#titles-achievements-and-tags-on-rules-2026-10-15)
owns the accepted possibilities; the [connected expansion](TITLES_ACHIEVEMENTS_AND_META_RULES_2026-10-15.md)
owns proposed grant modes, cheat loops, NPC/world interactions and persistence.
The 2026-10-09 schemas, costs, seats and tier ladder below remain historical
proposal choices, not universal restrictions or the current runtime contract.
Current source seams are mapped in the [Proto23 follow-up](../research/proto23/TAGS_IDENTITY_AND_COMIC_LOGIC_2026-10-15.md#f8-the-live-yairpg-seams-are-more-developed-than-the-old-draft).

## 1. What the source says today

### 1.1 Verified facts [V]

| # | Fact | Where |
|---|---|---|
| V1 | The rule language has `eq`, `gte`, `lte`, `all`, `any`, `not`. There is no `neq`. | `src/rules.js:20`, `src/simulation_contracts.js:26-36` |
| V2 | An absent fact is "unknown" and never met. `not` is met only when the inner fact is known and false. | `src/rules.js:22-29` |
| V3 | `meets(rule, facts)` takes one flat map. Names are `actor.x`, `target.x`, `item.<key>`, `condition.<id>`, `world.x`, `weather.raining`. No `$` prefix. `simulationFacts` calls about 15 fact providers, so it is heavy. | `src/simulation_contracts.js:36`, `src/simulation_effects.js:64-102` |
| V4 | Registry families are a fixed list. Each definition needs `id`, positive `revision`, `label`, and is deep-frozen. `requires` and `visibleWhen` are validated for every family. | `src/simulation_contracts.js:87`, `:93-105` |
| V5 | Effect types are a closed set of 31. Selectors: `$actor`, `$target`, `$party`, `$spawn.<id>` or a stable ID. | `src/simulation_contracts.js:37`, `:42-85` |
| V6 | One effect pass is capped at 256 expanded effects. The simulation log keeps 100 lines. Per-check randomness is xorshift32 seeded by `hash(seed, id)`; native rolls use `Math.random` or `random_range`. | `src/simulation_effects.js:140`, `src/simulation.js:32-34`, `:64`, `src/crafting_recipes.js:204-205` |
| V7 | `conditions` already do expiry, stacking (`sum` or max), `intensity`, `interval` and `onTick`, and appear as `condition.<id>` facts. | `src/simulation_effects.js:246-258`, `:95`, `src/simulation.js:463-467` |
| V8 | Boundary order: jobs, conditions, life, event expiry, event checks, controllers, programs. `nextSimulationBoundary` must list every timed thing or the clock skips it. | `src/simulation.js:449-540`, `:~441-447` |
| V9 | Effects `knowledge` (stages `seen`, `interpreted`, `understood`), `progress`, `unlock` (kinds include `recipe`) and `power` exist. | `src/simulation_contracts.js:64`, `:70`, `:71`, `:74` |
| V10 | Vanilla items and enemies already have `tags`: a map of `name: true` used as categories (`food`, `component`, `weapon`, `small`). | `src/items.js:201-202`, `src/enemies.js:68-86` |
| V11 | An inventory is a map `itemKey -> {item, count}`. The key is a JSON string with `id` or `components`, plus optional `quality`. Same key, same stack. | `src/components/inventory_component.js:11-46`, `src/items.js:228-250` |
| V12 | Saves write `{count}` per key. Load rebuilds the item from the key; `getItemFromKey` reads only `id`, `components`, `quality`. | `src/main.js:4533-4543`, `src/items.js:1213-1218` |
| V13 | Keys already carry extra fields. The Measured drain strip uses `{id, datum}` with a custom loader. `validateItemKey` accepts extra fields. | `src/world_completion_strip.js:5-7`, `src/world_completion_native.js:3-11`, `src/gameplay_transactions.js:27-33` |
| V14 | Recipe material lookup matches `item.id`, not the exact key, so variants of one id already work as inputs. | `src/crafting_recipes.js:318-336` |
| V15 | Recipe quality is `3*skill - max + 130 + 15*tier`, clamped. Recipes carry `success_chance` and `recipe_level`. | `src/crafting_recipes.js:85-101`, `:104-125` |
| V16 | Springsteel is one hand-built recipe (Iron + Steel + coal) with a frozen `alloy_profile`. | `src/crafting_recipes.js:1166-1171`, `src/alloy_equipment.js:3-9`, `src/items.js:4454` |
| V17 | Wetness today is two item IDs: "Wet seal blank" and "Sound seal blank". | `src/data/expedition_items.js:25-26` |
| V18 | Native player equipment is saved as item objects rebuilt from `components` and `quality`. Simulation equipment is saved as key strings. | `src/main.js:5046-5075`, `src/simulation_contracts.js:233`, `src/native_equipment_transaction.js:3-5` |
| V19 | Combat: `on_damaged` and `on_hit` run at one point, `on_death` at another, and `actionAdapter` can replace an action. | `src/models/combat.js:387-388`, `:430`, `:251-253` |
| V20 | Vanilla active effects "Wet", "Cold", "Very cold" exist; `use_item` applies food effects with `add_active_effect`. | `src/active_effects.js:39-60`, `src/main.js:4102-4119`, `:4231` |
| V21 | Weather reaches the simulation as `weather.raining`, `weather.damp`. Season is `getSeason()`. | `src/main.js:542`, `:3031`, `src/game_time.js:63` |
| V22 | Optional state owners carry their own `schema` and bump the engine schema (5 to 11 so far). Absent owner means no feature. | `src/expansion_engine.js:55-59`, `:133-137`, `:251-258` |

### 1.2 Where the parent doc and the source disagree

- **C1.** The parent doc writes `neq` and facts named `$actor.tag.burning`.
  Source has no `neq` (V1) and no `$` in facts (V3). [P] Facts become
  `actor.tag.burning`; the tag engine tests presence, not `meets`. Absent
  tags are unknown (V2), so the adapter emits an explicit `false` for each
  tag a rule or card names.
- **C2.** "Rules as a registry family" is one string at `:87` (V4), but rule
  effects need about five new effect types (V5). Small, not free.
- **C3.** The parent doc ignores vanilla `tags` (V10) and `conditions` (V7).
  [P] Vanilla tags and conditions feed the adapter (section 8).
- **C4.** The parent doc treats a key suffix as one of three equal options.
  The key already carries extra fields (V13) and lookup matches by id (V14),
  so that route is far cheaper than assumed (section 9).

## 2. Design rules [P]

1. A tag is a short string with strength 1 to 9. A rule connects tags, never
   named things; a rule that names one item or person is a card (E2).
2. Effects use the existing pipeline (V5). All randomness uses the
   `interaction` stream. Every firing explains itself in a chain log.
3. Limits (hop cap, slots, visibility, which layer wins) are dials a world,
   layer or cheat can set. Vanilla works unchanged with the system off.

## 3. Tag store

### 3.1 Sources of an entity's tags [P]

Merged in order: (1) **template** tags on an authored definition; (2)
**overlay** tags for vanilla items and enemies (section 9.1); (3) **layer
grants**, tags a layer adds to anything matching a pattern; (4) **instance
deltas**, saved changes. Effective = (1+2+3) minus removed plus added. Equal
tags take the max strength unless the tag is `sum`.

### 3.2 Tag definitions (registry family `tags`) [P]

```js
{ id: 'burning', revision: 1, label: 'Burning', family: 'state',
  stacking: 'max', maxStrength: 5,     // stacking 'max' | 'sum'
  visible: 'open', learnedBy: null,    // 'open' | 'hidden' | 'learnable'; knowledge key that reveals it
  decay: { every: 10, by: 1 },         // minutes; removed at 0; read by the boundary scheduler
  cancels: ['wet'],                    // shortcut for opposed pairs
  itemState: false }                   // may live in an item key (section 9)
```

### 3.3 Instance deltas [P]

```js
state.tagWorld = {                 // new optional owner, schema 1 (V22 pattern)
  schema: 1, seq: 0, rng: <uint32>,          // 'interaction' stream state until E1 owns it
  deltas: { 'person:village.oren': { add: { drunk: { s: 2, until: 5820, cause: 'rule:tavern#41' } }, rm: ['proud'] },
            'place:village.market_stall': { add: { burning: { s: 3, until: 5700, cause: 'chain:17' } } } },
  slots:  { 'player:weapon': { burning: { s: 1, until: 5640 } } },    // equipped item state (9.3)
  known:  { 'rule:base.fire_spreads': { stage: 'understood', uses: 14 } },   // 12.1
  chains: [ /* last 60 chain records, 7.2 */ ], deferred: [ /* up to 32, 7.1 */ ] }
```

- Keyed by vocabulary entity IDs (generated people have stable IDs, V5 `spawn`).
  `until` is an absolute game minute on `state.clock`. `cause` is rule plus
  chain, so any tag can answer "why do I have this".
- Caps: 12 added tags per entity, 2000 entities with deltas. At each
  boundary, expired entries and entries equal to the template are deleted.
  Far-tier entities (E3) get no deltas.

### 3.4 Actor state tags and `conditions` [P]

V7: conditions already do expiry and ticks for simulation actors. **TS-A**,
own store (recommended for new tags): one place for rules, works for places
and items. **TS-B**, conditions as backing: a timed actor tag is a condition
with the same ID. Both stay reachable. The adapter reads existing conditions
as tags either way. Never write one state in both places.

### 3.5 Save shape and migration [P]

- `state.tagWorld` is optional; absent means vanilla. Old saves need no data
  change. First creation bumps `ENGINE_SCHEMA` to 12, as every owner did
  (V22); an older build then refuses the save instead of dropping tags [I].
- `validateTagWorld` checks tag IDs, strength range, `until` natural and not
  before the clock, caps, string `rm`. Unknown tag or entity IDs are dropped
  with a log line, never a load failure.
- Tests: round trip; load with no owner; load after a tag is removed; same
  seed and 30 days gives byte-identical output; export and import. Per
  AGENTS.md also play from a fresh origin; label the rest unverified.

## 4. Rule schema, field by field [P]

A rule is a registry family `rules` entry (C2).

### 4.1 Fields

| Field | Type | Req | Meaning and validation |
|---|---|---|---|
| `id`, `revision`, `label` | ID, int, string | yes | Registry requirements (V4). IDs look like `rule:<layer>.<name>`. |
| `layer` | `base`, `world`, `place`, `personal` | yes | Section 6. |
| `owner` | entity ID | non-base | The world, place or entity that owns the rule. |
| `trigger` | `contact`, `tick`, `arrival`, `change`, `hook:<name>` | yes | Section 5. |
| `contact` | `touch`, `hit`, `use`, `drop`, `share_place`, `carry`, `mix`, `any` | contact only | Kind of contact. |
| `when.a`, `when.b` | tag pattern | `a` yes | The active and the other entity. |
| `when.via` | tag pattern | no | Tags of the weapon, skill, rune or tool doing it. |
| `when.place` | tag pattern | no | Tags of the place. |
| `when.extra` | existing rule | no | A `meets` rule on ordinary facts (money, knowledge, relationship). |
| `then` | effects, max 6 | yes | Existing effects plus 4.3. |
| `chance` | number or `{fact,scale,add,min,max}` | no | Same shape as event `chance` (V4). Default 1. |
| `priority`, `group` | int, string | no | Higher first inside a layer; only the top rule of a `group` fires. |
| `cooldown`, `repeat` | `{per:'pair'\|'entity', minutes}`, bool | no | Stops the same pair re-firing; `repeat` allows (rule, a, b) twice in one chain. |
| `overrides`, `disables` | rule IDs | no | Replace or switch off those rules while this one applies. |
| `scope` | `all`, `owner_a`, `owner_b`, `owner_any` | personal | Whose events it touches. |
| `lock` | concept tier | no | Needed tier to disable or override it (12.3). |
| `explain` | template | yes | Log text with `#a#`, `#b#`, `#place#`, `#roll#`. |
| `tags`, `knownAs`, `visibleWhen` | list, key, rule | no | Rules are entities too; `knownAs` is the knowledge key; `visibleWhen` hides it from the knowledge list (V4). |

### 4.2 Tag patterns

Matched by the tag engine, not `meets` (C1, C2): `'burning'`, `'burning>=2'`,
`'!wet'`, `['wood','cloth']` (any), `{all:[...]}`, `{any:[...], none:[...]}`.
Each rule needs a positive tag in `a` or a `hook:` trigger, so it can be
indexed (7.1).

### 4.3 Effects in `then`

Reused: `fact`, `resource`, `vital`, `item`, `transfer`, `relationship`,
`knowledge`, `unlock`, `progress`, `condition`, `event`, `situation`, `life`,
`title`, `power`, `body` (V5). New, each added to the set at
`simulation_contracts.js:42` with a validator:

| Effect | Shape | Does |
|---|---|---|
| `tag` | `{type:'tag', target:'$a', op:'add'\|'remove'\|'set', tag, s, minutes}` | Writes a delta. |
| `transform` | `{type:'transform', target:'$b', into:<key>, count:'all'\|n}` | Swaps a stack or template (wood to Charcoal). |
| `emit` | `{type:'emit', hook, a, b}` | Raises a hook; counts as a hop. |
| `veto` | `{type:'veto', reason}` | Cancels the action that raised the hook (equip, sell, travel). |
| `rule` | `{type:'rule', op:'add'\|'remove'\|'override', layer, rule}` | Meta-rules (12.3). |

Selectors `$a`, `$b`, `$via`, `$place` map to `$actor`/`$target` for
simulation actors (V5). Items, slots and places need new selectors
`item:<key>`, `slot:<actor>:<slot>`, `place:<id>`.

### 4.4 Resolving one event

`gather` candidates from the index, all layers; `filter` (layer applies,
patterns match, `extra` meets, cooldown); `resolve` (6.2); `order`; `roll`
one draw per rule with `chance < 1`; `apply` through the normal pipeline,
queueing hops for `tag` and `emit`; `log` one chain.

## 5. Triggers wired to code paths

### 5.1 Table [P]

| Trigger | Fires when | Hooked at | Note |
|---|---|---|---|
| `contact:hit` | A hit lands | `combat.js:387-388`, adapter `:251` (V19) | `via` = weapon tags (weapon type is already a vanilla tag, `items.js:975`) plus skill tags. Native combat is a wall-time loop with `Math.random` (V6), so the hook builds an event and resolves it at once; timed follow-ups become deltas with `until`. |
| `contact:use`, `contact:mix` | Item used; brew, smelt, meal or enchant committed | `main.js:4102` `use_item`, `:3618` `use_recipe`; `commitSimulationCommand` (`simulation.js:231`), `completeJob` (`:239`) | Mix is section 11. |
| `contact:drop`, `contact:carry` | Item dropped, or gained or lost | `inventory_component.js:23-77`; simulation `item` effect | Curses, greed, breakage. |
| `contact:share_place` | Two entities in one place on a boundary | New boundary step | Pair only entities whose tags some contact rule mentions. |
| `tick` | A tag with `decay`, or a tag-active tick rule | New step after the conditions loop (`simulation.js:463`) | `nextSimulationBoundary` must include the next tag expiry (V8). |
| `arrival` | Entity enters a place | `main.js:1719` `change_location`; `relocate` effect | Runs on the entity and its carried items. |
| `change` | Tag added or removed | Inside the engine after `apply` | How chains continue without `emit`. |
| `hook:day_start` | Calendar day rolls | `main.js:6524` `update_timer` | Spoilage, crops, whole-stack item changes (9.3). |
| `hook:skill_used` | Skill exercised | Where `add_xp_to_skill` is called (`combat.js:217`, `main.js`) | `via` = skill tags. |
| `hook:equip` / `unequip` | Gear changes | `native_equipment_transaction.js:6` | `veto` acts here. |
| `hook:craft_done`, `death`, `crime_seen`, `cross_barrier` | Engine events | Craft end, `life` effect, law cards, travel transitions | |

Scheduling: tag work runs after the conditions loop (so condition ticks can
set tags) and before event checks (so cards see this tick's tags). Tag expiry
joins `nextSimulationBoundary` so fast-forward cannot skip a burn-out (V8).

## 6. Layers, order, override and disable

### 6.1 Which layers apply to an event [P]

Low to high: `base`, `world`, `place`, `personal`.
`base` always. `world`: the world of the place **where the event happens**,
not the carrier's home, so a sword changes behavior across a barrier.
`place`: the place and parents (a cellar in a house). `personal`: rules owned
by `a`, `b` or `via`, filtered by `scope`; gear, enchants, cheats,
constitutions, titles and owned concepts supply them.

### 6.2 Resolution [P]

1. **Disable.** A rule named in `disables` of an applicable rule is removed.
   Higher layer wins; same layer, higher `priority`; a tie disables both and
   logs `conflict`. If the target has `lock`, the disabler needs that tier
   (12.3), else the disable is ignored and logged.
2. **Override.** Replaces the target's `then` and `chance`; the target keeps
   its place. Several overrides: highest layer, then priority.
3. **Group.** Only the top rule of each `group` fires.
4. **Order.** Layer ascending, priority descending, rule ID, entity ID, so
   replays match.

Personal `disables` with `scope: owner_b` is immunity; `owner_a` is "I never
do this". A place `disables` covers everything inside (a sanctuary). A rule
that is off still shows in the knowledge list as "does not apply here".

## 7. Indexing, chain cap, logs

### 7.1 Index and chain cap [P]

- At registry build make `index[tag] -> [ruleId]` from every positive tag in
  `a`, `b`, `via`, `place`, plus `hookIndex[hook]`. On a tag change the
  candidates are `index[changedTag]`; on a contact, the smaller entity's tag
  set. Cost follows rules that mention a present tag, not total rules.
- Default **8 hops** and **64 firings** per boundary or commit, inside the
  256-effect pass (V6). Breadth first. Each (rule, a, b) runs once per root
  unless `repeat`.
- Past the cap, firings go to `deferred` (max 32) and run next boundary with
  the same `cause`; if full, the oldest drop with a `chain_dropped` line.
- A world, layer or Law-tier concept may set `chainCap` and `firingBudget`.

### 7.2 Randomness and the chain record [P]

Until E1 lands, E4 keeps `tagWorld.rng` using the xorshift32 of V6, one draw
per rule with `chance < 1`, in the order of 6.2. After E1: stream
`interaction`, sub-stream `interaction:<chainSeq>`. A chain record:

```js
{ seq: 17, at: 5605, root: { trigger:'contact', contact:'drop', a:'item:lamp', place:'place:village.market' },
  hops: [ { n:1, rule:'rule:base.glass_breaks', roll:0.31, did:['lamp +broken'] } ], capped: false }
```

Ring of 60. The UI shows chains of 2 or more hops, or ones touching things the
player owns or sees, as one expandable line; "show all" lists the rest.

## 8. Adapter from existing facts to tags [P]

`tagsOf(entity, state, ctx)` is a pure function merging the four sources
(3.1). Its mapping table is data.

| Source | Tag result |
|---|---|
| Item vanilla `tags.food`, `tags.drink` (V10) | `edible` (plus `liquid` for drink) |
| Item `material_type` (`metal`, `bone`, `wood`, `raw meat`, `healing herb`) | `metal`, `bone`, `wood`, `flesh`, `herb` |
| Weapon type vanilla tag (`items.js:975`) | `sharp` for blades, `heavy` for maces, as `via` |
| Enemy `tags` map and size (V10) | Same names; `small`, `large` |
| Vanilla active effects Wet, Cold, Very cold (V20) | `wet`, `cold:1`, `cold:3` on the player |
| Simulation `condition.<id>` (V7) | Tag of the same ID, strength = intensity |
| `weather.raining`, `weather.damp`, season (V21) | Place tags `raining`, `damp`, `winter` |
| `vital.health` under 30 percent of max | `injured` |
| Relationship axes, place card | `rival`, `friend`, `debtor` over thresholds; `indoors`, `lawful`, `dark`, `cold` |

**Exposure to `meets`.** `simulationFacts` is heavy (V3) and absent facts fail
(V2), so the adapter never dumps all tags. A card or controller `when` names
the tags it needs; the adapter adds `actor.tag.<n>`, `actor.tag.<n>.strength`,
`target.tag.<n>` with an explicit `false` or `0` when absent. Old features
move onto tags only when touched.

## 9. Vanilla overlay and the item instance state decision

### 9.1 Overlay table [P]

`src/data/tag_overlay.js` (new), keyed by `item_templates` ID. Vanilla files
stay untouched.

```js
export const ITEM_TAGS = {
  'Iron ore': ['metal:3','stone:1','brittle:1'],   'Iron ingot': ['metal:4','heavy:1'],
  'Steel ingot': ['metal:6','sharp:1'],            'Coal': ['flammable:3'],
  'Oneberry': ['herb','healing:3','sweet:1'],      'Silver thistle': ['herb','healing:5','bitter:2'],
  'Golmoon leaf': ['herb','healing:2','bitter:1'], 'Rat fang': ['bone','sharp:1','venom:3'],
  'Rat meat chunks': ['flesh','edible'],           'Glass phial': ['glass','brittle:2'],
  'Fresh bread': ['edible','sweet:1','flammable:1'], 'Wet seal blank': ['wood','wet:2'] };
```

Every key must exist in `item_templates`, checked at load like the duplicate
guard in `expedition_items.js`. Numbers are tuned in play. A row derived from
`material_type` and vanilla tags (section 8) is used when no explicit row
exists. A setting `emergent.tags` off empties the adapter and sleeps the
engine, giving vanilla back. Vanilla recipes stay (section 11).

### 9.2 The item instance state decision

**Need.** A wet sword, rotten bread, a poisoned dagger, a murky brew. A stack
is a key and a count (V11, V12); no per-item object survives a save.

**Option A: equipped or unique only.** For: no stack changes. Against: a loaf
can never be wet or rotten and a brew's residue has no home; today's
workaround is one item ID per state (V17) and does not scale. Native
equipment is rebuilt from `components` and `quality` (V18), so even A needs a
loader patch.

**Option B: key variant suffix.** Optional `t`, a sorted array of tag
strings: `{"id":"Fresh bread","t":["wet"]}`.
- For: rides the key that holds `quality` and `components`, with a shipped
  extra field (`datum`, V13). `validateItemKey` accepts it (V13). Transfers,
  custody and trades key by string (`acquisition.js:42-63`). Saves already
  write key plus count (V12). Recipe lookup by id still counts a wet loaf as
  bread (V14). Simulation equipment saves keys (V18).
- Against: `getItemFromKey` reads three fields (V12), so it needs a patch
  that keeps the key and exposes tags (the `preserveWorldCompletionNativeItem`
  trick, V13). `createInventoryKey` (`items.js:235`) must emit `t` in one
  canonical order or equal states will not stack. Free-form or timed tags
  would multiply stacks. `item.<key>` facts count exact keys (V3). Native
  player equipment saves objects, not keys (V18).

**Option C: side table.** For: no key change. Against: vanilla add and remove
code (`inventory_component.js:23-77`) does not know the table, so trades and
crafts drift it. Keyed by unique instance ID it is option A. Rejected for
stacks; good for entities with IDs and for one equipped slot.

**Recommendation [P]: three tiers.**
1. **Tier 1, default: no instance state.** Template and overlay tags cover
   most of the Village.
2. **Tier 2: durable discrete state in the key (B).** Only `itemState` tags:
   `wet`, `rotten`, `poisoned`, `blessed`, `cursed`, `coated:<tag>`, brew and
   alloy residue, enchants. At most 3 entries, strengths rounded to odd
   values (1,3,5,7,9) so variants stay few.
3. **Tier 3: timed state only on equipped items (C, narrow).** `burning`,
   charges. When an item leaves its slot a rule turns timed state into a
   Tier 2 tag. No timer ever sits in a stack.

**Compatibility [I unless marked].**
- Old saves: keys without `t` stay valid and mean no state. No inventory
  migration; only new variants carry `t`.
- Downgrade: an older build keeps the saved map key (V11, V12) and shows the
  plain template. Safe, state invisible.
- Extend `validateItemKey` (V13): `t` optional, at most 3 strings, `name` or
  `name:1..9`, `itemState` tags only, sorted, unique. One canonical key
  builder: id or components, then quality, then `t`.
- Patch the native equipment loader (`main.js:5046-5075`) to read `t`.
- Price still comes from id and quality; a tag multiplier is a later dial.
- Rollout: Tier 1 first; Tier 2 with alchemy residue; Tier 3 with burning weapons.

### 9.3 Item changes over time, slots, aggregates [P]

No per-item timers. State changes on discrete hooks (`day_start`, rest,
arrival). For a stack of `n` with chance `p`, move
`floor(n*p) + (draw < frac(n*p) ? 1 : 0)` items to the new key: one draw per
stack per rule. A stack of 10 wet herbs at p=0.3 gives 3 `rotten`, 7 unchanged.
`tagWorld.slots['player:weapon']` holds Tier 3 state for the item in that
slot; equip and unequip move or convert it. The adapter adds `item.<id>.any`
(all variants) and `itemtag.<tag>` (carried items with that tag) so authors
need not know variant keys.

## 10. Village starter set

### 10.1 Tags (42) [P]

**Physical (15):** `wood`, `metal`, `stone`, `cloth`, `glass`, `oil`,
`water`, `flammable`, `brittle`, `sharp`, `heavy`, `wet` (itemState),
`burning` (decay 10 min by 1), `broken` (itemState), `frozen`.
**Crafting and alchemy (11):** `herb`, `edible`, `poisonous`, `bitter` (sum),
`sweet` (sum), `healing` (sum), `venom` (sum), `hot` (sum), `cold` (sum),
`volatile` (sum), `rotten` (itemState).
**Social and mind (9):** `afraid`, `angry`, `drunk`, `hungry`, `greedy`,
`kind`, `proud`, `indebted`, `cursed` (itemState).
**Combat (3):** `braced`, `exposed`, `bleeding` (decay 5 min by 1).
**Place and weather (4):** `raining`, `cornered`, `dark`, `winter`.

Visibility: `venom`, `cursed`, `poisonous` are `learnable` (Perception or
Alchemy level, a book, or first exposure). `greedy`, `proud`, `kind` are
`hidden` until a relationship memory or a Perception check. Rest are `open`.

### 10.2 Rules (26) [P]

Layer `base`. Format: `id | trigger | when | then | chance`. Each rule also needs an `explain`.

**Physical (7)**
```
fire_spreads    | contact share_place | a burning; b flammable|wood|cloth; place !raining | b +burning:2 90m | 0.6
water_douses    | contact touch | a wet|water; b burning              | b -burning                      | 1.0
oil_feeds_fire  | contact touch | a burning; b oil                   | b +burning:3; a burning +1      | 0.9
wet_freezes     | tick          | a wet; place winter                | a -wet +frozen                  | 0.5
frozen_shatters | contact hit   | b frozen & brittle                 | b +broken                       | 1.0
glass_breaks    | contact drop  | a glass                            | a +broken                       | 0.8
burnout         | tick          | a burning & wood, at strength 0    | transform a -> Charcoal         | 1.0
```
**Social and mind (7)**
```
cornered_fear   | change        | a afraid; place cornered           | a -afraid +angry                | 1.0
hunger_anger    | tick          | a hungry>=3                        | a +angry (once per 60m)         | 0.5
drunk_gossip    | contact share_place | a drunk; extra knows(secret) | emit gossip(secret) to b present| 0.3
greed_cursed    | contact carry | a greedy; b cursed (a gains b)     | a -kind; memory a->b; veto drop | 1.0
debt_shame      | change        | a indebted & proud                 | a +ashamed; creditor rel -1     | 1.0
kind_feeds      | contact share_place | a kind; b hungry>=2; extra a holds food | transfer 1 food a->b; b->a +2 | 0.6
crime_wanted    | hook crime_seen | a actor; place lawful            | a +wanted:2 7d; witnesses -3    | 1.0
```
**Combat (4)**
```
sweep_exposes    | contact hit  | via sweep; b braced                | b -braced +exposed 10m          | 0.7
exposed_bleeds   | contact hit  | via sharp; b exposed               | b +bleeding:2                   | 0.5
bleeding_ticks   | tick         | a bleeding                         | vital a health -1 per 5m        | 1.0
fire_scares_beast| contact touch| a burning; b beast                 | b +afraid 30m                   | 0.8
```
**Crafting and alchemy (5)**
```
hot_cold_volatile| contact mix  | mix hot>=2 & cold>=2               | cancel min; mix +volatile       | 1.0
heal_venom_anti  | contact mix  | mix healing>=1 & venom>=1          | cancel min; mix +antidote       | 1.0
wet_herb_rots    | hook day_start | a herb & wet; place !cold        | move p of n to +rotten (9.3)    | 0.3
rotten_sickens   | contact use  | a edible & rotten; b alive         | condition b food_poisoning 20m  | 0.8
quench_brittle   | contact mix  | mix metal & hot>=3 & wet           | cancel hot; mix +brittle:1      | 0.3
```
**Place and weather (3)**
```
rain_wets        | arrival, tick| a cloth|flesh; place raining & !indoors | a +wet:1                    | 1.0
winter_chills    | tick         | a alive & wet; place winter        | a +cold:1                       | 1.0
cellar_keeps     | place layer, owner place:village.cellar | overrides wet_herb_rots | chance 0.03       | n/a
```

`cellar_keeps` is the first override: a place rule that replaces the chance
of a base rule inside the cellar. Two more base rules appear later:
`antidote_cures` (use, `via antidote`, `b venom`: reduce venom by the
antidote strength) and `volatile_pops` (use or hit on a `volatile` item).

## 11. Crafting systems on tags [P]

Common frame:
- Inputs have tags with strength (overlay or item state). A craft is a
  `contact:mix`. The engine builds a **mix**, a pseudo-entity holding the
  combined input tags, station tags, maker skill tags and place tags.
- **Combine.** Per tag, strength = mean weighted by count over all inputs;
  `potency` = size bracket of total count (1 to 2 small, 3 to 6 normal, 7+
  large). Mix rules (10.2) then react.
- **Name.** A recipe is a **signature**: tag ranges such as
  `healing>=3, bitter<=2, venom=0`. The best match wins. A named result
  uses the vanilla item ID when one exists, so there are no duplicates.
- **Residue.** No match makes a residue item (`Murky brew`, `Unfinished
  ingot`, `Odd dish`) with the top tags in `t` (Tier 2).
- **Fit** = 1 minus residual strength over total. **Quality** reuses the
  vanilla roll (V15): `roll_quality(stationTier - resultTier + fitTier)`,
  `fitTier` = -2 under 0.4, -1 to 0.6, 0 to 0.8, +1 to 0.95, +2 above. Each
  tier is +15 base quality (V15); skill and station count as in vanilla.
- **Discovery.** A new unnamed signature writes `knowledge sig.<hash>` at
  `seen` (V9). A third brew, or a book, makes it `interpreted`.
  `understood` fires `unlock recipe` (V9). A failed brew adds `progress` on
  `<craft>_insight`, so failure still teaches (north star).
- **Coexistence.** The one-click recipes (`alchemy_recipes`,
  `cooking_recipes`, `smelting_recipes`) keep their buttons. The tag route is
  a new "Experiment" panel beside them using the same stock through the
  overlay. A match with a vanilla signature returns the vanilla item.

### 11.1 Alchemy
- A Glass phial holds up to 4 kinds, 1 to 10 each. Cancel pass first: `hot`
  with `cold`, `bitter` with `sweet` only when both exceed 4. `healing` with
  `venom` is a reaction, not a cancel; `volatile` at 3 or more can pop on use.
- Vanilla check [I]: Healing potion is 8 Oneberry, 4 Silver thistle, 1 phial
  (`crafting_recipes.js:1895-1907`). With the overlay, `healing` mean =
  (8*3+4*5)/12 = 3.7 and `bitter` mean = 0.7, which fits
  `healing>=3, bitter<=2, venom=0`, so the experiment returns that potion.
- `venom` is `learnable`: a low-Alchemy drinker sees only "murky" until
  tested on an animal or after exposure.

### 11.2 Smithing and alloys
- A smelt mixes ingots in a crucible; the station supplies `hot`. Metal tags
  have sub-kinds `iron`, `steel`, `silver` and result tags like `springy`.
- **D1 Springsteel becomes one result.** Rule `iron_steel_spring` (hook
  `smelt`): `iron>=1 & steel>=1 & flammable>=1` adds `springy:2`. The named
  signature is "Springsteel ingot". The frozen profile (V16) is derived from
  result tags at registry build (`agility = springy`, `rigidity = -1`) with
  the same numbers (grade 1, agility 2, rigidity -1), so play does not change.
- An unnamed alloy keeps its tags in `t`. A tag-to-stat table maps `springy`
  to agility up and rigidity down, `heavy` to strength, `sharp` to attack,
  `brittle` to break chance (`deriveBraceStats` is the model, V16).
- Quench (`quench_brittle`) is a tradeoff: wet hardens and risks `brittle`;
  oil quench is a variant rule. Equipment inherits component tags: union, max
  strength, at most 4. Smelting 10 still gates the alloy (V16).

### 11.3 Cooking
- Station `hot` plus raw `edible` gives cooked food; `hot>=2` adds `warming`.
  `bitter` and `sweet` within 2 gives `palatable` (+1 fit tier); a large gap
  gives `unpleasant` (-1) and may shame a `proud` diner.
- Dishes inherit ingredient tags. `warming` in a `winter` place removes
  `cold` on a tick. Vanilla "Basic meal" effects (V20) are reached by an
  `active_effect` adapter effect that calls `add_active_effect`.
- Spoilage is `wet_herb_rots` style; a cellar or winter slows it by override.
  Vanilla Roasted rat meat and Bread stay one click.

### 11.4 Enchanting
- An enchant is a Tier 2 tag added by a rune item that carries a tag.
  **Slots** = material tier plus quality bracket (cloth 1, metal 2).
  **Affinity**: a `hot` rune on a `frozen` or `cold` item clashes and can set
  `volatile` and `broken`.
- **Curses** use the same path with `cursed`. Rule `cursed_bound` (hook
  `equip`): `veto` unequip while `cursed` and no `holy`. Removal is a quest,
  a rule or a cheat, not a flag. Breaking an enchanted item teaches its rune.

### 11.5 Farming
- A plot is a place entity with soil tags `fertile`, `dry`, `wet`; seeds
  carry `plant`. Daily rules: `wet & fertile & plant` adds `progress`; `dry`
  for 3 days sets `wilting`; `frozen` kills; manure raises `fertile`.
- Harvest quality is fit to the crop's signature. Produce is usually Tier 1;
  a wet harvest can start `wet` (Tier 2). Vanilla has sickle and shovel
  tool slots (`items.js:1174-1175`); this doc does not claim vanilla farming.

## 12. Skills, powers, worlds, and rules about rules

### 12.1 Skills apply tags [P]
A skill definition lists `applies` tags used as `via` (Cooking `hot`; a fire
skill `burning, hot`). Each use raises `hook:skill_used` and counts toward
`tagWorld.known[rule].uses`. Knowledge ladder (V9): `seen` (watched it fire),
`interpreted` (fired N times near you, or a book), `understood` (you may
**own** it, 12.3). A skill that fires one rule enough offers a breakpoint
branch "learn this rule", which grants a personal rule, not a number.

### 12.2 Powers and cheats as personal layers [P]
```js
{ id:'rule:personal.hearthbound', layer:'personal', owner:'cheat:hearthbound', scope:'owner_b',
  trigger:'contact', contact:'any', when:{ a:'burning', b:'alive' }, then:[],
  disables:['rule:base.fire_spreads'], explain:'The flames avoid #b#.' }
{ id:'rule:personal.fire_is_holy', layer:'personal', owner:'power:sunwreath', scope:'owner_a',
  trigger:'contact', contact:'hit', when:{ a:'burning' },
  then:[{ type:'tag', target:'$via', op:'add', tag:'holy', s:2, minutes:1 }],
  explain:'#a#\'s fire carries a holy edge.' }
```
Cheats may add E1 stream access as `then` entries on hooks such as
`hook:death`. Costs are effects or tags; a top-tier cheat may have none.
`lock` still limits what it can break.

### 12.3 Owning a rule: concept tiers [P]
Owning a rule gives a personal copy to use on purpose, edit and carry across
worlds. Tiers follow the north star table.

| Tier | Owning lets you | Scope |
|---|---|---|
| Skill | Nothing special; rules fire around you | none |
| Technique | A personal rule that fires through one named skill | `via` = that skill |
| Intent | The rule fires through any carrier (tool, glance, spell) | any `via` |
| Concept | Edit a rule in the place layer around you | place edit |
| Law | Edit a rule family (`tags:['fire']`) in a world slice | world edit |
| Origin | Add or remove base rules for a world | base, that world |

- **Seats** limit owned rules; they grow with realm, age or a cheat, and
  fusion frees seats. **Fusion**: two owned rules with compatible tags fuse
  through a `rule add` effect (fire + water gives scalding steam). Incompatible
  or opposed rules (`grow`, `decay`) set `strain` until a reconciling rule is owned.
- **Locks**: `lock` names the tier needed to change a rule (base fire rules
  `Concept`, a world's anchor rules `Origin`). Edits cost a resource, tag or
  sanity set by the tier; a cheat may remove it.
- Meta-rules are rules whose `then` has `rule` effects, tagged `meta`, so a
  world may disable them.

### 12.4 Worlds as rule layers: three contrasting physics [P]
A world card (E6) lists rules it adds, overrides and disables, plus tag
grants. Arrival runs `arrival` rules on the entity and everything carried.
```
A. Thin Village (low mana, the home world)
 rule:world.thin.mana_fades | tick    | a mana>=1                  | a -mana 1 per hour
 rule:world.thin.dormant    | arrival | a item enchanted with mana | a +dormant; its personal rules suspend
B. Sanctum (holy order)
 rule:world.sanctum.holy_burns | contact hit | via holy; b undead   | b -> ash; place +sacred
 rule:world.sanctum.bless      | tick        | a alive; place sacred | a +blessed:1
 rule:world.sanctum.fire_tamed | overrides base.fire_spreads; place sacred | chance 0.05
C. Cinder Sea (water feeds fire)
 rule:world.cinder.water_feeds | overrides base.water_douses | b burning +1 | chance 1
 rule:world.cinder.no_rot      | disables base.wet_herb_rots
 rule:world.cinder.void_calls  | tick | a void>=1 | nearby alive +afraid
```
Same engine and items, different physics; carried things keep their tags.
Barrier link: scale a neighbor world's rule `chance` by the barrier's leak
fact and "laws bleed" with no new code.

## 13. Three worked chains (illustrative; rolls are placeholders) [P]

### 13.1 The lamp (Village, physical, 5 hops)
```
chain 17  root: contact drop  a=Oil lamp(glass, oil, burning)  place=market  14:05
 hop 1 [base] glass_breaks    0.31<0.8 -> lamp +broken           "The lamp shattered."
 hop 2 [base] oil_feeds_fire  0.12<0.9 -> place +oil:2 +burning:3 "Oil ran across the boards and caught."
 hop 3 [base] fire_spreads    0.44<0.6 -> stall(wood) +burning:2  "The stall caught from the oil."
 hop 4 [base] burnout         stall at s=0 -> transform to Charcoal pile
 hop 5 [base] crime_wanted    witness Marta -> player +wanted:2 7d; Marta->player -3
 stop: no match. 5 of 8 hops, 5 of 64 firings.
```
`wanted` now feeds E2 cards with no extra code.

### 13.2 The murky brew (crafting, discovery, social; three chains)
Day 1. 2 Golmoon, 1 Silver thistle, 1 Rat fang in a phial. Mix means: healing
2.25, bitter 1.0, venom 0.75.
```
chain 31 hop 1 heal_venom_anti needs venom>=1; 0.75 fails -> no reaction
 name: no signature (nearest Weak healing powder, fit 0.58 -> tier -1)
 result {"id":"Murky brew","t":["healing:3","bitter:1"]}  knowledge sig.h3b1 seen
```
Second try: 1 Golmoon, 1 thistle, 2 fang. Means: healing 1.75, venom 1.5.
```
chain 32 hop 1 [base] heal_venom_anti -> cancel 1.5 -> mix +antidote:1.5
 result {"id":"Murky brew","t":["antidote:1"]}  knowledge sig.a1 seen
```
Day 3. A child with a bite (`venom:2`; the adapter shows `sick`).
```
chain 40 root: contact use via=Murky brew(antidote:1) b=person:village.tilda(venom:2)
 hop 1 [base] antidote_cures 0.52<0.7 -> venom 2 -> 1
 hop 2 [change] venom<2 -> adapter drops sick
 hop 3 [card hook] relationship tilda->player +3; sig.a1 interpreted (1 of 3)
```
A third success fires `unlock recipe Antidote` (V9). No one wrote an
antidote quest.

### 13.3 The borrowed flame (cross-world, layers in conflict)
The player owns `fire_is_holy` (12.2) and enters the Sanctum with a torch.
```
chain 9  root: contact hit a=player via=torch(burning) b=skeleton(undead)
 hop 1 [personal:player] fire_is_holy -> via +holy:2 1m
 hop 2 [world:sanctum]   holy_burns   -> skeleton -> ash; place +sacred
 hop 3 [world:sanctum]   bless        -> nearby blessed refresh
chain 10 same hit on b=thrall (owns personal ward_undead)
 hop 1 [personal:player] fire_is_holy -> via +holy:2
 candidates: [world] holy_burns; [personal:thrall] ward_undead disables it (owner_b)
 resolve: personal beats world -> holy_burns disabled, logged
 log: "The thrall's ward turned the holy fire aside."
```
This shows layer order and a personal disable beating a world rule.

## 14. Build slices and gates [P]

1. **Engine and 10 tags:** store, adapter, engine with index and cap, chain
   log, six rules, wired to `use_item` and one storylet cast. Gate: replay
   test plus a 3-hop chain in a fresh-origin session.
2. **Items:** overlay, Tier 2 keys, alchemy mix and naming. Gate: save,
   reload, import with a `t` item; an old save loads.
3. **Combat and places:** `contact:hit`, weather, the cellar override.
4. **Smithing, cooking, enchanting, farming**, one at a time.
5. **Layers and ownership:** world and personal rules, locks, seats.

Cross-system proof: a `volatile` brew pops in a fight, sets a stall `burning`
and opens a card. It needs slices 1 to 3.

## Open questions for Weibao

1. **Q1. Item state depth.** Recommended: Tier 1 first, Tier 2 with alchemy,
   Tier 3 for burning weapons. Any item state in the first slice, or only
   people and places?
2. **Q2. Hidden tags.** Hidden until a skill or book reveals them (more
   mystery), or a "?" from the start? It can differ by world.
3. **Q3. Chain length.** Eight hops by default. May chaos worlds or cheats
   lift it, and may the log skip hops to stay short?
4. **Q4. Rule ownership cost.** Must owning and editing a rule always cost
   something, or can a cheat make it free from the start?
5. **Q5. Vanilla recipes.** Keep one-click recipes forever beside the
   Experiment panel, or fade them as tag knowledge grows?

## Vocabulary additions

None rename or redefine an existing name.

- **Facts:** `actor.tag.<name>`, `actor.tag.<name>.strength`,
  `target.tag.<name>`, `item.<id>.any`, `itemtag.<tag>` (aliases for the
  `$<entity>.tag.<name>` form, which stays for effect selectors).
- **Tags:** `iron`, `steel`, `silver`, `springy`, `liquid`, `warming`,
  `palatable`, `unpleasant`, `antidote`, `wilting`, `fertile`, `dry`, `plant`,
  `dormant`, `strain`, `enchant`, `rune`, `sweep`, `raining`, `damp`, `winter`,
  `indoors`, `braced`, `exposed`, `bleeding`, `small`, `large`, `meta`, `poisoned`.
- **Tag fields:** `stacking`, `maxStrength`, `visible`
  (`open`/`hidden`/`learnable`), `learnedBy`, `decay`, `cancels`, `itemState`.
- **Rule fields:** `contact`, `when.via`, `group`, `cooldown`, `repeat`,
  `scope` (`all`/`owner_a`/`owner_b`/`owner_any`), `lock`, `explain`, `knownAs`.
- **Contact kinds:** `touch`, `hit`, `use`, `drop`, `share_place`, `carry`,
  `mix`, `any`. **Hooks:** `day_start`, `skill_used`, `equip`, `unequip`,
  `craft_done`, `death`, `crime_seen`, `cross_barrier`, `smelt`, `enchant`.
- **Effects:** `tag`, `transform`, `emit`, `veto`, `rule`, `active_effect`.
  **Selectors:** `$a`, `$b`, `$via`, `$place`, `item:<key>`,
  `slot:<actor>:<slot>`, `place:<id>`.
- **Store:** `state.tagWorld` (`deltas`, `slots`, `known`, `chains`,
  `deferred`); registry families `tags` and `rules`; rule IDs
  `rule:<layer>.<name>`; item key field `t` (sorted, max 3, `itemState` only).
- **Concepts:** item state Tiers 1 to 3, `mix`, `signature`, `fit`, `potency`,
  residue item, rule `seats`; knowledge keys `sig.<hash>`; progress track
  `<craft>_insight`.
