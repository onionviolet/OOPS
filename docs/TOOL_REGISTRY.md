# Tool registry

Current operational entry point for YAIR research, extraction, media and verification tools. Created 2026-10-21 at Weibao's request to make the existing tools discoverable and usable by other agents. The [machine-readable registry](../scripts/toolsets/registry.json) owns command definitions; this page owns routing and usage. Tool-specific owners still govern source scope, privacy, transport and evidence. The [initial audit](audits/TOOLSETS_AUDIT_2026-10-21.md) is a dated snapshot, not a competing live registry.

## Start here

From any working directory, use the absolute launcher path:

```sh
python3 /Users/weiwei/code/yet-another-idle-rpg/scripts/toolsets.py list
python3 /Users/weiwei/code/yet-another-idle-rpg/scripts/toolsets.py show rea
python3 /Users/weiwei/code/yet-another-idle-rpg/scripts/toolsets.py doctor --probe rea ilspy unitypy discord
python3 /Users/weiwei/code/yet-another-idle-rpg/scripts/toolsets.py run rea -- --help
```

Inside this checkout, `python3 scripts/toolsets.py ...` is equivalent. `list --json` returns all entries, including reference/manual routes. `show ID` reports command, declared effects, effective tool-specific environment, required paths and readiness without launching it. `doctor ID...` checks presence; `--probe` runs only registered finite offline checks. No collector, MCP server, browser journey or native import is started by doctor. A nonzero doctor exit means at least one selected launch route is missing or failed its probe. Reference routes are explicitly reported as references, never readiness successes.

`run ID -- ARG...` replaces the launcher process with that tool. It preserves caller working directory, stdin/stdout/stderr, argument boundaries, exit status and signal handling. Relative input/output paths therefore refer to the caller's directory. Use absolute source/output paths for reproducibility. No shell interpolation, command logging, credential capture, automatic installation, fallback version, retries or MCP registration occurs. The selected tool retains its normal behavior and authority requirements. `show` and doctor output include paths/configured values; keep them local if overrides contain private values. Do not put credentials in argv or these path/configuration overrides.

## Choose the route

| Need | IDs / owner | Current boundary |
|---|---|---|
| Source already saved | `saved-sources`; [deep-dive modes](research/SOURCE_DEEP_DIVE_PLAYBOOK.md#saved-sources-first) | Match exact edition/build and receipts; root presence does not prove every artifact exists or was read. |
| Discord evidence | `discord`; [workbench README](/Users/weiwei/code/discord-reference-workbench/README.md) | Offline import/snapshot/search/gallery/verify. Preserve original/derivative and animation distinctions. |
| Discord collection | `discord-web`, `discord-desktop`, `discord-exporters`; [collector owner](/Users/weiwei/code/discord-reference-workbench/docs/LOCAL_COLLECTOR.md) | Manual sign-in, one collector at a time, explicit channels/threads and pacing. Packaged/smoke proof differs from real export acceptance. |
| Native binary investigation | `rea`, `rea-pinned`, `ghidra`; [tool fit](research/REVERSE_ENGINEERING_TOOL_FIT_2026-10-13.md) | Updated upstream REA 6.7.0 is the default. Patched 6.4.0 remains explicit as `rea-pinned`; neither route transfers repaired projects automatically. |
| REA source | `rea-source` | `/Users/weiwei/code/rea` is now updated and built at revision `6d356b84344659085f2b912857b5e27fe0160c9b`. |
| Managed code | `dotnet`, `ilspy` | Explicit .NET root avoids PATH/runtime ambiguity. Trace real method consumers, not declarations alone. |
| Unity asset extraction | `unitypy` | Runs its isolated Python with your script or `-c`; not a separate extractor CLI. |
| IL2CPP recovery | `cpp2il`, `il2cpp-dumper` | Repaired Cpp2IL passed an owned-game declaration recovery. Dumper is presence-checked only. Declaration output does not establish executable method bodies. |
| Books and fanworks | `lncrawl`, `zlibrary`, `zlibrary-mcp`, `epub-prepare`; [acquisition owner](research/SOURCE_ACQUISITION_TOOLS.md) | Local library first. Preserve selected source, transport state, private output and extraction-versus-reading coverage. |
| Unified books/comics/manga app | `source-library`, `source-library-services`, `source-library-bootstrap`; [0.5.0 owner](/Users/weiwei/code/zlibrary-research/docs/SOURCE_LIBRARY_0_5_0.md) | Native app, private catalogue and 25-tool MCP. Unified download ledger, Suwayomi, Komga, CLU and Gutenberg verified. Bookracy remains 403-blocked; LibGen disabled after browser safety rejection. Existing `zlibrary-mcp` launches this server. |
| Local library/PDF/OCR/media | `calibre`, `pdf2md`, `pdftotext`, `tesseract`, `ffmpeg` | Version/help proof only. Several tools write beside the input unless output is explicit. |
| Live browser or connected sources | `browser`, `connectors` | Discover tools in the current session. Session/authentication and write authority cannot be inferred from this registry. |
| Visual/3D/document artifacts | `assets`, `mockups`; [mockup owner](MOCKUP_SYSTEM.md) | Apply matching skills and test live connection. UI proof target is 1920x1080. |
| Gameplay verification | `playtest`, `headless-bench`, `replay`, `simfuzz`, `perf`, `test-queue`; [scripts guide](../scripts/README.md) | Select relevant slices. Root `npm test` does not include nested suites. Node DOM does not prove browser geometry. |
| Niche helpers | `signal-quarry`, `gearscope`, `vimeo-transcript` | Reference routes with their own source/setup instructions; no speculative launch automation. |

## Examples

```sh
# No new account access: inspect existing local evidence.
python3 scripts/toolsets.py run discord -- search /absolute/catalog inventory
python3 scripts/toolsets.py run discord -- verify /absolute/catalog

# Managed / asset tools without editing global PATH.
python3 scripts/toolsets.py run ilspy -- --help
python3 scripts/toolsets.py run unitypy -- -c 'import UnityPy; print(UnityPy.__version__)'

# Explicit server launch, not registration or sign-in.
python3 scripts/toolsets.py run zlibrary-mcp
python3 scripts/toolsets.py run discord-web

# Queue substantial browser/suite work, with explicit task scope first.
python3 scripts/toolsets.py run test-queue -- browser node scripts/playtest/run.mjs --runs 2
```

Read the [collector scope contract](/Users/weiwei/code/discord-reference-workbench/docs/LOCAL_COLLECTOR.md) before either collector launch. `REFERENCE_SCOPE` selects its explicit scope file; `REFERENCE_PORT` can select a port, but changing origins changes workspace continuity. Launch wrappers do not broaden channel/thread scope or resolve rate limits. There is no credential extraction or automatic account login.

## Configuration and precedence

The launcher is standard-library Python and needs no installation. Defaults derive from the current user's home and this checkout, with Homebrew Ghidra/JDK and Calibre paths for this Mac. Existing variables win over defaults, except tool-specific PYTHONPATH is prepended to locate the intended module. Nothing is written to shell startup files or agent config.

| Override | Controls |
|---|---|
| `YAIR_TOOLS_HOME` | Base home used for default cached tools; defaults to current user's home |
| `YAIR_TOOLS_CODE` | Sibling code repositories; defaults to `<home>/code` |
| `YAIR_TOOLS_RESEARCH` | Research cache; defaults to `<home>/.codex/research` |
| `YAIR_REA_ROOT` | Exact runnable REA checkout; must contain its required compiled runtime |
| `YAIR_REA_PINNED_ROOT` | Historical patched 6.4.0 route used by `rea-pinned` |
| `GHIDRA_INSTALL_DIR`, `JAVA_HOME` | Native provider and JDK; defaults are Homebrew Ghidra and openjdk@21 |
| `REA_ANALYSIS_PROVIDER` | Defaults to ghidra for REA; caller's explicit selection is preserved |
| `DOTNET_ROOT` | SDK and ILSpy runtime; defaults to `<home>/.dotnet` |
| `YAIR_UNITY_VENV` | Python environment with UnityPy; defaults to Immortal Life's tools environment |
| `YAIR_CPP2IL_ROOT` | Verified, signed Cpp2IL installation; defaults to `<home>/.local/share/yair-tools/cpp2il/2022.1.0-pre-release.21` |
| `YAIR_CALIBRE_APP` | Calibre app bundle; defaults to `/Applications/calibre.app` |
| `YAIRPG_PROJECT_ROOT` | Z-Library MCP private output project; defaults to this checkout |

If REA is overridden to a different version/provider, inspect `show`, run its matching scoped doctor and bind the changed version/settings in the task receipt. The default REA probe specifically checks Ghidra, not every optional provider or registration. Read structured `coverage`, limitations and per-query errors after actual analysis; exit zero is not complete recovery.

## Known readiness limits

**R1 Cpp2IL, repaired:** the old 5,832,131-byte file was an exact truncated prefix of the official 15,719,263-byte release. The preserved cache was not overwritten. A complete upstream-hash-verified private copy was ad-hoc signed and is now the default. Its install receipt records both upstream and signed hashes. Verification against owned 100 Space Cats build 19025398 mapped 26,984 method definitions and emitted 47 declaration assemblies; ILSpy independently read the game's assembly. Installed input hashes stayed unchanged. Output used `dll_empty`, deliberately empty bodies, so this is recovery/navigation proof rather than recovered executable C#. [Repair and verification](audits/toolsets_2026-10-21/CPP2IL_REA_AND_CHAT_ACCESS.md).

**R2 Analysis state:** updated REA 6.7.0 uses upstream default analysis, with a successful real Ghidra function check on a synthetic native fixture. The explicit `rea-pinned` route retains `-noanalysis -max-cpu 2`. These are different analysis identities and resource profiles. Neither ephemeral import transfers custom ABI, flow, lowering or function repairs by default. Preserve exact repaired projects and compare only a named chain if changing routes.

**R3 Evidence:** collector live export, Dumper recovery, browser authentication and asset-tool live connections retain their own unclosed gates. File presence and help/version probes are weaker than target success. Recommendations and per-tool improvements are tracked in the [initial implementation receipt](audits/toolsets_2026-10-21/IMPLEMENTATION.md) and [later repair/update receipt](audits/toolsets_2026-10-21/CPP2IL_REA_AND_CHAT_ACCESS.md).

## Access from project chats

Shell-capable chats can use every registry route immediately through the absolute launcher. Trusted-project `.codex/config.toml` also configures the existing `rea` and `book_research` MCP servers. REA exposes a compact 14-tool investigation set; its full 213-tool upstream catalog remains accessible through the CLI/MCP implementation when a task needs it. Book research exposes its existing ten local/remote tools. No generic arbitrary-command MCP bridge or new background service was added.

Current verification: both servers initialized and listed tools over real stdio, REA's `binary_session` call passed, and the bundled Codex client's effective MCP listing recognizes both project registrations as enabled. Existing chats may need their local client/session refreshed to load the new inventory. This chat's tool declarations do not retroactively change. A configuration entry is not proof of a fresh chat's visible tools, authenticated book acquisition or a game result.

Use native REA/book tools when exposed; otherwise use the same wrapper, without rewriting configuration or rerunning setup. Discord and Cpp2IL remain shell routes because their existing tools do not provide a native MCP server. For Cpp2IL, use an explicit private output:

```sh
python3 scripts/toolsets.py run cpp2il -- --game-path /absolute/owned-game --output-as dll_empty --output-to /absolute/private/new-output
```

The MCP configuration is project-scoped and additive. The prior config is backed up privately at `~/.codex/research/tool-validation-2026-10-21/project-config-before-mcp.toml`. Tool-specific authorization, source scope and private-output rules still apply. [Official MCP/project configuration guidance](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) supports this setup; MCP OAuth status `unsupported` is normal for these local stdio transports and does not mean book-service authentication succeeded.

## Maintaining the registry

Change launch definitions in `scripts/toolsets/registry.json`, keep this usage contract aligned, and update relevant discovery links when routes change. Preserve dated research reports; add a dated current-status pointer rather than rewriting their historical observations. Never promote a source checkout, partial export or manual route to ready because its folder exists.

For a changed launcher, run `python3 -m unittest discover -s scripts/toolsets/tests -v`, then the relevant offline probes and one command through `run` from a directory containing spaces. Tests protect literal argument forwarding, working directory, child exit status, environment precedence, missing-runtime refusal and no implicit launches for manual routes. Add target execution only when the authorized task requires it.


The repo-local playtest runner is optional and available only in revisions that include `scripts/playtest/run.mjs`; scoped `doctor` reports it missing on older/default checkouts.
