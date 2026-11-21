# Sol second pass: potion bench feel (2026-11-20)

Read [the feel pass rules](SOL_FEEL_PASS_COMMON_2026-11-20.md) and your [first-pass brief](SOL_POTION_BENCH_BRIEF_2026-11-20.md) first. Lane id `potion-feel-sol`; evidence folder `docs/representations/evidence/potion-feel-sol-2026-11-20/`. Start from the committed first pass.

## Cards

VR17, VR16, VR19, VR12.

## Build

1. **Animate the vessel itself (VR17).** Stirring swirls the liquid. An addition shows a short change where it lands, and the colour moves to the newly observed state. Heat shows on the flame under the vessel. An atomic action gets a short depiction, and the next action stays available at once.
2. **Tactile controls (VR16).** Add one restrained press-and-settle response for every kit control in `src/ui/kit.js`. On a successful step, a small mark may appear beside the vessel. Nothing appears on a refusal.
3. **The result outlasts the motion (VR19).** After the swirl ends, the ordered record of additions and the observed colour stay on screen. The hand-in result keeps its factor list.
4. **Freshness as an observation (VR12),** where the game already records it. A settling Tingen dose shows what can be seen ("still clouded", "settled") rather than a stopwatch. Do not add a new decay mechanic.

## Owned files

Your first-pass files, plus `src/ui/kit.js` and `src/settled_text_effects.js` for the shared press response only, with their tests.

## Done means

A played brew showing the swirl, an addition and a refusal, in step shots or a clip. The shared acceptance list passes, with each check and its result reported.
