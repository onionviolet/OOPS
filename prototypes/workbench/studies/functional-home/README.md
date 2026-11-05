# Functional home comparison

An isolated **native prototype**, scoped to the Cottage owner beginning. The existing
shell, inventory, vitals and Reports stay in place. The improved home shows actual
furnishing effects, residence transfers, native rest and native repair controls.

```sh
node prototypes/workbench/studies/functional-home/build.mjs
node prototypes/workbench/serve.mjs
```

Open the printed URL with `?study=functional-home`. Choose Functional home or Current
home panel. Both use one running native state; switching spends nothing. Simultaneous
native mirroring is disabled. Start another fresh browser context to reset the fixture.
Inside the game, Compare current panel and Home comparison also switch presentations.

The bootstrap uses the existing public fresh-base fixture and the actual Cottage owner
command, on a fresh loopback origin. The clock is paused for review. Rest here starts
native sleeping; the workbench Step button advances an explicit native tick; Stop resting uses
the native function. Repairs use their existing paid time advancement. No player saves
or production source/build/app are modified.

The candidate calls existing `homeBenefits`, `homeCapacity`, `homeComfort`, `homeUsable`
and content definitions for the cottage. Actual home actions are delegated to the
current native controls, preserving their quote and eligibility handling. This DOM
bridge is disposable prototype wiring; production integration would use direct ports.
Other homes, world-specific spatial effects, body forms and saved UI preferences are
not covered. Existing tenure/household/construction services remain on the current panel.

```sh
node prototypes/workbench/studies/functional-home/check.cjs http://127.0.0.1:PORT/
```

Evidence and screenshots: `evidence/`. Build input/output hashes: `../../built/functional-home/INPUTS.json`.
The builder recreates its own generated output directory and leaves study evidence alone.
The source build retains its existing `travel_legs.js` duplicate-key warning. Optional
pack/resource requests return 404 in the isolated copy; no optional pack journey is claimed.

See [UI audit round 23](../../../../docs/audits/UI_DESIGN_CORE_AUDIT.md#round-23-2026-11-01-functional-home-comparison-and-panel-design-ideas)
for checks, known limits, researched design ideas and adoption boundary.

## Furniture replacement extension

Open `?study=home-replacement` in the workbench, or
`built/functional-home/index.html?replacement=1` directly on its printed origin.
Use a fresh disposable browser context for the documented fixture. The ordinary
functional-home study retains its original beginning.

Replacement setup makes a native round trip to Village (ten played minutes),
buys wooden tableware for eight coins and clay tableware for fifteen coins, then
installs the wooden set. Starting money falls from 102 to 79. This is prepared
review state, not a claim the player earned those purchases from gameplay income.
The setup runs once per tab session and does not run again on reload. Native
purchases and travel are real; no private save or new catalogue item is injected.

Select tableware and Review replacement. The comparison shows native aggregate
home effects with changed rows first and unchanged rows disclosed. Clay raises
Cooking learning here from ×1.05 to ×1.08. Existing rules charge zero coins and
zero minutes for packing/installation; installation consumes one carried item,
and packing returns the original. Purchase price is reference information, not
a second fee. Uncarried ceramic tableware shows its 28-coin supplier list price
and blocks commitment at home. No delivery, resale refund or atomic swap is added.

Pack current furnishing, then review and install. The empty slot between those
steps is durable. You can stop, reload or use the original again. State changes
invalidate the reviewed commitment. Model-level before/after predictions use
`planHome` plus existing benefit/capacity/comfort functions; execution invokes the
native current-panel action and verifies its result. The DOM bridge remains a
prototype adapter, not a proposed production API.

`replacement-review.js` is a domain-independent renderer/controller with read,
preview and commit ports. `furniture-replacement.js` supplies home-specific
compatibility, simulated plans and command requests. The separate
`replacement-renderer-probe.html` accepts synthetic tool-shaped ports to check
reuse of the component. It is explicitly **not native tools integration**.
No general replacement transaction or new save schema was created.

```sh
node prototypes/workbench/studies/functional-home/replacement-check.cjs http://127.0.0.1:PORT/
```

Replacement receipts/screenshots are in `evidence/replacement/`. The original
home check remains a separate regression. Desktop target: 1920×1080, with
1536×864 and actual 14/21 px; mobile deferred. Source-only follow-up ideas,
limitations and adoption boundary: [UI audit round 25](../../../../docs/audits/UI_DESIGN_CORE_AUDIT.md#round-25-2026-11-01-native-furniture-replacement-and-reusable-review).
