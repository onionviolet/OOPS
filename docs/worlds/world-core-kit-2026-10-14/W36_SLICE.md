# W36: calendar and climate display slice

## CHECKPOINT

2026-10-14. Source implemented and tests/build passed on `kit/w36-calendar-climate`, worktree `/Users/weiwei/code/yairpg-w36-calendar-climate`, from W28 `024d4da9`. Authority: Weibao's same-day approval to integrate W28 climate and W33 calendar as one visible slice. Claude root owns integration and rebuilt desktop acceptance. **IMPLEMENTED_UNVERIFIED in browser**. No merge, push or browser journey by W36. Target **1366x768 desktop**, normal text size and Workspace log. Mobile deferred. This lane does not change standing direction.

## Changed behavior and files

| Code | File | Result |
|---|---|---|
| W36.F1 | `src/world_calendar_content.js` | Four immutable revision-1 content profiles. Home uses existing 999/month4/08:00 anchor and numeric vocabulary. MoL visitor and Goa retain year1/month1/06:00 arithmetic. Hub uses the same internal legacy arithmetic with qualified local elapsed shift wording, no claimed civil epoch. Native immutable definition revision 1 selects each visitor binding. Future revisions must retain these definitions rather than silently replace them. |
| W36.F2 | `src/world_calendar.js` | Pure fixed-month projector, formatter, normalized light adapter, active-instance reader and session-only log cursor. No wall time, RNG draw or new clock. Unknown or unsupported world/profile is unavailable, never silently home. Public projection contains declared date fields only; no event graph, hidden dates or overlays. |
| W36.F3 | `src/main.js`, `src/display.js` | Fresh startup and world entry use the existing event log. Transactional headers follow successful durable storage, before local-life/new-world messages. Exact midnight belongs to the new day. Legacy live home ticks emit after their existing in-memory calendar advance, before downstream day consequences. Restore emits one current contextual header after successful load; no history replay. Rerender/filter changes cannot emit. Log limits, follow/unread and category settings use the existing path. Header is safe text, keyboard-focusable, with qualified title/accessibility description. |
| W36.F4 | `src/world_weather_display.js`, `src/display.js` | MoL/Goa weather words call W28 with the same active instance projection, explicit place shelter and revision-1 **climate proposal** profiles. No sourced seasonal curve: `seasons:null`. Stable unseeded legacy cycles need no new seed owner. Roof places show Sheltered; outdoor places show Dry/Rain/Snow and °C. Physical daylight uses W28's legacy 20:00 boundary, a proposal for visitors; descriptive home Night stays at 21:00. Hub reads “Weather unknown · Paradise hub”. Home returns to its original weather display, smoothing and effects. |
| W36.F5 | `tests/world_calendar.test.js` | Seven new source tests, including real host storage-publication code in a VM. Existing W28 seven tests retained. |

The existing top time field remains the legacy Game_Time field; the new **local date is in the log**. Home `weather.js` and `world_climate.js` are unchanged. Existing weather gameplay readers remain unchanged even where display words now differ. This delivery proves no new climate effects, forecasts, sky, moon, schedules or away settlement.

## Save decision and source-name dial

**W36.D1: none persisted.** No envelope, validator, campaign definition, metadata `calendar`, elapsed, deadline, retrieval window, extraction, stock, money, biography, chronicle or RNG schema is changed. Binding is transient content resolution from the existing immutable native definition revision and active visit/instance clock. Optional worlds remain absent until enrolled. Home reads its committed numeric fields, including existing `day_count`; it never rewrites legacy accounting axes. Hub/Goa remain distinct instances, with no invented parent link.

**W36.D2:** W33.M1-M8 default compatibility is retained. W34.ML1/ML4/P-ML and W30.ML-C3 qualify Chariot for a source-stage opening, but do not establish a full-year mapping or adoption into this independent forward visitor. Keep numeric visitor labels. A later selected source start can adopt Chariot with its own precision/anchor and compatibility decision. No loop, recurrence, Gregorian calendar, leap/intercalary algorithm or source overlay is introduced here. A persisted binding was not needed.

**W36.D3:** A direct one-day advance emits one new header. Multi-day publication emits one bounded header with old/new dates and an explicit intervening skipped-day count. It does not synthesize attendance or one log row per skipped day. Current host messages are not a day-grouped event ledger; introducing that grouping belongs to the scheduler owner. The climate adapter uses legacy `day_count` as its daily cycle coordinate, preserving native epoch day1 and W28 parity.

## Checks run

Node v22.23.3; worktree-local `npm ci --no-audit --no-fund` installed three locked packages, no dependency changes. Source/test whitespace check passes. Generated bundle whitespace is emitted by the existing minifier/string content; no authored whitespace error remains.

| Code | Command | Exact final result |
|---|---|---|
| W36.T1 | `node --test tests/world_calendar.test.js tests/world_climate.test.js` | exit 0; 14 tests, 14 pass, 0 fail/cancelled/skipped/todo; duration_ms 1253.120292 |
| W36.T2 | `npm test` | exit 0; 814 tests, 814 pass, 0 fail/cancelled/skipped/todo; duration_ms 13658.809333 |
| W36.T3 | `npm run build` | exit 0; Ink check diagnostics 0; bundle 5.0mb, map 12.9mb; esbuild Done in 100ms; Javascript build complete; HTML bundle/style versions updated |

W33.T1 covered: frozen-input/equal-call parity, 06:00 epoch, 23:59/midnight, month/year, safe overflow, units/algorithm rejection and native Game_Time weekday parity. T2 applicable fixed custom-month/27-hour-day subset covered; Gregorian/leap/intercalary algorithms deferred. T3 unknown hub civil date and undeclared hidden-field omission covered; source alternatives/overlays deferred. T4 not applicable: no recurrence/reset consumer introduced. T5 read-only legacy binding and JSON round-trip covered; actual native Save/reload/Export/literal-file Import stays OPEN. T6 entry/midnight/rerender/reentry/reset, bounded jumps and failed storage covered at source seam; actual browser scroll/filter/unread/focus remains OPEN. W28's unchanged sampled 5,280-input parity test passes; this does not prove smoothed browser output. No source/test claim is browser acceptance.

Built candidate bundle SHA256: `185d2e3c5b5b0da641b075fe8dda89b223c6c1a88b6ad6d40fcc564e3b377841`.
Map SHA256: `c4cda74e397c509dcb1ef9dc14f20fed899de136a2a3c3142419976824bcb932`.
HTML query: `dist/bundle.js?version=v0.6-185d2e3c5b5b`. Root must rebuild after integration and record its own served-byte identity.

## Source-derived fresh-game routes

These exact labels are read from code, **not clicked by W36**. Use separate disposable fresh origins for each world if desired; preserve real user saves. Choose the default retained human beginning, complete character creation and PLAY. In Village use **Talk to someone → village elder → Hello?**, then leave the conversation. `metVillageElder()` checks completion/locking of this hello. Open **Notebook → Here → Tools, practice & local lives** (expand the details panel as needed).

| Code | World | Click sequence in that panel |
|---|---|---|
| W36.R1 | MoL | Expand **Mother of Learning · your Cyoria guest life** → **Read Cyoria retained-body guest terms** → **Choose independent Cyoria guest entry** → **Enter your retained Cyoria visitor instance**. Arrival is `Cyoria visitor arrival`. **Return to Village in your own body and cargo** returns; use the same Enter label to revisit. Finish/cancel any local work first. |
| W36.R2 | Paradise hub | Expand **Paradise · your independent Goa branch** → **Read the parallel-entry body, cargo and source terms** → **Choose independent Paradise entry** → **Enter the independent contractor district**. Arrival is `Paradise independent-contractor desk`. |
| W36.R3 | Goa without survey deadline | From that contractor desk choose **Visit the first-Goa branch on your own account**. Arrival is `Goa Gray Terminal`. Use **Return from your personal Goa visit** to the hub, then **Return to Village in your retained body** at the contractor desk. No survey obligation is needed to inspect weather. |

If a section is not visible, verify actual human/native-alive state, idle work, Village location and completed elder hello; record a blocked route instead of fabricating enrollment via direct state mutation. No new dev-start route is added.

## Root desktop journey, W33.J1-J4

1. **W33.J1 OPEN:** Rebuild integrated source and serve a fresh isolated origin at **1366x768**. Record branch/commit, bundle/map SHA and fetched bytes. Start home; capture exactly one `[ Home · ... ]` header and unchanged normal-time/weather display. Reach a near-midnight time through supported play, or use a disposable fixture via the existing validated literal-file import route; retain its exact fixture and validation receipt. The fixture must preserve legacy biography/chronicle/native owner consistency. Cross midnight with actual supported play, count one new date header before the first new-day consequence. W36 supplies no near-midnight save and claims no accelerated clock route. |
2. **W33.J2 OPEN:** Follow R1-R3; capture local entry header and proposal weather words, and hub UNKNOWN words. Record active instance elapsed and native legacy calendar. Cross each local midnight through supported play or separately validated disposable near-midnight fixtures. Leave/reenter a frozen instance after actual home passage; compare retained local date/weather before advancing it again. Keep local retrieval/survey/extraction fixtures under their existing validators; compare deadline behavior separately if using a contract. Personal Goa access does not prove contract correctness.
3. **W33.J3 OPEN:** Save/reload, Export and literal-file Import on a separate disposable origin, including a pre-W36 save with no calendar binding. Compare existing full envelope owners, elapsed, calendar, deadlines, biography and chronicle. Each successful restore produces one current header with no rewards/history replay. Confirm optional worlds stay absent in an unenrolled save. Missing persisted-profile import is not applicable because no such field was introduced.
4. **W33.J4 OPEN:** Focus the header by keyboard and inspect its title/accessible description. Toggle the Events category off/on and rerender panels; no extra header. Scroll upward, cross a boundary and verify unread/follow behavior through the existing settings. Confirm long qualified hub/proposal wording is readable at 1366x768 and no undiscovered/future dates appear. Capture screenshot/receipts. Human taste acceptance stays separate.

No browser script or fixture is supplied. Remaining authoritative gate: Claude root's rebuilt fresh-origin desktop J1-J4, followed by Weibao's taste acceptance. No mobile gate substitutes for it.
