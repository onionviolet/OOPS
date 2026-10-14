# P09 market-life host joins (proposal, 2026-10-14)

Status: source module implemented; native gameplay implemented-unverified. P00
owns all shared joins. Desktop 1366×768: a known Village notice and an exact
purchase adjustment explanation beside the native trade total. Mobile deferred.
No new world, quest, timer, inventory item, ecology or offline catch-up.

## Authority and dependencies

Base `0216ccde`; preserve native chance/count/restock and Haggling/reputation,
accessory margin, saturation, stock conservation and custody. Existing UI work
in `d49cb911` / `379007d7` is retained, not repeated. Direction: PROJECT.md,
USER_VISION.md and LIFE_SIM_NORTH_STAR.md. Ecology is still a proposal under
EMERGENT_SYSTEMS.md; N18 stays parked.

Read-only live wave-1 source on 2026-10-14 exposes `PARCEL_STOPS`: elder in Village,
Eastern mill, then return receipt to old craftsman in Village. Successful final
`localLifeAction(...,'parcel')` changes `parcelStep` 2→3 and increments
`parcelRuns` with native eight-coin/Perception reward. That lane has not supplied
its completed report yet. Reconcile its final report before joins; do not treat
these live source observations as transferred ownership or native evidence.

The proposed extra consequence is commercial: returning the mill receipt clears
bread supply paperwork, granting a modest market bread service for that game day.
It does not invent bread in anyone's inventory or claim cargo was carried.
P00 must attach this explanation to the real accepted receipt and visible notice.
If the final relay no longer concerns the mill, leave this hook OPEN rather than
fabricating a supply cause.

## Exact APIs

Import from `src/absorb_p23/market_life/market_life.js`:

- `normalizeMarketLife(raw)` returns a detached schema-1 record. Only `undefined`
  means absent old-save state. Null, incomplete/malformed, unknown fields and
  unsupported schemas throw. Preflight this domain with the entire save before
  ANY native mutation. No migration, rewards, RNG or occurrence on load.
- `quoteMarketPurchase(raw, context, basket)` returns `nativeSubtotal`,
  `breadSubtotal`, `supplyDiscount`, `couponDiscount`, `total`, `useCoupon`,
  `supplyIndex`, `explanation`. Pure preview, no writes.
- `planMarketTrade(raw, context, event)` returns `{state,ok,quote,moneyDelta,
  earnedCoupons}`. `moneyDelta` is only a reduction of the native buy debit;
  never publish it as a free standalone reward. Replay/nonlocal plans have
  `ok:false`, zero money/reward and null quote.
- `planMarketDelivery(raw, context, receipt)` returns `{state,ok}`. No native
  inventory/money changes. Replays and nonlocal outcomes are no-ops.
- `marketLifeView(raw, context)` returns `{visible:false}` if unknown/nonlocal;
  otherwise title/notice, occurrence/index, favor and optional cue. No mutation.

`context = {worldId,location,alive,clock,calendarMinute,traderId,marketKnown,
 effectsEnabled}` uses native expansion played clock, `calendarMinutes` from
world_rhythm and actual current custody/location. Only base.frontier / Village
and `village trader` are eligible. Discovery must derive from the actual native
unlocked/encountered trader, never all hidden people/routes. Effects master off
sets effectsEnabled false, suppressing optional cue but retaining text/rules.

`basket = {buySubtotal,breadSubtotal,buyUnits,useCoupon}`. All numeric fields are
nonnegative safe integers; bread subtotal ≤ purchase subtotal, zero units iff
zero purchase value; useCoupon is boolean. Host derives them from native quoted
buy lines and exact native rounded prices, never caller-supplied money or counts.
Bread subtotal includes only actual `Stale bread` native item IDs, not labels or
sale lines. Coupon redemption is an explicit UI choice, default false.

`event = {...basket,index}`. Use the staged native trade's persistent monotonic
`expansionState.sequence + 1` occurrence (not clock, click count or fresh RNG).
The stored `tradeIndex` is a watermark. Include normalized market state, native
subtotal, bread subtotal and coupon choice in quote fingerprint/revalidation.
Recompute immediately before committing. An earning purchase cannot redeem the
coupon it earns. Native Haggling XP remains based on original native buy/sell
subtotals, as before. Do not change stock, margin or saturation formulas.

`receipt = {index,kind:'parcel_delivery',completed:true,clock}`. Bind index to
new `localLife.parcelRuns` only at the successful actual final handoff, clock to
its native played clock. Both step transition and +1 run must be verified before
planning. No delivery call on render/load, parcel acceptance, intermediate leg,
partial duty, existing restored history or calendar boundary. Supply is 0.95
for that native calendar day only, with no automatic catch-up or accumulating
missed supply. A later real completion can renew it without a lifetime cap.

## Atomic transaction / save join

Add optional top-level `p23_market_life`, with the exact detached schema-1 record.
Absent old saves default empty without importing historical purchase/parcel
counters. Persist this record with the native trade/relay transaction in the
existing save-first publication path. Failures publish neither ownership/money,
coupon consumption, purchased count nor delivery occurrence. Test denied save,
stale price/stock, changed actor/location, malformed import and repeated receipt.

For trade: plan at validated native preflight; native adjusted buy debit is
`quote.total`, native sell value remains exact. Coupon or supply adjustment can
never exceed the buy subtotal or fund a sell-only transaction. Preserve native
ownership transfers and saturation. The host must show the same explanation and
adjusted buy total in preview, acceptance and saved receipt. Receipt fingerprint
must bind both original and adjusted values. Avoid double application.

For relay: build the market plan using newly completed parcelRuns and actual
post-action context, include it in the SAME successful native save plan as the
relay reward and record. Native publication and notice refresh happen only after
that save. P00 resolves the final envelope integration with life-loops.

## Required integrated acceptance (OPEN)

Fresh rebuilt native origin, 1366×768: buy five native units, earn coupon, use
it on a later paid purchase; repeat with another real earning/redeeming event.
Play the mill relay through each leg; demonstrate receipt-caused notice and an
exact native bread basket reduction, expiry next game day, repeat relay renewal.
Keep native stock refresh/chance/count and reputation/skill discounts intact.
Effects-off has no cue; hidden trader has no notice or spoiler. Save/reload,
Export and literal-file Import must retain exact occurrences, counters and
supply index without reroll or reward replay. Verify old absent state and reject
malformed/unsupported optional data before any mutation. Source/fixture results
are not this gate. Coordinator must not final-merge until P00's integrated gate
passes; Weibao play/taste remains the authoritative human gate afterwards.
