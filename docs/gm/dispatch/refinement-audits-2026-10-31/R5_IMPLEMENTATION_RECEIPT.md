# R5/U3 implementation receipt: rites, crafts and aids reachable from play, altar and step display, 2026-11-03

Status: implemented, below floor on two lines (see gaps). Rules: AR1-AR16, MR (making rows untouched), AD36, AD38, AD43, AD5. All kits, minutes and weights are proposals (WPR5). Agent-verified, not human-reviewed.

## Trace (grep before design)
- Producers: `LOTM_RITE_ROWS`, `LOTM_CRAFT_ROWS`, `LOTM_AID_PREPARATIONS` (source rows) and `LOTM_ACT_BINDINGS` (authored place, minutes, stock, owners, risk). `LOTM_SUMMONS_ROWS` has a different step shape (`label`/`perceived`, no `text`) and no bindings.
- Compiler: `src/lotm_act_engine.js` (`defineLotmActs`, `quoteLotmActs`, `settleLotmBacklash`). Grep of `src/` before this change: the only mentions of `lotm_act_engine` were a comment in `lotm_act_bindings.js` and a comment in `harm_engine.js:24`. No `import` anywhere in `src/`; only `tests/lotm_act_engine.test.js` loaded it. So probe 1's claim (the act engine is unimported) was correct for imports. Comments are not importers.
- State owners: step phase and done marks are actor facts (`lotm.act.<row>.phase/done`); spent stock is the native inventory; knowledge records the step report; backlash is the harm slice (`harmState()` through `book_world_lotm_harm.js`, carrier `power` of `book.lotm.tingen`).
- Consumers before: none. Rows were data. Only `LOTM_DIVINATION_ROWS` reached play, spliced in `cast_host`.
- Three defects found in the trace and fixed in my own files: (1) every row's eligibility is a bare `actor.lotm.rite.*`/`craft.*` flag that nothing in play ever writes, so wiring commands alone would leave every step greyed out; (2) the `fool-sacrifice` binding named carrier `spirit`, which `HARM_WORLDS['book.lotm.tingen']` does not have, so its backlash would throw on the last step; (3) the engine re-checked the row's means at completion, after the step's own cost had spent the kit, so the first step always refunded itself.
- `src/harm_engine.js` is unchanged. The `add` the engine needs is a new `accrueAct` in `book_world_lotm_harm.js`, next to `accrueHarm`. No Opus-level decision arose.

## Design written before coding
- Seam: act commands compiled in `cast_host.deriveCast` (resolved through pack aliases), registered in `installCast`, offered by `castActOffers`, shown by one `details` block in the existing action list. New file `src/book_world_lotm_acts_host.js` (row union, means facts, backlash collection, offer filter).
- Consumer locators: ch57 P022 (ritual structure, Hermes format) and ch60 P067 (leave-ritual altar, four candles). The rows carry zh locators only, so the match of `lotm.rite.spirit-call` to either is unverified. It is the proof rite, not a claim about those chapters.
- Failure scenarios: (a) a missing candle or wrong order must not complete as success; (b) a paused rite resumes with state intact; (c) save, reload, import mid-run loses or duplicates no offering and charges backlash once.
- Focused tests: `tests/lotm_rites.test.js` (state level), `tests/lotm_rites_live.test.js` (real bundle), `tests/lotm_act_engine.test.js` (updated).

## What changed
- Engine: optional `layout.stations` (ordered placements, each spending its own stock, e.g. four corner candles); step one runs only when the rite is idle (no restart mid-run, so no re-spend); completion no longer re-requires the means; `quoteLotmActs` marks each step done / next / later and carries the layout; new `pendingLotmBacklash`, `lotmActIdleFacts`, `resolvePlace` option. Default: fixed order. Dial left open: a free order (the caster's choice, ch104) is rejected by `problems()` until built.
- Bindings: `place` is the pack alias `lotm.place.klein-room`; each of the six bound rows has `means.kit` (held kit makes the row's flag true; a run under way keeps it); `fool-sacrifice` now spends a candle and uses carrier `power`; new binding `lotm.rite.spirit-call` (four corner candles in order, fragrance, petition, answer; risk 1.5 on `power`, a held ward cuts 0.5). Its `spirituality-cost` owner stays unbound and is reported as `owner_needed`, not faked.
- Host: `lotm_act`s join the registry, the jobs list and `cancel`; the facts supplier is spliced into the lotm domain projection beside the divination supplier; backlash is collected in `persistLotmCastPlan` (mark rides the save) and applied after the save lands; `castSyncDue`/`syncLotmCast` treat a finished, uncharged rite as due; `harmClassOf` gives `lotmAct` rites the `ritual` class (strain blocks them) and crafts `craft`.
- UI (U3): `Altar and rites` block: the altar as numbered text corners with "(set)" marks, then each step with done/next marking and one live button (the next). No new route; shown only for rites here or begun.

## Checks (one line each)
- `node --test tests/lotm_rites.test.js`: 6 pass (offers and order; missing candle never completes and charges nothing; skip and mid-run restart refused, hour-long pause resumes; save/reload mid-run keeps phase and stock, backlash 1.5 once over repeated ticks; ward cuts to 1.0; means flags follow what is held).
- `node --test tests/lotm_act_engine.test.js`: pass after updating the bound-row count (6), the fool-sacrifice candle, carrier `power` and the place resolver.
- `node --test tests/lotm_rites_live.test.js`: 1 pass, about 54 s. Disposable build from a fresh temp origin, in-process headless runner, fixture BE life. Performs `spirit-call` through the rendered buttons: only the next step is a button, Save, reload, Export and Import in the middle (candles 2, none lost or doubled), resume at the third corner, finish, backlash `power` 1.5 kept through Export and Import, no page errors, foundation save not blocked.
- Wider focused sweep `lotm_*`, `cast_*`, `harm_*`, `place_*`: see the result line at the end of this file.
- `npm run build`: ok (dist outputs restored, not committed).
- `npm run check:arch`: pass (main.js 10110, baseline 10115).
- `npm run check:rules`: 1 problem, not mine: "register says WA1-WA53, highest in docs/WORLD_ABSORPTION_RULES.md is WA68". I changed no docs under the rules register.

## Gaps (labelled)
- Desktop 1920x1080: not measured. The headless runner has an in-process DOM and no layout. The block is plain text and one button inside the existing details list; a rendered-pixels check at the target viewport is open.
- Summons rows (`lotm.summon.*`) are not bound or normalized: the whistle messenger and the candle self-summon stay data (G7, ch152). `lotm.rite.self-summon-transfer-v3` is reachable but its owner effects are empty.
- Only `spirit-call` has an altar layout. Binding more rows (ch57 P022 Hermes format, the leave-ritual oil bath at ch60 P067, `charm-making` for R8) is the next pass; each is a binding entry plus a kit.
- Not built: a pocket-watch lapse (a started rite left too long), an abandon action, free order of stations, spirituality as a step cost (the cost whitelist excludes energy, M3), and a reason text written for the player when the kit is short (it currently shows the row's own scene text).
- Bound rows' kits use stock keys no shop or exchange stocks yet (`lotm.item.ritual-candle`, `lotm.stock.quiet-fragrance`); G5 owns supplying them. In play today the lead needs them through a pack grant.
- The real private pack (`private_packs/lotm-cast/cast.json`) was not played; the alias `lotm.place.klein-room` resolves there (checked by reading), the run used a fixture pack.

## Wider sweep result
- `node --test --test-concurrency=4 tests/lotm_*.test.js tests/cast_*.test.js tests/harm_*.test.js tests/place_*.test.js`: 473 tests, 461 pass, 2 fail, rest skipped. Failures: `cast_worksheet` "rejects wrong world ... CLI enforces private roots" and `place_act_sequence` "the opening in another world does not receive the Village shower event". Both are the failures the B1 receipt already lists as not caused by its diff; I did not rerun them with my diff reverted. Neither imports a file I changed. The committer's full `npm test` is still the gate.
