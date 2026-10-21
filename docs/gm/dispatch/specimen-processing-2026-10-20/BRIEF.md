# Specimen choice and useful processing feature

## Request and outcome

Weibao, 2026-10-20: “send feature work while engine and ui work is working”, invoking more-to-consider. Earlier execution preference: Luna first, Sol for important work. This selects one reversible feature candidate from CRJ2 in `docs/research/proto23/DESIGN_LESSONS_FOR_OOPS_2026-10-20.md`, not every reference feature or a new global spoilage system.

Complete one playable journey: obtain multiple native supported carcasses, inspect and deliberately select an exact specimen, choose whole or one-part processing, see the real time/output tradeoff, finish processing and use its native graded output in an existing useful recipe. Cancel/resume and save/reload/export/import must preserve specimen identity, birth time, damage and genuine results. The UI must explain the chosen subject and consequences without exposing hidden truth. Freshness changes quality in the current model; damage changes completeness. Do not conflate them or silently rewrite their laws.

## Verified seam and parallel ownership

Read on 2026-10-20: `src/harvest.js` already owns stable specimen keys, birth time, damage, freshness-dependent quality, whole/damaged/scraps and processing jobs. `beginHarvest` currently takes the first species entry. `src/harvest_ui.js` previews `lot[0]` and sends only species/choice. `src/native_resources_domain.js` owns the command, transaction, tick, persistence and panel registration, so this feature need not edit main/display or invent a domain.

Reserved for this feature: `src/harvest.js`, `src/harvest_ui.js`, the harvest-specific hunks of `src/native_resources_domain.js`, `tests/harvest.test.js`, new specimen/harvest-focused tests, and this packet directory. Preserve the habitat domain in the shared resources module. Record exact reservations before edits and recheck live ownership. New presentation must use existing shared tokens and controls; no global CSS/profile/token changes.

Concurrent interaction owner: chat `01a15bd7-90cd-7c93-9b53-65bc5796206a`, `docs/gm/dispatch/upstream-interaction-system-2026-10-20/CHECKPOINT.md`, covers IS1–IS5, including crafting recipes/details, inventory/planning, gear, learning and combat. Styling owner: chat `01a15bc5-de54-7e50-b46c-7419cc27b266`, TSG1–TSG8 in `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`, covers shared style/font/glow. Do not write their reserved areas. Existing recipe consumption should be reused. If a genuine integration defect requires their file, finish the independent feature first and obtain an explicit writer release or provide a precise patch for serialized integration. Never quietly overwrite their work.

## Implementation defaults and more-to-consider round SP1–SP5

- **SP1 ACT NOW:** implement exact specimen choice within the existing species lots. Keep automated FIFO handling as the current default; manual choice is deliberate. A selected specimen disappearing must produce a clear stale-command result, never process its replacement. Revalidate at the native transaction boundary. Preserve old callers where practical without weakening exact-key manual commands.
- **SP2 ACCOUNT FOR NOW:** age is derived from original birth time and actual game clock. Selecting, previewing, cancelling, reordering or importing must not freshen a specimen. Preview is observational and draws no RNG. Keep completed receipts distinct from current forecasts; processing completion uses the actual completion context.
- **SP3 ACCOUNT FOR NOW:** preserve count/cap conservation, pending reserved capacity, auto overflow, whole-versus-part loss, writable/readiness guards, rollback and one native grant. A small timing boundary correction is in scope if a reproduced defect prevents this journey; do not start a general scheduler rewrite.
- **SP4 ACCOUNT FOR NOW:** stable keyboard focus and exact selection under arrival/cancellation/churn; readable age/condition and method cost at 1920×1080, current laptop sizes, 14px/21px and reduced motion. Show known evidence, not raw hidden specimen truth. Reuse current UI language and visual defaults. Mobile optimization remains deferred.
- **SP5 LATER, not dispatched:** general food spoilage, carcass trading/storage transfer, preservation chemistry, new species/body simulation, NPC delivery economy and generated maps. Trigger a separate proposal when a real selected consumer needs them. This feature's effort is medium: a bounded native command/domain/panel change plus persistence and browser proof. Its done check is the complete journey above, not a standalone picker demo.

## Execution route and authority

Start at AGENTS.md, `docs/RULES_INDEX.md`, PROJECT.md, relevant USER_VISION direction and sources. Apply AR1–AR16, MR1–MR36, UR1–UR58, AD6–AD8/15–17/22/32–38/40 and relevant GR contracts. Read `.claude/rules/runtime-code.md`, `.claude/rules/making-systems.md`, `.claude/rules/player-ui.md`, shared-worktree practice and research/agent rules before delegation. No new world/major priority change is selected. Preserve sealed secrets and personal saves.

Use this new chat on gpt-6-luna, medium, for bounded source mapping, fixture work and settled implementation. Use one fresh, bounded gpt-6.1-sol worker at medium for exact identity/transaction/lifecycle integration and substantive final review, with explicit single-writer transfer for any files it edits. Avoid multiple overlapping writers or an open-ended agent chain. If Sol is unavailable, finish safe independent work and identify the specific unresolved coupled question; do not claim it reviewed. Do not stop at crafting a plan, or stop merely because the independent source lane is finished.

## Acceptance and evidence

Before implementation choose existing focused checks and failure cases. At minimum prove: exact chosen specimen among two same-species entries; selection disappearance between preview/commit; no age reset on cancel/reload; no duplicate grants/lost capacity; age versus damage have their distinct actual consequences; unchanged automation behavior; observer-safe preview with unchanged RNG. Reuse meaningful existing tests, avoid assertions mirroring implementation.

Run focused checks while editing, then required `npm run build`, `npm test`, `npm run check:arch`, `npm run check:rules`; use `check:rule-behavior` if rule changes actually occur. Rebuild and verify on a fresh test origin at 1920×1080, plus relevant current laptop/large-text checks. Complete the native acquisition → deliberate choice → processing → useful existing recipe/output journey. Save, reload, export and literal import the pending and finished feature state. Controlled matched fixtures may establish age/damage comparisons, but label them and do not substitute them for the native journey. Never use personal save data.

Record CHECKPOINT.md with current writer, exact paths, inputs/check results, browser evidence and remaining gates. Finish REPORT.md with implemented changes and limits. Distinguish source, tests, rebuilt/browser, persistence and human play acceptance. No commits, pushes, publish or unrelated cleanup are authorized. Do not discard any dirty or concurrent work.
