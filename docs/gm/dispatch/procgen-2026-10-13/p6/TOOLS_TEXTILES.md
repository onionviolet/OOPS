# Tools, woodworking, textiles and clothing (X4)

Status: PROPOSAL ONLY. `src/crafting_component_filling.js:5-18,20-38,635-652` expands authored profiles; `src/crafting_recipes.js:665-688,1077-1086,1494-1505` has leather/cloth/pole chains; `src/structured_equipment_runtime.js:43-90` projects body fit, coverage and worn condition from declared definitions. Gaps: generated grain/weave, dimensions/interfaces and instance-specific effects. See [F1/F3/F5/F7](LIVE_AUDIT.md).

## Product law and axes

| Axis | Proposed contract |
|---|---|
| Logic | L2 parts, grain/orientation, seams and interfaces; L1 constituent material and applied binder/dye; L3 for a later actual protective enchantment; L4 only when sourced provenance matters. |
| Inputs | Owned wood/fiber/hide sublots, fitted head/handle, fastener or thread, real saw/knife/loom, pattern and body measurements. Cloth/hides remain layers or sublots when behavior is heterogeneous. |
| Process | Season/cut along grain, shape/join; spin/weave/cut/stitch; tan/fit where implemented. Structure is retained separately from bulk composition. Drying changes declared moisture and quantity, not species. |
| Skill | Woodworking/fitting or tailoring precision changes usable area, joint quality and fit. A trained maker still needs tools and actual measurements. Relevant body capability or supported collaborator is required. |
| Knowledge | Known material/fit measurements, observed wear and pattern competence. Player knows a visibly wrong size without automatically knowing hidden affinity. Test results attach to the tested structure/input scope. |

Generated: usable geometry class, joint/weave/layer arrangement, fit and selected functional responses. Authored: permitted role schemas, body-size classes, stitches/joints, process laws and consumers. Tools affect actual harvest/work eligibility, effort or yield; clothing affects existing worn defense/stamina/weather projection. Do not label a tool functional until its actual work verb reads the owned selected product. Appearance-only dyes may still be useful cosmetics without claiming combat power.

## Idle and persistence

Save a cutting/sewing plan; reserve the current exact sublot, tools and site; execute unattended supported stages on played time. An incompatible replacement stops rather than silently consuming rare stock. Initial slice does not promise offscreen factory staffing. Save assembled parts with exclusive installed custody, orientation, fit/condition, pattern revision, leftovers, measured-body reference and job stages. Legacy component IDs remain loadable. Dismantling a fitted object releases only actually recoverable parts.

## Book laws

- K10, Shadow Slave ch1605/2048: metal, leather and tailoring work remain distinct from supernatural formation. Better cloth does not bypass an absent weaving faculty.
- K5, HP Half-Blood Prince ch6/CCF15: protective hats/cloaks/gloves have bounded supported applications. Generated coverage and charm effects need their own qualified consumer; no universal immunity from expensive cloth.
- K6, MoL golem dependencies: a frame's structure and treatment are not its battery or control. Apply the same separation to powered tools.

[Locators](CANON_LOCATORS.md) retain evidence strength.

## First playable slice S4-A: fit one generated tool handle

At the Village bench, buy two original wood lots, cut a handle with one of two orientation classes, fit it to a supported native knife/jig role, and use it to make a real survey kit. Proper fit changes actual effort or recoverable offcuts. The existing exact field knife route remains valid. Clothing S4-B follows later: make two fits/layers and show a worn consumer; a tool proof cannot accept clothing.

Acceptance, all OPEN: SOURCE validates interface mismatch, layers/leftover accounting, correct body/stock ownership and knowledge-independent truth. NATIVE proves paid shaping → fitting → selected actual tool → changed kit work, unequip/remove withdrawal and shortage stop. PERSISTENCE covers installed handle, leftovers, reservations and exact work benefit after Save/reload/literal-file Import. S4-B separately needs actual wearing, coverage/fit comparison and persistence. Common gates in REPORT apply; mobile and general loom/fashion simulation deferred.
