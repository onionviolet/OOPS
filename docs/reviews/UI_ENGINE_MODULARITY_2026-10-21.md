# UI and engine modularity assessment, 2026-10-21

Later same-day follow-up: [bounded implementation and Electron status](MODULARITY_IMPLEMENTATION_2026-10-21.md) removes F2's duplicate host region-order list and adds host-import enforcement to F5's gate. Other findings retain their original assessed scope.

User question: “Is the way of our UI and our engine modular and extendable and easily upgradable?”

Assessment only. No runtime edits, redesign, new implementation selection or accepted decision. Applies AR1–AR13, AR16, AD32–AD36 and UR shared-component/layout direction. Current authority: [architecture rules](../ARCHITECTURE_RULES.md), [accepted incremental extraction](../USER_VISION.md#architecture-rules-and-modular-seams-run-2026-10-16), [PROJECT](../../PROJECT.md). Preserve the accepted incremental route and existing milestone; deferred architecture proposals do not become gates.

## Answer

Partly modular and demonstrably extensible. Easy upgrades depend on which boundary the change crosses. Shared panel and domain contracts support local additions; replacing a major subsystem or the entire presentation remains expensive because older runtime, model and DOM responsibilities are coupled. A rewrite is not justified by this inspection.

## Findings

| Code | Finding | Current source evidence | Practical effect |
| --- | --- | --- | --- |
| F1 | UI extension has real shared infrastructure | `src/panel_kit.js` defines registration, roles, discovery, eligibility and settings; `src/layout_spec.js` owns panel homes, boxes, slots, contexts and routes; `src/workspace_layout.js` owns panel mounting/opening | Many panel additions and composition changes can reuse the shell rather than invent navigation and placement |
| F2 | UI replacement is still coupled to native markup | `src/workspace_layout.js:492` hard-codes five region IDs; `src/workspace_navigation.js` reads native controls and invokes `window.openCraftingWindow`; `src/display.js` captures named DOM nodes on import; `styles/ui_tokens.css` contains native ID selectors | Changing a panel's markup or the whole shell requires checking readers and selectors across modules. Data-driven layout does not yet mean arbitrary host-independent composition |
| F3 | Engine extension and one independently constructible domain are implemented | `src/domain_registry.js` supplies dependency ordering, lifecycle, commands, projections and namespaced save integration; `src/lamplight_factory.js` has instance-owned state and scoped cleanup; `src/native_tool_domains.js` composes direct operations | The selected domain can be tested with another host. This is stronger than merely moving functions to another file, but does not establish whole-engine isolation |
| F4 | Older engine and presentation still share ownership boundaries | `src/models/hero.js:7` imports display functions and `:10` imports main; `src/trade.js` mixes trade operations and DOM work; main is 10,286 lines and display 6,699 | Broad combat, inventory or character changes can require coordinated edits. File size is supporting context, not the definition of coupling |
| F5 | Guardrails stop some new debt but retain old debt | Current architecture check passes with six grandfathered imports into main and 226 cyclic import edges | Passing means no new baseline violations, not zero cycles or independent replacement. These are edges, not 226 distinct cycles |

`src/ui_ports.js` improves injection but currently exposes raw character and expansion records through a shared current-port binding. It is a practical bridge, not proof that every panel consumes an isolated read model. The registry likewise exports a singleton alongside its factory. Those distinctions matter for parallel game instances and isolated previews.

The P2 [release receipt](../gm/dispatch/deep-engine-2026-10-20/P2_STATUS.md) reports its selected lamp extraction and rebuilt native/persistence proof. This assessment inspected the corresponding source and reran isolation tests; it does not claim a new browser verification or revalidate the historical full-suite receipt.

## Ranked recommendations, proposals only

1. R1: Continue extracting the core ownership boundary encountered by the next selected playable feature. Prefer model/domain operations independent of display and main, with explicit injected operations. Measure fewer core-owner edits for a second consumer, as AR11/AR13 require.
2. R2: When a selected UI change encounters a native DOM reader, move that reader to a narrow projection or command port. Prove the panel in a fixture without its old native node before claiming independent reuse.
3. R3: Extend layout/style contracts when an actual new composition requires it. Move the hard-coded region order into the spec and reduce ID-specific styling where it blocks that composition. Do not schedule a broad framework migration from these findings.

New content, panels and compatible domain features are relatively well supported. A wholly different shell, interchangeable combat model or multiple independent complete games would need additional boundary work. Current-format persistence still needs its own round-trip proof when state changes; old-save compatibility remains governed by the later accepted deferral.

## Verification and limits

- HEAD at inspection: `b0af7db5bd21770ca603fdf1e7b865b376f46857`, extensively dirty shared checkout. Findings concern inspected working-tree source, not only that commit. No unrelated edits changed.
- `npm run check:arch`: PASS. main 10,286 / baseline 10,310; display 6,699 / 6,767; save_files 310 / 310. Six grandfathered main imports, 226 cyclic edges.
- `node --test tests/architecture.test.js tests/domain_registry.test.js tests/domain_instance_isolation.test.js tests/layout_spec.test.js`: 26/26 PASS. Covers selected architecture, registry, lamp isolation/lifecycle and layout data contracts, not all runtime behavior. Output: `/tmp/oops-modularity-review-tests.log`.
- No build, full suite, browser journey, installed-desktop check or human visual/play acceptance was performed by this assessment. No UI behavior changed, so no new viewport acceptance is claimed. Desktop priority and mobile deferral remain intact.
- Only this report was added. No commit or push.
