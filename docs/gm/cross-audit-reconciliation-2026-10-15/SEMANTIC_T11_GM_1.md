# T11 GM 1 semantic reconciliation

This pass reconciles 21 registered inventories against their named owners and consumers. The [private receipt](private/SEMANTIC_T11_GM_1.json) now contains 1,056 per-ID or owner-level findings, with exact source pins and JSON pointers. It includes all 551 individually read runs-and-endings rows from [CURRENT_ROW_INVENTORY.json](../dispatch/runs-and-endings-2026-10-14/r9/CURRENT_ROW_INVENTORY.json), all 15 coded society-branching rows from [COVERAGE.json](../world-implementation/second-pass/society/branching/COVERAGE.json), and the previously reviewed U5, G5, ER18, T1, TA2, Factorio, MW-03, feature-refinement, and Frontier material.

## Material joins

- World-1 `COVERAGE.json` contains 3,575 ID/family/section/status routing stubs: 3,000 inventoried-qualification-open, 414 inherited-proof-review-open, 104 local-policy-review-open, 37 source-correction/runtime-review-open, 16 required-open, 3 partial-connected-variant, and 1 source-gap-open. These stubs are indexed as a schema/status catalog only. The underlying claim text and proof payloads are unresolved; no per-ID semantic review or source-to-owner join is claimed. See the [World-1 live owner](../dispatch/world1-full-completion-2026-10-11/UNIT_DELIVERY.json).
- The runs-and-endings rows are individually interpreted, not implementation receipts. Concrete existing seams are credited only where the row names a source owner. All proposed behavior remains subject to current priorities and an actual consumer join; the [dispatch report](../dispatch/runs-and-endings-2026-10-14/r9/REPORT.md) is analysis, not authority.
- The 15 society rows distinguish bounded existing mechanisms from unverified integration and optional proposals. Relevant owners include [Frontier campaign](../../worlds/original-frontier/CAMPAIGN.md), [world completion](../../worlds/original-frontier/WORLD_COMPLETION.md), [dialogue owner](../../worlds/DIALOGUE_AND_INTERACTIONS.md), and the named source modules in the receipt. No row establishes gameplay acceptance.
- The Factorio coverage and DLC snapshots are historical source/API inventories. Their claims exclude native implementation and runtime observation. Duplicate parent-routing snapshots are not independent proof.
- U5 placements, G5 cheat hooks/costs, and the other reviewed planning inventories remain subordinate to USER_VISION, PROJECT, UI_RULES, and their current feature owners. The 57-entry save manifest is only a filename/hash index; save contents were not opened.

## Remaining boundary

No current gameplay, persistence, visual, source-library, or human-acceptance claim was established. World-1's underlying claim/proof joins remain open, and named owners still govern whether any proposed behavior enters an authorized slice.
