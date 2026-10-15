# GL: gear, loot and rewards audit (Minecraft corpus)

Lane GL, 2026-10-14. Targets: Silent Gear, Tetra, Tinkers' Construct, Apotheosis,
Modular Golems, Treasure2, Lootr, Bountiful, Gateways to Eternity.
Reference reading only. No code or assets reused, nothing launched or installed.
Claim labels: **shown** = read in shipped data or string tables, **stated** = author
text inside the jar (lang files, in-game books), **inferred** = my reading, not
confirmed by code. Full tables with IDs are in the gitignored
`docs/research/minecraft/private/audits/gl/` (see the file list at the end).

Method: first pass was data plus class constant-pool strings (no Java runtime).
A second pass read the decompiled sources under
`docs/research/minecraft/private/decomp/<target>/src/` (Bountiful is Kotlin `.kt`).
Entries GL51 to GL58 below are code-confirmed and carry class and method anchors;
where they correct a first-pass entry the old entry is marked superseded. Still
unread: Silent Gear grading maths, Tinkers modifier effects, Apotheosis affix
selection beyond weights, the Treasure2 wishing-well price.

## Headline findings

- **GL1 (shown). Four mods compose gear in four different ways, and the pattern
  that fits YAIRPG best is Tetra's integrity budget.** Silent Gear: parts made of
  materials, stats summed per material then trait levels stack up to a cap.
  Tinkers: parts give stats, then a fixed count of typed modifier slots gates
  growth. Tetra: modules in named slots, each with an integrity cost or gain, and
  you may not build past the budget. Apotheosis: no composition, a rarity roll
  fills a rule list.
- **GL2 (shown). Apotheosis rarity is a rule list, not a number.** Each of five
  rarities lists what it grants (two stat affixes, a chance at an effect, a socket
  range, a durability bonus, an ability). Rarity odds come from a world tier, and
  the tier is unlocked by wearing gear of the previous rarity plus one boss or
  invader kill. Gear rarity and world difficulty are one dial.
- **GL3 (shown). Salvage and reforge close a rarity-material loop.** Breaking an
  affixed item yields 1 to 4 of its own rarity's material. Reforging spends that
  material plus levels plus a sigil, and offers three rerolls. Gem cutting upgrades
  purity using gem dust plus several rarity materials at once. Nothing in the
  loop pays out more than one rarity at a time, so higher tiers cost real
  multiples of lower ones.
- **GL4 (shown). Treasure2 keys are an access model with three layers.** Lock
  rarity, key category (metal, gems, elemental), and master keys that open a whole
  category or a rarity band. Lock picks are probabilistic with published odds.
  Throwing a locked chest into a wishing well strips every lock for a price. This
  answers N41: access can change without changing who holds the object.
- **GL5 (shown/stated). Lootr instancing is a per-player inventory generated on
  first open, with an optional team scope, refresh timers and decay timers, all
  off by default.** This answers N18 at the config level. See the caveat in GL19.
- **GL6 (shown). Bountiful offers are drawn from a decree (a profession) that
  names objective pools and reward pools. Every entry has a numeric worth.**
  Rarity is tied to reputation. Timers and reward count are config. How worth
  balances objective against reward is code I could not read (inferred only).
- **GL7 (shown). Gateways separates per-wave rewards from a final completion
  reward, and defines failure as a list of consequences.** Waves can be fixed or
  endless with periodic escalation rules. This answers N17 except the payout on
  abort, which is code.
- **GL8 (shown). Modular Golems stat blocks are material times body-part
  weights, with upgrades in a limited slot budget and some upgrades that waive the
  slot cost.** Humanoid golems carry real equipment that wears. Retrieval turns
  the golem back into an item that keeps its upgrades.

## 1. Part-based tools (N-gear questions)

### Silent Gear (141 materials, 79 trait files, 47 part types, 15 weapon attribute files)

- **GL9 (shown). Part-slot model.** A tool is a set of part types: a main part
  (blade, head, plate, limb) chosen by gear type, plus rod, binding, tip, grip,
  coating, lining, setting and similar. Each part type is a data file naming its
  gear type and a flat property block (a sword blade adds fixed attack damage and
  attack speed). Crafting uses a blueprint (reusable) or template (single use);
  the crafting station lets you mix materials, a plain table needs one material.
  (stated, jei text)
- **GL10 (shown). Material stat table.** Each material has a main block (durability,
  attack damage, harvest speed, harvest tier, enchantment value, armor by slot,
  armor durability, magic armor and damage, ranged accuracy, draw speed, rarity
  score) plus separate property blocks for use as rod or tip. Iron: durability 250,
  attack 2, speed 6, iron tier, enchant value 14, rarity 20. Crimson steel:
  durability 2400, attack 6, speed 15. Materials carry category tags
  (metal, gem, rock, organic, wood, cloth, intangible) and a grade tier
  (basic, intermediate, advanced, endgame). Ranges: durability 32 (gold) to 2500.
- **GL11 (shown). Trait model.** A material grants traits at a level, per part
  role (main, rod, tip). A trait has a maximum level (5 for the ones I read), and
  its effect is a table indexed by level. The level table lets one trait scale
  from nothing to strong (Mighty gives Haste 1,1,1,2,3 and Strength 0,0,1,1,2 across
  levels 1 to 5 on tools). Most common traits: Malleable 62 materials, Flexible 32,
  Brittle 19, Soft 18, Lustrous 12. Many traits are condition-gated by gear type.
- **GL12 (shown). Damage-state traits.** A family of traits changes stats as the
  item wears: Sharp and Jagged and Eroded gain output as durability falls, Soft and
  Crushing lose it, Accelerate gains speed, Organic loses magic damage, Renew heals
  slowly. The advancement text says stats are recalculated when an item crosses a
  damage threshold. This is growth-by-wear: use changes the tool without a level.
- **GL13 (shown/stated; corrected by GL51). Synergy.** Synergistic adds 4 percent
  per level to a synergy multiplier that applies when the base value is above 100
  percent; Crude reduces it, Rustic raises it when it is at or below 100 percent.
  The first-pass guess that synergy rewards matching families across the whole
  tool was wrong: it is computed only for compound (mixed) materials. See GL51.
- **GL14 (shown). Grading and repair.** Materials can be graded E up to SSS and MAX
  in a material grader using tiered catalyst dust (three tiers); star-charged
  materials get a large boost from a starlight charger; a configuration flag
  controls whether parts can be graded at all. Repair uses kits filled with
  materials and a per-part repair efficiency. Broken gear stays as a broken item
  unless a "red card" upgrade lets it truly break. Salvager returns parts (87
  salvage recipes). Upgrade parts (tip upgrades, magnetic, spoon, road maker) add
  fixed amounts or multipliers.

### Tinkers' Construct (263 material files, 222 modifiers, 46 tool definitions)

- **GL15 (shown). Tool definitions are modules.** Each tool lists its parts in
  order (pickaxe: head, handle, binding), default materials, base attack stats,
  a slot budget, built-in traits, effective block tag and area-of-effect shape.
  Slot budgets by tool: most melee and tools 1 ability and 3 upgrades; broad
  tools (axe, hammer, excavator, scythe) 1 ability and 2 upgrades; armor 3 defense
  and 2 upgrades (plate) or 2 defense and 2 upgrades (traveler); staves 2 to 3
  abilities. Part counts run from 2 (shuriken) to 4.
- **GL16 (shown). Material stat blocks are per part category, not per material.**
  A material defines a head block (durability, attack, mining speed, mining tier), a
  handle block (multipliers: durability 0.1, damage 0), a limb block, plating per
  armor slot, and so on. Only materials that can fill a role have that block, so
  stone is a good head and a useless limb. Tier numbers 0 to 4 gate availability.
  Iron head: 250 durability, 2.0 attack, 6.0 speed. Queen's slime head: 1650
  durability. Manyullyn: 1250, 3.5 attack. (Handle blocks are percent multipliers on
  the head sum; the blend is now confirmed in code, see GL52.)
- **GL17 (shown). Material traits are default plus per-stat.** Each material has a
  default trait list and a per-part-category override list: iron gives Magnetic by
  default, Projectile Protection on armor plating, Plague on skulls. This lets a
  single material have a distinct identity per role.
- **GL18 (shown). Growth is slots, not levels.** 135 modifier recipes cost one
  upgrade slot, 116 one ability slot, 22 one defense slot, 2 cost two ability
  slots. Incremental modifiers fill over repeated item inputs: sharpness needs 36
  quartz-equivalent units per level, up to level 5, with a block counting 4.
  Level caps cluster at 3 and 5. Modifier salvage recipes (130) refund the slot
  when you remove one. No native XP leveling appears in data (inferred; a tool
  does not grow from use in this build).

### Tetra (modules, integrity, honing)

- **GL19 (shown). Slots and modules.** Item families (sword, single-head,
  double-head, bow, crossbow, shield, toolbelt, holo) define named slots (sword
  blade, guard, pommel, binding, perk sockets). A module variant lists accepted
  material families, base attributes, tool actions, durability and an "extract"
  block that governs how it contributes. A sword blade costs 1 integrity.
- **GL20 (shown/stated). Integrity is the build budget.** Materials define
  integrity gain and cost, magic capacity, durability, primary/secondary/tertiary
  stat scalars, tool level and efficiency. Iron: durability 250, integrity cost 2,
  gain 5, magic capacity 84, iron tier, efficiency 6. The workbench blocks any craft
  that exceeds integrity. This is a conservation law that forces trade-offs.
- **GL21 (shown/stated). Honing and settling are growth by use.** Honing progress
  accrues as the item is used; when it fills, one major module can be honed for a
  small stat gain, five levels per stat (swing speed, damage, durability, efficiency,
  tier steps), at a workbench. Honing adds integrity use. Settling slowly converts a
  module's integrity cost down or gain up through use, with a durability penalty
  stated. Gilding (gold nuggets plus experience, five scroll levels) raises magic
  capacity. Exceeding magic capacity makes repair cost experience and risks
  destabilization of magical improvements.
- **GL22 (shown). Synergies** are listed pairs of modules/improvements that unlock a
  tool action or named variant (two specific modules make a javelin; two
  improvements together add a shovel action). Data count is small (a few per
  family). 90 double, 78 sword, 69 single, 53 shield schematics.

## 2. Apotheosis (affix, gem, socket, reforging, salvage)

- **GL23 (shown). Rarity rules.** Five rarities, sorted common 300 to mythic 700. Rules
  per rarity: common 1 stat (+25% chance of a second); uncommon 2 stats, 50% basic
  effect, 0 to 1 socket; rare 2 stats, effect (+35% second), 0 to 2 sockets,
  durability bonus 10 to 25%; epic 3 stats, effect, one ability, 1 to 3 sockets,
  durability 25 to 55%; mythic 4 stats, 2 effects, ability, sockets 4 at 5% or 1 to 3,
  durability 45 to 75% or unbreakable at 1%. Affix pool: 99 affixes (44 stat,
  37 effect, 18 ability), grouped by category (melee, armor, boots, breaker, ranged,
  shield, shears, generic) with exclusion sets so vampiric and overheal cannot
  coexist.
- **GL24 (shown). Affix strength is a range keyed by rarity.** An affix file gives
  min and max per rarity (overheal common 0.05 to 0.10 up to mythic 0.15 to 0.25);
  absent rarities mean the affix cannot roll there (executing exists only at epic
  and mythic). Each carries a weight and a "quality" bonus that scales with luck
  (confirmed in code, GL55).
- **GL25 (shown). World tier gating.** Haven, frontier, ascent, summit, pinnacle.
  Each tier has its own weight table for rarity (haven: 600 common, 360 uncommon,
  40 rare; pinnacle: 650 epic, 250 mythic, 100 rare), gem purity (haven mostly
  cracked and chipped; later tiers unlock flawless and perfect), and loot entries.
  Advancement chain: haven by owning any affixed item; frontier by wearing five
  common-or-better pieces; ascent by five uncommon pieces plus killing an invader;
  summit by five rare pieces plus killing the Wither; pinnacle by five epic pieces
  plus killing the Ender Dragon. Tier augments also buff monsters and players
  (summit: +12 armor, +15 armor pierce, +10 toughness on monsters; +75% xp, +50%
  luck for players), so higher tiers pay in scale and cost in enemy scale.
- **GL26 (shown). Gems and sockets.** 21 gems in four dimension groups (core 13,
  overworld 3, nether 3, end 2). Every gem has several bonuses, each tied to a gem
  class (light weapon, core armor, tools, shield, bow, boots). Value per purity:
  cracked 1, chipped 2, flawed 3.5, normal 5, flawless 7, perfect 10 for a damage
  bonus. Per-class design means one gem fits any gear and the gear class decides
  what it does. Six purity levels. Dimension gems carry a minimum purity (flawed)
  and a "unique" flag.
- **GL27 (shown). Cost ladder.** Reforging: levels 2 / 5 / 15 / 30 / 50, materials
  1 / 2 / 2 / 2 / 3, sigils 0 / 1 / 2 / 4 / 5 from common to mythic; only the full
  table handles epic and up (stated: second and third offered options cost double
  and triple). Augmenting (end-game): upgrade an affix 25% for 2 sigils and 225
  levels, reroll for 1 sigil and 175 levels (stated). Salvage: affixed items return
  1 to 4 of their rarity material; gems return gem dust (1 to 2 cracked up to
  5 to 10 perfect). Gem cutting up a purity: flawless costs 9 dust plus 27 rare
  shards, 9 epic sands and 3 mythic pearls; cracked costs 1 dust plus 3 scrap and
  1 fabric. The sum shows a deliberate sink: each step costs several times the
  last and mixes tiers.
- **GL28 (shown). Source of affixed items.** Elites and invaders (named,
  rarity-colored mobs with a guaranteed drop), a 12% chance on ordinary monsters
  (not spawner mobs), 49 item-specific loot entries with per-tier weights,
  wandering trader sales (stated), rogue spawners.

## 3. Constructed companions: Modular Golems

- **GL29 (shown). Golem types and part filters.** Three bodies (humanoid, dog,
  metal). Each body part splits stat shares: dog body 100% attack, 70% health;
  dog legs 100% movement; metal arm 50% attack; humanoid body 100% head, 50%
  health. Magnifiers per body scale material stats (humanoid 0.3 attack, 0.4
  health).
- **GL30 (shown). Material stats and built-in upgrades.** Iron: attack 15, health
  100. Netherite: attack 30, health 300, knockback resist 1, sweep 2, weight -0.4,
  grants fire immunity. Sculk: attack 30, health 500, speed 0.5, sonic boom.
  Gold: low attack but 4 regen and light weight. Cardboard (Create): attack 2,
  health 2, weight 0.4. Mod-pack materials extend this to dozens of materials
  (guide has about 60 entries).
- **GL31 (shown/stated). Upgrades and slots.** Upgrades are crafted and applied in an
  anvil, each modifier with its own max level, and a golem has a limited number of
  slots. Some upgrades waive slot cost: apostle upgrades, hostility core, cauldron
  for repeated potion upgrades, talented (first of each kind, up to 4), and two
  diamond/netherite slot adders that work once per golem. Grindstone removes all
  upgrades. About 100 distinct upgrades from reforming bodies to boss skills.
- **GL32 (stated; wear confirmed by GL58). Durability and care.** Metal golems heal when you apply their
  body ingot. Reformation consumes iron for absorption. Humanoid golems equip armor
  and weapons by right click, use those items, and area attacks only with a
  sword-type item (stated). Retrieval returns an item holder; a "recycle" upgrade
  drops a zero-health holder on death so a dead golem becomes a repair task. Config
  cards define targets, patrol, modes. Equipped items do wear down (shown in code, GL58).

## 4. Keyed treasure and per-player loot

### Treasure2 (N41)

- **GL33 (shown). Rarity tables.** Terranean weights: common 100, uncommon 70,
  scarce 40, rare 20, epic 10, legendary 4, mythical 2, and special skull/bone/cauldron
  chests; aquatic set omits common, uncommon and cauldron. Order sets give the ladder
  (common 10 to mythical 70; skull/gold skull/crystal skull). Each rarity has a chest
  loot table of pooled rolls (common: 2 treasure rolls, 3 to 5 item rolls, 1 to 2
  combat, 1 to 3 food, 1 to 2 tools, 0 to 1 potion; legendary: 1 treasure, 2 to 6
  epic items, plus multiple rare pools). Skull chests give keys and coins.
- **GL34 (stated). Locks and keys.** 14 lock types in categories elemental, metal,
  gems, mob, wither. Chests hold 1 to 4 locks and 9 to 52 inventory slots depending on type. Each lock names accepted keys. Special keys: skeleton opens
  common to rare except wither; metallurgist's opens metal; jewelled gems;
  lightning elemental; the One Key opens all. Ember key burns wood and leaf locks;
  ember lock destroys any key but ember and lightning. Lock picks: pilferer's
  48% / 24% on common / uncommon; thief's 60% / 45% / 30% on common to scarce.
  Keys can break (flag per key) and fail separately (chat strings show "key broke",
  "key failed", "doesn't fit"). Sneak-use applies a key. A key ring holds keys.
- **GL35 (stated). Cost to remove locks.** A chest thrown into a wishing well loses
  every lock "for a price" (the price is code). Wishing wells pay by coin or gem
  rarity. Clover blocks convert nearby stone-family blocks into wells.
  Mimic and bound-soul mobs guard chests.

### Lootr (N18)

- **GL36 (shown/stated). Scope.** Per-player inventory per container by default;
  setting switches to one inventory per team, with a resolver id that can be set
  when multiple resolvers exist. A fresh seed is generated per player (default
  true) so two players do not see identical contents. Containers covered: chests,
  trapped chests, barrels, shulker boxes, minecarts, decorated pots, copper chests,
  suspicious sand and gravel, item frames in structures, and a trophy.
- **GL37 (stated). Timers and decay.** Refresh (container re-rolls after a delay)
  and decay (container disappears after a delay) both default to 5 minutes when
  enabled, and both are off by default. Options: tick versus on-open checking,
  start counting after another player opened it, apply to all containers or only
  listed loot tables, mods, dimensions. Break modes: default (sneak required),
  never, always; blast resistance modes; an option to drop the breaker's own loot
  and mark the container opened. Statistics and advancements count looting (1, 10,
  25, 50, 100 loots and one per container type) with a data pack to disable them.
  Save mode controls when per-player data files are written.
  Caveat: instancing scales storage per player and assumes many players. For one
  actor the only live idea is "unopened versus opened for this actor" and optional
  timed re-roll.

## 5. Bounty boards and wave trials

### Bountiful (N15)

- **GL38 (shown). Data pipeline.** A decree (12 shipped: armorer, butcher, cleric,
  farmer, fisherman, fletcher, inventor, leatherer, librarian, mapper, shepherd,
  toolsmith) lists objective pools and reward pools; some pools are shared
  (`_all`, `_metal`, `_equip`, `_gardening`). Pool entries have a type (item,
  item tag, entity, criteria; xp types exist in code), an amount range, a unit
  worth, a weight multiplier, optional time multiplier (zombie hunts have 6.0),
  optional rarity, and "forbids" lists to stop a reward duplicating an
  objective. Counts: 134 objective and 159 reward entries; unit worth 15 to
  24000 for objectives and 60 to 48000 for rewards.
- **GL39 (shown; superseded by GL53). Rarity.** Five tiers (common to legendary).
  Reputation shifts which tier gets generated. Worth balancing is now confirmed:
  rewards are picked first and objectives are sized to match (GL53).
- **GL40 (shown). Config.** Board generation and update frequency, flat bonus time
  per bounty, maximum rewards, objective modifier, whether bounties expire, a
  completion toast, data-pack exclusions. Achievement strings give the shape of
  play: rush orders (under a minute), procrastinator (under 5 seconds left),
  per-rarity completion stats.
- **GL41 (shown). What is absent.** No issuer stock, funds or conservation: a
  bounty pays from nothing. The scout note that funding and stock conservation are
  "our proposed requirements" is confirmed. It fits item-cost paid in emeralds
  as worth, but there is no fail state beyond expiry.

### Gateways to Eternity (N17)

- **GL42 (shown). Structure.** A gateway has a size, color, a list of waves, final
  rewards, and failure consequences. Each wave sets maximum duration and setup
  time, entities (standard spawn with counts), stat modifiers (attribute add
  or multiply), and rewards for that wave. Example: Emerald Grove, 4 waves,
  5 zombies with +25% health first, up to 7 mob wave with life steal and armor
  pierce later. Gateway pearls are the key item; recipes encode which gateway.
  Top-level `rewards` are the completion reward; wave rewards pay on clearing.
- **GL43 (shown). Reward kinds.** Stack, stack list, experience, gear set, loot
  table, entity loot (rolls of a mob's own table: 10 to 75 rolls). Reward grows
  with wave: blaze gateway pays 75 blaze loot rolls at wave 3 and 500 XP at the end.
- **GL44 (shown). Failure.** Each normal gateway lists failure effects: explosion
  (strength 4 with fire and block damage), summoning extra mobs (2 blazes, 2 witches),
  blindness 400 ticks. Overworldian Nights has a rule allowing the pearl to be
  discarded.
- **GL45 (shown). Endless mode.** A base wave plus modifiers triggered after every
  N waves with a maximum count (iron automaton: extra golem every 3 waves up to
  10 times, +10% health and damage every 5 waves up to 6 times, speed every 10
  waves up to 3 times). Spawn algorithm inward spiral; boss event bar.
- **Settlement and abort:** now confirmed in code, see GL54.

## Code-confirmed addendum (second pass, decompiled sources)

- **GL51 (shown). Silent Gear synergy is for compound materials only.**
  `util/SynergyUtils.getSynergy` runs when a compound material mixes sub-materials;
  `gear/material/CompoundMaterial` (around line 176) applies it to each stat
  modifier, and only for properties flagged as synergy-affected. One material gives
  1.0. With x unique sub-materials the base is about 1.1 * x / (x + 1.1) + 0.476,
  so two different materials start near 1.19. Minus 0.2 if no category is shared by
  all, plus 0.015 scaled per repeated category, minus 0.001 per rarity-score gap to
  the primary, then trait effects adjust it (Synergistic adds per level inside a
  range), then it is clamped to 0.1 to 2.0. A modifier moves by its own size times
  (synergy - 1). Design use: alloys reward similar families and punish mismatches.
- **GL52 (shown). Silent Gear and Tinkers stat blends.**
  Silent Gear `api/property/NumberProperty.compute`: start at the base value, add a
  weighted average of "average" modifiers (a modifier's weight is 1 + value /
  (1 + |first value|), so stronger parts pull harder), then take any "max"
  modifiers, then add percent-of-base modifiers, then multiply by total-percent
  modifiers, then add flat modifiers, then clamp. Traits (`TraitListProperty`):
  levels from all sources are summed per trait then clamped from 1 to the trait's
  max level. Tinkers: each part adds its stats through
  `tools/stats/HeadMaterialStats.apply` (durability, attack, mining speed added,
  scaled by a per-part scale that defaults to 1.0; tier takes the part's tier) and
  `HandleMaterialStats.apply` (percent boosts to durability, damage, speed, mining
  speed). `FloatToolStat.build` finishes as (base + added) * (1 + summed percent)
  * product of multipliers. So Tinkers heads sum (a two-head tool adds both), while
  handles scale the result.
- **GL53 (shown). Bountiful generator** (`content/BountyCreator.kt`, `create`,
  `genRewardEntries`, `genObjectives`, `pickObjective`; `bounty/BountyRarity.kt`).
  Order is rewards first. Pick 1 to maxNumRewards distinct reward entries from the
  decree's reward pools, skipping any whose required reputation exceeds yours, with
  weight = entry weight multiplier * rarity weight. Rarity weights 1024, 512, 256,
  128, 6 (common to legendary), and each tier below your reputation tier is divided
  by 2.25 per step. Reputation tiers start at -30, 5, 15, 25, 30; reputation is
  clamped to -30..30. Bounty rarity is the highest reward rarity. Objective worth
  needed = total reward worth * (1 + objectiveModifier percent) * (1 - rep / 75), so
  high reputation shaves up to 40 percent off. That is split randomly into 1 or 2
  objectives, each picked from entries within 25 percent of its worth share, else
  the nearest by worth; objectives exclude anything the rewards forbid or already
  contain. If an objective covers under half its share, the remainder is queued as
  another. Time to complete = 15000 ticks + for each objective (time multiplier *
  worth * 7) + config flat bonus. So a bounty is a priced swap, and difficulty is
  tuned by worth, not by hand.
- **GL54 (shown). Gateways settlement** (`entity/GatewayEntity.tick`,
  `NormalGatewayEntity.completeWave/completeGateway`, `onFailure`, `playerDied`).
  A wave starts after its setup time, ends when no wave mobs remain, then its
  rewards are queued (not dropped at once) and drip out 3+ stacks every 4 ticks;
  the queue is saved with the entity. Gateway completion rewards drop immediately at
  the final wave. Failure reasons: wave timer elapsed, no nearby player for 200
  ticks, a wave mob too far or discarded or left the dimension, spawn failed, out
  of lives (lives rule, a death within leash range plus 25 costs one; -1 means
  unlimited). On failure: lightning, message, remaining mobs vanish or become
  despawnable per rule, the failure list runs, the gateway is removed. The queued
  but undropped wave rewards are not paid (no code path drops them); stacks already
  dropped stay. Rules record: spawn range, leash range 32, allow discarding,
  allow dimension change, player damage only, remove on failure, fail on out of
  bounds, nearby player required, lives. Answer to N17: partial progress is paid
  per cleared wave, but the pay for the wave in progress and any queue backlog is
  lost on failure; completion pay is separate and all-or-nothing.
- **GL55 (shown). Apotheosis quality.** `tiers/TieredWeights.Weight.getWeight`:
  effective weight = weight + round(luck * quality), quality limited to -16..16 and
  weight to 0..65536. Luck is the player's luck attribute (Lootr also passes player
  luck when filling). So quality is a per-entry luck slope, which is why rare
  entries carry larger quality values than common ones.
- **GL56 (shown). Lootr store** (`data/LootrInventoryStore`). One store per
  container holds a map from resolved owner (player or team id) to an inventory,
  plus visual and actual opener sets and decay and refresh timestamps (game time +
  the configured delay). `createInventory` refuses if the container cannot be
  opened by that player, builds an empty inventory, fills it, stores it under the
  resolved team or player id. Fake players get an empty inventory. `performRefresh`
  clears every inventory and the opener sets, so everyone can loot again.
- **GL57 (shown). Lootr fill** (`api/filler/DefaultLootFiller.unpackLootTable`).
  Fills from the container's own loot table with the opener as the loot entity,
  the opener's luck, and a seed from `LootrAPI.getLootSeed` (randomised per player
  by default per the config). A container that was a reference inventory copies
  that fixed list instead. Unresolved tables report an error to the player.
- **GL58 (shown). Golem wear** (`content/entity/humanoid/HumanoidGolemEntity`,
  `common/AbstractGolemEntity`). Each successful melee hit costs the main-hand item 1
  durability; a sweeping or ranged attack with a sword-type item costs 1 per use.
  Shield: no cost under 3 damage, otherwise 1 + floor(damage), adjustable by an
  event; a broken shield is removed. Armor: damage taken divided by 4 (at least 1)
  applied to each worn armor piece, subject to a per-source check. So N42 is
  confirmed: humanoid golems consume real equipment durability.

## Donor questions

- **N15 (Bountiful).** Answered, code-confirmed (GL53). Offers are generated from
  profession decrees plus reputation-tuned rarity, with numeric worth per item.
  They are not tied to stock or funds. Proposed YAIRPG use needs its own issuer
  conservation, which the donor does not supply (GL38 to GL41).
- **N17 (Gateways).** Yes: stakes are disclosed in the pearl's recipe and
  gateway definition; waves pay separately from completion; failure is a defined
  list of consequences. Settlement is confirmed in code (GL54): wave pay queues and drops
  per wave, completion pay drops at the end, failure loses the undropped queue.
- **N18 (Lootr).** Scope is per container per player or per team, generated on
  first open with a fresh seed, with optional refresh and decay timers (GL36, GL37).
  For a single actor the useful idea is actor-keyed opened state, not the
  multiplayer storage.
- **N41 (Treasure2).** Access is decoupled from custody by lock category,
  key category and rarity bands, with master keys and probabilistic picks (GL34).
  The object stays where it is; only the access test changes. The wishing-well
  lock strip is a priced access reset.
- **N42 (Modular Golems).** Material and part weights give distinct roles
  (dog = fast attacker, metal = tank, humanoid = equipment bearer); slots gate
  upgrades; some upgrades waive slot cost; recycle turns a death into a repair
  chore (GL29 to GL32). Humanoid weapon, shield and armor durability use is confirmed (GL58).

## System patterns across targets

- **GL46. Budgeted composition.** Integrity (Tetra), slot counts (Tinkers, Golems),
  trait caps (Silent Gear, 5), socket counts (Apotheosis). Every system caps
  growth with a small typed budget rather than a global level.
- **GL47. Growth without XP.** Wear-triggered traits (Silent Gear), honing meter
  (Tetra), item-fed incremental modifiers (Tinkers), purity cutting and augmenting
  (Apotheosis). All turn a resource sink into a visible tool delta.
- **GL48. Rarity ladders with multi-tier materials.** Apotheosis and Treasure2
  both use ordered rarity sets with paired weight tables per context (world tier,
  terranean versus aquatic). Locks mirror this with key bands.
- **GL49. Recoverable commitments.** Salvage refund (Silent Gear, Tinkers modifier
  salvage, Apotheosis), grindstone upgrade strip (Golems), wishing-well lock strip
  (Treasure2), holder retrieval. The unwind always costs something but never
  destroys the item.
- **GL50. Context-keyed tables.** One definition with per-context values:
  per-stat traits (Tinkers), per-gear-class gem bonuses (Apotheosis), per-body
  part shares (Golems). This is the cheapest way to avoid duplicated authored rows.

## YAIRPG fit (proposals, none authorized)

Existing owners in `src/` I found by grep: `items.js` (4.6k lines; Weapon and
WeaponComponent, Armor and ArmorComponent classes already follow a
component-and-quality model), `crafting_recipes.js`, `alloy_equipment.js` (an
authored-material-profile proposal with grade, agility, rigidity, no new save
field), `structured_equipment_runtime.js` and `native_equipment_transaction.js`
(equipment slots and transactions), `rewards.js` (rewards objects, location
clear counts), `artifact_workshop_*` and `artifact_collection.js` (item-gated
encounters), `field_workshop.js`, `absorb_e2/durability.js`. Related design:
`docs/MEANS_AND_APPRAISAL.md`, `docs/PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md`,
`docs/MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md`.

- **GLF1. Integrity budget on components.** A component-bearing item gets one
  scalar budget (provides versus costs) so adding parts has a real trade-off.
  Natural receiver: `alloy_equipment.js` style authored material profile plus the
  component classes in `items.js`. Smallest slice: one weapon family.
- **GLF2. Per-role material blocks.** Materials carry separate stat blocks by role
  (head, handle, plating) and a default plus per-role trait list (Tinkers,
  GL16, GL17). Fits authored material profiles without a new save field.
- **GLF3. Wear-keyed traits as growth.** Express "this tool changes with use" as
  trait effects keyed to damage state (Silent Gear GL12) plus a honing meter
  (Tetra GL21). No XP currency needed.
- **GLF4. Rarity as a rule list per world tier.** Rarity defined by what it
  grants, tier chosen by earlier achievements (GL23, GL25). World-specific
  adjectives, not fixed tier names, per the per-world limits direction.
- **GLF5. Salvage and reforge loop.** Rarity material from salvage, cost multiple
  of the lower tier for each step up (GL27). Reuses existing durability and
  crafting owners.
- **GLF6. Key bands.** Locks and keys with category, rarity band and master keys
  (GL34) as an origin-qualified access model for N41; `acquisition.js` and the
  item key conventions in `gameplay_transactions.js` would hold the object while
  the access test changes.
- **GLF7. Trial with split settlement.** Per-wave pay, completion pay, and
  defined failure consequences (GL42 to GL44). `rewards.js` already has clear
  counts; settlement idempotence should be designed in, since the donor leaves it
  as code.
- **GLF8. Constructed companion as a part-share sheet.** Body slots with
  attack, health, movement and mass shares multiplied by material (GL29, GL30),
  upgrades inside a slot budget with waivers (GL31). Fits the companions topic
  audit in `docs/COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md`.
- **GLF9. Bounty offers from need.** Take Bountiful's pool and worth shape but add
  issuer stock and funds (GL41), as the scout note already proposes.
- Do not copy: Lootr multi-player instancing storage and decay of containers;
  they assume many players. Keep the "opened by this actor" idea only.

## Per-target coverage

| Target | Read | Coverage |
|---|---|---|
| Silent Gear | materials (141, tabulated), parts, traits (descriptions + samples), lang, salvage/gear recipe lists | data fully, code not; patchouli guide entries absent from jar |
| Tetra | modules, materials (metal, sample), schematics, improvements, synergies, lang | data partly (structures, loot, item effects not read); honing math is code |
| Tinkers' Construct | tool definitions (all 46), materials (all 263 listed), modifiers (JSON stubs), modifier recipes (all), lang not read | data fully for stats/slots; modifier effects are code; smeltery and book not read |
| Apotheosis | rarities, purity weights, 99 affixes (catalogued), 21 gems, tier augments, loot entries, reforge/salvage/cutting/infusion, progression, book entries | data fully; spawner, enchanting, potion systems out of scope; selection maths code |
| Modular Golems | materials (all), part filters, upgrade descriptions, book entries (golem/materials), advancements named | data mostly; upgrade recipes not tabulated; durability wear confirmed in code (GL58) |
| Treasure2 | rarity weights/orders, chest tables, lock/key book, wells, mobs book | data mostly; worldgen, structures not read |
| Lootr | config string tables, tags, advancements, loot table list | config fully, store and filler code read (GL56, GL57) |
| Bountiful | decrees, pools (census), lang, config names | data fully; Kotlin generator read (GL53) |
| Gateways | all 9 gateway files, recipes, census of types | data fully; wave runner code read (GL54) |

## Gaps

- Formerly unread formulas are now confirmed (GL51 to GL58). Still unread:
  Silent Gear grader maths, Tinkers modifier effect code, Apotheosis affix
  selection and reforging roll code, Treasure2 well price and pick logic.
- Silent Gear and Tetra guide books are missing from the jars or not in data;
  stated text came from lang files.
- Treasure2 and Tetra world loot (ruins, forged ruins) not audited.
- Remaining inferred rows: GL12 threshold recalculation (stated by advancement
  text only) and GL21 honing maths (Tetra source not read).

## Private deep tables

`docs/research/minecraft/private/audits/gl/` (gitignored): `silentgear_materials.tsv`,
`tinkers_tools.txt`, `tinkers_modifier_recipes.txt`, `apotheosis_tables.txt`,
`treasure2_tables.txt`, `lootr_config.txt`, `bountiful_gateways_census.txt`,
`gateways_waves.txt`, `golem_materials.txt`. Unpacked jars (no class files) are in
`docs/research/minecraft/private/extract/<target>/`.
