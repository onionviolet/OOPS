# M2 domain registry and two consumers

Passed 2026-10-16. Pre-round commit: `9e089696`.

`domain_registry.js` supplies optional initialization, namespaced save, envelope
validation, migration/load, ticks, commands, projections and panel factories.
Dependencies are checked and ordered; duplicates, missing dependencies and cycles
are rejected. There is no timer or storage writer. The existing game-clock call
now invokes registry ticks. Existing save/load calls iterate the registry.

`native_resources_domain.js` owns carcass and meadow-pen state, migration,
validation, commands, harvest advancement and panel mounts. Native transaction
owner lists, inventory/XP application and durable writer stay with their existing
host and are injected as narrow operations. State bindings in combat rollback
now call setters on the domain owner. Meadow validation still precedes carcass
validation, with the latter retaining its whole-envelope graded-key cross-check.
Existing Local actions and Projects panel homes and timers are unchanged;
Projects still registers through definePanel. No gameplay changes.

## Gates

- `npm run build`: pass.
- `npm test`: 1798 tests, 1795 pass, 3 existing TODO, no failures.
- `npm run check:arch`: pass; same 8 main imports and 298 cyclic edges.
- `PROOF_DOMAINS=1 PROOF_OUT=/tmp/modular-m2-before.json node scripts/modular_seams_browser.cjs`
  on the pinned pre-round rebuild, then the same route on the current rebuild
  into `/tmp/modular-m2-after.json`: pass, fresh contexts at 1366×768, no console
  or page errors. A generated synthetic carcass starts processing through the
  visible UI and completes on the existing clock. Build/adopt/buy/feed/brush and
  six played minutes produce collected native wool. Save, reload, Export download
  and literal Import preserve both complete slices. The synthetic old save with
  both keys removed loads with both still absent and its inventory unchanged.
- `node scripts/compare_modular_saves.cjs /tmp/modular-m2-before.json /tmp/modular-m2-after.json`:
  all four envelopes equal, ignoring only saved_at. Same RNG and empty optional
  manifest fixture as M1. Panel navigation uses the real Projects keyboard path.
- Registry tests cover dependency order, missing-key defaults, nonmutating load,
  ordered validation, save keys, tick dispatch, commands, projections and mounts.

Core lines this round: main 10121 → 10100, net 21 removed (60 removed / 39 added);
save_files 256 → 256 (4 removed / 4 added); display unchanged at 6655.
Cumulative net reductions: main 160, display 9, save_files 0. The registry and
native host adapters account for the small net count; counts do not prove the seam.

No remaining M2 playable gate. Broader native scenarios and human taste are not
claimed. Save serialization property order changes for these two adjacent keys;
keys, values and complete JSON envelopes are equivalent. Old missing slices stay
absent. Validation order is preserved independently of serialization order.

Merge reconciliation: main save/load/tick sites, native-resource initialization,
combat rollback bindings and UI mount block; save_files import and validation
block. Continuation must keep its own namespace and behavior when merged by the
coordinator. Shared checkout remains untouched.
