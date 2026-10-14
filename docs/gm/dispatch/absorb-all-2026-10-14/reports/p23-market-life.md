# P09 visible market life, 2026-10-14

**Implemented-unverified: source module and contracts committed; native integration OPEN. Do not final-merge this lane as verified gameplay.**

## A1: Authority, reservation and scope

Clean starting worktree `absorb-all/p23-market-life`, HEAD `0216ccdefcfce79877378f8cb0ee41129fe11c5d`; node_modules already symlinked. Coordinator's current assignment explicitly reserves port 18828, also captured in runs/p23-market-life.log:15. No listener occupied it before this lane's isolated server. Read COMMON, AGENTS, PROJECT, USER_VISION, LIFE_SIM_NORTH_STAR, EMERGENT_SYSTEMS and current row owners. Reviewed pinned source at audit hash `a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`, relevant R1–R5 and Xeus24 reader notes. No source/mod code or assets copied. d49cb911/379007d7 UI features not repeated.

Target: 1366×768 desktop Village notice and exact trade explanation; mobile deferred. Feature numbers/fiction are original reversible proposals, not director-accepted decisions. No offline clock or full ecology.

## F1: Row dispositions

| Row | Disposition | Evidence / landing |
|---|---|---|
| R43 | native equivalent retained, source behavior verified | Unchanged TraderComponent stock chance/count, restock and markup; unchanged market_saturation sales/recovery. Two dependency-double tests execute actual native source bodies. Native trader gameplay regression still OPEN in integrated candidate. |
| R68 | implemented-unverified | Optional receipt-driven supply index (1 or 0.95) and exact bread basket explanation in market_life.js. No unexplained inflation or wall-clock credit. |
| N15 | implemented-unverified | Every five real purchased units earns another five-coin coupon; explicit later redemption, minimum one-coin buy debit. Deterministic reward, saved counts and trade watermark; no RNG/reroll or lifetime cap. |
| N18 | parked | No ecology code added. Trigger still requires bounded nonnegative zero prey/predator cases, nonreplayed boundaries and a world-authored gathering consumer. Dormant original offline_a does not run. |
| N20 | implemented-unverified | Known Village notice changes after completed mill relay receipt, with current service, expiry and repeat renewal. Existing errand remains life-loops-owned. |

## A2: Implementation and P00 join

Code commit `e9c9185de63f75f90d74ade2144f55d9aa0e4c4b`: src/absorb_p23/market_life/market_life.js, HOST_CONTRACT.md and tests/p23-market-life.test.js. No shared registrations or game/main/display/save edits. Native formulas unchanged. Module previews normalize detached state and publish no effects. Settlement uses persistent monotonic occurrence indexes; duplicate/older receipt yields no reward. Save absence defaults empty; malformed/null/incomplete/unsupported records reject before mutation. JSON roundtrip keeps event/coupon/index exactly, but this is NOT native save proof.

Exact signatures, native quote inputs/outputs, receipt preflight and atomic save requirements: [HOST_CONTRACT](/Users/weiwei/code/yair-absorb-all-20261014/p23-market-life/src/absorb_p23/market_life/HOST_CONTRACT.md). P00 must add optional `p23_market_life` envelope preflight/save/publication, bind native trade sequence and line-derived totals, explicit coupon choice, notice discovery/effects rendering, and real final relay custody outcome. Native quote fingerprint must bind original and adjusted totals plus normalized market state. Apply discount to native buy debit once, never mint money separately or alter sale proceeds/Haggling XP.

Read-only live life-loops source currently has elder → Eastern mill → old craftsman, final parcelStep 2→3 / parcelRuns +1. Its report and ownership transfer were absent at final inspection. Proposed commercial interpretation: accepted mill receipt clears bread supply paperwork, not invented carried cargo. P00 must reconcile final wave-1 report before joins; if that causal route changes, leave supply hook OPEN. No cross-edit or wait on wave-1 completion was performed.

## F2: Checks and evidence

- `npm run build`: PASS; compiler check and rebuilt native bundle. Module is unregistered and therefore not included in the native bundle. No dist committed.
- `node --test tests/p23-market-life*.test.js`: 10/10 PASS, 0 failures. Final focused.tap includes strict malformed-state/basket validation, duplicate receipt, two coupon earnings/use, exact price/expiry, JSON restore, known-only/Effects-off and actual unchanged native source formula tests with dependency doubles.
- `npm test`: 631 tests, 630 pass, 1 failure, 0 skipped/cancelled. `equipped native brace with an open road offer keeps ticking, travelling and reloading` in tests/alloy_equipment.test.js:118 failed when existing generate.mjs --equipped-clock child reached its 60-second timeout. This file and fixture are untouched. Isolated exact test rerun: 1/1 PASS (about 8.6 seconds). Contention is an inference; the full-suite run is still recorded as failing, not rewritten as a green gate.
- Fresh-origin headless installed Chrome via Playwright, 1366×768: baseline native opening / Save / reload / Export / literal-file Import PASS, Village restored, exact exported native stored envelope retained on literal import, zero page errors. Screenshot desktop-opening.png. This baseline compatibility test does not exercise the new native loop. The exported temporary test save was removed; user saves untouched.
- Browser source-module probe: two coupon events, delivery notice/index, exact discount explanation, JSON state equality and duplicate rejection PASS. Uncoupled module only. nativeSaveHasMarketLife is false as expected; changed-positive native save/import is OPEN.

Tested served bundle SHA-256: `598e02f54fe7db4c9a35bc79c75a754a7f8dc42eccf9fab828de8fd82e97b615`, equal to local rebuilt bytes. Evidence in [checks](/Users/weiwei/code/yair-absorb-all-20261014/p23-market-life/docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-market-life/): build.log, focused.tap, full.tap, alloy-isolated.tap, browser.cjs, browser.json, browser.log, desktop-opening.png. Initial bundled Playwright Chromium launch failed because that runtime browser is absent; switched once to installed Google Chrome headlessly, without installing packages or foreground control. A harness navigation race in the stronger exact-envelope check was corrected by awaiting the actual import reload; the final run passes.

## R1: Merge and acceptance

No native runtime file overlaps were edited. Main-checkout writes only own report/ledger; source evidence and implementation live in assigned worktree. P00 native_trade_transaction/main/trade/display/save joins may overlap life-loops registrations, requiring the final wave-1 ownership transfer and integrated review. All own source/contract state is available now; no push/merge by lane.

OPEN: P00 connected candidate, two naturally earned/redeemed coupons, real mill relay and cause/price notice, same-day expiry/renewal, unchanged native trader behavior, quote/save failure atomicity and changed-positive Save/reload/Export/literal-file Import with malformed old/new save controls. Integrated full suite must pass before final merge. After those technical gates, the one authoritative human acceptance gate is Weibao's play/taste.
