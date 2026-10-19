# CR6 observer evidence, notebook and safe projection

2026-10-14. PROPOSAL ONLY. Extends root **II5/AB3, OA5, PCX1-PCX10 and SU1-SU10** through the existing P2 authority. CR3 owns the wider [collection](../cr3/COLLECTION.md) and [play-feel](../cr3/PLAY_FEEL.md) design; this file supplies the bounded build APIs and compatibility rules. No lens cheat, NPC research or comic world is newly implemented.

## F9-F11: shown/SOURCE versus stated design

| Code | Main-checkout file:line / owner | Finding |
|---|---|---|
| F9 shown/SOURCE | `src/mixture_state.js:27,39-40,75-79`; `src/mixture_native.js:16-22` | One player's exact-product observation is retained. Drinking marks observed and displays that product's full dose/side effect; method learning requires it. It is not a property-wide ingredient assay or per-observer model. |
| F10 shown/SOURCE | `src/mixture_ui.js:21,24,29-33`; `src/items.js:1221-1225` | Preview and item text use mixturePresentation. UI signature uses mixture sequence/inventory/readiness. Canonical key is attached to product DOM metadata; internal key embeds fractions. New knowledge revisions need render invalidation independently of mixture sequence. |
| F11 stated-design | Canonical weaponcraft `docs/WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md:349-355,479-485`; [comic CA5/CI3](../../../../COMIC_WORLDS_AND_MEDIUM_CONSIDERATIONS_2026-10-14.md) | P2 is agreed item/knowledge authority; one knowledge/fidelity extension is needed. Comic memory may retain superseded facts. These are design proposals/owner statements, not live general APIs. |

## AB3.a: exact API and observer scope

Proposed `src/crafting_knowledge.js` exports:

```js
createObserverKnowledge(observerRef)
validateCraftingKnowledge(knowledge,envelope)
stageObservation(knowledge,observation,authorizedAcquisition)
legacyMixtureEvidence(envelope,observerRef)
projectCraftingSubject(envelope,subjectRef,observerRef,viewContext)
knownComparisonCandidates(envelope,observerRef,protocolRef)
projectCraftingJournal(envelope,observerRef)
```

All pure, return snapshots or safe views; no storage, draws, chemistry mutation or implicit discovery. Caller supplies one observer ref `{world,instance,actor}`. Default UI binds the hero, explicitly; omitted/wrong observer rejects rather than falling back to global hero truth. Observer identity is distinct from `bodyRef` revision. A body change can preserve notebook knowledge under its explicit life law while response evidence remains tied to the tested body.

Proposed `crafting.knowledge`:

```js
{schema:1,observers:{
  /* canonical observer ref */: {
    sequence:0,
    evidence:{ /* id -> record below */ },
    claims:{}, contradictions:{}, notes:{},
    legacyBridge:{revision:1,source:'mixtures.knowledge'}
  }
}}
// one acquired evidence record
{
 id, subject:{family,definition},
 property:'oral.reference.healthRate', protocol:'counter.compare-health@1',
 context:{route:'oral-reference',body:'reference-village@1',process,lawRevision:1},
 result:{kind:'interval',low,high,unit:'native.health-per-minute'},
 basis:'shown', // shown | stated | inferred
 source:{kind:'experiment',receiptId,rootEvidenceId}, acquiredAt, validAt,
 fidelity:'measured', status:'supported',
 supersedes:null, contradicts:[]
}
```

Unknown is absence of acquired evidence, not numeric zero. `inapplicable` and `unsupported model` are different states. Claims store an attributed speaker/edition/source root and acquisition receipt; inferred hypotheses store supporting/conflicting evidence IDs and scoped conclusion. Shown experiment result is only what its protocol actually measures. A false claim changes knowledge/prediction, never product truth.

Grade/fidelity for this slice is semantic `seen`, `tested-exact-P2`, `measured-interval`, `claimed`, `inferred`; no global numeric grade ladder is imposed on other owners. Canonical weaponcraft's later F0-F5 mapping belongs to its reveal integration. Do not equate its F tiers with effect strength, source certainty or notebook completeness. A lens can later call `stageObservation` with its authorized scope/error/cost receipt; merely rendering a PCX2 overlay learns nothing.

## AB3.b: additive P2 bridge, no competing truth or evidence owner

Existing `mixtures.knowledge[p.id]` remains authoritative for the original player's P2 observation and `mixtures.methods` remains its learned-method owner. `legacyMixtureEvidence` projects those records into one scoped evidence view with a deterministic `legacy-observation` ID, original timestamp/source and exact current retained P2 dose. It does not copy that dose into a second mutable store or manufacture a consumption receipt. Context is **P2 revision-1 full-vial oral trial on its original native hero**, not every species, dose, route or ingredient. Keep the current observed P2 values/method gate unchanged for save compatibility.

The optional legacyBridge marks adapter revision only. On every P2 `use`, the new host stages normal P2 state/effect plus a journal notification/reference in one save. Core P2 truth and observation remain P2's records. Paid assay evidence goes into `crafting.knowledge` only; it never sets `mixtures.knowledge.observed`, grants a method or identifies other fractions. UI can show both exact oral trial and scoped assay. A later broader acquisition may create new acquired evidence with its own provenance; it cannot overwrite the earlier trial.

Observer B starts with empty evidence. Knowing what hero A made, inherited public names or privileged source validation does not grant B knowledge. NPC teaching/copying is a future acquisition transaction from CR4, preserving source roots; three copied notes from one experiment remain one root. The new API's two-observer tests prove isolation only, not implemented NPC research.

Import validates subject/law/protocol/receipt closure and evidence schema, bounds and measurement payload. An assay result must agree with its retained experiment inputs/results under the original protocol. User free-text notes are escaped metadata and carry no mechanical authority. Legacy P2 observed bool is honored as its prior save contract; this is structural save integrity, not authentication of player-edited save files. A valid player save can carry knowledge; an orphan evidence record cannot silently grant it.

## AB3.c: projection runs before every view

`projectCraftingSubject` returns only `{handle,name,knownForm,knownInputs,ownedCounts,evidence,uncertainty,availableActions,methodState}`. `handle` is an observer-local monotonic journal handle saved in `journal.handles`; it maps internally to the exact ref. No canonical key or hidden fraction in data attributes, link targets, labels, tooltips, copy text or ARIA. Handler closures retain the exact ref privately. Full save Export necessarily retains internal truth to restore the game; it is distinct from a notebook-view export and not described as secrecy from manual save inspection.

Known inputs/process for player-made P2 products are legitimate making observations. An unknown shop/NPC product does not inherit that provenance solely from registry truth. Registry may preserve legacy P2 display semantics for existing products, but new acquired response products record an actual made/seen receipt. Group/sort/filter by safe known preparation, known carrier, acquisition order or supported measured evidence, never hidden potency/grade. Prices stay fixed public carrier terms in this slice. Unknown values must not influence enabled actions, result counts, suggestion ranking or generic error text. Structural unsupported-data errors use a neutral compatibility message without printing JSON keys or hidden payload.

Native stat totals are observable effects in play. A symptom/effect view can show measured current agility/strength change without naming the underlying hidden compound or confirming all ingredient properties. For the new response slice, drinking is an explicit trial and records that product/count/body/time response; before the trial the UI says untested. Zero response records a tested zero for that protocol, not universal safety. The chemical ledger is internal; the body panel shows only symptom/evidence-authorized amounts. Damage/injury from other causes is not retrospectively attributed to a new trial.

Update new projections on `knowledge.observer.sequence`/journal sequence, stock and effect changes. P2 preview uses registry projection for optional crafting-aware reads, with a read-only detached owner/stream seed when no live P2 owner exists. Rendering never creates the owner, handles, evidence, receipts, stream cells or pending jobs. Allocate safe handles only during explicit acquisition/migration actions, persisted atomically.

## CR3-S1: paid comparison protocol

`src/crafting_journal.js` exports `stageComparison(frame,request)`, `completeComparison(frame,request)`, `cancelComparison(frame,request)`, `validateJournal(journal,envelope)` and `comparisonQuestion(knownViewA,knownViewB)`.

Protocol `counter.compare-health@1`: compare two owned whole P2 vials with **byte-equal inputs** and **different steep/boil process**. Hold family/law/body reference fixed. The counter's original calibrated reference-response assay measures only the P2 oral-reference health-regeneration coefficient, rounded to nearest **0.25**; each reading is interval `[max(0,reading-0.125),reading+0.125]`. This is a newly authored measurement consumer, not a primary canon apparatus or a claim that it physically drinks for a real NPC. Both vials are consumed into the assay's accounted spent-sample sink, no hero exposure. Stem/trace/stamina or all-purpose identification are outside this protocol.

Journal comparison save entry is `comparisons[id] = {id,status:'pending',observerRef,protocol:'counter.compare-health@1',protocolRevision:1,question,left:{ref,key,count:1},right:{ref,key,count:1},fee:4,station:'Village mixing counter',admittedAt,due,escrowStatus:'held',result:null,observationRefs:[],receiptId}`. Completion changes status to `completed`, escrowStatus to `spent`, result to the retained two readings/conclusion and observationRefs to acquired evidence. Cancellation changes status to `cancelled`, escrowStatus to `returned` and result stays null. Only pending/held entries own samples or reserved fee. Validate exclusive pending station occupancy, exact product refs, due=admittedAt+2, observed-result closure and matching receipt status. A completed/cancelled entry is history, never inventory. Handle allocation for acquired products occurs in the same admitted transaction.

`startCompare` request: `{id,expected,leftKey,rightKey,protocol,question:'process raises measured health response'}`. Stage debits exact count 1 from each key and **4 coins total**, records escrow of two exact refs/keys and fee, freezes protocol/world/station/terms, and holds one actual counter assay position. Due at calendar +2. Another pending test waits for this station; direct P2 mixing vessel remains separate. Cancel before completion returns exact vials and fee; canceled receipt remains, permitting a new paid test. Completion verifies free living hero at the same Village counter, settles the spent-sample sink and fee once and stores two measurements plus comparison conclusion atomically. It does not charge twice.

The pending comparison can save/reload/import or remain pending while the player is away/busy; no forced consumption on close and no wall-clock work. UI polling may request completion when due and eligible, as P2 does, but only host admission publishes. If settlement happens late, measurements remain the frozen protocol; no new seed draw. Zero extra RNG is needed.

Conclusion rules: disjoint intervals in expected direction -> **supported under this protocol**; disjoint opposite -> **contradicted under this protocol**; overlapping -> **inconclusive**; invalid controls -> rejected before admission, or **confounded** only for a separately supported protocol with explicit changed controls. A reversed left/right question can produce a negative finding without changing truth. Single comparison supports a local process distinction, not causal proof about every ingredient/family. Keep earlier contrary claims and show the conflict by attributed evidence ID.

Suggestions use seen inputs, processes, measurement resolution and actual stock/cost only. No look-ahead into hidden dose values to select the best experiment. Viewing a candidate or result performs no new measurement. The notebook can later offer tasting, study, paid experts, stronger assay or acquired lens routes; no mandatory self-poisoning or exclusive specialization.

## T-K: meaningful future unit cases

| ID | Proposed tests in `tests/crafting_knowledge.test.js` / `tests/crafting_journal.test.js` |
|---|---|
| T-K1 | Same product, two observers, different views; neither changes resolver/effect/key. Wrong observer cannot fall back to hero. |
| T-K2 | Legacy exact P2 observation and method preserved without copying mutable dose truth; repeated migration/render produces no evidence/draw/handle allocation. |
| T-K3 | Paid assay reveals only health interval, leaves P2 observed/method gate untouched; negative/inconclusive results and contradictions persist. |
| T-K4 | Same source copied twice keeps one evidence root; notes/false claims do not alter physical product or unlock methods. |
| T-K5 | Equivalent known projections over different hidden truths give equal list/sort/filter/recommendation/action/error metadata. Secret synthetic fixture marker absent from text, DOM, ARIA and notebook export. |
| T-K6 | Pending cancellation/fee refund/sample accounting, duplicate settlement and failed-write no-op; consumed sample refs remain valid. |
| T-K7 | Real paired controls differ only in preparation; stale stock/purse/station/protocol rejects before spend; measurement bounds recompute on import. |
| T-K8 | Knowledge-only changes invalidate view signature without losing focused controls/selection; grouping never merges actual variant stock. |

Source labels here describe evidence basis, not final truth. No canon text or private novel notes are quoted. Comic panel/caption/continuity surfaces remain with the comic owners. At final refresh, [K1](../../comics-2026-10-14/K1_REPORT.md), [K2](../../comics-2026-10-14/K2_REPORT.md), [K3](../../comics-2026-10-14/K3_REPORT.md), [K4](../../comics-2026-10-14/K4_REPORT.md) and [K5](../../comics-2026-10-14/K5_REPORT.md) completed research reports. Their corrections support separate observation rights, rank domains and medium/world-law layers. CR6 adopts those design distinctions by attribution, without claiming primary comic verification or accepted mechanics. AB3 leaves room for dated memories after a later explicit continuity event without rewriting product truth today.
