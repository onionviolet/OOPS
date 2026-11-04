# R6 implementation receipt: reading sealed records on earned clearance, 2026-11-04

Status: **implemented, below floor** (registered, shown and browser-proven on a synthetic fixture; earned route and real-pack persistence not exercised). Agent-verified, not human-reviewed (AD43). Rules: AR1-AR16, AD38, AD43, WPR5. Target viewport for the later UI: 1920x1080, mobile deferred.

## Why R6, not R5/G5
After KJ3AC (ch64 P088) the earliest unsupported action in MECHANISM_BACKLOG is R6 at ch65 P052 (the clearance stop at Sequence 7). The pack's kjw20 window (`kj3ad`) covers it with fact flags only (`clearance.stops.at.seven`, `neil.refuses.clearance.too.low`), the fact-only substitute. R5's next uses are later: R8 at ch69 P014, the ritual set pieces at ch85-86, G5 shopping at ch101 P056. R5's own consumers (ch57 P022, ch60 P067) precede KJ3AC. R5/G5 stays queued, with the same gap noted in the R5 receipt (kit stock still granted).

## What changed
- `src/lotm_records.js` (new): pure compiler `defineLotmRecords` like the act engine. A stack of pages becomes commands: fetch (the custodian goes to the archive, 10 min), one read per page (minutes, `once`), an optional link (deduction) and return. `quoteLotmRecords` is the read model.
- `src/lotm_records_rows.js` (new): the ch65-66 stack (six pages, one link) and the production binding (Old Neil, `lotm.place.armory`, grant fact `book.lotm.kj3ad.dunn.note.shown.neil`).
- `src/book_world_lotm_clearance.js`: added `LOTM_RECORDS_CLEARANCE` (grades 7, 6, 5 by Sequence; `clearance.js` untouched). Level is derived from earned grant facts (`levelFrom`), never set.
- `tests/lotm_records.test.js` (new, 7 tests).
- Not touched: `harm_engine.js`, `main.js`, `native_tool_domains.js`, registration, persistence envelopes, UI files, the private pack.

## Mechanism (earned inputs, real spend)
- Means earned: Dunn's note shown to Neil (grant fact), Neil fetching the stack (time), the lead in the armory with Neil present. Without the note nothing runs and no time passes.
- Spend: fetch 10 min; pages 15-25 min (proposals, WPR5). No stock is spent and the quote says so.
- Consequence: pages become knowledge; `tris-instigator` (needs the Instigator page and the lead's own outside lead) sets a retained conclusion fact.
- Refusals: Sequence 6 and the Cathedral folder show the table's line (vague line when the rule is unknown); no time charged.
- Support loss: custodian away, lead out of the room, stack handed back, or note gone each block reading; pages already read stay read.

## Checks (one line each)
- `node --test tests/lotm_records.test.js`: 7 pass (compile and unbound, no-note, fetch and read, clearance stop, support loss, link, JSON round trip).
- `node --test tests/lotm_clearance.test.js tests/lotm_act_engine.test.js`: pass (17 with the above).
- `npm run check:arch`: pass (main.js 10108, baseline 10115).
- Not run: `npm run build`, `check:rules`, full `npm test`, browser, MCP walk, save/Export/Import in a real app.

## AD43 floor
FLR1 build: not claimed. FLR2 route: **open** (state-level fixture; real route needs registration and pack rebinding). FLR3 shown: **open** (quote contract below; no UI). FLR4 used: partial (the link fact and page knowledge exist; no later `requires` reads them yet). FLR5 kept: fact and knowledge round trip only; no persistence change, so no schema or envelope edit. FLR6: implemented, below floor; fixture route; agent-verified.

## Contract for the UI lane (P3)
`quoteLotmRecords(commands,preview,{actorFacts,facts,known})` rows: `{id,rowId,kind:'fetch'|'page'|'link'|'return',pageId,label,duration,costText,status:'read'|'ready'|'needs-stack'|'withheld'|'blocked',eligible,reasons[],seq?}`. Pass `facts` (simulation facts) so reasons are per unmet condition. `known:false` shows the vague clearance line. Show withheld pages greyed with their reason beside the ready ones.

## Proposed shared hunks (not applied)
1. Registration: compile `defineLotmRecords(LOTM_RECORD_ROWS,LOTM_RECORD_BINDINGS,{worldId:I.world,group:'book_lotm',situationId:I.situation,resolvePlace})` in the cast host beside `defineActs` and register the commands like `lotm_act`s; offer them with `quoteLotmRecords` only at the armory.
2. Pack rebinding (content lane owns `cast.json`; a kjw20 run was live): in `kj3ad.fetch`, `seer`, `sailor`, `savant`, `pathways`, `instigator`, `theosophy` and `demoness`, replace the fact-only effects with `requires` on `lotm.records.read.<page>` and drop `clearance.stops.at.seven` and `neil.refuses...` as authored facts (they become the refusal).
3. Link evidence: `tris-instigator` is bound to `book.lotm.kj3ac.thread.beyonder.records.open` as a placeholder; point it at the actual Alfalfa-case knowledge fact.

## Remaining gaps
Registration and UI; pack rebinding; real consumer of the links; a captain grant route (Sequence 6 stays shut); other archives (Cathedral); R6 for the original Tingen seat (role from `playerRole`) is not wired. R5/G5 (real supply route for kit) is next after this.


## Integration round (2026-11-04, integrator)
Changed: `src/book_world_lotm_records_host.js` (new: bind and quote at the armory), `src/book_world_lotm_cast_host.js` (define, offer, install; hunks only), `src/book_world_lotm_host.js` (offers into the view as `sealedRecords`, job and cancel lists; hunks beside another session's edits), `src/book_world_lotm_state.js` (job lists), `src/book_world_lotm_ui.js` ("Sealed records" block, hunk), `src/lotm_records_rows.js` (binding fixed, link evidence), `tests/lotm_records_browser.mjs` (new).
- Binding bug found and fixed: the custodian id and the place `lotm.place.armory` did not exist in the current pack (the custodian id was Dunn Smith's; the armory has no alias). Now Old Neil by index id `lotm.person.old-neil` (resolved by the host) and the pack's Armory anteroom id. A pack that lacks either skips R6 instead of failing install (a fixture pack made the first build throw).
- Link evidence now `book.lotm.kj3ac.tris.suspected.instigator` (real actor fact set at ch64; the link's own conclusion is a different fact, so not circular). `thread.beyonder.records.open` was a thread marker.
- kj3ad rebinding: the acts live only in the gitignored private pack, so NOT applied. Proposal: in `kj3ad.fetch`, `seer`, `sailor`, `savant`, `pathways`, `instigator`, `theosophy`, `demoness` drop the fact-only effects (and `clearance.stops.at.seven`, `neil.refuses.clearance.too.low`) and add `requires` on `lotm.records.read.<page>`. Until then the pack acts and the R6 commands both offer the same reading; the pack acts remain the fact-only substitute. The earning act is `kj3ad.armory` (sets `dunn.note.shown.neil`).
- Display: the block lists status, time, cost line and reason per page; withheld pages sit greyed with the table's line. Known gaps: labels repeat a long prefix and disabled rows repeat the reason; `known` is always true.

## Checks, integration round (one line each)
- `node tests/lotm_records_browser.mjs .lane-builds/r6 .lane-builds/r6/proof` (bundle be3fe0500bd2, 1920x1080, headless): 14 PASS. Note shown, fetch (10 min), Seer page read once, Sequence 6 page refused with reason and disabled, save, reload and Import retain the read page, no browser errors.
- `node --test tests/lotm_records.test.js tests/lotm_clearance.test.js tests/lotm_act_engine.test.js tests/book_world_lotm_cast.test.js`: 21 pass.
- `tests/conversation_knowledge_browser.mjs` on the same build: pass (no regression to cast install).
- `npm run check:arch`: pass (main.js 10108). `npm run check:rules`: pass.
- Not run: full `npm test`.

## AD43 floor, integration round
FLR1 build: r6 bundle be3fe0500bd2. FLR2 route: **fixture** (synthetic cast with the real armory and Old Neil ids; the note is earned by one click). The real earned route (kj3ad.armory) and the real private pack were not walked: with the 5 MB pack a reload or Import of a BE life fails in headless runs on the old build too (`foundation-integration`), a separate gap. FLR3 shown: done at 1920x1080. FLR4 used: partial (read facts exist; the pack `requires` rebinding is the consumer, proposed above). FLR5 kept: save, reload, Export, Import proven on the fixture only. FLR6: implemented, below floor; fixture route; agent-verified, not human-reviewed.
