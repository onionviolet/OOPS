# Fieldcraft integration contract

Original reversible proposal selected for implementation, 2026-10-06. Source qualification: [NetHack report](../../research/nethack/REPORT.md). This uses existing simulation state and the single native durable publisher; it introduces no copied C, spatial engine, death policy, new realm or prestige.

The disjoint content worker `/root/fieldcraft` owns only new `src/nethack_fieldcraft_content.js`, `src/nethack_fieldcraft_facts.js`, and `src/nethack_fieldcraft_host.js`. Root owns their review and shared integration after an exclusive handoff. Source reader `/root/nethack_source` completed its report and released its directory.

## Exports and seams

- Content exports `NETHACK_FIELDCRAFT_IDS`, `NETHACK_FIELDCRAFT_KEYS`, `nethackFieldcraftDefinitions`, `nethackFieldcraftItemSpecifications`, `registerNethackFieldcraftItems`. Merge definitions into existing feature registries and register native OtherItems through `src/data/expedition_items.js`. Dog definition uses `provision:false`; import/enrollment never creates the meeting, stock or dog.
- Pure facts export `nethackFieldcraftFacts(state,context,registry)` and `validateNethackFieldcraft(state,registry)`. Recompute facts in `simulationFacts` so settlement rechecks actual support, condition lifetime, co-location and body. Include the group in the existing reservation-return path, so cancellation/unsupported completion returns actual items without claiming acquisition.
- Host exports `nethackFieldcraftContext`, `commitNethackFieldcraftCommand`, `nethackFieldcraftPresentation`. Add context to the native feature bridge, dispatch `nethack_fieldcraft` through the current command/publisher, allow its existing cancellation control, and merge sections before action legibility projection. Quotes include actual owned means, time, funding, cancellation and blockers.
- `referenceGameplay.fieldcraft` is optional strict `{schema:1,openedAt,openedSequence}`; it appears only after the real once-only meeting completes. Update the reference validator's allowed keys and call the pure fieldcraft validator, including the absent-reference path. Existing readers reject this unknown optional key before save/native mutation; new readers accept old absent/reference9 records without enrolling or retroactive knowledge. Existing generic people/items/resources/knowledge/conditions/jobs remain their sole owners.

## Actual play

Eda offers three paid unmarked vials, four paid dog rations and permission to recover two of her actual lodged fitting pins. A vial has fixed underlying reed oil and becomes an empty native vial when used. Assay or ordinary knife maintenance teaches the character its identity; character knowledge neither refills nor replaces a vial. An identified vial may mark the recess with a bounded scent. Rill must be present, willing, fed and actually trained before he can recover one of the finite pins. Manual panel removal reaches the same pin stock without oil or training. Recovered pins join sound staves and existing cooled repair resin to make ordinary native survey kits.

Training has a useful finite function at two completed trials. Care and service spend actual player ration/effort and dog food/effort; saturation and training bounds prevent pointless repetition. Pausing or returning care to Eda grants no reward and causes no death or background hunger. The dog remains a local service actor; travel and native combat enlistment are later separate adapters.

Reuse the existing no-strike attempt's causal strike/admission/settlement boundaries for conduct. New fieldcraft feats, if added, must observe newly committed completion plus actual native item/knowledge deltas at the existing recognition boundary; previews, load, import, cancellation and failed durable publication award nothing. Older basic reconciliation must not invent fieldcraft discoveries or companion help.

Checks for this delivery: source review, syntax/import, registry/native IDs/conditions/costs/support links, matching rebuild/source map. Gameplay, save/reload/failure/regression and director gates remain deferred and unrun. New code is implemented-unverified.
