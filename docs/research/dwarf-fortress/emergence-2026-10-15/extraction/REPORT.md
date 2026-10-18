# Dwarf Fortress: static rule extraction and emergence joins

Research only, 2026-10-15. This pass retains the complete shipped readable corpus and traces five connected rule paths. It adds no YAIRPG behavior and claims no played result. Public prose paraphrases; full data, Lua, numeric fields and exact source windows are retained privately.

**DF-E1:** The current Steam build is the same build as the prior dossier: `24557528`. The native Windows executable has SHA256 `205770918fd54c96cbbcf89223ebd449e2e113c7c873ed81177c4511a3450db7`, machine `0x8664`, PE32+ header and empty CLR/export directories. ILSpy cannot recover its C++ engine as managed source. This lane performed a PE-header inspection, not a native decompilation.

**DF-E2:** All 393 shipped readable files are now independently retained in this pass: 374 text and 19 Lua files, 11,784,121 bytes. Every retained file matches both the concurrent backfill's source copy and the current installed file. All source sizes and modification times stayed stable during copying. No saves, account files, configuration changes or executable launches were involved. A lexical inventory records 126,922 bracket tokens and 2,254 definition candidates in `objects/*.txt`. These are searchable candidates, not a validated engine parse.

**DF-E3:** This continuation reviewed selected windows in 16 files, totaling 1,518 distinct source lines. The other 377 files are retained unread by this lane. [SOURCE_INDEX.json](SOURCE_INDEX.json) lists each file's hash, exact reviewed windows and remaining unread ranges. Prior research and the concurrent aspects pass have their own review receipts; their work is not silently counted here.

## Where the full details live

The retained source root is [readable](/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/readable). Its original directory layout is preserved. The [capture receipt](/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/CAPTURE.json) records counts and the native boundary. The [file manifest](/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/FILE_MANIFEST.json) records source, destination, hashes, bytes and stability for every file.

Private machine-readable tables preserve [all lexical raw tokens](/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/RAW_TOKENS.json), [definition candidates](/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/DEFINITION_CANDIDATES.json), [full token blocks per definition candidate](/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/DEFINITION_BLOCKS.json), and [token counts](/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/TOKEN_COUNTS.json). Each token has its original file, line, column and complete arguments. The original files preserve prose, ordering and anything the lexical index does not understand. Lua output is not mixed into these raw-definition counts.

[Rule traces](RULE_TRACES.md) preserve the five paths, actual declarations, combinations, NPC applicability and cleanup limits. [Tooling and repeatable flow](TOOLING_AND_FLOW.md) explains how to extend the pass without conflating capture, static understanding, native consumers and gameplay.

## What further decompilation would resolve

Further native reverse engineering is relevant for exact injury equations, autonomous job selection, needs-to-action priorities, syndrome expiry and transformation rollback, material-state transitions, item reservations and cancellation, offscreen simulation and save transactions. These questions are implemented behind the raw/Lua boundary. Another raw dump cannot establish them.

A separate live backfill process, PID `28005` when inspected at 2026-10-15 11:52 local, already owned the aspect pass and had started REA/native analysis. This lane did not duplicate that import or mutate its files. Its output belongs to [the aspects directory](../../aspects-2026-10-14/), when available. Any later native finding must name an exact binary hash, address/function boundary, cross-references and interpretation limits. A native string or a nearby function is insufficient proof of an engine consumer.

No further native batch is started by this extraction lane. The useful next step is to audit the existing native result against one precise question, such as whether syndrome removal restores only owned tag contributions when multiple sources overlap. Engine behavior remains unresolved until that trace exists.

## Prior dossier relationship

| Item | Current finding | Relation to prior dossier |
| --- | --- | --- |
| Build and executable | Same build and SHA256 | Confirms the prior pin, without assuming its old private paths still exist |
| Readable corpus | Fresh retained 393 files, all match installed | Restores dependable source access for this continuation |
| Native source | Not recovered by this lane | Preserves the prior boundary |
| Bodies and materials | Joined numeric declarations and infection/healing flags | Extends the earlier selected source paths |
| Brewing | Full plant mapping, actual preserved container, seed output and alcohol syndrome fields | Extends provenance into physiology and bounded duration declarations |
| Generated interactions | Declarative timing and eligibility, with native cleanup unknown | Qualifies descriptive claims about generated powers |
| Coverage | Exact per-file selected and unread windows | Makes capture and semantic completion distinct |

Read the independent [audit](../audit/REPORT.md) for a second interpretation of selected chains and generator reachability. That audit is separately owned. A link to its intended location does not claim it was already complete when this extraction was written.
