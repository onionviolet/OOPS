# World potion axis sheets (LAYX50), 2026-11-09

Everything here is a proposal (AD32). Nothing is accepted, wired or dispatched. It drafts the axis sets and ingredient values that [LAYX41](PROGRESS_ATLAS_2026-11-07_LONG_TERM.md#procedural-potion-crafting-2026-11-09) calls for: each world declares one set of potion axes that all its ingredients carry, and a canon recipe is one pinned point in that space. Owners: [MAKING_RULES](../MAKING_RULES.md) MR5-MR8, MR11, MR13, MR26, MR31, MR34, MR35; composition contract in the [October alchemy audit](../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md).

**Claim labels.** *shown* and *stated* mean a source row or locator says it. *code comment* means a comment in `src/hp_lead_making.js` or `src/lotm_seer_brew.js` says it, with no locator. *inference* is mine. Nothing was read from book text; every source claim comes from rows already in the repo.

**Scope and sealing.** Hogwarts: just what a first-year meets in book one. LOTM: the lowest two rungs of each ladder that volume 1 brews or gives a full formula for. Volume 1 is Chinese chapters 1 to 213 (`VOLUME1_READING_PLAN.md`, shown). The formula-row locators use the notes' own numbering; I read them as chapter order within volume 1 (inference), so rows with a locator up to 0213 count. Rows at 0339 and later are out. Ladders covered: Fool (Seer, Clown), Visionary (Spectator, Telepathist), Sun (Bard, Light Supplicant). One further ladder has full formulas stated inside volume 1 at locator 0202; its rows are held in the private file and not named here until the director rules (Q1). Ruled 2026-11-09: Weibao said "definitely", and that sealing gates play and not development (he has read the whole series), so this sheet may name that ladder and later ones. The rows have not been added yet. A private skeleton for all 23 brewable rows is in `docs/research/novels/lord-of-mysteries/private/world-axes-2026-11-09/FULL_TABLE.md` (gitignored; 123 ingredient lines, rule-derived and not reasoned row by row). Other brewing code in the repo belongs to later books and is not covered.

**Basis labels in the ingredient tables.** Each non-zero value carries one: **(C)** a source row states it for this ingredient; **(R)** a category or recipe rule in the source implies it (for example, a recipe's product effect belongs to the recipe's ingredient set, or principal materials carry the potion's spirituality), with the split and level assumed; **(B)** borrowed from real-world knowledge, a sibling recipe, or the wiki-tagged rows (W); **(A)** assumed. The level of every value is assumed unless a note says a source number pins it. A blank cell means unset, which the engine reads as zero; it is not a claim that the ingredient lacks the property.

**Test method.** I defined each proposed catalogue and law with the real `defineCatalogue`, `defineCraftLaw` and `resolveBatch` in a scratch harness outside the repo and ran the cases quoted below. Results are runs of the proposal on today's engine, not of any shipped content. The harness is not committed.

## 1. Hogwarts (book one)

### 1.1 Mode

Process and preparation are open. Ingredient identity is tight, and the book treats names as labels for one thing, not as separate things. Effects are the taught potions; invention is untested in book one.

- **Process is open** (shown): the Cure for Boils fails when the quills go in while the cauldron is still on the fire (c8 p53, p54; the extraction row labels the timing inference). Snape gives an order for the Draught of Living Death: powdered asphodel root added to an infusion of wormwood (stated, c8 p51).
- **Preparation is open** (shown): every Cure ingredient is named with a form: weigh dried nettles, crush snake fangs, stew horned slugs (c8 p53). The Draught names a powdered root and an infusion (c8 p51).
- **Identity is tight, names are not** (stated, c8 p51): monkshood and wolfsbane are one plant, also called aconite. So the sheet keys values to the thing and lists names as aliases.
- **New effects are rare** (inference, no book-one evidence either way): no student in book one invents a potion. Snape's claim that he teaches students to bottle fame and stopper death (c8 p35, stated) says the range of effects is wide, not that students may invent. Default: rare invention, through off-book mixes that resolve by the same law. Dial: how often a mix lands on a named effect.
- **The starting-point mode held.** One edit: ingredient substitution has no book-one evidence at all, so it stays closed by default. The off-book space is quantities, forms, order and mixing, not stand-ins.
- **Resolution reads concentration** (`dose` mode in the existing law): more water or more bulk dilutes the flask. This is the reverse of the LOTM law below.

### 1.2 Axis set (6)

| Axis | In the world's terms | Player sees by default | Replaces | Reproduces |
|---|---|---|---|---|
| `mend` | Clears or repairs an ailment of the body. | The effect name on the board. Strength is learned by trying. | `cure` | Cure for Boils (shown, c8 p53) |
| `calm` | Slows and dulls the drinker toward sleep. | The effect name from the lesson. Strength is learned. | none (new) | Draught of Living Death is "so powerful it gets the name" (stated, c8 p51) |
| `bite` | A sharp irritant that turns on the cure when hot. A heat-reactive tag rides with it. | Hidden. Learned after a mistake or a reading. | `sting` | The quills error (shown c8 p53; timing inference c8 p54) |
| `venom` | Harms the body when swallowed. | Hidden. Learned. | none (new) | Monkshood and wolfsbane as one plant (stated c8 p51; the poison part is borrowed) |
| `ward` | Counters poison. | The lesson names it. Strength is learned. | none (new) | Bezoar counters most poisons (stated c8 p51) |
| `burn` | Green burn: matter eaten through and skin raised in boils. A product axis; no ingredient carries it. | Seen on failure. | `acid` | Cauldron melts, spill burns and boils (shown c8 p53) |

One axis feeds two effects by route. The failed Cure outputs `burn` on a contact route as corrosion (pewter) and on a skin route as boils. Today's law outputs corrosion alone (code comment says "burns through the cauldron"), so the boils half of the canon failure is missing. Adding the skin route is a law row, not a new axis.

Axes considered and left out: `muddle` (mind-clouding, for the Forgetfulness exam brew, c16 p2, shown by name alone, with no ingredient known) and `fireproof` (the passage draughts in the bottle puzzle, c16, which are riddle items and not brewed). Add them when a brew needs them.

### 1.3 Ingredient values

Level words map to the numbers in brackets (per portion, out of 1000; the numbers for the first four are today's authored values in `hp_lead_making.js`, kept so the canon point does not move): trace 100, some 250, strong 500.

| Ingredient (aliases) and form | mend | calm | bite | venom | ward | Identity and form basis |
|---|---|---|---|---|---|---|
| Dried nettles | some, 300 (R) | | | | | Name and dried form shown, c8 p53 |
| Crushed snake fangs | some, 250 (R) | | | | | Name and crushed form shown, c8 p53 |
| Stewed horned slugs | some, 200 (R) | | | | | Name and stewed form shown, c8 p53 |
| Porcupine quills | | | strong, 500 (A) | | | Name shown c8 p54. Heat-reactive tag assumed. |
| Powdered root of asphodel | | some, 250 (R) | | | | Name and form stated, c8 p51 |
| Infusion of wormwood | | some, 250 (R) | | | | Name and form stated, c8 p51 |
| Monkshood (wolfsbane, aconite) | | | | strong, 500 (B) | | One plant, three names, stated c8 p51. Toxicity is real-world. |
| Bezoar | | | | | strong, 500 (C) | Goat's-stomach stone, stated c8 p51. Presence stated; level assumed. |

Carry no values (unset, a defaulted gap): powdered lionfish spine (shown, c12 p5, a measured class ingredient with no stated purpose); beetle eyes, dragon liver and silver unicorn horn (stated apothecary stock with prices, c5 p106 and p190); nettle wine from the bottle riddle (c16 p252). They stay as catalogue entries so a mix that includes them resolves and does nothing, and so they are not a free substitute for anything.

**Preparation states.** Form is part of identity: whole, dried, crushed, powdered, stewed and infused are separate material variants of one ingredient family, as the code already does with `preparation.*` tags. The canon forms above carry the listed values. Proposed rule for the other forms (inference, from the audit's extraction idea P4): a coarser or raw form carries the same axes at about half strength, and a form the recipe does not name is a deviation, not a refusal (MR6). Real-world nettles lose their sting when dried or cooked (borrowed), which is why dried nettles carry no `bite`; fresh nettles would carry trace `bite`, and whether that reacts in a hot pot is open (Q4).

**Counts for this table:** (C) 1, (R) 5, (B) 1, (A) 1 = 8. No value is canon on level.

### 1.4 Canon points

| Point | Ingredients | Steps | Stated near miss or failure | Reproduced? |
|---|---|---|---|---|
| **Cure for Boils** (shown, c8 p53 to p54; 60 minutes) | Dried nettles, crushed snake fangs, stewed horned slugs, porcupine quills. Amounts are not stated; the code uses 2/1/1/1 (code comment: authored). | Simmer, take the cauldron off the fire, add the quills. | Quills on the fire: the cauldron melts, the potion spills, burns and boils spread (shown). The "acid green" colour is a code comment. | Yes, both. Run: canon gives `boil_cure` 21, no burn, quills' `bite` left inert. Quills early gives `boil_cure` 11, corrosion 20, boils 20 (the cure is consumed by the burn). Same numbers as today's law, so the slice changes no canon result. |
| **Draught of Living Death** (stated, c8 p51) | Powdered root of asphodel, infusion of wormwood. Amounts and time are not given. | Add the powder to the infusion. | None stated. | Effect yes: both together give `calm` 500 and `sleep` 25 on a 2-portion batch. The stated order has no consequence in the axes, so it is recorded and not modelled. |
| **Bezoar** (stated, c8 p51) | One stone. | Swallowed, not brewed. | "Most poisons" has no kinds on one `venom` axis. | In part. `ward` removes `venom` 1:1 in a brew. The "most, not all" limit needs a kind tag; open (Q8). |

### 1.5 Off-book mixes (runs on today's engine)

- **Cure plus Draught, off the fire.** Nettles, fangs, slugs, asphodel and wormwood, quills added cool. Result: `boil_cure` 15 and `sleep` 7, no burn. Both effects coexist and dilute each other (the audit's P4 rule that coexisting constituents keep independent effects). A cure that also makes you drowsy. Not empty, not absurd.
- **Quills early into a thin cure.** Fangs, slugs and quills, quills hot. Result: no `mend` left, `burn` 900, corrosion 30 and boils 30. The burn consumes at most the cure present, so a thinner cure leaves no cure and a little unused `bite`. Conservation holds.
- **Monkshood with bezoar.** One of each gives a harmless inert brew. Two monkshood to one bezoar leaves `venom` 500 and `poison` 16: half the bite of the poison, not none. A draught of the Draught with hot quills makes no `burn` at all, because the burn needs `mend` to consume; the quills' `bite` just stays in the flask.

### 1.6 Checks for a runtime slice, and open questions

Checks (MR34, MR35, atlas LAYX48; each one test file per world law, not per recipe):

1. The exact point reproduces: nettles, fangs, slugs, quills off the fire give the cure product (MR35 case one). Quills hot give the burn product with both routes (case two, near miss). A free mix of unrelated ingredients resolves to some outcome and not "invalid" (case three, MR6).
2. Neighbours are banded: a little less or more of one cure ingredient changes `boil_cure` smoothly; a swap of nettles for fangs stays a cure.
3. Conservation: the engine's mass check holds; the burn reaction consumes `mend` and `bite` and nothing else.
4. More `mend` active gives more effect until the flask saturates (the existing dose law).
5. Order anchor: no generated brew beats the Draught's `calm` at lower cost without a stated reason. Within this world and book it has one rung, so this check has nothing to compare until a second exists.
6. The projection shows no truth the observer lacks: axis values stay hidden unless learned (MR31), and the board names steps and effects but not which mistake costs what (as the existing board note does).
7. Determinism after save, reload and Import is reachable once generated ingredients exist; until then the canon batch is the golden snapshot.
8. Sealing: fixtures and strings in this slice name nothing past book one.

Engine notes for the slice (inference from the runs):

- **G1.** Ingredients cannot carry their own add-step. A reaction such as "bite burns the cure after a hot add" acts on every `bite` in the batch, so the quills cannot share a batch with a simmer-time sting rule. The existing law dodges this with separate ops (`add_quills_hot`, `add_quills_cool`). A world law that has a general "hot sting" rule needs an `at` step on each input.
- **G2.** Product effects are read with the real route fields, so the skin-route boils effect is available now.

Open questions (default, dial, reason):

- **Q4. Does hot fresh-nettle sting burn the cure?** Default: no; dried nettles are the canon form and fresh nettles are not in book one. Dial: fresh nettles carry trace `bite` and react in a hot pot (needs G1). Reason: the real-world borrowing says cooking removes the sting, so the default is also the safe reading.
- **Q5. Should unlisted shop stock (beetle eyes, dragon liver, silver unicorn horn, lionfish spine) gain borrowed values?** Default: unset, so they resolve as inert filler. Dial: add borrowed values per ingredient when a brew needs it. Reason: book one names them with no effect, and a value would be invention presented as a sheet.
- **Q8. Poison kinds.** Default: one `venom` axis and `ward` clears it fully. Dial: a kind tag so a bezoar clears "most" and leaves the rest. Reason: the stated limit is "most poisons".
- **Q6. Show or hide axis values by default.** Default: hidden, learned by trial, reading or a witnessed result, matching the existing board. Dial: a world setting that shows `mend` and `calm` strength on the label. Reason: MR31 and the first-year setting, where students learn from Snape's questions and mistakes.

## 2. Lord of the Mysteries (volume 1, lowest two rungs per ladder)

### 2.1 Mode

The main ingredient sets the effect. The open space is substitutes within a rung, dose precision on the principals, and risk. The process is a fixed listed order and a stir.

- **Main ingredients set the effect** (shown, `0142`, `0214`, R003-C11; B1.1): a formula lists principal materials, which are parts of supernatural creatures, plants or crystals, or a same-pathway characteristic.
- **Substitutes are real and narrow** (shown, `0142`): a church file names alternate principals for one rung (Bard and Light Supplicant rows below), and a same-pathway characteristic can stand in as the main material at its own rung (B1.4, shown `0142`, `0214`; stated `0221`, "a potion without auxiliaries"). No source row shows a free swap of an auxiliary.
- **Aux tolerate variation, principals do not** (stated, Neil, R004-C13; A2.1, B1.5): the two principals are measured exactly. Shortage may fail advancement; excess may cause mental injury or death (stated as cautions, "not failures enacted here", A6.1).
- **Process is fixed** (stated, A2.1, A5.1): add in the listed order and stir; no special flame, ceremony or spell at the low rungs. Brew times are missing (A4.2). So process is not an open dimension here.
- **Resolution reads totals** (`total` mode in the existing law, per the code comment "totals, not concentrations"): dilution does not change the product. Units are each ingredient's own (ml, g, drops, count).
- **The starting-point mode held,** with two corrections. The substitution space is "same-rung alternates and the same-pathway characteristic", not general stand-ins. And "risk" is directional: the notes give a direction for each principal but no figure, so the figures below are assumed.

**A conflict in the repo, flagged.** The Seer brew's code comment says slightly less is tolerated and slightly more can mean mental damage or death. The brewing owner (`BREWING_AND_HIGHER_SEQUENCES.md` A6.1) says shortage may fail advancement and excess may harm, for the principals as a pair. I could not settle which from the rows. The proposed law reads both: see Q2.

### 2.2 Axis set (6)

| Axis | In the world's terms | Player sees by default | Replaces | Reproduces |
|---|---|---|---|---|
| `spirit` | Lingering raw spirituality in the material. The power and the risk. | Hidden. Learned by divination, assay or a witnessed result. | `charge` | "Material spirituality that lingers is both key to brewing and a root of loss of control" (stated, `0033`); blood and fluid principals (shown, R004-C13) |
| `bind` | What settles raw spirituality into the shape of a power. Crystals and solid organs. | Hidden. Learned. | `binding` | The horn crystal collapses the noise into a clear liquid (shown, `0170`, R018-C28); the Seer's cohesive deep blue (shown, A2.4); the crystal in the Seer brew (code comment, authored) |
| `harsh` | A toxic or irritant aux. Tolerated in small measure, harmful in bulk. | Hidden. Learned by trial. | none (new) | Aux "tolerate variation" (stated) but not without limit (inference); named toxic plants (borrowed) |
| `power` | The drinkable Beyonder potency, read as a share of the rung's canon point. Product axis. | Seen as the potion's name and effect. | `seer` | The potion's effect per rung |
| `echo` | Spill-over after drinking that must be digested: whispers, skewed perception. Product axis. | Seen after the first drink. | none (new) | Seer whispers and the urge to destroy (shown, `0032`); Spectator emotional involvement skews perception (stated, `0035`) |
| `strain` | Harm to the drinker's mind or body from a wrong brew. Product axis. | Seen as the failure result. | `charge` read as madness | Excess may cause mental injury or death (stated, A6.1); wrong pathway can kill the spirit or cause madness (stated, `0018`) |

Light-sensitivity is a hidden tag, not an axis (the existing `function.*` tags do this): the Seer's octopus blood decomposes in sunlight, so it is stored opaque (shown, A2.4). The pathway of a principal is also a hidden tag, `pathway.fool`, `pathway.visionary`, `pathway.sun`.

Axes considered and left out: `tune` (what aux do to the potion; no source says, so a value would be invention); `grade` or a tier scalar (a rung's rank is carried by a tier tag on the principals and by the potion's Sequence, so that one axis does not have to compare rungs of different pathways).

### 2.3 Ingredient values

Scale (assumed dial): the catalogue basis is 10000, and every in-scope canon point balances at 5000 `spirit` and 5000 `bind`. A value is per the ingredient's own measure unit, pinned so the stated amounts balance. Rung rank is not in the axis totals (see 2.2). Level words: none 0, trace under 2 percent of a point's total, some 2 to 10, strong 10 or more. Aux with no listed value are unset and carry nothing: purified water, night-vanilla juice, golden mint leaves, dragonblood grass powder, ox-tooth peony powder, elf flowers, pure-white elf flowers, chestnut buds, midsummer grass, July-wine juice, elf dark leaf, gold-edge sunflower, sunflower powder. This reproduces "aux tolerate variation" by making them interchangeable and says plainly that no source gives them effects. The dragonblood grass powder in the Seer and Telepathist formulas has one value (unset) in both, so it is one ingredient on one sheet.

| Ingredient (name in rows; alias) | Stated amount (row, basis) | spirit | bind | harsh | Basis and locator |
|---|---|---|---|---|---|
| Lavatan octopus blood (code: Lavos Squid blood) | 10 ml (W game guide, medium) | 500 per ml (R) | | | Principal, shown `0031`. Amount is wiki-tagged. Light-sensitive tag shown (A2.4). |
| Star crystal | 50 g (W game guide, medium) | | 100 per g (B) | | Principal, shown `0031`. Role borrowed from the Clown crystal's shown function. |
| Poison hemlock juice | not in the rows (code comment: 3 drops) | | | 40 per drop (B) | Aux, shown `0031`. Toxicity is real-world. |
| Seer characteristic (alternative principal) | 20 units of the point's total (A) | 250 each (R) | 250 each (R) | | Same-pathway characteristic stands in, shown `0142`, `0214`, stated `0221`. |
| Adult Manhar-fish eyes | a pair (stated, Alger `0034`) | | 5005 per pair (A) | | Principal. Which principal carries which axis is assumed. |
| Horn-black-fish blood | 35 ml (stated, `0034`) | 143 per ml (B) | | | Principal. Blood-as-spirit borrowed from the Seer brew. |
| Meadow-saffron essence | 5 drops (stated, `0034`) | | | 30 per drop (B) | Aux. Meadow saffron is a toxic plant (real-world). |
| Adult rainbow-lizard dragon pituitary, complete | not stated (one lot, shown `0157`) | | 5000 per lot (A) | | Principal. Role assumed. |
| Farsman rabbit spinal fluid | 10 ml (shown, `0157`) | 500 per ml (B) | | | Principal. Fluid-as-spirit borrowed from the Seer brew. |
| Adult Honagis grey-goat horn crystal | not stated; partial formula | | 5000 per lot (C) | | Principal. The crystal's collapsing function is shown, `0170`, R018-C28. |
| Intact human-face rose | not stated | 5000 per lot (R) | | | Principal. The rose causes the laughter (shown, A2.2), so it is the effect's source. |
| Mandrake juice | 5 drops (A2.2, shown) | | | 30 per drop (B) | Aux. Real-world toxic root. |
| Crystal sunflower | not stated (one lot, shown `0146`, `0142`) | 5000 per lot (R) | 5000 per lot (R) | | One principal carries both. |
| Fire-stone-bird or arson-bird tail feather (alternate) | one lot | 5000 per lot (R) | 5000 per lot (R) | | Alternate listed on the church row, shown `0142`. |
| Siren stone (alternate) | one lot | 5000 per lot (R) | 5000 per lot (R) | | Alternate, shown `0142`. |
| Singing mallow (alternate) | one lot | 5000 per lot (R) | 5000 per lot (R) | | Alternate, shown `0142`. |
| Radiant stone | not stated (one lot, shown `0142`) | 5000 per lot (R) | 5000 per lot (R) | | One principal carries both. |
| White-hot soul powder (alternate) | one lot | 5000 per lot (R) | 5000 per lot (R) | | Alternate, shown `0142`. |
| Mirror-hedgehog blood (alternate) | one lot | 5000 per lot (R) | 5000 per lot (R) | | Alternate, shown `0142`. |
| Lava-troll heart (alternate) | one lot | 5000 per lot (R) | 5000 per lot (R) | | Alternate, shown `0142`. |
| Aconite juice | 3 drops (shown, `0142`) | | | 60 per drop (B) | Aux. Toxic plant (real-world, and book-one Hogwarts names it as one plant). |

Pairing rule for the principals (inference): in the Seer and Clown formulas a fluid or organ principal pairs with a crystal, and shown evidence for the Clown says the crystal binds what the rose raises. I generalise "fluid or organ gives `spirit`, solid gives `bind`" to the Spectator and Telepathist rows, and call that assumed for them. Single-principal rungs (Bard, Light Supplicant) carry both on one material, which is the characteristic reading.

**Counts for this table:** (C) 1, (R) 20, (B) 7, (A) 3 = 31. Bind or spirit on a specific non-Seer principal is assumed or borrowed, not canon on level; the one pinned ratio, 10 ml to 50 g, is wiki-tagged (borrowed).

### 2.4 Canon points

All points balance at the stated amounts and run on one law (`spirit` 5 and `bind` 5 give `power` 9 and `echo` 1; leftover `spirit` becomes `strain` fully; leftover `bind` becomes `strain` at half rate; `harsh` becomes `strain` in steps of 250; `strain` reads at 2 per 1000). Those rates are assumed.

| Point (rung) | Principals and stated aux | Near miss or stated failure | Reproduced? (run) |
|---|---|---|---|
| **Seer** (Fool 9, shown `0031`) | Lavatan octopus blood 10 ml and star crystal 50 g (W). Aux names shown; their amounts (about 100 ml water, 13 drops night vanilla, 7 gold mint leaves, 3 drops hemlock, 9 g dragonblood grass) are code comment alone, because the rows hold null for them. | Principal shortage may fail advancement, excess may harm (stated cautions, A6.1). The code comment's 48 g is "slightly under". Whispers on drinking (shown `0032`). | Exact: `power` 9, `echo` 1, no `strain`. 48 g: `power` 8, `strain` stays under a unit, tolerated. 45 g: `power` 8, `strain` 1. 40 g: `power` 7, `strain` 2. Blood 11 ml: `power` 9, `strain` 1. Blood 9 ml: `power` 8, no `strain`. Crystal 55 g: none; 60 g: `strain` 1; 100 g: `strain` 5. Characteristic alone: identical to the point. Hemlock 30 drops: `strain` 2; 3 drops none. |
| **Clown** (Fool 8, shown `0170`; row is inspect-alone) | Grey-goat horn crystal and human-face rose; aux partly stated (80 ml water, 5 drops mandrake juice, 7 g sunflower powder, more; A2.2). | None stated. | Partial point: the stated pieces balance to `power` 9, `echo` 1. The rest of the formula is a gap. |
| **Spectator** (Visionary 9, stated `0034`) | Manhar-fish eyes (a pair), horn-black-fish blood 35 ml, water 80 ml, meadow-saffron essence 5 drops, ox-tooth peony powder 13 g, 7 elf flowers. | Emotional involvement skews perception (stated `0035`). | Exact: `power` 9, `echo` 1. Blood 40 ml: `strain` 1. The `echo` effect would read as perception skew, a per-pathway output label. |
| **Telepathist** (Visionary 8, shown `0157`) | Rainbow-lizard dragon pituitary, rabbit spinal fluid 10 ml, chestnut buds 5 g, dragonblood grass powder 8 g, 3 pure-white elf flowers, pure water 100 ml. | None stated. | Exact: `power` 9, `echo` 1. |
| **Bard** (Sun 9, shown `0146`, `0142`) | One crystal sunflower or an alternate (feather, siren stone, singing mallow), midsummer grass, 5 drops July-wine juice, elf dark leaf. | None stated. | Exact: `power` 9, `echo` 1; every alternate lands on the same point by construction. |
| **Light Supplicant** (Sun 8, shown `0142`) | One radiant stone or an alternate (white-hot soul powder, mirror-hedgehog blood, lava-troll heart), gold-edge sunflower, 3 drops aconite juice. | None stated. | Exact with the stone and with the heart: `power` 9, `echo` 1, `harsh` 180 under the band. |

Named gap: Corpse Collector (a dried black-spotted frog, stated `0033`, main material alone) is not a full formula and has no point. The Seer's aux amounts above need a locator before the Seer point carries them as canon.

### 2.5 Off-book mixes (runs on today's engine, with two marked as gaps)

- **A same-pathway characteristic instead of blood and crystal.** One characteristic carrying both axes gives the same potion as Neil's brew, with no aux (the "potion without auxiliaries" reading). The imprint risk and cost are not in the axes; they live in price and supply (inference).
- **Aux abuse.** Replacing 3 drops of hemlock juice with 30 drops gives the same `power` and `strain` 2. Swapping gold mint for another plant changes nothing. So aux are loose in kind and bounded in bulk.
- **Cross-recipe: Seer blood with the Telepathist's pituitary.** Today's engine returns a clean `power` 9, because pathway is not visible to the law. Canon says a wrong-pathway potion can kill the spirit or cause madness (stated `0018`), so the proposed law should return heavy `strain`. This is the clearest case the shared axes make possible, and it needs engine note G3.
- **Overdose of a balanced single principal.** Four crystal sunflowers give `power` 36 and no `strain`. The notes say excess harms, so the law needs a cap (G2).

### 2.6 Checks for a runtime slice, and open questions

Checks (MR34, MR35, LAYX48), one test file for the world law:

1. Each canon point reproduces to its stated `power` and `echo` (MR35 case one). Each stated caution gives its direction: shortage lowers `power`, excess raises `strain` (case two). A free mix resolves to an outcome (case three).
2. Alternates land on the same point as the principal they replace (Bard, Light Supplicant), and the same-pathway characteristic matches the Seer point.
3. Aux swap invariance: replacing an unset aux with another unset aux leaves the outputs equal. The product id will differ, as inputs are part of identity.
4. Neighbours are banded: a change of a few percent in a principal changes `power` and `strain` smoothly, and `strain` stays under one unit inside the tolerance (quantised by the unit).
5. Conservation: every reaction conserves the total (the engine's mass check), and `strain` is the declared byproduct of unbound or excess material.
6. Saturation: more balanced principal gives more `power` until the rung cap (G2); past the cap the excess goes to `strain`.
7. Order anchor: within a ladder, the Clown point does not cost less than the Seer point, and nothing generated beats a higher rung at lower cost. Across ladders no claim is made.
8. The projection shows no hidden axis value until the observer learns it (MR31).
9. Same outputs after save, reload and Import; the canon batch is the golden snapshot until generated ingredients exist (MR34).
10. Sealing: fixtures and strings name no rung beyond the two per ladder above.

Engine notes (inference from the runs):

- **G2.** The engine has no cap on a product axis and no absolute per-principal band, so "slightly less is tolerated, excess harms" must be built from the ratio and quantisation. A cap at 120 percent of the canon point (the existing `DOSE_MARGIN_PERCENT`) is the default; it needs a law field.
- **G3.** The pathway clash needs a check on input tags (more than one pathway tag among the `spirit` carriers), or one axis per pathway. A tag check is far smaller than 22 axes.
- **G5.** Mixed units in `total` mode work today (each ingredient's own unit), but the same amount in two units cannot be compared; amounts stay as the formula states them.

Open questions (default, dial, reason):

- **Q1. Which rows are in volume 1.** Default: Chinese chapters 1 to 213, rows with locator at most 0213, three ladders in the public file; the ladder stated at `0202` is private. Dial: the director rules on that ladder's two rungs. Reason: the repo's plan gives the chapter span, and the row locators' numbering is my reading.
- **Q2. Direction of tolerance.** Default: asymmetric. Unbound `spirit` is full harm, excess `bind` is half harm, so excess blood harms most, short blood mostly weakens, and excess crystal harms less. Dial: the half rate, from 0 (blood-alone reading, as the code comment's law has it) to 1 (symmetric). Reason: the two repo statements disagree and no row settles it.
- **Q3. Rung scale.** Default: every in-scope point balances at 5000 and rank lives in tier tags. Dial: scale totals by rung so `power` itself orders rungs. Reason: a single main carries at most the basis, so totals cannot grow with rung without a larger basis.
- **Q7. Show or hide.** Default: `power` and the effect show; `spirit`, `bind` and `harsh` are learned; `echo` and `strain` show after drinking. Dial: a Spirit Vision or assay route that reveals one axis. Reason: MR31, and the notes treat divination as the way to read such things.
- **Q9. Aux effects.** Default: aux carry no `spirit` or `bind`, `harsh` alone where a toxic plant is named. Dial: add a `tune` axis if a later source shows aux changing the product. Reason: no row says what aux do.

### 2.7 All 23 brewable rows, every ladder (added 2026-11-09)

Weibao ruled that this sheet may name further ladders and that sealing gates play, not development. The table lists every brewable row in `src/lotm_formula_rows.js`, generated by script from the private skeleton (`FULL_TABLE.md`). It is a first pass built from fixed rules and was not reasoned row by row: principals carry `spirit` and `bind`, an auxiliary that is a known poison carries `harsh`, and every other auxiliary is unset. Sections 2.2 to 2.5 stay the reasoned part (six rows, three ladders).

| Ladder | Rung | Name | Principal ingredients (stated amount) | Auxiliaries | Harsh auxiliaries | Evidence in the formula row |
| --- | --- | --- | --- | --- | --- | --- |
| Fool | 9 | Seer | Lavatan octopus blood (10 ml); Star crystal (50 g) | 5 | Poison hemlock juice | Potion table row Fool.9; source: Nighthawks issue it; Old Neil brews; note: whispers and urge to destroy right after drinking |
| Fool | 7 | Magician | True Mist Treant rhizome (1); Spinal fluid of an evil-stripe black panther (all) | 4 | Hallucination-herb oil | Potion table row Fool.7; source: via killed agent |
| Fool | 6 | Faceless | Mutated pituitary of a thousand-face hunter (not stated (one lot assumed)); Skin-shadow characteristic (not stated (one lot assumed)) | 4 | Black mandrake juice | Potion table row Fool.6; note: lose self and become a monster |
| Fool | 5 | Marionettist | Dust of an ancient wraith (not stated (one lot assumed)); Core crystal of a six-winged gargoyle (not stated (one lot assumed)) | 4 | none | Potion table row Fool.5; note: contaminated characteristic poisoned a user |
| Fool | 4 | Bizarro Sorcerer | Eye of a trick-evil-monster (not stated (one lot assumed)); True soul body of a spirit-world plunderer (not stated (one lot assumed)) | 5 | none | Potion table row Fool.4; note: six Fool-line abilities fuse here |
| Fool | 3 | Scholar of Yore | Eyes of a Fugen hound (not stated (one lot assumed)); Flocculated heart of a mist-wolf (not stated (one lot assumed)) | 3 | none | Potion table row Fool.3 |
| Fool | 2 | Miracle Invoker | Heart of the Black Wolf of Wishes (a god) (not stated (one lot assumed)) | 3 | none | Potion table row Fool.2; note: Zarathustra lost control at Seq 1 promotion [T 0733] |
| Fool | 1 | Attendant of Mysteries | Attendant characteristic (1) | 1 | none | Potion table row Fool.1; note: only 3 Attendant characteristics exist |
| Fool | 0 | Fool | Fool uniqueness (not stated (one lot assumed)); Attendant characteristic (2) | 1 | none | Potion table row Fool.0 |
| Door | 8 | Trickmaster | Spirit-eater stomach (not stated (one lot assumed)); Deep-sea marlin blood (20 ml) | 4 | none | Potion table row Door.8; source: Tarot Club |
| Visionary | 9 | Spectator | Adult Manhar-fish eyes (pair); Horn-black-fish blood (35 ml) | 4 | Meadow-saffron essence | Potion table row Visionary.9; source: Alger asked 100 ml ghost shark blood as fee; note: emotional involvement skews perception |
| Visionary | 8 | Telepathist | Complete pituitary of an adult rainbow-lizard dragon (not stated (one lot assumed)); Farsman rabbit spinal fluid (10 ml) | 4 | none | Potion table row Visionary.8 |
| Visionary | 4 | Manipulator | Whole brain of an old mind dragon (not stated (one lot assumed)) | 3 | none | Potion table row Visionary.4 |
| Sun | 9 | Bard | Crystal sunflower (not stated (one lot assumed)) | 3 | none | Potion table row Sun.9; source: Alger could source Seq 9 |
| Sun | 8 | Light Supplicant | Radiant stone (not stated (one lot assumed)) | 2 | Aconite juice | Potion table row Sun.8 |
| Sun | 7 | Solar High Priest | Red crown of a dawn rooster (not stated (one lot assumed)); Fruit of a radiant covenant tree (not stated (one lot assumed)) | 4 | none | Potion table row Sun.7 |
| Sun | 6 | Notary | Crystal rhizome of an Elder Tree (not stated (one lot assumed)); Tail feathers of a covenant bird (5) | 4 | none | Potion table row Sun.6; note: Elder Tree also in Spectator 7 (I 0706) |
| Sun | 5 | Priest of Light | Red crown of the dawn rooster king (not stated (one lot assumed)); Pure-white radiant stone (1) | 4 | none | Potion table row Sun.5; note: Klein: demigod formulas are issued with the rite (I 0706) |
| Sun | 4 | Unshadowed | One drop of Sun god blood (1 drop) | 4 | none | Potion table row Sun.4; source: church supplies directly; Klein sold a partial formula |
| Demoness | 7 | Witch | Whole blood of a black-abyss fish (not stated (one lot assumed)); Peacock-agate egg (not stated (one lot assumed)) | 4 | Golden mandrake juice, Narcissus juice | Potion table row Demoness.7; source: Witch Cult supplies; note: gender switch (men become women) is a body effect, not a rite |
| Demoness | 6 | Pleasure Witch | Pair of succubus-siren eyes (pair); Adult widow-spider silk gland (1) | 5 | Black mandrake juice | Potion table row Demoness.6 |
| Black Emperor | 8 | Barbarian | Mad-grass plant (1); Earth-rhino solid horn crystal (1) | 4 | none | Potion table row Black Emperor.8; source: formula as currency |
| Black Emperor | 7 | Briber | Weeping-baby flower (1); Odd-face cannabis crystal (1) | 4 | Golden mandrake juice, Black mandrake juice, Hallucination-herb oil | Potion table row Black Emperor.7 |

What the table already shows about the property set (inference, nothing fitted yet):

- **Six rows have one principal** (Bard, Light Supplicant, Unshadowed, Manipulator, Miracle Invoker, Attendant of Mysteries). The two-principal reading of `spirit` and `bind` has to let one ingredient carry both, which section 2.2 allows but only tested on the Sun rows.
- **Fifteen rows state no amount for at least one principal.** A dose point there is assumed, so those rows can test presence and order but not tolerance.
- **Upper rungs take a characteristic, a uniqueness or divine blood** as the principal. These are singular things with custody and a rite, closer to MR41 and the advancement rules than to a bench recipe. Default: rungs 4 and above bind to the advancement procedure and use the bench only for the mixing step.
- **Harsh auxiliaries repeat across ladders** (black mandrake juice in three ladders; golden mandrake juice and hallucination-herb oil in two each), which is the first evidence for world-level properties over per-recipe ones (MR37).

## 3. Counts and next steps

Basis counts, computed by script over the two ingredient tables (cells marked (C), (R), (B), (A)):

- Hogwarts: (C) 1, (R) 5, (B) 1, (A) 1 = 8.
- LOTM: (C) 1, (R) 20, (B) 7, (A) 3 = 31.
- Both: (C) 2, (R) 25, (B) 8, (A) 4 = 39.

Next, if accepted: LAYX51 (Harry's bench) adopts section 1 with G1 solved or avoided; LAYX52 (Klein's bench) adopts the Seer point from section 2 with G2 and Q2 settled. Neither slice is dispatched by this file. In play, which rungs a character can see follows what that character knows (LAYX82); the earlier line here that a string naming an out-of-scope rung breaks sealing was withdrawn on 2026-11-09 after Weibao's ruling.
