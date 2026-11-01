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
| SG09 Other explicitly retained historical snapshots | 48 | reviewed-historical-control | [PLAN_RULE_RECONCILIATION_2026-10-18.md](../PLAN_RULE_RECONCILIATION_2026-10-18.md) |

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


## SG09 navigation reconciliation, 2026-11-01

The [48-row successor-navigation supplement](../../audits/reconciliation-tooling-2026-10-31/sg09-successor-navigation-2026-11-01.json) maps each original SG09 locator once to one of 15 retained checkpoint owners, with current member/owner hashes. Member and checkpoint openings were inspected for navigation. These checkpoint files retain later disposition within each historical family; their dated writer/process/allowance statements grant no current lease or resumption authority.

This closes the missing individual navigation pointers, not the unique-content or supersession qualification. The original catalog and its hashes remain unchanged: `plan_review_status.py` still reports SG09 as needing successor mapping because it has no certified skip relationship. Use the supplement to find the retained checkpoint, then inspect the actual relevant successor receipt and unmet gate before skipping semantic work. Historical failed checks, partial source reads and distinct consumers remain retained. No member was removed, no skip flag was promoted, and no checkpoint was rewritten.

The [November 1 routing snapshot](../../audits/reconciliation-tooling-2026-10-31/routing-2026-11-01.json) rechecks all nine registered groups. Changed owner/evidence relationships and four changed members remain explicit. Its 519 ungrouped indexed-only paths belong to the frozen 778-record inventory; they are neither 519 live tasks nor a current all-repository census. Later files do not inherit coverage. See [the owning review, round 4](../PLAN_RULE_RECONCILIATION_2026-10-18.md#round-4-historical-control-semantics-2026-11-01) for the later control dispositions.


## Historical control review, 2026-11-01

The [owning review, round 4](../PLAN_RULE_RECONCILIATION_2026-10-18.md#round-4-historical-control-semantics-2026-11-01) now dispositions the selected state/ownership/next-step clauses of all 48 SG09 records through H01–H15. The prior navigation-only section above is historical at its declared scope; it has been superseded for execution-control routing by [ROUND4_REVIEW](ROUND4_REVIEW.json). Distinct incomplete objectives, original proposals, source/edition bounds, failed checks and behavioral gaps remain explicit. No source-content or gameplay coverage was promoted.

SG01/SG02/SG03/SG05 changed relationships and SG06/SG07's four changed members were reviewed at the scopes recorded in that receipt. SG04/SG08 reuse unchanged inputs. Original catalog/hash/text values are retained in [ROUND4_HISTORY](ROUND4_HISTORY.json); current catalog fingerprints identify this review rather than relabel an old test current.

For multi-successor families, optional catalog `relationship_inputs` pin the inspected successor/supplier files. Changed inputs return `dependency_changed_review_relationship`; missing inputs fail checking. This guards SG09's control-level reuse across its multiple owners. Matching bytes permit skipping a duplicate execution-control pass, while a selected unique source clause or unresolved consumer still requires its own review. The frozen inventory's section-reviewed counts and 519 ungrouped paths retain their earlier limits. L2b and whole-LOTM qualification are excluded from this pass.
