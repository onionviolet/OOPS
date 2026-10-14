# Academagia decompile checkpoint

Status: PARTIAL

Lane: academagia-decompile. Date: 2026-10-14. Governing rules: `docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md`. Only this output directory is writable in the repo. No launch, save access, cache generation, install edit, Git staging/commit/push or YAIRPG source edit occurred.

## Done

- Payload gate passed: executable and six managed assemblies present; StateFlags 4; build 2453605; depot 533481 manifest 6671209053462036643; download/stage complete.
- Six assemblies decompiled successfully. Normal/helper roll distinction, strict comparison, research substitution, rerolls, Glory, exam random sum, illness, grading bands/curve/hybrids/PNP and exact course weights read.
- All base and four patch binary streams decoded passively to EOF. Base header 7,189,608 bytes, base data 68,154,787 bytes. All 1,192 gain records linked to 17 courses; variance 3; 360 calendar records. Exact course tables and subskill allocations saved in CLASS_TABLES.md.
- Story graph, continuation windows, OR roll alternatives, group-skill route, random event daily gate/uniform selector, relationship defaults, recruitment cost, infighting camps, favors, stress and concealment audited.
- Prior F1–F20 reconciled in REPORT.md; web files untouched. Eight ranked proposals, eight packets, 24 small touches, tooling and four system digests saved.
- Original payload SHA-256 ledger: work `extract/HASHES.txt`. Local extraction/script ledger: `extract/EXTRACT_HASHES.txt`. Work disk usage: **960 MiB** (`du -sh` displays 960M).

## Unread / unverified table

| Gap | Why / exact revisit surface |
|---|---|
| Runtime-selected patch and actual merge/cache behavior | No game/cache was run or user saves opened. `CustomSerializer.GetDeletedObjects` casts to string[] despite shipped List<Guid>. Both count interpretations retained. Runtime investigation needs a separately authorized isolated execution lane; do not launch under this checkpoint. |
| Wiki 258-page mapping and all reachable adventure branches | Thousands of nodes decoded, but not every prerequisite, actor selection and narrative branch read. Start with root-to-continuance graph and a wiki page-ID mapping; presence is not reachability. |
| Every club entrance, membership, reward and exit path | Clubs are authored graphs, no Club table. Bookworms root comparator/value and references read; full selection-path semantics and downstream gates unread. See merged JSON and SelectionItem resolver. |
| Every per-college merit ladder and special relationship cap | Threshold value range and default pair bounds read; full reward selection and any +12 authored effect unread. Read Merit prerequisites and ReferenceTable paths. |
| Exact vendetta entry rules | Clique/social formulas read, Rival/RivalsObserver surveyed, but duel entry effects and personality AI tables not fully traced. |
| Full spell/pheme/duel math and creation/familiar UI | Schema/counts and story skill contribution read; all component difficulty, bond bonuses and creation-point UI paths not audited. UI.dll only type-listed. Half-Bond statement not adopted. |
| All unrelated engine/content types | 112 types decoded, six assemblies extracted; AI, economy, combat, research, mod editor and third-party dependency implementations outside the four core questions were not fully read. |
| Public runnable BCS editor package | Primary forum patch context found; editor not acquired. Not needed for the binary/formula answers. |
| Gameplay and YAIRPG acceptance | Source/data audit only. No gameplay, rebuilt browser, persistence or director acceptance proof. Proposals remain unaccepted. |

## Next pending item

If the coordinator continues source research, first trace Club SelectionItem paths and map root story IDs to the wiki page catalogue. Preserve the cache discrepancy and exact source build. For a future implementation decision use IMPLEMENTATION_PACKETS.md and live owners; do not treat this report as authorization. All raw artifacts remain under `/Users/weiwei/.codex/research/academagia-decompile/`.
