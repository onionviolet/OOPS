# World binding helper review

Reviewed 2026-10-04. This source-only review covers the additive binding helpers and their Glasshouse manifest use at these hashes:

| File | Inspected SHA256 |
|---|---|
| `src/world_instances.js` | `cf15bd3c1d34153c541617fdd83a45d9b9faddd98b64b20edd0160d9547720fd` |
| `src/pocket_realm_content.js` | `d40fbe6d4913eb667a827ac33545b5b5afaac769ac2df607ae55a763cd358456` |

No concrete namespace, type, reference, or alias contradiction found. `createWorldBindings` derives fact keys as `${instanceId}.glasshouse.${fact}`, site keys as `${instanceId}.glasshouse.${site}`, and claim keys as `${instanceId}.glasshouse.${claim}` for this seed. Those match the prior `bindings.factKeys`, `bindings.sites`, and `bindings.uniqueClaims` strings. `validateWorldBindings` checks definition identity/revision/world, exact local-key coverage, uniqueness, fact-prefix consistency, and optional instance identity. `worldInstanceFacts` emits `world.<registered-fact-key>`, matching the existing simulation predicate names authored by this content.

The `bindingManifest` is authoring metadata only. The helper's own contract says creating it does not register a site, reward, fact owner, or world instance; live native binding remains the Engine integration's responsibility. This review did not run checks or behavior scenarios.
