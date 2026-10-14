# B6 save shape and compatibility

Status: PROPOSED semantic schema, 2026-10-14. No engine schema number reserved, save modified or runtime migration implemented. Root must reconcile B2's body record, B3's inheritance/prestige and B7's generation slots before implementation. B6 owns generated-card definition/receipt semantics only, not a second body, family, person, inventory, clock or knowledge owner.

## B6-S1: authority split

| Owner | Stores | Does not store |
|---|---|---|
| B2 authoritative body owner | Stable body ID, generated slot references, current anatomy/template and linked card IDs | Duplicate actor knowledge, purse or RNG |
| Proposed generated-card ledger, nested in that owner or referenced optional expansion owner | Frozen intrinsic tuple/parameters/naming, provenance, generation cause and durable source binding | Mutable fuel, injuries, genealogy or narrative truth copied from other owners |
| Existing `actors[actorId].sources[sourceId]` | Valid registered source's acquisition/revision/origin/world/receipt | Arbitrary generated executable grants or new charge fields |
| Existing faculties/power owners | Awakening/active/suppressed/development and selected execution control | Another copy of intrinsic constitution truth |
| Existing knowledge owner | Each observer's evidence, diagnoses, confidence/basis and learned names | Global automatic true-label display |
| P1 | Immutable root, registered namespace, state/decision receipts | Card text regenerated on load |
| Genealogy/pact/custody/resource owners | Actual parent, donor, body/template, issuer, holder, charge and obligation state | Inheritance inferred from name or source's `origin` string |

Current source lookup is keyed by registered definition ID. It cannot automatically host arbitrary per-instance grants or two distinct same-definition organs. First-slice Default: a finite registered archetype catalog and one source binding per actor/archetype, with explicit combination rule. Dial: instance-aware source adapter for multiple organs or personalized parameters, with validation/query/remove migration. In-world reason: two physical organs may be distinct, while repeated recognition of one innate faculty is the same faculty. Do not rely on today's silent duplicate grant to enforce a fictional slot cap.

## B6-S2: example of proposed generated-card metadata

Synthetic public fixture only. IDs are illustrative bindings; no real body or source exists under these IDs. This is the C01 archetype independent of its sample deck position. Array lengths and namespaces are selected-slice configuration, not universal limits.

```json
{
  "schema": 1,
  "generatorRevision": "b6-card-v1",
  "cards": {
    "bodycard:fixture:c01": {
      "bodyRef": "body:fixture:valley-worker",
      "holderRef": "actor:fixture:valley-worker",
      "origin": {
        "worldInstanceRef": "b6.fixture.valley",
        "continuityRef": "original-fixture",
        "eraRef": "school-season-1",
        "profileRevision": 1,
        "lawRefs": [{"id": "fixture.qi_conversion", "revision": 1}],
        "evidence": {"mode": "inferred", "quality": "original-proposal"}
      },
      "generation": {
        "causeRef": "birth:fixture:valley-worker",
        "slotRef": "body:fixture:valley-worker:foundation:0",
        "namespace": "body.gen@b6.fixture.valley",
        "algorithmRevision": "integration-unbound",
        "tableId": "b6.valley.body",
        "tableRevision": 1,
        "contextRef": "snapshot:fixture:birth",
        "receiptRefs": ["draw:fixture:c01:tuple", "draw:fixture:c01:label"],
        "attemptSalt": 0
      },
      "truth": {
        "kind": "constitution",
        "tupleId": "C01",
        "mechanism": {"id": "C-M1", "revision": 1, "variant": "furnace_reservoir"},
        "trigger": {"awakening": "learned_circulation", "operation": "deliberate_refining"},
        "functions": [{"handlerId": "fixture.refine_heat", "revision": 1, "parameters": {"qiPerBatch": 1}}],
        "costRef": "fixture.qi_one_per_refining_batch",
        "discoveryRef": "fixture.measured_heat_test",
        "transmission": {"mode": "birth_template", "lineRef": "line:fixture:furnace", "ruleRevision": 1, "routes": ["BD1"], "retains": ["channel_potential"], "doesNotGrant": ["learned_refining", "stored_qi", "office"]},
        "name": {"grammarId": "b6.valley.body_names", "revision": 1, "cultureRef": "fixture.valley_school", "language": "en-original", "resolved": "Hearth Furnace Body"},
        "rarity": {"profileId": "b6.valley.apprentices", "cohortId": "fixture.apprentices", "eraId": "school-season-1", "regionId": "fixture.valley", "adjective": "unusual among valley apprentices", "tableRevision": 1, "weightBasis": "proposal"}
      },
      "binding": {"sourceDefinitionId": "fixture.body.furnace", "sourceRevision": 1, "sourceInstanceRef": "actor:fixture:valley-worker:fixture.body.furnace", "acquisitionReceiptRef": "acquire:fixture:c01"},
      "transitionReceiptRefs": []
    }
  },
  "causeIndex": {"birth:fixture:valley-worker:foundation:0": "bodycard:fixture:c01"}
}
```

Store resolved tuple values, spelling and exact executed definition revisions, not only a hash or seed. `contextRef` must pin minimal necessary values or an owner snapshot that survives compaction. Do not persist every P11 field for every body. Parent transmission references pin the transmitted template state at the actual transfer, rather than following future mutations to a parent's current card.

Draw receipts must retain namespace, stable cause/slot key, algorithm/table revision, selected tuple, integer draw or P1 equivalent, approved modifier/salt and original-receipt link for an explicit reroll. Fixture hashes in SAMPLES are documentation receipts, not valid runtime P1 receipts. Keep intrinsic truth privately in saves/author data; application projection remains separate even though local save contents are inspectable. Make no anti-cheat or encrypted-secret claim.

## B6-S3: commit and restore protocol

Preview is pure and uses KnownContext. An admission transaction rechecks body/actor/cause/owner sequence and law revisions, calculates a valid result on cloned state, reserves actual inputs, validates card/source/faculty references, and saves card plus RNG/receipt and costs before publishing native effects. Failed durable write publishes nothing. A retry with the same cause returns the saved result. Discovery uses a new evidence receipt against that card, not a generation receipt.

Delayed acquisition freezes result and costs in a pending commitment. Cancellation follows declared refund/forfeit rules; restarting the same cause keeps its selected result. A genuinely new acquisition is a new authorized cause, never a render-derived timestamp or ordinal. Exhausted/invalid candidate or name sets reject before publication. Outcome settlement and source grant are idempotent even after rolling engine history has pruned their entry.

Save/reload/Import restore the complete ledger and P1 state together. Never merge old save costs with a newer card or new RNG. Import validates into a detached candidate state, then replaces the chosen slot only after full validation. Reject an incompatible active resolver before touching the current slot; an optional read-only historic renderer may display already known facts but cannot execute unsupported power. Reload never invokes generator, awakening or inheritance merely because a missing field is noticed.

## B6-S4: validation and compatibility decision

Closed-key, plain-object validation checks safe IDs (including prototype-key rejection), integer bounds, supported schemas/revisions, bounded strings/collections, allowed kinds/modes, body/holder/world references, unique slots and bidirectional cause-index agreement. Every function, cost, discovery, law and transmission rule resolves to a reviewed definition. Validate actual source revision/receipt and faculty ownership; persistent cards cannot bind expired/removed sources as currently active. Stored parameter bounds/units and name token eligibility match the frozen revision. Contradictory or forged knowledge/transmission references cannot upgrade truth or mastery.

Do not reconstruct deleted lineage, parent state or generations from a label. Removing a donor organ disables the donor's actual function and moves that same organ under the selected custody/body transaction. Removing a source keeps the historical card with an explicit severed/removed binding and transition receipt, unless the chosen body policy actually discards it. A graft, mutation or fusion creates a declared next revision with parent/input links; source registration/compatibility is revalidated. World suppression changes operational support, not `truth.tupleId`.

Legacy Default: missing generated-card owner stays absent. Existing Natural balance, Conditioned grip, Palm mark, Field eye, reed bodies, devices and canon-authored sources keep their current identity, faculties, origin and behavior. Do not backfill genes, assign ancestors, reroll a body or infer a generated card from its name. A later opted-in slot can add a new compatible card without modifying prior sources. Unrelated old saves need no new RNG consumption.

Root selects an optional engine schema only after B2/B3/B7 and integrated P1 joins are known. The current `state.rng` cursor cannot recover the campaign's original root. If P1 is still absent, defer playable G47 or make an explicit opt-in migration that captures a new immutable domain root once and preserves old cursors unchanged, clearly acknowledging it is not the historical original seed. B6 does not authorize that migration.

Content updates preserve all admitted cards, names and receipts. Retain the resolver revisions, or explicitly translate values/functions with a migration receipt and compatibility decision. No silent regeneration under a new catalog. Missing private canon pack keeps protected truth out of public output and blocks unsupported execution, rather than replacing it with an original card. Unknown future schema is rejected before save publication.

## B6-S5: budget and cross-lane join

B7 owns lazy generation triggers and detail levels. B6 follows stable body slots regardless of the observer or order of inspections: first observation may materialize a card, but later scrutiny cannot create different intrinsic truth. B2 owns body swaps; a different body ID gets distinct slots, while the old body retains its cards. B3 owns heirs and actual carrier retention. D7/P4 own household/person identities; names never create relatives. D3 owns action-earned talents and its chapter receipts; body cards may reference actual completed work without claiming D3 is integrated.

Prototype budget Default: measure serialized UTF-8 growth after 1, 100 and 1,000 admitted synthetic cards and failed duplicate admissions. Deduplicate immutable definitions and pin referenced receipts/templates. Dial: configurable per-world active-body and archive budgets. In-world simulation depth changes which details are materialized, while storage limits only pause optional new generation with a neutral message. Never evict active body truth, settled transmission authority or pending commitments. These measurements are NOT RUN for a runtime schema; the JSON example is illustrative.

Future roundtrip checkpoints: dormant undiscovered, diagnosed-unawakened, active, suppressed by world law, injured/grafted, pending acquisition, cancelled acquisition, transmitted potential and learned recipient use. Compare cards, names, source/faculty/control, resource owners, parent/template refs, evidence and next P1 decisions after Save/reload and literal-file Import. Current B6 ran no save or private-data checks.
