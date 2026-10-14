# CR6 registry and item identity

2026-10-14. PROPOSAL ONLY. Extends root **II1, II2, II4, II6, II7 and AB1, AB4-AB7** in the [crafting palette](../../../../PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md). Runtime implementation is not authorized by this packet. [REPORT](REPORT.md) owns build order and source snapshot; [EXPOSURE](EXPOSURE.md), [KNOWLEDGE](KNOWLEDGE.md) and [SLICES](SLICES.md) complete the contract.

## F1-F4: current seams, shown/SOURCE

| Code | Main-checkout file:line | Inspected behavior |
|---|---|---|
| F1 | `src/mixture_state.js:15-45,47-74` | Revision-1 material truth and products are retained; validation recomputes products under that retained law. Key is exactly JSON `{id:'Village mixture',mixture:product.id}`; the product ID embeds ordered inputs, process, fractions and mass. Whole-vial dose is concentration-normalized. |
| F2 | `src/items.js:238-253,1217-1226`; `src/components/inventory_component.js:21-46` | Ordinary keys encode ID/components/quality. P2 has an explicit generated decoder and whole-positive-vial insertion guard. An extra JSON property is not a general registered decoder. |
| F3 | `src/mixture_native.js:5-35,38-43`; `src/main.js:4696-4708` | Pure staged stock/money/mixture/effect becomes one envelope write before live publication, but hero inventory and one effect ID are hardwired. It lacks expected-sequence admission/replay protection for a reused plan. |
| F4 | `src/seeded_streams.js:23-40,46-77`; `src/main.js:2` | Saved stream root supplies a pure one-time P2 seed; retained P2 truth is read on reload. `streamSeed` calls `ensureStreams`, so it is pure as a draw but can initialize a missing stream owner. Preview must use a snapshot if initialization would mutate live state. |

These findings describe source, not new runtime proof. New contracts below are inferred design choices and remain proposals.

## AB1.a: exact modules and exported APIs

Use a static registry, with `village.mixtures@1` registered first. No dynamic plugin evaluation, arbitrary imported JS or parallel inventory. New family IDs name semantic law revisions, not player-facing names. Keep pure modules independent of main, DOM, item classes and mutable singleton state.

| Proposed module | Exported API and responsibility |
|---|---|
| `src/product_registry.js` | `PRODUCT_FAMILIES` frozen table; `classifyProductKey(key)` returns `{family,ref}` or `null` for an ordinary item and throws for a malformed reserved generated key; `resolveProduct(envelope,ref)` validates/returns immutable truth; `keyForProduct(envelope,ref)` returns canonical key; `validateProductEnvelope(envelope)` validates definitions and all generated references; `projectProduct(envelope,ref,observer,context)` delegates through AB3; `productItemSpec(envelope,key,observer,context)` returns safe usable/item class data with fixed public value/tags. No owner singleton or resource mutation. `product_runtime.js` in SLICES supplies the narrow live read binding to existing item reconstruction. |
| `src/mixture_product_family.js` | Export `mixtureProductFamily`: `{id,acceptKey,decodeKey,encodeKey,readProduct,validateOwner,validateProduct,validateUse,project,makeItemSpec}`. Calls existing `mixtureKey`, `productFromKey`, `validateMixtureState` and `validateMixtureEnvelope`. It reads `envelope.mixtures`, never copies the catalogue. Does not import registry, avoiding a cycle. |
| `src/consumable_product_family.js` | Export `responseProductFamily` with the same interface; `resolveResponseProduct({inputs,process})` and `validateResponseProduct(product)`. Owns the original response-vial law in SLICES. Reads only its family record below. |
| `src/crafting_state.js` | `createCraftingState(scope,clock)`, `migrateCraftingEnvelope(envelope)`, `validateCraftingEnvelope(envelope)`. Pure clones/returns normalized envelope, validates family owners, AB2/AB3/journal refs and native effect closure. Missing owner stays absent until opt-in or first supported P2 observation bridge; unsupported revisions reject. |
| `src/crafting_native.js` | `stageCraftingAction(frame,request)` returns a plan or throws without mutation; `commitCraftingPlan(plan,{readFrame,createSave,validateEnvelope,write,publish})` rechecks expected revisions/stock/access, patches explicit paths, validates full envelope, writes once then publishes. P2 requests call `stageMixtureAction` rather than copy its resolver. All new actions use this host, including P2 observation bridge. |

Family interface: `decodeKey` returns `{family,definition}`; `encodeKey(product)` returns a canonical inventory key. `validateUse(product,{route,count,target,world})` admits only supported routes/whole counts. Registry does identity/validation/projection dispatch; it does not implement chemistry or convert foreign laws. An ordinary key returns to the original decoder. Reserved `productFamily`, `productRef` or legacy `mixture` fields on an unsupported base ID reject, rather than fall through to a template.

P2 ref: `{family:'village.mixtures@1',definition:p.id}`. Encode it with the existing byte-identical key. Response ref: `{family:'village.response@1',definition:'vr1:...canonical original payload...'}`. Response key has ordered fields `JSON.stringify({id:'Village response vial',productFamily:'village.response@1',productRef:p.id})`. `validateResponseProduct` recomputes the identity from revision/process/ordered inputs/fractions/mass/consumer and recomputes its payload; reject extra key fields, duplicate semantic IDs and noncanonical field order. No hash collision or player name in identity. The new carrier template value is a fixed public 12 coins, independent of hidden active truth, pending a separately selected economy law.

## AB1.b: save shape and one owner per datum

Proposed optional top-level owner, schema 1 local to crafting. This is not a reserved global fork schema; leave `fork_schema` and game-version policy to root's compatible version owner. The next supported game version must be chosen against live code at dispatch.

```js
// Existing owner remains byte-for-byte in its established representation:
mixtures: {schema:1,revision:1,seed,sequence,profiles,products,
           knowledge,methods,job,hiddenMethod,lastObservation},
// New optional owner:
crafting: {
  schema:1, sequence:0,
  scope:{world:'base.frontier',instance:'native.frontier'},
  families:{
    'village.response@1': {schema:1,revision:1,products:{ /* id -> product */ }}
  },
  exposure: {schema:1,bodies:{ /* body ref -> AB2 ledger */ }},
  knowledge: {schema:1,observers:{ /* observer ref -> AB3 evidence */ }},
  journal: {schema:1,sequence:0,comparisons:{},notes:{},nextHandle:0,handles:{}},
  receipts:{} // id -> committed action summary; active refs prevent compaction
}
```

No `families['village.mixtures@1'].products` copy: registration is static; the adapter reads `mixtures.products`. A missing `mixtures` owner is never created on load. Response owner appears on first actual response mix. Registry order is not a discovery denominator. Truth includes retained family/law/consumer revisions; render must not re-resolve it using a new law.

`crafting.receipts` records action ID, request fingerprint, before/after sequence and exact affected refs/costs. API callers supply `request.id` plus `expected:{craftingSequence,mixtureSequence?,journalSequence?,stock,purse,bodyRevision?}`; first admission without crafting expects absence. Commit compares current values again. An identical committed ID returns its recorded result without another debit; same ID/different request fails. Sequence becomes durable only on successful commit. Count and IDs are checked with safe integer/unsafe-key guards. Different new paid requests remain repeatable; this is transaction identity, never a global once restriction.

`publish` receives already validated/constructed next owner and item/effect instances; it only swaps prepared owners, then renders. A failure after durable write pauses play/reloads that saved envelope, never refunds or retries the spend. A failure before write publishes nothing. Use existing life-writer lock and `lifeSaveStorage`; the writer already governs stale-tab safety. Do not invent another lock or raw-localStorage writer.

## AB1.c: compatibility and migration

Migration order: structurally validate the original P2 owner/holders/exposure using the revision-1 reader → clone envelope → migrate absent/new optional crafting owner → validate entire cross-owner graph → real isolated-loader preflight → durable write → load normalized owners before any inventory reconstruction. Calling validation twice is idempotent and draw-free. `save_files.js:45-47,168-201` and `main.js:5341-5342` are the joins. The default migration never rewrites keys, profiles, products, hidden records, learned methods, reservations or streams.

| Input | Required proposed disposition |
|---|---|
| Pre-P2 save, no generated keys/effects | Preserve absent `mixtures` and `crafting`, old inventories/effects/food options and streams; no automatic crafting unlock or seed generation. |
| P2 only, products in hero/chest/vendor/storage/job | All keys/definitions preserved. Adapter validates complete envelope just as P2 does. New stores can stay absent until the player opens/uses the notebook or uses a product. Opening may stage an explicit zero-cost migration action, never mutate on render. |
| P2 consumed source + active exposure | Retain exact dose, effect stats, remaining native duration and original metadata. Derive a deterministic legacy observation/ref and ledger mirror only at migration/opt-in as detailed in EXPOSURE/KNOWLEDGE. Do not replay a drink or assume full duration. |
| P2 observed products/method/job | Preserve observation and method authorization. New knowledge bridge retains exact observed dose scope; job due, held and remaining keep existing timing. Full-vial law stays revision 1. |
| New owner plus P2 | Validate mirrors against original P2 owner and reject disagreement; never choose a more generous interpretation. Preserve ordinary legacy item/component/quality keys untouched. |
| Unsupported meaningful family/law/schema, forged dose, orphan key or receipt | Reject before storage or live owner replacement, with safe generic error. This packet chooses rejection, not silent drop/dormant fallback. Export the prior compatible life remains available. |

Do not garbage-collect consumed definitions while an observation, receipt, pending job, native exposure or holder references them. Initially use the existing guarded save budget (`src/save_files.js:206-226`); no new gameplay caps. Compaction later must preserve reference closure, cumulative statistics and evidence roots.

## AB4-AB7: reachable extensions, deliberately separate from this build

| Root code | Concrete adapter contract and first later proof |
|---|---|
| AB4 / II4 | `MakerContext` is `{actorRef,worldRef,inventoryBinding,purseBinding,skillSnapshot,stationRefs,observerRef}` frozen at admission. This build binds hero only; CR4's [NPC crafters](../cr4/NPC_CRAFTERS.md) owns labor and stock parity. Later a paid NPC uses the same pure resolver and their own binding, never swaps global character state. |
| AB5 / II7 | Add a world-instance uniqueness owner only for a selected exact identity law: token ref, current holder, lifecycle/reincarnation revision, transfer receipt. Allocation/transfer updates it in the same transaction. No unique flag or registry enrollment for ordinary vials. Proof: transfer one token without duplication while lawful ordinary repeats remain possible. |
| AB6 | Item continuity reads origin law/continuity revision and a directional retain/dormant/transform policy. Default here preserves owned products and exposures; no retcon/reboot implementation. Later explicit opted-in transition keeps pre/post refs and observer memories, per [comic CO5/CA5](../../../../COMIC_WORLDS_AND_MEDIUM_CONSIDERATIONS_2026-10-14.md). |
| AB7 | Immutable design revision has parent design refs, tested method ref and author/contributor receipt roots. Current product identity remains distinct from design lineage and physical instance. Proof: two reachable versioned methods produce/use real items and earlier revision still works, per [CR4 MAKERS](../cr4/MAKERS.md). |

II6 material catalogue revision is a per-family owner extension when generated input lots are selected. The response fixture's fixed original ingredient table does not claim PG1 or a general flora catalogue. P8 retains acquisition/condition/site ownership. A future instance ref is needed for wear/parts/charge; this build uses whole identical vials and avoids pretending their stack key is a unique physical specimen.

## Canonical weaponcraft and maker-arts alignment, root correction

[ROOT_NOTE](ROOT_NOTE.md) directs CR6 to **maker-arts W4 plus weaponcraft R1**, not the stopped R3 lane. Read [W4 IMPLEMENTATION](../../maker-arts-2026-10-14/IMPLEMENTATION.md) and [W4_REPORT](../../maker-arts-2026-10-14/W4_REPORT.md). Weaponcraft [R1 brief](../../weaponcraft-runes-2026-10-14/R1.md) was read; its [session owner](../../weaponcraft-runes-2026-10-14/runs/SESSIONS.md) records R1 stopped as a duplicate of maker-arts W1 at line5, and R3 stopped as a duplicate of W4 at line7. `BY_WORLD.md`/`R1_REPORT.md` are absent at this correction's read. Therefore source-world alignment uses the actual replacement [W1_REPORT](../../maker-arts-2026-10-14/W1_REPORT.md) and [MAKER_ARTS_BY_WORLD](../../../../worlds/MAKER_ARTS_BY_WORLD_2026-10-14.md), retaining R1's scope without inventing a finished R1 result. No restart or duplicate worker is needed.

Adopt the canonical palette's **AB1/AB5 -> P6 assembly, AB6 -> P6 pattern graph** correction and **P2 item/knowledge authority** at `docs/WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md:336-355`. W4 supplies the engine-contract comparison that the old CR6 paragraph incorrectly treated as missing R3 work. W4's AB codes belong to the maker-arts palette and are not the identically numbered crafting AB codes above. All W4 shapes/APIs and this alignment remain inferred proposals; W4 source findings are attributed shown/SOURCE, not new CR6 execution evidence.

| Code / relation | W4 locator and adopted contract | CR6 implementation-packet implication / qualified difference |
|---|---|---|
| ID1 definition, lot, copy | `docs/gm/dispatch/maker-arts-2026-10-14/IMPLEMENTATION.md:45-46,77,83-84,96-121`; W4 Q1. Adopt P38's qualified refs and definition/lot/copy distinction, existing holders and full retained truth. | `{family,definition}` above is an owner-local immutable **product-definition selector**, not a global EntityRef, lot ID or physical vial ID. A registered legacy gateway maps it to P38's owner-qualified `RecordRef`/definition entry with save lineage and scope. Journal handles are observer-view handles only. Whole identical vials remain fungible counted stock; actual manufacture/use receipts preserve quantities without assigning every vial a copy ID. A promised lot-specific origin/condition needs a lot binding; per-copy history/wear/charge needs atomic promotion and exclusive holder validation. No second `makerItemId` directory or global inventory. |
| ID2 retain legacy wire meaning | `IMPLEMENTATION.md:51,123-137,188`; W4 IM7/M1-M5. Adopt read-only legacy views, pure idempotent migration, complete decoder preflight and retained executable laws. | P2 keys/dose/job/methods and ordinary ID/components/quality stay unchanged. W4's illustrative `{id,instance:<copy ref>}` codec applies when a selected mutable individual exists; it does not replace the whole-vial response key or allocate copies for fungible P2 stock. Response family's proposed codec/schema are local candidate choices, not allocated shared versions; P38/core A1 integration chooses the external binding/version before code. Existing `e2_instance` and per-hit wear remain untouched. No second condition owner. |
| ID3 knowledge gateway | `IMPLEMENTATION.md:50,71,84`; [P38 STORE_OWNERS](../p38/STORE_OWNERS.md), BI3.2/BI3.5. Adopt one observer read façade over sole backing writers, with property/protocol/basis/fidelity. | `crafting.knowledge` in the proposed save shape is only the additive crafting assay/claim backing partition. P2 remains its exact-product observation writer. `projectProduct`/AB3 delegates through the proposed `knowledge_state` façade when registered; it does not become a competing universal knowledge service. Existing KNOWLEDGE APIs remain the narrow adapter contracts, no automatic numeric F0-F5 conversion or material mastery. |
| ID4 one outcome, domain accounting | `IMPLEMENTATION.md:73,84,112-121`; W4 AB8 and C2. Adopt one canonical outcome log plus reference indexes, current domain state authoritative, exact transitive pins. | `crafting.receipts` above holds operational idempotency/accounting for its own action, not a maker biography/outcome log. When the P38 outcome bridge is selected, it emits/references one canonical outcome at the proposed `expansion.loreHistory` seam, without copying full outcome bodies into products, journal entries or item histories. Ledger delivery/result payloads needed to execute or validate dose/evidence remain with their domain owner. No RNG diagnostic ring as history. Retain consumed-product/law/receipt closure; a tombstone cannot replace executable truth. |
| ID5 family consumer and publication | `IMPLEMENTATION.md:66-69,72,75-76,125-129,139-163`. Adopt per-family material/process/response semantics, one native consumer owner and one guarded transaction. | Registry is identity/codec/projection dispatch over P2 and the new response law, not a new maker bootstrap, part graph, modifier engine or universal rune compiler. Potions do not become blade cut/heat responses. P6 [SMITHING](../p6/SMITHING.md)/[PATTERNS](../p6/PATTERNS.md) retain structural semantics. Exposures own response; native stats own composition. W4's equipped-object versus key-loader and pending-strike requirements apply if equipment is later enrolled; the present usable-vial slice does not claim equipped-copy or strike restoration. |

ID2 now **agrees with W4's wrap/promote-on-demand stance**. The qualified difference is with canonical weaponcraft's earlier IM7 blanket single-part migration, not with W4. CR6 also retains the requested poison/antidote then paid-notebook build order, whereas W4 PS1-PS5 suggests braces/repair/blades/appraisal/lamp (`IMPLEMENTATION.md:205-225`). Both are menus with complete paid-use/persistence gates; W4 does not supersede the user's selected CR6 outcome or make all maker slices prerequisites.

### R1 source-world guardrails through its W1 replacement

Adopt bounded source distinctions from `docs/worlds/MAKER_ARTS_BY_WORLD_2026-10-14.md:33-42` (WQ4-WQ13 and E04-E13 locators). Fabrication, ownership, bond/attunement, fuel and the holder's source means remain separate identity/consumer dimensions. In particular, source-qualified blade manufacture does not copy a prior holder's release; a copied design does not grant exceptional projection; a frame/formula does not supply its battery or casting source. These are attributed W1 corrections with their source limits, not fresh CR6 primary-canon checks. W1's WQ11 locator correction and WQ12 substitute-versus-original-material distinction stay attached to their source entries; neither becomes a universal recipe.

Consequently AB5 uniqueness, AB6 continuity and AB7 design lineage above need a **selected source/continuity law**, not a franchise-name flag, generic unique-once toggle or one universal quality rank. Canonical items can use exact conserved identity alongside generated functional profiles. The new Village response fixture stays explicitly original; it grants no source-world manufacture, soul/bond, attunement, rare token or inherited maker faculty. Strong lawful exceptions remain reachable under their explicit world adapter.

Weaponcraft R2 [report](../../weaponcraft-runes-2026-10-14/R2_REPORT.md)/[game references](../../weaponcraft-runes-2026-10-14/GAME_REFERENCES.md) remain supplementary: adopt GX7 claims notebook, GX8 paid-step repetition and GX1 distinct symbol/mixture/program semantics. Engine alignment and future interface refresh route to **W4**, source-world alignment to **R1's W1 replacement**, with P38/core A1 selecting shared wire/owner bindings. R3/WR4 are stopped duplicates, not missing gates.
