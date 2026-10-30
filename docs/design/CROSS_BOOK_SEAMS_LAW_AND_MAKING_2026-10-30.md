# Cross-book seams: law and enforcement (LAW, GM23) and making from recipes (MAK, GM25)

Lane `bk-seams`, 2026-10-30. Status: proposal (AD32) plus one read-model slice, **implemented, below floor** (`src/law_case.js`, `tests/law_case.test.js`; not host-consumed, no browser proof). Rules: AR1-AR16, MR1-MR36, AD5, AD38, CX2, CLR3 (counts and ids only, no book text), sealed secrets untouched.

**Count methods.** The gap map counts unique rule ids per family (LAW: LOTM 512, HP 203, SS 297, ASL 190, RI 137, MoL 113, GC 70). The numbers below count merged `extras.jsonl` rows with `kind` law or craft/potion. They differ on purpose; do not reconcile them.

| Merged rows (kind) | HP | SS | ASL | MoL | RI | GC | PR |
|---|---|---|---|---|---|---|---|
| law | 219 | 483 | 247 | 121 | 150 | 68 | 35 |
| craft | 54 | 287 | 218 | 98 | 186 | 97 | 53 |
| potion | 116 | 10 | 174 | 52 | 1 | 4 | 66 |

LOTM rows are in the private `wb-families-lotm` pack and owned by `sw-road` (law) and `sw-rites` (crafts and potions); this doc adapts to them and edits none of their files.

## 1. Law and enforcement

**Already built (do not duplicate).** `src/jurisdiction_rules.js` (sw-road, L11): a statute is act, places, enforcer, penalty, evidence needs, exemptions; `rulingFor` gives one ruling and a strictness dial. Its gaps are what the rows show.

**What every book shares.** Row fields `conditions` (when it bites), `who` (an actor class, filled on 81-93% of rows: HP 203/219, SS 399/483, GC 55/68, RI 138/150), `consequences[{trigger, response, by}]` (HP 125, SS 243, ASL 148, RI 101) and `limits`. Enforcer named (`by` or `enforcement.enforcer`): HP 125/219, SS 243/483, ASL 148/247, MoL 75/121, RI 112/150, GC 44/68, PR 26/35, so about half of rows in every book; the rest are norms without an enforcer and are skipped by the adapter.

**Where it varies (dials with reasons, AD5/AD38).**

| Dial | Default | Why it differs |
|---|---|---|
| Enforcement block with `penalty`, `enforcer`, free-text `detection` | Present on MoL 65/121, RI 80/150, GC 30/68, PR 25/35; absent on HP, SS, ASL | Some books state who finds out; others leave it to circumstance, so detection is typed by a curator overlay, not guessed |
| Evidence strictness | 1 (row as written) | A corrupt or panicked office accepts less; per level |
| Jurisdiction depth | place, ancestors by `parentOf` | A school, a clan hall and a realm each act on the same deed |
| Actor filter `appliesTo` | everyone | Minors, ranks, castes |
| Detection sources | witness, trace, detector with `min` | Magic can leave residue; a city can run a ward |

**Typed row.** (A detection-only overlay defaults its evidence need to what detection gives, so an empty scene proves nothing.) `statuteFromRow(row, overlay)`: merged row plus `{act, places, appliesTo?, detection?, evidence?, exemptions?, penaltyKind?}` gives a jurisdiction_rules statute with `appliesTo`, `detection:[{via, gives, min?}]`, `responses:[{trigger, response, by}]`. A row naming no enforcer or penalty is **skipped with a reason**, never given an invented enforcer; rows without an overlay are listed as `untyped`.

**Engine seam (CX2).** `caseFor` calls `rulingFor` once per statute per level on the `jurisdictionChain`; detection feeds the existing `evidence` list. No second ruling engine. Chance is not drawn: the caller passes who saw what (MR2).

**UI view.** A "what the law says here" card on the place and act views: act, who it binds, who enforces at each level, what proof is needed and what you have, and the response ladder. Desktop first; shown only for laws the player has learned (knowledge owner).

| ACT NOW (done) | Level | Done check |
|---|---|---|
| `defineLawBook`, `jurisdictionChain`, `detect`, `caseFor`, `responsesFor`, adapters | read model | 7 tests in `tests/law_case.test.js`, fixtures from two unrelated synthetic shapes; `check:arch` passes |

| ACCOUNT FOR NOW | Owner | Level | Effort | Done check |
|---|---|---|---|---|
| Wire `caseFor` into one act (arrest or fine on a talk or travel action) | floor-wire patch, sw-road | host | M | A seeded act in two places gives two enforcers; browser shows the card |
| Typed overlays for each book's top 20 enforced acts (HP ministry, MoL academy, RI clan, SS awakened guild, ASL legion) | book lanes (bk-hp, bk-mol, bk-ss, RI lane) | content | M each | `lawBookFromRows` reports 0 skipped among overlaid rows |
| LOTM adapter: sw-road's statute rows gain `appliesTo`, `detection`, `responses` and call `caseFor` | sw-road | adapt | S | Existing L11 tests unchanged |
| Reputation and papers as gates (GM44) | sw-road | mechanism | M | Act refused without papers; persona standing carries |

| LATER | Level | Effort | Done check |
|---|---|---|---|
| Free-text `detection` typing brief (haiku shard to a typed list, curator review) | content | M | Overlay coverage count per book |
| Trial and bribery as a response branch (offender can pay the enforcer) | mechanism | M | A fine becomes a favour on a corrupt office dial |
| Enforcer capacity (a watch cannot be everywhere) | mechanism | M | Two simultaneous deeds, one enforcer, one ruling delayed |

## 2. Making from recipes

**Already built.** The generic craft engine (`craft_recipes.js` slot grammar, `craft_materials.js`, `craft_resolver.js`, `craft_product_registry.js`, `native_craft_transaction.js`), MR1-MR36 and `docs/representations/CRAFTING.md`. LOTM brewing and benches are `sw-rites` and `book_world_lotm_*`.

**What every book shares.** `inputs[{item, role}]`, `steps[{what}]`, `products`, `results[{when, what}]`, `conditions`, `limits`, and `costs`. Roles are `main`, `tool`, `auxiliary`, `catalyst` (ASL: main 198, tool 106, auxiliary 54). Rows with inputs: SS 215/287, ASL 188/218, RI 165/186, GC 77/97, HP 39/54. Results branch by `when` on 43/54 (HP), 163/218 (ASL), 148/186 (RI).

**Where it varies.**

| Dial | Default | Why |
|---|---|---|
| Role vocabulary | main, tool, auxiliary, catalyst | Engine slots are base, active, solvent, binder, catalyst, additive; the mismatch is a mapping table per world, not a rename |
| Tool | station (not a slot) | A cauldron or forge is where, not what goes in |
| Cost kind | stated amount, `costStated`, or none | RI states costs on 77/186, HP on 2/54 |
| Outcome branching | success, partial, failure by `when` | Matches MR6/MR7: far attempts make originals, near misses degrade |
| Reagent identity | exact item or tag query | Canon substance versus property-based (MR8) |

**Typed row.** Craft row to `defineRecipe` spec: `inputs` role-mapped to slots (`select: {material}` when exact, `{tags}` otherwise), `tool` to `station`, `steps` to `process` ops when the world names an op, else kept as step text, `results[when]` to outcome labels, `costs` to a cost list. Unmappable inputs are reported, not dropped.

**Engine seam.** `defineRecipe`, `matchRecipe`, product registry. The adapter lives in a new file and calls `defineRecipe`; it never edits the resolver.

**UI view.** The existing crafting detail view with a "known methods" tab per world; unknown steps shown as blanks (MR10: record what was demonstrated).

| ACT NOW (done) | |
|---|---|
| Role-mismatch and count findings recorded here | doc only |

| ACCOUNT FOR NOW | Owner | Level | Effort | Done check |
|---|---|---|---|---|
| `craftRowToRecipe(row, roleMap, catalogue)` with unmappable report | next seam lane after floor-wire frees `craft_*` | adapter | M | HP and SS fixtures both reach `defineRecipe`; report lists dropped inputs |
| Per-world role maps (HP, SS, ASL, MoL, RI) | book lanes | content | S each | Map covers every role seen |
| LOTM rows through the same adapter | sw-rites | adapt | S | Brew tests unchanged |

| LATER | Level | Effort | Done check |
|---|---|---|---|
| Costs as typed spend (qi, time, favour) rather than text | mechanism | M | A cost row debits the owner it names |
| Result branches to degraded or original products (MR7) | mechanism | M | Near-miss gives a labelled degraded item |

**Why law first.** The base engine existed, the gap list was concrete, and the law rows already carry typed-enough shapes. The making adapter needs a catalogue per world and touches the same files as `sw-rites`.

## Other families worth the same treatment

ORG/CUS are with bk-benefits. Next candidates by cross-book weight: ART (dangerous artifacts, 4 books at 40+, GM33), ECO (prices, 3 books, GM22/GM4), COR (backlash, GM32, owned by sw-death), TRV (GM31/GM43).
