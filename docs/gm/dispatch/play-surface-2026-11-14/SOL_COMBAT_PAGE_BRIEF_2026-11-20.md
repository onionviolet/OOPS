# Sol lane: make the combat page our own (UG4, 2026-11-20)

Read [the shared lane rules](SOL_UI_LANES_COMMON_2026-11-20.md) first. Lane id `combat-page-sol`; evidence folder `docs/representations/evidence/combat-page-sol-2026-11-20/`.

## Weibao's words

- With a screenshot of the Mara fight: "it still feels off, other than the texts being missed placed right now ... overall, how can we make the combat UI better?"
- "Instead of mara, we can instead, use a fight from LOTM or RI and start tuning, and building around what is needed in lore?"
- "I can still choose to incapacitate them no? ... Specific improvements to make the combat page our own and cover our possibiltiies? Maybe we can work from what it needs to do? (all the possible actions to extend freedom and capability on both sides beyond what exists in yair and proto23 while still being visually appealing"
- "Do mind my qualms about Ui ideas being turned into series of Circles without any uniqueness?"

## References (`~/.codex/lanes/protagonist-life-2026-10-27/combat-page-sol/refs/`)

- `weibao-mara-fight-complaint.png`: what he dislikes. The Threat row text overlaps "Who acts next". The move list is a stack of identical bars with bare numbers. The opponent's state is a few words.
- `yair-cave-encounter.webp`: the place header ("narrow", "dark") holds what is true of the whole scene. Each fighter row holds its own HP and timing bar. Defeated rows dim in place.
- `yair-conditions.webp`: named conditions with time left and a concrete effect.
- `yair-stance-table.webp`: favourite stance and active stance as separate controls.
- `native-yair.jpg`: the place box becomes the fight.
- `oops-ri-wolf-current.png`: the current RI single-wolf screen.

## Build

Use Fang Yuan's RI wolf fight. Use the ordinary single-wolf patrol, or a save prepared just before it.

1. **The opponent area shows both sides' state.** Keep one row per fighter in the same place on screen: HP and timing bars, posture, and named conditions such as *Disarmed*, *Bound*, *Yielding*, *Unconscious* or *Fled*. An outcome changes that row in place.
2. **A scene header** holds what is true of the whole encounter, such as place, light, footing and who else is present.
3. **Moves grouped by effect:** harm, hinder, protect, influence, escape. Each move shows its cost with the unit, the time in beats, and what blocks it, beside the control. "Moonblade needs 1 essence, you have 0" is the standard. Make the groups look visibly different. A stack of identical bars is the thing he dislikes.
4. **Intent stays visible near the moves:** the current approach, such as Holding back, and the intended outcome if the opponent goes down, such as Take alive.
5. **F16:** when a person goes down, the fate choice offers Bind wherever the fight terms already allow binding. The resolver is in `src/tempo_fight.js` and the terms in `src/fight_terms.js`. Use the existing binding rules, not new ones.
6. **Fix the Threat row overlap** shown in his screenshot.

## Owned files

`src/combat_situation_ui.js`, `src/opponent_board.js`, `src/combat_focus.js`, `src/tempo_fight.js` and `src/fight_terms.js` (only for F16), your new `styles/combat_page.css`, and tests for these. Run `node scripts/rule_routes.mjs --for <path>` on each one first.

## Done means

- A played fight with before, after and side-by-side shots, plus a downed-person screen showing Bind.
- Save and reload in the middle of a fight, with the opponent row's state kept.
- A test that pins Bind in the downed-person choices when the terms allow it.
