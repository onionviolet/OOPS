# H1 resume 1: saving fails after an act in the browser (coordinator, 2026-10-29)

The coordinator applied `H1_INTEGRATION.patch`, built `/tmp/yairpg-h1` (bundle `5189b254`), and ran a headless
Chrome be-seat check at 1920×1080. Things at hand render correctly (eight controls with minutes and costs; pay,
inspect and eat enabled; the rest disabled with reasons). Before any act: zero page errors, and reload keeps state.

**Defect.** After clicking "Look over the desk" (the first act), the console shows `Something went wrong on saving
the game!` and then every `simulationTestHooks.snapshot()` throws `Saving disabled after a loading error. Preserve
the original save and use a compatible build.` So the first autosave after an act fails, and the save guard then
locks saving. Likely suspects: a non-serializable or unregistered value in the act's pending receipt or job
(function, Map, cyclic ref, a field the save writer or its schema check rejects), or the save/load round-trip check
rejecting a new field without a registered owner.

Reproduce without a browser: in the Node DOM harness used by `tests/lotm_be_seat.test.js` or P5's
`tests/headless/controller_wake_fixture.mjs`, enroll the be life, run the inspect act, advance past its minute,
then `create_save()` and load it back. Fix at the cause (register the field with its owner, or keep the receipt
serializable), add that round trip as a regression in `tests/place_acts.test.js`, and include Export/Import if
the harness supports it. State the compatibility decision for saves made before H1.

Same grant as before. Update `H1_CHECKPOINT.md`. Do not commit.
