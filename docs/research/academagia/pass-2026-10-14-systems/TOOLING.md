# Tooling and reproduction

No tools installed, repos cloned, network requests, game or Windows executable launches, assembly execution, save/cache/bottle access, installation changes, native UI control, agents or Git mutations. Python standard library, rg, cat, sed, head, git status and du were used. Only this output directory and `/Users/weiwei/.codex/research/ds-academagia/` were written.

## Read-only inputs

| Input | Use |
|---|---|
| `docs/gm/dispatch/game-research-wave-2026-10-14/{COMMON,ASPECTS}.md` | Authorization, output and evidence boundary |
| PROJECT top 80, USER_VISION relevant priority and deep-reference sections | Current scope, accepted direction and private detail routing |
| All 45 prior Academagia artifacts present in the repo at capture | Reports, exact unread rows, source inventory, aspects, course/club/root tables and structured results; own prior-read-ledger gives hashes/headings/row counts |
| `~/.codex/research/academagia-decompile/extract/` | Existing six-assembly decompile, complete 112-type base/patch JSON and XML selectors; no extraction rerun |
| `~/.codex/research/academagia-2/` | Earlier private mechanical-map routing, read-only; bulk public dumps were moved to repo-excluded by coordinator |
| `~/.codex/research/academagia-aspects/extract/` | Prior source/table census and private text corpora; no recensus or UI decompile rerun |
| `docs/research/cross-game-synthesis-2026-10-14/PACKETS.md` | Exact P01-P25 identities and owner routing |
| `docs/worlds/WORLD_CORE_KIT_2026-10-14.md` and checked topic palettes | K-code mapping, broad owner versus specific topic gap |

Large prior course, club and root tables were treated as existing structured reference, not reauthored narrative coverage. Programmatic reads/hashes verify the prior artifact set; they do not newly close every old narrative gap. The new source work targets methods behind named-only systems. Prior build/installation metadata is inherited, not reverified live. A quick memory-registry search had no relevant Academagia hits; no historical memory facts were used.

## Commands and artifacts

Read existing methods with `rg -n` and bounded `sed`/`cat` under the prior extract. The actual System classes are in `GameLogic.dll/Academagia.GameSystems`; static schema is in `ContentModel.dll/ContentModel`. Use the actual filenames from `rg --files`, including CompeteSystem for merit and G/ChargeCondition for charge state.

```sh
python3 -I /Users/weiwei/.codex/research/ds-academagia/tools/probe.py
python3 -I /Users/weiwei/.codex/research/ds-academagia/tools/build_reference.py
python3 -I /Users/weiwei/.codex/research/ds-academagia/tools/finalize.py
python3 -I /Users/weiwei/.codex/research/ds-academagia/tools/verify.py
```

probe.py prints raw rows, so redirect its output to own `notes/probe.txt`, as this lane did. Never publish that file. build_reference.py reads each prior artifact and existing base/patch JSON once. It overlays modified/new IDs separately for Content and Summer, preserving the already source-traced no-deletion model. These are static source-compatible profiles, not a selected live cache; the combined two-mod profile is not reconstructed. No earlier work script is executed or modified.

Private `system-tables-{base,Content,Summer}.json.gz` retains complete rows for 23 selected authoring tables, including full descriptions. `merit-closure-*.json.gz` retains linked original gate/reward records and references, using a bounded 12-step reference walk with nonessential backreferences skipped. The original full tables remain the authority for any farther reference. `merit-summary.json` supplies the public aggregate matrix. `source-index.json` records 24 selected source files with SHA-256, exact methods and source line numbers. `prior-read-ledger.json` lists the prior artifacts, hashes and structural read signals. Full earlier dialogue and text conditions stay in the five existing aspect corpora and original data; no speaker attribution was fabricated.

FAMILY_MAP lists system/table/module/UI/dependency inventory identities, family, current and prior coverage, deep section, K codes, synthesis packets, topic owners and explicit specific-owner-gap flags. Namespace/UI coverage is partial even if a matching class received a deep section. Zero-row tables are retained and are not called absent features. UNREAD includes all named-only systems/tables, every inherited checkpoint-table row and residual limits of each selected flow. Source-compatible counts never establish reachability.

verify.py validates output presence/JSON, inventory identity sets/counts against the prior census and markdown, all fifteen sections, known K/P ranges, actual owner/source paths, selected source method identities, private gzip decoding, row counts and no raw HTML/content wrappers in public output. It saves `VERIFICATION.json`. SHA-256 ledger is own `extract/HASHES.txt`; it includes reused inputs and own outputs/scripts. No game code or executable fixture runs in that verification.

## Dead ends and corrections

An early guessed EmotionalStateCondition path under Storage was absent; `rg --files` located it under Academagia.Statistic. ChargeCondition is under GameSystems. Logical/comparator enum names are PrerequisiteLogicalType and PrerequisiteComparator. An unmatched zsh glob for a guessed Rival constraint failed; the actual path is Relationship/Character XML plus ResolveStrategyEx and OriginatorConstraintExecutor. No fetch or login occurred. The first method-index check missed qualified return types such as ContentModel.Ability; its regex was corrected to include dots, then the index and validation were regenerated.

An initial report count split said 49 UI namespaces/25 inherited gaps. Validation of parsed kinds corrected it to 50 UI namespaces/24 inherited gaps, total unchanged at 320. Family/status totals include deliberate cross-kind duplicates; they are not 320 unique gameplay features. Source inspection also narrowed charge-spend wording because an exactly exhausted temporary entry can continue the reverse decrement loop.

## Limits

No native saves or generated cache were read. Real item placement, exact-funds callers, stacked charges, context restoration, migration/corruption, UI layout and every source anomaly are unverified. Source/table hashes prove the analyzed references, not gameplay, performance, installed state or acceptance. Owner mappings are proposals; no live owner was edited.
