# P05 / p23-reread, 2026-10-14

**Status: source module implemented; native loop IMPLEMENTED-UNVERIFIED. Not eligible for final gameplay merge.** P00 host joins and wave-1 reading/view integration remain OPEN. Proposed balance and story taste are not director-accepted.

## Authority and ownership

Base verified `0216ccdefcfce79877378f8cb0ee41129fe11c5d`, branch `absorb-all/p23-reread`, initially clean. Worktree `/Users/weiwei/code/yair-absorb-all-20261014/p23-reread`; node_modules symlink preserved. Reservation comes from coordinator assignment, verified against matching branch/worktree, no listener on 18824 before starting own server, and live `runs/SESSIONS.md` wave-2 session `01a138b8-9f01-7252-9d17-87659e874eb9`. Session table initially lacked wave 2, then landed during work. No other worker/file area touched. No delegation, game writes in main checkout, merge or push.

Read COMMON, AGENTS, PROJECT, USER_VISION, LIFE_SIM_NORTH_STAR and current native Book/BookData/reading, book catalogue/care, furniture collection, activities/calendar/backlog-time owners. Standing desktop priority remains 1366×768, mobile deferred. North-star proposals do not supersede accepted direction. Input is p23-reaudit ledger; original/audit ledger unchanged. Pinned HTML SHA256 `a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5` matches its ledger. Relevant R1–R5 and M reader mechanisms reviewed, including R2 reading and R5 slumber replay. No Proto23/mod code, prose or assets copied. Existing d49cb911/379007d7 UI features not redone.

## Row dispositions

| Row | Disposition | Landing / limit |
| --- | --- | --- |
| R26 | adapted as original source module; native OPEN | `src/absorb_p23/reading/content.js`, `runtime.js`, `presentation.js`: original anthology, saved uint32 draw, 12–24 progress-unit reads, 8–16 Literacy XP settlement, four original stories, Stop/Resume, distinct per-event receipts, repeatable without lifetime cap. Native acquisition/XP/discovery/save joins await P00. |
| R48 | preserve native equivalent; earned-rest extension source implemented | Existing native Sleeping recovery/time compression and shift settlement remain untouched. New rest emits no completion XP/vitals and never loops combat ticks. Native activity/calendar evidence OPEN. |
| N17 | existing equivalent adopted by source verification, no new store | `src/absorb_b/furniture.js` already exposes distinct finished-and-owned collection in Here presentation. Focused tests confirm copies do not multiply, unfinished/lost/borrowed books do not count. Anthology must stay physically owned and native finished after first read; no BookData reset on reread. Native new-book collection gate OPEN. |
| N21 | adapted as original source module; native OPEN | Earn Sleeping level 5 and prepare Packed long-rest meal with two Stale bread + two Cooking herbs via Cooking level 1, four-minute native preparation (registration request only). Rest admission plans consumption of one owned meal, then at most five accepted played minutes per asynchronous update to 1080 total. Cancel keeps meal consumed; repeat requires another actual meal. Native paid acquisition/consumption/calendar/save gate OPEN. |

## Delivered source and compatibility

[Exact P00 request](/Users/weiwei/code/yair-absorb-all-20261014/p23-reread/src/absorb_p23/reading/HOST_CONTRACT.md) is in the **lane worktree**, not main checkout. Absolute path: `/Users/weiwei/code/yair-absorb-all-20261014/p23-reread/src/absorb_p23/reading/HOST_CONTRACT.md`. Read that contract for signatures/context/native effects/preflight and every required journey. Only new feature files and `tests/p23-reread.test.js` changed; existing book-care files are untouched.

Optional proposed `expansion.p23Reading` schema1 remains absent for old saves. No implicit enrollment during render/load. Explicit null, unknown schema/extra fields, changed draw, impossible event/progress/clock data reject before mutation. Plans clone inputs; event settlement effects emit once from transition, never by receipt replay. P00 must publish state, RNG, costs, XP, BookData and accepted native clock atomically through existing durable owner. A source planner does not itself prove those native writes. `p23.reading:<eventId>` is the publication identity. Existing normal books and saves keep their behavior.

Live clock, custody, native living body, safe location and occupation eligibility are host projections, not saved permission flags. Read speed is a host input from reveal-chain; no competing Literacy formula. Pending Stop/Resume keeps draw/progress and discards paused intervals. Rest batches cannot overshoot or replay 1080 ticks. Calendar is native Game_Time, not this module. Known-only view reveals actual settled stories; no sealed world secrets or effects/animations are introduced. Effects-off native master switch remains P00's integration gate.

## Checks

Checks live in lane `docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-reread/`.

- Focused final `node --test tests/p23-reread*.test.js`: 13 tests, 13 pass, 0 fail, 0 skip. Covers distinct rereads, settlement replay, paused/pending/completed JSON restore, bad schema/draw/clock, native collection ownership, earned-rest controls/cost instruction/cancel, partial batches and 18-hour native Game_Time year rollover. These are SOURCE checks, not paid native item or save-file gameplay.
- `npm run build`: exit0. New module intentionally absent from main bundle until P00 hooks. Build-generated dist map excluded from commits; no dist publication.
- `npm test`: **634 tests, 633 pass, 1 fail, 0 skipped**, 482088.442917 ms. Failure: `equipped native brace with an open road offer keeps ticking, travelling and reloading` at `tests/alloy_equipment.test.js:118`; child `fixture/generate.mjs --equipped-clock` exceeded its 60000ms bound (observed 60190.166708ms). No lane code is imported by this test or its native bundle. Full run began before the final small occupation-clearance refinement; final 13/13 focused checks cover that refinement. Specific isolated reproduction `node --test --test-name-pattern='equipped native brace' tests/alloy_equipment.test.js`: **1/1 pass**, 18141.124375ms total, 16591.252666ms test. This supports a load-related timeout, not a proven deterministic regression; it does not replace the failing full-run result. No full-pass claim.
- Fresh-origin headless Chrome through Playwright, 1366×768, port18824: baseline Village passes, zero page errors; browser direct-module SOURCE smoke preserves pending/completed JSON and replay emits zero effects. Browser binary default missing on first launch, switched to installed Chrome channel; successful run is recorded in browser.json. No use of signed-in browser or user saves.
- Built/served bundle SHA256 `598e02f54fe7db4c9a35bc79c75a754a7f8dc42eccf9fab828de8fd82e97b615`, 5,100,591 bytes, exact match. Map confirms feature not linked. This is truthful baseline evidence, **not changed native loop evidence**.
- Save/reload/export/literal-file import of the changed native families: NOT RUN, P00 dependency. JSON roundtrip is explicitly not a substitute.

## Commits and merge risks

`921fe053407769de0bf0f0c23c579d218c6c36f8` adds module, 13 tests and exact host contract. `cc25972dcaf967ccc23ffa29c6fde1e524ef983e` adds live ongoing occupation clearance; final focused slice passes. Check artifacts and report/ledger accompany the separate task-only evidence commit. No Co-Authored-By trailers. Only task paths staged; generated dist left unstaged.

Wave-1 reveal-chain owns reading speed/view; its report has not landed at the last check. Do not wait to build modules, but do not join or overwrite its shared reading hooks. P00 launches after wave1 merges and owns ALL main/display/items/skills/activities/calendar/save/workspace edits. Book-care lane reservations cause no runtime conflicts because those files are unchanged. P18 background reading concurrence must use supported live availability/rate projection, not bypass it. Long-rest occupation must respect existing backlog time seals and native clock/death/manual-choice pauses.

## Acceptance backlog

Native purchase + two anthology reads + useful Literacy/story payoff; stopped-read exact native save/restore; finished native collection; earned meal preparation + actual consumption + cancelled and completed rest + calendar; schema preflight/no-mutation failure; pending/paused/finished/cancelled exact Save/reload/export/literal import; effects-off and desktop presentation remain **OPEN** for P00's integrated candidate. Coordinator may assemble the candidate stack but must not final-merge as verified gameplay before those gates and full suite pass. After technical native gates, the separate authoritative acceptance is Weibao play/taste.

Disposable browser contexts and the lane HTTP server are closed after evidence capture. No persistent user profile or save was read. The only unstaged tracked change is the build-generated dist/bundle.js.map; it is not committed. No native integration candidate exists yet.
