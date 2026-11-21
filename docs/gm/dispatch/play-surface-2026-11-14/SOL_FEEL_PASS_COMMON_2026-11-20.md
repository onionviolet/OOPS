# Feel pass: second pass for the three Sol UI lanes (2026-11-20)

Weibao chose a per-lane second pass ("Per-lane second pass", 2026-11-20) to bring the Discord pictures chat's subtle-detail findings into each surface. Each lane's first pass must be reviewed and committed by the coordinator before its second pass starts, because the second pass edits the same files. Everything in [the shared lane rules](SOL_UI_LANES_COMMON_2026-11-20.md) still applies.

Briefs: [potion](SOL_POTION_FEEL_PASS_2026-11-20.md) · [combat](SOL_COMBAT_FEEL_PASS_2026-11-20.md) · [forge](SOL_FORGE_FEEL_PASS_2026-11-20.md). Source cards: [visual reference sheet](../../../research/DISCORD_VISUAL_REFERENCE_SHEET_2026-11-20.md) VR01 to VR19. Read the cards your brief names, including their acceptance checks.

## Weibao's words

- "Ui that reflects player action and more like the hearth? Or the climbing thing? So the Ui can be more animated in genera;? Pop ups emoticons on the ui from clickign things? More subtle detail like those? Stuff and preconceptions that held us back before?"
- "update and address everyhthing wesaw accordingly? Stuff from the imagages we are missing in our own stuff?"
- On the earlier implementation: "it is getting good ideas, but its implementation kind of sucks, and lacks the coloring differentials and more from the sample and example imagery".

## Order and the shared seam

Run the two main-checkout passes one after the other: potion, then combat. The forge pass runs in its own worktree and can run at any time.

The potion pass owns the shared press-and-settle response (VR16) in `src/ui/kit.js` and any shared hook it needs in `src/settled_text_effects.js`. It adds that response once, for every kit control. The combat pass reuses it and leaves both files unchanged. If combat needs a change there, stop and report it.

## Acceptance for every pass (VR15, VR16, VR19)

- Mouse, Enter and Space each fire a legal action once. Hold and rapid repeat do not double it.
- A disabled action gives no success feedback. Focus stays on the action.
- Effects off and reduced motion leave costs, timing and saved results unchanged.
- Motion leaves click and reading targets where they are.
- Screenshots at 1280 px wide as well as 1920, since a common laptop is 1280. Rows and strips wrap by whole group there, not mid-group (MO5).
- The result stays readable after the flourish ends, and does not replay after navigating away, reloading or importing.
- Judge whether it feels good as well as whether it reads. Record a short clip or step shots of the motion, plus the side-by-side against the reference picture.

## Reference and review (MC9, MC10, added 2026-11-20)

- **MC9.** Every pass names its reference picture. If Weibao supplied none for a surface, use the matching card in the [visual reference sheet](../../../research/DISCORD_VISUAL_REFERENCE_SHEET_2026-11-20.md), or YAIR's own screen for that surface, and name it in the report. A pass with no named reference does not start.
- **MC10.** After the three feel passes land, the coordinator runs one cross-surface review. Put potion, combat and forge side by side at 1920 and check that they share bars, buttons, tokens and press response (UR176). Each looks right alone, but together they can drift apart. Findings go back to the owning lane.

## Number format (AK3, proposal until a UI rule lands)

Weibao said "Send them" for the Arkivia takeaways. Until a UR rule is accepted, every pass applies this and reports any spot it could not: a plus sign on positive changes (+4 essence), one time unit per surface (beats in fights, minutes at a bench), and multipliers written as ×1.2, not as a percentage.

## Row density (PP2, Weibao: "Send them")

Data rows are about 30 px tall with thin separators. Space goes between groups, not between rows. A long log scrolls on its own. Check this at 1920 and 1280 in each pass. It matches the half-height fighter rows from the combat fix pass, and the party rows (AL2) follow it when they are built.
