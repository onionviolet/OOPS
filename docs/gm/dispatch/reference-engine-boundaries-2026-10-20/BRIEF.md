# Reference engine boundaries execution, 2026-10-20

## Authorization and outcome

Weibao: “send engine level work while the ui work is working.” Implement a complete engine-side light/resource/time continuity slice alongside the ongoing UI and connected-interaction work. This selects the bounded PFE09/PFE11/PFE17/PFE23 interaction from the existing reference palette; it does not assert that current code is defective or authorize the whole palette. The result should make the actual light, remaining fuel, reading progress, expiry and persistence agree across ordinary elapsed time and supported compressed advances. Trace first, reproduce a consequential gap, implement it through current owners, and show the native result. Already-correct cases need evidence, not replacement implementations.

Start with AGENTS.md, docs/RULES_INDEX.md, PROJECT.md and relevant docs/USER_VISION.md direction. Apply AR1–AR16; AD3/6–9/15–17/32/34/36/38/40, relevant SLR and sealed-secrets rules. Runtime seam: .claude/rules/runtime-code.md and docs/ARCHITECTURE_RULES.md. The native clock and domain registry remain authorities; use mechanism-local boundaries, not a new global clock, scheduler or event bus.

## Current owners and inputs

- docs/research/proto23/ENGINE_AND_UI_DETAIL_CONNECTIONS_2026-10-20.md: PFE09, PFE11, PFE17, PFE23, PFB5. PFE23 explicitly proposes an equivalence check, not a proven bug.
- docs/ENGINE_EXPANSION.md: Reference detail fold. docs/GRANULAR_SYSTEMS_AND_INTERACTIONS.md and docs/MEANS_AND_APPRAISAL.md supply mechanism/observer constraints.
- docs/gm/dispatch/modular-seams-2026-10-16/CHECKPOINT.md: current M4 lamplight implementation and proof limits. The old ENGINE_GM_NEXT_CHECKPOINT.md is historical.
- src/lamplight_domain.js currently owns actual lamp/oil and native registered light; src/reveal_chain.js owns reading light factor. src/items.js includes native reading consumers. src/domain_registry.js dispatches native minutes. Read the actual native callers and existing tests before selecting an edit.
- INPUT_STATE.json records the dispatch-time dirty checkout, HEAD and relevant hashes. Recheck live files and reservations; do not reset or overwrite concurrent edits.

## Complete selected work

E1. Trace actual elapsed-time entry points and reader ordering. Compare supported long advances with equivalent boundary-aligned advances, including a lamp expiring mid-reading, expiry exactly at completion, ambient light, and another sufficient light source. Keep baseline day/night effects explicit. Do not assume one tick ordering works for every reader or change all clocks for a local interaction.

E2. Fix reproduced mismatches through existing domain/reader seams. Account for actual fuel, held-item loss, a stale light command after state changes, chosen-routine pause/stop behavior and exactly-once settlement. Preserve costs, normal reading behavior and current learned information. No fuel or progress invention; redraws/inspection must not advance time, spend inventory or consume gameplay RNG.

E3. Verify current-format Save/reload/Export/literal Import across both pending fuel and post-expiry states; restored progress and settled results agree. Old-save compatibility remains deferred under the accepted Oct17 direction. Keep sealed reveal names/truth and literal secret outcomes out of chat/public reports; use route IDs/status and private proof as appropriate.

E4. Deliver an independently runnable rebuilt native journey showing the ordinary lamp/reading effect and expiry, plus focused regressions for any changed behavior. Use a disposable fresh test origin at 1920×1080 for player-facing behavior claims. Seeded/harness-controlled setup and natural acquisition must be labeled separately. Human acceptance remains separate.

## Writer split and exclusions

Primary engine lane: src/lamplight_domain.js, src/reveal_chain.js, their focused tests/headless journey and any narrowly necessary new domain-local helper. No current ownership conflict was found in those files at dispatch. Inspect src/items.js reading consumers; before editing a shared file confirm it is unreserved, preserve dirty hunks and record exact scoped ownership. Do not write a source file concurrently with another owner.

UI chat 01a15bc5-de54-7e50-b46c-7419cc27b266 owns typography/MS Gothic, shared tokens/profiles, component styles/glow, Appearance, meter/log work and UI evidence. Do not edit its UI/style files or reference/font assets.

Connected-system chat 01a15bd7-90cd-7c93-9b53-65bc5796206a owns its CHECKPOINT and current runtime paths: src/display.js, src/main.js, src/crafting_detail.js, src/crafting_recipes.js, src/crafting_visibility.js, src/components/levelable_component.js, src/gameplay_publication.js, src/ui/combat_display.js, src/combat_focus.js, src/combat_opponents_domain.js, src/opponent_board.js, src/village_workspace.js, and new equipment_comparison/recent_learning/recipe_connections/material_choice_view/combat_subject modules plus their tests. Read its checkpoint fresh before edits. Leave those files untouched while reserved. If a necessary small integration belongs there, prepare a precise patch proposal while completing disjoint work, then inspect a recorded release before applying. Do not silently duplicate its learning/crafting/combat systems.

No broad physics/climbing/creature/home simulation, crafting/gear overhaul, new general reservation store, global clock rewrite, NPC-heavy work, generated layouts, mobile work, personal saves, external source acquisition, commit/push/publish, or font distribution. Full reference palette remains routed in existing owners for later selection. No additional agents or messages to other chats are required; this coordinating chat handles dispatch notices.

## Verification and continuity

Keep CHECKPOINT.md here with selected scope, exact owned paths, observed defect versus preserved support, dirty input identities and focused failure scenarios before edits. Follow AD36: focused meaningful checks while editing, then npm run build, npm test, npm run check:arch, npm run check:rules; rule-behavior only when applicable rule changes require it. Build the disposable copy, not the dirty shared generated bundle/index. Record exact copied input identity and separate source, tests, native browser, persistence and human acceptance. Reuse unchanged passing evidence without duplicating suites. Save source evidence/private secret-bearing fixtures under the project's existing ignored private research/evidence route; keep public checkpoint spoiler-safe.

Continue through implementation and verification of this selected outcome, not just another plan or a generic audit. If every selected behavior already passes, document actual checks and the absence of a justified change instead of inventing a feature. Record remaining acceptance gaps candidly. Preserve existing docs through hunk edits and zero-loss checks when touching shared direction files; avoid unrelated document changes.
