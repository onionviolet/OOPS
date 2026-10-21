# Processed material lineage leaf, 2026-10-21

This leaf implements the pure lineage operations for the gear-depth continuation.
It applies CRL2/CRL3, NX4/NX11/NX12, MR1/MR4/MR5/MR16/MR27/MR29 and AD5/AD6/AD8/AD9/AD15/AD16/AD22/AD32/AD36/AD38. It does not change a native owner or claim a playable integration.

## Identity and accounting

`src/material_lineage.js` creates a canonical processed key with a family, a
revisioned lineage envelope, explicit process events, and exact parent inventory
keys and consumed counts. The native inventory key plus native count remains the
only stock ledger. A split returns two fragments with the same key and conserved
counts. Merge coalesces only identical keys; different age, quality,
completeness, process or provenance remains a distinct exact stack. Legacy
opaque keys are accepted as parent identities and remain untouched.

Age and origin are carried when present in the existing source key or supplied
from the native item record. Harvest quality and completeness are copied from
the existing graded key and retained with the exact parent key. Native
`sourceFacts` can also carry a bounded JSON evidence snapshot, including the
specimen, damage, condition, harvest time and append-only observations from the
existing harvest owner. This module does not invent a processed product's
quality/completeness. A process output must state its produced quality or
completeness if the native mechanism has one.
The bounded planner rejects stale/short inputs, duplicate allocations,
unsupported revisions, and output quantities above consumed quantity. It does
not own a clock, inventory, save, generic spoilage, or process scheduler.

## Native integration requests

1. **Factory:** teach the native item factory to resolve canonical keys whose
   `id` and `lineage` fields are present. Project family and observed facts
   through existing knowledge rules; keep lineage/process details available to
   exact inventory inspection without revealing unknown material truth.
2. **Producer and spender:** at the existing transaction boundary, pass the
   exact selected `{item_key,count}` rows, native stock count snapshot, source
   `born`/`origin_world` facts only when those facts exist, and the settled
   process ID/revision/time/world/parameters. Apply the returned exact input
   decrements and output grant in that same transaction. Never update a second
   quantity ledger. Existing recipe consumption already selects exact keys.
3. **View and commands:** preserve distinct keys in inventory selection and
   crafting requirement groups. Offer split/merge through these pure plans;
   reject stale snapshots and re-quote. A same-key merge is quantity
   coalescing, while different cohorts stay separately selectable.
4. **Acceptance:** add the module to the actual native item resolver and process
   producer, then verify a processed material through craft/use, save/reload,
   export/literal import and rebuilt desktop browser. This leaf has no such
   native or persistence evidence.

## Checks and limits

`node --test tests/material_lineage.test.js`: 4 tests pass. Coverage includes
parent-key, grade and observation-evidence retention across two processes, age
carry-forward, split conservation, merge compatibility, stale stock, duplicate
selections, bounded yield and unsupported lineage revisions. The test module is a focused pure
contract check only; native factory resolution, spending, view grouping,
browser behavior and persistence remain open for the coordinator.

## Integrated completion, 2026-10-21

The leaf-only status above is superseded by native integration. `processed_materials.js` connects settled harvest outputs and the existing exact recipe allocator; `material_lineage_domain.js` validates native item-key envelopes. The native item factory preserves lineage. Existing inventory and chest operations split/coalesce identical cohorts; different source facts remain distinct. Recipe-defined yield can exceed the number of carcasses while retaining exact consumed parents. No second quantity owner or inferred legacy birth time is introduced. Rebuilt fresh-origin browser six-check receipt is in `evidence/lineage-browser.json`, including pending observations, two-holder transfer, six-of-seven partial processing and three Save/reload/Export/literal Import boundaries. Natural acquisition and pacing remain separate from seeded fixture proof.
