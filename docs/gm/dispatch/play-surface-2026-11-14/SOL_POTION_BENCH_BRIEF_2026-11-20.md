# Sol lane: a potion bench with its own identity (UG2 potion half, 2026-11-20)

Read [the shared lane rules](SOL_UI_LANES_COMMON_2026-11-20.md) first. Lane id `potion-bench-sol`; evidence folder `docs/representations/evidence/potion-bench-sol-2026-11-20/`.

## Weibao's words

- "Do mind my qualms about Ui ideas being turned into series of Circles without any uniqueness? How do we create a proper forging Ui? Also for potions? should we abstract more? Do we represent each choice as an action? each result as a product of the changes and factors and more?"
- "Why even focus on glass workshop? What is important is the features like potion crafting and more?"
- "Why cant we be visually inspired by what they posted and address accordingly?" He also said a build "lacks the coloring differentials ... from the sample and example imagery".

## References (`~/.codex/lanes/protagonist-life-2026-10-27/potion-bench-sol/refs/`)

- `proto23-crafting.png` and `proto23-crafting-detail.png`: the selected recipe sits beside what you hold, what it costs and what it yields.
- `yair-conditions.webp`: an effect has a name, a duration and a concrete consequence. A drunk potion should carry through like this.
- `discord-colour-text-reference.png`: coloured semantic text (state in orange, item in teal, season and time chips). Use it for colour meaning.
- `oops-rite-brewing-gallery.png`: OOPS's own ritual layout, one labelled place per condition.
- `crush.png`, `harry-early.png`, `harry-cooled.png` and `cyoria.png`: the current potion screens, your "before". The flask colour change ("lilac after the juice, then pale pink after stirring") already exists as one line of text among unrelated exercises.

## Build

Do Hogwarts first, then Tingen if time allows.

1. **The vessel at the centre.** Show a flask or cauldron whose colour follows the actual observed state. Show whether it is on the fire, if that matters. An ordered record of additions sits beside it ("juice → lilac", "8 strokes → pale pink"). Each choice is one action next to the vessel, and the vessel visibly changes when you act. The colour comes from the game's observation, never invented.
2. **Inputs beside the action:** what you hold, what the step needs, and what it yields, in the Proto23 arrangement.
3. **The result as a product of the factors.** After hand-in or bottling, show which additions and choices produced the outcome, using what the game records.
4. **Tingen:** a settling dose shows a ready time and a way back to it. When the player returns, the bottle and its next action (bottle, take) are there.

## Owned files

`src/hp_brewing_panel.js`. In `src/book_world_lotm_ui.js`, only the functions that render the brew or bench. Read the whole file first and keep your edits to those functions. Also your new `styles/potion_bench.css`, and tests for these. Run `node scripts/rule_routes.mjs --for <path>` first.

## Done means

A played brew from start to hand-in with before, after and side-by-side shots, plus step shots showing the vessel change. Save and reload in the middle of a brew, with the vessel state and the record of additions kept.
