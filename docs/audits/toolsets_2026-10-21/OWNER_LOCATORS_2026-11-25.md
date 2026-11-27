# Portable external owner locators

Execution evidence for [the tool registry](../../TOOL_REGISTRY.md). The nine Windows rules-index errors came from Markdown links to eight external owner documents under `/Users/weiwei/code`. This change preserves those identities and gives each an exact discoverable registry locator, rather than declaring the absent documents available or weakening link checks.

| Preflight | Scope |
| --- | --- |
| Reading | Make external tool owners discoverable from both host layouts while preserving their provenance and absence qualifications. |
| Fit | Existing `scripts/toolsets.py show` and scoped `doctor`, `{code}` root expansion through `YAIR_TOOLS_CODE`, `scripts/toolsets/registry.json`, and the dated `LOCAL_INVENTORY.json` hashes. |
| Mechanism | Optional document metadata on the existing `discord` and `source-library` entries; one read-only resolver returns absolute local paths, presence, current hashes and separately labelled historical attestations. No command or executable-launch behavior changes. |
| Failure | An absent runtime hides a present owner, a missing owner is presented as installed, a historical hash is presented as the current file, or owner identities are discarded when links change. Four focused tests exercise these boundaries. |
| Files | `docs/TOOL_REGISTRY.md`, `docs/research/SOURCE_ACQUISITION_TOOLS.md`, `scripts/toolsets.py`, `scripts/toolsets/registry.json`, `scripts/toolsets/tests/test_launcher.py`, and this receipt. No checker or baseline changes. |
| Rules | AD6–AD8, AR3; source acquisition remains governed by its existing owner and transport contract. This is routing and evidence, not authority to acquire, install, register or sign in. |

## Owner retrieval

From either checkout, run `python scripts/toolsets.py show discord` or `python scripts/toolsets.py show source-library` (`python3` on the Mac). The `resolved_documents` entries identify the exact current local path and state. A scoped `doctor --probe discord source-library` also includes the document states, retaining the existing runtime readiness/probe semantics.

The locator syntax in the docs is `tool ID/document ID`, matching the tool’s `id` and a member of its `documents` array in the tracked registry. All eight previous identities are retained:

| Locator | Owner within its original repository |
| --- | --- |
| `discord/readme` | `discord-reference-workbench/README.md` |
| `discord/collector` | `discord-reference-workbench/docs/LOCAL_COLLECTOR.md` |
| `source-library/platform-0.5.0` | `zlibrary-research/docs/SOURCE_LIBRARY_0_5_0.md` |
| `source-library/kavita-0.6.1` | `zlibrary-research/docs/KAVITA_READER_0_6_1.md` |
| `source-library/komga-0.6.0` | `zlibrary-research/docs/INTEGRATED_READER_0_6_0.md` |
| `source-library/novels-0.5.2` | `zlibrary-research/docs/LIGHT_NOVEL_SOURCES_0_5_2.md` |
| `source-library/suwayomi-2026-10-22` | `zlibrary-research/docs/SUWAYOMI_EXTENSIONS_2026-10-22.md` |
| `source-library/project-profile` | `zlibrary-research/docs/YAIRPG.md` |

Every metadata entry retains its full original `/Users/weiwei/code/...` path. Paths resolve through the existing sibling-code root, so the Mac default remains useful and a Windows/mounted checkout can set `YAIR_TOOLS_CODE` to its actual directory. This locates owners without treating Unix runtime launch layouts as Windows installations.

The three attested documents use the original inventory as the single source of historical hashes: workbench README `bcc8768f…825553`, collector `aaacfe63…3d1d4f1`, project profile `2494f83e…1927380f`, captured October 21. The resolver reports that inventory path/date/hash separately from a current file hash. The other five owner identities were already cited in the docs but have no body or digest attestation tracked here; none was fabricated or copied. `matches_recorded` is null when the current file or historical attestation is absent, rather than treating absence as a match.

The checked Windows default directories `C:/Users/wayba/code/discord-reference-workbench` and `C:/Users/wayba/code/zlibrary-research` do not exist. Actual `show` calls therefore return eight missing document paths and three historical attestations. Doctor returns missing runtime states and exit 1 without launching anything. The fixture test creates an owner in a path containing spaces and proves `show` returns its usable local path/current digest even when its tool runtime is missing. Mac execution was not performed from this host; its existing default-root and launch behavior were preserved.

## Verification

| Check | Result and qualification |
| --- | --- |
| `python -m unittest discover -s scripts/toolsets/tests -p test_launcher.py -k owner` | 4/4 passed on final source: document path/readiness separation, historical-vs-current hashes, missing scoped doctor without execution, and all eight original identities. |
| `python -m unittest discover -s scripts/toolsets/tests -p test_launcher.py` | 12 passed, 1 existing Windows error: `test_preserves_arguments_cwd_and_child_exit` requires symlink privilege and fails with WinError 1314. The original test remains present and unchanged. An attempted non-symlink fixture reached a separate Windows `os.execvpe` process failure; that fixture change was removed. No claim of Windows executable-launch qualification. |
| Actual `show discord`, `show source-library` and scoped `doctor --probe discord source-library` | Exact paths/absence and historical provenance reported. Both default external repositories are absent. No owner body, tool runtime, collector, app, provider or service was launched. |
| `npm run check:rules` | All nine external-link errors resolved: rules-index PASS, 1,651 relative links, zero warnings. Receipts and direction sync also pass. The wider command then stops on the unrelated new raw-duration string in `src/lotm_charm_upkeep.js:59`. |
| `npm run check:docs` | No finding in these owned docs. Stops on the unrelated upkeep receipt’s line 22, which needs an authority link/code/quote on its acceptance line. Coordinator notified. |
| Scoped `git diff --check` | Passed. No ignored-link list, skipped link check, copied owner content or speculative web link. |

Agent-verified lookup behavior, not human-reviewed. No commit, push, installation or deployment. Temporary test fixtures clean up through their existing `TemporaryDirectory` lifecycle; no background service or task-specific process remains.
