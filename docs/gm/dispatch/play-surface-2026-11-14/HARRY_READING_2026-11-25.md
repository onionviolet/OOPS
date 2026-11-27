# Harry's library reading in the school day

| Preflight | Scope |
| --- | --- |
| Reading and authority | Extend the existing Harry day with a consequential interaction using existing reading. AD38, AD43 and AD52; desktop first. |
| Player sentence and voice | “You read how the charm is built and what you saw in class makes sense”. Reading can improve the motion used by actual casts; copied notes do not grant personal understanding. |
| Ordinary route and choice | Attend Charms and try the feather twice. Spend three one-hour library sessions understanding the motion, or keep practising immediately at one stamina a try. The existing inquiry requires both reading time and class evidence. |
| Fit and mechanism | Existing inquiry@1 writes understood knowledge. The same existing +10 percentage-point study bonus now feeds actual Levitation cast facts, as it already feeds class attempts. No new timer, mastery counter or saved key. |
| Ring and compatibility | Producer, cast consumer, failure, existing saved knowledge and UI. Existing saves retain all records. The bonus applies on read, including already completed studies. |
| Screen and elements | Great Hall place service, 1920×1080. Move the existing Charms study control beside feather practice; retain Potions in Library study. Reading row shows cost, progress, lead, blocked reason, completed understanding and optional note control. Mobile, new library location and new topics are outside this slice. |
| Files and seam | HP-specific spell facts, school-day UI/recap, library study leaf, lesson re-export, focused tests. Existing structured casts and inquiry transactions remain the owners. No shared engine changes. |
| Rules | AR2–AR8, AR10–AR14; UR70–UR75, UR100–UR127, UR158, UR163; PRS4–PRS7, PRS10–PRS11. [Architecture](../../../ARCHITECTURE_RULES.md), [UI](../../../UI_RULES.md), [prose](../../../PROSE_RULES.md). |
| Failure scenario | A copied note must not improve casts; reading must not add practice, yield negative weights, or bypass silent-casting fluency. Quote and executor must agree. Focused spell-cast, lesson and school-day tests. |

## Receipt

| Line | Evidence and result |
| --- | --- |
| FLR1 Build | Isolated `BUILD_OUT` plus `npm run build` passed. Bundle SHA-256 `01b8cbb3b1a4239169f26da914db98ed2793dd362a5c5b7533608bb6c818fd7a`. Existing duplicate-key warnings in layout/travel remain. |
| FLR2 Route | Composed `hp-term-jinx` fixture, rebuilt installed Chrome headless, fresh storage, desktop 1920x1080. Attended Charms, cast twice, read three sessions and cast again. Setup supplies school arrival, Sorting and term time. |
| FLR3 Shown | [Before](../../../representations/evidence/harry-reading-2026-11-25/before.jpg): one-hour study beside paid feather practice. [Understood](../../../representations/evidence/harry-reading-2026-11-25/understood.jpg): completed study, recap and improved 70% quote with the same two tries. |
| FLR4 Used | Two feather tries gave 60%; 180 minutes of inquiry work raised it to 70% without adding mastery. The following paid cast raised it to 80%. Outcome weights consume the same chance fact as the quote. Passing and board facts share the adjustment; the existing board base failure is already zero, so the board gains no further percentage points. |
| FLR5 Kept | Save button, reload, Export button, file Import into a fresh browser context passed. Deep comparison preserved the power, understood knowledge and inquiry slice. [Imported](../../../representations/evidence/harry-reading-2026-11-25/imported.jpg), [result](../../../representations/evidence/harry-reading-2026-11-25/result.json). Exported save removed after comparison. |
| FLR6 Labelled | Agent-verified on a composed fixture, not human-reviewed. Zero page errors. Import wait follows restored knowledge. |
| Change surface | HP source/UI, one study leaf with compatibility re-exports, focused tests. Core-owner changes, new cycles and registration lines: zero. No new saved fields. |
| Focused checks | `node --test tests/inquiry_book_lives.test.js tests/spell_cast_lowering.test.js tests/hp_lead_day.test.js tests/hp_lessons.test.js`: 33 passed. Copied-note distinction, no invented mastery, clamped weights, quote and silent-casting fluency protected. |
| Architecture | `npm run check:arch` passed against existing baseline. |
| Rules/docs | `check:rules` stops at nine pre-existing missing macOS tool-document links on Windows. Player-text scan has no findings in the added strings; aggregate vocabulary/path baseline findings remain. `check:docs` reported two absolute-word findings in the concurrent Windows-build receipt, none here. Scoped `git diff --check` passed. |
| Replay/cleanup | `node tests/hp_reading_browser.cjs <build-root> <hp-term-jinx.json> <evidence-dir>`. Browser assertions passed; Windows teardown hung after success, so the lane stopped its own proof Node PID and its child exited. Cited build kept at `C:/Users/wayba/AppData/Local/Temp/oops-harry-reading-20261125` for integration replay. |
| Not covered | Full suite and aggregate flow belong to the coordinating batch. New topics, a separate library location, NPC routines and mobile layout are outside this slice. |
