# G6 additive adoption

2026-10-14. **PROPOSAL ONLY.** No save schema or migration implemented.
Names are proposed compatibility decisions for root review, not accepted
defaults. [ADDRESS_SPACE](ADDRESS_SPACE.md) owns identity;
[PINS_AND_CANON](PINS_AND_CANON.md) owns semantics. A1 owns the global migration
chain and consolidation plan; its [assignment](../../core-foundations-2026-10-14/A1.md)
exists, but no `a1/PLAN.md` or `a1/REPORT.md` was present when inspected.
Reconcile its output before choosing a save owner or implementing a schema step.

## MG1: compatibility decision G6-CD1, Preserve Legacy Keys

INFERRED: adopt addresses as additive read metadata and manifest aliases over
existing records. Old IDs, inventory keys, people maps, claims, body/life
bindings, jobs, exact source/content hashes and draw cursors stay authoritative.
Do not bulk replace IDs with address strings. Do not infer missing histories
from display names, source familiarity, a seed or biography prose.

An old save with no address owner behaves as before. Lookup can derive a
detached alias only where the exact existing binding proves it; unresolved
continuity gets explicit legacy-unqualified provenance. It cannot acquire
canon status, empty past events, zeroed obligations or a new loop. If a future
consumer needs missing identity evidence, that consumer remains unavailable
until a selected compatibility adapter exists; ordinary legacy play continues
where supported by its existing reader.

SHOWN constraints:

| Live inspected source | Consequence for adoption |
|---|---|
| [src/save_migration.js:3](../../../../../src/save_migration.js:3), [src/save_migration.js:12](../../../../../src/save_migration.js:12) | `prepareV06Save` clones the source, adds legacy biography/created status and moves whole survey-kit counts into actual inventory once. This is a specific native conversion, not a global address/canon migration chain. Preserve those counts and frozen commitments. |
| [src/expansion_engine.js:258](../../../../../src/expansion_engine.js:258), [src/expansion_engine.js:267](../../../../../src/expansion_engine.js:267) | Schemas1–4 clone/migrate to5; later admitted schemas are validated. No automatic GA5/GA6 conversion is shown. Add a selected named step under A1, rather than another migration function called independently by UI readers. |
| [src/structured_pack_state.js:23](../../../../../src/structured_pack_state.js:23), [src/structured_pack_state.js:29](../../../../../src/structured_pack_state.js:29) | Structured selections/records require exact revision, content/snapshot hash and declared identities/order. An address alias does not waive these guards or make an edited pack compatible. |
| [src/world_instances.js:100](../../../../../src/world_instances.js:100), [src/book_world_mol_state.js:23](../../../../../src/book_world_mol_state.js:23) | Closed shapes reject arbitrary new fields inside instance and MoL records. Select a separate admitted namespace or explicitly version those owners. Merely calling new fields additive is insufficient. |
| [src/save_compatibility.js:9](../../../../../src/save_compatibility.js:9), [src/save_compatibility.js:41](../../../../../src/save_compatibility.js:41) | Retired prototype data is detached and retained by exact path/key. An address adopter must not accidentally resurrect it as current playable canon or lose its original recovery data. |
| [src/seeded_streams.js:23](../../../../../src/seeded_streams.js:23), [src/seeded_streams.js:38](../../../../../src/seeded_streams.js:38) | Current missing-stream initialization derives `streams.root` from legacy RNG; validation preserves cells/log. Root SB17's statement about a fresh unrelated root is not what these inspected functions do. Preserve current behavior; any root-policy change belongs to P1/A5 with its own decision. |

## MG2: compatibility decision G6-CD2, Optional Address Metadata

INFERRED logical save owner, **location/schema number unresolved pending A1**:

```text
addressing = {
  schema: 1,
  manifestRefs: [],             // immutable content, exact revision/hash
  continuityBindings: {},      // explicit actual history/instance joins
  pins: {},                    // local branch/cheat pins and unpin tombstones
  frozen: {},                  // new resolved address facts/observations
  derivationBindings: {}       // only newly adopted GA10 domains
}
```

This is a logical envelope, not a supported export API. No redundant copy of
every existing actor/inventory row. Existing committed detail remains in its
own store and can be referenced by a freeze view. A missing envelope yields
empty maps/no new behavior (GI2). Register immutable canon baseline pin
manifests separately, so old saves do not get a copy of every book fact.

When enrollment creates address-dependent commitments, advertise an admitted
reader version in the owning save contract. Prove an older reader rejects the
unsupported active state before mutation/autosave, or explicitly define safe
downgrade. Empty optional maps do not establish backward readability for an
active cheat pin or unresolved event. Full exports/imports must preserve maps,
refs, derivations and exact content dependency status. Do not strip new state
on import to make validation pass.

Validation happens on detached data before the existing guarded durable write.
Unknown optional texture can remain quarantined/inert with exact bytes;
unknown state needed by active commitments requires a matching reader and a
safe incompatibility result. Missing private pack/revision never substitutes
a similarly named world. Notes and projections reveal only known safe status.

## MG3: compatibility decision G6-CD3, Stable Draw Contract

INFERRED: existing streams and current resolved truth keep their original
contract. No retroactive continuity salting. Port one new/explicitly opted-in
slot at a time; save its derivation revision and root/nonce binding. Keep old
frozen outcomes even when new unseen slots use a new table or draw algorithm.

SHOWN: [src/seeded_streams.js:64](../../../../../src/seeded_streams.js:64)
advances per-stream ordinals; [src/seeded_streams.js:75](../../../../../src/seeded_streams.js:75)
records a keyed draw without advancing an ordinal. `streamSeed` at
[src/seeded_streams.js:56](../../../../../src/seeded_streams.js:56) is pure
evaluation after ensuring the owner exists. A legacy port must distinguish
these behaviors, not assume every existing consumer is already fully addressed.

No alias rename, preview, reload, import or derived view consumes a draw or
changes attempt/pass. A key change that intentionally produces a new result
is a new admitted draw contract, not a harmless refactor. G1 handles address
serialization/picker, G3 overlay/table revisions, G5 quote/cheat invalidation,
A5 ratchets and P1 root lifecycle. Keep their seams; G6 does not replace them.

## MG4: compatibility decision G6-CD4, Preserve Existing World Semantics

INFERRED: a qualified canon start creates a new baseline binding. It does not
convert a previously authored visitor branch into an unstated canon run. A
canon revision either adds compatible unseen scope through a selected migration
or stays pinned to its old manifest; incompatible revisions require a separate
branch/reader. Unsupported restores remain recoverable, with no stock refill,
actor replacement, erased obligations or invented prior deeds.

Mother of Learning's continuous visitor branch only gets aliases to its actual
IDs. A source-loop fixture is separately admitted with exact retention/reset
rules, external exports and occurrence scope. The negative guest assessment
and original engineered device remain that branch's outcomes, not universal
source laws. A branch seed+delta is insufficient for arbitrary played resume;
retain active owner state, claims, jobs, knowledge, RNG and content refs per
[Timelines T4](../../../../TIMELINES_AND_DIVERGENCE.md).

## MG5: adoption order and exit gates

All stages are proposed. Finish one accepted slice before taking its successor.

| Order | Bounded adoption | Required evidence before proceeding |
|---|---|---|
| 1 | Content-side manifest/read resolver for existing MoL world/person/place/item IDs, plus a small original public fixture for a second floor | Exact aliases resolve to existing owners; spaces/JSON/types/rename/collision handled; before/after views match; no duplicate state or world imports in core. HP stays authoring-only. |
| 2 | Opted-in metadata envelope and detached load/export validation under A1's chosen chain | Old absent-state behavior unchanged; active pin/ref roundtrips; malformed/unknown/missing content rejected or inert by declared policy; failed write changes no gameplay. Idempotence demonstrated. |
| 3 | One source-qualified HP expectation and ordinary generated gap slot through G1/G3/P13 | Real prerequisites and clock mapping; closure invalidates exact dependency while an independent event survives; generated observed name stable; no unique identity minted. Chapter/source qualification is required before canon label. |
| 4 | G5 pin cheat on an unseen eligible original slot using the same pin interface | Peek/order/cancel does not consume luck; paid pin survives revision/reload/import; impossible or removed choice yields safe declared result; frozen value cannot be casually rerolled. |
| 5 | Separate MoL loop fixture, only after a selected temporal adapter is available | Baseline identity/stock restored precisely; qualified carrier memory retained alone; current-pass relationships/exports/claims handled; new variation domains controlled; reload is never reset. Existing visitor fixture unchanged. |

Future tests use generated public fixtures, no private saves or raw book prose.
Source checks prove the targeted contract only. Any later gameplay claim needs
rebuild, a fresh desktop origin (1366×768 and/or the selected task viewport),
useful native action and Save/reload/Export/literal-file Import. Human source
and fiction acceptance remains separate. No browser/build gate applies to
claiming these documents delivered.
