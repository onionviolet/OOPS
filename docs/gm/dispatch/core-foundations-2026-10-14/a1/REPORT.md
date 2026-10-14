# A1 core consolidation report, 2026-10-14

Status: COMPLETE for the requested docs-only lane. All designs remain
INFERRED proposals for root and Weibao review. Implementation, gameplay and
native acceptance are not completed by this result.

Delivered [PLAN.md](PLAN.md) and [CHECKPOINT.md](CHECKPOINT.md) in the assigned
A1 folder. No source edits, staging, commits, merges, pushes, builds, user
saves or private-pack operations by A1. SECRETS files were not opened.

## Findings and proposed route

| Code | Result |
|---|---|
| A1-F7/F8/F9/F10 SHOWN | Census includes 74 world/feature/adjacent-shared import rows in simulation.js/effects.js, imported symbols, exact command groups/prefixes/IDs/fact keys, and 21 world/feature import groups used by expansion_engine.js's outer boundary loop. simulation_resolution.js has no world import or named world ID. Fact composition invokes 40 unique named Facts providers plus Tidemark context, with meaningful order and enriched inputs. |
| A1-D2/D3 INFERRED | Inject an immutable runtime registry at application composition. Register facts, gates, boundary skips, controller allow-lists, schema steps, and the job/effect hooks needed to remove the actual coupling. Move one world at a time with full differential preview/state/boundary/reload traces. Tidemark is the first existing-world trial; it does not change canon content priority. |
| A1-F11/F12 SHOWN, A1-C1/D4 INFERRED | Engine5-11 are overloaded reader/enrollment labels, not sequential migrations. Plan maps those gates, simulation's separate schema, v0.6 kit/bio preparation, retirement, generic optional parking and exact typed suspension. Proposed single global runner preserves every currently supported valid save without enrollment, rerolls or rewritten frozen commitments, with owner sub-versions and synthetic fixture families. Writer/format switch is a separate change. |
| A1-D5/C2 INFERRED | Six ranked read APIs cover person, relationships, capabilities, requirements/body conditions, actions and battles. Preserve source-qualified provenance and writers. Relationships reuse A4; conditions distinguishes graded predicates from bodily state. Broad capability and battle store mergers are not needed to unblock worlds. |
| A1-F13/D6/D7 INFERRED except measured counts | Ratchet scopes include explicit adapter edges, named core exceptions, panel IDs, schema coupling and reverse imports. Extend A5 instead of duplicating it. Three bounded seams per main/display include dependencies and parity gates. Live lexical Math.random call count is 26, not the older report's 60; six definePanel sites in three callers remain. These counts do not prove determinism or all-panel adoption. |

W6 exists and was cross-checked with the root world-core-kit palette.
PLAN keeps K18 proof/compatibility joins, known-view safety, conservation,
generic commands before new hosts, desktop-first targets, paused runtime and
other lane ownership. It ends with More to consider and five ranked initial
changes, each bounded to one worktree.

## Verification and source drift

Initial source read: main branch `codex/gameplay-foundations`, HEAD
`11cadb30ae5dd2fe0f0e77508790b1d6dec079d6`. During documentation, a concurrent
merge changed main.js. A source-hash check detected it. The merge diff and
affected source regions were read, references refreshed, and main's new
hash recorded at HEAD `5991761632234aea99e81b38195ed6eb5b9a713b`.
The other five pinned source files retained their inspected bytes.
This is a dated live-tree read; future implementers must recover live owners
and recheck the cited code before editing.

| Check | Result / scope |
|---|---|
| Live-source reads and import ledger extraction | SHOWN source evidence, 74 import rows, all requested simulation files and both boundary layers inspected. |
| PLAN document checks | Relative links, explicit source locators, all six pinned source hashes, five ranked first changes, no unfinished placeholder or forbidden dash checked. Final counts recorded in CHECKPOINT. |
| Scoped whitespace check | A1's three new Markdown files checked as new files, without staging. |
| Game tests | **0 run**, as required for a docs lane in the shared checkout. Proposed fixtures are not passing tests. A4/A5 reports are routing evidence, not A1 test runs. |
| Build / browser / save-reload / import | **0 run**. No gameplay or persistence acceptance claimed. |

## What remains open

Root review selects the initial queue and reserves shared call sites. A4's
relationship consumer choice and A5's integrated baseline require their
owners' review. Exact non-kit panel count, fact collision inventory and
performance are UNKNOWN, with concrete measurement methods in PLAN.
Every registry move, migration switch and UI seam needs its own listed
source tests and affected acceptance evidence. A native claim additionally
needs fresh rebuilt desktop evidence; save changes need exact reload/export/
literal-file import. Human acceptance remains separate.
