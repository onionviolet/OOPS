# Windows build portability

## Preflight

- Reading and authority: restore the existing `npm run build` and isolated `BUILD_OUT` verification route on this Windows checkout, under AD36 and AD43. No gameplay, save, authored Ink or compiler identity change.
- Fit and mechanism: `build.js`, the existing pinned `compile_feature_ink.mjs --check` recipe, and `tests/build_output.test.js`. Canonical compiler bytes remain authoritative. Player sentence, viewport, ordinary game route and persistence: n/a, because this change concerns build tooling.
- Ring and scope: build producer, preview asset consumer and failure checks. Own `.gitattributes`, `build.js`, scoped test and this receipt. No architecture or rule-checker edits.
- Failure scenario and checks: Git CRLF conversion makes exact Ink output verification fail; Windows preview linking requires privileges. Reproduce the byte difference, retain strict rejection, build concurrent isolated outputs and rebuild the same output.

## Findings and change

The unmodified `npm run build` stopped at `Compiled Ink output is stale`. The tracked JSON checkout used CRLF, while the pinned compiler emits LF. Before normalization, recompilation proved that replacing CRLF with LF in the current artifact gave byte-identical output. `.gitattributes` now pins `stories/feature_wave.json` to `text eol=lf`; the local checkout was normalized with the same equality guard. There is no Git content diff for this generated artifact. `compile_feature_ink.mjs` was not changed and still rejects any byte drift.

The compiler documentation also has checkout CRLF: both original LF-only start-marker searches returned `-1`. `build.js` now normalizes that documentation to LF before extracting its complete redistribution blocks. The notices keep their complete canonical text.

Windows isolated builds now use directory junctions and file hard links, which do not require symbolic-link privileges. Reusing an output recognizes an existing file hard link by device/inode identity. POSIX retains symbolic links. File hard links require output and source to share a volume; use a checkout-local `.lane-builds` directory on Windows. Existing unrelated asset destinations remain rejected. Build errors now print their cause instead of being swallowed.

## Checks and evidence

| Command or evidence | Result | Gaps |
|---|---|---|
| `$env:BUILD_OUT='.lane-builds/portable-build'; npm run build` | Passed; primary HTML and bundle untouched | Two existing esbuild duplicate-key warnings in `layout_spec.js` and `travel_legs.js`; no gameplay claim |
| `node --test tests/build_output.test.js` | 2/2 passed, about 12.6s; two concurrent outputs, one repeat build, output hashes and asset availability, complete notices | Cross-volume Windows output is outside the supported hard-link route |
| Deliberate CRLF artifact passed to `--check --output` in the focused test | Rejected as stale, fixture bytes untouched | No semantic or identity relaxation |
| `node scripts/compile_feature_ink.mjs --check` | Passed; zero diagnostics | None |
| `node --check build.js` | Passed | None |
| `git diff -- stories/feature_wave.json` | Empty | Local newline normalization; content preserved |

Ink source SHA256: `a4d470baa3ce27e44087bbf213a51cc9d98e8afeefd5a08bdd2bb54281785d8a`.
Canonical compiled standard JSON SHA256: `9f9f8b32940353a39c0862ef00be16c8883055cb7af4d135cda0ea171689bfdd`.
Full compiled artifact SHA256: `ffb07d934f656be98952aa2e3d181c585b3342090e1d033079dc819df311ac7c`.
Content identity: `sha256:d193eb3a33eb66ba8825e6a15819f2920fe2a6b65ed27a24e5613e91015ccb43`.
Compiler remains `inkjs@2.4.0`, story format 21, revision 4.

The first isolated bundle SHA256 was `b134dd0af03fa5618a5e9098a90573cd0bb7ceb6bf1562f7e34cf1d6573894e6`. Other agents were editing runtime source concurrently; this names that output, not an immutable source snapshot or gameplay acceptance build. The scratch output was removed after these checks. Tests removed their own temporary outputs. No server, worktree, branch, commit, push or install was created.

Change surface: no runtime core-owner files, no new cycle edges, no registration lines. The existing build regenerates `src/capability_runs/index.js`; it has no Git content diff. Review state: agent-verified build tooling, not human-reviewed. Gameplay floor lines and broad runtime gates belong to the parent work and are not claimed here.

For PowerShell browser verification, use `$env:BUILD_OUT='.lane-builds/<lane>'; npm run build`, then serve that output or its parent checkout. `Remove-Item Env:BUILD_OUT` returns subsequent builds to their ordinary default destination.

## External documentation investigation

The separate bounded investigation of `docs/TOOL_REGISTRY.md` and `docs/research/SOURCE_ACQUISITION_TOOLS.md` found no verified replacement for their external Mac documentation links. Neither `zlibrary-research` nor `discord-reference-workbench` exists beside this checkout, under the launcher's default `C:\Users\wayba\code`, or under the historical Windows-translated Mac user root. Read-only `python scripts/toolsets.py show source-library` and `show discord` both report `ready: false` and missing required files. Tracked OOPS reports retain the same external targets; the tracked Z-Library toolkit records revision `3a19de35b1c76480d43498eb654699e1bdf1b77e` for version 0.3.0, which does not establish equivalent content for the later 0.5/0.6 owners or collector scope contract. A credential-free fetch of that exact revision's `docs/YAIRPG.md` returned HTTP 404, so its content was not verified and no replacement was inferred.

`node scripts/check_rules_index.mjs` still fails with nine broken-link reports in these two documents: Discord README and LOCAL_COLLECTOR; Source Library 0.5.0 in each document; Kavita 0.6.1, Komga 0.6.0, light-novel 0.5.2, Suwayomi extension install and YAIRPG profile. The repeated collector link is deduplicated within its document by the checker. The documents and checker were left unchanged. No sibling checkout was cloned, no credential was used and no source was acquired. These are unresolved external dependencies, not a passing documentation gate.
