# Cross-world pair table · 2026-11-13

A first pass at [CBD157](../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md#round-23-fighters-from-different-worlds-on-one-frame-2026-11-13): each world's main effect kinds against the other two worlds' bodies and defences, in the three outcomes of CBD149. Findings and proposals, not accepted decisions. CBD157 also serves crossings outside fights (healing, potions, wards), so the table is written to be lifted by the world entry owner ([WER9](../WORLD_ENTRY_RULES.md), WER12) as well.

## How to read it

- **Maps (M):** the effect finds a quantity or property on the destination body and a local way to meet it, with no conversion.
- **Maps in part (P):** it lands on the nearest thing with a conversion, named in the row.
- **No purchase (N):** nothing local for it to act on, or nothing local that knows how to stop it. The row says which way that cuts (CBD149: being foreign can be a weakness or an opening).
- **Basis.** `code` means a file shows it. `inference` means I reasoned from the rows and quantities and nothing records it; a world pass or a headless test (CBD156) should confirm it before anyone relies on it. Where the code is silent and canon would settle it, the row says so and does not guess canon.
- **Scope.** The effect kinds come from what each world's rows and bodies hold today. Gu: [gu_world.js](../../src/contest_packs/gu_world.js), [gu_catalogue.js](../../src/gu_catalogue.js). Hogwarts: [contest_packs/hogwarts.js](../../src/contest_packs/hogwarts.js), the intent law in [spell_effects.js](../../src/spell_effects.js), the duelling club pack. LOTM: [tempo_fight.js](../../src/tempo_fight.js), [lotm_be_spells.js](../../src/lotm_be_spells.js), [book_world_lotm_abilities.js](../../src/book_world_lotm_abilities.js). The [sizing audit](COMBAT_WORLD_SIZING_2026-11-13.md) is the cross-check for what each fight engine reads. Grammar objects and counters come from [effect_grammar.js](../../src/effect_grammar.js).

## What each world offers as a body and as a defence

| | Gu | Hogwarts | LOTM |
| --- | --- | --- | --- |
| Body quantities in a fight | vitality, primeval essence (in parts), Gu alive, kept, controlled and fed; position, evasion | vitality (20), stamina (10), `focus` (wand in hand, 0 or 1), `composure`, `footing` | hp, stamina, armour by body slot; a spirituality pool for a Seer (not read by tempo); conditions |
| Defences | Jade Skin guard (ch83–85), White Jade, scale armour, water and thunder shields (catalogue), evasion, stealth | Shield Charm row (blocks relation, mind, position), Finite, a proctor, the doorway | Brace (a little less from the next blow), worn armour, an ally stepping in (`cover`), withdraw |
| Fuel | primeval essence, refilled by stones | stamina, the caster's own magic | stamina; spirituality that a Seer recovers by Cogitation |
| Ends a fight by | killed, yielded, routed, withdrew | referee call, surrender, escape; `lethal: false` | win, lose, yield, withdraw, with heat and wages |

## Rows: Gu effects against Hogwarts and LOTM

Gu effect kinds: GE1 cut along a line (moonblade, remove vitality), GE2 arrow, GE3 body strike (fist, bite), GE4 move the self (close in, slip past, flight), GE5 lightning or fire harm, GE6 conceal (Stealth Scales), GE7 sense through cover (Lightning Eye, Ear Grass), GE8 heal (Vitality Leaf), GE9 pull at another Gu (Plunder), GE10 essence as fuel.

| Row | Effect kind | Destination | Outcome | Conversion, or which way it cuts | Basis |
| --- | --- | --- | --- | --- | --- |
| GH1 | GE1 cut | Hogwarts | **P** | Lands on vitality, which a wizard body holds, but the Hogwarts law is non-lethal and its endings read composure, footing and the wand. The Shield rows block relation, mind and position, not vitality, so the cut is unanswered by a row. Conversion: the bout ends by a referee or proctor stepping in on the first real wound. Cuts toward the visitor until someone steps in (CBD155's club scene). | code; the proctor step is inference |
| GH2 | GE2 arrow | Hogwarts | **M** | An ordinary missile on vitality; no Hogwarts row names it. Its cost is a stock of arrows, not essence. | code |
| GH3 | GE3 strike | Hogwarts | **M** | Vitality and footing both exist; a hard strike can lower footing. | code, inference on footing |
| GH4 | GE4 movement | Hogwarts | **M** | Places, links and position exist in the spell stack (platforms, far floor, doorway). | code |
| GH5 | GE5 lightning or fire | Hogwarts | **M** for fire, **N** for lightning | The intent law has `temper_flames` (block fire), so fire meets a local answer. No row blocks lightning, so lightning has no local answer, which cuts toward the Gu fighter. | code (fire block); inference (lightning) |
| GH6 | GE6 conceal | Hogwarts | **P** | Stealth Scales mask ordinary sight; the grammar pairs conceal with sense (EF3). Hogwarts has sight and a trace charm (`trace_magic`), so the nearest local sense is sight and detection charms. Whether a charm sees a Gu mask is not recorded. | code (counter pair); inference |
| GH7 | GE7 sense through cover | Hogwarts | **P** | Lightning Eye exposes cloaked targets. The nearest Hogwarts target is a Disillusionment or an invisibility cloak; neither is a row in the fight stacks. Conversion: the sense verb finds the conceal on a worn thing. | inference |
| GH8 | GE8 heal | Hogwarts | **M** | Vitality exists; the intent law has `heal` (transform vitality, restore). | code |
| GH9 | GE9 pull at a Gu | Hogwarts | **N** | A wizard carries no Gu to pull at; a wand is a held thing, not a Gu. The move spends essence for nothing, which cuts against the visitor. | inference |
| GH10 | GE10 essence fuel | Hogwarts | **P** | No primeval stones in the host, so the move runs on the carried stock (CBD150). Conversion: stock becomes a fight-length budget; refill needs a local substitute, a long pursuit of its own. | code (no stones in the pack); inference |
| GL1 | GE1 cut | LOTM | **P** | Lands on hp, which tempo reads, but tempo has no line or projectile move kind except `shoot` for loaded rounds. Conversion: the cut enters as a strike with the blade's force, against worn armour by slot. A Beyonder's own spirit defences are not read (sizing: Beyonder state unread). | code; Beyonder side inference |
| GL2 | GE2 arrow | LOTM | **M** | `shoot` spends a stock of rounds; an arrow stock is the same shape. | code |
| GL3 | GE3 strike | LOTM | **M** | Same as `jab` and `swing`. | code |
| GL4 | GE4 movement | LOTM | **P** | Tempo has a conditions line with light and fog and no positions, with `withdraw` as the nearest. Conversion: closing in becomes less time per action; slipping past becomes the `withdraw` roll (a miss costs a free blow). | code |
| GL5 | GE5 lightning or fire | LOTM | **M** | Harm to hp against armour; tempo's fog and lamp conditions are light, not a fire defence. | code |
| GL6 | GE6 conceal | LOTM | **P** | Hides from ordinary sight; a Seer's Spirit Vision reads hidden properties, so the mask may not hold against a Seer. Cuts toward LOTM when a Seer is present. | inference |
| GL7 | GE7 sense through cover | LOTM | **M** | The same `sense` verb as Spirit Vision; two senses meet. | code (grammar) |
| GL8 | GE8 heal | LOTM | **M** | `tend` heals a share of hp for two stamina. | code |
| GL9 | GE9 pull at a Gu | LOTM | **N** | Ordinary men and Beyonders carry no Gu. Whether a Beyonder characteristic or a sealed item is something to pull at is a world pass question; this row is no purchase until then. Cuts against the visitor. | inference |
| GL10 | GE10 essence fuel | LOTM | **P** | No primeval source in the host: carried stock. Contrast: a Seer recovers spirituality by Cogitation, so the host's own fuel can renew where the visitor's does not. | code (Cogitation); inference |

## Rows: Hogwarts effects against Gu and LOTM

Hogwarts effect kinds: HE1 disarm (move the held wand), HE2 tickling (transform mind, composure), HE3 dancing feet (move position, footing), HE4 hold (bind motion), HE5 shield (block harm or spell contact), HE6 Finite (end a working), HE7 raise or levitate (move position of a body or thing), HE8 heal or mend, HE9 light and fire, HE10 ward (alter access), HE11 soul-directed (Patronus as an agent, a soul bound into an object).

| Row | Effect kind | Destination | Outcome | Conversion, or which way it cuts | Basis |
| --- | --- | --- | --- | --- | --- |
| HG1 | HE1 disarm | Gu | **P** | Takes a held thing such as the hunter's bow (`held: {bow}`), but a Gu is carried inside the body, so there is no grip to take. The master's main weapons stay. Cuts toward the Gu fighter. | code (held bow); inference |
| HG2 | HE2 tickling | Gu | **P** | A Gu body has no composure quantity. Conversion: composure becomes lost control, since a Gu counts while it is controlled and not otherwise (`liveProfile`), or lost action time. Not recorded. | code (control); inference |
| HG3 | HE3 dancing feet | Gu | **P** | Position and evasion exist, footing does not. Conversion: footing becomes the evasion value (`moveEvasion`). | code; inference |
| HG4 | HE4 hold | Gu | **P** | Binds the body's motion; a Gu works by the master's will, so activations may still run while held. Cuts toward the Gu fighter. | inference |
| HG5 | HE5 shield | Gu's blade | **P** | The grammar pairs block with remove (EF3 counters), but this Shield's own object is spell contact. Whether a crescent of moonlight counts as spell contact is a world pass call. | code (counter pair); inference |
| HG6 | HE6 Finite | Gu | **P** | `end` accepts a working, and a Gu activation is a working record on its law. The activation stops; the Gu lives and the master can raise it again for essence. | code (grammar); inference |
| HG7 | HE7 levitate | Gu | **M** | Moves a body or thing; mass limits the same way. | code |
| HG8 | HE8 heal | Gu | **M** | Vitality exists; the aperture and essence are not touched. | code |
| HG9 | HE9 light and fire | Gu | **M** | Both worlds carry light and heat as quantities (`light:sun`); light also feeds the moonblade glare rules. | code |
| HG10 | HE10 ward | Gu | **M** | A closed link in the place graph applies to anyone; Ear Grass still hears through it. | code (links); inference |
| HG11 | HE11 soul-directed | Gu | **P** | `soul` is a grammar object for exactly these two worlds (the grammar comment names both). A Gu soul path is a deeper law; the conversion needs a world pass, and the Gu side's own soul defences are unrecorded. | code (grammar comment); inference |
| HL1 | HE1 disarm | LOTM | **P** | Tempo has a firearm stock, not a held thing. Conversion: taking the revolver removes the `shoot` move (its loaded rounds stay in the world). | code; inference |
| HL2 | HE2 tickling | LOTM | **P** | No composure. Conversion: composure becomes stamina loss and a slower next action. A Beyonder's sanity is a separate thing not read in fights. | inference |
| HL3 | HE3 dancing feet | LOTM | **P** | No footing. The nearest dial is fog's hit mishap (`fogMishap`), so footing becomes a to-hit penalty. | code (dial); inference |
| HL4 | HE4 hold | LOTM | **P** | No positions. Conversion: a held fighter's actions cost a large time block. | inference |
| HL5 | HE5 shield | LOTM | **P** | Blocks harm; for a blade or a fist the counter pair holds. Against a revolver round, no row says a Shield Charm stops a bullet, which cuts toward LOTM; canon would settle it, not the code. | code (counter pair); inference |
| HL6 | HE6 Finite | LOTM | **P** | Ends a sustained working, such as an ability condition (grave strength, rage burst). The Sequence and its potion stay. | code (conditions); inference |
| HL7 | HE7 levitate | LOTM | **P** | No positions. Conversion: the lifted fighter leaves the fight line for a time. | inference |
| HL8 | HE8 heal | LOTM | **M** | The same quantity as `tend`. | code |
| HL9 | HE9 light and fire | LOTM | **M** | Tempo's conditions line carries light; fire is harm to hp. | code |
| HL10 | HE10 ward | LOTM | **P** | A closed link maps. A ritual ward in LOTM's spirit world works by another mechanism; an ordinary door ward maps and a spirit barrier does not. | inference |
| HL11 | HE11 soul-directed | LOTM | **P** | The grammar has `soul`; LOTM keeps a spirit and spirituality as a pool, which is a different quantity from a bound soul. Conversion needs a world pass. | code (pool); inference |

## Rows: LOTM effects against Gu and Hogwarts

LOTM effect kinds: LE1 firearm round, LE2 melee strike, guard and withdraw, LE3 Spirit Vision (sense hidden properties, spirituality), LE4 body faculties as conditions (grave strength, rage burst), LE5 fog and light as a scene condition, LE6 spirituality as fuel, LE7 divination and luck, LE8 persona and mimicry (hold a role, conceal form).

| Row | Effect kind | Destination | Outcome | Conversion, or which way it cuts | Basis |
| --- | --- | --- | --- | --- | --- |
| LG1 | LE1 round | Gu | **M** | Remove vitality along a line; Jade Skin, scale armour and thunder or water shields are the local answers, so a Gu with a guard raised meets it. Rounds are a finite carried stock. | code |
| LG2 | LE2 melee | Gu | **M** | Strike and brace map onto strike rows and the Jade Skin guard. | code |
| LG3 | LE3 Spirit Vision | Gu | **P** | Gu bodies list a spirit channel among their senses (`senses`). Conversion: auras map to the aperture's essence and carried Gu. What it shows is unrecorded. | code (senses); inference |
| LG4 | LE4 body faculties | Gu | **M** | Conditions on attack and speed; the Gu profile carries attack and evasion. | code |
| LG5 | LE5 fog | Gu | **P** | The Gu scene carries `light:sun` and glare, not fog. Conversion: fog becomes a lower light value; darkness is a listed Gu gap (G4). | code (G4) |
| LG6 | LE6 spirituality fuel | Gu | **P** | Not primeval essence; carried as its own pool. Contrast: the Seer's pool renews by Cogitation where essence needs stones, so the visitor has the steadier fuel. | code; inference |
| LG7 | LE7 divination and luck | Gu | **M** | `luck` was added to the grammar for exactly this pair (Reverend Insanity's luck path and LOTM). Its draws are shifted weights. Who defends is unrecorded. | code (grammar comment) |
| LG8 | LE8 persona and mimicry | Gu | **P** | Identity laws differ by world; the Gu side has form-changing Gu rows. Conversion: a held role maps to a believed identity, not to a changed body. | inference; see [identity laws](../worlds/IDENTITY_LAWS_BY_WORLD_2026-10-14.md) |
| LH1 | LE1 round | Hogwarts | **M** | Vitality (20) is the target. No fight row names a bullet; the Shield rows block spell contact. Whether a Shield Charm stops a bullet is canon's call (not recorded). Default: no local answer, which cuts toward LOTM. | code; inference |
| LH2 | LE2 melee | Hogwarts | **M** | Strike on vitality and footing. | code |
| LH3 | LE3 Spirit Vision | Hogwarts | **P** | Sees properties; Hogwarts has a trace charm (`trace_magic`, detect), so the nearest local reading is detection by charm. Seeing magic as an aura is not recorded. | code (intent law); inference |
| LH4 | LE4 body faculties | Hogwarts | **M** | Conditions on a stamina and speed body. | code |
| LH5 | LE5 fog | Hogwarts | **P** | Place tags exist and no rule reads them (sizing G4: forest at night is a listed gap). Conversion: fog needs a scene rule first. | code (sizing) |
| LH6 | LE6 spirituality fuel | Hogwarts | **P** | The wand works where the magic is in the caster, so there is no fuel gap, but spirituality is not a Hogwarts quantity. Conversion: a stamina cost of the same size. | inference |
| LH7 | LE7 divination and luck | Hogwarts | **P** | The grammar's luck object names two worlds, and Hogwarts is not one. Conversion: a luck potion's carrier is the nearest local luck effect; unrecorded in the fight stacks. | code (grammar); inference |
| LH8 | LE8 persona and mimicry | Hogwarts | **M** | Polyjuice is a form transform to a donor's, the same family; see [HP Polyjuice notes](../worlds/HP_POLYJUICE_AND_PERCEIVED_IDENTITY_CONSIDERATIONS_2026-11-03.md). | code (plan); inference |

## Counts

| Source world | Rows | Maps | Maps in part | No purchase | Split |
| --- | --- | --- | --- | --- | --- |
| Gu (to Hogwarts and LOTM) | 20 | 9 | 8 | 2 (GH9, GL9) | 1 (GH5) |
| Hogwarts (to Gu and LOTM) | 22 | 6 | 16 | 0 | 0 |
| LOTM (to Gu and Hogwarts) | 16 | 8 | 8 | 0 | 0 |
| **All** | **58** | **23** | **32** | **2** | **1** |

GH5 is one row with two outcomes (fire maps, lightning has no local answer), so it sits in its own column. Of the 58 rows, 36 carry `inference` in the basis column (some alongside `code`), so the counts show the shape of the table and not a measured result.

## Reading (proposals)

- **R1 · Most pairs map or map in part; a true no-purchase row is rare.** The two clear ones are Plunder against a body with no Gu in it (GH9, GL9), both cutting against the visitor.
- **R2 · The recurring conversion is a missing quantity.** Hogwarts' composure and footing, LOTM's spirituality and a Gu's essence each lack a counterpart. A short named conversion per missing quantity (composure becomes lost control or lost time, footing becomes evasion) would settle most "maps in part" rows at once, instead of row by row.
- **R3 · Fuel is the asymmetry that matters.** Essence does not renew in a host without stones, and a Seer's spirituality does (CBD150). A visitor from Gu fights as a short attrition fight; a visitor from LOTM may not.
- **R4 · The destination's engine decides what "maps" can mean.** Tempo has no positions, so HL3, HL4 and HL7 convert to time or to-hit costs. If LOTM stays on tempo (sizing R4), those conversions are the price of the choice.
- **R5 · The weak cells are the ones where canon decides.** Whether a shield stops a bullet, whether Spirit Vision reads an aperture and whether a charm sees a Stealth Scale mask need a world pass (WPR rules) or a headless run (CBD156), not a ruling from this table.

## More to consider

- **Hand the table to the world entry owner** as the cross-world input to WER9 and WER12, and add the healing, potion and ward rows there; CBD157's own note asks for this.
- **Fill the sealed or canon-dependent cells by ID once a world pass settles them,** not by an open ruling here; none of the cells above depends on a changed or randomized truth.
- **Run CBD156 on three rows** (GH1, HG6, LG3) and update their basis from `inference` to `code`.
