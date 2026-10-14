# W6: shared engine, world-kit data and template (2026-10-14)

## CHECKPOINT

W6 design pass complete. Owns this file, [GM template](../templates/WORLD_CORE_KIT_TEMPLATE.md) and [report](../../gm/dispatch/world-core-kit-2026-10-14/W6_REPORT.md) only. Source inspected on 2026-10-14; no runtime, build, test or browser proof obtained. Resume by checking these three files and the live source locators before changing claims. Other lanes own world detail and the root palette.

Authority: [COMMON](../../gm/dispatch/world-core-kit-2026-10-14/COMMON.md), [root K palette](../WORLD_CORE_KIT_2026-10-14.md), PROJECT.md standing priorities and USER_VISION.md standing UI priority. Canon-first order holds; A Soldier's Life remains paused for runtime; one realm and one prestige layer remain the first milestone. All choices below are INFERRED proposals, not accepted specs. Desktop targets: 1366x768 and a wider laptop/desktop viewport such as 1600x1000, with useful separate panels and visible routine actions. Mobile optimization is deferred.

Evidence: **SHOWN** = inspected local text with locator; **STATED** = source claim with path/URL; **INFERRED** = proposed behavior; **MEMORY** = unchecked recall. SHOWN source support does not mean playable floor met. No MEMORY canon claims or sealed files were used. Per-world floors below concern K17/K18; [W1 readiness](W1_READINESS.md) owns the all-K world census when available.

## F1: reuse the existing feature vocabulary

Use [07 RF/EI](../world-depth-2026-10-13/07_REQUIRED_FEATURES_AND_ENGINE.md), [23 UP](../world-depth-2026-10-13/23_DEEPER_SYNTHESIS.md) and [10 FW/DT](../world-depth-2026-10-13/10_FULL_WORLD_METHOD.md). They cover the needed engine families; this lane adds no competing RF or UP rows. New K17/K18 and KX angles below refine joins those families need.

### K1-K18 shared seams, inspected today (SHOWN)

“Partial” below means a shared building block exists, not that every world's floor is met. “Gap” is the proposal boundary, with its existing owner code.

| K | Shared pieces needed | Exists in live `src/` (SHOWN) | Gap / floor route (INFERRED unless stated) |
|---|---|---|---|
| K1 | FW1-FW5/FW7/FW10; DT0-DT9; UP10 | `src/structured_pack_definitions.js:7` indexes runtime families; `:32` compiles definitions; `:42` checks row IDs. Partial target format. | No census, family-card compiler or facet coverage consumer in these seams. Keep seven inventories and evidence locators author-side; FW5/FW7 compile only fields with a consumer. |
| K2 | RF16; UP8/UP14; FW7/FW8 | `src/realm_boundary_rules.js:46` validates boundary rules; `src/simulation_effects.js:85` projects facts; `src/structured_pack_definitions.js:36` rejects executable/scalar activity keys. Partial scoped law checks. | Boundary eligibility is not a complete world-law interpreter. Compile known laws into predicates/effects; new semantics need a reviewed rules-family resolver, not stored prose pretending to execute. |
| K3 | RF17; UP13/UP14; FW5/FW8; DT2-DT4 | `src/energy_resources.js:5` energy dimensions, `:21` learned reserves/strain; `src/simulation.js:344` power progression; `src/structured_pack_definitions.js:8` powers/advancements/energies families. Partial. | Author 3-6 native techniques and a growth route against supported effects. Ranks, unusual energy laws and daily uses need consumers where the existing policy cannot express them. |
| K4 | RF5; EI4; UP1/UP5/UP9/UP11 | `src/structured_pack_runtime.js:6` typed-start validation, `:14` field whitelist, `:36` equal-width draw, `:43` durable receipt. Partial trio machinery. | No era field on typed starts, weights or three knowledge-envelope UI. Put era/source metadata in author sidecar; reviewed compiler/picker changes are needed for EI4/RF5. Do not reroll old receipts. |
| K5 | RF2/RF6; UP6/UP8; FW5 LC cards | `src/structured_pack_definitions.js:52` native places, `:96` timed relocation requires completion check/refund; `src/world_instances.js:69` site definitions. Partial. | No full LC card/route/weather adapter here. Author one hub and a real costed route with access predicates; local calendar/weather remain RF6/RF2 extensions. |
| K6 | RF12; UP1-UP4/UP6/UP12; FW5 PE cards | `src/structured_pack_runtime.js:68` initializes people; `src/simulation_effects.js:281` knowledge, `:285` directed relationships/memories; `src/observation_channels.js:53` scoped receipt visibility. Partial. | Actor records do not give every NPC a schedule, need or T5 arc. PE cards plus UP6/UP7 jobs/situations supply those; general witness propagation and group memory remain UP3/RF12. |
| K7 | RF12; UP2/UP4/UP5/UP12; FW5 IN cards | `src/simulation_effects.js:294` claims, `:285` regard; `src/reputation_state.js:6` regional state validation; `src/village_career.js:11` local career owner. Partial local precedents. | General institution holder/ranks/duties/standing are not supplied by a region integer. Reuse receipt and claim seams; UP5/UP12/RF12 cover their generalized consumer. |
| K8 | RF6/RF7; UP5/UP6/UP12/UP13 | `src/world_rhythm.js:20` recurring windows; `src/simulation.js:324` counted programs; `src/simulation_effects.js:247` resources (native money restricted at `:249`). Partial. | Local currency can be actor data but native trader/UI conversion is separate. Prices, jobs, housing and meals need card consumers. Retain useful meal benefits and comfortable unfed play; no hunger death. Absence remains freeze, not closed-browser earnings. |
| K9 | RF9; UP8/UP14; FW5 IT cards | `src/structured_pack_definitions.js:60` item definitions, `:64` identified units; `src/structured_container_runtime.js:68` container effects; `src/structured_equipment_runtime.js:13` equipment validation. Partial custody/object support. | Craft recipes can use jobs/transfers only when completion reads actual inputs/output. Staged craft, material transformations, repair and item origin tags need consumers; keep RF9 provenance separate from stock-key identity. |
| K10 | RF17; UP7/UP8; FW8 rules resolvers | `src/simulation.js:358` encounter response, `:388` withdrawal; `src/native_battle_contracts.js:5` battle validation; `src/main.js:8083` structured combat checks known native enemy templates. Partial. | Pack places can reference existing enemies; this is not authored enemy ecology or all combat grammars. World rules resolver owns duel/domain/d20 semantics and defeat/recovery; include a real nonviolent route. |
| K11 | RF11; EI9; UP1/UP3/UP11 | `src/causal_situations.js:52` attributed knowledge basis; `src/simulation_effects.js:281` stage ladder; `src/structured_pack_runtime.js:86` observer view; `src/observation_channels.js:45` receipt validation. Partial. | Copy confidence, dispute/correction and local appraisal consumer remain RF11/UP1. Player knowledge is not actor permission. Public authoring fields hold only sealed ID/route/status, never truth. |
| K12 | EI10; UP6/UP7; FW5 EV cards; DT5 | `src/causal_situations.js:4` context/phases, `:16` transitions; `src/simulation.js:456` next boundary, `:465` boundary advance. Partial phase/event machinery. | A phase/deadline field is not an autonomous canon graph. Compile 3-5 events with abstention/refusal transitions and clock adapter; validate substitutes and branch joins through EI10, linking canon-events lane owners. |
| K13 | RF17; UP5/UP7/UP12/UP13; FW6/FW8; DT4 | `src/simulation.js:86` preview, `:242` commit, `:250` job completion; `src/expansion_persistence.js:7` durable plan publication boundary. Partial host machinery. | Name the local loop before breadth. Most loops can be compiled jobs/conditions/receipts; add a host only for unsupported semantics. Prove cost → act → remembered result → useful next act. |
| K14 | RF1-RF4/RF13/RF14/RF19; EI5/EI11; UP11 | `src/panel_kit.js:7` registered panel contract, `:21` hidden generic label; `src/workspace_views.js:46` world attribute, `:47` binary warm/cool frame; `src/display.js:863` log entry. Partial shell/reveal. | Per-world UI card, ambient calendar, log voice and seal/contrast checks still need binding. Reuse panel registry; no second discovery store. Palette choice stays separate from copy identity. |
| K15 | RF9/RF16; UP8/UP14; EI8/EI9 | `src/realm_cargo.js:97` exact stock snapshot, `:187` passage preview; `src/native_realm_traveler.js:15` native bridge; `src/realm_boundary_rules.js:46` boundary policy. Partial exact crossings. | General carry/convert/suppress per edge, applicability and source provenance need data plus resolver. Local reactions need RF12/UP3; never copy foreign stock into a second owner. |
| K16 | RF8; UP5/UP7/UP8/UP12; DT5 | `src/heir_inheritance.js:32` derives actual leftovers; `src/life_experience_host.js:11` builds heir save; `src/main.js:8303` wires beginHeir; `src/structured_renewal.js:9` earned renewal definition. Partial succession/continuation. | Home heir and structured renewal are distinct, not every world's endings. Author closure and continuing jobs, then local estate/debt/death rules where needed. No blanket canon frontier or forced retirement rule. |
| K17 | RF10; EI1-EI11; UP4/UP7/UP9 | `src/world_instances.js:100` continuity/era/parent fields; `:271` instance constructor; `src/structured_pack_definitions.js:41` pack-owned IDs; `src/content_packs.js:137` registration provenance. Partial copy hooks. | Metadata alone has no AU compiler or atlas. Cheap route is independent pack overlays (EI1-EI3); multiple copies inside one retained owner need EI6/EI8 migrations. See F2 corrections and K17 additions. |
| K18 | FW7/FW9/FW10; DT3-DT5; UP10 | `src/save_files.js:40` envelope validation, `:186` import; `src/structured_pack_state.js:23` exact selection, `:29` exact campaign content; `src/main.js:8086` content hashing. Partial compatibility hooks. | No kit-derived coverage printer/proof join in these modules. Pin proof to exact pack/template/host/served bytes, record compatibility decision, and exercise fresh desktop save/reload/import. A source locator alone never meets the playable floor. |

## F2: contradictions kept visible

| Code | Earlier claim | Live reading (SHOWN) | Consequence |
|---|---|---|---|
| F2a | Part 07 RF8/grounding says heir button unwired and one lesson inherited. | `src/main.js:1630` defines beginHeir and `:8303` supplies it; `src/life_experience_host.js:23` applies leftovers. Part 23 UP8 already records this newer source change. | General succession remains a gap, but do not plan “wire the heir button” as missing work. No browser verification in W6. PROJECT's older “code change pending” phrase is not present proof either way. |
| F2b | Part 07 EI4 says era-only grouping is cheap definition data. | `src/structured_pack_runtime.js:14` rejects typed-start keys beyond id/locationId/description/body/effects/snapshotHash. | Era grouping is still possible, but needs a sidecar plus consumer or validator update. It is not a drop-in typed-start field today. |
| F2c | Part 07 EI2 allows pack metadata if compiler accepts; part 10 DC9 describes compiled packs as strict. | `src/structured_pack_definitions.js:36` rejects four named top-level keys, rather than whitelisting all keys; `:76` whitelists simulation families. | Top-level metadata can pass without being understood. Allowance is not validation, execution or seal protection. Keep author-only metadata outside the runtime payload until FW7/EI2 contracts exist. |
| F2d | Part 07 EI7 is small because seeded facts need no shape change. | `src/world_instances.js:273` rejects seed overrides; `:280` copies initialFacts, `:121` binds exact fact keys/types. | Implement an explicit seed override consumer if desired. Current constructor does not take a divergence fact patch. |
| F2e | Part 07 EI8 says independent pack prefixes give namespacing “for free”; Paradise has instances[]. | `src/content_packs.js:13` allows one structured receipt/pending selection; `src/structured_pack_state.js:47` ties it to current world; `src/book_world_paradise_state.js:36` fixes two footprints. | Distinct definitions avoid ID collisions, but do not grant switching between several initialized typed campaigns or arbitrary Paradise copies. EI6/EI8 still own that work. |

These are bounded source corrections. This lane does not rewrite other agents' owners or endorse their historical runtime claims.

## D1: proposed authoring shape, not a new runtime schema

Default: FW5 family cards + an author-side kit manifest, compiled into existing schema-2 rows where supported. The manifest is a join over existing owners, not a parallel lore specification. Dial: hand-authored pack for the first tiny slice if it is cheaper, retaining the same ID/proof joins. Reason: repeat local content cheaply while a real rules consumer stays reviewable.

```text
kitManifest (author-only proposal; not accepted by a runtime consumer)
  kitSchema, kitId, worldId, packId, editionId, revision
  identitySentence, scope, evidenceRefs[], sourceOwner, inventoryOwners{}
  parts[K1..K18]: {ownerFile, facetRefs[], proposedTier, floorState,
                   consumerRefs[], gapRefs[], dialRefs[], proofRefs[]}
  build: {rulesProfileId, rulesRevision, verbTemplateRefs[], hostContractRefs[]}
  divergence: {basePackId, baseRevision, baseContentHash, basePointId,
               eraId, patchRef, counterpartMapRef, publicLabel?, sealedRef?}
  compatibility: {saveOwners[], schemaVersions{}, decisionRef,
                  unavailableContentPolicy, supportedReaders[]}
  proofIndexRef, canonEventOwnerRefs[], privateArtifactRefs[]
```

`privateArtifactRefs` and `sealedRef` point to opaque IDs/paths, not copied contents. Direct-adaptation names/cards/compiled packs follow FW4 and PROJECT's private-pack split. Public coverage may use opaque counts. New author fields are removed or lowered by the proposed compiler; unsupported behavior fails FW7 rather than silently disappearing.

| K | Pack/card data | Host / shared consumer | Derived, not a second saved truth |
|---|---|---|---|
| K1 | Inventory IDs, weights, edition/locator refs (author-side) | FW5/FW7 tooling | Counts and missing cross-references |
| K2 | Law predicates, era applicability, exception refs | Rules-family resolver, RF16 | Applicable rules at current era/body/edge |
| K3 | Energy policies, powers, techniques, learning jobs | Energy/progression resolver; new rules only where needed | Rank labels, executable affordances from actual state |
| K4 | Body/effect snapshots; era/knowledge metadata sidecar | Typed selection/init; RF5/EI4 picker adapter | Offered cards filtered by admission and reveal |
| K5 | Locations, routes, site/access conditions | Travel/relocate, RF2/RF6 calendar/weather adapter | Reachable places, ambient header |
| K6 | PE cards, schedule/need templates, voice | Actor/relationship, witnesses, schedule runner | Observer-known cast and needs |
| K7 | IN cards, ranks/services/duty terms | RF12/UP5/UP12 group ledger | Standing summaries from receipts |
| K8 | Prices, currency labels, jobs, bed/meal/calendar definitions | Economy/job routines, currency bridge, UP6 | Local date, price quotes, next routine opening |
| K9 | IT cards, recipes, materials, unit/container definitions | Craft/job/custody/equipment consumers | Availability, craft quotes and inspected origin |
| K10 | Threat/response tables, encounter objectives | Native combat or rules-family battle resolver | Danger hints, available outs, recovery quote |
| K11 | Appraisal routes, initial known facts, sealed route IDs | UP1/UP3 knowledge and appraisal | Notebook/reveal projection; never private truth |
| K12 | EV cards, graph edges, refusal/abstention outcomes | UP7 phase runner + instance clock adapter | Current pressure and discovered divergence |
| K13 | Loop cards, input/output/alternative definitions | RF17 host only when generic jobs cannot express it | Loop affordances from stock, support and state |
| K14 | Palette/voice/reveal/panel binding sidecar | RF4 adapter, panel registry, RF19 lint | Tokens and panel eligibility; browser preferences stay local |
| K15 | Edge carry/applicability tables, native cheat routes | UP8 manifests, RF9/RF16, provenance consumer | Carry preview and outlier attention |
| K16 | Closure/aftermath/estate policy cards | Transition/renewal/heir owner with local rules | Ending options and actual leftovers summary |
| K17 | Immutable base pin, patch, counterpart map, public metadata | EI1 compiler first; EI6/EI8 for live copy plurality | Diff and known copy atlas |
| K18 | Compatibility note and proof refs (author-side) | Existing save/import boundary; FW7/FW10 tooling | Readiness by facet, proof freshness and open gates |

Saved mutations stay with their existing owner: actor resources/knowledge/relationships/jobs/claims in expansion.simulation and actor domains; typed selection and initialization receipt in content_packs; retained-world footprints/visits in their campaign owner; counted objects in native inventories plus custody/title records. Host code supplies current body, stock, support, time and durable publication. Do not save computed date, kit readiness, palette or copy label merely because the manifest names it.

## D2: smallest order to make another world cheap

| Rank | Bounded work (proposal) | Exit evidence and reason |
|---|---|---|
| 1 | Pick K3/K13 and one ordinary K4 opening in the next priority world; census only the slice (FW1-FW3), pin source/rules/pack identity and K18 compatibility. | Costed native loop and closed entity list. A missing rules consumer becomes a named gap rather than a demand to build every UP. |
| 2 | Author minimal FW5 cards/verb expansion and FW7 ID/reference/consumer/seal lints; lower to current structured rows. | One compiled slice with no ignored behavior fields. Keep frozen old artifacts; no gameplay changes solely to store the kit manifest. |
| 3 | Bind existing host; add the smallest shared rules resolver only if the chosen loop needs it (FW8/RF17). | Implemented source claims cite each consumer. Start with one technical opening, then complete the root's trio and other floors before claiming a whole first-slice kit. |
| 4 | Run FW9 and produce FW10 coverage for that slice, joining actual proof rather than tier promises. | Rebuilt fresh-origin desktop route with costs, refusal/abstention, remembered result, save/reload/literal import where state persists; director acceptance separate. W6 specifies this, does not run it. |
| 5 | Compile a small relationship/start overlay (EI1-EI3/UP9) only after the canon slice is playable; use it to find genuinely shared gaps. | Exact base pin, remapped refs, separate state proof. Defer EI6-EI10 runtime plurality, generalized absence and UP15 profile unless the chosen slice requires them. |

F3: RF17's earlier “one host per world” and FW8's “packs, not growing hosts” are two routes, not a reason to block content. Default to generic commands; a host remains justified by a named unsupported rule. Prove one loop before the next slice. Floor breadth and deep completion remain distinct.

## K17: more to consider (INFERRED)

| Code | Default + dial + in-world reason | Existing seam / proposed proof |
|---|---|---|
| K17.3 | Pin base content hash as well as revision, edition and rules profile. Dial: intentionally rebase an authored copy with a migration note. Reason: the copy's remembered past must not change because a library file changed. | EI1/EI2/UP9; `src/structured_pack_state.js:29` exact content check. Compile twice to stable output; reject mismatched base rather than silently patching it. |
| K17.4 | Graph-aware ID rewrite: definitions, nested effects/predicates, knowledge keys, title owners, JSON item keys and template refs. Dial: explicit shared-native ID allowlist. Reason: a counterpart is a new person/object, while common physics may be shared. | EI1/EI3/FW7; `src/structured_pack_definitions.js:126` participant/reference inspection. Prove no accidental base-owned state reference survives. Prefix replacement alone is insufficient. |
| K17.5 | Separate copy from travel and reset. Dial: selected UP8 carriers may bring actual knowledge or goods. Reason: starting a new history does not automatically move a body, settle its debts or replenish stock. | EI6/EI8/UP8; `src/structured_pack_runtime.js:28` unpublished-origin guard. Test duplicate grant/stock and wrong-copy memory rejection. |
| K17.6 | Counterpart map names entity and facet equivalence, never shared mutable regard. Dial: cross-copy recognition needs evidence. Reason: same face does not mean the same witnessed history. | EI3/EI9/UP1/UP4; `src/simulation_effects.js:287`. Test a relationship change in A leaves B unchanged. |
| K17.7 | Fold a patch's touched canon events and abstention outcomes into its diff. Dial: minimal local divergence or larger reviewed era rebuild. Reason: missing actors still leave institutional pressure and other people's choices. | EI10/UP7/FW7; `src/causal_situations.js:5`. Test affected events and untouched ones separately, without showing sealed truth. |
| K17.8 | Show only a discovery-safe public label; omit hidden variants from pickers, DOM attributes and errors. Dial: a rumor/silhouette route via UP11. Reason: uncertainty is part of living in that copy. | EI5/EI11/RF19; `src/workspace_views.js:46` currently writes world ID to DOM, so visible copy safety needs an explicit projection/lint. |

## K18: more to consider (INFERRED)

| Code | Default + dial + reason | Proposed gate |
|---|---|---|
| K18.4 | Proof record pins pack hash, start hash, template revision, host revision, source snapshot, build/served hash, origin and viewport. Dial: reuse unchanged template evidence only with a recorded dependency match. Reason: last week's route may use different rules. | FW9/FW10/UP10. Mismatched dependencies mark proof stale, not failed gameplay. No hard-coded “proved world” flag. |
| K18.5 | Test pending selection, initialized start, running job, settlement, custody transfer and closure separately. Dial: only states the slice actually reaches. Reason: a completed result cannot prove a pending contract survives. | Exact save/reload/export/literal-file import; old supported envelope and wrong-content refusal leave stored bytes intact. |
| K18.6 | Distinguish generic optional parking from exact typed-campaign recovery. Dial: freeze matching private artifacts or supply a reviewed migration. Reason: unavailable content must not erase earned history or invent a new origin. | `src/content_packs.js:152` parking versus `src/main.js:5286` typed-content preflight/suspension. Include pack missing, restored and revised cases. |
| K18.7 | Print per-facet planned/implemented/tested/browser-proved/human-accepted counts and blocked W3 rows. Dial: slice or whole-source denominator. Reason: breadth and lived depth answer different questions. | FW10/DT9. Template proof covers the template; sample journey proves joins; DT5 branch and director acceptance stay explicit. |
| K18.8 | Prove natural conditions as well as blocked inputs, refusal and abstention. Dial: longer bounded journeys where native costs take time. Reason: manufactured means conceal whether a life is playable. | Rebuilt 1366x768 and wider journey per loop type, including actor-known UI and remembered consequence. Record unrun paths OPEN. |
| K18.9 | Keep proof artifacts disposable and saves private, with source/build/native/persistence/human acceptance separate. Dial: share only opaque coverage and safe route descriptions. Reason: a test history must not overwrite Weibao's life or reveal a world secret. | Fresh isolated origin and explicit evidence links; no source-library, user-save or private-pack mutation in this docs lane. |

### K17/K18 per-world floors today and next angles

SHOWN below refers to local design/source coverage, not canon verification or native proof. Where there is no W6 proof pointer, K18 is **missing proof in this pass**, not a claim that no older evidence exists. AU ideas below are INFERRED dials, never source facts. The linked owners hold canon/source questions; this lane did not inspect novels or sealed files.

| World / row | K17 floor today, pointer | K18 floor today, pointer / floor proposal | More to consider specific to this world (INFERRED) |
|---|---|---|---|
| W6-HP Harry Potter | Partial design: [08 PHP6-PHP12](../world-depth-2026-10-13/08_PRIORITY_CANON_AND_AU.md), [WORLD_BRIEF](../harry-potter/WORLD_BRIEF.md). No copy-runtime proof here. | Missing W6 proof; 08 PHP-A1-A10 are proposed gates. Pin a first canon supply-week pack and run its repaired/borrowed/deferred routes. | K17: guardian/house seed changes must not imply witnessed trust. K18: ordinary repair and disclosure branches need different remembered outcomes, not just a palette change. |
| W6-DD D&D | Partial design: [FIRST_SLICE ST1-ST3/E01-E07](../dnd/FIRST_SLICE.md), 08 PDD6-PDD12. | Missing W6 proof; 08 PDD-A1-A9 specified. Pin rules profile and revision before the torn-bag journey. | K17: rules edition patch differs from an era patch. K18: imported profile must not change a saved repair quote or spell eligibility. |
| W6-TT TTKS | Partial design: 08 PTT/TT variant discussion; [04 TT rows](../world-depth-2026-10-13/04_FALLOUT_SKYRIM_SL_TTKS.md). | Missing W6 proof; choose the specific book/system and its first pack ID, rather than one ambiguous TTKS owner. | K17: separate system/cost-law patches from household/start patches. K18: check the power bill and queued training costs across import, with birthday/local-clock semantics pinned. |
| W6-MO Mother of Learning | Partial runtime hooks: `src/book_world_mol_state.js:27` fixed continuity/era; 08 PML variants. | Partial save owner: `src/book_world_mol_state.js:15`; no native proof run here. Exact retained campaign journey remains the gate. | K17: new loop/copy policy must not mutate the retained footprint in place. K18: track notebook/carrier retention and actual loop costs separately from normal save reload. |
| W6-LM Lord of the Mysteries | Partial design: [09 QLM AU rows](../world-depth-2026-10-13/09_MORE_BOOK_WORLDS_CANON_AND_AU.md). | Missing W6 proof; pin era, translation/rank profile and reviewed source scope before a cover-job slice. | K17: counterpart recognition and institutional receipt transfer need separate dials. K18: local job, power growth and dangerous-reading evidence need separate consumers/proof. |
| W6-CI Circle of Inevitability | Partial design: 09 QCI, distinct era/roster proposal. | Missing W6 proof; own pack and clock policy before a small local loop slice. | K17: sequel era and local reset are distinct histories. K18: prove boundary/reset retention without converting ordinary save reload into a fictional reset. |
| W6-SS Shadow Slave | Partial design: 09 QSS variants. | Missing W6 proof; pin waking/dream body, item and clock policies before the guarded-rest slice. | K17: counterpart map must distinguish body/realm identity from local standing. K18: guarded rest and waking return must read actual support, stock and time, not a closing-browser trigger. |
| W6-RP Reincarnation Paradise | Partial runtime footprint hooks: `src/book_world_paradise_state.js:34` exact owner, `:36` two fixed footprints; [WORLD_BRIEF](../paradise-hub/WORLD_BRIEF.md). | Partial saved owner, no W6 browser proof. Separate hub and mission-destination compatibility/proof records. | K17: copying a destination should not clone a hub contract or reward claim. K18: mission settlement and extraction must remain distinct from optional-pack initialization. |
| W6-JJ Jujutsu Kaisen | Partial design: [WORLD_BRIEF](../jujutsu/WORLD_BRIEF.md); source-qualified AU metadata still to normalize. | Missing W6 proof; pin era/cast and rules profile for one local energy/curtain loop. | K17: a technique-rule patch needs a resolver diff, while a mentor patch changes regard seeds. K18: verify energy/strain and barrier failure with current body/support. |
| W6-BL Bleach | Partial design: [03 BL variants](../world-depth-2026-10-13/03_BLEACH_NARUTO_ELDEN_RING.md). | Missing W6 proof; define one realm/body transition and save owner before a send-on slice. | K17: counterpart soul/body mapping is not item duplication. K18: prove body/controller and squad receipt retention at both sides of passage. |
| W6-FA Fate | Missing normalized W6 manifest; root priority names it but no copy/proof artifact inspected. Floor proposal: edition/route pin plus divergence/start sidecar. | Missing W6 proof; first pact/duel slice needs explicit rules and owner bindings. | K17: route change may alter contracts and event graph together. K18: record command authority, energy cost and defeat branch, rather than proving only battle damage. |
| W6-HX Hunter x Hunter | Missing normalized W6 manifest; root priority pointer. Floor proposal: cast/era pin and personal-form counterpart refs. | Missing W6 proof; first learning/contract slice needs pack and rule consumer evidence. | K17: personal restriction changes need obligation-policy diffs. K18: test observed learning and actual restriction costs; reader knowledge must not unlock execution. |
| W6-FM Fullmetal Alchemist | Partial design-owner route: [WORLD_BRIEF](../fullmetal-alchemist/WORLD_BRIEF.md); normalized copy pin unverified. | Missing W6 proof; first material-transformation slice needs compatibility and custody pins. | K17: world-law patch and a teacher/start patch must be distinguishable. K18: prove input/output conservation and failed transformation, not just XP. |
| W6-NA Naruto | Partial design: [03 NA variants](../world-depth-2026-10-13/03_BLEACH_NARUTO_ELDEN_RING.md). | Missing W6 proof; one local practice/clone-return slice with save owner and cost policy. | K17: family/clan seed must not fabricate earned technique access. K18: prove counted practice/retained knowledge without duplicated body stock or free elapsed time. |
| W6-SL A Soldier's Life | Partial historical design: 08 PSL; structured-pack hooks SHOWN in generic source, private packs not opened. | Historical runtime evidence is STATED in 08, not rechecked. Keep runtime paused; prepare opaque compatibility/proof refs only. | K17: pack overlay can be drafted without resuming the GM. K18: frozen private artifact and pending/completed custody evidence are separate from whole-world completion. |
| W6-OF Original Frontier | Partial home design/runtime: [WORLD_BRIEF](../original-frontier/WORLD_BRIEF.md), `src/life_experience_host.js:11`. | Partial save/import and heir hooks SHOWN; no W6 journey. Use design census (KX6) and home-loop evidence. | Copy defaults should preserve ordinary livelihood and actual leftovers; an original world still needs the same conservation/proof joins. |

Fallout, Skyrim and Elden Ring: retained/deprioritized; no runtime expansion in W6. Existing RF/EI/UP seams apply, with K17/K18 readiness left to their owners.

## More to consider, other stuff

Cross-world additions to the root's KX palette, INFERRED proposals. These extend existing engine codes rather than new parallel feature families.

| Code | Default + dial + in-world reason | Engine angle |
|---|---|---|
| KX11 | Pin a dependency graph linking card facets, verb templates, rules consumer and proof. Dial: deliberately reuse proven unchanged templates. Reason: a repaired bag and ward can share custody machinery while behaving differently. | FW7/FW9/FW10 + UP10; invalidate only touched joins, never infer whole-world proof from shared unit tests. |
| KX12 | Give every state change a consuming owner and conservation boundary. Dial: authored conversion with an exact UP8 manifest. Reason: crossing, reset and succession move or lose actual means. | UP8/EI8/RF9; check stock, claims, debts, energy and actor/body identity before/after. A new pack namespace alone cannot prove conservation. |
| KX13 | Make public projections independent of author/source IDs. Dial: known labels and silhouette grades from UP11. Reason: unfamiliar places should be discoverable rather than named in errors or DOM data. | EI11/RF19/UP11; inspect title, log, picker, URL, DOM attribute and error paths, not only visible text. |
| KX14 | Treat clock boundaries as ordered local inputs. Dial: freeze, future ratio or caught-up reports only through RF7's reviewed policy. Reason: wages, travel, canon events and NPC duties can share a minute without paying or firing twice. | UP6/UP7; define tie order and deterministic seed/replay per rules profile, and test pending settlement after reload. No closed-browser earnings implied. |
| KX15 | Keep readiness evidence multidimensional. Dial: first-slice or source-wide denominator, with parked content visible to agents. Reason: a broad book census and one lived household are different accomplishments. | DT7/DT9/FW10; print stale/open/implemented-unverified status and human acceptance separately, with private counts kept opaque. |

### Suggestions, ranked

1. **A1:** Finish a canon K3/K13 vertical slice using existing jobs/custody/knowledge before a general kit runtime. Pin K18 identity and preserve its unresolved native gate.
2. **A2:** Build FW5/FW7/FW10 author tooling with explicit consumer and proof joins. This reduces per-world hand expansion without adding save domains.
3. **A3:** Use a small EI1 relationship/start overlay to prove complete reference remapping and independent state. Let that evidence determine whether EI6 runtime copies are worth the migration next.
