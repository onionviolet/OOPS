# Gu grammar of parts, proposal for chat P, 2026-11-12

From chat G. A proposal under AD56 (it widens play) for P's shared grammar contract ([plan](../../../PROCEDURAL_FOUNDATION_PLAN.md#the-procedural-system-how-new-things-come-to-exist), PFP16-PFP20, P2 and P5). Codes GG1 onward. The data behind it is the `parts` row on every kind in [`src/gu_catalogue.js`](../../../../src/gu_catalogue.js), 78 chapter-checked kinds, enforced by [`tests/gu_catalogue.test.js`](../../../../tests/gu_catalogue.test.js).

## The parts

| Code | Part | Values today | Source layer | Default and dial |
| --- | --- | --- | --- | --- |
| GG1 | **Path** | Chapter-stated on 6 kinds (fire, heaven, light, rule, luck, information; lightning and light also authored on ability rows). Wiki path labels on 50 of 78 | chapter wins; wiki is a tentative candidate list | A generated Gu draws a path from the place and inventor (PFP19), weighted by the corpus table below. Dial: per-world path list |
| GG2 | **Function** (effect family) | 22 families: attack, guard, conceal, sense, move, fly, travel, heal, convert-essence, produce, record, strength, amplify, economize, restore, stabilize, mind, suppress, formation, time, illuminate, steal. Null on 21 kinds whose scenes show no standalone effect | authored reading of chapter scenes | Each function names the resolver that can run it (activation effect kind, conversion, propagation). A function with no resolver is a backlog row, not a generated default |
| GG3 | **Role in a working** | 14 roles: core, support, ingredient, product, producer, converter, consumable, vital, hosted, wild, loaned, emergent, formation, substitute | chapter scenes | A kind can hold several. Core and support are move roles (K method roles); ingredient and product are refinement lineage; producer, emergent, hosted and wild are L lifecycle states |
| GG4 | **Rank** | Chapter-backed ranks on 48 of 78 kinds, ranks 1 to 9; open on the rest | chapter; wiki labels kept apart | Rank sets fuel family (GG5) and the Immortal threshold, both as law. Rank change is R's path-step rule on a G row |
| GG5 | **Fuel** | primeval with stage factors (initial, middle, upper) on ability rows; immortal on 5 parts rows; mental on Attitude | chapter for family; amounts authored | Fuel is a W quantity read by activation, never a number on the kind alone (see the quantity draft) |
| GG6 | **Dao marks** | Thin: 4 parts rows carry a chapter pointer (passenger load ch1769, consumed for marks ch1570, carrier choice ch2280, destructive marks removed ch1795); GKM240 and GKM246 are paper cases | chapter pointers only | Marks are law fields (PFP14) on bodies, apertures, places and Gu, counted by path. Proposal only until a second scene calibrates an amount |
| GG7 | **Lineage** | Recipe rows: Four Flavors, Seven Fragrances, Nine Eyes, Stealth Scales, Scale Armor; parts lineage on White Jade, Moon Scar, Landscape as Before, Charging Crash, Myriad Self | chapter inputs; stage inputs partly authored | A product records its inputs (`recordLineage`). Generated recipes reuse the refinement leaf unchanged |
| GG8 | **Host and origin** | hosted (wolf, beast), wild, emergent (habitat), producer and product | chapter | Belongs to L's lifecycle; G supplies the row, L runs the body |

## Combination rules the canon already shows

- **GG9 · Support matches core by kind or path.** The existing modifier `{property, factor, kind | path}` (Little Light on Moonlight by kind; Light Source on any light-path Gu). A repeated support adds nothing (ch70, ch106).
- **GG10 · Fusion keeps some parts and changes others.** Moonlight plus Stone Scar keeps force and doubles reach (ch106). Stealth Rock plus Fish Scale widens the masked surfaces (ch121-127). Two Liquor Worms plus additives raise rank and the essence grade converted (ch105, 326).
- **GG11 · Substitution costs effect.** Wind Overlord and Tyrant Strength stand in for Borrow Strength at under half its effect (ch560). Mortal sets replace Immortal supports (Familiar Face ch976, Myriad Self ch1570).
- **GG12 · Many mortal Gu make one Immortal input.** Hundreds of Self Reliance are consumed for their marks (ch1570); All Out Effort ranks one to five fuse into an intermediate.
- **GG13 · Higher rank changes fuel family.** Rank six and above draw immortal essence (Fixed Immortal Travel, Ant Nest, Fight).

## Corpus weights for P5 (wiki layer, all 1,463 non-reference index records)

Counts from the private review index (`docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json`, primary checkout). Tentative pairs included, so a kind can count at several ranks.

- **Rank** (777 records with a label): 1: 80, 2: 102, 3: 178, 4: 153, 5: 166, 6: 124, 7: 99, 8: 57, 9: 20.
- **Path** (1,069 records with a label; "Unknown" 253): Strength 87, Wisdom 66, Soul 66, Transformation 57, Time 56, Blood 34, Enslavement 32, Luck 30, Light 28, Water 28, Human 27, Qi 24, Information 23, Rule 23, Earth 21, Wind 20, Fire 20, Space 20, Star 19, Ice 17, then 25 paths under 17.
- **Type** (641 records): Support 182, Offensive 173, Movement 67, Consumable 67, Defensive 65, Investigative 38, Grass 35, Healing 33, Storage 31, Amplification 30, Flying 18, Concealment 15.

## The canon test (proposal)

- **Rebuild functions from parts.** Hold out the function of each kind with a non-null function (57 of 78); predict it from path, roles and wiki type. Pass: most held-out functions rebuilt, every miss listed as a missing rule.
- **Rebuild fusion products.** Hold out the five recipe products and the five lineage rows (GG7); predict rank and function from the inputs by GG10 and GG13.
- **Generated means runnable.** A generated Gu must produce an `ability`, `conversion`, `growth` or `recipe` binding that an existing leaf runs (gu_activation, gu_refinement, propagation). A parts row alone is not a generated Gu.
- **Range.** Generated rank and path frequencies fall inside the corpus table above, or the world pack names its dial and reason (PFP18).

## What the parts cannot express yet

- Conflicting chapter evidence on one field (Year Gu's stated rank versus year count; green-grape activation). The row keeps one rank list and the conflict as an open field.
- A provisional sighting that is not yet a kind (the yaksha octopus king's wild Immortal).
- Rank families on one wiki page versus the single-rank kind a scene shows (Beast Enslavement, Slavery).
- Same name, different incarnations (mortal and Immortal Self Strength; Man as Before before and after ascension).
- Acknowledgement without refinement (Love, Light): control is not a yes or no.
