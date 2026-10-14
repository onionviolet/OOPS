# PC2: procedural rule modules

2026-10-14. **DOCS DELIVERED; PROPOSALS ONLY.** Authorized by the user, [lane prompt](../PC2.md) and [COMMON](../COMMON.md). This report owns a proposed module contract and future acceptance cases, not world physics or an implementation dispatch. Writes belong only to `pc2/`. No source edits, staging, commits, builds, gameplay tests, browser runs or private-save access.

Evidence labels: **SHOWN** means read source at the cited path and line; **STATED** means a live document says it; **INFERRED** means a proposed contract or conclusion. All new schemas, policies, numbers, packs, tests and next steps below are INFERRED proposals. A section's label applies to its tables and examples. No external canon claims are made.

## Findings and corrections to the root palette first

| Code / evidence | Finding or correction | Consequence for the palette |
|---|---|---|
| PC2-F1 / SHOWN | MDF2's one-consumer count is stale. Production importers of `rules.js` are [action legibility](../../../../../src/action_legibility.js) (`src/action_legibility.js:3`), [simulation contracts](../../../../../src/simulation_contracts.js) (`src/simulation_contracts.js:4`), [capabilities](../../../../../src/capabilities.js) (`src/capabilities.js:1`) and [expansion engine](../../../../../src/expansion_engine.js) (`src/expansion_engine.js:55`). [Evaluator](../../../../../src/rules.js) (`src/rules.js:3`) returns `met`, `known`, `reasons`; it does not publish effects. | Reuse its predicate contract without changing existing callers. Four direct production importers does not prove a general rule-module resolver exists. |
| PC2-F2 / SHOWN | Search of `src/` and `tests/` found the tag-store import only in [its test](../../../../../tests/tag_store.test.js) (`tests/tag_store.test.js:3`). [TagStore.matches](../../../../../src/tag_store.js) (`src/tag_store.js:181`) returns a boolean, not an explanation; [tagFacts](../../../../../src/tag_store.js) (`src/tag_store.js:100`) can feed missing-aware predicates. | MDF1 remains supported at this read. Indexing and an explanatory rule adapter still need a first production reader. |
| PC2-F3 / SHOWN | [Pocket rules](../../../../../src/pocket_realm_rules.js) (`src/pocket_realm_rules.js:4`) construct a doorway connection. [Boundary rules](../../../../../src/realm_boundary_rules.js) (`src/realm_boundary_rules.js:103`) evaluate explicit means/exceptions; [cost quoting](../../../../../src/realm_boundary_rules.js) (`src/realm_boundary_rules.js:125`) aggregates debits; [boundary view](../../../../../src/realm_boundary_rules.js) (`src/realm_boundary_rules.js:143`) uses retained observer evidence. | MR6 must not describe an existing player-authored physics editor. These are useful contracts, not a general law-edit API. |
| PC2-F4 / STATED + INFERRED | MR4 suggests specific beats general, world beats core, later overlay wins and forbid beats permit. [G3 overlay order](../../gen-rules-2026-10-14/g3/OVERLAYS.md#o2-merge-order) is for selection; it explicitly cannot bypass hard eligibility. [Typed reactions P6](../../../../research/procedural-materials-2026-10-13/deep/RULE_CONTRACTS.md#resolution-and-publication-stages) require explicit allocation and named overrides. | Separate overlay assembly, scalar composition, exclusive reactions and veto exemptions. An exact tag/ID or newer overlay must not silently authorize double consumption or a physics bypass. |
| PC2-F5 / SHOWN + INFERRED | [Village chemistry](../../../../../src/mixture_state.js) (`src/mixture_state.js:53`) already resolves composition and dose, and [validators](../../../../../src/mixture_state.js) (`src/mixture_state.js:33`) recompute revision-1 products. [Exposure validation](../../../../../src/mixture_state.js) (`src/mixture_state.js:102`) also reconstructs that identity. | The materials audit is a dated inspection. Its broad generated-pipeline gap does not erase landed P2. A new module cannot be bolted onto a tooltip or append arbitrary dose fields; it needs version-aware product, job and exposure readers. |
| PC2-F6 / STATED + INFERRED | [Root round 2](../../../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md#correction-first) gives HV2 ownership of acquisition. [HV2 M3a](../../harvest-modules-2026-10-14/hv2/MODEL.md#m3-harvest-verbs) distinguishes physical impossibility, missing means, prohibition, observer ignorance and unsupported simulation. | Keep those states separate downstream. Proposed first reader is an existing mixing stage, with existing acquisition retained. No parallel herb-harvest engine. |

PC2-F7 / STATED: Live authority is [USER_VISION](../../../../USER_VISION.md), [PROJECT](../../../../../PROJECT.md#standing-priorities-and-document-authority) and the [accepted rulebook](../../../../RULES_FROM_SCRATCH.md#the-rulebook-accepted-2026-10-10). World-local defaults/dials, outliers, broad reachable options, same actor laws, sealed discovery, original play and one realm/one prestige remain intact. Three example packs below test the contract; they do not change canon-first priorities or activate three worlds.

## One module, separate owners

PC2-D1 / INFERRED: A `RuleModule` is immutable inert content, selected by tags and evaluated against an explicit context. It describes proposals to a registered operation resolver. It never owns inventory, institution memory, player knowledge, clocks or a second material catalogue. One logical family has immutable `id@revision` records; a lawful edit creates a new instance/overlay revision with lineage rather than overwriting history.

| Contract / owner | Boundary |
|---|---|
| Predicate evaluator / `src/rules.js` | Reads caller-owned facts; returns missing-aware match/reasons. No costs, random calls, mutation or effect execution. Validate strict grammar before calling it. |
| Presence tags / `src/tag_store.js` | Registry, implication, truth/observer views and serialization. No quantities, strength, expiry, physical properties or permission authority. |
| Overlay compiler / GA4 and G3 | Assemble effective selection/content lock, validate refs and order. Generation reweight/pin is not a physical rewrite. |
| Operation resolver / audit P2, HV2 M1, P6 | Binds actual inputs/actor/station; evaluates applicable rules; allocates claims; computes ordered transformations, product/effect proposals and trace. |
| Native publication / existing transaction owner | Revalidates revision/stock/access; stages every affected owner; validates one envelope; durable write precedes publication. |
| Observation / AB3 and world K11 | Projects actual events to observer claims, confidence and public receipt. Never recalculates underlying law. |
| Institution / K7 | Reads witnessed/reported conduct and its jurisdiction; proposes investigation, fees, service refusal or other supported consequences. Actual enforcement needs actual means. |

STATED owners to extend, not replace: [materials audit five records/resolver](../../../../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md#proposed-composition-and-resolution-contract), [typed rule contract](../../../../research/procedural-materials-2026-10-13/deep/RULE_CONTRACTS.md), [HV2 M1](../../harvest-modules-2026-10-14/hv2/MODEL.md#m1-one-operation-contract-several-source-adapters), [P6 shared creation](../../procgen-2026-10-13/p6/REPORT.md#shared-creation-contract-proposed), [P8 resource contract](../../procgen-2026-10-13/p8/REPORT.md#shared-resource-contract-rc1), [crafting II/AB](../../../../PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md#ii-implementation-implications-against-the-merged-p2-code), [weaponcraft crosswalk](../../../../WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md#crosswalk-one-name-per-idea) and [K2 laws](../../../../worlds/WORLD_CORE_KIT_2026-10-14.md#k2-world-laws).

## Module schema and selector grammar

PC2-D2 / INFERRED: Proposed module-format schema 1 is independent of the actual native engine/save schema. The implementation lane must select the native version after refreshing live code. This is a public, original fixture, not accepted Village chemistry.

```json
{
  "schema": 1,
  "id": "rule:pc2.village.boil_restore",
  "revision": 1,
  "kind": "world_law",
  "resolver": "resolver:pc2.village_mix@1",
  "selector": {
    "routes": ["mix"],
    "subjects": [{"role": "input", "quantifier": "some", "query": {"tag": "pc2.restorative"}}],
    "requires": {"fact": "procedure.process", "op": "eq", "value": "boil"}
  },
  "scope": {
    "worldId": "base.frontier",
    "instanceId": "frontier.main",
    "regionPath": ["frontier.village"],
    "layerId": "material",
    "appliesTo": "operation_site",
    "window": {"clock": "played_world_minutes", "from": 0, "until": null},
    "sampling": "stage_start"
  },
  "priority": {"layer": "world", "value": 10, "specificity": 0, "order": 0},
  "effects": [{
    "id": "restore_factor",
    "phase": "derive_payload",
    "kind": "parameter",
    "target": "oral.restore_availability",
    "group": "pc2.restore_availability",
    "combine": "replace",
    "value": {"numerator": 1, "denominator": 1},
    "overrides": []
  }],
  "knowledge": {"policy": "experiment", "secretId": null, "routeIds": ["route:pc2.mix_compare"]},
  "receipt": {"reasonId": "reason:pc2.boil_response", "publicTemplate": "observation:pc2.process_comparison"},
  "lineage": {"source": "original_fixture", "parentRef": null}
}
```

| Field | Required interpretation / admission |
|---|---|
| `id`, `revision`, `schema`, `resolver` | Stable namespaced identity; positive safe integer revision; registered resolver/opcodes and immutable dependencies. Same ID with incompatible active revisions needs an explicit instance binding, not accidental duplicate firing. |
| `kind` | `world_law`, `generated_law`, `social_norm`, `institution_policy`, `local_field`, `timed_law`, `learned_technique`, `player_law`, `cheat_overlay`. Provenance/intent metadata; effect kind decides executable behavior. |
| `selector.routes` | Nonempty registered operation routes. A new verb needs a reader before admission. |
| `selector.subjects` | Named input, catalyst, actor, station, target or product role; query plus `some`/`all` over a declared domain. A matched tag is eligibility, not a quantity allocation. Empty consumed domain never satisfies `all`; context guards use `requires`, not fake empty materials. |
| `selector.requires` | Existing `all/any/not`, `fact/op/value` predicates; fact names/types/units admitted by resolver. Exact identity, provenance, fractions and body/rights refs are typed fact adapters. Avoid inventing one tag per exact item. |
| `scope` | Actual world and instance, continuity/era binding when relevant, region parent path, layer, optional actor/source/item/custody refs, origin/use-site policy, clock and window. Omitted restriction is explicit wildcard within the admitted world, not permission to cross worlds. All restrictions intersect. |
| `scope.window`, `sampling` | Half-open `[from, until)` with a declared game clock; periodic windows have a registered phase function. `stage_start` freezes sampled effects for that stage; `continuous` names relevant boundaries and integrates intervals. No implicit wall clock/offline progress. |
| `priority` | Declared layer, integer priority, validated specificity and order. Applies inside a named channel/group; never global rank-based authority. See ordering policy. |
| `effects` | Stable effect IDs, supported phase/kind/target/group/combine and typed operands. No JavaScript, arbitrary paths or unregistered prose mechanics. Costs/resources name owner and units. |
| `knowledge` | Disclosure policy, opaque optional secret ID and permitted discovery routes. Actual knowledge status belongs in per-observer records, not one mutable global `known` flag. |
| `receipt`, `lineage` | Fact/reason/template refs, source class, parent edit/generation refs. No secret truth in public labels. Resolved operation receipts are separate immutable events. |

PC2-D3 / INFERRED: Use the [G3 canonical query](../../gen-rules-2026-10-14/g3/TABLES.md#t3-query-grammar-and-truth): `{tag:id}`, `{all:[...]}`, `{any:[...]}`, `{not:query}`. Compile `{tag:id}` to the string leaf accepted by TagStore, or to `role.tag.id eq true` for `evaluateRule`; G3's object leaf is not already a native TagStore API. Use registered implication closure. Preserve empty `all`/`any` meanings for query syntax, while validating role domains separately.

SHOWN: [TagStore truth matching](../../../../../src/tag_store.js) (`src/tag_store.js:181`) omits observer filtering when no observer is supplied; an explicit `{}` sees open tags only. `tagFacts` defaults to open tags. **INFERRED policy:** the execution adapter requests complete internal truth for all declared relevant tags, while preview receives observer facts. Neither adapter passes a boolean from `matches` off as an explanation. Registered absence is false; hidden is unknown to the observer; unknown registry refs are an admission/compatibility diagnostic. Unknown under `not` stays unknown. Model-level `notApplicable` follows the typed rule owner, with a typed applicability adapter; it must not be coerced to missing boolean fact or zero.

### Effect kinds, not a second executor

PC2-D4 / INFERRED: Each effect is applied only by the operation resolver to a detached proposed state. Its publication layer alone mutates live owners.

| Kind / phase | Resolver behavior | Important boundary |
|---|---|---|
| `gate` / admission | Describe physical block, missing means, access/service block or a named exemption | A `permit` means no block in that channel; it supplies no stock, body or source. |
| `parameter` / process or derive payload | Replace/add/multiply a typed parameter in one group, then apply group bounds and rounding policy | Multipliers never infer global quality/power equivalence. |
| `transform` / process | Bind stoichiometry/claims, debit once, retain catalysts, allocate output/waste and next material state | Needs actual full amounts and solver/operator support, not tag presence alone. |
| `ledger_exception` / process | Declare sourced creation, conversion, external supply or sink under a registered local law | Outliers may create matter. Record the source/exception ledger; ordinary conservation does not prohibit the fiction. |
| `schedule` / process | Propose paid stage work and next meaningful boundary, with interruption/refund terms | Evaluator never advances time, queues work or spends wages. |
| `consequence` / enforcement | Emit conduct/evidence event for institution adapter; quote known liability separately | Detection is not universal. The institution cannot act from the player's private truth. |
| `observation` / projection | Propose observable result/protocol references for knowledge owner | Learns only what that means can reveal; no hidden threshold in raw reason text. |
| `rule_edit` / admission + publication | Propose a scoped revisioned overlay with precise target refs, source/cost and expiry | Creation/deactivation requires a durable transaction and a supported editing power. |

## Conflict and ordering policy

PC2-D5 / INFERRED: Use two orders. **Assembly order** follows G3: core, actual world, outer-to-inner region, declared actor-role/person overlays, then a development-session director overlay. Within layer use declared priority/order and code-point ID traversal. Saved director edits affect test selection only. In-fiction fields and cheats enter their actual region/person scope, with an explicit exception capability if they change hard law. Later sequence alone is not a physics exemption.

**Effect resolution order:** admission → ordered process steps → reaction allocation/transforms → route payload → scheduled/enforcement/observation proposals → conservation/reference checks → canonical products/receipt. Every phase has an explicit read snapshot. Re-match transformed tags only at declared process boundaries, not recursively until arbitrary effects stop firing. Dependency cycles/unresolved conflicts produce a typed failure before spending.

| Channel / conflict | Proposed exact policy |
|---|---|
| Scalar `replace` group | Compare `(layer rank, region depth, priority.value, specificity, priority.order, applicable overlay edit sequence)` lexicographically, higher wins. Specificity is declared and linted as a genuine subset/named narrowing, not the number of tags or string length. Same effective rank with different values is ambiguous; author adds order or override. Stable IDs sort traces, never silently choose conflicting semantics. |
| Additive/multiplicative group | Take at most one effective replacement baseline; sum admitted adds, multiply admitted positive/nonnegative rational factors as permitted by parameter domain, then intersect bounds and quantize once. Receipt names all contributors. Multiple replacements at equal rank still conflict. Different formula order requires another registered combine policy/revision. |
| Independent bounds | Intersection, not last-writer wins. Empty interval refuses as conflicting law. A declared exception may name and bypass one specific bound. |
| Physical/access veto group | Every applicable veto stands unless an eligible exemption names its rule/effect or an explicitly registered group. A generic permit, high priority or director pin cannot clear it. Exception must supply acquired operating source, method/body support and scope. Other blockers remain. |
| Social obligations | Different actual authorities' obligations coexist, each with jurisdiction/knowledge. Payment to one guild does not erase another's claim. A source-defined institutional hierarchy can explicitly resolve overlap. |
| Exclusive reactions | Explicit method choice, named override or group's ordered priority selects a fully feasible reaction. Do not debit until full minimum extent is available. Same-rank competing claims without allocator refuse. Different groups sharing stock still need joint allocation. |
| Shared inputs/catalysts | Reserve across all accepted effects against one ledger. Catalysts can be retained once with compatible simultaneous-use capacity; they are not copied into every output. Exact tokens/body parts are indivisible identity claims. |
| Same module reached twice | Deduplicate by exact rule-instance/effect ref and phase occurrence. Different intentional instances require separate source identity and a declared stacking policy. |

### Worked conflicts

All rows are PC2 INFERRED fixtures with exact expected behavior.

| Code | Conflict | Resolved result and receipt |
|---|---|---|
| PC2-C1 | Core restore factor `13/20`; world factor `1`; room factor `4/5`; independent skill multiplier `11/10` | Room replacement wins within its group; result `22/25`. Trace records core/world superseded, room winner and skill multiplier. Observer sees only disclosed causes. |
| PC2-C2 | Dead-magic field vetoes infusion. Personal permit says infusion allowed, priority 999 | Blocked by field. An actual acquired field-key exception naming that veto can admit infusion if its costs/body/source are supported. It does not clear an unrelated missing-catalyst block. |
| PC2-C3 | Guild bans tanning without a permit; actor has hide, bark, tool and a private vat | Physically feasible illicit operation remains a supported choice if its route exists. Guild-owned vat service can refuse access. Private work records conduct; sanction needs witness/report and institution means. No automatic chemical failure. |
| PC2-C4 | Two reactions each require 3 mass units of a shared 4-unit lot, equal priority, no allocator | `conflicting_claims`, zero debits/products/XP. Choose one explicitly: debit 3, retain 1; selected reaction's full output only. Never award both using 6 units. |
| PC2-C5 | GA4 world `ban:true`; later region `add` and director `pin` select a reaction candidate | Selection ban remains. Explicit authorized `ban:false` can release selection veto, then the rule still faces its physical gates and quantity allocation. |
| PC2-C6 | Festival tariff changes at minute 60. Stage admitted at 59, completes at 61 | `stage_start` tariff remains the sampled one for that stage. A new repeat admitted at 61 gets the new tariff. A declared continuous heating field instead splits at 60; chunked advance and one advance agree. |
| PC2-C7 | Purity cheat and poison-bearing batch: cheat says separate contaminant | Resolver transfers the actual contaminant to waste/receiver with capacity/cost. It does not delete trace fractions or turn rarity into purity. An expressly destructive/creative law uses its own exception ledger. |
| PC2-C8 | A profitable catalyst recycling loop and repeated settlement of the same receipt | Distinct funded operations may repeat under that world's economics. Replaying one receipt cannot mint another output. Fix duplication/overflow bugs, not a lawful solo economic discovery by imposing a global once cap. |
| PC2-C9 | Two overlapping wards set incompatible temperatures at equal rank | Ambiguous before admission. Creator selects order/exception or a supported field-combination policy. Raising an ID alphabetically cannot resolve the law. |

## Generated-rule grammars, solvability and freezing

PC2-D6 / INFERRED: Generate supported parameterized laws, not executable prose. Grammar slots reference admitted fact/material/operator IDs. Reuse the addressed generation kit and GA4/G3 tables, not a private PRNG or pin store.

```text
RuleFamily := SupportedOperator(RoleBindings, ConditionSlots, ParameterSlots, ScopeSlots)
RoleBindings := tag-query selected family refs + exact retained selected refs and amounts
ConditionSlots := registered process | station capability | world-time window | local field
ParameterSlots := world-adjective domain with units, correlations and reason refs
ScopeSlots := worldInstance + continuity + ruleEpoch [+ lifeId for a personal rule]
Value := immutable RuleModule + feasibleWitness + generatorReceipt
```

| Code | Grammar fixture | Solvability witness / real reader |
|---|---|---|
| PC2-G1 | Village process response: choose one available plant role and one supported process response factor from `{4/5, 1, 6/5}` with equal integer weights `1:1:1`; chemistry operator remains authored | Actual purchasable/gatherable supplies, accessible mixing counter, two supported methods, paid inputs and native oral exposure. Every draw changes a useful dose; ordinary revision-1 route remains available. |
| PC2-G2 | Glasshouse ward tuning: select an admitted room-field threshold and compatible paid lattice upkeep | Reachable source, body/method support, actual room/site and tool; one process-time/charge consumer. No circular requirement to build the only ward in the ward it enables. |
| PC2-G3 | Lantern Compact technique spread: select teachable procedure refs, local transmission delay and institution reaction family | At least one teacher/manual/trial route and useful process consumer, plus explicit witness/contact edges. Sealed PC2-S1 is referenced only by ID/route/status below. |

| GR coverage | Concrete rule-generation requirement |
|---|---|
| GR1, GR2, GR14 | `generate(address, inputs, tables, draws) -> {value, receipt}` is pure. World-law address includes actual world instance/continuity and epoch; personal law adds life/actor. Draw slots name role, condition, parameter and retry. Do not independently reroll one shared world law per NPC life. |
| GR3, GR4, GR10 | Stable address until promoted; save the full generated value/dependencies/receipt at first causal commitment or reveal. A partial observation freezes the whole applicable law, not just the visible clause. Unseen and causally unused addresses may use new table revisions. |
| GR5, GR15 | Truth and observer claims are separate records. Surface text binds fact IDs; only actual in-world documents freeze rendered prose. Names, sorting, tooltip numbers and traces use knowledge projection. |
| GR6 | Validate roles, units, full reaction feasibility, bootstrap supply/tool/station, attainable window/field, discoverable route, supported useful consumer and combined-pack satisfiability. Retry at addressed attempts, then named authored fallback; retain attempt/reason/fallback count. |
| GR7, GR8, GR9 | Choose admitted candidates by tag query, with core/world/region/person table overlays, integer weights and reason refs. Save selected exact IDs/revisions as results. Reweighting affects unseen generation, not existing law effects. |
| GR11, GR17 | Declare entity/draw/attempt/compute budgets and game-time boundary. No generation per animation tick. A bounded solver failure is honest unsupported/conflict handling, not a fictional once limit. |
| GR12, GR13 | At least one cost/action/gate reads the law. NPCs call the same law resolver with their own real stock, body, access and knowledge. Different recipes/skills produce differences; hidden NPC-only chemistry does not. |
| GR16 | Seed sweep, three fixed-seed golden values/receipts, exact next-value equality after save/reload/export/literal-file import. See test table. |

PC2-D7 / INFERRED: G1 fixture budget is one world-law record per admitted instance/epoch, up to four named slots per attempt, eight addressed attempts and then one named fallback. These are compute bounds, not a limit on new experiments or lawfully created rules. No daily draws occur without a relevant admission.

Generation receipt includes root scope/address, slots/attempts, generator/table/tag/content/effective-overlay revisions, parameter rationale, selected value, feasibility-witness refs and fallback status. A witness proves the selected bounded route, not every possible future strategy. Test combined packs, including overlapping vetoes, rather than proving each card separately. A temporary moon window must be reachable by supported waiting; bootstrap may use purchase/commission and need not require a single forced route.

Freeze before the first operation that depends on a law, including hidden effects, paid jobs, NPC production and observations. This stronger causal rule follows G3's committed-work compatibility and prevents a patch changing already earned consequences. Preview peeks without committing draws, but projecting a genuine new clue is a reveal event and must durably freeze truth with that observation. Never let opening/closing a panel reroll a partly learned rule. A later lawful revision preserves old residue/receipts/products; old outputs do not recompute under the new law.

## Partial discovery and confidence

PC2-D8 / INFERRED: Proposed observer record: `{observerId, lifeId, worldInstanceId, subjectRef, ruleRevisionBasis, status, claims, evidenceRefs, observedAt}`. `status` is `unobserved`, `suspected`, `tested`, `established` or `contested`; it describes that observer's evidence. Each claim has its own clause/property scope, protocol, means, attributed source, confidence and competing interpretation. A lie or mistaken model may be highly believed and still false.

| Observation | Allowed projection | What stays separate |
|---|---|---|
| One night trial gave a stronger dose | “Stronger in this trial; night may matter,” scoped to tested inputs/process/place | No guaranteed moon threshold or universal family claim. Confounders remain explicit. |
| Paid controlled comparison held inputs/station constant | Raise confidence only in the tested process-response claim | Confidence is not a potency multiplier or a bonus success roll. |
| Teacher/report/manual | Attributed instruction with reliability and evidence lineage | Repeated copies of one rumor are one dependent source, not independent confirmations. |
| Contradictory trial after travel/change | Record counterevidence and context; mark old claim contested/out of scope | Do not overwrite law truth or erase an earlier actual observation. |
| Appraisal/why lens | Reveal only clauses/properties its acquired source supports | Seeing a cause does not teach execution, grant legal access or clone an item. |

Confidence is a calibrated evidence policy of the chosen discovery owner. Suggested first implementation uses qualitative levels plus evidence counts, not fake universal probabilities. A later numeric model must declare calibration and correlated-source treatment. `evaluateRule.known` means facts supplied for that evaluation, not historical confidence in a theorem.

Use full truth for execution even when preview says uncertain. Missing required physical model data is `unresolved_model`, distinct from observer ignorance. Experiments may proceed under unknown predictions where world permission and actual means allow them. Do not add an ignorance penalty unless the world/operator explicitly models one.

PC2-R1 / INFERRED: Public receipts are projected from retained observations, never raw `reasons`, unmatched secret cards, exact hidden selector/value, suppressed-rule counts, fallback identities or full debug cause traces. Before discovery show observable effects and uncertainty. A secret's opaque ID/route/status can appear in engineering reports; an undiscovered player panel must not expose even a telltale disabled secret slot.

## Social rules, fields, time, spread and player authorship

PC2-D9 / INFERRED: Preserve HV2 M3a and K2's physical/social distinction with typed status fields. Multiple statuses can coexist.

| Status | Reader behavior |
|---|---|
| `physically_impossible` | Operator/law cannot produce the chosen transition with current supported reality. Alternate genuine means/exception can change this. |
| `missing_means` | Tool, stock, actual body, source, containment or capacity is absent. Explain known acquisition alternatives. |
| `forbidden` | Named authority prohibits conduct. A supported illicit route can execute physically; quote known risk and record evidence. |
| `access_denied` | Controlled station/service refuses use through actual custody/access means. Alternative sites, trade or commission may work. |
| `unknown_to_observer` | Preview has incomplete knowledge; truth may still admit execution. |
| `unsupported_simulation` | No registered reader/operator/context adapter. Do not pretend the world's physics forbids it. |

An institution observes via people, devices, reports or public records with scope, delay and reliability. Conduct emits evidence; detection/adjudication is its separate causal reader. If it cannot pay/enforce its own action, reputation/opinion may change without an impossible instantaneous seizure. Actual guards may prevent access physically; that is an action from their means, not a chemical law.

| MR kind | Proposed lifecycle contract |
|---|---|
| MR9 local field | Source-owned region/layer bounds, operating/charge state and stacking group; site containment uses actual location relations. Boundary crossing activates/deactivates applicable evaluation. Imported item home law and use-site field combine through explicit crossing/compatibility adapter. |
| MR10 timed rule | Own clock/era, half-open windows and next transition; same boundary result for chunked time. Pending stages retain admitted definition lock and declared sampling; live continuous fields split only at causal boundaries. |
| MR11 spreading rule | Technique truth stays fixed; observer skill/knowledge moves on supported teacher/contact/document edges. Social adoption/policy edits create new dated revisions. No automatic world-wide teaching or resource grant when the player discovers a rule. Price/competition changes need actual maker/market readers. |
| MR6 player-made rule | Creator composes supported atoms through formation/domain/pocket-law grammar. Require actual source, scope anchor, maintenance, targeted exceptions and compatible field policy. Save creator/source/body/method/charge and edit lineage. Creation preview is reversible/no-spend; admitted installation is durable. |
| MR8 conservation | Ordinary physical ledger checks constituent/charge/identity movement in each world's declared units. Magical creation/destruction uses a named exception ledger. No universal physics cap on accepted outliers. |
| MR12 exploits | Distinct lawful production loops remain play. Receipt idempotency, invalid numbers, stale quotes and duplicated custody remain save bugs. World-specific supply/loss/attention can constrain a loop only when that world actually declares it. |

## Cheats that edit rules

PC2-D10 / INFERRED: Cheats use the same module/overlay envelope and resolver. A scope/cost/exception is a local fiction choice, not a global power ceiling. Debug director selection remains separate from acquired in-fiction power. Pinning generator output cannot overwrite a frozen law without an explicit rewrite.

| Edit | Required targeted scope / receipt | Rollback, expiry and downstream meaning |
|---|---|---|
| Information lens | Observer, source/lens revision, disclosed clauses/protocol and observation receipt | Changes knowledge only; no rule replacement or chemistry buff. |
| Rewrite local law | Exact instance/region/layer, target refs/groups, new revision, supported source/method, payer/debit and expiry | New admission uses edited law. Existing products retain resolved truth; existing jobs follow their locked sampling contract. |
| “Everything I touch is pure” | Actual supported contact event, eligible material family, impurity operator, target batch refs, source/sink/cost | Separation makes real waste; conversion declares new fractions/exception ledger. Touching a container does not imply contact with all contents unless law says so. |
| System shop override | Actual purchase, acquired entitlement/source and jurisdiction, transaction/edit ID | Failed write grants no rule/entitlement and spends no currency. Purchase is not inferred from opening a shop. |
| Timed personal area edit | Anchor/source presence plus explicit until/leave policy | PC2 default fixture follows CS4: leaving disables future matches; expiry does not reverse prior earned products. A stationary player-created ward uses its separately declared upkeep rule. |

Edit receipt: `{editId, actorId, sourceRef, scope, targetRefs, beforeLock, afterLock, parentRevision, committedAt, expiresAt, leavePolicy, costs, exceptionLedger, reasonRef}`. Repeated edit ID is idempotent; a new supported paid edit remains allowed. If source/cost/scope changed since quote, invalidate and re-quote. “Revert” is a new edit with its own terms, never deleting past conduct or restoring already spent resources. Crossings preserve origin/provenance; destination decides suppression/conversion/allowance through its real adapter. Rule effects never quietly travel because an inventory tag says foreign.

## Three per-world example packs

PC2-D11 / INFERRED: These are original proposal fixtures. New tags, opcodes and IDs below require admission, operator readers and world-owner review. Only the first is proposed for the first code slice. Existing Glasshouse identifiers are SHOWN in [content](../../../../../src/pocket_realm_content.js) (`src/pocket_realm_content.js:28`); the proposed fields are not existing Glasshouse laws.

| Pack / lock | Local rules using the same module | Generated/discovery/reader fit |
|---|---|---|
| PC2-W1 / `pack:pc2.frontier_mix@1`, `base.frontier` actual instance | World process response for plant input, ordinary mass accounting, generated response factor; optional counter service policy distinct from physical mixing. Preserve local revision-1 chemistry outside opt-in module scope. | G1 grammar; paid boil/steep comparison at Village counter; unknown result remains drinkable. Mix resolves actual oral payload and use applies it. No new harvest or prestige. |
| PC2-W2 / `pack:pc2.glasshouse_field@1`, `pocket.folded_glasshouse` actual instance | Local thermal ward changes supported drying work; played-time upkeep window; creator law installed at actual bench; caretaker service policy does not decide thermal feasibility. Doorway remains existing boundary owner. | G2 grammar; acquire source/method, pay upkeep, dry one useful material; same rule for caretaker/player means. Player may propose a compatible field, not simply declare it free. Existing doorway does not prove this reader. |
| PC2-W3 / `pack:pc2.lantern_compact@1`, `fixture:pc2.lantern_compact` | Unregistered original world fixture for teachable refinement, named guild policy, timed transmission, local fields and a targeted rule rewrite. A lawful economic loop may spread via actual teaching. | G3 public grammar slots and shared resolver contract only. **PC2-S1: route `route:pc2.compact_investigation`; status SEALED, NOT AUTHORED/NOT IMPLEMENTED.** No secret selector, condition, effect, ingredient, result or truth is specified here. |

PC2-R2 / INFERRED: PC2-S1 is a reserved illustrative secret ID, not a discovered fact or a pre-existing game's secret. Its private pack must later supply a validated opaque reader/witness, with a safe test manifest saying only ID/route/pass status. Public docs cannot prove secret solvability without that private gate. This keeps the example safe without claiming hidden content exists.

## First real reader: Village mixing, one chain stage

PC2-D12 / INFERRED: Land the tag/rule reader on **mix**, inside P2's existing Village counter. Retain purchase/gather routes and the current dose consumer. The scope is one stage plus its existing use route for proof, not an end-to-end harvest/dry/salvage rewrite. HV1/HV2 and PC1 retain upstream/source and broader operation ownership.

SHOWN seams: [resolveMixture](../../../../../src/mixture_state.js) (`src/mixture_state.js:53`), [stageMixtureAction mix/reserve](../../../../../src/mixture_native.js) (`src/mixture_native.js:6`), [commitMixturePlan](../../../../../src/mixture_native.js) (`src/mixture_native.js:42`), [native counter join](../../../../../src/main.js) (`src/main.js:4815`), [native drink dispatch](../../../../../src/main.js) (`src/main.js:4838`), [exposure payload](../../../../../src/mixture_state.js) (`src/mixture_state.js:98`). `commitMixturePlan` currently writes mixture/inventory/money/effect and optional expansion; it does not automatically include a new rule owner. Native admission is currently player-specific, so shared pure actor semantics do not establish an NPC native craft route.

| Step | Concrete reader and outcome |
|---|---|
| Admission | Optional original PC2 method enrolls on a paid/observed route. Tag adapter reads actual existing ingredient profiles with admitted presence tags; quantity/fractions remain P2 truth. No fabricated batch freshness or rich HV2 lots. |
| Quote | Match supported ingredient roles and process; resolve known prediction/uncertainty with a lock. No inventory mutation, knowledge grant, generator consumption or new random execution roll. |
| Mix resolution | Resolver reads one world response and one generated per-instance response, applies parameter composition and ordinary conservation, constructs a new versioned product with effective law factors/refs and resolved dose. Changed actual payload, not just label, gives GR12 proof. |
| Publication | Atomically publish input debit, full frozen rule, product/receipt, observation candidates and any job state through an extended existing seam. A failed write leaves all owners unchanged. |
| Drink | Existing instance-specific exposure route reads the retained new payload; refill/teacher/NPC examples remain separate later readers. Drinking an old product uses its old retained law. |
| Repeat | Store exact product/method/held inputs and admitted law lock. Next repetition is a new admission; after a lawful rule change stop or quote a new supported revision rather than reproducing old output under changed terms silently. Preserve old repeat jobs unchanged. |

Concrete nonsecret fixture: 100 fictional restore units in a 2000-unit vial, boil availability `1`, generated factor `6/5` gives health-regeneration payload `1.2`; the same composition at steep availability `13/20` gives `0.78`. Matrix/trace mass stays unchanged. At default generated factor `1`, dose is the existing local response. A law-changing cheat affects the next mix, not a previously brewed vial. These numbers are synthetic source-test vectors, not real balancing decisions or selected hidden recipes.

PC2-D13 / INFERRED compatibility decision: Keep P2 revision-1 products, learned methods, pending jobs, exposures, keys and validators under their retained interpreter. Opt-in new-method products use a distinct supported product revision/identity namespace including relevant resolved law fingerprint; do not alter existing `m1:` IDs. New decoder/validateExposure paths must read the complete record rather than regenerate it from current tables. Adapt appearance acquisition too, because [stage code](../../../../../src/mixture_native.js) (`src/mixture_native.js:37`) currently calls `resolveMixture` again. Extend whole-envelope validation to rule refs, products, jobs, methods, appearances and consumed-product exposures. No backfill/reroll on load, no seed derived from save contents, no arbitrary native schema number reserved here. Unsupported imports reject before replacing the previous save; active old obligations require their retained dependencies. Absence of optional owner remains valid and unchanged until actual enrollment.

PC2-R3 / INFERRED: Visible proof at 1366x768 and 1600x1000: counter uses the screen for inputs/process and selected product/known comparison receipt; routine Mix/Drink/Repeat actions and actual shortage/uncertainty stay visible. Rebuilt fresh-origin natural paid mix → drink → native stat/effect change, then Save/reload/Export/literal-file Import into a second fresh origin is the authoritative implementation gate. Mobile, a universal chemistry engine, new harvesting, general NPC automation, multiple realms and closed-browser progression are deferred. Human fiction/balance acceptance remains separate.

## Performance and indexing (MR13)

PC2-D14 / INFERRED: Compile indexes at admitted pack/revision boundaries. `TagStore.query` currently scans tracked entities ([source](../../../../../src/tag_store.js) (`src/tag_store.js:191`)); no production performance index was verified. Do not claim MR13 already implemented.

| Index / cache | Correct candidate selection / invalidation |
|---|---|
| Route + world instance + layer | Partition rules before matching; include origin-law adapter refs explicitly. Rebuild on relevant pack/overlay revision. |
| Positive tag postings | Expand registered implications once per tag/entity revision. `all` can intersect postings; `any` unions branches, including an unanchored bucket for any negative-only branch. Always run full predicate afterward. |
| Negative-only / universal rules | Dedicated route-scoped bucket; never drop them because there is no positive tag. Unknown stays unknown. No all-material-pair scan. |
| Field containment + time transitions | Read actual region/source relation and scheduled next boundary, not all world fields each frame. Expire/invalidate only affected scopes, with played-time pause semantics. |
| Dependency map | Cache key includes actual subject/property/tag revisions, procedure/station/source/actor means, effective rule lock, resolver revision and relevant clock segment. Knowledge changes invalidate projection only. |
| Resolved product | Cache immutable semantics by canonical retained input/process/law fingerprint. Quote still revalidates actual stock/access/capacity at commit; cache cannot authorize stale ownership. |
| Traces / history | Bounded detailed active traces, compact terminal summaries only when no consumer needs detail. Never garbage-collect a rule/product needed by an active exposure, pending job, taught document or holder. |

Proposed cost class: candidate lookup proportional to touched posting lists plus route fallback bucket; full evaluation proportional to candidate rules and declared AST size. State explicit maximum AST depth, candidates, reaction extents and retry budgets at implementation time. Reject over-budget admitted content or offer an authored equivalent coarse resolver; never silently truncate effect-bearing material or reaction traces. Closed-form scale representations must retain law-equivalent results and named rounding/remainders. MR13 is measured by candidate counts and chunk-equivalence, not by an unsupported universal millisecond claim.

## Implementable acceptance-case table

PC2-T0 / INFERRED: These are future cases, **NOT RUN**. Suggested unit fixture file `tests/rule_modules.test.js`, generator file `tests/generated_rule_grammar.test.js`, native integration file `tests/mixture_rule_modules.test.js`; all are proposed names. Existing `rules`/`tag_store` consumers must stay compatible. Public fixtures contain no secret truth.

| Code | Fixture / action | Exact expected check |
|---|---|---|
| PC2-T1 | Deep-freeze context; evaluate repeatedly | Identical match/reasons; no owner mutation, clock/resource changes or random calls. |
| PC2-T2 | Hidden registered tag in explicit observer view; negate | `known:false`, no matched negation; complete truth resolves independently. |
| PC2-T3 | Known false conjunct beside unknown; known true disjunct beside unknown | `all` known false; `any` known true; empty `all` true/empty `any` false. |
| PC2-T4 | G3 `{tag}` query versus raw TagStore input; implied parent | Explicit compilation succeeds; uncompiled unsupported grammar diagnosed; child implies parent. |
| PC2-T5 | Unknown tag/opcode/units, nonfinite value, ambiguous AST | Admission refuses without writes; opaque diagnostics for restricted refs. |
| PC2-T6 | Empty input domain, one trace constituent, threshold needing bulk | No empty consumed-role success; presence cannot satisfy bulk amount; trace retained. |
| PC2-T7 | C1 scalar replacements, add/multiply, two bounds | `22/25` for C1; arithmetic exact until declared quantization; bound intersection respected. |
| PC2-T8 | Same-rank incompatible replacements; permute input object/array where order is not semantic | Conflict independent of incidental insertion order. Explicit authored op order remains meaningful/hashed. |
| PC2-T9 | C2 permit/exemption with absent then supported source | Permit alone blocked; supported targeted exception clears only its named veto and pays cost. |
| PC2-T10 | C3 private vat versus guild-owned vat, no witness then report | Private physical result remains same; service refusal distinct; enforcement only from attributed evidence. |
| PC2-T11 | C4 shared 4-unit supply versus two 3-unit claims | Ambiguity produces zero; choose one produces full selected reaction and exact 1-unit remainder. |
| PC2-T12 | Full-minimum reaction infeasible; supported alternate priority route | Declared alternative may win if its full requirements fit; no partial debit for rejected candidate. |
| PC2-T13 | Duplicate overlay/module reached through two indexes | One application per ref/phase; conflicting active revisions rejected. |
| PC2-T14 | C5 ban + add + pin | Still vetoed; explicit ban release changes membership only, not physics. |
| PC2-T15 | Input transforms add a selector tag; cyclic rules | Re-match at declared step boundary only; unsupported cycle fails before spending. |
| PC2-T16 | World/instance/life/continuity scoped law draws | Same addressed world law for player/NPC; personal law differs only when scope says so; unrelated draw does not shift result. |
| PC2-T17 | 1000 fixed roots; G1 generated factor set | Every seed has paid feasible witness/use reader; normal fixture each of three factors lies in predeclared 25%-42% band. Fallback count/reasons reported. |
| PC2-T18 | Three golden roots `1`, `42`, `20261014` under pinned manifest | Freeze exact generated value, selected refs, receipt and effective lock; implementation supplies reviewed golden records, not hashes invented here. |
| PC2-T19 | All candidates invalid; bounded retries | Addressed attempts stop at budget; named authored fallback retained; no infinite retry or shifted later subject. |
| PC2-T20 | Repeated previews and stale quote after law/stock/site change | No draws/spend/discovery; stale commit rejected; fresh quote uses current allowed lock. |
| PC2-T21 | Partial clue then table/content update | Full prior law retained, including undisclosed clauses; only still unused/unseen addresses may use new lock. |
| PC2-T22 | NPC craft first, no player reveal; later content update | Earlier causal law locked; player sees observations through own knowledge, not NPC omniscience. |
| PC2-T23 | One rumor copied ten times, independent controlled trial, contradictory context | Evidence lineage prevents confidence multiplication; scoped claim updates without rewriting truth. |
| PC2-T24 | C6 timed boundary; C9 overlapping fields; leave/reenter | Half-open boundaries exact; stage lock retained; continuous chunked/whole integration agrees; field conflict explicit. |
| PC2-T25 | Teach technique along one delayed contact edge | Only eligible receiver learns at due boundary; no global knowledge/stock/price grant; repeat delivery idempotent. |
| PC2-T26 | C7 separation cheat, inadequate waste capacity then enough | Missing means refuses zero-debit; success accounts all fractions/waste/cost. Creative exception has explicit ledger. |
| PC2-T27 | Failed durable edit/mix/use publication | Currency/stock/rule truth/knowledge/products/jobs/effects unchanged; post-write render failure does not refund. |
| PC2-T28 | C8 legitimate new loop versus same settlement replay | New paid occurrences allowed; replay cannot duplicate output; no global once cap added. |
| PC2-T29 | Same inputs/law factor in pure player and NPC contexts | Same chemistry; different real skill/access terms change only declared channels. Native NPC route is a separate unimplemented gate. |
| PC2-T30 | Generated-rule mix and drink, factor `6/5` | Synthetic dose `1.2` boil / `0.78` steep; actual exposure reader applies retained payload. |
| PC2-T31 | Old absent owner and revision-1 pending/final/exposure saves | No enrollment, reroll, output/stat/key change or missing old interpreter; current native schema remains valid. |
| PC2-T32 | New pending/final products and exposure: save/reload/export/literal import; next untouched address | Exact law/knowledge/reservation/receipt/product/exposure and next generated value retained. All holder refs resolve. |
| PC2-T33 | Missing dependency, future schema, dangling product/rule ref | Import rejected before previous save replacement; no substitute/drop-to-zero repair. |
| PC2-T34 | Thousands of irrelevant rules; positive, negative-only and mixed OR selectors | Indexed versus full reference matcher give identical candidate results; candidate count scales with touched route/scopes, not all rules per tick. |
| PC2-T35 | PC2-S1 public projection/test manifest | ID/route/status only; no hidden selectors, names, numbers, slot counts or cause truth. Private solvability gate stays OPEN until authored. |
| PC2-T36 | Rebuilt fresh-origin desktop native route | Paid counter mix, uncertainty/known comparison, drink stat change, shortage, persistence at 1366x768 and 1600x1000. Served rebuild/source binding and human acceptance tracked separately. |

## MR1-MR13 coverage map

PC2-V1 / INFERRED: Coverage of the requested docs contract, not implementation status.

| Root row | Contract location / acceptance cases |
|---|---|
| MR1 world laws | Schema/effect kinds, K2 and packs W1-W3; T7-T10 |
| MR2 generated per-save rules | Grammars G1-G3, addressed scope/freeze/solvability; T16-T22 |
| MR3 social/institution rules | Typed feasibility and actual evidence enforcement; T10 |
| MR4 rules about rules | Assembly versus resolver order, channel policy, C1-C9; T7-T15 |
| MR5 discovered knowledge | Observer claims, confidence, safe projection; T2-T3, T21-T23, T35 |
| MR6 player-made rules | Supported atoms, creator/anchor/upkeep/exception lifecycle; T9, T24, T27 |
| MR7 rule-editing cheats | Scoped immutable edits, actual contact, purchase and receipts; T20, T26-T27 |
| MR8 conservation | Typed ordinary and explicit exception ledgers; T6, T11, T26 |
| MR9 local fields | Containment, overlap, source and crossing reader; T24 |
| MR10 timed rules | Half-open windows, admitted versus continuous sampling; T24 |
| MR11 spreading rules | Technique truth versus contact-scoped knowledge/social revision; T25 |
| MR12 exploits as play | Distinct lawful loops versus duplicate settlement; T28 |
| MR13 rule cost budget | Route/scope/tag indexes, negative fallback bucket, revision cache; T34 |

## Ranked next steps, if selected by root

PC2-A0 / INFERRED: Suggested touch sets must be refreshed/reserved by live owners. These rows are not implementation authorization. Suggested executor levels are Codex default model/reasoning effort, not spawned agents. Complete the first playable reader before starting another world pack.

| Rank / code | Files / visible outcome | Saved-state change and compatibility | Gate | Suggested executor |
|---|---|---|---|---|
| 1 / PC2-A1 | New `src/rule_modules.js` with narrow query adapter/effect compilation; existing `src/rules.js`, `src/tag_store.js` only if required by actual caller; new `tests/rule_modules.test.js` | No native state yet; strict immutable module/lock format. Existing predicate/tag APIs preserved. Specify actual save/product version seam in the same packet, so this pure module does not become a terminal write-only “done” | T1-T15/T34, existing caller slice; reserve immediately following A2 first reader | Medium for pure contract implementation; high review for allocation/conflict semantics |
| 2 / PC2-A2 | `src/mixture_state.js`, `src/mixture_native.js`, narrow `src/main.js` save/load/use joins, actual save validator, `src/product_appearance_state.js`, existing mixture UI owner, new grammar/test adapter as needed; paid Village mix reads generated law and Drink applies changed dose | Optional frozen per-instance law plus new versioned product/method/job/exposure path. Keep all revision-1 records/interpreter. One atomic envelope includes every new owner; no load-time grants | T16-T23/T27/T30-T33/T36; GR16 sweep/goldens/next-value, build, fresh desktop natural route, literal import and failure control. This is the first playable completion gate | High; one owner for native state/product/persistence joins |
| 3 / PC2-A3 | Existing institution/evidence, actor/job and site owners refreshed by root; `src/rule_modules.js`, actual selected native operation and knowledge projection; one private versus institution-station comparison | Actual jurisdiction, witness/report and obligation refs; no global criminality flag or NPC truth copy. Optional observer records need chosen AB3 owner; old owner absence preserved | T10/T23/T29; same physical result with differing access/consequence, witnessed versus unwitnessed, saved evidence/refusal/native route | High for institution/actor integration; medium for isolated projection |
| 4 / PC2-A4 | `src/pocket_realm_rules.js`, actual realm source/context/state owners, `src/rule_modules.js`, chosen process reader and existing cheat owner only after reservations; one field/edit with a useful process effect | Revisioned source/anchor/clock/window/edit/exception refs and receipts; existing doorway/old job semantics retained. No automatic law installation on reentry or stale quote payment | T9/T20/T24/T26-T27; paid useful field, expiry/leave/return, crossing, failed write and literal import. W3 secret implementation remains a separate private-authoring task | High for realm/cheat persistence; one integration writer |

## Checks performed and remaining gates

PC2-V2 / SHOWN: Read COMMON first, AGENTS/PROJECT/USER_VISION, both palette rounds, harvest PLAN/HV2 MODEL/REPORT, listed sibling owners, GR1-GR17/GA4/G3 and source entry points. Read HV1 only through `git show proc/hv1-carcass:src/harvest.js`, snapshot `de15c662a8a2c7a76976c02502df3f8001f3bbc8`; no checkout. Main HEAD at evidence read: `ce23ead888e6f0b76da6617f44d7598a037c87af`. Other sessions may advance it; these are source/doc snapshots, not latest integration guarantees.

PC2-V3 / SHOWN: Documentation validation is recorded in [CHECKPOINT](CHECKPOINT.md). No future acceptance case in the table was executed. No general resolver, generated rule module reader, law edit, spread system or sealed truth was implemented by PC2. Existing source behavior was read, not browser-verified here.

PC2-R4 / STATED + INFERRED: First authoritative playable gate remains A2's rebuilt fresh-origin Village mix/use plus exact save/reload/export/literal import and failure controls. Desktop-first scope and one-realm milestone remain; proposals do not change accepted owners. Human fiction/balance/taste remains unaccepted. Root owns any commit and fold; PC2 changed only its two docs.

Summary: one revisioned rule-module shape covers MR1-MR13 while keeping evaluation, resolution, publication, knowledge and enforcement separate. Conflict cases, generation witnesses, three original packs, 36 future acceptance cases and a single Village mix reader make the proposal executable without claiming new gameplay.
