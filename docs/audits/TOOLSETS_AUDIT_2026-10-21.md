# Toolsets audit, 2026-10-21

Later same-day execution: Weibao authorized the registry, wrappers and discovery
reconciliation. The [live tool registry](../TOOL_REGISTRY.md) and
[implementation receipt](toolsets_2026-10-21/IMPLEMENTATION.md) now own those
results, including the Cpp2IL launch failure discovered during implementation.
The findings below preserve the earlier audit snapshot.

Requested scope: audit the tools available for Discord research, REA, reverse engineering and related work. This is a local capability and readiness audit, not an upstream release survey or authorization to install, register, collect or implement anything.

**Finding:** the existing stack covers most research and verification needs. Its main weaknesses are fragmented entry points, version/environment drift and incomplete end-to-end acceptance. Adding another general tool would address less than making the existing routes reliably discoverable.

Applied direction: AD32 (audit findings are proposals), AD35 (saved-source reuse), AD36 (bounded relevant checks), AD37/AU1–AU15 (no bulk readers), research/source rules and sealed-secret boundaries. Read PROJECT.md's current priorities and the rules router. This pass does not select gameplay work or change accepted direction. Substantial concurrent edits were present; this pass owns only this report and `toolsets_2026-10-21/`.

## Evidence levels

| Level | Meaning here |
|---|---|
| Checked now | A named command, import, integrity check or file inspection completed in this audit. Help/version success proves entry-point viability, not target recovery. |
| Recorded | A local owner records prior execution. That execution was not repeated here. |
| Present | Files, source, packages or tool declarations exist; successful use is unverified here. |
| Conditional | Requires a source, session, provider, credential, platform or build that is not established for the intended operation. |

Evidence: [local inventory and input hashes](toolsets_2026-10-21/LOCAL_INVENTORY.json), [session tool declarations](toolsets_2026-10-21/SESSION_TOOLS.json), [bounded inventory helper](toolsets_2026-10-21/inventory.py). The session declaration snapshot excludes the separately declared CUA, collaboration and sleep APIs; those were inspected from this chat's tool contract. No account credentials or conversation bodies are saved in these audit artifacts.

## Findings

**F1. Discord has a useful evidence pipeline, with collection as its weakest proven link.** The offline workbench passes 26 tests now. A sampled catalog verifies 329 saved byte objects with no integrity errors, but reports 26 import issues. That catalog lists 327 attachment IDs, has saved bytes for 290, and distinguishes 298 derivative records from two original-download records. Thirty attachments have GIF-like names, while ten have measured animation. These are different coverage dimensions. The catalog is a dated snapshot, not the current recovery lane's final result; its 37 IDs without saved bytes must not replace the separately scoped 26-item Corc recovery list.

**F2. REA is usable through an explicit cached route, but is not integrated into this session.** The retained 6.4.0 CLI runs. Its default doctor exits 1 because global provider configuration, registrations and skill identity are absent. With explicit Ghidra/JDK paths, the Ghidra-only doctor exits 0 and reports `healthy:true`; broader `environment_healthy:false` remains because optional/global integrations are absent. Ghidra 12.1.4 and JDK 21.0.12.1 are recognized. This is readiness evidence, not a fresh decompilation. No REA MCP tool is exposed in this chat.

**F3. There are two different REA states.** `/Users/weiwei/code/rea` is a 6.5.0 source checkout at `d9cd239c5ed7b078ac07e1bad633723fb49d8f80`, without `node_modules` or `dist`. The runnable 6.4.0 copy lives under the Hogwarts research cache and is not a Git checkout. Its launcher still contains the local `-noanalysis -max-cpu 2` patch. Earlier reports saying REA was never installed or trialled are superseded as current availability evidence by the later [Hogwarts trial](../research/hogwarts-legacy/REA_TRIAL.md) and [Warsim tooling record](../research/warsim/pass-2026-10-14-systems/TOOLING.md). Those dated reports remain valid history.

**F4. Specialized extraction tools remain necessary.** ILSpy, UnityPy and IL2CPP recovery answer different questions from native decompilation. .NET 10.0.402, ILSpy 11.1.0.9782 and UnityPy 1.25.4 ran here through their explicit paths. Several tools are absent from PATH despite existing in isolated environments. REA's local guides explicitly distinguish PE/CLI metadata from IL2CPP, NativeAOT and single-file hosts. A generic native pass cannot replace a working asset/metadata decoder or preserve repaired analysis state merely by importing the same binary.

**F5. Verification tooling is broader than the headline test command.** The project has a full-game Node runner, Chrome routes, replay, simulation fuzzing, performance checks and a test queue. `npm test` selects `tests/*.test.js`; nested headless/simfuzz/replay suites are outside that glob. The headless DOM has no browser layout and documents a 1366x768 visibility model, while current UI direction and Chrome playtest target are 1920x1080. Headless success cannot establish current visual acceptance.

## Capability inventory

This is a bounded inventory of the locally documented research stack and this session's exposed capabilities. It is not an exhaustive audit of every application, skill or repository on the Mac.

| ID | Toolset and route | Useful for | Current status and boundary |
|---|---|---|---|
| T1 | `/Users/weiwei/code/discord-reference-workbench`, `python3 -m discord_reference` | Import Discrub/DCE JSON, immutable scoped snapshots, attachment identity, variants, context, annotations, search, gallery, hash verification | Checked now: CLI, 26 tests, one 329-object catalog. Offline Python layer does not authenticate or call Discord. |
| T2 | Workbench's private Discrub adaptation, `npm --prefix desktop run web` or packaged `Reference Collector Local.app` | Extension-free web/desktop collection and original-file relay, feeding T1 | Production web entry and Apple silicon app exist. Owner records build/smoke proof. Manual sign-in and one real bounded export remain unverified in that owner. No app or server launched here. |
| T3 | Installed Discrub route, DiscordChatExporter import adapter, signed-in browser gap capture | Scoped collection and media/context recovery | Browser collection has historical receipts; installed extension revision and a runnable DCE installation were not verified here. Synthetic adapter tests do not prove a live exporter run. |
| T4 | Pinned REA 6.4.0, `node scripts/rea.mjs` from cached checkout | Native function/xref/byte queries and batched sessions; static JS/Electron and managed metadata workflows | CLI and explicitly configured Ghidra readiness checked now. Native query execution is recorded in earlier dossiers, not repeated. Not registered/exposed as a live MCP here. |
| T5 | REA 6.5.0 source at `/Users/weiwei/code/rea` | Inspect newer implementation/docs and compare a future upgrade | Present source only. Its broad Apple, Android, firmware, web/network, WASM and other command families do not establish installed providers or demonstrated outcomes on this Mac. |
| T6 | Ghidra 12.1.4 + Homebrew JDK21; `strings`, `otool`, `objdump` | Native instruction evidence, exact bytes, xrefs, custom scripts and retained analysis projects | Ghidra readiness checked through REA; system utilities found. Existing repaired projects/exports retain their own authority. Fresh REA imports do not prove equivalent custom state. |
| T7 | `/Users/weiwei/.dotnet/dotnet`, `.dotnet/tools/ilspycmd` | Managed C#/.NET assemblies, Mono game code, method/consumer tracing | Versions checked now. Not on PATH. Use `DOTNET_ROOT=/Users/weiwei/.dotnet` for the ILSpy launcher. No new proprietary assembly processed. |
| T8 | UnityPy isolated environments, cached Cpp2IL and Il2CppDumper | Serialized Unity assets, metadata/native method mapping and IL2CPP recovery | UnityPy import checked now in Immortal Life's environment. Cpp2IL and Dumper executables exist in named research lanes; not launched. Declaration/stub recovery is not executable method-body recovery. |
| T9 | Saved game exports, readable data, open-source clones, game-specific scripts | Cheapest route to tables, dialogue, conditions and already recovered functions | Research root currently exists with many retained lanes. Earlier missing-root observations must not be generalized to today. Exact deep-file completeness, repaired Factorio corpus and all dossier locators were not audited. |
| T10 | `/Users/weiwei/code/lncrawl-polite` and existing project bridges | Controlled Fanqie intake; reusable transport for selected supported public pages | Isolated CLI help checked now. Generic upstream adapters are separate from polite mode. Existing receipts, refusal state and matching-font requirements matter. No network acquisition attempted. |
| T11 | `/Users/weiwei/code/zlibrary-research` 0.3.0 | Edition discovery/acquisition; local EPUB preparation, search, chapter reads, library lookup and edition comparison | Isolated environment present; current profile documents ten MCP tools although top-level README still says six. Profile records prior anonymous remote search, not a current live session. Not exposed in this chat. |
| T12 | Calibre app CLI, EPUB helpers, `pdf2md`, `pdftotext`, Tesseract, FFmpeg | Local library discovery; spine-ordered EPUB text; PDF extraction/OCR; media/frame processing | Calibre executable and EPUB helpers present; PDF/OCR/media utilities on PATH. `pdf2md --help` runs through its isolated environment with a dependency deprecation warning. No conversion fidelity measured. |
| T13 | Background browser control via CUA; web tools; GitHub `gh` | Signed-in sources, visible interaction evidence, public research and repository inspection | APIs/CLI available; no account/session inventory or external request performed. CUA's native-computer APIs are disabled here. Browser access remains conditional on the actual tab/session. |
| T14 | Google Drive/Docs/Sheets/Slides, Gmail, Calendar, Contacts; Pages and other app tools | Connected source retrieval and authorized artifact/account work | Declared in this session. Authentication, current scopes and individual operations were not tested. No Discord or REA connector appears. GitHub plugin is suggested but not installed; `gh` is a separate local route. |
| T15 | Image generation, Blender MCP, artifact/document/PDF/presentation/spreadsheet skills, inline visualization skill | Visual assets, 3D work, diagrams, analysis artifacts and mockups | Tool/skill availability only. No live Blender connection or media-generation test. Native documents/runtime dependencies have their own skill routes. |
| T16 | `prototypes/workbench`, temporary builds and preview tooling | Compare unsettled layouts, inspect references and evaluate a candidate before production adoption | Source and existing reports present. Many concurrent edits exist; no build, browser pass or acceptance claimed by this audit. |
| T17 | `scripts/headless`, `scripts/playtest`, browser helpers | Fast native journeys, browser parity, persistence/determinism/error/overflow detectors | Inspected README/contracts. Chrome bot uses fresh temporary origin and bundle at 1920x1080. Node runner cannot prove geometry; natural-time behavior differs from dev stepping. No game execution here. |
| T18 | `scripts/replay`, `scripts/simfuzz`, `scripts/perf`, `scripts/test_queue.mjs` | Determinism, invariant exploration, workload measurement and shared-machine scheduling | Inspected contracts. Replay's engine adapter excludes native publication; fuzzing uses synthetic native context; performance budgets are documented proposals. Full coverage requires selecting the relevant route. |
| T19 | Shell/Python/Node, tool composition, review tool, agent coordination and chat-management APIs | Bounded automation, analysis, evidence packaging and authorized coordination | Available now. API presence does not grant permission to message chats, create recurring work, publish or commit. No agents dispatched. |
| T20 | Signal Quarry, GearScope, Vimeo transcript grabber | Niche product scouting, frame/angle measurement and visible transcript extraction | Local source/README inspected. Quarry requires a TrustMRR key and covers that feed, not the whole market. GearScope is measurement tooling. Vimeo helper requires the actual transcript UI. None executed. |

For unfamiliar engines, recover the lane's exact tool and source first. Godot, Unreal, GameMaker and other prior dossiers do not by themselves certify a maintained current GDRE/Unreal/Undertale tool installation. PATH inspection found no `jadx`, `apktool`, `r2`, `rizin` or `frida` executable; that is not an exhaustive filesystem absence claim. The pinned REA dependencies contain Frida 17.23.2, but runtime attachment was not tested. Hopper was reported missing and IDA unregistered by REA doctor. CrossOver Preview.app exists; neither its runtime nor game-specific Steam behavior was exercised.

## Reliable entry points

Current read-only REA health check, avoiding a fresh npm download or setup mutation:

```sh
cd /Users/weiwei/.codex/research/hogwarts-legacy/repos/rea-pinned
GHIDRA_INSTALL_DIR=/opt/homebrew/opt/ghidra/libexec \
JAVA_HOME=/opt/homebrew/opt/openjdk@21 \
node scripts/rea.mjs doctor --provider ghidra --json
```

For an actual analysis, recover the exact lane's seeds, binary hashes, temporary-path requirements and patched launcher receipt first. Inspect structured coverage, limitations and per-query errors. A process exit of zero or an `ok` envelope does not establish complete recovery. Keep the retained custom analysis project separate from fresh imports.

Other checked entry points:

```sh
cd /Users/weiwei/code/discord-reference-workbench
python3 -m discord_reference --help
python3 -m discord_reference verify data/catalog/corc-2026-10-20

DOTNET_ROOT=/Users/weiwei/.dotnet /Users/weiwei/.dotnet/tools/ilspycmd --version

cd /Users/weiwei/code/lncrawl-polite
.venv-polite/bin/python -m lncrawl polite --help
```

The Discord catalog command above checks a frozen sample. Before collecting, use the existing live recovery owner rather than treating that sample as the latest corpus. Current recovery is routed from PROJECT.md to `docs/gm/dispatch/corc-missing-media-2026-10-21/BRIEF.md`.

## Recommended changes, proposals only

| Rank | Code | Change | Why / effort / done check |
|---|---|---|---|
| 1 | A1 | Give the pinned research tools one maintained entry-point registry and explicit environment wrappers | Highest immediate return: agents currently rediscover tools or misclassify them as missing. Small documentation/wrapper task. Done when a fresh shell can find REA/Ghidra, ILSpy, UnityPy and the workbench, print identities and run bounded checks without installation or hidden network access. Preserve patched REA identity. |
| 2 | A2 | Finish one signed-in collector export/import/integrity journey | Resolves the Discord collector's actual acceptance gap. Requires the user's manual sign-in if needed. Done when a bounded scope has verified source boundaries, context/thread coverage, original bytes and animation status, plus importer/catalog receipts. A synthetic or smoke test cannot close it. |
| 3 | A3 | Reconcile current tool discovery docs with later receipts | Small docs task: older REA/tool absence rows and Z-Library's six-versus-ten mismatch misroute future work. Done when current routing distinguishes runnable 6.4.0 from source-only 6.5.0 and links dated history without rewriting it. This audit supplies evidence; those owners were not changed here. |
| 4 | A4 | Name verification slices explicitly in task/checkpoint records | Small workflow clarification. Done when runtime tasks name relevant root/nested tests, native/browser/persistence proof and human acceptance separately; headless UI claims explicitly exclude geometry. No need to run every suite on every change. |
| 5 | A5 | Trial a REA upgrade or a new provider only against one named gap | Medium and conditional. Compare the current patched route with a separate candidate on the same input/question, recording state transfer, exact results and resource cost. Do not replace repaired projects or install Hopper/IDA/Android/firmware stacks merely to expand a checklist. |

Suggested routing: start with retained data/source and exact existing exports; use specialized engine/asset tools next; use native REA/Ghidra when the missing behavior is actually native; finish a selected implementation with native and browser evidence. Discord contributes design intent and visual context, which still need source/version qualification before claiming released behavior.

## Checks and limits

| Check run in this audit | Result | What it establishes |
|---|---|---|
| Workbench `python3 -m unittest discover -s tests -q` | 26 passed, exit 0 | Existing synthetic/offline regression slice |
| Workbench `verify data/catalog/corc-2026-10-20` | 329 objects, zero integrity errors, 26 import issues, exit 0 | Saved-object integrity for that catalog |
| Pinned REA help/version | CLI starts; version 6.4.0 | Retained runtime entry point |
| Pinned REA default `doctor --json` | Exit 1, unhealthy | Default integration/provider configuration gaps |
| Pinned REA Ghidra-only doctor with explicit environment | Exit 0, scoped healthy | Ghidra/JDK installation readiness; no binary imported |
| .NET / ILSpy version commands | 10.0.402 / 11.1.0.9782, success | Explicit managed-tool entry points |
| UnityPy import in cached environment | 1.25.4, success | That interpreter's asset-library import |
| lncrawl polite help | Exit 0 | Isolated CLI and current arguments |
| `pdf2md --help` | Runs, with PyMuPDF alias deprecation warning | Wrapper/dependency import works |
| Inventory helper | Four probes exit 0; 13 input files hashed | Reproducible narrow local snapshot |

No tools installed, updated, registered, authenticated or published. No game/source collection, native import, game runtime change, personal-save access, commit or push. Full game build/test/architecture/rule gates were not relevant to this report-only change and were not run. Existing game harnesses were inspected, not newly validated. No claim of latest upstream versions or full-machine inventory is made.

Primary local owners: [workbench README](/Users/weiwei/code/discord-reference-workbench/README.md), [collector acceptance](/Users/weiwei/code/discord-reference-workbench/docs/LOCAL_COLLECTOR.md), [REA CLI guide](/Users/weiwei/.codex/research/hogwarts-legacy/repos/rea-pinned/docs/cli.md), [newer source CLI guide](/Users/weiwei/code/rea/docs/cli.md), [acquisition router](../research/SOURCE_ACQUISITION_TOOLS.md), [Z-Library profile](/Users/weiwei/code/zlibrary-research/docs/YAIRPG.md), [headless contract](../../scripts/headless/README.md), [Chrome playtest contract at the audited tooling revision](https://github.com/onionviolet/OOPS/blob/8dc3ce117484e019c6ce4b6a0711493d05643898/scripts/playtest/README.md).
