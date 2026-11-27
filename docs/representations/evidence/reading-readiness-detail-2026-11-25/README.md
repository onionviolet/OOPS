# Optional reading-readiness detail

Status: agent-verified at 1366×900, not human-reviewed.

| Preflight | Scope |
|---|---|
| Reading | Expose the existing approved book and field counts on demand in normal Atlas Reading at 1366×900 desktop. |
| Authority | Parent's bounded UI assignment; AD36/AD43, AR3/AR8. Counts remain measurements, not source completeness or source values. |
| Player sentence | “Books and field counts” opens a book/world selector and optional approved-field counts. |
| Route and mechanism | World → Harry Potter → Reading → Show measured output readiness → optional detail → compare two books. Reuse the same GET response; no new inspection on expansion or selection. |
| Fit and ring | Existing `appendReadingReadiness` module, native details/summary, labels/selects and scoped tables. Presentation work in this lane; computation and server remain with their owners. |
| Files | `reading-readiness-view.mjs`, existing standalone browser proof and this separate evidence directory. Historical readiness artifacts remain unchanged. |
| Failure and checks | A detail table must not inflate the world-table assertion, aggregate counts must not be shown as a selected book, and source rows/paths must not leak. Check exact approved payload cells, keyboard-accessible controls, request count, page overflow, stale/missing reports and browser errors. |
| Desktop | 1366×900. Initially one load button; after loading the normal summary remains compact and extra tables are deferred until the disclosure opens. Wide numeric tables scroll within their container. Mobile work deferred. |
| Persistence | No saved key or persistence change. Disclosure resets on refresh. |

The standalone fixture now measures the actual current four-chapter LOTM subset against copied current snapshot/digest bytes and the current calculation binding. It writes `live-recent-four.json` here. The historical `../reading-readiness-2026-11-25/recent-four.json` remains SHA256 `501d742dfa2b33b0652cf8de8db4754e864905041818eeaac2bc33081e6539fe` and is checked after every proof run.

`node tests/atlas_reading_readiness_browser.mjs <normal Atlas URL>` passed on the ordinary default snapshot after the coordinated calculation-bound 44-world refresh. The proof follows Harry Potter → Reading → the Read stage → Show measured output readiness. The world table exactly matches its GET payload. The disclosure begins closed and creates no book selector or detail tables until opened.

| Compared book | Measured chapter groups | Selected output files | Census rows evaluated |
|---|---:|---:|---:|
| hp1 | 9 | 108 | 816 |
| hp2 | 17 | 204 | 1,530 |

Both selected-book output tables and approved field label/count rows matched the existing payload exactly. Expansion and book selection made no additional readiness GET. Field table captions retain the book key when the side panel is scrolled. Numeric summary cells retain readable spacing in a keyboard-focusable horizontal scroll region; the page itself does not overflow at 1366px. No source values or raw source/file paths appear in the readiness detail.

The same run passed fresh four-chapter standalone measurement, the twelve-kind scoped world-table assertion, stale snapshot and missing-report cases. The new measurement binds to current snapshot/digest/calculation bytes rather than borrowing the historical report's timestamp or counts. The historical report hash above still matches. Six captures were inspected. `node --check` for both edited modules and changed-file whitespace checks passed. No server or readiness calculation changes, default rebuild, spending or source acquisition occurred in this lane.

The browser and proof servers exited with code 0. Final teardown reported a Windows-locked disposable Chrome profile at `%TEMP%/yairpg-owned-chrome-eNLCcH`; the helper terminated its exact owned Chrome tree and retained that profile. Temporary standalone snapshot/digest scratch was removed. Source/test checks and browser details are in `browser-result.json`.

Served view SHA256: `2a7e0434ef54ae92a225ed0dbbdf49c19482bac3e6b096fe8e769220b8463df9`.
