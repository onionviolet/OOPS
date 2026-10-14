# G6 address space

2026-10-14. **PROPOSAL ONLY.** SHOWN means inspected live code; INFERRED
means a proposed contract; UNKNOWN means not established. No runtime change.
Extends OG1, GA1 and GA10 in the [generation root](../../../../GENERATION_FOUNDATION_RULES_2026-10-14.md),
subject to [Timelines T1–T5](../../../../TIMELINES_AND_DIVERGENCE.md),
[kit AX/AXR](../../../../worlds/WORLD_CORE_KIT_2026-10-14.md) and
[P13 C1–C7](../../procgen-2026-10-13/p13/RULES.md).

## AS1: verdict and read interface

INFERRED: use one vocabulary and resolver, not one physical store. An address
names a subject or facet. It does not grant an actor, transfer an object, run an
event or certify canon. Keep the current publisher, clock, inventory and
knowledge owners. AXR2 supports this interface-first route; AXR3 requires the
first consumer to wrap one existing lookup, rather than add a competing path.

```text
resolveAddress(address, bindingRevision, context)
  -> {status: bound|absent|unresolved|incompatible,
      ownerRef, entityRef, slotRef, provenanceRef}
readAddress(binding, observerContext)
  -> knowledge-filtered view
```

The truth reader is a separate author/runtime operation. Neither resolver
status nor hidden ownerRef is automatically a player-visible field. Core
accepts registrations; it imports no Harry Potter or MoL data (AXR4). G1 owns
draw serialization, G3 owns table overlays, A2 owns tags, A1 owns consolidation.
This packet proposes the identity portion those interfaces need.

## AS2: v1 grammar

INFERRED, illustrative spelling for G1/root reconciliation:

```text
address = "ya1/w/" token "/c/" token "/i/" token
          "/k/" kind "/id/" token ["/s/" token]
kind    = "world" | "continuity" | "place" | "person" | "item" | "event"
token   = canonical percent-encoded UTF-8 of a nonempty opaque ID
```

Fixed segment order; case-sensitive decoded IDs; no trimming or slugging of an
existing ID. Encode every byte except ASCII letters, digits, `.`, `_`, `-`,
`~`; use uppercase hex and reject noncanonical spellings, invalid UTF-8 and
unsafe map keys. New author IDs use a declared normalized spelling; legacy IDs
retain exact bytes through a manifest. Parse then encode must return the exact
input. Never split decoded IDs on punctuation. Use Map or safe dictionary
access, not object prototype lookup. G1 decides final length/encoding limits;
do not silently shorten an overlong address.

| Component | Meaning and boundary |
|---|---|
| `w` world | Definition/rule family ID, not a displayed world name. Distinct source versions are manifest references, not assumed compatible because names match. |
| `c` continuity | Causal-history ID. A source template has its own continuity ID; a played branch has another with an explicit baseline relation. |
| `i` instance | Actual durable owner ID within that history. A template uses a declared template instance ID. Pocket spaces can share continuity while retaining separate instance IDs. |
| `k` + `id` | Typed subject identity. World and continuity subjects repeat their respective IDs here; place/person/item/event subjects use manifest IDs. Types prevent a person and item with the same local ID colliding. |
| `/s/` slot | Optional facet, such as `display.name`, `entry.affiliation`, `current.custody`, `expected.window`, `baseline.stock`, or `appearance.palette`. A slot is an address of a property, not a separate entity kind. |

Do not put parent places into a person's ID: moving house must not rename the
person. Region/layer belong in place binding metadata and actual endpoints.
Era/anchor, source/content revision, life/body/controller, event occurrence,
loop pass, game-time bucket and draw attempt are explicit context or separate
subject IDs, never inferred from a label. One entity may own many occurrences:
event definition `term.dispatch` is distinct from occurrence
`term.dispatch.occurrence.004`. Allocate that occurrence ID at commitment and
save it; UI list position is never identity.

Examples are proposals, not registered content:

```text
ya1/w/base.frontier/c/fork.home/i/frontier.main/k/place/id/Village
ya1/w/book.mol.cyoria/c/book.mol.independent_visitor.branch/i/book.mol.cyoria.main/k/person/id/book.mol.zorian/s/display.name
ya1/w/fan.harry_potter/c/hp.source.seven_books.r1/i/hp.template.first_term/k/event/id/hp.term.dispatch/s/expected.window
```

`fork.home` and both HP template IDs above are illustrative. An adapter must
not invent that continuity for an old save if its owner has no binding. It can
use an explicit `legacy.unqualified` binding marked unresolved for canon use.
The MoL continuity/instance IDs are actual values in
[src/book_world_mol_ids.js:12](../../../../../src/book_world_mol_ids.js:12).

## AS3: live ID mapping, SHOWN

These are read-time adapters, not renames of saved keys.

| Live owner / inspected source | Mapping into the proposal | Missing or incompatible join |
|---|---|---|
| [src/world_instances.js:97](../../../../../src/world_instances.js:97), [src/world_instances.js:271](../../../../../src/world_instances.js:271) | `worldId`, `continuityId`, instance `id` map to `w/c/i`; `definitionId/definitionRevision`, `eraId` stay binding metadata. | Instance schema has a closed field list. Adding `pins` inside it would be rejected. Parent ID does not clone history. |
| [src/world_instances.js:81](../../../../../src/world_instances.js:81), [src/world_instances.js:136](../../../../../src/world_instances.js:136) | Endpoint `regionId/layerId` qualify a place. `siteBindings`, `claimBindings` and `factKeys` bridge registered IDs to local site/fact/claim owners. | A native location is not always a reservable site. Two different owner roles need distinct references even if they point to one place. |
| [src/structured_pack_runtime.js:43](../../../../../src/structured_pack_runtime.js:43), [src/structured_pack_runtime.js:77](../../../../../src/structured_pack_runtime.js:77) | Pack/world/start IDs and saved `instanceId` bind a structured run; schema2 also binds actual life/body instance IDs. | No separate continuity ID here. Register a qualified continuity binding explicitly; do not parse a seed or start label into a canon history. |
| [src/structured_pack_runtime.js:68](../../../../../src/structured_pack_runtime.js:68) | `p.id` joins `actors[p.id]` and `simulation.people[p.id]`; definition revision and native/simulation inventory mode remain separate owner fields. | Actor maps are keyed globally by `p.id`; another run with the same people IDs is rejected. Addressing alone does not make simultaneous counterparts possible. |
| [src/structured_pack_runtime.js:65](../../../../../src/structured_pack_runtime.js:65), [src/structured_pack_runtime.js:79](../../../../../src/structured_pack_runtime.js:79) | `player` is an existing actor binding; its body/life is separate. Origin claim is a claim reference and cause, not a person or canon pin. | Do not create one new player record per address. An actual traveler retains identity on crossing; current destination is a relationship, not a new identity. |
| [src/structured_pack_state.js:10](../../../../../src/structured_pack_state.js:10), [src/structured_pack_state.js:73](../../../../../src/structured_pack_state.js:73) | Identified unit `id` maps to item subject; `titleClaimId` and allowed inventory keys map to custody/type/condition facets. | A stack key is not automatically an individual object. Counts and equipped/reserved stock must remain with their existing owners. |
| [src/book_world_mol_ids.js:7](../../../../../src/book_world_mol_ids.js:7), [src/book_world_mol_ids.js:9](../../../../../src/book_world_mol_ids.js:9) | Exact native place strings and JSON item keys receive manifest references. `Cyoria visitor arrival` becomes encoded `Cyoria%20visitor%20arrival`; decoded legacy key stays unchanged. | A blanket stable-ID rule would reject spaces and JSON. `Survey rope` is a shared item type, not a unique Cyorian unit. |
| [src/book_world_mol_ids.js:6](../../../../../src/book_world_mol_ids.js:6), [src/book_world_mol_state.js:28](../../../../../src/book_world_mol_state.js:28) | Local encounter ID can bind an event definition. Retrieval/hazard are authoritative world fact facets; a concrete occurrence needs its own admitted identity. | No general source-canon event graph or GA5 pin store is supplied by these facts. |
| [src/seeded_streams.js:47](../../../../../src/seeded_streams.js:47), [src/seeded_streams.js:70](../../../../../src/seeded_streams.js:70) | Stream/key/ordinal/salt receipts are decision references linked to an address. | Receipts do not name all world entities. Sequential `drawUnit` and pure `unitDecision` have different contracts. Preserve old cursors. |

SHOWN: strict ID spellings also differ:
[src/world_instances.js:10](../../../../../src/world_instances.js:10) requires
an initial letter, while [src/structured_pack_state.js:3](../../../../../src/structured_pack_state.js:3)
does not. Keep addresses outside both legacy ID fields. Slash/percent address
syntax cannot be inserted into those fields without a separately tested change.

## AS4: collisions, renames and relationships

INFERRED: identity collision is exact decoded `(w,c,i,k,id,slot)` equality,
not a name clash or a shared 32-bit hash. Duplicate registrations must either
point to the same authoritative owner with explicit equivalence or fail with
both provenance refs. Never choose the later import silently.

Display renames update a name facet; identity stays stable. Correcting an ID
uses a revisioned alias manifest `old -> stable target`, rejects cycles and
many-owner ambiguity, and retains the old spelling in old receipts. Changing
identity or splitting a person creates explicit new subjects and relations,
not aliases. Reserve canon names/aliases via P7/P13. SB26 permits a shared
counterpart name through an explicit root relation; unrelated generated
collisions get a deterministic display suffix or another candidate. No rename
changes draws for an existing person.

For a traveler/object: the home address remains its identity; current custody
and endpoint point elsewhere. A counterpart has a new local address plus a
`counterpartOf` relation to the root identity, not an alias. Imported saves
with the same instance ID and different histories need a conflict/fork record,
not map union. Same bytes alone do not prove the same played history.

## AS5: GA10 continuity salt

SHOWN: [src/seeded_streams.js:42](../../../../../src/seeded_streams.js:42)
scopes most streams to `world`, explicitly excluding craft; the game wrapper
reads the actor's world at [src/seeded_streams.js:97](../../../../../src/seeded_streams.js:97).
`unitDecision` hashes `[stream,key,salt,n]` under a saved root at
[src/seeded_streams.js:50](../../../../../src/seeded_streams.js:50). It has no
automatic continuity, instance, life or pass input. GA10 is therefore a new
adapter contract, not a live general guarantee. The 240-character stream-name
limit at [src/seeded_streams.js:10](../../../../../src/seeded_streams.js:10)
is another reason to keep a full address in a key/reference rather than append
it blindly to the stream name.

INFERRED derivation, final hash implementation stays with G1/P1/A5:

```text
Rcontinuity = H(savedRoot, "ga10.v1", worldId, lineageId, continuityNonce)
Rinstance   = H(Rcontinuity, "instance.v1", instanceId)
draw        = H(selectedRoot, domain, subjectId, slot, timeBucket, attempt)
```

Persist the nonce and derivation revision when creating a continuity. It is
not a user-editable display label or an alias revision. Maintain equality
checks on full IDs; a seed collision is not identity equality. Use explicit
domain policy to choose the root, not a universal added salt:

| Domain | Root/context policy, proposed |
|---|---|
| Shared counterpart traits | Explicit root-person draw or inherited resolved trait. Continuity-derived differences apply only to declared mutable facets. No shared knowledge. |
| Local new AU detail | New continuity/instance root; inherited pre-fork frozen facts stay copied/referenced with remapped local owners. |
| MoL baseline population/stock | Stable loop-baseline root and frozen baseline values; omit pass index. A new loop pass does not regenerate neighbors. |
| MoL permitted varying response | Pass ID and new actual inputs for declared variation domains only. Actor plans can change from intervention even with the same random value. |
| Retained memory carrier | Actual person/life/carrier identity; memory retention is a temporal policy, not a salt or shared counterpart root. |
| Legacy saved draws | Existing root, cells, salt, keys and ordinal contract unchanged. Only new admitted domains use GA10. |

Changing content revision is not automatically changing identity or nonce.
Unseen content may use a new admitted table revision; frozen truth retains
its original value/revision. Changed inputs require a quote/vision invalidation
receipt (G3/G5). Reload/import reuses bindings and roots, and never increments
a pass, attempt or continuity nonce.

## AS6: occurrence and pass addressing

INFERRED: stable person/place addresses survive a loop; pass-local resolved
slots need an explicit scope. For a baseline name use `baseline.name`. For an
observation in a pass, use a distinct opaque slot ID such as
`observation.pass.0002.name`, linked to the stable name facet and that observer's
record. Alternatively a resolved occurrence can be an event subject with an
explicit person ref. The final representation belongs to GA6/AX6; never
overwrite pass1's frozen record with pass2's value under the same map key.

Current mutable facets, such as `current.stock`, resolve to the existing owner.
Historical stock at reset entry uses a qualified baseline/pass record. A
freeze record refers to that scope, not an unqualified command to set current
stock. Alias manifests and continuity bindings must retain these distinctions
on export/import and compaction.
