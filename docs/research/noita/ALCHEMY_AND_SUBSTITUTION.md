# Alchemy and substitute materials

[Main report](REPORT.md). Static source audit, 2026-10-09, build 17130612.
All YAIR changes below are proposals, not accepted rules or source behavior.

## Seeded recipes: evidence boundary

F6. The installed XML defines precursor and healing liquids, but no active
recipe for creating either secret liquid was found in shipped Lua/XML.
The apparent healing recipe at `data/materials.xml:16187` is commented out.
The precursor-to-draught step is active (`:16116`); that is a later fixed
reaction, not the random precursor recipe. Lua mentioning a liquid, a chest
or an alchemy song is not the recipe generator.

The generator is treated as engine-side for this pass by inference from the
absence of a script implementation and the community reconstruction below.
No engine disassembly was run. This is not proof that the binary uses the
exact community algorithm in this installed build.

Community evidence, kept separate: NARG chooses three distinct liquids from
30 entries and one solid from 18, shuffles the four, then omits the fourth.
Thus the final three contain zero or one solid. A seed transform warms a
Park-Miller-style generator six times; sequential draws form Lively
Concoction, then Alchemic Precursor. Shuffle uses its own seed-derived state.
Its author describes the second ingredient as consumed and the others as
catalysts, and warns that the displayed probability is a reaction rate.
These are tool-source claims, not live Noita verification.
[Algorithm at the audited revision](https://github.com/Neffc/narg/blob/fa614b2eb44c1469053a0306b48f09af0a171d90/src/alchemy.rs),
[recipe order](https://github.com/Neffc/narg/blob/fa614b2eb44c1469053a0306b48f09af0a171d90/src/main.rs),
[author's explanation](https://github.com/Neffc/narg/blob/fa614b2eb44c1469053a0306b48f09af0a171d90/README.md).

S-P6. For YAIR, draw and save the resolved recipe once at the selected
world/life boundary. Save ingredient IDs, roles, outputs, algorithm revision
and draw receipt. Do not recompute old recipes after a catalogue update.
World, life, canon, regional and personal modes in E4B remain distinct.
A remembered recipe from a different world is a hypothesis until tested.
Use the `discovery` stream; experimentation should not reroll the recipe.
Ingredient substitution is an authored policy for each secret, not automatic.

## What Noita establishes about substitution

F7. The reaction table uses both exact identity and family matching:
168 records have exact input selectors only; 162 use at least one bracket
family. Water with lava differs from brine with lava (`materials.xml:15306`,
`:15333`). Acid selects corrodible matter (`:15219`); Midas selects the
alchemy family (`:16151`). Related molten outputs preserve a binding to
matched material (`:15248`). Some rules ask for a third material (`:16854`).

That supports shared behavior for a tagged family. It does not establish
that every potion or crafting slot accepts every same-tag material. One
canonical material can remain required by lore, or a secret can have exact
ingredients. E4's ban on named materials would erase this useful distinction.

## Proposed recipe contract

S-P1. Keep two selectable match modes per slot: exact identity or property
profile. A profile has required properties, ranges, minimum amount, allowed
phase, exclusions and known alternatives. Physical function and exact ritual
identity can differ inside the same recipe. Keep the canonical fill visible.

S-P2. Preserve contents as amounts per material, including inert and hazardous
fractions. Do not replace a mixture with mean tags before matching a recipe.
Count-based averaging in E4 section 11 treats one herb and one barrel as
comparable; use declared units and concentrations. Keep catalysts separate
from spent reagents. Trace poison must not vanish merely because it is not
among the top three tags in an item key. A compact stable mixture ID can
point to a full saved composition record.

S-P3. Knowledge and physical fit are separate. A material can work before the
character understands it. Q14 remains open: offer safe known-substitute mode
and a risky experiment route if selected. A preview reports what is known,
uncertain and excluded; a failed attempt can reveal one tested property.
Teacher claims and observed experiments retain different confidence.

S-P4. Keep these axes apart:

| Axis | Proposed measure | What it changes |
|---|---|---|
| Amount | Count, mass or volume with a unit | Reagent consumption and output yield |
| Concentration/purity | Useful fraction and contaminants | Dose, side effects and fit |
| Property magnitude | Numeric value with a local unit | Heat, conductivity, hardness or healing response |
| Quality | Condition or workmanship of this piece | Reliability and durability |
| Potency | Functional output per unit for a named effect | Dose needed, not universal superiority |
| Grade | Local categorical scale | Lore/access constraints, not automatic cross-world equivalence |
| Origin | World/material provenance | Compatibility and knowledge |

Noita's materials have numeric density, burn budget, thresholds and
conductivity; they do not have a shared crafting quality/grade/potency axis.
Wand design and quality generation is a separate system. E4B's proposed axes
remain our design choices, not facts confirmed by Noita.

S-P5. Higher is not always better. More volatile fuel can exceed a container's
safe range, conductive ore can fail insulation, and high potency can exceed
a dose limit. Fit should be a vector of satisfied roles and hazards rather
than one score that upgrades every output. Preserve the extra properties
that affect a later user or recipe. A deliberate poor substitute can still
be chosen with a visible known tradeoff.

## One proposed worked craft

A torch needs a dry handle, absorbent wrap and fuel that stays on the wrap.
Known tallow is the default. A local resin fits the fuel profile if its flow
and burn traits are known; waterlogged cloth fails the dry-start condition.
A potent outside-world oil can burn brightly but exceed the safe heat budget.
The handle, wrap and oil retain their own records, and the finished torch
exposes an aggregate response derived from those records. A poisoned wrap
keeps its poison even if that is not one of the torch's headline tags.

This is an original example for E4/E4B. Noita's data supports separating
identity, property, amount and route; it does not supply this recipe or its
balance numbers. The native exact recipe should remain available beside the
proposed experiment path.

## Current YAIR fit, checked in source

Native crafting already looks up either `material_id` or `material_type`,
then finds inventory variants and sorts by price (`src/crafting_recipes.js:318-339`).
That is a useful existing category route. It does not provide arbitrary
multi-property profile matching, knowledge gates or conserved mixtures.
Native item tags are boolean categories (`src/items.js:201-202`), while quality
is calculated separately (`src/crafting_recipes.js:85-101`). The current
`meets` adapter uses `{fact, op, value}`, with `eq`, `gte` and `lte`, not an
array-based operator syntax (`src/rules.js:20-29`). Recipe profile/identity
adapters should reuse the existing native lookup where it fits.
