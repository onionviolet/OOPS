# Make world authoring easier

Adopt these in small steps around current JS definitions, registries and compilers. This is a tooling proposal, not implemented tooling or measured savings. [Authoring AUTH01–08](../authoring/FINDINGS.json) owns its audit; [runtime RTE01–10](../runtime-efficiency/FINDINGS.json) owns cost proposals. Neither requires a new DSL or database. All exports below are proposed until Engine freezes them.

The live revision 4 plan also assigns a [whole-world bank GM](../world-bank/ASSIGNMENT.md). Its bank/query/character/timeline contract remains that role's work. These tools consume its reviewed scoped query results when available; they do not build a competing canon or character bank. The first connected pair can use existing reviewed claim maps without waiting for a full bank or every world resident.

## 1. Manifest and explicit opt-in

A proposed JS descriptor emits a JSON-safe manifest with `id`, `contentRevision`, `contractVersion`, definition families, source claims/cutoff, required host capability versions, definition imports/exports, entry/activation closure, UI destinations, and save compatibility policy. Runtime composition uses an explicit Engine-owned list. No filesystem discovery, import-time enrollment or dynamic third-party plugin loader is needed.

Example shape, authoring proposal only:

```json
{
  "id": "world.mol.research",
  "contentRevision": 1,
  "contractVersion": 1,
  "requires": ["instance.endpoint.v1", "work.guard.v1", "condition.target.v1"],
  "activation": {"mode": "explicit-command", "commandId": "mol.research.enter"},
  "bindings": {"commands": "here", "acceptedWork": "quests", "people": "people"},
  "compatibility": {"missing": "dormant", "semanticChange": "review-required"}
}
```

The manifest additionally lists exact entry-spawned actors, initialized sites, automatic checks, controllers and stock grants. Definition import is inert; legacy shared services retain their current explicit baseline. New package actors/sites/checks/controllers are excluded from common enrollment until selected. Distinguish installing definitions, activating a package, starting a visit, acquiring a source and granting rewards. Reentering restores the same actual state, not initial stock. A world label cannot provide independent native quest/shop/calendar/location ownership.

Save handling is Engine-owned: missing package records create no actor/reward; committed revisions remain frozen where their existing policy requires it; compatible wording corrections retain meaning; changed IDs/effects/clock semantics need explicit aliases/migration or recoverable rejection. Source corrections produce an impact report, never automatic save repair. Package versioning alone cannot make an old build load unknown IDs.

## 2. Linker and useful diagnostics

Proposed `scripts/world_content_preflight.mjs` takes a selected descriptor, Engine capability catalogue and existing registries. Emit source-path diagnostics plus a source/mechanic/definition/effect/state-owner/native-consumer/UI/acceptance map. Report a dependency closure per package and changed feature. Reuse current validators before writing new checks.

Check known IDs and actual item reconstruction, source/power/faculty references, endpoint/location/native unlock names, effect handlers, participant aliases, clock domains, duplicate definitions, compiler-preserved fields and activation closure. Emit codes such as `UNKNOWN_NATIVE_ITEM`, `MISSING_UI_CONSUMER`, `DROPPED_PARTICIPANT`, `UNDECLARED_ENROLLMENT`, `UNSUPPORTED_HOST_CAPABILITY` and `CONTENT_REVISION_REVIEW`. Include the original file/path, mechanic ID, implicated API and a concrete repair. Opaque predicates and runtime-bound support are marked unknown, not declared unreachable or safe.

A successful report establishes definition/link closure only. A UI destination entry is insufficient unless the actual renderer dispatches the bound action. A structural source/body label does not prove fuel/support. Runtime guards remain, including native reconstruction/unlock validation and exact settlement checks. Useful measured counters are workload, diagnostics and returned repair rate; file/word counts alone cannot prove tokens, latency or elapsed development savings.

## 3. Templates, factories and compiler fixes

Proposed `scripts/new_world_packet.mjs` writes a dry-run scaffold into a new explicitly supplied local world directory only. Generate a brief, claim/coverage map, package descriptor, one entry/exit chain and an ownership table. Every placeholder is unresolved until supplied; no invented source, actor wallet, permission, native binding or roster enrollment. Reject existing-path overwrite. It never edits main/registries/save, dispatches workers or sends messages.

Provide small JS factories for a funded service, source-qualified training session, finite input/output recipe, branching offer and a returning resident. Build them from existing ordinary effects and actual planners. Do not flatten repair-with-consumed-kit, reusable-anchor repair and unrepaired detour into identical outcomes. Reuse actual dynamic spawn aliases/role selectors with declaration order; aliases do not outlive their preparation list. Keep dedicated source semantics for Gu diets, anchored faculties, conceptual authority and temporal carriers where the ordinary vocabulary is insufficient.

Fix `compileSiteProject` to preserve participant/target/co-location fields or reject them, and parameterize project-local observed completion. Retain compiled normal commands/claims. Generate a control-flow report for situation ambient/response/expiry paths and external starts. Successful response does not automatically advance to the ambient successor; deliberate terminal/detour routes stay intact. Do not require this multiworker fix for the first direct-command Frontier/MoL cases.

## 4. Preview and author workflow

First preview is an author-only static report: legal definitions, rule reasons, compiled graph, source qualifiers and declared consumers. A later generated-fixture native preview belongs to Engine's approved build workflow; it uses disposable generated state and can never read/write personal saves. Current browser/game/save tests remain deferred. Label static preview, built-unverified preview and observed gameplay separately.

Keep runtime panels aligned with Here/Practice/People and native Quests, using one destination map for buttons and waiting-work links. Show spent inputs, reserved/reusable support, result, actual clock, cancellation terms and readable blockers. Keep actor private truth out of report/tooltips/search/recaps. Reuse downloaded assets through the established UI writer; an icon does not prove its represented function.

Proposed task helper takes the selected package manifest, reviewed coverage IDs and exact file-owner map. Generate packets in that world's owned folder with base/input hashes, frozen API version, unresolved dependencies, source locators and static/later gates. Return an ambiguity instead of allocating a contested file. Review only changed files and declared dependency closure, while retaining full validation for opaque shared dependencies. Existing source owners retrieve a named scene; a worker does not reload every dossier.

## 5. Adoption order and evidence

After review, `T01` supplies manifest/link closure alongside the first pair. `T02` turns the actual integrated pair into worked recipes and safe scaffolds; do not template an unconnected catalogue. `T03` optionally adds local native previews/task generation after the capability/ownership maps exist. Source/native compatibility and author diagnostics are required for repeated packages; a visual editor, live hot reload, universal grammar, hosted authoring service and automated world installer wait for actual demand.

[Runtime's historical profile](../runtime-efficiency/DEPENDENCIES.md#saved-measurements-and-their-limits) supports retaining current preview reuse. It does not justify a storage rewrite, broad branch-local drafts or claimed new speedups. Add optional phase counters and derived indexes through Engine if a representative approved workload identifies a bottleneck; preserve full validators initially. Token findings are consumed at their actual delivery state in [DAG](IMPLEMENTATION_DAG.json), never reconstructed from file sizes or inferred model bills.

The completed [token handoff](../token-efficiency/DEPENDENCIES.md) supplies TF01–06: query the existing claim index by question/era/mechanic; retain positive functions, exceptions, labels and unknowns; split author facts from observer projections; attach exact input revisions and criterion to a review receipt; qualify one actual economical worker return before repetition; close terminal work once. Use a manual selective lookup first. An extraction helper is optional when repeated consumers justify it. No second canon ledger or blanket model change is needed. Actual host usage and coordinator/worker repair effort remain unavailable here, so comparative cost fields stay null.

Tool acceptance is observable: unknown native item rejected before integration; unselected package creates no actor/site/check/stock; cooperative project fields retained; successful/expired offer graphs differ; scaffold cannot overwrite; generated packet names one writer; changed content produces the correct compatibility warning. Later native qualification still proves actual source/fuel/output, independent clocks/state, publication failure and revisits. None of those tooling/game cases ran in this planning role.
