# LOTM scene comparison

Interactive **sketch**, not the current native renderer or a gameplay implementation.
One synthetic state/command model drives Current panels, Hybrid scene and Walkable town.
The task is read note, collect purse, visit bakery, buy bread, return and serve.
Prices, timing, room layout, street and stock are invented comparison fixtures.

From the repository root:

```sh
node prototypes/workbench/studies/lotm-scene/build.mjs
node prototypes/workbench/serve.mjs
```

Open the printed URL with `?study=lotm-scene`. Shared Layout/Compare controls switch
or mirror the same state. Scenarios reset explicitly. Nothing accesses game saves.
In Walkable town use arrows/WASD and E, on-screen buttons, or click a subject in
the scene to route next to it. Movement is presentation time; travel spends 5 minutes.
The plain index is a workbench entry, with variants controlled by the host.

Verification:

```sh
node prototypes/workbench/studies/lotm-scene/check.cjs http://127.0.0.1:PORT/
```

See [round 17](../../../../docs/audits/UI_DESIGN_CORE_AUDIT.md#round-17-2026-11-01-same-lotm-scene-in-three-interactive-forms)
for tradeoffs, budget and the exact evidence boundary. INPUTS.json binds source and
output hashes; workbench freshness flags changes independently of sketch fidelity.
No install, commit, push or production integration.
