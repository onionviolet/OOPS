# Original implementation candidates

All packets are PROPOSALS for later selection. No copied Qud code/assets/text, no source edits, no selected generic framework, no save-format replacement and no fixed solo-player once limits. Existing owners remain authoritative; recheck live source before any later implementation.

## P1: Make one social offer report its actual committed result

Owner route: `src/components/dialogue_component.js, src/models/dialogue_action.js, src/people_knowledge.js`. Evidence: D1 / A01.

Bounded outcome: Offer, permission, costs and learned result stay distinct; retain teacher provenance.

Later acceptance: Stale offer, denied permission, insufficient reputation/resources, failed grant, repeated choice; changed knowledge and save/reload.

Exclusions: unrelated systems, balance rewrites and whole-world simulation. If UI is touched, declare the actual surface/home, keep log and shared navigation, rebuild and inspect a fresh test origin at desktop 1366×768. Mobile optimization deferred. Any persistence change needs a compatibility decision and isolated round-trip evidence. Tests alone do not close native or human acceptance.

## P2: Validate the complete durable save envelope

Owner route: `src/save_files.js, src/save_compatibility.js and current native publisher`. Evidence: D2 / A04.

Bounded outcome: Keep metadata, world state and pending commands mutually compatible through recovery.

Later acceptance: Interrupted publication, malformed payload, unsupported version, missing cache and exact changed-positive save/reload/export/import.

Exclusions: unrelated systems, balance rewrites and whole-world simulation. If UI is touched, declare the actual surface/home, keep log and shared navigation, rebuild and inspect a fresh test origin at desktop 1366×768. Mobile optimization deferred. Any persistence change needs a compatibility decision and isolated round-trip evidence. Tests alone do not close native or human acceptance.

## P3: Resume contextual guidance safely

Owner route: `Existing onboarding/knowledge route; src/people_knowledge.js and docs/UI_RULES.md for UI routing`. Evidence: D3 / A10.

Bounded outcome: Save stable lesson/substep IDs, derive transient highlights from current location and known facts.

Later acceptance: Reload mid-lesson, missing/renamed lesson, absent target and close/reopen help; fresh rebuilt 1366×768 browser with populated save.

Exclusions: unrelated systems, balance rewrites and whole-world simulation. If UI is touched, declare the actual surface/home, keep log and shared navigation, rebuild and inspect a fresh test origin at desktop 1366×768. Mobile optimization deferred. Any persistence change needs a compatibility decision and isolated round-trip evidence. Tests alone do not close native or human acceptance.

## P4: Keep NPC observation, eligibility and action result separate

Owner route: `src/npc_lives.js and existing encounter/command consumers`. Evidence: A05 / prior re-pass.

Bounded outcome: Use one existing encounter; change ally presence or exact fitted tool to produce a useful alternate action.

Later acceptance: Observed/unobserved target, unavailable actual tool, area veto, direct alternative, exhausted methods; distinguish rejection from paid attempt.

Exclusions: unrelated systems, balance rewrites and whole-world simulation. If UI is touched, declare the actual surface/home, keep log and shared navigation, rebuild and inspect a fresh test origin at desktop 1366×768. Mobile optimization deferred. Any persistence change needs a compatibility decision and isolated round-trip evidence. Tests alone do not close native or human acceptance.

## P5: Give generated lore a stable factual source

Owner route: `Existing world/history, src/world_knowledge.js and quest owners`. Evidence: A02 / newer generated-world audit.

Bounded outcome: Journal, rumor and relic description refer to the same event identities with actor-specific discovery.

Later acceptance: Two discovered records agree on shared facts, unknown fact stays private, changed branch and save/reload retain provenance.

Exclusions: unrelated systems, balance rewrites and whole-world simulation. If UI is touched, declare the actual surface/home, keep log and shared navigation, rebuild and inspect a fresh test origin at desktop 1366×768. Mobile optimization deferred. Any persistence change needs a compatibility decision and isolated round-trip evidence. Tests alone do not close native or human acceptance.

## P6: Declare each delayed effect’s clock and inactive-zone rule

Owner route: `src/simulation_clock.js and current played-time/world scheduler owners`. Evidence: A09.

Bounded outcome: Use existing scheduling; distinguish game actions, played time, history and optional inactive-region catch-up.

Later acceptance: Pause/reload, exact due-time boundary, fast/slow actor policy, inactive region return and no duplicate settlement.

Exclusions: unrelated systems, balance rewrites and whole-world simulation. If UI is touched, declare the actual surface/home, keep log and shared navigation, rebuild and inspect a fresh test origin at desktop 1366×768. Mobile optimization deferred. Any persistence change needs a compatibility decision and isolated round-trip evidence. Tests alone do not close native or human acceptance.
