# Supersession and folded-plan groups, 2026-10-18

This ledger prevents repeated **execution-plan** review of unchanged old control records. It does not mark unread content reviewed, delete files, close source/gameplay gaps, or grant execution authority. The exact machine list is [SUPERSESSION_GROUPS.json](SUPERSESSION_GROUPS.json).

| Group | Members | Relationship | Current routing owner |
|---|---:|---|---|
| SG01 Modular plan snapshots | 5 | superseded-snapshot | [BRIEF.md](../../gm/dispatch/modular-seams-2026-10-16/BRIEF.md) |
| SG02 LOTM pre-consolidation snapshot | 1 | superseded-snapshot | [LOTM_INITIATION_IMPLEMENTATION_PLAN_2026-10-15.md](../../gm/LOTM_INITIATION_IMPLEMENTATION_PLAN_2026-10-15.md) |
| SG03 Earlier UI round control records | 21 | superseded-execution-control | [round-15-whole-plan.md](../../gm/dispatch/ui-foundation-2026-10-15/next-parts/round-15-whole-plan.md) |
| SG04 Folded body-lineage research lanes | 18 | folded-lane-control | [PLAN.md](../../gm/dispatch/body-lineage-2026-10-14/PLAN.md) |
| SG05 Folded nonhuman research lanes | 23 | folded-lane-control | [NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md](../../worlds/NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md) |
| SG06 Finished/stopped procedural research lane control | 53 | folded-lane-control | [PROCEDURAL_GENERATION_STATUS_2026-10-13.md](../../PROCEDURAL_GENERATION_STATUS_2026-10-13.md) |
| SG07 Folded research-tech T-lane control | 15 | folded-lane-control | [STATUS.md](../../gm/dispatch/research-tech-2026-10-14/STATUS.md) |
| SG08 Folded core-foundation lane control | 5 | folded-lane-control | [CORE_FOUNDATIONS_SCORECARD_2026-10-14.md](../../CORE_FOUNDATIONS_SCORECARD_2026-10-14.md) |
| SG09 Other explicitly retained historical snapshots | 48 | needs-successor-mapping | [PLAN_RULE_RECONCILIATION_2026-10-18.md](../PLAN_RULE_RECONCILIATION_2026-10-18.md) |

## How the next pass uses this

Run `python3 docs/audits/tools/plan_review_status.py` from the repository. It reports grouped unchanged control records, changed members/owners, and the remaining ungrouped indexed-only queue. It never changes a file or reads user saves.

- Matching member, routing-owner and relationship-evidence hashes allow skipping a duplicate execution-control review only.
- A changed member reopens that member; a changed owner or relationship-evidence file calls for reviewing the relationship first. It does not automatically reopen every child report.
- A selected mechanic can still require an unread unique SPEC, source finding or failed receipt inside a folded family. Grouping does not replace that evidence.
- SG09 is a routing bucket with unresolved successors, not a verified supersession claim or cached clearance. Map its successor when that topic is selected.
- New sibling files receive no group or skip status until explicitly classified. Current/reusable proposals and active reservations remain separate.

## Reopen triggers

Material newer user direction, changed member inputs, changed relevant owner contracts, a selected consumer needing an unresolved clause, or an explicit historical-evidence request. Cosmetic owner churn should be reconciled at the owner first rather than causing another full-family audit.

## More to consider

A useful next step is to select one representative reusable contract per family, then follow only its actual consumer and unmet gate. Do not equate a queue with a list of every past checkpoint. Preserve distinct source editions, partial reads and failure receipts even when a newer executable plan replaces their old control text.
