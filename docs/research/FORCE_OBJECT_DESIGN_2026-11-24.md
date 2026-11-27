# Force in the world layer

Proposal under AD32. The default under AD56 is a holder's **available strength or applied load**, expressed as a whole-number `force` quantity. Worlds can opt in where something stores, supplies or sustains a mechanical load. A body can exert it, a thing can hold it, and a place can carry an ambient load. A ward can read it through the existing block threshold. An author supplies the actual release, contact, counterforce or upkeep that gives it consequences.

## Evidence

The [area fills](../coverage/fields/area-field.jsonl) and their source ledger notes use the same label for different mechanisms. The dispatch counted 167 `add.force` and 57 `alter.force` area misses after other gates. These are blocked labels, so that count is an upper bound on what any single mechanism can cover. [Dry run](../coverage/fields/law_take.json)

| Sample | Label and what the row describes |
| --- | --- |
| Tzaangor, `aos-soulbound.creature.tzaangor` | `add.force`, sustained in an area, with a confirmed `damage` fill. The note describes extra damage on future melee hits when several share a Zone. Held strength could supply a modifier after the group check. [Creature ledger](../coverage/aos_soulbound_creatures.jsonl) |
| Arcane Wave, `aos-soulbound.power.arcane-wave` | `add.force`, instant, confirmed area, everyone and damage. The row calls for a test, damage and possible prone. [Power ledger](../coverage/aos_soulbound_powers.jsonl) |
| Malefic Hunger and Metallic Sheen | Both say `alter.force`. The first increases allies' damage and has a minutes fill. The second changes surface friction and has a hinder fill. A friction change belongs to movement admission. [Power ledger](../coverage/aos_soulbound_powers.jsonl) |
| Gift of Chamon and Witchbrew | Item-bound `add.force` and `alter.force`. The gift changes a weapon's damage or a suit's armour. The brew improves melee and prevents a condition in a specific circumstance. Each needs its own reader for the carried change. [Power ledger](../coverage/aos_soulbound_powers.jsonl), [artifact ledger](../coverage/aos_soulbound_artifacts.jsonl) |
| Transmutation of Lead | `remove.force`, sustained, with enemies and hinder fills. The note weakens enemy weapons and aiming. A force subtraction could express the weakened output, while accuracy belongs to aim. [Power ledger](../coverage/aos_soulbound_powers.jsonl) |

The [TTRPG rules pass](power-catalogues-2026-11-16/README.md#ttrpg-rules-as-rows-2026-11-17-proposals) distinguishes attack, displacement and breaking. D&D's Ring of the Ram deals typed Force damage and pushes a creature on a hit, or makes a Strength check to break an eligible object (`dnd_srd.rule.0523`). BRP's declared knockback uses final damage versus size and permits bracing through a mount (`brp.rule.0122`). Its special hits can instead compare damage before armour and resolve obstacle impact afterward (`brp.rule.0108`, Knockback). [D&D rules](../coverage/dnd_srd_rules.json), [BRP rules](../coverage/brp_rules.json)

Gu already distinguishes forming, applying and resisting force. The strength path maps strength to sustained self `add.force` and attacks to `remove.vitality`. Giant Hand caps gathered power by the number of phantoms and adds reinforcement. The live world working separates forming the hand, contact, and brace absorption through its existing impact port. The native fight uses shared strike and mitigation functions, and the typed damage layer reads attacks and defender modifiers. W holds a position as a place reference and checks movement admission. A shove needs a destination chosen by the world. [Gu effect pack](../../src/world_packs/gu_effect_pack.js), [Giant Hand](../../src/gu_giant_hand.js), [working](../../src/world_packs/gu_giant_hand_working.js), [native combat](../../src/native_battle.js), [damage types](../../src/damage_types.js), [world substrate](../../src/world_substrate.js)

## Options and default

| Option | Decision and reason |
| --- | --- |
| O1 Transient impulse | Keep for authored releases. Direction, bracing, route and contact determine whether a target moves, breaks or takes a hit. The same input lacks those facts for ordinary strength buffs. |
| O2 Held force quantity | **Default.** A grip, a loaded mechanism and a ward can use the same bounded account with their own readers. It gives existing threshold checks a fact they can act on. |
| O3 Lower all force to combat damage | Reserve typed damage for authored hits. Adding strength to the actor, holding a ward or shoving around an obstacle each has a different outcome. |
| O4 Paired loads on place links | Explore for a grapple, anchored sling or loaded support. Source and counterload live on opposite ends of a link, and failure shifts tension through the graph. Useful for propagation and rerouting. A simple strength buff would still need an account and a reader. |

The world composes the supplied `FORCE_QUANTITY` declaration and seeds holders that carry force. `add.force` increases it, `remove.force` releases or drains it, and `alter.force` applies an authored signed `delta` to the same bounded account. Missing holders' accounts produce a skip. Unchanged amounts at a bound likewise produce a skip. This uses the usual quantity ledger, force blocks and effect publication. Time and renewal come from the method, field or pulse that produced it.

For a blow, the world authors the contact through its existing hit authority. Native combat uses typed mitigation and its own health settlement. Engine working hosts that handle direct vitality removal can use the existing `landImpact` port and preview. For a shove or a breaking load, the world can read force and compose `move.position` or a condition change using its established movement and material rules. This follows AD38 and AR3. [Combat math](../../src/combat_math.js), [working impact port](../../src/engine_records.js)

## World dials (AD5)

| Dial | Default and reason |
| --- | --- |
| Scale and bounds | Whole authored force units from zero. Each world chooses baselines and scale by what body, structure or ward they must overcome. Bounds are a quantity declaration concern. |
| Loading, stacking and release | A single authored dose per activation, with existing quantity bounds. The working owns repeat rate, cost, decay, removal or discharge so a temporary effect expires for an in-world reason. |
| Resistance and consequence | A consuming rule reads the account at its own threshold. The encounter decides bracing, reach, mass, route, armour and collision. Coarse places can use one named exit, detailed worlds can author finer positions. |

Opted-in worlds save the value in their existing holder quantities and ledger. An older holder without force remains valid and keeps its previous state. A world migrating an older holder into this mechanic can seed its own baseline. No format or revision change.
