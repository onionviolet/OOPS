# Artifact collection integration packet, revision 2

GOAL: Deliver the finite original Village collection through the actual native
bag, finite seller stock, existing feature controls and sole durable publisher:
useful loose pieces, two assembly stages, exact disassembly, item-bound kit work,
one carried-item scene, ordinary pin recovery and a useful reusable pin.

AUTHORITY: The original “we can upgrade engine accordingly?” and direct
2026-10-06 “implement the rest in parallel ... Continue with relevant game
masters” continuation in docs/gm/dispatch/AUDIT_REMAINDER_2026_10_06.md.
The former coordination-permission dependency is superseded. Its exact prior
packet/checkpoint/checks survive in HISTORY_BEFORE_RECONCILIATION_2026_10_06.json.

WRITERS: Artifact owner01a10faa-2aec-7771-9c0d-c15475d394fc releases only the
three existing artifact modules and this directory through RELEASE.json.
Audited GM01a10fe7-c3cd-79a2-86d0-2eba1fcfcefd is the sole current shared/native/
main/registry/UI/save/build/canonical integrator. Dispatcher01a112a0 relays this
packet. No peer reply, new chat, duplicate build or artifact writer is required.

BASE: Dirty shared checkout. Use RELEASE.json source/export/item/function hashes
and CHECKS.json exact live API-input fingerprints. Moving shared inputs must be
reconciled by the integrator. This source role has not edited them.

## Exact exports and consumer joins

src/artifact_collection.js exports compileArtifactCollection,
compileItemEncounter, itemPossessionRule, artifactCollectionView and
artifactEquipmentReasons. The last pure helper takes (costs,state,context) and
returns blockers for consumed/transferred inputs matching actual native or
simulation slots. Missing native equipment snapshots reject reservations.

src/artifact_workshop_content.js exports ARTIFACT_WORKSHOP_IDS,
ARTIFACT_WORKSHOP_KEYS, artifactWorkshopCollection, artifactWorkshopDefinitions,
artifactWorkshopItemSpecifications and
registerArtifactWorkshopItems({itemTemplates,OtherItem}).

src/artifact_workshop_host.js exports
commitArtifactWorkshopCommand(state,registry,command,context,expectedSequence)
returning a normal unpublished plan, and
artifactWorkshopPresentation(state,registry,context) returning existing feature
sections. Native equipment blockers apply in both quotes and commits/scene
payments. This host has no separate stock, scheduler, native domain or publisher.

Required shared joins reserved to the integrator:

- src/feature_expansion_content.js: append artifactWorkshopDefinitions to current
  families. No new artifact sources. Preserve current fieldcraft/audited families.
- src/data/expedition_items.js: import/call registerArtifactWorkshopItems exactly
  once with current item_templates/OtherItem. The six exact native IDs/specs are
  fingerprinted in RELEASE.json. Registration grants no inventory.
- src/main.js: within current actFeatureExpansion, route command.type ===
  'artifact_collection' to the planner, then the one persistExpansion(plan).
  Supply current featureWaveContext with fresh native gameplay/external/vitals/
  equipment and actor/local/busy facts. Preserve all existing dispatch branches.
  The host handles explicit first meeting/enrollment, declared IDs, scoped
  cancellation, scene responses and withdrawal. Never publish twice.
- src/feature_expansion_wave_host.js: append artifactWorkshopPresentation sections
  once, or use the remainder aggregate's one equivalent caller. Reuse existing
  cards, costs/blockers/work/response controls. No new panel/CSS or duplicate
  response owner.
- src/simulation_contracts.js: command validation admits only absent or
  d.reservationReturns === 1. src/simulation.js: its selected return-accounting
  condition also admits that marker and copies it into the already supported
  simulation4 frozen-job field. Preserve existing groups. Returned tools/parts
  and cancelled transfers must not count as new loot. This enables reuse across
  world/group IDs without another hardcoded whitelist.
- src/simulation_ui.js: exclude artifact_collection sessions from generic People
  session projection. src/adventure_notebook.js: route this group's waiting
  encounter to Here/feature_expansion_panel. The feature presenter supplies the
  sole artifact response/cancel/withdraw controls.

## Identity, finite functions and named repairs

Displayed maker: Vela, Village instrument maker, distinct from the existing road
rival and family bench owner named Mara. Hidden stable maker ID
artifact_collection.mara is deliberately retained for prior source-created
records. It denotes Vela only here; no native Mara actor/memory/stock/body/power
is reused or replaced.

Group/namespace artifact_collection; world base.frontier; location Village.
15commands/one scene artifact_collection.tray/one situation
artifact_collection.workshop/one optional person/six native item specs. Exact
IDs/keys/compiled definitions and hashes live in RELEASE.json.

Named repairs from current source review:

- Every paid pin recovery now records the firsthand kit-template cut. Manual
  recovery previously granted a pin whose useful action still required a
  prism-only measurement. Ordinary recovery now has its actual kit consumer
  without ever owning a prism. Cancellation grants neither pin nor measurement;
  earlier accepted frozen payloads are not rewritten.
- Current item/transfer executor checks simulation.equipment while native slots
  live in the fresh equipment snapshot. The artifact host's pure blocker checks
  that actual owner before quote/commit/scene payment. Proof items remain
  OtherItem apparatus; no equipped-use policy is introduced.
- Displayed maker references use Vela. Stable IDs, six item identities, costs,
  stock counts, recipes, one publisher and finite source scope are preserved.

## Compatibility and remaining gates

These modules need no artifact save namespace or mirrored stock. Existing actor
facts/completions/attributed knowledge, optional person/owner/situation and frozen
jobs/scenes retain content. Old absence stays inert. Only the explicit once-only
meeting seeds the one seller stock set. Physical work reserves exact owned
unequipped inputs and refunds recorded means conservatively.

The integrator's current proposed expansion11/auditRemainder1 compatibility
choice owns the combined wave. Bind artifact entry to that reader/enrollment
policy if selected; never initialize it during read/render/import. This source
role has changed no shared reader. Earlier frozen work retains its payload; no
retroactive reward or measurement grant is selected.

GATE: Current worker source/syntax/import/combined definition checks and hashes
are in CHECKS.json. No build ran in this resumed source role. The integrator must
wire actual native/registry/UI/persistence consumers, produce matching rebuilt
output and update its queue/coverage/canonical state. Gameplay/unit/browser/save/
reload/import/failure/keyboard/regression/director checks remain deferred in
ACCEPTANCE_BACKLOG.md. Behavior remains implemented-unverified.

DO NOT TOUCH: Private saves/libraries, upstream attribution/LICENSE, unrelated
dirty work/worker files, additional world/source roster and prestige policy.

RETURN: This source role releases concrete source/API/native-item requirements
and current allowed evidence. Main-game integration and later playable
acceptance belong to the named integrator and later gate owners.
