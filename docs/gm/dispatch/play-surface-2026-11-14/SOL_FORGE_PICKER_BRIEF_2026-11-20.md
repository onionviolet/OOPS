# Sol lane: forge component picker and workpiece view (UG2 forge half, 2026-11-20)

Read [the shared lane rules](SOL_UI_LANES_COMMON_2026-11-20.md) first. Lane id `forge-picker-sol`.

**Checkout:** you run in the worktree `~/code/yarpg-mock-forge`, on branch `mock/forge-method-2026-11-20`. It holds the forge owner's uncommitted mock (`src/forge_method.js`, `src/forge_station.js` and `src/making_next.js`, plus edits to `src/gear_workshop_panel.js` and `src/gear_workshop_domain.js`). Build on that mock and keep it. Evidence goes in that worktree under `docs/representations/evidence/forge-picker-sol-2026-11-20/`. In this worktree you may also touch `index.html` and `dist/`, because no other lane writes here.

## Weibao's words

- "Do mind my qualms about Ui ideas being turned into series of Circles without any uniqueness? How do we create a proper forging Ui? ... should we abstract more? Do we represent each choice as an action? each result as a product of the changes and factors and more?"
- "Why cant we be visually inspired by what they posted and address accordingly?"

## Where the forge stands

From [the forge owner's reply](ACTIVITY_UI_REVIEW_2026-11-20.md#forge-owners-reply-november-20) and MKC113–MKC115 in `docs/MAKING_CRAFTS_IDEABOARD_2026-11-19.md`: one Iron sword goes through heat, shape, quench and temper. The card shows the input, the cost, the changed property and the result, and the saved item matches. Still missing: the component swap picker, which everyone agreed on but nobody built. Methods belong in `src/craft_working.js` (MKC115).

## References (`~/.codex/lanes/protagonist-life-2026-10-27/forge-picker-sol/refs/`)

- `yair-glove-component-picker.webp`: choosing a component shows the concrete stacks you own, with their qualities and quantities.
- `yair-proto23-crafting-sheet.png`: YAIR's picker and finished-item preview beside Proto23's recipe, with held, cost and yield.
- `proto23-crafting.png`: the recipe-beside-inventory arrangement.
- `oops-forge-mock-step3.png`: the current mock, your "before". The step circles are the "series of Circles" he dislikes.
- `discord-colour-text-reference.png`: semantic colour for state, item and quality.

## Build

1. **The workpiece at the centre.** Show one selected item with its properties. The current values and the proposed values sit in the same positions, so changing a part shows the difference in place.
2. **The component picker.** Select a slot, and the real stacks you hold for it appear with their quality and count. The selected stack stays selected through a re-sort. The preview updates before you commit, and the cost is shown before the commit.
3. **Steps without circles.** Treatments (heat, shape, quench, temper) are actions on the workpiece, and each shows its effect on the properties. Give the choice between keeping the quench and tempering further prominence (the mock's own note). A step only gets a gauge if the player can read a real state from it and act on it.
4. **The result as a product of the factors:** which parts and treatments produced which property.

## Owned files

All the forge and gear workshop files in that worktree, plus your new `styles/forge_bench.css`. Use the save path the mock already has. If a method needs persistence, use `src/craft_working.js` and keep the save shape unchanged.

## Done means

A played component swap and a treatment on one item, with before, after and side-by-side shots. Save and reload with the item and its properties kept. The report also names which mock pieces you kept, changed or dropped.
