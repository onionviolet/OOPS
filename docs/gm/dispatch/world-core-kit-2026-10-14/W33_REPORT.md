# W33 report: Calendar engine shape

## CHECKPOINT

2026-10-14. Complete as a design lane. Own only this report and [W33_CALENDAR_ENGINE](../../../worlds/world-core-kit-2026-10-14/W33_CALENDAR_ENGINE.md). Both created; no gameplay implementation or runtime verification. Continue from the design's source inventory and compatibility section after refreshing HEAD, changed source and sibling returns. Concurrent writers and unrelated staged/unstaged changes were preserved. No source/build/test/save/private-pack edits, npm, builds, gameplay tests, staging, commits, checkout, merge or push.

## What was written

| Code | Result |
|---|---|
| W33.R1 | I01-I27 map calendar arithmetic, elapsed owners, formats, environment, native adapters, anchor windows, history, UI/log/duration text, wall save labels and persistence guards to live file:line. W25's full elapsed-module census remains the linked clock inventory owner. |
| W33.R2 | CC1-CC16 assessed against code: 12 partial, 4 missing (CC2, CC12, CC14, CC15), none fully met across worlds. These are source assessments, not executed tests or gameplay acceptance. |
| W33.R3 | Revisioned world-content profile, instance binding, pure projector/formatter, precision intersection, multiple calendars, recurrence identity, loop-local coordinates and W28 environment input seam. Exact simulation time does not imply an exact sourced or actor-known date. |
| W33.R4 | MoL/Paradise adoption preserves saved elapsed, native legacy date projections, exact envelope validation, deadlines and biography axes. Old saves resolve a deterministic legacy binding; persisted new source-aware bindings require the owning reader's explicit versioned migration. |
| W33.R5 | KX76 log date-line slice at 1366x768 desktop: entry/day headers, publication ordering, transient deduplication, bounded skipped-day summary and safe text. Seven future check groups and four desktop journey steps are specified, all OPEN. Per-world floors, cross-world angles and three ranked suggestions complete the design. |

## Corrections for root/owner writers

| Code | Both sides and disposition |
|---|---|
| W33.F1 | CR7 correctly identifies synthetic native dates. Its broad “no week” wording misses shared Game_Time weekdays (`src/game_time.js:90`) and moon helpers (`:109`). Those helpers do not establish sourced native calendars. Root writer can narrow CR7; W33 did not edit the root. |
| W33.F2 | MoL pilot lessons correctly warn that ordinals are not exact source dates and recurrence needs scope. Their older metadata-only window limit is no longer the whole live-code state: `src/anchor_snapshots.js:39` resolves seeded numeric windows; `:90` handles finite reset projection. This does not establish a general native loop/calendar scheduler. |
| W33.F3 | Current shared night semantics disagree: is_night/light use 20:00, while simple Day/Night starts 21:00 (`src/game_time.js:3`, `:84`, `:188`). Preserve legacy behavior in the first display slice; environmental owner chooses any versioned reconciliation. |

## Sources read and limits

COMMON first; AGENTS, PROJECT standing priorities and user preferences; kit root rounds 9-12, including DR4, CR5, SW shapes, CR7, CC1-CC16, CW-C1-C10 and KX76-KX81; audit playbook; relevant USER_VISION direction. Round 12 owner reads precede the design: ORIGINS_AND_WORLD_TIMELINES local-calendar section; INTRO_FLOW AH/SS4/MZ5/IR3; MoL pilot LESSONS K3/K6 and limits; TIMELINES_AND_DIVERGENCE TIME-P4. Applied the local more-to-consider skill. Memory registry search had no relevant hit; no historical memory fact supports this report.

Nearby read-only inputs: W25 clock/away report body and module census, W29 Paradise shape/ownership, W30 HP/D&D/MoL shapes, cards index. W31 appeared during the pass: read its clock/calendar rows and separate-novel TTKS qualification. W32 was absent at final sibling discovery. W28 assignment was read; no W28 result or local `kit/w28-world-climate` branch was present when checked. No branch-only source was treated as merged code and no other worktree was opened. W34/W35 source-calendar census results were not available in this pass; their sourced names/epochs remain dependencies for canon content, not for a legacy-compatible first slice.

Source modules and exact locators are in I01-I27. Directly read primary Game_Time/weather/native MoL/Paradise/calendar state/carrier paths, chronicle and biography arithmetic/UI, world rhythm, instance clock guards, anchor snapshots, save validation/publication, host advancement and display/log/save-label paths. Read the canon-events V2 notes to reconcile pilot limits with newer live source. No new web/canon research, raw book reading or sealed-file reading was needed for this engine design. Per-world missing-floor conclusions are bounded to inspected runtime evidence and W25/readiness pointers, not proof that an unmerged branch contains no implementation.

Inspected HEAD observed at `5f2e18fbda306dfb1f0ac43ef1d21cf38b25def3` on `codex/gameplay-foundations`; the shared tree is live and dirty. Treat locators as the read snapshot and refresh before execution.

## Checks and open gates

Documentation checks passed: CC1-CC16 each has a status row; referenced source paths and primary line numbers exist within current file ranges; relative Markdown links resolve; no em dash or spaced double-hyphen style violations. Read back the inventory/status boundary and checked owned-path Git status. `git diff --check` scoped to the design returned no output; the files are new/untracked, so separate text/link checks supply the substantive doc validation.

No gameplay test/build/browser/save/reload/import was run, as COMMON forbids these in this design lane. Calendar implementation, source-qualified content selection, W28/W27 API reconciliation, rebuilt desktop J1-J4 and old/new save acceptance remain OPEN. Human taste acceptance is separate. No user decision is required to finish this design; unresolved source anchors stay explicitly unknown rather than invented.

Ranked next proposals: W33.S1 legacy profile plus visible date header; W33.S2 one source-qualified canon-first calendar with precision and migration; W33.S3 shared climate/lens projection after actual sibling APIs are available. These are recommendations, not authorized implementation or accepted product decisions.
