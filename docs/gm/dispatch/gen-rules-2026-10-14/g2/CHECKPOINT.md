# G2 checkpoint

Completed 2026-10-14. Docs-only proposal audit authorized by lane G2. Sole
write area: `docs/gm/dispatch/gen-rules-2026-10-14/g2/`. Five files written:
CONFORMANCE.md, SUBTLE_BUGS.md, MORE.md, REPORT.md and this checkpoint.
No source, builds, saves, staging, commits or worktree writes. No subagents.

Read COMMON and root rules first, then live AGENTS, PROJECT top sections,
user preferences and relevant accepted direction. Evidence-gated-handoff
skill used for revision-bound findings and bounded migration gates. Accepted
direction remains in its existing owners; these are migration proposals.

## Source snapshots

- B: initial main `12179d0f87e446a7ba30f0f2c6ec0656bb85006c`, 63 literal
  Math.random references, 60 calls plus three defaults. All 63 mapped once.
- H: refreshed main `9f5c7a982f2276cd9c231aed46eb91556650bb13` after wave 1
  merged at `4e13f97f`. 27 references, 25 calls plus two defaults.
- L: closing delta `f16bd67c99b2ab3b4aed329295f6823c9ab85cc4`, 27 references.
  Added starts/anchor generators audited as C36-C37; other changed files and
  main start hook read. H citations remain pinned; later source claims need
  a fresh delta read rather than treating the moving checkout as identical.
- Read-only P1 `7b787fdd`, P2 `f8fe6994`, P3 `4e444a5e`, P4 `09403f5c`,
  P34 `6b0f1f32`. P1-P4 are now merged; P34 remains a branch reference.

Main and reference worktrees had unrelated dirty dist/index/docs at start.
Preserved them; read source with git show/grep at pinned commits. Did not
open files named SECRETS*. No rolled secret truth recorded.

## Verification and delivery

SHOWN: 37 matrix rows, each with 17 pass/fail/n.a. scores; exact 63-site
baseline inventory; 17 existing SB sections; nine new modes SB18-SB26; five
ranked fixes. 12 read-only source/algebra probes passed. Existing test source
was read, not run. The first locale candidate did not differ; a corrected
three-ASCII-ID probe did. A test-source read shell interpolation error was
corrected using Python. A style check's false positive on inline git syntax
was corrected by excluding inline code.

Final structural QA passed: 242 revision-bound source citation ranges checked
against 58 distinct revision/file pairs; ten relative links exist; all score
cells valid; baseline site set exactly equals git grep; no prose em dashes
or substitutes. Citation bounds prove resolvable lines, not runtime behavior.

A5 owns replay harness and ratchets. G2 supplies cases/gates only. G1 owns
address/pick primitives, G3 table/overlay policy, P15 pool lint, P18 story QA,
P32/P34 history retention/reader integration. Root/integrator owns the SB17
compatibility decision. Gameplay, distribution farms and browser/import
acceptance remain OPEN for subsequent source migrations.

No further G2 work remains under this packet. Coordinator can review REPORT,
then authorize bounded migrations with file ownership. Do not change live
owners or runtime as an implied consequence of this audit.
