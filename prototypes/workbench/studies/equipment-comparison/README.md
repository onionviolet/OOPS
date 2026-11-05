# Native equipment comparison prototype

```sh
node prototypes/workbench/studies/equipment-comparison/build.mjs
node prototypes/workbench/serve.mjs
```

Open the printed URL with `?study=equipment-comparison`. Native command mirroring
is disabled; current/comparison controls share one running native life.
The builder reuses the functional-home isolated packaging route, then creates
its own native entry with direct references to existing tool/workshop ports.
Production sources and installed builds are untouched.

Prepared public midgame fixture: Village, durability enabled, worn identified
Iron pickaxe, identified component-built sword, carried replacement parts and
repair material. This is explicit test stock, not earned acquisition. The clock
is paused for review; workbench Step advances actual native ticks. No player
save is used. A new disposable browser context resets the fixture.

Review repair to see actual chance, shortfalls, conditional outcome, reserved
materials and duration. Start repair, use the workbench clock to progress it,
or Cancel to invoke native material return. The gear review uses actual
component compatibility, maker eligibility/service stock and native commit.
Swaps retain identity and condition, return degraded salvage and currently
advance no time. Unworn base item comparisons exclude durability/character
modifiers on both sides; no temporary state mutation supplies a preview.

`adapters.js` contains domain-specific adapters. The shared review renderer is
imported from the home study. Native owners retain transactions, jobs and
saves. The UI's read-only refresh timer is prototype code; production should use
native publications/registration, narrow quote identities and existing UI kit.
Current Tools/Gear controls are available via buttons. A footer Equipment
comparison button returns to the prototype.

```sh
node prototypes/workbench/studies/equipment-comparison/check.cjs http://127.0.0.1:PORT/
```

Evidence: `evidence/`. Native bundle/output identities: generated
`../../built/equipment-comparison/INPUTS.json`. Optional pack/resource requests
may return 404 in the isolated copy; optional content is outside the receipt.
Target desktop 1920×1080 plus 1536×864 at actual 14/21 px. Mobile and installed
integration deferred. No new persistence schema.

[UI audit round 26](../../../../docs/audits/UI_DESIGN_CORE_AUDIT.md#round-26-2026-11-01-native-equipment-reviews-and-ui-priority-check)
records proof and the recommendation to prioritize connected LOTM/general UI
work before further comparison infrastructure. This prototype does not change
standing product priorities or authorize an all-panel conversion.
