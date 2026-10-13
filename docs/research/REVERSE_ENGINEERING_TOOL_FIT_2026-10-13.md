# Reverse-engineering tool fit

2026-10-13. Recommendation only, not an accepted tool dependency or execution assignment. Interprets “redecompileazation” as further decompilation/reverse engineering of reference games.

## Recommendation

**D1: Keep the existing source/export routes as the default.** A new tool is useful when it answers an unresolved mechanic question, repairs a specific recovery defect or reduces repeated navigation effort. Repeating every export because another repository exists has no demonstrated benefit.

**D2: Park REA for a bounded native-analysis trial.** Its strongest plausible contribution here is convenient agent access to callers, references, pseudocode and assembly. Use an unresolved function chain and compare evidence, elapsed time, resource use and agent effort against the existing route. Adoption requires a useful answer or measurable workflow improvement; this inspection did not execute that trial.

**D3: Adapt relevant guide practices without installing a whole modding stack.** Existing research already used universal-modder and AI game-modding guides selectively. Source repos remain valuable for mechanic research even when no decompilation is needed.

## Existing routes and remaining gaps

| Target | Evidence inspected | Disposition |
| --- | --- | --- |
| Open-source games and readable JS/data | [Repository bank](repository-bank/README.md) retains 30 pinned partial mirrors, with acquisition separate from semantic review | Read relevant source/data directly; no blanket decompilation step |
| Managed .NET games | [Qud report](caves-of-qud/REPORT.md) records an ILSpy main-assembly export, with only selected paths reviewed | Reuse export for unread mechanics; regenerate only for a changed build or named export defect |
| Unity IL2CPP | [Your Chronicle report](your-chronicle/REPORT.md) distinguishes Cpp2IL identities/ISIL, native instructions and readable assets | Keep specialized recovery; REA's general native interface is not demonstrated as a replacement for IL2CPP metadata recovery |
| Native C++ | [Factorio checkpoint](factorio/native/CHECKPOINT.md) records both closed architecture streams, explicit no-repeat guidance and outstanding narrow repairs/reconciliation | Preserve canonical repaired evidence; pursue selected gaps rather than another whole export |

These are findings from owner documents read today. Private corpora, process state, hashes and historical runtime receipts were not independently reverified in this assessment. Complete export attempts do not establish full semantic understanding.

## REA mechanism and integration cost

Inspected upstream [morluto/rea](https://github.com/morluto/rea) at Git tree revision `bb540826d65316c164d2de8ba4ef10f81a8ad073`. An initially inspected `illumi-ai/REA` result was a fork; upstream is the basis for this recommendation.

The upstream README documents CLI/MCP access across native, managed and JS targets, with native analysis using an existing Ghidra, Hopper or IDA provider. This is an agent interface and investigation workflow, not evidence of a new decompilation algorithm.

The [Ghidra provider contract](https://github.com/morluto/rea/blob/bb540826d65316c164d2de8ba4ef10f81a8ad073/docs/ghidra-provider.md) describes an ephemeral database. The inspected [launcher source](https://github.com/morluto/rea/blob/bb540826d65316c164d2de8ba4ef10f81a8ad073/src/ghidra/GhidraLauncher.ts) constructs `-import`, `-readOnly` and `-deleteProject` arguments. Consequently, its ordinary import route should not be assumed to reopen our saved Factorio project with existing repairs. Seed/settings support does not demonstrate faithful transfer of this project's custom lowering, ABI and flow repairs. A trial must qualify those inputs or clearly label its results as a separate comparison.

The [managed-code documentation](https://github.com/morluto/rea/blob/bb540826d65316c164d2de8ba4ef10f81a8ad073/docs/managed-code-analysis.md) separates metadata/CIL evidence from imported decompiler reconstruction. That gives no reason to replace already useful ILSpy C# exports wholesale.

For other repos, reuse [universal-modder's reverse-engineering guide](https://github.com/rehan-remade/universal-modder/blob/main/skills/reverse-engineering/SKILL.md) for target selection and narrow source tracing. The existing [method receipt](game-discovery-2026-10-06/METHOD_AND_REUSE.md) records prior guide reuse and conditional tool selection. Game-install modification, generated assets and unrelated compatibility tooling do not address the named analysis gap.

## Checks and open gate

Read project direction, dirty-worktree inventory, existing research owners, upstream documentation and selected REA launcher/startup source. No tools installed, reference games launched, corpora regenerated, saves inspected or gameplay files changed. Before adopting REA, one bounded comparison must show value and preserve exact build/architecture/tool-setting provenance. No performance or recovery-quality improvement is claimed yet.
