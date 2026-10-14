# ER13 report: wider engine and framework catalog

## CHECKPOINT

Complete, 2026-10-14. [Catalog](../../../../research/ENGINES_AND_FRAMEWORKS_CATALOG_2026-10-14.md) covers root palette M and the explicitly requested tools, with four idle-source traces and ten ranked concrete patterns. All recommendations are proposals. Resume only for a named source gap, a changed requirement or an explicitly selected adoption trial. No runtime implementation or gameplay acceptance is claimed.

## Handback

| Code | Result |
| --- | --- |
| ER13-R1 | Keep JS/DOM host. Best first pattern is AD-style batched panel updates with owned subscriptions; next is visible-panel refresh/lifecycle cleanup. Namespaced command metadata and distinct visible/selectable eligibility are useful authoring patterns. Costs, root mappings and observable checks are in the catalog. |
| ER13-R2 | Source-read loop/save/offline/UI for The Modding Tree, Antimatter Dimensions, Kittens Game and Isha's Incremental Game Template. Pinned source links distinguish READ from documented claims and fit inferences. TMT's current named repository is not Acamaeda's older fork; IGT's scoped package differs from the old package and Vue starter. |
| ER13-R3 | Kittens uses restricted WET PAWS terms; recommendations call for independent implementations of patterns. StoryAssembler's actual license is the UC BSD-4-Clause variant, not MIT. Ren'Py, Defold, Inform, MonoGame/FNA and shell dependencies have license distinctions recorded. No reference code was copied into runtime. |
| ER13-R4 | ER5 and ER6 finished during this lane. Their Godot/Unity/Bevy/Defold/JS-renderer/shell and JS-ECS judgments are linked rather than redone. ER4's AD/Kittens genre review is linked while this lane supplies the requested fresh source read, metadata and adoption boundary. |

## Files written

| Code | Owned file | Purpose |
| --- | --- | --- |
| ER13-W1 | `docs/research/ENGINES_AND_FRAMEWORKS_CATALOG_2026-10-14.md` | Main catalog, recommendations, source traces and final steal list |
| ER13-W2 | `docs/gm/dispatch/engine-runtime-2026-10-14/ER13/REPORT.md` | This handback |
| ER13-W3 | `ER13/releases.json`, `ER13/repositories.json`, `ER13/package-releases.json` | Compact first-party GitHub release/repository and package-channel responses, including empty results/errors; repository metadata does not establish deployed release versions |
| ER13-W4 | `ER13/doc-fetches.json`, `ER13/VERIFIED_SOURCE_REVISIONS.json` | Fetch routes/failures and pinned source revisions; extra Kittens UI file hash |

All ER13-relative paths above are under this report's folder. Root palette, PROJECT, source, tests, build inputs and dist remain outside this lane's writes. The shared tree already contained extensive unrelated edits; no reset, stage, commit, push or install was run. No files named SECRETS were opened and no user saves/private packs were read.

## Commands and routes actually used

Commands ran from `/Users/weiwei/code/yet-another-idle-rpg` unless `git -C` says otherwise. This is research provenance, not an engine performance benchmark.

| Code | Command / route | Outcome |
| --- | --- | --- |
| ER13-C1 | `cat`, bounded `sed`/`nl`, `rg` and `rg --files` on COMMON, AGENTS, PROJECT, user preferences, USER_VISION, root M, E1-E10, offline audit and ER1-ER6 artifacts | Read dispatch constraints, accepted direction, incumbent seams and completed sibling assessments. A broad first read exceeded output budget; focused follow-up reads recovered relevant sections. No policy/owner files changed. |
| ER13-C2 | `git status --short` and final path-scoped `git diff --check` | Inspected dirty state; preserved other workers' edits. Final check result below. |
| ER13-C3 | `git clone --depth 1 https://github.com/Acamaeda/The-Modding-Tree.git /tmp/er13-scout/tmt`; same command for `ThePrestigeTreeGuy/The-Modding-Tree` to `tmt-current`, `123ishatest/igt-library` and `123ishatest/igt-vue` | Four shallow scratch source downloads, no checkout installs. Read named-current TMT at `51bbdff4`, IGT library `7c2953bc`, UI `8fad6c9b`. Older Acamaeda checkout used only for provenance comparison. |
| ER13-C4 | `git -C <scratch-source> rev-parse HEAD` and `git -C <scratch-source> log -1 --format='%H %cI'`; `nl -ba` / bounded `sed` / `rg` on named runtime files | Established revision/date and actual loop/save/offline/UI mechanisms. IGT base start/resume reset last-update cursor; source search found separate special-event wall-date logic, so no claim all features lack wall time. |
| ER13-C5 | Python `urllib.request` with `ThreadPoolExecutor` on `https://api.github.com/repos/<owner>/<repo>/releases?per_page=5`, repository metadata, license, tree and commits endpoints | Saved compact release/repository evidence. Independently confirmed AD/Kittens HEAD matches ER4 source manifest. Read retained ER4 code rather than clone both games again; fetched pinned Kittens `js/ui.js` and read its real update implementation. No code execution from downloaded projects. |
| ER13-C6 | Python GET of npm registries for `xstate`, `json-rules-engine`, `incremental-game-template`, `@123ishatest/igt-library`; pub.dev Flame API; NW.js versions.json; maintainer docs/licenses/READMEs | Distinguished release channels, dependencies and platform scope. Compact metadata retained; large downloaded bodies and helper scripts are under `/tmp/er13-scout`. No npm install. |
| ER13-C7 | Web search/open/find on first-party Yarn, MZ, Twine/SugarCube, Ren'Py, Defold, GDevelop, Flecs, Unity, Construct, articy and GameMaker sources | Verified documented capabilities and version/license context; sources/checked date are linked in catalog. Failures switched route: LÖVE wiki to repository/community port; old Inform path to maintainer repository; old Yarn URL to current first-party docs; Construct direct fetch to editor/web reader; missing license paths to GitHub contents/license API. Error results remain visible in fetch manifest. |
| ER13-C8 | `python3 /tmp/er13-scout/write_catalog.py`, followed by focused Python edits | Wrote only owned catalog/evidence. Corrected ER4 Kittens anchor and StoryAssembler license before final validation. Source artifacts retain exact names rather than a guessed uniform version scheme. |
| ER13-C9 | `python3 /tmp/er13-scout/check_catalog.py` | Checks local paths/headings, pinned source file existence/range bounds, complete named coverage, ten steal rows and banned punctuation. Initial run reported only the as-yet-unwritten REPORT target; final result below after writing it. This does not execute engines or prove behavior. |

## Open evidence and limits

| Code | What remains unknown / consequence |
| --- | --- |
| ER13-Q1 | Idle peers do not publish GitHub releases in checked feeds. HEAD dates/changelog/npm evidence are explicit substitutes for source freshness, not claimed live-product release dates. MZ 1.9.1 is the latest engine update located in primary announcements, not a certified newest installed editor. GameMaker release page supplies current IDE/runtime build but exact publication date was not established. These gaps do not affect the pattern-first recommendation. |
| ER13-Q2 | Wails stable API returned v2.14.0 while docs banner says v2.15.0; v3 remains beta. Cocos default branch v3.8.9 is not the release feed's 3.8.8. Construct stable/LTS/beta and XState/Flame monorepo tags are kept distinct. Pin and reconcile before an actual dependency/package trial. |
| ER13-Q3 | IGT library package declares MIT but the inspected checkout has no top-level LICENSE notice. Resolve the actual notice before copying code. Kittens recommendations copy no implementation. Other runtime assets/dependencies require their own notice review only if selected. |
| ER13-Q4 | No install, runtime benchmark, build, browser journey, migration or acceptance run. Any chosen adoption still needs one bounded consumer and appropriate source, rebuilt desktop and persistence checks. Desktop/laptop priority and current offline/branch authority remain unchanged; no existing native gate is closed by this catalog. |

## Final document checks

ER13-C9 PASS: 28 local catalog links/headings, 146 external links listed, 37 pinned source ranges checked, 44 named coverage tokens present, exactly 10 steal rows, no errors. External links are cited inventory, not 146 independently executed HTTP link tests. Pinned range checks validate files and bounds, not claim semantics.

ER13-C2 PASS: path-scoped `git diff --check` exited 0. Since new outputs are untracked, this is supplemented by a direct Python whitespace/link/JSON check on all ER13 outputs: no trailing whitespace, no banned punctuation, all local Markdown targets exist and all five evidence JSON files parse. No engine test suite was run for this documentation-only change.
