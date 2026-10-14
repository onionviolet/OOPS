# B7 report: NPC body detail levels

2026-10-14. **Documentation complete; implementation unselected and unverified.**
Only this `b7/` folder was written. No source, shared owner, B2, worktree, save,
bundle, staging, commit or npm operation was changed or run. Existing dirty
state and other workers were preserved. File:line locators are the inspected
live snapshot and may drift under concurrent work.

Deliverables: [LEVELS](LEVELS.md), [TRIGGERS](TRIGGERS.md),
[CONSISTENCY](CONSISTENCY.md), [BUDGET](BUDGET.md) and
[CHECKPOINT](CHECKPOINT.md). B7 extends G48 with `G48-B7` contracts and keeps
GN1-GN12/BD1-BD9 meanings. Every new schema, size allowance, demand bundle and
algorithm here is a proposal, not accepted mechanics or runtime support.

## Evidence and findings

Shown means direct source/doc inspection; stated means another lane's reported
status; inferred means this lane's conclusion or proposed fit. No source-read
finding establishes browser behavior or a passing test suite.

| Code | File:line evidence | Finding and spec consequence |
|---|---|---|
| F1a Shown | `src/npc_lives.js:5-22,45-51` | Six authored family members, fixed parent/spouse links and hash-selected death years, plus optional recruit. No body schema or genetics in those records. Preserve authored timeline and optional enrollment |
| F1b Shown | `src/npc_lives.js:24-31,33-42` | 32-person/64-event/16-news validation; advancement clones and reveals saved events; view hides not-yet-joined members. Generation must not run from annual news or reveal future bodies |
| F1c Inferred | `src/npc_lives.js:13-20,28`; `docs/gm/dispatch/procgen-2026-10-13/p19/LINEAGE.md:7-18` | Legacy parent arrays lack biological roles/recognition basis and validator lacks ancestry-cycle checks. New genetics needs typed descent, cycle/epoch validation and incomplete-prehistory migration, rather than assuming every family link transmits DNA |
| F2a Shown | `src/people_knowledge.js:6-15,17-39,50-63,81-105` | Known People is a witnessed/received projection, omits private craftsman state, mixes domain memory directions and appends by ID. Add observer-safe body details through adapters, not raw body spreads or automatic registry introduction |
| F2b Shown | `src/character_bio.js:10-18,21-31,34-51` | Biography explains earned sources, keeps ancestry uncertain, filters dormant faculties/unobserved techniques and reports visible training. It is not a generator or trait grant. Preserve that pure projection and activation authority |
| F2c Shown | `src/simulation_effects.js:131-158,281-284`; `src/simulation_contracts.js:232-250` | Execution may read actual target body while observer facts are separate; existing knowledge learning stages overwrite same-key entries; people need actor bindings. NPC-body adapters must distinguish truth from claims and cannot silently enroll P4/household refs |
| F3a Shown, branch only | `.claude/worktrees/proc-p4-people/src/generated_people.js:12-41` | Exactly three seed-generated travelers with saved naming/traits/needs/request/stock and RNG. No body, parents, birth date or inheritance model. Main `src/` file inventory lacks generated_people.js at this audit |
| F3b Shown, branch only | `.claude/worktrees/proc-p4-people/src/generated_people.js:43-66,68-79` | Pure hourly routine projection; arrival/meeting gate views; traits disclose through talk; funded help and settlement are bounded. Keep those saved outcomes. Do not share its name/personality draw stream or copy its undiscovered-count behavior into hidden-body UI |
| F3c Shown | `docs/gm/dispatch/procgen-2026-10-13/p19/CONTRACT.md:7-9,86-102`; `p19/NPC_LIVES.md:13-19,31-45`; `p19/LINEAGE.md:7-18,49-55`; `p19/GOSSIP.md:13-33` | Qualified identity, scheduling fidelity, typed kinship, local clocks and truth/claim/transit/belief are proposed separate contracts. Body demand complements them. Sparse social budgets are unmeasured; relationship status is neither parentage proof nor universal disclosure |
| F4a Shown | `docs/gm/dispatch/body-lineage-2026-10-14/b2/SPEC.md:10-32,42-64,71-115,119-152`; `b2/MIGRATION.md:94-108,113-147` | B2 proposes one native-player body record, SG separation, card instances, unassigned GN and strict versioned migration. B7 aligns paths but needs a sparse NPC validator and explicit genetics/lineage extension. It cannot widen B2 schema1 silently |
| F4b Shown | `docs/gm/dispatch/relationship-prereqs-2026-10-14/AUDIT.md:37-56,65-72`; `CLAUDE_ADDENDUM.md:38-49`; `CLAUDE_ADDENDUM_2.md:3,15-17,49-54`; `docs/USER_VISION.md:2055-2068,2080-2082` | Directional willingness, evidence, retention and compatibility matter without a mandatory social-store merge. The age/appearance rule is separately live in User Vision: coarse stage/spousehood cannot prove eligibility. Addendum 2 now routes to part 29 as owner; preserve its original requirement without treating other proposals as accepted |
| F5a Shown | `src/components/bio_component.js:11-17`; `src/main.js:5189,5307`; P4 worktree `src/main.js:5191-5193`; `src/save_migration.js:3-10`; `src/save_files.js:185-216` | Native bio has an explicit four-field serializer; household/P4 snapshot routes differ; migrations/preflight/guard exist. A future NPC-body domain needs explicit full-envelope persistence, real-loader validation and rollback. Arbitrary extra JSON properties do not prove survival |
| F5b Inferred arithmetic | [BUDGET B2-B3](BUDGET.md#g48-b7b2-population-estimates) | 100/1,000 illustrative body-plus-lineage fixtures need about 114/992 KiB UTF-16. 10,000 proportional-detail and lineage uses 10,013,184 bytes. Even the sparse lineage case exceeds 4 MiB. Lazy bodies alone cannot promise large-population fit |

For shortened table locators, `p19/` means
`docs/gm/dispatch/procgen-2026-10-13/p19/`, `b2/` means
`docs/gm/dispatch/body-lineage-2026-10-14/b2/`, and the relationship addenda are
under `docs/gm/dispatch/relationship-prereqs-2026-10-14/`.

## Five ranked recommendations

| Rank / code | Recommendation | Concrete next gate |
|---|---|---|
| 1 / R1 | Add one sparse NPC-body adapter using B2 paths, qualified identities and explicit resolved-family coverage | Original existing NPC demands one visible field and one useful quirk without changing legacy life/request/stock state |
| 2 / R2 | Resolve dependencies on detached plans and persist body/evidence with the owning action before publication | Failed storage, stale revision and repeated preview produce no partial value, charge or discovery; committed input survives real reload/import |
| 3 / R3 | Freeze creation-time contributor inputs before child phenotype detail | Parent-first/child-first and before/after-parent-change fixtures preserve compatible child truth, twins and typed adoption/ritual distinctions |
| 4 / R4 | Keep observer claims and actual anatomy separate through every view/consumer | Hidden effect can work unnamed; two conflicting diagnoses and a no-contact observer stay distinct; no sealed-truth UI leak |
| 5 / R5 | Measure full-envelope growth before selecting 10,000-person storage | Actual codec/retention/import benchmarks include lineage snapshots, pinned accumulated detail, other origins and social state; choose lossless storage design if guard is exceeded |

These compare effort and consistency risk; they do not impose a full genetics
or population simulator as a gate for the one-realm/one-prestige milestone.
Default + Dial and in-world reason/cost stay in the detailed documents. No
either/or question or new user approval is needed for this docs-only return.

## Checks, limits and handback

**V1** Read COMMON/PLAN/B7, AGENTS, PROJECT priorities/accepted decisions,
USER_VISION top and relevant age direction, full genetics palette, linked
life-sim body/person/checklist sections and prior integration. Inspected all
requested source areas and relevant P19/relationship contracts. Read B2 as
available and refreshed its native migration contract; no B2 edits.

**V2** Executed budget arithmetic with synthetic counts and stated allowances.
This verifies sums and base64 rounding only. There was no serializer fixture,
performance benchmark, storage write or save access.

**V3** Final structural check covers local Markdown file targets, section
anchors, whitespace, prohibited dash forms, required output presence, GN/BD
coverage and cited file/line existence. Scope review covers this lane's files
and preserves unrelated dirty paths. The checkpoint records actual results.

**O1** Root still needs to select exact NPC schema/envelope placement and the
B2/shared-body adapter, integrate qualified owner refs, choose a supported
transmission model and reconcile P4 integration. Schema proposals are not API
contracts already implemented in main.

**O2** All implementation proofs remain OPEN: source consumers/validators,
order-independent dependencies, compatibility migration, rollback, retained
definition/capsule support and real Save/reload/Export/literal-file Import.
The unrun cases in TRIGGERS and CONSISTENCY define the observable gates.

**O3** Playable proof remains OPEN: own rebuild, fresh-origin useful NPC-body
interaction and observer-safe People/body result at desktop 1366x768, with
ordinary-play control. Large population/time/storage performance, fiction,
balance and human acceptance remain unverified. Mobile optimization is deferred.
No implementation or build was authorized or attempted by B7.
