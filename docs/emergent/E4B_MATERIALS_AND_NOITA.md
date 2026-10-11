# Materials, states and lessons from Noita (proposal)

Claude, 2026-10-09, for Weibao's Q7: "we can expand on the ideas accordingly?
More stuff as well? Learning from noita?" Extends
[E4 tags and rules](E4_TAGS_AND_RULES.md), which owns the tag store, rule
schema and the three item-state tiers. Names follow the
[shared vocabulary](SHARED_VOCABULARY.md). Everything is a proposal.

**Source of Noita facts:** Claude's knowledge of the released game, not a
fresh read. Noita is not installed in this Mac's Steam library (checked
2026-10-09). Its data ships in `data/data.wak`; the materials file
(`materials.xml`) holds material properties and reaction rules and would be
the first thing to read if Weibao installs it. Treat specific Noita details
below as reference to verify, not as citations.

## What Noita does that matters here

| Code | Noita system | Why it works |
|---|---|---|
| N1 | **Materials table.** Every material has properties: liquid, powder, gas or solid, density, flammability, how it burns, conductivity, what it does on contact or when drunk. | A few dozen properties describe hundreds of materials. Nothing is special-cased. |
| N2 | **Reaction table.** Rules like "material A touching material B becomes C and D, with chance P." Water on lava makes steam and rock. Acid eats almost everything. | Reactions are between materials, never between named objects. This is E4's rule shape exactly. |
| N3 | **Stains.** Standing in a liquid coats you: wet, oiled, bloody, slimy, toxic, drunk, polymorph. Stains time out or wash off. Wet blocks fire; oil feeds it. | Status effects come from the world, not from enemy attack scripts. You can wash, dodge or exploit them. |
| N4 | **Ingestion.** Drinking any liquid applies its effect. Some are useful, some lethal, some bizarre. | Every material is also a consumable. Curiosity is a mechanic. |
| N5 | **Containers.** Flasks and pouches hold a material. You drink, pour or throw them, and the contents act on what they hit. | Materials become portable tools and weapons. |
| N6 | **Seeded secret recipes.** A couple of special potions have recipes that change with each run's seed. | The world has secrets that are real but not the same every time. Knowledge has value per run. |
| N7 | **Wand building.** Spells are cards in a wand. Modifiers change the next spell, triggers carry a payload, multicasts fire several at once. Wand stats (cast delay, recharge, capacity, mana) shape everything. | Small composable parts make huge numbers of builds, many of them broken in fun ways. |
| N8 | **Perks that bend physics.** Some perks turn one material into another across the world for a while, make you immune to a damage type, or make your blood a different material. | Personal rules and world-rule rewrites, exactly E4's personal and world layers. |
| N9 | **Polymorph.** You or enemies become another creature, with its body and abilities. | Swapping the template is a valid outcome, not a special case. |
| N10 | **Same rules for everyone.** Enemies burn, drown, stain and fight each other by the same physics. You can die to your own creation. | Fairness and surprise both come from rules being public and universal. |
| N11 | **Layered secrets.** Hidden areas, glyph puzzles, cryptic tablets, things the community found years later. | Discovery is the long-term progression. |

## What we take, and what we don't

We are a text idle RPG, not a pixel physics game. We take Noita's **data
model** (properties plus reactions plus stains plus containers) and its
**composition model** (wands), not its per-pixel simulation. Our "space" is
coarse: a person, an item, a container, a place, a world.

## Materials as data

A material is a tag bundle with a phase and contact effects:

```js
{ id: 'material:oil', phase: 'liquid',
  tags: ['oil:3', 'flammable:4'],
  stain: { tag: 'oiled', minutes: 240 },          // N3
  drink: [{ type: 'condition', key: 'nauseous', minutes: 60 }], // N4
  value: 2 }
{ id: 'material:healing_water', phase: 'liquid',
  tags: ['water:2', 'healing:3'],
  stain: { tag: 'wet', minutes: 60 },
  drink: [{ type: 'vital', key: 'health', amount: 30 }] }
{ id: 'material:slag', phase: 'solid', tags: ['stone:2', 'metal:1', 'hot:2'] }
```

Village starter set (about 20): water, mud, oil, blood, ale, milk, honey,
vinegar, lye, healing water, venom, smoke, ash, embers, salt, sand, iron
filings, slag, tallow, sap.

## Reactions as E4 rules

Material reactions are ordinary E4 rules with `trigger: 'contact'` and
material tags on both sides:

| Reaction | Result |
|---|---|
| `water` + `burning` | Fire goes out; `steam` puff; target becomes `wet` |
| `oil` + `burning` | Fire spreads at strength +2 |
| `lye` + `tallow` | Soap (crafting result found by accident) |
| `salt` + `rotten` | Rot stops; food keeps for a season |
| `vinegar` + `metal` | `rusted` over time |
| `venom` + `healing` (balanced) | Antidote |
| `ale` + `person` (drunk) | `drunk`; `honest` up, `cunning` down for a while |
| `honey` + `beast` nearby | Beasts drawn to you |
| `blood` + `sacred` place | A `cursed` or `blessed` outcome depending on the world layer |
| `embers` + `cloth` | `burning` with chance |

## Stains and states on bodies (first slice)

Proposal: bodies and places get states first, because the engine already has
`conditions` with expiry and ticks. States:
- **Stains:** `wet`, `oiled`, `muddy`, `bloody`, `sooty`, `sticky`, `drunk`.
- **Temperature:** `cold`, `hot`, `frozen`, `burning`.
- **Body:** `nauseous`, `poisoned`, `numb`, `strengthened`.
- **Social stains** (new, our twist): `smelly` lowers opinion gain; `bloody`
  frightens `cowardly` people and alerts guards; `fragrant` raises
  `in_love` chance. Stains feed E3, not just combat.

Washing is a verb: a river, a bath, rain, a spell. Rain applies `wet` to
everyone outdoors, which matters for the next fire card.

## Item states (expanded)

Building on E4's three tiers (template tags; durable state in the item key;
timed state on equipped items):

| Family | States | Example |
|---|---|---|
| Coating | `oiled`, `poisoned:charges`, `blessed:charges` | Dip a blade in venom: next 3 hits apply `poisoned` |
| Wear | `sharp`, `dull`, `rusted`, `cracked`, `broken` | Rust from vinegar or rain; a whetstone undoes `dull` |
| Age | `fresh`, `aged`, `rotten`, `vintage` | Ale and cheese improve with time; bread rots; salt stops rot |
| Temperature | `hot`, `cold`, `frozen` | A hot blade quenched in oil or water gives different results |
| Charge | `charged:n` | `conductive` items hold lightning from a storm card |
| History | `bloodied`, `heirloom`, `famous`, `named` | A sword that kills 100 beasts gains `bloodied`; E6 can give it a name and a legend |
| Spirit | `awakened`, `haunted`, `cursed` | Long use or a death nearby can wake an item; it then has opinions (E3) |
| Contents | `holds:<material>:<amount>` | A flask of oil, a pouch of salt, a barrel of ale |

Items that **evolve with use** fit the north star's skill evolution: a tool
used 1,000 times on one tag (`wood`) gains a tag of its own (`woodsworn`),
and a smith can read it.

## Containers (N5)

A container item holds one material and an amount. Verbs:
- **Drink** applies the material's `drink` effects.
- **Pour** on a person, item or place applies its stain and contact rules.
- **Throw** in combat applies contact rules to the target; glass `breaks`.
- **Mix** two containers runs reactions; the result fills the container, or
  it bursts if the result is `volatile`.

This gives alchemy a physical form: you don't click "craft potion," you mix,
heat, wait and see.

## Seeded secret recipes (N6)

Each world (or each life, a setting) draws a few **secret recipes** from the
`discovery` stream at creation: "this world's philosopher's tincture is
honey + blood + salt." The recipe is real and fixed for that world or life,
and different elsewhere. Ways to find it: experiment, a rare card, a dying
alchemist, a divination cheat, or a past life that remembered it (E1 and the
soul layer). A world's secrets become part of what you carry between lives.

## Composition like wand building (N7)

The idea worth taking beyond materials: **techniques built from parts**.
- **Slots:** a technique, tool or wand-like focus has slots and stats
  (capacity, recharge, cost, delay).
- **Parts:** verbs (strike, throw, pour, ignite, mend) and modifiers
  (twice, wider, delayed, hidden, carried by the next hit).
- **Triggers:** "when this lands, do the next part." This is how one
  sequence becomes a combo.
- **Building is play.** Players find parts through study, cards and loot,
  and break the game by combining them. The north star wants busted
  synergies; this is a clean source.

Example: a farmer's "Rain Dance" technique: `pour water` → `wider` →
`trigger: ignite` gives a steam cloud that blinds everything in a place.
Nobody wrote "steam cloud blinds"; `steam` + `alive` → `blinded` is a rule.

## Physics-bending powers (N8)

Map directly to E4 layers:
- **Personal rules:** "your blood is oil," "you are immune to `burning`,"
  "your stains last 10 times longer."
- **World-rule rewrites:** a power or event that turns one material into
  another across a whole place or world for a while ("every well runs with
  ale for a day"). The storyteller can use this as a world event; a cheat
  can own it.
- **Concept tiers:** understanding `water` deeply lets you write a personal
  `water` rule; mastering it lets you rewrite a place's `water` rules.

## Polymorph (N9)

Transformations swap the body template: a curse turns you into a beast for a
season; a potion makes you a cat for an hour; a world turns arrivals into its
native form. The person (memories, relationships, soul) stays; the body's
tags, needs and verbs change. This also gives a home to the north star's
nonhuman bodies.

## Same rules for everyone (N10)

Enemies and NPCs get stained, drink things, carry flasks and use techniques
by the same rules. A bandit may throw oil and a torch. Two beast herds fight
when their tags say so. You can burn your own house. Every outcome logs its
chain (E4) so a disaster explains itself.

## Secrets (N11)

Hidden tags, unknown reactions and seeded recipes form the discovery
layer. Knowledge of rules is progression: a "known reactions" list in the
Notebook, filled by seeing them fire, reading books or being taught. Ties to
[knowledge and discovery](../LIFE_SIM_NORTH_STAR.md#knowledge-and-discovery-weibaos-direction-2026-10-07).

## Risks

- **Too much state.** Cap timed states per entity; far-tier entities carry
  none.
- **Stack splitting.** Durable item states split stacks (E4 Tier 2). Keep
  them few and meaningful.
- **Unreadable chaos.** Every reaction logs; hover shows states; known
  reactions are listed.
- **Not Noita.** We don't simulate space, so "fire spreads" means between
  items, people and places in one location, per tick, with a cap.

## Smallest proof

Village: 10 materials, 12 reactions, 6 body stains, flasks, and one
technique with two parts. Test: in one session, rain makes a person `wet`,
a thrown oil flask and a torch fail on them but burn a dry cart, and the log
explains both.

## Weibao's answers: recipes, substitutes and drinking (2026-10-09)

Weibao's words:
- Q11: "both possible depending on lore and how books does it, also consider
  for crafting recipes, for replacement items in worlds, so like items with
  the same tags and characteristics to be usable as replacement materials, of
  course needing to research/find out the characteristics and more, maybe we
  can have a tag for the power and quality and more accordingly?"
- Q12: "why not? It can also be beneficial or a bunch of things depending on
  what it actually is and more"
- Q13: "yes, feel free to decompile accordingly once its done installing, and
  send out codex stuff to do accordingly" (see [Noita source pass](#noita-source-pass))

### Where recipes come from (Q11)

All of these stay reachable; a world's lore picks its defaults.

| Mode | How it works | Fits |
|---|---|---|
| Canon | Fixed recipes from the source or world card | Book worlds, original worlds with set lore |
| World secret | Drawn once per world from `discovery` | Noita style; the world has real hidden recipes |
| Life secret | Rerolled per life | Roguelike lives; knowledge carried by the soul has value |
| Owned | Sects, guilds, families hold recipes and guard them | Cultivation novels: pill recipes as heritage, auction prizes, theft targets |
| Lost | Known only from legends (E6); must be rebuilt | Ruins, ancient masters, past lives |
| Regional | Same result, different local recipe | Every village brews its own ale |
| Personal | A recipe you discovered; you name it, can teach or sell it | Player and NPC innovation |

### Substitute materials: recipes ask for profiles, not items

A recipe slot names what it **needs**, and any material that fits can fill
it. The authored ingredient is just the best-known fit.

```js
{ recipe: 'recipe:village.torch',
  slots: [
    { role: 'handle', needs: { wood: '>=2' }, known: 'item:branch' },
    { role: 'fuel',   needs: { flammable: '>=3', sticky: '>=1' }, known: 'material:tallow' },
    { role: 'wrap',   needs: { cloth: '>=1' }, known: 'item:rag' } ] }
```

- **Fit score.** How well a substitute matches each need sets quality.
  Overshooting a need can help (a hotter fuel burns brighter) or hurt
  (too `volatile` and the torch flares).
- **Extra tags carry over.** Use venom-soaked rags and the torch smoke is
  `poisonous`. This is where surprising items come from.
- **Vanilla recipes stay as they are.** Their exact ingredients remain the
  canonical fill; profiles add other ways in. E4's adapter reads vanilla
  item tags (`src/items.js:170-202`).
- **Travel.** In a new world your known recipes still work if you can find
  local materials with the right profile. A world without iron may have a
  bark that is `hard:3` but not `conductive`, so it makes a fine blade and a
  useless lightning rod. Rebuilding your kit from local stuff becomes a
  reason to explore.

### You only substitute what you understand

A material's tags start hidden or partly known (E4 Q2). You can only put a
substitute in a slot if you know the tags that slot checks. Ways to learn:

| Route | Reveals |
|---|---|
| Look, touch, smell (cheap, skill-based) | Surface tags: `wood`, `wet`, `fragrant` |
| A small taste or sip | One inner tag, at small risk (see Q12) |
| Experiment (craft, mix, heat) | Tags that react; a failed craft still teaches |
| Research project | All tags of one material, over time |
| Books, teachers, NPC gossip | What others know, maybe wrong |
| Appraisal skill or cheat | Exact tags, strengths, grade |
| Past lives | What the soul remembers |

### Power, quality and more as tags (Q11)

Proposal: each material and item carries a few **axes** besides its tags.

| Axis | Meaning | Example |
|---|---|---|
| Strength (per tag) | How strongly it has that property | `healing:3` |
| Quality | How good this piece is (0 to 100) | A bruised herb vs a perfect one |
| Purity | How much is the useful part | Refined ore, distilled spirit |
| Potency | Overall power, decays with age for some | Fresh herb vs dried |
| Grade | Tier on the world's power scale | `grade:common` to `grade:legendary`, or a cultivation world's own tiers |
| Origin | World and place it came from | Matters for lore guards and world physics |

**Grade crosses worlds by conversion**, like powers do in the north star's
[how powers meet a new world](../LIFE_SIM_NORTH_STAR.md#how-powers-meet-a-new-world-proposal-2026-10-08).
A high-grade substitute in a low-grade recipe can upgrade the result, break
the tool or do both. That gives "busted" crafting a natural path: rare
outside materials in humble recipes.

### Drinking unknown things (Q12)

Anything can happen, and the outcome depends on what it actually is, your
body, the dose and what else is in you.

| Outcome | Example |
|---|---|
| Lethal | A strong venom with no resistance |
| Harmful | Nausea, blindness, a lost day |
| Useful | Healing, strength, night sight for a while |
| Lasting gain | A permanent small stat, a resistance, an awakened sense |
| Transformation | Polymorph for an hour or a season (N9) |
| Mutation or constitution | A new body tag; maybe the start of a special physique |
| Vision | A lore reveal, a legend, a glimpse of another world |
| Addiction | A need (E3) that grows |
| Nothing | Most mud is just mud |

**What changes the outcome:** body tags (an `Iron Marrow` constitution
shrugs off poison), dose (a sip is a hint, a flask is the full effect),
mixtures in your body (two potions react inside you), and the world layer.
How lethal unknown liquids are is a world and storyteller setting, so a
first world can be gentle while a cursed swamp is not.

## Noita source pass

Noita was bought and sent to Steam on 2026-10-09, but Steam on macOS installed
no game files (`0 mounted depots`; Noita is Windows-only). Claude mapped app
881100 to the CrossOver `notproton` tool (config backed up at
`~/Documents/Backups/steam-config.vdf.2026-10-09-noita.bak`), restarted
Steam and requested validation. The Codex lane
[docs/gm/dispatch/noita-2026-10-09/](../gm/dispatch/noita-2026-10-09/ASSIGNMENT.md)
waits for files, reads the game data and writes `docs/research/noita/`.
Its findings get folded back here.

## Noita pass results (2026-10-09)

The Codex pass read the installed data: 468 materials, 330 reactions, 422
spells, 106 perks. [Report](../research/noita/REPORT.md). Corrections to the
from-memory notes above:
- **Oil:** an `oiled` body is **protected** from fire in Noita; loose oil
  burns. The "oil feeds fire" line above applies to spilled oil, not a coated
  body. Model coating, loose material and ingestion as separate routes.
- **Reactions** mix exact-ID rules and tag-family rules; 32 need a third
  input, and some need age, direction or area. E4 needs higher-arity rules.
- **Secret recipes** are not generated in the shipped scripts; the seeded
  recipes are engine-side, known only from community reconstruction.
- **Flasks** hold mixtures, not one material; save amounts per constituent.
- **No universal power or quality scale** exists in Noita; keep magnitude,
  purity, amount, condition and grade as separate axes (matches Q11 above).
- **Spells** run as a small interpreter with groups and prepaid nested
  payloads, a better model for technique composition than "modifier adds to
  next part."
Its ten ranked proposals (P1 to P10) and 26 small touches are proposals for
E4 and E4B, not selected work.

## Open questions for Weibao

Q11 to Q13 are answered above.

- **Q14, answered 2026-10-09:** "both possible, risky crafting can teach
  you." Default: a partly understood substitute can be tried. A world,
  workshop, teacher or recipe owner may forbid untested substitutes (a strict
  guild, a sacred forge).

### Unknown properties are real (Weibao's correction, 2026-10-09)

> I mean the risk isnt with how many properties dont know, it is how the
> unknown protieries interact with things, like if it has a kill everyone in
> a 9999999 mile property if mixed with this niche something else, thats
> exactly what happens

There is **no risk roll for ignorance**. Every material has its true tags
from the start, known or not, and every rule fires on true tags. Knowledge
changes only what you can predict, never what happens.

- **The danger is in the interaction.** A harmless-looking moss with a
  hidden `void:9` does nothing in most recipes. Mixed with the one niche
  material that reacts to `void`, it does exactly what that rule says, at
  full scale, even if that is "everything within a vast radius dies."
- **Extreme reactions are allowed,** reasonably: they come from rare tags,
  rare combinations and real lore (a forbidden alchemy, a world-ending
  relic), not from common Village herbs. Rarity is the gate, not a
  hidden safety net.
- **No fudging, by default.** The storyteller (E5) paces cards; in most
  worlds it doesn't veto or soften the outcome of a rule the player triggered. E5's fairness rules
  apply to what the world throws at you, not to what you cause.
  Exceptions come from lore: a merciful heaven, a fated person's plot
  armor (E5), a world that protects its chosen.
- **Failure teaches through the log.** Afterward, the chain log shows which
  tags met which rule, and those become known. Survivors learn; others learn
  from the legend (E6), and the reaction may become a forbidden recipe.
- **Hints exist for the careful.** Research, appraisal, a teacher, an old
  legend or a small-scale test (a pinch, not a flask) can reveal a
  dangerous tag before the big mix. Scale matters: a pinch-sized reaction is
  a warning, a cauldron-sized one is the event.
- **Same for everyone.** An NPC alchemist can cause the same catastrophe,
  which becomes a world event and a legend.
