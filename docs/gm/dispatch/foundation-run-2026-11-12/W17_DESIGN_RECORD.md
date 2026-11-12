# Wave 17, lane E3: the design record (proposal)

Status: proposal (AD56), agent-verified by `tests/design_record.test.js` (6 of 6), not human-reviewed. Applies PC97, PC94, PC95, PFP3, AD38. Module: `src/design_record.js`.

## What it is

A design is what a thing is made from or by. Five shapes already exist, each with its own law. The design record is a view over them, not a new store: `readDesign(kind, native)` lists the record's parts, an operator changes parts, and `writeDesign(design)` gives back the native shape so the native law runs it unchanged.

A design is `{kind, id, from?, parts, base}`. A part is `{id, role, value, couples}`. `base` keeps the native record, so whatever is not a part survives the trip. A kind is declared as a list of groups, each naming one container in the native record (`defineDesignKind`); the module holds no numbers and names no world.

## The five native shapes and their part addresses

| Kind | Native shape (owner) | Part addresses | Role | Couples to |
| --- | --- | --- | --- | --- |
| `creature` | `{genes: {locus: [a, a]}, breeding: {trait: n}}`, the heritable fields of a lifecycle individual (`heredity.js`) | `gene:<locus>`, `breeding:<trait>` | locus, breeding-value | the trait it affects, the quantity or condition it needs to show (from the genome row, passed as context) |
| `recipe` | A brew pack row: `slots[]` and `method.steps[]` (`brew_law.js`, `world_packs/lotm_brew_pack.js`) | `slot:<id>`, `step:<n>` | main, aux; the step's op | its material, the constituents it carries or its reactions read |
| `spell` | One effect sentence `{verb, object, target, time, carrier, cost, limits}` (`effect_grammar.js`) | `slot:<field>` | the field | the grammar's own links: verb to object, carrier to cost, reach and time to scope |
| `move` | A role record `{id, roles[]}` (`gu_move_roles.js`) | `role:<id>` | filler or context type | the kind or function that can fill it |
| `made` | A process method's input `{steps[], rows[], projection}` plus the starting `piece` (`process_law.js`) | `step:<n>`, `row:<id>`, `property:<name>`, `share:<name>`, `scalar:<name>` | hold, work; transfer, drift; projection; material | medium, tool, shares, scalars |

A sixth kind, `composition`, reads a `kernel_compose.js` definition by `slot:<name>`. It cost three lines and shows the same view one level below a move.

## What the test shows

1. Round trip: native to design to native is equal for a sheep from the lifecycle, the Seer formula row, the shield sentence from the spellbook pack, the supported fire attack's role record and the forge-quench-temper blade. It holds after a JSON save of the design too.
2. `editPart`, written once, changes a sheep's winter gene (the coat shows in the cold), swaps the Seer binder for a weaker one (a complete dose at 600 per mille with 4 hazard points: a fault with a price), sets the shield's time slot to lasting (scope 4 to 5, and the guard still stands after the original ran out), replaces the size support in the fire move (it runs, loses its size, and pays the same essence) and shortens the blade's temper (harder, and it breaks under the load the first one held). It also reaches a reach slot, a pour step and a starting material.
3. `copyDesign` gives a copy with the same parts and the same weakness in each kind: no winter coat, the same hazard on an over-measure, the same answering verbs, the same missing support, the same break when untempered. Ten clones of the ewe all lack the coat; ten lambs by a ram who carries it vary.
4. In the engine world, a native record kept as holder state is edited by one op, cloned to a new holder, and survives a save and restore.

## Round-trip gaps, by shape

| Code | Where | Gap |
| --- | --- | --- |
| G1 | recipe | A pack row mixes source and derived fields. `reaction`, `formulaPotency` and each slot's `properties` are computed once from the formula text, and `row.reaction` repeats what the react step holds. An edit to one copy does not reach the other. |
| G2 | recipe | One ingredient lives in three places: `slots`, `method.roles` and an admit step. Editing a slot's value works; adding or removing an ingredient (Graft, Transfer) needs all three changed together. |
| G3 | creature | The design is genes and breeding values. Whole parental traits, what the keeper has tested, and the per-individual draws (`individualSpread`, the non-genetic share in `expressPolygenic`) are addressed by the individual's id, so a clone under a new id shows a different height and wool weight. That reads as twins raised apart, and the operators lane should say so. |
| G4 | creature | The genome row (loci, modes) is context here. An allele the genome does not list makes `validateGenes` throw, which is a refusal. Moving a gene across kinds needs a genome-row design first. |
| G5 | spell | Two vocabularies exist. `spell_effects.js` sentences map to the shared grammar one way (`sharedEffect`), so a design read from the shared sentence cannot be written back to a spellbook row. |
| G6 | spell | The sentence holds tiers; the cast's details hold the minutes, the amount and who is hit. Editing reach changes scope (price) and leaves the world outcome as it was. In a probe, a sustained bind's mark also stayed past its minutes. |
| G7 | move | The role record round-trips. A compiled move does not: its law holds functions, held slots sit in a `WeakMap`, and the law ref names the fillers. Edit the record and compile again. Role order matters only when the record says `ordered`. |
| G8 | move | A role nobody can fill returns requirements before any spend. That is a refusal with no price. A second copy of one support does not stack under the Gu law as it stands. |
| G9 | made | No single blueprint record exists: the method input and the starting piece are separate, and the test joins them. Steps are addressed by position, so an inserted step moves later addresses. A compiled method copies the rows into every step, so the design has to be the input. |
| G10 | made | A step meets a row through the medium's temperature at run time, so `couples` can name the medium and the row's band but not the link between them. |
| G11 | all | Packs freeze their rows and a written record is a plain copy: equal in value, not frozen. Native validators throw on a value outside their vocabulary, where the effect grammar returns a named violation. |
| G12 | engine world | Holder properties are flag, level, label or set, so a design does not fit as a property. The fixture keeps it as holder state under one key. A state op leaves no cause-chain row, so an edit is not traceable in the world until the operator publishes an effect. |

## Left for later waves

The other four operators (Graft, Induce, Transfer, Make), each operator's price, skill and miss chance (they belong to the working that carries the operator), who owns the holder key for a design (KW22 to KW26), and a made-thing blueprint row in a pack.
