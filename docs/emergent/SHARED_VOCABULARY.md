# Emergent systems: shared vocabulary (proposal)

Claude, 2026-10-09. The one place where names used by every layer are
defined, so [E1 to E6](../EMERGENT_SYSTEMS.md) stay consistent. A layer file
may **add** names here (and must say so); it may not rename or redefine one.
Everything is a proposal. Principle: [anything is possible](../USER_VISION.md#anything-is-possible-2026-10-09):
where a design has several answers, each stays reachable and the world,
storyteller, cheat or player decides.

## Entities

Anything that can carry tags: `item`, `person`, `place`, `world`, `skill`,
`power`, `cheat`, `card` (storylet), `rule`, `stream`, `storyteller`,
`faction`, `weather`, `body`, `fact`, `legend`.

Every entity has a stable ID: `<kind>:<world>.<name>` for authored ones
(`person:village.oren`), `<kind>:spawn:<cause>:<key>` for generated ones
(matching the existing `spawn` effect).

## Tags

Format: `name` or `name:strength` (strength 1 to 9), with an optional expiry
in game minutes. Templates declare base tags; instances store only changes.
As facts: `<entity>.tag.<name>` (presence, boolean) and
`<entity>.tag.<name>.strength` (number), for example `actor.tag.burning`.
Facts carry no `$` prefix; `$actor`/`$target` are effect selectors only.
Vanilla items (`src/items.js:170-202`) and enemies (`src/enemies.js:237`)
already carry tags; the tag store extends those, it doesn't replace them.

| Family | Starting tags |
|---|---|
| Material | `wood`, `metal`, `stone`, `cloth`, `leather`, `glass`, `flesh`, `bone`, `herb`, `water`, `oil` |
| Property | `flammable`, `brittle`, `sharp`, `heavy`, `edible`, `poisonous`, `fragrant`, `conductive` |
| State | `wet`, `burning`, `frozen`, `rotten`, `broken`, `dirty`, `blessed`, `cursed`, `hidden` |
| Element / quality | `hot`, `cold`, `healing`, `venom`, `bitter`, `sweet`, `volatile`, `calming` |
| Mind (mood) | `afraid`, `angry`, `drunk`, `hungry`, `tired`, `grieving`, `in_love`, `ashamed`, `inspired` |
| Trait | `greedy`, `kind`, `brave`, `cowardly`, `proud`, `jealous`, `curious`, `lazy`, `pious`, `vengeful`, `honest`, `cunning` |
| Status / social | `indebted`, `wanted`, `famous`, `outcast`, `sick`, `injured`, `pregnant`, `apprentice`, `married` |
| Nature | `alive`, `undead`, `construct`, `spirit`, `beast`, `plant`, `human` |
| Energy (world-specific) | `mana`, `qi`, `holy`, `void` |
| Card | `daily`, `people`, `opportunity`, `threat`, `callback`, `rare`, `romance`, `money`, `crime`, `family` |
| Fate / luck | `lucky`, `unlucky`, `fated`, `fateless` |
| Place | `crowded`, `remote`, `cornered`, `dark`, `sacred`, `lawful`, `lawless` |

Relationship tags live on the relationship, not the person: `rival`,
`mentor`, `student`, `debtor`, `creditor`, `friend`, `lover`, `family`,
`grudge`.

## Streams (E1)

Root seed per life (new: source has no root seed today; see [E1](E1_SEEDED_STREAMS.md)). Named streams: `world.events`, `world.people`,
`encounter`, `loot`, `market`, `craft`, `discovery`, `interaction`,
`director`, `text`. Sub-streams: `people:<id>`, `encounter:<instanceId>`,
`deck:<deckId>`, `fate:<personId>`. Cosmetic randomness stays on
`Math.random` and never touches these.

## Facts

Dotted, lowercase, world-scoped when local: `village.harvest.poor`,
`person.oren.debt` (number), `world.tension` (number 0 to 100),
`history.<eventId>` (a resolved event worth calling back, with who, where,
when). Existing `meets()` rules (`eq`, `gte`, `lte`, `all`, `any`, `not`)
read all of them.

Source limits (verified 2026-10-09, `src/rules.js`): comparison ops are
only `eq`, `gte` and `lte`. There is no `neq`; use `not` over `eq`. An
absent fact is unknown, so `not` fails on it; give facts explicit defaults.
The `fact` effect only sets a value; there is no `add`. Both are small
engine additions if the layers need them.

## Rule shape (E4)

```js
{ id, layer: 'base'|'world'|'place'|'personal', owner,          // owner for world/place/personal
  trigger: 'contact'|'tick'|'arrival'|'change'|'hook:<name>',
  when: { a: <tag pattern>, b: <tag pattern>, place: <tag>, extra: <meets rule> },
  then: [<effects>], chance: 0..1, stream: 'interaction',
  priority, overrides: [<ruleId>], disables: [<ruleId>] }
```

## Card shape (E2)

```js
{ id, deck, tags: [...], needs: <meets rule>, cast: { role: {...} },
  weight: { base, plus: [...] }, cooldown: { self, cast }, once,
  urgency: 'ambient'|'soft'|'hard'|'crisis', timeout,
  text, choices: [{ label, requires, costs, effects, tags }],
  onIgnore: [...], sets: [<fact names it can write>] }
```

## Storyteller instance (E5)

```js
{ id, scope: 'world'|'place'|'person', owner, personality,
  tags: [...], tension, comfort, multipliers: { <cardTag>: number } }
```

## Person (E3)

```js
{ id, traits: [<trait tags>], needs: { money, safety, belonging, status, purpose, ...world },
  goal: { id, target, since }, memories: [...], lod: 'here'|'near'|'far' }
```

## Layer additions

Each layer file ends with a "Vocabulary additions" section. Those names are
part of this vocabulary. None renames anything above.

| Layer | Adds |
|---|---|
| [E1 streams](E1_SEEDED_STREAMS.md#vocabulary-additions) | Streams `gather`, `reward`, `legacy.action`, `legacy.outcome`; stream key forms `@worldId` and `|key`; roll API (`rollChance`, `rollTable`, `rollInt`); cheat access modes; facts `world.attention`, `fate.debt`, `history.loop` |
| [E2 storylets](E2_STORYLETS.md#vocabulary-additions) | Card fields `stage`, `world`, `hint`, `blocks`, `fallback`, `travels`, `createdBy`, `receipt`; deck record; standing-order shape; `cast.<role>.*` facts; `calendar.season` |
| [E3 people](E3_LIVING_PEOPLE.md#vocabulary-additions) | Need `rest`; relationship axes `affection`, `debt`; tag `follower`; cruelty presets and dials; goal and verb IDs; person fields `beliefs`, `habits`, `pinned`, `ledger`, `drift` |
| [E4 tags and rules](E4_TAGS_AND_RULES.md#vocabulary-additions) | Fact alias `actor.tag.<name>`; about 28 tags; tag and rule fields; contact kinds; hooks; effect types; selectors; item key field `t`; registry families `tags`, `rules` |
| [E5 storyteller](E5_STORYTELLER_AND_FATE.md#vocabulary-additions) | Card tags, instance fields, personalities `Adaptive`, `Tidal`, `Pure Chance`, fate fields, facts |
| [E6 lore](E6_LORE_LAYER.md#vocabulary-additions) | Entity kinds `gossip`, `grammar`, `pack`; fact weight and visibility; `history.*`, `canon.*`; tags; guard modes; canon dials |
| [E7 observation](E7_OBSERVATION_AND_MYSTERY.md#vocabulary-additions) | Tags `chaotic`, `fickle`, `sealed`, `disguised`, `unknowable`, `familiar`, `haunted`; field `mystery` (K1 to K6); senses; knowledge states; deck `village.oddity` |
| [E8 power aspects](E8_POWER_ASPECTS.md#vocabulary-additions) | Field `idea`; ten aspect axes; tags `foresight`, `danger_sense`, `shard`, `immortal`; `facet:<law>.<name>`; `shardset:<id>` |
| [E8B power catalog](E8B_POWER_CATALOG.md#vocabulary-additions) | Fields `source`, `delivery`; entity kind `vow` (`limit`, `amplify`, `penalty`); `family:<name>` |
| [E8C power paths](E8C_POWER_PATHS_AND_ANIME.md#vocabulary-additions) | Entity kind `path` (`currency`, `steps`, `gate`, `risk`, `shape`, `branching`, `grader`, `ceiling`); tags `domain`, `barrier`, `licensed`, `graded`; currencies |
| [E8D vow system](E8D_VOW_SYSTEM.md#vocabulary-additions) | Vow slots (`restriction`, `benefit`, `consequence`, `witness`, `stake`, `interpretation` and more); vow states; tags `vow_scar`, `oathkeeper`; hooks `eat`, `attack`, `speak`, `enter` |
| [E8E powers in a life](E8E_POWERS_IN_A_LIFE.md#vocabulary-additions) | Fields `awakening`, `known_axes`, `tests`; tags `power_hidden`, `power_public`, `licensed`, `unlicensed`, `powerless`, `phantom_power`; card family `awakening`; `power_policy` |
| [E9 world laws](E9_WORLD_LAWS.md#vocabulary-additions) | Entity kinds `law` (strength, tier, enforcement, discovery) and `world_will`; `profile.<audience>`; law meeting modes |
