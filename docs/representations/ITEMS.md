# Items and inventory: representation (proposals)

Owner doc for the items representation session (branch `claude/rep-items-6f02d9`, 2026-10-30). Everything here is a proposal (AD32) and the current best, open to refactor or replacement with a reason (AD45). Slice 1 is built; the rest is design.

## Reading (PRF1)

Items are a cross-world system: a stack in a bag, a piece of gear that changes what you can do, a thing with a maker and a past, a thing whose worth depends on who is looking. The player question is "what is this, is it better than what I have, where did it come from, and can I trust what I'm told?" Target: desktop 1920×1080, Luminous Gothic default, Neutral and effects-off must work. Mobile deferred.

## What exists today (use what we have, brief item 8)

| Surface | Code | What it answers | Verdict |
|---|---|---|---|
| Inventory (list, tabs, sort) | `proto23_shell.js` inventory tools, `inventory_tabs.js`, `styles/inventory.css` | what do I hold | Good; keep as the list half of list-plus-inspector |
| Inventory tools | `shell-inventory-tools` panel | tabs, find, sort | Same list, split into a second panel |
| Belongings | `main.js` `belongings`, `inventory_div` | the native list again | Third copy of the same list |
| Inventory and combat view | combat layout | same list in a fight | Fourth; reason is real (fight posture, FC17) |
| Item details | `shell-detail` + `descriptionCopy` | one item's facts | Text-scraped native tooltip; no structure |
| Equipment comparison | `workspace_views.js` `createEquipmentComparison` | two held items side by side | Two selects and a table; the user must go find it |
| Tooltip comparison text | `equipment_comparison.js` | "Δ" lines | The right data, shown as prose |

The data layer is already structured: `equipmentComparison()` returns rows with deltas and a favorable flag; `item.gearwork` records maker, place, parts and treatment; `getItemRarity` names the quality band; `durability.factor` is condition. The weakness is the representation, which re-reads text.

## Fresh-player reading of today's screen (brief item 2)

A fresh life holds two stacks: stale bread, and Cheap leather pants (legs, 40%). Clicking the pants showed a stream of lines: `Quality: 40% [trash]`, `Slot: legs`, `Defense: 0`, `Agility: x0.99`, `Cold tolerance: +0.5`, `Crit resistance: +0.033`, "Known uses", "Value". Terms a newcomer must know: `x0.99` (a multiplier), "trash" (a band), why Defense is 0, whether wearing it is good. Nothing says that the legs slot is empty, so the first question ("should I put these on?") is unanswered. That is what slice 1 fixes.

## Forms per part (brief item 18)

| Part | Chosen form | Why this and not the others |
|---|---|---|
| The bag | **List with a pinned inspector** (today's, kept) | Hundreds of mixed things need sort, filter and a count (UR27); a grid wastes room on text-named stacks and fights the tabs. |
| A bag with a body (a pack, a pouch, a chest) | **Shape-aware slot strip**, only where a world gives bags a shape | Tarkov/Resident Evil grids are about space as a cost. Offer it as a per-world dial: weight-limited by default, grid when the world says space is the scarce thing (a smuggler's false-bottomed case). Not built. |
| One item | **Item card**: kind chips (slot, quality band word + number, condition word, stack), a one-line verdict, a delta table, a provenance trail, specifics behind a disclosure | Cards are for things you act on. Diablo and Path of Exile cards put the verdict at the top and rarity in the header; we take the verdict-first order and a word beside every colour. |
| Comparison | **Inline in the card by default** (against what is worn, or against an empty slot), **side-by-side table** only for two held items | Making the player open another panel to compare was the discoverability miss; a card that always says "vs what you wear" removes the trip. The table stays for two arbitrary items. |
| Quality and condition | **Band word + number chip**; condition as a word chip beside it | A bar implies a scale the bands do not have (they jump at 50, 100, 130, 160, 200, 246). Words first (UR37). |
| Provenance | **Trail** (ordered list: made, reforged, repaired, parts) | Time-ordered steps read as a list; Caves of Qud's lore lines are prose, but ours are recorded events, so keep them recorded and short. |
| Appraisal | **Facet-by-facet unknown** (`≈` line instead of a row) | Share the character sheet's grammar: `known / guessed / unknown`, `≈` for guessed. An item never shows a hidden number as zero. |
| One unconventional | **A trail you can hold up to the light**: the card's provenance becomes a physical-feeling "examine" action (turn it over) that, for a reader with the means (AP7), adds lines no glance shows, in the world's own phrasing; and a failed read is shown as the lines going soft. Not built; worth a later slice once a second world gives appraisal skills. | Gives appraisal a visible act instead of a hidden stat. |

## Levels and depth (brief item 19)

Glance shallow, depth one click away (UR42):

- **Quality band**: the existing band ladder names the tier (trash 0-49, common to 100, uncommon, rare, epic, legendary, mythical). Card header shows band + number; the "next band at N%" line is a LATER row once the crafting session defines what moves quality.
- **Wear**: durability is an opt-in setting today (`enabled`), so the condition chip exists only when it is on. Four words (sound, worn, badly worn, nearly spent), thresholds in the model, per-world adjustable.
- **Fittings and treatment**: `gearwork.roles` (parts with lot grade) and `treatment.stage` already exist; the trail lists them. Enchantment and affixes are `item.affixes` and appear in "Item specifics" today; promote them to rows with "from its parts" vs "resolved when made" labels in the next slice.
- **Stacks**: a count chip. Condition per stack member is not modelled; this is a known limit.

## Appraisal by skill (shared grammar)

`docs/MEANS_AND_APPRAISAL.md` AP0-AP9 already set the ladder; for items: AP0 glance (name, kind), AP1 identify (slot), AP2 estimate (band), AP3 measure (quality, numbers, value), AP7 history (provenance, condition). The model exposes that as `level` and a facet map (`known`/`unknown`); the renderer shows unknown facets as `≈` lines. In play today nothing narrows the level, so every card is read **in hand (AP7)** and the model says so in `level`; AP0-AP3 are fixtures in the gallery, not yet a game mechanic. The seat seam (`observer_view.js`) is where "who is looking" should come from once a world gives items hidden facets; the card never decides that itself. Counts of hidden facets stay out of player UI (the sheet session's ABR19).

## Do the four inventory panels merge? (brief item 16)

Proposal, not done: **yes to one list, no to deleting any panel in this slice.**

1. Belongings and Inventory are the same list in two homes; keep one list node and let the other home mount it (the shell already moves the native list).
2. Equipment comparison folds into Item details: the card compares against what is worn on its own. Keep the side-by-side table as a disclosure inside Item details ("Compare two held items") so the two-select workflow survives.
3. Inventory tools (tabs, find, sort) belongs in the list panel's header rather than its own panel.
4. Inventory and combat view stays as a posture of the same panel (FC17 already swaps tab to Usable in a fight).

Compatibility (UR17): panel ids stay registered, a retired id resolves to its new home, and one log line says where it went (UR13). Panel count and mount-on-first-open belong to the coordinator (UIW2, UIX6).

## Slice 1: the item card (built)

- `src/item_card_model.js`: pure model from an item, the worn item (or an empty-slot stand-in), and what the caller knows. Rows come from `equipmentComparison`, so reductions (`damage_taken`) read "better" when they fall and say so.
- `src/ui/item_card.js`: renderer into the node it is given; every mark has words.
- `src/item_card_reader.js`: binds it to the live game; `main.js` passes the readers (one argument added to the existing shell call, no new import cycle).
- `proto23_shell.js`: the Item details panel draws the card for carried equipment, and keeps the original description under "Full description" as the text form.
- `styles/item_card.css`: tokens only.
- Gallery: `item-card-gallery.html` (`node scripts/build_item_card_gallery.mjs`), fixtures in `src/ui/preview/item_card_fixtures.js`.
- Route: fresh life, Inventory, click Cheap leather pants. Evidence in `docs/representations/evidence/items/`.

Known limits: unsupported structured-equipment compares show a pointer instead of numbers; non-equipment items keep the old description; no provenance is stored for ordinary items ("where found / who made" needs a save field and a migration, so it is a proposal below); condition only when durability is on.

## Proposals not built (ACCOUNT FOR NOW / LATER)

| Code | Proposal | Level / effort | Done check |
|---|---|---|---|
| ITM1 | Provenance field for ordinary items (`found at`, `made by`, `bought from`), written at acquire time | Sonnet, 1-2 days; needs migration (AR/persistence) | save, reload, export, import keep it |
| ITM2 | Fold Equipment comparison into Item details disclosure; retire the standalone panel | Sonnet, small | UR17 saved layouts open; log line |
| ITM3 | One list node for Belongings and Inventory | Opus design, medium | no duplicate DOM; selection kept (UR27) |
| ITM4 | Affix rows in the card with source labels | Sonnet, small | rows match `gearItemFacts` |
| ITM5 | Per-world bag shape (weight, slots, grid) as a dial | Opus, large | one world uses it; text form |
| ITM6 | Appraisal as play: reader level from skills/means, cheat view unmasks | Opus, medium, needs sheet session grammar | card level changes with the reader, not the item |
| ITM7 | Card for non-equipment (food, materials, books): use verdict first | Sonnet, medium | each kind has its first line |

## Round 2 (brief items 1-21, 2026-10-30; proposals)

### 1. How other games do it (known from docs and play memory unless marked inferred)

| Game | What the player sees | Makes easy | Costs | Idea to adapt |
|---|---|---|---|---|
| Diablo, Path of Exile | Item card: rarity-coloured header, implicit/explicit mods, a comparison ghost against the equipped piece | Verdict at a glance; one hover | Colour carries rarity; mod text is dense | Verdict-first order and a worn-item comparison on the same card (built) |
| Resident Evil, Escape from Tarkov | Grid bag where shape is the cost | Space as a decision | Tetris tax for text-light worlds | Per-world bag shape dial (ITM5); not the default |
| Caves of Qud | Item descriptions as lore plus listed properties; identification reveals more | Appraisal as an act with fiction | Prose-heavy | Unknown facets stay named but blank; reveal adds lines (built as `≈`, ITM6) |
| Kenshi | Weight, tool quality, per-limb gear | Carrying as logistics | Spreadsheet feel (inferred) | Condition as words not bars |
| Stardew Valley | Tooltip with quality star tier; sell price | Instantly legible quality | Tiers are cosmetic | A few named quality bands beside the number (built) |
| Tarkov-style inspect (inferred) | Examine takes time and reveals the item | Appraisal feels earned | Friction | The unconventional "hold it to the light" form |

Our own prior solutions: Proto23 and the shell already pair a list with a pinned inspector (UR12, UR49); the tooltip comparison text is the same data we now show as rows.

### 2. Fresh-player test

Done from a fresh life (route kind: rebuilt headless 1920×1080, MCP walk first). Five-second read now: "Legs, Trash 40%, nothing worn in legs, would add cold tolerance and crit resistance, costs a little agility." Remaining terms: `×0.99` (a multiplier; the text form says it), "Trash" (a band name; chip title is a LATER fix), numbers like `0.033`, and the Defense `0` row (true, the pants have no armor). Cheap fix made: assembly-only rows (part tier, part quality) dropped from the card, kept in the full description. Not fixed: the worth line (the card has `value` support but the reader passes none yet).

### 3. Space, split, density

- Glance (list row): unchanged one-liner; frequent. Inspector card: lower centre today, the pinned-inspector half of list plus inspector. Detail: "Full description" disclosure, one click.
- Split: one view answered "what is it" and "is it better"; the card now answers both. Merge: Equipment comparison and the tooltip "Compared to" text answered one question twice (ITM2).
- 1920×1080 has room for the inspector beside the list at larger width (UR24 expand); today it sits in a 420 px slot and the table fits without wrapping.

### 4. Bars and small signals

Chips carry slot, band and condition; each has its word (UR37). No bar for quality (bands jump). A delta glyph (▲ ▼ ＝) always sits with a word. Colour never asserts good or bad for stats with world-specific trade-offs; lower-is-better stats say so.

### 5. Pop-outs and Electron

A pop-out item card ("pin this item on the second screen") earns its place for comparing two candidates while shopping; renderers draw into the node they are given, so it needs no new code beyond a host call. Badge: a Dock count of unseen items is LATER. Browser fallback unchanged.

### 6. Cheats and insight view

A cheat or continuing-insight view raises the card's `level` to AP7 and marks the card "revealed (cheat)"; nothing hidden is stored differently, only read. Sealed secrets and hidden-facet counts stay out of player UI. The developer inspector stays separate.

### 7. Visual style

Default card: bordered table with chips (built, reads well in Luminous and Neutral in the gallery). Alternative proposed: **ledger line** (one line per stat, a thin delta rule) for dense shopping; not built. The table wins for first-time clarity.

### 8. Use what we have

Reused: `equipmentComparison`, `gearwork`, `getItemRarity`, `durability.factor`, `descriptionCopy` (as the text form), the shell detail slot, the gallery harness and `applyCustomizationProfile`. New shapes (model plus renderer) have two consumers waiting: the trader tooltip and the crafting preview (proposed UR79).

### 9. Unconventional

"Hold it to the light": examining as a visible act whose result depends on the reader's means; failure leaves lines unresolved. See the forms table. Later slice once a world gives appraisal skills.

### 10. Audit gaps

Lead run: ordinary items have no recorded origin (ITM1). Other seats: the card has no seat input yet; `level` is the seam. Empty states: no equippable item selected falls back to the old copy. Structured equipment shows a pointer, not rows. Persistence: none changed. Performance: one small table per selection. Accessibility: table has a label, chips are text, effects-off CSS in place; 21 px text not yet captured.

### 11. Prior implementations and abstraction

The abstraction is a **verdict plus delta ledger plus trail** (one subject vs a baseline). Crafting previews, trader offers and ability upgrades can use the same model with a different baseline.

### 12. Open for improvement

Every choice here is the current best and open to replacement (AD45). Known limits: no worth line, no affix rows, no seat input, non-equipment unchanged. Likely next refactor: fold Equipment comparison and Belongings (ITM2, ITM3).

### 13. Flourish

A short settle when a card appears and a soft pulse on the Equip button when the item is an upgrade (all `ready` signals bind to the settled subject, off with effects off or reduced). Not built; CSS already forces no animation under effects off or reduced.

### 14. Reports and centre

Reports line proposal (RPT1-RPT12): `🎒 Found: Cheap leather pants (trash 40%) at the village verge` with a link to the card; grouped repeats for stacks. Centre: the card is short enough for the detail slot; long affix lists go behind a disclosure.

### 15. Ability flourish

Not this session's.

### 16. Fold into existing UI

See the four-panel proposal above (ITM2, ITM3) with UR17 and UR13 compatibility. Nothing retired in this slice.

### 17. Later volumes and worlds

Data-driven: the model reads whatever the item readers expose, so a new world's stats appear as rows without code. Checked: affix and gearwork shapes; open: world-specific item kinds (a ledger of vows, a body part), which need card variants (ITM7).

### 18. Form per part

Covered in the forms table (list plus inspector, card, delta table, trail, grid only as a dial).

### 19. Levels and depth

Covered: band, wear, fittings, stack, appraisal ladder. Open: "next band at N%", prerequisites for fittings.

### 20. Semantic roles and flair

Roles in the DOM: `item`, `slot`, `band`, `condition`, `stack`, `provenance`. In a frontier world: stitched leather borders, a worn-edge texture on the condition chip. In a ritual world: a seal glyph beside provenance and a candle-flicker on unresolved facets. A motif pack restyles roles without touching the model.

### 21. Drafts

The card, the panel set and the model are drafts. If the shell's inspector moves to a pinned side panel, the card renders unchanged.

### Account

| Bucket | Items |
|---|---|
| ACT NOW (done) | Card and model; comparison against an empty slot; band, condition, trail; `≈` unknown facets; gallery with AP1-AP3; text form kept; focused tests and 1920×1080 evidence |
| ACCOUNT FOR NOW | Worth line; band-name tooltip; 21 px capture; ITM1, ITM2 |
| LATER/DELEGATE | ITM3-ITM7; pop-out card; ledger-line style; Reports line; appraisal as play (Opus) |
