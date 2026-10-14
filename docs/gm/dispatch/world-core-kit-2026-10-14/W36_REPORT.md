# W36 report: calendar and climate display slice

## CHECKPOINT

2026-10-14. **Source/tests/build complete; browser acceptance OPEN. Not browser-verified by W36.** Claude root in the main checkout owns integration and the rebuilt 1366x768 desktop journey. Mobile deferred. No merge or push. This report is W36's only main-checkout write; existing mixed dirty edits were preserved.

Authority: Weibao, 2026-10-14: “yes, hand W28 climate and W33 calendar to integration as one slice, ending in a visible local date line and weather words, proven in a rebuilt desktop journey”. The specific lane permits source/tests/builds/commits in its isolated worktree and replaces COMMON's design-only rule. Existing sealed files were not opened. No hidden dates were printed.

## Branch and commits

Worktree: `/Users/weiwei/code/yairpg-w36-calendar-climate`.
Branch: `kit/w36-calendar-climate`.
Created exactly from `kit/w28-world-climate`, base `024d4da98268cd04b7d534e796d94c97bb6f6837`. W28's pure module/tests are inherited, not duplicated or merged into main by this lane.

| Code | Commit | Contents |
|---|---|---|
| W36.C1 | `b0bb853b56481d637f686cb0ec05bdd66d011cb6` | Four revisioned legacy profile records, pure calendar/projector/log cursor, display-only visitor weather words, main/display publication hooks and seven tests. |
| W36.C2 | `f903ec1a6fd33ee8707331efbc3e79feec433fbe` | Slice handoff, generated bundle/map and HTML cache version. Root must rebuild integrated source; candidate bundle is not gameplay proof. |

Both commits have no Co-Authored-By trailer. Final worktree `git status --short` is empty. Code changes are limited to `src/main.js`, `src/display.js`, new `src/world_calendar_content.js`, `src/world_calendar.js`, `src/world_weather_display.js`, and `tests/world_calendar.test.js`. Delivery paths are `docs/worlds/world-core-kit-2026-10-14/W36_SLICE.md`, `dist/bundle.js`, `dist/bundle.js.map`, `index.html`.

## Findings and save decision

| Code | Delivered / limit |
|---|---|
| W36.F1 | Home legacy numeric, MoL numeric visitor, Goa numeric and Paradise hub qualified elapsed-shift profiles are revisioned immutable content. Native definition revision1 resolves them without a new saved binding. MoL's Chariot is qualified for a source-stage opening, not adoptable as a full-year mapping of this existing independent visitor; retained legacy labels with future source-start dial documented. |
| W36.F2 | Entry/current restore and committed local midnight headers use the existing event log, safe text, focus, description, category cap, scroll/unread path. A session-only cursor deduplicates rerender. Large jumps produce one bounded interval/skipped-day summary. Header publication follows durable transactional storage and precedes new-day/local-entry messages. Legacy live home ticks retain their existing in-memory clock publication path. |
| W36.F3 | MoL/Goa words derive through W28 from active local elapsed and explicit roof shelter, labelled **climate proposal**. No borrowed sourced seasons. Paradise hub weather UNKNOWN. Home weather path, smoothing and gameplay effects unchanged. The ordinary top time field stays legacy; local date is delivered in the log. |
| W36.D1 | **No persisted fields or save-schema changes.** Native calendars/envelope validators, elapsed, deadlines/retrieval/extraction, stock, money, biography, chronicle and RNG owners unchanged. No profile migration, reanchoring or hidden-event adapter. Future source calendars, recurrence/loops and climate effects need their own adoption. |

Verified zero diff from W28 base for `src/weather.js`, `src/world_climate.js`, native MoL/Paradise adapters, `src/expansion_persistence.js` and `src/save_files.js`. This is source evidence, not a native full-envelope persistence journey.

## Exact execution results

Node `v22.23.3`. `npm ci --no-audit --no-fund`: exit0, three locked packages installed, no tracked dependency changes.

`node --test tests/world_calendar.test.js tests/world_climate.test.js`, exit0:

```text
1..14
# tests 14
# suites 0
# pass 14
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 1253.120292
```

`npm test`, exit0:

```text
1..814
# tests 814
# suites 0
# pass 814
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 13658.809333
```

`npm run build`, exit0:

```text
> build
> node build.js
Ink compiler check: mode checked, inkjs@2.4.0, storyFormat21, schemaVersion1,
storyId feature-wave-negotiation, storyRevision4, diagnostics0
  dist/bundle.js       5.0mb [size warning]
  dist/bundle.js.map  12.9mb
Done in 100ms
Javascript build complete!
Bundle and style versions in .html have been updated!
```

Full raw outputs retained locally at `/tmp/w36-focused.log`, `/tmp/w36-npm-test.log`, `/tmp/w36-build.log`. Above build excerpt compresses the unchanged compiler JSON and terminal glyphs; diagnostics/counts/size/duration/status are exact. Source/test/doc scoped whitespace checks pass. Whole generated-artifact whitespace checking reports existing minified string-content trailing spaces; no hand edit to generated strings was made. `node --check src/main.js` and `node --check src/world_calendar.js` passed.

Bundle SHA256 `185d2e3c5b5b0da641b075fe8dda89b223c6c1a88b6ad6d40fcc564e3b377841`.
Map SHA256 `c4cda74e397c509dcb1ef9dc14f20fed899de136a2a3c3142419976824bcb932`.
HTML bundle query `v0.6-185d2e3c5b5b`.

W33.T1, applicable T2 fixed custom-day subset, T3 public/unknown-date subset, T5 read-only legacy projection/JSON round-trip, T6 publication/log source contracts and W28 tests passed. W28's 5,280-input legacy unsmoothed parity sampler remains passing. T4 recurrence/reset is not applicable. Gregorian/leap/intercalary, source overlays, persisted custom-binding import and native loop tests are outside this legacy display slice, not newly required completion gates. DOM filter/scroll/unread behavior is reused in source but not exercised here.

## Root handoff and open gates

Read the committed [W36_SLICE](../../../worlds/world-core-kit-2026-10-14/W36_SLICE.md) **on the W36 branch/worktree**; it is not copied into main by this report. Its R1-R3 give exact source-derived fresh-game clicks for MoL, Paradise hub and personal Goa access. Its J1-J4 give the root journey: fresh rebuilt 1366x768 home/midnight, active-local/frozen-world date/weather, Save/reload/Export/literal-file Import and desktop keyboard/filter/scroll readability. Root must record its integrated source/build/served hashes. This worktree's built bytes have not been served or played by W36.

| Code | OPEN gate |
|---|---|
| W36.G1 | Claude root's rebuilt fresh-origin desktop J1-J4, including actual entry/midnight order, proposal-word fit and unknown hub weather. No near-midnight save fixture or accelerated dev start was invented by this lane. |
| W36.G2 | Native save/reload/export/literal-file import with old binding-free save, unchanged existing envelopes/deadlines and no replay/reward. Pure JSON tests do not close this. |
| W36.G3 | Weibao's visual/taste acceptance after root's playable journey. |

W36 source delivery is complete. Playable acceptance remains OPEN; no whole-world climate/calendar completeness is claimed.
