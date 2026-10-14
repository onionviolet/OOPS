# A5 checkpoint, 2026-10-14

A1 Scope: tests only on `core/a5-determinism` in the named A5 worktree.
The worktree was clean at recovery. COMMON.md and live direction were read;
this lane changes no product direction, source, build, private pack or user save.

A2 Complete: added lexical source ratchets and JSON baseline, plus seeded
headless 48-boundary replay and JSON save/reload continuation probes. Three
legacy unseeded route groups remain explicit TODOs. Read
`proc/p1-streams:src/seeded_streams.js` without importing or merging that branch.

A3 Evidence: focused 9 tests, 6 pass, 0 fail, 3 TODO; full `npm test` 643
tests, 640 pass, 0 fail, 3 TODO. Commit
`6fbc31934350be6178cf1c6a4ff22fddfa8b4412` owns only the three new test/baseline
files. Worktree clean. [REPORT.md](REPORT.md) owns counts, hashes, limits and
stream-extension proposal. Main-checkout lane documents stay unstaged.

A4 Next owner: root coordinator review/integration. No A5 source work remains.
Do not import the streams branch or claim native gameplay/save acceptance.
