# C1, G3, G4 implementation receipt: client money, pay lines, staged commissions

2026-11-03. Branch `claude/dreamy-archimedes-5ffaf9`. **Implemented, below the AD43 floor** (no native lotm_slice run; see Gaps). Agent-verified, not human-reviewed. Rules: ECC25, ECR16, ECX6, AR1-AR16, AD48. Built on R2: R2 was not on master, so branch `claude/mech-r2-halfpence-d3357b` was merged into this worktree branch (one conflict, the backlog table, resolved by keeping both rows).

## Before coding

| Item | Answer |
| --- | --- |
| Seam | `src/book_world_lotm_be_clients.js` (C1, registry); new leaf `src/book_world_lotm_pay.js` (G3, G4). Facts wired by one line each in `book_world_lotm_actions.js` (`payFacts`) and `book_world_lotm_state.js` (`payAssertions`). Money moves only as the existing native `money` effect into the one purse (R2 grain); no new purse, counter or ledger |
| Consumers | C1: ch55 P067 (one soli = 12 pence), ch56 P036-P038 (penny and two halfpence), ch62 P046-P047 (Glacis, eight pence posted), ch63 (Joyce, one soli). G3: ch106 P020, ch115 P067, ch106 P018, ch128 P062. G4: ch106 P069-P076, ch115-118, ch128 P033 |
| Failure scenarios | a stage pays once across save/reload; an unknown fee or stage invents no figure; no money in two ledgers; Anna lands on +10 net (797 path); insufficient purse refuses and records nothing; a save naming a client the pack has not registered yet still validates and shows |
| Tests | `tests/lotm_be_clients.test.js`, `tests/lotm_pay.test.js`, `tests/lotm_money_save.test.js` |

## What changed

- **C1.** `BE_CLIENTS` is now a registry (`registerBeClient`, duplicate with different terms throws). A quote is `{amount, currency (pence|soli|pound), basis, houseCut, tip, settle}`; soli and pound are denominations of the one purse, not exchange pairs. Cut uses R2 `roundToGrain` at the Tingen grain (not `Math.floor`). `settle:'later'` pays gross at the session and `clientSettleEffects` pays the club eighth plus tip once (gate `clientSettleRequires`, derived fact `lotm.be.client.<id>.owed`). Anna: 12 pence, cut 1.5, tip 0.5, so +12 then -2. Glacis (8 pence listed) and Joyce (one soli) registered. Facts, view and assertions iterate registered ids plus ids found in the save, so load order cannot drop a client.
- **G3.** `registerPayLine({id,label,payer,kind,steps:[{fromWeek,amount,currency,basis,floor?}]})`. `payCollectEffects(id,{week})` is one money effect and sets `paid` to that week (a set, not an increment), gated by `payCollectRequires` (started, paid = week-1, `weeks` >= week; weeks derive from the start note's `.at`, as `weeksOwed` does). A week with no stated step throws.
- **G4.** `registerCommission({id,label,patron,total?,lead?,stages})`. `commissionStageEffects` spends once, in order; a stage with `amount:null` needs `{pay}` with a basis at pay time (the ten-pound total is bounded, its split is not invented). Lead time gates `commissionDeliverRequires` via derived `ready`. `payView` lists open instalments as `owed` rows shaped for `obligations_ledger` (read-only, nothing stored).

## Text figures and their basis

Anna 12 pence stated; club eighth stated (ch56 P036 "one-eighth of one soli is one and a half pennies") and standing practice ("standard of taking an eighth"); tip halfpenny stated. Glacis eight pence listed; Glacis and Joyce cut is the standing eighth, basis `listed`, **not confirmed per paragraph**. No Joyce referrer was checked; all three use Angelica. Epub chapter numbers here are offset from the repo's paragraph locators; locators above are the backlog's.

## Checks

| Check | Result |
| --- | --- |
| `tests/lotm_be_clients.test.js` | 5 pass (Anna +12 then -2, Glacis/Joyce, custom client, unregistered saved client, settle once across reload, unknown fee, grain) |
| `tests/lotm_pay.test.js` | 4 pass (pay once and in order, raise step, no invented week, staged commission, lead time, insufficient purse) |
| `tests/lotm_money_save.test.js` | pass: disposable live-source build, headless runner, facts written as the effects leave them survive validate, Save, Export, Import, reload, 2 steps, money 1000.5, 0 page errors. Effects themselves are NOT run natively here |
| `tests/lotm_be_seat.test.js`, `currency_subunits.test.js` | 31 pass with the above (36 total in one run) |
| `npm run build`, `npm run check:arch` | pass (dist restored, not committed) |
| `npm run check:rules` | FAIL, not from this change: WA1-WA53 register vs WA68 (same as the R2 receipt) |
| Full `npm test` | not run (pre-commit gate belongs to the committer) |

## Gaps (why below floor)

- No headless native `scripts/lotm_slice/` run: the KJ3AA rerun is ~51 minutes and needs the private proof bundle; no pack row yet uses the registry, settle, pay line or commission, and ch106+ has no slice window.
- **KJ3AA/KJ3AB private packs still say purse 799 and `book.lotm.kj3aa.purse.minus.two.pending`.** Settling that fact means a builder must emit `clientSettleEffects('anna')` (or hand-written -2 plus the owed fact) and regenerate kjw18/kjw19 start states at 797. Saves already past `tip` hold 799 with the pending fact: the settle gate (`owed` >= 0.5) lets them pay the 2 once if their `owed` fact is set, otherwise "fresh runs only".
- Reports/U4 display of `payView` is not wired; the exchange `cast_exchange_adapter` was not touched.
- Joyce/Glacis cut and referrer unverified per paragraph (above). `main.js`, `harm_engine.js` and ritual/divination files untouched.
