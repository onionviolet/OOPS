# BI1: stable entity references

2026-10-14. **PROPOSAL ONLY.** Extends [root BI1](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#bi-too-many-contracts), [P7 DATA_SHAPE](../p7/DATA_SHAPE.md), [P9 PROFILE_RULES](../p9/PROFILE_RULES.md), [P19 C1](../p19/CONTRACT.md) and [P32 AM2](../p32/LEVEL_OF_DETAIL.md). Names below are logical contracts, not existing exports or allocated save versions.

## BI1.1: one reference format, distinct kinds

```text
EntityRef = {kind, id, lineageRef}
kind = person | place | item | thread | faction | world
EntityVersionRef = {ref: EntityRef, revision}
EntityEntry = {
  ref, identityClass, identityScopeRef, originRef, definitionRef?,
  authorityBinding: {ownerId, localId, bindingRevision},
  lifecycle: active | cold | departed | dead | destroyed | dormant | retired,
  counterpartRefs[], carrierRefs[], displayEvidenceRefs[],
  detailBindings: {subsystem: {tier, ownerRef, revision}},
  tombstoneRef?
}
IdentityScope = {
  id, saveLineageId, worldInstanceRef?, branchRef?, continuityRef?,
  lifeRef?, incarnationRef?, sourceSnapshotRef?, eraRef?
}
```

Use an opaque persisted allocation such as `e.17`, qualified by the save lineage in the directory. A compact internal integer is possible; its wire spelling is a versioned codec choice. Allocation uses a saved monotonic counter in the admitted transaction and consumes no gameplay randomness. Export/import retains lineage and allocations. A deliberate fork allocates a branch scope and maps branch-local identities; opening another copy of the same file does not create a new life or traveler. Every serialized reference supplies its source `lineageRef`; cross-save ingestion preserves it, never resolves `e.17` against the current save accidentally.

The common resolver takes `(ref, asOf?, requiredCapability)`; scoped queries supply the current scope explicitly. A bare owner-local ID such as `player`, `iona`, `traveler_1` or `Village` is accepted only by a registered legacy adapter that knows its owner and original scope. Do not concatenate names or infer lineage from matching labels. Save lineage is an internal identifier and need not be exposed in public artifacts.

Nonentity records use `RecordRef = {ownerId, id, scopeRef, revision?}` for jobs, requests, promises, claims, clocks and definitions. Entity identity never changes when the authority binding changes; immutable record revisions remain pinned where consumed. Both forms resolve through the same qualified directory/owner gateway, with kind/class checks.

Kinds share syntax, not interchangeable semantics. A world entry explicitly has definition or instance class; events bind an **instance**, with its separate definition/continuity. A place binds an authored node or installed site within that instance. A faction binds an enduring organization, distinct from a current office holder. A person identity has separate body, soul, incarnation, office and actor bindings where its law needs them. A thread binds a P12 prospective or recognized instance. A counterfeit mark or alias is an attributed claim, not an identity alias in the resolver.

## BI1.2: items need three levels

| Item class | Identity | Permitted joins |
|---|---|---|
| Definition / product type | Native definition or immutable P2 product reference under its retained resolver revision | O3 appearance binding, method prediction, type-level discovery |
| Lot / batch | Material lineage, manufacture/harvest receipt, relevant homogeneous properties and quantities | P8 yields, food servings, coatings, supplier manifest |
| Individual copy | Explicit split/promotion from a lot or existing copy ID, conserved holder/title history | MK2 maker mark, IT2 use growth, PR heirloom, P24/36 object biography |

`item` entries declare class and parent refs. Definition is not owned stock. A ten-vial lot remains ten vials; assigning one copy ID debits one vial from the lot and adds that copy in the same transaction. Joining the promoted copy back into an anonymous stack is legal only if every promised per-copy distinction can still be represented. A vessel, its contents, an installed part and an exposure after consumption are separate records connected through their actual owners.

P2's `m1:` key embeds composition JSON, and equal products stack; it provides product-type identity, not ten separate vial identities. Keep the full key private in the retained catalogue and assign a compact directory handle. Do not mutate P2's key or dose to attach provenance. See [SOURCE_AUDIT F8](SOURCE_AUDIT.md). A digest can assist lookup after full canonical equality is checked; it cannot replace missing product data or certify unique physical ownership.

## BI1.3: legacy bindings and LOD promotion

| Existing carrier | Initial adapter | Promotion constraint |
|---|---|---|
| `expansion.simulation.people[id]` and `actors[id]` | One person entry with both required simulation bindings | Keep actor, inventory, clock and current incarnation; no second actor allocation |
| Top-level `generated_people.people` | Qualify P4 ID by original enrollment scope | Reference-only is a complete supported mode. Simulation promotion records a bijection and transfers selected authority atomically |
| `npc_lives.people` | Qualify the authored household's enrollment identity | Preserve saved annual life policy; do not also run a second mortality controller |
| Chronicle contacts / domain People providers | Explicit owner-qualified bindings | Same-name contacts are distinct unless an authored identity mapping establishes sameness |
| Native locations / instance endpoints / simulation sites | Authored node and instance-qualified installed-site bindings | Moving/destroying a facility does not allocate another geographical place |
| Native item keys / P2 catalogue / copy IDs | Definition, lot or copy class specified by adapter | No biography implied by an ordinary fungible stack key |

Extend [P32 T0-T3](../p32/LEVEL_OF_DETAIL.md) per subsystem. A far person's promise can remain exact while their conversation cache is cold. Promotion retains the **same EntityRef** and already resolved facts, constraints, custody, receipts and source revisions. New unspecified detail is admitted once under a pinned generator and its real constraints; it cannot rewrite a known repair or invent earlier earned deeds. Display is read-only. Demotion removes caches and safely compactable routine data, while exact commitments and retained individual history stay pinned.

An anonymous cohort is not an inexhaustible duplicate-person factory. Individualization allocates a new person entry, records which cohort membership was replaced and updates counts atomically. If the cohort promised only aggregate history, label individual pre-promotion history unavailable. Do not distribute one aggregate deed to every newly named member. P32's optional latent outline remains reachable without requiring complete biographies for every crowd member.

## BI1.4: retirement and tombstones

A tombstone keeps ref, kind/class, original scope, last authority binding, terminal cause/time if known, counterpart/carrier links, permitted identity capsule and resolver availability. It contains no executable balance. Dead, departed, destroyed and missing-pack are different states; missing content is not death. A known dead person's receipt remains resolvable without a live simulation actor. Required survivor/custody data stays with its actual owner.

Never reuse IDs. A repair normally retains the object's identity with a new state revision; a replacement is a new copy linked by a replacement receipt. Resurrection, echoes, incarnation and branch counterparts follow an explicit world law and crossing manifest, not automatic identity fusion. Same identity and same body are separate questions. Tombstones cannot satisfy an action requiring a currently present participant or a retained exact product payload.

Reference strength is declared in the consumer registry: hard executable dependency, exact evidence pin, identity-only historical link, or soft presentation hint. Soft links may resolve to a capsule or `detailUnavailable`; they cannot silently become hard pins. Existing visit scanning remains unchanged until its owner adopts typed strengths. [RETENTION](RETENTION.md) covers transitive closure and [MIGRATION](MIGRATION.md) covers additive rollout.

## BI1.5: required future checks

All NOT RUN: same display names in different owners/instances; import from another lineage; LOD promotion twice; named/cohort counts; copy promotion/transfer/consumption; missing pack versus death; fork/crossing remap; exact evidence after tombstoning; forged kind/scope/binding; no secret-backed names, hashes or aliases in public errors. All reasonable identity laws remain selectable through their world adapters.
