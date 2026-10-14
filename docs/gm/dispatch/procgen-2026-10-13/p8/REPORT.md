# P8 resources and harvesting generation

Status: DOCS PROPOSAL COMPLETE, 2026-10-14. No gameplay implemented. No runtime edits, builds, tests, browser play, personal saves or commits. Root owns later selection, integration and commits. [CHECKPOINT](CHECKPOINT.md) is the resume surface; [LIVE_AUDIT](LIVE_AUDIT.md) and [source fingerprints](AUDIT_SOURCES.json) own this sampled source evidence.

The first proposed playable outcome is an optional resource ledger: survey an original herb patch, collect a specific batch, learn a scoped property, and use it in P2 mixing. Later additions let Weibao select plant parts, recover a patch, preserve cargo, commission supplies and automate a known route. Recommendations do not impose a global Village opening, forced either/or choice, another prestige layer or a fixed once-per-player limit. Every reasonable route remains available through its actual local means.

## Findings and authority

F1: Native gathering already scales duration, chance, quantity and optional quality with skill, but the reviewed path reads authored tables and template keys. Source-site reserves, part identity and impurity inheritance need explicit owners/adapters. [Audit F1-F3](LIVE_AUDIT.md).

F2: Local-life one loose-object searches, crop settlement and conserved spiritual identity are local resource facts. They do not authorize universal fixed once limits. Renewable producers, new paid crop cycles, new encounters and lawful alternate supply remain available. Idempotent receipts stop duplicate settlement, not new play. [Audit F4/F9/F16](LIVE_AUDIT.md).

F3: Seasons/weather, regional sale saturation and real shipment/crop reservations exist. Extend their owners for resource context, physical manifests and renewal rather than inventing replacement global clocks/prices. Main source and P1-P4 branch proof remain separate. [Audit F5-F15](LIVE_AUDIT.md).

D1: All generation laws, numbers, slice rankings and schemas here are proposals. Accepted authority stays [PROJECT](../../../../../PROJECT.md#standing-priorities-and-document-authority) and [USER_VISION](../../../../USER_VISION.md). UI target for each future slice: 1366x768 laptop plus 1600x1000 desktop, visible known site/stock, chosen operation, exact useful output and interruption state. Mobile optimization, universal offline progression and procedural map layouts remain deferred. Canon-first world order remains intact; an original Frontier slice tests reusable acquisition mechanics without displacing book/anime priorities.

## Shared resource contract RC1

This is a proposed acquisition layer over the [generation ontology](../../../../research/procedural-materials-2026-10-13/deep/GENERATION_CONTRACTS.md), ordinary/living atlases and P2/P6 owners. It owns **where stock comes from**, not a second definition registry, inventory, person store or weather simulation. All field names below are semantic, not claimed live API exports. Start with only fields read by the selected consumer.

| Record | Fields and meaning |
|---|---|
| ResourceLaw | `id/revision`, source/continuity evidence refs, resource form, legal operations, amount basis/conversions, conservation domains, extraction/renewal/condition/compatibility rules, consumers and projection policy. Local adjectives map to versioned parameters; no global once policy. |
| RegionProfile | world/instance/era/region refs, authored location anchors/habitat/geology, admitted family refs, jurisdiction/source-access refs, current context owner refs. Geographical region and market region have an explicit mapping. |
| ResourceSite | stable ID, generation scope/receipt, family/law/generator revisions, frozen resolved placement/reserve/zone or producer truth, source custody/access refs, depletion/pressure, next boundary and revision. Seed alone is insufficient restore data. |
| HarvestIntent | actor/participant/site refs, selected operation/part/zone/tool, target quantity, explicit substitution/overflow/absence policy and receiver. Intent is not owned yield. |
| AdmittedJob | stable command/cause ID, expected owner revisions, exact input/source/tool/labor escrow, frozen terms/context or declared boundary revalidation, stage/progress/clock/next boundary and cancellation/return policy. |
| AcquisitionReceipt | cause/site/cycle/operation, actual costs/source debit, resulting batch refs, useful/side fractions, losses/emissions, conserved identity transfers, XP/knowledge refs, draw allocation and commit revision. Settlement replay returns the same receipt. |
| OwnedBatch reference | Reference into material/P2 owner with exact amount/unit/basis, family/definition/law revisions, composition/structure/condition, origin and custody. No generated metadata hidden only in an inventory display string. |
| Observation | observer/subject/protocol, sample scope, shown/stated/inferred basis, value/range/confidence, timestamp and attributed contradictions. Imported truth validation does not grant discovery. |
| SupplyManifest | actual supplier/merchant/carrier/receiver, held batch refs/funds, quote revision/terms, route/compatibility law and delivery boundary. Existing sale saturation remains a separately owned input. |

D2: Six resource forms stay distinct: divisible material, countable/conserved identity, assembly, pattern, ongoing grant and living substrate. Charge is its own local amount domain even in a physical stone. Preserve unknown/absent/unsupported/inapplicable separately. Assay uncertainty is knowledge; missing simulation law is unsupported. Exact canon identity can coexist with functional profile substitution, with each recipe declaring which role it reads.

D3: Admission sequence: resolve world/region/law and P11 context revisions → validate feasible family/site/process/consumer and actual participant means → stage one committed P1 named draw allocation if needed → resolve correlated original truth → validate quantities/identity/reachability → durably save the complete envelope → publish source, stock, job, knowledge and draw together. Failed writes publish nothing. Render, preview, load and Import preflight consume no draws and allocate no site IDs. Placement/admission and later harvest variability use distinct scoped allocations. Do not guess the P1 exported function until root integration is reviewed.

D4: Region/deposit/producer truth is chosen once at admission and saved; a batch inherits relevant source facts plus actual harvest condition. Processing updates selected fractions/structure under P6 law, not random species truth. Transfers/splits preserve provenance and heterogeneous members where consumed; merging can visually group lots without erasing selection. Identity and charge losses go to declared destinations or exits. Regrowth pays actual new supported growth inputs; dead stock does not reproduce.

D5: UI reads an observer-filtered projection, never the raw site/material context. Unknown behavior can act before discovery. Names, sorting, prices, action reasons, hidden candidate counts and reports must not leak sealed truth. Cross-world import retains origin semantics and asks for a **directional executable compatibility law**, with actual conversion payer/loss if supported. Unsupported use retains owned material; it does not silently become native stock.

## Five recommended slices

All gates OPEN. Ports start at 19800 and are prospective suggestions, **not assignments/reservations or running servers**. Root checks collisions and ownership before any later dispatch. Complete one useful slice before the next; ranking is not compulsory implementation scope.

| Rank / code | Playable outcome / bounded spec | Dependencies | Proposed exclusive builder ownership; shared joins | Suggested branch / port | Required acceptance |
|---|---|---|---|---|---|
| 1 / R1-A | Survey two original herb patches; sample/assay one and gather exact P2-compatible input → usable product. [Deposits](DEPOSITS.md) | Integrated P1/P2; base endpoint and existing survey/means; RC1 subset | `src/resource_sites_{state,content,host,ui}.js`, focused tests. P2 owns ingredient truth/key bridge; root main/save/locations integration | `proc/resources-r1-sites` / 19800 | G1-G5; natural paid site/sample/batch/consumer, uncertain assay, frozen placement/draw and legacy owner absent |
| 2 / R2-A | Leaf/root and gentle/bulk methods produce actually distinct supported input and useful residue, sequentially reachable. [Harvest](HARVEST_YIELDS.md) | R1, P2 actual batch adapter; selected P6 byproduct consumer | `src/resource_harvest_{laws,content,host}.js`, tests; R1 owner changes site depletion, P2/P6 own product law; root shared items/inventory bridge | `proc/resources-r2-parts` / 19810 | G1-G5; selected tool/part reads, accounted yields/side fractions, actual different useful output and exact selected batches |
| 3 / R3-A | Concentrated harvest changes readiness; rotation/tending restores supply and permits a new real harvest. [Ecology](ECOLOGY.md) | R1/R2, native calendar/weather owner; optional P11 context | `src/resource_renewal_{state,laws,host}.js`, tests; R1 site owner and root clock/save join; weather owner controls weather.js | `proc/resources-r3-renewal` / 19820 | G1-G5; natural pressure/recovery/repeat, boundary equivalence, no compulsory hunger/global once gate |
| 4 / R4-A | Carry fresh stock or pay for field drying; store and use both through supported consumers. [Logistics](LOGISTICS.md) | R1/R2, P2/P6 condition/process consumer, explicit opt-in receiver | `src/resource_logistics_{state,laws,host,ui}.js`, tests; item/pack/storage owners adapt, root publication/save joins | `proc/resources-r4-cargo` / 19830 | G1-G5; natural carry/preserve/store/use, exact age/water/residue, full receiver/cancel, unchanged ordinary stacks |
| 5 / R5-A | Buy sourced lots, receive funded deliveries and see a declared supply-sensitive quote; gathering remains an option. [Supply](TRADE_SUPPLY.md) | R1, integrated P1/P2, existing saturation/trader owner; P11 market context if selected | `src/resource_supply_{state,content,host,ui}.js`, tests; trader/market owners integrate refresh/valuation, root main/save/trade joins | `proc/resources-r5-supply` / 19840 | G1-G5; natural physical shipment/quote/use, no hidden potency pricing/double refill, conserved campaign stock retained |

## Ranked below those five

| Rank / code | Outcome / spec | Dependencies and ownership | Port suggestion / acceptance |
|---|---|---|---|
| 6 / R6-A | Nonlethal herd collection plus a separately acquired accounted carcass, both useful. [Creature resources](CREATURE_RESOURCES.md) | R2/R3; P6 textile/food; P4/P7 actual actors only if workers/rights needed. New `resource_creatures_*`; combat/loot owner prevents part double pay. | 19850; G1-G5 plus living/carcass/donor control and source rights, not merely wool item drops |
| 7 / R7-A | Prospect one original ore vein, assay, refine at source or haul raw, make an actual P6 part. [Deposits](DEPOSITS.md), [logistics](LOGISTICS.md) | R1/R2/R4 and P6 smithing consumer. New ore rules under resource owner; P6 owns refining/part effects. | 19860; G1-G5 plus zonation/grade/impurity/recovery/waste and actual equipped/fixture function |
| 8 / R8-A | Paid original ambient collector supplies and replenishes a useful lamp. [Exotic](MAGICAL_RESOURCES.md) | RC1 charge domain/site; actual lamp consumer; P9/P10 only for later sourced canon adapters. New `resource_energy_*`; artifact/body/world owners retain their domains. | 19870; G1-G5 plus source-charge-carrier conservation and incompatible-use retention |
| 9 / R9-A | Known two-patch route returns real cargo for a learned P2 method, then paid helper variant. [Idle](IDLE_GATHERING.md) | R1/R3/R4, P2 learned job, P4 actor bridge/helper contracts when ready. New `resource_routes_*`; scheduler/labor/expedition owners join serially. | 19880; G1-G5 plus stage/shortage/full receiver/cancel and actual funded helper; closed-browser pause initially |
| 10 / R10 | Selected sourced canon resource loop for one world; [world adapters](WORLD_VARIATIONS.md) | P9/P10 profile, selected private primary scene and compatible runtime pack, actual downstream consumer. No generic cross-world energy adapter implied. | 19890; source/continuity gate before G1-G5; exact identity/rights/reset/containment gate per row |
| 11 / R11 | One selected extra from [MORE](MORE.md) | Its owning lane/means/consumer and RC1 adapter; no blanket extras implementation. | 19900 prospective first extra; named useful consequence and G1-G5 |

## Dependencies, boundaries and file ownership

| Lane / owner | Reuse and handoff boundary |
|---|---|
| P1 streams | Read its [checkpoint](../../../../../.claude/worktrees/proc-p1-streams/docs/gm/dispatch/procgen-2026-10-13/p1/CHECKPOINT.md). Root integrates/finalizes API before acquisition draws. P8 does not patch its RNG or copy another PRNG. Branch-reported proof is not P8 proof. |
| P2 mixing | Read [report](../../../../../.claude/worktrees/proc-p2-mixing/docs/gm/dispatch/procgen-2026-10-13/p2/REPORT.md). It owns material truth, generated product reference/decoder, experiment/methods/exposures and repeat reservation. Adapter must preserve exact selected ingredient lot truth/amount; current count-based ingredient packs do not automatically represent P8 part/condition variants. One implementation owner resolves that seam. |
| P3 storylets | Read [report](../../../../../.claude/worktrees/proc-p3-storylets/docs/gm/dispatch/procgen-2026-10-13/p3/REPORT.md). Delivers clues/offers/aftermath from actual resource receipts; never rolls alternate resource truth or invents goods. |
| P4 people / P7 | Read [P4 report](../../../../../.claude/worktrees/proc-p4-people/docs/gm/dispatch/procgen-2026-10-13/p4/REPORT.md) and [P7 shape](../p7/DATA_SHAPE.md). People keep their own IDs, stock, knowledge and rights; a helper requires explicit actor/labor bridge. Do not add a resource-side duplicate merchant/person store. |
| P5 | [Report](../p5/REPORT.md), [extras](../p5/EXTRA_IDEAS.md), [appearance](../p5/O3_APPEARANCE_SHUFFLE.md) and secret/lore specs retain selection, presentation and secrecy. Resources can supply feasible witnesses and outcome receipts, never expose secret truth. |
| P6 creation | [Audit](../p6/LIVE_AUDIT.md), [smithing](../p6/SMITHING.md), [cooking](../p6/COOKING.md), [tools](../p6/TOOLS_TEXTILES.md), [salvage](../p6/REPAIR_SALVAGE.md), [patterns](../p6/PATTERNS.md) own transformations/products. P8 delivers raw batches and real costs; no duplicated alloy/brew/assembly resolver. |
| P9/P10 world profiles | [P9 checkpoint](../p9/CHECKPOINT.md), [P10 source notes](../p10/SOURCE_NOTES.md) remain profile owners. P8 world table covers acquisition only, and later readers may tighten source gates. No fixed universal source quantities invented. |
| P11 context | [Context](../p11/CONTEXT.md) supplies frozen identity, environmental, social, actor and knowledge context with provenance/availability. P8 reads eligibility/quality/source facts; does not enroll weather or people during lookup. Broader markets/requests/disasters remain P11. Its [requests/markets](../p11/REQUESTS_AND_MARKETS.md) and [creature joins](../p11/ECOLOGY_AND_COMPANIONS.md) appeared during final review; P8 owns physical supply and harvest/renewal, P11 owns request/impact and creature transition joins. |
| Root and live owners | Only root-authorized integration touches `src/main.js`, `src/save_files.js`, `src/simulation.js`, `src/models/location.js`, `src/data/locations.js`, trader/market/items/inventory/storage/weather/calendar/expedition and shared owner docs. Proposed new modules above need explicit writer reservations. One writer per area; hand off state/decoder and source/consumer joins serially. No such reservation/dispatch granted by this report. |

## Acceptance gates for every selected implementation

| Gate | Required future evidence; all OPEN in P8 |
|---|---|
| G1 SOURCE | Deterministic scope/receipt vectors; coherent correlated generation; feasible acquisition/tool/consumer; exact typed quantities/identities/side fractions; unknown versus unsupported; no preview/load draws; failures/stale terms leave all owners/draw unchanged; meaningful boundary/chunk equivalence. Focused tests plus required integration suite/build, counts attached to their actual slice. |
| G2 NATIVE | Fresh isolated own rebuilt origin, served-byte binding, natural paid acquisition → real changed useful consumer; supported refusal/cancel/shortage/full-receiver controls. Seeded-native season/rare/time-boundary cases labeled separately. A generated name/item catalogue or fixture-granted output is insufficient. |
| G3 PERSISTENCE | Save/reload, UI Export and literal-file Import into a second fresh origin; compare exact site/zone/producer truth, knowledge, carried/stored/vendor/held batch graph, condition, custody, job progress, receipts and next draw. Pending and changed-positive final states, including source consumed/depleted, must survive. Never use personal saves. |
| G4 COMPATIBILITY | Old absent owner remains absent and unchanged outside opt-in scope; explicit additive schema/migration decision; pinned resolved laws/revisions, no seed-only regeneration; unknown future schema/dangling reference rejects before writes or a declared inactive preservation mode. Unsupported imports do not drop/convert material or grant knowledge. |
| G5 PRESENTATION / DIRECTOR | Rebuilt 1366x768 and 1600x1000 visible site/known stock/parts/tool/output/queue state, comfortable text and usable controls; unknown estimates differ from truth without leakage. Sealed artifacts ID-only. Technical browser evidence and director fiction/balance/taste acceptance remain distinct. |

## Checks performed and limits

V1: Read-only source/document audit, including live owners and sibling outputs available during the pass. No test/build/browser/persistence evidence was produced or reused as P8 acceptance. [Audit](LIVE_AUDIT.md) qualifies source, branch, source-route and authority contradictions.

V2: Static document/link/scope checks are recorded in [DOC_CHECKS.json](DOC_CHECKS.json). They check files and locators, not gameplay or canon correctness. All P8 artifacts are proposals. Root integration, exact canon capture/manufacture/renewal scenes, batch adapters and every playable gate remain OPEN in [BACKLOG](BACKLOG.md). Source fingerprints describe a read snapshot, not a lock against concurrent edits.

V3: `docs/USER_VISION.md` changed concurrently during the pass. Final refresh checked standing desktop direction, local adjective/no-fixed-once direction and newest start/other-selves entries. No resource scope change found in those sections. Original fingerprint is retained with a separate final-refresh hash; no owner file was edited by P8.
