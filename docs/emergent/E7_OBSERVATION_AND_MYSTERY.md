# E7. Observation, mystery and the lore behind things (proposal)

Claude, 2026-10-09. Weibao: "However we can have mysterious things or ideas
that work in randomness? More to consider? Lore behind objects? Little stuff
to consider, like using the 'observe' skill or something on a random thing
and then accordingly we would need to give that thing lore and more? How to
show details like these and more?"

Builds on [E4B: unknown properties are real](E4B_MATERIALS_AND_NOITA.md#unknown-properties-are-real-weibaos-correction-2026-10-09),
[E6 lore layer](E6_LORE_LAYER.md), [E1 streams](E1_SEEDED_STREAMS.md) and the
north star's [hover details](../LIFE_SIM_NORTH_STAR.md#hover-details-and-text-as-a-medium-proposal-2026-10-08)
and [hidden things in text](../LIFE_SIM_NORTH_STAR.md#how-to-represent-powers-and-hidden-things-in-text-proposal-2026-10-08).
Everything is a proposal under [everything is possible, reasonably](../USER_VISION.md#anything-is-possible-2026-10-09).

## What exists (verified 2026-10-09)

- Vanilla has a **Perception** stat used in skill and stat formulas
  (`src/data/skills.js`, many entries), and the skills **Presence sensing**,
  **Night vision**, **Herbalism** and **Alchemy**.
- Items have a `description` and an open `tags` map (`src/items.js:168-202`);
  the hover tooltip is built by `create_item_tooltip` (`src/display.js:326`).
- One real observe action exists: watching an enemy's footwork writes to the
  Technique notebook (`src/main.js:3216`).
- An adventure Notebook exists (`src/adventure_notebook.js`).

## Six kinds of unknown

The truthful-world rule (hidden properties are real and act whether known or
not) is the usual case. A world can break it as lore: belief that shapes
reality, a heaven that edits outcomes, a dream world where looking changes
things. Mystery comes from **what kind of unknown** a thing is. All six are
allowed; lore picks which applies.

| Code | Kind | What is true | Example |
|---|---|---|---|
| K1 | **Hidden but fixed** (default) | Properties exist from creation; you just don't know them | The moss with `void:9` |
| K2 | **Random by nature** | The property *is* a distribution; each use draws from the `interaction` stream | A wild-magic coin; a fickle spirit; a die-shaped relic; a well whose water changes daily |
| K3 | **Undetermined until observed** | No state until someone looks; the first observation draws it and fixes it forever | A sealed box, an unopened letter, an egg, an unread prophecy |
| K4 | **Deceptive** | Shows false tags; true tags still act | A mimic chest; a cursed ring that reads `blessed`; an illusion |
| K5 | **Observer-dependent** | Shows differently to different senses, people or worlds | A holy relic that looks like junk to the faithless; a word only native speakers read |
| K6 | **Beyond understanding** | Tags above your concept tier; reading them may cost something | Eldritch script that redacts itself and drains sanity |

K2 keeps randomness honest: the wild coin isn't secretly fixed, its truth is
"random every time." K3 is lore-gated and explicit, so it doesn't undo the
truthful rule for ordinary things. K4 to K6 make observation a skill contest
rather than a lookup.

**Random oddities.** The deck (E2) can scatter small oddities: a stone with
scratches, a crow that follows you, a door that wasn't there. Most are K1
texture; a few are K2 or K3 and hook into rare cards.

## Lore behind objects: depth on demand

Any notable thing can carry a history. Three sources:

1. **Lived history.** Recorded as it happens: who made it, who owned it,
   what it did (`bloodied` after 100 kills), where it went. An item ledger,
   capped and compacted like the life record.
2. **Generated backstory** for things that existed before you arrived. Built
   from E6 world tables, legends and the world's history facts, seeded by
   `hash(worldSeed, entityId, 'lore')` so it is the same whenever it is
   generated.
3. **Canon** from a world card or a private book pack.

**Depth on demand.** A thing's lore is generated only as deep as someone
looks, in layers:

| Layer | Example for an old knife found in the Village |
|---|---|
| Name and glance | "A worn kitchen knife." |
| Description | "The handle is newer than the blade." |
| Provenance | "Maker's mark of a smith who died twelve years ago." |
| History | "It cut the rope the night the mill burned." |
| Secret | "The blade was forged from a meteor; it is `void:2`." |

**Generated lore makes real facts.** If the knife's backstory names a dead
smith, that smith becomes a history fact (E6), so a later card can call back
("the smith's daughter asks where you found her father's knife"). Generated
backstory agrees with existing facts and adds to them in most worlds; worlds
with unreliable or rewritable history can retcon.

**Not just items.** Places (a grave, a well, a scratched stone), people (a
scar, an accent, a habit), creatures (a wolf with a collar), weather (a red
rain), and words (a place name's origin).

**Fixed means fixed.** A K1 thing's lore depends only on its seed and facts
that existed when it was created, not on when you look (unless that world's
lore says otherwise). Only K3 things
fix at first observation, and they say so.

## Observe as a family of verbs and skills

| Sense | Reveals | Grows from |
|---|---|---|
| Look | Material, wear, marks, `hidden` things | Perception |
| Touch | Temperature, texture, `sharp`, weight | Perception, crafting skills |
| Smell | `rotten`, `poisonous`, `fragrant`, fire nearby | Cooking, Herbalism |
| Taste (a pinch) | One inner tag, at the real risk of that tag | Cooking, Alchemy |
| Listen | People's moods, hollow walls, approaching danger | Presence sensing |
| Energy sight | `mana`, `qi`, `holy`, `void`, curses | World powers |
| Psychometry | An object's history layers | Rare power or cheat |
| Appraise | Exact tags, strengths, grade, value | Trade, a cheat |
| Study (days) | Everything below your concept tier | Research projects |

Rules:
- **Observation takes time and attention.** A glance is free; a careful
  look costs minutes; study costs days.
- **Skill sets depth and accuracy.** Low skill can give a confident wrong
  read. When the truth comes out, the Notebook shows the correction beside
  the old note "in a different hand."
- **Observing people** reveals traits, mood, lies and sometimes goals (E3).
  Staring is noticed: some people take offense, guards get suspicious.
- **Observing has consequences.** Eldritch things look back (K6). Reading a
  curse can pass it on. Psychometry can make you relive the knife's worst
  memory.
- **Observe evolves.** Used enough, Observe can grow toward Appraise,
  Insight and, at high concept tiers, seeing the rules themselves (the E4
  concept ladder). Watching footwork (`main.js:3216`) is the first rung that
  already exists.
- **NPCs observe too.** A merchant appraises your goods; a rival studies
  your fighting; a thief notices your purse.

## Showing details

Extend the original UI, not new windows.

**Hover tooltip** (`create_item_tooltip`), layered:
1. First line: name, a glance phrase, one or two keywords.
2. Hold or click for the ledger: known tags with strength, a "you sense
   more" mark only if you've noticed something hidden, rumored tags in
   italics with their source, disproved ones struck through.
3. A link to the thing's Notebook entry.

**Notebook entries** for anything examined: a codex like a bestiary, for
materials, reactions, objects, places and people. Each entry shows layers
learned, who told you what, confidence, and the history timeline.

**Display follows the world** (north star dial): a system world shows
numbers (`healing 3`), a Dao world shows prose ("it hums with gentle life"),
a horror world shows less and lies more.

**Uncertainty words:** unknown, glimpsed, believed, confirmed. Confidence
shows as wording ("seems," "certainly"), not color alone.

**Mystery formats:**
- K2 items show their range: "changes every use; you've seen fire, frost
  and nothing."
- K3 items say what is not yet decided: "sealed; nobody knows."
- K4 shows the false read until disproved, then both.
- K6 shows redacted bars that clear as your concept tier rises.

**Discovery feedback:** the log says what you learned ("The moss is
`void:9`."), and the Notebook marks it new. A substitute comparison view
shows a recipe slot's needs next to what you know of a candidate (E4B).

## Little stuff

- Maker's marks; smiths and potters with styles you learn to recognize.
- Inscriptions and graffiti in local languages, garbled until learned.
- Wear tells a story: a sword with a notched edge has blocked something big.
- Smell gives early warnings: smoke, rot, someone's perfume in an empty room.
- Patina and age: old things gain lore layers just by existing.
- Things remember: an item near many deaths drifts toward `haunted`.
- Names stick: once an item has a legend, people call it by name.
- Collectors: NPCs who want things with specific history.
- Fakes: forged provenance; appraisal can catch it, or not.
- Pawn and buyback: a sold heirloom reappears years later with new history.
- Rumor objects: everyone has heard of a thing; few have seen it.
- Lost-and-found: a lost item's ledger keeps running while it's gone.
- Children and animals notice things adults miss (a low Perception bonus).
- Weather reveals: rain shows footprints, frost shows warm spots.
- Dreams show K6 glimpses you can't read awake.
- Observing your own body: scars, aging, a constitution you didn't know.
- Mirrors and reflections can show K5 truths.
- A place's lore deepens the longer you live there.
- Things you observe often become "familiar" and show changes at a glance.
- Your own items gain lore from your life, so an heir inherits stories.

## Save budget

Unobserved detail costs nothing: K1 lore is regenerated from its seed when
needed. Only observed layers, lived history and K3 results are saved. Item
ledgers cap and compact like the life record (E6). Far-tier and unremarkable
things store no lore.

## Smallest proof

Village: an Observe action on items, places and people with three senses
(look, smell, taste); 10 oddities from a `village.oddity` deck; one K2 wild
coin, one K3 sealed box, one K4 false-blessed ring; layered tooltips; and
Notebook entries. Test: two fresh saves generate different but stable lore
for the same oddity, the lore survives save and reload unchanged, and a
generated fact is later used by a callback card.

## Vocabulary additions

Tags `chaotic`, `fickle`, `sealed`, `disguised`, `unknowable`, `familiar`,
`haunted`; mystery kinds K1 to K6 as an entity field `mystery`; senses
`look`, `touch`, `smell`, `taste`, `listen`, `energy`, `psychometry`,
`appraise`, `study`; knowledge states `unknown`, `glimpsed`, `believed`,
`confirmed`; deck `village.oddity`; seed form `hash(worldSeed, entityId, 'lore')`.
