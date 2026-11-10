# Item rules

Working defaults 2026-11-10 under AD56 (ideas that open possibilities are welcome), adjustable; the lines listed in the [limiting lines review](audits/LIMITING_LINES_REVIEW_2026-11-10.md) stay proposals until Weibao answers. Drafted as proposals the same day (AD32). Requested by Weibao ("Draft FRC1–FRC3 rulebooks", [log](gm/USER_VISION_LOG_2026-11.md#three-more-rulebooks-and-making-rules-reach-implementation-2026-11-10)). Rows marked **(restates)** repeat a rule that already binds through its own code and add no authority.

Covers things that are held: when an item is an individual and when it is a count, custody and location, storage and containers, carrying, equipment and gear stats, wear and repair, quality, spoilage, item knowledge, unique and named items, items crossing worlds and lives, money versus items, and inventory screens. A world may set any line differently with an in-world reason and cost (AD5, AD38); each row gives the default, the dial and the reason.

His words that set the shape: "consider items and possibilities from books too" (2026-10-17); gear carries many native stat dimensions, "just implement them all", through one sourced pipeline with affixes and sockets as data (2026-10-20); "Go ahead with the inventory overhaul... using the base game and Proto23 as references" (2026-10-21, delivered); generated inventory beside canon inventory, and merchants with inventories (2026-10-27, WA40–WA44); shops keep default staples (2026-11-10); no forced weakness (AD55, 2026-11-10); old saves are disposable.

Owners and neighbours (linked, not restated): Rulebook 5; MR1, MR3, MR5, MR30–MR33, MR41 in [making rules](MAKING_RULES.md); SR15, SR17 in [site rules](SITE_AND_EXPLORATION_RULES.md); ECR9–ECR19, ECR24–ECR27, ECR33 and CBR17–CBR21, BHR4 in [domain rules](DOMAIN_RULES.md); ABR17; WER3, WER9; WA14, WA40–WA44; [LVR9](LIVELIHOOD_RULES.md), [TMR9](TIME_RULES.md), [KNW9, KNW12, KNW16, KNW20](KNOWLEDGE_RULES.md), [CHT5](CHEAT_RULES.md); UR12, UR13, UR21 in [UI rules](UI_RULES.md). Palettes: [equipment stat dimensions](EQUIPMENT_STAT_DIMENSIONS_CONSIDERATIONS_2026-10-20.md) ESD1–ESD16, [gear depth](GEAR_DEPTH_BLACKSMITHING_CHEMISTRY_ENERGY_POWERS_CONSIDERATIONS_2026-10-20.md) GDP, [tools and instruments](TOOLS_AND_INSTRUMENTS_CONSIDERATIONS_2026-10-17.md) TQ, IP, MT, [item lifetimes](gm/dispatch/maker-arts-2026-10-14/ITEM_LIFETIMES.md) LT1–LT12, [gear stat readers census](audits/GEAR_STAT_READERS_CENSUS_2026-10-20.md), [inventory overhaul assessment](reviews/INVENTORY_OVERHAUL_ASSESSMENT_2026-10-21.md) (I2–I5 delivered). Code map: `src/items.js`, `src/components/inventory_component.js`, `src/inventory_key.js`, `src/acquisition.js`, `src/absorb_e2/durability.js`, `src/equipment_stats.js`.

## Terms

| Term | Means | Not |
| --- | --- | --- |
| Stack | A count of interchangeable things under one key (`{id, quality}`) | A pile of individuals |
| Individual | One thing with its own id because something is attached to it (wear, fit, a name, a power, a loan) | A rare item |
| Holder | Who or what has it now | The owner |
| Owner | Who it belongs to by the world's rules | The holder |
| Container | A place items sit with a holder and an access rule (a chest, a bag, a cart, a ring space) | An inventory screen |
| Grade | The headline word for quality (fine, crude) | The number underneath |

## Identity and custody

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| ITM1 | **Stacks by default; individuals when something attaches.** A copy becomes an individual (count 1, its own id) once wear, fit, a name, a power, a history or a loan attaches to it. | Default: counted stack under `{id, quality}`; the attachment creates the individual; it does not merge back while the attachment holds. Dial: per world, what triggers it. Reason: fit, wear, names and loans all need one instance (TQ55); today identity waits for the global durability switch. | TQ55, MR41, LT1 |
| ITM2 | **One instance id scheme.** Wear instances, heirlooms, lineage cohorts and made-product references are views of one instance id. | Default: new features use the e2 instance id (`absorb_e2/durability.js`); other key shapes move when touched, with a receipt for each key rewrite (GDP13). Dial: none. Reason: five key shapes today make a part swap or an heirloom a special case. | GDP13, MR33 |
| ITM3 | **Things are conserved and kept somewhere** (restates MR5, SR15). | Default: every item has one holder and one place; one thing does not serve two exclusive uses; selling, breaking or losing it sends it to a recorded destination (ECR10, ECR19). Dial: none. Reason: an item that vanishes is a bug. | MR5, SR15, ECR10, ECR19 |
| ITM4 | **Holder, owner and place are three facts.** | Default: the holder and place are always tracked; an owner field exists only where the world has theft, loans or pawning (LT10). Dial: per world. Reason: a stolen sword is held by the thief and owned by you. | ECR24, LT10 |
| ITM5 | **One write path.** Items enter and leave inventories through `acquisition.js` `stageAcquisition` and the transaction modules. | Default: no feature writes `#items` directly. Dial: none. Reason: AR3; one path keeps custody and receipts honest. | AR3, ECR15 |

## Holding and carrying

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| ITM6 | **Each container states its holder, place and access.** A chest, a bag, a cart, a ring space and a ship's hold are containers with those three facts. | Default: the chest (`native_storage_transaction.js`) is the plain container; a volumetric one (`structured_container_runtime.js`) is the exception a world opts into. Dial: per world. Reason: one statement per container lets theft, travel and inheritance read any of them. | SR15, ECR17 |
| ITM7 | **No carrying limit unless a world has one.** | Default: no weight or slot cap on the player's inventory (today's code has none); a world with weight, slots or volume declares it, with a soft cap, a notice and a place to put the surplus. Dial: none, slots, weight or volume. Reason: AD22 and AD55; a forced cap is a chore in an idle game. | AD22, AD55 |
| ITM8 | **Spoilage acts on perishables only.** | Default: a perishable carries a life and a spent age; storage slows or stops it by how it works (drying, salting, a stilled room); time away follows TMR9. Dial: per good and world. Reason: LVR9; a sword does not rot. | LVR9, TMR9 |

## Equipment, wear and quality

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| ITM9 | **One stat pipeline.** Gear stats flow flat, then percent, then multiplier, with every source kept. | Default: `equipment_stats.js` `applyEquipmentStats`; affixes and sockets are data (ESD4, ESD8); totals are derived on load from saved affix ids and values (ESD10). Dial: per world caps as adjectives (ESD2). Reason: his 2026-10-20 direction; the census found four battle models with their own hit math (GSR1–GSR3) to fold in when touched. | ESD1, ESD10, GSR |
| ITM10 | **A stat has a cost where its mechanism has one.** | Default: weight, stamina or agility costs follow the item's material and make; a stat with no real cost is fine (AD55). Dial: per world. Reason: AD55 qualifies ESD6's "every stat has a visible cost". | AD55, ESD6 |
| ITM11 | **Gear wears from what happened, gently by default.** | Default: wear is per individual and comes from real use (CBR19); it is gentle, and each kind states what zero means (useless, broken and repairable, or destroyed). Dial: harsh, none, or self-restoring per world and item. Reason: CBR19 wants wear from events; MT7 warns about idle grind; the global opt-in today (`durability.js`) is the "none" setting. | CBR19, TQ9, MT7 |
| ITM12 | **Repair, reinforce, refit and upgrade are four verbs.** | Default: repair by coin (quick) and by material and skill (cheaper, slower) both exist (GDP9, MT11); salvage returns lots and is conserved (GDP17). Dial: per world. Reason: GDP10. | GDP9, GDP10, GDP17 |
| ITM13 | **Quality shows as a grade word; the number stays underneath.** Workmanship, rarity and effects are separate facts. | Default: ESD16; a world names its own ladder. Dial: per world. Reason: MR31 and one percentage cannot say what is good about a thing. | ESD16, MR31 |
| ITM14 | **Living and bonded items take conditions, not wear** (restates CBR20). | Default: they heal or sicken; they can grow (LT7). Dial: per item. Reason: CBR20, BHR4. | CBR20, BHR4 |
| ITM15 | **A power held in an item travels with its custody** (restates ABR17, CBR21). | Default: losing custody removes access, not knowledge; power in a weapon does not pass to a new wielder unless the world says so. Dial: per item. Reason: ABR17, CBR21. | ABR17, CBR21 |

## Knowing items

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| ITM16 | **True properties act whether known or not; screens show what is known** (restates MR1, MR31). | Default: an item in hand is read at the appraisal level the character's means allow (`item_card_model.js` SEES); names, sort order and prices leak nothing (KNW22). Dial: per means. Reason: MR1, MR31. | MR1, MR31, KNW22 |
| ITM17 | **A text is an item that makes an account** (restates KNW16). | Default: KNW16; possession, readability, comprehension and mastery are separate (SR17). Dial: per text. Reason: KNW16. | KNW16, SR17 |

## Unique items, crossing and money

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| ITM18 | **An item becomes unique by what it carries.** A power, a history or a name makes it one of a kind; an ordinary item can earn a name. | Default: `relic_generator.js` names and rolls once, saved with the record; provenance is a record on individuals only (GDP20, LT6); fame is readable by informed observers. Dial: per world, whether a kind of item can have one holder at a time (GHS87). Reason: MR41, ABR17. | GDP20, LT6, MR41 |
| ITM19 | **Nothing crosses worlds or lives without a carrier** (restates Rulebook 5, ECR27, WER9). | Default: a carrier per edge (a small bag across lives, an heirloom nomination, a start premise); `carry_ledger.js` lists per world what crosses death, rebirth and a crossing; a carried item's value is what the destination recognises (ECR13, ECR14). Dial: per edge. Reason: WER9, AD11. | Rulebook 5, ECR27, WER9, CHT5 |
| ITM20 | **Coin is a purse, not an item, by default** (restates ECR16). | Default: one purse per currency through `economy_domain.js`. Dial: a world where coins are stacked items (stealable, weighable) uses an item key, and a world where money is a power or a credit says so (ECR12). Reason: ECR12, ECR16. | ECR12, ECR16 |
| ITM21 | **Shops hold real stock** (restates WA40 and the 2026-11-10 staples direction). | Default: staples by shop type, canon anchors, seeded variety and orders (ECC38–ECC52); sold goods go to a recorded destination (ECR10). Dial: per shop. Reason: his 2026-11-10 shop direction. | WA40, ECR10 |

## Screens

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| ITM22 | **Inventory is one click away, and nothing disappears silently** (restates UR21, UR13). | Default: the delivered overhaul (I2–I5); no second stock store and no item power score. Dial: none. Reason: UR13, UR21. | UR13, UR21 |

## Building an item slice

1. Decide stack or individual (ITM1) and the instance id (ITM2).
2. Write through `stageAcquisition` (ITM5); name holder and place (ITM3, ITM4).
3. Stats through the one pipeline (ITM9); wear and repair by the defaults (ITM11, ITM12).
4. Check the card for leaks at each appraisal level (ITM16).
5. Tests: the inventory, acquisition, durability and equipment-stat tests; browser proof at the desktop viewport (AD43); save, reload and import when keys change.

## Open details

- Identity is opt-in through the global durability switch; five key shapes exist (ITM1, ITM2).
- Three equipment owners (native, simulation, structured) coexist (ITM9).
- Artifact, amulet and ring stats do not scale with quality; durability does not wrap all stats; tools ignore quality (ITM9, ITM13; census I3, I8, MT1).
- No generic spoilage owner; freshness lives in `owned_place_clock.js` and the Gu opening lot (ITM8).
- No owner field for theft or loans; one lantern loan is hard-coded (ITM4, TQ76).
- Texts have no document owner (ITM17).
