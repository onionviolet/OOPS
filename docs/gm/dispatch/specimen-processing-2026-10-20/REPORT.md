# Specimen processing feature report

Date: 2026-10-20

## Implemented

Manual processing now targets the exact carcass selected from a species lot. The native transaction revalidates the specimen key, and a stale selection returns a clear error without falling through to the next specimen. Existing FIFO behavior remains available for automated and legacy callers.

The contextual panel shows age and freshness separately from strike damage and completeness. It previews whole-carcass and one-part time/output choices, explains that unselected parts are lost, and reports the specimen and age at actual completion. The core now uses the actual completion minute when a long tick crosses a job boundary. Cancelled specimens retain their identity and birth time.

Existing graded outputs and crafting recipes remain the production and consumption path. No crafting or shared UI styling files were changed.

## Evidence

- Focused harvest/UI contract checks: 19/19 passed.
- Full suite: 2333/2333 passed.
- Isolated production-config build: passed.
- Architecture check: passed.
- Rules check: passed with one existing warning for an unrelated untracked design document.
- Reserved-file whitespace check: passed.
- Fresh 1920×1080 browser origin loaded the rebuilt product configuration. A disposable imported fixture with three same-species entries showed the exact selector and distinct age, freshness, damage, and completeness descriptions.
- A separate dev-hook combat run acquired two native same-species specimens. No personal save was used.

## Acceptance still open

The full native journey has not been completed in the browser: exact selection, processing completion, and consumption in an existing recipe remain unverified in a rebuilt live game. Pending and finished state save/reload/export/literal import, laptop viewport, and 14px/21px text checks also remain. The fixture browser inspection is not a substitute for native processing or human play acceptance. Treat the feature as implemented with passing automated gates, not yet fully playable-accepted.

No commit, push, or publish was made.
