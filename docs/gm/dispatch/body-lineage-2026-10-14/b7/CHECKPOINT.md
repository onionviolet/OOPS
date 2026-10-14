# B7 checkpoint: NPC body detail levels

Docs-only lane, 2026-10-14. Writer: B7 in the main checkout on
`codex/gameplay-foundations`. Write boundary: this `b7/` folder only.
Other workers and existing dirty state are preserved. No build, npm, staging,
commit, source edits or user-save access.

1. COMPLETE: Read live direction, full genetics palette, life-sim body sections,
   prior integration and dispatch rules. Reconcile G48 scope with B2.
2. COMPLETE: Audit NPC lives, observer knowledge, biography, read-only P4 generated
   people, P19 social web and relationship prerequisites with file:line evidence.
3. COMPLETE: Write LEVELS.md, TRIGGERS.md and CONSISTENCY.md, including parent
   commitments, knowledge boundaries and existing-record migration.
4. COMPLETE: Write BUDGET.md with explicit assumptions and reproducible size
   estimates for 100, 1,000 and 10,000 NPCs.
5. COMPLETE: Refresh B2, check links, scope and evidence, then finish REPORT.md
   with ranked recommendations and unverified implementation gates.

Authority: [COMMON](../COMMON.md), [lane prompt](../B7.md),
[plan](../PLAN.md), [genetics owner](../../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md).
This lane specifies a proposal for G48; it does not implement gameplay or
change accepted priorities. UI implementation and mobile optimization are out
of scope. Any later UI proof targets desktop 1366x768.

Read B2 SPEC/AUDIT as they appeared, then refreshed MIGRATION. B2's native
record is a schema proposal, not an NPC generator. B7 uses its physical/person
paths but requires a sparse NPC validator and inheritance extension. Existing
32-person household and exactly-three P4 bounds are preserved. Live User Vision
also preserves both-body-age 18+ and adult-appearance requirements; a coarse
adult stage or spouse label does not supply eligibility proof.

Drafted demand bundles, transactional triggers, qualified identities, complete
GN1-GN12/BD1-BD9 dependency tables, conception/creation capsules, observer claim
boundaries and migration by existing owner. Ran planning arithmetic in Python;
this verifies sums only, not serialization or runtime capacity. The 10,000-NPC
proportional-detail case exceeds the current 4 MiB UTF-16 shared-origin guard.

All five requested files are drafted. Added explicit lineage-byte sensitivity:
lazy phenotype does not remove parent-snapshot costs. Refreshed B2's completed
REPORT and MIGRATION; its native schema1 is still not the NPC/active-GN schema.
Initial structural check found a shortened P4 path in BUDGET; corrected it to
the full worktree locator before rerunning checks.

Final result: six lane Markdown files, including all five requested outputs.
Structural QA passes: 20 local links/anchors, 28 full source/document locator
paths/ranges, 13 consistent-width tables, all 12 GN and 9 BD dependencies,
required filenames, whitespace and prohibited dash forms. Re-executed the
embedded BUDGET arithmetic; all four population cases match the tables.
`git diff --check` scoped to this lane is clean;
the lane is new/untracked, so the explicit file scanner supplies content QA.
Reviewed final B2 SPEC/MIGRATION/REPORT and relevant TEST_PLAN cases read-only.

No runtime tests, build, browser, serialized fixture, migration, storage write,
user-save access, stage or commit. REPORT's O1-O3 remain OPEN for later selected
implementation; this docs-only lane is complete. Root owns integration into
genetics/IDEA_INDEX and exact future persistence/schema selection.
