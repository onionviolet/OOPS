# LP5 teacher window proposal

The player can see when the old craftsman teaches, commission a real kit that interrupts teaching, and return after that work finishes. A separate waypost story marker preserves learned routes, existing packing methods and rewards.

Try it at `http://127.0.0.1:8198/`. Meet the Village elder, investigate the disused waypost, and meet the old craftsman through the ordinary rat-field introduction. Open Notebook → Here → Village notes. Teaching runs from 08:00 to 18:00 on the saved game calendar. Notebook → People → Craftsman & workshop → Follow local people and work → Commission a kit spends two owned Rough wood logs and one coin. While that supplied order is pending, the Village notes name the override and refuse the route lesson. After the existing scheduler finishes the order, teaching returns during daily hours. Collect the actual kit through the workshop. Return the surveyor's token and take the two-coin, three-minute drainage lesson, then choose “Record the waypost account · keep learning and access.” The phase changes without a reward, reset or access loss. Only known opportunities appear in its preview.

D1. Scope and authority: authorized LP5 PROPOSAL under the 2026-10-14 lane dispatch, not director acceptance of its fiction or balance. It extends the P5 separation of clocks without implementing its term gate. Original Frontier content only. Target: 1366×768 desktop. Visible result: daily teacher hours, the current bench-order override and the independent waypost phase in existing Village notes. Mobile, terms, attendance penalties and exams are deferred. The repository has no root LP_COMMON.md; the user's supplied common rules are the dispatch authority.

## Files changed

- `src/everyday_life.js`: the existing teacher-hours fact now uses the existing recurring-window projector and one shared authored 08:00–18:00 schedule; chapter visibility is derived without creating an old-save field.
- `src/teacher_window.js`: read-only projection of daily availability, actual bench-order override, route learning, chapter and known opportunities.
- `src/village_content.js`, `src/village_ui.js`: one rewardless chapter command and status text in the existing Village panel. No new calendar, scheduler, world or progression currency.
- `tests/teacher_window.test.js`, `scripts/lp5_browser.cjs`: focused contracts and isolated browser verification.
- Rebuilt `dist/bundle.js`, `dist/bundle.js.map`, `index.html`; evidence under `lp5-evidence/`.

## Checks

V1. `npm run build`: PASS. Served bundle and source map match local rebuilt bytes exactly. Bundle SHA-256 `34bfa991908ee7ffd5257a455778376333eec6daa710eeb2ea423c48020da462`; see [build.json](lp5-evidence/build.json).

V2. `node --test tests/teacher_window.test.js tests/everyday_life.test.js`: 11/11 PASS, zero failures. Covers 07:59/08:00/17:59/18:00 boundaries and next-day recurrence, real paid commission cause, pending reload, work completion, no stock regeneration, separate chapter eligibility, retained learning/access and absent-field compatibility.

V3. `npm test`: final-source run 1,398 tests, 1,395 PASS, zero failures, zero skipped, three pre-existing RNG TODOs (combat, local-life search/contact, and encounter/loot/craft/market/gather). The initial complete run had the same counts. No unrelated failures were found or repaired.

V4. `node scripts/lp5_browser.cjs`: PASS on rebuilt `http://127.0.0.1:8198/`, fresh isolated browser contexts, 1366×768. [result.json](lp5-evidence/result.json) records all 13 checks and fixture boundaries. Zero page errors. Native UI discovery, normal teaching, actual two-log/one-coin commission, refusal, scheduler restoration, kit collection, actual two-coin lesson, chapter advance, and 18:00 closure were exercised. Pending-order, pending-lesson and completed-chapter Save/reload/Export/literal file Import passed with exact player facts, methods, money and inventory comparisons. No duplicated kit, token return or tuition reward appeared. Screenshots [normal](lp5-evidence/01-normal-window.png), [override](lp5-evidence/02-real-order-override.png), [restored](lp5-evidence/03-restored-window.png), [chapter](lp5-evidence/04-story-retains-learning.png), [daily close](lp5-evidence/05-daily-close-independent.png). Normal, override, chapter and closure images were visually inspected.

V5. Source/docs/harness `git diff --check`: PASS. Generated esbuild bundle retains whitespace inside minified source strings; the unrestricted diff check reports that generated line, with no source whitespace defects.

## Compatibility decision

D2. No schema version change or migration. `expansion.actors.player.facts['village.waypostChapterClosed']` is optional and absent from old saves. Absence projects “Following the waypost”; rendering writes nothing. Only the explicit rewardless chapter command creates it. Its existing action completion receipt prevents replay. Existing lesson acquisition, provenance, reward receipts, pending orders, inventory and calendar retain their existing owners and formats. No retroactive chapter completion, stocked kit or reward is invented. No offline policy changed.

## Limits and integration

R1. The teacher override uses actual existing `work.order` / `field.partsOrder` and scheduler occupation, not a new quest timer. Its restoration follows the existing work completion. An order ending after 18:00 restores freedom from the order but teaching waits for the next daily opening. No missed-class penalty or reward backpay exists.

R2. Merge risk against `codex/gameplay-foundations` and siblings: small overlapping edits in `everyday_life.js`, `village_content.js` and `village_ui.js`, plus generated bundle/index conflicts. Preserve sibling action arrays and panel additions, then rebuild generated artifacts on the combined source. No edit to main.js, save schema, top-level layout shell or shared simulation command definitions. This lane was not merged with sibling LP1; its teaching proof uses the incumbent drainage lesson and its real route consumer.

Implemented-unverified limits: no additional LP5 behavior remains unexercised at its selected acceptance scope. The full rat-field introduction was not replayed in this lane: after native waypost discovery, the browser fixture unlocks craftsman availability and supplies four ordinary logs and 30 coins. The greeting, orders, lesson and chapter then use real UI commands. For daily closure, a second isolated context loads the earned final profile at 17:59 and observes the native tick to 18:00. Next-day recurrence is source-tested rather than waited overnight in the browser. Broader sibling integration and deferred term/mobile work are outside this slice.

Remaining gate: Weibao's play and taste acceptance. This report records a reversible proposal, not an accepted school or term design.
