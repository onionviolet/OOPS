# Original YAIRPG proposals from the demo data audit

These are candidate designs for the creative director and integrator. None is accepted or implemented. Any selected gameplay slice still needs a fresh-origin browser check and save/reload/import check if persistence changes.

**O1, local timber contract.** Give a home-world workshop one visible input stock (local logs), one conversion order (logs to planks), a completion time, and a destination stock. A player can gather personally or place a bounded standing order, then see exactly why work pauses when logs run out. This adapts F1's producer/consumer connection without copying its values. Smallest proof: gather one log, queue one order, wait, and inspect the input and output counts. Requires an existing owner for local resource stock and a visible workshop action.

**O2, material craft as earned access.** Add one home-world skill milestone that unlocks a distinct alloy recipe. The ore, tool, duration and resulting material property should all be visible before craft, and the material should have one meaningful downstream use. Smallest proof: reach the milestone, craft one ingot, then use it in one equipment choice. F2 motivates the link; recipe balance is original. Requires a selected progression skill and item/crafting interface.

**O3, ability practice loop.** Connect an opt-in spell unlock to one current skill, a clear resource cost, a cast or cooldown budget, and practice XP only when a valid action resolves. Smallest proof: unlock, cast against a valid target, see resource spend and bounded progress. F3 motivates the connected chain. Requires current combat/ability validation and no change to native vanilla opening.

**O4, reversible element shaping.** Offer a four-state material transformation at a home-world station where each output gains one practical affinity and loses another. Show time, catalyst and conservation rules so cycling never creates free value. Smallest proof: transform once and use the output in one recipe. F4 motivates a deliberate trade, not a copied elemental cycle. Requires an item property and valuation decision.

Recommendation: if the project selects one, start with O1 because its player action, stock change and failure state are visible in the existing realm. Do not start O2 to O4 as a parallel content wave before O1's playable gate.

## Review status, 2026-10-07

Source: [PROPOSAL_REVIEW](../../gm/dispatch/new-game-audits-2026-10-07/PROPOSAL_REVIEW.md). This supersedes the O1-first recommendation above: O1 already exists in the build.

- **O1: closed, already shipped.** `skills.timber.pack` turns logs into kits at a capacity-limited workbench.
- **O2: selected.** Built as slice D1 with Magic Research 2 P2 (see the D1 checkpoint under `docs/gm/d1-alloy-equipment-2026-10-07/`).
- **O3: closed, already shipped.** Practice commands award mastery only on completion.
- **O4: deferred.** Needs an item-valuation decision first.
